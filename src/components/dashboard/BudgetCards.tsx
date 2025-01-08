// src/components/dashboard/BudgetCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Budget } from "@/types/budget";
import { CATEGORIES } from "@/constants/budget";
import { formatCurrency } from "@/lib/utils";
import { PlannedBudgetCard } from "./PlannedBudgetCard";
import { BudgetProgressItem } from "./BudgetProgressItem";
import { calculateTotalSpent } from "@/utils/budgetCalculations";

interface BudgetCardsProps {
  budget: Budget;
  onUpdateSpent: (updatedBudget: Budget) => void;
}

export function BudgetCards({ budget, onUpdateSpent }: BudgetCardsProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState<Budget>(budget);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedBudget(budget);
  }, [budget]);

  const handleSpentChange = (category: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }
    setEditedBudget((prev) => ({
      ...prev,
      [`${category.toLowerCase()}_spent`]: numValue,
    }));
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
        .eq("id", budget.id);

      if (error) throw error;

      onUpdateSpent(editedBudget);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PlannedBudgetCard budget={budget} />

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Current Status
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                onClick={() => setIsEditing(true)}
              >
                Update Expenses
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedBudget(budget);
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {CATEGORIES.map(({ name, icon: Icon, plannedKey, spentKey }) => (
              <BudgetProgressItem
                key={name}
                name={name}
                Icon={Icon}
                spent={Number(editedBudget[spentKey as keyof Budget])}
                planned={Number(editedBudget[plannedKey as keyof Budget])}
                isEditing={isEditing}
                onSpentChange={(value) => handleSpentChange(name, value)}
              />
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Spent</span>
                <span className="font-semibold">
                  {formatCurrency(calculateTotalSpent(editedBudget))}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
