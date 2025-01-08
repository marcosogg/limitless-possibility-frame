// src/types/revolut.ts

export interface RevolutTransactionDB {
  date: string;
  description: string;
  amount: number;
  currency: string;
  category: string | null;
  profile_id: string;
}
