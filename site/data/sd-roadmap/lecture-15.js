window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 15,
  title: "Raft, Leases, Distributed Locks, and Fencing Tokens",
  video: "",
  category: "Distributed Systems",
  tagline: "Elections pick a leader. Fencing tokens stop the previous leader from writing.",
  summary: "Raft is how a cluster agrees on a log and a leader: terms, votes, and majority replication. A lease is a lock with a TTL so a dead holder does not block forever. Ordinary Redis SET NX PX locks fail when a GC pause outlives the TTL and two workers both believe they hold the mutex. Fencing tokens — monotonic numbers issued with each lock grant — let the storage layer reject the stale holder's writes. In Java, prefer ZooKeeper/etcd/ShedLock with fencing or compare-and-set versions over a homemade Redis lock around @Scheduled.",

  theory: [
    {
      heading: "Why you want a leader at all",
      body: "Some work is easier with one writer: assigning primary keys, serializing a partition, running a cluster-wide cron. Multi-leader without a protocol is split-brain. The protocol's job is (1) at most one leader in a given term, (2) a replica that missed entries can catch up, (3) a minority that was partitioned cannot overwrite majority history. That is consensus. Paxos is the family; <b>Raft</b> is the version you can draw on a whiteboard and that etcd, Consul, and many databases actually run.",
      bullets: [
        "Consensus is about the log of decisions, not about feeling.",
        "A leader is an optimization for clients; the log is the truth.",
        "Two nodes cannot do majority of three — odd replica counts exist for a reason."
      ]
    },
    {
      heading: "Raft in one page",
      body: "Time is chopped into <b>terms</b>. A node starts an election by incrementing its term and requesting votes. A node votes for at most one candidate per term, and only if the candidate's log is at least as up to date. Majority wins and becomes <b>leader</b>. Followers reject RPCs from stale terms. The leader appends client commands to its log and ships <code>AppendEntries</code> to followers. An entry is <b>committed</b> when a majority has it; then it may be applied to state machines. Heartbeats are empty AppendEntries that also act as a lease: if followers stop hearing the leader they start a new election. Java clients rarely implement Raft; they talk to etcd/ZooKeeper which do.",
      bullets: [
        "Uncommitted entries on a deposed leader are overwritten. Clients must retry.",
        "Read-after-write linearizability needs extra care (read index / lease reads).",
        "Snapshotting keeps logs from growing without bound."
      ]
    },
    {
      heading: "Leases are locks that expire",
      body: "A <b>lock</b> without expiry is a cluster outage when the holder dies. A <b>lease</b> is a lock plus TTL: after T seconds the key vanishes and someone else may acquire it. ZooKeeper ephemeral nodes and etcd leases are this idea with session keepalives. The TTL must be longer than healthy GC and shorter than how long you can stand a dead leader. Clock skew (previous lecture) sits inside that inequality. Spring's ShedLock stores a lock row with a expiry timestamp in JDBC/Redis so <code>@Scheduled</code> runs on one instance — a lease, not Raft, and good enough for many crons if the critical section is short and idempotent.",
      bullets: [
        "Renew the lease on a timer shorter than the TTL.",
        "Stop work if renewal fails; do not assume you still own the job.",
        "Expiry is not fencing. Expiry is how you recover from death."
      ]
    },
    {
      heading: "The Redis lock that two people hold",
      body: "The internet recipe: <code>SET lock token NX PX 30000</code>, do work, delete if token matches. Failure mode: worker A acquires the lock, then GC-pauses for 35 seconds. The key expires. Worker B acquires it and starts writing the same resource. A wakes, still thinks it holds the lock, and writes too. The token-on-delete check does not help: A writes <i>before</i> delete. Redisson's watchdog extends the TTL, which shrinks the window and does not close it. This is the Martin Kleppmann critique of Redis locks, and it is still how people break unique jobs in Spring Boot.",
      bullets: [
        "GC, VM pauses, and slow GC logs are enough to outlive PX.",
        "A lock in Redis is a hint unless the resource itself checks a token.",
        "If the critical section can run twice, it will."
      ]
    },
    {
      heading: "Fencing tokens make storage the referee",
      body: "When the lock service grants the lease it also issues a monotonic <b>fencing token</b> (ZooKeeper zxid, etcd revision, or a SQL sequence). Every write to the protected resource must carry that token. The resource accepts only tokens ≥ the last seen token. A's stale write with token 33 loses to B's token 34. A can still be alive; it just cannot mutate. That is the whole trick: the lock service is not enough; the <b>storage API must enforce</b> the token. Compare-and-set versions (<code>UPDATE ... WHERE version = ?</code>) are fencing with another name. In Java, a ZooKeeper recipe with sequential znodes, or a DB row with a version column, beats a Redis NX around a file write.",
      bullets: [
        "No token check on the resource = no distributed lock, only a gentlemen's agreement.",
        "S3 and many object stores can require a precondition; use it.",
        "Leader election without fencing is how a partitioned primary keeps writing."
      ]
    },
    {
      heading: "Putting it together",
      body: "Need a single writer for a shard? Elect with Raft (or a system that uses it). Need a periodic job? Lease with ShedLock or an etcd lock, keep the work idempotent, and fence if the job writes to shared storage. Need a mutex around a file or a blob? Issue a token and check it on write. Do not mix: a Raft leader that then talks to a store without generations can still split-brain at the store. Kubernetes resourceVersions and TCP fencing (STONITH) are the same pattern at different layers.",
      bullets: [
        "Election, lease, and fence are three tools, not synonyms.",
        "Idempotency is still required; fencing stops stale leaders, not double submits from the live one.",
        "If you cannot change the storage API, you cannot fence — pick a different store or accept the race."
      ]
    }
  ],

  keyTerms: [
    { term: "Raft term", def: "Monotonic election epoch. RPCs from older terms are rejected." },
    { term: "Leader", def: "The node that currently accepts client writes and replicates the log." },
    { term: "Commit", def: "A log entry replicated to a majority; safe to apply to the state machine." },
    { term: "Lease", def: "A lock that expires unless renewed, so a dead holder cannot block forever." },
    { term: "TTL lock", def: "SET NX PX-style mutex whose safety dies if the holder pauses past expiry." },
    { term: "Fencing token", def: "Monotonic number issued with a lock grant; storage rejects lower tokens." },
    { term: "Ephemeral node", def: "ZooKeeper znode that vanishes when the session dies; used for elections and leases." },
    { term: "Compare-and-set", def: "Update that succeeds only if the version still matches; fencing in SQL form." }
  ],

  tradeoffs: [
    { pro: "Raft gives a single leader and a majority-replicated log you can reason about.", con: "Minority partitions cannot write; you need three+ nodes and operational care." },
    { pro: "Leases recover automatically when a holder dies.", con: "TTL vs pause is a race; expiry alone does not stop the stale holder." },
    { pro: "Redis NX locks are one line and feel fast.", con: "GC and network delay create two lock holders; delete-if-token does not fence writes." },
    { pro: "Fencing tokens let storage ignore a zombie primary.", con: "Every write path must carry and check the token, including batch jobs and scripts." },
    { pro: "ShedLock is enough for many Spring @Scheduled jobs.", con: "It is a lease without fencing; overlapping runs must be safe." }
  ],

  interviewTips: [
    "Draw Raft as terms, votes, majority append, then say what happens to the old leader's uncommitted tail.",
    "When they propose Redis lock, tell the GC-pause story and ask where the fencing token is checked.",
    "Separate election (who is primary) from fencing (how the store rejects the ex-primary).",
    "For scheduled jobs, mention ShedLock plus idempotency, and when you would promote to etcd/ZK.",
    "Name zxid/revision/version as concrete tokens, not a vague \"generation.\""
  ],

  scene: {
    nodes: [
      { id: "c1", label: "Node 1", type: "server", pos: [-8, 0, -4] },
      { id: "c2", label: "Node 2", type: "server", pos: [0, 0, -4] },
      { id: "c3", label: "Node 3", type: "server", pos: [8, 0, -4] },
      { id: "nTerm", label: "term 7 election", type: "note", pos: [0, 0, -7], showAt: 1 },
      { id: "log", label: "replicated log", type: "queue", pos: [0, 0, -1], showAt: 2 },
      { id: "etcd", label: "Lock service", type: "service", pos: [0, 0, 2], showAt: 3 },
      { id: "wa", label: "Worker A", type: "worker", pos: [-7, 0, 5], showAt: 3 },
      { id: "wb", label: "Worker B", type: "worker", pos: [7, 0, 5], showAt: 4 },
      { id: "store", label: "Blob / DB", type: "storage", pos: [0, 0, 6], showAt: 4 },
      { id: "nGc", label: "A paused > lock TTL", type: "note", pos: [-7, 0, 7.5], showAt: 4 },
      { id: "nTok", label: "token 33 stale, 34 wins", type: "note", pos: [7, 0, 7.5], showAt: 5 }
    ],
    edges: [
      { from: "c1", to: "c2" },
      { from: "c2", to: "c3" },
      { from: "c1", to: "c3" },
      { from: "c1", to: "log", showAt: 2 },
      { from: "c2", to: "log", showAt: 2 },
      { from: "c3", to: "log", showAt: 2 },
      { from: "wa", to: "etcd", showAt: 3 },
      { from: "wb", to: "etcd", showAt: 4 },
      { from: "wa", to: "store", showAt: 4 },
      { from: "wb", to: "store", showAt: 4 }
    ],
    steps: [
      {
        title: "Three replicas, no leader",
        text: "A Raft group of three is idle. Clients cannot take a linearizable write until someone wins an election. Majority of three is two.",
        highlight: ["c1", "c2", "c3"],
        flows: [
          { from: "c1", to: "c2", color: "#60a5fa" },
          { from: "c2", to: "c3", color: "#60a5fa" }
        ]
      },
      {
        title: "Term 7, votes, leader",
        text: "Node 2 increments its term, requests votes, and wins a majority. Followers remember they voted in term 7 and will ignore older terms.",
        highlight: ["c2", "nTerm", "c1", "c3"],
        flows: [
          { from: "c2", to: "c1", color: "#c084fc", label: "VoteReq" },
          { from: "c2", to: "c3", color: "#c084fc", label: "VoteReq" }
        ]
      },
      {
        title: "AppendEntries until majority",
        text: "The leader appends a command and ships it. The entry commits only when two nodes have it. Heartbeats double as a lease so followers do not elect early.",
        highlight: ["c2", "log", "c1", "c3"],
        flows: [
          { from: "c2", to: "log", color: "#4ade80", label: "append" },
          { from: "c2", to: "c1", color: "#c084fc", label: "replicate" },
          { from: "c2", to: "c3", color: "#c084fc" }
        ]
      },
      {
        title: "A lease for a job",
        text: "Worker A asks the lock service for a 30s lease to run the unique indexer. This is how you stop five Spring instances from all firing @Scheduled.",
        highlight: ["wa", "etcd"],
        flows: [{ from: "wa", to: "etcd", color: "#facc15", label: "acquire" }]
      },
      {
        title: "GC pause, two holders",
        text: "A pauses longer than the TTL. The lease expires. B acquires it. A wakes still holding a reference in memory. Both write the blob. A Redis NX lock dies here.",
        highlight: ["wa", "wb", "store", "nGc"],
        fail: ["wa"],
        flows: [
          { from: "wb", to: "etcd", color: "#facc15", label: "acquire" },
          { from: "wa", to: "store", color: "#f87171", label: "write" },
          { from: "wb", to: "store", color: "#f87171", label: "write" }
        ]
      },
      {
        title: "Issue a fencing token",
        text: "Each grant includes a monotonic token: A got 33, B got 34. The number comes from Raft's log index, a zxid, or a SQL sequence — not from the worker's clock.",
        highlight: ["etcd", "wa", "wb", "nTok"],
        flows: [
          { from: "etcd", to: "wa", color: "#c084fc", label: "t=33" },
          { from: "etcd", to: "wb", color: "#c084fc", label: "t=34" }
        ]
      },
      {
        title: "Storage rejects 33",
        text: "The blob/DB API requires If-Token-Match. It already accepted 34, so A's write with 33 fails. A can be alive; it cannot mutate. That is fencing.",
        highlight: ["store", "wa", "wb", "nTok"],
        fail: ["wa"],
        flows: [
          { from: "wb", to: "store", color: "#4ade80", label: "t=34 ok" },
          { from: "wa", to: "store", color: "#f87171", label: "t=33 409" }
        ]
      },
      {
        title: "Leader + lease + fence",
        text: "Raft picks who may be primary. A lease times out a dead one. A fencing token makes the store ignore the ghost. Missing any of the three is how unique jobs run twice.",
        highlight: ["c2", "etcd", "store", "wb"],
        flows: [
          { from: "c2", to: "log", color: "#4ade80" },
          { from: "wb", to: "store", color: "#4ade80", label: "fenced write" }
        ]
      }
    ]
  }
});
