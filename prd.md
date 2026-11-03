# PRD (Product Requirement Document) & Master Context: 91KMEDW Link Pro
================================================================================
STATUS: AKTIF (VERIFIED & UPDATED)
VERSI SISTEM: v4.6 (Decoupled Multi-Platform Headless Edition: Google Apps Script + GitHub + Vercel)
ARSITEKTUR: Decoupled Headless Hybrid (Vercel SPA Frontend + Google Apps Script /exec Cloud JSON API Backend + Google Sheets Database)
================================================================================

================================================================================
ZONA ATAS: SPESIFIKASI KEBUTUHAN PRODUK (BLUEPRINT SISTEM BERJALAN)
================================================================================

## 1. NAMA PROJEK & PROBLEM STATEMENT
- **Nama Aplikasi:** 91KMEDW Link Pro (Manajemen Hierarki Link & Portal Internal).
- **Problem Statement:** Organisasi/perusahaan sering memiliki ratusan tautan dokumen, SOP, tools internal, repository, dan spreadsheet yang tercecer. Bookmark browser lokal sulit dibagikan antar tim dan tidak memiliki struktur hierarki multi-level yang jelas.
- **Solusi:** Aplikasi webapp berbasis Google Apps Script yang ringan, cepat, mengadopsi estetika **Dark Cyber Pipeline & Node-Flow Architecture** (terinspirasi dari platform otomasi & security E-TechInvest) dengan Dual-Theme (Mode Gelap Cyber & Mode Terang Blueprint Berkontras Tinggi), modal pop-up melayang di tengah layar (*fixed center popup*), pemilih warna/ikon berbaris rapi (*horizontal flex grid*), banner footer *Developed By 91KMEDW*, serta struktur tautan 3 tingkat hierarki (Trigger Node -> Process Node -> Endpoint Service Node).

---

## 2. PERAN PENGGUNA (USER ROLES & PERMISSION)
1. **Admin (Role: Admin)**
   - Akses penuh ke seluruh fitur aplikasi.
   - Mengelola kategori (Tambah, Edit, Hapus Kategori).
   - Mengelola seluruh tautan (Tambah, Edit, Hapus Main Link, Sub Link, dan Sub-Sub Link).
   - Mengubah status pin (Sematkan di atas).
2. **Tim Operasional / Staff (Role: Editor)**
   - Mengakses dashboard dan menavigasi seluruh pohon hierarki link.
   - Melakukan pencarian, menyalin URL, dan membuka tautan tujuan.
   - Menambah atau memperbarui tautan sesuai kebutuhan operasional.

---

## 3. ARSITEKTUR & LINGKUNGAN KERJA
- **Platform Backend:** Google Apps Script (`code.gs`) yang dieksekusi di server Google.
- **Database:** Google Sheets (`setup.gs`) dengan mekanisme *Safe Migration* (idempoten & non-destruktif).
- **Frontend Layer:** `index.html` (SPA modern dengan Vanilla JS, Plus Jakarta Sans & JetBrains Mono, FontAwesome 6).
- **Desain UI/UX:** Dark Cyber Pipeline berlatar Ultra-Deep Obsidian Black (`#090a0f`), matriks kisi grid teknikal, konektor lengkung oranye elektrik (`#ff6600`), kartu node modular, lampu status pulsing hijau (`● Online / Operational`), modal pop-up melayang di tengah layar berlatar blur, pemilih warna & ikon berbaris rapi menyamping, banner footer *Developed By 91KMEDW*, dan logo 4-bar pill khas `[Putih] [Oranye] [Putih] [Oranye]`.
- **Dual-Theme Engine:** Mendukung sakelar instan (0 detik) Mode Gelap Cyber & Mode Terang Blueprint dengan penyimpanan preferensi di `localStorage` (`ZETTLINK_APP_THEME`).
- **Hybrid Preview Support:** Dilengkapi dual-mode runtime (Produksi `google.script.run` dan Canvas Preview `CANVAS_MOCK_DB`).

---

## 4. ALUR KERJA APLIKASI (USER FLOW)
1. **Autentikasi (Login):**
   - Layar login berlatar gelap teknikal dengan logo 4-bar vertikal dan input akun berfitur intip password.
2. **Navigasi Dashboard & Filter:**
   - Sidebar navigasi desktop atau mobile category strip dengan chip filter kategori dinamis.
   - Panel ringkasan **WORKFLOW OVERVIEW** berisi 4 metrik terpadu.
   - Pencarian cerdas seketika (debounced 180ms) yang otomatis mengekspansi cabang node yang relevan.
