import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { useResponsive } from '@/src/hooks/useResponsive';
import { formatCurrency } from '@/src/utils/currency';
import { formatDate, formatTime } from '@/src/utils/date';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const { moderateScale, contentContainerStyle } = useResponsive();
  const dateObj = new Date(item.date);
  const dateStr = formatDate(dateObj, i18n.language);
  const timeStr = formatTime(dateObj, i18n.language);

  const deleteBtnWidth = moderateScale(90);

  const renderRightActions = (progress: RNAnimated.AnimatedInterpolation<number>, dragX: RNAnimated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <TouchableOpacity 
            style={[styles.deleteButtonContainer, { width: deleteBtnWidth }]} 
            onPress={() => onDelete && onDelete(item.id)}
        >
            <RNAnimated.View style={[styles.deleteButtonContent, { transform: [{ scale }] }]}>
                <IconSymbol name="trash.fill" size={moderateScale(24)} color="#FFF" />
                <Text style={[styles.deleteText, { fontSize: moderateScale(12) }]}>{t('history.deleteConfirm')}</Text>
            </RNAnimated.View>
        </TouchableOpacity>
    );
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()} 
      style={[styles.container, contentContainerStyle as any]}
    >
      <Swipeable renderRightActions={renderRightActions} containerStyle={[styles.swipeableContainer, { borderRadius: moderateScale(20) }]}>
          <TouchableOpacity 
            style={[styles.card, { padding: moderateScale(16) }]} 
            activeOpacity={0.7}
            onPress={onPress}
          >
            {/* Left Accent Strip */}
            <View style={styles.leftAccent} />

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <View style={styles.dateContainer}>
                        <View style={[styles.calendarIcon, { padding: moderateScale(6), borderRadius: moderateScale(8) }]}>
                            <IconSymbol name="calendar" size={moderateScale(14)} color={Layout.colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.dateText, { fontSize: moderateScale(16) }]}>{dateStr}</Text>
                            <Text style={[styles.timeText, { fontSize: moderateScale(12) }]}>{timeStr}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusContainer, { paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(4) }]}>
                        <Text style={[styles.statusText, { fontSize: moderateScale(10) }]}>{t('history.completed')}</Text>
                    </View>
                </View>

                <Text style={[styles.itemsLabel, { fontSize: moderateScale(14) }]} numberOfLines={2} ellipsizeMode="tail">
                    {item.items.map(i => i.name).join(', ')}
                </Text>

                <View style={styles.footerRow}>
                    <Text style={[styles.itemsCount, { fontSize: moderateScale(13) }]}>{item.totalItems} {t('history.items')}</Text>
                    <Text style={[styles.price, { fontSize: moderateScale(20) }]}>{formatCurrency(item.totalPrice)}</Text>
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
    // Removed marginHorizontal to prevent widening
    backgroundColor: 'transparent',
    // Strong "Floating" Shadow Effect
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3, 
    shadowRadius: 20,
    elevation: 12, 
    width: '100%',
  },
  swipeableContainer: {
      overflow: 'hidden',
      backgroundColor: '#FFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
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
  },
  dateText: {
      fontWeight: '700',
      color: '#1E293B',
      letterSpacing: -0.5,
  },
  timeText: {
      fontWeight: '500',
      color: '#94A3B8',
  },
  statusContainer: {
      backgroundColor: '#DCFCE7',
      borderRadius: 8,
  },
  statusText: {
      fontWeight: '700',
      color: '#16A34A',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
  },
  itemsLabel: {
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
      fontWeight: '600',
      color: '#94A3B8',
      backgroundColor: '#F8FAFC',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      overflow: 'hidden',
  },
  price: {
      fontWeight: '800',
      color: Layout.colors.primary,
      letterSpacing: -0.5,
  },
  deleteButtonContainer: {
      backgroundColor: '#EF4444',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
  },
  deleteButtonContent: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
  },
  deleteText: {
      color: '#FFF',
      fontWeight: '700',
  }
});
