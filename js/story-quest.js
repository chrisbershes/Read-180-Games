const story={title:'The Hidden Map',text:'Maya found an old map tucked inside a library book. A note beside it said that the map showed a trail to a garden behind the community center. Instead of rushing outside, Maya compared the map with the streets she knew. She noticed a small star beside a bridge, then packed a notebook so she could record what she discovered. At the bridge, she found a trail marker that matched the symbol on the map.',questions:[
 {q:'Why did Maya compare the map with the streets she knew?',a:['She wanted to understand where the trail led.','She wanted to draw a new map.','She was looking for the library.'],c:0},
 {q:'What did Maya pack before exploring?',a:['A flashlight','A notebook','A camera'],c:1},
 {q:'What confirmed that Maya was following the right clue?',a:['A garden gate','A library card','A trail marker matching the map symbol'],c:2}
]};
let q=0;
const $=id=>document.getElementById(id);
function renderScore(){const s=getSave();$('xp').textContent=s.xp.toLocaleString();$('streak').textContent=s.streak;}
function render(){const item=story.questions[q];$('storyTitle').textContent=story.title;$('storyText').textContent=story.text;$('question').textContent=item.q;$('round').textContent=`Question ${q+1} / ${story.questions.length}`;$('answers').innerHTML='';$('feedback').textContent='';item.a.forEach((answer,i)=>{const b=document.createElement('button');b.className='story-answer';b.textContent=answer;b.onclick=()=>choose(i);$('answers').appendChild(b);});}
function choose(i){const item=story.questions[q],s=getSave();document.querySelectorAll('.story-answer').forEach(b=>b.disabled=true);if(i===item.c){s.xp+=125;s.streak++;s.storyQuestScore=Math.max(s.storyQuestScore,Math.round((q+1)/story.questions.length*100));saveData(s);renderScore();$('feedback').textContent='✓ Correct! +125 XP';}else{s.streak=0;saveData(s);renderScore();$('feedback').textContent='The best answer is: '+item.a[item.c];}q++;if(q<story.questions.length)setTimeout(render,900);else setTimeout(()=>{ $('feedback').textContent='🎉 Quest complete! You finished the story.';setTimeout(()=>location.href='../index.html',1000);},900);}
$('speakStory').onclick=()=>{if('speechSynthesis' in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(story.text));}};
async function start(){if(window.read180AuthReady) await window.read180AuthReady;renderScore();render();}
start();
