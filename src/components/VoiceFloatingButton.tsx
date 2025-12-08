import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
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
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function VoiceFloatingButton({ isListening, isProcessing, onPress }: VoiceFloatingButtonProps) {
  // Shared values
  const expandWidth = useSharedValue(60);
  const recordingOpacity = useSharedValue(1); 
  const buttonColor = useSharedValue(0); // 0: Idle, 1: Listening, 2: Processing, 3: Hidden
  const uiState = useSharedValue<'visible' | 'hidden'>('visible');
  const translateX = useSharedValue(0);

  // Auto-hide timer logic
  useEffect(() => {
    // Only auto-hide if we are in the initial idle state and not currently active
    if (!isListening && !isProcessing && uiState.value === 'visible') {
      const timer = setTimeout(() => {
        // Trigger generic "hide" animation
        uiState.value = 'hidden';
        translateX.value = withSpring(44, { // Leave about 16px visible (60 - 16 = 44)
            damping: 15,
            stiffness: 90
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isListening, isProcessing]);

  // Handle Listening/Processing State Changes
  useEffect(() => {
    if (isListening) {
      // Force Visible
      uiState.value = 'visible';
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
      uiState.value = 'visible';
      translateX.value = withSpring(0);

      expandWidth.value = withSpring(140, { damping: 18, stiffness: 120 });
      recordingOpacity.value = withTiming(1);
      buttonColor.value = withTiming(2, { duration: 300 });
    } else {
      // Idle state - revert to small pill
      expandWidth.value = withSpring(60, { damping: 18, stiffness: 120 });
      recordingOpacity.value = withTiming(1);
      buttonColor.value = withTiming(0, { duration: 300 });
    }
  }, [isListening, isProcessing]);

  const handlePress = () => {
    if (uiState.value === 'hidden') {
      // Reveal
      uiState.value = 'visible';
      translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
      // Reset auto-hide timer? Optional. For now, let it stick until user interacts or code decides.
    } else {
      // Normal Action
      onPress();
    }
  };

  const rContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      buttonColor.value,
      [0, 1, 2],
      ['#2A9D8F', '#E76F51', '#264653'] // Teal (Idle), Burnt Orange (Listening - more urgent/active), Dark Blue (Processing)
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
      // The handle (line) is clearer when hidden to indicate interactivity
      return {
          opacity: withTiming(uiState.value === 'hidden' ? 1 : 0.6),
          height: withSpring(uiState.value === 'hidden' ? 24 : 12),
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
    <View style={styles.positionContainer}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={isProcessing}
      >
        <Animated.View style={[styles.buttonContainer, rContainerStyle]}>
            
          {/* Decorative Drag Handle (Vertical Line) */}
          <View style={styles.handleContainer}>
             <Animated.View style={[styles.handleBar, rHandleStyle]} />
          </View>

          <View style={styles.contentContainer}>
             {/* Icon Section */}
             <View style={styles.iconWrapper}>
                 <Ionicons 
                    name={getIconName()} 
                    size={24} // Slightly smaller for premium look
                    color="#FFF" 
                 />
                 {/* Red recording dot overlay check */}
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
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  positionContainer: {
    position: 'absolute',
    bottom: 220, 
    right: 0,
    zIndex: 999,
    // Enhanced Premium Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonContainer: {
    height: 56, // Taller for better touch target and presence
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    borderWidth: 1, // Subtle border for premium feel
    borderColor: 'rgba(255,255,255,0.1)',
  },
  handleContainer: {
      width: 14,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 4,
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
  },
  iconWrapper: {
      width: 30, // Adjusted compact width
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
      backgroundColor: '#FFF', // White dot on orange background looks cleaner
      borderWidth: 2,
      borderColor: '#E76F51', 
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase', // Premium touch
  },
  spinner: {
    marginLeft: 8,
  }
});
