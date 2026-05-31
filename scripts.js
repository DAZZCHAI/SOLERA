/* ============================================================
   SOLERA — interacciones
   ============================================================ */

/* ---------- WhatsApp: número centralizado (fácil de reemplazar) ---------- */
const WA_PHONE = "524771234567"; // ← cambia aquí el número (formato internacional, sin signos)
function waLink(msg){
  return "https://api.whatsapp.com/send?phone=" + WA_PHONE + "&text=" + encodeURIComponent(msg || "Hola SOLERA 👋");
}
// asigna el href a todos los elementos .wa según su data-msg
document.querySelectorAll(".wa").forEach(el=>{
  el.setAttribute("href", waLink(el.dataset.msg));
  el.setAttribute("target","_blank");
  el.setAttribute("rel","noopener");
});

/* ---------- Navbar: sólida al scrollear ---------- */
const nav = document.getElementById("nav");
const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > window.innerHeight * 0.7);
onScrollNav();
window.addEventListener("scroll", onScrollNav, {passive:true});

/* ---------- Parallax sutil en el hero ---------- */
const heroBg = document.getElementById("heroBg");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(heroBg && !reduceMotion){
  window.addEventListener("scroll", ()=>{
    const y = window.scrollY;
    if(y < window.innerHeight) heroBg.style.transform = "translateY(" + (y * 0.28) + "px)";
  }, {passive:true});
}

/* ---------- Reveal al hacer scroll (Intersection Observer) ---------- */
const revealIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add("is-in"); revealIO.unobserve(e.target); }
  });
},{threshold:0.12, rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll("[data-reveal]").forEach(el=>revealIO.observe(el));

/* ---------- Contador de stats que cuenta al entrar en viewport ---------- */
function animateCount(el){
  const to = parseInt(el.dataset.to, 10);
  const dur = 1800;
  const start = performance.now();
  const fmt = n => n.toLocaleString("es-MX");
  function tick(now){
    const p = Math.min((now - start) / dur, 1);
    // easeOutExpo
    const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    el.textContent = fmt(Math.round(to * e));
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ animateCount(e.target); countIO.unobserve(e.target); }
  });
},{threshold:0.6});
document.querySelectorAll(".count").forEach(el=>countIO.observe(el));

/* ---------- Menú móvil ---------- */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
function toggleMenu(open){
  mobileMenu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
}
burger.addEventListener("click", ()=> toggleMenu(!mobileMenu.classList.contains("open")));
document.querySelectorAll(".mm-link, .mobile-menu .btn").forEach(a=> a.addEventListener("click", ()=> toggleMenu(false)));

/* ---------- Formulario -> WhatsApp ---------- */
const waForm = document.getElementById("waForm");
waForm.addEventListener("submit", (ev)=>{
  ev.preventDefault();
  const f = new FormData(waForm);
  const nombre = (f.get("nombre")||"").trim();
  const interes = (f.get("interes")||"").trim();
  const mensaje = (f.get("mensaje")||"").trim();
  let txt = "Hola SOLERA 👋, soy " + (nombre || "alguien interesado") + ".";
  if(interes) txt += " Me interesa: " + interes + ".";
  if(mensaje) txt += " " + mensaje;
  window.open(waLink(txt), "_blank", "noopener");
});

/* ---------- Cursor personalizado con estado en hover ---------- */
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
const isTouch = window.matchMedia("(hover:none),(pointer:coarse)").matches;
if(!isTouch && dot && ring){
  let rx=0, ry=0, mx=0, my=0;
  window.addEventListener("mousemove", e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
  });
  function ringLoop(){
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
    requestAnimationFrame(ringLoop);
  }
  ringLoop();
  // estado hover sobre elementos interactivos
  document.querySelectorAll("a, button, .exp__card, input, textarea").forEach(el=>{
    el.addEventListener("mouseenter", ()=> ring.classList.add("is-hover"));
    el.addEventListener("mouseleave", ()=> ring.classList.remove("is-hover"));
  });
}

