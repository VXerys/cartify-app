/**
 * Auth Service - Real Supabase Implementation
 * 
 * Handles all authentication operations using Supabase Auth.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

const AUTH_COMPLETE_KEY = '@cartify:auth_complete';

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  provider: 'email' | 'google' | 'apple' | null;
}

// Auth state type
export interface AuthState {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Listeners for auth state changes
type AuthStateListener = (state: AuthState) => void;
const listeners: Set<AuthStateListener> = new Set();

// Current auth state
let currentAuthState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

// Notify all listeners of state change
const notifyListeners = () => {
  listeners.forEach((listener) => listener(currentAuthState));
};

// Update auth state
const updateAuthState = (updates: Partial<AuthState>) => {
  currentAuthState = { ...currentAuthState, ...updates };
  notifyListeners();
};

// Convert Supabase User to UserProfile
const userToProfile = (user: User | null): UserProfile | null => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || '',
    fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
    avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    provider: (user.app_metadata?.provider as UserProfile['provider']) || 'email',
  };
};

// Initialize auth state listener
supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
  console.log('Auth state changed:', event);

  const user = userToProfile(session?.user ?? null);
  const isAuthenticated = !!session;

  updateAuthState({
    user,
    session,
    isLoading: false,
    isAuthenticated,
  });

  // Update AsyncStorage for navigation guard
  if (isAuthenticated) {
    await AsyncStorage.setItem(AUTH_COMPLETE_KEY, 'true');
  } else {
    await AsyncStorage.removeItem(AUTH_COMPLETE_KEY);
  }

  // Create/update user profile in database on sign in
  if (event === 'SIGNED_IN' && session?.user) {
    await upsertUserProfile(session.user);
  }
});

// Create or update user profile in profiles table
const upsertUserProfile = async (user: User) => {
  try {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Error upserting profile:', error);
    }
  } catch (error) {
    console.error('Error in upsertUserProfile:', error);
  }
};

export const authService = {
  /**
   * Get current auth state
   */
  getState: (): AuthState => currentAuthState,

  /**
   * Subscribe to auth state changes
   */
  subscribe: (listener: AuthStateListener): (() => void) => {
    listeners.add(listener);
    // Immediately call with current state
    listener(currentAuthState);
    // Return unsubscribe function
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Initialize auth - check for existing session
   */
  initialize: async (): Promise<void> => {
    try {
      updateAuthState({ isLoading: true });

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        updateAuthState({ isLoading: false });
        return;
      }

      const user = userToProfile(session?.user ?? null);

      updateAuthState({
        user,
        session,
        isLoading: false,
        isAuthenticated: !!session,
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      updateAuthState({ isLoading: false });
    }
  },

  /**
   * Sign in with email and password
   */
  signInWithEmail: async (email: string, password: string): Promise<UserProfile> => {
    updateAuthState({ isLoading: true });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      updateAuthState({ isLoading: false });
      throw new Error(error.message);
    }

    if (!data.user) {
      updateAuthState({ isLoading: false });
      throw new Error('No user returned from sign in');
    }

    const user = userToProfile(data.user);
    
    updateAuthState({
      user,
      session: data.session,
      isLoading: false,
      isAuthenticated: true,
    });

    return user!;
  },

  /**
   * Sign up with email and password
   */
  signUp: async (email: string, password: string, fullName: string): Promise<UserProfile> => {
    updateAuthState({ isLoading: true });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      updateAuthState({ isLoading: false });
      throw new Error(error.message);
    }

    if (!data.user) {
      updateAuthState({ isLoading: false });
      throw new Error('No user returned from sign up');
    }

    const user = userToProfile(data.user);

    updateAuthState({
      user,
      session: data.session,
      isLoading: false,
      isAuthenticated: !!data.session,
    });

    return user!;
  },

  /**
   * Sign in with Google OAuth
   */
  signInWithGoogle: async (): Promise<void> => {
    updateAuthState({ isLoading: true });

    try {
      // Create redirect URL using expo scheme
      // For Expo Go: exp://192.168.x.x:8081/--/auth/callback
      // For standalone: cartify://auth/callback
      const redirectUrl = Linking.createURL('auth/callback');
      console.log('OAuth Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        updateAuthState({ isLoading: false });
        throw new Error(error.message);
      }

      if (data?.url) {
        // Open the OAuth URL in a web browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
          {
            showInRecents: true,
            preferEphemeralSession: false,
          }
        );

        console.log('WebBrowser result:', result.type);

        if (result.type === 'success' && result.url) {
          console.log('Callback URL:', result.url);
          
          // Parse the URL to extract tokens
          // The tokens can be in either the hash (#) or query (?) parameters
          const url = result.url;
          let accessToken: string | null = null;
          let refreshToken: string | null = null;

          // Try to get tokens from hash fragment first
          if (url.includes('#')) {
            const hashParams = new URLSearchParams(url.split('#')[1]);
            accessToken = hashParams.get('access_token');
            refreshToken = hashParams.get('refresh_token');
          }
          
          // If not in hash, try query parameters
          if (!accessToken && url.includes('?')) {
            const queryStart = url.indexOf('?');
            const hashStart = url.indexOf('#');
            const queryString = hashStart > queryStart 
              ? url.substring(queryStart + 1, hashStart)
              : url.substring(queryStart + 1);
            const queryParams = new URLSearchParams(queryString);
            accessToken = queryParams.get('access_token');
            refreshToken = queryParams.get('refresh_token');
          }

          if (accessToken) {
            console.log('Setting session with access token');
            // Set the session manually
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (sessionError) {
              throw new Error(sessionError.message);
            }
            console.log('Session set successfully');
          } else {
            console.log('No access token found in callback URL');
            updateAuthState({ isLoading: false });
            throw new Error('Authentication failed - no token received');
          }
        } else if (result.type === 'cancel') {
          updateAuthState({ isLoading: false });
          throw new Error('Google sign in was cancelled');
        } else if (result.type === 'dismiss') {
          updateAuthState({ isLoading: false });
          throw new Error('Google sign in was dismissed');
        }
      }
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      updateAuthState({ isLoading: false });
      throw error;
    }
  },

  /**
   * Send password reset email
   */
  sendPasswordReset: async (email: string): Promise<void> => {
    updateAuthState({ isLoading: true });

    const redirectUrl = Linking.createURL('auth/reset-password');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    updateAuthState({ isLoading: false });

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Sign out
   */
  signOut: async (): Promise<void> => {
    updateAuthState({ isLoading: true });

    const { error } = await supabase.auth.signOut();

    if (error) {
      updateAuthState({ isLoading: false });
      throw new Error(error.message);
    }

    // Clear AsyncStorage
    await AsyncStorage.removeItem(AUTH_COMPLETE_KEY);

    updateAuthState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
  },

  /**
   * Get current user
   */
  getCurrentUser: (): UserProfile | null => {
    return currentAuthState.user;
  },

  /**
   * Get current session
   */
  getSession: (): Session | null => {
    return currentAuthState.session;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return currentAuthState.isAuthenticated;
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates: { fullName?: string; avatarUrl?: string }): Promise<void> => {
    const user = currentAuthState.user;
    if (!user) {
      throw new Error('No user logged in');
    }

    // Update auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating profile table:', profileError);
    }

    // Update local state
    updateAuthState({
      user: {
        ...user,
        fullName: updates.fullName || user.fullName,
        avatarUrl: updates.avatarUrl || user.avatarUrl,
      },
    });
  },
};
