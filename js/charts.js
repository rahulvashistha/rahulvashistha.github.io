/* Small SVG chart, model-view and sketch helpers. No dependencies. */
(function(){
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const COL = { s1: "--d1", s2: "--d2", s3: "--d3", s4: "--d4", s5: "--d5", s6: "--d6", "b-flat": "--flat", "b-ok": "--d2", "b-hot": "--bad", "b-good": "--good" };
function legend(items){ return `<div class="legend">${items.map(([n, c]) => `<span><i style="background:var(${COL[c]})"></i>${esc(n)}</span>`).join("")}</div>`; }

function stack(c){
  const W = 260, H = 118, pb = 16, pt = 4, n = c.cats.length, gap = W / n, bw = gap * 0.6;
  const tot = c.cats.map((_, i) => c.series.reduce((s, x) => s + x.v[i], 0)), max = Math.max(...tot, 1);
  let g = `<line class="grid-ln" x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}"/>`;
  c.cats.forEach((cat, i) => { let y = H - pb; const x = i * gap + (gap - bw) / 2;
    c.series.forEach(s => { const h = s.v[i] / max * (H - pb - pt); if (h > 0) { y -= h; g += `<rect class="${s.cls}" x="${x}" y="${y}" width="${bw}" height="${h}"><title>${esc(cat)}, ${esc(s.name)}: ${s.v[i]}</title></rect>`; } });
    g += `<text x="${x + bw / 2}" y="${H - 3}" text-anchor="middle">${esc(cat)}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Stacked column chart, sample data">${g}</svg>${legend(c.series.map(s => [s.name, s.cls]))}`;
}
function combo(c){
  const W = 260, H = 118, pb = 16, pt = 8, n = c.cats.length, gap = W / n, bw = gap * 0.58, max = Math.max(...c.bars);
  const lmin = Math.min(...c.line) - 1, lmax = Math.max(...c.line) + 1, ly = v => pt + (lmax - v) / (lmax - lmin) * (H - pb - pt);
  let g = `<line class="grid-ln" x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}"/>`;
  c.bars.forEach((v, i) => { const h = v / max * (H - pb - pt - 14), x = i * gap + (gap - bw) / 2;
    g += `<rect class="s1" x="${x}" y="${H - pb - h}" width="${bw}" height="${h}"><title>${esc(c.cats[i])}: ${v}${c.unit || ""}</title></rect><text x="${x + bw / 2}" y="${H - 3}" text-anchor="middle">${esc(c.cats[i])}</text>`; });
  g += `<polyline class="ln1" points="${c.line.map((v, i) => `${i * gap + gap / 2},${ly(v)}`).join(" ")}"/>`;
  c.line.forEach((v, i) => { const cls = v > 0 ? "b-good" : v < 0 ? "b-hot" : "b-flat"; g += `<circle cx="${i * gap + gap / 2}" cy="${ly(v)}" r="2.8" class="${cls}"><title>${esc(c.cats[i])} growth: ${v > 0 ? "+" : ""}${v}%</title></circle>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Column and line chart, sample data">${g}</svg>${legend([["Volume", "s1"], ["Growth up", "b-good"], ["No change", "b-flat"], ["Down", "b-hot"]])}`;
}
function band(c){
  const W = 260, rh = 19, top = 12, H = c.items.length * rh + top, lw = 72, pw = W - lw - 26, sx = v => lw + v / c.max * pw;
  const cl = v => c.invert ? (v > c.th[1] ? "b-good" : v >= c.th[0] ? "b-flat" : "b-hot") : (v > c.th[1] ? "b-hot" : v >= c.th[0] ? "b-ok" : "b-flat");
  let g = "";
  c.th.forEach(t => { g += `<line class="ln-th" x1="${sx(t)}" y1="${top - 4}" x2="${sx(t)}" y2="${Math.max(H, top + 40)}"/><text x="${sx(t)}" y="${top - 6}" text-anchor="middle">${t}%</text>`; });
  if (!c.items.length) g += `<text x="${W / 2}" y="${top + 26}" text-anchor="middle">Nothing above this threshold</text>`;
  c.items.forEach(([l, v], i) => { const y = top + i * rh;
    g += `<text x="0" y="${y + 12}">${esc(l)}</text><rect class="${cl(v)}" x="${lw}" y="${y + 3}" width="${sx(v) - lw}" height="12"><title>${esc(l)}: ${v}%</title></rect><text x="${sx(v) + 4}" y="${y + 12}" class="lbl-strong">${v}</text>`; });
  const labs = c.labels || ["Below 80%", "80 to 100%", "Above 100%"];
  const cls = c.invert ? ["b-hot", "b-flat", "b-good"] : ["b-flat", "b-ok", "b-hot"];
  return `<svg viewBox="0 0 ${W} ${Math.max(H, top + 40)}" role="img" aria-label="Bar chart against thresholds, sample data">${g}</svg>${legend(labs.map((l, i) => [l, cls[i]]))}`;
}
function hbar(c){
  const W = 260, rh = 19, H = c.items.length * rh, lw = 76, max = Math.max(...c.items.map(x => x[1]));
  let g = ""; c.items.forEach(([l, v], i) => { const w = v / max * (W - lw - 34), y = i * rh;
    g += `<text x="0" y="${y + 13}">${esc(l)}</text><rect class="${i === 0 ? "s1" : "s2"}" x="${lw}" y="${y + 4}" width="${w}" height="12"><title>${esc(l)}: ${v}</title></rect><text x="${lw + w + 4}" y="${y + 13}" class="lbl-strong">${v}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart, sample data">${g}</svg>`;
}
function line(c){
  const W = 260, H = 110, pb = 16, pt = 16, pl = 14, n = c.v.length, sx = (W - pl * 2) / (n - 1), mn = Math.min(...c.v) * 0.85, mx = Math.max(...c.v) * 1.05, sy = v => pt + (mx - v) / (mx - mn) * (H - pb - pt);
  let g = `<line class="grid-ln" x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}"/><polyline class="ln1" style="stroke:var(--d1)" points="${c.v.map((v, i) => `${pl + i * sx},${sy(v)}`).join(" ")}"/>`;
  c.v.forEach((v, i) => { g += `<circle cx="${pl + i * sx}" cy="${sy(v)}" r="3" class="s1"><title>${esc(c.cats[i])}: ${v}</title></circle><text x="${pl + i * sx}" y="${sy(v) - 7}" text-anchor="middle" class="lbl-strong">${v}</text><text x="${pl + i * sx}" y="${H - 3}" text-anchor="middle">${esc(c.cats[i])}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart, sample data">${g}</svg>`;
}
function map(){
  const pts = [[118,58,"site"],[96,44,"on"],[146,70,"on"],[80,84,"on"],[60,40,"off"],[170,36,"off"],[188,88,"off"],[42,96,"off"],[130,100,"off"]];
  let g = `<path class="map-land" d="M18 40 L60 18 L130 14 L196 24 L238 52 L232 98 L190 118 L120 122 L58 112 L20 86 Z"/>`;
  pts.forEach(([x, y, t]) => { if (t === "on") g += `<line x1="118" y1="58" x2="${x}" y2="${y}" style="stroke:var(--d2);stroke-width:1;stroke-dasharray:2 2"/>`; });
  pts.forEach(([x, y, t]) => { g += t === "site" ? `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" class="s1"><title>Selected site</title></rect>` : `<circle cx="${x}" cy="${y}" r="${t === "on" ? 4.5 : 3.5}" class="${t === "on" ? "s2" : "s4"}"><title>${t === "on" ? "Onboarded partner" : "Other partner"}</title></circle>`; });
  return `<svg viewBox="0 0 260 132" role="img" aria-label="Map of the site and partner facilities, sample data">${g}</svg>${legend([["Site", "s1"], ["Onboarded partner", "s2"], ["Other partner", "s4"]])}`;
}
function chart(c){ return ({ stack, combo, band, hbar, line, map })[c.type](c); }

function table(t){
  const R = i => (t.right || []).includes(i);
  if (!t.rows.length) return `<p class="mock-empty">${esc(t.empty || "No data for this selection.")}</p>`;
  const cell = (v, i) => Array.isArray(v) ? (v[1].startsWith("pill") ? `<td${R(i) ? ' class="r"' : ""}><span class="${v[1]}">${esc(v[0])}</span></td>` : `<td class="${v[1]}${R(i) ? " r" : ""}">${esc(v[0])}</td>`) : `<td${R(i) ? ' class="r"' : ""}>${esc(v)}</td>`;
  return `<div class="tscroll"><table class="mtable"><thead><tr>${t.cols.map((c, i) => `<th${R(i) ? ' class="r"' : ""}>${esc(c)}</th>`).join("")}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(cell).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function heat(h){
  const cls = v => v > 100 ? "hhot" : v >= 80 ? "h2c" : "h1c";
  if (!h.rows.length) return `<p class="mock-empty">Nobody above this threshold.</p>`;
  return `<div class="tscroll"><table class="mtable"><thead><tr><th>${esc(h.label)}</th>${h.cols.map(c => `<th class="r">${esc(c)}</th>`).join("")}</tr></thead><tbody>${h.rows.map(([n, vs]) => `<tr><td>${esc(n)}</td>${vs.map(v => `<td class="r ${cls(v)}">${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function cell(x){
  let b = "";
  if (x.chart) b = chart(x.chart); else if (x.table) b = table(x.table); else if (x.heat) b = heat(x.heat);
  else if (x.fields) b = `<dl class="fields">${x.fields.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
  else if (x.partners) b = `<div class="partners">${x.partners.map(p => `<div class="partner"><b>${esc(p[0])}</b>${p.slice(1).map(s => `<span>${esc(s)}</span>`).join("")}</div>`).join("")}</div>`;
  return `<div class="mock-cell${x.zone ? ` z${x.zone}` : ""}"><h5>${esc(x.title)}</h5>${b}</div>`;
}
/* Interactive mock: state = { page, t: { toggleId: index } } */
function mock(key, state){
  const m = SITE.mocks[key], p = m.pages[state.page] || m.pages[0], out = p.build(state);
  const nav = m.pages.length > 1 ? `<div class="mock-nav" role="tablist" aria-label="Report pages">${m.pages.map((pg, i) => `<button type="button" role="tab" aria-selected="${i === state.page}" data-mpage="${i}">${esc(pg.name)}</button>`).join("")}</div>` : "";
  const tg = (p.toggles || []).map(t => `<span class="mock-toggle" role="group" aria-label="${esc(t.opts.join(" or "))}">${t.opts.map((o, i) => `<button type="button" aria-pressed="${(state.t[t.id] || 0) === i}" data-mtog="${t.id}" data-mval="${i}">${esc(o)}</button>`).join("")}</span>`).join("");
  return `<div class="mock-top"><span class="mock-title">${esc(p.name)}</span><span class="mock-tag">Sample data</span></div>${nav}
    <div class="mock-filters">${(p.filters || []).map(f => `<span>${esc(f)}</span>`).join("")}${tg}</div>
    ${out.kpis ? `<div class="mock-kpis">${out.kpis.map(k => `<div class="mock-kpi"><b class="num">${esc(k.v)}</b><small>${esc(k.l)}</small>${k.d ? `<em class="${k.s}">${esc(k.d)}</em>` : ""}</div>`).join("")}</div>` : `<div style="height:8px"></div>`}
    ${out.rows.map(r => `<div class="mock-row" style="grid-template-columns:${r.cols}">${r.cells.map(cell).join("")}</div>`).join("")}`;
}
function flow(steps){
  return `<ol class="flow">${steps.map(([n, h, t]) => { const w = n.startsWith("word:"); return `<li><div class="f-n num${w ? " word" : ""}">${esc(w ? n.slice(5) : n)}</div><div class="f-t"><b>${esc(h)}</b>${esc(t)}</div></li>`; }).join("")}</ol>`;
}
/* Model view: tables as cards, relationships as lines with * and 1 ends */
function modelView(spec){
  const TW = 150, TH = 54, byId = {}; spec.tables.forEach(t => byId[t.id] = t);
  const ctr = t => [t.x + (t.w || TW) / 2, t.y + TH / 2];
  const KIND = { fact: "Fact", dim: "Dimension", bridge: "Bridge", snap: "Snapshot", model: "Semantic model", report: "Reports", source: "Source" };
  let g = "";
  spec.links.forEach(([a, b]) => { const A = byId[a], B = byId[b]; if (!A || !B) return; const [x1, y1] = ctr(A), [x2, y2] = ctr(B);
    g += `<line class="mv-rel" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; });
  spec.tables.forEach(t => { const w = t.w || TW;
    g += `<g class="mv-t mv-${t.k}"><rect x="${t.x}" y="${t.y}" width="${w}" height="${TH}" class="mv-box"/><rect x="${t.x}" y="${t.y}" width="${w}" height="4" class="mv-band"/>
      <text x="${t.x + 10}" y="${t.y + 24}" class="mv-name">${esc(t.n)}</text>
      <text x="${t.x + 10}" y="${t.y + 41}" class="mv-kind">${esc(KIND[t.k] || "")}${t.mode ? `, ${esc(t.mode)}` : ""}${t.note ? `, ${esc(t.note)}` : ""}</text></g>`; });
  return `<div class="tscroll"><svg class="mv" viewBox="0 0 640 300" role="img" aria-label="Simplified model diagram">${g}</svg></div>`;
}
/* Sketch drawings for Story mode. pathLength=1 lets CSS draw them in. */
const P = d => `<path pathLength="1" d="${d}"/>`;
const SKETCH = {
  problem: P("M20 90 L45 60 L62 74 L90 30") + P("M120 40 C140 20, 160 70, 140 80 C120 92, 110 50, 135 48 C158 46, 162 92, 180 70") + P("M30 112 L180 112") + P("M60 22 l8 8 m0 -8 l-8 8"),
  approach: P("M30 30 h80 v64 h-80 z") + P("M30 52 h80 M30 72 h80 M70 30 v64") + P("M128 92 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0") + P("M144 108 L170 130"),
  build: P("M30 104 h50 v-30 h-50 z") + P("M90 104 h50 v-30 h-50 z") + P("M60 70 h50 v-30 h-50 z") + P("M150 104 h30 v-60 h-30 z"),
  result: P("M24 112 L24 24 M24 112 L190 112") + P("M34 100 L70 82 L100 88 L140 52 L176 34") + P("M164 32 l12 2 l-4 12") + P("M120 100 l8 8 l18 -20"),
  start: P("M100 30 L170 58 L100 86 L30 58 Z") + P("M60 70 v24 c20 14 60 14 80 0 v-24") + P("M170 58 v30"),
  learn: P("M30 40 c30 -10 50 -10 70 6 c20 -16 40 -16 70 -6 v66 c-30 -10 -50 -10 -70 6 c-20 -16 -40 -16 -70 -6 z") + P("M100 46 v66"),
  next: P("M100 26 a44 44 0 1 1 -0.1 0") + P("M100 46 v28 l18 12") + P("M58 130 h14 M93 130 h14 M128 130 h14")
};
function sketch(stage){ return `<svg class="sketch" viewBox="0 0 200 140" aria-hidden="true">${SKETCH[stage] || SKETCH.build}</svg>`; }

window.Charts = { esc, chart, table, heat, mock, flow, modelView, sketch, legend };
})();
