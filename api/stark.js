// Serverless proxy for premiumotp API
// Place this file at /api/stark.js for Vercel (or equivalent serverless host).
// IMPORTANT: Do NOT commit your API keys in the repository. Set MASTER_KEY as an environment variable.

export default async function handler(req, res) {
  try {
    // Allow both GET and POST
    const params = req.method === 'GET' ? req.query : req.body || {};
    const { action, api_key, ...rest } = params || {};

    // Prefer a client-provided api_key (e.g., a logged-in user's key). Otherwise use server MASTER_KEY
    const key = api_key || process.env.MASTER_KEY || '';
    if (!key) {
      res.status(400).send('Missing API key');
      return;
    }

    const query = new URLSearchParams({ api_key: key, action: action || 'getBalance', ...rest }).toString();
    const upstreamUrl = `https://premiumotp.pro/api/v1/stark?${query}`;

    // Forward the request to the real API and return the raw text response.
    const upstreamRes = await fetch(upstreamUrl, { method: 'GET', headers: { 'User-Agent': 'PremiumSMS-Proxy' } });
    const text = await upstreamRes.text();

    res.status(200).send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  }
}
