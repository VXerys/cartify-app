import { Layout } from '@/src/constants/Layout';
import React, { useRef, useState } from 'react';
import {
   Dimensions,
   FlatList,
   NativeScrollEvent,
   NativeSyntheticEvent,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   ViewToken,
} from 'react-native';
import Animated, {
   FadeIn,
   FadeInUp,
   interpolate,
   useAnimatedStyle,
   useSharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingSlide, onboardingSlides } from './OnboardingData';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

interface SlideItemProps {
  item: OnboardingSlide;
  index: number;
  scrollX: { value: number };
}

const SlideItem: React.FC<SlideItemProps> = ({ item, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8]
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5]
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.slideContainer}>
      {/* Title */}
      <Animated.Text 
        entering={FadeInUp.delay(200).duration(500)}
        style={styles.slideTitle}
      >
        {item.title}
      </Animated.Text>

      {/* Image Placeholder - Kotak hitam sebagai contoh */}
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <View style={styles.imagePlaceholder}>
          {/* Placeholder content - akan diganti dengan gambar nanti */}
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
              {['Home', 'Food', 'Health', 'Restaurants', 'Sport'].map((cat, idx) => (
                <View key={cat} style={styles.mockCategoryItem}>
                  <View style={[styles.mockCategoryIcon, { backgroundColor: idx % 2 === 0 ? '#34C759' : '#FF6B6B' }]} />
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

interface PaginationProps {
  data: OnboardingSlide[];
  currentIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({ data, currentIndex }) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
};

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
            <SlideItem item={item} index={index} scrollX={scrollX} />
          )}
        />

        {/* Pagination */}
        <Animated.View 
          entering={FadeIn.delay(600).duration(400)}
          style={styles.bottomContainer}
        >
          <Pagination data={onboardingSlides} currentIndex={currentIndex} />

          {/* Get Started Button */}
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
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>I am already registered</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
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
  },
  
  // Top Left (Small Blue)
  meshGradient3: {
    width: width * 0.45,
    height: width * 0.45,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    position: 'absolute',
    top: height * 0.15,
    left: -width * 0.2,
  },
  glowOrb3: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    position: 'absolute',
    top: (height * 0.15) + (width * 0.225) - 40,
    left: (-width * 0.2) + (width * 0.225) - 40,
    shadowColor: '#3B82F6',
    shadowRadius: 30,
    elevation: 10,
  },

  // Top Right (Large Teal)
  meshGradient1: {
    width: width * 0.65,
    height: width * 0.65,
    backgroundColor: 'rgba(42, 157, 143, 0.12)',
    position: 'absolute',
    top: -width * 0.1,
    right: -width * 0.15,
  },
  glowOrb1: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(42, 157, 143, 0.3)',
    position: 'absolute',
    top: (width * 0.325) - 60 - (width * 0.1),
    right: (width * 0.325) - 60 - (width * 0.15),
    shadowColor: '#2A9D8F',
    shadowRadius: 60,
    elevation: 20,
  },

  // Bottom Left (Large Emerald)
  meshGradient2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    position: 'absolute',
    bottom: -width * 0.15,
    left: -width * 0.2,
  },
  glowOrb2: {
    width: 130,
    height: 130,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    position: 'absolute',
    bottom: (width * 0.35) - 65 - (width * 0.15),
    left: (width * 0.35) - 65 - (width * 0.2),
    shadowColor: '#10B981',
    shadowRadius: 50,
    elevation: 15,
  },

  // Bottom Right (Medium Cyan)
  meshGradient4: {
    width: width * 0.55,
    height: width * 0.55,
    backgroundColor: 'rgba(45, 212, 191, 0.08)',
    position: 'absolute',
    bottom: height * 0.12,
    right: -width * 0.15,
  },
  glowOrb4: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(45, 212, 191, 0.2)',
    position: 'absolute',
    bottom: (height * 0.12) + (width * 0.275) - 45,
    right: (-width * 0.15) + (width * 0.275) - 45,
    shadowColor: '#2DD4BF',
    shadowRadius: 40,
    elevation: 12,
  },

  // Other styles remain unchanged
  slideContainer: {
    width,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: width * 0.75,
    height: height * 0.45,
    backgroundColor: '#2A3444', 
    borderRadius: 24,
    position: 'relative',
    overflow: 'visible',
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  mockPhoneScreen: {
    flex: 1,
    backgroundColor: '#F8F0FF',
    borderRadius: 20,
    overflow: 'hidden',
    margin: 8,
  },
  mockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  mockTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mockTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  mockSignal: {
    width: 20,
    height: 10,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  mockContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  mockTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mockBackButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  mockScreenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  mockCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E0F0',
  },
  mockCategoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  mockCategoryText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  mockEditButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E8E0F0',
    borderRadius: 12,
  },
  mockEditText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  floatingIcon: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingIcon1: {
    top: -15,
    left: -20,
  },
  floatingIcon2: {
    top: '40%',
    right: -25,
  },
  floatingIcon3: {
    bottom: 30,
    left: -15,
  },
  floatingIconInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: Layout.colors.primary,
  },
  dotInactive: {
    width: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: Layout.colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});