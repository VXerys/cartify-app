import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { styles } from './RegisterScreen.styles';
import { PasswordStrengthResult } from './RegisterScreen.types';

// Password strength calculation
export const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
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

interface RequirementItemProps {
  met: boolean;
  label: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ met, label }) => (
  <View style={styles.requirementRow}>
    <Ionicons 
      name={met ? "checkmark-circle" : "ellipse-outline"} 
      size={14} 
      color={met ? '#10B981' : 'rgba(255,255,255,0.4)'} 
    />
    <Text style={[
      styles.requirementText,
      met && styles.requirementMet
    ]}>
      {label}
    </Text>
  </View>
);

interface PasswordStrengthIndicatorProps {
  result: PasswordStrengthResult | null;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ result }) => {
  // If no result (no password), we don't render anything to keep layout clean
  if (!result) return null;

  const { strength, label, color, requirements } = result;

  // Derived animation values
  const progress = useSharedValue(0);
  
  // Update progress based on strength
  React.useEffect(() => {
    let target = 0;
    if (strength === 'weak') target = 33;
    else if (strength === 'medium') target = 66;
    else if (strength === 'strong') target = 100;
    
    progress.value = withTiming(target, { duration: 300 });
  }, [strength]);

  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
      backgroundColor: withTiming(color, { duration: 300 }),
    };
  });

  return (
    <Animated.View 
      entering={FadeInDown.duration(300)} 
      style={styles.strengthContainer}
    >
      {/* Strength Bar */}
      <View style={styles.strengthBarContainer}>
        <Animated.View 
          style={[styles.strengthBar, animatedBarStyle]} 
        />
      </View>
      
      {/* Strength Label */}
      <View style={styles.strengthLabelRow}>
        <Text style={[styles.strengthLabel, { color }]}>{label}</Text>
        <Text style={styles.strengthScore}>{result.score}/5 requirements</Text>
      </View>

      {/* Requirements Checklist */}
      <View style={styles.requirementsContainer}>
        <RequirementItem met={requirements.minLength} label="At least 8 characters" />
        <RequirementItem met={requirements.hasUppercase} label="One uppercase letter" />
        <RequirementItem met={requirements.hasLowercase} label="One lowercase letter" />
        <RequirementItem met={requirements.hasNumber} label="One number" />
      </View>
    </Animated.View>
  );
};
