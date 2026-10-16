window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 6,
  title: "Scaling Memcache at Facebook",
  video: "https://www.youtube.com/watch?v=uS8f5SSYDck",
  category: "Paper Walkthroughs",
  tagline: "A homepage is hundreds of keys — replicate the cache, UDP the reads, delete on write.",
  summary: "Facebook's 2010 Memcache fleet is a shared look-aside cache for every product team that renders a page. One request fans out into hundreds of key lookups, so the client library batches, compresses, and hides miss-fill. Gets ride UDP for latency; sets stay on TCP for order. The fleet scales by replicating whole working sets rather than sharding a page across boxes, sheds overload with a short sliding window, parks failures on a tiny gutter pool, and uses MySQL binlogs plus McSqueal so a few write nodes can feed many readers.",

  theory: [
    {
      heading: "A page is a tree of keys, not one query",
      body: "Opening a Facebook or Instagram surface is not <code>SELECT *</code>. A celebrity post needs the funniest comment, reply counts, likes, notifications, messages, ranking, and activity — each owned by a different team. One homepage becomes <b>hundreds of parallel key-value reads</b>. The 2010 paper is how to give those teams one cache that answers in about <b>10ms</b>, instead of letting every squad build its own.",
      bullets: [
        "Volume is large; fan-out is the harder problem.",
        "Posts, notifications, and messages are separate services hitting the same cache.",
        "If the cache is slow, there is no point in having it."
      ]
    },
    {
      heading: "CAP is not a single checkbox",
      body: "A partitioned cache cannot be perfectly consistent and perfectly available. Memcache at Facebook is <b>neither all-C nor all-A</b>. Product-wide they prefer high availability and <i>eventual</i> consistency — a missing reply on a friend's comment still changes how you answer. They still push consistency as far as the path allows (ordered sets, invalidate-on-write, regional replication). Pick C or A <b>per use case</b>, not as a religion for the whole box."
    },
    {
      heading: "Adoption is the staff-engineer metric",
      body: "If every team writes a private cache, Facebook pays N times the build, test, and pager cost. The primary KPI is <b>everyone imports this library</b>. Docs and error handling help; the lecture's concrete lever is <b>ease of use</b>. Ship language clients (Python import, Java JAR) that own HTTP, object construction, compression, and <b>batching</b>. The homepage's hundred keys become one round trip. Bump a client version when the contract changes. Lazy engineers onboard because three steps disappeared.",
      bullets: [
        "The Memcache team writes the clients, not the product teams.",
        "Batch + compress is why a profile render does not open a hundred TCP sockets.",
        "Meet the latency and correctness bar or nobody switches."
      ]
    },
    {
      heading: "Look-aside: the web server owns the miss",
      body: "Read path: web server → <code>GET friends:gaurav</code>. Empty cache returns nothing. The server (via the client) hits <b>MySQL</b>, gets 20 friends, then <code>SET</code>s the key. The cache is not in the database process; it is a sidecar the app fills. Write path: <b>update MySQL first</b>, then <code>DELETE</code> the key — do not <code>SET 21</code>. A failed delete is retried; the next read refills from MySQL. A failed in-place set would need ordered retries under concurrent updates. Invalidate is the boring, correct protocol.",
      bullets: [
        "Look-aside (the talk's \"leukocyte\" wording): cache and DB are separate; the client sequences them.",
        "Product code sees one get; miss-fill lives in the library.",
        "Delete-on-write is idempotent. Overwrite-on-write is not."
      ]
    },
    {
      heading: "UDP for GET, TCP for SET",
      body: "Sets use <b>TCP</b>: request, ACK, then the next set. <code>k=1</code> then <code>k=2</code> ends at 2. UDP sets could reorder; the last writer would not be the last value. Gets use <b>UDP</b>: no handshake, no per-connection memory, no 65k file-descriptor ceiling (they had patched the kernel past a million connections and then stopped needing it), and <b>no head-of-line blocking</b> — the airport-counter picture, and the same reason HTTP/3 sits on QUIC. Out-of-order get replies are dropped; about <b>20% of Memcache errors</b> are just reordering. They spend that error budget for about <b>20% lower get latency</b> and a higher hit rate (more keys per box).",
      bullets: [
        "UDP get: unordered, connectionless, parallel.",
        "TCP set: serialized acknowledgements.",
        "Drop strange get packets; do not stall the page."
      ]
    },
    {
      heading: "Replicate the working set; do not shard the page",
      body: "Vertical scale ends. Horizontal scale has two shapes. <b>Shard by key range</b>: node A holds 1–333, B 334–666, C 667–1000. Unique keys go up (100 hot keys per box → 300 in the fleet). A homepage that needs a hundred keys now visits many boxes — one problem becomes a scatter-gather. Facebook <b>replicated</b> instead: add nine servers, each can answer Gaurav's whole page in 10ms. Access pattern (many keys, one user) beats the textbook unique-key argument.",
      bullets: [
        "Sharding maximizes distinct keys. Homepages do not fetch distinct-key spreads; they fetch a bundle.",
        "Replication maximizes parallel full-page hits.",
        "Viral posts still need overload control; copies are not infinite CPU."
      ]
    },
    {
      heading: "Windows, gutters, binlogs, few writers",
      body: "Each web client keeps a <b>sliding window</b> of in-flight cache requests. Too large: the tail waits, the phone retries anyway. Too small: the first burst is dropped and the phone retries immediately. Drop from the back of a medium window. When a box is lost or freshly added, heat spikes — a <b>gutter</b> pool (~<b>1% of nodes</b>) absorbs ~<b>99% of those failures</b>. Gutters are cold and still cheaper than melting the primary. Regional MySQL cannot stay isolated (India vs US relatives). Facebook copies <b>binlogs</b> (the change log of writes; reads omitted) and sneak cache invalidations onto that stream with <b>McSqueal</b>. Reads outnumber writes ~<b>1000:1</b>, so a handful of write nodes (one per region) take the UPDATE; McSqueal fans it to many read replicas. Direct fan-out to every DB would be a thundering herd.",
      bullets: [
        "Gutter: spare, ugly locality, reserved for overflow.",
        "McSqueal: binlog + embedded cache deletes, worldwide.",
        "Few writers, many readers — the same ratio as the traffic."
      ]
    }
  ],

  keyTerms: [
    { term: "Look-aside cache", def: "App (via client) GETs the cache, fills from MySQL on miss, and SETs. The DB does not own the cache." },
    { term: "Invalidate-on-write", def: "Commit MySQL, then DELETE the key. Retries are safe; the next GET refills." },
    { term: "UDP GET / TCP SET", def: "Reads are connectionless and unordered; writes are ACK-ordered so the last set wins." },
    { term: "Replication vs sharding", def: "Copies of the working set vs splitting key ranges. Homepages want copies." },
    { term: "Sliding window", def: "Per-client cap on in-flight cache RPCs; overflow is dropped so phones retry on a live queue." },
    { term: "Gutter", def: "Tiny spare Memcache pool (~1%) that serves traffic when a primary is lost or too hot." },
    { term: "McSqueal", def: "Facebook's binlog pipeline that replicates MySQL writes and injects cache invalidations." },
    { term: "Head-of-line blocking", def: "One slow TCP get stalls every get behind it; UDP lets them fly in parallel." }
  ],

  tradeoffs: [
    { pro: "One client library: batching, compression, miss-fill, and versioned contracts.", con: "The cache team now owns every language's SDK and every team's pager-adjacent bugs." },
    { pro: "UDP gets: ~20% less latency, more keys per box, no HOL blocking.", con: "~20% of errors are reordered packets you must drop; no get-get ordering." },
    { pro: "Replicated caches: one box can render the whole homepage.", con: "Fewer unique keys than a sharded fleet; memory is duplicated." },
    { pro: "Delete-after-MySQL: retries cannot corrupt a concurrent SET.", con: "The next reader misses and stamps the DB until refill." },
    { pro: "Gutter + McSqueal + few write nodes: cheap failure handling and no write stampede.", con: "Gutter hit rate is poor; readers can lag the writer until the binlog lands." }
  ],

  interviewTips: [
    "Draw the homepage as a fan-out of keys, not a single SQL row.",
    "Say look-aside plus delete-on-write; do not SET the new value into cache on the write path.",
    "UDP for GET, TCP for SET — and name HOL blocking / QUIC as the analogy.",
    "Reject key-range sharding for this access pattern; replicate so one node has the page.",
    "Size the sliding window: too big waits, too small retry-storms.",
    "Close with gutter (~1%/99%), binlog McSqueal, and 1000:1 read/write split."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Phone", type: "phone", pos: [-11, 0, 0] },
      { id: "web", label: "Web server", type: "server", pos: [-7, 0, 0] },
      { id: "cli", label: "Client lib", type: "service", pos: [-7, 0, 4], showAt: 1 },
      { id: "mcA", label: "Mc A", type: "cache", pos: [-1, 0, -4] },
      { id: "mcB", label: "Mc B", type: "cache", pos: [-1, 0, 0] },
      { id: "mcC", label: "Mc C", type: "cache", pos: [-1, 0, 4], showAt: 5 },
      { id: "win", label: "Sliding Q", type: "queue", pos: [4.5, 0, -5], showAt: 6 },
      { id: "mysql", label: "MySQL", type: "db", pos: [4.5, 0, 0] },
      { id: "gutter", label: "Gutter", type: "cache", pos: [4.5, 0, 5], showAt: 7 },
      { id: "mcsq", label: "McSqueal", type: "queue", pos: [9.5, 0, 0], showAt: 8 },
      { id: "us", label: "US replica", type: "db", pos: [9.5, 0, -5], showAt: 8 },
      { id: "eu", label: "EU replica", type: "db", pos: [9.5, 0, 5], showAt: 8 },
      { id: "n0", label: "Hundreds of keys / page", type: "note", pos: [-11, 0, -5] },
      { id: "n1", label: "Batch + import SDK", type: "note", pos: [-11, 0, 5], showAt: 1 },
      { id: "n2", label: "Miss then SET", type: "note", pos: [0, 0, -7.5], showAt: 2 },
      { id: "n3", label: "UPDATE then DELETE", type: "note", pos: [4.5, 0, 7.5], showAt: 3 },
      { id: "n4", label: "UDP GET, TCP SET", type: "note", pos: [-1, 0, 7.5], showAt: 4 },
      { id: "n5", label: "Copy the page, do not split", type: "note", pos: [-5, 0, 7.5], showAt: 5 },
      { id: "n6", label: "Medium window, drop tail", type: "note", pos: [9.5, 0, 7.5], showAt: 6 },
      { id: "n7", label: "1% nodes, 99% failures", type: "note", pos: [9.5, 0, -7.5], showAt: 7 },
      { id: "n8", label: "1000 reads / 1 write", type: "note", pos: [4.5, 0, -7.5], showAt: 8 }
    ],
    edges: [
      { from: "phone", to: "web", label: "page" },
      { from: "web", to: "cli", showAt: 1 },
      { from: "cli", to: "mcA", showAt: 1 },
      { from: "cli", to: "mcB", showAt: 1 },
      { from: "web", to: "mcA" },
      { from: "web", to: "mcB" },
      { from: "mcB", to: "mysql", label: "miss", dashed: true },
      { from: "web", to: "mysql", label: "UPDATE", showAt: 3 },
      { from: "cli", to: "mcC", showAt: 5 },
      { from: "cli", to: "win", showAt: 6 },
      { from: "win", to: "mcB", showAt: 6 },
      { from: "web", to: "gutter", label: "fail over", showAt: 7, dashed: true },
      { from: "gutter", to: "mysql", showAt: 7, dashed: true },
      { from: "mysql", to: "mcsq", label: "binlog", showAt: 8 },
      { from: "mcsq", to: "us", showAt: 8 },
      { from: "mcsq", to: "eu", showAt: 8 }
    ],
    steps: [
      {
        title: "One page, hundreds of keys",
        text: "A profile is a tree: post, top comment, replies, likes, notifications, messages, ranking. Each branch is another team's service. The render is hundreds of parallel KV lookups, not one SQL query.",
        highlight: ["phone", "web", "mcA", "mcB", "n0"],
        flows: [
          { from: "phone", to: "web", color: "#4ade80", label: "home" },
          { from: "web", to: "mcA", color: "#60a5fa", label: "comments" },
          { from: "web", to: "mcB", color: "#60a5fa", label: "likes" }
        ]
      },
      {
        title: "Ship a client, not a wiki",
        text: "Adoption is the metric. Product servers import a library that builds requests, compresses, and batches the homepage's keys into one call. The Memcache team owns the SDK; bumping a version updates the contract.",
        highlight: ["cli", "web", "n1"],
        hide: ["n0"],
        flows: [
          { from: "web", to: "cli", color: "#c084fc", label: "import" },
          { from: "cli", to: "mcA", color: "#4ade80", label: "batch GET" },
          { from: "cli", to: "mcB", color: "#4ade80", label: "batch GET" }
        ]
      },
      {
        title: "Look-aside fill",
        text: "GET friends:gaurav on a cold cache returns nothing. The client hits MySQL, learns 20, and SET the key. The web process sequences cache and database; MySQL does not know Memcache exists.",
        highlight: ["cli", "mcB", "mysql", "n2"],
        hide: ["n1", "n3"],
        flows: [
          { from: "cli", to: "mcB", color: "#60a5fa", label: "GET" },
          { from: "mcB", to: "mysql", color: "#fb923c", label: "miss" },
          { from: "mysql", to: "cli", color: "#4ade80", label: "20" },
          { from: "cli", to: "mcB", color: "#4ade80", label: "SET" }
        ]
      },
      {
        title: "Write MySQL, then delete the key",
        text: "A new friend is an UPDATE in MySQL. After the commit, DELETE the cached count — do not SET 21. A lost delete is retried; the next GET refills. An in-place SET would fight concurrent writers.",
        highlight: ["web", "mysql", "mcB", "n3"],
        hide: ["n2", "n1"],
        flows: [
          { from: "web", to: "mysql", color: "#4ade80", label: "UPDATE" },
          { from: "web", to: "mcB", color: "#f87171", label: "DELETE" }
        ]
      },
      {
        title: "UDP gets, TCP sets",
        text: "Sets wait for TCP ACKs so k=1 then k=2 lands on 2. Gets use UDP: no connection table, no HOL blocking, ~20% faster. Reordered get packets are dropped — about a fifth of Memcache errors, spent on purpose.",
        highlight: ["cli", "mcA", "mcB", "n4"],
        hide: ["n3", "n5"],
        flows: [
          { from: "cli", to: "mcB", color: "#60a5fa", label: "UDP GET" },
          { from: "cli", to: "mcA", color: "#4ade80", label: "TCP SET" }
        ]
      },
      {
        title: "Replicate the homepage, do not shard it",
        text: "Key-range shards raise unique-key capacity, but a page that needs a hundred keys would hit every shard. Facebook adds replicas so Gaurav's whole page lives on Mc A or Mc C. Access pattern beats the unique-key argument.",
        highlight: ["mcA", "mcB", "mcC", "n5"],
        hide: ["n4", "n6"],
        flows: [
          { from: "cli", to: "mcA", color: "#60a5fa", label: "Gaurav" },
          { from: "cli", to: "mcC", color: "#60a5fa", label: "you" }
        ]
      },
      {
        title: "A medium sliding window",
        text: "The client admits a bounded queue of cache RPCs. A huge window makes the tail stale until the phone retries. A tiny window drops the first burst and the phone retries immediately. Drop from the back; size for neither wait nor retry storm.",
        highlight: ["win", "cli", "mcB", "n6"],
        hide: ["n5", "n7"],
        flows: [
          { from: "cli", to: "win", color: "#fb923c", label: "enqueue" },
          { from: "win", to: "mcB", color: "#4ade80", label: "admit" }
        ]
      },
      {
        title: "Gutter: 1% of boxes, 99% of failures",
        text: "New or dead servers spike miss storms. A reserved gutter pool — about 1% of the fleet — takes that overflow and still talks to MySQL. Locality is terrible. The failure savings are not.",
        highlight: ["gutter", "mcB", "mysql", "n7"],
        fail: ["mcB"],
        hide: ["n6", "n2"],
        flows: [
          { from: "web", to: "gutter", color: "#f87171", label: "overflow" },
          { from: "gutter", to: "mysql", color: "#60a5fa", label: "fill" }
        ]
      },
      {
        title: "Binlog, McSqueal, few writers",
        text: "Regional MySQL stays in sync by replaying binary logs. McSqueal appends cache invalidations onto that stream. Writes are ~1/1000 of reads, so one write node per region plus many read replicas. Fan-out from the client would stampede every replica.",
        highlight: ["mysql", "mcsq", "us", "eu", "n8"],
        hide: ["n7", "n3"],
        flows: [
          { from: "mysql", to: "mcsq", color: "#fb923c", label: "binlog" },
          { from: "mcsq", to: "us", color: "#c084fc", label: "replay" },
          { from: "mcsq", to: "eu", color: "#c084fc", label: "replay" }
        ]
      }
    ]
  }
});
