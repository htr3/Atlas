window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 13,
  title: "Introduction to NoSQL databases",
  video: "https://www.youtube.com/watch?v=xQnIN9bW0og",
  category: "Data & Storage",
  tagline: "Keep the whole document together — then hash, replicate, and quorum it.",
  summary: "NoSQL is not “what you use when you scale.” YouTube and Stack Overflow still sit on relational engines. Document stores win when you insert and fetch a whole blob, the schema flexes, and you want built-in sharding plus aggregations. They lose on updates, ACID, skinny column reads, and joins. Cassandra is the worked example: consistent hashing on a five-node ring, clockwise replicas, quorum, memtable to immutable SSTables, compaction, and tombstones.",

  theory: [
    {
      heading: "Scale is not a NoSQL requirement",
      body: "The lecture opens by killing a slogan: toy apps use SQL, serious scale uses NoSQL. False. YouTube, Stack Overflow, and Instagram are called out as systems that did not need a document store to grow; WhatsApp is joked as not having a database at all. Use NoSQL when the <b>access pattern</b> matches, not when the slide says “billions of users.”",
      bullets: [
        "Pick the model from reads/writes, not from hype.",
        "Plenty of huge systems are still relational."
      ]
    },
    {
      heading: "Row plus foreign key vs one JSON blob",
      body: "A person has id, name, address, age, role. In SQL, address is a second table keyed by <code>address_id</code> (Munich, Germany; district null). In NoSQL the same person is <b>one nested document</b>: name, an address object, age, role. Null district is simply omitted. Inserts usually arrive with every field at once; reads are usually “give me this user” (<code>SELECT *</code> is the common habit). If you always write and read the whole record, storing it as one block avoids the join and the extra pointer chase across columns.",
      bullets: [
        "Co-locate fields that are born and fetched together.",
        "Nested objects replace foreign keys for that access path.",
        "Skipping nulls is free when there is no rigid row layout."
      ]
    },
    {
      heading: "Flexible schema, horizontal scale, aggregations",
      body: "Adding <b>salary</b> in SQL is an <code>ALTER TABLE</code> with locks and a consistency scare. In a document store, new users just grow a new field; old documents never heard of salary and that is fine. Most NoSQL engines assume heavy scale, so <b>horizontal partitioning is built in</b> (see the sharding lecture) and they lean toward availability. They are also shaped for metrics — average age, sum of salary — because analytics is a typical reason you dumped events into a blob store.",
      bullets: [
        "Schema change is a write of a richer document, not a table rewrite.",
        "Availability-oriented partitioning is the default mindset.",
        "Aggregations are a first-class reason to pick this family."
      ]
    },
    {
      heading: "Where documents hurt",
      body: "Lots of in-place updates are a poor fit. Two replicas of the same id can disagree; you do not get SQL’s ACID blanket, which is why ledgers stay relational. Reads of a single field (every employee’s age) scan whole documents then peel the field off — slower than walking one SQL column. Relations are not implicit: no foreign-key constraint says address 23 must exist. Joins across two document collections are manual nested loops. SQL is built for those joins; NoSQL is not.",
      bullets: [
        "Write-optimized and whole-document, not update-optimized or column-optimized.",
        "No implicit relations, no cheap joins, no full ACID transactions.",
        "Use it when the blob is the unit of work and updates are rare."
      ]
    },
    {
      heading: "Cassandra: hash onto a ring",
      body: "Five nodes own ranges: 0–100, 100–200, 200–300, 300–400, 400–500. Keys are not always numeric — a UUID or a name is hashed. <code>h(123) = 256</code> lands in 200–300; the lecture then walks <b>clockwise</b> and stores on <b>node 4</b>. A uniform hash keeps ~20% of keys on each node so the cluster saturates together. A terrible hash (everything &gt; 100 → bucket 1) piles 80% of 0–500 onto one node; when that node melts, the cluster is “full.” If you cannot change the hash, add a <b>second layer</b>: the hot node forwards into another five-node cluster with a better hash (multi-level sharding). Google Maps hashing only on country id has the same hotspot on a festival; country then region is the two-layer fix — not elegant, but it survives.",
      bullets: [
        "Token = hash(key), owner = clockwise successor on the ring.",
        "Bad hash → one hot replica → the whole cluster looks overloaded.",
        "A second hash level is a crutch when the first key is skewed."
      ]
    },
    {
      heading: "Replicas, quorum, and a rare lie",
      body: "Do not keep a key only on its primary. Copy clockwise: land on 2 → also 3; land on 5 → also 1 (and with RF=3, 5, 1, and 2). Any replica can serve a read; a missed write on one replica can still succeed on another. That is load balancing plus redundancy. <b>Quorum</b> is how they agree. RF=3, quorum=2: a majority must share a value (or the newest timestamp wins a 1-vs-1). If you wrote on 5 and 5 dies before 1 and 2 applied the write, both voters say “no profile” and the app returns user-not-found — wrong, but rare. Asking for quorum=3 with 5 down fails the query instead (safer, less available). Cassandra would rather stay available and occasionally be briefly wrong than block. Deeper consensus (Paxos, gossip) is a later lecture; picture nodes sending votes to a counter that can itself fail.",
      bullets: [
        "RF copies clockwise; reads can hit any copy.",
        "Quorum = majority of RF. Q=2 with RF=3 is the usual availability bet.",
        "Prefer “database error / retry” over silently inventing “user missing.”"
      ]
    },
    {
      heading: "Memtable, SSTables, compaction, tombstones",
      body: "A write is appended sequentially in memory (a commit log / memtable) — O(1) to the current tip, no seek. Periodically that buffer flushes to an immutable <b>sorted string table</b> (SSTable) on disk, keys sorted, idea borrowed from Google Bigtable. Updates to key 123 become a <i>new</i> row in a newer SSTable; old copies remain. Reads pick the latest timestamp. Space bloat is the problem, so a background <b>compaction</b> merge-sorts SSTables and keeps the newest value (linear time, small extra space). Deletes are not holes — they are <b>tombstones</b>. If the newest version of a key is a tombstone, the record is dead; a later “update” should fail as not found. Elasticsearch and DynamoDB share this LSM-shaped story.",
      bullets: [
        "Sequential write + immutable flush = fast ingest.",
        "Immutability implies duplicates; compaction reclaims them.",
        "Tombstones are how an append-only world represents delete."
      ]
    }
  ],

  keyTerms: [
    { term: "Document / blob", def: "Self-contained nested record (JSON) stored and fetched as one unit." },
    { term: "Flexible schema", def: "New fields appear on new writes; old documents need no migration or table lock." },
    { term: "Consistent hashing", def: "hash(key) maps onto a ring; the clockwise node owns that token." },
    { term: "Replication factor (RF)", def: "How many clockwise nodes store a copy of each key." },
    { term: "Quorum", def: "Minimum replica votes (often majority) before a read or write is accepted." },
    { term: "Memtable", def: "In-memory sequential log of recent writes waiting to flush." },
    { term: "SSTable", def: "Immutable on-disk file of sorted keys, flushed from the memtable (Bigtable lineage)." },
    { term: "Compaction", def: "Merging SSTables to drop stale versions of the same key and reclaim disk." },
    { term: "Tombstone", def: "A delete marker with a timestamp; the newest tombstone makes the key dead." }
  ],

  tradeoffs: [
    { pro: "Whole-document insert and fetch skip joins and match how APIs usually send a user.", con: "A skinny read (all ages) still loads every blob; column stores / SQL win there." },
    { pro: "Schema can grow field-by-field without ALTER TABLE locks.", con: "No foreign keys, no implicit relations, joins become application code." },
    { pro: "Built-in hashing, replicas, and quorum scale writes and keep reads fast.", con: "ACID transactions are gone; two nodes can disagree on the same id." },
    { pro: "LSM writes (memtable → SSTable) are sequential and cheap.", con: "Updates multiply copies until compaction; deletes need tombstones." }
  ],

  interviewTips: [
    "Kill the “scale ⇒ NoSQL” line yourself; then say when the blob access pattern actually fits.",
    "Draw SQL (two tables + FK) beside one nested JSON person so the join cost is visible.",
    "On Cassandra, hash the key, walk clockwise, then place RF copies on the next nodes — that drawing scores well.",
    "State RF and quorum. Explain the rare stale-read if the primary dies before replicas catch up, and why Q=2 is the availability bet.",
    "Name memtable, immutable SSTable, compaction, tombstone in that order for the write path."
  ],

  scene: {
    nodes: [
      { id: "sql_zone", label: "SQL tables", type: "zone", pos: [-9, 0, 5], size: [6, 6] },
      { id: "nosql_zone", label: "NoSQL document", type: "zone", pos: [9, 0, 5], size: [6, 6] },
      { id: "person", label: "Person table", type: "db", pos: [-10.5, 0, 4] },
      { id: "addr", label: "Address table", type: "db", pos: [-7.5, 0, 6] },
      { id: "note_fk", label: "FK join on address_id 23", type: "note", pos: [-9, 2.6, 5] },
      { id: "doc", label: "User JSON blob", type: "storage", pos: [9, 0, 5] },
      { id: "note_json", label: "Nested addr; skip nulls", type: "note", pos: [9, 2.6, 5] },
      { id: "client", label: "Client", type: "user", pos: [0, 0, 7.5] },
      { id: "coord", label: "Coordinator", type: "lb", pos: [0, 0, 0], showAt: 3 },
      { id: "n1", label: "N1 0-100", type: "server", pos: [0, 0, -5.5], showAt: 3 },
      { id: "n2", label: "N2 100-200", type: "server", pos: [5.5, 0, -2], showAt: 3 },
      { id: "n3", label: "N3 200-300", type: "server", pos: [3.5, 0, 4.5], showAt: 3 },
      { id: "n4", label: "N4 300-400", type: "server", pos: [-3.5, 0, 4.5], showAt: 3 },
      { id: "n5", label: "N5 400-500", type: "server", pos: [-5.5, 0, -2], showAt: 3 },
      { id: "note_hash", label: "h(123) = 256 → clockwise N4", type: "note", pos: [0, 3, 0], showAt: 3 },
      { id: "hot", label: "Hot shard (bad hash)", type: "server", pos: [8, 0, -5], showAt: 4, color: "#f87171" },
      { id: "n2b", label: "Layer-2 node", type: "server", pos: [11, 0, -5], showAt: 4 },
      { id: "mem", label: "Memtable / log", type: "cache", pos: [10, 0, 1.5], showAt: 7 },
      { id: "sst1", label: "SSTable (old 123)", type: "storage", pos: [11, 0, 4], showAt: 7 },
      { id: "sst2", label: "SSTable (new 123)", type: "storage", pos: [7.5, 0, -0.5], showAt: 7 },
      { id: "note_tomb", label: "Tombstone = key is dead", type: "note", pos: [10, 3, 2.5], showAt: 8 }
    ],
    edges: [
      { from: "person", to: "addr", label: "address_id", dashed: true },
      { from: "client", to: "person", label: "insert user", showAt: 0 },
      { from: "client", to: "doc", label: "insert blob" },
      { from: "client", to: "coord", label: "key=123", showAt: 3 },
      { from: "coord", to: "n4", label: "token 256", showAt: 3 },
      { from: "hot", to: "n2b", label: "h'(key)", showAt: 4 },
      { from: "n4", to: "n5", label: "replica", showAt: 5 },
      { from: "n5", to: "n1", label: "replica", showAt: 5 },
      { from: "n5", to: "n2", label: "replica", showAt: 5, dashed: true },
      { from: "n1", to: "n2", label: "replica", showAt: 5 },
      { from: "coord", to: "n5", label: "write RF=3", showAt: 6 },
      { from: "client", to: "mem", label: "append", showAt: 7 },
      { from: "mem", to: "sst1", label: "flush", showAt: 7 },
      { from: "mem", to: "sst2", label: "flush later", showAt: 7 },
      { from: "sst1", to: "sst2", label: "compact", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "SQL: person + address",
        text: "A user row points at address_id 23 in another table (Munich, Germany; district is a null column you still store). Every “get user” is a join. That is the relational default.",
        highlight: ["person", "addr", "note_fk", "sql_zone"],
        flows: [
          { from: "client", to: "person", color: "#4ade80", label: "row" },
          { from: "person", to: "addr", color: "#60a5fa", label: "join" }
        ]
      },
      {
        title: "NoSQL: one nested blob",
        text: "The same user is a JSON document: name, nested address, age, role. Null district is omitted. Inserts and typical reads want the whole person, so keeping the blob together is the first efficiency win.",
        highlight: ["doc", "note_json", "nosql_zone"],
        flows: [{ from: "client", to: "doc", color: "#4ade80", label: "JSON" }]
      },
      {
        title: "Schema flex, whole-document I/O",
        text: "Adding salary is a new field on new documents — no table lock. Old users have no salary and that is fine. The cost: an “all ages” query still reads every blob, updates are awkward, and there is no FK to enforce address 23.",
        highlight: ["doc", "person", "addr"],
        flows: [
          { from: "client", to: "doc", color: "#4ade80", label: "salary?" },
          { from: "client", to: "person", color: "#f87171", label: "ALTER" }
        ]
      },
      {
        title: "Five-node ring, hash 256",
        text: "Cassandra owns ranges 0–100 … 400–500. Key 123 hashes to 256 (inside 200–300). Walk clockwise and land on N4. A uniform hash gives each node ~20% of keys so they fill up together.",
        highlight: ["coord", "n1", "n2", "n3", "n4", "n5", "note_hash"],
        hide: ["sql_zone", "person", "addr", "note_fk"],
        flows: [
          { from: "client", to: "coord", color: "#4ade80", label: "123" },
          { from: "coord", to: "n4", color: "#4ade80", label: "256" }
        ]
      },
      {
        title: "Hot hash and a second layer",
        text: "A two-bucket hash dumps most keys on one node; when that node dies the cluster is done. If you cannot hot-swap the hash, the hot node forwards into another cluster with a better hash. Same trick if Maps shards only on country during a festival.",
        highlight: ["hot", "n2b", "n2"],
        hide: ["sql_zone", "person", "addr", "note_fk"],
        fail: ["hot"],
        flows: [
          { from: "coord", to: "hot", color: "#f87171", label: "skew" },
          { from: "hot", to: "n2b", color: "#4ade80", label: "h'" }
        ]
      },
      {
        title: "Clockwise replicas",
        text: "Primary N4 also copies to the next clockwise nodes (N5, N1, …). RF=3 means three copies. Any replica can answer a read; a write that misses one node can still land on another. That is redundancy plus faster reads.",
        highlight: ["n4", "n5", "n1", "n2"],
        hide: ["sql_zone", "person", "addr", "note_fk", "hot", "n2b"],
        flows: [
          { from: "n4", to: "n5", color: "#c084fc", label: "copy" },
          { from: "n5", to: "n1", color: "#c084fc", label: "copy" }
        ]
      },
      {
        title: "Quorum of 2, RF of 3",
        text: "Write profile on N5, N1, N2. N5 crashes before N1/N2 apply it. A later read: both remaining voters say missing → user-not-found, which is wrong but rare. Quorum=3 would fail the query instead. NoSQL here chooses availability over a strict read-your-write.",
        highlight: ["n5", "n1", "n2", "coord", "client"],
        hide: ["sql_zone", "person", "addr", "note_fk", "hot", "n2b"],
        fail: ["n5"],
        flows: [
          { from: "coord", to: "n5", color: "#4ade80", label: "write" },
          { from: "n1", to: "coord", color: "#f87171", label: "miss" },
          { from: "n2", to: "coord", color: "#f87171", label: "miss" }
        ]
      },
      {
        title: "Sequential memtable, immutable SSTables",
        text: "Writes append in memory like a log, then flush to a sorted string table on disk (Bigtable idea). SSTables never mutate. An update to key 123 is a newer row in a newer file; timestamp picks the winner. Fast ingest, growing duplicates.",
        highlight: ["mem", "sst1", "sst2", "client"],
        hide: ["sql_zone", "person", "addr", "note_fk", "hot", "n2b"],
        flows: [
          { from: "client", to: "mem", color: "#4ade80", label: "append" },
          { from: "mem", to: "sst1", color: "#c084fc", label: "flush" },
          { from: "mem", to: "sst2", color: "#c084fc", label: "flush" }
        ]
      },
      {
        title: "Compaction and tombstones",
        text: "Merge SSTables (think merge-sort) to keep the latest 123 and free disk. Deletes write a tombstone; if it has the newest timestamp the key is dead and a later update should error. Same LSM shape shows up in Elasticsearch and DynamoDB.",
        highlight: ["sst1", "sst2", "note_tomb", "mem"],
        hide: ["sql_zone", "person", "addr", "note_fk", "hot", "n2b"],
        flows: [
          { from: "sst1", to: "sst2", color: "#c084fc", label: "merge" }
        ]
      }
    ]
  }
});
