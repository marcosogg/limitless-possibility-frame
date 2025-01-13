export interface RevolutTransaction {
  id?: string;
  user_id?: string;
  monthly_approval_id?: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  original_category: string;
  created_at?: Date;
}

export type RevolutTransactionDB = RevolutTransaction;

export interface MonthlyApproval {
  id?: string;
  userId?: string;
  month: number;
  year: number;
  approvedAt?: Date;
  transactions?: RevolutTransaction[];
}

export interface RevolutImportSettings {
  budgetUpdateMode: 'override' | 'add';
  categoryMappings: Record<string, string>;
  allowFutureMonths: boolean;
}

export interface ImportResult {
  success: boolean;
  transactions: RevolutTransaction[];
  errors: string[];
  unmappedCategories: string[];
  warnings?: string[];
}