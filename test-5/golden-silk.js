'use strict';

(() => {
  const section = document.getElementById('section-05');
  const intro = section?.querySelector('.section-fifth-intro');
  const container = intro?.querySelector('#golden-silk') ?? section?.querySelector('.section-fifth-silk');
  if (!container) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let threePromise;
  let disposeSilk;
  let active = false;
  let generation = 0;
  let sectionInView = false;
  let introFinished = false;
  const observeIntersection = 'IntersectionObserver' in window;

  let letterIndex = 0;
  for (const line of intro?.querySelectorAll('.silk-line') ?? []) {
    const words = line.textContent.trim().split(/\s+/);
    line.replaceChildren();
    for (const word of words) {
      if (line.childNodes.length) line.append(' ');
      const wordSpan = document.createElement('span');
      wordSpan.className = 'silk-word';
      for (const character of word) {
        const mask = document.createElement('span');
        const letter = document.createElement('span');
        mask.className = 'silk-letter';
        letter.textContent = character;
        letter.style.setProperty('--silk-letter-index', letterIndex++);
        mask.append(letter);
        wordSpan.append(mask);
      }
      line.append(wordSpan);
    }
  }
  if (intro) section.style.setProperty('--fifth-last-letter', Math.max(0, letterIndex - 1));

  function loadThree() {
    threePromise ??= import('https://esm.sh/three@0.180.0').catch(() => null);
    return threePromise;
  }

  function stopSilk() {
    generation++;
    disposeSilk?.();
    disposeSilk = undefined;
  }

  async function syncSilk() {
    const inView = observeIntersection ? sectionInView : section.classList.contains('is-visible');
    const visible = inView && !introFinished && !reducedMotion.matches;
    if (visible === active) return;
    active = visible;
    if (!active) {
      stopSilk();
      return;
    }

    const entry = ++generation;
    const THREE = await loadThree();
    if (!THREE || entry !== generation) return;

    try {
      disposeSilk = createSilk(THREE, container);
    } catch {
      // Leave the section's CSS background visible without WebGL.
    }
  }

  if (observeIntersection) {
    const observer = new IntersectionObserver(([entry]) => {
      sectionInView = entry.isIntersecting;
      syncSilk();
    });
    observer.observe(section);
  }
  new MutationObserver(() => {
    if (!section.classList.contains('is-visible')) introFinished = false;
    syncSilk();
  }).observe(section, { attributes: true, attributeFilter: ['class'] });
  intro?.addEventListener('animationend', event => {
    if (event.target === intro && event.animationName === 'section-fifth-silk-lift') {
      introFinished = true;
      syncSilk();
    }
  });
  reducedMotion.addEventListener('change', syncSilk);

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const preload = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      loadThree();
      preload.disconnect();
    }, { rootMargin: '100% 0px' });
    preload.observe(section);
  }
  syncSilk();
})();

