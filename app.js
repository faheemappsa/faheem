const GA_ID = 'G-B20GWHW0NW';
const STORAGE_KEY = 'faheem_local_memory_v1';

const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
document.head.appendChild(gaScript);
window.dataLayer = window.dataLayer || [];
function gtag(){ window.dataLayer.push(arguments); }
window.gtag = gtag;
gtag('js', new Date());
gtag('config', GA_ID);

const polish = document.createElement('link');
polish.rel = 'stylesheet';
polish.href = 'styles-polish.css';
document.head.appendChild(polish);

const navButtons = document.querySelectorAll('.nav-card, .bottom-nav-btn');
const sections = document.querySelectorAll('.content-section');
const daily = document.getElementById('daily-pulse');
const carb = document.getElementById('carb-search');
const plus = document.getElementById('faheem-plus');
const inputModule = daily?.querySelector('.input-module');
const readingInput = document.getElementById('reading-input');
const chipsBox = inputModule?.querySelector('.context-chips');
const overview = daily?.querySelector('.overview-card');

const contexts = [
  ['fasting', 'صيام'],
  ['before_meal', 'قبل الأكل'],
  ['after_meal', 'بعد الأكل'],
  ['activity', 'نشاط']
];
let selectedContext = 'before_meal';
let uiReady = false;

function defaultState(){ return { profile:{ firstVisitAt:null, lastVisitAt:null, visits:0 }, ui:{ lastTab:'daily-pulse' }, readings:[] }; }
function loadState(){ try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}); } catch { return defaultState(); } }
let state = loadState();
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function track(name, params={}){ if (typeof window.gtag === 'function') window.gtag('event', name, params); }
function sameDay(a,b){ const x=new Date(a), y=new Date(b); return x.getFullYear()===y.getFullYear() && x.getMonth()===y.getMonth() && x.getDate()===y.getDate(); }
function today(){ const now=Date.now(); return state.readings.filter(r => sameDay(r.timestamp, now)); }
function lastReading(){ return state.readings[state.readings.length - 1] || null; }
function avg(list){ return list.length ? Math.round(list.reduce((s,r)=>s+Number(r.value),0)/list.length) : null; }
function time(ts){ return new Date(ts).toLocaleTimeString('ar-SA', { hour:'numeric', minute:'2-digit' }); }
function dateTime(ts){ return new Date(ts).toLocaleString('ar-SA', { day:'numeric', month:'short', hour:'numeric', minute:'2-digit' }); }
function contextLabel(key){ return (contexts.find(c => c[0] === key) || ['', 'بدون سياق'])[1]; }
function trend(list){ if (list.length < 2) return 'بانتظار أكثر'; const d=list[list.length-1].value-list[list.length-2].value; return d>=15?'صاعد':d<=-15?'هابط':'مستقر'; }

function greeting(list){
  const h = new Date().getHours();
  if (!state.readings.length && state.profile.visits <= 1) return ['أهلًا بك في فهيم','مو لازم تفهم كل شيء الآن.. ابدأ بقراءة وحدة','فهيم يبدأ معك من أول قراءة، ويجمع الصورة خطوة خطوة'];
  if (!state.readings.length) return ['رجعت لفهيم','خلنا نبدأ من أول قراءة','بمجرد تسجيل القراءة يبدأ فهيم يبني لك فهم أوضح'];
  if (!list.length) return ['رجعت لفهيم','نكمل من آخر قراءة',`آخر تسجيل كان ${dateTime(lastReading().timestamp)}`];
  if (list.length > 1) return [h < 12 ? 'صباح الخير' : h < 17 ? 'خلنا نراجع منتصف اليوم' : h < 21 ? 'مساء هادئ' : 'قبل ما ينتهي اليوم', `عندك ${list.length} قراءة اليوم`, 'كل قراءة جديدة تقرّب فهيم من فهم يومك بشكل أدق'];
  return [h < 12 ? 'صباح الخير' : h < 17 ? 'خلنا نراجع منتصف اليوم' : h < 21 ? 'مساء هادئ' : 'قبل ما ينتهي اليوم', 'بداية اليوم واضحة', 'أضف قراءة ثانية إذا تغيّر الوضع، عشان تبدأ الصورة توضح أكثر'];
}

