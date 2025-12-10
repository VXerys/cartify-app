import { HistoryCard } from '@/src/components/history/HistoryCard';
import { HistoryHeader } from '@/src/components/history/HistoryHeader';
import { AppModal } from '@/src/components/ui/AppModal';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { deleteTransaction, getTransactionsWithItems, Transaction } from '@/src/services/db';
import { formatDate } from '@/src/utils/date';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, {
    Easing,
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    ZoomIn,
    ZoomOut
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Delete Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

  // Animation Shared Values
  const calendarHeight = useSharedValue(0);
  const calendarOpacity = useSharedValue(0);
  const calendarMargin = useSharedValue(0);

  useEffect(() => {
     if (showCalendar) {
         calendarHeight.value = withTiming(360, { duration: 400, easing: Easing.out(Easing.cubic) });
         calendarOpacity.value = withTiming(1, { duration: 300 });
         calendarMargin.value = withTiming(24, { duration: 300 });
     } else {
         calendarHeight.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) });
         calendarOpacity.value = withTiming(0, { duration: 200 });
         calendarMargin.value = withTiming(0, { duration: 300 });
     }
  }, [showCalendar]);

  const animatedCalendarStyle = useAnimatedStyle(() => {
      return {
          height: calendarHeight.value,
          opacity: calendarOpacity.value,
          marginBottom: calendarMargin.value,
      };
  });

  const fetchTransactions = async () => {
    try {
      const data = await getTransactionsWithItems(db);
      setTransactions(data);
      if (selectedDate) {
        setFilteredTransactions(data.filter(t => t.date.startsWith(selectedDate)));
      } else {
        setFilteredTransactions(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
    }, [selectedDate])
  );

  const confirmDelete = async () => {
      if (transactionToDelete) {
          try {
              await deleteTransaction(db, transactionToDelete);
              fetchTransactions(); 
          } catch (e) {
              console.error("Failed to delete", e);
          }
      }
      setDeleteModalVisible(false);
      setTransactionToDelete(null);
  };

  const handleDelete = (id: string) => {
      setTransactionToDelete(Number(id));
      setDeleteModalVisible(true);
  };

  useEffect(() => {
     if (selectedDate) {
         setFilteredTransactions(transactions.filter(t => t.date.startsWith(selectedDate)));
     } else {
         setFilteredTransactions(transactions);
     }
  }, [selectedDate, transactions]);

    const markedDates = transactions.reduce((acc, t) => {
        const dateKey = t.date.split('T')[0];
        acc[dateKey] = { marked: true, dotColor: Layout.colors.primary };
        return acc;
    }, {} as any);

    if (selectedDate) {
        markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: Layout.colors.primary };
    }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Layout.colors.primary} />
      
      <View style={styles.headerWrapper}>
          <HistoryHeader />
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{t('history.recentActivity')}</Text>
            {selectedDate && (
                <Animated.View 
                    entering={ZoomIn.duration(300)} 
                    exiting={ZoomOut.duration(200)}
                    style={styles.activeFilterBadge}
                >
                    <Text style={styles.activeFilterText}>{formatDate(selectedDate, i18n.language)}</Text>
                    <TouchableOpacity onPress={() => setSelectedDate('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <IconSymbol name="xmark" size={12} color="#FFF" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>

        <TouchableOpacity 
            style={[styles.iconButton, showCalendar && styles.iconButtonActive]}
            onPress={() => setShowCalendar(!showCalendar)}
            activeOpacity={0.7}
        >
            <IconSymbol 
                name="calendar" 
                size={22} 
                color={showCalendar ? '#FFF' : Layout.colors.primary} 
            />
        </TouchableOpacity>
      </View>
      
      <Animated.View style={[styles.calendarObj, animatedCalendarStyle]}>
        <Calendar
            onDayPress={(day: { dateString: string }) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
            }}
            markedDates={markedDates}
            theme={{
                todayTextColor: Layout.colors.primary,
                selectedDayBackgroundColor: Layout.colors.primary,
                arrowColor: Layout.colors.primary,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '500',
                calendarBackground: 'transparent', 
            }}
        />
      </Animated.View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item, index }) => (
            <HistoryCard 
                item={{
                    id: item.id?.toString() || '',
                    date: item.date,
                    totalPrice: item.total_amount,
                    totalItems: item.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
                    items: item.items?.map(i => ({
                        name: i.item_name,
                        qty: i.quantity,
                        price: i.item_price,
                        category: i.category
                    })) || []
                }} 
                index={index} 
                onPress={() => router.push(`/transaction/${item.id}`)}
                onDelete={handleDelete}
            />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <Animated.View 
                entering={FadeIn.delay(200)} 
                style={styles.emptyState}
            >
                <View style={styles.emptyIconContainer}>
                    <IconSymbol name="list.bullet" size={40} color="#DDD" />
                </View>
                <Text style={styles.emptyTitle}>{t('history.noTransactions')}</Text>
                <Text style={styles.emptyText}>{t('history.noPurchaseYet')}</Text>
            </Animated.View>
        }
      />

      <AppModal
        visible={deleteModalVisible}
        title={t('history.deleteTitle')}
        subtitle={t('history.deleteSubtitle')}
        onClose={() => setDeleteModalVisible(false)}
        onSave={confirmDelete}
        saveLabel={t('history.deleteConfirm')}
        variant="danger"
        headerIcon={<IconSymbol name="trash.fill" size={32} color="#EF4444" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerWrapper: {
      zIndex: 10,
      backgroundColor: 'transparent',
  },
  actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      marginTop: 20,
      marginBottom: 0, 
      paddingBottom: 20,
      zIndex: 5,
  },
  sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1E293B',
      letterSpacing: -0.5,
  },
  activeFilterBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Layout.colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 6,
  },
  activeFilterText: {
      color: '#FFF',
      fontSize: 12,
      fontWeight: '600',
  },
  iconButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: '#F1F5F9',
  },
  iconButtonActive: {
      backgroundColor: Layout.colors.primary,
      borderColor: Layout.colors.primary,
  },
  calendarObj: {
      backgroundColor: 'white',
      borderRadius: 24,
      overflow: 'hidden',
      marginHorizontal: 24,
      elevation: 5,
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      borderColor: '#F1F5F9',
      borderWidth: 1,
  },
  listContent: {
      paddingBottom: 40,
      paddingTop: 8,
  },
  emptyState: {
      alignItems: 'center',
      marginTop: 60,
      paddingHorizontal: 40,
  },
  emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
  },
  emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#334155',
      marginBottom: 8,
  },
  emptyText: {
      color: '#94A3B8',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
  }
});
