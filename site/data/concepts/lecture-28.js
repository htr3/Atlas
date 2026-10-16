window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 28,
  title: "The Saga Pattern",
  category: "Service Patterns",
  tagline: "A business transaction spread across services — each step commits, and failure runs compensations, not a two-phase commit.",
  summary: "A saga is a sequence of local transactions in different services. Place order, reserve stock, take payment, book a shipment. Each step commits in its own database. If payment fails, you do not roll back a distributed lock; you run a compensating action (release the stock, cancel the order). Orchestration uses a coordinator. Choreography uses events. Two-phase commit across those databases is the thing you are refusing.",

  theory: [
    {
      heading: "Local commits, one business outcome",
      body: "Orders, inventory, and payments do not share a database, so they cannot share a transaction. A <b>saga</b> still wants one outcome: the order is placed and paid, or it is as if you never started. Each service performs its own commit. The saga is the list of those commits plus the rule for what to do when step three fails after step one and two succeeded.",
      bullets: [
        "There is no global rollback. Committed stock is released by a new action, not by aborting the insert.",
        "The user-visible result can be \"pending\" until the saga finishes.",
        "Design every step to be safe to retry. The network will duplicate a call."
      ]
    },
    {
      heading: "Compensations are new transactions",
      body: "Reserve stock is undone by release stock. A captured payment is undone by a refund, which is not the same as never charging. Some steps cannot be perfectly reversed (an email already sent, a truck already dispatched). Name those. A compensation can also fail, so it needs the same retries and a human path. If you draw a saga without the undo arrows, you have drawn a happy path.",
      bullets: [
        "Compensation is domain language: refund, restock, cancel. Not \"rollback.\"",
        "Order the undos in reverse.",
        "A step with no compensation must be last, or you must accept the leftover effect."
      ]
    },
    {
      heading: "Orchestration versus choreography",
      body: "An <b>orchestrator</b> (an order process, often a state machine) tells inventory to reserve, then payments to charge, then shipping to book, and on failure tells them to compensate. The flow is readable and lives in one place. <b>Choreography</b> has no boss: inventory emits \"reserved,\" payments listen and emit \"charged,\" shipping listens. Fewer central bottlenecks, and nobody can point at the picture of the whole saga. Use orchestration when the flow is the product. Use choreography when each service already reacts to facts and the chain is short.",
      bullets: [
        "Orchestrator state must be durable. A crashed coordinator resumes; it does not start a second saga blindly.",
        "Choreography needs correlation ids so events of one order are not mixed with another.",
        "Either style still needs idempotent handlers."
      ]
    },
    {
      heading: "Why this is not two-phase commit",
      body: "Two-phase commit asks every database to prepare, then commit, and holds locks while the coordinator is slow or dead. Across teams and networks that lock window becomes an outage. A saga allows a moment where stock is reserved and payment has not happened. That interim state is visible and must be allowed by the business (a hold, not a sale). If the business cannot tolerate an interim state, you are not allowed to split the data this way."
    }
  ],

  keyTerms: [
    { term: "Saga", def: "A sequence of local transactions that together complete a business action, with compensations for failure." },
    { term: "Compensation", def: "A new local transaction that undoes the business effect of an earlier step." },
    { term: "Orchestration", def: "A coordinator explicitly calls each participant and decides the next step or the undo." },
    { term: "Choreography", def: "Participants react to each other's events. There is no central controller of the saga." },
    { term: "Interim state", def: "A committed step whose business outcome is not final yet, such as stock on hold before payment." }
  ],

  tradeoffs: [
    { pro: "Each service keeps its own database and its own commits.", con: "You must design compensations, and some real-world steps do not undo cleanly." },
    { pro: "An orchestrator makes the flow testable and visible.", con: "The orchestrator is another service that can stall every order if you let it." },
    { pro: "Choreography avoids a central boss.", con: "The end-to-end story is scattered, and a missing listener fails quietly." },
    { pro: "You avoid distributed locks.", con: "Users and support staff will see pending and reversed orders. The product has to allow that." }
  ],

  interviewTips: [
    "Say no to two-phase commit across services, then draw the steps and the compensations.",
    "Pick orchestration or choreography and give the reason. Do not claim both are the same.",
    "Make every handler idempotent. A retried \"reserve\" must not reserve twice.",
    "Call out a step you cannot undo, and put it last or keep it inside one service.",
    "The interim state is a product requirement. If they forbid it, the data should not have been split."
  ],

  scene: {
    nodes: [
      { id: "orch", label: "Orchestrator", type: "worker", pos: [-2, 0, 0] },
      { id: "order", label: "Orders", type: "service", pos: [-7.5, 0, -3] },
      { id: "stock", label: "Inventory", type: "service", pos: [3.5, 0, -3.2] },
      { id: "pay", label: "Payments", type: "service", pos: [3.5, 0, 3.2], showAt: 1 },
      { id: "ship", label: "Shipping", type: "service", pos: [-7.5, 0, 3.2], showAt: 2 },
      { id: "n0", label: "Local commits only", type: "note", pos: [0, 0, -7] },
      { id: "n1", label: "Refund, don't rollback", type: "note", pos: [8, 0, 0], showAt: 4 }
    ],
    edges: [
      { from: "orch", to: "order", label: "create" },
      { from: "orch", to: "stock", label: "reserve" },
      { from: "orch", to: "pay", label: "charge", showAt: 1 },
      { from: "orch", to: "ship", label: "book", showAt: 2 },
      { from: "orch", to: "stock", label: "release", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Start with two local commits",
        text: "The orchestrator asks orders to create a pending order and inventory to reserve stock. Each commit is local. There is no distributed transaction wrapping them.",
        highlight: ["orch", "order", "stock", "n0"],
        flows: [
          { from: "orch", to: "order", color: "#4ade80", label: "create" },
          { from: "orch", to: "stock", color: "#60a5fa", label: "reserve" }
        ]
      },
      {
        title: "Charge in payments",
        text: "Payments commits a charge in its own database. Stock is already held. That gap is the interim state: reserved, not yet paid.",
        highlight: ["orch", "pay", "stock"],
        flows: [{ from: "orch", to: "pay", color: "#facc15", label: "charge" }]
      },
      {
        title: "Book the shipment last",
        text: "Shipping is hard to undo, so it runs after payment succeeds. A truck is not step one.",
        highlight: ["orch", "ship", "pay"],
        flows: [{ from: "orch", to: "ship", color: "#4ade80", label: "book" }]
      },
      {
        title: "Payment failed",
        text: "The charge was declined. Orders and inventory have already committed. The orchestrator does not roll back their databases.",
        highlight: ["pay", "orch", "stock"],
        fail: ["pay"],
        flows: [{ from: "orch", to: "pay", color: "#f87171", label: "declined" }]
      },
      {
        title: "Run the compensations",
        text: "Inventory releases the hold. Orders marks the order cancelled. If a charge had captured, payments would refund. The saga's failure path is those new transactions.",
        highlight: ["orch", "stock", "order", "n1"],
        flows: [
          { from: "orch", to: "stock", color: "#fb923c", label: "release" },
          { from: "orch", to: "order", color: "#fb923c", label: "cancel" }
        ]
      }
    ]
  }
});
