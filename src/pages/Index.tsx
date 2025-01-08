import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import MonthYearPicker from "@/components/MonthYearPicker";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { BillRemindersCard } from "@/components/BillRemindersCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BudgetCards } from "@/components/dashboard/BudgetCards";
import { CATEGORIES } from "@/constants/budget";
import type { Budget } from "@/types/budget";
import { formatCurrency } from "@/lib/utils";

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize with state from location or current date
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const state = location.state as { month?: number, year?: number } | null;
    return state?.month || new Date().getMonth() + 1;
  });
  
  const [selectedYear, setSelectedYear] = useState(() => {
    const state = location.state as { month?: number, year?: number } | null;
    return state?.year || new Date().getFullYear();
  });

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

  const calculateTotalPlanned = () => {
    if (!budget) return 0;
    return CATEGORIES.reduce((acc, cat) => acc + Number(budget[cat.plannedKey as keyof Budget]), 0);
  };

  const calculateTotalSpent = () => {
    if (!budget) return 0;
    return CATEGORIES.reduce((acc, cat) => acc + Number(budget[cat.spentKey as keyof Budget]), 0);
  };

  const handleUpdateSpent = (updatedBudget: Budget) => {
    setBudget(updatedBudget);
  };

  const navigateToCreateBudget = () => {
    navigate("/createbudget", {
      state: { month: selectedMonth, year: selectedYear }
    });
  };

  const overspentCategories = budget
    ? CATEGORIES.filter(cat => budget[cat.spentKey as keyof Budget] > budget[cat.plannedKey as keyof Budget])
    : [];
  const isOverBudget = overspentCategories.length > 0;

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />

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
          <div className="space-y-6">
            <BudgetOverview
              monthlyIncome={Number(budget.salary) + Number(budget.bonus)}
              plannedBudget={calculateTotalPlanned()}
              currentSpending={calculateTotalSpent()}
            />
            {isOverBudget && (
              <Card className="bg-red-100 border-red-500 text-red-800 shadow-sm">
                <CardContent className="p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="font-semibold text-sm">
                    You are over budget in {overspentCategories.length} categories: {overspentCategories.map(cat => cat.name).join(', ')}
                  </p>
                </CardContent>
              </Card>
            )}
            <BudgetCards
              budget={budget}
              onUpdateSpent={handleUpdateSpent}
            />
            <BillRemindersCard />
          </div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-lg text-white">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg mb-4">No budget found for this month</p>
              <Button
                onClick={navigateToCreateBudget}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                Create Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}