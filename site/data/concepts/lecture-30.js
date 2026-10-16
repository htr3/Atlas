window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 30,
  title: "The Transactional Outbox",
  category: "Service Patterns",
  tagline: "Write the business row and the message in one database transaction, then publish the message after.",
  summary: "The dual-write problem is committing an order and then failing to publish \"order placed,\" or publishing and then failing to commit. The transactional outbox puts both in the same database transaction: the order row and an outbox row. A separate relay reads the outbox and publishes to Kafka (or another bus). Publishing is at least once, so consumers must be idempotent. You never hold the database transaction open across the broker.",

  theory: [
    {
      heading: "Two writes, one of them will fail",
      body: "Orders commits in Postgres, then calls Kafka. If the process dies in between, the order exists and no one is told. If you publish first and the commit fails, the world reacts to an order you rolled back. Those are the two shapes of a <b>dual write</b>. There is no distributed transaction you should take across Postgres and Kafka for this. You need one atomic decision, and the only atomic tool you already trust is the database transaction.",
      bullets: [
        "Commit the state change and the intent to publish together.",
        "Do not call the broker inside that transaction.",
        "A crash after commit loses nothing that was only in memory: the intent is a row."
      ]
    },
    {
      heading: "The outbox row is the intent",
      body: "In the same transaction as the order insert, insert a row: id, aggregate id, type (\"order placed\"), payload, created time, and a null published time. Commit. The order and the message now exist or neither does. A <b>relay</b> — a poller or a log reader — selects unpublished rows, sends them to the broker, and marks them published. Marking published is allowed to happen twice if you crash after a successful send; it is not allowed to happen never.",
      bullets: [
        "Payload is the event, written when you still know the state.",
        "Order rows in the outbox by id so consumers see one aggregate in order.",
        "A unique event id travels in the payload for downstream dedupe."
      ]
    },
    {
      heading: "At least once, on purpose",
      body: "The relay might publish and then fail before it marks the row. The next pass publishes again. Kafka consumers, search indexers, and email workers must treat a repeated event id as a no-op. That is the contract: the outbox gives you <b>at least once</b> delivery of a message that matches a committed transaction. It does not give you exactly once across the company. Exactly-once talk belongs with idempotent consumers, not with a promise the relay cannot keep.",
      bullets: [
        "Publish, then mark. Never mark, then try to publish.",
        "If the broker is down, rows pile up. The order API is still up.",
        "Alert on outbox age, not only on consumer lag."
      ]
    },
    {
      heading: "Polling versus the database log",
      body: "A simple relay polls <code>WHERE published_at IS NULL ORDER BY id</code>. It is easy and a bit laggy, and it hammers the table unless you index that predicate. A log-based relay (reading the write-ahead log) sees the outbox inserts without polling. Either way the application code stays the same: one transaction, two rows. Do not \"optimize\" by publishing from the request thread after commit. That reintroduces the crash window the table was invented to close."
    }
  ],

  keyTerms: [
    { term: "Dual write", def: "Updating a database and a broker as two separate operations, so one can succeed without the other." },
    { term: "Outbox", def: "A table of messages written in the same transaction as the business change." },
    { term: "Relay", def: "A process that publishes outbox rows to the broker and then marks them sent." },
    { term: "At least once", def: "A message may arrive more than once. It should not be silently dropped after a commit." },
    { term: "Event id", def: "An id inside the payload so a consumer can ignore a duplicate publish." }
  ],

  tradeoffs: [
    { pro: "The order and the event commit or roll back together.", con: "You run a relay, and unpublished rows need an age alert." },
    { pro: "The request path does not wait on the broker.", con: "Consumers see the event slightly later, and they must dedupe." },
    { pro: "A poller is simple to understand and operate.", con: "Naive polling is a load on the database; the log-based version is another piece of infrastructure." },
    { pro: "The pattern works with any broker.", con: "People still call it exactly once. It is not, until every consumer is idempotent." }
  ],

  interviewTips: [
    "State the dual-write failure both ways: commit without publish, and publish without commit.",
    "Put the outbox insert in the same transaction. Publish afterwards, from a relay.",
    "Say at least once, then say the consumer dedupes on event id.",
    "Do not hold the database transaction open while you call Kafka.",
    "Mention an alert on the oldest unpublished row."
  ],

  scene: {
    nodes: [
      { id: "api", label: "Orders API", type: "service", pos: [-8, 0, -1] },
      { id: "db", label: "Postgres", type: "db", pos: [-3, 0, -2.4] },
      { id: "box", label: "Outbox rows", type: "storage", pos: [-3, 0, 2.4] },
      { id: "relay", label: "Relay", type: "worker", pos: [2.2, 0, 0], showAt: 2 },
      { id: "kafka", label: "Kafka", type: "queue", pos: [7, 0, 0], showAt: 2 },
      { id: "n0", label: "One transaction", type: "note", pos: [-5, 0, -6.5] },
      { id: "n1", label: "May deliver twice", type: "note", pos: [6, 0, -6.5], showAt: 4 }
    ],
    edges: [
      { from: "api", to: "db", label: "order" },
      { from: "api", to: "box", label: "event row" },
      { from: "box", to: "relay", showAt: 2 },
      { from: "relay", to: "kafka", label: "publish", showAt: 2 },
      { from: "relay", to: "box", label: "mark sent", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "Insert both rows",
        text: "The API writes the order and an outbox row in one transaction. Kafka has not been called. A crash now rolls both back.",
        highlight: ["api", "db", "box", "n0"],
        flows: [
          { from: "api", to: "db", color: "#c084fc", label: "order" },
          { from: "api", to: "box", color: "#c084fc", label: "outbox" }
        ]
      },
      {
        title: "Commit, then return",
        text: "The transaction commits. The caller can be told the order exists. Publishing is someone else's job, so a slow broker does not hold this request.",
        highlight: ["db", "box", "api"],
        flows: []
      },
      {
        title: "The relay publishes",
        text: "The relay reads unpublished rows in id order and sends them to Kafka. The payload already contains a stable event id.",
        highlight: ["box", "relay", "kafka"],
        flows: [
          { from: "box", to: "relay", color: "#fb923c", label: "poll" },
          { from: "relay", to: "kafka", color: "#4ade80", label: "send" }
        ]
      },
      {
        title: "Mark sent after the ack",
        text: "Only a successful publish marks the row. If the relay crashes before the mark, the next pass sends the same event again.",
        highlight: ["relay", "box", "kafka"],
        flows: [{ from: "relay", to: "box", color: "#60a5fa", label: "mark" }]
      },
      {
        title: "Consumers must dedupe",
        text: "A duplicate event is normal. Downstream handlers ignore an event id they have already applied. The outbox closed the dual-write hole; it did not invent exactly once.",
        highlight: ["kafka", "n1", "box"],
        flows: [{ from: "relay", to: "kafka", color: "#facc15", label: "again" }]
      }
    ]
  }
});
