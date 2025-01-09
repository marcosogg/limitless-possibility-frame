import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TransactionFilters } from "./TransactionFilters";
import { format, parseISO, isWithinInterval } from "date-fns";
import type { RevolutTransactionDB } from "@/types/revolut";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_MAPPINGS } from "@/constants/categoryMappings";

interface TransactionsTableProps {
  transactions: RevolutTransactionDB[];
}

type SortConfig = {
  key: keyof RevolutTransactionDB;
  direction: "asc" | "desc";
} | null;

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filters, setFilters] = useState({
    category: "All",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    searchTerm: "",
  });
  const [manualCategories, setManualCategories] = useState<{ [id: string]: string }>({});

  const handleSort = (key: keyof RevolutTransactionDB) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const handleCategoryChange = (transactionId: string, category: string) => {
    setManualCategories(prev => ({ ...prev, [transactionId]: category }));
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply filters
    result = result.filter((transaction) => {
      const matchesCategory =
        filters.category === "All" || transaction.category === filters.category;
      
      const matchesSearch = filters.searchTerm
        ? transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        : true;

      const matchesDateRange = filters.dateFrom && filters.dateTo
        ? isWithinInterval(parseISO(transaction.date), {
            start: filters.dateFrom,
            end: filters.dateTo,
          })
        : true;

      return matchesCategory && matchesSearch && matchesDateRange;
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [transactions, sortConfig, filters]);

  return (
    <div className="space-y-4">
      <TransactionFilters onFilterChange={setFilters} />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("date")}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("description")}
                >
                  Description
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("category")}
                >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                Manual Category
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>
                  {format(parseISO(transaction.date), "PPP")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-IE", {
                    style: "currency",
                    currency: transaction.currency,
                  }).format(transaction.amount)}
                </TableCell>
                <TableCell>{transaction.category || "Uncategorized"}</TableCell>
                <TableCell>
                  <Select
                    value={manualCategories[transaction.id] || ""}
                    onValueChange={(value) => handleCategoryChange(transaction.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_MAPPINGS).map(([key, { displayName }]) => (
                        <SelectItem key={key} value={key}>
                          {displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