3. **Eksplorasi Pipeline Node 3 Tingkat:**
   - **Level 1 (Trigger Node / Main Link):** Kartu induk berbingkai oranye bercahaya, badge kategori & pin, jumlah endpoint, dan soket konektor keluar.
   - **Garis Alur Lengkung (Curved Flow Conduits):** Garis alur melengkung oranye bercahaya (`#ff6600`) yang menghubungkan Trigger ke Process Node.
   - **Level 2 (Process Node / Sub Link):** Kartu pemrosesan cabang dengan ikon berbingkai oranye/cyan, judul, URL monospace, dan port masukan/keluaran.
   - **Level 3 (Endpoint Service Node / Sub-Sub Link):** Kartu ujung dengan indikator lampu status hijau berkedip halus (`● Online / Operational`), tombol akses direct link, salin URL, dan aksi manajemen.
4. **Operasi CRUD Tautan & Kategori:**
   - Menekan tombol "+ Tambah Main Link", "+ Sub Link", atau "+ Sub-Sub Link" memunculkan jendela dialog melayang (*floating modal*) tepat di tengah layar.
   - Pemilihan warna dan ikon kategori tersusun dalam barisan horizontal (*swatch-row flex wrap*).
   - Footer halaman menampilkan banner identitas pengembang resmi: **Developed By 91KMEDW**.
   - Cascading delete dan cascading category update.

---

## 5. DESAIN BASIS DATA (GOOGLE SHEETS)
1. **Sheet `Users`:** Col: `ID_User`, `Username`, `Password`, `Nama_Lengkap`, `Role`, `Status_Aktif`, `Waktu_Dibuat`.
2. **Sheet `Categories`:** Col: `ID_Kategori`, `Nama_Kategori`, `Warna_Badge`, `Icon_Class`, `Deskripsi_Kategori`, `Waktu_Update`.
3. **Sheet `Links`:** Col: `ID_Link`, `ID_Kategori`, `Parent_ID`, `Level_Hierarki`, `Judul_Link`, `URL_Link`, `Deskripsi_Singkat`, `Status_Pin`, `Urutan_Tampil`, `Waktu_Update`.

---

## 6. ATURAN VALIDASI & LOGIKA KHUSUS
1. **Pewarisan Kategori:** Kategori sub link dan sub-sub link selalu otomatis mewarisi kategori dari main link induknya.
2. **Cascading Category Update:** Jika kategori Main Link diubah, seluruh Sub Link dan Sub-Sub Link turunannya otomatis terupdate ke kategori baru tersebut.
3. **Cascading Deletion:** Menghapus Main Link akan otomatis menghapus seluruh cabang di bawahnya.
4. **Proteksi Kategori:** Kategori tidak dapat dihapus jika masih ada tautan yang bernaung di bawahnya.
5. **Anti-Freeze Form & Failure Handler:** Seluruh form memiliki `event.preventDefault()` dan tombol loading dilindungi `.withFailureHandler()` / `.catch()`.

---

## 7. KRITERIA PENGUJIAN (TESTING CHECKLIST)
- [x] Banner footer di bagian bawah halaman menampilkan teks identitas: "Developed By 91KMEDW".
- [x] Pilihan warna badge (8 warna) dan pilihan ikon (10 ikon) pada modal kategori berbaris rapi secara horizontal menyamping (*flex wrap*).
- [x] Modal form Tambah Link, Tambah Sub Link, dan Kelola Kategori tampil melayang di tengah layar (*fixed center popup*).
- [x] Tampilan bertransformasi penuh mengadopsi gaya Dark Cyber Pipeline & Node-Flow (Inspirasi E-TechInvest).
- [x] Logo 4-bar pill vertikal (`[Putih] [Oranye] [Putih] [Oranye]`) aktif di login dan sidebar.
- [x] Panel WORKFLOW OVERVIEW 4 metrik tampil modular dan responsif.
- [x] Node Level 1 (Trigger), Level 2 (Process), dan Level 3 (Endpoint dengan status pulse hijau) terhubung rapi dengan garis alur lengkung oranye.
- [x] Mode Terang (Technical Blueprint) berkontras tajam dan lolos WCAG.
- [x] 100% fungsionalitas CRUD, pencarian, salin URL, autentikasi, dan database berjalan normal.

---

