'use strict';
// Desktop section study: one wheel gesture, one section. No external library.
(() => {
  const sections = [...document.querySelectorAll('main > section')];
  const desktop = matchMedia('(min-width: 768px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const introLocked = () => document.documentElement.classList.contains('grf-intro-locked');
  // Local motion study: 1.4s, cubic-bezier(.45, 0, .2, 1).
  // Solve the Bezier's time axis before reading its distance axis.
  const duration = 1400;
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
  let frame = 0, moving = false, lastWheel = 0;
  function cancel() {
    cancelAnimationFrame(frame);
    moving = false;
  }
  function go(target) {
    if (introLocked()) return;
    cancel();
    const start = scrollY;
    const end = target.getBoundingClientRect().top + start;
    if (reduced.matches) { window.scrollTo(0, end); return; }
    moving = true;
    const began = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - began) / duration);
      const eased = ease(progress);
      window.scrollTo(0, start + (end - start) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else moving = false;
    }
    frame = requestAnimationFrame(tick);
  }
  // Wheel, Explore and the logo all use the same transition.
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
    if (!desktop.matches || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
    const now = performance.now(), continuing = now - lastWheel < 180;
    lastWheel = now;
    if (moving || continuing) { event.preventDefault(); return; }
    const current = sections.reduce((best, section, index) =>
      Math.abs(section.getBoundingClientRect().top) < Math.abs(sections[best].getBoundingClientRect().top) ? index : best, 0);
    const next = current + Math.sign(event.deltaY);
    if (!sections[next]) return;
    event.preventDefault();
    go(sections[next]);
  }, { passive: false });
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
