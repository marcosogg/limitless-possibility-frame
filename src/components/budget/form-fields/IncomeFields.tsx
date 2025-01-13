import { Wallet } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface IncomeFieldsProps {
  form: UseFormReturn<any>;
}

export function IncomeFields({ form }: IncomeFieldsProps) {
  return (
    <div className="space-y-4 bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border-2 border-green-100 dark:border-green-900">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-50">Monthly Income</h3>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
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
        <FormField
          control={form.control}
          name="bonus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bonus</FormLabel>
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
      </div>
    </div>
  );
}