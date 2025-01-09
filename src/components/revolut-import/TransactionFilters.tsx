// src/components/revolut-import/TransactionFilters.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface TransactionFiltersProps {
  onFilterChange: (filters: {
    category: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    searchTerm: string;
  }) => void;
}

const categories = [
  "All",
  "Rent",
  "Utilities",
  "Groceries",
  "Transport",
  "Entertainment",
  "Shopping",
  "Miscellaneous",
  "Savings",
  "Dining Out",
  "Health & Pharmacy",
  "Fitness",
  "Personal Care",
  "Travel",
  "Education",
  "Takeaway Coffee",
  "Pubs & Bars",
  "Clothing & Apparel",
  "Home & Hardware",
  "Online Services & Subscriptions",
  "Money Transfer",
  "Delivery & Takeaway"
] as const;

export function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
  const [category, setCategory] = useState("All");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (updates: Partial<{
    category: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    searchTerm: string;
  }>) => {
    const newFilters = {
      category: updates.category ?? category,
      dateFrom: updates.dateFrom ?? dateFrom,
      dateTo: updates.dateTo ?? dateTo,
      searchTerm: updates.searchTerm ?? searchTerm,
    };
    
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleFilterChange({ searchTerm: e.target.value });
          }}
          className="max-w-xs"
        />
      </div>

      <Select
        value={category}
        onValueChange={(value) => {
          setCategory(value);
          handleFilterChange({ category: value });
        }}
      >
        <SelectTrigger className="w-[240px]"> {/* Increased width for longer category names */}
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PPP") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={(date) => {
                setDateFrom(date);
                handleFilterChange({ dateFrom: date });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PPP") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={(date) => {
                setDateTo(date);
                handleFilterChange({ dateTo: date });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(dateFrom || dateTo) && (
          <Button
            variant="ghost"
            onClick={() => {
              setDateFrom(undefined);
              setDateTo(undefined);
              handleFilterChange({ dateFrom: undefined, dateTo: undefined });
            }}
          >
            Clear dates
          </Button>
        )}
      </div>
    </div>
  );
}
