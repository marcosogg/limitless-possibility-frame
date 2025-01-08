import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { MonthYearFields } from "./form-fields/MonthYearFields";
import { IncomeFields } from "./form-fields/IncomeFields";
import { ExpenseFields } from "./form-fields/ExpenseFields";

const formSchema = z.object({
  month: z.string(),
  year: z.string(),
  salary: z.coerce.number(),
  bonus: z.coerce.number(),
  rent: z.coerce.number(),
  utilities: z.coerce.number(),
  groceries: z.coerce.number(),
  transport: z.coerce.number(),
  entertainment: z.coerce.number(),
  shopping: z.coerce.number(),
  miscellaneous: z.coerce.number(),
  savings: z.coerce.number(),
  dining_out: z.coerce.number(),
  health_fitness: z.coerce.number(),
  personal_care: z.coerce.number(),
  gifts_donations: z.coerce.number(),
  travel: z.coerce.number(),
  education: z.coerce.number(),
});

interface BudgetFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultMonth?: number;
  defaultYear?: number;
}

const getDefaultValues = (defaultMonth?: number, defaultYear?: number) => {
  const defaultValues = {
    month: defaultMonth?.toString() || "1",
    year: defaultYear?.toString() || new Date().getFullYear().toString(),
    salary: 2700,
    bonus: 0,
  };

  CATEGORIES.forEach((category) => {
    defaultValues[category.plannedKey] = 0;
  });

  return defaultValues;
};

export function BudgetForm({ onSubmit, defaultMonth, defaultYear }: BudgetFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(defaultMonth, defaultYear),
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
            <MonthYearFields form={form} />
            <IncomeFields form={form} />
            <ExpenseFields form={form} />
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