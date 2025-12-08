import { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetCard } from '@/src/components/home/BudgetCard';
import { BudgetModal } from '@/src/components/home/BudgetModal';
import { EditItemModal } from '@/src/components/home/EditItemModal';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { StatsRow } from '@/src/components/home/StatsRow';
import { VoiceFloatingButton } from '@/src/components/VoiceFloatingButton';
import { VoiceShoppingCard } from '@/src/components/VoiceShoppingCard';
import { useVoiceInput } from '@/src/hooks/useVoiceInput';
import { groqService as geminiService, ParsedItem } from '@/src/services/groqService';

export default function HomeScreen() {
  const { isListening, transcript, finalResult, startRecording, stopRecording, error: voiceError } = useVoiceInput();
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  const handleAnalyze = async (text: string) => {
    setIsProcessing(true);
    try {
      console.log("Analyzing text:", text);
      const result = await geminiService.analyzeVoiceText(text);
      if (result) {
        setItems((prev) => [result, ...prev]);
      } else {
        console.warn("Could not parse voice input");
      }
    } catch (err) {
      console.error("Analysis failed", err);
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
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.fixedContent}>
        <HomeHeader />

        <View style={styles.budgetWrapper}>
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

        {items.length > 0 && (
            <View style={styles.titleWrapper}>
                <Text style={styles.sectionTitle}>Recent Items</Text>
            </View>
        )}
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemWrapper}>
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
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Cart is empty</Text>
                    <Text style={styles.emptySubText}>
                        Tap the mic to add items to your budget.
                    </Text>
                </View>
            ) : null
        }
      />

      {/* Live Transcript Overlay */}
      {isListening && (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptLabel}>Listening...</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
         <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptText}>Processing...</Text>
        </View> 
      )}

      {/* Error Overlay */}
      {voiceError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{voiceError}</Text>
        </View>
      )}

      {/* Voice Controls */}
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
    backgroundColor: '#F8F9FA',
    paddingTop: 0,
  },
  fixedContent: {
      backgroundColor: '#F8F9FA',
      zIndex: 10,
      paddingBottom: 4, 
  },
  budgetWrapper: {
      marginBottom: 8,
  },
  titleWrapper: {
      paddingBottom: 8,
      backgroundColor: '#F8F9FA',
      zIndex: 10,
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
    paddingTop: 8,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1A1A1A',
      marginLeft: 24,
      marginTop: 8,
      marginBottom: 0, 
  },
  itemWrapper: {
      paddingHorizontal: 24,
      marginBottom: 16, // Increased spacing for better card separation
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  transcriptContainer: {
    position: 'absolute',
    top: 600, // Moved to top to avoid overlap with bottom button
    left: 24,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 998, // Below the button z-index
  },
  transcriptLabel: {
    color: '#AAA',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  transcriptText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    top: 595, // Align with transcript position
    left: 16,
    right: 16,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
    fontSize: 14,
  },
});
