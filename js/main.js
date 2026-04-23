/* ============================================
   XBear Event-Media — Main JavaScript
   v2.0 — Professional & Refined
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== REELS (js/reels-data.js) =====
  // window.XBEAR_REELS üzerinden reel listesini doldurup etkileşimleri bağlar.
  hydrateReelsFromData();
  initGalleryInteractions();

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


  const reelPrevBtn = document.getElementById('reelPopupPrev');
  const reelNextBtn = document.getElementById('reelPopupNext');
  if (reelPrevBtn) reelPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateReel(-1); });
  if (reelNextBtn) reelNextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateReel(1); });

  const lightboxEl = document.getElementById('lightbox');
  const lightboxPrevBtn = document.getElementById('lightboxPrev');
  const lightboxNextBtn = document.getElementById('lightboxNext');
  const lightboxCloseBtn = document.getElementById('lightboxClose');
  const lightboxImgEl = document.getElementById('lightboxImg');

  if (lightboxEl) {
    // Sadece overlay (boş alan) tıklamasında kapansın.
    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) closeLightbox();
    });
  }
  if (lightboxImgEl) {
    lightboxImgEl.addEventListener('click', (e) => e.stopPropagation());
  }
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  }
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
  }
  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });
  }

});


// ===== GALLERY INTERACTIONS =====
// .gallery-scroll container'ları ve içindeki kartlar her yeniden doldurulduğunda
// yeniden bağlanabilmeli. Aynı container'a iki kez listener eklemeyi önlemek
// için container üzerine bir bayrak koyuyoruz.
function initGalleryInteractions() {
  document.querySelectorAll('.gallery-scroll').forEach(container => {
    if (container.dataset.interactionsReady === 'true') return;
    container.dataset.interactionsReady = 'true';

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

      if (dragDistance > 4) e.preventDefault();
      container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('pointerup', stopDragging);
    container.addEventListener('pointercancel', stopDragging);
    container.addEventListener('mouseleave', () => {
      if (isPointerDown) stopDragging();
    });

    // Drag sonrası gelen click'i yut, sadece gerçek click'i geçir.
    container.addEventListener('click', (e) => {
      if (dragDistance > 6) {
        e.stopPropagation();
        e.preventDefault();
        dragDistance = 0;
      }
    }, true);
  });

  document.querySelectorAll('[data-lightbox="true"]').forEach(item => {
    if (item.dataset.clickReady === 'true') return;
    item.dataset.clickReady = 'true';
    item.addEventListener('click', () => openLightbox(item));
  });

  document.querySelectorAll('.reel-card[data-reel-url]').forEach(card => {
    if (card.dataset.clickReady === 'true') return;
    card.dataset.clickReady = 'true';
    card.addEventListener('click', () => openReelPopupFromCard(card));
  });
}


// ===== REELS DATA HYDRATION =====
// js/reels-data.js içindeki window.XBEAR_REELS listesini DOM'a yazar.
function hydrateReelsFromData() {
  const data = window.XBEAR_REELS;
  if (!data) return;

  const bindings = {
    xbearevent: { containerId: 'reelsScrollEvent', badgeClass: '' },
    xbearmedia: { containerId: 'reelsScrollMedia', badgeClass: 'reel-badge--media' },
  };

  Object.entries(bindings).forEach(([username, mapping]) => {
    const list = Array.isArray(data[username]) ? data[username] : [];
    const el = document.getElementById(mapping.containerId);
    if (!el) return;
    if (!list.length) {
      el.innerHTML = '';
      return;
    }
    el.innerHTML = list
      .map(item => renderReelCard(item, username, mapping.badgeClass))
      .join('');
  });
}

function renderReelCard(item, username, badgeClass) {
  const url = item.url || item.permalink || '';
  const shortcode = extractReelShortcode(url);
  const title = escapeHtml(item.title || 'Reel');
  const account = `@${username}`;
  const accountAttr = escapeAttr(account);
  const permalink = escapeAttr(url);
  const thumbSrc = item.thumb || (shortcode ? `assets/images/reels/${username}_${shortcode}.jpg` : '');
  const thumbAttr = escapeAttr(thumbSrc);

  const thumbMarkup = thumbSrc
    ? `<img src="${thumbAttr}" alt="${title}" loading="lazy" onerror="this.closest('.reel-thumb').classList.add('reel-thumb--placeholder'); this.remove();">`
    : '';

  return `<div class="reel-card" data-reel-url="${permalink}" data-reel-account="${accountAttr}">
      <div class="reel-thumb${thumbSrc ? '' : ' reel-thumb--placeholder'}">
        ${thumbMarkup}
        <div class="reel-play-icon"><i class="ph-fill ph-play"></i></div>
        <div class="reel-badge ${badgeClass}">
          <i class="ph ph-instagram-logo"></i> ${account}
        </div>
      </div>
      <div class="reel-title">${title}</div>
    </div>`;
}

function extractReelShortcode(url) {
  if (!url) return '';
  const match = String(url).match(/\/(?:reel|p|tv)\/([^/?#]+)/i);
  return match ? match[1] : '';
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll('"', '&quot;');
}


// ===== LIGHTBOX =====
let lightboxPlaylist = [];
let lightboxIndex = -1;

function openLightbox(item) {
  const container = item.closest('.gallery-scroll');
  const items = container
    ? Array.from(container.querySelectorAll('[data-lightbox="true"]'))
    : [item];

  lightboxPlaylist = items.map(el => {
    const img = el.querySelector('img');
    const overlayText = el.querySelector('.gallery-scroll-overlay span');
    return {
      src: img ? img.src : '',
      title: overlayText ? overlayText.textContent.trim() : (img?.alt || ''),
    };
  });

  lightboxIndex = items.indexOf(item);
  if (lightboxIndex < 0) lightboxIndex = 0;

  renderLightbox(lightboxIndex, /* firstOpen */ true);
}

