import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BudgetConfirmDialog } from "@/components/budget/BudgetConfirmDialog";
import { IncomeSection } from "@/components/budget/IncomeSection";
import { ExpensesSection } from "@/components/budget/ExpensesSection";
import { MonthYearSelector } from "@/components/budget/MonthYearSelector";
import type { Budget } from "@/types/budget";

export default function CreateBudget() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingBudgetData, setPendingBudgetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    salary: "",
    bonus: "",
    rent: "",
    utilities: "",
    groceries: "",
    transport: "",
    entertainment: "",
    shopping: "",
    miscellaneous: "",
    savings: "",
  });

  // Fetch existing budget when month/year changes
  useEffect(() => {
    const fetchExistingBudget = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: budget, error } = await supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user.id)
          .eq("month", selectedMonth)
          .eq("year", selectedYear)
          .maybeSingle();

        if (error) throw error;

        if (budget) {
          // Convert numeric values to strings for form inputs
          setFormData({
            salary: budget.salary.toString(),
            bonus: budget.bonus.toString(),
            rent: budget.rent.toString(),
            utilities: budget.utilities.toString(),
            groceries: budget.groceries.toString(),
            transport: budget.transport.toString(),
            entertainment: budget.entertainment.toString(),
            shopping: budget.shopping.toString(),
            miscellaneous: budget.miscellaneous.toString(),
            savings: budget.savings.toString(),
          });
        } else {
          // Reset form if no budget exists
          setFormData({
            salary: "",
            bonus: "",
            rent: "",
            utilities: "",
            groceries: "",
            transport: "",
            entertainment: "",
            shopping: "",
            miscellaneous: "",
            savings: "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching budget:", error);
        toast({
          title: "Error",
          description: "Failed to load existing budget",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingBudget();
  }, [selectedMonth, selectedYear, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveBudget = async (budgetData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("budgets")
        .upsert({
          user_id: user.id,
          month: budgetData.month,
          year: budgetData.year,
          ...Object.fromEntries(
            Object.entries(budgetData).map(([key, value]) => [
              key, 
              typeof value === 'string' ? parseFloat(value) || 0 : value
            ])
          ),
        }, {
          onConflict: 'user_id,month,year'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget saved successfully",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error saving budget:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const budgetData = {
      ...formData,
      month: selectedMonth,
      year: selectedYear,
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if a budget already exists for this month/year
      const { data: existingBudget, error: checkError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", selectedMonth)
        .eq("year", selectedYear)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingBudget) {
        // If budget exists, show confirmation dialog
        setPendingBudgetData(budgetData);
        setShowConfirmDialog(true);
      } else {
        // If no budget exists, save directly
        await saveBudget(budgetData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleConfirmOverwrite = async () => {
    if (pendingBudgetData) {
      try {
        await saveBudget(pendingBudgetData);
        setShowConfirmDialog(false);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <MonthYearSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
              <IncomeSection
                formData={formData}
                onInputChange={handleInputChange}
              />
              <ExpensesSection
                formData={formData}
                onInputChange={handleInputChange}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Save Budget"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <BudgetConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmOverwrite}
          month={selectedMonth}
          year={selectedYear}
        />
      </div>
    </div>
  );
}