'use strict';
const USERNAME = 'mo7baker';
const DEFAULT_ROADMAP = {years: []};
const SKILLS = [
  {name:'Java & OOP',icon:'☕',desc:'Programming fundamentals',status:'learning',track:0},
  {name:'Calculus & Math',icon:'∑',desc:'Functions, matrices, linear algebra',status:'learning',track:0},
  {name:'Git & GitHub',icon:'◇',desc:'Code management and collaboration',status:'learning',track:0},
  {name:'Python',icon:'⌘',desc:'Programming for AI & automation',status:'learning',track:0},
  {name:'Data Science',icon:'▥',desc:'Pandas, NumPy and data analysis',status:'planned',track:1},
  {name:'Machine Learning',icon:'◎',desc:'Scikit-learn, modeling and metrics',status:'planned',track:1},
  {name:'Deep Learning',icon:'✳',desc:'PyTorch and neural architectures',status:'planned',track:2},
  {name:'LLMs & NLP',icon:'◈',desc:'Transformers and language systems',status:'planned',track:2},
  {name:'RAG & AI Agents',icon:'✺',desc:'Retrieval and intelligent workflows',status:'planned',track:3},
  {name:'Computer Vision',icon:'◉',desc:'Visual AI and perception',status:'planned',track:2},
  {name:'MLOps & Cloud',icon:'☁',desc:'Deployment, Docker and monitoring',status:'planned',track:3},
  {name:'SQL & Analytics',icon:'▦',desc:'Queries and data visualization',status:'planned',track:0}
];
const $ = s => document.querySelector(s);
const escapeHtml = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const navToggle = $('#nav-toggle');
navToggle?.addEventListener('click',()=>{ const open=$('#nav-links').classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));navToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation'); });
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{ $('#nav-links').classList.remove('open'); navToggle?.setAttribute('aria-expanded','false'); }));
$('#year').textContent = new Date().getFullYear();
function renderSkills(filter='all'){
 const filtered=SKILLS.filter(s=>filter==='all'||s.status===filter);
 $('#skills-grid').innerHTML=filtered.map(s=>`<article class="skill-card"><div class="skill-card-top"><div class="skill-symbol" aria-hidden="true">${s.icon}</div><div><div class="skill-name">${escapeHtml(s.name)}</div><div class="skill-desc">${escapeHtml(s.desc)}</div></div><span class="skill-status ${s.status}">${s.status==='learning'?'LEARNING':'ROADMAP'}</span></div><div class="skill-track" aria-label="Roadmap task completion"><div class="skill-fill" style="--progress:0%"></div></div><div class="skill-meta"><span>${s.status==='learning'?'IN PROGRESS':'PLANNED'}</span><span>LEARNING TRACK</span></div></article>`).join('');
}
renderSkills();
$('#skill-filters').addEventListener('click',e=>{ const btn=e.target.closest('button[data-filter]');if(!btn)return;document.querySelectorAll('#skill-filters button').forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn));});renderSkills(btn.dataset.filter);});
function renderRoadmap(data){
 if(!data?.years?.length){ $('#roadmap-grid').innerHTML='<p>Roadmap unavailable. Please check docs/data/roadmap.json.</p>';return; }
 let total=0,done=0;
 $('#roadmap-grid').innerHTML=data.years.map((y,i)=>{
   const tasks=Array.isArray(y.tasks)?y.tasks:[];
   const completed=tasks.filter(t=>t.done===true).length;
   const pct=tasks.length?Math.round(completed/tasks.length*100):0;
   total+=tasks.length;done+=completed;
   return `<article class="year-card ${i===0?'active':''}"><div class="year-top"><span class="year-num">${escapeHtml(y.year)}</span><span class="year-badge">${escapeHtml(y.status)}</span></div><h3>${escapeHtml(y.name)}</h3><p class="year-caption">${escapeHtml(y.summary)}</p><ul class="year-tasks">${tasks.map(t=>`<li><span class="check-symbol ${t.done===true?'done':''}" aria-hidden="true">${t.done===true?'✓':''}</span>${escapeHtml(t.title)}</li>`).join('')}</ul><div class="year-progress"><div class="year-progress-row"><span>COMPLETION</span><span>${completed}/${tasks.length}</span></div><div class="year-track"><div class="year-fill" style="width:${pct}%"></div></div></div></article>`;
 }).join('');
 const pct=total?Math.round(done/total*100):0;
 $('#growth-roadmap').textContent=`${done} / ${total}`;$('#mini-pct').textContent=`${pct}%`;$('#mini-donut').style.setProperty('--value',String(pct));$('#dashboard-roadmap-bars').innerHTML=data.years.map((y,i)=>{const t=y.tasks||[];const d=t.filter(task=>task.done===true).length;return `<div class="mini-year"><span>YEAR 0${i+1}</span><span class="mini-bar"><i style="width:${t.length?Math.round(d/t.length*100):0}%"></i></span><b>${d}/${t.length}</b></div>`;}).join('');$('#stat-milestones').innerHTML=`${done} <em>/ ${total}</em>`;
 $('#roadmap-count').textContent=`${done} / ${total} milestones`;
 $('#roadmap-pct').textContent=`${pct}%`;
 $('#total-donut').style.setProperty('--value',String(pct));
}
fetch('data/roadmap.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Roadmap unavailable');return r.json();}).then(renderRoadmap).catch(()=>renderRoadmap(DEFAULT_ROADMAP));
async function getGitHub(path){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),11000);try{const response=await fetch('https://api.github.com'+path,{headers:{Accept:'application/vnd.github+json'},signal:controller.signal});if(!response.ok)throw new Error(`GitHub API ${response.status}`);return await response.json();}finally{clearTimeout(timer);}}
async function userStats(){try{const u=await getGitHub('/users/'+USERNAME);$('#stat-repos').textContent=Number(u.public_repos??0).toLocaleString();$('#growth-repos').textContent=Number(u.public_repos??0).toLocaleString();$('#stat-followers').textContent=Number(u.followers??0).toLocaleString();}catch{ $('#stat-repos').textContent='—';$('#growth-repos').textContent='—';$('#stat-followers').textContent='—';document.querySelectorAll('.stat-info').forEach(el=>el.textContent='UNAVAILABLE');}}
function weekStart(d){const date=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));const shift=(date.getUTCDay()+6)%7;date.setUTCDate(date.getUTCDate()-shift);return date;}
function formatWeek(d){return d.toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});}
async function activityChart(){
 const chart=$('#activity-chart'),trend=$('#activity-trend'),summary=$('#chart-summary');
 try{
   // GitHub's public events feed is sampled and limited in history; this is NOT a contributions total.
   const events=await getGitHub('/users/'+USERNAME+'/events/public?per_page=100');
   const today=new Date();const lastWeek=weekStart(today);const starts=[];for(let i=7;i>=0;i--){const d=new Date(lastWeek);d.setUTCDate(d.getUTCDate()-i*7);starts.push(d);}
   const counts=starts.map(()=>0);
   events.forEach(e=>{if(!e.created_at)return;const stamp=new Date(e.created_at);const bucket=weekStart(stamp).getTime();const idx=starts.findIndex(d=>d.getTime()===bucket);if(idx>=0)counts[idx]++;});
   const max=Math.max(1,...counts);
   chart.innerHTML=counts.map((n,i)=>`<div class="chart-column" title="Week of ${formatWeek(starts[i])}: ${n} sampled public events"><span class="chart-number">${n}</span><div class="chart-bar ${i===7?'highlight':''}" style="height:${Math.max(2,n/max*150)}px" aria-label="${n} events"></div><small>${formatWeek(starts[i])}</small></div>`).join('');
   const prev=counts[6],current=counts[7],diff=current-prev;
   $('#growth-events').textContent=current;
   $('#growth-events-change').textContent= diff>0 ? `↗ ${diff} more than last week` : diff<0 ? `↘ ${Math.abs(diff)} fewer than last week` : '→ Same as last week';
   $('#growth-trend').textContent=diff>0?`↗ +${diff}`:diff<0?`↘ ${diff}`:'→ 0';
   $('#growth-trend').className='trend '+(diff>0?'up':diff<0?'down':'neutral');
   const px=i=>36+i*71;const py=n=>199-165*(n/max);
   const points=counts.map((n,i)=>`${px(i)},${py(n)}`).join(' ');
   $('#growth-line-svg').innerHTML=`<defs><linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a16fff" stop-opacity=".48"/><stop offset="100%" stop-color="#5442b0" stop-opacity=".02"/></linearGradient></defs><g stroke="#303b62" stroke-width="1"><path d="M30 35 H540 M30 76 H540 M30 117 H540 M30 158 H540 M30 199 H540"/></g><polygon points="36,199 ${points} 533,199" fill="url(#activity-fill)"/><polyline points="${points}" fill="none" stroke="#b492ff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>${counts.map((n,i)=>`<circle cx="${px(i)}" cy="${py(n)}" r="4.5" stroke="#e9d9ff" stroke-width="1.5" fill="#865aff"><title>Week of ${formatWeek(starts[i])}: ${n} sampled public events</title></circle><text x="${px(i)}" y="224" font-size="11" text-anchor="middle" fill="#92a0c5">W${i+1}</text>`).join('')}`;

   trend.className='trend '+(diff>0?'up':diff<0?'down':'neutral');
   trend.textContent=(diff>0?'↗ +':diff<0?'↘ ':'→ ')+diff+(diff===0?' change':' events');
   summary.textContent=`${counts.reduce((a,b)=>a+b,0)} sampled public events in the chart window`;
 }catch{$('#growth-events').textContent='—';$('#growth-events-change').textContent='Data unavailable';$('#growth-trend').textContent='NO DATA';$('#growth-line-svg').innerHTML='<text x="34" y="122" fill="#aab6d2" font-size="15">GitHub API unavailable — please try later</text>';chart.innerHTML='<div class="chart-loading">Live GitHub metrics are temporarily unavailable. Visit GitHub to see the latest activity.</div>';trend.textContent='NO DATA';trend.className='trend neutral';summary.textContent='API unavailable or rate limited';}
}
userStats();activityChart();
if('IntersectionObserver' in window){const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}})},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
