window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 21,
  title: "Distributed Consensus and Data Replication strategies on the server",
  video: "https://www.youtube.com/watch?v=GeGxgmPTe4c",
  category: "Data & Storage",
  tagline: "Copies save you from a crash. Quorum saves you from split-brain.",
  summary: "A single database behind many servers is a single point of failure. Replicas restore availability, but who accepts writes, how they sync, and what happens when the network lies are the real design. The lecture walks master-slave, master-master, split-brain, a third-node quorum, then sketches 2PC, MVCC, sagas, and per-shard failover.",

  theory: [
    {
      heading: "One database is a single point of failure",
      body: "The interview drawing is familiar: four phones, a load balancer, several app servers, and <b>one</b> database. Servers can be multiplied; that cylinder cannot. If it crashes, every request that needs data dies with it and the business stops. The first instinct should be the same as for any lonely box: replicate. Keep a copy on <i>different hardware</i> so a disk or RAID card dying does not take the copy with it.",
      bullets: [
        "Anything unique in the diagram (LB, DB) is a candidate SPOF.",
        "A replica on the same machine is not a replica.",
        "Replication is the simplest availability hammer; it is not free consistency."
      ]
    },
    {
      heading: "Async vs sync copies",
      body: "Once you have two copies, you must decide how they stay close. <b>Asynchronous</b> replication is gentle on the primary: it is not blocked by a follower on every write. The cost is lag. If the primary dies mid-flight, the replica may be missing the last transactions. <b>Synchronous</b> replication is not a physical law; you enforce it in code. The primary ships the same command into the replica's log (\"add 102 to user 1\") and only then treats the write as committed. Same commands, same serial order, same state.",
      bullets: [
        "Async: lower write latency, possible data loss on failover.",
        "Sync: replica is up to date, primary waits on the network.",
        "Replaying a command log is how a silent copy becomes an identical state machine."
      ]
    },
    {
      heading: "Master-slave vs master-master",
      body: "The node that accepts writes is the <b>master</b>. A <b>slave</b> only applies the master's command stream. If an app server tries to credit 200 rupees to user 2 on the slave, you have two clean answers. Never allow it: reads go to replicas, writes only to the master. Or allow it and propagate the change up, at which point the slave is also a master and you have <b>peer-to-peer / master-master</b>. Dual masters look wonderful: writes load-balance, and if one dies everyone fails over to the other.",
      bullets: [
        "Master = the copy that takes writes. That is the definition used here.",
        "Read replicas scale analytics and stale-okay feeds (a Facebook comment can land a moment later).",
        "Master-master still needs a story for conflicting writes on the same row."
      ]
    },
    {
      heading: "Split-brain: the network lied",
      body: "In a distributed system a silent peer is not proof of death. If A and B are both masters and the router between them fails, each assumes it is the sole survivor and keeps taking reads and writes. A user with 120 rupees deducts 100 on A and 50 on B. Neither side saw the other debit, so the account goes negative. That is <b>split-brain</b>: two brains, one dataset, diverging truth. Failover that cannot tell \"crashed\" from \"partitioned\" is how you get it.",
      bullets: [
        "True crash of B: A can safely own the world.",
        "Partition: both A and B own the world. That is the bug.",
        "Money, inventory, and unique usernames cannot survive two independent masters."
      ]
    },
    {
      heading: "A third node as a tie-breaker",
      body: "Add C. The working assumption is that a node crash and a router crash do not happen together. If C dies, A and B still talk and stay in sync. If the A-B link dies, writes must flow through C. Start at state S0. A commits X, reaches SX, and C follows to SX. B tries to move S0 to SY; C asks for B's previous state, sees it does not match SX, and refuses. B rolls back. The user retries against the new state. A value is durable only after the other nodes have committed it, not while it is still in a local transaction. That agreement on \"the\" state is the seed of <b>distributed consensus</b>. Two-phase commit is the textbook protocol (and is famously slow); three-phase commit is a cousin. The lecture's simplified picture is: majority / witness nodes stop a minority partition from electing itself master.",
      bullets: [
        "Assume one failure at a time; two simultaneous faults can still break the story.",
        "Uncommitted work must be abortable; do not advertise SY until C accepted it.",
        "Consensus = several nodes agreeing on one value (here, the next committed state)."
      ]
    },
    {
      heading: "MVCC and sagas: other ways to agree over time",
      body: "<b>MVCC</b> (multi-version concurrency control), used by Postgres, keeps several versions of a row so readers and writers do not always lock each other. Isolation then becomes a product choice: dirty reads can see an old version; serializable / no-phantom settings wait for a consistent snapshot and run slower. <b>Sagas</b> (called out via Halo at Microsoft) are long-running transactions broken into steps with compensation. A food order of 200 rupees <i>locks</i> funds at the bank until the restaurant confirms, then captures or releases. A 30-minute phone call is billed as many one-minute lock-and-maybe-charge sagas so a disconnect does not need a day-long two-phase commit.",
      bullets: [
        "MVCC: versions instead of a single locked cell; isolation level picks which version you see.",
        "Saga: a story of local transactions plus undo actions, not one global lock.",
        "Use sagas when the work spans minutes and other companies (banks, restaurants)."
      ]
    },
    {
      heading: "Why master-slave still wins, plus sharding",
      body: "Replicas are backups. They also scale <b>reads</b>: dump a slightly lagged copy into an analytics engine, or put ten slaves behind a read pool. Social comments that can be a second late are a perfect fit. Writes still hit one master, so the remaining trick is to <b>shard</b> so no master owns everyone. Node A takes users 0-100, B 100-200, C 200-300 (wrapping). A C crash only hurts that range. Pair each shard with a slave; a coordinator promotes C's slave when C dies. Keep that pair in sync with something like 2PC so a single node failure is survivable. Blast radius shrinks; you still need the failover story from earlier.",
      bullets: [
        "Read-heavy, eventual-OK data: add slaves.",
        "Write-heavy or large keyspace: shard, then replicate each shard.",
        "Coordinator + replica promotion is how a shard survives its master dying."
      ]
    }
  ],

  keyTerms: [
    { term: "SPOF", def: "Single point of failure. One DB behind many servers is the classic example." },
    { term: "Master", def: "The replica that accepts writes. Slaves only apply its command log." },
    { term: "Synchronous replication", def: "Primary waits until the follower has the same command before committing." },
    { term: "Split-brain", def: "Two masters, partitioned from each other, both accepting writes on the same data." },
    { term: "Quorum / third node", def: "A witness so a partition cannot get a majority and invent a second truth." },
    { term: "2PC", def: "Two-phase commit: prepare then commit across nodes. Safe-ish, slow, blocking." },
    { term: "MVCC", def: "Keep multiple row versions so readers do not block writers; isolation varies." },
    { term: "Saga", def: "Long transaction as a chain of local steps with locks or compensations." },
    { term: "Read replica", def: "Slave used for queries and analytics; may lag the master." }
  ],

  tradeoffs: [
    { pro: "Async replicas are cheap on the primary and great for analytics.", con: "Failover can lose the last writes; readers see stale data." },
    { pro: "Sync master-slave gives a hot standby with the same command order.", con: "Write latency includes the replica round-trip; slaves cannot take writes." },
    { pro: "Master-master spreads writes and fails over in either direction.", con: "A network partition becomes split-brain unless you add a quorum." },
    { pro: "A third node plus rollback of uncommitted states prevents dual masters.", con: "Assumes one failure at a time; 2PC across many nodes is slow." },
    { pro: "Sharding plus a per-shard slave limits who goes down.", con: "Cross-shard transactions and the coordinator are new failure domains." }
  ],

  interviewTips: [
    "Circle every singleton on the whiteboard (LB, DB) and say \"single point of failure\" before they ask.",
    "Define master as \"whoever takes writes.\" That one sentence separates slave from peer.",
    "For split-brain, use the 120 rupees / debit 100 / debit 50 story so money makes the bug obvious.",
    "Prefer odd replica counts (3, 5) and say you will not promote a replica you cannot confirm is the only survivor.",
    "When they want write scale, do not only add slaves: shard the keyspace and replicate each shard.",
    "Name 2PC as the slow safe option, MVCC for row versions, sagas for long multi-party flows."
  ],

  scene: {
    nodes: [
      { id: "p1", label: "Phone 1", type: "phone", pos: [-10.5, 0, -7] },
      { id: "p2", label: "Phone 2", type: "phone", pos: [-7, 0, -7] },
      { id: "p3", label: "Phone 3", type: "phone", pos: [-3.5, 0, -7] },
      { id: "p4", label: "Phone 4", type: "phone", pos: [0, 0, -7] },
      { id: "lb", label: "Load balancer", type: "lb", pos: [-5, 0, -3.5] },
      { id: "s1", label: "Server 1", type: "server", pos: [-9, 0, 0] },
      { id: "s2", label: "Server 2", type: "server", pos: [-5, 0, 0] },
      { id: "s3", label: "Server 3", type: "server", pos: [-1, 0, 0] },
      { id: "n_spof", label: "One DB = SPOF", type: "note", pos: [4, 3.2, 3] },

      { id: "master", label: "Master DB", type: "db", pos: [-7, 0, 4.5] },
      { id: "slave", label: "Replica", type: "db", pos: [2, 0, 4.5], showAt: 2, color: "#60a5fa" },
      { id: "router", label: "Router", type: "service", pos: [-2.5, 0, 4.5], showAt: 2 },
      { id: "n_cmd", label: "ADD 102 uid 1", type: "note", pos: [-2.5, 3.2, 7], showAt: 3 },

      { id: "n_mm", label: "Both take writes = masters", type: "note", pos: [6, 3.2, -2], showAt: 4 },
      { id: "n_split", label: "120: -100 and -50", type: "note", pos: [6, 3.2, 7], showAt: 5 },

      { id: "nodeC", label: "Witness C", type: "db", pos: [7.5, 0, 4.5], showAt: 6, color: "#c084fc" },
      { id: "n_sx", label: "C holds SX, rejects SY", type: "note", pos: [7.5, 3.2, 1], showAt: 6 },

      { id: "analytics", label: "Analytics", type: "worker", pos: [7.5, 0, 0], showAt: 7 },
      { id: "n_reads", label: "Scale reads, lag OK", type: "note", pos: [7.5, 3.2, -4], showAt: 7 },

      { id: "za", label: "Users 0-100", type: "zone", pos: [-8, 0, 6.5], size: [5, 3], showAt: 8 },
      { id: "zb", label: "Users 100-200", type: "zone", pos: [-2, 0, 6.5], size: [5, 3], showAt: 8 },
      { id: "zc", label: "Users 200-300", type: "zone", pos: [4, 0, 6.5], size: [5, 3], showAt: 8 },
      { id: "sha", label: "Shard A", type: "db", pos: [-8, 0, 6.5], showAt: 8 },
      { id: "shb", label: "Shard B", type: "db", pos: [-2, 0, 6.5], showAt: 8 },
      { id: "shc", label: "Shard C", type: "db", pos: [4, 0, 6.5], showAt: 8 },
      { id: "shcSlave", label: "C slave", type: "db", pos: [9.5, 0, 6.5], showAt: 8, color: "#60a5fa" },
      { id: "coord", label: "Coordinator", type: "gateway", pos: [4, 0, 2.5], showAt: 8 }
    ],
    edges: [
      { from: "p1", to: "lb" },
      { from: "p2", to: "lb" },
      { from: "p3", to: "lb" },
      { from: "p4", to: "lb" },
      { from: "lb", to: "s1" },
      { from: "lb", to: "s2" },
      { from: "lb", to: "s3" },
      { from: "s1", to: "master" },
      { from: "s2", to: "master" },
      { from: "s3", to: "master" },
      { from: "master", to: "router", showAt: 2 },
      { from: "router", to: "slave", showAt: 2 },
      { from: "s3", to: "slave", label: "write?", showAt: 4, dashed: true },
      { from: "master", to: "nodeC", showAt: 6, dashed: true },
      { from: "slave", to: "nodeC", showAt: 6, dashed: true },
      { from: "slave", to: "analytics", showAt: 7, dashed: true },
      { from: "coord", to: "sha", showAt: 8 },
      { from: "coord", to: "shb", showAt: 8 },
      { from: "coord", to: "shc", showAt: 8 },
      { from: "shc", to: "shcSlave", label: "2PC", showAt: 8 }
    ],
    steps: [
      {
        title: "Four phones, one database",
        text: "Phones hit a load balancer, then a row of app servers. Every server talks to a single database. That lonely cylinder should make you nervous.",
        highlight: ["lb", "master", "n_spof"],
        hide: ["za", "zb", "zc", "sha", "shb", "shc", "shcSlave", "coord"],
        flows: [
          { from: "p1", to: "lb", color: "#4ade80", label: "req" },
          { from: "lb", to: "s2", color: "#4ade80" },
          { from: "s2", to: "master", color: "#4ade80", label: "SQL" }
        ]
      },
      {
        title: "The database crashes",
        text: "Servers are fine. The load balancer is fine. With the only copy of the data gone, the product stops. Replicate onto other hardware before the next outage.",
        highlight: ["n_spof"],
        fail: ["master"],
        hide: ["za", "zb", "zc", "sha", "shb", "shc", "shcSlave", "coord"],
        flows: [
          { from: "s2", to: "master", color: "#f87171", label: "fail" }
        ]
      },
      {
        title: "A replica on other hardware",
        text: "Stand up a copy. Async is easy on the primary but can lag. If you need the copy to match, the primary ships every committed command across the router.",
        highlight: ["master", "slave", "router"],
        hide: ["za", "zb", "zc", "sha", "shb", "shc", "shcSlave", "coord"],
        flows: [
          { from: "master", to: "slave", color: "#c084fc", label: "async?" }
        ]
      },
      {
        title: "Master ships the command log",
        text: "Master accepts \"add 102 to user 1\" and forwards that same command, in the same order, to the slave. Replay the log and both disks hold one state. This is master-slave: writes only on the left.",
        highlight: ["master", "slave", "n_cmd"],
        hide: ["za", "zb", "zc", "sha", "shb", "shc", "shcSlave", "coord"],
        flows: [
          { from: "s2", to: "master", color: "#4ade80", label: "write" },
          { from: "master", to: "slave", color: "#c084fc", label: "ADD 102" }
        ]
      },
      {
        title: "If the replica takes writes",
        text: "Server 3 tries to add 200 rupees for user 2 on the replica. Either refuse it (stay master-slave) or accept and propagate back. Accepting makes both nodes masters: peer-to-peer, writes on both sides.",
        highlight: ["slave", "s3", "n_mm"],
        hide: ["za", "zb", "zc", "sha", "shb", "shc", "shcSlave", "coord"],
        flows: [
          { from: "s3", to: "slave", color: "#fb923c", label: "+200 uid2" },
          { from: "slave", to: "master", color: "#c084fc", label: "peer" }
        ]
      },
      {
        title: "Split-brain on a dead router",
        text: "The router dies. Neither database crashed, but each thinks it is the last master. Debit 100 on one copy and 50 on the other against a balance of 120. Both succeed locally. The account is now nonsense.",
        highlight: ["master", "slave", "n_split"],
        fail: ["router"],
        hide: ["za", "zb", "zc", "sha", "shb", "shc", "shcSlave", "coord"],
        flows: [
          { from: "s1", to: "master", color: "#f87171", label: "-100" },
          { from: "s3", to: "slave", color: "#f87171", label: "-50" }
        ]
      },
      {
        title: "Witness C refuses a stale state",
        text: "A third node C holds SX after A's write. B tries SY from old S0; C sees a mismatched previous state and rejects. B rolls back. Uncommitted work is not the cluster state. That is consensus in miniature.",
        highlight: ["nodeC", "master", "slave", "n_sx"],
        hide: ["za", "zb", "zc", "sha", "shb", "shc", "shcSlave", "coord"],
        flows: [
          { from: "master", to: "nodeC", color: "#c084fc", label: "SX" },
          { from: "slave", to: "nodeC", color: "#f87171", label: "SY?" }
        ]
      },
      {
        title: "Keep master-slave for reads",
        text: "Why bother with slaves if masters are so dramatic? Backup, plus read scale. Analytics can scan a lagged replica. Social comments do not need the replica in lock-step. Ten slaves, one writer.",
        highlight: ["slave", "analytics", "n_reads", "master"],
        hide: ["za", "zb", "zc", "sha", "shb", "shc", "shcSlave", "coord", "nodeC"],
        flows: [
          { from: "master", to: "slave", color: "#c084fc", label: "repl" },
          { from: "slave", to: "analytics", color: "#60a5fa", label: "scan" }
        ]
      },
      {
        title: "Shard, then replicate each shard",
        text: "Users 0-100 / 100-200 / 200-300. A crash of shard C only burns that range. Keep a slave beside C; the coordinator promotes it (and 2PC keeps the pair aligned). Smaller blast radius, same failover lesson.",
        highlight: ["sha", "shb", "shc", "shcSlave", "coord"],
        fail: ["shc"],
        hide: ["master", "slave", "router", "nodeC", "analytics", "n_cmd", "n_mm", "n_split", "n_sx", "n_reads", "n_spof"],
        flows: [
          { from: "lb", to: "coord", color: "#4ade80", label: "uid 250" },
          { from: "coord", to: "shcSlave", color: "#fb923c", label: "promote" }
        ]
      }
    ]
  }
});
