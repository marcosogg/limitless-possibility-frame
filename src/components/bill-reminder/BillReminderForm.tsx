import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  providerName: z.string().min(2, {
    message: "Provider name must be at least 2 characters.",
  }),
  dueDate: z.string()
    .regex(/^([1-9]|[12][0-9]|3[01])$/, {
      message: "Please enter a valid day (1-31)",
    }),
  amount: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Please enter a valid amount",
    }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  notes: z.string().optional(),
  smsReminders: z.boolean().default(false),
  whatsappReminders: z.boolean().default(false),
});

const categories = [
  { value: "utilities", label: "Utilities" },
  { value: "rent", label: "Rent" },
  { value: "internet", label: "Internet" },
  { value: "phone", label: "Phone" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

interface BillReminderFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function BillReminderForm({ onSubmit }: BillReminderFormProps) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerName: "",
      dueDate: "",
      amount: "",
      category: "",
      notes: "",
      smsReminders: false,
      whatsappReminders: false,
    },
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Add Bill Reminder</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
          </Button>
        </div>
        <CardDescription>
          Set up automatic reminders for your recurring bills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="providerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Electric Ireland" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date (Day of Month)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter day (1-31)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the day of the month when this bill is due
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (€)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                      <Input placeholder="Enter amount" className="pl-7" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smsReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable SMS Reminders</FormLabel>
                    <FormDescription>
                      Receive SMS notifications before the due date
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none opacity-50">
                    <FormLabel>Enable WhatsApp Reminders</FormLabel>
                    <FormDescription>
                      Coming Soon - Receive reminders via WhatsApp
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Create Bill Reminder</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
