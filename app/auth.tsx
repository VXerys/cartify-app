import { ForgotPasswordScreen, LoginScreen, RegisterScreen } from '@/src/components/auth';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { toast } from 'sonner-native';

type AuthScreen = 'login' | 'register' | 'forgot-password';

export default function AuthPage() {
  const router = useRouter();
  const { signInWithEmail, signUp, signInWithGoogle, sendPasswordReset } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials',
        duration: 3000,
      });
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
      if (error.message !== 'Google sign in was cancelled') {
        toast.error('Google sign in failed', {
          description: error.message || 'Please try again',
          duration: 3000,
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
      await signUp(email, password, fullName);
      
      toast.success('Account created!', {
        description: 'Welcome to Cartify. Please check your email to verify your account.',
        duration: 4000,
      });
      
      // Note: Supabase might require email verification before allowing login
      // If email confirmation is required, user needs to verify email first
      navigateToHome();
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error('Registration failed', {
        description: error.message || 'Please try again',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [signUp, navigateToHome]);

  const handleGoogleRegister = useCallback(async () => {
    // Same as Google login - OAuth handles both
    await handleGoogleLogin();
  }, [handleGoogleLogin]);

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
