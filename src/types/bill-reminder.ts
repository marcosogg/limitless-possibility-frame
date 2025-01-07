export interface BillReminder {
  id: string;
  user_id: string;
  provider_name: string;
  due_date: number;
  amount: number;
  currency: string;
  category: string;
  notes: string | null;
  phone_number: string | null;
  reminders_enabled: boolean;
  created_at: string | null;
}

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
  category: "utilities",
  notes: "",
  reminders_enabled: false,
};

export type BillReminderInsert = Omit<BillReminder, 'id' | 'created_at'>;
export type BillReminderUpdate = Partial<BillReminderInsert>;