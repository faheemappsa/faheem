(() => {
  const root = document.getElementById('app');
  const KEY = 'faheem_app_v1';
  const FALLBACK_FOODS = [
    {id:'rice-white',name:'رز أبيض مطبوخ',aliases:['رز','ارز','أرز','رز أبيض'],emoji:'🍚',unit:'120 غرام',carbs:34,calories:156,confidence:'عالية',note:'تقدير مبني على الرز الأبيض المطبوخ.'},
    {id:'bread-samoli',name:'خبز صمون',aliases:['صمون','صامولي','خبز'],emoji:'🍞',unit:'حبة صغيرة',carbs:20,calories:108,confidence:'متوسطة',note:'تختلف القيمة حسب الحجم والمخبز.'},
    {id:'milk-low-fat',name:'حليب قليل الدسم',aliases:['حليب','كوب حليب'],emoji:'🥛',unit:'كوب',carbs:12,calories:95,confidence:'عالية',note:'راجع الملصق الغذائي عند اختلاف النوع.'},
    {id:'date',name:'تمرة',aliases:['تمر','تمرة'],emoji:'🌴',unit:'حبة',carbs:6,calories:23,confidence:'متوسطة',note:'الحجم والنوع يغيران القيمة.'},
    {id:'apple',name:'تفاحة',aliases:['تفاح','تفاحة'],emoji:'🍎',unit:'حبة متوسطة',carbs:25,calories:95,confidence:'عالية',note:'تقدير للحبة المتوسطة.'},
    {id:'kabsa',name:'كبسة دجاج',aliases:['كبسة','كبسه'],emoji:'🍛',unit:'صحن متوسط',carbs:70,calories:520,confidence:'تقريبية',note:'تعتمد على كمية الرز في الصحن.'}
  ];

  let foods = FALLBACK_FOODS;
  let page = 'home';
  let selectedFood = null;
  let state = loadState();

  function loadState(){
    try { return JSON.parse(localStorage.getItem(KEY)) || defaultState(); }
    catch { return defaultState(); }
  }
  function defaultState(){
    return { user:{ name:'', type:'', firstSeen:Date.now(), lastSeen:Date.now() }, readings:[], meal:[] };
  }
  function save(){ state.user.lastSeen = Date.now(); localStorage.setItem(KEY, JSON.stringify(state)); }
  function todayReadings(){
    const today = new Date().toDateString();
    return state.readings.filter(r => new Date(r.time).toDateString() === today);
  }
  function avg(arr){ return arr.length ? Math.round(arr.reduce((s,r)=>s+r.value,0)/arr.length) : '--'; }
  function trend(arr){
    if(arr.length < 2) return 'بانتظار';
    const diff = arr.at(-1).value - arr.at(-2).value;
    if(diff > 15) return 'صاعد';
    if(diff < -15) return 'هابط';
    return 'مستقر';
  }
  function greet(){
    const h = new Date().getHours();
    if(h < 12) return 'صباح الخير';
    if(h < 18) return 'مرحبًا';
    return 'مساء الخير';
  }
  function userName(){ return state.user.name ? ` يا ${state.user.name}` : ''; }
  function mealCarbs(){ return state.meal.reduce((s,x)=>s + Number(x.carbs || 0), 0); }
  function mealCalories(){ return state.meal.reduce((s,x)=>s + Number(x.calories || 0), 0); }

  async function boot(){
    await loadFoods();
    root.innerHTML = appShell();
    setTimeout(()=> document.querySelector('.splash')?.classList.add('hide'), 850);
    render();
  }
  async function loadFoods(){
    try {
      const res = await fetch('data/foods.json', { cache:'no-store' });
      if(res.ok) foods = await res.json();
    } catch {}
  }
  function appShell(){
    return `<div class="splash"><div class="splash-card"><div class="mark">ف</div><div class="brand-word">فهيم <span class="brand-leaf">✦</span></div><p>نرتب يومك بهدوء، من قراءة السكر إلى كارب الوجبة.</p><div class="loader"><span></span></div></div></div><div class="app"><main class="screen"></main><nav class="nav"><button data-page="home" class="active"><span>⌂</span><span>الرئيسية</span></button><button data-page="carb"><span>🍽️</span><span>كم كارب؟</span></button><button data-page="plus"><span>✦</span><span>فهيم بلس</span></button></nav></div>`;
  }
  function header(){
    return `<header class="top"><div class="avatar">${state.user.name ? '👤' : '🌿'}</div><div class="top-copy"><small>${greet()}${userName()}</small><b>${state.user.name ? 'نكمّل من آخر نقطة' : 'خلنا نبدأ بهدوء'}</b></div><button class="bell" data-page="plus">🔔</button></header>`;
  }
  function render(){
    const screen = document.querySelector('.screen');
    if(!screen) return;
    screen.innerHTML = page === 'carb' ? carbPage() : page === 'plus' ? plusPage() : homePage();
    document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('active', b.dataset.page === page));
    bind();
  }
  function homePage(){
    const t = todayReadings();
    const last = state.readings.at(-1);
    return `${header()}<section><article class="hero"><div><h1>افهم يومك بدون زحمة</h1><p>سجل قراءة، احسب كارب وجبتك، وخذ ملخص واضح يساعدك تفهم الاتجاه.</p><button class="cta" data-page="carb">ابدأ الآن</button></div><div class="art">📊</div></article><div class="quick"><button data-page="home"><div class="qicon">💚</div><b>نبض يومك</b><span>آخر قراءة واتجاه اليوم</span></button><button data-page="carb"><div class="qicon">🍚</div><b>كم كارب؟</b><span>احسب كارب أكلك بسرعة</span></button><button data-page="plus"><div class="qicon">✦</div><b>فهيم بلس</b><span>تحليل أعمق وملخص ذكي</span></button></div><article class="card"><div class="row-title"><h3>ملخص اليوم</h3><span>اليوم</span></div><div class="stats"><div class="stat"><i>💧</i><b>${last ? last.value : '--'}</b><span>آخر قراءة</span></div><div class="stat"><i>🍽️</i><b>${mealCarbs()}</b><span>كارب الوجبة</span></div><div class="stat"><i>📈</i><b>${trend(t)}</b><span>الاتجاه</span></div></div></article><article class="card"><div class="row-title"><h3>اتجاه السكر</h3><span>${t.length ? `${t.length} قراءات` : 'بانتظارك'}</span></div><div class="chart"><svg viewBox="0 0 320 120"><path class="gridline" d="M0 30H320M0 65H320M0 100H320"/><path class="area" d="M0 78C48 58 76 92 112 64C150 35 178 80 218 54C260 26 285 69 320 50V120H0Z"/><path class="line" d="M0 78C48 58 76 92 112 64C150 35 178 80 218 54C260 26 285 69 320 50"/></svg></div></article><article class="card notice"><span>✨</span><p class="empty">${state.user.name ? 'فهيم بدأ يتعرف على يومك. كل قراءة أو وجبة تضيفها تجعل الملخص أوضح.' : 'اكتب اسمك من فهيم بلس لاحقًا لتبدأ تجربة شخصية أكثر.'}</p></article></section>`;
  }
  function carbPage(){
    return `${header()}<section><article class="hero"><div><h2>كم كارب؟</h2><p>ابحث عن أكلك أو مشروبك، وشوف تقدير الكارب والسعرات بسرعة.</p></div><div class="art">🍚</div></article><div class="search"><span>🔎</span><input id="foodSearch" placeholder="رز، خبز، حليب، تمر..."></div><div class="chips"><button class="chip" data-food="رز">رز</button><button class="chip" data-food="خبز">خبز</button><button class="chip" data-food="حليب">حليب</button><button class="chip" data-food="تمر">تمر</button><button class="chip" data-food="كبسة">كبسة</button></div><div class="food-art">🍽️</div><article class="card"><div class="row-title"><h3>نتائج فهيم</h3><span>اختر صنف</span></div><div class="food-list" id="foodResults"><p class="empty">اكتب اسم الأكل أو اختر من الاختصارات.</p></div></article><article class="card answer" id="answer"></article><article class="card"><div class="row-title"><h3>سلة الوجبة</h3><span>${state.meal.length} عناصر</span></div><div class="meal">${mealRows()}</div><div class="boxes"><div class="box main"><span>إجمالي الكارب</span><b>${mealCarbs()} غ</b></div><div class="box"><span>السعرات</span><b>${mealCalories()}</b></div></div></article></section>`;
  }
  function plusPage(){
    const t = todayReadings();
    return `${header()}<section><article class="hero"><div><h2>فهيم بلس</h2><p>تحليل أعمق ليومك بناءً على قراءاتك ووجباتك، في ملخص واضح قابل للتطوير.</p><button class="cta" id="saveNameBtn">حفظ اسمي</button></div><div class="art">🤖</div></article><article class="card plus-hero"><div class="score"><b>${t.length ? '85' : '--'}</b></div><h3>درجة فهم اليوم</h3><p class="empty">كلما سجلت قراءات ووجبات أكثر، يصير تحليل فهيم أوضح وأقرب لك.</p><div class="search"><span>👤</span><input id="nameInput" value="${escapeHtml(state.user.name)}" placeholder="اكتب اسمك هنا"></div></article><article class="card"><div class="row-title"><h3>مميزات فهيم بلس</h3><span>قريبًا</span></div><div class="feature"><i>📋</i><div><b>بطاقة تحليل اليوم</b><div class="empty">ملخص بصري بدل زحمة الأرقام.</div></div></div><div class="feature"><i>📈</i><div><b>اكتشاف النمط</b><div class="empty">يربط القراءة بالوقت والوجبة والسياق.</div></div></div><div class="feature"><i>🔔</i><div><b>تنبيهات ذكية</b><div class="empty">تذكير عند تكرار نمط مهم.</div></div></div></article></section>`;
  }
  function mealRows(){
    if(!state.meal.length) return '<p class="empty">أضف أول صنف للوجبة.</p>';
    return state.meal.map((m,i)=>`<div class="meal-row"><span>${m.emoji}</span><div><b>${m.name}</b><div class="empty">${m.unit} · ${m.carbs}غ كارب</div></div><button data-remove="${i}">×</button></div>`).join('');
  }
  function bind(){
    document.querySelectorAll('[data-page]').forEach(btn => btn.onclick = () => { page = btn.dataset.page; render(); });
    document.querySelectorAll('[data-food]').forEach(btn => btn.onclick = () => { const input = document.getElementById('foodSearch'); if(input){ input.value = btn.dataset.food; searchFood(input.value); } });
    const foodSearch = document.getElementById('foodSearch');
    if(foodSearch) foodSearch.oninput = () => searchFood(foodSearch.value);
    document.querySelectorAll('[data-remove]').forEach(btn => btn.onclick = () => { state.meal.splice(Number(btn.dataset.remove),1); save(); render(); });
    const saveNameBtn = document.getElementById('saveNameBtn');
    if(saveNameBtn) saveNameBtn.onclick = () => { const input = document.getElementById('nameInput'); state.user.name = (input?.value || '').trim(); save(); render(); };
  }
  function searchFood(query){
    const list = document.getElementById('foodResults');
    if(!list) return;
    const q = query.trim().toLowerCase();
    if(!q){ list.innerHTML = '<p class="empty">اكتب اسم الأكل أو اختر من الاختصارات.</p>'; return; }
    const found = foods.filter(f => [f.name, ...(f.aliases || [])].some(x => x.toLowerCase().includes(q) || q.includes(x.toLowerCase()))).slice(0,8);
    list.innerHTML = found.length ? found.map(f => `<button class="food" data-select="${f.id}"><span class="emoji">${f.emoji}</span><span><strong>${f.name}</strong><small>${f.unit} · ثقة ${f.confidence}</small></span><span class="num">${f.carbs}غ</span></button>`).join('') : '<p class="empty">ما لقينا نتيجة واضحة. جرّب كلمة أبسط.</p>';
    list.querySelectorAll('[data-select]').forEach(btn => btn.onclick = () => showFood(btn.dataset.select));
  }
  function showFood(id){
    selectedFood = foods.find(f => f.id === id);
    const box = document.getElementById('answer');
    if(!selectedFood || !box) return;
    box.classList.add('show');
    box.innerHTML = `<div class="row-title"><h3>${selectedFood.emoji} ${selectedFood.name}</h3><span>ثقة ${selectedFood.confidence}</span></div><p class="empty">${selectedFood.note}</p><div class="boxes"><div class="box main"><span>الكارب</span><b>${selectedFood.carbs} غ</b></div><div class="box"><span>السعرات</span><b>${selectedFood.calories}</b></div></div><button class="cta" id="addMeal" style="width:100%">أضف إلى الوجبة</button>`;
    document.getElementById('addMeal').onclick = () => { state.meal.push(selectedFood); save(); render(); };
  }
  function escapeHtml(str){ return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  boot();
})();
