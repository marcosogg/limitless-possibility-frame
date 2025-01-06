import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import MonthYearPicker from "@/components/MonthYearPicker";

const CreateBudget = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [formData, setFormData] = useState({
    salary: "0",
    bonus: "0",
    rent: "0",
    utilities: "0",
    groceries: "0",
    transport: "0",
    entertainment: "0",
    shopping: "0",
    miscellaneous: "0",
    savings: "0",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and decimal points
    if (!/^\d*\.?\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a budget",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("budgets").insert({
        month: selectedMonth,
        year: selectedYear,
        user_id: user.id,
        ...Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
        ),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget created successfully!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Create Monthly Budget</h1>
          <p className="text-muted-foreground">Select a month and enter your budget details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label>Select Month and Year</Label>
            <MonthYearPicker
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Monthly Income</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="text"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bonus">Bonus</Label>
                  <Input
                    id="bonus"
                    name="bonus"
                    type="text"
                    value={formData.bonus}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Expenses</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "rent",
                  "utilities",
                  "groceries",
                  "transport",
                  "entertainment",
                  "shopping",
                  "miscellaneous",
                  "savings",
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="capitalize">
                      {field}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      type="text"
                      value={formData[field as keyof typeof formData]}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit">Create Budget</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBudget;