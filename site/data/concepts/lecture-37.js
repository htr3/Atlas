window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 37,
  title: "Spring Kafka",
  category: "Kafka",
  tagline: "KafkaTemplate sends, @KafkaListener consumes, and the container's ack mode decides when the offset moves.",
  summary: "Spring Kafka is a thin way to run the same Kafka rules inside a Spring app. KafkaTemplate is the producer. A @KafkaListener method is the consumer, running inside a listener container that polls and, by default, commits the offset after the method returns. Errors go through an error handler; after the retries, a DeadLetterPublishingRecoverer publishes to a dead-letter topic. Turn on transactions or an idempotent template only when you can say which write is inside the guarantee. This is the client, not a different Kafka.",

  theory: [
    {
      heading: "The template is a producer with Spring's settings",
      body: "<b>KafkaTemplate</b> wraps a producer. You call <code>send(topic, key, value)</code> and get a future or a callback. The important settings are still Kafka's: <code>acks</code>, linger and batch size, and <code>enable.idempotence</code>. Spring does not choose durability for you. If the send fails, the template surfaces an exception; swallowing it in a <code>@Service</code> and returning HTTP 200 recreates the dual write. Pair the template with an outbox when the send must match a database commit. Calling <code>send</code> and then committing a transaction you already closed is the bug.",
      bullets: [
        "Key the send when order per entity matters. A null key round-robins.",
        "Idempotent producer config belongs on the producer factory, and it wants acks=all.",
        "A send is async unless you wait on the future. Waiting is how you notice the failure."
      ]
    },
    {
      heading: "A listener is a poll loop you do not write",
      body: "<code>@KafkaListener</code> marks a method. A concurrent message listener container polls, deserializes, and calls the method, often on several threads up to the concurrency you set. Concurrency cannot exceed the partition count in any useful way: extra threads sit idle because one partition is assigned to one consumer in the group. The <code>groupId</code> is the consumer group. Two instances with the same group split partitions. Two instances with different groups each get every record.",
      bullets: [
        "One method invocation is one record, unless you asked for a batch listener.",
        "Deserialization errors never reach your method. They go to the error handler.",
        "Concurrency is \"up to N partitions,\" not \"N times faster on one partition.\""
      ]
    },
    {
      heading: "Ack mode is the offset commit",
      body: "The default, <b>BATCH</b> (and RECORD, depending on version and config), commits after the listener returns successfully. That is process-then-commit: at least once. If the method throws, the offset does not move and the record is retried. <code>AckMode.MANUAL</code> is for when you will call <code>ack.acknowledge()</code> yourself — after the database commit, not before. Manual ack that you forget is a partition stuck forever. Manual ack that you call before the side effect is at most once. Prefer the default unless the side effect and the method return are not the same moment.",
      bullets: [
        "Throw on failure so the container does not commit.",
        "Do not catch, log, and return. That commits the offset and drops the record.",
        "Manual acknowledgement must happen after the effect you care about."
      ]
    },
    {
      heading: "Retries, then a dead-letter topic",
      body: "A <code>DefaultErrorHandler</code> retries a failed record with backoff, then gives up. <b>DeadLetterPublishingRecoverer</b> publishes the failed record to another topic (often <code>name.DLT</code>) using a template, including headers that say which exception and which partition. Your main listener moves on. The DLT listener is a separate, slower path, or an operator tool. This is the same DLQ idea as the resilience lesson, expressed as a topic. It does not make the handler idempotent — a retry inside the error handler can still apply a non-idempotent method twice before it ever dead-letters."
    }
  ],

  keyTerms: [
    { term: "KafkaTemplate", def: "Spring's producer wrapper. send() uses whatever acks and idempotence you configured on the factory." },
    { term: "KafkaListener", def: "A method the listener container calls with polled records for a topic and group." },
    { term: "Listener container", def: "The poll loop, thread pool, and commit logic that surrounds the listener method." },
    { term: "AckMode", def: "When the container commits offsets. The safe default commits after a successful method return." },
    { term: "DeadLetterPublishingRecoverer", def: "An error-handler destination that publishes a poison record to a dead-letter topic after retries." }
  ],

  tradeoffs: [
    { pro: "Listeners and templates keep Kafka clients out of business code.", con: "Defaults commit on return, so a swallowed exception drops the record." },
    { pro: "Concurrency on the container scales consumers across partitions.", con: "Setting concurrency above the partition count does nothing useful and looks like a tuning win." },
    { pro: "An error handler plus a DLT isolates poison records.", con: "Retries still re-enter your method, so the method must be idempotent." },
    { pro: "Manual acks can wait for a database commit.", con: "Forgetting the ack stalls the partition; acking too early loses the record." }
  ],

  interviewTips: [
    "KafkaTemplate is the producer. @KafkaListener is the consumer. Durability is still acks, not a Spring annotation.",
    "The container commits after a normal return. Catching and swallowing is how you lose messages.",
    "Concurrency cannot outrun the number of partitions in the group.",
    "Use an error handler and a dead-letter topic after retries. Do not retry forever inside the method.",
    "If the send must match a database row, use an outbox. Do not call KafkaTemplate and hope the commit follows."
  ],

  scene: {
    nodes: [
      { id: "api", label: "Spring app", type: "service", pos: [-8, 0, -2] },
      { id: "tpl", label: "KafkaTemplate", type: "worker", pos: [-3.5, 0, -2.4] },
      { id: "topic", label: "orders", type: "queue", pos: [1.5, 0, -2.4] },
      { id: "lis", label: "@KafkaListener", type: "service", pos: [1.5, 0, 2.6], showAt: 2 },
      { id: "db", label: "DB commit", type: "db", pos: [6.5, 0, 2.6], showAt: 2 },
      { id: "dlt", label: "orders.DLT", type: "storage", pos: [6.5, 0, -2.4], showAt: 4 },
      { id: "n0", label: "Ack after return", type: "note", pos: [-2, 0, -7] }
    ],
    edges: [
      { from: "api", to: "tpl" },
      { from: "tpl", to: "topic", label: "send" },
      { from: "topic", to: "lis", showAt: 2 },
      { from: "lis", to: "db", showAt: 2 },
      { from: "lis", to: "dlt", label: "after retries", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Send through the template",
        text: "Application code calls KafkaTemplate. The producer factory's acks and idempotence decide whether the broker's ack means anything. Spring does not add a stronger guarantee.",
        highlight: ["api", "tpl", "n0"],
        flows: [{ from: "api", to: "tpl", color: "#60a5fa", label: "send" }]
      },
      {
        title: "The record lands on the topic",
        text: "Wait on the send if this request must know the broker accepted it. If the truth is a database row plus a message, this arrow belongs to a relay reading an outbox, not to the request thread.",
        highlight: ["tpl", "topic"],
        flows: [{ from: "tpl", to: "topic", color: "#4ade80", label: "acks" }]
      },
      {
        title: "The container calls the listener",
        text: "A listener in the consumer group is handed the record. Concurrency is capped by how many partitions this instance was assigned. The method writes to the database.",
        highlight: ["topic", "lis", "db"],
        flows: [
          { from: "topic", to: "lis", color: "#fb923c", label: "poll" },
          { from: "lis", to: "db", color: "#c084fc", label: "apply" }
        ]
      },
      {
        title: "Return, and the offset moves",
        text: "A normal return lets the container commit. A throw does not. Catching the error and returning success commits past a record you did not apply.",
        highlight: ["lis", "topic", "db"],
        flows: [{ from: "lis", to: "topic", color: "#4ade80", label: "commit" }]
      },
      {
        title: "Retries, then the DLT",
        text: "The error handler retries with backoff. Past the last attempt, DeadLetterPublishingRecoverer publishes to orders.DLT and the main listener continues. The DLT still needs an owner.",
        highlight: ["lis", "dlt", "topic"],
        fail: ["lis"],
        flows: [{ from: "lis", to: "dlt", color: "#f87171", label: "DLT" }]
      }
    ]
  }
});
