// Shoreline Harbour & Hotel — mobile menu toggle

// ---------------------------------------------------------------
// Hero photo slideshow — crossfades every 4s, with manual arrows/dots,
// pause-on-hover and pause-on-focus. Always auto-advances (the zoom
// effect backs off under prefers-reduced-motion via CSS, but the
// rotation itself keeps going rather than freezing on one photo).
// ---------------------------------------------------------------

const heroSlides = document.querySelectorAll('.hero-slide');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroSlides.length > 1) {
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrev = document.querySelector('.hero-arrow-prev');
  const heroNext = document.querySelector('.hero-arrow-next');
  const heroControls = document.querySelector('.hero-controls');
  const heroSection = document.getElementById('hero');

  let currentSlide = 0;
  let heroTimer = null;

  const goToSlide = (index) => {
    heroSlides[currentSlide].classList.remove('active');
    heroDots[currentSlide]?.classList.remove('active');
    heroDots[currentSlide]?.setAttribute('aria-selected', 'false');

    currentSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide]?.classList.add('active');
    heroDots[currentSlide]?.setAttribute('aria-selected', 'true');
  };

  const stopHeroTimer = () => {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = null;
  };

  const startHeroTimer = () => {
    stopHeroTimer();
    heroTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
  };

  heroNext?.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    startHeroTimer();
  });

  heroPrev?.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    startHeroTimer();
  });

  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startHeroTimer();
    });
  });

  heroSection?.addEventListener('mouseenter', stopHeroTimer);
  heroSection?.addEventListener('mouseleave', startHeroTimer);
  heroControls?.addEventListener('focusin', stopHeroTimer);
  heroControls?.addEventListener('focusout', startHeroTimer);

  startHeroTimer();
}

// ---------------------------------------------------------------
// Testimonials carousel — single-card crossfade, auto-advances every
// 6s (offset from the hero's 4s so they don't move in lockstep)
// ---------------------------------------------------------------

const testimonialTrack = document.querySelector('.testimonial-track');

if (testimonialTrack) {
  const testimonialCards = testimonialTrack.querySelectorAll('.testimonial-card');
  const testimonialControls = document.querySelector('.testimonial-controls');
  const testimonialDots = testimonialControls?.querySelectorAll('.carousel-dot') ?? [];
  const testimonialPrev = testimonialControls?.querySelector('.carousel-prev');
  const testimonialNext = testimonialControls?.querySelector('.carousel-next');

  let currentTestimonial = 0;
  let testimonialTimer = null;

  const setTrackHeight = () => {
    const active = testimonialCards[currentTestimonial];
    if (active) testimonialTrack.style.height = `${active.scrollHeight}px`;
  };

  const goToTestimonial = (index) => {
    testimonialCards[currentTestimonial].classList.remove('active');
    testimonialDots[currentTestimonial]?.classList.remove('active');
    testimonialDots[currentTestimonial]?.setAttribute('aria-selected', 'false');

    currentTestimonial = (index + testimonialCards.length) % testimonialCards.length;

    testimonialCards[currentTestimonial].classList.add('active');
    testimonialDots[currentTestimonial]?.classList.add('active');
    testimonialDots[currentTestimonial]?.setAttribute('aria-selected', 'true');
    setTrackHeight();
  };

  const stopTestimonialTimer = () => {
    if (testimonialTimer) clearInterval(testimonialTimer);
    testimonialTimer = null;
  };

  const startTestimonialTimer = () => {
    stopTestimonialTimer();
    testimonialTimer = setInterval(() => goToTestimonial(currentTestimonial + 1), 6000);
  };

  testimonialNext?.addEventListener('click', () => {
    goToTestimonial(currentTestimonial + 1);
    startTestimonialTimer();
  });

  testimonialPrev?.addEventListener('click', () => {
    goToTestimonial(currentTestimonial - 1);
    startTestimonialTimer();
  });

  testimonialDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToTestimonial(i);
      startTestimonialTimer();
    });
  });

  testimonialTrack.addEventListener('mouseenter', stopTestimonialTimer);
  testimonialTrack.addEventListener('mouseleave', startTestimonialTimer);
  testimonialControls?.addEventListener('focusin', stopTestimonialTimer);
  testimonialControls?.addEventListener('focusout', startTestimonialTimer);

  window.addEventListener('resize', setTrackHeight);
  window.addEventListener('load', setTrackHeight);

  setTrackHeight();
  startTestimonialTimer();
}

// ---------------------------------------------------------------
// Header scroll behavior — starts blended over the hero, solidifies
// to navy with a shadow once the page scrolls
// ---------------------------------------------------------------

const siteHeader = document.querySelector('header');

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();
}

// ---------------------------------------------------------------
// Scroll-spy nav — highlights whichever nav link's target section is
// currently in view. Only links that resolve to an element actually
// present on this page are watched (cross-page anchors are skipped).
// ---------------------------------------------------------------

