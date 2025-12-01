import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { colors } from '@/theme/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  bg?: string; // Optional custom background color override
  style?: ViewStyle;
}

/**
 * Komponen Pembungkus Layar (Layout Utility)
 * Menangani SafeArea (Notch/Dynamic Island) dan KeyboardAvoidingView secara otomatis.
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  bg = colors.background.light, // Default ke background light dari theme
  style
}) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={bg} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
