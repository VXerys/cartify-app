# Strategi Git (Git Strategy)

Dokumen ini menjelaskan alur kerja (*workflow*) pengelolaan kode sumber menggunakan Git untuk memastikan kolaborasi yang rapi dan riwayat perubahan yang jelas.

## 1. Model Percabangan (Branching Model)
Kami mengadopsi variasi sederhana dari **GitFlow**:

-   `main` (atau `master`):
    -   Cabang produksi. Kode di sini harus stabil, teruji, dan siap rilis.
-   `develop`:
    -   Cabang pengembangan utama. Semua fitur baru digabungkan (*merge*) ke sini sebelum ke `main`.
-   `feature/*`:
    -   Cabang untuk pengembangan fitur spesifik. Dibuat dari `develop` dan digabungkan kembali ke `develop`.
    -   Format Penamaan: `feature/nama-fitur-singkat`
    -   Contoh: `feature/voice-logic`, `feature/sqlite-setup`, `feature/ui-cart`.

## 2. Pesan Commit (Conventional Commits)
Kami menerapkan standar **Conventional Commits** untuk membuat riwayat commit mudah dibaca dan dipahami.

### Format
`<tipe>: <deskripsi singkat>`

### Tipe Commit yang Digunakan
| Tipe | Kegunaan | Contoh |
| :--- | :--- | :--- |
| `feat` | Menambahkan fitur baru. | `feat: setup sqlite database connection` |
| `fix` | Memperbaiki *bug* atau kesalahan. | `fix: camera permission crash on android` |
| `docs` | Perubahan pada dokumentasi. | `docs: add installation guide` |
| `style` | Perubahan format (spasi, titik koma) tanpa mengubah logika. | `style: format code with prettier` |
| `refactor` | Perubahan kode yang bukan fitur baru maupun perbaikan bug. | `refactor: simplify cart calculation logic` |
| `chore` | Tugas pemeliharaan (update dependensi, konfigurasi build). | `chore: update expo sdk to version 50` |

### Aturan Tambahan
-   Gunakan bahasa Inggris imperatif untuk pesan commit (misal: "add" bukan "added").
-   Jaga agar baris pertama tidak lebih dari 50 karakter jika memungkinkan.
