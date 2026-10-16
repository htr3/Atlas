window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 14,
  title: "Clocks, Partial Failure, and Network Partitions",
  video: "",
  category: "Distributed Systems",
  tagline: "Wall clocks lie, nodes fail halfway, and the network splits. Design for all three.",
  summary: "Distributed systems do not share a now, a crash detector, or a reliable wire. NTP-synchronized wall clocks still skew; using them to order writes is how you lose data. Partial failure — a node slow, not dead — is the default, and timeouts are guesses. A network partition makes both sides look alive to themselves and dead to each other. CAP is the slogan; the engineering is: pick a clock that matches the question, treat every RPC as maybe-done, and decide who stays writable when the cable is cut.",

  theory: [
    {
      heading: "There is no shared now",
      body: "Each machine has a quartz oscillator that drifts. NTP and Chrony pull them toward a reference, but <b>skew</b> of tens of milliseconds is normal and jumps of seconds happen after pauses or VMs that steal steal time. <code>System.currentTimeMillis()</code> in Java is that wall clock: fine for logs, dangerous as a uniqueness or ordering key across hosts. <code>nanoTime()</code> is monotonic <i>on one JVM</i> and cannot be compared across processes. Google's TrueTime returns an interval, not a point, which is the honest API. If your Spring app stamps <code>updated_at = now()</code> on two replicas and last-write-wins, the loser is the replica whose clock was behind — not the write that happened later in causality.",
      bullets: [
        "Do not order distributed commits with wall clocks.",
        "Lease and token TTLs must include clock-uncertainty slack.",
        "Prefer server-generated timestamps from one clock domain when you need a user-visible time."
      ]
    },
    {
      heading: "Logical clocks capture happened-before",
      body: "<b>Lamport clocks</b> are counters: increment on each event, send the counter with every message, take max on receive. If L(a) < L(b), a did not happen after b — but equal or reversed numbers do not prove concurrency by themselves in the naive reading; the real test is the happens-before graph. <b>Vector clocks</b> keep one counter per node so you can tell concurrent updates from ordered ones. They are how Dynamo-style stores detect conflicts you must merge. Hybrid logical clocks (HLC) mix wall time with a logical tick so you get roughly human timestamps plus monotonicity. Use logical clocks for causality; use wall clocks for humans and SLAs.",
      bullets: [
        "Happens-before is a partial order. Many pairs of events are concurrent.",
        "Version vectors on a shopping cart beat \"last timestamp wins.\"",
        "You rarely implement Lamport by hand; you implement the rule: do not trust time for conflict."
      ]
    },
    {
      heading: "Partial failure is the defining bug",
      body: "In one process, a call returns or throws. Across a network, the peer may have <b>crashed</b>, <b>paused</b> (GC, a frozen VM), <b>dropped your packet</b>, or <b>done the work and lost the reply</b>. You cannot tell those apart. That is partial failure. The Spring <code>RestTemplate</code> timeout you set is not detection of death; it is a policy: \"I will stop waiting.\" The work on the other side may still commit. Retries without idempotency duplicate. Failures that look like slowness (a 30s GC) trip the timeout and then recover — split-brain behavior without a partition. Design every RPC as at-least-once and maybe-done.",
      bullets: [
        "Timeouts are guesses with SLO consequences, not oracles.",
        "Health checks that only ping TCP miss a process that accepts sockets and cannot query the DB.",
        "Circuit breakers stop you from stacking more maybe-done calls onto a sick peer."
      ]
    },
    {
      heading: "Network partitions",
      body: "A <b>partition</b> is when group A cannot reach group B, but each group can talk internally. DNS still resolves. Clients in A think B is dead; B thinks A is dead. If both sides accept writes, you have split-brain: two truths. If both sides freeze, you have availability loss. Switches, BGP, stale iptables, and \"that one AZ\" do this in real life. Failure detectors (gossip, phi-accrual) try to guess; they are wrong at the edges. The only honest application move is to pick a rule: which minority must stop writing, and how it learns the cable is back (generation number, fencing, or a quorum).",
      bullets: [
        "A partition is not \"the whole site is down.\" It is two live sites that disagree.",
        "Majority quorum is how CP systems refuse the minority.",
        "Caches that ignore partitions serve stale as if it were fresh — name that."
      ]
    },
    {
      heading: "CAP as an engineering choice, not a poster",
      body: "When a partition happens you cannot have linearizable consistency and availability for every client. <b>CP</b>: refuse requests that cannot reach a quorum (ZooKeeper, etcd, Raft primaries). <b>AP</b>: take the write, reconcile later (Dynamo, Cassandra with last-write-wins or vector clocks). Most product systems are neither slogan: they are CP for payments and AP for likes. PACELC adds the reminder that even without a partition you trade latency for consistency (the ELC). In interviews, pick the operation first (debit, feed, session), then the side of the partition you will disappoint.",
      bullets: [
        "CAP is about a partition, not about \"we use Mongo so we are AP.\"",
        "Read-your-writes for one user can be sticky sessions or a primary; it is a smaller promise than linearizability.",
        "Document the degraded mode: queue locally, 503, or dirty read."
      ]
    },
    {
      heading: "What to do in a Spring service",
      body: "Give every mutating RPC an idempotency key. Bound waits with Resilience4j time limiters and retries with jitter. Do not compare <code>Instant.now()</code> across regions to resolve conflicts; store a version or ETag. For leader work, use a lease from etcd/ZooKeeper, not <code>if (now > lockExpiry)</code> on two hosts. Log both the wall time and a monotonic trace id. Chaos that only kills processes will miss partition bugs; you also need to drop packets between AZs.",
      bullets: [
        "Assume the other side committed when you timed out.",
        "Assume clocks are wrong by more than your timeout slack.",
        "Assume a \"down\" dependency is a partition, not a crash, until proven otherwise."
      ]
    }
  ],

  keyTerms: [
    { term: "Clock skew", def: "Difference between two machines' wall clocks after NTP. Milliseconds to seconds in practice." },
    { term: "Monotonic clock", def: "A timer that only moves forward on one machine (Java nanoTime). Not comparable across hosts." },
    { term: "Lamport clock", def: "Logical counter that respects happens-before by max-and-increment on messages." },
    { term: "Vector clock", def: "Per-node counters that can detect concurrent writes versus ordered writes." },
    { term: "Partial failure", def: "A peer that is slow, partitioned, or crashed — indistinguishable from the caller's side." },
    { term: "Timeout", def: "A local policy to stop waiting. Not proof that the remote work did not commit." },
    { term: "Network partition", def: "A cut where subsets of nodes can talk inside but not across the cut." },
    { term: "Split-brain", def: "Two sides of a partition both accept writes and diverge." },
    { term: "Quorum", def: "Majority (or other threshold) that must agree so a minority partition cannot commit." }
  ],

  tradeoffs: [
    { pro: "Wall clocks are human-readable and easy to index.", con: "Skew and jumps make them unsafe for distributed order and locks." },
    { pro: "Logical / vector clocks capture causality and concurrent writes.", con: "They are not timestamps; users cannot read a vector as \"3pm.\"" },
    { pro: "Short timeouts fail fast and protect thread pools.", con: "They turn GC pauses into duplicates and false failovers." },
    { pro: "CP with quorum avoids split-brain on a partition.", con: "The minority (and its clients) lose availability until the cut heals." },
    { pro: "AP with later merge stays writable on both sides.", con: "You must define conflict resolution or accept lost updates." }
  ],

  interviewTips: [
    "When they sort replicas by updated_at, attack clock skew before you mention CAP.",
    "Describe a timeout as \"I stopped waiting,\" then ask whether the write still happened.",
    "Draw a partition as two live clusters, not a red X on one box.",
    "Pick CP or AP per operation (charge vs like), not per company.",
    "Name fencing or generation numbers as the way a healed partition forgets the stale primary."
  ],

  scene: {
    nodes: [
      { id: "azA", label: "AZ A", type: "zone", pos: [-5, 0, 0], size: [10, 12] },
      { id: "azB", label: "AZ B", type: "zone", pos: [6, 0, 0], size: [10, 12] },
      { id: "n1", label: "Node A", type: "server", pos: [-7, 0, -3] },
      { id: "n2", label: "Node B", type: "server", pos: [-3, 0, -3] },
      { id: "n3", label: "Node C", type: "server", pos: [6, 0, -3] },
      { id: "clkA", label: "clock 12:00:00.010", type: "note", pos: [-7, 0, -6] },
      { id: "clkC", label: "clock 12:00:00.000", type: "note", pos: [6, 0, -6], showAt: 1 },
      { id: "lam", label: "Lamport 5 → max+1", type: "note", pos: [-3, 0, 3], showAt: 2 },
      { id: "userA", label: "Client A", type: "user", pos: [-7, 0, 4], showAt: 4 },
      { id: "userB", label: "Client B", type: "user", pos: [8, 0, 4], showAt: 5 },
      { id: "cut", label: "packets dropped A↔C", type: "note", pos: [1, 0, 0], showAt: 5 },
      { id: "nPart", label: "both sides think they are primary", type: "note", pos: [1, 0, 6], showAt: 6 },
      { id: "nTO", label: "timeout ≠ crash", type: "note", pos: [-3, 0, 6], showAt: 3 }
    ],
    edges: [
      { from: "n1", to: "n2", label: "RPC" },
      { from: "n2", to: "n3", label: "RPC" },
      { from: "n1", to: "n3", dashed: true },
      { from: "userA", to: "n1", showAt: 4 },
      { from: "userB", to: "n3", showAt: 5 }
    ],
    steps: [
      {
        title: "Three nodes, three clocks",
        text: "A, B, and C each have a wall clock. They look close enough that a developer stamps updated_at locally and trusts last-write-wins.",
        highlight: ["n1", "n2", "n3", "clkA"],
        flows: [
          { from: "n1", to: "n2", color: "#60a5fa", label: "ping" },
          { from: "n2", to: "n3", color: "#60a5fa" }
        ]
      },
      {
        title: "Skew makes last-write lie",
        text: "C's clock is 10 ms behind. C's earlier write gets a later timestamp than A's later write, or the reverse. NTP did not give you a global now. Do not order commits with it.",
        highlight: ["n1", "n3", "clkA", "clkC"],
        flows: [
          { from: "n1", to: "n3", color: "#f87171", label: "LWW" }
        ]
      },
      {
        title: "Lamport tracks happens-before",
        text: "A sends its counter. B takes max and increments. You can now refuse to treat concurrent updates as ordered. Vector clocks go further and detect the conflict.",
        highlight: ["n1", "n2", "lam"],
        flows: [{ from: "n1", to: "n2", color: "#c084fc", label: "L=5" }]
      },
      {
        title: "Partial failure: B is slow",
        text: "B is in a GC pause, not dead. A waits, then times out. B may still commit. Retry without an idempotency key duplicates. Timeout is a guess.",
        highlight: ["n1", "n2", "nTO"],
        fail: ["n2"],
        flows: [{ from: "n1", to: "n2", color: "#f87171", label: "timeout" }]
      },
      {
        title: "Client A still has a live AZ",
        text: "From inside AZ A the world looks fine. Health checks to local peers pass. Failure is not global outage; it is incomplete information.",
        highlight: ["userA", "n1", "azA"],
        flows: [{ from: "userA", to: "n1", color: "#4ade80", label: "write" }]
      },
      {
        title: "The cable between AZs dies",
        text: "Packets between A and C drop. Each AZ can talk internally. Client B in AZ B also looks fine. This is a partition, not a crash of C.",
        highlight: ["cut", "n1", "n3", "userB", "azB"],
        flows: [
          { from: "userB", to: "n3", color: "#4ade80", label: "write" },
          { from: "n1", to: "n3", color: "#f87171", label: "drop" }
        ]
      },
      {
        title: "Split-brain if both accept writes",
        text: "If both sides remain primary, two histories grow. Healing the cable does not merge them. Quorum CP would have silenced the minority; AP would have queued a conflict.",
        highlight: ["n1", "n3", "nPart", "userA", "userB"],
        fail: ["cut"],
        flows: [
          { from: "userA", to: "n1", color: "#fb923c", label: "v1" },
          { from: "userB", to: "n3", color: "#fb923c", label: "v2" }
        ]
      },
      {
        title: "Pick who stays writable",
        text: "Decide per operation. Debits need a majority (CP). Feed likes can take both sides and merge (AP). Clocks still do not pick the winner. Fencing tokens (next lecture) retire the stale side.",
        highlight: ["n1", "n2", "n3", "azA", "azB"],
        flows: [
          { from: "n1", to: "n2", color: "#60a5fa", label: "quorum" },
          { from: "userA", to: "n1", color: "#4ade80" }
        ]
      }
    ]
  }
});
