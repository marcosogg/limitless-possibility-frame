import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home, Zap, ShoppingCart, Car, Tv, ShoppingBag, MoreHorizontal, PiggyBank } from "lucide-react";
import type { Budget } from "@/types/budget";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/constants/budget";
import { formatCurrency } from "@/lib/utils";

interface BudgetCardsProps {
  budget: Budget;
  onUpdateSpent: (updatedBudget: Budget) => void;
}

// Utility function to calculate the percentage spent
const calculatePercentage = (spent: number, planned: number): number => {
  if (planned === 0) return spent > 0 ? 100 : 0;
  return spent > planned ? 100 : (spent / planned) * 100;
};

export function BudgetCards({ budget, onUpdateSpent }: BudgetCardsProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState(budget);
  const [isSaving, setIsSaving] = useState(false);

  // Update editedBudget when the budget prop changes
  useEffect(() => {
    setEditedBudget(budget);
  }, [budget]);

  const calculateTotalPlanned = () => {
    return CATEGORIES.reduce((acc, cat) => acc + budget[cat.plannedKey as keyof Budget], 0);
  };

  const calculateTotalSpent = () => {
    return CATEGORIES.reduce((acc, cat) => acc + budget[cat.spentKey as keyof Budget], 0);
  };

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
    setEditedBudget(prev => ({
      ...prev,
      [`${category.toLowerCase()}_spent`]: numValue
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.fromEntries(
        CATEGORIES.map(cat => [cat.spentKey, editedBudget[cat.spentKey as keyof Budget]])
      );

      const { error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', budget.id);

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
      {/* Planned Budget Card */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Monthly Plan</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {CATEGORIES.map(({ name, icon: Icon, plannedKey }) => (
              <div key={name} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span className="text-sm text-gray-700">{name}</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(budget[plannedKey as keyof Budget])}</span>
              </div>
            ))}
            {/* Total Planned */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Planned</span>
                <span className="font-semibold">{formatCurrency(calculateTotalPlanned())}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spent Budget Card */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-800">Current Status</CardTitle>
            {/* Edit/Cancel/Save Buttons */}
            {!isEditing ? (
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100" onClick={() => setIsEditing(true)}>
                Update Expenses
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setIsEditing(false);
                  setEditedBudget(budget); // Reset to original values
                }}>
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
            {CATEGORIES.map(({ name, icon: Icon, plannedKey, spentKey }) => {
              const spent = editedBudget[spentKey as keyof Budget];
              const planned = editedBudget[plannedKey as keyof Budget];
              const percentage = calculatePercentage(spent, planned);
              const remaining = planned - spent;
              const isOverspent = spent > planned;
              const formattedRemaining = formatCurrency(Math.abs(remaining));

              return (
                <div key={name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                      <span className="text-sm text-gray-700">{name}</span>
                    </div>
                    {/* Input for Editing */}
                    {isEditing ? (
                      <Input
                        type="number"
                        value={spent}
                        onChange={(e) => handleSpentChange(name, e.target.value)}
                        className="w-32 text-right"
                        aria-label={`Enter spent amount for ${name}`}
                      />
                    ) : (
                      <span className="text-sm font-medium">{formatCurrency(spent)}</span>
                    )}
                  </div>
                  {/* Progress Bar and Numeric Display */}
                  {!isEditing && (
                    <>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            isOverspent ? "bg-red-500" : "bg-purple-500"
                          )}
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          {formatCurrency(spent)} / {formatCurrency(planned)}
                        </span>
                        <span className={cn(
                          "font-medium",
                          isOverspent ? "text-red-600" : "text-green-600"
                        )}>
                          ({isOverspent ? "+" : ""}{formattedRemaining})
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            {/* Total Spent */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Spent</span>
                <span className="font-semibold">{formatCurrency(calculateTotalSpent())}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
