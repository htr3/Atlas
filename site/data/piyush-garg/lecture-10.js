window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 10,
  title: "What are Bloom Filters? | System Design",
  video: "https://www.youtube.com/watch?v=vz0QUa4CS3o",
  category: "Piyush Garg",
  tagline: "Bits 0,2,4,8 say piyush is taken; apple collides 1,2,6,8 — a maybe, never a silent miss.",
  summary: "Twitter/Gmail/LinkedIn signup cannot SELECT 20 million usernames two or three times per person. A hash map is O(1) and eats RAM as 1000 users join daily. A Bloom filter is a bit array plus hashes: set bits on insert, check those bits on lookup. If any bit is 0, the name is definitely free (lemon, bit 3). If all bits are 1, it might be taken — piyush and john are certain, apple is a false positive because 1,2,6,8 were already painted. Widen the bucket (10 → 1000), spread hashes, add a second filter. Chrome malicious URLs and Gmail spam use the same maybe. Tiny apps should just query Postgres.",

  theory: [
    {
      heading: "Signup is a scan of 20 million rows, two or three times",
      body: "Gmail, Twitter/X, LinkedIn: huge user counts, and signup asks for a unique username. You type <b>piyush</b>, the client hits an API, the API runs something like <code>SELECT * FROM users WHERE username = 'piyush' LIMIT 1</code> (Postgres in the drawing — any DB is the same). A hit means taken; empty means free. At <b>20 million</b> users, even with indexes, that lookup is heavy. Worst case the first try is taken, then piyushgarg, then underscore-1 — the lecture's average is <b>two or three username attempts per signup</b>. Each attempt scans that 20 million again. Many people signing up at once is a database bottleneck, not a UX nit.",
      bullets: [
        "Taken vs available is a membership test, not a profile fetch.",
        "2–3 tries × 20M rows × many signups is the load you are buying."
      ]
    },
    {
      heading: "Hash map is O(1) and a memory leak by design",
      body: "Obvious fix: keep a map of username → true. Lookup is <b>O(1)</b>. No table scan. You traded time for space. Twenty million keys, plus <b>1000 new usernames a day</b> even on a tiny growth story, and the map only grows. The structure is not space-efficient. You need something that sits between O(n) scan and an ever-fatter dictionary — a balance of RAM and lookup time. That structure is the Bloom filter.",
      bullets: [
        "Hash map solved lookup and created a RAM bill.",
        "Bloom filter exists because you accepted a different kind of error instead."
      ]
    },
    {
      heading: "False positives are allowed; false negatives are not",
      body: "A database or a hash map answers yes or no. A Bloom filter answers <b>maybe</b>. If piyush is already registered, the filter must say <b>taken, for sure</b>. If it said free, two accounts would collide — that crash is forbidden (false negative). If piyush1 is actually free and the filter says taken, the user tries piyushG1. You wasted a username that nobody can ever claim, and the product still works. That wrong \"taken\" is a <b>false positive</b>. System design is this tradeoff: only implement a Bloom filter if your product can bear burning a few unused names. Piyush calls it a personal favourite because the error is one-sided.",
      bullets: [
        "Taken in the set → filter always says taken.",
        "Not in the set → filter may still say taken. User picks another handle."
      ]
    },
    {
      heading: "Two parts: a hash function and a row of bit buckets",
      body: "A hash function eats a username and returns indexes (any form of hash — the lecture uses small integers for the whiteboard). <b>Buckets are bits</b>, indexed 0..n. Demo size is <b>10 bits</b> (0–9). Insert piyush: hash <b>0, 2, 4, 8</b>, set those bits to 1. Lookup piyush: hash again (same 0,2,4,8). If every one of those bits is 1, report taken. Insert john: hash <b>1, 4, 6, 8</b> — bit 4 and 8 were already 1, set 1 and 6. Lookup john: all four bits 1 → taken. Shared 1s are normal; the filter does not store strings.",
      bullets: [
        "Same input always hashes to the same indexes. That is the whole check.",
        "Setting a bit that is already 1 is a no-op, not a second copy of john."
      ]
    },
    {
      heading: "Lemon is free (a 0 bit); apple is a false positive",
      body: "Ask for lemon. Hash <b>2, 3, 4, 7</b>. Bit 2 and 4 are already 1 from piyush, but <b>bit 3 is still 0</b>. If lemon had been inserted, 3 would be 1. A single 0 means <b>definitely available</b>. Now apple, hash <b>1, 2, 6, 8</b>. None of those four indexes match piyush's tuple or john's tuple as a whole — apple was never inserted. But bit 1 (john), 2 (piyush), 6 (john), 8 (both) are all already 1. The filter says taken. Only two users exist; apple cannot be registered. That is the false positive, caused by overlapping bits, not by storing apple.",
      bullets: [
        "Any 0 among the hashed indexes → definitely not in the set.",
        "All 1s → maybe in the set. Confirm in the DB only if you still need certainty after a maybe."
      ]
    },
    {
      heading: "Ten bits fill up; 1000 bits and extra hashes spread collisions",
      body: "With 10 buckets, a handful of inserts paint most bits. Then every name looks taken. Collisions exploded because the array was tiny. Widen to <b>1000 bits</b> (indexes 0–999) and the same hashes scatter; 1000 is still a small number and already fewer collisions. Production: pick a decent m (the talk mentions 5000 as a feel), and a hash that <b>spreads widely</b>. As users grow you allocate more buckets and rearrange bits. You can stack <b>sub-filters</b> or <b>two hash functions</b> and only call taken when both agree — more bits, fewer false positives. Definition he reads: a space-efficient probabilistic structure using a bit array and multiple hashes to test set membership.",
      bullets: [
        "m (bit count) and hash quality are the knobs against false positives.",
        "Resize is part of operating the filter, not a one-time array of 10."
      ]
    },
    {
      heading: "Usernames, Chrome URLs, Gmail spam — only at Twitter scale",
      body: "Next time a big site tells you a handle is taken in a blink, a Bloom filter is a good guess. Not only usernames: <b>Chrome</b> can test whether a URL is marked malicious/spam; spam pipelines use them; Gmail-style \"is this email address already used\" is the same membership question. They show up in high-scale systems. If you have a small user table, Postgres can search it. You reach for Bloom when checking one username would otherwise load a Twitter- or LinkedIn-sized database.",
      bullets: [
        "Probabilistic maybe is cheaper than 20 million indexed rows on the signup hot path.",
        "Do not add a Bloom filter to a campus project with 200 rows."
      ]
    }
  ],

  keyTerms: [
    { term: "Bloom filter", def: "Bit array + hashes. Tests \"is this in the set?\" with possible yes and definite no." },
    { term: "False positive", def: "Name is free in the DB, filter says taken (apple vs piyush+john bits)." },
    { term: "False negative", def: "Name is taken, filter says free. Bloom filters are built not to do this." },
    { term: "Bit bucket", def: "One bit in the array. Insert sets hashed indexes to 1. Demo length 10." },
    { term: "Hash function", def: "Maps username → indexes (piyush → 0,2,4,8). Must be deterministic and well spread." },
    { term: "Definitely free", def: "At least one hashed bit is 0 (lemon, index 3). Insert never happened." },
    { term: "Sub-filter", def: "Second Bloom or second hash family; treat taken only if both match — fewer collisions." }
  ],

  tradeoffs: [
    { pro: "Membership without storing 20 million strings or scanning them on every keystroke.", con: "A free name can look taken; that handle is burned for everyone." },
    { pro: "If it is in the set, you never tell the user it is free — no double accounts.", con: "You cannot delete cleanly from a classic Bloom filter; bits are shared." },
    { pro: "Growing m from 10 to 1000/5000 plus extra hashes cuts false positives.", con: "More bits is still RAM, and you must rebuild/rearrange as the set grows." },
    { pro: "Chrome URL / Gmail / signup all share one cheap maybe.", con: "A 200-row campus DB should just SELECT; the filter is a high-scale tool." }
  ],

  interviewTips: [
    "Start from 20M usernames × 2–3 tries. Then kill the hash-map RAM story.",
    "Say the one-sided error: never false-negative, false-positive burns a name.",
    "Insert piyush at bits 0,2,4,8. Check those four 1s. That is the algorithm.",
    "Lemon 2,3,4,7 with bit 3 = 0 is the definite miss. Apple 1,2,6,8 is the false positive.",
    "Name m and hash spread as the knobs. Mention a second hash/sub-filter.",
    "Only at Twitter/LinkedIn scale. Tiny tables stay on the database."
  ],

  scene: {
    nodes: [
      { id: "u", label: "Signup", type: "user", pos: [-11, 0, -4] },
      { id: "api", label: "API", type: "server", pos: [-6, 0, -4] },
      { id: "pg", label: "Users 20M", type: "db", pos: [0, 0, -4] },
      { id: "nSql", label: "WHERE username=piyush", type: "note", pos: [6.5, 0, -4] },

      { id: "try2", label: "piyushgarg", type: "user", pos: [-11, 0, 0], showAt: 1 },
      { id: "try3", label: "piyush_1", type: "user", pos: [-11, 0, 4], showAt: 1 },
      { id: "n3", label: "2–3 scans per signup", type: "note", pos: [6.5, 0, 0], showAt: 1 },

      { id: "map", label: "Hash map", type: "cache", pos: [0, 0, 4], showAt: 2 },
      { id: "nMap", label: "O(1), +1000 keys/day", type: "note", pos: [6.5, 0, 4], showAt: 2 },

      { id: "h", label: "Hash fn", type: "service", pos: [-11, 0, 0], showAt: 3 },
      { id: "b0", label: "0", type: "point", pos: [-10.8, 0, 5.5], showAt: 3 },
      { id: "b1", label: "1", type: "point", pos: [-8.4, 0, 5.5], showAt: 3 },
      { id: "b2", label: "2", type: "point", pos: [-6, 0, 5.5], showAt: 3 },
      { id: "b3", label: "3", type: "point", pos: [-3.6, 0, 5.5], showAt: 3 },
      { id: "b4", label: "4", type: "point", pos: [-1.2, 0, 5.5], showAt: 3 },
      { id: "b5", label: "5", type: "point", pos: [1.2, 0, 5.5], showAt: 3 },
      { id: "b6", label: "6", type: "point", pos: [3.6, 0, 5.5], showAt: 3 },
      { id: "b7", label: "7", type: "point", pos: [6, 0, 5.5], showAt: 3 },
      { id: "b8", label: "8", type: "point", pos: [8.4, 0, 5.5], showAt: 3 },
      { id: "b9", label: "9", type: "point", pos: [10.8, 0, 5.5], showAt: 3 },
      { id: "nP", label: "piyush → 0,2,4,8", type: "note", pos: [-6, 0, 7.6], showAt: 3 },

      { id: "nChk", label: "all 1s → taken for sure", type: "note", pos: [6, 0, 7.6], showAt: 4 },

      { id: "nJ", label: "john → 1,4,6,8", type: "note", pos: [-6, 0, 7.6], showAt: 5 },

      { id: "nL", label: "lemon → 2,3,4,7; bit3=0", type: "note", pos: [2, 0, 7.6], showAt: 6 },

      { id: "nA", label: "apple → 1,2,6,8 false +", type: "note", pos: [2, 0, 7.6], showAt: 7 },
      { id: "apple", label: "Apple", type: "user", pos: [-11, 0, -4], showAt: 7 },

      { id: "wide", label: "m=1000 bits", type: "zone", pos: [0, 0, 0], size: [18, 3.2], showAt: 8 },
      { id: "h2", label: "Hash family 2", type: "service", pos: [-11, 0, -4], showAt: 8 },
      { id: "nM", label: "Spread 0–999; 2nd filter", type: "note", pos: [0, 0, -7], showAt: 8 },

      { id: "chr", label: "Chrome URL", type: "cdn", pos: [-6, 0, 3.5], showAt: 9 },
      { id: "gm", label: "Gmail spam", type: "service", pos: [0, 0, 3.5], showAt: 9 },
      { id: "li", label: "LinkedIn handle", type: "server", pos: [6, 0, 3.5], showAt: 9 },
      { id: "nSm", label: "Small DB: just SELECT", type: "note", pos: [0, 0, -3.5], showAt: 9 }
    ],
    edges: [
      { from: "u", to: "api" },
      { from: "api", to: "pg", label: "SELECT" },
      { from: "try2", to: "api", showAt: 1 },
      { from: "try3", to: "api", showAt: 1 },
      { from: "api", to: "map", showAt: 2 },
      { from: "h", to: "b0", showAt: 3 },
      { from: "h", to: "b2", showAt: 3 },
      { from: "h", to: "b4", showAt: 3 },
      { from: "h", to: "b8", showAt: 3 },
      { from: "h", to: "b1", showAt: 5 },
      { from: "h", to: "b6", showAt: 5 },
      { from: "h", to: "b3", showAt: 6, dashed: true },
      { from: "h", to: "b7", showAt: 6, dashed: true },
      { from: "apple", to: "h", showAt: 7 },
      { from: "h2", to: "wide", showAt: 8, dashed: true },
      { from: "chr", to: "h", showAt: 9, dashed: true }
    ],
    steps: [
      {
        title: "SELECT piyush across 20 million rows",
        text: "Signup types piyush. API runs WHERE username = piyush LIMIT 1 on a 20 million user table. Index or not, this membership test is the bottleneck Gmail/Twitter/LinkedIn share on the continue button.",
        highlight: ["u", "api", "pg", "nSql"],
        flows: [
          { from: "u", to: "api", color: "#4ade80", label: "piyush" },
          { from: "api", to: "pg", color: "#c084fc", label: "scan" }
        ]
      },
      {
        title: "Two or three tries, two or three scans",
        text: "piyush is taken. Try piyushgarg, then piyush_1. Average signup hammers the 20 million row table two or three times. Many signups at once is how the database melts.",
        highlight: ["u", "try2", "try3", "api", "pg", "n3"],
        flows: [
          { from: "try2", to: "api", color: "#fb923c", label: "again" },
          { from: "try3", to: "api", color: "#fb923c", label: "again" },
          { from: "api", to: "pg", color: "#c084fc", label: "20M" }
        ]
      },
      {
        title: "Hash map is O(1) and keeps growing",
        text: "Store username → true. Lookup is constant time, no scan. Space is not: 20 million keys plus ~1000 new users a day. You fixed time and bought an unbounded RAM bill.",
        highlight: ["map", "nMap", "api", "pg"],
        hide: ["try2", "try3", "n3", "nSql"],
        flows: [
          { from: "api", to: "map", color: "#4ade80", label: "O(1)" }
        ]
      },
      {
        title: "Insert piyush: set bits 0, 2, 4, 8",
        text: "Bloom filter = hash function + 10 bit buckets. Hash piyush to 0,2,4,8 and paint those bits 1. No string is stored. Same hash later must return the same four indexes.",
        highlight: ["h", "b0", "b2", "b4", "b8", "nP"],
        hide: ["u", "api", "pg", "nSql", "try2", "try3", "n3", "map", "nMap"],
        flows: [
          { from: "h", to: "b0", color: "#4ade80", label: "1" },
          { from: "h", to: "b2", color: "#4ade80", label: "1" },
          { from: "h", to: "b4", color: "#4ade80", label: "1" },
          { from: "h", to: "b8", color: "#4ade80", label: "1" }
        ]
      },
      {
        title: "Check piyush: four 1s, taken for sure",
        text: "Hash again: 0,2,4,8. Every bit is 1, so the name is taken. If piyush were in the database, the filter is not allowed to say free. That direction is certain.",
        highlight: ["h", "b0", "b2", "b4", "b8", "nChk"],
        hide: ["u", "api", "pg", "nSql", "try2", "try3", "n3", "map", "nMap", "nP"],
        flows: [
          { from: "h", to: "b0", color: "#60a5fa", label: "?" },
          { from: "h", to: "b8", color: "#60a5fa", label: "taken" }
        ]
      },
      {
        title: "Insert john on 1, 4, 6, 8",
        text: "John hashes to 1,4,6,8. Bits 4 and 8 were already 1 from piyush; set 1 and 6. Two names now share some buckets. The array still holds ten bits, not two strings.",
        highlight: ["h", "b1", "b4", "b6", "b8", "nJ", "b0", "b2"],
        hide: ["u", "api", "pg", "nSql", "try2", "try3", "n3", "map", "nMap", "nP", "nChk"],
        flows: [
          { from: "h", to: "b1", color: "#4ade80", label: "1" },
          { from: "h", to: "b6", color: "#4ade80", label: "1" },
          { from: "h", to: "b4", color: "#c084fc", label: "shared" },
          { from: "h", to: "b8", color: "#c084fc", label: "shared" }
        ]
      },
      {
        title: "Lemon: bit 3 is 0, definitely free",
        text: "Lemon hashes to 2,3,4,7. Bits 2 and 4 are already 1, but index 3 is still 0. If lemon had been inserted, 3 would be set. One zero means available — paint it and the user can claim lemon.",
        highlight: ["h", "b2", "b3", "b4", "b7", "nL"],
        hide: ["u", "api", "pg", "nSql", "try2", "try3", "n3", "map", "nMap", "nP", "nChk", "nJ"],
        flows: [
          { from: "h", to: "b3", color: "#4ade80", label: "0 → free" },
          { from: "h", to: "b7", color: "#4ade80", label: "0" },
          { from: "h", to: "b2", color: "#60a5fa", label: "1" }
        ]
      },
      {
        title: "Apple 1,2,6,8: false positive",
        text: "Apple was never inserted. Hash 1,2,6,8: john owns 1 and 6, piyush owns 2, both own 8. All 1s, so the filter says taken. Only john and piyush exist. That wrong taken is the false positive you agreed to live with.",
        highlight: ["apple", "h", "b1", "b2", "b6", "b8", "nA"],
        fail: ["apple"],
        hide: ["u", "api", "pg", "nSql", "try2", "try3", "n3", "map", "nMap", "nP", "nChk", "nJ", "nL"],
        flows: [
          { from: "apple", to: "h", color: "#f87171", label: "apple" },
          { from: "h", to: "b1", color: "#f87171", label: "1" },
          { from: "h", to: "b2", color: "#f87171", label: "1" },
          { from: "h", to: "b6", color: "#f87171", label: "1" },
          { from: "h", to: "b8", color: "#f87171", label: "taken?" }
        ]
      },
      {
        title: "Widen to 1000 bits, add a second hash",
        text: "Ten buckets fill and every name looks taken. m=1000 (indexes 0–999) scatters hashes; 5000 is a production-feeling size. A second hash family or sub-filter only reports taken when both agree. Spread and m are how you design the error rate.",
        highlight: ["wide", "h", "h2", "nM", "b0", "b9"],
        hide: ["u", "api", "pg", "nSql", "try2", "try3", "n3", "map", "nMap", "nP", "nChk", "nJ", "nL", "nA", "apple"],
        flows: [
          { from: "h2", to: "wide", color: "#c084fc", label: "spread" },
          { from: "h", to: "b0", color: "#4ade80", label: "0–999" }
        ]
      },
      {
        title: "Chrome, Gmail, LinkedIn — not a 200-row SELECT",
        text: "Same maybe: Chrome malicious URLs, Gmail spam / address taken, LinkedIn handles. High-scale only. If the table is small, the database already searches it. Bloom is what you draw when one username check would load Twitter.",
        highlight: ["chr", "gm", "li", "nSm", "h"],
        hide: ["u", "api", "pg", "nSql", "try2", "try3", "n3", "map", "nMap", "nP", "nChk", "nJ", "nL", "nA", "apple", "wide", "h2", "nM", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"],
        flows: [
          { from: "chr", to: "h", color: "#fb923c", label: "URL?" },
          { from: "gm", to: "h", color: "#60a5fa", label: "spam?" }
        ]
      }
    ]
  }
});
