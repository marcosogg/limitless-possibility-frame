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
    <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-6 hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-shadow duration-200">
      <h2 className="text-[20px] font-semibold text-[#1C1E21] mb-6">Budget Overview</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {/* Monthly Income Card */}
        <div className="bg-gradient-to-tr from-[#F7F8FA] to-white rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 border border-[#E4E6EB]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#E4E6EB] rounded-lg">
              <Euro className="h-5 w-5 text-[#1877F2]" />
            </div>
            <div className="text-[13px] font-medium text-[#65676B]">Monthly Income</div>
          </div>
          <div className="text-[24px] font-semibold text-[#1C1E21]">€{monthlyIncome.toFixed(2)}</div>
        </div>

        {/* Planned Budget Card */}
        <div className="bg-gradient-to-tr from-[#F7F8FA] to-white rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 border border-[#E4E6EB]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#E4E6EB] rounded-lg">
              <PiggyBank className="h-5 w-5 text-[#1877F2]" />
            </div>
            <div className="text-[13px] font-medium text-[#65676B]">Planned Budget</div>
          </div>
          <div className="text-[24px] font-semibold text-[#1C1E21]">€{plannedBudget.toFixed(2)}</div>
        </div>

        {/* Current Spending Card */}
        <div className="bg-gradient-to-tr from-[#F7F8FA] to-white rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 border border-[#E4E6EB]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#E4E6EB] rounded-lg">
              <CreditCard className="h-5 w-5 text-[#1877F2]" />
            </div>
            <div className="text-[13px] font-medium text-[#65676B]">Current Spending</div>
          </div>
          <div className={`text-[24px] font-semibold ${isOverBudget ? 'text-[#FA383E]' : 'text-[#1C1E21]'}`}>
            €{currentSpending.toFixed(2)}
          </div>
        </div>

        {/* Available Budget Card */}
        <div className="bg-gradient-to-tr from-[#F7F8FA] to-white rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 border border-[#E4E6EB]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#E4E6EB] rounded-lg">
              <Euro className="h-5 w-5 text-[#1877F2]" />
            </div>
            <div className="text-[13px] font-medium text-[#65676B]">Available to Spend</div>
          </div>
          <div className={`text-[24px] font-semibold ${availableBudget < 0 ? 'text-[#FA383E]' : 'text-[#1C1E21]'}`}>
            €{availableBudget.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}