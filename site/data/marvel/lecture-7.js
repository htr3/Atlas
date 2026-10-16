window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 7,
  title: "Facebook TAO",
  video: "https://www.youtube.com/watch?v=Dg07kVN4U28",
  category: "Paper Walkthroughs",
  tagline: "A graph API on Memcache and MySQL — hash the source, hang the inverse, skip a hot shard.",
  summary: "TAO (The Associations and Objects) is Facebook's 2013 social-graph store: petabytes, about a billion queries per second, 99.8% reads. Engineers wrap the Memcache/MySQL stack they already ran instead of standing up Neo4j. A tiny API creates edges (Gaurav–friend-request–Pramod), lists, pages, and counts. Objects hash by id; edges hash by source so a friend list is one shard; the inverse edge lives on the destination's shard. Primaries take writes, replicas serve reads, and a viral key bypasses cache rather than thrashing LRU.",

  theory: [
    {
      heading: "Objects, associations, and a billion reads",
      body: "TAO is <b>The Associations and Objects</b>: graph nodes are objects (people, hotels, comments); edges are associations (check-in, friend request, like). A person checking into a hotel is an action; the hotel is a reusable object. Comments hang off the same source with a new destination each time. The 2013 paper quotes <b>petabytes</b> and about <b>1 billion queries/s</b>, of which <b>99.8% are reads</b> — the same lopsided mix as Memcache. Disk graph databases (Neo4j is the named example) cannot serve that QPS. Nothing off the shelf held a petabyte graph in RAM, so Facebook had to build.",
      bullets: [
        "Associations map events and relationships; objects map the nouns you reuse.",
        "Assume the number has only grown; the architecture is what scaled to a billion.",
        "Read-heavy traffic licenses replicas, not a fully connected write mesh."
      ]
    },
    {
      heading: "Wrap what the company already runs",
      body: "A principal engineer can invent a new graph engine. Impact said otherwise: in 2013 Facebook was fluent in <b>MySQL</b> and in the Memcache fleet from the previous paper. TAO is a <b>graph-shaped API in front of that pair</b>. Product engineers stop thinking about Memcache idiosyncrasies and issue association calls. The common optimizations every team had reinvented move into one store. Ease of use is the requirement that actually drives adoption; peak efficiency is secondary if nobody migrates."
    },
    {
      heading: "A tiny API on purpose",
      body: "CRUD an association with <b>source, destination, type</b> — Gaurav, Pramod, <code>friend_request</code>. Fetch Gaurav's friends (source + type). Optional <b>limit</b> (top 100 people you talk to), <b>time range</b> (last 15 days), <b>pagination</b> (next page), and <b>count</b> (how many friends, how many check-ins) so you never download the list to tally it. Edges are <b>bidirectional</b>: check-in from person→hotel has checked-in from hotel→person, so the Vegas property can count guests. That is almost the whole surface. Extra verbs would slow a billion-QPS path and send teams back to private stores.",
      bullets: [
        "Counts are stored answers for the product UI, not an analytics afterthought.",
        "Pagination is a second call, not an unbounded scan.",
        "Minimal API is a load-shedding strategy as much as a taste strategy."
      ]
    },
    {
      heading: "Hash objects by id, edges by source",
      body: "Caches are sharded by key range (0–333, 334–666, …). Each shard holds the hot keys in its range, not the entire range. The client hashes the <b>object id</b> and picks the shard. Edges are different: the API always starts from a source (\"friends of Gaurav\"), so TAO hashes the <b>source id</b> and colocates those edges with that object. One request, one shard, sequential scan of a type. Inverse edges (liked-by on a post) hash the <i>post</i> as source, so they live elsewhere. A like therefore touches <b>two shards</b>.",
      bullets: [
        "Object routing: hash(id) → range → shard (or MySQL on miss).",
        "Edge routing: hash(source id) so assoc_get(source, type) is local.",
        "Writes that miss or mutate go to MySQL; Memcache's usual consistency tricks apply."
      ]
    },
    {
      heading: "Ordered inverse writes, hanging edges, cron",
      body: "Person 123 likes post 345: store <code>like</code> on 123's shard, then <code>liked_by</code> on 345's shard. The client <b>waits for the first persist</b> before sending the second. If shard one fails, retry until it accepts — you never create a dangling inverse. If shard one succeeds and shard two dies, you have a <b>hanging edge</b>: the person shows a like the post cannot list. Two-phase commit would fix it and would be slow. TAO leaves the hang and a <b>cron</b> later completes missing inverses. Inconsistency is bounded and repaired, not transactional.",
      bullets: [
        "Amplification of two writes is acceptable; split-brain on the inverse is the real bug.",
        "Client, not the cache, sequences the pair.",
        "Background repair is the distributed-systems adult choice here."
      ]
    },
    {
      heading: "One primary per key, write through the nearby replica",
      body: "If every replica in a 1000-node fleet applied every write, write amplification would be 1000× and read caches would churn. TAO splits <b>primary shards</b> (one per key range; a few percent of boxes) from <b>read replicas</b>. CDC — MySQL binlog, the same McSqueal idea — fans writes among primaries, not among every replica. Clients <b>never send writes to the primary</b>. They write the nearest read replica; that replica forwards to its primary; the primary persists in MySQL and returns so <b>that replica has read-your-writes</b>. Other replicas catch up asynchronously. One primary keeps a single commit point without a 1000-way update.",
      bullets: [
        "2% write nodes, 98% read nodes matches 99.8% GET traffic.",
        "Forward-to-primary is how a regional client stays consistent with itself.",
        "Do not confuse this with \"client talks to leader.\""
      ]
    },
    {
      heading: "Viral keys: shard by type, then skip the cache",
      body: "A celebrity post (the lecture's example) grows hundreds of thousands of likes, comments, and shares on one source id. The home shard melts. First mitigation: route by <b>source + type</b> so likes, comments, and shares land on different boxes. A hot comment on that post can still melt a type-shard. Adding more replicas copies the same oversized adjacency list — LRU then <b>thrashes</b> (fetch Gaurav's like, evict, fetch a US friend's like). The last move is rude and correct: <b>bypass TAO cache and query MySQL</b>. You were going to hit disk anyway; stop pretending the working set fits.",
      bullets: [
        "source+type is a partial split, not a guarantee.",
        "Thrash is worse than a direct DB read.",
        "TAO looks like a graph database; internally it is Memcache policy plus MySQL plus CDC."
      ]
    }
  ],

  keyTerms: [
    { term: "Object", def: "A graph node: person, hotel, post, comment — the reusable noun." },
    { term: "Association", def: "A typed edge (check-in, friend, like) with source, destination, and optional time." },
    { term: "Inverse edge", def: "The reverse association (checked-in, liked-by) stored under the destination as source." },
    { term: "Source hash", def: "Edges are sharded by hash(source id) so all of Gaurav's friend edges sit together." },
    { term: "Hanging edge", def: "The forward association committed and the inverse did not; a cron finishes it." },
    { term: "Primary shard", def: "The single write owner for a key range; replicas serve reads and forward writes there." },
    { term: "Read-your-writes", def: "The replica you wrote through sees the new edge after the primary ACKs." },
    { term: "Source+type shard", def: "Split a hot node's likes vs comments onto different caches to spread viral heat." }
  ],

  tradeoffs: [
    { pro: "Graph API on Memcache+MySQL: Facebook's existing pager, no new storage engine.", con: "You inherit Memcache's consistency model; this is not a transactional graph DB." },
    { pro: "Tiny API (CRUD, list, page, count): high QPS and high adoption.", con: "No rich graph walks; teams with deeper queries still build side paths." },
    { pro: "Colocate edges by source: friend lists are one hop.", con: "Every like writes two shards; inverses can hang until cron." },
    { pro: "One primary + replica-forward: read-your-writes without 1000× write amp.", con: "Other replicas lag; you did not buy linearizability cluster-wide." },
    { pro: "Bypass cache on viral keys: no LRU death spiral.", con: "MySQL takes the celebrity spike you refused to cache." }
  ],

  interviewTips: [
    "Define TAO as associations + objects, then quote ~1B QPS and 99.8% reads.",
    "Say wrapper over Memcache and MySQL, not Neo4j, because that is what Facebook already operated.",
    "Hash objects by id, edges by source; draw the inverse like on the post's shard.",
    "Sequence forward then inverse; name hanging edges and cron instead of 2PC.",
    "Writes go to the nearest replica, which forwards to one primary — that is RYW.",
    "For a viral post: source+type first, then skip cache to MySQL when LRU would thrash."
  ],

  scene: {
    nodes: [
      { id: "app", label: "App server", type: "server", pos: [-11, 0, 0] },
      { id: "gaurav", label: "Gaurav", type: "user", pos: [-7, 0, -4] },
      { id: "pramod", label: "Pramod", type: "user", pos: [-7, 0, 4] },
      { id: "hotel", label: "Hotel", type: "storage", pos: [-7, 0, 0], showAt: 2 },
      { id: "s1", label: "Shard 0-200", type: "cache", pos: [-1, 0, -5] },
      { id: "s2", label: "Shard 200-400", type: "cache", pos: [-1, 0, 0] },
      { id: "s3", label: "Shard 400+", type: "cache", pos: [-1, 0, 5] },
      { id: "prim", label: "Primary", type: "server", pos: [5, 0, 0], showAt: 6 },
      { id: "rep", label: "Read replica", type: "server", pos: [5, 0, 5], showAt: 6 },
      { id: "mysql", label: "MySQL", type: "db", pos: [10, 0, 0] },
      { id: "cdc", label: "McSqueal", type: "queue", pos: [10, 0, 5], showAt: 6 },
      { id: "cron", label: "Repair cron", type: "worker", pos: [10, 0, -5], showAt: 5 },
      { id: "n0", label: "Objects + associations", type: "note", pos: [-11, 0, -5] },
      { id: "n1", label: "API on Memcache+MySQL", type: "note", pos: [-11, 0, 5], showAt: 1 },
      { id: "n2", label: "source, dest, type", type: "note", pos: [-7, 0, 7], showAt: 2 },
      { id: "n3", label: "Edges hash(source)", type: "note", pos: [-1, 0, 7.5], showAt: 3 },
      { id: "n4", label: "Like hits two shards", type: "note", pos: [-1, 0, -7.5], showAt: 4 },
      { id: "n5", label: "Hang, then cron", type: "note", pos: [10, 0, -7.5], showAt: 5 },
      { id: "n6", label: "CDC to primaries only", type: "note", pos: [5, 0, -5], showAt: 6 },
      { id: "n7", label: "Replica forwards write", type: "note", pos: [5, 0, 7.5], showAt: 7 },
      { id: "n8", label: "Too hot: query MySQL", type: "note", pos: [10, 0, 7.5], showAt: 8 }
    ],
    edges: [
      { from: "app", to: "gaurav" },
      { from: "gaurav", to: "pramod", label: "friend", dashed: true },
      { from: "app", to: "s1" },
      { from: "app", to: "s2" },
      { from: "app", to: "s3" },
      { from: "gaurav", to: "hotel", label: "check-in", showAt: 2, dashed: true },
      { from: "s1", to: "mysql", label: "miss", dashed: true },
      { from: "s2", to: "s3", label: "inverse", showAt: 4, dashed: true },
      { from: "cron", to: "s3", showAt: 5, dashed: true },
      { from: "rep", to: "prim", label: "forward", showAt: 6 },
      { from: "prim", to: "mysql", showAt: 6 },
      { from: "prim", to: "cdc", showAt: 6 },
      { from: "cdc", to: "s1", label: "primary fanout", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "A social graph, not a table",
        text: "Objects are people, hotels, comments. Associations are check-ins, friend requests, likes. The 2013 graph is petabytes and about a billion queries per second, almost all reads. That is the load TAO exists to serve.",
        highlight: ["app", "gaurav", "pramod", "s1", "s2", "s3", "n0"],
        flows: [
          { from: "app", to: "s1", color: "#60a5fa", label: "GET" },
          { from: "gaurav", to: "pramod", color: "#c084fc", label: "edge" }
        ]
      },
      {
        title: "Do not buy Neo4j; wrap the fleet you have",
        text: "On-disk graph stores miss the QPS bar. Facebook already mastered MySQL and Memcache. TAO is a graph API over that pair so product teams stop re-implementing cache tricks.",
        highlight: ["app", "s2", "mysql", "n1"],
        hide: ["n0"],
        flows: [
          { from: "app", to: "s2", color: "#60a5fa", label: "assoc" },
          { from: "s1", to: "mysql", color: "#fb923c", label: "miss" }
        ]
      },
      {
        title: "source, destination, type — and little else",
        text: "Add a friend request as (Gaurav, Pramod, friend_request). List top 100 friends, last 15 days, or the next page. Count friends or hotel check-ins without fetching the list. Inverse edges let the hotel count guests. Keep the API small so the billion-QPS path stays fast.",
        highlight: ["gaurav", "pramod", "hotel", "n2"],
        hide: ["n1"],
        flows: [
          { from: "app", to: "s1", color: "#4ade80", label: "add assoc" },
          { from: "gaurav", to: "hotel", color: "#c084fc", label: "check-in" }
        ]
      },
      {
        title: "Hash the object; hash the source of the edge",
        text: "Object 123 hashes into shard 0–200. An edge is stored where its source hashes, so \"friends of Gaurav\" is one lookup. The client never scans three caches for one list.",
        highlight: ["gaurav", "s1", "s2", "s3", "n3"],
        hide: ["n2", "n4"],
        flows: [
          { from: "app", to: "s1", color: "#4ade80", label: "hash(Gaurav)" }
        ]
      },
      {
        title: "A like writes two shards",
        text: "Person 123 → like → post 345 lives on 123's shard. The inverse liked-by lives on 345's shard. Two caches, two extra chances to disagree. Write amplification of two is fine; a one-sided like is not.",
        highlight: ["s1", "s3", "n4"],
        hide: ["n3", "n5"],
        flows: [
          { from: "app", to: "s1", color: "#4ade80", label: "like" },
          { from: "s1", to: "s3", color: "#c084fc", label: "liked-by" }
        ]
      },
      {
        title: "Persist forward, then inverse; cron the hang",
        text: "The client waits for shard one before writing shard two. If the first persist fails, retry. If the second fails, leave a hanging edge. A cron walks incompletes instead of running 2PC across Memcache.",
        highlight: ["s1", "s3", "cron", "n5"],
        fail: ["s3"],
        hide: ["n4", "n6"],
        flows: [
          { from: "app", to: "s1", color: "#4ade80", label: "1 persist" },
          { from: "s1", to: "s3", color: "#f87171", label: "2 fail" },
          { from: "cron", to: "s3", color: "#fb923c", label: "repair" }
        ]
      },
      {
        title: "Primaries only, not a 1000-way update",
        text: "A write that touched every replica would amplify 1000×. One primary per key range takes the commit. Binlog/McSqueal fans to other primaries. The rest of the fleet are read replicas for the 99.8% GET mix.",
        highlight: ["prim", "rep", "cdc", "mysql", "n6"],
        hide: ["n5", "n7"],
        flows: [
          { from: "prim", to: "mysql", color: "#4ade80", label: "commit" },
          { from: "prim", to: "cdc", color: "#fb923c", label: "binlog" },
          { from: "cdc", to: "s1", color: "#c084fc", label: "other primaries" }
        ]
      },
      {
        title: "Write the nearby replica, read your writes",
        text: "Clients do not dial the primary. They write the nearest read replica; it forwards; the primary persists and ACKs so that replica's next GET sees the edge. Other regions catch up later. That is read-your-writes without a global lock.",
        highlight: ["app", "rep", "prim", "n7"],
        hide: ["n6", "n8"],
        flows: [
          { from: "app", to: "rep", color: "#4ade80", label: "write" },
          { from: "rep", to: "prim", color: "#fb923c", label: "forward" },
          { from: "prim", to: "rep", color: "#60a5fa", label: "ACK" }
        ]
      },
      {
        title: "Viral node: split by type, then skip cache",
        text: "A celebrity post's likes, comments, and shares can melt one source shard. Route by source+type first. If the like set still will not fit, more replicas only copy the thrash. Query MySQL directly — you were going to miss anyway.",
        highlight: ["s2", "mysql", "n8"],
        fail: ["s2"],
        hide: ["n7", "n3"],
        flows: [
          { from: "app", to: "s2", color: "#f87171", label: "hot" },
          { from: "app", to: "mysql", color: "#60a5fa", label: "bypass" }
        ]
      }
    ]
  }
});
