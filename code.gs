/**
 * ============================================================================
 * ZETTLINK PRO - BACKEND LOGIC & CRUD API (code.gs)
 * Arsitektur Zettbos: Anti-Lag, Server-Side Pagination, Batch I/O & Flush Sync
 * ============================================================================
 */

/**
 * 1. GERBANG UTAMA & ROUTER API DUAL-PLATFORM (WEBAPP & VERCEL / GITHUB)
 */
function doGet(e) {
  // Jika ada parameter ?action=, layani sebagai API JSON (untuk Vercel / External Fetch)
  if (e && e.parameter && e.parameter.action) {
    return handleApiRequest(e.parameter.action, e.parameter);
  }

  // Tampilan bawaan WebApp jika dibuka langsung dari URL Google Apps Script
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('91KMEDW Link Pro – Manajemen Link')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
    var data = raw ? JSON.parse(raw) : (e && e.parameter ? e.parameter : {});
    var action = data.action || (e && e.parameter ? e.parameter.action : '');
    var payload = (typeof data.payload !== 'undefined') ? data.payload : data;

    return handleApiRequest(action, payload);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Invalid API Request: ' + err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleApiRequest(action, payload) {
  var result = { success: false, message: 'Action API tidak dikenal: ' + action };

  try {
    if (action === 'getDashboardData') {
      result = getDashboardData();
    } else if (action === 'loginUser') {
      result = loginUser(payload);
    } else if (action === 'saveLink') {
      result = saveLink(payload);
    } else if (action === 'swapLinkOrder') {
      result = swapLinkOrder(payload);
    } else if (action === 'togglePinLink') {
      result = togglePinLink(payload && payload.linkId ? payload.linkId : payload);
    } else if (action === 'toggleHideLink') {
      result = toggleHideLink(payload && payload.linkId ? payload.linkId : payload);
    } else if (action === 'deleteLinkById') {
      result = deleteLinkById(payload && payload.linkId ? payload.linkId : payload);
    } else if (action === 'saveCategory') {
      result = saveCategory(payload);
    } else if (action === 'deleteCategoryById') {
      result = deleteCategoryById(payload && payload.categoryId ? payload.categoryId : payload);
    } else if (action === 'saveLandingConfig') {
      result = saveLandingConfig(payload);
    } else if (action === 'getLandingConfig') {
      result = { success: true, config: getLandingConfig() };
    }
  } catch (err) {
    result = { success: false, message: 'Server Exception: ' + err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper untuk fondasi modular Component-Based
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Helper waktu standar Asia/Jakarta
 */
function getNowFormatted() {
  return Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
}

/**
 * Helper pembuat ID Transaksi/Entitas Sekuensial yang di-reset harian
 * Contoh output: LNK-20261102-0001 atau CAT-20261102-0001
 */
function generateDailyId(sheet, prefix) {
  var dateStr = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd');
  var fullPrefix = prefix + '-' + dateStr + '-';
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return fullPrefix + '0001';
  }

  var idData = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
  var maxSeq = 0;

  for (var i = 0; i < idData.length; i++) {
    var currentId = String(idData[i][0] || '').trim();
    if (currentId.indexOf(fullPrefix) === 0) {
      var parts = currentId.split('-');
      var seqNum = parseInt(parts[2], 10);
      if (!isNaN(seqNum) && seqNum > maxSeq) {
        maxSeq = seqNum;
      }
    }
  }

  var nextSeq = String(maxSeq + 1);
  while (nextSeq.length < 4) {
    nextSeq = '0' + nextSeq;
  }
  return fullPrefix + nextSeq;
}

/**
 * Helper membaca seluruh baris sheet menggunakan getDisplayValues()
 */
function readSheetRows(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName(sheetName);
  }
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) {
    return [];
  }
  return sheet.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();
}

/**
 * 1. AUTENTIKASI LOGIN USER
 */
