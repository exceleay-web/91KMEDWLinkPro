/**
 * Vercel Serverless Function Proxy for Google Apps Script (/exec)
 * Endpoint: /api/gas
 * Bebas CORS 100% (Koneksi Server-ke-Server)
 */

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
      try { body = JSON.parse(body); } catch (e) {}
    }

    const targetUrl =
      (body && body.gasUrl) ||
      process.env.GAS_EXEC_URL ||
      'https://script.google.com/macros/s/AKfycbyxdawfwRb_tvhWFID-cxYHPSMadJgPFGS1FA6d5plvFhIFnoB8o9YioALrij7lI-FPcow/exec';

    if (!targetUrl || targetUrl.indexOf('http') !== 0) {
      return res.status(400).json({
        success: false,
        message: 'URL Google Apps Script (/exec) tidak valid atau belum diisi.'
      });
    }

    const gasResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(body || {}),
      redirect: 'follow'
    });

    const responseText = await gasResponse.text();

    try {
      const responseJson = JSON.parse(responseText);
      return res.status(200).json(responseJson);
    } catch (parseErr) {
      return res.status(200).send(responseText);
    }
  } catch (err) {
    console.error('Vercel GAS Proxy Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Proxy Error: ' + err.message
    });
  }
}
