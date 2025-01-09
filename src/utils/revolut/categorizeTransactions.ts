import { CATEGORY_MAPPINGS } from "@/constants/categoryMappings";
import type { RevolutTransactionDB } from "@/types/revolut";

export const categorizeTransactions = async (transactions: Omit<RevolutTransactionDB, "category">[]): Promise<RevolutTransactionDB[]> => {
  return transactions.map(transaction => {
    const description = transaction.description.toLowerCase();
    
    // Try to find a matching category based on vendor names
    for (const [categoryKey, mapping] of Object.entries(CATEGORY_MAPPINGS)) {
      const vendorMatch = mapping.vendors.some(vendor => 
        description.includes(vendor.toLowerCase())
      );
      
      if (vendorMatch) {
        return {
          ...transaction,
          category: mapping.displayName
        };
      }
    }

    // If no category is found, mark as uncategorized
    return {
      ...transaction,
      category: "Uncategorized"
    };
  });
};