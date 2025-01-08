// src/pages/RevolutImport.tsx
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { parse } from "date-fns";
import { FileUploadZone } from "@/components/revolut-import/FileUploadZone";
import { TransactionsTable } from "@/components/revolut-import/TransactionsTable";
import { supabase } from "@/integrations/supabase/client";
import type { RevolutTransaction, RevolutTransactionDB } from "@/types/revolut";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RevolutImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<RevolutTransactionDB[]>([]);
  const navigate = useNavigate();

  // Function to categorize transactions based on description patterns
  const categorizeTransaction = (description: string): string => {
    const patterns = {
      Groceries: [
        /tesco/i, /lidl/i, /aldi/i, /supervalu/i, /dunnes/i, /spar/i,
        /centra/i, /grocery/i, /food/i, /market/i
      ],
      Transportation: [
        /dublin bus/i, /irish rail/i, /leap/i, /taxi/i, /uber/i, /transport/i,
        /bus/i, /train/i, /luas/i, /dart/i
      ],
      Dining: [
        /restaurant/i, /cafe/i, /coffee/i, /takeaway/i, /food delivery/i,
        /just eat/i, /deliveroo/i, /mcdonalds/i, /burger/i
      ],
      Shopping: [
        /amazon/i, /shop/i, /store/i, /retail/i, /clothing/i, /fashion/i,
        /penneys/i, /primark/i, /tk maxx/i, /zara/i, /h&m/i
      ],
      Entertainment: [
        /cinema/i, /movie/i, /theatre/i, /concert/i, /spotify/i, /netflix/i,
        /disney/i, /entertainment/i, /game/i
      ],
      Transfers: [
        /transfer/i, /sent/i, /received/i, /payment/i, /revolut/i
      ],
      "Top-ups": [
        /top.?up/i, /topup/i, /added money/i, /loaded/i
      ],
      Services: [
        /service/i, /subscription/i, /membership/i, /fee/i
      ],
      Bills: [
        /bill/i, /utility/i, /electric/i, /gas/i, /water/i, /phone/i,
        /mobile/i, /broadband/i, /internet/i, /rent/i
      ]
    };

    for (const [category, patternList] of Object.entries(patterns)) {
      if (patternList.some(pattern => pattern.test(description))) {
        return category;
      }
    }

    return "Other";
  };

  // Fetch existing transactions
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
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  // Call fetchTransactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

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

      // Get user ID for database insertion
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Failed to get user ID');
      }

      // Process and filter transactions
      const processedTransactions = rows
        .slice(1)
        .filter(row => row.trim())
        .map(row => row.split(','))
        .filter(values => values[8].trim() === 'COMPLETED')
        .map((values) => {
          try {
            const parsedDate = parse(
              values[3].trim(),
              'yyyy-MM-dd HH:mm:ss',
              new Date()
            );

            const amount = parseFloat(values[5].replace(/[^\d.-]/g, ''));
            const description = values[4].trim();
            const category = categorizeTransaction(description);

            return {
              date: parsedDate.toISOString(),
              description: description,
              amount: amount,
              currency: values[7].trim(),
              category: category,
              profile_id: user.id
            };
          } catch (error) {
            console.error('Error processing row:', error);
            return null;
          }
        })
        .filter((t): t is RevolutTransactionDB => t !== null);

      // Insert into database
      const { error: insertError } = await supabase
        .from('revolut_transactions')
        .insert(processedTransactions);

      if (insertError) {
        throw insertError;
      }

      // Refresh the transactions list
      await fetchTransactions();

      toast({
        title: "Success",
        description: `Successfully imported ${processedTransactions.length} transactions`
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
        onFileSelect={processFile}
      />

      {transactions.length > 0 && (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
