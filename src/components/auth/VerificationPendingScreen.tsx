import { Layout } from '@/src/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface VerificationPendingScreenProps {
  email: string;
  onResendEmail: () => Promise<void>;
  onBackToLogin: () => void;
  onCheckVerification?: () => void;
}

export const VerificationPendingScreen: React.FC<VerificationPendingScreenProps> = ({
  email,
  onResendEmail,
  onBackToLogin,
  onCheckVerification,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Animation for the email icon
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    // Pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);
  
  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    try {
      await onResendEmail();
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Gradient Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.gradientOverlay} />
        
        {/* Mesh gradients - bottom focused for contrast with icon */}
        <View style={[styles.meshGradient, styles.meshGradient1]} />
        <View style={[styles.meshGradient, styles.meshGradient2]} />
        <View style={[styles.meshGradient, styles.meshGradient3]} />
        
        {/* Glowing orbs - spread out */}
        <View style={[styles.glowOrb, styles.glowOrb1]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(600)}
          style={styles.iconContainer}
        >
          <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
            <View style={styles.iconBackground}>
              <Ionicons name="mail-unread" size={48} color="#FFFFFF" />
            </View>
          </Animated.View>
          
          {/* Decorative rings */}
          <View style={[styles.ring, styles.ring1]} />
          <View style={[styles.ring, styles.ring2]} />
        </Animated.View>

        {/* Title */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.textContainer}
        >
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to
          </Text>
          <Text style={styles.emailText}>{email}</Text>
          <Text style={styles.description}>
            Please check your inbox and click the verification link to activate your account.
          </Text>
        </Animated.View>

        {/* Info Card */}
        <Animated.View 
          entering={FadeIn.delay(500).duration(400)}
          style={styles.infoCard}
        >
          <Ionicons name="information-circle" size={24} color={Layout.colors.primary} />
          <Text style={styles.infoText}>
            Can't find the email? Check your spam or junk folder.
          </Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(500)}
          style={styles.actionsContainer}
        >
          {/* Resend Button */}
          <TouchableOpacity
            style={[
              styles.resendButton,
              (isResending || resendCooldown > 0) && styles.buttonDisabled
            ]}
            onPress={handleResend}
            activeOpacity={0.8}
            disabled={isResending || resendCooldown > 0}
          >
            <Ionicons 
              name="refresh" 
              size={20} 
              color={resendCooldown > 0 ? 'rgba(255,255,255,0.5)' : '#FFFFFF'} 
            />
            <Text style={[
              styles.resendButtonText,
              resendCooldown > 0 && styles.textDisabled
            ]}>
              {isResending 
                ? 'Sending...' 
                : resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend Email'}
            </Text>
          </TouchableOpacity>

          {/* I've Verified Button */}
          {onCheckVerification && (
            <TouchableOpacity
              style={styles.verifiedButton}
              onPress={onCheckVerification}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={20} color={Layout.colors.primary} />
              <Text style={styles.verifiedButtonText}>I've Verified My Email</Text>
            </TouchableOpacity>
          )}

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToLogin}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View 
          entering={FadeIn.delay(800).duration(400)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            Already verified?{' '}
            <Text style={styles.footerLink} onPress={onBackToLogin}>
              Sign in now
            </Text>
          </Text>
        </Animated.View>
      </View>
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
    backgroundColor: 'rgba(42, 157, 143, 0.12)',
    bottom: '-20%',
    right: '-30%',
    transform: [{ rotate: '30deg' }],
  },
  meshGradient2: {
    width: width * 1.0,
    height: width * 1.0,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    top: '-15%',
    left: '-25%',
    transform: [{ rotate: '-45deg' }],
  },
  meshGradient3: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    top: '40%',
    right: '-10%',
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
    width: 220,
    height: 220,
    backgroundColor: 'rgba(42, 157, 143, 0.22)',
    bottom: -60,
    left: -60,
    shadowColor: '#2A9D8F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 80,
    elevation: 20,
  },
  glowOrb2: {
    width: 160,
    height: 160,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    top: 100,
    right: -40,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    zIndex: 2,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: Layout.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(42, 157, 143, 0.3)',
    borderRadius: 999,
  },
  ring1: {
    width: 140,
    height: 140,
    top: -20,
    left: -20,
  },
  ring2: {
    width: 180,
    height: 180,
    top: -40,
    left: -40,
    borderColor: 'rgba(42, 157, 143, 0.15)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 17,
    fontWeight: '700',
    color: Layout.colors.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 157, 143, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    width: '100%',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(42, 157, 143, 0.3)',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Layout.colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    shadowColor: Layout.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  textDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  verifiedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(42, 157, 143, 0.4)',
    gap: 10,
  },
  verifiedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Layout.colors.primary,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  backButtonText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  footerLink: {
    color: Layout.colors.primary,
    fontWeight: '700',
  },
});
