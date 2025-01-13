// src/utils/budgetCalculations.test.tsx
import { describe, it, expect } from 'vitest';
import { calculateTotalPlanned } from './budgetCalculations';
import { Budget } from '@/types/budget';

describe('calculateTotalPlanned', () => {
  it('calculates total planned expenses correctly', () => {
    const budget: Partial<Budget> = {
      month: 1,
      year: 2024,
      salary: 3000,
      bonus: 0,
      rent_planned: 1000,
      utilities_planned: 200,
      groceries_planned: 50,
      transport_planned: 40,
      entertainment_planned: 0,
      shopping_planned: 0,
      miscellaneous_planned: 50,
      savings_planned: 1000,
      dining_out_planned: 0,
      health_pharmacy_planned: 0,
      fitness_planned: 0,
      personal_care_planned: 0,
      travel_planned: 0,
      education_planned: 0,
      takeaway_coffee_planned: 25,
      pubs_bars_planned: 0,
      clothing_apparel_planned: 0,
      home_hardware_planned: 0,
      online_services_subscriptions_planned: 80,
      money_transfer_planned: 150,
      delivery_takeaway_planned: 0,
    };
    const totalPlanned = calculateTotalPlanned(budget as Budget);
    expect(totalPlanned).toBe(2595);
  });

  it('returns 0 for an empty budget', () => {
    const budget: Partial<Budget> = {};
    const totalPlanned = calculateTotalPlanned(budget as Budget);
    expect(totalPlanned).toBe(0);
  });

  it('handles budgets with some values set to zero', () => {
    const budget: Partial<Budget> = {
      month: 1,
      year: 2024,
      salary: 3000,
      bonus: 0,
      rent_planned: 1000,
      utilities_planned: 0,
      groceries_planned: 50,
      transport_planned: 40,
      entertainment_planned: 0,
      shopping_planned: 0,
      miscellaneous_planned: 50,
      savings_planned: 0,
      dining_out_planned: 0,
      health_pharmacy_planned: 0,
      fitness_planned: 0,
      personal_care_planned: 0,
      travel_planned: 0,
      education_planned: 0,
      takeaway_coffee_planned: 25,
      pubs_bars_planned: 0,
      clothing_apparel_planned: 0,
      home_hardware_planned: 0,
      online_services_subscriptions_planned: 80,
      money_transfer_planned: 150,
      delivery_takeaway_planned: 0,
    };
    const totalPlanned = calculateTotalPlanned(budget as Budget);
    expect(totalPlanned).toBe(1395);
  });
});
