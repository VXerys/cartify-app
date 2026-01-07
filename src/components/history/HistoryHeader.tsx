import { Layout } from '@/src/constants/Layout';
import { useResponsive } from '@/src/hooks/useResponsive';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export function HistoryHeader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { moderateScale, verticalScale, containerPadding, isTablet, contentContainerStyle } = useResponsive();

  // Dynamic values
  const circle1Size = moderateScale(120);
  const circle2Size = moderateScale(200);

  return (
    <View style={[styles.container, { paddingTop: insets.top + verticalScale(8) }]}>
      {/* Premium Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.gradientOverlay} />
        
        {/* Mesh gradients - center left focused */}
        <View style={[styles.meshGradient, styles.meshGradient1]} />
        <View style={[styles.meshGradient, styles.meshGradient2]} />
        
        {/* Grid pattern */}
        <View style={styles.gridPattern}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.gridLineHorizontal, { top: `${(i + 1) * 25}%` }]} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.gridLineVertical, { left: `${(i + 1) * 20}%` }]} />
          ))}
        </View>
        
        {/* Glowing orbs - center positioning */}
        <View style={[styles.glowOrb, styles.glowOrb1]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />
      </View>

      <View style={[styles.contentContainer, contentContainerStyle as any, { paddingHorizontal: containerPadding }]}>
        <View style={styles.textContainer}>
          <Animated.Text 
            entering={FadeInDown.delay(100).springify()} 
            style={[styles.greeting, { fontSize: moderateScale(13) }]}
          >
            {t('history.headerOverview')}
          </Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(200).springify()} 
            style={[styles.title, { fontSize: moderateScale(22) }]}
          >
            {t('history.headerTitle')}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Layout.spacing.l,
    backgroundColor: Layout.colors.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    zIndex: 10,
    overflow: 'hidden',
    width: '100%',
    ...Layout.shadows.medium,
    position: 'relative',
  },
  // Premium Background Styles
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Layout.colors.primary,
  },
  meshGradient: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.65,
  },
  meshGradient1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -60,
    left: -50,
  },
  meshGradient2: {
    width: width * 0.65,
    height: width * 0.65,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    bottom: -40,
    right: -45,
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowOrb1: {
    width: 110,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: '50%',
    left: -30,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 35,
    elevation: 12,
  },
  glowOrb2: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    bottom: 10,
    right: -20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)', 
    marginBottom: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: -0.5,
  },
});
