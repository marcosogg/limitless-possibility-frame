import { useQuery } from "@tanstack/react-query";
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
import { Loader2 } from "lucide-react";

interface BillReminder {
  id: string;
  provider_name: string;
  due_date: number;
  amount: number;
  reminders_enabled: boolean;
}

export function BillRemindersCard() {
  const { data: billReminders, isLoading } = useQuery({
    queryKey: ['billReminders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bill_reminders')
        .select('id, provider_name, due_date, amount, reminders_enabled')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as BillReminder[];
    },
  });

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {billReminders.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.provider_name}</TableCell>
                  <TableCell>Day {bill.due_date}</TableCell>
                  <TableCell>€{bill.amount.toFixed(2)}</TableCell>
                  <TableCell>{bill.reminders_enabled ? 'YES' : 'NO'}</TableCell>
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
    </Card>
  );
}