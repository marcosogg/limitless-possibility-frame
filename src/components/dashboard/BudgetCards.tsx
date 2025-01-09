import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Budget } from "@/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/budget";
import { formatCurrency } from "@/lib/utils";
import { PlannedBudgetCard } from "./PlannedBudgetCard";
import { BudgetProgressItem } from "./BudgetProgressItem";
import { useToast } from "@/hooks/use-toast";
import { useBudgetSpentUpdate } from "@/hooks/useBudgetSpentUpdate";
import { useBudgetUpdates } from "@/hooks/useBudgetUpdates";

interface BudgetCardsProps {
  budget: Budget;
  onUpdateSpent: (updatedBudget: Budget) => void;
  selectedMonth: number;
  selectedYear: number;
}

export function BudgetCards({ budget, onUpdateSpent, selectedMonth, selectedYear }: BudgetCardsProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState<Budget>(budget);

  const { data: transactions, error, isLoading } = useQuery({
    queryKey: ['transactions', selectedMonth, selectedYear],
    queryFn: async () => {
      if (!selectedMonth || !selectedYear) {
        throw new Error('Month and year must be defined');
      }

      const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
      const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-31`;

      const { data, error } = await supabase
        .from('revolut_transactions')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedMonth && !!selectedYear,
  });

  // Pass all required parameters to the hook
  useBudgetSpentUpdate(transactions, budget, onUpdateSpent, selectedMonth, selectedYear);

  const { handleSpentChange, handleSave, isSaving } = useBudgetUpdates(
    editedBudget,
    budget.id,
    setIsEditing,
    onUpdateSpent
  );

  const calculateTotalSpent = (budget: Budget): number => {
    let totalSpent = 0;
    for (const key in budget) {
      if (key.endsWith('_spent')) {
        totalSpent += Number(budget[key as keyof Budget]);
      }
    }
    return totalSpent;
  };

  if (error) {
    return <div>Error loading transactions</div>;
  }

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

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
                onSpentChange={handleSpentChange}
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