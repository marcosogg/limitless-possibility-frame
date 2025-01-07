// src/pages/BillReminders.tsx
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BillReminderForm } from "@/components/bill-reminder/BillReminderForm";
import type { BillReminderInsert } from "@/types/bill-reminder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function BillReminders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const saveBillReminder = async (billData: any) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("bill_reminders")
        .insert({
          user_id: user.id,
          ...billData,
          due_date: parseInt(billData.dueDate),
          amount: parseFloat(billData.amount),
          reminders_enabled: billData.smsReminders,
          phone_number: billData.smsReminders ? "+353838770548" : null,
        } as BillReminderInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill reminder created successfully",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error saving bill reminder:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    await saveBillReminder(values);
  };

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <BillReminderForm onSubmit={handleSubmit} />
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
