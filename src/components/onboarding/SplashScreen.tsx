import { Layout } from '@/src/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  duration = 2000 
}) => {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateX = useSharedValue(-20);

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.ease });
    logoScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) });

    // Text animation with delay
    textOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 500, easing: Easing.ease })
    );
    textTranslateX.value = withDelay(
      400,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) })
    );

    // Finish after duration
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateX: textTranslateX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.gradientOverlay}>
        <View style={[styles.gradientCircle, styles.gradientCircle1]} />
        <View style={[styles.gradientCircle, styles.gradientCircle2]} />
      </View>

      <View style={styles.content}>
        {/* Logo Icon */}
        <Animated.View style={[styles.iconContainer, logoAnimatedStyle]}>
          <Ionicons 
            name="cart" 
            size={48} 
            color="#FFFFFF" 
          />
        </Animated.View>

        {/* App Name */}
        <Animated.Text style={[styles.appName, textAnimatedStyle]}>
          cartify
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2332', // Dark blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  gradientCircle1: {
    width: 400,
    height: 400,
    backgroundColor: 'rgba(42, 157, 143, 0.15)', // Primary color with opacity
    top: '20%',
    left: '-30%',
  },
  gradientCircle2: {
    width: 350,
    height: 350,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Secondary color with opacity
    bottom: '10%',
    right: '-20%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Layout.colors.primary,
    // Gradient simulation
    shadowColor: Layout.colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
