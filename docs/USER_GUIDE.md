# Panduan Penggunaan (User Guide)

Selamat datang di **Cartify**. Panduan ini akan membantu Anda menggunakan aplikasi untuk pengalaman belanja yang lebih cerdas dan hemat.

## 1. Menetapkan Anggaran (Budgeting)
Sebelum mulai berbelanja, sangat disarankan untuk menetapkan batas anggaran agar Cartify dapat memberi peringatan.

1.  Buka aplikasi dan pastikan Anda sudah **Login**.
2.  Di halaman Beranda (*Home*), ketuk kartu **"Atur Anggaran"** atau ikon dompet.
3.  Masukkan nominal batas belanja Anda (contoh: 500.000).
4.  Tekan **"Simpan"**. Indikator sisa anggaran akan muncul di layar utama.

## 2. Memindai Produk (Scanning)
Gunakan fitur ini untuk memasukkan barang yang memiliki barcode.

1.  Ketuk tombol **"Scan"** (ikon kamera) di bagian bawah layar.
2.  Arahkan kamera ponsel ke barcode produk.
3.  Tunggu hingga bunyi *beep* atau getaran.
4.  Produk akan otomatis muncul di daftar belanja dengan harga yang tersimpan.
    -   *Catatan:* Jika produk belum ada di database lokal, Anda akan diminta memasukkan nama dan harganya secara manual untuk pertama kali.

## 3. Menggunakan Perintah Suara (Voice Command)
Fitur unggulan untuk memasukkan barang dengan cepat tanpa menyentuh layar secara intens.

1.  Ketuk tombol **Mikrofon** besar di layar belanja.
2.  Ucapkan perintah dengan jelas. Format yang didukung:
    -   **"Masukan [Nama Barang]"** -> Contoh: *"Masukan Roti"* (Default jumlah 1).
    -   **"Masukan [Jumlah] [Nama Barang]"** -> Contoh: *"Masukan dua kotak Susu"*.
    -   **"Berapa total?"** -> Aplikasi akan menyebutkan total belanjaan saat ini.
3.  Aplikasi akan mengonfirmasi tindakan Anda lewat suara (misal: *"Dua kotak susu ditambahkan"*).

## 4. Mode Offline
Aplikasi akan otomatis beralih ke mode offline jika tidak ada sinyal internet.
-   Anda tetap bisa melakukan Scan dan Perintah Suara.
-   Data disimpan di memori telepon (SQLite).
-   Sinkronisasi riwayat ke server (jika ada) akan terjadi otomatis saat internet kembali tersedia.
