// src/utils/revolut.ts

import type { RevolutTransactionDB } from "@/types/revolut";

export function parseRevolutCSV(csvText: string) {
  const rows = csvText.split('\n');
  const header = rows[0].split(',');

  if (header.length !== 10) {
    throw new Error(`Invalid CSV format: Expected 10 columns but found ${header.length}`);
  }

  return rows
    .slice(1) // Skip header
    .filter(row => row.trim()) // Remove empty rows
    .map(row => {
      const values = row.split(',');
      return {
        type: values[0].trim(),
        startedDate: values[2].trim(),
        completedDate: values[3].trim(),
        description: values[4].trim(),
        amount: values[5].trim(),
        fee: values[6].trim(),
        currency: values[7].trim(),
        state: values[8].trim(),
        balance: values[9].trim()
      };
    });
}

export function createTransactionKey(transaction: RevolutTransactionDB): string {
  return `${transaction.date}-${transaction.description}-${transaction.amount}`;
}
