import { ForgotPasswordScreen, LoginScreen, RegisterScreen } from '@/src/components/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { toast } from 'sonner-native';

const AUTH_COMPLETE_KEY = '@cartify:auth_complete';

type AuthScreen = 'login' | 'register' | 'forgot-password';

export default function AuthPage() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Mark authentication as complete and navigate to main app
  const completeAuth = useCallback(async () => {
    try {
      // Simpan auth state dulu
      await AsyncStorage.setItem(AUTH_COMPLETE_KEY, 'true');
      
      // Verifikasi bahwa data tersimpan
      const saved = await AsyncStorage.getItem(AUTH_COMPLETE_KEY);
      console.log('Auth saved:', saved);
      
      // Tunggu sebentar untuk memastikan state tersimpan
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate ke home
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing auth:', error);
      // Navigate anyway even if storage fails
      router.replace('/(tabs)');
    }
  }, [router]);

  // ========================
  // LOGIN HANDLERS
  // ========================
  const handleLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement Supabase login here
      console.log('Login with:', email, password);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Welcome back!', {
        description: 'Login successful',
        duration: 2000,
      });
      
      await completeAuth();
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials',
        duration: 3000,
      });
      setIsLoading(false);
    }
  }, [completeAuth]);

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Supabase Google OAuth here
      console.log('Google login');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Welcome!', {
        description: 'Signed in with Google',
        duration: 2000,
      });
      
      await completeAuth();
    } catch (error: any) {
      toast.error('Google sign in failed', {
        description: error.message || 'Please try again',
        duration: 3000,
      });
      setIsLoading(false);
    }
  }, [completeAuth]);

  // ========================
  // REGISTER HANDLERS
  // ========================
  const handleRegister = useCallback(async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement Supabase register here
      console.log('Register with:', fullName, email, password);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Account created!', {
        description: 'Welcome to Cartify',
        duration: 2000,
      });
      
      await completeAuth();
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message || 'Please try again',
        duration: 3000,
      });
      setIsLoading(false);
    }
  }, [completeAuth]);

  const handleGoogleRegister = useCallback(async () => {
    await handleGoogleLogin();
  }, [handleGoogleLogin]);

  // ========================
  // FORGOT PASSWORD HANDLERS
  // ========================
  const handleSendReset = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement Supabase password reset here
      console.log('Send reset to:', email);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success state is handled inside ForgotPasswordScreen
    } catch (error: any) {
      toast.error('Failed to send reset email', {
        description: error.message || 'Please try again',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

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
