import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
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
}

export function VoiceFloatingButton({ isListening, isProcessing, onPress }: VoiceFloatingButtonProps) {
  // Shared values
  const expandWidth = useSharedValue(60);
  // Replaced dizzying scale pulse with a subtle opacity pulse for the recording indicator
  const recordingOpacity = useSharedValue(1); 
  const buttonColor = useSharedValue(0); // 0: Idle, 1: Listening, 2: Processing

  useEffect(() => {
    if (isListening) {
      // Smooth expansion
      expandWidth.value = withSpring(150, { damping: 18, stiffness: 120 });
      // Gentle breathing animation for opacity only, not scale
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
      expandWidth.value = withSpring(140, { damping: 18, stiffness: 120 });
      recordingOpacity.value = withTiming(1);
      buttonColor.value = withTiming(2, { duration: 300 });
    } else {
      expandWidth.value = withSpring(60, { damping: 18, stiffness: 120 });
      recordingOpacity.value = withTiming(1);
      buttonColor.value = withTiming(0, { duration: 300 });
    }
  }, [isListening, isProcessing]);

  const rContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      buttonColor.value,
      [0, 1, 2],
      ['#2A9D8F', '#264653', '#2A9D8F'] // Teal (Idle), Darker Teal (Listening/Processing - Keeps it professional)
    );

    return {
      width: expandWidth.value,
      backgroundColor: backgroundColor,
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
        onPress={onPress}
        activeOpacity={0.9} // Less jarring opacity change on press
        disabled={isProcessing}
      >
        <Animated.View style={[styles.buttonContainer, rContainerStyle]}>
            
          <View style={styles.contentContainer}>
             {/* Icon Section */}
             <View style={styles.iconWrapper}>
                 <Ionicons 
                    name={getIconName()} 
                    size={26} 
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
    bottom: 220, // Adjusted to sit just above the navbar (approx 80-90px height + margin)
    right: 0,
    zIndex: 999,
    // Add distinct shadow for floating effect without scaling
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonContainer: {
    height: 52, // Slightly more compact
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 26,
    borderTopRightRadius: 0, // Docked to right
    borderBottomRightRadius: 0, // Docked to right
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 14,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
  },
  recordingDot: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#FF5252', // Bright red dot for clear "Recording" status
      borderWidth: 1.5,
      borderColor: '#264653', // Matches the dark background for contrast
  },
  statusText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  spinner: {
    marginLeft: 8,
  }
});