function navigateLightbox(direction) {
  if (!lightboxPlaylist.length) return;
  const total = lightboxPlaylist.length;
  lightboxIndex = (lightboxIndex + direction + total) % total;
  renderLightbox(lightboxIndex, /* firstOpen */ false);
}

function renderLightbox(index, firstOpen) {
  const entry = lightboxPlaylist[index];
  if (!entry) return;

  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const counterEl = document.getElementById('lightboxCounter');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  const swap = () => {
    img.src = entry.src;
    img.alt = entry.title || 'Galeri görseli';
    if (titleEl) titleEl.textContent = entry.title || '';
    if (counterEl) {
      counterEl.textContent = lightboxPlaylist.length > 1
        ? `${index + 1} / ${lightboxPlaylist.length}`
        : '';
    }
    requestAnimationFrame(() => img.classList.remove('is-swapping'));
  };

  if (firstOpen) {
    img.classList.remove('is-swapping');
    swap();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    img.classList.add('is-swapping');
    setTimeout(swap, 150);
  }

  if (prevBtn && nextBtn) {
    const multiple = lightboxPlaylist.length > 1;
    prevBtn.style.display = multiple ? '' : 'none';
    nextBtn.style.display = multiple ? '' : 'none';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    lightboxPlaylist = [];
    lightboxIndex = -1;
  }, 350);
}

// ===== REEL POPUP =====
let reelPlaylist = [];
let reelPlaylistIndex = -1;

function openReelPopupFromCard(card) {
  const container = card.closest('.gallery-scroll--reels');
  reelPlaylist = container
    ? Array.from(container.querySelectorAll('.reel-card[data-reel-url]')).map(el => ({
        url: el.dataset.reelUrl,
        account: el.dataset.reelAccount,
      }))
    : [{ url: card.dataset.reelUrl, account: card.dataset.reelAccount }];

  reelPlaylistIndex = reelPlaylist.findIndex(item => item.url === card.dataset.reelUrl);
  if (reelPlaylistIndex < 0) reelPlaylistIndex = 0;

  renderReel(reelPlaylistIndex, /* firstOpen */ true);
}

function navigateReel(direction) {
  if (!reelPlaylist.length) return;
  const total = reelPlaylist.length;
  reelPlaylistIndex = (reelPlaylistIndex + direction + total) % total;
  renderReel(reelPlaylistIndex, /* firstOpen */ false);
}