const spySections = [];

document.querySelectorAll('.nav-links a').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;
  const hash = new URL(href, window.location.href).hash;
  if (!hash) return;
  const target = document.getElementById(hash.slice(1));
  if (target) spySections.push({ link, target });
});

if (spySections.length && 'IntersectionObserver' in window) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        spySections.forEach(({ link }) => link.classList.remove('nav-active'));
        spySections
          .filter(({ target }) => target === entry.target)
          .forEach(({ link }) => link.classList.add('nav-active'));
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );
  spySections.forEach(({ target }) => spyObserver.observe(target));
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
// Room card quick-view — click-to-expand amenities list, works
// identically on desktop (click) and mobile/touch (tap)
// ---------------------------------------------------------------

document.querySelectorAll('.quick-view-toggle').forEach((toggle) => {
  const amenities = toggle.nextElementSibling;
  toggle.addEventListener('click', () => {
    const isOpen = amenities.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
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
      bookingRoomSelect.dispatchEvent(new Event('change'));
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
    // Deferred: the booking-form's 'change' listener (further down this
    // file) isn't registered yet during this initial synchronous pass.
    setTimeout(() => bookingRoomSelect.dispatchEvent(new Event('change')), 0);
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

  // --- Guest stepper ---

  const guestInput = document.getElementById('booking-guests');
  const guestDecrease = bookingForm.querySelector('.stepper-decrease');
  const guestIncrease = bookingForm.querySelector('.stepper-increase');
  const MIN_GUESTS = 1;
  const MAX_GUESTS = 8;

  const updateGuestButtons = () => {
    if (!guestInput) return;
    const value = parseInt(guestInput.value, 10);
    if (guestDecrease) guestDecrease.disabled = value <= MIN_GUESTS;
    if (guestIncrease) guestIncrease.disabled = value >= MAX_GUESTS;
  };

  guestDecrease?.addEventListener('click', () => {
    guestInput.value = Math.max(MIN_GUESTS, parseInt(guestInput.value, 10) - 1);
    updateGuestButtons();
  });

  guestIncrease?.addEventListener('click', () => {
    guestInput.value = Math.min(MAX_GUESTS, parseInt(guestInput.value, 10) + 1);
    updateGuestButtons();
  });

  updateGuestButtons();

  // --- Live price summary ---

  const ROOM_RATES = {
    'Deluxe King Room': 420,
    'Junior Suite': 680,
    'Penthouse Suite': 1800,
  };

  const summaryDetail = document.getElementById('booking-summary-detail');
  const summaryTotal = document.getElementById('booking-summary-total');

  const calcNights = () => {
    const checkin = bookingForm.checkin.value;
    const checkout = bookingForm.checkout.value;
    if (!checkin || !checkout || checkout <= checkin) return null;
    return Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
  };

  const updateBookingSummary = () => {
    if (!summaryDetail || !summaryTotal) return;
    const room = bookingForm.room.value;
    const rate = ROOM_RATES[room];
    const nights = calcNights();

    if (!nights) {
      summaryDetail.textContent = 'Select your check-in and check-out dates to see a total.';
      summaryTotal.textContent = '';
      return;
    }

    const total = nights * rate;
    summaryDetail.textContent =
      `${nights} night${nights === 1 ? '' : 's'} × ${room} ($${rate.toLocaleString()}/night)`;
    summaryTotal.textContent = `$${total.toLocaleString()} total`;
  };

  bookingForm.checkin.addEventListener('change', updateBookingSummary);
  bookingForm.checkout.addEventListener('change', updateBookingSummary);
  bookingForm.room.addEventListener('change', updateBookingSummary);
  updateBookingSummary();

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

    const nights = calcNights();
    const rate = ROOM_RATES[room];
    const totalText = nights ? ` Estimated total: $${(nights * rate).toLocaleString()}.` : '';

    confirmationBox.textContent =
      `Thank you, ${name} — your request for the ${room} (${guests} guest${guests === '1' ? '' : 's'}) ` +
      `from ${checkin} to ${checkout} has been received.${totalText} A confirmation will be sent to ${email} shortly.`;
    confirmationBox.classList.add('visible');
    bookingForm.reset();
    if (room) bookingRoomSelect.value = room;
    updateGuestButtons();
    updateBookingSummary();
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
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  let currentIndex = 0;

  const showImage = (index) => {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.getAttribute('aria-label') || '';
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showImage(index);
      lightbox.classList.add('open');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightboxImage.src = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext?.addEventListener('click', () => showImage(currentIndex + 1));
  lightboxPrev?.addEventListener('click', () => showImage(currentIndex - 1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
  });

  // Swipe support for touch devices
  let touchStartX = 0;

  lightbox.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      showImage(deltaX < 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });
}
