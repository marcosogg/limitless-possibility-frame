import React, { useState } from 'react';
import { format } from 'date-fns';
import { processRevolutFile, approveMonthlyAnalysis } from '../../lib/revolut';
import type { RevolutTransaction } from '../../types/revolut';
import { IMPORT_LIMITS } from '../../constants/revolut';
import { ImportHistory } from './ImportHistory';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevolutMonthSelector } from './RevolutMonthSelector';

export function RevolutImport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<RevolutTransaction[]>([]);
  const [unmappedCategories, setUnmappedCategories] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setWarnings([]);

    try {
      const result = await processRevolutFile(file, selectedDate);
      if (result.success) {
        setTransactions(result.transactions);
        setUnmappedCategories(result.unmappedCategories);
        setWarnings(result.warnings || []);
        
        if (result.transactions.length === 0) {
          toast({
            title: "No transactions found",
            description: `No transactions found for ${format(selectedDate, 'MMMM yyyy')} in the uploaded file.`,
            variant: "default"
          });
        }
      } else {
        setError(result.errors.join('\n'));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!transactions.length) return;

    setIsLoading(true);
    setError(null);

    try {
      await approveMonthlyAnalysis(
        selectedDate.getMonth() + 1,
        selectedDate.getFullYear(),
        transactions
      );
      setTransactions([]);
      setUnmappedCategories([]);
      setWarnings([]);
      toast({
        title: "Import successful",
        description: `Transactions have been imported for ${format(selectedDate, 'MMMM yyyy')}.`,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Import failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndoComplete = () => {
    // Clear any existing import state
    setTransactions([]);
    setUnmappedCategories([]);
    setWarnings([]);
    setError(null);
    toast({
      description: "You can now re-import transactions for this month.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import" className="w-full">
        <TabsList>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="import">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Import Revolut Transactions</h2>
            
            <div className="space-y-4">
              <div className="mb-4">
                <RevolutMonthSelector
                  selectedDate={selectedDate}
                  onMonthChange={setSelectedDate}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Revolut CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Max file size: {IMPORT_LIMITS.maxFileSize / (1024 * 1024)}MB
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {warnings.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                  <p className="font-medium">Amount Adjustments:</p>
                  <ul className="list-disc list-inside">
                    {warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {unmappedCategories.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                  <p className="font-medium">Unmapped Categories:</p>
                  <ul className="list-disc list-inside">
                    {unmappedCategories.map(category => (
                      <li key={category}>{category}</li>
                    ))}
                  </ul>
                </div>
              )}

              {transactions.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Preview ({transactions.length} transactions)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(transaction.date, 'yyyy-MM-dd')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.category}
                              {transaction.category === 'Uncategorized' && (
                                <span className="ml-2 text-yellow-500">
                                  ({transaction.originalCategory})
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Approve & Import'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="bg-white p-4 rounded-lg shadow">
            <ImportHistory onUndoComplete={handleUndoComplete} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 