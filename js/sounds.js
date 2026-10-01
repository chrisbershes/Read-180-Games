(function(){
  let audioCtx;
  function settings(){return window.read180Settings?.get?.()||{sfxVolume:.65,speechVolume:.8}}
  function ctx(){return audioCtx || (audioCtx=new (window.AudioContext||window.webkitAudioContext)())}
  window.playUISound=function(type='click'){
    try{
      const vol=settings().sfxVolume;if(vol<=0)return;
      const c=ctx();if(c.state==='suspended')c.resume();
      const o=c.createOscillator(),g=c.createGain(),now=c.currentTime;
      const freq=type==='success'?660:type==='error'?180:type==='match'?540:type==='timer'?300:420;
      const duration=type==='success'?.16:type==='error'?.18:.11;
      o.type=type==='error'?'square':'sine';o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(freq*(type==='error'?.8:1.18),now+duration);
      g.gain.setValueAtTime(.07*vol,now);g.gain.exponentialRampToValueAtTime(.001,now+duration);
      o.connect(g);g.connect(c.destination);o.start(now);o.stop(now+duration+.01);
    }catch(e){}
  };
  window.speakText=function(text){
    if(!('speechSynthesis'in window)){alert('Your browser does not support text-to-speech.');return}
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.9;u.pitch=1;u.volume=settings().speechVolume;speechSynthesis.speak(u);
  };
  document.addEventListener('click',e=>{const b=e.target.closest('button,.activity-card,.match-item,.story-answer,.letter');if(b&&!b.classList.contains('speaker-btn'))playUISound('click')});
})();
