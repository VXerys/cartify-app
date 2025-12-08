import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { formatCurrency } from '@/src/utils/currency';
import React from 'react';
import { Animated as RNAnimated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';

export interface HistoryItemType {
  id: string;
  date: string;
  totalPrice: number;
  totalItems: number;
  items: Array<{ 
    name: string; 
    qty: number; 
    price: number; 
    category?: string; 
  }>;
}

interface HistoryCardProps {
  item: HistoryItemType;
  index: number;
  onPress?: () => void;
  onDelete?: (id: string) => void;
}

export function HistoryCard({ item, index, onPress, onDelete }: HistoryCardProps) {
  const dateObj = new Date(item.date);
  const dateStr = dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });
  const timeStr = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const renderRightActions = (progress: RNAnimated.AnimatedInterpolation<number>, dragX: RNAnimated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <TouchableOpacity 
            style={styles.deleteButtonContainer} 
            onPress={() => onDelete && onDelete(item.id)}
        >
            <RNAnimated.View style={[styles.deleteButtonContent, { transform: [{ scale }] }]}>
                <IconSymbol name="trash.fill" size={24} color="#FFF" />
                <Text style={styles.deleteText}>Delete</Text>
            </RNAnimated.View>
        </TouchableOpacity>
    );
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()} 
      style={styles.container}
    >
      <Swipeable renderRightActions={renderRightActions} containerStyle={styles.swipeableContainer}>
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={onPress}
          >
            <View style={styles.headerRow}>
                <View style={styles.iconWrapper}>
                    <IconSymbol name="bag.fill" size={18} color={Layout.colors.primary} />
                </View>
                <View style={styles.dateInfo}>
                    <Text style={styles.dateText}>{dateStr}</Text>
                    <Text style={styles.timeText}>{timeStr}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Completed</Text>
                </View>
            </View>

            <View style={styles.contentRow}>
                <Text style={styles.itemsLabel} numberOfLines={2}>
                    {item.items.map(i => i.name).join(', ')}
                </Text>
            </View>

            <View style={styles.footerRow}>
                <Text style={styles.itemsCount}>{item.totalItems} Items</Text>
                <Text style={styles.price}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  swipeableContainer: {
      borderRadius: 24,
      overflow: 'hidden',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: '#F0FDF4', // Light primary
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  dateInfo: {
      flex: 1,
  },
  dateText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 2,
  },
  timeText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#94A3B8',
  },
  statusContainer: {
      backgroundColor: '#DCFCE7',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
  },
  statusText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#16A34A',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
  },
  contentRow: {
      marginBottom: 16,
  },
  itemsLabel: {
      fontSize: 15,
      color: '#475569',
      fontWeight: '500',
      lineHeight: 22,
  },
  footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#F1F5F9',
  },
  itemsCount: {
      fontSize: 13,
      fontWeight: '600',
      color: '#64748B',
  },
  price: {
      fontSize: 18,
      fontWeight: '800',
      color: Layout.colors.primary,
      letterSpacing: -0.5,
  },
  deleteButtonContainer: {
      backgroundColor: '#EF4444',
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: '100%',
      marginLeft: -24, // Pull slightly to overlap the border radius visually if desirable, or keep 0.
      // However, since we are inside `overflow: hidden` Swipeable container which is also rounded, we need to match height.
      // Swipeable handles height automatically usually.
  },
  deleteButtonContent: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
  },
  deleteText: {
      color: '#FFF',
      fontSize: 12,
      fontWeight: '700',
  }
});
