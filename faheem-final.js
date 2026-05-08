(() => {
  const root = document.querySelector('.app-shell');
  if (!root) return;

  const STORAGE = 'faheem_final_state_v1';
  const foods = [
    { id:'rice', e:'🍚', n:'أرز أبيض مطبوخ', a:['رز','ارز','رز ابيض','أرز أبيض'], mode:'weight', unit:'كوب مطبوخ', grams:160, c100:28, k100:130, note:'الأدق إذا كان موزون بالجرام.' },
    { id:'samoli', e:'🍞', n:'صمون صغير', a:['صمون','صامولي','خبز صمون'], mode:'unit', unit:'حبة', carbs:20, calories:108, note:'تختلف القيمة حسب الحجم.' },
    { id:'kabsa', e:'🍛', n:'كبسة دجاج', a:['كبسة','كبسه'], mode:'unit', unit:'صحن متوسط', carbs:70, calories:520, note:'تقدير تقريبي حسب كمية الرز.' },
    { id:'milk', e:'🥛', n:'حليب قليل الدسم', a:['حليب','كوب حليب'], mode:'unit', unit:'كوب', carbs:12, calories:95, note:'تختلف القيم حسب نوع الحليب.' },
    { id:'dates', e:'🌴', n:'تمرة واحدة', a:['تمر','تمرة'], mode:'unit', unit:'حبة', carbs:6, calories:23, note:'تختلف حسب نوع التمر وحجمه.' },
    { id:'suntop', e:'🧃', n:'سن توب برتقال', a:['سن توب','سنتوب'], mode:'unit', unit:'عبوة', carbs:26, calories:110, note:'منتج جاهز؛ احسبيه بعدد العبوات.' },
    { id:'chicken', e:'🍗', n:'دجاج مشوي', a:['دجاج','صدر دجاج'], mode:'weight', unit:'100 جرام', grams:100, c100:0, k100:165, note:'الكارب منخفض جدًا.' }
  ];

  let state = load();
  let page = 'home';
  let context = 'قبل الأكل';
  let selectedFood = null;

  function load(){
    try { return JSON.parse(localStorage.getItem(STORAGE)) || { readings: [], meal: [] }; }
    catch { return { readings: [], meal: [] }; }
  }
  function save(){ localStorage.setItem(STORAGE, JSON.stringify(state)); }
  function todayReadings(){
    const d = new Date();
    return state.readings.filter(r => {
      const x = new Date(r.t);
      return x.getFullYear()===d.getFullYear() && x.getMonth()===d.getMonth() && x.getDate()===d.getDate();
    });
  }
  function avg(arr){ return arr.length ? Math.round(arr.reduce((s,r)=>s+r.v,0)/arr.length) : '--'; }
  function max(arr){ return arr.length ? Math.max(...arr.map(r=>r.v)) : '--'; }
  function last(){ return state.readings.at(-1) || null; }
  function trend(arr){
    if (arr.length < 2) return 'بانتظار أكثر';
    const d = arr.at(-1).v - arr.at(-2).v;
    if (d >= 15) return 'صاعد';
    if (d <= -15) return 'هابط';
    return 'مستقر';
  }
  function calcFood(f){
    if (!f) return { carbs:0, calories:0, unit:'' };
    if (f.mode === 'weight') {
      const g = Number(document.querySelector('.food-grams')?.value || f.grams || 100);
      return { carbs: Math.round((f.c100 || 0) * g / 100), calories: Math.round((f.k100 || 0) * g / 100), unit: `${g} جرام` };
    }
    return { carbs: f.carbs, calories: f.calories, unit: f.unit };
  }
  function findFoods(q){
    q = (q || '').trim().toLowerCase();
    if (!q) return [];
    return foods.filter(f => [f.n, ...f.a].some(x => x.toLowerCase().includes(q) || q.includes(x.toLowerCase()))).slice(0,8);
  }

  function shell(){
    root.innerHTML = `
      <main class="app-main"></main>
      <nav class="bottom-nav" aria-label="تنقل فهيم">
        <div class="bottom-nav-shell">
          <button class="nav-btn active" data-page="home"><span class="nicon">⌂</span><span>الرئيسية</span></button>
          <button class="nav-btn" data-page="carb"><span class="nicon">🧺</span><span>كم كارب؟</span></button>
          <button class="nav-btn" data-page="pulse"><span class="nicon">⌁</span><span>نبض يومك</span></button>
        </div>
      </nav>`;
    root.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.page)));
  }

  function header(sub='جاهز نفهم يومك'){ return `<header class="app-head"><div class="brand-mini"><span class="logo">✦</span><div><h1>فهيم</h1><p>${sub}</p></div></div><button class="head-pill">♡</button></header>`; }
  function setActive(){ root.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.page===page)); }
  function go(p){ page=p; setActive(); render(); }

  function render(){
    const main = root.querySelector('.app-main');
    if (page === 'home') main.innerHTML = home();
    if (page === 'pulse') main.innerHTML = pulse();
    if (page === 'carb') main.innerHTML = carb();
    bind();
  }

  function home(){
    const t = todayReadings(); const l = last();
    return `${header('أهلًا، خلنا نبدأ بهدوء')}
      <section class="section-stack">
        <article class="hero-card">
          <h3>افهم يومك ببساطة</h3>
          <p>سجل قراءة، احسب كارب وجبتك، وخذ ملخص واضح بدون زحمة أرقام.</p>
          <button class="primary-btn" data-go="pulse">ابدأ يومك</button>
        </article>
        <div class="grid-3">
          <button class="card gate" data-go="pulse"><span class="ico">⌁</span><h3>نبض يومك</h3><p>آخر قراءة واتجاه اليوم</p></button>
          <button class="card gate active" data-go="carb"><span class="ico">🧺</span><h3>كم كارب؟</h3><p>اعرف كارب أكلك بسرعة</p></button>
          <button class="card gate" data-go="plus"><span class="ico">✦</span><h3>فهيم بلس</h3><p>تحليل أعمق قريبًا</p></button>
        </div>
        <article class="card">
          <div class="summary-grid">
            <div class="summary-box primary"><span>آخر قراءة</span><strong>${l ? l.v : '--'}</strong></div>
            <div class="summary-box"><span>قراءات اليوم</span><strong>${t.length}</strong></div>
            <div class="summary-box"><span>الاتجاه</span><strong>${trend(t)}</strong></div>
          </div>
        </article>
        <article class="card note-card"><h3>ملاحظة فهيم</h3><p>${t.length ? 'فهيم يلخص لك اليوم بدل ما يعرض كل قراءة. التفاصيل موجودة عند الحاجة فقط.' : 'ابدأ بأول قراءة، وبعدها يبدأ فهيم يبني لك صورة اليوم.'}</p></article>
      </section>`;
  }

  function pulse(){
    const t = todayReadings(); const l = last();
    return `${header('تابع قراءاتك بذكاء')}
      <div class="page-title"><p>نبض يومك</p><h2>${l ? 'صورة اليوم تتكوّن' : 'ابدأ أول قراءة'}</h2></div>
      <section class="section-stack">
        <article class="card metric-hero">
          <span class="unit">آخر قراءة</span>
          <div class="big-reading">${l ? l.v : '--'}</div>
          <span class="unit">mg/dL · ${l ? l.ctx : 'بانتظارك'}</span>
          <div class="chart-card"><svg viewBox="0 0 320 110"><path class="chart-grid" d="M0 25H320M0 55H320M0 85H320"/><path class="chart-area" d="M0 70C48 54 84 32 126 58C170 86 206 48 248 42C284 38 306 58 320 52V110H0Z"/><path class="chart-line" d="M0 70C48 54 84 32 126 58C170 86 206 48 248 42C284 38 306 58 320 52"/></svg></div>
        </article>
        <article class="card"><div class="summary-grid"><div class="summary-box"><span>عدد القراءات</span><strong>${t.length}</strong></div><div class="summary-box"><span>متوسط اليوم</span><strong>${avg(t)}</strong></div><div class="summary-box"><span>أعلى قراءة</span><strong>${max(t)}</strong></div></div></article>
        <article class="card input-card"><label>إدخال قراءة جديدة</label><div class="input-line"><input class="reading-input" inputmode="numeric" type="number" placeholder="مثال 126"><span>mg/dL</span></div><div class="context-row" style="margin-top:12px"><button class="chip ${context==='صيام'?'active':''}" data-context="صيام">صيام</button><button class="chip ${context==='قبل الأكل'?'active':''}" data-context="قبل الأكل">قبل الأكل</button><button class="chip ${context==='بعد الأكل'?'active':''}" data-context="بعد الأكل">بعد الأكل</button><button class="chip ${context==='نشاط'?'active':''}" data-context="نشاط">نشاط</button></div><button class="primary-btn save-reading" style="width:100%;margin-top:12px">حفظ القراءة</button></article>
        <article class="card note-card"><h3>ملاحظة فهيم</h3><p>${smartNote(t)}</p></article>
        <article class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h3 style="margin:0">آخر قراءة محفوظة</h3><button class="ghost-btn">عرض التفاصيل</button></div><div class="compact-list">${l ? `<div class="list-row"><b>${l.v}</b><span>${l.ctx}</span><small>${new Date(l.t).toLocaleTimeString('ar-SA',{hour:'numeric',minute:'2-digit'})}</small></div>` : '<p class="unit">لا توجد قراءات بعد.</p>'}</div></article>
      </section>`;
  }

  function smartNote(t){
    if (!t.length) return 'سجّل أول قراءة فقط. فهيم لا يحتاج زحمة أرقام حتى يبدأ يفهم يومك.';
    if (t.length === 1) return 'عندك قراءة واحدة. أضف قراءة ثانية مع سياق واضح عشان يبدأ الاتجاه يظهر لك.';
    if (t.length >= 8) return `عندك ${t.length} قراءات اليوم. فهيم يلخصها لك: الاتجاه ${trend(t)}، والمتوسط ${avg(t)}.`;
    return `الصورة بدأت توضح. آخر اتجاه: ${trend(t)}، ومتوسط اليوم ${avg(t)}.`;
  }

  function carb(){
    return `${header('اعرف كارب أكلك بسرعة')}
      <div class="page-title"><p>كم كارب؟</p><h2>وش بتاكل؟</h2></div>
      <section class="section-stack">
        <article class="card"><div class="search-line"><span>🔎</span><input class="food-q" placeholder="رز، صمون، كبسة، حليب..."></div><div class="chips" style="margin-top:12px"><button class="chip" data-food="رز">🍚 رز</button><button class="chip" data-food="صمون">🍞 صمون</button><button class="chip" data-food="كبسة">🍛 كبسة</button><button class="chip" data-food="حليب">🥛 حليب</button><button class="chip" data-food="تمر">🌴 تمر</button></div></article>
        <article class="card"><h3 style="margin:0 0 10px">نتائج فهيم</h3><div class="food-results"><p class="unit">اكتب اسم الأكل أو اختر من الاختصارات.</p></div></article>
        <article class="card answer-card"></article>
        <article class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h3 style="margin:0">سلة الوجبة</h3><span class="chip">${state.meal.length} عناصر</span></div><div class="meal-list">${mealRows()}</div><div class="result-grid"><div class="result-box primary"><span>إجمالي الكارب</span><strong>${state.meal.reduce((s,i)=>s+i.carbs,0)} جم</strong></div><div class="result-box"><span>السعرات</span><strong>${state.meal.reduce((s,i)=>s+i.calories,0)}</strong></div></div></article>
      </section>`;
  }

  function mealRows(){
    if (!state.meal.length) return '<p class="unit">أضف أول صنف للوجبة.</p>';
    return state.meal.map((i,idx)=>`<div class="meal-item"><span>${i.e}</span><span><b>${i.n}</b><small>${i.unit} · ${i.carbs} جم كارب · ${i.calories} سعرة</small></span><button data-remove="${idx}">×</button></div>`).join('');
  }

  function plus(){
    return `${header('ذكاء أعمق قريبًا')}<section class="section-stack"><article class="card plus-lock"><div class="bot">🤖</div><h3>فهيم بلس</h3><p>مساحة التحليل المتقدم والتقارير الذكية. نخليها للمرحلة الربحية القادمة.</p><button class="primary-btn" data-go="home">العودة للرئيسية</button></article></section>`;
  }

  function bind(){
    root.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
    root.querySelectorAll('[data-context]').forEach(b=>b.addEventListener('click',()=>{context=b.dataset.context;render();}));
    const saveBtn = root.querySelector('.save-reading');
    if (saveBtn) saveBtn.addEventListener('click',()=>{
      const inp = root.querySelector('.reading-input'); const v = Number(inp.value);
      if (!v || v < 20 || v > 600) return;
      state.readings.push({ v, ctx: context, t: Date.now() }); save(); render();
    });
    const q = root.querySelector('.food-q');
    if (q) q.addEventListener('input',()=>renderFoods(q.value));
    root.querySelectorAll('[data-food]').forEach(b=>b.addEventListener('click',()=>{ const input=root.querySelector('.food-q'); input.value=b.dataset.food; renderFoods(input.value); }));
    root.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{state.meal.splice(Number(b.dataset.remove),1); save(); render();}));
  }

  function renderFoods(text){
    const box = root.querySelector('.food-results'); if(!box) return;
    const arr = findFoods(text);
    box.innerHTML = arr.length ? arr.map(f=>{ const c=calcFood(f); return `<button class="food-hit" data-select="${f.id}"><span class="emoji">${f.e}</span><span><strong>${f.n}</strong><small>${f.unit}</small></span><span class="num">${c.carbs}<small>جم</small></span></button>`; }).join('') : '<p class="unit">ما لقينا نتيجة واضحة. جرّب كلمة أبسط.</p>';
    box.querySelectorAll('[data-select]').forEach(b=>b.addEventListener('click',()=>{ selectedFood = foods.find(f=>f.id===b.dataset.select); showAnswer(); }));
  }

  function showAnswer(){
    const box = root.querySelector('.answer-card'); if(!box || !selectedFood) return;
    const c = calcFood(selectedFood);
    box.classList.add('show');
    box.innerHTML = `<div class="answer-top"><span class="emoji">${selectedFood.e}</span><div><h3>${selectedFood.n}</h3><p>${selectedFood.note}</p></div></div><div class="result-grid"><div class="result-box primary"><span>الكارب</span><strong>${c.carbs} جم</strong></div><div class="result-box"><span>السعرات</span><strong>${c.calories}</strong></div></div>${selectedFood.mode==='weight'?`<div class="result-grid"><div class="result-box"><span>الوزن</span><input class="food-grams" type="number" value="${selectedFood.grams}"></div><div class="result-box"><span>الوحدة</span><strong>جرام</strong></div></div>`:''}<button class="primary-btn add-meal" style="width:100%;margin-top:12px">+ أضف للوجبة</button>`;
    const grams = box.querySelector('.food-grams'); if(grams) grams.addEventListener('input',showAnswer);
    box.querySelector('.add-meal').addEventListener('click',()=>{ const x=calcFood(selectedFood); state.meal.push({ e:selectedFood.e, n:selectedFood.n, carbs:x.carbs, calories:x.calories, unit:x.unit }); save(); render(); });
  }

  shell();
  render();
})();
