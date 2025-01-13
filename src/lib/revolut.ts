import { parse } from 'papaparse';
import { startOfMonth, isAfter, isBefore, parseISO, format } from 'date-fns';
import { DEFAULT_SETTINGS, IMPORT_LIMITS } from '../constants/revolut';
import { CATEGORY_MAPPINGS } from '../constants/categoryMappings';
import type { RevolutTransaction, ImportResult } from '../types/revolut';
import { supabase } from '../integrations/supabase/client';

const FAILED_IMPORTS_KEY = 'revolut_failed_imports';

// Special case handlers
const SPECIAL_CASES = {
  'to trading places': {
    category: 'Rent',
    transform: (amount: number) => {
      if (amount === -2200) {
        return 1000; // Convert 2200 to 1000 for rent
      }
      return -amount; // Default case: just make positive
    },
    warning: 'Rent payment adjusted from 2200 to 1000 (roommate portion excluded)'
  },
  'to eur holidays': {
    category: 'Savings',
    transform: (amount: number) => -amount, // Just make positive
    warning: null
  }
} as const;

// Helper function to find category based on vendor name
function findCategory(description: string): string {
  const normalizedDescription = description.trim().toLowerCase();
  
  // Check special cases first
  for (const [key, value] of Object.entries(SPECIAL_CASES)) {
    if (normalizedDescription.includes(key)) {
      return value.category;
    }
  }
  
  // Check regular category mappings
  for (const [category, mapping] of Object.entries(CATEGORY_MAPPINGS)) {
    if (mapping.vendors.some(vendor => 
      normalizedDescription.includes(vendor.toLowerCase())
    )) {
      return mapping.displayName;
    }
  }
  
  return 'Uncategorized';
}

// Helper function to transform amount based on special cases
function transformAmount(description: string, amount: number): { amount: number; warning: string | null } {
  const normalizedDescription = description.trim().toLowerCase();
  
  for (const [key, value] of Object.entries(SPECIAL_CASES)) {
    if (normalizedDescription.includes(key)) {
      return {
        amount: value.transform(amount),
        warning: value.warning
      };
    }
  }
  
  return {
    amount: -amount, // Default: just make positive
    warning: null
  };
}

export async function processRevolutFile(file: File, selectedDate: Date): Promise<ImportResult> {
  // Validate file size
  if (file.size > IMPORT_LIMITS.maxFileSize) {
    return {
      success: false,
      transactions: [],
      errors: [`File size exceeds ${IMPORT_LIMITS.maxFileSize / (1024 * 1024)}MB limit`],
      unmappedCategories: []
    };
  }

  const selectedMonth = startOfMonth(selectedDate);
  const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);

  return new Promise((resolve) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const transactions: RevolutTransaction[] = [];
        const errors: string[] = [];
        const unmappedCategories = new Set<string>();
        const warnings: string[] = [];

        if (results.data.length > IMPORT_LIMITS.maxTransactions) {
          errors.push(`Transaction count exceeds ${IMPORT_LIMITS.maxTransactions} limit`);
          resolve({ success: false, transactions: [], errors, unmappedCategories: [], warnings });
          return;
        }

        // ETL Process matching Power Query steps
        const processedData = results.data
          // 1. Filter completed transactions
          .filter(row => row.State === 'COMPLETED')
          // 2. Filter out null completed dates
          .filter(row => row['Completed Date'] && row['Completed Date'].trim() !== '')
          // 3. Filter negative amounts
          .filter(row => {
            const amount = parseFloat(row.Amount);
            return !isNaN(amount) && amount < 0;
          })
          // 4. Filter out credit card repayments
          .filter(row => !row.Description.toLowerCase().includes('credit card repayment'));

        processedData.forEach((row: any, index: number) => {
          try {
            let date;
            try {
              date = parseISO(row['Completed Date']);
              if (isNaN(date.getTime())) {
                errors.push(`Row ${index + 1}: Invalid date format`);
                return;
              }
            } catch (error) {
              errors.push(`Row ${index + 1}: Invalid date format`);
              return;
            }

            // Filter transactions not in the selected month
            if (isBefore(date, selectedMonth) || !isBefore(date, nextMonth)) {
              return; // Skip transactions outside selected month
            }

            if (isAfter(date, IMPORT_LIMITS.validUntil)) {
              errors.push(`Row ${index + 1}: Transaction date after ${IMPORT_LIMITS.validUntil}`);
              return;
            }

            // Clean and normalize description
            const description = row.Description.trim().toLowerCase().replace(/\s+/g, ' ');
            
            // Find category based on description
            const mappedCategory = findCategory(description);
            
            if (mappedCategory === 'Uncategorized') {
              unmappedCategories.add(description);
            }

            // Transform amount and get any warnings
            const { amount, warning } = transformAmount(description, parseFloat(row.Amount));
            if (warning) {
              warnings.push(`${description}: ${warning}`);
            }

            transactions.push({
              date,
              description: `${description} (from file: ${file.name})`,
              amount,
              category: mappedCategory,
              original_category: row.Type
            });
          } catch (error) {
            errors.push(`Row ${index + 1}: ${error.message}`);
          }
        });

        // Deduplicate transactions
        const uniqueTransactions = deduplicateTransactions(transactions);

        if (errors.length > 0) {
          // Store failed imports for retry
          const failedImports = JSON.parse(localStorage.getItem(FAILED_IMPORTS_KEY) || '[]');
          failedImports.push({
            timestamp: new Date().toISOString(),
            errors,
            rawData: results.data
          });
          localStorage.setItem(FAILED_IMPORTS_KEY, JSON.stringify(failedImports));
        }

        resolve({
          success: errors.length === 0,
          transactions: uniqueTransactions,
          errors,
          unmappedCategories: Array.from(unmappedCategories),
          warnings
        });
      },
      error: (error) => {
        resolve({
          success: false,
          transactions: [],
          errors: [error.message],
          unmappedCategories: [],
          warnings: []
        });
      }
    });
  });
}

