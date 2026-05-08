(() => {
  function polish(){
    document.querySelectorAll('.brand-mini h1,.splash h1').forEach(el=>{ el.textContent='فهيم'; });
    document.querySelectorAll('.brand-mini p').forEach(el=>{ el.textContent='تحليل أعمق ليومك ✨'; });
    const splashLogo=document.querySelector('.splash-logo');
    if(splashLogo) splashLogo.textContent='🤖';
    const splashP=document.querySelector('.splash p');
    if(splashP) splashP.textContent='تحليل أعمق ليومك ✨';
    const splashPanel=document.querySelector('.splash-panel');
    if(!splashPanel){
      const card=document.querySelector('.splash-card');
      if(card){
        const panel=document.createElement('div');
        panel.className='splash-panel';
        panel.innerHTML='<strong>جاري تجهيز يومك...</strong><div class="progress"><span></span></div><div class="dots"><i></i><i></i><i></i></div>';
        card.appendChild(panel);
      }
    }
    document.querySelectorAll('.head-pill').forEach(el=>{ el.textContent='🔔'; });
  }
  const obs=new MutationObserver(polish);
  obs.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',polish);
  setTimeout(polish,50);
  setTimeout(polish,500);
})();
