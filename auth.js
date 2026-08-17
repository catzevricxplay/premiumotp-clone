// AUTH SYSTEM - Dynamic per user - No hardcoded email - With Real Balance API
function initAuth(required=false){
  const user=getCurrentUser();
  if(required && !user){ window.location.href='login.html'; return null; }
  if(!user) return null;
  const firstName=user.firstName || user.email?.split('@')[0] || 'User';
  const lastName=user.lastName || '';
  const displayName=(firstName+' '+lastName).trim();
  const displayEmail=user.email || '';
  const balance=user.balance || localStorage.getItem('user_balance') || '0.00';
  const initial=displayName.charAt(0).toUpperCase() || 'U';
  const setText=(id,val)=>{ const el=document.getElementById(id); if(el) el.innerText=val; };
  setText('uName',displayName); setText('userName',displayName);
  setText('uEmail',displayEmail); setText('userEmail',displayEmail);
  setText('av',initial); setText('avatar',initial);
  setText('bal','₹'+balance); setText('balAmt','₹'+balance); setText('balanceAmount','₹'+balance);
  document.querySelectorAll('.user-name').forEach(e=>e.innerText=displayName);
  document.querySelectorAll('.user-email').forEach(e=>e.innerText=displayEmail);
  document.querySelectorAll('.user-balance,.bal-amt').forEach(e=>e.innerText='₹'+balance);
  // Try to fetch real balance from API in background via serverless proxy
  setTimeout(()=>{ updateBalanceFromAPI(); }, 500);
  return {displayName,displayEmail,balance,initial,raw:user};
}

async function updateBalanceFromAPI(){
  try {
    const user = getCurrentUser();
    if(!user) return;
    // Prefer user's own api key stored in their profile (client-side). If not available,
    // we call the serverless proxy which will use a server-side MASTER_KEY if configured.
    const userKey = user.api_key || user.apiKey || '';
    const params = new URLSearchParams();
    params.set('action','getBalance');
    if(userKey) params.set('api_key', userKey);
    // Call our serverless proxy to avoid CORS and keep MASTER_KEY secret when used
    const url = `/api/stark?${params.toString()}`;
    const res = await fetch(url);
    const text = await res.text();
    console.log('Balance API (proxied):', text);
    // Response format: ACCESS_BALANCE:52.50
    let bal = '0.00';
    if(text && text.includes('ACCESS_BALANCE:')){
      bal = text.split('ACCESS_BALANCE:')[1].trim();
    } else if(text && !isNaN(parseFloat(text))){
      bal = parseFloat(text).toFixed(2);
    } else {
      return; // API error, keep old
    }
    // Save new balance
    user.balance = bal;
    saveUser(user);
    // Update UI
    const setText=(id,val)=>{ const el=document.getElementById(id); if(el) el.innerText=val; };
    setText('bal','₹'+bal); setText('balAmt','₹'+bal);
    document.querySelectorAll('.user-balance,.bal-amt,#bal2,#balanceAmount').forEach(e=>e.innerText='₹'+bal);
    if(document.getElementById('uEmail2')?.innerText) document.getElementById('uEmail2').innerText = user.email;
    if(document.getElementById('bal2')?.innerText) document.getElementById('bal2').innerText = '₹'+bal;
  } catch(e){
    console.log('Balance fetch failed:', e);
  }
}

function logout(){
  localStorage.removeItem('premium_user');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_balance');
  // redirect to login
  window.location.href = 'login.html';
}

function saveUser(obj){ 
  // Keep old balance if new is 0 and old exists
  const old = getCurrentUser();
  if(old && old.balance && (!obj.balance || obj.balance=='0.00')){
    // keep old if provided 0
  }
  localStorage.setItem('premium_user',JSON.stringify(obj)); 
  if(obj.email) localStorage.setItem('user_email',obj.email); 
  if(obj.firstName) localStorage.setItem('user_name',(obj.firstName+' '+(obj.lastName||'')).trim()); 
  if(obj.balance) localStorage.setItem('user_balance',obj.balance); 
}

document.addEventListener('DOMContentLoaded',()=>{ initAuth(false); });
