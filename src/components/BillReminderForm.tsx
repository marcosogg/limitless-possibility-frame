import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const categories = ["Electricity", "Internet", "Rent", "Credit Card", "Other"] as const;

interface FormData {
  provider_name: string;
  due_date: string;
  amount: string;
  category: string;
  notes: string;
  reminders_enabled: boolean;
}

const initialFormData: FormData = {
  provider_name: "",
  due_date: "",
  amount: "",
  category: "",
  notes: "",
  reminders_enabled: false,
};

export function BillReminderForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create bill reminders");
      }

      const dueDate = parseInt(formData.due_date);
      if (isNaN(dueDate) || dueDate < 1 || dueDate > 31) {
        throw new Error("Due date must be between 1 and 31");
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a positive number");
      }

      const { error } = await supabase.from("bill_reminders").insert({
        provider_name: formData.provider_name,
        due_date: dueDate,
        amount: amount,
        category: formData.category,
        notes: formData.notes || null,
        reminders_enabled: formData.reminders_enabled,
        user_id: user.id
      });

      if (error) throw error;

      // Test the WhatsApp notification
      if (formData.reminders_enabled) {
        const { error: whatsappError } = await supabase.functions.invoke('send-whatsapp', {
          body: {
            reminder: {
              provider_name: formData.provider_name,
              due_date: dueDate,
              amount: amount
            }
          }
        });

        if (whatsappError) {
          console.error('Failed to send WhatsApp message:', whatsappError);
          toast({
            variant: "destructive",
            title: "Warning",
            description: "Bill reminder created but WhatsApp notification failed to send.",
          });
        }
      }

      toast({
        title: "Success",
        description: "Bill reminder created successfully",
      });

      setFormData(initialFormData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="provider_name">Provider Name</Label>
        <Input
          id="provider_name"
          required
          value={formData.provider_name}
          onChange={(e) =>
            setFormData({ ...formData, provider_name: e.target.value })
          }
          placeholder="e.g., Electric Ireland"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date (Day of Month)</Label>
        <Input
          id="due_date"
          type="number"
          min="1"
          max="31"
          required
          value={formData.due_date}
          onChange={(e) =>
            setFormData({ ...formData, due_date: e.target.value })
          }
          placeholder="Enter day (1-31)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (€)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
          placeholder="Enter amount"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          placeholder="Add any additional notes"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="reminders_enabled"
          checked={formData.reminders_enabled}
          onChange={(e) =>
            setFormData({ ...formData, reminders_enabled: e.target.checked })
          }
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="reminders_enabled">Enable WhatsApp Reminders</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Bill Reminder"}
      </Button>
    </form>
  );
}