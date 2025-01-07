// src/components/BudgetSummary.tsx
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Gift } from "lucide-react";
import { formatCurrency } from "@/lib/utils"; // Import the formatCurrency function

interface BudgetSummaryProps {
  totalIncome: number;
  salary: number;
  bonus: number;
}

const BudgetSummary = ({ totalIncome, salary, bonus }: BudgetSummaryProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Monthly Income</h2>
          <p className="text-sm text-gray-500">Your income for this month</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="text-lg font-semibold">{formatCurrency(salary)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Gift className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bonus</p>
                <p className="text-lg font-semibold">{formatCurrency(bonus)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
