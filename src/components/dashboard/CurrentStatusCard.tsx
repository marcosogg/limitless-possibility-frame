import { Budget } from "@/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/budget";
import { BudgetProgressItem } from "./BudgetProgressItem";
import { formatCurrency } from "@/lib/utils";

interface CurrentStatusCardProps {
  budget: Budget;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleSave: () => void;
  isSaving: boolean;
  handleSpentChange: (spentKey: string, value: string) => void;
}

export function CurrentStatusCard({
  budget,
  isEditing,
  setIsEditing,
  handleSave,
  isSaving,
  handleSpentChange,
}: CurrentStatusCardProps) {
  const calculateTotalSpent = (budget: Budget): number => {
    let totalSpent = 0;
    for (const key in budget) {
      if (key.endsWith('_spent')) {
        totalSpent += Number(budget[key as keyof Budget]);
      }
    }
    return totalSpent;
  };

  return (
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
                onClick={() => setIsEditing(false)}
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
              spent={Number(budget[spentKey as keyof Budget] || 0)}
              planned={Number(budget[plannedKey as keyof Budget] || 0)}
              isEditing={isEditing}
              onSpentChange={(value: number) => handleSpentChange(spentKey, value.toString())}
            />
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Spent</span>
              <span className="font-semibold">
                {formatCurrency(calculateTotalSpent(budget))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}