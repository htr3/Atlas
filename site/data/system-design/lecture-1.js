window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 1,
  title: "How to start with distributed systems",
  video: "https://www.youtube.com/watch?v=SqcXvc3ZmRU",
  category: "Fundamentals",
  tagline: "Grow a pizza parlor into a distributed system, one bottleneck at a time.",
  summary: "A pizza shop is used as a stand-in for a growing product. Each business headache maps onto a system-design move: scale up, precompute, replicate, scale out, specialize, go multi-site, balance load, and decouple. The lecture is a high-level map of the playlist, not a deep dive into any one technique.",

  theory: [
    {
      heading: "Start with a real bottleneck",
      body: "System design is easiest to learn as a story of growth. One chef (one machine) can cook every pizza until demand outruns that person. The first instinct is not to redesign the kitchen; it is to get more output from the resource you already have. That framing — a concrete load, a scarce resource, a manager's next move — is how almost every later lecture begins.",
      bullets: [
        "Treat the chef as a server: finite CPU, memory, and attention.",
        "Customers are clients. Orders are requests. Finished pizzas are responses.",
        "Name the bottleneck before you name the pattern."
      ]
    },
    {
      heading: "Vertical scaling and work you can do early",
      body: "Asking the chef to work harder, paying more, and tightening the process is <b>vertical scaling</b>: more throughput from the same box. A second trick is to pull work off the hot path. Pizza dough can be mixed at 4 a.m., when no orders arrive, so a lunch rush does not compete with base prep. In software that is caching, batching, or precomputation — spend cheap off-peak capacity so peak requests are smaller.",
      bullets: [
        "Vertical scaling: bigger CPU, more RAM, a faster disk, a tuned query.",
        "Precompute at idle time so the request path only assembles the result.",
        "You still have one kitchen. You just made it denser."
      ]
    },
    {
      heading: "Backups beat a single point of failure",
      body: "If that one chef calls in sick, the shop earns nothing. That person is a <b>single point of failure</b> (SPOF). A standby chef — paid for the day you need them — is a replica or hot/warm standby. In older language this is a master/standby pair. The chance of a total outage drops because the role is no longer unique. Once demand is steady, the standby should become a full-time hire, not an emergency pager.",
      bullets: [
        "SPOF: one component whose death takes the whole product down.",
        "A backup that is never exercised is a backup you cannot trust.",
        "Promotion from standby to full-time is the business version of adding a replica to serve reads."
      ]
    },
    {
      heading: "Horizontal scaling: more of the same",
      body: "Ten chefs plus a few extras is <b>horizontal scaling</b>: buy more machines of a similar size instead of one giant one. Work is split across people. You gain capacity in chunks and you can lose a chef without closing the shop. The new problem is coordination — who takes which ticket — which the next sections solve with routing and, later, a load balancer."
    },
    {
      heading: "Specialize, then scale teams independently",
      body: "Random assignment wastes skill. If chef 2 is great at garlic bread and chefs 1 and 3 at pizza, send bread tickets to 2 and pizza tickets to 1 and 3. Recipe changes and status questions now have a single owner. You can staff three garlic-bread cooks and seven pizza cooks because the two products have different demand. That is a <b>microservice</b> sketch: bounded responsibility, independent scaling, and a smaller blast radius when a recipe (a service) changes.",
      bullets: [
        "Route by type of work, not by whoever is free, when skills differ.",
        "Scale the busy service without cloning the quiet one.",
        "A change to garlic bread should not require a pizza deploy."
      ]
    },
    {
      heading: "A second shop is a distributed system",
      body: "An outage, a lost license, or a local disaster still kills one building. Opening a second parlor in another neighborhood is distribution: another failure domain, plus locality. Nearby orders finish faster, the same reason a global product like Facebook puts servers near users. Cost: shops must coordinate, and someone must decide which kitchen gets the ticket. That jump — many machines in many places that talk over a network — is the start of real distributed-systems complexity."
    },
    {
      heading: "Smart routing and a load balancer",
      body: "Customers should not pick a shop. A central router can. The lecture's score is total time: queue wait + cook time + delivery. Shop 1 might be famous but have a 60-minute queue, 5 minutes to bake, 10 to drive (75 minutes). Shop 2 might finish in 65. If the router has fresh numbers, it sends the order to shop 2. That component is a <b>load balancer</b>. It only stays smart if shops keep it updated — stale load data routes people into the crowded kitchen."
    },
    {
      heading: "Decouple, observe, extend — HLD vs LLD",
      body: "Delivery riders do not care whether the bag holds pizza or a burger; the kitchen does not care whether the customer walks in or a rider picks up. Split those roles (<b>decoupling</b>) so each can fail, scale, and change on its own. Log events, then roll them into metrics, so a broken oven or a slow bike is visible. Extensibility is why Amazon could move from parcels to almost anything: the delivery pipeline was not hard-wired to one SKU. All of this is <b>high-level design</b> (boxes, arrows, SLAs). <b>Low-level design</b> is the classes, objects, and function signatures you would type. This playlist lives in HLD; LLD is how you implement the boxes without making a mess.",
      bullets: [
        "Decouple so a bad oven does not imply a bad fleet, and vice versa.",
        "Logs are the story; metrics are the compressed story you alert on.",
        "HLD: what talks to what. LLD: how the code is shaped."
      ]
    }
  ],

  keyTerms: [
    { term: "Vertical scaling", def: "Raise capacity of one machine or person (faster CPU, more RAM, tighter process) instead of adding peers." },
    { term: "Horizontal scaling", def: "Add more similar machines (or chefs) and split work across them." },
    { term: "Single point of failure", def: "A unique component whose outage takes the whole system down — one chef, one shop, one disk." },
    { term: "Microservice", def: "A service with a tight job (pizza vs garlic bread) that can be deployed and scaled on its own." },
    { term: "Distributed system", def: "Multiple machines, often in multiple places, that coordinate over a network to look like one product." },
    { term: "Load balancer", def: "A router that picks a backend using a policy (latency, load, locality) so clients do not choose servers." },
    { term: "Decoupling", def: "Splitting responsibilities (kitchen vs delivery) so each can change or fail without dragging the other." },
    { term: "High-level design", def: "Servers, data stores, and how they interact — the view this channel teaches — as opposed to class-level LLD." }
  ],

  tradeoffs: [
    { pro: "Vertical scaling is simple: no routing, no extra chefs to train.", con: "One person still cannot work infinitely hard, and that person remains a SPOF." },
    { pro: "Horizontal scaling and a second shop add capacity and survive local failures.", con: "You now need routing, cross-shop communication, and operational overhead." },
    { pro: "Specialist teams (microservices) scale at different rates and localize recipe changes.", con: "More teams means more contracts, more hops, and more ways for an order to get lost." },
    { pro: "A load balancer hides shops from customers and can optimize total time.", con: "The balancer itself must stay fed with live data, and it can become a new SPOF if you only run one." }
  ],

  interviewTips: [
    "Open with the bottleneck (one chef / one box) and grow the design only as load or failure forces you to. Interviewers want to see that sequence, not a diagram you memorized.",
    "Name SPOF out loud, then say what backup or second site you add. Silence on failure is a common reject reason.",
    "When you split services, give a real split (pizza vs garlic bread) and say they scale independently — that is the microservice punchline.",
    "For routing, pick a metric (latency, queue time, geography) instead of saying 'the load balancer distributes traffic.'",
    "If asked HLD vs LLD: HLD is components and APIs; LLD is classes and methods. Stay in HLD unless they ask you to code a piece."
  ],

  scene: {
    nodes: [
      { id: "u1", label: "Customer A", type: "user", pos: [-10, 0, -3] },
      { id: "u2", label: "Customer B", type: "user", pos: [-10, 0, 0] },
      { id: "u3", label: "Customer C", type: "user", pos: [-10, 0, 3] },
      { id: "shop1", label: "Pizza Shop 1", type: "zone", pos: [1.5, 0, 0], size: [9, 8] },
      { id: "chef1", label: "Chef 1", type: "worker", pos: [-1, 0, 0.5] },
      { id: "dough", label: "Dough cache", type: "cache", pos: [-1.2, 0, -2.6], showAt: 1 },
      { id: "n_vert", label: "Vertical: same chef, more output", type: "note", pos: [-4, 3.6, -6], showAt: 1 },
      { id: "backup", label: "Backup chef", type: "worker", pos: [2.2, 0, 0.5], showAt: 2 },
      { id: "n_spof", label: "Chef sick = SPOF", type: "note", pos: [2, 3.6, -6], showAt: 2 },
      { id: "chef2", label: "Pizza chef", type: "worker", pos: [0.2, 0, 2.6], showAt: 3 },
      { id: "chef3", label: "Pizza chef 2", type: "worker", pos: [3.6, 0, 2.6], showAt: 3 },
      { id: "n_horiz", label: "Horizontal: hire more chefs", type: "note", pos: [4, 3.6, 6], showAt: 3 },
      { id: "pizzaZ", label: "Pizza team", type: "zone", pos: [2, 0, 2.6], size: [5.5, 3.2], showAt: 4 },
      { id: "gbZ", label: "Garlic-bread team", type: "zone", pos: [2.4, 0, -2.6], size: [5.2, 3], showAt: 4 },
      { id: "gbchef", label: "GB specialist", type: "worker", pos: [2.6, 0, -2.6], showAt: 4 },
      { id: "n_ms", label: "Teams = microservices", type: "note", pos: [8, 3.6, -2], showAt: 4 },
      { id: "shop2", label: "Shop 2", type: "zone", pos: [9, 0, 6], size: [5, 3.6], showAt: 5 },
      { id: "chef_s2", label: "Shop 2 chef", type: "worker", pos: [9, 0, 6], showAt: 5 },
      { id: "n_dist", label: "Second site, local delivery", type: "note", pos: [9, 3.6, 3], showAt: 5 },
      { id: "lb", label: "Load balancer", type: "lb", pos: [-5.5, 0, 0], showAt: 6 },
      { id: "n_lb", label: "Pick shop by total minutes", type: "note", pos: [-6, 3.6, -5], showAt: 6 },
      { id: "t1", label: "Shop1: 75 min", type: "note", pos: [1.5, 3.2, 0], showAt: 6 },
      { id: "t2", label: "Shop2: 65 min", type: "note", pos: [9, 3.2, 6], showAt: 6 },
      { id: "agent", label: "Delivery agent", type: "service", pos: [4.5, 0, 6], showAt: 7 },
      { id: "n_dec", label: "Decouple kitchen vs riders", type: "note", pos: [4.5, 3.6, 8], showAt: 7 }
    ],
    edges: [
      { from: "u1", to: "chef1", label: "order" },
      { from: "u2", to: "chef1", label: "order" },
      { from: "u3", to: "chef1", label: "order" },
      { from: "dough", to: "chef1", label: "bases", showAt: 1 },
      { from: "u2", to: "backup", label: "failover", showAt: 2 },
      { from: "u1", to: "chef2", label: "pizza", showAt: 4 },
      { from: "u3", to: "gbchef", label: "garlic bread", showAt: 4 },
      { from: "u1", to: "lb", label: "order", showAt: 6 },
      { from: "u2", to: "lb", showAt: 6 },
      { from: "u3", to: "lb", showAt: 6 },
      { from: "lb", to: "chef1", label: "75 min", showAt: 6 },
      { from: "lb", to: "chef_s2", label: "65 min", showAt: 6 },
      { from: "chef_s2", to: "agent", label: "bag", showAt: 7 },
      { from: "agent", to: "u2", label: "dropoff", showAt: 7 }
    ],
    steps: [
      {
        title: "One chef, too many tickets",
        text: "A new parlor has a single chef. Customers keep walking in. The kitchen is the whole system, and it is already the bottleneck.",
        highlight: ["chef1", "shop1", "u1", "u2", "u3"],
        flows: [
          { from: "u1", to: "chef1", color: "#4ade80", label: "order" },
          { from: "u2", to: "chef1", color: "#4ade80", label: "order" },
          { from: "u3", to: "chef1", color: "#4ade80", label: "order" }
        ]
      },
      {
        title: "Scale up and prep the dough",
        text: "Pay the chef more and tighten the process (vertical scaling). Mix bases at 4 a.m. so peak orders do not wait on raw prep — the software analog of a cache or precompute job.",
        highlight: ["chef1", "dough", "n_vert"],
        flows: [
          { from: "dough", to: "chef1", color: "#60a5fa", label: "base" },
          { from: "u2", to: "chef1", color: "#4ade80", label: "order" }
        ]
      },
      {
        title: "The chef is a single point of failure",
        text: "Chef 1 calls in sick and the shop earns nothing. A backup chef on standby is the replica. Promote them to full-time as soon as the business is worth it.",
        highlight: ["backup", "n_spof"],
        fail: ["chef1"],
        flows: [
          { from: "u2", to: "backup", color: "#fb923c", label: "failover" }
        ]
      },
      {
        title: "Hire a line of chefs",
        text: "Ten similar cooks (here, a few) is horizontal scaling: more machines of the same class. Capacity grows in steps and one absence no longer closes the shop.",
        highlight: ["chef1", "chef2", "chef3", "backup", "n_horiz"],
        flows: [
          { from: "u1", to: "chef2", color: "#4ade80", label: "ticket" },
          { from: "u2", to: "chef1", color: "#4ade80", label: "ticket" },
          { from: "u3", to: "chef3", color: "#4ade80", label: "ticket" }
        ]
      },
      {
        title: "Pizza team vs garlic-bread team",
        text: "Stop assigning at random. Route pizza to the pizza line and garlic bread to the specialist. Each team scales on its own demand — a microservice split with a clear owner for recipe changes.",
        highlight: ["pizzaZ", "gbZ", "gbchef", "chef2", "chef3", "n_ms"],
        flows: [
          { from: "u1", to: "chef2", color: "#4ade80", label: "pizza" },
          { from: "u3", to: "gbchef", color: "#fb923c", label: "garlic" }
        ]
      },
      {
        title: "Open a second shop",
        text: "A power cut or a lost license still kills one building. A second parlor in another neighborhood is another failure domain and a closer kitchen for nearby customers — the same idea as regional servers.",
        highlight: ["shop2", "chef_s2", "n_dist", "shop1"],
        flows: [
          { from: "u3", to: "chef_s2", color: "#4ade80", label: "local" }
        ]
      },
      {
        title: "A balancer picks the faster shop",
        text: "Customers should not choose a kitchen. A load balancer compares total time: Shop 1 is 75 minutes (long queue), Shop 2 is 65. Live numbers send the order to Shop 2.",
        highlight: ["lb", "n_lb", "t1", "t2", "chef_s2"],
        flows: [
          { from: "u1", to: "lb", color: "#4ade80", label: "order" },
          { from: "u2", to: "lb", color: "#4ade80", label: "order" },
          { from: "lb", to: "chef_s2", color: "#60a5fa", label: "65 min" }
        ]
      },
      {
        title: "Decouple delivery from the kitchen",
        text: "Riders only move bags; kitchens only cook. That split, plus logs and metrics, keeps the system extensible — tomorrow the bag might hold a burger, the way Amazon outgrew parcels. This whole story is high-level design.",
        highlight: ["agent", "n_dec", "lb", "chef_s2"],
        flows: [
          { from: "chef_s2", to: "agent", color: "#c084fc", label: "ready" },
          { from: "agent", to: "u2", color: "#60a5fa", label: "deliver" }
        ]
      }
    ]
  }
});
