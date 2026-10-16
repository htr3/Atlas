window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 1,
  title: "Apache Kafka",
  video: "https://www.youtube.com/watch?v=hNDjd9I_VGA",
  category: "Paper Walkthroughs",
  tagline: "A durable log that decouples producers from consumers at LinkedIn scale.",
  summary: "LinkedIn's 2011 Kafka paper is walked as a publish-subscribe log, not a chatty queue. The lecture covers why brokers exist, how topics split into ordered partitions, pull-plus-offset consumption, replica leadership with ZooKeeper, the high watermark, batching, delivery semantics, consumer groups, and zero-copy sends.",

  theory: [
    {
      heading: "The problem: fan-out and a replayable log",
      body: "Treat Kafka as a <b>distributed commit log</b> that many writers append to and many readers tail. The lecture's Instagram picture is the hard fan-out: one celebrity post must reach millions of followers without the publisher blocking on each inbox. The second picture is an event stream: a Facebook profile is a sequence (photo, then name, then address, then email). Replay that sequence into an empty store and you reconstruct the same state — copies of databases become optional if the log is the source of truth.",
      bullets: [
        "Publish-subscribe: producers emit, subscribers consume, the log sits in the middle.",
        "Event streaming: many sources, many sinks, one ordered history per partition.",
        "LinkedIn-class volume (the talk cites ~7 trillion messages/day) makes manual recovery impossible."
      ]
    },
    {
      heading: "Why a broker exists",
      body: "Direct producer-to-consumer links look simpler and fail to scale. Producers want to <b>append and continue</b>; they should not wait on the slowest follower or reimplement persistence, batching, and retries in every app. Extracting that work into Kafka isolates concerns: applications keep business logic, brokers keep the log. Retention is a storage budget (the talk uses ~two weeks as a typical window), not a mailbox that empties when one consumer ACKs.",
      bullets: [
        "Async boundary: write path latency is the broker, not the whole subscriber set.",
        "One place for durability, retries, and retention instead of N client libraries.",
        "Consumers come and go; the log remains."
      ]
    },
    {
      heading: "Topics, partitions, and the order contract",
      body: "Producers publish to a <b>topic</b>. A topic is too large for one disk, so it is split into <b>partitions</b>. Each message lands in exactly one partition. <b>Order is guaranteed only inside a partition</b>. If M5 hashes to another partition than M1, a consumer may process them out of global order. That is the contract you design around: pick a partition key (user id, post id) for anything that must stay ordered, and accept cross-partition shuffle for everything else. Partitions live on <b>brokers</b> (Kafka servers); one machine can host thousands of them.",
      bullets: [
        "Topic = named stream. Partition = ordered, append-only slice.",
        "Keyed produce keeps a user's events on one partition.",
        "Scale writes by adding partitions; scale brokers by moving partitions."
      ]
    },
    {
      heading: "Pull, offsets, and horizontal scale",
      body: "Kafka is a <b>pull</b> system. Brokers do not push into consumers. Each consumer tracks an <b>offset</b> — the index of the next record it wants — and asks for a batch. Pull keeps brokers dumb: they serve bytes and offsets; consumers own pacing, retries, and crash recovery. Offset state can live on the broker or in ZooKeeper so it survives a consumer restart. As load grows you add producers, brokers, and consumers independently. At LinkedIn's numbers, even a 0.1% failure rate is billions of incidents; recovery has to be automatic.",
      bullets: [
        "Consumer-driven rate: slow readers do not stall the log.",
        "Offset commit is how you remember progress.",
        "Brokers scale by hosting more partitions, not by knowing application logic."
      ]
    },
    {
      heading: "Replicas, ISR, and ZooKeeper",
      body: "Every partition has replicas on other brokers. If a consumer could write to any replica, logs diverge: one copy has 1,2,3,4; a failover copy has 1,2,3,5; the consumer's offset 4 is meaningless. Kafka therefore has a <b>single primary</b> that takes all writes. Followers pull from the primary. If the primary dies, ZooKeeper runs a Paxos-style election — but only among replicas that were <b>in sync</b> (the lecture's rule of thumb: a recent message from the primary, e.g. within ~10s). A lagging replica sits out so you do not promote a hole.",
      bullets: [
        "Writes hit one leader; reads may use in-sync followers.",
        "Followers are themselves pull clients of the leader.",
        "ISR (in-sync replicas) is the election electorate."
      ]
    },
    {
      heading: "High watermark, batching, and delivery",
      body: "Consumers must not see a message until it is on every in-sync replica. That cut is the <b>high watermark</b>. Message 3 can sit on the leader and stay invisible until followers catch up — otherwise a leader crash would un-commit data a consumer already processed. Throughput comes from <b>batching</b> (the talk uses ~50 KB as the produce/fetch unit): one network trip carries many records. Brokers do not police rates; producers and consumers choose batch size. Delivery is a consumer choice: commit the offset <i>after</i> successful work for <b>at-least-once</b> (verification email — retry until it lands, duplicates possible); commit <i>before</i> work for a weaker at-most-once path (a skippable notification). <b>Exactly-once</b> needs transactions (distributed 2PC across replicas — expensive) plus <b>consumer groups</b>: each partition is assigned to at most one member of the group, so two workers cannot fan the same celebrity post out twice.",
      bullets: [
        "High watermark = committed, replicated prefix.",
        "At-least-once: process, then ACK offset; crashes replay.",
        "Consumer group: exclusive partition assignment; brokers can still move partitions freely."
      ]
    },
    {
      heading: "Zero-copy and why the JVM cache is the wrong place",
      body: "A naive broker copies a record into the JVM heap, then into a socket buffer. Kafka uses Linux <b>sendfile / zero-copy</b>: bytes go from the filesystem page cache to the NIC without entering the Java heap. Fewer copies, fewer syscalls, roughly 2× send throughput in the talk, and you dodge a nasty GC pattern. Java's generational collector is weak on long-lived linked structures: dead nodes get promoted into the old generation (\"nepotism\") and sit there inflating pause times. Serving from the page cache instead of an application linked list removes that junk.",
      bullets: [
        "Hot path is disk pages → socket, not disk → heap → socket.",
        "Less heap traffic means less GC on the broker.",
        "The 2011 LinkedIn design became the industry default for log transport."
      ]
    }
  ],

  keyTerms: [
    { term: "Topic", def: "Named stream of messages. Split into partitions so one log can span many disks and brokers." },
    { term: "Partition", def: "Ordered, append-only slice of a topic. Kafka's unit of parallelism, replication, and consumer assignment." },
    { term: "Broker", def: "A Kafka server that stores partitions, serves fetch/produce, and tracks offsets." },
    { term: "Offset", def: "Integer index of a record in a partition; the consumer's cursor for the next pull." },
    { term: "ISR", def: "In-sync replicas: followers that have recently caught the leader and may be elected." },
    { term: "High watermark", def: "Highest offset known to be fully replicated; consumers cannot read past it." },
    { term: "At-least-once", def: "Offset advances after processing. Crashes replay; handlers must be idempotent." },
    { term: "Consumer group", def: "Set of consumers that exclusive-share a topic's partitions so each record is processed by one member." },
    { term: "Zero-copy", def: "Kernel sendfile path from page cache to socket, skipping the JVM heap." }
  ],

  tradeoffs: [
    { pro: "Broker in the middle: producers finish fast; persistence and fan-out are shared.", con: "Extra hop, operational cluster, and retention disk you would not need in a direct RPC." },
    { pro: "Order inside a partition is a simple, checkable contract.", con: "No global order across partitions; bad keys create hot partitions." },
    { pro: "Pull + offsets: consumers pace themselves; brokers stay simple.", con: "Slow or stuck consumers lag; you must monitor consumer lag yourself." },
    { pro: "Primary + ISR + high watermark: failover without silent holes.", con: "Writes wait on replication; a stuck ISR member delays visibility." },
    { pro: "At-least-once is easy and matches 'retry the email'.", con: "Duplicates happen. Exactly-once needs 2PC and exclusive group assignment — much heavier." }
  ],

  interviewTips: [
    "Draw producer → topic/partition → broker → pull consumer, then add ISR and the high watermark.",
    "Say order is per partition, not per topic — then pick a partition key for the entities that must stay ordered.",
    "Contrast at-least-once (ACK after work) with at-most-once (ACK first) before you claim exactly-once.",
    "Explain why multi-writer replicas diverge (4 vs 5) and why a single leader plus ISR election exists.",
    "Name consumer groups as the cheap exclusive-processing trick, and 2PC as the expensive exactly-once trick.",
    "If asked about throughput, mention batching (~50 KB) and zero-copy sendfile, not just 'more brokers'."
  ],

  scene: {
    nodes: [
      { id: "zp", label: "Producers", type: "zone", pos: [-7, 0, 2], size: [6, 10] },
      { id: "zb", label: "Kafka cluster", type: "zone", pos: [0, 0, 2], size: [10, 10] },
      { id: "zc", label: "Consumer group", type: "zone", pos: [9, 0, 0], size: [5, 8], showAt: 4 },

      { id: "brad", label: "Brad Pitt", type: "user", pos: [-10, 0, -4] },
      { id: "prod", label: "Producer client", type: "service", pos: [-10, 0, 0] },
      { id: "evsrc", label: "Event source", type: "service", pos: [-10, 0, 4], showAt: 1 },

      { id: "primary", label: "Primary", type: "server", pos: [-2, 0, 0], showAt: 2 },
      { id: "topic", label: "Topic / P1", type: "queue", pos: [2, 0, 0], showAt: 2 },
      { id: "repA", label: "ISR replica A", type: "server", pos: [2, 0, -4], showAt: 5 },
      { id: "repB", label: "ISR replica B", type: "server", pos: [2, 0, 4], showAt: 5 },
      { id: "zk", label: "ZooKeeper", type: "service", pos: [5, 0, 7], showAt: 5 },

      { id: "consA", label: "Consumer A", type: "worker", pos: [9, 0, -3], showAt: 4 },
      { id: "consB", label: "Consumer B", type: "worker", pos: [9, 0, 3], showAt: 4 },

      { id: "n0", label: "Fan-out to millions", type: "note", pos: [-8, 4, -7] },
      { id: "n1", label: "Replay events = same state", type: "note", pos: [0, 4, -7], showAt: 1 },
      { id: "n2", label: "Order only in a partition", type: "note", pos: [8, 4, -7], showAt: 3 },
      { id: "n3", label: "Pull + offset cursor", type: "note", pos: [-8, 4, 7], showAt: 4 },
      { id: "n4", label: "ISR elects new primary", type: "note", pos: [0, 4, 7], showAt: 5 },
      { id: "n5", label: "High watermark", type: "note", pos: [8, 4, 7], showAt: 6 },
      { id: "n6", label: "At-least-once after work", type: "note", pos: [11, 4, -7], showAt: 7 },
      { id: "n7", label: "One consumer per partition", type: "note", pos: [-11, 4, -7], showAt: 8 }
    ],
    edges: [
      { from: "brad", to: "prod", label: "post" },
      { from: "prod", to: "primary", label: "produce", showAt: 2 },
      { from: "primary", to: "topic" , showAt: 2 },
      { from: "evsrc", to: "prod", label: "events", showAt: 1 },
      { from: "consA", to: "topic", label: "fetch", showAt: 4, dashed: true },
      { from: "consB", to: "topic", label: "fetch", showAt: 4, dashed: true },
      { from: "primary", to: "repA", label: "replicate", showAt: 5 },
      { from: "primary", to: "repB", label: "replicate", showAt: 5 },
      { from: "zk", to: "primary", label: "leader", showAt: 5, dashed: true },
      { from: "repA", to: "zk", label: "ISR", showAt: 5, dashed: true },
      { from: "repB", to: "zk", label: "ISR", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Celebrity fan-out",
        text: "A single Instagram-style post from Brad Pitt must reach millions of followers. Point-to-point sends from the publisher would block the app on every inbox. Kafka is the log in the middle of that broadcast.",
        highlight: ["zp", "brad", "prod", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "brad", to: "prod", color: "#4ade80", label: "photo" }
        ]
      },
      {
        title: "Events reconstruct state",
        text: "A profile is a sequence of facts: photo, name, address, email. Replay the log into an empty store and you get the same database. The durable stream replaces ad-hoc copies.",
        highlight: ["evsrc", "prod", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "evsrc", to: "prod", color: "#fb923c", label: "events" }
        ]
      },
      {
        title: "Brokers isolate producers",
        text: "Producers want to append and return to application logic. Persistence, retries, and retention live on Kafka servers so every client does not reimplement them. Direct producer-to-consumer links do not survive this scale.",
        highlight: ["prod", "primary", "topic", "zb"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "prod", to: "primary", color: "#4ade80", label: "append" },
          { from: "primary", to: "topic", color: "#4ade80", label: "log" }
        ]
      },
      {
        title: "Topics and partitions",
        text: "A topic is split into partitions. Each record hashes to one partition and is ordered there. Cross-partition order is not promised — M5 on another slice may overtake M1. One broker can host thousands of partitions.",
        highlight: ["topic", "primary", "n2"],
        hide: ["n0", "n1", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "prod", to: "primary", color: "#4ade80", label: "keyed" },
          { from: "primary", to: "topic", color: "#4ade80", label: "P1" }
        ]
      },
      {
        title: "Consumers pull offsets",
        text: "Consumers pull batches and remember an offset — the next index to read. Brokers stay simple: they do not push or pace readers. Offset state on the broker or ZooKeeper survives a consumer crash.",
        highlight: ["consA", "consB", "topic", "zc", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "topic", to: "consA", color: "#60a5fa", label: "batch" },
          { from: "consA", to: "topic", color: "#fb923c", label: "offset" }
        ]
      },
      {
        title: "Primary, ISR, ZooKeeper",
        text: "Followers pull from one write leader. If any replica accepted writes, logs would fork (4 vs 5) and offsets would lie. ZooKeeper elects a new primary only from in-sync replicas — those that recently heard the leader.",
        highlight: ["primary", "repA", "repB", "zk", "n4"],
        fail: ["primary"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6", "n7"],
        flows: [
          { from: "primary", to: "repA", color: "#c084fc", label: "replicate" },
          { from: "primary", to: "repB", color: "#c084fc", label: "replicate" },
          { from: "zk", to: "repA", color: "#fb923c", label: "elect" }
        ]
      },
      {
        title: "High watermark and batches",
        text: "Consumers only see offsets that exist on every ISR member. That high watermark keeps a leader crash from exposing unreplicated records. Produce and fetch in ~50 KB batches so trillions of messages do not each pay a round trip.",
        highlight: ["topic", "repA", "repB", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6", "n7"],
        flows: [
          { from: "primary", to: "repA", color: "#c084fc", label: "catch-up" },
          { from: "topic", to: "consA", color: "#60a5fa", label: "up to HW" }
        ]
      },
      {
        title: "At-least-once vs skippable",
        text: "Commit the offset after successful work and Kafka will retry on crash — a verification email should arrive at least once, duplicates allowed. Commit first and you may drop a low-priority notification. Exactly-once needs transactions on top.",
        highlight: ["consA", "topic", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n7"],
        flows: [
          { from: "topic", to: "consA", color: "#60a5fa", label: "msg" },
          { from: "consA", to: "topic", color: "#4ade80", label: "ACK offset" }
        ]
      },
      {
        title: "Groups, exclusive partitions, zero-copy",
        text: "A consumer group assigns each partition to one member so two workers do not broadcast the same celebrity post. Exactly-once still needs 2PC across replicas. Brokers send with Linux sendfile: page cache to NIC, no JVM copy, less GC.",
        highlight: ["consA", "consB", "topic", "zc", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "topic", to: "consA", color: "#60a5fa", label: "P1 only" },
          { from: "topic", to: "consB", color: "#60a5fa", label: "P2 only" }
        ]
      }
    ]
  }
});
