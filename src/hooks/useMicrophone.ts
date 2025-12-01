import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert, Linking } from 'react-native';

/**
 * Hook untuk mengelola izin Mikrofon
 * Mengembalikan status izin dan fungsi untuk meminta izin jika belum diberikan.
 */
export const useMicrophone = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const checkPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  };

  const requestPermission = async () => {
    try {
      const { status, canAskAgain } = await Audio.requestPermissionsAsync();

      if (status === 'granted') {
        setHasPermission(true);
        return true;
      }

      if (!canAskAgain) {
        Alert.alert(
          'Izin Mikrofon Diperlukan',
          'Aplikasi ini membutuhkan akses mikrofon untuk fitur perintah suara. Silakan aktifkan di Pengaturan.',
          [
            { text: 'Batal', style: 'cancel' },
            { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() },
          ]
        );
      }

      return false;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    hasPermission,
    requestPermission,
  };
};
