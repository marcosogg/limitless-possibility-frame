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
    
    // Debug: Log the raw text
    console.log("Raw file content:", text);
    
    const rows = text.split('\n');
    
    // Debug: Log the first row (header)
    console.log("First row:", rows[0]);
    
    // Debug: Log how the first row splits by tab
    console.log("First row split by tab:", rows[0].split('\t'));
    
    // Debug: Log the number of rows
    console.log("Number of rows:", rows.length);
    
    // If we have at least one data row, let's look at it
    if (rows.length > 1) {
      console.log("First data row:", rows[1]);
      console.log("First data row split by tab:", rows[1].split('\t'));
    }

    // Stop here for now
    throw new Error("Debug stop");

  } catch (error) {
    console.error('Error processing file:', error);
    toast({
      title: "Error",
      description: error.message,
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
