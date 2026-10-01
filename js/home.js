function renderHome() {
  const s = getSave();
  const xp = document.getElementById('xp');
  const progress = document.getElementById('progress');
  const progressText = document.getElementById('progressText');
  if (xp) xp.textContent = s.xp.toLocaleString();
  if (progress) progress.style.width = Math.min(100, Math.round(s.xp / 50)) + '%';
  if (progressText) progressText.textContent = s.xp ? `Level ${Math.floor(s.xp / 1000) + 1} • ${s.streak} day streak` : 'Start a game to begin.';
}

window.addEventListener('read180-auth-ready', renderHome);
renderHome();
