import i18n from '../i18n';

/**
 * Formats a date string or object into a localized string.
 * Format: "Weekday, Month Day" (e.g., "Tue, Dec 9" or "Sel, Des 9")
 * Uses the current i18n language setting.
 */
export const formatDate = (date: string | Date, currLang?: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Map internal language codes to standard locale codes
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'id': 'id-ID',
  };

  const currentLang = currLang || i18n.language || 'en';
  const locale = localeMap[currentLang] || 'en-US';

  return dateObj.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

/**
 * Formats a date string or object into a localized time string.
 * Format: "HH:MM AM/PM"
 */
export const formatTime = (date: string | Date, currLang?: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'id': 'id-ID',
  };

  const currentLang = currLang || i18n.language || 'en';
  const locale = localeMap[currentLang] || 'en-US';

  return dateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};
