/**
 * Auth Context Provider
 * 
 * Provides authentication state and methods to the entire app.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService, AuthState, UserProfile } from '../services/authService';

interface AuthContextType extends AuthState {
  // Auth methods
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ requiresVerification: boolean }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfile: (updates: { fullName?: string; avatarUrl?: string }) => Promise<void>;
  // Refresh auth state
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
    });

    // Initialize auth on mount
    authService.initialize();

    return () => {
      unsubscribe();
    };
  }, []);

  // Sign in with email
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await authService.signInWithEmail(email, password);
  }, []);

  // Sign up - returns whether verification is required
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    return await authService.signUp(email, password, fullName);
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    await authService.signInWithGoogle();
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await authService.signOut();
  }, []);

  // Send password reset
  const sendPasswordReset = useCallback(async (email: string) => {
    await authService.sendPasswordReset(email);
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: { fullName?: string; avatarUrl?: string }) => {
    await authService.updateProfile(updates);
  }, []);

  // Refresh auth state
  const refreshAuth = useCallback(async () => {
    await authService.initialize();
  }, []);

  const value: AuthContextType = {
    ...authState,
    signInWithEmail,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    updateProfile,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types
export type { AuthState, UserProfile };

