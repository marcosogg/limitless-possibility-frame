import { supabase } from "@/integrations/supabase/client";
import { format, parse } from "date-fns";
import { getCategoryForVendor } from "./budgetCalculations";
import { v4 as uuidv4 } from 'uuid';
import type { RevolutTransactionDB } from "@/types/revolut";

export const processRevolutFile = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("User not authenticated");

          const transactions: RevolutTransactionDB[] = [];
          const lines = content.split('\n');
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split(',');

            if (parts.length >= 10) {
              const type = parts[0].trim();
              const product = parts[1].trim();
              const completedDate = parts[3].trim();
              const description = parts[4].trim();
              const amount = parseFloat(parts[5].trim());
              const currency = parts[7].trim();
              const state = parts[8].trim();

              if (product !== "Current" || state !== "COMPLETED") continue;
              if (amount >= 0) continue;

              const category = getCategoryForVendor(description) || "Uncategorized";

              transactions.push({
                id: uuidv4(),
                profile_id: user.id,
                date: format(parse(completedDate, 'dd/MM/yyyy HH:mm', new Date()), 'yyyy-MM-dd'),
                description: `${description} (from file: ${file.name})`,
                amount: -amount,
                currency,
                category
              });
            }
          }

          const aggregatedTransactions = aggregateTransactions(transactions);

          const { error } = await supabase
            .from('revolut_transactions')
            .insert(aggregatedTransactions)
            .select();

          if (error) throw error;

          resolve(aggregatedTransactions.length);
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

const aggregateTransactions = (transactions: RevolutTransactionDB[]): RevolutTransactionDB[] => {
  const transactionMap = new Map<string, RevolutTransactionDB>();

  transactions.forEach(transaction => {
    const key = `${transaction.profile_id}-${transaction.date}-${transaction.description}-${transaction.amount}`;
    if (transactionMap.has(key)) {
      console.warn(`Duplicate transaction found for key: ${key}`, transaction);
    } else {
      transactionMap.set(key, transaction);
    }
  });

  return Array.from(transactionMap.values());
};