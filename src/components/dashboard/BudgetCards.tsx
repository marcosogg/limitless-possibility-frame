import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home, Zap, ShoppingCart, Car, Tv, ShoppingBag, MoreHorizontal, PiggyBank } from "lucide-react";
import type { Budget } from "@/types/budget";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BudgetCardsProps {
  budget: Budget;
  formatCurrency: (amount: number) => string;
  onUpdateSpent: (updatedBudget: Budget) => void;
}

export function BudgetCards({ budget, formatCurrency, onUpdateSpent }: BudgetCardsProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState(budget);

  const categories = [
    { name: 'Rent', icon: Home, planned: budget.rent, spent: budget.rent_spent },
    { name: 'Utilities', icon: Zap, planned: budget.utilities, spent: budget.utilities_spent },
    { name: 'Groceries', icon: ShoppingCart, planned: budget.groceries, spent: budget.groceries_spent },
    { name: 'Transport', icon: Car, planned: budget.transport, spent: budget.transport_spent },
    { name: 'Entertainment', icon: Tv, planned: budget.entertainment, spent: budget.entertainment_spent },
    { name: 'Shopping', icon: ShoppingBag, planned: budget.shopping, spent: budget.shopping_spent },
    { name: 'Miscellaneous', icon: MoreHorizontal, planned: budget.miscellaneous, spent: budget.miscellaneous_spent },
    { name: 'Savings', icon: PiggyBank, planned: budget.savings, spent: budget.savings_spent },
  ];

  const calculateTotalPlanned = () => {
    return categories.reduce((acc, cat) => acc + cat.planned, 0);
  };

  const calculateTotalSpent = () => {
    return categories.reduce((acc, cat) => acc + cat.spent, 0);
  };

  const handleSpentChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditedBudget(prev => ({
      ...prev,
      [`${category.toLowerCase()}_spent`]: numValue
    }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          rent_spent: editedBudget.rent_spent,
          utilities_spent: editedBudget.utilities_spent,
          groceries_spent: editedBudget.groceries_spent,
          transport_spent: editedBudget.transport_spent,
          entertainment_spent: editedBudget.entertainment_spent,
          shopping_spent: editedBudget.shopping_spent,
          miscellaneous_spent: editedBudget.miscellaneous_spent,
          savings_spent: editedBudget.savings_spent,
        })
        .eq('id', budget.id);

      if (error) throw error;

      onUpdateSpent(editedBudget);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Planned</h3>
          <div className="space-y-4">
            {categories.map(({ name, icon: Icon, planned }) => (
              <div key={name} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{name}</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(planned)}</span>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Planned</span>
                <span className="font-semibold">{formatCurrency(calculateTotalPlanned())}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Spent</h3>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setIsEditing(false);
                  setEditedBudget(budget);
                }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {categories.map(({ name, icon: Icon, spent }) => (
              <div key={name} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{name}</span>
                </div>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedBudget[`${name.toLowerCase()}_spent` as keyof Budget]}
                    onChange={(e) => handleSpentChange(name, e.target.value)}
                    className="w-32 text-right"
                  />
                ) : (
                  <span className="text-sm font-medium">{formatCurrency(spent)}</span>
                )}
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Spent</span>
                <span className="font-semibold">{formatCurrency(calculateTotalSpent())}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Remaining</h3>
          <div className="space-y-4">
            {categories.map(({ name, icon: Icon, planned, spent }) => {
              const remaining = planned - spent;
              return (
                <div key={name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{name}</span>
                  </div>
                  <span className={`text-sm font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(remaining)}
                  </span>
                </div>
              );
            })}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Remaining</span>
                <span className={`font-semibold ${(budget.salary + budget.bonus - calculateTotalSpent()) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(budget.salary + budget.bonus - calculateTotalSpent())}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}