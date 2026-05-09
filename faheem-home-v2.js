(() => {
  const root = document.querySelector('.app-shell');
  if (!root) return;

  function logoImg(className) {
    return '<img class="' + className + '" src="assets/faheem-logo.svg" alt="فهيم" />';
  }

  function installLogoStyle() {
    if (document.getElementById('faheem-logo-style')) return;
    const st = document.createElement('style');
    st.id = 'faheem-logo-style';
    st.textContent = '.splash-logo{display:none!important}.fm-logo-holder{display:flex;justify-content:center;align-items:center}.fm-logo-splash{width:min(310px,76vw);height:96px;margin:0 auto 10px}.fm-logo-header{display:block!important;width:154px!important;height:54px!important;margin:0 auto!important;line-height:0!important}.faheem-logo-img{display:block;width:100%;height:100%;object-fit:contain}.brand-mini h1:before,.brand-mini h1:after,.splash h1:before,.splash h1:after,.splash .fm-logo-word:before,.splash .fm-logo-word:after{display:none!important}.brand-mini .logo{display:none!important}';
    document.head.appendChild(st);
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

  function improveStaticCopy() {
    bindLogo();
    document.querySelectorAll('.brand-mini p').forEach((el, idx) => {
      const next = idx === 0 ? 'نحن هنا لنفهم سكر الدم والكارب معًا' : el.textContent;
      if (el.textContent !== next) el.textContent = next;
    });
    const pill = document.querySelector('.head-pill');
    if (pill && pill.textContent !== '🔔') pill.textContent = '🔔';
  }

  function bindLocal() {
    document.querySelectorAll('[data-go]').forEach(btn => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const nav = document.querySelector('.nav-btn[data-page="' + btn.dataset.go + '"]');
        if (nav) nav.click();
        window.setTimeout(run, 60);
      });
    });
  }

  function run() {
    installLogoStyle();
    polishSplashOnce();
    improveStaticCopy();
    bindLocal();
  }

  document.addEventListener('DOMContentLoaded', () => window.setTimeout(run, 80));
  window.setTimeout(run, 120);
  window.setTimeout(run, 500);
  window.setTimeout(run, 1000);
  document.addEventListener('click', () => window.setTimeout(run, 80), true);
})();
