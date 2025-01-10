import { SimpleTransaction } from '@/types/revolut';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const filterTransactionsByMonth = (
  transactions: SimpleTransaction[],
  targetDate: Date
): SimpleTransaction[] => {
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);

  return transactions.filter((transaction) =>
    isWithinInterval(new Date(transaction.date), {
      start: monthStart,
      end: monthEnd,
    })
  );
};

export const detectDuplicates = (
  transactions: SimpleTransaction[]
): SimpleTransaction[] => {
  const seen = new Set<string>();
  return transactions.filter((transaction) => {
    const key = `${transaction.date}_${transaction.amount}_${transaction.description}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const processMonthlyTransactions = (
  transactions: SimpleTransaction[],
  targetDate: Date
): SimpleTransaction[] => {
  const monthlyTransactions = filterTransactionsByMonth(transactions, targetDate);
  const uniqueTransactions = detectDuplicates(monthlyTransactions);
  return uniqueTransactions;
}; 