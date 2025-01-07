import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/revolut/FileUploadZone";
import TransactionsTable from "@/components/revolut/TransactionsTable";
import type { RevolutTransaction } from "@/types/revolut";
import { supabase } from "@/integrations/supabase/client";

export default function RevolutImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<RevolutTransaction[]>([]);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const rows = text.split('\n');
      
      // Remove header row and parse remaining rows
      const header = rows[0].split(',');
      const parsedTransactions = rows.slice(1)
        .filter(row => row.trim()) // Skip empty rows
        .map(row => {
          const values = row.split(',');
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

      // Store transactions in Supabase
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from('revolut_transactions').insert(
        parsedTransactions.map(t => ({
          date: new Date(t.completedDate).toISOString(),
          description: t.description,
          amount: parseFloat(t.amount),
          currency: t.currency,
          profile_id: user.user.id
        }))
      );

      if (error) {
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
      <FileUploadZone isProcessing={isProcessing} onFileUpload={processFile} />
      {transactions.length > 0 && <TransactionsTable transactions={transactions} />}
    </div>
  );
}