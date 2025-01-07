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
    
    // Debug: Log the first few lines
    console.log("First few lines:", text.split('\n').slice(0, 3));
    
    const rows = text.split('\n');
    const header = rows[0].split(','); // Changed from tab to comma
    const expectedColumns = 10;

    if (header.length !== expectedColumns) {
      throw new Error(`Invalid CSV format: Expected ${expectedColumns} columns but found ${header.length}`);
    }

    const parsedTransactions = rows
      .slice(1)
      .filter(row => row.trim())
      .map(row => {
        const values = row.split(','); // Changed from tab to comma
        return {
          type: values[0],
          product: values[1],
          startedDate: values[2],
          completedDate: values[3],
          description: values[4],
          amount: values[5],
          fee: values[6],
          currency: values[7],
          state: values[8],
          balance: values[9]
        };
      });

    setTransactions(parsedTransactions);
    
    // Log success
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
