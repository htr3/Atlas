window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 23,
  title: "API Gateway",
  category: "Service Patterns",
  tagline: "One front door for clients — auth, limits, and routing. Not a place to hide the product.",
  summary: "An API gateway is the entry clients call. It terminates TLS, checks identity, enforces rate limits, and routes to the service that owns the resource. A load balancer only spreads connections; a gateway understands the request. It becomes a liability when business rules move into it, or when a single gateway process is the only copy.",

  theory: [
    {
      heading: "What clients are allowed to know",
      body: "Mobile apps and partners should not hold the address of every internal service, and they should not learn when you split \"orders\" into two deployments. They call one host. The <b>gateway</b> maps <code>/orders</code> to the order service and <code>/search</code> to search. Internal services can still call each other directly; the gateway is the edge, not the entire network.",
      bullets: [
        "TLS ends here, or is passed through, but clients see one certificate and one domain.",
        "Route by path, host, or header. Version can be a path prefix or a header.",
        "Internal east-west calls do not have to hairpin back through the edge."
      ]
    },
    {
      heading: "Cross-cutting work lives here",
      body: "Every public API needs the same chores: authenticate the token, reject an anonymous caller, count the caller against a <b>rate limit</b>, attach a correlation id, and write an access log. Doing that in twenty services means twenty slightly different bugs. The gateway does it once, then forwards a request the service can trust — often with the user id already resolved.",
      bullets: [
        "AuthN answers \"who is this?\" AuthZ that depends on the order row still belongs in the order service.",
        "A correlation id is minted here if the client did not send one.",
        "Request size limits and basic schema checks stop garbage before it fans out."
      ]
    },
    {
      heading: "A load balancer is not a gateway",
      body: "A load balancer picks a healthy socket. It does not know that <code>POST /payments</code> must carry a bearer token or that this API key is out of quota. A gateway can sit behind a load balancer: many gateway instances, one VIP. If you only have one gateway box, you have built the single point of failure the rest of the course told you to avoid.",
      bullets: [
        "Scale the gateway horizontally. It should be stateless; quotas live in a shared store.",
        "Health checks must prove the gateway can reach downstream, or you will route into a black hole.",
        "Timeouts at the edge must be shorter than the client's timeout and longer than the service's."
      ]
    },
    {
      heading: "Keep product code out",
      body: "The failure mode is a gateway that \"just this once\" computes tax, joins two services, and shapes the mobile payload. That process becomes a monolith with extra network hops. Aggregation for a specific client is a <b>backend for frontend</b>, a separate lesson. The gateway routes, protects, and observes. When a change requires a product manager, it does not belong in the gateway."
    }
  ],

  keyTerms: [
    { term: "API gateway", def: "The client-facing edge that authenticates, limits, and routes HTTP (or similar) calls to owning services." },
    { term: "Edge vs east-west", def: "North-south traffic enters from clients. East-west traffic is service to service and need not pass the gateway." },
    { term: "Correlation id", def: "An id stamped on the request and its logs so one call can be traced across services." },
    { term: "Rate limit", def: "A cap per key, user, or IP. Enforced at the edge so one caller cannot drown a service." },
    { term: "Stateless gateway", def: "Any instance can handle any request. Shared state such as quotas sits in a store, not in process memory." }
  ],

  tradeoffs: [
    { pro: "Clients learn one host, and auth is implemented once.", con: "A bad gateway deploy sits in front of every product." },
    { pro: "Rate limits and size caps stop abuse early.", con: "A wrong limit blocks a legitimate partner and looks like an outage." },
    { pro: "Many stateless instances remove the single box.", con: "You still depend on the gateway's config store and certificate pipeline." },
    { pro: "Services stay private.", con: "Putting business rules in the gateway recreates a monolith at the edge." }
  ],

  interviewTips: [
    "Define the gateway as auth, rate limit, routing, and request logs. Then say what you will not put there.",
    "Contrast it with a load balancer: the balancer picks a socket; the gateway understands the API.",
    "Run more than one instance behind a load balancer. Quotas live in Redis or similar, not in memory.",
    "Leave order-level authorization in the order service. The gateway does not know who owns order 17.",
    "If they ask for mobile-specific aggregation, point at a BFF instead of fattening the gateway."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Client", type: "phone", pos: [-10, 0, 0] },
      { id: "lb", label: "Load balancer", type: "lb", pos: [-6, 0, 0] },
      { id: "gw", label: "API gateway", type: "gateway", pos: [-1.5, 0, 0] },
      { id: "orders", label: "Orders", type: "service", pos: [4, 0, -3], showAt: 2 },
      { id: "search", label: "Search", type: "service", pos: [4, 0, 3], showAt: 2 },
      { id: "quota", label: "Quota store", type: "cache", pos: [-1.5, 0, 3.6], showAt: 1 },
      { id: "n0", label: "Auth and limit here", type: "note", pos: [-4, 0, -6.5] },
      { id: "n1", label: "No tax logic", type: "note", pos: [6, 0, -6.5], showAt: 4 }
    ],
    edges: [
      { from: "phone", to: "lb" },
      { from: "lb", to: "gw" },
      { from: "gw", to: "quota", label: "count", showAt: 1 },
      { from: "gw", to: "orders", label: "/orders", showAt: 2 },
      { from: "gw", to: "search", label: "/search", showAt: 2 }
    ],
    steps: [
      {
        title: "One host for the client",
        text: "The phone knows a single domain. A load balancer spreads connections across gateway instances. The phone does not know which one, and does not know the order service's address.",
        highlight: ["phone", "lb", "gw", "n0"],
        flows: [
          { from: "phone", to: "lb", color: "#4ade80", label: "TLS" },
          { from: "lb", to: "gw", color: "#60a5fa", label: "pick" }
        ]
      },
      {
        title: "Who, and how many",
        text: "The gateway checks the token and increments the caller's quota. A shared store holds the count so the next instance sees it too. Failure here never reaches Orders.",
        highlight: ["gw", "quota"],
        flows: [{ from: "gw", to: "quota", color: "#facc15", label: "limit" }]
      },
      {
        title: "Route by path",
        text: "/orders goes to the order service. /search goes to search. A correlation id is attached so logs on both sides can be tied together.",
        highlight: ["gw", "orders", "search"],
        flows: [{ from: "gw", to: "orders", color: "#4ade80", label: "/orders" }]
      },
      {
        title: "The service still owns the rule",
        text: "Whether this user may see order 17 is decided next to the order row. The gateway only proved the token. East-west calls between services skip the edge.",
        highlight: ["orders", "gw"],
        flows: [{ from: "gw", to: "orders", color: "#c084fc", label: "user id" }]
      },
      {
        title: "Stop before it becomes the product",
        text: "Tax, payload shaping for a specific app, and multi-service workflows do not get added here. Those are a BFF or the owning service. The gateway stays replaceable.",
        highlight: ["gw", "n1", "orders"],
        flows: []
      }
    ]
  }
});
