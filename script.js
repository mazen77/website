/* Mazen cinematic bilingual site */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

const ICONS = {
  mail:`<svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>`,
  phone:`<svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.6 3.5 4.7 6.1 6.1l2-2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.5.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.2a1 1 0 0 1 1 1c0 1.2.2 2.4.6 3.5a1 1 0 0 1-.2 1l-2 2Z"/></svg>`,
  sunmoon:`<svg viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12ZM4 12H2m20 0h-2M12 4V2m0 20v-2"/></svg>`,
  pin:`<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 9.2A2.2 2.2 0 1 0 12 6.8a2.2 2.2 0 0 0 0 4.4Z"/></svg>`,
  globe:`<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.9 9h-3.2a15.5 15.5 0 0 0-1.2-5 8 8 0 0 1 4.4 5Zm-5.3 0H9.4a13.6 13.6 0 0 1 1.6-6.2c.3-.5.7-.8 1-.8s.7.3 1 .8A13.6 13.6 0 0 1 14.6 11Zm-10.5 2h3.2a15.5 15.5 0 0 0 1.2 5 8 8 0 0 1-4.4-5Zm5.3 0h5.2a13.6 13.6 0 0 1-1.6 6.2c-.3.5-.7.8-1 .8s-.7-.3-1-.8A13.6 13.6 0 0 1 9.4 13Zm-1-7a15.5 15.5 0 0 0-1.2 5H4.1a8 8 0 0 1 4.4-5Zm11.5 7h3.2a8 8 0 0 1-4.4 5 15.5 15.5 0 0 0 1.2-5Z"/></svg>`
};
function injectIcons(){
  $$("[data-ic]").forEach(el=>{
    const k = el.getAttribute("data-ic");
    if (ICONS[k]) el.innerHTML = ICONS[k];
  });
}
injectIcons();

/* Matrix rain */

