import { IconSymbol, IconSymbolName } from '@/src/components/ui/icon-symbol';
import { formatCurrency } from '@/src/utils/currency';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, Layout } from 'react-native-reanimated';

interface VoiceShoppingCardProps {
  productName: string;
  price: number;
  qty: number;
  category?: string;
  onDelete?: () => void;
  index?: number;
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

export function VoiceShoppingCard({ productName, price, qty, category, onDelete, index = 0 }: VoiceShoppingCardProps) {
  const iconName = getCategoryIcon(category);
  const accentColor = getCategoryColor(category);

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()} 
      exiting={FadeOutLeft}
      layout={Layout.springify()}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={[styles.leftAccent, { backgroundColor: accentColor }]} />
        
        <View style={styles.contentContainer}>
          <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20` }]}>
             <IconSymbol name={iconName} size={22} color={accentColor} />
          </View>

          <View style={styles.info}>
            <Text style={styles.title}>{productName}</Text>
            <View style={styles.metaRow}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{qty}x</Text>
                </View>
                <Text style={styles.unitPrice}>
                    @ {formatCurrency(price / qty)}
                </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>TOTAL</Text>
                <Text style={styles.price} adjustsFontSizeToFit minimumFontScale={0.8} numberOfLines={1}>
                    {formatCurrency(price)}
                </Text>
            </View>
          </View>

          {onDelete && (
             <TouchableOpacity 
                onPress={onDelete} 
                style={styles.deleteButton} 
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
             >
                 <IconSymbol name="trash.fill" size={18} color="#FF6B6B" />
             </TouchableOpacity>
          )}
        </View>
      </View>
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
    minHeight: 80,
  },
  leftAccent: {
    width: 5,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1, 
    justifyContent: 'center',
    marginRight: 8, // Enforce spacing from right section
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  unitPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    flexShrink: 1, 
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: 80, // Reserve space for price
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginBottom: 2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  deleteButton: {
      padding: 8,
      backgroundColor: '#FEF2F2',
      borderRadius: 10,
      marginLeft: 4,
  }
});
