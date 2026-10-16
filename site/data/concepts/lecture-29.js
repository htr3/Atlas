window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 29,
  title: "CQRS",
  category: "Service Patterns",
  tagline: "Split the write model from the read model when the questions you ask do not match the way you store the truth.",
  summary: "Command Query Responsibility Segregation uses one model to change state and another to answer queries. Commands are \"place order\" and \"change address\" — they validate and write the source of truth. Queries are \"show the account page\" — they read a shape built for that screen, often from a different store that is updated asynchronously. The read side can lag. CQRS is not a default for CRUD; it is for when one table cannot serve both the rules and the screens.",

  theory: [
    {
      heading: "Commands change, queries do not",
      body: "A <b>command</b> is an intent: place this order, with these invariants (the SKU exists, the price is current, the address is in a country you ship to). It returns success or a rejection. A <b>query</b> returns data and changes nothing. When both go through the same row shape, you either cripple the write model with every column a screen might want, or you cripple the screen with joins the write path does not need. CQRS lets those models diverge.",
      bullets: [
        "The write model is small and strict.",
        "The read model is wide, denormalized, and boring.",
        "You do not run a business rule on the read model. It is a projection."
      ]
    },
    {
      heading: "The read side is a projection",
      body: "After a command commits, you publish what happened (\"order placed\"). A projector updates a read store: a document per account page, a search index, a counter of open orders. That update is asynchronous. A user who places an order and immediately refreshes might not see it. You design for that — read-your-writes by returning the command result, or by querying the write model for the actor's own fresh view — instead of pretending the projection is strongly consistent.",
      bullets: [
        "One event can feed several projections (screen, search, analytics).",
        "A broken projector is rebuilt by replaying events or by scanning the write database.",
        "The projection can be thrown away. The write log cannot."
      ]
    },
    {
      heading: "When it is worth it",
      body: "Use it when reads and writes scale differently (a feed read a thousand times per write), when the query shape is a painful join, or when different teams own the screen and the invariant. Do not use it for a form that saves a row and reads the same row back. Two models means two stores, a lag, and a class of bugs called \"the page is stale.\" If you cannot explain the lag to the product, you do not want CQRS.",
      bullets: [
        "A single database with a view is sometimes the whole trick, without a second service.",
        "CQRS does not require event sourcing. Events are a convenient bus, not a requirement.",
        "Commands stay on the service that owns the invariant."
      ]
    },
    {
      heading: "What people confuse it with",
      body: "Event sourcing stores every change as an event and rebuilds state by folding them. CQRS only says the read path and the write path differ. You can CQRS with a normal order table plus a denormalized account document. You can event-source without serving queries from a different model, and you will regret the operational cost. In an interview, separate the two. Then say how a user sees their own write before the projection catches up."
    }
  ],

  keyTerms: [
    { term: "Command", def: "A request that tries to change state and is either accepted or rejected. It is not a query." },
    { term: "Query", def: "A read that returns a model shaped for a question and does not change state." },
    { term: "Projection", def: "A read model updated from committed writes. It can be rebuilt." },
    { term: "Read-your-writes", def: "The caller who just succeeded sees that change, even if other readers still see the old projection." },
    { term: "Event sourcing", def: "Persisting state as a log of events. Often paired with CQRS, and not the same idea." }
  ],

  tradeoffs: [
    { pro: "Screens stop dictating the tables that enforce invariants.", con: "You operate two models and a pipeline between them." },
    { pro: "Read stores can be denormalized and scaled on their own.", con: "Stale reads are normal, and a product that forbids them cannot use an async projection." },
    { pro: "Projectors can be rebuilt from the write side.", con: "A bug in the projector silently serves wrong pages until someone notices." },
    { pro: "You can adopt it for one screen, not the whole company.", con: "Teams apply it to simple CRUD and drown in indirection." }
  ],

  interviewTips: [
    "Define command versus query first. Then say the models are allowed to look different.",
    "Explain staleness and how the user who just wrote still sees their change.",
    "CQRS is not event sourcing. Mention both only to separate them.",
    "Give a reason: read/write ratio, or a query that does not match the write tables.",
    "Say you would not use it for a settings page that reads and writes the same row."
  ],

  scene: {
    nodes: [
      { id: "user", label: "User", type: "user", pos: [-10, 0, 0] },
      { id: "cmd", label: "Command API", type: "service", pos: [-5, 0, -2.5] },
      { id: "write", label: "Order ledger", type: "db", pos: [-0.5, 0, -2.5] },
      { id: "bus", label: "Events", type: "queue", pos: [-0.5, 0, 1.5], showAt: 2 },
      { id: "proj", label: "Projector", type: "worker", pos: [4, 0, 1.5], showAt: 2 },
      { id: "read", label: "Account page", type: "storage", pos: [8.5, 0, 1.5], showAt: 2 },
      { id: "qapi", label: "Query API", type: "service", pos: [-5, 0, 3.5], showAt: 3 },
      { id: "n0", label: "Writes stay strict", type: "note", pos: [-4, 0, -7] }
    ],
    edges: [
      { from: "user", to: "cmd", label: "place order" },
      { from: "cmd", to: "write" },
      { from: "write", to: "bus", showAt: 2 },
      { from: "bus", to: "proj", showAt: 2 },
      { from: "proj", to: "read", showAt: 2 },
      { from: "user", to: "qapi", label: "show page", showAt: 3 },
      { from: "qapi", to: "read", showAt: 3 }
    ],
    steps: [
      {
        title: "A command hits the ledger",
        text: "Place order is validated and committed in the write model. The response can already tell this user the order exists. No screen layout was involved.",
        highlight: ["user", "cmd", "write", "n0"],
        flows: [
          { from: "user", to: "cmd", color: "#4ade80", label: "command" },
          { from: "cmd", to: "write", color: "#c084fc", label: "commit" }
        ]
      },
      {
        title: "Publish what happened",
        text: "The committed fact goes on a bus. The ledger does not know about the account page. If the bus is slow, the write has still succeeded.",
        highlight: ["write", "bus"],
        flows: [{ from: "write", to: "bus", color: "#fb923c", label: "order placed" }]
      },
      {
        title: "Project a page-shaped document",
        text: "The projector upserts a denormalized account view: recent orders, totals, names. That document is for reading. You would not enforce price rules on it.",
        highlight: ["bus", "proj", "read"],
        flows: [
          { from: "bus", to: "proj", color: "#fb923c", label: "event" },
          { from: "proj", to: "read", color: "#4ade80", label: "upsert" }
        ]
      },
      {
        title: "Queries skip the ledger",
        text: "The account page is served from the read model. Another user might not see the new order for a moment. The person who placed it was answered by the command.",
        highlight: ["user", "qapi", "read"],
        flows: [
          { from: "user", to: "qapi", color: "#60a5fa", label: "query" },
          { from: "qapi", to: "read", color: "#60a5fa", label: "doc" }
        ]
      },
      {
        title: "Rebuild if the page is wrong",
        text: "A bad projector can be dropped and replayed from the ledger or the event log. The read model is derived. The write model is not.",
        highlight: ["write", "proj", "read"],
        flows: [{ from: "write", to: "bus", color: "#facc15", label: "replay" }]
      }
    ]
  }
});
