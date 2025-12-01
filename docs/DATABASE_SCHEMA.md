# Skema Database (SQLite)

Dokumen ini mendefinisikan struktur database lokal yang digunakan oleh **Cartify**. Karena fokus pada performa *offline*, **SQLite** dipilih sebagai mesin database utama.

## Konsep
Database SQLite disimpan secara lokal di perangkat pengguna. Ini memungkinkan operasi CRUD (*Create, Read, Update, Delete*) yang sangat cepat tanpa latensi jaringan. Database ini diinisialisasi saat aplikasi pertama kali dijalankan.

## Spesifikasi Tabel

### 1. `products`
Menyimpan data produk yang tersedia atau pernah dipindai. Tabel ini bisa diisi awal (*seed*) atau bertambah seiring pengguna memindai barang baru.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | ID unik produk (Auto Increment). |
| `barcode` | TEXT UNIQUE | Kode batang produk (hasil scan). |
| `name` | TEXT | Nama produk. |
| `price` | REAL | Harga satuan produk. |
| `stock` | INTEGER | (Opsional) Jumlah stok tersedia. |
| `created_at` | TEXT | Tanggal data dibuat (ISO 8601). |

### 2. `cart_items`
Menyimpan item yang saat ini ada dalam keranjang belanja aktif pengguna.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | ID unik item keranjang. |
| `product_id` | INTEGER | *Foreign Key* merujuk ke tabel `products`. |
| `quantity` | INTEGER | Jumlah barang yang dibeli. |
| `subtotal` | REAL | Hasil perhitungan `price` * `quantity`. |

### 3. `transactions`
Menyimpan riwayat belanja yang telah selesai (*checkout*).

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | ID unik transaksi. |
| `total_amount` | REAL | Total akhir belanjaan. |
| `payment_method`| TEXT | Metode pembayaran (misal: "Cash", "QRIS"). |
| `date` | TEXT | Tanggal transaksi selesai. |

## Relasi Antar Tabel
-   **`products` ke `cart_items`**: Relasi **One-to-Many**. Satu produk dapat muncul di banyak entri keranjang (namun dalam konteks satu sesi belanja aktif, biasanya unik per sesi, tetapi secara struktur database memungkinkan relasi ini).
    -   *Constraint:* `FOREIGN KEY (product_id) REFERENCES products (id)`
-   (Opsional) **`transactions` ke `cart_items`**: Jika ingin menyimpan detail historis item per transaksi, tabel `cart_items` dapat memiliki kolom `transaction_id`. Untuk versi saat ini, riwayat hanya menyimpan total per transaksi untuk efisiensi.
