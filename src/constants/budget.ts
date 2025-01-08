import {
  Home,
  ShoppingCart,
  Utensils,
  Beer,
  Shirt,
  Wrench,
  Plane,
  Heart,
  Monitor,
  ShoppingBag,
  Wallet,
  Book,
  User,
  Zap,
  MoreHorizontal,
  Coffee,
  Gift,
} from "lucide-react";

export const CATEGORIES = [
  { name: 'Rent', icon: Home, plannedKey: 'rent', spentKey: 'rent_spent' },
  { name: 'Utilities', icon: Zap, plannedKey: 'utilities', spentKey: 'utilities_spent' },
  { name: 'Groceries', icon: ShoppingCart, plannedKey: 'groceries', spentKey: 'groceries_spent' },
  { name: 'Transport', icon: Plane, plannedKey: 'transport', spentKey: 'transport_spent' },
  { name: 'Entertainment', icon: Monitor, plannedKey: 'entertainment', spentKey: 'entertainment_spent' },
  { name: 'Shopping', icon: ShoppingBag, plannedKey: 'shopping', spentKey: 'shopping_spent' },
  { name: 'Miscellaneous', icon: MoreHorizontal, plannedKey: 'miscellaneous', spentKey: 'miscellaneous_spent' },
  { name: 'Savings', icon: Wallet, plannedKey: 'savings', spentKey: 'savings_spent' },
  { name: 'Dining Out', icon: Utensils, plannedKey: 'dining_out', spentKey: 'dining_out_spent' },
  { name: 'Health & Fitness', icon: Heart, plannedKey: 'health_fitness', spentKey: 'health_fitness_spent' },
  { name: 'Personal Care', icon: User, plannedKey: 'personal_care', spentKey: 'personal_care_spent' },
  { name: 'Gifts & Donations', icon: Gift, plannedKey: 'gifts_donations', spentKey: 'gifts_donations_spent' },
  { name: 'Travel', icon: Plane, plannedKey: 'travel', spentKey: 'travel_spent' },
  { name: 'Education', icon: Book, plannedKey: 'education', spentKey: 'education_spent' },
] as const;