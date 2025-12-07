import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '../ui/icon-symbol';

interface VoiceButtonProps {
    isListening: boolean;
    onPress: () => void;
}

export function VoiceButton({ isListening, onPress }: VoiceButtonProps) {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.container, { bottom: insets.bottom + 100 }]}>
            <TouchableOpacity 
                style={[
                    styles.button, 
                    isListening && styles.listeningButton
                ]} 
                onPress={onPress}
                activeOpacity={0.8}
            >
                <IconSymbol 
                    name={isListening ? "waveform" : "mic.fill"} 
                    size={32} 
                    color="#FFFFFF" 
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        right: 20,
        alignItems: 'center',
        zIndex: 100,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#81BFBC', // Black button per design
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    listeningButton: {
        backgroundColor: '#FF6B6B',
        transform: [{ scale: 1.1 }],
        shadowColor: "#FF6B6B",
    },
});
