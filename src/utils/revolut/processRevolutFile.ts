// src/utils/revolut/processRevolutFile.ts
import { supabase } from "@/integrations/supabase/client";
import { RevolutTransactionDB } from "@/types/revolut";
import { format, parse } from "date-fns";
import { categorizeTransactions } from "./categorizeTransactions";
import { v4 as uuidv4 } from 'uuid';

export const processRevolutFile = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          const lines = content.split('\n');
          let transactions: Omit<RevolutTransactionDB, 'id' | 'profile_id'>[] = [];

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split(',');

            if (parts.length >= 9) { // Ensure line has enough fields
              const type = parts[0].trim();
              const completedDate = parts[3].trim();
              const description = parts[4].trim();
              const amount = parseFloat(parts[5].trim());
              const currency = parts[7].trim();

              // Skip lines that don't represent card payments or top-ups
              if (type !== 'CARD_PAYMENT' && type !== 'TOPUP') continue;

              transactions.push({
                date: format(parse(completedDate, 'dd/MM/yyyy HH:mm', new Date()), 'yyyy-MM-dd'),
                description: description.trim().toLowerCase(),
                amount: type === 'TOPUP' ? amount : -amount, // Negate amount for expenses
                currency,
                category: null, // Initially set category to null
              });
            }
          }

          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("User not authenticated");

          // Add filename to description
          transactions = transactions.map(transaction => ({
            ...transaction,
            description: `${transaction.description} (from file: ${file.name})`
          }));

          // Aggregate transactions with the same profile_id, date, description, and amount
          const aggregatedTransactions = aggregateTransactions(transactions, user.id);

          // Categorize transactions
          const categorizedTransactions = await categorizeTransactions(aggregatedTransactions);

          // Insert categorized transactions into the database
          const { error } = await supabase
            .from('revolut_transactions')
            .insert(categorizedTransactions);

          if (error) throw error;

          resolve(transactions.length);
        } catch (error) {
          reject(error);
        }
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

// Helper function to aggregate transactions
const aggregateTransactions = (
  transactions: Omit<RevolutTransactionDB, 'id'>[],
  profileId: string
): RevolutTransactionDB[] => {
  const transactionMap = new Map<string, Omit<RevolutTransactionDB, 'id'>>();

  transactions.forEach(transaction => {
    const key = `${profileId}-${transaction.date}-${transaction.description}-${transaction.amount}`;
    if (transactionMap.has(key)) {
      // If a transaction with the same key exists, log it for investigation
      console.warn(`Duplicate transaction found for key: ${key}`, transaction);
    } else {
      transactionMap.set(key, transaction);
    }
  });

  // Assign UUIDs after aggregation
  const aggregatedTransactions: RevolutTransactionDB[] = Array.from(transactionMap.values()).map(transaction => ({
    ...transaction,
    id: uuidv4(),
    profile_id: profileId
  }));

  return aggregatedTransactions;
};
