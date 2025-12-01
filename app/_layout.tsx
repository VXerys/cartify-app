/**
 * Cartify Root Layout
 * Entry point untuk Expo Router navigation
 */

import { database } from '@/src/services/storage/database';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Initialize database saat app startup
    async function initializeApp() {
      try {
        await database.initDB();
        console.log('✅ App initialized');
      } catch (error) {
        console.error('❌ App initialization failed:', error);
      } finally {
        // Hide splash screen setelah init selesai
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(main)" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
