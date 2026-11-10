'use strict';
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
  Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,4000))]).then(async()=>{
    try{await image.decode();}catch{}ready=true;syncIntroLogo();fit();play();
  });
})();
