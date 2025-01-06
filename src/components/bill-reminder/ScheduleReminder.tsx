import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Minus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface ScheduleReminderProps {
  scheduleDate: Date | undefined;
  scheduleTime: string;
  onScheduleDateChange: (date: Date | undefined) => void;
  onScheduleTimeChange: (time: string) => void;
}

export function ScheduleReminder({
  scheduleDate,
  scheduleTime,
  onScheduleDateChange,
  onScheduleTimeChange,
}: ScheduleReminderProps) {
  return (
    <div className="ml-6 space-y-2">
      <Label className="text-sm text-gray-600">Schedule Reminder</Label>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[240px] justify-start text-left font-normal ${!scheduleDate && "text-muted-foreground"}`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {scheduleDate ? format(scheduleDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={scheduleDate}
              onSelect={onScheduleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {scheduleDate && (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Input
              type="time"
              value={scheduleTime}
              onChange={(e) => onScheduleTimeChange(e.target.value)}
              className="w-32"
            />
          </div>
        )}

        {scheduleDate && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onScheduleDateChange(undefined);
              onScheduleTimeChange("12:00");
            }}
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}