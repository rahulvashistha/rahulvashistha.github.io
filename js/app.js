/* Renders every page from SITE (the data/ files). Layout only; no content lives here. */
(function(){
"use strict";
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const C = window.Charts, esc = C.esc;

/* ---------- data check ---------- */
const NEED = { profile: "profile.js", projects: "projects.js", mocks: "mocks.js", timeline: "timeline.js", yearbook: "yearbook.js", personal: "personal.js", releases: "releases.js", freebies: "freebies.js" };
const missing = Object.keys(NEED).filter(k => !SITE[k]).map(k => NEED[k]);
const bad = [...new Set([...(window.__dataErrors || []), ...missing])];
if (bad.length) $("#banner-slot").innerHTML = `<div class="banner" role="alert">A data file didn’t load: ${bad.map(esc).join(", ")}. Check it for a missing comma, bracket or quote mark.</div>`;
const P = SITE.profile || {}, PROJ = SITE.projects || [], TL = SITE.timeline || [], YB = SITE.yearbook || {}, PER = SITE.personal || {};

/* ---------- helpers ---------- */
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtDate = d => { if (!d) return ""; const [y, m] = d.split("-"); return m ? `${MON[+m - 1]} ${y}` : y; };
const yearOf = d => d ? +d.slice(0, 4) : null;
const byDateDesc = (a, b) => (b.date || "").localeCompare(a.date || "");
const ICON = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/></svg>',
  info: '<svg class="kpi-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h12m-5-5 5 5-5 5"/><path d="M20 5v14"/></svg>',
  fwd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 12H5m6-6-6 6 6 6"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4-2v-4z"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h2v14H7zM20 5v14L10 12z"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 5h2v14h-2zM4 5v14l10-7z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'
};
const STAGE = { problem: "Problem", approach: "Approach", build: "What I built", result: "Result", start: "Chapter", learn: "Chapter", next: "Coming up" };
const projById = id => PROJ.find(p => p.id === id);
const TIPS = {};

/* ---------- derived data ---------- */
const CERTS = TL.filter(x => x.type === "cert" && x.tier === "certification").sort(byDateDesc);
const COURSES = TL.filter(x => x.type === "cert" && x.tier === "course").sort(byDateDesc);
const ASSESS = TL.filter(x => x.type === "cert" && x.tier === "assessment").sort(byDateDesc);
const TODAY = new Date().toISOString().slice(0, 10);
const validity = c => !c.expires ? "" : (c.expires >= TODAY ? `Valid until <b>${fmtDate(c.expires)}</b>` : `Expired <b>${fmtDate(c.expires)}</b>`);
const MILES = TL.filter(x => x.type === "milestone");
const PHOTOS = TL.filter(x => x.type === "photo" && x.image).sort(byDateDesc);

/* ---------- title bar ---------- */
$("#tb-name").textContent = P.name || "";
$("#tb-meta").textContent = P.refreshed || "";
$("#tb-meta").setAttribute("title", "Refresh history");
if (P.contact) {
  $("#tb-email").href = `mailto:${P.contact.email}`;
  $("#tb-linkedin").href = P.contact.linkedin;
  $("#tb-resume").href = P.contact.resume;
}

/* ---------- themes ---------- */
const THEMES = [
  { id: "classic", name: "Classic", desc: "The report default", mode: "light", sw: ["#E9EDF1", "#13618A", "#3FA7A3", "#E3A72F"] },
  { id: "night", name: "Night shift", desc: "Dark, for late refreshes", mode: "dark", sw: ["#10151B", "#4BA3D1", "#4FC1BB", "#E8B248"] },
  { id: "court", name: "Court", desc: "Badminton green", mode: "light", sw: ["#E4EEE7", "#1E7A4C", "#3895AE", "#E9B92E"] },
  { id: "sakura", name: "Sakura night", desc: "For anime marathons", mode: "dark", sw: ["#16111A", "#F28DB2", "#8CC8E6", "#FFD27A"] }
];
const PAIR = { classic: "night", night: "classic", court: "sakura", sakura: "court" };
const store = { get(k){ try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v){ try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} } };
function currentTheme(){ return document.documentElement.getAttribute("data-theme") || "classic"; }
function applyTheme(id, save){
  document.documentElement.setAttribute("data-theme", id);
  if (save) store.set("rv-theme", id);
  const t = THEMES.find(x => x.id === id) || THEMES[0];
  $("#mode-btn").innerHTML = t.mode === "dark" ? ICON.sun : ICON.moon;
  $("#mode-btn").setAttribute("aria-label", t.mode === "dark" ? "Switch to light theme" : "Switch to dark theme");
  renderThemeMenu();
}
function renderThemeMenu(){
  const cur = currentTheme(), saved = store.get("rv-theme");
  $("#theme-menu").innerHTML = `<h3>Theme</h3><p>Like a report theme: same layout, different palette.</p>
    <div class="theme-grid" role="radiogroup" aria-label="Themes">${THEMES.map(t => `<button type="button" class="theme-opt" role="radio" aria-checked="${t.id === cur}" data-theme-id="${t.id}">
      <span class="theme-sw">${t.sw.map(c => `<i style="background:${c}"></i>`).join("")}</span><b>${esc(t.name)}</b><span>${esc(t.desc)}</span></button>`).join("")}</div>
    <label class="theme-sys"><input type="checkbox" id="theme-sys" ${saved ? "" : "checked"}> Match my device (light or dark)</label>`;
}
$("#mode-btn").addEventListener("click", () => applyTheme(PAIR[currentTheme()] || "classic", true));
$("#theme-btn").addEventListener("click", e => { const m = $("#theme-menu"), open = m.hidden; m.hidden = !open; e.currentTarget.setAttribute("aria-expanded", open); });
$("#theme-menu").addEventListener("click", e => { const b = e.target.closest("[data-theme-id]"); if (b) applyTheme(b.dataset.themeId, true); });
$("#theme-menu").addEventListener("change", e => {
  if (e.target.id !== "theme-sys") return;
  if (e.target.checked) { store.set("rv-theme", null); applyTheme(matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "classic", false); }
  else store.set("rv-theme", currentTheme());
});
document.addEventListener("click", e => { if (!e.target.closest(".theme-wrap")) { $("#theme-menu").hidden = true; $("#theme-btn").setAttribute("aria-expanded", "false"); } });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => { if (!store.get("rv-theme")) applyTheme(e.matches ? "night" : "classic", false); });
applyTheme(currentTheme(), false);

