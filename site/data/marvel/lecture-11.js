window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 11,
  title: "20 Whitepapers that Changed Distributed Systems",
  video: "https://www.youtube.com/watch?v=WWGM4hY34pI",
  category: "Paper Walkthroughs",
  tagline: "A senior-engineer reading list, ranked by how much practice they teach.",
  summary: "A whitepaper is useful because the tradeoff was forced by a real product, not a textbook. This lecture ranks twenty papers from a TikTok recommender down to Zanzibar, and groups them into storage, compute, coordination, observability, and the social stack. Several of them already have their own walkthrough in this course; the point here is the map and why each paper earned its rank.",

  theory: [
    {
      heading: "Read the tradeoff, not the brand",
      body: "The opening example is Facebook memcache. A profile query also wants friends, likes, and a feed, so it already fans out. Sharding the key space would make that aggregate worse. Replicating the same key space costs machines and accepts eventual consistency, but it keeps the query local. Facebook took replication. That is the habit this list trains: name the product constraint, then name the choice it forced."
    },
    {
      heading: "Storage, from files up to global SQL",
      body: "The stack the lecture keeps returning to starts at the <b>Google File System</b>, the paper Hadoop's HDFS later echoed. <b>Bigtable</b> sits on it: a wide-column store with versions, built when NoSQL was not the default, and still the substrate under search-scale data. <b>Megastore</b> then puts relational semantics and ACID transactions on top of Bigtable, which is a useful way to see how indexes get invented over a store that does not offer them. <b>Spanner</b> is the globally distributed, strongly consistent database that spends real money on synchronized clocks and is expected to stay up through ugly faults. Around that core: <b>Cassandra</b> as the open-source gossip-and-cluster cousin of Dynamo, <b>FoundationDB</b> as Apple's strongly consistent key-value store whose testing story is the interesting part, <b>Aurora</b> as Amazon's pattern for scaling and hiding database-node churn from clients, and <b>DynamoDB</b> as the public system that made consistent hashing and partition moves a product."
    },
    {
      heading: "Compute: batch graphs and live embeddings",
      body: "<b>MapReduce</b> is the commodity-hardware pattern for analytics, recommendations, and archival. Spark and Hadoop are descendants, and the map/filter/reduce shape leaked into ordinary languages. <b>Pregel</b> is Google's older batch graph processor: PageRank and path finding, not an online social store. <b>Monolith</b> (ByteDance, counted as 20) is the other end of the spectrum: real-time recommendations. A user is a point in n dimensions — age, region, taste — and nearby points tend to watch the same thing. The hard part is embedding people well enough that the live model is not worse than the batch model."
    },
    {
      heading: "Agreement without one global vote",
      body: "<b>Chubby</b> is Google's distributed lock service, the ancestor-in-spirit of ZooKeeper. The paper spends its time on the practical lock service — a log, notifications when a lock is taken or dropped — and treats Paxos as assumed. <b>FlexiRaft</b> attacks the problem Raft has at planet scale: a majority of every replica is a terrible quorum when India, the US, and Europe all have to vote. Meta's answer is a tree. A region agrees locally, then leaders talk to leaders, and the hierarchy only has to be roughly consistent."
    },
    {
      heading: "See the failure before you explain it",
      body: "<b>Dapper</b> traces one request across hundreds of services. You sample, you do not log every line, and integration is reviewed so the tracer cannot tax the services it watches. <b>Minesweeper</b> is Meta's root-cause system: differentiate a metric until anomalies stand out, then look for a correlated factor (landings fell, so sales fell). A startup can do that by hand. A large org automates it. <b>Monarch</b> and <b>Gorilla</b> are the two time-series answers. Both must still speak when the database they monitor is dead, so the hot data lives in memory. Google refuses to assume only recent points matter. Facebook bets that recent points are the ones operators need, and leans on an open TSDB for the cold tail. Same job, opposite freshness bet."
    },
    {
      heading: "The social stack, and the paper ranked first",
      body: "<b>TAO</b> is Meta's in-memory graph of the social network. Adjacency lists and ordinary databases were tried; neither held the consistency and availability bar. <b>Memcache at Facebook</b> is ranked for the small decisions: TCP or UDP, shard or replicate, each one situational. <b>Zanzibar</b> is ranked first. The authorization idea itself is about a page. The paper is the pile of rate-limit, fault-tolerance, and freshness optimizations required to run that idea at billions of checks a day. It is also open enough to read without rebuilding Google. The lecture's close: pick a paper for its tradeoff, its scale, or how readable it is, and be able to say which."
    }
  ],

  keyTerms: [
    { term: "Embedding", def: "A user as a point in many dimensions so nearby people get similar recommendations." },
    { term: "FlexiRaft", def: "Meta's hierarchical Raft: regions agree locally, leaders agree upward." },
    { term: "Spanner", def: "Google's global SQL database: strong consistency, synchronized clocks, built to stay up." },
    { term: "Pregel", def: "Batch graph processing for ranking and paths, the ancestor of a lot of SEO-scale jobs." },
    { term: "Chubby", def: "Google's Paxos lock service. Practical logging and notifications, not a Paxos tutorial." },
    { term: "Megastore", def: "Relational transactions mapped onto Bigtable." },
    { term: "GFS", def: "Google's file layer under Bigtable and much else. HDFS is the open echo." },
    { term: "Gorilla vs Monarch", def: "Two in-memory metrics stores. Facebook privileges recent points; Google does not." },
    { term: "Zanzibar", def: "Google's global authorization system. A short model, a long list of production optimizations." }
  ],

  tradeoffs: [
    { pro: "Replicating a cache key space keeps aggregate profile queries on one copy.", con: "You pay for extra machines and you accept that copies can lag." },
    { pro: "A regional Raft tree scales past a single global majority.", con: "The tree is only roughly consistent across continents." },
    { pro: "Gorilla can be fast by treating recent points as the product.", con: "Monarch refuses that assumption and must hold a planet of series in RAM." },
    { pro: "Sampling traces keeps Dapper from becoming the outage.", con: "The request you needed might be one you did not sample." }
  ],

  interviewTips: [
    "Do not recite twenty names. Pick the layer the question sits in: file, table, global SQL, cache, trace, or auth.",
    "When you mention memcache, say why Facebook replicated instead of sharded: the query already joins friends, likes, and feed.",
    "If consensus comes up, contrast a flat majority with FlexiRaft's regional tree.",
    "For metrics, say the store must outlive the database it watches, then choose recent-only (Gorilla) or keep everything hot (Monarch).",
    "Zanzibar is the closer: the ACL model is small; the paper is about rate limits, faults, and freshness at billions of checks."
  ],

  scene: {
    nodes: [
      { id: "reader", label: "Senior engineer", type: "user", pos: [-11, 0, 0] },

      { id: "zStore", label: "Storage", type: "zone", pos: [-3, 0, -5], size: [14, 3.2] },
      { id: "gfs", label: "GFS", type: "storage", pos: [-8, 0, -5], showAt: 1 },
      { id: "bt", label: "Bigtable", type: "db", pos: [-5.5, 0, -5], showAt: 1 },
      { id: "mega", label: "Megastore", type: "db", pos: [-3, 0, -5], showAt: 1 },
      { id: "spanner", label: "Spanner", type: "db", pos: [-0.5, 0, -5], showAt: 1 },
      { id: "dyn", label: "DynamoDB", type: "db", pos: [2, 0, -5], showAt: 1 },

      { id: "zCompute", label: "Compute", type: "zone", pos: [8, 0, -5], size: [6, 3.2], showAt: 2 },
      { id: "mr", label: "MapReduce", type: "worker", pos: [6.5, 0, -5], showAt: 2 },
      { id: "pregel", label: "Pregel", type: "worker", pos: [9.2, 0, -5], showAt: 2 },

      { id: "zAgree", label: "Agreement", type: "zone", pos: [-6, 0, 0], size: [8, 3], showAt: 3 },
      { id: "chubby", label: "Chubby", type: "service", pos: [-8, 0, 0], showAt: 3 },
      { id: "flex", label: "FlexiRaft", type: "service", pos: [-5, 0, 0], showAt: 3 },
      { id: "noteTree", label: "Region agrees, leaders talk", type: "note", pos: [-6, 0, 2.2], showAt: 3 },

      { id: "zObs", label: "Observe", type: "zone", pos: [3, 0, 0], size: [10, 3], showAt: 4 },
      { id: "dapper", label: "Dapper", type: "service", pos: [0.2, 0, 0], showAt: 4 },
      { id: "mine", label: "Minesweeper", type: "service", pos: [3, 0, 0], showAt: 4 },
      { id: "monarch", label: "Monarch", type: "db", pos: [5.8, 0, 0], showAt: 4 },

      { id: "zSocial", label: "Social", type: "zone", pos: [-4, 0, 5], size: [8, 3], showAt: 5 },
      { id: "tao", label: "TAO", type: "cache", pos: [-6, 0, 5], showAt: 5 },
      { id: "mc", label: "Memcache", type: "cache", pos: [-3, 0, 5], showAt: 5 },
      { id: "gorilla", label: "Gorilla", type: "db", pos: [-0.2, 0, 5], showAt: 5 },

      { id: "zanz", label: "Zanzibar", type: "gateway", pos: [6, 0, 5], showAt: 6, color: "#facc15" },
      { id: "noteTop", label: "Rank 1: auth at billions of checks", type: "note", pos: [6, 0, 7.4], showAt: 6 },
      { id: "mono", label: "Monolith", type: "worker", pos: [10, 0, 5], showAt: 2 }
    ],
    edges: [
      { from: "gfs", to: "bt", label: "files", showAt: 1 },
      { from: "bt", to: "mega", label: "SQL on NoSQL", showAt: 1 },
      { from: "mega", to: "spanner", showAt: 1 },
      { from: "reader", to: "gfs", showAt: 1 },
      { from: "chubby", to: "flex", label: "locks to regions", showAt: 3 },
      { from: "dapper", to: "mine", showAt: 4 },
      { from: "mine", to: "monarch", showAt: 4 },
      { from: "tao", to: "mc", showAt: 5 },
      { from: "mc", to: "gorilla", showAt: 5 },
      { from: "reader", to: "zanz", showAt: 6 }
    ],
    steps: [
      {
        title: "A paper is a forced tradeoff",
        text: "Facebook's profile read also pulls friends, likes, and the feed. Sharding that key space makes the aggregate worse, so they replicated it and lived with lag. Every paper on this list is that kind of choice.",
        highlight: ["reader"]
      },
      {
        title: "Files, then tables, then global SQL",
        text: "GFS is the layer. Bigtable versions rows on top of it. Megastore fakes a relational store on Bigtable. Spanner is the strongly consistent global database. DynamoDB is the one the rest of the world can rent.",
        highlight: ["gfs", "bt", "mega", "spanner", "dyn"],
        flows: [{ from: "gfs", to: "spanner", color: "#c084fc", label: "stack" }]
      },
      {
        title: "Batch compute, then a live embedding",
        text: "MapReduce is how commodity machines chew logs. Pregel does the same for graphs and ranking. Monolith is the modern cousin: put each user in n-dimensional space and recommend whoever stands nearby.",
        highlight: ["mr", "pregel", "mono"]
      },
      {
        title: "Locks, then a tree of quorums",
        text: "Chubby is the practical distributed lock: a log and a notification when the lock moves. FlexiRaft refuses a single worldwide majority. India agrees, then its leader talks to the US leader.",
        highlight: ["chubby", "flex", "noteTree"],
        flows: [{ from: "chubby", to: "flex", color: "#fb923c", label: "region vote" }]
      },
      {
        title: "Trace it, then explain the spike",
        text: "Dapper samples a request across hundreds of services instead of logging every line. Minesweeper finds the correlated cause of an anomaly. Monarch must still answer after the database it watches has died.",
        highlight: ["dapper", "mine", "monarch"],
        flows: [{ from: "dapper", to: "monarch", color: "#22d3ee", label: "signal" }]
      },
      {
        title: "The social graph and the hot cache",
        text: "TAO keeps the social graph in memory because ordinary tables did not. Memcache is the paper of small practical calls, including replicate-over-shard. Gorilla is Facebook's metrics cache: recent points matter most.",
        highlight: ["tao", "mc", "gorilla"]
      },
      {
        title: "Zanzibar is the one to start with",
        text: "The authorization model is short. The paper is the rate limiting, fault tolerance, and freshness work required at billions of checks a day. Read it for the optimizations, not for a new ACL theory.",
        highlight: ["zanz", "noteTop"],
        flows: [{ from: "reader", to: "zanz", color: "#facc15", label: "rank 1" }]
      }
    ]
  }
});
