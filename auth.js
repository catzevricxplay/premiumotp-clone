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
  // Try to fetch real balance from API in background
  setTimeout(()=>{ updateBalanceFromAPI(); }, 500);
  return {displayName,displayEmail,balance,initial,raw:user};
}

async function updateBalanceFromAPI(){
  try {
    const user = getCurrentUser();
    if(!user) return;
    const apiKey = user.api_key || user.apiKey || APP_CONFIG.MASTER_KEY || '';
    if(!apiKey) {
      console.log('No API key for balance, using local balance');
      return;
    }
    // Real API call
    const url = `${APP_CONFIG.REAL_ENDPOINT}?api_key=${apiKey}&action=getBalance`;
    const res = await fetch(url);
    const text = await res.text();
    console.log('Balance API:', text);
    // Response format: ACCESS_BALANCE:52.50
    let bal = '0.00';
    if(text.includes('ACCESS_BALANCE:')){
      bal = text.split('ACCESS_BALANCE:')[1].trim();
    } else if(!isNaN(parseFloat(text))){
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
    document.getElementById('uEmail2')?.innerText && (document.getElementById('uEmail2').innerText = user.email);
    document.getElementById('bal2')?.innerText && (document.getElementById('bal2').innerText = '₹'+bal);
  } catch(e){
    console.log('Balance fetch failed:', e);
  }
}

function logout(){ localStorage.removeItem('premium_user'); localStorage.removeItem('user_email'); localStorage.removeItem('user_name'); localStorage.removeItem('user_balance'); window.location.href='login.html'; }

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