================================================================================
ZONA BAWAH: MASTER CONTEXT & LOGIKA SISTEM TERKINI (LIVING CONTEXT)
================================================================================

### A. Status Arsitektur & Lingkungan Aktif
- **Versi Rilis:** v4.3 (Interactive Reordering Engine & Dynamic Hierarchy Edition)
- **Tema Visual Aktif:** Dark Cyber Pipeline & Node-Flow (Electric Orange `#ff6600`, Obsidian Canvas `#090a0f`, Technical Grid Overlay, Fixed Center Modal Pop-ups, Swatch-Row Horizontal Flex Grid, Footer Signature "Developed By 91KMEDW", dan Technical Blueprint Light Mode).
- **Status Operasional:** 100% Terverifikasi, tag DOM & scriptlet utuh, bebas syntax error.
- **Konfigurasi Berkas Utama:**
  - `setup.gs`: Inisialisasi 3 tab sheet (`Users`, `Categories`, `Links`), Safe Migration untuk pembaruan nama pengguna, header styling, dan dummy data.
  - `code.gs`: API controller (`doGet`, `loginUser`, `getDashboardData`, `saveCategory`, `deleteCategory`, `saveLink`, `deleteLink`, `togglePinLink`).
  - `index.html`: SPA responsif lengkap dengan styling Cyber Pipeline, interactive node-flow tree, fixed center modals, `.swatch-row` flex wrap, footer "Developed By 91KMEDW", logo 4-bar, overview panel, dan dual-theme switcher.

### B. Skema Kolom Database Terkini (Indeks Array Backend)
- **Users Sheet:** Col 0: ID_User | Col 1: Username | Col 2: Password | Col 3: Nama_Lengkap | Col 4: Role | Col 5: Status_Aktif | Col 6: Waktu_Dibuat
- **Categories Sheet:** Col 0: ID_Kategori | Col 1: Nama_Kategori | Col 2: Warna_Badge | Col 3: Icon_Class | Col 4: Deskripsi_Kategori | Col 5: Waktu_Update
- **Links Sheet:** Col 0: ID_Link | Col 1: ID_Kategori | Col 2: Parent_ID | Col 3: Level_Hierarki | Col 4: Judul_Link | Col 5: URL_Link | Col 6: Deskripsi_Singkat | Col 7: Status_Pin | Col 8: Urutan_Tampil | Col 9: Waktu_Update | Col 10: Visibilitas ('Tampil' / 'Hidden')

