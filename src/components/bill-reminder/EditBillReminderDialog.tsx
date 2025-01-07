import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BillReminderFormFields } from "./BillReminderFormFields";
import { WhatsAppToggle } from "./WhatsAppToggle";
import { BillReminderFormData } from "@/types/bill-reminder";

interface EditBillReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: {
    id: string;
    provider_name: string;
    due_date: number;
    amount: number;
    notes: string | null;
    reminders_enabled: boolean;
    phone_number: string | null;
  };
  onSuccess: () => void;
}

export function EditBillReminderDialog({
  open,
  onOpenChange,
  reminder,
  onSuccess,
}: EditBillReminderDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BillReminderFormData>({
    provider_name: reminder.provider_name,
    due_date: reminder.due_date.toString(),
    amount: reminder.amount.toString(),
    notes: reminder.notes || "",
    reminders_enabled: reminder.reminders_enabled,
  });
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([
    reminder.phone_number || "+353838770548",
  ]);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        .eq('id', reminder.id);

      if (updateError) throw updateError;

      if (formData.reminders_enabled && scheduleDate) {
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

      onSuccess();
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bill Reminder</DialogTitle>
        </DialogHeader>
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
            {loading ? "Updating..." : "Update Bill Reminder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}