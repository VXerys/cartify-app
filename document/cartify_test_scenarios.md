# LEMBAR SKENARIO UJI SISTEM CARTIFY
## Validasi Kinerja Voice-Based Shopping Assistant

**Informasi Penelitian:**
- **Sistem:** Cartify (Voice-Based Shopping Cart)
- **Fokus Produk:** Alfamart Indonesia
- **Total Skenario:** 50 variasi perintah suara
- **Metrik Evaluasi:** IER, TCT, BV
- **Kondisi Pengujian:** Simulasi akustik toko fisik dengan variasi kebisingan

---

## KATEGORI A: PERINTAH SEDERHANA (10 Skenario)
**Deskripsi:** Perintah langsung dengan struktur standar (qty + produk + harga)

| No | Input Perintah Suara | Expected Output | Tujuan Pengujian |
|---|---|---|---|
| A1 | "Indomie Goreng 2 bungkus 6 ribu" | `product_name: "Indomie Goreng", qty: 2, price: 6000, category: "food"` | Baseline akurasi parsing standar |
| A2 | "Susu Ultra Milk 1 liter 15 ribu" | `product_name: "Susu Ultra Milk", qty: 1, price: 15000, category: "drink"` | Produk branded dengan ukuran |
| A3 | "Aqua botol 600ml 3 ribu" | `product_name: "Aqua Botol 600ml", qty: 1, price: 3000, category: "drink"` | Produk dengan spesifikasi ukuran |
| A4 | "Teh Pucuk Harum 5 botol 25 ribu" | `product_name: "Teh Pucuk Harum", qty: 5, price: 25000, category: "drink"` | Multiple quantity standard |
| A5 | "Sabun Lifebuoy 8 ribu" | `product_name: "Sabun Lifebuoy", qty: 1, price: 8000, category: "household"` | Single item household |
| A6 | "Beras Pandan Wangi 5kg 65 ribu" | `product_name: "Beras Pandan Wangi 5kg", qty: 1, price: 65000, category: "food"` | Produk dengan satuan berat |
| A7 | "Telur Ayam 1 kg 28 ribu" | `product_name: "Telur Ayam", qty: 1, price: 28000, category: "food"` | Fresh product |
| A8 | "Chitato Rasa Sapi Panggang 12 ribu" | `product_name: "Chitato Rasa Sapi Panggang", qty: 1, price: 12000, category: "snacks"` | Snack dengan deskripsi rasa |
| A9 | "Tisu Paseo 10 ribu" | `product_name: "Tisu Paseo", qty: 1, price: 10000, category: "household"` | Hygiene product |
| A10 | "Minyak Goreng Bimoli 2 liter 32 ribu" | `product_name: "Minyak Goreng Bimoli 2 Liter", qty: 1, price: 32000, category: "food"` | Cooking staple dengan volume |

---

## KATEGORI B: PERINTAH DENGAN ISTILAH GAUL/SLANG (10 Skenario)
**Deskripsi:** Menggunakan bahasa gaul Indonesia untuk nilai nominal

| No | Input Perintah Suara | Expected Output | Tujuan Pengujian |
|---|---|---|---|
| B1 | "Pop Mie 3 cup ceban" | `product_name: "Pop Mie", qty: 3, price: 10000, category: "food"` | Slang "ceban" = 10.000 |
| B2 | "Kopi Kapal Api 2 sachet goceng" | `product_name: "Kopi Kapal Api", qty: 2, price: 5000, category: "drink"` | Slang "goceng" = 5.000 |
| B3 | "Silverqueen 4 batang dua puluh ribu" | `product_name: "Silverqueen", qty: 4, price: 20000, category: "snacks"` | Angka verbal bahasa Indonesia |
| B4 | "Gulaku gula pasir sekilo tiga puluh lima rb" | `product_name: "Gulaku Gula Pasir", qty: 1, price: 35000, category: "food"` | Singkatan "rb" untuk ribu |
| B5 | "Roti Tawar Sari Roti sembilan ribu lima ratus" | `product_name: "Roti Tawar Sari Roti", qty: 1, price: 9500, category: "food"` | Angka ratusan verbal |
| B6 | "Pulpen Pilot 5 buah lima belas k" | `product_name: "Pulpen Pilot", qty: 5, price: 15000, category: "other"` | Slang "k" untuk ribu |
| B7 | "Yakult isi 5 tujuh belas ribu" | `product_name: "Yakult Isi 5", qty: 1, price: 17000, category: "drink"` | Produk bundle pack |
| B8 | "Deterjen Rinso 1kg dua puluh delapan ribu" | `product_name: "Deterjen Rinso 1kg", qty: 1, price: 28000, category: "household"` | Household dengan berat |
| B9 | "Oreo 3 pack tiga puluh rb" | `product_name: "Oreo", qty: 3, price: 30000, category: "snacks"` | Mix slang dan verbal |
| B10 | "Sabun Cuci Piring Mama Lemon gopek" | `product_name: "Sabun Cuci Piring Mama Lemon", qty: 1, price: 500, category: "household"` | Slang "gopek" = 500 (edge case) |

