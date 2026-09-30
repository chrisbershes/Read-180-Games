// Accessibility-friendly voice + lightweight UI sounds using browser APIs.
(function(){
  let audioCtx;
  function ctx(){ return audioCtx || (audioCtx=new (window.AudioContext||window.webkitAudioContext)()); }
  window.playUISound=function(type="click"){
    try{ const c=ctx(); if(c.state==='suspended') c.resume(); const o=c.createOscillator(), g=c.createGain();
      const now=c.currentTime; const freq=type==='success'?660:type==='error'?180:420;
      o.type='sine'; o.frequency.setValueAtTime(freq,now); o.frequency.exponentialRampToValueAtTime(freq*1.15,now+.08);
      g.gain.setValueAtTime(.045,now); g.gain.exponentialRampToValueAtTime(.001,now+.12); o.connect(g); g.connect(c.destination); o.start(now); o.stop(now+.13);
    }catch(e){}
  };
  window.speakText=function(text){
    if(!('speechSynthesis' in window)){ alert('Your browser does not support text-to-speech.'); return; }
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.rate=.9; u.pitch=1; u.volume=1; speechSynthesis.speak(u); playUISound('click');
  };
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,.activity-card'); if(b && !b.classList.contains('speaker-btn')) playUISound('click');
  });
  const a=document.getElementById('speakActivity');
  if(a) a.addEventListener('click',()=>speakText('Word Builder. Build the word that matches the definition. Complete activities to earn experience points and save your progress.'));
  const d=document.getElementById('speakDefinition');
  if(d) d.addEventListener('click',()=>{const x=document.getElementById('definition'); if(x) speakText(x.textContent);});
})();
