import { AlertCircle } from "lucide-react";
import { CATEGORIES } from "@/constants/budget";
import type { Budget } from "@/types/budget";
import { formatCurrency } from "@/lib/utils";

type Category = typeof CATEGORIES[number];

interface OverBudgetWarningProps {
  budget: Budget;
  overspentCategories: Category[];
}

export function OverBudgetWarning({ budget, overspentCategories }: OverBudgetWarningProps) {
  return (
    <div className="bg-[#FFF3CD] text-[#664D03] p-4 rounded-lg text-[13px] border border-[#FFE69C]">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-5 w-5" />
        <p className="font-medium">Over Budget Warning</p>
      </div>
      <div className="space-y-2 ml-7">
        {overspentCategories.map((category) => {
          const spent = Number(budget[category.spentKey as keyof Budget]);
          const planned = Number(budget[category.plannedKey as keyof Budget]);
          const overAmount = spent - planned;
          
          return (
            <div key={category.name} className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              <p>
                You are over budget in {category.name} by €{overAmount.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
} 