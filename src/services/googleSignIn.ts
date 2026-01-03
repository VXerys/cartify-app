/**
 * Google Sign-In Configuration
 * 
 * This file initializes Google Sign-In with the Web Client ID from Google Cloud Console.
 * The Web Client ID is used for token verification with Supabase.
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
// IMPORTANT: Use the WEB CLIENT ID here, not the Android Client ID
// The Web Client ID is used to verify the ID token with Supabase
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // Web Client ID from Google Cloud Console
    // This is used to request an ID token that can be verified by Supabase
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    
    // Explicitly set package name to ensure match
    // Must match the package name in app.json and Google Cloud Console
    accountName: '', // Empty to clear pervious sessions
    
    // Scopes required for basic profile info
    scopes: ['profile', 'email'],
    
    // Request offline access for refresh token (optional)
    offlineAccess: true,
    
    // Force account selection each time (shows account picker)
    forceCodeForRefreshToken: true,
  });
  
  console.log('Google Sign-In configured');
};

// Export for use in other files
export { GoogleSignin };
