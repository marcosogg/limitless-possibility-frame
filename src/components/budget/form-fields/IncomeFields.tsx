import { Wallet } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface IncomeFieldsProps {
  form: UseFormReturn<any>;
}

export function IncomeFields({ form }: IncomeFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Monthly Income</h3>
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