# Identitas Proyek & Abstrak

## Informasi Mahasiswa & Proyek
| Atribut | Detail |
| :--- | :--- |
| **Judul Proyek (Akademik)** | **PENGEMBANGAN ASISTEN BELANJA PINTAR BERBASIS INTERAKSI SUARA UNTUK PENGENDALIAN PENGELUARAN KONSUMEN RITEL FISIK** |
| **Nama Aplikasi** | **Cartify - Smart Voice Shopping (MVP)** |
| **Nama Mahasiswa** | M. Sechan Alfarisi |
| **NIM** | 202300040094 |
| **Kelas** | TI23F |
| **Semester** | 5 |
| **Program Studi** | Teknik Informatika |
| **Universitas** | Universitas Nusa Putra |

## Dosen Pengampu
1. **Mobile Device Programming:** Nugraha, M.Kom
2. **Metodologi Penelitian:** Ivana Lucia Kharisma, M.Kom

---

## Abstrak
**Cartify** adalah "Kalkulator Belanja Berbasis Suara" (*Voice-First Shopping Calculator*) yang dirancang untuk mengatasi perilaku pembelian impulsif dan kesulitan pelacakan anggaran di lingkungan ritel fisik. Berbeda dengan aplikasi belanja konvensional, Cartify berfokus pada **interaksi tanpa sentuhan** (*hands-free interaction*) menggunakan teknologi pengenalan suara (*Natural Language Processing*) untuk mencatat item dan harga secara instan.

Dalam versi *Minimum Viable Product* (MVP) ini, penelitian difokuskan pada efektivitas input suara sebagai metode utama pencatatan belanja, menggantikan metode pemindaian barcode atau pengetikan manual yang dinilai kurang efisien bagi pengguna yang sedang bergerak. Aplikasi ini menerapkan arsitektur *Hybrid Offline-First* dengan kemampuan pencocokan kata kunci cerdas (*Fuzzy Logic*) untuk mengenali produk dari database lokal meskipun terjadi sedikit kesalahan pengucapan.

## Rumusan Masalah
Berdasarkan fokus MVP *Voice-First*, rumusan masalah dalam penelitian ini adalah:
1.  Bagaimana efektivitas penggunaan input suara (*Voice Command*) dibandingkan pengetikan manual dalam konteks pencatatan belanja yang cepat (*Rapid Logging*)?
2.  Apakah umpan balik audio dan visual mengenai sisa anggaran secara *real-time* dapat secara efektif menghentikan perilaku belanja impulsif saat pengguna mendekati batas anggaran?
3.  Bagaimana mekanisme pencocokan teks (*String Matching*) dapat dioptimalkan untuk mengenali variasi pengucapan nama produk oleh pengguna?

## Batasan Masalah (Scope MVP)
Untuk memastikan validitas penelitian pada aspek interaksi suara, fitur berikut **dikecualikan** dari versi MVP:
1.  **Pemindaian Barcode Fisik:** Fokus dialihkan sepenuhnya ke input suara untuk menguji keandalan NLP.
2.  **Manajemen Stok Kompleks:** Sistem hanya berfokus pada harga dan estimasi total belanja.
