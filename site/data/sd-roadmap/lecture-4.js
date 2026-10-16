window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 4,
  title: "REST, GraphQL, gRPC, and Realtime Channels",
  video: "",
  category: "Networking",
  tagline: "One order service, four contracts: REST, GraphQL, gRPC, and a live channel.",
  summary: "The transport from lecture 3 can carry several API styles. REST exposes resources with HTTP verbs — Spring MVC's default. GraphQL lets the client pick fields from one graph, which fixes over-fetching and can create a query-cost problem. gRPC sends protobuf over HTTP/2 for low-latency service-to-service calls. Realtime channels (WebSocket, STOMP, SSE) push after the request is gone. Pick by who the client is, not by fashion: browsers like REST or GraphQL; Spring-to-Spring often likes gRPC; tickers and chat need a channel.",

  theory: [
    {
      heading: "REST: resources, verbs, and boring URLs",
      body: "A REST API models nouns: <code>/orders/{id}</code>, <code>/orders/{id}/items</code>. GET reads, POST creates, PUT/PATCH updates, DELETE removes. Spring's <code>@RestController</code> plus Jackson JSON is the default Java shape. Status codes and hypermedia are optional maturity; most production APIs are 'HTTP JSON with resource URLs.' Version with a header or a prefix (<code>/v1</code>) before you break clients. Cache GET at the CDN only when the response is actually cacheable.",
      bullets: [
        "Query params filter a collection; they should not hide a second resource.",
        "Partial updates are PATCH; accidental PUT of a missing field zeros data.",
        "OpenAPI (springdoc) is the contract you show mobile teams."
      ]
    },
    {
      heading: "GraphQL: one endpoint, a shaped tree",
      body: "The client sends a query document to <code>/graphql</code> and asks for exactly the fields it will render. That kills the mobile over-fetch of REST's fat order DTO, and the under-fetch of N extra GETs. Spring GraphQL (or graphql-java) maps fields to DataFetchers — which become N+1 SQL unless you use DataLoader. You now need query depth/cost limits, persisted queries, and a different auth story (field-level). Mutations and subscriptions live in the same schema. File uploads and cache headers are clumsier than REST.",
      bullets: [
        "A GraphQL query is not cheaper than REST if the fetchers still join the whole database.",
        "CDN caching a POST /graphql needs persisted-query hashes or GET with APQ.",
        "Use GraphQL at the BFF edge; keep internal services REST or gRPC."
      ]
    },
    {
      heading: "gRPC: protobuf, stubs, and HTTP/2",
      body: "You write a <code>.proto</code>, generate Java stubs, and call methods as if they were local. Payloads are binary protobuf — smaller and strictly typed. Transport is HTTP/2 (streams, trailers for status). Deadlines map cleanly onto lecture 3's timeouts. Spring Boot 3 can host gRPC services; clients get blocking or reactive stubs. Browser support is poor without grpc-web or a gateway. Breaking a field number in the proto is the compatibility game; add fields, do not reuse numbers.",
      bullets: [
        "Unary RPC is request/response. Server streaming is a cursor of messages.",
        "Load balancing needs a proxy that understands HTTP/2 or a lookaside balancer.",
        "Use gRPC between Spring services; expose REST/JSON at the public edge."
      ]
    },
    {
      heading: "Realtime: WebSocket, STOMP, and SSE",
      body: "When the client must hear 'order shipped' without polling, open a channel. Raw WebSocket is a duplex byte/text pipe. Spring STOMP over WebSocket adds destinations (<code>/topic/orders/{id}</code>) and broker (simple in-memory, or Relay to Rabbit/ActiveMQ). SSE (Server-Sent Events) is a one-way HTTP stream — enough for notifications, easier with proxies. You now own heartbeats, reconnect, backpressure, and fan-out. A channel is not a substitute for a durable queue between services.",
      bullets: [
        "STOMP broker relay scales pub/sub; an in-memory broker does not.",
        "Mobile networks drop sockets; design reconnect with last-event-id.",
        "Do not run checkout RPC over WebSocket just because the socket is open."
      ]
    },
    {
      heading: "Choosing in a Spring shop",
      body: "Public mobile/web: REST, or GraphQL at a BFF if the UI is deeply nested. Service-to-service inside the VPC: gRPC for chatty fan-out, REST if the team is small and you want curl-debuggability. Live order board: SSE or STOMP. Mixing is normal — the same OrderService can expose a REST controller, a gRPC service, and a STOMP publisher from one domain module. Translate at the edge (grpc-gateway, Spring Cloud Gateway) rather than making every client speak four protocols.",
      bullets: [
        "Contract tests (Spring Cloud Contract, buf breaking) matter more than the logo on the box.",
        "Auth: bearer JWT on REST/GraphQL; metadata on gRPC; CONNECT handler on WebSocket."
      ]
    },
    {
      heading: "Versioning, errors, and backpressure",
      body: "REST versions URLs or headers. GraphQL deprecates fields in schema. gRPC adds optional proto fields. Realtime protocols version message payloads. Errors: HTTP status vs GraphQL error array vs gRPC status codes vs STOMP ERROR frames — map them at the edge so the phone sees one language. Backpressure: HTTP is natural (the client reads slower); GraphQL needs complexity limits; gRPC has flow control; WebSocket will melt you if producers outrun consumers — bound in-memory sends or drop to a queue."
    }
  ],

  keyTerms: [
    { term: "Resource URL", def: "A REST noun ( /orders/42 ) manipulated with HTTP verbs." },
    { term: "Over-fetching", def: "REST DTO returns fields the client will not render. GraphQL's usual pitch." },
    { term: "DataLoader", def: "Batches GraphQL field fetches so resolvers do not N+1 the database." },
    { term: "protobuf", def: "Tagged binary schema used by gRPC. Field numbers are the compatibility contract." },
    { term: "Unary RPC", def: "Single request, single response — the gRPC analog of a REST POST." },
    { term: "STOMP", def: "A text messaging protocol Spring layers on WebSocket with /topic and /queue destinations." },
    { term: "SSE", def: "Server-Sent Events: one-way HTTP stream for notifications without a full duplex socket." },
    { term: "BFF", def: "Backend-for-frontend: an edge adapter that shapes REST/gRPC into what one UI needs." }
  ],

  tradeoffs: [
    { pro: "REST is cacheable, curl-friendly, and matches Spring MVC muscle memory.", con: "Nested UIs either over-fetch fat DTOs or under-fetch with chatty GETs." },
    { pro: "GraphQL returns exactly the tree the screen needs.", con: "Cost limits, N+1 fetchers, and weak HTTP caching are now your problem." },
    { pro: "gRPC is fast, typed, and has deadlines/streaming built in.", con: "Browsers and random partners cannot speak it without a gateway." },
    { pro: "WebSocket/STOMP push live state without poll tax.", con: "Reconnect, fan-out, and backpressure become a second product." }
  ],

  interviewTips: [
    "Do not pick GraphQL for a CRUD admin tool. Pick REST. Show you can refuse a trend.",
    "Say 'gRPC inside, REST at the edge' unless the client is another backend.",
    "If you mention GraphQL, mention DataLoader and query cost in the same breath.",
    "Realtime is for events the user is staring at. Order history is still GET /orders.",
    "Name how you version: URL prefix, proto optional fields, or GraphQL deprecation.",
    "Map errors at the gateway so the phone does not learn gRPC status codes."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Mobile UI", type: "phone", pos: [-11, 0, -4] },
      { id: "web", label: "Web BFF", type: "user", pos: [-11, 0, 0] },
      { id: "worker", label: "Worker JVM", type: "worker", pos: [-11, 0, 4] },
      { id: "gw", label: "Edge gateway", type: "gateway", pos: [-6, 0, 0] },
      { id: "rest", label: "REST /orders", type: "server", pos: [-1, 0, -4] },
      { id: "gql", label: "GraphQL", type: "service", pos: [-1, 0, 0], showAt: 2 },
      { id: "grpc", label: "gRPC Order", type: "service", pos: [-1, 0, 4], showAt: 4 },
      { id: "db", label: "Orders DB", type: "db", pos: [5, 0, 0] },
      { id: "n_rest", label: "GET /orders/42 JSON", type: "note", pos: [-1, 3.4, -7] },
      { id: "n_gql", label: "query { order { total } }", type: "note", pos: [-1, 3.4, 7], showAt: 2 },
      { id: "n_n1", label: "DataLoader batches SQL", type: "note", pos: [5, 3.4, -7], showAt: 3 },
      { id: "n_grpc", label: "protobuf over HTTP/2", type: "note", pos: [5, 3.4, 7], showAt: 4 },
      { id: "broker", label: "STOMP broker", type: "queue", pos: [5, 0, 4], showAt: 6 },
      { id: "ws", label: "WebSocket", type: "gateway", pos: [-6, 0, 4], showAt: 6 },
      { id: "n_ws", label: "/topic/orders/42", type: "note", pos: [-6, 3.4, 7], showAt: 6 },
      { id: "domain", label: "Order domain", type: "zone", pos: [1.8, 0, 0], size: [9.5, 10], showAt: 7 }
    ],
    edges: [
      { from: "phone", to: "gw", label: "HTTPS" },
      { from: "gw", to: "rest", label: "GET" },
      { from: "rest", to: "db" },
      { from: "web", to: "gw", showAt: 2 },
      { from: "gw", to: "gql", label: "/graphql", showAt: 2 },
      { from: "gql", to: "db", showAt: 2 },
      { from: "worker", to: "grpc", label: "RPC", showAt: 4 },
      { from: "grpc", to: "db", showAt: 4 },
      { from: "phone", to: "ws", label: "WS", showAt: 6 },
      { from: "ws", to: "broker", showAt: 6 },
      { from: "rest", to: "broker", label: "shipped", showAt: 6, dashed: true },
      { from: "gw", to: "grpc", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "REST resource for the phone",
        text: "Mobile loads GET /orders/42. The gateway routes to a Spring @RestController. JSON DTO comes back. Cacheable, curl-able, and slightly too fat for the screen.",
        highlight: ["phone", "gw", "rest", "db", "n_rest"],
        flows: [
          { from: "phone", to: "gw", color: "#4ade80", label: "GET" },
          { from: "gw", to: "rest", color: "#4ade80", label: "/orders/42" },
          { from: "rest", to: "db", color: "#60a5fa", label: "SQL" }
        ]
      },
      {
        title: "Over-fetch of a fat DTO",
        text: "The phone needed total and status. REST also shipped line items, addresses, and audit fields. That is bandwidth and Jackson time the UI will throw away.",
        highlight: ["phone", "rest", "n_rest"],
        flows: [
          { from: "rest", to: "gw", color: "#fb923c", label: "fat JSON" },
          { from: "gw", to: "phone", color: "#fb923c", label: "over-fetch" }
        ]
      },
      {
        title: "GraphQL shapes the tree",
        text: "The web BFF posts query { order { total status } } to /graphql. One round trip, only those fields. Spring GraphQL maps each field to a DataFetcher.",
        highlight: ["web", "gw", "gql", "db", "n_gql"],
        flows: [
          { from: "web", to: "gw", color: "#4ade80", label: "query" },
          { from: "gw", to: "gql", color: "#4ade80", label: "/graphql" },
          { from: "gql", to: "db", color: "#60a5fa", label: "fetch" }
        ]
      },
      {
        title: "DataLoader stops N+1 SQL",
        text: "A naive items { sku } resolver would query per line. DataLoader batches keys into one SELECT. GraphQL is only cheaper when fetchers are honest.",
        highlight: ["gql", "db", "n_n1"],
        flows: [
          { from: "gql", to: "db", color: "#c084fc", label: "batch" }
        ]
      },
      {
        title: "Workers speak gRPC",
        text: "A fulfillment JVM calls GetOrder as protobuf over HTTP/2. Typed stubs, deadlines, no JSON parser on the hot path. Browsers are not in this conversation.",
        highlight: ["worker", "grpc", "db", "n_grpc"],
        flows: [
          { from: "worker", to: "grpc", color: "#4ade80", label: "RPC" },
          { from: "grpc", to: "db", color: "#60a5fa", label: "row" }
        ]
      },
      {
        title: "Proto field numbers are the contract",
        text: "Add optional fields; never reuse a number. A REST /v2 is a new URL. gRPC evolves in place. The worker keeps compiling against the same package.",
        highlight: ["worker", "grpc", "n_grpc"],
        flows: [
          { from: "grpc", to: "worker", color: "#c084fc", label: "proto v2" }
        ]
      },
      {
        title: "STOMP pushes 'shipped'",
        text: "The REST command side publishes to a broker. The phone already holds a WebSocket. Spring STOMP delivers /topic/orders/42 without another poll. SSE would suffice for one-way status.",
        highlight: ["phone", "ws", "broker", "rest", "n_ws"],
        flows: [
          { from: "rest", to: "broker", color: "#fb923c", label: "shipped" },
          { from: "broker", to: "ws", color: "#fb923c", label: "topic" },
          { from: "ws", to: "phone", color: "#60a5fa", label: "frame" }
        ]
      },
      {
        title: "One domain, four facades",
        text: "Order domain stays one module. Edge exposes REST and GraphQL; internals use gRPC; the board uses STOMP. Translate at the gateway instead of teaching the phone protobuf.",
        highlight: ["domain", "rest", "gql", "grpc", "broker", "gw"],
        flows: [
          { from: "gw", to: "rest", color: "#4ade80", label: "public" },
          { from: "gw", to: "gql", color: "#4ade80", label: "BFF" },
          { from: "worker", to: "grpc", color: "#c084fc", label: "internal" }
        ]
      }
    ]
  }
});
