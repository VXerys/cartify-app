/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client for authentication and database operations.
 * Make sure to set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create Supabase client with React Native specific configuration
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      // Use AsyncStorage for persisting auth session
      storage: AsyncStorage,
      // Automatically refresh the token
      autoRefreshToken: true,
      // Persist session across app restarts
      persistSession: true,
      // Disable URL detection (not applicable for React Native)
      detectSessionInUrl: false,
      // Flow type for React Native
      flowType: 'pkce',
    },
  }
);

// Handle app state changes for token refresh (mobile specific)
// When app comes to foreground, check and refresh session if needed
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

// Type definitions for Supabase database tables
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: number;
          user_id: string;
          date: string;
          total_amount: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          total_amount: number;
          note?: string | null;
        };
        Update: {
          date?: string;
          total_amount?: number;
          note?: string | null;
        };
      };
      transaction_items: {
        Row: {
          id: number;
          transaction_id: number;
          item_name: string;
          item_price: number;
          quantity: number;
          unit: string | null;
          category: string;
          total_price: number;
        };
        Insert: {
          transaction_id: number;
          item_name: string;
          item_price: number;
          quantity: number;
          unit?: string | null;
          category: string;
          total_price: number;
        };
        Update: {
          item_name?: string;
          item_price?: number;
          quantity?: number;
          unit?: string | null;
          category?: string;
          total_price?: number;
        };
      };
    };
  };
};
