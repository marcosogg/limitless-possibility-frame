// src/constants/categoryMappings.ts
import { Budget } from "@/types/budget";

interface CategoryMapping {
  displayName: string;
  budgetField: keyof Budget;
  vendors: string[];
}

export type CategoryMappings = Record<string, CategoryMapping>;

export const CATEGORY_MAPPINGS: CategoryMappings = {
  "takeaway_coffee": {
    displayName: "Takeaway Coffee",
    budgetField: "takeaway_coffee_spent",
    vendors: ["Starbucks", "Coffeeangel", "Clement & Pekoe", "Butlers Chocolates", "Insomnia Coffee Company"],
  },
  "groceries_supermarkets": {
    displayName: "Groceries & Supermarkets",
    budgetField: "groceries_spent",
    vendors: ["ALDI", "Centra", "Dunnes Stores", "Lidl", "Marks & Spencer", "SuperValu", "Tesco", "Asia Market", "Avoca", "Lotts & Co.", "Moldova"],
  },
  "restaurants_cafes_takeaway": {
    displayName: "Restaurants, Cafes & Takeaway",
    budgetField: "dining_out_spent",
    vendors: ["Boojum", "Bread 41", "Bunsen", "Chutni", "Deliveroo", "Fallon & Byrne", "Fresh The Good Food Market", "Gelato", "Il Forno", "Indian Eateries", "KC Peaches", "McDonald's", "Oakberry", "Sushida Rathmines", "The Sugar Loaf Bakery", "Zaytoon", "Amuri"],
  },
  "pubs_bars": {
    displayName: "Pubs & Bars",
    budgetField: "entertainment_spent",
    vendors: ["Dicey's Garden Club", "Doyles", "F.X. Buckley", "J D Wetherspoon", "Paddy Cullen's Pub", "Searsons Bar", "Slattery's D4", "The Barge", "The Bath Pub", "The Camden", "The Chatty Fox", "The Depot At The C", "The Hill", "The Jar"],
  },
  "clothing_apparel": {
    displayName: "Clothing & Apparel",
    budgetField: "shopping_spent",
    vendors: ["Arnotts", "Cotswold Outdoor", "Decathlon", "Guineys", "Penneys", "Superdry", "Temu", "Timberland", "Trespass", "UNIQLO"],
  },
  "home_hardware": {
    displayName: "Home & Hardware",
    budgetField: "miscellaneous_spent",
    vendors: ["Decwells Hardware", "IKEA"],
  },
  "travel_transportation": {
    displayName: "Travel & Transportation",
    budgetField: "transport_spent",
    vendors: ["Aer Lingus", "Aircoach", "Citi Bus", "Delta Air Lines", "FREE NOW", "Irish Rail", "National Transport Authority", "Transport for Ireland - TFI"],
  },
  "health_pharmacy": {
    displayName: "Health & Pharmacy",
    budgetField: "health_fitness_spent",
    vendors: ["Aungier Street Clinic", "Boots", "DrOnline", "Hickey’s Pharmacy", "LIFE Pharmacy"],
  },
  "entertainment_leisure": {
    displayName: "Entertainment & Leisure",
    budgetField: "entertainment_spent",
    vendors: ["Aviva Stadium", "Dublin Zoo", "Ticketmaster"],
  },
  "online_services_subscriptions": {
    displayName: "Online Services & Subscriptions",
    budgetField: "miscellaneous_spent",
    vendors: ["Amazon", "Amazon Prime", "Anthropic", "Daft.ie", "Google Cloud", "Gumroad", "Microsoft", "Microsoft 365", "OpenAI", "Plus plan fee", "Supabase", "Www.printables.com"],
  },
  "other_retail": {
    displayName: "Other Retail",
    budgetField: "shopping_spent",
    vendors: ["Dealz", "Euro Giant", "Maxi Zoo", "RELAY"],
  },
  "money_transfer": {
    displayName: "Money Transfer",
    budgetField: "miscellaneous_spent",
    vendors: ["Wise"],
  },
  "education": {
    displayName: "Education",
    budgetField: "education_spent",
    vendors: ["South East Technological University", "Codecademy"],
  },
  "personal_care": {
    displayName: "Personal Care",
    budgetField: "personal_care_spent",
    vendors: ["Fireplace Barbershop", "The Fireplace Barber Shop"],
  },
  "utilities_bills": {
    displayName: "Utilities & Bills",
    budgetField: "utilities_spent",
    vendors: ["To An Post Tv Licence", "To SSEAirtricity", "Virgin Media Ireland Limited"],
  },
  "miscellaneous": {
    displayName: "Miscellaneous",
    budgetField: "miscellaneous_spent",
    vendors: ["An Post", "To EUR Holidays", "To TATIANI MARIA DE FARIA", "Sugarloaf Bakery", "The Source Bulk Foods", "Tucano"],
  },
  "uncategorized": {
    displayName: "Uncategorized",
    budgetField: "uncategorized_spent",
    vendors: [],
  },
} as const;
