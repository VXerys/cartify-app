import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    ViewStyle
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface AppModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
  headerIcon?: React.ReactNode;
  contentStyle?: ViewStyle;
  variant?: 'default' | 'danger';
}

export function AppModal({ 
  visible, 
  title, 
  subtitle, 
  onClose, 
  onSave, 
  saveLabel = 'Save',
  cancelLabel = 'Batal',
  children,
  headerIcon,
  variant = 'default'
}: AppModalProps) {
  
  // Subtle button animation states
  const saveOpacity = useSharedValue(1);
  const cancelOpacity = useSharedValue(1);

  const animatedSaveStyle = useAnimatedStyle(() => ({
    opacity: saveOpacity.value,
  }));

  const animatedCancelStyle = useAnimatedStyle(() => ({
    opacity: cancelOpacity.value,
  }));

  if (!visible) return null;

  // Colors based on variant
  const primaryColor = variant === 'danger' ? '#EF4444' : '#059669';
  const lightColor = variant === 'danger' ? '#FEF2F2' : '#ECFDF5';

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
            <View style={[StyleSheet.absoluteFill, styles.backdrop]} />
        </TouchableWithoutFeedback>

        <Animated.View 
          entering={FadeIn.duration(200)}
          style={styles.modalView}
        >
          {/* Clean Header Line */}
          <View style={[styles.headerDecoration, { backgroundColor: primaryColor }]} />
          
          {/* Icon Container */}
          {headerIcon && (
              <View style={[styles.iconContainer, { backgroundColor: lightColor }]}>
                  {headerIcon}
              </View>
          )}

          <Animated.Text 
            entering={FadeInUp.delay(50).duration(200)}
            style={styles.modalTitle}
          >
            {title}
          </Animated.Text>
          
          {subtitle && (
            <Animated.Text 
                entering={FadeInUp.delay(100).duration(200)}
                style={styles.modalSubtitle}
            >
                {subtitle}
            </Animated.Text>
          )}
          
          {children && (
            <View style={styles.contentContainer}>
                {children}
            </View>
          )}

          {/* Button Row */}
          <View style={styles.buttonRow}>
            {/* Cancel Button */}
            <Animated.View style={[styles.buttonContainer, animatedCancelStyle]}>
              <Pressable 
                style={[styles.button, styles.buttonCancel]} 
                onPress={onClose}
                onPressIn={() => { cancelOpacity.value = withTiming(0.6, { duration: 100 }); }}
                onPressOut={() => { cancelOpacity.value = withTiming(1, { duration: 150 }); }}
              >
                <Text style={styles.textCancel}>{cancelLabel}</Text>
              </Pressable>
            </Animated.View>
            
            {/* Action Button */}
            {onSave && (
                <Animated.View style={[styles.buttonContainer, animatedSaveStyle]}>
                  <Pressable 
                      style={[
                          styles.button, 
                          styles.buttonSave,
                          { backgroundColor: primaryColor } 
                      ]} 
                      onPress={onSave}
                      onPressIn={() => { saveOpacity.value = withTiming(0.7, { duration: 100 }); }}
                      onPressOut={() => { saveOpacity.value = withTiming(1, { duration: 150 }); }}
                  >
                      <Text style={styles.textSave}>{saveLabel}</Text>
                  </Pressable>
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
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    paddingTop: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  iconContainer: {
      marginBottom: 16,
      padding: 14,
      borderRadius: 16,
  },
  modalTitle: {
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  contentContainer: {
    width: '100%',
    marginBottom: 20,
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
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: '#F3F4F6',
  },
  buttonSave: {
    // backgroundColor set inline based on variant
  },
  textCancel: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 15,
  },
  textSave: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});
