// Shoreline Harbour & Hotel — mobile menu toggle

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('nav[aria-label="Primary"]');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// Tapping any menu link closes the menu again
primaryNav.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});
