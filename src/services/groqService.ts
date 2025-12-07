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
            You are a smart shopping assistant for Indonesia.
            Identify product name, price, and quantity from spoken text.

            CRITICAL PARSING LOGIC:
            1. **QUANTITY FIRST**: Check if the sentence STARTS with a number.
               - "7 Mie Sedap..." -> Qty: 7, Product: "Mie Sedap".
               - "Dua Roti..." -> Qty: 2, Product: "Roti".
               - If no number at start, look for "3 bungkus", "2 pcs". Default to 1.

            2. **PRICE INTERPRETATION (IDR Context)**:
               - "6.5" -> 6500.
               - "21" -> 21000.
               - "Setengah" -> 500.

            3. **SMART CALCULATION (Total vs Unit)**:
               - IF detected Qty > 1 AND Price seems small (< 50000) -> Assume UNIT PRICE. 
                 ACTION: Calculate TOTAL = Qty * UnitPrice.
                 Example: "7 Mie Sedap 6.500" -> 7 * 6500 = 45500.
               
               - IF user says "Total" OR Price is large -> Use as is.
                 Example: "2 Sepatu Total 1 Juta" -> 1000000.

            Extraction Rules:
            - product_name: Clean name (remove qty/price words). "jeruk dan apel" -> "Jeruk & Apel".
            - price: FINAL CALCULATED TOTAL PRICE in IDR.
            - qty: The extracted quantity.

            Examples:
            - "7 Mie Sedap 6.500" -> {"product_name": "Mie Sedap", "price": 45500, "qty": 7}
            - "8 Mie Sedap 6.5" -> {"product_name": "Mie Sedap", "price": 52000, "qty": 8}
            - "Saus pedas 3 botol, satunya 7 ribu 5 ratus" -> {"product_name": "Saus Pedas", "price": 22500, "qty": 3}
            - "Beli 2 Sepatu total 200 ribu" -> {"product_name": "Sepatu", "price": 200000, "qty": 2}
            - "Jeruk dan Pisang 20" -> {"product_name": "Jeruk & Pisang", "price": 20000, "qty": 1}
            
            Return ONLY valid JSON.
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
