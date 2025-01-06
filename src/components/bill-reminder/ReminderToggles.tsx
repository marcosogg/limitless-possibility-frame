import { Label } from "@/components/ui/label";

interface ReminderTogglesProps {
  smsEnabled: boolean;
  onSmsEnabledChange: (checked: boolean) => void;
}

export function ReminderToggles({
  smsEnabled,
  onSmsEnabledChange,
}: ReminderTogglesProps) {
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
            checked={smsEnabled}
            onChange={(e) => onSmsEnabledChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="sms_enabled">Enable SMS Reminders</Label>
        </div>
      </div>
    </div>
  );
}