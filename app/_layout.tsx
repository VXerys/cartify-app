import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../src/i18n';

import { Layout } from '@/src/constants/Layout';
import { migrateDbIfNeeded } from '@/src/services/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteProvider } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

const AUTH_COMPLETE_KEY = '@cartify:auth_complete';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

function InitialLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasNavigated = useRef(false);

  // Check auth status - hanya dipanggil sekali saat mount
  const checkAuthStatus = useCallback(async () => {
    try {
      const authenticated = await AsyncStorage.getItem(AUTH_COMPLETE_KEY);
      const isAuth = authenticated === 'true';
      console.log('Initial auth check:', isAuth);
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsInitialCheckDone(true);
    }
  }, []);

  // Initial check saat app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Navigation guard - HANYA untuk initial load
  useEffect(() => {
    // Tunggu sampai initial check selesai
    if (!isInitialCheckDone) return;
    
    // Jangan navigate lagi jika sudah pernah
    if (hasNavigated.current) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === 'auth';
    
    // Jika sudah login dan masih di onboarding/auth, redirect ke home
    if (isAuthenticated && (inOnboarding || inAuth)) {
      console.log('User authenticated, redirecting to tabs');
      hasNavigated.current = true;
      router.replace('/(tabs)');
    }
    // Jika belum login, biarkan flow normal (onboarding -> auth -> home)
    // TIDAK melakukan redirect dari tabs ke onboarding di sini
    // karena itu akan ditangani oleh logout
  }, [isInitialCheckDone, isAuthenticated, segments, router]);

  // Loading state saat pertama kali check auth
  if (!isInitialCheckDone) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Layout.colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
          animation: 'fade',
        }} 
      />
      <Stack.Screen 
        name="auth" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          animation: 'fade',
        }} 
      />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal', 
          title: 'Modal',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="security-privacy" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="help-center" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="terms-policy" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="transaction/[id]" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <SQLiteProvider databaseName="cartify.db" onInit={migrateDbIfNeeded}>
          <InitialLayout />
        </SQLiteProvider>
        <StatusBar style="light" />
        <Toaster />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A2332',
  },
});
