window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 29,
  title: "Percentiles, Little's Law, and Performance Testing",
  video: "",
  category: "Operations",
  tagline: "Users live in the tail. L = λW tells you the queue. A load test that ignores wait time lies about p99.",
  summary: "Averages hide the slow requests that users remember. Report p50, p95, p99, and max, with a defined window. Little's Law links concurrency, arrival rate, and latency: if you want lower latency at the same throughput, you must cut work in the system. Performance tests must apply a closed or open model honestly, avoid coordinated omission, and measure the same SLO histograms Micrometer exports in prod. Tuning a Hikari pool or a Tomcat thread count without this vocabulary is guessing.",

  theory: [
    {
      heading: "The average is not the experience",
      body: "One hundred requests at 20 ms and one at 5 s still \"average\" fine. The user who hit the slow one left. <b>Percentiles</b> answer \"how slow was the typical and the tail?\" p50 is the median. p99 is the request slower than 99% of the rest. Histograms, not a running mean of means, are how you compute them. Micrometer's <code>Timer</code> with percentiles or a Prometheus histogram is the Spring path. Logs of duration cannot cheaply give p99 at runtime. Always name the window (last 5 minutes) and the success set (do errors count?). A 500 that returns in 3 ms should not make p99 look healthy.",
      bullets: [
        "p99 of 1k RPS is 10 slow requests per second. That is not 'rare.'",
        "Multi-modal histograms (cache hit vs miss) make one p99 a blend. Split the metric.",
        "SLA math: 99.9% of 1e6 requests is 1000 allowed misses, not zero."
      ]
    },
    {
      heading: "Little's Law: L = λW",
      body: "In a stable system, the average number of requests in flight <b>L</b> equals arrival rate <b>λ</b> times average time in the system <b>W</b>. 200 RPS with 250 ms mean latency means 50 concurrent requests in the JVM, pools, and downstreams. If each Tomcat thread holds one request, you need enough threads and Hikari connections to cover L plus bursts. Raising λ without cutting W grows L until queues explode. Cutting W (faster SQL, smaller payloads, parallelism) is how you keep L bounded. The law is an identity for averages in steady state, not a percentile spell — but it tells you why a pool of 10 connections cannot serve 200 RPS at 200 ms (L would be 40).",
      bullets: [
        "In flight = queueing + service. W includes waits on the thread pool.",
        "Stability: if input &gt; output, L grows without bound and p99 dies first.",
        "Apply it per resource: DB connections, thread pool, Kafka consumer lag is a cousin."
      ]
    },
    {
      heading: "Queueing is why tails get fat",
      body: "When utilization of a pool approaches 1, wait time dominates service time. A 5 ms query behind a saturated Hikari pool becomes 200 ms. That is why p99 moves first, then p50. Head-of-line blocking (one slow query on a shared connection, one fat request on a thread) creates the tail. Isolation: separate pools for checkout vs reports; timeouts so a waiter dies instead of holding a thread; load shedding when L is already over budget. Spring: size <code>server.tomcat.threads.max</code> and <code>spring.datasource.hikari.maximumPoolSize</code> from Little's Law plus headroom, not from a blog post that says 10.",
      bullets: [
        "Timeouts must be smaller than the user's patience and larger than a healthy W.",
        "Cancellation: a timed-out HTTP request should stop burning the DB.",
        "A retry without a budget multiplies λ and makes L worse."
      ]
    },
    {
      heading: "Load tests that measure the right lie",
      body: "An <b>open model</b> (Gatling, k6) arrives at a set RPS regardless of how slow you are — closer to real users. A <b>closed model</b> (JMeter thread groups, wrk with a fixed concurrency) only sends the next request when the last returns, so a slow system hides load: that is <b>coordinated omission</b>. If you do not count wait time before the request is even sent, p99 looks great while users would have queued. Warm the JVM and the cache. Test a prod-like data size. Drive the same URL templates you export as metrics. Abort on error rate, not only on mean latency. Include a think-time that matches humans if you use a closed model, or just use open.",
      bullets: [
        "Coordinated omission: the tool waits, so it never records the wait.",
        "Spike, soak, and stress are different tests. A 5-minute ramp is not a soak.",
        "Stub the payment vendor, but do not stub the database you claim to be testing."
      ]
    },
    {
      heading: "Reading a Spring service with this toolkit",
      body: "Start from the SLO histogram. If p99 is bad, look at in-flight (L) and pool saturation. If L is high and CPU is idle, you are waiting on I/O or a lock. If CPU is pegged, you need more replicas or less work per request. Virtual threads (Java 21) change the thread-count arithmetic but not Little's Law: you still cannot have more in-flight DB queries than connections. A performance interview answer that only says \"add cache\" without λ, W, and a percentile is incomplete. Cache cuts W for hits and can stampede on misses — that is another lecture, applied here.",
      bullets: [
        "Measure before you tune. A flame graph plus a histogram beats a bigger pool.",
        "GC pauses are p99 events. Heap sizing is a latency control.",
        "Publish the load-test scenario next to the SLO so they can be compared."
      ]
    }
  ],

  keyTerms: [
    { term: "Percentile (p99)", def: "The latency threshold that 99% of requests beat in a given window." },
    { term: "Little's Law", def: "L = λW. In-flight work equals arrival rate times time in the system." },
    { term: "Utilization", def: "Fraction of time a resource is busy. Near 1, queue waits explode." },
    { term: "Open model", def: "A load test that keeps a target arrival rate even if the system slows." },
    { term: "Closed model", def: "A fixed number of clients that only send when a response returns." },
    { term: "Coordinated omission", def: "Failing to count the time users would have waited, so p99 looks fake-good." },
    { term: "In flight (L)", def: "Requests currently queued or being processed in the service and its pools." },
    { term: "Head-of-line blocking", def: "One slow request holding a shared resource that others need." }
  ],

  tradeoffs: [
    { pro: "Percentiles match user pain better than a mean.", con: "You need histograms and a window; a single p99 without volume is a noisy pager." },
    { pro: "Little's Law sizes pools from measured λ and W.", con: "It is an average-state identity; bursts still need headroom and shedding." },
    { pro: "Open-model tests expose the true tail.", con: "They can overwhelm a shared staging database if you forget to cap." },
    { pro: "Bigger pools raise the L you can hold.", con: "They also raise the load you put on the database when everyone is slow together." }
  ],

  interviewTips: [
    "Refuse to quote an average as the latency story. Give p50 and p99 and the window.",
    "Write L = λW on the board and size the connection pool from it.",
    "Explain coordinated omission in one sentence: the tester waited, the user would not have.",
    "Utilization near 1 fattens the tail. Isolate pools and time out.",
    "In Spring, name Micrometer histograms, Hikari maximumPoolSize, and an open-model tool (Gatling/k6)."
  ],

  scene: {
    nodes: [
      { id: "u1", label: "Users", type: "user", pos: [-11, 0, -3] },
      { id: "u2", label: "More users", type: "user", pos: [-11, 0, 2] },
      { id: "lb", label: "Load balancer", type: "lb", pos: [-6, 0, 0] },
      { id: "app", label: "Spring app", type: "service", pos: [-1, 0, 0] },
      { id: "pool", label: "Hikari pool", type: "cache", pos: [4, 0, -3], showAt: 2 },
      { id: "db", label: "Postgres", type: "db", pos: [9, 0, -3], showAt: 2 },
      { id: "qwait", label: "Wait queue", type: "queue", pos: [4, 0, 2.5], showAt: 3 },
      { id: "hist", label: "p50 / p99", type: "point", pos: [-1, 0, -6], showAt: 1 },
      { id: "k6", label: "k6 open model", type: "worker", pos: [-6, 0, 5.5], showAt: 6 },
      { id: "n0", label: "L = λ × W", type: "note", pos: [4, 0, -7], showAt: 2 },
      { id: "n1", label: "Utilization ~1 fattens p99", type: "note", pos: [4, 0, 6.8], showAt: 4 },
      { id: "n2", label: "Count wait, not just service", type: "note", pos: [-6, 0, 7.6], showAt: 6 }
    ],
    edges: [
      { from: "u1", to: "lb" },
      { from: "u2", to: "lb" },
      { from: "lb", to: "app" },
      { from: "app", to: "pool", showAt: 2 },
      { from: "pool", to: "db", showAt: 2 },
      { from: "app", to: "qwait", showAt: 3 },
      { from: "k6", to: "lb", showAt: 6 }
    ],
    steps: [
      {
        title: "Traffic hits the API",
        text: "Users arrive through the load balancer. The Spring app is healthy. A mean of 20 ms is true and useless until you know the tail.",
        highlight: ["u1", "u2", "lb", "app"],
        flows: [
          { from: "u1", to: "lb", color: "#4ade80", label: "req" },
          { from: "lb", to: "app", color: "#4ade80", label: "HTTP" }
        ]
      },
      {
        title: "Look at the histogram",
        text: "Micrometer shows p50 = 18 ms and p99 = 900 ms. Ten in a thousand requests are almost a second. That is the experience you design for, not the mean.",
        highlight: ["hist", "app", "lb"],
        flows: [{ from: "app", to: "hist", color: "#60a5fa", label: "timer" }]
      },
      {
        title: "Little's Law sizes the pool",
        text: "λ = 200 RPS, W = 250 ms ⇒ L = 50 in flight. A Hikari maximumPoolSize of 10 cannot hold that. Connections are a hard cap on L for DB-bound work.",
        highlight: ["app", "pool", "db", "n0"],
        flows: [
          { from: "app", to: "pool", color: "#c084fc", label: "borrow" },
          { from: "pool", to: "db", color: "#c084fc", label: "SQL" }
        ]
      },
      {
        title: "Saturation makes a wait queue",
        text: "When all connections are busy, new requests wait on the pool. W now includes queue time. L grows. Threads sit blocked. CPU may look idle.",
        highlight: ["qwait", "pool", "app"],
        flows: [{ from: "app", to: "qwait", color: "#fb923c", label: "block" }]
      },
      {
        title: "The tail dies first",
        text: "Utilization near 1. p99 explodes; p50 still looks polite. Head-of-line blocking: one slow report query holds a connection checkout needed. Timeouts and pool isolation are the fix, not 'more logs.'",
        highlight: ["hist", "qwait", "n1", "pool"],
        fail: ["qwait"],
        flows: [{ from: "qwait", to: "pool", color: "#f87171", label: "wait" }]
      },
      {
        title: "Retries make λ worse",
        text: "The client retries the slow p99. Arrival rate jumps. L grows again. A retry budget and backoff are load control, not just correctness.",
        highlight: ["u2", "lb", "app", "qwait"],
        flows: [{ from: "u2", to: "lb", color: "#f87171", label: "retry" }]
      },
      {
        title: "Open-model load test",
        text: "k6 holds 200 RPS even as the app slows. Coordinated omission would have paused the sender and reported a pretty p99. Count the wait. Same histogram as production.",
        highlight: ["k6", "lb", "n2", "hist"],
        flows: [{ from: "k6", to: "lb", color: "#4ade80", label: "200 rps" }]
      },
      {
        title: "Tune W, then size L",
        text: "Fix the slow query, split the report pool, set timeouts. W drops, L drops, p99 follows. Then set Hikari and thread counts from the new law, with headroom for bursts. Adding replicas without cutting W just copies the queue.",
        highlight: ["db", "pool", "app", "hist", "n0"],
        flows: [
          { from: "app", to: "pool", color: "#4ade80", label: "fast W" },
          { from: "pool", to: "db", color: "#4ade80", label: "index" }
        ]
      }
    ]
  }
});
