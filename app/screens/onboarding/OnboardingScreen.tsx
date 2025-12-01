import { ScreenWrapper } from '@/src/components/wrapper/ScreenWrapper';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper bg="background.light">
      <View style={styles.container}>
        <Text style={styles.emoji}>🎤</Text>
        <Text style={styles.title}>Welcome to Cartify!</Text>
        <Text style={styles.description}>
          Belanja cerdas dengan voice command.{'\n'}
          Set budget, speak to add items, dan track spending Anda secara realtime.
        </Text>
        <View style={styles.features}>
          <FeatureItem emoji="🎯" text="Set Budget Limit" />
          <FeatureItem emoji="🗣️" text="Voice Command Input" />
          <FeatureItem emoji="📊" text="Real-time Tracking" />
          <FeatureItem emoji="💾" text="Shopping History" />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(main)/home' as any)}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

function FeatureItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 48, justifyContent: 'center' },
  emoji: { fontSize: 72, textAlign: 'center', marginBottom: 24 },
  title: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.text.primary, textAlign: 'center', marginBottom: 16 },
  description: { fontSize: typography.fontSize.base, color: colors.text.secondary, textAlign: 'center', lineHeight: 24, marginBottom: 48 },
  features: { marginBottom: 48 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  featureEmoji: { fontSize: 32, marginRight: 16 },
  featureText: { fontSize: typography.fontSize.lg, color: colors.text.primary, fontWeight: typography.fontWeight.medium },
  button: { backgroundColor: colors.primary.DEFAULT, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: colors.primary.inverse, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
});
