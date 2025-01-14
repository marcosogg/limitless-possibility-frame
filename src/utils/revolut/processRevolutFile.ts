import { supabase } from "@/integrations/supabase/client";
import { RevolutTransactionDB } from "@/types/revolut";
import { format, parse } from "date-fns";
import { getCategoryForVendor } from "./budgetCalculations";
import { v4 as uuidv4 } from 'uuid';

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
              const description = parts[4].trim().toLowerCase().replace(/\s+/g, ' ');
              const amount = parseFloat(parts[5].trim());
              const currency = parts[7].trim();
              const state = parts[8].trim();

              if (type !== 'CARD_PAYMENT' && type !== 'TOPUP') continue;
              if (product !== "Current" || state !== "COMPLETED") continue;
              if (amount >= 0) continue;
              if (description.includes("credit card repayment")) continue;
              if (!completedDate) {
                console.warn(`Skipping transaction with missing date: ${line}`);
                continue;
              }

              let parsedDate;
              try {
                parsedDate = parse(completedDate, 'yyyy-MM-dd HH:mm:ss', new Date());
                if (isNaN(parsedDate.getTime())) {
                  throw new Error('Invalid date format');
                }
              } catch (error) {
                console.error(`Error parsing date: ${completedDate}`, error);
                continue;
              }

              const category = getCategoryForVendor(description) || "Uncategorized";

              transactions.push({
                id: uuidv4(),
                user_id: user.id,
                monthly_approval_id: '', // This will be set when approving
                date: format(parsedDate, 'yyyy-MM-dd'),
                description: `${description} (from file: ${file.name})`,
                amount: type === 'TOPUP' ? amount : -amount,
                category,
                original_category: type,
                created_at: new Date().toISOString(),
                currency: currency,
                month: parsedDate.getMonth() + 1,
                year: parsedDate.getFullYear()
              });
            }
          }

          // Aggregate transactions
          const aggregatedTransactions = aggregateTransactions(transactions);
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

// Helper function to aggregate transactions
const aggregateTransactions = (transactions: RevolutTransactionDB[]): RevolutTransactionDB[] => {
  const transactionMap = new Map<string, RevolutTransactionDB>();

  transactions.forEach(transaction => {
    const key = `${transaction.user_id}-${transaction.date}-${transaction.description}-${transaction.amount}`;
    if (transactionMap.has(key)) {
      console.warn(`Duplicate transaction found for key: ${key}`, transaction);
    } else {
      transactionMap.set(key, transaction);
    }
  });

  return Array.from(transactionMap.values());
};