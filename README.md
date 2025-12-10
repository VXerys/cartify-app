# Cartify: Asisten Belanja Pintar Berbasis Interaksi Suara (Hybrid AI)

![University Header](https://img.shields.io/badge/UNIVERSITAS-NUSA_PUTRA-blue?style=for-the-badge&logo=school)
![Course](https://img.shields.io/badge/COURSE-Research_Methodology_%26_Mobile_Programming-green?style=for-the-badge)

> **Tugas Akademik: Research Methodology & Mobile Programming**
>
> Proyek ini menjembatani penelitian akademis tentang "Human-Computer Interaction (HCI)" dengan implementasi teknik rekayasa perangkat lunak modern pada platform mobile.

## 👤 Informasi Mahasiswa

| Atribut | Detail |
| :--- | :--- |
| **Nama** | **M. Sechan Alfarisi** |
| **NIM** | **20230040094** |
| **Kelas** | **TI23F** |
| **Program Studi** | **Teknik Informatika** |

---

## 📝 Abstrak Proyek

*"This research develops 'Cartify' (VoiceCart), a mobile application with a Hybrid AI architecture designed to address the gap between conventional system accuracy and the need for real-time budget management in physical retail. The system integrates on-device Automatic Speech Recognition (ASR) for instant transcription and Large Language Model (LLM) logic for semantic understanding, enabling users to track spending via voice commands without relying on rigid keyword matching."*

### Latar Belakang Masalah (Problem Statement)
*"In in-situ shopping contexts, consumers suffer from significant cognitive load due to split attention between product selection and budget tracking. The lack of visibility into real-time total spending often exposes consumers to 'checkout shock' and financial anxiety. Conventional voice assistants fail to solve this because they rely on rigid keywords that cannot handle complex, natural shopping intent."*

---

## 🛠️ Tech Stack & Architecture

Aplikasi ini dibangun dengan pendekatan **"Offline-First"** dan **"Cloud-Native Generative AI"**, mengutamakan performa dan pengalaman pengguna yang intuitif.

### Core Framework
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Logic & Data Layer
![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=ai&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=for-the-badge)

### Hardware Integration
- **Voice Input:** `expo-speech-recognition` (On-Device ASR)
- **Haptics:** `expo-haptics` (Feedback Taktil)

---

## 🔬 Keselarasan Fitur & Penelitian

Tabel ini memetakan fitur teknis aplikasi terhadap masalah penelitian yang diselesaikan:

| Masalah Penelitian (Research Problem) | Solusi Fitur Aplikasi | Teknologi Pendukung |
| :--- | :--- | :--- |
| **Cognitive Load** (Beban mental saat menghitung manual) | **Voice-First Input** (Input suara natural tanpa ketik) | `expo-speech-recognition` |
| **Checkout Shock** (Keterkejutan total harga di kasir) | **Real-time Budget Tracking** (Kalkulasi otomatis) | `Zustand` & `SQLite` |
| **Rigid Keywords** (Perintah suara kaku/standar) | **Natural Language Understanding (NLU)** | **Groq (Llama 3.1 8B)** |
| **Dependensi Internet** (Aplikasi lambat/mati tanpa sinyal) | **Offline-First Database** (Simpan data di lokal) | `expo-sqlite` |

---

## 🏗️ Arsitektur Aplikasi (Clean Architecture)

Proyek ini menerapkan prinsip **Separation of Concerns** untuk memisahkan UI/UX dari Logika Bisnis, memudahkan pengujian dan pengembangan lanjut.

```text
root/
├── app/                  # [PRESENTATION LAYER]
│   ├── (tabs)/           # Layar Utama (Home, History, Settings)
│   ├── transaction/      # Layar Transaksi
│   └── _layout.tsx       # Routing Configuration (Expo Router)
│
├── src/                  # [DOMAIN & DATA LAYER]
│   ├── services/         # Business Logic Utama
│   │   ├── groqService.ts   # Integrasi AI Llama 3.1 (Parsing Suara)
│   │   └── db.ts            # Manajemen Database Lokal (SQLite)
│   ├── hooks/            # Logic Encapsulation (e.g., useVoiceInput)
│   ├── components/       # Reusable UI Components
│   └── data/             # Static Data & Types
```

---

## 🚀 Panduan Instalasi

Pastikan Anda telah menginstal **Node.js** dan lingkungan pengembangan **Expo**.

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Jalankan Aplikasi**
   ```bash
   npx expo start
   ```

3. **Pilih Metode Testing**
   - Scan QR Code dengan aplikasi **Expo Go** (Android/iOS).
   - Tekan `a` untuk membuka di Android Emulator.
   - Tekan `i` untuk membuka di iOS Simulator.

---

## 📱 Panduan Penggunaan (User Guide)

### 1. Speak (Input Suara) 🎙️
Fitur utama untuk mencatat belanjaan tanpa mengetik.
- Tekan **Tombol Mikrofon** di layar utama.
- Ucapkan perintah belanja secara natural.
  - *Contoh:* "Beli 2 Roti Tawar dan satu kotak susu harganya 50 ribu."
- AI (Llama 3.1) akan otomatis mengekstrak:
  - **Nama Produk:** "Roti Tawar", "Susu"
  - **Jumlah (Qty):** 2, 1
  - **Harga:** Dideteksi dari ucapan (Smart Calculation).

### 2. Track (Pemantauan Anggaran) 📊
- Lihat total pengeluaran secara **Real-time** di Dashboard.
- Sistem akan memberi peringatan visual jika pengeluaran mendekati batas anggaran yang ditetapkan.

### 3. Review (Riwayat Belanja) 📝
- Semua data tersimpan secara lokal (Offline).
- Akses tab **History** untuk melihat riwayat belanja sebelumnya.

---

> **Catatan Pengembang:**
> Aplikasi ini menggunakan **Groq AI (Llama 3.1 8B Instant)** untuk pemrosesan bahasa alami yang sangat cepat, memungkinkan pengalaman "Conversational Commerce" yang responsif.
