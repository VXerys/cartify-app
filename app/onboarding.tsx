import { LoadingScreen, OnboardingScreen, SplashScreen } from '@/src/components/onboarding';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type OnboardingPhase = 'loading' | 'splash' | 'onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<OnboardingPhase>('loading');

  // Phase 1: Loading screen selesai -> ke Splash
  const handleLoadingFinish = useCallback(() => {
    setPhase('splash');
  }, []);

  // Phase 2: Splash screen selesai -> ke Onboarding slides
  const handleSplashFinish = useCallback(() => {
    setPhase('onboarding');
  }, []);

  // Phase 3a: Get Started button pressed -> ke Auth (register)
  const handleGetStarted = useCallback(() => {
    router.push('/auth');
  }, [router]);

  // Phase 3b: Already registered link pressed -> ke Auth (login)
  const handleLogin = useCallback(() => {
    router.push('/auth');
  }, [router]);

  // Render berdasarkan phase
  switch (phase) {
    case 'loading':
      return <LoadingScreen onFinish={handleLoadingFinish} duration={2000} />;
    
    case 'splash':
      return <SplashScreen onFinish={handleSplashFinish} duration={1800} />;
    
    case 'onboarding':
      return (
        <OnboardingScreen 
          onGetStarted={handleGetStarted} 
          onLogin={handleLogin} 
        />
      );
    
    default:
      return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2332',
  },
});
