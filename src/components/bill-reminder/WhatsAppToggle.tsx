import { useState } from "react";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { ScheduleReminder } from "./ScheduleReminder";
import { ReminderToggles } from "./ReminderToggles";

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
      <ReminderToggles
        smsEnabled={checked}
        onSmsEnabledChange={onChange}
      />
      
      {checked && (
        <div className="space-y-4">
          <PhoneNumberInput
            mainPhone={phoneNumber}
            additionalPhones={additionalPhones}
            onMainPhoneChange={(value) => onPhoneNumberChange(value, 0)}
            onAdditionalPhoneChange={handleAdditionalPhoneChange}
            onAddPhone={addPhone}
            onRemovePhone={removePhone}
          />

          <ScheduleReminder
            scheduleDate={scheduleDate}
            scheduleTime={scheduleTime}
            onScheduleDateChange={onScheduleDateChange}
            onScheduleTimeChange={onScheduleTimeChange}
          />
        </div>
      )}
    </div>
  );
}