window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 33,
  title: "SOLID, Design Patterns, and Java Concurrency",
  video: "",
  category: "Design Principles",
  tagline: "Split responsibilities, swap algorithms, then prove the threads cannot corrupt the ledger.",
  summary: "System design interviews still collapse into Java when you name a service. SOLID tells you why PaymentService must not also render PDFs. A handful of patterns — Strategy, Factory, Observer, Decorator, Template Method — are how you keep that split under changing requirements. Concurrency is the tax: happens-before, locks versus ConcurrentHashMap, thread pools with bounded queues, and the deadlock you get when you lock account A then B in two orders. This lesson connects those three layers so a Spring service is both extensible and safe under load.",

  theory: [
    {
      heading: "SOLID as service boundaries, not a poster",
      body: "<b>SRP</b>: a class has one reason to change. <code>OrderService</code> places orders; it does not know GST PDF layout. <b>OCP</b>: add UPI by shipping a new <code>PaymentGateway</code> implementation, not by editing a switch. <b>LSP</b>: a <code>RetryingGateway</code> must still honor the same timeout contract as <code>PaymentGateway</code> — if it swallows declines, callers break. <b>ISP</b>: do not force every worker to implement <code>adminRebuildIndex()</code>. <b>DIP</b>: the service depends on <code>PaymentGateway</code>, Spring injects <code>RazorpayGateway</code>. In HLD language: this is why you drew a payments box instead of stuffing Razorpay calls into the order controller.",
      bullets: [
        "If two features always ship on different tickets, they are two classes (or two services).",
        "Closed for modification means you merge a new class, not a new if-else in a 800-line service.",
        "DIP is the constructor: <code>public CheckoutService(PaymentGateway gw, Ledger ledger)</code>."
      ]
    },
    {
      heading: "Patterns that actually appear in Spring",
      body: "<b>Strategy</b>: <code>FeePolicy</code> with <code>FlatFee</code> and <code>PercentFee</code> — the cache LLD used the same split for LRU vs LFU. <b>Factory</b> (or Spring <code>@Bean</code> + profile): pick the gateway from config, not from a static singleton. <b>Observer / events</b>: after commit, publish <code>OrderPlaced</code> and let email, search index, and analytics subscribe — same shape as a message queue at system scale. <b>Decorator</b>: <code>MetricsGateway</code> wraps <code>RazorpayGateway</code> with timers without the core class knowing Micrometer. <b>Template method</code>: <code>JdbcTemplate</code> already is one. Skip Singleton for shared mutable state; in Spring a singleton bean plus a HashMap is a race. Skip God-object Facade that just re-exports twenty services.",
      bullets: [
        "Name the pattern only after you felt the need. Interviewers smell a catalog dump.",
        "Observer in-process is not Kafka. Say when you promote it to a queue (another app, retry, fan-out).",
        "Builder is fine for a 12-field command object. It is not an architecture."
      ]
    },
    {
      heading: "Happens-before is the real memory model",
      body: "Two threads and a plain <code>boolean ready</code> will surprise you: a writer can set <code>ready = true</code> after filling a buffer, and a reader can see <code>ready</code> without seeing the buffer. The Java memory model requires a <b>happens-before</b> edge: unlock/lock on the same monitor, volatile write/read, concurrent collection operations, thread start/join. <code>synchronized</code> and <code>volatile</code> are not performance flavors; they are publication. <code>AtomicInteger</code> is a CAS loop for counters, not a substitute for locking two fields that must change together. In a wallet: incrementing a cached balance without a lock or a single atomic structure is the lost-update from the ledger lesson.",
      bullets: [
        "volatile is visibility of one field, not atomicity of check-then-act.",
        "The first rule: if two threads touch it, either it is immutable, concurrent, or you lock.",
        "Double-checked locking without volatile on the instance is still a bug. Prefer an enum singleton or Spring."
      ]
    },
    {
      heading: "Locks, concurrent collections, and the deadlock",
      body: "<code>synchronized(this)</code> is coarse. <code>ReentrantLock</code> lets you <code>tryLock(timeout)</code> so a slow peer cannot sit forever. Lock account ids in sorted order: if transfer(A,B) locks A then B and transfer(B,A) locks B then A, you deadlock. <code>ConcurrentHashMap</code> is the default shared map; a synchronized HashMap serializes every get. It still does not make <code>if (!map.contains) map.put</code> atomic — use <code>putIfAbsent</code> or <code>compute</code>. <code>LongAdder</code> beats <code>AtomicLong</code> for hot counters. Thread confinement (every request on its own stack, no shared mutable) is still the best design. Spring MVC: one request, one thread, unless you hop to <code>@Async</code> or WebFlux.",
      bullets: [
        "Deadlock interview: draw two locks, two orders, then sort the ids.",
        "Never lock, then call a remote HTTP API. You hold a monitor across the ocean.",
        "Fair locks reduce starvation and add latency. Default unfair ReentrantLock is usually right."
      ]
    },
    {
      heading: "Executors, backpressure, and isolation",
      body: "<code>Executors.newFixedThreadPool(n)</code> with an unbounded queue is a memory leak under a spike. Use a bounded queue and a <code>CallerRunsPolicy</code> or reject so the producer slows down — that is bulkhead/backpressure in Java. Size the pool from blocking time: if a task waits 100 ms on JDBC and you want 200 QPS, you need on the order of 20 threads, not 200. Separate pools for outbound HTTP vs CPU (embedding, JSON). Pin a <code>ThreadLocal</code> request id for logs; clear it, or you leak PII across pooled threads. Virtual threads (Java 21) change the \"do not block\" story for I/O, they do not remove the need for timeouts, circuit breakers, or sorted locks.",
      bullets: [
        "Show a ThreadPoolExecutor(core, max, 10s, ArrayBlockingQueue(500), namedFactory, policy).",
        "ForkJoinPool is for CPU split/join, not for JDBC.",
        "Isolation: payments pool starving does not take down search indexing if they do not share threads."
      ]
    },
    {
      heading: "How this maps to the HLD board",
      body: "When you later design checkout or booking, the same ideas scale up. SRP becomes a service boundary. Strategy becomes \"we can swap Stripe for UPI.\" Observer becomes the outbox and a queue. A thread pool becomes a worker fleet with a bounded queue. A sorted lock becomes \"serialize posts per accountId.\" Mentioning <code>ConcurrentHashMap</code> in a 50-million-QPS design is the wrong layer — but the interviewer may still ask you to sketch the in-process cache inside one JVM. Know which layer you are in, and do not mix them in one sentence without saying so.",
      bullets: [
        "Junior: class diagram + LRU DLL. Mid: Spring beans + executor + idempotency.",
        "Senior: which of these must leave the process (queue, DB unique constraint) because two JVMs exist.",
        "A unique constraint in Postgres is a lock that survives a crash. A ReentrantLock is not."
      ]
    }
  ],

  keyTerms: [
    { term: "SRP", def: "A class or service has one reason to change; orders do not render tax PDFs." },
    { term: "Open/closed", def: "Extend by new implementations (a new FeePolicy), not by editing a switch." },
    { term: "Strategy", def: "Swap an algorithm behind an interface: fee, eviction, payment rail." },
    { term: "Happens-before", def: "JMM edge that makes one thread's writes visible to another (unlock, volatile, concurrent ops)." },
    { term: "CAS", def: "Compare-and-set loop used by Atomic* and ConcurrentHashMap; atomic for one variable." },
    { term: "ReentrantLock", def: "Explicit lock with tryLock and interruptible wait; still deadlock-prone if order is random." },
    { term: "Bounded executor", def: "Thread pool plus a finite queue and a rejection policy so load sheds instead of OOMing." },
    { term: "Bulkhead", def: "Separate pools so a stuck payment HTTP client cannot eat every servlet thread." }
  ],

  tradeoffs: [
    { pro: "Interfaces + Strategy let you add UPI without touching checkout.", con: "A forest of one-line interfaces slows readers if you split too early." },
    { pro: "synchronized is simple and correct for one monitor.", con: "It cannot time out, and locking this exposes the lock to callers." },
    { pro: "ConcurrentHashMap gives concurrent gets without a global lock.", con: "Compound actions still need compute/putIfAbsent or an external lock." },
    { pro: "A bounded pool with CallerRunsPolicy applies backpressure.", con: "The servlet thread now does the work; p99 climbs instead of a queue growing in RAM." },
    { pro: "Virtual threads make blocking JDBC cheaper to scale.", con: "You can now deadlock or stampede a DB with 50k parked tasks unless you cap them." }
  ],

  interviewTips: [
    "Map SOLID to boxes: new payment rail = new class, not a new if in OrderService.",
    "Name Strategy/Factory/Observer only with the concrete need (fees, gateway pick, after-commit events).",
    "Define happens-before in one sentence, then say volatile is not check-then-act.",
    "Draw deadlock as two locks acquired in opposite order; fix by sorting account ids.",
    "Always size a ThreadPoolExecutor with a bounded queue and a rejection policy.",
    "Say what must leave the JVM: unique constraints and queues survive a crash; ReentrantLock does not."
  ],

  scene: {
    nodes: [
      { id: "client", label: "Checkout UI", type: "phone", pos: [-11, 0, 0] },
      { id: "gw", label: "API gateway", type: "gateway", pos: [-7, 0, 0] },
      { id: "order", label: "OrderService", type: "service", pos: [-3, 0, 0] },
      { id: "pay", label: "PaymentGateway", type: "service", pos: [1.5, 0, -3], showAt: 1 },
      { id: "upi", label: "UPI impl", type: "worker", pos: [5.5, 0, -4.5], showAt: 1 },
      { id: "card", label: "Card impl", type: "worker", pos: [5.5, 0, -1.5], showAt: 1 },
      { id: "fee", label: "FeePolicy", type: "service", pos: [1.5, 0, 3], showAt: 2 },
      { id: "pool", label: "Pay executor", type: "queue", pos: [-3, 0, 3.5], showAt: 4 },
      { id: "http", label: "HTTP client", type: "server", pos: [1.5, 0, 5.5], showAt: 4 },
      { id: "map", label: "Idempotency map", type: "cache", pos: [-3, 0, -3.5], showAt: 3 },
      { id: "a", label: "Lock A", type: "point", pos: [9, 0, -2], showAt: 5 },
      { id: "b", label: "Lock B", type: "point", pos: [9, 0, 2], showAt: 5 },
      { id: "t1", label: "Thread 1", type: "worker", pos: [6.5, 0, -2], showAt: 5 },
      { id: "t2", label: "Thread 2", type: "worker", pos: [6.5, 0, 2], showAt: 5 },
      { id: "search", label: "Index pool", type: "queue", pos: [-7, 0, 3.5], showAt: 7 },
      { id: "n0", label: "SRP: orders ≠ PDFs", type: "note", pos: [-7, 0, -6.8] },
      { id: "n1", label: "Lock A,B sorted", type: "note", pos: [9, 0, 6.5], showAt: 6 },
      { id: "n2", label: "Bounded queue + reject", type: "note", pos: [-3, 0, 7.2], showAt: 4 }
    ],
    edges: [
      { from: "client", to: "gw" },
      { from: "gw", to: "order" },
      { from: "order", to: "pay", showAt: 1 },
      { from: "pay", to: "upi", showAt: 1, dashed: true },
      { from: "pay", to: "card", showAt: 1, dashed: true },
      { from: "order", to: "fee", showAt: 2 },
      { from: "order", to: "map", showAt: 3 },
      { from: "order", to: "pool", showAt: 4 },
      { from: "pool", to: "http", showAt: 4 },
      { from: "t1", to: "a", showAt: 5 },
      { from: "t1", to: "b", showAt: 5 },
      { from: "t2", to: "b", showAt: 5 },
      { from: "t2", to: "a", showAt: 5 },
      { from: "gw", to: "search", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "SRP: OrderService does not render PDFs",
        text: "The checkout request hits a gateway then OrderService. Single responsibility: this class places orders. GST invoices, search indexing, and fee math will be other types. DIP: it will depend on interfaces Spring injects.",
        highlight: ["client", "gw", "order", "n0"],
        hide: ["pay", "upi", "card", "fee", "pool", "http", "map", "a", "b", "t1", "t2", "search", "n1", "n2"],
        flows: [{ from: "client", to: "gw", color: "#4ade80", label: "POST" }]
      },
      {
        title: "OCP + Strategy: swap the rail",
        text: "PaymentGateway is an interface. UPI and Card are implementations. Adding a third rail is a new class, not a new branch in OrderService. That is open/closed at the code level and a swappable box on the HLD board.",
        highlight: ["order", "pay", "upi", "card"],
        hide: ["fee", "pool", "http", "map", "a", "b", "t1", "t2", "search", "n1", "n2"],
        flows: [
          { from: "order", to: "pay", color: "#818cf8", label: "interface" },
          { from: "pay", to: "upi", color: "#4ade80", label: "UPI" }
        ]
      },
      {
        title: "FeePolicy is another Strategy",
        text: "Flat vs percent fees are FeePolicy implementations — same split as LRU vs LFU in the cache LLD. Decorator can wrap the gateway with metrics without the impl knowing Micrometer. Factory (or @Bean) picks the pair from config.",
        highlight: ["order", "fee", "pay"],
        hide: ["pool", "http", "map", "a", "b", "t1", "t2", "search", "n1", "n2"],
        flows: [{ from: "order", to: "fee", color: "#c084fc", label: "quote" }]
      },
      {
        title: "Visibility: the idempotency map is concurrent",
        text: "Two retries of the same key need happens-before. A plain HashMap is a race. ConcurrentHashMap.putIfAbsent (or a DB unique key) publishes the first result. volatile on a boolean cannot make check-then-charge atomic.",
        highlight: ["order", "map", "client"],
        hide: ["pool", "http", "a", "b", "t1", "t2", "search", "n1", "n2", "upi", "card"],
        flows: [
          { from: "client", to: "gw", color: "#60a5fa", label: "retry" },
          { from: "order", to: "map", color: "#facc15", label: "putIfAbsent" }
        ]
      },
      {
        title: "Bounded executor, not an unbounded queue",
        text: "Outbound payment HTTP runs on a dedicated pool with a finite queue and a rejection policy. That is a bulkhead: a stuck rail cannot eat every servlet thread. CallerRunsPolicy applies backpressure. Name the threads.",
        highlight: ["order", "pool", "http", "n2"],
        hide: ["a", "b", "t1", "t2", "search", "n1", "map", "fee"],
        flows: [
          { from: "order", to: "pool", color: "#fb923c", label: "submit" },
          { from: "pool", to: "http", color: "#fb923c", label: "call" }
        ]
      },
      {
        title: "Deadlock: two locks, two orders",
        text: "Thread 1 locks account A then B. Thread 2 locks B then A. Both wait forever. This is the transfer bug. Never lock then call HTTP — you hold a monitor across the ocean.",
        highlight: ["t1", "t2", "a", "b"],
        fail: ["t1", "t2"],
        hide: ["pool", "http", "search", "n1", "n2", "map", "fee", "n0"],
        flows: [
          { from: "t1", to: "a", color: "#f87171", label: "A" },
          { from: "t2", to: "b", color: "#f87171", label: "B" }
        ]
      },
      {
        title: "Fix: sort account ids, tryLock",
        text: "Always lock min(id) then max(id). ReentrantLock.tryLock(timeout) so a sick thread cannot sit forever. Unique constraints in Postgres still beat an in-memory lock once you have two JVMs.",
        highlight: ["t1", "t2", "a", "b", "n1"],
        hide: ["pool", "http", "search", "n2", "map", "fee", "n0"],
        flows: [
          { from: "t1", to: "a", color: "#4ade80", label: "min" },
          { from: "t1", to: "b", color: "#4ade80", label: "max" }
        ]
      },
      {
        title: "Two pools: payments cannot starve search",
        text: "Index updates get their own executor (and later their own queue). Isolation is bulkhead at thread level. Virtual threads do not remove timeouts or sorted locks. At two JVMs, the lock moves to the database or a per-account queue.",
        highlight: ["search", "pool", "order", "gw"],
        hide: ["a", "b", "t1", "t2", "n1", "n0", "fee"],
        flows: [
          { from: "gw", to: "search", color: "#22d3ee", label: "index" },
          { from: "order", to: "pool", color: "#fb923c", label: "pay" }
        ]
      },
      {
        title: "Name the layer before the tool",
        text: "Strategy here is a Java interface. In HLD it becomes a swappable payments service. Observer here is an application event; at scale it becomes an outbox. ConcurrentHashMap is one JVM. Say which layer you are in.",
        highlight: ["order", "pay", "pool", "map", "client"],
        hide: ["a", "b", "t1", "t2", "n1", "n0", "n2", "search"],
        flows: [{ from: "client", to: "gw", color: "#4ade80", label: "checkout" }]
      }
    ]
  }
});
