const words=[
  ['PERSPECTIVE','A point of view or way of seeing something.'],
  ['EVIDENCE','Facts or details used to support an idea.'],
  ['CONCLUDE','To reach a decision after thinking about information.'],
  ['INFER','To figure something out using clues and what you know.'],
  ['CONTEXT','The words, events, or situation surrounding an idea.']
];
let n=0,answer='',timer,seconds=14,combo=1;
const $=x=>document.getElementById(x);

function renderScore(){const s=getSave();$('xp').textContent=s.xp.toLocaleString();$('streak').textContent=s.streak;}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function load(){
  answer=''; seconds=14; const w=words[n]; $('definition').textContent=w[1]; $('scrambled').textContent=shuffle(w[0].split('')).join(' ');
  $('answer').textContent='Choose letters below'; $('answer').classList.remove('ready'); $('letters').innerHTML='';
  shuffle(w[0].split('')).forEach(c=>{let b=document.createElement('button');b.className='letter';b.textContent=c;b.onclick=()=>pick(b);$('letters').appendChild(b)});
  clearInterval(timer); timer=setInterval(()=>{seconds-=.1;$('timer').style.width=(seconds/14*100)+'%';if(seconds<=0){clearInterval(timer);finish(false)}},100);
  const round=document.querySelector('.round'); if(round) round.textContent=`${n+1} / ${words.length}`;
}
function pick(b){if(b.classList.contains('used'))return;b.classList.add('used');answer+=b.textContent;$('answer').textContent=answer;$('answer').classList.add('ready');if(answer.length===words[n][0].length){clearInterval(timer);setTimeout(()=>finish(answer===words[n][0]),250)}}
$('clear').onclick=()=>{answer='';document.querySelectorAll('.letter').forEach(x=>x.classList.remove('used'));$('answer').textContent='Choose letters below';$('answer').classList.remove('ready')};
function finish(correct){
  if(correct){let s=getSave();s.xp+=100+combo*25;s.streak++;s.wordBuilderScore=Math.max(s.wordBuilderScore,Math.round((n+1)/words.length*100));saveData(s);renderScore();$('feedback').textContent='✓ Correct! +'+(100+combo*25)+' XP';combo++;n++;if(n>=words.length){setTimeout(()=>location.href='../index.html',900);return}else setTimeout(()=>{$('feedback').textContent='';load()},650)}
  else{let s=getSave();s.streak=0;saveData(s);renderScore();$('feedback').textContent='Try again — the word was '+words[n][0]+'.';n++;if(n>=words.length)setTimeout(()=>location.href='../index.html',1000);else setTimeout(()=>{$('feedback').textContent='';load()},900)}
}
async function startGame(){
  if(window.read180AuthReady) await window.read180AuthReady;
  renderScore(); load();
}
startGame();
