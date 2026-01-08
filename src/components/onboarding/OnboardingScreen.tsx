import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingSlide, onboardingSlides } from './OnboardingData';

const { width, height } = Dimensions.get('window');

// Onboarding images
const onboardingImages: { [key: string]: any } = {
  '1': require('@/assets/images/onboarding/onboarding-1.png'),
  '2': require('@/assets/images/onboarding/onboarding-2.png'),
  '3': require('@/assets/images/onboarding/onboarding-3.png'),
};

interface OnboardingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

// Slide Item Component
const SlideItem = ({ item }: { item: OnboardingSlide }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.slideContainer}>
      <Animated.View 
        entering={FadeIn.delay(200).duration(600)}
        style={styles.imageWrapper}
      >
        <Image
          source={onboardingImages[item.id]}
          style={styles.slideImage}
          resizeMode="contain"
        />
      </Animated.View>
      
      <View style={styles.textContainer}>
        <Animated.Text 
          entering={FadeInUp.delay(400).springify()}
          style={styles.slideTitle}
        >
          {t(item.titleKey, { defaultValue: item.title })}
        </Animated.Text>
        <Animated.Text 
          entering={FadeInUp.delay(500).springify()}
          style={styles.slideDescription}
        >
          {t(item.descriptionKey, { defaultValue: item.description })}
        </Animated.Text>
      </View>
    </View>
  );
};

// Pagination Component
const Pagination = ({ 
  data, 
  currentIndex 
}: { 
  data: OnboardingSlide[]; 
  currentIndex: number;
}) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <View
            key={index}
            style={[
              styles.paginationDot,
              isActive && styles.paginationDotActive,
            ]}
          />
        );
      })}
    </View>
  );
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted,
  onLogin,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
  
  // Button animation
  const buttonScale = useSharedValue(1);
  
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));
  
  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
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
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onGetStarted();
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.gradientOverlay} />
        
        {/* Mesh gradients */}
        <View style={[styles.meshGradient, styles.meshGradient1]} />
        <View style={[styles.meshGradient, styles.meshGradient2]} />
        
        {/* Glowing orbs */}
        <View style={[styles.glowOrb, styles.glowOrb1]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* Skip button */}
        {currentIndex < onboardingSlides.length - 1 && (
          <Animated.View 
            entering={FadeIn.delay(300)}
            style={styles.skipContainer}
          >
            <TouchableOpacity 
              onPress={onGetStarted}
              style={styles.skipButton}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>{t('onboarding.skip', { defaultValue: 'Skip' })}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={onboardingSlides}
          renderItem={({ item }) => <SlideItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          style={styles.flatList}
        />

        {/* Bottom Section */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={[styles.bottomSection, { paddingBottom: insets.bottom + 24 }]}
        >
          <Pagination data={onboardingSlides} currentIndex={currentIndex} />

          {/* CTA Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleNext}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.ctaButtonText}>
                {currentIndex === onboardingSlides.length - 1 
                  ? t('onboarding.getStarted', { defaultValue: 'GET STARTED' })
                  : t('onboarding.next', { defaultValue: 'NEXT' })}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Login Link */}
          <TouchableOpacity 
            onPress={onLogin}
            style={styles.loginLink}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>
              {t('onboarding.alreadyHaveAccount', { defaultValue: 'Already have an account?' })}{' '}
              <Text style={styles.loginTextBold}>
                {t('onboarding.login', { defaultValue: 'Log in' })}
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  // Premium Background
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
    opacity: 0.5,
  },
  meshGradient1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: 'rgba(42, 157, 143, 0.12)',
    top: -width * 0.2,
    left: -width * 0.2,
  },
  meshGradient2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    bottom: -width * 0.1,
    right: -width * 0.2,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
  },
  glowOrb1: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(42, 157, 143, 0.25)',
    top: height * 0.1,
    left: width * 0.1,
    shadowColor: '#2A9D8F',
    shadowRadius: 50,
    elevation: 15,
  },
  glowOrb2: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    bottom: height * 0.25,
    right: width * 0.1,
    shadowColor: '#3B82F6',
    shadowRadius: 40,
    elevation: 12,
  },
  content: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  flatList: {
    flex: 1,
  },
  slideContainer: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  imageWrapper: {
    width: width * 0.75,
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  slideDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#2A9D8F',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#2A9D8F',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2A9D8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  loginLink: {
    paddingVertical: 8,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  loginTextBold: {
    color: '#2A9D8F',
    fontWeight: '700',
  },
});
