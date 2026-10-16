window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 20,
  title: "Design a URL Shortener",
  category: "Service Patterns",
  tagline: "Turn a long link into a short key, then redirect — the hard part is the key, not the redirect.",
  summary: "A URL shortener stores a mapping from a short key to a long URL and answers reads with an HTTP redirect. Writes mint a unique key (a base62 counter is safer than a raw hash), reads are cache-heavy, and 301 versus 302 decides whether you can still count clicks. Hot keys sit in a cache; the database is sharded by key. The service is tiny, but collisions, expiry, and abuse are the interview.",

  theory: [
    {
      heading: "Two paths, and they are not equal",
      body: "A client sends a long URL. The write path stores <code>key → long URL</code> and returns <code>https://short.example/key</code>. Later, a browser hits that short link. The read path looks up the key and responds with a redirect. Reads outnumber writes by orders of magnitude, so the design is a <b>read-optimized key-value lookup</b> with a boring write.",
      bullets: [
        "Write: validate the URL, mint a key, persist the row, return the short link.",
        "Read: cache, then database, then <code>Location</code> header.",
        "Do not run analytics, malware checks, or personalization on the redirect hot path."
      ]
    },
    {
      heading: "Mint keys with a counter, not a hope",
      body: "A 7-character base62 key (<code>0-9A-Za-z</code>) has about 3.5 trillion values. Take the next id from a <b>distributed counter</b> (or a range each app server reserved) and encode it. That key is unique by construction. Hashing the long URL looks simpler and then collides; you must probe or lengthen the key. If the same long URL should always reuse one short link, store a second index from a hash of the URL to the key — that is dedupe, not the identity of the key.",
      bullets: [
        "Base62 of an id avoids the collision loop.",
        "Pre-allocate id ranges so servers do not lock one row for every insert.",
        "Reject non-http(s) URLs and obvious abuse before you spend an id."
      ]
    },
    {
      heading: "301 remembers, 302 lets you count",
      body: "A <b>301</b> tells browsers and clients the mapping is permanent. They cache it and may never call you again, which is fast and blinds your click stats. A <b>302</b> (or 307) says \"ask me next time,\" so every click hits the service. Product analytics wants 302. A link that will never change and must be cheap wants 301. Say which you picked and why.",
      bullets: [
        "Custom aliases (\"/launch\") are a separate unique index, not a replacement for generated keys.",
        "Expiry is a timestamp on the row; a miss after expiry is a 404, not a redirect.",
        "A cache of hot keys (CDN or Redis) absorbs the read spike; cold keys fall through to the database."
      ]
    },
    {
      heading: "Scale the lookup, not a join",
      body: "The row is a key and a string. Shard the table by the key (or by a prefix of it) so one redirect is one partition. Put a cache in front with a short TTL so a viral link does not melt one shard. The counter service is the write bottleneck; range allocation keeps it off the request path. There is no user graph and no feed fan-out — if the diagram grows a social network, you have left the problem."
    }
  ],

  keyTerms: [
    { term: "Base62 key", def: "A short alphabet (0-9, A-Z, a-z) encoding of an integer id. Seven characters cover trillions of links." },
    { term: "Redirect", def: "An HTTP response with a Location header. 301 may be cached by the client; 302 is revalidated." },
    { term: "Id range", def: "A block of counters reserved by one app server so inserts do not serialize on a single row." },
    { term: "Dedupe index", def: "Optional map from a hash of the long URL back to an existing key, separate from key generation." },
    { term: "Hot key", def: "A short link fetched far more often than others. It belongs in cache, not only on one database page." }
  ],

  tradeoffs: [
    { pro: "A counter plus base62 never collides and stays short.", con: "Ids are guessable unless you add a random suffix or you do not care." },
    { pro: "301 makes repeat clicks free.", con: "You lose the click, and you cannot change the target later for clients that cached it." },
    { pro: "Caching viral keys protects the shard.", con: "A stale cache serves a redirect after you expired or edited the row." },
    { pro: "Hashing the URL dedupes identical links.", con: "Using that hash as the only key forces collision handling on the write path." }
  ],

  interviewTips: [
    "Split the answer into write path and read path before you draw boxes.",
    "Prefer a base62 counter over \"hash it and hope.\" Mention range allocation.",
    "Choose 302 if the product counts clicks; say 301 only when the mapping is permanent and stats do not matter.",
    "Put a cache in front of a key-sharded store. Name expiry and custom aliases as columns, not new services.",
    "Estimate: 100 million new links a year is a small table. The interview is latency and uniqueness, not petabytes."
  ],

  scene: {
    nodes: [
      { id: "client", label: "Client", type: "phone", pos: [-9, 0, 0] },
      { id: "api", label: "Shortener API", type: "service", pos: [-4, 0, -2] },
      { id: "counter", label: "Id ranges", type: "worker", pos: [-4, 0, 3] },
      { id: "cache", label: "Hot-key cache", type: "cache", pos: [1, 0, -2], showAt: 3 },
      { id: "db", label: "key → URL", type: "db", pos: [5.5, 0, 1] },
      { id: "browser", label: "Browser", type: "user", pos: [-9, 0, 4], showAt: 3 },
      { id: "n0", label: "Write mints a key", type: "note", pos: [0, 0, -7] },
      { id: "n1", label: "Base62, no collision", type: "note", pos: [8, 0, -7], showAt: 1 },
      { id: "n2", label: "302 so you can count", type: "note", pos: [-8, 0, -7], showAt: 4 }
    ],
    edges: [
      { from: "client", to: "api", label: "long URL" },
      { from: "api", to: "counter", label: "next range" },
      { from: "api", to: "db", label: "put" },
      { from: "browser", to: "cache", label: "GET /key", showAt: 3 },
      { from: "cache", to: "db", label: "miss", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "Accept a long URL",
        text: "The write API validates the link, then asks for a new id. Nothing is redirected yet. This path is rare compared with later clicks.",
        highlight: ["client", "api", "n0"],
        flows: [{ from: "client", to: "api", color: "#4ade80", label: "POST" }]
      },
      {
        title: "Encode the next id",
        text: "The server already holds a range of ids, so it does not lock a global counter. Base62 of that id is the key. Uniqueness comes from the counter, not from hashing the URL.",
        highlight: ["api", "counter", "n1"],
        flows: [{ from: "api", to: "counter", color: "#60a5fa", label: "id" }]
      },
      {
        title: "Store key to URL",
        text: "One row: the key, the long URL, an optional expiry, an optional custom alias. Shard by key. Return the short link to the client.",
        highlight: ["api", "db"],
        flows: [{ from: "api", to: "db", color: "#c084fc", label: "put" }]
      },
      {
        title: "Read through the cache",
        text: "A later click hits the cache first. A viral key never reaches the database. A miss loads the row and fills the cache.",
        highlight: ["browser", "cache", "db"],
        flows: [
          { from: "browser", to: "cache", color: "#facc15", label: "GET" },
          { from: "cache", to: "db", color: "#c084fc", label: "miss" }
        ]
      },
      {
        title: "Redirect, and decide if you may forget",
        text: "Answer with Location set to the long URL. Use 302 when every click must be counted. Use 301 only when clients are allowed to cache the mapping forever.",
        highlight: ["browser", "cache", "n2"],
        flows: [{ from: "cache", to: "browser", color: "#4ade80", label: "302" }]
      }
    ]
  }
});
