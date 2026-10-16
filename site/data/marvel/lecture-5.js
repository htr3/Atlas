window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 5,
  title: "Apache Spark",
  video: "https://www.youtube.com/watch?v=I-PwfcNurWo",
  category: "Paper Walkthroughs",
  tagline: "Keep the working set in RAM, replay lineage on crash — MapReduce only when you spill.",
  summary: "The 2010 Berkeley Spark paper treats cluster compute as one Scala program instead of a zoo of analytics engines. MapReduce paid for crashes by writing every stage to disk. Spark keeps intermediate working sets in memory as RDDs, rebuilds lost partitions from a lineage log, and plugs into Mesos or Kubernetes for machines. Average jobs are tens of times faster; iterative ones such as PageRank can be three orders of magnitude faster, and a memory miss degrades to MapReduce rather than failing.",

  theory: [
    {
      heading: "The 2010 analytics zoo",
      body: "Before Spark, a data team bought a different stack for each shape of work. <b>Dremel</b> was the interactive aggregation engine. <b>MapReduce</b> owned batch ETL on commodity boxes that were expected to die. Graph jobs such as <b>PageRank</b> reused MapReduce ideas but were still a separate product. Streams and machine-learning loops each had their own runtime. The paper's bet: one general compute layer so an engineer writes Scala (or later SQL/Python) once and the same cluster runs SQL, ML, graphs, and MapReduce-style jobs.",
      bullets: [
        "Libraries on that core: Spark SQL, MLlib, GraphX, plus a MapReduce-shaped API.",
        "Popularity followed generality: one onboarding story instead of four production systems.",
        "The engine must still be fast. Unifying slow systems is not a win."
      ]
    },
    {
      heading: "Why MapReduce paid in disk",
      body: "Picture a department query: employees live on shards C1, C2, C3; map each row to <code>e.name</code>; sort; reduce into one ordered list. 2010 hardware was cheap and crashy, so MapReduce <b>materialized every stage on disk</b>. Restart was possible because the last checkpoint existed. The bill was I/O after every map, extra machines for shuffle, and no way to fuse <code>map</code> then <code>filter</code> in one process. That is the right answer if RAM is scarce and jobs are one-shot batch. It is the wrong answer for a loop that rereads the same graph fifty times.",
      bullets: [
        "Fault tolerance by checkpoint: slow recovery, huge intermediate files.",
        "Each stage was a process boundary, even when the next function could have run in the same JVM.",
        "Iterative algorithms (PageRank, backprop) paid the disk tax on every round."
      ]
    },
    {
      heading: "Working sets live in memory",
      body: "Spark's move is to treat the hot intermediate as a <b>working set</b> and pin it in RAM. If a mapper dies, a replacement reads the parent partition from memory (or recomputes it) instead of from HDFS. Stages that used to be separate jobs collapse: convert <code>Employee</code> to a name on the first executor and keep going. The paper quotes about a <b>40×</b> average speedup over MapReduce and up to <b>1000×</b> on iterative workloads. If a partition does not fit, Spark <b>spills to disk</b> — worst case is MapReduce, best case is local RAM. Later releases add cache-aware layout so L1/L2/L3 matter, not only DRAM.",
      bullets: [
        "Memory is the recovery device and the speed device.",
        "You still execute the same logical operators; you drop the process-and-disk tax between them.",
        "Spill is a feature: the system degrades instead of requiring the whole dataset in one box."
      ]
    },
    {
      heading: "Spark is only the compute layer",
      body: "Berkeley needed adoption without a forklift migration. The core stays small: <b>schedule computation over memory</b>. Cluster managers (Mesos, later Kubernetes, YARN) plug in. Data sources and the network plug in. Give Spark CPU and RAM and it will run the program. That is why a 2010 lab project could sit on other people's machines."
    },
    {
      heading: "RDDs: a log of how to rebuild the bytes",
      body: "The unit of data is a <b>resilient distributed dataset (RDD)</b> — a partitioned collection plus the <i>lineage</i> of transformations that produced it (<code>map</code>, <code>filter</code>, <code>reduce</code>, …). The dataset is not a giant replicated file; it is a recipe. On failure Spark consults which partitions and which ops were involved and <b>replays the lineage</b> onto a new executor. Narrow transformations stay in one partition; a shuffle is the expensive cut. Actions (<code>reduce</code>, <code>count</code>, write) are when the DAG actually runs.",
      bullets: [
        "Prefer an executor that already holds the partition in RAM.",
        "Else pick a preferred location from data locality (keep keys that sort together on one node).",
        "Lineage replaces eager replication of every intermediate."
      ]
    },
    {
      heading: "Mesos (and friends) own the boxes",
      body: "The lecture's cluster manager is <b>Mesos</b>: a leader and followers. If spare capacity exists, Spark's job lands on a live follower. If not, the leader starts more followers, they compute, then they are released. Kubernetes does the same job with a different control plane. Spark does not care how the VM appeared — only that a process can accept tasks. That split (compute vs cluster) is the product design, not an implementation detail."
    },
    {
      heading: "What you give up",
      body: "In-memory working sets assume the hot set is smaller than fleet RAM, or that spill is rare enough. Lineage replay of a long, shuffle-heavy DAG can be slower than a recent checkpoint — production Spark still checkpoints expensive stages. A unified engine is easier to staff; it will not beat a purpose-built OLAP engine on every aggregation, which is why Dremel-class systems still exist beside Spark."
    }
  ],

  keyTerms: [
    { term: "Working set", def: "The intermediate collections a job rereads; Spark tries to keep them in RAM instead of on HDFS." },
    { term: "RDD", def: "Resilient distributed dataset: partitioned data plus the lineage of ops needed to rebuild a lost partition." },
    { term: "Lineage", def: "The log of transformations. On crash, replay it rather than restore a full checkpoint of every stage." },
    { term: "Spill", def: "When RAM is insufficient, write overflow to disk so the job still finishes at MapReduce-like cost." },
    { term: "Data locality", def: "Schedule a task on a node that already has the partition in memory or on local disk." },
    { term: "Mesos", def: "Leader/follower cluster manager that starts and releases Spark executors; Kubernetes is the same role." },
    { term: "GraphX / MLlib / SQL", def: "Libraries on the Spark core so graphs, ML, and aggregations share one runtime." }
  ],

  tradeoffs: [
    { pro: "One engine for SQL, ML, graphs, and batch: one language, one cluster, one onboarding path.", con: "A specialist (Dremel-style OLAP, a dedicated stream processor) can still win its niche." },
    { pro: "RAM working sets: ~40× typical vs MapReduce, ~1000× on iterative PageRank/ML.", con: "The hot set must mostly fit; otherwise you paid for RAM and still spill." },
    { pro: "Lineage rebuilds lost partitions without replicating every shuffle file.", con: "A long shuffle lineage can be slower to replay than a checkpointed stage." },
    { pro: "Compute-only core plugs into Mesos/K8s and existing stores.", con: "You now debug three layers: Spark DAGs, the cluster manager, and the storage system." },
    { pro: "Spill-to-disk means the worst case still completes.", con: "That worst case is MapReduce latency with extra scheduling overhead." }
  ],

  interviewTips: [
    "Name the 2010 split: Dremel, MapReduce, graph, ML — Spark is the umbrella, not a SQL engine.",
    "Contrast checkpoint-on-disk fault tolerance with RDD lineage in RAM.",
    "Quote the paper's numbers: ~40× average, up to 1000× iterative; spill equals MapReduce worst case.",
    "Say Spark owns compute only; Mesos or Kubernetes owns machines.",
    "Prefer locality: run the next op where the partition already sits in memory.",
    "If they ask GraphX vs Pregel, stay on the lecture: one Scala program, not a new cluster."
  ],

  scene: {
    nodes: [
      { id: "eng", label: "Data engineer", type: "user", pos: [-11, 0, 0] },
      { id: "dremel", label: "Dremel", type: "service", pos: [-7.5, 0, -6] },
      { id: "mr", label: "MapReduce", type: "worker", pos: [-7.5, 0, -2] },
      { id: "pr", label: "PageRank", type: "service", pos: [-7.5, 0, 2] },
      { id: "ml", label: "ML jobs", type: "worker", pos: [-7.5, 0, 6] },
      { id: "spark", label: "Spark", type: "gateway", pos: [-2, 0, 0], showAt: 1 },
      { id: "sql", label: "Spark SQL", type: "service", pos: [2.5, 0, -6], showAt: 1 },
      { id: "mllib", label: "MLlib", type: "service", pos: [2.5, 0, -2], showAt: 1 },
      { id: "graphx", label: "GraphX", type: "service", pos: [2.5, 0, 2], showAt: 1 },
      { id: "sparkmr", label: "MR API", type: "worker", pos: [2.5, 0, 6], showAt: 1 },
      { id: "disk", label: "HDFS disk", type: "storage", pos: [7, 0, -4], showAt: 2 },
      { id: "ram", label: "RAM cache", type: "cache", pos: [7, 0, 0], showAt: 3 },
      { id: "rdd", label: "RDD lineage", type: "queue", pos: [7, 0, 4], showAt: 6 },
      { id: "ex1", label: "Executor A", type: "server", pos: [11, 0, -3], showAt: 3 },
      { id: "ex2", label: "Executor B", type: "server", pos: [11, 0, 3], showAt: 3 },
      { id: "mesos", label: "Mesos", type: "lb", pos: [-2, 0, 6], showAt: 8 },
      { id: "k8s", label: "Kubernetes", type: "lb", pos: [-2, 0, -6], showAt: 8 },
      { id: "n0", label: "Four separate stacks", type: "note", pos: [-11, 0, -7.5] },
      { id: "n1", label: "One Scala program", type: "note", pos: [-11, 0, 7.5], showAt: 1 },
      { id: "n2", label: "Stage lands on disk", type: "note", pos: [11, 0, -7.5], showAt: 2 },
      { id: "n3", label: "~40x, iterative 1000x", type: "note", pos: [7, 0, -7.5], showAt: 4 },
      { id: "n4", label: "Spill = MapReduce", type: "note", pos: [0, 0, -7.5], showAt: 5 },
      { id: "n5", label: "Replay ops, not files", type: "note", pos: [7, 0, 7.5], showAt: 6 },
      { id: "n6", label: "Prefer local RAM", type: "note", pos: [11, 0, 7.5], showAt: 7 },
      { id: "n7", label: "Spark = compute only", type: "note", pos: [-5, 0, 7.5], showAt: 8 }
    ],
    edges: [
      { from: "eng", to: "dremel", label: "SQL" },
      { from: "eng", to: "mr", label: "batch" },
      { from: "eng", to: "pr", label: "graph" },
      { from: "eng", to: "ml", label: "fit" },
      { from: "eng", to: "spark", label: "job", showAt: 1 },
      { from: "spark", to: "sql", showAt: 1 },
      { from: "spark", to: "mllib", showAt: 1 },
      { from: "spark", to: "graphx", showAt: 1 },
      { from: "spark", to: "sparkmr", showAt: 1 },
      { from: "mr", to: "disk", label: "shuffle", showAt: 2 },
      { from: "spark", to: "ram", showAt: 3 },
      { from: "ram", to: "ex1", showAt: 3 },
      { from: "ram", to: "ex2", showAt: 3 },
      { from: "ram", to: "disk", label: "spill", showAt: 5, dashed: true },
      { from: "spark", to: "rdd", showAt: 6 },
      { from: "rdd", to: "ex2", label: "replay", showAt: 6, dashed: true },
      { from: "mesos", to: "ex1", showAt: 8 },
      { from: "mesos", to: "ex2", showAt: 8 },
      { from: "k8s", to: "spark", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "Four engines, four onboarding stories",
        text: "2010 analytics was a zoo. Dremel answered count/aggregate queries. MapReduce owned batch on crashy commodity boxes. PageRank and other graph jobs were their own stack. ML loops were yet another. Each team learned a different production system.",
        highlight: ["eng", "dremel", "mr", "pr", "ml", "n0"],
        flows: [
          { from: "eng", to: "dremel", color: "#60a5fa", label: "OLAP" },
          { from: "eng", to: "mr", color: "#fb923c", label: "batch" },
          { from: "eng", to: "pr", color: "#c084fc", label: "graph" }
        ]
      },
      {
        title: "One umbrella, one Scala program",
        text: "Spark puts SQL, MLlib, GraphX, and a MapReduce-shaped API on a single compute core. Write the job once. The same cluster runs aggregations, PageRank, and trainers. Generality is the adoption story.",
        highlight: ["spark", "sql", "mllib", "graphx", "sparkmr", "n1"],
        hide: ["n0"],
        flows: [
          { from: "eng", to: "spark", color: "#4ade80", label: "submit" },
          { from: "spark", to: "sql", color: "#60a5fa", label: "SQL" },
          { from: "spark", to: "graphx", color: "#c084fc", label: "GraphX" }
        ]
      },
      {
        title: "MapReduce checkpoints every stage",
        text: "A name-sort-reduce pipeline mapped employees on C1–C3, then wrote shuffle files to disk so a crash could restart. Cheap hardware plus disk checkpoints made recovery possible and every stage slow. Process boundaries sat between functions that could have shared a JVM.",
        highlight: ["mr", "disk", "n2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "mr", to: "disk", color: "#fb923c", label: "write stage" }
        ]
      },
      {
        title: "Pin the working set in RAM",
        text: "Spark keeps intermediates in executor memory. A dead mapper is replaced and rereads the parent from RAM instead of HDFS. map then filter fuse on the first box. Memory is both the speed path and the recovery path.",
        highlight: ["spark", "ram", "ex1", "ex2"],
        hide: ["n2", "n0"],
        flows: [
          { from: "spark", to: "ram", color: "#4ade80", label: "cache" },
          { from: "ram", to: "ex1", color: "#60a5fa", label: "task" },
          { from: "ram", to: "ex2", color: "#60a5fa", label: "task" }
        ]
      },
      {
        title: "40× typical, 1000× on loops",
        text: "Batch jobs see about a 40× lift because shuffle files and extra stages vanish. PageRank and backprop reread the same working set for many rounds, so the gap vs MapReduce can reach 1000×. That is the paper's headline number.",
        highlight: ["ram", "graphx", "mllib", "pr", "n3"],
        hide: ["n2", "n4"],
        flows: [
          { from: "graphx", to: "ram", color: "#c084fc", label: "iterate" },
          { from: "ram", to: "graphx", color: "#c084fc", label: "reread" }
        ]
      },
      {
        title: "Spill, and you are back at MapReduce",
        text: "If a partition will not fit, Spark overflows to disk. Worst case matches MapReduce. Best case is local RAM. The design never requires the whole dataset in one machine — it just gets slower when DRAM loses.",
        highlight: ["ram", "disk", "n4"],
        fail: ["ram"],
        hide: ["n3", "n2"],
        flows: [
          { from: "ram", to: "disk", color: "#f87171", label: "spill" }
        ]
      },
      {
        title: "RDDs are a lineage log",
        text: "An RDD is partitions plus the recipe that built them. On failure Spark reads which ops and which slices were involved and replays that lineage on a new executor. You persist a log of transformations, not a copy of every shuffle file.",
        highlight: ["rdd", "ex2", "spark", "n5"],
        fail: ["ex1"],
        hide: ["n4", "n3"],
        flows: [
          { from: "spark", to: "rdd", color: "#fb923c", label: "lineage" },
          { from: "rdd", to: "ex2", color: "#4ade80", label: "replay" }
        ]
      },
      {
        title: "Schedule where the bytes already sit",
        text: "Before launching reduce, Spark asks whether any executor already holds the partition in memory. If not, it uses data locality — keys that sort together stay in one slice. Compute moves to the cache, not the other way around.",
        highlight: ["ram", "ex1", "ex2", "n6"],
        hide: ["n5", "n4", "n7"],
        flows: [
          { from: "ram", to: "ex1", color: "#4ade80", label: "local" }
        ]
      },
      {
        title: "Mesos or Kubernetes bring the machines",
        text: "Spark does not own VMs. Mesos (leader plus followers) starts executors when capacity is short and releases them when the job ends. Kubernetes is the same plug. The core stays a compute platform: give it CPU and RAM, get results.",
        highlight: ["mesos", "k8s", "ex1", "ex2", "spark", "n7"],
        hide: ["n1", "n6", "n0"],
        flows: [
          { from: "mesos", to: "ex1", color: "#fb923c", label: "offer" },
          { from: "mesos", to: "ex2", color: "#fb923c", label: "offer" },
          { from: "k8s", to: "spark", color: "#60a5fa", label: "pods" }
        ]
      }
    ]
  }
});
