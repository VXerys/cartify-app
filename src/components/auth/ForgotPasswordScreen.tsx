import { Layout } from '@/src/constants/Layout';
import { validateEmail } from '@/src/types/auth';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface ForgotPasswordScreenProps {
  onSendReset: (email: string) => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
}

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

  if (isSuccess) {
    return (
      <View style={styles.container}>
        {/* Premium Gradient Background */}
        <View style={styles.backgroundContainer}>
          <View style={styles.gradientOverlay} />
          
          {/* Group 1: Top Right (Large Teal) */}
          <View style={[styles.meshGradient, styles.meshGradient1]} />
          <View style={[styles.glowOrb, styles.glowOrb1]} />

          {/* Group 2: Bottom Left (Medium Emerald) */}
          <View style={[styles.meshGradient, styles.meshGradient2]} />
          <View style={[styles.glowOrb, styles.glowOrb2]} />

          {/* Group 3: Top Left (Small Blue Accent) */}
          <View style={[styles.meshGradient, styles.meshGradient3]} />
          <View style={[styles.glowOrb, styles.glowOrb3]} />
        </View>

        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <View style={styles.successContent}>
          <Animated.View 
            entering={FadeInUp.duration(500)}
            style={styles.successIconContainer}
          >
            <Ionicons name="mail-open" size={48} color="#FFFFFF" />
          </Animated.View>

          <Animated.Text 
            entering={FadeInUp.delay(200).duration(500)}
            style={styles.successTitle}
          >
            Check Your Email
          </Animated.Text>

          <Animated.Text 
            entering={FadeInUp.delay(300).duration(500)}
            style={styles.successDescription}
          >
            We've sent a password reset link to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Animated.Text>

          <Animated.View 
            entering={FadeIn.delay(500).duration(400)}
            style={styles.successActions}
          >
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={onBackToLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.backToLoginButtonText}>Back to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => onSendReset(email)}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.resendButtonText}>
                Didn't receive? Resend
              </Text>
            </TouchableOpacity>
          </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Premium Gradient Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.gradientOverlay} />
        
        {/* Group 1: Top Right (Large Teal) */}
        <View style={[styles.meshGradient, styles.meshGradient1]} />
        <View style={[styles.glowOrb, styles.glowOrb1]} />

        {/* Group 2: Bottom Left (Medium Emerald) */}
        <View style={[styles.meshGradient, styles.meshGradient2]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />

        {/* Group 3: Top Left (Small Blue Accent) */}
        <View style={[styles.meshGradient, styles.meshGradient3]} />
        <View style={[styles.glowOrb, styles.glowOrb3]} />
      </View>

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
              No worries! Enter your email address and we'll send you a link to reset your password.
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
              <View style={[
                styles.inputContainer,
                error && styles.inputError
              ]}>
                <Ionicons name="mail-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
                <TextInput
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
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
            </View>

            {/* Send Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.buttonDisabled]}
              onPress={handleSendReset}
              activeOpacity={0.8}
              disabled={isLoading}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2332',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A2332',
  },
  meshGradient: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  // Group 1: Top Right
  meshGradient1: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(42, 157, 143, 0.12)',
    position: 'absolute',
    top: -width * 0.2,
    right: -width * 0.2,
  },
  glowOrb1: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(42, 157, 143, 0.3)',
    position: 'absolute',
    top: (width * 0.35) - 60 - (width * 0.2),
    right: (width * 0.35) - 60 - (width * 0.2),
    shadowColor: '#2A9D8F',
    shadowRadius: 60,
    elevation: 20,
  },
  // Group 2: Bottom Left
  meshGradient2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    position: 'absolute',
    bottom: -width * 0.1,
    left: -width * 0.2,
  },
  glowOrb2: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    position: 'absolute',
    bottom: (width * 0.3) - 50 - (width * 0.1),
    left: (width * 0.3) - 50 - (width * 0.2),
    shadowColor: '#10B981',
    shadowRadius: 50,
    elevation: 15,
  },
  // Group 3: Top Left Accent
  meshGradient3: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    position: 'absolute',
    top: height * 0.1,
    left: -width * 0.15,
  },
  glowOrb3: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    position: 'absolute',
    top: (height * 0.1) + (width * 0.2) - 30,
    left: (-width * 0.15) + (width * 0.2) - 30,
    shadowColor: '#3B82F6',
    shadowRadius: 30,
    elevation: 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Layout.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
  },
  resetButton: {
    backgroundColor: Layout.colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  // Success state styles
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: Layout.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  emailHighlight: {
    color: Layout.colors.primary,
    fontWeight: '600',
  },
  successActions: {
    width: '100%',
    alignItems: 'center',
  },
  backToLoginButton: {
    backgroundColor: Layout.colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  backToLoginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  resendButton: {
    paddingVertical: 12,
  },
  resendButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
