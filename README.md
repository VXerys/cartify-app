# Cartify: Assistant Belanja Cerdas Berbasis Voice AI (Indonesian Context)

![University Header](https://img.shields.io/badge/UNIVERSITAS-NUSA_PUTRA-blue?style=for-the-badge&logo=school)
![Course](https://img.shields.io/badge/COURSE-Research_Methodology_%26_Mobile_Programming-green?style=for-the-badge)
![Status](https://img.shields.io/badge/STATUS-Active_Development-orange?style=for-the-badge)
![License](https://img.shields.io/badge/LICENSE-MIT-lightgrey?style=for-the-badge)

> **Tugas Akademik: Research Methodology & Mobile Programming**
>
> *"PENGEMBANGAN ASISTEN BELANJA PINTAR BERBASIS INTERAKSI SUARA UNTUK PENGENDALIAN PENGELUARAN KONSUMEN RITEL FISIK"*

---

## 👤 Informasi Pengembang

| Atribut | Detail |
| :--- | :--- |
| **Nama** | **M. Sechan Alfarisi** |
| **NIM** | **20230040094** |
| **Kelas** | **TI23F** |
| **Program Studi** | **Teknik Informatika** |

---

## 📖 Deskripsi Proyek

**Cartify** adalah solusi mobile inovatif yang dirancang untuk memitigasi fenomena *Checkout Shock*—kondisi kecemasan akibat ketidakpastian total belanja saat konsumen berada di antrian kasir. Aplikasi ini menggabungkan kecepatan pemrosesan lokal dengan kecerdasan buatan berbasis cloud dalam **Hybrid AI Architecture**:

1.  **On-Device ASR (Automatic Speech Recognition):** Menggunakan modul native (`expo-speech-recognition`) untuk menangkap input suara pengguna secara instan tanpa latensi jaringan yang signifikan pada tahap transkripsi.
2.  **Cloud Gen-AI (Groq - Llama 3.1):** Bertindak sebagai "otak" semantik yang menganalisis teks transkripsi. Modul ini dilatih (via *system checking*) untuk memahami:
    - **Slang Ritel Indonesia:** "Goceng" (5.000), "Ceban" (10.000), "Setengah kilo".
    - **Konteks Unit Price:** Membedakan antara harga total ("harganya 20 ribu") dengan harga satuan ("masing-masing 20 ribu").
    - **Koreksi Merek:** Memperbaiki penyebutan fonetik (e.g., "Grin Tih" -> "Green Tea").

---

## 🌟 Fitur Utama & Kapabilitas

### 1. 🎙️ Advanced Natural Language Understanding (NLU)
Tidak ada perintah kaku seperti *"Tambah item susu"*. Pengguna berbicara secara natural:
> *"Tolong masukin dua kotak susu kental manis yang harganya dua belas ribu per kaleng."*
AI akan mengekstrak: `{ item: "Susu Kental Manis", qty: 2, price: 24000, context: "unit_price" }`

### 2. ⚡ Real-time Budget Control
- **Dynamic Calculation:** Total belanja dihitung ulang setiap kali item ditambahkan.
- **Visual Alert System:** Indikator visual berubah warna saat total belanja mendekati batas anggaran yang ditetapkan pengguna.

### 3. 💾 Secure Local Storage (Offline-Ready Database)
Menggunakan **SQLite** untuk persistensi data yang kuat. Data riwayat belanja, preferensi, dan log transaksi disimpan sepenuhnya di perangkat pengguna. Koneksi internet hanya dibutuhkan sepersekian detik saat pemrosesan suara via Groq API.

### 4. 🎨 Human-Centric Interface
- **Haptic Feedback:** Memberikan respon getaran halus saat interaksi sukses, meniru sensasi fisik menekan tombol.
- **Adaptive Theme:** Mendukung Mode Gelap (Dark Mode) dan Terang secara otomatis mengikuti pengaturan sistem.

---

## 🛠️ Spesifikasi Teknis (Tech Stack)

Aplikasi ini dibangun di atas fondasi teknologi modern yang memprioritaskan performa, skalabilitas, dan pengalaman pengembang (DX).

### Core & Framework
| Teknologi | Kegunaan |
| :--- | :--- |
| **React Native** | Framework UI cross-platform (Android/iOS). |
| **Expo SDK 52** | Ekosistem pengembangan modern untuk integrasi hardware mudah. |
| **TypeScript** | Menjamin keamanan tipe data dan mengurangi bug runtime. |

### Data & State Management
| Teknologi | Kegunaan |
| :--- | :--- |
| **Zustand** | Manajemen state global yang minimalis dan performa tinggi (menggantikan Redux). |
| **Expo SQLite** | Database SQL relasional embedded untuk penyimpanan data offline. |
| **TanStack Query** | Manajemen state asinkron server (future-proof). |

### Artificial Intelligence & Services
| Layanan | Peran |
| :--- | :--- |
| **Groq Cloud** | Penyedia inferensi LPU (Language Processing Unit) untuk latensi ultra-rendah. |
| **Llama 3.1 8B** | Model bahasa besar (LLM) yang dioptimalkan untuk instruksi kompleks. |

---

## 🚀 Panduan Instalasi & Pengembangan

### Prasyarat
- **Node.js** v18.x atau lebih baru.
- **Git** version control.
- **Expo Go** pada perangkat fisik (Android/iOS) atau Emulator.
- **API Key Groq** (Wajib untuk fitur AI).

### Langkah Instalasi

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/Cartify.git
    cd Cartify
    ```

2.  **Instalasi Dependensi**
    ```bash
    npm install
    # Disarankan menggunakan npm untuk kompatibilitas lockfile
    ```

3.  **Konfigurasi Environment Variable (.env)**
    Duplikasi file `.env.example` (jika ada) atau buat file `.env` baru di root:
    ```env
    EXPO_PUBLIC_GROQ_API_KEY=gsk_your_primary_key_here
    EXPO_PUBLIC_GROQ_API_KEY_2=gsk_backup_key_1       # Opsional: Untuk failover
    EXPO_PUBLIC_GROQ_API_KEY_3=gsk_backup_key_2       # Opsional: Untuk stabilitas
    ```

4.  **Menjalankan Development Server**
    ```bash
    npx expo start
    ```
    - Tekan `a` di terminal untuk membuka Android Emulator.
    - Tekan `i` di terminal untuk membuka iOS Simulator.
    - Scan QR Code menggunakan aplikasi **Expo Go** di HP fisik.

---

## 📱 Panduan Penggunaan & Tips Akurasi

Untuk hasil pengenalan suara terbaik, ikuti panduan berikut:

### Format Perintah Suara Efektif

| Skenario | Contoh Perintah | Output AI yang Diharapkan |
| :--- | :--- | :--- |
| **Belanja Standar** | *"Beli satu Roti Tawar harga lima belas ribu"* | Item: Roti Tawar, Price: 15.000 |
| **Harga Satuan** | *"Dua Yakult **masing-masing** dua ribu lima ratus"* | Item: Yakult (x2), Price: 5.000 |
| **Slang Mata Uang** | *"Ambil Indomie goreng lima bungkus harganya **Ceban**"* | Item: Indomie Goreng (x5), Price: 10.000 |
| **Koreksi Implisit** | *"Tisu Paseo harganya 10"* (Context: Ribu) | Item: Tisu Paseo, Price: 10.000 |

### Tips Troubleshooting
1.  **Suara tidak terdeteksi:** Pastikan izin mikrofon telah diberikan ke aplikasi Expo Go/Cartify.
2.  **Respon AI Lambat:** Cek koneksi internet Anda. AI membutuhkan koneksi stabil ke server Groq.
3.  **Error Rate Limit:** Jika banyak request dalam waktu singkat, sistem akan otomatis beralih ke API Key cadangan (jika dikonfigurasi).

---

## 🏗️ Arsitektur Direktori (Clean Architecture)

Struktur folder disusun untuk memisahkan *UI Presentation*, *Business Logic*, dan *Data Access*.

```text
Cartify/
├── app/                  # [PRESENTATION LAYER] Expo Router
│   ├── (tabs)/           # Main Screens (Home, History, Settings)
│   ├── transaction/      # Detail Transaction Views
│   └── _layout.tsx       # Root Layout & Providers
│
├── src/                  # [CORE APPLICATION LOGIC]
│   ├── components/       # Atomic UI Components
│   │   ├── ui/           # Primitives (Button, Text, Card)
│   │   └── business/     # Complex Widgets (TransactionCard)
│   ├── hooks/            # Custom Hooks (Logic Encapsulation)
│   │   ├── useVoice.ts   # ASR Logic
│   │   └── useCart.ts    # Cart Manipulation Logic
│   ├── services/         # External Services
│   │   ├── groq.ts       # AI Integration Layer
│   │   └── db.ts         # SQLite Database Layer
│   └── store/            # State Management (Zustand Stores)
│
├── assets/               # Static Assets (Fonts, Images)
└── .env                  # Environment Secrets
```

---

## 🤝 Kontribusi & Lisensi

Proyek ini merupakan bagian dari tugas akhir mata kuliah dan bersifat **Open Source** untuk tujuan edukasi.
**License**: MIT License.

---
*Dikembangkan oleh M. Sechan Alfarisi (20230040094) - Teknik Informatika, Universitas Nusa Putra.*
