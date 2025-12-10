import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Gemini API Key is missing! Check .env");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-lite", // Optimized for speed (Latency < 1s)
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.1,
    maxOutputTokens: 150, // Strict limit for speed
  }
});

export interface ParsedItem {
  product_name: string;
  price: number;
  qty: number;
}

export const geminiService = {
  analyzeVoiceText: async (text: string): Promise<ParsedItem | null> => {
    const startTime = Date.now();
    try {
      const prompt = `
        You are a smart shopping assistant for Indonesia.
        Identify product name, price, and quantity from spoken text.

        RULES FOR PRICE (CRITICAL):
        - Context is IDR (Rupiah).
        - If a number is small (<= 500) and no unit is said, it usually implies THOUSANDS.
          Example: "21" -> 21000.
          Example: "Setengah" (0.5) -> 500.
          Example: "Lima" -> 5000.
        - If "ribu" is said, use it (e.g., "lima ribu" -> 5000).
        - If fully clear, use exact (e.g., "seratus perak" -> 100).
        
        RULES FOR QUANTITY & TOTAL CALCULATION (IMPORTANT):
        - The 'price' field MUST ALWAYS be the **TOTAL PRICE**.
        - If the user specifies a **UNIT PRICE** (using words like "masing-masing", "satuan", "@", "per item", "per bungkus", "satuannya"), you **MUST MULTIPLY** the Unit Price by the Quantity.
          Formula: price = unit_price * qty.
        - If no unit price indicator is found, assume the mentioned price is already the total price.

        Extraction Rules:
        - product_name: The item. Correct spelling/slang ("mih"->"mie").
        - **Handling Multiple Items**: If user says "X dan Y", combine them with "&" (e.g. "Ayam dan Nasi" -> "Ayam & Nasi").
        - price: Numeric IDR (Total Price).
        - qty: Default 1. Be smart ("dua bungkus" -> qty: 2).

        Examples:
        - "Semangka dua puluh ribu" -> {"product_name": "Semangka", "price": 20000, "qty": 1}
        - "Indomie 3500" -> {"product_name": "Indomie", "price": 3500, "qty": 1}
        - "Mie Sedap 21" -> {"product_name": "Mie Sedap", "price": 21000, "qty": 1}
        - "Roti dua 5" -> {"product_name": "Roti", "price": 5000, "qty": 2} (Assumed 5 is total)
        - "Jeruk dan Pisang 21.600" -> {"product_name": "Jeruk & Pisang", "price": 21600, "qty": 1}
        
        **Unit Price Calculation Examples (User Specific Logic):**
        - "4 saus botol pedas yang masing-masingnya delapan ribu" -> {"product_name": "saus botol pedas", "price": 32000, "qty": 4} (Calculation: 4 * 8000)
        - "2 kopi @ 15 ribu" -> {"product_name": "kopi", "price": 30000, "qty": 2} (Calculation: 2 * 15000)
        - "3 nasi goreng per bungkus 12 ribu" -> {"product_name": "nasi goreng", "price": 36000, "qty": 3} (Calculation: 3 * 12000)
        - "3 nasi goreng satunya itu 15 ribu" -> {"product_name": "nasi goreng", "price": 45000, "qty": 3} (Calculation: 3 * 15000)
        - "beli 5 buku tulis satuannya 3 ribu" -> {"product_name": "buku tulis", "price": 15000, "qty": 5} (Calculation: 5 * 3000)
        - "10 gorengan, satuny 2 ribu rupiah" -> {"product_name": "gorengan", "price": 20000, "qty": 10}

        Input: "${text}"
      `;

      const result = await model.generateContent(prompt);
      const output = result.response.text(); 
      const tct = Date.now() - startTime;

      console.log(`[Gemini Performance] TCT: ${tct}ms | Status: Success`);
      
      if (!output) {
          console.warn("Gemini returned empty output. Check if blocked.");
          throw new Error("Empty output from Gemini");
      }
      
      console.log("Raw Gemini Response:", output); 

      // Native JSON mode usually returns pure JSON, but we keep the safety check
      const startIndex = output.indexOf('{');
      const endIndex = output.lastIndexOf('}');
      
      if (startIndex !== -1 && endIndex !== -1) {
          const jsonString = output.substring(startIndex, endIndex + 1);
          const json: ParsedItem = JSON.parse(jsonString);
          return json;
      }
      
      throw new Error("No JSON object found in response");
    } catch (error) {
      const tct = Date.now() - startTime;
      console.error(`[Gemini Performance] TCT: ${tct}ms | Status: Error | Details:`, error);
      return null;
    }
  },
};
