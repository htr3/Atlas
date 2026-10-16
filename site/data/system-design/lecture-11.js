window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 11,
  title: "What is the Publisher Subscriber Model?",
  video: "https://www.youtube.com/watch?v=FMhbR_kQeHw",
  category: "Communication",
  tagline: "Fire-and-forget messages beat chained RPCs — until money needs atomicity.",
  summary: "A request-response mesh of microservices looks simple until one downstream timeout poisons a request that already committed. The publisher-subscriber model inserts a durable broker so producers can ack the client immediately and subscribers consume when they are ready. That decoupling scales and simplifies interfaces, but it drops atomicity — a bank-transfer example shows how retries and non-idempotent handlers invent money.",

  theory: [
    {
      heading: "Chained request-response",
      body: "Start with five services. The client talks only to <b>S1</b>. After S1 handles the call it must notify <b>S0</b> and <b>S2</b>; after S2 finishes it must notify <b>S3</b> and <b>S4</b>. Order among each pair does not matter — either sibling can run first. The naive design is still request-response: S1 calls S0 and S2 (ideally in parallel) and S2 calls S3 and S4, then everyone waits for success before the original client is answered.",
      bullets: [
        "Fan-out is a tree of RPCs, not a single hop.",
        "Even async calls often wait for every child before returning.",
        "The client’s success is coupled to the slowest, unluckiest leaf."
      ]
    },
    {
      heading: "Timeouts turn into duplicate writes",
      body: "If <b>S4 crashes</b>, S2 sits on a timeout, then S1 times out, then the phone shows failure. S1 may already have committed its own database change. A retry from the client runs S1 again and S2 again — two places now apply the same business action twice. The failure was slow <i>and</i> it left stale, half-applied state. Request-response across services has no good answer for “I succeeded locally but my downstream did not.”",
      bullets: [
        "The timeout path is often longer than the success path.",
        "Partial success plus retry is how you get double charges."
      ]
    },
    {
      heading: "Publish, persist, forget",
      body: "A <b>publisher-subscriber</b> design puts a message broker (Kafka, RabbitMQ, and friends) between services. S1 writes a message and is done — <i>fire and forget</i>. It can ack the client as soon as the broker has durably accepted the payload. The broker stores the message and pushes it to S0 and S2 when they are alive. S2 does the same into a second topic for S3 and S4. If S2 is down, the broker <b>replays</b> later; S1 does not block.",
      bullets: [
        "The broker owns retry, persistence, and fan-out.",
        "Producers speak one generic message shape; consumers pick the fields they need.",
        "A new S6 that cares about S1’s events just subscribes — S1 never learns S6 exists."
      ]
    },
    {
      heading: "What you gain",
      body: "Responsibilities collapse: S1 no longer babysits S2. Many pairwise interfaces become <b>one</b> publish API. Because the broker does not drop accepted messages, a client success is a loose <b>at-least-once</b> promise that S3 and S4 will eventually see the event. Debugging also gets easier in one sense — instead of a web of timeouts you have a single place that must stay up. Adding subscribers is a registration change, not a redeploy of the producer.",
      bullets: [
        "Decoupling: producer lifetime is independent of consumer lifetime.",
        "One interface instead of N stub libraries.",
        "Eventual fan-out is how Twitter-style “one post, many readers” is built."
      ]
    },
    {
      heading: "The finance counter-example",
      body: "Atomicity does not survive this model. Picture a gateway (S1), an invoice/commission service (S0), and a fund-transfer service (S2). Account A holds <b>1000</b>. The client asks to send <b>950</b>; the bank takes a <b>50</b> commission. Honest outcome: A is empty and B has 950. The gateway publishes both legs. S0 immediately deducts 50 and emails a receipt. S2 is down, so the 950 never leaves. Balance is 950 with no transfer. The impatient client retries an <b>800</b> transfer (plus another 50 fee). S0 sees 950, thinks 850 is enough, deducts another 50 → <b>900</b>. When S2 finally wakes it has two jobs: 950 (fails, only 900 left) and 800 (succeeds → <b>100</b> left). Expected leftover was 0; the second transfer should have been rejected. Cross-service “transactions” via pub/sub are not transactions.",
      bullets: [
        "Commission and transfer are one business action, two messages.",
        "Retries plus independent consumers reorder and duplicate work.",
        "Mission-critical money movement wants a single atomic boundary."
      ]
    },
    {
      heading: "Idempotency is your problem",
      body: "Brokers typically give <b>at-least-once</b> delivery, not exactly-once. If S2 debits 50, then fails while publishing the next event, a replay debits 50 again. The architecture will not save you. Handlers must key off a <b>request id</b> (or similar idempotency token) and ignore duplicates. That is application logic. Pub/sub is a great fit for analytics, game events, and tweet fan-out. It is a poor fit for “this ledger line happens once or not at all.”",
      bullets: [
        "Treat every consumer as able to see the same message twice.",
        "Pass a stable id and make the write conditional on it."
      ]
    }
  ],

  keyTerms: [
    { term: "Publisher", def: "Service that emits a message and does not wait for each consumer to finish." },
    { term: "Subscriber", def: "Service that registers interest in a topic and consumes messages at its own pace." },
    { term: "Message broker", def: "Durable middleman (Kafka, RabbitMQ) that stores, retries, and fans out messages." },
    { term: "Fire-and-forget", def: "Producer considers work done once the broker has accepted the message." },
    { term: "At-least-once", def: "A message that was accepted will be delivered one or more times; duplicates are possible." },
    { term: "Replay", def: "Re-delivering stored messages to a consumer that was down or is catching up." },
    { term: "Idempotency", def: "Applying the same request twice leaves state as if it ran once — usually via a request id." },
    { term: "Fan-out", def: "One published event copied to every current subscriber, including ones added later." }
  ],

  tradeoffs: [
    { pro: "Producers ack the client as soon as the broker has the message — no downstream timeout on the hot path.", con: "The client success is not a completed business transaction; downstream work is only eventual." },
    { pro: "One publish interface; new subscribers (S6) register without changing S1.", con: "You lose fine-grained, per-consumer contracts and it is easier to ship a bloated generic payload." },
    { pro: "Broker persistence plus replay hides consumer crashes from the caller.", con: "No atomicity across S0 and S2 — the bank example ends with 100 left instead of 0." },
    { pro: "A single broker is easier to reason about than a mesh of pairwise timeouts.", con: "That broker is now a concentrated failure domain, and at-least-once still requires idempotent handlers." }
  ],

  interviewTips: [
    "Draw the RPC tree first, then replace each coupling with a topic — interviewers want to see you knew why the broker appeared.",
    "Say out loud: client 200 means “broker has the event,” not “S3 and S4 committed.”",
    "When money or inventory is involved, name the atomicity hole and propose an outbox, saga, or a single service that owns the write.",
    "Always mention idempotency keys on consumers; “Kafka will deliver once” is a trap answer.",
    "Name a good fit (tweet fan-out, game telemetry) and a bad fit (fund transfer) in the same breath."
  ],

  scene: {
    nodes: [
      { id: "zone", label: "Microservice mesh", type: "zone", pos: [1, 0, 1], size: [18, 14] },
      { id: "phone", label: "Client", type: "phone", pos: [-11, 0, 0] },
      { id: "s1", label: "S1 Gateway", type: "service", pos: [-6, 0, 0] },
      { id: "s0", label: "S0 Invoice", type: "service", pos: [2, 0, -5] },
      { id: "s2", label: "S2 Funds", type: "service", pos: [2, 0, 4] },
      { id: "s3", label: "S3", type: "service", pos: [8, 0, 1] },
      { id: "s4", label: "S4", type: "service", pos: [8, 0, 6] },
      { id: "mb1", label: "Kafka / RabbitMQ", type: "queue", pos: [-1, 0, 0], showAt: 4 },
      { id: "mb2", label: "Broker 2", type: "queue", pos: [5, 0, 4], showAt: 5 },
      { id: "s6", label: "S6 Analytics", type: "service", pos: [2, 0, 0], showAt: 6 },
      { id: "note_order", label: "Order of S0 / S2 is free", type: "note", pos: [2, 3, -5], showAt: 1 },
      { id: "note_to", label: "S4 crash → client timeout", type: "note", pos: [8, 3, 6], showAt: 3 },
      { id: "note_ff", label: "Fire-and-forget + persist", type: "note", pos: [-1, 3, 0], showAt: 4 },
      { id: "note_money", label: "A: 1000 Rs → leftover 100", type: "note", pos: [-6, 3, -5], showAt: 7 },
      { id: "note_idemp", label: "Debits need a request ID", type: "note", pos: [5, 3, -2], showAt: 8 }
    ],
    edges: [
      { from: "phone", to: "s1", label: "HTTP" },
      { from: "s1", to: "s0", label: "RPC", showAt: 1 },
      { from: "s1", to: "s2", label: "RPC", showAt: 1 },
      { from: "s2", to: "s3", label: "RPC", showAt: 2 },
      { from: "s2", to: "s4", label: "RPC", showAt: 2 },
      { from: "s1", to: "mb1", label: "publish", showAt: 4 },
      { from: "mb1", to: "s0", label: "deliver", showAt: 4 },
      { from: "mb1", to: "s2", label: "deliver", showAt: 4 },
      { from: "s2", to: "mb2", label: "publish", showAt: 5 },
      { from: "mb2", to: "s3", label: "deliver", showAt: 5 },
      { from: "mb2", to: "s4", label: "deliver", showAt: 5 },
      { from: "mb1", to: "s6", label: "fan-out", showAt: 6 }
    ],
    steps: [
      {
        title: "Five services, one client",
        text: "S1–S4 (and S0) form a microservice mesh. The phone only talks to S1. After S1 mutates its own state it still has to tell other services — that is the whole problem this lecture solves.",
        highlight: ["phone", "s1"],
        flows: [{ from: "phone", to: "s1", color: "#4ade80", label: "req" }]
      },
      {
        title: "Fan-out, order does not matter",
        text: "S1 must notify S0 and S2. Either can run first. In a request-response world that is two RPCs, hopefully issued in parallel, then a wait for both replies.",
        highlight: ["s1", "s0", "s2", "note_order"],
        flows: [
          { from: "s1", to: "s0", color: "#4ade80", label: "msg" },
          { from: "s1", to: "s2", color: "#4ade80", label: "msg" }
        ]
      },
      {
        title: "The tree grows",
        text: "S2 then notifies S3 and S4 — again, order is irrelevant. S2 still waits for both children before it can answer S1, which is still waiting to answer the phone.",
        highlight: ["s2", "s3", "s4"],
        flows: [
          { from: "s2", to: "s3", color: "#4ade80", label: "msg" },
          { from: "s2", to: "s4", color: "#4ade80", label: "msg" }
        ]
      },
      {
        title: "S4 dies, everyone times out",
        text: "S4 is down. S2 waits, then times out to S1, then the client fails — slowly. S1 already wrote its database. A retry will write again in S1 and S2. Partial success plus a long timeout is worse than a fast failure.",
        highlight: ["s2", "s1", "phone", "note_to"],
        fail: ["s4"],
        flows: [{ from: "s2", to: "s4", color: "#f87171", label: "timeout" }]
      },
      {
        title: "Insert a durable broker",
        text: "S1 publishes to Kafka/RabbitMQ and acks the phone as soon as the broker has the bytes. Fire-and-forget: S1 is no longer on the hook for S0 or S2 being alive.",
        highlight: ["s1", "mb1", "phone", "note_ff"],
        flows: [
          { from: "s1", to: "mb1", color: "#4ade80", label: "publish" },
          { from: "s1", to: "phone", color: "#60a5fa", label: "200" }
        ]
      },
      {
        title: "Broker retries, S2 publishes onward",
        text: "If S2 was down, the broker holds and replays. When S2 is healthy it publishes to a second broker that fans out to S3 and S4. Persistence plus replay is the loose guarantee that work will finish later.",
        highlight: ["mb1", "s2", "mb2", "s3", "s4"],
        flows: [
          { from: "mb1", to: "s2", color: "#fb923c", label: "replay" },
          { from: "s2", to: "mb2", color: "#4ade80", label: "publish" },
          { from: "mb2", to: "s3", color: "#fb923c", label: "deliver" },
          { from: "mb2", to: "s4", color: "#fb923c", label: "deliver" }
        ]
      },
      {
        title: "S6 just subscribes",
        text: "A new analytics service cares about S1’s events. Register S6 on the broker. S1 never changes, never knows the subscriber list, and still publishes one generic blob. That is the developer win.",
        highlight: ["s1", "mb1", "s6"],
        flows: [
          { from: "s1", to: "mb1", color: "#4ade80", label: "event" },
          { from: "mb1", to: "s6", color: "#c084fc", label: "copy" },
          { from: "mb1", to: "s0", color: "#c084fc", label: "copy" },
          { from: "mb1", to: "s2", color: "#c084fc", label: "copy" }
        ]
      },
      {
        title: "Bank transfer: two messages, one lie",
        text: "A has 1000 Rs. Send 950 plus a 50 commission. S0 (invoice) deducts 50 and emails. S2 (funds) is down, so 950 never moves. The client retries an 800 send; S0 deducts another 50. Independent consumers just broke a single business action.",
        highlight: ["phone", "s1", "s0", "s2", "note_money"],
        fail: ["s2"],
        flows: [
          { from: "phone", to: "s1", color: "#4ade80", label: "xfer 950" },
          { from: "mb1", to: "s0", color: "#fb923c", label: "fee 50" },
          { from: "mb1", to: "s2", color: "#f87171", label: "blocked" }
        ]
      },
      {
        title: "Leftover 100, and replay debit",
        text: "S2 wakes with both 950 (fails, only 900 left) and 800 (succeeds). A has 100 instead of 0. Separately, a non-idempotent debit of 50 will run twice on replay unless the message carries a request id. Pub/sub is for tweets and game events — not ledgers — unless you add atomicity and idempotency yourself.",
        highlight: ["s0", "s2", "note_money", "note_idemp"],
        flows: [
          { from: "mb1", to: "s2", color: "#fb923c", label: "950 fail" },
          { from: "mb1", to: "s2", color: "#4ade80", label: "800 ok" }
        ]
      }
    ]
  }
});
