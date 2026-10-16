window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 26,
  title: "Logs, Metrics, Traces, and Incident Response",
  video: "",
  category: "Operations",
  tagline: "Metrics ask if you are sick. Logs say what happened. Traces say where. Incidents are a rehearsed path, not a group chat.",
  summary: "The three pillars answer different questions. Metrics are cheap aggregations you alert on. Logs are request- and error-level text you search after. Traces stitch one request across Spring services with a trace id. Incident response is detect, mitigate, communicate, diagnose, then a blameless postmortem. Spring gives you Micrometer, a logging MDC, and OpenTelemetry; they are useless without SLOs, cardinality discipline, and a page that wakes a human for user pain, not for a single 404.",

  theory: [
    {
      heading: "Metrics are for machines. Logs are for people.",
      body: "A <b>metric</b> is a number over time: request rate, error rate, p99 latency, heap, Hikari active connections. You can alert on it because it is cheap to store and to query. A <b>log</b> is a structured line about one event: user id, exception, SQL that failed. You cannot alert on \"grep this stack\" at 50k RPS; you will pay for ingest and still miss the page. Spring: Micrometer timers and counters on the use case; Logback JSON with an MDC <code>requestId</code>. Never log payloads that contain tokens or PII. DEBUG in production is a self-inflicted denial of service on your logging bill.",
      bullets: [
        "RED: rate, errors, duration. USE: utilization, saturation, errors for pools and disks.",
        "High-cardinality labels (user id on a metric) explode time series. Put user id in the log.",
        "Log at info for state changes, warn for recovered errors, error for user-visible failures."
      ]
    },
    {
      heading: "Traces connect the hop soup",
      body: "A checkout request may hit the API, inventory, payments, and a database. A <b>trace</b> is a tree of spans with one <b>trace id</b>. OpenTelemetry or Micrometer Tracing (the Sleuth successor) injects that id into HTTP headers (<code>traceparent</code>) and into the MDC so logs join the picture. A span records the service, operation, and timing. When p99 is bad, you open the slow traces, not a random pod log. Sampling: keep 1% of success traces and 100% of errors, or you will either go broke or go blind. The gateway should mint the id if the client did not send one.",
      bullets: [
        "Same trace id in logs, metrics exemplars, and the waterfall.",
        "A missing span is usually an uninstrumented WebClient or a RestTemplate you forgot.",
        "Database spans without SQL text still tell you which repository method burned 200 ms."
      ]
    },
    {
      heading: "SLOs turn graphs into pages",
      body: "An SLO is a promise: 99.9% of checkouts succeed in 300 ms over 30 days. An error budget is the remainder. Alert on budget burn (too many failures too fast), not on \"CPU &gt; 80%\" unless you already know that CPU is the user-visible cause. Spring Boot Actuator health is a probe, not an SLO. A dependency being Down should make you degrade, not necessarily wake someone at 3 a.m. if users still check out. Pages that fire all night train people to ignore them. That is how real outages go unacked.",
      bullets: [
        "Symptom-based alerts: user pain. Cause-based alerts: after you are already mitigating.",
        "Record a runbook URL on the alert. The 3 a.m. version of you cannot remember the dashboard.",
        "Synthetic checks (a canary user) catch \"the metric is green but checkout is 500.\""
      ]
    },
    {
      heading: "The incident path",
      body: "Detect (alert, tweet, synthetic). Acknowledge so two people do not both \"fix\" it. Mitigate first: rollback the digest, shed load, failover, feature-flag off. Restore user pain before you find the root cause. Communicate on a single channel with timestamps. Diagnose with the three pillars: did error rate jump at a deploy? which span? which exception? Fix, then watch. A <b>postmortem</b> is blameless: what in the system allowed this, what we will change, who owns the follow-up. \"Operator error\" is not a root cause. The missing canary is.",
      bullets: [
        "Severity is user impact, not how interesting the bug is.",
        "Rollback beats hero debug while money is falling.",
        "Write the timeline from dashboards, not from memory the next afternoon."
      ]
    },
    {
      heading: "Spring and production hygiene",
      body: "Micrometer + Prometheus + Grafana is the default metrics path; OTLP to a vendor is the same idea. <code>Timed</code> on a repository is better than a handwritten System.nanoTime. Correlation: <code>MDC.put(\"traceId\", ...)</code> in a filter, clear in a finally. Do not log every Hibernate SQL in prod. Do not expose <code>/actuator</code> to the internet. Cardinality: a timer named <code>http.server.requests</code> with uri templates, not raw ids in the path. During an incident, a histogram of that timer plus one slow trace beats 40 new log lines you added in a panic deploy.",
      bullets: [
        "Exemplars link a metric spike to a trace id.",
        "Health groups: liveness vs readiness vs \"payments vendor.\"",
        "A dashboard per SLO, not a wall of every JVM gauge."
      ]
    }
  ],

  keyTerms: [
    { term: "Metric", def: "A cheap numeric time series (rate, error, latency, saturation) used for alerts." },
    { term: "Log", def: "A structured event about one request or failure, searched after you know when to look." },
    { term: "Trace / span", def: "A sampled tree of timed operations across services for one request." },
    { term: "Trace id", def: "The correlation key copied into headers, MDC, and spans." },
    { term: "SLO / error budget", def: "A user-facing reliability target and the allowed failure remaining." },
    { term: "Mitigation", def: "The action that stops user pain (rollback, failover, flag) before root cause." },
    { term: "Postmortem", def: "A blameless write-up of timeline, impact, causes, and owned follow-ups." },
    { term: "Cardinality", def: "How many unique label combinations a metric creates. User id is usually too many." }
  ],

  tradeoffs: [
    { pro: "Metrics make cheap, reliable pages on user symptoms.", con: "They cannot tell you which order id failed; you still need logs and traces." },
    { pro: "100% traces are a debugger's dream.", con: "They are an ingest nightmare. Sample successes; keep errors." },
    { pro: "Verbose logs shorten a mystery.", con: "PII, secrets, and cost grow until nobody can afford to keep them." },
    { pro: "Paging on SLO burn respects sleep.", con: "You will miss internal degradation until the budget actually burns — pair with synthetics." }
  ],

  interviewTips: [
    "Name the three pillars with different jobs: alert, explain, stitch hops.",
    "Put a trace id on every box in the drawing. Mention MDC and traceparent.",
    "Alert on user-facing SLOs, not on CPU, unless you can say why CPU is the symptom.",
    "Incident order: mitigate (rollback) then diagnose. Postmortem is blameless with owners.",
    "In Spring, say Micrometer, uri templates for cardinality, and actuator not on the public internet."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Checkout", type: "phone", pos: [-11, 0, 0] },
      { id: "gw", label: "Gateway", type: "gateway", pos: [-6.5, 0, 0] },
      { id: "ord", label: "Orders", type: "service", pos: [-1.5, 0, -3] },
      { id: "pay", label: "Payments", type: "service", pos: [-1.5, 0, 3] },
      { id: "db", label: "DB", type: "db", pos: [3.5, 0, -3], showAt: 1 },
      { id: "logs", label: "Log store", type: "storage", pos: [8.5, 0, -4], showAt: 2 },
      { id: "prom", label: "Metrics", type: "cache", pos: [8.5, 0, 0], showAt: 3 },
      { id: "tr", label: "Trace backend", type: "queue", pos: [8.5, 0, 4], showAt: 4 },
      { id: "page", label: "On-call", type: "user", pos: [3.5, 0, 5.5], showAt: 5 },
      { id: "n0", label: "Mint trace id at the edge", type: "note", pos: [-6.5, 0, -6.5] },
      { id: "n1", label: "Alert on SLO burn, not CPU", type: "note", pos: [8.5, 0, -7], showAt: 5 },
      { id: "n2", label: "Rollback before root cause", type: "note", pos: [3.5, 0, 7.5], showAt: 6 }
    ],
    edges: [
      { from: "user", to: "gw" },
      { from: "gw", to: "ord" },
      { from: "gw", to: "pay" },
      { from: "ord", to: "db", showAt: 1 },
      { from: "ord", to: "logs", showAt: 2, dashed: true },
      { from: "pay", to: "prom", showAt: 3, dashed: true },
      { from: "gw", to: "tr", showAt: 4, dashed: true },
      { from: "prom", to: "page", showAt: 5 }
    ],
    steps: [
      {
        title: "One request, one trace id",
        text: "The gateway mints a trace id and puts it on traceparent and in the MDC. Every hop must forward it. Without this, you have three log piles and no story.",
        highlight: ["user", "gw", "ord", "pay", "n0"],
        flows: [
          { from: "user", to: "gw", color: "#4ade80", label: "POST" },
          { from: "gw", to: "ord", color: "#4ade80", label: "trace" },
          { from: "gw", to: "pay", color: "#4ade80", label: "trace" }
        ]
      },
      {
        title: "Work still hits data stores",
        text: "Orders writes the row. Payments talks to the bank. If you only have logs on the API pod, you will not see a 200 ms repository span. Instrument the client.",
        highlight: ["ord", "db", "pay"],
        flows: [{ from: "ord", to: "db", color: "#c084fc", label: "insert" }]
      },
      {
        title: "Logs explain a single failure",
        text: "Payments throws. A JSON log line with trace id, order id, and the exception lands in the log store. You search after you know the minute. You do not alert on this line at 50k RPS.",
        highlight: ["pay", "logs", "ord"],
        fail: ["pay"],
        flows: [{ from: "pay", to: "logs", color: "#f87171", label: "error line" }]
      },
      {
        title: "Metrics are what you page on",
        text: "Micrometer increments checkout.errors and records duration. Prometheus stores cheap time series. Cardinality stays on uri templates, not raw user ids.",
        highlight: ["prom", "pay", "gw"],
        flows: [{ from: "pay", to: "prom", color: "#fb923c", label: "error rate" }]
      },
      {
        title: "A trace is the waterfall",
        text: "The sampled trace shows gateway 8 ms, orders 20 ms, payments 1.8 s on the bank span. That is why p99 moved. Logs without this picture look like \"the API is slow.\"",
        highlight: ["tr", "gw", "ord", "pay"],
        flows: [
          { from: "gw", to: "tr", color: "#60a5fa", label: "spans" },
          { from: "pay", to: "tr", color: "#60a5fa", label: "slow span" }
        ]
      },
      {
        title: "Page on SLO burn",
        text: "Error budget is burning: checkout success dropped. The page goes to on-call with a runbook, not a CPU graph. Health of a vendor is a cause you will look at after mitigation starts.",
        highlight: ["page", "prom", "n1"],
        flows: [{ from: "prom", to: "page", color: "#f87171", label: "page" }]
      },
      {
        title: "Mitigate first",
        text: "A canary digest went out. Rollback the Deployment to the previous image. User pain stops. Finding the NPE can wait fifteen minutes. Hero debugging during a burn is how you make a second incident.",
        highlight: ["page", "pay", "n2", "gw"],
        flows: [{ from: "page", to: "pay", color: "#4ade80", label: "rollback" }]
      },
      {
        title: "Postmortem with owners",
        text: "Timeline from metrics and traces: deploy at 18:02, p99 at 18:04, rollback at 18:11. Cause: missing canary abort on error rate. Follow-up: auto-abort and a contract test. Nobody is blamed by name.",
        highlight: ["logs", "prom", "tr", "page"],
        flows: [
          { from: "tr", to: "page", color: "#c084fc", label: "timeline" },
          { from: "logs", to: "page", color: "#c084fc", label: "exception" }
        ]
      }
    ]
  }
});
