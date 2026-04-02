/* ════════════════════════════════════════════════
   script.js  —  Birthday Website for You 🎀
   ════════════════════════════════════════════════ */

// ══════════════════════════════════════
// CONFIG — ⚠️ CHANGE THESE!
// ══════════════════════════════════════

const CORRECT_PIN     = "000000";               // ← Her birthday DDMMYY
const LOVE_START_DATE = new Date('2024-06-15'); // ← The day you two got together

// ══════════════════════════════════════
// PHOTO SLIDES CONFIG
// Add or remove objects to change number of photo slides
// ══════════════════════════════════════
const photoSlides = [
  { caption: "This was our first picture,\na moment I'll always remember 🌸", btnText: "next →" },
  { caption: "Every moment with you is\nmy favorite memory 💕",              btnText: "next →" },
  { caption: "You make every day\nso much brighter ✨",                       btnText: "next →" },
];

// ══════════════════════════════════════
// BUILD PHOTO + WISHES SLIDES DYNAMICALLY
// ══════════════════════════════════════
const wrap        = document.getElementById('slidesWrap');
const totalFixed  = 3;                              // slides 0, 1, 2 already in HTML
const photoStartIdx = totalFixed;
const wishesIdx   = totalFixed + photoSlides.length;

photoSlides.forEach((ps, i) => {
  const slideIdx = photoStartIdx + i;
  const div = document.createElement('div');
  div.className = 'slide';
  div.id = 'slide' + slideIdx;
  div.innerHTML = `
    <div class="slide-inner">
      <div class="photo-frame" id="pframe${i}">
        <div class="photo-placeholder" id="pph${i}" onclick="triggerUpload(${i})">
          <span class="ph-icon">📸</span>
          <span class="ph-txt">tap to add photo 💕</span>
        </div>
        <input class="photo-upload-input" type="file" accept="image/*"
               id="pfile${i}" onchange="handlePhoto(event,${i})">
      </div>
      <p class="photo-caption-text">${ps.caption.replace(/\n/g, '<br>')}</p>
      <button class="btn-pink" style="margin-top:18px;" onclick="goSlide(${slideIdx + 1})">${ps.btnText}</button>
    </div>
  `;
  wrap.appendChild(div);
});

// ── Wishes / last slide ──
const wishDiv = document.createElement('div');
wishDiv.className = 'slide';
wishDiv.id = 'slide' + wishesIdx;
wishDiv.innerHTML = `
  <div class="slide-inner">
    <svg class="kuromi-img" style="width:130px;height:130px;" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="76"  cy="52"  rx="22" ry="14" fill="#ff3fa4" transform="rotate(-30,76,52)"/>
      <ellipse cx="124" cy="52"  rx="22" ry="14" fill="#ff3fa4" transform="rotate(30,124,52)"/>
      <circle  cx="100" cy="57"  r="10"  fill="#ff85c8"/>
      <ellipse cx="100" cy="105" rx="52" ry="50" fill="#2d0033"/>
      <ellipse cx="58"  cy="72"  rx="16" ry="22" fill="#2d0033"/>
      <ellipse cx="142" cy="72"  rx="16" ry="22" fill="#2d0033"/>
      <ellipse cx="100" cy="112" rx="36" ry="30" fill="white"/>
      <path d="M82 105 Q86 99 90 105"   stroke="#2d0033" stroke-width="3"   fill="none" stroke-linecap="round"/>
      <path d="M110 105 Q114 99 118 105" stroke="#2d0033" stroke-width="3"  fill="none" stroke-linecap="round"/>
      <ellipse cx="80"  cy="115" rx="10" ry="6" fill="#ff85c8" opacity=".5"/>
      <ellipse cx="120" cy="115" rx="10" ry="6" fill="#ff85c8" opacity=".5"/>
      <path d="M89 122 Q100 132 111 122" stroke="#2d0033" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="100" cy="86" rx="12" ry="10" fill="white"/>
      <circle  cx="96"  cy="84" r="2.5" fill="#2d0033"/>
      <circle  cx="104" cy="84" r="2.5" fill="#2d0033"/>
      <path d="M95 90 L97 90 L97 93 M100 90 L100 93 M103 90 L103 93 L105 93"
            stroke="#2d0033" stroke-width="1.5" fill="none"/>
      <ellipse cx="100" cy="168" rx="38" ry="30" fill="#2d0033"/>
      <line x1="62"  y1="148" x2="38"  y2="122" stroke="#2d0033" stroke-width="18" stroke-linecap="round"/>
      <line x1="138" y1="148" x2="162" y2="122" stroke="#2d0033" stroke-width="18" stroke-linecap="round"/>
      <circle cx="38"  cy="118" r="12" fill="#2d0033"/>
      <circle cx="162" cy="118" r="12" fill="#2d0033"/>
      <text x="12"  y="110" font-size="20" fill="#ff3fa4">✦</text>
      <text x="158" y="100" font-size="20" fill="#ff85c8">✦</text>
    </svg>
    <h1 class="wish-title">Happy Birthday,<br>My Love 🎀</h1>
    <div class="wish-emojis">
      <span>🎂</span><span>🎀</span><span>💖</span><span>✨</span><span>🌸</span><span>💕</span>
    </div>
    <p class="wish-body">
      Selamat ulang tahun, sayangku 🌸<br><br>
      Every single day with you is the best day of my life.
      You are my favorite person, my safe place, my biggest happiness. 💕<br><br>
      I hope this year brings you everything you've ever dreamed of —
      more laughter, more love, more beautiful moments. ✨<br><br>
      Thank you for existing. Thank you for being mine.
      I love you more than all the stars in the sky, forever and always. 🖤🎀
    </p>
    <div style="margin-top:24px;font-family:'Dancing Script',cursive;font-size:1.6rem;color:#ff3fa4;">
      From me, only for you 💕
    </div>
    <button class="btn-pink" style="margin-top:22px;"
            onclick="launchConfetti();launchConfetti();">🎉 Celebrate! 🎉</button>
  </div>
`;
wrap.appendChild(wishDiv);

