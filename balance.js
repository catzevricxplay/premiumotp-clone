// BALANCE SYSTEM - Per User Dynamic Balance
// Jo user login karega uska balance API se aayega

async function refreshBalance(){
  await updateBalanceFromAPI();
  const user = getCurrentUser();
  if(user){
    alert('Your Balance: ₹' + (user.balance || '0.00'));
  }
}

// Auto refresh balance every 30 seconds on dashboard
setInterval(()=>{ 
  if(window.location.href.includes('dashboard')){
    updateBalanceFromAPI(); 
  }
}, 30000);
