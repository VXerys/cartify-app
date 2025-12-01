# Metodologi Pengembangan (SDLC)

Proyek ini menggunakan model **Prototyping** dalam siklus pengembangan perangkat lunak (SDLC). Model ini dipilih karena memungkinkan iterasi cepat dan umpan balik pengguna yang berkesinambungan, yang sangat penting untuk menyesuaikan fitur interaksi suara dan logika anggaran agar sesuai dengan kebutuhan nyata pengguna.

Berikut adalah pemetaan fase Prototyping terhadap pengembangan **Cartify**:

## 1. Communication (Komunikasi & Analisis Kebutuhan)
Fase ini berfokus pada pemahaman masalah dan pengumpulan kebutuhan dari literatur riset (*Paper-VoiceCart-v2*).
-   **Aktivitas:** Menganalisis masalah konsumen ritel (lupa harga, *overspending*).
-   **Output:** Definisi fitur utama seperti Input Suara (*Voice Command*), Pemindai Barcode, dan Peringatan Anggaran (*Budget Alert*).

## 2. Quick Plan (Perencanaan Cepat)
Merancang struktur dasar teknis untuk mendukung kebutuhan "Hybrid Offline-First".
-   **Aktivitas:**
    -   Merancang struktur folder berbasis fitur (`src/features`).
    -   Merancang skema database **SQLite** untuk penyimpanan lokal.
    -   Menentukan alur autentikasi menggunakan **Firebase**.
-   **Output:** Arsitektur sistem dan *Entity Relationship Diagram* (ERD) awal.

## 3. Modeling / Quick Design (Pemodelan & Desain)
Fase pembuatan antarmuka pengguna (UI) dan alur pengalaman pengguna (UX).
-   **Aktivitas:**
    -   Mengimplementasikan desain UI menggunakan **NativeWind** (Tailwind CSS untuk React Native).
    -   Membuat *wireframe* layar utama: Beranda, Keranjang Belanja, dan Pengaturan Anggaran.
-   **Output:** Prototipe antarmuka yang siap dikodekan.

## 4. Construction (Konstruksi & Pengkodean)
Tahap penulisan kode program dan integrasi fungsi utama.
-   **Aktivitas:**
    -   Mengembangkan logika *Voice-to-Text* (STT) dan *Text-to-Speech* (TTS).
    -   Mengintegrasikan **SQLite** untuk operasi CRUD (*Create, Read, Update, Delete*) produk dan keranjang secara offline.
    -   Mengimplementasikan logika validasi anggaran.
-   **Output:** Aplikasi Cartify versi Alpha/Beta yang dapat dijalankan di perangkat.

## 5. Deployment & Feedback (Pengujian & Umpan Balik)
Tahap pengujian validitas dan fungsionalitas aplikasi oleh pengguna atau penguji.
-   **Aktivitas:**
    -   Melakukan *User Acceptance Testing* (UAT) untuk memvalidasi hipotesis efisiensi dan reliabilitas.
    -   Menguji ketahanan aplikasi saat mode *offline* (tanpa internet).
-   **Output:** Laporan pengujian dan daftar perbaikan (jika ada) untuk iterasi selanjutnya.
