window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 9,
  title: "How to Avoid a Single Point of Failure",
  video: "https://www.youtube.com/watch?v=-BOysyYErLY",
  category: "Fundamentals",
  tagline: "If one crash can take the system with it, copy that hop and keep walking upstream.",
  summary: "A single point of failure is any component whose death darkens the whole product. The lecture walks the chain: extra service nodes, database replicas (failure probability P becomes P squared), master-slave reads, redundant load balancers, DNS with several IPs, then extra regions against a data-center asteroid. Coordinators get the same treatment. Netflix Chaos Monkey is how you prove the paper design actually fails open.",

  theory: [
    {
      heading: "What SPOF means",
      body: "If component X dies and the product dies with it, X is a <b>single point of failure</b>. A lone database behind a farm of servers is the textbook picture. The idea is older than computers: if Earth takes an asteroid, humanity has nowhere else to stand. In interviews this is a late-game question. First you meet functional requirements; then the interviewer starts killing boxes to test whether the drawing is resilient.",
      bullets: [
        "SPOF = one crash, total outage",
        "Resilience is the property of having no such box, at every hop",
        "A client crashing is usually just one user; a shared database crashing is everyone"
      ]
    },
    {
      heading: "More nodes, used in two different ways",
      body: "The obvious fix is another copy. For a <b>profile service</b>, an idle spare is a weak idea: it holds no extra capacity and nobody is connected to it. Run the second profile server hot, and share traffic. For a <b>database</b>, a true backup that mirrors every write does make sense, because you are protecting durable state. If one replica fails with probability P, two independent replicas fail together with about <b>P squared</b>. That is the math you are buying.",
      bullets: [
        "Stateless services: extra hot nodes, not cold standbys",
        "Stateful stores: mirrored replicas so data survives the first disk",
        "Independent failures multiply; correlated failures (same rack, same bug) do not"
      ]
    },
    {
      heading: "Master-slave on the data hop",
      body: "A primary takes writes. Slaves copy it. Some slaves are readable, which also spreads load. If you need stricter consistency you can skip serving reads from behind replicas and still keep them for failover. A load balancer (or router) in front decides where a request goes. The pattern is the same one sharding lectures use; here the motive is survival, not capacity.",
      bullets: [
        "Writes land on the master so there is one source of truth",
        "Read replicas are optional extra mouths",
        "On master death, remaining replicas pick a new writer"
      ]
    },
    {
      heading: "The balancer is itself a SPOF",
      body: "Put one load balancer in front of everything and you just moved the single point. Run several. Now the client does not know which IP to dial, so you push the problem to <b>DNS</b>: one hostname, several addresses. Hitting facebook.com may resolve to any healthy balancer. Those edge boxes are really <b>gateways</b> that happen to load-balance. Keep walking upstream until every hop has a sibling.",
      bullets: [
        "N balancers, not one VIP you cannot live without",
        "DNS returns multiple IPs for the same host",
        "Call the edge what it is: a gateway with a balancing policy"
      ]
    },
    {
      heading: "Regions, coordinators, and chaos",
      body: "If the whole design sits in one building, a flood or outage is the asteroid. Add <b>regions</b> after the in-region story is already redundant. Distributed read/write often introduces a <b>coordinator</b>; that coordinator is another SPOF and gets the same treatment as the balancer: more than one, discoverable, replaceable. Netflix's <b>Chaos Monkey</b> kills a production node on purpose so the paper redundancy is forced to work. In an interview you rarely need the monkey; you do need to name replication, extra nodes, and extra regions.",
      bullets: [
        "Multi-region is disaster recovery, not your first extra box",
        "Every new \"smart\" hop (coordinator, queue leader, config server) must be cloned too",
        "Throwing money at copies is the honest summary; throwing it only at the leaf is not enough"
      ]
    }
  ],

  keyTerms: [
    { term: "Single point of failure", def: "A component whose crash makes the whole system unavailable." },
    { term: "Hot standby vs extra node", def: "Services should take traffic on every copy. Cold backups waste a machine that could have been serving." },
    { term: "Replication", def: "Mirroring writes onto another store so data outlives one disk or one process." },
    { term: "Master-slave", def: "One writer plus copies that follow it; copies may serve reads and can elect a new master." },
    { term: "DNS multi-IP", def: "One hostname that resolves to several gateway addresses so clients are not glued to one box." },
    { term: "Multi-region", def: "Independent copies of the stack in other geographies so a site-level disaster is survivable." },
    { term: "Chaos Monkey", def: "A production job that randomly disables a node to prove failover paths are real." }
  ],

  tradeoffs: [
    { pro: "A second replica drops combined failure odds toward P squared", con: "Copies cost money, and correlated failures (same AZ, same bug) shrink the win" },
    { pro: "Hot extra service nodes add both capacity and survival", con: "Cold backups protect little until the first node is already dead" },
    { pro: "Several gateways plus DNS remove the edge SPOF", con: "Clients, TTLs, and health checks become part of the design" },
    { pro: "A second region survives the data-center asteroid", con: "Cross-region replication is slower and consistency gets harder" }
  ],

  interviewTips: [
    "After the happy-path drawing, walk the interviewer along each hop and ask \"what if this dies?\" until nothing is unique.",
    "For stateless services, add hot copies. For databases, add replicas and say P becomes roughly P squared if failures are independent.",
    "Do not leave a single load balancer; pair it with DNS returning multiple IPs, and call the edge a gateway.",
    "Mention multi-region only after in-zone redundancy exists; it is the disaster story, not the first extra VM.",
    "Name Chaos Monkey as how you would validate, then land on the interview trio: replication, more nodes, more regions."
  ],

  scene: {
    nodes: [
      { id: "earth", label: "One region", type: "zone", pos: [1, 0, 0], size: [16, 10] },
      { id: "c1", label: "Client", type: "user", pos: [-11, 0, 0] },
      { id: "c2", label: "Client 2", type: "user", pos: [-11, 0, 4], showAt: 4 },

      { id: "prof1", label: "Profile svc", type: "service", pos: [-2, 0, -3] },
      { id: "prof2", label: "Profile svc 2", type: "service", pos: [2, 0, -3], showAt: 1 },
      { id: "db1", label: "Database", type: "db", pos: [6, 0, 0] },
      { id: "db2", label: "Replica", type: "db", pos: [9.5, 0, 0], showAt: 2 },
      { id: "noteP", label: "Fail odds: P -> P squared", type: "note", pos: [8, 4.2, -4], showAt: 2 },

      { id: "master", label: "Master", type: "db", pos: [6, 0, 3], showAt: 3 },
      { id: "slaveR", label: "Read slave", type: "db", pos: [9.5, 0, 3], showAt: 3 },
      { id: "slaveH", label: "Hot spare", type: "db", pos: [9.5, 0, 6], showAt: 3 },

      { id: "lb1", label: "Gateway / LB", type: "gateway", pos: [-6, 0, 0], showAt: 4 },
      { id: "lb2", label: "Gateway 2", type: "gateway", pos: [-6, 0, 3], showAt: 5 },
      { id: "dns", label: "DNS", type: "lb", pos: [-11, 0, -4], showAt: 5 },
      { id: "noteDNS", label: "facebook.com -> many IPs", type: "note", pos: [-8, 4.5, -7], showAt: 5 },

      { id: "regionB", label: "Region B", type: "zone", pos: [1, 0, -7], size: [10, 3], showAt: 7 },
      { id: "profB", label: "Profiles B", type: "service", pos: [-2, 0, -7], showAt: 7 },
      { id: "dbB", label: "DB B", type: "db", pos: [4, 0, -7], showAt: 7 },
      { id: "noteAst", label: "Asteroid = whole-site loss", type: "note", pos: [1, 4.5, -8], showAt: 7 },

      { id: "coord", label: "Coordinator", type: "lb", pos: [-2, 0, 6], showAt: 8 },
      { id: "coord2", label: "Coordinator 2", type: "lb", pos: [2, 0, 6], showAt: 8 },
      { id: "monkey", label: "Chaos Monkey", type: "worker", pos: [6, 0, -4], showAt: 8, color: "#fb923c" }
    ],
    edges: [
      { from: "c1", to: "prof1", label: "req" },
      { from: "c1", to: "prof2", showAt: 1 },
      { from: "prof1", to: "db1" },
      { from: "prof2", to: "db1", showAt: 1 },
      { from: "db1", to: "db2", label: "mirror", showAt: 2 },
      { from: "master", to: "slaveR", label: "replicate", showAt: 3 },
      { from: "master", to: "slaveH", showAt: 3, dashed: true },
      { from: "c1", to: "lb1", showAt: 4 },
      { from: "lb1", to: "prof1", showAt: 4 },
      { from: "lb1", to: "prof2", showAt: 4 },
      { from: "c2", to: "dns", showAt: 5 },
      { from: "dns", to: "lb1", showAt: 5 },
      { from: "dns", to: "lb2", showAt: 5 },
      { from: "lb2", to: "prof1", showAt: 5 },
      { from: "lb2", to: "prof2", showAt: 5 },
      { from: "db1", to: "dbB", label: "cross-region", showAt: 7, dashed: true },
      { from: "coord", to: "coord2", showAt: 8, dashed: true },
      { from: "monkey", to: "prof1", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "One database, whole product gone",
        text: "Servers look plentiful, but they all lean on a single store. Kill that store and the system is dark. That box is the SPOF. A single client dying is just one user; this is everyone.",
        highlight: ["db1", "prof1", "c1"],
        hide: ["c2", "prof2", "db2", "noteP", "master", "slaveR", "slaveH", "lb1", "lb2", "dns", "noteDNS", "regionB", "profB", "dbB", "noteAst", "coord", "coord2", "monkey"],
        flows: [
          { from: "c1", to: "prof1", color: "#4ade80", label: "ok" },
          { from: "prof1", to: "db1", color: "#4ade80", label: "read" }
        ]
      },
      {
        title: "Clone the profile service, keep it hot",
        text: "Add a second profile node that actually takes traffic. An idle spare for a stateless service wastes a machine nobody is connected to. Two live servers share load and survive one crash.",
        highlight: ["prof1", "prof2"],
        hide: ["c2", "db2", "noteP", "master", "slaveR", "slaveH", "lb1", "lb2", "dns", "noteDNS", "regionB", "profB", "dbB", "noteAst", "coord", "coord2", "monkey"],
        flows: [
          { from: "c1", to: "prof1", color: "#4ade80", label: "req" },
          { from: "c1", to: "prof2", color: "#4ade80", label: "req" }
        ]
      },
      {
        title: "Mirror the database: P becomes P squared",
        text: "Every write is copied onto a replica. For the data to vanish, both stores must die. If one fails with probability P, both fail with about P squared, assuming independence. Idle service backups were weak; data backups are the point.",
        highlight: ["db1", "db2", "noteP"],
        hide: ["c2", "master", "slaveR", "slaveH", "lb1", "lb2", "dns", "noteDNS", "regionB", "profB", "dbB", "noteAst", "coord", "coord2", "monkey"],
        flows: [
          { from: "db1", to: "db2", color: "#c084fc", label: "mirror" }
        ]
      },
      {
        title: "Master-slave for writes and reads",
        text: "Writes always hit the master. Slaves follow. Some slaves serve reads; some exist only so a new master can be elected. You can still insist on stronger consistency by not reading the followers.",
        highlight: ["master", "slaveR", "slaveH"],
        hide: ["c2", "lb1", "lb2", "dns", "noteDNS", "regionB", "profB", "dbB", "noteAst", "coord", "coord2", "monkey", "db2", "noteP"],
        flows: [
          { from: "prof1", to: "master", color: "#4ade80", label: "write" },
          { from: "master", to: "slaveR", color: "#c084fc", label: "copy" },
          { from: "prof2", to: "slaveR", color: "#60a5fa", label: "read" }
        ]
      },
      {
        title: "A lone balancer is the new SPOF",
        text: "Slide a gateway in front and you have not finished: that gateway is now the unique hop. Clients still have one door. Next step is to clone the door.",
        highlight: ["lb1"],
        fail: ["lb1"],
        hide: ["c2", "lb2", "dns", "noteDNS", "regionB", "profB", "dbB", "noteAst", "coord", "coord2", "monkey", "master", "slaveR", "slaveH", "db2", "noteP"],
        flows: [
          { from: "c1", to: "lb1", color: "#f87171", label: "stuck" }
        ]
      },
      {
        title: "DNS hands out several gateway IPs",
        text: "facebook.com is not one machine. DNS returns multiple addresses, each a gateway that load-balances. The client retries another IP if the first door is dead. The unique hop moved again, and we cloned it.",
        highlight: ["dns", "lb1", "lb2", "noteDNS", "c2"],
        hide: ["regionB", "profB", "dbB", "noteAst", "coord", "coord2", "monkey", "master", "slaveR", "slaveH", "db2", "noteP"],
        flows: [
          { from: "c2", to: "dns", color: "#60a5fa", label: "resolve" },
          { from: "dns", to: "lb1", color: "#4ade80", label: "IP 1" },
          { from: "dns", to: "lb2", color: "#4ade80", label: "IP 2" }
        ]
      },
      {
        title: "Kill one profile node; traffic survives",
        text: "With two services, two gateways, and a replica, a single process crash is a blip. That is the in-region story: more nodes, then more balancers, then DNS.",
        highlight: ["lb2", "prof2", "db1"],
        fail: ["prof1"],
        hide: ["regionB", "profB", "dbB", "noteAst", "coord", "coord2", "monkey", "master", "slaveR", "slaveH", "db2", "noteP", "c2"],
        flows: [
          { from: "lb1", to: "prof2", color: "#4ade80", label: "reroute" }
        ]
      },
      {
        title: "A second region vs the asteroid",
        text: "If the entire site is one Earth, a disaster is still a SPOF. Stand up another region with its own profiles and store, and replicate across. Do this after the local pipeline is already redundant.",
        highlight: ["regionB", "profB", "dbB", "noteAst", "earth"],
        hide: ["coord", "coord2", "monkey", "master", "slaveR", "slaveH", "db2", "noteP", "c2"],
        flows: [
          { from: "db1", to: "dbB", color: "#c084fc", label: "sync" }
        ]
      },
      {
        title: "Clone coordinators; prove it with chaos",
        text: "A write coordinator is the same trap as a lone balancer, so you run two. Chaos Monkey then kills a live node in production to check that the copies actually take over. Interview version: replication, extra nodes, extra regions.",
        highlight: ["coord", "coord2", "monkey"],
        fail: ["prof1"],
        hide: ["noteAst", "master", "slaveR", "slaveH", "db2", "noteP", "c2", "noteDNS"],
        flows: [
          { from: "monkey", to: "prof1", color: "#fb923c", label: "kill" },
          { from: "coord", to: "coord2", color: "#c084fc", label: "standby" }
        ]
      }
    ]
  }
});
