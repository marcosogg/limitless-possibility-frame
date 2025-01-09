import { useState } from "react";
import { Budget } from "@/types/budget";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/constants/budget";

export function useBudgetUpdates(
  editedBudget: Budget,
  budgetId: string,
  setIsEditing: (value: boolean) => void,
  onUpdateSpent: (updatedBudget: Budget) => void
) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSpentChange = (spentKey: string, value: string) => {
    if (value !== "") {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid positive number.",
          variant: "destructive",
        });
        return;
      }
      const updatedBudget = {
        ...editedBudget,
        [spentKey]: numValue
      };
      onUpdateSpent(updatedBudget);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.fromEntries(
        CATEGORIES.map((cat) => [
          cat.spentKey,
          Number(editedBudget[cat.spentKey as keyof Budget]),
        ])
      );

      const { error } = await supabase
        .from("budgets")
        .update(updates)
        .eq("id", budgetId);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSpentChange,
    handleSave,
    isSaving,
  };
}