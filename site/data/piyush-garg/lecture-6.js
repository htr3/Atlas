window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 6,
  title: "Master Rate Limiting - System Design",
  video: "https://www.youtube.com/watch?v=CVItTb_jdkE",
  category: "Piyush Garg",
  tagline: "Five algorithms sit in front of a 100-req/min box so a burst dies with HTTP 429, not a crash.",
  summary: "A 2 vCPU / 4 GB machine is only honestly good for about 100 requests per minute. A rate limiter checks that quota before application logic, DB work, or in-memory math, and answers 429 Too Many Requests when the box needs air. Piyush walks token bucket (capacity 5, refill 3/s — Amazon and Stripe), leaky bucket (queue with a hole, shower from a 1500 L tank), fixed-window counters and their edge-burst bug, sliding-window logs of timestamps, and the hybrid sliding-window counter that weights the previous window by how far you are into the current one.",

  theory: [
    {
      heading: "The box is a machine, not an infinite queue",
      body: "Users send HTTP, the server runs application logic, queries, mutations, and validations, then replies. That cycle costs CPU and RAM. Piyush's example box is <b>2 vCPU and 4 GB</b>. A comfortable number is <b>100 requests per minute</b>. 101 will not instantly die, 150 will heat and stutter, 200 is a crash. You cannot police users, so you insert a limiter: if the minute is still under 100, pass the request; if you are already at 112, <b>drop it at the limiter</b> with <code>429 Too Many Requests</code> so the origin gets breathing room. Processing here means everything downstream of that check — code, DB, math — so the limiter is cheap on purpose.",
      bullets: [
        "100/min is a safety number, not a hard cliff at 101.",
        "ByteByteGo chapter 3 is the article Piyush reads while drawing the five algorithms.",
        "Drop at the edge. Do not let a flood pay for a database round-trip."
      ]
    },
    {
      heading: "Token bucket: coins in a pail, refill on a clock",
      body: "Imagine a bucket that holds at most <b>five tokens</b> and a refiller that pours <b>three tokens every second</b>. Empty at t=0. After second 1 you have three coins. Each request must pull one coin; if a coin exists the request reaches the server, otherwise you 429. In one second three users drain the three coins. Second 2 refills three. A fourth parallel request in that second finds an empty bucket and is rejected. If a quiet second 3 and 4 try to add three more, the bucket <b>stops at five</b> — overflow is discarded. Amazon and Stripe throttle APIs this way. Two knobs: bucket size (burst) and refill rate (sustained). Both are magic until you measure the box.",
      bullets: [
        "A request is allowed only while a token can be taken.",
        "Idle time banks a burst, capped at capacity.",
        "Easy to code and memory-cheap; hard to tune in production."
      ]
    },
    {
      heading: "Leaky bucket: a hole, a queue, a shower head",
      body: "Requests fall into a bucket that leaks at a <b>fixed rate</b>, implemented as a FIFO. Users may dump <b>20,000 requests/min</b> at the tap; if the origin can only do <b>five per minute</b>, the hole is sized to five. The lecture's picture is a rooftop tank of 1000–1500 L: open the pipe raw and you drown; a shower head meters the flow. Capacity might be <b>10,000</b> queued items. If the bucket is already full, new work is dropped with 429. Benefit: outflow is stable even when inflow is not. Cost: a burst of old requests can fill the queue so a fresh legitimate call waits behind stale ones, and you still have two knobs (queue size and leak rate) to tune by feel.",
      bullets: [
        "Inflow can be bursty. Outflow is constant — that is the whole point.",
        "Token bucket spends saved coins (burst). Leaky bucket never lets the origin see a burst.",
        "Same 429 when the queue cannot take another item."
      ]
    },
    {
      heading: "Fixed window counter: one integer per slice of time",
      body: "Chop the timeline into fixed slices — 1 s, 5 s, or 1 min depending on the policy. Piyush's demo is <b>three requests per second</b>. Window 0–1 s: three requests arrive, the counter hits 3, extras in that second are rejected. At 1.0 s the counter <b>resets to 0</b> because the window changed. Window 1–2 s can take three more. Memory is one integer. Resetting the quota at the boundary is also the feature: a burst right after the tick is allowed even if you just finished a full previous window.",
      bullets: [
        "Each request increments the counter; at the threshold, drop until the next window.",
        "Window size is the policy (per second vs per minute), not a property of HTTP.",
        "Cheap, obvious, and the first algorithm people write."
      ]
    },
    {
      heading: "The edge bug: 0.5 s to 1.5 s is still one second",
      body: "Windows 0–1 and 1–2 each stay at three. Highlight 0.5–1.5: that sliding second still contains <b>four</b> allowed requests — three near the end of window 1 plus the first of window 2. The same overlap sits on every boundary. The allowed quota is 3/s; the overlapping second processed 4/s. ByteByteGo names it: bursts at the <i>edges</i> of the window can exceed quota. Piyush treats it as both a bug and a mercy: if the crash number is six, one extra request is still on the safe side. If the box is tight, this algorithm is the wrong one.",
      bullets: [
        "Fixed windows do not look at a true rolling second; they look at clock buckets.",
        "The spike is always at the seam between two counters.",
        "Do not claim 'never more than N per second' if you only have a fixed counter."
      ]
    },
    {
      heading: "Sliding window log: timestamps, then expire the left edge",
      body: "Keep a log of request timestamps, usually in cache. Policy in the drawing: <b>three requests in any 5 s</b>. Request at t=1 is logged. t=3 and t=4.5 are logged. At t=6 the 5 s window has slid: t=1 is older than the start of the current window, so it is removed. Two timestamps remain, so t=6 is accepted and logged. At t=7 three stamps are already in the window, so two new requests are rejected. At t=8, t=3 has aged out, count is 2, so t=8 is accepted. Algorithm: drop outdated stamps, append now, accept if log size is still at or under the limit. The window moves continuously, so the edge bug of fixed counters is gone. You pay with memory: every timestamp in the window lives in the log.",
      bullets: [
        "Outdated means older than (now − window).",
        "Count the log, do not reset a counter on a clock tick.",
        "This is the accurate algorithm; it is also the most state."
      ]
    },
    {
      heading: "Sliding window counter: previous window times leftover percent",
      body: "Hybrid of the last two. You still store <b>fixed windows with counters</b> (cheap). For a request at 3.1 s, that instant is <b>10%</b> into the 3–4 s window, so you take <b>90%</b> of the previous window's count plus the current count. If that weighted sum is still under three, allow. If 3.1 s is treated as 20% into the window, you take 80% of the previous window — two requests already sitting there can push you over and you reject. Same idea at any seam: a request 30% into the new window consults 70% of the old. You approximate a sliding window without storing every timestamp. Edges are accounted for; you do not get the exact log, you get a weighted counter.",
      bullets: [
        "Fixed buckets for storage, a sliding percent for the decision.",
        "This is the last algorithm in the lecture, and the one that closes the edge bug without a full log.",
        "Tune window size the same way you would for a fixed counter."
      ]
    },
    {
      heading: "Pick the algorithm for the burst you will allow",
      body: "Token bucket: spend coins, allow a short burst after idle, refill on a timer. Leaky bucket: queue and leak, origin always sees a smooth rate. Fixed window: one counter, reset on a tick, edge overshoot. Sliding log: exact rolling window, more RAM. Sliding counter: hybrid, weight the previous window. In an interview, draw the 100/min box first, name 429, then walk the algorithm the interviewer asked for with Piyush's numbers — 5 tokens / 3 per second, 20k in vs 5 out, 3 per second with a 0.5–1.5 overlap, 3 per 5 s log, 10%/90% hybrid — before talking Redis.",
      bullets: [
        "All five drop with 429 when they refuse.",
        "Two-parameter algorithms (size + rate) need production tuning, not a lucky 5 and 3.",
        "Say which burst you want: saved tokens, zero burst, or a rolling exact count."
      ]
    }
  ],

  keyTerms: [
    { term: "Rate limiter", def: "A check in front of the origin that passes traffic only while a quota is left, else 429." },
    { term: "HTTP 429", def: "Too Many Requests. The client should back off; the origin never saw the work." },
    { term: "Token bucket", def: "A capped pile of tokens refilled at a fixed rate. One token per allowed request." },
    { term: "Leaky bucket", def: "A FIFO that accepts bursts into a queue and leaks at a constant process rate." },
    { term: "Fixed window counter", def: "One integer per clock bucket. Reset when the bucket rolls. Cheap, edge-buggy." },
    { term: "Sliding window log", def: "A cache of timestamps. Expire those older than the window, then count." },
    { term: "Sliding window counter", def: "Weighted mix of the previous fixed bucket and the current one, by percent elapsed." },
    { term: "Refill rate", def: "Tokens added per second (token bucket) or requests leaked per unit time (leaky)." }
  ],

  tradeoffs: [
    { pro: "Token bucket is simple, memory-light, and lets a short burst after idle — Amazon and Stripe use it.", con: "Capacity and refill rate are magic until you measure; a saved pile can still spike the origin." },
    { pro: "Leaky bucket gives the origin a constant outflow, like a shower head on a 1500 L tank.", con: "A burst of old requests can fill the queue so new work waits or 429s behind stale items." },
    { pro: "Fixed window is one integer and a reset. Easy to ship.", con: "A rolling second that straddles the tick (0.5–1.5) can process more than the quota." },
    { pro: "Sliding log matches a true rolling window and kills the edge bug.", con: "You store every timestamp in the window, usually in cache." },
    { pro: "Sliding counter approximates the log with two counters and a percent.", con: "It is an estimate, not an exact count of the last N seconds." }
  ],

  interviewTips: [
    "Open with a finite box: 2 vCPU, 4 GB, ~100 req/min, then put the limiter in front and name 429.",
    "Token bucket: capacity 5, refill 3/s, overflow discarded, one token per request. Cite Amazon/Stripe.",
    "Leaky bucket: FIFO, 20k in vs 5 out, shower-head analogy, 429 when the 10k queue is full.",
    "Draw the 0.5–1.5 overlap on a 3/s fixed window and say four requests went through that rolling second.",
    "Sliding log: drop stamps older than now − window, append, accept if size ≤ limit (3 per 5 s in the talk).",
    "Hybrid: at 3.1 s take 90% of the previous window's count plus current. That is sliding-window counter."
  ],

  scene: {
    nodes: [
      { id: "u1", label: "User A", type: "user", pos: [-11, 0, -3] },
      { id: "u2", label: "User B", type: "user", pos: [-11, 0, 3] },
      { id: "rl", label: "Rate limiter", type: "gateway", pos: [-5.5, 0, 0], showAt: 1 },
      { id: "box", label: "2 vCPU 4GB", type: "zone", pos: [7, 0, 0], size: [7.5, 6] },
      { id: "srv", label: "Origin", type: "server", pos: [7, 0, 0] },
      { id: "nCap", label: "Happy: 100 req / min", type: "note", pos: [7, 0, -6] },

      { id: "refill", label: "Refill 3 / s", type: "worker", pos: [0.5, 0, -6], showAt: 2, color: "#4ade80" },
      { id: "bucket", label: "Token bucket", type: "queue", pos: [0.5, 0, 0], showAt: 2 },
      { id: "tk1", label: "T", type: "point", pos: [-1.2, 0, 0], showAt: 2, color: "#facc15" },
      { id: "tk2", label: "T", type: "point", pos: [0.5, 0, 1.6], showAt: 2, color: "#facc15" },
      { id: "tk3", label: "T", type: "point", pos: [2.2, 0, 0], showAt: 2, color: "#facc15" },
      { id: "tk4", label: "T", type: "point", pos: [-1.2, 0, -1.8], showAt: 4, color: "#facc15" },
      { id: "tk5", label: "T", type: "point", pos: [2.2, 0, -1.8], showAt: 4, color: "#facc15" },
      { id: "nTok", label: "Capacity 5 tokens", type: "note", pos: [0.5, 0, 5.5], showAt: 2 },

      { id: "leakQ", label: "FIFO queue", type: "queue", pos: [0.5, 0, 2.2], showAt: 5, color: "#60a5fa" },
      { id: "hole", label: "Leak 5 / min", type: "lb", pos: [0.5, 0, -3.5], showAt: 5 },
      { id: "nShower", label: "Shower head on 1500 L", type: "note", pos: [0.5, 0, 6.5], showAt: 5 },

      { id: "w0", label: "0–1s", type: "zone", pos: [-7, 0, 6.2], size: [4.2, 2.2], showAt: 6 },
      { id: "w1", label: "1–2s", type: "zone", pos: [-1.5, 0, 6.2], size: [4.2, 2.2], showAt: 6 },
      { id: "w2", label: "2–3s", type: "zone", pos: [4, 0, 6.2], size: [4.2, 2.2], showAt: 6 },
      { id: "rA", label: "3", type: "point", pos: [-7, 0, 6.2], showAt: 6, color: "#4ade80" },
      { id: "rB", label: "3", type: "point", pos: [-1.5, 0, 6.2], showAt: 6, color: "#4ade80" },
      { id: "nEdge", label: "0.5–1.5s saw 4 req", type: "note", pos: [-4.2, 0, -7], showAt: 7 },

      { id: "log", label: "Timestamp log", type: "cache", pos: [0.5, 0, 3.5], showAt: 8 },
      { id: "nLog", label: "3 req / 5 s window", type: "note", pos: [7, 0, 6.5], showAt: 8 },

      { id: "nHyb", label: "3.1s = 10% → take 90% prev", type: "note", pos: [0.5, 0, -7], showAt: 9 }
    ],
    edges: [
      { from: "u1", to: "srv", label: "HTTP" },
      { from: "u1", to: "rl", label: "req", showAt: 1 },
      { from: "u2", to: "rl", showAt: 1 },
      { from: "rl", to: "srv", label: "pass", showAt: 1 },
      { from: "refill", to: "bucket", label: "+3/s", showAt: 2 },
      { from: "rl", to: "bucket", label: "take 1", showAt: 2 },
      { from: "u1", to: "leakQ", showAt: 5 },
      { from: "u2", to: "leakQ", showAt: 5 },
      { from: "leakQ", to: "hole", label: "FIFO", showAt: 5 },
      { from: "hole", to: "srv", label: "steady", showAt: 5 },
      { from: "rl", to: "log", showAt: 8 },
      { from: "w0", to: "w1", label: "edge", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "A 2 vCPU box has a happy number",
        text: "Users call the origin. Processing is app logic, queries, mutations, validations. Piyush's machine is 2 vCPU / 4 GB. About 100 requests per minute is safe; 150 hurts; 200 crashes. The number is an approximation, not a cliff at 101.",
        highlight: ["u1", "u2", "srv", "nCap", "box"],
        flows: [
          { from: "u1", to: "srv", color: "#4ade80", label: "req" },
          { from: "srv", to: "u1", color: "#60a5fa", label: "res" }
        ]
      },
      {
        title: "Limiter in front, 429 at the door",
        text: "Insert a rate limiter. Under quota, the request reaches the origin. Over quota (already 112 in the minute), drop here with HTTP 429 Too Many Requests so the box can breathe.",
        highlight: ["rl", "srv", "u2"],
        fail: ["u2"],
        flows: [
          { from: "u1", to: "rl", color: "#4ade80", label: "ok" },
          { from: "rl", to: "srv", color: "#4ade80", label: "pass" },
          { from: "u2", to: "rl", color: "#f87171", label: "429" }
        ]
      },
      {
        title: "Token bucket: capacity 5, refill 3/s",
        text: "A refiller pours three tokens every second into a bucket that holds at most five. Empty at t=0; after second 1 you have three coins. Amazon and Stripe use this shape. Each request must take one token.",
        highlight: ["refill", "bucket", "tk1", "tk2", "tk3", "nTok"],
        hide: ["tk4", "tk5"],
        flows: [
          { from: "refill", to: "bucket", color: "#4ade80", label: "+3" }
        ]
      },
      {
        title: "Fourth parallel request finds no coin",
        text: "Three requests in one second spend the three tokens and reach the origin. A fourth in the same second sees an empty bucket and is 429. Wait for the next refill tick.",
        highlight: ["bucket", "rl", "u2", "srv"],
        fail: ["u2"],
        hide: ["tk1", "tk2", "tk3", "tk4", "tk5"],
        flows: [
          { from: "u1", to: "rl", color: "#4ade80", label: "take T" },
          { from: "rl", to: "bucket", color: "#facc15", label: "-1" },
          { from: "rl", to: "srv", color: "#4ade80", label: "3 ok" },
          { from: "u2", to: "rl", color: "#f87171", label: "empty" }
        ]
      },
      {
        title: "Overflow dies at five",
        text: "A quiet second still refills three, but the bucket never grows past five. Extra tokens are discarded. Burst after idle is real; unbounded burst is not. Two knobs to tune: size and refill rate.",
        highlight: ["tk1", "tk2", "tk3", "tk4", "tk5", "bucket", "nTok"],
        flows: [
          { from: "refill", to: "bucket", color: "#4ade80", label: "cap 5" }
        ]
      },
      {
        title: "Leaky bucket: shower head, not the tank",
        text: "20,000 requests/min can fall into a FIFO. The hole leaks at the origin's rate — five per minute in the talk — like a shower on a 1500 L tank. Queue capacity 10,000; past that, 429. Outflow is stable. A burst of old work can starve new work.",
        highlight: ["leakQ", "hole", "nShower", "srv"],
        hide: ["bucket", "tk1", "tk2", "tk3", "tk4", "tk5", "refill", "nTok"],
        flows: [
          { from: "u1", to: "leakQ", color: "#60a5fa", label: "burst in" },
          { from: "u2", to: "leakQ", color: "#60a5fa", label: "in" },
          { from: "leakQ", to: "hole", color: "#fb923c", label: "FIFO" },
          { from: "hole", to: "srv", color: "#4ade80", label: "5/min" }
        ]
      },
      {
        title: "Fixed windows: 3 per second, reset on the tick",
        text: "Split time into 1 s buckets. Each request increments a counter. At 3, drop until the next window. At 1.0 s the counter resets. Cheap: one integer. The quota comes back on a clock edge, which is also the trap.",
        highlight: ["w0", "w1", "w2", "rA", "rB", "rl"],
        hide: ["bucket", "tk1", "tk2", "tk3", "tk4", "tk5", "refill", "nTok", "leakQ", "hole", "nShower"],
        flows: [
          { from: "u1", to: "rl", color: "#4ade80", label: "++" },
          { from: "rl", to: "srv", color: "#4ade80", label: "count<3" }
        ]
      },
      {
        title: "Edge bug: 0.5 s to 1.5 s processed four",
        text: "Each clock window stayed at three, but the rolling second 0.5–1.5 still contains four allowed requests. Bursts at the seam exceed quota. If crash is six, one extra is survivable. If the box is tight, this algorithm lied.",
        highlight: ["w0", "w1", "nEdge", "rA", "rB"],
        hide: ["bucket", "tk1", "tk2", "tk3", "tk4", "tk5", "refill", "nTok", "leakQ", "hole", "nShower", "w2"],
        flows: [
          { from: "w0", to: "w1", color: "#f87171", label: "overlap" }
        ]
      },
      {
        title: "Sliding log: expire left, count the rest",
        text: "Cache timestamps. Policy: 3 requests in any 5 s. At t=6 the stamp at t=1 ages out, count is 2, so t=6 is accepted. At t=7 three stamps remain, extras reject. At t=8, t=3 expires and t=8 is accepted. Exact rolling window; more RAM.",
        highlight: ["log", "nLog", "rl"],
        hide: ["bucket", "tk1", "tk2", "tk3", "tk4", "tk5", "refill", "nTok", "leakQ", "hole", "nShower", "w0", "w1", "w2", "rA", "rB", "nEdge"],
        flows: [
          { from: "u1", to: "rl", color: "#4ade80", label: "now" },
          { from: "rl", to: "log", color: "#fb923c", label: "append" }
        ]
      },
      {
        title: "Hybrid counter: 10% now, 90% of previous",
        text: "Keep fixed counters. A request at 3.1 s is 10% into the window, so add 90% of the previous window's count. If that weighted sum is under three, allow. Same edge, no full log. Last algorithm in the lecture: sliding-window counter.",
        highlight: ["w0", "w1", "nHyb", "rl"],
        hide: ["bucket", "tk1", "tk2", "tk3", "tk4", "tk5", "refill", "nTok", "leakQ", "hole", "nShower", "log", "nLog", "nEdge"],
        flows: [
          { from: "w0", to: "w1", color: "#c084fc", label: "90%" },
          { from: "u1", to: "rl", color: "#4ade80", label: "3.1s" }
        ]
      }
    ]
  }
});
