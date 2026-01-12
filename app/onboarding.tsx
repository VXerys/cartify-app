import { OnboardingScreen, SplashScreen } from '@/src/components/onboarding';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type OnboardingPhase = 'splash' | 'onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<OnboardingPhase>('splash');

  // Splash screen selesai -> ke Onboarding slides
  const handleSplashFinish = useCallback(() => {
    setPhase('onboarding');
  }, []);

  // Get Started button pressed -> ke Auth (register)
  const handleGetStarted = useCallback(() => {
    router.push('/auth');
  }, [router]);

  // Already registered link pressed -> ke Auth (login)
  const handleLogin = useCallback(() => {
    router.push('/auth');
  }, [router]);

  // Render berdasarkan phase
  switch (phase) {
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

