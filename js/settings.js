(function(){
  const KEY='read180_settings_v1';
  const defaults={darkMode:false,largeScreen:false,speechVolume:0.8,sfxVolume:0.65};
  function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}}
  let settings=load();
  function save(){localStorage.setItem(KEY,JSON.stringify(settings));apply();}
  function apply(){
    document.documentElement.classList.toggle('dark-mode',!!settings.darkMode);
    document.documentElement.classList.toggle('large-screen',!!settings.largeScreen);
  }
  window.read180Settings={get:()=>({...settings}),set:(k,v)=>{settings[k]=v;save()},reset:()=>{settings={...defaults};save()}};
  apply();
  function ensure(){
    if(document.getElementById('settingsModal')) return document.getElementById('settingsModal');
    const m=document.createElement('div');m.id='settingsModal';m.className='settings-backdrop';m.hidden=true;
    m.innerHTML=`<section class="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
      <button class="settings-close" id="settingsClose" type="button" aria-label="Close settings">×</button>
      <p class="crumb">SETTINGS</p><h2 id="settingsTitle">Game Settings</h2>
      <label class="setting-row"><span><b>Dark Mode</b><small>Use a darker interface.</small></span><input id="settingDark" type="checkbox"></label>
      <label class="setting-row"><span><b>Larger Screen</b><small>Increase the size of the game interface.</small></span><input id="settingLarge" type="checkbox"></label>
      <div class="setting-row slider-row"><span><b>Speech Volume</b><small>Controls text-to-speech volume.</small></span><input id="settingSpeech" type="range" min="0" max="1" step="0.01"><output id="speechValue"></output></div>
      <div class="setting-row slider-row"><span><b>Sound Effects</b><small>Controls button and game sounds.</small></span><input id="settingSfx" type="range" min="0" max="1" step="0.01"><output id="sfxValue"></output></div>
      <button id="settingFullscreen" class="settings-action" type="button">Enter Full Screen</button>
      <p class="settings-note">Volume and display preferences are saved on this device.</p>
    </section>`;
    document.body.appendChild(m);
    const close=()=>{m.hidden=true;document.body.classList.remove('settings-open')};
    document.getElementById('settingsClose').onclick=close;
    m.addEventListener('click',e=>{if(e.target===m)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!m.hidden)close()});
    const dark=document.getElementById('settingDark'),large=document.getElementById('settingLarge'),speech=document.getElementById('settingSpeech'),sfx=document.getElementById('settingSfx');
    dark.onchange=()=>{settings.darkMode=dark.checked;save()}; large.onchange=()=>{settings.largeScreen=large.checked;save()};
    speech.oninput=()=>{settings.speechVolume=Number(speech.value);save();updateOutputs()}; sfx.oninput=()=>{settings.sfxVolume=Number(sfx.value);save();updateOutputs()};
    document.getElementById('settingFullscreen').onclick=async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen()}else{await document.exitFullscreen()}}catch(e){}}
    function updateOutputs(){document.getElementById('speechValue').textContent=Math.round(settings.speechVolume*100)+'%';document.getElementById('sfxValue').textContent=Math.round(settings.sfxVolume*100)+'%'}
    m._sync=()=>{dark.checked=!!settings.darkMode;large.checked=!!settings.largeScreen;speech.value=settings.speechVolume;sfx.value=settings.sfxVolume;document.getElementById('settingFullscreen').textContent=document.fullscreenElement?'Exit Full Screen':'Enter Full Screen';updateOutputs()};
    document.addEventListener('fullscreenchange',()=>m._sync());
    return m;
  }
  function open(){const m=ensure();m._sync();m.hidden=false;document.body.classList.add('settings-open');document.getElementById('settingDark').focus()}
  document.addEventListener('DOMContentLoaded',()=>{
    let bar=document.querySelector('.account');
    if(bar&&!document.getElementById('settingsButton')){const b=document.createElement('button');b.id='settingsButton';b.className='round-btn settings-button';b.type='button';b.textContent='⚙';b.setAttribute('aria-label','Open settings');bar.insertBefore(b,bar.querySelector('.help-button')||null);b.onclick=open}
  });
})();
