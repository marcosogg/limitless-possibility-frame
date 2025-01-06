import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BillReminderForm } from "@/components/BillReminderForm";

export default function BillReminders() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Bill Reminder</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>

        <BillReminderForm />
      </div>
    </div>
  );
}