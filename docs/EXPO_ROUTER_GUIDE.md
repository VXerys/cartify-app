# 🚀 Expo Router - Panduan Lengkap

## Konsep Dasar: File-Based Routing

Berbeda dengan React Native CLI yang menggunakan **React Navigation manual**, Expo Router menggunakan **file-based routing** seperti Next.js/Nuxt.

### Perbedaan dengan React Native CLI:

**React Native CLI (Manual):**
```tsx
// Kamu harus define routes manual di App.tsx
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
</NavigationContainer>
```

**Expo Router (Automatic):**
```
app/
├── index.tsx         → Route: "/"
├── settings.tsx      → Route: "/settings"
└── (main)/
    └── home.tsx      → Route: "/(main)/home"
```

Routing otomatis di-generate berdasarkan struktur folder!

---

## 🗂️ Struktur Folder `/app` di Cartify

### Current Structure:

```
app/
├── _layout.tsx              # Root layout (wrapper untuk semua routes)
├── index.tsx                # Route: "/" (Splash screen)
├── onboarding.tsx           # Route: "/onboarding"
└── (main)/                  # Route group (dengan tabs)
    ├── _layout.tsx          # Tab navigator layout
    ├── home.tsx             # Route: "/(main)/home"
    ├── history.tsx          # Route: "/(main)/history"
    └── settings.tsx         # Route: "/(main)/settings"
```

### Penjelasan:

1. **`_layout.tsx`** = Layout wrapper (seperti `NavigationContainer`)
2. **`(main)/`** = Route group (tanda kurung = tidak masuk URL)
3. **File `.tsx`** = Langsung jadi route

---

## 🔗 Cara Menghubungkan `/app` dengan `/src/screens`

### Strategi: **Separation of Concerns**

- **`/app`** = **Routing layer** (thin wrapper, hanya routing logic)
- **`/src/screens`** = **UI implementation** (actual screen components)

### Contoh Implementation:

#### ❌ **JANGAN** ini (mixing routing & UI):

```tsx
// app/home.tsx
export default function HomeScreen() {
  // 100 baris kode UI di sini...
  return <View>...</View>
}
```

#### ✅ **LAKUKAN** ini (separate concerns):

```tsx
// app/home.tsx (ROUTING LAYER - thin wrapper)
import HomeScreen from '@/src/screens/home/HomeScreen';

export default HomeScreen; // Simple re-export
```

```tsx
// src/screens/home/HomeScreen.tsx (UI LAYER - full implementation)
export default function HomeScreen() {
  // All UI logic here
  return <ScreenWrapper>...</ScreenWrapper>
}
```

---

## 📝 Step-by-Step: Menambahkan Screen Baru

### Contoh: Membuat "Budget Setup Screen"

#### Step 1: Buat UI Component di `/src/screens`

```tsx
// src/screens/budget/SetBudgetScreen.tsx
import { ScreenWrapper } from '@/src/components/wrapper/ScreenWrapper';
import { View, Text, StyleSheet } from 'react-native';

export default function SetBudgetScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Set Your Budget</Text>
        {/* UI implementation here */}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
```

#### Step 2: Buat Route di `/app`

**Option A: Direct file** (untuk screen standalone)
```tsx
// app/set-budget.tsx
import SetBudgetScreen from '@/src/screens/budget/SetBudgetScreen';

export default SetBudgetScreen;
```

**Option B: Dalam folder** (untuk sub-routes)
```tsx
// app/budget/set.tsx
import SetBudgetScreen from '@/src/screens/budget/SetBudgetScreen';

export default SetBudgetScreen;
```

#### Step 3: Navigate ke Screen

```tsx
import { useRouter } from 'expo-router';

function SomeComponent() {
  const router = useRouter();
  
  const handlePress = () => {
    router.push('/set-budget'); // Option A
    // atau
    router.push('/budget/set');  // Option B
  };
}
```

---

