import { Layout } from '@/src/constants/Layout';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetCard } from '@/src/components/home/BudgetCard';
import { BudgetModal } from '@/src/components/home/BudgetModal';
import { CategorySlider } from '@/src/components/home/CategorySlider';
import { EditItemModal } from '@/src/components/home/EditItemModal';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { StatsRow } from '@/src/components/home/StatsRow';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { VoiceFeedback } from '@/src/components/voice/VoiceFeedback';
import { VoiceFloatingButton } from '@/src/components/VoiceFloatingButton';
import { VoiceShoppingCard } from '@/src/components/VoiceShoppingCard';
import { useVoiceInput } from '@/src/hooks/useVoiceInput';
import { insertTransaction, Transaction } from '@/src/services/db';
import { groqService as geminiService, ParsedItem } from '@/src/services/groqService';
import { useSQLiteContext } from 'expo-sqlite';
import { toast } from 'sonner-native';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isListening, transcript, finalResult, startRecording, stopRecording, error: voiceError } = useVoiceInput();
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { clampedNormalize, isTablet, centerContentStyle, width } = useResponsive();

  const categories = [
      { key: 'All', label: t('categories.all') },
      { key: 'Food', label: t('categories.food') },
      { key: 'Drink', label: t('categories.drink') },
      { key: 'Fruit', label: t('categories.fruit') },
      { key: 'Snacks', label: t('categories.snacks') },
      { key: 'Household', label: t('categories.household') },
      { key: 'Other', label: t('categories.other') }
  ];

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase());
  
  // Budget State
  const [budget, setBudget] = useState(500000); // Default IDR 500k
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
                items: items.map(item => ({
                    item_name: item.product_name,
                    item_price: item.qty > 0 ? (item.price / item.qty) : item.price,
                    quantity: item.qty,
                    category: item.category || 'Other',
                    total_price: item.price
                }))
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
      const result = await geminiService.analyzeVoiceText(text);
      
      if (!result) {
        toast.error(t('voice.errorBoth'), { 
            description: t('voice.tryAgain'),
            duration: 3000 
        });
        return;
      }

      // Validation 0: Content Safety / Relevance
      if (result.product_name === 'INVALID_CONTENT') {
          toast.error(t('voice.errorInvalidContent'), {
              description: t('voice.tryAgain'),
              duration: 4000,
          });
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
      const cleanItem = {
          ...result,
          qty: result.qty > 0 ? result.qty : 1
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

  const handleDeleteItem = (index: number) => {
    setItems((prev) => {
        const newItems = [...prev];
        newItems.splice(index, 1);
        return newItems;
    });
  };

  const handleUpdateQuantity = (index: number, change: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const item = newItems[index];
      
      if (!item) return prevItems;

      const unitPrice = item.qty > 0 ? (item.price / item.qty) : 0;
      const newQty = item.qty + change;

      if (newQty < 1) return prevItems;

      newItems[index] = {
        ...item,
        qty: newQty,
        price: Math.round(unitPrice * newQty)
      };
      
      return newItems;
    });
  };

  const handleSaveItem = (name: string, unitPrice: number) => {
    if (editingIndex === null) return;
    
    setItems((prev) => {
      const newItems = [...prev];
      const item = newItems[editingIndex];
      // Recalculate total price based on new unit price
      const newTotalPrice = unitPrice * item.qty;
      
      newItems[editingIndex] = {
        ...item,
        product_name: name,
        price: newTotalPrice
      };
      return newItems;
    });
    setEditingIndex(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Layout.colors.primary} />
      
      <View style={[styles.fixedContent, { width: '100%', alignItems: 'center' }]}>
        <HomeHeader />

        <View style={[styles.budgetWrapper, centerContentStyle, { marginTop: clampedNormalize(-24) }]}>
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

        <View style={[{ width: '100%' }, centerContentStyle]}>
            <CategorySlider 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
            />
        </View>

        {items.length > 0 && (
            <View style={[styles.titleWrapper, centerContentStyle, { paddingHorizontal: isTablet ? 0 : 24 }]}>
                <Text style={[styles.sectionTitle, { fontSize: clampedNormalize(18) }]}>
                    {selectedCategory === 'All' 
                        ? t('home.recentItems') 
                        : `${categories.find(c => c.key === selectedCategory)?.label || selectedCategory} Items`}
                </Text>
                <TouchableOpacity 
                    style={[styles.headerFinishButton, { paddingVertical: clampedNormalize(8), paddingHorizontal: clampedNormalize(16), borderRadius: clampedNormalize(20) }]} 
                    onPress={handleFinishShopping}
                    activeOpacity={0.7}
                >
                    <IconSymbol name="checkmark" size={clampedNormalize(16)} color="#FFFFFF" weight="bold" />
                    <Text style={[styles.headerFinishText, { fontSize: clampedNormalize(13) }]}>{t('home.finish')}</Text>
                </TouchableOpacity>
            </View>
        )}
      </View>

      <FlatList
        style={{ flex: 1, width: '100%' }}
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.itemWrapper, centerContentStyle]}>
              <VoiceShoppingCard 
                productName={item.product_name} 
                price={item.price} 
                qty={item.qty} 
                category={item.category}
                index={index}
                onDelete={() => handleDeleteItem(index)}
                onIncrement={() => handleUpdateQuantity(index, 1)}
                onDecrement={() => handleUpdateQuantity(index, -1)}
                onEdit={() => setEditingIndex(index)}
              />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            !isProcessing && items.length === 0 ? (
                <View style={[styles.emptyState, { marginTop: clampedNormalize(40) }]}>
                    <Text style={[styles.emptyText, { fontSize: clampedNormalize(18) }]}>{t('home.cartEmpty')}</Text>
                    <Text style={[styles.emptySubText, { fontSize: clampedNormalize(14) }]}>
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
      />

      <BudgetModal 
        visible={isBudgetModalVisible}
        currentBudget={budget}
        onClose={() => setIsBudgetModalVisible(false)}
        onSetBudget={setBudget}
      />

      {items.length > 0 && editingIndex !== null && items[editingIndex] && (
        <EditItemModal
            visible={editingIndex !== null}
            initialName={items[editingIndex].product_name}
            initialPrice={items[editingIndex].qty > 0 ? (items[editingIndex].price / items[editingIndex].qty) : 0}
            onClose={() => setEditingIndex(null)}
            onSave={handleSaveItem}
        />
      )}

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

