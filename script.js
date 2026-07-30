// Shoreline Harbour & Hotel — mobile menu toggle

// ---------------------------------------------------------------
// Hero photo slideshow — crossfades every 5s (paused if the visitor
// has requested reduced motion)
// ---------------------------------------------------------------

const heroSlides = document.querySelectorAll('.hero-slide');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroSlides.length > 1 && !prefersReducedMotion) {
  let currentSlide = 0;
  setInterval(() => {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }, 5000);
}

// ---------------------------------------------------------------
// Scroll-reveal — fade + lift elements into place the first time
// they enter the viewport
// ---------------------------------------------------------------

const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }
}

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

// ---------------------------------------------------------------
// Room "Book Now" buttons — prefill the booking form's room select
// (used on index.html's own room cards)
// ---------------------------------------------------------------

const bookingRoomSelect = document.getElementById('booking-room');

document.querySelectorAll('.book-room-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (bookingRoomSelect) {
      bookingRoomSelect.value = btn.dataset.room;
    }
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Prefill the room select when arriving from rooms.html, e.g.
// index.html?room=Junior%20Suite#events
if (bookingRoomSelect) {
  const params = new URLSearchParams(window.location.search);
  const requestedRoom = params.get('room');
  if (requestedRoom) {
    bookingRoomSelect.value = requestedRoom;
  }
}

// ---------------------------------------------------------------
// Booking form — client-side validation + confirmation message
// ---------------------------------------------------------------

const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
  const confirmationBox = document.getElementById('booking-confirmation');

  const setError = (fieldId, message) => {
    const errorEl = bookingForm.querySelector(`[data-error-for="${fieldId}"]`);
    if (errorEl) errorEl.textContent = message;
  };

  const clearErrors = () => {
    bookingForm.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
    });
  };

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();
    confirmationBox.classList.remove('visible');

    const name = bookingForm.name.value.trim();
    const email = bookingForm.email.value.trim();
    const checkin = bookingForm.checkin.value;
    const checkout = bookingForm.checkout.value;
    const guests = bookingForm.guests.value;
    const room = bookingForm.room.value;

    let firstInvalid = null;

    if (!name) {
      setError('booking-name', 'Please enter your name.');
      firstInvalid = firstInvalid || 'booking-name';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      setError('booking-email', 'Please enter a valid email address.');
      firstInvalid = firstInvalid || 'booking-email';
    }

    if (!checkin) {
      setError('booking-checkin', 'Please choose a check-in date.');
      firstInvalid = firstInvalid || 'booking-checkin';
    }

    if (!checkout) {
      setError('booking-checkout', 'Please choose a check-out date.');
      firstInvalid = firstInvalid || 'booking-checkout';
    } else if (checkin && checkout <= checkin) {
      setError('booking-checkout', 'Check-out must be after check-in.');
      firstInvalid = firstInvalid || 'booking-checkout';
    }

    if (firstInvalid) {
      document.getElementById(firstInvalid).focus();
      return;
    }

    confirmationBox.textContent =
      `Thank you, ${name} — your request for the ${room} (${guests} guest${guests === '1' ? '' : 's'}) ` +
      `from ${checkin} to ${checkout} has been received. A confirmation will be sent to ${email} shortly.`;
    confirmationBox.classList.add('visible');
    bookingForm.reset();
    if (room) bookingRoomSelect.value = room;
    confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// ---------------------------------------------------------------
// Gallery lightbox (gallery.html)
// ---------------------------------------------------------------

const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      lightboxImage.src = item.dataset.full;
      lightboxImage.alt = item.getAttribute('aria-label') || '';
      lightbox.classList.add('open');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightboxImage.src = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}
