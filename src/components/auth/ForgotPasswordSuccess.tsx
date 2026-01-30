import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ForgotPasswordBackground } from './ForgotPasswordBackground';
import { styles } from './ForgotPasswordScreen.styles';

interface ForgotPasswordSuccessProps {
  email: string;
  onBackToLogin: () => void;
  onResend: () => void;
  isLoading?: boolean;
}

export const ForgotPasswordSuccess: React.FC<ForgotPasswordSuccessProps> = ({
  email,
  onBackToLogin,
  onResend,
  isLoading = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Premium Gradient Background */}
      <ForgotPasswordBackground />

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
            {`We've sent a password reset link to`}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(350).duration(500)}
            style={styles.emailHighlight}
          >
            {email}
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
              onPress={onResend}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.resendButtonText}>
                {`Didn't receive? Resend`}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};
