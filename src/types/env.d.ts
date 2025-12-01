/// <reference types="expo/types" />

// NOTE: This file ensures that process.env is typed correctly for our specific variables
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_GEMINI_API_KEY: string;
  }
}
