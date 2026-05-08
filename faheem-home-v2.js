(() => {
  const STORAGE = 'faheem_final_state_v1';
  const root = document.querySelector('.app-shell');
  if (!root) return;

  const safeState = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE)) || { readings: [], meal: [] }; }
    catch { return { readings: [], meal: [] }; }
  };
  const todayReadings = () => {
    const s = safeState();
    const d = new Date();
    return (s.readings || []).filter(r => {
      const x = new Date(r.t);
      return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth() && x.getDate() === d.getDate();
    });
  };
  const avg = a => a.length ? Math.round(a.reduce((x, r) => x + r.v, 0) / a.length) : '--';
  const trend = a => {
    if (a.length < 2) return 'بانتظار';
    const d = a.at(-1).v - a.at(-2).v;
    if (d >= 15) return 'صاعد';
    if (d <= -15) return 'هابط';
    return 'مستقر';
  };

  function polishSplashOnce() {
    const splash = document.querySelector('.splash-card');
    if (!splash || splash.dataset.mintDone === '1') return;
    splash.dataset.mintDone = '1';
    splash.innerHTML = '<div class="splash-logo">🤖</div><div><span class="fm-logo-word">فهيم</span></div><p>تحليل أعمق ليومك ✨</p><div class="splash-panel"><strong>جاري تجهيز يومك...</strong><div class="progress"><span></span></div><div class="dots"><i></i><i></i><i></i></div></div><p style="margin-top:34px;color:#728188">كل خطوة صغيرة تقربك من حياة صحية أفضل 💚</p>';
  }

  function bindLocal() {
    document.querySelectorAll('[data-go]').forEach(btn => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const nav = document.querySelector('.nav-btn[data-page="' + btn.dataset.go + '"]');
        if (nav) nav.click();
      });
    });
  }

  function improveStaticCopy() {
    document.querySelectorAll('.brand-mini h1').forEach(el => { el.textContent = 'فهيم'; });
    document.querySelectorAll('.brand-mini p').forEach((el, idx) => {
      if (idx === 0) el.textContent = 'نحن هنا لنفهم سكر الدم والكارب معًا';
    });
    const pill = document.querySelector('.head-pill');
    if (pill) pill.textContent = '🔔';
  }

  function run() {
    polishSplashOnce();
    improveStaticCopy();
    bindLocal();
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(run, 120));
  setTimeout(run, 250);
  setTimeout(run, 900);
})();
