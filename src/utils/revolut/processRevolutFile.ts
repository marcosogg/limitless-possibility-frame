// src/utils/revolut/processRevolutFile.ts
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

          // Extract and Transform using logic similar to Power Query steps
          const transactions: RevolutTransactionDB[] = [];
          const lines = content.split('\n');
          
          // Headers are on the first line (index 0), so we can start at index 1
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split(',');

            if (parts.length >= 10) { // Ensure line has enough fields
              const type = parts[0].trim();
              const product = parts[1].trim();
              const completedDate = parts[3].trim();
              const description = parts[4].trim().toLowerCase().replace(/\s+/g, ' '); // Normalize
              const amount = parseFloat(parts[5].trim());
              const currency = parts[7].trim();
              const state = parts[8].trim();

              // Skip lines that don't represent card payments or top-ups
              if (type !== 'CARD_PAYMENT' && type !== 'TOPUP') continue;

              // Filter Rows: Product = "Current" and State = "COMPLETED"
              if (product !== "Current" || state !== "COMPLETED") continue;

              // Filter Rows: Amount < 0
              if (amount >= 0) continue;

              // Filter out "Credit card repayment" descriptions
              if (description.includes("credit card repayment")) continue;

              // Check if completedDate is valid
              if (!completedDate) {
                console.warn(`Skipping transaction with missing or invalid date: ${line}`);
                continue; // Skip this transaction
              }

              // Parse date, handle potential errors
              let parsedDate;
              try {
                parsedDate = parse(completedDate, 'dd/MM/yyyy HH:mm', new Date());
                if (isNaN(parsedDate.getTime())) {
                  throw new Error('Invalid date format');
                }
              } catch (error) {
                console.error(`Error parsing date: ${completedDate}`, error);
                continue; // Skip this transaction
              }

              // Assign category, defaulting to "Uncategorized" if not found
              const category = getCategoryForVendor(description) || "Uncategorized";

              transactions.push({
                id: uuidv4(),
                profile_id: user.id,
                date: format(parsedDate, 'yyyy-MM-dd'),
                description: `${description} (from file: ${file.name})`,
                amount: -amount, // Negate amount for expenses to make it positive
                currency,
                category,
              });
            }
          }

          // Aggregate transactions
          const aggregatedTransactions = aggregateTransactions(transactions);

          // Load
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

// Helper function to aggregate transactions
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
