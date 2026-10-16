window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 8,
  title: "Google Dapper",
  video: "https://www.youtube.com/watch?v=AZhIjNHzURQ",
  category: "Paper Walkthroughs",
  tagline: "One sampled trace id across every RPC — cheap enough that every service actually turns it on.",
  summary: "Dapper is Google's 2010 request tracer. A search query may touch thousands of stores; engineers need the path, the fan-out, and the time, without slowing production. Tracing is hooked into the shared RPC client so adoption is automatic. Spans form a tree under one 64-bit trace id, land in local logs, and collectors write Bigtable within about 15 seconds. Production samples 1 in 1024 requests so the overhead disappears into the noise; quieter services raise the rate until they have enough examples.",

  theory: [
    {
      heading: "Follow one query through a thousand stores",
      body: "Type a phrase into Google Search and the front end fans out across indexers, doc stores, ads, and rankers. The page looks simple; the RPC graph is not. Dapper is the system that records <b>which services ran, in what order, and how long each hop took</b> so an engineer can see whether the slowdown is \"my code\" or \"that dependency.\" The 2010 paper is the infrastructure behind that picture, not a dashboard skin."
    },
    {
      heading: "If it hurts production, nobody turns it on",
      body: "The hard requirements are political as much as technical. Tracing must add <b>near-zero latency</b> or service owners will disable it. It must be <b>easy to onboard</b> — no per-team agent science project. It must be <b>universal</b>: if one hop is untraced, you cannot tell whether the RPC or the caller is at fault. It must stay <b>up</b> while you debug an outage, and traces must be <b>fresh</b> (the lecture's bar: less than a minute old). Volume is about <b>1 TB of traces per day</b>; people look back about <b>two weeks</b>, not forever.",
      bullets: [
        "Low overhead is an adoption feature, not a micro-optimization.",
        "Universality beats a perfect tracer used by one team.",
        "Retention is a product decision: two weeks of traces, not a warehouse of every byte."
      ]
    },
    {
      heading: "Put Dapper inside the RPC stub",
      body: "The Memcache paper's lesson returns: ship a <b>client library</b>. Google already had a generic RPC stack. Dapper rides inside it, so every new call is traced without a second import. That is how \"universal\" actually happens in a company with thousands of binaries. The rest of the design is how to store those records without becoming the outage."
    },
    {
      heading: "Spans, parents, one trace id",
      body: "The unit is a <b>span</b>: the timeline of one RPC, holding an array of events (timestamp, service name, a short annotation such as \"RPC start\" / \"RPC stop\"). Each span has an id and a <b>parent span id</b>. A login might be span 1; domain-allowed is span 2 parented at 1; profile-exists is span 3 parented at 1; blacklist and password checks are children of 3. Every span in that tree shares one <b>trace id</b>. Query Dapper by that id and you reconstruct the whole fan-out — or you zoom into one service. The tree is the request; the id is the join key.",
      bullets: [
        "Span = one RPC's events, not the whole request.",
        "Parent pointers build the tree; the trace id gathers the rows.",
        "Annotations stay small: start, stop, maybe an error string."
      ]
    },
    {
      heading: "Local files, a daemon, collectors, Bigtable",
      body: "Application threads append to <b>local log files</b> (not a remote write on the request path). A Dapper <b>daemon</b> buffers those lines. <b>Collectors</b> pull, assemble spans, and persist them in <b>Bigtable</b> (then on GFS, later Colossus) — the sparse, versioned store Google already trusted for search documents. Hundreds of thousands of machines, many processes each, all feed the same pipeline. Bigtable is indexed by <b>trace id</b>, so \"show me this search\" is a keyed read of every span in the tree. Typical ingest is about <b>15 seconds</b>; a get-trace is usually under a <b>minute</b>, sometimes as slow as two hours, which the lecture still calls acceptable for this job. Batching cuts I/O; the next trick cuts volume.",
      bullets: [
        "The request path never waits on Bigtable.",
        "Collectors convert log lines into span objects.",
        "Bigtable's job is availability and scale at 1 TB/day, not fancy query planning."
      ]
    },
    {
      heading: "Sample 1/1024; adapt when traffic is thin",
      body: "The bulk of tracing cost is I/O. Google <b>samples</b>: in production, keep <b>1 in 1024</b> requests. At Search volume the sample still has every kind of failure; latency experiments could not even measure a slowdown (the error bar looked like a speedup). Trace ids are 64-bit; keep those with id ≤ 2<sup>64</sup>/1024 ≈ 2<sup>54</sup> so an entire tree is in or out together. Quiet services use <b>adaptive sampling</b> (\"give me ~10 traces/s\") so Interview Ready-scale binaries still have something to look at. High-QPS services almost never need that knob. Downstream systems such as <b>Monarch</b> consume the same traces to debug bad requests — Dapper is plumbing for the rest of Google's observability, not a silo.",
      bullets: [
        "Sampling is how tracing stays cheaper than the service it watches.",
        "The coin flip is on the trace id, so children cannot disagree with the parent.",
        "Reuse Bigtable and the RPC client; do not invent a third runtime."
      ]
    }
  ],

  keyTerms: [
    { term: "Span", def: "One RPC's timeline: span id, parent id, and a list of timestamped events." },
    { term: "Trace id", def: "A 64-bit id shared by every span in one end-user request; the Bigtable lookup key." },
    { term: "Annotation", def: "A short event label inside a span (RPC started, RPC stopped, and similar)." },
    { term: "Collector", def: "Service that pulls buffered logs from daemons and writes assembled spans to Bigtable." },
    { term: "Out-of-band logs", def: "Processes write local files; tracing I/O is not on the user RPC's critical path." },
    { term: "Sampling", def: "Record a fraction of requests (production 1/1024) so overhead is lost in the noise." },
    { term: "Adaptive sampling", def: "Target a traces-per-second floor on quiet services instead of a fixed 1/1024." }
  ],

  tradeoffs: [
    { pro: "Hooked into the company RPC client: tracing is on by default.", con: "Services that bypass that stub are invisible; universality is a social contract." },
    { pro: "Local logs + daemon + Bigtable: user RPCs do not wait on the tracer.", con: "Freshness is tens of seconds, not microseconds; worst-case query can be hours." },
    { pro: "1/1024 sampling: measured overhead ~0 at Search scale.", con: "Rare one-off bugs can miss the sample; you debug with a representative set." },
    { pro: "Adaptive rate for low-QPS binaries still yields enough examples.", con: "You now have two sampling stories to explain and to misconfigure." },
    { pro: "Two-week retention and a trace-id index match how SREs actually search.", con: "You cannot reconstruct a request from last quarter." }
  ],

  interviewTips: [
    "Start from a search box hitting thousands of stores — Dapper is the map of that fan-out.",
    "Name the adoption constraints first: low overhead, universal, fresh, always-on.",
    "Put tracing in the RPC library; do not ask each team to call a side API.",
    "Draw spans with parent ids and one shared trace id; that is the data model.",
    "Pipeline: local log → daemon → collector → Bigtable, ~15s ingest, query by trace id.",
    "Quote 1/1024 production sampling and adaptive sampling for quiet services."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Searcher", type: "user", pos: [-11, 0, 0] },
      { id: "fe", label: "Front end", type: "server", pos: [-7, 0, 0] },
      { id: "idx", label: "Index store", type: "db", pos: [-7, 0, -5] },
      { id: "docs", label: "Doc store", type: "db", pos: [-7, 0, 5] },
      { id: "rpc", label: "RPC stub", type: "gateway", pos: [-2.5, 0, 0], showAt: 2 },
      { id: "root", label: "Login span", type: "service", pos: [2, 0, 0], showAt: 3 },
      { id: "dom", label: "Domain check", type: "service", pos: [2, 0, -5], showAt: 3 },
      { id: "prof", label: "Profile check", type: "service", pos: [2, 0, 5], showAt: 3 },
      { id: "bl", label: "Blacklist", type: "worker", pos: [6.5, 0, 2.5], showAt: 3 },
      { id: "auth", label: "Auth", type: "worker", pos: [6.5, 0, 6.5], showAt: 3 },
      { id: "logs", label: "Local logs", type: "storage", pos: [11, 0, -6], showAt: 5 },
      { id: "daemon", label: "Daemon", type: "worker", pos: [11, 0, -2], showAt: 5 },
      { id: "coll", label: "Collector", type: "server", pos: [11, 0, 2], showAt: 5 },
      { id: "bt", label: "Bigtable", type: "db", pos: [11, 0, 6], showAt: 5 },
      { id: "sre", label: "SRE", type: "user", pos: [-11, 0, 7.5], showAt: 6 },
      { id: "n0", label: "Thousands of stores", type: "note", pos: [-11, 0, -5] },
      { id: "n1", label: "Must not slow Search", type: "note", pos: [-11, 0, 4], showAt: 1 },
      { id: "n2", label: "Trace inside RPC", type: "note", pos: [-2.5, 0, 4], showAt: 2 },
      { id: "n3", label: "Parent pointers", type: "note", pos: [2, 0, -7.5], showAt: 3 },
      { id: "n4", label: "One trace id = 1", type: "note", pos: [6.5, 0, -2], showAt: 4 },
      { id: "n5", label: "Off the request path", type: "note", pos: [6.5, 0, -6], showAt: 5 },
      { id: "n6", label: "~15s to Bigtable", type: "note", pos: [-7, 0, 7.5], showAt: 6 },
      { id: "n7", label: "Keep 1 / 1024", type: "note", pos: [-2.5, 0, -5], showAt: 7 }
    ],
    edges: [
      { from: "user", to: "fe", label: "query" },
      { from: "fe", to: "idx" },
      { from: "fe", to: "docs" },
      { from: "fe", to: "rpc", showAt: 2 },
      { from: "rpc", to: "root", showAt: 3 },
      { from: "root", to: "dom", label: "parent=1", showAt: 3 },
      { from: "root", to: "prof", label: "parent=1", showAt: 3 },
      { from: "prof", to: "bl", showAt: 3 },
      { from: "prof", to: "auth", showAt: 3 },
      { from: "rpc", to: "logs", showAt: 5, dashed: true },
      { from: "logs", to: "daemon", showAt: 5 },
      { from: "daemon", to: "coll", showAt: 5 },
      { from: "coll", to: "bt", showAt: 5 },
      { from: "sre", to: "bt", label: "trace id", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "One search, a thousand stores",
        text: "A query string hits Google's front end, which fans out to indexers, document stores, and more. Dapper exists to recover that path: who was called, in what order, and how long each hop took.",
        highlight: ["user", "fe", "idx", "docs", "n0"],
        flows: [
          { from: "user", to: "fe", color: "#4ade80", label: "search" },
          { from: "fe", to: "idx", color: "#60a5fa", label: "RPC" },
          { from: "fe", to: "docs", color: "#60a5fa", label: "RPC" }
        ]
      },
      {
        title: "Cheap, universal, still fresh",
        text: "If tracing slows Search, owners disable it. Every service must emit spans or the graph has holes. Traces should appear in about a minute. Volume is ~1 TB/day; SREs keep about two weeks.",
        highlight: ["fe", "idx", "docs", "n1"],
        hide: ["n0"],
        flows: [
          { from: "fe", to: "idx", color: "#fb923c", label: "too slow?" }
        ]
      },
      {
        title: "Ride the company RPC client",
        text: "Google already had a generic stub for remote calls. Dapper is compiled into that stub, so a new binary is traced without a second library. Universality is a default, not a wiki page.",
        highlight: ["rpc", "fe", "n2"],
        hide: ["n1"],
        flows: [
          { from: "fe", to: "rpc", color: "#c084fc", label: "every RPC" }
        ]
      },
      {
        title: "A span tree for login",
        text: "Span 1 is the login. Domain-allowed is span 2 with parent 1. Profile-exists is span 3 with parent 1. Blacklist and password checks are children of 3. Each span is a list of timestamped events: RPC start, RPC stop.",
        highlight: ["root", "dom", "prof", "bl", "auth", "n3"],
        hide: ["n2", "n4"],
        flows: [
          { from: "rpc", to: "root", color: "#4ade80", label: "span 1" },
          { from: "root", to: "dom", color: "#60a5fa", label: "span 2" },
          { from: "root", to: "prof", color: "#60a5fa", label: "span 3" },
          { from: "prof", to: "bl", color: "#c084fc", label: "child" },
          { from: "prof", to: "auth", color: "#c084fc", label: "child" }
        ]
      },
      {
        title: "One trace id joins the tree",
        text: "Every span in that login carries trace id 1. Ask Dapper for that id and you get the whole fan-out, or you zoom into profile-check. The trace id is the join key; parent ids are the tree shape.",
        highlight: ["root", "dom", "prof", "bl", "auth", "n4"],
        hide: ["n3", "n5"],
        flows: [
          { from: "root", to: "dom", color: "#c084fc", label: "id=1" },
          { from: "root", to: "prof", color: "#c084fc", label: "id=1" }
        ]
      },
      {
        title: "Logs, daemon, collectors, Bigtable",
        text: "Processes append local files. A daemon buffers. Collectors pull, build span objects, and write Bigtable (GFS/Colossus), indexed by trace id. The user RPC never waits on that write.",
        highlight: ["logs", "daemon", "coll", "bt", "n5"],
        hide: ["n4", "n6"],
        flows: [
          { from: "rpc", to: "logs", color: "#fb923c", label: "append" },
          { from: "logs", to: "daemon", color: "#fb923c", label: "buffer" },
          { from: "daemon", to: "coll", color: "#60a5fa", label: "pull" },
          { from: "coll", to: "bt", color: "#4ade80", label: "spans" }
        ]
      },
      {
        title: "Query by trace id in about a minute",
        text: "An SRE looks up the id of a \"large language models\" search. Bigtable returns every span. Typical ingest is ~15s; most gets finish within a minute. Two hours is the ugly tail, still usable for this job.",
        highlight: ["sre", "bt", "root", "n6"],
        hide: ["n5", "n7"],
        flows: [
          { from: "sre", to: "bt", color: "#60a5fa", label: "get trace" },
          { from: "bt", to: "sre", color: "#4ade80", label: "span tree" }
        ]
      },
      {
        title: "Sample 1 in 1024",
        text: "Keep a request only if its 64-bit trace id is in the lower 1/1024 of the space, so the whole tree is kept or dropped together. At Search QPS the sample still shows failures and the latency hit is ~0. Quiet services ask for ~10 traces/s instead.",
        highlight: ["rpc", "fe", "n7"],
        hide: ["n6", "n2"],
        flows: [
          { from: "fe", to: "rpc", color: "#4ade80", label: "1 kept" },
          { from: "fe", to: "idx", color: "#64748b", label: "1023 dropped" }
        ]
      }
    ]
  }
});
