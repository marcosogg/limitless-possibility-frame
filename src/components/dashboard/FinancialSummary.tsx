import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import { InfoIcon } from "lucide-react";

interface FinancialSummaryProps {
  totalIncome: number;
  plannedBudget: number;
  totalSpending: number;
}

export function FinancialSummary({ totalIncome, plannedBudget, totalSpending }: FinancialSummaryProps) {
  const availableAmount = totalIncome - totalSpending;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Total Income</p>
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
            <p className="text-2xl font-bold" aria-label={`Total income: ${formatCurrency(totalIncome)}`}>
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Planned Budget</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total amount planned for all budget categories</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold" aria-label={`Planned budget: ${formatCurrency(plannedBudget)}`}>
              {formatCurrency(plannedBudget)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Total Spending</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current total spending for this month</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold" aria-label={`Total spending: ${formatCurrency(totalSpending)}`}>
              {formatCurrency(totalSpending)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Available Amount</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remaining amount after current spending</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p 
              className={`text-2xl font-bold ${availableAmount < 0 ? 'text-destructive' : 'text-green-500'}`}
              aria-label={`Available amount: ${formatCurrency(availableAmount)}`}
            >
              {formatCurrency(availableAmount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 