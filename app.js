'use strict';
const PAIRS=[['Hémorroïdes','Mycose'],
['Diarrhée','Constipation'],
['OnlyFans','Jacquie et Michel'],
['Croûte','Bouton'],
['Cyril Hanouna','Pascal Praud'],
['Moule','Huître'],
['Secte','Religion'],
['Moustache','Poils pubiens'],
['Tinder','Leboncoin'],['Vodka','Rhum'],
['Spritz','Mojito'],
['Gueule de bois','Nuit blanche'],
['After','Before'],
['Cigarette','Puff'],
['Kebab','Tacos'],
['67','69'],
['Beyoncé','Rihanna'],
['Aya Nakamura','Théodora'],
['Ex','Plan cul'],
['Rat','Pigeon'],
['Cornichon','Olive'],
['Paff goût puff','Puff goût paff'],
['Tasty Crousty','KFC'],
['Euphoria','Sex Education'],
['Pipi','Caca'],
['Éden','Violette'],
['RN','LFI'],
['TikTok','Snapchat'],
['Plouff','Boston'],
['Perrache','Part-Dieu'],
['Banane','Bite'],
['Tatouage','Piercing'],
['Norman','Greg Guillotin'],
['Cancer','Sida'],
['Levrette','Anal'],
['Jésus','Satan'],
['Labubu','Lafufu'],
['Kylian Mbappé','Zizou']];
const FILE='./assets/stickers/';
const MAX_ROUNDS=3; // 3 manches de discussion/vote au maximum
const app=document.getElementById('app');
let setup={count:5,under:1,white:0,names:[]},game=null,selected=null,reveal=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rand(n){if(globalThis.crypto?.getRandomValues){let u=new Uint32Array(1),v=4294967296-(4294967296%n);do{crypto.getRandomValues(u)}while(u[0]>=v);return u[0]%n}return Math.floor(Math.random()*n)}
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=rand(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function btn(text,id,kind='pink'){return `<button type="button" class="btn ${kind}" data-action="${id}">${text}</button>`}
function sticker(name,cls=''){return `<img class="sticker ${cls}" alt="" draggable="false" aria-hidden="true" src="${FILE}${name}.png">`}
function brand(){return `<div class="brand" aria-label="Edencover"><div class="brand-paper"><img src="./assets/edencover-logo-yellow.png" alt="EDENCOVER"></div><span class="brand-scribble" aria-hidden="true"></span></div>`}
function stars(){return `<span class="star star1" aria-hidden="true">✳</span><span class="star star2" aria-hidden="true">✳</span><span class="star star3" aria-hidden="true">✳</span>`}
function collage(kind){return `<div class="collage" aria-hidden="true"><div class="scrap scrap-pink"></div><div class="scrap scrap-coral"></div><div class="scrap scrap-green"></div><div class="scrap scrap-yellow"></div><div class="dot-pattern"></div><div class="grain"></div></div><div class="photo-wrap ${kind==='home'?'photo-home':'photo-flow'}" aria-hidden="true"><img src="./assets/edencover-bg.png" alt=""></div>`}
function decor(which){const scene={
 home:[['disco','d-disco'],['joint','d-joint'],['party','d-party'],['mic','d-mic'],['martini','d-martini'],['lip','d-lip'],['sunglasses','d-glasses'],['lighter','d-lighter']],
 configure:[['disco','d-disco'],['joint','d-joint'],['party','d-party'],['sunglasses','d-glasses'],['martini','d-martini'],['lighter','d-lighter']],
 names:[['disco','d-disco'],['joint','d-joint'],['sunglasses','d-glasses'],['lighter','d-lighter']],
 deal:[['mic','d-mic'],['party','d-party'],['joint','d-joint'],['martini','d-martini']],
 vote:[['sunglasses','d-glasses'],['cookie','d-cookie'],['lighter','d-lighter']],
 discussion:[['mic','d-mic'],['joint','d-joint'],['chicken','d-chicken']],
 result:[['disco','d-disco'],['martini','d-martini'],['sunglasses','d-glasses']],
 end:[['gift','d-gift'],['disco','d-disco'],['party','d-party'],['martini','d-martini']]
 };return `<div class="decor" aria-hidden="true">${(scene[which]||scene.discussion).map(([n,c])=>sticker(n,c)).join('')}${stars()}</div>`}
function stage(kind,inner){return `<div class="app-stage stage-${kind}">${collage(kind)}${decor(kind)}${brand()}${inner}</div>`}
function draw(kind,content){app.innerHTML=stage(kind,content);app.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>actions[el.dataset.action]?.()));window.scrollTo(0,0)}
function home(){draw('home',`<section class="home-body"><div class="slogan"><div><span>UN MOT.</span></div><div><span>DES AMIS.</span></div><div><span>DES DOUTES.</span></div></div><div class="home-actions">${btn('Commencer une partie <span aria-hidden="true">→</span>','configure')}${btn('Comment jouer ?','rules','cream')}</div></section>`)}
function step(num,desc){return `<div class="step-label">ÉTAPE ${num} · ${desc}</div>`}
function screenHeading(t){return `<h1 class="flow-title">${t}</h1>`}
function rules(){draw('configure',`<section class="flow-content rules-content">${step('00','LES RÈGLES')}${screenHeading('COMMENT<br>JOUER ?')}<div class="panel rules-panel"><ol><li>Les <b>Civils</b> ont tous le même mot.</li><li>Les <b>Edencover</b> ont un mot similaire.</li><li><b>Mister White</b> n'a aucun mot et doit tenter de deviner celui des Civils s'il est découvert.</li><li>Chacun donne un indice sans prononcer son mot.</li><li>Discutez et éliminez un suspect par vote.</li></ol><p class="micro">Vous jouez jusqu'à 3 manches (indice + vote), tant qu'il reste des Edencover ou Mister White. Les Civils gagnent en éliminant tous les infiltrés. Si un infiltré est encore en jeu à l'issue de la 3e manche, les infiltrés gagnent. Mister White doit tenter de deviner le mot des Civils lorsqu'il est éliminé : s'il trouve, il gagne immédiatement.</p></div><div class="form-actions">${btn('C’est parti →','configure')}${btn('Retour','home','text-btn')}</div></section>`)}
function stepper(k,n,min,max){return `<div class="stepper"><button type="button" class="stepbtn" data-step="${k}:-1" ${n<=min?'disabled':''} aria-label="Diminuer ${k}">−</button><strong>${n}</strong><button type="button" class="stepbtn" data-step="${k}:1" ${n>=max?'disabled':''} aria-label="Augmenter ${k}">+</button></div>`}
function configure(){setup.under=Math.max(1,Math.min(setup.under,setup.count-2));setup.white=Math.max(0,Math.min(setup.white,setup.count-setup.under-2));draw('configure',`<section class="flow-content setup-content">${step('01','LA TABLE DE JEU')}${screenHeading('CHOISISSEZ<br>LES RÔLES.')}<p class="flow-desc">Définis le nombre de joueurs, d’Edencover<br>et de Mr. White. Il faut au moins deux Civils.</p><div class="panel setup-panel"><div class="counter"><span>Joueurs</span>${stepper('count',setup.count,3,20)}</div><div class="counter"><span>Edencover</span>${stepper('under',setup.under,1,setup.count-setup.white-2)}</div><div class="counter"><span>Mr. White</span>${stepper('white',setup.white,0,setup.count-setup.under-2)}</div><div class="roles-summary">${setup.count-setup.under-setup.white} Civils · ${setup.under} Edencover · ${setup.white} Mr. White</div></div><div class="form-actions">${btn('Commencer une partie →','names')}${btn('Accueil','home','text-btn')}</div></section>`);app.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const[k,d]=b.dataset.step.split(':');setup[k]+=Number(d);configure()})}
function names(){draw('names',`<section class="flow-content names-content">${step('02','LES JOUEURS')}${screenHeading('QUI EST DE<br>LA PARTIE ?')}<p class="flow-desc">Personnalise les prénoms si tu veux.<br>Sinon, les joueurs garderont leurs numéros.</p><div class="panel names-panel">${Array.from({length:setup.count},(_,i)=>`<div class="name-row"><label for="n${i}">JOUEUR ${i+1}</label><input id="n${i}" autocomplete="off" maxlength="24" value="${esc(setup.names[i]||'')}" placeholder="Joueur ${i+1}"></div>`).join('')}</div><div class="form-actions">${btn('Distribuer les rôles →','start')}${btn('Retour','saveNames','text-btn')}</div></section>`)}
function readNames(){setup.names=Array.from({length:setup.count},(_,i)=>document.getElementById('n'+i)?.value.trim().slice(0,24)||'')}
function start(){readNames();let used=[];try{used=JSON.parse(localStorage.getItem('edencover-words-used')||'[]');if(!Array.isArray(used))used=[]}catch{};let pool=PAIRS.map((_,i)=>i).filter(i=>!used.includes(i));if(!pool.length){used=[];pool=PAIRS.map((_,i)=>i)}const index=pool[rand(pool.length)];used.push(index);try{localStorage.setItem('edencover-words-used',JSON.stringify(used))}catch{};let pair=[...PAIRS[index]];if(rand(2))pair.reverse();const roles=shuffle([...Array(setup.count-setup.under-setup.white).fill('civil'),...Array(setup.under).fill('under'),...Array(setup.white).fill('white')]);game={players:roles.map((role,i)=>({id:i,name:setup.names[i]||`Joueur ${i+1}`,role,alive:true})),civil:pair[0],under:pair[1],dealIndex:0,round:1,last:null,winner:null};reveal=false;deal()}
function deal(){let p=game.players[game.dealIndex];let word=p.role==='white'?'MISTER WHITE':p.role==='civil'?game.civil:game.under;let heading='TON MOT SECRET';draw('deal',`<section class="flow-content compact-content">${step('03',`JOUEUR ${game.dealIndex+1} / ${game.players.length}`)}${screenHeading(`À TOI,<br>${esc(p.name)}.`)}<p class="flow-desc">Passe le téléphone à ${esc(p.name)}.<br>Les autres doivent détourner les yeux !</p><div class="progress">${game.players.map((_,i)=>`<span class="${i<=game.dealIndex?'done':''}"></span>`).join('')}</div><div class="role-card ${reveal?'shown':'concealed'}"><div class="role-small">${reveal?heading:'CARTE SECRÈTE'}</div><div class="role-word">${reveal?esc(word):'LE MOT ?'}</div><div class="role-footer">${reveal?(p.role==='white'?'Bluffe, tu n’as pas de mot.':'Mémorise ton mot sans le dire.'):'PERSONNE NE REGARDE !'}</div></div><div class="form-actions">${reveal?btn('Masquer et passer →','nextDeal'):btn('Découvrir ma carte','showWord')}${btn('Abandonner la partie','confirmReset','text-btn')}</div></section>`)}
function nextDeal(){reveal=false;game.dealIndex++;if(game.dealIndex>=game.players.length)discussion();else deal()}
function discussion(){selected=null;draw('discussion',`<section class="flow-content compact-content">${step('04',`MANCHE ${game.round} / ${MAX_ROUNDS}`)}${screenHeading('À VOUS DE<br>BLUFFER.')}<p class="flow-desc">Donnez un indice chacun, sans dire votre mot.<br>Ensuite, débattez : qui ment ?</p><div class="panel game-panel"><div class="panel-title">JOUEURS ENCORE EN JEU</div><div class="roster">${game.players.filter(p=>p.alive).map(p=>`<div class="roster-row"><span>✳</span>${esc(p.name)}</div>`).join('')}</div><p class="micro">Si tu es Mr. White, improvise !</p></div><div class="form-actions">${btn('Passer au vote →','vote')}${btn('Arrêter la partie','confirmReset','text-btn')}</div></section>`)}
function vote(){selected=null;renderVote()}
function renderVote(){draw('vote',`<section class="flow-content compact-content">${step('05',`MANCHE ${game.round} / ${MAX_ROUNDS} · VOTE`)}${screenHeading('QUI EST<br>SUSPECT ?')}<p class="flow-desc">Choisissez ensemble le joueur à éliminer.</p><div class="panel vote-panel">${game.players.filter(p=>p.alive).map(p=>`<label class="vote-row ${selected===p.id?'picked':''}"><input type="radio" name="suspect" value="${p.id}" ${selected===p.id?'checked':''}><span>${esc(p.name)}</span><span aria-hidden="true">○</span></label>`).join('')}</div><div class="form-actions">${btn('Éliminer ce joueur →','eliminate')}${btn('Retour à la discussion','discussion','text-btn')}</div></section>`);app.querySelectorAll('input[name="suspect"]').forEach(r=>r.onchange=()=>{selected=Number(r.value);renderVote()})}
function eliminate(){if(selected===null){alert('Choisissez une personne à éliminer.');return}let p=game.players[selected];if(!p?.alive)return;p.alive=false;game.last=p;if(p.role==='white')whiteGuess();else checkWin()}
function whiteGuess(){draw('deal',`<section class="flow-content compact-content">${step('06','DERNIÈRE CHANCE')}${screenHeading('MR. WHITE<br>DÉMASQUÉ !')}<p class="flow-desc">${esc(game.last.name)} doit maintenant deviner le mot exact des Civils. Une seule tentative !</p><div class="panel game-panel"><label class="panel-title" for="guess">PROPOSITION DE MISTER WHITE</label><input class="guess-input" id="guess" maxlength="80" placeholder="Le mot des Civils…" autocomplete="off"><p class="micro">Ne montre pas le téléphone aux autres pendant la saisie.</p></div><div class="form-actions">${btn('Valider le mot →','guess')}</div></section>`);document.getElementById('guess').onkeydown=e=>{if(e.key==='Enter')actions.guess()}}
function normalize(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ')}
function guess(){const v=document.getElementById('guess').value;if(!v.trim()){alert('Saisis un mot ou clique sur Passer.');return}if(normalize(v)===normalize(game.civil)){game.winner='white';end()}else checkWin()}
function checkWin(){
 const alive=game.players.filter(p=>p.alive);
 const bad=alive.filter(p=>p.role!=='civil').length;
 const civ=alive.length-bad;
 if(bad===0){game.winner='civil';end();return}
 // S'il n'y a plus de Civils, la partie ne peut pas continuer.
 if(civ===0){game.winner='under';end();return}
 // Dès qu'il ne reste que deux joueurs, tout infiltré encore présent gagne.
 // Le cas de deux Civils est déjà couvert par bad===0 ci-dessus.
 if(alive.length<=2){game.winner='under';game.winReason='lastTwo';end();return}
 // Après le troisième vote, la partie s'arrête même si des Civils restent.
 if(game.round>=MAX_ROUNDS){game.winner='under';end();return}
 result();
}
function result(){let p=game.last;draw('result',`<section class="flow-content compact-content">${step('06','RÉSULTAT')}${screenHeading('DÉMASQUÉ !')}<p class="flow-desc">${esc(p.name)} est éliminé·e.</p><div class="panel game-panel"><div class="panel-title">SON VÉRITABLE RÔLE</div><div class="big-result">${p.role==='civil'?'CIVIL':p.role==='under'?'Edencover':'MISTER WHITE'}</div><p>${p.role==='civil'?'Oups ! Vous avez éliminé un Civil.':p.role==='under'?'Bien joué ! Un infiltré en moins.':'Mister White n’a pas trouvé le bon mot.'}</p><p class="micro">${game.players.filter(x=>x.alive).length} joueurs sont encore en jeu.</p></div><div class="form-actions">${btn('Manche suivante →','nextRound')}${btn('Arrêter la partie','confirmReset','text-btn')}</div></section>`)}
function end(){let title=game.winner==='civil'?'LES CIVILS<br>GAGNENT !':game.winner==='white'?'MISTER WHITE<br>GAGNE !':'LES INFILTRÉS<br>GAGNENT !';draw('end',`<section class="flow-content compact-content">${step('07','FIN DE PARTIE')}${screenHeading(title)}<p class="flow-desc">${game.winner==='civil'?'Tous les infiltrés ont été démasqués.':game.winner==='white'?'Mister White a deviné le mot des Civils.':(game.winReason==='lastTwo'?'Il ne reste que deux joueurs : un Edencover ou Mister White est encore en jeu !':`Après ${game.round} manche${game.round>1?'s':''}, des infiltrés sont encore en jeu !`)}</p><div class="panel game-panel"><div class="panel-title">LES MOTS</div><p><b>Civils :</b> ${esc(game.civil)}<br><b>Edencover :</b> ${esc(game.under)}</p><div class="panel-title">LES RÔLES</div><div class="roster">${game.players.map(p=>`<div class="roster-row"><span>${esc(p.name)}</span><b>${p.role==='civil'?'Civil':p.role==='under'?'Edencover':'Mister White'}</b></div>`).join('')}</div></div><div class="form-actions">${btn('Rejouer avec les mêmes joueurs →','restart')}${btn('Nouvelle configuration','configure','cream')}</div></section>`)}
const actions={home,rules,configure,names,start,showWord:()=>{reveal=true;deal()},nextDeal,discussion,vote,eliminate,guess,nextRound:()=>{if(game.round<MAX_ROUNDS){game.round++;discussion()}else{checkWin()}},saveNames:()=>{readNames();configure()},restart:()=>{setup.names=game.players.map(p=>p.name);names()},confirmReset:()=>{if(confirm('Abandonner cette partie ?'))home()}};
if('serviceWorker'in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.warn));
home();
