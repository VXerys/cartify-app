import { Layout } from '@/src/constants/Layout';
import { validateEmail, validateFullName, validatePassword } from '@/src/types/auth';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
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
import { LegalModal } from './LegalModal';

const { width, height } = Dimensions.get('window');

interface RegisterScreenProps {
  onRegister: (fullName: string, email: string, password: string) => void;
  onGoogleRegister: () => void;
  onLogin: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Password strength calculation
type PasswordStrength = 'weak' | 'medium' | 'strong';

interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number;
  label: string;
  color: string;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  let strength: PasswordStrength = 'weak';
  let label = 'Weak';
  let color = '#EF4444';
  let score = metRequirements;

  if (metRequirements >= 4) {
    strength = 'strong';
    label = 'Strong';
    color = '#10B981';
  } else if (metRequirements >= 3) {
    strength = 'medium';
    label = 'Medium';
    color = '#F59E0B';
  }

  return { strength, score, label, color, requirements };
};

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

    // Check terms agreement
    if (!agreedToTerms) {
      // We'll handle this visually, not as a form error
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

  // Password strength indicator component
  const PasswordStrengthIndicator = () => {
    if (!password) return null;

    const { strength, label, color, requirements } = passwordStrength;
    const barWidth = strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%';

    return (
      <Animated.View 
        entering={FadeIn.duration(300)} 
        style={styles.strengthContainer}
      >
        {/* Strength Bar */}
        <View style={styles.strengthBarContainer}>
          <View 
            style={[
              styles.strengthBar, 
              { width: barWidth as any, backgroundColor: color }
            ]} 
          />
        </View>
        
        {/* Strength Label */}
        <View style={styles.strengthLabelRow}>
          <Text style={[styles.strengthLabel, { color }]}>{label}</Text>
        </View>

        {/* Requirements Checklist */}
        <View style={styles.requirementsContainer}>
          <View style={styles.requirementRow}>
            <Ionicons 
              name={requirements.minLength ? "checkmark-circle" : "ellipse-outline"} 
              size={14} 
              color={requirements.minLength ? '#10B981' : 'rgba(255,255,255,0.4)'} 
            />
            <Text style={[
              styles.requirementText,
              requirements.minLength && styles.requirementMet
            ]}>
              At least 8 characters
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons 
              name={requirements.hasUppercase ? "checkmark-circle" : "ellipse-outline"} 
              size={14} 
              color={requirements.hasUppercase ? '#10B981' : 'rgba(255,255,255,0.4)'} 
            />
            <Text style={[
              styles.requirementText,
              requirements.hasUppercase && styles.requirementMet
            ]}>
              One uppercase letter
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons 
              name={requirements.hasLowercase ? "checkmark-circle" : "ellipse-outline"} 
              size={14} 
              color={requirements.hasLowercase ? '#10B981' : 'rgba(255,255,255,0.4)'} 
            />
            <Text style={[
              styles.requirementText,
              requirements.hasLowercase && styles.requirementMet
            ]}>
              One lowercase letter
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons 
              name={requirements.hasNumber ? "checkmark-circle" : "ellipse-outline"} 
              size={14} 
              color={requirements.hasNumber ? '#10B981' : 'rgba(255,255,255,0.4)'} 
            />
            <Text style={[
              styles.requirementText,
              requirements.hasNumber && styles.requirementMet
            ]}>
              One number
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Premium Gradient Background */}
      <View style={styles.backgroundContainer}>
        {/* Main gradient overlay */}
        <View style={styles.gradientOverlay} />
        
        {/* Animated mesh gradient effect */}
        <View style={[styles.meshGradient, styles.meshGradient1]} />
        <View style={[styles.meshGradient, styles.meshGradient2]} />
        <View style={[styles.meshGradient, styles.meshGradient3]} />
        
        {/* Subtle grid pattern overlay */}
        <View style={styles.gridPattern}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.gridLineHorizontal, { top: `${(i + 1) * 12.5}%` }]} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.gridLineVertical, { left: `${(i + 1) * 16.66}%` }]} />
          ))}
        </View>
        
        {/* Glowing orbs */}
        <View style={[styles.glowOrb, styles.glowOrb1]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />
        <View style={[styles.glowOrb, styles.glowOrb3]} />
      </View>

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
            <View style={styles.logoContainer}>
              <Ionicons name="cart" size={36} color="#FFFFFF" />
            </View>
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
              <PasswordStrengthIndicator />
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
            <TouchableOpacity onPress={onLogin} disabled={isLoading}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Legal Modal */}
      <LegalModal
        visible={legalModalVisible}
        type={legalModalType}
        onClose={() => setLegalModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  // Premium Background Styles
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
  },
  meshGradient: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
  },
  meshGradient1: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: 'rgba(42, 157, 143, 0.15)',
    top: '-30%',
    right: '-40%',
    transform: [{ rotate: '45deg' }],
  },
  meshGradient2: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    bottom: '10%',
    left: '-30%',
    transform: [{ rotate: '-30deg' }],
  },
  meshGradient3: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    top: '40%',
    right: '-20%',
    transform: [{ rotate: '15deg' }],
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowOrb1: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(42, 157, 143, 0.25)',
    top: -50,
    right: -50,
    shadowColor: '#2A9D8F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 80,
    elevation: 20,
  },
  glowOrb2: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    bottom: height * 0.3,
    left: -40,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 15,
  },
  glowOrb3: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    bottom: 100,
    right: 50,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Layout.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
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
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 54,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  inputSuccess: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
  },
  successText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 6,
    marginLeft: 4,
  },
  // Password Strength Styles
  strengthContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  strengthBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '48%',
  },
  requirementText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  requirementMet: {
    color: '#10B981',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  checkboxTouchable: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Layout.colors.primary,
    borderColor: Layout.colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  termsLink: {
    color: Layout.colors.primary,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: Layout.colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dividerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  loginLink: {
    fontSize: 14,
    color: Layout.colors.primary,
    fontWeight: '700',
  },
});
