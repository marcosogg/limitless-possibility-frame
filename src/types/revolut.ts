export interface SimpleTransaction {
  date: Date;
  amount: number;
  description: string;
  category: string;
  uploadDate: Date;
}

export interface RevolutTransactionDB extends SimpleTransaction {
  id: string;
}

export interface RevolutCSVRow {
  Type: string;
  Product: string;
  Started_Date: string;
  Completed_Date: string;
  Description: string;
  Amount: string;
  Fee: string;
  Currency: string;
  State: string;
  Balance: string;
}