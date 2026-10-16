window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 3,
  title: "Amazon DynamoDB",
  video: "https://www.youtube.com/watch?v=cU01EnyBwQI",
  category: "Paper Walkthroughs",
  tagline: "NoSQL that stays boring: predictable latency, optional ACID, auto-scale.",
  summary: "The 2022 DynamoDB paper is walked as a fully managed key-value service: request routers, MDS metadata cache, Multi-Paxos leaders, B-tree vs log replicas, S3-backed streams, partition/sort keys, local vs global indexes, and token-bucket capacity that bursts without surprising neighbors.",

  theory: [
    {
      heading: "Managed NoSQL that refuses to be flaky",
      body: "DynamoDB (the 2022 VLDB paper, not the 2007 Dynamo one) is AWS's multi-tenant key-value store: a million-plus customers, peak ~80 million requests/second, on the order of 10 trillion a day, petabytes per tenant. Setup is a table plus auto-scale. The lecture's six claims: easy operations, huge scale, <b>NoSQL with ACID transactions</b> (serializable when you ask), <b>eventual or strongly consistent reads</b>, and a cultural bias toward <b>predictable</b> behavior. A page that always takes 5s is annoying; a page that is 10ms then 3s then 100ms is unusable. Variance is the enemy.",
      bullets: [
        "Fully managed: you book capacity, not boxes.",
        "Transactions exist; \"NoSQL\" here does not mean \"no ACID\".",
        "Strong reads are opt-in; eventual is the cheap default."
      ]
    },
    {
      heading: "Request path: router, MDS, primary",
      body: "A client hits a <b>request router</b> in an availability zone. Routing and storage are separate jobs even when they share an AZ. The router first queries <b>MDS</b>, a global metadata cache, for the storage nodes (SSDs) that own the key and which replica is primary. The write goes to that primary, which persists and forwards to the other two replicas. Behind the SSD, a log is streamed to <b>S3</b> for backup, PITR, and <b>DynamoDB Streams</b> (CDC). Indexes that can lag — especially global secondary indexes — are built from that stream.",
      bullets: [
        "Prefer a router in the primary's AZ; cross-AZ is allowed if that misses.",
        "Three replicas per item; leader takes the write.",
        "Streams = ordered change log consumers can tail."
      ]
    },
    {
      heading: "Strong GET vs eventual GET",
      body: "After a put, a strongly consistent get is sent only to the <b>primary</b> — the same place writes land — so you cannot see a tombstone that has not reached a follower (the lecture's \"come alive again\" stale read). An eventually consistent get may go to any replica for load spread and can return old bytes. Leaders are chosen with <b>Multi-Paxos</b>. The leader keeps a <b>B-tree</b> of keys. Followers need not materialize that tree: a log-only replica is enough for durability and cheaper on the write path. Send user reads to replicas that <i>do</i> have a B-tree or you will scan logs.",
      bullets: [
        "Strong read = primary. Eventual read = any copy.",
        "Log replicas buy durability without paying B-tree maintenance on every follower.",
        "Stream replication is TLS-plus-TLA-style formally checked in the paper's telling."
      ]
    },
    {
      heading: "The cache that is not allowed to go cold",
      body: "MDS sits on every request: 99.7% hits, ~1ms vs a ~10ms metadata store miss. If the cache dies and refill starts at 0%, a thousand requests that were 1ms become 10ms. Throughput collapses by ~10×, routers pile up, the fleet looks down. AWS's counter-intuitive fix: <b>even on a hit, periodically query the backing store</b>. Steady extra load means you provision for the miss path <i>now</i>, not after a crash. Hit-rate-driven autoscaling would shrink you to one node, then a flush would need twenty nodes you cannot boot in time. Caches normally amplify variance; DynamoDB spends money to make MDS boring.",
      bullets: [
        "A cold metadata cache is a latency cliff, not a mild miss.",
        "Constant background refresh keeps utilization honest for autoscaling.",
        "Predictable waste beats a surprising thundering herd."
      ]
    },
    {
      heading: "Partition key, sort key, single-table design",
      body: "A table's <b>partition key</b> is hashed to a shard (a hashmap of items). An optional <b>sort key</b> orders items inside the partition so range queries and binary search work. Together they are the primary key. Example: Reddit-style posts with post id as partition and timestamp as sort — last-seven-days is a sort-key range, possibly across partitions, then merge. If India always hashes to a prefix, you can also query one partition. Composite keys (user id + post id) encode a second access path in the same table. The modeling religion: denormalize, duplicate, <b>do not join</b>. One table should cover the app's patterns.",
      bullets: [
        "Partition key = which node. Sort key = order inside the node.",
        "Access patterns drive keys; you do not get SQL WHERE for free.",
        "Duplicate items across shapes instead of joining tables."
      ]
    },
    {
      heading: "Local vs global secondary indexes",
      body: "A <b>local secondary index</b> keeps the same partition key and adds another sort (likes instead of time) stored in the same partition — strongly consistent, up to 20 per table. A <b>global secondary index</b> uses a different partition key (comments-for-a-post vs user+post) and is a full extra copy of the table, filled from the change stream, <b>eventually consistent</b>, capped at four. That cap exists because each GSI is another table you pay to write.",
      bullets: [
        "LSI: same partition, extra order, strongly consistent, local.",
        "GSI: new partition key, streamed copy, eventual, expensive.",
        "Most \"relational\" questions become another key shape, not a JOIN."
      ]
    },
    {
      heading: "RCU, WCU, and a five-minute burst bucket",
      body: "You buy <b>read/write capacity units</b> (the lecture's sketch: a read of a ~4 KB item per second is one RCU; a 1 KB write per second is one WCU). Nodes have a large pool (thousands of units) shared across tenants. Exceed your booking and <b>you</b> are throttled, not your neighbors. Lunch-peak apps (Zomato) hate paying for 500 all day to survive four busy hours. Unused tokens fill a <b>token bucket with ~five minutes of burst</b> (200 RCU × 300s = 60k tokens). Dinner can spend the savings until the bucket is empty. Burst is accounted <b>across the three replicas</b>: 200 on one and 50+50 on the others is fine if the global spend stays inside the booking. Fairness is a placement problem: AWS must pack tenants so everyone can burst without sinking a node.",
      bullets: [
        "Pay for reserved units; throttle the over-consumer, not the noisy neighbor's victims.",
        "Burst recovers unused capacity so customers do not feel cheated at the peak.",
        "Local replica imbalance is allowed; the global budget is not."
      ]
    }
  ],

  keyTerms: [
    { term: "Request router", def: "AZ-local front end that looks up metadata and forwards to the primary or a replica." },
    { term: "MDS", def: "Distributed metadata cache mapping keys to storage nodes and the current leader. ~99.7% hit rate." },
    { term: "Multi-Paxos leader", def: "Elected primary that takes writes and holds the materialized B-tree." },
    { term: "Partition key / sort key", def: "Hash for placement plus optional order inside the partition; together they uniquely identify an item." },
    { term: "LSI", def: "Local secondary index: same partition key, different sort, strongly consistent, stored with the item." },
    { term: "GSI", def: "Global secondary index: different partition key, extra table filled from streams, eventually consistent." },
    { term: "RCU / WCU", def: "Reserved read/write throughput units. Going over your booking throttles you." },
    { term: "Token bucket burst", def: "Unused capacity saved (~five minutes) so a predictable peak can exceed the steady booking." },
    { term: "DynamoDB Streams", def: "Ordered change log to S3/consumers, used for CDC, GSI catch-up, and backups." }
  ],

  tradeoffs: [
    { pro: "Strong or eventual reads, plus optional serializable transactions, cover more apps than classic Dynamo.", con: "Strong reads and transactions hitch latency to the primary and to Multi-Paxos." },
    { pro: "Log-only replicas make writes cheaper while still replicating for durability.", con: "Reads against a log replica are slow; the router must know who materialized a B-tree." },
    { pro: "MDS always-query-the-DB keeps autoscaling honest and avoids a 10× latency cliff.", con: "You pay steady extra load to the metadata store even when the cache is hot." },
    { pro: "LSI is strongly consistent and cheap for alternate sorts on the same key.", con: "GSI is another table, eventual, and capped at four — wide access patterns get expensive." },
    { pro: "Token-bucket burst plus cross-replica accounting feels fair to bursty customers.", con: "AWS must leave headroom on every node; packing tenants for burst is harder than packing for mean." }
  ],

  interviewTips: [
    "Separate 2007 Dynamo (AP, hinted handoff) from 2022 DynamoDB (managed, Paxos leader, optional strong/ACID).",
    "Walk client → router → MDS → primary persist → two replicas → S3/streams.",
    "Ask whether the GET may be stale; if not, pin it to the primary.",
    "Model partition key + sort key from access patterns before you mention indexes.",
    "Use LSI for another sort on the same item; GSI only when the partition key itself must change.",
    "For multi-tenant fairness: throttle the over-user, burst from a token bucket, account globally across replicas."
  ],

  scene: {
    nodes: [
      { id: "zaz1", label: "AZ primary", type: "zone", pos: [5, 0, 0], size: [5, 3], showAt: 1 },
      { id: "zaz2", label: "AZ replica", type: "zone", pos: [5, 0, -4], size: [5, 3], showAt: 1 },
      { id: "zaz3", label: "AZ replica", type: "zone", pos: [5, 0, 4], size: [5, 3], showAt: 1 },

      { id: "client", label: "Client", type: "user", pos: [-10, 0, 0] },
      { id: "rr", label: "Request router", type: "lb", pos: [-5, 0, 0], showAt: 1 },
      { id: "mds", label: "MDS cache", type: "cache", pos: [-5, 0, -4], showAt: 1 },
      { id: "bucket", label: "Token bucket", type: "queue", pos: [-5, 0, 4], showAt: 8 },

      { id: "pri", label: "Primary B-tree", type: "db", pos: [2, 0, 0], showAt: 1 },
      { id: "rA", label: "Replica B-tree", type: "db", pos: [2, 0, -4], showAt: 2 },
      { id: "rB", label: "Log replica", type: "server", pos: [2, 0, 4], showAt: 2 },

      { id: "s3", label: "S3 logs", type: "storage", pos: [8, 0, -4], showAt: 2 },
      { id: "stream", label: "Streams", type: "queue", pos: [8, 0, 0], showAt: 2 },
      { id: "gsi", label: "Global index", type: "db", pos: [8, 0, 4], showAt: 7 },

      { id: "n0", label: "Predictable > fast-ish", type: "note", pos: [-11, 4, -7] },
      { id: "n1", label: "MDS ~99.7% hits", type: "note", pos: [0, 4, -7], showAt: 1 },
      { id: "n2", label: "Write primary first", type: "note", pos: [8, 4, -7], showAt: 2 },
      { id: "n3", label: "Strong GET = primary", type: "note", pos: [-11, 4, 7], showAt: 3 },
      { id: "n4", label: "Multi-Paxos leader", type: "note", pos: [0, 4, 7], showAt: 4 },
      { id: "n5", label: "Always query metadata DB", type: "note", pos: [11, 4, 7], showAt: 5 },
      { id: "n6", label: "PK hash + SK range", type: "note", pos: [11, 4, 0], showAt: 6 },
      { id: "n7", label: "5 min burst tokens", type: "note", pos: [11, 4, -7], showAt: 8 }
    ],
    edges: [
      { from: "client", to: "rr", label: "API", showAt: 1 },
      { from: "rr", to: "mds", label: "lookup", showAt: 1, dashed: true },
      { from: "rr", to: "pri", label: "write/strong", showAt: 1 },
      { from: "pri", to: "rA", label: "replicate", showAt: 2 },
      { from: "pri", to: "rB", label: "replicate", showAt: 2 },
      { from: "pri", to: "s3", label: "log", showAt: 2, dashed: true },
      { from: "s3", to: "stream", showAt: 2 },
      { from: "stream", to: "gsi", label: "CDC", showAt: 7 },
      { from: "rr", to: "rA", label: "eventual GET", showAt: 3, dashed: true },
      { from: "rr", to: "bucket", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "Managed, huge, boring on purpose",
        text: "DynamoDB is a fully managed NoSQL table: auto-scale, petabytes, tens of millions of QPS. AWS would rather be predictably slow than randomly fast. Optional ACID and strong reads mean \"NoSQL\" is not an excuse to drop consistency.",
        highlight: ["client", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6", "n7"]
      },
      {
        title: "Router plus MDS",
        text: "The request router asks MDS which SSD replicas own the key and who is primary. Routing and storage stay isolated even inside one AZ. Writes prefer a router colocated with that primary.",
        highlight: ["client", "rr", "mds", "pri", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "client", to: "rr", color: "#4ade80", label: "req" },
          { from: "rr", to: "mds", color: "#c084fc", label: "who owns?" },
          { from: "rr", to: "pri", color: "#4ade80", label: "forward" }
        ]
      },
      {
        title: "Persist, replicate, stream to S3",
        text: "The primary writes local SSD, then forwards to the other two AZ replicas. The same log ships to S3 for backup and DynamoDB Streams. Downstream consumers — including indexes — tail that stream.",
        highlight: ["pri", "rA", "rB", "s3", "stream", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "pri", to: "rA", color: "#c084fc", label: "replica" },
          { from: "pri", to: "rB", color: "#c084fc", label: "replica" },
          { from: "pri", to: "s3", color: "#fb923c", label: "log" },
          { from: "s3", to: "stream", color: "#fb923c", label: "CDC" }
        ]
      },
      {
        title: "Strong vs eventual GET",
        text: "A strong GET is pinned to the primary so you never see a replica that missed a delete. An eventual GET may hit a follower for load spread and can return stale or resurrected items. That is the contract you choose per request.",
        highlight: ["rr", "pri", "rA", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "rr", to: "pri", color: "#60a5fa", label: "strong" },
          { from: "rr", to: "rA", color: "#fb923c", label: "eventual" }
        ]
      },
      {
        title: "Paxos leader, B-tree vs log",
        text: "Multi-Paxos elects the leader. That node keeps a B-tree so keyed reads are cheap. A replica may store only logs: durable, less CPU on the write path, terrible as a user-facing read. Send GETs to materialized copies.",
        highlight: ["pri", "rA", "rB", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6", "n7"],
        flows: [
          { from: "pri", to: "rB", color: "#c084fc", label: "log only" },
          { from: "rr", to: "pri", color: "#60a5fa", label: "read B-tree" }
        ]
      },
      {
        title: "Never let MDS go cold",
        text: "A metadata miss is ~10× a hit. If MDS flushes, every request pays the long path and routers collapse. DynamoDB keeps querying the metadata DB even on hits so utilization stays high enough to autoscale before a crash, not after.",
        highlight: ["mds", "rr", "n5"],
        fail: ["mds"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6", "n7"],
        flows: [
          { from: "rr", to: "mds", color: "#f87171", label: "cold" },
          { from: "mds", to: "pri", color: "#fb923c", label: "refresh anyway" }
        ]
      },
      {
        title: "Keys that match access patterns",
        text: "Hash the partition key to a shard; use the sort key for ranges (posts in the last seven days). Composite keys (user+post) encode a second path in the same table. Duplicate data; do not join.",
        highlight: ["pri", "client", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n7"],
        flows: [
          { from: "client", to: "rr", color: "#4ade80", label: "PK+SK" },
          { from: "rr", to: "pri", color: "#4ade80", label: "hash" }
        ]
      },
      {
        title: "LSI vs GSI",
        text: "A local secondary index re-sorts the same partition (likes instead of time) and stays strongly consistent. A global index is a new partition key — a streamed extra table, eventually consistent, limited to four because it is a full copy.",
        highlight: ["pri", "stream", "gsi"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "pri", to: "stream", color: "#fb923c", label: "change" },
          { from: "stream", to: "gsi", color: "#c084fc", label: "GSI" }
        ]
      },
      {
        title: "Capacity units and burst",
        text: "You buy RCUs and WCUs. Exceed them and you are throttled so neighbors survive. Unused tokens fill a five-minute bucket, so a lunch peak can spend the morning's savings. Spend is global across three replicas, not a local hair-trigger.",
        highlight: ["bucket", "rr", "pri", "rA", "rB", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "rr", to: "bucket", color: "#fb923c", label: "tokens" },
          { from: "client", to: "rr", color: "#4ade80", label: "lunch burst" }
        ]
      }
    ]
  }
});
