// src/components/dashboard/PlannedBudgetCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES } from "@/constants/budget";
import { Budget } from "@/types/budget";
import { formatCurrency } from "@/lib/utils";
import { calculateTotalPlanned } from "@/utils/budgetCalculations";

interface PlannedBudgetCardProps {
  budget: Budget;
}

export function PlannedBudgetCard({ budget }: PlannedBudgetCardProps) {
  return (
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
            <span className="text-sm font-medium">
              {formatCurrency(Number(budget[plannedKey as keyof Budget]))}
            </span>
          </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Planned</span>
              <span className="font-semibold">{formatCurrency(calculateTotalPlanned(budget))}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
