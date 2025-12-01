# Peta Jalan Pengembangan (Future Roadmap)

Mengingat Cartify saat ini berada pada tahap **Minimum Viable Product (MVP)** dengan fokus eksklusif pada validasi interaksi suara, dokumen ini menguraikan visi pengembangan jangka panjang untuk menyempurnakan aplikasi menjadi asisten belanja yang komprehensif.

## Fase 1: MVP Voice-First (Status: Saat Ini)
-   **Fokus:** Validasi inti teknologi *Speech-to-Text* dan algoritma pencocokan nama produk (*Fuzzy Logic*).
-   **Fitur:** Input suara, kalkulasi anggaran real-time, manajemen database lokal (SQLite).
-   **Tujuan:** Membuktikan bahwa input suara lebih efisien daripada mengetik untuk pencatatan belanja.

## Fase 2: Visual & Personalisasi (Jangka Pendek)
-   **Katalog Produk Visual:** Menambahkan gambar (*thumbnail*) pada daftar produk untuk memudahkan identifikasi visual.
-   **Kategori Belanja:** Mengelompokkan item berdasarkan lorong supermarket (misal: Produk Segar, Kebersihan, Makanan Ringan) untuk mengurutkan daftar belanja secara logis.
-   **Tema Aplikasi:** Menambahkan opsi mode gelap (*Dark Mode*) dan kustomisasi warna antarmuka.

## Fase 3: Integrasi Hardware & Hybrid Input (Jangka Menengah)
-   **Barcode Scanner (Re-integrasi):** Mengembalikan fitur pemindaian barcode kamera untuk produk yang sulit diidentifikasi lewat suara atau memiliki nama yang sangat umum/ambigu.
-   **OCR Struk:** Fitur untuk memindai struk belanja fisik di akhir sesi untuk memverifikasi akurasi harga yang dicatat aplikasi vs harga kasir.

## Fase 4: Analitik Cerdas & Cloud (Jangka Panjang)
-   **Analisis Inflasi:** Melacak kenaikan harga produk tertentu dari waktu ke waktu berdasarkan riwayat belanja pengguna.
-   **Pola Kebiasaan:** Grafik statistik yang menunjukkan kategori pengeluaran terbesar pengguna (misal: "Bulan ini Anda menghabiskan 40% anggaran untuk camilan").
-   **Sinkronisasi Multi-Device:** Menyimpan data database SQLite ke Cloud (Firestore) agar riwayat belanja dapat diakses dari perangkat berbeda.
