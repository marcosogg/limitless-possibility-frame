import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initialFormData, BillReminderFormData } from "@/types/bill-reminder";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { ScheduleReminder } from "./ScheduleReminder";

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

const DEFAULT_PHONE = "+353838770548";

interface BillReminderFormProps {
  onSubmit: (values: any) => void;
}

export function BillReminderForm({ onSubmit }: BillReminderFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BillReminderFormData>(initialFormData);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([DEFAULT_PHONE]);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");
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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to create bill reminders");
      }

      const dueDate = parseInt(values.dueDate);
      if (isNaN(dueDate) || dueDate < 1 || dueDate > 31) {
        throw new Error("Due date must be between 1 and 31");
      }

      const amount = parseFloat(values.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a positive number");
      }

      if (values.smsReminders && !phoneNumbers[0]) {
        throw new Error("Main phone number is required for SMS reminders");
      }

      // Filter out empty phone numbers
      const validPhoneNumbers = phoneNumbers.filter(phone => phone.trim() !== '');

      // Check for existing bill reminders with the same provider name
      const { data: existingBills } = await supabase
        .from("bill_reminders")
        .select("id, provider_name")
        .eq("user_id", user.id)
        .eq("provider_name", values.providerName);

      if (existingBills && existingBills.length > 0) {
        const proceed = window.confirm(
          `You already have a bill reminder for ${values.providerName}. Would you like to create another one?`
        );
        if (!proceed) {
          setLoading(false);
          return;
        }
      }

      // Create bill reminder for each phone number
      for (const phoneNumber of validPhoneNumbers) {
        const { error: insertError } = await supabase.from("bill_reminders").insert({
          provider_name: values.providerName,
          due_date: dueDate,
          amount: amount,
          category: values.category,
          notes: values.notes || null,
          reminders_enabled: values.smsReminders,
          phone_number: values.smsReminders ? phoneNumber : null,
          user_id: user.id
        });

        if (insertError) throw insertError;

        if (values.smsReminders) {
          let scheduledDateTime: string | undefined;
          
          if (scheduleDate) {
            const date = new Date(scheduleDate);
            const [hours, minutes] = scheduleTime.split(':');
            date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            // Ensure the scheduled time is at least 5 minutes in the future
            const minScheduleTime = new Date();
            minScheduleTime.setMinutes(minScheduleTime.getMinutes() + 5);
            
            if (date < minScheduleTime) {
              throw new Error("Schedule time must be at least 5 minutes in the future");
            }
            
            // Check if it's not more than 35 days in the future
            const maxScheduleTime = new Date();
            maxScheduleTime.setDate(maxScheduleTime.getDate() + 35);
            
            if (date > maxScheduleTime) {
              throw new Error("Schedule time cannot be more than 35 days in the future");
            }
            
            scheduledDateTime = date.toISOString();
          }

          const { error: smsError } = await supabase.functions.invoke('send-sms', {
            body: {
              reminder: {
                provider_name: values.providerName,
                due_date: dueDate,
                amount: amount,
                phone_number: phoneNumber
              },
              scheduleDate: scheduledDateTime
            }
          });

          if (smsError) {
            console.error('Failed to send SMS:', smsError);
            toast({
              variant: "destructive",
              title: "Warning",
              description: `Bill reminder created but SMS notification failed to send to ${phoneNumber}.`,
            });
          }
        }
      }

      toast({
        title: "Success",
        description: scheduleDate 
          ? "Bill reminder(s) created and SMS scheduled successfully"
          : "Bill reminder(s) created successfully",
      });

      setFormData(initialFormData);
      setPhoneNumbers([DEFAULT_PHONE]);
      setScheduleDate(undefined);
      setScheduleTime("12:00");
      form.reset();
      navigate("/");
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (value: string, index: number = 0) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sms_enabled"
                  checked={form.watch("smsReminders")}
                  onChange={(e) => form.setValue("smsReminders", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="sms_enabled">Enable SMS Reminders</Label>
              </div>
              {form.watch("smsReminders") && (
                <div className="space-y-4">
                  <PhoneNumberInput
                    mainPhone={phoneNumbers[0]}
                    additionalPhones={phoneNumbers.slice(1)}
                    onMainPhoneChange={(value) => handlePhoneNumberChange(value, 0)}
                    onAdditionalPhoneChange={(value, index) => handlePhoneNumberChange(value, index + 1)}
                    onAddPhone={() => setPhoneNumbers([...phoneNumbers, ''])}
                    onRemovePhone={(index) => setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index))}
                  />
                  <ScheduleReminder
                    scheduleDate={scheduleDate}
                    scheduleTime={scheduleTime}
                    onScheduleDateChange={setScheduleDate}
                    onScheduleTimeChange={setScheduleTime}
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Bill Reminder"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
