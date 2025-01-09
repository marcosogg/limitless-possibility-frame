import { CATEGORY_MAPPINGS } from "@/constants/categoryMappings";

export const getCategoryForVendor = (description: string): string | null => {
  const normalizedDescription = description.toLowerCase();
  
  for (const [categoryKey, mapping] of Object.entries(CATEGORY_MAPPINGS)) {
    const vendorMatch = mapping.vendors.some(vendor => 
      normalizedDescription.includes(vendor.toLowerCase())
    );
    
    if (vendorMatch) {
      return mapping.displayName;
    }
  }
  
  return null;
};