import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileUploadZone } from "@/components/revolut-import/FileUploadZone";
import { TransactionsTable } from "@/components/revolut-import/TransactionsTable";
import { supabase } from "@/integrations/supabase/client";
import type { RevolutTransactionDB } from "@/types/revolut";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { processRevolutFile } from "@/utils/revolut/processRevolutFile";

export default function RevolutImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<RevolutTransactionDB[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const navigate = useNavigate();

  // Extract unique filenames from transaction descriptions
  const extractFilenames = (transactions: RevolutTransactionDB[]): string[] => {
    const fileNames = new Set<string>();
    transactions.forEach(transaction => {
      const match = transaction.description.match(/\(from file: (.+?)\)/);
      if (match && match[1]) {
        fileNames.add(match[1]);
      }
    });
    return Array.from(fileNames);
  };

  // Fetch existing transactions and extract filenames
  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view transactions",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('revolut_transactions')
        .select('*')
        .eq('profile_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const transactions = data as RevolutTransactionDB[];
      setTransactions(transactions);
      
      const filenames = extractFilenames(transactions);
      console.log("Existing files found:", filenames);
      setExistingFiles(filenames);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      const processedCount = await processRevolutFile(file);
      
      await fetchTransactions();

      toast({
        title: "Success",
        description: `Successfully imported ${processedCount} transactions`
      });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Import Revolut Statement</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
      </div>
      
      <FileUploadZone 
        isProcessing={isProcessing}
        onFileSelect={handleFileSelect}
        existingFiles={existingFiles}
      />

      {transactions.length > 0 && (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}