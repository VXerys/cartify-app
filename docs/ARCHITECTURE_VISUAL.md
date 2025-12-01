# 📊 Cartify Architecture - Visual Guide

## 🏗️ Arsitektur 3-Layer

```
┌─────────────────────────────────────────────────────────────┐
│                    📱 USER INTERFACE                        │
│                   (What User Sees)                          │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│              🛣️ ROUTING LAYER (/app folder)                 │
│                                                              │
│  File-based routing (Expo Router):                          │
│  - index.tsx        → Route: "/"                            │
│  - onboarding.tsx   → Route: "/onboarding"                  │
│  - (main)/home.tsx  → Route: "/(main)/home"                 │
│                                                              │
│  Role: Hanya import & export screen components              │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│           🎨 UI IMPLEMENTATION (/src/screens)               │
│                                                              │
│  Actual screen components:                                   │
│  - HomeScreen.tsx (with all UI logic)                       │
│  - VoiceRecordingScreen.tsx                                 │
│  - HistoryListScreen.tsx                                    │
│                                                              │
│  Role: Full UI implementation + business logic               │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│        🧩 COMPONENTS (/src/components)                      │
│                                                              │
│  Reusable UI pieces:                                        │
│  - Button, Card, Input (ui/)                                │
│  - BudgetProgressBar (budget/)                              │
│  - MicrophoneButton (voice/)                                │
│  - ShoppingItemCard (shopping/)                             │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│     🧠 STATE & SERVICES (/src/store, /src/services)        │
│                                                              │
│  Global State (Zustand):                                    │
│  - useCartStore → budgetLimit, items, currentSpent          │
│                                                              │
│  Services:                                                   │
│  - geminiService → AI voice parsing                         │
│  - database → SQLite operations                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Example: "Add Item via Voice"

```
User taps Mic Button
        ↓
┌──────────────────────────────────────────────────────┐
│ 1. VoiceRecordingScreen.tsx (src/screens/voice-input)│
│    - Request mic permission (useMicrophone hook)      │
│    - Record audio                                     │
│    - Show waveform animation                          │
└──────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────┐
│ 2. geminiService.parseVoiceCommand()                 │
│    (src/services/api/geminiService.ts)               │
│    - Send audio to Google Gemini API                 │
│    - AI parses: "3 Wafer 20000"                      │
│    - Returns: { qty: 3, name: "Wafer", price: 20000 }│
└──────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────┐
│ 3. VoiceResultScreen.tsx                             │
│    - Show parsed result                              │
│    - User confirm/edit                               │
└──────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────┐
│ 4. useCartStore.addItem()                            │
│    (src/store/useCartStore.ts)                       │
│    - Add to items array                              │
│    - Recalculate currentSpent                        │
│    - Persist to AsyncStorage                         │
└──────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────┐
│ 5. ShoppingCartScreen updates                        │
│    (src/screens/shopping-session)                    │
│    - Display new item                                │
│    - Update BudgetProgressBar                        │
└──────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure - Detailed Breakdown

