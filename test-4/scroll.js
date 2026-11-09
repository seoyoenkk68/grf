'use strict';
// One easing curve for the vertical entry and the horizontal panels.
(() => {
  const hero = document.getElementById('top');
  const spread = document.querySelector('.section-spread');
  const panels = [...spread.children];
  const header = hero.querySelector('.header-fixed');
  const sectionIndicator = document.querySelector('.section-indicator');
  const indicatorDots = [...sectionIndicator.querySelectorAll('[data-section-label]')];
  const indicatorLabel = sectionIndicator.querySelector('.section-indicator-label');
  const desktop = matchMedia('(min-width: 768px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const introLocked = () => document.documentElement.classList.contains('grf-intro-locked');
  // Shared easing: cubic-bezier(.45, 0, .2, 1).
  // Solve the Bezier's time axis before reading its distance axis.
  const verticalDuration = 1400;
  const horizontalDuration = 1750;
  function ease(progress) {
    let low = 0, high = 1;
    for (let i = 0; i < 16; i++) {
      const t = (low + high) / 2, u = 1 - t;
      const x = 3 * u * u * t * .45 + 3 * u * t * t * .2 + t * t * t;
      if (x < progress) low = t; else high = t;
    }
    const t = (low + high) / 2;
    return progress === 1 ? 1 : 3 * (1 - t) * t * t + t * t * t;
  }
  let frame = 0, moving = false, lastWheel = -Infinity, activePanel = 0;
  let indicatedSection;

  function syncSectionChrome() {
    const beyondHero = spread.getBoundingClientRect().top <= header.offsetHeight;
    header.classList.toggle('has-section-divider', beyondHero);
    sectionIndicator.hidden = !beyondHero;
    const current = beyondHero ? panels[activePanel] : hero;
    if (current === indicatedSection) return;
    indicatedSection = current;
    indicatorDots.forEach(dot => {
      if (dot.dataset.scrollTarget === current.id) {
        dot.setAttribute('aria-current', 'location');
        indicatorLabel.textContent = dot.dataset.sectionLabel;
        dot.after(indicatorLabel);
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function setPanelPosition(position) {
    spread.scrollLeft = position;
    const progress = spread.clientWidth ? position / spread.clientWidth : 0;
    spread.style.setProperty('--support-copy-opacity', Math.max(0, 1 - progress));
  }

  function settlePanel(index) {
    activePanel = index;
    setPanelPosition(index * spread.clientWidth);
    panels.forEach((panel, i) => { panel.inert = i !== index; });
    syncSectionChrome();
  }

  function stop() {
    cancelAnimationFrame(frame);
    moving = false;
  }
  function cancel() {
    stop();
    settlePanel(activePanel);
  }

  function go(target) {
    if (introLocked()) return;
    const targetPanel = panels.indexOf(target);
    if (target !== hero && targetPanel < 0) return;
    stop();
    const startY = scrollY;
    const startX = spread.scrollLeft;
    const endY = startY + (target === hero ? hero : spread).getBoundingClientRect().top;
    const endX = targetPanel < 0 ? startX : targetPanel * spread.clientWidth;
    const duration = endX !== startX ? horizontalDuration : verticalDuration;
    const finish = () => {
      moving = false;
      settlePanel(Math.max(0, targetPanel));
    };
    if (reduced.matches) {
      window.scrollTo(0, endY);
      finish();
      return;
    }
    moving = true;
    const began = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - began) / duration);
      const eased = ease(progress);
      if (endY !== startY) window.scrollTo(0, startY + (endY - startY) * eased);
      if (endX !== startX) setPanelPosition(startX + (endX - startX) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish();
    }
    frame = requestAnimationFrame(tick);
  }
  addEventListener('scroll', syncSectionChrome, { passive: true });
  addEventListener('pageshow', syncSectionChrome);
  settlePanel(0);

  // Wheel, Explore, section dots and the logo share the same transition.
  document.querySelectorAll('[data-scroll-target]').forEach(control => {
    control.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(control.dataset.scrollTarget);
      if (!target) return;
      event.preventDefault();
      go(target);
    });
  });
  addEventListener('wheel', event => {
    if (introLocked() && !event.ctrlKey) {
      lastWheel = performance.now();
      event.preventDefault();
      return;
    }
    if (event.ctrlKey) return;
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    const spreadAtTop = spread.getBoundingClientRect().top <= 1;
    if (horizontal ? !spreadAtTop : !desktop.matches) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
    const now = performance.now(), continuing = now - lastWheel < 180;
    lastWheel = now;
    if (moving || continuing) { event.preventDefault(); return; }
    const direction = Math.sign(horizontal ? event.deltaX : event.deltaY);
    if (!direction) return;
    const target = spreadAtTop
      ? panels[activePanel + direction] || (!horizontal && direction < 0 ? hero : null)
      : direction > 0 ? panels[0] : null;
    if (!target) return;
    event.preventDefault();
    go(target);
  }, { passive: false });

  let touchStart;
  spread.addEventListener('touchstart', event => {
    const touch = event.touches.length === 1 ? event.touches[0] : null;
    touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }, { passive: true });
  spread.addEventListener('touchend', event => {
    if (!touchStart || event.touches.length) return;
    const start = touchStart;
    touchStart = null;
    const touch = event.changedTouches[0];
    const dx = start.x - touch.clientX;
    const dy = start.y - touch.clientY;
    if (moving || Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy) * 1.3) return;
    const target = panels[activePanel + Math.sign(dx)];
    if (target) go(target);
  }, { passive: true });
  spread.addEventListener('touchcancel', () => { touchStart = null; });
  addEventListener('touchmove', event => {
    if (introLocked() && event.touches.length === 1) event.preventDefault();
  }, { passive: false });
  addEventListener('keydown', event => {
    if (introLocked() && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)
      && !event.target.closest('input, textarea, select, [contenteditable="true"]')) {
      event.preventDefault();
      return;
    }
    cancel();
  });
  addEventListener('pointerdown', cancel);
  addEventListener('resize', cancel);
  reduced.addEventListener('change', cancel);
})();
