import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MonthYearSelector } from "@/components/budget/MonthYearSelector";
import { IncomeSection } from "@/components/budget/IncomeSection";
import { ExpensesSection } from "@/components/budget/ExpensesSection";
import { BudgetConfirmDialog } from "@/components/budget/BudgetConfirmDialog";

const CreateBudget = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const [pendingBudgetData, setPendingBudgetData] = useState<Record<string, string> | null>(null);
  const [formData, setFormData] = useState({
    salary: "0",
    bonus: "0",
    rent: "0",
    utilities: "0",
    groceries: "0",
    transport: "0",
    entertainment: "0",
    shopping: "0",
    miscellaneous: "0",
    savings: "0",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!/^\d*\.?\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveBudget = async (budgetData: Record<string, string>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a budget",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("budgets")
        .upsert({
          month: selectedMonth,
          year: selectedYear,
          user_id: user.id,
          ...Object.fromEntries(
            Object.entries(budgetData).map(([key, value]) => [key, parseFloat(value) || 0])
          ),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget saved successfully!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a budget",
          variant: "destructive",
        });
        return;
      }

      // Check if a budget already exists
      const { data: existingBudget } = await supabase
        .from("budgets")
        .select()
        .eq('user_id', user.id)
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .single();

      if (existingBudget) {
        setPendingBudgetData(formData);
        setShowOverwriteDialog(true);
        return;
      }

      await saveBudget(formData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOverwriteConfirm = async () => {
    if (pendingBudgetData) {
      await saveBudget(pendingBudgetData);
    }
    setShowOverwriteDialog(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Create Monthly Budget</h1>
          <p className="text-muted-foreground">Select a month and enter your budget details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <MonthYearSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          <div className="space-y-6">
            <IncomeSection formData={formData} onInputChange={handleInputChange} />
            <ExpensesSection formData={formData} onInputChange={handleInputChange} />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit">Save Budget</Button>
          </div>
        </form>

        <BudgetConfirmDialog
          open={showOverwriteDialog}
          onOpenChange={setShowOverwriteDialog}
          onConfirm={handleOverwriteConfirm}
          month={selectedMonth}
          year={selectedYear}
        />
      </div>
    </div>
  );
};

export default CreateBudget;