/* ---------- tooltips (report-page style) ---------- */
const tip = $("#tip"); let tipFor = null;
function showTip(el){
  const t = TIPS[el.dataset.tip]; if (!t) return;
  tip.innerHTML = `<h4>${esc(t.title)}</h4>${t.rows && t.rows.length ? `<dl>${t.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>` : ""}${t.note ? `<p>${esc(t.note)}</p>` : ""}`;
  tip.hidden = false; tipFor = el;
  const r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = Math.min(Math.max(12, r.left + r.width / 2 - tw / 2), innerWidth - tw - 12), y = r.bottom + 8;
  if (y + th > innerHeight - 60) y = Math.max(12, r.top - th - 8);
  tip.style.left = x + "px"; tip.style.top = y + "px";
  el.setAttribute("aria-describedby", "tip");
}
function hideTip(){ if (tipFor) tipFor.removeAttribute("aria-describedby"); tip.hidden = true; tipFor = null; }
document.addEventListener("pointerover", e => { const el = e.target.closest("[data-tip]"); if (el && e.pointerType === "mouse") showTip(el); });
document.addEventListener("pointerout", e => { const el = e.target.closest("[data-tip]"); if (el && e.pointerType === "mouse" && !el.contains(e.relatedTarget)) hideTip(); });
document.addEventListener("focusin", e => { const el = e.target.closest("[data-tip]"); if (el) showTip(el); });
document.addEventListener("focusout", e => { if (e.target.closest("[data-tip]")) hideTip(); });
document.addEventListener("click", e => { const el = e.target.closest("[data-tip]"); if (el) { tipFor === el ? hideTip() : showTip(el); } else if (!e.target.closest(".tip")) hideTip(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { hideTip(); $("#theme-menu").hidden = true; } });
addEventListener("scroll", hideTip, { passive: true });

function kpiButton(k, key){
  if (k.tip) TIPS[key] = k.tip;
  return k.tip ? `<button type="button" class="kpi" data-tip="${key}" aria-label="${esc(k.v + " " + k.l)}. Show source">${ICON.info}<span class="kpi-v num">${esc(k.v)}</span><span class="kpi-l">${esc(k.l)}</span></button>`
    : `<div class="kpi"><div class="kpi-v num">${esc(k.v)}</div><div class="kpi-l">${esc(k.l)}</div></div>`;
}

/* ---------- interactive mocks ---------- */
const MSTATE = new Map(); let mockSeq = 0;
function mockMount(key){ const id = `mock-${++mockSeq}`; MSTATE.set(id, { key, page: SITE.mocks[key].start || 0, t: {} }); const sk = SITE.mocks[key].skin; return `<div class="mock${sk ? ` skin-${sk}` : ""}" id="${id}">${C.mock(key, MSTATE.get(id))}</div>`; }
document.addEventListener("click", e => {
  const b = e.target.closest("[data-mpage],[data-mtog]"); if (!b) return;
  const host = b.closest(".mock"), st = MSTATE.get(host && host.id); if (!st) return;
  if (b.dataset.mpage) st.page = +b.dataset.mpage; else st.t[b.dataset.mtog] = +b.dataset.mval;
  host.innerHTML = C.mock(st.key, st);
  const again = host.querySelector(b.dataset.mpage ? `[data-mpage="${b.dataset.mpage}"]` : `[data-mtog="${b.dataset.mtog}"][data-mval="${b.dataset.mval}"]`);
  if (again) again.focus();
});
function projectVisual(p){
  if (p.visual.mock) return mockMount(p.visual.mock);
  return `${C.flow(p.visual.flow)}<p class="flow-cap">${esc(p.visual.caption)}</p>`;
}

/* ---------- story mode ---------- */
const CHAPTERS = (() => {
  const order = [...PROJ].sort((a, b) => a.years[0] - b.years[0] || a.years[1] - b.years[1]);
  const ch = [];
  if (P.prologue) ch.push({ id: P.prologue.id, kicker: P.prologue.kicker, title: P.prologue.title, frames: P.prologue.frames });
  order.forEach(p => ch.push({ id: p.id, kicker: `${p.period}, ${p.client}`, title: p.title, frames: p.story, project: true }));
  if (P.epilogue) ch.push({ id: P.epilogue.id, kicker: P.epilogue.kicker, title: P.epilogue.title, frames: P.epilogue.frames });
  return ch;
})();
const FRAMES = CHAPTERS.flatMap((c, ci) => c.frames.map((f, fi) => ({ ci, fi, f })));
let fIdx = 0, playing = null;
function storyHTML(){
  return `<div class="story" id="story" tabindex="-1">
    <div class="story-stage" aria-live="polite" id="story-stage"></div>
    <div class="story-bar">
      <div class="story-ctrl">
        <button type="button" id="st-prev" aria-label="Previous frame">${ICON.prev}</button>
        <button type="button" id="st-play" class="play" aria-label="Play story">${ICON.play}</button>
        <button type="button" id="st-next" aria-label="Next frame">${ICON.next}</button>
      </div>
      <div class="scrub" id="st-scrub">${CHAPTERS.map((c, ci) => `<div class="scrub-ch" style="--n:${c.frames.length}">${c.frames.map((_, fi) => `<button type="button" data-frame="${FRAMES.findIndex(x => x.ci === ci && x.fi === fi)}" aria-label="${esc(c.title)}, frame ${fi + 1}"></button>`).join("")}</div>`).join("")}</div>
      <span class="story-count num" id="st-count"></span>
    </div>
    <div class="story-chapters" id="st-chapters">${CHAPTERS.map((c, ci) => `<button type="button" data-chapter="${ci}">${esc(c.title)}</button>`).join("")}</div>
  </div>`;
}
function drawFrame(animate){
  const { ci, fi, f } = FRAMES[fIdx], c = CHAPTERS[ci], [stage, head, body] = f;
  const story = $("#story"); if (!story) return;
  $("#story-stage").innerHTML = `<div class="story-art"><span class="story-stamp">${esc(c.kicker.split(",")[0])}</span>${C.sketch(stage)}</div>
    <div class="story-copy"><p class="story-chapter"><b>${esc(c.title)}</b></p>
      <span class="story-stagename">${esc(STAGE[stage] || "")}</span>
      <h3>${esc(head)}</h3><p class="body">${esc(body)}</p>
      ${c.project ? `<div class="story-open"><a class="btn" href="#case-${c.id}">Open the case study</a></div>` : ""}</div>`;
  story.classList.remove("is-drawing"); if (animate) { void story.offsetWidth; story.classList.add("is-drawing"); }
  $$("#st-scrub button").forEach((b, i) => { b.classList.toggle("on", i === fIdx); b.classList.toggle("done", i < fIdx); b.setAttribute("aria-current", i === fIdx ? "step" : "false"); });
  $$("#st-chapters button").forEach((b, i) => b.setAttribute("aria-current", i === ci ? "true" : "false"));
  $("#st-count").textContent = `${fIdx + 1} / ${FRAMES.length}`;
}
function go(i, animate = true){ fIdx = Math.max(0, Math.min(FRAMES.length - 1, i)); drawFrame(animate); }
function stop(){ if (playing) { clearInterval(playing); playing = null; } const b = $("#st-play"); if (b) { b.innerHTML = ICON.play; b.setAttribute("aria-label", "Play story"); } }
function play(){
  if (fIdx >= FRAMES.length - 1) go(0);
  playing = setInterval(() => { if (fIdx >= FRAMES.length - 1) return stop(); go(fIdx + 1); }, 5200);
  $("#st-play").innerHTML = ICON.pause; $("#st-play").setAttribute("aria-label", "Pause story");
}
function wireStory(){
  $("#st-prev").onclick = () => { stop(); go(fIdx - 1); };
  $("#st-next").onclick = () => { stop(); go(fIdx + 1); };
  $("#st-play").onclick = () => playing ? stop() : play();
  $("#st-scrub").onclick = e => { const b = e.target.closest("[data-frame]"); if (b) { stop(); go(+b.dataset.frame); } };
  $("#st-chapters").onclick = e => { const b = e.target.closest("[data-chapter]"); if (b) { stop(); go(FRAMES.findIndex(x => x.ci === +b.dataset.chapter)); } };
  $("#story").addEventListener("keydown", e => { if (e.key === "ArrowRight") { stop(); go(fIdx + 1); } if (e.key === "ArrowLeft") { stop(); go(fIdx - 1); } });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  go(0, false);
}

/* ---------- PROFESSIONAL ---------- */
function fixCard(f, p){ return `<article class="rc">${p ? `<p class="rc-from"><a href="#case-${p.id}">${esc(p.title)}</a></p>` : ""}<h3>${esc(f.title)}</h3>
  <ol><li><b>Symptom</b><span>${esc(f.symptom)}</span></li><li><b>Cause</b><span>${esc(f.cause)}</span></li><li><b>Fix</b><span>${esc(f.fix)}</span></li><li class="proof"><b>Proof</b><span>${esc(f.proof)}</span></li></ol></article>`; }
function renderProfessional(){
  const el = $("#professional"); if (!P.name) return;
  const allFixes = PROJ.flatMap(p => (p.fixes || []).map(f => [f, p]));
  el.innerHTML = `
  <div class="hero">
    <div class="visual hero-main${P.headshot ? " with-photo" : ""}">
      <div class="hero-copy">
        <h1>${esc(P.name)}</h1><p class="role">${esc(P.role)}</p><p class="lede">${esc(P.lede)}</p>
        <ul class="facts">${P.facts.map(([i, t]) => `<li>${ICON[i] || ""}${esc(t)}</li>`).join("")}</ul>
        <div class="hero-cta"><a class="btn btn-primary" href="#story-section" data-scroll>Watch my story</a><a class="btn" href="#work" data-scroll>See my work</a><a class="btn" href="${esc(P.contact.resume)}" download>Download résumé</a></div>
      </div>
      ${P.headshot ? `<figure class="duo"><img src="${esc(P.headshot)}" alt="Portrait of ${esc(P.name)}" width="900" height="933"></figure>` : ""}
    </div>
    <div class="kpis" aria-label="Career highlights. Hover, focus or tap a card to see its source.">${P.kpis.map((k, i) => kpiButton(k, "k" + i)).join("")}</div>
  </div>

  <section id="story-section"><h2 class="section">Story mode</h2>
  <p class="section-sub">My work, frame by frame: the problem, the approach, what I built and what changed. Press play or step through it.</p>
  ${storyHTML()}</section>

  <h2 class="section" id="work">Selected work</h2>
  <p class="section-sub">Open any project for the full case study: an interactive recreated report, the model behind it, and the fixes along the way.</p>
  <div class="slicer-wrap"><span class="slicer-label" id="sl-label">Filter by skill</span>
    <div class="slicer" id="slicer" role="group" aria-labelledby="sl-label">${P.skillSlicer.map((s, i) => `<button type="button" aria-pressed="${i === 0}" data-v="${esc(s)}">${esc(s)}</button>`).join("")}</div>
    <span class="slicer-count" id="sl-count" aria-live="polite"></span></div>
  <div class="cards" id="cards">${PROJ.map(p => `<a class="card" href="#case-${p.id}" data-filters="${esc(p.filters.join("|"))}">
    ${p.cover ? `<div class="card-cover"><img src="${esc(p.cover)}" alt="" loading="lazy"></div>` : ""}
    <p class="card-client">${esc(p.client)}</p><h3>${esc(p.title)}</h3>
    <div class="card-kpi"><b class="num">${esc(p.card.v)}</b><span>${esc(p.card.l)}</span></div>
    <p>${esc(p.card.summary)}</p><span class="card-go">Open case study ${ICON.open}</span></a>`).join("")}</div>

  <h2 class="section" id="root-cause">Root-cause files</h2>
  <p class="section-sub">Most of the work isn’t building the report. It’s finding out why a number is wrong or a page is slow. Here’s the symptom: can you guess the cause?</p>
  ${gameHTML(allFixes)}

  <h2 class="section">How I work</h2>
  <p class="section-sub">The rules I hold myself to on every project, each one learned on a real engagement.</p>
  <div class="principles">${P.principles.map(([h, t]) => `<div class="visual principle"><h4>${esc(h)}</h4><p>${esc(t)}</p></div>`).join("")}</div>
  ${freebiesHTML()}

  <h2 class="section">Experience and credentials</h2>
  <p class="section-sub">Where I’ve worked, who I’ve worked for, and the certifications behind it.</p>
  <div class="two-col">
    <div class="visual"><h3 class="v-title">Career timeline</h3><p class="v-sub">Most recent first</p>
      <ol class="timeline">${P.career.map(t => `<li class="${t.now ? "now" : ""}"><div class="t-when">${esc(t.when)}</div><div class="t-what">${esc(t.what)}</div><div class="t-where">${esc(t.where)}</div>${t.sub && t.sub.length ? `<ul class="t-sub">${t.sub.map(([w, x]) => `<li><b>${esc(w)}</b>${esc(x)}</li>`).join("")}</ul>` : ""}</li>`).join("")}</ol></div>
    <div class="visual"><h3 class="v-title">Certifications</h3><p class="v-sub">${CERTS.length} certifications. The full collection is in the <a href="#hall-of-fame">Hall of Fame</a>.</p>
      <ul class="mini-certs">${CERTS.map(c => `<li><b>${esc(c.code)}</b><span>${esc(c.title)}</span></li>`).join("")}</ul></div>
  </div>

  ${P.publications && P.publications.length ? `<div class="visual pubs" style="margin-top:16px"><h3 class="v-title">Publication</h3><p class="v-sub">Peer-reviewed journal</p>${P.publications.map(pb => `<div class="pub"><a href="${esc(pb.link)}" target="_blank" rel="noopener"><b>${esc(pb.title)}</b></a><span>${esc(pb.venue)}. ${esc(pb.note)}</span></div>`).join("")}</div>` : ""}

  <h2 class="section">Toolkit</h2>
  <p class="section-sub">What I use day to day, grouped by the job it does.</p>
  <div class="visual skills">${P.skills.map(([g, items]) => `<div><h4>${esc(g)}</h4><div class="chips">${items.map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div></div>`).join("")}</div>
  ${footer()}`;
  const slicer = $("#slicer");
  const apply = v => { let n = 0; $$("#cards .card").forEach(c => { const ok = v === "All" || c.dataset.filters.split("|").includes(v); c.classList.toggle("out", !ok); c.toggleAttribute("inert", !ok); c.setAttribute("aria-hidden", String(!ok)); if (ok) n++; });
    slicer.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === v)); $("#sl-count").textContent = `${n} of ${PROJ.length} projects`; };
  slicer.addEventListener("click", e => { const b = e.target.closest("button"); if (b) apply(b.dataset.v); });
  apply("All"); wireStory(); wireGame(allFixes); wireFreebies();
}
function footer(){ return `<footer>Hand-built in plain HTML and hosted free on GitHub Pages. <a href="${esc(P.contact ? P.contact.github : "#")}" target="_blank" rel="noopener">GitHub</a> &nbsp;|&nbsp; <button type="button" class="linkbtn" data-open-refresh>Refresh history</button></footer>`; }

/* ---------- CASE STUDY (drill-through) ---------- */
const KINDS = [["Fact", "--d1"], ["Dimension", "--d4"], ["Bridge", "--d3"], ["Snapshot", "--d6"], ["Semantic model", "--d2"], ["Source", "--ink-3"]];
function renderCase(id){
  const p = projById(id), el = $("#case"); if (!p) return false;
  const i = PROJ.indexOf(p), prev = PROJ[(i - 1 + PROJ.length) % PROJ.length], next = PROJ[(i + 1) % PROJ.length];
  const usedKinds = new Set(p.modelView.tables.map(t => t.k));
  const kindKey = { Fact: "fact", Dimension: "dim", Bridge: "bridge", Snapshot: "snap", "Semantic model": "model", Source: "source" };
  el.innerHTML = `
  <div class="drill-top">
    <a class="btn" href="#work" data-back>${ICON.back} Back to report</a>
    <span class="crumb"><a href="#professional">Professional</a> / ${esc(p.title)}</span>
    <div class="drill-filter" aria-label="Drill-through filters">${ICON.filter}<span>Project is <b>${esc(p.title)}</b></span><span>Client is <b>${esc(p.client.split(", client ").pop())}</b></span><span>Period is <b>${esc(p.period)}</b></span></div>
  </div>
  <div class="drill-head">
    <div class="visual"><p class="p-client">${esc(p.client)}</p><h1>${esc(p.title)}</h1><p class="problem">${esc(p.problem)}</p></div>
    <div class="drill-kpis">${p.impact.map(([v, l, note], k) => kpiButton({ v, l, tip: note ? { title: `${v} ${l}`, rows: [["Project", p.title], ["When", p.period]], note } : null }, `i-${p.id}-${k}`)).join("")}</div>
  </div>

  <h2 class="section">The story</h2><p class="section-sub">Four frames, start to finish.</p>
  <div class="board">${p.story.map(([s, h, t]) => `<div class="board-f">${C.sketch(s)}<small>${esc(STAGE[s])}</small><h4>${esc(h)}</h4><p>${esc(t)}</p></div>`).join("")}</div>

  <h2 class="section">${p.visual.mock ? "The report" : "The shape of it"}</h2>
  <p class="section-sub">${p.visual.mock ? esc(p.visual.hint || "Click the page tabs and toggles. Layout follows the real report; every value and name is sample data.") : "Real figures from the engagement."}</p>
  <div class="report-frame">${projectVisual(p)}
</div>
  ${p.screenshots && p.screenshots.length ? `<h2 class="section">The real report</h2><p class="section-sub">Screenshots of the delivered report’s layout. Every name, brand and value in them is dummy data.</p>
  <div class="shots${p.screenshots.length > 6 ? " collapsed" : ""}" id="shots">${p.screenshots.map((sh, k) => { const o = typeof sh === "string" ? { src: sh, caption: `Screenshot ${k + 1}` } : sh;
    return `<figure><button type="button" data-lightbox="${esc(o.src)}" data-lb-title="${esc(o.caption)}" data-lb-group="shots-${p.id}"><img src="${esc(o.src)}" alt="${esc(o.caption)}, data blurred" loading="lazy"></button><figcaption>${esc(o.caption)}</figcaption></figure>`; }).join("")}</div>${p.screenshots.length > 6 ? `<button type="button" class="btn shots-more" data-shots-more>Show all ${p.screenshots.length} screenshots</button>` : ""}` : ""}

  <div class="two" style="margin-top:16px">
    <div class="visual"><h3 class="v-title">Model view</h3><p class="v-sub">${esc(p.model)}. Simplified; table names are generic.</p>
      ${C.modelView(p.modelView)}
      <div class="mv-legend">${KINDS.filter(([n]) => usedKinds.has(kindKey[n])).map(([n, c]) => `<span><i style="background:var(${c})"></i>${n}</span>`).join("")}</div></div>
    <div class="visual built"><h3 class="v-title">What I built</h3><p class="v-sub">My part of the delivery</p><ul>${p.built.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
      <div class="chips" style="margin-top:14px">${p.tags.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>
  </div>

  ${p.decisions ? `<h2 class="section">Design decisions</h2><p class="section-sub">Choices that shaped how the report reads.</p><div class="visual decisions"><ul>${p.decisions.map(d => `<li>${esc(d)}</li>`).join("")}</ul></div>` : ""}
  ${p.fixes && p.fixes.length ? `<h2 class="section">Fixes along the way</h2><p class="section-sub">Symptom, cause, fix and proof.</p><div class="rc-grid">${p.fixes.map(f => fixCard(f)).join("")}</div>` : ""}

  <nav class="drill-nav" aria-label="More case studies">
    <a href="#case-${prev.id}"><small>Previous case study</small><b>${esc(prev.title)}</b></a>
    <a class="next" href="#case-${next.id}"><small>Next case study</small><b>${esc(next.title)}</b></a>
  </nav>${footer()}`;
  document.title = `${p.title} | Rahul Vashistha`;
  return true;
}

/* ---------- PERSONAL ---------- */
let watchCat = "movies";
function watchHTML(){
  const W = PER.watch; if (!W) return "";
  const d = W[watchCat], order = ["Best", "Great", "Good", "Ok", "Bad", "Unrated"].filter(k => d.ratings[k] !== undefined && (d.ratings[k] > 0 || k !== "Best"));
  const top = (d.ratings.Best || 0) + (d.ratings.Great || 0), rated = d.total - (d.ratings.Unrated || 0);
  const ratingChart = C.chart({ type: "hbar", items: order.map(k => [k, d.ratings[k]]) });
  const decades = d.decades ? `<h4 style="margin-top:16px">Movies by release decade</h4>${C.chart({ type: "hbar", items: Object.entries(d.decades) })}` : "";
  return `<div class="watch-head"><b>Watch history</b><span class="v-sub" style="margin:0">Real counts from my own logs</span>
      <div class="slicer" role="group" aria-label="Category">${Object.entries(W).map(([k, v]) => `<button type="button" aria-pressed="${k === watchCat}" data-watch="${k}">${esc(v.label)}</button>`).join("")}</div></div>
    <div class="watch-body">
      <div class="watch-kpi"><b class="num">${d.total}</b><span>${esc(d.label.toLowerCase())} logged</span>
        <p>${Math.round(top / rated * 100)}% of the ones I rated got Best or Great.${d.note ? " " + esc(d.note) : ""}</p>${decades}</div>
      <div class="mock" style="border:0"><h4>How I rated them</h4>${ratingChart}</div>
      <div><h4>Top picks</h4><ol>${d.picks.map(x => `<li>${esc(x)}</li>`).join("")}</ol></div>
    </div>`;
}
function renderPersonal(){
  const el = $("#personal"); if (!PER.title) return;
  el.innerHTML = `
  <div class="page-head"><div class="visual hero-main"><h1>${esc(PER.title)}</h1><p class="lede">${esc(PER.lede)}</p></div>
    <div class="visual"><h3 class="v-title">At a glance</h3><p class="v-sub">The quick version</p><dl class="about-facts">${PER.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div></div>
  ${nowHTML()}
  <h2 class="section">Where the time goes</h2><p class="section-sub">What fills the hours between refreshes.</p>
  <div class="life">${PER.life.map(([h, p, items]) => `<div class="visual"><h3>${esc(h)}</h3><p>${esc(p)}</p><ul>${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div>
  ${PHOTOS.length ? `<h2 class="section">Snapshots</h2><p class="section-sub">Proof that I do leave the desk. More in the <a href="#album">Album</a>.</p><div class="snaps">${PHOTOS.slice(0, 4).map((ph, k) => photoHTML(ph, k)).join("")}</div>` : ""}
  ${PER.watch ? `<h2 class="section">The watch report</h2><p class="section-sub">Every film, series and anime I’ve logged, summarised the only way I know how.</p><div class="watch" id="watch">${watchHTML()}</div>` : ""}
  ${PER.favourites && PER.favourites.length ? `<h2 class="section">Favourites</h2><div class="life">${PER.favourites.map(([h, items]) => `<div class="visual"><h3>${esc(h)}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div>` : ""}
  <h2 class="section">What I value</h2><p class="section-sub">Outside work, mostly. Some of it leaks in.</p>
  <div class="values">${PER.values.map(([h, t]) => `<div class="visual"><h4>${esc(h)}</h4><p>${esc(t)}</p></div>`).join("")}</div>
  <h2 class="section">Fun facts</h2><p class="section-sub">Things you wouldn’t guess from my résumé.</p>
  <ul class="facts-list">${PER.funfacts.map(f => `<li>${esc(f)}</li>`).join("")}</ul>${footer()}`;
  const w = $("#watch"); if (w) w.addEventListener("click", e => { const b = e.target.closest("[data-watch]"); if (b) { watchCat = b.dataset.watch; w.innerHTML = watchHTML(); w.querySelector(`[data-watch="${watchCat}"]`).focus(); } });
}

/* ---------- HALL OF FAME ---------- */
let archCat = "All", archQ = "";
function curveSVG(){
  const dated = TL.filter(x => x.type === "cert" && x.date && /^\d{4}-\d{2}/.test(x.date));
  if (dated.length < 2) return "";
  const t = d => { const [y, m] = d.split("-"); return +y + (+m - 1) / 12; };
  const t0 = Math.floor(Math.min(...dated.map(x => t(x.date)))), t1 = Math.ceil(Math.max(...dated.map(x => t(x.date))) + 0.01);
  const W = 760, H = 240, pl = 36, pr = 14, pt = 18, pb = 26;
  const cs = dated.filter(x => x.tier === "certification").sort((a, b) => a.date.localeCompare(b.date));
  const ks = dated.filter(x => x.tier === "course").sort((a, b) => a.date.localeCompare(b.date));
  const maxK = ks.length, maxC = cs.length;
  const sx = v => pl + (v - t0) / (t1 - t0) * (W - pl - pr), syK = n => H - pb - n / maxK * (H - pb - pt), syC = n => H - pb - n / Math.max(maxC, 1) * (H - pb - pt);
  const steps = (arr, sy) => { let d = `M${sx(t0)},${sy(0)}`, n = 0; arr.forEach(x => { const X = sx(t(x.date)); d += ` L${X},${sy(n)} L${X},${sy(++n)}`; }); return d + ` L${sx(t1)},${sy(n)}`; };
  let g = "";
  for (let y = t0; y <= t1; y++) g += `<line class="grid-ln" x1="${sx(y)}" y1="${pt}" x2="${sx(y)}" y2="${H - pb}"/><text x="${sx(y)}" y="${H - 8}" text-anchor="middle">${y}</text>`;
  g += `<text x="4" y="${pt + 8}" style="fill:var(--d3)">${maxK}</text><text x="4" y="${H - pb}" >0</text>`;
  g += `<path class="curve-ln curve-k" d="${steps(ks, syK)}"/><path class="curve-ln curve-c" d="${steps(cs, syC)}"/>`;
  cs.forEach((c, i) => { const X = sx(t(c.date)), Y = syC(i + 1);
    g += `<circle class="curve-dot s1" tabindex="0" role="button" aria-label="${esc(c.code)}, ${fmtDate(c.date)}" data-goto-cert="${esc(c.code)}" cx="${X}" cy="${Y}" r="6"><title>${esc(c.code)}, ${fmtDate(c.date)}</title></circle><text x="${X - 10}" y="${Y + 3}" text-anchor="end" class="lbl-strong curve-lbl">${esc(c.code)}</text>`; });
  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Cumulative certifications and courses over time">${g}</svg>
    ${C.legend([[`Certifications (${maxC} dated, scale 0 to ${maxC})`, "s1"], [`Courses (${maxK}, scale 0 to ${maxK})`, "s3"]])}`;
}
function archiveRows(){
  const q = archQ.trim().toLowerCase();
  const rows = COURSES.filter(c => (archCat === "All" || c.category === archCat) && (!q || (c.title + " " + c.issuer).toLowerCase().includes(q)));
  $("#arch-count").textContent = `${rows.length} of ${COURSES.length} courses`;
  $("#arch-body").innerHTML = rows.length ? rows.map(c => `<tr><td class="nowrap num">${fmtDate(c.date)}</td><td>${esc(c.title)}</td><td>${esc(c.issuer)}</td><td><span class="cat-tag">${esc(c.category)}</span></td><td>${c.image ? `<button type="button" class="linkbtn" data-lightbox="${esc(c.image)}" data-lb-title="${esc(c.title)}">View</button>` : c.pdf ? `<a href="${esc(c.pdf)}" target="_blank" rel="noopener">PDF</a>` : ""}</td></tr>`).join("")
    : `<tr><td colspan="5">No courses match. Clear the search or pick another category.</td></tr>`;
}
function renderFame(){
  const el = $("#hall-of-fame");
  const dated = CERTS.filter(c => c.date), first = dated.length ? dated[dated.length - 1] : null, latest = dated[0];
  const cats = ["All", ...new Set(COURSES.map(c => c.category))];
  el.innerHTML = `
  <div class="page-head"><div class="visual hero-main"><h1>Hall of Fame</h1><p class="lede">Exams I’ve passed, with the certificate behind each one, then the skill tests and courses that actually shaped the work. Curated, not exhaustive.</p></div>
    <div class="fame-kpis">
      <div class="kpi"><div class="kpi-v num">${CERTS.length}</div><div class="kpi-l">certifications</div></div>
      <div class="kpi"><div class="kpi-v num">${COURSES.length + ASSESS.length}</div><div class="kpi-l">courses and skill assessments</div></div>
      <div class="kpi"><div class="kpi-v num">${first ? first.date.slice(0, 4) : "—"}</div><div class="kpi-l">first certification${first ? `, ${esc(first.code)}` : ""}</div></div>
      <div class="kpi"><div class="kpi-v num">${latest ? esc(latest.code) : "—"}</div><div class="kpi-l">latest certification${latest ? `, ${fmtDate(latest.date)}` : ""}</div></div>
    </div></div>

  <h2 class="section">Learning curve</h2><p class="section-sub">Cumulative certifications and courses over time. Select a point to jump to that certificate.</p>
  <div class="visual curve">${curveSVG() || `<p class="empty-note">The curve appears once two or more items have dates.</p>`}</div>

  <h2 class="section">Certifications</h2><p class="section-sub">Earned and expiry dates come from the certificates themselves.</p>
  <div class="plaques">${CERTS.map(c => `<article class="plaque" id="cert-${esc(c.code)}"><div class="plaque-in">
    <p class="plaque-issuer">${esc(c.issuer || "Issuer to be added")}</p><div class="plaque-code${c.code.length > 8 ? " long" : ""}">${esc(c.code)}</div><h3>${esc(c.title)}</h3>
    <p class="plaque-meta">${c.date ? `Earned <b>${fmtDate(c.date)}</b>` : "Certificate to be added"}${c.expires ? `<br>${validity(c)}` : ""}${c.credential ? `<br>Credential <b>${esc(c.credential)}</b>` : ""}</p>
    <div class="plaque-act">${c.image ? `<button type="button" class="btn" data-lightbox="${esc(c.image)}" data-lb-title="${esc(c.code)}: ${esc(c.title)}" data-lb-link="${esc(c.pdf || "")}">View certificate</button>` : ""}${c.verify ? `<a class="btn" href="${esc(c.verify)}" target="_blank" rel="noopener">Verify</a>` : ""}</div>
  </div></article>`).join("")}</div>

  ${ASSESS.length ? `<h2 class="section">Skill assessments</h2><p class="section-sub">Timed tests, highest level passed in each skill.</p>
  <div class="plaques small">${ASSESS.map(c => `<article class="plaque"><div class="plaque-in"><p class="plaque-issuer">${esc(c.issuer)}</p><div class="plaque-code${c.code.length > 8 ? " long" : ""}">${esc(c.code)}</div><h3>${esc(c.title)}</h3><p class="plaque-meta">Passed <b>${fmtDate(c.date)}</b></p>
    <div class="plaque-act">${c.image ? `<button type="button" class="btn" data-lightbox="${esc(c.image)}" data-lb-title="${esc(c.issuer)}: ${esc(c.title)}">View certificate</button>` : ""}</div></div></article>`).join("")}</div>` : ""}
  <h2 class="section">Courses</h2><p class="section-sub">Substantial courses that shaped the work, newest first. Exam prep, participation certificates and short soft-skill courses are left out on purpose.</p>
  <div class="archive-tools"><div class="slicer" id="arch-cats" role="group" aria-label="Category">${cats.map(c => `<button type="button" aria-pressed="${c === archCat}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
    <label class="sr-only" for="arch-q">Search courses</label><input id="arch-q" type="search" placeholder="Search courses" value="${esc(archQ)}"><span class="slicer-count" id="arch-count" aria-live="polite"></span></div>
  <div class="table-wrap"><table class="dtable"><thead><tr><th>Date</th><th>Course</th><th>Provider</th><th>Category</th><th>Certificate</th></tr></thead><tbody id="arch-body"></tbody></table></div>
  ${footer()}`;
  archiveRows();
  $("#arch-cats").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (!b) return; archCat = b.dataset.cat; $$("#arch-cats button").forEach(x => x.setAttribute("aria-pressed", x === b)); archiveRows(); });
  $("#arch-q").addEventListener("input", e => { archQ = e.target.value; archiveRows(); });
  const goto = code => { const t = document.getElementById("cert-" + code); if (!t) return; t.scrollIntoView({ behavior: smooth(), block: "center" }); t.classList.add("is-hl"); setTimeout(() => t.classList.remove("is-hl"), 1800); };
  el.addEventListener("click", e => { const d = e.target.closest("[data-goto-cert]"); if (d) goto(d.dataset.gotoCert); });
  el.addEventListener("keydown", e => { const d = e.target.closest("[data-goto-cert]"); if (d && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); goto(d.dataset.gotoCert); } });
}

/* ---------- YEARBOOK ---------- */
const YEARS = (() => {
  const s = new Set();
  TL.forEach(x => { const y = yearOf(x.date); if (y) s.add(y); });
  PROJ.forEach(p => { for (let y = p.years[0]; y <= p.years[1]; y++) s.add(y); });
  return [...s].sort((a, b) => a - b);
})();
let ybYear = YEARS[YEARS.length - 1];
function spreadHTML(y){
  const x = YB[y] || {}, inYear = it => yearOf(it.date) === y;
  const certs = CERTS.filter(inYear), assess = ASSESS.filter(inYear), courses = COURSES.filter(inYear), miles = MILES.filter(inYear).sort((a, b) => (a.date || "").localeCompare(b.date || "")), photos = PHOTOS.filter(inYear);
  const projs = PROJ.filter(p => p.years[0] <= y && y <= p.years[1]);
  const cover = x.cover || (photos[0] && photos[0].image);
  const i = YEARS.indexOf(y);
  return `<div class="spread">
    <div class="yb-cover"><p class="yb-year num">${y}</p>${x.line ? `<p class="yb-line">${esc(x.line)}</p>` : ""}
      ${cover ? `<img class="yb-photo" src="${esc(cover)}" alt="Photo from ${y}" loading="lazy">` : ""}
      ${x.superlative ? `<div class="yb-super"><small>Voted</small><b>${esc(x.superlative)}</b>${x.quote ? `<p class="yb-quote">“${esc(x.quote)}”</p>` : ""}</div>` : ""}</div>
    <div class="yb-main">
      <div class="yb-kpis"><div><b class="num">${certs.length}</b><span>certifications</span></div><div><b class="num">${courses.length}</b><span>courses</span></div><div><b class="num">${projs.length}</b><span>projects</span></div></div>
      ${miles.length ? `<h4>Milestones</h4><ul class="yb-list">${miles.map(m => `<li><span>${fmtDate(m.date)}</span><div>${m.link ? `<a href="${esc(m.link)}" target="_blank" rel="noopener">${esc(m.title)}</a>` : esc(m.title)}${m.subtitle ? `<br><span>${esc(m.subtitle)}</span>` : ""}</div></li>`).join("")}</ul>` : ""}
      ${projs.length ? `<h4>Projects</h4><ul class="yb-list">${projs.map(p => `<li><span>${p.years[0] === p.years[1] ? p.years[0] : `${p.years[0]}–${String(p.years[1]).slice(2)}`}</span><a href="#case-${p.id}">${esc(p.title)}</a></li>`).join("")}</ul>` : ""}
      ${certs.length ? `<h4>Certifications</h4><ul class="yb-list">${certs.slice().reverse().map(c => `<li><span>${fmtDate(c.date).split(" ")[0]}</span><a href="#hall-of-fame" data-cert-link="${esc(c.code)}">${esc(c.title.startsWith(c.code) ? c.title : `${c.code}: ${c.title}`)}</a></li>`).join("")}</ul>` : ""}
      ${assess.length ? `<h4>Skill assessments</h4><ul class="yb-list">${assess.slice().reverse().map(c => `<li><span>${fmtDate(c.date).split(" ")[0]}</span><div>${esc(c.issuer)}: ${esc(c.title)}</div></li>`).join("")}</ul>` : ""}
      ${courses.length ? `<h4>Courses</h4><ul class="yb-list">${courses.slice().reverse().slice(0, 6).map(c => `<li><span>${fmtDate(c.date).split(" ")[0]}</span><div>${esc(c.title)}</div></li>`).join("")}${courses.length > 6 ? `<li><span></span><a href="#hall-of-fame">and ${courses.length - 6} more in the Hall of Fame</a></li>` : ""}</ul>` : ""}
      ${photos.length > 1 ? `<h4>Photos</h4><div class="album" style="columns:3 120px">${photos.map(ph => photoHTML(ph)).join("")}</div>` : ""}
      <div class="yb-nav">${i > 0 ? `<button class="btn" type="button" data-year="${YEARS[i - 1]}" aria-label="Previous year, ${YEARS[i - 1]}">${ICON.back} ${YEARS[i - 1]}</button>` : "<span></span>"}${i < YEARS.length - 1 ? `<button class="btn" type="button" data-year="${YEARS[i + 1]}" aria-label="Next year, ${YEARS[i + 1]}">${YEARS[i + 1]} ${ICON.fwd}</button>` : ""}</div>
    </div></div>`;
}
function renderYearbook(){
  const el = $("#yearbook");
  el.innerHTML = `<div class="page-head"><div class="visual hero-main"><h1>Yearbook</h1><p class="lede">One page per year: what happened, what I learned, and what I’d be voted for. It fills itself from the same data as the rest of the site.</p></div>
    <div class="visual"><h3 class="v-title">Pick a year</h3><p class="v-sub">${YEARS.length} years so far</p><div class="years" id="yb-years" role="group" aria-label="Year">${YEARS.map(y => `<button type="button" aria-pressed="${y === ybYear}" data-year="${y}">${y}</button>`).join("")}</div></div></div>
    <div id="yb-spread">${spreadHTML(ybYear)}</div>${footer()}`;
  el.addEventListener("click", e => { const b = e.target.closest("[data-year]"); if (!b) return; ybYear = +b.dataset.year;
    $$("#yb-years button").forEach(x => x.setAttribute("aria-pressed", +x.dataset.year === ybYear)); $("#yb-spread").innerHTML = spreadHTML(ybYear); });
}

/* ---------- ALBUM ---------- */
function photoHTML(ph, k = 0){ const tilt = [-1.6, 1.2, -0.6, 1.8, -1.1][k % 5];
  return `<button type="button" class="polaroid" style="--tilt:${tilt}deg" data-lightbox="${esc(ph.image)}" data-lb-title="${esc(ph.title || "")}"><img src="${esc(ph.image)}" alt="${esc(ph.caption || ph.title || "Photo")}" loading="lazy"><b>${esc(ph.title || "")}</b><span>${esc([[ph.place, fmtDate(ph.date)].filter(Boolean).join(", "), ph.caption].filter(Boolean).join(". "))}</span></button>`; }
function renderAlbum(){
  $("#album").innerHTML = `<div class="page-head"><div class="visual hero-main"><h1>Album</h1><p class="lede">The scrapbook: courts, cafés, trips and everything in between.</p></div><div></div></div>
    <div class="album" style="margin-top:20px">${PHOTOS.map(photoHTML).join("")}</div>${footer()}`;
}

/* ---------- lightbox ---------- */
const lb = $("#lightbox");
let lbGroup = [], lbIdx = 0;
function lbShow(b){
  $("#lb-img").src = b.dataset.lightbox; $("#lb-img").alt = b.dataset.lbTitle || ""; $("#lb-title").textContent = b.dataset.lbTitle || "";
  const link = b.dataset.lbLink; $("#lb-link").hidden = !link; if (link) $("#lb-link").href = link;
  const many = lbGroup.length > 1; $("#lb-prev").hidden = !many; $("#lb-next").hidden = !many;
  $("#lb-count").textContent = many ? `${lbIdx + 1} of ${lbGroup.length}` : "";
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-lightbox]"); if (!b) return;
  lbGroup = b.dataset.lbGroup ? $$(`[data-lb-group="${b.dataset.lbGroup}"]`) : [b]; lbIdx = Math.max(0, lbGroup.indexOf(b));
  lbShow(b); if (!lb.open) lb.showModal();
});
const lbStep = d => { if (lbGroup.length < 2) return; lbIdx = (lbIdx + d + lbGroup.length) % lbGroup.length; lbShow(lbGroup[lbIdx]); };
$("#lb-prev").addEventListener("click", () => lbStep(-1));
$("#lb-next").addEventListener("click", () => lbStep(1));
lb.addEventListener("keydown", e => { if (e.key === "ArrowRight") lbStep(1); if (e.key === "ArrowLeft") lbStep(-1); });
$("#lb-close").addEventListener("click", () => lb.close());
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });


