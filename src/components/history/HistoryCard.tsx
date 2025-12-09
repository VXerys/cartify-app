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
            {/* Left Accent Strip */}
            <View style={styles.leftAccent} />

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <View style={styles.dateContainer}>
                        <View style={styles.calendarIcon}>
                            <IconSymbol name="calendar" size={14} color={Layout.colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.dateText}>{dateStr}</Text>
                            <Text style={styles.timeText}>{timeStr}</Text>
                        </View>
                    </View>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>Completed</Text>
                    </View>
                </View>

                <Text style={styles.itemsLabel} numberOfLines={2} ellipsizeMode="tail">
                    {item.items.map(i => i.name).join(', ')}
                </Text>

                <View style={styles.footerRow}>
                    <Text style={styles.itemsCount}>{item.totalItems} Items</Text>
                    <Text style={styles.price}>{formatCurrency(item.totalPrice)}</Text>
                </View>
            </View>
          </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    // Strong "Floating" Shadow Effect
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3, // Increased to make it clearly visible
    shadowRadius: 20,
    elevation: 12, // High elevation for prominent android shadow
  },
  swipeableContainer: {
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: '#FFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
  },
  leftAccent: {
      width: 6,
      backgroundColor: Layout.colors.primary,
      borderRadius: 4,
      marginRight: 16,
      height: '100%',
  },
  contentContainer: {
      flex: 1,
      gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  calendarIcon: {
      backgroundColor: '#E6FFFA', // Light Teal to match Primary
      padding: 6,
      borderRadius: 8,
  },
  dateText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1E293B',
      letterSpacing: -0.5,
  },
  timeText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#94A3B8',
  },
  statusContainer: {
      backgroundColor: '#DCFCE7',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
  },
  statusText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#16A34A',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
  },
  itemsLabel: {
      fontSize: 14,
      color: '#64748B',
      lineHeight: 20,
  },
  footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#F1F5F9',
  },
  itemsCount: {
      fontSize: 13,
      fontWeight: '600',
      color: '#94A3B8',
      backgroundColor: '#F8FAFC',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      overflow: 'hidden',
  },
  price: {
      fontSize: 20,
      fontWeight: '800',
      color: Layout.colors.primary,
      letterSpacing: -0.5,
  },
  deleteButtonContainer: {
      backgroundColor: '#EF4444',
      justifyContent: 'center',
      alignItems: 'center',
      width: 90,
      height: '100%',
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
