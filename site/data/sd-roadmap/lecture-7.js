window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 7,
  title: "Transactions, Isolation Levels, and Deadlocks",
  video: "",
  category: "Data Modeling",
  tagline: "Keep @Transactional small, pick isolation on purpose, and break deadlock cycles.",
  summary: "A transaction is the unit Postgres (and your Spring service) will commit or roll back together: ACID in four letters. Isolation levels decide what concurrent transactions are allowed to see — dirty reads, non-repeatable reads, phantoms. The default READ COMMITTED is not a plot hole; SERIALIZABLE is not free. Deadlocks happen when two @Transactional methods lock rows in opposite order. Optimistic versions (@Version) avoid holding locks; pessimistic locks serialize on purpose. Long transactions plus HTTP are how you freeze checkout.",

  theory: [
    {
      heading: "ACID is a boundary, not a feeling",
      body: "<b>Atomicity</b>: debit and credit both land or neither does. <b>Consistency</b>: constraints (FK, unique, check) still hold after commit. <b>Isolation</b>: concurrent work does not leak half-states the isolation level forbids. <b>Durability</b>: after COMMIT, a crash does not forget it (WAL flushed). Spring's <code>@Transactional</code> binds that boundary to a thread and a Connection from Hikari. The boundary should be the use case (placeOrder), not the repository method and not the whole HTTP filter chain.",
      bullets: [
        "A transaction that calls WebClient is holding a DB connection while the network thinks.",
        "REQUIRES_NEW suspends the outer tx; use it for an audit log you must keep even if the outer rolls back — sparingly.",
        "unchecked exceptions roll back by default; checked ones do not unless rollbackFor is set."
      ]
    },
    {
      heading: "Isolation levels are a menu",
      body: "READ UNCOMMITTED (rarely used in Postgres — it behaves like READ COMMITTED) can dirty-read. <b>READ COMMITTED</b> (Postgres default): each statement sees the latest committed data; two SELECTs in one tx can disagree. <b>REPEATABLE READ</b> (MySQL InnoDB default): a snapshot for the tx; you do not see others' commits; Postgres RR still prevents phantoms via SSI-ish snapshot. <b>SERIALIZABLE</b>: the system aborts if it cannot pretend the txs ran one at a time. Spring: <code>@Transactional(isolation = Isolation.REPEATABLE_READ)</code>. Higher isolation = more aborts or more locks. Pick per use case, not globally.",
      bullets: [
        "Lost update: two txs read qty=1, both write qty=0. RR + version or SELECT FOR UPDATE fixes it.",
        "Phantom: you count OPEN orders, another inserts one, you count again. SERIALIZABLE or locking the range.",
        "Write skew: two doctors leave the ward because each saw the other still there. SERIALIZABLE or an explicit constraint."
      ]
    },
    {
      heading: "How Postgres actually isolates",
      body: "MVCC: readers do not block writers; each row version has xmin/xmax. VACUUM reclaims dead versions. Long-running transactions freeze vacuum and bloat the table — another reason not to hold @Transactional across a payment HTTP call. SELECT FOR UPDATE takes a row lock; FOR UPDATE SKIP LOCKED is how a Spring worker claims jobs without waiting. Advisory locks exist for application-level mutexes (do not overuse)."
    },
    {
      heading: "Optimistic versus pessimistic in Spring Data",
      body: "<code>@Version</code> on an entity: Hibernate includes the version in UPDATE ... WHERE version=?. Zero rows updated means someone else committed — throw ObjectOptimisticLockingFailureException and retry. That is optimistic concurrency: no row lock during think time. Pessimistic: <code>@Lock(LockModeType.PESSIMISTIC_WRITE)</code> or a native FOR UPDATE when the critical section is short and conflict rate is high (inventory decrement). Optimistic shines for 'edit account settings'; pessimistic shines for 'last seat on the plane' if you cannot retry cleanly.",
      bullets: [
        "Retries must be idempotent and bounded.",
        "An optimistic retry storm is a signal to serialize that hot row.",
        "Do not mix a long user think-time with a held FOR UPDATE."
      ]
    },
    {
      heading: "Deadlocks: cycles in the lock graph",
      body: "Tx A locks order 1 then waits for order 2. Tx B locked 2 and waits for 1. Postgres detects the cycle, aborts one with 40P01, the other proceeds. Spring sees a deadlock victim exception. Fix: lock rows in a global order (always smaller id first), keep transactions short, or collapse into one statement. Two services each opening a tx and then calling the other over HTTP is a distributed deadlock you will not get a 40P01 for — that is a timeout. Saga/outbox (later lessons) exist because you cannot cheaply make that one ACID unit.",
      bullets: [
        "Log the SQL of both sides; the victim is not always the guilty design.",
        "Foreign-key checks lock parent rows — deleting a customer while inserting an order can deadlock too.",
        "innodb_deadlock_detect / Postgres deadlock_timeout are last-resort knobs, not architecture."
      ]
    },
    {
      heading: "Practical Spring rules",
      body: "One tx per use case, as short as possible, no remote I/O inside. Default isolation unless you can name the anomaly. @Transactional on the concrete class or via interface proxies — self-invocation does not start a tx. Read-only transactions (<code>readOnly = true</code>) skip dirty checking and can use a replica if you route them. Test isolation with two threads or Testcontainers, not with hope."
    }
  ],

  keyTerms: [
    { term: "ACID", def: "Atomic, consistent, isolated, durable — properties of a single-database transaction." },
    { term: "@Transactional", def: "Spring boundary that binds a JDBC Connection and commit/rollback to a method." },
    { term: "READ COMMITTED", def: "Each statement sees only committed data; default in Postgres; lost updates still possible." },
    { term: "REPEATABLE READ", def: "A snapshot (Postgres) or gap locks (MySQL) so rows you read stay stable for the tx." },
    { term: "SERIALIZABLE", def: "Abort if concurrent history cannot be explained by a serial order." },
    { term: "@Version", def: "Optimistic lock column; UPDATE fails if another tx already changed the row." },
    { term: "SELECT FOR UPDATE", def: "Pessimistic row lock until commit. SKIP LOCKED lets workers claim jobs." },
    { term: "Deadlock", def: "A cycle in wait-for locks. The engine aborts a victim; you must retry or lock in order." }
  ],

  tradeoffs: [
    { pro: "READ COMMITTED maximizes concurrency and is the Postgres default for a reason.", con: "Lost updates and write skew are legal unless you add versions, locks, or constraints." },
    { pro: "SERIALIZABLE makes the anomaly list short.", con: "You must retry serialization failures; throughput on hot keys drops." },
    { pro: "Optimistic @Version holds no row lock during think time.", con: "High conflict rates waste work and need a retry loop." },
    { pro: "Pessimistic FOR UPDATE makes the last-seat problem simple.", con: "Lock wait plus a slow tx is how you freeze the whole checkout table." }
  ],

  interviewTips: [
    "Draw two transactions and name the anomaly (lost update, phantom, write skew) before naming the isolation level.",
    "Say @Transactional must not include WebClient. That sentence scores.",
    "For inventory, pick FOR UPDATE or a single UPDATE qty = qty-1 WHERE qty>=1 and check rowcount.",
    "Deadlock answer: consistent lock order, short tx, retry the victim. Do not 'increase timeout.'",
    "Mention MVCC so you do not claim readers always block writers in Postgres.",
    "If they go multi-service, admit you lost ACID and name outbox/saga — do not pretend 2PC is the default."
  ],

  scene: {
    nodes: [
      { id: "u1", label: "Buyer A", type: "user", pos: [-11, 0, -4] },
      { id: "u2", label: "Buyer B", type: "user", pos: [-11, 0, 4] },
      { id: "s1", label: "Spring tx A", type: "server", pos: [-5, 0, -4] },
      { id: "s2", label: "Spring tx B", type: "server", pos: [-5, 0, 4] },
      { id: "row1", label: "order 1", type: "db", pos: [3, 0, -4] },
      { id: "row2", label: "order 2", type: "db", pos: [3, 0, 4] },
      { id: "stock", label: "sku qty=1", type: "db", pos: [3, 0, 0] },
      { id: "n_acid", label: "One @Transactional boundary", type: "note", pos: [-5, 3.4, -7.5] },
      { id: "n_lost", label: "Lost update: both write 0", type: "note", pos: [3, 3.4, 7], showAt: 2 },
      { id: "ver", label: "@Version col", type: "point", pos: [8, 0, 0], showAt: 3 },
      { id: "n_opt", label: "UPDATE ... WHERE version=?", type: "note", pos: [8, 3.4, -7.5], showAt: 3 },
      { id: "n_iso", label: "RR snapshot vs RC", type: "note", pos: [-5, 3.4, 7], showAt: 4 },
      { id: "n_dl", label: "A waits 2, B waits 1", type: "note", pos: [8, 3.4, 7], showAt: 5 },
      { id: "pay", label: "Payments HTTP", type: "service", pos: [8, 0, -4], showAt: 7 }
    ],
    edges: [
      { from: "u1", to: "s1" },
      { from: "u2", to: "s2" },
      { from: "s1", to: "stock", label: "read" },
      { from: "s2", to: "stock", label: "read" },
      { from: "s1", to: "ver", showAt: 3, dashed: true },
      { from: "s1", to: "row1", label: "LOCK 1", showAt: 5 },
      { from: "s2", to: "row2", label: "LOCK 2", showAt: 5 },
      { from: "s1", to: "row2", label: "wait", showAt: 5, dashed: true },
      { from: "s2", to: "row1", label: "wait", showAt: 5, dashed: true },
      { from: "s1", to: "pay", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "A use-case is the transaction",
        text: "Buyer A hits placeOrder. @Transactional opens a Hikari connection. Debit inventory and insert the order commit together or not at all. That is atomicity.",
        highlight: ["u1", "s1", "stock", "n_acid"],
        flows: [
          { from: "u1", to: "s1", color: "#4ade80", label: "placeOrder" },
          { from: "s1", to: "stock", color: "#60a5fa", label: "BEGIN" }
        ]
      },
      {
        title: "Two buyers, one quantity",
        text: "A and B both read qty=1 under READ COMMITTED. Both decide they can buy. Both will try to write 0. Isolation has not saved you yet — this is the lost-update setup.",
        highlight: ["u1", "u2", "s1", "s2", "stock"],
        flows: [
          { from: "s1", to: "stock", color: "#60a5fa", label: "qty=1" },
          { from: "s2", to: "stock", color: "#60a5fa", label: "qty=1" }
        ]
      },
      {
        title: "Lost update commits a lie",
        text: "A writes 0 and commits. B writes 0 and commits. Two orders, zero stock accounting. RC allowed it because each UPDATE saw committed data at statement time — or the second clobbered the first.",
        highlight: ["s1", "s2", "stock", "n_lost"],
        fail: ["stock"],
        flows: [
          { from: "s1", to: "stock", color: "#f87171", label: "qty=0" },
          { from: "s2", to: "stock", color: "#f87171", label: "qty=0" }
        ]
      },
      {
        title: "Optimistic @Version catches the second writer",
        text: "UPDATE ... SET qty=0, version=v+1 WHERE id=? AND version=v. B updates zero rows, Spring throws, B retries or fails. No row lock during the HTTP request.",
        highlight: ["ver", "s2", "stock", "n_opt"],
        flows: [
          { from: "s2", to: "ver", color: "#fb923c", label: "v stale" },
          { from: "s2", to: "stock", color: "#f87171", label: "0 rows" }
        ]
      },
      {
        title: "Or REPEATABLE READ / FOR UPDATE",
        text: "A snapshot (RR) or SELECT FOR UPDATE on the sku row serializes the critical section. SERIALIZABLE would abort B. You pick based on conflict rate and whether retry is easy.",
        highlight: ["s1", "stock", "n_iso"],
        flows: [
          { from: "s1", to: "stock", color: "#c084fc", label: "FOR UPDATE" }
        ]
      },
      {
        title: "Deadlock: opposite lock order",
        text: "Tx A locks order 1, tx B locks order 2, then each waits for the other. Postgres aborts a victim (40P01). Fix: always lock the smaller id first, and keep the tx tiny.",
        highlight: ["s1", "s2", "row1", "row2", "n_dl"],
        fail: ["s2"],
        flows: [
          { from: "s1", to: "row1", color: "#4ade80", label: "lock 1" },
          { from: "s2", to: "row2", color: "#4ade80", label: "lock 2" },
          { from: "s1", to: "row2", color: "#f87171", label: "wait" },
          { from: "s2", to: "row1", color: "#f87171", label: "wait" }
        ]
      },
      {
        title: "Victim retries; the other commits",
        text: "B is killed and rolls back. A finishes. A well-behaved Spring retry with backoff replays B in lock order. Raising deadlock_timeout is not a design.",
        highlight: ["s1", "row1", "row2", "s2"],
        fail: ["s2"],
        flows: [
          { from: "s1", to: "row2", color: "#4ade80", label: "got 2" },
          { from: "s1", to: "row1", color: "#60a5fa", label: "COMMIT" }
        ]
      },
      {
        title: "Do not hold the tx across HTTP",
        text: "If placeOrder calls payments inside @Transactional, you hold row locks and a pool slot for the network RTT. That is how checkout freezes. Commit locally, then outbox the charge.",
        highlight: ["s1", "pay", "stock", "n_acid"],
        flows: [
          { from: "s1", to: "pay", color: "#f87171", label: "HTTP in tx" },
          { from: "s1", to: "stock", color: "#fb923c", label: "lock held" }
        ]
      }
    ]
  }
});
