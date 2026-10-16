window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 16,
  title: "Snowflake IDs and Distributed Scheduling",
  video: "",
  category: "Distributed Systems",
  tagline: "Time-ordered 64-bit ids, and exactly one node running the cron.",
  summary: "UUID v4 is unique and random, which is why it fragments B-tree indexes and gives you nothing to sort on. Twitter-style Snowflake packs a timestamp, a worker id, and a per-millisecond sequence into 64 bits so ids roughly increase with time and need no central counter on the hot path. Worker ids must be unique; clocks that jump backward must pause or wait. Distributed scheduling is the same uniqueness problem for time: five Spring instances must not all fire a settlement job. Elect a leader, take a lease (ShedLock, Quartz clustering, or k8s CronJob), and keep the job idempotent because leases are not fencing.",

  theory: [
    {
      heading: "The id problem at scale",
      body: "A single Postgres <code>BIGSERIAL</code> is perfect until you have several writers that cannot share that sequence without chatter. UUID v4 (<code>UUID.randomUUID()</code>) needs no coordinator and then scatters inserts across the leaf pages of every clustered index, wrecking cache locality and WAL. UUID v1 leaks MAC addresses. ULID and UUID v7 are time-ordered cousins of the same idea Snowflake made famous: put time in the high bits so new ids land near the right edge of the index. Your public API can still expose a separate opaque string if you do not want sequential ids to leak volume.",
      bullets: [
        "Primary keys are a storage layout choice, not just uniqueness.",
        "Central Redis INCR is simple and becomes a hotspot and a SPOF.",
        "Range allocation (each app grabs 1_000 ids) is the SQL-native alternative to Snowflake."
      ]
    },
    {
      heading: "Snowflake layout",
      body: "A typical 64-bit Snowflake: 1 unused sign bit, 41 bits of milliseconds since a custom epoch (~69 years), 10 bits of worker (data center + machine), 12 bits of sequence (4096 ids per worker per ms). Twitter, Discord, and Instagram variants differ in bit splits. Generation is local: read time, increment sequence, pack bits. Java: <code>id = ((now - EPOCH) << 22) | (workerId << 12) | seq</code> with a synchronized or AtomicInteger sequence and a wait if the clock did not move. 4096/ms/worker is a lot; if you exceed it, block until the next millisecond rather than overflowing into another worker's space.",
      bullets: [
        "Worker id must be unique in the deployment. Collisions duplicate ids.",
        "41-bit time needs an epoch you will not outlive without a migration.",
        "Extract time with <code>(id >> 22) + EPOCH</code> for debugging."
      ]
    },
    {
      heading: "Clocks going backward",
      body: "NTP steps, VM pauses, and leap seconds can make <code>currentTimeMillis()</code> smaller than the last id you issued. If you emit that smaller timestamp, ids go backward and uniqueness can collide with an earlier sequence. Policies: refuse to generate until wall time catches up; keep the last timestamp and spin; or bump a logical overlay (hybrid logical clock). Do not silently use the reversed time. This is the same clock lecture: Snowflake trusts a loosely synced clock for order of magnitude, not for linearizability. Across data centers, ids from a behind clock can interleave. That is usually fine for indexes and not fine if you treated id order as commit order.",
      bullets: [
        "Persist last issued timestamp if a process restart plus clock rollback is in scope.",
        "Assign worker ids from a small strongly consistent store (etcd) at boot.",
        "If you need strictly increasing ids cluster-wide, you wanted a sequence, not Snowflake."
      ]
    },
    {
      heading: "Distributed scheduling is \"who runs this minute\"",
      body: "Five replicas of a Spring Boot app all have <code>@Scheduled(cron = \"0 0 * * * *\")</code>. At :00 they all settle payouts. That is a split-brain of jobs. Fixes, in increasing seriousness: (1) run the scheduler in exactly one Deployment replica (fragile), (2) <b>ShedLock</b> — a lease row so only one method body runs, (3) Quartz JDBC job store with clustering, (4) a Kubernetes CronJob or cloud scheduler that hits an idempotent HTTP endpoint, (5) a leader elected in ZooKeeper/etcd that is the only node that even enables scheduling. Same tools as the lock lecture: lease plus idempotency. Fencing if the job writes to a store that two nodes could touch after a pause.",
      bullets: [
        "The schedule is not the lock. The lock is extra.",
        "Catch-up: if you missed 3am because the cluster was down, do you run once or three times?",
        "Long jobs must renew the lease or split into queue workers."
      ]
    },
    {
      heading: "Spring concrete pieces",
      body: "Ids: a <code>SnowflakeIdGenerator</code> bean that reads <code>workerId</code> from an env var set by the orchestrator, or from a hashed pod name modulo 1024 (hash collisions are id collisions — prefer an allocator). Hibernate can use a custom <code>IdentifierGenerator</code>. Scheduling: <code>@SchedulerLock(name = \"settlePayouts\", lockAtMostFor = \"PT10M\")</code> on the method, ShedLock with Redis or JDBC. For a fleet of one-off tasks, push due work into Kafka/Rabbit from a single scheduler and let workers compete — the schedule emits messages; the workers do not cron. That scales better than expanding the locked critical section.",
      bullets: [
        "lockAtMostFor must exceed the worst job duration or two will overlap.",
        "lockAtLeastFor avoids a heartbeat-fast double fire on a tiny job.",
        "Expose next-fire and last-success as metrics or you will not know it died."
      ]
    },
    {
      heading: "Choosing in the interview",
      body: "Need uniqueness plus roughly time-ordered 64-bit keys? Snowflake or UUID v7. Need dense ids and are still on one primary? Database sequence. Need a job once per hour across N pods? External cron into an idempotent API, or ShedLock, and say why a Redis NX lock is not fencing. Mention clock rollback for Snowflake and missed-run policy for cron. Those two footnotes are how interviewers tell you have run this.",
      bullets: [
        "Do not use Snowflake ids as security tokens; they encode time and worker.",
        "Do not use UUID v4 as a clustered primary on a hot insert table without a reason.",
        "Do not run @Scheduled on every replica and hope."
      ]
    }
  ],

  keyTerms: [
    { term: "Snowflake id", def: "64-bit id packing timestamp, worker id, and sequence so generation is local and roughly time-ordered." },
    { term: "Worker id", def: "Unique slot in the Snowflake bit layout identifying the generating process." },
    { term: "Sequence bits", def: "Per-worker counter that resets each millisecond; overflow waits for the next tick." },
    { term: "UUID v4", def: "Random 122-bit id. Unique without coordination; hostile to B-tree locality." },
    { term: "UUID v7 / ULID", def: "Time-ordered unique ids; same index idea as Snowflake in 128 bits." },
    { term: "ShedLock", def: "Spring library that takes a lease so @Scheduled runs on at most one instance." },
    { term: "Clustered Quartz", def: "JDBC job store where competing nodes lock the next trigger row." },
    { term: "Idempotent job", def: "A run that can overlap or repeat without corrupting state — required because leases are not perfect." }
  ],

  tradeoffs: [
    { pro: "Snowflake needs no network hop on the insert path and sorts by time.", con: "Worker-id uniqueness and backward clocks are now your problem." },
    { pro: "UUID v4 needs no configuration.", con: "Random keys fragment indexes and hide creation order." },
    { pro: "DB sequences are dense and simple on one primary.", con: "Cross-region writers chatter or you pre-allocate ranges." },
    { pro: "ShedLock / clustered Quartz stop duplicate @Scheduled fires.", con: "A pause longer than lockAtMostFor overlaps; jobs must still be idempotent." },
    { pro: "External CronJob hitting an API separates \"when\" from \"who.\"", con: "You now operate two systems and still need exactly-once or at-least-once semantics on the endpoint." }
  ],

  interviewTips: [
    "Draw the 1-41-10-12 bit split and say what breaks if worker ids collide.",
    "Contrast UUID v4 index fragmentation with Snowflake/UUID v7 sequential inserts.",
    "When clocks jump backward, describe wait-or-refuse, not \"NTP will fix it.\"",
    "For cron, count the replicas first, then add a lease, then say the missed-run policy.",
    "Offer the pattern: one scheduler enqueues, many workers consume — better than a fat locked method."
  ],

  scene: {
    nodes: [
      { id: "s1", label: "API pod 1", type: "server", pos: [-8, 0, -3] },
      { id: "s2", label: "API pod 2", type: "server", pos: [0, 0, -3] },
      { id: "s3", label: "API pod 3", type: "server", pos: [8, 0, -3] },
      { id: "nBits", label: "41 time | 10 worker | 12 seq", type: "note", pos: [0, 0, -6], showAt: 1 },
      { id: "nUuid", label: "v4 scatters the B-tree", type: "note", pos: [-8, 0, -6], showAt: 0 },
      { id: "db", label: "Orders PK index", type: "db", pos: [0, 0, 2] },
      { id: "alloc", label: "worker-id etcd", type: "service", pos: [8, 0, 2], showAt: 2 },
      { id: "nBack", label: "clock went backward: wait", type: "note", pos: [8, 0, 5], showAt: 3 },
      { id: "lock", label: "ShedLock row", type: "cache", pos: [-8, 0, 4], showAt: 4 },
      { id: "cron", label: "settlePayouts", type: "worker", pos: [0, 0, 5], showAt: 4 },
      { id: "q", label: "Job queue", type: "queue", pos: [8, 0, 6], showAt: 6 },
      { id: "w", label: "Payout workers", type: "worker", pos: [3, 0, 7], showAt: 6 }
    ],
    edges: [
      { from: "s1", to: "db", label: "INSERT" },
      { from: "s2", to: "db" },
      { from: "s3", to: "db" },
      { from: "s1", to: "alloc", showAt: 2, dashed: true },
      { from: "s1", to: "lock", showAt: 4 },
      { from: "s2", to: "lock", showAt: 4 },
      { from: "cron", to: "q", showAt: 6 },
      { from: "q", to: "w", showAt: 6 }
    ],
    steps: [
      {
        title: "Random UUIDs thrash the index",
        text: "Three pods insert UUID v4 primary keys. New rows land all over the B-tree. Unique, and slow at volume. This is why people reach for time-ordered ids.",
        highlight: ["s1", "s2", "s3", "db", "nUuid"],
        flows: [
          { from: "s1", to: "db", color: "#f87171", label: "uuid" },
          { from: "s2", to: "db", color: "#f87171" },
          { from: "s3", to: "db", color: "#f87171" }
        ]
      },
      {
        title: "Snowflake packs time locally",
        text: "Each pod builds a 64-bit id from ms since epoch, its worker slot, and a sequence. No Redis INCR on the insert path. Ids roughly increase, so the index appends.",
        highlight: ["nBits", "s1", "s2", "db"],
        flows: [
          { from: "s1", to: "db", color: "#4ade80", label: "snowflake" },
          { from: "s2", to: "db", color: "#4ade80" }
        ]
      },
      {
        title: "Worker ids are unique",
        text: "At boot, pods take a slot from etcd (or a well-assigned env var). Two pods with workerId=7 will mint collisions. Hash of hostname is not an allocator.",
        highlight: ["alloc", "s3", "nBits"],
        flows: [{ from: "s3", to: "alloc", color: "#c084fc", label: "lease slot 9" }]
      },
      {
        title: "Clock rollback waits",
        text: "NTP steps pod 3 backward. Generating with the new time could reuse an old (time, seq) pair. The generator blocks until wall time passes the last issued timestamp.",
        highlight: ["s3", "nBack", "alloc"],
        fail: ["s3"],
        flows: [{ from: "s3", to: "db", color: "#f87171", label: "refuse" }]
      },
      {
        title: "All three pods have @Scheduled",
        text: "Midnight hits. Without a lock, settlePayouts runs three times. This is the scheduling twin of the duplicate-worker problem.",
        highlight: ["s1", "s2", "s3", "cron"],
        flows: [
          { from: "s1", to: "cron", color: "#f87171", label: "fire" },
          { from: "s2", to: "cron", color: "#f87171" },
          { from: "s3", to: "cron", color: "#f87171" }
        ]
      },
      {
        title: "ShedLock takes a lease",
        text: "Only the pod that writes the lock row with a future expiry runs the method. Others skip. lockAtMostFor must outlast the job. The job must still be safe if it overlaps.",
        highlight: ["lock", "s1", "cron"],
        flows: [
          { from: "s1", to: "lock", color: "#facc15", label: "acquire" },
          { from: "s2", to: "lock", color: "#60a5fa", label: "skip" }
        ]
      },
      {
        title: "Scheduler enqueues, workers run",
        text: "The locked method only publishes due work onto a queue. Competing workers pay out. The critical section stays tiny; throughput is the worker pool, not the cron thread.",
        highlight: ["cron", "q", "w", "lock"],
        flows: [
          { from: "cron", to: "q", color: "#fb923c", label: "due jobs" },
          { from: "q", to: "w", color: "#fb923c" }
        ]
      },
      {
        title: "Ids and jobs share uniqueness",
        text: "Snowflake avoids a central id bottleneck. Leased scheduling avoids a central \"who runs\" bottleneck — with the same warning: uniqueness is coordination plus idempotency, not a library annotation alone.",
        highlight: ["db", "lock", "q", "nBits"],
        flows: [
          { from: "s1", to: "db", color: "#4ade80", label: "id" },
          { from: "q", to: "w", color: "#fb923c", label: "once-ish" }
        ]
      }
    ]
  }
});
