'use strict';
(() => {
  const section = document.querySelector('.grf-support');
  if (!section || !('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const photo = section.querySelector('.support-photo');
  const visual = section.querySelector('.support-visual');
  const details = section.querySelector('.support-details');
  const introduction = section.querySelector('.support-introduction');
  const heading = section.querySelector('h2');
  const cta = section.querySelector('.support-cta');
  let active = false, generation = 0;
  const settled = element => Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {})));
  function syncSubject() {
    if (!photo.naturalWidth) return;
    const width = visual.clientWidth, height = visual.clientHeight;
    const scale = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
    const renderedWidth = photo.naturalWidth * scale;
    const objectPosition = matchMedia('(max-width: 767px)').matches ? .58 : .55;
    const subjectX = renderedWidth * .55 - (renderedWidth - width) * objectPosition;
    section.style.setProperty('--support-photo-shift', (width * .825 - subjectX) + 'px');
  }
  photo.addEventListener('load', syncSubject);
  addEventListener('resize', syncSubject);
  syncSubject();
  if (section.dataset.motionPreview === 'final') {
    section.classList.add('is-title-visible', 'is-focused', 'is-cta-visible');
    return;
  }
  function reset() {
    active = false;
    generation++;
    section.classList.add('is-resetting');
    section.classList.remove('is-title-visible', 'is-focused', 'is-details-visible', 'is-cards-visible', 'is-cta-visible');
    details.inert = true;
    details.setAttribute('aria-hidden', 'true');
    if (cta) {
      cta.style.setProperty('--mag-x', '0px');
      cta.style.setProperty('--mag-y', '0px');
    }
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
    details.removeAttribute('aria-hidden');
    await settled(introduction);
    if (id !== generation) return;
    details.inert = false;
    section.classList.add('is-cards-visible');
    await new Promise(resolve => setTimeout(resolve, 60));
    if (id !== generation) return;
    const cards = section.querySelectorAll('.support-card');
    await Promise.all([...cards].map(settled));
    if (id !== generation) return;
    await new Promise(resolve => setTimeout(resolve, 250));
    if (id !== generation) return;
    section.classList.add('is-cta-visible');
  }
  function finish() {
    generation++;
    section.classList.add('is-title-visible', 'is-focused', 'is-details-visible', 'is-cards-visible', 'is-cta-visible');
    details.inert = false;
    details.removeAttribute('aria-hidden');
  }
  section.classList.add('is-motion-ready');
  reset();
  const entryObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) enter();
  }, { rootMargin: '0px 0px -85% 0px', threshold: 0 });
  const exitObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => !entry.isIntersecting)) reset();
  }, { rootMargin: '-1px 0px -1px 0px', threshold: 0 });
  entryObserver.observe(section);
  exitObserver.observe(section);
  if (cta && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let bound = null;
    const updateBound = () => { bound = cta.getBoundingClientRect(); };
    cta.addEventListener('pointerenter', updateBound);
    cta.addEventListener('pointermove', e => {
      if (!bound) updateBound();
      const relX = e.clientX - (bound.left + bound.width / 2);
      const relY = e.clientY - (bound.top + bound.height / 2);
      cta.style.setProperty('--mag-x', `${(relX * 0.28).toFixed(1)}px`);
      cta.style.setProperty('--mag-y', `${(relY * 0.28).toFixed(1)}px`);
    });
    cta.addEventListener('pointerleave', () => {
      cta.style.setProperty('--mag-x', '0px');
      cta.style.setProperty('--mag-y', '0px');
      bound = null;
    });
  }
})();

