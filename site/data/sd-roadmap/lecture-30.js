window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 30,
  title: "Multi-Region Active-Active and OLAP Data Pipelines",
  video: "",
  category: "Advanced Systems",
  tagline: "Two regions that both take writes need a conflict story. Analytics needs a pipeline, not SELECT on the primary.",
  summary: "Active-active means more than a replica in another continent: both regions accept writes, DNS or anycast sends users to the nearest healthy one, and data syncs in both directions. Conflicts are real. Active-passive is easier and slower to fail over. OLTP (the Spring orders DB) is the system of record. OLAP (warehouse, lakehouse) is a derived copy fed by CDC and batch jobs. Mixing dashboards onto the primary is how you miss p99 and still get a wrong weekly number.",

  theory: [
    {
      heading: "Active-passive versus active-active",
      body: "<b>Active-passive</b>: region A takes all writes; region B replicates (async or sync) and serves reads or waits. Failover is a DNS cut plus promoting B. RPO is the lag; RTO is the cut time. <b>Active-active</b>: both take writes. Users in Mumbai should not round-trip Virginia for checkout. You now have two writers, replication delay, and the split-brain family of bugs from the consensus lecture, at geographic RTT. Session stickiness, generated IDs (Snowflake, still unique across regions), and a conflict rule are mandatory. A global load balancer (latency-based or health-based DNS) is the front door. Spring apps stay stateless; the database topology is the hard part.",
      bullets: [
        "Multi-AZ in one region is not multi-region. Say the words separately.",
        "Failover tests that never run are fiction. Rehearse the DNS TTL and the promotion.",
        "Sticky by region if your data is sharded by user home region — a milder active-active."
      ]
    },
    {
      heading: "Conflict is the tax on two writers",
      body: "User updates a profile in EU and US before either replica arrives. Last-write-wins (timestamp, or a version vector) drops one edit. Merge (CRDT, field-level, or \"union of sets\") keeps both when the datatype allows. Money and inventory usually cannot be LWW: they need a home region, a lease, or an invariant that one region owns that row. Idempotent commands with a global id help. Spring: include a row version and fail a stale PUT with 409 so the client retries after refresh. Do not hide a silent LWW on an account balance.",
      bullets: [
        "Home-region pinning is underrated active-active: writes go home, reads can be local.",
        "Clocks lie across regions. Prefer version vectors or replica ids over wall clocks.",
        "If you cannot name the conflict rule, you are not active-active yet."
      ]
    },
    {
      heading: "OLTP is not a warehouse",
      body: "<b>OLTP</b> (online transaction processing) is the orders database: normalized, indexed for point lookups, sized for p99. <b>OLAP</b> (online analytical processing) is scans, joins, and yesterday's truth: a warehouse (BigQuery, Snowflake, Redshift) or a lakehouse. Running \"revenue by SKU this quarter\" on primary Postgres takes locks or IO that checkout needs. The pipeline copies committed facts out. Freshness is an SLO (seconds vs hours), not an accident of a 2 a.m. dump. Analysts must not get a login to prod.",
      bullets: [
        "Columnar storage and scan-friendly formats (Parquet) belong in OLAP, not in the Spring DB.",
        "A read replica is still OLTP-shaped. It is not a warehouse.",
        "GDPR deletes must flow through the pipeline, or the lake keeps the ghost."
      ]
    },
    {
      heading: "CDC and the OLAP path",
      body: "<b>Change data capture</b> reads the primary's WAL (Debezium, native logical replication) and emits row events. A stream job (Flink, Spark, even a Spring consumer for small scale) lands them in the warehouse, partitioned by date. Batch ETL (nightly dump) is simpler and higher lag. The transactional outbox is for business events; CDC is for \"every table the analysts need\" without asking every team to emit. Schema changes: expand/contract in OLTP, then evolve the warehouse model. Exactly-once into the warehouse is idempotent upserts on primary key plus version, not a prayer.",
      bullets: [
        "Do not CDC a table you would be ashamed to store for seven years.",
        "Late data and corrections need a merge key. Append-only logs plus a view.",
        "Backfill is a first-class job: new table, historical load, then tail the log."
      ]
    },
    {
      heading: "One picture for both problems",
      body: "Users hit a global LB. EU and US each have a full Spring stack and a local OLTP store. Replication carries writes. A CDC connector in each region (or on a designated primary if you chose home-region writes) feeds a single warehouse region or a dual-ingest lake. Dashboards never touch the OLTP primary. When a region dies, DNS shifts traffic; the warehouse may lag but checkout lives. When analysts want a new column, they wait for the pipeline, they do not add a join to the API pod. That separation is the advanced-systems answer: availability topology and analytics topology, drawn as two graphs that meet only at CDC.",
      bullets: [
        "Warehouse outage must not page the checkout on-call.",
        "Cross-region replication lag is an SLO with a dashboard.",
        "Active-active checkout plus a single-region warehouse is a valid, honest design."
      ]
    }
  ],

  keyTerms: [
    { term: "Active-active", def: "More than one region accepts writes at the same time, with a stated conflict rule." },
    { term: "Active-passive", def: "One writer region; a standby is promoted on failure." },
    { term: "Home region", def: "The region that owns writes for a given user or row, even if reads are local." },
    { term: "LWW", def: "Last-write-wins conflict resolution. Dangerous for counters and balances." },
    { term: "OLTP", def: "The transactional system of record, optimized for point reads and writes." },
    { term: "OLAP", def: "Analytical copies optimized for scans, aggregates, and historical queries." },
    { term: "CDC", def: "Change data capture: turn WAL/binlog into a stream of row changes." },
    { term: "Warehouse", def: "The OLAP store analysts query (Snowflake, BigQuery, Redshift, a lakehouse)." }
  ],

  tradeoffs: [
    { pro: "Active-active keeps local latency on writes when it works.", con: "You must resolve conflicts and live with replication lag as a product fact." },
    { pro: "Active-passive is operationally smaller.", con: "Failover RTO includes DNS and a promotion you must rehearse." },
    { pro: "CDC gives near-live analytics without dual writes in every service.", con: "You operate connectors, schema evolution, and a backfill story." },
    { pro: "A warehouse protects OLTP p99 from dashboards.", con: "Freshness lag means 'right now' in a chart is a lie you must label." }
  ],

  interviewTips: [
    "Ask whether writes are truly multi-region or home-region pinned. Most products only need the latter.",
    "Name a conflict rule. LWW on money is a red flag; say so.",
    "Draw OLTP and OLAP as two systems joined by CDC, not as a replica used for BI.",
    "Give RPO/RTO for region loss separately from warehouse lag.",
    "In Spring, keep the app stateless, use globally unique ids, and 409 on stale versions."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Nearest user", type: "user", pos: [-11, 0, 0] },
      { id: "glb", label: "Global LB", type: "lb", pos: [-6.5, 0, 0] },
      { id: "eu", label: "Region EU", type: "zone", pos: [-1, 0, -3.5], size: [7, 6], showAt: 1 },
      { id: "us", label: "Region US", type: "zone", pos: [-1, 0, 3.8], size: [7, 6], showAt: 1 },
      { id: "eua", label: "EU Spring", type: "service", pos: [-2.5, 0, -4.5], showAt: 1 },
      { id: "eud", label: "EU OLTP", type: "db", pos: [0.8, 0, -2.4], showAt: 1 },
      { id: "usa", label: "US Spring", type: "service", pos: [-2.5, 0, 2.8], showAt: 1 },
      { id: "usd", label: "US OLTP", type: "db", pos: [0.8, 0, 4.8], showAt: 1 },
      { id: "cdc", label: "CDC Debezium", type: "worker", pos: [5.5, 0, 0], showAt: 5 },
      { id: "wh", label: "Warehouse", type: "storage", pos: [10, 0, 0], showAt: 6 },
      { id: "bi", label: "Analyst", type: "user", pos: [10, 0, 4.5], showAt: 6 },
      { id: "n0", label: "Latency-based DNS", type: "note", pos: [-6.5, 0, -6.5] },
      { id: "n1", label: "Conflict rule required", type: "note", pos: [-1, 0, 7.5], showAt: 3 },
      { id: "n2", label: "Dashboards never hit OLTP", type: "note", pos: [10, 0, -6.5], showAt: 6 }
    ],
    edges: [
      { from: "user", to: "glb" },
      { from: "glb", to: "eua", showAt: 1 },
      { from: "glb", to: "usa", showAt: 1 },
      { from: "eua", to: "eud", showAt: 1 },
      { from: "usa", to: "usd", showAt: 1 },
      { from: "eud", to: "usd", label: "replicate", showAt: 2, dashed: true },
      { from: "usd", to: "eud", showAt: 2, dashed: true },
      { from: "eud", to: "cdc", showAt: 5 },
      { from: "usd", to: "cdc", showAt: 5 },
      { from: "cdc", to: "wh", showAt: 6 },
      { from: "bi", to: "wh", showAt: 6 }
    ],
    steps: [
      {
        title: "Steer to a healthy region",
        text: "A global load balancer sends the user to the nearest region that is up. DNS TTL and health checks are part of RTO. The Spring apps are stateless.",
        highlight: ["user", "glb", "n0"],
        flows: [{ from: "user", to: "glb", color: "#4ade80", label: "HTTPS" }]
      },
      {
        title: "Two full stacks",
        text: "EU and US each have the API and a local OLTP store. Multi-AZ inside a region is assumed. This drawing is the region layer, not the zone layer.",
        highlight: ["eu", "us", "eua", "usa", "eud", "usd", "glb"],
        flows: [
          { from: "glb", to: "eua", color: "#4ade80", label: "EU user" },
          { from: "eua", to: "eud", color: "#c084fc", label: "write" }
        ]
      },
      {
        title: "Replication both ways",
        text: "Writes in EU stream to US and back. Lag is an SLO. Active-passive would have a single arrow and a promotion runbook instead.",
        highlight: ["eud", "usd"],
        flows: [
          { from: "eud", to: "usd", color: "#c084fc", label: "WAL" },
          { from: "usd", to: "eud", color: "#c084fc", label: "WAL" }
        ]
      },
      {
        title: "Concurrent edits collide",
        text: "The same profile is patched in both regions before sync. You need a rule: home-region owner, version 409, or a merge. Last-write-wins on a balance is how money disappears.",
        highlight: ["eud", "usd", "n1", "eua", "usa"],
        fail: ["usd"],
        flows: [
          { from: "eua", to: "eud", color: "#f87171", label: "patch" },
          { from: "usa", to: "usd", color: "#f87171", label: "patch" }
        ]
      },
      {
        title: "Region loss, traffic shifts",
        text: "US goes dark. The global LB sends everyone to EU. RPO is unreplicated US writes. RTO is DNS and connection drain. Warehouse freshness is a separate worry.",
        highlight: ["glb", "usa", "usd", "eua"],
        fail: ["usa", "usd"],
        flows: [{ from: "glb", to: "eua", color: "#4ade80", label: "failover" }]
      },
      {
        title: "CDC reads the log, not the API",
        text: "Debezium (or equivalent) tails OLTP WAL in the surviving region. Application code does not dual-write to a warehouse. Schema changes still follow expand/contract.",
        highlight: ["eud", "cdc", "usd"],
        flows: [{ from: "eud", to: "cdc", color: "#fb923c", label: "row events" }]
      },
      {
        title: "OLAP is a derived copy",
        text: "The warehouse upserts on primary key. Analysts query yesterday and last quarter here. Columnar scans do not touch checkout p99. Freshness is labeled on the dashboard.",
        highlight: ["cdc", "wh", "bi", "n2"],
        flows: [
          { from: "cdc", to: "wh", color: "#60a5fa", label: "upsert" },
          { from: "bi", to: "wh", color: "#60a5fa", label: "SQL" }
        ]
      },
      {
        title: "Two graphs, one join",
        text: "Availability is the dual-region picture. Analytics is the CDC picture. They meet at the log. A warehouse outage does not page checkout. A region outage does not wait on Snowflake.",
        highlight: ["glb", "eu", "us", "cdc", "wh"],
        flows: [
          { from: "glb", to: "eua", color: "#4ade80", label: "OLTP" },
          { from: "cdc", to: "wh", color: "#fb923c", label: "OLAP" }
        ]
      }
    ]
  }
});
