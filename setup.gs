/**
 * ============================================================================
 * ZETTLINK PRO - DATABASE INITIALIZATION & SAFE MIGRATE (setup.gs)
 * Arsitektur Zettbos: Non-Destruktif (Safe Migrate) & Batch Processing
 * ============================================================================
 */

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var now = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
  var dateCode = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd');

  // 1. Konfigurasi Skema Sheet & Header
  var schema = {
    'Users': [
      'ID_User',
      'Username',
      'Password',
      'Nama_Lengkap',
      'Role',
      'Status_Aktif',
      'Waktu_Dibuat'
    ],
    'Categories': [
      'ID_Kategori',
      'Nama_Kategori',
      'Warna_Badge',
      'Icon_Class',
      'Deskripsi_Kategori',
      'Waktu_Update'
    ],
    'Links': [
      'ID_Link',
      'ID_Kategori',
      'Parent_ID',
      'Level_Hierarki',
      'Judul_Link',
      'URL_Link',
      'Deskripsi_Singkat',
      'Status_Pin',
      'Urutan_Tampil',
      'Waktu_Update',
      'Visibilitas'
    ]
  };

  // 2. Proses Safe Migrate (DILARANG menggunakan clear() jika data sudah ada)
  for (var sheetName in schema) {
    if (schema.hasOwnProperty(sheetName)) {
      var headers = schema[sheetName];
      var sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
      }

      // Update baris header saja tanpa menghapus data pengguna yang sudah ada
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setBackground('#0b0f19');
      headerRange.setFontColor('#00ffaa');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }

  // 3. Isi Data Dummy HANYA jika Sheet masih kosong (LastRow <= 1)
  var userSheet = ss.getSheetByName('Users');
  if (userSheet.getLastRow() <= 1) {
    var dummyUsers = [
      ['USR-' + dateCode + '-0001', 'admin', 'admin123', 'Admin', 'Admin', 'Aktif', now],
      ['USR-' + dateCode + '-0002', 'staff', 'staff123', 'Tim Operasional', 'Editor', 'Aktif', now]
    ];
    userSheet.getRange(2, 1, dummyUsers.length, dummyUsers[0].length).setValues(dummyUsers);
  } else {
    // Safe Migration: Selaraskan nama admin jika masih memuat 'Super Admin Zettbos'
    var userValues = userSheet.getDataRange().getValues();
    for (var u = 1; u < userValues.length; u++) {
      if (userValues[u][1] === 'admin' && (userValues[u][3] === 'Super Admin Zettbos' || userValues[u][3] === 'Super Admin ZettBoss')) {
        userSheet.getRange(u + 1, 4).setValue('Admin');
      }
    }
  }

  var catSheet = ss.getSheetByName('Categories');
  var cat1 = 'CAT-' + dateCode + '-0001';
  var cat2 = 'CAT-' + dateCode + '-0002';
  var cat3 = 'CAT-' + dateCode + '-0003';
  var cat4 = 'CAT-' + dateCode + '-0004';

  if (catSheet.getLastRow() <= 1) {
    var dummyCategories = [
      [cat1, 'Operasional & HR', '#00ffaa', 'fa-briefcase', 'Tautan portal kerja, SOP, dan administrasi tim', now],
      [cat2, 'Development & Cloud', '#38bdf8', 'fa-code', 'Repository Git, dokumentasi API, dan server staging', now],
      [cat3, 'Marketing & Brand', '#f472b6', 'fa-bullhorn', 'Aset desain, kalender konten, dan kampanye iklan', now],
      [cat4, 'Finance & Legal', '#fbbf24', 'fa-wallet', 'Laporan keuangan, perpajakan, dan dokumen kontrak', now]
    ];
    catSheet.getRange(2, 1, dummyCategories.length, dummyCategories[0].length).setValues(dummyCategories);
  }

  var linkSheet = ss.getSheetByName('Links');
  if (linkSheet.getLastRow() <= 1) {
    var lnkMain1 = 'LNK-' + dateCode + '-0001';
    var lnkSub1A = 'LNK-' + dateCode + '-0002';
    var lnkSubSub1A1 = 'LNK-' + dateCode + '-0003';
    var lnkSubSub1A2 = 'LNK-' + dateCode + '-0004';
    var lnkSub1B = 'LNK-' + dateCode + '-0005';

    var lnkMain2 = 'LNK-' + dateCode + '-0006';
    var lnkSub2A = 'LNK-' + dateCode + '-0007';
    var lnkSubSub2A1 = 'LNK-' + dateCode + '-0008';

    var lnkMain3 = 'LNK-' + dateCode + '-0009';
    var lnkSub3A = 'LNK-' + dateCode + '-0010';

    var dummyLinks = [
      // Hirarki 1: Operasional & HR (Main -> Sub -> Sub-Sub)
      [lnkMain1, cat1, '', '1', 'Workspace Portal Internal', 'https://workspace.google.com', 'Portal utama operasional harian seluruh divisi perusahaan', 'Pinned', '1', now],
      [lnkSub1A, cat1, lnkMain1, '2', 'Sistem HRIS & Kehadiran', 'https://hris.example.com', 'Dashboard manajemen absensi, cuti, dan klaim karyawan', 'Normal', '1', now],
      [lnkSubSub1A1, cat1, lnkSub1A, '3', 'Formulir Pengajuan Cuti Tahunan', 'https://hris.example.com/leave-form', 'Form pengajuan cuti online maksimal H-3', 'Normal', '1', now],
      [lnkSubSub1A2, cat1, lnkSub1A, '3', 'Klaim Reimburse Medis & Operasional', 'https://hris.example.com/reimburse', 'Unggah bukti kwitansi klaim kesehatan bulanan', 'Normal', '2', now],
      [lnkSub1B, cat1, lnkMain1, '2', 'Buku Panduan & SOP Standar', 'https://docs.google.com', 'Kumpulan dokumen SOP resmi dan onboarding karyawan baru', 'Normal', '2', now],

      // Hirarki 2: Development & Cloud (Main -> Sub -> Sub-Sub)
      [lnkMain2, cat2, '', '1', 'GitHub Enterprise & Cloud Repo', 'https://github.com', 'Pusat manajemen source code dan CI/CD pipeline engineering', 'Pinned', '2', now],
      [lnkSub2A, cat2, lnkMain2, '2', 'Frontend WebApp Monorepo', 'https://github.com/org/frontend-monorepo', 'Repository utama aplikasi web produksi dan staging', 'Normal', '1', now],
      [lnkSubSub2A1, cat2, lnkSub2A, '3', 'Dokumentasi UI Kit & Design System', 'https://storybook.js.org', 'Komponen UI standar berstandar Zettbos Dark Glassmorphism', 'Normal', '1', now],

      // Hirarki 3: Marketing & Brand (Main -> Sub)
      [lnkMain3, cat3, '', '1', 'Brand Guidelines & Media Kit 2026', 'https://drive.google.com', 'Folder utama logo resmi, font, dan template presentasi klien', 'Normal', '3', now],
      [lnkSub3A, cat3, lnkMain3, '2', 'Kalender Editorial Social Media', 'https://sheets.google.com', 'Jadwal publikasi harian Instagram, TikTok, dan LinkedIn', 'Normal', '1', now]
    ];
    linkSheet.getRange(2, 1, dummyLinks.length, dummyLinks[0].length).setValues(dummyLinks);
  }

  SpreadsheetApp.flush();
  return 'Setup Database 91KMEDW Link Pro berhasil dijalankan dengan mode Safe Migrate!';
}