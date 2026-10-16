window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 11,
  title: "Layer 4 vs Layer 7 Load Balancing, Sessions, and Autoscaling",
  video: "",
  category: "Caching and Scale",
  tagline: "L4 ships packets; L7 reads HTTP. Sticky sessions fight autoscaling.",
  summary: "A load balancer is not one product. Layer 4 balancers forward TCP connections from a 5-tuple and stay cheap and dumb. Layer 7 balancers terminate TLS, read the URL and headers, and can route, rewrite, and pin sessions. In-memory HttpSession on a Spring app forces sticky routing, which then fights scale-in, rolling deploys, and instance death. The durable fix is an external session store plus health checks and connection draining so the autoscaling group can add and remove boxes without dropping logged-in users.",

  theory: [
    {
      heading: "Why one box is not a balancer",
      body: "A single Spring Boot process on port 8080 will serve until it will not: CPU pegs, the GC pause grows, and every new TCP handshake waits. Horizontal scale means several identical instances behind one VIP. The thing in front that picks an instance is the <b>load balancer</b>. Clients keep one DNS name; the fleet behind it can change. Without that hop you cannot autoscale, blue/green, or survive a single JVM crash.",
      bullets: [
        "The VIP is the contract. Instance IPs are an implementation detail.",
        "Health checks decide who is in the pool, not who was in yesterday's YAML.",
        "Capacity is a count of healthy instances, not a bigger VM."
      ]
    },
    {
      heading: "Layer 4: TCP, ports, and no HTTP",
      body: "<b>Layer 4</b> (transport) sees IP addresses, ports, and the TCP 5-tuple. It can round-robin connections, hash a source IP, or pass TLS bytes through untouched. It cannot read <code>/checkout</code> versus <code>/static</code>, cannot set a cookie, and cannot reject a bad <code>Authorization</code> header. That blindness is the feature: it is fast, it works for gRPC and raw TCP, and the app still owns certificates if you choose passthrough. AWS NLB and LVS sit here. In Java terms it is closer to a connection multiplexer than to a servlet filter.",
      bullets: [
        "Decision key: source IP, dest IP, ports, protocol — not the URI.",
        "One TCP connection stays on one backend for its lifetime.",
        "WebSockets and HTTP/2 multiplexed streams still look like one L4 flow."
      ]
    },
    {
      heading: "Layer 7: HTTP, TLS, and routing rules",
      body: "<b>Layer 7</b> (application) terminates TLS, parses HTTP, and routes on host, path, method, or header. That is an API gateway or an ALB/nginx/Spring Cloud Gateway hop. You can send <code>/api/**</code> to the order service and <code>/assets/**</code> to a CDN origin, inject headers, rate-limit, and return 401 without waking a JVM. Cost: more CPU per request, certificate management on the balancer, and a new failure domain that must understand HTTP versions and timeouts. A typical Spring Cloud Gateway route is <code>Path=/orders/**</code> → <code>lb://order-service</code> — that <code>lb://</code> is L7 service discovery, not a TCP 5-tuple hash.",
      bullets: [
        "L7 can retry an idempotent GET on a 502; L4 cannot see the GET.",
        "Header-based canaries (<code>X-Canary: true</code>) are an L7 trick.",
        "Do not put business logic in the balancer; keep rules mechanical."
      ]
    },
    {
      heading: "Sessions pin you to a machine",
      body: "Tomcat's default <code>HttpSession</code> lives in the heap of one process. After login, the next request must hit that same JVM or the user looks logged out. Operators then enable <b>sticky sessions</b> (session affinity): the L7 balancer sets a cookie such as <code>AWSALB</code> or hashes the JSESSIONID to a backend. Affinity is a bandage. The instance still dies, rolling deploys still drain it, and one hot user can glue an oversized session to a box that you wanted to scale in. Spring Session with Redis (<code>@EnableRedisHttpSession</code>) moves the map out of the JVM. Any healthy instance can load the session by id. Stickiness becomes optional, which is the point.",
      bullets: [
        "Sticky + autoscale = users whose instance vanished mid-checkout.",
        "Replicate sessions between JVMs if you must, but Redis (or a DB) is the usual store.",
        "Keep session payloads small; a 2 MB cart in Redis is a cache-eviction bug waiting to happen."
      ]
    },
    {
      heading: "Autoscaling needs a drain path",
      body: "An autoscaling group (or a Kubernetes HPA) adds replicas when CPU, request rate, or a custom metric crosses a threshold, and removes them when load falls. New instances must pass a <b>health check</b> (<code>/actuator/health</code> in Spring) before the balancer sends traffic. Scale-in must <b>drain</b>: stop new connections, finish in-flight requests, then kill the process. If you kill first, L4 connections reset and L7 calls get 502s. Pair draining with a session store so a request that lands on a sibling after drain still sees the same user. Warm-up matters too: a JVM that just started will JIT and fill connection pools; a slow-start or connection warmup on the balancer avoids dumping a spike onto a cold box.",
      bullets: [
        "Health check != process up. Check DB, Redis, and disk, or you will take traffic you cannot serve.",
        "Connection draining timeout should exceed your slowest legitimate request.",
        "Scale on saturation (queue depth, p99), not only average CPU."
      ]
    },
    {
      heading: "Putting L4, L7, and scale on one path",
      body: "Production often stacks them. An L4 balancer or anycast VIP spreads packets across availability zones. An L7 hop then routes by path and holds the TLS cert. App instances share Redis for sessions and a cache for hot reads. Autoscaling watches the app tier, not the balancer. Choose L4 when you need raw throughput, unknown protocols, or TLS that must end in the app. Choose L7 when you need path routing, authn at the edge, or cookie affinity as a temporary crutch. Never let in-memory session be the reason you cannot scale.",
      bullets: [
        "Cache (CDN or Redis) is how you survive the traffic the balancer just admitted.",
        "If every request needs the session, the session store is on the hot path — size it like a database.",
        "Measure: open connections per instance, session get latency, and 5xx during deploys."
      ]
    }
  ],

  keyTerms: [
    { term: "Layer 4 load balancer", def: "Forwards TCP/UDP by IP and port without reading HTTP. Cheap, protocol-agnostic, TLS-passthrough capable." },
    { term: "Layer 7 load balancer", def: "Terminates the application protocol (usually HTTP), routes on URL/headers, and can retry or rewrite." },
    { term: "VIP", def: "Virtual IP or DNS name clients hit. The fleet behind it is replaceable." },
    { term: "Sticky session", def: "Affinity that sends a client back to the same instance so an in-memory session still works." },
    { term: "Session store", def: "External map (often Redis) keyed by session id so any instance can serve the user." },
    { term: "Health check", def: "Probe the balancer uses to decide if an instance may receive traffic." },
    { term: "Connection draining", def: "Stop new work on an instance, finish in-flight requests, then terminate it." },
    { term: "Autoscaling group", def: "Policy that adds or removes instances from the pool based on a metric and health." }
  ],

  tradeoffs: [
    { pro: "L4 is fast, simple, and works for any TCP service including gRPC passthrough.", con: "It cannot route on URL, cannot reject a bad token, and cannot retry an HTTP GET." },
    { pro: "L7 enables path routing, TLS offload, canaries, and WAF-style rules.", con: "It costs CPU, must speak HTTP correctly, and becomes a concentrated failure domain." },
    { pro: "Sticky sessions let you keep Tomcat HttpSession with almost no code change.", con: "They block scale-in, unevenly load hot users, and lose sessions when the pinned instance dies." },
    { pro: "Redis-backed Spring Session lets any replica serve any user.", con: "Session reads join the hot path; Redis latency and eviction now affect login." },
    { pro: "Autoscaling matches capacity to load and survives instance death.", con: "Without draining and a shared session store, scale events look like outages." }
  ],

  interviewTips: [
    "Draw L4 then L7 as two hops, and say which decision each one can make.",
    "When they mention login, ask where the session lives before you pick sticky versus Redis.",
    "Name connection draining and health checks as part of autoscaling, not as ops trivia.",
    "If you keep stickiness, explain it as a migration crutch, not the long-term design.",
    "Tie cache in: the balancer admits traffic; the cache (and session store) absorb the reads that follow."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Browser", type: "phone", pos: [-11, 0, -3] },
      { id: "user", label: "App client", type: "user", pos: [-11, 0, 3] },
      { id: "l4", label: "L4 NLB", type: "lb", pos: [-5, 0, -3], showAt: 1 },
      { id: "l7", label: "L7 Gateway", type: "gateway", pos: [-5, 0, 3], showAt: 2 },
      { id: "pool", label: "App pool", type: "zone", pos: [4, 0, 0], size: [10, 12] },
      { id: "s1", label: "Order JVM", type: "server", pos: [2, 0, -3] },
      { id: "s2", label: "Order JVM 2", type: "server", pos: [2, 0, 3] },
      { id: "s3", label: "Order JVM 3", type: "server", pos: [7, 0, 0], showAt: 6 },
      { id: "redis", label: "Session Redis", type: "cache", pos: [7, 0, -4], showAt: 5 },
      { id: "nSticky", label: "JSESSIONID pinned to JVM 1", type: "note", pos: [2, 0, -6], showAt: 3 },
      { id: "nL4", label: "TCP 5-tuple only, no URL", type: "note", pos: [-5, 0, -6], showAt: 1 },
      { id: "nL7", label: "Path /orders → app pool", type: "note", pos: [-5, 0, 6], showAt: 2 },
      { id: "nDrain", label: "Drain then scale-in", type: "note", pos: [7, 0, 5], showAt: 7 }
    ],
    edges: [
      { from: "phone", to: "s1", label: "HTTP" },
      { from: "phone", to: "l4", label: "TCP", showAt: 1 },
      { from: "l4", to: "s1", showAt: 1 },
      { from: "l4", to: "s2", showAt: 1 },
      { from: "user", to: "l7", label: "HTTPS", showAt: 2 },
      { from: "l7", to: "s1", showAt: 2 },
      { from: "l7", to: "s2", showAt: 2 },
      { from: "s1", to: "redis", label: "session", showAt: 5 },
      { from: "s2", to: "redis", showAt: 5 },
      { from: "s3", to: "redis", showAt: 6 },
      { from: "l7", to: "s3", showAt: 6 }
    ],
    steps: [
      {
        title: "One JVM, every request",
        text: "Browsers talk straight to a single Spring process. Heap sessions, CPU, and GC all live on that box. There is no pool to grow and no place to fail over.",
        highlight: ["phone", "s1"],
        flows: [{ from: "phone", to: "s1", color: "#4ade80", label: "req" }]
      },
      {
        title: "Layer 4 spreads TCP",
        text: "An NLB hashes the 5-tuple and forwards the connection. It never reads the URI. Cheap, protocol-agnostic, and still blind to /orders versus /health.",
        highlight: ["l4", "s1", "s2", "nL4"],
        flows: [
          { from: "phone", to: "l4", color: "#4ade80", label: "TCP" },
          { from: "l4", to: "s1", color: "#4ade80" },
          { from: "l4", to: "s2", color: "#4ade80" }
        ]
      },
      {
        title: "Layer 7 reads HTTP",
        text: "The gateway terminates TLS and routes Path=/orders/** to the app pool. It can retry a GET, inject headers, or send static paths elsewhere. That is application-layer balancing.",
        highlight: ["l7", "nL7", "s1", "s2"],
        flows: [
          { from: "user", to: "l7", color: "#4ade80", label: "HTTPS" },
          { from: "l7", to: "s1", color: "#60a5fa", label: "/orders" }
        ]
      },
      {
        title: "Sticky sessions glue a user",
        text: "HttpSession is in JVM 1's heap, so the L7 hop pins JSESSIONID there. The user is fast until that process is the one you wanted to replace.",
        highlight: ["s1", "nSticky", "l7"],
        flows: [
          { from: "l7", to: "s1", color: "#fb923c", label: "sticky" }
        ]
      },
      {
        title: "The pinned JVM dies",
        text: "Scale-in, a deploy, or a crash kills JVM 1. In-memory sessions vanish. The next request looks like a logout even though JVM 2 is healthy.",
        highlight: ["s2", "nSticky"],
        fail: ["s1"],
        flows: [{ from: "l7", to: "s1", color: "#f87171", label: "502" }]
      },
      {
        title: "Session lives in Redis",
        text: "@EnableRedisHttpSession stores the map by session id. JVM 2 loads the same user. Stickiness is no longer required for login to survive.",
        highlight: ["redis", "s2", "l7"],
        flows: [
          { from: "l7", to: "s2", color: "#4ade80", label: "any JVM" },
          { from: "s2", to: "redis", color: "#facc15", label: "GET session" }
        ]
      },
      {
        title: "Autoscaler adds a replica",
        text: "CPU crosses the threshold. A third JVM passes /actuator/health and joins the L7 pool. It reads Redis like the others, so it can take sticky-free traffic immediately.",
        highlight: ["s3", "redis", "l7", "pool"],
        flows: [
          { from: "l7", to: "s3", color: "#4ade80", label: "new" },
          { from: "s3", to: "redis", color: "#facc15" }
        ]
      },
      {
        title: "Drain, then scale in",
        text: "When load falls, the balancer stops sending new connections to a victim instance, waits for in-flight work, then terminates it. Shared sessions plus draining are what make L7 and autoscaling coexist.",
        highlight: ["nDrain", "s3", "l7", "redis"],
        fail: ["s3"],
        flows: [
          { from: "l7", to: "s2", color: "#60a5fa", label: "drained" },
          { from: "s2", to: "redis", color: "#facc15" }
        ]
      }
    ]
  }
});
