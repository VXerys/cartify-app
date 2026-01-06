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
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (!isLoading) {
      // Small delay to ensure navigation state is stable after hot reload
      const timer = setTimeout(() => {
        setIsReady(true);
        isInitialMount.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isReady) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === 'auth';
    const inProtectedRoute = segments[0] === '(tabs)' || 
                             segments[0] === 'security-privacy' || 
                             segments[0] === 'help-center' ||
                             segments[0] === 'terms-policy' ||
                             segments[0] === 'transaction';

    // Detect logout: was authenticated, now not authenticated
    const wasAuthenticated = previousAuthState.current === true;
    const justLoggedOut = wasAuthenticated && !isAuthenticated;
    
    // Update previous state
    previousAuthState.current = isAuthenticated;

    // Handle logout - redirect to onboarding
    if (justLoggedOut) {
      console.log('User logged out, redirecting to onboarding');
      router.replace('/onboarding');
      return;
    }

    // If authenticated and in onboarding/auth, redirect to home
    if (isAuthenticated && (inOnboarding || inAuth)) {
      console.log('User authenticated, redirecting to tabs');
      router.replace('/(tabs)');
      return;
    }

    // If not authenticated and trying to access protected route, redirect to onboarding
    if (!isAuthenticated && inProtectedRoute) {
      console.log('User not authenticated, redirecting to onboarding');
      router.replace('/onboarding');
      return;
    }
  }, [isReady, isAuthenticated, segments, router]);

  // Use overlay approach - covers everything including cached routes
  return (
    <>
      {children}
      {!isReady && (
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
