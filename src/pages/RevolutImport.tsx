import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { parse } from "date-fns";
import { FileUploadZone } from "@/components/revolut-import/FileUploadZone";
import { TransactionsTable } from "@/components/revolut-import/TransactionsTable";
import { supabase } from "@/integrations/supabase/client";
import type { RevolutTransaction, RevolutTransactionDB } from "@/types/revolut";

export default function RevolutImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<RevolutTransaction[]>([]);

  const parseAmount = (amountStr: string): number => {
    // Remove all characters except digits, minus sign, and decimal point
    const cleanedStr = amountStr.replace(/[^\d.-]/g, '');
    return parseFloat(cleanedStr);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const rows = text.split('\n');
      
      // Remove header row and parse remaining rows
      const header = rows[0].split('\t');
      const parsedTransactions = rows.slice(1)
      .filter(row => row.trim()) // Skip empty rows
      .map((row, index) => {
        const values = row.split('\t');

        if (values.length !== expectedColumns) {
          console.error(`Row ${index + 2} has incorrect number of columns:`, values);
          throw new Error(`Invalid row format at line ${index + 2}: Expected ${expectedColumns} columns but found ${values.length}`);
        }

        if (!values[2] || !values[3] || !values[4] || !values[5] || !values[7]) {
          throw new Error(`Missing required fields at line ${index + 2}`);
        }

        // *** DATE PARSING WITH LOGGING ***
        console.log("Raw date string:", values[3]); // LOG THE RAW DATE STRING
        let parsedDate;
        try {
          parsedDate = parse(values[3], "dd/MM/yyyy HH:mm", new Date());
          console.log("Parsed date:", parsedDate); // LOG THE PARSED DATE OBJECT
          if (isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date format");
          }
        } catch (error) {
          console.error(`Error parsing date at line ${index + 2}:`, values[3], error);
          toast({
            title: "Error",
            description: `Failed to parse date at line ${index + 2}: ${values[3]}`,
            variant: "destructive",
          });
          return null; // Skip this row
        }
        const isoDate = parsedDate.toISOString();
        console.log("ISO date string:", isoDate); // LOG THE ISO DATE STRING
        // *** END OF DATE PARSING ***
          return {
            type: values[0] || '',
            product: values[1] || '',
            startedDate: values[2] || '',
            completedDate: values[3] || '',
            description: values[4] || '',
            amount: values[5] || '',
            fee: values[6] || '',
            currency: values[7] || '',
            state: values[8] || '',
            balance: values[9] || '',
          };
        });

      setTransactions(parsedTransactions);
      
      // Get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Failed to get user ID');
      }

      // Prepare transactions for database insertion
      const dbTransactions: RevolutTransactionDB[] = parsedTransactions.map(t => {
        try {
          const parsedDate = parse(t.completedDate, 'dd/MM/yyyy HH:mm', new Date());
          
          return {
            date: parsedDate.toISOString(),
            description: t.description,
            amount: parseAmount(t.amount),
            currency: t.currency,
            category: null,
            profile_id: user.id
          };
        } catch (error) {
          console.error('Error parsing transaction:', error);
          throw error;
        }
      });

      // Insert transactions into the database
      const { error: insertError } = await supabase
        .from('revolut_transactions')
        .insert(dbTransactions);

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Success",
        description: `Successfully imported ${parsedTransactions.length} transactions`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process the file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Import Revolut Statement</h1>
      
      <FileUploadZone 
        isProcessing={isProcessing}
        onFileSelect={processFile}
      />

      {transactions.length > 0 && (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