---

## KATEGORI C: PERINTAH AMBIGU/NON-STANDAR (10 Skenario)
**Deskripsi:** Struktur kalimat informal, filler words, urutan tidak standar

| No | Input Perintah Suara | Expected Output | Tujuan Pengujian |
|---|---|---|---|
| C1 | "Beliin aku Indomie dua bungkus yang harganya enam ribu" | `product_name: "Indomie", qty: 2, price: 6000, category: "food"` | Filler words "beliin aku" |
| C2 | "Masukin dong Aqua galon delapan belas ribu" | `product_name: "Aqua Galon", qty: 1, price: 18000, category: "drink"` | Casual request style |
| C3 | "Tolong tambahin Susu Frisian Flag coklat 10rb yaa" | `product_name: "Susu Frisian Flag Coklat", qty: 1, price: 10000, category: "drink"` | Polite filler + slang |
| C4 | "Yang tadi Nutrisari jeruk 3 sachet lima ribu aja" | `product_name: "Nutrisari Jeruk", qty: 3, price: 5000, category: "drink"` | Conversational context |
| C5 | "Aku mau Chitato 2 bungkus dua puluh empat ribu dong" | `product_name: "Chitato", qty: 2, price: 24000, category: "snacks"` | First-person informal |
| C6 | "Taro net 4 buah yang warna ungu enam belas ribu" | `product_name: "Taro Net", qty: 4, price: 16000, category: "snacks"` | Deskripsi tambahan warna |
| C7 | "Masukkan saja Kecap Bango ukuran sedang sembilan ribu" | `product_name: "Kecap Bango Ukuran Sedang", qty: 1, price: 9000, category: "food"` | Formal request informal |
| C8 | "Tambah lagi Teh Botol Sosro yang 450ml lima ribu setengah" | `product_name: "Teh Botol Sosro 450ml", qty: 1, price: 5500, category: "drink"` | Ratusan dengan "setengah" |
| C9 | "Coba masukin Sarimi rasa ayam bawang 4 bungkus total dua belas ribu" | `product_name: "Sarimi Rasa Ayam Bawang", qty: 4, price: 12000, category: "food"` | Keyword "total" + filler |
| C10 | "Ambil aja Molto pelembut pakaian yang sachet tiga ribu lima ratus" | `product_name: "Molto Pelembut Pakaian Sachet", qty: 1, price: 3500, category: "household"` | Casual instruction style |

---

## KATEGORI D: PERINTAH UNIT PRICE (MASING-MASING) (10 Skenario)
**Deskripsi:** Harga satuan yang memerlukan kalkulasi (qty × unit price)

