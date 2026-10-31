/* PROFILE: who you are, headline numbers, career, skills.
   Each KPI's "tip" is the source tooltip visitors see on hover or tap. */
SITE.profile = {
  name: "Rahul Vashistha",
  role: "Senior Data Analyst and Power BI Consultant",
  refreshed: "Data as of November 2026",   /* fallback; the site reads the real date of your last GitHub update */
  repo: "rahulvashistha/rahulvashistha.github.io",
  headshot: "assets/photos/headshot.webp",   /* transparent cut-out; drawn as a duotone in the theme colours */
  lede: "I build Power BI models people can trust, and I find out why they break. Four years of semantic models, DAX performance work, reporting migrations and dashboard design for EY, ZS Associates, Amgen and Lantheus.",
  facts: [["pin", "Pune, India"], ["cap", "B.E. Computer Science, Pune University"], ["badge", "Microsoft certified (PL-300)"]],
  contact: {
    email: "rahulvashistha1412@gmail.com",
    linkedin: "https://www.linkedin.com/in/rahul-vashistha-08nov/",
    github: "https://github.com/rahulvashistha",
    resume: "assets/Rahul_Vashistha_Resume.pdf"
  },

  kpis: [
    { v: "265×", l: "faster report query, from about 530 seconds to 2",
      tip: { title: "265× faster query", rows: [["Project", "Lantheus commercial platform"], ["When", "Jul to Oct 2026"], ["Before", "About 530 seconds"], ["After", "About 2 seconds"], ["Fix", "High-cardinality columns moved off a transactional fact table"]], note: "530 ÷ 2 ≈ 265. From project notes." }, link: "pyl" },
    { v: "~90%", l: "faster chart load, from 40 seconds to 3.5",
      tip: { title: "~90% faster chart load", rows: [["Project", "Lantheus site operations"], ["When", "2026"], ["Before", "About 40 seconds"], ["After", "About 3.5 seconds"], ["Fix", "Removed a 65-query fan-out and a cross-storage-mode join"]], note: "(40 − 3.5) ÷ 40 ≈ 91%." }, link: "cx" },
    { v: "~150", l: "legacy BusinessObjects reports in migration scope",
      tip: { title: "~150 reports in scope", rows: [["Project", "Amgen BusinessObjects migration"], ["When", "Dec 2025 to Jul 2026"], ["Delivered", "33+ master reports covering 40+ sub-reports"], ["Built on", "4 shared semantic models"]], note: "Scope figure, not the delivered count." }, link: "migration" },
    { v: "250K", l: "work hours made visible to leadership",
      tip: { title: "250K work hours", rows: [["Project", "Azure DevOps effort and utilisation suite"], ["When", "2022 to 2025"], ["Employer", "Hexaware, delivering for EY"], ["Source", "Azure DevOps Boards"]], note: "From the project summary." }, link: "ado" },
    { v: "80%", l: "less manual reporting on utilisation tracking",
      tip: { title: "80% less manual reporting", rows: [["Project", "Azure DevOps effort and utilisation suite"], ["When", "2022 to 2025"], ["Context", "Automated weekly email reports to leadership"]], note: "From the project summary." }, link: "ado" },
    { v: "4+", l: "years building enterprise BI",
      tip: { title: "4+ years", rows: [["Hexaware Technologies", "2022 to 2025"], ["EY, assigned to ZS", "Nov 2025 to present"]], note: "" } }
  ],

  /* Story mode opens and closes with these chapters; projects fill the middle. */
  prologue: { id: "prologue", kicker: "2018 to 2022", title: "Where it started", frames: [
    ["start", "Engineering at Pune University", "Computer Science at Savitribai Phule Pune University, from 2018 to 2022."],
    ["learn", "Learning in lockdown", "A lockdown spent on Coursera, from Python to Google Cloud, plus a month volunteering with an NGO."],
    ["learn", "First paper, first internship", "In 2021: a software development internship and a published machine-learning paper on heart-disease prediction."],
    ["start", "First role", "Joined Hexaware Technologies in 2022 and started building Power BI for EY."]
  ]},
  epilogue: { id: "epilogue", kicker: "Now", title: "Next chapter", frames: [
    ["next", "Loading the next chapter", "Lantheus wrapped in October 2026. Whatever breaks next, I’ll find out why."]
  ]},

  principles: [
    ["Feasible first", "I agree the rules up front. If the platform can’t do it natively, it doesn’t go in the design."],
    ["Reconcile everything", "A fix isn’t done until it matches real exported data, not just a visual that looks right."],
    ["Fix the real boundary", "A report filter isn’t security. I fix the layer that actually enforces the rule, not the visible symptom."],
    ["Shrink the problem", "When a diagnosis fails twice, I stop guessing and isolate the simplest case that reproduces it."],
    ["Shared logic stays shared", "I won’t bend a shared measure for one new visual. It gets its own measure instead."],
    ["Mark the unconfirmed", "Documentation meets the same standard as code. Anything not verified is labelled as such."]
  ],

  career: [
    { when: "Nov 2025 to present", what: "Senior Data Analyst, Power BI Consultant", where: "Ernst & Young (EY), Pune. Assigned to ZS Associates since December 2025.", now: true,
      sub: [["Jul to Oct 2026", "Lantheus: commercial analytics platform and site operations dashboard"], ["Dec 2025 to Jul 2026", "Amgen: BusinessObjects to Power BI migration"]] },
    { when: "2022 to 2025", what: "Hexaware Technologies", where: "Power BI, data modelling and Databricks on EY engagements. Chennai and Pune.",
      sub: [["Alongside delivery", "Led internal audits, wrote team guidebooks and data model specs, and ran Power BI training"]] },
    { when: "2018 to 2022", what: "Bachelor of Engineering, Computer Science", where: "Savitribai Phule Pune University" }
  ],

  skills: [
    ["Power BI and DAX", ["Power BI Desktop and Service", "DAX", "Power Query (M)", "TMDL", "Field parameters", "Bookmarks and drill-through", "Report-page tooltips", "Performance Analyzer", "DAX Studio"]],
    ["Data modelling", ["Star schema", "Snowflake schema", "Bridge tables", "Snapshot tables", "Composite models", "Incremental refresh", "Row-level security", "Role-based access"]],
    ["Data engineering", ["SQL", "Azure Databricks", "Spark SQL", "Unity Catalog", "Snowflake", "ETL pipelines", "Python"]],
    ["Platforms and automation", ["Power Automate", "Power Apps", "Azure DevOps", "ServiceNow", "SAP BusinessObjects", "Service principal auth"]],
    ["AI in analytics", ["Microsoft Copilot", "GitHub Copilot", "ChatGPT", "Q&A visual", "Key Influencers", "Smart Narratives", "GenAI summary notes"]],
    ["Working with people", ["Stakeholder management", "Requirement gathering", "End-user documentation", "Power BI training", "Internal audits"]]
  ],

  /* Visitor analytics (GoatCounter, free and cookie-free). Paste your site code, e.g. "rahulvashistha"
     for https://rahulvashistha.goatcounter.com. Leave empty to switch analytics off. */
  analytics: { goatcounter: "" },

  /* Publications, shown under Experience and credentials */
  publications: [
    { title: "Heart Disease Prediction Using Machine Learning Algorithms and Models", venue: "IJARCCE, Vol. 10, Issue 12, December 2021",
      note: "Written with three classmates in my final year of engineering.", link: "https://doi.org/10.17148/IJARCCE.2021.101223" }
  ],

  skillSlicer: ["All", "DAX", "Data modelling", "Databricks", "Performance", "Security", "Automation", "Report design"]
};
