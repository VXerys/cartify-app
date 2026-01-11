import React from 'react';
import { View } from 'react-native';
import { styles } from './RegisterScreen.styles';

/**
 * Premium background component with gradient effects and glowing orbs
 */
export const RegisterBackground: React.FC = () => {
  return (
    <View style={styles.backgroundContainer}>
      {/* Main gradient overlay */}
      <View style={styles.gradientOverlay} />
      
      {/* Animated mesh gradient effect */}
      <View style={[styles.meshGradient, styles.meshGradient1]} />
      <View style={[styles.meshGradient, styles.meshGradient2]} />
      <View style={[styles.meshGradient, styles.meshGradient3]} />
      
      {/* Glowing orbs - Premium background effect */}
      <View style={[styles.glowOrb, styles.glowOrb1]} />
      <View style={[styles.glowOrb, styles.glowOrb2]} />
      <View style={[styles.glowOrb, styles.glowOrb3]} />
    </View>
  );
};
