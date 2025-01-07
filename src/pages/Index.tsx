import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import MonthYearPicker from "@/components/MonthYearPicker";
import BudgetSummary from "@/components/BudgetSummary";
import { BillRemindersCard } from "@/components/BillRemindersCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BudgetCards } from "@/components/dashboard/BudgetCards";

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", selectedMonth)
        .eq("year", selectedYear)
        .maybeSingle();

      if (error) throw error;
      setBudget(data);
    } catch (error) {
      console.error("Error fetching budget:", error);
      toast({
        title: "Error",
        description: "Failed to fetch budget data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth, selectedYear]);

  const calculateTotalIncome = () => {
    if (!budget) return 0;
    return budget.salary + budget.bonus;
  };

  const calculateTotalExpenses = () => {
    if (!budget) return 0;
    return (
      budget.rent +
      budget.utilities +
      budget.groceries +
      budget.transport +
      budget.entertainment +
      budget.shopping +
      budget.miscellaneous +
      budget.savings
    );
  };

  const calculateTotalSpent = () => {
    if (!budget) return 0;
    return (
      budget.rent_spent +
      budget.utilities_spent +
      budget.groceries_spent +
      budget.transport_spent +
      budget.entertainment_spent +
      budget.shopping_spent +
      budget.miscellaneous_spent +
      budget.savings_spent
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const totalSpent = calculateTotalSpent();
  const remaining = totalIncome - totalSpent;

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <div className="space-y-8">
          <MonthYearPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : budget ? (
            <>
              <BudgetSummary
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                totalSpent={totalSpent}
                remaining={remaining}
              />

              <BudgetCards budget={budget} formatCurrency={formatCurrency} />
              <BillRemindersCard />
            </>
          ) : (
            <Card className="bg-white/10 backdrop-blur-lg text-white">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg mb-4">No budget found for this month</p>
                <Button 
                  onClick={() => navigate("/createbudget")}
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Create Budget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
