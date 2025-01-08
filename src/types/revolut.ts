export interface RevolutTransaction {
  type: string;
  product: string;
  startedDate: string;
  completedDate: string;
  description: string;
  amount: string;
  fee: string;
  currency: string;
  state: string;
  balance: string;
}

export interface RevolutTransactionDB {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  category: string | null;
  profile_id: string;
}