| No | Input Perintah Suara | Expected Output | Tujuan Pengujian |
|---|---|---|---|
| D1 | "3 Pop Ice masing-masing 2 ribu" | `product_name: "Pop Ice", qty: 3, price: 6000, category: "snacks"` | Keyword "masing-masing" |
| D2 | "5 Roti Unyil per biji 1500" | `product_name: "Roti Unyil", qty: 5, price: 7500, category: "food"` | Keyword "per biji" |
| D3 | "4 Pisang Cavendish satuannya lima ribu" | `product_name: "Pisang Cavendish", qty: 4, price: 20000, category: "fruit"` | Keyword "satuannya" |
| D4 | "Jeruk Sunkist 6 buah @ tiga ribu" | `product_name: "Jeruk Sunkist", qty: 6, price: 18000, category: "fruit"` | Symbol "@" untuk per item |
| D5 | "2 Susu Yakult satunya delapan ribu" | `product_name: "Susu Yakult", qty: 2, price: 16000, category: "drink"` | "satunya" variation |
| D6 | "Apel Fuji 3kg per kg dua puluh lima ribu" | `product_name: "Apel Fuji", qty: 3, price: 75000, category: "fruit"` | Per kg calculation |
| D7 | "10 Gorengan yang masing-masingnya dua ribu" | `product_name: "Gorengan", qty: 10, price: 20000, category: "food"` | "masing-masingnya" variant |
| D8 | "Ayam Potong 2kg per kilonya empat puluh ribu" | `product_name: "Ayam Potong", qty: 2, price: 80000, category: "food"` | "per kilonya" explicit |
| D9 | "Nugget Fiesta 3 pack satuan sepuluh ribu" | `product_name: "Nugget Fiesta", qty: 3, price: 30000, category: "food"` | "satuan" keyword |
| D10 | "5 Mentega Blueband yang per bungkusnya tujuh ribu lima ratus" | `product_name: "Mentega Blueband", qty: 5, price: 37500, category: "food"` | Complex unit price |

---

## KATEGORI E: PERINTAH NEGATIF/INVALID (10 Skenario)
**Deskripsi:** Input yang harus ditolak sistem (profanity, irrelevant, malformed)

| No | Input Perintah Suara | Expected Output | Tujuan Pengujian |
|---|---|---|---|
| E1 | "Dasar bodoh kamu" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Profanity detection |
| E2 | "Apa kabar hari ini?" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Irrelevant greeting |
| E3 | "Cuaca bagus ya hari ini" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Non-shopping content |
| E4 | "Bangsat lu semua" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Hate speech |
| E5 | "Berapa harga Indomie?" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Query bukan perintah beli |
| E6 | "Ceritakan dongeng sebelum tidur" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Unrelated request |
| E7 | "Tolol banget sistem ini" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Insult to system |
| E8 | "Siapa presiden Indonesia?" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | General knowledge query |
| E9 | "Jalan-jalan yuk ke mall" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Social invitation |
| E10 | "Hahahaha lucu banget" | `product_name: "INVALID_CONTENT", qty: 0, price: 0, category: "other"` | Expression bukan perintah |

---


## KATEGORI F: PHONETIC SPELLING CORRECTION (English Brands)
**Deskripsi:** Menguji kemampuan AI memperbaiki ejaan brand inggris yang diucapkan dengan logat Indonesia

| No | Input Perintah Suara | Expected Output | Tujuan Pengujian |
|---|---|---|---|
| F1 | "Beliin sampo Hed end Solder yang anti ketombe" | `product_name: "Shampoo Head & Shoulders Anti Ketombe", ...` | Phonetic correction |
| F2 | "Mau beli Biskuit O Rio tiga bungkus" | `product_name: "Biskuit Oreo", qty: 3, ...` | Spacing correction |
| F3 | "Tambah grin ti satu botol" | `product_name: "Green Tea", qty: 1, ...` | English flavor name |
| F4 | "Susu Grienfil yang satu liter" | `product_name: "Susu Greenfields", qty: 1, ...` | Complex brand spelling |
| F5 | "Sabun Dettol yang cair" | `product_name: "Sabun Dettol Cair", ...` | Brand spelling check |
| F6 | "Pepsodent sensodain toothpaste" | `product_name: "Pepsodent Sensodyne", ...` | Mixed brands logic |
| F7 | "Coklat Kedberi yang gede" | `product_name: "Coklat Cadbury", ...` | Popular chocolate brand |
| F8 | "Kopi Neskafe kaleng" | `product_name: "Kopi Nescafé", ...` | Brand capitalization/accent |
| F9 | "Tupperware botol minum" | `product_name: "Tupperware", ...` | Household brand |
| F10 | "Tisu Wipol basah" | `product_name: "Tisu Wipol Basah", ...` | Brand checking |

