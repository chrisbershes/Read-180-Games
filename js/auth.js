let supabaseClient=null;
function supabaseReady(){return window.SUPABASE_CONFIG && !window.SUPABASE_CONFIG.url.startsWith('YOUR_') && !window.SUPABASE_CONFIG.anonKey.startsWith('YOUR_')}
async function loadSupabase(){if(!supabaseReady())return null;if(window.supabase)return window.supabase.createClient(window.SUPABASE_CONFIG.url,window.SUPABASE_CONFIG.anonKey);return null}
async function googleLogin(){
  const client=await loadSupabase();
  if(!client){alert('Google login is not configured yet. Add your Supabase URL and anon key to js/config.js. Demo mode is available for testing.');return}
  const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/,'/'); const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:base}});
  if(error) alert(error.message);
}
async function initAuth(){
  const client=await loadSupabase();supabaseClient=client;
  if(client){const {data}=await client.auth.getUser();if(data.user)window.currentUser=data.user;}
  const user=window.currentUser;
  document.querySelectorAll('#userName,#profileName').forEach(e=>{if(user)e.textContent=user.user_metadata?.full_name||user.email||'Student'});
  document.querySelectorAll('#loginBtn,#profileLogin,#googleLogin').forEach(b=>b?.addEventListener('click',googleLogin));
  document.getElementById('demoLogin')?.addEventListener('click',()=>{localStorage.setItem('read180_demo_user','1');location.href='index.html'});
  document.getElementById('logoutBtn')?.addEventListener('click',async()=>{if(client)await client.auth.signOut();localStorage.removeItem('read180_demo_user');location.href='index.html'});
}
window.syncSave=async function(data){if(!supabaseClient||!window.currentUser)return;/* Database sync is enabled after the SQL migration is installed. */};
initAuth();
