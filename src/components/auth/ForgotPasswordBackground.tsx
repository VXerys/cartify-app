import React from 'react';
import { View } from 'react-native';
import { styles } from './ForgotPasswordScreen.styles';

/**
 * Premium background component with gradient effects and glowing orbs
 */
export const ForgotPasswordBackground: React.FC = () => {
  return (
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
  );
};
