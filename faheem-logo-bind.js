(() => {
  const logoPath = 'assets/faheem-logo.svg';
  function setLogo(){
    document.querySelectorAll('.splash h1, .splash .fm-logo-word, .brand-mini h1').forEach(el => {
      if (el.dataset.logoBound === '1') return;
      el.dataset.logoBound = '1';
      el.textContent = '';
      const img = document.createElement('img');
      img.src = logoPath;
      img.alt = 'فهيم';
      img.className = 'faheem-logo-img';
      el.appendChild(img);
    });
    document.querySelectorAll('.splash-logo,.brand-mini .logo').forEach(el => { el.style.display = 'none'; });
  }
  const style = document.createElement('style');
  style.textContent = '.faheem-logo-img{display:block;width:100%;height:100%;object-fit:contain}.brand-mini h1{width:150px!important;height:52px!important;line-height:0!important}.splash h1,.splash .fm-logo-word{width:min(310px,76vw)!important;height:94px!important;line-height:0!important}.brand-mini h1:before,.brand-mini h1:after,.splash h1:before,.splash h1:after,.splash .fm-logo-word:before,.splash .fm-logo-word:after{display:none!important}';
  document.head.appendChild(style);
  const obs = new MutationObserver(setLogo);
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',setLogo);
  setTimeout(setLogo,80);
  setTimeout(setLogo,500);
  setTimeout(setLogo,1000);
})();
