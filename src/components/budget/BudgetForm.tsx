import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Budget } from "@/types/budget";

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
import { SavingsFields } from "./form-fields/SavingsFields";
import { CATEGORIES } from "@/constants/budget";
import { useState } from "react";

export const formSchema = z.object({
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
  health_pharmacy: z.coerce.number(),
  fitness: z.coerce.number(),
  personal_care: z.coerce.number(),
  travel: z.coerce.number(),
  education: z.coerce.number(),
  takeaway_coffee: z.coerce.number(),
  pubs_bars: z.coerce.number(),
  clothing_apparel: z.coerce.number(),
  home_hardware: z.coerce.number(),
  online_services_subscriptions: z.coerce.number(),
  money_transfer: z.coerce.number(),
  delivery_takeaway: z.coerce.number(),
});

interface BudgetFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultMonth?: number;
  defaultYear?: number;
  initialValues?: Budget;
  mode?: 'create' | 'edit';
}

const getDefaultValues = (defaultMonth?: number, defaultYear?: number, initialValues?: Budget) => {
  if (initialValues) {
    return {
      month: initialValues.month.toString(),
      year: initialValues.year.toString(),
      salary: initialValues.salary,
      bonus: initialValues.bonus,
      rent: initialValues.rent,
      utilities: initialValues.utilities,
      groceries: initialValues.groceries,
      transport: initialValues.transport,
      entertainment: initialValues.entertainment,
      shopping: initialValues.shopping,
      miscellaneous: initialValues.miscellaneous,
      savings: initialValues.savings,
      dining_out: initialValues.dining_out,
      health_pharmacy: initialValues.health_pharmacy,
      fitness: initialValues.fitness,
      personal_care: initialValues.personal_care,
      travel: initialValues.travel,
      education: initialValues.education,
      takeaway_coffee: initialValues.takeaway_coffee,
      pubs_bars: initialValues.pubs_bars,
      clothing_apparel: initialValues.clothing_apparel,
      home_hardware: initialValues.home_hardware,
      online_services_subscriptions: initialValues.online_services_subscriptions,
      money_transfer: initialValues.money_transfer,
      delivery_takeaway: initialValues.delivery_takeaway,
    };
  }

  return {
    month: defaultMonth?.toString() || "",
    year: defaultYear?.toString() || "",
    salary: 0,
    bonus: 0,
    rent: 0,
    utilities: 0,
    groceries: 0,
    transport: 0,
    entertainment: 0,
    shopping: 0,
    miscellaneous: 0,
    savings: 0,
    dining_out: 0,
    health_pharmacy: 0,
    fitness: 0,
    personal_care: 0,
    travel: 0,
    education: 0,
    takeaway_coffee: 0,
    pubs_bars: 0,
    clothing_apparel: 0,
    home_hardware: 0,
    online_services_subscriptions: 0,
    money_transfer: 0,
    delivery_takeaway: 0,
  };
};

export function BudgetForm({ onSubmit, defaultMonth, defaultYear, initialValues, mode = 'create' }: BudgetFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(defaultMonth, defaultYear, initialValues),
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
            <CardTitle className="text-2xl">{mode === 'edit' ? 'Edit' : 'Create'} Monthly Budget</CardTitle>
            <CardDescription>
              {mode === 'edit' ? 'Update' : 'Plan'} your monthly budget by setting income and expense targets.
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
            <div className="space-y-8">
              <MonthYearFields form={form} />
              <div className="space-y-6">
                <IncomeFields form={form} />
                <SavingsFields form={form} />
                <ExpenseFields form={form} />
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
