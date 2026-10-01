const words=[['PERSPECTIVE','A point of view or way of seeing something.'],['EVIDENCE','Facts or details used to support an idea.'],['CONCLUDE','To reach a decision after thinking about information.'],['INFER','To figure something out using clues and what you know.'],['CONTEXT','The words, events, or situation surrounding an idea.']];
let n=0,answer='',timer,seconds=14,combo=1,lockedIndex=-1;
const $=x=>document.getElementById(x); const shuffle=a=>[...a].sort(()=>Math.random()-.5);
function renderScore(){const s=getSave();$('xp').textContent=s.xp.toLocaleString();$('streak').textContent=s.streak}
function load(){
 answer='';seconds=14;const w=words[n];$('definition').textContent=w[1];$('scrambled').textContent=shuffle(w[0].split('')).join(' ');$('answer').textContent='Choose letters below';$('answer').classList.remove('ready');$('letters').innerHTML='';
 const letters=w[0].split('');lockedIndex=Math.floor(Math.random()*letters.length);
 shuffle(letters).forEach((c,i)=>{let b=document.createElement('button');b.className='letter';b.textContent=c;b.dataset.correctIndex=i;if(i===lockedIndex)b.classList.add('locked-letter');b.onclick=()=>pick(b);$('letters').appendChild(b)});
 clearInterval(timer);timer=setInterval(()=>{seconds-=.1;$('timer').style.width=(seconds/14*100)+'%';if(seconds<=0){clearInterval(timer);finish(false)}},100);
 const round=document.querySelector('.round');if(round)round.textContent=`${n+1} / ${words.length}`;$('unlockLetter').disabled=false;$('unlockLetter').textContent='Unlock Letter';
}
function pick(b){if(b.classList.contains('used')||b.classList.contains('locked-letter'))return;b.classList.add('used');answer+=b.textContent;$('answer').textContent=answer;$('answer').classList.add('ready');if(answer.length===words[n][0].length){clearInterval(timer);setTimeout(()=>finish(answer===words[n][0]),250)}}
$('clear').onclick=()=>{answer='';document.querySelectorAll('.letter').forEach(x=>x.classList.remove('used'));$('answer').textContent='Choose letters below';$('answer').classList.remove('ready')};
$('unlockLetter').onclick=()=>{const b=document.querySelector('.letter.locked-letter');if(!b)return;b.classList.remove('locked-letter');$('unlockLetter').disabled=true;$('unlockLetter').textContent='Letter Unlocked';playUISound('match')};
function finish(correct){if(correct){let s=getSave();s.xp+=100+combo*25;s.streak++;s.wordBuilderScore=Math.max(s.wordBuilderScore,Math.round((n+1)/words.length*100));saveData(s);renderScore();$('feedback').textContent='✓ Correct! +'+(100+combo*25)+' XP';playUISound('success');combo++;n++;if(n>=words.length){setTimeout(()=>location.href='../index.html',900);return}else setTimeout(()=>{$('feedback').textContent='';load()},650)}else{let s=getSave();s.streak=0;saveData(s);renderScore();$('feedback').textContent='Try again — the word was '+words[n][0]+'.';playUISound('error');n++;if(n>=words.length)setTimeout(()=>location.href='../index.html',1000);else setTimeout(()=>{$('feedback').textContent='';load()},900)}}
async function startGame(){if(window.read180AuthReady)await window.read180AuthReady;renderScore();load()}startGame();
