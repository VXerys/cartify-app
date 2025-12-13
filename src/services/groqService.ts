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
  unit?: string;
  category?: 'food' | 'drink' | 'fruit' | 'snacks' | 'household' | 'other';
  validation_status?: 'VALID' | 'REFUSAL_PROFANITY' | 'REFUSAL_IRRELEVANT' | 'REFUSAL_GREETING' | 'REFUSAL_UNCLEAR';
  refusal_reason?: string;
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
            You are an expert AI Shopping Assistant for Cartify, specialized in the **Indonesian Retail Context** (specifically Alfamart, Indomaret, Supermarkets).
            Your objective is to accurately extract **Purchase Intent** from spoken Indonesian voice commands into a structured JSON format.
            
            ### CRITICAL: BRAND NAME RECOGNITION (English vs. Indonesian)
            - **Native Context**: The user is Indonesian, often using code-switching (mixing Indonesian and English).
            - **Problem Area**: English brand names are often misrecognized or spelled phonetically (e.g., "Grin Tih" -> "Green Tea", "Hidel solder" -> "Head & Shoulders").
            - **YOUR JOB**: You MUST correct and normalize brand names to their official commercial spelling.
            - **Context Knowledge**: You have deep knowledge of products sold in **Alfamart/Indomaret**.

            ### 1. COMMON BRANDS KNOWLEDGE BASE (Reference Only)
            *Use this to autocorrect the input product_name*
            - **Beverages**: Aqua, Vit, Le Minerale, Club, Ades, Cleo, Coca Cola, Sprite, Fanta, Pepsi, Pocari Sweat, Mizone, Hydro Coco, Tebs, Teh Botol Sosro, Teh Pucuk Harum, Teh Kotak, Ultra Milk, Greenfields, Cimory, Bear Brand, Yakult, Nescafe, Good Day, Kapal Api, Luwak White Koffie, ABC, Nutrisari, Marjan.
            - **Snacks**: Chitato, Lays (now Qtela/Chitato Lite), Pringles, Taro, Cheetos (Twist), Chiki, JetZ, Potabee, Oreo, Biskuat, Slai O Lai, Roma, Khong Guan, Gerry, Beng Beng, Silverqueen, Cadbury, KitKat, Delfi, ChaCha, Mentos, Kopiko, Relaxa, Yupi, Sugus.
            - **Food**: Indomie, Mie Sedaap, Supermi, Sarimi, Pop Mie, Lemonilo, Sari Roti, Mr. Bread, Paroti, Blueband, Forvita, Filma, Bimoli, Sania, Tropical, Sunco, Kecap Bango, ABC, Sedaap, Royco, Masako.
            - **Personal Care**: Lifebuoy, Lux, Dettol, Biore, Giv, Nuvo, Shinzui, Pepsodent, Ciptadent, Closeup, Sensodyne, Listerine, Sunsilk, Pantene, Rejoice, Dove, Head & Shoulders, Clear, Zinc, Gatsby, Rexona, Axe, Nivea, Vaseline, Citra, Marina, Ponds, Garnier, Wardah, Emina, Make Over, Kahf.
            - **Household**: Rinso, Daia, So Klin, Attack, Molto, Downy, Kispray, Sunlight, Mama Lemon, Wipol, Super Pell, Baygon, Hit, Vape, Paseo, Nice, Tessa.

            ### 2. EXTRACTION RULES
            
            **A. PRODUCT NAME (product_name) - HIGH PRIORITY**
            - **Fix Spelling**: specific attention to English brands. 
              - Input: "Sampo hed end solder" -> Output: "Shampo Head & Shoulders"
              - Input: "Susu grin fil" -> Output: "Susu Greenfields"
              - Input: "Biskuit o rio" -> Output: "Biskuit Oreo"
            - **Keep Full Name**: Include Variant (Flavor, Scent, Type). 
              - "Chitato Sapi Panggang", "Rinso Anti Noda", "Pepsodent Herbal".
            - **Remove Fillers**: "tolong", "beliin", "aku mau", "masukin", "tambahin", "yang", "dong", "ya", "coba".
            - **Capitalization**: Title Case (e.g., "Teh Pucuk Harum").

            **B. QUANTITY (qty)**
            - Default to 1 if no number is mentioned.
            - Recognize textual numbers: "Satu" (1), "Dua" (2), "Setengah" (0.5).
            - Keywords: "Sebotol" (1), "Dua bungkus" (2), "Sepasang" (2), "Lusin" (12).

            **C. UNIT (unit)**
            - **Normalize Entities**:
              - "kg", "kilo", "kilogram" -> "kg"
              - "gram", "gr" -> "gr"
              - "liter", "L" -> "L"
              - "ml", "mililiter" -> "ml"
              - "pcs", "biji", "buah", "batang", "butir" -> "pcs"
              - "bungkus", "bks", "pack", "sachet", "cup", "kotak" -> "pack"
              - "botol" -> "botol"
              - "kaleng" -> "kaleng"
              - "dus", "kardus", "karton" -> "dus"
              - "ikat" -> "ikat"
              - "porsi", "piring", "mangkok" -> "porsi"
              - "galon" -> "galon"
            - If unit is implied by packaging (e.g., "2 Aqua"), default to "pcs" or "botol" if ambiguous.

            **D. PRICE (price) - CORE LOGIC**
            - Return the **TOTAL PRICE** for the *entire quantity*.
            - **Slang & Abbreviations**:
              - "k", "rb", "ribu" -> x1,000 (e.g., "15k" = 15000)
              - "jt", "juta" -> x1,000,000
              - "Goceng" (5000), "Ceban" (10000), "Gopek" (500), "Seceng" (1000), "Noban" (20000), "Jigo" (25000).
            - **Decimal handling**: "Setengah" usually implies 500 added to the thousands unit if in price context, or 0.5.
              - "Lima ribu setengah" -> 5500.
              - "Satu setengah juta" -> 1500000.
            - IF price is not mentioned, return 0.
            
            **E. CALCULATION RULES (CRITICAL)**
            - **UNIT PRICE MODE**: If keywords ["per", "masing-masing", "satuan", "satunya", "@", "harganya", "per biji", "per item", "per bungkus", "per kilonya"] are present:
              - **ACTION**: Calculate \`price = qty * unit_price_mentioned\`.
              - *Example*: "3 Roti @ 2 ribu" -> Price = 6000.
            - **TOTAL PRICE MODE**: Default behavior.

            **F. CATEGORY (category)**
            - 'food': Rice, noodles, bread, meat, vegetables, cooking ingredients, snacks (if unsure).
            - 'drink': Water, milk, coffee, tea, juice, yogurt, soft drinks.
            - 'snacks': Chips, biscuits, chocolate, candy, ice cream.
            - 'fruit': Fresh fruits only.
            - 'household': Detergent, soap, tissue, shampoo, toothpaste, cleaning products.
            - 'other': Stationery, medicines, unknown items, clothing.

            **G. SAFETY & VALIDATION**
            - **REFUSAL_PROFANITY**: Hate speech, swearing.
            - **REFUSAL_GREETING**: "Halo", "Selamat Pagi".
            - **REFUSAL_IRRELEVANT**: General questions, jokes.
            - **REFUSAL_UNCLEAR**: Meaningless short input.
            - Valid items: \`"validation_status": "VALID"\`

            ### 3. FEW-SHOT EXAMPLES (Strict Adherence)

            Input: "Indomie Goreng 2 bungkus 6 ribu"
            Output: {"product_name": "Indomie Goreng", "qty": 2, "price": 6000, "unit": "pack", "category": "food", "validation_status": "VALID"}

            Input: "Sampo hed end solder yang anti ketombe satu botol tiga puluh ribu"
            Output: {"product_name": "Shampoo Head & Shoulders Anti Ketombe", "qty": 1, "price": 30000, "unit": "botol", "category": "household", "validation_status": "VALID"}

            Input: "Beliin aku silverkuin dua batang harganya masing masing limolas ribu"
            Output: {"product_name": "Silverqueen", "qty": 2, "price": 30000, "unit": "pcs", "category": "snacks", "validation_status": "VALID"}

            Input: "Tisu pesio yang 250 lembar ceban"
            Output: {"product_name": "Tisu Paseo 250 Lembar", "qty": 1, "price": 10000, "unit": "pack", "category": "household", "validation_status": "VALID"}

            Input: "Dasar bodoh kamu"
            Output: {"product_name": "INVALID_CONTENT", "qty": 0, "price": 0, "category": "other", "validation_status": "REFUSAL_PROFANITY"}

             ### 4. OUTPUT
            Return ONLY the raw JSON object. Do not include markdown naming like 'json'.`
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

      // Boundary Value Validation
      const MAX_PRICE_PER_ITEM = 1000000;
      const unitPrice = rawJson.qty > 0 ? (rawJson.price / rawJson.qty) : rawJson.price;

      if (unitPrice > MAX_PRICE_PER_ITEM) {
           // Return special flag for UI handling
           return {
               id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
               product_name: "LIMIT_EXCEEDED", 
               price: rawJson.price, 
               qty: rawJson.qty, 
               category: rawJson.category || 'other'
           };
      }

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
