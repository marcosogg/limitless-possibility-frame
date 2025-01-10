import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BillReminderForm } from "@/components/bill-reminder/BillReminderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BillReminder } from "@/types/bill-reminder";

export default function EditBillReminder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reminder, setReminder] = useState<BillReminder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('bill_reminders')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setReminder(data);
      } catch (error) {
        console.error('Error fetching reminder:', error);
        toast({
          title: "Error",
          description: "Failed to fetch bill reminder",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchReminder();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg p-4 md:p-8 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!reminder) {
    return (
      <div className="min-h-screen gradient-bg p-4 md:p-8 flex items-center justify-center">
        <p className="text-white">Bill reminder not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/10 backdrop-blur-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Edit Bill Reminder</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <BillReminderForm initialData={reminder} mode="edit" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 