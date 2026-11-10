'use strict';
// One easing curve for the vertical entry and the horizontal panels.
(() => {
  const hero = document.getElementById('top');
  const spread = document.querySelector('.section-spread');
  const panels = [...spread.children];
  const fourth = document.getElementById('section-04');
  const fifth = document.getElementById('section-05');
  const sixth = document.getElementById('section-06');
  const footer = document.querySelector('.site-footer');
  const header = hero.querySelector('.header-fixed');
  const sectionIndicator = document.querySelector('.section-indicator');
  const indicatorDots = [...sectionIndicator.querySelectorAll('[data-section-label]')];
  const indicatorLabel = sectionIndicator.querySelector('.section-indicator-label');
  const indicatorItems = [...indicatorDots, indicatorLabel];
  let indicatorAnimations = [];
  const desktop = matchMedia('(min-width: 768px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const careersEyebrow = sixth.querySelector('.section-sixth-eyebrow');
  const careersLetters = document.createElement('span');
  careersLetters.className = 'section-sixth-letters';
  careersLetters.setAttribute('aria-hidden', 'true');
  let letterIndex = 0;
  for (const word of careersEyebrow.textContent.trim().split(/\s+/)) {
    if (careersLetters.childNodes.length) careersLetters.append(' ');
    const wordElement = document.createElement('span');
    wordElement.className = 'section-sixth-word';
    for (const character of word) {
      const mask = document.createElement('span');
      const letter = document.createElement('span');
      mask.className = 'section-sixth-letter';
      letter.textContent = character;
      letter.style.setProperty('--letter-delay', `${letterIndex++ * 30}ms`);
      mask.append(letter);
      wordElement.append(mask);
    }
    careersLetters.append(wordElement);
  }
  careersEyebrow.append(careersLetters);
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
  let lastScrollY = scrollY;
  let scrollDirection = 0;
  let sixthReturnGuardUntil = 0;
  const seenIntros = new Set();
  let introScrollLock;
  let lastLockedWheel = -Infinity;

  function fourthInView() {
    return fourth.getBoundingClientRect().top <= header.offsetHeight;
  }

  function hasReached(section) {
    return section.getBoundingClientRect().top <= 1;
  }

  function sixthCanEnter() {
    return sixth.getBoundingClientRect().top <= innerHeight + 1;
  }

  function syncCareers(current) {
    if (current !== sixth) {
      sixth.classList.remove('is-intro-playing');
      if (sixth.classList.contains('is-visible') && sixth.getBoundingClientRect().top >= innerHeight - 1) {
        sixth.classList.remove('is-visible');
      }
      return;
    }
    if (scrollDirection < 0) sixth.classList.remove('is-intro-playing');
    if (moving || sixth.classList.contains('is-visible')) return;
    if (scrollDirection > 0 && !reduced.matches) {
      const section = sixth.getBoundingClientRect();
      const title = careersEyebrow.getBoundingClientRect();
      const introCenter = section.top + Math.min(section.height, innerHeight) / 2 + header.offsetHeight / 4;
      careersEyebrow.style.setProperty('--sixth-intro-offset', `${introCenter - title.top - title.height / 2}px`);
      careersEyebrow.style.setProperty('--sixth-intro-scale', Math.min(4, section.width * 0.86 / title.width));
      sixth.classList.add('is-intro-playing');
    }
    sixth.classList.add('is-visible');
  }

  function syncIntroScrollLock(current) {
    if (introScrollLock?.section !== current || reduced.matches) introScrollLock = undefined;
    if (moving || introLocked() || reduced.matches || current === hero || seenIntros.has(current)) return;
    const anchor = panels.includes(current) ? spread : current;
    const top = anchor.getBoundingClientRect().top;
    if (top > 1) return;

    seenIntros.add(current);
    const waitsForSupport = current === panels[0]
      && current.classList.contains('is-motion-ready')
      && !current.classList.contains('is-scroll-cue-visible');
    const animations = current.getAnimations({ subtree: true }).filter(animation =>
      animation.playState !== 'finished' && Number.isFinite(animation.effect.getComputedTiming().endTime));
    if (!waitsForSupport && !animations.length) return;

    const lock = { section: current, limit: scrollY + Math.min(0, top) };
    introScrollLock = lock;
    if (!waitsForSupport) {
      Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        if (introScrollLock === lock) introScrollLock = undefined;
      });
    }
  }

  function syncSectionChrome() {
    if (scrollY !== lastScrollY) scrollDirection = Math.sign(scrollY - lastScrollY);
    lastScrollY = scrollY;
    const beyondHero = spread.getBoundingClientRect().top <= header.offsetHeight;
    header.classList.toggle('has-section-divider', beyondHero);
    const indicatorWasVisible = sectionIndicator.classList.contains('is-visible');
    sectionIndicator.classList.toggle('is-visible', beyondHero);
    sectionIndicator.inert = !beyondHero;
    sectionIndicator.classList.toggle('is-over-footer', beyondHero
      && footer.getBoundingClientRect().top <= sectionIndicator.getBoundingClientRect().top);
    const current = hasReached(sixth) ? sixth : hasReached(fifth) ? fifth
      : fourthInView() ? fourth : beyondHero ? panels[activePanel] : hero;
    fourth.classList.toggle('is-visible', current === fourth || fadingFourth);
    fifth.classList.toggle('is-visible', current === fifth || current === sixth);
    syncCareers(current);
    syncIntroScrollLock(current);
    if (current === indicatedSection) return;
    indicatedSection = current;
    updateIndicator(current, beyondHero && indicatorWasVisible && !reduced.matches);
  }

  function updateIndicator(current, animate) {
    const previousPositions = animate ? indicatorItems.map(item => item.getBoundingClientRect().left) : [];
    indicatorAnimations.forEach(animation => animation.cancel());
    indicatorDots.forEach(dot => {
      if (dot.dataset.scrollTarget === current.id) {
        dot.setAttribute('aria-current', 'location');
        indicatorLabel.textContent = dot.dataset.sectionLabel;
        dot.after(indicatorLabel);
      } else {
        dot.removeAttribute('aria-current');
      }
    });
    indicatorAnimations = previousPositions.flatMap((left, index) => {
      const item = indicatorItems[index];
      const offset = left - item.getBoundingClientRect().left;
      const isLabel = item === indicatorLabel;
      if (!offset && !isLabel) return [];
      return [item.animate([
        { transform: `translate(${offset}px, ${isLabel ? 3 : 0}px)`, opacity: isLabel ? 0 : 1 },
        { transform: 'none', opacity: 1 },
      ], { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })];
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

  function go(target, fromSixth = false) {
    if (introLocked()) return;
    const targetPanel = panels.indexOf(target);
    const afterSpread = target === fourth || target === fifth || target === sixth;
    if (target !== hero && !afterSpread && targetPanel < 0) return;
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
      if (fromSixth) {
        lastWheel = performance.now();
        sixthReturnGuardUntil = lastWheel + 400;
      }
      const panelIndex = afterSpread ? panels.length - 1 : Math.max(0, targetPanel);
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
  addEventListener('scroll', () => {
    if (introScrollLock && !moving && scrollY > introScrollLock.limit + 1) {
      window.scrollTo(0, introScrollLock.limit);
      return;
    }
    const delta = scrollY - lastScrollY;
    if (!moving && delta < 0 && !introLocked()) {
      const sixthTop = sixth.getBoundingClientRect().top;
      // A native scroll can cross the boundary between wheel events.
      if (sixthTop >= -2 && sixthTop + delta < -2 && hasReached(fifth)) {
        go(fifth, true);
      }
    }
    syncSectionChrome();
  }, { passive: true });
  addEventListener('pageshow', syncSectionChrome);
  panels[0].addEventListener('support:intro-complete', () => {
    if (introScrollLock?.section === panels[0]) introScrollLock = undefined;
  });
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
    const direction = Math.sign(horizontal ? event.deltaX : event.deltaY);
    if (direction > 0 && (!horizontal || panels.includes(indicatedSection))) {
      const now = performance.now();
      if (introScrollLock || now - lastLockedWheel < 180) {
        lastLockedWheel = now;
        event.preventDefault();
        return;
      }
    }
    const atFourth = fourthInView();
    const atFifth = hasReached(fifth);
    const atSixth = hasReached(sixth);
    const spreadAtTop = !atFourth && spread.getBoundingClientRect().top <= 1;
    if (horizontal ? !spreadAtTop : !desktop.matches && !atFourth) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
    if (!direction) return;
    if (!moving && !horizontal && canScrollOceanCopy(event.target, direction)) return;
    const now = performance.now(), continuing = now - lastWheel < 180;
    lastWheel = now;
    if (moving || continuing || (!horizontal && direction < 0 && now < sixthReturnGuardUntil)) {
      event.preventDefault();
      return;
    }
    let target;
    if (atSixth) {
      if (direction < 0 && sixth.getBoundingClientRect().top >= -2) target = fifth;
      else lastWheel = -Infinity;
    } else if (atFifth) {
      if (direction < 0 && fifth.getBoundingClientRect().top >= -2) target = fourth;
      else if (direction > 0 && sixthCanEnter()) target = sixth;
      else lastWheel = -Infinity;
    } else if (atFourth) {
      if (direction > 0) {
        if (!fourth.dispatchEvent(new Event('people:advance', { cancelable: true }))) {
          event.preventDefault();
          return;
        }
        // If people:advance didn't consume it (or cards are finished/visible), snap to fifth
        if (fifth.getBoundingClientRect().top <= innerHeight) {
          event.preventDefault();
          go(fifth);
          return;
        }
        lastWheel = -Infinity;
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
    go(target, atSixth && target === fifth);
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
      inSixth: sixth.contains(event.target),
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
    if (moving || start.blockedForward) return;
    if (start.verticalTarget) {
      if (Math.abs(dy) >= 48) go(start.verticalTarget, start.inSixth && start.verticalTarget === fifth);
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
    const dx = touchStart.x - touch.clientX;
    const forward = dy > Math.abs(dx) || (touchStart.inSpread && dx > Math.abs(dy));
    if (forward && (introScrollLock || touchStart.blockedForward)) {
      touchStart.blockedForward = true;
      touchStart.verticalTarget = null;
      if (event.cancelable) event.preventDefault();
      return;
    }
    if (Math.abs(dy) <= Math.abs(dx) * 1.3) return;
    if (touchStart.inFourth && dy < 0 && fourth.getBoundingClientRect().top >= -1) {
      touchStart.verticalTarget = panels.at(-1);
    }
    if (touchStart.inFifth && dy < 0 && fifth.getBoundingClientRect().top >= -2) {
      touchStart.verticalTarget = fourth;
    }
    if (touchStart.inFifth && dy > 0 && sixthCanEnter()) touchStart.verticalTarget = sixth;
    if (touchStart.inSixth && dy < 0 && sixth.getBoundingClientRect().top >= -2) touchStart.verticalTarget = fifth;
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
    const forward = ['ArrowDown', 'PageDown', 'End'].includes(event.key) || (event.key === ' ' && !event.shiftKey);
    if (introScrollLock && forward && !event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) {
      event.preventDefault();
      return;
    }
    cancel();
  });
  addEventListener('pointerdown', cancel);
  addEventListener('resize', cancel);
  reduced.addEventListener('change', cancel);
})();
