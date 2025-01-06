import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Calendar, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface WhatsAppToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string, index?: number) => void;
  scheduleDate: Date | undefined;
  onScheduleDateChange: (date: Date | undefined) => void;
  scheduleTime: string;
  onScheduleTimeChange: (time: string) => void;
}

export function WhatsAppToggle({ 
  checked, 
  onChange, 
  phoneNumber, 
  onPhoneNumberChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange
}: WhatsAppToggleProps) {
  const [additionalPhones, setAdditionalPhones] = useState<string[]>([]);

  const addPhone = () => {
    if (additionalPhones.length < 2) {
      setAdditionalPhones([...additionalPhones, '']);
    }
  };

  const removePhone = (index: number) => {
    const newPhones = additionalPhones.filter((_, i) => i !== index);
    setAdditionalPhones(newPhones);
  };

  const handleAdditionalPhoneChange = (value: string, index: number) => {
    const newPhones = [...additionalPhones];
    newPhones[index] = value;
    setAdditionalPhones(newPhones);
    onPhoneNumberChange(value, index + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 opacity-50">
        <input
          type="checkbox"
          id="whatsapp_enabled"
          checked={false}
          disabled
          className="h-4 w-4 rounded border-gray-300 cursor-not-allowed"
        />
        <Label htmlFor="whatsapp_enabled" className="cursor-not-allowed">
          Enable WhatsApp Reminders (Coming Soon)
        </Label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sms_enabled"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="sms_enabled">Enable SMS Reminders</Label>
        </div>
        
        {checked && (
          <div className="space-y-4">
            <div className="ml-6">
              <Label htmlFor="main_phone" className="text-sm text-gray-600 mb-1 block">
                Main Phone Number (include country code)
              </Label>
              <Input
                type="tel"
                id="main_phone"
                placeholder="+353123456789"
                value={phoneNumber}
                onChange={(e) => onPhoneNumberChange(e.target.value, 0)}
                className="max-w-xs"
              />
            </div>

            {additionalPhones.map((phone, index) => (
              <div key={index} className="ml-6 flex items-center space-x-2">
                <div className="flex-1">
                  <Label 
                    htmlFor={`additional_phone_${index}`} 
                    className="text-sm text-gray-600 mb-1 block"
                  >
                    Additional Phone {index + 1}
                  </Label>
                  <Input
                    type="tel"
                    id={`additional_phone_${index}`}
                    placeholder="+353123456789"
                    value={phone}
                    onChange={(e) => handleAdditionalPhoneChange(e.target.value, index)}
                    className="max-w-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePhone(index)}
                  className="mt-6"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {additionalPhones.length < 2 && (
              <div className="ml-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPhone}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Another Phone Number</span>
                </Button>
              </div>
            )}

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
          </div>
        )}
      </div>
    </div>
  );
}