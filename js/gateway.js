/* XBear Event — iris gateway */
(function initEventGateway() {
  function boot() {
    const video = document.getElementById('irisVideo');
    const gateway = document.getElementById('hero');
    const pin = document.getElementById('gatewayPin');
    if (!video || !gateway) return;

    const navbar = document.getElementById('navbar');
    const fadeUi = document.querySelectorAll('[data-hero-fade]');
    const disperseUi = document.querySelectorAll('[data-hero-disperse]');

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.loop = false;
    video.autoplay = false;
    video.preload = 'none';

    const markReady = () => video.classList.add('is-ready');
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);
    if (video.readyState >= 2) markReady();

    const source = video.querySelector('source');
    const videoUrl = source ? source.getAttribute('src') : video.getAttribute('src');

    const prime = async () => {
      try {
        const t = video.currentTime || 0;
        await video.play();
        video.pause();
        if (Number.isFinite(t)) video.currentTime = t;
      } catch (_) { /* autoplay policy */ }
    };

    const bindSrc = async () => {
      if (!videoUrl) return;
      try {
        const res = await fetch(videoUrl);
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        while (video.firstChild) video.removeChild(video.firstChild);
        video.src = URL.createObjectURL(blob);
      } catch (_) {
        video.preload = 'auto';
        video.load();
      }
      if (video.readyState < 1) {
        await new Promise((resolve) => video.addEventListener('loadedmetadata', resolve, { once: true }));
      }
      video.pause();
      video.currentTime = 0;
      markReady();
      await prime();
      onScroll();
    };

    window.addEventListener('pointerdown', prime, { once: true, passive: true });
    window.addEventListener('wheel', prime, { once: true, passive: true });
    window.addEventListener('touchstart', prime, { once: true, passive: true });

    const THROUGH_IN = 0.91;
    const HOLD_VH = 0.42;
    let pending = 0;
    let seeking = false;
    let duration = 0;
    let inBlack = false;
    let lastY = window.scrollY;
    let upHoldFrom = null;
    let scrubOffset = 0;
    let freezeP = THROUGH_IN;
    let lastDisperse = -1;
    let lastHoldPaint = false;

    const readDuration = () => {
      const d = video.duration;
      if (d && Number.isFinite(d) && d > 0) duration = d;
    };
    video.addEventListener('loadedmetadata', readDuration);
    readDuration();

    const applyTime = (t) => {
      if (!duration) readDuration();
      if (!duration || seeking) return;
      const next = Math.min(Math.max(t, 0), duration - 0.04);
      pending = next;
      if (Math.abs((video.currentTime || 0) - next) < 0.04) return;
      seeking = true;
      try {
        video.currentTime = next;
      } catch (_) {
        seeking = false;
      }
    };

    video.addEventListener('seeked', () => {
      seeking = false;
      if (Math.abs((video.currentTime || 0) - pending) > 0.05) applyTime(pending);
    });

    const setBlack = (value) => {
      if (value === inBlack) return;
      inBlack = value;
      pin.classList.toggle('is-through', value);
      gateway.classList.toggle('is-through', value);
    };

    const paintUi = (p, holding) => {
      const disperse = p >= 0.28 ? 1 : p / 0.28;
      if (Math.abs(disperse - lastDisperse) > 0.008) {
        lastDisperse = disperse;
        const fade = String(1 - disperse);
        fadeUi.forEach((el) => {
          el.style.opacity = fade;
        });
        const yMove = (disperse * -90).toFixed(1);
        const scale = (1 + disperse * 0.72).toFixed(3);
        disperseUi.forEach((el) => {
          el.style.opacity = fade;
          el.style.transform = `translate3d(0, ${yMove}px, 0) scale(${scale})`;
        });
      }

      if (holding !== lastHoldPaint) {
        lastHoldPaint = holding;
        document.body.classList.toggle('iris-hold', holding);
        if (holding) {
          navbar.classList.add('scrolled');
          navbar.classList.remove('nav-hidden');
        }
      }
      if (!holding) navbar.classList.toggle('scrolled', p > 0.12);
    };

    const progressOf = () => {
      const range = Math.max(1, gateway.offsetHeight - window.innerHeight);
      const top = gateway.getBoundingClientRect().top;
      return Math.min(1, Math.max(0, -top / range));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const p = progressOf();
        const goingUp = y < lastY - 0.5;
        const holdPx = window.innerHeight * HOLD_VH;

        if (goingUp && p < THROUGH_IN && inBlack) {
          if (upHoldFrom == null) {
            upHoldFrom = y;
            freezeP = Math.max(p, THROUGH_IN - 0.001);
          }
        }
        if (!goingUp) {
          upHoldFrom = null;
          scrubOffset = 0;
        }

        const holdRemaining = upHoldFrom != null && (upHoldFrom - y) < holdPx;
        if (!holdRemaining && p < THROUGH_IN) {
          if (upHoldFrom != null) scrubOffset = Math.max(0, freezeP - p);
          upHoldFrom = null;
        }

        const nextBlack = p >= THROUGH_IN || holdRemaining;
        const pinVisible = p > 0.04 && p < 0.995;
        setBlack(nextBlack);
        paintUi(p, nextBlack && pinVisible);

        if (!nextBlack) applyTime((p + scrubOffset) * (duration || 0));

        lastY = y;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', onScroll);
    bindSrc();
    onScroll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
