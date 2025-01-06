import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface PhoneNumberInputProps {
  mainPhone: string;
  additionalPhones: string[];
  onMainPhoneChange: (value: string) => void;
  onAdditionalPhoneChange: (value: string, index: number) => void;
  onAddPhone: () => void;
  onRemovePhone: (index: number) => void;
}

export function PhoneNumberInput({
  mainPhone,
  additionalPhones,
  onMainPhoneChange,
  onAdditionalPhoneChange,
  onAddPhone,
  onRemovePhone,
}: PhoneNumberInputProps) {
  return (
    <div className="space-y-4">
      <div className="ml-6">
        <Label htmlFor="main_phone" className="text-sm text-gray-600 mb-1 block">
          Main Phone Number (include country code)
        </Label>
        <Input
          type="tel"
          id="main_phone"
          placeholder="+353123456789"
          value={mainPhone}
          onChange={(e) => onMainPhoneChange(e.target.value)}
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
              onChange={(e) => onAdditionalPhoneChange(e.target.value, index)}
              className="max-w-xs"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemovePhone(index)}
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
            onClick={onAddPhone}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Another Phone Number</span>
          </Button>
        </div>
      )}
    </div>
  );
}