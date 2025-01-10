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

      if (data) {
        // Ensure all required spent fields are initialized
        const budgetWithDefaults: Budget = {
          ...data,
          takeaway_coffee_spent: data.takeaway_coffee_spent || 0,
          uncategorized_spent: data.uncategorized_spent || 0,
          pubs_bars_spent: data.pubs_bars_spent || 0,
          clothing_apparel_spent: data.clothing_apparel_spent || 0,
          home_hardware_spent: data.home_hardware_spent || 0,
          travel_transportation_spent: data.travel_transportation_spent || 0,
          online_services_subscriptions_spent: data.online_services_subscriptions_spent || 0,
          other_retail_spent: data.other_retail_spent || 0,
          money_transfer_spent: data.money_transfer_spent || 0,
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
          <div className="flex gap-2">
            <Button 
              onClick={navigateToCreateBudget}
              className="bg-[#1877F2] hover:brightness-95 text-white"
            >
              Create New Budget
            </Button>
            <Button 
              onClick={handleManageBillReminders}
              className="bg-[#1877F2] hover:brightness-95 text-white"
            >
              Manage Bill Reminders
            </Button>
            <Button 
              onClick={handleImportStatement}
              className="bg-[#1877F2] hover:brightness-95 text-white"
            >
              Import Revolut Statement
            </Button>
          </div>
        </div>

        <MonthYearPicker
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#1877F2]" />
          </div>
        ) : budget ? (
          <div className="space-y-4">
            <BudgetOverview
              monthlyIncome={Number(budget.salary) + Number(budget.bonus)}
              plannedBudget={calculateTotalPlanned()}
              currentSpending={calculateTotalSpent()}
            />
            {isOverBudget && (
              <div className="flex items-center gap-3 bg-[#FFF3CD] text-[#664D03] p-3 rounded-lg text-[13px] border border-[#FFE69C]">
                <AlertCircle className="h-5 w-5" />
                <p>
                  You are over budget in {overspentCategories.length} categories: {overspentCategories.map(cat => cat.name).join(', ')}
                </p>
              </div>
            )}
            <BudgetCards
              budget={budget}
              onUpdateSpent={handleUpdateSpent}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
            <BillRemindersCard />
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