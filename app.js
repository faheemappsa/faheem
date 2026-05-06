const googleAnalyticsScript = document.createElement('script');
googleAnalyticsScript.async = true;
googleAnalyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-B20GWHW0NW';
document.head.appendChild(googleAnalyticsScript);

window.dataLayer = window.dataLayer || [];
function gtag(){
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-B20GWHW0NW');

const polishStylesheet = document.createElement('link');
polishStylesheet.rel = 'stylesheet';
polishStylesheet.href = 'styles-polish.css';
document.head.appendChild(polishStylesheet);

const navButtons = document.querySelectorAll('.nav-card, .bottom-nav-btn');
const sections = document.querySelectorAll('.content-section');

function activateSection(targetId) {
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
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activateSection(button.dataset.target);
  });
});
