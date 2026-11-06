'use strict';
(() => {
  const hero=document.querySelector('.grf-hero');
  if(!hero)return;
  const select=selector=>hero.querySelector(selector);
  const mask=select('.image-mask'),image=mask.querySelector('img'),logo=select('.intro-logo');
  const header=select('.header'),caption=select('.editorial-note');
  const lines=[...hero.querySelectorAll('.headline-text')],reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:767px)');
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
    const ratio=Math.min(1,...lines.map(line=>width/line.scrollWidth));
    if(ratio<1)heading.style.fontSize=Math.floor(size*ratio*.98)+'px';
  }
  function motion(element,frames,duration,delay=0,easing='cubic-bezier(.22,1,.36,1)'){
    const animation=element.animate(frames,{duration,delay,easing,fill:'both'});animations.push(animation);return animation;
  }
  function finish(){
    generation++;hero.classList.remove('intro-start-preview','mask-expanding','header-entering','caption-entering');
    hero.classList.add('intro-complete');animations.forEach(a=>a.cancel());animations=[];
    document.documentElement.classList.remove('grf-intro-locked');
    select('#status').textContent='인트로 재생 완료';
  }
  async function play(){
    generation++;animations.forEach(a=>a.cancel());animations=[];
    const id=generation;
    hero.classList.remove('intro-complete','card-arrived','logo-revealed','mask-expanded','mask-expanding','header-entering','caption-entering','headline-entering');
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
      const opening=motion(mask,[{clipPath:mobile.matches?'inset(12% 16% round 16px)':'inset(24% 34% round 24px)'},{clipPath:'inset(0% 0% round 0px)'}],duration,0,easing);
      const zoom=motion(image,[{transform:`scale(${mobile.matches?.97:.92})`},{transform:'scale(1)'}],duration,0,easing);
      opening.startTime=zoom.startTime=document.timeline.currentTime;
      await Promise.all([opening.finished,zoom.finished]);
      if(!current())return;hero.classList.add('mask-expanded','headline-entering');hero.classList.remove('mask-expanding');
      // Keep the original image bright until expansion ends; darken with the headline.
      const shadeEntrance=motion(select('.shade'),[{opacity:.06},{opacity:1}],1400,0,'ease-in-out');
      // Each line moves through its own fixed clipping window. No opacity animation.
      const headlineEntrances=lines.map((line,i)=>motion(line,[{transform:'translateY(125%)'},{transform:'translateY(0)'}],1100,120+i*260));
      hero.classList.add('header-entering');
      // Overlap the chrome with the headline: header at 450ms, caption at 650ms.
      const headerEntrance=motion(header,[{transform:'translateY(-115%)'},{transform:'translateY(0)'}],1050,450);
      hero.classList.add('caption-entering');
      const captionEntrance=motion(caption,[{transform:'translateY(115%)'},{transform:'translateY(0)'}],1100,650);
      await Promise.all([shadeEntrance.finished,...headlineEntrances.map(animation=>animation.finished),headerEntrance.finished,captionEntrance.finished]);
      if(current())finish();
    }catch{if(current())finish();}
  }
  document.documentElement.classList.add('grf-intro-locked');
  window.scrollTo(0,0);
  syncIntroLogo();hero.classList.add('intro-start-preview');
  reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
  addEventListener('resize',()=>{syncIntroLogo();if(animations.length)finish();fit();});
  Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,4000))]).then(async()=>{
    try{await image.decode();}catch{}ready=true;syncIntroLogo();fit();play();
  });
})();
