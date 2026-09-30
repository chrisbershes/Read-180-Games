const SAVE_KEY='read180_arcade_save_v2';
const defaultSave={xp:0,streak:0,wordBuilderScore:0,badges:[]};
function getSave(){try{return {...defaultSave,...JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')}}catch{return {...defaultSave}}}
function saveData(data){localStorage.setItem(SAVE_KEY,JSON.stringify(data)); if(window.syncSave) window.syncSave(data)}
