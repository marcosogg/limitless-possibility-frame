import { useState, useEffect } from "react";
import { Loader2, Plus, Bell, FileInput } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import MonthYearPicker from "@/components/MonthYearPicker";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { BillRemindersCard } from "@/components/BillRemindersCard";
import { OverBudgetWarning } from "@/components/dashboard/OverBudgetWarning";
import { CurrentStatusCard } from "@/components/revolut/CurrentStatusCard";
import { MonthlyPlanCard } from "@/components/dashboard/MonthlyPlanCard";
import { CATEGORIES } from "@/constants/budget";
import type { Budget } from "@/types/budget";
import { formatCurrency } from "@/lib/utils";

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSpending, setCurrentSpending] = useState(0);
  
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

      if (data) {
        // Initialize all category spent values with defaults
        const budgetWithDefaults: Budget = {
          ...data,
          ...Object.fromEntries(
            CATEGORIES.map(category => [
              category.spentKey,
              data[category.spentKey as keyof typeof data] || 0
            ])
          )
        };
        setBudget(budgetWithDefaults);
      } else {
        setBudget(null);
      }
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

  const navigateToCreateBudget = () => {
    navigate("/create-budget", {
      state: { month: selectedMonth, year: selectedYear }
    });
  };

  const navigateToEditBudget = () => {
    navigate("/create-budget", {
      state: { month: selectedMonth, year: selectedYear, budget }
    });
  };

  const handleManageBillReminders = () => {
    navigate("/billreminders");
  };

  const handleImportStatement = () => {
    navigate("/revolut-import");
  };

  const overspentCategories = budget
    ? CATEGORIES.filter(cat => budget[cat.spentKey as keyof Budget] > budget[cat.plannedKey as keyof Budget])
    : [];
  const isOverBudget = overspentCategories.length > 0;

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8">
      <div className="max-w-[1095px] mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[20px] font-semibold text-[#1C1E21]">Monthly Budget Overview</h1>
          {budget && (
            <Button
              onClick={navigateToEditBudget}
              variant="outline"
              className="gap-2"
            >
              Edit Budget
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <MonthYearPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#1877F2]" />
          </div>
        ) : budget ? (
          <div className="space-y-4">
            <BudgetOverview
              monthlyIncome={Number(budget.salary) + Number(budget.bonus)}
              plannedBudget={calculateTotalPlanned()}
              currentSpending={currentSpending}
            />
            {isOverBudget && (
              <OverBudgetWarning
                budget={budget}
                overspentCategories={overspentCategories}
              />
            )}
            <div className="space-y-4">
              {/* <MonthlyPlanCard budget={budget} /> */}
              <CurrentStatusCard 
                onTotalChange={setCurrentSpending} 
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </div>
          </div>
        ) : (
          <Card className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-[15px] text-[#65676B] mb-4">No budget found for this month</p>
              <Button
                onClick={navigateToCreateBudget}
                className="bg-[#1877F2] hover:brightness-95 text-white"
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