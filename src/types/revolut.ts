export interface RevolutTransaction {
  type: string;
  product: string;
  startedDate: string;
  completedDate: string;
  description: string;
  amount: number;  // Changed from string to number
  fee: string;
  currency: string;
  state: string;
  balance: string;
}