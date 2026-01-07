import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
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
      {/* Premium Gradient Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.gradientOverlay} />
        
        {/* Mesh gradients - center focused */}
        <View style={[styles.meshGradient, styles.meshGradient1]} />
        <View style={[styles.meshGradient, styles.meshGradient2]} />
        <View style={[styles.meshGradient, styles.meshGradient3]} />
        
        {/* Glowing orbs - centered layout */}
        <View style={[styles.glowOrb, styles.glowOrb1]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />
      </View>

      <View style={styles.content}>
        {/* Logo Icon */}
        <Animated.View style={logoAnimatedStyle}>
          <Image 
            source={require('@/assets/images/cartify-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Premium Background Styles
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
  },
  meshGradient: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
  },
  meshGradient1: {
    width: width * 1.0,
    height: width * 1.0,
    backgroundColor: 'rgba(42, 157, 143, 0.18)',
    top: '20%',
    left: '-20%',
    transform: [{ rotate: '-20deg' }],
  },
  meshGradient2: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    bottom: '15%',
    right: '-25%',
    transform: [{ rotate: '25deg' }],
  },
  meshGradient3: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    top: '5%',
    right: '10%',
    transform: [{ rotate: '10deg' }],
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowOrb1: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(42, 157, 143, 0.25)',
    top: height * 0.25,
    left: -60,
    shadowColor: '#2A9D8F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 80,
    elevation: 20,
  },
  glowOrb2: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    bottom: height * 0.25,
    right: -50,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 160,
    height: 160,
    marginRight: -45,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
