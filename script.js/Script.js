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

// Scroll progress bar — fills as the visitor scrolls down the page
const progressBar = document.getElementById('scroll-progress');

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = percent + '%';
}

// Back to top button — appears after scrolling down 400px
const backToTopButton = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
}

window.addEventListener('scroll', () => {
  updateProgressBar();
  toggleBackToTop();
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
