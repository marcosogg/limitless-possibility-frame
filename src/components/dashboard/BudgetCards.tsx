import { useState } from "react";
import { Budget } from "@/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/budget";
import { formatCurrency } from "@/lib/utils";
import { PlannedBudgetCard } from "./PlannedBudgetCard";
import { BudgetProgressItem } from "./BudgetProgressItem";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BudgetCardsProps {
  budget: Budget;
  onUpdateSpent: (updatedBudget: Budget) => void;
}

export function BudgetCards({ budget, onUpdateSpent }: BudgetCardsProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState<Budget>(budget);
  const [isSaving, setIsSaving] = useState(false);

  const handleSpentChange = (categoryName: string, newValue: number) => {
    const spentKey = `${categoryName.toLowerCase().replace(/\s+/g, '_')}_spent`;
    setEditedBudget(prev => ({
      ...prev,
      [spentKey]: newValue
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Create an object with only the spent fields
      const updates = Object.fromEntries(
        CATEGORIES.map((cat) => [
          cat.spentKey,
          editedBudget[cat.spentKey as keyof Budget]
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
        description: "Expenses updated successfully",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to update expenses",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedBudget(budget);
    setIsEditing(false);
  };

  const calculateTotalSpent = (budget: Budget): number => {
    return CATEGORIES.reduce((total, category) => {
      return total + Number(budget[category.spentKey as keyof Budget] || 0);
    }, 0);
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
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  disabled={isSaving}
                >
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
                spent={Number(editedBudget[spentKey as keyof Budget] || 0)}
                planned={Number(editedBudget[plannedKey as keyof Budget] || 0)}
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