```
CartifyApp/
│
├── 🛣️ app/                   # ROUTING LAYER
│   ├── _layout.tsx           # Root wrapper (DB init, navigation setup)
│   ├── index.tsx             # "/" → Splash screen
│   ├── onboarding.tsx        # "/onboarding" → Tutorial
│   │
│   ├── (auth)/               # Auth routes (no tabs)
│   │   ├── login.tsx         # "/(auth)/login"
│   │   └── register.tsx      # "/(auth)/register"
│   │
│   ├── (main)/               # Main app routes (with tabs)
│   │   ├── _layout.tsx       # Tab navigator config
│   │   ├── home.tsx          # Tab: Home
│   │   ├── history.tsx       # Tab: History
│   │   └── settings.tsx      # Tab: Settings
│   │
│   ├── voice-record.tsx      # "/voice-record" (full screen, no tabs)
│   ├── manual-input.tsx      # "/manual-input" (fallback)
│   │
│   └── session/
│       └── [id].tsx          # Dynamic: "/session/123"
│
├── 🎨 src/
│   ├── screens/              # UI IMPLEMENTATION
│   │   ├── splash/
│   │   │   └── SplashScreen.tsx
│   │   ├── onboarding/
│   │   │   ├── OnboardingScreen.tsx
│   │   │   └── TutorialSlider.tsx
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── voice-input/
│   │   │   ├── VoiceRecordingScreen.tsx  ⭐ CORE
│   │   │   ├── VoiceProcessingScreen.tsx
│   │   │   └── VoiceResultScreen.tsx
│   │   ├── shopping-session/
│   │   │   ├── ShoppingCartScreen.tsx
│   │   │   └── CheckoutScreen.tsx
│   │   ├── history/
│   │   │   └── HistoryListScreen.tsx
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   │
│   ├── components/           # REUSABLE UI
│   │   ├── ui/               # Generic (Button, Input, Card)
│   │   ├── budget/           # Budget-specific
│   │   ├── voice/            # Voice UI (MicButton, Waveform)
│   │   ├── shopping/         # Shopping cart components
│   │   └── wrapper/          # ScreenWrapper
│   │
│   ├── store/                # GLOBAL STATE
│   │   └── useCartStore.ts   # Zustand store (budgetLimit, items)
│   │
│   ├── services/             # EXTERNAL SERVICES
│   │   ├── api/
│   │   │   └── geminiService.ts  # Google Gemini AI
│   │   └── storage/
│   │       └── database.ts       # SQLite operations
│   │
│   ├── hooks/                # CUSTOM HOOKS
│   │   └── useMicrophone.ts  # Permission logic
│   │
│   ├── navigation/           # NAVIGATION TYPES
│   │   └── types.ts          # RootStackParamList
│   │
│   ├── theme/                # DESIGN SYSTEM
│   │   ├── colors.ts         # Brand colors (Teal)
│   │   ├── typography.ts     # Font config
│   │   └── tokens.js         # Shared tokens
│   │
│   ├── types/                # TYPESCRIPT TYPES
│   │   └── env.d.ts          # Environment variables
│   │
│   └── utils/                # UTILITIES
│       ├── currency.ts       # Rupiah formatter
│       └── responsive.ts     # Screen sizing
│
├── 📄 docs/                  # DOCUMENTATION
│   ├── PROJECT_IDENTITY.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── EXPO_ROUTER_GUIDE.md  ⭐ Read this!
│   └── ...
│
├── 🎨 assets/                # STATIC FILES
│   └── images/
│
└── 📝 Root Files
    ├── .env.example          # Environment template
    ├── PROJECT_STRUCTURE.md  # This file
    ├── QUICK_START.md        ⭐ Quick testing guide
    └── package.json
```

---

## 🎯 File Naming Conventions

### Routes (`/app`)
```
kebab-case.tsx          # voice-record.tsx, manual-input.tsx
(group)/                # (auth)/, (main)/
[param].tsx             # [id].tsx (dynamic route)
_layout.tsx             # Layout file (special)
```

### Screens (`/src/screens`)
```
PascalCase.tsx          # HomeScreen.tsx, LoginScreen.tsx
folder/Screen.tsx       # voice-input/VoiceRecordingScreen.tsx
```

### Components (`/src/components`)
```
PascalCase.tsx          # Button.tsx, MicrophoneButton.tsx
domain/Component.tsx    # budget/BudgetProgressBar.tsx
```

---

## 🚦 Navigation Cheat Sheet

### Push (can go back)
```tsx
router.push('/voice-record');
router.push(`/session/${id}`);
```

### Replace (cannot go back)
```tsx
router.replace('/(main)/home'); // After login/onboarding
```

### Go back
```tsx
router.back();
```

### Get params (dynamic routes)
```tsx
const { id } = useLocalSearchParams<{ id: string }>();
```

---

## 💡 Best Practices

### ✅ DO:
```tsx
// Keep /app files thin (just imports)
// app/home.tsx
import HomeScreen from '@/src/screens/home/HomeScreen';
export default HomeScreen;

// Keep /src/screens fat (all logic)
// src/screens/home/HomeScreen.tsx
export default function HomeScreen() {
  const [data, setData] = useState();
  // All logic here
}
```

### ❌ DON'T:
```tsx
// Don't put logic in /app files
// app/home.tsx - BAD
export default function Home() {
  const [state, setState] = useState(); // ❌
  // 100 lines of code... ❌
}
```

---

## 🎓 Learning Path

1. ✅ Baca `/docs/EXPO_ROUTER_GUIDE.md`
2. ✅ Test dengan `QUICK_START.md`
3. ✅ Lihat contoh di `/app` dan `/src/screens`
4. 🚀 Mulai build UI dari Voice Recording Screen (core feature)

**Ready to code!** 🎉
