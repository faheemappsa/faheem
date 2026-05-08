(() => {
  const root = document.querySelector('.app-shell');
  if (!root) return;
  const STORAGE = 'faheem_final_state_v1';
  function state(){try{return JSON.parse(localStorage.getItem(STORAGE))||{readings:[],meal:[]}}catch{return{readings:[],meal:[]}}}
  function todayReadings(){const s=state();const d=new Date();return (s.readings||[]).filter(r=>{const x=new Date(r.t);return x.getFullYear()===d.getFullYear()&&x.getMonth()===d.getMonth()&&x.getDate()===d.getDate()})}
  function last(){const s=state();return (s.readings||[]).at(-1)||null}
  function avg(a){return a.length?Math.round(a.reduce((x,r)=>x+r.v,0)/a.length):'--'}
  function max(a){return a.length?Math.max(...a.map(r=>r.v)):'--'}
  function trend(a){if(a.length<2)return'بانتظار';const d=a.at(-1).v-a.at(-2).v;if(d>=15)return'صاعد';if(d<=-15)return'هابط';return'مستقر'}
  function greet(){const h=new Date().getHours();if(h<12)return'صباح الخير';if(h<17)return'مرحبًا';if(h<21)return'مساء الخير';return'أهلًا بك'}
  function logoWord(){return '<span class="fm-logo-word">فهيم</span>'}
  function header(){return `<header class="app-head"><button class="head-pill" data-go="plus">🔔</button><div class="brand-mini"><div>${logoWord()}<p>${greet()} 👋</p><p style="font-size:.9rem;color:#728188;margin-top:5px">نحن هنا لنفهم سكر الدم والكارب معًا</p></div></div></header>`}
  function illustration(){return `<div class="fm-illustration"><span class="fm-person">👨🏻‍💻</span><span class="fm-bubble one">💚</span><span class="fm-bubble two">📈</span><span class="fm-leaf">✦</span></div>`}
  function splashPolish(){
    const splash=document.querySelector('.splash-card'); if(!splash)return;
    splash.innerHTML=`<div class="splash-logo">🤖</div><div>${logoWord()}</div><p>تحليل أعمق ليومك ✨</p><div class="splash-panel"><strong>جاري تجهيز يومك...</strong><div class="progress"><span></span></div><div class="dots"><i></i><i></i><i></i></div></div><p style="margin-top:34px;color:#728188">كل خطوة صغيرة تقربك من حياة صحية أفضل 💚</p>`;
  }
  function homeHtml(){
    const t=todayReadings();const l=last();
    return `${header()}<section class="section-stack"><article class="hero-card"><div><h3>افهم جسمك بسهولة</h3><p>راقب سكر دمك، احسب كاربك، واتخذ قرارات أفضل كل يوم.</p><button class="primary-btn" data-go="pulse">ابدأ رحلتك الآن</button></div>${illustration()}</article><div class="grid-3"><button class="card gate" data-go="pulse"><span class="ico">💚</span><h3>نبض يومك</h3><p>عرض قراءاتك والمؤشرات الصحية</p></button><button class="card gate active" data-go="carb"><span class="ico">🥣</span><h3>كم كارب؟</h3><p>احسب الكارب بسهولة في أي وجبة</p></button><button class="card gate" data-go="plus"><span class="ico">⭐</span><h3>فهيم بلس</h3><p>ابدأ خطة شخصية وأدوات متقدمة</p></button></div><article class="card"><div class="summary-title"><h3>ملخص اليوم</h3><span class="fm-date">اليوم</span></div><div class="summary-grid"><div class="summary-box primary"><span class="fm-stat-icon">💧</span><strong>${l?l.v:'--'}</strong><span>متوسط السكر</span></div><div class="summary-box"><span class="fm-stat-icon">💚</span><strong>${t.length?avg(t)+'%':'--'}</strong><span>في النطاق</span></div><div class="summary-box"><span class="fm-stat-icon">🥣</span><strong>${(state().meal||[]).reduce((s,i)=>s+(i.carbs||0),0)||'--'}</strong><span>إجمالي الكارب</span></div></div></article><article class="card fm-mini-chart"><div class="fm-chart-copy"><h3>اتجاه سكر الدم</h3><p>آخر 24 ساعة</p><button class="ghost-btn" data-go="pulse">عرض القراءات</button></div><svg class="fm-chart" viewBox="0 0 320 110"><path d="M0 28H320M0 58H320M0 88H320" stroke="rgba(20,51,58,.08)"/><path d="M0 70C40 52 76 70 110 45C150 18 184 76 220 48C258 20 294 62 320 42" fill="none" stroke="#159B6A" stroke-width="7" stroke-linecap="round"/><path d="M0 70C40 52 76 70 110 45C150 18 184 76 220 48C258 20 294 62 320 42V110H0Z" fill="rgba(32,185,129,.12)"/></svg></article><div class="fm-quick-title">رؤى ذكية من يومك 🧠</div><div class="fm-insight-grid"><article class="fm-small-card"><b>أفضل استقرار</b><span>قراءاتك الهادئة تظهر عندما يكون السياق واضح.</span></article><article class="fm-small-card"><b>بعد الوجبات</b><span>سجل قراءة بعد الأكل حتى يوضح فهيم النمط.</span></article></div><article class="card fm-next"><span class="shoe">👟</span><div><h3 style="margin:0;color:#14333A">خطوتك التالية</h3><p style="margin:5px 0 0;color:#728188;font-weight:800">جرّب تسجيل قراءة مع سياق واضح بعد الوجبة.</p></div></article></section>`
  }
  function patchHome(){
    const main=document.querySelector('.app-main'); if(!main)return;
    const nav=document.querySelector('.nav-btn.active');
    const isHome=!nav||nav.dataset.page==='home';
    if(isHome){main.innerHTML=homeHtml(); bindLocal();}
  }
  function bindLocal(){document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{const n=document.querySelector(`.nav-btn[data-page="${b.dataset.go}"]`); if(n)n.click();}))}
  const obs=new MutationObserver(()=>{splashPolish(); const active=document.querySelector('.nav-btn.active'); if(active&&active.dataset.page==='home')patchHome();});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{splashPolish();patchHome()},80)});
  setTimeout(()=>{splashPolish();patchHome()},400);
})();
