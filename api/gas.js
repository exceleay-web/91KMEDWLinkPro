/**
 * Vercel Serverless Function Proxy for Google Apps Script (/exec)
 * Endpoint: /api/gas
 * 
 * ZERO-PROMPT & ROBUST ERROR HANDLING ARCHITECTURE
 */

const GAS_URL =
  process.env.GAS_EXEC_URL ||
  'https://script.google.com/macros/s/AKfycbxdawfw8b_tvhWEl0-cxXYHPSMadJgPEG51FA6dSpIvEhlFnoB0o9YioALoijZlLFPcow/exec';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, maxRetries = 2, delayMs = 800) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      const text = await response.text();

      // Deteksi jika Google Apps Script mengembalikan halaman HTML
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        if (text.indexOf('Page Not Found') !== -1 || text.indexOf('does not exist') !== -1) {
          throw new Error('URL Google Apps Script (/exec) tidak ditemukan di server Google (404 Page Not Found). Pastikan URL deployment sudah benar.');
        }
        if (text.indexOf('accounts.google.com') !== -1 || text.indexOf('Sign in') !== -1) {
          throw new Error('Akses Google Apps Script tertutup. Ubah setelan "Siapa yang memiliki akses" menjadi "Siapa saja (Anyone)".');
        }
        throw new Error('Google Apps Script mengembalikan halaman HTML: ' + text.substring(0, 150));
      }

      // Jika respons berupa JSON yang sah
      try {
        return JSON.parse(text);
      } catch (e) {
        return { success: true, raw: text };
      }
    } catch (err) {
      lastError = err;
    }

    if (attempt < maxRetries) {
      await sleep(delayMs * attempt);
    }
  }
  throw lastError;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const targetUrl = (body && body.gasUrl) || GAS_URL;

    const data = await fetchWithRetry(
      targetUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(body || {}),
        redirect: 'follow'
      },
      2,
      800
    );

    return res.status(200).json(data);
  } catch (err) {
    console.error('Vercel GAS Proxy Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
