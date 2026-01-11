import React from 'react';
import { View } from 'react-native';
import { styles } from './OnboardingScreen.styles';

/**
 * Premium background component with gradient mesh effects and glowing orbs
 */
export const OnboardingBackground: React.FC = () => {
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.gradientOverlay} />

      {/* Group 1: Top Left (Teal Anchor) */}
      <View style={[styles.meshGradient, styles.meshGradient1]} />
      <View style={[styles.glowOrb, styles.glowOrb1]} />

      {/* Group 2: Bottom Right (Emerald Anchor) */}
      <View style={[styles.meshGradient, styles.meshGradient2]} />
      <View style={[styles.glowOrb, styles.glowOrb2]} />

      {/* Group 3: Top Right (Blue Accent) */}
      <View style={[styles.meshGradient, styles.meshGradient3]} />
      <View style={[styles.glowOrb, styles.glowOrb3]} />

      {/* Group 4: Bottom Left (Cyan Accent) */}
      <View style={[styles.meshGradient, styles.meshGradient4]} />
      <View style={[styles.glowOrb, styles.glowOrb4]} />
    </View>
  );
};
