'use strict';

if (document.body.classList.contains('grf-sub') && typeof window.Lenis === 'function') {
  new window.Lenis({
    autoRaf: true,
    anchors: true,
    lerp: 0.085,
    stopInertiaOnNavigate: true,
  });
}

document.querySelectorAll('.support-benefit-items > li').forEach((item, index) => {
  const heading = item.querySelector('h3');
  const preview = document.createElement('div');
  preview.className = 'support-detail-preview';
  preview.id = `support-detail-preview-${index + 1}`;
  preview.setAttribute('aria-hidden', 'true');

  item.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const itemBounds = item.getBoundingClientRect();
    const gap = 14;
    const previewWidth = preview.offsetWidth;
    const previewHeight = preview.offsetHeight;
    const left = event.clientX + gap + previewWidth <= document.documentElement.clientWidth
      ? event.clientX + gap : event.clientX - gap - previewWidth;
    const top = event.clientY + gap + previewHeight <= window.innerHeight
      ? event.clientY + gap : event.clientY - gap - previewHeight;
    item.style.setProperty('--preview-x', `${Math.max(0, left) - itemBounds.left}px`);
    item.style.setProperty('--preview-y', `${Math.max(0, top) - itemBounds.top - item.clientTop}px`);
  });
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'support-detail-toggle';
  toggle.setAttribute('aria-label', `${heading.textContent.trim()} 이미지 미리보기`);
  toggle.setAttribute('aria-controls', preview.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
  toggle.addEventListener('keydown', event => {
    if (event.key === 'Escape') toggle.setAttribute('aria-expanded', 'false');
  });
  heading.append(toggle);
  item.append(preview);
});

const applicationForm = document.querySelector('.application-form');
if (applicationForm) {
  const status = applicationForm.querySelector('.application-status');
  const inquiryType = applicationForm.elements.namedItem('inquiryType');
  if (inquiryType && new URLSearchParams(window.location.search).get('type') === 'f-ocean') {
    inquiryType.value = 'f-ocean';
  }
  applicationForm.addEventListener('submit', event => {
    event.preventDefault();
    status.hidden = false;
    status.textContent = applicationForm.dataset.previewStatus
      ?? '필수 항목을 확인했습니다. 미리보기에서는 지원서가 접수되지 않습니다.';
  });
  applicationForm.querySelector('.application-submit').disabled = false;
}

(() => {
  const canvases = document.querySelectorAll('.about-value-motion');
  if (!canvases.length) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const turn = Math.PI * 2;
  const points = [];
  const gridRadius = 9;
  for (let row = -gridRadius; row <= gridRadius; row++) {
    for (let column = -gridRadius; column <= gridRadius; column++) {
      const x = column / gridRadius;
      const y = row / gridRadius;
      if (x ** 2 + y ** 2 > 29 / 25) continue;
      points.push({ x, y, z: 0.55 * (x ** 2 - y ** 2) });
    }
  }

  const ringPoints = [];
  for (const tilt of [-Math.PI / 3, Math.PI / 3]) {
    for (const radius of [0.69, 0.78, 0.87]) {
      for (let index = 0; index < 42; index++) {
        const angle = index / 42 * turn;
        const vertical = radius * Math.sin(angle);
        ringPoints.push({
          x: radius * Math.cos(angle),
          y: vertical * Math.cos(tilt),
          z: vertical * Math.sin(tilt),
        });
      }
    }
  }

  const cubePoints = [];
  for (let axis = 0; axis < 3; axis++) {
    for (const side of [-0.9, 0.9]) {
      for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
          const face = [side, (row - 3.5) * 0.22, (column - 3.5) * 0.22];
          const core = face.map(value => Math.max(-0.64, Math.min(0.64, value)));
          const offset = face.map((value, index) => value - core[index]);
          const rounding = 0.26 / Math.hypot(...offset);
          const [x, y, z] = core.map((value, index) => value + offset[index] * rounding);
          if (axis === 0) cubePoints.push({ x, y, z });
          if (axis === 1) cubePoints.push({ x: z, y: x, z: y });
          if (axis === 2) cubePoints.push({ x: y, y: z, z: x });
        }
      }
    }
  }

  function setupMotion(canvas) {
    const context = canvas.getContext('2d');
    if (!context) return;

    const startAngle = Number(canvas.dataset.startAngle ?? 0.48);
    const isRings = canvas.dataset.shape === 'rings';
    const isCube = canvas.dataset.shape === 'cube';
    const shape = isCube ? cubePoints : isRings ? ringPoints : points;
    const rotationDuration = isCube ? 16000 : isRings ? 14000 : 12000;
    let visible = false;
    let frame = 0;
    let width = 0;
    let height = 0;

    function draw(time) {
      const angle = time / rotationDuration * turn + startAngle;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const scale = Math.min(width, height) * 0.32;
      const shapeScale = isRings ? height * 0.45 : isCube ? height * 0.29 : scale;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#896c38';

      const projected = shape.map(({ x, y, z }) => {
        const horizontal = x * cosine + z * sine;
        const depth = z * cosine - x * sine;
        if (isCube) {
          const vertical = y * 0.94 - depth * 0.34;
          return {
            x: horizontal * 0.978 - vertical * 0.208,
            y: horizontal * 0.208 + vertical * 0.978,
            depth: y * 0.34 + depth * 0.94,
          };
        }
        return {
          x: horizontal * 0.96 - y * 0.28,
          y: horizontal * 0.28 + y * 0.96,
          depth,
        };
      }).sort((a, b) => a.depth - b.depth);

      for (const point of projected) {
        const perspective = 1 / (1 - point.depth * 0.25);
        context.globalAlpha = 0.52 + point.depth * 0.32;
        context.beginPath();
        context.arc(
          width / 2 + point.x * shapeScale * perspective,
          height / 2 + point.y * shapeScale * perspective,
          scale * 0.021 * perspective ** 2,
          0,
          turn,
        );
        context.fill();
      }
    }

    function animate(time) {
      draw(time);
      frame = requestAnimationFrame(animate);
    }

    function syncMotion() {
      cancelAnimationFrame(frame);
      draw(0);
      if (visible && !reducedMotion.matches) frame = requestAnimationFrame(animate);
    }

    new ResizeObserver(([entry]) => {
      ({ width, height } = entry.contentRect);
      const density = Math.min(devicePixelRatio, 2);
      canvas.width = Math.max(1, Math.round(width * density));
      canvas.height = Math.max(1, Math.round(height * density));
      context.setTransform(density, 0, 0, density, 0, 0);
      draw(0);
    }).observe(canvas);

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncMotion();
    }).observe(canvas);
    reducedMotion.addEventListener('change', syncMotion);
  }

  canvases.forEach(setupMotion);
})();

(() => {
  if (!('IntersectionObserver' in window)) return;

  const blocks = document.querySelectorAll('.grf-sub [data-sub-reveal]');
  const visiblePortion = 0.25;
  const observer = new IntersectionObserver((entries) => {
    for (const { target, intersectionRatio } of entries) {
      if (intersectionRatio < visiblePortion) continue;
      target.classList.add('is-revealed');
      observer.unobserve(target);
    }
  }, { threshold: visiblePortion, rootMargin: '0px 0px -40px 0px' });

  for (const block of blocks) {
    block.classList.add('is-reveal-ready');
    observer.observe(block);
  }
})();
