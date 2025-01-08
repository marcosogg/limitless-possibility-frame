// src/components/budget/BudgetForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PiggyBank, Wallet } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/constants/budget";

const formSchema = z.object({
  month: z.string(),
  year: z.string(),
  salary: z.number(),
  bonus: z.number(),
  rent: z.number(),
  utilities: z.number(),
  groceries: z.number(),
  transport: z.number(),
  entertainment: z.number(),
  shopping: z.number(),
  miscellaneous: z.number(),
  savings: z.number(),
  dining_out: z.number(),
  health_fitness: z.number(),
  personal_care: z.number(),
  gifts_donations: z.number(),
  travel: z.number(),
  education: z.number(),
});

interface BudgetFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const getDefaultValues = () => {
  const defaultValues = {
    month: "1",
    year: "2025",
    salary: 2700,
    bonus: 0,
  };

  CATEGORIES.forEach((category) => {
    defaultValues[category.plannedKey] = 0;
  });

  return defaultValues;
};

export function BudgetForm({ onSubmit }: BudgetFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Monthly Budget</CardTitle>
        <CardDescription>
          Plan your monthly budget by setting income and expense targets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">May</SelectItem>
                        <SelectItem value="6">June</SelectItem>
                        <SelectItem value="7">July</SelectItem>
                        <SelectItem value="8">August</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" size="lg" onClick={form.handleSubmit(onSubmit)}>
          Save Budget
        </Button>
      </CardFooter>
    </Card>
  );
}
