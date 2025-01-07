import { Label } from "@/components/ui/label";
import MonthYearPicker from "@/components/MonthYearPicker";

interface MonthYearSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function MonthYearSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: MonthYearSelectorProps) {
  return (
    <div className="space-y-4">
      <Label>Select Month and Year</Label>
      <MonthYearPicker
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
      />
    </div>
  );
}