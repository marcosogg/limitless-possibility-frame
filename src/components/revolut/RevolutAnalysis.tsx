import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES } from '@/constants/budget';
import { RevolutMonthSelector } from './RevolutMonthSelector';
import { SimpleTransaction, RevolutTransactionDB } from '@/types/revolut';
import { sumMonthlySpending } from '@/utils/budgetCalculations';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { processMonthlyTransactions } from '@/utils/revolutProcessor';

export const RevolutAnalysis = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<SimpleTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMonthChange = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch transactions from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error: fetchError } = await supabase
        .from('revolut_transactions')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      // Convert to SimpleTransaction format and process
      const simpleTransactions: SimpleTransaction[] = (data as RevolutTransactionDB[]).map(t => ({
        date: new Date(t.date),
        amount: t.amount,
        description: t.description,
        category: t.category || 'Uncategorized',
        uploadDate: new Date() // Using current date as upload date since it's not critical for analysis
      }));

      // Filter transactions for selected month and remove duplicates
      const processedTransactions = processMonthlyTransactions(simpleTransactions, date);
      setTransactions(processedTransactions);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial transactions for current month
  useEffect(() => {
    handleMonthChange(selectedDate);
  }, []);

  const categoryTotals = sumMonthlySpending(transactions);

  return (
    <div className="space-y-4">
      <RevolutMonthSelector 
        selectedDate={selectedDate}
        onMonthChange={(date) => {
          setSelectedDate(date);
          handleMonthChange(date);
        }}
      />

      {error && (
        <div className="text-red-500 p-4 rounded-md bg-red-50">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => {
            const spent = categoryTotals[category.name] || 0;
            return (
              <Card key={category.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(spent)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}; 