// ══════════════════════════════════════
// SLIDE NAVIGATION
// ══════════════════════════════════════
let currentSlide = 0;
const totalSlides = wishesIdx + 1;

function goSlide(idx) {
  if (idx < 0 || idx >= totalSlides) return;
  const cur  = document.getElementById('slide' + currentSlide);
  const next = document.getElementById('slide' + idx);
  cur.classList.remove('active');
  cur.classList.add('exit-left');
  setTimeout(() => cur.classList.remove('exit-left'), 600);
  next.classList.add('active');
  currentSlide = idx;
}

// ══════════════════════════════════════
// PASSWORD
// ══════════════════════════════════════
let pin = '';

function pressNum(n) {
  if (pin.length >= 6) return;
  pin += n;
  updateDots();
  if (pin.length === 6) checkPin();
}

function pressDelete() {
  pin = pin.slice(0, -1);
  updateDots();
  document.getElementById('wrongMsg').textContent = '';
}

function updateDots() {
  for (let i = 0; i < 6; i++) {
    document.getElementById('d' + i).classList.toggle('filled', i < pin.length);
  }
}

function checkPin() {
  if (pin === CORRECT_PIN) {
    launchConfetti();
    setTimeout(() => goSlide(1), 400);
    pin = '';
    updateDots();
  } else {
    document.getElementById('wrongMsg').textContent = 'Wrong password! Try again 🥺';
    document.querySelectorAll('.dot').forEach(d => {
      d.classList.add('shake');
      setTimeout(() => d.classList.remove('shake'), 400);
    });
    document.getElementById('slide0').style.animation = 'slideShake .4s ease';
    setTimeout(() => { document.getElementById('slide0').style.animation = ''; }, 450);
    setTimeout(() => {
      pin = '';
      updateDots();
      document.getElementById('wrongMsg').textContent = '';
    }, 900);
  }
}

// ══════════════════════════════════════
// NOO BUTTON
// ══════════════════════════════════════
const nooMessages = [
  "too bad, you have to!! 😈🎀",
  "nope, click yess!! 🌸",
  "come on!! 💕",
  "I know you want to 🥺",
  "ok fine… just kidding, click yess!! 😆"
];
let nooCount = 0;

