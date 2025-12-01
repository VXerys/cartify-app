# Arsitektur Teknis

Dokumen ini menjelaskan tumpukan teknologi (*Tech Stack*) dan strategi arsitektur yang digunakan dalam pengembangan **Cartify**.

## 1. Teknologi (Tech Stack)

| Kategori | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | **React Native (Expo)** | Framework pengembangan lintas platform (*Cross-Platform*). |
| **Bahasa** | **TypeScript** | Superset JavaScript untuk keamanan tipe data (*Type Safety*). |
| **Styling** | **NativeWind** | Utilitas styling berbasis Tailwind CSS untuk React Native. |
| **Database Lokal** | **SQLite (expo-sqlite)** | Penyimpanan data relasional lokal untuk fitur *offline*. |
| **Autentikasi** | **Firebase Auth** | Layanan manajemen pengguna berbasis *cloud* (memerlukan internet). |
| **Suara (Input)** | **@react-native-voice/voice** | *Speech-to-Text* (STT) untuk mengenali perintah suara pengguna. |
| **Suara (Output)** | **Expo Speech** | *Text-to-Speech* (TTS) untuk memberikan umpan balik audio. |

## 2. Struktur Proyek (Feature-Based)
Aplikasi ini diorganisasikan menggunakan pendekatan *Feature-Based Architecture*. Struktur ini mengelompokkan kode berdasarkan fitur bisnis, bukan berdasarkan jenis file, untuk meningkatkan skalabilitas dan kemudahan perawatan (*maintainability*).

```
src/
├── features/               # Modul fitur utama
│   ├── auth/               # Logika Login/Register (Firebase)
│   ├── cart/               # Logika Keranjang & Penghitungan Total
│   ├── products/           # Manajemen Produk & Barcode Scanner
│   └── voice/              # Mesin pemrosesan perintah suara
├── services/               # Layanan eksternal/global
│   ├── database.ts         # Konfigurasi & Koneksi SQLite
│   ├── firebase.ts         # Konfigurasi Firebase Auth
│   └── api.ts              # (Opsional) Panggilan API eksternal
├── components/             # Komponen UI yang dapat digunakan kembali (Shared)
└── screens/                # Halaman/Layar utama aplikasi
```

## 3. Strategi Hybrid Offline-First
Cartify menerapkan strategi arsitektur **Hybrid Offline-First** untuk menjawab tantangan konektivitas di dalam gedung ritel (supermarket).

### Prinsip Kerja
1.  **Online (Autentikasi & Sinkronisasi Awal):**
    -   Pengguna memerlukan koneksi internet untuk **Login** atau **Register** menggunakan Firebase Auth.
    -   Ini memastikan keamanan data pengguna dan profil yang valid.

2.  **Offline (Inti Pengalaman Belanja):**
    -   Setelah pengguna masuk (*logged in*), seluruh aktivitas belanja (memindai barang, perintah suara, menambah ke keranjang, menghitung total) dilakukan menggunakan **SQLite**.
    -   Data produk dan transaksi disimpan secara lokal di perangkat.
    -   **Alasan:** Sinyal seluler sering kali lemah atau terblokir di dalam supermarket besar. Ketergantungan pada API server untuk setiap tambah barang akan menyebabkan latensi tinggi atau kegagalan fungsi.

### Alur Data
`User Action (Voice/Scan)` -> `Local Processing (JS)` -> `Local DB (SQLite)` -> `Update UI`

Pendekatan ini menjamin aplikasi tetap responsif (*snappy*) dan fungsional 100% saat pengguna berada di lorong belanja, terlepas dari kondisi jaringan.