---

## INSTRUKSI PENGUJIAN

### A. PERSIAPAN PENGUJIAN
1. **Lingkungan:** Simulasi toko Alfamart dengan background noise (20-60 dB)
2. **Perangkat:** Smartphone dengan aplikasi Cartify terinstall
3. **Penguji:** Tim pengembang atau expert tester (min. 2 orang)
4. **Durasi:** Estimasi 45-60 menit untuk 50 skenario

### B. PROSEDUR EKSEKUSI
Untuk setiap skenario:
1. **Persiapan:** Reset aplikasi ke kondisi cart kosong
2. **Input:** Ucapkan perintah sesuai kolom "Input Perintah Suara"
3. **Pencatatan Data:**
   - **Transkripsi ASR:** Catat hasil speech-to-text
   - **TCT (Task Completion Time):** Ukur waktu dari mulai bicara hingga respons sistem (ms)
   - **Output Parsing:** Catat product_name, qty, price, category yang dihasilkan
   - **Status:** Berhasil / Error / Invalid
4. **Variasi Kondisi:** Ulangi 2-3 kali dengan variasi noise level (rendah/sedang/tinggi)

### C. FORMULIR PENCATATAN DATA

| No Skenario | Transkripsi ASR | TCT (ms) | Product Name | Qty | Price | Category | Status | Catatan Error |
|---|---|---|---|---|---|---|---|---|
| A1 | | | | | | | | |
| A2 | | | | | | | | |
| ... | | | | | | | | |

### D. METRIK EVALUASI

#### 1. Input Error Rate (IER)
```
IER = (Jumlah Error / Total Percobaan) × 100%
```
- **Target:** IER < 10%
- **Error:** Parsing salah, kategori salah, price calculation error

#### 2. Task Completion Time (TCT)
```
TCT = t_end - t_start
```
- **Target:** TCT < 3000ms (3 detik)
- **Measurement:** Dari start voice input hingga tampil hasil

#### 3. Budget Variance (BV)
```
BV = |P_app - P_real|
```
- **Target:** BV = 0 (no price deviation)
- **Calculation:** Bandingkan total price sistem vs expected price

---

## KRITERIA KEBERHASILAN SISTEM

| Metrik | Target Minimum | Target Ideal |
|---|---|---|
| **Input Error Rate (IER)** | ≤ 15% | ≤ 10% |
| **Task Completion Time (TCT)** | ≤ 4000ms | ≤ 2500ms |
| **Budget Variance (BV)** | ≤ 5% dari total | 0% (exact match) |
| **Kategori Accuracy** | ≥ 80% | ≥ 90% |

---

## CATATAN KHUSUS PENELITIAN

### Fokus Analisis:
1. **Kompleksitas Linguistik:** Bandingkan performa antara Kategori A (standar) vs C (ambigu)
2. **Kalkulasi Aritmatika:** Validasi akurasi Kategori D (unit price multiplication)
3. **Content Filtering:** Pastikan Kategori E 100% terdeteksi sebagai invalid
4. **Robustness terhadap Noise:** Analisis degradasi performa pada noise level tinggi

### Limitasi:
- Harga produk pada skenario ini adalah estimasi dan dapat berbeda dengan harga real Alfamart
- Variasi aksen penguji dapat mempengaruhi hasil ASR
- Background noise dikontrol pada level 20-60dB (simulasi toko)

### Output Akhir:
Laporan analisis statistik deskriptif meliputi:
- Tabel frekuensi error per kategori
- Grafik distribusi TCT
- Analisis korelasi noise level vs IER
- Rekomendasi perbaikan sistem

---

**Prepared by:** Tim Peneliti Cartify  
**Institution:** Universitas Nusa Putra - Program Studi Teknik Informatika  
**Date:** Desember 2025  
**Version:** 1.0