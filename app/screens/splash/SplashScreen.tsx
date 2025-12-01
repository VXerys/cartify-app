import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUserState = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.replace('/onboarding' as any);
    };
    checkUserState();
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛒</Text>
      <Text style={styles.title}>Cartify</Text>
      <Text style={styles.subtitle}>Voice-Powered Shopping Assistant</Text>
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  logo: { fontSize: 80, marginBottom: 16 },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: 32,
  },
  loader: { marginTop: 24 },
});
