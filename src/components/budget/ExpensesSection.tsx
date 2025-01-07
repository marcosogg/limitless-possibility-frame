import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ExpensesSectionProps {
  formData: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ExpensesSection({ formData, onInputChange }: ExpensesSectionProps) {
  const expenseCategories = [
    "rent",
    "utilities",
    "groceries",
    "transport",
    "entertainment",
    "shopping",
    "miscellaneous",
    "savings",
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Expenses</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {expenseCategories.map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="capitalize">
              {field}
            </Label>
            <Input
              id={field}
              name={field}
              type="text"
              value={formData[field]}
              onChange={onInputChange}
              placeholder="0.00"
            />
          </div>
        ))}
      </div>
    </div>
  );
}