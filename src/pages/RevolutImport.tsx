import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RevolutTransaction {
  type: string;
  product: string;
  startedDate: string;
  completedDate: string;
  description: string;
  amount: string;
  fee: string;
  currency: string;
  state: string;
  balance: string;
}

export default function RevolutImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [transactions, setTransactions] = useState<RevolutTransaction[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === "text/csv") {
      await processFile(files[0]);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "text/csv") {
      await processFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const rows = text.split('\n');
      
      // Remove header row and parse remaining rows
      const header = rows[0].split(',');
      const parsedTransactions = rows.slice(1)
        .filter(row => row.trim()) // Skip empty rows
        .map(row => {
          const values = row.split(',');
          return {
            type: values[0] || '',
            product: values[1] || '',
            startedDate: values[2] || '',
            completedDate: values[3] || '',
            description: values[4] || '',
            amount: values[5] || '',
            fee: values[6] || '',
            currency: values[7] || '',
            state: values[8] || '',
            balance: values[9] || '',
          };
        });

      setTransactions(parsedTransactions);
      
      toast({
        title: "File processed",
        description: `Successfully processed ${parsedTransactions.length} transactions`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process the file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Import Revolut Statement</h1>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        } transition-colors mb-8`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <div className="space-y-2">
            <p className="text-lg">
              Drag and drop your Revolut statement here, or
            </p>
            <div>
              <label htmlFor="file-upload">
                <Button
                  disabled={isProcessing}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {isProcessing ? "Processing..." : "Upload Revolut Statement"}
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
            </div>
            <p className="text-sm text-gray-500">Only CSV files are supported</p>
          </div>
        </div>
      </div>

      {transactions.length > 0 && (
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
      )}
    </div>
  );
}