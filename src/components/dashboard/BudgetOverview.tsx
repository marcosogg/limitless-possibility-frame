import { DollarSign, PiggyBank, AlertCircle } from "lucide-react";

interface BudgetOverviewProps {
  monthlyIncome: number;
  plannedBudget: number;
  currentSpending: number;
}

export function BudgetOverview({ monthlyIncome, plannedBudget, currentSpending }: BudgetOverviewProps) {
  const isOverBudget = currentSpending > plannedBudget;

  return (
    <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-4">
      <h2 className="text-[17px] font-semibold text-[#1C1E21] mb-4">Budget Overview</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {/* Monthly Income Card */}
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="text-[13px] font-medium text-[#65676B]">Monthly Income</div>
          <div className="text-[20px] font-semibold text-[#1C1E21] mt-1">€{monthlyIncome.toFixed(2)}</div>
        </div>

        {/* Planned Budget Card */}
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="text-[13px] font-medium text-[#65676B]">Planned Budget</div>
          <div className="text-[20px] font-semibold text-[#1C1E21] mt-1">€{plannedBudget.toFixed(2)}</div>
        </div>

        {/* Current Spending Card */}
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="text-[13px] font-medium text-[#65676B]">Current Spending</div>
          <div className={`text-[20px] font-semibold mt-1 ${isOverBudget ? 'text-[#FA383E]' : 'text-[#1C1E21]'}`}>
            €{currentSpending.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