## 🎯 Best Practice untuk Cartify

### Recommended Structure:

```
app/
├── _layout.tsx                    # Root layout
├── index.tsx                      # → src/screens/splash/SplashScreen.tsx
├── onboarding.tsx                 # → src/screens/onboarding/OnboardingScreen.tsx
│
├── (auth)/                        # Auth group (tidak ada tabs)
│   ├── login.tsx                  # → src/screens/auth/LoginScreen.tsx
│   └── register.tsx               # → src/screens/auth/RegisterScreen.tsx
│
├── (main)/                        # Main app (dengan tabs)
│   ├── _layout.tsx                # Tab navigator
│   ├── home.tsx                   # → src/screens/home/HomeScreen.tsx
│   ├── history.tsx                # → src/screens/history/HistoryListScreen.tsx
│   └── settings.tsx               # → src/screens/settings/SettingsScreen.tsx
│
├── budget/
│   └── set.tsx                    # → src/screens/budget/SetBudgetScreen.tsx
│
├── voice/
│   ├── record.tsx                 # → src/screens/voice-input/VoiceRecordingScreen.tsx
│   └── result.tsx                 # → src/screens/voice-input/VoiceResultScreen.tsx
│
├── session/
│   ├── cart.tsx                   # → src/screens/shopping-session/ShoppingCartScreen.tsx
│   ├── checkout.tsx               # → src/screens/shopping-session/CheckoutScreen.tsx
│   └── [id].tsx                   # → src/screens/session-detail/SessionDetailScreen.tsx (dynamic route)
│
└── manual-input.tsx               # → src/screens/manual-input/ManualInputScreen.tsx
```

---

## 📚 Navigation Methods

### 1. **`router.push()`** - Stack navigation (bisa back)
```tsx
router.push('/voice/record');
```

### 2. **`router.replace()`** - Replace current (tidak bisa back)
```tsx
router.replace('/(main)/home'); // Dari splash/onboarding
```

### 3. **`router.back()`** - Go back
```tsx
router.back();
```

### 4. **Dynamic routes** - Passing parameters
```tsx
// Navigate
router.push(`/session/${sessionId}`);

// Receive (di src/screens/session-detail/SessionDetailScreen.tsx)
import { useLocalSearchParams } from 'expo-router';

function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // use id to fetch data
}
```

---

## 🔥 Quick Start: Update Current Files

### Update `/app/home.tsx`:
```tsx
// app/(main)/home.tsx
import HomeScreen from '@/src/screens/home/HomeScreen';
export default HomeScreen;
```

### Create `/src/screens/home/HomeScreen.tsx`:
```tsx
// src/screens/home/HomeScreen.tsx
import { ScreenWrapper } from '@/src/components/wrapper/ScreenWrapper';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 24, marginBottom: 16 }}>Home Screen</Text>
        <Button 
          title="Start Voice Shopping" 
          onPress={() => router.push('/voice/record')}
        />
      </View>
    </ScreenWrapper>
  );
}
```

---

## 🚨 Common Errors & Solutions

### Error: "Cannot resolve @/src/..."
**Solution:** Check `tsconfig.json` paths configuration
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: "Route not found"
**Solution:** 
1. Pastikan file ada di `/app`
2. Restart Expo dev server (`npm start`)

### Error: "Module not found: screens/..."
**Solution:** Import dengan `@/src/screens/...` bukan relative path

---

## ✅ Summary

1. **`/app`** = Routing structure (file = route)
2. **`/src/screens`** = UI implementation (actual components)
3. **Connect:** Import screen dari `/src` ke file di `/app`
4. **Navigate:** Use `useRouter()` hook dari `expo-router`
5. **Type-safe:** Use `RootStackParamList` untuk params

**Golden Rule:**
> Keep `/app` files thin (just imports).  
> Keep `/src/screens` fat (all UI logic).

Sekarang kamu siap untuk build screens! 🚀
