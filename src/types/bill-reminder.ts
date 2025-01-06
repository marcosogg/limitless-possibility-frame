export interface BillReminderFormData {
  provider_name: string;
  due_date: string;
  amount: string;
  category: string;
  notes: string;
  reminders_enabled: boolean;
}

export const initialFormData: BillReminderFormData = {
  provider_name: "",
  due_date: "",
  amount: "",
  category: "",
  notes: "",
  reminders_enabled: true,
};