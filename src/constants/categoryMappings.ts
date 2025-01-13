// src/constants/categoryMappings.ts
import { Budget } from "@/types/budget";

interface CategoryMapping {
  displayName: string;
  budgetField: keyof Budget;
  vendors: string[];
}

export type CategoryMappings = Record<string, CategoryMapping>;

export const CATEGORY_MAPPINGS: CategoryMappings = {
  "rent": {
    displayName: "Rent",
    budgetField: "rent_spent",
    vendors: [],
  },
  "utilities": {
    displayName: "Utilities",
    budgetField: "utilities_spent",
    vendors: ["To An Post Tv Licence", "To SSEAirtricity", "Virgin Media Ireland Limited"],
  },
  "groceries": {
    displayName: "Groceries",
    budgetField: "groceries_spent",
    vendors: ["ALDI", "Centra", "Dunnes Stores", "Lidl", "Marks & Spencer", "SuperValu", "Tesco", "Asia Market", "Avoca", "Lotts & Co.", "Moldova"],
  },
  "transport": {
    displayName: "Transport",
    budgetField: "transport_spent",
    vendors: ["Aircoach", "Citi Bus", "FREE NOW", "Irish Rail", "National Transport Authority", "Transport for Ireland - TFI"],
  },
  "entertainment": {
    displayName: "Entertainment",
    budgetField: "entertainment_spent",
    vendors: ["Aviva Stadium", "Dublin Zoo", "Ticketmaster"],
  },
  "shopping": {
    displayName: "Shopping",
    budgetField: "shopping_spent",
    vendors: ["Dealz", "Euro Giant", "     ", "RELAY"],
  },
  "miscellaneous": {
    displayName: "Miscellaneous",
    budgetField: "miscellaneous_spent",
    vendors: ["An Post", "To EUR Holidays", "To TATIANI MARIA DE FARIA", "Sugarloaf Bakery", "The Source Bulk Foods", "Tucano"],
  },
  "savings": {
    displayName: "Savings",
    budgetField: "savings_spent",
    vendors: [],
  },
  "dining_out": {
    displayName: "Dining Out",
    budgetField: "dining_out_spent",
    vendors: ["Bread 41", "Bunsen", "Chutni", "Fallon & Byrne", "Fresh The Good Food Market", "Gelato", "Il Forno", "Indian Eateries", "KC Peaches", "Oakberry", "Sushida Rathmines", "The Sugar Loaf Bakery", "Amuri"],
  },
  "health_pharmacy": {
    displayName: "Health & Pharmacy",
    budgetField: "health_pharmacy_spent",
    vendors: ["Aungier Street Clinic", "Boots", "DrOnline", "Hickey's Pharmacy", "LIFE Pharmacy"],
  },
  "fitness": {
    displayName: "Fitness",
    budgetField: "fitness_spent",
    vendors: [],
  },
  "personal_care": {
    displayName: "Personal Care",
    budgetField: "personal_care_spent",
    vendors: ["Fireplace Barbershop", "The Fireplace Barber Shop"],
  },
  "travel": {
    displayName: "Travel",
    budgetField: "travel_spent",
    vendors: ["Aer Lingus", "Delta Air Lines"],
  },
  "education": {
    displayName: "Education",
    budgetField: "education_spent",
    vendors: ["South East Technological University", "Codecademy"],
  },
  "takeaway_coffee": {
    displayName: "Takeaway Coffee",
    budgetField: "takeaway_coffee_spent",
    vendors: ["Starbucks", "Coffeeangel", "Clement & Pekoe", "Butlers Chocolates", "Insomnia Coffee Company"],
  },
  "pubs_bars": {
    displayName: "Pubs & Bars",
    budgetField: "pubs_bars_spent",
    vendors: ["Dicey's Garden Club", "Doyles", "F.X. Buckley", "J D Wetherspoon", "Paddy Cullen's Pub", "Searsons Bar", "Slattery's D4", "The Barge", "The Bath Pub", "The Camden", "The Chatty Fox", "The Depot At The C", "The Hill", "The Jar"],
  },
  "clothing_apparel": {
    displayName: "Clothing & Apparel",
    budgetField: "clothing_apparel_spent",
    vendors: ["Arnotts", "Cotswold Outdoor", "Decathlon", "Guineys", "Penneys", "Superdry", "Temu", "Timberland", "Trespass", "UNIQLO"],
  },
  "home_hardware": {
    displayName: "Home & Hardware",
    budgetField: "home_hardware_spent",
    vendors: ["Decwells Hardware", "IKEA"],
  },
  "online_services_subscriptions": {
    displayName: "Online Services & Subscriptions",
    budgetField: "online_services_subscriptions_spent",
    vendors: ["Amazon", "Amazon Prime", "Anthropic", "Daft.ie", "Google Cloud", "Gumroad", "Microsoft", "Microsoft 365", "OpenAI", "Plus plan fee", "Supabase", "Www.printables.com"],
  },
  "money_transfer": {
    displayName: "Money Transfer",
    budgetField: "money_transfer_spent",
    vendors: ["Wise"],
  },
  "delivery_takeaway": {
    displayName: "Delivery & Takeaway",
    budgetField: "delivery_takeaway_spent",
    vendors: ["Boojum", "Deliveroo", "McDonald's", "Zaytoon"],
  },
  "uncategorized": {
    displayName: "Uncategorized",
    budgetField: "uncategorized_spent",
    vendors: [],
  },
} as const;

