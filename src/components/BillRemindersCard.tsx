import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { EditBillReminderDialog } from "./bill-reminder/EditBillReminderDialog";
import { useToast } from "@/hooks/use-toast";
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
  notes: string | null;
  reminders_enabled: boolean;
  phone_number: string | null;
}

export function BillRemindersCard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReminder, setSelectedReminder] = useState<BillReminder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: billReminders, isLoading } = useQuery({
    queryKey: ['billReminders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bill_reminders')
        .select('id, provider_name, due_date, amount, notes, reminders_enabled, phone_number')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as BillReminder[];
    },
  });

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

      queryClient.invalidateQueries({ queryKey: ['billReminders'] });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete bill reminder",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedReminder(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bill Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : billReminders && billReminders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>SMS Reminder</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billReminders.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.provider_name}</TableCell>
                  <TableCell>Day {bill.due_date}</TableCell>
                  <TableCell>€{bill.amount.toFixed(2)}</TableCell>
                  <TableCell>{bill.reminders_enabled ? 'YES' : 'NO'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedReminder(bill);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedReminder(bill);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No bill reminders found
          </p>
        )}
      </CardContent>

      {selectedReminder && (
        <EditBillReminderDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          reminder={selectedReminder}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['billReminders'] });
            setSelectedReminder(null);
          }}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the bill reminder for {selectedReminder?.provider_name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}