### C. Logika Bisnis & Perilaku Aktif
- **Fitur Visibilitas Link (Hide / Unhide Tautan):** Seluruh level tautan (Main Link Lv.1, Sub Link Lv.2, dan Endpoint Lv.3) memiliki kontrol visibilitas mandiri via tombol mata cepat di Dashboard Admin (`fa-eye` / `fa-eye-slash`) serta form Tambah/Edit. Tautan yang berstatus `Hidden` tetap tampil di Dashboard Admin dengan penanda visual khusus (badge lencana `Hidden` dan kartu semi-transparan redup), namun **otomatis disaring keluar 100% dari Landing Page Pengunjung** (termasuk dari perhitungan statistik publik). Fungsi backend `toggleHideLink(linkId)` memperbarui status kolom ke-11 `Visibilitas` secara instan tanpa menghapus rekaman data dari Google Sheets.
- **Sistem Manajemen Konten Landing Page Ringkas (Streamlined CMS & Direct Directory Flow):** Landing Page publik menyajikan alur visual langsung (*direct clean flow*): **Navbar -> Hero Section & Live Search -> Direktori Tautan Publik -> Footer** tanpa distraksi kartu-kartu promosi berukuran besar. Seluruh elemen teks (judul brand, tagline, tombol jelajahi, badge hero, headline gradien, deskripsi pengantar, placeholder pencarian, judul/subtitle direktori publik, hingga teks brand & copyright footer) dikelola secara terpusat melalui modal Pengaturan Admin yang ramping berbasis 2 tab: **Tab 1: Branding & Hero** dan **Tab 2: Direktori & Footer** (`#landingSettingsModal`). Data konfigurasi tersimpan permanen di cloud via Google Apps Script `PropertiesService.getScriptProperties()` (`LANDING_PAGE_CONFIG`) tanpa mengotori Google Sheets, dan di-cache secara instan di `localStorage` frontend untuk kinerja tanpa jeda (*zero latency*). Dilengkapi tombol *Reset ke Default* untuk mengembalikan setelan pabrikan kapan saja.
- **Perataan Alami Kartu Publik (Snug Content Height):** Kontainer kartu direktori publik (`.public-links-grid`) menggunakan `align-items: start;` dan mengeliminasi `margin-top: auto` pada tombol aksi, sehingga setiap kartu hanya mengambil tinggi vertikal alami sesuai kontennya sendiri. Kartu dengan jumlah Sub Link sedikit akan tampil ringkas, padat, dan rapi tanpa rongga kosong menganga.
- **Arsitektur Dual-View (Portal Publik & Gerbang Rahasia Admin):** Tampilan default saat WebApp dibuka adalah Landing Page Publik (`#landingView`) terinspirasi estetika Dark Cyber SaaS (Gambar 3). Pengunjung dapat mencari secara instan, memfilter kategori, serta membuka dan menyalin tautan secara nyaman tanpa harus login. Akses ke Dashboard Manajemen Admin (`#appView` - Gambar 1) dilindungi oleh gerbang rahasia (*stealth gateway*) via deteksi Klik 3x (*triple click*) pada logo brand `91KMEDW LINK PRO` (Gambar 2).
- **Main Link URL Opsional (Folder / Hub Node):** Kolom 'URL TUJUAN' pada Main Link (Level 1) berstatus **OPSIONAL**. Pengguna dapat membuat Main Link sebagai grup/folder penampung murni tanpa harus mengisi link website eksternal. Jika URL kosong, judul bertindak sebagai tombol pembuka/penutup cabang turunan (*toggle expander*) berbadge `Induk Folder`, dan tombol salin URL disembunyikan secara otomatis. Untuk Sub Link (Level 2) dan Sub-Sub Link (Level 3), URL tetap berstatus **WAJIB**.
- **Responsif Mobile & Fluid Pipeline Tree:** Pada layar smartphone/HP (`<= 768px` dan `<= 480px`), kartu hierarki link beralih ke tata letak vertikal bertingkat (`.node-header-row` flex-direction: column) dengan bilah aksi bawah mandiri (`.link-actions` full-width). Indentasi cabang (`.pipeline-branch-conduit` & `.endpoint-branch-conduit`) dikompresi proporsional (margin/padding 8px/12px) agar kartu Sub Link dan Endpoints tetap lega, stabil, dan ramah sentuhan jempol (*thumb-friendly*).
- **Footer Signature:** Banner di dasar layar menampilkan lencana identitas resmi: `Developed By 91KMEDW`.
- **Tata Letak Swatch:** Kontainer `.swatch-row` menggunakan `display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 8px;`.
- **Modal Pop-up Positioning:** Seluruh jendela dialog (`linkModal`, `categoryModal`, `confirmDeleteModal`) mengambang di tengah layar dengan `position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1000;`.
- **Identitas User Admin:** Label default nama lengkap dan peran utama adalah "Admin".
- **Dual Theme Support:** Kunci penyimpanan `ZETTLINK_APP_THEME = 'dark' | 'light'`.
- **Hierarki:** Maksimal 3 Level (1 = Trigger Node, 2 = Process Node, 3 = Endpoint Service Node).
- **Auto URL Formatting:** URL otomatis diawali `https://` jika belum memiliki protokol `http://`, `https://`, atau `mailto:`.
- **Cascading Category Update & Deletion:** Otomatis menjaga konsistensi data induk ke anak.
- **Anti-Distorsi Waktu:** Pembacaan data backend menggunakan `getDisplayValues()` dan penulisan diakhiri `SpreadsheetApp.flush()`.

### D. Log Pembaruan Resmi (Official Update Log)
- **REV-20261103-09 (Penyelarasan Kontras Tinggi Mode Terang - Light Mode High-Contrast & Anti-Invisible Text):**
  - Mengatasi kendala teks tak terlihat (*white-on-white text*) saat berganti ke Mode Terang (`body.theme-light`) pada Landing Page Publik.
  - Memasang aturan warna kontras tinggi `#0f172a` (Deep Slate Navy) pada teks pengumuman kapsul (`.capsule-text`, `.capsule-segment`), judul seksi direktori (`#landingDirectoryTitle`, `.directory-title`), dan input pencarian.
  - Mengonfigurasi warna abu-abu gelap `#475569` pada deskripsi hero (`.landing-hero-desc`) dan subtitle direktori, serta warna `#64748b` pada tagline brand dan meta info kartu.
  - Merapikan latar belakang dan border chip filter kategori (`.hero-cat-chip` dan `.public-filter-pill`) dengan style putih bersih berkontras tajam dan status aktif oranye solid.
  - Menjamin keterbacaan 100% sempurna (*crystal-clear typography*) di kedua tema (Mode Gelap Cyber & Mode Terang Blueprint).
