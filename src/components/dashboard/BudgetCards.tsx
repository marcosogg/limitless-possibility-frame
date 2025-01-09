// src/components/dashboard/BudgetCards.tsx
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sumMonthlySpending } from "@/utils/budgetCalculations";
import { Budget } from "@/types/budget";
import { RevolutTransactionDB } from "@/types/revolut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/budget";
import { formatCurrency } from "@/lib/utils";
import { PlannedBudgetCard } from "./PlannedBudgetCard";
import { BudgetProgressItem } from "./BudgetProgressItem";
import { useToast } from "@/hooks/use-toast";

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
  const [isSaving, setIsSaving] = useState(false);

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

      // Create updated budget with new spent amounts
      const updatedBudget = { ...budget };

      // Map category sums to budget spent fields
      Object.entries(monthlySpending).forEach(([category, sum]) => {
        // Map the category to the corresponding budget field
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

      // Update the budget with new spent amounts
      onUpdateSpent(updatedBudget);
    }
  }, [transactions, selectedMonth, selectedYear, budget.id]);

  const handleSpentChange = (spentKey: string, value: string) => {
    // Only validate if the value is not empty
    if (value !== "") {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid positive number.",
          variant: "destructive",
        });
        return;
      }
      setEditedBudget(prev => ({
        ...prev,
        [spentKey]: numValue
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.fromEntries(
        CATEGORIES.map((cat) => [
          cat.spentKey,
          Number(editedBudget[cat.spentKey as keyof Budget]),
        ])
      );

      const { error } = await supabase
        .from("budgets")
        .update(updates)
        .eq("id", budget.id);

      if (error) throw error;

      onUpdateSpent(editedBudget);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateTotalSpent = (budget: Budget): number => {
    let totalSpent = 0;
    for (const key in budget) {
      if (key.endsWith('_spent')) {
        totalSpent += Number(budget[key as keyof Budget]);
      }
    }
    return totalSpent;
  };

  if (error) {
    return <div>Error loading transactions</div>;
  }

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PlannedBudgetCard budget={budget} />

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Current Status
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                onClick={() => setIsEditing(true)}
              >
                Update Expenses
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedBudget(budget);
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {CATEGORIES.map(({ name, icon: Icon, plannedKey, spentKey }) => (
              <BudgetProgressItem
                key={name}
                name={name}
                Icon={Icon}
                spent={Number(editedBudget[spentKey as keyof Budget] || 0)}
                planned={Number(editedBudget[plannedKey as keyof Budget] || 0)}
                isEditing={isEditing}
                onSpentChange={handleSpentChange}
              />
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Spent</span>
                <span className="font-semibold">
                  {formatCurrency(calculateTotalSpent(editedBudget))}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}