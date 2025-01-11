export const IMPORT_LIMITS = {
  maxFileSize: 2 * 1024 * 1024, // 2MB
  maxTransactions: 2000,
  allowedMonths: ['current', 'future'] as const,
  requiredFields: ['date', 'description', 'amount'] as const,
  validUntil: new Date('2025-12-31')
} as const;

export const DEFAULT_CATEGORY_MAPPINGS: Record<string, string> = {
  'Groceries': 'Food',
  'Restaurants': 'Food',
  'Transport': 'Transportation',
  'Shopping': 'Shopping',
  'Bills': 'Bills',
  'Entertainment': 'Entertainment',
  'Health': 'Healthcare',
  'Travel': 'Travel',
  'Services': 'Services'
};

export const DEFAULT_SETTINGS = {
  budgetUpdateMode: 'override' as const,
  categoryMappings: DEFAULT_CATEGORY_MAPPINGS,
  allowFutureMonths: true
} as const; 