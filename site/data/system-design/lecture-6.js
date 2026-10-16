window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 6,
  title: "What is a Microservice Architecture?",
  video: "https://www.youtube.com/watch?v=qYhRvH9tJKw",
  category: "Building Blocks",
  tagline: "A microservice is a business unit, not a tiny machine with one function.",
  summary: "This lecture clears up two myths: a monolith is not one giant box, and a microservice is not a nano-process. It compares when a cohesive team should keep one deployable with a shared database versus splitting along business boundaries behind a gateway, then flags the over-splitting smell that turns RPC into a tax.",

  theory: [
    {
      heading: "Two misconceptions",
      body: "People picture a <b>monolith</b> as one enormous machine that every client hits, and <b>microservices</b> as a swarm of tiny boxes each running a single function with a toy database. Both pictures are wrong. A monolith is one <i>codebase and deployable</i>; you can still run many copies of it and still attach more than one database. A microservice is a <i>business unit</i>: the functions and data that belong together live together. A product can be healthy with three services, not thirty.",
      bullets: [
        "Monolith = one unit of deployment, not one physical machine",
        "Microservice = one bounded business capability with its own data",
        "Clients often talk to a gateway, not to every service directly"
      ]
    },
    {
      heading: "What a scaled monolith actually looks like",
      body: "Put the same application binary behind a load balancer, add machines, and you have horizontally scaled a monolith. Setup code, tests, and connection pools live once. Calls between features are in-process function calls, not network hops, so latency is lower and you skip serialization. For a small, cohesive team this is usually the cheaper architecture because you are not paying coordination tax to split something you could still hold in one head.",
      bullets: [
        "Fewer moving parts: one release train, one ops story",
        "No duplicated bootstrapping across services",
        "Local calls beat RPC on the same box"
      ]
    },
    {
      heading: "Where the monolith starts to hurt",
      body: "A new teammate must load the entire system into working memory before they can change one feature. Any code change, even a tiny one, ships a new build of everything, so deploys are frequent and must be watched end to end. Tests become entangled because everything touches everything. Worst of all, a crash is global: if the process dies, profiles, chat, and analytics all go dark. In a split design, a profile bug can fail while chat still answers.",
      bullets: [
        "Huge onboarding context",
        "Coupled deploys and coupled tests",
        "Blast radius equals the whole product"
      ]
    },
    {
      heading: "Microservices as a suite of business units",
      body: "Treat the product as a set of services, each owning its data and talking to others over the network. A <b>gateway</b> sits in front so phones and browsers do not need to know internal topology. New engineers get one service's context, not the universe. Chat and analytics teams can ship in parallel because they are not fighting over the same functions. If chat is hot, you add chat machines without cloning the idle analytics code.",
      bullets: [
        "Independent scale of the hot path (e.g. chat vs analytics)",
        "Narrower context for new developers",
        "Parallel work with less coupling of calendars, not just of code"
      ]
    },
    {
      heading: "The over-splitting smell",
      body: "Microservices are hard to design well. If service A talks <i>only</i> to service B all day, that split is probably fake: you paid for RPC, versioning, and failure modes to replace a function call. Collapse them. The lecture's only real disadvantage is that you need a thoughtful architect; a naive split is worse than a monolith.",
      bullets: [
        "A service with a single partner is a candidate to merge",
        "Network calls are not free: latency, partial failure, retries",
        "Three well-cut services beat twenty chatty ones"
      ]
    },
    {
      heading: "How to choose in an interview",
      body: "Most system-design interviews describe a large product, so the default is microservices: independent scale, smaller blast radius, parallel teams. Be ready to justify that with the points above. If the prompt is a small cohesive team, or the interviewer keeps pushing on operational simplicity, a monolith is a legitimate answer. <b>Stack Overflow</b> is the famous successful monolith; Google and Facebook run extensive service suites. Neither is a religion."
    }
  ],

  keyTerms: [
    { term: "Monolith", def: "One deployable that contains many features. It can still run on many machines and talk to more than one database." },
    { term: "Microservice", def: "A business capability with its own data and lifecycle, not a one-function process." },
    { term: "API gateway", def: "The edge that clients hit so they do not address internal services one by one." },
    { term: "RPC", def: "A network call that pretends to be a function call. Use it between services, not inside one box." },
    { term: "Blast radius", def: "How much of the product dies when one process crashes. Monoliths make this global." },
    { term: "Bounded context", def: "The cluster of data and behavior that belongs together; a good service boundary." },
    { term: "Horizontal scale-out", def: "Adding copies of the same binary. Works for monoliths and for individual services." }
  ],

  tradeoffs: [
    { pro: "Monolith: local calls, one deploy, shared setup, great for a small cohesive team", con: "Any crash or bad deploy takes the whole product down; onboarding and tests stay coupled" },
    { pro: "Microservices: scale the hot service, ship in parallel, fail partially", con: "Harder to cut well; every extra hop is an RPC with failure modes" },
    { pro: "Gateway hides internal topology from clients", con: "The gateway itself becomes a critical hop you must scale and harden" },
    { pro: "Dedicated databases keep service data independent", con: "Cross-service joins become network workflows instead of SQL" }
  ],

  interviewTips: [
    "On a large-scale prompt, start with a few business-aligned services behind a gateway and say why, not just that microservices are trendy.",
    "Name independent scaling (chat vs analytics), smaller blast radius, and narrower onboarding as your three justifications.",
    "If they describe a tiny team, offer a monolith first and mention Stack Overflow as a real counterexample.",
    "Watch for the smell: if two boxes only talk to each other, merge them back into one service.",
    "Do not invent a dozen nano-services on the whiteboard. Three to six named capabilities is enough to start."
  ],

  scene: {
    nodes: [
      { id: "c1", label: "Client A", type: "user", pos: [-11, 0, -4] },
      { id: "c2", label: "Client B", type: "user", pos: [-11, 0, 0] },
      { id: "c3", label: "Client C", type: "user", pos: [-11, 0, 4] },

      { id: "monoZone", label: "Monolith cluster", type: "zone", pos: [-1, 0, 0], size: [10, 9] },
      { id: "m1", label: "App copy 1", type: "server", pos: [-3, 0, -2] },
      { id: "m2", label: "App copy 2", type: "server", pos: [1, 0, -2], showAt: 1 },
      { id: "m3", label: "App copy 3", type: "server", pos: [-1, 0, 2], showAt: 1 },
      { id: "sharedDb", label: "Shared DB", type: "db", pos: [8, 0, 0] },
      { id: "noteMono", label: "Not one giant machine", type: "note", pos: [-1, 4, -6], showAt: 1 },

      { id: "gw", label: "API Gateway", type: "gateway", pos: [-6, 0, 0], showAt: 3 },

      { id: "zChat", label: "Chat unit", type: "zone", pos: [2, 0, -5], size: [7, 3.5], showAt: 3 },
      { id: "zProf", label: "Profiles unit", type: "zone", pos: [2, 0, 0], size: [7, 3.5], showAt: 3 },
      { id: "zAna", label: "Analytics unit", type: "zone", pos: [2, 0, 5], size: [7, 3.5], showAt: 3 },
      { id: "chat", label: "Chat service", type: "service", pos: [0.5, 0, -5], showAt: 3 },
      { id: "prof", label: "Profiles", type: "service", pos: [0.5, 0, 0], showAt: 3 },
      { id: "ana", label: "Analytics", type: "service", pos: [0.5, 0, 5], showAt: 3 },
      { id: "cdb", label: "Chat DB", type: "db", pos: [4.5, 0, -5], showAt: 3 },
      { id: "pdb", label: "Profile DB", type: "db", pos: [4.5, 0, 0], showAt: 3 },
      { id: "adb", label: "Analytics DB", type: "db", pos: [4.5, 0, 5], showAt: 3 },
      { id: "chat2", label: "Chat replica", type: "service", pos: [0.5, 0, -7], showAt: 6, color: "#4ade80" },
      { id: "noteBiz", label: "Business units, not nano-dots", type: "note", pos: [2, 4.5, 0], showAt: 3 },

      { id: "nanoA", label: "Nano A", type: "service", pos: [8, 0, -3], showAt: 7, color: "#f87171" },
      { id: "nanoB", label: "Nano B", type: "service", pos: [11, 0, -3], showAt: 7, color: "#f87171" },
      { id: "noteSmell", label: "Only talk to each other? Merge", type: "note", pos: [9.5, 3.5, -6], showAt: 7 },
      { id: "noteSO", label: "Stack Overflow stayed a monolith", type: "note", pos: [-1, 4.5, 6], showAt: 8 }
    ],
    edges: [
      { from: "c1", to: "m1", label: "HTTP" },
      { from: "c2", to: "m1", label: "HTTP" },
      { from: "c3", to: "m1", label: "HTTP" },
      { from: "c1", to: "m2", showAt: 1 },
      { from: "c2", to: "m3", showAt: 1 },
      { from: "m1", to: "sharedDb" },
      { from: "m2", to: "sharedDb", showAt: 1 },
      { from: "m3", to: "sharedDb", showAt: 1 },

      { from: "c1", to: "gw", showAt: 3 },
      { from: "c2", to: "gw", showAt: 3 },
      { from: "c3", to: "gw", showAt: 3 },
      { from: "gw", to: "chat", showAt: 3 },
      { from: "gw", to: "prof", showAt: 3 },
      { from: "gw", to: "ana", showAt: 3 },
      { from: "chat", to: "cdb", showAt: 3 },
      { from: "prof", to: "pdb", showAt: 3 },
      { from: "ana", to: "adb", showAt: 3 },
      { from: "gw", to: "chat2", showAt: 6 },
      { from: "nanoA", to: "nanoB", label: "RPC only", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "The cartoon people believe",
        text: "Every client is drawn into one enormous machine that runs the whole product. That picture is the myth the lecture starts by tearing down.",
        highlight: ["m1", "c1", "c2", "c3"],
        hide: ["gw", "zChat", "zProf", "zAna", "chat", "prof", "ana", "cdb", "pdb", "adb", "chat2", "nanoA", "nanoB", "noteBiz", "noteSmell", "noteSO", "m2", "m3", "noteMono"],
        flows: [
          { from: "c1", to: "m1", color: "#4ade80", label: "req" },
          { from: "c2", to: "m1", color: "#4ade80", label: "req" }
        ]
      },
      {
        title: "A monolith can still scale out",
        text: "Run more copies of the same app and share a database. Horizontal scale is not a microservice privilege. Clients can land on any copy.",
        highlight: ["m1", "m2", "m3", "sharedDb", "noteMono"],
        hide: ["gw", "zChat", "zProf", "zAna", "chat", "prof", "ana", "cdb", "pdb", "adb", "chat2", "nanoA", "nanoB", "noteBiz", "noteSmell", "noteSO"],
        flows: [
          { from: "c1", to: "m2", color: "#4ade80", label: "req" },
          { from: "c3", to: "m3", color: "#4ade80", label: "req" },
          { from: "m1", to: "sharedDb", color: "#60a5fa", label: "SQL" }
        ]
      },
      {
        title: "The monolith tax: one crash, all down",
        text: "A bug in profile code still kills the process, so chat and analytics die with it. You restart every copy with a patched binary. Deployments and tests stay coupled because everything ships together.",
        highlight: ["sharedDb"],
        fail: ["m1", "m2", "m3"],
        hide: ["gw", "zChat", "zProf", "zAna", "chat", "prof", "ana", "cdb", "pdb", "adb", "chat2", "nanoA", "nanoB", "noteBiz", "noteSmell", "noteSO"],
        flows: [
          { from: "c2", to: "m1", color: "#f87171", label: "fail" }
        ]
      },
      {
        title: "Business units behind a gateway",
        text: "A microservice is all data and functions for one capability. Clients hit a gateway; chat, profiles, and analytics each own a database. You might only need three services.",
        highlight: ["gw", "chat", "prof", "ana", "noteBiz"],
        hide: ["monoZone", "m1", "m2", "m3", "sharedDb", "noteMono", "chat2", "nanoA", "nanoB", "noteSmell", "noteSO"],
        flows: [
          { from: "c2", to: "gw", color: "#4ade80", label: "HTTP" },
          { from: "gw", to: "prof", color: "#4ade80", label: "profile" },
          { from: "prof", to: "pdb", color: "#60a5fa", label: "own data" }
        ]
      },
      {
        title: "Partial failure beats total outage",
        text: "Profiles crash. Chat and analytics keep serving. You restart one service instead of the whole fleet. That is the blast-radius argument.",
        highlight: ["chat", "ana", "gw"],
        fail: ["prof"],
        hide: ["monoZone", "m1", "m2", "m3", "sharedDb", "noteMono", "chat2", "nanoA", "nanoB", "noteSmell", "noteSO"],
        flows: [
          { from: "gw", to: "chat", color: "#4ade80", label: "ok" },
          { from: "gw", to: "prof", color: "#f87171", label: "down" }
        ]
      },
      {
        title: "Small team: keep the monolith",
        text: "If the team is cohesive, splitting costs more than it saves: extra servers, duplicated setup, and RPC instead of a local call. Fewer moving parts wins until the product and the org actually need seams.",
        highlight: ["m1", "m2", "sharedDb"],
        hide: ["gw", "zChat", "zProf", "zAna", "chat", "prof", "ana", "cdb", "pdb", "adb", "chat2", "nanoA", "nanoB", "noteBiz", "noteSmell", "noteSO", "monoZone", "m3"],
        flows: [
          { from: "c1", to: "m1", color: "#4ade80", label: "local logic" }
        ]
      },
      {
        title: "Scale only the hot service",
        text: "Chat is overloaded. Add chat replicas. Analytics stays small. In a monolith you often clone the entire binary because you cannot see which code is hot.",
        highlight: ["chat", "chat2", "gw"],
        hide: ["monoZone", "m1", "m2", "m3", "sharedDb", "noteMono", "nanoA", "nanoB", "noteSmell", "noteSO"],
        flows: [
          { from: "gw", to: "chat", color: "#4ade80", label: "chat" },
          { from: "gw", to: "chat2", color: "#4ade80", label: "chat" }
        ]
      },
      {
        title: "If two nanos only talk to each other, merge",
        text: "A service that has one partner should probably be a function call inside that partner. Over-splitting is the design failure that makes microservices look worse than they are.",
        highlight: ["nanoA", "nanoB", "noteSmell"],
        hide: ["monoZone", "m1", "m2", "m3", "sharedDb", "noteMono", "chat2", "noteSO"],
        flows: [
          { from: "nanoA", to: "nanoB", color: "#f87171", label: "RPC tax" }
        ]
      },
      {
        title: "Interview default, with a footnote",
        text: "Large interview systems: start with microservices and justify them. If they hint otherwise, a monolith is valid. Stack Overflow stayed one; Google and Facebook did not. Pick for the prompt, not the fashion.",
        highlight: ["gw", "chat", "prof", "ana", "noteSO"],
        hide: ["monoZone", "m1", "m2", "m3", "sharedDb", "noteMono", "nanoA", "nanoB", "noteSmell", "chat2"],
        flows: [
          { from: "c2", to: "gw", color: "#4ade80", label: "req" },
          { from: "gw", to: "chat", color: "#c084fc", label: "suite" }
        ]
      }
    ]
  }
});
