import { Vault } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface SavingsFieldsProps {
  form: UseFormReturn<any>;
}

export function SavingsFields({ form }: SavingsFieldsProps) {
  return (
    <div className="space-y-4 bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border-2 border-blue-100 dark:border-blue-900">
      <div className="flex items-center gap-2">
        <Vault className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-50">Monthly Savings Target</h3>
      </div>
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="savings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Savings Goal</FormLabel>
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