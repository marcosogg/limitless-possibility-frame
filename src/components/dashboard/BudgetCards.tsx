import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sumMonthlySpending } from "@/utils/budgetCalculations";
import { Budget } from "@/types/budget";
import { RevolutTransactionDB } from "@/types/revolut";
import { useToast } from "@/hooks/use-toast";
import { PlannedBudgetCard } from "./PlannedBudgetCard";
import { CurrentStatusCard } from "./CurrentStatusCard";
import { useBudgetUpdates } from "@/hooks/useBudgetUpdates";

interface BudgetCardsProps {
  budget: Budget;
  onUpdateSpent: (updatedBudget: Budget) => void;
  selectedMonth: number;
  selectedYear: number;
}

export function BudgetCards({ budget, onUpdateSpent, selectedMonth, selectedYear }: BudgetCardsProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState<Budget>(budget);
  const { handleSpentChange, handleSave, isSaving } = useBudgetUpdates(editedBudget, budget.id, setIsEditing, onUpdateSpent);

  const { data: transactions, error, isLoading } = useQuery({
    queryKey: ['transactions', selectedMonth, selectedYear],
    queryFn: async () => {
      try {
        if (!selectedMonth || !selectedYear) {
          throw new Error('Month and year must be defined');
        }

        const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
        const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-31`;

        const { data, error } = await supabase
          .from('revolut_transactions')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate);

        if (error) throw error;
        return data as RevolutTransactionDB[];
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch transactions. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!selectedMonth && !!selectedYear,
  });

  useEffect(() => {
    setEditedBudget(budget);
  }, [budget]);

  useEffect(() => {
    if (transactions) {
      const monthlySpending = sumMonthlySpending(transactions);
      const updatedBudget = { ...budget };

      Object.entries(monthlySpending).forEach(([category, sum]) => {
        switch (category) {
          case "Takeaway coffee":
            updatedBudget.takeaway_coffee_spent = sum;
            break;
          case "Groceries & Supermarkets":
            updatedBudget.groceries_spent = sum;
            break;
          case "Restaurants, Cafes & Takeaway":
            updatedBudget.dining_out_spent = sum;
            break;
          case "Pubs & Bars":
            updatedBudget.entertainment_spent = sum;
            break;
          case "Clothing & Apparel":
            updatedBudget.shopping_spent = sum;
            break;
          case "Home & Hardware":
            updatedBudget.miscellaneous_spent = sum;
            break;
          case "Travel & Transportation":
            updatedBudget.transport_spent = sum;
            break;
          case "Health & Pharmacy":
            updatedBudget.health_fitness_spent = sum;
            break;
          case "Entertainment & Leisure":
            updatedBudget.entertainment_spent = sum;
            break;
          case "Online Services & Subscriptions":
            updatedBudget.miscellaneous_spent = sum;
            break;
          case "Other Retail":
            updatedBudget.shopping_spent = sum;
            break;
          case "Money Transfer":
            updatedBudget.miscellaneous_spent = sum;
            break;
          case "Education":
            updatedBudget.education_spent = sum;
            break;
          case "Personal Care":
            updatedBudget.personal_care_spent = sum;
            break;
          case "Utilities & Bills":
            updatedBudget.utilities_spent = sum;
            break;
          case "Miscellaneous":
            updatedBudget.miscellaneous_spent = sum;
            break;
          case "Uncategorized":
            updatedBudget.uncategorized_spent = sum;
            break;
        }
      });

      onUpdateSpent(updatedBudget);
    }
  }, [transactions, selectedMonth, selectedYear, budget.id]);

  if (error) {
    return <div>Error loading transactions</div>;
  }

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PlannedBudgetCard budget={budget} />
      <CurrentStatusCard
        budget={editedBudget}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        isSaving={isSaving}
        handleSpentChange={handleSpentChange}
      />
    </div>
  );
}