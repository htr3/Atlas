window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 33,
  title: "Kafka Producer Acks",
  category: "Kafka",
  tagline: "acks is how many brokers must have the record before the producer is told it is safe.",
  summary: "A Kafka producer writes a record to the leader of a partition. acks decides when that write is acknowledged. Zero means the producer does not wait. One means the leader wrote it locally. All means every in-sync replica wrote it. Pair acks=all with a minimum number of in-sync replicas, or \"all\" can mean \"the leader alone.\" This is durability of the produce call. It is not end-to-end exactly once.",

  theory: [
    {
      heading: "The leader is who you talk to",
      body: "A topic is split into partitions. Each partition has a leader and followers. The producer picks a partition (by key, or round-robin) and sends the batch to the <b>leader</b>. Followers replicate from the leader. The producer does not fan out to every broker itself. What it waits for is the <code>acks</code> setting.",
      bullets: [
        "A key chooses the partition, which is how you keep one entity's records ordered.",
        "Batches exist so you are not paying a round trip per record.",
        "The ack is about the log on the brokers, not about a consumer having read it."
      ]
    },
    {
      heading: "Zero, one, and all",
      body: "<b>acks=0</b>: the send returns once the buffer accepts the batch. The broker may never see it. Use this only for data you can lose (some metrics). <b>acks=1</b>: the leader appended the record. If the leader dies before followers copy it, the record can vanish and a new leader can be elected without it. <b>acks=all</b> (also written <code>-1</code>): the leader waits until every in-sync replica has the record. That survives a leader loss, at the cost of a slower ack.",
      bullets: [
        "0 is fire and forget.",
        "1 is fast and loses the last writes of a dead leader.",
        "all is the setting you name for orders, payments, and anything you must not drop."
      ]
    },
    {
      heading: "All is only as strong as the ISR",
      body: "The <b>in-sync replicas</b> are followers that are not too far behind. <code>acks=all</code> waits for those, not for a follower that has been offline for an hour. If <code>min.insync.replicas</code> is 1, a lonely leader can acknowledge \"all\" by itself, and you are back to acks=1 with extra confidence and no extra copies. Set min.insync.replicas to 2 (with a replication factor of 3) so an ack means at least two brokers have the record. If the ISR shrinks below that minimum, the producer gets an error instead of a weak ack. That error is what you want.",
      bullets: [
        "Replication factor 3 and min.insync.replicas 2 is the usual sentence.",
        "A producer error on a shrunk ISR is a pause, not silent data loss.",
        "Unclean leader election would let a behind replica become leader and drop acked data. Leave it off for this topic."
      ]
    },
    {
      heading: "Idempotent produce is a different switch",
      body: "Retries inside the producer can append the same batch twice if the first append worked and the ack was lost. <b>enable.idempotence</b> gives the producer a sequence number so the broker drops the duplicate. It implies acks=all. It prevents duplicate appends from one producer session. It does not mean the consumer, the database, and the email side effect happened once. Say that boundary out loud so \"idempotent producer\" is not upgraded into \"exactly once business.\""
    }
  ],

  keyTerms: [
    { term: "acks", def: "How many brokers must persist a record before the producer call succeeds: 0, 1, or all." },
    { term: "Leader", def: "The broker that accepts writes for a partition. Followers replicate it." },
    { term: "ISR", def: "In-sync replicas: the leader plus followers caught up enough to be counted in an acks=all wait." },
    { term: "min.insync.replicas", def: "The smallest ISR that is still allowed to acknowledge a write. Below it, produces fail." },
    { term: "Idempotent producer", def: "A producer that stamps sequence numbers so a retried batch is not appended twice." }
  ],

  tradeoffs: [
    { pro: "acks=all plus two in-sync replicas survives a broker death without losing the ack.", con: "The produce call waits for followers, so latency and a shrunk ISR become visible errors." },
    { pro: "acks=1 is cheaper.", con: "A leader crash can drop writes the producer was told succeeded." },
    { pro: "acks=0 never blocks on the cluster.", con: "You cannot tell whether the record exists." },
    { pro: "An idempotent producer removes duplicate appends from its own retries.", con: "Downstream consumers can still see duplicates from other retry layers." }
  ],

  interviewTips: [
    "Define acks=0, acks=1, and acks=all with what is lost if the leader dies.",
    "Immediately add min.insync.replicas. acks=all with a minimum of 1 is a weak ack.",
    "Replication factor 3 and min ISR 2 is the concrete answer for data you must keep.",
    "The ack is not a consumer commit. The record can be durable and still unread.",
    "Idempotent producer stops double appends. It is not a business exactly-once guarantee."
  ],

  scene: {
    nodes: [
      { id: "prod", label: "Producer", type: "service", pos: [-9, 0, 0] },
      { id: "leader", label: "Leader", type: "server", pos: [-3, 0, 0] },
      { id: "f1", label: "Follower", type: "server", pos: [2.5, 0, -3], showAt: 2 },
      { id: "f2", label: "Follower", type: "server", pos: [2.5, 0, 3], showAt: 2 },
      { id: "n0", label: "Wait for the ISR", type: "note", pos: [0, 0, -7], showAt: 3 },
      { id: "n1", label: "min ISR = 2", type: "note", pos: [7, 0, -7], showAt: 4 }
    ],
    edges: [
      { from: "prod", to: "leader", label: "batch" },
      { from: "leader", to: "f1", label: "replicate", showAt: 2 },
      { from: "leader", to: "f2", showAt: 2 },
      { from: "leader", to: "prod", label: "ack", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "Send to the leader only",
        text: "The producer batches records and sends them to the partition leader. Followers are not clients of the producer.",
        highlight: ["prod", "leader"],
        flows: [{ from: "prod", to: "leader", color: "#60a5fa", label: "produce" }]
      },
      {
        title: "acks=1 returns at the leader",
        text: "The leader appends to its log and acknowledges. The producer is unblocked. If the leader dies before a follower copies the record, that ack can still be lost.",
        highlight: ["prod", "leader"],
        flows: [{ from: "leader", to: "prod", color: "#facc15", label: "acks=1" }]
      },
      {
        title: "Followers catch up",
        text: "Replicas pull from the leader. They are in the ISR only while they keep up. acks=all waits until every broker currently in the ISR has the record.",
        highlight: ["leader", "f1", "f2", "n0"],
        flows: [
          { from: "leader", to: "f1", color: "#4ade80", label: "copy" },
          { from: "leader", to: "f2", color: "#4ade80", label: "copy" }
        ]
      },
      {
        title: "Then the producer hears back",
        text: "With replication factor 3 and min.insync.replicas=2, the ack means at least two brokers have it. Losing one broker does not lose the write.",
        highlight: ["leader", "f1", "prod", "n1"],
        flows: [{ from: "leader", to: "prod", color: "#4ade80", label: "acks=all" }]
      },
      {
        title: "A lonely leader must not ack",
        text: "If two followers fall out of the ISR, the minimum is no longer met. The produce fails. That error is safer than an ack only the doomed leader held.",
        highlight: ["leader", "f1", "f2"],
        fail: ["f1", "f2"],
        flows: [{ from: "leader", to: "prod", color: "#f87171", label: "not enough ISR" }]
      }
    ]
  }
});
