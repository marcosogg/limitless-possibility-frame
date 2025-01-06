import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WhatsAppToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
}

export function WhatsAppToggle({ checked, onChange, phoneNumber, onPhoneNumberChange }: WhatsAppToggleProps) {
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
        <Label htmlFor="whatsapp_enabled" className="cursor-not-allowed">Enable WhatsApp Reminders (Coming Soon)</Label>
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
          <div className="ml-6">
            <Label htmlFor="phone_number" className="text-sm text-gray-600 mb-1 block">
              Phone Number (include country code)
            </Label>
            <Input
              type="tel"
              id="phone_number"
              placeholder="+353123456789"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              className="max-w-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}