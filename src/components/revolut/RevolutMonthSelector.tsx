import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RevolutMonthSelectorProps {
  selectedDate: Date;
  onMonthChange: (date: Date) => void;
}

export const RevolutMonthSelector = ({
  selectedDate,
  onMonthChange,
}: RevolutMonthSelectorProps) => {
  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <h2 className="text-lg font-semibold">
        {format(selectedDate, 'MMMM yyyy')}
      </h2>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNextMonth}
        disabled={selectedDate >= new Date()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}; 