function loginUser(payload) {
  try {
    var usernameInput = String(payload && payload.username ? payload.username : '').trim().toLowerCase();
    var passwordInput = String(payload && payload.password ? payload.password : '').trim();

    if (!usernameInput || !passwordInput) {
      return { success: false, message: 'Username dan password wajib diisi.' };
    }

    var rows = readSheetRows('Users');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var dbUser = String(row[1] || '').trim().toLowerCase();
      var dbPass = String(row[2] || '').trim();
      var dbStatus = String(row[5] || '').trim();

      if (dbUser === usernameInput && dbPass === passwordInput) {
        if (dbStatus.toLowerCase() !== 'aktif') {
          return { success: false, message: 'Akun Anda sedang dinonaktifkan oleh Administrator.' };
        }
        return {
          success: true,
          message: 'Autentikasi berhasil! Selamat datang, ' + row[3] + '.',
          user: {
            id: row[0],
            username: row[1],
            namaLengkap: row[3],
            role: row[4],
            loginTime: getNowFormatted()
          }
        };
      }
    }

    return { success: false, message: 'Kombinasi Username atau Password tidak ditemukan.' };
  } catch (err) {
    return { success: false, message: 'Gagal memproses login: ' + err.message };
  }
}

/**
 * 2. MENGAMBIL DATA KATEGORI & HIERARKI LINK (SERVER-SIDE FILTERING & PAGINATION)
 */
function getDashboardData(params) {
  try {
    var filterCategory = String(params && params.categoryId ? params.categoryId : 'ALL').trim();
    var searchQuery = String(params && params.search ? params.search : '').trim().toLowerCase();
    var pinnedOnly = Boolean(params && params.pinnedOnly);
    var offset = parseInt(params && params.offset ? params.offset : 0, 10) || 0;
    var limit = parseInt(params && params.limit ? params.limit : 10, 10) || 10;

    // A. Baca Kategori
    var catRows = readSheetRows('Categories');
    var categories = [];
    var categoryMap = {};

    for (var c = 0; c < catRows.length; c++) {
      var cRow = catRows[c];
      if (!cRow[0]) continue;
      var catObj = {
        id: cRow[0],
        nama: cRow[1],
        warna: cRow[2] || '#00ffaa',
        icon: cRow[3] || 'fa-folder',
        deskripsi: cRow[4] || '',
        updatedAt: cRow[5] || ''
      };
      categories.push(catObj);
      categoryMap[catObj.id] = catObj;
    }

    // B. Baca Seluruh Link
    var linkRows = readSheetRows('Links');
    var allLinks = [];
    var linkById = {};

    var countLevel1 = 0;
    var countLevel2 = 0;
    var countLevel3 = 0;

    for (var l = 0; l < linkRows.length; l++) {
      var lRow = linkRows[l];
      if (!lRow[0]) continue;
      var lvl = parseInt(lRow[3], 10) || 1;
      if (lvl === 1) countLevel1++;
      else if (lvl === 2) countLevel2++;
      else if (lvl === 3) countLevel3++;

      var linkObj = {
        id: lRow[0],
        categoryId: lRow[1],
        parentId: lRow[2] || '',
        level: lvl,
        judul: lRow[4] || 'Tanpa Judul',
        url: lRow[5] || '',
        deskripsi: lRow[6] || '',
        statusPin: lRow[7] || 'Normal',
        urutan: parseInt(lRow[8], 10) || (l + 1),
        updatedAt: lRow[9] || '',
        visibilitas: (lRow[10] && String(lRow[10]).trim() === 'Hidden') ? 'Hidden' : 'Tampil'
      };
      allLinks.push(linkObj);
      linkById[linkObj.id] = linkObj;
    }

    // C. Identifikasi Main Link (Level 1) yang lolos filter
    // Jika Sub Link (Lv 2) atau Sub-Sub Link (Lv 3) cocok dengan pencarian,
    // maka Main Link induknya otomatis diikutsertakan agar pohon hierarki utuh.
    var matchedMainIds = {};

    for (var i = 0; i < allLinks.length; i++) {
      var item = allLinks[i];
      var rootMainId = '';

      if (item.level === 1) {
        rootMainId = item.id;
      } else if (item.level === 2 && linkById[item.parentId]) {
        rootMainId = item.parentId;
      } else if (item.level === 3 && linkById[item.parentId]) {
        var parentLv2 = linkById[item.parentId];
        if (parentLv2 && parentLv2.parentId) {
          rootMainId = parentLv2.parentId;
        }
      }

      if (!rootMainId || !linkById[rootMainId]) continue;
      var mainLink = linkById[rootMainId];

      // Cek filter kategori pada Main Link atau item itu sendiri
      var passCat = (filterCategory === 'ALL') || (mainLink.categoryId === filterCategory) || (item.categoryId === filterCategory);
      if (!passCat) continue;

      // Cek filter Pinned pada Main Link
      if (pinnedOnly && mainLink.statusPin !== 'Pinned') continue;

      // Cek kata kunci pencarian
      var passSearch = true;
      if (searchQuery !== '') {
        var catName = categoryMap[item.categoryId] ? categoryMap[item.categoryId].nama.toLowerCase() : '';
        var haystack = (item.judul + ' ' + item.url + ' ' + item.deskripsi + ' ' + catName).toLowerCase();
        passSearch = haystack.indexOf(searchQuery) !== -1;
      }

      if (passSearch) {
        matchedMainIds[rootMainId] = true;
      }
    }

    // D. Kumpulkan dan urutkan Main Link (Pinned di atas, lalu urutan tampil)
    var filteredMainLinks = [];
    for (var m = 0; m < allLinks.length; m++) {
      var candidate = allLinks[m];
      if (candidate.level === 1 && matchedMainIds[candidate.id]) {
        filteredMainLinks.push(candidate);
      }
    }

    filteredMainLinks.sort(function(a, b) {
      if (a.statusPin === 'Pinned' && b.statusPin !== 'Pinned') return -1;
      if (a.statusPin !== 'Pinned' && b.statusPin === 'Pinned') return 1;
      return a.urutan - b.urutan;
    });

    // E. Server-Side Pagination pada Main Link
    var totalMainFiltered = filteredMainLinks.length;
    var paginatedMains = filteredMainLinks.slice(offset, offset + limit);
    var activeMainMap = {};
    for (var p = 0; p < paginatedMains.length; p++) {
      activeMainMap[paginatedMains[p].id] = true;
    }

    // F. Ambil seluruh Sub Link (Lv 2) dan Sub-Sub Link (Lv 3) milik Main Link yang terpaginasi
    var resultLinks = [];
    var activeSubMap = {};

    for (var s1 = 0; s1 < paginatedMains.length; s1++) {
      resultLinks.push(paginatedMains[s1]);
    }

    for (var s2 = 0; s2 < allLinks.length; s2++) {
      var l2 = allLinks[s2];
      if (l2.level === 2 && activeMainMap[l2.parentId]) {
        resultLinks.push(l2);
        activeSubMap[l2.id] = true;
      }
    }

    for (var s3 = 0; s3 < allLinks.length; s3++) {
      var l3 = allLinks[s3];
      if (l3.level === 3 && activeSubMap[l3.parentId]) {
        resultLinks.push(l3);
      }
    }

    return {
      success: true,
      categories: categories,
      links: resultLinks,
      landingConfig: getLandingConfig(),
      pagination: {
        offset: offset,
        limit: limit,
        totalMain: totalMainFiltered,
        hasMore: (offset + limit) < totalMainFiltered
      },
      stats: {
        totalCategories: categories.length,
        totalLinks: allLinks.length,
        totalMainLinks: countLevel1,
        totalSubLinks: countLevel2,
        totalSubSubLinks: countLevel3
      }
    };
  } catch (err) {
    return { success: false, message: 'Gagal memuat data dashboard: ' + err.message };
  }
}

