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
          bonus: number | null
          clothing_apparel: number | null
          clothing_apparel_spent: number | null
          created_at: string | null
          delivery_takeaway: number | null
          delivery_takeaway_spent: number | null
          dining_out: number | null
          dining_out_spent: number | null
          education: number | null
          education_spent: number | null
          entertainment: number | null
          entertainment_spent: number | null
          fitness: number | null
          fitness_spent: number | null
          groceries: number | null
          groceries_spent: number | null
          health_pharmacy: number | null
          health_pharmacy_spent: number | null
          home_hardware: number | null
          home_hardware_spent: number | null
          id: string
          miscellaneous: number | null
          miscellaneous_spent: number | null
          money_transfer: number | null
          money_transfer_spent: number | null
          month: number
          online_services_subscriptions: number | null
          online_services_subscriptions_spent: number | null
          personal_care: number | null
          personal_care_spent: number | null
          pubs_bars: number | null
          pubs_bars_spent: number | null
          rent: number | null
          rent_spent: number | null
          salary: number | null
          savings: number | null
          savings_spent: number | null
          shopping: number | null
          shopping_spent: number | null
          takeaway_coffee: number | null
          takeaway_coffee_spent: number | null
          transport: number | null
          transport_spent: number | null
          travel: number | null
          travel_spent: number | null
          travel_transportation: number | null
          travel_transportation_spent: number | null
          uncategorized_spent: number | null
          user_id: string
          utilities: number | null
          utilities_spent: number | null
          year: number
        }
        Insert: {
          bonus?: number | null
          clothing_apparel?: number | null
          clothing_apparel_spent?: number | null
          created_at?: string | null
          delivery_takeaway?: number | null
          delivery_takeaway_spent?: number | null
          dining_out?: number | null
          dining_out_spent?: number | null
          education?: number | null
          education_spent?: number | null
          entertainment?: number | null
          entertainment_spent?: number | null
          fitness?: number | null
          fitness_spent?: number | null
          groceries?: number | null
          groceries_spent?: number | null
          health_pharmacy?: number | null
          health_pharmacy_spent?: number | null
          home_hardware?: number | null
          home_hardware_spent?: number | null
          id?: string
          miscellaneous?: number | null
          miscellaneous_spent?: number | null
          money_transfer?: number | null
          money_transfer_spent?: number | null
          month: number
          online_services_subscriptions?: number | null
          online_services_subscriptions_spent?: number | null
          personal_care?: number | null
          personal_care_spent?: number | null
          pubs_bars?: number | null
          pubs_bars_spent?: number | null
          rent?: number | null
          rent_spent?: number | null
          salary?: number | null
          savings?: number | null
          savings_spent?: number | null
          shopping?: number | null
          shopping_spent?: number | null
          takeaway_coffee?: number | null
          takeaway_coffee_spent?: number | null
          transport?: number | null
          transport_spent?: number | null
          travel?: number | null
          travel_spent?: number | null
          travel_transportation?: number | null
          travel_transportation_spent?: number | null
          uncategorized_spent?: number | null
          user_id: string
          utilities?: number | null
          utilities_spent?: number | null
          year: number
        }
        Update: {
          bonus?: number | null
          clothing_apparel?: number | null
          clothing_apparel_spent?: number | null
          created_at?: string | null
          delivery_takeaway?: number | null
          delivery_takeaway_spent?: number | null
          dining_out?: number | null
          dining_out_spent?: number | null
          education?: number | null
          education_spent?: number | null
          entertainment?: number | null
          entertainment_spent?: number | null
          fitness?: number | null
          fitness_spent?: number | null
          groceries?: number | null
          groceries_spent?: number | null
          health_pharmacy?: number | null
          health_pharmacy_spent?: number | null
          home_hardware?: number | null
          home_hardware_spent?: number | null
          id?: string
          miscellaneous?: number | null
          miscellaneous_spent?: number | null
          money_transfer?: number | null
          money_transfer_spent?: number | null
          month?: number
          online_services_subscriptions?: number | null
          online_services_subscriptions_spent?: number | null
          personal_care?: number | null
          personal_care_spent?: number | null
          pubs_bars?: number | null
          pubs_bars_spent?: number | null
          rent?: number | null
          rent_spent?: number | null
          salary?: number | null
          savings?: number | null
          savings_spent?: number | null
          shopping?: number | null
          shopping_spent?: number | null
          takeaway_coffee?: number | null
          takeaway_coffee_spent?: number | null
          transport?: number | null
          transport_spent?: number | null
          travel?: number | null
          travel_spent?: number | null
          travel_transportation?: number | null
          travel_transportation_spent?: number | null
          uncategorized_spent?: number | null
          user_id?: string
          utilities?: number | null
          utilities_spent?: number | null
          year?: number
        }
        Relationships: []
      }
      category_mappings: {
        Row: {
          created_at: string
          id: number
          mappings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: number
          mappings: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          mappings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      monthly_approvals: {
        Row: {
          approved_at: string | null
          created_at: string | null
          id: string
          month: number
          user_id: string
          year: number
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          id?: string
          month: number
          user_id: string
          year: number
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          id?: string
          month?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      revolut_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string
          id: string
          month: number | null
          monthly_approval_id: string
          original_category: string
          user_id: string
          year: number | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          month?: number | null
          monthly_approval_id: string
          original_category: string
          user_id: string
          year?: number | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          month?: number | null
          monthly_approval_id?: string
          original_category?: string
          user_id?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "revolut_transactions_monthly_approval_id_fkey"
            columns: ["monthly_approval_id"]
            isOneToOne: false
            referencedRelation: "monthly_approvals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_monthly_approvals_v2: {
        Args: {
          p_user_id: string
          p_month: number
          p_year: number
        }
        Returns: {
          id: string
          user_id: string
          month: number
          year: number
          approved_at: string
          created_at: string
        }[]
      }
      undo_monthly_approval: {
        Args: {
          p_approval_id: string
          p_user_id: string
        }
        Returns: undefined
      }
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
