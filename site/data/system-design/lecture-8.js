window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 8,
  title: "Caching in Distributed Systems",
  video: "https://www.youtube.com/watch?v=zw7VwIlkPPc",
  category: "Data & Storage",
  tagline: "Store repeatable work next to the reader so the database is not asked twice.",
  summary: "Using an Instagram news-feed walk, this lecture shows why caches exist (220 ms end-to-end, 20 ms of that on the database hop), how cohorts and device caches multiply the win, and why you cannot keep terabytes in RAM. It then covers eviction (LRU thrashing on a size-3 cache), stale copies (YouTube likes), and the three placements you actually ship: in-process, database, and a shared distributed cache.",

  theory: [
    {
      heading: "The news-feed round trip",
      body: "A user asks Instagram for their feed. The request spends <b>100 ms</b> to the server, the server spends <b>10 ms</b> to the database and <b>10 ms</b> back, then <b>100 ms</b> home: <b>220 ms</b>. Two hops exist: client-to-server (the big one) and server-to-database. Backend caching attacks the second hop. If a cache answers in 1 ms each way, that 20 ms inner loop becomes 2 ms. You cannot ignore the 200 ms edge hop, but this chapter stays on the backend.",
      bullets: [
        "220 ms = 100 + 10 + 10 + 100",
        "Many services pound the same database; speeding that inner hop helps all of them",
        "A cache is storage used to skip repeatable computation"
      ]
    },
    {
      heading: "Cohorts and the phone cache",
      body: "Similar people get similar feeds. A young football-loving engineer in India can reuse a feed already built for that cohort: compute once from the database, keep it in memory, serve the next sibling from RAM. The same idea lives on the device. If the user puts the phone down and opens the app again, replay the feed you already downloaded: the 200 ms network call becomes about <b>2 ms</b>. Caching is \"pay storage, buy latency.\"",
      bullets: [
        "Group users who would see almost the same result",
        "First request fills the cache; later ones skip the database",
        "A mini-cache on the phone removes the wide-area hop entirely"
      ]
    },
    {
      heading: "You cannot cache the whole database",
      body: "Gigabytes of static data can live entirely in memory. Terabytes and petabytes cannot, or only at a painful price. So you keep the <i>hot</i> slice: the 90% of queries that hit popular keys. With a 90/10 split you still miss some, so the savings are smaller than the textbook 10x, maybe a few milliseconds on the inner hop. The engineering job is to predict what will be asked.",
      bullets: [
        "Working set in RAM, archive on disk",
        "Hit rate, not cache size, is the number that matters",
        "A cold cache is extra work: lookup, miss, then the database anyway"
      ]
    },
    {
      heading: "Two policy questions",
      body: "A cache is a copy, so writes raise a question: update cache and database together, or later? That is the <b>write policy</b> family (write-through, write-back, write-around). Memory is finite, so a viral video must kick something else out. That is the <b>eviction policy</b>: least recently used (LRU), least frequently used (LFU), and fancier learned policies. As an engineer, LRU and LFU are the ones to know cold.",
      bullets: [
        "Write policy: when does the copy catch up to the source of truth?",
        "Eviction policy: what leaves when a hotter key arrives?",
        "Both together are \"the cache policy\""
      ]
    },
    {
      heading: "Thrashing and stale copies",
      body: "Cache of size 3, requests 1, 2, 3, 4, 1, 2 under LRU: each new key evicts the one you are about to need. That is <b>thrashing</b>: extra lookups, extra evictions, higher latency than no cache. Separately, a YouTube like-count can sit in cache and refresh every minute or hour. Users see a slightly old number; the database is still the source of truth. Fine for likes, dangerous for money. That lag is <b>eventual consistency</b> of the copy.",
      bullets: [
        "Sequential scans over a working set larger than the cache defeat LRU",
        "Stale is a policy choice, not an accident",
        "Financial ledgers usually should not be served from a sleepy cache"
      ]
    },
    {
      heading: "Where the cache lives",
      body: "Three placements, and production uses all of them. <b>In-memory</b> next to the app (a map in the process). <b>Database cache</b> inside the DB server for hot queries, mostly a black box. <b>Global / distributed cache</b> as its own cluster with get/put APIs, independent scale, independent deploys, maybe another language. Multiple services share it. As a backend engineer, the distributed cache is the one you design on purpose; the other two still exist.",
      bullets: [
        "In-process: fastest, not shared, dies with the app",
        "DB cache: automatic, you do not tune it much",
        "Distributed cache: shared, scalable, the interview default at large scale"
      ]
    }
  ],

  keyTerms: [
    { term: "Cache hit / miss", def: "Hit: answer from the copy. Miss: fall through to the database, then usually fill the copy." },
    { term: "Working set", def: "The hot keys you can afford to keep in RAM. Everything else stays on the source of truth." },
    { term: "LRU", def: "Evict the key that has not been touched for the longest time." },
    { term: "LFU", def: "Evict the key that has been asked for the fewest times." },
    { term: "Thrashing", def: "A request pattern that constantly evicts keys you immediately need again, so the cache only adds overhead." },
    { term: "Write policy", def: "Rules for keeping the cache and the database aligned when data changes." },
    { term: "Eventual consistency", def: "The copy catches up later; readers may see a stale value until the next refresh." },
    { term: "Distributed cache", def: "A standalone cache cluster that many services call over the network (get/put)." }
  ],

  tradeoffs: [
    { pro: "Hits cut the DB hop from ~10 ms to ~1 ms, and a phone cache can cut 200 ms to ~2 ms", con: "Misses add a wasted lookup before you still pay the database" },
    { pro: "Keeping only the hot 90% of keys is affordable in RAM", con: "You must predict popularity; a viral key still needs an eviction victim" },
    { pro: "Refreshing likes every minute saves write load", con: "Readers see stale counts; unacceptable for money movement" },
    { pro: "A shared cache cluster scales and deploys on its own", con: "It is another network hop and another system to operate" }
  ],

  interviewTips: [
    "Walk the uncached numbers first (here: 220 ms) so the cache has a baseline to beat.",
    "Separate the client-to-server hop from the server-to-database hop; say which one your cache is for.",
    "Name LRU vs LFU, then mention thrashing if the working set does not fit.",
    "State the source of truth (usually the DB) and how stale you will allow the copy to be.",
    "At large scale, propose a distributed cache plus a small in-process cache; do not pretend one layer is enough."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Instagram user", type: "phone", pos: [-11, 0, 0] },
      { id: "phoneCache", label: "Device cache", type: "cache", pos: [-11, 0, -4], showAt: 2 },
      { id: "srv", label: "Feed server", type: "server", pos: [-3, 0, 0] },
      { id: "mem", label: "App memory", type: "cache", pos: [-3, 0, -4], showAt: 1 },
      { id: "db", label: "Posts DB", type: "db", pos: [6, 0, 0] },
      { id: "note220", label: "100+10+10+100 = 220 ms", type: "note", pos: [-3, 4.5, -6] },

      { id: "u1", label: "Engineer IN", type: "user", pos: [-11, 0, 4], showAt: 1 },
      { id: "u2", label: "Peer, same cohort", type: "user", pos: [-11, 0, 6.5], showAt: 1 },
      { id: "noteCohort", label: "Same cohort, reuse the feed", type: "note", pos: [-7, 4, 7], showAt: 1 },

      { id: "slot1", label: "1", type: "point", pos: [2, 0, -5], showAt: 4, color: "#4ade80" },
      { id: "slot2", label: "2", type: "point", pos: [4.5, 0, -5], showAt: 4, color: "#60a5fa" },
      { id: "slot3", label: "3", type: "point", pos: [7, 0, -5], showAt: 4, color: "#fb923c" },
      { id: "slot4", label: "4 (new)", type: "point", pos: [9.5, 0, -5], showAt: 5, color: "#c084fc" },
      { id: "noteLRU", label: "Cache size 3, LRU evicts 1", type: "note", pos: [5.5, 4, -7.5], showAt: 4 },

      { id: "yt", label: "YouTube video", type: "storage", pos: [9, 0, 3], showAt: 6 },
      { id: "likes", label: "Like count (stale)", type: "cache", pos: [5, 0, 4], showAt: 6 },
      { id: "noteStale", label: "Refresh likes every hour", type: "note", pos: [7, 4.2, 7], showAt: 6 },

      { id: "gcache", label: "Distributed cache", type: "cache", pos: [1, 0, 5], showAt: 7, color: "#c084fc" },
      { id: "svcA", label: "Service A", type: "service", pos: [-4, 0, 5], showAt: 7 },
      { id: "svcB", label: "Service B", type: "service", pos: [-4, 0, 7.5], showAt: 7 },
      { id: "notePlace", label: "In-process + DB + global", type: "note", pos: [1, 4.5, 7.5], showAt: 7 }
    ],
    edges: [
      { from: "phone", to: "srv", label: "100 ms" },
      { from: "srv", to: "db", label: "10 ms" },
      { from: "phone", to: "phoneCache", showAt: 2 },
      { from: "srv", to: "mem", showAt: 1 },
      { from: "u1", to: "srv", showAt: 1 },
      { from: "u2", to: "srv", showAt: 1 },
      { from: "srv", to: "slot1", showAt: 4, dashed: true },
      { from: "db", to: "likes", showAt: 6, dashed: true },
      { from: "likes", to: "yt", showAt: 6 },
      { from: "svcA", to: "gcache", showAt: 7 },
      { from: "svcB", to: "gcache", showAt: 7 },
      { from: "gcache", to: "db", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "Uncached feed: 220 milliseconds",
        text: "Phone to server 100 ms, server to database 10 ms, back 10 ms, home 100 ms. The inner hop looks small, but every service in the company pays it.",
        highlight: ["phone", "srv", "db", "note220"],
        hide: ["phoneCache", "mem", "u1", "u2", "noteCohort", "slot1", "slot2", "slot3", "slot4", "noteLRU", "yt", "likes", "noteStale", "gcache", "svcA", "svcB", "notePlace"],
        flows: [
          { from: "phone", to: "srv", color: "#4ade80", label: "100 ms" },
          { from: "srv", to: "db", color: "#4ade80", label: "10 ms" },
          { from: "db", to: "srv", color: "#60a5fa", label: "10 ms" },
          { from: "srv", to: "phone", color: "#60a5fa", label: "100 ms" }
        ]
      },
      {
        title: "Cohort hit in app memory",
        text: "Build the feed once for a young football fan in India. Store it in local memory. The next similar engineer is served in about 1 ms each way instead of another database round trip.",
        highlight: ["u1", "u2", "mem", "noteCohort", "srv"],
        hide: ["phoneCache", "slot1", "slot2", "slot3", "slot4", "noteLRU", "yt", "likes", "noteStale", "gcache", "svcA", "svcB", "notePlace"],
        flows: [
          { from: "u1", to: "srv", color: "#4ade80", label: "fill" },
          { from: "srv", to: "db", color: "#4ade80", label: "once" },
          { from: "u2", to: "srv", color: "#60a5fa", label: "hit" },
          { from: "srv", to: "mem", color: "#60a5fa", label: "1 ms" }
        ]
      },
      {
        title: "Cache on the phone too",
        text: "The user scrolls, locks the phone, comes back. Replay the feed already on the device. Two hundred milliseconds of network become about two. Backend cache and client cache stack.",
        highlight: ["phone", "phoneCache"],
        hide: ["u1", "u2", "noteCohort", "slot1", "slot2", "slot3", "slot4", "noteLRU", "yt", "likes", "noteStale", "gcache", "svcA", "svcB", "notePlace", "mem"],
        flows: [
          { from: "phone", to: "phoneCache", color: "#60a5fa", label: "2 ms" }
        ]
      },
      {
        title: "Only the hot slice fits in RAM",
        text: "You will not lift petabytes into memory. Keep the popular keys, accept that maybe 90% hit and 10% miss, and budget a few milliseconds of remaining database work. Prediction is the job.",
        highlight: ["mem", "db", "srv"],
        hide: ["phoneCache", "u1", "u2", "noteCohort", "slot1", "slot2", "slot3", "slot4", "noteLRU", "yt", "likes", "noteStale", "gcache", "svcA", "svcB", "notePlace"],
        flows: [
          { from: "srv", to: "mem", color: "#4ade80", label: "90%" },
          { from: "srv", to: "db", color: "#fb923c", label: "10%" }
        ]
      },
      {
        title: "LRU with three slots",
        text: "Requests 1, 2, 3 fill the cache. A viral key (or just key 4) must enter. LRU kicks out 1, the oldest. Write policy (when to update the copy) and eviction policy (what leaves) are the two questions every cache answers.",
        highlight: ["slot1", "slot2", "slot3", "noteLRU", "db"],
        hide: ["phoneCache", "u1", "u2", "noteCohort", "slot4", "yt", "likes", "noteStale", "gcache", "svcA", "svcB", "notePlace", "mem"],
        flows: [
          { from: "db", to: "slot1", color: "#4ade80", label: "1" },
          { from: "db", to: "slot2", color: "#60a5fa", label: "2" },
          { from: "db", to: "slot3", color: "#fb923c", label: "3" }
        ]
      },
      {
        title: "Thrashing: 4 evicts 1, then you ask for 1",
        text: "After 4 arrives, the client asks for 1 again, then 2. LRU keeps evicting the next key in the sequence. You paid for a cache and bought extra misses. A bad hit rate is slower than no cache.",
        highlight: ["slot2", "slot3", "slot4", "noteLRU"],
        fail: ["slot1"],
        hide: ["phoneCache", "u1", "u2", "noteCohort", "yt", "likes", "noteStale", "gcache", "svcA", "svcB", "notePlace", "mem"],
        flows: [
          { from: "db", to: "slot4", color: "#c084fc", label: "load 4" },
          { from: "srv", to: "db", color: "#f87171", label: "miss 1" }
        ]
      },
      {
        title: "Stale likes are allowed; money is not",
        text: "The database is the source of truth. The cache can refresh like-counts every minute or hour. Viewers see an old number; that is eventual consistency of a copy. Do not play that game with financial writes.",
        highlight: ["yt", "likes", "db", "noteStale"],
        hide: ["phoneCache", "u1", "u2", "noteCohort", "slot1", "slot2", "slot3", "slot4", "noteLRU", "gcache", "svcA", "svcB", "notePlace", "mem"],
        flows: [
          { from: "db", to: "likes", color: "#c084fc", label: "hourly" }
        ]
      },
      {
        title: "Three homes for a cache",
        text: "A map inside the app, a small cache inside the database, and a global cluster that many services call. Large systems use all three. You design the distributed one: independent scale, independent deploys, shared get/put.",
        highlight: ["mem", "gcache", "db", "svcA", "svcB", "notePlace"],
        hide: ["phoneCache", "u1", "u2", "noteCohort", "slot1", "slot2", "slot3", "slot4", "noteLRU", "yt", "likes", "noteStale"],
        flows: [
          { from: "svcA", to: "gcache", color: "#4ade80", label: "GET" },
          { from: "svcB", to: "gcache", color: "#4ade80", label: "GET" },
          { from: "gcache", to: "db", color: "#fb923c", label: "miss" }
        ]
      }
    ]
  }
});