- **REV-20261103-08 (Redesain Pengumuman Estetik: "Floating Capsule Hero" & Eliminasi Full-Width Bar Kaku):**
  - Mengeliminasi bilah pengumuman lama yang membentang 100% *edge-to-edge* menabrak tepi layar di bawah header.
  - Mentransformasi lencana Hero menjadi **Floating Announcement Capsule** terpusat di tengah layar (*max-width ~580px, pill-shape rounded-full*), bergaya estetika SaaS kelas dunia (Linear / Vercel).
  - Menyediakan tag lencana oranye dengan lampu hijau berkedip (`● INFO SISTEM`), teks pengumuman dinamis yang meluncur halus dengan efek masker tepi gradien, dan panah interaktif mini `[→]`.
  - Mengintegrasikan interaksi *hover glow*, *slight elevation*, dan *pause on hover/touch*, serta klik langsung untuk scroll mulus (*smooth scroll*) ke seksi direktori.
  - Teks default resmi: *"● SISTEM: Seluruh tautan beroperasi normal (Operational 100%) • Akses dokumen & aplikasi resmi"*.
  - Tetap terintegrasi penuh ke modal *Pengaturan Landing Page* (Admin CMS) untuk penggantian teks dan toggle status.
- **REV-20261103-07 (Fitur Running Text / Live Broadcast Announcement Ticker & Integrasi Admin CMS):**
  - Menghadirkan bilah teks berjalan (*Running Text / Broadcast Ticker*) bergaya Modern Cyber/Corporate Ticker tepat di bawah Header/Navbar utama pada Landing Page Publik.
  - Dilengkapi lencana kiri berlampu neon pulsing hijau (`● PENGUMUMAN`), efek masker fade di kedua ujung (*seamless gradient mask*), animasi translasi mulus (*infinite loop 42s*), serta fitur interaktif otomatis jeda saat disentuh/di-hover (*pause on hover/touch*).
  - Teks bawaan resmi: *"Selamat datang di Portal Direktori Resmi 91KMEDW Link Pro • Pastikan mengakses dokumen dan aplikasi kerja melalui tautan terverifikasi • Seluruh sistem beroperasi normal (Status: Operational) • Untuk penambahan tautan dan kendala akses, silakan hubungi Administrator."*
  - Terintegrasi penuh ke dalam modal pop-up *Pengaturan Landing Page* (Tab 1: Branding & Hero), memungkinkan Administrator mengaktifkan/menonaktifkan ticker, mengubah label lencana, dan memperbarui teks berjalan secara mandiri tanpa menyentuh kodingan.
- **REV-20261103-06 (Hotfix: Resolusi SyntaxError String Concatenation & Restorasi Stealth Gateway Admin Klik 3x Logo):**
  - Mengeliminasi SyntaxError: Unexpected token 'var' pada fungsi 
enderHierarchyTree() di index.html dengan memindahkan deklarasi variabel isMFirst, isSFirst, dan isGFirst ke kepala loop masing-masing level, serta memulihkan penyambungan string HTML concatenator secara solid tanpa interupsi statement.
  - Memastikan seluruh skrip JavaScript terkompilasi dan terevaluasi sempurna saat halaman pertama kali dimuat di browser.
  - Mengembalikan fungsi klik 3x logo (handleLogoSecretClick), fetch data otomatis (etchDashboardData), serta fungsionalitas reordering panah naik/turun di mode admin 100% normal dan bebas error.
- **REV-20261103-05 (Fitur Pengatur Urutan Tautan Cepat - Move Up/Down & Pindah Induk Hierarchy):**
  - Menghadirkan tombol aksi cepat panah Naik (`fa-solid fa-arrow-up`) dan Turun (`fa-solid fa-arrow-down`) pada setiap kartu node di Dashboard Admin (Main Link Lv.1, Sub Link Lv.2, dan Sub-Sub Link Lv.3).
  - Mengimplementasikan penukaran urutan seketika (*Instant Optimistic UI*) via fungsi `handleMoveLinkOrder(linkId, direction)` yang otomatis menyusun ulang posisi tampilan saudara (*siblings*) dan menyinkronkan data ke Google Sheets melalui fungsi backend `swapLinkOrder(payload)`.
  - Melengkapi form modal Edit Link dengan pemilih induk fleksibel (*Parent Selector*) sehingga pengguna dapat memindahkan Sub Link ke Main Link lain, atau memindahkan Sub-Sub Link ke Sub Link lain dengan mudah.
  - Memasang *smart disabled state* pada tombol panah jika tautan sudah berada di posisi paling atas atau paling bawah.
