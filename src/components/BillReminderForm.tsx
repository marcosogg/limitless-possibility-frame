import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppToggle } from "./bill-reminder/WhatsAppToggle";
import { BillReminderFormFields } from "./bill-reminder/BillReminderFormFields";
import { BillReminderFormData, initialFormData } from "@/types/bill-reminder";

const DEFAULT_PHONE = "+353838770548";

export function BillReminderForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BillReminderFormData>(initialFormData);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([DEFAULT_PHONE]);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create bill reminders");
      }

      const dueDate = parseInt(formData.due_date);
      if (isNaN(dueDate) || dueDate < 1 || dueDate > 31) {
        throw new Error("Due date must be between 1 and 31");
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a positive number");
      }

      if (formData.reminders_enabled && !phoneNumbers[0]) {
        throw new Error("Main phone number is required for SMS reminders");
      }

      // Filter out empty phone numbers
      const validPhoneNumbers = phoneNumbers.filter(phone => phone.trim() !== '');

      // Check for existing bill reminders with the same provider name
      const { data: existingBills } = await supabase
        .from("bill_reminders")
        .select("id, provider_name")
        .eq("user_id", user.id)
        .eq("provider_name", formData.provider_name);

      if (existingBills && existingBills.length > 0) {
        const proceed = window.confirm(
          `You already have a bill reminder for ${formData.provider_name}. Would you like to create another one?`
        );
        if (!proceed) {
          setLoading(false);
          return;
        }
      }

      // Create bill reminder for each phone number
      for (const phoneNumber of validPhoneNumbers) {
        const { error: insertError } = await supabase.from("bill_reminders").insert({
          provider_name: formData.provider_name,
          due_date: dueDate,
          amount: amount,
          notes: formData.notes || null,
          reminders_enabled: formData.reminders_enabled,
          phone_number: formData.reminders_enabled ? phoneNumber : null,
          user_id: user.id
        });

        if (insertError) throw insertError;

        if (formData.reminders_enabled) {
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
                provider_name: formData.provider_name,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <BillReminderFormFields formData={formData} setFormData={setFormData} />
      
      <WhatsAppToggle
        checked={formData.reminders_enabled}
        onChange={(checked) => setFormData({ ...formData, reminders_enabled: checked })}
        phoneNumber={phoneNumbers[0]}
        onPhoneNumberChange={handlePhoneNumberChange}
        scheduleDate={scheduleDate}
        onScheduleDateChange={setScheduleDate}
        scheduleTime={scheduleTime}
        onScheduleTimeChange={setScheduleTime}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Bill Reminder"}
      </Button>
    </form>
  );
}