import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

// Storage keys
const VOICE_BUTTON_POSITION_KEY = 'voice-button-position';

export type VoiceButtonPosition = 'left' | 'right';

// Event listeners for cross-component updates
type Listener = (position: VoiceButtonPosition) => void;
const listeners = new Set<Listener>();

const notifyListeners = (position: VoiceButtonPosition) => {
    listeners.forEach(listener => listener(position));
};

export interface UseSettingsResult {
    voiceButtonPosition: VoiceButtonPosition;
    setVoiceButtonPosition: (position: VoiceButtonPosition) => Promise<void>;
    isLoading: boolean;
}

/**
 * Custom hook to manage app settings persisted in AsyncStorage
 * Uses event-based updates for reactive changes across components
 */
export function useSettings(): UseSettingsResult {
    const [voiceButtonPosition, setVoiceButtonPositionState] = useState<VoiceButtonPosition>('right');
    const [isLoading, setIsLoading] = useState(true);
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Load settings on mount
    useEffect(() => {
        loadSettings();
        
        // Subscribe to changes from other components
        const handleChange = (position: VoiceButtonPosition) => {
            setVoiceButtonPositionState(position);
        };
        
        listeners.add(handleChange);
        
        return () => {
            listeners.delete(handleChange);
        };
    }, []);

    const loadSettings = async () => {
        try {
            const storedPosition = await AsyncStorage.getItem(VOICE_BUTTON_POSITION_KEY);
            if (storedPosition === 'left' || storedPosition === 'right') {
                if (isMountedRef.current) {
                    setVoiceButtonPositionState(storedPosition);
                }
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    };

    const setVoiceButtonPosition = useCallback(async (position: VoiceButtonPosition) => {
        try {
            await AsyncStorage.setItem(VOICE_BUTTON_POSITION_KEY, position);
            setVoiceButtonPositionState(position);
            // Notify all listeners including HomeScreen
            notifyListeners(position);
        } catch (error) {
            console.error('Failed to save voice button position:', error);
            throw error;
        }
    }, []);

    return {
        voiceButtonPosition,
        setVoiceButtonPosition,
        isLoading,
    };
}
