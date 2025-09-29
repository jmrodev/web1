document.addEventListener('DOMContentLoaded', () => {
  const hamburgerButton = document.querySelector('.hamburger-menu');
  const mainNav = document.getElementById('main-nav');

  if (hamburgerButton && mainNav) {
    hamburgerButton.addEventListener('click', () => {
      const expanded = hamburgerButton.getAttribute('aria-expanded') === 'true' || false;
      hamburgerButton.setAttribute('aria-expanded', !expanded);
      mainNav.classList.toggle('nav-open');
    });
  }
});