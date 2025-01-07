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

export type BillReminderInsert = Omit<BillReminder, 'id' | 'created_at'>;
export type BillReminderUpdate = Partial<BillReminderInsert>;