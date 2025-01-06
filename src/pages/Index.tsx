import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Budget {
  salary: number;
  bonus: number;
  rent: number;
  utilities: number;
  groceries: number;
  transport: number;
  entertainment: number;
  shopping: number;
  miscellaneous: number;
  savings: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBudget = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view budgets",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", date.getMonth() + 1)
        .eq("year", date.getFullYear())
        .maybeSingle();

      if (error) throw error;
      setBudget(data);
    } catch (error) {
      console.error("Error fetching budget:", error);
      toast({
        title: "Error",
        description: "Failed to fetch budget data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [date]);

  const calculateTotalIncome = () => {
    if (!budget) return 0;
    return budget.salary + budget.bonus;
  };

  const calculateTotalExpenses = () => {
    if (!budget) return 0;
    return (
      budget.rent +
      budget.utilities +
      budget.groceries +
      budget.transport +
      budget.entertainment +
      budget.shopping +
      budget.miscellaneous +
      budget.savings
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Monthly Budget Overview</h1>
          <Button 
            onClick={() => navigate("/createbudget")}
            className="bg-white text-indigo-600 hover:bg-gray-100"
          >
            Create New Budget
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <Card className="md:col-span-4 bg-white/10 backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle>Select Month</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="bg-white/5 rounded-lg p-3"
              />
            </CardContent>
          </Card>

          <div className="md:col-span-8 space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : budget ? (
              <>
                <Card className="bg-white/10 backdrop-blur-lg text-white">
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-green-500/20">
                      <p className="text-sm">Total Income</p>
                      <p className="text-2xl font-bold">{formatCurrency(calculateTotalIncome())}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/20">
                      <p className="text-sm">Total Expenses</p>
                      <p className="text-2xl font-bold">{formatCurrency(calculateTotalExpenses())}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/20">
                      <p className="text-sm">Remaining</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(calculateTotalIncome() - calculateTotalExpenses())}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg text-white">
                  <CardHeader>
                    <CardTitle>Detailed Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Income</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Salary</span>
                            <span>{formatCurrency(budget.salary)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bonus</span>
                            <span>{formatCurrency(budget.bonus)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Expenses</h3>
                        <div className="space-y-2">
                          {[
                            ['Rent', budget.rent],
                            ['Utilities', budget.utilities],
                            ['Groceries', budget.groceries],
                            ['Transport', budget.transport],
                            ['Entertainment', budget.entertainment],
                            ['Shopping', budget.shopping],
                            ['Miscellaneous', budget.miscellaneous],
                            ['Savings', budget.savings],
                          ].map(([label, value]) => (
                            <div key={label} className="flex justify-between">
                              <span>{label}</span>
                              <span>{formatCurrency(value as number)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg text-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg mb-4">No budget found for this month</p>
                  <Button 
                    onClick={() => navigate("/createbudget")}
                    className="bg-white text-indigo-600 hover:bg-gray-100"
                  >
                    Create Budget
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;