function nextStep(list){
  if (!list.length) return ['خطوتك الآن','ابدأ بقراءة واحدة فقط، وبعدها فهيم يبدأ يفهم يومك','اقتراح اليوم: سجّل أول قراءة'];
  if (list.length === 1) return ['خطوتك الآن','أضف قراءة ثانية مع سياق واضح، عشان يبدأ الاتجاه يظهر لك','الخطوة التالية: سجّل قراءة عند تغيّر الوضع'];
  if (list.length < 3) return ['خطوتك الآن','الصورة بدأت توضح. استمر بقراءة جديدة إذا أكلت أو تغيّر النشاط','كل قراءة إضافية تعطي فهيم فهمًا أفضل'];
  return ['خطوتك الآن','استمر بهدوء. سجّل فقط عند الحاجة أو بعد تغيّر ملحوظ','فهيم يتابع يومك محليًا على هذا الجهاز'];
}

function ensureUI(){
  if (uiReady || !inputModule || !chipsBox || !readingInput) return;
  uiReady = true;
  readingInput.disabled = false;
  readingInput.type = 'number';
  readingInput.inputMode = 'numeric';
  readingInput.min = '20';
  readingInput.max = '600';
  readingInput.placeholder = 'مثال 126';

  const action = document.createElement('div');
  action.className = 'reading-actions';
  action.innerHTML = '<button class="save-reading-btn" type="button">حفظ القراءة</button><p class="inline-status">تُنحفظ قراءاتك داخل جهازك فقط.</p>';
  chipsBox.after(action);
  action.after(makeNode('p','helper-copy','اختر السياق ثم احفظ القراءة.'));
  action.nextElementSibling.after(makeNode('p','last-visit-note',''));

  chipsBox.querySelectorAll('span').forEach((chip, i) => {
    const item = contexts[i]; if (!item) return;
    chip.dataset.context = item[0]; chip.classList.add('selectable-chip'); chip.tabIndex = 0; chip.setAttribute('role','button');
    chip.addEventListener('click', () => selectContext(item[0]));
    chip.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectContext(item[0]); } });
  });

  inputModule.after(card('next-step-card', '<div class="next-step-head"><span class="step-badge">الآن</span><h3 class="step-title">خطوتك الآن</h3></div><p class="step-copy"></p><p class="step-meta"></p>'));
  const insight = daily.querySelector('.insight-card');
  insight.after(card('reading-log-card', '<div class="module-title"><div><h3>سجل القراءات</h3><p>آخر ما حفظته على هذا الجهاز.</p></div></div><div class="reading-log-empty">ما فيه قراءات بعد.</div><div class="reading-log-list"></div>'));

  action.querySelector('button').addEventListener('click', saveReading);
  readingInput.addEventListener('keydown', e => { if(e.key === 'Enter') saveReading(); });
}
function makeNode(tag, cls, text){ const n=document.createElement(tag); n.className=cls; n.textContent=text; return n; }
function card(cls, html){ const n=document.createElement('article'); n.className=`module-card ${cls}`; n.innerHTML=html; return n; }
function selectContext(key){ selectedContext=key; chipsBox?.querySelectorAll('.selectable-chip').forEach(c => c.classList.toggle('is-selected', c.dataset.context === key)); }
function setStatus(text, kind){ const chip=overview?.querySelector('.status-chip'); if(!chip) return; chip.className=`status-chip is-${kind}`; chip.innerHTML=`<span class="is-${kind}"></span> ${text}`; }

