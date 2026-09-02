/* ============================================
   XBear Event-Media — Main JavaScript
   v2.0 — Professional & Refined
   ============================================ */

// ===== IMMEDIATE THEME INIT =====
(function initTheme() {
  const savedTheme = localStorage.getItem('xbear_theme') || 'slate';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {

  // ===== THEME SWITCHER =====
  setupThemeSwitcher();

  // ===== REELS (js/reels-data.js) =====
  // window.XBEAR_REELS üzerinden reel listesini doldurup etkileşimleri bağlar.
  hydrateReelsFromData();
  initGalleryInteractions();
  ensureAboutVideoPlayback();
  initHoverVideos();
  initDotsNav();
  initReelPopupFill();

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
  let lastScrollY = 0;
  let ticking = false;

  const MOBILE_NAV_BREAKPOINT = 1080;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Hide/show navbar on scroll (desktop only). On mobile the hamburger
    // lives inside .navbar, and any non-"none" transform on .navbar (even
    // translateY(0)) makes it the containing block for its position:fixed
    // .nav-links child, breaking the fullscreen mobile menu overlay — and
    // while hidden the hamburger itself is scrolled off-screen and
    // unreachable. So never auto-hide the bar below the mobile breakpoint,
    // or while the mobile menu is open.
    const isMobileNav = window.innerWidth <= MOBILE_NAV_BREAKPOINT;
    const scrollingDown = !isMobileNav && !navLinks.classList.contains('open') &&
      scrollY > lastScrollY && scrollY > 200;
    navbar.classList.toggle('nav-hidden', scrollingDown);

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

  window.addEventListener('resize', () => {
    if (window.innerWidth <= MOBILE_NAV_BREAKPOINT) {
      navbar.classList.remove('nav-hidden');
    }
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
      const href = item.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      item.classList.toggle('active', href === `#${currentSection}`);
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

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      const recipientEmail = (contactForm.dataset.recipientEmail || '').trim();

      if (!recipientEmail || !recipientEmail.includes('@')) {
        alert("Form gönderimi için önce form üzerindeki data-recipient-email alanına hedef e-posta adresini yazın.");
        return;
      }

      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 0.8s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
        Gönderiliyor...
      `;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      try {
        const formData = new FormData(contactForm);
        formData.append('_subject', 'XBear Site - Yeni Teklif Formu');
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');

        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.message || 'Mail gönderilemedi');
        }

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
      } catch (err) {
        submitBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Gönderilemedi
        `;
        submitBtn.style.background = '#ef4444';
        submitBtn.style.borderColor = '#ef4444';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
        }, 2800);
        console.error('[contact-form]', err);
      }
    });
  }


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

    let pointerId = null;
    container.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      isPointerDown = true;
      dragDistance = 0;
      startX = e.clientX;
      scrollLeft = container.scrollLeft;
      pointerId = e.pointerId;
      container.classList.add('dragging');
    });

    container.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;

      const walk = (e.clientX - startX) * 1.5;
      dragDistance = Math.max(dragDistance, Math.abs(walk));

      if (dragDistance > 4) {
        e.preventDefault();
        // Kartın click'ini bozmadan sürüklemeyi kilitle: sadece gerçek sürüklemede capture et.
        if (pointerId !== null && !container.hasPointerCapture(pointerId)) {
          try { container.setPointerCapture(pointerId); } catch (err) {}
        }
      }
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

  document.querySelectorAll('[data-reel-url], [data-reel-src]').forEach(card => {
    if (card.dataset.clickReady === 'true') return;
    card.dataset.clickReady = 'true';
    card.addEventListener('click', () => openReelPopupFromCard(card));
  });

  syncReelPreviewFrames();
}

