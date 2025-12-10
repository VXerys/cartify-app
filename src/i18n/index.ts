import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';

const RESOURCES = {
  en: { translation: en },
  id: { translation: id },
};

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem('user-language');
      if (storedLanguage) {
        return callback(storedLanguage);
      }
      
      // Fallback to device locale
      const deviceLang = Localization.getLocales()[0].languageCode;
      // We only support en and id, default to en if other
      if (deviceLang === 'id') {
        return callback('id');
      }
      return callback('en');
    } catch (error) {
      console.log('Error reading language', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR as any)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
        useSuspense: false
    }
  });

export default i18n;
