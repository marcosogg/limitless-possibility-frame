import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import type { Budget } from "@/types/budget";

export default function Dashboard() {
  const { toast } = useToast();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSpending, setCurrentSpending] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const calculateTotalPlannedBudget = (budget: Budget | null): number => {
    if (!budget) return 0;
    return (
      budget.rent +
      budget.utilities +
      budget.groceries +
      budget.transport +
      budget.entertainment +
      budget.shopping +
      budget.miscellaneous +
      budget.savings +
      budget.dining_out +
      budget.health_pharmacy +
      budget.fitness +
      budget.personal_care +
      budget.travel +
      budget.education +
      budget.takeaway_coffee +
      budget.pubs_bars
    );
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view budgets",
          variant: "destructive",
        });
        return;
      }

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();

      if (budgetError) throw budgetError;

      const { data: spendingData, error: spendingError } = await supabase
        .from('revolut_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
        .lt('date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`);

      if (spendingError) throw spendingError;

      setBudget(budgetData);
      setTotalIncome(budgetData?.salary + (budgetData?.bonus || 0) || 0);
      setCurrentSpending(
        spendingData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0
      );
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast({
        title: "Error",
        description: "Failed to fetch budget data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-8">
        <FinancialSummary
          totalIncome={totalIncome}
          plannedBudget={calculateTotalPlannedBudget(budget)}
          totalSpending={currentSpending}
        />
        
        {/* Placeholder for future components */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-muted rounded-lg p-6">Monthly Plan (Coming Soon)</div>
          <div className="bg-muted rounded-lg p-6">Bill Reminders (Coming Soon)</div>
        </div>
      </div>
    </div>
  );
} 