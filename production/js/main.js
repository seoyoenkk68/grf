'use strict';

/* Hero intro */
(() => {
  const hero=document.querySelector('.grf-hero');
  if(!hero)return;
  const select=selector=>hero.querySelector(selector);
  const mask=select('.image-mask'),image=mask.querySelector('img'),logo=select('.intro-logo');
  const header=select('.header'),caption=select('.editorial-note');
  const lines=[...hero.querySelectorAll('.headline-text')],reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:767px)');
  const captions=[...caption.querySelectorAll('.philosophy, .body-copy')];
  const copyStyle=getComputedStyle(hero);
  const copyFadeDuration=parseFloat(copyStyle.getPropertyValue('--section-copy-fade-duration'));
  const copyRiseDuration=parseFloat(copyStyle.getPropertyValue('--section-copy-rise-duration'));
  const copyRiseEase=copyStyle.getPropertyValue('--section-copy-rise-ease').trim();
  const copyRiseOffset=copyStyle.getPropertyValue('--section-copy-rise-offset').trim();
  let animations=[],generation=0,ready=false;
  function syncIntroLogo(){
    const brand=select('.brand'),family=brand.querySelector('span');
    const main=getComputedStyle(brand),child=getComputedStyle(family),size=parseFloat(main.fontSize);
    logo.style.setProperty('--family-ratio',parseFloat(child.fontSize)/size);
    logo.style.setProperty('--family-gap',(parseFloat(child.marginTop)||0)/size+'em');
    logo.style.letterSpacing=main.letterSpacing==='normal'?'normal':parseFloat(main.letterSpacing)/size+'em';
  }
  function fit(){
    const heading=select('h1');heading.style.fontSize='';if(mobile.matches)return;
    const size=parseFloat(getComputedStyle(heading).fontSize),width=heading.clientWidth;
    const ratio=Math.min(1,...lines.filter(line=>line.isConnected).map(line=>width/line.scrollWidth));
    if(ratio<1)heading.style.fontSize=Math.floor(size*ratio*.98)+'px';
  }
  function motion(element,frames,duration,delay=0,easing='cubic-bezier(.22,1,.36,1)'){
    const animation=element.animate(frames,{duration,delay,easing,fill:'both'});animations.push(animation);return animation;
  }
  function paintedImage(box, fit, position){
    const scale=(fit==='contain'?Math.min:Math.max)(box.width/image.naturalWidth,box.height/image.naturalHeight);
    const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
    const [x,y]=position.split(' ').map(value=>parseFloat(value)/100);
    return {left:box.left+(box.width-width)*x,top:box.top+(box.height-height)*y,width,height};
  }
  function finish(){
    showSlideLayout();
    generation++;hero.classList.remove('intro-start-preview','mask-expanding','header-entering');
    hero.classList.add('intro-complete');animations.forEach(a=>a.cancel());animations=[];
    document.documentElement.classList.remove('grf-intro-locked');
    select('#status').textContent='인트로 재생 완료';
    hero.dispatchEvent(new Event('grf:hero-ready'));
  }
  function showSlideLayout(){
    if(hero.classList.contains('hero-slide-layout'))return;
    hero.classList.add('hero-slide-layout');
    select('.scene-copy').append(...captions,select('.hero-carousel-controls'));
    select('.scene').append(select('.scroll-cue'));
    hero.dispatchEvent(new Event('grf:hero-slide-layout'));
    fit();
  }
  async function play(){
    if(hero.classList.contains('hero-slide-layout'))return;
    generation++;animations.forEach(a=>a.cancel());animations=[];
    const id=generation;
    hero.classList.remove('intro-complete','card-arrived','logo-revealed','mask-expanded','mask-expanding','header-entering','headline-entering');
    hero.classList.add('intro-start-preview');
    document.documentElement.classList.add('grf-intro-locked');
    if(!ready)return;if(reduced.matches){finish();return;}
    const current=()=>id===generation;
    try{
      await motion(select('.intro-card-motion'),[{transform:`translateY(${mobile.matches?'78%':'54%'})`},{transform:'translateY(0)'}],1500,150).finished;
      if(!current())return;hero.classList.add('card-arrived');
      await motion(select('.intro-logo-reveal'),[
        {clipPath:'polygon(0% 0%,0% 0%,-25% 100%,0% 100%)'},
        {clipPath:'polygon(0% 0%,125% 0%,100% 100%,0% 100%)'}
      ],1400,120,'cubic-bezier(.25,.1,.25,1)').finished;
      if(!current())return;hero.classList.add('logo-revealed','mask-expanding');
      await motion(logo,[{opacity:1},{opacity:0}],500,400,'ease-in-out').finished;
      if(!current())return;
      const duration=mobile.matches?1700:2400,easing='cubic-bezier(.65,0,.25,1)';
      const preview=mask.getBoundingClientRect();
      const horizontalInset=preview.width*(mobile.matches?.16:.34);
      const verticalInset=preview.height*(mobile.matches?.12:.24);
      const radius=mobile.matches?16:24;
      const imageStyle=getComputedStyle(image);
      const position=imageStyle.objectPosition;
      const slideScale=parseFloat(imageStyle.getPropertyValue('--hero-slide-start-scale'));
      const previewImage=image.naturalWidth ? paintedImage(image.getBoundingClientRect(),imageStyle.objectFit,position) : null;
      showSlideLayout();
      const full=mask.getBoundingClientRect();
      const startClip=`inset(${preview.top-full.top+verticalInset}px ${full.right-preview.right+horizontalInset}px ${full.bottom-preview.bottom+verticalInset}px ${preview.left-full.left+horizontalInset}px round ${radius}px)`;
      const opening=motion(mask,[{clipPath:startClip},{clipPath:'inset(0% 0% round 0px)'}],duration,0,easing);
      let zoomFrames=[{transform:`scale(${mobile.matches?.97:.92})`},{transform:'scale(var(--hero-slide-start-scale))'}];
      if(previewImage){
        // Match the pixels inside the card before opening the full-screen crop.
        const fullImage=paintedImage({
          left:full.left-full.width*(slideScale-1)/2,top:full.top-full.height*(slideScale-1)/2,
          width:full.width*slideScale,height:full.height*slideScale
        },'cover',position);
        const imageBox={
          left:`${fullImage.left-full.left}px`,top:`${fullImage.top-full.top}px`,
          width:`${fullImage.width}px`,height:`${fullImage.height}px`,transformOrigin:'0 0'
        };
        const x=previewImage.left-fullImage.left,y=previewImage.top-fullImage.top;
        const scale=previewImage.width/fullImage.width;
        zoomFrames=[
          {...imageBox,transform:`translate(${x}px, ${y}px) scale(${scale})`},
          {...imageBox,transform:'translate(0px, 0px) scale(1)'}
        ];
      }
      const zoom=motion(image,zoomFrames,duration,0,easing);
      opening.startTime=zoom.startTime=document.timeline.currentTime;
      await Promise.all([opening.finished,zoom.finished]);
      if(!current())return;hero.classList.add('mask-expanded','headline-entering');hero.classList.remove('mask-expanding');
      // Keep the original image bright until expansion ends; darken with the headline.
      const shadeEntrance=motion(select('.shade'),[{opacity:.06},{opacity:1}],1400,0,'ease-in-out');
      // Each line moves through its own fixed clipping window. No opacity animation.
      const headlineEntrances=lines.filter(line=>line.isConnected).map((line,i)=>motion(line,[{transform:'translateY(125%)'},{transform:'translateY(0)'}],950,120+i*240));
      hero.classList.add('header-entering');
      const headerEntrance=motion(header,[{transform:'translateY(-115%)'},{transform:'translateY(0)'}],1050,450);
      const captionEntrances=captions.flatMap((element,i)=>{
        const delay=850+i*200;
        return [
          motion(element,[{opacity:0},{opacity:getComputedStyle(element).opacity}],copyFadeDuration,delay,'ease'),
          motion(element,[{transform:`translateY(${copyRiseOffset})`},{transform:'translateY(0)'}],copyRiseDuration,delay,copyRiseEase)
        ];
      });
      const cue=select('.scroll-cue');
      const cueEntrance=motion(cue,[
        {transform:'translateY(12px)',opacity:0},{transform:'translateY(0)',opacity:getComputedStyle(cue).opacity}
      ],600,1250);
      await Promise.all([shadeEntrance, ...headlineEntrances,headerEntrance,...captionEntrances,cueEntrance].map(animation=>animation.finished));
      if(current())finish();
    }catch{if(current())finish();}
  }
  document.documentElement.classList.add('grf-intro-locked');
  window.scrollTo(0,0);
  syncIntroLogo();hero.classList.add('intro-start-preview');
  hero.addEventListener('grf:hero-copy-change',fit);
  reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
  addEventListener('resize',()=>{syncIntroLogo();if(animations.length)finish();fit();});
  if (['#support', '#section-03', '#section-04', '#section-05', '#section-06'].includes(location.hash)) {
    queueMicrotask(finish);
    return;
  }
  Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,4000))]).then(async()=>{
    try{await image.decode();}catch{}ready=true;syncIntroLogo();fit();play();
  });
})();

