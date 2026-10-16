window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 2,
  title: "Horizontal vs. Vertical Scaling",
  video: "https://www.youtube.com/watch?v=xpDnVSmNFX0",
  category: "Fundamentals",
  tagline: "Bigger box or more boxes — and why production systems quietly do both.",
  summary: "An algorithm becomes a paid API, then a cloud-hosted service. When one machine cannot keep up, you either buy a larger machine (vertical) or many machines (horizontal). Five contrasts — load balancing, failure, communication, consistency, and hardware limits — explain the usual hybrid: fat boxes first, then a fleet.",

  theory: [
    {
      heading: "From a useful function to an API",
      body: "You have a program on one computer: inputs in, outputs out. Other people will pay to call it, but you cannot hand them the tower. You publish it on the internet as an <b>API</b> (application programming interface). Callers send a <b>request</b>; your process returns a <b>response</b> instead of writing a local file. That request/response loop is the unit of load for the rest of the lecture.",
      bullets: [
        "The product is the function. The API is how strangers invoke it.",
        "Each request is work. Scalability means surviving more of that work.",
        "You still have to configure endpoints, attach a database if you need one, and think about power loss."
      ]
    },
    {
      heading: "Why the cloud is just someone else's computers",
      body: "A desktop in your room dies when the plug is pulled, and paying users will not wait. A cloud (AWS is the example) is a pool of machines you rent. You remote-login, deploy the same code, and inherit the provider's power, networking, and a chunk of operational work. There is no magic layer — it is still a computer running your algorithm — but reliability and setup stop being only your night job.",
      bullets: [
        "Cloud = rented computers plus a control plane, not a different kind of CPU.",
        "You trade money for someone else babysitting hardware.",
        "Hosting there lets you focus on the product once the process can survive a local outage."
      ]
    },
    {
      heading: "Scalability is 'handle more requests'",
      body: "Popular APIs run out of connections, CPU, or disk on a single host. <b>Scalability</b> is the ability to take more of that load by spending money: a bigger machine, or more machines. Both are valid. The lecture's job is to compare them so you can mix them on purpose instead of picking a slogan."
    },
    {
      heading: "Vertical scaling: one larger box",
      body: "Buy a beefier computer so each request finishes faster and more of them fit. There is nothing to balance — every call lands on the same machine. Processes on that box talk through memory and local sockets (<b>inter-process communication</b>), which is fast. All data can live in one place, so transactions and caches stay consistent; you do not fight dirty reads across replicas. The tax: that box is a <b>single point of failure</b>, and physics plus the vendor catalog cap how large it can get.",
      bullets: [
        "No load balancer required for a single instance.",
        "IPC and one database make strong consistency much easier.",
        "You will hit a hardware ceiling, and a crash is a full outage."
      ]
    },
    {
      heading: "Horizontal scaling: many peer boxes",
      body: "Buy more machines of a similar size and spread requests across them. Any healthy box can run the handler. You now need a <b>load balancer</b> (or equivalent) so clients do not pick a peer at random in their own heads. If one host dies, traffic moves to the others — the fleet is resilient. Communication between services is now a <b>network call</b> / RPC, which is slower than IPC. Data is harder: an atomic transaction that touches several hosts may need locks you cannot actually take, so systems settle for looser guarantees. The upside is that adding users is roughly linear in adding servers, with no single-box size wall.",
      bullets: [
        "Resilient: one crash is not the product crash.",
        "Network hops are the slow, failure-prone path.",
        "Consistency becomes a distributed problem, not a local lock."
      ]
    },
    {
      heading: "Five contrasts to memorize",
      body: "Keep this table in your head. Vertical: no balancer, SPOF, fast IPC, easy consistency, hardware cap. Horizontal: needs balancing, resilient, slow RPC, consistency pain, scales with server count. Real systems steal the good column from both sides.",
      bullets: [
        "Load balancing: none vs required.",
        "Failure: one box dies, everything dies vs peers absorb the hit.",
        "Communication: IPC (fast) vs network RPC (slow).",
        "Data: one copy, consistent vs many copies, weaker or harder transactions.",
        "Growth: ceiling vs roughly linear in machines."
      ]
    },
    {
      heading: "The hybrid you actually ship",
      body: "Production is 'horizontal scaling of large machines.' Take vertical's speed and cache consistency: make each node as big as is cost-effective so IPC and local state stay nice inside the box. Take horizontal's resilience and lack of a hardware wall: run several of those fat nodes behind a balancer. Early on, vertical-scale until the bill or the ceiling hurts. After users trust you and load is real, go horizontal so a single crash is not a company event.",
      bullets: [
        "Each VM/container is 'as big as is wise,' not a tiny toy and not an infinite mainframe.",
        "The fleet is still the unit of availability.",
        "System design is picking which of scalable / resilient / consistent you will pay for, and which you will relax."
      ]
    }
  ],

  keyTerms: [
    { term: "API", def: "A network-facing contract: callers send a request and get a response without owning your machine." },
    { term: "Request / response", def: "The inbound call and the outbound result. Load is usually counted in these pairs." },
    { term: "Cloud", def: "Rented computers (and related services) in someone else's data center, reached by APIs and remote login." },
    { term: "Scalability", def: "Ability to serve more requests by adding money — a bigger machine, more machines, or both." },
    { term: "Vertical scaling", def: "Upgrade one host (CPU, RAM, disk). Simple and consistent; SPOF and a size ceiling." },
    { term: "Horizontal scaling", def: "Add peer hosts and spread work. Resilient and open-ended; needs routing and hurts consistency." },
    { term: "IPC vs RPC", def: "Inter-process calls stay on one machine (fast). Remote procedure calls cross the network (slow, lossy)." },
    { term: "Single point of failure", def: "The one machine in a vertical setup — if it dies, the API dies." }
  ],

  tradeoffs: [
    { pro: "Vertical: no balancer, fast IPC, one consistent dataset and cache.", con: "SPOF, hardware ceiling, and a painful 'forklift upgrade' when you finally outgrow the box." },
    { pro: "Horizontal: survive a host crash and grow almost linearly with servers.", con: "Need a balancer, pay for network RPCs, and struggle with atomic multi-host transactions." },
    { pro: "Hybrid: fat nodes for local speed and consistency, several of them for capacity and failover.", con: "You still operate a fleet, and you still cannot pretend the network is RAM." }
  ],

  interviewTips: [
    "Define scalability as 'more requests' before you say 'Kubernetes.' Then offer both knobs: bigger box and more boxes.",
    "Recite the five diffs (balancer, SPOF, IPC/RPC, consistency, hardware limit). That list is the lecture.",
    "Say you vertical-scale first while traffic is small, then horizontal-scale when availability and growth matter.",
    "If they ask about transactions, mention that locking every server is impractical — that is why distributed systems weaken isolation.",
    "Never claim horizontal is 'always better.' Call out RPC latency and cache inconsistency; then justify the hybrid."
  ],

  scene: {
    nodes: [
      { id: "devpc", label: "Your desktop", type: "server", pos: [-8, 0, 0] },
      { id: "fn", label: "algorithm()", type: "note", pos: [-8, 3.2, -3] },
      { id: "u1", label: "Caller A", type: "user", pos: [-11, 0, -4] },
      { id: "u2", label: "Caller B", type: "user", pos: [-11, 0, 0] },
      { id: "u3", label: "Caller C", type: "user", pos: [-11, 0, 4] },
      { id: "api", label: "API endpoint", type: "gateway", pos: [-3.5, 0, 0], showAt: 1 },
      { id: "n_req", label: "request in, response out", type: "note", pos: [-3.5, 3.2, -4], showAt: 1 },
      { id: "cloud", label: "Cloud (AWS)", type: "zone", pos: [4, 0, 0], size: [12, 10], showAt: 2 },
      { id: "s_small", label: "Rented VM", type: "server", pos: [1.5, 0, 0], showAt: 2 },
      { id: "db", label: "Local DB", type: "db", pos: [5.5, 0, 0], showAt: 2 },
      { id: "n_cloud", label: "Same computer, rented", type: "note", pos: [4, 3.6, -6], showAt: 2 },
      { id: "n_hot", label: "Too many connections", type: "note", pos: [1.5, 3.4, 4], showAt: 3 },
      { id: "s_big", label: "Bigger machine", type: "server", pos: [1.5, 0, 0], showAt: 4, color: "#38bdf8" },
      { id: "n_vert", label: "Vertical: fast IPC, 1 copy", type: "note", pos: [-2, 3.6, 6], showAt: 4 },
      { id: "lb", label: "Load balancer", type: "lb", pos: [-1, 0, 0], showAt: 5 },
      { id: "s1", label: "Server 1", type: "server", pos: [2.5, 0, -3], showAt: 5 },
      { id: "s2", label: "Server 2", type: "server", pos: [5.5, 0, 0], showAt: 5 },
      { id: "s3", label: "Server 3", type: "server", pos: [2.5, 0, 3], showAt: 5 },
      { id: "n_horiz", label: "Horizontal: spread requests", type: "note", pos: [8, 3.6, 6], showAt: 5 },
      { id: "n_rpc", label: "RPC over network = slow", type: "note", pos: [8, 3.4, -3], showAt: 6 },
      { id: "n_hyb", label: "Hybrid: few fat boxes", type: "note", pos: [5.5, 3.6, 6], showAt: 7 }
    ],
    edges: [
      { from: "u1", to: "devpc", label: "can't ship PC" },
      { from: "u1", to: "api", label: "HTTP", showAt: 1 },
      { from: "u2", to: "api", showAt: 1 },
      { from: "api", to: "devpc", showAt: 1 },
      { from: "api", to: "s_small", label: "req", showAt: 2 },
      { from: "s_small", to: "db", label: "IPC", showAt: 2 },
      { from: "api", to: "s_big", showAt: 4 },
      { from: "s_big", to: "db", label: "IPC", showAt: 4 },
      { from: "u1", to: "lb", showAt: 5 },
      { from: "u2", to: "lb", showAt: 5 },
      { from: "u3", to: "lb", showAt: 5 },
      { from: "lb", to: "s1", showAt: 5 },
      { from: "lb", to: "s2", showAt: 5 },
      { from: "lb", to: "s3", showAt: 5 },
      { from: "s1", to: "s2", label: "RPC", showAt: 6, dashed: true },
      { from: "s2", to: "s3", label: "RPC", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "A useful program on one PC",
        text: "Your algorithm runs on a desktop. People want it, but you cannot lend them the machine. The function is valuable; the distribution story has not started.",
        highlight: ["devpc", "fn", "u1", "u2"],
        flows: [
          { from: "u1", to: "devpc", color: "#fb923c", label: "please?" }
        ]
      },
      {
        title: "Expose it as an API",
        text: "Publish the function on the internet. Callers send a request; you return a response. That pair is now the unit of work you have to scale.",
        highlight: ["api", "n_req", "devpc"],
        flows: [
          { from: "u1", to: "api", color: "#4ade80", label: "req" },
          { from: "u2", to: "api", color: "#4ade80", label: "req" },
          { from: "api", to: "u1", color: "#60a5fa", label: "res" }
        ]
      },
      {
        title: "Move the box into the cloud",
        text: "A pulled plug cannot take paid users down. Rent a VM from a provider such as AWS, attach a database, and let them own power and hardware babysitting. It is still just a computer.",
        highlight: ["cloud", "s_small", "db", "n_cloud"],
        hide: ["devpc"],
        flows: [
          { from: "u2", to: "api", color: "#4ade80", label: "req" },
          { from: "api", to: "s_small", color: "#4ade80", label: "run" },
          { from: "s_small", to: "db", color: "#60a5fa", label: "read" }
        ]
      },
      {
        title: "The VM is out of connections",
        text: "The algorithm is popular. One rented machine cannot accept every connection. Scalability means throwing money at that fact — two different ways.",
        highlight: ["s_small", "n_hot", "u1", "u2", "u3"],
        hide: ["devpc"],
        flows: [
          { from: "u1", to: "api", color: "#f87171", label: "req" },
          { from: "u2", to: "api", color: "#f87171", label: "req" },
          { from: "u3", to: "api", color: "#f87171", label: "req" }
        ]
      },
      {
        title: "Vertical: buy a bigger machine",
        text: "A larger box processes requests faster. No balancer. The database and cache sit in one process space (fast IPC, consistent). It is still one failure domain and it cannot grow forever.",
        highlight: ["s_big", "db", "n_vert"],
        hide: ["devpc", "s_small"],
        flows: [
          { from: "api", to: "s_big", color: "#4ade80", label: "req" },
          { from: "s_big", to: "db", color: "#60a5fa", label: "IPC" }
        ]
      },
      {
        title: "Horizontal: buy more machines",
        text: "Stand up peers and put a load balancer in front. Requests land on any healthy server. One crash is survivable. You now operate a fleet.",
        highlight: ["lb", "s1", "s2", "s3", "n_horiz"],
        hide: ["devpc", "s_small", "s_big", "db"],
        fail: [],
        flows: [
          { from: "u1", to: "lb", color: "#4ade80", label: "req" },
          { from: "u2", to: "lb", color: "#4ade80", label: "req" },
          { from: "lb", to: "s1", color: "#4ade80", label: "A" },
          { from: "lb", to: "s2", color: "#4ade80", label: "B" },
          { from: "lb", to: "s3", color: "#4ade80", label: "C" }
        ]
      },
      {
        title: "RPC is slow; one crash is fine",
        text: "Peers talk over the network (RPC), which is slower than IPC, and multi-host transactions are painful. In return, killing Server 2 does not kill the API — traffic slides to 1 and 3.",
        highlight: ["s1", "s3", "n_rpc", "lb"],
        hide: ["devpc", "s_small", "s_big", "db"],
        fail: ["s2"],
        flows: [
          { from: "lb", to: "s1", color: "#4ade80", label: "retry" },
          { from: "lb", to: "s3", color: "#4ade80", label: "retry" },
          { from: "s1", to: "s3", color: "#f87171", label: "RPC" }
        ]
      },
      {
        title: "Ship the hybrid",
        text: "Keep each node large for local speed and consistent caches, then run several of them for growth and failover. Vertical first; horizontal when users and uptime demand it.",
        highlight: ["lb", "s1", "s2", "s3", "n_hyb", "cloud"],
        hide: ["devpc", "s_small", "s_big", "db"],
        flows: [
          { from: "u1", to: "lb", color: "#4ade80", label: "req" },
          { from: "lb", to: "s1", color: "#4ade80" },
          { from: "lb", to: "s2", color: "#4ade80" },
          { from: "lb", to: "s3", color: "#4ade80" }
        ]
      }
    ]
  }
});
