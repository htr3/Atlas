window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 34,
  title: "Kafka Delivery Semantics",
  category: "Kafka",
  tagline: "At most once, at least once, and the narrow thing people mean by exactly once.",
  summary: "Delivery semantics describe how many times a record's effect is allowed to happen. At most once means you may lose it and will not repeat it. At least once means you may repeat it and should not lose a committed write. Exactly once inside Kafka is a producer transaction plus an idempotent producer, and it still ends at the consumer's offset commit. Side effects outside Kafka — a row, an email — are exactly once only if those handlers are idempotent or done in a transaction Kafka can see.",

  theory: [
    {
      heading: "Count the effect, not the packet",
      body: "\"Delivered\" is slippery. The broker can store a record, the consumer can read it, apply it, and crash before committing the offset. On restart it reads again. From the business's point of view the effect happened twice. <b>Semantics</b> are about that effect. Pick the one the product allows, then set producer acks, consumer commits, and handler behavior to match. Do not start from a slogan.",
      bullets: [
        "Loss and duplication are the two failures. Each semantic forbids one of them.",
        "You usually cannot forbid both across a database the broker does not control.",
        "Say which system is inside the guarantee: the log, or the log plus your database."
      ]
    },
    {
      heading: "At most once",
      body: "Commit the offset (or acknowledge) <b>before</b> you do the work, and publish with acks that may drop data. If you crash, you do not read that record again, and you might never have processed it. Metrics and best-effort telemetry can live here. An order cannot. At most once is what you get by accident when a consumer commits early to \"avoid duplicates\" and then dies.",
      bullets: [
        "Commit, then process → you can skip.",
        "acks=0 or a producer that ignores errors → you can lose on the write too.",
        "Choose this only when missing a record is acceptable."
      ]
    },
    {
      heading: "At least once",
      body: "Do the work, then commit the offset. Publish with <code>acks=all</code> and enough in-sync replicas. A crash between the work and the commit redelivers the record. Nothing that was fully published is skipped, and some records are processed twice. This is the normal, honest setting for Kafka consumers. It is safe when the handler dedupes on a key: an order id, a payment idempotency key, an outbox event id. The outbox lesson was this contract from the other side.",
      bullets: [
        "Process, then commit the offset.",
        "Store processed ids uniquely so the second run is a no-op.",
        "A consumer that writes an email and then commits will email twice unless the send itself is deduped."
      ]
    },
    {
      heading: "What exactly once actually covers",
      body: "Kafka's <b>exactly-once</b> story is: an idempotent producer so retries do not append twice, and a <b>transaction</b> so a read from input topics, a write to output topics, and the offset commit all land together or not at all. A consumer configured for read-committed does not see an aborted transaction. That is exactly once <i>from topic to topic</i>. The moment you also insert into Postgres or call Stripe, those systems are outside the transaction unless you use a pattern they participate in (an outbox, an idempotency key). In the interview, draw that line. \"We turned on exactly once\" without the line is how double charges survive a correct-sounding answer."
    }
  ],

  keyTerms: [
    { term: "At most once", def: "Effects happen zero or one time. Records may be lost; they are not intentionally repeated." },
    { term: "At least once", def: "A published record is processed one or more times. Handlers must tolerate duplicates." },
    { term: "Offset commit", def: "The consumer recording how far it got. Commit timing decides whether a crash skips or repeats." },
    { term: "Idempotent producer", def: "Broker-side dedupe of a producer's retried batches, via producer id and sequence." },
    { term: "Kafka transaction", def: "An atomic write of output records and consumer offsets. Aborted transactions are hidden from read-committed consumers." }
  ],

  tradeoffs: [
    { pro: "At least once plus dedupe is understandable and survives a crash.", con: "Every handler must be idempotent, including ones a teammate adds later." },
    { pro: "At most once is simple and never double-sends.", con: "Crashes and weak acks drop data with no automatic repair." },
    { pro: "Kafka transactions give topic-to-topic exactly once.", con: "They do not cover a database or an HTTP call unless you add another pattern." },
    { pro: "Read-committed consumers hide aborted transactions.", con: "Transactions add latency and a transaction coordinator you now depend on." }
  ],

  interviewTips: [
    "Define the three semantics by whether loss or duplication is allowed.",
    "At least once is process-then-commit. At most once is commit-then-process.",
    "Make the handler idempotent and you can live with at least once.",
    "Kafka transactions are exactly once between topics. Name what is outside: the database, the email, the charge.",
    "If they say \"enable exactly once,\" ask exactly once of which write."
  ],

  scene: {
    nodes: [
      { id: "prod", label: "Producer", type: "service", pos: [-9, 0, -2] },
      { id: "log", label: "Partition log", type: "queue", pos: [-3.5, 0, -2] },
      { id: "cons", label: "Consumer", type: "worker", pos: [2, 0, -2] },
      { id: "db", label: "Handler DB", type: "db", pos: [7, 0, -2], showAt: 2 },
      { id: "out", label: "Output topic", type: "queue", pos: [2, 0, 3.4], showAt: 4 },
      { id: "n0", label: "Commit after the work", type: "note", pos: [4, 0, -6.8], showAt: 2 },
      { id: "n1", label: "DB is outside EOS", type: "note", pos: [8, 0, 3], showAt: 4 }
    ],
    edges: [
      { from: "prod", to: "log", label: "acks=all" },
      { from: "log", to: "cons" },
      { from: "cons", to: "db", label: "apply", showAt: 2 },
      { from: "cons", to: "log", label: "commit offset", showAt: 3, dashed: true },
      { from: "cons", to: "out", label: "txn", showAt: 4 }
    ],
    steps: [
      {
        title: "A durable append",
        text: "The producer uses acks=all. The record is on the log. Nothing has been applied in the business database yet. Durability of the log is not a semantic for the effect.",
        highlight: ["prod", "log"],
        flows: [{ from: "prod", to: "log", color: "#4ade80", label: "append" }]
      },
      {
        title: "Read, and do not commit yet",
        text: "The consumer fetches the record. If it committed the offset now and then crashed, the record would never be applied. That would be at most once.",
        highlight: ["log", "cons"],
        flows: [{ from: "log", to: "cons", color: "#60a5fa", label: "fetch" }]
      },
      {
        title: "Apply, then commit",
        text: "The handler writes the business effect, using a unique event id so a repeat is a no-op. Only then does it commit the offset. A crash before the commit redelivers. This is at least once.",
        highlight: ["cons", "db", "n0"],
        flows: [{ from: "cons", to: "db", color: "#c084fc", label: "apply" }]
      },
      {
        title: "A duplicate is absorbed",
        text: "The redelivery finds the event id already stored and skips the side effect. The offset can then move forward. Loss was avoided; the duplicate was made harmless.",
        highlight: ["log", "cons", "db"],
        flows: [
          { from: "log", to: "cons", color: "#facc15", label: "again" },
          { from: "cons", to: "log", color: "#4ade80", label: "commit" }
        ]
      },
      {
        title: "Transactions stop at the log",
        text: "A Kafka transaction can commit the output topic and the offset together. The handler database is not in that transaction. Exactly once of the charge still needs an idempotency key.",
        highlight: ["cons", "out", "db", "n1"],
        flows: [{ from: "cons", to: "out", color: "#fb923c", label: "txn" }]
      }
    ]
  }
});
