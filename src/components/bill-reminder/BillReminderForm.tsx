import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { BillReminderFormFields } from "./BillReminderFormFields";
import { WhatsAppToggle } from "./WhatsAppToggle";
import { BillReminderFormData, initialFormData } from "@/types/bill-reminder";
import { handleBillReminderSubmit } from "./BillReminderSubmitHandler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const DEFAULT_PHONE = "+353838770548";

export function BillReminderForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BillReminderFormData>(initialFormData);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([DEFAULT_PHONE]);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await handleBillReminderSubmit(
        formData,
        phoneNumbers,
        scheduleDate,
        scheduleTime
      );

      if (result === false) {
        setLoading(false);
        return;
      }

      if (typeof result === 'object' && result.warning) {
        toast({
          variant: "destructive",
          title: "Warning",
          description: result.warning,
        });
      } else {
        toast({
          title: "Success",
          description: scheduleDate 
            ? "Bill reminder(s) created and SMS scheduled successfully"
            : "Bill reminder(s) created successfully",
        });
      }

      setFormData(initialFormData);
      setPhoneNumbers([DEFAULT_PHONE]);
      setScheduleDate(undefined);
      setScheduleTime("12:00");
      navigate("/");
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (value: string, index: number = 0) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Add Bill Reminder</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
        <CardDescription>
          Set up automatic reminders for your recurring bills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BillReminderFormFields formData={formData} setFormData={setFormData} />
          
          <WhatsAppToggle
            checked={formData.reminders_enabled}
            onChange={(checked) => setFormData({ ...formData, reminders_enabled: checked })}
            phoneNumber={phoneNumbers[0]}
            onPhoneNumberChange={handlePhoneNumberChange}
            scheduleDate={scheduleDate}
            onScheduleDateChange={setScheduleDate}
            scheduleTime={scheduleTime}
            onScheduleTimeChange={setScheduleTime}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Bill Reminder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}