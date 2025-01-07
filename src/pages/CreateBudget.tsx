// src/pages/CreateBudget.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BudgetForm } from "@/components/budget/BudgetForm";
import type { Budget } from "@/types/budget";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateBudget() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

      navigate("/");
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
            <BudgetForm onSubmit={handleSubmit} />
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
