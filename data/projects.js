/* PROJECTS: one block per case study.
   card      -> the summary tile on the Professional page
   story     -> four frames for Story mode: [stage, headline, text]; stages: problem, approach, build, result
   fixes     -> root-cause stories shown on the case-study page and in Root-cause files
   modelView -> the simplified Model view diagram (x, y on a 640 × 300 canvas)
   screenshots -> PENDING: add real, sanitised images here, e.g. ["assets/projects/pyl-1.webp"]   */
SITE.projects = [
  {
    id: "pyl", client: "EY for ZS Associates, client Lantheus", period: "Jul to Oct 2026", years: [2026, 2026],
    title: "Five-screen commercial analytics platform",
    card: { v: "265×", l: "faster report query", summary: "Five production screens on one governed model, with security and data defects fixed at the source." },
    problem: "Lantheus’s commercial team worked from a fragmented set of legacy reports across sales, field activity, market opportunity and accounts, with no shared data governance or consistent security behind them.",
    built: [
      "A five-screen Power BI report, all five in production, on one governed semantic model sourced from Databricks",
      "119 DAX measures for a single screen, covering five customer segments across volume, growth and competitive share at every geography level",
      "Row-level security rebuilt at the data layer after finding that clearing a slicer bypassed access restrictions",
      "A rebuilt quota model after tracing a 4× data inflation to the legacy source",
      "A full measure audit across five core tables, ending in one documented measure library"
    ],
    model: "Star schema with bridge tables for multi-grain relationships",
    impact: [
      ["265×", "faster query", "Report query from about 530 s to about 2 s."],
      ["119", "measures on one screen", "Across five customer segments and every geography level."],
      ["400K to 11K", "rows in a shared dimension", "Intermediate row count of a shared dimension table."],
      ["~60", "UI issues closed", "Tracked and resolved across the five screens."]
    ],
    decisions: [
      "A welcome page where Go only unlocks the geographies a user is allowed to see, so security is settled before any page loads",
      "One trend visual, six measures: buttons switch Execution between calls, segment, channel, reach, call frequency and programs",
      "When a view doesn’t apply, the visual says so in plain words instead of showing a misleading chart",
      "Growth indicators use three states (grey, green, red) on every screen, so “no change” never reads like “no data”",
      "A seven-card KPI row that wrapped badly became three grouped cards",
      "Territory, region, area and national reference labels hide themselves as you drill into a narrower geography",
      "One help-tooltip template used on every page; in-product help grew from 17 to 27 pages after stakeholder review",
      "Slicers stay one neutral colour on every screen, so “selected” always looks the same",
      "A 28-page user guide written for the business handover"
    ],
    tags: ["Power BI", "DAX", "Power Query", "TMDL", "Row-level security", "Field parameters", "Bridge tables", "Databricks SQL"],
    filters: ["DAX", "Data modelling", "Databricks", "Performance", "Security", "Report design"],
    visual: { mock: "pyl", hint: "Start on the welcome page and press Go, then use the page buttons and chart buttons. Layout follows the real report; every value and name is sample data." },
    /* Real screenshots, every value, name and logo blurred (tools/redact.py). Only interface labels stay sharp. */
    screenshots: [
      { src: "assets/projects/pyl-1-welcome.webp", caption: "Welcome page: Go only unlocks permitted geographies" },
      { src: "assets/projects/pyl-2-execution.webp", caption: "Execution: KPI cards, calls trend, engagement table" },
      { src: "assets/projects/pyl-3-execution-channel.webp", caption: "Execution: the same visual switched to call channel" },
      { src: "assets/projects/pyl-4-performance.webp", caption: "Performance: doses, ordering sites, site status" },
      { src: "assets/projects/pyl-5-performance-empty-state.webp", caption: "Performance: plain-language empty state" },
      { src: "assets/projects/pyl-6-opportunity.webp", caption: "Opportunity: segment cards and share mix" },
      { src: "assets/projects/pyl-7-quota.webp", caption: "Quota: actuals against goals, territory matrix" },
      { src: "assets/projects/pyl-8-customer-360.webp", caption: "Customer 360: site view" }
    ],
    story: [
      ["problem", "Fragmented reports, uneven security", "The commercial team worked across scattered legacy reports with no shared governance behind them."],
      ["approach", "Reconcile before you trust", "Every fix was checked against exported data and legacy benchmark reports, not just a visual that looked right."],
      ["build", "Five screens, one governed model", "119 measures on one screen alone, row-level security rebuilt at the data layer, and a rebuilt quota model."],
      ["result", "530 seconds down to 2", "All five screens in production, with a 28-page user guide for the handover."]
    ],
    fixes: [
      { title: "The slicer that skipped security", symptom: "Clearing a slicer let a user see data outside their access.", cause: "The restriction lived in the report’s filters, not in the model.", fix: "Rebuilt enforcement as row-level security at the data layer.", proof: "Access now holds whatever the page’s slicers say." },
      { title: "A quota four times too big", symptom: "Quota figures coming from the legacy source looked too high.", cause: "A verified 4× data inflation in the legacy quota source.", fix: "Removed the inflation and consolidated the quota model, cutting Power Query complexity.", proof: "Parent-to-child reconciliation matched with 0.00 variance on every parent node." },
      { title: "Nine rows where there should be one", symptom: "The site-level table held far more rows than the legacy benchmark report.", cause: "A grain defect produced up to 9 duplicate rows per site.", fix: "Corrected the table to exactly one row per site.", proof: "2,581 rows against the benchmark’s 2,582." },
      { title: "530 seconds down to 2", symptom: "One report query took close to nine minutes.", cause: "High-cardinality attribute columns were sitting on a transactional fact table.", fix: "Moved those columns off the fact table.", proof: "About 2 seconds, roughly 265× faster." }
    ],
    modelView: { tables: [
      { id: "fs", n: "Fact Sales", k: "fact", x: 250, y: 20 }, { id: "fc", n: "Fact Calls", k: "fact", x: 250, y: 125 }, { id: "fq", n: "Fact Quota", k: "fact", x: 250, y: 230 },
      { id: "ds", n: "Dim Site", k: "dim", x: 20, y: 70, note: "4 source systems" }, { id: "dd", n: "Dim Date", k: "dim", x: 470, y: 20 }, { id: "dg", n: "Dim Segment", k: "dim", x: 470, y: 125 },
      { id: "br", n: "Bridge Site Territory", k: "bridge", x: 20, y: 190 }, { id: "geo", n: "Dim Geography", k: "dim", x: 470, y: 230 }
    ], links: [["fs","ds"],["fc","ds"],["fs","dd"],["fc","dd"],["fq","dd"],["fs","dg"],["ds","br"],["br","geo"],["fq","geo"]] }
  },
  {
    id: "cx", client: "EY for ZS Associates, client Lantheus", period: "2026", years: [2026, 2026],
    title: "Site operations and alternate facility dashboard",
    card: { v: "~90%", l: "faster chart load", summary: "One page built around one workflow: find a validated alternate facility fast when a partner site goes down." },
    problem: "When a partner production facility is disrupted, operations staff need to find validated alternate facilities for the affected site, compare them and contact them fast. The old multi-tab report wasn’t built around that job.",
    built: [
      "A single-page, site-centric dashboard built around one workflow: pick a site, review alternates, compare, contact",
      "Source data moved from Excel into governed Azure Databricks tables, with parameterised Power Query connections for each environment",
      "A composite model: DirectQuery for live orders, Import for stable reference data",
      "Three production defects fixed: a connector incompatibility, a relationship-direction bug corrupting facility-to-site matching, and a query regression",
      "An authentication gap that blocked most viewers replaced with a governed service principal"
    ],
    model: "Clean star schema, composite DirectQuery and Import",
    impact: [
      ["~90%", "faster chart load", "From about 40 s to about 3.5 s."],
      ["6", "production tables migrated", "Into a governed Databricks schema."],
      ["60+", "entities in one colour system", "Grouped and shaded to keep similar colours apart."],
      ["18", "viewers in production", "Business and technical users."]
    ],
    decisions: [
      "One page and one workflow instead of tabs, so there is nothing to navigate",
      "Four accent colours, one per zone (site, partner readiness, analytics, order table), for instant orientation",
      "Multi-field cards replace plain tables for site and partner summaries",
      "Every selection-dependent visual shows a clear message instead of going blank",
      "A site is selected on load, so the page opens populated",
      "A 60+ entity legend grouped and shaded to keep similar colours apart"
    ],
    tags: ["Power BI", "DAX", "Power Query", "Composite model", "Azure Databricks", "Unity Catalog", "Spark SQL"],
    filters: ["DAX", "Data modelling", "Databricks", "Performance", "Security", "Report design"],
    visual: { mock: "cx", hint: "Pick a different site in Site search, then try Weekly or Monthly, Today or Tomorrow, and Active or All. Layout follows the real report; every value and name is sample data." },
    screenshots: [
      { src: "assets/projects/cx-1-site-operations.webp", caption: "Site operations overview: one page, four zones" }
    ],
    story: [
      ["problem", "A disruption needs answers fast", "When a partner facility goes down, operations staff need validated alternates for the affected site, right away."],
      ["approach", "One page, one workflow", "Pick a site, review alternates, compare, contact. No tabs to hunt through."],
      ["build", "A composite model on Databricks", "DirectQuery for live orders, Import for reference data, and parameterised connections for each environment."],
      ["result", "40 seconds down to 3.5", "Three production defects fixed and a 65-query fan-out removed."]
    ],
    fixes: [
      { title: "65 queries for 85 rows", symptom: "A core chart took about 40 seconds to load.", cause: "Performance Analyzer showed one render firing 65 live queries for 85 rows, plus a cross-storage-mode join.", fix: "Removed the query fan-out and the compounding join.", proof: "About 3.5 seconds, roughly 90% faster." }
    ],
    modelView: { tables: [
      { id: "fo", n: "Fact Orders", k: "fact", x: 250, y: 120, mode: "DirectQuery" },
      { id: "ds", n: "Dim Site", k: "dim", x: 20, y: 30, mode: "Import" }, { id: "dp", n: "Dim Partner Facility", k: "dim", x: 470, y: 30, mode: "Import" },
      { id: "map", n: "Site Partner Map", k: "bridge", x: 250, y: 20, mode: "Import" }, { id: "dc", n: "Dim Contacts", k: "dim", x: 20, y: 220, mode: "Import" }, { id: "dd", n: "Dim Date", k: "dim", x: 470, y: 220, mode: "Import" }
    ], links: [["fo","ds"],["fo","dp"],["fo","dd"],["ds","map"],["map","dp"],["ds","dc"]] }
  },
  {
    id: "migration", client: "EY for ZS Associates, client Amgen", period: "Dec 2025 to Jul 2026", years: [2025, 2026],
    title: "BusinessObjects to Power BI migration",
    card: { v: "~150", l: "reports in scope", summary: "A legacy SAP BusinessObjects estate rebuilt in Power BI on four shared semantic models." },
    problem: "Amgen needed around 150 legacy SAP BusinessObjects reports rebuilt in Power BI without losing the business logic its teams relied on.",
    built: [
      "33+ master reports covering 40+ sub-reports, migrated, repointed and validated",
      "4 reusable semantic models that new reports build on instead of re-creating logic",
      "Deployment across Dev, QA and Production, plus custom Azure Databricks views, security and proofs of concept"
    ],
    model: "Four shared semantic models",
    impact: [["33+", "master reports", "Covering 40+ sub-reports."], ["4", "shared models", "Every migrated report builds on these."], ["3", "environments", "Dev, QA and Production."]],
    decisions: null,
    tags: ["Power BI", "DAX", "Power Query", "SQL", "Azure Databricks", "SAP BusinessObjects"],
    filters: ["DAX", "Data modelling", "Databricks"],
    visual: { caption: "Real figures from the engagement", flow: [
      ["~150", "Reports in scope", "Legacy SAP BusinessObjects estate"],
      ["33+", "Master reports delivered", "Covering 40+ sub-reports"],
      ["4", "Semantic models", "Shared by every migrated report"],
      ["3", "Environments", "Dev, QA and Production"]
    ]},
    screenshots: [],
    story: [
      ["problem", "150 legacy reports", "Amgen’s SAP BusinessObjects estate had to move to Power BI without losing business logic."],
      ["approach", "Shared models, not copies", "Rebuild the logic once in reusable semantic models, then repoint reports onto them."],
      ["build", "33+ masters, 40+ sub-reports", "Migrated, repointed and validated across Dev, QA and Production on four semantic models."],
      ["result", "One standard architecture", "New reports reuse the models instead of re-creating logic."]
    ],
    fixes: [],
    modelView: { tables: [
      { id: "m1", n: "Model A", k: "model", x: 20, y: 20 }, { id: "m2", n: "Model B", k: "model", x: 20, y: 90 }, { id: "m3", n: "Model C", k: "model", x: 20, y: 160 }, { id: "m4", n: "Model D", k: "model", x: 20, y: 230 },
      { id: "db", n: "Databricks views", k: "source", x: 470, y: 125 },
      { id: "r1", n: "Master reports", k: "report", x: 250, y: 55, note: "33+" }, { id: "r2", n: "Sub-reports", k: "report", x: 250, y: 195, note: "40+" }
    ], links: [["m1","r1"],["m2","r1"],["m3","r2"],["m4","r2"],["m2","r2"],["m3","r1"],["db","r1"],["db","r2"]] }
  },
  {
    id: "ado", client: "Hexaware Technologies, delivering for EY", period: "2022 to 2025", years: [2022, 2025],
    title: "Azure DevOps effort and utilisation suite",
    card: { v: "250K", l: "work hours visible", summary: "Eight-plus dashboards that turned Azure DevOps effort data into staffing decisions." },
    problem: "Leadership had no central view of effort, utilisation and work items across business units, so staffing and backlog decisions relied on manual tracking.",
    built: [
      "8+ dashboards on Azure DevOps Boards data: support and employee overview, enhancement utilisation, billed and non-billed effort, and drill-downs by team, engineer and task",
      "Bookmark views for teams above 80% and above 100% utilisation, a weekly/monthly toggle, and slicers for iteration, business type, source, team and project",
      "Automated weekly email reports and alerts to leadership",
      "AI visuals to surface over- and under-utilised teams"
    ],
    model: "Direct queries and Azure DevOps analytical views",
    impact: [["250K", "work hours visible", "Across business units."], ["80%", "less manual reporting", "From the project summary."], ["~40%", "faster loads", "After a DAX rewrite and aggregation tables."], ["8+", "dashboards", "One suite."]],
    decisions: [
      "Conditional formatting flags over-utilisation at a glance instead of making people read the numbers",
      "Weekly and monthly views share one page through a toggle rather than duplicated pages",
      "Summary pages lead into team, engineer and task detail"
    ],
    tags: ["Power BI", "DAX", "Azure DevOps", "Power Automate", "Bookmarks", "AI visuals"],
    filters: ["DAX", "Performance", "Automation", "Report design"],
    visual: { mock: "ado" },
    screenshots: [], /* PENDING: optional, if you have sanitised images */
    story: [
      ["problem", "No single view of the work", "Leadership couldn’t see effort, utilisation and work items across business units. Tracking was manual."],
      ["approach", "Start from the staffing questions", "Who is over capacity, who is under, and where the effort goes."],
      ["build", "8+ dashboards on Azure DevOps", "Utilisation bands at 80% and 100%, weekly and monthly views, task-level drill-downs and automated weekly emails."],
      ["result", "250K hours, visible", "80% less manual reporting, and loads about 40% faster after a DAX rewrite."]
    ],
    fixes: [
      { title: "Iterators everywhere", symptom: "Dashboards over 250K hours of effort loaded slowly.", cause: "DAX Studio and Performance Analyzer pointed to iterator-heavy SUMX and FILTER measures over fine-grained data.", fix: "Rewrote them as CALCULATE patterns, added aggregation tables and reduced the grain.", proof: "Load times down by about 40%." }
    ],
    modelView: { tables: [
      { id: "fw", n: "Fact Work Items", k: "fact", x: 250, y: 40 }, { id: "fe", n: "Fact Effort", k: "fact", x: 250, y: 200 },
      { id: "dt", n: "Dim Team", k: "dim", x: 20, y: 40 }, { id: "de", n: "Dim Engineer", k: "dim", x: 20, y: 200 },
      { id: "di", n: "Dim Iteration", k: "dim", x: 470, y: 40 }, { id: "dp", n: "Dim Project", k: "dim", x: 470, y: 125 }, { id: "dd", n: "Dim Date", k: "dim", x: 470, y: 210 }
    ], links: [["fw","dt"],["fe","dt"],["fe","de"],["fw","di"],["fw","dp"],["fe","dp"],["fe","dd"],["fw","fe"]] }
  },
  {
    id: "desk", client: "Hexaware Technologies, delivering for EY", period: "2022 to 2025", years: [2022, 2025],
    title: "Technical support dashboards on ServiceNow",
    card: { v: "60%", l: "less manual reporting", summary: "Ticket, resolution and agent views that let managers spot SLA risk before it escalates." },
    problem: "Leadership needed one place to track ticket volumes, SLA compliance, ageing and agent workload across several technical support teams.",
    built: [
      "3 dashboards: Ticket Summary (state, category, priority, age buckets), Resolved Summary (SLA %, resolution times, drill-through) and Agent Summary (performance, oldest tickets, workload)",
      "DAX for ticket ageing, SLA calculations and oldest-item detection",
      "ServiceNow and Excel support data combined, with Azure DevOps effort data added for support-team analysis"
    ],
    model: "ServiceNow, Excel and Azure DevOps sources",
    impact: [["60%", "less manual reporting", "From the project summary."], ["3", "dashboards", "Ticket, Resolved and Agent Summary."]],
    decisions: null,
    tags: ["Power BI", "DAX", "ServiceNow", "Bookmarks", "Tooltips"],
    filters: ["DAX", "Report design"],
    visual: { mock: "desk" },
    screenshots: [],
    story: [
      ["problem", "Tickets everywhere, no overview", "Support leads needed ticket volume, SLA compliance, ageing and agent workload in one place."],
      ["approach", "Three questions, three pages", "What’s open, what got resolved within SLA, and who is carrying the load."],
      ["build", "Ticket, Resolved and Agent summaries", "DAX for age buckets, SLA % and oldest-item detection, on ServiceNow and Excel data."],
      ["result", "60% less manual reporting", "Managers spot SLA risks and overloaded agents before they escalate."]
    ],
    fixes: [],
    modelView: { tables: [
      { id: "ft", n: "Fact Tickets", k: "fact", x: 250, y: 40, note: "ServiceNow" }, { id: "fe", n: "Fact Effort", k: "fact", x: 250, y: 210, note: "Azure DevOps" },
      { id: "da", n: "Dim Agent", k: "dim", x: 20, y: 125 }, { id: "dc", n: "Dim Category", k: "dim", x: 470, y: 20 }, { id: "dp", n: "Dim Priority", k: "dim", x: 470, y: 110 },
      { id: "dd", n: "Dim Date", k: "dim", x: 470, y: 200 }, { id: "xl", n: "Support Data", k: "source", x: 20, y: 230, note: "Excel" }
    ], links: [["ft","da"],["fe","da"],["ft","dc"],["ft","dp"],["ft","dd"],["fe","dd"],["xl","da"]] }
  },
  {
    id: "acas", client: "Hexaware Technologies, delivering for EY", period: "2022 to 2025", years: [2022, 2025],
    title: "ACAS/ISR asset and identity compliance platform",
    card: { v: "70%", l: "less manual prep", summary: "Databricks pipelines and eight models behind audit-ready asset and identity compliance." },
    problem: "EY’s internal ACAS/ISR system needed a single source of truth for asset inventory and identity compliance across cloud and on-prem environments, ready for audit.",
    built: [
      "Owned the Databricks layer: pipelines and notebooks for 60+ tables, with schema changes, business logic and automated jobs across Dev, QA and Production",
      "Around 8 specialised Power BI models using a snowflake schema and snapshot tables, balancing history with current-state reporting",
      "Row-level security and role-based access, incremental refresh, validation checks and performance testing",
      "GenAI prompts that drafted summary notes on compliance trends for stakeholders"
    ],
    model: "Snowflake schema: multiple facts and interconnected dimensions, plus snapshot tables",
    impact: [["70%", "less manual prep", "From the project summary."], ["60+", "tables in one place", "Asset and identity sources."], ["8", "data models", "Snowflake schema with snapshots."]],
    decisions: null,
    tags: ["Azure Databricks", "Power BI", "Snowflake schema", "Snapshot tables", "RLS and RBAC", "Incremental refresh"],
    filters: ["Data modelling", "Databricks", "Security", "Automation"],
    visual: { caption: "Architecture, simplified", flow: [
      ["60+", "Source tables", "Asset and identity data from cloud and on-prem environments"],
      ["word:Databricks", "Pipelines and notebooks", "Schema changes, business rules and automated jobs in Dev, QA and Production"],
      ["8", "Power BI models", "Snowflake schema with snapshot tables, RLS and RBAC, incremental refresh"],
      ["word:Outputs", "Compliance reporting", "Standard dashboards, ad-hoc visuals and GenAI summary notes"]
    ]},
    screenshots: [], /* PENDING: optional */
    story: [
      ["problem", "Audit-ready, across 60+ tables", "EY needed one source of truth for asset and identity compliance across cloud and on-prem environments."],
      ["approach", "Model first, visuals second", "Own the Databricks layer, then shape the models around history and current state."],
      ["build", "Eight models, snowflake schema", "Snapshot tables, RLS and RBAC, incremental refresh and validation checks on every schema change."],
      ["result", "70% less manual prep", "Asset and identity data from 60+ sources in one governed place."]
    ],
    fixes: [],
    modelView: { tables: [
      { id: "fa", n: "Fact Assets", k: "fact", x: 200, y: 30 }, { id: "fi", n: "Fact Identities", k: "fact", x: 200, y: 220 }, { id: "sc", n: "Snapshot Compliance", k: "snap", x: 200, y: 125 },
      { id: "de", n: "Dim Entity", k: "dim", x: 20, y: 125 }, { id: "bu", n: "Dim Business Unit", k: "dim", x: 20, y: 230 },
      { id: "ac", n: "Dim Asset Category", k: "dim", x: 410, y: 20 }, { id: "acl", n: "Dim Asset Class", k: "dim", x: 520, y: 100, w: 110 },
      { id: "env", n: "Dim Environment", k: "dim", x: 410, y: 175 }, { id: "src", n: "Dim Source System", k: "dim", x: 410, y: 245 }
    ], links: [["fa","de"],["fi","de"],["sc","de"],["de","bu"],["fa","ac"],["ac","acl"],["fa","env"],["fi","env"],["fi","src"],["fa","src"],["sc","fa"]] }
  }
];
