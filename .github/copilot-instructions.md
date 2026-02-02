# Cartify AI Coding Agent Instructions

## Project Overview
**Cartify** is a React Native mobile app (Expo SDK 54) that helps Indonesian retail shoppers track purchases using voice AI. Users speak naturally in Indonesian to add items, and the app uses Groq Cloud (Llama 3.1) to parse Indonesian retail slang ("goceng" = 5,000 IDR) and brand names into structured data, storing transactions in local SQLite.

## Critical Architecture Patterns

### 1. Hybrid AI Architecture (Voice → Cloud AI → Local Storage)
**Flow:** `expo-speech-recognition` → Groq API → SQLite
- Voice input is transcribed locally (no network latency)
- Transcription sent to Groq for semantic parsing (understands Indonesian slang + retail context)
- Parsed data stored offline in SQLite via `src/services/db.ts`
- **Key File:** [src/services/groqService.ts](src/services/groqService.ts) - Contains extensive SYSTEM_PROMPT with Indonesian retail brand correction rules ("Grin Tih" → "Greenfields")

### 2. File-Based Routing (expo-router)
```
app/
  (tabs)/          # Tab navigation screens
    _layout.tsx    # Custom TabBar with transparent background
    index.tsx      # Home (voice input entry point)
    history.tsx    # Transaction history
    settings.tsx   # User settings
  auth.tsx         # Authentication flow
  modal.tsx        # Global modals
```
**Never** create `App.tsx` - entry point is defined in `package.json` as `"main": "expo-router/entry"`

