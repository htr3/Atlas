window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 24,
  title: "Backend for Frontend",
  category: "Service Patterns",
  tagline: "Each client gets a backend that speaks its shape — so the mobile app does not assemble the product.",
  summary: "A backend for frontend (BFF) is an API owned by one client: the iOS app, the web app, or a partner portal. It calls the domain services, drops fields that client does not need, and returns one payload. That aggregation used to leak into the API gateway or into the phone. The BFF is allowed to know about screens. Domain services are not.",

  theory: [
    {
      heading: "Screens are not domain resources",
      body: "The home screen wants the user's name, three orders, and a badge count. Those live in profile, orders, and notifications. If the phone makes three calls, it is slow on a bad network and it learns every service boundary. If the order service starts returning the badge, orders now depends on notifications. A <b>BFF</b> sits in between, owned by the client team, and returns the screen.",
      bullets: [
        "One request in, one response shaped for that client.",
        "The BFF may call several services and tolerate a partial result.",
        "Domain services keep their own resources: Order, Profile, not HomeScreen."
      ]
    },
    {
      heading: "Why not one API for every client",
      body: "Web can afford a richer payload. Mobile wants fewer bytes and different auth (app attest, a shorter token). A single \"universal API\" grows optional fields forever, and every client downloads the union. Separate BFFs let the iOS team ship a response change without a web release. They duplicate some glue. That duplication is cheaper than coupling the clients together.",
      bullets: [
        "A BFF is allowed to be ugly. It is glue.",
        "It is not allowed to become the place that calculates tax or stores the order.",
        "When two BFFs copy a rule, push that rule down into the domain service."
      ]
    },
    {
      heading: "Failure and caching are the design",
      body: "If notifications are down, the home screen can still render orders and omit the badge. The BFF decides that <b>degradation</b>, because it knows the screen. It also sets timeouts: a slow profile call must not hold the whole page past the client's budget. Cache a stable fragment (the profile name) at the BFF only when you can name the TTL. Do not cache the order total \"for a bit\" and show a stale charge.",
      bullets: [
        "Timeouts per downstream call, plus an overall budget.",
        "Partial content is a product decision, not an accident.",
        "Auth still terminates at the gateway or at the BFF; do not invent a third scheme."
      ]
    },
    {
      heading: "Where it sits next to the gateway",
      body: "Clients hit the gateway. The gateway authenticates and routes <code>/mobile/*</code> to the mobile BFF and <code>/web/*</code> to the web BFF. The BFFs call orders and profile on the internal network. If you only have one client, you may not need a BFF yet — the gateway plus the services are enough. Add one when a second client starts distorting the API."
    }
  ],

  keyTerms: [
    { term: "BFF", def: "A backend owned by one client that aggregates domain services into that client's response shape." },
    { term: "Aggregation", def: "Several downstream calls folded into one payload, with fields the client did not ask to assemble." },
    { term: "Partial response", def: "A page that renders the sections whose services answered and omits the ones that timed out." },
    { term: "Domain service", def: "The owner of a business resource. It does not know which screen is calling." },
    { term: "Client team ownership", def: "The people who ship the app also ship the BFF, so response changes do not wait on every other team." }
  ],

  tradeoffs: [
    { pro: "The phone makes one call and does not learn internal topology.", con: "Each client adds a deployable you must monitor." },
    { pro: "Mobile and web can evolve their payloads separately.", con: "Shared formatting gets copied until someone pushes it back down." },
    { pro: "The BFF can drop a failed badge and still show orders.", con: "Hiding failures too well means you ship a blank section and never page anyone." },
    { pro: "Domain services stay free of screen logic.", con: "A BFF that writes orders has stolen the domain and become a monolith." }
  ],

  interviewTips: [
    "Use a BFF when two clients want different shapes. Do not start with one for a single web app out of habit.",
    "The BFF aggregates and degrades. It does not own the order row.",
    "Put it behind the gateway: gateway does auth and routing, BFF does the screen.",
    "Name timeouts and a partial response. A slow downstream must not consume the whole budget.",
    "If a rule is copied into every BFF, move it into the domain service."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "iOS app", type: "phone", pos: [-10, 0, -2] },
      { id: "web", label: "Web app", type: "user", pos: [-10, 0, 3], showAt: 3 },
      { id: "gw", label: "API gateway", type: "gateway", pos: [-5.5, 0, 0] },
      { id: "mbff", label: "Mobile BFF", type: "service", pos: [-1, 0, -2.4] },
      { id: "wbff", label: "Web BFF", type: "service", pos: [-1, 0, 3], showAt: 3 },
      { id: "orders", label: "Orders", type: "db", pos: [4.5, 0, -3] },
      { id: "profile", label: "Profile", type: "db", pos: [4.5, 0, 0] },
      { id: "notes", label: "Badges", type: "service", pos: [4.5, 0, 3.2], showAt: 2 },
      { id: "n0", label: "One screen, one call", type: "note", pos: [0, 0, -7] }
    ],
    edges: [
      { from: "phone", to: "gw" },
      { from: "gw", to: "mbff", label: "/mobile" },
      { from: "mbff", to: "orders" },
      { from: "mbff", to: "profile" },
      { from: "mbff", to: "notes", showAt: 2, dashed: true },
      { from: "web", to: "gw", showAt: 3 },
      { from: "gw", to: "wbff", showAt: 3 }
    ],
    steps: [
      {
        title: "The app asks for a screen",
        text: "iOS calls one endpoint for the home screen. It does not call orders, profile, and badges itself. The gateway has already checked the token.",
        highlight: ["phone", "gw", "mbff", "n0"],
        flows: [
          { from: "phone", to: "gw", color: "#4ade80", label: "home" },
          { from: "gw", to: "mbff", color: "#60a5fa", label: "route" }
        ]
      },
      {
        title: "Glue, not the ledger",
        text: "The mobile BFF reads orders and profile. It does not store them. The shape of the JSON is a screen concern; the rows stay in the domain services.",
        highlight: ["mbff", "orders", "profile"],
        flows: [
          { from: "mbff", to: "orders", color: "#c084fc", label: "read" },
          { from: "mbff", to: "profile", color: "#c084fc", label: "read" }
        ]
      },
      {
        title: "Drop what did not answer",
        text: "Badges time out. The BFF returns orders and the name, and omits the badge. The screen renders. The badge failure is logged, not turned into a 500 for the whole page.",
        highlight: ["mbff", "notes", "orders"],
        fail: ["notes"],
        flows: [{ from: "mbff", to: "notes", color: "#f87171", label: "timeout" }]
      },
      {
        title: "Web does not inherit the mobile payload",
        text: "The browser has its own BFF and a richer response. Shipping an iOS field change does not force a web deploy. Shared pricing rules, if they appear in both, move down into Orders.",
        highlight: ["web", "gw", "wbff", "mbff"],
        flows: [{ from: "web", to: "gw", color: "#4ade80", label: "/web" }]
      }
    ]
  }
});
