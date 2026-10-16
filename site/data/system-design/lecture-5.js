window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 5,
  title: "What is a Message Queue?",
  video: "https://www.youtube.com/watch?v=oUJbuFMyBDk",
  category: "Building Blocks",
  tagline: "Ack the customer now, persist the task, and let a queue survive a dead shop.",
  summary: "A pizza counter takes the order, says 'sit down', and cooks from a list — the client is not stuck watching the oven. That list is a queue, and the work is asynchronous. A chain of shops then exposes the hard parts: a crash wipes an in-memory list, so orders must live in a database; a heartbeat notices the dead shop; naive replay duplicates pizzas. A message queue wraps persistence, assignment, load spreading, and retry into one component. RabbitMQ, ZeroMQ, JMS, and Amazon's queues are the usual boxes.",

  theory: [
    {
      heading: "Take the order, do not hand over the pizza yet",
      body: "At a counter, people keep arriving while pizzas are still in the oven. The cashier does not make the customer stand there until the food exists. They write the order down and answer with a confirmation: sit down, or come back later. The client is released from waiting on the slow part. The response they got is not the result; it is an acknowledgement that the work was accepted.",
      bullets: [
        "Fast reply: 'order placed', not 'pizza done'.",
        "The slow work happens after the client has walked away.",
        "That split is asynchronous processing."
      ]
    },
    {
      heading: "The list is the queue",
      body: "Someone has to remember order 1, order 2, and the rest, in sequence. That list is a queue of tasks. New orders are appended while the kitchen works the front. When a pizza is done it is removed from the list, the client pays, and both sides are finished. Producers (cashiers, clients) and consumers (cooks) do not have to run at the same speed. The queue absorbs the mismatch."
    },
    {
      heading: "Both sides spend their time better",
      body: "While the oven runs, the customer can look at their phone or step outside. The kitchen can also reorder the list: a pizza promised immediately jumps ahead, and an easy job like filling a coke can be slipped in. Priority is just a policy on the same queue. Asynchronous work is what makes both the reordering and the free customer possible — neither side is blocked on the other's clock."
    },
    {
      heading: "A chain of shops, and a power cut",
      body: "Success looks like several outlets, each with its own clients. Then assume the worst: shop 3 loses power. Walk-in orders at that counter can be dropped. Delivery orders are already paid for in expectation, so they should move to shop 1 or shop 2. An in-memory list cannot do that. When the electricity goes, the computer goes, and the list goes with it. The orders need <b>persistence</b> — a database row with the order id, the contents, and a done flag — so a dead shop does not delete work that another shop could finish."
    },
    {
      heading: "A heartbeat finds the corpse",
      body: "Picture four servers and a database of open orders, some tagged with the server currently cooking them (3 and 8 on one box, 9 and 11 on S3). A notifier asks every server for a heartbeat, in the lecture every 15 seconds. Silence means that server is treated as dead. The notifier then reads the database for that server's unfinished orders and hands them to the survivors. Detection and reassignment are now explicit instead of 'hope the cook comes back'."
    },
    {
      heading: "Reassignment can duplicate the pizza",
      body: "The dangerous bug: order 3 is still cooking on S2, but the sweep also picks it up as not-done and gives a copy to S1. Two shops deliver one order. You lose money and you confuse the customer. The lecture's cure is the assignment rule from the hashing lectures. Each server owns a set of buckets. When S3 dies, S1 and S2 keep their old buckets and only gain new ones. Order 3 still belongs to S2's buckets, so it is not handed out again. Orders 9 and 11, which lived on the dead server's buckets, move. Load spreads, and duplicates do not.",
      bullets: [
        "Balance the load.",
        "Do not deliver the same task to two workers.",
        "Consistent hashing gives you both, because ownership only grows on failure — it does not reshuffle."
      ]
    },
    {
      heading: "One component that holds the whole mess",
      body: "Persistence, assignment, load spreading, heartbeats, and 'this is taking too long, try someone else' are one product problem. A <b>message queue</b> (here, really a task queue) accepts tasks, stores them, gives each to a worker, and waits for an acknowledgement. If the ack never arrives it decides the worker is dead and assigns the task again, using whatever strategy you configured — the same way a load balancer has many strategies. The pizza shop wants exactly that box. In practice people reach for RabbitMQ, a library like ZeroMQ, JMS on the JVM, or a hosted queue such as Amazon's. The concept is the encapsulation: one place owns the complexity so the cooks and the cashiers stay simple."
    }
  ],

  keyTerms: [
    { term: "Acknowledgement", def: "The quick 'order placed' reply. It is not the finished pizza." },
    { term: "Asynchronous", def: "The client is free to do other work while the slow task runs later." },
    { term: "Queue", def: "An ordered list of tasks. Producers append; consumers take from the front and remove when done." },
    { term: "Priority", def: "A policy that reorders the queue so urgent or cheap tasks jump the line." },
    { term: "Persistence", def: "The queue lives in a database (or disk), so a crash does not erase accepted work." },
    { term: "Heartbeat", def: "A periodic ping, every 15 seconds in the lecture. No answer means the worker is treated as dead." },
    { term: "Duplicate delivery", def: "The same open task given to two workers. Hash-based ownership prevents it." },
    { term: "Task queue", def: "A message queue used for work items: store, assign, wait for ack, reassign on timeout." },
    { term: "RabbitMQ / JMS / SQS", def: "Concrete queues. ZeroMQ is a library for building the same pattern." }
  ],

  tradeoffs: [
    { pro: "Clients stay fast and workers drain tasks at their own pace.", con: "The customer does not have the pizza yet — you owe them a later completion path." },
    { pro: "A durable queue lets another shop finish a dead shop's deliveries.", con: "You must define 'done' carefully or a retry cooks the same order twice." },
    { pro: "Heartbeats plus ack timeouts detect dead workers without a human.", con: "A slow worker can look dead, so the task runs twice unless ownership or idempotency stops it." },
    { pro: "One queue product hides assignment, storage, and retry.", con: "The queue itself can become the thing you have to scale, monitor, and fail over." }
  ],

  interviewTips: [
    "Tell the pizza story in under a minute: ack now, cook from a list, client does something else.",
    "Say why memory is not enough: the shop that crashes is the one whose orders you most need to keep.",
    "Draw the duplicate bug (order 3 on S2 and again on S1) before you mention the fix. Interviewers want the failure mode.",
    "Tie the fix back to consistent hashing: survivors keep their buckets and only inherit the dead server's buckets.",
    "Name the box you would actually use — RabbitMQ, SQS, Kafka when the log matters — and what you still must make idempotent."
  ],

  scene: {
    nodes: [
      { id: "c1", label: "Client 1", type: "user", pos: [-10, 0, -3] },
      { id: "c2", label: "Client 2", type: "user", pos: [-10, 0, 1], showAt: 1 },
      { id: "till", label: "Counter", type: "server", pos: [-6, 0, -1] },
      { id: "q", label: "Order queue", type: "queue", pos: [-2, 0, -1], showAt: 1 },
      { id: "chef", label: "Kitchen", type: "worker", pos: [2, 0, -1], showAt: 1 },
      { id: "noteAck", label: "Reply is 'placed', not the pizza", type: "note", pos: [-8, 3.2, -5] },

      { id: "notePrio", label: "Coke can jumps a slow pizza", type: "note", pos: [-2, 3.2, 2], showAt: 2 },

      { id: "z1", label: "Shop 1", type: "zone", pos: [-4, 0, 5], size: [5, 3], showAt: 3 },
      { id: "z2", label: "Shop 2", type: "zone", pos: [1.5, 0, 5], size: [5, 3], showAt: 3 },
      { id: "z3", label: "Shop 3", type: "zone", pos: [7, 0, 5], size: [5, 3], showAt: 3 },
      { id: "sh1", label: "Shop 1", type: "server", pos: [-4, 0, 5], showAt: 3 },
      { id: "sh2", label: "Shop 2", type: "server", pos: [1.5, 0, 5], showAt: 3 },
      { id: "sh3", label: "Shop 3", type: "server", pos: [7, 0, 5], showAt: 3 },

      { id: "db", label: "Order DB", type: "db", pos: [4, 0, -4], showAt: 4 },
      { id: "noteDb", label: "id, contents, done?", type: "note", pos: [8, 2.6, -4], showAt: 4 },

      { id: "s1", label: "S1  #3 #8", type: "server", pos: [-2, 0, -4], showAt: 5 },
      { id: "s2", label: "S2  #20", type: "server", pos: [1, 0, -4], showAt: 5 },
      { id: "s3", label: "S3  #9 #11", type: "server", pos: [4, 0, -1], showAt: 5 },
      { id: "beat", label: "Heartbeat", type: "lb", pos: [8, 0, -1], showAt: 5 },
      { id: "noteBeat", label: "Ping every 15s", type: "note", pos: [10.5, 2.8, -1], showAt: 5 },

      { id: "noteDup", label: "Order 3 cooked twice", type: "note", pos: [-2, 3.3, -6], showAt: 6 },

      { id: "mq", label: "Task queue", type: "queue", pos: [0, 0, 0], showAt: 7, color: "#fb923c" },
      { id: "noteMq", label: "Store + assign + ack + retry", type: "note", pos: [0, 3.4, 2.5], showAt: 7 }
    ],
    edges: [
      { from: "c1", to: "till", label: "order" },
      { from: "c2", to: "till", showAt: 1 },
      { from: "till", to: "q", showAt: 1 },
      { from: "q", to: "chef", label: "next", showAt: 1 },
      { from: "sh1", to: "db", showAt: 4 },
      { from: "sh2", to: "db", showAt: 4 },
      { from: "sh3", to: "db", showAt: 4 },
      { from: "beat", to: "s1", showAt: 5, dashed: true },
      { from: "beat", to: "s2", showAt: 5, dashed: true },
      { from: "beat", to: "s3", showAt: 5, dashed: true },
      { from: "s1", to: "db", showAt: 5 },
      { from: "s2", to: "db", showAt: 5 },
      { from: "s3", to: "db", showAt: 5 },
      { from: "c1", to: "mq", showAt: 7 },
      { from: "mq", to: "s1", showAt: 7 },
      { from: "mq", to: "s2", showAt: 7 },
      { from: "mq", to: "chef", showAt: 7 }
    ],
    steps: [
      {
        title: "Ack now, pizza later",
        text: "The client asks for a pizza and is told the order is placed. They are not held at the counter until the oven finishes. The reply is a confirmation, not the food.",
        highlight: ["c1", "till"],
        hide: ["q", "chef", "c2"],
        flows: [
          { from: "c1", to: "till", color: "#4ade80", label: "order" },
          { from: "till", to: "c1", color: "#60a5fa", label: "ack" }
        ]
      },
      {
        title: "A list the kitchen drains",
        text: "Orders pile onto a queue while the cook works the front. A second client is accepted without stopping the pizza already in progress. Finished work is removed from the list.",
        highlight: ["q", "chef"],
        flows: [
          { from: "c2", to: "till", color: "#4ade80" },
          { from: "till", to: "q", color: "#fb923c", label: "#2" },
          { from: "q", to: "chef", color: "#fb923c", label: "#1" }
        ]
      },
      {
        title: "Both sides get their time back",
        text: "The client does something else while they wait. The kitchen reorders the queue: a fast coke can jump ahead of a slow pizza. Async is what makes the priority swap possible.",
        highlight: ["c1", "q", "notePrio"]
      },
      {
        title: "Shop 3 goes dark",
        text: "A chain of three outlets. Shop 3 loses power. Walk-in tickets there can be dumped. Delivery orders should move to a living shop — if you still have them.",
        highlight: ["sh1", "sh2"],
        fail: ["sh3"],
        hide: ["q", "chef", "till", "c2", "notePrio"]
      },
      {
        title: "Memory dies with the power",
        text: "An in-memory list vanishes in the outage. Put the queue in a database: order id, contents, and whether it is done. Another shop can now read what shop 3 will never finish.",
        highlight: ["db"],
        fail: ["sh3"],
        hide: ["q", "chef", "till", "notePrio"],
        flows: [
          { from: "sh3", to: "db", color: "#f87171", label: "lost if only RAM" },
          { from: "db", to: "sh1", color: "#c084fc", label: "replay" }
        ]
      },
      {
        title: "Heartbeat every 15 seconds",
        text: "Four workers, orders stuck on specific servers: 9 and 11 sit on S3. A notifier pings each box. No reply, and S3 is declared dead. Unfinished rows are read back out of the database.",
        highlight: ["beat", "s3"],
        fail: ["s3"],
        hide: ["sh1", "sh2", "sh3", "z1", "z2", "z3", "q", "chef", "till", "c2", "notePrio", "noteAck"],
        flows: [
          { from: "beat", to: "s1", color: "#60a5fa" },
          { from: "beat", to: "s3", color: "#f87171", label: "silent" }
        ]
      },
      {
        title: "Order 3 gets cooked twice",
        text: "A naive sweep hands every not-done row out again. S2 is still making order 3, and S1 receives a copy. Two pizzas, one customer. Assignment has to know who already owns the bucket.",
        highlight: ["s1", "s2"],
        hide: ["sh1", "sh2", "sh3", "z1", "z2", "z3", "q", "chef", "till", "c2", "notePrio", "noteAck"],
        flows: [
          { from: "db", to: "s1", color: "#f87171", label: "#3 again" },
          { from: "db", to: "s2", color: "#4ade80", label: "#3" }
        ]
      },
      {
        title: "One queue owns the whole job",
        text: "A task queue stores the work, assigns it, waits for the ack, and on timeout gives it to the next worker. Buckets stay put when a peer dies, so duplicates stop. RabbitMQ, JMS, ZeroMQ, or SQS is that box.",
        highlight: ["mq"],
        hide: ["till", "q", "sh1", "sh2", "sh3", "z1", "z2", "z3", "c2", "notePrio", "noteAck", "noteDup", "beat"],
        flows: [
          { from: "c1", to: "mq", color: "#4ade80", label: "task" },
          { from: "mq", to: "chef", color: "#fb923c", label: "assign" },
          { from: "chef", to: "mq", color: "#60a5fa", label: "ack" }
        ]
      }
    ]
  }
});