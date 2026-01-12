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
  const [isReady, setIsReady] = useState(false);
  const previousAuthState = useRef<boolean | null>(null);
  const hasInitialNavigation = useRef(false);

  // Handle navigation logic
  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    const currentSegment = segments[0];
    const inOnboarding = currentSegment === 'onboarding';
    const inAuth = currentSegment === 'auth';
    const inProtectedRoute = currentSegment === '(tabs)' || 
                             currentSegment === 'security-privacy' || 
                             currentSegment === 'help-center' ||
                             currentSegment === 'terms-policy' ||
                             currentSegment === 'transaction';

    // Detect logout scenario
    const wasAuthenticated = previousAuthState.current === true;
    const justLoggedOut = wasAuthenticated && !isAuthenticated;
    
    // Update previous state for next comparison
    previousAuthState.current = isAuthenticated;

    // Handle logout - always redirect to onboarding
    if (justLoggedOut) {
      console.log('User logged out, redirecting to onboarding');
      router.replace('/onboarding');
      return;
    }

    // Initial navigation (only once)
    if (!hasInitialNavigation.current) {
      hasInitialNavigation.current = true;
      
      if (isAuthenticated) {
        // User is logged in - go to home if not already there
        if (!inProtectedRoute) {
          console.log('User authenticated on mount, redirecting to tabs');
          router.replace('/(tabs)');
        }
      } else {
        // User is not logged in - go to onboarding if not already there
        if (!inOnboarding && !inAuth) {
          console.log('User not authenticated on mount, redirecting to onboarding');
          router.replace('/onboarding');
        }
      }
      
      // Small delay to ensure navigation completes before showing content
      setTimeout(() => {
        setIsReady(true);
      }, 100);
      return;
    }

    // Handle subsequent navigation attempts (after initial mount)
    if (isAuthenticated && (inOnboarding || inAuth)) {
      console.log('User authenticated, redirecting to tabs');
      router.replace('/(tabs)');
      return;
    }

    if (!isAuthenticated && inProtectedRoute) {
      console.log('User not authenticated, redirecting to onboarding');
      router.replace('/onboarding');
      return;
    }
  }, [isLoading, isAuthenticated, segments, router]);

  // Show loading screen until ready
  if (!isReady) {
    return (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingLogo}>
          <ActivityIndicator size="large" color={Layout.colors.primary} />
        </View>
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
    backgroundColor: '#0F172A',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    zIndex: 9999,
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(42, 157, 143, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
