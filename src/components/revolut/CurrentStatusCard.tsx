import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES } from '@/constants/budget';
import { RevolutMonthSelector } from './RevolutMonthSelector';
import { SimpleTransaction, RevolutTransactionDB } from '@/types/revolut';
import { sumMonthlySpending, calculatePercentage } from '@/utils/budgetCalculations';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { processMonthlyTransactions } from '@/utils/revolutProcessor';
import { Progress } from "@/components/ui/progress";
import type { Budget } from "@/types/budget";

interface RevolutAnalysisProps {
  onTotalChange?: (total: number) => void;
}

export const RevolutAnalysis = ({ onTotalChange }: RevolutAnalysisProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<SimpleTransaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = async (date: Date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error: fetchError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", date.getMonth() + 1)
        .eq("year", date.getFullYear())
        .maybeSingle();

      if (fetchError) throw fetchError;
      setBudget(data);
    } catch (err) {
      console.error('Error loading budget:', err);
      setError('Failed to load budget');
    }
  };

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
        uploadDate: new Date(t.created_at)
      }));

      // Filter transactions for selected month and remove duplicates
      const processedTransactions = processMonthlyTransactions(simpleTransactions, date);
      setTransactions(processedTransactions);
      
      // Fetch budget for the selected month
      await fetchBudget(date);
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
  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  useEffect(() => {
    onTotalChange?.(totalSpent);
  }, [totalSpent, onTotalChange]);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Current Status
          </CardTitle>
          <RevolutMonthSelector 
            selectedDate={selectedDate}
            onMonthChange={(date) => {
              setSelectedDate(date);
              handleMonthChange(date);
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 p-4 rounded-md bg-red-50 mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {CATEGORIES.map((category) => {
              const spent = categoryTotals[category.name] || 0;
              const planned = budget ? Number(budget[category.plannedKey as keyof Budget] || 0) : 0;
              const percentage = calculatePercentage(spent, planned);
              const remaining = planned - spent;
              
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(spent)} / {formatCurrency(planned)}
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-end">
                    <span className={`text-sm ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {remaining < 0 ? '' : '+'}{formatCurrency(remaining)}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="mt-8 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Total</span>
                <div className="text-sm text-gray-600">
                  {formatCurrency(Object.values(categoryTotals).reduce((a, b) => a + b, 0))} / {
                    formatCurrency(CATEGORIES.reduce((total, category) => 
                      total + Number(budget?.[category.plannedKey as keyof Budget] || 0), 0
                    ))
                  }
                </div>
              </div>
              <Progress 
                value={calculatePercentage(
                  Object.values(categoryTotals).reduce((a, b) => a + b, 0),
                  CATEGORIES.reduce((total, category) => 
                    total + Number(budget?.[category.plannedKey as keyof Budget] || 0), 0
                  )
                )} 
                className="h-2" 
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 