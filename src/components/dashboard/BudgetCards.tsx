import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Budget } from "@/types/budget";

interface BudgetCardsProps {
  budget: Budget;
  formatCurrency: (amount: number) => string;
}

export function BudgetCards({ budget, formatCurrency }: BudgetCardsProps) {
  const calculateProgress = (spent: number, total: number) => {
    if (total === 0) return 0;
    return Math.min((spent / total) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-white/10 backdrop-blur-lg text-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Income</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Salary</span>
                <span>{formatCurrency(budget.salary)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus</span>
                <span>{formatCurrency(budget.bonus)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-lg text-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Expenses</h3>
            <div className="space-y-4">
              {[
                ['Rent', budget.rent, budget.rent_spent],
                ['Utilities', budget.utilities, budget.utilities_spent],
                ['Groceries', budget.groceries, budget.groceries_spent],
                ['Transport', budget.transport, budget.transport_spent],
                ['Entertainment', budget.entertainment, budget.entertainment_spent],
                ['Shopping', budget.shopping, budget.shopping_spent],
                ['Miscellaneous', budget.miscellaneous, budget.miscellaneous_spent],
                ['Savings', budget.savings, budget.savings_spent],
              ].map(([label, budgeted, spent]) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{label}</span>
                    <div className="text-right">
                      <div>{formatCurrency(spent as number)} / {formatCurrency(budgeted as number)}</div>
                    </div>
                  </div>
                  <Progress 
                    value={calculateProgress(spent as number, budgeted as number)} 
                    className="h-2 bg-white/20"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}