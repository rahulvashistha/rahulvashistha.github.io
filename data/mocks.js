/* RECREATED REPORTS. Page names, filters and layout follow the real reports.
   Every value, name and label here is invented sample data.
   Each page has a build(state) function; state.t holds the selected option of each toggle. */
(function(){
  const W8 = ["W1","W2","W3","W4","W5","W6","W7","W8"], M6 = ["Jan","Feb","Mar","Apr","May","Jun"], Q4 = ["Q1","Q2","Q3","Q4"];
  const pick = (s, id, arr) => arr[s.t[id] || 0];

  SITE.mocks = {
    pyl: { title: "Commercial analytics", pages: [
      { name: "Sales Performance", filters: ["Geography: National", "Period: Last 13 weeks", "Segment: All"],
        toggles: [{ id: "grain", opts: ["Week", "Month", "Quarter"] }],
        build: s => ({
          kpis: [{ v: "48.2K", l: "Total volume shipped", d: "+6.1% growth", s: "up" }, { v: "1,204", l: "Active ordering sites", d: "0.0% growth", s: "flat" }, { v: "40.0", l: "Volume per site", d: "−1.8% growth", s: "down" }],
          rows: [{ cols: "1.15fr 1fr", cells: [
            { title: "Volume trend", chart: pick(s, "grain", [
              { type: "combo", cats: W8, bars: [3.4,3.6,3.5,3.8,3.9,3.7,4.0,4.2], line: [1.2,2.4,-0.8,3.1,2.6,0,2.9,4.1], unit: "K" },
              { type: "combo", cats: M6, bars: [14.8,15.2,15.9,15.6,16.4,17.1], line: [1.8,2.7,4.6,-1.9,5.1,4.3], unit: "K" },
              { type: "combo", cats: Q4, bars: [44.1,45.3,46.0,48.2], line: [2.2,2.7,0,4.8], unit: "K" }]) },
            { title: "Active sites by segment", chart: { type: "stack", cats: ["P1","P2","P3","P4","P5","P6"], series: [
              { name: "Core", cls: "s1", v: [410,415,420,418,425,430] }, { name: "Contested", cls: "s2", v: [340,350,348,352,355,356] },
              { name: "Emerging", cls: "s3", v: [250,260,268,272,278,281] }, { name: "Other", cls: "s4", v: [120,125,130,128,132,137] }] } }
          ]}, { cols: "1fr", cells: [
            { title: "Site summary", table: { cols: ["Site", "Segment", "Facility type", "Volume", "Growth %"], right: [3, 4], rows: [
              ["Site 0142", "Core", "Hospital", "1,284", ["+8.2%", "up"]], ["Site 0377", "Contested", "Imaging centre", "962", ["−3.1%", "down"]],
              ["Site 0519", "Emerging", "Hospital", "740", ["0.0%", "flat"]], ["Site 0608", "Limited", "Imaging centre", "512", ["+2.4%", "up"]]] } }
          ]}]
        }) },
      { name: "Field Execution", filters: ["Geography: National", "Period: Last 13 weeks"],
        toggles: [{ id: "lens", opts: ["Overall", "Segment", "Channel"] }],
        build: s => ({
          kpis: [{ v: "6.8", l: "Average calls per day", d: "+0.4 vs prior", s: "up" }, { v: "72%", l: "Target reach", d: "0.0 pts", s: "flat" }, { v: "2.4", l: "Call frequency", d: "−0.2 vs prior", s: "down" }],
          rows: [{ cols: "1.15fr 1fr", cells: [
            { title: "Activity trend", chart: pick(s, "lens", [
              { type: "combo", cats: W8, bars: [310,325,298,340,352,330,361,372], line: [1.1,4.8,-8.3,14.1,3.5,-6.3,9.4,3.0], unit: "" },
              { type: "stack", cats: ["W1","W2","W3","W4","W5","W6"], series: [{ name: "Core", cls: "s1", v: [140,150,138,160,165,158] }, { name: "Contested", cls: "s2", v: [110,112,100,118,122,110] }, { name: "Emerging", cls: "s3", v: [60,63,60,62,65,62] }] },
              { type: "stack", cats: ["W1","W2","W3","W4","W5","W6"], series: [{ name: "In person", cls: "s1", v: [200,210,190,220,228,214] }, { name: "Virtual", cls: "s2", v: [80,84,78,88,92,86] }, { name: "Programs", cls: "s6", v: [30,31,30,32,32,30] }] }]) },
            { title: "Calls by segment", chart: { type: "hbar", items: [["Core", 1840], ["Contested", 1310], ["Emerging", 760], ["Limited", 420], ["Unsegmented", 190]] } }
          ]}, { cols: "1fr", cells: [
            { title: "Site engagement summary", table: { cols: ["Site ID", "Site", "Segment", "Calls", "Days since contact"], right: [3, 4], rows: [
              ["0142", "Site 0142", "Core", "24", "3"], ["0377", "Site 0377", "Contested", "11", ["19", "down"]], ["0519", "Site 0519", "Emerging", "8", "6"], ["0608", "Site 0608", "Limited", "2", ["41", "down"]]] } }
          ]}]
        }) },
      { name: "Market Opportunity", filters: ["Segment: Contested", "Facility type: All"],
        build: s => ({
          kpis: [{ v: "356", l: "Sites in segment" }, { v: "+5.2%", l: "Product growth", d: "vs market +3.1%", s: "up" }, { v: "−0.6 pts", l: "Competitive share change", d: "vs prior period", s: "down" }],
          rows: [{ cols: "1.15fr 1fr", cells: [
            { title: "Competitive volume share", chart: { type: "stack", cats: Q4, series: [
              { name: "Category A", cls: "s1", v: [42,43,44,45] }, { name: "Category B", cls: "s2", v: [24,23,23,22] }, { name: "Category C", cls: "s3", v: [16,17,16,16] },
              { name: "Category D", cls: "s6", v: [11,10,10,10] }, { name: "Category E", cls: "s4", v: [7,7,7,7] }] } },
            { title: "Volume by segment", chart: { type: "hbar", items: [["Core", 18.4], ["Contested", 13.1], ["Emerging", 9.7], ["Limited", 4.8], ["Unsegmented", 2.2]] } }
          ]}, { cols: "1fr", cells: [
            { title: "Site opportunity", table: { cols: ["Site", "Facility type", "Nearest partner", "Share %", "Growth %"], right: [3, 4], rows: [
              ["Site 0377", "Imaging centre", "Partner 12 (8 mi)", "38%", ["+4.0%", "up"]], ["Site 0421", "Hospital", "Partner 03 (14 mi)", "22%", ["−2.2%", "down"]], ["Site 0466", "Hospital", "Partner 07 (5 mi)", "51%", ["0.0%", "flat"]]] } }
          ]}]
        }) },
      { name: "Quota & Attainment", filters: ["Period: Q3", "View: Region"],
        build: s => ({
          kpis: [{ v: "48.2K", l: "Actual volume" }, { v: "50.0K", l: "Goal" }, { v: "96.4%", l: "Attainment", d: "−3.6 pts to goal", s: "down" }],
          rows: [{ cols: "1fr 1fr", cells: [
            { title: "Attainment by region (%)", chart: { type: "band", items: [["North", 104], ["East", 99], ["South", 95], ["West", 91], ["Central", 88]], th: [90, 100], max: 115, labels: ["Below 90%", "90 to 100%", "Above goal"], invert: true } },
            { title: "Territory attainment", table: { cols: ["Territory", "Goal", "Actual", "Att. %"], right: [1, 2, 3], rows: [
              ["T-101", "2,400", "2,520", ["105%", "up"]], ["T-102", "2,100", "2,044", ["97%", "down"]], ["T-103", "1,900", "1,900", ["100%", "flat"]], ["T-104", "2,250", "1,980", ["88%", "down"]]] } }
          ]}]
        }) },
      { name: "Account 360", filters: ["Account: Parent 017"],
        toggles: [{ id: "acct", opts: ["Site view", "Parent account view"] }],
        build: s => ({
          kpis: [{ v: pick(s, "acct", ["412", "1,284"]), l: "Total orders, 24 months" }, { v: pick(s, "acct", ["+3.1%", "+4.2%"]), l: "Order trend", d: "vs prior year", s: "up" }, { v: pick(s, "acct", ["1", "6"]), l: "Sites in view" }],
          rows: [{ cols: "1fr", cells: [
            { title: "Order trend, two years", chart: { type: "combo", cats: ["Q1 25","Q2 25","Q3 25","Q4 25","Q1 26","Q2 26","Q3 26"], bars: pick(s, "acct", [[52,55,58,57,60,63,67],[150,158,166,170,176,184,190]]), line: [0,5.8,5.5,-1.7,5.3,5.0,6.3], unit: "" } }
          ]}]
        }) }
    ]},

    cx: { title: "Site operations overview", pages: [
      { name: "Site Operations Overview", filters: ["Site: 0418 Riverside"],
        toggles: [{ id: "day", opts: ["Today", "Tomorrow"] }, { id: "status", opts: ["Active", "All"] }, { id: "view", opts: ["Weekly", "Monthly"] }],
        build: s => {
          const today = [["ORD-10291", "06:15", "4", "Facility A", ["Active", "pill ok"]], ["ORD-10294", "07:40", "2", "Facility B", ["Active", "pill ok"]], ["ORD-10302", "09:05", "3", "Facility A", ["Shipped", "pill todo"]], ["ORD-10305", "10:20", "1", "Facility C", ["Canceled", "pill todo"]]];
          const tmrw = [["ORD-10311", "05:50", "3", "Facility A", ["Active", "pill ok"]], ["ORD-10318", "08:10", "2", "Facility C", ["Active", "pill ok"]], ["ORD-10320", "11:30", "2", "Facility B", ["Canceled", "pill todo"]]];
          let rows = s.t.day ? tmrw : today;
          if (!s.t.status) rows = rows.filter(r => r[4][0] === "Active");
          return { rows: [
            { cols: "0.9fr 1.6fr", cells: [
              { title: "Site details", zone: 1, fields: [["Site ID", "0418"], ["Sub-account", "0418-02"], ["Time zone", "Eastern"], ["Contracting", "Active"]] },
              { title: "Onboarded partner facilities", zone: 2, partners: [["Facility A (ET)", "Run 06:00", "Batch 12", "14 mi"], ["Facility B (ET)", "Run 07:30", "Batch 8", "31 mi"], ["Facility C (CT)", "Run 05:45", "Batch 10", "58 mi"]] }
            ]},
            { cols: "1.15fr 1fr", cells: [
              { title: "Orders by partner facility", zone: 3, chart: s.t.view
                ? { type: "stack", cats: ["May","Jun","Jul","Aug","Sep","Oct"], series: [{ name: "Facility A", cls: "s1", v: [62,66,70,72,75,78] }, { name: "Facility B", cls: "s2", v: [34,33,36,35,38,39] }, { name: "Facility C", cls: "s6", v: [18,20,19,22,21,24] }] }
                : { type: "stack", cats: ["W1","W2","W3","W4","W5","W6"], series: [{ name: "Facility A", cls: "s1", v: [14,16,15,18,17,19] }, { name: "Facility B", cls: "s2", v: [8,7,9,8,10,9] }, { name: "Facility C", cls: "s6", v: [4,5,4,6,5,6] }] } },
              { title: "Partner and site locations", zone: 3, chart: { type: "map" } }
            ]},
            { cols: "1fr", cells: [
              { title: "Order details", zone: 4, table: { cols: ["Order ref", "Scheduled", "Qty", "Partner", "Status"], right: [2], rows, empty: "No active orders for this day. Switch to All to see every order." } }
            ]}
          ]};
        } }
    ]},

    ado: { title: "Effort and utilisation", pages: [
      { name: "Support & Employee Overview", filters: ["Iteration: Sprint 14", "Source: All", "Team: All"],
        toggles: [{ id: "grain", opts: ["Weekly", "Monthly"] }],
        build: s => ({
          kpis: [{ v: s.t.grain ? "21.4K" : "4,860", l: "Effort hours" }, { v: s.t.grain ? "1,912" : "438", l: "Work items" }, { v: "64", l: "Engineers" }],
          rows: [{ cols: "1.15fr 1fr", cells: [
            { title: "Effort by work type", chart: { type: "stack", cats: ["Support","Enhancement","Defect","Task","Other"], series: [{ name: "Ticket", cls: "s1", v: [1400,600,420,300,90] }, { name: "Planned", cls: "s2", v: [200,1100,180,380,60] }, { name: "Ad hoc", cls: "s3", v: [160,120,80,120,50] }] } },
            { title: "Effort by feature", chart: { type: "hbar", items: [["Feature 01", 1240], ["Feature 02", 980], ["Feature 03", 760], ["Feature 04", 540], ["Feature 05", 310]] } }
          ]}]
        }) },
      { name: "Enhancement Utilisation", filters: ["Iteration: Sprint 14", "Business type: All"],
        toggles: [{ id: "grain", opts: ["Weekly", "Monthly"] }, { id: "band", opts: ["All", ">80%", ">100%"] }],
        build: s => {
          const lim = [0, 80, 100][s.t.band || 0];
          const teams = [["Team Alpha",104],["Team Beta",92],["Team Gamma",85],["Team Delta",76],["Team Echo",68]].filter(t => t[1] > lim || lim === 0);
          const eng = [["Engineer 01",[96,104,110,101]],["Engineer 02",[82,88,91,86]],["Engineer 03",[71,76,84,79]],["Engineer 04",[102,98,107,95]]].filter(e => lim === 0 || Math.max(...e[1]) > lim);
          return {
            kpis: [{ v: s.t.grain ? "21.4K" : "4,860", l: "Effort hours" }, { v: "86%", l: "Average utilisation" }, { v: String(lim === 100 ? 7 : lim === 80 ? 19 : 64), l: lim ? `Engineers above ${lim}%` : "Engineers in view" }],
            rows: [{ cols: "1fr 1fr", cells: [
              { title: "Utilisation by team (%)", chart: { type: "band", items: teams, th: [80, 100], max: 120 } },
              { title: s.t.grain ? "Engineer utilisation by month (%)" : "Engineer utilisation by week (%)", heat: { label: "Engineer", cols: s.t.grain ? ["Jul","Aug","Sep","Oct"] : ["W1","W2","W3","W4"], rows: eng } }
            ]}]
          };
        } },
      { name: "Billed vs Non-billed", filters: ["Quarter: Q3", "Team: All"],
        build: s => ({
          kpis: [{ v: "14.2K", l: "Billed hours" }, { v: "3.1K", l: "Non-billed hours" }, { v: "82%", l: "Billable share" }],
          rows: [{ cols: "1fr", cells: [
            { title: "Billed and non-billed effort by team", chart: { type: "stack", cats: ["Alpha","Beta","Gamma","Delta","Echo"], series: [{ name: "Billed", cls: "s1", v: [3600,3200,2900,2600,1900] }, { name: "Non-billed", cls: "s4", v: [500,700,600,800,500] }] } }
          ]}]
        }) },
      { name: "Team Drill-down", filters: ["Team: Alpha"],
        build: s => ({
          kpis: [{ v: "1,180", l: "Team effort hours" }, { v: "104%", l: "Team utilisation", d: "above 100%", s: "down" }, { v: "11", l: "Engineers" }],
          rows: [{ cols: "1fr", cells: [
            { title: "Workload details", table: { cols: ["Engineer", "Work item", "Type", "Hours", "Util. %"], right: [3, 4], rows: [
              ["Engineer 01", "WI-20431", "Enhancement", "38", ["110%", "down"]], ["Engineer 04", "WI-20417", "Support", "34", ["107%", "down"]], ["Engineer 06", "WI-20452", "Defect", "29", "92%"], ["Engineer 09", "WI-20460", "Task", "22", "84%"]] } }
          ]}]
        }) }
    ]},

    desk: { title: "Technical support", pages: [
      { name: "Ticket Summary", filters: ["Type: Incidents and tasks", "Category: All"],
        toggles: [{ id: "prio", opts: ["All", "P1 and P2"] }],
        build: s => {
          const all = [{ name: "P1", cls: "s5", v: [6,3,1,0,0] }, { name: "P2", cls: "s3", v: [28,19,9,4,2] }, { name: "P3", cls: "s1", v: [64,48,31,17,9] }, { name: "P4", cls: "s4", v: [40,29,18,9,5] }];
          const series = s.t.prio ? all.slice(0, 2) : all;
          const open = series.reduce((a, x) => a + x.v.reduce((p, q) => p + q, 0), 0);
          return {
            kpis: [{ v: String(open), l: "Open tickets" }, { v: "91.4%", l: "Resolved within SLA" }, { v: s.t.prio ? "33 d" : "46 d", l: "Oldest open ticket" }],
            rows: [{ cols: "1.15fr 1fr", cells: [
              { title: "Open tickets by age and priority", chart: { type: "stack", cats: ["0–2 d","3–7 d","8–14 d","15–30 d","30+ d"], series } },
              { title: "Open tickets by state", chart: { type: "hbar", items: [["New", 96], ["In progress", 142], ["On hold", 58], ["Awaiting user", 46]] } }
            ]}]
          };
        } },
      { name: "Resolved Summary", filters: ["Period: Last 90 days", "Category: All"],
        build: s => ({
          kpis: [{ v: "1,126", l: "Resolved tickets" }, { v: "91.4%", l: "Within SLA", d: "+1.2 pts", s: "up" }, { v: "2.6 d", l: "Average resolution time" }],
          rows: [{ cols: "1fr 1fr", cells: [
            { title: "SLA met by category (%)", chart: { type: "band", items: [["Access", 97], ["Network", 93], ["Hardware", 89], ["Software", 86], ["Data", 81]], th: [85, 95], max: 100, labels: ["Below 85%", "85 to 95%", "Above 95%"], invert: true } },
            { title: "Average resolution time (days)", chart: { type: "line", cats: ["Jul","Aug","Sep","Oct"], v: [3.4,3.0,2.8,2.6] } }
          ]}]
        }) },
      { name: "Agent Summary", filters: ["Team: All"],
        build: s => ({
          kpis: [{ v: "12", l: "Agents" }, { v: "28", l: "Most open per agent" }, { v: "46 d", l: "Oldest assigned ticket" }],
          rows: [{ cols: "1fr", cells: [
            { title: "Agent workload", table: { cols: ["Agent", "Assigned", "Resolved", "Oldest", "SLA %"], right: [1, 2, 3, 4], rows: [
              ["Agent 01", "28", "96", "46 d", ["84%", "down"]], ["Agent 02", "22", "118", "19 d", ["93%", "up"]], ["Agent 03", "19", "104", "11 d", ["95%", "up"]], ["Agent 04", "17", "121", "8 d", ["97%", "up"]]] } }
          ]}]
        }) }
    ]}
  };
})();
