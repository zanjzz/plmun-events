/* =====================================================================
   PLMUN Campus Events — app.js
   ===================================================================== */

/* =====================================================================
   LUCIDE ICON HELPER
   ===================================================================== */
const icon = (name, { size = 16, cls = "" } = {}) =>
  `<i data-lucide="${name}" class="lucide ${cls}" style="width:${size}px;height:${size}px;stroke-width:1.75"></i>`;

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

/* =====================================================================
   DATA
   ===================================================================== */
const EV = [
  {
    id: 1, t: "Music Fest", o: "Euphoria", c: "Arts", w: 1,
    day: "Wed", md: "Aug 29", full: "Wednesday, August 29, 2026",
    time: "2:00 PM – 5:00 PM", loc: "Main Quadrangle", n: 120,
    img: "images/music-fest.png",
    g: "linear-gradient(135deg,#3b2a1a,#c1652b)",
    s: "An evening of live performances by talented student musicians.",
    d: "Join us for an exciting evening of live performances featuring talented student musicians and campus bands. Enjoy great music, connect with fellow students, and celebrate the creativity of our campus community.",
  },
  {
    id: 2, t: "Career Talk: Cloud", o: "AWS – SBG", c: "Academic", w: 1,
    day: "Fri", md: "Aug 31", full: "Friday, August 31, 2026",
    time: "1:00 PM – 3:00 PM", loc: "Online", n: 80,
    img: "images/career-cloud.png",
    g: "linear-gradient(135deg,#1d4e89,#79b4e8)",
    online: true, link: "https://meet.example.com/aws-cloud-talk",
    s: "Become an aspiring cloud practitioner.",
    d: "Learn how cloud computing careers work from industry practitioners. Topics include core cloud services, entry-level certifications, and how to build a portfolio as a student.",
  },
  {
    id: 3, t: "Sport Fest", o: "Student Council", c: "Sports", w: 1,
    day: "Sat", md: "Sept 1", full: "Saturday, September 1, 2026",
    time: "8:00 AM – 5:00 PM", loc: "University Court", n: 200,
    img: "images/sport-fest.png",
    g: "linear-gradient(135deg,#2e7d32,#a5d66f)",
    s: "A day of competition, teamwork, and school spirit.",
    d: "A full day of friendly inter-college matches: volleyball, basketball, relay races, and more. Come to compete or cheer on your college.",
  },
  {
    id: 4, t: "Student Organization Fair", o: "Student Affairs Office", c: "Clubs", w: 0,
    day: "Wed", md: "Sept 5", full: "Wednesday, September 5, 2026",
    time: "9:00 AM – 4:00 PM", loc: "Gymnasium", n: 300,
    img: "images/org-fair.png",
    g: "linear-gradient(135deg,#7b1fa2,#e1a1f0)",
    s: "Meet and join campus clubs and organizations.",
    d: "Visit booths from more than 30 campus organizations, ask about membership, and sign up for the ones that match your interests.",
  },
  {
    id: 5, t: "Programming Workshop", o: "Computer Society", c: "Academic", w: 0,
    day: "Fri", md: "Sept 7", full: "Friday, September 7, 2026",
    time: "1:00 PM – 4:00 PM", loc: "Online", n: 30,
    img: "images/programming-workshop.png",
    g: "linear-gradient(135deg,#102a43,#4a90a4)",
    online: true, link: "https://meet.example.com/programming-workshop",
    s: "Hands-on coding for beginners.",
    d: "Build your first small web app in three hours. No experience needed. Bring a laptop or use a lab computer.",
  },
  {
    id: 6, t: "Art & Culture Week", o: "Fine Arts Guild", c: "Arts", w: 0,
    day: "Mon", md: "Sept 10", full: "Monday, September 10, 2026",
    time: "10:00 AM – 6:00 PM", loc: "Cultural Center", n: 150,
    img: "images/art-culture.png",
    g: "linear-gradient(135deg,#b23a48,#f6c453)",
    s: "Exhibits, performances, and workshops.",
    d: "A week-long celebration of student art with gallery exhibits, folk dance performances, and hands-on craft workshops.",
  },
  {
    id: 7, t: "Freshmen Orientation", o: "Admissions Office", c: "Academic", w: 0,
    day: "Wed", md: "Sept 12", full: "Wednesday, September 12, 2026",
    time: "8:00 AM – 12:00 PM", loc: "Main Auditorium", n: 0,
    img: "images/freshmen-orientation.png",
    g: "linear-gradient(135deg,#5b3a1e,#d9a35b)",
    s: "Welcome session for new students.",
    d: "Get to know campus services, meet your college officers, and learn what to expect in your first semester.",
  },
  {
    id: 8, t: "Career Development Seminar", o: "Career Center", c: "Academic", w: 0,
    day: "Fri", md: "Sept 14", full: "Friday, September 14, 2026",
    time: "2:00 PM – 4:30 PM", loc: "Online", n: 60,
    img: "images/career-seminar.png",
    g: "linear-gradient(135deg,#37474f,#90a4ae)",
    online: true, link: "https://meet.example.com/career-seminar",
    s: "Resume writing and interview tips.",
    d: "Practice interviews, get resume feedback, and learn how to prepare for internships and first jobs.",
  },
];

const CAT_ICON = { Arts: "palette", Academic: "book-open", Sports: "trophy", Clubs: "users" };
const CATS = ["All", "This week", "Sports", "Clubs", "Academic", "Arts"];

/* =====================================================================
   HELPERS + STATE
   ===================================================================== */
const $   = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

let S = { user: null, joined: {}, saved: [], accounts: {}, acct: {} };
try {
  const stored = JSON.parse(localStorage.getItem("plmun") || "null");
  if (stored) {
    S = { ...S, ...stored };
    if (!S.accounts) S.accounts = {};
    if (!S.acct)     S.acct = {};
    if (S.user && !S.accounts[S.user.email]) {
      S.accounts[S.user.email] = { joined: S.joined || {}, saved: S.saved || [] };
    }
  }
} catch (_) {}

const save = () => {
  if (S.user) S.accounts[S.user.email] = { joined: S.joined, saved: S.saved };
  try { localStorage.setItem("plmun", JSON.stringify(S)); } catch (_) {}
};

function adoptAccount(email, name) {
  const bucket = S.accounts[email] || { joined: {}, saved: [] };
  Object.assign(bucket.joined, S.joined);
  bucket.saved = Array.from(new Set([...bucket.saved, ...S.saved]));
  S.accounts[email] = bucket;
  S.user   = { name, email };
  S.joined = bucket.joined;
  S.saved  = bucket.saved;
}

let cat = "All", q = "", tab = "joined", askCancel = null,
    F = {}, cur = { v: "home" }, prev = "", key = "";
let shouldAnimate = true;

const ev   = (id) => EV.find((e) => e.id == id);
const left = (e)  => Math.max(0, e.n - (S.joined[e.id] ? 1 : 0));
const go   = (h)  => { location.hash = h; };

/* =====================================================================
   THUMB HELPER
   ===================================================================== */
const thumb = (e, cls = "") => e.img
  ? `<img src="${esc(e.img)}" alt="" loading="lazy" decoding="async" draggable="false"
          class="${cls} object-cover w-full h-full"
          onerror="this.style.display='none'" />`
  : "";

/* =====================================================================
   TOAST
   ===================================================================== */
