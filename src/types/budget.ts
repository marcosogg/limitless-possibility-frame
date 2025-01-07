export interface Budget {
  id: string;
  user_id: string;
  month: number;
  year: number;
  created_at: string | null;
  salary: number;
  bonus: number;
  rent: number;
  utilities: number;
  groceries: number;
  transport: number;
  entertainment: number;
  shopping: number;
  miscellaneous: number;
  savings: number;
  rent_spent: number;
  utilities_spent: number;
  groceries_spent: number;
  transport_spent: number;
  entertainment_spent: number;
  shopping_spent: number;
  miscellaneous_spent: number;
  savings_spent: number;
}

export type BudgetInsert = Omit<Budget, 'id' | 'created_at'>;
export type BudgetUpdate = Partial<BudgetInsert>;