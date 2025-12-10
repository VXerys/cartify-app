import { IconSymbol, IconSymbolName } from '@/src/components/ui/icon-symbol';
import { useResponsive } from '@/src/hooks/useResponsive';
import { formatCurrency } from '@/src/utils/currency';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, Layout } from 'react-native-reanimated';

interface VoiceShoppingCardProps {
  productName: string;
  price: number;
  qty: number;
  category?: string;
  onDelete?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onEdit?: () => void;
  index?: number;
  readOnly?: boolean;
}

const getCategoryIcon = (category: string = 'other'): IconSymbolName => {
    switch (category.toLowerCase()) {
        case 'food': return 'fork.knife';
        case 'drink': return 'cup.and.saucer.fill';
        case 'fruit': return 'leaf.fill';
        case 'snacks': return 'fork.knife'; // Fallback to food for now
        case 'household': return 'bolt.fill'; // Or another suitable one
        default: return 'tag.fill';
    }
};

const getCategoryColor = (category: string = 'other'): string => {
    switch (category.toLowerCase()) {
        case 'food': return '#FF9F43'; // Orange
        case 'drink': return '#54A0FF'; // Blue
        case 'fruit': return '#2ED573'; // Green
        case 'household': return '#A3CB38'; // Olive
        default: return '#81BFBC'; // Default Teal
    }
};

export function VoiceShoppingCard({ 
  productName, 
  price, 
  qty, 
  category, 
  onDelete, 
  onIncrement, 
  onDecrement, 
  onEdit,
  index = 0,
  readOnly = false
}: VoiceShoppingCardProps) {
  const iconName = getCategoryIcon(category);
  const accentColor = getCategoryColor(category);
  const { clampedNormalize, isTablet } = useResponsive();

  // Dynamic Styles
  const iconSize = clampedNormalize(22);
  const titleSize = clampedNormalize(16);
  const priceSize = clampedNormalize(15);
  const smallText = clampedNormalize(12);

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()} 
      exiting={FadeOutLeft}
      layout={Layout.springify()}
      style={styles.container}
    >
      <TouchableOpacity 
          style={[styles.card, { minHeight: clampedNormalize(80) }]} 
          activeOpacity={readOnly ? 1 : 0.9} 
          onPress={readOnly ? undefined : onEdit}
      >
        <View style={[styles.leftAccent, { backgroundColor: accentColor }]} />
        
        <View style={styles.touchableCard}>
          <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20`, width: clampedNormalize(40), height: clampedNormalize(40) }]}>
             <IconSymbol name={iconName} size={iconSize} color={accentColor} />
          </View>

          <View style={styles.info}>
            <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.25 }]} numberOfLines={2}>{productName}</Text>
            
            <View style={styles.detailsRow}>
              <Text style={[styles.unitPrice, { fontSize: smallText }]}>
                  {formatCurrency(price / (qty || 1))}
                  <Text style={[styles.unitLabel, { fontSize: clampedNormalize(11) }]}> / unit</Text>
              </Text>

              {readOnly ? (
                  <View style={styles.readOnlyQtyBadge}>
                    <Text style={[styles.readOnlyQtyText, { fontSize: smallText }]}>Qty: {qty}</Text>
                  </View>
              ) : (
                <View style={styles.quantityControl}>
                    <TouchableOpacity 
                        onPress={onDecrement} 
                        style={[styles.qtyButton, { width: clampedNormalize(24), height: clampedNormalize(24) }]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <IconSymbol name="minus" size={clampedNormalize(14)} color="#1F2937" />
                    </TouchableOpacity>
                    
                    <View style={[styles.qtyBadge, { minWidth: clampedNormalize(24) }]}>
                        <Text style={[styles.qtyText, { fontSize: clampedNormalize(13) }]}>{qty}</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={onIncrement} 
                        style={[styles.qtyButton, { width: clampedNormalize(24), height: clampedNormalize(24) }]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <IconSymbol name="plus" size={clampedNormalize(14)} color="#1F2937" />
                    </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.priceContainer}>
                <Text style={[styles.priceLabel, { fontSize: clampedNormalize(10) }]}>TOTAL</Text>
                <Text style={[styles.price, { fontSize: priceSize }]} adjustsFontSizeToFit minimumFontScale={0.8} numberOfLines={1}>
                    {formatCurrency(price)}
                </Text>
            </View>
          </View>

          {!readOnly && onDelete && (
             <TouchableOpacity 
                onPress={onDelete} 
                style={styles.deleteButton} 
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
             >
                 <IconSymbol name="trash.fill" size={clampedNormalize(18)} color="#FF6B6B" />
             </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  touchableCard: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  leftAccent: {
    width: 5,
    height: '100%',
  },

  iconContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    flex: 1, 
    justifyContent: 'center',
    marginRight: 4, 
  },
  title: {
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  detailsRow: {
    flexDirection: 'column', 
    alignItems: 'flex-start',
    gap: 8,
  },
  unitPrice: {
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  unitLabel: {
      fontWeight: '400',
      color: '#9CA3AF',
  },
  quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: 2,
  },
  qtyButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      elevation: 1,
  },
  qtyBadge: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
  },
  qtyText: {
      fontWeight: '700',
      color: '#111827',
  },
  rightSection: {
    justifyContent: 'space-between', 
    alignItems: 'flex-end',
    paddingVertical: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
    minWidth: 60, // Ensure price doesn't collapse
  },
  priceLabel: {
    color: '#9CA3AF',
    marginBottom: 2,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  price: {
    fontWeight: '800',
    color: '#059669', // Uses a nice green for price
    letterSpacing: -0.5,
  },
  deleteButton: {
      padding: 8,
      backgroundColor: '#FEF2F2',
      borderRadius: 10,
      marginTop: 4, 
  },
  readOnlyQtyBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  readOnlyQtyText: {
    fontWeight: '600',
    color: '#4B5563',
  }
});
