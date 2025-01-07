import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BudgetConfirmDialog } from "@/components/budget/BudgetConfirmDialog";
import { IncomeSection } from "@/components/budget/IncomeSection";
import { ExpensesSection } from "@/components/budget/ExpensesSection";
import { MonthYearSelector } from "@/components/budget/MonthYearSelector";

export default function CreateBudget() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingBudgetData, setPendingBudgetData] = useState<any>(null);

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
            Object.entries(budgetData).map(([key, value]) => [key, parseFloat(value) || 0])
          ),
        }, {
          onConflict: 'user_id,month,year',
          ignoreDuplicates: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget saved successfully",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error saving budget:", error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if a budget already exists for this month/year
      const { data: existingBudget, error: checkError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", formData.month)
        .eq("year", formData.year)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingBudget) {
        // If budget exists, show confirmation dialog
        setPendingBudgetData(formData);
        setShowConfirmDialog(true);
      } else {
        // If no budget exists, save directly
        await saveBudget(formData);
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
              <MonthYearSelector />
              <IncomeSection />
              <ExpensesSection />
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Save Budget
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <BudgetConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmOverwrite}
        />
      </div>
    </div>
  );
}