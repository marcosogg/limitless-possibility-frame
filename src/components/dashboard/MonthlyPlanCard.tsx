import { Budget } from "@/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES } from "@/constants/budget";
import { calculateTotalPlanned } from "@/utils/budgetCalculations";

interface MonthlyPlanCardProps {
  budget: Budget;
}

export function MonthlyPlanCard({ budget }: MonthlyPlanCardProps) {
  return (
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
                €{calculateTotalPlanned(budget).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 