### 3. Windows Filesystem Casing Issues
**Critical:** Windows is case-insensitive but Git/TypeScript are not. Avoid mixing cases for same filename.
- ❌ `PasswordStrength.tsx` + `passwordStrength.ts` → conflicts
- ✅ Use lowercase consistently: `passwordStrengthIndicator.tsx`
- Conflicts are excluded in [tsconfig.json](tsconfig.json#L14-L17) - check exclude list before adding similar files

### 4. State Management Patterns
**AuthContext Pattern:** Global auth state via React Context, not Redux/Zustand
```tsx
// src/context/AuthContext.tsx - Subscribe to Firebase auth state
authService.subscribe((state) => setAuthState(state));
```
**Local State:** Use `useState` + `useCallback` for screen-level state
**Persistent:** AsyncStorage for preferences, SQLite for transactions

### 5. Responsive Design System
**Hook:** [src/hooks/useResponsive.ts](src/hooks/useResponsive.ts)
- `horizontalScale()` - Width-based sizing
- `verticalScale()` - Height-based sizing  
- `moderateScale(size, factor)` - Damped scaling (default factor: 0.5)
- `responsiveFont()` - Clamps max fontScale to 1.35 to prevent layout breakage on accessibility text settings
```tsx
const { moderateScale } = useResponsive();
<Text style={{ fontSize: moderateScale(16) }}>
```

## Development Workflows

### Testing Commands
```powershell
npm test                  # Run all Jest tests (17 suites, 109 tests)
npm run test:watch        # Watch mode
npm run test:coverage     # Generate coverage report
npm run test:auth         # Auth-specific tests only
```

**Test File Locations:** `src/__tests__/**/*.test.tsx`
**Mock Strategy:** Global mocks in [jest.setup.js](jest.setup.js) - Firebase, React Native modules, AsyncStorage
**Critical:** Use `require()` not `await import()` for Firebase in tests ([example fix](src/services/__tests__/authService.test.ts))

### Running the App
```powershell
npm start                 # Expo dev server
npm run start:tunnel      # Tunnel mode (for physical device testing)
npm run android           # Build + run on Android emulator
```

### API Keys Setup
**Required:** Create `.env` in root with:
```env
EXPO_PUBLIC_GROQ_API_KEY=gsk_...
EXPO_PUBLIC_GROQ_API_KEY_2=gsk_...  # Failover rotation
EXPO_PUBLIC_GROQ_API_KEY_3=gsk_...
EXPO_PUBLIC_GEMINI_API_KEY=AIza...  # Alternative AI backend
```
**Failover Logic:** [src/services/groqService.ts](src/services/groqService.ts#L5-L11) - Automatically rotates keys on rate limit

## Code Conventions & Patterns

### 1. Import Alias
**Always use `@/` for absolute imports:**
```tsx
import { useResponsive } from '@/src/hooks/useResponsive';
import { Colors } from '@/constants/theme';
```
**Path mapping:** [tsconfig.json](tsconfig.json#L5-L7) + [jest.config.js](jest.config.js#L14-L16)

### 2. TypeScript Strictness
- Strict mode enabled ([tsconfig.json](tsconfig.json#L3))
- **Never use `any`** - define proper interfaces in `.types.ts` files
- Style/type files excluded from coverage: [jest.config.js](jest.config.js#L20-L24)

### 3. Component Styling Pattern
**Separate style/type files:**
```
RegisterScreen.tsx
RegisterScreen.styles.ts    # StyleSheet.create() definitions
RegisterScreen.types.ts     # TypeScript interfaces
```

### 4. Firebase Authentication
**Service Layer:** [src/services/authService.ts](src/services/authService.ts) wraps `@react-native-firebase/auth`
**Google Sign-In:** Uses `@react-native-google-signin/google-signin` - requires `google-services.json` in root + `android/app/`
**Setup Docs:** [docs/FIREBASE_AUTH_SETUP.md](docs/FIREBASE_AUTH_SETUP.md)

### 5. SQLite Database Schema
**Migration System:** [src/services/db.ts](src/services/db.ts#L3-L63) - `migrateDbIfNeeded()` uses `PRAGMA user_version`
**Current Version:** 2
**Tables:**
- `transactions` - Main transaction records (id, date, total_amount, note)
- `transaction_items` - Line items (includes `unit` column added in v2)

### 6. Animation Library
**Use:** `react-native-reanimated` (v4.1.1), not Animated API
**Pattern:** Shared values + `useAnimatedStyle`
```tsx
const progress = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => ({
  width: withSpring(progress.value)
}));
```

### 7. Haptic Feedback
**Import:** `import * as Haptics from 'expo-haptics';`
**Common Pattern:** Call `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` on button press
**Example:** [src/components/ui/TabBar.tsx](src/components/ui/TabBar.tsx) - Tab switches trigger haptics

## Common Pitfalls & Solutions

### ESLint Errors in Test Files
**Problem:** `no-undef` for `describe`, `it`, `expect`
**Solution:** Add `/* eslint-env jest */` at top of test files

### Dynamic Imports in Jest
**Problem:** `await import()` requires experimental VM modules
**Solution:** Use `require()` instead ([example](src/services/__tests__/authService.test.ts))

### React Hooks Exhaustive Deps
**Rule Enabled:** Always include all dependencies in `useEffect`/`useCallback`
**Fix:** Add missing deps or use `// eslint-disable-next-line react-hooks/exhaustive-deps` with justification

### TabBar Visual Integration
**Pattern:** Transparent background with blur effect, not solid color
**Example:** [src/components/ui/TabBar.tsx](src/components/ui/TabBar.tsx) - `backgroundColor: 'transparent'` + safe area padding

## Indonesian Language Context

### Groq Prompt Engineering
The AI understands Indonesian retail slang - see [src/services/groqService.ts](src/services/groqService.ts#L22-L150):
- **Slang:** "Goceng" (5,000), "Ceban" (10,000), "Setengah kilo" (0.5 kg)
- **Brand Correction:** "Grin Tih" → "Green Tea", "Hed end solder" → "Head & Shoulders"
- **Unit Normalization:** "bungkus/pack/sachet" → "pack", "biji/buah/batang" → "pcs"
- **Price Logic:** Handles "ribu" (thousands) + dangling numbers ("Indomie 2 bungkus 6" = 6,000 IDR)

### Localization
**i18n Setup:** [src/i18n/index.ts](src/i18n/index.ts) - React-i18next with Indonesian + English
**Usage:** `const { t } = useTranslation();` → `t('common.save')`

## Firebase Specific Setup

### Android Configuration
**Required Files:**
- `google-services.json` (root + `android/app/`)
- `android/build.gradle` - Include Google services plugin

### Environment Variables
```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxx.apps.googleusercontent.com  # For Google Sign-In
```
**Warning:** Tests show warning if missing, but tests still pass

## Performance Optimization Patterns

### FlatList Best Practices
- Use `keyExtractor` with stable IDs
- Set `getItemLayout` for fixed-height items
- Apply `windowSize`, `initialNumToRender`, `removeClippedSubviews` for long lists

### Memoization
**Used in:** Custom hooks, expensive calculations
**Pattern:** `useMemo` for computed values, `useCallback` for functions passed as props
**Example:** [src/hooks/useResponsive.ts](src/hooks/useResponsive.ts) - Scaling functions wrapped in `useCallback`

## Testing Philosophy

### Coverage Goals
**Current:** 109 tests across 17 suites
**Focus:** Unit tests for services/utils, UI tests for screens
**Missing:** E2E tests (Detox/Appium), integration tests for multi-screen flows

### Test Data
**Mock History:** [src/data/mockHistory.ts](src/data/mockHistory.ts) - Sample transaction data for UI testing

### Warnings to Ignore
- `act()` warnings in HistoryScreen tests - best practice issue, doesn't fail tests
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` missing - non-blocking for unit tests

## Git Workflow

**Current Branch:** `fix/eas-preview-tabbar`
**Default Branch:** `master`
**Remote:** `VXerys/cartify-app`

When committing, follow conventional commits:
```
fix: resolve TabBar visual integration issue
feat: add voice input retry mechanism
test: add integration tests for auth flow
```

## Next Steps for AI Agents

When working on this project:
1. **Check environment:** Verify API keys in `.env` before working on AI features
2. **Run tests:** Always run `npm test` after code changes
3. **Respect patterns:** Follow the established Context/Service/Hook architecture
4. **Windows note:** Be careful with file casing - check `tsconfig.json` excludes
5. **Indonesian context:** When modifying Groq prompts, maintain retail slang knowledge
