import { Budget } from "@/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES } from "@/constants/budget";
import { formatCurrency } from "@/lib/utils";
import { calculatePercentage } from "@/utils/budgetCalculations";

interface BudgetCardsProps {
  budget: Budget;
  selectedMonth: number;
  selectedYear: number;
}

export function BudgetCards({ budget, selectedMonth, selectedYear }: BudgetCardsProps) {
  const calculateTotalSpent = (budget: Budget): number => {
    return CATEGORIES.reduce((total, category) => {
      return total + Number(budget[category.spentKey as keyof Budget] || 0);
    }, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <CardHeader className="p-4">
          <CardTitle className="text-[17px] font-semibold text-[#1C1E21]">Monthly Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {CATEGORIES.map(({ name, icon: Icon, plannedKey }) => (
              <div key={name} className="flex justify-between items-center p-2 hover:bg-[#F2F3F5] rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-[#65676B]" />
                  <span className="text-[13px] text-[#1C1E21]">{name}</span>
                </div>
                <span className="text-[13px] font-medium text-[#1C1E21]">
                  €{Number(budget[plannedKey as keyof Budget]).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-[#E4E6EB]">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#1C1E21]">Total Planned</span>
                <span className="text-[13px] font-semibold text-[#1C1E21]">
                  €{calculateTotalSpent(budget).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <CardHeader className="p-4">
          <CardTitle className="text-[17px] font-semibold text-[#1C1E21]">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {CATEGORIES.map(({ name, icon: Icon, plannedKey, spentKey }) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[#65676B]" />
                    <span className="text-[13px] text-[#1C1E21]">{name}</span>
                  </div>
                </div>
                <div className="h-2 bg-[#E4E6EB] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      Number(budget[spentKey as keyof Budget]) > Number(budget[plannedKey as keyof Budget])
                        ? "bg-[#FA383E]"
                        : "bg-[#1877F2]"
                    }`}
                    style={{
                      width: `${Math.min(
                        calculatePercentage(
                          Number(budget[spentKey as keyof Budget]),
                          Number(budget[plannedKey as keyof Budget])
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#65676B]">
                    €{Number(budget[spentKey as keyof Budget]).toFixed(2)} / €{Number(budget[plannedKey as keyof Budget]).toFixed(2)}
                  </span>
                  <span className={
                    Number(budget[spentKey as keyof Budget]) > Number(budget[plannedKey as keyof Budget])
                      ? "text-[#FA383E]"
                      : "text-[#42B72A]"
                  }>
                    {Number(budget[spentKey as keyof Budget]) > Number(budget[plannedKey as keyof Budget]) ? "+" : "-"}
                    €{Math.abs(Number(budget[plannedKey as keyof Budget]) - Number(budget[spentKey as keyof Budget])).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-[#E4E6EB]">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#1C1E21]">Total Spent</span>
                <span className="text-[13px] font-semibold text-[#1C1E21]">
                  €{calculateTotalSpent(budget).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}