# 🚀 Quick Start - Testing Expo Router

## Langkah 1: Jalankan Expo Dev Server

```bash
npm start
```

Atau tekan `w` untuk buka di web browser.

---

## Langkah 2: Lihat Current Routes

Saat ini struktur routing kamu:

```
/ (index)           → Splash Screen (2 detik, redirect ke /onboarding)
/onboarding         → Onboarding Screen (button "Get Started")
/(main)/home        → Home Tab
/(main)/history     → History Tab
/(main)/settings    → Settings Tab
```

---

## Langkah 3: Test Navigation

### Di Browser/Simulator:

1. **Start app** → Lihat Splash (logo 🛒)
2. **Wait 2s** → Auto redirect ke Onboarding
3. **Tap "Get Started"** → Masuk ke Home Screen (Tab Navigator)
4. **Tap tab** → Switch antar Home/History/Settings

### Coba Manual URL (di browser):

- `http://localhost:8081/onboarding`
- `http://localhost:8081/(main)/home`
- `http://localhost:8081/(main)/settings`

---

## Langkah 4: Buat Screen Baru (Example)

### Contoh: Tambah "Voice Recording Screen"

#### 4.1: Buat UI Component

```tsx
// src/screens/voice-input/VoiceRecordingScreen.tsx
import { ScreenWrapper } from '@/src/components/wrapper/ScreenWrapper';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';

export default function VoiceRecordingScreen() {
  const router = useRouter();
  
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>🎤 Voice Recording</Text>
        <Text style={styles.hint}>Tap the microphone to start</Text>
        
        {/* Big Mic Button */}
        <TouchableOpacity style={styles.micButton}>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hint: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 48,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  micIcon: {
    fontSize: 48,
  },
  backButton: {
    padding: 12,
  },
  backText: {
    fontSize: 16,
    color: colors.primary.DEFAULT,
  },
});
```

#### 4.2: Buat Route File

```tsx
// app/voice-record.tsx
import VoiceRecordingScreen from '@/src/screens/voice-input/VoiceRecordingScreen';

export default VoiceRecordingScreen;
```

#### 4.3: Navigate dari Home

Update `app/(main)/home.tsx` atau buat button di home:

```tsx
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 24, marginBottom: 24 }}>Home</Text>
        
        <Button 
          title="🎤 Start Voice Recording"
          onPress={() => router.push('/voice-record')}
        />
      </View>
    </ScreenWrapper>
  );
}
```

#### 4.4: Test!

1. Jalankan `npm start`
2. Buka app
3. Skip onboarding → Sampai Home
4. Tap button "Start Voice Recording"
5. Akan navigate ke screen baru!

---

## Langkah 5: Dynamic Routes (Bonus)

Contoh: Session Detail dengan ID

### 5.1: Buat Dynamic Route

```tsx
// app/session/[id].tsx
import SessionDetailScreen from '@/src/screens/session-detail/SessionDetailScreen';

export default SessionDetailScreen;
```

### 5.2: Buat Screen Component

```tsx
// src/screens/session-detail/SessionDetailScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24 }}>Session Detail</Text>
      <Text>Session ID: {id}</Text>
    </View>
  );
}
```

### 5.3: Navigate with Param

```tsx
router.push(`/session/${sessionId}`);
// Example: router.push('/session/123')
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module @/src/..."

**Fix:** Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Then restart TypeScript server (VS Code: `Ctrl+Shift+P` → "Restart TS Server")

### Route tidak muncul

**Fix:** 
1. Restart Expo: `npm start`
2. Clear cache: `npm start --clear`
3. Pastikan file ada di `/app` folder (bukan `/src`)

### Navigation not working

**Fix:** Import dari `expo-router` bukan `@react-navigation/native`:
```tsx
import { useRouter } from 'expo-router'; // ✅
```

---

## ✅ Checklist

- [ ] Expo dev server running
- [ ] App bisa dibuka di browser/simulator
- [ ] Bisa navigate dari Splash → Onboarding → Home
- [ ] Bisa switch tabs (Home/History/Settings)
- [ ] Sudah baca `/docs/EXPO_ROUTER_GUIDE.md`

**Next:** Mulai build UI screens sesuai priority di `PROJECT_STRUCTURE.md`! 🎨
