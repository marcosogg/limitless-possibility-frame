import { Euro, PiggyBank, CreditCard } from "lucide-react";

interface BudgetOverviewProps {
  monthlyIncome: number;
  plannedBudget: number;
  currentSpending: number;
}

export function BudgetOverview({ monthlyIncome, plannedBudget, currentSpending }: BudgetOverviewProps) {
  const isOverBudget = currentSpending > plannedBudget;
  const availableBudget = plannedBudget - currentSpending;

  return (
    <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-4">
      <h2 className="text-[17px] font-semibold text-[#1C1E21] mb-4">Financial Summary</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {/* Monthly Income Card */}
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <Euro className="h-4 w-4 text-[#65676B]" />
            <div className="text-[13px] font-medium text-[#65676B]">Monthly Income</div>
          </div>
          <div className="text-[20px] font-semibold text-[#1C1E21]">€{monthlyIncome.toFixed(2)}</div>
        </div>

        {/* Planned Budget Card */}
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="h-4 w-4 text-[#65676B]" />
            <div className="text-[13px] font-medium text-[#65676B]">Planned Budget</div>
          </div>
          <div className="text-[20px] font-semibold text-[#1C1E21]">€{plannedBudget.toFixed(2)}</div>
        </div>

        {/* Current Spending Card */}
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-[#65676B]" />
            <div className="text-[13px] font-medium text-[#65676B]">Current Spending</div>
          </div>
          <div className={`text-[20px] font-semibold ${isOverBudget ? 'text-[#FA383E]' : 'text-[#1C1E21]'}`}>
            €{currentSpending.toFixed(2)}
          </div>
        </div>

        {/* Available Budget Card */}
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <Euro className="h-4 w-4 text-[#65676B]" />
            <div className="text-[13px] font-medium text-[#65676B]">Available to Spend</div>
          </div>
          <div className={`text-[20px] font-semibold ${availableBudget < 0 ? 'text-[#FA383E]' : 'text-[#1C1E21]'}`}>
            €{availableBudget.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
