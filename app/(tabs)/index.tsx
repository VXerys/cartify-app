import { useEffect, useState } from 'react';
import { FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { VoiceFloatingButton } from '@/src/components/VoiceFloatingButton';
import { VoiceShoppingCard } from '@/src/components/VoiceShoppingCard';
import { useVoiceInput } from '@/src/hooks/useVoiceInput';
import { groqService as geminiService, ParsedItem } from '@/src/services/groqService';

export default function HomeScreen() {
  const { isListening, transcript, finalResult, startRecording, stopRecording, error: voiceError } = useVoiceInput();
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
        // Handle "could not parse" case (optional: show toast)
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>Tap the mic & speak "Item price..."</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {items.length === 0 && !isListening && !isProcessing ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Cart is empty</Text>
            <Text style={styles.emptySubText}>
              Try saying: "Indomie Goreng tiga ribu lima ratus"
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <VoiceShoppingCard 
                productName={item.product_name} 
                price={item.price} 
                qty={item.qty} 
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Live Transcript Overlay */}
      {isListening && (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptLabel}>Listening...</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      )}

      {/* Error Overlay */}
      {voiceError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{voiceError}</Text>
        </View>
      )}

      {/* Voice Controls */}
      <VoiceFloatingButton 
        isListening={isListening} 
        isProcessing={isProcessing} 
        onPress={toggleRecording} 
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 24,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  transcriptContainer: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  transcriptLabel: {
    color: '#AAA',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  transcriptText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
    fontSize: 14,
  },
});
