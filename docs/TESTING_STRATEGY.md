# Strategi Pengujian (Testing Strategy)

Dokumen ini menjelaskan strategi pengujian untuk memvalidasi fungsi "Voice-First" dan hipotesis penelitian Cartify MVP.

## Hipotesis Penelitian (Revised for MVP)
Fokus penelitian bergeser sepenuhnya pada interaksi suara dan kontrol anggaran.

-   **H1 (Akurasi Suara/Voice Accuracy):** Sistem *Natural Language Understanding* (NLU) mampu mengidentifikasi produk dengan benar dari database lokal meskipun terdapat variasi pengucapan atau kesalahan kecil (*mispronunciation*).
-   **H2 (Efisiensi Waktu/Budget Speed):** Penggunaan input suara memungkinkan pengguna mencatat item belanja dan menghitung total pengeluaran lebih cepat dibandingkan metode pengetikan manual pada perangkat seluler.
-   **H3 (Kepatuhan Anggaran/Budget Adherence):** Kombinasi peringatan audio (*Auditory Warning*) dan visual saat anggaran menipis efektif mencegah pengguna menambahkan item impulsif yang tidak direncanakan.

## Skenario Pengujian (UAT)

| Kode | Fitur | Skenario Uji | Kriteria Sukses | Hipotesis |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Voice Match** | Ucapkan "Minyak Bimoli" (Database: "Minyak Goreng Bimoli") | Sistem mendeteksi "Minyak Goreng Bimoli" sebagai kandidat terkuat dan menambahkannya ke keranjang. | **H1** |
| **TC-02** | **Voice Qty** | Ucapkan "Tiga Sabun Mandi" | Sistem menambahkan item "Sabun Mandi" dengan jumlah (Qty) = 3. | **H1** |
| **TC-03** | **Unknown Item** | Ucapkan nama barang yang tidak ada di database | Sistem memberikan respons suara "Barang tidak ditemukan, silakan input harga manual". | **H1** |
| **TC-04** | **Budget Alert** | Tambahkan item hingga sisa anggaran < 10% | Bar progres berubah merah dan ada peringatan suara "Hati-hati, anggaran Anda menipis". | **H3** |
| **TC-05** | **Over Budget** | Tambahkan item hingga total > Limit | Sistem memperingatkan "Anggaran terlampaui" dan meminta konfirmasi ulang. | **H3** |
| **TC-06** | **Rapid Input** | Input 5 item berturut-turut via suara vs ketik | Waktu total input suara harus lebih rendah secara signifikan. | **H2** |

## Metode Pengukuran H2 (Efisiensi)
Untuk membuktikan Hipotesis 2, akan dilakukan pengujian A/B sederhana:
1.  Pengguna diminta memasukkan daftar 10 barang belanjaan menggunakan mode **Ketik Manual**. Catat waktunya.
2.  Pengguna diminta memasukkan daftar 10 barang yang sama menggunakan **Perintah Suara**. Catat waktunya.
3.  Bandingkan selisih waktu rata-rata.
