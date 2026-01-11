/**
 * Google Sign-In Configuration
 * 
 * This file initializes Google Sign-In with the Web Client ID from Google Cloud Console.
 * The Web Client ID is used for token verification with Firebase.
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Track if Google Sign-In has been configured
let isConfigured = false;

// Initialize Google Sign-In
// IMPORTANT: Use the WEB CLIENT ID here, not the Android Client ID
// The Web Client ID is used to request an ID token that can be verified by Firebase
export const configureGoogleSignIn = () => {
  // Avoid reconfiguring if already done
  if (isConfigured) {
    return;
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  
  // Log warning if webClientId is missing but don't crash
  if (!webClientId) {
    console.warn(
      'Google Sign-In: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set. ' +
      'Google Sign-In will not work properly. ' +
      'Please set this environment variable in your EAS build configuration.'
    );
  }

  try {
    GoogleSignin.configure({
      // Web Client ID from Google Cloud Console
      // This is used to request an ID token that can be verified by Firebase
      webClientId: webClientId || '',
      
      // Explicitly set package name to ensure match
      // Must match the package name in app.json and Google Cloud Console
      accountName: '', // Empty to clear previous sessions
      
      // Scopes required for basic profile info
      scopes: ['profile', 'email'],
      
      // Request offline access for refresh token (optional)
      offlineAccess: true,
      
      // Force account selection each time (shows account picker)
      forceCodeForRefreshToken: true,
    });
    
    isConfigured = true;
    console.log('Google Sign-In configured successfully');
  } catch (error) {
    console.error('Failed to configure Google Sign-In:', error);
  }
};

// Export for use in other files
export { GoogleSignin };

