const smileMessages=[
  "Bad day or not, you are still painfully cute. I checked the rules.",
  "You are one of the sweetest people I know, which is honestly suspicious behavior.",
  "You do not have to explain everything. I can care about you without a full PowerPoint presentation.",
  "You are always there for me, so consider this me showing up for you in the dumbest, pinkest way possible.",
  "Official diagnosis: too much stress, not enough being reminded that you are adorable.",
  "For the record, I still like you when you are grumpy. Unfortunately, there seems to be no cure.",
  "You and I bully each other recreationally, but I hope you know I would never joke about how much I appreciate you.",
  "If today has been rude to you, give me its address. I just want to talk.",
  "You do not need to be okay today. Just be Marina. That is more than enough.",
  "I hope this gets at least half a smile out of you, pretty girl. I am not greedy.",
  "You make things lighter for me more often than you probably realize.",
  "Even when talking about feelings is hard, I notice that you try. That matters to me.",
  "Current status: sweet, important, cute, and still a menace. Nothing has changed.",
  "Your brain may be having a bad day, but its opinion of you is currently rejected for lack of evidence."
];
const complimentMessages=[
  "Bad day or not, you are still painfully cute. I checked the rules.",
  "You somehow manage to be sweet and a pain in my ass at the same time. Impressive range.",
  "You are very easy to adore. Please do not let this inflate your ego.",
  "Your smile is kind of a problem because I happen to like seeing it way too much.",
  "You make being ridiculously kind look unfairly cute.",
  "Even when you are quiet, grumpy, or not feeling like yourself, I still like having you around.",
  "You are the kind of person people feel safe with. That is rare, Marina.",
  "Unfortunately, being stressed has not made you any less pretty. Tragic, I know."
];
const harderMessages=[
  "Well that won't do. Let's try harder.",
  "Oh, you're stubborn. Fine. Deploying emergency compliments.",
  "Still trying to press it? That's actually kind of cute. Annoying, but cute.",
  "Okay miss impossible-to-cheer-up, I see how this is going to be.",
  "New strategy: aggressive reminder that you mean a lot to me.",
  "You being sad is becoming personally inconvenient because I happen to like your smile.",
  "Fine. Pulling out the serious stuff now. You did this to yourself.",
  "You cannot catch the button, but you did catch another reminder that I care about you.",
  "At this point the button is scared of you. I respect it.",
  "Still here? Good. Then I'm still here too."
];

const response=document.getElementById('response');
const smileBtn=document.getElementById('smileBtn');
let lastSmile=-1;
smileBtn.addEventListener('click',()=>{
  let i; do{i=Math.floor(Math.random()*smileMessages.length)}while(i===lastSmile&&smileMessages.length>1); lastSmile=i;
  response.textContent=smileMessages[i]; response.classList.remove('pop'); void response.offsetWidth; response.classList.add('pop'); heartsBurst(smileBtn); smileBtn.textContent='another one ♡';
});

let lastComp=0;
document.getElementById('complimentBtn').addEventListener('click',e=>{
  let i; do{i=Math.floor(Math.random()*complimentMessages.length)}while(i===lastComp&&complimentMessages.length>1); lastComp=i;
  document.getElementById('complimentBox').textContent=complimentMessages[i]; heartsBurst(e.currentTarget);
});

function openModal(id){const m=document.getElementById(id);if(!m)return;m.classList.add('show');m.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>{const f=m.querySelector('textarea,button');if(f)f.focus()},60)}
function closeModal(m){m.classList.remove('show');m.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.show'))document.body.classList.remove('modal-open')}
document.querySelectorAll('[data-modal]').forEach(b=>b.addEventListener('click',()=>{openModal(b.dataset.modal);heartsBurst(b)}));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.closest('.modal'))));
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('pointerdown',e=>{if(e.target===m)closeModal(m)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=document.querySelector('.modal.show');if(m)closeModal(m)}});

const arena=document.getElementById('arena'),run=document.getElementById('runaway'),harder=document.getElementById('harder'),emergency=document.getElementById('emergency');let tries=0;
function moveRunaway(e){if(e)e.preventDefault();tries++;const ar=arena.getBoundingClientRect(),br=run.getBoundingClientRect();const maxX=Math.max(4,ar.width-br.width-8),maxY=Math.max(4,ar.height-br.height-8);run.style.left=(4+Math.random()*maxX)+'px';run.style.top=(4+Math.random()*maxY)+'px';run.style.transform='none';harder.textContent=harderMessages[(tries-1)%harderMessages.length];heartsBurst(run);if(tries>=6)emergency.classList.add('show')}
['pointerenter','pointerdown','touchstart','focus','click'].forEach(ev=>run.addEventListener(ev,moveRunaway,{passive:false}));

const secretForm=document.getElementById('secretForm'),sendSecret=document.getElementById('sendSecret'),formStatus=document.getElementById('formStatus');
secretForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const data=new FormData(secretForm);
  if(data.get('_honey'))return;
  const msg=(data.get('message')||'').toString().trim();
  if(!msg){showFormStatus('Write whatever is on your mind first ♡','err');return}
  const pref=data.get('response_preference');
  sendSecret.disabled=true;sendSecret.textContent='sending... ♡';
  try{
    const r=await fetch('https://formsubmit.co/ajax/Andrew.hana2000@gmail.com',{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        _subject:'A note from Marina ♡',
        message:msg,
        'What Marina wants':pref,
        _template:'table',
        _captcha:'false'
      })
    });
    const out=await r.json().catch(()=>({}));
    if(!r.ok||out.success===false)throw new Error('send failed');
    const wantsTalk=pref==='I want to talk about it';
    showFormStatus(wantsTalk?'Sent ♡ Andrew will know it is okay to bring it up when the time feels right.':'Sent ♡ Andrew will know you just wanted him to know, so he can leave it there unless you bring it up.','ok');
    secretForm.reset();document.getElementById('talkYes').checked=true;heartsBurst(sendSecret);
  }catch(err){
    showFormStatus('It did not send this time. Your message is still in the box, so you can try again in a second.','err');
  }finally{sendSecret.disabled=false;sendSecret.textContent='send this to Andrew ♡'}
});
function showFormStatus(text,type){formStatus.textContent=text;formStatus.className='form-status show '+type}

function heartsBurst(el){const r=el.getBoundingClientRect();for(let i=0;i<12;i++){const s=document.createElement('div');s.className='burst';s.textContent=i%3?'♡':'✿';s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';s.style.setProperty('--x',(Math.random()*220-110)+'px');s.style.setProperty('--y',(-40-Math.random()*150)+'px');s.style.color=i%2?'#e879a4':'#f2a9c5';s.style.fontSize=(14+Math.random()*14)+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),900)}}

for(let i=0;i<22;i++){const f=document.createElement('div');f.className='float';f.textContent=Math.random()>.5?'♡':'✿';f.style.left=Math.random()*100+'%';f.style.fontSize=(12+Math.random()*18)+'px';f.style.animationDuration=(10+Math.random()*14)+'s';f.style.animationDelay=(-Math.random()*18)+'s';document.getElementById('bg').appendChild(f)}