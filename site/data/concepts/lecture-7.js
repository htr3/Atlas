window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 7,
  title: "Service discovery and heartbeats in micro-services",
  video: "https://www.youtube.com/watch?v=lWE_UIbm8NA",
  category: "Advanced Concepts",
  tagline: "Half the fleet was off. Discover who is alive before you buy a million-dollar database.",
  summary: "A comedy standup: people propose Cassandra or a shard migration while half the boxes are powered off. Reliability work starts with a health service that pings S1–S3 every five seconds, marks a miss critical, and declares death on the second miss. One-way pings still leave zombies — the OS answers, the app does not, crons leak stale writes — so both sides heartbeat and a marked-dead node kills itself. Discovery is the same control plane: a profile fleet publishes IPs and HTTP/XMPP ports, the load balancer versions a snapshot of the universe, and health opens connections from the diff.",

  theory: [
    {
      heading: "The meeting that should have been a health check",
      body: "The lecture opens on a pipeline that feels slow. Ideas fly: a NoSQL cluster (Cassandra quoted at about a <b>million dollars</b>), a weeks-long shard migration, more clever storage. Then someone runs a health check and finds only <b>half the servers are on</b>. That person is promoted. The joke is the lesson: most server-side pain is <i>availability</i>, not a missing algorithm. Users return to a service that is up; revenue follows. Efficiency work on a half-dead fleet is theater."
    },
    {
      heading: "A health service and a five-second question",
      body: "Picture three boxes <code>S1</code>, <code>S2</code>, <code>S3</code>, a <b>health service</b>, and a load balancer. Health's job is to know who can take traffic. Every five seconds it asks S1 \"are you alive?\" and expects yes. The loop never ends on a healthy node. When hardware dies or a bug wedges the process, the yes stops.",
      bullets: [
        "First missed probe: mark the node <b>critical</b> — it might be a blip.",
        "Second miss: treat it as <b>dead</b>. Stop sending user requests.",
        "Ask another system to reboot the box, or start the same binary on <code>S4</code> (or a second process on the same machine — from the balancer's view it is a new instance)."
      ]
    },
    {
      heading: "The load balancer has to hear the verdict",
      body: "Declaring S1 dead is useless if the balancer still hashes clients onto it. Health (or a sibling) must publish \"S1 is out; work now lives on S4\". The balancer's pool is a <b>live set</b>, not a static list from last quarter's wiki. Until that update lands, probes and production disagree."
    },
    {
      heading: "Zombies: the machine said yes",
      body: "A nastier failure: the host answers ping, but the <i>application</i> cannot serve. Memory pressure, a stuck thread, a wedged JVM — health still hears yes. You keep routing work into a black hole. Worse, the \"dead\" node may still run <b>cron jobs</b> and push stale writes into neighbors, mutating their state. The lecture calls this the zombie problem. One-way liveness is not enough."
    },
    {
      heading: "Two-way heartbeats",
      body: "Have the service also tell health \"I am alive\" on the same five-second cadence. More packets, fewer lies: if health has marked you dead, you <b>exit</b> instead of leaking crons. Even this does not close every race — a partitioned node can still do damage in the window — but it shrinks the zombie set a lot. Application-level heartbeats beat ICMP.",
      bullets: [
        "Health → instance: are you up?",
        "Instance → health: I can still serve (or I should not).",
        "Marked dead → process suicide, not a quiet background writer."
      ]
    },
    {
      heading: "Discovery is the other half of the same picture",
      body: "A <b>profile</b> service comes up on three boxes. It must advertise: these IPs, this HTTP port, maybe a separate XMPP port. The load balancer is the directory. It <b>persists a snapshot</b> of the whole service universe and bumps a version when the profile fleet appears. Other services do not hard-code S3's address; they ask the balancer (and should <b>cache</b> the snapshot). Health watches the <i>diff</i> of that snapshot and opens HTTP probes to every new port. Discovery without health is a map of ghosts; health without discovery has no one to probe."
    },
    {
      heading: "What to add that the talk leaves implied",
      body: "Real platforms (Consul, Eureka, Kubernetes endpoints, Envoy SDS) store the same snapshot: name → instances → ports, plus a failure detector. Timeouts, consecutive-failure thresholds, and <i>grace</i> on startup (do not kill a node that is still warming) are the knobs behind \"five seconds, two misses\". Cache the snapshot, but set a TTL so a balancer partition cannot serve a fossil map forever."
    }
  ],

  keyTerms: [
    { term: "Health service", def: "A control-plane component that probes instances and decides who may receive traffic." },
    { term: "Heartbeat", def: "A periodic liveness signal — here, about every five seconds — from checker to instance or both ways." },
    { term: "Critical then dead", def: "One missed probe is a warning; two in a row remove the instance from the live set." },
    { term: "Zombie", def: "A host that answers \"up\" (or still runs crons) while the serving path is dead, leaking stale work." },
    { term: "Two-way heartbeat", def: "Health pings the app, and the app pings health; a node marked dead is expected to kill itself." },
    { term: "Service discovery", def: "Publishing where a service lives (IPs, HTTP/XMPP ports) so callers do not hard-code boxes." },
    { term: "Snapshot", def: "A versioned, persisted map of the whole fleet the balancer and health service both consume." },
    { term: "Live set", def: "The instances the load balancer will actually send clients to, updated when health changes." }
  ],

  tradeoffs: [
    { pro: "A health pass can recover more capacity than a million-dollar database project.", con: "Teams still reach for shards and NoSQL when the outage is \"half the VMs are off\"." },
    { pro: "One-way probes are simple: health asks, instances answer.", con: "The OS can say yes while the app is wedged; crons keep writing as zombies." },
    { pro: "Two-way heartbeats plus suicide on \"you are dead\" cut stale writers.", con: "Double the chatter, and a false-dead mark can take a healthy process down." },
    { pro: "A persisted snapshot lets every caller resolve profile/S3 without local config.", con: "A stale cached map sends traffic to retired IPs until the version moves." },
    { pro: "Restarting the binary on S4 (or a second process) restores the live set quickly.", con: "Until the balancer hears the verdict, clients still land on the corpse." }
  ],

  interviewTips: [
    "Open with availability, not a new database: ask how you know which instances are actually on.",
    "Describe a two-miss detector: 5s probe, critical, then dead, then rehome on S4 and update the balancer.",
    "Name zombies explicitly — ICMP up, app down, crons still mutating neighbors.",
    "Tie discovery to health: register IPs and HTTP/XMPP ports, version a snapshot, probe the diff.",
    "Say callers cache the snapshot but still treat the balancer as source of truth for the live set.",
    "If they jump to Cassandra, ask what fraction of the current fleet is healthy."
  ],

  scene: {
    nodes: [
      { id: "health", label: "Health service", type: "service", pos: [0, 0, -5] },
      { id: "lb", label: "Load balancer", type: "lb", pos: [0, 0, 0] },
      { id: "snap", label: "Snapshot store", type: "db", pos: [0, 0, 4.5], showAt: 6 },

      { id: "s1", label: "Server S1", type: "server", pos: [-7, 0, 2.5] },
      { id: "s2", label: "Server S2", type: "server", pos: [-7, 0, -2.5] },
      { id: "s3", label: "Server S3", type: "server", pos: [7, 0, 2.5] },
      { id: "s4", label: "Server S4", type: "server", pos: [7, 0, -2.5], showAt: 3 },
      { id: "cron", label: "Zombie cron", type: "worker", pos: [10.5, 0, -5], showAt: 4 },
      { id: "prof", label: "Profile svc", type: "service", pos: [-10.5, 0, 5], showAt: 6 },

      { id: "n0", label: "Half the fleet off", type: "note", pos: [-9, 4, 7.5] },
      { id: "n1", label: "Ping every 5s", type: "note", pos: [9, 4, 7.5], showAt: 1 },
      { id: "n2", label: "Miss 2 = dead", type: "note", pos: [-9, 4, -7.5], showAt: 2 },
      { id: "n3", label: "Two-way heartbeat", type: "note", pos: [9, 4, -7.5], showAt: 5 },
      { id: "n4", label: "IPs + HTTP/XMPP", type: "note", pos: [0, 4, 7.5], showAt: 6 }
    ],
    edges: [
      { from: "health", to: "s1", label: "alive?", dashed: true },
      { from: "health", to: "s2", dashed: true },
      { from: "health", to: "s3", dashed: true },
      { from: "health", to: "s4", dashed: true, showAt: 3 },
      { from: "health", to: "lb", label: "live set" },
      { from: "lb", to: "s1" },
      { from: "lb", to: "s2" },
      { from: "lb", to: "s3" },
      { from: "lb", to: "s4", showAt: 3 },
      { from: "s4", to: "cron", showAt: 4, dashed: true },
      { from: "s1", to: "health", label: "I am up", showAt: 5, dashed: true },
      { from: "prof", to: "lb", label: "register", showAt: 6 },
      { from: "lb", to: "snap", label: "version N", showAt: 6 },
      { from: "snap", to: "health", label: "diff", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Half the servers were off",
        text: "The pipeline feels slow, so the room reaches for Cassandra or a shard migration. A health check shows only 50% of boxes are powered on. Availability work beats a million-dollar efficiency project.",
        highlight: ["s1", "s2", "s3", "n0", "health"],
        fail: ["s2", "s3"],
        hide: ["n1"],
        flows: [
          { from: "health", to: "s1", color: "#4ade80", label: "on" },
          { from: "health", to: "s2", color: "#f87171", label: "off" },
          { from: "health", to: "s3", color: "#f87171", label: "off" }
        ]
      },
      {
        title: "Ask every five seconds",
        text: "Health plus a load balancer sit beside S1, S2, and S3. Every five seconds health asks \"are you alive?\" and wants yes. A healthy node answers forever; that loop is the product's uptime, not a side script.",
        highlight: ["health", "lb", "s1", "s2", "s3", "n1"],
        hide: ["n0"],
        flows: [
          { from: "health", to: "s1", color: "#4ade80", label: "alive?" },
          { from: "s1", to: "health", color: "#60a5fa", label: "yes" },
          { from: "health", to: "s2", color: "#4ade80", label: "alive?" }
        ]
      },
      {
        title: "Critical, then dead",
        text: "S1 hits a hardware fault or a bug and stops answering. One missed probe marks it critical. A second miss means dead: stop sending user traffic, and plan a restart or a move.",
        highlight: ["health", "s1", "n2"],
        fail: ["s1"],
        hide: ["n0"],
        flows: [
          { from: "health", to: "s1", color: "#f87171", label: "miss 1" },
          { from: "health", to: "s1", color: "#f87171", label: "miss 2" }
        ]
      },
      {
        title: "Rehome on S4, tell the balancer",
        text: "Bring the same binary up on S4 (or a second process on the old machine — the balancer still sees a new instance). Publish \"S1 is out\" so the live set changes. Until that message lands, clients still hit a corpse.",
        highlight: ["s4", "lb", "health", "s1"],
        fail: ["s1"],
        hide: ["n0", "n1"],
        flows: [
          { from: "health", to: "lb", color: "#fb923c", label: "S1 dead" },
          { from: "lb", to: "s4", color: "#4ade80", label: "pool +" }
        ]
      },
      {
        title: "The zombie still has crons",
        text: "The host can keep saying yes while the app cannot serve. Worse, leftover cron jobs on a \"dead\" S4 still push stale writes into neighbors and corrupt their state. ICMP is not an application heartbeat.",
        highlight: ["s4", "cron", "s2", "health"],
        fail: ["s4"],
        hide: ["n0", "n2"],
        flows: [
          { from: "s4", to: "health", color: "#4ade80", label: "OS yes" },
          { from: "cron", to: "s2", color: "#f87171", label: "stale write" }
        ]
      },
      {
        title: "Beat both directions, then exit",
        text: "S4 also pings health every five seconds. More chatter, fewer lies. If health has marked the node dead, the process kills itself instead of leaking jobs. Races remain, but the zombie window shrinks.",
        highlight: ["health", "s4", "s1", "s2", "n3"],
        hide: ["n0", "n1"],
        flows: [
          { from: "health", to: "s4", color: "#4ade80", label: "alive?" },
          { from: "s4", to: "health", color: "#60a5fa", label: "I am up" },
          { from: "health", to: "s4", color: "#f87171", label: "you are dead" }
        ]
      },
      {
        title: "Register IPs and ports",
        text: "A profile service comes up on three boxes and tells the balancer its IPs, HTTP port, and maybe a separate XMPP port. Callers should not hard-code S3. Discovery and health are one control plane.",
        highlight: ["prof", "lb", "s1", "s2", "s3", "n4"],
        hide: ["n0", "n2", "n3"],
        flows: [
          { from: "prof", to: "lb", color: "#4ade80", label: "IPs+ports" },
          { from: "lb", to: "s1", color: "#60a5fa", label: "HTTP" }
        ]
      },
      {
        title: "Version the universe, probe the diff",
        text: "The balancer persists snapshot N of every service. Other processes cache that map and ask when they must talk to profile/S3. Health reads the diff, opens HTTP probes on new ports, and keeps the live set honest.",
        highlight: ["lb", "snap", "health", "prof", "n4"],
        hide: ["n0", "n2"],
        flows: [
          { from: "lb", to: "snap", color: "#c084fc", label: "version N" },
          { from: "snap", to: "health", color: "#fb923c", label: "diff" },
          { from: "health", to: "s1", color: "#4ade80", label: "probe HTTP" }
        ]
      }
    ]
  }
});
