// src/pages/RevolutImport.tsx
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { parse } from "date-fns";
import { FileUploadZone } from "@/components/revolut-import/FileUploadZone";
import { TransactionsTable } from "@/components/revolut-import/TransactionsTable";
import { supabase } from "@/integrations/supabase/client";
import type { RevolutTransactionDB } from "@/types/revolut";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RevolutImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<RevolutTransactionDB[]>([]);
  const [previewTransactions, setPreviewTransactions] = useState<RevolutTransactionDB[]>([]);
  const { toast } = useToast();
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

  const isValidCSVFormat = (rows: string[]): boolean => {
    const header = rows[0].split(',');
    return header.length === 10;
  };

  const parseTransactions = (rows: string[], userId: string): RevolutTransactionDB[] => {
    return rows
      .slice(1)
      .filter(row => row.trim())
      .map(row => row.split(','))
      .filter(values => values[8].trim() === 'COMPLETED') // Filter by State
      .map(values => {
        try {
          const amount = parseFloat(values[5].replace(/[^\d.-]/g, ''));
          if (amount >= 0) return null; // Skip non-negative amounts

          return {
            date: parse(values[3].trim(), 'dd/MM/yyyy HH:mm:ss', new Date()).toISOString(),
            description: values[4].trim(),
            amount: amount,
            currency: values[7].trim(),
            category: categorizeTransaction(values[4].trim()),
            profile_id: userId
          };
        } catch (error) {
          console.error('Error processing row:', error);
          return null;
        }
      })
      .filter((t): t is RevolutTransactionDB => t !== null);
  };

  const filterDuplicates = async (transactions: RevolutTransactionDB[]): Promise<RevolutTransactionDB[]> => {
    const newTransactions: RevolutTransactionDB[] = [];
    let duplicateCount = 0;

    for (const transaction of transactions) {
      // Check if transaction exists in database
      const { data } = await supabase
        .from('revolut_transactions')
        .select('id')
        .eq('date', transaction.date)
        .eq('description', transaction.description)
        .eq('amount', transaction.amount)
        .single();

      if (!data) {
        newTransactions.push(transaction);
      } else {
        duplicateCount++;
        console.log('Skipping duplicate transaction:', {
          date: transaction.date,
          description: transaction.description,
          amount: transaction.amount
        });
      }
    }

    console.log('Total transactions processed:', transactions.length);
    console.log('New transactions:', newTransactions.length);
    console.log('Duplicate transactions:', duplicateCount);

    return newTransactions;
  };

  const handleError = (error: any) => {
    console.error('Error:', error);
    toast({
      title: "Error",
      description: error.message || "An error occurred while processing the file",
      variant: "destructive",
    });
  };

  // src/pages/RevolutImport.tsx

const processFile = async (file: File) => {
  setIsProcessing(true);
  try {
    const text = await file.text();
    console.log('Raw CSV first few rows:', 
      text.split('\n')
        .slice(0, 3)
        .map(row => row.trim())
    );
    const rows = text.split('\n');
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Process transactions
    const processedTransactions = rows
      .slice(1) // Skip header
      .filter(row => row.trim()) // Remove empty rows
      .map(row => {
        try {
          const values = row.split(',');
          
          // Only process COMPLETED transactions
          if (values[8].trim() !== 'COMPLETED') {
            return null;
          }

          // Parse the completed date (values[3])
          const dateStr = values[3].trim();
          let parsedDate: Date;

          try {
            // First, try parsing with date-fns
            parsedDate = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());
            
            // Validate the parsed date
            if (isNaN(parsedDate.getTime())) {
              // If first format fails, try alternative format
              parsedDate = parse(dateStr, 'dd/MM/yyyy HH:mm:ss', new Date());
            }

            // Final validation
            if (isNaN(parsedDate.getTime())) {
              console.error('Invalid date format:', dateStr);
              return null;
            }
          } catch (dateError) {
            console.error('Date parsing error:', dateError, 'for date string:', dateStr);
            return null;
          }

          // Parse amount
          const amount = parseFloat(values[5].replace(/[^\d.-]/g, ''));
          
          // Skip non-negative amounts
          if (amount >= 0) {
            return null;
          }

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
          console.error('Error processing row:', error, 'Row:', row);
          return null;
        }
      })
      .filter((t): t is RevolutTransactionDB => t !== null);

    console.log('Processed transactions:', processedTransactions.length);

    if (processedTransactions.length === 0) {
      toast({
        title: "No valid transactions",
        description: "No valid transactions were found in the file.",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    // Set preview
    setPreviewTransactions(processedTransactions);

    toast({
      title: "Preview Ready",
      description: `Found ${processedTransactions.length} transactions to import.`,
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


  const handleConfirmImport = async () => {
    setIsProcessing(true);
    try {
      const { error: insertError } = await supabase
        .from('revolut_transactions')
        .insert(previewTransactions);

      if (insertError) throw insertError;

      setPreviewTransactions([]); // Clear the preview
      await fetchTransactions(); // Refresh the transactions list

      toast({
        title: "Success",
        description: "Transactions imported successfully",
      });
    } catch (error: any) {
      console.error('Error importing transactions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import transactions",
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

      {/* Preview Table */}
      {previewTransactions.length > 0 && (
        <TransactionsTable transactions={previewTransactions} onConfirm={handleConfirmImport} />
      )}

      {/* Existing Transactions Table (only if not previewing) */}
      {previewTransactions.length === 0 && transactions.length > 0 && (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