/* Hero carousel */
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
  const philosophyBreak = document.createElement('br');
  philosophyBreak.className = 'philosophy-mobile-break';
  const slides = [
    original,
    [
      'We Support Each Other,',
      'Moving Forward as One Team.',
      ['서로에게 힘이 되고,', philosophyBreak, ' 함께 나아가는 하나의 팀.'],
      [
        '선배의 경험이 후배의 든든한 길잡이가 되고, 현장에서는 서로의 고민을 나눕니다.',
        bodyBreak,
        ' 골든리본패밀리는 경험과 노하우를 공유하며 서로의 성장을 돕는 원팀을 지향합니다.',
      ],
    ],
    [
      'We Build the Foundation',
      'So Planners Can Focus on Their Work.',
      ['설계사가 본업에 집중할 수 있도록,', philosophyBreak, ' 일의 기반부터 단단하게.'],
      [
        '가능성을 믿는 것만큼 중요한 것은 그 가능성을 펼칠 수 있는 환경입니다.',
        bodyBreak,
        ' 골든리본패밀리는 교육과 멘토링, 영업·홍보 지원과 업무 관리 솔루션 F-OCEAN을 통해 설계사의 전문적인 활동을 뒷받침합니다.',
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

/* Section navigation, snapping and indicators */
// One easing curve for the vertical entry and the horizontal panels.
(() => {
  const hero = document.getElementById('top');
  const spread = document.querySelector('.section-spread');
  const panels = [...spread.children];
  const fourth = document.getElementById('section-04');
  const fourthTitle = fourth.querySelector('#people-title');
  const fifth = document.getElementById('section-05');
  const sixth = document.getElementById('section-06');
  const partners = document.querySelector('.section-partners');
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
    if (word === 'RIBBON') careersLetters.append(document.createElement('br'));
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
  let footerFrame = 0;
  let footerTarget;
  let footerPosition;
  let footerTime;
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
    const section = sixth.getBoundingClientRect();
    const entered = desktop.matches
      ? current === sixth
      : section.bottom > 0 && careersEyebrow.getBoundingClientRect().top <= innerHeight * 0.85;
    if (!entered || section.bottom <= 0) {
      if (!moving) {
        sixth.classList.remove('is-intro-playing');
      }
      if (section.top >= innerHeight) {
        sixth.classList.remove('is-intro-playing');
        sixth.classList.remove('is-visible');
      }
      return;
    }
    if ((moving && desktop.matches) || sixth.classList.contains('is-visible')) return;
    if (scrollDirection > 0 && !reduced.matches) {
      const title = careersEyebrow.getBoundingClientRect();
      const introCenter = section.top + Math.min(section.height, innerHeight) / 2 + header.offsetHeight / 4;
      careersEyebrow.style.setProperty('--sixth-intro-offset', `${introCenter - title.top - title.height / 2}px`);
      careersEyebrow.style.setProperty('--sixth-intro-scale', Math.min(4, section.width * 0.86 / title.width));
      sixth.classList.add('is-intro-playing');
      // 잠금(락)은 최초 1회만 적용
      if (desktop.matches && !seenIntros.has(sixth)) {
        seenIntros.add(sixth);
        const lock = { section: sixth, limit: scrollY };
        introScrollLock = lock;
        setTimeout(() => {
          if (introScrollLock === lock) introScrollLock = undefined;
        }, 1950);
      }
    }
    sixth.classList.add('is-visible');
  }

  function syncIntroScrollLock(current) {
    if (introScrollLock?.section !== current || reduced.matches) introScrollLock = undefined;
    if (moving || introLocked() || reduced.matches || current === hero || seenIntros.has(current)
      || !desktop.matches) return;
    const anchor = desktop.matches && panels.includes(current) ? spread : current;
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
    const spreadPanel = desktop.matches ? panels[activePanel]
      : panels[panels[1].getBoundingClientRect().top <= header.offsetHeight ? 1 : 0];
    const current = hasReached(sixth) ? sixth : hasReached(fifth) ? fifth
      : fourthInView() ? fourth : beyondHero ? spreadPanel : hero;
    if (!desktop.matches) {
      activePanel = panels.indexOf(spreadPanel);
    }
    const fourthInViewport = fourth.getBoundingClientRect().bottom > 0 && fourth.getBoundingClientRect().top < innerHeight;
    if (fourthInViewport && scrollDirection < 0) fourth.classList.add('is-return-frame');
    else if (fourth.getBoundingClientRect().top >= innerHeight - 1) fourth.classList.remove('is-return-frame');
    const fourthWasVisible = fourth.classList.contains('is-visible');
    const fourthEntered = desktop.matches
      ? current === fourth && !moving && hasReached(fourth)
      : fourthInViewport && fourthTitle.getBoundingClientRect().top <= innerHeight * 0.85;
    fourth.classList.toggle('is-visible', fourthEntered
      || fadingFourth || (fourthWasVisible && fourthInViewport)
      || (fourth.classList.contains('is-return-frame') && fourthInViewport));
    const fifthInViewport = fifth.getBoundingClientRect().top < innerHeight && fifth.getBoundingClientRect().bottom > 0;
    const fifthWasVisible = fifth.classList.contains('is-visible');
    const fifthEntered = desktop.matches
      ? current === fifth && !moving
      : fifthInViewport && fifth.getBoundingClientRect().top <= innerHeight * 0.85;
    fifth.classList.toggle('is-visible', fifthEntered || current === sixth
      || (fifthWasVisible && fifthInViewport));
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
    if (desktop.matches) {
      setPanelPosition(index * spread.clientWidth);
      spread.classList.toggle('is-third-photo-visible', index === 1);
    } else {
      spread.classList.remove('is-third-photo-visible');
      spread.style.removeProperty('--support-copy-opacity');
      spread.style.removeProperty('--ocean-copy-opacity');
    }
    panels.forEach((panel, i) => { panel.inert = desktop.matches && i !== index; });
    syncSectionChrome();
  }

  function stop() {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(footerFrame);
    footerFrame = 0;
    moving = false;
    if (fadingFourth) {
      fadingFourth = false;
      fourth.style.removeProperty('opacity');
    }
    sixth.style.removeProperty('opacity');
  }

  function animateFooterScroll(now) {
    const distance = footerTarget - footerPosition;
    if (Math.abs(distance) <= 1) {
      footerFrame = 0;
      window.scrollTo(0, footerTarget);
      return;
    }
    const elapsed = Math.max(0, now - footerTime);
    footerPosition += distance * (1 - Math.exp(-elapsed / 145));
    footerTime = now;
    window.scrollTo(0, footerPosition);
    footerFrame = requestAnimationFrame(animateFooterScroll);
  }

  function smoothFooterWheel(event, sixthTop) {
    if (reduced.matches || moving || !event.cancelable || sixthTop > 1
      || partners.getBoundingClientRect().top > innerHeight + 1
      || (event.deltaY < 0 && sixthTop >= -2)) return false;

    const page = document.scrollingElement;
    const bottom = page.scrollHeight - page.clientHeight;
    const boundary = Math.round(scrollY + sixthTop);
    if (bottom <= boundary) return false;

    const wheelUnit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const wheelDistance = event.deltaY * wheelUnit * (event.deltaMode === 2 ? 1 : 1.12);
    const continuesInSameDirection = footerFrame && (footerTarget - scrollY) * event.deltaY > 0;
    const start = continuesInSameDirection ? footerTarget : scrollY;
    footerTarget = Math.max(boundary, Math.min(bottom, start + wheelDistance));
    if (!footerFrame) {
      footerPosition = scrollY;
      footerTime = performance.now();
      footerFrame = requestAnimationFrame(animateFooterScroll);
    }
    return true;
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
    const verticalTarget = targetPanel < 0 || !desktop.matches ? target : spread;
    const endY = startY + verticalTarget.getBoundingClientRect().top;
    const endX = targetPanel < 0 || !desktop.matches ? startX : targetPanel * spread.clientWidth;
    const duration = endX !== startX ? horizontalDuration : verticalDuration;
    if (targetPanel === 0 && (activePanel === 1 || startX > 0)) {
      target.dispatchEvent(new Event('support:show-final'));
    }
    // Keep the third panel visible until it has slid out.
    if (desktop.matches && targetPanel === 1) spread.classList.add('is-third-photo-visible');
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
      if (target === fourth && endY > startY && (1 - progress) * duration <= 160) {
        fourth.classList.add('is-visible');
      }
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
    if (desktop.matches && !moving && delta < 0 && !introLocked()) {
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
  hero.addEventListener('grf:hero-ready', () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target !== hero) go(target);
  }, { once: true });

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
    if (event.ctrlKey || !desktop.matches) return;
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    const direction = Math.sign(horizontal ? event.deltaX : event.deltaY);
    const now = performance.now();
    if (introScrollLock || now - lastLockedWheel < 180) {
      lastLockedWheel = now;
      event.preventDefault();
      return;
    }
    if (event.target.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
    if (!horizontal && direction && smoothFooterWheel(event, sixth.getBoundingClientRect().top)) {
      event.preventDefault();
      return;
    }
    const atFourth = fourthInView();
    const atFifth = hasReached(fifth);
    const atSixth = hasReached(sixth);
    const spreadAtTop = desktop.matches && !atFourth && spread.getBoundingClientRect().top <= 1;
    if (horizontal && !spreadAtTop) return;
    if (!direction) return;
    if (!moving && !horizontal && canScrollOceanCopy(event.target, direction)) return;
    const continuing = now - lastWheel < 180;
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
        // If people:advance didn't consume it (already opened once), immediately snap to fifth!
        event.preventDefault();
        go(fifth);
        return;
      }
      if (fourth.getBoundingClientRect().top < -1) {
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
      inSpread: desktop.matches && spread.contains(event.target),
      inFourth: desktop.matches && fourth.contains(event.target),
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
    if (!desktop.matches || !touchStart || moving) return;
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
    if (event.key === 'Escape' && event.defaultPrevented) return;
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

/* Support motion */
(() => {
  const section = document.querySelector('.grf-support');
  if (!section || !('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const photo = section.querySelector('.support-photo');
  const visual = section.querySelector('.support-visual');
  const details = section.querySelector('.support-details');
  const introduction = section.querySelector('.support-introduction');
  const benefitBoxes = [...section.querySelectorAll('.support-benefit-box')];
  const detailsButton = section.querySelector('.support-details-button');
  const scrollCue = section.querySelector('.support-scroll-cue');
  const heading = section.querySelector('h2');
  const copy = section.querySelector('.support-copy');
  const titleRow = section.querySelector('.support-title-row');
  let active = false, generation = 0;
  const settled = element => Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {})));
  function syncSubject() {
    if (mobile.matches || !photo.naturalWidth) return;
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
    await settled(scrollCue);
    if (id === generation) section.dispatchEvent(new Event('support:intro-complete'));
  }
  function finish() {
    active = true;
    generation++;
    section.classList.add('is-title-visible', 'is-focused', 'is-details-visible', 'is-benefit-summary-visible', 'is-details-button-visible', 'is-scroll-cue-visible');
    details.inert = false;
    details.removeAttribute('aria-hidden');
    section.dispatchEvent(new Event('support:intro-complete'));
  }
  section.addEventListener('support:show-final', () => {
    if (mobile.matches) return;
    section.classList.add('is-resetting', 'is-final-frame');
    finish();
    section.getBoundingClientRect();
    section.classList.remove('is-resetting');
  });
  section.classList.add('is-motion-ready');
  const entryObserver = new IntersectionObserver(entries => {
    if (!mobile.matches && entries.some(entry => entry.isIntersecting)) enter();
  }, { rootMargin: '0px 0px -85% 0px', threshold: 0 });
  const exitObserver = new IntersectionObserver(entries => {
    if (!mobile.matches && entries.some(entry => !entry.isIntersecting)) reset();
  }, { rootMargin: '-1px 0px -1px 0px', threshold: 0 });
  const mobileReveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-mobile-reveal');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  function syncLayout() {
    entryObserver.unobserve(section);
    mobileReveal.disconnect();
    if (mobile.matches) {
      titleRow.after(visual);
      finish();
      [heading, visual, introduction, ...benefitBoxes, detailsButton, scrollCue].forEach(element => {
        if (!element.classList.contains('is-mobile-reveal')) mobileReveal.observe(element);
      });
    } else {
      copy.before(visual);
      reset();
      entryObserver.observe(section);
    }
  }
  syncLayout();
  mobile.addEventListener('change', syncLayout);
  // A horizontal slide keeps the support scene ready for the return trip.
  exitObserver.observe(section.closest('.section-spread') || section);
})();

/* F-OCEAN mobile motion */
(() => {
  const section = document.querySelector('#section-03');
  if (!section || !('IntersectionObserver' in window)) return;

  const mobile = matchMedia('(max-width: 767px) and (prefers-reduced-motion: no-preference)');
  const title = section.querySelector('.section-ocean-title');
  const details = section.querySelectorAll('.section-ocean-features > div, .section-ocean-note');
  const observer = new IntersectionObserver((entries) => {
    if (!mobile.matches) return;

    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.classList.add('is-ocean-revealed');
      observer.unobserve(target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -24px 0px' });

  function sync() {
    observer.disconnect();
    section.classList.toggle('is-ocean-motion-ready', mobile.matches);
    if (mobile.matches) {
      for (const element of [title, ...details]) {
        if (!element.classList.contains('is-ocean-revealed')) observer.observe(element);
      }
    }
  }

  mobile.addEventListener('change', sync);
  sync();
})();

/* Profiles and detail views */
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
  const detailLayout = detail.querySelector('.people-detail-layout');
  const mobileProfiles = section.querySelector('.people-mobile-profiles');
  const scrollCue = section.querySelector('.people-scroll-cue');
  const mobile = matchMedia('(max-width: 767px)');
  const tablet = matchMedia('(min-width: 768px) and (max-width: 900px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let currentProfile = 0;
  let lastWheel = -Infinity;
  let touchStart;

  function cardClip() {
    const card = (tablet.matches ? scrollCue : openers[currentProfile]).getBoundingClientRect();
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

  function openProfile(index, fromClick = false) {
    if (detail.open || mobile.matches) return;
    detail.classList.remove('has-profile-switch');
    detail.classList.toggle('from-click', fromClick);
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

  let hasAutoOpened = false;

  section.addEventListener('people:advance', event => {
    if (mobile.matches || detail.open || !section.classList.contains('is-visible')) return;
    if (tablet.matches) {
      event.preventDefault();
      openProfile(0);
      return;
    }
    if (hasAutoOpened) return;
    const card = openers[0].getBoundingClientRect();
    if (card.top >= innerHeight || card.bottom <= 0) return;
    event.preventDefault();
    if (lastCard.getAnimations().some(animation => animation.playState === 'running')) return;
    hasAutoOpened = true;
    openProfile(0);
  });
  scrollCue.addEventListener('click', () => openProfile(0, true));

  function syncProfileLayout() {
    if (mobile.matches && detail.open) detail.close();
    const layout = mobile.matches ? mobileProfiles : detailLayout;
    profiles.forEach((profile, index) => {
      profile.hidden = !mobile.matches && index !== currentProfile;
      layout.append(profile);
    });
  }

  profiles.forEach((profile, index) => {
    profile.dataset.profileNumber = openers[index].textContent.trim();
  });
  mobile.addEventListener('change', syncProfileLayout);
  syncProfileLayout();
  const closeButton = detail.querySelector('.people-detail-close');
  if (closeButton) {
    closeButton.addEventListener('click', event => {
      event.preventDefault();
      closeProfile();
    });
  }
  openers.forEach((opener, index) => {
    opener.addEventListener('click', () => openProfile(index, true));
  });
  detail.addEventListener('cancel', event => {
    event.preventDefault();
    closeProfile();
  });
  detail.addEventListener('close', () => {
    if (!mobile.matches) {
      (tablet.matches ? scrollCue : openers[currentProfile]).focus({ preventScroll: true });
    }
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

/* Sharing background */
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
