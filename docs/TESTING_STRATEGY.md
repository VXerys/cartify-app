# Strategi Pengujian (Testing Strategy)

Dokumen ini menjelaskan strategi pengujian untuk memvalidasi fungsi teknis dan hipotesis penelitian **Cartify**.

## 1. Pengujian Unit (Unit Testing)
Pengujian unit dilakukan untuk memverifikasi logika bisnis terkecil secara terisolasi. Kami menggunakan framework **Jest**.

### Lingkup Pengujian:
-   **Kalkulasi Keranjang:** Memastikan fungsi penambahan, pengurangan, dan perhitungan subtotal berjalan akurat.
-   **Validasi Anggaran:** Memastikan logika peringatan (*alert*) aktif tepat saat total melebihi batas anggaran yang ditetapkan.
-   **Parsing Perintah Suara:** Menguji fungsi pemrosesan string hasil input suara menjadi aksi (misal: "Dua Apel" -> `{item: "Apel", qty: 2}`).

## 2. User Acceptance Testing (UAT) & Validasi Hipotesis
UAT dilakukan untuk memvalidasi apakah aplikasi memenuhi kebutuhan pengguna dan membuktikan hipotesis penelitian.

### Hipotesis Penelitian
Pengujian ini dirancang untuk menjawab tiga hipotesis utama:
-   **H1 (Efisiensi):** Interaksi suara mengurangi waktu input dibandingkan dengan pengetikan manual.
-   **H2 (Kendali Anggaran):** Peringatan *real-time* mencegah pengeluaran berlebih (*overspending*).
-   **H3 (Reliabilitas Hibrida):** Arsitektur "Offline-First" (SQLite) menjamin pengalaman belanja tidak terputus meskipun koneksi internet hilang, sementara Firebase menjaga keamanan data.

### Checklist UAT

| Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hipotesis Terkait | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Input Suara** | Ucapkan "Masukan 2 Susu" | Item "Susu" dengan jumlah 2 masuk ke keranjang. | **H1** | [ ] |
| **Peringatan Anggaran** | Tambah item hingga total > Limit | Muncul notifikasi suara/visual "Anggaran Terlampaui". | **H2** | [ ] |
| **Mode Offline** | Matikan Data/WiFi -> Scan Produk | Produk tetap terdeteksi dan masuk keranjang (data dari SQLite). | **H3** | [ ] |
| **Login Online** | Nyalakan Data -> Login Firebase | Login berhasil dan masuk ke halaman utama. | **H3** | [ ] |
| **Scan Barcode** | Scan barcode produk fisik | Nama dan harga produk muncul otomatis. | - | [ ] |
| **Hapus Item** | Geser/Tekan tombol hapus | Item hilang dari keranjang dan total berkurang. | - | [ ] |
