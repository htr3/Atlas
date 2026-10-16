window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 14,
  title: "System Design Patterns you should Master Right Now",
  video: "https://www.youtube.com/watch?v=OdNpY3WQniQ",
  category: "Piyush Garg",
  tagline: "Five patterns in the order you hit them: split, isolate data, break circuits, log events, split reads.",
  summary: "A tour of five patterns, each one a reaction to the previous step. Choose microservices or a monolith. If you split, decide whether every service gets its own database (true isolation, but joins move into application code). Once services call each other, one dead service can cascade, so a circuit-breaker proxy sits in between with closed, open and half-open states. High-throughput systems such as orders and banking stop mutating a status column and append immutable events instead. With an event stream in place, CQRS gives writes and reads their own sides, as long as eventual consistency is acceptable.",

  theory: [
    {
      heading: "Pattern 1: microservices or monolith",
      body: "This is the first decision in any design. A <b>monolith</b> is one big server holding every route: auth, notifications, comments. It is easy to manage and can still scale by running more copies, but only as a whole. You cannot scale just auth. One bug in notifications that crashes the process takes the whole instance down. <b>Microservices</b> give each feature its own independent service. Auth, notifications (perhaps written in Rust or Python and deployed on another cloud), posts and comments are each built, deployed and scaled separately, and a crash in notifications leaves auth and comments running.",
      bullets: [
        "Microservice cost: many servers to operate.",
        "The bigger problem is how services talk to each other.",
        "Monolith cost: no per-feature scaling, and failure is all-or-nothing."
      ]
    },
    {
      heading: "Pattern 2: database per service",
      body: "Splitting the code does not split the data. In the lecture's example, auth, file-upload and notification services all share one Postgres. Auth owns <code>users</code>, uploads owns <code>uploads</code> with a <code>created_by</code> foreign key into users, and notifications reads users for names and emails. That works, but it is not real isolation: a bug in the file service could create users, and notifications could delete them. The shared database becomes the bottleneck. With <b>database per service</b>, each service owns its store and can pick the right engine. The lecture's illustrative picks are MongoDB for auth because its schema keeps changing, ClickHouse for notifications because they track open and click analytics, and Postgres for posts.",
      bullets: [
        "Each store gets its own indexes and its own scaling plan.",
        "Cost goes up because there are more databases to run.",
        "Piyush admits this choice still confuses him. A single shared database is a valid budget option."
      ]
    },
    {
      heading: "The price: joins move into application code",
      body: "Once user details live in the auth database and posts live in the posts database, the database cannot join them. The post service must ask the auth service for those users, wait for the reply, and merge the results in its own code. That <b>application-level join</b> is the main tradeoff of database per service. You get independent scaling, and you pay with extra network calls and merge logic."
    },
    {
      heading: "Pattern 3: circuit breaker",
      body: "Services that never call each other are pointless, so they do call each other. Say A needs data from B, B from C, and C from D. If D goes down, C cannot answer and fails, then B fails, then A fails. That chain is a <b>cascading failure</b>: being split into microservices did not save you, because the dependencies are indirect. The fix is a <b>circuit-breaker proxy</b> between caller and callee. Callers always talk to the proxy, and the proxy forwards to the real service while watching for failures over a set interval.",
      bullets: [
        "<b>Closed</b>: the service is healthy and requests flow through. This is the default.",
        "<b>Open</b>: failures keep happening, so the proxy stops forwarding and answers immediately. The faulty service gets room to recover instead of being retried over and over.",
        "<b>Half-open</b>: after a timer, the proxy lets a probe through. If the service is back, the breaker closes fully."
      ]
    },
    {
      heading: "Pattern 4: event sourcing",
      body: "High-throughput systems, such as many bank transactions or many e-commerce orders, often keep one <code>state</code> column and rewrite it: placed, out for delivery, shipping, shipped, delivered. Repeatedly mutating that row needs locks and logs, and at Amazon scale it becomes the bottleneck. <b>Event sourcing</b> keeps an <b>append-only, immutable event stream</b> instead. For example: 12:00 order placed, 12:10 ready to ship, 12:30 shipping. You never remove an entry. To get the current status, you read the log and take the latest event. Banks work the same way: they record plus and minus transactions instead of overwriting a $300 balance, and they compute the balance by running through the log. The events are the source of truth, which is where the name comes from.",
      bullets: [
        "No row locks for every status change.",
        "Simpler writes and a full history.",
        "Current state is derived by replaying, not stored."
      ]
    },
    {
      heading: "Pattern 5: CQRS",
      body: "<b>Command Query Responsibility Segregation</b> builds on the event stream. At Amazon scale, one database serving both writers (orders placed) and readers is a bottleneck. CQRS gives <b>commands</b> (create, update, delete) one side and <b>queries</b> (reads) another. A command becomes an event. Something then reads those events, <b>denormalizes</b> them and updates a read database, so queries get data that is already shaped for them. The catch is <b>eventual consistency</b>: a read can briefly lag the latest write. Use CQRS only when that is acceptable."
    },
    {
      heading: "How the five connect",
      body: "The order is a storyline. Pick microservices, and you face database per service. Isolated data brings application-level joins. Services calling each other brings cascade risk, which is what the circuit breaker is for. High throughput favours event sourcing over status mutation. Once you have an event stream, CQRS splits reads from writes. In an interview, name the problem each pattern solves before you name the pattern."
    }
  ],

  keyTerms: [
    { term: "Monolith", def: "One server containing every feature. Scales only as a whole; one crash downs all of it." },
    { term: "Microservice", def: "One independent service per feature. Built, deployed and scaled separately." },
    { term: "Database per service", def: "Each service owns its data store and engine (e.g. Mongo, ClickHouse, Postgres)." },
    { term: "Application-level join", def: "Fetching related data from another service and merging in code, because databases are separate." },
    { term: "Cascading failure", def: "One dead dependency makes its callers fail, and their callers, up the chain." },
    { term: "Circuit breaker", def: "A proxy that stops calls to a failing service and retries with a half-open probe later." },
    { term: "Half-open", def: "Breaker state that lets a test request through to see if the service recovered." },
    { term: "Event sourcing", def: "Append-only immutable events are the source of truth; current state is replayed from them." },
    { term: "CQRS", def: "Separate write (command) and read (query) sides; reads are fed from events and are eventually consistent." }
  ],

  tradeoffs: [
    { pro: "Microservices isolate crashes and scale per feature.", con: "More servers to run, and service-to-service communication becomes a design problem." },
    { pro: "Database per service gives true isolation and the best engine per job.", con: "Higher cost, and joins move into application code." },
    { pro: "A circuit breaker stops a cascade and lets a failing service recover.", con: "While open, callers get a fallback or an error instead of real data." },
    { pro: "Event sourcing avoids lock-heavy status updates and keeps full history.", con: "Current state must be derived by replaying the log." },
    { pro: "CQRS gives each side a store optimized for its job.", con: "Reads are eventually consistent with writes." }
  ],

  interviewTips: [
    "Open with monolith vs microservices and justify it. Do not default to microservices for a small team.",
    "If you choose database per service, say out loud that joins become application-level calls.",
    "When one service depends on another, mention cascade risk and draw a circuit breaker with closed, open and half-open.",
    "For orders or payments, propose an append-only event log instead of a mutable status column.",
    "Only bring in CQRS after you confirm the product tolerates eventually consistent reads."
  ],

  scene: {
    nodes: [
      { id: "zMono", label: "Monolith", type: "zone", pos: [-7, 0, -4], size: [7, 4.5] },
      { id: "mono", label: "One big server", type: "server", pos: [-7, 0, -4] },
      { id: "nMono", label: "auth + notif + comments", type: "note", pos: [-7, 0, -7.2] },

      { id: "auth", label: "Auth svc", type: "service", pos: [2, 0, -5] },
      { id: "notif", label: "Notification svc", type: "service", pos: [6, 0, -5] },
      { id: "posts", label: "Post svc", type: "service", pos: [10, 0, -5] },

      { id: "shared", label: "Shared Postgres", type: "db", pos: [6, 0, -1], showAt: 2 },
      { id: "mongo", label: "MongoDB", type: "db", pos: [2, 0, -1], showAt: 3 },
      { id: "ch", label: "ClickHouse", type: "db", pos: [6, 0, 1.5], showAt: 3 },
      { id: "pg", label: "Postgres", type: "db", pos: [10, 0, -1], showAt: 3 },
      { id: "nJoin", label: "join in app code", type: "note", pos: [6, 0, 3.6], showAt: 3 },

      { id: "sA", label: "Service A", type: "service", pos: [-10, 0, 3] , showAt: 4 },
      { id: "sB", label: "Service B", type: "service", pos: [-6.5, 0, 3], showAt: 4 },
      { id: "cb", label: "Circuit breaker", type: "gateway", pos: [-3, 0, 3], showAt: 5, color: "#facc15" },
      { id: "sD", label: "Service D", type: "service", pos: [0.5, 0, 3], showAt: 4 },
      { id: "nCb", label: "closed / open / half-open", type: "note", pos: [-3, 0, 5.3], showAt: 5 },

      { id: "log", label: "Event log (append)", type: "queue", pos: [-6, 0, 7.4], showAt: 7, color: "#fb923c" },
      { id: "nLog", label: "12:00 placed, 12:30 shipping", type: "note", pos: [-1.5, 0, 7.4], showAt: 7 },

      { id: "cmd", label: "Command side", type: "service", pos: [4, 0, 6], showAt: 8 },
      { id: "proj", label: "Denormalizer", type: "worker", pos: [7.5, 0, 6], showAt: 8 },
      { id: "readDb", label: "Read DB", type: "db", pos: [11, 0, 6], showAt: 8 },
      { id: "nEc", label: "eventually consistent", type: "note", pos: [9, 0, 8], showAt: 8 }
    ],
    edges: [
      { from: "auth", to: "shared", showAt: 2 },
      { from: "notif", to: "shared", showAt: 2 },
      { from: "posts", to: "shared", showAt: 2 },
      { from: "auth", to: "mongo", showAt: 3 },
      { from: "notif", to: "ch", showAt: 3 },
      { from: "posts", to: "pg", showAt: 3 },
      { from: "posts", to: "auth", label: "user details?", dashed: true, showAt: 3 },
      { from: "sA", to: "sB", showAt: 4 },
      { from: "sB", to: "sD", showAt: 4 },
      { from: "sB", to: "cb", showAt: 5 },
      { from: "cb", to: "sD", showAt: 5 },
      { from: "log", to: "cmd", showAt: 8 },
      { from: "cmd", to: "proj", showAt: 8 },
      { from: "proj", to: "readDb", showAt: 8 }
    ],
    steps: [
      {
        title: "Monolith or microservices",
        text: "A monolith keeps every route on one server and can only scale as a whole. Microservices give auth, notifications and posts their own services, so one crash stays contained.",
        highlight: ["mono", "auth", "notif", "posts"],
        hide: ["sA", "sB", "sD"]
      },
      {
        title: "A bug in notifications",
        text: "In the monolith, a crashing notification handler takes the whole instance down. As a microservice, notifications fails alone while auth and posts keep serving.",
        fail: ["mono", "notif"],
        highlight: ["auth", "posts"],
        hide: ["sA", "sB", "sD"]
      },
      {
        title: "Split code, shared database",
        text: "All three services still read and write one Postgres. Notifications can read users, but a bug in any service could also corrupt them. This is not true isolation.",
        highlight: ["shared"],
        hide: ["mono", "zMono", "nMono", "sA", "sB", "sD"],
        flows: [
          { from: "auth", to: "shared", color: "#4ade80" },
          { from: "notif", to: "shared", color: "#f87171", label: "can delete users" }
        ]
      },
      {
        title: "Database per service",
        text: "Each service owns its store: Mongo for auth's changing schema, ClickHouse for notification analytics, Postgres for posts. Posts must now ask auth for user details and join them in code.",
        highlight: ["mongo", "ch", "pg", "nJoin"],
        hide: ["shared", "mono", "zMono", "nMono", "sA", "sB", "sD"],
        flows: [{ from: "posts", to: "auth", color: "#60a5fa", label: "user details" }]
      },
      {
        title: "Services call services",
        text: "Service A depends on B, and B depends on D. Microservices only help if the dependency chain can survive one failure.",
        highlight: ["sA", "sB", "sD"],
        hide: ["shared", "mono", "zMono", "nMono"],
        flows: [
          { from: "sA", to: "sB", color: "#4ade80" },
          { from: "sB", to: "sD", color: "#4ade80" }
        ]
      },
      {
        title: "D dies and the failure cascades",
        text: "D cannot return data, so B fails, then A fails. One dead service has taken down its callers. A circuit-breaker proxy is placed between B and D.",
        fail: ["sD", "sB", "sA"],
        highlight: ["cb"],
        hide: ["shared", "mono", "zMono", "nMono"],
        flows: [{ from: "cb", to: "sD", color: "#f87171", label: "failing" }]
      },
      {
        title: "Breaker opens, then probes",
        text: "After repeated failures the breaker opens and answers B immediately, so D is not hammered while it recovers. After a timer it goes half-open, sends a probe, and closes again once D answers.",
        highlight: ["cb", "nCb", "sB"],
        hide: ["shared", "mono", "zMono", "nMono"],
        flows: [
          { from: "cb", to: "sB", color: "#facc15", label: "fast fallback" },
          { from: "cb", to: "sD", color: "#60a5fa", label: "half-open probe" }
        ]
      },
      {
        title: "Append events, don't mutate state",
        text: "Instead of rewriting one order status column, append immutable events: placed at 12:00, ready at 12:10, shipping at 12:30. The current status is the latest event. Banks compute balances the same way.",
        highlight: ["log", "nLog"],
        hide: ["shared", "mono", "zMono", "nMono", "sA", "sB", "sD", "cb", "nCb"]
      },
      {
        title: "CQRS on top of the stream",
        text: "Commands go to the write side and become events. A denormalizer turns events into a read database shaped for queries. Reads are fast, and briefly behind the latest write.",
        highlight: ["cmd", "proj", "readDb", "nEc"],
        hide: ["shared", "mono", "zMono", "nMono", "sA", "sB", "sD", "cb", "nCb"],
        flows: [
          { from: "log", to: "cmd", color: "#fb923c", label: "event" },
          { from: "proj", to: "readDb", color: "#c084fc", label: "project" }
        ]
      }
    ]
  }
});