function toast(msg, iconName = "check") {
  const t = $("#toast");
  t.innerHTML = `${icon(iconName, { size: 14, cls: "shrink-0" })}<span>${esc(msg)}</span>`;
  t.setAttribute("data-show", "");
  clearTimeout(toast._h);
  toast._h = setTimeout(() => t.removeAttribute("data-show"), 2800);
  renderIcons();
}

/* =====================================================================
   SCROLL-REVEAL
   ===================================================================== */
function initReveal() {
  const els = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    }),
    { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/* =====================================================================
   VIEW TRANSITION
   ===================================================================== */
function animateView() {
  const app = $("#app");
  app.classList.remove("view-enter");
  void app.offsetHeight;
  app.classList.add("view-enter");
}

/* =====================================================================
   MOBILE NAV TOGGLE
   ===================================================================== */
function closeMobileNav() {
  const t = document.getElementById("nav-toggle");
  const m = document.getElementById("nav-mobile");
  if (!t || !m) return;
  m.classList.add("hidden");
  t.setAttribute("aria-expanded", "false");
  t.innerHTML = `<i data-lucide="menu" class="h-5 w-5"></i>`;
  renderIcons();
}

function toggleMobileNav() {
  const t = document.getElementById("nav-toggle");
  const m = document.getElementById("nav-mobile");
  if (!t || !m) return;
  const open = !m.classList.contains("hidden");
  if (open) return closeMobileNav();
  m.classList.remove("hidden");
  t.setAttribute("aria-expanded", "true");
  t.innerHTML = `<i data-lucide="x" class="h-5 w-5"></i>`;
  renderIcons();
}

/* =====================================================================
   THEME (light / dark) + BACKGROUND
   ===================================================================== */
function updateThemeIcon() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const dark = document.documentElement.classList.contains("dark");
  btn.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}" class="h-5 w-5"></i>`;
  btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  renderIcons();
}

function initTheme() {
  const saved = localStorage.getItem("plmun-theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const dark = saved ? saved === "dark" : !!prefersDark;
  document.documentElement.classList.toggle("dark", dark);
  updateThemeIcon();
}

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("plmun-theme", dark ? "dark" : "light");
  updateThemeIcon();
  updateBackgrounds();
}

/* ── Backgrounds ─────────────────────────────────────────────────── */
const BG = { vanta: null, vantaLoaded: false, uniLoaded: false, skip: false };

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    // Purely a scheduling hint for the browser's network stack — these are
    // decorative background layers, not needed for first paint, so they
    // shouldn't compete for bandwidth/priority with anything the user is
    // actually looking at yet. Unsupported browsers just ignore it.
    s.fetchPriority = "low";
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function mountVanta() {
  const el = document.getElementById("vanta-bg");
  if (!el || BG.skip) return;

  if (BG.vanta) { el.classList.add("active"); return; }

  try {
    if (!window.THREE)
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js");
    if (!window.VANTA)
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.dots.min.js");
    if (!window.VANTA || BG.vanta) return;

    BG.vanta = window.VANTA.DOTS({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x68d601,
      color2: 0xff1a,
      backgroundColor: 0xffffff,
      size: 5.70,
      spacing: 29.00,
      showLines: false
    });
    BG.vantaLoaded = true;
    el.classList.add("active");
  } catch (_) {}
}

function unmountVanta() {
  const el = document.getElementById("vanta-bg");
  if (el) el.classList.remove("active");
  if (BG.vanta) {
    BG.vanta.destroy();
    BG.vanta = null;
    BG.vantaLoaded = false;
  }
}

async function mountUnicorn() {
  const el = document.getElementById("aura-bg");
  if (!el || BG.skip) return;

  el.classList.add("active");
  if (BG.uniLoaded) return;
  BG.uniLoaded = true;

  try {
    if (!window.UnicornStudio) {
      await loadScriptOnce("https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js");
    }
    if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  } catch (_) {}
}

function unmountUnicorn() {
  const el = document.getElementById("aura-bg");
  if (el) el.classList.remove("active");
  if (window.UnicornStudio && BG.uniLoaded) {
    window.UnicornStudio.destroy();
    window.UnicornStudio.isInitialized = false;
  }
  BG.uniLoaded = false;
}

function updateBackgrounds() {
  const dark = document.documentElement.classList.contains("dark");
  if (dark) { unmountVanta(); mountUnicorn(); }
  else      { unmountUnicorn(); mountVanta(); }
}

function initBackgrounds() {
  BG.skip = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
         || !!navigator.connection?.saveData;

  // Same effect as the previous fixed 60ms delay — let first paint happen
  // before spending bandwidth on decorative background libraries — but
  // scheduled on the browser's actual idle signal instead of a guessed
  // timeout, so it fires as soon as it safely can rather than always
  // waiting the full 60ms (and still falls back to the old timeout on
  // browsers without requestIdleCallback, e.g. Safari).
  const schedule = window.requestIdleCallback
    ? (cb) => requestIdleCallback(cb, { timeout: 300 })
    : (cb) => setTimeout(cb, 60);
  requestAnimationFrame(() => schedule(updateBackgrounds));
}

/* =====================================================================
   CONFIRMATION PARTICLES (canvas — floating spinning rounded squares)
   ===================================================================== */
let particleCleanup = null;

function stopConfirmationParticles() {
  if (particleCleanup) {
    particleCleanup();
    particleCleanup = null;
  }
}

