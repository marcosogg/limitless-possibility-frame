// src/integrations/supabase/types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bill_reminders: {
        Row: {
          amount: number
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
        Relationships: []
      }
      budgets: {
        Row: {
          bonus: number
          created_at: string | null
          dining_out: number
          dining_out_spent: number
          education: number
          education_spent: number
          entertainment: number
          entertainment_spent: number
          gifts_donations: number
          gifts_donations_spent: number
          groceries: number
          groceries_spent: number
          health_fitness: number
          health_fitness_spent: number
          id: string
          miscellaneous: number
          miscellaneous_spent: number
          month: number
          personal_care: number
          personal_care_spent: number
          rent: number
          rent_spent: number
          salary: number
          savings: number
          savings_spent: number
          shopping: number
          shopping_spent: number
          transport: number
          transport_spent: number
          travel: number
          travel_spent: number
          user_id: string
          utilities: number
          utilities_spent: number
          year: number
        }
        Insert: {
          bonus?: number
          created_at?: string | null
          dining_out?: number
          dining_out_spent?: number
          education?: number
          education_spent?: number
          entertainment?: number
          entertainment_spent?: number
          gifts_donations?: number
          gifts_donations_spent?: number
          groceries?: number
          groceries_spent?: number
          health_fitness?: number
          health_fitness_spent?: number
          id?: string
          miscellaneous?: number
          miscellaneous_spent?: number
          month: number
          personal_care?: number
          personal_care_spent?: number
          rent?: number
          rent_spent?: number
          salary?: number
          savings?: number
          savings_spent?: number
          shopping?: number
          shopping_spent?: number
          transport?: number
          transport_spent?: number
          travel?: number
          travel_spent?: number
          user_id: string
          utilities?: number
          utilities_spent?: number
          year: number
        }
        Update: {
          bonus?: number
          created_at?: string | null
          dining_out?: number
          dining_out_spent?: number
          education?: number
          education_spent?: number
          entertainment?: number
          entertainment_spent?: number
          gifts_donations?: number
          gifts_donations_spent?: number
          groceries?: number
          groceries_spent?: number
          health_fitness?: number
          health_fitness_spent?: number
          id?: string
          miscellaneous?: number
          miscellaneous_spent?: number
          month?: number
          personal_care?: number
          personal_care_spent?: number
          rent?: number
          rent_spent?: number
          salary?: number
          savings?: number
          savings_spent?: number
          shopping?: number
          shopping_spent?: number
          transport?: number
          transport_spent?: number
          travel?: number
          travel_spent?: number
          user_id?: string
          utilities?: number
          utilities_spent?: number
          year?: number
        }
        Relationships: []
      }
      revolut_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          currency: string
          date: string
          description: string
          id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          currency: string
          date: string
          description: string
          id?: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          currency?: string
          date?: string
          description?: string
          id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
