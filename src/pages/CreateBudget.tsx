import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "../hooks/use-toast";
import { BudgetForm, formSchema } from "../components/budget/BudgetForm";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Budget } from "../types/budget";
import { CATEGORIES } from "../constants/budget";
import * as z from "zod";

export default function CreateBudget() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get month and year from location state or use current date
  const state = location.state as { month?: number; year?: number } | null;
  const defaultMonth = state?.month || new Date().getMonth() + 1;
  const defaultYear = state?.year || new Date().getFullYear();

  // Update the saveBudget function signature
const saveBudget = async (budgetData: Omit<Budget, 'id' | 'user_id'>) => {
  try {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("budgets")
      .upsert({
        user_id: user.id,
        month: parseInt(String(budgetData.month)),
        year: parseInt(String(budgetData.year)),
        ...budgetData,
      }, {
        onConflict: 'user_id,month,year'
      });

    if (error) throw error;

    toast({
      title: "Success",
      description: "Budget saved successfully",
    });

    // Complete the navigation
    navigate('/', {
      state: {
        month: parseInt(String(budgetData.month)),
        year: parseInt(String(budgetData.year))
      }
    });
  } catch (error) {
    console.error('Error saving budget:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to save budget. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
};

const handleSubmit = async (formValues: z.infer<typeof formSchema>) => {
  // Convert form values to required number types
  const budgetValues: Omit<Budget, 'id' | 'user_id'> = {
    month: parseInt(formValues.month),
    year: parseInt(formValues.year),
    salary: formValues.salary || 0,
    bonus: formValues.bonus || 0,
    rent: formValues.rent || 0,
    utilities: formValues.utilities || 0,
    groceries: formValues.groceries || 0,
    transport: formValues.transport || 0,
    entertainment: formValues.entertainment || 0,
    shopping: formValues.shopping || 0,
    miscellaneous: formValues.miscellaneous || 0,
    savings: formValues.savings || 0,
    dining_out: formValues.dining_out || 0,
    health_pharmacy: formValues.health_pharmacy || 0,
    fitness: formValues.fitness || 0,
    personal_care: formValues.personal_care || 0,
    travel: formValues.travel || 0,
    education: formValues.education || 0,
    takeaway_coffee: formValues.takeaway_coffee || 0,
    pubs_bars: formValues.pubs_bars || 0,
    clothing_apparel: formValues.clothing_apparel || 0,
    home_hardware: formValues.home_hardware || 0,
    online_services_subscriptions: formValues.online_services_subscriptions || 0,
    money_transfer: formValues.money_transfer || 0,
    delivery_takeaway: formValues.delivery_takeaway || 0,
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
    delivery_takeaway_spent: 0,
    uncategorized_spent: 0,
    created_at: null
  };

  await saveBudget(budgetValues);
};

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <BudgetForm onSubmit={handleSubmit} defaultMonth={defaultMonth} defaultYear={defaultYear} />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
