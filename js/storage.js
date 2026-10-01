const SAVE_KEY = 'read180_arcade_save_v2';
const defaultSave = { xp: 0, streak: 0, wordBuilderScore: 0, wordMatchScore: 0, storyQuestScore: 0, badges: [] };

function normalizeSave(data) {
  const source = data && typeof data === 'object' ? data : {};
  return {
    xp: Number.isFinite(Number(source.xp)) ? Math.max(0, Math.floor(Number(source.xp))) : 0,
    streak: Number.isFinite(Number(source.streak)) ? Math.max(0, Math.floor(Number(source.streak))) : 0,
    wordBuilderScore: Number.isFinite(Number(source.wordBuilderScore)) ? Math.max(0, Math.floor(Number(source.wordBuilderScore))) : 0,
    wordMatchScore: Number.isFinite(Number(source.wordMatchScore)) ? Math.max(0, Math.floor(Number(source.wordMatchScore))) : 0,
    storyQuestScore: Number.isFinite(Number(source.storyQuestScore)) ? Math.max(0, Math.floor(Number(source.storyQuestScore))) : 0,
    badges: Array.isArray(source.badges) ? source.badges : []
  };
}

function getSave() {
  try { return normalizeSave({ ...defaultSave, ...JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') }); }
  catch { return { ...defaultSave }; }
}

function setLocalSave(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(normalizeSave(data)));
}

function saveData(data) {
  const normalized = normalizeSave(data);
  setLocalSave(normalized);
  if (typeof window.syncSave === 'function') window.syncSave(normalized);
}
