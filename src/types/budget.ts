// src/types/budget.ts
export interface Budget {
  // System fields
  id: string;
  user_id: string;
  month: number;
  year: number;
  created_at: string | null;

  // Income fields
  salary: number;
  bonus: number;

  // Budget categories (limits)
  rent: number;
  utilities: number;
  groceries: number;
  transport: number;
  entertainment: number;
  shopping: number;
  miscellaneous: number;
  savings: number;
  dining_out: number;
  health_pharmacy: number;
  fitness: number;
  personal_care: number;
  travel: number;
  education: number;
  takeaway_coffee: number;
  pubs_bars: number;
  clothing_apparel: number;
  home_hardware: number;
  online_services_subscriptions: number;
  money_transfer: number;
  delivery_takeaway: number;

  // Spent amounts
  rent_spent: number;
  utilities_spent: number;
  groceries_spent: number;
  transport_spent: number;
  entertainment_spent: number;
  shopping_spent: number;
  miscellaneous_spent: number;
  savings_spent: number;
  dining_out_spent: number;
  health_pharmacy_spent: number;
  fitness_spent: number;
  personal_care_spent: number;
  travel_spent: number;
  education_spent: number;
  takeaway_coffee_spent: number;
  pubs_bars_spent: number;
  clothing_apparel_spent: number;
  home_hardware_spent: number;
  online_services_subscriptions_spent: number;
  money_transfer_spent: number;
  delivery_takeaway_spent: number;
  uncategorized_spent: number;
}

export type BudgetInsert = Omit<Budget, 'id' | 'created_at'>;
export type BudgetUpdate = Partial<BudgetInsert>;
