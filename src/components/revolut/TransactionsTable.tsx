import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RevolutTransaction } from "@/types/revolut";

interface TransactionsTableProps {
  transactions: RevolutTransaction[];
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Imported Transactions</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Started Date</TableHead>
              <TableHead>Completed Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.product}</TableCell>
                <TableCell>{transaction.startedDate}</TableCell>
                <TableCell>{transaction.completedDate}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.fee}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell>{transaction.state}</TableCell>
                <TableCell>{transaction.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}