import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../src/i18n';

import { Layout } from '@/src/constants/Layout';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { migrateDbIfNeeded } from '@/src/services/db';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();
  const hasNavigated = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isReady) return;
    if (hasNavigated.current) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === 'auth';

    // If authenticated and still in onboarding/auth, redirect to home
    if (isAuthenticated && (inOnboarding || inAuth)) {
      console.log('User authenticated, redirecting to tabs');
      hasNavigated.current = true;
      router.replace('/(tabs)');
    }
  }, [isReady, isAuthenticated, segments, router]);

  // Show loading while checking auth
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Layout.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

function RootStack() {
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
          <AuthProvider>
            <NavigationGuard>
              <RootStack />
            </NavigationGuard>
          </AuthProvider>
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
