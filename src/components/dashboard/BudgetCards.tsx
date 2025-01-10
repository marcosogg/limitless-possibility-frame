import { useState } from "react";
import { Budget } from "@/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/constants/budget";
import { formatCurrency } from "@/lib/utils";
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

  const handleSpentChange = (categoryName: string, newValue: string) => {
    const spentKey = `${categoryName.toLowerCase().replace(/\s+/g, '_')}_spent`;
    const numericValue = newValue === '' ? 0 : parseFloat(newValue);
    if (!isNaN(numericValue)) {
      setEditedBudget(prev => ({
        ...prev,
        [spentKey]: numericValue
      }));
    }
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <CardHeader className="p-4">
          <CardTitle className="text-[17px] font-semibold text-[#1C1E21]">Monthly Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {CATEGORIES.map(({ name, icon: Icon, plannedKey }) => (
              <div key={name} className="flex justify-between items-center p-2 hover:bg-[#F2F3F5] rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-[#65676B]" />
                  <span className="text-[13px] text-[#1C1E21]">{name}</span>
                </div>
                <span className="text-[13px] font-medium text-[#1C1E21]">
                  €{budget[plannedKey as keyof Budget].toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-[#E4E6EB]">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#1C1E21]">Total Planned</span>
                <span className="text-[13px] font-semibold text-[#1C1E21]">
                  €{calculateTotalSpent(budget).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[17px] font-semibold text-[#1C1E21]">Current Status</CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                className="text-[#1877F2] border-[#1877F2] hover:bg-[#F2F3F5]"
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
                  className="text-[#1C1E21] hover:bg-[#F2F3F5]"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-[#1877F2] hover:brightness-95 text-white"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {CATEGORIES.map(({ name, icon: Icon, plannedKey, spentKey }) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[#65676B]" />
                    <span className="text-[13px] text-[#1C1E21]">{name}</span>
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedBudget[spentKey as keyof Budget]}
                      onChange={(e) => handleSpentChange(name, e.target.value)}
                      className="w-24 h-8 text-[13px] text-[#1C1E21]"
                      step="0.01"
                      min="0"
                    />
                  ) : (
                    <span className="text-[13px] font-medium text-[#1C1E21]">
                      €{editedBudget[spentKey as keyof Budget].toFixed(2)}
                    </span>
                  )}
                </div>
                {!isEditing && (
                  <>
                    <div className="h-2 bg-[#E4E6EB] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          Number(editedBudget[spentKey as keyof Budget]) > Number(editedBudget[plannedKey as keyof Budget])
                            ? "bg-[#FA383E]"
                            : "bg-[#1877F2]"
                        }`}
                        style={{
                          width: `${Math.min(
                            (Number(editedBudget[spentKey as keyof Budget]) / Number(editedBudget[plannedKey as keyof Budget])) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#65676B]">
                        €{editedBudget[spentKey as keyof Budget].toFixed(2)} / €{editedBudget[plannedKey as keyof Budget].toFixed(2)}
                      </span>
                      <span className={
                        Number(editedBudget[spentKey as keyof Budget]) > Number(editedBudget[plannedKey as keyof Budget])
                          ? "text-[#FA383E]"
                          : "text-[#42B72A]"
                      }>
                        {Number(editedBudget[spentKey as keyof Budget]) > Number(editedBudget[plannedKey as keyof Budget]) ? "+" : ""}
                        €{Math.abs(Number(editedBudget[plannedKey as keyof Budget]) - Number(editedBudget[spentKey as keyof Budget])).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-[#E4E6EB]">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#1C1E21]">Total Spent</span>
                <span className="text-[13px] font-semibold text-[#1C1E21]">
                  €{calculateTotalSpent(editedBudget).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}