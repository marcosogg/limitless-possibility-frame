import { parse } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { RevolutTransaction } from "@/types/revolut";

export const processRevolutFile = async (file: File) => {
  const text = await file.text();
  const rows = text.split('\n');
  const header = rows[0].split(',');
  const expectedColumns = 10;

  if (header.length !== expectedColumns) {
    throw new Error(`Invalid CSV format: Expected ${expectedColumns} columns but found ${header.length}`);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Failed to get user ID');
  }

  const transactions = rows
    .slice(1)
    .filter(row => row.trim())
    .map(row => row.split(','))
    .filter(values => values[8].trim() === 'COMPLETED')
    .map((values) => {
      try {
        const parsedDate = parse(
          values[3].trim(),
          'yyyy-MM-dd HH:mm:ss',
          new Date()
        );

        const amount = parseFloat(values[5].replace(/[^\d.-]/g, ''));
        const description = `${values[4].trim()} (from file: ${file.name})`;
        const category = categorizeTransaction(description);

        return {
          date: parsedDate.toISOString().split('T')[0], // Get just the date part
          description,
          amount,
          currency: values[7].trim(),
          category,
          profile_id: user.id
        };
      } catch (error) {
        console.error('Error processing row:', error);
        return null;
      }
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  const { error: upsertError } = await supabase
    .from('revolut_transactions')
    .upsert(transactions, {
      onConflict: 'profile_id,date,description,amount'
    });

  if (upsertError) throw upsertError;

  return transactions.length;
};

const categorizeTransaction = (description: string): string => {
  const patterns = {
    Groceries: [
      /tesco/i, /lidl/i, /aldi/i, /supervalu/i, /dunnes/i, /spar/i,
      /centra/i, /grocery/i, /food/i, /market/i
    ],
    Transportation: [
      /dublin bus/i, /irish rail/i, /leap/i, /taxi/i, /uber/i, /transport/i,
      /bus/i, /train/i, /luas/i, /dart/i
    ],
    Dining: [
      /restaurant/i, /cafe/i, /coffee/i, /takeaway/i, /food delivery/i,
      /just eat/i, /deliveroo/i, /mcdonalds/i, /burger/i
    ],
    Shopping: [
      /amazon/i, /shop/i, /store/i, /retail/i, /clothing/i, /fashion/i,
      /penneys/i, /primark/i, /tk maxx/i, /zara/i, /h&m/i
    ],
    Entertainment: [
      /cinema/i, /movie/i, /theatre/i, /concert/i, /spotify/i, /netflix/i,
      /disney/i, /entertainment/i, /game/i
    ],
    Transfers: [
      /transfer/i, /sent/i, /received/i, /payment/i, /revolut/i
    ],
    "Top-ups": [
      /top.?up/i, /topup/i, /added money/i, /loaded/i
    ],
    Services: [
      /service/i, /subscription/i, /membership/i, /fee/i
    ],
    Bills: [
      /bill/i, /utility/i, /electric/i, /gas/i, /water/i, /phone/i,
      /mobile/i, /broadband/i, /internet/i, /rent/i
    ]
  };

  for (const [category, patternList] of Object.entries(patterns)) {
    if (patternList.some(pattern => pattern.test(description))) {
      return category;
    }
  }

  return "Other";
};