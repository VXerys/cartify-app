import Groq from "groq-sdk";

const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

let groq: Groq | null = null;

if (API_KEY) {
    groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
} else {
  console.warn("Groq API Key is missing! Check .env");
}

export interface ParsedItem {
  product_name: string;
  price: number;
  qty: number;
  category?: 'food' | 'drink' | 'fruit' | 'snacks' | 'household' | 'other';
}

export const groqService = {
  analyzeVoiceText: async (text: string): Promise<ParsedItem | null> => {
    if (!groq) {
        console.error("Groq client not initialized");
        return null;
    }

    const startTime = Date.now();
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
            You are an intelligent, context-aware shopping assistant for Indonesia.
            Your goal is to extract **Purchase Intent** from spoken language (Bahasa Indonesia, colloquial/slang allowed) into specific JSON fields.

            ### 1. PARSING RULES (Analyze Step-by-Step)
            
            **A. QUANTITY (qty)**
            - Detect numbers at the start or associated with units.
            - Words to Numbers: "Satu"->1, "Dua"->2, "Setengah"->0.5.
            - Default to 1 if no quantity is specified.
  
            **B. PRODUCT NAME (product_name)**
            - Extract the core item name.
            - **CLEANUP**: Remove filler words ("tolong", "beliin", "aku mau", "dong").
            - **CLEANUP**: Remove generic unit words if they don't describe the product ("buah", "biji", "items"). Keep if descriptive ("kaleng", "botol").
            - Capitalize the first letter of each word.

            **C. PRICE (price) - CRITICAL LOGIC**
            - **Currency Slang**: Understand "Perak", "Rupiah".
              - "Goceng" = 5000, "Ceban" = 10000, "Gopek" = 500, "Seceng" = 1000, "Noban" = 20000.
            - **Multipliers**: "rb"/"ribu" (x1000), "jt"/"juta" (x1000000), "k" (x1000).
            
            - **UNIT vs TOTAL Calculation Rules**:
              1. **CASE: Explicit Unit Price**
                 - *Keywords*: "masing-masing", "per pcs", "satuan", "satunya", "@", "per item".
                 - **ACTION**: Calculate \`Total Price = Qty * Detected Price\`.
                 - *Example*: "3 Papaya masing-masing 20rb" -> 60000.
              
              2. **CASE: Explicit Total Price**
                 - *Keywords*: "total", "semuanya", "seharga", "harganya", "sepaket", "semua".
                 - **ACTION**: Use \`Detected Price\` as the final price.
                 - *Example*: "3 Pizza total 150rb" -> 150000.

              3. **CASE: Ambiguous (No keywords)**
                 - *Scenario*: "3 Bakso 45 ribu".
                 - **DEFAULT RULE**: Assume **TOTAL PRICE**.
                 - *Exception*: If the price is extremely low (< 2000 IDR) and Qty > 1, it might be a unit price (e.g., "10 permen 500 perak"). But generally, prefer TOTAL to avoid over-calculating.
                 - *Example*: "3 Pizza 150 ribu" -> Returns 150000 (NOT 450000).

            **D. CATEGORY (category)**
            - 'food': Meals, staples (rice, meat, noodles), bread.
            - 'drink': Beverages, water, milk, coffee, juice.
            - 'fruit': Fruits, vegetables, fresh produce.
            - 'snacks': Chips, candy, chocolate, biscuits.
            - 'household': Detergent, tissue, soap, electronics, tools.
            - 'other': Clothing, toys, cigarettes, stationary, medicines.

            ### 2. FEW-SHOT EXAMPLES
            Input: "Tolong beliin 3 papaya yang masing-masing harganya dua puluh satu ribu"
            Output: {"product_name": "Papaya", "price": 63000, "qty": 3, "category": "fruit"}

            Input: "3 Pizza seratus lima puluh ribu"
            Output: {"product_name": "Pizza", "price": 150000, "qty": 3, "category": "food"}

            Input: "Beliin Sate Ayam 2 porsi ceban"
            Output: {"product_name": "Sate Ayam", "price": 10000, "qty": 2, "category": "food"}

            Input: "Satu kerdus indomie goreng 120k"
            Output: {"product_name": "Indomie Goreng", "price": 120000, "qty": 1, "category": "food"}

            Input: "Dua kopi kenangan mantan" (No Price)
            Output: {"product_name": "Kopi Kenangan Mantan", "price": 0, "qty": 2, "category": "drink"}

            Input: "Beliin sabun cair 3 botol yang satuannya 25 ribu"
            Output: {"product_name": "Sabun Cair", "price": 75000, "qty": 3, "category": "household"}

            ### 3. OUTPUT
            Return ONLY the raw JSON object. Do not include markdown naming like 'json'.
            `
          },
          {
            role: "user",
            content: text,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.1,
        max_tokens: 150,
        response_format: { type: "json_object" },
      });

      const output = completion.choices[0]?.message?.content || "";
      const tct = Date.now() - startTime;
      console.log(`[Groq Performance] TCT: ${tct}ms | Status: Success`);
      console.log("Raw Groq Response:", output);

      const json: ParsedItem = JSON.parse(output);
      return json;
    } catch (error) {
      const tct = Date.now() - startTime;
      console.error(`[Groq Performance] TCT: ${tct}ms | Status: Error | Details:`, error);
      return null;
    }
  },
};
