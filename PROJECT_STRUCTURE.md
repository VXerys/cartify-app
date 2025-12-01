# 📂 Cartify - Complete Project Structure

## Overview
Struktur project Cartify telah diorganisir untuk mendukung **Voice-First Shopping Calculator** dengan scalability untuk future features (Fase 2-4).

---

## 🗂️ Root Structure

```
CartifyApp/
├── app/                          # 🛣️ ROUTING LAYER (Expo Router - file-based routing)
│   ├── _layout.tsx              # Root layout dengan DB initialization
│   ├── index.tsx                # Route: "/" → Import dari src/screens/splash
│   ├── onboarding.tsx           # Route: "/onboarding" → Import dari src/screens/onboarding
│   └── (main)/                  # Route group (dengan tabs)
│       ├── _layout.tsx          # Tab navigator layout
│       ├── home.tsx             # Route: "/(main)/home" → Import dari src/screens/home
│       ├── history.tsx          # Route: "/(main)/history" → Import dari src/screens/history
│       └── settings.tsx         # Route: "/(main)/settings" → Import dari src/screens/settings
│
├── src/                         # 🎨 UI IMPLEMENTATION LAYER (actual code)
│   ├── components/              # Reusable UI components
│   ├── constants/               # App constants (layout, config)
│   ├── hooks/                   # Custom React hooks
│   ├── navigation/              # Navigation types (TypeScript)
│   ├── screens/                 # ⭐ Screen components (organized by feature)
│   │   ├── splash/              # Splash screen implementation
│   │   ├── onboarding/          # Onboarding screens
│   │   ├── auth/                # Login/Register screens
│   │   ├── home/                # Home dashboard
│   │   ├── budget/              # Budget management screens
│   │   ├── voice-input/         # Voice recording & processing (CORE)
│   │   ├── manual-input/        # Manual input fallback
│   │   ├── shopping-session/    # Shopping cart & checkout
│   │   ├── history/             # History list
│   │   ├── session-detail/      # Session detail view
│   │   └── settings/            # Settings & preferences
│   ├── services/                # API & Storage services
│   │   ├── api/                 # Gemini AI service
│   │   └── storage/             # SQLite database
│   ├── store/                   # Global state (Zustand)
│   ├── theme/                   # Design system (colors, typography, tokens)
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions (currency, responsive)
│
├── assets/                      # Static assets (images, icons, fonts)
├── docs/                        # 📚 Project documentation
│   ├── PROJECT_IDENTITY.md      # Project overview & requirements
│   ├── TECHNICAL_ARCHITECTURE.md # AI & cloud architecture
│   ├── USER_GUIDE.md            # User flow & voice command patterns
│   ├── EXPO_ROUTER_GUIDE.md     # 🆕 How to connect /app with /src
│   └── ...
└── scripts/                     # Build & dev scripts
```

### 🔗 Hubungan `/app` ↔ `/src/screens`

**Konsep:** Separation of Concerns

- **`/app`** = **Routing layer** (thin wrappers, hanya import & export)
- **`/src/screens`** = **UI layer** (actual screen implementations)

**Contoh:**
```tsx
// app/home.tsx (ROUTING - thin)
import HomeScreen from '@/src/screens/home/HomeScreen';
export default HomeScreen;

// src/screens/home/HomeScreen.tsx (UI - fat)
export default function HomeScreen() {
  // All UI logic, state, effects here
  return <ScreenWrapper>...</ScreenWrapper>
}
```

**Baca lengkap:** `/docs/EXPO_ROUTER_GUIDE.md`

---

## 📱 Screens Structure (`src/screens/`)

### Core User Flow Screens

#### 1. **Onboarding** (`onboarding/`)
- `WelcomeScreen.tsx` - Splash dengan branding
- `TutorialSlider.tsx` - Tutorial voice command (swipeable)
- `PermissionScreen.tsx` - Request mic & storage permissions

#### 2. **Authentication** (`auth/`)
- `LoginScreen.tsx` - Login form
- `RegisterScreen.tsx` - Sign up
- `ForgotPasswordScreen.tsx` - Password recovery (future)

