let supabaseClient = null;
let currentUser = null;

function supabaseReady() {
  const c = window.SUPABASE_CONFIG || {};
  const key = c.publishableKey || c.anonKey || '';
  return !!(c.url && key && typeof window.supabase !== 'undefined' && !/PASTE_YOUR|YOUR_KEY/i.test(key));
}

function getSupabaseKey() {
  return window.SUPABASE_CONFIG?.publishableKey || window.SUPABASE_CONFIG?.anonKey || '';
}

function getSiteUrl() {
  return window.SUPABASE_CONFIG?.siteUrl || 'https://chrisbershes.github.io/Read-180-Games/';
}

function getDisplayName(user) {
  const m = user?.user_metadata || {};
  const full = String(m.full_name || '').trim();
  if (full) return full;
  const first = String(m.first_name || m.given_name || '').trim();
  const last = String(m.last_name || m.family_name || '').trim();
  if (first || last) return `${first} ${last}`.trim();
  return user?.email || 'Guest';
}

function getInitials(user) {
  const name = getDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase();
}

async function loadSupabase() {
  if (!supabaseReady()) return null;
  if (supabaseClient) return supabaseClient;
  supabaseClient = window.supabase.createClient(window.SUPABASE_CONFIG.url, getSupabaseKey(), {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return supabaseClient;
}

async function googleLogin() {
  const client = await loadSupabase();
  if (!client) {
    alert('Google login is not configured. Check js/config.js and make sure your Supabase publishable/anon key is filled in.');
    return;
  }
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: getSiteUrl(), queryParams: { access_type: 'offline', prompt: 'select_account' } }
  });
  if (error) alert(`Google sign-in failed: ${error.message}`);
}

async function logout() {
  const client = await loadSupabase();
  if (client) {
    const { error } = await client.auth.signOut();
    if (error) console.error('Sign out failed:', error);
  }
  currentUser = null;
  window.currentUser = null;
  localStorage.removeItem('read180_demo_user');
  updateAccountUI();
}

async function loadCloudSave(user) {
  if (!supabaseClient || !user) return;
  const { data, error } = await supabaseClient.from('player_progress')
    .select('xp, streak, word_builder_score, word_match_score, story_quest_score, badges')
    .eq('user_id', user.id).maybeSingle();
  if (error) { console.error('Cloud save load failed:', error); return; }
  if (data) {
    setLocalSave({ xp:data.xp, streak:data.streak, wordBuilderScore:data.word_builder_score,
      wordMatchScore:data.word_match_score, storyQuestScore:data.story_quest_score,
      badges:Array.isArray(data.badges) ? data.badges : [] });
  } else await syncSave(getSave());
}

async function syncSave(data) {
  if (!supabaseClient || !currentUser) return;
  const normalized = normalizeSave(data);
  const { error } = await supabaseClient.from('player_progress').upsert({
    user_id: currentUser.id, xp: normalized.xp, streak: normalized.streak,
    word_builder_score: normalized.wordBuilderScore, word_match_score: normalized.wordMatchScore,
    story_quest_score: normalized.storyQuestScore, badges: normalized.badges,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
  if (error) console.error('Cloud save sync failed:', error);
}
window.syncSave = syncSave;

function closeAccountMenu() {
  document.querySelectorAll('.account-menu').forEach(menu => menu.classList.remove('open'));
  document.querySelectorAll('.account-toggle').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
}

function updateAccountUI() {
  const user = currentUser;
  const name = getDisplayName(user);
  const signedIn = !!user;
  document.querySelectorAll('#userName, #profileName, #accountMenuName, .account-menu-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.account-initials').forEach(el => el.textContent = signedIn ? getInitials(user) : 'G');
  document.querySelectorAll('#loginBtn').forEach(el => el.classList.toggle('hidden', signedIn));
  document.querySelectorAll('#logoutBtn').forEach(el => el.classList.toggle('hidden', !signedIn));
  document.querySelectorAll('#profileLogin').forEach(el => {
    el.textContent = signedIn ? 'Sign out' : 'G  Sign in with Google';
    el.classList.toggle('signed-in', signedIn);
  });
  document.querySelectorAll('.account-toggle').forEach(el => {
    el.classList.toggle('signed-in', signedIn);
    el.setAttribute('aria-expanded', 'false');
  });
  document.querySelectorAll('.account-menu').forEach(menu => menu.classList.remove('open'));
  const emailEls = document.querySelectorAll('#accountEmail');
  emailEls.forEach(el => el.textContent = user?.email || 'Not signed in');
  const status = document.getElementById('saveStatus');
  if (status) status.textContent = signedIn ? 'Cloud save active' : 'Local demo save';
}

async function initAuth() {
  // Supabase returns OAuth errors in the URL when the provider/redirect setup is wrong.
  // Surface the actual provider error instead of leaving the user on a broken-looking page.
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const oauthError = params.get('error_description') || params.get('error') || hash.get('error_description') || hash.get('error');
  if (oauthError) {
    alert(`Google sign-in failed: ${oauthError.replace(/\+/g, ' ')}`);
    window.history.replaceState({}, document.title, getSiteUrl());
  }
  const client = await loadSupabase();
  if (client) {
    const { data: { user } } = await client.auth.getUser();
    currentUser = user || null;
    window.currentUser = currentUser;
    if (currentUser) await loadCloudSave(currentUser);
    client.auth.onAuthStateChange(async (_event, session) => {
      currentUser = session?.user || null;
      window.currentUser = currentUser;
      if (currentUser) await loadCloudSave(currentUser);
      updateAccountUI();
      window.dispatchEvent(new CustomEvent('read180-auth-ready', { detail: { user: currentUser } }));
    });
  }

  updateAccountUI();
  document.querySelectorAll('#loginBtn, #googleLogin').forEach(btn => btn.addEventListener('click', googleLogin));
  document.querySelectorAll('#profileLogin').forEach(btn => btn.addEventListener('click', () => currentUser ? logout() : googleLogin()));
  document.querySelectorAll('#logoutBtn, #menuLogoutBtn').forEach(btn => btn.addEventListener('click', logout));
  document.querySelectorAll('.account-toggle').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const menu = btn.parentElement.querySelector('.account-menu');
    if (!menu) return;
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  }));
  document.addEventListener('click', e => {
    if (!e.target.closest('.account')) closeAccountMenu();
  });
  document.getElementById('demoLogin')?.addEventListener('click', () => {
    localStorage.setItem('read180_demo_user', '1');
    window.location.href = getSiteUrl();
  });
  window.dispatchEvent(new CustomEvent('read180-auth-ready', { detail: { user: currentUser } }));
}

window.read180AuthReady = initAuth();
