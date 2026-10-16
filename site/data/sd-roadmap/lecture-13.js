window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 13,
  title: "Change Data Capture and Windowed Stream Processing",
  video: "",
  category: "Messaging",
  tagline: "Read the database log instead of dual-writing, then window the stream.",
  summary: "Dual writes — app to database and app to Kafka in the same request — drift the two stores the first time one of them fails. Change data capture reads the database's own WAL or binlog and emits those commits as events, so the log of record stays the database. Stream processors then group those events into tumbling, hopping, or session windows to compute rolling counts, joins, and late-arriving truth. Watermarks and grace periods decide when a window closes. In Java this is Debezium into Kafka, then Kafka Streams or Flink with TimeWindows and a materialized sink.",

  theory: [
    {
      heading: "Dual write is a distributed transaction you pretended not to have",
      body: "A Spring <code>@Transactional</code> method saves an Order and then <code>kafkaTemplate.send</code>. If the commit succeeds and the send fails, Kafka never sees the order. If you send first and the DB rolls back, Kafka lies. Two-phase commit across Kafka and Postgres is possible and painful. The outbox pattern writes the event row in the same DB transaction, then a poller publishes — better, but you still wrote a second table and a poller. <b>Change data capture</b> skips the second write: the database already logged the commit.",
      bullets: [
        "One transaction, one source of truth, then derive the stream.",
        "Outbox is CDC you implement with SQL. WAL CDC is CDC the engine already did.",
        "Never \"fire Kafka then commit\" on a user-facing write path."
      ]
    },
    {
      heading: "CDC: tail the WAL, not the table",
      body: "Postgres, MySQL, and SQL Server write a sequential log of commits (WAL / binlog / redo). A CDC connector such as <b>Debezium</b> (or the cloud equivalent) tails that log, decodes row images, and publishes <code>Order</code> create/update/delete events with before/after payloads, transaction ids, and LSNs. Snapshot + streaming is the usual start: an initial consistent dump, then the log from that point. You get every committed change without polling <code>SELECT * FROM orders WHERE updated_at > ?</code>, which misses in-transaction rows and hammers indexes. The connector is a Kafka Connect source, or Debezium EmbeddedEngine inside a Spring Boot process if you must. Treat schema changes as events too; a dropped column will surprise a consumer that still maps the old JSON.",
      bullets: [
        "Enable sufficient WAL/binlog retention or the connector cannot catch up after a pause.",
        "Include the primary key; compacted topics need a stable key.",
        "Deletes are events. Tombstones are how compacted topics forget a key."
      ]
    },
    {
      heading: "What CDC is not",
      body: "CDC is not event sourcing. Event sourcing stores the intent log as the source of truth and builds the table as a read model. CDC stores the table as the source of truth and builds the stream as a derivative. You cannot reconstruct \"why\" from a CDC update that only has new column values. CDC also is not a public API: internal column names leak. Put an anti-corruption consumer that maps to a stable event contract if other teams subscribe. And CDC will amplify a bulk <code>UPDATE</code> into a storm of messages — throttle or window downstream.",
      bullets: [
        "Use event sourcing when the business log is the product.",
        "Use CDC when the OLTP database already won and you need search, cache, or analytics in near real time.",
        "Do not CDC every table \"just in case.\""
      ]
    },
    {
      heading: "Windows: how streams become numbers",
      body: "A stream is infinite, so aggregations need a <b>window</b> — a finite slice of event time. <b>Tumbling</b> windows tile the timeline with no overlap (every 1 minute count of checkouts). <b>Hopping</b> (sliding) windows overlap (count over 5 minutes, emit every 1 minute). <b>Session</b> windows group events separated by less than a gap (a user's browsing session). Kafka Streams: <code>stream.groupByKey().windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1))).count()</code>. Flink has the same ideas with more watermark knobs. Processing time is \"when we saw it\" and lies under lag. Event time is \"when it happened\" and needs timestamps on the CDC envelope.",
      bullets: [
        "Say which clock the window uses: event time, processing time, or ingestion time.",
        "Joins of two streams are windowed too, or they would wait forever.",
        "Materialize window results into a table or compacted topic for serving."
      ]
    },
    {
      heading: "Late events and watermarks",
      body: "CDC and mobile clients deliver events late. A <b>watermark</b> is a claim: \"I will not see event times earlier than T.\" When the watermark passes a window's end (plus grace), the window closes and emits. Arrive after that and you are ignored, or you trigger a retraction, depending on the engine. Grace periods exist because networks and connectors stall. If you close too early, dashboards undercount. If you never close, you leak state. In Kafka Streams, <code>ofSizeAndGrace</code> plus a punctuator is the adult API; <code>withNoGrace</code> is only honest when you control the producer clock. Out-of-order CDC from a failover or a replica lag is normal — design windows assuming it.",
      bullets: [
        "Watermarks are a heuristic, not a theorem.",
        "Idempotent sinks (upsert by window key) make retractions cheaper.",
        "Monitor event-time skew: processing time minus event time."
      ]
    },
    {
      heading: "A Spring-shaped pipeline",
      body: "Orders land in Postgres. Debezium publishes to <code>db.shop.orders</code>. A Kafka Streams app windows paid orders by <code>merchantId</code> into 5-minute tumbling counts and upserts <code>merchant_sales_5m</code> in a serving store (another compacted topic, Redis, or Elasticsearch). The original request path never talked to Kafka. Fail the Streams app and the WAL still has the truth; it will catch up. That is the operational win over dual write: replay is a connector offset, not a forensic DB dump.",
      bullets: [
        "Keep the CDC topic internal; publish a cleaned domain topic if others consume.",
        "Compact by primary key if you need latest-state changelog semantics.",
        "Size RocksDB/state stores for the open windows, not for all history."
      ]
    }
  ],

  keyTerms: [
    { term: "Change data capture", def: "Emitting committed database row changes by tailing WAL/binlog instead of dual-writing from the app." },
    { term: "WAL / binlog", def: "The database's sequential commit log. CDC's source of truth." },
    { term: "Debezium", def: "CDC connector that snapshots a table then streams its log into Kafka (or embedded)." },
    { term: "Outbox", def: "Event rows written in the same DB transaction as business data, then published by a poller or CDC." },
    { term: "Tumbling window", def: "Fixed, non-overlapping slices of event time used to aggregate a stream." },
    { term: "Hopping window", def: "Fixed-size windows that advance by a hop smaller than the size, so they overlap." },
    { term: "Session window", def: "Dynamic windows that close after a gap of inactivity for a key." },
    { term: "Watermark", def: "Engine claim that event times behind T are done, used to close windows." },
    { term: "Grace period", def: "Extra time after window end during which late events may still update the result." }
  ],

  tradeoffs: [
    { pro: "CDC keeps a single write in the OLTP transaction; no dual-write drift.", con: "You couple downstream to table shape and must hide internal columns." },
    { pro: "WAL replay after a connector crash restores events without scanning tables.", con: "Binlog retention and connector lag become production incidents." },
    { pro: "Windowed aggregations turn infinite streams into dashboards and alerts.", con: "Late events plus watermarks mean the last number can still move, or can be wrong forever." },
    { pro: "Event time windows survive consumer lag better than processing-time windows.", con: "You must carry trustworthy timestamps through CDC envelopes." },
    { pro: "Kafka Streams / Flink can upsert a serving store continuously.", con: "State stores, rebalances, and window memory are a new ops surface." }
  ],

  interviewTips: [
    "Open with dual-write failure modes, then introduce CDC as \"the database already logged it.\"",
    "Distinguish CDC from event sourcing in one sentence: which log is the source of truth.",
    "When they ask for \"orders per minute,\" name tumbling vs hopping and event time vs processing time.",
    "Say what happens to a message that arrives after the watermark — drop, update, or retract.",
    "Mention Debezium + Kafka Connect as the boring production path, not a custom SELECT poller."
  ],

  scene: {
    nodes: [
      { id: "app", label: "Order API", type: "service", pos: [-11, 0, 0] },
      { id: "db", label: "Postgres", type: "db", pos: [-5, 0, 0] },
      { id: "wal", label: "WAL", type: "queue", pos: [-5, 0, -4], showAt: 2 },
      { id: "nDual", label: "DB ok, Kafka miss = drift", type: "note", pos: [-5, 0, 5], showAt: 1 },
      { id: "debz", label: "Debezium", type: "worker", pos: [1, 0, 0], showAt: 3 },
      { id: "kf", label: "CDC topic", type: "queue", pos: [6, 0, 0], showAt: 1 },
      { id: "ks", label: "Kafka Streams", type: "service", pos: [6, 0, 4], showAt: 4 },
      { id: "win", label: "5m tumbling window", type: "zone", pos: [6, 0, 4], size: [6, 4], showAt: 5 },
      { id: "late", label: "Late event", type: "point", pos: [1, 0, 4], showAt: 6 },
      { id: "nWater", label: "watermark closes the window", type: "note", pos: [1, 0, 6.5], showAt: 6 },
      { id: "sink", label: "Sales store", type: "storage", pos: [11, 0, 4], showAt: 7 },
      { id: "nSnap", label: "snapshot then stream LSNs", type: "note", pos: [1, 0, -4], showAt: 3 }
    ],
    edges: [
      { from: "app", to: "db", label: "INSERT" },
      { from: "app", to: "kf", label: "dual write", showAt: 1, dashed: true },
      { from: "db", to: "wal", showAt: 2 },
      { from: "wal", to: "debz", showAt: 3 },
      { from: "debz", to: "kf", showAt: 3 },
      { from: "kf", to: "ks", showAt: 4 },
      { from: "ks", to: "sink", showAt: 7 }
    ],
    steps: [
      {
        title: "The OLTP write",
        text: "The order API commits a row in Postgres. That commit is the business fact. Anything else is a copy.",
        highlight: ["app", "db"],
        flows: [{ from: "app", to: "db", color: "#4ade80", label: "COMMIT" }]
      },
      {
        title: "Dual write drifts",
        text: "The same handler also produces to Kafka. One of the two hops fails. Search, cache, and billing now disagree with Postgres. This is the bug CDC exists to delete.",
        highlight: ["app", "db", "nDual"],
        flows: [
          { from: "app", to: "db", color: "#4ade80", label: "ok" },
          { from: "app", to: "kf", color: "#f87171", label: "timeout" }
        ]
      },
      {
        title: "The WAL already has it",
        text: "Postgres appended the commit to WAL. That sequential log is a perfect CDC source: ordered, durable, and not a polling query.",
        highlight: ["db", "wal"],
        flows: [{ from: "db", to: "wal", color: "#c084fc", label: "LSN" }]
      },
      {
        title: "Debezium tails the log",
        text: "Debezium snapshots, then streams row images into a CDC topic keyed by primary key. The API never called Kafka. Catch-up is an offset in the WAL.",
        highlight: ["debz", "kf", "nSnap", "wal"],
        flows: [
          { from: "wal", to: "debz", color: "#c084fc", label: "decode" },
          { from: "debz", to: "kf", color: "#fb923c", label: "after image" }
        ]
      },
      {
        title: "A processor reads the changelog",
        text: "Kafka Streams (or Flink) consumes the CDC topic. This is where you map ugly table events into domain facts and prepare aggregations.",
        highlight: ["kf", "ks"],
        flows: [{ from: "kf", to: "ks", color: "#fb923c", label: "orders" }]
      },
      {
        title: "Tumbling windows",
        text: "Paid orders are grouped by merchantId into 5-minute non-overlapping event-time windows. Each window is a tiny table keyed by (merchant, window start).",
        highlight: ["ks", "win"],
        flows: [{ from: "kf", to: "ks", color: "#fb923c", label: "groupBy" }]
      },
      {
        title: "Late event vs watermark",
        text: "An event with an old timestamp arrives after the watermark plus grace. The window may ignore it or retract. Either way you must say the rule; \"eventually consistent\" is not a rule.",
        highlight: ["late", "nWater", "ks", "win"],
        flows: [{ from: "late", to: "ks", color: "#f87171", label: "too late" }]
      },
      {
        title: "Upsert the serving store",
        text: "Closed (or updated) windows upsert merchant_sales_5m. If Streams dies, WAL still has truth and the topology rebuilds state. The checkout path stayed a single Postgres transaction.",
        highlight: ["ks", "sink", "db"],
        flows: [
          { from: "ks", to: "sink", color: "#4ade80", label: "upsert" },
          { from: "wal", to: "debz", color: "#c084fc" }
        ]
      }
    ]
  }
});