function nooPressed() {
  document.getElementById('nooMsg').textContent = nooMessages[nooCount % nooMessages.length];
  nooCount++;
  const btn = document.querySelector('.btn-outline');
  btn.style.animation = 'slideShake .3s ease';
  setTimeout(() => btn.style.animation = '', 350);
}

// ══════════════════════════════════════
// CAKE → CANDLE BLOW → TREE → BIRTHDAY
// ══════════════════════════════════════
let cakeBlown = false;

function blowCake() {
  if (cakeBlown) return;
  cakeBlown = true;
  const em = document.getElementById('cakeEm');
  em.style.transition = 'opacity .3s ease, transform .3s ease';
  em.style.opacity = '0';
  em.style.transform = 'scale(.7)';
  setTimeout(() => { em.style.display = 'none'; startCandleBlow(); }, 320);
}

// ── CANDLE BLOW ANIMATION ─────────────────────────
function startCandleBlow() {
  const cvs = document.getElementById('htc');
  cvs.style.display = 'block';
  cvs.style.opacity = '1';
  cvs.style.transform = 'translateX(0)';
  const ctx = cvs.getContext('2d');
  cvs.width = innerWidth; cvs.height = innerHeight;
  const W = cvs.width, H = cvs.height, CX = W / 2;
  const cakeCY     = H * 0.56;
  const candleBaseY = cakeCY - 44;
  const candleXs   = [-38, 0, 38];
  const flameOutAt = [1500, 1700, 1900];
  const s = performance.now();

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  function drawCake(cx, cy) {
    // shadow
    ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = '#ff3fa4';
    ctx.beginPath(); ctx.ellipse(cx, cy + 60, 68, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // bottom tier
    ctx.fillStyle = '#ff85c8'; rrect(cx - 68, cy, 136, 58, 14); ctx.fill();
    // frosting blobs bottom
    ctx.fillStyle = 'white';
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(cx - 56 + i * 19, cy + 5, 8, 12, 0, 0, Math.PI * 2); ctx.fill(); }
    // stripe
    ctx.fillStyle = 'rgba(255,255,255,.25)'; rrect(cx - 68, cy + 22, 136, 14, 0); ctx.fill();
    // top tier
    ctx.fillStyle = '#ff3fa4'; rrect(cx - 46, cy - 44, 92, 46, 11); ctx.fill();
    // frosting blobs top
    ctx.fillStyle = 'white';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(cx - 36 + i * 18, cy - 41, 7, 11, 0, 0, Math.PI * 2); ctx.fill(); }
    // sprinkles
    const sc = ['#ff3fa4', '#c026d3', '#ffb6d9', '#fff', '#ffd6ef'];
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = sc[i % 5];
      ctx.save(); ctx.translate(cx - 58 + Math.sin(i * 2.4) * 52, cy + 14 + Math.cos(i * 1.9) * 20);
      ctx.rotate(i * 0.7); ctx.beginPath(); ctx.ellipse(0, 0, 2.5, 5.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    // heart deco
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px serif'; ctx.textAlign = 'center';
    ctx.fillText('♥', cx - 14, cy - 16); ctx.fillText('♥', cx + 14, cy - 16);
  }

  function drawCandle(cx, cy, flameAlpha, flickX, smokeT) {
    // body
    ctx.fillStyle = '#fff0f9'; rrect(cx - 5.5, cy - 36, 11, 38, 3); ctx.fill();
    ctx.strokeStyle = '#ffb6d9'; ctx.lineWidth = 1; rrect(cx - 5.5, cy - 36, 11, 38, 3); ctx.stroke();
    // wick
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy - 36); ctx.lineTo(cx + flickX * 0.2, cy - 42); ctx.stroke();
    // flame
    if (flameAlpha > 0.01) {
      const fx = cx + flickX;
      ctx.save(); ctx.globalAlpha = flameAlpha;
      const gl = ctx.createRadialGradient(fx, cy - 48, 0, fx, cy - 46, 16);
      gl.addColorStop(0, 'rgba(255,190,0,.55)'); gl.addColorStop(1, 'transparent');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(fx, cy - 46, 16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(fx, cy - 38);
      ctx.bezierCurveTo(fx + 9 + flickX, cy - 46, fx + 9 + flickX * 1.2, cy - 60, fx, cy - 65);
      ctx.bezierCurveTo(fx - 9 + flickX * .3, cy - 60, fx - 6 + flickX * .3, cy - 46, fx, cy - 38);
      ctx.fill();
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath();
      ctx.moveTo(fx, cy - 40);
      ctx.bezierCurveTo(fx + 5 + flickX * .7, cy - 46, fx + 4 + flickX * .8, cy - 57, fx, cy - 60);
      ctx.bezierCurveTo(fx - 4 + flickX * .2, cy - 57, fx - 3 + flickX * .2, cy - 46, fx, cy - 40);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      ctx.beginPath(); ctx.ellipse(fx, cy - 50, 2.2, 5, flickX * .04, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // smoke
    if (smokeT > 0) {
      for (let i = 0; i < 4; i++) {
        const sp = Math.min(1, (smokeT - i * .12)); if (sp <= 0) continue;
        const sY = cy - 40 - sp * 60 * ((i + 1) * .45);
        const sX = cx + Math.sin(sp * Math.PI * 2.8 + i * 2.2) * 7 * (i * .6 + .6);
        ctx.save(); ctx.globalAlpha = Math.max(0, .4 * (1 - sp) * sp * 3.5 * (1 - i * .18));
        ctx.fillStyle = '#bbb';
        ctx.beginPath(); ctx.arc(sX, sY, 3.5 + i * 2.8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
  }

  function drawWind(p, refY) {
    if (p <= 0) return;
    const fade = p < .85 ? 1 : 1 - (p - .85) / .15;
    const waves = [{ dy: -28, a: .9 }, { dy: -12, a: 1 }, { dy: 4, a: .85 }, { dy: 18, a: .7 }];
    waves.forEach(w => {
      const endX = W * .94 - W * .82 * p;
      ctx.save(); ctx.globalAlpha = w.a * p * fade * .75;
      ctx.strokeStyle = '#ffb6d9'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(W * .98, refY + w.dy);
      ctx.bezierCurveTo(W * .98 - W * .3 * p, refY + w.dy - 10, endX + W * .25 * p, refY + w.dy + 6, endX, refY + w.dy);
      ctx.stroke(); ctx.restore();
    });
  }

  function loop(now) {
    const el = now - s;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'rgba(255,240,251,.97)'); bg.addColorStop(1, 'rgba(255,214,239,.97)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    drawCake(CX, cakeCY);

    const windP = Math.max(0, Math.min(1, (el - 450) / 900));
    drawWind(windP, candleBaseY - 48);

    candleXs.forEach((ox, i) => {
      const cx = CX + ox, cy = candleBaseY;
      let fa = 1, fx = 0, sm = 0;
      if (el > 450) { const t = el * .018 + i * 1.4; fx = Math.min(0, -windP * (9 + i * 2.5) + Math.sin(t) * 2.2 + Math.sin(t * 1.6) * 2.8); }
      if (el >= flameOutAt[i]) {
        const ext = Math.min(1, (el - flameOutAt[i]) / 200);
        fa = 1 - ext;
        if (ext > .45) sm = (ext - .45) / 1.1;
      }
      drawCandle(cx, cy, fa, fx, sm);
    });

    if (el >= 2600) {
      const fadeOut = Math.min(1, (el - 2600) / 350);
      cvs.style.opacity = String(1 - fadeOut);
      if (el >= 2980) { cvs.style.opacity = '1'; startHeartTree(); return; }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ── HEART-SHAPED FLOWER TREE ANIMATION ───────────
let heartTreeStarted = false;
function startHeartTree() {
  if (heartTreeStarted) return;
  heartTreeStarted = true;
  const cvs = document.getElementById('htc');
  cvs.style.transition = 'none';   // remove fade so tree appears instantly
  cvs.style.display    = 'block';
  cvs.style.opacity    = '1';
  cvs.style.transform  = 'translateX(0)';
  const ctx = cvs.getContext('2d');
  cvs.width = innerWidth; cvs.height = innerHeight;

  const W = cvs.width, H = cvs.height, CX = W / 2;
  const GROUND      = H * .74;
  const TRUNK_MAX_H = Math.min(H * .34, 210);
  const TRUNK_W     = 19;

  // Easings
  const easeInOutSine  = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const easeOutCubic   = t => 1 - (1 - t) ** 3;
  const easeOutElastic = t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1;

  // Draw a 6-petal flower
  function drawFlower(x, y, r, petalColor, centerColor, alpha = 1) {
    if (r <= 0 || alpha <= 0) return;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.save(); ctx.globalAlpha = alpha * .92; ctx.fillStyle = petalColor;
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * r * .62, y + Math.sin(a) * r * .62, r * .58, r * .38, a, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    }
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = centerColor;
    ctx.beginPath(); ctx.arc(x, y, r * .4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  // Pre-generate heart-shaped canopy positions
  const HEART_CX = CX, HEART_CY = GROUND - TRUNK_MAX_H - 10, HS = Math.min(W * .23, 82);

  function insideHeart(px, py) {
    const x = (px - HEART_CX) / HS, y = -(py - HEART_CY) / HS;
    return Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y <= 0;
  }

  const flowerGrid = [];
  for (let fy = HEART_CY - HS * 1.6; fy <= HEART_CY + HS * 1.45; fy += 17) {
    for (let fx = HEART_CX - HS * 1.65; fx <= HEART_CX + HS * 1.65; fx += 17) {
      if (insideHeart(fx, fy)) {
        const normY = (fy - (HEART_CY - HS * 1.6)) / (HS * 3.05);
        flowerGrid.push({
          x: fx + (Math.random() - .5) * 5,
          y: fy + (Math.random() - .5) * 5,
          delay: (1 - normY) * .35 + Math.random() * .18,
          size:  6 + Math.random() * 5,
          petal:  Math.random() < .55 ? '#ff3fa4' : (Math.random() < .5 ? '#ff69b4' : '#ffb6d9'),
          center: Math.random() < .6  ? '#2d0033' : '#9d174d'
        });
      }
    }
  }

  // Branch definitions
  const branches = [
    { hf: .42, ang: -2.15,         len: 78, lw: 8,   delay: 0   },
    { hf: .42, ang:  -.99,         len: 78, lw: 8,   delay: 80  },
    { hf: .60, ang: -2.38,         len: 60, lw: 6,   delay: 180 },
    { hf: .60, ang:  -.76,         len: 60, lw: 6,   delay: 260 },
    { hf: .76, ang: -2.05,         len: 48, lw: 5,   delay: 360 },
    { hf: .76, ang: -1.09,         len: 48, lw: 5,   delay: 430 },
    { hf: .92, ang: -Math.PI / 2,  len: 38, lw: 3.5, delay: 520 },
  ];

  // Timing (ms)
  const T = { trunkStart: 120, trunkDone: 2100, flowersStart: 2100, flowersDone: 4900, swipeOut: 5300 };
  const gStart   = performance.now();
  let swipeDone  = false;

  function loop(now) {
    const el = now - gStart;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'rgba(255,240,251,.97)'); bg.addColorStop(1, 'rgba(255,214,239,.97)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Ground shadow
    if (el > T.trunkStart) {
      const sp = Math.min(1, (el - T.trunkStart) / 600);
      ctx.save(); ctx.globalAlpha = .18 * sp; ctx.fillStyle = '#ff85c8';
      ctx.beginPath(); ctx.ellipse(CX, GROUND + 13, 55 * sp, 10 * sp, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    // Trunk
    let trunkP = 0;
    if (el > T.trunkStart) {
      const t = Math.min(1, Math.max(0, (el - T.trunkStart) / (T.trunkDone - T.trunkStart)));
      trunkP = easeInOutSine(t);
      const h = TRUNK_MAX_H * trunkP, topY = GROUND - h;
      const bw = TRUNK_W, tw = TRUNK_W * .48;
      ctx.save(); ctx.fillStyle = '#8b4513';
      ctx.beginPath();
      ctx.moveTo(CX - bw / 2, GROUND);
      ctx.bezierCurveTo(CX - bw / 2, GROUND - h * .5,  CX - tw / 2, GROUND - h * .82, CX - tw / 2, topY);
      ctx.lineTo(CX + tw / 2, topY);
      ctx.bezierCurveTo(CX + tw / 2, GROUND - h * .82, CX + bw / 2, GROUND - h * .5,  CX + bw / 2, GROUND);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#6b3410'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(CX - 3, GROUND);
      ctx.bezierCurveTo(CX - 5, GROUND - h * .38, CX + 4, GROUND - h * .62, CX + 1, topY);
      ctx.stroke(); ctx.restore();

      // Branches
      branches.forEach((b, i) => {
        const bts = T.trunkStart + (T.trunkDone - T.trunkStart) * b.hf * .82 + b.delay;
        if (el < bts) return;
        const bp     = Math.min(1, easeOutCubic((el - bts) / 700));
        const bRootY = GROUND - TRUNK_MAX_H * b.hf * trunkP;
        if (bRootY < topY) return;
        const ex  = CX + Math.cos(b.ang) * b.len * bp;
        const ey  = bRootY + Math.sin(b.ang) * b.len * bp;
        const cpx = CX + Math.cos(b.ang) * b.len * .42 * bp;
        const cpy = bRootY + Math.sin(b.ang) * b.len * .58 * bp - 16 * bp * (i % 2 === 0 ? 1 : -.5);
        ctx.save(); ctx.strokeStyle = '#8b4513'; ctx.lineWidth = b.lw; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(CX, bRootY); ctx.quadraticCurveTo(cpx, cpy, ex, ey); ctx.stroke();
        if (bp > .75) {
          const sbp = (bp - .75) / .25;
          [[b.ang - .42, .48], [b.ang + .38, .44], [b.ang - .15, .35]].forEach(([sa, lf]) => {
            const sl = b.len * lf * sbp;
            ctx.lineWidth = Math.max(1, b.lw * .45); ctx.beginPath();
            ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(sa) * sl, ey + Math.sin(sa) * sl); ctx.stroke();
          });
        }
        ctx.restore();
      });
    }

    // Heart-shaped flower canopy
    if (el > T.flowersStart) {
      const fEl = el - T.flowersStart, totalDur = T.flowersDone - T.flowersStart;
      flowerGrid.forEach(f => {
        const fStart = f.delay * totalDur;
        if (fEl < fStart) return;
        const fp = Math.min(1, easeOutElastic((fEl - fStart) / 650));
        if (fp <= 0) return;
        drawFlower(f.x, f.y, f.size * fp, f.petal, f.center, fp);
      });
    }

    // Tree done → shift canvas RIGHT, reveal text on LEFT (same screen, no page change)
    if (!swipeDone && el > T.swipeOut) {
      swipeDone = true;
      // Slide the full-screen tree canvas to the right
      cvs.style.transition = 'transform 1s cubic-bezier(.4,0,.2,1)';
      cvs.style.transform  = 'translateX(44%)';
      // After the canvas slides, fade in the left text panel + bottom timer
      setTimeout(showSplitLayout, 500);
      return; // stop rAF – canvas stays frozen showing the tree
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ── SHOW SPLIT LAYOUT (tree right, text left) ────
function showSplitLayout() {
  const panel = document.getElementById('splitPanel');
  const timer = document.getElementById('splitTimer');
  if (panel) { panel.style.display = 'flex'; }
  if (timer) { timer.style.display = 'flex'; }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (panel) panel.classList.add('show');
    if (timer) timer.classList.add('show');
  }));
  startLoveTimer();
  launchConfetti();
}

// ── LOVE TIMER ───────────────────────────────────
let timerInterval = null;
function startLoveTimer() {
  function update() {
    const diff  = Math.max(0, Date.now() - LOVE_START_DATE.getTime());
    const secs  = Math.floor(diff / 1000);
    const mins  = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    const pad   = n => String(n).padStart(2, '0');
    const g     = id => document.getElementById(id);
    if (g('tmDays'))  g('tmDays').textContent  = days;
    if (g('tmHours')) g('tmHours').textContent = pad(hours % 24);
    if (g('tmMins'))  g('tmMins').textContent  = pad(mins  % 60);
    if (g('tmSecs'))  g('tmSecs').textContent  = pad(secs  % 60);
  }
  update();
  timerInterval = setInterval(update, 1000);
}

// ── BIRTHDAY GREETING ────────────────────────────
function showBirthdayGreeting() {
  const el = document.getElementById('bdayGreeting');
  el.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  launchConfetti(); launchConfetti();
}

// ══════════════════════════════════════
// PHOTO UPLOAD
// ══════════════════════════════════════
function triggerUpload(i) {
  document.getElementById('pfile' + i).click();
}

function handlePhoto(e, i) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    const frame = document.getElementById('pframe' + i);
    const ph    = document.getElementById('pph' + i);
    ph.style.display = 'none';
    const img = document.createElement('img');
    img.src = ev.target.result;
    frame.insertBefore(img, ph);
  };
  r.readAsDataURL(f);
  e.target.value = '';
}

// ══════════════════════════════════════
// CONFETTI  (DOM + CSS — GPU composited, zero canvas overhead)
// ══════════════════════════════════════
const _cnfShapes = ['💕', '🌸', '🎀', '✨', '🩷', '💖', '🎉', '⭐', '🎊'];
let   _cnfContainer = null;

function _getCnfContainer() {
  if (_cnfContainer) return _cnfContainer;
  _cnfContainer = document.createElement('div');
  _cnfContainer.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(_cnfContainer);
  return _cnfContainer;
}

function launchConfetti() {
  const wrap = _getCnfContainer();
  const W    = window.innerWidth;

  for (let i = 0; i < 90; i++) {
    const el   = document.createElement('span');
    const em   = _cnfShapes[~~(Math.random() * _cnfShapes.length)];
    const sz   = 14 + ~~(Math.random() * 4) * 4;          // 14 18 22 26
    const x    = Math.random() * W;
    const isMobile = window.innerWidth < 768;
    const dur  = (isMobile ? 3200 : 1800) + Math.random() * 1400; // fall duration ms
    const sway = (Math.random() - .5) * 160;               // horizontal drift px
    const rot  = (Math.random() - .5) * 720;               // total rotation deg
    const del  = Math.random() * 400;                      // stagger ms

    el.textContent = em;
    el.style.cssText = `
      position:absolute;
      left:${x}px;
      top:-30px;
      font-size:${sz}px;
      line-height:1;
      will-change:transform,opacity;
      animation:cnfFall ${dur}ms ${del}ms cubic-bezier(.25,.46,.45,.94) forwards;
      --sway:${sway}px;
      --rot:${rot}deg;
    `;
    wrap.appendChild(el);

    // Remove element after animation ends to keep DOM clean
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}

// ══════════════════════════════════════
// MUSIC
// ══════════════════════════════════════
let ac = null, mi = null, mp = false;
const melody = [523, 587, 659, 784, 659, 587, 523, 494, 523, 0, 784, 880, 988, 1047, 988, 880, 784, 698, 784, 0, 659, 784, 880, 0];
let mk = 0;

function toggleMusic() {
  const btn = document.getElementById('musicBtn');
  if (!mp) {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    mi = setInterval(() => {
      const n = melody[mk % melody.length]; mk++;
      if (!n) return;
      const o = ac.createOscillator(), g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.frequency.value = n; o.type = 'sine';
      g.gain.setValueAtTime(.13, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .43);
      o.start(); o.stop(ac.currentTime + .43);
    }, 390);
    btn.textContent = '🎶'; btn.classList.add('spin'); mp = true;
  } else {
    clearInterval(mi);
    btn.textContent = '🎵'; btn.classList.remove('spin'); mp = false;
  }
}

// ══════════════════════════════════════
// FLOATING BG HEARTS
// ══════════════════════════════════════
(function spawnHearts() {
  const c  = document.getElementById('bgH');
  const em = ['🌸', '💕', '✨', '🩷'];
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'bh';
    b.textContent = em[~~(Math.random() * em.length)];
    b.style.left            = Math.random() * 100 + 'vw';
    b.style.fontSize        = (.7 + Math.random() * .7) + 'rem';
    b.style.animationDuration = (10 + Math.random() * 16) + 's';
    b.style.animationDelay    = (Math.random() * 14) + 's';
    c.appendChild(b);
  }
})();
