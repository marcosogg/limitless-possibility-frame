// src/types/revolut.ts

export interface RevolutTransactionDB {
  date: string;          // ISO string format
  description: string;
  amount: number;        // Always negative for expenses
  currency: string;      // e.g., "EUR", "USD"
  category: string;      // Based on categorizeTransaction function
  profile_id: string;    // Supabase user ID
}

export interface RevolutCSVRow {
  type: string;
  startedDate: string;
  completedDate: string;
  description: string;
  amount: string;
  fee: string;
  currency: string;
  state: string;
  balance: string;
}