/* ---------- root-cause game ---------- */
const GAME = { answered: {}, right: 0, reveal: false, order: [] };
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const VERDICT = n => n === 6 ? "Perfect. You should be doing my job." : n >= 4 ? "You’d make a decent BI detective." : n >= 2 ? "Not bad. Root causes are sneaky." : "Now you know why this section exists.";
function gameHTML(fixes){
  GAME.order = fixes.map(([f]) => shuffle([0, 1, 2].filter(i => f.options && f.options[i])));
  return `<div class="game-bar"><span class="game-score" id="game-score" aria-live="polite"></span>
      <button type="button" class="btn" id="game-reveal" aria-pressed="false">Reveal all</button>
      <button type="button" class="btn" id="game-reset">Play again</button></div>
    <p class="game-end" id="game-end" aria-live="polite" hidden></p>
    <div class="game">${fixes.map(([f, pj], i) => `<article class="gc" data-i="${i}"><div class="gc-in">
      <div class="gc-face gc-front">
        <p class="gc-case">Case ${i + 1} of ${fixes.length}</p>
        <p class="gc-label">Symptom</p><h3 class="gc-sym">${esc(f.symptom)}</h3>
        <p class="gc-label">What caused it?</p>
        <div class="gc-opts">${GAME.order[i].map(o => `<button type="button" class="gc-opt" data-o="${o}">${esc(f.options[o])}</button>`).join("")}</div>
      </div>
      <div class="gc-face gc-back" aria-hidden="true">
        <p class="gc-verdict"></p>
        <p class="rc-from"><a href="#case-${pj.id}">${esc(pj.title)}</a></p><h3>${esc(f.title)}</h3>
        <ol><li><b>Symptom</b><span>${esc(f.symptom)}</span></li><li><b>Cause</b><span>${esc(f.cause)}</span></li><li><b>Fix</b><span>${esc(f.fix)}</span></li><li class="proof"><b>Proof</b><span>${esc(f.proof)}</span></li></ol>
      </div></div></article>`).join("")}</div>`;
}
function wireGame(fixes){
  const root = $(".game"); if (!root) return;
  const total = fixes.length;
  const score = () => { const n = Object.keys(GAME.answered).length;
    $("#game-score").textContent = GAME.reveal ? "All answers shown" : `Score ${GAME.right} of ${n}${n < total ? `, ${total - n} to go` : ""}`;
    const end = $("#game-end"); end.hidden = GAME.reveal || n < total; if (!end.hidden) end.textContent = `${GAME.right} of ${total}. ${VERDICT(GAME.right)}`; };
  const flip = (card, verdict, cls) => { card.classList.add("flipped"); const v = card.querySelector(".gc-verdict"); v.textContent = verdict; v.className = `gc-verdict ${cls || ""}`;
    card.querySelector(".gc-back").setAttribute("aria-hidden", "false"); card.querySelector(".gc-front").setAttribute("aria-hidden", "true"); card.querySelectorAll(".gc-opt").forEach(b => b.tabIndex = -1); };
  root.addEventListener("click", e => {
    const b = e.target.closest(".gc-opt"); if (!b || GAME.reveal) return;
    const card = b.closest(".gc"), i = +card.dataset.i; if (GAME.answered[i] !== undefined) return;
    const ok = +b.dataset.o === 0; GAME.answered[i] = ok; if (ok) GAME.right++;
    b.classList.add(ok ? "right" : "wrong");
    setTimeout(() => flip(card, ok ? "You got it." : `Not this time. You picked: “${fixes[i][0].options[+b.dataset.o]}”`, ok ? "ok" : "no"), ok ? 350 : 650);
    score();
  });
  $("#game-reveal").onclick = e => { GAME.reveal = !GAME.reveal; e.currentTarget.setAttribute("aria-pressed", GAME.reveal);
    $$(".gc").forEach((c, i) => { if (GAME.reveal) flip(c, GAME.answered[i] === undefined ? "The answer" : (GAME.answered[i] ? "You got it." : "Not this time."), GAME.answered[i] ? "ok" : ""); else if (GAME.answered[i] === undefined) unflip(c); }); score(); };
  const unflip = c => { c.classList.remove("flipped"); c.querySelector(".gc-back").setAttribute("aria-hidden", "true"); c.querySelector(".gc-front").setAttribute("aria-hidden", "false"); c.querySelectorAll(".gc-opt").forEach(b => { b.tabIndex = 0; b.classList.remove("right", "wrong"); }); };
  $("#game-reset").onclick = () => { GAME.answered = {}; GAME.right = 0; GAME.reveal = false; $("#game-reveal").setAttribute("aria-pressed", "false"); $$(".gc").forEach(unflip); score(); };
  score();
}

