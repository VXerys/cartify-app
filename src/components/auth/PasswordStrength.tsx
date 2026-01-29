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

import { calculatePasswordStrength } from './passwordStrength.util';

export { calculatePasswordStrength };

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
  const progress = useSharedValue(0);

  const strength = result?.strength;
  const label = result?.label;
  const color = result?.color;
  const requirements = result?.requirements;
  const score = result?.score ?? 0;

  const target = !strength
    ? 0
    : strength === 'weak'
      ? 33
      : strength === 'medium'
        ? 66
        : 100;

  React.useEffect(() => {
    progress.value = withTiming(target, { duration: 300 });
  }, [progress, target]);

  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
      backgroundColor: withTiming(color, { duration: 300 }),
    };
  });

  if (!result || !requirements || !color || !label) return null;

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
        <Text style={styles.strengthScore}>{score}/5 requirements</Text>
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
