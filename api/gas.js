/**
 * Vercel Serverless Function Proxy (DEPRECATED & LOCKED)
 * Endpoint: /api/gas
 *
 * Keamanan: Endpoint proxy warisan Google Apps Script ini telah ditutup permanen
 * untuk mencegah celah Open Proxy / Server-Side Request Forgery (SSRF).
 * Seluruh operasi database kini terhubung langsung ke Supabase Cloud PostgreSQL.
 */

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store');

  return res.status(410).json({
    success: false,
    message: 'Endpoint legacy /api/gas telah dinonaktifkan demi keamanan. Sistem kini menggunakan Supabase Cloud.'
  });
}
