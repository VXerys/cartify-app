import React from 'react';
import { Image, View } from 'react-native';
import Animated, { FadeInUp, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { styles, width } from './OnboardingScreen.styles';
import { SlideItemProps } from './OnboardingScreen.types';

export const OnboardingSlideItem: React.FC<SlideItemProps> = ({ item, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8]);
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.slideContainer}>
      {/* Title */}
      <Animated.Text entering={FadeInUp.delay(200).duration(500)} style={styles.slideTitle}>
        {item.title}
      </Animated.Text>

      {/* Onboarding Image */}
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image
          source={item.image}
          style={styles.onboardingImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};
