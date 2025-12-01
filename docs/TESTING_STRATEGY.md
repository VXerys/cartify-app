# Strategi Pengujian (Testing Strategy) - GenAI Era

Dokumen ini menjelaskan strategi pengujian untuk memvalidasi arsitektur "Cloud-Native GenAI" Cartify, dengan fokus khusus pada kemampuan *parsing* semantik Gemini 1.5 Flash.

## Hipotesis Penelitian (Diperbarui)
Fokus penelitian kini pada kemampuan AI Multimodal dalam memproses data suara kompleks yang mengandung 3 variabel sekaligus.

-   **H1 (Complex Voice Parsing):** Model GenAI (Gemini 1.5 Flash) mampu secara akurat memisahkan tiga entitas data (*Kuantitas*, *Nama Produk*, *Harga*) dari satu kalimat ucapan pengguna yang kontinu, membedakan antara angka kuantitas (misal: "Tiga") dan angka pada nama produk (misal: "Tiga Roda").
-   **H2 (Real-time Budget Response):** Penggunaan arsitektur *Cloud-Native* tetap memungkinkan pembaruan status anggaran (*Budget Progress*) yang dirasakan "instan" (mendekati *real-time*) oleh pengguna, meskipun terdapat latensi jaringan.
-   **H3 (User Adaptation):** Pengguna dapat dengan mudah beradaptasi dengan pola perintah "Jumlah + Nama + Harga" sebagai pengganti pemindaian barcode.

## Skenario Pengujian (UAT & System Test)

| Kode | Fitur | Skenario Uji (Input Suara) | Hasil yang Diharapkan (JSON & Logic) | Hipotesis |
| :--- | :--- | :--- | :--- | :--- |
| **TC-AI-01** | **3-Input Standard** | "Dua Roti Lima Ribu" | `{"qty": 2, "product_name": "Roti", "user_input_price": 5000}` | **H1** |
| **TC-AI-02** | **Complex Name** | "Satu Lem Tiga Detik Seribu" | `{"qty": 1, "product_name": "Lem Tiga Detik", "user_input_price": 1000}` <br>*(AI harus paham "Tiga" di sini bukan Qty)* | **H1** |
| **TC-AI-03** | **Large Numbers** | "Beli Laptop Lima Juta Sembilan Ratus Ribu" | `{"qty": 1, "product_name": "Laptop", "user_input_price": 5900000}` | **H1** |
| **TC-AI-04** | **Implicit Qty** | "Minyak Goreng Empat Belas Ribu" | `{"qty": 1, "product_name": "Minyak Goreng", "user_input_price": 14000}` <br>*(Qty default ke 1)* | **H1** |
| **TC-BUDGET-01** | **Budget Calculation** | Sesi aktif, Total: 0. Input TC-AI-01. | Setelah *loading*, Total menjadi 10.000 (2 * 5000). Bar progres terupdate. | **H2** |
| **TC-UX-01** | **Latency Feedback** | Rekam suara -> Kirim. | Skeleton loader muncul segera. Durasi tunggu < 3 detik (pada jaringan 4G stabil). | **H2** |

## Metode Evaluasi Kualitatif
Untuk H1, akurasi akan diukur dengan **Word Error Rate (WER)** dan **Intent Classification Accuracy**.
-   **Sukses:** Jika JSON yang dihasilkan menghasilkan subtotal yang benar sesuai niat pengguna.
-   **Gagal:** Jika AI salah mengartikan harga sebagai kuantitas (misal: "Beli 2000 permen" -> Qty: 2000, padahal maksudnya Harga: 2000).
