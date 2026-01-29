import { validateEmail, validateFullName, validatePassword } from '@/src/types/auth';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Image,
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
import { LegalModal } from './LegalModal';
import { PasswordStrengthIndicator } from './PasswordStrength';
import { calculatePasswordStrength } from './passwordStrength.util';
import { RegisterBackground } from './RegisterBackground';
import { styles } from './RegisterScreen.styles';
import { FormErrors, RegisterScreenProps } from './RegisterScreen.types';

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onGoogleRegister,
  onLogin,
  isLoading = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Legal modal state
  const [legalModalVisible, setLegalModalVisible] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy'>('terms');

  // Calculate password strength
  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Open legal modal
  const openLegalModal = (type: 'terms' | 'privacy') => {
    setLegalModalType(type);
    setLegalModalVisible(true);
  };

  const handleRegister = () => {
    const newErrors: FormErrors = {};

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!validateFullName(fullName)) {
      newErrors.fullName = 'Please enter a valid name (min 2 characters)';
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      } else if (passwordStrength.strength === 'weak') {
        newErrors.password = 'Password is too weak. Add more characters or symbols.';
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && agreedToTerms) {
      onRegister(fullName, email, password);
    }
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Gradient Background */}
      <RegisterBackground />

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
            {/* Header */}
            <Animated.View 
              entering={FadeInUp.delay(100).duration(500)}
              style={styles.header}
            >
              <Image 
                source={require('@/assets/images/cartify-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.subtitle}>Start your shopping journey</Text>
            </Animated.View>

            {/* Form */}
            <Animated.View 
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.formContainer}
            >
              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={[
                  styles.inputContainer,
                  errors.fullName && styles.inputError
                ]}>
                  <Ionicons name="person-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
                  <TextInput
                    testID="register-fullname-input"
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#6B7280"
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      clearError('fullName');
                    }}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                  {fullName.length >= 2 && validateFullName(fullName) && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  )}
                </View>
                {errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[
                  styles.inputContainer,
                  errors.email && styles.inputError
                ]}>
                  <Ionicons name="mail-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
                  <TextInput
                    testID="register-email-input"
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      clearError('email');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  {email.length > 0 && validateEmail(email) && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  )}
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[
                  styles.inputContainer,
                  errors.password && styles.inputError
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
                  <TextInput
                    testID="register-password-input"
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearError('password');
                    }}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#9BA1A6" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                {/* Password Strength Indicator */}
                <PasswordStrengthIndicator result={password ? passwordStrength : null} />
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[
                  styles.inputContainer,
                  errors.confirmPassword && styles.inputError,
                  confirmPassword.length > 0 && password === confirmPassword && styles.inputSuccess
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
                  <TextInput
                    testID="register-confirm-password-input"
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#6B7280"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      clearError('confirmPassword');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#9BA1A6" 
                    />
                  </TouchableOpacity>
                  {confirmPassword.length > 0 && password === confirmPassword && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginLeft: 8 }} />
                  )}
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
                {confirmPassword.length > 0 && password === confirmPassword && (
                  <Text style={styles.successText}>Passwords match!</Text>
                )}
              </View>

              {/* Terms Checkbox */}
              <View style={styles.termsContainer}>
                <TouchableOpacity 
                  style={styles.checkboxTouchable}
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                  testID="register-terms-checkbox"
                  accessibilityLabel="Agree to Terms"
                >
                  <View style={[
                    styles.checkbox,
                    agreedToTerms && styles.checkboxChecked
                  ]}>
                    {agreedToTerms && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text 
                    style={styles.termsLink}
                    onPress={() => openLegalModal('terms')}
                  >
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text 
                    style={styles.termsLink}
                    onPress={() => openLegalModal('privacy')}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton, 
                  (isLoading || !agreedToTerms || passwordStrength.strength === 'weak') && styles.buttonDisabled
                ]}
                onPress={handleRegister}
                activeOpacity={0.8}
                disabled={isLoading || !agreedToTerms}
                testID="register-submit"
                accessibilityLabel="Create Account"
              >
                {isLoading ? (
                  <Text style={styles.registerButtonText}>Creating account...</Text>
                ) : (
                  <Text style={styles.registerButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.divider} />
              </View>

              {/* Google Register */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={onGoogleRegister}
                activeOpacity={0.8}
                disabled={isLoading}
                testID="register-google"
                accessibilityLabel="Continue with Google"
              >
                <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <Animated.View 
              entering={FadeIn.delay(500).duration(400)}
              style={styles.loginContainer}
            >
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={onLogin}
                disabled={isLoading}
                testID="register-go-login"
                accessibilityLabel="Sign In"
              >
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Legal Modal */}
      <LegalModal
        visible={legalModalVisible}
        type={legalModalType}
        onClose={() => setLegalModalVisible(false)}
      />
    </View>
  );
};