- **REV-20261103-04 (Penyelarasan Responsif Mobile Sublink Card & Resolusi Tombol Terpotong di Layar HP):**
  - Mengatasi masalah tombol `[Akses]` terpotong setengah dan tombol `[Salin URL]` terdorong keluar layar (*horizontal overflow*) pada ponsel berlayar sempit (360px - 412px).
  - Menerapkan pembungkus judul `<div style="flex:1; min-width:0; overflow:hidden;">` pada Sub Link (Level 2) dan Sub-Sub Link (Level 3) di `renderLandingComponents()`, sehingga judul yang panjang otomatis diringkas elipsis (*...*) dan tidak mendesak tombol aksi.
  - Mengunci bilah aksi `.public-sublink-actions` dengan `flex-shrink: 0; white-space: nowrap;` menjamin tombol Akses dan Salin URL selalu 100% utuh dan tampak berdampingan rapi.
  - Menambahkan aturan CSS media query responsif mobile (`@media (max-width: 768px)` dan `@media (max-width: 480px)`) untuk padding section dan kartu publik yang proporsional.
- **REV-20261103-03 (Penambahan Tombol Salin URL pada Sub-Sub Link / Endpoint di Portal Publik):**
  - Menambahkan tombol ikon salin URL (`fa-regular fa-copy`) pada baris Sub-Sub Link (Level 3 / Endpoint Nodes bergaris tepi ungu) di kartu direktori publik yang diekspansi (`renderLandingComponents()`).
  - Menyelaraskan aksi baris Sub-Sub Link dengan baris Sub Link (Level 2) di atasnya, sehingga memiliki pasangan aksi lengkap: tombol langsung **`[↗ Akses]`** dan tombol salin **`[📋 Salin URL]`**.
  - Mengintegrasikan aksi salin ke fungsi `copyLinkUrl(gId)` dengan dukungan Clipboard API modern, fallback aman, serta konfirmasi notifikasi *toast* hijau instan.
- **REV-20261103-02 (Eliminasi 3 Kartu Sorotan Showcase pada Portal Pengunjung - Clean & Compact Landing Page):**
  - Menghapus seksi 3 kartu sorotan showcase (`#landingFeaturesSection` & `.features-grid`) dari Landing Page Pengunjung sehingga pengunjung langsung diarahkan dari bilah pencarian Hero ke Seksi Direktori Tautan Publik tanpa perlu *scrolling* panjang.
  - Merampingkan modal pop-up *Pengaturan Landing Page* (`#landingSettingsModal`) dari 3 tab menjadi 2 tab terpadu: **Tab 1: Branding & Hero** dan **Tab 2: Direktori & Footer**.
  - Mengeliminasi field konfigurasi usang (`cfgShowFeatureCards`, `cfgFeature1/2/3*`) dari modal admin, payload penyimpanan, dan skema default `DEFAULT_LANDING_CONFIG`.
  - Menghapus kalkulasi statistik kartu sorotan pada `renderLandingComponents()` untuk meningkatkan performa rendering seketika (*zero overhead search & filter*).
  - Menyesuaikan *padding* atas `.landing-directory-section` dari 40px menjadi 24px agar menyatu secara alami (*seamless visual continuity*) di bawah bilah pencarian Hero.
- **REV-20261103-10 (Arsitektur Multi-Platform: Google Apps Script /exec ➔ GitHub ➔ Vercel):**
  - Mengembangkan arsitektur **Decoupled Headless Hybrid**: Frontend di-deploy statis di Vercel melalui integrasi Git/GitHub, dan Backend tetap di Google Apps Script (`/exec`) mengelola Google Sheets.
  - Membangun **Universal Backend Bridge Shim** di `index.html`: Membuat proxy cerdas `window.google.script.run` yang secara mulus mengalihkan seluruh pemanggilan data ke fungsi `executeVercelFetch(action, payload)` saat aplikasi dibuka di Vercel/GitHub Pages.
  - Menanamkan konstanta `GAS_EXEC_URL` dengan URL `/exec` pengguna yang aktif, serta menyediakan input pengubah dinamis di modal CMS Pengaturan Landing Page dengan persistensi `localStorage`.
  - Mengembangkan router API `handleApiRequest()` di `code.gs` yang melayani method `doGet(e)` dan `doPost(e)` dengan output format JSON CORS-friendly.
  - Menyiapkan konfigurasi routing dan header keamanan di `vercel.json` serta `.gitignore` dan `README.md`.
