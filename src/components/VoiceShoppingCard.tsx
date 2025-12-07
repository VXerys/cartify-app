import { StyleSheet, Text, View } from 'react-native';

interface VoiceShoppingCardProps {
  productName: string;
  price: number;
  qty: number;
}

export function VoiceShoppingCard({ productName, price, qty }: VoiceShoppingCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{productName}</Text>
        <Text style={styles.details}>{qty}x Items</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#888',
  },
  priceContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669', // Emerald/Green
  },
});
