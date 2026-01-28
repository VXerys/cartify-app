import { Layout } from '@/src/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface LoadingScreenProps {
  onFinish: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onFinish, 
  duration = 2500 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const iconOpacity = useSharedValue(0);

  useEffect(() => {
    // Fade in animation
    opacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
    
    // Icon fade in with slight delay
    iconOpacity.value = withTiming(1, { duration: 600, easing: Easing.ease });

    // Pulse animation for the icon container
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Finish after duration
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, iconOpacity, onFinish, opacity, scale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, containerStyle]}>
        <Animated.View style={iconStyle}>
          <Ionicons 
            name="cart-outline" 
            size={64} 
            color="#FFFFFF" 
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D21', // Dark background seperti referensi
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // Gradient effect dengan shadow
    backgroundColor: Layout.colors.primary,
    // Overlay gradient effect
    shadowColor: Layout.colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
    // CSS Gradient simulation dengan multiple shadows
    borderWidth: 0,
    overflow: 'hidden',
  },
});
