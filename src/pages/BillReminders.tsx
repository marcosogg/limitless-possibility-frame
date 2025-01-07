// src/pages/BillReminders.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BillReminderForm } from "@/components/bill-reminder/BillReminderForm";
import type { BillReminderInsert } from "@/types/bill-reminder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BillReminders() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const saveBillReminder = async (billReminderData: any) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("bill_reminders")
        .insert({
          user_id: user.id,
          ...billReminderData,
          due_date: parseInt(billReminderData.dueDate),
          amount: parseFloat(billReminderData.amount),
          reminders_enabled: billReminderData.smsReminders,
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