/**
 * 3. SIMPAN KATEGORI (TAMBAH & EDIT)
 */
function saveCategory(payload) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Categories');
    if (!sheet) {
      setupDatabase();
      sheet = ss.getSheetByName('Categories');
    }

    var id = String(payload && payload.id ? payload.id : '').trim();
    var nama = String(payload && payload.nama ? payload.nama : '').trim();
    var warna = String(payload && payload.warna ? payload.warna : '#00ffaa').trim();
    var icon = String(payload && payload.icon ? payload.icon : 'fa-folder').trim();
    var deskripsi = String(payload && payload.deskripsi ? payload.deskripsi : '').trim();
    var now = getNowFormatted();

    if (!nama) {
      return { success: false, message: 'Nama kategori tidak boleh kosong.' };
    }

    var isEdit = false;
    var lastRow = sheet.getLastRow();

    if (id && lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          var rowNum = i + 2;
          sheet.getRange(rowNum, 1, 1, 6).setValues([[id, nama, warna, icon, deskripsi, now]]);
          isEdit = true;
          break;
        }
      }
    }

    if (!isEdit) {
      id = generateDailyId(sheet, 'CAT');
      sheet.appendRow([id, nama, warna, icon, deskripsi, now]);
    }

    SpreadsheetApp.flush();

    return {
      success: true,
      message: isEdit ? 'Kategori berhasil diperbarui!' : 'Kategori baru berhasil ditambahkan!',
      category: {
        id: id,
        nama: nama,
        warna: warna,
        icon: icon,
        deskripsi: deskripsi,
        updatedAt: now
      }
    };
  } catch (err) {
    return { success: false, message: 'Gagal menyimpan kategori: ' + err.message };
  }
}

