window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 10,
  title: "Load Balancers: Algorithms and Design",
  video: "https://www.youtube.com/watch?v=YM_dEeXmnuY",
  category: "Low-Level Design",
  tagline: "Route a request to a node with round robin, least connections, and a factory.",
  summary: "Gaurav Sen codes a load balancer while Arun Goel interviews. An abstract balancer maps a request to a destination; services register by request type; algorithms override only balanceLoad. The session compares round robin, weighted round robin, least connections, least response time, sticky hashing, and why a factory (not one singleton) is the product.",

  theory: [
    {
      heading: "What a balancer actually does",
      body: "N incoming queries must land on servers. Mapping can be round robin (1,2,3,1,…), fill-until-threshold (first box takes five, then the next), least connections, least response time, or weighted variants. The product is a balancer whose <b>algorithm is chosen by the caller</b> — a factory that returns a round-robin balancer or a least-connection balancer. Do not let one instance change algorithm mid-flight per request type; give profile traffic its own balancer and chat traffic another.",
      bullets: [
        "Strip the job to: request in, destination (node) out. No payload rewrite.",
        "Abstract LoadBalancer with balanceLoad(Request) → Destination.",
        "Concrete classes cannot be constructed as a bare \"load balancer\"; you always pick a type."
      ]
    },
    {
      heading: "Request, destination, service",
      body: "A Request has an id, a type, and optional parameter map (JSON keys). A Destination has an IP (or hostname), a threshold (max in-flight requests), a mutable in-flight count, and accept/complete methods that increment or decrement only under that cap. A Service is a set of destinations that handle one or more request types (create group, get admin, …). The balancer stores requestType → Service so a lookup immediately yields the pool. Services register; unregister can wait. Destinations can be added and removed when a node joins or dies.",
      bullets: [
        "One service accepts many request types; one type should not map to many services.",
        "Do not ask the service to pick the least-loaded node — that logic is the balancer's.",
        "Weight as \"bigger AWS box\" is useful; in-flight count is the state least-connections needs."
      ]
    },
    {
      heading: "Least connections",
      body: "Look up the service for this request type, stream its destinations, take the one with the minimum <code>requestsBeingServed</code>. If the set is empty, return none (everything unregistered). Optionally call accept on that destination so the count moves. A min-heap (or TreeMap) would make the min O(1) and the update O(log n); a linear scan is what the live code used. Heartbeats (every few seconds, or on pick) should skip dead nodes — a comment from the audience that belongs in a complete design.",
      bullets: [
        "Least connections follows live load, unlike blind robin.",
        "If machines differ in size, least connections still ignores capacity unless you normalize.",
        "The balancer, not the service, owns this comparison."
      ]
    },
    {
      heading: "Round robin without findAny luck",
      body: "Shared lookup of destinations can live on the abstract class. Naive <code>findAny</code> might always return the first element — that is not robin. Keep a queue per request type: poll the front, offer it to the back, return it. That is true cycling. Round robin's flaw: it never asks whether that server is already overloaded or slower, so a request can fail on a hot box while a cold one sits idle. It also handles a new fourth server poorly — you still walk the circle instead of dumping the next ten calls on the empty node.",
      bullets: [
        "State (last index or the queue) must live in the balancer.",
        "Register/unregister while robin is spinning is messy because the circle changes.",
        "Random-with-equal-probability is related but not the same as a strict circle."
      ]
    },
    {
      heading: "Weighted robin, least time, sticky sessions",
      body: "Weighted round robin sends extra turns to bigger machines (2-1-3 if capacities are 2×, 1×, 3×) but still ignores who is actually free or fast. Least response time needs a map of recent latencies, updated when a call completes; it chases the current winner, which is smart until the balancer itself spends too long scanning many servers on every request. Sticky / session routing hashes the request (id or a session key) modulo pool size so the same client revisits the same node; if that node dies you rehash. Another pattern: send a read to two replicas and take the first answer.",
      bullets: [
        "Every algorithm has a drawback; that is why the factory exists.",
        "Database balancers often split GET vs write paths.",
        "Client-side vs server-side placement is a different product; this code assumes server-side."
      ]
    },
    {
      heading: "Factory, singleton, open/closed",
      body: "LoadBalancerFactory.create(typeString) switches on \"round robin\" vs \"least connection\" and returns the subclass. If you truly had one global balancer, Singleton plus Strategy would fit; here you vend <i>many</i> balancers, each with its own pool and algorithm, so singleton is wrong. A switch is open for extension if you add a map of type → constructor; the live switch is good enough for an interview. Audience notes: acceptRequest when you pick; sessions in a shared cache if you need them across nodes; heaps for least-X; do not violate open/closed with an unreadable switch if you have time to replace it.",
      bullets: [
        "This mock was a full interview arc in about 40 minutes of coding — messy is expected.",
        "Practice so you think of the queue and the heap before the whiteboard ends.",
        "Language-agnostic UML still maps: abstract class, subclasses, factory."
      ]
    }
  ],

  keyTerms: [
    { term: "balanceLoad", def: "The abstract method: given a Request, return the Destination that should serve it." },
    { term: "Destination", def: "A node with address, in-flight count, and a threshold; accept/complete mutate the count." },
    { term: "Service", def: "Named pool of destinations registered for one or more request types." },
    { term: "Round robin", def: "Cycle through the pool; queue = poll front, offer back. Ignores live load." },
    { term: "Least connections", def: "Pick the destination with the smallest in-flight count (scan or heap)." },
    { term: "Weighted round robin", def: "Give stronger machines more consecutive turns in the circle." },
    { term: "Least response time", def: "Pick the node whose recent completion latency is smallest; needs extra state." },
    { term: "Sticky session", def: "hash(request) % n so one client keeps hitting the same node." },
    { term: "Factory", def: "Caller names the algorithm; you construct that LoadBalancer subclass." }
  ],

  tradeoffs: [
    { pro: "Round robin is simple and spreads turns evenly over time.", con: "It will hit an overloaded or slow server because it never looks at load." },
    { pro: "Least connections follows who is actually busy.", con: "Linear min is O(n); a heap/TreeMap costs log n updates and extra structure." },
    { pro: "Weighted robin respects box size.", con: "Still blind to who finished work; a small idle box waits its turn." },
    { pro: "Least response time chases the current fast node.", con: "The balancer grows heavy as it samples many nodes on every request." },
    { pro: "Many factory-made balancers match many services and algorithms.", con: "A single singleton balancer cannot change policy per request type cleanly." }
  ],

  interviewTips: [
    "Define the function as request → node before drawing classes.",
    "Register services by request type; keep algorithm logic on the balancer, not the service.",
    "Implement robin with a queue, not stream.findAny.",
    "Say why robin fails on overload, then offer least connections or weighted robin.",
    "For sticky sessions, hash id modulo the current list and mention rehash on node death.",
    "Use a factory; only use singleton if the prompt forces one global balancer."
  ],

  scene: {
    nodes: [
      { id: "c1", label: "Client A", type: "user", pos: [-10, 0, -4] },
      { id: "c2", label: "Client B", type: "user", pos: [-10, 0, 4] },

      { id: "fact", label: "LB factory", type: "gateway", pos: [-5, 0, 0] },
      { id: "lb", label: "LoadBalancer", type: "lb", pos: [0, 0, 0] },
      { id: "smap", label: "type → service", type: "db", pos: [0, 0, -5], showAt: 1 },

      { id: "svc", label: "Profile svc", type: "service", pos: [5, 0, 0], showAt: 1 },
      { id: "n1", label: "Node 1", type: "server", pos: [10, 0, -5], showAt: 1 },
      { id: "n2", label: "Node 2", type: "server", pos: [10, 0, 0], showAt: 1 },
      { id: "n3", label: "Node 3", type: "server", pos: [10, 0, 5], showAt: 1 },

      { id: "rrq", label: "Robin queue", type: "queue", pos: [5, 0, 5], showAt: 4 },
      { id: "note0", label: "request → node", type: "note", pos: [-5, 0, 5] },
      { id: "note1", label: "min in-flight", type: "note", pos: [5, 0, -5], showAt: 3 },
      { id: "note2", label: "poll front, offer back", type: "note", pos: [0, 0, 7], showAt: 4 },
      { id: "note3", label: "hash(id) % n sticky", type: "note", pos: [-5, 0, -5], showAt: 6 },
      { id: "note4", label: "each algo has a cost", type: "note", pos: [3, 0, 7], showAt: 7 }
    ],
    edges: [
      { from: "c1", to: "fact", label: "want LB" },
      { from: "fact", to: "lb" },
      { from: "c2", to: "lb", label: "request" },
      { from: "lb", to: "smap", showAt: 1 },
      { from: "smap", to: "svc", showAt: 1 },
      { from: "svc", to: "n1", showAt: 1 },
      { from: "svc", to: "n2", showAt: 1 },
      { from: "svc", to: "n3", showAt: 1 },
      { from: "lb", to: "rrq", showAt: 4 },
      { from: "rrq", to: "n1", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Factory, then route",
        text: "The caller asks the factory for a balancer of a given algorithm. From then on the only job is: here is a request, there is a node. No data transform.",
        highlight: ["c1", "fact", "lb", "note0"],
        hide: ["note1", "note2", "note3", "note4"],
        flows: [
          { from: "c1", to: "fact", color: "#c084fc", label: "least conn" },
          { from: "fact", to: "lb", color: "#c084fc", label: "new LB" }
        ]
      },
      {
        title: "Services register pools",
        text: "A profile service registers for profile request types and publishes its destinations. The balancer map is request type → service, so lookup is immediate.",
        highlight: ["smap", "svc", "n1", "n2", "n3"],
        hide: ["note0", "note1", "note2", "note3", "note4"],
        flows: [
          { from: "svc", to: "smap", color: "#4ade80", label: "register" },
          { from: "smap", to: "n1", color: "#60a5fa", label: "nodes" }
        ]
      },
      {
        title: "Least connections",
        text: "balanceLoad streams the pool and returns the node with the smallest in-flight count. The service does not choose; the algorithm lives on the balancer.",
        highlight: ["lb", "n1", "n2", "n3", "note1"],
        hide: ["note0", "note2", "note3", "note4"],
        flows: [
          { from: "c2", to: "lb", color: "#4ade80", label: "GET profile" },
          { from: "lb", to: "n2", color: "#4ade80", label: "min load" }
        ]
      },
      {
        title: "Accept raises in-flight",
        text: "The chosen destination increments requestsBeingServed if under threshold, else refuses. Complete decrements when work finishes so least-connections can see a free slot.",
        highlight: ["n2", "lb"],
        hide: ["note0", "note2", "note3", "note4"],
        flows: [
          { from: "lb", to: "n2", color: "#4ade80", label: "accept" },
          { from: "n2", to: "lb", color: "#60a5fa", label: "complete" }
        ]
      },
      {
        title: "Round robin as a queue",
        text: "A per-type queue cycles nodes: take the front, enqueue it at the back. findAny is not robin. The next request goes to whoever is now at the head, even if that box is hot.",
        highlight: ["rrq", "n1", "n2", "n3", "note2"],
        hide: ["note0", "note1", "note3", "note4"],
        flows: [
          { from: "lb", to: "rrq", color: "#fb923c", label: "poll" },
          { from: "rrq", to: "n1", color: "#4ade80", label: "now" },
          { from: "rrq", to: "n1", color: "#c084fc", label: "offer back" }
        ]
      },
      {
        title: "Robin misses overload",
        text: "Node 1 is already at threshold. Robin still sends the next turn there, and the call can fail, while node 3 is idle. That drawback is why least connections and weighted robin exist.",
        highlight: ["n1", "n3", "rrq"],
        fail: ["n1"],
        hide: ["note0", "note1", "note3", "note4"],
        flows: [
          { from: "rrq", to: "n1", color: "#f87171", label: "forced turn" },
          { from: "c2", to: "n3", color: "#60a5fa", label: "idle" }
        ]
      },
      {
        title: "Sticky hash",
        text: "Convert the pool to a list, hash the request id (or session) modulo n, and always return that index. Same client, same node, until the node disappears and you rehash.",
        highlight: ["lb", "n2", "c1", "note3"],
        hide: ["note0", "note1", "note2", "note4"],
        flows: [
          { from: "c1", to: "lb", color: "#4ade80", label: "id=17" },
          { from: "lb", to: "n2", color: "#c084fc", label: "17 % 3" }
        ]
      },
      {
        title: "Pick the algorithm for the system",
        text: "Weighted robin respects machine size. Least response time chases latency but makes the balancer heavier. Random can be enough. The factory exists because every policy has a bill.",
        highlight: ["fact", "lb", "n1", "n2", "n3", "note4"],
        hide: ["note0", "note1", "note2", "note3"],
        flows: [
          { from: "fact", to: "lb", color: "#c084fc", label: "swap algo" },
          { from: "c2", to: "lb", color: "#4ade80", label: "req" },
          { from: "lb", to: "n3", color: "#4ade80", label: "route" }
        ]
      }
    ]
  }
});
