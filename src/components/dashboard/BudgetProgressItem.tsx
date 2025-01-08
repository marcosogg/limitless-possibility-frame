// src/components/dashboard/BudgetProgressItem.tsx
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { calculatePercentage } from "@/utils/budgetCalculations";

interface BudgetProgressItemProps {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  spent: number;
  planned: number;
  isEditing: boolean;
  onSpentChange?: (spentKey: string, value: string) => void;
}

export function BudgetProgressItem({
  name,
  Icon,
  spent,
  planned,
  isEditing,
  onSpentChange,
}: BudgetProgressItemProps) {
  const percentage = calculatePercentage(spent, planned);
  const remaining = planned - spent;
  const isOverspent = spent > planned;
  const formattedRemaining = formatCurrency(Math.abs(remaining));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <span className="text-sm text-gray-700">{name}</span>
        </div>
        {isEditing ? (
          <Input
            type="number"
            value={spent}
            onChange={(e) => onSpentChange?.(name.toLowerCase().replace(/\s+/g, '_') + '_spent', e.target.value)}
            className="w-32 text-right"
            aria-label={`Enter spent amount for ${name}`}
          />
        ) : (
          <span className="text-sm font-medium">{formatCurrency(spent)}</span>
        )}
      </div>
      {!isEditing && (
        <>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isOverspent ? "bg-red-500" : "bg-purple-500"
              )}
              style={{
                width: `${Math.min(percentage, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {formatCurrency(spent)} / {formatCurrency(planned)}
            </span>
            <span className={cn(
              "font-medium",
              isOverspent ? "text-red-600" : "text-green-600"
            )}>
              ({isOverspent ? "+" : ""}{formattedRemaining})
            </span>
          </div>
        </>
      )}
    </div>
  );
}
