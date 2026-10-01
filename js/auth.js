let supabaseClient = null;
let currentUser = null;

function supabaseReady() {
  const c = window.SUPABASE_CONFIG;
  return !!(
    c &&
    typeof window.supabase !== 'undefined' &&
    c.url &&
    c.publishableKey &&
    !c.publishableKey.includes('PASTE_YOUR_SUPABASE')
  );
}

function getSiteUrl() {
  const configured = window.SUPABASE_CONFIG?.siteUrl;
  if (configured) return configured;
  return window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
}

async function loadSupabase() {
  if (!supabaseReady()) return null;
  if (supabaseClient) return supabaseClient;
  supabaseClient = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.publishableKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );
  return supabaseClient;
}

async function googleLogin() {
  const client = await loadSupabase();
  if (!client) {
    alert('Google login is not configured yet. Add your Supabase publishable key to js/config.js.');
    return;
  }
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: getSiteUrl() }
  });
  if (error) alert(error.message);
}

async function loadCloudSave(user) {
  if (!supabaseClient || !user) return;
  const { data, error } = await supabaseClient
    .from('player_progress')
    .select('xp, streak, word_builder_score, word_match_score, story_quest_score, badges')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Cloud save load failed:', error);
    return;
  }

  if (data) {
    const local = getSave();
    const cloud = {
      xp: data.xp,
      streak: data.streak,
      wordBuilderScore: data.word_builder_score,
      wordMatchScore: data.word_match_score,
      storyQuestScore: data.story_quest_score,
      badges: Array.isArray(data.badges) ? data.badges : []
    };
    // The cloud record is authoritative after sign-in. This prevents an old local
    // browser save from silently overwriting a player's account save.
    setLocalSave(cloud);
  } else {
    await syncSave(getSave());
  }
}

async function syncSave(data) {
  if (!supabaseClient || !currentUser) return;
  const normalized = normalizeSave(data);
  const { error } = await supabaseClient.from('player_progress').upsert({
    user_id: currentUser.id,
    xp: normalized.xp,
    streak: normalized.streak,
    word_builder_score: normalized.wordBuilderScore,
    word_match_score: normalized.wordMatchScore,
    story_quest_score: normalized.storyQuestScore,
    badges: normalized.badges,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  if (error) console.error('Cloud save sync failed:', error);
}

window.syncSave = syncSave;

async function initAuth() {
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
  document.querySelectorAll('#loginBtn, #profileLogin, #googleLogin').forEach(button => {
    button?.addEventListener('click', googleLogin);
  });
  document.getElementById('demoLogin')?.addEventListener('click', () => {
    localStorage.setItem('read180_demo_user', '1');
    window.location.href = getSiteUrl();
  });
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    if (client) await client.auth.signOut();
    localStorage.removeItem('read180_demo_user');
    window.location.href = getSiteUrl();
  });

  window.dispatchEvent(new CustomEvent('read180-auth-ready', { detail: { user: currentUser } }));
}

function updateAccountUI() {
  const user = currentUser;
  const name = user?.user_metadata?.full_name || user?.email || 'Guest';
  document.querySelectorAll('#userName, #profileName').forEach(el => { el.textContent = name; });
  document.querySelectorAll('#loginBtn, #profileLogin').forEach(el => el.classList.toggle('hidden', !!user));
  document.querySelectorAll('#logoutBtn').forEach(el => el.classList.toggle('hidden', !user));
  const status = document.getElementById('saveStatus');
  if (status) status.textContent = user ? 'Cloud save active' : 'Local demo save';
}

window.read180AuthReady = initAuth();
