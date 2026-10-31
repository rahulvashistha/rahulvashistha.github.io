/* RECREATED REPORTS. Page names, filters and layout follow the real reports.
   Every value, name and label here is invented sample data.
   Each page has a build(state) function; state.t holds the selected option of each toggle.
   Report options: style "brand" (header with page buttons) or "band" (dark title band); start (first page index).
   Page options: hidden (left out of the page buttons, e.g. a welcome page). See MAINTAINING.md for cell types. */
(function(){
  const W8 = ["W1","W2","W3","W4","W5","W6","W7","W8"], M6 = ["Jan","Feb","Mar","Apr","May","Jun"], Q4 = ["Q1","Q2","Q3","Q4"];
  const M10 = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"];
  const P10 = ["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];
  const SEG = ["Core","Contested","Emerging","Limited","Unsegmented"];
  const pick = (s, id, arr) => arr[s.t[id] || 0];
  const split = (tot, shares) => tot.map(t => shares.map(f => Math.round(t * f)));
  const series = (names, cls, rows) => names.map((n, j) => ({ name: n, cls: cls[j], v: rows.map(r => r[j]) }));

  /* ---------- Lantheus commercial platform (sample data) ---------- */
  const calls = [820,1190,1150,1390,1710,2240,2190,1730,1440,910];
  const doses = [17240,14610,16880,15020,15930,18110,17260,15840,16720,16950];
  const sites = [1112,1086,1098,1101,1109,1124,1131,1110,1116,1121];

  SITE.mocks = {
    pyl: { title: "Commercial analytics", style: "brand", brand: "Product A", start: 0, pages: [
      { name: "Welcome", hidden: true,
        build: s => ({ rows: [{ cols: "1fr", cells: [{ title: "Welcome", bare: false, welcome: { geo: "National", go: 1, note: "Pick a geography, then press Go. Go only unlocks for geographies your access allows, so security is decided before any page loads." } }] }] }) },

      { name: "Execution", filters: ["Geography: National", "Time period: R3M", "Segment: All", "Account type: All", "View by: Month"],
        build: s => {
          const m = s.t.ex || 0;
          const charts = [
            { title: "Calls trend", chart: { type: "combo", cats: M10, bars: calls, line: [0,45,-3,21,23,31,-2,-21,-17,-37], unit: "", barLabels: true } },
            { title: "Calls by segment", chart: { type: "stack", cats: M10, series: series(SEG, ["s1","s2","s3","s6","s4"], split(calls, [.32,.27,.18,.13,.10])) } },
            { title: "Calls by channel", chart: { type: "stack", cats: M10, series: series(["Face to face","Phone","Video","Email"], ["s1","s2","s6","s4"], split(calls, [.62,.24,.09,.05])) } },
            { title: "Reach trend (%)", chart: { type: "line", cats: M10, v: [12.1,17.4,18.0,16.9,28.4,39.8,38.7,31.2,24.5,17.3] } },
            { title: "Target call frequency", chart: { type: "line", cats: M10, v: [2.2,2.6,2.7,2.9,3.3,3.9,3.8,3.4,3.1,2.4] } },
            { title: "Program trend", chart: { type: "combo", cats: M10, bars: [15,96,21,18,88,92,9,52,70,4], line: [5,7,2,2,9,12,2,3,8,1], neutral: true, labels: true, names: ["Attendees", "Programs"] } }
          ][m];
          return {
            kpis: [{ kind: "card", v: "2.1", l: "Avg calls per day" }, { kind: "card", v: "52.3%", l: "Target reach", sub: "Sites reached: 1,184" },
                   { kind: "card", v: "3.6", l: "Target call frequency" }, { kind: "card", v: "12", l: "Programs", sub: "118 attendees", bar: [78, "Prescriber 78%, non-prescriber 22%"] }],
            rows: [
              { cols: "1fr", cells: [{ ...charts, info: true, toggles: [{ id: "ex", opts: ["Calls", "Segment", "Channel", "Reach %", "Call freq.", "Programs"], pills: true }] }] },
              { cols: "1fr", cells: [{ title: "Site engagement summary", info: true, table: { cols: ["Site ID", "Site", "Segment", "Account type", "Site of care", "Rep", "Territory", "Calls", "Days since call"], right: [7, 8], rows: [
                ["4000010142", "Site 0142", "Core", "Hospital", "Hospital", "Rep 07", "Territory 112", "44", "2"],
                ["4000010377", "Site 0377", "Contested", "Non-hospital", "Imaging", "Rep 03", "Territory 208", "29", "5"],
                ["4000010519", "Site 0519", "Contested", "Hospital", "Hospital", "Rep 11", "Territory 305", "23", ["19", "down"]],
                ["4000010608", "Site 0608", "Limited", "", "", "Rep 05", "Territory 131", "21", "8"]] } }] }
            ]
          };
        } },

      { name: "Performance", filters: ["Geography: National", "Time period: R3M", "Parent account: All", "Site of care: All", "Segment: All", "View by: Month"],
        build: s => {
          const v = s.t.pv || 0, info = s.t.ss || 0;
          const left = [
            { type: "combo", cats: P10, bars: doses.map(d => +(d / 1000).toFixed(1)), line: [0,-15,16,-11,6,14,-5,-8,6,1], unit: "K", barLabels: true },
            { type: "stack", cats: P10, series: series(SEG, ["s1","s2","s3","s6","s4"], split(doses.map(d => d / 1000), [.84,.12,.02,.01,.01]).map(r => r.map(x => +x.toFixed(1)))) },
            { type: "stack", cats: P10, series: series(["Hospital","Imaging","Oncology","Urology","Other"], ["s6","s4","s1","s2","s3"], split(doses.map(d => d / 1000), [.52,.22,.12,.09,.05]).map(r => r.map(x => +x.toFixed(1)))) },
            { type: "stack", cats: P10, series: series(["Program", "Non-program"], ["s1","s2"], split(doses.map(d => d / 1000), [.21,.79]).map(r => r.map(x => +x.toFixed(1)))) }
          ][v];
          const right = v === 3 ? { title: "Ordering sites", info: true, empty: "Program view doesn’t apply to ordering sites." }
            : { title: "Ordering sites", info: true, chart: v === 0 ? { type: "combo", cats: P10, bars: sites, line: [0,-2,1,0,1,1,1,-2,1,0], unit: "" }
              : { type: "stack", cats: P10, series: v === 1 ? series(SEG, ["s1","s2","s3","s6","s4"], split(sites, [.72,.18,.05,.03,.02])) : series(["Hospital","Imaging","Oncology","Urology","Other"], ["s6","s4","s1","s2","s3"], split(sites, [.47,.22,.13,.12,.06])) } };
          return {
            kpis: [{ kind: "card", v: "54,210", l: "Shipped doses", sub: "Growth vs prior R3M", d: "+4.8% ▲", s: "up" }, { kind: "card", v: "1,204", l: "Ordering sites", sub: "Growth vs prior R3M", d: "+2.6% ▲", s: "up" }], kpiCols: 2,
            rows: [
              { cols: "1fr 1fr", cells: [{ title: ["Doses trend", "Doses by segment", "Doses by site of care", "Doses by program"][v], info: true, toggles: [{ id: "pv", opts: ["Overall", "Segment", "Site of care", "Program"], pills: true }], chart: left }, right] },
              { cols: "1fr 1fr", cells: [
                { title: "Site overview", info: true, chart: { type: "scatter", xl: "Current shipped doses", pts: [[12,40],[18,12],[22,-8],[30,5],[41,18],[55,-12],[60,3],[72,9],[88,-4],[95,22],[120,6],[140,-9],[180,4],[210,12],[260,-3],[320,7],[410,2],[480,5],[35,85],[15,140]] } },
                info ? { title: "Site status", info: true, toggles: [{ id: "ss", opts: ["Chart", "Site info"] }], table: { cols: ["Month", "Site ID", "Site", "Status"], rows: [["Oct", "4000020011", "Site 2011", "Winback"], ["Oct", "4000020034", "Site 2034", "New"], ["Oct", "4000020058", "Site 2058", "At risk"], ["Oct", "4000020072", "Site 2072", "Lost"]] } }
                     : { title: "Site status", info: true, toggles: [{ id: "ss", opts: ["Chart", "Site info"] }], chart: { type: "stack", cats: P10, series: [{ name: "New", cls: "s2", v: [18,12,9,15,10,12,15,9,9,9] }, { name: "At risk", cls: "s3", v: [2,3,3,2,2,1,2,2,3,2] }, { name: "Lost", cls: "s5", v: [3,2,5,5,2,1,5,6,2,2] }, { name: "Winback", cls: "s1", v: [20,12,15,21,20,19,17,20,21,15] }] } }
              ] }
            ]
          };
        } },

      { name: "Opportunity", filters: ["Geography: National", "Time period: R3M", "Segment: All", "Site of care: All", "Parent account: All", "Primary partner: All", "Nearest partner: All"],
        build: s => ({
          kpis: [
            { kind: "seg", l: "Core sites", v: "1,060", rows: [["Product growth", "+0.8%", "up"], ["Market growth", "+1.1%", "up"], ["Share change", "−1.4%", "down"]] },
            { kind: "seg", l: "Contested sites", v: "402", rows: [["Product growth", "−2.1%", "down"], ["Market growth", "+0.3%", "up"], ["Share change", "−1.9%", "down"]] },
            { kind: "seg", l: "Emerging sites", v: "298", rows: [["Product growth", "+84.2%", "up"], ["Market growth", "+5.1%", "up"], ["Share change", "+1.2%", "up"]] },
            { kind: "seg", l: "Limited sites", v: "371", rows: [["Product growth", "−0.9%", "down"], ["Market growth", "+0.6%", "up"], ["Share change", "+0.4%", "up"]] },
            { kind: "seg", l: "Unsegmented sites", v: "240", rows: [["Product growth", "+41.0%", "up"], ["Market growth", "+22.5%", "up"], ["Share change", "−2.7%", "down"]] }
          ],
          rows: [
            { cols: "1fr 1fr", cells: [
              { title: "Class share and volume", info: true, chart: { type: "stack100", cats: ["Q1", "Q2"], series: [{ name: "Product A", cls: "s6", v: [48, 46] }, { name: "Competitor B", cls: "s1", v: [28, 26] }, { name: "Competitor C", cls: "s4", v: [3, 4] }, { name: "Competitor D", cls: "s3", v: [12, 14] }, { name: "Competitor E", cls: "s5", v: [9, 10] }], line: ["71.4K", "72.9K"], lineName: "Class volume" } },
              { title: "Volume and segment mix", info: true, chart: { type: "stack100", cats: ["Q1", "Q2"], series: [{ name: "Core", cls: "s1", v: [14, 13] }, { name: "Contested", cls: "s2", v: [80, 81] }, { name: "Other", cls: "s4", v: [6, 6] }], line: ["51.2K", "52.0K"], lineName: "Product A volume" } }
            ] },
            { cols: "1fr", cells: [{ title: "Site opportunity", info: true, table: { cols: ["Site ID", "Site", "City", "State", "Site of care", "Segment"], rows: [["4000030266", "Site 0266", "City 12", "State 04", "Mobile", "Core"], ["4000030616", "Site 0616", "City 31", "State 17", "Imaging", "Emerging"], ["4000030930", "Site 0930", "City 07", "State 30", "Imaging", "Core"]] } }] }
          ]
        }) },

      { name: "Quota", filters: ["Region: All", "Territory: All", "Rep: All"],
        toggles: [{ id: "qg", opts: ["Weekly", "Monthly", "Quarterly"], pills: true }],
        build: s => {
          const g = s.t.qg || 0;
          const K = [
            [["Week to date", [["Actuals", "3,912"], ["Goals", "3,800"], ["Perf %", "102.9%", "up"]]], ["Previous week", [["Actuals", "4,410"], ["Goals", "4,560"], ["Perf %", "96.7%", "down"]]], ["Previous week status", [["Variance", "−150", "down"], ["Perf %", "96.7%", "down"], ["Status", "Below", "down"]]]],
            [["Year to date", [["Actuals", "171,880"], ["Goals", "170,420"], ["Perf %", "100.9%", "up"]]], ["Month to date", [["Actuals", "17,920"], ["Goals", "17,610"], ["Perf %", "101.8%", "up"]]], ["Previous month status", [["Variance", "−610", "down"], ["Perf %", "96.8%", "down"], ["Status", "Below", "down"]]]],
            [["Year to date", [["Actuals", "171,880"], ["Goals", "170,420"], ["Perf %", "100.9%", "up"]]], ["Quarter to date", [["Actuals", "39,840"], ["Goals", "38,900"], ["Perf %", "102.4%", "up"]]], ["Previous quarter status", [["Variance", "+1,210", "up"], ["Perf %", "102.1%", "up"], ["Status", "Above", "up"]]]]
          ][g];
          const C = [
            { cats: ["W1","W2","W3","W4","W5","W6","W7","W8"], a: [3.9,4.0,4.0,4.1,3.3,4.0,4.1,4.2], b: [4.0,4.0,4.0,4.2,3.4,4.2,4.2,4.3], line: [97.5,100.0,100.0,97.6,97.1,95.2,97.6,97.7] },
            { cats: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"], a: [15.8,16.4,18.7,18.0,16.4,17.3,17.5,16.8,17.1,17.9], b: [15.2,16.1,17.8,18.0,16.4,17.7,18.1,16.9,17.8,17.6], line: [103.9,101.9,105.1,100.0,100.0,97.7,96.7,99.4,96.1,101.7] },
            { cats: Q4, a: [50.9,51.7,51.4,17.9], b: [49.1,52.1,51.3,17.6], line: [103.7,99.2,100.2,101.7] }
          ][g];
          return {
            kpis: K.map(([l, items]) => ({ kind: "group", l, items })), kpiCols: 3,
            rows: [
              { cols: "1fr", cells: [{ title: ["Weekly", "Monthly", "Quarterly"][g] + " actuals vs goals (K)", info: true, chart: { type: "cluster", ...C } }] },
              { cols: "1fr", cells: [{ title: "Territory performance", info: true, table: { cols: ["Region", "Territory", "Measure", "P1", "P2", "P3", "P4", "P5"], right: [3, 4, 5, 6, 7], rows: [
                ["East", "Territory 131", "Actuals", "78", "74", "85", "75", "82"], ["", "", "Goals", "82", "82", "82", "82", "85"], ["", "", "Performance %", ["95.1%", "down"], ["90.2%", "down"], ["103.7%", "up"], ["91.5%", "down"], ["96.5%", "down"]],
                ["", "Territory 132", "Actuals", "84", "88", "71", "79", "94"], ["", "", "Goals", "85", "85", "85", "85", "88"], ["", "", "Performance %", ["98.8%", "down"], ["103.5%", "up"], ["83.5%", "down"], ["92.9%", "down"], ["106.8%", "up"]]] } }] }
            ]
          };
        } },

      { name: "Customer 360", filters: ["Geography: National", "View by: Month", "Segment: All", "Site status: All"],
        toggles: [{ id: "cv", opts: ["Site view", "Parent view"], pills: true }],
        build: s => s.t.cv ? {
          rows: [{ cols: "1fr", cells: [{ title: "Parent accounts", info: true, table: { cols: ["Parent", "2026 total", "2025 total", "Jan", "Feb", "Mar", "Apr", "May", "Jun"], right: [1, 2, 3, 4, 5, 6, 7, 8], rows: [
            ["Parent 001", "11,480", "12,050", "1,140", "1,090", "1,220", "1,180", "1,160", "1,210"], ["Parent 002", "10,220", "11,640", "980", "1,020", "1,060", "1,010", "1,040", "1,090"],
            ["Parent 003", "6,930", "7,410", "690", "660", "640", "710", "700", "720"], ["Parent 004", "6,180", "6,770", "610", "590", "620", "600", "640", "630"],
            [["Total", "num-total"], ["34,810", "num-total"], ["37,870", "num-total"], ["3,420", "num-total"], ["3,360", "num-total"], ["3,540", "num-total"], ["3,500", "num-total"], ["3,540", "num-total"], ["3,650", "num-total"]]] } }] }]
        } : {
          rows: [
            { cols: "1fr", cells: [{ title: "Volume and growth", info: true, chart: { type: "combo", cats: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"], bars: [15.8,15.1,16.9,17.6,16.8,16.2,17.4,15.9,16.8,18.2], line: [4.2,-4.4,11.9,4.1,-4.5,-3.6,7.4,-8.6,5.7,8.3], unit: "K", labels: true } }] },
            { cols: "1fr", cells: [{ title: "Sites", info: true, table: { cols: ["Site ID", "Site", "Address", "City", "State", "Territory", "Region"], rows: [["4000040477", "Site 0477", "100 Sample Avenue", "City 03", "State 21", "Territory 115", "Region 1"], ["4000040205", "Site 0205", "220 Example Road", "City 18", "State 09", "Territory 224", "Region 2"], ["4000040993", "Site 0993", "8 Placeholder Street", "City 27", "State 33", "Territory 131", "Region 3"]] } }] }
          ]
        } }
    ]},

    /* ---------- Lantheus site operations (sample data) ---------- */
    cx: { title: "Site operations", subtitle: "Site operations and alternate facility planning", style: "band", pages: [
      { name: "Site operations overview",
        build: s => {
          const SITES = [
            { id: "1001", name: "Site 1001 Riverside", addr: "10 Sample Way, City 04", tz: "Eastern", bill: "Health System 12", status: "Implemented",
              contact: [["Contact A", "555-0142"]], partners: [["Facility A (ET)", "06:00, 08:30", "1,200", "14.2", "Contact B", "555-0187", "No email available"], ["Facility B (ET)", "09:30", "850", "211.6", "Contact unavailable", "No phone available", "orders@facility-b.example"]] },
            { id: "1002", name: "Site 1002 Lakeside", addr: "42 Example Road, City 11", tz: "Central", bill: "Health System 07", status: "Implemented",
              contact: [["Contact C", "555-0119"], ["Contact D", "555-0160"]], partners: [["Facility C (CT)", "05:45", "900", "38.9", "Contact E", "555-0101", "ops@facility-c.example"], ["Facility D (CT)", "07:15, 11:00", "1,450", "96.3", "Contact F", "555-0175", "No email available"]] },
            { id: "1003", name: "Site 1003 Hillview", addr: "7 Placeholder Street, City 22", tz: "Pacific", bill: "Health System 03", status: "Pending",
              contact: [], partners: [["Facility E (PT)", "04:30, 07:30", "2,100", "22.7", "Contact G", "555-0133", "No email available"], ["Facility F (PT)", "10:00", "700", "305.1", "Contact unavailable", "No phone available", "help@facility-f.example"]] }
          ];
          const st = SITES[s.t.site || 0], day = s.t.day || 0, all = s.t.status || 0, monthly = s.t.view || 0;
          const orders = [
            [["ORD-25137", "Today", "13:00", "9.0", "Facility A", ["Ordered", "pill ok"], "04:36"], ["ORD-25166", "Today", "14:00", "9.0", "Facility A", ["Ordered", "pill ok"], "09:26"], ["ORD-25171", "Today", "16:30", "6.0", "Facility B", ["Canceled", "pill todo"], ""]],
            [["ORD-25202", "Tomorrow", "08:00", "9.0", "Facility A", ["Ordered", "pill ok"], ""], ["ORD-25219", "Tomorrow", "12:30", "6.0", "Facility B", ["Canceled", "pill todo"], ""]]
          ][day].map(r => [r[0], r[1], r[2], r[3], r[4].replace("Facility A", st.partners[0][0].split(" (")[0]).replace("Facility B", st.partners[1][0].split(" (")[0]), r[5], r[6]]);
          return { rows: [{ cols: "0.95fr 2.6fr", cells: [
            { title: "Left", bare: true, group: [
              { cols: "1fr", cells: [{ title: "Site search", tab: 1, radio: { id: "site", opts: SITES.map(x => `${x.id} - ${x.name} - ${x.addr}`) } }] },
              { cols: "1fr", cells: [{ title: "Site details", tab: 1, fields: [["Site ID", st.id], ["Name", st.name], ["Address", st.addr], ["Time zone", st.tz]] }] },
              { cols: "1fr", cells: [{ title: "Contracting details", tab: 1, fields: [["Billing entity", st.bill], ["Contracting entity", st.bill], ["Status", st.status]] }] },
              { cols: "1fr", cells: [{ title: "Site contacts", tab: 1, table: { cols: ["Name", "Phone"], rows: st.contact, empty: "No contacts on file for this site." } }] }
            ] },
            { title: "Right", bare: true, group: [
              { cols: "1fr", cells: [{ title: "Onboarded partner facilities", tab: 2, cards: st.partners.map(p => ({ title: p[0], fields: [["Today’s run", p[1]], ["Batch size", p[2]], ["Distance (mi)", p[3]], ["Name", p[4]], ["Phone", p[5]], ["Email", p[6]]] })) }] },
              { cols: "1.2fr 1fr", cells: [
                { title: monthly ? "Monthly orders by partner" : "Weekly orders by partner", tab: 3, toggles: [{ id: "view", opts: ["Weekly", "Monthly"] }], chart: monthly
                  ? { type: "stack", totals: true, cats: ["Jul","Aug","Sep","Oct"], series: [{ name: st.partners[0][0].split(" (")[0], cls: "s3", v: [61, 58, 66, 51] }] }
                  : { type: "stack", totals: true, cats: ["W/E 1","W/E 2","W/E 3","W/E 4"], series: [{ name: st.partners[0][0].split(" (")[0], cls: "s3", v: [16, 11, 14, 9] }] } },
                { title: "Partner and site locations", tab: 3, chart: { type: "map" } }
              ] },
              { cols: "1fr", cells: [{ title: "Order details", tab: 4, toggles: [{ id: "day", opts: ["Today", "Tomorrow"] }, { id: "status", opts: ["Active", "All"] }],
                table: { cols: ["Order ref", "Date", "Time", "Quantity", "Partner", "Status", "Shipped at"], right: [3], rows: all ? orders : orders.filter(r => r[5][0] === "Ordered"), empty: "No active orders for this day. Switch to All to see every order." } }] }
            ] }
          ] }] };
        } }
    ]},

    /* ---------- Azure DevOps effort and utilisation suite (sample data) ---------- */
    ado: { title: "ADO timesheet tracker", skin: "amber", navBottom: true, pages: [
      { name: "Home", title: "ADO timesheet tracker",
        build: s => { const h = new Date().getHours(), hi = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
          return { rows: [{ cols: "1fr", cells: [{ title: `${hi}! Track submissions, approvals and pending effort, weekly and monthly`, tiles: [
            ["Employee overview", 1], ["Non-project overview", 2], ["Non-billed overview", 3], ["Support overview", 4], ["Enhancement overview", 5], ["Utilisation", 6], ["Activity share", 7], ["Alerts", 8]] }] }] }; } },
      { name: "Emp overview", title: "Employee overview: offshore and nearshore", filters: ["Year: 2025", "Month: Jul", "Week: All", "Project: All", "Team: All"],
        toggles: [{ id: "loc", opts: ["Offsite", "Onsite"], pills: true }],
        build: s => { const T = 184, rows = (s.t.loc ? [["Engineer 21",168,"",10,6,"",0],["Engineer 22",184,"","","","",0],["Engineer 23",150,"",22,4,"1.0 days",4],["Engineer 24",176,"",8,"","",0]]
            : [["Engineer 01",184,"","","","",0],["Engineer 02",161,"",18,1,"1.0 days",4],["Engineer 03",140,"",32,8,"1.0 days",4],["Engineer 04",178,"",6,"","",0],["Engineer 05",102,"","","","",0],["Engineer 06",156,"",22,6,"2.0 days",0],["Engineer 07",171,"",9,4,"",0]]);
          return { rows: [{ cols: "1fr", cells: [{ title: "Billable and non-billable efforts (hours)", table: { cols: ["Assigned to", "Billable", "Non-bill project", "Non-bill hours", "Non-bill activity", "Leave", "Training/KT", "Total efforts"], right: [1, 2, 3, 4, 6, 7],
            rows: rows.map(r => { const tot = r[1] + (+r[3] || 0) + (+r[4] || 0) + r[6] + (r[5] ? 8 * parseFloat(r[5]) : 0), t = Math.min(tot, T); return [r[0], r[1].toFixed(1), r[2], r[3] === "" ? "" : (+r[3]).toFixed(1), r[4] === "" ? "" : (+r[4]).toFixed(1), r[5] ? [r[5], "up"] : "", r[6] ? r[6].toFixed(1) : "", [(t >= T ? T : t).toFixed(1), t >= T ? "up" : "down"]]; }) } }] }] }; } },
      { name: "Non-project", title: "July: non-project work, all weeks", filters: ["Month: Jul", "Week: All"],
        build: s => ({ rows: [
          { cols: "1fr 1fr", cells: [
            { title: "Top 3 by idle activity", chart: { type: "pie", items: [["Engineer 04", 22, "s1"], ["Engineer 11", 17, "s3"], ["Engineer 07", 15, "s2"], ["Engineer 15", 14.5, "s4"]] } },
            { title: "Top 3 by learning", chart: { type: "pie", items: [["Engineer 11", 58, "s1"], ["Engineer 02", 44, "s3"], ["Engineer 09", 31.5, "s4"]] } }] },
          { cols: "1fr 1fr", cells: [
            { title: "Non-project user stories", table: { cols: ["Feature", "Completed work"], right: [1], rows: [["Holiday", "64.0"], ["Idle time", "212.5"], ["Leave", "356.0"], ["Meetings and discussion", "18.0"], ["Training and KT", "388.5"], ["Status reporting", "104.0"], [["Total", "num-total"], ["1143.0", "num-total"]]] } },
            { title: "Activity efforts by work type", table: { cols: ["Task work type", "Activity", "Completed"], right: [2], rows: [["Development support", "Documentation", "2.0"], ["Idle time", "Non-billable activity", "212.5"], ["KT", "Non-billable activity", "51.0"], ["Non-project", "Holiday", "64.0"], ["Non-project", "Leave", "356.0"], ["Non-project", "Non-billable activity", "457.5"], [["Total", "num-total"], ["", "num-total"], ["1143.0", "num-total"]]] } }] }
        ] }) },
      { name: "Non-billed", title: "Non-billed project overview",
        build: s => ({ rows: [{ cols: "1.1fr 1fr", cells: [
          { title: "Non-billable project summary", table: { cols: ["Source", "Estimated", "Completed", "Utilisation"], right: [1, 2, 3], rows: [
            ["Project A: reporting views", "410", "402.5", ["98%", "down"]], ["Project B: internal KR", "", "58.0", "100%"], ["Project C: ledger model", "", "74.5", "100%"],
            ["Project D: API update", "64", "61.0", ["95%", "down"]], ["Project E: cloud move", "", "118.0", "100%"], ["Project F: CX reporting", "", "702.0", "100%"],
            [["Total", "num-total"], ["474", "num-total"], ["1416.0", "num-total"], ["299%", "num-total"]]] } },
          { title: "Feature-wise completed vs estimated", chart: { type: "hpair", items: [["CX reporting", 702], ["Reporting views", 402.5, 410], ["Cloud move", 118], ["Ledger model", 74.5], ["API update", 61, 64], ["Internal KR", 58]] } }] }] }) },
      { name: "Support", title: "Support overview", filters: ["Year: 2025", "Month: Jul", "Week: All"],
        toggles: [{ id: "sup", opts: ["BAU", "PST"], pills: true }],
        build: s => { const items = s.t.sup ? [["Job analysis", 21], ["Meetings", 19], ["Incidents", 12], ["Deployments", 8]] : [["Meetings", 1180], ["Incidents", 652], ["Ad-hoc items", 548], ["Job analysis", 431], ["Deployment", 330], ["SC tasks", 228], ["BA support", 156], ["Infra support", 134], ["Code fix", 88], ["Data fix", 26]];
          const total = items.reduce((a, x) => a + x[1], 0);
          return { rows: [{ cols: "1.3fr 1fr", cells: [
            { title: "Feature-wise completed work", chart: { type: "hbar", items } },
            { title: "Completed work by source", table: { cols: ["Source", "Completed work"], right: [1], rows: [[s.t.sup ? "PST support" : "BAU support", total.toFixed(1)], ...items.slice(0, 6).map(([l, v]) => ["   " + l, v.toFixed(1)]), [["Total", "num-total"], [total.toFixed(1), "num-total"]]] } }] }] }; } },
      { name: "Enhancement", title: "Enhancement overview",
        toggles: [{ id: "enh", opts: ["BAU", "PST"], pills: true }],
        build: s => ({
          kpis: [{ kind: "card", v: "Epic 05: data delete flow", l: "Least utilised feature", sub: "0%" }, { kind: "card", v: "Epic 02: object migration", l: "Most utilised feature", sub: "100%" }], kpiCols: 2,
          rows: [{ cols: "1.5fr 1fr", cells: [
            { title: "Epics: estimated, completed and utilisation", table: { cols: ["Epic", "Estimated", "Completed", "Util."], right: [1, 2, 3], rows: (s.t.enh ? [["Epic 01", "2480", "812.5", "33%"], ["Epic 02", "2190", "330.0", "15%"], ["Epic 03", "2610", "676.5", "26%"], ["Epic 04", "3760", "335.0", "9%"], ["Epic 06", "204", "128.0", "63%"], ["Epic 07", "110", "94.0", ["85%", "down"]], ["Epic 09", "178", "191.5", ["108%", "down"]]]
              : [["Epic 11", "960", "604.0", "63%"], ["Epic 12", "420", "382.5", ["91%", "down"]], ["Epic 13", "310", "122.0", "39%"], ["Epic 14", "140", "151.0", ["108%", "down"]]]).concat([[["Total", "num-total"], [s.t.enh ? "11532" : "1830", "num-total"], [s.t.enh ? "2567.5" : "1259.5", "num-total"], [s.t.enh ? "22%" : "69%", "num-total"]]]) } },
            { title: "Jump to utilisation", tiles: [[">80% utilisation", 6], [">100% utilisation", 6]] }] }]
        }) },
      { name: ">80% utilisation", title: "Utilisation watch", toggles: [{ id: "u", opts: ["80–99%", "Over 100%"], pills: true }],
        build: s => { const rows = s.t.u ? [["Feature 612: account update", "Active", 58, 61.5], ["Feature 650: supplier add", "Active", 92, 93.0]] : [["Feature 604: refresh scripts", "Active", 24, 23.5], ["Feature 642: QA refresh", "New", 128, 112.5], ["Feature 618: region model", "Active", 54, 46.5], ["Feature 634: fixed asset tables", "Active", 110, 93.5], ["Feature 631: leading zero fix", "Active", 46, 37.0]];
          return { rows: [{ cols: "1.2fr 1fr", cells: [
            { title: "Features", table: { cols: ["Feature", "State", "Estimate", "Actual", "Util."], right: [2, 3, 4], rows: rows.map(r => [[r[0], s.t.u ? "down" : "up"], r[1], String(r[2]), r[3].toFixed(1), [Math.round(r[3] / r[2] * 100) + "%", s.t.u ? "down" : "up"]]) } },
            { title: "Completed and estimated efforts", chart: { type: "hpair", items: rows.map(r => [r[0].split(":")[0], r[3], r[2]]) } }] }] }; } },
      { name: "Activity share", title: "July: all business types", filters: ["Year: 2025", "Month: Jul", "Week: All", "Business type: All"],
        build: s => ({
          kpis: [{ kind: "card", v: "352.50", l: "Non-engineering efforts" }, { kind: "card", v: "3.28K", l: "Engineering efforts" }], kpiCols: 2,
          rows: [{ cols: "1fr 1fr", cells: [
            { title: "Task work type by week", heat: { label: "Work type", cols: ["WK1", "WK2", "WK3", "WK4"], rows: [["Enhancement", [92, 104, 118, 101]], ["Incident", [88, 97, 76, 84]], ["Non-project", [64, 69, 66, 79]], ["Meetings", [61, 70, 68, 66]]] } },
            { title: "Activity by week", heat: { label: "Activity", cols: ["WK1", "WK2", "WK3", "WK4"], rows: [["Analysis", [104, 118, 116, 112]], ["Coding", [52, 81, 84, 76]], ["Testing", [58, 68, 82, 70]], ["Review", [14, 34, 43, 38]]] } }] }]
        }) },
      { name: "Alerts", title: "Alerts", badge: "12 total alerts",
        build: s => ({ rows: [{ cols: "1fr", cells: [{ title: "Features near or over their estimate", gauges: [
          ["Feature 576: revenue views", 98], ["Feature 588: API update", 96], ["Feature 631: data fix", 80], ["Feature 633: model change", 82],
          ["Feature 634: table change", 86], ["Feature 639: doc type", 81], ["Feature 642: QA refresh", 88], ["Feature 649: request flow", 72],
          ["Feature 651: no estimate", null], ["Feature 655: portal", 85], ["Feature 660: supplier add", 102], ["Feature 662: ops fund", 99]] }] }] }) }
    ]},

    /* ---------- Technical support dashboards on ServiceNow (sample data) ---------- */
    desk: { title: "Service desk report", skin: "amber", navBottom: true, pages: [
      { name: "Home", title: "Service desk report: April",
        toggles: [{ id: "type", opts: ["All", "INC", "SCT"], pills: true }, { id: "state", opts: ["All states", "Open", "On hold", "Closed"] }],
        build: s => { const f = [1, 0.78, 0.22][s.t.type || 0], g = [1, 0.4, 0.1, 0.5][s.t.state || 0], n = v => Math.round(v * f), m = v => Math.round(v * f * g);
          return {
            kpis: [{ v: String(m(196)), l: "Total items" }, { v: String(n(74)), l: "Open items", d: "", s: "down" }, { v: String(n(104)), l: "Closed items" }, { v: String(n(18)), l: "On-hold items" }, { v: "TASK-0412", l: "Oldest item" }], kpiCols: 5,
            rows: [
              { cols: "1fr 1fr 1.2fr", cells: [
                { title: "Items by type", chart: { type: "pie", donut: true, items: [["INC", s.t.type === 2 ? 0 : m(152), "s6"], ["SCT", s.t.type === 1 ? 0 : m(44), "s2"]].filter(x => x[1]) } },
                { title: "Items by priority", chart: { type: "pie", donut: true, items: [["P3", m(9), "s1"], ["P4", m(93), "s4"], ["P5", m(94), "s2"]] } },
                { title: "Items by ticket category", chart: { type: "group", cats: ["INC", "SCT"], series: [{ name: "Resolved or closed", cls: "s7", v: [s.t.type === 2 ? 0 : m(131), s.t.type === 1 ? 0 : m(38)] }, { name: "Work in progress", cls: "s5", v: [s.t.type === 2 ? 0 : m(21), s.t.type === 1 ? 0 : m(6)] }] } }] },
              { cols: "1fr 1fr 0.55fr", cells: [
                { title: "Items by days and state", chart: { type: "stack", totals: true, cats: ["11–30 days", "31–90 days", "90+ days"], series: [{ name: "On hold", cls: "s1", v: [n(3), n(15), 0] }, { name: "Open", cls: "s5", v: [n(8), n(55), n(11)] }] } },
                { title: "Items by priority and days range", chart: { type: "group", cats: ["P3", "P4", "P5"], series: [{ name: "11–30 days", cls: "s1", v: [0, n(2), n(3)] }, { name: "31–90 days", cls: "s3", v: [n(1), n(12), n(18)] }, { name: "90+ days", cls: "s4", v: [0, n(5), n(3)] }] } },
                { title: "Drill through to the items", tiles: [["Open the days-range drill-through", 1]] }] }
            ] }; } },
      { name: "Drill-through", title: "Days range drill-through", toggles: [{ id: "rng", opts: ["11–30 days", "31–90 days", "90+ days"], pills: true }],
        build: s => { const base = [24, 55, 104][s.t.rng || 0];
          return { rows: [{ cols: "1fr", cells: [{ title: "Items in the selected range", table: { cols: ["Priority", "State", "Item", "Assigned to", "Assignment group", "Age", "Since update"], right: [5, 6], rows: [
            ["P5", "Open", "INC-10341", "Agent 01", "Group A: platform support", String(base + 5), String(base + 2)], ["P5", "Open", "INC-10377", "Agent 02", "Group B: data delivery", String(base + 5), String(base + 4)],
            ["P4", "Open", "TASK-0388", "Agent 03", "Group C: testing", String(base + 6), String(base + 3)], ["P4", ["Closed", "up"], "INC-10402", "Agent 04", "Group A: platform support", String(base + 4), String(base + 4)],
            ["P5", ["On hold", "down"], "INC-10415", "Agent 05", "Group D: vendor time and expense", String(base + 5), String(base + 2)], ["P3", "Open", "INC-10430", "Agent 06", "Group E: data quality", String(base + 5), String(base + 3)]] } }] }] }; } }
    ]}
  };
})();
