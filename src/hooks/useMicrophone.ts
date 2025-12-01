/**
 * useMicrophone Hook
 * Permission handling untuk audio recording
 */

import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export interface MicrophonePermission {
  granted: boolean;
  canAskAgain: boolean;
  status: 'undetermined' | 'granted' | 'denied';
}

export interface UseMicrophoneReturn {
  /**
   * Status permission saat ini
   */
  permission: MicrophonePermission;
  
  /**
   * Apakah sedang loading request permission
   */
  isLoading: boolean;
  
  /**
   * Request audio recording permission
   */
  requestPermission: () => Promise<boolean>;
  
  /**
   * Check permission status tanpa request
   */
  checkPermission: () => Promise<MicrophonePermission>;
}

/**
 * Hook untuk manage microphone permissions
 * Menggunakan expo-av Audio API
 * 
 * Usage:
 * ```tsx
 * const { permission, requestPermission } = useMicrophone();
 * 
 * if (!permission.granted) {
 *   await requestPermission();
 * }
 * ```
 */
export function useMicrophone(): UseMicrophoneReturn {
  const [permission, setPermission] = useState<MicrophonePermission>({
    granted: false,
    canAskAgain: true,
    status: 'undetermined',
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Check permission status saat hook pertama kali dimount
   */
  useEffect(() => {
    checkPermission();
  }, []);

  /**
   * Check current permission status
   */
  const checkPermission = async (): Promise<MicrophonePermission> => {
    try {
      const { status, canAskAgain } = await Audio.getPermissionsAsync();
      
      const permissionState: MicrophonePermission = {
        granted: status === 'granted',
        canAskAgain,
        status: status as MicrophonePermission['status'],
      };
      
      setPermission(permissionState);
      return permissionState;
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }
  };

  /**
   * Request audio recording permission
   * Returns true jika granted, false jika denied
   */
  const requestPermission = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Di Android, perlu set audio mode dulu
      if (Platform.OS === 'android') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      }

      const { status, canAskAgain } = await Audio.requestPermissionsAsync();
      
      const permissionState: MicrophonePermission = {
        granted: status === 'granted',
        canAskAgain,
        status: status as MicrophonePermission['status'],
      };
      
      setPermission(permissionState);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      setPermission({
        granted: false,
        canAskAgain: false,
        status: 'denied',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permission,
    isLoading,
    requestPermission,
    checkPermission,
  };
}

/**
 * Helper hook untuk simple permission check
 * Returns true/false langsung tanpa detail status
 */
export function useMicrophonePermission(): {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
} {
  const { permission, requestPermission } = useMicrophone();
  
  return {
    hasPermission: permission.granted,
    requestPermission,
  };
}