/* ---------- freebies ---------- */
function kpiPreview(k){
  const x = k.sample, col = { up: "#2E8B57", down: "#C9573E", flat: "#8A96A3" };
  if (k.id === "three") {
    const st = x.change > 0.0005 ? "up" : x.change < -0.0005 ? "down" : "flat", c = col[st];
    const mn = Math.min(...x.spark), mx = Math.max(...x.spark), pts = x.spark.map((v, i) => `${Math.round(175 + 110 * i / (x.spark.length - 1))},${Math.round(105 - 55 * (v - mn) / (mx - mn || 1))}`).join(" ");
    const mark = st === "up" ? `<polygon points="18,109 24,101 30,109" fill="${c}"/>` : st === "down" ? `<polygon points="18,101 24,109 30,101" fill="${c}"/>` : `<rect x="19" y="102" width="10" height="6" fill="${c}"/>`;
    return `<svg viewBox="0 0 300 140" role="img" aria-label="Preview of the three-state KPI card"><rect x=".5" y=".5" width="299" height="139" fill="#FFFFFF" stroke="#D3DAE2"/><rect width="4" height="140" fill="#13618A"/>
      <text x="18" y="30" font-size="13" fill="#4A5868">${esc(x.title)}</text><text x="18" y="78" font-size="34" font-weight="700" fill="#16212C">${x.value.toLocaleString("en-US")}</text>${mark}
      <text x="36" y="110" font-size="13" font-weight="600" fill="${c}">${x.change > 0 ? "+" : ""}${(x.change * 100).toFixed(1)}% vs prior</text>
      <polyline points="${pts}" fill="none" stroke="#13618A" stroke-width="2" stroke-linejoin="round"/></svg>`;
  }
  const perf = x.actual / x.goal, sc = Math.max(x.actual, x.goal) * 1.1, bw = Math.round(264 * x.actual / sc), gx = 18 + Math.round(264 * x.goal / sc);
  const c = perf >= 1 ? "#2E8B57" : perf >= 0.9 ? "#E3A72F" : "#C9573E", stt = perf >= 1 ? "On or above goal" : perf >= 0.9 ? "Close to goal" : "Below goal";
  return `<svg viewBox="0 0 300 140" role="img" aria-label="Preview of the actual vs goal card"><rect x=".5" y=".5" width="299" height="139" fill="#FFFFFF" stroke="#D3DAE2"/><rect width="4" height="140" fill="#13618A"/>
    <text x="18" y="30" font-size="13" fill="#4A5868">${esc(x.title)}</text><text x="18" y="72" font-size="30" font-weight="700" fill="#16212C">${x.actual.toLocaleString("en-US")}</text>
    <text x="282" y="72" text-anchor="end" font-size="22" font-weight="700" fill="${c}">${(perf * 100).toFixed(1)}%</text>
    <rect x="18" y="88" width="264" height="12" fill="#E4E9EE"/><rect x="18" y="88" width="${bw}" height="12" fill="${c}"/><rect x="${gx - 1}" y="82" width="3" height="24" fill="#16212C"/>
    <text x="18" y="126" font-size="12" fill="#4A5868">Goal ${x.goal.toLocaleString("en-US")}</text><text x="282" y="126" text-anchor="end" font-size="12" font-weight="600" fill="${c}">${stt}</text></svg>`;
}
function freebiesHTML(){
  const F = SITE.freebies; if (!F) return "";
  return `<h2 class="section" id="freebies">Take something with you</h2>
  <p class="section-sub">Free to use in your own reports. In Power BI Desktop, apply a theme from View, then Themes, then Browse for themes.</p>
  <div class="free-themes">${F.themes.map(t => `<div class="visual free-theme"><span class="theme-sw">${t.sw.map(c => `<i style="background:${c}"></i>`).join("")}</span>
    <div><h4>${esc(t.name)}</h4><p>${esc(t.desc)}</p></div><a class="btn" href="${esc(t.file)}" download>Download theme</a></div>`).join("")}</div>
  <div class="free-kpis">${F.kpi.map(k => `<div class="visual free-kpi"><div class="free-prev">${kpiPreview(k)}</div>
    <h4>${esc(k.title)}</h4><p>${esc(k.desc)} A DAX measure that draws the card as an image; set its data category to Image URL.</p>
    <div class="free-act"><button type="button" class="btn btn-primary" data-copy-dax="${esc(k.id)}">Copy DAX</button><a class="btn" href="${esc(k.file)}" download>Download .dax</a><span class="copy-ok" aria-live="polite"></span></div></div>`).join("")}</div>`;
}
function wireFreebies(){
  $$("[data-copy-dax]").forEach(b => b.addEventListener("click", async () => {
    const k = SITE.freebies.kpi.find(x => x.id === b.dataset.copyDax), out = b.parentElement.querySelector(".copy-ok");
    try { await navigator.clipboard.writeText(k.dax); out.textContent = "Copied"; }
    catch (e) { const t = document.createElement("textarea"); t.value = k.dax; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); out.textContent = "Copied"; } catch (e2) { out.textContent = "Copy failed. Use Download instead."; } t.remove(); }
    setTimeout(() => out.textContent = "", 2500);
  }));
}

