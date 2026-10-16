window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 12,
  title: "Messaging Guarantees: Ordering, Duplicates, Delays, and RabbitMQ vs Kafka",
  video: "",
  category: "Messaging",
  tagline: "Brokers promise delivery math, not business correctness. You still handle duplicates.",
  summary: "A message bus is a contract about loss, duplication, order, and lag — not a magic exactly-once machine. At-most-once drops work; at-least-once replays it; exactly-once is a choreography of ids, transactions, and idempotent handlers. Order is usually per key or per queue, never global for free. RabbitMQ is a smart broker of queues and acks; Kafka is a durable partitioned log of offsets. Spring AMQP and Spring Kafka make both easy to misuse if you ignore ack mode, consumer lag, and poison messages.",

  theory: [
    {
      heading: "Three delivery contracts",
      body: "<b>At-most-once</b> means fire and forget, or ack before work: a crash loses the message. <b>At-least-once</b> acks after a successful side effect, so a crash before the ack causes a redelivery. That is the default you should design for. <b>Exactly-once</b> is not a broker checkbox. It is at-least-once plus an idempotency key (or a transactional outbox plus a transactional consumer). Kafka's idempotent producer and transactional API prevent duplicate <i>writes to the log</i> and can tie consume-transform-produce into one transaction. They do not make your <code>UPDATE accounts</code> automatically unique. In Spring, <code>MANUAL</code> ack after the DB commit is at-least-once; ack in the listener before the DB is at-most-once dressed as convenience.",
      bullets: [
        "Name the contract before you name the product.",
        "At-least-once is the honest default for payments, mail, and stock.",
        "Idempotency keys belong in the payload and in a uniqueness constraint."
      ]
    },
    {
      heading: "Order is a partition, not a universe",
      body: "Two messages from the same user can arrive reversed if they take different connections, different partitions, or different competing consumers. <b>Global order</b> means one queue and one consumer — and no parallelism. <b>Per-key order</b> is the usual compromise: Kafka hashes <code>orderId</code> onto one partition; only one consumer in the group reads that partition. RabbitMQ preserves order inside a single queue if you use one consumer, or with a single active consumer / consistent-hash exchange. The moment you scale consumers on one queue, FIFO across those consumers is gone unless you shard by key yourself. Never promise \"messages always in order\" in an interview without saying <i>which key, which partition, which consumer</i>.",
      bullets: [
        "Independent keys should not share a partition if you want parallel consumers.",
        "A hot key (one celebrity, one SKU) serializes that partition.",
        "Retries can reorder if you nack to the head or to a delay queue carelessly."
      ]
    },
    {
      heading: "Duplicates, delays, and poison",
      body: "Duplicates come from producer retries, consumer restarts, and visibility timeouts. Treat every handler as <code>if (!seen(messageId)) apply()</code>. Delays are different: <b>producer delay</b> (the event was late), <b>broker delay</b> (queue depth), and <b>consumer lag</b> (you are slow). Kafka consumer lag is <code>end offset - committed offset</code> per partition; it is the metric that tells you the bus is lying about \"real time.\" A <b>poison message</b> fails forever: infinite redelivery melts the consumer. Bound retries, then dead-letter. In Spring Kafka, <code>DefaultErrorHandler</code> with a dead-letter topic; in Rabbit, a DLX. Delayed messages (retry in 5s, 30s, 5m) need a TTL + DLX pattern or Kafka's retry topics, not <code>Thread.sleep</code> in the listener.",
      bullets: [
        "Lag is a backlog of time, not a boolean \"up/down.\"",
        "A poison message is a bug or a bad payload, not a reason to block the partition.",
        "Make handlers short; long work belongs after an ack to an internal work queue."
      ]
    },
    {
      heading: "RabbitMQ: queues, exchanges, acks",
      body: "RabbitMQ is a <b>smart broker</b>. Producers publish to an <b>exchange</b> (direct, topic, fanout, headers). Bindings copy the message into <b>queues</b>. Competing consumers on one queue share work. The broker tracks unacked deliveries; a nack or connection drop requeues. You get per-queue FIFO for a single consumer, flexible routing keys, and easy request/reply. You do not get a days-long cheap log you can rewind for a new service. Persistence is a flag on the message and queue; mirroring (or quorum queues) is how you survive a node. Spring AMQP's <code>RabbitTemplate.convertAndSend</code> plus a <code>@RabbitListener</code> with <code>AcknowledgeMode.AUTO</code> acks on method success and nacks on exception — at-least-once if the exception happens after a non-idempotent write, you still have a problem.",
      bullets: [
        "Use quorum queues for durable work; classic mirrored queues are the old story.",
        "Prefetch limits how many unacked messages a consumer may hold.",
        "TTL + dead-letter is the standard delayed-retry recipe."
      ]
    },
    {
      heading: "Kafka: the log, offsets, and why it feels different",
      body: "Kafka is a <b>dumb durable log</b>. Topics split into partitions. Producers append; consumers pull and commit offsets. Retention is time or size, so a new consumer group can replay. Throughput comes from sequential disk and batching, not from fancy routing. Order is per partition. Fan-out is extra consumer groups, not extra queues. There is no competing-consumer ack in the Rabbit sense: if you commit too early you skip; too late you duplicate. Spring Kafka's <code>AckMode.RECORD</code> versus <code>BATCH</code> changes that window. Use a partition key. Size partitions for future parallelism; you can add partitions later but you break key hashing unless you planned for it.",
      bullets: [
        "Offset commit is your ack. Treat it with the same care as a Rabbit ack.",
        "Consumer groups = independent progress on the same log.",
        "Compaction keeps the latest value per key; it is not a database."
      ]
    },
    {
      heading: "Picking the tool in an interview",
      body: "Choose RabbitMQ when you want routing keys, work queues, RPC, per-message TTL, and a broker that pushes. Choose Kafka when many independent consumers must read the same history, when throughput is huge, or when you want stream processing later. Many companies run both: Kafka as the event backbone, Rabbit (or SQS) as the worker queue for a single service. Do not put a 50 ms user-facing request on a consumer-lag path. And do not say \"exactly-once with Kafka\" unless you can point at the idempotency store or the transactional consume/produce pair.",
      bullets: [
        "User HTTP request → DB outbox → Kafka is a better write path than dual writes.",
        "A task queue for \"resize this image\" is still a Rabbit/SQS-shaped problem.",
        "Measure lag, redelivery rate, and DLQ depth, not only \"messages/sec.\""
      ]
    }
  ],

  keyTerms: [
    { term: "At-least-once", def: "Every accepted message is delivered one or more times. Handlers must be idempotent." },
    { term: "At-most-once", def: "A message may be lost; it will not be redelivered after a crash in the ack-early path." },
    { term: "Per-key order", def: "Messages that share a key (and thus a partition or shard) stay in produce order." },
    { term: "Consumer lag", def: "How far a consumer's committed offset sits behind the log end, in records or time." },
    { term: "Idempotency key", def: "A stable id stored with a uniqueness constraint so a retry does not apply twice." },
    { term: "Dead-letter", def: "Side queue/topic that holds messages that exceeded retry policy." },
    { term: "Exchange", def: "RabbitMQ routing component that copies messages into queues by binding rules." },
    { term: "Offset", def: "Kafka consumer's pointer into a partition. Commit is the durability of progress." },
    { term: "Quorum queue", def: "Raft-replicated RabbitMQ queue used for durable work instead of classic mirroring." }
  ],

  tradeoffs: [
    { pro: "At-least-once never silently drops paid work.", con: "You must detect duplicates in the application or database." },
    { pro: "Per-key partitioning restores order without a global bottleneck.", con: "A hot key serializes one partition and caps parallelism." },
    { pro: "RabbitMQ routing and acks make work queues and RPC natural.", con: "There is no cheap long retention; new services cannot rewind history." },
    { pro: "Kafka's log lets many groups replay and scale throughput with partitions.", con: "You operate offsets, rebalances, and lag; it is a poor low-latency RPC bus." },
    { pro: "Delayed retry and DLQ keep poison off the hot path.", con: "Retry topics can reorder events unless you also key and debounce." }
  ],

  interviewTips: [
    "Start with the delivery contract, then pick Rabbit versus Kafka — product after math.",
    "Say \"order per orderId partition,\" never \"Kafka is ordered.\"",
    "When they ask exactly-once, describe an idempotency table or transactional outbox, not a broker slogan.",
    "Name consumer lag as the freshness SLO of an async pipeline.",
    "Contrast a task queue (Rabbit) with an event log (Kafka) using one concrete company flow."
  ],

  scene: {
    nodes: [
      { id: "pub", label: "Order service", type: "service", pos: [-11, 0, 0] },
      { id: "rmq", label: "RabbitMQ", type: "queue", pos: [-3, 0, -4], showAt: 3 },
      { id: "ex", label: "topic exchange", type: "point", pos: [-6, 0, -4], showAt: 3 },
      { id: "kf", label: "Kafka log", type: "queue", pos: [-3, 0, 4], showAt: 4 },
      { id: "p0", label: "P0 orderId=7", type: "queue", pos: [2, 0, 2], showAt: 4 },
      { id: "p1", label: "P1 orderId=9", type: "queue", pos: [2, 0, 6], showAt: 4 },
      { id: "w1", label: "Worker A", type: "worker", pos: [6, 0, -5] },
      { id: "w2", label: "Worker B", type: "worker", pos: [6, 0, -2], showAt: 3 },
      { id: "w3", label: "Group 2 reader", type: "worker", pos: [6, 0, 4], showAt: 4 },
      { id: "db", label: "Orders DB", type: "db", pos: [11, 0, 0], showAt: 1 },
      { id: "dlq", label: "Dead letter", type: "queue", pos: [6, 0, 7], showAt: 6 },
      { id: "nDup", label: "ack-after-crash = duplicate", type: "note", pos: [6, 0, 0], showAt: 1 },
      { id: "nOrd", label: "order only inside one partition", type: "note", pos: [-3, 0, 7], showAt: 2 },
      { id: "nLag", label: "lag = end - committed offset", type: "note", pos: [2, 0, -7], showAt: 5 }
    ],
    edges: [
      { from: "pub", to: "w1", label: "fire-forget" },
      { from: "pub", to: "ex", showAt: 3 },
      { from: "ex", to: "rmq", showAt: 3 },
      { from: "rmq", to: "w1", showAt: 3 },
      { from: "rmq", to: "w2", showAt: 3 },
      { from: "pub", to: "kf", showAt: 4 },
      { from: "kf", to: "p0", showAt: 4 },
      { from: "kf", to: "p1", showAt: 4 },
      { from: "p0", to: "w3", showAt: 4 },
      { from: "w1", to: "db", showAt: 1 },
      { from: "w3", to: "db", showAt: 4 },
      { from: "rmq", to: "dlq", dashed: true, showAt: 6 }
    ],
    steps: [
      {
        title: "At-most-once drops the paid event",
        text: "The order service sends and forgets, or acks before the worker writes. A crash loses the message. Cheap, and wrong for anything you billed.",
        highlight: ["pub"],
        flows: [{ from: "pub", to: "w1", color: "#f87171", label: "lost" }]
      },
      {
        title: "At-least-once duplicates",
        text: "The worker writes the DB, then crashes before the ack. The broker redelivers. Without an idempotency key on orderId, you charge twice. This is the contract you actually get.",
        highlight: ["w1", "db", "nDup"],
        fail: ["w1"],
        flows: [
          { from: "pub", to: "w1", color: "#fb923c", label: "redeliver" },
          { from: "w1", to: "db", color: "#f87171", label: "INSERT x2" }
        ]
      },
      {
        title: "Order is not global",
        text: "Created then cancelled can swap if they land on different consumers or partitions. Promise order per key, not for the whole topic.",
        highlight: ["nOrd", "pub"],
        flows: [
          { from: "pub", to: "w1", color: "#fb923c", label: "cancel" },
          { from: "pub", to: "w1", color: "#4ade80", label: "create" }
        ]
      },
      {
        title: "RabbitMQ: exchange into a queue",
        text: "A topic exchange routes into a queue. Worker A and B compete. Prefetch and acks live on the broker. Good for task queues; a new service cannot rewind last week's messages.",
        highlight: ["ex", "rmq", "w1", "w2"],
        flows: [
          { from: "pub", to: "ex", color: "#fb923c", label: "publish" },
          { from: "ex", to: "rmq", color: "#fb923c" },
          { from: "rmq", to: "w1", color: "#fb923c" },
          { from: "rmq", to: "w2", color: "#fb923c" }
        ]
      },
      {
        title: "Kafka: keyed partitions",
        text: "orderId 7 always hits P0. A second consumer group can replay the same log. Offsets are the ack. Throughput scales with partitions, not with smarter routing.",
        highlight: ["kf", "p0", "p1", "w3"],
        flows: [
          { from: "pub", to: "kf", color: "#fb923c", label: "append" },
          { from: "kf", to: "p0", color: "#fb923c", label: "key=7" },
          { from: "p0", to: "w3", color: "#fb923c" },
          { from: "w3", to: "db", color: "#4ade80", label: "idempotent" }
        ]
      },
      {
        title: "Lag is delayed truth",
        text: "The UI looks live; the consumer is 40 seconds behind. Lag is end offset minus committed offset. Backpressure, more partitions, or faster handlers — not a bigger JVM sleep.",
        highlight: ["nLag", "p0", "w3"],
        flows: [{ from: "p0", to: "w3", color: "#fb923c", label: "slow" }]
      },
      {
        title: "Poison goes to the DLQ",
        text: "A bad payload fails seven times. Bound the retries, dead-letter, and keep the partition moving. Spring's DefaultErrorHandler and Rabbit DLX exist for this, not Thread.sleep in the listener.",
        highlight: ["dlq", "rmq", "w1"],
        flows: [
          { from: "rmq", to: "w1", color: "#f87171", label: "fail x7" },
          { from: "rmq", to: "dlq", color: "#f87171", label: "DLX" }
        ]
      },
      {
        title: "Choose the shape of the bus",
        text: "Task plus routing keys: Rabbit. Many independent readers and replay: Kafka. Either way the app stores messageId uniquely. The broker does not know what \"charge once\" means.",
        highlight: ["rmq", "kf", "db", "pub"],
        flows: [
          { from: "pub", to: "rmq", color: "#fb923c", label: "jobs" },
          { from: "pub", to: "kf", color: "#c084fc", label: "events" },
          { from: "w3", to: "db", color: "#4ade80", label: "UNIQUE id" }
        ]
      }
    ]
  }
});
