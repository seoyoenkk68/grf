'use strict';

(() => {
  const section = document.querySelector('.grf-people');
  const openers = [...section.querySelectorAll('.people-open-profile')];
  const lastCard = section.querySelector('.people-profile:last-child');
  const detail = section.querySelector('.people-detail');
  const image = detail.querySelector('.people-detail-image');
  const imageNumber = image.querySelector('span');
  const progressNumber = detail.querySelector('.people-detail-current');
  const profileNumbers = [imageNumber, progressNumber];
  const profiles = [...detail.querySelectorAll('.people-detail-copy')];
  const placeholder = detail.querySelector('.people-detail-placeholder');
  const detailWord = detail.querySelector('.people-detail-word');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let currentProfile = 0;
  let lastWheel = -Infinity;
  let touchStart;

  function cardClip() {
    const card = openers[currentProfile].getBoundingClientRect();
    const headerHeight = parseFloat(getComputedStyle(detail).getPropertyValue('--header-height'));
    const top = Math.max(0, card.top - headerHeight);
    const right = Math.max(0, innerWidth - card.right);
    const bottom = Math.max(0, innerHeight - card.bottom);
    return `inset(${top}px ${right}px ${bottom}px ${Math.max(0, card.left)}px)`;
  }

  function showProfile(index) {
    profiles[currentProfile].hidden = true;
    currentProfile = index;
    const profile = profiles[index];
    profile.hidden = false;
    const number = openers[index].textContent.trim();
    profileNumbers.forEach(element => { element.textContent = number; });
    detail.setAttribute('aria-labelledby', profile.querySelector('h3').id);
    detail.scrollTop = 0;
  }

  function openProfile(index) {
    if (detail.open) return;
    detail.classList.remove('has-profile-switch');
    showProfile(index);
    detail.style.setProperty('--people-image-origin', cardClip());
    lastWheel = performance.now();
    detail.showModal();
    detail.scrollTop = 0;
  }

  async function closeProfile() {
    if (!detail.open || closing) return;
    if (reduced.matches) {
      detail.close();
      return;
    }
    closing = true;

    const captions = [profiles[currentProfile], placeholder, detailWord].map(element => {
      const { opacity, transform } = getComputedStyle(element);
      return { element, opacity, transform };
    });
    const fadeDuration = captions.some(caption => Number(caption.opacity) > 0) ? 450 : 0;
    const animations = captions.map(({ element, opacity, transform }) => element.animate(
      [{ opacity, transform }, { opacity: 0, transform: 'translateY(14px)' }],
      { duration: fadeDuration, easing: 'ease-in-out', fill: 'both' }
    ));
    const clipPath = getComputedStyle(image).clipPath;
    animations.push(image.animate(
      [{ clipPath: clipPath === 'none' ? 'inset(0)' : clipPath }, { clipPath: cardClip() }],
      { duration: 900, delay: fadeDuration, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'both' }
    ));

    await Promise.allSettled(animations.map(animation => animation.finished));
    detail.close();
    animations.forEach(animation => animation.cancel());
    closing = false;
  }

  async function stepProfile(direction) {
    if (closing || profiles[currentProfile].getAnimations()
      .some(animation => animation.playState === 'running')) return;
    const index = currentProfile + direction;
    if (index < 0) {
      closeProfile();
      return;
    }
    if (index >= profiles.length) {
      closing = true;
      const fade = reduced.matches ? null : detail.animate([{ opacity: 1 }, { opacity: 0 }],
        { duration: 300, easing: 'ease-in-out', fill: 'forwards' });
      await fade?.finished.catch(() => {});
      detail.close();
      fade?.cancel();
      closing = false;
      section.dispatchEvent(new Event('people:next-section'));
      return;
    }

    if (!reduced.matches) {
      const outgoing = [profiles[currentProfile], ...profileNumbers].map(element => element.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
      ));
      const results = await Promise.allSettled(outgoing.map(animation => animation.finished));
      outgoing.forEach(animation => animation.cancel());
      if (closing || !detail.open || results.some(result => result.status === 'rejected')) return;
    }

    detail.classList.add('has-profile-switch');
    showProfile(index);
    if (reduced.matches) return;
    [profiles[index], ...profileNumbers].forEach(element => {
      element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 650, easing: 'ease-in-out' });
    });
  }

  function canScrollDetail(direction) {
    return direction < 0 ? detail.scrollTop > 0
      : detail.scrollTop + detail.clientHeight < detail.scrollHeight - 1;
  }

  section.addEventListener('people:advance', event => {
    if (detail.open || !section.classList.contains('is-visible')) return;
    const card = openers[0].getBoundingClientRect();
    if (card.top >= innerHeight || card.bottom <= 0) return;
    event.preventDefault();
    if (lastCard.getAnimations().some(animation => animation.playState === 'running')) return;
    openProfile(0);
  });
  openers.forEach((opener, index) => {
    opener.addEventListener('click', () => openProfile(index));
  });
  detail.addEventListener('cancel', event => {
    event.preventDefault();
    closeProfile();
  });
  detail.addEventListener('close', () => {
    openers[currentProfile].focus({ preventScroll: true });
    section.dispatchEvent(new Event('people:closed'));
  });

  detail.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const direction = Math.sign(event.deltaY);
    if (!direction) return;
    const now = performance.now();
    const continuing = now - lastWheel < 180;
    lastWheel = now;
    if (!closing && canScrollDetail(direction)) return;
    event.preventDefault();
    if (!continuing) stepProfile(direction);
  }, { passive: false });
  detail.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    stepProfile(event.key === 'ArrowRight' ? 1 : -1);
  });
  detail.addEventListener('touchstart', event => {
    const touch = event.touches.length === 1 ? event.touches[0] : null;
    touchStart = touch ? {
      x: touch.clientX,
      y: touch.clientY,
      atTop: !canScrollDetail(-1),
      atBottom: !canScrollDetail(1),
    } : null;
  }, { passive: true });
  detail.addEventListener('touchend', event => {
    const start = touchStart;
    touchStart = null;
    if (!start || event.touches.length) return;
    const touch = event.changedTouches[0];
    const dy = start.y - touch.clientY;
    if (Math.abs(dy) < 48 || Math.abs(dy) <= Math.abs(start.x - touch.clientX) * 1.3) return;
    if (dy > 0 && start.atBottom) stepProfile(1);
    if (dy < 0 && start.atTop) stepProfile(-1);
  }, { passive: true });
  detail.addEventListener('touchcancel', () => { touchStart = null; });
})();
