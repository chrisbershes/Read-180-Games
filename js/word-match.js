const pairs=[
 ['PERSPECTIVE','A point of view or way of seeing something.'],
 ['EVIDENCE','Facts or details used to support an idea.'],
 ['INFER','To figure something out using clues and what you know.'],
 ['CONTEXT','The words, events, or situation surrounding an idea.'],
 ['CONCLUDE','To reach a decision after thinking about information.']
];
let current=0, selectedWord=null, selectedMeaning=null, matched=0;
const $=id=>document.getElementById(id);
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
function renderScore(){const s=getSave();$('xp').textContent=s.xp.toLocaleString();$('streak').textContent=s.streak;}
function button(text,type,key){const b=document.createElement('button');b.className='match-item';b.textContent=text;b.dataset.type=type;b.dataset.key=key;b.onclick=()=>choose(b);return b;}
function choose(btn){
 if(btn.classList.contains('matched')) return;
 const type=btn.dataset.type;
 if(type==='word'){document.querySelectorAll('[data-type="word"]').forEach(x=>x.classList.remove('selected'));selectedWord=btn;btn.classList.add('selected');}
 else{document.querySelectorAll('[data-type="meaning"]').forEach(x=>x.classList.remove('selected'));selectedMeaning=btn;btn.classList.add('selected');}
 if(selectedWord&&selectedMeaning) checkMatch();
}
function checkMatch(){
 const ok=selectedWord.dataset.key===selectedMeaning.dataset.key;
 if(ok){selectedWord.classList.add('matched');selectedMeaning.classList.add('matched');matched++;const s=getSave();s.xp+=75;s.wordMatchScore=Math.max(s.wordMatchScore,Math.round(matched/pairs.length*100));s.streak++;saveData(s);renderScore();$('feedback').textContent='✓ Correct! +75 XP';}
 else{const s=getSave();s.streak=0;saveData(s);renderScore();$('feedback').textContent='Not quite. Try another meaning.';}
 selectedWord?.classList.remove('selected');selectedMeaning?.classList.remove('selected');selectedWord=null;selectedMeaning=null;
 if(matched===pairs.length){$('feedback').textContent='🎉 Great job! All words matched.';setTimeout(()=>location.href='../index.html',1200);}
}
function load(){matched=0;selectedWord=null;selectedMeaning=null;$('feedback').textContent='';$('round').textContent=`${current+1} / 5`;const group=shuffle(pairs).slice(0,5);const wordBox=$('wordChoices'),meaningBox=$('meaningChoices');wordBox.innerHTML='';meaningBox.innerHTML='';group.forEach(([w,m],i)=>wordBox.appendChild(button(w,'word','p'+i)));shuffle(group.map(([w,m],i)=>[m,'p'+i])).forEach(([m,key])=>meaningBox.appendChild(button(m,'meaning',key)));}
$('speakMatch').onclick=()=>speechSynthesis?.speak(new SpeechSynthesisUtterance('Match each word with its meaning.'));
async function start(){if(window.read180AuthReady) await window.read180AuthReady;renderScore();load();}
start();
