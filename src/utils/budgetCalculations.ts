import transactionCategories from "@/constants/transactionCategories.json";
import { RevolutTransactionDB } from "@/types/revolut";

export const sumMonthlySpending = (transactions: RevolutTransactionDB[] | undefined): Record<string, number> => {
  if (!transactions) {
    return {};
  }

  const spending: Record<string, number> = {};

  // Initialize all categories with 0, including "Uncategorized"
  Object.keys(transactionCategories).forEach(category => {
    spending[category] = 0;
  });
  spending["Uncategorized"] = 0;

  // Sum up transactions by category
  transactions.forEach(transaction => {
    let foundCategory = false;
    for (const [category, vendors] of Object.entries(transactionCategories)) {
      if (vendors.some(vendor => transaction.description.toLowerCase().includes(vendor.toLowerCase()))) {
        spending[category] += Math.abs(transaction.amount);
        foundCategory = true;
        break;
      }
    }
    // If no category is found, assign to "Uncategorized"
    if (!foundCategory) {
      spending["Uncategorized"] += Math.abs(transaction.amount);
    }
  });

  return spending;
};
