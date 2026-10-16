window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 18,
  title: "Load Shedding, Retry Budgets, SLOs, and Chaos Engineering",
  video: "",
  category: "Reliability and Security",
  tagline: "Drop work on purpose, retry with a budget, and break prod-like systems on purpose.",
  summary: "A saturated service that accepts every request dies for everyone. Load shedding refuses cheaply so capacity serves someone. Retries without a budget turn one timeout into a thundering herd. SLIs, SLOs, and error budgets decide when you ship versus when you freeze. Chaos engineering is how you learn the shedding and retry story is real: you inject latency and death before customers do. In Spring, Resilience4j bulkheads, time limiters, and retry configs are the code; the policy is the design.",

  theory: [
    {
      heading: "Load shedding is dropping work, not slowing it",
      body: "Rate limiting is a fairness policy (this user may have 100 rps). <b>Load shedding</b> is a survival policy (this process will not take more work than it can finish). When the queue of incoming requests exceeds a depth or the CPU is past a line, return 503 or 429 immediately — no DB, no downstream. Serving a fast no is better than a 30-second maybe that still fails and held a thread. Shed non-critical work first: recommendations before checkout, GETs before POSTs if you must choose. Nginx <code>limit_conn</code>, Envoy overload manager, Spring <code>QueuedThreadPool</code> with an abort policy, and a servlet filter that checks a token bucket all implement this. Adaptive shedding uses p99 latency or heap, not a static QPS you guessed in January.",
      bullets: [
        "A full thread pool with unbounded accept is a latency death spiral.",
        "Shed at the edge so the origin never sees the extra 10×.",
        "Tell the client Retry-After; a naked 503 invites an immediate retry storm."
      ]
    },
    {
      heading: "Retries need a budget",
      body: "One timeout plus three retries from each of 200 pods is 800 extra calls to a sick dependency. That is a <b>retry storm</b>. A <b>retry budget</b> caps extra work: e.g. at most 10% of requests may be retries in a window, or a token bucket of retries per instance. Combine with exponential backoff, jitter (so the herd does not reconverge), and retry-only-idempotent methods. Circuit breakers (Resilience4j <code>CircuitBreaker</code>) stop sending when the error rate is already high — they are a cousin of shedding for downstreams. Timeouts must be tighter than the caller's remaining deadline (deadline propagation). Spring: <code>RetryConfig.custom().maxAttempts(2).intervalFunction(IntervalFunction.ofExponentialBackoff())</code> plus a shared rate limiter for retries, not three nested <code>@Retry</code> annotations that do not know each other.",
      bullets: [
        "Honor Retry-After and 429; retrying them immediately is rude and dumb.",
        "Hedged requests (send a duplicate after 95th percentile) need an even tighter budget.",
        "Idempotency keys make the retries you do allow safe."
      ]
    },
    {
      heading: "SLI, SLO, SLA, error budget",
      body: "An <b>SLI</b> is a measurement: availability as successful requests / total, or latency as the fraction of requests under 300 ms. An <b>SLO</b> is the target: 99.9% of those SLIs over 30 days. An <b>SLA</b> is the legal cousin with credits. The <b>error budget</b> is the SLO's remainder: 99.9% monthly availability is about 43 minutes of unavailability. If the budget is burned, you stop launching features and work on reliability. If it is full, you may take more risk (including chaos). Pick SLIs users feel: checkout success, not CPU. Availability SLOs without latency SLOs bless a service that is \"up\" at 8 seconds per click. Multi-step user journeys need a journey SLI, not three 99.9% microservices that compose to 99.7%.",
      bullets: [
        "Count only traffic you intended to serve; shed 503s may be a separate SLI.",
        "Burn alerts on error-budget burn rate beat paging on every 5xx.",
        "Never set SLO = 100%. You will lie or never ship."
      ]
    },
    {
      heading: "Chaos engineering is a test, not a personality",
      body: "You have a hypothesis: \"if we kill one AZ, RTO is under 10 minutes and we shed rather than cascade.\" Chaos is the experiment: terminate instances, add latency, partition a network, fill a disk, expire a cert. Start in staging, then game days, then automated continuous chaos on a slice of prod with an abort button. Netflix's Chaos Monkey popularized instance death; modern practice is richer (latency, clock skew, poison messages). If the experiment is un-abortable or has no blast-radius cap, it is just an outage. Spring Boot apps should fail under these injections the way you designed: bulkhead isolation, timeouts, fallbacks that are actually tested.",
      bullets: [
        "Hypothesis → inject → observe SLO → fix or accept.",
        "Chaos without observability is vandalism.",
        "Include human process: pages, runbooks, and \"who is allowed to press abort.\""
      ]
    },
    {
      heading: "Wiring it in a Java service",
      body: "Edge: API gateway sheds by concurrency and canary error rate. Service: Resilience4j bulkhead around JDBC and HTTP, time limiter matching the SLO, retry with jitter and a shared budget, circuit breaker on the HTTP client. Timeouts decrease as you go down the stack so the innermost call fails first. Emit SLIs as metrics (Micrometer) that match the SLO query, not a random 5xx counter. Feature flags let you disable a expensive path when the error budget is burning. Chaos: Testcontainers and Toxiproxy in CI for latency; a staging CronJob that SIGKILLs pods.",
      bullets: [
        "Thread pools are bulkheads. One shared Tomcat pool is not isolation.",
        "Fallbacks must be cheaper than the call they replace.",
        "Load tests that never hit shed/retry paths do not validate this lecture."
      ]
    }
  ],

  keyTerms: [
    { term: "Load shedding", def: "Intentionally rejecting work when saturated so remaining capacity stays useful." },
    { term: "Retry budget", def: "A cap on extra retry traffic so recovery of a dependency is possible." },
    { term: "Jitter", def: "Randomization of backoff so clients do not retry in lockstep." },
    { term: "Circuit breaker", def: "Stop calling a failing dependency for a cooldown; fail fast locally." },
    { term: "SLI", def: "Service level indicator: the raw ratio or distribution you measure." },
    { term: "SLO", def: "Service level objective: the target for an SLI over a window." },
    { term: "Error budget", def: "Allowed unreliability (1 − SLO) you may spend on change and incidents." },
    { term: "Chaos engineering", def: "Controlled experiments that inject failure to test hypotheses about resilience." },
    { term: "Bulkhead", def: "Isolated pool of threads/connections so one dependency cannot starve the rest." }
  ],

  tradeoffs: [
    { pro: "Shedding returns a fast 503 and keeps checkout alive.", con: "You must choose whom to disappoint, and clients must not infinite-retry." },
    { pro: "Retries hide transient blips.", con: "Unbounded retries amplify outages into retry storms." },
    { pro: "Tight SLOs make reliability a first-class product.", con: "A 99.99% SLO without budget for deploys freezes the team or gets silently missed." },
    { pro: "Chaos finds the failover you never rehearsed.", con: "Poorly scoped chaos is an unplanned incident with extra PR." },
    { pro: "Circuit breakers protect thread pools.", con: "A breaker stuck open is a self-inflicted outage; tune windows with SLOs." }
  ],

  interviewTips: [
    "Distinguish rate limiting (per user) from shedding (per server health) explicitly.",
    "When you add retries, add a budget, jitter, and idempotency in the same sentence.",
    "Define one SLI users feel, set an SLO below 100%, and mention the error budget as a ship/no-ship knob.",
    "Describe a chaos experiment as hypothesis + blast radius + abort, not \"we kill prod.\"",
    "Name Resilience4j (or equivalent) bulkhead, retry, and time limiter as the Spring mapping."
  ],

  scene: {
    nodes: [
      { id: "users", label: "Clients", type: "user", pos: [-11, 0, -2] },
      { id: "edge", label: "Gateway", type: "gateway", pos: [-5, 0, -2] },
      { id: "svc", label: "Checkout", type: "service", pos: [2, 0, -2] },
      { id: "rec", label: "Reco (shed first)", type: "service", pos: [2, 0, 3], showAt: 1 },
      { id: "pay", label: "Payments", type: "server", pos: [9, 0, -2] },
      { id: "nShed", label: "503 Retry-After, no DB", type: "note", pos: [-5, 0, -6], showAt: 1 },
      { id: "nStorm", label: "3 retries × N pods = herd", type: "note", pos: [9, 0, 3], showAt: 2 },
      { id: "slo", label: "SLO 99.9% / 30d", type: "note", pos: [2, 0, -6], showAt: 4 },
      { id: "bud", label: "error budget 43 min", type: "point", pos: [-5, 0, 3], showAt: 4 },
      { id: "chaos", label: "Chaos: kill AZ", type: "worker", pos: [9, 0, 6], showAt: 6 },
      { id: "nJit", label: "backoff + jitter + budget", type: "note", pos: [9, 0, -6], showAt: 3 }
    ],
    edges: [
      { from: "users", to: "edge" },
      { from: "edge", to: "svc" },
      { from: "edge", to: "rec", showAt: 1 },
      { from: "svc", to: "pay" },
      { from: "chaos", to: "pay", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Healthy path",
        text: "Clients hit the gateway, checkout talks to payments, everyone is inside the latency SLO. This is the picture people draw and then skip the failure half.",
        highlight: ["users", "edge", "svc", "pay"],
        flows: [
          { from: "users", to: "edge", color: "#4ade80" },
          { from: "edge", to: "svc", color: "#4ade80" },
          { from: "svc", to: "pay", color: "#4ade80" }
        ]
      },
      {
        title: "Shed the cheap work",
        text: "Saturation. The gateway returns 503 with Retry-After for recommendations and extra GETs. Checkout still gets threads. A fast no beats a slow failure that held the pool.",
        highlight: ["edge", "rec", "nShed", "svc"],
        fail: ["rec"],
        flows: [
          { from: "edge", to: "rec", color: "#f87171", label: "503" },
          { from: "edge", to: "svc", color: "#4ade80", label: "admit" }
        ]
      },
      {
        title: "Retries become a storm",
        text: "Payments is slow. Every client retries three times. The herd is now four times the original load. The dependency cannot recover.",
        highlight: ["pay", "nStorm", "svc"],
        fail: ["pay"],
        flows: [
          { from: "svc", to: "pay", color: "#f87171", label: "retry" },
          { from: "svc", to: "pay", color: "#f87171" }
        ]
      },
      {
        title: "Budget, backoff, jitter",
        text: "A retry budget allows only a slice of extra calls. Exponential backoff plus jitter breaks lockstep. Idempotent POST with a key makes the retries you still send safe.",
        highlight: ["nJit", "svc", "pay"],
        flows: [{ from: "svc", to: "pay", color: "#fb923c", label: "1 extra" }]
      },
      {
        title: "SLOs and the error budget",
        text: "SLI: checkout success under 300 ms. SLO: 99.9% over 30 days. That leaves ~43 minutes of budget. Burn it on incidents and you freeze deploys. Do not SLO at 100%.",
        highlight: ["slo", "bud", "svc"],
        flows: [{ from: "users", to: "edge", color: "#60a5fa", label: "measured" }]
      },
      {
        title: "Circuit opens",
        text: "Error rate on payments trips the breaker. Checkout fails fast or uses a fallback. Thread pools drain. This is shedding aimed at a dependency.",
        highlight: ["svc", "pay"],
        fail: ["pay"],
        flows: [{ from: "svc", to: "pay", color: "#f87171", label: "open" }]
      },
      {
        title: "Chaos tests the hypothesis",
        text: "Game day: kill the payments AZ. Watch whether shedding, budgets, and failover hold the SLO. Abort if blast radius grows. Hypothesis first, then inject.",
        highlight: ["chaos", "pay", "edge", "slo"],
        fail: ["pay"],
        flows: [
          { from: "chaos", to: "pay", color: "#f87171", label: "kill" },
          { from: "edge", to: "rec", color: "#f87171", label: "shed" }
        ]
      },
      {
        title: "Policy in code",
        text: "Bulkheads, time limiters, retry budgets, and gateway overload maps are how a Spring stack implements this lecture. Chaos is how you prove it. The SLO is how you decide it was enough.",
        highlight: ["edge", "svc", "slo", "nJit"],
        flows: [
          { from: "users", to: "edge", color: "#4ade80" },
          { from: "edge", to: "svc", color: "#4ade80" },
          { from: "svc", to: "pay", color: "#60a5fa", label: "budgeted" }
        ]
      }
    ]
  }
});
