import { PiggyBank } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CATEGORIES } from "@/constants/budget";

interface ExpenseFieldsProps {
  form: UseFormReturn<any>;
}

export function ExpenseFields({ form }: ExpenseFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PiggyBank className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Monthly Expenses</h3>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {CATEGORIES.map((category) => (
          <FormField
            key={category.name}
            control={form.control}
            name={category.plannedKey as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{category.name}</FormLabel>
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