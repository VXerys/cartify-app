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
      {/* Splash Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.gradientOverlay} />
        
        {/* Group 1: Top Left (Teal Anchor) */}
        <View style={[styles.meshGradient, styles.meshGradient1]} />
        <View style={[styles.glowOrb, styles.glowOrb1]} />

        {/* Group 2: Bottom Right (Emerald Anchor) */}
        <View style={[styles.meshGradient, styles.meshGradient2]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />

        {/* Group 3: Top Right (Blue Accent) */}
        <View style={[styles.meshGradient, styles.meshGradient3]} />
        <View style={[styles.glowOrb, styles.glowOrb3]} />

        {/* Group 4: Bottom Left (Cyan Accent) */}
        <View style={[styles.meshGradient, styles.meshGradient4]} />
        <View style={[styles.glowOrb, styles.glowOrb4]} />
      </View>

      {/* Main Content Wrapper */}
      <View style={styles.contentWrapper}>
        <View style={styles.logoTextContainer}>
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
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
  },
  
  // Group 1: Top Left (Teal - Large Anchor)
  // Anchor Center: roughly 10% from top-left
  meshGradient1: {
    width: width * 0.65,
    height: width * 0.65,
    backgroundColor: 'rgba(42, 157, 143, 0.12)',
    position: 'absolute',
    top: -width * 0.15, // Center Y approx 17%
    left: -width * 0.15, // Center X approx 17%
  },
  glowOrb1: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(42, 157, 143, 0.3)',
    position: 'absolute',
    // Centered relative to mesh1 center
    // Mesh Center = (-0.15w + 0.325w) = 0.175w
    // Orb Center target = 0.175w
    // Orb Top = 0.175w - (120/2)
    top: (width * 0.325) - 60 - (width * 0.15), 
    left: (width * 0.325) - 60 - (width * 0.15),
    shadowColor: '#2A9D8F',
    shadowRadius: 60,
    elevation: 20,
  },

  // Group 2: Bottom Right (Emerald - Large Anchor)
  // Anchor Center: roughly 10% from bottom-right
  meshGradient2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    position: 'absolute',
    bottom: -width * 0.2, 
    right: -width * 0.2,
  },
  glowOrb2: {
    width: 130,
    height: 130,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    position: 'absolute',
    // Centered relative to mesh2 center
    bottom: (width * 0.35) - 65 - (width * 0.2),
    right: (width * 0.35) - 65 - (width * 0.2),
    shadowColor: '#10B981',
    shadowRadius: 50,
    elevation: 15,
  },

  // Group 3: Top Right (Blue - Small Accent)
  meshGradient3: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    position: 'absolute',
    top: height * 0.1,
    right: -width * 0.1,
  },
  glowOrb3: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    position: 'absolute',
    // Centered relative to mesh3
    top: (height * 0.1) + (width * 0.2) - 35,
    right: (-width * 0.1) + (width * 0.2) - 35,
    shadowColor: '#3B82F6',
    shadowRadius: 30,
    elevation: 10,
  },

  // Group 4: Bottom Left (Cyan - Medium Accent)
  meshGradient4: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: 'rgba(45, 212, 191, 0.08)',
    position: 'absolute',
    bottom: height * 0.15,
    left: -width * 0.15,
  },
  glowOrb4: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(45, 212, 191, 0.2)',
    position: 'absolute',
    // Centered relative to mesh4
    bottom: (height * 0.15) + (width * 0.25) - 45,
    left: (-width * 0.15) + (width * 0.25) - 45,
    shadowColor: '#2DD4BF',
    shadowRadius: 40,
    elevation: 12,
  },

  // Wrapper to ensure absolute centering of the group
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // We let the container shrink-wrap the content
  },
  logoImage: {
    width: 200,
    height: 200,
    marginLeft: -60,
    // Negative margin to pull text closer
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: -60, 
    zIndex: 10,
    elevation: 10,
  },
});
