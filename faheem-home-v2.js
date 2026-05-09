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

  function logoImg(className) {
    return '<img class="' + className + '" src="assets/faheem-logo.svg" alt="فهيم" />';
  }

  function polishSplashOnce() {
    const splash = document.querySelector('.splash-card');
    if (!splash || splash.dataset.mintDone === '1') return;
    splash.dataset.mintDone = '1';
    splash.innerHTML = '<div class="fm-logo-holder fm-logo-splash">' + logoImg('faheem-logo-img') + '</div><p>تحليل أعمق ليومك ✨</p><div class="splash-panel"><strong>جاري تجهيز يومك...</strong><div class="progress"><span></span></div><div class="dots"><i></i><i></i><i></i></div></div><p style="margin-top:34px;color:#728188">كل خطوة صغيرة تقربك من حياة صحية أفضل 💚</p>';
  }

  function bindLogo() {
    document.querySelectorAll('.brand-mini h1').forEach(el => {
      if (el.dataset.logoDone === '1') return;
      el.dataset.logoDone = '1';
      el.innerHTML = logoImg('faheem-logo-img');
      el.classList.add('fm-logo-header');
    });
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
    bindLogo();
    document.querySelectorAll('.brand-mini p').forEach((el, idx) => {
      if (idx === 0) el.textContent = 'نحن هنا لنفهم سكر الدم والكارب معًا';
    });
    const pill = document.querySelector('.head-pill');
    if (pill) pill.textContent = '🔔';
  }

  function installLogoStyle() {
    if (document.getElementById('faheem-logo-style')) return;
    const st = document.createElement('style');
    st.id = 'faheem-logo-style';
    st.textContent = '.splash-logo{display:none!important}.fm-logo-holder{display:flex;justify-content:center;align-items:center}.fm-logo-splash{width:min(310px,76vw);height:96px;margin:0 auto 10px}.fm-logo-header{display:block!important;width:154px!important;height:54px!important;margin:0 auto!important;line-height:0!important}.faheem-logo-img{display:block;width:100%;height:100%;object-fit:contain}.brand-mini h1:before,.brand-mini h1:after,.splash h1:before,.splash h1:after,.splash .fm-logo-word:before,.splash .fm-logo-word:after{display:none!important}.brand-mini .logo{display:none!important}';
    document.head.appendChild(st);
  }

  function run() {
    installLogoStyle();
    polishSplashOnce();
    improveStaticCopy();
    bindLocal();
  }

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => setTimeout(run, 120));
  setTimeout(run, 250);
  setTimeout(run, 900);
})();
