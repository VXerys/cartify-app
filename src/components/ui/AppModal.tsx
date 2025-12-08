import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle
} from 'react-native';
import Animated, {
    FadeInDown,
    ZoomIn,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface AppModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  children: React.ReactNode;
  headerIcon?: React.ReactNode;
  contentStyle?: ViewStyle;
}

export function AppModal({ 
  visible, 
  title, 
  subtitle, 
  onClose, 
  onSave, 
  saveLabel = 'Save',
  children,
  headerIcon
}: AppModalProps) {
  
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

  if (!visible) return null;

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
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View 
          entering={ZoomIn.duration(300).springify()}
          style={styles.modalView}
        >
          <View style={styles.headerDecoration} />
          
          {headerIcon && (
              <View style={styles.iconContainer}>
                  {headerIcon}
              </View>
          )}

          <Animated.Text 
            entering={FadeInDown.delay(100).springify()}
            style={styles.modalTitle}
          >
            {title}
          </Animated.Text>
          
          {subtitle && (
            <Animated.Text 
                entering={FadeInDown.delay(200).springify()}
                style={styles.modalSubtitle}
            >
                {subtitle}
            </Animated.Text>
          )}
          
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.contentContainer}
          >
            {children}
          </Animated.View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonCancel]} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.textCancel}>Cancel</Text>
            </TouchableOpacity>
            
            {onSave && (
                <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
                <TouchableOpacity 
                    style={[styles.button, styles.buttonSave]} 
                    onPress={onSave}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={0.9}
                >
                    <Text style={styles.textSave}>{saveLabel}</Text>
                </TouchableOpacity>
                </Animated.View>
            )}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: '#059669', // Emerald for edits, or generic primary
  },
  iconContainer: {
      marginBottom: 12,
      padding: 12,
      backgroundColor: '#ECFDF5',
      borderRadius: 16,
  },
  modalTitle: {
    marginTop: 0,
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
  contentContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
    backgroundColor: '#059669',
    shadowColor: "#059669",
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
