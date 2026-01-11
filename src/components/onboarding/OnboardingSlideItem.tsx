import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { styles, width } from './OnboardingScreen.styles';
import { SlideItemProps } from './OnboardingScreen.types';

const MOCK_CATEGORIES = ['Home', 'Food', 'Health', 'Restaurants', 'Sport'];

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

      {/* Image Placeholder - Mock phone screen */}
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <View style={styles.imagePlaceholder}>
          <View style={styles.mockPhoneScreen}>
            <View style={styles.mockHeader}>
              <View style={styles.mockTime}>
                <Text style={styles.mockTimeText}>9:30</Text>
              </View>
              <View style={styles.mockSignal} />
            </View>
            <View style={styles.mockContent}>
              <View style={styles.mockTitleBar}>
                <View style={styles.mockBackButton} />
                <Text style={styles.mockScreenTitle}>Categories</Text>
              </View>
              {/* Mock category items */}
              {MOCK_CATEGORIES.map((cat, idx) => (
                <View key={cat} style={styles.mockCategoryItem}>
                  <View
                    style={[
                      styles.mockCategoryIcon,
                      { backgroundColor: idx % 2 === 0 ? '#34C759' : '#FF6B6B' },
                    ]}
                  />
                  <Text style={styles.mockCategoryText}>{cat}</Text>
                  <View style={styles.mockEditButton}>
                    <Text style={styles.mockEditText}>Edit</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          {/* Floating icons simulation */}
          <View style={[styles.floatingIcon, styles.floatingIcon1]}>
            <View style={styles.floatingIconInner} />
          </View>
          <View style={[styles.floatingIcon, styles.floatingIcon2]}>
            <View style={[styles.floatingIconInner, { backgroundColor: '#FF6B6B' }]} />
          </View>
          <View style={[styles.floatingIcon, styles.floatingIcon3]}>
            <View style={[styles.floatingIconInner, { backgroundColor: '#4A90D9' }]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