// Helper function to deduplicate transactions
function deduplicateTransactions(transactions: RevolutTransaction[]): RevolutTransaction[] {
  const transactionMap = new Map<string, RevolutTransaction>();

  transactions.forEach(transaction => {
    const key = `${format(transaction.date, 'yyyy-MM-dd')}-${transaction.description}-${transaction.amount}`;
    if (!transactionMap.has(key)) {
      transactionMap.set(key, transaction);
    }
  });

  return Array.from(transactionMap.values());
}

export async function approveMonthlyAnalysis(
  month: number,
  year: number,
  transactions: RevolutTransaction[]
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Check if approval already exists
  const { data: existingApproval } = await supabase
    .from('monthly_approvals')
    .select()
    .match({ user_id: user.id, month, year })
    .single();

  if (existingApproval) {
    throw new Error(`You have already approved transactions for ${month}/${year}. Please undo the previous approval first.`);
  }

  // Create monthly approval first
  const { data: approval, error: approvalError } = await supabase
    .from('monthly_approvals')
    .insert({
      month,
      year,
      user_id: user.id
    })
    .select()
    .single();

  if (approvalError) throw approvalError;
  if (!approval) throw new Error('Failed to create monthly approval');

  // Add user_id and monthly_approval_id to each transaction
  const transactionsWithRefs = transactions.map(transaction => ({
    ...transaction,
    user_id: user.id,
    monthly_approval_id: approval.id
  }));

  const { error: transactionError } = await supabase
    .from('revolut_transactions')
    .insert(transactionsWithRefs);

  if (transactionError) {
    // Rollback approval if transaction insert fails
    await supabase
      .from('monthly_approvals')
      .delete()
      .match({ id: approval.id });
    throw transactionError;
  }
}

export async function undoMonthlyApproval(
  month: number,
  year: number
): Promise<void> {
  const currentDate = new Date();
  if (month !== currentDate.getMonth() + 1 || year !== currentDate.getFullYear()) {
    throw new Error('Can only undo current month approvals');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Get the approval first
  const { data: approval } = await supabase
    .from('monthly_approvals')
    .select()
    .match({ user_id: user.id, month, year })
    .single();

  if (!approval) {
    throw new Error(`No approval found for ${month}/${year}`);
  }

  // Delete transactions first (they reference the approval)
  const { error: transactionError } = await supabase
    .from('revolut_transactions')
    .delete()
    .match({ monthly_approval_id: approval.id });

  if (transactionError) throw transactionError;

  // Then delete the approval
  const { error: approvalError } = await supabase
    .from('monthly_approvals')
    .delete()
    .match({ id: approval.id });

  if (approvalError) throw approvalError;
} 