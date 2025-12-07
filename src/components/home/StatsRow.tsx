import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconSymbol } from '../ui/icon-symbol';

interface StatsRowProps {
  orders: number;
  items: number;
}

export function StatsRow({ orders, items }: StatsRowProps) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(700).springify()}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
            <IconSymbol name="cart.fill" size={18} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{orders}</Text>
            <Text style={styles.label}>Orders</Text>
        </View>
      </View>
      
      <View style={styles.card}>
        <View style={styles.iconContainer}>
            <IconSymbol name="cube.box.fill" size={18} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
             <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{items}</Text>
             <Text style={styles.label}>Items</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)', 
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 0,
  },
  value: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 0,
    includeFontPadding: false,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    includeFontPadding: false,
  },
});
