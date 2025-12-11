import { Layout } from '@/src/constants/Layout';
import { useResponsive } from '@/src/hooks/useResponsive';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';

export function HistoryHeader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { moderateScale, verticalScale, containerPadding, isTablet, contentContainerStyle } = useResponsive();

  // Dynamic values
  const circle1Size = moderateScale(120);
  const circle2Size = moderateScale(200);

  return (
    <View style={[styles.container, { paddingTop: insets.top + verticalScale(8) }]}>
      <View style={[styles.decorativeCircle1, { width: circle1Size, height: circle1Size, borderRadius: circle1Size / 2 }]} />
      <View style={[styles.decorativeCircle2, { width: circle2Size, height: circle2Size, borderRadius: circle2Size / 2 }]} />

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
  },
  decorativeCircle1: {
      position: 'absolute',
      bottom: -30,
      left: -30,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircle2: {
      position: 'absolute',
      top: -60,
      right: -20, 
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
