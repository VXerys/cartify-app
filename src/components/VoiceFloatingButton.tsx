import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';

interface VoiceFloatingButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onPress: () => void;
}

export function VoiceFloatingButton({ isListening, isProcessing, onPress }: VoiceFloatingButtonProps) {
  
  const animatedStyle = useAnimatedStyle(() => {
    if (isListening) {
      return {
        transform: [
          { scale: withRepeat(withSequence(withTiming(1.2, { duration: 500 }), withTiming(1)), -1, true) }
        ],
        opacity: 1,
      };
    }
    return {
      transform: [{ scale: withSpring(1) }],
      opacity: 1,
    };
  });

  return (
    <View style={styles.container}>
      {isProcessing && (
        <View style={styles.statusChip}>
          <Text style={styles.statusText}>Processing...</Text>
        </View>
      )}
      
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
        disabled={isProcessing}
      >
        <Animated.View style={[styles.button, isListening && styles.listeningButton, animatedStyle]}>
           <Ionicons 
             name={isListening ? "mic" : "mic-outline"} 
             size={32} 
             color="#FFF" 
           />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    // hit slop/area
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3B82F6', // Blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  listeningButton: {
    backgroundColor: '#EF4444', // Red
    shadowColor: '#EF4444',
  },
  statusChip: {
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  }
});
