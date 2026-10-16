window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 17,
  title: "Active-Active Failover, RTO, and RPO",
  video: "",
  category: "Reliability and Security",
  tagline: "RTO is how long you are down. RPO is how much data you lose. Architecture follows those two numbers.",
  summary: "Disaster recovery is not \"we have a replica.\" Recovery Time Objective is the outage you are willing to have; Recovery Point Objective is the data you are willing to lose. Active-passive keeps a warm standby and pays failover minutes. Active-active serves traffic in two regions at once and pays conflict, replication lag, and double cost. DNS and load balancers fail over clients; databases fail over writes. Split-brain is the failure mode of pretending both regions are primary without a rule. Spring apps should treat region as a first-class routing key, not as a config comment.",

  theory: [
    {
      heading: "RTO and RPO are requirements, not features",
      body: "<b>RTO</b> (recovery time objective) is the maximum acceptable gap between failure and useful service: 8 hours, 15 minutes, 30 seconds. It includes detection, failover, DNS TTL, connection warmup, and \"the on-call found the page.\" <b>RPO</b> (recovery point objective) is the maximum acceptable data loss measured backward from the failure: 24 hours of backups, 5 minutes of binlogs, or zero if every commit was synchronously replicated. An interview design that says \"multi-AZ\" without numbers is a vibe. These two numbers pick backups versus streaming replicas versus dual writes. They also pick the budget: RPO 0 plus RTO 0 is active-active with synchronous commit, and it is expensive.",
      bullets: [
        "RTO is time to serve. RPO is time of data you may throw away.",
        "Detection time counts; a replica nobody failed over to is not recovery.",
        "Write down RTO/RPO per use case (payments vs analytics)."
      ]
    },
    {
      heading: "Active-passive: one writer, a standing spare",
      body: "Region A takes all writes. Region B has a replica (async streaming, or periodic snapshots). On disaster you promote B, point DNS or the global balancer at B, and drain A. RPO is roughly the replication lag at the cut. RTO is health-check interval + TTL + app cache flush + maybe a human. Warm standby (replica caught up, app pool already running) beats cold (restore from backup). Pilot light is a tiny B that you scale out during failover. Spring: keep the JDBC URL behind a virtual hostname that can move; do not hard-code <code>us-east-1.rds.amazonaws.com</code> in four services. Flyway migrations must be compatible with the replica you might promote mid-release.",
      bullets: [
        "Async replica: lower write latency, nonzero RPO.",
        "Synchronous replica: RPO near 0, write waits on the other AZ/region.",
        "Test failover. An untested runbook is fiction."
      ]
    },
    {
      heading: "Active-active: both regions take traffic",
      body: "Users in Mumbai hit Mumbai; users in Virginia hit Virginia. Reads are local and fast. Writes either go to a global primary (that's active-active for reads only) or to a local primary with replication both ways (true multi-primary). Multi-primary needs conflict rules: last-writer-wins, CRDTs, or \"this key is sticky to a region.\" Active-active without those rules is split-brain on a good day. Stateless Spring pods are easy to run twice; the database, the message bus, and the session store are not. Global tables (Dynamo, Spanner, Cockroach, Cosmos) exist because rolling your own bi-directional MySQL is how you lose rows.",
      bullets: [
        "Sticky keys (userId % region) avoid most conflicts at the cost of uneven load.",
        "Sessions in a regional Redis mean a failed-over user looks logged out unless you replicate sessions.",
        "Exactly-once jobs must not run in both regions."
      ]
    },
    {
      heading: "How clients actually move",
      body: "Failover is a client-routing problem as much as a database one. DNS with a 60s TTL means a 60s RTO floor for clients that cache. Anycast or a global L7 (CloudFront, Cloudflare, a GSLB) can shift faster. Health checks must fail the region, not one instance. Connection pools in HikariCP will keep talking to a dead VIP until you evict; set validation timeouts. Mobile apps cache IPs aggressively — have a second endpoint. During failover, load-shed (next lecture) so the surviving region does not die under 2× traffic.",
      bullets: [
        "TTL, health-check interval, and pool timeout all add to RTO.",
        "Failing over reads is easier than failing over writes.",
        "Practice region evacuation, not only instance replacement."
      ]
    },
    {
      heading: "Split-brain and fencing, again",
      body: "If A was not actually dead — network partition — and you promote B, both primaries accept writes. That is the clock/partition lecture applied to DR. Use fencing: STONITH the old primary, or require a generation number in every write, or let a quorum of a third site decide. Active-active multi-primary is split-brain as a lifestyle; you must merge. Backups are not fencing: restoring yesterday's dump onto a still-live primary is how you rewind money.",
      bullets: [
        "Promote only when you can fence the old writer.",
        "Keep a write generation in the data, not only in DNS.",
        "RPO 0 does not mean conflict-free if two primaries existed."
      ]
    },
    {
      heading: "A practical ladder",
      body: "Nightly snapshots: RPO hours, RTO hours. WAL shipping: RPO minutes. Async cross-region replica + rehearsed promote: RPO seconds–minutes, RTO minutes. Multi-AZ sync commit: RPO ~0 for AZ loss, not for region loss. Two-region active-active with conflict-free data or a global commit service: RTO near 0 for a region, cost and complexity jump. Pick the step that matches the business number, then design the Spring service to survive that failover (stateless pods, external sessions, idempotent consumers, no in-memory unique jobs).",
      bullets: [
        "Stateless app + sticky data is the usual honest split.",
        "Chaos: pull the region plug in staging and time RTO/RPO with a stopwatch.",
        "Document the degraded product: read-only mode beats a 500 loop."
      ]
    }
  ],

  keyTerms: [
    { term: "RTO", def: "Recovery time objective: how long service may stay unavailable after a failure." },
    { term: "RPO", def: "Recovery point objective: how much committed data you may lose, measured in time." },
    { term: "Active-passive", def: "One region serves; a standby is promoted on disaster." },
    { term: "Active-active", def: "Two or more regions serve traffic at once; writes need a conflict story." },
    { term: "Warm standby", def: "Replica and app pool already running; failover is promote + reroute, not restore." },
    { term: "Pilot light", def: "Minimal spare that you scale out during recovery to save idle cost." },
    { term: "GSLB", def: "Global server load balancing (DNS or anycast) that shifts clients between regions." },
    { term: "Replication lag", def: "The time (or LSN gap) between a primary commit and its appearance on a replica — your practical RPO." }
  ],

  tradeoffs: [
    { pro: "Active-passive is operationally simpler and cheaper at idle.", con: "RTO includes failover work; the standby can be silently broken if never promoted." },
    { pro: "Active-active keeps regional latency low and RTO near zero for a single-region loss.", con: "Double infra cost plus conflict resolution or sticky-key constraints." },
    { pro: "Synchronous replication drives RPO toward zero.", con: "Every write waits on the remote region; a slow link becomes an outage." },
    { pro: "Async replication keeps the primary fast.", con: "A region loss loses the lag window of data." },
    { pro: "DNS failover is universally understood.", con: "TTLs and sticky resolvers add minutes that your RTO may not allow." }
  ],

  interviewTips: [
    "Ask for RTO and RPO before drawing a second region. Those numbers pick the pattern.",
    "Separate app failover (pods, DNS) from data failover (promote, RPO).",
    "If you say active-active, name the conflict rule or the sticky key in the same breath.",
    "Add detection, DNS TTL, and connection-pool eviction into the RTO arithmetic.",
    "Mention fencing the old primary so DR does not become split-brain."
  ],

  scene: {
    nodes: [
      { id: "users", label: "Users", type: "user", pos: [-11, 0, 0] },
      { id: "dns", label: "GSLB / DNS", type: "lb", pos: [-6, 0, 0] },
      { id: "regA", label: "Region A", type: "zone", pos: [1, 0, -4], size: [10, 7] },
      { id: "regB", label: "Region B", type: "zone", pos: [1, 0, 4], size: [10, 7] },
      { id: "aApp", label: "App A", type: "server", pos: [-1, 0, -4] },
      { id: "aDb", label: "Primary A", type: "db", pos: [4, 0, -4] },
      { id: "bApp", label: "App B", type: "server", pos: [-1, 0, 4] },
      { id: "bDb", label: "Replica B", type: "db", pos: [4, 0, 4] },
      { id: "nRpo", label: "RPO = replica lag", type: "note", pos: [4, 0, 0], showAt: 1 },
      { id: "nRto", label: "RTO = detect + DNS + drain", type: "note", pos: [-6, 0, -5], showAt: 3 },
      { id: "bak", label: "Nightly backup", type: "storage", pos: [10, 0, -4], showAt: 1 },
      { id: "nAA", label: "both write: need a merge rule", type: "note", pos: [10, 0, 4], showAt: 6 }
    ],
    edges: [
      { from: "users", to: "dns" },
      { from: "dns", to: "aApp" },
      { from: "aApp", to: "aDb" },
      { from: "aDb", to: "bDb", label: "replicate", dashed: true },
      { from: "dns", to: "bApp", showAt: 4 },
      { from: "bApp", to: "bDb", showAt: 4 },
      { from: "aDb", to: "bak", showAt: 1, dashed: true }
    ],
    steps: [
      {
        title: "Today: one live region",
        text: "Users resolve to Region A. App A writes Primary A. Region B exists on a slide. This is not DR until B can serve.",
        highlight: ["users", "dns", "aApp", "aDb", "regA"],
        flows: [
          { from: "users", to: "dns", color: "#4ade80" },
          { from: "dns", to: "aApp", color: "#4ade80" },
          { from: "aApp", to: "aDb", color: "#4ade80", label: "write" }
        ]
      },
      {
        title: "RPO is the copy you still have",
        text: "Nightly backup: RPO up to 24h. Streaming replica: RPO ≈ lag. If A burns now, you lose everything not yet on B or in the dump. That gap is the requirement you are buying.",
        highlight: ["aDb", "bDb", "bak", "nRpo"],
        flows: [
          { from: "aDb", to: "bDb", color: "#c084fc", label: "async" },
          { from: "aDb", to: "bak", color: "#c084fc", label: "nightly" }
        ]
      },
      {
        title: "Region A dies",
        text: "AZ or region failure. App A and Primary A are gone. Clients still hammer the old VIP until something moves them. Detection has not even finished.",
        highlight: ["regA", "users", "dns"],
        fail: ["aApp", "aDb"],
        flows: [{ from: "dns", to: "aApp", color: "#f87171", label: "timeout" }]
      },
      {
        title: "RTO starts now",
        text: "Detect, fence A, promote B, flip DNS/GSLB, evict pools. Each step is minutes you promised in the RTO. Untested promotion is how RTO becomes an afternoon.",
        highlight: ["nRto", "dns", "bDb", "bApp"],
        fail: ["aApp", "aDb"],
        flows: [{ from: "aDb", to: "bDb", color: "#f87171", label: "cut" }]
      },
      {
        title: "Active-passive promote",
        text: "Replica B becomes primary. GSLB sends users to App B. You lost the lag window of writes (RPO) and the failover minutes (RTO). Passive B must have been healthy.",
        highlight: ["bApp", "bDb", "dns", "users", "regB"],
        fail: ["aApp", "aDb"],
        flows: [
          { from: "users", to: "dns", color: "#4ade80" },
          { from: "dns", to: "bApp", color: "#4ade80" },
          { from: "bApp", to: "bDb", color: "#4ade80", label: "promoted" }
        ]
      },
      {
        title: "Surviving region takes 2x",
        text: "All users now land on B. Without headroom or load shedding, B dies too. DR capacity is part of RTO; a half-sized standby is a second outage.",
        highlight: ["bApp", "bDb", "users"],
        fail: ["aApp", "aDb"],
        flows: [
          { from: "dns", to: "bApp", color: "#fb923c", label: "2x" },
          { from: "bApp", to: "bDb", color: "#fb923c" }
        ]
      },
      {
        title: "Active-active: both take writes",
        text: "GSLB splits users by geo. Both databases accept writes and replicate both ways. Latency is great. Conflicts are now a product: merge, sticky keys, or a global committer.",
        highlight: ["aApp", "bApp", "aDb", "bDb", "nAA"],
        flows: [
          { from: "dns", to: "aApp", color: "#4ade80" },
          { from: "dns", to: "bApp", color: "#4ade80" },
          { from: "aDb", to: "bDb", color: "#c084fc" },
          { from: "bDb", to: "aDb", color: "#c084fc" }
        ]
      },
      {
        title: "Pick numbers, then topology",
        text: "RPO 24h → backups. RPO seconds → streaming replica. RTO ~0 for a region → active-active and paid-for headroom. Fencing the old primary keeps failover from becoming two primaries.",
        highlight: ["nRpo", "nRto", "dns", "regA", "regB"],
        flows: [
          { from: "users", to: "dns", color: "#60a5fa" },
          { from: "aDb", to: "bDb", color: "#c084fc", label: "lag=RPO" }
        ]
      }
    ]
  }
});
