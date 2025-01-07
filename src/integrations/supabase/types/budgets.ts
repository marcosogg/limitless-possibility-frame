import { Json } from "./json"

export type BudgetsTable = {
  Row: {
    bonus: number
    created_at: string | null
    entertainment: number
    entertainment_spent: number
    groceries: number
    groceries_spent: number
    id: string
    miscellaneous: number
    miscellaneous_spent: number
    month: number
    rent: number
    rent_spent: number
    salary: number
    savings: number
    savings_spent: number
    shopping: number
    shopping_spent: number
    transport: number
    transport_spent: number
    user_id: string
    utilities: number
    utilities_spent: number
    year: number
  }
  Insert: {
    bonus?: number
    created_at?: string | null
    entertainment?: number
    entertainment_spent?: number
    groceries?: number
    groceries_spent?: number
    id?: string
    miscellaneous?: number
    miscellaneous_spent?: number
    month: number
    rent?: number
    rent_spent?: number
    salary?: number
    savings?: number
    savings_spent?: number
    shopping?: number
    shopping_spent?: number
    transport?: number
    transport_spent?: number
    user_id: string
    utilities?: number
    utilities_spent?: number
    year: number
  }
  Update: {
    bonus?: number
    created_at?: string | null
    entertainment?: number
    entertainment_spent?: number
    groceries?: number
    groceries_spent?: number
    id?: string
    miscellaneous?: number
    miscellaneous_spent?: number
    month?: number
    rent?: number
    rent_spent?: number
    salary?: number
    savings?: number
    savings_spent?: number
    shopping?: number
    shopping_spent?: number
    transport?: number
    transport_spent?: number
    user_id?: string
    utilities?: number
    utilities_spent?: number
    year?: number
  }
}