/**
 * 4. HAPUS KATEGORI
 */
function deleteCategory(categoryId) {
  try {
    var targetId = String(categoryId || '').trim();
    if (!targetId) {
      return { success: false, message: 'ID Kategori tidak valid.' };
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var catSheet = ss.getSheetByName('Categories');
    var linkSheet = ss.getSheetByName('Links');

    // Validasi apakah kategori masih dipakai oleh link
    if (linkSheet && linkSheet.getLastRow() > 1) {
      var linkData = linkSheet.getRange(2, 2, linkSheet.getLastRow() - 1, 1).getDisplayValues();
      var usedCount = 0;
      for (var l = 0; l < linkData.length; l++) {
        if (String(linkData[l][0]).trim() === targetId) {
          usedCount++;
        }
      }
      if (usedCount > 0) {
        return {
          success: false,
          message: 'Kategori tidak bisa dihapus karena masih digunakan oleh ' + usedCount + ' link. Pindahkan atau hapus link terkait terlebih dahulu.'
        };
      }
    }

    if (catSheet && catSheet.getLastRow() > 1) {
      var catIds = catSheet.getRange(2, 1, catSheet.getLastRow() - 1, 1).getDisplayValues();
      for (var i = 0; i < catIds.length; i++) {
        if (String(catIds[i][0]).trim() === targetId) {
          catSheet.deleteRow(i + 2);
          SpreadsheetApp.flush();
          return { success: true, message: 'Kategori berhasil dihapus!', deletedId: targetId };
        }
      }
    }

    return { success: false, message: 'Data kategori tidak ditemukan di database.' };
  } catch (err) {
    return { success: false, message: 'Gagal menghapus kategori: ' + err.message };
  }
}

/**
 * 5. SIMPAN LINK / SUB LINK / SUB-SUB LINK (TAMBAH & EDIT)
 */
function saveLink(payload) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Links');
    if (!sheet) {
      setupDatabase();
      sheet = ss.getSheetByName('Links');
    }

    var id = String(payload && payload.id ? payload.id : '').trim();
    var categoryId = String(payload && payload.categoryId ? payload.categoryId : '').trim();
    var parentId = String(payload && payload.parentId ? payload.parentId : '').trim();
    var level = parseInt(payload && payload.level ? payload.level : 1, 10) || 1;
    var judul = String(payload && payload.judul ? payload.judul : '').trim();
    var url = String(payload && payload.url ? payload.url : '').trim();
    var deskripsi = String(payload && payload.deskripsi ? payload.deskripsi : '').trim();
    var statusPin = String(payload && payload.statusPin ? payload.statusPin : 'Normal').trim();
    var urutan = parseInt(payload && payload.urutan ? payload.urutan : 1, 10) || 1;
    var visibilitas = String(payload && payload.visibilitas ? payload.visibilitas : 'Tampil').trim();
    if (visibilitas !== 'Hidden') visibilitas = 'Tampil';
    var now = getNowFormatted();

    if (!judul) {
      return { success: false, message: 'Judul Link wajib diisi.' };
    }
    if (level > 1 && !url) {
      return { success: false, message: 'URL Tujuan wajib diisi untuk Sub Link.' };
    }

    if (url && url !== '#') {
      if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0 && url.indexOf('mailto:') !== 0) {
        url = 'https://' + url;
      }
    } else {
      url = '';
    }

    if (level === 1) {
      parentId = '';
    }

    var isEdit = false;
    var lastRow = sheet.getLastRow();

    if (id && lastRow > 1) {
      var allRows = sheet.getRange(2, 1, lastRow - 1, 10).getDisplayValues();
      for (var i = 0; i < allRows.length; i++) {
        if (String(allRows[i][0]).trim() === id) {
          var rowNum = i + 2;
          sheet.getRange(rowNum, 1, 1, 11).setValues([[
            id,
            categoryId,
            parentId,
            String(level),
            judul,
            url,
            deskripsi,
            statusPin,
            String(urutan),
            now,
            visibilitas
          ]]);
          isEdit = true;

          // Jika Main Link berganti kategori, sinkronkan kategori pada anak-anaknya
          if (level === 1) {
            for (var c = 0; c < allRows.length; c++) {
              if (String(allRows[c][2]).trim() === id) {
                var subId = String(allRows[c][0]).trim();
                sheet.getRange(c + 2, 2).setValue(categoryId);
                for (var g = 0; g < allRows.length; g++) {
                  if (String(allRows[g][2]).trim() === subId) {
                    sheet.getRange(g + 2, 2).setValue(categoryId);
                  }
                }
              }
            }
          }
          break;
        }
      }
    }

    if (!isEdit) {
      id = generateDailyId(sheet, 'LNK');
      sheet.appendRow([
        id,
        categoryId,
        parentId,
        String(level),
        judul,
        url,
        deskripsi,
        statusPin,
        String(urutan),
        now,
        visibilitas
      ]);
    }

    SpreadsheetApp.flush();

    return {
      success: true,
      message: isEdit ? 'Data link berhasil diperbarui!' : 'Link baru berhasil disimpan!',
      link: {
        id: id,
        categoryId: categoryId,
        parentId: parentId,
        level: level,
        judul: judul,
        url: url,
        deskripsi: deskripsi,
        statusPin: statusPin,
        urutan: urutan,
        updatedAt: now,
        visibilitas: visibilitas
      }
    };
  } catch (err) {
    return { success: false, message: 'Gagal menyimpan link: ' + err.message };
  }
}

