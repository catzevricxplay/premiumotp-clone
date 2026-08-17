// AUTH SYSTEM - Dynamic per user
function initAuth(required = false) {
  const user = getCurrentUser();
  if (required && !user) { window.location.href = 'login.html'; return null; }
  if (!user) return null;
  const firstName = user.firstName || user.email?.split('@')[0] || 'User';
  const lastName = user.lastName || '';
  const displayName = (firstName + ' ' + lastName).trim();
  const displayEmail = user.email || '';
  const balance = user.balance || localStorage.getItem('user_balance') || '0.00';
  const initial = displayName.charAt(0).toUpperCase() || displayEmail.charAt(0).toUpperCase() || 'U';

  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.innerText = value; };

  setText('uName', displayName);
  setText('userName', displayName);
  setText('uEmail', displayEmail);
  setText('userEmail', displayEmail);
  setText('av', initial);
  setText('avatar', initial);
  setText('balAmt', '₹'+balance);
  setText('bal', '₹'+balance);
  setText('balanceAmount', '₹'+balance);

  document.querySelectorAll('.user-name').forEach(e => e.innerText = displayName);
  document.querySelectorAll('.user-email').forEach(e => e.innerText = displayEmail);
  document.querySelectorAll('.user-avatar, .avatar').forEach(e => {
    // only replace if it's a single letter avatar
    if (e.innerText.length <= 2) e.innerText = initial;
  });
  document.querySelectorAll('.user-balance, .bal-amt, #balAmt').forEach(e => e.innerText = '₹'+balance);

  return { displayName, displayEmail, balance, initial, raw: user };
}
function logout() {
  localStorage.removeItem('premium_user');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_balance');
  window.location.href = 'login.html';
}
function saveUser(userObj) {
  localStorage.setItem('premium_user', JSON.stringify(userObj));
  if (userObj.email) localStorage.setItem('user_email', userObj.email);
  if (userObj.firstName) localStorage.setItem('user_name', (userObj.firstName + ' ' + (userObj.lastName||'')).trim());
  if (userObj.balance) localStorage.setItem('user_balance', userObj.balance);
}
document.addEventListener('DOMContentLoaded', () => { initAuth(false); });
