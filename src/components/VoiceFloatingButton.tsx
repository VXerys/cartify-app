import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface VoiceFloatingButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onPress: () => void;
  position?: 'left' | 'right';
}

export function VoiceFloatingButton({ isListening, isProcessing, onPress, position = 'right' }: VoiceFloatingButtonProps) {
  const isLeft = position === 'left';
  
  // React state to track visibility (synced with shared value for proper React lifecycle)
  const [isVisible, setIsVisible] = useState(true);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Shared values for animations
  const expandWidth = useSharedValue(60);
  const recordingOpacity = useSharedValue(1); 
  const buttonColor = useSharedValue(0); // 0: Idle, 1: Listening, 2: Processing
  const translateX = useSharedValue(0);
  const handleVisibility = useSharedValue(0); // 0: visible, 1: hidden (for animated handle)

  // Helper to clear any existing timer
  const clearAutoHideTimer = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  }, []);

  // Helper to show the button with animation
  const showButton = useCallback(() => {
    clearAutoHideTimer();
    setIsVisible(true);
    handleVisibility.value = withTiming(0, { duration: 200 });
    translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, [clearAutoHideTimer, handleVisibility, translateX]);

  // Helper to hide the button with animation
  const hideButton = useCallback(() => {
    setIsVisible(false);
    handleVisibility.value = withTiming(1, { duration: 200 });
    const hideOffset = isLeft ? -44 : 44; // Negative for left, positive for right
    translateX.value = withSpring(hideOffset, {
      damping: 15,
      stiffness: 90
    });
  }, [handleVisibility, isLeft, translateX]);

  // Reset position and restart auto-hide timer when position prop changes
  useEffect(() => {
    // Reset to visible state
    translateX.value = 0;
    setIsVisible(true);
    
    // Start auto-hide timer for the new position
    clearAutoHideTimer();
    if (!isListening && !isProcessing) {
      autoHideTimerRef.current = setTimeout(() => {
        hideButton();
      }, 3000);
    }
    
    return () => clearAutoHideTimer();
  }, [clearAutoHideTimer, hideButton, isListening, isProcessing, position, translateX]);

  // Auto-hide timer logic - triggers when idle and visible
  useEffect(() => {
    clearAutoHideTimer();
    
    // Only auto-hide if idle (not listening and not processing) and currently visible
    if (!isListening && !isProcessing && isVisible) {
      autoHideTimerRef.current = setTimeout(() => {
        hideButton();
      }, 3000);
    }
    
    return () => clearAutoHideTimer();
  }, [clearAutoHideTimer, hideButton, isListening, isProcessing, isVisible]);

  // Handle Listening/Processing State Changes
  useEffect(() => {
    if (isListening) {
      // Force Visible
      showButton();
      translateX.value = withSpring(0, { damping: 15, stiffness: 100 });

      // Expansion
      expandWidth.value = withSpring(150, { damping: 18, stiffness: 120 });
      
      // Pulse Opacity
      recordingOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.quad) }), 
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) })
        ), 
        -1, 
        true
      );
      buttonColor.value = withTiming(1, { duration: 300 });

    } else if (isProcessing) {
      // Force Visible
      showButton();

      expandWidth.value = withSpring(140, { damping: 18, stiffness: 120 });
      recordingOpacity.value = withTiming(1);
      buttonColor.value = withTiming(2, { duration: 300 });
    } else {
      // Idle state - revert to small pill
      expandWidth.value = withSpring(60, { damping: 18, stiffness: 120 });
      recordingOpacity.value = withTiming(1);
      buttonColor.value = withTiming(0, { duration: 300 });
    }
  }, [buttonColor, expandWidth, isListening, isProcessing, recordingOpacity, showButton, translateX]);

  const handlePress = () => {
    // Haptic feedback for button press confirmation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!isVisible) {
      // Reveal the button
      showButton();
    } else {
      // Normal Action - trigger voice recording
      onPress();
    }
  };

  const rContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      buttonColor.value,
      [0, 1, 2],
      ['#2A9D8F', '#E76F51', '#264653']
    );

    return {
      width: expandWidth.value,
      backgroundColor: backgroundColor,
      transform: [{ translateX: translateX.value }]
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isListening || isProcessing ? 1 : 0),
      transform: [
        { translateX: withTiming(isListening || isProcessing ? 0 : 20) }
      ]
    };
  });

  const rHandleStyle = useAnimatedStyle(() => {
      // handleVisibility: 0 = visible, 1 = hidden
      const isHidden = handleVisibility.value > 0.5;
      return {
          opacity: withTiming(isHidden ? 1 : 0.6),
          height: withSpring(isHidden ? 24 : 12),
      }
  })
  
  const rRedDotStyle = useAnimatedStyle(() => {
      return {
          opacity: isListening ? recordingOpacity.value : 0,
          transform: [{ scale: isListening ? 1 : 0 }]
      };
  });

  const getIconName = () => {
    if (isListening) return "mic";
    if (isProcessing) return "hourglass-outline";
    return "mic-outline";
  };

  return (
    <View style={[
      styles.positionContainer,
      isLeft ? styles.positionLeft : styles.positionRight
    ]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={isProcessing}
      >
        <Animated.View style={[
          styles.buttonContainer, 
          isLeft ? styles.buttonContainerLeft : styles.buttonContainerRight,
          rContainerStyle
        ]}>
            
          {/* For RIGHT: [Handle] [Content] - handle visible when hidden */}
          {/* For LEFT: [Content] [Handle] - handle visible when hidden */}
          
          {!isLeft && (
            <View style={styles.handleContainer}>
               <Animated.View style={[styles.handleBar, rHandleStyle]} />
            </View>
          )}

          <View style={[styles.contentContainer, isLeft && styles.contentContainerLeft]}>
             {/* Icon Section */}
             <View style={styles.iconWrapper}>
                 <Ionicons 
                    name={getIconName()} 
                    size={24}
                    color="#FFF" 
                 />
                 {/* Red recording dot overlay */}
                 {isListening && (
                     <Animated.View style={[styles.recordingDot, rRedDotStyle]} />
                 )}
             </View>

            {/* Text Section */}
            {(isListening || isProcessing) && (
              <Animated.Text style={[styles.statusText, rTextStyle]} numberOfLines={1}>
                {isListening ? "Listening..." : "Processing"}
              </Animated.Text>
            )}
            
            {isProcessing && (
              <ActivityIndicator size="small" color="#FFF" style={styles.spinner} />
            )}
          </View>

          {isLeft && (
            <View style={styles.handleContainerLeft}>
               <Animated.View style={[styles.handleBar, rHandleStyle]} />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  positionContainer: {
    position: 'absolute',
    bottom: 220, 
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  positionRight: {
    right: 0,
  },
  positionLeft: {
    left: 0,
  },
  buttonContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonContainerRight: {
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonContainerLeft: {
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  handleContainer: {
      width: 14,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 4,
  },
  handleContainerLeft: {
      width: 14,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 0,
      paddingRight: 4,
  },
  handleBar: {
      width: 4,
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.6)',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
    paddingLeft: 4,
  },
  contentContainerLeft: {
    paddingRight: 4,
    paddingLeft: 16,
  },
  iconWrapper: {
      width: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 6,
  },
  recordingDot: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#FFF',
      borderWidth: 2,
      borderColor: '#E76F51', 
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  spinner: {
    marginLeft: 8,
  }
});
