// src/constants/budget.ts
import { Home, Zap, ShoppingCart, Car, Tv, ShoppingBag, MoreHorizontal, PiggyBank } from "lucide-react";

export const CATEGORIES = [
  { name: 'Rent', icon: Home, plannedKey: 'rent', spentKey: 'rent_spent' },
  { name: 'Utilities', icon: Zap, plannedKey: 'utilities', spentKey: 'utilities_spent' },
  { name: 'Groceries', icon: ShoppingCart, plannedKey: 'groceries', spentKey: 'groceries_spent' },
  { name: 'Transport', icon: Car, plannedKey: 'transport', spentKey: 'transport_spent' },
  { name: 'Entertainment', icon: Tv, plannedKey: 'entertainment', spentKey: 'entertainment_spent' },
  { name: 'Shopping', icon: ShoppingBag, plannedKey: 'shopping', spentKey: 'shopping_spent' },
  { name: 'Miscellaneous', icon: MoreHorizontal, plannedKey: 'miscellaneous', spentKey: 'miscellaneous_spent' },
  { name: 'Savings', icon: PiggyBank, plannedKey: 'savings', spentKey: 'savings_spent' },
] as const;
