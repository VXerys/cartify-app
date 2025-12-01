import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

// Define the expected output structure from Gemini
export interface ParsedItem {
  qty: number;
  product_name: string;
  user_input_price: number;
}

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// System Prompt: Instruksi ketat untuk AI agar output sesuai format JSON
const SYSTEM_PROMPT = `
Role: You are a strict JSON parser for a shopping assistant.
Task: Listen to the audio input which contains a shopping item.
Extraction Rules:
1. Identify the QUANTITY (convert words like 'dua', 'setengah' to numbers). Default to 1 if not specified.
2. Identify the PRODUCT_NAME.
3. Identify the PRICE (convert words like 'lima ribu', '20k' to integer).
4. Do not include currency symbols (Rp) in the integer output.

Output Format:
Return ONLY a valid JSON object. Do not add markdown formatting like \`\`\`json.
{
  "qty": <integer>,
  "product_name": <string>,
  "user_input_price": <integer>
}

Example Audio: "Dua roti sisir seribu limaratus"
Example Output: {"qty": 2, "product_name": "roti sisir", "user_input_price": 1500}
`;

/**
 * Service untuk komunikasi dengan Google Gemini 1.5 Flash
 */
export const GeminiService = {
  /**
   * Mengirim file audio ke Gemini API untuk diparsing menjadi item belanja.
   * @param audioFileUri URI lokal file audio (hasil rekaman expo-av)
   */
  parseVoiceCommand: async (audioFileUri: string): Promise<ParsedItem | null> => {
    try {
      if (!API_KEY) {
        throw new Error('Missing Gemini API Key in configuration.');
      }

      // 1. Baca file audio sebagai Base64
      const base64Audio = await FileSystem.readAsStringAsync(audioFileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Konstruksi Payload JSON
      const payload = {
        contents: [
          {
            parts: [
              { text: "Parse this audio based on system instructions." },
              {
                inlineData: {
                  mimeType: "audio/mp4", // Asumsi format audio (sesuaikan dengan preset expo-av)
                  data: base64Audio
                }
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        }
      };

      // 3. Kirim Request
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      // 4. Parse Response
      const result = await response.json();

      // Ambil teks hasil (Candidate 0)
      const candidate = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidate) {
        throw new Error('No candidate response from Gemini.');
      }

      // Bersihkan markdown formatting jika AI "nakal" masih menambahkannya
      const cleanJson = candidate.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsedData: ParsedItem = JSON.parse(cleanJson);
      return parsedData;

    } catch (error) {
      console.error('Gemini Service Failed:', error);
      throw error; // Lempar ke UI untuk handling (switch ke manual input)
    }
  }
};
