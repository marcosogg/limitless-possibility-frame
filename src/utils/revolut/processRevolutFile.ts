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
        const amount = parseFloat(values[5].replace(/[^\d.-]/g, ''));
        
        // Skip positive amounts (income) - only process negative amounts (expenses)
        if (amount >= 0) {
          return null;
        }

        const parsedDate = parse(
          values[3].trim(),
          'yyyy-MM-dd HH:mm:ss',
          new Date()
        );

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
    "Groceries & Supermarkets": [
      /tesco/i, /lidl/i, /aldi/i, /supervalu/i, /dunnes/i, /spar/i,
      /centra/i, /grocery/i, /food/i, /market/i, /asia market/i, /avoca/i, /lotts & co/i
    ],
    "Restaurants, Cafes & Takeaway": [
      /restaurant/i, /cafe/i, /coffee/i, /takeaway/i, /food delivery/i,
      /just eat/i, /deliveroo/i, /mcdonalds/i, /burger/i, /boojum/i, /bread 41/i,
      /bunsen/i, /chutni/i, /fallon & byrne/i, /fresh the good food market/i,
      /gelato/i, /il forno/i, /indian eateries/i, /kc peaches/i, /oakberry/i,
      /sushida rathmines/i, /the sugar loaf bakery/i, /zaytoon/i, /amuri/i
    ],
    "Pubs & Bars": [
      /dicey's garden club/i, /doyles/i, /f.x. buckley/i, /j d wetherspoon/i,
      /paddy cullen's pub/i, /searsons bar/i, /slattery's d4/i, /the barge/i,
      /the bath pub/i, /the camden/i, /the chatty fox/i, /the depot at the c/i,
      /the hill/i, /the jar/i
    ],
    "Clothing & Apparel": [
      /arnotts/i, /cotswold outdoor/i, /decathlon/i, /guineys/i, /penneys/i,
      /superdry/i, /temu/i, /timberland/i, /trespass/i, /uniqlo/i
    ],
    "Home & Hardware": [
      /decwells hardware/i, /ikea/i
    ],
    "Travel & Transportation": [
      /aer lingus/i, /aircoach/i, /citi bus/i, /delta air lines/i, /free now/i,
      /irish rail/i, /national transport authority/i, /transport for ireland - tfi/i
    ],
    "Health & Pharmacy": [
      /aungier street clinic/i, /boots/i, /dronline/i, /hickey’s pharmacy/i,
      /life pharmacy/i
    ],
    "Entertainment & Leisure": [
      /aviva stadium/i, /dublin zoo/i, /ticketmaster/i
    ],
    "Online Services & Subscriptions": [
      /amazon/i, /amazon prime/i, /anthropic/i, /daft.ie/i, /google cloud/i,
      /gumroad/i, /microsoft/i, /microsoft 365/i, /openai/i, /plus plan fee/i,
      /supabase/i, /www.printables.com/i
    ],
    "Other Retail": [
      /dealz/i, /euro giant/i, /maxi zoo/i, /relay/i
    ],
    "Money Transfer": [
      /wise/i
    ],
    "Education": [
      /south east technological university/i, /codecademy/i
    ],
    "Personal Care": [
      /fireplace barbershop/i, /the fireplace barber shop/i
    ],
    "Utilities & Bills": [
      /to an post tv licence/i, /to sseairtricity/i, /virgin media ireland limited/i
    ],
    "Miscellaneous": [
      /an post/i, /to eur holidays/i, /to tatiani maria de faria/i,
      /sugarloaf bakery/i, /the source bulk foods/i, /tucano/i
    ],
    "Takeaway coffee": [
      /coffeeangel/i, /starbucks/i, /clement & pekoe/i, /butlers chocolates/i,
      /insomnia coffee company/i
    ]
  };

  for (const [category, patternList] of Object.entries(patterns)) {
    if (patternList.some(pattern => pattern.test(description))) {
      return category;
    }
  }

  return "Other";
};
