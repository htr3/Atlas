window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 26,
  title: "The Twelve-Factor App",
  category: "Service Patterns",
  tagline: "A checklist for processes you can move: config in the environment, state in a backing service, logs on stdout.",
  summary: "The twelve-factor app is a set of rules for software that runs as many identical processes. Code is in revision control, dependencies are declared, config is environment variables, and backing services such as the database are attached resources. Processes are stateless and disposable. Logs are an event stream, not a file you SSH to read. The list is old and still the right answer when someone asks how a service should be deployed.",

  theory: [
    {
      heading: "Code, dependencies, and config are three different things",
      body: "One codebase tracks many deploys (staging, prod), not a fork per environment. Dependencies are declared (a lockfile, a manifest) and isolated — the server image does not \"just have\" a library because someone apt-installed it once. <b>Config</b> that changes between deploys — database URLs, credentials, feature hosts — lives in the environment, not in a <code>config-prod.js</code> committed next to the code. Secrets in git are the smell this rule exists to stop.",
      bullets: [
        "I. Codebase. II. Dependencies. III. Config.",
        "If you have to rebuild the binary to point at a different database, config leaked into code.",
        "The same artifact should be what you tested and what you shipped."
      ]
    },
    {
      heading: "Backing services and the build/release/run split",
      body: "The database, the queue, and the mail provider are <b>attached resources</b>, reached by a URL. Swapping a local Postgres for a managed one is a config change, not a code change. Build turns the repo into an artifact. Release combines that artifact with a config. Run starts processes from the release. You do not edit code on the server. A rollback is \"start the previous release,\" not \"git checkout on the box.\"",
      bullets: [
        "IV. Backing services. V. Build, release, run.",
        "VI. Processes: the app is one or more stateless processes.",
        "Session data and files do not live on the local disk of one machine."
      ]
    },
    {
      heading: "Ports, concurrency, and disposability",
      body: "The process binds a port and is self-contained; a platform routes to it. Scale by running more processes (processes, not threads hidden inside one sacred VM). Processes start fast and shut down when they receive SIGTERM, finishing or returning the current request. That is what makes a rolling deploy and an autoscaler possible. A process that takes ten minutes to boot, or that corrupts data when killed, cannot be treated as cattle.",
      bullets: [
        "VII. Port binding. VIII. Concurrency. IX. Disposability.",
        "Horizontal scale is \"more processes,\" which only works if none of them owns exclusive local state.",
        "Graceful shutdown drains requests; it does not rely on a human draining a server."
      ]
    },
    {
      heading: "Dev/prod parity, logs, and admin tasks",
      body: "Keep development, staging, and production as similar as you can: same backing-service types, not a toy database in dev and a different engine in prod. Treat <b>logs as a stream</b> of events on stdout. The platform ships them to a store. The app does not manage log rotation. One-off admin jobs (a migration, a backfill) run as a process in the same environment, with the same release, not as a shell session someone remembers.",
      bullets: [
        "X. Dev/prod parity. XI. Logs. XII. Admin processes.",
        "stdout plus a collector beats SSH and a file on one disk.",
        "A migration is a release task, reviewed like code, not a Friday-night psql."
      ]
    }
  ],

  keyTerms: [
    { term: "Twelve-factor", def: "A set of twelve rules for building apps that deploy as stateless processes on a platform." },
    { term: "Config in the environment", def: "Anything that varies by deploy (hosts, secrets) is injected, not compiled in." },
    { term: "Backing service", def: "A resource reached over the network, such as a database or queue, treated as an attachment." },
    { term: "Release", def: "A build artifact plus a specific config. Run executes a release; it does not assemble one." },
    { term: "Log stream", def: "The process writes events to stdout. Aggregation is the platform's job." }
  ],

  tradeoffs: [
    { pro: "The same artifact runs in every environment, so prod is what you tested.", con: "Strict parity is work: teams sneak a lighter database into dev and rediscover the bug in prod." },
    { pro: "Stateless processes scale and die without a ceremony.", con: "Anything you used to store on local disk must move to a real store, which is slower to build." },
    { pro: "Environment config keeps secrets out of git.", con: "Someone still has to manage those variables, and a missing one fails at startup." },
    { pro: "stdout logs can be tailed, shipped, and searched.", con: "If the collector is down, the platform must buffer or you lose the stream." }
  ],

  interviewTips: [
    "You do not need to recite all twelve in order. Group them: config, stateless processes, logs, attached databases.",
    "Say the binary does not change between staging and prod; the environment does.",
    "Local disk is not a session store and not a log archive.",
    "Admin migrations run as a one-off process of the same release, not a hand-edited server.",
    "Connect it to containers: disposability and port binding are why a scheduler can move the process."
  ],

  scene: {
    nodes: [
      { id: "repo", label: "Codebase", type: "storage", pos: [-9, 0, 0] },
      { id: "build", label: "Build", type: "worker", pos: [-5, 0, -2] },
      { id: "rel", label: "Release", type: "service", pos: [-1, 0, 0], showAt: 1 },
      { id: "env", label: "Env config", type: "note", pos: [-1, 0, 3.2], showAt: 1 },
      { id: "p1", label: "Process", type: "server", pos: [4, 0, -2.5], showAt: 2 },
      { id: "p2", label: "Process", type: "server", pos: [4, 0, 2.2], showAt: 3 },
      { id: "db", label: "Postgres", type: "db", pos: [8.5, 0, 0], showAt: 2 },
      { id: "logs", label: "Log collector", type: "queue", pos: [4, 0, -6], showAt: 4 }
    ],
    edges: [
      { from: "repo", to: "build" },
      { from: "build", to: "rel", showAt: 1 },
      { from: "env", to: "rel", label: "config", showAt: 1 },
      { from: "rel", to: "p1", showAt: 2 },
      { from: "rel", to: "p2", showAt: 3 },
      { from: "p1", to: "db", showAt: 2 },
      { from: "p2", to: "db", showAt: 3 },
      { from: "p1", to: "logs", label: "stdout", showAt: 4 }
    ],
    steps: [
      {
        title: "Build an artifact once",
        text: "The repo declares its dependencies. The build produces one artifact. You do not recompile to aim it at production.",
        highlight: ["repo", "build"],
        flows: [{ from: "repo", to: "build", color: "#60a5fa", label: "build" }]
      },
      {
        title: "Release equals artifact plus config",
        text: "Database URL and secrets come from the environment. The release is that pairing. Staging and prod can run the same bits with different config.",
        highlight: ["build", "rel", "env"],
        flows: [
          { from: "build", to: "rel", color: "#4ade80", label: "artifact" },
          { from: "env", to: "rel", color: "#facc15", label: "env" }
        ]
      },
      {
        title: "A process with no local souvenirs",
        text: "The process binds a port and keeps sessions and rows in Postgres, an attached resource. Killing the process loses nothing that was only on its disk.",
        highlight: ["rel", "p1", "db"],
        flows: [{ from: "p1", to: "db", color: "#c084fc", label: "SQL" }]
      },
      {
        title: "Scale by adding a process",
        text: "A second identical process serves more traffic. Neither owns a private file of user sessions. The platform can SIGTERM either of them.",
        highlight: ["p1", "p2", "db", "rel"],
        flows: [{ from: "rel", to: "p2", color: "#4ade80", label: "run" }]
      },
      {
        title: "Logs leave as a stream",
        text: "The process writes to stdout. A collector ships the stream. You do not SSH in to rotate a file, and a one-off migration runs as another process of this same release.",
        highlight: ["p1", "logs"],
        flows: [{ from: "p1", to: "logs", color: "#fb923c", label: "stdout" }]
      }
    ]
  }
});