function renderReel(index, firstOpen) {
  const item = reelPlaylist[index];
  if (!item) return;

  const overlay    = document.getElementById('reelPopupOverlay');
  const accountEl  = document.getElementById('reelAccountName');
  const counterEl  = document.getElementById('reelPopupCounter');
  const igLink     = document.getElementById('reelOpenInstagram');
  const igLoginBtn = document.getElementById('reelIgLoginBtn');
  const body       = document.getElementById('reelPopupBody');
  const prevBtn    = document.getElementById('reelPopupPrev');
  const nextBtn    = document.getElementById('reelPopupNext');

  accountEl.textContent = item.account;
  if (counterEl) {
    counterEl.textContent = reelPlaylist.length > 1
      ? `${index + 1} / ${reelPlaylist.length}`
      : '';
  }
  igLink.href = item.url;
  igLoginBtn.href = item.url;

  if (prevBtn && nextBtn) {
    const multiple = reelPlaylist.length > 1;
    prevBtn.style.display = multiple ? '' : 'none';
    nextBtn.style.display = multiple ? '' : 'none';
  }

  body.innerHTML = `
    ${reelLoadingSkeleton()}
    <blockquote class="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink="${item.url}?utm_source=ig_embed"
      data-instgrm-version="14"
      style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:0; min-width:326px; padding:0; width:100%; max-width:540px;">
    </blockquote>
  `;

  if (firstOpen) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  setTimeout(() => {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
    const checkEmbed = setInterval(() => {
      const iframe = body.querySelector('iframe');
      if (iframe) {
        const loadingEl = body.querySelector('.reel-popup-loading');
        if (loadingEl) loadingEl.style.display = 'none';
        clearInterval(checkEmbed);
      }
    }, 300);
    setTimeout(() => {
      clearInterval(checkEmbed);
      const loadingEl = body.querySelector('.reel-popup-loading');
      if (loadingEl) loadingEl.style.display = 'none';
    }, 5000);
  }, 100);
}

// Backwards-compatible wrapper (still callable from inline handlers if any remain)
function openReelPopup(reelUrl, account) {
  reelPlaylist = [{ url: reelUrl, account: account }];
  reelPlaylistIndex = 0;
  renderReel(0, true);
}

function closeReelPopup(e) {
  if (e && e.target && e.target !== document.getElementById('reelPopupOverlay')) return;

  const overlay = document.getElementById('reelPopupOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    const body = document.getElementById('reelPopupBody');
    if (body) body.innerHTML = reelLoadingSkeleton();
    reelPlaylist = [];
    reelPlaylistIndex = -1;
  }, 350);
}

function reelLoadingSkeleton() {
  return `
    <div class="reel-popup-loading" aria-label="Yükleniyor">
      <div class="reel-skeleton">
        <div class="reel-skeleton-header">
          <div class="reel-skeleton-avatar"></div>
          <div class="reel-skeleton-text">
            <div class="reel-skeleton-line is-short"></div>
            <div class="reel-skeleton-line is-shorter"></div>
          </div>
        </div>
        <div class="reel-skeleton-media"></div>
        <div class="reel-skeleton-actions">
          <div class="reel-skeleton-icon"></div>
          <div class="reel-skeleton-icon"></div>
          <div class="reel-skeleton-icon"></div>
        </div>
        <div class="reel-skeleton-line is-medium"></div>
        <div class="reel-skeleton-line"></div>
      </div>
    </div>
  `;
}

document.addEventListener('keydown', (e) => {
  const reelOverlay = document.getElementById('reelPopupOverlay');
  const lightboxEl  = document.getElementById('lightbox');
  const reelOpen      = reelOverlay && reelOverlay.classList.contains('active');
  const lightboxOpen  = lightboxEl && lightboxEl.classList.contains('active');

  if (e.key === 'Escape') {
    if (lightboxOpen) closeLightbox();
    if (reelOpen) closeReelPopup();
    return;
  }

  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const direction = e.key === 'ArrowRight' ? 1 : -1;
    if (reelOpen) {
      e.preventDefault();
      navigateReel(direction);
    } else if (lightboxOpen) {
      e.preventDefault();
      navigateLightbox(direction);
    }
  }
});

// Swipe navigation on touch devices inside the popup overlay & lightbox
(function enableSwipeNavigation() {
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let target = null;  // 'reel' | 'lightbox'

  document.addEventListener('touchstart', (e) => {
    const reelOverlay = document.getElementById('reelPopupOverlay');
    const lightboxEl = document.getElementById('lightbox');

    if (reelOverlay && reelOverlay.classList.contains('active') && reelOverlay.contains(e.target)) {
      // Ignore swipes starting inside the embed iframe/body (let native scroll work)
      const body = document.getElementById('reelPopupBody');
      if (body && body.contains(e.target)) return;
      target = 'reel';
    } else if (lightboxEl && lightboxEl.classList.contains('active') && lightboxEl.contains(e.target)) {
      target = 'lightbox';
    } else {
      return;
    }

    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;

    const endTouch = e.changedTouches[0];
    const dx = endTouch.clientX - startX;
    const dy = endTouch.clientY - startY;

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      const direction = dx < 0 ? 1 : -1;
      if (target === 'reel') navigateReel(direction);
      else if (target === 'lightbox') navigateLightbox(direction);
    }
  });
})();

