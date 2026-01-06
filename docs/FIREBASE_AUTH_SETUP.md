# Firebase Authentication Setup Guide

Panduan lengkap untuk setup Firebase Authentication dengan Email/Password dan Google Sign-In di Cartify.

## ✅ Prerequisites

- ✅ `@react-native-firebase/app` sudah terinstall
- ✅ `@react-native-firebase/auth` sudah terinstall
- ✅ `@react-native-google-signin/google-signin` sudah terinstall
- ✅ `google-services.json` sudah ada di project
- ✅ Plugins sudah dikonfigurasi di `app.json`

## 📋 Langkah-Langkah Setup

### Step 1: Enable Authentication Methods di Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project **cartify-bb580**
3. Pergi ke **Authentication** → **Sign-in method**
4. Enable **Email/Password**:
   - Klik "Email/Password"
   - Toggle "Enable" ke ON
   - Klik "Save"
5. Enable **Google**:
   - Klik "Google"
   - Toggle "Enable" ke ON
   - Pilih **Support email** (email Anda)
   - Klik "Save"
   - **PENTING**: Setelah save, copy **Web Client ID** yang muncul

### Step 2: Tambahkan SHA-1 Fingerprint

SHA-1 fingerprint Anda untuk debug:
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

1. Di Firebase Console, pergi ke **Project Settings** (ikon ⚙️)
2. Scroll ke **Your apps** → **Android app**
3. Klik **Add fingerprint**
4. Paste SHA-1 di atas
5. Klik **Save**
6. **PENTING**: Download `google-services.json` yang baru dan replace file yang ada

### Step 3: Update Environment Variables

Buat file `.env` di root project (jika belum ada):

```env
# Google Web Client ID dari Firebase Console
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE

# Optional: Groq API Key untuk fitur AI
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

**Cara mendapatkan Web Client ID:**
1. Firebase Console → Authentication → Sign-in method → Google
2. Expand "Web SDK configuration"
3. Copy "Web client ID"

### Step 4: Update google-services.json

Setelah menambahkan SHA-1 fingerprint, download ulang `google-services.json`:
1. Firebase Console → Project Settings → Your apps → Android
2. Klik tombol download `google-services.json`
3. Replace file `google-services.json` di root project

File yang baru akan memiliki `oauth_client` yang terisi (tidak kosong).

### Step 5: Build Development Client

Karena menggunakan native modules (Firebase), Anda perlu build development client:

```bash
# Build untuk Android
npx expo run:android

# ATAU menggunakan EAS Build
eas build --profile development --platform android
```

### Step 6: Test Authentication

1. Jalankan development server:
   ```bash
   npx expo start --dev-client
   ```

2. Buka app di device/emulator

3. Test fitur:
   - **Email/Password Login**: Buat akun baru atau login
   - **Google Sign-In**: Klik "Continue with Google"

## 🔍 Troubleshooting

### Error: "No ID token found"
- Pastikan `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` sudah diset
- Pastikan menggunakan **Web Client ID**, bukan Android Client ID
- Pastikan SHA-1 sudah ditambahkan di Firebase

### Error: "Developer error"
- Package name tidak cocok. Pastikan `com.sehanfrs0.Cartify` sama di:
  - `app.json`
  - Firebase Console
  - `google-services.json`

### Error: "SIGN_IN_CANCELLED" (12501)
- User membatalkan proses sign-in (normal behavior)

### Google Sign-In tidak muncul
- Pastikan sudah build development client, bukan Expo Go
- Pastikan Google Play Services tersedia di device

## 📂 Struktur File

```
Cartify/
├── .env                          # Environment variables (TIDAK commit ke git)
├── .env.example                  # Template environment variables
├── google-services.json          # Firebase config untuk Android
├── app.json                      # Expo config dengan plugins
├── src/
│   ├── services/
│   │   ├── authService.ts        # Authentication service
│   │   └── googleSignIn.ts       # Google Sign-In configuration
│   ├── context/
│   │   └── AuthContext.tsx       # Auth context provider
│   └── components/
│       └── auth/
│           ├── LoginScreen.tsx   # Login UI
│           ├── RegisterScreen.tsx # Register UI
│           └── ForgotPasswordScreen.tsx
└── app/
    └── auth.tsx                  # Auth page
```

## 🔒 Security Notes

1. **JANGAN** commit file `.env` ke git (sudah di `.gitignore`)
2. Untuk production, gunakan **Release keystore** dan tambahkan SHA-1-nya juga
3. Aktifkan 2FA di akun Firebase Anda

## 🚀 Mendapatkan SHA-1 untuk Release Build

Untuk release build (production), Anda perlu keystore lain:

```bash
# Dengan EAS (recommended)
eas credentials

# Manual dengan keytool
keytool -list -v -keystore your-release-key.keystore -alias your-alias
```

Tambahkan SHA-1 release ke Firebase Console juga.
