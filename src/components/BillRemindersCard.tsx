import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PenSquare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BillReminder {
  id: string;
  provider_name: string;
  due_date: number;
  amount: number;
  reminders_enabled: boolean;
}

export function BillRemindersCard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<BillReminder[]>([]);
  const [selectedReminder, setSelectedReminder] = useState<BillReminder | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bill_reminders')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setReminders(data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bill reminders",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (reminder: BillReminder) => {
    setSelectedReminder(reminder);
    navigate(`/billreminders/edit/${reminder.id}`);
  };

  const handleDelete = async () => {
    if (!selectedReminder) return;

    try {
      const { error } = await supabase
        .from('bill_reminders')
        .delete()
        .eq('id', selectedReminder.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill reminder deleted successfully",
      });

      // Refresh the reminders list
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({
        title: "Error",
        description: "Failed to delete bill reminder",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedReminder(null);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <Card className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
      <CardHeader className="p-4">
        <CardTitle className="text-[17px] font-semibold text-[#1C1E21]">Bill Remindersss</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="bg-[#F0F2F5] text-[13px] text-[#65676B] font-medium h-9">Provider</TableHead>
                <TableHead className="bg-[#F0F2F5] text-[13px] text-[#65676B] font-medium h-9">Due Date</TableHead>
                <TableHead className="bg-[#F0F2F5] text-[13px] text-[#65676B] font-medium h-9">Amount</TableHead>
                <TableHead className="bg-[#F0F2F5] text-[13px] text-[#65676B] font-medium h-9">SMS Reminder</TableHead>
                <TableHead className="bg-[#F0F2F5] text-[13px] text-[#65676B] font-medium h-9">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.map((reminder) => (
                <TableRow key={reminder.id} className="hover:bg-[#F2F3F5] transition-colors">
                  <TableCell className="text-[13px] text-[#1C1E21] py-2">{reminder.provider_name}</TableCell>
                  <TableCell className="text-[13px] text-[#1C1E21] py-2">Day {reminder.due_date}</TableCell>
                  <TableCell className="text-[13px] text-[#1C1E21] py-2">€{reminder.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-[13px] text-[#1C1E21] py-2">{reminder.reminders_enabled ? 'YES' : 'NO'}</TableCell>
                  <TableCell className="py-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-[#1877F2] hover:bg-[#F2F3F5] h-8 w-8"
                        onClick={() => handleEdit(reminder)}
                      >
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-[#FA383E] hover:bg-[#F2F3F5] h-8 w-8"
                        onClick={() => {
                          setSelectedReminder(reminder);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the bill reminder for {selectedReminder?.provider_name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}