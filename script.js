// Year
document.getElementById('y').textContent = new Date().getFullYear();

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach(el => io.observe(el));

// 3D tilt (mouse + touch)
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

document.querySelectorAll('.tilt').forEach(card => {
  const strength = 10;

  const setTilt = (x, y) => {
    const rX = clamp(((y - 0.5) * -strength), -strength, strength);
    const rY = clamp(((x - 0.5) * strength), -strength, strength);
    card.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg) translateZ(0)`;
  };

  const reset = () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt(x, y);
  });

  card.addEventListener('mouseleave', reset);

  // Touch
  card.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const r = card.getBoundingClientRect();
    const x = (t.clientX - r.left) / r.width;
    const y = (t.clientY - r.top) / r.height;
    setTilt(x, y);
  }, { passive: true });

  card.addEventListener('touchend', reset);
});

// Lightweight "3D" background: starfield with parallax depth
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d', { alpha: true });

let w, h, dpr;
function resize(){
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = canvas.width = Math.floor(window.innerWidth * dpr);
  h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}
window.addEventListener('resize', resize);
resize();

const rnd = (min, max) => min + Math.random() * (max - min);

let stars = [];
function initStars(){
  const count = Math.floor((window.innerWidth * window.innerHeight) / 12000);
  stars = new Array(Math.max(80, Math.min(220, count))).fill(0).map(() => ({
    x: rnd(0, w),
    y: rnd(0, h),
    z: rnd(0.25, 1),
    r: rnd(0.6, 1.8),
    v: rnd(0.08, 0.22)
  }));
}
initStars();

let mx = 0, my = 0;
window.addEventListener('mousemove', (e) => {
  mx = (e.clientX / window.innerWidth - 0.5);
  my = (e.clientY / window.innerHeight - 0.5);
});
window.addEventListener('scroll', () => {
  // subtle scroll parallax
});

function frame(){
  ctx.clearRect(0, 0, w, h);

  // Soft gradient glow
  const g = ctx.createRadialGradient(
    w*0.6 + mx*w*0.08, h*0.35 + my*h*0.08, 0,
    w*0.6 + mx*w*0.08, h*0.35 + my*h*0.08, Math.max(w,h)*0.55
  );
  g.addColorStop(0, 'rgba(255,255,255,0.06)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  // Stars
  for (const s of stars){
    s.y += s.v * dpr * (0.6 + s.z);
    if (s.y > h + 10) { s.y = -10; s.x = rnd(0, w); s.z = rnd(0.25, 1); }

    const px = s.x + mx * 40 * dpr * s.z;
    const py = s.y + my * 28 * dpr * s.z;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${0.18 * s.z})`;
    ctx.arc(px, py, s.r * dpr * s.z, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(frame);
}
frame();
