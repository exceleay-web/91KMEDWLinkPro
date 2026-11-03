# 🌐 91KMEDW Link Pro — Cloud Link Management Platform

Sistem Manajemen Link Terpadu dengan arsitektur **Decoupled Headless Hybrid**:
- **Frontend**: Single Page Application (SPA) responsive dengan Tailwind & Custom Cyber Pipeline Theme, di-deploy di **Vercel** via GitHub.
- **Backend & Database**: **Google Apps Script (`/exec`)** & **Google Sheets** sebagai Cloud Database Engine & RESTful JSON API.

---

## 🚀 Fitur Utama
1. **CMS Landing Page Modern**: Ticker teks berjalan (*Running Announcement*), hero capsule, grid filter kategori, dan pencarian instan (*real-time*).
2. **Struktur Hierarki Tree**: Induk folder dan sub-link bersarang dengan navigasi modal & drawer responsif.
3. **Optimistic UI & Multi-Sort**: Urutkan tautan naik/turun (*swap order*), pin prioritas, dan sembunyikan/tampilkan link secara real-time.
4. **Universal Backend Bridge**: Beroperasi penuh di Google Apps Script WebApp maupun di Vercel secara mandiri.
5. **Autentikasi Aman**: Admin dashboard dilindungi password dengan session persistence di client.

---

## 📦 Panduan Deploy ke Vercel (3 Langkah Mudah)

### Langkah 1: Push ke GitHub
Pastikan repositori Anda telah memuat:
- `index.html` (Frontend SPA)
- `vercel.json` (Konfigurasi routing Vercel)
- `code.gs` & `setup.gs` (Source code Google Apps Script)

```bash
git add .
git commit -m "feat: setup vercel headless deployment"
git push origin main
```

### Langkah 2: Hubungkan Repositori ke Vercel
1. Buka dashboard [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** ➔ **"Project"**.
3. Pilih repositori **`Manajemen-Link`** Anda, lalu klik **"Import"**.
4. Biarkan konfigurasi default (*Framework Preset: Other*), lalu klik **"Deploy"**.
5. Tunggu proses build selesai (hanya butuh ~10 detik). Domain Vercel Anda langsung aktif!

### Langkah 3: Konfigurasi URL Google Apps Script
URL Backend `/exec` Anda sudah tertanam otomatis di `index.html`:
```javascript
var GAS_EXEC_URL = "https://script.google.com/macros/s/AKfycbyxdawfwRb_tvhWFID-cxYHPSMadJgPFGS1FA6d5plvFhIFnoB8o9YioALrij7lI-FPcow/exec";
```
Jika di kemudian hari Anda memperbarui deployment Google Apps Script:
- Anda dapat memperbarui URL di menu **Pengaturan Landing Page ➔ URL Backend Google Apps Script (/exec)** di admin modal, atau
- Ubah nilai variabel `GAS_EXEC_URL` di `index.html` dan push ulang ke GitHub.

---

## ⚙️ Lisensi & Hak Cipta
© 2026 91KMEDW Link Pro. Powered by ZettBOT System Architecture.

