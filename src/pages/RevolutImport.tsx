import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/revolut/FileUploadZone";
import TransactionsTable from "@/components/revolut/TransactionsTable";
import type { RevolutTransaction } from "@/types/revolut";
import { supabase } from "@/integrations/supabase/client";
import { parse } from "date-fns";

export default function RevolutImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<RevolutTransaction[]>([]);

  const parseDate = (dateStr: string) => {
    try {
      const parsedDate = parse(dateStr, "dd/MM/yyyy HH:mm", new Date());
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date");
      }
      return parsedDate.toISOString();
    } catch (error) {
      console.error("Error parsing date:", dateStr, error);
      throw new Error(`Invalid date format: ${dateStr}`);
    }
  };

  const parseAmount = (amountStr: string, rowIndex: number) => {
    if (!amountStr || typeof amountStr !== 'string') {
      throw new Error(`Invalid amount at line ${rowIndex}: ${amountStr}`);
    }
    // Remove any currency symbols and whitespace, keep negative signs and decimals
    const cleanedAmount = amountStr.trim().replace(/[^\d.-]/g, '');
    const parsedAmount = parseFloat(cleanedAmount);
    
    if (isNaN(parsedAmount)) {
      throw new Error(`Invalid amount format at line ${rowIndex}: ${amountStr}`);
    }
    
    return parsedAmount;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const rows = text.split('\n');
      
      if (rows.length < 2) {
        throw new Error("CSV file appears to be empty or missing data rows");
      }

      const header = rows[0].split('\t');
      const expectedColumns = 10;

      if (header.length !== expectedColumns) {
        throw new Error(`Invalid CSV format: Expected ${expectedColumns} columns but found ${header.length}`);
      }

      const parsedTransactions = rows.slice(1)
        .filter(row => row.trim())
        .map((row, index) => {
          const values = row.split('\t');
          
          if (values.length !== expectedColumns) {
            console.error(`Row ${index + 2} has incorrect number of columns:`, values);
            throw new Error(`Invalid row format at line ${index + 2}: Expected ${expectedColumns} columns but found ${values.length}`);
          }

          if (!values[2] || !values[3] || !values[4] || !values[5] || !values[7]) {
            throw new Error(`Missing required fields at line ${index + 2}`);
          }

          // Parse amount early to validate it
          const amount = parseAmount(values[5], index + 2);

          return {
            type: values[0] || '',
            product: values[1] || '',
            startedDate: parseDate(values[2]),
            completedDate: parseDate(values[3]),
            description: values[4] || '',
            amount: amount.toString(), // Store as string in the transaction object
            fee: values[6] || '',
            currency: values[7] || '',
            state: values[8] || '',
            balance: values[9] || '',
          };
        });

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from('revolut_transactions').insert(
        parsedTransactions.map(t => ({
          date: t.completedDate,
          description: t.description,
          amount: parseFloat(t.amount), // Already validated, safe to parse
          currency: t.currency,
          profile_id: user.user.id
        }))
      );

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      setTransactions(parsedTransactions);
      
      toast({
        title: "File processed",
        description: `Successfully processed ${parsedTransactions.length} transactions`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process the file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Import Revolut Statement</h1>
      <FileUploadZone isProcessing={isProcessing} onFileUpload={processFile} />
      {transactions.length > 0 && <TransactionsTable transactions={transactions} />}
    </div>
  );
}
