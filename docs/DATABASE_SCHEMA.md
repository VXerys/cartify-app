# Skema Database (SQLite) - Versi GenAI

Dokumen ini mendefinisikan struktur database lokal **SQLite** untuk Cartify V2.0. Struktur ini disederhanakan untuk mendukung arsitektur *Cloud-Native GenAI* di mana harga didikte oleh pengguna (*User-Dictated Price*), bukan diambil dari database master produk.

## Perubahan Utama
-   Tabel `products` (Master Data) menjadi **tidak wajib** untuk fungsi inti (opsional untuk *autocomplete* di masa depan).
-   Tabel `cart_items` digantikan/diperbarui menjadi `session_items` dengan kolom yang cocok dengan output JSON dari Gemini.

## Spesifikasi Tabel

### 1. `shopping_sessions`
Mencatat sesi belanja (satu kunjungan toko).

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | ID unik sesi (Auto Increment). |
| `user_id` | TEXT | ID pengguna (Firebase Auth UID). |
| `created_at` | TEXT | Timestamp sesi dimulai (ISO 8601). |
| `budget_limit` | REAL | Batas anggaran yang ditetapkan pengguna (misal: 500000). |
| `total_spent` | REAL | Total aktual (Aggregasi dari `session_items`). |
| `status` | TEXT | Status: 'ACTIVE', 'COMPLETED', 'ARCHIVED'. |

### 2. `session_items` (Inti Data)
Menyimpan item hasil parsing AI. Kolom disesuaikan dengan output JSON Gemini.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | ID unik item. |
| `session_id` | INTEGER | *Foreign Key* ke `shopping_sessions`. |
| `qty` | INTEGER | Jumlah barang (Parsed from Voice). Default: 1. |
| `product_name` | TEXT | Nama produk (Parsed from Voice). |
| `user_input_price`| INTEGER | Harga satuan yang diucapkan pengguna. |
| `subtotal` | INTEGER | `qty` * `user_input_price`. |
| `confidence` | REAL | (Opsional) Skor keyakinan AI jika tersedia, untuk validasi. |

## Hubungan Data (ERD Sederhana)
`shopping_sessions` **(1)** ---- **(N)** `session_items`

## Logika "Tanpa Master Harga"
Dalam arsitektur ini, tidak ada relasi wajib ke tabel `products` master.
-   **Kelebihan:** Fleksibilitas maksimal. Pengguna bisa membeli "Gorengan Abang-abang" yang tidak mungkin ada di database barcode supermarket, dan tetap bisa melacak anggarannya.
-   **Kekurangan:** Pengguna harus menyebutkan harga setiap kali membeli (namun ini diselesaikan dengan kemudahan input suara "3-Input").
