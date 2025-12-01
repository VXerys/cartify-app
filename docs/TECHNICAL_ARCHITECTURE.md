# Arsitektur Teknis: Cloud-Native GenAI

Dokumen ini menjelaskan transformasi arsitektur **Cartify** menjadi sistem *Cloud-Native Generative AI* (Versi 2.0).
Perubahan mendasar terletak pada pemindahan "otak" pemrosesan dari logika lokal (*Fuzzy Logic*) ke *Multimodal AI* di Cloud menggunakan **Google Gemini 1.5 Flash**.

## 1. Filosofi Desain: "Dumb Client, Genius Cloud"
Untuk menjaga aplikasi tetap ringan (*lightweight*) dan hemat baterai, perangkat seluler hanya bertugas sebagai alat perekam dan penampil data. Seluruh beban kognitif (memahami ucapan, memisahkan entitas, mengonversi angka) diserahkan kepada API Gemini.

## 2. Diagram Alur Data (Data Flow)

```mermaid
graph TD
    User(User Voice) -->|Input: '2 Susu 5 Ribu'| Mic[Device: Expo AV]
    Mic -->|Raw Audio File .m4a| Cloud[Google Gemini 1.5 Flash API]
    Cloud -->|Processing: Speech-to-JSON| JSON[Parsed Data]
    JSON -->|{qty: 2, item: 'Susu', price: 5000}| SQLite[Device: Local DB]
    SQLite -->|Update UI| UI[Budget Progress Bar]
```

## 3. Komponen Utama

### Layer 1: Persepsi Pasif (Device Side)
-   **Teknologi:** `expo-av` (React Native Audio).
-   **Fungsi:** Merekam suara pengguna secara efisien.
-   **Karakteristik:** "Bodoh" (*Dumb*). Tidak ada pemrosesan AI, tidak ada *Levenshtein Distance*, tidak ada model ML di perangkat. Hanya memastikan kualitas audio cukup jernih untuk dikirim.

### Layer 2: Kognisi Generatif (Cloud Side)
-   **Teknologi:** **Google Gemini 1.5 Flash** (via REST API).
-   **Kemampuan:** *Native Audio Understanding* (Multimodal).
-   **Mengapa Gemini 1.5 Flash?**
    -   **Kecepatan:** Model "Flash" dioptimalkan untuk latensi rendah, krusial untuk UX belanja real-time.
    -   **Akurasi Konteks:** Mampu membedakan antara "Tiga" (Jumlah) dan "Tiga Roda" (Nama Barang) jauh lebih baik daripada penggabungan STT + Regex tradisional.
    -   **Efisiensi Biaya:** Menghilangkan kebutuhan akan layanan STT terpisah (seperti Google Cloud Speech) dan layanan NLP terpisah.

### Layer 3: Penyimpanan Data (Persistence)
-   **Teknologi:** **SQLite**.
-   **Fungsi:** Menyimpan hasil *parsing* JSON dari Gemini ke dalam tabel `session_items`.
-   **Penting:** Data harga tidak diambil dari "Master Produk", melainkan disimpan berdasarkan apa yang diucapkan pengguna (*User-Dictated Price*). Ini memberikan fleksibilitas total tanpa perlu memelihara database harga produk yang masif dan sering kedaluwarsa.

## 4. Keuntungan Arsitektur Baru
1.  **Tanpa Ketergantungan Barcode:** Pengguna mendiktekan harga, mengatasi masalah produk tanpa barcode atau barcode rusak.
2.  **Ukuran Aplikasi Kecil:** Tidak perlu membundel model ML berat (TensorFlow Lite) di dalam aplikasi.
3.  **Skalabilitas:** Pembaruan logika pemahaman bahasa dapat dilakukan di sisi *Prompting* tanpa perlu merilis ulang aplikasi di Play Store.
