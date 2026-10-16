window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 4,
  title: "CQRS System Design Pattern",
  video: "https://www.youtube.com/watch?v=vNplj9LwQSw",
  category: "Piyush Garg",
  tagline: "GET never shares a lock with PATCH: command logs vs denormalized query views.",
  summary: "Traditional apps dump GET, POST, PATCH, and DELETE onto one Postgres, so an Amazon seller dropping earphones from $50 to $40 locks the row every shopper is reading. CQRS (Command Query Responsibility Segregation) splits mutations (create/update/delete) from reads. An API gateway routes by HTTP method. Commands are objects (ProductUpdateCommand), not inline SQL. Write DB stays normalized SQL; a queue projects a denormalized Mongo/Dynamo view. Pairing with event sourcing stores Kafka/Kinesis logs in ClickHouse so a corrupt read store can be replayed. Eventual consistency of 1–2 seconds is the price of not crashing the one database.",

  theory: [
    {
      heading: "One user, one REST stack, one Postgres",
      body: "The lecture starts with the boring full-stack loop: a user hits HTTP endpoints you exposed with Django, FastAPI, or Express. A GET for products calls a controller (or a service layer) that <b>reads</b> Postgres and returns rows. A PATCH to change a product calls a different controller that runs an <b>UPDATE</b>. A POST to create a product runs an <b>INSERT</b>. That is CRUD on a single store. When you scale, you scale the REST boxes — vertical (2 CPU → 4, 8 GB RAM → 16) or horizontal (clone the server). The database is still one elephant.",
      bullets: [
        "GET = read. PATCH/PUT/DELETE/POST = mutate. Same table either way.",
        "SaaS and \"decent\" products live here until the lock shows up."
      ]
    },
    {
      heading: "The Amazon earphone row and the lock",
      body: "CRUD on one database is the bottleneck because create, read, update, and delete all land on the same engine. Picture earphones listed at <b>$50</b>. Thousands of shoppers are GETting that price. The seller starts a sale and PATCHes <b>$40</b> or <b>$30</b>. The update acquires a <b>transaction lock</b>. Readers wait. Queries crawl. At Amazon scale that lock is downtime, not a consistency lecture. Identify the bottleneck first: it is not the Express process you cloned; it is Postgres doing every verb.",
      bullets: [
        "You cannot invent a fifth operation on a row. CRUD is the whole surface.",
        "Frequent locks plus concurrent reads is how the database becomes the elephant."
      ]
    },
    {
      heading: "C is command, R is query — route by HTTP method",
      body: "Amazon's blog line in the talk: CQRS separates data <b>mutation</b> (create, update, delete — the command side) from <b>query</b> (read). Use it when throughput, latency, and consistency needs differ. Strip R out of CRUD: command = C/U/D; query = only reads. An <b>API gateway</b> is the front door. Rule: GET → query servers. POST, PUT, PATCH, DELETE → command servers. Users never pick a side; they always hit the gateway, which fans by method. First intention of CQRS: two request paths, not two URLs the client must learn.",
      bullets: [
        "Throughput here means how often you change data, not a marketing QPS slide.",
        "The gateway rule is the whole split at the edge."
      ]
    },
    {
      heading: "Never SQL from the controller: emit a command",
      body: "Presentation layer is the UI plus the REST you expose. Under CQRS you <b>never mutate the database from the controller</b>. Every action becomes a command object. Updating a product is <code>ProductUpdateCommand { productId, payload }</code>. Creating one is <code>ProductCreateCommand</code>. A <b>command handler / write model</b> inspects the command, validates (price must not be negative), authorizes (are you allowed to change this SKU?), and only then mutates the write store. The write model is tuned only for mutations. On the query side: presentation → <b>query handler</b> → <b>read model</b> tuned only for lookup. ChatGPT drew that diagram in the lecture; the names are the architecture, not a library.",
      bullets: [
        "Typical app: controller writes SQL. CQRS app: controller emits a command.",
        "Validate and authorize on the command path before the write model touches storage."
      ]
    },
    {
      heading: "Two databases and a 1–2 second lie",
      body: "If command and query still share one Postgres, you only moved the lock. Segregate the stores: a <b>write DB</b> for mutations, a <b>read DB</b> only for queries. Sync is the hard part. The write side <b>emits an event</b> (the same ProductUpdate / ProductCreate command) onto a queue; a worker applies it to the read DB. Reads and writes no longer fight. The cost is <b>eventual consistency</b>: the write can land and the shopper can still see $50 for a second or two. The talk's tradeoff is blunt: crash the one database under mixed load, or accept a short lag and keep a fault-tolerant pair. Stock-market ticks cannot take that lag. A product catalog can.",
      bullets: [
        "Mutation load lives on the write DB. Query load lives on the read DB.",
        "Eventual consistency is a product decision, not a bug you hide."
      ]
    },
    {
      heading: "Normalized truth vs a denormalized projection",
      body: "The write DB is the source of truth. Keep it <b>SQL, normalized</b>: a products table of id + slug, another table for extra properties, another for orders, stock inferred from sales vs purchases. Reads that join those tables recursively are expensive. The read DB can be <b>Mongo-style NoSQL</b>: one denormalized JSON document per product with sales count, purchase count, nested details. A query is <code>WHERE id = ?</code> — no join. If that document goes stale or corrupt, <b>regenerate it from the write DB</b>. Flexibility is the other prize: DynamoDB on the command path in the AWS article, then SNS → Lambda → a read store; Microsoft's write-up is the same split of models.",
      bullets: [
        "Write side: foreign keys and little redundancy.",
        "Read side: the view the UI already wanted, pre-joined.",
        "A ruined projection is disposable. The write model is not."
      ]
    },
    {
      heading: "Event sourcing inside CQRS: logs, not a final row",
      body: "Last video's append-only log slots in naturally. Instead of writing the final product row on the command side, <b>append every command to a log</b> (Kafka, or Kinesis as Kafka-inside-AWS). ClickHouse in the drawing is the write DB that stores those logs, not a current-state table. Hydration folds the log into the denormalized read DB. If the read store is stale, corrupt, or you want to migrate Dynamo → Mongo, <b>replay the logs</b>. Kafka consumer groups and partitions keep one product's events on one consumer. After the log, SNS fans out: an SQS \"update read DB\" queue that a Lambda writes into Dynamo, plus an email queue into SES — a price drop can fire a promotional mail without the command handler knowing about Gmail. Optional CloudFront caches GET; another Lambda invalidates the CDN when the read DB changes.",
      bullets: [
        "Command ELB → auth/validation EC2 → command handler → Kinesis/Kafka → ClickHouse logs.",
        "Query ELB round-robins a target group of four query-handler EC2s that only read Dynamo.",
        "Dashed line on the whiteboard: rebuild the read DB from the log at any time."
      ]
    },
    {
      heading: "Only for large apps, and never for a realtime tick",
      body: "The AWS diagram looks pretty and is <b>not feasible for a small app</b>. Use CQRS when you already have database-per-service and need to join across microservices on the query side; when read and write want different scale, latency, and consistency; and when eventual consistency on queries is acceptable. A realtime market is not. ByteByteGo (\"Byte Mak\" in the talk) is the shout-out for a second pass. Event sourcing is the previous video — watch that before treating this log as optional decoration.",
      bullets: [
        "Complexity is the default cost. Do not sprinkle CQRS on a CRUD blog.",
        "Auth service DB + product service DB is a reason to project a joined read model."
      ]
    }
  ],

  keyTerms: [
    { term: "CQRS", def: "Command Query Responsibility Segregation: mutations and reads use different models and usually different stores." },
    { term: "Command", def: "Create/update/delete intent as an object (ProductUpdateCommand), not a SQL string from the controller." },
    { term: "Query", def: "Read-only path: query handler + read model. No mutation." },
    { term: "Write model", def: "Application piece that executes commands against the write DB (normalized SQL / logs)." },
    { term: "Read model / projection", def: "Denormalized view (Mongo/Dynamo JSON) built for GET. Disposable and rebuildable." },
    { term: "Eventual consistency", def: "Read DB can lag the write DB by ~1–2 seconds after the event queue." },
    { term: "API gateway routing", def: "GET to query ELB; POST/PUT/PATCH/DELETE to command ELB." },
    { term: "Hydration / replay", def: "Fold append-only command logs into a fresh read store after corruption or a migration." }
  ],

  tradeoffs: [
    { pro: "GET shoppers no longer wait on the seller's PATCH lock of the $50 earphone row.", con: "Two databases plus a queue is more moving parts than one Postgres." },
    { pro: "Write store stays normalized; read store is a join-free JSON document.", con: "The shopper can see $50 for a second after the sale started — eventual consistency." },
    { pro: "A corrupt Dynamo view is rebuilt by replaying ClickHouse/Kafka logs.", con: "Small apps cannot afford the ELB/Kinesis/Lambda/CDN lattice." },
    { pro: "SNS fan-out updates the read DB and can also send a price-drop email.", con: "Stock-market style realtime reads cannot wait on that fan-out." },
    { pro: "Command and query fleets scale independently (four query EC2s vs fewer writers).", con: "You now operate two target groups, two models, and a sync pipeline." }
  ],

  interviewTips: [
    "Draw one Postgres first. PUT the $50 → $40 earphone lock on it. That is the why.",
    "Say the gateway rule out loud: GET to query, POST/PUT/PATCH/DELETE to command.",
    "Name ProductUpdateCommand. Controllers do not emit SQL.",
    "Write DB = normalized SQL or an append-only log. Read DB = denormalized JSON. Query is WHERE id.",
    "Admit 1–2 s lag. Offer crash-the-DB as the other side of the tradeoff. Reject CQRS for ticks.",
    "Pair with event sourcing: Kafka/Kinesis logs in ClickHouse, replay if Dynamo is wrong, SNS → Lambda + SES."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Shopper", type: "user", pos: [-11, 0, 0] },
      { id: "rest", label: "REST API", type: "server", pos: [-6, 0, 0] },
      { id: "ctrl", label: "Controller", type: "service", pos: [-1, 0, 0] },
      { id: "pg", label: "Postgres", type: "db", pos: [5, 0, 0] },
      { id: "nLock", label: "PATCH $50→$40 locks GET", type: "note", pos: [5, 0, -3.2] },

      { id: "gw", label: "API Gateway", type: "gateway", pos: [-7.5, 0, 0], showAt: 1 },
      { id: "cmdZ", label: "Command side", type: "zone", pos: [2, 0, -4.2], size: [12, 4.2], showAt: 1 },
      { id: "qryZ", label: "Query side", type: "zone", pos: [2, 0, 4.2], size: [12, 4.2], showAt: 1 },
      { id: "cmdELB", label: "Command ELB", type: "lb", pos: [-2, 0, -4.2], showAt: 1 },
      { id: "qryELB", label: "Query ELB", type: "lb", pos: [-2, 0, 4.2], showAt: 1 },
      { id: "nMeth", label: "GET→query; PATCH→command", type: "note", pos: [-7.5, 0, -3.4], showAt: 1 },

      { id: "cmdH", label: "Command handler", type: "worker", pos: [3.2, 0, -5.4], showAt: 2 },
      { id: "nCmd", label: "ProductUpdateCommand", type: "note", pos: [3.2, 0, -7.4], showAt: 2 },
      { id: "writeM", label: "Write model", type: "service", pos: [7.5, 0, -4.2], showAt: 2 },

      { id: "qryH", label: "Query handler", type: "worker", pos: [3.2, 0, 5.4], showAt: 3 },
      { id: "readM", label: "Read model", type: "service", pos: [7.5, 0, 4.2], showAt: 3 },

      { id: "writeDB", label: "Write SQL", type: "db", pos: [11, 0, -4.2], showAt: 4 },
      { id: "readDB", label: "Read Mongo", type: "db", pos: [11, 0, 4.2], showAt: 4 },
      { id: "evtQ", label: "Event queue", type: "queue", pos: [11, 0, 0], showAt: 4 },
      { id: "nLag", label: "Lag 1–2 s eventual", type: "note", pos: [7.5, 0, 0], showAt: 4 },

      { id: "tProd", label: "products+slug", type: "note", pos: [7.5, 0, -7.4], showAt: 5 },
      { id: "tOrd", label: "orders + stock joins", type: "note", pos: [11, 0, -7.4], showAt: 5 },
      { id: "nJson", label: "WHERE id → nested JSON", type: "note", pos: [7.5, 0, 7.4], showAt: 5 },

      { id: "kinesis", label: "Kinesis/Kafka", type: "queue", pos: [3.2, 0, -2], showAt: 6 },
      { id: "click", label: "ClickHouse logs", type: "db", pos: [7.5, 0, -2], showAt: 6 },
      { id: "cons", label: "Partition consumer", type: "worker", pos: [3.2, 0, 2], showAt: 6 },
      { id: "nPart", label: "One product → one consumer", type: "note", pos: [-2, 0, 7.4], showAt: 6 },

      { id: "sns", label: "SNS fan-out", type: "queue", pos: [-2, 0, 0], showAt: 7 },
      { id: "sqsR", label: "Read-DB SQS", type: "queue", pos: [3.2, 0, 2], showAt: 7 },
      { id: "lam", label: "Lambda projector", type: "worker", pos: [7.5, 0, 2], showAt: 7 },
      { id: "dyn", label: "Dynamo denorm", type: "db", pos: [11, 0, 2], showAt: 7 },
      { id: "sqsE", label: "Email SQS", type: "queue", pos: [3.2, 0, -2], showAt: 7 },
      { id: "ses", label: "SES promo", type: "service", pos: [7.5, 0, -2], showAt: 7 },

      { id: "q1", label: "Query EC2-1", type: "server", pos: [1, 0, 3], showAt: 8 },
      { id: "q2", label: "Query EC2-2", type: "server", pos: [3.5, 0, 5.6], showAt: 8 },
      { id: "q3", label: "Query EC2-3", type: "server", pos: [6.2, 0, 5.6], showAt: 8 },
      { id: "q4", label: "Query EC2-4", type: "server", pos: [8.8, 0, 3], showAt: 8 },
      { id: "cf", label: "CloudFront GET", type: "cdn", pos: [-7.5, 0, 4.2], showAt: 8 },
      { id: "inv", label: "Invalidate cache", type: "worker", pos: [-7.5, 0, 7.2], showAt: 8 },

      { id: "nReplay", label: "Replay logs → new read DB", type: "note", pos: [7.5, 0, 7.4], showAt: 9 }
    ],
    edges: [
      { from: "user", to: "rest" },
      { from: "rest", to: "ctrl" },
      { from: "ctrl", to: "pg", label: "CRUD" },
      { from: "user", to: "gw", showAt: 1 },
      { from: "gw", to: "cmdELB", label: "PATCH", showAt: 1 },
      { from: "gw", to: "qryELB", label: "GET", showAt: 1 },
      { from: "cmdELB", to: "cmdH", showAt: 2 },
      { from: "cmdH", to: "writeM", showAt: 2 },
      { from: "qryELB", to: "qryH", showAt: 3 },
      { from: "qryH", to: "readM", showAt: 3 },
      { from: "writeM", to: "writeDB", showAt: 4 },
      { from: "writeDB", to: "evtQ", showAt: 4 },
      { from: "evtQ", to: "readDB", showAt: 4 },
      { from: "readM", to: "readDB", showAt: 4 },
      { from: "cmdH", to: "kinesis", label: "append", showAt: 6 },
      { from: "kinesis", to: "cons", showAt: 6 },
      { from: "cons", to: "click", showAt: 6 },
      { from: "click", to: "sns", showAt: 7, dashed: true },
      { from: "sns", to: "sqsR", showAt: 7 },
      { from: "sns", to: "sqsE", showAt: 7 },
      { from: "sqsR", to: "lam", showAt: 7 },
      { from: "lam", to: "dyn", showAt: 7 },
      { from: "sqsE", to: "ses", showAt: 7 },
      { from: "qryELB", to: "q1", showAt: 8 },
      { from: "qryELB", to: "q2", showAt: 8 },
      { from: "q1", to: "dyn", showAt: 8, dashed: true },
      { from: "cf", to: "qryELB", showAt: 8 },
      { from: "inv", to: "cf", showAt: 8, dashed: true },
      { from: "click", to: "dyn", showAt: 9, dashed: true }
    ],
    steps: [
      {
        title: "CRUD PATCH locks the $50 row",
        text: "Shopper → REST (Django/FastAPI/Express) → controller → one Postgres. GET reads earphones at $50. Seller PATCH to $40 takes a transaction lock. Amazon-scale readers wait. You scaled the API boxes; the elephant is still this database.",
        highlight: ["user", "rest", "ctrl", "pg", "nLock"],
        flows: [
          { from: "user", to: "rest", color: "#4ade80", label: "GET" },
          { from: "ctrl", to: "pg", color: "#c084fc", label: "PATCH $40" }
        ]
      },
      {
        title: "Gateway splits GET from PATCH",
        text: "CQRS first move: API gateway routes by HTTP method. GET goes to the query ELB. POST/PUT/PATCH/DELETE go to the command ELB. The client still talks to one door. Command side and query side are now two boxes.",
        highlight: ["user", "gw", "cmdELB", "qryELB", "cmdZ", "qryZ", "nMeth"],
        hide: ["rest", "ctrl", "pg", "nLock"],
        flows: [
          { from: "user", to: "gw", color: "#4ade80", label: "HTTP" },
          { from: "gw", to: "qryELB", color: "#60a5fa", label: "GET" },
          { from: "gw", to: "cmdELB", color: "#4ade80", label: "PATCH" }
        ]
      },
      {
        title: "Controller emits ProductUpdateCommand",
        text: "Nothing mutates the database from the controller. The handler builds ProductUpdateCommand { productId, payload }, validates (no negative price), authorizes the seller, and hands it to the write model. That model exists only to mutate.",
        highlight: ["cmdELB", "cmdH", "nCmd", "writeM", "cmdZ"],
        hide: ["rest", "ctrl", "pg", "nLock"],
        flows: [
          { from: "cmdELB", to: "cmdH", color: "#4ade80", label: "cmd" },
          { from: "cmdH", to: "writeM", color: "#c084fc", label: "validate" }
        ]
      },
      {
        title: "Query handler + read model",
        text: "GET still has a presentation path: query handler, then a read model optimized for lookup. If both models still point at one Postgres, the lock from step 1 is still there. Segregation of code is not enough.",
        highlight: ["qryELB", "qryH", "readM", "qryZ", "writeM"],
        hide: ["rest", "ctrl", "pg", "nLock", "nCmd"],
        flows: [
          { from: "qryELB", to: "qryH", color: "#60a5fa", label: "GET" },
          { from: "qryH", to: "readM", color: "#60a5fa", label: "lookup" }
        ]
      },
      {
        title: "Write SQL, event queue, read Mongo",
        text: "Two databases. Write model commits the mutation. An event on the queue updates the read DB. Shoppers no longer share a lock with the seller. For 1–2 seconds the GET can still show $50. That lag is the alternative to crashing the one store.",
        highlight: ["writeM", "writeDB", "evtQ", "readDB", "readM", "nLag"],
        hide: ["rest", "ctrl", "pg", "nLock", "nCmd"],
        flows: [
          { from: "writeM", to: "writeDB", color: "#c084fc", label: "mutate" },
          { from: "writeDB", to: "evtQ", color: "#fb923c", label: "event" },
          { from: "evtQ", to: "readDB", color: "#fb923c", label: "project" },
          { from: "readM", to: "readDB", color: "#60a5fa", label: "GET" }
        ]
      },
      {
        title: "Joins on write; WHERE id on read",
        text: "Write SQL is normalized: products+slug, extra properties, orders, stock via sales vs purchases. Those joins are recursive work. The read document already has sales count, purchase count, nested details. GET is WHERE id. If the JSON rots, rebuild it from the write side.",
        highlight: ["writeDB", "readDB", "tProd", "tOrd", "nJson"],
        hide: ["rest", "ctrl", "pg", "nLock", "nCmd", "nLag"],
        flows: [
          { from: "writeDB", to: "evtQ", color: "#fb923c", label: "project" },
          { from: "evtQ", to: "readDB", color: "#4ade80", label: "JSON" }
        ]
      },
      {
        title: "Append commands to Kinesis; ClickHouse is the log",
        text: "Event sourcing inside CQRS: do not store the final row on the write side. Append commands to Kafka/Kinesis. A consumer group pins one product to one consumer. ClickHouse keeps the append-only logs. Hydration will fold them into the read view.",
        highlight: ["cmdH", "kinesis", "cons", "click", "nPart"],
        hide: ["rest", "ctrl", "pg", "nLock", "nCmd", "nLag", "tProd", "tOrd", "nJson", "writeDB", "readDB", "evtQ", "writeM", "readM"],
        flows: [
          { from: "cmdH", to: "kinesis", color: "#fb923c", label: "append" },
          { from: "kinesis", to: "cons", color: "#4ade80", label: "ordered" },
          { from: "cons", to: "click", color: "#c084fc", label: "log" }
        ]
      },
      {
        title: "SNS fans out: Dynamo projection + SES mail",
        text: "After the log, SNS copies the event. SQS + Lambda writes a denormalized Dynamo document (the query projection). A second SQS feeds SES so a price drop can send a promotional email. The command handler never called Gmail.",
        highlight: ["sns", "sqsR", "lam", "dyn", "sqsE", "ses", "click"],
        hide: ["rest", "ctrl", "pg", "nLock", "nCmd", "nLag", "tProd", "tOrd", "nJson", "writeDB", "readDB", "evtQ", "writeM", "readM", "kinesis", "cons", "nPart", "qryH"],
        flows: [
          { from: "sns", to: "sqsR", color: "#fb923c", label: "fan-out" },
          { from: "sqsR", to: "lam", color: "#fb923c", label: "job" },
          { from: "lam", to: "dyn", color: "#4ade80", label: "denorm" },
          { from: "sns", to: "sqsE", color: "#fb923c", label: "mail" },
          { from: "sqsE", to: "ses", color: "#60a5fa", label: "promo" }
        ]
      },
      {
        title: "Query fleet + CloudFront invalidation",
        text: "Query ELB round-robins four EC2 query handlers that only read Dynamo. CloudFront can cache GET. When the projection changes, a Lambda invalidates the CDN so the next shopper is not stuck on $50.",
        highlight: ["qryELB", "q1", "q2", "q3", "q4", "dyn", "cf", "inv"],
        hide: ["rest", "ctrl", "pg", "nLock", "nCmd", "nLag", "tProd", "tOrd", "nJson", "writeDB", "readDB", "evtQ", "writeM", "readM", "kinesis", "cons", "nPart", "cmdH", "sns", "sqsR", "sqsE", "ses", "lam", "qryH"],
        flows: [
          { from: "cf", to: "qryELB", color: "#60a5fa", label: "GET" },
          { from: "qryELB", to: "q1", color: "#60a5fa", label: "RR" },
          { from: "q1", to: "dyn", color: "#60a5fa", label: "WHERE id" },
          { from: "inv", to: "cf", color: "#fb923c", label: "purge" }
        ]
      },
      {
        title: "Replay ClickHouse if Dynamo is wrong",
        text: "Projection corrupt, stale, or you want Mongo instead of Dynamo: iterate the logs and regenerate the read DB. The dashed rebuild line is the whole point of keeping commands as a tape. Do not do this lattice for a small CRUD app; do not do it for a stock tick that cannot lag.",
        highlight: ["click", "dyn", "nReplay"],
        hide: ["rest", "ctrl", "pg", "nLock", "nCmd", "nLag", "tProd", "tOrd", "nJson", "writeDB", "readDB", "evtQ", "writeM", "readM", "kinesis", "cons", "nPart", "cmdH", "sns", "sqsR", "sqsE", "ses", "lam", "qryH", "q2", "q3", "q4", "cf", "inv", "cmdELB", "qryELB"],
        flows: [
          { from: "click", to: "dyn", color: "#c084fc", label: "replay" }
        ]
      }
    ]
  }
});
