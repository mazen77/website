
document.addEventListener('DOMContentLoaded',()=>{
  const load=(id,file,opts={})=>{
    const el=document.getElementById(id);
    if(!el||typeof lottie==='undefined') return null;
    return lottie.loadAnimation({
      container:el, renderer:'svg',
      loop:opts.loop??true, autoplay:opts.autoplay??true,
      path:'assets/lottie/'+file
    });
  };

  // Global tea cup – scroll driven
  const cup=load('lottieCup','MilkCup.json',{loop:false,autoplay:false});
  if(cup){
    cup.addEventListener('DOMLoaded',()=>{
      const total=cup.getDuration(true);
      const onScroll=()=>{
        const max=document.documentElement.scrollHeight-window.innerHeight||1;
        const p=Math.min(1, window.scrollY/max);
        cup.goToAndStop(p*total,true);
      };
      window.addEventListener('scroll',onScroll,{passive:true});
      onScroll();
    });
  }

  // Ambient lotties
  load('lottieTabs','Tabs.json');
  load('lottieToggle','Toggle.json',{loop:false});
  load('lottieLoader','TeaLoader.json');
  load('lottieCode','CodeDark.json');
  load('lottieSpin','Spin.json');
});
