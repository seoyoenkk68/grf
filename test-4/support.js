'use strict';
(() => {
  const section = document.querySelector('.grf-support');
  if (!section || !('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const photo = section.querySelector('.support-photo');
  const visual = section.querySelector('.support-visual');
  const details = section.querySelector('.support-details');
  const introduction = section.querySelector('.support-introduction');
  const benefitBoxes = [...section.querySelectorAll('.support-benefit-box')];
  const detailsButton = section.querySelector('.support-details-button');
  const heading = section.querySelector('h2');
  let active = false, generation = 0;
  const settled = element => Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {})));
  function syncSubject() {
    if (!photo.naturalWidth) return;
    const width = visual.clientWidth, height = visual.clientHeight;
    const scale = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
    const renderedWidth = photo.naturalWidth * scale;
    const objectPosition = matchMedia('(max-width: 767px)').matches ? .58 : .55;
    const subjectX = renderedWidth * .55 - (renderedWidth - width) * objectPosition;
    const maskStart = parseFloat(getComputedStyle(section).getPropertyValue('--support-photo-start')) / 100;
    const maskCenter = width * (maskStart + 1) / 2;
    section.style.setProperty('--support-photo-shift', (maskCenter - subjectX) + 'px');
  }
  photo.addEventListener('load', syncSubject);
  addEventListener('resize', syncSubject);
  syncSubject();
  if (section.dataset.motionPreview === 'final') {
    section.classList.add('is-title-visible', 'is-focused');
    return;
  }
  function reset() {
    active = false;
    generation++;
    section.classList.add('is-resetting');
    section.classList.remove('is-final-frame');
    section.classList.remove('is-title-visible', 'is-focused', 'is-details-visible', 'is-benefit-summary-visible', 'is-details-button-visible', 'is-scroll-cue-visible');
    details.inert = true;
    details.setAttribute('aria-hidden', 'true');
    section.getBoundingClientRect();
    section.classList.remove('is-resetting');
  }
  async function enter() {
    if (active) return;
    active = true;
    const id = ++generation;
    if (reduced.matches) { finish(); return; }
    syncSubject();
    section.classList.add('is-title-visible');
    await Promise.all([...section.querySelectorAll('.support-title-line > span')].map(settled));
    if (id !== generation) return;
    if (!reduced.matches) await new Promise(resolve => setTimeout(resolve, 700));
    if (id !== generation) return;
    syncSubject();
    section.classList.add('is-focused');
    await Promise.all([settled(visual), settled(photo), settled(heading)]);
    if (id !== generation) return;
    section.classList.add('is-details-visible');
    details.inert = false;
    details.removeAttribute('aria-hidden');
    await settled(introduction);
    if (id !== generation) return;
    section.classList.add('is-benefit-summary-visible');
    await Promise.all(benefitBoxes.map(settled));
    if (id !== generation) return;
    section.classList.add('is-details-button-visible');
    await settled(detailsButton);
    if (id !== generation) return;
    section.classList.add('is-scroll-cue-visible');
  }
  function finish() {
    active = true;
    generation++;
    section.classList.add('is-title-visible', 'is-focused', 'is-details-visible', 'is-benefit-summary-visible', 'is-details-button-visible', 'is-scroll-cue-visible');
    details.inert = false;
    details.removeAttribute('aria-hidden');
  }
  section.addEventListener('support:show-final', () => {
    section.classList.add('is-resetting', 'is-final-frame');
    finish();
    section.getBoundingClientRect();
    section.classList.remove('is-resetting');
  });
  section.classList.add('is-motion-ready');
  reset();
  const entryObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) enter();
  }, { rootMargin: '0px 0px -85% 0px', threshold: 0 });
  const exitObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => !entry.isIntersecting)) reset();
  }, { rootMargin: '-1px 0px -1px 0px', threshold: 0 });
  entryObserver.observe(section);
  // A horizontal slide keeps the support scene ready for the return trip.
  exitObserver.observe(section.closest('.section-spread') || section);
})();
