// src/components/dashboard/BudgetProgressItem.tsx
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { calculatePercentage } from "@/utils/budgetCalculations";

interface BudgetProgressItemProps {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  spent: number;
  planned: number;
  isEditing: boolean;
  onSpentChange: (value: number) => void;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onSpentChange(0);
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1000000) {
      onSpentChange(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    
    e.preventDefault();
    const step = 10;
    const currentValue = spent || 0;
    
    if (e.key === 'ArrowUp') {
      const newValue = currentValue + step;
      if (newValue <= 1000000) {
        onSpentChange(newValue);
      }
    } else {
      const newValue = Math.max(0, currentValue - step);
      onSpentChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <span className="text-sm text-gray-700">{name}</span>
        </div>
        {isEditing ? (
          <input
            type="number"
            min="0"
            max="1000000"
            value={spent}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="h-10 w-32 rounded-md border px-3 py-2 text-right text-sm bg-white"
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
              ({isOverspent ? "+" : ""}{formatCurrency(Math.abs(remaining))})
            </span>
          </div>
        </>
      )}
    </div>
  );
}
