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
    "dining_out",
    "health_pharmacy",
    "fitness",
    "personal_care",
    "travel",
    "education",
    "takeaway_coffee",
    "pubs_bars",
    "clothing_apparel",
    "home_hardware",
    "online_services_subscriptions",
    "money_transfer",
    "delivery_takeaway"
  ] as const; // Added as const for type safety

  const formatDisplayName = (field: string): string => {
    // Special cases for better formatting
    const specialCases: Record<string, string> = {
      'pubs_bars': 'Pubs & Bars',
      'health_pharmacy': 'Health & Pharmacy',
      'clothing_apparel': 'Clothing & Apparel',
      'home_hardware': 'Home & Hardware',
      'online_services_subscriptions': 'Online Services & Subscriptions',
      'dining_out': 'Dining Out',
      'takeaway_coffee': 'Takeaway Coffee',
      'money_transfer': 'Money Transfer',
      'delivery_takeaway': 'Delivery & Takeaway'
    };

    return specialCases[field] || 
      field
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Expenses</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {expenseCategories.map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>
              {formatDisplayName(field)}
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
