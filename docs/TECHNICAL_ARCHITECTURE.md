# Arsitektur Teknis

Dokumen ini menjelaskan tumpukan teknologi (*Tech Stack*) dan strategi arsitektur yang digunakan dalam pengembangan **Cartify (MVP Voice-First)**.

## 1. Teknologi (Tech Stack)

| Kategori | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | **React Native (Expo)** | Framework pengembangan lintas platform (*Cross-Platform*). |
| **Bahasa** | **TypeScript** | Superset JavaScript untuk keamanan tipe data (*Type Safety*). |
| **Styling** | **NativeWind** | Utilitas styling berbasis Tailwind CSS untuk React Native. |
| **Database Lokal** | **SQLite (expo-sqlite)** | Penyimpanan data produk dan sesi belanja secara lokal. |
| **Autentikasi** | **Firebase Auth** | Layanan manajemen pengguna (Login/Register). |
| **Voice Input** | **@react-native-voice/voice** | Menangkap audio pengguna dan mengubahnya menjadi teks. |
| **Voice Output** | **Expo Speech** | Memberikan umpan balik audio (TTS) kepada pengguna. |
| **Algoritma** | **Levenshtein Distance** | Logika *Fuzzy Matching* untuk pencocokan nama produk. |

## 2. Struktur Proyek & Pemrosesan Suara

Aplikasi ini disusun dalam lapisan-lapisan (*layers*) pemrosesan untuk menangani input suara yang tidak terstruktur menjadi data transaksi yang valid.

### Layer 1: Persepsi (Perception Layer)
Lapisan ini bertanggung jawab untuk menangkap input fisik dari pengguna.
-   **Teknologi:** `@react-native-voice/voice` dan `expo-speech`.
-   **Fungsi:** Mendengarkan frasa pengguna (misal: "Beli dua liter minyak") dan mengubahnya menjadi string mentah (*Raw String*).

### Layer 2: Kognisi (Cognition Layer)
Lapisan kecerdasan yang menerjemahkan string mentah menjadi maksud (*intent*) dan data terstruktur.
-   **Teknologi:** JavaScript Logic & Fuzzy Search (Levenshtein).
-   **Logika:**
    1.  **Parsing:** Memisahkan kuantitas (angka) dari nama barang.
        -   Input: "Lima Indomie" -> Qty: 5, Item: "Indomie".
    2.  **Matching:** Mencocokkan kata kunci "Indomie" dengan database lokal.
        -   Jika user mengucap "Indomi", algoritma Levenshtein akan mencari kecocokan terdekat di tabel `products` (misal: "Indomie Goreng") berdasarkan skor kemiripan.
    3.  **Fallback:** Jika produk tidak ditemukan, sistem meminta pengguna memasukkan harga secara manual.

### Layer 3: Persistensi (Persistence Layer)
Lapisan penyimpanan data offline.
-   **Teknologi:** SQLite.
-   **Fungsi:** Menyimpan data produk, keranjang belanja, dan riwayat sesi secara lokal di perangkat.

## 3. Strategi Hybrid Offline-First
Meskipun fokus pada Suara, prinsip offline tetap dipertahankan:
-   **Autentikasi (Online):** Firebase Auth digunakan di awal sesi untuk identitas.
-   **Operasi Inti (Offline):** Seluruh proses pengenalan suara (jika didukung OS secara offline) dan pencarian database produk dilakukan secara lokal untuk kecepatan respons instan.
