import {
  Home,
  ShoppingCart,
  Utensils,
  Beer,
  Shirt,
  Wrench, // Replacing Tool
  Plane,
  Heart,
  Monitor,
  ShoppingBag,
  Wallet, // Replacing Money
  Book,
  User,
  Zap,
  MoreHorizontal,
  Coffee,
} from "lucide-react";

export const CATEGORIES = [
  { name: 'Rent', icon: Home, plannedKey: 'rent', spentKey: 'rent_spent' },
  { name: 'Groceries & Supermarkets', icon: ShoppingCart, plannedKey: 'groceries_supermarkets', spentKey: 'groceries_supermarkets_spent' },
  { name: 'Restaurants, Cafes & Takeaway', icon: Utensils, plannedKey: 'restaurants_cafes_takeaway', spentKey: 'restaurants_cafes_takeaway_spent' },
  { name: 'Pubs & Bars', icon: Beer, plannedKey: 'pubs_bars', spentKey: 'pubs_bars_spent' },
  { name: 'Clothing & Apparel', icon: Shirt, plannedKey: 'clothing_apparel', spentKey: 'clothing_apparel_spent' },
  { name: 'Home & Hardware', icon: Wrench, plannedKey: 'home_hardware', spentKey: 'home_hardware_spent' },
  { name: 'Travel & Transportation', icon: Plane, plannedKey: 'travel_transportation', spentKey: 'travel_transportation_spent' },
  { name: 'Health & Pharmacy', icon: Heart, plannedKey: 'health_pharmacy', spentKey: 'health_pharmacy_spent' },
  { name: 'Entertainment & Leisure', icon: Monitor, plannedKey: 'entertainment_leisure', spentKey: 'entertainment_leisure_spent' },
  { name: 'Online Services & Subscriptions', icon: Zap, plannedKey: 'online_services_subscriptions', spentKey: 'online_services_subscriptions_spent' },
  { name: 'Other Retail', icon: ShoppingBag, plannedKey: 'other_retail', spentKey: 'other_retail_spent' },
  { name: 'Money Transfer', icon: Wallet, plannedKey: 'money_transfer', spentKey: 'money_transfer_spent' },
  { name: 'Education', icon: Book, plannedKey: 'education', spentKey: 'education_spent' },
  { name: 'Personal Care', icon: User, plannedKey: 'personal_care', spentKey: 'personal_care_spent' },
  { name: 'Utilities & Bills', icon: Zap, plannedKey: 'utilities_bills', spentKey: 'utilities_bills_spent' },
  { name: 'Miscellaneous', icon: MoreHorizontal, plannedKey: 'miscellaneous', spentKey: 'miscellaneous_spent' },
  { name: 'Takeaway coffee', icon: Coffee, plannedKey: 'takeaway_coffee', spentKey: 'takeaway_coffee_spent' },
] as const;