/**
 * 6. HAPUS LINK BESERTA TURUNANNYA (CASCADING DELETE)
 */
function deleteLink(linkId) {
  try {
    var targetId = String(linkId || '').trim();
    if (!targetId) {
      return { success: false, message: 'ID Link tidak valid.' };
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Links');
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: false, message: 'Data link tidak ditemukan.' };
    }

    var lastRow = sheet.getLastRow();
    var rows = sheet.getRange(2, 1, lastRow - 1, 10).getDisplayValues();

    // Cari seluruh ID yang harus dihapus (Target + Sub Link + Sub-Sub Link)
    var toDeleteMap = {};
    toDeleteMap[targetId] = true;

    // Iterasi 2 kali untuk menangkap Level 2 dan Level 3 di bawahnya
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i < rows.length; i++) {
        var rId = String(rows[i][0]).trim();
        var rParent = String(rows[i][2]).trim();
        if (rParent && toDeleteMap[rParent]) {
          toDeleteMap[rId] = true;
        }
      }
    }

    var deletedIds = [];
    // Hapus baris dari bawah ke atas agar indeks baris tidak bergeser
    for (var d = rows.length - 1; d >= 0; d--) {
      var rowId = String(rows[d][0]).trim();
      if (toDeleteMap[rowId]) {
        sheet.deleteRow(d + 2);
        deletedIds.push(rowId);
      }
    }

    SpreadsheetApp.flush();

    return {
      success: true,
      message: 'Berhasil menghapus ' + deletedIds.length + ' tautan dalam struktur hierarki.',
      deletedIds: deletedIds
    };
  } catch (err) {
    return { success: false, message: 'Gagal menghapus link: ' + err.message };
  }
}

/**
 * 7. TOGGLE PIN MAIN LINK
 */
function togglePinLink(linkId) {
  try {
    var targetId = String(linkId || '').trim();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Links');
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: false, message: 'Sheet Links masih kosong.' };
    }

    var lastRow = sheet.getLastRow();
    var rows = sheet.getRange(2, 1, lastRow - 1, 10).getDisplayValues();
    var now = getNowFormatted();

    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === targetId) {
        var currentPin = String(rows[i][7]).trim();
        var nextPin = (currentPin === 'Pinned') ? 'Normal' : 'Pinned';
        sheet.getRange(i + 2, 8).setValue(nextPin);
        sheet.getRange(i + 2, 10).setValue(now);
        SpreadsheetApp.flush();
        return {
          success: true,
          id: targetId,
          statusPin: nextPin,
          message: nextPin === 'Pinned' ? 'Link disematkan ke daftar atas!' : 'Sematkan link dilepas.'
        };
      }
    }

    return { success: false, message: 'Link tidak ditemukan.' };
  } catch (err) {
    return { success: false, message: 'Gagal mengubah status pin: ' + err.message };
  }
}

/**
 * 8. PENGATURAN LANDING PAGE (PROPERTIES SERVICE PERSISTENCE)
 */
