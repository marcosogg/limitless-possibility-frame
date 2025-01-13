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

      // Query matching the actual table structure
      const { data, error } = await supabase
        .from('monthly_approvals')
        .select('id, user_id, month, year, approved_at, created_at')
        .eq('user_id', user.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;

      // Get transaction counts in a separate query
      const { data: transactionCounts, error: countError } = await supabase
        .from('revolut_transactions')
        .select('monthly_approval_id')
        .in('monthly_approval_id', data.map(a => a.id));

      if (countError) throw countError;

      // Group transactions by approval_id to get counts
      const countsByApprovalId = transactionCounts.reduce((acc, curr) => {
        acc[curr.monthly_approval_id] = (acc[curr.monthly_approval_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Combine the data
      const approvalData = data.map(approval => ({
        ...approval,
        revolut_transactions: {
          count: countsByApprovalId[approval.id] || 0
        }
      }));

      setApprovals(approvalData);
    } catch (error) {
      console.error('Error loading approvals:', error);
      toast({
        title: "Error loading import history",
        description: "Failed to load import history. Please try again.",
        variant: "destructive"
      });
      setApprovals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!selectedApproval) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);

      // Store values before clearing state
      const undoMonth = selectedApproval.month;
      const undoYear = selectedApproval.year;

      // Clear selection first to prevent UI issues
      setSelectedApproval(null);

      // Call RPC
      const { error: rpcError } = await supabase.rpc('undo_monthly_approval', {
        p_approval_id: selectedApproval.id,
        p_user_id: user.id
      });

      if (rpcError) throw rpcError;

      // Reload data
      await loadApprovals();

      // Show success message
      toast({
        title: "Import undone",
        description: `Successfully removed transactions for ${format(new Date(undoYear, undoMonth - 1), 'MMMM yyyy')}`,
      });
      
      // Notify parent
      onUndoComplete?.();
    } catch (error) {
      console.error('Error undoing import:', error);
      toast({
        title: "Error undoing import",
        description: "Failed to undo import. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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