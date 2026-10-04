const KEYS=['envi-board-v1','gate_es_tracker_local'];
const $=id=>document.getElementById(id);
const btn=$('syncbtn'),dlg=$('acct'),note=$('acctmsg'),who=$('who');
let fb=null,user=null,timer=null,ready=false;
const label=t=>{btn.textContent=t};
const getTs=()=>{try{return +localStorage.getItem('sync-ts')||0}catch(e){return 0}};
const setTs=t=>{try{localStorage.setItem('sync-ts',String(t))}catch(e){}};
function snapshot(){const d={};KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)d[k]=v});return d}
function reloadViews(){['notes','tracker','gate'].forEach(id=>{const f=$(id);if(f.getAttribute('src'))f.contentWindow.location.reload()})}
async function push(){
  if(!user||!ready)return;label('Syncing...');
  try{const ts=getTs()||Date.now();setTs(ts);
    await fb.setDoc(fb.doc(fb.db,'users',user.uid),{data:snapshot(),updatedAt:ts});label('Synced')}
  catch(e){label('Sync error')}
}
async function pull(){
  if(!user)return;
  try{const s=await fb.getDoc(fb.doc(fb.db,'users',user.uid));
    if(s.exists()&&s.data().updatedAt>getTs()){
      const c=s.data();KEYS.forEach(k=>{if(c.data&&c.data[k]!==undefined)localStorage.setItem(k,c.data[k])});
      setTs(c.updatedAt);reloadViews();label('Synced');
    }else{ready=true;await push()}
  }catch(e){label('Sync error')}
  ready=true;
}
addEventListener('storage',e=>{
  if(!ready||!user||!KEYS.includes(e.key))return;
  setTs(Date.now());clearTimeout(timer);timer=setTimeout(push,2500);
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&user&&ready&&navigator.onLine)pull()});
addEventListener('online',()=>{if(user)pull()});

function show(){
  who.textContent=user?('Signed in as '+user.email):'Sign in to sync your progress across devices.';
  $('authform').hidden=!!user;$('signout').hidden=!user;note.textContent='';
  dlg.showModal();
}
btn.addEventListener('click',show);
$('close').addEventListener('click',()=>dlg.close());
function friendly(e){const c=(e&&e.code)||'';
  if(c.includes('invalid-credential')||c.includes('wrong-password')||c.includes('user-not-found'))return 'Email or password is wrong.';
  if(c.includes('email-already'))return 'That email already has an account. Use Sign in.';
  if(c.includes('weak-password'))return 'Password needs at least 6 characters.';
  if(c.includes('invalid-email'))return 'That email address is not valid.';
  if(c.includes('network'))return 'No connection. Try again online.';
  return 'Something went wrong. Try again.'}
async function auth(create){
  if(!fb){note.textContent='Sync is not set up yet. Add your Firebase details in firebase-config.js.';return}
  const em=$('em').value.trim(),pw=$('pw').value;
  try{const f=create?fb.Au.createUserWithEmailAndPassword:fb.Au.signInWithEmailAndPassword;
    await f(fb.auth,em,pw);dlg.close()}catch(e){note.textContent=friendly(e)}
}
$('signin').addEventListener('click',()=>auth(false));
$('create').addEventListener('click',()=>auth(true));
$('signout').addEventListener('click',async()=>{if(fb)await fb.Au.signOut(fb.auth);dlg.close()});

(async function init(){
  try{
    const cfg=(await import('./firebase-config.js')).firebaseConfig;
    if(!cfg.apiKey||cfg.apiKey==='PASTE'){label('Sync: set up');return}
    const b='https://www.gstatic.com/firebasejs/10.12.2/';
    const [A,Au,F]=await Promise.all([import(b+'firebase-app.js'),import(b+'firebase-auth.js'),import(b+'firebase-firestore.js')]);
    const app=A.initializeApp(cfg),a=Au.getAuth(app);
    fb={...F,Au,auth:a,db:F.getFirestore(app)};
    Au.onAuthStateChanged(a,async u=>{user=u;ready=false;
      if(u){label('Syncing...');await pull()}else label('Sync: off')});
  }catch(e){label('Sync offline')}
})();