function render(){
  ensureUI(); selectContext(selectedContext);
  const list=today(), last=lastReading(), average=avg(list), tr=trend(list), g=greeting(list), step=nextStep(list);
  const heading=daily.querySelector('.screen-heading'); heading.querySelector('p').textContent=g[0]; heading.querySelector('h2').textContent=g[1];
  overview.querySelector('.overview-head h3').textContent=list.length?'نبض يومك بدأ يتكوّن':'ابدأ أول قراءة';
  overview.querySelector('.reading-row strong').textContent=last?last.value:'--';
  overview.querySelector('.overview-note').textContent=g[2];
  setStatus(!list.length?'جاهز للتسجيل':list.length<3?'الصورة بدأت توضح':'اليوم نشط', !list.length?'ready':list.length<3?'warm':'alert');
  const stats=overview.querySelectorAll('.overview-stats div');
  [['آخر قراءة',last?last.value:'--'],['الاتجاه',tr],['متوسط اليوم',average||'--']].forEach((x,i)=>{ stats[i].querySelector('span').textContent=x[0]; stats[i].querySelector('strong').textContent=x[1]; });
  const metrics=daily.querySelectorAll('.metric-grid .metric-card');
  [[last?last.value:'--','mg/dL'],['--','قريبًا'],[tr,list.length?`${list.length} قراءة`:'بداية']].forEach((x,i)=>{ metrics[i].querySelector('strong').textContent=x[0]; metrics[i].querySelector('small').textContent=x[1]; });
  document.querySelector('.helper-copy').textContent=list.length?`اليوم عندك ${list.length} قراءة.`:'ابدأ بقراءة واحدة فقط، وبعدها يبدأ النمط يتكوّن.';
  document.querySelector('.last-visit-note').textContent=state.profile.lastVisitAt?`آخر زيارة: ${dateTime(state.profile.lastVisitAt)}`:'هذه أول زيارة محفوظة على هذا الجهاز.';
  document.querySelector('.step-title').textContent=step[0]; document.querySelector('.step-copy').textContent=step[1]; document.querySelector('.step-meta').textContent=step[2];
  daily.querySelector('.insight-card p').textContent=list.length?'فهيم يحفظ قراءاتك محليًا على هذا الجهاز فقط، ويساعدك تلاحظ النمط بدون أي قرار علاجي.':'فهيم يساعدك تنظّم وتفهم، لكن أي قرار علاجي يبقى مع الطبيب أو الفريق الصحي.';
  renderLog();
  carb.querySelector('.screen-heading p').textContent=state.profile.visits>1?'البحث الأسرع لما تحتاج رقم سريع':'إذا احتجت تقدير كارب سريع، بتلقاه هنا';
  plus.querySelector('.screen-heading p').textContent=state.readings.length>=3?'فهيم بدأ يبني فهمًا أوضح ليومك':'كل ما زادت قراءاتك، صارت إجابات فهيم أذكى';
}

function renderLog(){
  const empty=document.querySelector('.reading-log-empty'), listBox=document.querySelector('.reading-log-list');
  listBox.innerHTML='';
  if(!state.readings.length){ empty.hidden=false; listBox.hidden=true; return; }
  empty.hidden=true; listBox.hidden=false;
  [...state.readings].slice(-8).reverse().forEach(r => {
    const row=document.createElement('div'); row.className=`reading-log-item ${r.context==='after_meal'?'is-warm':r.context==='activity'?'is-calm':''}`;
    row.innerHTML=`<div class="reading-log-copy"><strong>${r.value}</strong><span>mg/dL</span><p>${contextLabel(r.context)}</p></div><div class="reading-log-meta"><span>${time(r.timestamp)}</span></div>`;
    listBox.appendChild(row);
  });
}

function showStatus(msg, type){ const s=document.querySelector('.inline-status'); s.textContent=msg; s.className=`inline-status ${type?`is-${type}`:''}`; }
function saveReading(){
  const value=Number(readingInput.value);
  if(!readingInput.value || Number.isNaN(value)){ showStatus('أدخل قراءة صحيحة أولًا.','error'); return; }
  if(value<20 || value>600){ showStatus('القراءة لازم تكون بين 20 و 600.','error'); return; }
  state.readings.push({ id:String(Date.now()), value, context:selectedContext, timestamp:Date.now() }); saveState(); readingInput.value=''; showStatus('تم حفظ القراءة على هذا الجهاز.','success'); track('reading_added',{ context:selectedContext, reading_value:value }); render();
}

function activateSection(targetId, options = {}) {
  navButtons.forEach((button) => {
    const isActive = button.dataset.target === targetId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  sections.forEach((section) => {
    const isVisible = section.id === targetId;
    section.classList.toggle('is-visible', isVisible);
    section.hidden = !isVisible;
  });
  state.ui.lastTab = targetId; saveState();
  if (!options.skipTracking) track('section_opened', { section_name: targetId });
}

function init(){
  const now=Date.now(); if(!state.profile.firstVisitAt) state.profile.firstVisitAt=now; state.profile.visits=Number(state.profile.visits||0)+1; state.profile.lastVisitAt=now; saveState();
  render();
  navButtons.forEach((button) => button.addEventListener('click', () => activateSection(button.dataset.target)));
  activateSection(state.ui.lastTab || 'daily-pulse', { skipTracking: true });
}
init();
