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
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const previousAuthState = useRef<boolean | null>(null);

  // Step 1: Wait for auth to finish loading, then determine initial route
  useEffect(() => {
    if (isLoading) return;
    
    // Auth is done loading, now we can navigate
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Step 2: Handle initial navigation and subsequent auth changes
  useEffect(() => {
    if (!isNavigationReady) return;

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
      setHasNavigated(true);
      return;
    }

    // Initial mount or auth state resolved
    if (!hasNavigated) {
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
      setHasNavigated(true);
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
  }, [isNavigationReady, hasNavigated, isAuthenticated, segments, router]);

  // Show loading overlay until navigation is ready AND has navigated
  const showLoading = !isNavigationReady || !hasNavigated;

  return (
    <>
      {children}
      {showLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingLogo}>
            <ActivityIndicator size="large" color={Layout.colors.primary} />
          </View>
        </View>
      )}
    </>
  );
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