function initHoverVideos() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    document.querySelectorAll('[data-hover-video]').forEach(el => {
      const video = el.querySelector('video');
      if (!video) return;
      el.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
      el.addEventListener('mouseleave', () => {
        if (!el.dataset.inviewPlaying) video.pause();
      });
    });
  }

  document.querySelectorAll('.media-showreel-stage[data-reel-matrix="90cw"]').forEach(stage => {
    const video = stage.querySelector('video');
    bindMatrix90cwRotation(video, {
      onPortrait: () => {
        stage.classList.remove('media-showreel-stage--rotate180');
        stage.classList.add('media-showreel-stage--rotate90');
      },
      onApplied: () => {
        stage.classList.remove('media-showreel-stage--rotate90', 'media-showreel-stage--rotate180');
      },
    });
  });

  const inviewEls = document.querySelectorAll('[data-inview-video]');
  if (!inviewEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (!video) return;
      if (entry.isIntersecting && !reduceMotion) {
        entry.target.dataset.inviewPlaying = '1';
        video.play().catch(() => {});
      } else {
        delete entry.target.dataset.inviewPlaying;
        video.pause();
      }
    });
  }, { threshold: 0.45 });

  inviewEls.forEach(el => observer.observe(el));
}

function initDotsNav() {
  const dots = document.querySelectorAll('.dots-nav-item');
  if (!dots.length) return;

  const targets = Array.from(document.querySelectorAll('.case-block, #media-reels, #cinematic'))
    .filter(el => el.id);

  if (!targets.length) return;

  const setActive = (id) => {
    dots.forEach(dot => {
      dot.classList.toggle('is-active', dot.dataset.target === id);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible && visible.target.id) setActive(visible.target.id);
  }, { rootMargin: '-20% 0px -45% 0px', threshold: [0.2, 0.4, 0.6] });

  targets.forEach(section => observer.observe(section));
}


// ===== REELS DATA HYDRATION =====
// js/reels-data.js içindeki window.XBEAR_REELS listesini DOM'a yazar.
function isLandscapeReel(item) {
  const deg = Number(item && item.rotate);
  return Boolean(item && (item.orientation === 'landscape' || deg === 90 || deg === -90));
}

function reelRotateDeg(item) {
  const deg = Number(item && item.rotate);
  return deg === 90 || deg === -90 ? deg : 0;
}

function bindMatrix90cwRotation(video, { onPortrait, onApplied }) {
  if (!video) return;
  const apply = () => {
    if (!video.videoWidth || !video.videoHeight) return;
    if (video.videoWidth < video.videoHeight) onPortrait();
    else onApplied();
  };
  if (video.readyState >= 1) apply();
  else video.addEventListener('loadedmetadata', apply, { once: true });
}

function hydrateReelsFromData() {
  const data = window.XBEAR_REELS;
  if (!data) return;

  const bindings = {
    xbearevent: { containerId: 'reelsScrollEvent', badgeClass: 'reel-badge--media' },
    xbearmedia: { containerId: 'reelsScrollMedia', badgeClass: 'reel-badge--media' },
  };

  Object.entries(bindings).forEach(([username, mapping]) => {
    const list = Array.isArray(data[username]) ? data[username] : [];
    const el = document.getElementById(mapping.containerId);
    if (!el) return;
    el.innerHTML = list.length
      ? list.map(item => renderReelCard(item, username, mapping.badgeClass)).join('')
      : '';
  });
}

function cacheAssetUrl(url) {
  if (!url) return '';
  const [path, hash] = url.split('#');
  const clean = path.split('?')[0];
  const next = `${clean}?v=3`;
  return hash ? `${next}#${hash}` : next;
}

