import { Json } from "./json"

export type BillRemindersTable = {
  Row: {
    amount: number
    category: string
    created_at: string | null
    currency: string
    due_date: number
    id: string
    notes: string | null
    phone_number: string | null
    provider_name: string
    reminders_enabled: boolean
    user_id: string
  }
  Insert: {
    amount?: number
    category: string
    created_at?: string | null
    currency?: string
    due_date: number
    id?: string
    notes?: string | null
    phone_number?: string | null
    provider_name: string
    reminders_enabled?: boolean
    user_id: string
  }
  Update: {
    amount?: number
    category?: string
    created_at?: string | null
    currency?: string
    due_date?: number
    id?: string
    notes?: string | null
    phone_number?: string | null
    provider_name?: string
    reminders_enabled?: boolean
    user_id?: string
  }
}