import {
  ForgotPasswordScreen,
  LoginScreen,
  RegisterScreen,
  VerificationPendingScreen
} from '@/src/components/auth';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { toast } from 'sonner-native';

type AuthScreen = 'login' | 'register' | 'forgot-password' | 'verification-pending';

export default function AuthPage() {
  const router = useRouter();
  const { signInWithEmail, signUp, signInWithGoogle, sendPasswordReset } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  // Navigate to home after successful auth
  const navigateToHome = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  // ========================
  // LOGIN HANDLERS
  // ========================
  const handleLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      
      toast.success('Welcome back!', {
        description: 'Login successful',
        duration: 2000,
      });
      
      navigateToHome();
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.message || 'Please check your credentials';
      
      // Check if it's an email verification error
      if (errorMessage.includes('verify your email')) {
        toast.warning('Email Not Verified', {
          description: 'Please check your inbox and verify your email first.',
          duration: 4000,
        });
        // Show verification pending screen
        setPendingVerificationEmail(email);
        setCurrentScreen('verification-pending');
      } else {
        // Show user-friendly error message
        toast.error(errorMessage, {
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [signInWithEmail, navigateToHome]);

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      
      toast.success('Welcome!', {
        description: 'Signed in with Google',
        duration: 2000,
      });
      
      navigateToHome();
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = error.message || 'Please try again';
      
      // Don't show toast for cancelled sign-in
      if (!errorMessage.includes('cancelled') && !errorMessage.includes('canceled')) {
        toast.error(errorMessage, {
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [signInWithGoogle, navigateToHome]);

  // ========================
  // REGISTER HANDLERS
  // ========================
  const handleRegister = useCallback(async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signUp(email, password, fullName);
      
      if (result.requiresVerification) {
        toast.success('Account Created!', {
          description: 'Please check your email to verify your account.',
          duration: 4000,
        });
        
        // Show verification pending screen
        setPendingVerificationEmail(email);
        setCurrentScreen('verification-pending');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.message || 'Please try again';
      
      // Show user-friendly error message
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [signUp]);

  const handleGoogleRegister = useCallback(async () => {
    // Same as Google login - OAuth handles both
    await handleGoogleLogin();
  }, [handleGoogleLogin]);

  // ========================
  // VERIFICATION HANDLERS
  // ========================
  const handleResendVerification = useCallback(async () => {
    try {
      // We need to sign in temporarily to resend verification
      // This is a limitation of Firebase - you can only resend verification for signed-in users
      // For now, we'll just show a message
      toast.info('Verification email', {
        description: 'If you haven\'t received the email, please check your spam folder or try registering again.',
        duration: 5000,
      });
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification', {
        description: error.message || 'Please try again',
        duration: 3000,
      });
    }
  }, []);

  // ========================
  // FORGOT PASSWORD HANDLERS
  // ========================
  const handleSendReset = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      
      toast.success('Email sent!', {
        description: 'Check your inbox for reset link',
        duration: 3000,
      });
      // Success state is handled inside ForgotPasswordScreen
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to send reset email', {
        description: error.message || 'Please try again',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [sendPasswordReset]);

  // ========================
  // NAVIGATION
  // ========================
  const navigateToLogin = useCallback(() => {
    setPendingVerificationEmail('');
    setCurrentScreen('login');
  }, []);

  const navigateToRegister = useCallback(() => {
    setCurrentScreen('register');
  }, []);

  const navigateToForgotPassword = useCallback(() => {
    setCurrentScreen('forgot-password');
  }, []);

  // ========================
  // RENDER
  // ========================
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            onForgotPassword={navigateToForgotPassword}
            onRegister={navigateToRegister}
            isLoading={isLoading}
          />
        );

      case 'register':
        return (
          <RegisterScreen
            onRegister={handleRegister}
            onGoogleRegister={handleGoogleRegister}
            onLogin={navigateToLogin}
            isLoading={isLoading}
          />
        );

      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onSendReset={handleSendReset}
            onBackToLogin={navigateToLogin}
            isLoading={isLoading}
          />
        );

      case 'verification-pending':
        return (
          <VerificationPendingScreen
            email={pendingVerificationEmail}
            onResendEmail={handleResendVerification}
            onBackToLogin={navigateToLogin}
            onCheckVerification={navigateToLogin}
          />
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2332',
  },
});
