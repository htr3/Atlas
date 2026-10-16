window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 6,
  title: "Moving from MONOLITHS to MICROSERVICES",
  video: "https://www.youtube.com/watch?v=rckfN7xFig0",
  category: "Advanced Concepts",
  tagline: "Peel new features out of the monolith — migrate for team speed, not for QPS.",
  summary: "A monolith is one repository and one deployable. Services win on isolated changes, independent releases, and clear contracts — and lose when an int ID silently becomes a string. This lecture argues you split because the organization grew, not because traffic did: extract analytics first, publish client libraries, add a router, automate deploys, pick request/response versus queues, and centralize logs. Each service owns its data; do not invent a service for a helper used by only one team.",

  theory: [
    {
      heading: "What you are leaving, and what you are joining",
      body: "A <b>monolith</b> keeps every feature in one codebase you can run anywhere. Login, payments, profiles, and ranking share a process and usually a repo. A <b>microservice</b> world answers a phone with the service that owns that job: Google login talks to <i>authentication</i>, not to payments. PayPal support is a change inside the payment service. A ranking model that is down for a second does not take checkout with it. The split is about <b>bounded work and bounded releases</b>, not about drawing more boxes.",
      bullets: [
        "Feature work stays inside one service's contract.",
        "Engineers assume peers honor published request and response shapes.",
        "Non-critical jobs (restaurant ranking) can fail without collapsing the product."
      ]
    },
    {
      heading: "Split when the team scaled, not when users did",
      body: "The lecture's timing rule is easy to miss: you do not migrate because QPS got large. You migrate because <b>many product teams</b> need to ship on different clocks. A small group is faster inside one repo — one function call, one compiler, one deploy. A large group collides on that shared binary. Microservices are an organizational tool that happens to look like an architecture diagram.",
      bullets: [
        "Small team: monolith keeps communication cheap and types checked.",
        "Large team: independent deploys beat a global freeze.",
        "User scale can still be solved with more copies of the same monolith."
      ]
    },
    {
      heading: "The compiler used to save you",
      body: "Inside a monolith, module A calls module B as a function. Wrong arguments fail at build time. Across services the same change is a <b>breaking change</b> on the wire. Profile IDs that used to be integers run out of range and become strings. Callers that still send ints break on every hop. Contracts now live in many repos, so they drift unless you treat them as a product.",
      bullets: [
        "Monolith: one place holds the types.",
        "Services: an unpublished type change is an outage.",
        "A client library is how a team ships the contract instead of documenting it."
      ]
    },
    {
      heading: "Do not rebuild the cloud and sprinkle 10% of users",
      body: "One tempting plan is to write every future service, stand up every database, then send a tenth of traffic at the new fleet and cut over if nothing explodes. The engineering bill is enormous before you have learned anything. A cheaper path is the <b>strangler</b>: the next feature is born as a service, not as another module. Analytics is the usual first peel — modules emit events, a separate process builds dashboards, and it talks over HTTP or gRPC instead of an in-process call. That analytics store can stay MySQL or move to DynamoDB or Cassandra; isolation of concern matters more than matching the old engine."
    },
    {
      heading: "Email, then a platform: five things you now owe",
      body: "Once analytics is outside, shared jobs follow. Payments, profiles, and analytics all send mail, so <b>email</b> becomes a service with its own repo. That only stays sane if the company builds a thin platform around every new extract.",
      bullets: [
        "<b>Contracts and clients</b>: each service publishes a library (\"get report(id)\") so callers do not hand-roll payloads. Stale libraries break at the boundary.",
        "<b>Routing</b>: a load balancer (or equivalent) sends a call to the service that can handle it.",
        "<b>Deploys</b>: copying a GitHub tree onto an AWS box and running a command does not survive dozens of services. Jenkins (or similar) plus containers on merge to master replace the ritual.",
        "<b>Communication style</b>: analytics can ingest from a queue — a dropped event makes a report wrong, not a checkout. Payments want request/response so the caller knows the charge landed. Batching ten calls is a third option.",
        "<b>Logging</b>: a hop from session → analytics → profiles → payments cannot be grepped box by box. Ship every line through Kafka into an Elastic/Lucene pile keyed by user <code>123</code> and request <code>256</code>."
      ]
    },
    {
      heading: "One source of truth per concern",
      body: "Profiles own profile rows. Payments must not answer \"get profile\". They may keep a <b>cache</b> of a name or avatar, but the cache is not authoritative — a refresh is a network call to the profile service. That rule only holds if each service has a <b>dedicated store</b>. Shared tables across \"services\" recreate the monolith under a new name."
    },
    {
      heading: "Do not split a helper that only one business owns",
      body: "Profile data arriving from Google, Facebook, and LinkedIn looks like a new service: an adapter that normalizes three APIs. Ask three questions. Does any other service need that blob? When profile requirements change, does the adapter change with them? Is this a separate business? If the answers are no, yes, and no, the adapter is a <b>library inside profiles</b>, not a fleet of its own. Extra hops for engineering tidiness become extra contracts you cannot staff."
    },
    {
      heading: "Infrastructure tax and a staffing sketch",
      body: "Logging, deploy pipelines, and API docs are paid whether you have three engineers or three hundred. A startup that spends the quarter on platform work is a startup that did not ship. The lecture's rough formula (flexible, especially early): a startup person holds at most <b>two</b> services; a mid-size company aims for <b>two people per service</b> so vacation is not an outage; a large company staffs <b>two to four</b> (proof of concept, product features, bugs/support). More than four usually means the business blob is too big and should split along a real seam — which is an engineering signal that the product itself grew."
    }
  ],

  keyTerms: [
    { term: "Monolith", def: "One repository and one deployable that holds the product's logic; many processes may still run copies of it." },
    { term: "Breaking change", def: "A contract shift (int id to string) that compiles nowhere and fails every caller that was not updated." },
    { term: "Strangler extract", def: "Ship the next feature as a service instead of rewriting the old binary and flipping 10% of users onto a new cloud." },
    { term: "Client library", def: "Code the callee publishes so callers invoke getReport(id) instead of assembling HTTP by hand." },
    { term: "Service contract", def: "The request and response shapes a service promises; in a monolith this was just a function signature." },
    { term: "Single source of truth", def: "Exactly one service (and its store) is allowed to mutate a concern; others may cache, not own." },
    { term: "Request vs queue", def: "Payments need an immediate answer; analytics can accept an event that arrives later or not at all." },
    { term: "Request-scoped logs", def: "One Elastic/Lucene pile, fed by Kafka, so user 123 / request 256 can be pulled without SSH." }
  ],

  tradeoffs: [
    { pro: "PayPal work lives in payments; ranking can blink without taking login down.", con: "You now operate contracts, routing, deploys, and a log pipeline before the next feature ships." },
    { pro: "A compiler-checked monolith makes ID-type mistakes fail at build time.", con: "One team cannot deploy without coordinating every other team in the binary." },
    { pro: "Extracting analytics first proves the platform on a non-critical path.", con: "A big-bang rewrite of every service plus a 10% canary spends months before any learning." },
    { pro: "A client library hides serialization and endpoint details from callers.", con: "Callers on an old library still break; libraries must be versioned and pushed." },
    { pro: "Two to four people per service avoids a bus-factor of one without a crowd.", con: "Startups that platform too early trade shipped features for Jenkins and Kafka." }
  ],

  interviewTips: [
    "Say you migrate because teams need independent deploys, not because QPS crossed a round number.",
    "Reject a greenfield rewrite; extract the next feature (analytics) and give it a network API plus its own store.",
    "Name the five platform pieces: client libraries, a router, CI/CD, mixed comms, centralized request-id logs.",
    "If they propose a Google/Facebook ingest service, ask who else consumes it — it is probably a profile library.",
    "Quote a staffing sketch: two services per startup engineer, two people per service at mid size, two to four at large.",
    "Mention int-to-string IDs as the canonical breaking change a compiler would have caught."
  ],

  scene: {
    nodes: [
      { id: "zmono", label: "Monolith repo", type: "zone", pos: [-6, 0, 0], size: [10, 8] },
      { id: "zms", label: "Service fleet", type: "zone", pos: [7, 0, 0], size: [11, 9], showAt: 1 },

      { id: "phone", label: "Phone", type: "phone", pos: [-10, 0, -3] },
      { id: "mono", label: "Monolith app", type: "server", pos: [-6, 0, 0] },
      { id: "mdb", label: "Shared MySQL", type: "db", pos: [-3, 0, 3] },

      { id: "auth", label: "Auth service", type: "service", pos: [4, 0, -4], showAt: 1 },
      { id: "pay", label: "Payments", type: "service", pos: [4, 0, 0], showAt: 1 },
      { id: "rank", label: "Ranking ML", type: "service", pos: [4, 0, 4], showAt: 1 },
      { id: "analytics", label: "Analytics", type: "service", pos: [8.5, 0, -4], showAt: 5 },
      { id: "email", label: "Email service", type: "service", pos: [8.5, 0, 0], showAt: 6 },
      { id: "prof", label: "Profile svc", type: "service", pos: [8.5, 0, 4], showAt: 8 },
      { id: "adb", label: "Analytics DB", type: "db", pos: [11.5, 0, -4], showAt: 5 },
      { id: "extg", label: "Google/FB/LI", type: "gateway", pos: [11.5, 0, 4], showAt: 8 },

      { id: "lb", label: "Load balancer", type: "lb", pos: [0.5, 0, 0], showAt: 6 },
      { id: "lib", label: "Client library", type: "worker", pos: [-3, 0, -6], showAt: 6 },
      { id: "kafka", label: "Kafka logs", type: "queue", pos: [0.5, 0, 4.5], showAt: 7 },
      { id: "elastic", label: "Elastic/Lucene", type: "storage", pos: [0.5, 0, -4.5], showAt: 7 },

      { id: "n0", label: "One repo, one deploy", type: "note", pos: [-10, 4, 7] },
      { id: "n1", label: "Team size trigger", type: "note", pos: [0, 4, 7], showAt: 2 },
      { id: "n2", label: "Breaking API change", type: "note", pos: [10, 4, 7], showAt: 3 },
      { id: "n3", label: "Don't rewrite all", type: "note", pos: [-10, 4, -7.5], showAt: 4 },
      { id: "n4", label: "Contracts + router", type: "note", pos: [0, 4, -7.5], showAt: 6 },
      { id: "n5", label: "SSOT per service", type: "note", pos: [10, 4, -7.5], showAt: 8 }
    ],
    edges: [
      { from: "phone", to: "mono", label: "all features" },
      { from: "mono", to: "mdb" },
      { from: "phone", to: "auth", label: "login", showAt: 1 },
      { from: "phone", to: "pay", label: "PayPal", showAt: 1, dashed: true },
      { from: "mono", to: "analytics", label: "events", showAt: 5 },
      { from: "analytics", to: "adb", showAt: 5 },
      { from: "lib", to: "analytics", label: "getReport", showAt: 6 },
      { from: "lb", to: "email", showAt: 6 },
      { from: "lb", to: "pay", showAt: 6 },
      { from: "pay", to: "email", label: "send", showAt: 6 },
      { from: "auth", to: "kafka", label: "logs", showAt: 7 },
      { from: "pay", to: "kafka", showAt: 7 },
      { from: "kafka", to: "elastic", showAt: 7 },
      { from: "prof", to: "extg", label: "library, not svc", showAt: 8, dashed: true },
      { from: "pay", to: "prof", label: "get profile", showAt: 8 }
    ],
    steps: [
      {
        title: "One repo, one binary",
        text: "The product is a large codebase you can run on any box. Login, payments, profiles, and ranking share a process and a MySQL. The phone talks to that one deployable for every feature.",
        highlight: ["zmono", "phone", "mono", "mdb", "n0"],
        flows: [
          { from: "phone", to: "mono", color: "#4ade80", label: "login" },
          { from: "mono", to: "mdb", color: "#60a5fa", label: "read" }
        ]
      },
      {
        title: "Call the service that owns the job",
        text: "A Google login should never wake payments. Auth answers identity; PayPal work stays inside payments; a ranking model that stalls for a second does not take checkout with it.",
        highlight: ["phone", "auth", "pay", "rank", "zms"],
        hide: ["n0"],
        flows: [
          { from: "phone", to: "auth", color: "#4ade80", label: "login" },
          { from: "phone", to: "pay", color: "#fb923c", label: "skip" }
        ]
      },
      {
        title: "Migrate because teams grew",
        text: "Do not split because traffic got large — more copies of the monolith still scale users. Split when product teams need their own release clocks. Small groups stay faster in one repo.",
        highlight: ["zmono", "zms", "n1", "mono", "auth", "pay"],
        hide: ["n0"],
        flows: [
          { from: "phone", to: "mono", color: "#60a5fa", label: "small team" },
          { from: "phone", to: "auth", color: "#4ade80", label: "many teams" }
        ]
      },
      {
        title: "IDs that used to be ints",
        text: "A monolith function call fails at compile time. Across services, turning a profile id from int to string is a breaking change: every caller still sending numbers dies on the wire.",
        highlight: ["pay", "auth", "n2"],
        fail: ["pay"],
        hide: ["n0", "n1"],
        flows: [
          { from: "pay", to: "auth", color: "#f87171", label: "id: int" }
        ]
      },
      {
        title: "Refuse the 10% rewrite",
        text: "Standing up every future service, every database, then steering a tenth of users at the new cloud spends months before you learn. Peel one seam instead of cloning the company overnight.",
        highlight: ["zms", "auth", "pay", "rank", "n3"],
        hide: ["n0", "n2"],
        flows: [
          { from: "phone", to: "auth", color: "#f87171", label: "10% canary" },
          { from: "phone", to: "pay", color: "#f87171", label: "rewrite tax" }
        ]
      },
      {
        title: "Analytics is born a service",
        text: "The next feature — dashboards from module events — ships as its own process and store. Calls are HTTP or gRPC, not functions. The engine may stay MySQL or move to Dynamo/Cassandra; ownership is the point.",
        highlight: ["mono", "analytics", "adb"],
        hide: ["n0", "n2"],
        flows: [
          { from: "mono", to: "analytics", color: "#fb923c", label: "event" },
          { from: "analytics", to: "adb", color: "#4ade80", label: "write" }
        ]
      },
      {
        title: "Email, libraries, and a router",
        text: "Mail is shared by payments, profiles, and analytics, so it becomes a service. Callers take a client library instead of hand-building payloads. A load balancer routes by capability. Stale libraries still break — they must be kept current.",
        highlight: ["email", "lib", "lb", "n4", "pay", "analytics"],
        hide: ["n0", "n3"],
        flows: [
          { from: "lib", to: "analytics", color: "#4ade80", label: "getReport" },
          { from: "lb", to: "email", color: "#60a5fa", label: "route" },
          { from: "pay", to: "email", color: "#fb923c", label: "send" }
        ]
      },
      {
        title: "Deploys, queues, and one log pile",
        text: "Stop scp-ing Git onto a VM. Containers and Jenkins on master replace that. Analytics can lose an event; payments cannot, so they use request/response. Every service ships logs through Kafka into Elastic so request 256 is one query.",
        highlight: ["kafka", "elastic", "auth", "pay", "analytics"],
        hide: ["n0", "n3"],
        flows: [
          { from: "auth", to: "kafka", color: "#fb923c", label: "log" },
          { from: "pay", to: "kafka", color: "#fb923c", label: "log" },
          { from: "kafka", to: "elastic", color: "#c084fc", label: "index" }
        ]
      },
      {
        title: "Own the data; do not over-split",
        text: "Profiles are the only source of truth for profile rows; payments may cache, not serve, them. Google/Facebook/LinkedIn ingest is a library inside profiles — no other business needs it. Staff two services per startup engineer, two people per mid-size service, two to four when the blob is large.",
        highlight: ["prof", "extg", "pay", "n5"],
        hide: ["n0", "n2", "n3"],
        flows: [
          { from: "pay", to: "prof", color: "#60a5fa", label: "get profile" },
          { from: "prof", to: "extg", color: "#c084fc", label: "in-process" }
        ]
      }
    ]
  }
});
