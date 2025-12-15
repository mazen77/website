
const c=document.getElementById('matrix'),x=c.getContext('2d');
function r(){c.width=innerWidth;c.height=innerHeight}
window.onresize=r;r();
const m="01MAZEN";
let d=Array(200).fill(0);
setInterval(()=>{
x.fillStyle='rgba(0,0,0,.1)';x.fillRect(0,0,c.width,c.height);
x.fillStyle='#0f0';x.font='15px monospace';
d.forEach((y,i)=>{
x.fillText(m[Math.random()*m.length|0],i*15,y);
d[i]=y>c.height?0:y+15;
});
},50);
document.getElementById('theme').onclick=()=>{
document.body.classList.toggle('light');
}
