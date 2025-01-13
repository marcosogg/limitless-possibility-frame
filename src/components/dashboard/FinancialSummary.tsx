import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { InfoIcon } from "lucide-react";

interface FinancialSummaryProps {
  totalIncome: number;
  plannedBudget: number;
  totalSpending: number;
}

export function FinancialSummary({ totalIncome, plannedBudget, totalSpending }: FinancialSummaryProps) {
  const availableToSpend = plannedBudget - totalSpending;
  const spendingPercentage = (totalSpending / plannedBudget) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Primary Focus: Spending Progress and Available Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Budget Progress</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your spending progress against planned budget</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p 
                className={`text-3xl font-bold ${availableToSpend < 0 ? 'text-destructive' : 'text-green-500'}`}
                aria-label={`Available to spend: ${formatCurrency(availableToSpend)}`}
              >
                {formatCurrency(availableToSpend)}
              </p>
            </div>
            <Progress 
              value={Math.min(spendingPercentage, 100)} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Spent: {formatCurrency(totalSpending)}</span>
              <span>Budget: {formatCurrency(plannedBudget)}</span>
            </div>
          </div>

          {/* Secondary Information */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your total monthly income including salary and bonus</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xl font-semibold" aria-label={`Monthly income: ${formatCurrency(totalIncome)}`}>
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentage of income not allocated to budget</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xl font-semibold">
                {Math.round((totalIncome - plannedBudget) / totalIncome * 100)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 