#### 3. **Home Dashboard** (`home/`)
- `HomeScreen.tsx` - Main dashboard
  - Budget overview widget
  - Quick actions (Start Shopping, History)
  - Daily summary

#### 4. **Budget Management** (`budget/`)
- `SetBudgetScreen.tsx` - Input budget dengan slider/numpad
- `BudgetAlertScreen.tsx` - Warning modal (over budget)
- `BudgetHistoryScreen.tsx` - Budget compliance tracker

#### 5. **Voice Input** (`voice-input/`) ⭐ **CORE FEATURE**
- `VoiceRecordingScreen.tsx` - Mic button + waveform animation
- `VoiceProcessingScreen.tsx` - AI processing loading state
- `VoiceResultScreen.tsx` - Confirmation (qty, item, price)

#### 6. **Manual Input** (`manual-input/`)
- `ManualInputScreen.tsx` - Fallback form input
- `QuickEditScreen.tsx` - Edit parsed voice result

#### 7. **Shopping Session** (`shopping-session/`)
- `ShoppingCartScreen.tsx` - Active cart view
- `ItemDetailModal.tsx` - Edit/delete item
- `CheckoutScreen.tsx` - Finalize session

#### 8. **History** (`history/`)
- `HistoryListScreen.tsx` - List all past sessions
- `HistoryFilterScreen.tsx` - Filter by date/amount

#### 9. **Session Detail** (`session-detail/`)
- `SessionDetailScreen.tsx` - Detail view 1 session
- `SessionAnalyticsScreen.tsx` - Charts (future: Fase 4)

#### 10. **Settings** (`settings/`)
- `SettingsScreen.tsx` - Main settings menu
- `ProfileScreen.tsx` - User profile
- `PreferencesScreen.tsx` - App preferences (theme, etc)
- `AboutScreen.tsx` - Version, credits, privacy

---

## 🧩 Components Structure (`src/components/`)

### Generic UI (`ui/`)
Atomic design components untuk consistency:
- `Button.tsx`, `Input.tsx`, `Card.tsx`
- `Badge.tsx`, `ProgressBar.tsx`, `Modal.tsx`
- `Divider.tsx`, `EmptyState.tsx`, `LoadingSpinner.tsx`
- `IconButton.tsx`

### Budget Components (`budget/`)
Khusus budget tracking:
- `BudgetProgressBar.tsx` - Visual progress (spent vs limit)
- `BudgetIndicator.tsx` - Color indicator (green/yellow/red)
- `BudgetSummaryCard.tsx` - Summary card
- `BudgetSlider.tsx` - Interactive slider
- `OverBudgetAlert.tsx` - Alert banner

### Shopping Components (`shopping/`)
Shopping cart related:
- `ShoppingItemCard.tsx` - Single item card
- `ItemQuantitySelector.tsx` - +/- buttons
- `PriceDisplay.tsx` - Formatted Rupiah
- `CategoryTag.tsx` - Product categories (future)
- `ItemList.tsx` - Scrollable list
- `CartSummary.tsx` - Bottom sheet summary

### Voice Components (`voice/`) ⭐ **CORE**
Voice interaction UI:
- `MicrophoneButton.tsx` - Large mic dengan pulse animation
- `WaveformVisualizer.tsx` - Audio waveform animation
- `VoicePermissionPrompt.tsx` - Permission UI
- `VoiceParsingResult.tsx` - Display hasil parsing
- `VoiceErrorFeedback.tsx` - Error state UI
- `VoiceCommandHint.tsx` - Tooltip/hint

### History Components (`history/`)
History & analytics:
- `SessionCard.tsx` - Session card
- `SessionListItem.tsx` - List item
- `DateRangePicker.tsx` - Filter picker
- `SpendingChart.tsx` - Charts (future: Fase 4)
- `CategoryBreakdown.tsx` - Pie chart (future)
- `InflationTracker.tsx` - Price trend (future: Fase 4)

### Layout Wrappers (`wrapper/`)
- `ScreenWrapper.tsx` - SafeArea + KeyboardAvoidingView

---

## 🔧 Core Infrastructure (Already Built)

### State Management (`store/`)
- ✅ `useCartStore.ts` - Zustand store dengan persistence
  - Budget limit, current spent, items array
  - Actions: setBudget, addItem, removeItem, resetSession

