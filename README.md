# 🌐 91KMEDW Link Pro — Cloud Link Management Platform

Sistem Manajemen Link Terpadu dengan arsitektur **Modern Serverless Headless**:
- **Frontend**: Single Page Application (SPA) responsive dengan Custom Cyber Pipeline Theme, di-deploy otomatis di **Vercel** via GitHub.
- **Backend & Database**: **Supabase Cloud PostgreSQL (Singapore Region)** dengan Row Level Security (RLS), Supabase Auth JWT, dan Server-Side RPC Verification.
- **Auto-Push Pipeline**: Sistem otomasi `autopush.py` (Tanpa ketergantungan Git lokal) yang menyinkronkan kode ke GitHub, men-trigger deploy Vercel, mengeksekusi SQL ke Supabase, serta menjaga database tetap aktif via GitHub Actions Keep-Alive.

---

## 🚀 Cara Penggunaan Auto-Push 1-Pintu
1. Isi `GITHUB_TOKEN` dan `SUPABASE_ACCESS_TOKEN` satu kali saja di dalam file lokal `.env`.
2. Klik 2x file **`PUSH_OTOMATIS.bat`** (atau jalankan `python autopush.py` / minta ZettBOT langsung menjalankannya).
3. Seluruh perubahan langsung ter-push ke **GitHub**, otomatis tayang di **Vercel**, dan menerapkan skema SQL ke **Supabase**!

---

## ⚙️ Lisensi & Hak Cipta
© 2026 91KMEDW Link Pro. Powered by ZettBOT System Architecture.
