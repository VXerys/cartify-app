/**
 * Auth Service - Prepared for Supabase Integration
 * 
 * HOW TO INTEGRATE SUPABASE:
 * 
 * 1. Install Supabase:
 *    npm install @supabase/supabase-js
 * 
 * 2. Create supabase client in src/services/supabase.ts:
 *    import { createClient } from '@supabase/supabase-js';
 *    import AsyncStorage from '@react-native-async-storage/async-storage';
 *    
 *    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
 *    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
 *    
 *    export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
 *      auth: {
 *        storage: AsyncStorage,
 *        autoRefreshToken: true,
 *        persistSession: true,
 *        detectSessionInUrl: false,
 *      },
 *    });
 * 
 * 3. Add to .env:
 *    EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
 *    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
 * 
 * 4. For Google OAuth, configure in Supabase Dashboard:
 *    - Enable Google provider
 *    - Add OAuth credentials
 */

import { AuthState, AuthUser, LoginCredentials, RegisterCredentials } from '@/src/types/auth';

// Placeholder auth state
let authState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

// Listeners for auth state changes
type AuthListener = (state: AuthState) => void;
const listeners: AuthListener[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener(authState));
};

export const authService = {
  /**
   * Get current auth state
   */
  getState: (): AuthState => authState,

  /**
   * Subscribe to auth state changes
   */
  subscribe: (listener: AuthListener): (() => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  /**
   * Sign in with email and password
   * TODO: Implement with Supabase
   * 
   * Example Supabase implementation:
   * const { data, error } = await supabase.auth.signInWithPassword({
   *   email: credentials.email,
   *   password: credentials.password,
   * });
   */
  signInWithEmail: async (credentials: LoginCredentials): Promise<AuthUser> => {
    authState = { ...authState, isLoading: true };
    notifyListeners();

    try {
      // Simulate API call - replace with Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user - replace with actual Supabase response
      const user: AuthUser = {
        id: 'mock-user-id',
        email: credentials.email,
        fullName: 'Test User',
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      authState = {
        user,
        isLoading: false,
        isAuthenticated: true,
      };
      notifyListeners();

      return user;
    } catch (error) {
      authState = { ...authState, isLoading: false };
      notifyListeners();
      throw error;
    }
  },

  /**
   * Sign in with Google OAuth
   * TODO: Implement with Supabase
   * 
   * Example Supabase implementation:
   * const { data, error } = await supabase.auth.signInWithOAuth({
   *   provider: 'google',
   *   options: {
   *     redirectTo: 'cartify://auth/callback',
   *     skipBrowserRedirect: true,
   *   },
   * });
   */
  signInWithGoogle: async (): Promise<AuthUser> => {
    authState = { ...authState, isLoading: true };
    notifyListeners();

    try {
      // Simulate API call - replace with Supabase OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user - replace with actual OAuth response
      const user: AuthUser = {
        id: 'google-user-id',
        email: 'user@gmail.com',
        fullName: 'Google User',
        avatarUrl: 'https://example.com/avatar.png',
        provider: 'google',
        createdAt: new Date().toISOString(),
      };

      authState = {
        user,
        isLoading: false,
        isAuthenticated: true,
      };
      notifyListeners();

      return user;
    } catch (error) {
      authState = { ...authState, isLoading: false };
      notifyListeners();
      throw error;
    }
  },

  /**
   * Sign up with email and password
   * TODO: Implement with Supabase
   * 
   * Example Supabase implementation:
   * const { data, error } = await supabase.auth.signUp({
   *   email: credentials.email,
   *   password: credentials.password,
   *   options: {
   *     data: {
   *       full_name: credentials.fullName,
   *     },
   *   },
   * });
   */
  signUp: async (credentials: RegisterCredentials): Promise<AuthUser> => {
    authState = { ...authState, isLoading: true };
    notifyListeners();

    try {
      // Simulate API call - replace with Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user - replace with actual Supabase response
      const user: AuthUser = {
        id: 'new-user-id',
        email: credentials.email,
        fullName: credentials.fullName,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      authState = {
        user,
        isLoading: false,
        isAuthenticated: true,
      };
      notifyListeners();

      return user;
    } catch (error) {
      authState = { ...authState, isLoading: false };
      notifyListeners();
      throw error;
    }
  },

  /**
   * Send password reset email
   * TODO: Implement with Supabase
   * 
   * Example Supabase implementation:
   * const { error } = await supabase.auth.resetPasswordForEmail(email, {
   *   redirectTo: 'cartify://auth/reset-password',
   * });
   */
  sendPasswordReset: async (email: string): Promise<void> => {
    authState = { ...authState, isLoading: true };
    notifyListeners();

    try {
      // Simulate API call - replace with Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));

      authState = { ...authState, isLoading: false };
      notifyListeners();
    } catch (error) {
      authState = { ...authState, isLoading: false };
      notifyListeners();
      throw error;
    }
  },

  /**
   * Sign out
   * TODO: Implement with Supabase
   * 
   * Example Supabase implementation:
   * const { error } = await supabase.auth.signOut();
   */
  signOut: async (): Promise<void> => {
    authState = { ...authState, isLoading: true };
    notifyListeners();

    try {
      // Simulate API call - replace with Supabase
      await new Promise(resolve => setTimeout(resolve, 500));

      authState = {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      };
      notifyListeners();
    } catch (error) {
      authState = { ...authState, isLoading: false };
      notifyListeners();
      throw error;
    }
  },

  /**
   * Get current session
   * TODO: Implement with Supabase
   * 
   * Example Supabase implementation:
   * const { data: { session } } = await supabase.auth.getSession();
   */
  getSession: async (): Promise<AuthUser | null> => {
    try {
      // Check for existing session - replace with Supabase
      // For now, return null (no session)
      return null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },
};
