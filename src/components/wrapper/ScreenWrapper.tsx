/**
 * ScreenWrapper Component
 * Layout utility untuk prevent repetitive code di setiap screen
 */

import { colors } from '@/src/theme/colors';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ViewStyle,
} from 'react-native';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /**
   * Background color key dari design system
   * Default: 'background.light'
   */
  bg?: string;
  /**
   * Apakah menggunakan SafeAreaView
   * Default: true
   */
  useSafeArea?: boolean;
  /**
   * Apakah menggunakan KeyboardAvoidingView
   * Default: true
   */
  avoidKeyboard?: boolean;
  /**
   * Custom style untuk override
   */
  style?: ViewStyle;
  /**
   * StatusBar style
   */
  statusBarStyle?: 'light-content' | 'dark-content';
}

/**
 * ScreenWrapper - Wrapper component untuk konsistensi layout
 * 
 * Features:
 * - SafeAreaView untuk Android/iOS notch handling
 * - KeyboardAvoidingView untuk auto-scroll saat keyboard muncul
 * - Integrasi dengan Design System colors
 * - Configurable status bar
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  bg = 'background.light',
  useSafeArea = true,
  avoidKeyboard = true,
  style,
  statusBarStyle = 'dark-content',
}) => {
  // Resolve background color dari design system
  const backgroundColor = resolveColor(bg);

  // Wrapper content
  const content = (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      {children}
    </>
  );

  // Base container style
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    ...style,
  };

  // Jika tidak pakai safe area dan keyboard avoiding, return langsung
  if (!useSafeArea && !avoidKeyboard) {
    return <SafeAreaView style={containerStyle}>{content}</SafeAreaView>;
  }

  // Render dengan SafeAreaView
  const safeContent = useSafeArea ? (
    <SafeAreaView style={containerStyle}>{content}</SafeAreaView>
  ) : (
    <SafeAreaView style={containerStyle}>{content}</SafeAreaView>
  );

  // Render dengan KeyboardAvoidingView jika enabled
  if (avoidKeyboard) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {safeContent}
      </KeyboardAvoidingView>
    );
  }

  return safeContent;
};

/**
 * Helper function untuk resolve color dari string path
 * Supports nested paths seperti 'background.light' atau 'primary.DEFAULT'
 */
function resolveColor(colorPath: string): string {
  // Split path by dot
  const keys = colorPath.split('.');
  
   
  let value: any = colors;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback jika path tidak valid
      console.warn(`Color path '${colorPath}' tidak ditemukan, fallback ke white`);
      return '#FFFFFF';
    }
  }
  
  // Pastikan return string color
  return typeof value === 'string' ? value : '#FFFFFF';
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
});