function createSilk(THREE, container) {
  const settings = {
    speed: 1.0,
    amplitude: 1.0,
    foldScale: 1.0,
    extraFold: 0.75,
    shine: 0.8,
    exposure: 1.0,
  };
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(0, 0, 12);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = settings.exposure;

  const uniforms = {
    uTime: { value: 0 },
    uAmplitude: { value: settings.amplitude },
    uFoldScale: { value: settings.foldScale },
    uExtraFold: { value: settings.extraFold },
    uShine: { value: settings.shine },
  };

  const surfaceGLSL = `
    uniform float uTime;
    uniform float uAmplitude;
    uniform float uFoldScale;
    uniform float uExtraFold;

    float silkSurface(vec2 p) {

      float t = uTime;

      float a = p.x * 0.70 + p.y * 0.46;
      float b = p.x * -0.35 + p.y * 0.92;

      float distortion =
        sin(b * 0.34 + t * 0.30) * 0.60 +
        sin(a * 0.27 - t * 0.22) * 0.36;

      float foldCoord =
        a * uFoldScale + distortion;

      float largeFold =
        sin(
          foldCoord * 0.83 -
          t * 0.40
        ) * 0.85;

      float middleFold =
        sin(
          foldCoord * 1.75 +
          b * 0.13 +
          t * 0.23
        ) * 0.28;

      float smallFold =
        sin(
          foldCoord * 3.10 -
          b * 0.12 -
          t * 0.18
        ) * 0.065;

      float extraCoord =
        p.x * 0.49 -
        p.y * 0.64 +
        1.65;

      extraCoord +=
        sin(p.y * 0.26 + t * 0.20) * 0.40;

      float extraWave =
        sin(
          extraCoord * 0.66 +
          t * 0.18
        );

      float extraLargeFold =
        extraWave * uExtraFold;

      float breathing =
        sin(
          p.x * 0.19 +
          p.y * 0.24 +
          t * 0.30
        ) * 0.22;

      return (
        largeFold +
        middleFold +
        smallFold +
        extraLargeFold +
        breathing
      ) * uAmplitude;
    }
  `;

  const geometry = new THREE.PlaneGeometry(48, 48, 64, 64);
  const material = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.DoubleSide,

    vertexShader: `
      ${surfaceGLSL}

      varying vec2 vPlanePosition;

      void main() {

        vec3 p = position;

        vPlanePosition = p.xy;

        p.z = silkSurface(p.xy);

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(p, 1.0);
      }
    `,

    fragmentShader: `
      ${surfaceGLSL}

      uniform float uShine;

      varying vec2 vPlanePosition;

      void main() {

        vec2 p = vPlanePosition;

        float eps = 0.012;

        float hL = silkSurface(
          p - vec2(eps, 0.0)
        );

        float hR = silkSurface(
          p + vec2(eps, 0.0)
        );

        float hD = silkSurface(
          p - vec2(0.0, eps)
        );

        float hU = silkSurface(
          p + vec2(0.0, eps)
        );

        float slopeX =
          (hR - hL) / (2.0 * eps);

        float slopeY =
          (hU - hD) / (2.0 * eps);

        vec3 N = normalize(
          vec3(-slopeX, -slopeY, 1.0)
        );

        vec3 L1 = normalize(
          vec3(-0.55, 0.72, 0.85)
        );

        vec3 L2 = normalize(
          vec3(0.78, -0.35, 0.65)
        );

        vec3 L3 = normalize(
          vec3(0.18, 0.90, 0.45)
        );

        vec3 V = vec3(0.0, 0.0, 1.0);

        float diff1 =
          max(dot(N, L1), 0.0);

        float diff2 =
          max(dot(N, L2), 0.0);

        float diff3 =
          max(dot(N, L3), 0.0);

        vec3 H1 = normalize(L1 + V);
        vec3 H2 = normalize(L2 + V);

        float spec1 = pow(
          max(dot(N, H1), 0.0),
          18.0
        );

        float spec2 = pow(
          max(dot(N, H2), 0.0),
          34.0
        );

        vec3 deepShadow = vec3(
          0.23, 0.145, 0.085
        ) * 0.86;

        vec3 shadowGold = vec3(
          0.39, 0.255, 0.145
        );

        vec3 baseGold = vec3(
          0.62, 0.445, 0.275
        );

        vec3 warmGold = vec3(
          0.82, 0.645, 0.420
        );

        vec3 silkHighlight = vec3(
          1.0, 0.89, 0.68
        );

        float light =
          diff1 * 0.72 +
          diff2 * 0.20 +
          diff3 * 0.14;

        vec3 color = mix(
          deepShadow,
          shadowGold,
          smoothstep(0.10, 0.34, light)
        );

        color = mix(
          color,
          baseGold,
          smoothstep(0.28, 0.66, light)
        );

        color = mix(
          color,
          warmGold,
          smoothstep(0.52, 0.96, light)
        );

        float broadReflection =
          pow(diff1, 3.0);

        color +=
          warmGold *
          broadReflection *
          0.12;

        color +=
          silkHighlight *
          spec1 *
          0.67 *
          uShine;

        color +=
          silkHighlight *
          spec2 *
          0.24 *
          uShine;

        gl_FragColor = vec4(color, 1.0);

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  });
  scene.add(new THREE.Mesh(geometry, material));
  container.appendChild(renderer.domElement);

  function resize() {
    const { clientWidth: width, clientHeight: height } = container;
    if (!width || !height) return;
    const aspect = width / height;
    const visibleHeight = Math.min(8.5, 46 / aspect);
    const visibleWidth = visibleHeight * aspect;
    camera.left = -visibleWidth / 2;
    camera.right = visibleWidth / 2;
    camera.top = visibleHeight / 2;
    camera.bottom = -visibleHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  resize();
  window.addEventListener('resize', resize);
  const start = performance.now();
  renderer.setAnimationLoop(now => {
    uniforms.uTime.value = (now - start) / 1000 * settings.speed;
    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    window.removeEventListener('resize', resize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
