import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import MonthYearPicker from "@/components/MonthYearPicker";
import BudgetSummary from "@/components/BudgetSummary";

interface Budget {
  salary: number;
  bonus: number;
  rent: number;
  utilities: number;
  groceries: number;
  transport: number;
  entertainment: number;
  shopping: number;
  miscellaneous: number;
  savings: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const remaining = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Monthly Budget Overview</h1>
          <Button 
            onClick={() => navigate("/createbudget")}
            className="bg-white text-indigo-600 hover:bg-gray-100"
          >
            Create New Budget
          </Button>
        </div>

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
                remaining={remaining}
              />

              <Card className="bg-white/10 backdrop-blur-lg text-white">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Income</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Salary</span>
                          <span>{formatCurrency(budget.salary)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bonus</span>
                          <span>{formatCurrency(budget.bonus)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Expenses</h3>
                      <div className="space-y-2">
                        {[
                          ['Rent', budget.rent],
                          ['Utilities', budget.utilities],
                          ['Groceries', budget.groceries],
                          ['Transport', budget.transport],
                          ['Entertainment', budget.entertainment],
                          ['Shopping', budget.shopping],
                          ['Miscellaneous', budget.miscellaneous],
                          ['Savings', budget.savings],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between">
                            <span>{label}</span>
                            <span>{formatCurrency(value as number)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
};

export default Index;