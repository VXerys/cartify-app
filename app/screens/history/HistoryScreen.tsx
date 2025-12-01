import { ScreenWrapper } from '@/src/components/wrapper/ScreenWrapper';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  return (
    <ScreenWrapper bg="background.light">
      <View style={styles.container}>
        <Text style={styles.title}>📜 History Screen</Text>
        <Text style={styles.subtitle}>Shopping Sessions - Ready untuk UI Slicing!</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: 8 },
  subtitle: { fontSize: typography.fontSize.base, color: colors.text.secondary, textAlign: 'center' },
});
