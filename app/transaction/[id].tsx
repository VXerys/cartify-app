import { IconSymbol, IconSymbolName } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { getTransactionDetails, Transaction } from '@/src/services/db';
import { formatCurrency } from '@/src/utils/currency';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TransactionDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
        if (id) {
            try {
                const data = await getTransactionDetails(db, Number(id));
                setTransaction(data);
            } catch (error) {
                console.error("Failed to fetch transaction details", error);
            } finally {
                setLoading(false);
            }
        }
    };
    fetchDetails();
  }, [id, db]);

  if (loading) {
      return (
          <View style={[styles.container, styles.center]}>
              <ActivityIndicator size="large" color={Layout.colors.primary} />
          </View>
      );
  }

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <Pressable 
                onPress={() => router.back()} 
                style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed
                ]}
            >
                <IconSymbol name="chevron.left" size={24} color="#FFF" /> 
            </Pressable>
        </View>
        <View style={styles.center}>
            <Text style={styles.errorText}>{t('transaction.notFound')}</Text>
        </View>
      </View>
    );
  }

  const dateObj = new Date(transaction.date);
  const locale = i18n.language === 'id' ? 'id-ID' : 'en-US';
  
  const dateStr = dateObj.toLocaleDateString(locale, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });
  const timeStr = dateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });

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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={Layout.colors.primary} />
      
      {/* Header Background */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
             <Pressable 
                onPress={() => router.back()} 
                style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed
                ]}
            >
                <IconSymbol name="chevron.left" size={24} color="#FFF" /> 
             </Pressable>
             
             {/* Simple fade in for title, no movement to reduce dizziness */}
             <Animated.Text 
                entering={FadeIn.duration(800)} 
                style={styles.headerTitle}
             >
                {t('transaction.details')}
             </Animated.Text>
             
             <View style={{ width: 44 }} /> 
        </View>
      </View>

      {/* Floating Card - Gentle Slide Up */}
      <Animated.View 
        entering={FadeInUp.duration(800).springify().damping(20).mass(1).stiffness(90)} 
        style={styles.summaryCard}
      >
          <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>{t('transaction.totalBill')}</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(transaction.total_amount)}
              </Text>
          </View>
          <View style={styles.dateContainer}>
             <View style={styles.dateRow}>
                <IconSymbol name="calendar" size={14} color="#94A3B8" />
                <Text style={styles.dateText}>{dateStr}</Text>
             </View>
             <View style={styles.dateRow}>
                <IconSymbol name="clock" size={14} color="#94A3B8" />
                <Text style={styles.dateText}>{timeStr}</Text>
             </View>
          </View>
          <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{t('transaction.paymentCompleted')}</Text>
          </View>
      </Animated.View>

      <FlatList
        data={transaction.items}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
            <Text style={styles.sectionTitle}>
                {t('transaction.itemsPurchased')}
            </Text>
        }
        renderItem={({ item, index }) => {
            const icon = getCategoryIcon(item.category);
            const color = getCategoryColor(item.category);
            return (
                <Animated.View 
                    // Very subtle stagger, mostly fade
                    entering={FadeInDown.duration(600).delay(index * 80).damping(20)} 
                    style={styles.itemRow}
                >
                    <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                        <IconSymbol name={icon} size={20} color={color} />
                    </View>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={2}>{item.item_name}</Text>
                        <Text style={styles.itemQty}>{item.quantity} x {formatCurrency(item.item_price)}</Text>
                    </View>
                    <Text style={styles.itemTotal}>{formatCurrency(item.total_price)}</Text>
                </Animated.View>
            );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
  },
  errorText: {
      fontSize: 16,
      color: '#64748B',
  },
  header: {
    backgroundColor: Layout.colors.primary,
    height: 190,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    zIndex: 0,
  },
  headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      marginTop: 20,
  },
  backButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
  },
  backButtonPressed: {
      backgroundColor: 'rgba(255,255,255,0.3)', // Lighter when pressed
      borderColor: 'rgba(255,255,255,0.5)',
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFF',
      letterSpacing: 0.5,
  },
  summaryCard: {
      marginTop: -70,
      marginHorizontal: 24,
      backgroundColor: '#FFFFFF',
      borderRadius: 28,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.12,
      shadowRadius: 32,
      elevation: 10,
      zIndex: 10,
      borderWidth: 1,
      borderColor: '#FFF',
  },
  amountLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 12,
  },
  amountValue: {
      fontSize: 36,
      fontWeight: '800',
      color: Layout.colors.primary,
      letterSpacing: -1,
      marginBottom: 24,
  },
  amountContainer: {
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
      width: '100%',
      paddingBottom: 24,
      marginBottom: 24,
  },
  dateContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 24,
  },
  dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  dateText: {
      fontSize: 13,
      fontWeight: '500',
      color: '#64748B',
  },
  statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#F0FDF4',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#DCFCE7',
  },
  statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#16A34A',
  },
  statusText: {
      color: '#16A34A',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
  },
  listContent: {
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 40,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 20,
      marginLeft: 4,
      letterSpacing: -0.5,
  },
  itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#F8FAFC',
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
  },
  iconBox: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  itemInfo: {
      flex: 1,
      marginRight: 8,
  },
  itemName: {
      fontSize: 15,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 4,
  },
  itemQty: {
      fontSize: 13,
      color: '#94A3B8',
      fontWeight: '500',
  },
  itemTotal: {
      fontSize: 15,
      fontWeight: '700',
      color: '#0F172A',
  },
});
