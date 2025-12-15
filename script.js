
// background particles
const bg = document.getElementById('bg');
const bctx = bg.getContext('2d');
function resizeBg(){
  bg.width = innerWidth;
  bg.height = innerHeight;
}
resizeBg();
window.onresize = resizeBg;
const pts = Array.from({length:120},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3}));
function bgTick(){
  bctx.fillStyle='rgba(5,6,10,.25)';
  bctx.fillRect(0,0,bg.width,bg.height);
  bctx.fillStyle='rgba(91,255,154,.35)';
  pts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>bg.width)p.vx*=-1;
    if(p.y<0||p.y>bg.height)p.vy*=-1;
    bctx.beginPath();
    bctx.arc(p.x,p.y,1.2,0,Math.PI*2);
    bctx.fill();
  });
  requestAnimationFrame(bgTick);
}
bgTick();

// liquid fill
const canvas = document.getElementById('liquid');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 520;

function drawLiquid(level){
  ctx.clearRect(0,0,300,520);
  const h = 480*level;
  ctx.fillStyle = 'rgba(91,255,154,0.45)';
  ctx.beginPath();
  ctx.moveTo(40,500-h);
  ctx.lineTo(260,500-h);
  ctx.lineTo(230,500);
  ctx.lineTo(70,500);
  ctx.closePath();
  ctx.fill();

  if(level>0.96){
    ctx.fillStyle='rgba(91,255,154,0.25)';
    ctx.beginPath();
    ctx.arc(150,30,6,0,Math.PI*2);
    ctx.fill();
  }
}

function onScroll(){
  const max = document.body.scrollHeight - innerHeight;
  const progress = Math.min(1, scrollY/max);
  drawLiquid(progress);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
