// CLEAN CONFIG - 100% Dynamic - No Personal Details
// Har user ka apna Gmail, Balance, Logo dikhega

const APP_CONFIG = {
  APP_NAME: "PREMIUM SMS",
  REAL_ENDPOINT: "https://premiumotp.pro/api/v1/stark",
  CLONE_ENDPOINT: "/api/v1/stark",
  ACTIONS: {
    getBalance: "getBalance",
    getNumber: "getNumber",
    getStatus: "getStatus",
    setStatus: "setStatus"
  },
  SERVICE_CODES: { wa: "WhatsApp", tg: "Telegram", ig: "Instagram", fb: "Facebook", go: "Google", am: "Amazon" },
  SERVERS: { server1: "Server 1 (Fastest)", server2: "Server 2 (Premium)" }
};

function getCurrentUser() {
  try {
    const saved = JSON.parse(localStorage.getItem('premium_user') || 'null');
    if (saved) return saved;
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');
    const balance = localStorage.getItem('user_balance');
    if (email || name) {
      return {
        email: email || '',
        firstName: name ? name.split(' ')[0] : '',
        lastName: name ? name.split(' ').slice(1).join(' ') : '',
        balance: balance || '0.00'
      };
    }
    return null;
  } catch { return null; }
}
const BACKEND = APP_CONFIG;
