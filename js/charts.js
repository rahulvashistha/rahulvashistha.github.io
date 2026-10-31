/* Small SVG chart, model-view and sketch helpers. No dependencies. */
(function(){
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const COL = { s1: "--d1", s2: "--d2", s3: "--d3", s4: "--d4", s5: "--d5", s6: "--d6", "b-flat": "--flat", "b-ok": "--d2", "b-hot": "--bad", "b-good": "--good", s7: "--good" };
function legend(items){ return `<div class="legend">${items.map(([n, c]) => `<span><i style="background:var(${COL[c]})"></i>${esc(n)}</span>`).join("")}</div>`; }

function stack(c){
  const W = c.W || 260, H = 118, pb = 16, pt = c.totals ? 14 : 4, n = c.cats.length, gap = W / n, bw = gap * 0.6;
  const tot = c.cats.map((_, i) => c.series.reduce((s, x) => s + x.v[i], 0)), max = Math.max(...tot, 1);
  let g = `<line class="grid-ln" x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}"/>`;
  c.cats.forEach((cat, i) => { let y = H - pb; const x = i * gap + (gap - bw) / 2;
    c.series.forEach(s => { const h = s.v[i] / max * (H - pb - pt); if (h > 0) { y -= h; g += `<rect class="${s.cls} bv" x="${x}" y="${y}" width="${bw}" height="${h}"><title>${esc(cat)}, ${esc(s.name)}: ${s.v[i]}</title></rect>`; } });
    g += `<text x="${x + bw / 2}" y="${H - 3}" text-anchor="middle">${esc(cat)}</text>${c.totals ? `<text x="${x + bw / 2}" y="${y - 3}" text-anchor="middle" class="lbl-strong">${tot[i].toLocaleString("en-US")}</text>` : ""}`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Stacked column chart, sample data">${g}</svg>${legend(c.series.map(s => [s.name, s.cls]))}`;
}
function combo(c){
  const W = c.W || 260, H = 118, pb = 16, pt = 8, n = c.cats.length, gap = W / n, bw = gap * 0.58, max = Math.max(...c.bars);
  const lmin = Math.min(...c.line) - 1, lmax = Math.max(...c.line) + 1, ly = v => pt + (lmax - v) / (lmax - lmin) * (H - pb - pt);
  let g = `<line class="grid-ln" x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}"/>`;
  c.bars.forEach((v, i) => { const h = v / max * (H - pb - pt - 14), x = i * gap + (gap - bw) / 2;
    g += `<rect class="s1 bv" x="${x}" y="${H - pb - h}" width="${bw}" height="${h}"><title>${esc(c.cats[i])}: ${v}${c.unit || ""}</title></rect><text x="${x + bw / 2}" y="${H - 3}" text-anchor="middle">${esc(c.cats[i])}</text>${c.barLabels ? `<text x="${x + bw / 2}" y="${H - pb - h + 9}" text-anchor="middle" class="on-bar">${v.toLocaleString("en-US")}${c.unit || ""}</text>` : ""}`; });
  g += `<polyline class="ln1" points="${c.line.map((v, i) => `${i * gap + gap / 2},${ly(v)}`).join(" ")}"/>`;
  c.line.forEach((v, i) => { const cls = c.neutral ? "s3" : v > 0 ? "b-good" : v < 0 ? "b-hot" : "b-flat";
    g += `<circle cx="${i * gap + gap / 2}" cy="${ly(v)}" r="2.8" class="${cls}"><title>${esc(c.cats[i])}: ${c.neutral ? v : (v > 0 ? "+" : "") + v + "%"}</title></circle>`;
    if (c.labels) g += `<text x="${i * gap + gap / 2}" y="${ly(v) - 5}" text-anchor="middle" class="lbl-strong">${c.neutral ? v : (v > 0 ? "+" : "") + v + "%"}</text>`; });
  const names = c.names || ["Volume", "Growth"];
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Column and line chart, sample data">${g}</svg>${c.neutral ? legend([[names[0], "s1"], [names[1], "s3"]]) : legend([[names[0], "s1"], ["Growth up", "b-good"], ["No change", "b-flat"], ["Down", "b-hot"]])}`;
}
function band(c){
  const W = c.W || 260, rh = 19, top = 12, H = c.items.length * rh + top, lw = 72, pw = W - lw - 26, sx = v => lw + v / c.max * pw;
  const cl = v => c.invert ? (v > c.th[1] ? "b-good" : v >= c.th[0] ? "b-flat" : "b-hot") : (v > c.th[1] ? "b-hot" : v >= c.th[0] ? "b-ok" : "b-flat");
  let g = "";
  c.th.forEach(t => { g += `<line class="ln-th" x1="${sx(t)}" y1="${top - 4}" x2="${sx(t)}" y2="${Math.max(H, top + 40)}"/><text x="${sx(t)}" y="${top - 6}" text-anchor="middle">${t}%</text>`; });
  if (!c.items.length) g += `<text x="${W / 2}" y="${top + 26}" text-anchor="middle">Nothing above this threshold</text>`;
  c.items.forEach(([l, v], i) => { const y = top + i * rh;
    g += `<text x="0" y="${y + 12}">${esc(l)}</text><rect class="${cl(v)} bh" x="${lw}" y="${y + 3}" width="${sx(v) - lw}" height="12"><title>${esc(l)}: ${v}%</title></rect><text x="${sx(v) + 4}" y="${y + 12}" class="lbl-strong">${v}</text>`; });
  const labs = c.labels || ["Below 80%", "80 to 100%", "Above 100%"];
  const cls = c.invert ? ["b-hot", "b-flat", "b-good"] : ["b-flat", "b-ok", "b-hot"];
  return `<svg viewBox="0 0 ${W} ${Math.max(H, top + 40)}" role="img" aria-label="Bar chart against thresholds, sample data">${g}</svg>${legend(labs.map((l, i) => [l, cls[i]]))}`;
}
function hbar(c){
  const W = c.W || 260, rh = 19, H = c.items.length * rh, lw = 76, max = Math.max(...c.items.map(x => x[1]));
  let g = ""; c.items.forEach(([l, v], i) => { const w = v / max * (W - lw - 34), y = i * rh;
    g += `<text x="0" y="${y + 13}">${esc(l)}</text><rect class="${i === 0 ? "s1" : "s2"} bh" x="${lw}" y="${y + 4}" width="${w}" height="12"><title>${esc(l)}: ${v}</title></rect><text x="${lw + w + 4}" y="${y + 13}" class="lbl-strong">${v}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart, sample data">${g}</svg>`;
}
function line(c){
  const W = c.W || 260, H = 110, pb = 16, pt = 16, pl = 14, n = c.v.length, sx = (W - pl * 2) / (n - 1), mn = Math.min(...c.v) * 0.85, mx = Math.max(...c.v) * 1.05, sy = v => pt + (mx - v) / (mx - mn) * (H - pb - pt);
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
/* Clustered columns (actual vs goal) with a performance line */
function cluster(c){
  const W = c.W || 260, H = 124, pb = 16, pt = 16, n = c.cats.length, gap = W / n, bw = gap * 0.32, max = Math.max(...c.a, ...c.b);
  const lmin = Math.min(...c.line) - 4, lmax = Math.max(...c.line) + 4, ly = v => pt + (lmax - v) / (lmax - lmin) * (H - pb - pt - 30);
  let g = `<line class="grid-ln" x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}"/>`;
  c.cats.forEach((cat, i) => { const x = i * gap + gap * 0.18, ha = c.a[i] / max * (H - pb - pt), hb = c.b[i] / max * (H - pb - pt);
    g += `<rect class="s2 bv" x="${x}" y="${H - pb - ha}" width="${bw}" height="${ha}"><title>${esc(cat)} actual: ${c.a[i]}</title></rect><rect class="s1 bv" x="${x + bw}" y="${H - pb - hb}" width="${bw}" height="${hb}"><title>${esc(cat)} goal: ${c.b[i]}</title></rect><text x="${i * gap + gap / 2}" y="${H - 3}" text-anchor="middle">${esc(cat)}</text>`; });
  g += `<polyline class="ln1" points="${c.line.map((v, i) => `${i * gap + gap / 2},${ly(v)}`).join(" ")}"/>`;
  c.line.forEach((v, i) => { g += `<circle cx="${i * gap + gap / 2}" cy="${ly(v)}" r="2.6" class="${v >= 100 ? "b-good" : "b-hot"}"><title>${esc(c.cats[i])}: ${v}%</title></circle><text x="${i * gap + gap / 2}" y="${ly(v) - 5}" text-anchor="middle" class="lbl-strong">${v}%</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Actuals against goals, sample data">${g}</svg>${legend([["Actuals", "s2"], ["Goals", "s1"], ["Performance %", "s3"]])}`;
}
/* 100% stacked columns with a total-volume line above */
function stack100(c){
  const W = c.W || 260, H = 128, top = 26, pb = 16, n = c.cats.length, gap = W / n, bw = gap * 0.62, h = H - top - pb;
  let g = "";
  c.cats.forEach((cat, i) => { let y = H - pb; const x = i * gap + (gap - bw) / 2;
    c.series.forEach(s => { const sh = s.v[i] / 100 * h; y -= sh; g += `<rect class="${s.cls} bv" x="${x}" y="${y}" width="${bw}" height="${sh}"><title>${esc(cat)}, ${esc(s.name)}: ${s.v[i]}%</title></rect>${s.v[i] >= 9 ? `<text x="${x + bw / 2}" y="${y + sh / 2 + 3}" text-anchor="middle" class="on-bar">${s.v[i]}%</text>` : ""}`; });
    g += `<text x="${x + bw / 2}" y="${H - 3}" text-anchor="middle">${esc(cat)}</text><circle cx="${x + bw / 2}" cy="${top - 12}" r="2.6" class="s5"/><text x="${x + bw / 2}" y="${top - 17}" text-anchor="middle" class="lbl-strong">${esc(c.line[i])}</text>`; });
  g += `<polyline style="stroke:var(--d5);fill:none;stroke-width:1.6" points="${c.cats.map((_, i) => `${i * gap + gap / 2},${top - 12}`).join(" ")}"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Share of volume, sample data">${g}</svg>${legend([...c.series.map(s => [s.name, s.cls]), [c.lineName || "Total", "s5"]])}`;
}
/* Scatter of growth against volume */
function scatter(c){
  const W = c.W || 260, H = 120, pl = 26, pb = 18, mx = Math.max(...c.pts.map(p => p[0])), my = Math.max(...c.pts.map(p => p[1])), mn = Math.min(0, ...c.pts.map(p => p[1]));
  const sx = v => pl + v / mx * (W - pl - 8), sy = v => 6 + (my - v) / (my - mn) * (H - pb - 6);
  let g = `<line class="grid-ln" x1="${pl}" y1="${sy(0)}" x2="${W}" y2="${sy(0)}"/><text x="0" y="${sy(0) + 3}">0%</text><text x="0" y="${sy(my) + 6}">${my}%</text><text x="${W / 2}" y="${H - 2}" text-anchor="middle">${esc(c.xl || "")}</text>`;
  c.pts.forEach(([x, y]) => { g += `<circle cx="${sx(x)}" cy="${sy(y)}" r="3" class="s1" style="fill-opacity:.55"><title>${x} doses, ${y}% growth</title></circle>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Scatter of growth against volume, sample data">${g}</svg>`;
}
/* Pie or donut with value labels */
function pie(c){
  const W = c.W || 260, H = 150, cx = W / 2, cy = 72, r = 62, ri = c.donut ? 34 : 0, tot = c.items.reduce((a, x) => a + x[1], 0) || 1;
  let a0 = -Math.PI / 2, g = "";
  const pt = (ang, rad) => [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
  c.items.forEach(([l, v, cls]) => {
    const a1 = a0 + v / tot * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0, [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
    let d = `M${x0},${y0} A${r},${r} 0 ${big} 1 ${x1},${y1}`;
    if (ri) { const [x2, y2] = pt(a1, ri), [x3, y3] = pt(a0, ri); d += ` L${x2},${y2} A${ri},${ri} 0 ${big} 0 ${x3},${y3} Z`; } else d += ` L${cx},${cy} Z`;
    g += `<path class="${cls} pie-s" d="${d}"><title>${esc(l)}: ${v}</title></path>`;
    const [lx, ly] = pt((a0 + a1) / 2, ri ? (r + ri) / 2 : r * 0.62);
    if (v / tot > 0.07) g += `<text x="${lx}" y="${ly + 3}" text-anchor="middle" class="on-pie">${v}</text>`;
    a0 = a1; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.donut ? "Donut" : "Pie"} chart, sample data">${g}</svg>${legend(c.items.map(x => [x[0], x[2]]))}`;
}
/* Horizontal paired bars: completed vs estimated */
function hpair(c){
  const W = c.W || 260, rh = 30, H = c.items.length * rh + 4, lw = 92, max = Math.max(...c.items.flatMap(x => [x[1], x[2] || 0]));
  let g = ""; c.items.forEach(([l, a, b], i) => { const y = i * rh + 2, wa = a / max * (W - lw - 34), wb = (b || 0) / max * (W - lw - 34);
    g += `<text x="0" y="${y + 15}">${esc(l)}</text><rect class="s1 bh" x="${lw}" y="${y}" width="${wa}" height="12"><title>${esc(l)} completed: ${a}</title></rect><text x="${lw + wa + 3}" y="${y + 10}" class="lbl-strong">${a}</text>`;
    if (b) g += `<rect class="s2 bh" x="${lw}" y="${y + 13}" width="${wb}" height="12"><title>${esc(l)} estimated: ${b}</title></rect><text x="${lw + wb + 3}" y="${y + 23}">${b}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Completed against estimated, sample data">${g}</svg>${legend([[c.names ? c.names[0] : "Completed", "s1"], [c.names ? c.names[1] : "Estimated", "s2"]])}`;
}
/* Grouped columns, several series side by side */
function group(c){
  const W = c.W || 260, H = 118, pb = 16, pt = 12, n = c.cats.length, gap = W / n, k = c.series.length, bw = gap * 0.7 / k, max = Math.max(...c.series.flatMap(s => s.v), 1);
  let g = `<line class="grid-ln" x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}"/>`;
  c.cats.forEach((cat, i) => { c.series.forEach((s, j) => { const v = s.v[i], h = v / max * (H - pb - pt), x = i * gap + gap * 0.15 + j * bw;
      if (v) g += `<rect class="${s.cls} bv" x="${x}" y="${H - pb - h}" width="${bw - 1}" height="${h}"><title>${esc(cat)}, ${esc(s.name)}: ${v}</title></rect><text x="${x + bw / 2}" y="${H - pb - h - 3}" text-anchor="middle" class="lbl-strong">${v}</text>`; });
    g += `<text x="${i * gap + gap / 2}" y="${H - 3}" text-anchor="middle">${esc(cat)}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grouped column chart, sample data">${g}</svg>${legend(c.series.map(s => [s.name, s.cls]))}`;
}
function chart(c){ return ({ stack, combo, band, hbar, line, map, cluster, stack100, scatter, pie, hpair, group })[c.type](c); }
/* Gauge: estimate used, with an 80% marker */
function gauge(title, pct){
  const cx = 60, cy = 58, r = 44, w = 14, pt = (f, rad) => [cx - rad * Math.cos(Math.PI * f), cy - rad * Math.sin(Math.PI * f)];
  const arc = (f0, f1, cls) => { const [x0, y0] = pt(f0, r), [x1, y1] = pt(f1, r); return `<path d="M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}" class="${cls}" fill="none" stroke-width="${w}"/>`; };
  const v = pct === null ? null : Math.min(pct, 100) / 100, cls = pct === null ? "" : pct > 100 ? "g-over" : pct >= 95 ? "g-hot" : "g-ok";
  const [mx0, my0] = pt(0.8, r - w / 2 - 1), [mx1, my1] = pt(0.8, r + w / 2 + 1);
  return `<div class="gauge"><h6 title="${esc(title)}">${esc(title)}</h6><svg viewBox="0 0 120 70" role="img" aria-label="${esc(title)}: ${pct === null ? "no estimate" : pct + "%"}">
    ${arc(0, 1, "g-bg")}${v ? arc(0, v, cls) : ""}<line x1="${mx0}" y1="${my0}" x2="${mx1}" y2="${my1}" class="g-mark"/>
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" class="g-val">${pct === null ? "(Blank)" : pct + "%"}</text><text x="${pt(0.8, r + 14)[0]}" y="${pt(0.8, r + 14)[1]}" text-anchor="middle">80%</text></svg></div>`;
}

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
function toggles(list, state){
  return (list || []).map(t => `<span class="mock-toggle${t.pills ? " pills" : ""}" role="group" aria-label="${esc(t.opts.join(" or "))}">${t.opts.map((o, i) => `<button type="button" aria-pressed="${(state.t[t.id] || 0) === i}" data-mtog="${t.id}" data-mval="${i}">${esc(o)}</button>`).join("")}</span>`).join("");
}
function cell(x, state){
  let b = "";
  if (x.group) b = x.group.map(r => row(r, state)).join("");
  else if (x.chart) b = chart(x.chart); else if (x.table) b = table(x.table); else if (x.heat) b = heat(x.heat);
  else if (x.empty) b = `<p class="mock-emptybox">${esc(x.empty)}</p>`;
  else if (x.fields) b = `<dl class="fields">${x.fields.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
  else if (x.partners) b = `<div class="partners">${x.partners.map(p => `<div class="partner"><b>${esc(p[0])}</b>${p.slice(1).map(s => `<span>${esc(s)}</span>`).join("")}</div>`).join("")}</div>`;
  else if (x.cards) b = `<div class="pcards">${x.cards.map(cd => `<div class="pcard"><div class="pcard-h">${esc(cd.title)}</div><dl>${cd.fields.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>`).join("")}</div>`;
  else if (x.radio) b = `<div class="mradio" role="radiogroup" aria-label="${esc(x.title)}"><span class="mradio-search">Search</span>${x.radio.opts.map((o, i) => `<button type="button" role="radio" aria-checked="${(state.t[x.radio.id] || 0) === i}" data-mtog="${x.radio.id}" data-mval="${i}">${esc(o)}</button>`).join("")}</div>`;
  else if (x.tiles) b = `<div class="mtiles">${x.tiles.map(([l, pg]) => `<button type="button" class="mtile" data-mpage="${pg}"><span class="mtile-i" aria-hidden="true"></span>${esc(l)}</button>`).join("")}</div>`;
  else if (x.gauges) b = `<div class="gauges">${x.gauges.map(([t, v]) => gauge(t, v)).join("")}</div>`;
  else if (x.welcome) b = `<div class="mwelcome"><h4>Welcome</h4><label>Select geography</label><div class="mwelcome-row"><span class="mselect">${esc(x.welcome.geo)}</span><button type="button" class="mgo" data-mpage="${x.welcome.go}">Go</button></div><p>${esc(x.welcome.note)}</p></div>`;
  if (x.bare) return x.group ? `<div class="mock-group">${b}</div>` : b;
  if (x.welcome) return `<div class="mock-cell welcome">${b}</div>`;
  const head = `<div class="mock-cell-head">${x.tab ? `<h5 class="tab t${x.tab}">${esc(x.title)}</h5>` : `<h5>${esc(x.title)}${x.info ? ' <i class="mi" aria-hidden="true">i</i>' : ""}</h5>`}${x.toggles ? `<div class="mock-cell-tg">${toggles(x.toggles, state)}</div>` : ""}</div>`;
  return `<div class="mock-cell${x.zone ? ` z${x.zone}` : ""}${x.tab ? " tabbed" : ""}${x.welcome ? " welcome" : ""}">${head}${b}</div>`;
}
function row(r, state){
  const n = r.cols.trim().split(/\s+/).length, W = n === 1 ? 620 : n === 2 ? 320 : 260;
  return `<div class="mock-row" style="grid-template-columns:${r.cols}">${r.cells.map(c => cell(c.chart && c.chart.type !== "map" ? { ...c, chart: { W, ...c.chart } } : c, state)).join("")}</div>`;
}
function kpi(k){
  if (k.kind === "card") return `<div class="mock-kpi card"><small>${esc(k.l)}</small><b class="num">${esc(k.v)}</b>${k.sub ? `<span class="ksub">${esc(k.sub)}</span>` : ""}${k.d ? `<em class="${k.s}">${esc(k.d)}</em>` : ""}${k.bar ? `<span class="kbar"><i style="width:${k.bar[0]}%"></i></span><span class="ksub">${esc(k.bar[1])}</span>` : ""}</div>`;
  if (k.kind === "seg") return `<div class="mock-kpi seg"><small>${esc(k.l)}</small><b class="num">${esc(k.v)}</b>${k.rows.map(([l, v, st]) => `<div class="krow"><span>${esc(l)}</span><em class="${st}">${esc(v)} ${st === "up" ? "▲" : st === "down" ? "▼" : ""}</em></div>`).join("")}</div>`;
  if (k.kind === "group") return `<div class="mock-kpi group"><small>${esc(k.l)}</small><div class="kgrid">${k.items.map(([l, v, st]) => `<div><span>${esc(l)}</span><b class="num ${st || ""}">${esc(v)}</b></div>`).join("")}</div></div>`;
  return `<div class="mock-kpi"><b class="num">${esc(k.v)}</b><small>${esc(k.l)}</small>${k.d ? `<em class="${k.s}">${esc(k.d)}</em>` : ""}</div>`;
}
const HOME_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>';
/* Interactive mock: state = { page, t: { toggleId: index } }.
   m.style "brand" draws a report header with page buttons; "band" draws a dark title band. */
function mock(key, state){
  const m = SITE.mocks[key], p = m.pages[state.page] || m.pages[0], out = p.build(state);
  const navPages = m.pages.map((pg, i) => [pg, i]).filter(([pg]) => !pg.hidden);
  let top;
  if (m.style === "brand") top = `<div class="mock-brand"><span class="mbrand-mark" aria-hidden="true"></span><span class="mbrand-name">${esc(m.brand || "")}</span>
      ${p.hidden ? "" : `<div class="mock-pills" role="tablist" aria-label="Report pages">${navPages.map(([pg, i]) => `<button type="button" role="tab" aria-selected="${i === state.page}" data-mpage="${i}">${esc(pg.name)}</button>`).join("")}</div>`}
      <span class="mock-asof">Data as of: sample</span><span class="mock-tag">Sample data</span></div>`;
  else if (m.style === "band") top = `<div class="mock-band"><span class="mbrand-mark" aria-hidden="true"></span><div><b>${esc(m.title)}</b><span>${esc(m.subtitle || "")}</span></div><span class="mock-asof">Last refresh: sample</span><span class="mock-tag">Sample data</span></div>`;
  else top = `<div class="mock-top">${m.navBottom && state.page !== 0 ? `<button type="button" class="mock-home" data-mpage="0" aria-label="Home page">${HOME_ICON}</button>` : ""}<span class="mock-title">${esc(p.title || p.name)}</span>${p.badge ? `<span class="mock-badge">${esc(p.badge)}</span>` : ""}<span class="mock-tag">Sample data</span></div>${!m.navBottom && navPages.length > 1 ? `<div class="mock-nav" role="tablist" aria-label="Report pages">${navPages.map(([pg, i]) => `<button type="button" role="tab" aria-selected="${i === state.page}" data-mpage="${i}">${esc(pg.name)}</button>`).join("")}</div>` : ""}`;
  const filt = (p.filters || []).length || (p.toggles || []).length ? `<div class="mock-filters">${(p.filters || []).map(f => `<span>${esc(f)}</span>`).join("")}${toggles(p.toggles, state)}</div>` : "";
  const kp = out.kpis ? `<div class="mock-kpis" style="grid-template-columns:repeat(${out.kpiCols || out.kpis.length},minmax(0,1fr))">${out.kpis.map(kpi).join("")}</div>` : `<div style="height:8px"></div>`;
  const bottomNav = m.navBottom ? `<div class="mock-tabs" role="tablist" aria-label="Report pages">${navPages.map(([pg, i]) => `<button type="button" role="tab" aria-selected="${i === state.page}" data-mpage="${i}">${esc(pg.name)}</button>`).join("")}</div>` : "";
  return `${top}${filt}${kp}${out.rows.map(r => row(r, state)).join("")}${bottomNav}`;
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
