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
    const header = rows[0].split(',');
    const expectedColumns = 10;

    if (header.length !== expectedColumns) {
      throw new Error(`Invalid CSV format: Expected ${expectedColumns} columns but found ${header.length}`);
    }

    const parsedTransactions = rows
      .slice(1)
      .filter(row => row.trim())
      .map(row => row.split(','))
      // Filter out non-COMPLETED transactions first
      .filter(values => values[8].trim() === 'COMPLETED')
      .map((values, index) => {
        try {
          // Parse the date
          const parsedDate = parse(
            values[3].trim(),
            'yyyy-MM-dd HH:mm:ss',
            new Date()
          );

          // Parse amount
          const amount = parseFloat(values[5].replace(/[^\d.-]/g, ''));

          return {
            type: values[0],
            product: values[1],
            startedDate: values[2],
            completedDate: parsedDate.toISOString(),
            description: values[4],
            amount: values[5],
            fee: values[6],
            currency: values[7],
            state: values[8],
            balance: values[9]
          };
        } catch (error) {
          console.error(`Error parsing row ${index + 1}:`, error);
          return null;
        }
      })
      .filter((transaction): transaction is RevolutTransaction => transaction !== null);

    setTransactions(parsedTransactions);
    
    // Get user ID for database insertion
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Failed to get user ID');
    }

    // Prepare transactions for database insertion
    const dbTransactions = parsedTransactions.map(t => ({
      date: t.completedDate,
      description: t.description,
      amount: parseFloat(t.amount.replace(/[^\d.-]/g, '')),
      currency: t.currency,
      category: null,
      profile_id: user.id
    }));

    // Insert into database
    const { error: insertError } = await supabase
      .from('revolut_transactions')
      .insert(dbTransactions);

    if (insertError) {
      throw insertError;
    }

    toast({
      title: "Success",
      description: `Successfully imported ${parsedTransactions.length} completed transactions`
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
