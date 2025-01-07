import { FormField } from "./FormField";
import { BillReminderFormData } from "@/types/bill-reminder";

interface BillReminderFormFieldsProps {
  formData: BillReminderFormData;
  setFormData: (data: BillReminderFormData) => void;
}

export function BillReminderFormFields({ formData, setFormData }: BillReminderFormFieldsProps) {
  return (
    <>
      <FormField
        id="provider_name"
        label="Provider Name"
        required
        value={formData.provider_name}
        onChange={(value) => setFormData({ ...formData, provider_name: value })}
        placeholder="e.g., Electric Ireland"
      />

      <FormField
        id="due_date"
        label="Due Date (Day of Month)"
        type="number"
        required
        value={formData.due_date}
        onChange={(value) => setFormData({ ...formData, due_date: value })}
        placeholder="Enter day (1-31)"
        min="1"
        max="31"
      />

      <FormField
        id="amount"
        label="Amount (€)"
        type="number"
        required
        value={formData.amount}
        onChange={(value) => setFormData({ ...formData, amount: value })}
        placeholder="Enter amount"
        step="0.01"
      />

      <FormField
        id="notes"
        label="Notes (Optional)"
        value={formData.notes}
        onChange={(value) => setFormData({ ...formData, notes: value })}
        placeholder="Add any additional notes"
        isTextarea
      />
    </>
  );
}