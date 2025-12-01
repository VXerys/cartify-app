# Rencana Integrasi API (Gemini 1.5 Flash)

Dokumen ini merinci strategi integrasi teknis antara aplikasi Cartify (React Native) dan Google Gemini 1.5 Flash API untuk fitur "3-Input Voice Logic".

## 1. Strategi "3-Input" Voice Logic
Fitur inti Cartify V2.0 adalah kemampuan menangkap tiga poin data dalam satu kalimat perintah suara:
1.  **Kuantitas (Qty):** Jumlah barang.
2.  **Nama Barang (Product Name):** Deskripsi produk.
3.  **Harga (Price):** Harga satuan atau total (sesuai instruksi).

**Pola Ucapan:** `[Jumlah] + [Nama Barang] + [Harga]`
**Contoh:** "Tiga Wafer Nabati dua puluh dua ribu lima ratus"

## 2. System Instruction (Prompt Engineering)
Kualitas output JSON sangat bergantung pada instruksi sistem (*System Prompt*) yang dikirim ke Gemini. Berikut adalah *prompt* yang telah dioptimalkan:

```text
Role: You are a strict JSON parser for a shopping assistant.
Task: Listen to the audio input which contains a shopping item.
Extraction Rules:
1. Identify the QUANTITY (convert words like 'dua', 'setengah' to numbers). Default to 1 if not specified.
2. Identify the PRODUCT_NAME.
3. Identify the PRICE (convert words like 'lima ribu', '20k' to integer).
4. Do not include currency symbols (Rp) in the integer output.

Output Format:
Return ONLY a valid JSON object. Do not add markdown formatting like ```json.
{
  "qty": <integer>,
  "product_name": <string>,
  "user_input_price": <integer>
}

Example Audio: "Dua roti sisir seribu limaratus"
Example Output: {"qty": 2, "product_name": "roti sisir", "user_input_price": 1500}
```

## 3. Alur Permintaan API (Request Flow)

### Endpoint
`POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

### Body Payload (Multipart/Multimodal)
Permintaan dikirim dengan menyertakan data audio (Base64 atau URI blob) sebagai `inlineData`.

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Parse this audio based on system instructions."
        },
        {
          "inlineData": {
            "mimeType": "audio/mp4",
            "data": "<BASE64_ENCODED_AUDIO_STRING>"
          }
        }
      ]
    }
  ],
  "systemInstruction": {
      "parts": [ { "text": "<INSERT_SYSTEM_PROMPT_ABOVE>" } ]
  }
}
```

## 4. Penanganan Latensi & UX
Karena proses *upload* audio dan *inference* Cloud membutuhkan waktu (estimasi 1-2.5 detik tergantung jaringan), strategi UX berikut diterapkan:

1.  **Optimistic UI / Skeleton Loader:**
    -   Segera setelah rekaman selesai, tampilkan *placeholder* item di daftar belanja dengan animasi *shimmering*.
    -   Teks status: *"Sedang memproses..."* atau *"Mencerna..."*.

2.  **Audio Compression:**
    -   Audio dikompres di perangkat sebelum dikirim (misal: AAC/M4A bitrate rendah) untuk mempercepat pengunggahan tanpa mengorbankan keterbacaan suara bagi AI.

3.  **Error Handling (Fallback):**
    -   Jika API gagal atau *timeout* (> 5 detik): Tampilkan formulir manual *pop-up* yang sudah terisi sebagian (jika ada data parsial) atau kosong, meminta pengguna mengetik manual.
    -   Pesan Error: *"Gagal terhubung ke AI, silakan input manual."*
