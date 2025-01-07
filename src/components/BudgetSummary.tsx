import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  totalSpent: number;
  remaining: number;
}

const BudgetSummary = ({ totalIncome, totalExpenses, totalSpent, remaining }: BudgetSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (spent: number, total: number) => {
    if (total === 0) return 0;
    return Math.min((spent / total) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white/10 backdrop-blur-lg text-white">
        <CardContent className="p-4">
          <p className="text-sm">Total Income</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-lg text-white">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400">
            {formatCurrency(totalSpent)} / {formatCurrency(totalExpenses)}
          </p>
          <Progress 
            value={calculateProgress(totalSpent, totalExpenses)} 
            className="h-2 bg-white/20"
          />
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-lg text-white">
        <CardContent className="p-4">
          <p className="text-sm">Remaining</p>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(remaining)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;