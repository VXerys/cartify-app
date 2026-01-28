# Dokumentasi Testing UI (Jest + React Native)

Dokumen ini merangkum testing UI yang sudah dibuat pada proyek Cartify, termasuk apa yang dites dan cara menjalankannya.

## Cara Menjalankan Test

Menjalankan satu test tertentu:
- npm run test -- <NamaTest>

Contoh:
- npm run test -- HelpCenterScreen
- npm run test -- HistoryScreen
- npm run test -- SettingsScreen

Menjalankan semua test:
- npm run test

## Daftar Screen yang Sudah Ditest

### 1) Help Center
- File test: src/__tests__/HelpCenterScreen.test.tsx
- Fokus:
  - Render konten utama (judul, intro, FAQ, tombol email)
  - Tombol back memanggil router.back()

### 2) Terms & Policy
- File test: src/__tests__/TermsPolicyScreen.test.tsx
- Fokus:
  - Render judul dan section utama
  - Tombol back memanggil router.back()

### 3) Security & Privacy
- File test: src/__tests__/SecurityPrivacyScreen.test.tsx
- Fokus:
  - Render section utama (Keamanan, Data & Privasi, Zona Bahaya)
  - Tombol back memanggil router.back()

### 4) Onboarding
- File test: src/__tests__/OnboardingPage.test.tsx
- Fokus:
  - Menampilkan splash screen awal
  - Transisi ke onboarding
  - Tombol Get Started / Login mengarah ke /auth

### 5) Modal
- File test: src/__tests__/ModalScreen.test.tsx
- Fokus:
  - Render konten modal

### 6) Settings (Main Screen)
- File test: src/__tests__/SettingsScreen.test.tsx
- Fokus:
  - Render section utama
  - Navigasi ke Help Center, Security, Terms

### 7) History (Main Screen)
- File test: src/__tests__/HistoryScreen.test.tsx
- Fokus:
  - Render empty state
  - Toggle kalender

### 8) Home (Main Screen)
- File test: src/__tests__/HomeScreen.test.tsx
- Fokus:
  - Render empty cart state

### 9) Transaction Detail
- File test: src/__tests__/TransactionDetailScreen.test.tsx
- Fokus:
  - Render not-found state
  - Tombol back memanggil router.back()

### 10) Tabs Layout
- File test: src/__tests__/TabsLayout.test.tsx
- Fokus:
  - Registrasi tab index, history, settings

### 11) Root Layout
- File test: src/__tests__/RootLayout.test.tsx
- Fokus:
  - Navigation guard redirect ke /onboarding saat user belum login

## Catatan Umum

- Untuk komponen native yang sulit di-test, digunakan mock di jest.setup.js.
- Beberapa komponen UI dan service dimock agar test tetap deterministik.

## Sisa Screen yang Belum Ditest

- app/transaction/_layout.tsx

Jika ingin menambah test baru, gunakan pola “render + interaksi” seperti di file test yang sudah ada.
