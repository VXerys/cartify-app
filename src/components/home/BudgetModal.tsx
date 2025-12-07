import { Layout } from '@/src/constants/Layout';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface BudgetModalProps {
  visible: boolean;
  currentBudget: number;
  onClose: () => void;
  onSetBudget: (newBudget: number) => void;
}

export function BudgetModal({ visible, currentBudget, onClose, onSetBudget }: BudgetModalProps) {
  // Initialize with formatted value
  const [value, setValue] = useState('');
  
  useEffect(() => {
    if (visible) {
      // Format initial budget
      setValue(formatNumber(currentBudget.toString()));
    }
  }, [visible, currentBudget]);

  const formatNumber = (val: string) => {
    // Remove non-numeric chars
    const numberString = val.replace(/[^0-9]/g, '');
    if (!numberString) return '';
    
    // Format with format: Rp. X,XXX
    const number = parseInt(numberString, 10);
    return 'Rp. ' + number.toLocaleString('id-ID');
  };

  const handleTextChange = (text: string) => {
    // If user deletes everything or just "Rp. ", clear it
    if (text === 'Rp. ' || text === '') {
      setValue('');
      return;
    }
    
    // Re-format clean number
    const formatted = formatNumber(text);
    setValue(formatted);
  };

  const handleSave = () => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      onSetBudget(num);
      onClose();
    }
  };

  // Button Animation State
  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <Animated.View 
          entering={ZoomIn.duration(300).springify()}
          style={styles.modalView}
        >
          <View style={styles.headerDecoration} />
          
          <Animated.Text 
            entering={FadeInDown.delay(100).springify()}
            style={styles.modalTitle}
          >
            Set Monthly Budget
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInDown.delay(200).springify()}
            style={styles.modalSubtitle}
          >
            Enter your target budget limit in IDR
          </Animated.Text>
          
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              onChangeText={handleTextChange}
              value={value}
              keyboardType="number-pad"
              autoFocus
              placeholder="Rp. 0"
              placeholderTextColor="#B0B0B0"
              selectionColor={Layout.colors.primary}
            />
          </Animated.View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonCancel]} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.textCancel}>Cancel</Text>
            </TouchableOpacity>
            
            <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonSave]} 
                onPress={handleSave}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={0.9}
              >
                <Text style={styles.textSave}>Save Budget</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay for better contrast
    // backdropFilter: 'blur(10px)', // Note: backdropFilter is not reliable in all RN versions/platforms
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#2A9D8F', // Primary color
  },
  modalTitle: {
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    height: 64,
    width: '100%',
    borderColor: '#EEE',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonSave: {
    backgroundColor: '#2A9D8F',
    shadowColor: "#2A9D8F",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  textCancel: {
    color: '#8E8E93',
    fontWeight: '600',
    fontSize: 16,
  },
  textSave: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
