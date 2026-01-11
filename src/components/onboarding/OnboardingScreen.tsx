import React, { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import Animated, { FadeIn, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingBackground } from './OnboardingBackground';
import { onboardingSlides } from './OnboardingData';
import { OnboardingPagination } from './OnboardingPagination';
import { styles } from './OnboardingScreen.styles';
import { OnboardingScreenProps } from './OnboardingScreen.types';
import { OnboardingSlideItem } from './OnboardingSlideItem';

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted,
  onLogin,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onGetStarted();
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Gradient Background */}
      <OnboardingBackground />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={onboardingSlides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => (
            <OnboardingSlideItem item={item} index={index} scrollX={scrollX} />
          )}
        />

        {/* Bottom Section: Pagination & Buttons */}
        <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.bottomContainer}>
          <OnboardingPagination data={onboardingSlides} currentIndex={currentIndex} />

          {/* Get Started / Next Button */}
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>
              {currentIndex === onboardingSlides.length - 1 ? 'GET STARTED' : 'NEXT'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity style={styles.loginButton} onPress={onLogin} activeOpacity={0.7}>
            <Text style={styles.loginText}>I am already registered</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};