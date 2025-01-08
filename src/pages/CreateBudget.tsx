import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateBudget() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get month and year from location state or use current date
  const state = location.state as { month?: number; year?: number } | null;
  const defaultMonth = state?.month || new Date().getMonth() + 1;
  const defaultYear = state?.year || new Date().getFullYear();

  const saveBudget = async (budgetData: any) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("budgets")
        .upsert({
          user_id: user.id,
          month: parseInt(budgetData.month),
          year: parseInt(budgetData.year),
          ...budgetData,
        }, {
          onConflict: 'user_id,month,year'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget saved successfully",
      });

      // Navigate back to dashboard with the same month and year
      navigate("/", {
        state: {
          month: parseInt(budgetData.month),
          year: parseInt(budgetData.year)
        }
      });
    } catch (error: any) {
      console.error("Error saving budget:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    await saveBudget(values);
  };

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <BudgetForm onSubmit={handleSubmit} defaultMonth={defaultMonth} defaultYear={defaultYear} />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}