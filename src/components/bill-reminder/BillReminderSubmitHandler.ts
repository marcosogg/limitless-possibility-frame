import { BillReminderFormData } from "@/types/bill-reminder";
import { supabase } from "@/integrations/supabase/client";

export const handleBillReminderSubmit = async (
  formData: BillReminderFormData,
  phoneNumbers: string[],
  scheduleDate?: Date,
  scheduleTime?: string
) => {
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
      return false;
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
        const [hours, minutes] = scheduleTime?.split(':') || ['12', '00'];
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
        return { warning: `Bill reminder created but SMS notification failed to send to ${phoneNumber}.` };
      }
    }
  }

  return true;
};