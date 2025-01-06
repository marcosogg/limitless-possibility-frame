import { Card, CardContent } from "@/components/ui/card";

interface Budget {
  salary: number;
  bonus: number;
  rent: number;
  utilities: number;
  groceries: number;
  transport: number;
  entertainment: number;
  shopping: number;
  miscellaneous: number;
  savings: number;
}

interface BudgetCardsProps {
  budget: Budget;
  formatCurrency: (amount: number) => string;
}

export function BudgetCards({ budget, formatCurrency }: BudgetCardsProps) {
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
            <div className="space-y-2">
              {[
                ['Rent', budget.rent],
                ['Utilities', budget.utilities],
                ['Groceries', budget.groceries],
                ['Transport', budget.transport],
                ['Entertainment', budget.entertainment],
                ['Shopping', budget.shopping],
                ['Miscellaneous', budget.miscellaneous],
                ['Savings', budget.savings],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span>{label}</span>
                  <span>{formatCurrency(value as number)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}