
// EXTRACTED BACKEND FROM premiumotp.pro
// Original Endpoint: https://premiumotp.pro/api/v1/stark
// This file replicates same structure for your clone
const BACKEND = {
  REAL_ENDPOINT: "https://premiumotp.pro/api/v1/stark",
  CLONE_ENDPOINT: "/api/v1/stark", // Your clone endpoint (proxy)
  API_KEY: "ffcc751480b3c67244ea7123acbeb608",
  ACTIONS: {
    getBalance: "getBalance -> ACCESS_BALANCE:xxx",
    getNumber: "getNumber?service=wa&server=server1 -> ACCESS_NUMBER:id:phone",
    getStatus: "getStatus?id=xxx -> STATUS_WAIT_CODE / STATUS_OK:otp",
    setStatus: "setStatus?id=xxx&status=8 (cancel) / 6 (finish)",
    getServers: "getServers JSON",
    getServices: "getServices?server=server1 JSON"
  },
  SERVICE_CODES: { wa: "WhatsApp", tg: "Telegram", ig: "Instagram", fb: "Facebook", go: "Google", am: "Amazon" },
  SERVERS: { server1: "Server 1 (Fastest)", server2: "Server 2 (Premium)" },
  QR_LOGIC: "QR only on add-funds.html - NOT on index.html landing - as per original site flow"
};
console.log("Backend Extracted:", BACKEND);
