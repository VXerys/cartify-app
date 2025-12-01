/**
 * Gemini AI Service - Voice Command Parser
 * "The AI Layer" - Singleton service untuk Google Gemini 1.5 Flash
 */

import Constants from 'expo-constants';

/**
 * Interface untuk hasil parsing voice command
 */
export interface ParsedItem {
  name: string;
  quantity: number;
  price: number;
  confidence: number; // 0-1, seberapa yakin AI dengan parsing-nya
}

/**
 * Custom Error untuk Gemini Service
 */
export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'NETWORK_ERROR' | 'API_ERROR' | 'PARSE_ERROR' | 'INVALID_KEY'
  ) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

/**
 * Singleton class untuk Gemini API integration
 */
class GeminiService {
  private static instance: GeminiService;
  private apiKey: string;
  private readonly API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  /**
   * System prompt untuk parsing voice command
   * Mengajarkan AI cara extract qty, nama item, dan harga
   */
  private readonly SYSTEM_PROMPT = `
Kamu adalah asisten parsing untuk aplikasi belanja suara (VoiceCart).
User akan memberikan perintah suara dalam format bebas, tugasmu adalah ekstrak:
1. QUANTITY (jumlah item) - angka
2. ITEM NAME (nama barang) - string
3. PRICE (harga per unit) - angka (dalam Rupiah)

Contoh input: "3 Wafer 20000"
Output yang diharapkan (JSON):
{
  "name": "Wafer",
  "quantity": 3,
  "price": 20000,
  "confidence": 0.95
}

Contoh input lain:
- "Lima roti tawar harganya 15 ribu" → {"name": "Roti Tawar", "quantity": 5, "price": 15000, "confidence": 0.9}
- "Beli sabun cuci piring dua botol 12500 per botol" → {"name": "Sabun Cuci Piring", "quantity": 2, "price": 12500, "confidence": 0.95}
- "Satu kilo beras 18000" → {"name": "Beras", "quantity": 1, "price": 18000, "confidence": 0.9}

Rules:
- Jika tidak yakin dengan salah satu field, set confidence < 0.7
- Nama item harus dalam Title Case
- Harga HARUS angka tanpa "Rp" atau titik pemisah ribuan
- Quantity harus angka positif (konversi kata menjadi angka jika perlu)
- Jika input tidak jelas, return null

Respond HANYA dengan valid JSON object, tanpa markdown atau teks tambahan.
  `.trim();

  private constructor() {
    // Ambil API key dari environment variable
    const key = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY 
      || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    
    if (!key) {
      throw new GeminiServiceError(
        'EXPO_PUBLIC_GEMINI_API_KEY tidak ditemukan di environment variables',
        'INVALID_KEY'
      );
    }
    
    this.apiKey = key;
  }

  /**
   * Singleton pattern - hanya ada satu instance
   */
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Parse voice command menjadi structured item data
   * @param audioFileUri - URI file audio hasil rekaman (untuk future: transcription)
   * @param transcribedText - Text hasil transcription (sementara manual input)
   * @returns ParsedItem atau null jika gagal
   */
  public async parseVoiceCommand(
    transcribedText: string,
    audioFileUri?: string
  ): Promise<ParsedItem | null> {
    try {
      // Validasi input
      if (!transcribedText || transcribedText.trim().length === 0) {
        throw new GeminiServiceError('Text input kosong', 'PARSE_ERROR');
      }

      // Construct request payload
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${this.SYSTEM_PROMPT}\n\nUser input: "${transcribedText}"`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1, // Low temperature untuk hasil yang konsisten
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 200,
        },
      };

      // Call Gemini API
      const response = await fetch(`${this.API_ENDPOINT}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Check response status
      if (!response.ok) {
        const errorText = await response.text();
        throw new GeminiServiceError(
          `Gemini API error: ${response.status} - ${errorText}`,
          'API_ERROR'
        );
      }

      // Parse response
      const data = await response.json();
      
      // Extract generated text
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new GeminiServiceError('Response dari Gemini kosong', 'PARSE_ERROR');
      }

      // Parse JSON dari response
      // Gemini kadang return dengan markdown code block, jadi kita clean dulu
      const cleanedText = generatedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const parsed: ParsedItem = JSON.parse(cleanedText);

      // Validasi hasil parsing
      if (!this.isValidParsedItem(parsed)) {
        return null;
      }

      return parsed;

    } catch (error) {
      // Handle different error types
      if (error instanceof GeminiServiceError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new GeminiServiceError(
          'Tidak bisa terhubung ke Gemini API. Cek koneksi internet.',
          'NETWORK_ERROR'
        );
      }

      throw new GeminiServiceError(
        `Unexpected error: ${(error as Error).message}`,
        'PARSE_ERROR'
      );
    }
  }

  /**
   * Validasi apakah hasil parsing sesuai interface ParsedItem
   */
  private isValidParsedItem(item: ParsedItem): boolean {
    return (
      typeof item === 'object' &&
      typeof item.name === 'string' &&
      item.name.length > 0 &&
      typeof item.quantity === 'number' &&
      item.quantity > 0 &&
      typeof item.price === 'number' &&
      item.price > 0 &&
      typeof item.confidence === 'number' &&
      item.confidence >= 0 &&
      item.confidence <= 1
    );
  }

  /**
   * Helper method untuk test koneksi API
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.parseVoiceCommand('test satu item 1000');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const geminiService = GeminiService.getInstance();
