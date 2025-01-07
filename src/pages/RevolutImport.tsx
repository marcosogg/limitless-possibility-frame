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
      .map((row, index) => {
        const values = row.split(',');
        
        // Debug: Log the date string we're trying to parse
        console.log(`Row ${index + 1} completed date:`, values[3]);
        
        try {
          // Parse the date using the correct format
          const parsedDate = parse(
            values[3].trim(),
            'yyyy-MM-dd HH:mm:ss',
            new Date()
          );

          // Verify the parsed date is valid
          if (isNaN(parsedDate.getTime())) {
            console.error(`Invalid date at row ${index + 1}:`, values[3]);
            return null;
          }

          return {
            type: values[0],
            product: values[1],
            startedDate: values[2],
            completedDate: parsedDate.toISOString(), // Convert to ISO string
            description: values[4],
            amount: values[5],
            fee: values[6],
            currency: values[7],
            state: values[8],
            balance: values[9]
          };
        } catch (error) {
          console.error(`Error parsing date at row ${index + 1}:`, error);
          return null;
        }
      })
      .filter((transaction): transaction is RevolutTransaction => transaction !== null);

    setTransactions(parsedTransactions);
    console.log("Successfully parsed transactions:", parsedTransactions.length);

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
