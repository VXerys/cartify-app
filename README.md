# Cartify - Smart Voice Shopping

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/index.html)

**Judul Penelitian:** PENGEMBANGAN ASISTEN BELANJA PINTAR BERBASIS INTERAKSI SUARA UNTUK PENGENDALIAN PENGELUARAN KONSUMEN RITEL FISIK

---

## 👨‍🎓 Informasi Mahasiswa
| Nama | NIM | Kelas | Prodi |
| :--- | :--- | :--- | :--- |
| **M. Sechan Alfarisi** | **202300040094** | **TI23F** | **Teknik Informatika** |

**Dosen Pengampu:**
- **Nugraha, M.Kom** (Mobile Device Programming)
- **Ivana Lucia Kharisma, M.Kom** (Metodologi Penelitian)

---

## 📱 Pengantar
**Cartify** adalah asisten belanja cerdas yang dirancang untuk membantu konsumen ritel fisik mengelola pengeluaran mereka secara *real-time*. Dengan fitur utama **Perintah Suara (Voice Command)**, aplikasi ini memecahkan masalah kerepotan mengetik saat membawa barang belanjaan. Aplikasi ini dibangun dengan arsitektur **Hybrid Offline-First**, memastikan fungsi belanja inti tetap berjalan lancar menggunakan **SQLite** bahkan saat berada di area "blind spot" sinyal di dalam supermarket.

## 📚 Indeks Dokumentasi
Berikut adalah dokumentasi lengkap pengembangan proyek ini untuk memenuhi standar Akademik dan Teknis:

- [🆔 **Identitas & Abstrak**](./docs/PROJECT_IDENTITY.md) - Ringkasan proyek dan rumusan masalah.
- [🔄 **Metodologi (SDLC)**](./docs/SDLC_METHODOLOGY.md) - Penerapan model *Prototyping* dalam pengembangan.
- [🏗️ **Arsitektur Teknis**](./docs/TECHNICAL_ARCHITECTURE.md) - Tech stack dan strategi *Hybrid Offline-First*.
- [🗄️ **Skema Database**](./docs/DATABASE_SCHEMA.md) - Struktur tabel SQLite untuk penyimpanan lokal.
- [🧪 **Strategi Pengujian**](./docs/TESTING_STRATEGY.md) - UAT, Unit Test, dan Validasi Hipotesis (H1, H2, H3).
- [🌿 **Strategi Git**](./docs/GIT_STRATEGY.md) - Manajemen *source code* dan percabangan.
- [📖 **Panduan Penggunaan**](./docs/USER_GUIDE.md) - Cara menggunakan fitur suara, scan, dan anggaran.

## 🚀 Instalasi & Menjalankan Aplikasi

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) dan lingkungan pengembangan [Expo](https://expo.dev/).

```bash
# 1. Clone repositori
git clone https://github.com/username/cartify.git
cd cartify

# 2. Instal dependensi
npm install

# 3. Jalankan aplikasi
npx expo start
```

Pindai kode QR yang muncul dengan aplikasi **Expo Go** (Android/iOS) untuk mencoba Cartify di perangkat fisik Anda.
