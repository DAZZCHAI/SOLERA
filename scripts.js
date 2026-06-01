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