// File: src/types/revolut.ts
// Block: Updated RevolutCSVRow type

export type RevolutTransactionType = 'TRANSFER' | 'CARD_PAYMENT' | 'EXCHANGE' | 'CASHBACK' | 'REFUND' | 'TOPUP' | 'OTHER'; // Add more if needed
// Remove RevolutProductType as it's no longer needed
export type RevolutTransactionState = 'COMPLETED' | 'PENDING' | 'REVERTED' | 'DECLINED' | 'FAILED';

export interface RevolutCSVRow {
  type: RevolutTransactionType;
  startedDate: string;
  completedDate: string;
  description: string;
  amount: string;
  fee: string;
  currency: string;
  state: RevolutTransactionState;
  balance: string;
}
