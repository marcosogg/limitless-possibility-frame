import { Budget } from "@/types/budget";
import { RevolutTransaction } from "@/types/revolut";
import { CATEGORIES } from "@/constants/budget";

export const calculatePercentage = (spent: number, planned: number): number => {
  if (spent === 0 || planned === 0) return 0;
  return (spent / planned) * 100;
};

export const sumMonthlySpending = (transactions: RevolutTransaction[] | undefined): Record<string, number> => {
  if (!transactions) {
    return {};
  }

  const spending: Record<string, number> = {};

  transactions.forEach(transaction => {
    const category = transaction.category || "Uncategorized";
    spending[category] = (spending[category] || 0) + Math.abs(transaction.amount);
  });

  return spending;
};

export const calculateTotalPlanned = (budget: Budget): number => {
  return CATEGORIES.reduce((total, category) => {
    return total + Number(budget[category.plannedKey as keyof Budget] || 0);
  }, 0);
};

export const calculateTotalSpent = (budget: Budget): number => {
  let total = 0;
  for (const key in budget) {
    // Only sum up spent amounts (keys that end with '_spent')
    if (key.endsWith('_spent') && typeof budget[key as keyof Budget] === 'number') {
      total += Number(budget[key as keyof Budget]);
    }
  }
  return total;
};