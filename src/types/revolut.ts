export interface RevolutTransaction {
  id?: string;
  userId?: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  originalCategory: string;
  createdAt?: Date;
}

export interface RevolutImportSettings {
  budgetUpdateMode: 'override' | 'add';
  categoryMappings: Record<string, string>;
  allowFutureMonths: boolean;
}

export interface MonthlyApproval {
  id?: string;
  userId?: string;
  month: number;
  year: number;
  approvedAt?: Date;
}

export interface ImportResult {
  success: boolean;
  transactions: RevolutTransaction[];
  errors: string[];
  unmappedCategories: string[];
}