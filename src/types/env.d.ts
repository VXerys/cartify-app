/**
 * Environment Variable Type Definitions
 * Cartify - VoiceCart Application
 * 
 * Type-safe access to environment variables for Expo SDK 50+
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Google Gemini API Key untuk voice command parsing
       * Format: Diawali dengan EXPO_PUBLIC_ agar bisa diakses di client-side
       * @required
       */
      EXPO_PUBLIC_GEMINI_API_KEY: string;
      
      /**
       * Environment mode (development, staging, production)
       * @optional
       */
      EXPO_PUBLIC_ENV?: 'development' | 'staging' | 'production';
      
      /**
       * API Base URL (jika ada backend custom di masa depan)
       * @optional
       */
      EXPO_PUBLIC_API_URL?: string;
    }
  }
}

/**
 * Type-safe wrapper untuk mengakses env variables
 * Menggunakan expo-constants untuk Expo SDK 50+
 */
export interface EnvConfig {
  GEMINI_API_KEY: string;
  ENV: 'development' | 'staging' | 'production';
  API_URL?: string;
}

export { };

