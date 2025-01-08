import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { MonthYearFields } from "./form-fields/MonthYearFields";
import { IncomeFields } from "./form-fields/IncomeFields";
import { ExpenseFields } from "./form-fields/ExpenseFields";
import { CATEGORIES } from "@/constants/budget";
import { useState } from "react";

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
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const copyFromExistingBudget = async (sourceMonth: string, sourceYear: string) => {
    try {
      const { data: existingBudget, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', parseInt(sourceMonth))
        .eq('year', parseInt(sourceYear))
        .single();

      if (error) throw error;

      if (!existingBudget) {
        toast({
          title: "No budget found",
          description: `No budget found for ${sourceMonth}/${sourceYear}`,
          variant: "destructive",
        });
        return;
      }

      // Update form values with existing budget data
      form.setValue('salary', existingBudget.salary);
      form.setValue('bonus', existingBudget.bonus);

      CATEGORIES.forEach((category) => {
        form.setValue(category.plannedKey as any, existingBudget[category.plannedKey]);
      });

      setDialogOpen(false);
      toast({
        title: "Budget copied",
        description: `Budget from ${sourceMonth}/${sourceYear} has been copied`,
      });
    } catch (error) {
      console.error('Error copying budget:', error);
      toast({
        title: "Error",
        description: "Failed to copy budget data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Create Monthly Budget</CardTitle>
            <CardDescription>
              Plan your monthly budget by setting income and expense targets.
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy from Existing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Form {...form}>
                <DialogHeader>
                  <DialogTitle>Copy from Existing Budget</DialogTitle>
                  <DialogDescription>
                    Select the month and year to copy the budget from.
                  </DialogDescription>
                </DialogHeader>
                <MonthYearFields form={form} isCopyDialog={true} onCopySubmit={copyFromExistingBudget} />
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
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