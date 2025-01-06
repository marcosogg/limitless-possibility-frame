import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FormField } from "./bill-reminder/FormField";
import { CategorySelector } from "./bill-reminder/CategorySelector";
import { WhatsAppToggle } from "./bill-reminder/WhatsAppToggle";
import { BillReminderFormData, initialFormData } from "@/types/bill-reminder";

export function BillReminderForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BillReminderFormData>(initialFormData);
  const [phoneNumber, setPhoneNumber] = useState("");

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

      if (formData.reminders_enabled && !phoneNumber) {
        throw new Error("Phone number is required for SMS reminders");
      }

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

      const { error: insertError } = await supabase.from("bill_reminders").insert({
        provider_name: formData.provider_name,
        due_date: dueDate,
        amount: amount,
        category: formData.category,
        notes: formData.notes || null,
        reminders_enabled: formData.reminders_enabled,
        phone_number: formData.reminders_enabled ? phoneNumber : null,
        user_id: user.id
      });

      if (insertError) throw insertError;

      if (formData.reminders_enabled) {
        console.log('Calling send-sms function with data:', {
          provider_name: formData.provider_name,
          due_date: dueDate,
          amount: amount,
          phone_number: phoneNumber
        });

        const { data: smsData, error: smsError } = await supabase.functions.invoke('send-sms', {
          body: {
            reminder: {
              provider_name: formData.provider_name,
              due_date: dueDate,
              amount: amount,
              phone_number: phoneNumber
            }
          }
        });

        console.log('SMS function response:', { data: smsData, error: smsError });

        if (smsError) {
          console.error('Failed to send SMS:', smsError);
          toast({
            variant: "destructive",
            title: "Warning",
            description: "Bill reminder created but SMS notification failed to send.",
          });
        } else {
          toast({
            title: "Success",
            description: "Bill reminder created and SMS notification sent successfully.",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Bill reminder created successfully",
        });
      }

      setFormData(initialFormData);
      setPhoneNumber("");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        id="provider_name"
        label="Provider Name"
        required
        value={formData.provider_name}
        onChange={(value) => setFormData({ ...formData, provider_name: value })}
        placeholder="e.g., Electric Ireland"
      />

      <FormField
        id="due_date"
        label="Due Date (Day of Month)"
        type="number"
        required
        value={formData.due_date}
        onChange={(value) => setFormData({ ...formData, due_date: value })}
        placeholder="Enter day (1-31)"
        min="1"
        max="31"
      />

      <FormField
        id="amount"
        label="Amount (€)"
        type="number"
        required
        value={formData.amount}
        onChange={(value) => setFormData({ ...formData, amount: value })}
        placeholder="Enter amount"
        step="0.01"
      />

      <CategorySelector
        value={formData.category}
        onChange={(value) => setFormData({ ...formData, category: value })}
      />

      <FormField
        id="notes"
        label="Notes (Optional)"
        value={formData.notes}
        onChange={(value) => setFormData({ ...formData, notes: value })}
        placeholder="Add any additional notes"
        isTextarea
      />

      <WhatsAppToggle
        checked={formData.reminders_enabled}
        onChange={(checked) => setFormData({ ...formData, reminders_enabled: checked })}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={setPhoneNumber}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Bill Reminder"}
      </Button>
    </form>
  );
}