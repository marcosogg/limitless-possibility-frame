import { Receipt } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CATEGORIES } from "@/constants/budget";

interface ExpenseFieldsProps {
  form: UseFormReturn<any>;
}

export function ExpenseFields({ form }: ExpenseFieldsProps) {
  const expenseCategories = CATEGORIES.filter(category => category.name !== 'Savings');

  return (
    <div className="space-y-4 bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border-2 border-red-100 dark:border-red-900">
      <div className="flex items-center gap-2">
        <Receipt className="w-5 h-5 text-red-600 dark:text-red-400" />
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-50">Monthly Expenses</h3>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {expenseCategories.map((category) => (
          <FormField
            key={category.name}
            control={form.control}
            name={category.plannedKey as any}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <category.icon className="w-4 h-4 text-muted-foreground" />
                  <FormLabel>{category.name}</FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                    <Input {...field} type="number" className="pl-7" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
