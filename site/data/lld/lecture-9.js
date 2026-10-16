window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 9,
  title: "Rate Limiter: Low Level System Design",
  video: "https://www.youtube.com/watch?v=Eg5uH5sU3zw",
  category: "Low-Level Design",
  tagline: "Cap requests per user with sliding windows, leaky buckets, and a factory.",
  summary: "Rate limiting is asked as both HLD and LLD. This session treats it as an engineering tool: grantAccess() behind an interface, a sliding-window queue per user, a factory that swaps algorithms, and a concurrent deque because many requests arrive at once. Availability is the point — not accuracy or fault tolerance.",

  theory: [
    {
      heading: "Why limit, and what it buys",
      body: "A flood of calls — a bot, a DDoS, or a user minting fake accounts — can hang the server so honest traffic never lands, and can fill a database with junk rows. A limiter admits at most <b>X requests in Y time</b> (the lecture's example is five per second) per user or IP, and can also cap the whole service. The live poll's right answer is <b>availability</b>: you keep capacity for others. It does not make crashes heal (fault tolerance) and it does not make answers more correct. You still read every inbound packet; you save the <i>downstream</i> work — extra hops, DB writes, AWS/GCP burn.",
      bullets: [
        "Limits are usually per user; a global cap is a second layer.",
        "Ask whether this is a product (pluggable algorithms) or one app's middleware.",
        "Persistence, in-memory, and distributed limiting are requirement questions, not defaults."
      ]
    },
    {
      heading: "Client tricks and server choke points",
      body: "Debouncing on the client is a cousin: Amazon search should not fire B, then BA, then BAT. Wait for a pause between keys, or for N characters, and you cut frontend redraws and backend QPS. Throttling drops extras; debounce batches them. Captchas, WAF rules, and cached popular prefixes (everyone types \"B\") sit around the limiter. Drop a request that has already aged past a TTL rather than processing a corpse. Priority clients can live in a separate limiter so they are never starved.",
      bullets: [
        "Server-side limiting still needs a cheap check before the expensive service.",
        "Thread-safe limiters show up for principal/SD3 loops more than SD1.",
        "If the interviewer will not hint, ask: code this, or draw the service?"
      ]
    },
    {
      heading: "Skip UML when the API is tiny",
      body: "Cache and rate limiter do not need use-case → class-diagram theatre. There are no rich actors — you are building a library with insert/check semantics. Start at the interface: <code>boolean grantAccess()</code> (or grantAccess(userId) at the wrapper). Implementations swap internals; callers do not. That is the same plug-and-play shape as a cache eviction policy, and it is the Factory pattern: you name sliding window or leaky bucket and get that object, the way a shape factory returns a square or a triangle.",
      bullets: [
        "Factory hides constructors; Strategy/algorithm is what you pass in.",
        "Each user owns a window: Map<userId, SlidingWindow>.",
        "The wrapper prints \"able to access\" vs \"too many requests\" for the demo."
      ]
    },
    {
      heading: "Sliding window",
      body: "Keep a queue of timestamps for one user, a <code>bucketCap</code>, and a window length in milliseconds. On grantAccess: record now, <code>updateQueue(now)</code> so only stamps inside (now − window, now] remain, then if size &lt; cap offer now and return true, else false. Update walks from the oldest: while the gap from head to now is ≥ window, poll. An empty check avoids peeking a null head. This is a true sliding window, not a fixed epoch — every grant slides the interval by dropping stale stamps. Store a count in a hashmap if you only need totals; the queue is there because time order matters.",
      bullets: [
        "Example: requests at 1.1–1.5 fill a 1s/5 cap; 1.6 is denied; 2.5 drops 1.1–1.5 and may pass.",
        "updateQueue is private; customers should not know how you expire.",
        "Use a concurrent linked deque if many threads grant at once."
      ]
    },
    {
      heading: "Leaky bucket, token bucket, same facade",
      body: "Override grantAccess and change the structure; do not change the external boolean. Leaky bucket is a bucket with a hole: inflow can burst, outflow is constant (e.g. three requests every second). You enqueue arrivals and leak a fixed count per tick, so a quiet period empties the queue before the next burst. Token bucket is the dual — you pull tokens at a steady rate, which allows a short burst if tokens piled up. Sliding window evicts by age; leaky leaks by rate. Both belong behind the same interface so a factory can swap them for the caller's workload.",
      bullets: [
        "Leaky is smoother; token bucket is more burst-friendly.",
        "You do not have to code the second algorithm in the round — say what you would override.",
        "Backoff (exponential vs constant) is another pluggable policy in real libraries."
      ]
    },
    {
      heading: "Identity, concurrency, and ops",
      body: "User id is the lecture's key; IP and MAC are alternatives with spoofing caveats. Uber's Go limiter is cited as a small open-source read. Concurrency is only sketched: a concurrent deque, not a full proof. Multiple threads in updateQueue can still corrupt indices if you skip locking. Empty-queue guards exist because peek on a fresh window is null. In production, WAFs (AWS WAF showed up as a health-check false positive) and edge limiters on every exposed server are how large DDoS events are absorbed — configuration, not just this class.",
      bullets: [
        "Do not claim Cassandra-depth knowledge you cannot defend.",
        "Capacity estimates only when the prompt needs them.",
        "Practical builds (clone a social or shop) beat trivia for SD2 readiness."
      ]
    }
  ],

  keyTerms: [
    { term: "Rate limit", def: "Admit at most X requests in a time window per user, IP, or the whole service." },
    { term: "Availability", def: "Honest traffic still gets through because abusive or bursty callers are clipped." },
    { term: "grantAccess", def: "The one interface method every algorithm implements: true to pass, false to drop." },
    { term: "Sliding window", def: "Queue of timestamps; drop heads older than now minus window, then check size vs cap." },
    { term: "Leaky bucket", def: "Uneven inflow, constant leak rate, so the queue drains at a fixed QPS." },
    { term: "Token bucket", def: "Tokens refill at a steady rate; a burst can spend saved tokens." },
    { term: "Factory", def: "Caller names the algorithm; the factory returns that RateLimiter implementation." },
    { term: "Debounce", def: "Client-side wait (idle gap or N chars) so search does not send every keypress." },
    { term: "TTL drop", def: "Discard a request that aged out before you processed it." }
  ],

  tradeoffs: [
    { pro: "Per-user cap stops one bot without punishing everyone.", con: "A distributed botnet still needs a global/edge cap." },
    { pro: "Sliding window tracks the last Y ms exactly.", con: "You store every timestamp in the window, not a single counter." },
    { pro: "Leaky bucket smooths to a constant outflow.", con: "A legitimate burst waits even if the system is idle." },
    { pro: "Token bucket allows bursts after idle refill.", con: "A saved pile of tokens can still spike the backend." },
    { pro: "Factory plus interface lets tests swap algorithms.", con: "Distributed, persistent, and strictly thread-safe versions are extra scope." }
  ],

  interviewTips: [
    "Start with why (availability, save downstream), then X in Y, then per-user vs global.",
    "Ask HLD vs LLD up front if the interviewer will not steer you.",
    "Skip a full UML dump; an interface plus factory is the design.",
    "Walk one sliding-window grant: evict old stamps, compare size to cap, offer now.",
    "Name leaky vs token vs sliding and say you would only override grantAccess.",
    "Mention a concurrent queue and that a principal loop may demand a thread-safe proof."
  ],

  scene: {
    nodes: [
      { id: "bot", label: "Abusive client", type: "user", pos: [-10, 0, -4] },
      { id: "user", label: "Honest client", type: "user", pos: [-10, 0, 4] },

      { id: "rl", label: "RateLimiter", type: "gateway", pos: [-3, 0, 0] },
      { id: "factory", label: "RL factory", type: "lb", pos: [-3, 0, -5], showAt: 2 },
      { id: "map", label: "userId → window", type: "db", pos: [-3, 0, 5], showAt: 3 },

      { id: "slide", label: "Sliding window", type: "queue", pos: [4, 0, -4], showAt: 3 },
      { id: "leaky", label: "Leaky bucket", type: "queue", pos: [4, 0, 4], showAt: 6 },
      { id: "api", label: "App server", type: "server", pos: [10, 0, 0] },
      { id: "store", label: "Database", type: "db", pos: [10, 0, 5], showAt: 1 },

      { id: "n0", label: "max 5 per second", type: "note", pos: [4, 0, 0] },
      { id: "n1", label: "save downstream", type: "note", pos: [10, 0, -5], showAt: 1 },
      { id: "n2", label: "grantAccess()", type: "note", pos: [-7, 0, 7], showAt: 2 },
      { id: "n3", label: "evict then check cap", type: "note", pos: [4, 0, -7], showAt: 4 },
      { id: "n4", label: "constant leak rate", type: "note", pos: [4, 0, 7], showAt: 6 },
      { id: "n5", label: "same boolean API", type: "note", pos: [7, 0, -7], showAt: 7 }
    ],
    edges: [
      { from: "bot", to: "rl", label: "flood" },
      { from: "user", to: "rl", label: "API" },
      { from: "rl", to: "api", label: "allow" },
      { from: "factory", to: "rl", showAt: 2, dashed: true },
      { from: "rl", to: "map", showAt: 3 },
      { from: "map", to: "slide", showAt: 3 },
      { from: "api", to: "store", showAt: 1 },
      { from: "rl", to: "leaky", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Five requests per second",
        text: "A limiter sits in front of the app. One user may send at most five calls in a one-second window; the sixth in that second is not admitted. Availability for everyone else is the goal.",
        highlight: ["bot", "user", "rl", "api", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "user", to: "rl", color: "#4ade80", label: "1..5" },
          { from: "rl", to: "api", color: "#4ade80", label: "pass" },
          { from: "bot", to: "rl", color: "#f87171", label: "6th" }
        ]
      },
      {
        title: "Protect the interior",
        text: "You still parse the sixth request, but you do not fan it into extra network hops or fake-account rows. Downstream CPU, DB, and cloud spend stay with real users.",
        highlight: ["rl", "api", "store", "n1"],
        fail: ["bot"],
        hide: ["n0", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "bot", to: "rl", color: "#f87171", label: "drop" },
          { from: "user", to: "rl", color: "#4ade80", label: "ok" },
          { from: "rl", to: "api", color: "#4ade80", label: "work" },
          { from: "api", to: "store", color: "#60a5fa", label: "write" }
        ]
      },
      {
        title: "Interface and factory",
        text: "No big UML. RateLimiter exposes grantAccess. A factory takes the algorithm name and returns sliding-window or leaky-bucket, the same plug-in idea as cache eviction.",
        highlight: ["factory", "rl", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5"],
        flows: [
          { from: "factory", to: "rl", color: "#c084fc", label: "sliding" }
        ]
      },
      {
        title: "One window per user",
        text: "A map from user id to that user's queue holds timestamps. Granting access looks up the window, then updates it. A sliding algorithm without a per-user key would punish everyone for one bot.",
        highlight: ["map", "slide", "rl", "user"],
        hide: ["n0", "n1", "n2", "n4", "n5"],
        flows: [
          { from: "user", to: "rl", color: "#4ade80", label: "id=42" },
          { from: "rl", to: "map", color: "#60a5fa", label: "lookup" },
          { from: "map", to: "slide", color: "#60a5fa", label: "queue" }
        ]
      },
      {
        title: "Evict, then compare to cap",
        text: "updateQueue drops heads whose age is at least the window. If size is still under cap, offer now and return true. Stamps at 1.1–1.5 fill a 5-slot second; 2.5 slides them off.",
        highlight: ["slide", "rl", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5"],
        flows: [
          { from: "rl", to: "slide", color: "#fb923c", label: "evict old" },
          { from: "slide", to: "rl", color: "#4ade80", label: "size < cap" }
        ]
      },
      {
        title: "Deny when the window is full",
        text: "If after eviction the queue is at cap, grantAccess returns false and the app never sees the call. A concurrent deque is used because grants race.",
        highlight: ["slide", "bot", "rl"],
        fail: ["bot"],
        hide: ["n0", "n1", "n2", "n4", "n5"],
        flows: [
          { from: "bot", to: "rl", color: "#f87171", label: "grant?" },
          { from: "rl", to: "slide", color: "#f87171", label: "full" }
        ]
      },
      {
        title: "Leaky bucket as another class",
        text: "Same grantAccess, different state: leak a fixed number of queued requests every second while arrivals stay bursty. Quiet time empties the bucket before the next wave.",
        highlight: ["leaky", "factory", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5"],
        flows: [
          { from: "factory", to: "leaky", color: "#c084fc", label: "leaky" },
          { from: "user", to: "leaky", color: "#4ade80", label: "in" },
          { from: "leaky", to: "api", color: "#60a5fa", label: "steady out" }
        ]
      },
      {
        title: "Swap algorithms, keep the boolean",
        text: "Callers still hear true or false. Internals — queue of times vs constant leak vs tokens — stay hidden. That is the LLD: one facade, many rate policies.",
        highlight: ["rl", "slide", "leaky", "api", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "user", to: "rl", color: "#4ade80", label: "grant" },
          { from: "rl", to: "api", color: "#4ade80", label: "true" },
          { from: "bot", to: "rl", color: "#f87171", label: "false" }
        ]
      }
    ]
  }
});
