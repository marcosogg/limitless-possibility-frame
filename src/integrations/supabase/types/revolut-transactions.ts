import { Json } from "./json"

export type RevolutTransactionsTable = {
  Row: {
    id: string
    date: string
    description: string
    amount: number
    currency: string
    category: string | null
    profile_id: string
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    date: string
    description: string
    amount: number
    currency: string
    category?: string | null
    profile_id: string
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    date?: string
    description?: string
    amount?: number
    currency?: string
    category?: string | null
    profile_id?: string
    created_at?: string | null
    updated_at?: string | null
  }
}