function startMatrix(){
  const c = document.getElementById("matrix");
  if (!c) return;
  const ctx = c.getContext("2d", { alpha:true });

  let W=0,H=0,dpr=1;
  const dots = [];
  const DOTS = 160;
  const LINK_DIST = 140;

  function resize(){
    dpr = Math.min(devicePixelRatio, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);

    dots.length = 0;
    for (let i=0;i<DOTS;i++){
      dots.push({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()-0.5)*0.25,
        vy: (Math.random()-0.5)*0.25,
        r: 1.2 + Math.random()*1.6
      });
    }
  }
  addEventListener("resize", resize, {passive:true});
  resize();

  function tick(){
    const theme = document.documentElement.dataset.theme || "dark";
    ctx.clearRect(0,0,W,H);

    ctx.fillStyle = theme === "light" ? "rgba(246,247,251,0.20)" : "rgba(5,6,10,0.18)";
    ctx.fillRect(0,0,W,H);

    for (const p of dots){
      p.x += p.vx; p.y += p.vy;
      if (p.x < -40) p.x = W+40;
      if (p.x > W+40) p.x = -40;
      if (p.y < -40) p.y = H+40;
      if (p.y > H+40) p.y = -40;
    }

    const acc = theme === "light" ? "rgba(0,179,92," : "rgba(91,255,154,";
    for (let i=0;i<dots.length;i++){
      for (let j=i+1;j<dots.length;j++){
        const a = dots[i], b = dots[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.hypot(dx,dy);
        if (dist < LINK_DIST){
          const alpha = (1 - dist/LINK_DIST) * 0.28;
          ctx.strokeStyle = `${acc}${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of dots){
      const glow = theme === "light" ? "rgba(0,179,92,0.8)" : "rgba(91,255,154,0.85)";
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }
  tick();
}

startMatrix();

/* Three.js cinematic scene */
function startThree(){
  if (typeof THREE === "undefined") return;
  const host = document.getElementById("three");
  if (!host) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 1000);
  camera.position.set(0, 0.1, 6);

  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  host.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // Wireframe "matrix core"
  const geo = new THREE.IcosahedronGeometry(1.35, 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent:true, opacity: 0.32 });
  const core = new THREE.Mesh(geo, mat);
  group.add(core);

  // Glassy rings
  const ringGeo = new THREE.TorusGeometry(2.05, 0.02, 16, 200);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent:true, opacity: 0.35 });
  for (let i=0;i<3;i++){
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = (Math.PI/2) + i*0.4;
    ring.rotation.y = i*0.6;
    group.add(ring);
  }

  // Floating cubes particles
  const cubes = [];
  const cubeGeo = new THREE.BoxGeometry(0.14,0.14,0.14);
  const cubeMat = new THREE.MeshBasicMaterial({ color: 0x5bff9a, transparent:true, opacity: 0.25 });
  for (let i=0;i<90;i++){
    const m = new THREE.Mesh(cubeGeo, cubeMat);
    m.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*6, (Math.random()-0.5)*10);
    m.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    m.userData.spd = 0.0008 + Math.random()*0.0018;
    group.add(m);
    cubes.push(m);
  }

  function resize(){
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
  addEventListener("resize", resize, { passive:true });

  let t = 0;
  function animate(){
    t += 0.005;
    core.rotation.x += 0.003;
    core.rotation.y += 0.004;

    group.rotation.y = Math.sin(t)*0.12;
    group.rotation.x = Math.cos(t*0.8)*0.06;

    for (const m of cubes){
      m.position.z += m.userData.spd;
      m.rotation.x += 0.01;
      m.rotation.y += 0.013;
      if (m.position.z > 6) m.position.z = -6;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // parallax with scroll
  addEventListener("scroll", ()=>{
    const p = window.scrollY / (document.documentElement.scrollHeight - innerHeight || 1);
    group.position.y = -p*0.65;
    group.position.x = (p-0.5)*0.35;
  }, { passive:true });
}
// startThree disabled (replaced by lotties)
// startThree();

/* Scroll progress */
(function(){
  const fill = document.getElementById("scrollFill");
  if (!fill) return;
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    fill.style.width = p.toFixed(2) + "%";
  };
  addEventListener("scroll", onScroll, { passive:true });
  onScroll();
})();

/* Theme */
function setTheme(t){
  document.documentElement.dataset.theme = t;
  localStorage.setItem("mazen_theme", t);
}
const savedTheme = localStorage.getItem("mazen_theme");
if (savedTheme) setTheme(savedTheme);
$("#themeToggle")?.addEventListener("click", ()=>{
  const cur = document.documentElement.dataset.theme || "dark";
  setTheme(cur === "dark" ? "light" : "dark");
});

/* i18n strings */
const STR = {
  ar: {
    meta_title:"مازن بسيسو — ويب ماستر أول وصانع محتوى",
    toggle_theme:"الوضع",
    nav_websites:"المواقع",
    nav_experience:"الخبرات",
    nav_mediakit:"ميديا كِت",
    nav_brands:"العلامات",
    nav_links:"الروابط",
    nav_contact:"تواصل",
    kicker:"Cinematic. Fast. Reliable.",
    hero_title:"من أول سكرول…<br/>تحس إن الموقع “مستوى أعلى”.",
    hero_lead:"أدير وأطوّر منصات عالية الزيارات: سيرفرات، WordPress + كود مخصص، APIs، مدفوعات، تكاملات تطبيق، أمن، SEO/Analytics — مع تأثيرات سكرول و3D مستوحاة من الماتريكس.",
    cta_websites:"شاهد المواقع",
    cta_mediakit:"الميديا كِت",
    asof:"الأرقام المعروضة مأخوذة من مصادر عامة وملفك — ويمكن تحديثها بسهولة.",
    hc_tag:"Quick Profile",
    hc_badge:"Matrix Mode",
    hc_note:"اسحب للأسفل… وخلّ التأثيرات تحكي عنك.",
    websites_title:"مواقع عملت عليها",
    websites_sub:"تم استبدال Centerial Mall بالمواقع الحقيقية + قسم لإضافة أي مواقع من النسخة السابقة.",
    websites_hint:"لإضافة مواقع أكثر: افتح data.json وأضف داخل websites[] — أو ارفع قائمة الدومينات.",
    exp_title:"الخبرات",
    exp_sub:"تشغيل كامل من السيرفر إلى الواجهة… وبنتائج واضحة.",
    edu_title:"التعليم",
    cert_title:"الشهادات",
    mk_title:"الميديا كِت",
    mk_sub:"باقات تعاون جاهزة + إضافات… بشكل واضح ومقنع.",
    mk_audience_title:"الجمهور",
    mk_note:"يمكنك تحديث الأرقام/الباقات بسهولة من data.json بدون لمس الكود.",
    mk_addons:"إضافات",
    brands_title:"علامات تعاونت معها",
    brands_sub:"عرض Wordmarks أنيق (وممكن إضافة الشعارات الرسمية لو وفرتها).",
    links_title:"روابط",
    links_sub:"هذا القسم لروابط أفلييت أو روابط معلومات تضيفها للجمهور.",
    contact_title:"تواصل",
    contact_sub:"تواصل للتعاون أو إدارة منصات أو حملات محتوى.",
    footer_tag:"Cinematic UI • Fast load • Clean code"
  },
  en: {
    meta_title:"Mazen Bassiso — Senior Webmaster & Creator",
    toggle_theme:"Mode",
    nav_websites:"Websites",
    nav_experience:"Experience",
    nav_mediakit:"Media Kit",
    nav_brands:"Brands",
    nav_links:"Links",
    nav_contact:"Contact",
    kicker:"Cinematic. Fast. Reliable.",
    hero_title:"From the first scroll…<br/>it feels premium.",
    hero_lead:"I operate and build high‑traffic platforms: servers, WordPress + custom code, APIs, payments, mobile integrations, security, SEO/analytics — with Matrix‑inspired scroll + 3D.",
    cta_websites:"See websites",
    cta_mediakit:"Media kit",
    asof:"Numbers are based on public sources and your docs — easy to update anytime.",
    hc_tag:"Quick Profile",
    hc_badge:"Matrix Mode",
    hc_note:"Scroll down… let the effects speak.",
    websites_title:"Websites I worked on",
    websites_sub:"Centerial Mall removed and replaced with real websites + a slot for adding your previous list.",
    websites_hint:"To add more sites: edit data.json > websites[] (or paste your domain list).",
    exp_title:"Experience",
    exp_sub:"Full ownership from server to UI… with measurable outcomes.",
    edu_title:"Education",
    cert_title:"Licenses & Certifications",
    mk_title:"Media Kit",
    mk_sub:"Clear collab packages + add‑ons — ready to send to brands.",
    mk_audience_title:"Audience",
    mk_note:"Update numbers/packages easily via data.json — no code changes needed.",
    mk_addons:"Add-ons",
    brands_title:"Brands",
    brands_sub:"Clean wordmarks (add official logos if you have the files).",
    links_title:"Links",
    links_sub:"This section is for affiliate or informational links for your audience.",
    contact_title:"Contact",
    contact_sub:"Reach out for collabs, platform ops, or creator campaigns.",
    footer_tag:"Cinematic UI • Fast load • Clean code"
  }
};

function applyLang(lang){
  const d = STR[lang] || STR.en;
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";
  $$("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    if (d[k] != null) el.innerHTML = d[k];
  });
  localStorage.setItem("mazen_lang", lang);
  $$(".toggle[data-lang]").forEach(b=>b.classList.toggle("active", b.dataset.lang === lang));
}
applyLang(localStorage.getItem("mazen_lang") || "ar");
$$(".toggle[data-lang]").forEach(btn=>btn.addEventListener("click", ()=>applyLang(btn.dataset.lang)));

/* Render from data.json */
async function boot(){
  const res = await fetch("data.json", { cache: "no-store" });
  const data = await res.json();

  $("#year").textContent = new Date().getFullYear();
  $("#footerName").textContent = data.name[document.documentElement.lang] || data.name.en;

  // Identity
  $("#name").textContent = data.name[document.documentElement.lang] || data.name.en;
  $("#title").textContent = data.title[document.documentElement.lang] || data.title.en;
  $("#location").textContent = data.location[document.documentElement.lang] || data.location.en;

  // Links
  $("#linktree").textContent = data.linktree.replace("https://","");
  $("#linktree").href = data.linktree;
  $("#email").textContent = data.email;
  $("#email").href = "mailto:" + data.email;
  $("#phone").textContent = data.phone;
  $("#phone").href = "tel:" + data.phone;

  $("#emailBtn").href = "mailto:" + data.email;
  $("#phoneBtn").href = "tel:" + data.phone;
  $("#contactEmail").textContent = data.email;
  $("#contactEmail").href = "mailto:" + data.email;
  $("#contactPhone").textContent = data.phone;
  $("#contactPhone").href = "tel:" + data.phone;
  $("#contactLinktree").href = data.linktree;

  // Social bar items
  const sb = $("#sbLeft");
  sb.innerHTML = "";
  const socials = [
    {k:"instagram", label:"Instagram"},
    {k:"tiktok", label:"TikTok"},
    {k:"youtube", label:"YouTube"}
  ];
  for (const s of socials){
    const it = data.social[s.k];
    const a = document.createElement("a");
    a.className = "sb-item";
    a.href = it.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = `<span>${labelOf(s.k)}</span> <span class="muted">@</span> <span>${it.label.replace("@","")}</span> <b dir="ltr">${it.count || "—"}</b>`;
    sb.appendChild(a);
  }

  // Metrics
  const m = $("#metrics");
  m.innerHTML = "";
  data.metrics.forEach(x=>{
    const el = document.createElement("div");
    el.className = "metric";
    el.innerHTML = `<div class="k">${x.k}</div><div class="t">${x[document.documentElement.lang] || x.en}</div>`;
    m.appendChild(el);
  });

  // What I do
  const w = $("#whatIDo");
  const list = (document.documentElement.lang === "ar")
    ? ["Servers & DevOps","WordPress + Custom Plugins","APIs & Integrations","Payments","SEO/Analytics","Automation"]
    : ["Servers & DevOps","WordPress + Custom Plugins","APIs & Integrations","Payments","SEO/Analytics","Automation"];
  w.innerHTML = list.map(t=>`<span class="fc-pill">${t}</span>`).join("");

  // Websites
  const wg = $("#websitesGrid");
  wg.innerHTML = "";
  data.websites.forEach(site=>{
    const card = document.createElement("article");
    card.className = "card";
    const tag = site.tag[document.documentElement.lang] || site.tag.en;
    const desc = site.desc[document.documentElement.lang] || site.desc.en;
    card.innerHTML = `
      <div class="card-top">
        <div class="badge"><span data-ic="globe"></span><span>${tag}</span></div>
        <div class="logo-pill">${site.name}</div>
      </div>
      <h3>${site.name}</h3>
      <p>${desc}</p>
      <div class="meta">${tag}</div>
      <a class="link" href="${site.url}" target="_blank" rel="noopener">${site.url.replace("https://","")}</a>
    `;
    wg.appendChild(card);
  });
  injectIcons();

  // Experience timeline
  const tl = $("#timeline");
  tl.innerHTML = "";
  data.experience.forEach(e=>{
    const item = document.createElement("div");
    item.className = "t-item";
    const role = e.role[document.documentElement.lang] || e.role.en;
    const date = e.date[document.documentElement.lang] || e.date.en;
    const bullets = e.bullets[document.documentElement.lang] || e.bullets.en;
    item.innerHTML = `
      <div class="t-top">
        <div><span class="t-role">${role}</span> <span class="t-company">• ${e.company}</span></div>
        <div class="t-date">${date}</div>
      </div>
      <ul class="t-bullets">${bullets.map(b=>`<li>${b}</li>`).join("")}</ul>
    `;
    tl.appendChild(item);
  });

  // Education
  const edu = $("#education");
  edu.innerHTML = data.education.map(x=>`<div>• ${x[document.documentElement.lang] || x.en}</div>`).join("");

  // Certs
  const certs = $("#certs");
  certs.innerHTML = "";
  data.certs.forEach(c=>{
    const ch = document.createElement("span");
    ch.className = "chip";
    ch.textContent = c;
    certs.appendChild(ch);
  });

  // Media kit
  $("#audience").textContent = data.mediaKit.audience[document.documentElement.lang] || data.mediaKit.audience.en;
  const mkStats = $("#mkStats");
  mkStats.innerHTML = "";
  [
    {k:data.social.instagram.count, t: document.documentElement.lang==="ar"?"Instagram":"Instagram"},
    {k:data.social.tiktok.count, t: document.documentElement.lang==="ar"?"TikTok":"TikTok"},
    {k:"GCC/MENA", t: document.documentElement.lang==="ar"?"المنطقة":"Region"}
  ].forEach(s=>{
    const el = document.createElement("div");
    el.className = "mk-stat";
    el.innerHTML = `<div class="k" dir="ltr">${s.k}</div><div class="t">${s.t}</div>`;
    mkStats.appendChild(el);
  });

  const mkCards = $("#mkCards");
  mkCards.innerHTML = "";
  data.mediaKit.packages.forEach(p=>{
    const card = document.createElement("div");
    card.className = "mk-card";
    const n = p.name[document.documentElement.lang] || p.name.en;
    const price = p.price[document.documentElement.lang] || p.price.en;
    const items = p.items[document.documentElement.lang] || p.items.en;
    card.innerHTML = `
      <div class="top"><div class="name">${n}</div><div class="price">${price}</div></div>
      <div class="mk-meta"><span class="mk-pill">${(p.usage_rights?.[document.documentElement.lang] || p.usage_rights?.en || "")}</span><span class="mk-pill">${(p.auth_code?.[document.documentElement.lang] || p.auth_code?.en || "")}</span></div>
      <ul>${items.map(i=>`<li>${i}</li>`).join("")}</ul>
    `;
    mkCards.appendChild(card);
  });

  const addons = $("#addons");
  addons.innerHTML = "";
  data.mediaKit.addons.forEach(a=>{
    const li = document.createElement("li");
    li.textContent = a[document.documentElement.lang] || a.en || a;
    addons.appendChild(li);
  });

  // Brands
  const bg = $("#brandsGrid");
  bg.innerHTML = "";
  data.brands.forEach(b=>{
    const el = document.createElement("div");
    el.className = "brand";
    el.textContent = b;
    bg.appendChild(el);
  });

  // Links
  const lg = $("#linksGrid");
  lg.innerHTML = "";
  data.links.forEach(l=>{
    const a = document.createElement("a");
    a.className = "link-card";
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    const nm = l.name[document.documentElement.lang] || l.name.en;
    a.innerHTML = `<div><strong>${nm}</strong><span class="sub">${l.url.replace("https://","")}</span></div><div class="arrow">↗</div>`;
    lg.appendChild(a);
  });

  // Scroll effects with GSAP
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined"){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".card, .t-item, .panel, .link-card, .floater-card").forEach((el)=>{
      gsap.fromTo(el, { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: .7, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });
    // hero card tilt on scroll
    gsap.to("#heroCard", {
      rotateX: -6, rotateY: 8,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }
}

function labelOf(k){
  if (k === "instagram") return "Instagram";
  if (k === "tiktok") return "TikTok";
  if (k === "youtube") return "YouTube";
  return k;
}

boot();

// Re-render on language change (for dynamic content)
$$(".toggle[data-lang]").forEach(btn=>btn.addEventListener("click", ()=>{
  setTimeout(()=>boot(), 0);
}));

/* === MAZEN_LOTTIE_REMAKE === */
document.addEventListener("DOMContentLoaded", () => {
  const load = (id, file, opts = {}) => {
    const el = document.getElementById(id);
    if (!el || typeof lottie === "undefined") return null;
    return lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: opts.loop ?? true,
      autoplay: opts.autoplay ?? true,
      path: "assets/lottie/" + file,
    });
  };

  // Theme (data-theme) persistence
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  // Toggle Lottie (play forward/back)
  const toggleAnim = load("lottieToggle", "toggle.json", { loop: false, autoplay: false });
  const toggleBtn = document.getElementById("themeToggleLottie");
  const isLight = () => (root.getAttribute("data-theme") === "light");

  const syncToggleFrame = () => {
    if (!toggleAnim) return;
    const total = Math.max(1, toggleAnim.getDuration(true));
    toggleAnim.goToAndStop(isLight() ? total : 0, true);
  };

  if (toggleAnim) {
    toggleAnim.addEventListener("DOMLoaded", syncToggleFrame, { once: true });
  }
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const next = isLight() ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);

      if (toggleAnim) {
        const total = Math.max(1, toggleAnim.getDuration(true));
        // set direction based on next state (light -> forward)
        toggleAnim.stop();
        toggleAnim.setDirection(next === "light" ? 1 : -1);
        toggleAnim.goToAndStop(next === "light" ? 0 : total, true);
        toggleAnim.play();
      }
    });
  }

  // Milk cup scroll-driven (centered)
  const cup = load("lottieCup", "milk-cup.json", { loop: false, autoplay: false });
  if (cup) {
    cup.addEventListener("DOMLoaded", () => {
      const total = Math.max(1, cup.getDuration(true));
      const onScroll = () => {
        const doc = document.documentElement;
        const max = (doc.scrollHeight - window.innerHeight) || 1;
        const p = Math.min(1, Math.max(0, window.scrollY / max));
        cup.goToAndStop(p * total, true);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    });
  }

  // Section/ambient lotties
  load("lottieDividerTea", "tea-loader.json", { loop: true, autoplay: true });
  load("lottieCode", "code-dark.json", { loop: true, autoplay: true });
  load("lottieTabs", "ios-tabs.json", { loop: true, autoplay: true });
  load("lottieSpin", "spin.json", { loop: true, autoplay: true });
});
