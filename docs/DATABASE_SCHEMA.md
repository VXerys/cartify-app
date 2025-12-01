# Skema Database (SQLite)

Dokumen ini mendefinisikan struktur database lokal **SQLite** untuk Cartify versi MVP Voice-First. Struktur ini dioptimalkan untuk pencarian teks cepat (*keyword search*) dan pelacakan anggaran.

## Spesifikasi Tabel

### 1. `products`
Tabel referensi utama untuk pencocokan suara. Kolom `barcode` telah dihapus dan digantikan dengan `keywords` untuk mendukung pencarian fleksibel.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | ID unik produk. |
| `name` | TEXT | Nama lengkap produk (misal: "Susu Ultra Milk Coklat 250ml"). |
| `price` | REAL | Harga satuan produk. |
| `keywords` | TEXT | Kata kunci untuk pencarian suara (misal: "susu, ultra, coklat, milk"). |
| `category` | TEXT | Kategori produk (opsional, untuk pengembangan masa depan). |

### 2. `shopping_sessions` (Dahulu: Transactions)
Tabel ini mencatat riwayat setiap perjalanan belanja, fokus pada performa anggaran.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | ID unik sesi belanja. |
| `user_id` | TEXT | ID pengguna (dari Firebase Auth). |
| `date` | TEXT | Tanggal dan waktu belanja (ISO 8601). |
| `budget_limit` | REAL | Batas anggaran yang ditetapkan pengguna di awal sesi. |
| `total_spent` | REAL | Total aktual yang dibelanjakan. |
| `status` | TEXT | Status sesi (misal: "COMPLETED", "ABORTED"). |

### 3. `cart_items`
Item detil yang ada dalam satu sesi belanja aktif atau tersimpan.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | ID unik item. |
| `session_id` | INTEGER | *Foreign Key* ke tabel `shopping_sessions`. |
| `product_name` | TEXT | Nama produk (disalin dari tabel `products` atau input manual). |
| `price_at_purchase` | REAL | Harga saat transaksi terjadi (untuk menangani perubahan harga). |
| `quantity` | INTEGER | Jumlah barang. |
| `subtotal` | REAL | `price_at_purchase` * `quantity`. |

## Relasi & Optimasi
-   **Pencarian Suara:** Kolom `keywords` pada tabel `products` diindeks (jika memungkinkan di SQLite Expo) atau dibaca ke memori saat inisialisasi untuk mempercepat pencocokan algoritma Levenshtein Distance.
-   **Relasi:** `shopping_sessions` (One) -> `cart_items` (Many).