/* ---------- Now strip ---------- */
function nowHTML(){
  const N = PER.now; if (!N) return "";
  const items = N.items.filter(([, v]) => v && v.trim()); if (!items.length) return "";
  const days = N.updated ? Math.max(0, Math.round((Date.now() - new Date(N.updated + "T00:00:00")) / 864e5)) : null;
  const when = days === null ? "" : days === 0 ? "Updated today" : days === 1 ? "Updated yesterday" : `Updated ${days} days ago`;
  return `<div class="nowstrip" aria-label="What I’m up to now"><span class="now-tag">Now</span>${items.map(([k, v]) => `<span class="now-i"><small>${esc(k)}</small>${esc(v)}</span>`).join("")}<span class="now-when">${esc(when)}</span></div>`;
}

/* ---------- motion: render-in once per visit, charts grow into view ---------- */
const REDUCED = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const seen = new Set(); try { JSON.parse(sessionStorage.getItem("rv-seen") || "[]").forEach(x => seen.add(x)); } catch (e) {}
function countUp(el){
  const m = el.textContent.match(/^([^\d]*)([\d,.]+)(.*)$/); if (!m) return;
  if (/[A-Za-z]/.test(m[1]) || /^(19|20)\d\d$/.test(m[2])) return;
  const target = parseFloat(m[2].replace(/,/g, "")), dec = (m[2].split(".")[1] || "").length, comma = m[2].includes(","), t0 = performance.now(), dur = 900;
  const fmt = v => { const n = v.toFixed(dec); return comma ? Number(n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : n; };
  const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = m[1] + fmt(target * e) + m[3]; if (p < 1) requestAnimationFrame(step); else el.textContent = m[0]; };
  requestAnimationFrame(step);
}
function renderIn(page){
  if (!page || REDUCED() || seen.has(page.id)) return;
  seen.add(page.id); try { sessionStorage.setItem("rv-seen", JSON.stringify([...seen])); } catch (e) {}
  page.classList.add("rendering");
  setTimeout(() => { page.classList.remove("rendering"); page.querySelectorAll(".kpi-v, .fame-kpis .kpi-v").forEach(countUp); }, 520);
}
let io = null;
function observeCharts(){
  if (!("IntersectionObserver" in window)) { $$(".mock, .curve, .watch").forEach(el => el.classList.add("in")); return; }
  if (!io) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.25 });
  $$(".mock:not(.in), .curve:not(.in), .watch:not(.in)").forEach(el => io.observe(el));
}
document.addEventListener("click", e => { const m = e.target.closest("[data-shots-more]"); if (m) { $("#shots").classList.remove("collapsed"); m.remove(); } });

