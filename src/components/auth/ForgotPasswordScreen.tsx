import { validateEmail } from '@/src/types/auth';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ForgotPasswordBackground } from './ForgotPasswordBackground';
import { styles } from './ForgotPasswordScreen.styles';
import { ForgotPasswordScreenProps } from './ForgotPasswordScreen.types';
import { ForgotPasswordSuccess } from './ForgotPasswordSuccess';

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onSendReset,
  onBackToLogin,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendReset = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError(undefined);
    onSendReset(email);
    setIsSuccess(true);
  };

  // Show success screen after email is sent
  if (isSuccess) {
    return (
      <ForgotPasswordSuccess
        email={email}
        onBackToLogin={onBackToLogin}
        onResend={() => onSendReset(email)}
        isLoading={isLoading}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Premium Gradient Background */}
      <ForgotPasswordBackground />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <Animated.View entering={FadeIn.duration(300)}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackToLogin}
                activeOpacity={0.7}
                testID="forgot-back"
                accessibilityLabel="Back to Login"
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>

            {/* Header */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              style={styles.header}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="key" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your email address and we&apos;ll send you a link to reset your password.
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.formContainer}
            >
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputContainer, error && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
                  <TextInput
                    testID="forgot-email-input"
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError(undefined);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    autoFocus
                  />
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              {/* Send Reset Button */}
              <TouchableOpacity
                style={[styles.resetButton, isLoading && styles.buttonDisabled]}
                onPress={handleSendReset}
                activeOpacity={0.8}
                disabled={isLoading}
                testID="forgot-submit"
                accessibilityLabel="Send Reset Link"
              >
                {isLoading ? (
                  <Text style={styles.resetButtonText}>Sending...</Text>
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
