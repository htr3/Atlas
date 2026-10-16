window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 32,
  title: "Circuit Breaker, Bulkhead, Retry, and DLQ",
  category: "Service Patterns",
  tagline: "Stop calling a sick dependency, keep its failure in one pool, retry only what is safe, and quarantine poison messages.",
  summary: "Four controls keep one bad dependency from taking the process down. A timeout bounds the wait. A retry with backoff repeats a call that might succeed, and only if it is idempotent. A circuit breaker opens after repeated failures and fails fast until a trial call succeeds. A bulkhead gives that dependency its own threads or connections. A dead-letter queue holds messages that will never succeed so the main queue can move.",

  theory: [
    {
      heading: "Timeout, then decide to retry",
      body: "Every remote call has a deadline. Without one, threads sit in a slow payments service until the whole process is out of workers. When the call fails with a timeout or a 503, a <b>retry</b> may help. It will not help a 400 or a declined card. Retry a small number of times, with exponential backoff and jitter so all callers do not hit the recovering service in the same millisecond. Retry a write only when the handler is idempotent. A retry budget matters more than a heroic loop: after the budget, fail the user or enqueue the work.",
      bullets: [
        "Timeout first. An unbounded retry is an unbounded wait.",
        "Backoff plus jitter. No synchronized stampedes.",
        "Do not retry errors the server has already classified as permanent."
      ]
    },
    {
      heading: "The circuit breaker fails fast",
      body: "If payments has failed the last fifty calls, the fifty-first should not wait for the timeout. A <b>circuit breaker</b> counts recent failures. Closed means calls go through. Open means calls fail immediately and the user, or a fallback, gets an answer. After a cool-down, the breaker is half-open: one trial call is allowed. Success closes the circuit. Failure opens it again. The breaker is per dependency. One open circuit must not block calls to search.",
      bullets: [
        "Closed, open, half-open. Name the states.",
        "Fallbacks are product decisions: show cached data, or a clear error. Do not invent a successful payment.",
        "A breaker that never half-opens hides the recovery."
      ]
    },
    {
      heading: "Bulkheads stop the leak spreading",
      body: "A <b>bulkhead</b> is a partition. Payments gets twenty connections and its own thread pool. Search gets a different pool. When payments hangs, it occupies its twenty, and search still has workers. The same idea is a separate queue per channel, which the notification lesson used. Shared \"one pool for every HTTP client\" is how a single vendor outage becomes a site outage. Isolation wastes some capacity on a quiet day. That waste is the point.",
      bullets: [
        "Separate pools, connection limits, or queues per dependency.",
        "When the pool is full, fail or queue locally. Do not borrow from the neighbor.",
        "Ship a metric for pool saturation. It pages before the process is dead."
      ]
    },
    {
      heading: "Dead letters are for poison, not for slowness",
      body: "A queue worker retries a message that failed because the database blinked. A message that fails because the payload is nonsense will fail forever and block the partition if you never set it aside. After N attempts, publish it to a <b>dead-letter queue</b> with the error, and move on. Operators inspect, fix the bug or the data, and replay. A DLQ is not a place to forget. Alert when it grows. Do not automatically retry a poison message in a tight loop; that is how you built an outage out of one bad record."
    }
  ],

  keyTerms: [
    { term: "Timeout", def: "A deadline on a call. When it fires, the caller stops waiting and frees the worker." },
    { term: "Retry with jitter", def: "A limited repeat of a failed call, with growing delays randomized so clients do not synchronize." },
    { term: "Circuit breaker", def: "A switch that opens after repeated failures and fails fast until a trial call succeeds." },
    { term: "Bulkhead", def: "A reserved pool of threads, connections, or queue capacity for one dependency." },
    { term: "Dead-letter queue", def: "A side queue for messages that exhausted retries, so the main consumer can continue." }
  ],

  tradeoffs: [
    { pro: "An open circuit protects both you and the sick dependency.", con: "A noisy breaker opens on a blip and serves errors while the dependency is fine." },
    { pro: "Bulkheads contain a hang to one pool.", con: "Idle reserved capacity cannot help a different pool that is actually busy." },
    { pro: "Retries hide short network faults.", con: "Retries on a non-idempotent write duplicate the side effect, and retries on a down service deepen the outage." },
    { pro: "A DLQ keeps one bad message from stalling a partition.", con: "Without an owner and a replay path, the DLQ is a silent data loss bin." }
  ],

  interviewTips: [
    "Order them: timeout, limited retry with jitter, breaker, bulkhead. Then the queue version: retry, then DLQ.",
    "Say you retry idempotent calls and temporary errors only.",
    "Name closed, open, and half-open. Mention a fallback that is honest.",
    "A bulkhead is a separate pool. Shared thread pools do not count.",
    "A DLQ needs an alert and a replay story. Moving a message there is not handling it."
  ],

  scene: {
    nodes: [
      { id: "api", label: "API", type: "service", pos: [-8, 0, 0] },
      { id: "payPool", label: "Pay pool", type: "worker", pos: [-3, 0, -2.6] },
      { id: "searchPool", label: "Search pool", type: "worker", pos: [-3, 0, 2.8] },
      { id: "pay", label: "Payments", type: "server", pos: [2, 0, -2.6] },
      { id: "search", label: "Search", type: "storage", pos: [2, 0, 2.8] },
      { id: "q", label: "Main queue", type: "queue", pos: [6.5, 0, -2.6], showAt: 4 },
      { id: "dlq", label: "DLQ", type: "storage", pos: [6.5, 0, 2.4], showAt: 4 },
      { id: "n0", label: "Open: fail fast", type: "note", pos: [2, 0, -7], showAt: 2 }
    ],
    edges: [
      { from: "api", to: "payPool" },
      { from: "api", to: "searchPool" },
      { from: "payPool", to: "pay" },
      { from: "searchPool", to: "search" },
      { from: "q", to: "dlq", label: "poison", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Two pools, one process",
        text: "Calls to payments use the pay pool. Calls to search use another. This is the bulkhead. A stuck payment call cannot borrow a search thread.",
        highlight: ["api", "payPool", "searchPool"],
        flows: [
          { from: "api", to: "payPool", color: "#60a5fa", label: "pay" },
          { from: "api", to: "searchPool", color: "#4ade80", label: "search" }
        ]
      },
      {
        title: "Timeout and a short retry",
        text: "The payment call has a deadline. A 503 is retried with backoff and jitter. A validation error is not retried. The charge itself is only retried because it carries an idempotency key.",
        highlight: ["payPool", "pay"],
        flows: [{ from: "payPool", to: "pay", color: "#facc15", label: "retry" }]
      },
      {
        title: "The breaker opens",
        text: "Failures cross the threshold. The circuit opens. New payment calls fail immediately instead of waiting out the timeout. Search is unaffected.",
        highlight: ["pay", "payPool", "searchPool", "n0"],
        fail: ["pay"],
        flows: [{ from: "payPool", to: "pay", color: "#f87171", label: "open" }]
      },
      {
        title: "Half-open is one trial",
        text: "After a cool-down, a single call is allowed through. If payments answers, the breaker closes. If it fails, the breaker stays open. Search traffic never stopped.",
        highlight: ["payPool", "pay", "search"],
        flows: [
          { from: "payPool", to: "pay", color: "#4ade80", label: "trial" },
          { from: "searchPool", to: "search", color: "#4ade80", label: "ok" }
        ]
      },
      {
        title: "Poison leaves the main queue",
        text: "A message that failed N times is published to the dead-letter queue with the error. The main consumer continues. Someone alerts on the DLQ and replays after the bug is fixed.",
        highlight: ["q", "dlq", "payPool"],
        flows: [{ from: "q", to: "dlq", color: "#fb923c", label: "after N" }]
      }
    ]
  }
});
