window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 1,
  title: "Requirements, Latency, Throughput, and Stateless Services",
  video: "",
  category: "Roadmap Foundations",
  tagline: "Write SLOs first, then pick latency, throughput, and a stateless Spring fleet.",
  summary: "A Java/Spring system-design interview starts with requirements, not boxes. Functional needs say what the API does; non-functional needs say how fast, how often, and how it fails. Latency is the time of one request; throughput is how many complete per second. They fight for the same thread pool. Sticky HttpSession looks convenient and then pins you to one replica. A stateless service — JWT or a shared session store — lets any Spring instance answer, which is the only way horizontal scale actually works.",

  theory: [
    {
      heading: "Write the numbers before you draw the diagram",
      body: "System design is not a catalog of load balancers. Start with who the user is, what they must be able to do, and the numbers that make the design true or false. Functional requirements are verbs: place an order, list recent orders, cancel. Non-functional requirements are budgets: p99 under 200 ms, 5k writes/s at peak, 99.9% availability, data in the user's region. A Spring <code>@RestController</code> that satisfies the verbs but misses the budget is still a failed design.",
      bullets: [
        "Ask QPS, payload size, read/write mix, and peak vs average before naming Redis.",
        "An SLO is a promise (p99 checkout &lt; 300 ms). An SLA is the contract around that promise.",
        "If the interviewer gives no numbers, propose them out loud and design to those."
      ]
    },
    {
      heading: "Latency is one request's wall clock",
      body: "Latency is how long the client waits. For a typical Spring MVC call it is DNS + TLS + Tomcat queue + controller + JDBC + serialization. The interesting number is almost never the mean. Report <b>p50 / p95 / p99</b>: if p50 is 40 ms and p99 is 900 ms, one in a hundred callers had a bad day. A slow JDBC query, a GC pause, or a lock on <code>orders</code> shows up in the tail, not the average. Measure at the client (or at the API gateway) so you include queue time, not only handler time.",
      bullets: [
        "p99 is the interview default unless they ask for something else.",
        "A 2 ms Redis get does not make the API 2 ms if Tomcat already queued 80 ms.",
        "Synchronous fan-out (three sequential WebClient calls) adds latencies; parallelize or cut hops."
      ]
    },
    {
      heading: "Throughput is completed work per second",
      body: "Throughput is how many requests the fleet finishes per second, not how hard one CPU looks. Little's Law: concurrency ≈ latency × throughput. If each request holds a Tomcat thread for 200 ms, a pool of 200 threads tops out near 1000 RPS even if CPUs are idle waiting on Postgres. Raising throughput without shrinking latency means more replicas or more threads — and more connections into the database. Spring Boot's default Tomcat pool is a hidden capacity knob; so is HikariCP.",
      bullets: [
        "RPS of tiny health checks is not the RPS of a 50 KB JSON checkout.",
        "Batching and async (WebFlux, queues) raise throughput by releasing threads.",
        "The database, not the JVM, is usually the throughput ceiling."
      ]
    },
    {
      heading: "Latency and throughput pull in opposite directions",
      body: "A giant batch job has excellent throughput and terrible interactive latency. A chatty per-row API feels snappy at one user and melts under load. You pick a point on that curve: keep checkout p99 low, and push reporting onto a queue so it does not steal Tomcat threads. Caching, connection pooling, and avoiding N+1 queries help both — they remove work. Everything else is a choice: more replicas (throughput) versus a tighter hot path (latency).",
      bullets: [
        "Say which metric is the product constraint, then sacrifice the other on purpose.",
        "Timeouts convert infinite latency into errors so throughput can recover."
      ]
    },
    {
      heading: "Sticky sessions are a trap with a Spring face",
      body: "<code>HttpSession</code> stored in the servlet container is state on that JVM. A load balancer with sticky sessions (cookie or IP affinity) sends the same user back so the cart still exists. The replica cannot be killed, cannot be autoscaled in, and cannot fail over without emptying the cart. Spring Session can move that map into Redis — better, but now Redis is on the request path and you still have server-side session lifetime to reason about.",
      bullets: [
        "Sticky routing hides a stateful app instead of fixing it.",
        "A rolling deploy of a sticky fleet still drops users pinned to the dying pod.",
        "Shared session store is a halfway house: any instance can serve, but you operate another store."
      ]
    },
    {
      heading: "Stateless services: any replica, any request",
      body: "A stateless Spring service keeps durable state out of the JVM. Auth is a signed JWT (or opaque token looked up in Redis), the cart is a row in Postgres, and the instance is cattle. The load balancer can round-robin. Horizontal scale is adding pods. Spring Security resource-server mode plus a short-lived access token is the usual shape. Idempotency keys live in the database, not in a local <code>HashMap</code>. Local caches are allowed if a miss is always correct — they are an optimization, not the source of truth.",
      bullets: [
        "If you can kill any pod and users do not notice, you are stateless enough.",
        "Put retry-safe writes behind idempotency keys; do not rely on in-memory dedupe.",
        "Stateless does not mean no state in the system — it means no unique state on this box."
      ]
    }
  ],

  keyTerms: [
    { term: "Functional requirement", def: "What the product must do (place order, refund). Independent of hardware." },
    { term: "SLO / p99 latency", def: "A service-level objective on the tail: 99% of requests finish under a stated time." },
    { term: "Throughput (RPS)", def: "Completed requests per second for a given payload and code path." },
    { term: "Little's Law", def: "In-flight requests ≈ latency × throughput. Thread pools make this painfully concrete." },
    { term: "Sticky session", def: "Load-balancer affinity that pins a user to one instance because session lives there." },
    { term: "Stateless service", def: "Any healthy replica can handle any request; durable state is in a shared store or token." },
    { term: "JWT", def: "Signed claims the resource server verifies without calling the issuer on every request." },
    { term: "Tomcat thread pool", def: "The servlet container's concurrency budget. A blocked JDBC call occupies one slot." }
  ],

  tradeoffs: [
    { pro: "Designing to written SLOs makes capacity and caching decisions testable.", con: "Fake numbers you invented can lock you into Redis or Kafka nobody asked for." },
    { pro: "Optimizing p99 forces you to hunt GC, locks, and slow queries.", con: "p50 can look fine while a tenth of users rage-quit." },
    { pro: "Raising replica count raises throughput without rewriting the handler.", con: "More pods mean more DB connections and a hotter primary." },
    { pro: "HttpSession + stickiness ships a cart with almost no extra code.", con: "You cannot drain instances, and a crash wipes in-flight sessions." },
    { pro: "JWT-backed stateless pods scale and roll independently.", con: "Revocation and oversized cookies become their own design problem." }
  ],

  interviewTips: [
    "Open with users, QPS, payload, and p99 before drawing a load balancer.",
    "Separate latency (one call) from throughput (fleet). Mix them and the interviewer will correct you.",
    "Name the Tomcat/Hikari pool when you talk capacity — it shows you have run Spring in prod.",
    "If you keep session in the JVM, say sticky sessions and then say why you will not.",
    "Stateless punchline: kill any pod, user still checks out. JWT or Spring Session in Redis are the two answers.",
    "Pick one number you will not sacrifice (checkout p99) and one you will (report generation delay)."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Shopper", type: "phone", pos: [-11, 0, -3] },
      { id: "pm", label: "PM / SLOs", type: "user", pos: [-11, 0, 3] },
      { id: "n_req", label: "p99 < 200ms, 5k RPS peak", type: "note", pos: [-8, 3.4, 6.5] },
      { id: "gw", label: "API gateway", type: "gateway", pos: [-6, 0, 0] },
      { id: "s1", label: "Spring A", type: "server", pos: [-1, 0, -3] },
      { id: "s2", label: "Spring B", type: "server", pos: [-1, 0, 3], showAt: 4 },
      { id: "db", label: "Orders DB", type: "db", pos: [5, 0, 0] },
      { id: "n_lat", label: "Latency = one checkout", type: "note", pos: [5, 3.4, -6.5], showAt: 1 },
      { id: "n_tps", label: "Throughput = checkouts/s", type: "note", pos: [-1, 3.4, -6.5], showAt: 2 },
      { id: "n_p99", label: "p50 40ms, p99 900ms", type: "note", pos: [5, 3.4, 6.5], showAt: 3 },
      { id: "sess", label: "HttpSession", type: "cache", pos: [-1, 0, 0], showAt: 4 },
      { id: "lb", label: "Sticky LB", type: "lb", pos: [-6, 0, 0], showAt: 4 },
      { id: "n_stick", label: "Cookie pins user to A", type: "note", pos: [-6, 3.4, -6.5], showAt: 4 },
      { id: "jwt", label: "JWT auth", type: "service", pos: [5, 0, 4], showAt: 6 },
      { id: "s3", label: "Spring C", type: "server", pos: [2.5, 0, 3], showAt: 7 },
      { id: "n_stat", label: "Any pod can serve", type: "note", pos: [2.5, 3.4, 6.5], showAt: 7 },
      { id: "fleet", label: "Stateless fleet", type: "zone", pos: [0.6, 0, 0], size: [8.5, 8], showAt: 7 }
    ],
    edges: [
      { from: "pm", to: "gw", label: "SLOs" },
      { from: "phone", to: "gw", label: "checkout" },
      { from: "gw", to: "s1", label: "HTTP" },
      { from: "s1", to: "db", label: "JDBC" },
      { from: "phone", to: "lb", showAt: 4 },
      { from: "lb", to: "s1", label: "sticky", showAt: 4 },
      { from: "s1", to: "sess", showAt: 4 },
      { from: "phone", to: "jwt", label: "Bearer", showAt: 6 },
      { from: "jwt", to: "s2", showAt: 6 },
      { from: "lb", to: "s2", showAt: 7 },
      { from: "lb", to: "s3", showAt: 7 },
      { from: "s2", to: "db", showAt: 7 },
      { from: "s3", to: "db", showAt: 7 }
    ],
    steps: [
      {
        title: "Requirements before boxes",
        text: "The PM states the budget: p99 checkout under 200 ms at 5k peak RPS. The shopper only wants to pay. Nothing else in the diagram is allowed until those numbers are written down.",
        highlight: ["phone", "pm", "n_req", "gw"],
        flows: [
          { from: "pm", to: "gw", color: "#c084fc", label: "SLO" },
          { from: "phone", to: "gw", color: "#4ade80", label: "intent" }
        ]
      },
      {
        title: "Latency is one wall-clock checkout",
        text: "One POST /checkout travels gateway → Spring A → Postgres. That whole path is latency. A fast controller with a slow JDBC round-trip is still a slow API.",
        highlight: ["phone", "gw", "s1", "db", "n_lat"],
        flows: [
          { from: "phone", to: "gw", color: "#4ade80", label: "POST" },
          { from: "gw", to: "s1", color: "#4ade80", label: "MVC" },
          { from: "s1", to: "db", color: "#60a5fa", label: "JDBC" }
        ]
      },
      {
        title: "Throughput is checkouts per second",
        text: "Five thousand of those checkouts must finish each second. Each in-flight call holds a Tomcat thread and a Hikari connection. Little's Law: 200 ms × 5k RPS wants about a thousand concurrent slots.",
        highlight: ["s1", "db", "n_tps", "phone"],
        flows: [
          { from: "phone", to: "gw", color: "#4ade80", label: "×5k" },
          { from: "s1", to: "db", color: "#fb923c", label: "pool" }
        ]
      },
      {
        title: "The tail is the real SLO",
        text: "p50 is 40 ms. p99 is 900 ms because of a lock or a GC pause. Averages would hide the users who bounce. Design and alerts sit on the tail.",
        highlight: ["s1", "db", "n_p99"],
        flows: [
          { from: "s1", to: "db", color: "#f87171", label: "lock wait" }
        ]
      },
      {
        title: "HttpSession pins the shopper to A",
        text: "The cart lives in Spring A's JVM. The load balancer sets a sticky cookie so the next request comes back to A. Replica B exists but cannot see the cart.",
        highlight: ["lb", "s1", "sess", "n_stick", "s2"],
        hide: ["gw"],
        flows: [
          { from: "phone", to: "lb", color: "#4ade80", label: "cookie" },
          { from: "lb", to: "s1", color: "#fb923c", label: "sticky" },
          { from: "s1", to: "sess", color: "#c084fc", label: "session" }
        ]
      },
      {
        title: "Instance A dies, cart dies",
        text: "A rolling deploy or a crash kills Spring A. Sticky routing has nowhere safe to send the shopper. Throughput of the remaining fleet does not help a stateful session.",
        highlight: ["s1", "sess", "phone", "lb"],
        fail: ["s1", "sess"],
        hide: ["gw"],
        flows: [
          { from: "phone", to: "lb", color: "#f87171", label: "retry" },
          { from: "lb", to: "s1", color: "#f87171", label: "dead" }
        ]
      },
      {
        title: "JWT makes the request self-contained",
        text: "The shopper presents a signed Bearer token. Spring B verifies it locally, loads the cart from Postgres, and answers. No JVM map required.",
        highlight: ["jwt", "s2", "db", "phone"],
        hide: ["gw", "sess"],
        flows: [
          { from: "phone", to: "jwt", color: "#4ade80", label: "Bearer" },
          { from: "jwt", to: "s2", color: "#60a5fa", label: "ok" },
          { from: "s2", to: "db", color: "#60a5fa", label: "cart row" }
        ]
      },
      {
        title: "Any pod can serve; scale out",
        text: "The balancer round-robins A, B, and C. Kill any one and checkout continues. That is the definition of a stateless Spring fleet — and the foundation the rest of this roadmap assumes.",
        highlight: ["lb", "s1", "s2", "s3", "fleet", "n_stat", "db"],
        hide: ["gw", "sess"],
        flows: [
          { from: "phone", to: "lb", color: "#4ade80", label: "POST" },
          { from: "lb", to: "s2", color: "#60a5fa", label: "RR" },
          { from: "lb", to: "s3", color: "#60a5fa", label: "RR" },
          { from: "s3", to: "db", color: "#60a5fa", label: "JDBC" }
        ]
      }
    ]
  }
});