### Services (`services/`)
- ✅ `api/geminiService.ts` - Google Gemini 1.5 Flash integration
  - parseVoiceCommand() method
  - System prompt untuk extract qty, name, price
- ✅ `storage/database.ts` - SQLite operations
  - Sessions & session_items tables
  - CRUD methods untuk history

### Navigation (`navigation/`)
- ✅ `types.ts` - Type-safe route definitions
  - RootStackParamList
  - Screen props helpers

### Hooks (`hooks/`)
- ✅ `useMicrophone.ts` - Audio permission logic
  - Permission state management
  - Request/check permissions

### Theme (`theme/`)
- ✅ `colors.ts` - Design system colors (Teal brand)
- ✅ `typography.ts` - Font sizes & weights
- ✅ `tokens.js` - Shared theme tokens (Tailwind + RN)

### Utils (`utils/`)
- ✅ `currency.ts` - Rupiah formatting
- ✅ `responsive.ts` - Responsive sizing helpers

### Types (`types/`)
- ✅ `env.d.ts` - Environment variable types
  - EXPO_PUBLIC_GEMINI_API_KEY

---

## 🎯 Navigation Flow

```
Splash (index.tsx)
  ↓
Onboarding (first-time only)
  ↓
Login/Register
  ↓
Home Dashboard
  ├─→ Set Budget
  ├─→ Start Shopping
  │     ├─→ Voice Input (Core Feature)
  │     │     ├─→ Recording → Processing → Result → Add to Cart
  │     │     └─→ Fallback: Manual Input (jika AI gagal)
  │     └─→ Shopping Cart → Checkout → Save to History
  ├─→ History
  │     └─→ Session Detail
  └─→ Settings
        ├─→ Profile
        ├─→ Preferences
        └─→ About
```

---

## 📋 Next Steps - UI Implementation Priority

### Phase 1: MVP Core (PRIORITY)
1. **Voice Input Screens** ⭐
   - VoiceRecordingScreen (mic button, permission)
   - VoiceProcessingScreen (loading state)
   - VoiceResultScreen (konfirmasi hasil AI)

2. **Shopping Session**
   - ShoppingCartScreen (list items)
   - Budget progress bar integration

3. **Budget Setup**
   - SetBudgetScreen (slider input)

### Phase 2: Essential Screens
4. Home Dashboard
5. History List
6. Settings

### Phase 3: Polish & UX
7. Onboarding Tutorial
8. Manual Input (fallback)
9. Session Detail Analytics

---

## 🎨 Design System Reference

### Colors (Teal Brand)
```typescript
primary: #81BFBC (Teal 400)
background: #F8FAFC (Slate 50)
text.primary: #0F172A (Slate 900)
success: #10B981 (Green 500)
danger: #EF4444 (Red 500)
```

### Typography
```typescript
fontSize: {
  xs: 12, sm: 14, base: 16, 
  lg: 18, xl: 24, 2xl: 32
}
fontWeight: {
  regular: '400', medium: '500', 
  bold: '700'
}
```

### Spacing (from layout.ts)
```typescript
spacing: {
  xs: 4, sm: 8, md: 16, 
  lg: 24, xl: 32, xxl: 48
}
```

---

## 📝 Coding Standards

1. **TypeScript Strict Mode** - No `any`
2. **Component Props** - Always use Interface
3. **Import Alias** - `@/src/...` untuk absolute imports
4. **Comments** - Indonesian untuk complex logic
5. **File Naming** - PascalCase untuk components, kebab-case untuk folders
6. **State** - Zustand untuk global, useState untuk local
7. **Styling** - StyleSheet.create() + Design System tokens

---

## 🚀 Ready for Implementation

Struktur sudah siap untuk UI slicing! Mulai dari **Voice Input Screens** sebagai core feature MVP.

Referensi dokumentasi:
- `/docs/PROJECT_IDENTITY.md` - Project requirements
- `/docs/USER_GUIDE.md` - User flow & voice command pattern
- `/docs/TECHNICAL_ARCHITECTURE.md` - AI integration details
- `/src/screens/README.md` - Screen structure guide
- `/src/components/README.md` - Component architecture guide
