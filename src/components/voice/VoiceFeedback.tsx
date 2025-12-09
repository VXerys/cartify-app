import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeOutDown,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { IconSymbol } from '../ui/icon-symbol';

const { width } = Dimensions.get('window');

import { Easing } from 'react-native-reanimated';

// ... imports

interface VoiceFeedbackProps {
    isListening: boolean;
    isProcessing?: boolean;
    transcript: string;
    error: string | null;
    onRetry?: () => void;
}

export function VoiceFeedback({ isListening, isProcessing, transcript, error, onRetry }: VoiceFeedbackProps) {
    // If not listening, not processing, and no error, render nothing
    if (!isListening && !isProcessing && !error) return null;

    // Error State
    if (error) {
        return (
            <Animated.View 
                entering={FadeInDown.springify().damping(12)} 
                exiting={FadeOutDown}
                layout={Layout.springify()}
                style={styles.container}
            >
                <TouchableOpacity onPress={onRetry} activeOpacity={0.8}>
                    <View style={styles.errorCard}>
                        <IconSymbol name="xmark.circle.fill" size={24} color="#DC2626" />
                        <Text style={styles.errorText}>{error}</Text>
                        <View style={styles.retryBadge}>
                            <IconSymbol name="arrow.clockwise" size={12} color="#DC2626" />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    // Active State (Listening or Processing)
    const activeText = isProcessing ? "Processing..." : (transcript ? `"${transcript}"` : null);
    const labelText = isProcessing ? "Just a moment" : (transcript ? "I heard:" : "Listening...");

    return (
        <Animated.View 
            entering={FadeInDown.springify().damping(15)} 
            exiting={FadeOutDown}
            layout={Layout.springify()}
            style={styles.container}
        >
            <BlurView intensity={80} tint="dark" style={styles.listeningCard}>
                 {isProcessing ? <ProcessingIcon /> : <PulsingIcon />}
                 <View style={styles.textContainer}>
                    <Text style={styles.listeningLabel}>
                        {labelText}
                    </Text>
                    {activeText && (
                        <Text style={styles.transcriptText} numberOfLines={1}>
                            {activeText}
                        </Text>
                    )}
                 </View>
            </BlurView>
        </Animated.View>
    );
}

function ProcessingIcon() {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }),
            -1,
            false // reset to 0? No, continuous rotation.
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }]
    }));

    return (
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
            <View style={[styles.iconCircle, { backgroundColor: '#0EA5E9' }]}>
                 <IconSymbol name="arrow.clockwise" size={20} color="#FFFFFF" />
            </View>
        </Animated.View>
    );
}

function PulsingIcon() {
// ... existing Pulsing code ...
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.3, { duration: 600 }),
                withTiming(1, { duration: 600 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
            <View style={styles.iconCircle}>
                 <IconSymbol name="waveform" size={20} color="#FFFFFF" />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 120, // Positioned above the FAB area
        alignSelf: 'center',
        zIndex: 1000,
        width: 'auto',
        maxWidth: width * 0.9,
        alignItems: 'center',
    },
    listeningCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30, // Modern pill shape
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 30, 30, 0.85)', // Sleek dark glass
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        minWidth: 180,
    },
    iconContainer: {
        marginRight: 14,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF6B6B', // Consistent accent color
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#FF6B6B",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    textContainer: {
        flexShrink: 1,
        justifyContent: 'center',
    },
    listeningLabel: {
        color: '#A0A0A0', 
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    transcriptText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        maxWidth: 200,
    },
    errorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2', // Soft red background
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#FECACA',
        shadowColor: "#DC2626",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    errorText: {
        color: '#B91C1C',
        marginLeft: 12,
        fontWeight: '600',
        fontSize: 14,
        marginRight: 8,
    },
    retryBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    }
});
