import Groq from "groq-sdk";

const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

let groq: Groq | null = null;

if (API_KEY) {
    groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
} else {
  console.warn("Groq API Key is missing! Check .env");
}

export interface ParsedItem {
  id: string;
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
            - **CRITICAL**: If NO product name is mentioned (e.g., user only says "50 ribu" or "dua pulu ribu"), return an empty string "".
            - **CLEANUP**: Remove filler words ("tolong", "beliin", "aku mau", "dong", "masukin", "yang").
            - **CLEANUP**: Remove generic unit words if they don't describe the product ("buah", "biji", "items", "bungkus", "porsi"). Keep if descriptive ("kaleng", "botol").
            - Capitalize the first letter of each word.

            **C. PRICE (price) - CRITICAL LOGIC**
            - The output 'price' field MUST be the **TOTAL PRICE** for the given quantity.
            - **Currency Slang**: Understand "Perak", "Rupiah".
              - "Goceng" = 5000, "Ceban" = 10000, "Gopek" = 500, "Seceng" = 1000, "Noban" = 20000.
            - **Multipliers**: "rb"/"ribu" (x1000), "jt"/"juta" (x1000000), "k" (x1000).
            - If NO price is mentioned, return 0.
            
            - **UNIT vs TOTAL Calculation Rules (HIGHEST PRIORITY)**:
              IF any of these keywords appear: ["masing-masing", "per pcs", "satuan", "satunya", "@", "per item", "per bungkus", "per porsi", "harganya", "satuannya"]
              THEN: **YOU MUST MULTIPLY** \`Qty * Detected Unit Price\`.
              
              1. **CASE: Explicit Unit Price**
                 - *Example*: "3 Papaya masing-masing 20rb" -> Calculation: 3 * 20000 = **60000**.
                 - *Example*: "5 Nasi goreng per bungkus 15rb" -> Calculation: 5 * 15000 = **75000**.
              
              2. **CASE: Explicit Total Price**
                 - *Keywords*: "total", "semuanya", "seharga", "sepaket", "semua".
                 - **ACTION**: Use \`Detected Price\` as the final price.
                 - *Example*: "3 Pizza total 150rb" -> **150000**.

              3. **CASE: Ambiguous (No keywords)**
                 - *Scenario*: "3 Bakso 45 ribu".
                 - **DEFAULT RULE**: Assume **TOTAL PRICE**.
                 - *Example*: "3 Pizza 150 ribu" -> Returns **150000** (NOT 450000).

            **D. CATEGORY (category)**
            - 'food': Meals, staples (rice, meat, noodles), bread.
            - 'drink': Beverages, water, milk, coffee, juice.
            - 'fruit': Fruits, vegetables, fresh produce.
            - 'snacks': Chips, candy, chocolate, biscuits.
            - 'household': Detergent, tissue, soap, electronics, tools.
            - 'other': Clothing, toys, cigarettes, stationary, medicines.
            
            **E. CONTENT VALIDATION & SAFETY (CRITICAL)**
            - **Rule**: STRICTLY CHECK if the input is appropriate.
            - **Reject**: Profanity, hate speech, sexual content, insults, or toxicity.
            - **Reject**: Irrelevant inputs (e.g., "Apa kabar", "Jalan-jalan yuk").
            - **ACTION**: If Rejected, return strictly: \`{"product_name": "INVALID_CONTENT", "price": 0, "qty": 0, "category": "other"}\`.

            ### 2. FEW-SHOT EXAMPLES

            Input: "3 papaya yang masing-masing harganya dua puluh satu ribu"
            Output: {"product_name": "Papaya", "price": 63000, "qty": 3, "category": "fruit"}

            Input: "3 Pizza seratus lima puluh ribu"
            Output: {"product_name": "Pizza", "price": 150000, "qty": 3, "category": "food"}

            Input: "Sate Ayam 2 porsi ceban"
            Output: {"product_name": "Sate Ayam", "price": 10000, "qty": 2, "category": "food"}
            
            Input: "Dasar bodoh kamu"
            Output: {"product_name": "INVALID_CONTENT", "price": 0, "qty": 0, "category": "other"}

            Input: "Sabun cair 3 botol yang satuannya 25 ribu"
            Output: {"product_name": "Sabun Cair", "price": 75000, "qty": 3, "category": "household"}

            Input: "3 Pizza yang masing-masing satunya lima puluh mb"
            Output: {"product_name": "Pizza", "price": 150000, "qty": 3, "category": "food"}

            Input: "4 saus botol pedas yang masing-masingnya delapan ribu"
            Output: {"product_name": "Saus Botol Pedas", "price": 32000, "qty": 4, "category": "food"}

            Input: "5 nasi goreng per bungkus nya lima belas ribu"
            Output: {"product_name": "Nasi Goreng", "price": 75000, "qty": 5, "category": "food"}

            Input: "dua kopi @ 15 ribu"
            Output: {"product_name": "Kopi", "price": 30000, "qty": 2, "category": "drink"}

            Input: "10 gorengan, satuny 2 ribu rupiah"
            Output: {"product_name": "Gorengan", "price": 20000, "qty": 10, "category": "food"}
            
            Input: "Beli 2 Helm masing masing 300rb"
            Output: {"product_name": "Helm", "price": 600000, "qty": 2, "category": "household"}

            Input: "3 Jus Jeruk per gelas 10rb"
            Output: {"product_name": "Jus Jeruk", "price": 30000, "qty": 3, "category": "drink"}

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

      const rawJson = JSON.parse(output);
      const json: ParsedItem = {
          ...rawJson,
          id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
      };
      return json;
    } catch (error) {
      const tct = Date.now() - startTime;
      console.error(`[Groq Performance] TCT: ${tct}ms | Status: Error | Details:`, error);
      return null;
    }
  },
};
