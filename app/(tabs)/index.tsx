import { Layout } from '@/src/constants/Layout';
import { useResponsive } from '@/src/hooks/useResponsive';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetCard } from '@/src/components/home/BudgetCard';
import { BudgetModal } from '@/src/components/home/BudgetModal';
import { CategorySlider } from '@/src/components/home/CategorySlider';
import { EditItemModal } from '@/src/components/home/EditItemModal';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { StatsRow } from '@/src/components/home/StatsRow';
import { AppModal } from '@/src/components/ui/AppModal';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { VoiceFeedback } from '@/src/components/voice/VoiceFeedback';
import { VoiceFloatingButton } from '@/src/components/VoiceFloatingButton';
import { VoiceShoppingCard } from '@/src/components/VoiceShoppingCard';
import { useSettings } from '@/src/hooks/useSettings';
import { useVoiceInput } from '@/src/hooks/useVoiceInput';
import { insertTransaction, Transaction } from '@/src/services/db';
import { groqService, ParsedItem } from '@/src/services/groqService';
import { normalizeCategory, normalizeMoney, normalizeQty, normalizeUnit } from '@/src/utils/normalize';
import { useSQLiteContext } from 'expo-sqlite';
import { toast } from 'sonner-native';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isListening, transcript, finalResult, startRecording, stopRecording, error: voiceError } = useVoiceInput();
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { moderateScale, isTablet, contentContainerStyle, containerPadding } = useResponsive();
  const { voiceButtonPosition } = useSettings();

    const categories = [
      { key: 'all', label: t('categories.all') },
      { key: 'food', label: t('categories.food') },
      { key: 'drink', label: t('categories.drink') },
      { key: 'fruit', label: t('categories.fruit') },
      { key: 'snacks', label: t('categories.snacks') },
      { key: 'household', label: t('categories.household') },
      { key: 'other', label: t('categories.other') }
    ];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => normalizeCategory(item.category) === selectedCategory);
  
  // Budget State
  const [budget, setBudget] = useState(500000); // Default IDR 500k
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [limitErrorVisible, setLimitErrorVisible] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const editingItem = items.find(i => i.id === editingId);
  const spent = items.reduce((sum, item) => sum + item.price, 0);

  // Handle Voice Result
  useEffect(() => {
    if (finalResult) {
      handleAnalyze(finalResult);
    }
  }, [finalResult]);

  // Database
    const db = useSQLiteContext();

    const handleFinishShopping = async () => {
        if (items.length === 0) return;

        try {
            const transaction: Transaction = {
                date: new Date().toISOString(),
                total_amount: spent,
                note: 'Shopping Session',
                items: items.map(item => {
                  const qty = normalizeQty(item.qty);
                  const totalPrice = normalizeMoney(item.price);
                  const unitPrice = qty > 0 ? Math.round(totalPrice / qty) : totalPrice;
                  return {
                    item_name: item.product_name,
                  item_price: unitPrice,
                  quantity: qty,
                  unit: normalizeUnit(item.unit),
                  category: normalizeCategory(item.category),
                  total_price: totalPrice
                  };
                })
            };

            await insertTransaction(db, transaction);
            
            setItems([]);
            toast.success(t('home.shoppingSaved'), {
                description: t('home.checkHistory'),
                duration: 3000,
            });

        } catch (error) {
            console.error(error);
            toast.error('Failed to save shopping session');
        }
    };

  const handleAnalyze = async (text: string) => {
    setIsProcessing(true);
    try {
      console.log("Analyzing text:", text);
      const result = await groqService.analyzeVoiceText(text);
      
      if (!result) {
        toast.error(t('voice.errorBoth'), { 
            description: t('voice.tryAgain'),
            duration: 3000 
        });
        return;
      }

      // Validation 0: Content Safety / Relevance
      // Validation 0: Content Safety / Relevance
      if (result.product_name === 'INVALID_CONTENT') {
          if (result.validation_status === 'REFUSAL_PROFANITY') {
             toast.error(t('voice.errorProfanity'), { duration: 4000 });
             return;
          }
          if (result.validation_status === 'REFUSAL_GREETING') {
             toast.info(t('voice.errorGreeting'), { duration: 4000 });
             return;
          }
          if (result.validation_status === 'REFUSAL_IRRELEVANT') {
             toast.info(t('voice.errorIrrelevant'), { duration: 4000 });
             return;
          }
          if (result.validation_status === 'REFUSAL_UNCLEAR') {
             toast.error(t('voice.errorUnclear'), { duration: 4000 });
             return;
          }

          toast.error(t('voice.errorInvalidContent'), {
              description: t('voice.tryAgain'),
              duration: 4000,
          });
          return;
      }

      // Validation 0.5: Price Limit
      if (result.product_name === 'LIMIT_EXCEEDED') {
          setLimitErrorVisible(true);
          return;
      }

      // Validation 1: Missing Name
      if (!result.product_name || result.product_name.trim() === '') {
        toast.error(t('voice.errorName'), {
            description: t('voice.tryAgain'),
            duration: 4000,
        });
        return; // Validation failed, do not save
      }

      // Validation 2: Missing Price
      if (!result.price || result.price <= 0) {
        toast.error(t('voice.errorPrice'), {
            description: t('voice.tryAgain'),
            duration: 4000,
        });
        return; // Validation failed, do not save
      }

      // Quantity Logic handled in prompt (defaults to 1) but ensure it's valid
        const cleanItem: ParsedItem = {
          ...result,
          qty: normalizeQty(result.qty),
          price: normalizeMoney(result.price),
          unit: normalizeUnit(result.unit),
          category: normalizeCategory(result.category)
        };

      setItems((prev) => [cleanItem, ...prev]);

    } catch (err) {
      console.error("Analysis failed", err);
      toast.error(t('common.error'), { description: t('voice.tryAgain') });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleEditBudget = () => {
    setIsBudgetModalVisible(true);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    setItems((prevItems) => {
      return prevItems.map(item => {
        if (item.id !== id) return item;
        
        const unitPrice = item.qty > 0 ? Math.round(item.price / item.qty) : 0;
        const newQty = item.qty + change;
        
        if (newQty < 1) return item;

        return {
          ...item,
          qty: newQty,
          price: unitPrice * newQty
        };
      });
    });
  };

  const handleSaveItem = (name: string, unitPrice: number, unit: string) => {
    if (!editingId) return;
    
    setItems((prev) => {
      return prev.map(item => {
        if (item.id !== editingId) return item;
        
        // Recalculate total price based on new unit price
        const newTotalPrice = Math.round(unitPrice) * item.qty;
        
        return {
          ...item,
          product_name: name,
          price: newTotalPrice,
          unit: normalizeUnit(unit) // Update the unit
        };
      });
    });
    setEditingId(null);
  };
  
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Home uses local state for items, so maybe we just refresh the budget/stats or do nothing?
    // Since items are "session" based, we don't want to clear them on refresh unless intended.
    // We will just simulate a network wait.
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Layout.colors.primary} />
      
      <View style={[styles.fixedContent, { width: '100%', alignItems: 'center' }]}>
        <HomeHeader />

        <View style={[
            styles.budgetWrapper, 
            contentContainerStyle as any, 
            { 
              marginTop: moderateScale(20), // Adjusted from -24 to positive to avoid overlap issues if header changed, or keep consistent spacing
              paddingHorizontal: containerPadding 
            }
        ]}>
              <BudgetCard 
                budget={budget} 
                spent={spent} 
                onEditBudget={handleEditBudget}
            >
                <StatsRow 
                    orders={items.length} 
                    items={items.reduce((acc, curr) => acc + (curr.qty || 1), 0)} 
                />
            </BudgetCard>
        </View>

        <View style={[{ width: '100%' }, contentContainerStyle as any]}>
            <CategorySlider 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
            />
        </View>

        {items.length > 0 && (
            <View style={[styles.titleWrapper, contentContainerStyle as any, { paddingHorizontal: isTablet ? 0 : containerPadding }]}>
                <Text style={[styles.sectionTitle, { fontSize: moderateScale(18) }]}>
                    {selectedCategory === 'all' 
                        ? t('home.recentItems') 
                        : `${categories.find(c => c.key === selectedCategory)?.label || selectedCategory} Items`}
                </Text>
                <TouchableOpacity 
                    style={[styles.headerFinishButton, { paddingVertical: moderateScale(8), paddingHorizontal: moderateScale(16), borderRadius: moderateScale(20) }]} 
                    onPress={handleFinishShopping}
                    activeOpacity={0.7}
                >
                    <IconSymbol name="checkmark" size={moderateScale(16)} color="#FFFFFF" weight="bold" />
                    <Text style={[styles.headerFinishText, { fontSize: moderateScale(13) }]}>{t('home.finish')}</Text>
                </TouchableOpacity>
            </View>
        )}
      </View>

      <FlatList
        style={{ flex: 1, width: '100%' }}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Layout.colors.primary]} />
        }
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles.itemWrapper, contentContainerStyle as any, { paddingHorizontal: isTablet ? 0 : containerPadding }]}>
              <VoiceShoppingCard 
                productName={item.product_name} 
                price={item.price} 
                qty={item.qty} 
                unit={item.unit}
                category={item.category}
                index={index}
                onDelete={() => handleDeleteItem(item.id)}
                onIncrement={() => handleUpdateQuantity(item.id, 1)}
                onDecrement={() => handleUpdateQuantity(item.id, -1)}
                onEdit={() => setEditingId(item.id)}
              />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            !isProcessing && items.length === 0 ? (
                <View style={[styles.emptyState, { marginTop: moderateScale(40) }]}>
                    <Text style={[styles.emptyText, { fontSize: moderateScale(18) }]}>{t('home.cartEmpty')}</Text>
                    <Text style={[styles.emptySubText, { fontSize: moderateScale(14) }]}>
                        {t('home.tapMic')}
                    </Text>
                </View>
            ) : null
        }
        ListFooterComponent={ <View style={{ height: 20 }} /> }
      />

      <VoiceFeedback 
        isListening={isListening}
        isProcessing={isProcessing}
        transcript={transcript}
        error={voiceError}
        onRetry={startRecording}
      />

      {/* Voice Controls */}
      <VoiceFloatingButton 
        isListening={isListening} 
        isProcessing={isProcessing}
        onPress={toggleRecording}
        position={voiceButtonPosition}
      />

      <BudgetModal 
        visible={isBudgetModalVisible}
        currentBudget={budget}
        onClose={() => setIsBudgetModalVisible(false)}
        onSetBudget={setBudget}
      />

      {editingItem && (
        <EditItemModal
            visible={!!editingItem}
            initialName={editingItem.product_name}
            initialUnit={editingItem.unit}
            initialPrice={editingItem.qty > 0 ? (editingItem.price / editingItem.qty) : 0}
            onClose={() => setEditingId(null)}
            onSave={handleSaveItem}
        />
      )}

      <AppModal
          visible={limitErrorVisible}
          title={t('voice.limitExceededTitle')}
          subtitle={t('voice.errorLimitExceeded')}
          onClose={() => setLimitErrorVisible(false)}
          variant="danger"
          headerIcon={<IconSymbol name="exclamationmark.triangle.fill" size={28} color="#EF4444" />}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F9F9', // Faint teal tint to match brand
    paddingTop: 0,
  },
  fixedContent: {
      backgroundColor: 'transparent',
      zIndex: 10,
      paddingBottom: 4, 
  },
  budgetWrapper: {
      marginBottom: 8,
      zIndex: 20,
      width: '100%',
  },
  titleWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 8,
      marginTop: 8,
      backgroundColor: '#F2F9F9',
      zIndex: 10,
      width: '100%',
  },
  sectionTitle: {
      fontWeight: 'bold',
      color: '#1A1A1A',
  },
  headerFinishButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Layout.colors.primary,
      gap: 6,
      shadowColor: Layout.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
  },
  headerFinishText: {
      color: '#FFFFFF',
      fontWeight: '700',
      letterSpacing: 0.3,
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
    paddingTop: 8,
  },
  itemWrapper: {
      paddingHorizontal: 24,
      marginBottom: 16, 
      width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    opacity: 0.6,
  },
  emptyText: {
    fontWeight: '600',
    color: '#333',
  },
  emptySubText: {
    color: '#666',
    marginTop: 4,
  },

  footerContainer: {
      paddingHorizontal: 24,
      marginTop: 8,
      marginBottom: 20,
  },
});

