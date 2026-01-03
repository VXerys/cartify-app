/**
 * Auth Service - Firebase Implementation
 * 
 * Handles authentication operations using Firebase Auth.
 * Supports Email/Password and Google Sign-In.
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Import Google Sign-In configuration
import { configureGoogleSignIn } from './googleSignIn';

// Initialize Google Sign-In
configureGoogleSignIn();

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
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Listeners for auth state changes
type AuthStateListener = (state: AuthState) => void;
const listeners: Set<AuthStateListener> = new Set();

// Current auth state
let currentAuthState: AuthState = {
  user: null,
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

// Convert Firebase User to UserProfile
const userToProfile = (user: FirebaseAuthTypes.User | null): UserProfile | null => {
  if (!user) return null;

  const providerData = user.providerData[0];
  const providerId = providerData?.providerId;
  
  let provider: UserProfile['provider'] = 'email';
  if (providerId === 'google.com') provider = 'google';
  else if (providerId === 'apple.com') provider = 'apple';

  return {
    id: user.uid,
    email: user.email || '',
    fullName: user.displayName || null,
    avatarUrl: user.photoURL || null,
    provider,
  };
};

// Initialize auth state listener
auth().onAuthStateChanged((user) => {
  const userProfile = userToProfile(user);
  const isAuthenticated = !!user;

  console.log('Firebase Auth State Changed:', user?.email);

  updateAuthState({
    user: userProfile,
    isLoading: false,
    isAuthenticated,
  });
});

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
    listener(currentAuthState);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Initialize auth (handled by onAuthStateChanged)
   */
  initialize: async (): Promise<void> => {
    // No manual op needed for Firebase, it restores state automatically
  },

  /**
   * Sign in with email and password
   */
  signInWithEmail: async (email: string, password: string): Promise<UserProfile> => {
    updateAuthState({ isLoading: true });
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userToProfile(userCredential.user);
      return user!;
    } catch (error: any) {
      updateAuthState({ isLoading: false });
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  },

  /**
   * Sign up with email and password
   */
  signUp: async (email: string, password: string, fullName: string): Promise<UserProfile> => {
    updateAuthState({ isLoading: true });
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update profile with name
      if (userCredential.user) {
        await userCredential.user.updateProfile({
          displayName: fullName,
        });
      }

      const user = userToProfile(auth().currentUser); // Get updated user
      return user!;
    } catch (error: any) {
      updateAuthState({ isLoading: false });
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  },

  /**
   * Sign in with Google (Native Popup)
   */
  signInWithGoogle: async (): Promise<void> => {
    updateAuthState({ isLoading: true });
    try {
      // Check Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
      
      console.log('Google Sign-In successful');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      updateAuthState({ isLoading: false });
      
      if (error.code === '12501') { // SIGN_IN_CANCELLED code often appears as this string
         throw new Error('Sign-in cancelled');
      }
      
      throw error;
    }
  },

  /**
   * Send password reset email
   */
  sendPasswordReset: async (email: string): Promise<void> => {
    updateAuthState({ isLoading: true });
    try {
      await auth().sendPasswordResetEmail(email);
      updateAuthState({ isLoading: false });
    } catch (error: any) {
      updateAuthState({ isLoading: false });
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  },

  /**
   * Sign out
   */
  signOut: async (): Promise<void> => {
    updateAuthState({ isLoading: true });
    try {
      await GoogleSignin.signOut(); // Sign out from Google as well
      await auth().signOut();
    } catch (error: any) {
      updateAuthState({ isLoading: false });
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates: { fullName?: string; avatarUrl?: string }): Promise<void> => {
    const user = auth().currentUser;
    if (!user) throw new Error('No user logged in');

    try {
      await user.updateProfile({
        displayName: updates.fullName || user.displayName,
        photoURL: updates.avatarUrl || user.photoURL,
      });

      // Force refresh user to update local state
      await user.reload();
      const updatedUser = userToProfile(auth().currentUser);
      
      updateAuthState({ 
        user: updatedUser,
        isLoading: false
      });
      
    } catch (error: any) {
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  }
};

// Helper: Map Firebase error codes to human-readable messages
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email address is already in use!';
    case 'auth/invalid-email':
      return 'That email address is invalid!';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    default:
      return code || 'An unknown error occurred.';
  }
}
