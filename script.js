const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();

const toggle=document.getElementById('themeToggle');
toggle.onclick=()=>{
  document.body.classList.toggle('light');
};

document.querySelectorAll('[data-lottie]').forEach(el=>{
  lottie.loadAnimation({
    container:el,
    renderer:'svg',
    loop:true,
    autoplay:true,
    path:el.dataset.lottie
  });
});