/* ---------- Año dinámico en footer ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ── Canvas interactivo tarjeta Miembro ── */
(function(){
  const card = document.getElementById('plan-member-card');
  const canvas = document.getElementById('member-canvas');
  if(!card || !canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, mouse = {x:0.5, y:0.5}, raf;

  function resize(){
    W = canvas.width  = card.offsetWidth;
    H = canvas.height = card.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(card);

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width;
    mouse.y = (e.clientY - r.top)  / r.height;
  });
  card.addEventListener('mouseleave', () => {
    mouse.x = 0.82; mouse.y = 0.25;
  });

  // Partículas: líneas de cancha de pádel flotantes
  const lines = Array.from({length:18}, (_,i) => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random()-.5)*.0003,
    vy: (Math.random()-.5)*.0003,
    len: .04 + Math.random()*.08,
    angle: Math.random() * Math.PI,
    alpha: .06 + Math.random()*.12,
  }));

  let t = 0;
  function draw(){
    t += .008;
    ctx.clearRect(0,0,W,H);

    // Base oscura del gradiente
    const gBase = ctx.createLinearGradient(0,0,W,H);
    gBase.addColorStop(0,'#101d16');
    gBase.addColorStop(1,'#1c3225');
    ctx.fillStyle = gBase;
    ctx.fillRect(0,0,W,H);

    // Orbe cálido que sigue al cursor
    const ox = mouse.x * W, oy = mouse.y * H;
    const gOrb = ctx.createRadialGradient(ox,oy,0, ox,oy, W*.7);
    gOrb.addColorStop(0,'rgba(188,106,67,.45)');
    gOrb.addColorStop(.5,'rgba(188,106,67,.12)');
    gOrb.addColorStop(1,'transparent');
    ctx.fillStyle = gOrb;
    ctx.fillRect(0,0,W,H);

    // Segundo orbe fijo esquina sup derecha
    const g2 = ctx.createRadialGradient(W*.9,H*.05,0, W*.9,H*.05, W*.5);
    g2.addColorStop(0,'rgba(188,106,67,.28)');
    g2.addColorStop(1,'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0,0,W,H);

    // Líneas de cancha flotantes
    lines.forEach(l => {
      l.x += l.vx; l.y += l.vy;
      if(l.x<-.1) l.x=1.1; if(l.x>1.1) l.x=-.1;
      if(l.y<-.1) l.y=1.1; if(l.y>1.1) l.y=-.1;
      l.angle += .0008;
      const pulse = l.alpha * (.7 + .3 * Math.sin(t + l.x * 8));
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = '#d0865a';
      ctx.lineWidth = .8;
      ctx.beginPath();
      const lx = l.x*W, ly = l.y*H, ln = l.len*Math.min(W,H);
      ctx.moveTo(lx - Math.cos(l.angle)*ln, ly - Math.sin(l.angle)*ln);
      ctx.lineTo(lx + Math.cos(l.angle)*ln, ly + Math.sin(l.angle)*ln);
      ctx.stroke();
      ctx.restore();
    });

    // Red de cancha tenue en el fondo
    ctx.save();
    ctx.globalAlpha = .04 + .02*Math.sin(t*.4);
    ctx.strokeStyle = '#d0865a';
    ctx.lineWidth = .6;
    // línea central horizontal
    ctx.beginPath(); ctx.moveTo(0,H*.5); ctx.lineTo(W,H*.5); ctx.stroke();
    // línea central vertical
    ctx.beginPath(); ctx.moveTo(W*.5,0); ctx.lineTo(W*.5,H); ctx.stroke();
    // recuadro cancha
    ctx.strokeRect(W*.08, H*.12, W*.84, H*.76);
    ctx.restore();

    raf = requestAnimationFrame(draw);
  }
  draw();
})();
