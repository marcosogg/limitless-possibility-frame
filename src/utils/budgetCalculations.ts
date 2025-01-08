import { Budget } from "@/types/budget";
import { CATEGORIES } from "@/constants/budget";

export const calculatePercentage = (spent: number, planned: number): number => {
  if (planned === 0) return spent > 0 ? 100 : 0;
  return (spent / planned) * 100;
};

export const calculateTotalPlanned = (budget: Budget): number => {
  return CATEGORIES.reduce((acc, cat) => {
    const value = Number(budget[cat.plannedKey as keyof Budget]) || 0;
    return acc + value;
  }, 0);
};

export const calculateTotalSpent = (budget: Budget): number => {
  return CATEGORIES.reduce((acc, cat) => {
    const value = Number(budget[cat.spentKey as keyof Budget]) || 0;
    return acc + value;
  }, 0);
};