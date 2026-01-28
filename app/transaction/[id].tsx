import { IconSymbol, IconSymbolName } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { useResponsive } from '@/src/hooks/useResponsive';
import { getTransactionDetails, Transaction } from '@/src/services/db';
import { formatCurrency } from '@/src/utils/currency';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, FlatList, Pressable, RefreshControl, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TransactionDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const { moderateScale, verticalScale, containerPadding, contentContainerStyle } = useResponsive();
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
  
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      if (id) {
          try {
              const data = await getTransactionDetails(db, Number(id));
              setTransaction(data);
          } catch (error) {
              console.error("Failed to fetch transaction details", error);
          }
      }
      setRefreshing(false);
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
        <View style={[styles.header, { height: verticalScale(190), paddingTop: insets.top + verticalScale(16) }]}>
            <Pressable 
                onPress={() => router.back()} 
                style={({ pressed }) => [
                    styles.backButton,
                    { 
                        width: moderateScale(44), 
                        height: moderateScale(44),
                        borderRadius: moderateScale(14)
                    },
                    pressed && styles.backButtonPressed
                ]}
                testID="transaction-back-button"
                accessibilityLabel="Back"
                accessibilityRole="button"
            >
                <IconSymbol name="chevron.left" size={moderateScale(24)} color="#FFF" /> 
            </Pressable>
        </View>
        <View style={styles.center}>
            <Text style={[styles.errorText, { fontSize: moderateScale(16) }]}>{t('transaction.notFound')}</Text>
        </View>
      </View>
    );
  }

  const dateObj = new Date(transaction.date);
  const locale = i18n.language === 'id' ? 'id-ID' : 'en-US';
  
  const dateStr = dateObj.toLocaleDateString(locale, { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short',
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
      <View style={[styles.header, { height: verticalScale(220), paddingTop: insets.top }]}>
        {/* Premium Background */}
        <View style={styles.headerBackground}>
          {/* Mesh gradients */}
          <View style={[styles.meshGradient, styles.meshGradient1]} />
          <View style={[styles.meshGradient, styles.meshGradient2]} />
          
          {/* Grid pattern */}
          <View style={styles.gridPattern}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLine, styles.gridLineHorizontal, { top: `${(i + 1) * 25}%` }]} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLine, styles.gridLineVertical, { left: `${(i + 1) * 20}%` }]} />
            ))}
          </View>
          
          {/* Glowing orbs */}
          <View style={[styles.glowOrb, styles.glowOrb1]} />
          <View style={[styles.glowOrb, styles.glowOrb2]} />
        </View>
        
        <View style={[styles.headerTop, contentContainerStyle as any, { paddingHorizontal: containerPadding }]}>
             <Pressable 
                onPress={() => router.back()} 
                style={({ pressed }) => [
                    styles.backButton,
                    { 
                        width: moderateScale(44), 
                        height: moderateScale(44), 
                        borderRadius: moderateScale(14) 
                    },
                    pressed && styles.backButtonPressed
                ]}
                testID="transaction-back-button"
                accessibilityLabel="Back"
                accessibilityRole="button"
            >
                <IconSymbol name="chevron.left" size={moderateScale(24)} color="#FFF" /> 
             </Pressable>
             
             <Animated.Text 
                entering={FadeIn.duration(800)} 
                style={[styles.headerTitle, { fontSize: moderateScale(18) }]}
             >
                {t('transaction.details')}
             </Animated.Text>
             
             <View style={{ width: moderateScale(44) }} /> 
        </View>
      </View>

      {/* Ticket Card */}
      <Animated.View 
        entering={FadeInUp.duration(800).springify().damping(20).mass(1).stiffness(90)} 
        style={[
            styles.ticketContainer, 
            contentContainerStyle as any,
            { 
                marginTop: verticalScale(-90), 
                marginHorizontal: containerPadding,
            }
        ]}
      >
          {/* Top Section: Amount */}
          <View style={[styles.ticketTop, { padding: moderateScale(24) }]}>
              <Text style={[styles.amountLabel, { fontSize: moderateScale(12) }]}>{t('transaction.totalBill')}</Text>
              <Text style={[styles.amountValue, { fontSize: moderateScale(32) }]}>
                {formatCurrency(transaction.total_amount)}
              </Text>
          </View>

          {/* Divider with Notches */}
          <View style={styles.dividerContainer}>
              <View style={[styles.notch, styles.notchLeft, { width: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), left: moderateScale(-10) }]} />
              <View style={styles.dashedLine} />
              <View style={[styles.notch, styles.notchRight, { width: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), right: moderateScale(-10) }]} />
          </View>

          {/* Bottom Section: Details */}
          <View style={[styles.ticketBottom, { padding: moderateScale(24) }]}>
              <View style={[styles.detailRow, { marginBottom: moderateScale(20) }]}>
                  {/* Date Column */}
                  <View style={styles.detailItemLeft}>
                      <View style={styles.detailIconLabel}>
                           <IconSymbol name="calendar" size={moderateScale(14)} color="#94A3B8" />
                           <Text style={[styles.detailLabel, { fontSize: moderateScale(12) }]}>{t('common.date')}</Text>
                      </View>
                      <Text style={[styles.detailValue, { fontSize: moderateScale(14) }]}>{dateStr}</Text>
                  </View>
                  
                  {/* Time Column */}
                  <View style={styles.detailItemRight}>
                      <View style={styles.detailIconLabel}>
                           <IconSymbol name="clock" size={moderateScale(14)} color="#94A3B8" />
                           <Text style={[styles.detailLabel, { fontSize: moderateScale(12) }]}>{t('common.time')}</Text>
                      </View>
                      <Text style={[styles.detailValue, { fontSize: moderateScale(14) }]}>{timeStr}</Text>
                  </View>
              </View>

              <View style={[styles.detailRow, { marginBottom: moderateScale(20) }]}>
                  {/* Orders Column */}
                  <View style={styles.detailItemLeft}>
                      <View style={styles.detailIconLabel}>
                           <IconSymbol name="bag.fill" size={moderateScale(14)} color="#94A3B8" />
                           <Text style={[styles.detailLabel, { fontSize: moderateScale(12) }]}>{t('home.statsOrders')}</Text>
                      </View>
                      <Text style={[styles.detailValue, { fontSize: moderateScale(14) }]}>{transaction.items?.length || 0}</Text>
                  </View>
                  
                  {/* Items Column */}
                  <View style={styles.detailItemRight}>
                      <View style={styles.detailIconLabel}>
                           <IconSymbol name="cube.box.fill" size={moderateScale(14)} color="#94A3B8" />
                           <Text style={[styles.detailLabel, { fontSize: moderateScale(12) }]}>{t('home.statsItems')}</Text>
                      </View>
                       <Text style={[styles.detailValue, { fontSize: moderateScale(14) }]}>{transaction.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</Text>
                  </View>
              </View>

              <View style={[styles.statusBadgeFull, { 
                  paddingVertical: moderateScale(12), 
                  borderRadius: moderateScale(16),
                  gap: moderateScale(8)
                }]}>
                  <View style={[styles.statusDot, { width: moderateScale(8), height: moderateScale(8), borderRadius: moderateScale(4) }]} />
                  <Text style={[styles.statusText, { fontSize: moderateScale(13) }]}>{t('transaction.shoppingRecorded')}</Text>
              </View>
          </View>
      </Animated.View>

      <FlatList
        data={transaction.items}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={[
            styles.listContent, 
            { 
                paddingHorizontal: containerPadding, 
                paddingTop: moderateScale(24), 
                paddingBottom: moderateScale(40) 
            }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Layout.colors.primary]} />
        }
        ListHeaderComponent={
            <Text style={[styles.sectionTitle, { fontSize: moderateScale(18), marginBottom: moderateScale(16) }]}>
                {t('transaction.itemsPurchased')}
            </Text>
        }
        renderItem={({ item, index }) => {
            const icon = getCategoryIcon(item.category);
            const color = getCategoryColor(item.category);
            return (
                <Animated.View 
                    entering={FadeInDown.duration(600).delay(index * 80).damping(20)} 
                    style={[styles.itemRow, { 
                        padding: moderateScale(16), 
                        borderRadius: moderateScale(20), 
                        marginBottom: moderateScale(12) 
                    }]}
                >
                    <View style={[styles.iconBox, { 
                        backgroundColor: `${color}15`, 
                        width: moderateScale(48), 
                        height: moderateScale(48), 
                        borderRadius: moderateScale(16),
                        marginRight: moderateScale(16)
                    }]}>
                        <IconSymbol name={icon} size={moderateScale(20)} color={color} />
                    </View>
                    <View style={[styles.itemInfo, { marginRight: moderateScale(8) }]}>
                        <Text style={[styles.itemName, { fontSize: moderateScale(15), marginBottom: moderateScale(4) }]} numberOfLines={2}>{item.item_name}</Text>
                        <Text style={[styles.itemQty, { fontSize: moderateScale(13) }]}>
                            {item.quantity}{item.unit ? ` ${item.unit}` : ''} x {formatCurrency(item.item_price)}
                        </Text>
                    </View>
                    <Text style={[styles.itemTotal, { fontSize: moderateScale(15) }]}>{formatCurrency(item.total_price)}</Text>
                    
                    {/* Subtle premium background for items */}
                    <View style={styles.itemBackground}>
                      <View style={[styles.itemGlow, { backgroundColor: `${color}08` }]} />
                    </View>
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
      color: '#64748B',
  },
  header: {
    backgroundColor: Layout.colors.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    zIndex: 0,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  // Premium Header Background
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  meshGradient: {
    position: 'absolute',
    borderRadius: 999,
  },
  meshGradient1: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -50,
    right: -60,
  },
  meshGradient2: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -20,
    left: -40,
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowOrb1: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 30,
    right: -20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  glowOrb2: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 20,
    left: -15,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 8,
  },
  headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%',
  },
  backButton: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
  },
  backButtonPressed: {
      backgroundColor: 'rgba(255,255,255,0.3)', 
      borderColor: 'rgba(255,255,255,0.5)',
  },
  headerTitle: {
      fontWeight: '700',
      color: '#FFF',
      letterSpacing: 0.5,
  },
  // Ticket Styles
  ticketContainer: {
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
      borderRadius: 24, // Main container radius (masked by parts)
      backgroundColor: 'transparent', // Parts have color
      zIndex: 10,
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
  },
  ticketTop: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      alignItems: 'center',
  },
  ticketBottom: {
      backgroundColor: '#FFFFFF',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
  },
  dividerContainer: {
      height: 20,
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible', // Ensure notches are visible
      zIndex: 20,
  },
  dashedLine: {
      flex: 1,
      height: 1,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderStyle: 'dashed',
      marginHorizontal: 24,
  },
  notch: {
      position: 'absolute',
      backgroundColor: '#F8FAFC', // Matches screen background to fake a cut
      zIndex: 30,
  },
  notchLeft: {},
  notchRight: {},

  amountLabel: {
      fontWeight: '700',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 8,
  },
  amountValue: {
      fontWeight: '800',
      color: Layout.colors.primary,
      letterSpacing: -1,
  },
  detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
  },
  detailItemLeft: {
      flex: 1,
      alignItems: 'flex-start',
      paddingRight: 8,
  },
  detailItemRight: {
      flex: 1,
      alignItems: 'flex-end',
      paddingLeft: 8,
  },
  detailIconLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 6,
  },
  detailLabel: {
      color: '#94A3B8',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
  },
  detailValue: {
      color: '#334155',
      fontWeight: '700',
      flexWrap: 'wrap', 
  },
  statusBadgeFull: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F0FDF4',
      borderWidth: 1,
      borderColor: '#DCFCE7',
      width: '100%',
  },
  statusDot: {
      backgroundColor: '#16A34A',
  },
  statusText: {
      color: '#16A34A',
      fontWeight: '800',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
  },
  listContent: {
      // handled inline
  },
  sectionTitle: {
      fontWeight: '700',
      color: '#1E293B',
      marginLeft: 4,
      letterSpacing: -0.5,
  },
  itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#F8FAFC',
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
      position: 'relative',
      overflow: 'hidden',
  },
  itemBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  itemGlow: {
    position: 'absolute',
    width: '40%',
    height: '100%',
    right: 0,
    borderRadius: 999,
  },
  iconBox: {
      justifyContent: 'center',
      alignItems: 'center',
  },
  itemInfo: {
      flex: 1,
  },
  itemName: {
      fontWeight: '600',
      color: '#1E293B',
  },
  itemQty: {
      color: '#94A3B8',
      fontWeight: '500',
  },
  itemTotal: {
      fontWeight: '700',
      color: '#0F172A',
  },
  noteContainer: {
      backgroundColor: '#F8FAFC',
      padding: 12,
      borderRadius: 12,
      width: '100%',
      marginBottom: 20,
  },
  noteText: {
      color: '#334155',
      fontWeight: '500',
      lineHeight: 20,
  },
});
