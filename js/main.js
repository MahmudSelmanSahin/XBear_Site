/* ============================================
   XBear Event-Media — Main JavaScript
   v2.0 — Professional & Refined
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 600);
  });

  // Fallback
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 2500);


  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  let lastScrollY = 0;
  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Back to top
    backToTop.classList.toggle('visible', scrollY > 500);

    // Hide/show navbar on scroll
    if (scrollY > lastScrollY && scrollY > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = scrollY;
    updateActiveNavLink();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // back to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ===== HAMBURGER =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ===== ACTIVE NAV LINK =====
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = navLinks.querySelectorAll('a');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === `#${currentSection}`);
    });
  }


  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(element, target) {
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // smooth ease-out
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOut * target);

      element.textContent = currentValue.toLocaleString('tr-TR');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString('tr-TR');
      }
    }

    requestAnimationFrame(update);
  }


  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 0.8s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
      Gönderiliyor...
    `;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Başarıyla Gönderildi
      `;
      submitBtn.style.background = '#22c55e';
      submitBtn.style.borderColor = '#22c55e';
      submitBtn.style.opacity = '1';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 2500);
    }, 1200);
  });


  // ===== PARALLAX =====
  const heroImg = document.querySelector('.hero-bg img');

  if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `scale(${1.05 + scrollY * 0.0001}) translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }


  // ===== DRAG TO SCROLL (Gallery) =====
  document.querySelectorAll('.gallery-scroll').forEach(container => {
    let isPointerDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let dragDistance = 0;

    const stopDragging = () => {
      isPointerDown = false;
      container.classList.remove('dragging');
    };

    container.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      isPointerDown = true;
      dragDistance = 0;
      startX = e.clientX;
      scrollLeft = container.scrollLeft;
      container.classList.add('dragging');
    });

    container.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;

      const walk = (e.clientX - startX) * 1.5;
      dragDistance = Math.max(dragDistance, Math.abs(walk));

      if (dragDistance > 4) {
        e.preventDefault();
      }

      container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('pointerup', stopDragging);
    container.addEventListener('pointercancel', stopDragging);
    container.addEventListener('mouseleave', () => {
      if (isPointerDown) stopDragging();
    });

    // Swallow only the click that belongs to a drag gesture.
    container.addEventListener('click', (e) => {
      if (dragDistance > 6) {
        e.stopPropagation();
        e.preventDefault();
        dragDistance = 0;
      }
    }, true);
  });

  document.querySelectorAll('[data-lightbox="true"]').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item);
    });
  });

  document.querySelectorAll('.reel-card[data-reel-url]').forEach(card => {
    card.addEventListener('click', () => {
      openReelPopup(card.dataset.reelUrl, card.dataset.reelAccount);
    });
  });

});


// ===== LIGHTBOX =====
function openLightbox(item) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const imgSrc = item.querySelector('img').src;

  lightboxImg.src = imgSrc;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== REEL POPUP =====
function openReelPopup(reelUrl, account) {
  const overlay    = document.getElementById('reelPopupOverlay');
  const accountEl  = document.getElementById('reelAccountName');
  const igLink     = document.getElementById('reelOpenInstagram');
  const igLoginBtn = document.getElementById('reelIgLoginBtn');
  const body       = document.getElementById('reelPopupBody');

  // Update header info
  accountEl.textContent = account;
  igLink.href = reelUrl;
  igLoginBtn.href = reelUrl;

  // Clear previous embed content and create fresh blockquote
  body.innerHTML = `
    <div class="reel-popup-loading">
      <div class="reel-loading-spinner"></div>
      <span>Yükleniyor...</span>
    </div>
    <blockquote class="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink="${reelUrl}?utm_source=ig_embed"
      data-instgrm-version="14"
      style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:0; min-width:326px; padding:0; width:100%; max-width:540px;">
    </blockquote>
  `;

  // Show overlay
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Process Instagram embed
  setTimeout(() => {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
    // Hide loading spinner once iframe is rendered
    const checkEmbed = setInterval(() => {
      const iframe = body.querySelector('iframe');
      if (iframe) {
        const loadingEl = body.querySelector('.reel-popup-loading');
        if (loadingEl) loadingEl.style.display = 'none';
        clearInterval(checkEmbed);
      }
    }, 300);
    // Timeout fallback: hide loading after 5 seconds regardless
    setTimeout(() => {
      clearInterval(checkEmbed);
      const loadingEl = body.querySelector('.reel-popup-loading');
      if (loadingEl) loadingEl.style.display = 'none';
    }, 5000);
  }, 100);
}

function closeReelPopup(e) {
  // Allow close from overlay background click or close button (no event / button click)
  if (e && e.target && e.target !== document.getElementById('reelPopupOverlay')) return;
  
  const overlay = document.getElementById('reelPopupOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  // Reset body after close animation
  setTimeout(() => {
    const body = document.getElementById('reelPopupBody');
    if (body) {
      body.innerHTML = `
        <div class="reel-popup-loading">
          <div class="reel-loading-spinner"></div>
          <span>Yükleniyor...</span>
        </div>
      `;
    }
  }, 350);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    // Close reel popup too
    const overlay = document.getElementById('reelPopupOverlay');
    if (overlay && overlay.classList.contains('active')) {
      closeReelPopup();
    }
  }
});

