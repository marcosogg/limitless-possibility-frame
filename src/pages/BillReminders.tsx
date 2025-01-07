import { useNavigate } from "react-router-dom";
import { BillReminderForm } from "@/components/bill-reminder/BillReminderForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BillReminders() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <BillReminderForm />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}