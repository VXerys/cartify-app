import { useResponsive } from '@/src/hooks/useResponsive';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconSymbol } from '../ui/icon-symbol';

interface StatsRowProps {
  orders: number;
  items: number;
}

export function StatsRow({ orders, items }: StatsRowProps) {
  const { t } = useTranslation();
  const { clampedNormalize } = useResponsive();

  return (
    <Animated.View 
      entering={FadeInDown.delay(700).springify()}
      style={styles.root}
    >
      <View style={styles.container}>
        {/* Orders Section */}
        <View style={styles.statSection}>
            <View style={[styles.iconContainer, { width: clampedNormalize(38), height: clampedNormalize(38) }]}>
               <IconSymbol name="cart.fill" size={clampedNormalize(18)} color="#2A9D8F" />
            </View>
            <View style={styles.info}>
                <Text style={[styles.value, { fontSize: clampedNormalize(20) }]}>{orders}</Text>
                <Text style={[styles.label, { fontSize: clampedNormalize(12) }]}>{t('home.statsOrders')}</Text>
            </View>
        </View>

        <View style={styles.divider} />

        {/* Items Section */}
        <View style={styles.statSection}>
            <View style={[styles.iconContainer, { width: clampedNormalize(38), height: clampedNormalize(38) }]}>
               <IconSymbol name="bag.fill" size={clampedNormalize(18)} color="#2A9D8F" />
            </View>
             <View style={styles.info}>
                <Text style={[styles.value, { fontSize: clampedNormalize(20) }]}>{items}</Text>
                <Text style={[styles.label, { fontSize: clampedNormalize(12) }]}>{t('home.statsItems')}</Text>
            </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 8,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconContainer: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  info: {
      justifyContent: 'center',
      alignItems: 'flex-start',
  },
  value: {
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: -2,
    includeFontPadding: false,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  }
});
