import { IconSymbol, IconSymbolName } from '@/src/components/ui/icon-symbol';
import { useResponsive } from '@/src/hooks/useResponsive';
import { formatCurrency } from '@/src/utils/currency';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';



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
        case 'snacks': return 'fork.knife'; 
        case 'household': return 'bolt.fill'; 
        default: return 'tag.fill';
    }
};

const getCategoryColor = (category: string = 'other'): string => {
    switch (category.toLowerCase()) {
        case 'food': return '#FF9F43'; 
        case 'drink': return '#54A0FF'; 
        case 'fruit': return '#2ED573'; 
        case 'household': return '#A3CB38'; 
        default: return '#81BFBC'; 
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
  const { moderateScale, contentContainerStyle } = useResponsive();

  // Dynamic Styles
  const iconSize = moderateScale(22);
  const titleSize = moderateScale(16);
  const priceSize = moderateScale(15);
  const smallText = moderateScale(12);
  
  // Touch target sizing
  const buttonSize = moderateScale(32); // Visual size
  const cardMinHeight = moderateScale(80);

  return (
    <Animated.View 
      entering={FadeInDown.delay(Math.min(index * 50, 500)).duration(500)}
      style={[
        styles.container, 
        contentContainerStyle as any
      ]}
    >
      <Pressable
          style={({ pressed }) => [
            styles.card, 
            { minHeight: cardMinHeight },
             // Subtle scale/opacity effect on press for iOS/Android
            pressed && !readOnly && { opacity: 0.95, transform: [{ scale: 0.995 }] }
          ]}
          onPress={readOnly ? undefined : onEdit}
          android_ripple={{ color: 'rgba(0,0,0,0.08)', foreground: true }}
      >
        <View style={[styles.leftAccent, { backgroundColor: accentColor }]} />
        
        <View style={styles.touchableCard}>
          <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20`, width: moderateScale(40), height: moderateScale(40) }]}>
             <IconSymbol name={iconName} size={iconSize} color={accentColor} />
          </View>

          <View style={styles.info}>
            <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.25 }]} numberOfLines={2}>{productName}</Text>
            
            <View style={styles.detailsRow}>
              <Text style={[styles.unitPrice, { fontSize: smallText }]}>
                  {formatCurrency(price / (qty || 1))}
                  <Text style={[styles.unitLabel, { fontSize: moderateScale(11) }]}> / unit</Text>
              </Text>

              {readOnly ? (
                  <View style={styles.readOnlyQtyBadge}>
                    <Text style={[styles.readOnlyQtyText, { fontSize: smallText }]}>Qty: {qty}</Text>
                  </View>
              ) : (
                <View style={styles.quantityControl}>
                    <View style={[styles.qtyButtonContainer, { width: buttonSize, height: buttonSize }]}>
                        <Pressable 
                            onPress={onDecrement} 
                            style={({ pressed }) => [
                                styles.qtyButtonContent,
                                pressed && { backgroundColor: '#F3F4F6', opacity: 0.8 }
                            ]}
                            hitSlop={12}
                        >
                            <IconSymbol name="minus" size={moderateScale(14)} color="#1F2937" />
                        </Pressable>
                    </View>
                    
                    <View style={[styles.qtyBadge, { minWidth: moderateScale(24) }]}>
                        <Text style={[styles.qtyText, { fontSize: moderateScale(13) }]}>{qty}</Text>
                    </View>

                    <View style={[styles.qtyButtonContainer, { width: buttonSize, height: buttonSize }]}>
                        <Pressable 
                            onPress={onIncrement} 
                            style={({ pressed }) => [
                                styles.qtyButtonContent,
                                pressed && { backgroundColor: '#F3F4F6', opacity: 0.8 }
                            ]}
                            hitSlop={12}
                        >
                            <IconSymbol name="plus" size={moderateScale(14)} color="#1F2937" />
                        </Pressable>
                    </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.priceContainer}>
                <Text style={[styles.priceLabel, { fontSize: moderateScale(10) }]}>TOTAL</Text>
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
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
             >
                 <IconSymbol name="trash.fill" size={moderateScale(18)} color="#FF6B6B" />
             </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    // Move shadow properties here to animate with the container
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    flex: 1,
    borderRadius: 16, // Keep borderRadius for clipping
    flexDirection: 'row',
    alignItems: 'stretch',
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
  qtyButtonContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      elevation: 0,
  },
  qtyButtonContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6, // Match container
      overflow: 'hidden', // Clip interactions/ripples to the button shape
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
    minWidth: 60, 
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
    color: '#059669', 
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
