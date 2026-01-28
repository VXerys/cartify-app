import { Layout } from '@/src/constants/Layout';
import { validateEmail } from '@/src/types/auth';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import * as RN from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
const { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } = RN;

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  isLoading?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onGoogleLogin,
  onForgotPassword,
  onRegister,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onLogin(email, password);
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Gradient Background */}
      <View style={styles.backgroundContainer}>
        {/* Main gradient overlay */}
        <View style={styles.gradientOverlay} />
        
        {/* Aligned mesh gradients with orbs */}
        <View style={[styles.meshGradient, styles.meshGradient1]} />
        <View style={[styles.meshGradient, styles.meshGradient2]} />
        <View style={[styles.meshGradient, styles.meshGradient3]} />
        
        {/* Glowing orbs - Strategically positioned */}
        <View style={[styles.glowOrb, styles.glowOrb1]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />
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
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue shopping</Text>
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
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
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
                    placeholder="Enter your password"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: undefined });
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
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                style={styles.forgotPasswordButton}
                onPress={onForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.loginButtonText}>Signing in...</Text>
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
              </View>

              {/* Google Login */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={onGoogleLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Register Link */}
            <Animated.View 
              entering={FadeIn.delay(500).duration(400)}
              style={styles.registerContainer}
            >
              <Text style={styles.registerText}>Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={onRegister} disabled={isLoading}>
                <Text style={styles.registerLink}>Sign Up</Text>
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
    opacity: 0.5,
  },
  meshGradient1: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(42, 157, 143, 0.12)',
    top: -width * 0.3,
    right: -width * 0.25,
    transform: [{ rotate: '45deg' }],
  },
  meshGradient2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    bottom: -width * 0.15,
    left: -width * 0.25,
    transform: [{ rotate: '-30deg' }],
  },
  meshGradient3: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    top: height * 0.35,
    right: -width * 0.2,
    transform: [{ rotate: '15deg' }],
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowOrb1: {
    width: width * 0.45,
    height: width * 0.45,
    backgroundColor: 'rgba(42, 157, 143, 0.25)',
    top: -width * 0.15,
    right: -width * 0.05,
    shadowColor: '#2A9D8F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 80,
    elevation: 20,
  },
  glowOrb2: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
    bottom: -width * 0.05,
    left: -width * 0.1,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 70,
    elevation: 18,
  },
  glowOrb3: {
    width: width * 0.35,
    height: width * 0.35,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    top: height * 0.4,
    right: -width * 0.08,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 15,
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: -20,
    marginTop: -25,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
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
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Layout.colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: Layout.colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    // Note: Removed elevation to fix shadow artifact during animation on Android
    borderWidth: 1,
    borderColor: 'rgba(42, 157, 143, 0.8)',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  registerLink: {
    fontSize: 14,
    color: Layout.colors.primary,
    fontWeight: '700',
  },
});
