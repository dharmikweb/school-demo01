/* ==========================================================
   EVERGREEN INTERNATIONAL SCHOOL — SCRIPT
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('done'), 350);
  });
  // Fallback in case 'load' fires slowly on slow connections
  setTimeout(() => preloader && preloader.classList.add('done'), 2500);

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
      if (window.scrollY > 600) backBtn.classList.add('show');
      else backBtn.classList.remove('show');
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Hero stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  if (statNums.length) {
    if ('IntersectionObserver' in window) {
      const statIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statNums.forEach(el => statIo.observe(el));
    } else {
      statNums.forEach(animateCount);
    }
  }

  /* ---------- Academic tabs ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
      tabPanels.forEach(p => p.classList.toggle('active', p.getAttribute('data-panel') === target));
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const galleryImgs = Array.from(document.querySelectorAll('#galleryGrid img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const img = galleryImgs[currentIndex];
    lightboxImg.src = img.getAttribute('data-full') || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  const showRelative = (dir) => {
    currentIndex = (currentIndex + dir + galleryImgs.length) % galleryImgs.length;
    const img = galleryImgs[currentIndex];
    lightboxImg.src = img.getAttribute('data-full') || img.src;
    lightboxImg.alt = img.alt;
  };

  galleryImgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showRelative(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showRelative(1));
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showRelative(1);
    if (e.key === 'ArrowLeft') showRelative(-1);
  });

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (track && dotsWrap) {
    const slides = Array.from(track.children);
    let active = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      active = index;
      track.style.transform = `translateX(-${active * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === active));
    }
    function next() { goTo((active + 1) % slides.length); }

    function startAuto() {
      timer = setInterval(next, 5500);
    }
    function stopAuto() {
      if (timer) clearInterval(timer);
    }
    startAuto();
    track.parentElement.addEventListener('mouseenter', stopAuto);
    track.parentElement.addEventListener('mouseleave', startAuto);
  }

  /* ---------- Contact form validation ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const setError = (fieldName, message) => {
    const input = contactForm.querySelector(`[name="${fieldName}"]`);
    const errorSpan = contactForm.querySelector(`.error-msg[data-for="${fieldName}"]`);
    const fieldWrap = input ? input.closest('.field') : null;
    if (errorSpan) errorSpan.textContent = message || '';
    if (fieldWrap) fieldWrap.classList.toggle('error', Boolean(message));
  };

  const validateContactForm = () => {
    let valid = true;
    const fname = contactForm.querySelector('[name="fname"]').value.trim();
    const phone = contactForm.querySelector('[name="phone"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const grade = contactForm.querySelector('[name="grade"]').value;
    const childname = contactForm.querySelector('[name="childname"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();

    if (fname.length < 2) { setError('fname', 'Please enter your full name.'); valid = false; }
    else setError('fname', '');

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) { setError('phone', 'Enter a valid 10-digit phone number.'); valid = false; }
    else setError('phone', '');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { setError('email', 'Enter a valid email address.'); valid = false; }
    else setError('email', '');

    if (!grade) { setError('grade', 'Please select a grade.'); valid = false; }
    else setError('grade', '');

    if (childname.length < 2) { setError('childname', "Please enter your child's name."); valid = false; }
    else setError('childname', '');

    if (message.length < 10) { setError('message', 'Please add a few more details (min. 10 characters).'); valid = false; }
    else setError('message', '');

    return valid;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isValid = validateContactForm();
      if (isValid) {
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      } else {
        formSuccess.classList.remove('show');
        const firstError = contactForm.querySelector('.field.error input, .field.error select, .field.error textarea');
        if (firstError) firstError.focus();
      }
    });

    contactForm.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => {
        const wrap = el.closest('.field');
        if (wrap && wrap.classList.contains('error')) {
          wrap.classList.remove('error');
          const span = wrap.querySelector('.error-msg');
          if (span) span.textContent = '';
        }
      });
    });
  }

  /* ---------- Newsletter form ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (input && emailPattern.test(input.value.trim())) {
        newsletterMsg.textContent = "You're subscribed. Thank you!";
        newsletterForm.reset();
      } else {
        newsletterMsg.textContent = 'Please enter a valid email address.';
      }
      setTimeout(() => { newsletterMsg.textContent = ''; }, 5000);
    });
  }

  /* ---------- Graceful image fallback ---------- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function handler() {
      this.removeEventListener('error', handler);
      this.style.background = 'linear-gradient(135deg, #1B4332, #2D6A4F)';
      this.style.minHeight = '200px';
      this.setAttribute('data-fallback', 'true');
    }, { once: true });
  });

});
