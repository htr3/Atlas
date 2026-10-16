window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 9,
  title: "Google Borg: Billions of Distributed Linux Containers",
  video: "https://www.youtube.com/watch?v=l35hqwTY5W0",
  category: "Paper Walkthroughs",
  tagline: "Cluster OS for 98% of Google — 4 billion containers a week, ancestor of Kubernetes.",
  summary: "The 2015 Borg paper describes the cluster manager Google has run since 2005. Borg owns placement, restart, migration, naming, autoscaling, and capacity signals so app engineers only ship code. The lecture walks cells, the Borgmaster, Borglets, Linux cgroups, priority preemption, hybrid bin-packing, BNS, Chubby, and the caches that cut start time from ~25s to ~5s.",

  theory: [
    {
      heading: "The cluster operating system",
      body: "Borg is Google's <b>cluster OS</b>: it hands out CPU and RAM and then owns the process from start to finish. About <b>98%</b> of Google machines run under it. GFS, Spanner, Bigtable, and Search are tenants. If Borg is down, Google is down — so availability is the product, not a feature. The 2015 paper documents a system that had already survived a decade (in production since <b>2005</b>). Kubernetes was built by the same engineers; the lecture's rule of thumb is that ~<b>90%</b> of Borg's internal picture transfers if you already know Kubernetes.",
      bullets: [
        "Scale cited in the talk: ~4 billion containers scheduled every week.",
        "The API must be easy and extensible or Google teams will fork their own schedulers.",
        "App developers write code; Borg finds machines, restarts crashes, and migrates flaky tasks."
      ]
    },
    {
      heading: "What Borg actually owns",
      body: "Five jobs sit in one control plane. <b>Lifecycle</b>: start, health-check, restart, migrate. <b>Load balancing</b>: spread replicas across failure domains (power, rack, region) so one outage is not the product. <b>Discovery</b>: Borg Naming Service (BNS) is the DNS of where a task lives. <b>Autoscaling</b> was unusual in 2005 and routine at Google even then. <b>Capacity planning</b> is a hardware purchase problem that Borg makes solvable — task metrics (later Monarch, then Dremel SQL) tell a DevOps team whether to buy another fleet.",
      bullets: [
        "Service discovery is a list, not a rumor: Maps in two clusters, fifty tasks, Borg knows every address.",
        "Observability is how Borg pays for the hardware budget, not a side dashboard."
      ]
    },
    {
      heading: "Borg versus Kubernetes",
      body: "Kubernetes is open source and designed to run at almost any size. Borg is closed and sized for huge <b>cells</b>. Kubernetes APIs use generic words; Borg's vocabulary is Google-specific. Orchestration is the real split: Borg has a <b>central Borgmaster</b> that assigns work; Kubernetes splits the same jobs across microservices. Kubernetes also has a rich label language (app=Maps, env=prod, region=India). Borg's 2015 paper does not: you query by user and job. The lecture's aside is that by 2025 Borg has almost certainly imported the open-source ideas — they just are not in this paper.",
      bullets: [
        "Allocs in Borg are the same idea as pods.",
        "Central master vs decentralized controllers is a design choice, not a morality play.",
        "Skip this comparison if you only care about Borg internals; it is there because Kubernetes is the public cousin."
      ]
    },
    {
      heading: "Priorities, and why prod cannot be preempted",
      body: "Every task carries a priority. Highest is <b>monitoring</b> (if the watchers die, nothing else can be repaired). Then <b>production</b>, then <b>batch</b> (MapReduce), then <b>free</b> (best-effort). A production arrival evicts batch; batch evicts free. A monitoring arrival that could evict production, which then evicts batch, which then evicts free, is a <b>preemption cascade</b>. Borg's rule: <b>production is not preemptible</b>. Only batch and free get kicked. Engineers may attach constraints (OS image, IP, region, machine size) that turn placement into a linear program. Most jobs do not; they say \"run this somewhere.\"",
      bullets: [
        "Monitoring > production > batch > free.",
        "Constraints exist; default is unconstrained placement.",
        "Eviction is how Borg defends latency for Search while still packing MapReduce onto the same boxes."
      ]
    },
    {
      heading: "Cells, Borglets, and Linux containers",
      body: "A <b>cell</b> is ~<b>10,000</b> machines and one Borgmaster. The master is a SPOF for <i>new</i> work, not for running work: Borglets keep serving if the master dies. Tasks are usually <b>Linux containers</b>, not VMs — a Windows VM is too slow at this density. Isolation is classic Linux: <b>chroot</b> (and friends) for the security boundary, <b>cgroups</b> for CPU, RAM, disk, and network shares. Think chmod for who can see the tree, and a quota for how much log disk the app is guaranteed. Restart is SIGTERM (<code>-15</code>, please exit) then SIGKILL (<code>-9</code>) if it will not die.",
      bullets: [
        "One master per cell assigns allocs (pod-like packages of tasks).",
        "Spread replicas across power domains and regions after the cell is chosen.",
        "Most Google jobs are containers; VMs are the exception."
      ]
    },
    {
      heading: "Hybrid packing, not best-fit",
      body: "Placement is a bin-packing problem. <b>Best-fit</b> puts a 30% task on the machine with 30% free. Utilization looks perfect, assignment can be slow to compute, and MapReduce jobs routinely <i>under-declare</i> (they asked 30%, they used 35%) — the box then OOMs. <b>First-fit</b> is fast but fragments: two 30% leftovers cannot host the next 40% job. Borg's <b>hybrid</b> scores machines that still have headroom (the talk's picture is ~40–50% slack) while still preferring a snug fit. Speed of assignment and resilience beat theoretical 100% packing.",
      bullets: [
        "Best-fit + underestimate = crash.",
        "First-fit + fragmentation = stranded CPU.",
        "Hybrid: leave slack, still pack tightly, decide quickly."
      ]
    },
    {
      heading: "BNS, Chubby, and logs that never reach GFS",
      body: "Once a task is running, BNS records a name that is basically DNS: <code>30.app1.user.cellid.borg.google.com</code>. Regex over that tree dumps every replica and its state (pending, running, stopped) plus Borglet health. Control-plane metadata lives in <b>Chubby</b> — a Paxos key-value store Google used as a lock service long before Spanner. The lecture is unsure whether Borgmaster has moved to Spanner. A surprise: task logs are <b>local files</b>, rotated, and purged within a day or two after the task moves. They do not go to GFS. Health metrics used to hit Borgmon and now hit <b>Monarch</b>; capacity SQL goes to <b>Dremel</b>.",
      bullets: [
        "BNS is how an app owner finds their own tasks.",
        "Chubby holds master state so a new master can take over.",
        "Local, short-lived logs are a deliberate choice, not a missing pipeline."
      ]
    },
    {
      heading: "Master elections and the 25s → 5s tricks",
      body: "Five in-memory Borgmaster replicas stay in sync with Paxos. One dies; another is elected; Chubby already has the cell's state; Borglets never stopped. New jobs pause only while there is no master. On the scheduling hot path Borg caches almost everything: machine size, region, power feed, per-Borglet scores. Jobs are also bucketed into <b>classes</b> (I/O-heavy, memory-heavy, CPU-heavy) so similar Maps-like or Gmail-like shapes reuse a cached match. Last trick: prefer a Borglet that already has the job's libraries (Bazel-style). Cold start ~<b>25s</b>, warm ~<b>5s</b> — the difference that makes a 5,000-task rollout feel instant. Under memory or CPU pressure Borg kills from free upward; a brief CPU spike gets a short wait before the knife.",
      bullets: [
        "Running tasks survive a master crash; admissions do not.",
        "Cache scores, not just configs.",
        "Library locality is a placement signal, not only a build-system trick."
      ]
    }
  ],

  keyTerms: [
    { term: "Cell", def: "Borg's unit of cluster: ~10,000 machines and one Borgmaster." },
    { term: "Borgmaster", def: "Central scheduler for a cell. Assigns allocs; replicated with Paxos so a standby can take over." },
    { term: "Borglet", def: "Per-machine agent that runs tasks, reports health, and keeps working if the master is down." },
    { term: "Alloc", def: "Borg's pod analogue: a bundle of containers placed together on a Borglet." },
    { term: "BNS", def: "Borg Naming Service — DNS-like names such as 30.app1.user.cell.borg.google.com." },
    { term: "Chubby", def: "Paxos key-value / lock service that stores Borgmaster metadata." },
    { term: "cgroup / chroot", def: "Linux isolation: quotas for CPU/RAM/disk/net, and a filesystem jail for security." },
    { term: "Hybrid packing", def: "Placement that is snug but leaves headroom, avoiding best-fit crashes and first-fit fragments." },
    { term: "Preemption", def: "Killing a lower-priority task (batch/free) so a higher-priority one can run; production is protected." }
  ],

  tradeoffs: [
    { pro: "One cluster OS: engineers ship binaries; Borg restarts, migrates, names, and scales them.", con: "A Borg outage is a Google outage — the control plane has to be more available than any tenant." },
    { pro: "Central Borgmaster is simple to reason about and fast to assign.", con: "No new work while the master is down; Kubernetes later split this into many controllers." },
    { pro: "Priority preemption packs batch onto prod machines without giving batch prod SLOs.", con: "A naive preemption chain (monitor → prod → batch → free) thrashes the cell; prod had to be frozen." },
    { pro: "Best-fit packing maximizes utilization on paper.", con: "Declared size is a lie for MapReduce; 30% tasks that use 35% crash the box." },
    { pro: "Local rotating logs and cached Borglet scores make the hot path cheap.", con: "You lose post-move logs within days, and a stale cache can mis-score a machine until config changes." }
  ],

  interviewTips: [
    "Open with 98% of Google, 4B containers/week, and Kubernetes as the public 90% cousin — then draw cell → master → Borglet.",
    "State the priority ladder (monitor > prod > batch > free) and why production is not preemptible.",
    "Contrast best-fit (OOM when jobs under-ask) vs first-fit (stranded 30% holes) vs Borg's hybrid slack.",
    "Name BNS for discovery and Chubby/Paxos for master metadata; running Borglets outlive a dead master.",
    "If asked about start latency, cite library locality and score caches: ~25s cold, ~5s warm.",
    "Do not put task logs on GFS in the Borg design — they are local and short-lived; metrics go to Monarch/Dremel."
  ],

  scene: {
    nodes: [
      { id: "zcell", label: "Borg cell ~10k", type: "zone", pos: [6, 0, 0], size: [12, 10], showAt: 1 },

      { id: "dev", label: "App engineer", type: "user", pos: [-11, 0, -4] },
      { id: "job", label: "Maps job", type: "service", pos: [-11, 0, 0] },

      { id: "master", label: "Borgmaster", type: "server", pos: [-4, 0, -4], showAt: 1 },
      { id: "rep", label: "Paxos replica", type: "server", pos: [-4, 0, 0], showAt: 7 },
      { id: "chubby", label: "Chubby", type: "db", pos: [-4, 0, 4], showAt: 6 },

      { id: "ba", label: "Borglet A", type: "worker", pos: [3, 0, -4], showAt: 2 },
      { id: "bb", label: "Borglet B", type: "worker", pos: [8, 0, -4], showAt: 2 },
      { id: "bc", label: "Borglet C", type: "worker", pos: [3, 0, 0], showAt: 2 },

      { id: "prod", label: "Prod task", type: "service", pos: [8, 0, 0], showAt: 3 },
      { id: "batch", label: "Batch task", type: "service", pos: [3, 0, 4], showAt: 3 },
      { id: "free", label: "Free task", type: "service", pos: [8, 0, 4], showAt: 3 },

      { id: "bns", label: "BNS", type: "lb", pos: [11, 0, -4], showAt: 5 },
      { id: "logs", label: "Local logs", type: "storage", pos: [11, 0, 0], showAt: 6 },
      { id: "mon", label: "Monarch", type: "db", pos: [11, 0, 4], showAt: 8 },

      { id: "n0", label: "98% of Google servers", type: "note", pos: [-11, 0, 4] },
      { id: "n1", label: "One master per cell", type: "note", pos: [-5, 0, -7], showAt: 1 },
      { id: "n2", label: "cgroups + chroot, not VMs", type: "note", pos: [2, 0, -7], showAt: 2 },
      { id: "n3", label: "Prod is not preemptible", type: "note", pos: [8, 0, 7], showAt: 3 },
      { id: "n4", label: "Hybrid fit: snug + slack", type: "note", pos: [2, 0, 7], showAt: 4 },
      { id: "n5", label: "30.app.user.cell.borg", type: "note", pos: [11, 0, -7], showAt: 5 },
      { id: "n6", label: "Logs local; purge in days", type: "note", pos: [11, 0, 7], showAt: 6 },
      { id: "n7", label: "5 Paxos masters; Borglets live", type: "note", pos: [-5, 0, 7], showAt: 7 },
      { id: "n8", label: "Warm libs: 25s to 5s", type: "note", pos: [7, 0, -7], showAt: 8 }
    ],
    edges: [
      { from: "dev", to: "job", label: "ship" },
      { from: "job", to: "master", label: "submit", showAt: 1 },
      { from: "master", to: "ba", showAt: 2 },
      { from: "master", to: "bb", showAt: 2 },
      { from: "master", to: "bc", showAt: 2 },
      { from: "ba", to: "prod", showAt: 3 },
      { from: "bc", to: "batch", showAt: 3 },
      { from: "bb", to: "free", showAt: 3 },
      { from: "prod", to: "bns", label: "register", showAt: 5 },
      { from: "master", to: "chubby", label: "state", showAt: 6 },
      { from: "prod", to: "logs", showAt: 6 },
      { from: "master", to: "rep", label: "Paxos", showAt: 7 },
      { from: "prod", to: "mon", label: "metrics", showAt: 8 }
    ],
    steps: [
      {
        title: "Engineers ship code, not machines",
        text: "Borg is the cluster OS under ~98% of Google. An app engineer writes Maps (or Spanner, or Search). Placement, restarts, and migration are Borg's problem. Four billion containers a week is the scale the paper is defending.",
        highlight: ["dev", "job", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "dev", to: "job", color: "#4ade80", label: "binary" }
        ]
      },
      {
        title: "One cell, one Borgmaster",
        text: "A cell is about 10,000 machines. One Borgmaster takes the submit. It is a single point of failure for new work, not for already-running tasks — that split is why a 10k-machine cell can still be operable.",
        highlight: ["zcell", "master", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "job", to: "master", color: "#4ade80", label: "run 5k copies" }
        ]
      },
      {
        title: "Borglets run Linux containers",
        text: "Each machine has a Borglet. Tasks are almost always Linux containers: chroot for the security jail, cgroups for CPU/RAM/disk/net. VMs exist but are too slow. SIGTERM (-15) then SIGKILL (-9) if the process will not leave.",
        highlight: ["ba", "bb", "bc", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "master", to: "ba", color: "#fb923c", label: "alloc" },
          { from: "master", to: "bb", color: "#fb923c", label: "alloc" },
          { from: "master", to: "bc", color: "#fb923c", label: "alloc" }
        ]
      },
      {
        title: "Priority ladder, no prod cascade",
        text: "Monitoring outranks production, which outranks batch, which outranks free. A prod arrival may kill batch; batch may kill free. Production itself is not preemptible — otherwise a monitor job starts a cascade that thrashes the cell.",
        highlight: ["prod", "batch", "free", "n3"],
        fail: ["batch"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "master", to: "prod", color: "#4ade80", label: "prod" },
          { from: "prod", to: "batch", color: "#f87171", label: "preempt" }
        ]
      },
      {
        title: "Hybrid packing, not 100% best-fit",
        text: "Best-fit puts a 30% task on a 30% hole. Utilization looks perfect; a MapReduce job that actually needs 35% crashes the box. First-fit is faster and fragments. Borg scores machines with leftover slack (~40–50%) and still prefers a snug fit.",
        highlight: ["ba", "bb", "bc", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6", "n7", "n8"],
        flows: [
          { from: "master", to: "bb", color: "#c084fc", label: "headroom" },
          { from: "master", to: "ba", color: "#60a5fa", label: "snug" }
        ]
      },
      {
        title: "BNS names every running task",
        text: "After placement, Borg Naming Service writes a DNS-like record: 30.app1.user.cellid.borg.google.com. Owners regex the tree to list pending, running, and stopped replicas plus Borglet health. That list is service discovery.",
        highlight: ["bns", "prod", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6", "n7", "n8"],
        flows: [
          { from: "prod", to: "bns", color: "#60a5fa", label: "30.maps..." },
          { from: "dev", to: "bns", color: "#60a5fa", label: "lookup" }
        ]
      },
      {
        title: "Chubby holds state; logs stay local",
        text: "Master metadata is a Paxos key-value store called Chubby (the lecture is unsure it has moved to Spanner). Task logs are ordinary local files, rotated, and deleted a day or two after the task moves — they never go to GFS.",
        highlight: ["chubby", "logs", "master", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n7", "n8"],
        flows: [
          { from: "master", to: "chubby", color: "#c084fc", label: "Paxos KV" },
          { from: "prod", to: "logs", color: "#fb923c", label: "rotate" }
        ]
      },
      {
        title: "Five masters; Borglets keep running",
        text: "Five in-memory Borgmaster replicas elect through Paxos. Kill one and another provisions. Borglets do not care — already-running Maps stays up. The outage you actually feel is that no new job can be admitted until a master is back.",
        highlight: ["master", "rep", "chubby", "n7"],
        fail: ["master"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n8"],
        flows: [
          { from: "master", to: "rep", color: "#c084fc", label: "sync" },
          { from: "rep", to: "chubby", color: "#c084fc", label: "takeover" }
        ]
      },
      {
        title: "Caches, classes, warm libraries",
        text: "Borgmaster caches machine scores and buckets jobs into I/O, memory, or CPU classes. Prefer a Borglet that already has the binaries (Bazel-style) and start time drops from ~25s to ~5s. Pressure kills free then batch; metrics stream to Monarch, capacity SQL to Dremel.",
        highlight: ["master", "bb", "mon", "n8"],
        fail: ["free"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "master", to: "bb", color: "#4ade80", label: "warm libs" },
          { from: "prod", to: "mon", color: "#fb923c", label: "tsdb" }
        ]
      }
    ]
  }
});
