import { describe, it, expect } from 'vitest';
import { sumMonthlySpending, calculatePercentage } from './budgetCalculations';
import type { Budget } from '@/types/budget';
import type { SimpleTransaction } from '@/types/revolut';

describe('budgetCalculations', () => {
  it('should calculate monthly spending correctly', () => {
    const transactions: SimpleTransaction[] = [
      {
        date: new Date('2024-01-15'),
        amount: 1000,
        description: 'Rent payment',
        category: 'Rent',
        uploadDate: new Date('2024-01-15')
      },
      {
        date: new Date('2024-01-20'),
        amount: 500,
        description: 'Groceries',
        category: 'Groceries',
        uploadDate: new Date('2024-01-20')
      }
    ];

    const result = sumMonthlySpending(transactions);
    expect(result).toEqual({
      'Rent': 1000,
      'Groceries': 500
    });
  });

  it('should calculate percentage correctly', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(200, 100)).toBe(200);
    expect(calculatePercentage(0, 100)).toBe(0);
    expect(calculatePercentage(50, 0)).toBe(0);
  });
});