window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 10,
  title: "Monarch: Google's Planet-Scale In-Memory Time Series Database",
  video: "https://www.youtube.com/watch?v=NxPTVhc1tFA",
  category: "Paper Walkthroughs",
  tagline: "Petabytes of metrics in RAM — still answering when Spanner and Colossus are on fire.",
  summary: "Monarch is Google's in-memory time series store for server metrics. The lecture starts from per-team Borgmon, then shows why one shared TSDB had to ingest ~6 million points/s, answer in tens of milliseconds, and refuse hard dependencies on Spanner, Colossus, or Maglev. Histograms, 90% compression, a Dremel-like root/zone/leaf tree, trigram field-hints (~1000×), and hedged reads are the design.",

  theory: [
    {
      heading: "Borgmon was a tax on every team",
      body: "Circa 2010, Google Photos (and every other fleet) pushed CPU, latency, and similar gauges through a library called <b>Borgmon</b> — Borg monitor. Each team deployed and operated its own monitors. When Borgmon broke, that team debuged Borgmon. Duplicate work at Google scale is duplicate payroll. The principal-engineer move in the lecture is to pull metrics into <b>one</b> time series database: clients periodically push, application engineers stop babysitting the monitor.",
      bullets: [
        "Time series here means (timestamp, value) you can plot: CPU vs time, latency vs time.",
        "A spike at t1 is useless unless you can drill into that window.",
        "One shared system is cheaper than N copies of the same on-call."
      ]
    },
    {
      heading: "In RAM, and independent of Google",
      body: "Ingest is ~<b>6 million points per second</b>. The working set is <b>petabytes</b>. Queries for live graphs need <b>&lt;100 ms</b> (the talk also says tens of milliseconds). Disk-backed stores lose that race, so Monarch is <b>in-memory</b> — expensive, and cheaper than missing a Google outage. The harder constraint: if Spanner is down, if Colossus is down, if Maglev is sick, <b>Monarch still has to run</b>. Reaction time for the rest of Google is this UI. Soft dependencies (logs on Colossus, a load balancer) are allowed; a hard dependency is not. The lecture quotes the folklore: if things are literally on fire, Monarch is still up.",
      bullets: [
        "Monitoring cannot sit behind the databases it is supposed to watch.",
        "RAM is the availability story as much as the latency story.",
        "The paper the talk is teaching is Google's planet-scale answer to that constraint."
      ]
    },
    {
      heading: "Histograms plus one example per bucket",
      body: "Raw request latencies (10, 5, 10, 2, 6, … ms) make a noisy line. Monarch stores a <b>histogram per time window</b>: eight requests in 0–10 ms, one in 11–20, one in 81–90. Engineers read p99 off the buckets and see the anomaly as a tall bar, not a needle on a strip chart. Each bucket keeps an <b>example trace id</b> — a typical fast request and the one ugly 85 ms request — so Dapper-style drill-down has a handle. Windows can be inspected alone or aggregated. The x-axis of the original graph becomes the window key of a family of histograms.",
      bullets: [
        "Histogram = how the system felt during that window.",
        "Example traces turn \"p99 is bad\" into \"open this request\".",
        "Joining two metrics is joining two window keys, not two messy event streams."
      ]
    },
    {
      heading: "Two 90% compressions",
      body: "Raw points at this volume would be exabytes in RAM and millions of extra boxes. First trick: <b>share timestamps</b> across every histogram in a window. One timeline, many metrics. ~90% less timestamp storage, and joins (latency vs memory) become a lookup on the same t. Second trick: <b>differential encoding</b>. Adjacent windows look alike (8, 1, 1 then 7, 2, 1). Store the small deltas in fewer bits, another ~90% per series. Petabytes in memory instead of exabytes is the only reason the in-RAM bet closes.",
      bullets: [
        "Shared time axis is also the join key.",
        "Delta encoding assumes the next histogram is almost the last one — true for healthy systems.",
        "Compression is a capacity plan, not a micro-optimization."
      ]
    },
    {
      heading: "Root, zones, leaves — Dremel-shaped",
      body: "One global <b>root</b>. Under it, 30–40 <b>zones</b> (children). Under each zone, <b>leaves</b> that actually hold points. Writes never start at the root: a fleet emits (e.g. CPU every second) into a zone <b>ingest router</b>, which buffers and maps key → leaf. Each leaf appends a log on <b>Colossus</b> (GFS's successor) so a crashed leaf can rehydrate. Queries <i>do</i> start at the root, like Dremel: root picks zones, zone picks leaves, leaves return, zone aggregates, root aggregates, client plots. Indexes live in <b>separate</b> components at root and zone so the query path is not also the metadata path.",
      bullets: [
        "Write path: service → zone router → leaf → (async) Colossus log.",
        "Read path: client → root → zone → leaf, fold on the way up.",
        "Colossus is recovery, not the serving store — serving is RAM on the leaf."
      ]
    },
    {
      heading: "Trigram field-hints, ~1000× less fan-out",
      body: "The big read optimization is the <b>field-hints index</b>. Take every key a leaf stores, slide a window of three characters, emit trigrams (<code>$$c</code>, <code>$co</code>, <code>cou</code>, … <code>s$$</code>), hash them. That fingerprint is a Bloom-like filter: a query for key K only visits leaves whose index contains <i>all</i> of K's trigrams. ~<b>99.5%</b> of leaves are skipped. The talk's arithmetic: ~200× faster at the zone, root fan-out cut ~80% (~5×), stacked ~<b>1000×</b> on the query. That is how an engineer finds a needle in billions of in-memory points.",
      bullets: [
        "Trigrams are a cheap, lossy signature of the key string.",
        "False positives mean extra leaf hits; false negatives must not happen for correctness.",
        "Root index chooses zones; zone index + hints choose leaves."
      ]
    },
    {
      heading: "Precomputed caches for the questions you always ask",
      body: "A lot of Monarch load is periodic: max CPU over the last minute, fleet health, the graph on the wall. Those queries should not walk root → zone → leaf every ten seconds. Each zone (and the root, for global queries) keeps a <b>precomputed cache</b>. Dashboards hit the cache; a general ad-hoc query still walks the tree. The cache is an availability feature as well as a latency feature: the wall clock graph keeps moving while some leaves are unhappy.",
      bullets: [
        "Repeated questions belong in a cache, not in a full scatter/gather.",
        "Root cache for global views; zone cache for local views.",
        "Ad-hoc debug queries still pay the full path — that is fine."
      ]
    },
    {
      heading: "Three leaves, live moves, soft timeouts, hedges",
      body: "A point is stored on <b>three leaves in one zone</b>. One leaf dying does not fail the query; a whole zone dying does (accepted). Tail latency drops because you can pick a healthy replica. Shard moves: keep serving on leaf A, copy from Colossus onto leaf B, then cut over. Both may answer for a second or two so the client never sees the copy. <b>Soft timeout</b>: if a zone returns nothing in the first 5s of a 10s budget, cancel; if it has started streaming, wait out the 10s. <b>Hedging</b>: query leaf 1, wait ~1s, also query leaf 2, take the first answer, ignore the duplicate. Two seconds instead of a 10s leaf timeout.",
      bullets: [
        "In-zone triple copy: leaf failure ≠ query failure.",
        "Migration is overlap, not a freeze.",
        "Soft timeout and hedging are how Monarch refuses to hard-depend on a slow child."
      ]
    }
  ],

  keyTerms: [
    { term: "Borgmon", def: "Per-team Borg monitor. Duplicate ops load that Monarch was built to retire." },
    { term: "Time series", def: "Metric points indexed by time, stored so graphs and windowed histograms are cheap." },
    { term: "Histogram window", def: "Latency (or similar) buckets for one time slice, plus an example trace id per bucket." },
    { term: "Differential encoding", def: "Store deltas between adjacent histograms so similar windows compress ~90%." },
    { term: "Root / zone / leaf", def: "Dremel-like tree: one root, 30–40 zones, leaves in RAM; writes enter at the zone." },
    { term: "Field-hints", def: "Hashed trigrams of each key; a Bloom-like skip list that ignores ~99.5% of leaves." },
    { term: "Soft timeout", def: "If a child has produced no bytes by 5s, cancel; if it has, wait the remaining 10s budget." },
    { term: "Hedged read", def: "Retry the same query on a replica after ~1s and keep the first response." }
  ],

  tradeoffs: [
    { pro: "One in-memory TSDB: teams stop running Borgmon; graphs stay under 100ms.", con: "Petabytes of RAM is a large, ongoing hardware bill." },
    { pro: "Shared timestamps + deltas cut the footprint by about 90% twice.", con: "You stored summaries (histograms), not every raw event; some forensics need traces elsewhere." },
    { pro: "Trigram hints skip 99.5% of leaves (~1000× end-to-end in the talk).", con: "A poorly named key still fans out; the index is a filter, not a B-tree of every string." },
    { pro: "Three in-zone leaves plus overlap-on-move keep queries up during a leaf death.", con: "A dead zone still loses that copy — Monarch did not pay for cross-zone RAM replicas." },
    { pro: "Soft timeout and hedging refuse to wait 10s on a stuck child.", con: "Partial results and duplicate work; the UI must admit \"this graph is incomplete\"." }
  ],

  interviewTips: [
    "Start from Borgmon sprawl, then the three numbers: 6M points/s, petabytes in RAM, <100ms, no hard deps.",
    "Draw root → 30–40 zones → leaves, and put writes on the zone ingest path, not the root.",
    "Explain histograms + example traces before you mention compression — that is the data model.",
    "Name shared timestamps and differential encoding as the two ~90% wins that make RAM affordable.",
    "Field-hints: trigrams → hash → Bloom-like skip, 99.5% of leaves unused, ~1000× stacked with the root index.",
    "Availability story: three leaves, Colossus rehydrate, overlap migrate, 5s soft timeout, 1s hedged read."
  ],

  scene: {
    nodes: [
      { id: "zroot", label: "Root", type: "zone", pos: [-1, 0, 0], size: [7, 11], showAt: 4 },
      { id: "zzone", label: "Zone", type: "zone", pos: [7.5, 0, 0], size: [9, 11], showAt: 4 },

      { id: "eng", label: "SRE", type: "user", pos: [-11, 0, -4] },
      { id: "fleet", label: "Photos fleet", type: "server", pos: [-11, 0, 0] },
      { id: "borgmon", label: "Team Borgmon", type: "service", pos: [-11, 0, 4] },

      { id: "ingest", label: "Ingest router", type: "lb", pos: [-6, 0, 0], showAt: 1 },

      { id: "root", label: "Root", type: "server", pos: [-1, 0, -4], showAt: 4 },
      { id: "ridx", label: "Root index", type: "cache", pos: [-1, 0, 0], showAt: 6 },
      { id: "rcache", label: "Root cache", type: "cache", pos: [-1, 0, 4], showAt: 7 },

      { id: "zmix", label: "Zone mixer", type: "service", pos: [5, 0, -4], showAt: 4 },
      { id: "zidx", label: "Zone index", type: "cache", pos: [5, 0, 0], showAt: 6 },
      { id: "zcache", label: "Zone cache", type: "cache", pos: [5, 0, 4], showAt: 7 },

      { id: "l1", label: "Leaf 1", type: "db", pos: [10, 0, -4], showAt: 4 },
      { id: "l2", label: "Leaf 2", type: "db", pos: [10, 0, 0], showAt: 4 },
      { id: "l3", label: "Leaf 3", type: "db", pos: [10, 0, 4], showAt: 8 },
      { id: "col", label: "Colossus", type: "storage", pos: [8, 0, 7], showAt: 8 },

      { id: "n0", label: "N teams, N Borgmons", type: "note", pos: [-11, 0, -7] },
      { id: "n1", label: "6M pts/s, petabytes RAM", type: "note", pos: [0, 0, -7], showAt: 1 },
      { id: "n2", label: "Histogram + example trace", type: "note", pos: [-6, 0, -7], showAt: 2 },
      { id: "n3", label: "Shared t + deltas ~90%", type: "note", pos: [-6, 0, 7], showAt: 3 },
      { id: "n4", label: "Writes enter at the zone", type: "note", pos: [7, 0, -7], showAt: 4 },
      { id: "n5", label: "Query folds on the way up", type: "note", pos: [-4, 0, 7], showAt: 5 },
      { id: "n6", label: "Trigrams skip 99.5% leaves", type: "note", pos: [10, 0, -7], showAt: 6 },
      { id: "n7", label: "Cache the wall-clock graph", type: "note", pos: [2, 0, 7], showAt: 7 },
      { id: "n8", label: "3 leaves, 5s soft, 1s hedge", type: "note", pos: [11, 0, 7], showAt: 8 }
    ],
    edges: [
      { from: "fleet", to: "borgmon", label: "push" },
      { from: "eng", to: "borgmon", label: "SSH debug" },
      { from: "fleet", to: "ingest", showAt: 4 },
      { from: "ingest", to: "zmix", showAt: 4 },
      { from: "zmix", to: "l1", showAt: 4 },
      { from: "zmix", to: "l2", showAt: 4 },
      { from: "eng", to: "root", showAt: 5 },
      { from: "root", to: "zmix", showAt: 5 },
      { from: "root", to: "ridx", showAt: 6 },
      { from: "zmix", to: "zidx", showAt: 6 },
      { from: "root", to: "rcache", showAt: 7 },
      { from: "zmix", to: "zcache", showAt: 7 },
      { from: "zmix", to: "l3", showAt: 8 },
      { from: "l1", to: "col", showAt: 8, dashed: true },
      { from: "l2", to: "col", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "Every fleet runs its own Borgmon",
        text: "Photos (and every other team) compiles the Borgmon library, deploys monitors, and SSHs in when a graph looks wrong. The same on-call tax is paid N times. That is the 2010-era problem Monarch is hired to delete.",
        highlight: ["eng", "fleet", "borgmon", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "fleet", to: "borgmon", color: "#4ade80", label: "CPU" },
          { from: "eng", to: "borgmon", color: "#fb923c", label: "debug" }
        ]
      },
      {
        title: "One in-memory TSDB, no hard deps",
        text: "A shared Monarch is in RAM because petabytes of live metrics must answer in tens of milliseconds (~6M points/s). Spanner down, Colossus down, Maglev sick: Monarch still has to plot. Monitoring cannot sit behind the systems it watches.",
        highlight: ["fleet", "n1"],
        fail: ["borgmon"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "fleet", to: "ingest", color: "#4ade80", label: "push" }
        ]
      },
      {
        title: "Histograms, not raw latency lines",
        text: "A window of request latencies becomes buckets (0–10 ms, 11–20, 81–90) plus one example trace id per bucket. p99 is a bar. The ugly 85 ms request is a Dapper handle. Windows join on a shared time key.",
        highlight: ["fleet", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "fleet", to: "ingest", color: "#4ade80", label: "latency" }
        ]
      },
      {
        title: "Share timestamps, store deltas",
        text: "One timeline is reused across metrics (~90% less timestamp bytes, and joins become lookups). Adjacent histograms barely change, so differential encoding stores small deltas (~90% again). Exabytes of raw points collapse to petabytes of RAM.",
        highlight: ["n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "fleet", to: "ingest", color: "#c084fc", label: "compress" }
        ]
      },
      {
        title: "Write path: zone router to leaf",
        text: "One global root, 30–40 zones, leaves that hold RAM. Writes do not go to the root. The fleet hits a zone ingest router; the router maps key → leaf. Serving is memory on the leaf. Colossus is only the recovery log.",
        highlight: ["ingest", "zmix", "l1", "l2", "n4", "zzone"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "fleet", to: "ingest", color: "#4ade80", label: "1s CPU" },
          { from: "ingest", to: "zmix", color: "#4ade80", label: "route" },
          { from: "zmix", to: "l1", color: "#4ade80", label: "key" }
        ]
      },
      {
        title: "Query path: root, zone, fold",
        text: "The SRE query always hits the root (Dremel-shaped). Root picks zones; the zone mixer picks leaves; results fold on the way up. Indexes sit in sidecar components so the query node is not also the catalog.",
        highlight: ["eng", "root", "zmix", "l1", "l2", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6", "n7", "n8"],
        flows: [
          { from: "eng", to: "root", color: "#60a5fa", label: "query" },
          { from: "root", to: "zmix", color: "#60a5fa", label: "zones" },
          { from: "zmix", to: "l1", color: "#60a5fa", label: "keys" },
          { from: "l1", to: "zmix", color: "#60a5fa", label: "partial" }
        ]
      },
      {
        title: "Trigram field-hints skip the fleet",
        text: "Each leaf key is fingerprinted as hashed trigrams. A query visits only leaves that contain every trigram — Bloom-filter logic. ~99.5% of leaves are ignored (~200× at the zone). The root index cuts fan-out ~80% more. Stacked, about 1000×.",
        highlight: ["ridx", "zidx", "l1", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n7", "n8"],
        flows: [
          { from: "root", to: "ridx", color: "#c084fc", label: "zones?" },
          { from: "zmix", to: "zidx", color: "#c084fc", label: "trigrams" },
          { from: "zidx", to: "l1", color: "#4ade80", label: "hit" }
        ]
      },
      {
        title: "Precompute the graph on the wall",
        text: "Max CPU over the last minute is asked every ten seconds. Zone and root caches hold those periodic answers. Dashboards stop walking every leaf. An ad-hoc debug query still takes the full root → zone → leaf path.",
        highlight: ["rcache", "zcache", "eng", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n8"],
        flows: [
          { from: "eng", to: "root", color: "#60a5fa", label: "health?" },
          { from: "root", to: "rcache", color: "#facc15", label: "hit" },
          { from: "zmix", to: "zcache", color: "#facc15", label: "1m max" }
        ]
      },
      {
        title: "Replicas, overlap move, hedge",
        text: "Three leaves in the same zone hold each point. Copy a shard from Colossus onto a new leaf while the old one still serves, then cut over. If a zone is silent for 5s of a 10s budget, cancel. If leaf 1 lags ~1s, also ask leaf 2 and keep the first reply.",
        highlight: ["l1", "l2", "l3", "col", "n8"],
        fail: ["l1"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "l1", to: "col", color: "#c084fc", label: "log" },
          { from: "col", to: "l3", color: "#c084fc", label: "rehydrate" },
          { from: "zmix", to: "l2", color: "#fb923c", label: "hedge" }
        ]
      }
    ]
  }
});
