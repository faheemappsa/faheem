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
