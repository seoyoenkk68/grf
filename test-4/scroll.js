'use strict';
// One easing curve for the vertical entry and the horizontal panels.
(() => {
  const hero = document.getElementById('top');
  const spread = document.querySelector('.section-spread');
  const panels = [...spread.children];
  const fourth = document.getElementById('section-04');
  const fifth = document.getElementById('section-05');
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
  let fadingFourth = false;

  function fourthInView() {
    return fourth.getBoundingClientRect().top <= header.offsetHeight;
  }

  function fifthInView() {
    return fifth.getBoundingClientRect().top <= header.offsetHeight;
  }

  function syncSectionChrome() {
    const beyondHero = spread.getBoundingClientRect().top <= header.offsetHeight;
    header.classList.toggle('has-section-divider', beyondHero);
    sectionIndicator.hidden = !beyondHero;
    const current = fifthInView() ? fifth
      : fourthInView() ? fourth : beyondHero ? panels[activePanel] : hero;
    fourth.classList.toggle('is-visible', current === fourth || fadingFourth);
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
    spread.style.setProperty('--ocean-copy-opacity', Math.min(1, Math.max(0, progress)));
  }

  function settlePanel(index) {
    activePanel = index;
    setPanelPosition(index * spread.clientWidth);
    spread.classList.toggle('is-third-photo-visible', index === 1);
    panels.forEach((panel, i) => { panel.inert = i !== index; });
    syncSectionChrome();
  }

  function stop() {
    cancelAnimationFrame(frame);
    moving = false;
    if (fadingFourth) {
      fadingFourth = false;
      fourth.style.removeProperty('opacity');
    }
  }
  function cancel() {
    stop();
    settlePanel(activePanel);
  }

  function go(target) {
    if (introLocked()) return;
    const targetPanel = panels.indexOf(target);
    if (target !== hero && target !== fourth && target !== fifth && targetPanel < 0) return;
    stop();
    const startY = scrollY;
    const startX = spread.scrollLeft;
    const verticalTarget = targetPanel < 0 ? target : spread;
    const endY = startY + verticalTarget.getBoundingClientRect().top;
    const endX = targetPanel < 0 ? startX : targetPanel * spread.clientWidth;
    const duration = endX !== startX ? horizontalDuration : verticalDuration;
    if (targetPanel === 0 && (activePanel === 1 || startX > 0)) {
      target.dispatchEvent(new Event('support:show-final'));
    }
    // Keep the third panel visible until it has slid out.
    if (targetPanel === 1) spread.classList.add('is-third-photo-visible');
    const finish = () => {
      stop();
      const panelIndex = target === fourth || target === fifth
        ? panels.length - 1 : Math.max(0, targetPanel);
      settlePanel(panelIndex);
    };
    if (reduced.matches) {
      window.scrollTo(0, endY);
      finish();
      return;
    }
    moving = true;
    fadingFourth = targetPanel === 1 && endY < startY && fourthInView();
    const began = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - began) / duration);
      const eased = ease(progress);
      if (fadingFourth) fourth.style.opacity = 1 - eased;
      if (endY !== startY) window.scrollTo(0, startY + (endY - startY) * eased);
      if (endX !== startX) setPanelPosition(startX + (endX - startX) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish();
    }
    frame = requestAnimationFrame(tick);
  }
  addEventListener('scroll', syncSectionChrome, { passive: true });
  addEventListener('pageshow', syncSectionChrome);
  fourth.addEventListener('people:closed', () => { lastWheel = performance.now(); });
  fourth.addEventListener('people:next-section', () => go(fifth));
  fourth.classList.add('is-motion-ready');
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
    const atFourth = fourthInView();
    const atFifth = fifthInView();
    const spreadAtTop = !atFourth && spread.getBoundingClientRect().top <= 1;
    if (horizontal ? !spreadAtTop : !desktop.matches && !atFourth) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
    const direction = Math.sign(horizontal ? event.deltaX : event.deltaY);
    if (!direction) return;
    if (!moving && !horizontal && canScrollOceanCopy(event.target, direction)) return;
    const now = performance.now(), continuing = now - lastWheel < 180;
    lastWheel = now;
    if (moving || continuing) { event.preventDefault(); return; }
    let target;
    if (atFifth) {
      if (direction < 0) target = fourth;
    } else if (atFourth) {
      if (direction > 0) {
        if (!fourth.dispatchEvent(new Event('people:advance', { cancelable: true }))) {
          event.preventDefault();
        } else {
          // Native scrolling can bring the cards into view on short screens.
          lastWheel = -Infinity;
        }
        return;
      }
      if (!desktop.matches || fourth.getBoundingClientRect().top < -1) {
        lastWheel = -Infinity;
        return;
      }
      target = panels.at(-1);
    } else if (spreadAtTop) {
      target = panels[activePanel + direction];
      if (!target && !horizontal) target = direction > 0 ? fourth : hero;
    } else if (direction > 0) {
      target = panels[0];
    }
    if (!target) return;
    event.preventDefault();
    go(target);
  }, { passive: false });

  function canScrollOceanCopy(target, direction) {
    const copy = target.closest('.section-ocean-caption');
    if (!copy) return false;
    return direction < 0 ? copy.scrollTop > 0
      : copy.scrollTop + copy.clientHeight < copy.scrollHeight - 1;
  }

  let touchStart;
  const sectionMain = spread.parentElement;
  sectionMain.addEventListener('touchstart', event => {
    const touch = event.touches.length === 1 && !event.target.closest('[data-native-scroll]')
      ? event.touches[0] : null;
    touchStart = touch ? {
      x: touch.clientX,
      y: touch.clientY,
      inSpread: spread.contains(event.target),
      inFourth: fourth.contains(event.target),
      inFifth: fifth.contains(event.target),
      verticalTarget: null,
    } : null;
  }, { passive: true });
  sectionMain.addEventListener('touchend', event => {
    if (!touchStart || event.touches.length) return;
    const start = touchStart;
    touchStart = null;
    const touch = event.changedTouches[0];
    const dx = start.x - touch.clientX;
    const dy = start.y - touch.clientY;
    if (moving) return;
    if (start.verticalTarget) {
      if (Math.abs(dy) >= 48) go(start.verticalTarget);
      return;
    }
    if (start.inFourth && dy >= 48 && dy > Math.abs(dx) * 1.3) {
      fourth.dispatchEvent(new Event('people:advance', { cancelable: true }));
      return;
    }
    if (!start.inSpread || Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy) * 1.3) return;
    const target = panels[activePanel + Math.sign(dx)];
    if (target) go(target);
  }, { passive: true });
  sectionMain.addEventListener('touchcancel', () => { touchStart = null; });
  addEventListener('touchmove', event => {
    if (event.touches.length !== 1) return;
    if (introLocked()) {
      event.preventDefault();
      return;
    }
    if (!touchStart || moving) return;
    const touch = event.touches[0];
    const dy = touchStart.y - touch.clientY;
    if (Math.abs(dy) <= Math.abs(touchStart.x - touch.clientX) * 1.3) return;
    if (touchStart.inFourth && dy < 0 && fourth.getBoundingClientRect().top >= -1) {
      touchStart.verticalTarget = panels.at(-1);
    }
    if (touchStart.inFifth && dy < 0) touchStart.verticalTarget = fourth;
    if (touchStart.inSpread && activePanel === panels.length - 1 && dy > 0
      && !canScrollOceanCopy(event.target, 1)) touchStart.verticalTarget = fourth;
    const advancingPeople = touchStart.inFourth && dy > 0
      && fifth.getBoundingClientRect().top <= innerHeight + 1;
    if ((touchStart.verticalTarget || advancingPeople) && event.cancelable) event.preventDefault();
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
