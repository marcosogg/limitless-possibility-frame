import { useEffect } from "react";
import { Budget } from "../types/budget";
import { RevolutTransactionDB } from "../types/revolut";
import { sumMonthlySpending } from "../utils/budgetCalculations";
import { CATEGORIES } from "../constants/budget";

type BudgetSpentKeys = {
  [K in keyof Budget]: K extends `${string}_spent` ? K : never
}[keyof Budget];

export function useBudgetSpentUpdate(
  transactions: RevolutTransactionDB[] | undefined,
  budget: Budget,
  onUpdateSpent: (updatedBudget: Budget) => void,
  selectedMonth: number,
  selectedYear: number
) {
  useEffect(() => {
    if (transactions) {
      const monthlySpending = sumMonthlySpending(transactions);

      const updatedBudget: Budget = {
        ...budget,
        // Initialize all spent fields to 0
        rent_spent: 0,
        utilities_spent: 0,
        groceries_spent: 0,
        transport_spent: 0,
        entertainment_spent: 0,
        shopping_spent: 0,
        miscellaneous_spent: 0,
        savings_spent: 0,
        dining_out_spent: 0,
        health_pharmacy_spent: 0,
        fitness_spent: 0,
        personal_care_spent: 0,
        travel_spent: 0,
        education_spent: 0,
        takeaway_coffee_spent: 0,
        pubs_bars_spent: 0,
        clothing_apparel_spent: 0,
        home_hardware_spent: 0,
        online_services_subscriptions_spent: 0,
        money_transfer_spent: 0,
        delivery_takeaway_spent: 0
      };

      Object.entries(monthlySpending).forEach(([category, sum]) => {
        const budgetCategory = CATEGORIES.find(cat => cat.name === category);
        
        if (budgetCategory) {
          const spentKey = budgetCategory.spentKey;
          updatedBudget[spentKey as BudgetSpentKeys] = Number(sum);
        }
      });

      onUpdateSpent(updatedBudget);
    }
  }, [transactions, budget, onUpdateSpent, selectedMonth, selectedYear]);
}