function renderReelCard(item, username, badgeClass) {
  const isVideo = Boolean(item.src);
  const reelType = isVideo ? 'video' : 'instagram';
  const url = item.url || item.permalink || '';
  const src = cacheAssetUrl(item.src || '');
  const shortcode = extractReelShortcode(url);
  const title = escapeHtml(item.title || 'Reel');
  const account = `@${username}`;
  const accountAttr = escapeAttr(account);
  const permalink = escapeAttr(url);
  const srcAttr = escapeAttr(src);
  const popupFit = escapeAttr(item.popupFit || '');
  const popupPosition = escapeAttr(item.popupPosition || '');
  const popupZoomRaw = Number(item.popupZoom);
  const popupZoom = Number.isFinite(popupZoomRaw) && popupZoomRaw > 0 ? String(popupZoomRaw) : '';
  const previewSeconds = Number(item.previewAt);
  const previewAt = Number.isFinite(previewSeconds) && previewSeconds > 0 ? previewSeconds : 0;
  const previewSrc = previewAt > 0 ? `${src}#t=${previewAt}` : src;
  const previewSrcAttr = escapeAttr(previewSrc);
  const srcName = (item.src || '').split('/').pop() || '';
  const srcStem = srcName.endsWith('.mp4') ? srcName.slice(0, -4) : srcName;
  const autoVideoThumb = srcStem ? cacheAssetUrl(`assets/images/reels/thumbs/${srcStem}.jpg`) : '';
  const thumbSrc = isVideo
    ? (item.thumb || autoVideoThumb)
    : (item.thumb || (shortcode ? `assets/images/reels/${username}_${shortcode}.jpg` : ''));
  const thumbAttr = escapeAttr(thumbSrc);
  const mediaMarkup = isVideo
    ? (thumbSrc
      ? `<img src="${thumbAttr}" alt="${title}" loading="lazy" decoding="async" onerror="this.closest('.reel-thumb').classList.add('reel-thumb--placeholder'); this.remove();">`
      : `<video src="${previewSrcAttr}" muted loop playsinline preload="metadata" data-preview-at="${previewAt}"></video>`)
    : (thumbSrc
      ? `<img src="${thumbAttr}" alt="${title}" loading="lazy" decoding="async" onerror="this.closest('.reel-thumb').classList.add('reel-thumb--placeholder'); this.remove();">`
      : '');

  const landscape = isLandscapeReel(item);
  const rotateDeg = reelRotateDeg(item);
  const orientationAttr = landscape ? ' data-reel-orientation="landscape"' : '';
  const rotateAttr = rotateDeg ? ` data-reel-rotate="${rotateDeg}"` : '';
  const matrix = item.matrix === '90cw' ? '90cw' : '';
  const matrixAttr = matrix ? ` data-reel-matrix="${matrix}"` : '';
  const cardDataAttrs = isVideo
    ? `data-reel-src="${srcAttr}" data-reel-type="${reelType}" data-reel-popup-fit="${popupFit}" data-reel-popup-position="${popupPosition}" data-reel-popup-zoom="${popupZoom}" data-reel-preview-at="${previewAt}"${orientationAttr}${rotateAttr}${matrixAttr}`
    : `data-reel-url="${permalink}" data-reel-type="${reelType}"${orientationAttr}${rotateAttr}${matrixAttr}`;

  const badgeIconClass = isVideo ? 'ph ph-video-camera' : 'ph ph-instagram-logo';
  const thumbRotateClass = rotateDeg ? ' reel-thumb--rotate90' : '';

  return `<div class="reel-card" ${cardDataAttrs} data-reel-account="${accountAttr}" data-reel-title="${title}">
      <div class="reel-thumb${mediaMarkup ? '' : ' reel-thumb--placeholder'}${thumbRotateClass}">
        ${mediaMarkup}
        <div class="reel-play-icon"><i class="ph-fill ph-play"></i></div>
        <div class="reel-badge ${badgeClass}">
          <i class="${badgeIconClass}"></i> ${account}
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

function formatReelTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function bindReelScrubber(video, seek, toggleBtn, timeEl) {
  const sync = () => {
    const duration = video.duration;
    if (seek && Number.isFinite(duration) && duration > 0 && document.activeElement !== seek) {
      seek.value = String(Math.round((video.currentTime / duration) * 1000));
    }
    if (timeEl) {
      timeEl.textContent = Number.isFinite(duration) && duration > 0
        ? `${formatReelTime(video.currentTime)} / ${formatReelTime(duration)}`
        : '0:00';
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = video.paused
        ? '<i class="ph-fill ph-play"></i>'
        : '<i class="ph-fill ph-pause"></i>';
      toggleBtn.setAttribute('aria-label', video.paused ? 'Oynat' : 'Duraklat');
    }
  };

  video.addEventListener('timeupdate', sync);
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  video.addEventListener('loadedmetadata', sync);

  seek?.addEventListener('input', () => {
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    video.currentTime = (Number(seek.value) / 1000) * duration;
  });

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });

  sync();
}

function ensureAboutVideoPlayback() {
  const aboutVideo = document.getElementById('aboutVideo');
  if (!aboutVideo) return;
  aboutVideo.defaultMuted = false;
  aboutVideo.muted = false;
  const playPromise = aboutVideo.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      // Tarayıcı sesli autoplay'i engellerse kullanıcı controls üzerinden oynatabilir.
    });
  }
}

// <video controls>'a tıklamak Chrome'da native bir "click to toggle
// play/pause" default action'ı tetikler, ama bu JS listener'lardan SONRA
// (dispatch bittikten sonra) çalışır. preventDefault() çağırmazsak: bizim
// listener'ımız paused'ı değiştirir, hemen ardından native default action
// AYNI tıklamayı native olarak tekrar toggle'lar — ikisi üst üste binip
// birbirini iptal eder ve tıklamanın hiçbir görünür etkisi olmaz. Alttaki
// ~48px'lik kontrol çubuğu şeridini hariç tutuyoruz ki oradaki ikonun
// kendi native davranışına dokunmayalım.
//
// Dokunmatikte (mobil/DevTools cihaz modu) durum farklı: native video
// touchend'i kendi içinde preventDefault ediyor ve bunun sonucunda
// tarayıcı touch'tan senkron 'click' event'i hiç üretmiyor — yani bizim
// 'click' listener'ımız dokunmatikte asla çalışmıyordu. Bu yüzden
// touchend'i ayrıca dinliyoruz; iki event de tetiklenirse diye kısa bir
// zaman penceresiyle çift toggle'ı da engelliyoruz.
function attachFrameClickToggle(video, options = {}) {
  const CONTROLS_ZONE = options.nativeControls === false ? 0 : 48;
  let lastTouchToggle = 0;

  function inControlsZone(clientY) {
    const rect = video.getBoundingClientRect();
    return clientY - rect.top > rect.height - CONTROLS_ZONE;
  }

  function toggle() {
    if (video.paused) video.play().catch(() => {}); else video.pause();
  }

  video.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    if (!touch || inControlsZone(touch.clientY)) return;
    e.preventDefault();
    lastTouchToggle = Date.now();
    toggle();
  });

  video.addEventListener('click', (e) => {
    if (Date.now() - lastTouchToggle < 500) return;
    if (inControlsZone(e.clientY)) return;
    e.preventDefault();
    toggle();
  });
}

function syncReelPreviewFrames() {
  document.querySelectorAll('.reel-card .reel-thumb video[data-preview-at]').forEach(video => {
    if (video.dataset.previewReady === 'true') return;
    video.dataset.previewReady = 'true';

    const previewAt = Number(video.dataset.previewAt || 0);
    if (!Number.isFinite(previewAt) || previewAt <= 0) {
      video.pause();
      return;
    }

    const freezeOnTarget = () => {
      try {
        const target = Math.min(Math.max(previewAt, 0), Math.max(0, video.duration - 0.05));
        if (Number.isFinite(target) && target >= 0) {
          video.currentTime = target;
        }
      } catch (_) {
        // ignore
      }
      video.pause();
      video.muted = true;
    };
    video.addEventListener('loadedmetadata', freezeOnTarget, { once: true });
    video.addEventListener('loadeddata', freezeOnTarget, { once: true });
    video.addEventListener('canplay', freezeOnTarget, { once: true });
    if (video.readyState >= 1) freezeOnTarget();
    setTimeout(freezeOnTarget, 150);
    video.pause();
  });
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
  const container = item.closest('[data-lightbox-group], .gallery-scroll, .cinematic-grid, .case-stills, .case-stills-row, .mackbear-boards');
  const items = container
    ? Array.from(container.querySelectorAll('[data-lightbox="true"]'))
    : [item];

  lightboxPlaylist = items.map(el => {
    const img = el.querySelector('img');
    const overlayText = el.querySelector('.gallery-scroll-overlay span, .cin-label');
    const source = img ? img.src : '';
    const normalized = source.toLowerCase();
    const popupSource = normalized.includes('/xbear1.jpeg')
      ? 'assets/images/reels/Xbear1_lightbox.jpg'
      : source;
    return {
      src: popupSource,
      title: overlayText ? overlayText.textContent.trim() : (img?.alt || ''),
      fit: el.dataset.lightboxFit || '',
      position: el.dataset.lightboxPosition || '',
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
    img.style.objectFit = entry.fit || '';
    img.style.objectPosition = entry.position || '';
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
  const container = card.closest('[data-reel-group], .gallery-scroll--reels');
  const selector = '[data-reel-url], [data-reel-src]';
  reelPlaylist = container
    ? Array.from(container.querySelectorAll(selector)).map(el => ({
        type: el.dataset.reelType || (el.dataset.reelSrc ? 'video' : 'instagram'),
        url: el.dataset.reelUrl || '',
        src: cacheAssetUrl(el.dataset.reelSrc || ''),
        account: el.dataset.reelAccount || '',
        title: el.dataset.reelTitle || 'Reel',
        popupFit: el.dataset.reelPopupFit || '',
        popupPosition: el.dataset.reelPopupPosition || '',
        popupZoom: el.dataset.reelPopupZoom || '',
        previewAt: Number(el.dataset.reelPreviewAt || 0),
        orientation: el.dataset.reelOrientation || '',
        rotate: Number(el.dataset.reelRotate || 0),
        matrix: el.dataset.reelMatrix || '',
      }))
    : [{
        type: card.dataset.reelType || (card.dataset.reelSrc ? 'video' : 'instagram'),
        url: card.dataset.reelUrl || '',
        src: cacheAssetUrl(card.dataset.reelSrc || ''),
        account: card.dataset.reelAccount || '',
        title: card.dataset.reelTitle || 'Reel',
        popupFit: card.dataset.reelPopupFit || '',
        popupPosition: card.dataset.reelPopupPosition || '',
        popupZoom: card.dataset.reelPopupZoom || '',
        previewAt: Number(card.dataset.reelPreviewAt || 0),
        orientation: card.dataset.reelOrientation || '',
        rotate: Number(card.dataset.reelRotate || 0),
        matrix: card.dataset.reelMatrix || '',
      }];

  const activeKey = cacheAssetUrl(card.dataset.reelSrc || '') || card.dataset.reelUrl || '';
  reelPlaylistIndex = reelPlaylist.findIndex(item => (item.src || item.url) === activeKey);
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
  const popup      = document.getElementById('reelPopup');
  const accountEl  = document.getElementById('reelAccountName');
  const counterEl  = document.getElementById('reelPopupCounter');
  const igLink     = document.getElementById('reelOpenInstagram');
  const igLoginBtn = document.getElementById('reelIgLoginBtn');
  const body       = document.getElementById('reelPopupBody');
  const footer     = popup ? popup.querySelector('.reel-popup-footer') : null;
  const prevBtn    = document.getElementById('reelPopupPrev');
  const nextBtn    = document.getElementById('reelPopupNext');

  const isVideo = item.type === 'video' && item.src;
  const rotateDeg = reelRotateDeg(item);
  const isLandscape = item.orientation === 'landscape' || rotateDeg !== 0;
  if (popup) {
    popup.classList.toggle('is-video', Boolean(isVideo));
    popup.classList.toggle('is-landscape', Boolean(isLandscape));
    popup.classList.toggle('is-rotate90', Boolean(rotateDeg));
  }
  body.classList.toggle('is-video', Boolean(isVideo));
  body.classList.toggle('is-landscape', Boolean(isVideo && isLandscape));
  body.classList.toggle('is-rotate90', Boolean(rotateDeg));
  if (footer) footer.style.display = isVideo ? 'none' : '';
  accountEl.textContent = item.account || '@xbearevent';
  if (counterEl) {
    counterEl.textContent = reelPlaylist.length > 1
      ? `${index + 1} / ${reelPlaylist.length}`
      : '';
  }

  if (prevBtn && nextBtn) {
    const multiple = reelPlaylist.length > 1;
    prevBtn.style.display = multiple ? '' : 'none';
    nextBtn.style.display = multiple ? '' : 'none';
  }

  if (isVideo) {
    const videoSrc = escapeAttr(item.src);
    const styleParts = [];
    if (item.popupFit) styleParts.push(`object-fit:${item.popupFit}`);
    if (item.popupPosition) styleParts.push(`object-position:${item.popupPosition}`);
    const popupZoom = Number(item.popupZoom);
    if (!rotateDeg && Number.isFinite(popupZoom) && popupZoom > 0 && popupZoom !== 1) {
      styleParts.push(`transform:scale(${popupZoom})`);
      styleParts.push('transform-origin:left center');
    }
    const videoStyleAttr = styleParts.length ? ` style="${escapeAttr(styleParts.join(';'))}"` : '';
    const videoClass = [
      'reel-popup-video',
      isLandscape ? 'reel-popup-video--landscape' : '',
      rotateDeg ? 'reel-popup-video--rotate90' : '',
    ].filter(Boolean).join(' ');
    if (isLandscape) {
      body.innerHTML = `
        <div class="reel-popup-viewport">
          <video class="${videoClass}" src="${videoSrc}" autoplay loop playsinline preload="metadata"${videoStyleAttr}></video>
        </div>
        <div class="reel-popup-scrub">
          <button type="button" class="reel-popup-toggle" aria-label="Duraklat">
            <i class="ph-fill ph-pause"></i>
          </button>
          <input type="range" class="reel-popup-seek" min="0" max="1000" value="0" step="1" aria-label="İlerlet">
          <span class="reel-popup-time">0:00</span>
        </div>
      `;
    } else {
      body.innerHTML = `
        <video class="${videoClass}" src="${videoSrc}" controls autoplay loop playsinline preload="metadata"${videoStyleAttr}></video>
      `;
    }
    const popupVideo = body.querySelector('.reel-popup-video');
    if (popupVideo && item.matrix === '90cw' && !rotateDeg) {
      bindMatrix90cwRotation(popupVideo, {
        onPortrait: () => {
          popupVideo.classList.remove('reel-popup-video--rotate180');
          popupVideo.classList.add('reel-popup-video--rotate90');
          if (popup) popup.classList.add('is-rotate90');
          body.classList.add('is-rotate90');
        },
        onApplied: () => {
          popupVideo.classList.remove('reel-popup-video--rotate90', 'reel-popup-video--rotate180');
        },
      });
    }
    if (popupVideo) {
      // Bazı sunucular Range isteğini desteklemediğinde video ilerletilemez;
      // yerel videoyu blob'a çevirerek zaman çubuğunu her ortamda çalışır yap.
      if (videoSrc && !/^https?:\/\//i.test(item.src || '')) {
        fetch(videoSrc)
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('fetch failed'))))
          .then((blob) => {
            if (!popupVideo.isConnected) return;
            const t = popupVideo.currentTime;
            const wasPaused = popupVideo.paused;
            popupVideo.src = URL.createObjectURL(blob);
            popupVideo.addEventListener('loadedmetadata', () => {
              try { popupVideo.currentTime = t; } catch (_) {}
              if (!wasPaused) popupVideo.play().catch(() => {});
            }, { once: true });
          })
          .catch(() => {});
      }
      const popupPreviewAt = Number(item.previewAt || 0);
      if (Number.isFinite(popupPreviewAt) && popupPreviewAt > 0) {
        popupVideo.addEventListener('loadedmetadata', () => {
          try {
            const target = Math.min(Math.max(popupPreviewAt, 0), Math.max(0, popupVideo.duration - 0.05));
            popupVideo.currentTime = target;
          } catch (_) {}
        }, { once: true });
      }
      attachFrameClickToggle(popupVideo, { nativeControls: !isLandscape });
      if (isLandscape) {
        bindReelScrubber(
          popupVideo,
          body.querySelector('.reel-popup-seek'),
          body.querySelector('.reel-popup-toggle'),
          body.querySelector('.reel-popup-time')
        );
      }
      popupVideo.muted = false;
      popupVideo.volume = 1;
      const playPromise = popupVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Tarayıcı sesli autoplay'i engellerse kullanıcı controls ile başlatabilir.
        });
      }
    }
    igLink.style.display = 'none';
    igLoginBtn.style.display = 'none';
  } else {
    igLink.style.display = '';
    igLoginBtn.style.display = '';
    igLink.href = item.url;
    igLoginBtn.href = item.url;
    body.innerHTML = `
      ${reelLoadingSkeleton()}
      <blockquote class="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink="${item.url}?utm_source=ig_embed"
        data-instgrm-version="14"
        style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:0; min-width:326px; padding:0; width:100%; max-width:540px;">
      </blockquote>
    `;
  }

  const fillBtn = document.getElementById('reelPopupFill');
  if (fillBtn) fillBtn.hidden = !isVideo;

  if (firstOpen) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  syncReelImmersive();

  if (!isVideo) {
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
  exitReelFill();
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    const popup = document.getElementById('reelPopup');
    const body = document.getElementById('reelPopupBody');
    const footer = popup ? popup.querySelector('.reel-popup-footer') : null;
    if (popup) popup.classList.remove('is-video', 'is-landscape', 'is-rotate90');
    if (body) {
      body.classList.remove('is-video', 'is-landscape', 'is-rotate90');
      body.innerHTML = reelLoadingSkeleton();
    }
    if (footer) footer.style.display = '';
    reelPlaylist = [];
    reelPlaylistIndex = -1;
  }, 350);
}

function isReelMobileViewport() {
  return window.matchMedia('(max-width: 880px)').matches
    || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function syncReelImmersive() {
  const overlay = document.getElementById('reelPopupOverlay');
  const popup = document.getElementById('reelPopup');
  const fillBtn = document.getElementById('reelPopupFill');
  if (!overlay || !popup) return;

  const isVideo = popup.classList.contains('is-video');
  const isLandscapeVideo = popup.classList.contains('is-landscape');
  const deviceLandscape = window.matchMedia('(orientation: landscape)').matches;
  const forced = overlay.classList.contains('is-fill');
  const matched = isVideo && (
    (isLandscapeVideo && deviceLandscape) ||
    (!isLandscapeVideo && !deviceLandscape)
  );
  const immersive = overlay.classList.contains('active') && (
    forced || (isReelMobileViewport() && matched)
  );
  overlay.classList.toggle('is-immersive', immersive);

  if (fillBtn) {
    const expanded = forced || Boolean(document.fullscreenElement);
    fillBtn.setAttribute('aria-label', expanded ? 'Tam ekrandan çık' : 'Tam ekran');
    fillBtn.innerHTML = expanded
      ? '<i class="ph ph-corners-in"></i>'
      : '<i class="ph ph-corners-out"></i>';
  }
}

function toggleReelFill(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const overlay = document.getElementById('reelPopupOverlay');
  if (!overlay || !overlay.classList.contains('active')) return;

  const entering = !overlay.classList.contains('is-fill');
  overlay.classList.toggle('is-fill', entering);
  const video = overlay.querySelector('.reel-popup-video');

  if (entering) {
    const req = overlay.requestFullscreen || overlay.webkitRequestFullscreen;
    if (req) {
      Promise.resolve(req.call(overlay)).catch(() => {
        if (video && typeof video.webkitEnterFullscreen === 'function') {
          try { video.webkitEnterFullscreen(); } catch (_) {}
        }
      });
    } else if (video && typeof video.webkitEnterFullscreen === 'function') {
      try { video.webkitEnterFullscreen(); } catch (_) {}
    }
  } else {
    const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
    if (document.fullscreenElement && exitFs) {
      Promise.resolve(exitFs.call(document)).catch(() => {});
    }
  }
  syncReelImmersive();
}

function exitReelFill() {
  const overlay = document.getElementById('reelPopupOverlay');
  overlay?.classList.remove('is-fill', 'is-immersive');
  const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
  if (document.fullscreenElement && exitFs) {
    Promise.resolve(exitFs.call(document)).catch(() => {});
  }
  const fillBtn = document.getElementById('reelPopupFill');
  if (fillBtn) fillBtn.hidden = true;
}

function initReelPopupFill() {
  if (!document.getElementById('reelPopupOverlay')) return;
  window.addEventListener('orientationchange', syncReelImmersive);
  window.addEventListener('resize', syncReelImmersive);
  document.addEventListener('fullscreenchange', () => {
    const overlay = document.getElementById('reelPopupOverlay');
    if (!document.fullscreenElement) overlay?.classList.remove('is-fill');
    syncReelImmersive();
  });
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

// ===== THEME SWITCHER LOGIC =====
function setupThemeSwitcher() {
  const themeSwitcherBtns = document.querySelectorAll('[data-set-theme]');
  const themeSwitcherContainers = document.querySelectorAll('.theme-switcher-dropdown');
  const floatingThemeBtn = document.getElementById('floatingThemeBtn');

  const currentTheme = localStorage.getItem('xbear_theme') || 'slate';
  updateActiveThemeUI(currentTheme);

  // Bind dropdown toggles
  document.querySelectorAll('.theme-switcher-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.theme-switcher-dropdown');
      if (parent) parent.classList.toggle('active');
    });
  });

  document.addEventListener('click', (e) => {
    themeSwitcherContainers.forEach(container => {
      if (!container.contains(e.target)) {
        container.classList.remove('active');
      }
    });
  });

  // Floating Theme Switcher Quick Toggle
  const themesList = ['slate', 'light', 'cream', 'midnight', 'navy'];
  if (floatingThemeBtn) {
    floatingThemeBtn.addEventListener('click', () => {
      const activeTheme = localStorage.getItem('xbear_theme') || 'slate';
      const nextIdx = (themesList.indexOf(activeTheme) + 1) % themesList.length;
      const nextTheme = themesList[nextIdx];
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('xbear_theme', nextTheme);
      updateActiveThemeUI(nextTheme);

      // Rotate animation on click
      floatingThemeBtn.style.transform = 'rotate(360deg) scale(1.1)';
      setTimeout(() => {
        floatingThemeBtn.style.transform = '';
      }, 350);
    });
  }

  // Theme Option Clicks
  themeSwitcherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-set-theme');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('xbear_theme', theme);
      updateActiveThemeUI(theme);
      themeSwitcherContainers.forEach(c => c.classList.remove('active'));
    });
  });
}

function updateActiveThemeUI(theme) {
  const themeSwitcherBtns = document.querySelectorAll('[data-set-theme]');
  themeSwitcherBtns.forEach(btn => {
    if (btn.getAttribute('data-set-theme') === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const themeMeta = {
    slate: { name: 'Füme Koyu', icon: 'ph-moon-stars' },
    light: { name: 'Aydınlık', icon: 'ph-sun-dim' },
    cream: { name: 'Kor Alevi', icon: 'ph-fire' },
    midnight: { name: 'Derin Gece', icon: 'ph-sparkle' },
    navy: { name: 'Derin Okyanus', icon: 'ph-drop' }
  };

  const meta = themeMeta[theme] || themeMeta['slate'];

  document.querySelectorAll('.theme-btn-label').forEach(label => {
    label.textContent = meta.name;
  });

  document.querySelectorAll('.theme-switcher-btn .theme-current-icon').forEach(iconEl => {
    iconEl.className = `theme-current-icon ph-bold ${meta.icon}`;
  });

  const floatingBtn = document.getElementById('floatingThemeBtn');
  if (floatingBtn) {
    const floatIcon = floatingBtn.querySelector('i');
    if (floatIcon) {
      floatIcon.className = `ph-bold ${meta.icon}`;
    }
  }
}


// ===== ABOUT VIDEO: Range desteksiz sunucularda ilerletmeyi mümkün kıl =====
(function () {
  function init() {
    var av = document.getElementById('aboutVideo');
    if (!av || !av.getAttribute('src')) return;
    attachFrameClickToggle(av);
    fetch(av.getAttribute('src'))
      .then(function (r) { return r.ok ? r.blob() : Promise.reject(new Error('fetch failed')); })
      .then(function (blob) {
        var t = av.currentTime;
        var wasPaused = av.paused;
        av.src = URL.createObjectURL(blob);
        av.addEventListener('loadedmetadata', function () {
          try { av.currentTime = t; } catch (_) {}
          if (!wasPaused) av.play().catch(function () {});
        }, { once: true });
      })
      .catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