- **REV-20261103-09 (Penyelarasan Kontras Tinggi Mode Terang - Light Mode High-Contrast & Anti-Invisible Text):**
  - Memperbaiki visibilitas teks putih yang tidak terbaca pada mode terang pada judul direktori publik, kapsul hero, teks pengumuman, dan deskripsi kartu.
- **REV-20261103-08 (Redesain Pengumuman Estetik: "Floating Capsule Hero"):**
  - Mengubah bar pengumuman menjadi kapsul mengambang modern (*Floating Capsule Hero*) tepat di atas judul utama.
- **REV-20261103-07 (Fitur Running Text / Live Broadcast Announcement Ticker):**
  - Menambahkan running text pengumuman berjalan (*marquee*) dan integrasi CMS pengaturan admin.
- **REV-20261103-01 (Fitur Visibilitas Link - Sembunyikan / Hide Tautan dari Publik):**
  - Menambahkan tombol aksi cepat ikon mata (`fa-eye` warna hijau neon vs `fa-eye-slash` warna abu-abu/oranye) pada seluruh level kartu di Dashboard Admin (Main Link, Sub Link, dan Endpoint Node).
  - Mengimplementasikan penanda visual di Admin: kartu berstatus `Hidden` memiliki style border putus-putus redup (`.node-hidden-dim`), badge `Hidden`, dan status toggle instan via `handleToggleHide()`.
  - Mengintegrasikan filter otomatis di Landing Page Publik (`renderLandingComponents`) sehingga tautan atau sub-link tersembunyi tidak muncul di direktori maupun hitungan statistik pengunjung.
  - Memperbarui skema kolom ke-11 `Visibilitas` pada Google Sheets (`setup.gs`), fungsi backend `saveLink`, `getDashboardData`, dan `toggleHideLink(linkId)` di `code.gs`.
  - Menambahkan opsi dropdown Visibilitas Tautan pada modal form `linkModal`.
- **REV-20261102-13 (Sistem Manajemen Konten Landing Page & Menu Pengaturan Admin):**
  - Menambahkan menu dan modal pop-up *"Pengaturan Landing Page"* di Dashboard Admin (Top Action Bar & Sidebar) berdesain tab 3 langkah: Tab 1 (Branding & Hero), Tab 2 (3 Kartu Sorotan), dan Tab 3 (Direktori & Footer).
  - Menyediakan form konfigurasi menyeluruh untuk judul brand, tagline, tombol jelajahi, teks badge hero, judul utama baris 1 & 2 (gradien), deskripsi pengantar, placeholder pencarian, sakelar show/hide 3 kartu sorotan, judul/deskripsi/ikon/filter tiap kartu sorotan, judul & subtitle direktori publik, serta teks brand & copyright footer.
  - Membangun persistensi cloud di Google Apps Script (`code.gs`) melalui fungsi `saveLandingConfig(payload)` dan `getLandingConfig()` berbasis `PropertiesService.getScriptProperties()`, serta otomatis menyertakan config di `getDashboardData()`.
  - Mengintegrasikan rendering dinamis instan di frontend (`index.html`) via `applyLandingConfigToDOM()` dan *optimistic local caching* via `localStorage`.
- **REV-20261102-12 (Penyelarasan Alami Kartu Publik & Eliminasi Rongga Kosong):**
  - Menerapkan `align-items: start;` pada `.public-links-grid` sehingga kartu dengan jumlah sub-link sedikit tidak ditarik paksa memanjang oleh kartu lain yang lebih tinggi.
  - Menghapus `flex: 1` pada `.public-card-desc` dan menormalkan `margin-top` pada `.public-card-actions` sehingga tombol `📁 Tutup/Lihat Sub Link` duduk rapi tepat di bawah judul/deskripsi tanpa jeda kosong menganga.
