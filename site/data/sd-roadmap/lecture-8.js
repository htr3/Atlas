window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 8,
  title: "Multi-Leader Replication, Conflict Resolution, and PITR",
  video: "",
  category: "Data Modeling",
  tagline: "Two writable regions need a conflict story; PITR is how you undo a bad day.",
  summary: "Single-leader replication is the Spring default: writes to a primary, reads maybe to replicas, failover is promotion. Multi-leader (or multi-primary) lets two regions accept writes so a WAN RTT is not on the checkout path. The cost is conflicts: the same row updated in Mumbai and Virginia. Last-write-wins, merge functions, CRDTs, or 'avoid the conflict' (row affinity) are the menu. Point-in-time recovery replays WAL to a timestamp before the bad migration or DELETE. None of this is Hibernate magic — it is topology you operate.",

  theory: [
    {
      heading: "Single leader, recap",
      body: "One primary takes writes. Async replicas apply WAL. Spring can route <code>readOnly</code> transactions to a replica (read-replica URL, or a routing DataSource). Failover: promote a replica, update DNS/VIP, flush Hikari. You already accepted replica lag in lecture 1's throughput story. This topology has one write region. Cross-region writes pay a WAN round trip to the primary — fine until India checkout p99 is the primary in us-east-1.",
      bullets: [
        "Synchronous replica: commit waits for a second disk. Safer, slower.",
        "Async replica: commit is fast; a crash can lose the last milliseconds of WAL.",
        "Split-brain if two nodes think they are primary — fencing is mandatory."
      ]
    },
    {
      heading: "Why anyone wants two leaders",
      body: "Active-active regions: each city writes locally. Mobile latency drops. A region outage does not freeze writes worldwide. Collaboration products (docs, shopping carts edited on two continents) want this. Multi-leader in Postgres is not a checkbox — you use BDR, an application-level dual-write, or a store that was built for it (Cassandra, Dynamo-style, Cockroach in a different consistency model). Spring services stay stateless; the hard part is the data.",
      bullets: [
        "If users are sharded by region and never collide, you wanted geo-partitioning, not multi-leader.",
        "If they do collide, you are in conflict-resolution land."
      ]
    },
    {
      heading: "Conflicts are the product",
      body: "Two leaders commit updates to order 42. Last-write-wins (LWW) uses a timestamp or version vector and silently drops one edit — clocks lie, so users lose data. Application merge: 'qty is max', 'addresses concatenate', 'status uses a state machine.' CRDTs (counters, sets, maps) merge mathematically so replicas converge; they constrain what you can store. Avoidance: sticky a cart to one region, or assign each row an owner. Idempotency keys still apply — a retried POST must not create two orders that then 'merge.'",
      bullets: [
        "LWW is honest only when losing an edit is acceptable (telemetry, last-seen cursor).",
        "Money and inventory almost never want LWW. Prefer single-leader or explicit reservations.",
        "Store both versions and flag for a human when the domain cannot merge."
      ]
    },
    {
      heading: "How a Spring app participates",
      body: "An outbox table in the local primary captures the write; a Debezium/CDC stream ships it to the other region; a consumer applies with a merge function. Or you write to a global log (Kafka) and materialize locally. Hibernate @Version across regions needs a defined winner or it just throws forever. Transactional outbox plus idempotent consumers is the pattern that survives retries. Do not open a XA/2PC across two regional Postgres as your first idea.",
      bullets: [
        "Clock skew: prefer logical clocks (version vectors) over wall-clock LWW.",
        "Delete vs update is a conflict type (tombstones) — define it.",
        "Unique constraints (email) plus two leaders = two inserts, then a constraint fight on replicate."
      ]
    },
    {
      heading: "PITR: rewind the WAL",
      body: "Postgres continuous archiving copies WAL to object storage. Point-in-time recovery restores a base backup and replays WAL until a timestamp or transaction id — 'one minute before that DELETE FROM orders.' This is not a replica. It is a new cluster you promote after a human decision. RPO is how much WAL you can lose (archive lag). RTO is how long restore takes (base size + replay). Spring apps must be able to point at the recovered VIP; Hikari will need a restart or failover. PITR does not undo an already replicated bad write in a multi-leader mesh unless you restore every leader and cut the stream — practice that drill.",
      bullets: [
        "Test restore, not only backup. An untested archive is a rumor.",
        "A logical dump (pg_dump) is not PITR; it has no 'time travel.'",
        "Hold WAL long enough to notice the bug (hours to days), not minutes."
      ]
    },
    {
      heading: "When to refuse multi-leader",
      body: "Checkout, payments, and inventory with strict uniqueness: stay single-leader or strictly partition by customer-id with no cross-partition tx. Multi-leader is for presence, comments, shopping-list merge, multiplayer state, and some CRM fields. Interview default: single primary per cluster, replicas for reads, PITR for operator error, regional partitions if latency demands it — escalate to multi-leader only when you can name the merge."
    }
  ],

  keyTerms: [
    { term: "Single-leader", def: "One writable primary; replicas apply WAL. Spring writes always target the primary." },
    { term: "Multi-leader", def: "Two or more writable replicas that replicate to each other. Conflicts become possible." },
    { term: "LWW", def: "Last-write-wins: keep the update with the later timestamp or version, drop the other." },
    { term: "CRDT", def: "Data type whose merge is commutative; replicas converge without a coordinator." },
    { term: "Version vector", def: "Per-replica counters that detect concurrent edits better than wall clocks." },
    { term: "WAL archive", def: "Shipped write-ahead logs used to reconstruct any point after a base backup." },
    { term: "PITR", def: "Restore base backup + replay WAL to a timestamp before the incident." },
    { term: "RPO / RTO", def: "How much data you can lose vs how long until the app is up on the restored cluster." }
  ],

  tradeoffs: [
    { pro: "Local-region writes cut checkout RTT versus a remote primary.", con: "Every overlapping row now needs a merge policy or you silently drop edits." },
    { pro: "LWW is trivial to implement.", con: "Clocks lie and users lose the other continent's work." },
    { pro: "CRDTs converge without human drama.", con: "Your domain (money, SKU qty) may not be a CRDT without lying." },
    { pro: "PITR undoes a bad DELETE or migration without rebuilding from scratch.", con: "Replay time plus 'stop the world' while you decide the timestamp is not instant." }
  ],

  interviewTips: [
    "Default to single-leader plus replicas. Multi-leader only after you name a conflict policy.",
    "Never say LWW for balances or inventory. Say row affinity or a reservation in one region.",
    "PITR is the answer to 'someone ran DELETE without WHERE' — not 'we have a replica.'",
    "State RPO/RTO when you mention backups. Backup without tested restore is theater.",
    "If two regions must both write, draw outbox/CDC and an idempotent merge consumer.",
    "Split-brain: two primaries after a net split is worse than downtime. Mention fencing."
  ],

  scene: {
    nodes: [
      { id: "inUser", label: "Mumbai user", type: "phone", pos: [-11, 0, -4] },
      { id: "usUser", label: "Virginia user", type: "user", pos: [-11, 0, 4] },
      { id: "inZ", label: "ap-south-1", type: "zone", pos: [-2, 0, -4], size: [8, 4.5] },
      { id: "usZ", label: "us-east-1", type: "zone", pos: [-2, 0, 4], size: [8, 4.5] },
      { id: "inApp", label: "Spring IN", type: "server", pos: [-4, 0, -4] },
      { id: "usApp", label: "Spring US", type: "server", pos: [-4, 0, 4] },
      { id: "inDb", label: "Leader IN", type: "db", pos: [0.5, 0, -4] },
      { id: "usDb", label: "Leader US", type: "db", pos: [0.5, 0, 4] },
      { id: "n_sl", label: "Single leader: WAN write", type: "note", pos: [-2, 3.4, -7.5] },
      { id: "n_cf", label: "Conflict on order 42", type: "note", pos: [7, 3.4, -7.5], showAt: 3 },
      { id: "lww", label: "LWW drop", type: "point", pos: [7, 0, 0], showAt: 4 },
      { id: "merge", label: "Merge fn", type: "worker", pos: [7, 0, 4], showAt: 5 },
      { id: "cdc", label: "CDC / outbox", type: "queue", pos: [7, 0, -4], showAt: 2 },
      { id: "s3", label: "WAL archive", type: "storage", pos: [7, 0, 6.5], showAt: 6 },
      { id: "pitr", label: "PITR replica", type: "db", pos: [11, 0, 2], showAt: 7 },
      { id: "n_pitr", label: "Replay to 12:04:00", type: "note", pos: [7, 3.4, 7.5], showAt: 7 }
    ],
    edges: [
      { from: "inUser", to: "inApp" },
      { from: "usUser", to: "usApp" },
      { from: "inApp", to: "inDb" },
      { from: "usApp", to: "usDb" },
      { from: "usApp", to: "inDb", label: "WAN", dashed: true },
      { from: "inDb", to: "cdc", showAt: 2 },
      { from: "cdc", to: "usDb", showAt: 2, dashed: true },
      { from: "usDb", to: "cdc", showAt: 2, dashed: true },
      { from: "cdc", to: "inDb", showAt: 2, dashed: true },
      { from: "inDb", to: "lww", showAt: 4 },
      { from: "usDb", to: "lww", showAt: 4 },
      { from: "inDb", to: "merge", showAt: 5 },
      { from: "usDb", to: "merge", showAt: 5 },
      { from: "inDb", to: "s3", label: "WAL", showAt: 6 },
      { from: "s3", to: "pitr", showAt: 7 }
    ],
    steps: [
      {
        title: "Single leader, cross-ocean write",
        text: "Both apps used to write to Leader IN. Virginia checkout pays a WAN RTT. Replica lag in the US is fine for reads, not for the INSERT.",
        highlight: ["usUser", "usApp", "inDb", "n_sl", "inApp"],
        flows: [
          { from: "usUser", to: "usApp", color: "#4ade80", label: "POST" },
          { from: "usApp", to: "inDb", color: "#fb923c", label: "WAN write" }
        ]
      },
      {
        title: "Promote a second leader",
        text: "Each region gets a writable Postgres. Mumbai writes locally; Virginia writes locally. Latency is fixed. Replication must now run both ways.",
        highlight: ["inZ", "usZ", "inDb", "usDb", "inApp", "usApp"],
        flows: [
          { from: "inApp", to: "inDb", color: "#4ade80", label: "local" },
          { from: "usApp", to: "usDb", color: "#4ade80", label: "local" }
        ]
      },
      {
        title: "CDC ships each commit",
        text: "An outbox/CDC stream carries IN's WAL-equivalent to US and back. Spring consumers apply remotely. Idempotency keys keep retries from doubling orders.",
        highlight: ["cdc", "inDb", "usDb"],
        flows: [
          { from: "inDb", to: "cdc", color: "#c084fc", label: "outbox" },
          { from: "cdc", to: "usDb", color: "#c084fc", label: "apply" },
          { from: "usDb", to: "cdc", color: "#c084fc", label: "outbox" }
        ]
      },
      {
        title: "The same order 42 is edited twice",
        text: "Mumbai changes the address; Virginia changes the quantity before either replicate lands. That is a concurrent write — a conflict, not a bug in Spring.",
        highlight: ["inDb", "usDb", "n_cf", "inUser", "usUser"],
        flows: [
          { from: "inApp", to: "inDb", color: "#4ade80", label: "addr" },
          { from: "usApp", to: "usDb", color: "#4ade80", label: "qty" }
        ]
      },
      {
        title: "LWW drops one edit",
        text: "Last-write-wins keeps Virginia's timestamp and throws away Mumbai's address. Clocks were skewed. Fine for a last-seen cursor; unacceptable for a shipping address.",
        highlight: ["lww", "inDb", "usDb", "n_cf"],
        fail: ["inDb"],
        flows: [
          { from: "inDb", to: "lww", color: "#f87171", label: "addr lost" },
          { from: "usDb", to: "lww", color: "#fb923c", label: "qty wins" }
        ]
      },
      {
        title: "Merge function or CRDT",
        text: "A domain merge keeps address from IN and qty from US, or a CRDT set unions both. Money still should not live here. Prefer row affinity when you can.",
        highlight: ["merge", "inDb", "usDb"],
        flows: [
          { from: "inDb", to: "merge", color: "#60a5fa", label: "addr" },
          { from: "usDb", to: "merge", color: "#60a5fa", label: "qty" }
        ]
      },
      {
        title: "Someone DELETEs orders",
        text: "A bad script lands on the IN leader and replicates. Replicas are not a time machine — they happily apply the DELETE. You need WAL you archived before the incident.",
        highlight: ["inDb", "s3", "cdc"],
        fail: ["inDb"],
        flows: [
          { from: "inDb", to: "s3", color: "#fb923c", label: "WAL" },
          { from: "inDb", to: "cdc", color: "#f87171", label: "DELETE" }
        ]
      },
      {
        title: "PITR to 12:04, then re-point Spring",
        text: "Restore base backup, replay WAL until 12:04:00, promote that cluster, point the VIP. RPO is archive lag; RTO is restore+replay. Practice this or you do not have it.",
        highlight: ["s3", "pitr", "n_pitr", "inApp"],
        flows: [
          { from: "s3", to: "pitr", color: "#4ade80", label: "replay" },
          { from: "inApp", to: "pitr", color: "#60a5fa", label: "new VIP" }
        ]
      }
    ]
  }
});
