import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IncomeSectionProps {
  formData: {
    salary: string;
    bonus: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function IncomeSection({ formData, onInputChange }: IncomeSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Monthly Income</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            name="salary"
            type="text"
            value={formData.salary}
            onChange={onInputChange}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bonus">Bonus</Label>
          <Input
            id="bonus"
            name="bonus"
            type="text"
            value={formData.bonus}
            onChange={onInputChange}
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}