(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const EMAIL = "parthkaila007@gmail.com";
  const LINKEDIN = "https://www.linkedin.com/in/parth-patel-8075b120a/";
  const RESUME = "Parth_Patel_Mobile_Application_Developer.pdf";

  /* ---------- Toast + copy ---------- */
  const toastEl = $("#toast");
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }
  async function copyText(text, label) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); ok = document.execCommand("copy"); ta.remove();
      } catch (e2) { ok = false; }
    }
    toast(ok ? `${label} copied` : `Couldn't copy. ${label}: ${text}`);
    return ok;
  }
  $$(".copy-btn").forEach(btn => btn.addEventListener("click", async () => {
    const label = btn.getAttribute("aria-label").replace(/^Copy /, "");
    const ok = await copyText(btn.dataset.copy, label.charAt(0).toUpperCase() + label.slice(1));
    if (ok) { btn.classList.add("done"); setTimeout(() => btn.classList.remove("done"), 1600); }
  }));

  /* ---------- Theme ---------- */
  function effectiveTheme() {
    const t = root.getAttribute("data-theme");
    if (t === "dark" || t === "light") return t;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("pp-theme", t); } catch (e) { /* storage unavailable */ }
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = t === "dark" ? "#06080C" : "#F1F3F7";
  }
  root.setAttribute("data-theme", effectiveTheme());
  function toggleTheme(originEl) {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    if (!document.startViewTransition || reduced) { setTheme(next); return; }
    const r = (originEl || $("#themeToggle")).getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const tr = document.startViewTransition(() => setTheme(next));
    tr.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.2,.75,.1,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {});
  }
  $("#themeToggle").addEventListener("click", e => toggleTheme(e.currentTarget));

  /* ---------- Dates & durations ---------- */
  const NOW = new Date();
  const curY = NOW.getFullYear(), curM = NOW.getMonth() + 1;
  const monthsBetween = (y1, m1, y2, m2) => (y2 - y1) * 12 + (m2 - m1);
  const fmtDur = mo => {
    const y = Math.floor(mo / 12), m = mo % 12, parts = [];
    if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
    if (m) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
    return parts.join(" ") || "1 mo";
  };
  const fullYears = Math.floor(monthsBetween(2022, 2, curY, curM) / 12);
  $$("[data-years]").forEach(el => { el.textContent = fullYears; });
  $$("[data-years-text]").forEach(el => { el.textContent = fullYears + "+"; });
  $$("[data-total-exp]").forEach(el => { el.textContent = fmtDur(monthsBetween(2022, 2, curY, curM) + 1); });
  $$(".tl-dur[data-from]").forEach(el => {
    const [fy, fm] = el.dataset.from.split("-").map(Number);
    let ty = curY, tm = curM;
    if (el.dataset.to) [ty, tm] = el.dataset.to.split("-").map(Number);
    el.textContent = fmtDur(monthsBetween(fy, fm, ty, tm) + 1);
  });
  $("#year").textContent = curY;

  /* ---------- IST time ---------- */
  const pad = n => String(n).padStart(2, "0");
  function ist() {
    const n = new Date();
    const t = new Date(n.getTime() + n.getTimezoneOffset() * 60000 + 330 * 60000);
    return { h: t.getHours(), m: t.getMinutes() };
  }
  function updateClocks() {
    const { h, m } = ist();
    const h12 = h % 12 || 12, ap = h < 12 ? "AM" : "PM";
    $("#heroClock").textContent = `Ahmedabad ${h12}:${pad(m)} ${ap} IST`;
    $("#factTime").textContent = `· ${h12}:${pad(m)} ${ap} IST`;
    $$("[data-clock-short]").forEach(el => { el.textContent = `${h12}:${pad(m)}`; });
  }

  /* ---------- Illustrations for the phone screens ---------- */
  const ic = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    home: ic('<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>'),
    cal: ic('<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
    qr: ic('<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM18 14h2M14 18h2"/>'),
    user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'),
    feed: ic('<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>'),
    chat: ic('<path d="M4 5h16v11H9l-5 4z"/>'),
    star: ic('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>'),
    bag: ic('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    search: ic('<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>'),
    truck: ic('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>')
  };
  const ILL = {
    dumbbell: '<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-30 32 32)" fill="#fff"><rect x="5" y="20" width="9" height="24" rx="2.5"/><rect x="14" y="25" width="6" height="14" rx="2"/><rect x="20" y="29.5" width="24" height="5" rx="2.5"/><rect x="44" y="25" width="6" height="14" rx="2"/><rect x="50" y="20" width="9" height="24" rx="2.5"/></g></svg>',
    kettlebell: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M23 31v-7a9 9 0 0 1 18 0v7" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M32 26c9 0 15 6 15 14 0 5-2 9-5 12H22c-3-3-5-7-5-12 0-8 6-14 15-14z" fill="#fff"/></svg>',
    bike: '<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="42" r="9"/><circle cx="49" cy="42" r="9"/><path d="M15 42l10-16h14l10 16M25 26l7 16H15M39 26l2-7M37 19h8M25 26l-2-6M19 20h8"/></svg>',
    yoga: '<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="12" r="5" fill="#fff" stroke="none"/><path d="M32 20v18M32 38v18M32 38l10 6-10 4M32 25l-8-11M32 25l8-11"/></svg>',
    school: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12 54 25H10Z" fill="#fff"/><rect x="14" y="25" width="36" height="27" fill="#fff"/><rect x="28" y="38" width="8" height="14" fill="#3E6BFF"/><rect x="18" y="30" width="7" height="7" rx="1" fill="#3E6BFF"/><rect x="39" y="30" width="7" height="7" rx="1" fill="#3E6BFF"/><path d="M32 12V4" stroke="#fff" stroke-width="2"/><path d="M32 4h9l-2 3 2 3h-9z" fill="#FFB648"/></svg>',
    classroom: `<svg viewBox="0 0 200 105" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="105" fill="#FFE8C2"/><rect y="82" width="200" height="23" fill="#E9B97A"/>
      <rect x="18" y="12" width="98" height="54" rx="4" fill="#2F5D50" stroke="#8B5E3C" stroke-width="4"/>
      <text x="30" y="35" font-family="Chalkboard SE, Comic Sans MS, sans-serif" font-size="14" fill="#fff">A B C</text>
      <text x="30" y="56" font-family="Chalkboard SE, Comic Sans MS, sans-serif" font-size="12" fill="#FDE68A">1 + 2 = 3</text>
      <circle cx="150" cy="24" r="10" fill="#fff" stroke="#3E6BFF" stroke-width="3"/><path d="M150 24v-6M150 24l4 3" stroke="#121826" stroke-width="2" stroke-linecap="round"/>
      <rect x="130" y="42" width="24" height="19" rx="2" fill="#fff"/><circle cx="138" cy="49" r="3.5" fill="#FF6B3D"/><path d="M132 59l6-6 4 3 5-4 5 7z" fill="#3DDC97"/>
      <rect x="160" y="42" width="24" height="19" rx="2" fill="#fff"/><path d="M164 58q8-13 16 0z" fill="#3E6BFF"/><circle cx="178" cy="47" r="2.5" fill="#FFB648"/>
      <rect x="40" y="74" width="74" height="8" rx="2" fill="#8B5E3C"/><rect x="46" y="82" width="5" height="16" fill="#7A4E2E"/><rect x="103" y="82" width="5" height="16" fill="#7A4E2E"/>
      <rect x="50" y="62" width="8" height="12" rx="1" fill="#FF6B3D"/><rect x="59" y="60" width="8" height="14" rx="1" fill="#3E6BFF"/><rect x="68" y="64" width="8" height="10" rx="1" fill="#3DDC97"/>
      <circle cx="96" cy="68" r="6" fill="#E53E3E"/><path d="M96 62q2-4 6-4" stroke="#2F855A" stroke-width="2" fill="none"/>
    </svg>`,
    drill: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="16" width="34" height="15" rx="5" fill="#FFC233"/><rect x="44" y="19" width="7" height="9" rx="1.5" fill="#1F2937"/><path d="M51 23.5h9" stroke="#6B7280" stroke-width="2.5" stroke-linecap="round"/><path d="M20 31h11l-2 16h-8z" fill="#1F2937"/><rect x="15" y="46" width="21" height="9" rx="2.5" fill="#FFC233"/><circle cx="17" cy="23.5" r="3" fill="#1F2937"/></svg>',
    ladder: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 6v52M42 6v52" stroke="#6B7280" stroke-width="4.5" stroke-linecap="round"/><path d="M22 15h20M22 25h20M22 35h20M22 45h20" stroke="#9CA3AF" stroke-width="3.5" stroke-linecap="round"/><rect x="18" y="55" width="8" height="5" rx="1.5" fill="#F5B000"/><rect x="38" y="55" width="8" height="5" rx="1.5" fill="#F5B000"/></svg>',
    digger: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="46" width="38" height="10" rx="5" fill="#1F2937"/><circle cx="12" cy="51" r="2.5" fill="#6B7280"/><circle cx="25" cy="51" r="2.5" fill="#6B7280"/><circle cx="38" cy="51" r="2.5" fill="#6B7280"/><rect x="8" y="34" width="32" height="12" rx="3" fill="#F5B000"/><path d="M20 34V22a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v12z" fill="#F5B000"/><rect x="24" y="22" width="9" height="8" rx="1.5" fill="#BFE3F5"/><path d="M38 38 48 20l8 10" fill="none" stroke="#D99A00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 30h9l-2 9h-9z" fill="#1F2937"/></svg>',
    generator: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 22v-7h36v7" fill="none" stroke="#1F2937" stroke-width="3" stroke-linejoin="round"/><rect x="9" y="21" width="46" height="29" rx="4" fill="#FFC233"/><rect x="15" y="27" width="19" height="17" rx="2" fill="#1F2937"/><path d="M18 31h13M18 35.5h13M18 40h13" stroke="#6B7280" stroke-width="2"/><circle cx="45" cy="31" r="4" fill="#1F2937"/><rect x="40" y="39" width="10" height="5" rx="1" fill="#1F2937"/><rect x="12" y="50" width="8" height="5" rx="1.5" fill="#1F2937"/><rect x="44" y="50" width="8" height="5" rx="1.5" fill="#1F2937"/></svg>'
  };

  const DAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const weekHTML = () => {
    let h = "";
    for (let i = 0; i < 7; i++) {
      const d = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() + i);
      h += `<span class="${i === 0 ? "sel" : ""}">${DAY[d.getDay()]}<b>${d.getDate()}</b></span>`;
    }
    return h;
  };
  const wavePath = () => {
    let d = "M0 40";
    for (let i = 0; i < 8; i++) {
      const x = i * 50;
      d += ` C${x + 8} 40 ${x + 10} 10 ${x + 16} 10 C${x + 22} 10 ${x + 24} 34 ${x + 30} 31 C${x + 35} 29 ${x + 40} 40 ${x + 50} 40`;
    }
    return d;
  };
  const AI_COLORS = ["#FFB648", "#FF6B3D", "#4CC8FF", "#AE92FF", "#3DDC97"];
  const miniGrid = () => {
    let h = "";
    for (let i = 0; i < 24; i++) {
      const filled = (i * 7) % 11 !== 3 && i % 9 !== 5;
      h += `<i class="${filled ? "f" : ""}" style="--c:${AI_COLORS[(i * 3) % 5]};transition-delay:${i * 40}ms"></i>`;
    }
    return h;
  };

  const SCREENS = {
    fit: {
      project: "Fit Republik", feature: "Class booking & membership", href: "#p-fit", sb: "#ffffff",
      html: () => `<div class="scr s-fit" data-booked="0">
        <div class="ah"><div><small>Good morning, Sam</small><b>Book a class</b></div><span class="av"></span></div>
        <div class="week">${weekHTML()}</div>
        <div class="feat">
          <div class="feat-txt"><small>Today · 7:00 PM · Studio 2</small><b>HIIT Burn</b><span class="spots">6 spots left</span>
            <span class="book-btn"><span class="bk-a">Book now</span><span class="bk-b">Booked ✓</span></span></div>
          <span class="feat-ill">${ILL.dumbbell}</span>
        </div>
        <p class="list-h">Upcoming classes</p>
        <ul class="cls">
          <li><span class="ill-tile" style="--g1:#7C5CFF;--g2:#B39CFF">${ILL.yoga}</span><div><b>Yoga Flow</b><small>8:00 AM · Studio 1 · 60 min</small></div><span class="pill p-book">Book</span></li>
          <li><span class="ill-tile" style="--g1:#1393C9;--g2:#5FD1FF">${ILL.bike}</span><div><b>Spin Cycle</b><small>6:30 PM · Cycle room · 45 min</small></div><span class="pill p-wait">Waitlist</span></li>
          <li><span class="ill-tile" style="--g1:#13905A;--g2:#4FD99C">${ILL.kettlebell}</span><div><b>Strength &amp; PT</b><small>7:30 PM · Gym floor · 50 min</small></div><span class="pill p-ok">Booked</span></li>
        </ul>
        <div class="mem"><span class="mem-ico">${ICON.qr}</span><div><b>Gold membership · Active</b><small>Instalment plan · Freeze or renew anytime</small></div></div>
        <div class="tabbar"><span class="on">${ICON.home}</span><span>${ICON.cal}</span><span class="mid">${ICON.qr}</span><span>${ICON.user}</span></div>
      </div>`
    },
    bloomz: {
      project: "Bloomz", feature: "Class feed, events & live translation", href: "#p-bloomz", sb: "#121826",
      html: () => `<div class="scr s-school" data-going="0">
        <div class="ah"><div class="ah-row"><span class="school-badge">${ILL.school}</span><div><small>Greenfield Primary</small><b>Class 4B</b></div></div><span class="av"></span></div>
        <div class="post">
          <div class="post-h"><span class="av sm" style="background:linear-gradient(135deg,#3E6BFF,#46C2FF)"></span><div><b>Ms. Rao</b><small>Class teacher · 2h</small></div></div>
          <div class="post-img">${ILL.classroom}</div>
          <p class="post-cap">Art day in Class 4B! Look at these paintings.</p>
          <div class="post-f"><span>♥ 24</span><span>6 comments</span></div>
        </div>
        <div class="event"><span class="ev-date"><small>FRI</small><b>14</b></span><div><b>Sports Day</b><small>9:00 AM · School ground</small></div><span class="pill rsvp"><span class="rs-a">RSVP</span><span class="rs-b">Going ✓</span></span></div>
        <div class="msg"><p data-tr dir="ltr">Field trip forms are due on Friday.</p><span class="lang-chip" data-tr-lang>Original · English</span></div>
        <div class="tabbar"><span class="on">${ICON.feed}</span><span>${ICON.chat}</span><span>${ICON.cal}</span><span>${ICON.star}</span></div>
      </div>`
    },
    speedy: {
      project: "Speedy Hire", feature: "Tools & equipment hire, off-hire", href: "#p-speedy", sb: "#111827",
      html: () => `<div class="scr s-hire" data-off="0">
        <div class="ah"><div><small>Tools &amp; equipment hire</small><b>Catalogue</b></div><span class="cart">${ICON.bag}<i>2</i></span></div>
        <div class="search">${ICON.search}<span>Search drills, ladders, diggers</span></div>
        <div class="cats"><span class="on">Power tools</span><span>Access</span><span>Plant</span><span>Power</span></div>
        <div class="prods">
          <div class="prod"><span class="prod-ill">${ILL.drill}</span><b>Cordless drill</b><small>Hire from 1 day</small><span class="stock">In stock</span></div>
          <div class="prod"><span class="prod-ill">${ILL.ladder}</span><b>Step ladder</b><small>Hire or buy</small><span class="stock">In stock</span></div>
          <div class="prod"><span class="prod-ill">${ILL.digger}</span><b>Mini digger</b><small>Delivered to site</small><span class="stock low">2 left</span></div>
          <div class="prod"><span class="prod-ill">${ILL.generator}</span><b>Generator</b><small>Hire from 1 day</small><span class="stock">In stock</span></div>
        </div>
        <div class="deliv"><span class="dv-ico">${ICON.truck}</span><div><b>Order #4821 · Out for delivery</b><small>Arriving 2–4 PM · Live tracking</small><span class="dv-bar"><span></span></span></div></div>
        <div class="onhire">
          <div class="oh-top"><span class="oh-ill">${ILL.digger}</span><div><small>On hire · Day 3</small><b>Mini digger · Site 4</b></div></div>
          <div class="oh-actions"><span>Track delivery</span><span class="offhire"><span class="oh-a">Off-hire</span><span class="oh-b">Off-hired ✓</span></span></div>
        </div>
      </div>`
    },
    psi: {
      project: "PSI Access", feature: "Offline-first sync queue", href: "#p-psi", sb: "#ffffff",
      html: () => `<div class="scr s-sync" data-state="offline">
        <div class="ah"><div><small>Operator Rounds</small><b>Unit 2 · Shift A</b></div><span class="av" style="background:linear-gradient(135deg,#AE92FF,#4CC8FF)"></span></div>
        <div class="net-banner"><span class="dot"></span><span data-net>Offline · 3 items saved on device</span></div>
        <ul class="queue">
          <li><span class="q-ico">MI</span><div><b>Pump P-101 inspection</b><small>2 photos</small></div><span class="q-state">Queued</span><span class="q-bar"><span></span></span></li>
          <li><span class="q-ico">HW</span><div><b>Hot Work Permit #2231</b><small>Signed PDF</small></div><span class="q-state">Queued</span><span class="q-bar"><span></span></span></li>
          <li><span class="q-ico">OR</span><div><b>Valve V-12 reading</b><small>4.2 bar</small></div><span class="q-state">Queued</span><span class="q-bar"><span></span></span></li>
        </ul>
        <div class="modules"><span>Mechanical Integrity</span><span>Operator Rounds</span><span>Hot Work Permits</span><span>Contractors</span></div>
      </div>`
    },
    sleep: {
      project: "SleepImage", feature: "Bluetooth LE overnight recording", href: "#p-sleep", sb: "#ffffff",
      html: () => `<div class="scr s-ble" data-state="scan">
        <div class="ah"><div><small>Home sleep test · Night 1</small><b>Finger sensor</b></div></div>
        <div class="radar"><span></span><span></span><span></span><i class="core"></i></div>
        <p class="ble-status" data-ble>Scanning for sensor…</p>
        <p class="ble-time" data-ble-time>00:00:00</p>
        <div class="wave"><svg viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><path d="${wavePath()}" fill="none" stroke="#4CC8FF" stroke-width="2" vector-effect="non-scaling-stroke"/></svg></div>
        <div class="ble-meta"><span>Bluetooth LE</span><span>Background recording</span><span>Cloud sync</span></div>
      </div>`
    },
    sketch: {
      project: "Sketchplay AI", feature: "Plain-English rules to a schedule", href: "#p-sketch", sb: "#ffffff",
      html: () => `<div class="scr s-ai" data-phase="5">
        <div class="ah"><div><small>Spring League · 12 teams</small><b>Schedule agent</b></div><span class="av"></span></div>
        <div class="bubble out" data-step="1"><p>No games after 9 PM. Every team needs an hour of rest between games.</p></div>
        <div class="ai-stack">
          <div class="ai-typing" data-step="2"><span class="typing"><i></i><i></i><i></i></span>Reading your rules</div>
          <div class="bubble in" data-step="3"><p>Added 2 constraints. Solving with CP-SAT…</p></div>
        </div>
        <div class="mini-grid" data-step="4">${miniGrid()}</div>
        <div class="ai-result" data-step="5"><svg><use href="#i-check"/></svg>48 matches · 0 conflicts</div>
      </div>`
    }
  };

  function buildPhone(el) {
    const keys = el.dataset.screens.split(/\s+/);
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<div class="phone-screen"><span class="island"></span>
      <div class="sbar"><span data-clock-short>9:41</span><span class="sb-icons"><span class="sb-sig"><i></i><i></i><i></i><i></i></span><span class="sb-bat"></span></span></div>
      ${keys.map(k => SCREENS[k].html()).join("")}
      <span class="home-ind"></span></div>`;
    $(".scr", el).classList.add("is-on");
    el.style.setProperty("--sb", SCREENS[keys[0]].sb);
  }
  const wideMQ = matchMedia("(min-width: 981px)");
  const needed = el => el.id === "heroPhone" || (el.id === "workPhone" ? wideMQ.matches : !wideMQ.matches);
  const buildNeeded = () => $$(".phone[data-screens]").forEach(el => { if (!el.dataset.built && needed(el)) { buildPhone(el); el.dataset.built = "1"; if (window.__pio) window.__pio.observe(el); } });
  buildNeeded();
  wideMQ.addEventListener("change", () => { buildNeeded(); updateClocks(); });
  updateClocks();

  /* ---------- Hero phone cycle ---------- */
  const heroPhone = $("#heroPhone");
  const heroKeys = heroPhone.dataset.screens.split(/\s+/);
  const heroScreens = $$(".scr", heroPhone);
  const dotsWrap = $("#screenDots");
  const CYCLE = 4200;
  let heroIdx = 0, heroTimer = 0, heroHover = false, heroVisible = true;
  dotsWrap.style.setProperty("--cycle", CYCLE + "ms");
  heroKeys.forEach((k, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Show ${SCREENS[k].project}: ${SCREENS[k].feature}`);
    b.addEventListener("click", () => showHero(i));
    dotsWrap.appendChild(b);
  });
  const dots = $$("button", dotsWrap);
  function showHero(i) {
    const prev = heroIdx;
    heroScreens.forEach((s, j) => {
      s.classList.toggle("is-on", j === i);
      if (j === prev && prev !== i) { s.classList.add("is-out"); setTimeout(() => s.classList.remove("is-out"), 700); }
    });
    heroIdx = i;
    const S = SCREENS[heroKeys[i]];
    heroPhone.style.setProperty("--sb", S.sb);
    const pl = $("#screenProject");
    pl.textContent = S.project; pl.setAttribute("href", S.href);
    $("#screenFeature").textContent = S.feature;
    dots.forEach((d, j) => { d.classList.remove("on"); d.setAttribute("aria-pressed", String(j === i)); });
    void dotsWrap.offsetWidth;
    dots[i].classList.add("on");
    scheduleHero();
  }
  function scheduleHero() {
    clearTimeout(heroTimer);
    const run = !heroHover && heroVisible && !reduced;
    dotsWrap.classList.toggle("paused", !run);
    if (run) heroTimer = setTimeout(() => showHero((heroIdx + 1) % heroKeys.length), CYCLE);
  }
  const stage = $("#heroStage");
  stage.addEventListener("pointerenter", () => { heroHover = true; scheduleHero(); });
  stage.addEventListener("pointerleave", () => { heroHover = false; showHero(heroIdx); });
  showHero(0);

  /* ---------- One 1s tick drives every phone screen ---------- */
  const LANGS = [
    ["English", "Field trip forms are due on Friday.", "ltr"],
    ["हिन्दी", "फ़ील्ड ट्रिप के फ़ॉर्म शुक्रवार तक जमा करने हैं।", "ltr"],
    ["العربية", "آخر موعد لتسليم استمارات الرحلة يوم الجمعة.", "rtl"],
    ["Español", "Los formularios de la excursión se entregan el viernes.", "ltr"],
    ["ગુજરાતી", "ફીલ્ડ ટ્રિપના ફોર્મ શુક્રવાર સુધીમાં જમા કરાવવાના છે.", "ltr"],
    ["日本語", "遠足の申込書は金曜日までに提出してください。", "ltr"]
  ];
  const AI_PHASES = [1, 2, 2, 3, 4, 5, 5, 5, 5, 0];
  let tick = 0;
  function onTick() {
    tick++;
    if (tick % 15 === 0) updateClocks();
    // Only the screen a visitor can actually see gets updated. Hidden and off-screen
    // screens stay still, so nothing changes on the page while it is not in view.
    const live = $$(".phone:not(.paused) .scr.is-on");
    if (!live.length) return;
    const has = cls => live.filter(s => s.classList.contains(cls));

    has("s-fit").forEach(s => { s.dataset.booked = Math.floor(tick / 3) % 2 ? "1" : "0"; });
    has("s-school").forEach(s => {
      s.dataset.going = Math.floor(tick / 4) % 2 ? "1" : "0";
      if (tick % 2) return;
      const L = LANGS[(tick / 2) % LANGS.length];
      const p = $("[data-tr]", s), chip = $("[data-tr-lang]", s);
      p.classList.add("swap");
      setTimeout(() => { p.textContent = L[1]; p.dir = L[2]; p.classList.remove("swap"); }, 300);
      chip.textContent = L[0] === "English" ? "Original · English" : `Translated · ${L[0]}`;
    });
    has("s-hire").forEach(s => {
      s.dataset.off = Math.floor(tick / 4) % 2 ? "1" : "0";
      const bar = $(".dv-bar span", s);
      if (bar) bar.style.transform = `scaleX(${(.25 + (tick % 12) * .06).toFixed(2)})`;
      const sel = Math.floor(tick / 2) % 4;
      $$(".prod", s).forEach((p, i) => p.classList.toggle("sel", i === sel));
    });

    const sp = tick % 10;
    const st = sp < 4 ? "offline" : sp < 7 ? "syncing" : "synced";
    has("s-sync").forEach(s => {
      if (s.dataset.state === st) return;
      s.dataset.state = st;
      $("[data-net]", s).textContent = st === "offline" ? "Offline · 3 items saved on device" : st === "syncing" ? "Back online · uploading 3 items" : "All changes synced";
      $$(".q-state", s).forEach(q => { q.textContent = st === "offline" ? "Queued" : st === "syncing" ? "Uploading" : "Synced"; });
    });

    const bp = tick % 14;
    const bs = bp < 4 ? "scan" : bp < 6 ? "pair" : "rec";
    const recSecs = 2 * 3600 + 14 * 60 + Math.max(0, bp - 6) + Math.floor(tick / 14) * 8;
    has("s-ble").forEach(s => {
      if (s.dataset.state !== bs) {
        s.dataset.state = bs;
        $("[data-ble]", s).textContent = bs === "scan" ? "Scanning for sensor…" : bs === "pair" ? "Sensor found · pairing" : "Recording overnight";
      }
      $("[data-ble-time]", s).textContent = bs === "rec" ? `${pad(Math.floor(recSecs / 3600))}:${pad(Math.floor(recSecs / 60) % 60)}:${pad(recSecs % 60)}` : "00:00:00";
    });

    const phase = String(AI_PHASES[tick % AI_PHASES.length]);
    has("s-ai").forEach(s => { if (s.dataset.phase !== phase) s.dataset.phase = phase; });
  }
  setInterval(onTick, 1000);

  /* pause looping animations in anything that is off screen */
  if ("IntersectionObserver" in window) {
    const pio = new IntersectionObserver(entries => entries.forEach(en => {
      en.target.classList.toggle("paused", !en.isIntersecting);
      if (en.target === heroPhone) { heroVisible = en.isIntersecting; scheduleHero(); }
    }), { rootMargin: "200px 0px" });
    window.__pio = pio;
    $$(".phone[data-built], main > section, .footer").forEach(p => pio.observe(p));
  }

  /* ---------- Projects showcase: the side phone follows the project you are reading ---------- */
  (() => {
    const phone = $("#workPhone"), device = $("#workDevice");
    if (!phone) return;
    const keys = phone.dataset.screens.split(/\s+/);
    const cards = keys.map(k => document.getElementById("p-" + k));
    const dotsEl = $("#wdDots");
    const TONES = { fit: "var(--flutter)", bloomz: "var(--flutter)", speedy: "var(--flutter)", psi: "var(--maui)", sleep: "var(--maui)" };
    keys.forEach((k, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.tabIndex = -1;
      b.addEventListener("click", () => cards[i].scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }));
      dotsEl.appendChild(b);
    });
    const dots = $$("button", dotsEl);
    let cur = -1;
    const show = i => {
      if (i === cur) return;
      const prev = cur; cur = i;
      $$(".scr", phone).forEach((s, j) => {
        s.classList.toggle("is-on", j === i);
        if (j === prev) { s.classList.add("is-out"); setTimeout(() => s.classList.remove("is-out"), 650); }
      });
      cards.forEach((c, j) => c.classList.toggle("active", j === i));
      dots.forEach((d, j) => d.classList.toggle("on", j === i));
      phone.style.setProperty("--sb", SCREENS[keys[i]].sb);
      device.style.setProperty("--tone", TONES[keys[i]]);
      $("#wdCount").textContent = `${pad(i + 1)} / ${pad(keys.length)}`;
      $("#wdName").textContent = SCREENS[keys[i]].project;
    };
    show(0);
    wideMQ.addEventListener("change", () => { const c = Math.max(0, cur); cur = -1; show(c); });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) show(cards.indexOf(e.target)); }), { rootMargin: "-45% 0px -45% 0px" });
      cards.forEach(c => io.observe(c));
    }
  })();

  /* ---------- Tilt + parallax (hero only) ---------- */
  const heroSec = $(".hero");
  let heroOnScreen = true;
  if (finePointer && !reduced) {
    let tiltRaf = 0, tx = 0, ty = 0;
    heroSec.addEventListener("pointermove", e => {
      tx = e.clientX; ty = e.clientY;
      if (tiltRaf) return;
      tiltRaf = requestAnimationFrame(() => {
        tiltRaf = 0;
        const r = stage.getBoundingClientRect();
        const cx = Math.max(-1, Math.min(1, (tx - (r.left + r.width / 2)) / (r.width / 1.2)));
        const cy = Math.max(-1, Math.min(1, (ty - (r.top + r.height / 2)) / (r.height / 1.2)));
        heroPhone.style.setProperty("--ry", (cx * 14).toFixed(1) + "deg");
        heroPhone.style.setProperty("--rx", (-cy * 9).toFixed(1) + "deg");
        stage.style.setProperty("--px", cx.toFixed(2));
        stage.style.setProperty("--py", cy.toFixed(2));
      });
    });
    heroSec.addEventListener("pointerleave", () => {
      ["--ry", "--rx"].forEach(p => heroPhone.style.removeProperty(p));
      ["--px", "--py"].forEach(p => stage.style.removeProperty(p));
    });
  }

  /* ---------- Kinetic name (reads first, then writes) ---------- */
  const chars = $$(".name .ch");
  const setChar = (c, t) => {
    c.style.fontVariationSettings = `"wght" ${Math.round(760 - t * 520)}, "wdth" ${Math.round(100 - t * 25)}, "opsz" 96`;
    c.style.setProperty("--t", t.toFixed(2));
  };
  if (!reduced) {
    if (finePointer) {
      let px = 0, py = 0, raf = 0, active = false;
      const update = () => {
        raf = 0;
        const centers = chars.map(c => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
        chars.forEach((c, i) => {
          const d = active ? Math.hypot(px - centers[i][0], py - centers[i][1]) : 1e4;
          const t = Math.max(0, 1 - d / 240);
          setChar(c, t * t * (3 - 2 * t));
        });
      };
      heroSec.addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; active = true; if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
      heroSec.addEventListener("pointerleave", () => { active = false; if (!raf) raf = requestAnimationFrame(update); });
    } else {
      // Touch screens: one wave across the name after load, and again when the name is tapped.
      let waving = false;
      const wave = () => {
        if (waving) return;
        waving = true;
        chars.forEach((c, i) => {
          setTimeout(() => setChar(c, .8), i * 90);
          setTimeout(() => setChar(c, 0), i * 90 + 420);
        });
        setTimeout(() => { waving = false; }, chars.length * 90 + 900);
      };
      setTimeout(wave, 1400);
      $(".name").addEventListener("click", wave);
    }
  }

  /* ---------- Role scramble ---------- */
  const ROLES = ["Flutter Developer", "Mobile Application Developer", ".NET MAUI Developer", "AI-Assisted Developer"];
  const roleEl = $("#roleText");
  roleEl.setAttribute("aria-hidden", "true");
  const roleSr = document.createElement("span");
  roleSr.className = "sr-only"; roleSr.textContent = ROLES.join(", ");
  roleEl.parentElement.appendChild(roleSr);
  function scramble(el, to) {
    const from = el.textContent, len = Math.max(from.length, to.length);
    const glyphs = "!<>-_\\/[]{}=+*^?#01";
    const q = [];
    for (let i = 0; i < len; i++) {
      const s = Math.floor(Math.random() * 8), e = s + 4 + Math.floor(Math.random() * 8);
      q.push({ f: from[i] || "", t: to[i] || "", s, e, ch: "" });
    }
    let frame = 0;
    const step = () => {
      let out = "", done = 0;
      for (const it of q) {
        if (frame >= it.e) { done++; out += it.t; }
        else if (frame >= it.s) {
          if (!it.ch || Math.random() < .3) it.ch = glyphs[Math.floor(Math.random() * glyphs.length)];
          out += it.ch;
        } else out += it.f;
      }
      el.textContent = out;
      if (done < q.length) { frame++; setTimeout(() => requestAnimationFrame(step), 30); }
    };
    step();
  }
  if (!reduced) {
    let ri = 0;
    setInterval(() => { if (heroOnScreen) { ri = (ri + 1) % ROLES.length; scramble(roleEl, ROLES[ri]); } }, 3000);
  }

  /* ---------- Hero dot field: redrawn only when the pointer moves ---------- */
  const field = $("#field");
  const fctx = field.getContext("2d");
  let FW = 0, FH = 0, fdots = [], fmx = -1e4, fmy = -1e4, frgb = "238,240,244", facc = "255,107,61", fRaf = 0;
  function readFieldColors() {
    frgb = getComputedStyle(root).getPropertyValue("--field").trim() || frgb;
    facc = effectiveTheme() === "dark" ? "255,107,61" : "212,66,26";
  }
  function sizeField() {
    const r = field.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    FW = r.width; FH = r.height;
    field.width = Math.round(FW * dpr); field.height = Math.round(FH * dpr);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fdots = [];
    const gap = FW < 700 ? 24 : 30;
    for (let y = gap / 2; y < FH; y += gap) for (let x = gap / 2; x < FW; x += gap) fdots.push(x, y);
  }
  function drawField() {
    fRaf = 0;
    fctx.clearRect(0, 0, FW, FH);
    fctx.fillStyle = `rgba(${frgb},.12)`;
    const near = [];
    for (let i = 0; i < fdots.length; i += 2) {
      const x = fdots[i], y = fdots[i + 1], dx = x - fmx, dy = y - fmy;
      if (dx * dx + dy * dy < 28900) near.push(x, y, dx, dy); else fctx.fillRect(x - 1, y - 1, 2, 2);
    }
    for (let i = 0; i < near.length; i += 4) {
      const [x, y, dx, dy] = near.slice(i, i + 4);
      const d = Math.sqrt(dx * dx + dy * dy), t = 1 - d / 170, off = t * 8 / (d || 1), s = 2 + t * 2.4;
      fctx.fillStyle = `rgba(${facc},${(.15 + t * .6).toFixed(2)})`;
      fctx.fillRect(x + dx * off - s / 2, y + dy * off - s / 2, s, s);
    }
  }
  const queueField = () => { if (!fRaf) fRaf = requestAnimationFrame(drawField); };
  readFieldColors(); sizeField(); drawField();
  if (finePointer && !reduced) {
    heroSec.addEventListener("pointermove", e => { const r = field.getBoundingClientRect(); fmx = e.clientX - r.left; fmy = e.clientY - r.top; queueField(); }, { passive: true });
    heroSec.addEventListener("pointerleave", () => { fmx = fmy = -1e4; queueField(); });
  }
  new MutationObserver(() => { readFieldColors(); queueField(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { heroOnScreen = en.isIntersecting; }).observe(heroSec);

  /* ---------- Sketchplay scheduler illustration ---------- */
  (() => {
    const MATCHES = [["A", "B"], ["C", "D"], ["E", "F"], ["A", "C"], ["B", "E"], ["D", "F"], ["A", "D"], ["B", "F"], ["C", "E"]];
    const BASE = ["6 PM", "7 PM", "8 PM", "9 PM"], EARLY = ["5 PM", "4 PM", "3 PM"];
    const RULES = {
      late: ["No games after 9 PM", "slot.start < 21:00"],
      rest: ["No back-to-back games", "no team plays in two adjacent slots"],
      court: ["Court 3 is closed", "court != 3"]
    };
    const state = { late: false, rest: false, court: false, extra: 0 };
    const gridEl = $("#schedGrid"), logEl = $("#schedLog"), statusEl = $("#schedStatus");
    const fixEl = $("#schedFix"), fixText = $("#schedFixText"), fixBtn = $("#schedFixBtn");
    let pendingFix = null;
    const slotsFor = extra => [...EARLY.slice(0, extra).reverse(), ...BASE];
    function solve(r) {
      const slots = slotsFor(r.extra);
      const grid = slots.map(s => [0, 1, 2].map(c => ((r.late && s === "9 PM") || (r.court && c === 2)) ? "x" : null));
      const busy = slots.map(() => new Set());
      let unplaced = 0;
      for (const [a, b] of MATCHES) {
        let placed = false;
        for (let s = 0; s < slots.length && !placed; s++) {
          if (busy[s].has(a) || busy[s].has(b)) continue;
          if (r.rest && [s - 1, s + 1].some(k => busy[k] && (busy[k].has(a) || busy[k].has(b)))) continue;
          for (let c = 0; c < 3; c++) {
            if (grid[s][c] === null) { grid[s][c] = `${a}–${b}`; busy[s].add(a); busy[s].add(b); placed = true; break; }
          }
        }
        if (!placed) unplaced++;
      }
      return { slots, grid, unplaced };
    }
    const slotPhrase = n => {
      const s = EARLY.slice(0, n).reverse();
      return n === 1 ? `open a ${s[0]} slot` : `open ${s.slice(0, -1).join(", ")} and ${s[s.length - 1]} slots`;
    };
    function findFix() {
      for (let e = state.extra + 1; e <= 3; e++) if (!solve({ ...state, extra: e }).unplaced) return { change: { extra: e }, text: slotPhrase(e) };
      if (state.court) for (let e = state.extra; e <= 3; e++) if (!solve({ ...state, court: false, extra: e }).unplaced)
        return { change: { court: false, extra: e }, text: "reopen Court 3" + (e > state.extra ? ` and ${slotPhrase(e)}` : "") };
      if (state.late) for (let e = state.extra; e <= 3; e++) if (!solve({ ...state, late: false, extra: e }).unplaced)
        return { change: { late: false, extra: e }, text: "allow 9 PM games" + (e > state.extra ? ` and ${slotPhrase(e)}` : "") };
      return { change: { rest: false }, text: "allow back-to-back games" };
    }
    const lines = arr => arr.map((l, i) => `<div class="lg" style="--d:${i * 120}ms">${l}</div>`).join("");
    function render(logLines) {
      const res = solve(state);
      let h = `<span></span><span class="hd">Court 1</span><span class="hd">Court 2</span><span class="hd">Court 3</span>`, n = 0;
      res.slots.forEach((s, si) => {
        h += `<span class="sl${si < state.extra ? " new" : ""}">${s}</span>`;
        res.grid[si].forEach(v => {
          const cls = v === "x" ? "cell x" : v ? "cell m" : "cell";
          h += `<span class="${cls} pop" style="--d:${n++ * 20}ms">${v && v !== "x" ? v : ""}</span>`;
        });
      });
      gridEl.innerHTML = h;
      const placed = MATCHES.length - res.unplaced;
      statusEl.textContent = res.unplaced ? `${res.unplaced} conflict${res.unplaced > 1 ? "s" : ""}` : "0 conflicts";
      statusEl.className = "sched-status " + (res.unplaced ? "bad" : "ok");
      const solveLine = `  <b>solve</b>      CP-SAT · ${placed}/${MATCHES.length} games placed` + (res.unplaced ? ` · <span class="acc">${res.unplaced} don't fit</span>` : ` · <span class="okc">0 conflicts</span>`);
      logEl.innerHTML = lines([...logLines, solveLine]);
      if (res.unplaced) { pendingFix = findFix(); fixText.textContent = `Suggested fix: ${pendingFix.text}.`; fixEl.hidden = false; }
      else { pendingFix = null; fixEl.hidden = true; }
      $$(".rule").forEach(b => b.setAttribute("aria-pressed", String(!!state[b.dataset.rule])));
    }
    $$(".rule").forEach(btn => btn.addEventListener("click", () => {
      const k = btn.dataset.rule;
      state[k] = !state[k];
      const [label, constraint] = RULES[k];
      render(state[k]
        ? [`› parse <b>"${label}"</b>`, `  <b>constraint</b> <span class="acc">${constraint}</span>`, `  <b>validate</b>   <span class="okc">ok · Pydantic</span>`]
        : [`› remove rule <b>"${label}"</b>`]);
    }));
    fixBtn.addEventListener("click", () => {
      if (!pendingFix) return;
      Object.assign(state, pendingFix.change);
      render([`› apply fix <b>"${pendingFix.text}"</b>`, `  <b>validate</b>   <span class="okc">ok · Pydantic</span>`]);
    });
    render([`› ready · <b>6 teams · 9 games · 3 courts</b>`, `  Add a rule above and watch the schedule change.`]);
  })();

  /* ---------- Skills explorer ---------- */
  (() => {
    const P = {
      fit: ["Fit Republik", "Gym & fitness app · Flutter", "#p-fit", "var(--flutter)"],
      bloomz: ["Bloomz", "School communication · Flutter", "#p-bloomz", "var(--flutter)"],
      speedy: ["Speedy Hire", "Equipment hire · Flutter", "#p-speedy", "var(--flutter)"],
      psi: ["PSI Access", "Process safety · .NET MAUI", "#p-psi", "var(--maui)"],
      sleep: ["SleepImage", "Home sleep testing · .NET MAUI", "#p-sleep", "var(--maui)"],
      sketch: ["Sketchplay AI Scheduler", "AI scheduling · Python", "#p-sketch", "var(--ai)"],
      s2v: ["Script-to-Video", "AI video pipeline · Python", "#p-s2v", "var(--ai)"],
      eventtan: ["Eventtan", "Daily work since Nov 2022", "#experience", "var(--accent)"],
      aimperior: ["Aimperior Technologies", "Native Android · 2022", "#experience", "var(--accent)"]
    };
    const GROUPS = [
      ["Mobile", [["Flutter", "fit bloomz speedy"], [".NET MAUI", "psi sleep"], ["Xamarin.Forms", "sleep"], ["Flutter Web", "bloomz"], ["Android", "fit bloomz speedy psi sleep aimperior"], ["iOS", "fit bloomz speedy psi sleep"]]],
      ["Languages", [["Dart", "fit bloomz speedy"], ["C#", "psi sleep"], ["XAML", "psi"], ["Python", "sketch s2v"], ["Java (Basic)", "aimperior"]]],
      ["Architecture & state", [["MVVM", "bloomz speedy psi eventtan"], ["Riverpod", "bloomz speedy eventtan"], ["Bloc", ""], ["Provider", ""], ["Clean Architecture", ""], ["Repository Pattern", "psi"], ["Dependency Injection", "psi"], ["Freezed", "bloomz"]]],
      ["Backend & data", [["REST APIs", "fit bloomz speedy psi aimperior"], ["Dio", "bloomz"], ["WebSocket", "bloomz"], ["Firebase", "fit bloomz psi"], ["Cloud Firestore", "psi"], ["Firebase Cloud Messaging", "fit bloomz"], ["Firebase Crashlytics", "eventtan"], ["Firebase Analytics", "eventtan"], ["SQLite", "psi"], ["Hive", "bloomz"], ["Offline Sync", "psi sleep"], ["MongoDB", ""], ["AWS S3", "bloomz"], ["Google Cloud Storage", "psi"], ["Couchbase", "psi"]]],
      ["Platform features", [["Push Notifications", "fit bloomz"], ["Deep Linking", "fit"], ["Google Maps", "speedy"], ["Google ML Kit (OCR)", "fit"], ["Bluetooth Low Energy", "sleep"], ["Background Services", "bloomz sleep"], ["Method Channels", ""], ["Localization & RTL", "bloomz"], ["SSO", "bloomz"], ["Role-Based Access", "bloomz"]]],
      ["AI & LLM", [["LangGraph", "sketch"], ["LangChain", "sketch"], ["RAG", "sketch"], ["Qdrant", "sketch"], ["Claude API", "sketch"], ["OpenAI API", "sketch"], ["Gemini API", "sketch"], ["OR-Tools (CP-SAT)", "sketch"], ["Pydantic", "sketch"], ["AI Agents", "sketch s2v"], ["Text-to-Speech", "s2v"]]],
      ["AI dev tools", [["Claude Code", "eventtan"], ["Codex", "eventtan"], ["Antigravity", "eventtan"], ["Qoder", "eventtan"], ["OpenCode", "eventtan"]]],
      ["Tools & process", [["Git", "eventtan"], ["CI/CD", "eventtan"], ["Android Studio", "eventtan aimperior"], ["VS Code", "eventtan"], ["Xcode", "eventtan"], ["App Store & Google Play Deployment", "bloomz psi eventtan"], ["Unit Testing", "eventtan"], ["Integration Testing", "eventtan"], ["Agile / Scrum", "eventtan"]]]
    ];
    const wrap = $("#skillGroups");
    let total = 0, html = "";
    GROUPS.forEach(([g, items], gi) => {
      total += items.length;
      html += `<div class="sg" data-reveal><h3><span class="sg-idx">${pad(gi + 1)}</span>${g}<span class="sg-count">${items.length} skills</span></h3><div class="sg-chips">` +
        items.map(([name], ii) => `<button class="skill" type="button" aria-pressed="false" data-g="${gi}" data-i="${ii}">${name}</button>`).join("") +
        `</div></div>`;
    });
    wrap.innerHTML = html;
    $("#skillCount").textContent = total;
    const spGroup = $("#spGroup"), spName = $("#spName"), spSub = $("#spSub"), spList = $("#spList");
    function select(btn) {
      $$(".skill", wrap).forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      const [g, items] = GROUPS[+btn.dataset.g];
      const [name, ev] = items[+btn.dataset.i];
      const keys = ev ? ev.split(" ") : [];
      spGroup.textContent = `${pad(+btn.dataset.g + 1)} · ${g}`;
      spName.textContent = name;
      const projCount = keys.filter(k => k !== "eventtan" && k !== "aimperior").length;
      spSub.textContent = keys.length
        ? (projCount ? `Used in ${projCount} project${projCount > 1 ? "s" : ""}` : "Used in my daily work")
        : "Part of my toolkit. Happy to discuss it in an interview.";
      spList.innerHTML = keys.map((k, i) => `<li><a href="${P[k][2]}" style="--tone:${P[k][3]};--d:${i * 45}ms"><i></i><b>${P[k][0]}</b><small>${P[k][1]}</small><svg><use href="#i-arrow"/></svg></a></li>`).join("");
    }
    wrap.addEventListener("click", e => { const b = e.target.closest(".skill"); if (b) select(b); });
    select($(".skill", wrap));
  })();

  /* ---------- Reveal on scroll + counters ---------- */
  if (!reduced && "IntersectionObserver" in window) {
    const rio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); }
    }), { rootMargin: "0px 0px 100px 0px" });
    const vh = innerHeight;
    $$("[data-reveal]").forEach(el => {
      if (el.getBoundingClientRect().top <= vh + 100) return;
      const sibs = Array.from(el.parentElement.children).filter(c => c.hasAttribute("data-reveal"));
      el.style.setProperty("--rd", `${Math.min(sibs.indexOf(el), 3) * 60}ms`);
      rio.observe(el);
    });
    const countUp = el => {
      const target = parseInt(el.textContent, 10);
      if (!target) return;
      const t0 = performance.now(), dur = 1200;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { cio.unobserve(e.target); countUp(e.target); } }), { threshold: .6 });
    $$("[data-count]").forEach(el => { if (el.getBoundingClientRect().top > vh) cio.observe(el); });
  }

  /* ---------- Scroll: progress, nav, timeline (all reads, then all writes) ---------- */
  const navWrap = $("#navWrap"), progressBar = $("#progressBar"), timeline = $("#timeline");
  const tlItems = $$(".tl-item", timeline);
  const tlFill = $(".tl-fill", timeline);
  function onScroll() {
    const sy = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const tr = timeline.getBoundingClientRect();
    const tops = tlItems.map(it => it.getBoundingClientRect().top);
    const mid = vh * .6;
    progressBar.style.setProperty("--p", max > 0 ? (sy / max).toFixed(4) : 0);
    navWrap.classList.toggle("scrolled", sy > 24);
    if (tr.top < vh && tr.bottom > 0) tlFill.style.transform = `scaleY(${Math.min(1, Math.max(0, (mid - tr.top) / tr.height)).toFixed(3)})`;
    tlItems.forEach((it, i) => it.classList.toggle("passed", tops[i] + 20 < mid));
  }
  let scrollRaf = 0;
  addEventListener("scroll", () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; onScroll(); }); }, { passive: true });
  onScroll();

  const flowEl = $(".flow");
  const sizeFlow = () => { if (flowEl) flowEl.style.setProperty("--run", `${Math.max(0, flowEl.clientWidth - 10)}px`); };
  sizeFlow();
  let resizeT = 0;
  addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { sizeField(); drawField(); sizeFlow(); onScroll(); movePill($(".nav-links a.active")); }, 150);
  });

  /* active nav link + sliding pill */
  const pill = $(".nav-pill");
  function movePill(a) {
    if (!a || !a.offsetWidth) { pill.style.opacity = 0; return; }
    pill.style.opacity = 1;
    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  const navLinks = $$(".nav-links a");
  if ("IntersectionObserver" in window) {
    const sio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id === "awards" ? "skills" : e.target.id;
      let active = null;
      navLinks.forEach(a => { const on = a.getAttribute("href") === "#" + id; a.classList.toggle("active", on); if (on) active = a; });
      movePill(active);
    }), { rootMargin: "-45% 0px -50% 0px" });
    ["top", "about", "work", "ai", "experience", "skills", "awards", "contact"].forEach(id => { const s = document.getElementById(id); if (s) sio.observe(s); });
  }

  /* ---------- Spotlight, magnetic buttons, cursor ---------- */
  if (finePointer && !reduced) {
    let spotRaf = 0, sx = 0, sy = 0, spotEl = null;
    document.addEventListener("pointermove", e => {
      spotEl = e.target.closest && e.target.closest(".spot");
      sx = e.clientX; sy = e.clientY;
      if (spotEl && !spotRaf) spotRaf = requestAnimationFrame(() => {
        spotRaf = 0;
        if (!spotEl) return;
        const r = spotEl.getBoundingClientRect();
        spotEl.style.setProperty("--mx", `${sx - r.left}px`);
        spotEl.style.setProperty("--my", `${sy - r.top}px`);
      });
    }, { passive: true });

    $$(".magnetic").forEach(b => {
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * .2).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * .28).toFixed(1)}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });

    const cur = $("#cursor");
    let x = -100, y = -100, cx = -100, cy = -100, running = false;
    const loop = () => {
      cx += (x - cx) * .22; cy += (y - cy) * .22;
      cur.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      if (Math.abs(x - cx) + Math.abs(y - cy) > .3) requestAnimationFrame(loop); else running = false;
    };
    addEventListener("pointermove", e => {
      x = e.clientX; y = e.clientY;
      if (!cur.classList.contains("on")) { cx = x; cy = y; cur.classList.add("on"); }
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.addEventListener("pointerover", e => {
      cur.classList.toggle("hover", !!(e.target.closest && e.target.closest("a, button, input, .skill, .rule")));
    });
    document.documentElement.addEventListener("pointerleave", () => cur.classList.remove("on"));
  }

  /* ---------- Resume: preview + download ---------- */
  const rv = $("#resumeView");
  let rvLastFocus = null;
  function openPreview() {
    if (!menu.hidden) setMenu(false);
    if (!rv.hidden) return;
    rvLastFocus = document.activeElement;
    rv.hidden = false;
    document.body.style.overflow = "hidden";
    $("#rvClose").focus();
  }
  function closePreview() {
    if (rv.hidden) return;
    rv.hidden = true;
    document.body.style.overflow = "";
    if (rvLastFocus && rvLastFocus.focus) rvLastFocus.focus();
  }
  $$("[data-resume-preview]").forEach(b => b.addEventListener("click", openPreview));
  $("#rvClose").addEventListener("click", closePreview);
  $("[data-rv-close]").addEventListener("click", closePreview);

  // A normal host serves the PDF and the browser downloads it. Inside the claude.ai viewer,
  // the "downloads" capability saves it instead (the viewer asks the visitor to confirm).
  let resumeOK = true, dlCap = null, pdfBlob = null;
  if (location.protocol !== "file:") {
    fetch(RESUME, { method: "HEAD", cache: "no-store" }).then(r => { resumeOK = r.ok; }).catch(() => { resumeOK = false; });
  }
  try {
    if (window.claude && typeof window.claude.use === "function") {
      window.claude.use("downloads").then(d => { dlCap = d; }).catch(() => { dlCap = null; });
    }
  } catch (e) { dlCap = null; }
  const notAvailable = () => { openPreview(); toast("The PDF can't be downloaded in this viewer, so here is the preview. Email me for a copy."); };
  async function downloadResume(e) {
    if (dlCap) {
      e.preventDefault();
      try {
        if (!pdfBlob) {
          const r = await fetch(RESUME);
          if (!r.ok) throw { code: "missing" };
          pdfBlob = await r.blob();
        }
        await dlCap.save({ filename: RESUME, data: pdfBlob });
        toast("Resume saved");
      } catch (err) {
        if (err && err.code === "declined") return;
        if (err && err.code === "rate_limited") { toast("A save prompt is already open."); return; }
        notAvailable();
      }
      return;
    }
    if (!resumeOK) { e.preventDefault(); notAvailable(); }
  }
  $$(".resume-dl").forEach(a => a.addEventListener("click", downloadResume));

  /* ---------- Mobile menu ---------- */
  const menu = $("#mobileMenu"), menuOpen = $("#menuOpen"), menuClose = $("#menuClose");
  function setMenu(open) {
    menu.hidden = !open;
    menuOpen.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) menuClose.focus(); else menuOpen.focus();
  }
  menuOpen.addEventListener("click", () => setMenu(true));
  menuClose.addEventListener("click", () => setMenu(false));
  $$("ul a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Command palette ---------- */
  const cmdk = $("#cmdk"), cmdInput = $("#cmdkInput"), cmdList = $("#cmdkList");
  const go = sel => { const t = document.querySelector(sel); if (t) t.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); };
  const openLink = (href, blank) => {
    const a = document.createElement("a");
    a.href = href;
    if (blank) { a.target = "_blank"; a.rel = "noopener"; }
    document.body.appendChild(a); a.click(); a.remove();
  };
  const COMMANDS = [
    { g: "Resume", label: "Download Resume (PDF)", icon: "i-download", run: () => $(".resume-dl").click() },
    { g: "Resume", label: "Preview Resume", icon: "i-eye", run: openPreview },
    { g: "Sections", label: "Professional summary", icon: "i-arrow", run: () => go("#about") },
    { g: "Sections", label: "Key projects", icon: "i-arrow", run: () => go("#work") },
    { g: "Sections", label: "AI & LLM projects", icon: "i-arrow", run: () => go("#ai") },
    { g: "Sections", label: "Work experience", icon: "i-arrow", run: () => go("#experience") },
    { g: "Sections", label: "Technical skills", icon: "i-arrow", run: () => go("#skills") },
    { g: "Sections", label: "Awards & recognition", icon: "i-arrow", run: () => go("#awards") },
    { g: "Sections", label: "Contact", icon: "i-arrow", run: () => go("#contact") },
    { g: "Projects", label: "Fit Republik", hint: "Flutter", icon: "i-device", run: () => go("#p-fit") },
    { g: "Projects", label: "Bloomz", hint: "Flutter", icon: "i-device", run: () => go("#p-bloomz") },
    { g: "Projects", label: "Speedy Hire", hint: "Flutter", icon: "i-device", run: () => go("#p-speedy") },
    { g: "Projects", label: "PSI Access", hint: ".NET MAUI", icon: "i-device", run: () => go("#p-psi") },
    { g: "Projects", label: "SleepImage", hint: ".NET MAUI", icon: "i-device", run: () => go("#p-sleep") },
    { g: "Projects", label: "Sketchplay AI Scheduler", hint: "Python · LLM", icon: "i-device", run: () => go("#p-sketch") },
    { g: "Projects", label: "Script-to-Video AI Platform", hint: "Python · AI", icon: "i-device", run: () => go("#p-s2v") },
    { g: "Contact", label: "Copy email address", hint: EMAIL, icon: "i-copy", run: () => copyText(EMAIL, "Email address") },
    { g: "Contact", label: "Copy phone number", hint: "+91 70417 77284", icon: "i-phone", run: () => copyText("+91 70417 77284", "Phone number") },
    { g: "Contact", label: "Open LinkedIn profile", icon: "i-linkedin", run: () => openLink(LINKEDIN, true) },
    { g: "Settings", label: "Switch light / dark theme", icon: "i-moon", run: () => toggleTheme() }
  ];
  let results = [], sel = 0, lastFocus = null;
  function renderCmd() {
    const q = cmdInput.value.trim().toLowerCase();
    results = COMMANDS.filter(c => !q || `${c.g} ${c.label} ${c.hint || ""}`.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, results.length - 1));
    if (!results.length) { cmdList.innerHTML = `<li class="cmdk-empty">No match for "${q.replace(/[<>&"]/g, "")}". Try "flutter", "resume" or "skills".</li>`; return; }
    let h = "", lastG = "";
    results.forEach((c, i) => {
      if (c.g !== lastG) { h += `<li class="cmdk-group" role="presentation">${c.g}</li>`; lastG = c.g; }
      h += `<li class="cmdk-item" role="option" id="cmd-${i}" data-i="${i}" aria-selected="${i === sel}"><svg><use href="#${c.icon}"/></svg><span>${c.label}</span>${c.hint ? `<small>${c.hint}</small>` : ""}</li>`;
    });
    cmdList.innerHTML = h;
    cmdInput.setAttribute("aria-activedescendant", `cmd-${sel}`);
    const act = $(`#cmd-${sel}`);
    if (act) act.scrollIntoView({ block: "nearest" });
  }
  function openCmd() {
    if (!cmdk.hidden) return;
    lastFocus = document.activeElement;
    cmdk.hidden = false; cmdInput.value = ""; sel = 0; renderCmd();
    document.body.style.overflow = "hidden";
    setTimeout(() => cmdInput.focus(), 10);
  }
  function closeCmd() {
    if (cmdk.hidden) return;
    cmdk.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function runCmd(i) {
    const c = results[i];
    if (!c) return;
    closeCmd();
    setTimeout(() => c.run(), 30);
  }
  cmdInput.addEventListener("input", () => { sel = 0; renderCmd(); });
  cmdInput.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, results.length); renderCmd(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + results.length) % Math.max(1, results.length); renderCmd(); }
    else if (e.key === "Enter") { e.preventDefault(); runCmd(sel); }
    else if (e.key === "Tab") { e.preventDefault(); }
  });
  cmdList.addEventListener("click", e => { const it = e.target.closest(".cmdk-item"); if (it) runCmd(+it.dataset.i); });
  cmdList.addEventListener("pointermove", e => {
    const it = e.target.closest(".cmdk-item");
    if (it && +it.dataset.i !== sel) { sel = +it.dataset.i; $$(".cmdk-item", cmdList).forEach(x => x.setAttribute("aria-selected", String(+x.dataset.i === sel))); }
  });
  $(".cmdk-backdrop").addEventListener("click", closeCmd);
  document.addEventListener("keydown", e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmdk.hidden ? openCmd() : closeCmd(); }
    else if (e.key === "/" && !typing && cmdk.hidden && rv.hidden) { e.preventDefault(); openCmd(); }
    else if (e.key === "Escape") {
      if (!cmdk.hidden) closeCmd();
      else if (!rv.hidden) closePreview();
      else if (!menu.hidden) setMenu(false);
    }
  });

  try {
    console.log("%cHi, I'm Parth", "font:700 20px system-ui;color:#FF6B3D");
    console.log("%cHiring a Flutter or mobile developer? Write to " + EMAIL, "font:14px system-ui");
  } catch (e) { /* console unavailable */ }
})();
