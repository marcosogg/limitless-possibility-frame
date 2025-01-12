import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImportHistoryProps {
  onUndoComplete?: () => void;
}

interface MonthlyApproval {
  id: string;
  month: number;
  year: number;
  created_at: string | null;
  approved_at: string | null;
  revolut_transactions: { count: number };
}

export function ImportHistory({ onUndoComplete }: ImportHistoryProps) {
  const [approvals, setApprovals] = useState<MonthlyApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<MonthlyApproval | null>(null);
  const { toast } = useToast();

  const loadApprovals = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('monthly_approvals')
        .select('*, revolut_transactions!monthly_approval_id(count)')
        .eq('user_id', user.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      
      // Debug log to see the actual data structure
      console.log('Approvals data:', data);
      
      setApprovals(data || []);
    } catch (error) {
      toast({
        title: "Error loading import history",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!selectedApproval) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Delete transactions first (they reference the approval)
      const { error: deleteTransactionsError } = await supabase
        .from('revolut_transactions')
        .delete()
        .match({ monthly_approval_id: selectedApproval.id });

      if (deleteTransactionsError) throw deleteTransactionsError;

      // Then delete the approval
      const { error: deleteApprovalError } = await supabase
        .from('monthly_approvals')
        .delete()
        .match({ id: selectedApproval.id });

      if (deleteApprovalError) throw deleteApprovalError;

      toast({
        title: "Import undone",
        description: `Successfully removed transactions for ${format(new Date(selectedApproval.year, selectedApproval.month - 1), 'MMMM yyyy')}`,
      });

      setSelectedApproval(null);
      loadApprovals();
      onUndoComplete?.();
    } catch (error) {
      toast({
        title: "Error undoing import",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Import History</h3>
      
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : approvals.length === 0 ? (
        <div className="text-sm text-gray-500">No imports found</div>
      ) : (
        <div className="grid gap-4">
          {approvals.map((approval) => (
            <div
              key={approval.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <div className="font-medium">
                  {format(new Date(approval.year, approval.month - 1), 'MMMM yyyy')}
                </div>
                <div className="text-sm text-gray-500">
                  {approval.revolut_transactions?.count || 0} transactions
                </div>
                <div className="text-xs text-gray-400">
                  Imported on {formatDate(approval.created_at)}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setSelectedApproval(approval)}
              >
                Undo Import
              </Button>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Undo Import</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to undo the import for {selectedApproval && 
                format(new Date(selectedApproval.year, selectedApproval.month - 1), 'MMMM yyyy')}?
              This will remove all transactions for this month and update your budget calculations.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUndo}>
              Yes, Undo Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 