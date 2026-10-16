window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 38,
  title: "Kafka Consumer Lag",
  category: "Kafka",
  tagline: "Lag is the end of the log minus your offset — how far behind the group is, and why adding threads may not help.",
  summary: "Consumer lag is the number of records produced but not yet committed by a consumer group, per partition. It grows when producers outrun handlers, when a rebalance pauses everyone, when processing time spikes, or when messages pile up behind a poison record. You can add consumers only up to the number of partitions. Past that, the fix is faster handling, more partitions, or less work on the critical read. Lag is a delay, not by itself proof the cluster is broken.",

  theory: [
    {
      heading: "Lag is an offset subtraction",
      body: "Each partition has a <b>log end offset</b>, the next offset the producer will write. Each consumer group has a committed offset on that partition. <b>Lag</b> is the difference. Sum it across partitions for a group-level number, but page on the hottest partition too: one stuck partition can hide inside a calm average. Lag of zero means you have committed up to the end, not that processing was fast — a quiet topic is always caught up. Lag of a million means those records are waiting, and the user-visible delay is roughly lag times your per-record time on that partition.",
      bullets: [
        "Measure per group. Another group's lag is not yours.",
        "Measure per partition. The max matters as much as the sum.",
        "A commit moves lag, not a fetch. Fetched-but-uncommitted records still count."
      ]
    },
    {
      heading: "Why it climbs",
      body: "The handler got slower: a database, a lock, a GC pause, a synchronous call to email. Or the producer got faster: a backfill, a sale, a retry storm. Or the consumer stopped: a deploy, a crash loop, an <b>rebalance</b> that revokes partitions and hands them out again. Or one record throws forever and, without a dead-letter path, the offset never passes it — lag on that partition grows without bound while the handler burns CPU on the same offset. Read the \"current offset\" and see whether it is moving. A moving offset with growing lag is \"too slow.\" A frozen offset is \"stuck.\"",
      bullets: [
        "Stuck offset: poison message, deadlock, or a consumer that is dead.",
        "Moving offset, rising lag: you are processing, and you are losing the race.",
        "A rebalance looks like a stuck group for as long as it takes to rejoin."
      ]
    },
    {
      heading: "Consumers cannot outnumber partitions",
      body: "Kafka assigns each partition to at most one consumer in the group. Six partitions and four consumers: four consumers work, and two of them may hold two partitions. Six partitions and ten consumers: four consumers sit idle. Adding instances past the partition count does not reduce lag. To use more consumers you add partitions, which you cannot do casually if key order matters — keys are remapped, and order during the move needs a plan. First make one record cheaper (batch the database writes, stop a remote call, raise a dead-letter so poison does not block). Then add partitions and consumers together.",
      bullets: [
        "Max useful consumers in a group = number of partitions.",
        "Idle consumers still join rebalances and make them slower.",
        "More partitions means more files and more broker load. It is not free."
      ]
    },
    {
      heading: "What you actually check",
      body: "Look at lag and whether the committed offset is advancing. Look at records processed per second and time spent in the handler. Look at consumer count versus partition count, and whether a rebalance is flapping (a slow poll, <code>max.poll.interval.ms</code> exceeded, because the handler blocked the poll thread). Look at broker health only after the consumer is innocent: under-replicated partitions and a dead leader stall everyone, but most lag incidents are a slow or stuck handler. Alert on lag slope or on time-to-catch-up, not on \"lag greater than zero,\" or you will page yourself on every normal burst."
    }
  ],

  keyTerms: [
    { term: "Consumer lag", def: "Log end offset minus the group's committed offset, usually reported per partition." },
    { term: "Log end offset", def: "The high end of the partition. Records at and above it do not exist yet." },
    { term: "Rebalance", def: "The group pausing to reassign partitions when consumers join, leave, or fail a poll." },
    { term: "Partition assignment", def: "Each partition is read by at most one consumer in a group at a time." },
    { term: "max.poll.interval", def: "How long a consumer may go between polls before the group decides it has died and rebalances." }
  ],

  tradeoffs: [
    { pro: "Lag is a direct, per-partition measure of delay.", con: "A single threshold pages on harmless bursts. Slope or age is the better alert." },
    { pro: "Adding consumers up to the partition count adds throughput.", con: "Past that count, extra instances only make rebalances heavier." },
    { pro: "More partitions let you add more consumers later.", con: "Raising partitions reshuffles keys and increases broker overhead." },
    { pro: "A dead-letter path lets the offset move past poison.", con: "You trade a stuck partition for a queue of bad records you still have to repair." }
  ],

  interviewTips: [
    "Define lag as log end offset minus committed offset, per partition, per group.",
    "Distinguish a frozen offset (stuck) from a moving offset that is still losing (too slow).",
    "You cannot usefully run more consumers than partitions. Say that before you say \"scale out.\"",
    "Check handler time, poison messages, and rebalance thrash before you blame the brokers.",
    "Alert on how fast lag is growing or how old the oldest uncommitted record is, not on lag above zero."
  ],

  scene: {
    nodes: [
      { id: "prod", label: "Producer", type: "service", pos: [-9, 0, -2] },
      { id: "p0", label: "P0 end 100", type: "queue", pos: [-3.5, 0, -3] },
      { id: "p1", label: "P1 end 100", type: "queue", pos: [-3.5, 0, 2.5] },
      { id: "c0", label: "Consumer at 40", type: "worker", pos: [2.5, 0, -3] },
      { id: "c1", label: "Consumer at 90", type: "worker", pos: [2.5, 0, 2.5] },
      { id: "idle", label: "Idle consumer", type: "server", pos: [7.5, 0, 0], showAt: 3 },
      { id: "n0", label: "Lag 60 and 10", type: "note", pos: [2, 0, -7] },
      { id: "n1", label: "No partition left", type: "note", pos: [8, 0, -6.5], showAt: 3 }
    ],
    edges: [
      { from: "prod", to: "p0" },
      { from: "prod", to: "p1" },
      { from: "p0", to: "c0", label: "lag 60" },
      { from: "p1", to: "c1", label: "lag 10" }
    ],
    steps: [
      {
        title: "Subtract the offsets",
        text: "Partition 0's log ends at 100 and the group has committed 40, so lag is 60. Partition 1 ends at 100 and is committed at 90, so lag is 10. The group lag is 70, and the pain is on P0.",
        highlight: ["p0", "p1", "c0", "c1", "n0"],
        flows: [
          { from: "p0", to: "c0", color: "#f87171", label: "60 behind" },
          { from: "p1", to: "c1", color: "#4ade80", label: "10 behind" }
        ]
      },
      {
        title: "Is the offset moving?",
        text: "If consumer 0 stays at 40, it is stuck: poison record, deadlock, or a dead process. If 40 becomes 41, 42, 43 while the end races to 200, it is slow, not stuck. Those are different fixes.",
        highlight: ["c0", "p0"],
        flows: [{ from: "prod", to: "p0", color: "#fb923c", label: "still writing" }]
      },
      {
        title: "A rebalance pauses both",
        text: "A deploy or a missed poll revokes partitions. Lag climbs because nobody is committing, even though the handlers are fine. Flapping means max.poll.interval is too small for the work you do inside the poll loop.",
        highlight: ["c0", "c1", "p0", "p1"],
        flows: []
      },
      {
        title: "A third consumer has nothing to read",
        text: "Two partitions, two active consumers. A third instance joins the group and stays idle. It cannot take half of P0. Lag on P0 does not fall.",
        highlight: ["idle", "c0", "p0", "n1"],
        flows: []
      },
      {
        title: "Make the record cheaper, or add a partition",
        text: "Speed up the handler, or dead-letter the poison offset, before you add partitions. More partitions let a new consumer do real work. More consumers alone, past the partition count, only join the next rebalance.",
        highlight: ["c0", "p0", "idle", "prod"],
        flows: [{ from: "p0", to: "c0", color: "#4ade80", label: "catch up" }]
      }
    ]
  }
});