/* ---------- Refresh history and Performance analyzer ---------- */
const PERF = [];
function timed(name, fn){ const t0 = performance.now(); const r = fn(); PERF.push([name, performance.now() - t0]); return r; }
let lastRefresh = null;
function fmtStamp(d){ return d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
(async () => {
  if (!P.repo) return;
  try {
    const r = await fetch(`https://api.github.com/repos/${P.repo}/commits?per_page=1`, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) return; const j = await r.json(); const d = new Date(j[0].commit.committer.date);
    if (!isNaN(d)) { lastRefresh = d; $("#tb-meta").textContent = `Data as of ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`; }
  } catch (e) {}
})();
const rp = $("#refresh-panel");
function refreshHTML(){
  const R = SITE.releases || [];
  return `<p class="rp-last">Last refresh: <b>${lastRefresh ? fmtStamp(lastRefresh) + " (from GitHub)" : esc(P.refreshed || "")}</b></p>
    <ol class="rp-list">${R.map((x, i) => `<li><div class="rp-head"><span class="rp-status ${i === 0 ? "now" : ""}">${i === 0 ? "Current" : "Completed"}</span><b>${esc(x.title)}</b><span class="rp-date">${fmtDate(x.date)}</span></div>
      <ul>${x.items.map(t => `<li>${esc(t)}</li>`).join("")}</ul></li>`).join("")}</ol>`;
}
function perfHTML(){
  const nav = performance.getEntriesByType("navigation")[0];
  const res = performance.getEntriesByType("resource").filter(r => /\/(data|js|css)\//.test(r.name)).map(r => [r.name.split("/").slice(-2).join("/"), r.duration]);
  const rows = [...(nav ? [["Page load (DOM ready)", nav.domContentLoadedEventEnd], ["Page load (complete)", nav.loadEventEnd || performance.now()]] : []), ...res.map(([n, d]) => [`Load ${n}`, d]), ...PERF.map(([n, d]) => [`Render ${n}`, d])];
  const max = Math.max(1, ...rows.map(r => r[1]));
  return `<p class="rp-last">Live timings from your browser, for this visit. Visuals rendered: <b>${$$(".mock, svg.chart-svg, .kpi").length}</b></p>
    <table class="pa"><thead><tr><th>Item</th><th class="r">Duration (ms)</th></tr></thead><tbody>${rows.map(([n, d]) => `<tr><td>${esc(n)}<span class="pa-bar"><i style="width:${Math.max(1, d / max * 100)}%"></i></span></td><td class="r num">${Math.round(d).toLocaleString("en-US")}</td></tr>`).join("")}</tbody></table>
    <button type="button" class="btn" id="pa-refresh">Refresh visuals</button>`;
}
function openRefresh(tab){
  $("#rp-body").innerHTML = tab === "perf" ? perfHTML() : refreshHTML();
  $$("#rp-tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === tab));
  if (!rp.open) rp.showModal();
}
$("#tb-meta").addEventListener("click", () => openRefresh("history"));
document.addEventListener("click", e => { if (e.target.closest("[data-open-refresh]")) openRefresh("history"); });
$("#rp-tabs").addEventListener("click", e => { const b = e.target.closest("[data-tab]"); if (b) openRefresh(b.dataset.tab); });
$("#rp-close").addEventListener("click", () => rp.close());
rp.addEventListener("click", e => { if (e.target === rp) rp.close();
  if (e.target.id === "pa-refresh") { const cur = $("main.page.is-active"); if (cur && RENDER[cur.id]) { rendered[cur.id] = false; PERF.length = 0; show(cur.id, { top: false }); } openRefresh("perf"); } });

/* ---------- pages, tabs, routing ---------- */
const TABS = [["professional", "Professional"], ["personal", "Personal"], ["hall-of-fame", "Hall of Fame"], ["yearbook", "Yearbook"]];
if (PHOTOS.length) TABS.push(["album", "Album"]);
$("#tabs").innerHTML = TABS.map(([id, n]) => `<a href="#${id}" data-page="${id}">${n}</a>`).join("") + `<span class="page-count" id="page-count"></span>`;
const rendered = {};
const RENDER = { professional: renderProfessional, personal: renderPersonal, "hall-of-fame": renderFame, yearbook: renderYearbook, album: renderAlbum };
const smooth = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
let lastProScroll = 0;
function show(page, opts = {}){
  let main = page, caseId = null;
  if (page.startsWith("case-")) { caseId = page.slice(5); if (!projById(caseId)) { page = main = "professional"; caseId = null; } else main = "case"; }
  if (!RENDER[page] && !caseId) page = main = "professional";
  if (!caseId && page === "album" && !PHOTOS.length) page = main = "professional";
  if (caseId) timed(`case study (${caseId})`, () => renderCase(caseId)); else if (!rendered[page]) { timed(`${page} page`, () => RENDER[page]()); rendered[page] = true; }
  if (!caseId) document.title = page === "professional" ? "Rahul Vashistha | Power BI Consultant & Senior Data Analyst" : `${TABS.find(t => t[0] === page)[1]} | Rahul Vashistha`;
  if (page !== "professional") stop();
  $$("main.page").forEach(m => m.classList.toggle("is-active", m.id === main));
  const tabId = caseId ? "professional" : page;
  $$("#tabs a").forEach(a => a.dataset.page === tabId ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  $("#page-count").textContent = caseId ? "Drill-through" : `Page ${TABS.findIndex(t => t[0] === tabId) + 1} of ${TABS.length}`;
  if (opts.anchor) { const t = document.getElementById(opts.anchor); if (t) t.scrollIntoView(); }
  else if (opts.top !== false) window.scrollTo(0, 0);
  hideTip();
  renderIn(document.getElementById(main)); observeCharts();
}
function route(first){
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return show("professional", { top: false });
  if (h.startsWith("case-") || RENDER[h]) return show(h);
  /* an anchor inside the Professional page (e.g. #work, #root-cause) */
  show("professional", { anchor: h });
}
addEventListener("hashchange", () => route(false));
document.addEventListener("click", e => {
  const a = e.target.closest("a[data-scroll]"); if (a) { const t = document.getElementById(a.getAttribute("href").slice(1)); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: smooth() }); } }
  const cl = e.target.closest("[data-cert-link]"); if (cl) { e.preventDefault(); location.hash = "hall-of-fame"; setTimeout(() => { const t = document.getElementById("cert-" + cl.dataset.certLink); if (t) { t.scrollIntoView({ block: "center" }); t.classList.add("is-hl"); setTimeout(() => t.classList.remove("is-hl"), 1800); } }, 30); }
});
route(true);

/* ---------- visitor analytics (off until a GoatCounter code is set in profile.js) ---------- */
(function(){
  const code = P.analytics && P.analytics.goatcounter;
  if (!code || location.protocol === "file:") return;
  window.goatcounter = { no_onload: true };
  const page = () => ({ path: location.pathname + location.hash, title: document.title });
  const sc = document.createElement("script");
  sc.async = true; sc.src = "https://gc.zgo.at/count.js";
  sc.setAttribute("data-goatcounter", `https://${encodeURIComponent(code)}.goatcounter.com/count`);
  sc.onload = () => { if (window.goatcounter.count) window.goatcounter.count(page()); };
  document.head.appendChild(sc);
  addEventListener("hashchange", () => { if (window.goatcounter.count) window.goatcounter.count(page()); });
  document.addEventListener("click", e => {
    if (e.target.closest('a[href$=".pdf"][download]') && window.goatcounter.count) window.goatcounter.count({ path: "resume-download", title: "Résumé downloaded", event: true });
  });
})();
})();
