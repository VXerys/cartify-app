/**
 * Navigation Type Definitions
 * Type-safe routing untuk React Navigation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Root Stack Parameter List
 * Mendefinisikan semua screen dan parameter yang bisa diterima
 */
export type RootStackParamList = {
  /**
   * Splash Screen - Initial loading screen
   */
  Splash: undefined;
  
  /**
   * Onboarding - Tutorial screen untuk first-time users
   */
  Onboarding: undefined;
  
  /**
   * Login - Authentication screen
   * Optional parameter untuk redirect setelah login
   */
  Login: {
    redirectTo?: keyof RootStackParamList;
  } | undefined;
  
  /**
   * Home - Main shopping screen dengan voice input
   */
  Home: undefined;
  
  /**
   * History - Riwayat shopping sessions
   * Optional filter parameter
   */
  History: {
    filterBy?: 'date' | 'amount';
    dateRange?: {
      start: string;
      end: string;
    };
  } | undefined;
  
  /**
   * Settings - App configuration dan preferences
   */
  Settings: undefined;
  
  /**
   * SessionDetail - Detail dari shopping session tertentu
   */
  SessionDetail: {
    sessionId: string;
  };
  
  /**
   * ManualInput - Fallback screen jika voice recognition gagal
   */
  ManualInput: {
    context?: string; // Context dari voice command yang gagal
  } | undefined;
};

/**
 * Helper type untuk screen props dengan type safety
 * Usage: RootStackScreenProps<'Home'>
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/**
 * Helper type untuk navigation prop saja
 */
export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  RootStackScreenProps<T>['navigation'];

/**
 * Helper type untuk route prop saja
 */
export type RootStackRouteProp<T extends keyof RootStackParamList> =
  RootStackScreenProps<T>['route'];

/**
 * Declare global type untuk useNavigation hook
 * Agar TypeScript bisa auto-complete di semua screen
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
