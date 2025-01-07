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
  const expectedColumns = 10; // Define expected columns outside the loop

  try {
    const text = await file.text();
    const rows = text.split('\n');

    if (rows.length < 2) {
      throw new Error("CSV file appears to be empty or missing data rows");
    }

    const header = rows[0].split('\t');
    if (header.length !== expectedColumns) {
      throw new Error(`Invalid CSV format: Expected ${expectedColumns} columns but found ${header.length}`);
    }

    const parsedTransactions: RevolutTransaction[] = [];
    const errors: string[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row.trim()) continue; // Skip empty rows

      const values = row.split('\t');
      if (values.length !== expectedColumns) {
        console.error(`Row ${i + 1} has incorrect number of columns:`, values);
        errors.push(`Invalid row format at line ${i + 1}: Expected ${expectedColumns} columns but found ${values.length}`);
        continue;
      }

      if (!values[2] || !values[3] || !values[4] || !values[5] || !values[7]) {
        errors.push(`Missing required fields at line ${i + 1}`);
        continue;
      }

      try {
        const parsedDate = parse(values[3], "dd/MM/yyyy HH:mm", new Date());
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format");
        }
        const isoDate = parsedDate.toISOString();
        const amount = parseAmount(values[5]); // Use parseAmount here

        parsedTransactions.push({
          type: values[0] || '',
          product: values[1] || '',
          startedDate: values[2] || '', // Keep original started date
          completedDate: isoDate, // Use the parsed ISO date
          description: values[4] || '',
          amount: amount.toString(), // Keep as string for now, to be consistent with RevolutTransaction
          fee: values[6] || '',
          currency: values[7] || '',
          state: values[8] || '',
          balance: values[9] || '',
        });
      } catch (error: any) {
        console.error(`Error parsing line ${i + 1}:`, error.message);
        errors.push(`Error parsing line ${i + 1}: ${error.message}`);
      }
    }

    setTransactions(parsedTransactions);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Failed to get user ID');
    }

    const dbTransactions: RevolutTransactionDB[] = parsedTransactions.map(t => ({
      date: t.completedDate,
      description: t.description,
      amount: parseAmount(t.amount), // Parse to number for database
      currency: t.currency,
      category: null,
      profile_id: user.id
    }));

    const { error: insertError } = await supabase
      .from('revolut_transactions')
      .insert(dbTransactions);

    if (insertError) {
      throw insertError;
    }

    if (errors.length > 0) {
      toast({
        title: "Partial Success",
        description: `Successfully imported ${parsedTransactions.length - errors.length} transactions. ${errors.length} transactions were skipped due to errors.`,
        variant: "warning",
      });
    } else {
      toast({
        title: "Success",
        description: `Successfully imported ${parsedTransactions.length} transactions`,
      });
    }
  } catch (error: any) {
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
