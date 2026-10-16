window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 23,
  title: "Regions, CI/CD, Deployment Strategies, and Serverless",
  video: "",
  category: "Cloud and Architecture",
  tagline: "Ship through a pipeline, roll out with a blast radius, and pick a region story before you pick a runtime.",
  summary: "A region is an independent failure domain with several availability zones. CI/CD turns a Git commit into a tested image and a controlled rollout. Rolling, blue-green, and canary change how much traffic sees a bad build. Serverless (functions, Spring Cloud Function on Lambda) fits bursty, short work; a always-on Deployment fits a steady Spring API with a connection pool. None of these replace backups, feature flags, or a one-command rollback.",

  theory: [
    {
      heading: "Regions, zones, and what actually fails together",
      body: "An <b>availability zone</b> is a datacenter (or campus) with its own power and network. A <b>region</b> is a cluster of zones with a private backbone. Putting three Spring pods in one zone is not high availability: the building can still go dark. Spreading a Deployment across zones is the default. Multi-region is a different product: higher RTT, replicated data, and a DNS or anycast story for failover. RPO and RTO from the reliability lessons decide whether you need warm standbys in a second region or only multi-AZ in one. \"us-east-1\" is not a strategy; \"lose one AZ, stay up; lose the region, 15 minute failover\" is.",
      bullets: [
        "AZ-redundant load balancers and databases are the table stakes.",
        "A second region without data replication is a second place to be down.",
        "Latency budgets: a chatty Spring call chain across continents will miss SLOs even when both regions are healthy."
      ]
    },
    {
      heading: "CI is proof. CD is a path to production.",
      body: "CI (continuous integration) compiles, unit-tests, and builds the image on every commit. A red pipeline must block merge. CD (continuous delivery or deployment) takes that artifact through staging, migrations, and prod. The artifact is the image digest, not \"whatever is on main at 4 p.m.\" Spring tests should include a Flyway/Liquibase migration against a throwaway Postgres. Deploying schema changes that the old pods cannot read is how a rolling update bricks the fleet. Keep migrations backward compatible for one generation of pods: expand, roll, then contract.",
      bullets: [
        "Build once. Promote the same digest. Do not rebuild for prod.",
        "Secrets in CI are vault roles, not a .env committed for convenience.",
        "A pipeline that can deploy but cannot roll back is a one-way trap."
      ]
    },
    {
      heading: "Rolling, blue-green, and canary",
      body: "A <b>rolling</b> update replaces pods in batches. Cheap, mixed versions live together, so APIs and schemas must be compatible. <b>Blue-green</b> keeps two full environments; you flip the load balancer. Fast rollback, double the compute, and you must drain in-flight work. A <b>canary</b> sends 1–5% of traffic (or internal users) to the new revision, watches error rate and p99, then ramps. Spring Boot with Kubernetes: a second Deployment or a service mesh weight, plus Micrometer metrics keyed by version. Feature flags decouple \"code is in prod\" from \"users see the behavior,\" which is the safer canary for risky product changes.",
      bullets: [
        "Rollback is a first-class deploy: the previous digest, not a hotfix invented at 2 a.m.",
        "Canary without automated abort is a dashboard you will ignore.",
        "Sticky sessions make canaries lie: one unlucky user owns the bad pod."
      ]
    },
    {
      heading: "Serverless is a billing and isolation choice",
      body: "A function platform (Lambda, Cloud Functions, Cloud Run jobs) starts your code on a request, bills for duration, and scales to zero. <b>Spring Cloud Function</b> can package a bean as a handler, but a fat JVM plus Hibernate plus a Hikari pool is a poor 200 ms request: cold start and connection storms dominate. Serverless fits glue (resize an image, fire a webhook), sporadic admin jobs, and APIs that are truly idle at night. A steady 2000 QPS Spring API with a database is cheaper and saner as always-on pods. Time limits, payload sizes, and no inbound persistent TCP are the real constraints, not the marketing name.",
      bullets: [
        "Cold start: first request pays JVM + Spring context. Provisioned concurrency buys it back.",
        "Each concurrent Lambda may open a DB connection. The pool is the fleet.",
        "Idempotency still matters: platforms retry."
      ]
    },
    {
      heading: "Wire the four together in one design",
      body: "Git commit → CI image → deploy to a staging namespace in the same region as prod → canary 5% in two AZs → full rolling. A second region is a separate pipeline promotion, not an afterthought DNS toggle. Serverless sits beside the cluster for event work (S3 fan-out, cron that should not live in a random pod). Health of the deploy is SLOs, not a green Kubernetes rollout: a rollout can succeed while p99 doubles. Keep the previous Helm/Kustomize revision. Keep the database migration reversible or additive. That is the whole lecture in one path.",
      bullets: [
        "Multi-AZ first. Multi-region only with a data plan.",
        "Canary on version-tagged metrics.",
        "Serverless for spikes and glue; pods for the core API."
      ]
    }
  ],

  keyTerms: [
    { term: "Region", def: "A geographic failure domain made of several availability zones." },
    { term: "Availability zone", def: "An isolated datacenter inside a region. Lose one without losing the region." },
    { term: "CI", def: "Build and test every commit. The output is an immutable artifact." },
    { term: "CD", def: "The path that promotes that artifact toward production with gates." },
    { term: "Rolling deploy", def: "Replace instances in batches so old and new run together for a while." },
    { term: "Blue-green", def: "Two full stacks; flip traffic. Rollback is a flip back." },
    { term: "Canary", def: "A small slice of traffic on the new version, with an abort on SLO burn." },
    { term: "Serverless", def: "The platform starts your handler per event, scales to zero, and bills duration." },
    { term: "Expand/contract", def: "Add a compatible schema first, deploy code, then remove the old column." }
  ],

  tradeoffs: [
    { pro: "Multi-AZ Deployments survive a datacenter fire.", con: "Cross-AZ data transfer and a slightly harder mental model of 'where is this pod.'" },
    { pro: "Canaries catch a bad digest on 5% of users.", con: "You need versioned metrics, a bake time, and the nerve to abort." },
    { pro: "Blue-green rollback is instant at the load balancer.", con: "You pay for two environments and must drain connections cleanly." },
    { pro: "Serverless removes idle capacity for spiky jobs.", con: "Cold starts, time limits, and a connection-per-invoke tax on the database." }
  ],

  interviewTips: [
    "Define AZ versus region. Multi-AZ is the default; multi-region needs a replication story.",
    "Build once, promote the digest. Never 'rebuild for prod.'",
    "Compare rolling, blue-green, and canary by blast radius and rollback, not by buzzwords.",
    "Say schema expand/contract so mixed versions during a roll do not brick the API.",
    "Put serverless on bursty glue, not on a chatty Spring service with a connection pool, unless you can defend cold start and DB connections."
  ],

  scene: {
    nodes: [
      { id: "dev", label: "Git main", type: "user", pos: [-11, 0, 0] },
      { id: "ci", label: "CI pipeline", type: "worker", pos: [-7, 0, 0] },
      { id: "reg", label: "Image digest", type: "storage", pos: [-3, 0, 0] },
      { id: "stg", label: "Staging", type: "server", pos: [-3, 0, 4], showAt: 1 },
      { id: "regz", label: "Region us-east", type: "zone", pos: [5.5, 0, 0.8], size: [12, 12], showAt: 2 },
      { id: "az1", label: "AZ a", type: "zone", pos: [3, 0, -2.2], size: [5, 4], showAt: 2 },
      { id: "az2", label: "AZ b", type: "zone", pos: [8.5, 0, -2.2], size: [5, 4], showAt: 2 },
      { id: "blue", label: "Blue v12", type: "server", pos: [3, 0, -2.2], showAt: 2 },
      { id: "canary", label: "Canary v13", type: "server", pos: [8.5, 0, -2.2], showAt: 3 },
      { id: "lb", label: "Region LB", type: "lb", pos: [5.5, 0, 2.6], showAt: 2 },
      { id: "fn", label: "Lambda glue", type: "worker", pos: [5.5, 0, 5.5], showAt: 6 },
      { id: "user", label: "Clients", type: "phone", pos: [-11, 0, 2.6], showAt: 4 },
      { id: "n0", label: "Build once, promote digest", type: "note", pos: [-7, 0, -6] },
      { id: "n1", label: "5% then abort on p99", type: "note", pos: [8.5, 0, -6], showAt: 3 },
      { id: "n2", label: "Scale to zero for bursts", type: "note", pos: [5.5, 0, 7.6], showAt: 6 }
    ],
    edges: [
      { from: "dev", to: "ci" },
      { from: "ci", to: "reg", label: "digest" },
      { from: "reg", to: "stg", showAt: 1 },
      { from: "reg", to: "canary", showAt: 3 },
      { from: "user", to: "lb", showAt: 4 },
      { from: "lb", to: "blue", showAt: 2 },
      { from: "lb", to: "canary", showAt: 3 },
      { from: "lb", to: "fn", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "CI produces a digest",
        text: "A commit on main builds, tests, and pushes one image digest. That digest is the only thing later environments are allowed to run. Rebuilding for prod would sneak in a different jar.",
        highlight: ["dev", "ci", "reg", "n0"],
        flows: [
          { from: "dev", to: "ci", color: "#4ade80", label: "commit" },
          { from: "ci", to: "reg", color: "#c084fc", label: "sha256" }
        ]
      },
      {
        title: "Staging is a real promote",
        text: "The same digest deploys to staging. Flyway runs an additive migration the old prod pods could still read. A failed staging gate never touches the region load balancer.",
        highlight: ["reg", "stg"],
        flows: [{ from: "reg", to: "stg", color: "#60a5fa", label: "promote" }]
      },
      {
        title: "Prod lives in two AZs",
        text: "Blue v12 already serves in AZ a and AZ b behind a regional load balancer. One zone can disappear. This is not multi-region. It is the default HA story for a Spring API.",
        highlight: ["regz", "az1", "az2", "blue", "lb"],
        flows: [{ from: "lb", to: "blue", color: "#4ade80", label: "100%" }]
      },
      {
        title: "Canary a slice",
        text: "v13 starts in AZ b and takes 5% of traffic. Version-tagged Micrometer p99 and error rate must stay inside the SLO. Sticky sessions would pin unlucky users to the canary and hide the rest.",
        highlight: ["canary", "lb", "n1", "blue"],
        flows: [
          { from: "lb", to: "blue", color: "#4ade80", label: "95%" },
          { from: "lb", to: "canary", color: "#fb923c", label: "5%" }
        ]
      },
      {
        title: "Users are the test",
        text: "Real clients hit the regional LB. If the canary burns the error budget, abort: weight back to blue. A green Kubernetes rollout that doubled latency is still a failed deploy.",
        highlight: ["user", "lb", "canary", "blue"],
        flows: [{ from: "user", to: "lb", color: "#4ade80", label: "HTTPS" }]
      },
      {
        title: "Bad canary, flip back",
        text: "p99 explodes on v13. Rollback is shifting weight to blue, not writing a hotfix on the canary. The previous digest is still running. That is why you never delete v12 until v13 is done baking.",
        highlight: ["canary", "blue", "lb"],
        fail: ["canary"],
        flows: [
          { from: "lb", to: "blue", color: "#4ade80", label: "100%" },
          { from: "user", to: "lb", color: "#f87171", label: "abort" }
        ]
      },
      {
        title: "Serverless beside the cluster",
        text: "An image-resize or webhook job does not need three always-on pods. A Lambda/Spring Cloud Function scales from zero. The core API stays on the Deployment: connection pools and a steady QPS do not love cold starts.",
        highlight: ["fn", "n2", "lb"],
        flows: [{ from: "lb", to: "fn", color: "#c084fc", label: "event" }]
      },
      {
        title: "Promote when the bake is clean",
        text: "After the canary holds, roll v13 across both AZs. Multi-region remains a later promotion with replicated data, not a DNS trick. CI/CD, AZ spread, and runtime choice are one design.",
        highlight: ["canary", "blue", "az1", "az2", "reg"],
        flows: [
          { from: "reg", to: "canary", color: "#4ade80", label: "full roll" },
          { from: "lb", to: "canary", color: "#4ade80", label: "100%" }
        ]
      }
    ]
  }
});
