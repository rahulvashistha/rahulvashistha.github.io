/* PERSONAL page. Lists with no items stay hidden. */
SITE.personal = {
  title: "Off the clock",
  lede: "I grew up in Rajasthan and now live in Pune. Most weekdays I spend a couple of hours on a badminton court. The rest of my downtime goes to horror and thriller novels, films and a frankly large amount of anime, good cafés, and a healthy amount of banter.",
  facts: [
    ["Grew up in", "Rajasthan"],
    ["Based in", "Pune, India"],
    ["Languages", "Hindi (mother tongue), English"],
    ["Plays", "Badminton doubles"],
    ["Reads", "Horror, thrillers, psychology"]
  ],
  life: [
    ["On court", "Badminton doubles is the serious one. I play at an advanced level, for around two hours on most weekdays.", ["Badminton doubles", "Running", "General fitness"]],
    ["On the shelf", "I read for the stories that keep you up at night, and for how people think.", ["Horror and thriller novels", "Psychology", "Percy Jackson and the Battle of the Labyrinth, read and highlighted", "Book club"]],
    ["Everywhere else", "The things that fill weekends and the gaps in between.", ["Films, series and anime (see the report below)", "Cafés and coffee", "Cooking everyday Indian food", "Travel", "Keeping up with tech", "CSR activities"]]
  ],

  /* Watch history, summarised from my own logs. Counts are deduplicated titles.
     picks: a curated shortlist, not the whole log. */
  watch: {
    movies: { label: "Movies", total: 364, ratings: { Best: 0, Great: 107, Good: 118, Ok: 64, Bad: 17, Unrated: 58 },
      decades: { "1980s": 1, "1990s": 9, "2000s": 50, "2010s": 105, "2020s": 197 },
      picks: ["12th Fail", "The Shawshank Redemption", "Dune and Dune: Part Two", "Ford v Ferrari", "Project Hail Mary", "Exhuma", "Lucky Baskhar", "The Wild Robot", "Living", "Tetris"],
      note: "My movie log tops out at Great, so there’s no Best column." },
    series: { label: "Series", total: 63, ratings: { Best: 5, Great: 21, Good: 23, Ok: 5, Bad: 1, Unrated: 8 },
      picks: ["Friends", "Lucifer", "Halo", "The Lord of the Rings: The Rings of Power", "The Witcher: Blood Origin", "Dexter", "Stranger Things", "For All Mankind", "Panchayat", "Young Sheldon"] },
    anime: { label: "Anime", total: 269, ratings: { Best: 50, Great: 41, Good: 56, Ok: 28, Bad: 8, Unrated: 86 },
      picks: ["Attack on Titan", "Death Note", "Code Geass", "Your Lie in April", "Spirited Away", "A Silent Voice", "Jujutsu Kaisen", "Demon Slayer", "Kuroko’s Basketball", "Spy x Family"] }
  },

  favourites: [], /* Add as ["Heading", ["item", "item"]]; the section appears when filled. */

  values: [
    ["Curiosity", "New books, new places, new tech. I’d rather ask one more question than assume."],
    ["Staying active", "Sport is part of most weekdays, not a weekend extra."],
    ["Community", "Book clubs, CSR activities and NGO volunteering keep me connected beyond work."],
    ["Good banter", "Wit, a little sarcasm and conversations that go somewhere unplanned."]
  ],
  funfacts: [
    "My reading swings between horror novels and Percy Jackson.",
    "I’ve logged 269 anime and rated 50 of them Best.",
    "I once pulled a report’s whole design system out of its raw XML instead of eyeballing it.",
    "This site cost nothing to build and host, and it’s designed as a Power BI report.",
    "In college I entered five quizzes in one online festival, hosted by IIT Bombay, IIM Calcutta, IIM Indore, SRCC and NSUT.",
    "I published a machine-learning paper before I graduated."
  ]
};
