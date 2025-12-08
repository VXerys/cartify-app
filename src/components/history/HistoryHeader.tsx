import { Layout } from '@/src/constants/Layout';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HistoryHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Animated.Text 
            entering={FadeInDown.delay(100).springify()} 
            style={styles.greeting}
          >
            Overview
          </Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(200).springify()} 
            style={styles.title}
          >
            Transaction History
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.l,
    paddingBottom: Layout.spacing.l,
    backgroundColor: Layout.colors.primary, 
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    zIndex: 10,
    overflow: 'hidden',
    ...Layout.shadows.medium,
  },
  decorativeCircle1: {
      position: 'absolute',
      bottom: -30,
      left: -30,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircle2: {
      position: 'absolute',
      top: -60,
      right: -20, 
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)', 
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
});
