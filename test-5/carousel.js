'use strict';
(() => {
  const hero = document.querySelector('.grf-hero');
  const controls = hero.querySelector('.hero-carousel-controls');
  const images = [...hero.querySelectorAll('.image-mask img')];
  const [firstLine, introLine, secondLine] = hero.querySelectorAll('.headline-text');
  const lines = [firstLine, secondLine];
  const captions = [...hero.querySelectorAll('.philosophy, .body-copy')];
  const copy = [...lines, ...captions];
  const original = copy.map(element => [...element.childNodes]);
  original[0] = `${firstLine.textContent.trim()} ${introLine.textContent.trim()}`;
  const bodyBreak = document.createElement('br');
  bodyBreak.className = 'slide-copy-break';
  const slides = [
    original,
    [
      'We Support Each Other,',
      'Moving Forward as One Team.',
      '서로에게 힘이 되고, 함께 나아가는 하나의 팀.',
      [
        '선배의 경험이 후배의 든든한 길잡이가 되고, 현장에서는 서로의 고민을 나눕니다.',
        bodyBreak,
        '골든리본패밀리는 경험과 노하우를 공유하며 서로의 성장을 돕는 원팀을 지향합니다.',
      ],
    ],
    [
      'We Build the Foundation',
      'So Planners Can Focus on Their Work.',
      '설계사가 본업에 집중할 수 있도록, 일의 기반부터 단단하게.',
      [
        '가능성을 믿는 것만큼 중요한 것은 그 가능성을 펼칠 수 있는 환경입니다.',
        bodyBreak,
        '골든리본패밀리는 교육과 멘토링, 영업·홍보 지원과 업무 관리 솔루션 F-OCEAN을 통해 설계사의 전문적인 활동을 뒷받침합니다.',
      ],
    ],
  ];
  const buttons = [...controls.querySelectorAll('.hero-carousel-slide')];
  const tracks = buttons.map(button => button.querySelector('.hero-carousel-track > span'));
  const playback = controls.querySelector('.hero-carousel-playback');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const displayTime = 8000;
  const easing = 'cubic-bezier(.22, 1, .36, 1)';
  const copyStyle = getComputedStyle(hero);
  const copyFadeDuration = parseFloat(copyStyle.getPropertyValue('--section-copy-fade-duration'));
  const copyRiseDuration = parseFloat(copyStyle.getPropertyValue('--section-copy-rise-duration'));
  const copyRiseEase = copyStyle.getPropertyValue('--section-copy-rise-ease').trim();
  const copyRiseOffset = copyStyle.getPropertyValue('--section-copy-rise-offset').trim();
  let current = 0;
  let destination = 0;
  let pending = null;
  let changing = false;
  let visible = false;
  let paused = reduced.matches;
  let progress;
  let zoom;

  function prepareZoom(image) {
    if (reduced.matches) return;
    const animation = image.animate(
      [{ transform: 'scale(var(--hero-slide-start-scale))' }, { transform: 'scale(1)' }],
      { duration: displayTime, fill: 'both' },
    );
    animation.pause();
    animation.currentTime = 0;
    return animation;
  }

  function syncPlayback() {
    playback.classList.toggle('is-paused', paused);
    playback.setAttribute('aria-label', paused ? '자동 재생 시작' : '자동 재생 일시 정지');
    if (!progress || progress.playState === 'finished') return;
    if (paused || !visible || document.hidden) {
      progress.pause();
      zoom?.pause();
    } else {
      progress.play();
      zoom?.play();
    }
  }

  function startProgress() {
    progress?.cancel();
    zoom ??= prepareZoom(images[current]);
    progress = tracks[current].animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: displayTime, fill: 'both' },
    );
    syncPlayback();
    progress.finished.then(() => show(current + 1), () => {});
  }

  function move(element, frames, duration, delay = 0, timing = easing) {
    return element.animate(frames, { duration, delay, easing: timing, fill: 'backwards' });
  }

  async function show(index, manual = false) {
    const target = (index + slides.length) % slides.length;
    if (changing) {
      pending = target;
      return;
    }
    if (target === current) return;
    destination = target;
    changing = true;
    progress?.cancel();
    progress = null;
    const previousZoom = zoom;
    previousZoom?.pause();
    const animate = !reduced.matches;

    if (animate) {
      const exits = copy.map((element, i) => element.animate(
        [{ transform: 'translateY(0)', opacity: 1 },
          { transform: i < lines.length ? 'translateY(-125%)' : 'translateY(-10px)', opacity: 0 }],
        { duration: 220, easing: 'ease-in', fill: 'forwards' },
      ));
      await Promise.all(exits.map(exit => exit.finished));
      exits.forEach(exit => exit.cancel());
    }

    const previous = images[current];
    previous.classList.replace('is-current', 'is-previous');
    previous.setAttribute('aria-hidden', 'true');
    buttons[current].removeAttribute('aria-current');
    current = target;
    const image = images[current];
    zoom = prepareZoom(image);
    image.classList.add('is-current');
    image.removeAttribute('aria-hidden');
    buttons[current].setAttribute('aria-current', 'true');
    copy.forEach((element, i) => {
      const parts = [slides[current][i]].flat();
      element.replaceChildren(...parts.map(part => typeof part === 'string' ? part : part.cloneNode(true)));
    });
    hero.dispatchEvent(new Event('grf:hero-copy-change'));
    if (manual) hero.querySelector('#status').textContent = `슬라이드 ${current + 1} / ${slides.length}`;

    if (animate) {
      const entrances = [
        move(image, [{ opacity: 0 }, { opacity: 1 }], 620),
        ...lines.map((line, i) => move(line,
          [{ transform: 'translateY(125%)' }, { transform: 'translateY(0)' }], 650, 90 + i * 100)),
        ...captions.flatMap((caption, i) => {
          const delay = 570 + i * 160;
          return [
            move(caption, [{ opacity: 0 }, { opacity: getComputedStyle(caption).opacity }], copyFadeDuration, delay, 'ease'),
            move(caption, [{ transform: `translateY(${copyRiseOffset})` }, { transform: 'translateY(0)' }],
              copyRiseDuration, delay, copyRiseEase),
          ];
        }),
      ];
      await entrances[0].finished;
      previous.classList.remove('is-previous');
      previousZoom?.cancel();
      await Promise.all(entrances.map(entrance => entrance.finished));
    } else {
      previous.classList.remove('is-previous');
      previousZoom?.cancel();
    }

    changing = false;
    const next = pending;
    pending = null;
    if (next !== null && next !== current) show(next, true);
    else startProgress();
  }

  function step(amount) {
    show((pending ?? destination) + amount, true);
  }

  controls.querySelectorAll('[data-slide-step]').forEach(button => {
    button.addEventListener('click', () => step(Number(button.dataset.slideStep)));
  });
  buttons.forEach((button, i) => button.addEventListener('click', () => show(i, true)));
  controls.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  });
  playback.addEventListener('click', () => {
    paused = !paused;
    syncPlayback();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      paused = true;
      zoom?.cancel();
      zoom = undefined;
    }
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
    syncPlayback();
  }, { threshold: 0.35 }).observe(hero.querySelector('.scene'));

  hero.addEventListener('grf:hero-slide-layout', () => {
    firstLine.textContent = original[0];
    introLine.parentElement.remove();
  }, { once: true });
  hero.addEventListener('grf:hero-ready', startProgress, { once: true });
  syncPlayback();
})();
