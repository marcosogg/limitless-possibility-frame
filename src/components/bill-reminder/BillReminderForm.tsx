import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { BillReminderFormFields } from "./BillReminderFormFields";
import { WhatsAppToggle } from "./WhatsAppToggle";
import { BillReminderFormData, initialFormData, BillReminder } from "@/types/bill-reminder";
import { handleBillReminderSubmit } from "./BillReminderSubmitHandler";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_PHONE = "+353838770548";

interface BillReminderFormProps {
  initialData?: BillReminder;
  mode?: 'create' | 'edit';
}

export function BillReminderForm({ initialData, mode = 'create' }: BillReminderFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BillReminderFormData>(() => {
    if (initialData) {
      return {
        provider_name: initialData.provider_name,
        due_date: initialData.due_date.toString(),
        amount: initialData.amount.toString(),
        notes: initialData.notes || "",
        reminders_enabled: initialData.reminders_enabled,
      };
    }
    return initialFormData;
  });
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([
    initialData?.phone_number || DEFAULT_PHONE,
  ]);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        const result = await handleBillReminderSubmit(
          formData,
          phoneNumbers,
          scheduleDate,
          scheduleTime
        );

        if (result === false) {
          setLoading(false);
          return;
        }

        if (typeof result === 'object' && result.warning) {
          toast({
            variant: "destructive",
            title: "Warning",
            description: result.warning,
          });
        } else {
          toast({
            title: "Success",
            description: scheduleDate 
              ? "Bill reminder(s) created and SMS scheduled successfully"
              : "Bill reminder(s) created successfully",
          });
        }
      } else if (mode === 'edit' && initialData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("You must be logged in to update bill reminders");
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

        const { error: updateError } = await supabase
          .from("bill_reminders")
          .update({
            provider_name: formData.provider_name,
            due_date: dueDate,
            amount: amount,
            notes: formData.notes || null,
            reminders_enabled: formData.reminders_enabled,
            phone_number: formData.reminders_enabled ? phoneNumbers[0] : null,
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;

        if (formData.reminders_enabled && scheduleDate) {
          const date = new Date(scheduleDate);
          const [hours, minutes] = scheduleTime.split(':');
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          const minScheduleTime = new Date();
          minScheduleTime.setMinutes(minScheduleTime.getMinutes() + 5);
          
          if (date < minScheduleTime) {
            throw new Error("Schedule time must be at least 5 minutes in the future");
          }
          
          const maxScheduleTime = new Date();
          maxScheduleTime.setDate(maxScheduleTime.getDate() + 35);
          
          if (date > maxScheduleTime) {
            throw new Error("Schedule time cannot be more than 35 days in the future");
          }

          const { error: smsError } = await supabase.functions.invoke('send-sms', {
            body: {
              reminder: {
                provider_name: formData.provider_name,
                due_date: dueDate,
                amount: amount,
                phone_number: phoneNumbers[0]
              },
              scheduleDate: date.toISOString()
            }
          });

          if (smsError) {
            console.error('Failed to send SMS:', smsError);
            toast({
              variant: "destructive",
              title: "Warning",
              description: "Bill reminder updated but SMS notification failed to send.",
            });
          }
        }

        toast({
          title: "Success",
          description: "Bill reminder updated successfully",
        });
      }

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
        {loading ? (mode === 'create' ? "Creating..." : "Updating...") : (mode === 'create' ? "Create Bill Reminder" : "Update Bill Reminder")}
      </Button>
    </form>
  );
}