function startConfirmationParticles() {
  const canvas = document.getElementById("confirm-particles");
  const parent = canvas?.parentElement;
  if (!canvas || !parent) return null;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;

  function resize() {
    const rect = parent.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return () => window.removeEventListener("resize", onResize);
  }

  /* Particle count — a bit more than before so bigger squares appear often */
  const COUNT = Math.min(56, Math.max(28, Math.floor(w / 26)));
  const particles = [];

  function makeParticle(initial) {
    // Sizes: mostly small, some medium, occasional big
    const roll = Math.random();
    const size =
      roll > 0.88 ? 26 + Math.random() * 14   // big  (26–40)
    : roll > 0.60 ? 14 + Math.random() * 10   // mid  (14–24)
    :                4 + Math.random() * 10;  // small (4–14)

    const isBig = size >= 20;
    const cornerRadius = Math.min(size * 0.22, 6);

    return {
      size,
      cornerRadius,
      x: Math.random() * w,
      /* All spawn below the visible area. Burst carries them up into view. */
      y: h + 30 + Math.random() * 140,

      /* Velocities in px/second — frame-rate independent */
      vyBurst:  -(190 + Math.random() * 220) * (isBig ? 0.7 : 1),
      vyCruise: -(7 + Math.random() * 22),
      vxBurst:  (Math.random() - 0.5) * 90,
      vxCruise: (Math.random() - 0.5) * 14,

      rotBurst:  (Math.random() - 0.5) * 5.4,    // rad/s — fast spin at first
      rotCruise: (Math.random() - 0.5) * 0.75,   // rad/s — gentle drift after

      rot: Math.random() * Math.PI * 2,
      vy: 0, vx: 0, rotSpeed: 0,
      alpha: 0,

      targetAlpha: isBig
        ? 0.04 + Math.random() * 0.08
        : 0.08 + Math.random() * 0.22,

      /* Burst timing */
      timeAlive: 0,
      burstDelay: initial ? Math.random() * 0.45 : 0,   // staggered entry
      burstDuration: 1.4 + Math.random() * 1.3,          // 1.4–2.7 s

      color: Math.random() > 0.65
        ? "#c8f5d8"
        : (Math.random() > 0.5 ? "#a5e0bd" : "#7dd3a0"),
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(makeParticle(true));

  let rafId = 0;
  let last = performance.now();

  function draw(p) {
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;

    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(-s / 2, -s / 2, s, s, p.cornerRadius);
      ctx.fill();
    } else {
      /* Fallback for browsers without roundRect */
      ctx.fillRect(-s / 2, -s / 2, s, s);
    }
    ctx.restore();
  }

  function frame(now) {
    const dtSec = Math.min((now - last) / 1000, 0.1);
    last = now;
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.timeAlive += dtSec;

      /* Still waiting to burst */
      if (p.timeAlive < p.burstDelay) continue;

      const t = Math.min(1, (p.timeAlive - p.burstDelay) / p.burstDuration);
      /* Ease-out cubic — fast at first, gently decelerating */
      const ease = 1 - Math.pow(1 - t, 3);

      p.vy       = p.vyBurst  + (p.vyCruise  - p.vyBurst)  * ease;
      p.vx       = p.vxBurst  + (p.vxCruise  - p.vxBurst)  * ease;
      p.rotSpeed = p.rotBurst + (p.rotCruise - p.rotBurst) * ease;

      /* Fade in over the first 35% of the burst */
      const alphaT = Math.min(1, t / 0.35);
      p.alpha = p.targetAlpha * (1 - Math.pow(1 - alphaT, 3));

      p.y   += p.vy * dtSec;
      p.x   += p.vx * dtSec;
      p.rot += p.rotSpeed * dtSec;

      /* Recycle once off the top — resets with no burst (cruise-only drift) */
      if (p.y + p.size < -60) {
        const fresh = makeParticle(false);
        fresh.burstDelay   = 0;
        fresh.burstDuration = 0.001;   // skip burst, straight to cruise
        Object.assign(p, fresh);
        p.timeAlive = 1;               // past delay
        continue;
      }

      draw(p);
    }

    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);

  return () => {
    window.removeEventListener("resize", onResize);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

/* =====================================================================
   DESIGN TOKENS
   ===================================================================== */
const WRAP        = "mx-auto max-w-[1080px] px-4 pt-10 pb-16 sm:px-6 sm:pt-12";
const WRAP_DETAIL = "mx-auto max-w-[1080px] px-4 pt-6 pb-16 sm:px-6 sm:pt-8";

const GRID  = "mt-6 grid grid-cols-1 gap-4 mx-auto max-w-[340px] sm:max-w-none sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-5";

const H1  = "mb-3 text-[clamp(30px,5vw,52px)] font-extrabold leading-[1.03] tracking-[-0.045em] text-g";
const H1S = "mb-2 text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-g";
const SUB = "mb-6 max-w-[52ch] text-[15px] leading-relaxed text-mut";

const FORM    = "mx-auto max-w-[480px] rounded-2xl border border-g/12 bg-white p-8 shadow-form";
const FORM_H1 = "mb-1 text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.04em] text-g";
const SUM     = "mb-2 rounded-xl bg-g-l px-4 py-3 text-[13px] leading-relaxed text-g/80";
const LBL     = "mt-4 mb-1.5 block text-[11.5px] font-bold uppercase tracking-[.07em] text-g/60";
const INPUT   = "w-full rounded-xl border-[1.5px] border-g/25 bg-white px-4 py-2.5 text-[14.5px] placeholder:text-neutral-400 aria-[invalid=true]:border-err aria-[invalid=true]:bg-red-50 transition-all";
const ERR     = "mt-4 flex items-start gap-2.5 rounded-xl border-l-4 border-err bg-red-50 px-4 py-3 text-[13.5px] font-semibold text-err";
const ROW = "mt-6 flex flex-wrap justify-center gap-3 btn-pair";
const EQ      = "[&>*]:min-w-[120px] [&>*]:flex-1";
const EMPTY   = "mt-6 rounded-2xl border-2 border-dashed border-g/20 px-6 py-16 text-center empty-state";

const BTN = "btn-base inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border text-center font-semibold transition whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40 select-none";
const BTN_V = {
  d:  "border-g       bg-g       text-white hover:bg-g-d",
  o:  "border-g/25    bg-white   text-g     hover:border-g hover:bg-g-l",
  ow: "border-white/35 bg-white/10 text-white hover:bg-white/20",
  ok: "border-ok      bg-ok      text-white hover:brightness-110",
  x:  "border-err     bg-err     text-white hover:brightness-110",
  p:  "border-white   bg-white   text-g     hover:bg-cream",
};
const btn = (v = "d", sm = false) =>
  `${BTN} ${BTN_V[v]} ${sm ? "min-h-[34px] px-3.5 py-1.5 text-[12.5px]" : "min-h-[42px] px-5 py-2.5 text-[13.5px]"}`;

const pill = (on) =>
  `cat-pill cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-medium select-none
   ${on ? "border-g bg-g text-white shadow-sm" : "border-g/25 text-g hover:border-g hover:bg-g-l"}`;

const badge = (txt, cls = "bg-white/20 text-white") =>
  `<span class="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${cls}">${txt}</span>`;

const errBox = (m) =>
  m ? `<div class="${ERR}" role="alert">
         ${icon("triangle-alert", { size: 15, cls: "shrink-0 mt-px" })}
         <span>${esc(m)}</span>
       </div>` : "";

const inv = (k) => (F.fe && F.fe[k] ? 'aria-invalid="true"' : "");

/* =====================================================================
   STATUS BADGE
   ===================================================================== */
function status(e) {
  if (S.joined[e.id])
    return badge(`${icon("check", { size: 11 })} Joined`, "badge-joined bg-ok text-white");
  if (left(e) <= 0)
    return badge("Fully booked", "bg-amber-500/25 text-amber-200");
  const pct  = e.n > 0 ? left(e) / e.n : 1;
  const tone = pct < 0.2 ? "bg-red-500/20 text-red-200" : "bg-white/20 text-white";
  return badge(`${left(e)} seats left`, tone);
}

/* =====================================================================
   CARD
   ===================================================================== */
const card = (e) => `
<a href="#/event/${e.id}" aria-label="View ${esc(e.t)}" class="event-card">

  ${e.online
    ? `<span class="event-card__badge event-card__badge--online">${icon("video", { size: 10 })} Online</span>`
    : e.w
      ? `<span class="event-card__badge">${icon("sparkles", { size: 10 })} Featured</span>`
      : ""}

  <div class="event-card__content">

    <div class="event-card__image" style="background:${e.g}">
      ${thumb(e)}
      <span class="event-card__image-label">
        ${icon(CAT_ICON[e.c] || "calendar", { size: 10 })}
        ${esc(e.c)}
      </span>
    </div>

    <div class="event-card__text">
      <h3 class="event-card__title">${esc(e.t)}</h3>
      <p class="event-card__subtitle">by ${esc(e.o)}</p>
      <p class="event-card__description">${esc(e.s)}</p>
    </div>

    <div class="event-card__meta">
      <div class="event-card__meta-item">
        <span class="event-card__meta-label">Date</span>
        <span class="event-card__meta-value">${e.day}, ${e.md}</span>
      </div>
      <div class="event-card__meta-item">
        <span class="event-card__meta-label">Location</span>
        <span class="event-card__meta-value">${esc(e.loc)}</span>
      </div>
    </div>

    <div class="event-card__footer">
      <div class="event-card__price">${status(e)}</div>
      <span class="event-card__button" aria-hidden="true">
        ${icon("arrow-right", { size: 14 })}
      </span>
    </div>
  </div>
</a>`;

/* =====================================================================
   FILTER
   ===================================================================== */
function filtered() {
  const k = q.trim().toLowerCase();
  return EV.filter(
    (e) =>
      (cat === "All" || (cat === "This week" ? e.w : e.c === cat)) &&
      (!k || (e.t + e.o + e.c + e.loc).toLowerCase().includes(k)),
  );
}

function gridHTML() {
  const list = filtered();
  if (list.length)
    return `<div class="${GRID} reveal-stagger">${list.map(card).join("")}</div>`;
  return `
<div class="${EMPTY}">
  <div class="mb-4 flex justify-center text-g/30">
    ${icon("search-x", { size: 40 })}
  </div>
  <h3 class="mb-1.5 text-xl font-bold tracking-tight text-g">No events found</h3>
  <p class="mb-5 text-mut">Nothing matches <em>"${esc(cat)}"</em>${q ? ` and <em>"${esc(q)}"</em>` : ""}.</p>
  <button class="${btn()}" data-act="clear">Show all events</button>
</div>`;
}

/* =====================================================================
   VIEWS
   ===================================================================== */

function home() {
  const firstName  = S.user ? S.user.name.split(" ")[0] : null;
  const joinedCount = Object.keys(S.joined).length;

  return `
<section class="hero-section relative flex min-h-[70vh] w-full items-center overflow-hidden sm:min-h-[80vh] lg:min-h-[88vh] lg:max-h-[820px] mb-5">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-overlay" aria-hidden="true"></div>

  <div class="relative z-10 mx-auto w-full max-w-[1080px] px-4 py-16 sm:px-6 sm:py-20 -translate-y-[8vh] sm:-translate-y-5">

    <h1 class="max-w-[14ch] text-[clamp(60px,10vw,88px)] font-extrabold leading-[1.0] tracking-[-0.05em] text-white reveal"
      style="animation-delay:50ms">
      What's happening<br/><em class="font-display font-normal italic tracking-[-0.02em]">on <span class="hero-highlight">campus</span></em>
    </h1>
    <p class="mt-5 mb-8 max-w-[48ch] text-[15.5px] leading-relaxed text-white/85 reveal"
       style="animation-delay:100ms">
      ${firstName
        ? `Welcome back, <strong class="font-semibold text-white">${esc(firstName)}</strong>. `
        : ""}Discover events, activities, and opportunities waiting for you.
    </p>

    <div class="flex flex-wrap gap-3 reveal" style="animation-delay:150ms">
      ${S.user
        ? `<a class="${btn("ow")}" href="#/my-events">
            My Events${joinedCount ? ` (${joinedCount})` : ""}
          </a>`
        : `<a class="${btn("ow")}" href="#/profile">
            ${icon("log-in", { size: 15 })} Log in
          </a>`}
      <a class="${btn("p")}" href="#/events">
        Browse all events ${icon("arrow-right", { size: 15 })}
      </a>
    </div>
  </div>
</section>

<div class="${WRAP}">
  <h2 class="${H1S} reveal">Featured this week</h2>
  <p class="${SUB} reveal" style="animation-delay:40ms">
    Highlights from the upcoming week.
  </p>

  <div class="${GRID} reveal-stagger">
    ${EV.filter(e => e.w).map(card).join("")}
  </div>

  <div class="mt-8 flex justify-end reveal">
    <a class="${btn("o")}" href="#/events">
      View all events ${icon("arrow-right", { size: 15 })}
    </a>
  </div>
</div>`;
}

function events() {
  return `
<div class="${WRAP}">
  <h1 class="${H1} reveal">Events</h1>
  <p class="${SUB} reveal" style="animation-delay:40ms">
    Filter by category or search, then open an event to register.
  </p>

  <div class="reveal flex flex-wrap items-center gap-2" style="animation-delay:80ms"
       role="group" aria-label="Category filters">

    ${CATS.map((c) => `
      <button class="${pill(c === cat)}"
              data-act="cat" data-v="${esc(c)}"
              aria-pressed="${c === cat}">
        ${c}
      </button>`).join("")}

    <div class="search-input-wrap ml-auto max-sm:ml-0 max-sm:w-full">
      <span class="search-icon">${icon("search", { size: 14 })}</span>
      <input id="q" type="search" placeholder="Search events…" aria-label="Search events"
             value="${esc(q)}"
             class="min-w-[210px] rounded-full border border-g/25 bg-white py-2 text-[13px] shadow-sm transition focus:border-g focus:shadow-[0_0_0_3px_rgba(10,74,43,.10)] max-sm:w-full" />
    </div>
  </div>

  <div id="grid">${gridHTML()}</div>
</div>`;
}

function detail(e) {
  const joined   = S.joined[e.id];
  const saved    = S.saved.includes(e.id);
  const seats    = left(e);
  const fromMine = prev.startsWith("/my");

  const mainAction = joined
    ? `<a class="${btn("ok")}" href="#/confirmed/${e.id}">${icon("check", { size: 15 })} View Ticket</a>`
    : seats <= 0
      ? `<button class="${btn()}" disabled>Fully Booked</button>`
      : S.user
        ? `<button class="${btn()}" data-act="join-direct" data-v="${e.id}">Join Event ${icon("arrow-right", { size: 15 })}</button>`
        : `<a class="${btn()}" href="#/join/${e.id}">Join Event ${icon("arrow-right", { size: 15 })}</a>`;

  const note = (!joined && seats <= 0)
    ? `<span class="text-err font-semibold">No seats remaining.</span>`
    : "";

  const infoRow = (iconName, label, val) => `
<div class="detail-info-row">
  <span class="row-icon">${icon(iconName, { size: 15 })}</span>
  <div class="min-w-0">
    <span class="block text-[10.5px] font-bold uppercase tracking-[.08em] text-mut">${label}</span>
    <span class="mt-0.5 block font-medium text-neutral-800">${val}</span>
  </div>
</div>`;

  const filledPct  = e.n > 0 ? Math.round(((e.n - seats) / e.n) * 100) : 100;
  const barColor   = joined ? "bg-ok" : seats <= 0 ? "bg-red-400" : filledPct > 75 ? "bg-amber-400" : "bg-g";
  const capacityLbl = joined ? "You're going!" : seats <= 0 ? "Fully booked" : `${seats} / ${e.n} seats left`;

  return `
<div class="${WRAP_DETAIL}">
  <a class="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-g/60 hover:text-g transition-colors lg:mb-5"
     href="${fromMine ? "#/my-events" : "#/events"}">
    ${icon("arrow-left", { size: 14 })}
    Back to ${fromMine ? "My Events" : "Events"}
  </a>

  <div class="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">

    <div class="reveal flex h-full flex-col" style="animation-delay:40ms">
      <div class="card-thumb relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-card
                  lg:aspect-auto lg:flex-1 lg:min-h-[260px]"
           style="background:${e.g}">
        ${thumb(e)}
      </div>

      <div class="mt-4 shrink-0 rounded-2xl border border-g/10 bg-white p-4 shadow-sm sm:mt-5 sm:p-5">
        <div class="mb-2.5 flex items-baseline justify-between gap-3 sm:mb-3">
          <span class="text-[11px] font-bold uppercase tracking-[.08em] text-g/55">Capacity</span>
          <span class="text-[13px] font-semibold text-g">${capacityLbl}</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-g/10">
          <div class="h-full rounded-full transition-[width] duration-700 ease-out ${barColor}"
               style="width:${filledPct}%"></div>
        </div>
      </div>
    </div>

    <div class="reveal" style="animation-delay:80ms">
      <div class="mb-2.5 flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-g-l px-3 py-1 text-[11px] font-bold uppercase tracking-[.08em] text-g">
          ${icon(CAT_ICON[e.c] || "calendar", { size: 11 })}
          ${esc(e.c)}
        </span>
        ${e.online ? `<span class="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[.08em] text-sky-700">
          ${icon("video", { size: 11 })} Online event
        </span>` : ""}
      </div>

      <h1 class="${H1}">${esc(e.t)}</h1>

      <p class="mb-5 max-w-[60ch] text-[15px] leading-[1.65] text-neutral-600 sm:text-[15.5px]">${esc(e.d)}</p>

      <div class="mb-5 overflow-hidden rounded-2xl border border-g/10 bg-white shadow-sm">
        ${infoRow("calendar",   "Date",         e.full)}
        ${infoRow("clock",      "Time",         e.time)}
        ${infoRow("map-pin",    "Location",     esc(e.loc))}
        ${e.online && e.link
          ? infoRow("video", "Meeting link",
              `<a href="${esc(e.link)}" target="_blank" rel="noopener"
                  class="font-semibold text-g underline underline-offset-2 break-all">${esc(e.link)}</a>`)
          : ""}
        ${infoRow("building-2", "Organized by", esc(e.o))}
      </div>

      <div class="flex flex-wrap justify-end gap-3 btn-pair">
        <button class="${btn("o")}" data-act="save" data-v="${e.id}" aria-pressed="${saved}">
          ${saved ? `${icon("bookmark-check", { size: 15 })} Saved` : `${icon("bookmark", { size: 15 })} Save`}
        </button>
        ${mainAction}
      </div>
      ${note ? `<p class="mt-2.5 min-h-5 text-right text-[13px]">${note}</p>` : ""}
    </div>
  </div>
</div>`;
}

function join(e) {
  return `
<div class="mx-auto max-w-[1080px] px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
  <a class="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-g/60 hover:text-g transition-colors"
     href="#/event/${e.id}">
    ${icon("arrow-left", { size: 14 })} Back to event
  </a>

  <form class="${FORM}" data-form="join" novalidate>
    <h1 class="${FORM_H1}">Create account</h1>
    <p class="mt-1.5 mb-5 text-center text-[13.5px] text-mut">
      Register to join <strong class="font-semibold text-g">${esc(e.t)}</strong>.
    </p>

    <div class="${SUM}">
      ${e.full} &middot; ${e.time}<br/>
      <span class="inline-flex items-center gap-1 font-medium">
        ${icon(e.online ? "video" : "map-pin", { size: 12 })} ${esc(e.loc)}
      </span>
    </div>

    <label class="${LBL}" for="email">Institutional email *</label>
    <input class="${INPUT}" type="text" id="email" data-f="email" ${inv("email")}
           value="${esc(F.email ?? "")}" placeholder="yourname_program@plmun.edu.ph" autocomplete="email" />

    <label class="${LBL}" for="fn">Full name *</label>
    <input class="${INPUT}" type="text" id="fn" data-f="fn" ${inv("fn")}
           value="${esc(F.fn ?? "")}" placeholder="e.g. Zanjoe Langa" />

    <label class="${LBL}" for="pw">Password</label>
    <input class="${INPUT}" type="password" id="pw" data-f="pw" ${inv("pw")}
           value="${esc(F.pw ?? "")}" placeholder="Minimum 8 characters" />

    <label class="${LBL}" for="pw2">Confirm password</label>
    <input class="${INPUT}" type="password" id="pw2" data-f="pw2" ${inv("pw2")}
           value="${esc(F.pw2 ?? "")}" placeholder="Must match password" />

    <label class="mt-4 flex cursor-pointer items-start gap-2.5 text-[12.5px] text-neutral-600">
      <input type="checkbox" data-f="terms"${F.terms ? " checked" : ""}
             class="mt-0.5 h-4 w-4 accent-g rounded" />
      <span>I agree to the Terms and Conditions and Privacy Policy</span>
    </label>

    ${errBox(F.err)}

    <div class="${ROW} ${EQ}">
      <a class="${btn("o")}" href="#/event/${e.id}">Cancel</a>
      <button class="${btn()}" type="submit">
        Register & join ${icon("arrow-right", { size: 15 })}
      </button>
    </div>
  </form>
</div>`;
}

function qr(seed) {
  let h = 1;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const N = 21;
  let r = h, out = "";
  const finder = (x, y) =>
    x === 0 || y === 0 || x === 6 || y === 6 ||
    (x >= 2 && x <= 4 && y >= 2 && y <= 4);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      let on;
      if      (x < 7    && y < 7   ) on = finder(x, y);
      else if (x >= N-7 && y < 7   ) on = finder(x - N + 7, y);
      else if (x < 7    && y >= N-7) on = finder(x, y - N + 7);
      else { r = (r * 1103515245 + 12345) >>> 0; on = (r >> 16) & 1; }
      if (on) out += `<rect x="${x}" y="${y}" width="1" height="1" fill="#0a4a2b"/>`;
    }
  return `<svg class="qr-svg" viewBox="0 0 21 21" role="img" aria-label="Event QR code (mock)" shape-rendering="crispEdges">${out}</svg>`;
}

function confirmView(e) {
  const j = S.joined[e.id];

  const row = (label, val) => `
<div class="flex flex-wrap items-baseline justify-center gap-x-1.5 py-0.5 text-[12px]
            sm:grid sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-x-2.5 sm:text-[13.5px]">
  <span class="text-[9.5px] font-bold uppercase tracking-[.08em] opacity-55 sm:text-[10.5px]">${label}</span>
  <span class="min-w-0 font-medium">${val}</span>
</div>`;

  return `
<div class="relative min-h-[calc(100dvh-52px)] flex items-start justify-center pt-6 pb-4 sm:py-8 overflow-hidden"
     style="background:linear-gradient(160deg,#041a0e 0%,#063018 50%,#083f22 100%)">

  <canvas id="confirm-particles" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"></canvas>

  <div class="relative z-10 mx-auto w-full max-w-[340px] px-5 sm:max-w-[720px] sm:px-6">

    <div class="mb-3 text-center text-white sm:mb-5">
      <div class="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-ok
                  shadow-[0_0_0_6px_rgba(31,174,58,.22)] reveal sm:mb-3 sm:h-12 sm:w-12 sm:shadow-[0_0_0_5px_rgba(31,174,58,.22)]">
        ${icon("check", { size: 26, cls: "sm:!w-[22px] sm:!h-[22px]" })}
      </div>
      <h1 class="text-[clamp(22px,4.4vw,32px)] font-extrabold tracking-[-0.04em] leading-[1.1] text-white reveal"
          style="animation-delay:50ms">
        You're in, ${esc(j.name.split(" ")[0])}!
      </h1>
      <p class="mt-1 text-[12.5px] text-white/75 reveal sm:mt-1.5 sm:text-[13.5px]" style="animation-delay:100ms">
        Registered for <strong class="font-semibold text-white">${esc(e.t)}</strong>
      </p>
    </div>

    <div class="ticket-card reveal mb-3 rounded-2xl border border-white/15 bg-white/08 p-4 text-white
                backdrop-blur-xl backdrop-saturate-150 sm:mb-4 sm:p-6"
         style="animation-delay:150ms">

      <div class="flex flex-col items-center gap-3 sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-6">

        <div class="flex items-center justify-center">
          ${qr(e.t + j.sid)}
        </div>

        <div class="flex min-w-0 flex-col text-center sm:text-left">
          <h2 class="mb-2 text-[18px] font-extrabold leading-[1.15] tracking-[-0.03em] text-white sm:mb-3 sm:text-[24px]">
            ${esc(e.t)}
          </h2>
          <div>
            ${row("Name",     `${esc(j.name)}${j.year ? ` &middot; ${esc(j.year)}` : ""}`)}
            ${row("Date",     e.full)}
            ${row("Time",     e.time)}
            ${row("Location", esc(e.loc))}
            ${e.online && e.link
              ? row("Meeting", `<a href="${esc(e.link)}" target="_blank" rel="noopener"
                                  class="text-white underline underline-offset-2 break-all">${esc(e.link)}</a>`)
              : ""}
            ${row("Organizer", esc(e.o))}
          </div>
        </div>
      </div>

      <div class="mt-3 flex items-center justify-center gap-2 rounded-xl border border-ok/30 bg-ok/15
                  px-3 py-2 text-[12px] font-semibold sm:mt-5 sm:justify-start sm:px-4 sm:py-2.5 sm:text-[13px]">
        ${icon("check-circle", { size: 14, cls: "text-ok shrink-0" })}
        Registration confirmed &mdash; Status: Going
      </div>
    </div>

    <div class="reveal flex flex-col items-stretch gap-2.5
                sm:flex-row sm:items-center sm:justify-between sm:gap-3"
         style="animation-delay:200ms">
      <label class="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border
                    border-white/15 bg-white/06 px-3.5 py-2.5 text-[12.5px] text-white
                    hover:bg-white/12 transition-all whitespace-nowrap backdrop-blur-md
                    sm:w-auto sm:justify-start sm:px-4 sm:py-2.5 sm:text-[13.5px]">
        <input type="checkbox" data-act="remind" data-v="${e.id}"${j.rem ? " checked" : ""}
               class="h-4 w-4 accent-ok rounded" />
        <span class="flex items-center gap-1.5">
          ${icon("bell", { size: 13 })} Remind me
        </span>
      </label>

      <div class="flex w-full gap-2 sm:w-auto btn-pair">
        <a class="${btn("ow")} flex-1 sm:flex-initial" href="#/">Home</a>
        <a class="${btn("p")}  flex-1 sm:flex-initial" href="#/my-events">My Events</a>
      </div>
    </div>

  </div>
</div>`;
}

function mine() {
  const jl   = EV.filter((e) => S.joined[e.id]);
  const sl   = EV.filter((e) => S.saved.includes(e.id));
  const list = tab === "joined" ? jl : sl;

    const row = (e) => {
    const j = S.joined[e.id], asking = askCancel === e.id;
    const inSavedTab = tab === "saved";

    const b1 = (j && asking && !inSavedTab)
      ? `<button class="${btn("ow")} me-btn" data-act="cancelno">Keep it</button>`
      : `<a class="${btn("p")} me-btn" href="#/event/${e.id}">View details</a>`;

    let b2;
    if (inSavedTab) {
      b2 = `<button class="${btn("ow")} me-btn" data-act="save" data-v="${e.id}">Remove</button>`;
    } else if (j && asking) {
      b2 = `<button class="${btn("x")} me-btn" data-act="cancelyes" data-v="${e.id}">Yes, cancel</button>`;
    } else if (j) {
      b2 = `<button class="${btn("ow")} me-btn" data-act="cancelask" data-v="${e.id}">Cancel</button>`;
    } else {
      b2 = `<button class="${btn("ow")} me-btn" data-act="save" data-v="${e.id}">Remove</button>`;
    }

    return `
<div class="event-card me-row">

  <div class="me-row__thumb" style="background:${e.g}">
    ${thumb(e)}
  </div>

  <div class="me-row__body">
    <h3 class="me-title">${esc(e.t)}</h3>

    <div class="me-meta">
      <div class="me-meta-item">
        <span class="me-meta-value">${icon("calendar", { size: 11 })} ${e.full}</span>
      </div>
      <div class="me-meta-item">
        <span class="me-meta-value">${icon("clock", { size: 11 })} ${e.time}</span>
      </div>
      <div class="me-meta-item">
        <span class="me-meta-value">${icon(e.online ? "video" : "map-pin", { size: 11 })} ${esc(e.loc)} &middot; ${e.c}</span>
      </div>

      <div class="me-status-cell">
        ${j ? badge(`${icon("check", { size: 10 })} Going`, "badge-joined bg-ok text-white")
            : status(e)}
      </div>
    </div>
  </div>

  <div class="me-actions">
    ${b1}
    ${b2}
  </div>
</div>`;
  };

  const emptyState = tab === "joined"
    ? { ico: "calendar-x2",  title: "No joined events yet", body: "Find something happening on campus and register." }
    : { ico: "bookmark",     title: "No saved events",      body: "Save events from their detail page to find them here." };

  return `
<div class="${WRAP}">
  <h1 class="${H1} reveal">My Events</h1>
  <p class="${SUB} reveal" style="animation-delay:40ms">Events you've joined or saved.</p>

  <div class="flex flex-wrap gap-2 reveal" style="animation-delay:80ms">
    <button class="${pill(tab === "joined")}" data-act="tab" data-v="joined">
      Joined
      <span class="ml-1.5 rounded-full bg-white/20 px-1.5 py-px text-[10.5px] font-bold">${jl.length}</span>
    </button>
    <button class="${pill(tab === "saved")}" data-act="tab" data-v="saved">
      Saved
      <span class="ml-1.5 rounded-full bg-white/20 px-1.5 py-px text-[10.5px] font-bold">${sl.length}</span>
    </button>
  </div>

  <div class="mt-6 reveal-stagger flex flex-col gap-4">
    ${list.length
      ? list.map(row).join("")
      : `<div class="${EMPTY}">
           <div class="mb-4 flex justify-center text-g/25">
             ${icon(emptyState.ico, { size: 40 })}
           </div>
           <h3 class="mb-1.5 text-xl font-bold tracking-tight text-g">${emptyState.title}</h3>
           <p class="mb-5 text-mut">${emptyState.body}</p>
           <a class="${btn()}" href="#/events">Explore Events</a>
         </div>`}
  </div>

  <div class="mt-8 flex flex-wrap gap-3 reveal justify-end btn-pair">
    <a class="${btn("o")}" href="#/">Home</a>
    <a class="${btn("o")} btn-events" href="#/events">
      ${icon("arrow-left", { size: 15 })} Events
    </a>
  </div>
</div>`;
}

function profile() {
  if (S.user)
    return `
<div class="${WRAP}">
  <div class="${FORM}">
    <div class="mb-5 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-g
                text-[22px] font-bold text-white shadow-card">
      ${esc(S.user.name.charAt(0).toUpperCase())}
    </div>
    <h1 class="${FORM_H1}">Profile</h1>
    <div class="mt-4 text-center">
      <p class="text-[15px] font-semibold tracking-tight text-neutral-800">${esc(S.user.name)}</p>
      <p class="mt-0.5 text-[13px] text-mut">${esc(S.user.email)}</p>
    </div>
    <div class="mt-5 flex justify-center gap-8 border-t border-g/08 pt-5">
      <div class="text-center">
        <p class="text-[24px] font-bold tracking-[-0.03em] text-g">${Object.keys(S.joined).length}</p>
        <p class="text-[11.5px] font-semibold uppercase tracking-wide text-mut">Joined</p>
      </div>
      <div class="w-px bg-g/10"></div>
      <div class="text-center">
        <p class="text-[24px] font-bold tracking-[-0.03em] text-g">${S.saved.length}</p>
        <p class="text-[11.5px] font-semibold uppercase tracking-wide text-mut">Saved</p>
      </div>
    </div>
    <div class="${ROW} ${EQ}">
      <a class="${btn("o")}" href="#/my-events">My Events</a>
      <button class="${btn()}" data-act="logout">Log out</button>
    </div>
  </div>
</div>`;

  const reg = F.mode2 === "reg";
  return `
<div class="mx-auto max-w-[1080px] px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
  <form class="${FORM}" data-form="${reg ? "reg" : "login"}" novalidate>
    <h1 class="${FORM_H1}">${reg ? "Create account" : "Sign in"}</h1>
    <p class="mt-1.5 mb-5 text-center text-[13.5px] text-mut">
      ${reg ? "Register with your institutional email." : "Log in to join events and manage your schedule."}
    </p>

    <div class="flex gap-2 mb-5">
      <button type="button" class="${pill(!reg)} flex-1 justify-center text-center py-2"
              data-act="auth" data-v="login">Sign in</button>
      <button type="button" class="${pill(reg)} flex-1 justify-center text-center py-2"
              data-act="auth" data-v="reg">Register</button>
    </div>

    <label class="${LBL}" for="email">Institutional email${reg ? " *" : ""}</label>
    <input class="${INPUT}" type="text" id="email" data-f="email" ${inv("email")}
           value="${esc(F.email ?? "")}" placeholder="yourname_program@plmun.edu.ph" autocomplete="email" />

    ${reg ? `
    <label class="${LBL}" for="fn">Full name *</label>
    <input class="${INPUT}" type="text" id="fn" data-f="fn" ${inv("fn")}
           value="${esc(F.fn ?? "")}" placeholder="e.g. Zanjoe Langa" />` : ""}

    <label class="${LBL}" for="pw">Password</label>
    <input class="${INPUT}" type="password" id="pw" data-f="pw" ${inv("pw")}
           value="${esc(F.pw ?? "")}"
           placeholder="${reg ? "Minimum 8 characters" : "Enter your password"}" />

    ${reg ? `
    <label class="${LBL}" for="pw2">Confirm password</label>
    <input class="${INPUT}" type="password" id="pw2" data-f="pw2" ${inv("pw2")}
           value="${esc(F.pw2 ?? "")}" placeholder="Must match password" />
    <label class="mt-4 flex cursor-pointer items-start gap-2.5 text-[12.5px] text-neutral-600">
      <input type="checkbox" data-f="terms"${F.terms ? " checked" : ""}
             class="mt-0.5 h-4 w-4 accent-g rounded" />
      <span>I agree to the Terms and Conditions and Privacy Policy</span>
    </label>` : ""}

    ${errBox(F.err)}

    <div class="${ROW} ${EQ}">
      <a class="${btn("o")}" href="#/">Cancel</a>
      <button class="${btn()}" type="submit">
        ${reg ? "Create account" : "Sign in"}
        ${icon("arrow-right", { size: 15 })}
      </button>
    </div>
  </form>
</div>`;
}

/* =====================================================================
   RENDER + ROUTER
   ===================================================================== */
const NAV_ON  = "bg-white/15 font-semibold opacity-100";
const NAV_OFF = "opacity-65 hover:opacity-100 hover:bg-white/10";

const NAV_ICONS = { home: "home", events: "calendar-days", mine: "ticket", profile: "user" };

function render() {
  const c = cur, e = ev(c.id);

  if (["event", "join", "confirm"].includes(c.v) && !e) return go("#/events");
  if (c.v === "confirm" && !S.joined[e?.id])            return go("#/event/" + c.id);

  const views = {
    home:    () => home(),
    events:  () => events(),
    event:   () => detail(e),
    join:    () => join(e),
    confirm: () => confirmView(e),
    mine:    () => mine(),
    profile: () => profile(),
  };

  const app = $("#app");
  const doAnimate = shouldAnimate;
  shouldAnimate = false;

  // Hide the footer on the confirmation page so its gradient fills the viewport
  document.body.classList.toggle("confirm-view", c.v === "confirm");

  app.classList.toggle("reveal-instant", !doAnimate);
  if (doAnimate) animateView();

  app.innerHTML = (views[c.v] || views.home)();

  requestAnimationFrame(() => {
    renderIcons();
    if (doAnimate) initReveal();

    // Particles live only on the confirmation page
    stopConfirmationParticles();
    if (c.v === "confirm") particleCleanup = startConfirmationParticles();
  });

  const active =
    c.v === "mine"    ? "mine"    :
    c.v === "profile" ? "profile" :
    ["events", "event", "join", "confirm"].includes(c.v) ? "events" : "home";

  const joinedCount = Object.keys(S.joined).length;
  const navLinks = [
    ["home",    "#/",          "Home"],
    ["events",  "#/events",    "Events"],
    ["mine",    "#/my-events",
      `My Events${joinedCount
        ? `<span class="ml-1.5 rounded-full bg-white/25 px-1.5 py-px text-[10px] font-bold">${joinedCount}</span>`
        : ""}`],
    ["profile", "#/profile",   S.user ? S.user.name.split(" ")[0] : "Profile"],
  ];

  $("#nav").innerHTML = navLinks.map(([k, url, label]) =>
    `<a href="${url}"
        class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-all ${k === active ? NAV_ON : NAV_OFF}"
        ${k === active ? 'aria-current="page"' : ""}>
       ${icon(NAV_ICONS[k], { size: 13 })}
       <span>${label}</span>
     </a>`
  ).join("");

  const mn = document.getElementById("nav-mobile");
  if (mn) {
    mn.innerHTML = navLinks.map(([k, url, label]) =>
      `<a href="${url}" ${k === active ? 'aria-current="page"' : ""}>
         ${icon(NAV_ICONS[k], { size: 15 })}
         <span>${label}</span>
       </a>`
    ).join("");
  }

  renderIcons();
  updateThemeIcon();
}

function route() {
  const p    = (location.hash.slice(1) || "/").split("/");
  const path = "/" + (p[1] || "");

  const views = {
    "":          "home",
    events:      "events",
    event:       "event",
    join:        "join",
    confirmed:   "confirm",
    "my-events": "mine",
    profile:     "profile",
  };

  cur = { v: views[p[1] || ""] || "home", id: p[2] };

  if (cur.v === "join") {
    const evt = ev(cur.id);
    if (evt && S.joined[evt.id]) return go("#/confirmed/" + evt.id);
    if (evt && S.user) {
      if (left(evt) > 0) {
        S.joined[evt.id] = {
          name: S.user.name,
          sid:  S.user.email,
          year: "",
          rem:  false,
        };
        save();
        toast("Registration confirmed!", "check-circle");
      }
      return go("#/confirmed/" + evt.id);
    }
  }

  if (path + cur.id !== key) {
    F = {};
    askCancel = null;
  }
  prev = key.replace(/undefined$/, "");
  key  = path + cur.id;

  closeMobileNav();
  shouldAnimate = true;
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", route);

/* =====================================================================
   INTERACTIONS
   ===================================================================== */
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.id === "q") {
    q = t.value;
    $("#grid").innerHTML = gridHTML();
    requestAnimationFrame(() => {
      renderIcons();
      if (shouldAnimate) initReveal();
    });
    return;
  }
  if (t.dataset.f) {
    F[t.dataset.f] = t.type === "checkbox" ? t.checked : t.value;
    if (t.value) t.closest("[aria-invalid]")?.removeAttribute("aria-invalid");
  }
});

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const a = b.dataset.act, v = b.dataset.v;

  if      (a === "cat")   { cat = v; render(); }
  else if (a === "clear") { cat = "All"; q = ""; render(); }
  else if (a === "save") {
    const i = S.saved.indexOf(+v);
    if (i < 0) { S.saved.push(+v); toast("Saved to My Events", "bookmark-check"); }
    else        { S.saved.splice(i, 1); toast("Removed from saved", "bookmark-x"); }
    save(); render();
  }
  else if (a === "tab")       { tab = v; askCancel = null; render(); }
  else if (a === "cancelask") { askCancel = +v; render(); }
  else if (a === "cancelno")  { askCancel = null; render(); }
  else if (a === "cancelyes") {
    delete S.joined[v]; askCancel = null; save(); render();
    toast("Registration cancelled", "x");
  }
  else if (a === "remind") {
    S.joined[v].rem = b.checked; save();
    toast(b.checked ? "Reminder set" : "Reminder removed", "bell");
  }
  else if (a === "join-direct") {
    const evt = ev(+v);
    if (!evt || !S.user) return;
    if (S.joined[evt.id]) { go("#/confirmed/" + evt.id); return; }
    if (left(evt) <= 0)   { toast("Sorry, this event just filled up.", "triangle-alert"); return; }
    S.joined[evt.id] = {
      name: S.user.name,
      sid:  S.user.email,
      year: "",
      rem:  false,
    };
    save();
    toast("Registration confirmed!", "check-circle");
    go("#/confirmed/" + evt.id);
  }
  else if (a === "logout") {
    if (S.user) S.accounts[S.user.email] = { joined: S.joined, saved: S.saved };
    S.user   = null;
    S.joined = {};
    S.saved  = [];
    save();
    F = {};
    render();
    toast("Logged out", "log-out");
  }
  else if (a === "auth") { F = { mode2: v }; render(); }
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
  const formType = e.target.dataset.form, fe = {};
  F.fe = fe;
  const isMail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || "");

  if (formType === "join") {
    const evt = ev(cur.id);

    if (S.joined[evt.id]) { go("#/confirmed/" + evt.id); return; }

    if (S.user) {
      if (left(evt) <= 0) { F.err = "Sorry, this event just filled up."; render(); return; }
      S.joined[evt.id] = { name: S.user.name, sid: S.user.email, year: "", rem: false };
      save();
      toast("Registration confirmed!", "check-circle");
      go("#/confirmed/" + evt.id);
      return;
    }

    ["email", "fn", "pw", "pw2"].forEach((x) => { if (!(F[x] || "").trim()) fe[x] = 1; });

    if (Object.keys(fe).length || !F.terms) {
      F.err = Object.keys(fe).length ? "Please complete all required fields."
                                     : "Please agree to the Terms and Conditions.";
    } else if (!isMail(F.email.trim())) { fe.email = 1; F.err = "Please enter a valid email address."; }
    else if (F.pw.length < 8)            { fe.pw = 1; F.err = "Password must be at least 8 characters."; }
    else if (F.pw !== F.pw2)             { fe.pw2 = 1; F.err = "Passwords do not match."; }
    else if (left(evt) <= 0)             { F.err = "Sorry, this event just filled up."; }
    else {
      const email = F.email.trim();
      const name  = F.fn.trim();
      S.acct[email] = name;
      adoptAccount(email, name);
      S.joined[evt.id] = { name, sid: email, year: "", rem: false };
      save();
      toast("Welcome! You're registered.", "check-circle");
      go("#/confirmed/" + evt.id);
      return;
    }
    render(); return;
  }

  if (formType === "login") {
    if (!(F.email || "").trim() || !F.pw) {
      F.err = "Please enter your email and password.";
      if (!F.email) fe.email = 1;
      if (!F.pw)    fe.pw    = 1;
    } else if (!isMail(F.email.trim())) {
      fe.email = 1; F.err = "Please enter a valid email address.";
    } else {
      const email = F.email.trim();
      const name  = S.acct[email] ||
        email.split("@")[0].replace(/[._]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      adoptAccount(email, name);
      save();
      toast("Welcome back, " + name.split(" ")[0] + "!", "check");
      go("#/"); return;
    }
    render(); return;
  }

  if (formType === "reg") {
    ["email", "fn", "pw", "pw2"].forEach((x) => { if (!(F[x] || "").trim()) fe[x] = 1; });

    if (Object.keys(fe).length || !F.terms) {
      F.err = Object.keys(fe).length ? "Please complete all required fields."
                                     : "Please agree to the Terms and Conditions.";
    } else if (!isMail(F.email.trim())) { fe.email = 1; F.err = "Please enter a valid email address."; }
    else if (F.pw.length < 8)            { fe.pw = 1; F.err = "Password must be at least 8 characters."; }
    else if (F.pw !== F.pw2)             { fe.pw2 = 1; F.err = "Passwords do not match."; }
    else {
      const email = F.email.trim();
      const name  = F.fn.trim();
      S.acct[email] = name;
      adoptAccount(email, name);
      save();
      toast("Account created — welcome, " + name.split(" ")[0] + "!", "check");
      go("#/"); return;
    }
    render();
  }
});

/* =====================================================================
   NAV — auto-hide on scroll down, reveal on scroll up
   ===================================================================== */
(function initAutoHideNav() {
  const header = document.querySelector("header");
  if (!header) return;

  let lastY   = window.scrollY;
  let hidden  = false;
  const THRESHOLD = 6;
  const TOP_ZONE  = 40;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    if (y <= TOP_ZONE) {
      if (hidden) { header.classList.remove("nav-hidden"); hidden = false; }
      lastY = y;
      return;
    }

    if (Math.abs(y - lastY) < THRESHOLD) return;

    if (y > lastY && !hidden) {
      const mn = document.getElementById("nav-mobile");
      if (mn && !mn.classList.contains("hidden")) { lastY = y; return; }
      header.classList.add("nav-hidden");
      hidden = true;
    } else if (y < lastY && hidden) {
      header.classList.remove("nav-hidden");
      hidden = false;
    }
    lastY = y;
  }, { passive: true });
})();

/* =====================================================================
   BOOT
   ===================================================================== */
document.getElementById("nav-toggle")?.addEventListener("click", toggleMobileNav);
document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);

initTheme();
initBackgrounds();
route();