- **REV-20261102-11 (Landing Page Publik Khusus Pengunjung & Stealth Gateway Admin Klik 3x):**
  - Mengubah tampilan utama bawaan (*default view*) menjadi **Landing Page Publik** bergaya Dark Cyber SaaS (ala Gambar 3).
  - Menyediakan navigasi publik, Hero section dengan *Instant Live Search*, 3 kartu sorotan (*highlight showcase cards*), dan direktori kartu tautan publik yang super nyaman tanpa tombol admin.
  - Memasang gerbang rahasia admin: Deteksi **Klik 3x pada logo 91KMEDW** (Gambar 2) yang memicu pop-up autentikasi administrator untuk masuk ke Dashboard Manajemen (Gambar 1).
  - Menambahkan tombol bolak-balik *"Portal Pengunjung"* di Dashboard Admin agar admin dapat meninjau landing page kapan saja tanpa logout.
- **REV-20261102-10 (URL Tujuan Opsional pada Main Link & Arsitektur Induk Folder):**
  - Mengubah status isian `URL TUJUAN` pada modal *Tambah Main Link (Level 1)* menjadi **OPSIONAL** (label `URL Tujuan (Opsional)`).
  - Melonggarkan validasi frontend (`index.html`) dan backend (`code.gs`) sehingga hanya mewajibkan Judul Tautan untuk Level 1, sedangkan Level 2 & 3 tetap mewajibkan URL.
  - Pada tampilan dashboard, Main Link tanpa URL otomatis dirender sebagai *Induk Folder Node* (mengklik judul otomatis membuka/tutup cabang anak dan tombol salin URL dihilangkan).
- **REV-20261102-09 (Optimalisasi Responsif Mobile Ultra-Presisi & Fluid Node Hierarchy):**
  - Menerapkan arsitektur CSS responsif bertingkat (`@media (max-width: 900px)`, `@media (max-width: 768px)`, dan `@media (max-width: 480px)`).
  - Mengubah `.node-header-row` menjadi susunan vertikal di HP sehingga judul tautan, URL panjang mono, dan badge hierarki tidak terhimpit.
  - Memindahkan deretan tombol aksi (`.link-actions`) menjadi bilah aksi bawah bergaris pemisah halus yang nyaman disentuh jempol.
  - Mengompresi indentasi cabang pipa pohon hierarki (Sub Link dan Sub-Sub Link) dari 88px menjadi 20px kumulatif di mobile, memberikan ruang baca kartu yang luas.
  - Mengatur bilah pencarian menjadi 100% fleksibel dan toolbar kontrol pohon menjadi tombol bagi-rata 3 kolom (*segmented control*).
  - Menempatkan notifikasi toast di atas bilah navigasi bawah HP (`bottom: 76px`) dan menyelaraskan tema terang pada bilah navigasi mobile.
- **REV-20261102-08 (Pembaruan Footer Banner "Developed By 91KMEDW"):**
  - Mengubah teks banner footer di bagian bawah halaman dari *"Enterprise-grade hierarchy. Built for speed. Designed for scale."* menjadi identitas pengembang resmi: **`Developed By 91KMEDW`**.
- **REV-20261102-07 (Perbaikan Tata Letak Pemilih Warna & Ikon Kategori):**
  - Mendaftarkan styling baku class `.swatch-row` dengan properti Flexbox horizontal berbaris rapi (`display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 8px;`).
- **REV-20261102-06 (Restorasi Modal Pop-up Tengah Layar):**
  - Menyelaraskan selektor CSS modal ke `.modal-backdrop` dan `.modal-dialog` dengan properti `position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px)`.
- **REV-20261102-05 (Transformasi UI/UX Desain Dark Cyber Pipeline & Node-Flow ala E-TechInvest):**
  - Transformasi estetika visual Dark Cyber Security & Workflow Automation Pipeline.
- **REV-20261102-04 (Perbaikan Ikon Blank Main Link Lv.1 & Normalisasi FontAwesome):**
  - Normalisasi class `fa-sitemap` dan `fa-graduation-cap`.
- **REV-20261102-03 (Penyelarasan Identitas User Display "Admin"):**
  - Mengganti teks `Super Admin Zettbos` menjadi `Admin`.
- **REV-20261102-02 (Pembuatan Mode Terang & Dual-Theme Switcher):**
  - Menambahkan styling lengkap `body.theme-light` dan tombol toggle Matahari / Bulan.
- **REV-20261102-01 (Terapkan CerbroFit Theme & Rebranding):**
  - Rebranding nama dari ZettLink Pro menjadi 91KMEDW Link Pro dan sub-judul Manajemen Link.
