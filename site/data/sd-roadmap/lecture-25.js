window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 25,
  title: "Fan-Out, Scatter-Gather, Orchestration, and Choreography",
  video: "",
  category: "Cloud and Architecture",
  tagline: "One event, many workers; one query, many shards; a conductor versus a dance of events.",
  summary: "Fan-out delivers one fact to many independent consumers. Scatter-gather asks many peers in parallel and merges answers. Orchestration puts a conductor in charge of a multi-step workflow. Choreography lets each service react to events without a central boss. Spring code uses application events or Kafka for fan-out, WebClient or @Async for scatter-gather, and either a workflow engine or a saga of topics. Partial failure is the real design: timeouts, empty gathers, and compensating actions.",

  theory: [
    {
      heading: "Fan-out: one fact, many independent jobs",
      body: "OrderPlaced is interesting to inventory, email, analytics, and fraud. The producer should not call four HTTP APIs. It writes one event; each consumer has its own queue or consumer group. That is <b>fan-out</b>. In Spring, <code>ApplicationEventPublisher</code> fans out inside one JVM (fine for in-process, gone on crash). Across services, Kafka (one topic, many groups) or SNS/SQS is the usual picture. Bulkheads matter: a slow email provider must not stall inventory. The producer returns after the event is durably accepted, not after the newsletter sends. Idempotency on each consumer is mandatory; fan-out is at least once.",
      bullets: [
        "In-process events are not a durable bus. Do not confuse @EventListener with Kafka.",
        "One topic, many groups = pub/sub. One group, many consumers = competing consumers.",
        "Prefer event names that are facts (OrderPlaced), not commands (SendEmail)."
      ]
    },
    {
      heading: "Scatter-gather: ask everyone, then merge",
      body: "Search, hotel rates, and \"which warehouse can ship today\" are <b>scatter-gather</b>: send the same question to N shards or vendors, wait, merge. Parallelism is the point. In Spring, <code>CompletableFuture</code> plus <code>WebClient</code>, or a reactive <code>Flux.merge</code>, fires the calls. You must set a timeout per leg and a budget for the whole gather. A missing shard returns a partial result, not a 500 that hides the nine that succeeded. Hedged requests (retry a slow shard on a second replica) help tail latency and multiply load. Rank and dedupe in the aggregator; do not let each shard invent the sort.",
      bullets: [
        "Timeouts are part of the API: partial vs fail-the-gather.",
        "Fan-out is push of a fact. Scatter-gather is pull of a query. Do not mix the words.",
        "The aggregator is a new bottleneck. Cache hot gathers."
      ]
    },
    {
      heading: "Orchestration: a conductor owns the next step",
      body: "A checkout that must reserve inventory, authorize payment, then create a shipment has a sequence and compensations. An <b>orchestrator</b> (a Spring state machine, Temporal, or a saga table you own) says \"now call payment.\" It sees the whole graph, logs where it stopped, and retries the next command. The services stay command-driven: <code>ReserveStock</code>, <code>Refund</code>. The orchestrator is a single place to read a customer's order journey and a single place that can stall the world if it is down. Keep it stateless toward the bus; persist saga state in a table keyed by order id.",
      bullets: [
        "Commands from the conductor, replies back. Timeouts start compensations.",
        "Do not hide a 20-step orchestrator inside a @Transactional HTTP handler.",
        "Version the workflow definition. In-flight sagas outlive a deploy."
      ]
    },
    {
      heading: "Choreography: each service knows its cue",
      body: "<b>Choreography</b> has no conductor. Inventory listens for OrderPlaced and emits StockReserved. Payment listens for StockReserved and emits PaymentTaken. Shipment listens for PaymentTaken. The dance is in the event names. You avoid a central bottleneck and you lose a single diagram of \"where is this order.\" Tracing and a correlation id become the debugger. Cyclic events (PaymentFailed causes OrderPlaced again) are the failure mode. Prefer choreography when steps are independent or only loosely ordered; prefer orchestration when the business asks \"show me the workflow\" and compensation is branching and ugly.",
      bullets: [
        "Every event carries a correlation id (order id).",
        "A missing listener is a silent bug. Contract tests on topics help.",
        "Mixed style is normal: choreograph notifications, orchestrate money."
      ]
    },
    {
      heading: "Failure, timeouts, and Spring practice",
      body: "Partial failure is the default. For fan-out, a dead-letter per consumer. For scatter-gather, return 200 with a degraded flag when two of three hotel vendors answer. For orchestration, a timeout on payment triggers a compensate-inventory command, not a thread that waits 30 seconds in Tomcat. For choreography, a watchdog (the distributed cron lesson) emits a \"stuck\" event if PaymentTaken never arrives. <code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> is the in-process cousin of the outbox: do not publish before the row exists. Across processes, use the outbox, not a hope.",
      bullets: [
        "Name the timeout and the degraded behavior in the interview drawing.",
        "Compensations must be idempotent. Double refund is a worse bug than a stuck saga.",
        "Do not use 2PC across inventory and the bank. Saga or choreography is the adult version."
      ]
    }
  ],

  keyTerms: [
    { term: "Fan-out", def: "One published fact delivered independently to many consumers." },
    { term: "Scatter-gather", def: "Parallel queries to many peers, then a merge with a deadline." },
    { term: "Orchestration", def: "A central workflow that sends commands and tracks saga state." },
    { term: "Choreography", def: "Each service reacts to events; there is no conductor process." },
    { term: "Correlation id", def: "A shared id (order id) on every event so you can trace one journey." },
    { term: "Compensation", def: "An undo command (release stock, refund) when a later step fails." },
    { term: "Hedged request", def: "Firing a duplicate query to another replica when the first is slow." },
    { term: "AFTER_COMMIT", def: "Spring's hook to publish an in-process event only after the transaction succeeds." }
  ],

  tradeoffs: [
    { pro: "Fan-out keeps the producer fast and the consumers isolated.", con: "Each consumer must be idempotent and you operate N retry policies." },
    { pro: "Scatter-gather cuts wall-clock time for independent queries.", con: "Tail latency and extra load from hedges; partial results need a UI story." },
    { pro: "Orchestration is easy to explain, monitor, and compensate.", con: "The conductor is a dependency and a temptation to become a god service." },
    { pro: "Choreography scales without a boss process.", con: "The workflow lives in tribal knowledge and a zipper of topics." }
  ],

  interviewTips: [
    "Fan-out is pub/sub of a fact. Scatter-gather is a parallel query with a merge. Keep the terms separate.",
    "For checkout money movement, prefer an orchestrated saga with compensations. For emails, choreograph.",
    "Always mention timeouts, partial success, and idempotent consumers.",
    "Say AFTER_COMMIT or an outbox so you do not emit OrderPlaced for a rolled-back order.",
    "Draw a correlation id on every arrow in the choreography picture."
  ],

  scene: {
    nodes: [
      { id: "api", label: "Checkout API", type: "service", pos: [-10, 0, 0] },
      { id: "bus", label: "OrderPlaced", type: "queue", pos: [-5, 0, 0] },
      { id: "inv", label: "Inventory", type: "worker", pos: [0, 0, -4], showAt: 1 },
      { id: "mail", label: "Email", type: "worker", pos: [0, 0, 0], showAt: 1 },
      { id: "fraud", label: "Fraud", type: "worker", pos: [0, 0, 4], showAt: 1 },
      { id: "agg", label: "Search aggregator", type: "lb", pos: [-5, 0, 6], showAt: 3 },
      { id: "s1", label: "Shard A", type: "server", pos: [0, 0, 6], showAt: 3 },
      { id: "s2", label: "Shard B", type: "server", pos: [4.5, 0, 6], showAt: 3 },
      { id: "orch", label: "Saga conductor", type: "gateway", pos: [5, 0, 0], showAt: 5 },
      { id: "pay", label: "Payments", type: "service", pos: [10, 0, -3], showAt: 5 },
      { id: "ship", label: "Shipping", type: "service", pos: [10, 0, 3], showAt: 5 },
      { id: "n0", label: "One event, many groups", type: "note", pos: [-5, 0, -7] },
      { id: "n1", label: "Deadline then partial", type: "note", pos: [2, 0, 7.6], showAt: 3 },
      { id: "n2", label: "Commands + compensate", type: "note", pos: [7.5, 0, -7], showAt: 5 }
    ],
    edges: [
      { from: "api", to: "bus" },
      { from: "bus", to: "inv", showAt: 1 },
      { from: "bus", to: "mail", showAt: 1 },
      { from: "bus", to: "fraud", showAt: 1 },
      { from: "agg", to: "s1", showAt: 3 },
      { from: "agg", to: "s2", showAt: 3 },
      { from: "orch", to: "pay", showAt: 5 },
      { from: "orch", to: "ship", showAt: 5 },
      { from: "inv", to: "pay", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "Accept, then emit a fact",
        text: "Checkout commits the order and publishes OrderPlaced once (outbox or AFTER_COMMIT). It does not HTTP-call email. Fan-out starts after the fact exists.",
        highlight: ["api", "bus", "n0"],
        flows: [{ from: "api", to: "bus", color: "#4ade80", label: "OrderPlaced" }]
      },
      {
        title: "Fan-out to independent workers",
        text: "Inventory, email, and fraud each have their own consumer group. A slow mailbox cannot block stock reservation. Each handler is idempotent on order id.",
        highlight: ["bus", "inv", "mail", "fraud"],
        flows: [
          { from: "bus", to: "inv", color: "#fb923c", label: "stock" },
          { from: "bus", to: "mail", color: "#fb923c", label: "mail" },
          { from: "bus", to: "fraud", color: "#fb923c", label: "score" }
        ]
      },
      {
        title: "Email can fail alone",
        text: "The email vendor times out. Inventory already reserved. That is the bulkhead working. Retry and a DLQ belong to email, not to checkout.",
        highlight: ["mail", "inv", "bus"],
        fail: ["mail"],
        flows: [{ from: "bus", to: "mail", color: "#f87171", label: "timeout" }]
      },
      {
        title: "Scatter-gather is a query",
        text: "Search sends the same query to two shards in parallel with a 80 ms budget. This is not fan-out. The aggregator will merge hits, not notify workers of a fact.",
        highlight: ["agg", "s1", "s2", "n1"],
        flows: [
          { from: "agg", to: "s1", color: "#60a5fa", label: "q" },
          { from: "agg", to: "s2", color: "#60a5fa", label: "q" }
        ]
      },
      {
        title: "Merge with a deadline",
        text: "Shard B is late. The gather returns A's hits and a degraded flag instead of failing the page. Hedging B to a replica would be a later optimization and extra load.",
        highlight: ["agg", "s1", "s2"],
        fail: ["s2"],
        flows: [{ from: "s1", to: "agg", color: "#4ade80", label: "partial" }]
      },
      {
        title: "Orchestrated checkout money",
        text: "A saga conductor sends ReserveStock, then Charge, then CreateShipment. State lives in a saga table keyed by order id. Tomcat is not waiting on the bank.",
        highlight: ["orch", "pay", "ship", "inv", "n2"],
        flows: [
          { from: "orch", to: "pay", color: "#c084fc", label: "Charge" },
          { from: "orch", to: "ship", color: "#c084fc", label: "Ship" }
        ]
      },
      {
        title: "Compensate on payment fail",
        text: "Charge fails. The conductor sends ReleaseStock. Compensation is a command, idempotent, not a hope that inventory noticed. Rollback of money is a business step.",
        highlight: ["orch", "pay", "inv"],
        fail: ["pay"],
        flows: [{ from: "orch", to: "inv", color: "#f87171", label: "ReleaseStock" }]
      },
      {
        title: "Choreography has no boss",
        text: "An alternative: Inventory emits StockReserved, Payments listens, Shipping listens for PaymentTaken. No conductor. Correlation id is order id. A missing listener is a silent stuck order unless a watchdog exists.",
        highlight: ["inv", "pay", "ship", "bus"],
        flows: [
          { from: "inv", to: "pay", color: "#fb923c", label: "StockReserved" },
          { from: "pay", to: "ship", color: "#fb923c", label: "PaymentTaken" }
        ]
      }
    ]
  }
});