function getLandingConfig() {
  try {
    var props = PropertiesService.getScriptProperties();
    var rawConfig = props.getProperty('LANDING_PAGE_CONFIG');
    if (!rawConfig) {
      return null;
    }
    return JSON.parse(rawConfig);
  } catch (err) {
    Logger.log('Error getLandingConfig: ' + err.message);
    return null;
  }
}

function saveLandingConfig(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      return { success: false, message: 'Payload konfigurasi tidak valid.' };
    }
    var props = PropertiesService.getScriptProperties();
    props.setProperty('LANDING_PAGE_CONFIG', JSON.stringify(payload));
    return {
      success: true,
      message: 'Pengaturan Landing Page berhasil disimpan secara permanen.',
      config: payload
    };
  } catch (err) {
    return { success: false, message: 'Gagal menyimpan pengaturan: ' + err.message };
  }
}

/**
 * 9. TOGGLE HIDE / VISIBILITY LINK (TAMPIL <-> HIDDEN)
 */
function toggleHideLink(linkId) {
  try {
    var targetId = String(linkId || '').trim();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Links');
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: false, message: 'Sheet Links masih kosong.' };
    }

    var lastRow = sheet.getLastRow();
    var lastCol = Math.max(sheet.getLastColumn(), 11);
    var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();
    var now = getNowFormatted();

    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === targetId) {
        var currentVis = String(rows[i][10] || '').trim();
        var nextVis = (currentVis === 'Hidden') ? 'Tampil' : 'Hidden';
        sheet.getRange(i + 2, 11).setValue(nextVis);
        sheet.getRange(i + 2, 10).setValue(now);
        SpreadsheetApp.flush();
        return {
          success: true,
          id: targetId,
          visibilitas: nextVis,
          message: nextVis === 'Hidden' ? 'Tautan disembunyikan dari pengunjung publik!' : 'Tautan kembali ditampilkan di publik!'
        };
      }
    }

    return { success: false, message: 'Link tidak ditemukan.' };
  } catch (err) {
    return { success: false, message: 'Gagal mengubah visibilitas link: ' + err.message };
  }
}

/**
 * 10. TUKAR URUTAN LINK (SWAP REORDER SIBLING LINKS)
 */
function swapLinkOrder(payload) {
  try {
    var idA = String(payload && payload.idA ? payload.idA : '').trim();
    var idB = String(payload && payload.idB ? payload.idB : '').trim();
    if (!idA || !idB) {
      return { success: false, message: 'ID tautan tidak valid.' };
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Links');
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: false, message: 'Sheet Links masih kosong.' };
    }
    var lastRow = sheet.getLastRow();
    var lastCol = Math.max(sheet.getLastColumn(), 11);
    var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();
    var rowA = -1, rowB = -1;
    var orderA = payload && payload.orderA ? parseInt(payload.orderA, 10) : null;
    var orderB = payload && payload.orderB ? parseInt(payload.orderB, 10) : null;

    for (var i = 0; i < rows.length; i++) {
      var currentId = String(rows[i][0]).trim();
      if (currentId === idA) {
        rowA = i + 2;
        if (orderA === null) orderA = parseInt(rows[i][8], 10) || 1;
      } else if (currentId === idB) {
        rowB = i + 2;
        if (orderB === null) orderB = parseInt(rows[i][8], 10) || 1;
      }
    }

    if (rowA === -1 || rowB === -1) {
      return { success: false, message: 'Salah satu link tidak ditemukan di database.' };
    }

    // Jika urutan sama persis, beri jarak
    if (orderA === orderB) {
      var dir = String(payload && payload.direction ? payload.direction : 'UP').toUpperCase();
      if (dir === 'UP') {
        orderA = Math.max(1, orderB - 1);
      } else {
        orderA = orderB + 1;
      }
    }

    var now = getNowFormatted();
    sheet.getRange(rowA, 9).setValue(orderA);
    sheet.getRange(rowA, 10).setValue(now);
    sheet.getRange(rowB, 9).setValue(orderB);
    sheet.getRange(rowB, 10).setValue(now);
    SpreadsheetApp.flush();

    return {
      success: true,
      message: 'Urutan tautan berhasil diperbarui!',
      idA: idA, orderA: orderA,
      idB: idB, orderB: orderB
    };
  } catch (err) {
    return { success: false, message: 'Gagal menukar urutan link: ' + err.message };
  }
}
