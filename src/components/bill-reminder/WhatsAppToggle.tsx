import { Label } from "@/components/ui/label";

interface WhatsAppToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function WhatsAppToggle({ checked, onChange }: WhatsAppToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="reminders_enabled"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300"
      />
      <Label htmlFor="reminders_enabled">Enable WhatsApp Reminders</Label>
    </div>
  );
}