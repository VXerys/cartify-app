# Cartify - Smart Voice Shopping (GenAI Edition)

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)](https://deepmind.google/technologies/gemini/)
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

## 🤖 Pengantar: Cloud-Native GenAI Architecture
**Cartify V2.0** adalah lompatan evolusi dari asisten belanja tradisional. Menginggalkan metode *scan barcode* dan logika *fuzzy* lokal yang terbatas, Cartify kini ditenagai oleh **Google Gemini 1.5 Flash**. Sistem ini memungkinkan pengguna mendiktekan **Jumlah**, **Nama Barang**, dan **Harga** sekaligus dalam satu kalimat alami, memberikan fleksibilitas total tanpa batasan database produk.

## 📚 Indeks Dokumentasi (Updated)
Berikut adalah spesifikasi teknis lengkap untuk arsitektur GenAI ini:

- [🆔 **Identitas & Abstrak**](./docs/PROJECT_IDENTITY.md) - Fokus penelitian pada solusi belanja berbasis suara.
- [☁️ **Arsitektur Teknis (GenAI)**](./docs/TECHNICAL_ARCHITECTURE.md) - Alur data Mic -> Gemini -> SQLite.
- [🔌 **Rencana Integrasi API**](./docs/API_INTEGRATION_PLAN.md) - **(BARU)** Strategi Prompt Engineering untuk Gemini 1.5 Flash.
- [🗄️ **Skema Database**](./docs/DATABASE_SCHEMA.md) - Tabel `session_items` yang diadaptasi untuk output AI.
- [🧪 **Strategi Pengujian**](./docs/TESTING_STRATEGY.md) - Validasi hipotesis parsing "3-Input".
- [🔄 **Metodologi (SDLC)**](./docs/SDLC_METHODOLOGY.md) - Penerapan model *Prototyping*.
- [🔮 **Peta Jalan (Roadmap)**](./docs/FUTURE_ROADMAP.md) - Visi masa depan.
- [🌿 **Strategi Git**](./docs/GIT_STRATEGY.md) - Manajemen kode.
- [📖 **Panduan Penggunaan**](./docs/USER_GUIDE.md) - Cara menggunakan perintah "3-Input".

## 🚀 Instalasi & Menjalankan Aplikasi

Pastikan Anda memiliki API Key Google Gemini sebelum menjalankan aplikasi.

```bash
# 1. Clone repositori
git clone https://github.com/username/cartify.git
cd cartify

# 2. Instal dependensi
npm install

# 3. Konfigurasi API Key (buat file .env)
echo "EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here" > .env

# 4. Jalankan aplikasi
npx expo start
```
