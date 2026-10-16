window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 2,
  title: "Google Dremel",
  video: "https://www.youtube.com/watch?v=u8lKJWWVE0M",
  category: "Paper Walkthroughs",
  tagline: "SQL over petabytes in about a minute, using a serving tree and columns.",
  summary: "Google's 2008 Dremel paper — still the engine under BigQuery, Test of Time in 2020 — is walked as interactive analytics for people who are not writing MapReduce. The lecture covers the serving tree, shard pruning, GFS/Colossus plus Borg, a 95% prefetch cache, approximate early returns, and nested columnar storage.",

  theory: [
    {
      heading: "The MapReduce iteration tax",
      body: "In 2008 Google had petabytes it wanted to mine. Product managers and CXOs needed one-off questions: of people taking a long Mumbai–Goa drive, what fraction stop at a restaurant — maybe that is a contextual-ad idea. The production path was <b>MapReduce</b>: an engineer writes code, the job runs (and sometimes fails and restarts), a number comes back (56%), and the next question (\"last three months vs before?\") starts another job. Iteration was hours with a dedicated engineer and often <b>1–3 days</b> in practice. PMs waited on engineers; engineers spent half the day plumbing jobs. Nobody could make a decision at a desk.",
      bullets: [
        "Scan, process, and emit petabytes is slow if every question is a new distributed job.",
        "The bottleneck was the human loop, not just CPU: explain, code, run, reinterpret.",
        "Interactive here means an answer in about a minute, not a lunch break."
      ]
    },
    {
      heading: "SQL, no engineer in the loop",
      body: "Dremel's product bet: give PMs (or cheaper data analysts) a SQL surface and retire the MapReduce middleman. Most of these people already know SQL at a useful level. Access patterns are not \"dump every rider row\" — they are <b>counts, percentages, aggregates</b>. So filtration and aggregation have to be extremely fast, and the system can ignore row-wise OLTP concerns. That SQL-plus-aggregates decision is why Dremel (and later BigQuery) owns interactive analytics at Google.",
      bullets: [
        "Remove the software-engineer dependency from ad-hoc questions.",
        "Optimize for statistical queries over wide scans of nested records.",
        "Target: results in tens of seconds, bounded by about a minute."
      ]
    },
    {
      heading: "Query manager and the serving tree",
      body: "A dashboard query hits a <b>query manager</b> that is part rate limiter, part load balancer. It picks how much compute to spend — machines × threads — which trades money for latency, then sends work to a <b>root</b>. The root is the top of a tree of shards. Each shard owns a key range (k1–k1000 vs k>1000). The query fans out only to ranges it needs: if you want key 100, the subtree that holds 500+ is skipped. Intermediate shards recursively query children, then <b>aggregate on the way up</b> like a segment tree. Leaves read local disk, or miss to the distributed filesystem. The tree can be many levels deep; the query manager sizes it for the aggregation shape. Google repeats this tree pattern (the lecture points at Monarch).",
      bullets: [
        "Shards are physical servers, not just logical ranges.",
        "Prune subtrees whose key ranges cannot contribute.",
        "Parents combine partial aggregates; the root returns one answer."
      ]
    },
    {
      heading: "GFS, Colossus, Borg, Jupiter",
      body: "Leaves that do not have a block locally fetch it from <b>GFS</b> (2008) or <b>Colossus</b> (the successor almost every Google storage client uses). Network is <b>Jupiter</b>. The shard machines themselves are Borg tasks (the scheduler that became Kubernetes' ancestor). The lecture's Google four-pack is storage, network, compute/memory, and config/Spanner — Dremel leans on the first three for the query path. Compute for a query is elastic: more threads shorten wall time; fewer threads stretch it. That is how interactive jobs share a warehouse without a reserved Hadoop cluster per PM.",
      bullets: [
        "Hot blocks sit on leaf disks; cold blocks come from the distributed FS.",
        "Borg supplies the servers that become tree nodes.",
        "Query cost is a thread budget you can turn up or down."
      ]
    },
    {
      heading: "Prefetch cache and good-enough answers",
      body: "After a long-drive + restaurant query, the system <b>prefetches</b> nearby columns (other long-drive facts, other restaurant facts). Follow-up questions hit cache instead of walking to the leaf or GFS. The talk cites a <b>~95% hit rate</b>. Separately, PMs often tolerate 90–99% accuracy: ±2% on a 56% restaurant rate does not change the ad decision. The query manager can tell the root to return when ~90–98% of leaves have reported. A slow or down leaf (L3, L4) no longer holds the client. Top-k (\"ten most popular YouTube videos\") is the same trick: skip the straggler 2% that dominates tail latency.",
      bullets: [
        "Prefetch the neighborhood of the last query, not a generic LRU of rows.",
        "Approximate aggregation is a first-class latency knob.",
        "Interactive analytics values a timely 98% over a perfect minute-later 100%."
      ]
    },
    {
      heading: "Columnar nested storage",
      body: "Dremel stores records as <b>columns</b>, not as packed rows. Average-age of three people is three age values, not a scan of nine name/country/age fields. Same-type values compress: run-length encoding of zeros, and Google's own nested encoding (Huffman-like tree walks over protobuf-style records: trip → locations → users → interests). Nested columns need repetition and definition levels so you can reconstruct optional and repeated fields without assembling full rows. The encoding is deliberately easy to <b>range-scan and aggregate without hydrating objects</b>. Parquet, ORC, and later formats stole this idea; the lecture notes Twitter's work as a descendant. You do not need the bit-packing math in an interview — you need the I/O story: aggregates touch only the columns they name.",
      bullets: [
        "Column scans skip unused fields; that is the 9-cell vs 3-cell example.",
        "Homogeneous columns compress; nested records still round-trip.",
        "RLE of zeros is awkward for random access; Dremel designed around that."
      ]
    }
  ],

  keyTerms: [
    { term: "Interactive analytics", def: "Ad-hoc SQL whose answer should land in tens of seconds (about a minute max), not a multi-hour MapReduce." },
    { term: "Query manager", def: "Front door that rate-limits, load-balances, sizes the tree (threads × machines), and may allow approximate completion." },
    { term: "Serving tree", def: "Root plus intermediate shards plus leaves. Partial aggregates flow up; only relevant key ranges are queried." },
    { term: "Shard / key range", def: "Physical server responsible for a slice of keys; children split that range further." },
    { term: "Colossus / GFS", def: "Google's distributed filesystem. Leaves read local disk first, then the FS." },
    { term: "Prefetch cache", def: "After a query, pull related columns so follow-ups hit ~95% of the time." },
    { term: "Approximate query", def: "Return when a configured fraction of leaves have answered; stragglers are dropped." },
    { term: "Columnar nested storage", def: "Each field in a nested record is its own column, with levels so you can aggregate without rebuilding rows." }
  ],

  tradeoffs: [
    { pro: "SQL for PMs/analysts removes the MapReduce engineer from every question.", con: "You lose arbitrary code-in-the-job flexibility; weird transforms still need a pipeline." },
    { pro: "Serving tree + range prune: only relevant shards work, aggregates assemble on the way up.", con: "A high-selectivity query that hits every range still fans out to the whole warehouse." },
    { pro: "Prefetch cache (~95%) makes the second question cheap.", con: "A sharp topic change misses and walks to GFS; cache is a bet on locality of thought." },
    { pro: "Approximate early return cuts tail latency from dead or slow leaves.", con: "You must accept a bounded error — fine for ads, wrong for exact billing." },
    { pro: "Columnar nested files: tiny I/O for AVG(age) and great compression.", con: "Point lookups of whole records and highly sparse nested paths are clumsier than a row store." }
  ],

  interviewTips: [
    "Open with the PM loop: MapReduce in days vs SQL in a minute, then name the serving tree.",
    "Draw root → mid shards → leaves → GFS, and show a key-range prune (skip the k>500 child).",
    "Say compute is a thread budget the query manager sets — latency vs cost, not a fixed cluster.",
    "Offer approximate aggregation as an explicit SLA knob when the interviewer wants p99 down.",
    "Explain columnar as 'AVG(age) reads ages only', then mention nested records / Parquet lineage.",
    "BigQuery is the public descendant; Dremel is the 2008 paper and 2020 Test of Time award."
  ],

  scene: {
    nodes: [
      { id: "zmid", label: "Agg shards", type: "zone", pos: [0, 0, 2], size: [14, 3.5], showAt: 3 },
      { id: "zleaf", label: "Leaf shards", type: "zone", pos: [0, 0, 5], size: [20, 3.5], showAt: 3 },

      { id: "pm", label: "PM / SQL UI", type: "user", pos: [0, 0, -7] },
      { id: "qm", label: "Query manager", type: "gateway", pos: [0, 0, -4], showAt: 1 },
      { id: "root", label: "Root", type: "lb", pos: [0, 0, -1], showAt: 2 },
      { id: "cache", label: "Prefetch cache", type: "cache", pos: [8, 0, -1], showAt: 6 },

      { id: "s1", label: "k1–k500", type: "server", pos: [-5, 0, 2], showAt: 3 },
      { id: "s2", label: "k>500", type: "server", pos: [5, 0, 2], showAt: 3 },

      { id: "l1", label: "Leaf L1", type: "worker", pos: [-8, 0, 5], showAt: 3 },
      { id: "l2", label: "Leaf L2", type: "worker", pos: [-3, 0, 5], showAt: 3 },
      { id: "l3", label: "Leaf L3", type: "worker", pos: [3, 0, 5], showAt: 3 },
      { id: "l4", label: "Leaf L4", type: "worker", pos: [8, 0, 5], showAt: 3 },

      { id: "gfs", label: "GFS / Colossus", type: "storage", pos: [0, 0, 8], showAt: 5 },

      { id: "n0", label: "MapReduce: 1–3 days", type: "note", pos: [-11, 4, -4] },
      { id: "n1", label: "SQL in about a minute", type: "note", pos: [11, 4, -4], showAt: 1 },
      { id: "n2", label: "Threads = query compute", type: "note", pos: [-11, 4, 2], showAt: 2 },
      { id: "n3", label: "Skip unused key ranges", type: "note", pos: [11, 4, 2], showAt: 4 },
      { id: "n4", label: "Borg + Jupiter + GFS", type: "note", pos: [-11, 4, 7], showAt: 5 },
      { id: "n5", label: "Prefetch ~95% hits", type: "note", pos: [11, 4, 7], showAt: 6 },
      { id: "n6", label: "Return at ~98% leaves", type: "note", pos: [-11, 4, -7], showAt: 7 },
      { id: "n7", label: "Columns, not rows", type: "note", pos: [8, 4, 8], showAt: 8 }
    ],
    edges: [
      { from: "pm", to: "qm", label: "SQL", showAt: 2 },
      { from: "qm", to: "root", showAt: 2 },
      { from: "root", to: "cache", showAt: 6, dashed: true },
      { from: "root", to: "s1", showAt: 3 },
      { from: "root", to: "s2", showAt: 3 },
      { from: "s1", to: "l1", showAt: 3 },
      { from: "s1", to: "l2", showAt: 3 },
      { from: "s2", to: "l3", showAt: 3 },
      { from: "s2", to: "l4", showAt: 3 },
      { from: "l1", to: "gfs", showAt: 5, dashed: true },
      { from: "l2", to: "gfs", showAt: 5, dashed: true },
      { from: "l3", to: "gfs", showAt: 5, dashed: true },
      { from: "l4", to: "gfs", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Petabytes, jobs, days",
        text: "A PM wants the fraction of long-drive riders who stop at restaurants. In 2008 that meant a MapReduce job an engineer writes and reruns. Each follow-up question is another job. Insight arrives in a day or three, not in a meeting.",
        highlight: ["pm", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6", "n7"]
      },
      {
        title: "SQL for the people who ask",
        text: "Dremel gives PMs and analysts a SQL box and an interactive SLA: answers in tens of seconds, about a minute worst case. Engineers leave the loop. Queries are counts and percentages, not full row dumps.",
        highlight: ["pm", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "pm", to: "qm", color: "#4ade80", label: "SELECT" }
        ]
      },
      {
        title: "Query manager sizes the job",
        text: "The query manager rate-limits and load-balances. Compute is machines times threads. More threads, faster wall clock; fewer threads, cheaper. It then hands the query to the root of a serving tree.",
        highlight: ["qm", "root", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "pm", to: "qm", color: "#4ade80", label: "SQL" },
          { from: "qm", to: "root", color: "#fb923c", label: "plan" }
        ]
      },
      {
        title: "Fan-out down the tree",
        text: "The root fans the query to mid shards that own key ranges, and those recurse to leaves. Partial aggregates flow back up, like a segment tree. Shards are real Borg machines, not virtual labels.",
        highlight: ["root", "s1", "s2", "l1", "l2", "l3", "l4", "zmid", "zleaf"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "root", to: "s1", color: "#fb923c", label: "scatter" },
          { from: "root", to: "s2", color: "#fb923c", label: "scatter" },
          { from: "s1", to: "l1", color: "#fb923c", label: "k" },
          { from: "s2", to: "l4", color: "#fb923c", label: "k" }
        ]
      },
      {
        title: "Prune ranges you do not need",
        text: "Need key 100, which lives under k1–k500? Do not query the k>500 child. The same prune repeats at every level. Less work, less tail, same answer.",
        highlight: ["s1", "l1", "l2", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "root", to: "s1", color: "#4ade80", label: "k=100" },
          { from: "s1", to: "l2", color: "#4ade80", label: "hit" }
        ]
      },
      {
        title: "Leaves, GFS, Borg",
        text: "A leaf reads local disk, or misses to GFS / Colossus. Jupiter carries the bytes; Borg scheduled the machines. Cold data still participates in interactive SQL because the tree can fetch it.",
        highlight: ["l1", "l2", "l3", "l4", "gfs", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6", "n7"],
        flows: [
          { from: "l2", to: "gfs", color: "#c084fc", label: "miss" },
          { from: "gfs", to: "l2", color: "#60a5fa", label: "block" }
        ]
      },
      {
        title: "Prefetch the next question",
        text: "A long-drive restaurant query warms columns about long drives and restaurants. The next PM question usually hits that neighborhood. About 95% of follow-ups never walk to a leaf or to GFS.",
        highlight: ["cache", "root", "qm", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6", "n7"],
        flows: [
          { from: "root", to: "cache", color: "#c084fc", label: "prefetch" },
          { from: "qm", to: "cache", color: "#60a5fa", label: "hit" }
        ]
      },
      {
        title: "Return before every leaf",
        text: "If ±2% is acceptable, the root answers when ~90–98% of leaves have reported. A hung L3 or slow L4 no longer owns the PM's minute. Top-k YouTube is the same: skip the straggler tail.",
        highlight: ["root", "l3", "l4", "n6"],
        fail: ["l3"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n7"],
        flows: [
          { from: "l1", to: "s1", color: "#4ade80", label: "partial" },
          { from: "l2", to: "s1", color: "#4ade80", label: "partial" },
          { from: "s1", to: "root", color: "#4ade80", label: "98%" }
        ]
      },
      {
        title: "Scan columns, not rows",
        text: "Name, country, and age live in separate columns. AVG(age) reads three numbers, not nine cells. Nested records (trip → users → interests) are shredded into columns with a Huffman-like encoding so aggregates never hydrate full objects.",
        highlight: ["l1", "l2", "gfs", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "gfs", to: "l1", color: "#60a5fa", label: "age col" },
          { from: "l1", to: "s1", color: "#4ade80", label: "AVG" },
          { from: "s1", to: "root", color: "#4ade80", label: "agg" },
          { from: "root", to: "pm", color: "#60a5fa", label: "56%" }
        ]
      }
    ]
  }
});
