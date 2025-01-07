import { DollarSign, PiggyBank, AlertCircle } from "lucide-react";

interface BudgetOverviewProps {
  monthlyIncome: number;
  plannedBudget: number;
  currentSpending: number;
}

export function BudgetOverview({ monthlyIncome, plannedBudget, currentSpending }: BudgetOverviewProps) {
  const isOverBudget = currentSpending > plannedBudget;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Budget Overview</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Monthly Income Card */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">Monthly Income</span>
          </div>
          <span className="text-2xl font-bold">€{monthlyIncome.toFixed(2)}</span>
        </div>

        {/* Planned Budget Card */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-700 mb-1">
            <PiggyBank className="w-4 h-4" />
            <span className="font-medium">Planned Budget</span>
          </div>
          <span className="text-2xl font-bold">{plannedBudget.toFixed(2)}</span>
        </div>

        {/* Current Spending Card */}
        <div className={`rounded-lg p-4 ${isOverBudget ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className={`flex items-center gap-2 mb-1 ${isOverBudget ? 'text-red-700' : 'text-green-700'}`}>
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Current Spending</span>
          </div>
          <span className="text-2xl font-bold">${currentSpending.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
