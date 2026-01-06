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
  
  // For email/password users, check if email is verified
  // Google/Apple sign-in users are automatically verified
  let isAuthenticated = false;
  
  if (user) {
    const providerData = user.providerData[0];
    const isEmailProvider = providerData?.providerId === 'password';
    
    if (isEmailProvider) {
      // Email users must have verified email
      isAuthenticated = user.emailVerified;
      console.log('Firebase Auth State Changed:', user?.email, 'Verified:', user.emailVerified);
    } else {
      // OAuth users (Google, Apple) are always verified
      isAuthenticated = true;
      console.log('Firebase Auth State Changed (OAuth):', user?.email);
    }
  } else {
    console.log('Firebase Auth State Changed: No user');
  }

  updateAuthState({
    user: isAuthenticated ? userProfile : null,
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
   * Checks if email is verified before allowing login
   */
  signInWithEmail: async (email: string, password: string): Promise<UserProfile> => {
    updateAuthState({ isLoading: true });
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        // Sign out the unverified user
        await auth().signOut();
        updateAuthState({ isLoading: false });
        throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
      }
      
      const user = userToProfile(userCredential.user);
      return user!;
    } catch (error: any) {
      updateAuthState({ isLoading: false });
      // Check if it's our custom error
      if (error.message?.includes('verify your email')) {
        throw error;
      }
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  },

  /**
   * Sign up with email and password
   * After signup, sends verification email and signs out the user
   * User must verify email before they can login
   */
  signUp: async (email: string, password: string, fullName: string): Promise<{ requiresVerification: boolean }> => {
    updateAuthState({ isLoading: true });
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update profile with name
      if (userCredential.user) {
        await userCredential.user.updateProfile({
          displayName: fullName,
        });
        
        // Send verification email
        await userCredential.user.sendEmailVerification();
        
        // Sign out the user - they must verify email first
        await auth().signOut();
      }

      updateAuthState({ isLoading: false });
      return { requiresVerification: true };
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
      
      // Handle specific Google Sign-In error codes
      const errorCode = error.code?.toString() || '';
      const errorMessage = error.message || '';
      
      // User cancelled sign-in
      if (errorCode === '12501' || errorCode === 'SIGN_IN_CANCELLED' || 
          errorMessage.includes('cancelled') || errorMessage.includes('canceled')) {
        throw new Error('Google sign in was cancelled');
      }
      
      // No ID token - usually means Web Client ID is not configured
      if (errorMessage.includes('No ID token')) {
        throw new Error('Google Sign-In is not configured properly. Please contact support.');
      }
      
      // Play services not available
      if (errorCode === '12500' || errorMessage.includes('Play Services')) {
        throw new Error('Google Play Services is required. Please update or install it.');
      }
      
      // Network error
      if (errorCode === '7' || errorMessage.includes('network')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      // Developer error (wrong SHA-1 or package name)
      if (errorCode === '10' || errorMessage.includes('DEVELOPER_ERROR')) {
        throw new Error('Google Sign-In configuration error. Please contact support.');
      }
      
      // Generic error with user-friendly message
      throw new Error('Google Sign-In failed. Please try again.');
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
    // Email/Password errors
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check and try again.';
    case 'auth/invalid-login-credentials':
      return 'Invalid email or password. Please check and try again.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    
    // Rate limiting
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    
    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    
    // Google Sign-In errors
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled.';
    case 'auth/cancelled-popup-request':
      return 'Sign in was cancelled.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    
    // Email verification
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this action.';
    
    // Operation errors
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/expired-action-code':
      return 'This link has expired. Please request a new one.';
    case 'auth/invalid-action-code':
      return 'This link is invalid or has already been used.';
    
    default:
      // Log unknown errors for debugging
      console.warn('Unknown Firebase auth error:', code);
      return 'Something went wrong. Please try again.';
  }
}
