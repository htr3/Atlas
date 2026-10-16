window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 7,
  title: "What is Database Sharding?",
  video: "https://www.youtube.com/watch?v=5faMjKuB9bc",
  category: "Data & Storage",
  tagline: "Split the pizza by a key so each database server eats one slice.",
  summary: "Sharding is horizontal partitioning of a database: pick an attribute, cut the rows into ranges, and give each range to its own database server. The lecture uses a pizza shared among eight friends, then covers shard-key choice, cross-shard joins, hierarchical splits when slices get inflexible, secondary indexes, and master-slave failover. Indexing or a managed NoSQL store should come before you shard yourself.",

  theory: [
    {
      heading: "When query tricks are not enough",
      body: "A slow database tempts you to tune the optimizer, add an index, or jump to NoSQL. Those are real tools, but they do not change the fact that one machine can only hold and serve so much. When the table is huge, you need to <b>partition the data itself</b> across database servers, not just speed up a single box.",
      bullets: [
        "Indexes and query plans help one machine; they do not add machines",
        "Application servers try to stay stateless; database servers own the durable state",
        "Consistency on that state matters more than almost anything else you will tune"
      ]
    },
    {
      heading: "The pizza and eight friends",
      body: "You cannot eat the whole pizza, so you slice it and call friends. Each friend gets one slice. Map user ids onto that pizza: ids 0-99 land on one slice, 100-199 on the next, and so on. Server 6 owns its range and only that range. That cut, driven by one attribute of the row, is <b>horizontal partitioning</b>. Contrast <b>vertical partitioning</b>, which splits by columns. Sharding here means: one key, many row-ranges, many database servers.",
      bullets: [
        "Friends = database servers, not app servers",
        "The shard key is an attribute of the stored row (user id, location, ...)",
        "Each shard is a smaller, faster, easier-to-maintain database"
      ]
    },
    {
      heading: "Pick the key that matches the query",
      body: "User id is the default mental model, but a location product (the lecture uses a Tinder-like example) should shard on location. \"Find people near X\" then hits one shard instead of a scatter-gather. The win is that both reads and writes for a typical request land on one machine, so latency drops because the working set is smaller.",
      bullets: [
        "Choose the key from the query you must make fast",
        "A location shard answers \"users in cell X\" without talking to the other seven",
        "Wrong key turns every request into a fan-out"
      ]
    },
    {
      heading: "Cross-shard joins and inflexible slices",
      body: "If a query needs rows from two shards, each shard answers, then you join over the network. That is expensive; design so the common path never does it. Fixed ranges are also inflexible: you cannot magically add a ninth slice to an already-cut pizza. <b>Consistent hashing</b> (used with clients of stores like Memcached) helps membership change. Another fix is <b>hierarchical sharding</b>: treat a hot slice as its own pizza, split it, and put a manager in front that maps a request onto the mini-slices.",
      bullets: [
        "Joins across shards pull data over the network, then combine it",
        "Static ranges make adding or removing servers painful",
        "Split a hot shard instead of recutting the whole pie"
      ]
    },
    {
      heading: "Indexes inside a shard, replicas around a shard",
      body: "Once New York lives on one shard, an index on age answers \"people in New York older than 50\" without scanning the world. If a shard dies (power loss in the lecture), run <b>master-slave</b>: writes go to the master, slaves pull a copy, reads can spray across slaves. If the master dies, the slaves elect a new one. You bought failure tolerance, not a second source of truth.",
      bullets: [
        "Secondary indexes are local to a shard and still worth building",
        "Writes: master. Reads: slaves. Failover: elect a new master",
        "Sharding raises write and read throughput because each request usually hits one place"
      ]
    },
    {
      heading: "Do not shard first",
      body: "Conceptually sharding is \"cut ranges, store them apart.\" In production, keeping those ranges consistent is hard. Before you invent a sharded cluster, try indexes, and consider a NoSQL system that already shards internally. Roll your own only after those cheaper levers are exhausted."
    }
  ],

  keyTerms: [
    { term: "Sharding", def: "Horizontal partitioning of rows across database servers using one key." },
    { term: "Shard key", def: "The attribute (user id, location, ...) that decides which server owns a row." },
    { term: "Horizontal vs vertical", def: "Horizontal splits rows; vertical splits columns of the same table." },
    { term: "Hierarchical sharding", def: "Split a hot shard into mini-shards and route through a manager instead of recutting the whole keyspace." },
    { term: "Cross-shard join", def: "A query that must fetch from two or more shards and join the results on the network." },
    { term: "Master-slave", def: "One writable primary with replicas that copy it; reads can fan out; failover elects a new primary." },
    { term: "Consistent hashing", def: "A ring-based placement so adding or removing a server moves only a fraction of keys." }
  ],

  tradeoffs: [
    { pro: "Each shard is smaller, so typical reads and writes get faster", con: "Queries that span shards pay a network join" },
    { pro: "You can pick a key (location, user id) that matches the product", con: "The wrong key turns every lookup into scatter-gather" },
    { pro: "Hierarchical splits and consistent hashing restore flexibility", con: "You now run a routing layer and rebalancing, not just SQL" },
    { pro: "Master-slave gives a shard a failover path and extra read capacity", con: "Writes still serialize on the master; replicas can be slightly behind" }
  ],

  interviewTips: [
    "Say sharding is horizontal partitioning of the database, not of stateless app servers.",
    "Name the shard key from the hottest query (user id vs geo cell) and explain why other queries might suffer.",
    "Call out cross-shard joins as the cost you are accepting, and design the common path to avoid them.",
    "For hot shards, propose splitting that range (hierarchical) rather than recutting the whole table.",
    "Mention master-slave (or a replica set) per shard for crash tolerance, and say you would try indexes or a managed store before DIY sharding."
  ],

  scene: {
    nodes: [
      { id: "pizza", label: "User-id pizza", type: "zone", pos: [0, 0, 0], size: [12, 12] },
      { id: "you", label: "You (too much)", type: "user", pos: [-11, 0, 0] },

      { id: "s0", label: "Shard 0: 0-99", type: "db", pos: [-3.5, 0, -4] },
      { id: "s1", label: "Shard 1: 100s", type: "db", pos: [0, 0, -5.5] },
      { id: "s2", label: "Shard 2: 200s", type: "db", pos: [3.5, 0, -4] },
      { id: "s3", label: "Shard 3: 300s", type: "db", pos: [5.5, 0, 0] },
      { id: "s4", label: "Shard 4: 400s", type: "db", pos: [3.5, 0, 4] },
      { id: "s5", label: "Shard 5: 500s", type: "db", pos: [0, 0, 5.5] },
      { id: "s6", label: "Shard 6: 600s", type: "db", pos: [-3.5, 0, 4] },
      { id: "s7", label: "Shard 7: 700s", type: "db", pos: [-5.5, 0, 0] },

      { id: "uid0", label: "id 0", type: "point", pos: [-3.5, 1.2, -4], color: "#4ade80" },
      { id: "uid100", label: "id 100", type: "point", pos: [0, 1.2, -5.5], color: "#60a5fa" },
      { id: "uid200", label: "id 200", type: "point", pos: [3.5, 1.2, -4], color: "#fb923c" },
      { id: "noteFriends", label: "8 friends, 8 slices", type: "note", pos: [0, 4.5, -7], showAt: 1 },

      { id: "locX", label: "Cell X users", type: "point", pos: [3.5, 1.6, 4], color: "#c084fc", showAt: 3 },
      { id: "app", label: "Location app", type: "service", pos: [-11, 0, 4], showAt: 3 },
      { id: "noteGeo", label: "Shard on location, not user id", type: "note", pos: [8, 4, 4], showAt: 3 },

      { id: "joinNote", label: "Join over the network = expensive", type: "note", pos: [0, 4.5, 7], showAt: 4 },

      { id: "hotZone", label: "Hot slice magnified", type: "zone", pos: [9, 0, -5], size: [5.5, 5], showAt: 5 },
      { id: "mgr", label: "Shard manager", type: "lb", pos: [7.5, 0, -5], showAt: 5 },
      { id: "mini1", label: "Mini A", type: "db", pos: [10.5, 0, -6.5], showAt: 5 },
      { id: "mini2", label: "Mini B", type: "db", pos: [10.5, 0, -3.5], showAt: 5 },
      { id: "noteHier", label: "Hierarchical split of one slice", type: "note", pos: [9, 4, -8], showAt: 5 },

      { id: "idx", label: "Index: age > 50", type: "note", pos: [3.5, 3.5, 6.5], showAt: 6 },
      { id: "nyc", label: "NYC shard", type: "db", pos: [8, 0, 5], showAt: 6, color: "#60a5fa" },

      { id: "master", label: "Master", type: "db", pos: [-10, 0, -5], showAt: 7 },
      { id: "sl1", label: "Slave A", type: "db", pos: [-7, 0, -6.5], showAt: 7 },
      { id: "sl2", label: "Slave B", type: "db", pos: [-7, 0, -3.5], showAt: 7 },
      { id: "noteMS", label: "Writes to master, reads to slaves", type: "note", pos: [-8.5, 4, -8], showAt: 7 }
    ],
    edges: [
      { from: "you", to: "s0", dashed: true },
      { from: "you", to: "s6", dashed: true, showAt: 1 },
      { from: "app", to: "s4", label: "users in X", showAt: 3 },
      { from: "s2", to: "s4", label: "join", showAt: 4, dashed: true },
      { from: "mgr", to: "mini1", showAt: 5 },
      { from: "mgr", to: "mini2", showAt: 5 },
      { from: "s3", to: "mgr", showAt: 5, dashed: true },
      { from: "app", to: "nyc", label: "NYC + age", showAt: 6 },
      { from: "master", to: "sl1", label: "replicate", showAt: 7 },
      { from: "master", to: "sl2", label: "replicate", showAt: 7 }
    ],
    steps: [
      {
        title: "Too much pizza for one person",
        text: "One database cannot chew the whole table, the same way you cannot eat the whole pie. Indexes help; they do not add mouths.",
        highlight: ["you", "s0"],
        hide: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "uid100", "uid200", "noteFriends", "locX", "app", "noteGeo", "joinNote", "hotZone", "mgr", "mini1", "mini2", "noteHier", "idx", "nyc", "master", "sl1", "sl2", "noteMS"],
        flows: [
          { from: "you", to: "s0", color: "#f87171", label: "overload" }
        ]
      },
      {
        title: "Eight friends, eight ranges",
        text: "User id 0 starts on one slice, 100 on the next, 200 after that. Each database server owns a chunk. That is horizontal partitioning: one key, many row ranges. Server 6 is just another friend with its own slice.",
        highlight: ["s0", "s1", "s2", "s6", "noteFriends", "uid0", "uid100", "uid200"],
        hide: ["locX", "app", "noteGeo", "joinNote", "hotZone", "mgr", "mini1", "mini2", "noteHier", "idx", "nyc", "master", "sl1", "sl2", "noteMS"],
        flows: [
          { from: "you", to: "s0", color: "#4ade80", label: "id 0" },
          { from: "you", to: "s6", color: "#4ade80", label: "id 600" }
        ]
      },
      {
        title: "App servers stay thin; DBs own state",
        text: "The boxes on the pizza are database servers. App servers try to be stateless. Here, consistency (write then a later read sees it) usually outranks availability. Do not goof the source of truth.",
        highlight: ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "pizza"],
        hide: ["locX", "app", "noteGeo", "joinNote", "hotZone", "mgr", "mini1", "mini2", "noteHier", "idx", "nyc", "master", "sl1", "sl2", "noteMS"],
        flows: []
      },
      {
        title: "Shard on the query you care about",
        text: "A location product shards on geography. \"Find users in cell X\" lands on one shard (here the 400s slice) instead of scanning every friend. Smaller shard, faster scan, happier latency.",
        highlight: ["app", "s4", "locX", "noteGeo"],
        hide: ["joinNote", "hotZone", "mgr", "mini1", "mini2", "noteHier", "idx", "nyc", "master", "sl1", "sl2", "noteMS", "noteFriends"],
        flows: [
          { from: "app", to: "s4", color: "#c084fc", label: "near X" }
        ]
      },
      {
        title: "Joins across slices hurt",
        text: "Need rows from two shards? Both answer, then you join over the network. That is the first tax of sharding. Keep the common query inside one slice.",
        highlight: ["s2", "s4", "joinNote"],
        hide: ["hotZone", "mgr", "mini1", "mini2", "noteHier", "idx", "nyc", "master", "sl1", "sl2", "noteMS", "noteGeo", "locX"],
        flows: [
          { from: "s2", to: "s4", color: "#fb923c", label: "join" }
        ]
      },
      {
        title: "A hot slice becomes its own pizza",
        text: "Fixed ranges cannot grow a ninth slice. Magnify the overloaded shard, cut it into mini-slices, and put a manager in front. Hierarchical sharding restores flexibility without recutting the whole pie. Consistent hashing is the other way to add servers.",
        highlight: ["mgr", "mini1", "mini2", "noteHier", "s3"],
        hide: ["joinNote", "idx", "nyc", "master", "sl1", "sl2", "noteMS", "noteGeo", "locX"],
        flows: [
          { from: "s3", to: "mgr", color: "#fb923c", label: "too full" },
          { from: "mgr", to: "mini1", color: "#4ade80", label: "half" },
          { from: "mgr", to: "mini2", color: "#4ade80", label: "half" }
        ]
      },
      {
        title: "Index inside the shard",
        text: "New York already lives on one shard. Index age there and \"NYC, age > 50\" is a local index lookup, not a global scan. Reads and writes both get faster when the query pins to one place.",
        highlight: ["nyc", "idx", "app"],
        hide: ["hotZone", "mgr", "mini1", "mini2", "noteHier", "master", "sl1", "sl2", "noteMS", "joinNote", "noteGeo", "locX"],
        flows: [
          { from: "app", to: "nyc", color: "#60a5fa", label: "age > 50" }
        ]
      },
      {
        title: "Shard dies: master and slaves",
        text: "Power fails on a shard. Writes always hit the master; slaves pull copies and can serve reads. If the master dies, slaves elect a replacement. That is how you keep a slice available without a single disk as destiny.",
        highlight: ["master", "sl1", "sl2", "noteMS"],
        fail: ["s5"],
        hide: ["hotZone", "mgr", "mini1", "mini2", "noteHier", "idx", "nyc", "joinNote", "noteGeo", "locX"],
        flows: [
          { from: "master", to: "sl1", color: "#c084fc", label: "copy" },
          { from: "master", to: "sl2", color: "#c084fc", label: "copy" }
        ]
      },
      {
        title: "Shard last, not first",
        text: "The idea is simple; keeping shards consistent is not. Try indexes. Prefer a store that already shards. Then, if you still must, cut the pizza.",
        highlight: ["pizza", "s0", "s3", "s6"],
        hide: ["hotZone", "mgr", "mini1", "mini2", "noteHier", "idx", "nyc", "master", "sl1", "sl2", "noteMS", "joinNote", "noteGeo", "locX", "app"],
        flows: []
      }
    ]
  }
});
