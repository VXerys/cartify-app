import { useResponsive } from '@/src/hooks/useResponsive';
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
  const { moderateScale } = useResponsive();
  
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
          style={[
            styles.modalView,
            {
              borderRadius: moderateScale(24),
              padding: moderateScale(24),
              paddingTop: moderateScale(28),
            }
          ]}
        >
          {/* Clean Header Line */}
          <View style={[styles.headerDecoration, { backgroundColor: primaryColor }]} />
          
          {/* Icon Container */}
          {headerIcon && (
              <View style={[
                styles.iconContainer, 
                { 
                  backgroundColor: lightColor,
                  padding: moderateScale(14),
                  borderRadius: moderateScale(16),
                  marginBottom: moderateScale(16),
                }
              ]}>
                  {headerIcon}
              </View>
          )}

          <Animated.Text 
            entering={FadeInUp.delay(50).duration(200)}
            style={[
              styles.modalTitle,
              {
                fontSize: moderateScale(20),
                marginBottom: moderateScale(8),
              }
            ]}
          >
            {title}
          </Animated.Text>
          
          {subtitle && (
            <Animated.Text 
                entering={FadeInUp.delay(100).duration(200)}
                style={[
                  styles.modalSubtitle,
                  {
                    fontSize: moderateScale(14),
                    lineHeight: moderateScale(20),
                    marginBottom: moderateScale(24),
                    paddingHorizontal: moderateScale(4),
                  }
                ]}
            >
                {subtitle}
            </Animated.Text>
          )}
          
          {children && (
            <View style={[styles.contentContainer, { marginBottom: moderateScale(20) }]}>
                {children}
            </View>
          )}

          {/* Button Row */}
          <View style={[styles.buttonRow, { gap: moderateScale(12) }]}>
            {/* Cancel Button */}
            <Animated.View style={[styles.buttonContainer, animatedCancelStyle]}>
              <Pressable 
                style={[
                  styles.button, 
                  styles.buttonCancel,
                  {
                    borderRadius: moderateScale(14),
                    paddingVertical: moderateScale(14),
                  }
                ]} 
                onPress={onClose}
                onPressIn={() => { cancelOpacity.value = withTiming(0.6, { duration: 100 }); }}
                onPressOut={() => { cancelOpacity.value = withTiming(1, { duration: 150 }); }}
              >
                <Text style={[styles.textCancel, { fontSize: moderateScale(15) }]}>{cancelLabel}</Text>
              </Pressable>
            </Animated.View>
            
            {/* Action Button */}
            {onSave && (
                <Animated.View style={[styles.buttonContainer, animatedSaveStyle]}>
                  <Pressable 
                      style={[
                          styles.button, 
                          styles.buttonSave,
                          { 
                            backgroundColor: primaryColor,
                            borderRadius: moderateScale(14),
                            paddingVertical: moderateScale(14),
                          } 
                      ]} 
                      onPress={onSave}
                      onPressIn={() => { saveOpacity.value = withTiming(0.7, { duration: 100 }); }}
                      onPressOut={() => { saveOpacity.value = withTiming(1, { duration: 150 }); }}
                  >
                      <Text 
                        style={[styles.textSave, { fontSize: moderateScale(15) }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                      >
                        {saveLabel}
                      </Text>
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
      // Responsive styles applied inline
  },
  modalTitle: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    textAlign: 'center',
    color: '#6B7280',
  },
  contentContainer: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
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
  },
  textSave: {
    color: 'white',
    fontWeight: '600',
  },
});

