window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 12,
  title: "Gossip Protocol System Design",
  video: "https://www.youtube.com/watch?v=TUc_hPtxyf8",
  category: "Piyush Garg",
  tagline: "Tell three friends. They tell three friends. The cluster learns, eventually.",
  summary: "A single primary database is consistent and a single point of failure. Copies and geo-placed Redis nodes spread load, then break consistency. Master-slave and ZooKeeper-style central state restore a source of truth and recreate a write bottleneck. Point-to-point broadcast is O(n) and can drop a busy node. Eager reliable broadcast rebroadcasts everything and costs O(n²). Gossip — also called epidemic protocol — has each node periodically push state to a random subset, the lecture's \"three best friends\" / fanout 3. Redis and Cassandra use it for cluster membership. You traded strong consistency for availability and got eventual consistency on purpose.",

  theory: [
    {
      heading: "One primary is consistent and fragile",
      body: "The story starts with a <b>primary database</b>. Clients hit servers; servers hit that one DB. Scale the app tier with load balancing and you still have one store. Traffic grows, the DB is overwhelmed, the app is down. Vertical scale — the box that handled <b>4,000</b> users now handles <b>40,000</b> — keeps a single writer, so consistency stays \"on point.\" It is still a <b>single point of failure</b>. A thousand app servers do not save you if the data layer dies. Data that matters needs copies.",
      bullets: [
        "Load balancing servers does not load-balance a single disk.",
        "Bigger hardware delays the crash. It does not remove the crash domain.",
        "This is the lecture's reason to even talk about replication."
      ]
    },
    {
      heading: "A second copy splits the truth",
      body: "Add another database and split load. User A writes the latest value on instance 1. User B reads instance 2 and sees the old value. <b>Consistency broke</b> the moment you had two places that could be behind. Redis's answer in the lecture is to replicate itself: copies for durability and for load. Drop instances near users on a world map — one in the US, one near India, one in Europe — and connect each user to the nearest. Per-instance load drops. The same question returns: if this user updates the India node, how do the others find out?",
      bullets: [
        "Replication without a gossip story is just more stale replicas.",
        "Nearest-region routing is a latency win, not a consistency protocol.",
        "You now have a distributed system. The word earned its keep."
      ]
    },
    {
      heading: "Master-slave: writes through a king",
      body: "<b>Master-slave</b> (leader and followers) picks one instance as leader. Every write goes there. The leader periodically publishes the change to the other Redis nodes. Reads can use the nearest replica. Writes are the critical path; they stay on one box. Propagation takes time, so this is <b>eventual consistency</b>, not a lockstep commit. The leader is still a single point of failure for writes: you can read from copies, you cannot write. Failover elects a new leader and redirects writes. Data survived because it was copied. The write path did not get wider.",
      bullets: [
        "Reads scale with replicas. Writes still serialize on the leader.",
        "Eventual means \"the slaves will catch up,\" not \"the read you just did is the write you just did.\"",
        "Electing a new king is recovery, not a design that never needed a king."
      ]
    },
    {
      heading: "Central state: ZooKeeper, liveness, a bottleneck",
      body: "A <b>centralized state management service</b> (the lecture's Apache Kafka + <b>ZooKeeper</b> example) holds who is alive, who should get which data, and answers <b>service discovery</b>. The leader pings liveness: periodic heartbeats, and a node quiet for about a minute is declared dead and gets no updates. You get <b>strong consistency</b> because there is one place to ask. You also get a single point of failure and a scalability wall: even with many read replicas, writes still land on one instance. That node is the bottleneck. It is doing membership, heartbeats, and fan-out.",
      bullets: [
        "Strong consistency here means \"ask the master for the live set.\"",
        "Heartbeats are how a central brain notices a corpse.",
        "This is the CAP-shaped fork: keep the brain, or stop having one."
      ]
    },
    {
      heading: "P2P state trades consistency for availability",
      body: "The other fork is <b>peer-to-peer state management</b>: every node talks to peers instead of reporting to a master. Redis replicas that only sent data and heartbeats <i>up</i> to a primary become a mesh that exchanges among themselves. There is no king, so losing any one server is fine — that is <b>high availability</b>. Freshness is not instant; you are on eventual consistency again. Small systems may prefer the consistent central service. Large ones need availability more than a perfectly fresh copy. Gossip is how you implement that P2P channel.",
      bullets: [
        "No master to overwhelm. No master to elect.",
        "You are trading consistency for availability. Say the trade out loud.",
        "\"You do not have it yet, but you will\" is the product promise."
      ]
    },
    {
      heading: "Broadcast is O(n) and can lose a node",
      body: "Brute force: when data arrives, send it to every other node. That is <b>point-to-point broadcast</b>, complexity <b>O(n)</b>. A thousand nodes means a thousand sends; a million nodes means a million. Retry sits on the producer; dedup sits on the consumer. If the receiver is already overloaded, the send fails and that node never learns the value — the lecture's diagram leaves one Redis behind. If producer and consumer fail together, the message is gone. Joining the cluster is not the issue yet. Correctness already is.",
      bullets: [
        "O(n) per update, paid by the node that learned first.",
        "A busy peer is a silent hole in the replica set.",
        "This is the \"shout it to the whole college\" plan."
      ]
    },
    {
      heading: "Eager reliable broadcast is O(n²)",
      body: "<b>Eager reliable broadcast</b>: the first node still sends to everyone, then <b>every node that received the message rebroadcasts it at least once</b> to every other node. With six nodes you get the payload at least six times, plus retries. Simultaneous producer and consumer death no longer drops the rumor — a remaining node will replay it. Fault tolerance went up. Cost went to <b>O(n²)</b> bandwidth, every node stores the full membership list, a new node must be announced to all, and removing a node is equally loud. The sending node can still bottleneck on the linear first hop. System design is tradeoffs; this one bought reliability with a quadratic network.",
      bullets: [
        "Rebroadcast is why a down node still gets the message later.",
        "Membership lists are extra storage on every box.",
        "Join and leave are cluster-wide events. Gossip will not need that."
      ]
    },
    {
      heading: "Gossip: three friends, then an epidemic",
      body: "Do not tell the whole college. Tell <b>three best friends</b> and swear them to secrecy; they tell three friends. In a week everyone knows. That is <b>gossip protocol</b>: a decentralized P2P technique that transmits messages through rumors. Every node periodically sends to a <b>random subset</b>, not the full set. The system receives the message <b>eventually, with high probability</b>. Nodes build a global map from limited local chats. Also called an <b>epidemic protocol</b> — disease spreads through family, then through the next room. Algorithm: <code>onMessage</code>, forward to your fanout friends (the lecture uses <b>fanout 3</b>). A simulator with 40 nodes and fanout 3 infects the graph in rounds; fanout 1 on 7 nodes is a chain. Adding a student gives them friends automatically; a student who leaves drops out of future picks. Redis uses gossip so nodes discover the cluster. Cassandra gossips liveness, location, schema version, and token ranges.",
      bullets: [
        "Fanout caps messages per node and protects application bandwidth.",
        "Failures are tolerated because some other friend will tell the missing node later.",
        "You optimized time and hop count. You accepted eventual consistency. That was the point."
      ]
    }
  ],

  keyTerms: [
    { term: "Single point of failure", def: "One component whose death takes the whole app with it. A lone primary database is the lecture's example." },
    { term: "Eventual consistency", def: "Replicas converge after propagation delay. Master-slave and gossip both land here on purpose." },
    { term: "Liveness", def: "Whether a node is considered alive, usually via heartbeats. A quiet minute gets you declared dead." },
    { term: "Point-to-point broadcast", def: "The node that got the update sends it to all others. O(n), and a busy receiver can miss it." },
    { term: "Eager reliable broadcast", def: "Every receiver rebroadcasts to everyone. Better fault tolerance, O(n²) traffic, full membership lists." },
    { term: "Gossip / epidemic protocol", def: "Periodically send state to a random subset (fanout). The rumor spreads with high probability." },
    { term: "Fanout", def: "How many peers you gossip with each round. Three in the lecture's \"best friends\" and in the 40-node demo." }
  ],

  tradeoffs: [
    { pro: "One primary keeps reads and writes on the same truth.", con: "That box is a single point of failure, even after you scale the app tier." },
    { pro: "Master-slave plus nearest-replica reads spread read load and keep copies of the data.", con: "Writes still funnel through a leader; failover is a drama; consistency is already eventual." },
    { pro: "ZooKeeper-style central state gives strong answers for membership and discovery.", con: "The coordinator is a bottleneck and another single point of failure." },
    { pro: "Eager rebroadcast survives a producer and consumer dying at once.", con: "O(n²) bandwidth, full node lists, painful join/leave." },
    { pro: "Gossip limits per-node messages, tolerates loss, and makes add/remove cheap.", con: "You are on eventual consistency with high probability, not a linearizable write." }
  ],

  interviewTips: [
    "Start from one DB. Vertical scale still SPOF. Replication creates the consistency problem gossip will solve.",
    "Master-slave: all writes to the leader, publish to slaves, nearest replica for reads, elect on death. Still a write bottleneck.",
    "Name ZooKeeper as centralized membership with heartbeats and strong consistency, then reject it for large write volume.",
    "Broadcast is O(n) and can drop a busy node. Eager is O(n²) because everyone rebroadcasts.",
    "Gossip: fanout 3 random peers each round, epidemic spread, Redis cluster discovery, Cassandra membership. Eventual, available, no master."
  ],

  scene: {
    nodes: [
      { id: "user", label: "User A", type: "user", pos: [-10, 0, -4] },
      { id: "api", label: "App servers", type: "server", pos: [-5, 0, -4] },
      { id: "db", label: "Primary DB", type: "db", pos: [1, 0, -4] },
      { id: "rep", label: "Replica", type: "db", pos: [7, 0, -4], showAt: 1 },
      { id: "nSpof", label: "4k then 40k, still one box", type: "note", pos: [1, 0, -7] },
      { id: "zk", label: "ZooKeeper", type: "gateway", pos: [1, 0, 3], showAt: 3 },
      { id: "r0", label: "Seed", type: "cache", pos: [-8, 0, -2], showAt: 4 },
      { id: "r1", label: "R1", type: "cache", pos: [-3, 0, -5], showAt: 4 },
      { id: "r2", label: "R2", type: "cache", pos: [3, 0, -5], showAt: 4 },
      { id: "r3", label: "R3", type: "cache", pos: [8, 0, -2], showAt: 4 },
      { id: "r4", label: "R4", type: "cache", pos: [-5, 0, 3], showAt: 4 },
      { id: "r5", label: "R5", type: "cache", pos: [0, 0, 5.5], showAt: 4 },
      { id: "r6", label: "New node", type: "cache", pos: [5, 0, 3], showAt: 4 },
      { id: "nFan", label: "Fanout 3, not O(n)", type: "note", pos: [8, 0, 6.5], showAt: 6 }
    ],
    edges: [
      { from: "user", to: "api" },
      { from: "api", to: "db" },
      { from: "db", to: "rep", showAt: 1, dashed: true },
      { from: "db", to: "zk", showAt: 3, dashed: true },
      { from: "r0", to: "r1", showAt: 6, dashed: true },
      { from: "r0", to: "r2", showAt: 6, dashed: true },
      { from: "r0", to: "r4", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "One primary, one failure domain",
        text: "Users hit app servers; app servers hit a single primary. Growing from 4,000 to 40,000 users on a bigger box keeps consistency and keeps the SPOF. If this DB dies, the product dies.",
        highlight: ["user", "api", "db", "nSpof"],
        hide: ["nFan"],
        flows: [
          { from: "user", to: "api", color: "#4ade80", label: "req" },
          { from: "api", to: "db", color: "#4ade80", label: "R/W" }
        ]
      },
      {
        title: "A replica, two different truths",
        text: "Split load onto a second database. User A writes the new value on the primary. A read against the replica still shows the old row. Copies without a sync story are how consistency breaks.",
        highlight: ["user", "db", "rep"],
        hide: ["nFan"],
        flows: [
          { from: "user", to: "db", color: "#4ade80", label: "write" },
          { from: "rep", to: "api", color: "#60a5fa", label: "stale read" }
        ]
      },
      {
        title: "Master-slave: writes through the leader",
        text: "All writes go to the green leader. It publishes to slaves; reads use the nearest Redis. Eventual consistency, and the leader is still a write SPOF. Kill it and you can read copies until you elect a new king.",
        highlight: ["db", "rep", "nSpof"],
        hide: ["nFan"],
        flows: [
          { from: "user", to: "db", color: "#4ade80", label: "write" },
          { from: "db", to: "rep", color: "#c084fc", label: "publish" }
        ]
      },
      {
        title: "Central brain vs a dead leader",
        text: "ZooKeeper-style state: heartbeats, liveness, service discovery, strong answers. The leader still takes every write and every membership question. Crash it — highlighted red — and the coordinated cluster has no front door.",
        highlight: ["zk", "db"],
        hide: ["nFan"],
        fail: ["db"],
        flows: [
          { from: "rep", to: "zk", color: "#fb923c", label: "heartbeat" },
          { from: "db", to: "zk", color: "#f87171", label: "down" }
        ]
      },
      {
        title: "Broadcast: shout to every Redis",
        text: "Peer-to-peer cluster, brute force. The seed sends the update to all. O(n). R5 is already overloaded and misses the packet. Producer retries; if both sides fail together the rumor dies.",
        highlight: ["r0", "r1", "r2", "r3", "r4", "r5"],
        hide: ["user", "api", "db", "rep", "zk", "nSpof", "nFan"],
        fail: ["r5"],
        flows: [
          { from: "r0", to: "r1", color: "#4ade80", label: "all" },
          { from: "r0", to: "r2", color: "#4ade80", label: "all" },
          { from: "r0", to: "r3", color: "#4ade80", label: "all" },
          { from: "r0", to: "r4", color: "#4ade80", label: "all" },
          { from: "r0", to: "r5", color: "#f87171", label: "drop" }
        ]
      },
      {
        title: "Eager: everyone rebroadcasts",
        text: "Each receiver sends the same message to everyone else at least once. R5 can still catch a replay. Fault tolerance rose. Bandwidth is now O(n²), and every node stores the full member list.",
        highlight: ["r0", "r1", "r2", "r3", "r4", "r5", "r6"],
        hide: ["user", "api", "db", "rep", "zk", "nSpof", "nFan"],
        flows: [
          { from: "r1", to: "r5", color: "#c084fc", label: "replay" },
          { from: "r2", to: "r3", color: "#c084fc", label: "replay" },
          { from: "r4", to: "r6", color: "#c084fc", label: "replay" },
          { from: "r3", to: "r0", color: "#fb923c", label: "n²" }
        ]
      },
      {
        title: "Gossip round 1: three best friends",
        text: "Do not tell the college. The seed gossips to a random fanout of three — R1, R2, R4. Limited local chats. Same move as the 40-node simulator with fanout 3.",
        highlight: ["r0", "r1", "r2", "r4", "nFan"],
        hide: ["user", "api", "db", "rep", "zk", "nSpof"],
        flows: [
          { from: "r0", to: "r1", color: "#4ade80", label: "rumor" },
          { from: "r0", to: "r2", color: "#4ade80", label: "rumor" },
          { from: "r0", to: "r4", color: "#4ade80", label: "rumor" }
        ]
      },
      {
        title: "Round 2: the friends tell friends",
        text: "R1, R2, and R4 each pick three peers. The rumor hops. R5 was busy last round; a neighbor still infects it. Failures are tolerated because gossip is redundant in time, not in a full mesh.",
        highlight: ["r1", "r2", "r4", "r3", "r5", "nFan"],
        hide: ["user", "api", "db", "rep", "zk", "nSpof"],
        fail: ["r5"],
        flows: [
          { from: "r1", to: "r3", color: "#60a5fa", label: "r2" },
          { from: "r2", to: "r6", color: "#60a5fa", label: "r2" },
          { from: "r4", to: "r5", color: "#fb923c", label: "retry" }
        ]
      },
      {
        title: "New student, then convergence",
        text: "A node joining is a new student who gets friends automatically. Removing a node just stops picking it. High probability the whole cluster has the rumor — Redis membership, Cassandra liveness and tokens. Epidemic, eventual, no master.",
        highlight: ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "nFan"],
        hide: ["user", "api", "db", "rep", "zk", "nSpof"],
        flows: [
          { from: "r6", to: "r3", color: "#c084fc", label: "join" },
          { from: "r5", to: "r0", color: "#c084fc", label: "sync" },
          { from: "r3", to: "r2", color: "#4ade80", label: "done" }
        ]
      }
    ]
  }
});
