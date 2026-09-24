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
    /* Migration from old single-user format */
    if (S.user && !S.accounts[S.user.email]) {
      S.accounts[S.user.email] = { joined: S.joined || {}, saved: S.saved || [] };
    }
  }
} catch (_) {}

const save = () => {
  /* Keep the account bucket in sync with the live session */
  if (S.user) S.accounts[S.user.email] = { joined: S.joined, saved: S.saved };
  try { localStorage.setItem("plmun", JSON.stringify(S)); } catch (_) {}
};

/* Adopt / create an account, merging current anonymous state in */
function adoptAccount(email, name) {
  const bucket = S.accounts[email] || { joined: {}, saved: [] };
  /* Merge current (anonymous or previous) session into the account */
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
  ? `<img src="${esc(e.img)}" alt="" loading="lazy" decoding="async"
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
   DESIGN TOKENS
   ===================================================================== */
const WRAP        = "mx-auto max-w-[1080px] px-4 pt-10 pb-16 sm:px-6 sm:pt-12";
const WRAP_DETAIL = "mx-auto max-w-[1080px] px-4 pt-6 pb-16 sm:px-6 sm:pt-8";

const GRID  = "mt-6 grid grid-cols-1 gap-4 mx-auto max-w-[400px] sm:max-w-none sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-5";

const H1  = "mb-3 text-[clamp(30px,5vw,52px)] font-extrabold leading-[1.03] tracking-[-0.045em] text-g";
const H1S = "mb-2 text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-g";
const SUB = "mb-6 max-w-[52ch] text-[15px] leading-relaxed text-mut";

const FORM    = "mx-auto max-w-[480px] rounded-2xl border border-g/12 bg-white p-8 shadow-form";
const FORM_H1 = "mb-1 text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.04em] text-g";
const SUM     = "mb-2 rounded-xl bg-g-l px-4 py-3 text-[13px] leading-relaxed text-g/80";
const LBL     = "mt-4 mb-1.5 block text-[11.5px] font-bold uppercase tracking-[.07em] text-g/60";
const INPUT   = "w-full rounded-xl border-[1.5px] border-g/25 bg-white px-4 py-2.5 text-[14.5px] placeholder:text-neutral-400 aria-[invalid=true]:border-err aria-[invalid=true]:bg-red-50 transition-all";
const ERR     = "mt-4 flex items-start gap-2.5 rounded-xl border-l-4 border-err bg-red-50 px-4 py-3 text-[13.5px] font-semibold text-err";
const ROW     = "mt-6 flex flex-wrap justify-center gap-3";
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
   Taller thumb, aligned meta grid, clamped summary, subtle hover accent.
   ===================================================================== */
const card = (e) => `
<a href="#/event/${e.id}" aria-label="View ${esc(e.t)}"
   class="event-card group flex h-full flex-col rounded-card bg-g text-white">

  <!-- Thumb -->
  <div class="card-thumb relative m-2 h-44 shrink-0 overflow-hidden rounded-[.75rem] sm:h-40"
       style="background:${e.g}">
    ${thumb(e)}

    <!-- subtle bottom scrim for depth -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-14
                bg-gradient-to-t from-black/35 via-black/10 to-transparent"></div>

    <!-- category (top-left) -->
    <span class="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full
                 bg-black/45 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide
                 text-white/95 backdrop-blur-md ring-1 ring-white/10">
      ${icon(CAT_ICON[e.c] || "calendar", { size: 10 })}
      ${esc(e.c)}
    </span>

    ${e.online ? `
    <span class="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full
                 bg-sky-500/90 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide
                 text-white backdrop-blur-md ring-1 ring-white/15">
      ${icon("video", { size: 10 })} Online
    </span>` : ""}
  </div>

  <!-- Body -->
  <div class="flex min-w-0 flex-1 flex-col px-4 pt-3 pb-4">

    <!-- Title + arrow -->
    <div class="flex items-start justify-between gap-2.5">
      <h3 class="flex-1 text-[16px] font-extrabold leading-[1.25] tracking-[-0.025em] line-clamp-2">${esc(e.t)}</h3>
      <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                   bg-white/[.07] transition-colors duration-200 group-hover:bg-white/[.16]">
        ${icon("arrow-up-right", { size: 13 })}
      </span>
    </div>

    <!-- Organizer -->
    <p class="mt-1 truncate text-[12px] font-medium opacity-55">${esc(e.o)}</p>

    <!-- Summary — always reserves 2 lines so footers align across cards -->
    <p class="mt-3 line-clamp-2 min-h-[39px] text-[12.5px] leading-[1.55] opacity-70">${esc(e.s)}</p>

    <!-- Meta group — pushed to bottom so all cards' footers align -->
    <div class="mt-auto pt-4">

      <!-- Grid keeps icon + text aligned across both rows -->
      <div class="grid grid-cols-[14px_minmax(0,1fr)] items-center gap-x-2.5 gap-y-2
                  text-[11.5px] font-medium opacity-70">
        <span class="flex justify-center">${icon("calendar", { size: 12 })}</span>
        <span class="truncate">${e.day}, ${e.md}</span>

        <span class="flex justify-center">${icon("map-pin", { size: 12 })}</span>
        <span class="truncate">${esc(e.loc)}</span>
      </div>

      <!-- Footer -->
      <div class="mt-3.5 flex items-center justify-between border-t border-white/10 pt-3.5">
        ${status(e)}
        <span class="flex items-center gap-1 text-[11.5px] font-semibold opacity-60
                     transition-opacity duration-200 group-hover:opacity-100">
          View ${icon("chevron-right", { size: 12 })}
        </span>
      </div>
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

/* ── HOME ──────────────────────────────────────────────────────────── */
function home() {
  const firstName  = S.user ? S.user.name.split(" ")[0] : null;
  const joinedCount = Object.keys(S.joined).length;

  return `
<section class="hero-section relative flex min-h-[70vh] w-full items-center overflow-hidden sm:min-h-[80vh] lg:min-h-[88vh] lg:max-h-[820px]">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-overlay" aria-hidden="true"></div>

  <div class="relative z-10 mx-auto w-full max-w-[1080px] px-4 py-16 sm:px-6 sm:py-20">

    <h1 class="max-w-[14ch] text-[clamp(60px,10vw,88px)] font-extrabold leading-[1.0] tracking-[-0.05em] text-white reveal"
        style="animation-delay:50ms">
      What's happening<br/><em class="font-display font-normal italic tracking-[-0.02em]">on campus</em>
    </h1>

    <p class="mt-5 mb-8 max-w-[48ch] text-[15.5px] leading-relaxed text-white/85 reveal"
       style="animation-delay:100ms">
      ${firstName
        ? `Welcome back, <strong class="font-semibold text-white">${esc(firstName)}</strong>. `
        : ""}Discover events, activities, and opportunities waiting for you.
    </p>

    <div class="flex flex-wrap gap-3 reveal" style="animation-delay:150ms">
      <a class="${btn("p")}" href="#/events">
        Browse all events ${icon("arrow-right", { size: 15 })}
      </a>
      ${S.user
        ? `<a class="${btn("ow")}" href="#/my-events">
             My Events${joinedCount ? ` (${joinedCount})` : ""}
           </a>`
        : `<a class="${btn("ow")}" href="#/profile">
             ${icon("log-in", { size: 15 })} Log in
           </a>`}
    </div>
  </div>
</section>

<div class="${WRAP}">
  <h2 class="${H1S} reveal">Featured this week</h2>
  <p class="${SUB} reveal" style="animation-delay:40ms">
    Highlights from the upcoming week — open any card to register.
  </p>

  <div class="${GRID} reveal-stagger">
    ${EV.filter(e => e.w).map(card).join("")}
  </div>

  <div class="mt-8 reveal">
    <a class="${btn("o")}" href="#/events">
      View all events ${icon("arrow-right", { size: 15 })}
    </a>
  </div>
</div>`;
}

/* ── EVENTS LIST ───────────────────────────────────────────────────── */
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

/* ── EVENT DETAIL ──────────────────────────────────────────────────── */
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

  const note = joined
    ? `<a class="font-semibold text-ok underline underline-offset-2" href="#/confirmed/${e.id}">Open your ticket</a>`
    : seats <= 0
      ? `<span class="text-err font-semibold">No seats remaining.</span>`
      : S.user
        ? `<span class="text-mut">${seats} of ${e.n} seats remaining &middot; one-click registration</span>`
        : `<span class="text-mut">${seats} of ${e.n} seats remaining</span>`;

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

      <div class="flex flex-wrap gap-3">
        <button class="${btn("o")}" data-act="save" data-v="${e.id}" aria-pressed="${saved}">
          ${saved ? `${icon("bookmark-check", { size: 15 })} Saved` : `${icon("bookmark", { size: 15 })} Save`}
        </button>
        ${mainAction}
      </div>
      <p class="mt-2.5 min-h-5 text-[13px]">${note}</p>
    </div>
  </div>
</div>`;
}

/* ── JOIN FORM (anonymous only) ────────────────────────────────────── */
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

/* ── CONFIRM / TICKET ──────────────────────────────────────────────── */
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
      if (on) out += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  return `<svg class="block rounded-lg bg-white p-2 shadow-sm" width="160" height="160"
    viewBox="0 0 21 21" role="img" aria-label="Event QR code (mock)" shape-rendering="crispEdges">${out}</svg>`;
}

function confirmView(e) {
  const j = S.joined[e.id];

  const row = (label, val) => `
<div class="grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-x-2.5 py-0.5 text-[12.5px] sm:text-[13px]">
  <span class="text-[10px] font-bold uppercase tracking-[.08em] opacity-55">${label}</span>
  <span class="min-w-0 font-medium">${val}</span>
</div>`;

  return `
<div class="min-h-[calc(100dvh-52px)] flex items-start justify-center py-5 sm:py-6"
     style="background:linear-gradient(160deg,#062e1a 0%,#0a4a2b 50%,#0e5e33 100%)">

  <div class="mx-auto w-full max-w-[680px] px-4 sm:px-6">

    <div class="mb-4 text-center text-white">
      <div class="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-ok
                  shadow-[0_0_0_5px_rgba(31,174,58,.22)] reveal">
        ${icon("check", { size: 20 })}
      </div>
      <h1 class="text-[clamp(22px,4vw,30px)] font-extrabold tracking-[-0.04em] leading-[1.1] text-white reveal"
          style="animation-delay:50ms">
        You're in, ${esc(j.name.split(" ")[0])}!
      </h1>
      <p class="mt-1 text-[13px] text-white/75 reveal" style="animation-delay:100ms">
        Registered for <strong class="font-semibold text-white">${esc(e.t)}</strong>
      </p>
    </div>

    <div class="ticket-card reveal mb-3 rounded-2xl border border-white/15 bg-white/08 p-4 text-white backdrop-blur-sm sm:p-5"
         style="animation-delay:150ms">

      <div class="grid grid-cols-1 items-center gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-5">

        <div class="flex items-center justify-center">
          ${qr(e.t + j.sid)}
        </div>

        <div class="flex min-w-0 flex-col">
          <h2 class="mb-2 text-[19px] font-extrabold leading-[1.15] tracking-[-0.03em] text-white sm:text-[22px]">
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

      <div class="mt-4 flex items-center gap-2 rounded-xl border border-ok/30 bg-ok/15
                  px-3.5 py-2 text-[12.5px] font-semibold">
        ${icon("check-circle", { size: 14, cls: "text-ok shrink-0" })}
        Registration confirmed &mdash; Status: Going
      </div>
    </div>

    <div class="reveal flex flex-wrap items-center justify-between gap-3" style="animation-delay:200ms">
      <label class="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border
                    border-white/15 bg-white/06 px-3.5 py-2.5 text-[13px] text-white
                    hover:bg-white/12 transition-all whitespace-nowrap">
        <input type="checkbox" data-act="remind" data-v="${e.id}"${j.rem ? " checked" : ""}
               class="h-4 w-4 accent-ok rounded" />
        <span class="flex items-center gap-1.5">
          ${icon("bell", { size: 13 })} Remind me
        </span>
      </label>

      <div class="flex gap-2">
        <a class="${btn("ow")}" href="#/">Home</a>
        <a class="${btn("p")}"  href="#/events">Events</a>
      </div>
    </div>

  </div>
</div>`;
}

/* ── MY EVENTS ─────────────────────────────────────────────────────── */
function mine() {
  const jl   = EV.filter((e) => S.joined[e.id]);
  const sl   = EV.filter((e) => S.saved.includes(e.id));
  const list = tab === "joined" ? jl : sl;

  const row = (e) => {
    const j = S.joined[e.id], asking = askCancel === e.id;

    const action = j
      ? asking
        ? `<div class="flex flex-col gap-2">
             <button class="${btn("x", true)}" data-act="cancelyes" data-v="${e.id}">Yes, cancel</button>
             <button class="${btn("ow", true)}" data-act="cancelno">Keep it</button>
           </div>`
        : `<button class="${btn("ow", true)}" data-act="cancelask" data-v="${e.id}">Cancel</button>`
      : `<button class="${btn("ow", true)}" data-act="save" data-v="${e.id}">Remove</button>`;

    return `
<div class="event-card mt-4 grid grid-cols-1 items-center gap-4 rounded-2xl bg-g p-3.5 text-white
            sm:grid-cols-[136px_minmax(0,1fr)_auto] sm:gap-5">

  <div class="card-thumb relative h-28 w-full overflow-hidden rounded-xl sm:w-auto"
       style="background:${e.g}">
    ${thumb(e)}
  </div>

  <div class="min-w-0">
    <h3 class="mb-0.5 truncate text-[17px] font-bold tracking-[-0.02em]">${esc(e.t)}</h3>
    <div class="mt-1 space-y-0.5">
      <p class="flex items-center gap-1.5 text-[12.5px] opacity-65">
        ${icon("calendar", { size: 11 })} ${e.full}
      </p>
      <p class="flex items-center gap-1.5 text-[12.5px] opacity-65">
        ${icon("clock",    { size: 11 })} ${e.time}
      </p>
      <p class="flex items-center gap-1.5 text-[12.5px] opacity-65">
        ${icon(e.online ? "video" : "map-pin", { size: 11 })} ${esc(e.loc)} &middot; ${e.c}
      </p>
    </div>
    <div class="mt-2.5">
      ${j ? badge(`${icon("check", { size: 10 })} Going`, "badge-joined bg-ok text-white")
          : status(e)}
    </div>
  </div>

  <div class="flex flex-row items-stretch gap-2 sm:flex-col [&>*]:flex-1 sm:[&>*]:flex-none sm:[&>*]:w-[152px]">
    <a class="${btn("p", true)}" href="#/event/${e.id}">View details</a>
    ${action}
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

  <div class="reveal-stagger">
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

  <div class="mt-8 flex flex-wrap gap-3 reveal">
    <a class="${btn("o")}" href="#/events">
      ${icon("arrow-left", { size: 15 })} Events
    </a>
    <a class="${btn("o")}" href="#/">Home</a>
  </div>
</div>`;
}

/* ── PROFILE ───────────────────────────────────────────────────────── */
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

    <div class="flex gap-1 rounded-xl border border-g/12 bg-neutral-50 p-1 mb-1">
      <button type="button" class="${pill(!reg)} flex-1 justify-center text-center"
              data-act="auth" data-v="login">Sign in</button>
      <button type="button" class="${pill(reg)} flex-1 justify-center text-center"
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
           placeholder="${reg ? "Minimum 8 characters" : "Any password works in this demo"}" />

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

  app.classList.toggle("reveal-instant", !doAnimate);
  if (doAnimate) animateView();

  app.innerHTML = (views[c.v] || views.home)();

  requestAnimationFrame(() => {
    renderIcons();
    if (doAnimate) initReveal();
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
      `<a href="${url}"
          class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition
                 ${k === active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"}">
         ${icon(NAV_ICONS[k], { size: 15 })}
         <span>${label}</span>
       </a>`
    ).join("");
  }

  renderIcons();
}

/* ── Route ── */
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
    /* Park current session into the account bucket, then reset the session */
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

  /* ── join (anonymous registration + event registration) ── */
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

  /* ── login ── */
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

  /* ── register (from profile) ── */
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
   BOOT
   ===================================================================== */
document.getElementById("nav-toggle")?.addEventListener("click", toggleMobileNav);
route();