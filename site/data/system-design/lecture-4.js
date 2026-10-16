window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 4,
  title: "What is Consistent Hashing?",
  video: "https://www.youtube.com/watch?v=zaRkONvyGr8",
  category: "Building Blocks",
  tagline: "A ring of hashes: walk clockwise, and only a neighbor feels a join or a crash.",
  summary: "Modulo hashing was even but brittle. Consistent hashing puts both keys and servers on one ring of size M. A key is served by the next server clockwise. Adding or removing a server moves only the keys that walked into that arc, which is the small cache-friendly change the previous lecture wanted. Virtual nodes (K hashes per server) keep a small fleet from going lopsided.",

  theory: [
    {
      heading: "The problem is membership, not balance",
      body: "The previous lecture already spread keys with hash(id) mod N. The damage happened when a server was added or removed: almost every key changed owner and the local caches were thrown away. Consistent hashing keeps the hash, and changes the map so membership changes touch as few keys as possible."
    },
    {
      heading: "Bend the key space into a ring",
      body: "Instead of an array of buckets 0 .. N−1, imagine the hash output as positions 0, 1, 2, … M−1 arranged in a circle, where M−1 wraps back to 0. A request id is hashed and dropped onto that ring as a point. Servers get the same treatment: hash the server id (any stable hash is fine), take it mod M, and drop the server on the ring too. The lecture's sketch puts server 1 at position 19 when M is 30.",
      bullets: [
        "One ring, one hash space, both keys and servers live on it.",
        "Servers are points, not slots numbered 0 to N−1.",
        "M is the size of the hash space, not the number of machines."
      ]
    },
    {
      heading: "Walk clockwise to the owner",
      body: "A request is owned by the first server you meet walking clockwise from the key's point. That is the whole lookup. Keys that fall in the arc between two servers all belong to the server at the clockwise end of that arc. If hashes are uniform, arc lengths are uniform on average, so the expected load is still about 1/N — the same balance modulo gave you, without storing N inside the formula."
    },
    {
      heading: "Adding a server only splits one arc",
      body: "Place S4 on the ring inside some existing arc. Only the keys that now see S4 first change owner; they move off the server that used to own that whole arc. Every other server keeps exactly the keys it had. In the lecture's picture S3 was serving three requests in a wide gap; after S4 lands in that gap, two of them stick to S4 and S3 drops to one. S0, S1, and S2 do not notice. That is the 'shave a little from one slice' picture, and it is why caches mostly survive a scale-out."
    },
    {
      heading: "Removing a server hands the arc onward",
      body: "If S1 loses power, delete its point. The keys that were walking to S1 keep walking and fall on the next living server clockwise. Nobody else moves. The design is minimal: one crash relocates one arc, not the whole key space. The next server in line absorbs that arc, which is correct and can also be painful."
    },
    {
      heading: "Few real servers make lumpy arcs",
      body: "Uniform is an expectation, not a promise, and with only four points the ring can easily put half the keys on one machine. More servers would smooth this out by chance, but you may not have more servers. The fix is <b>virtual nodes</b>: run K hash functions (or hash the server id with K salts) so each physical machine occupies K points on the ring. K around log of the key space is the lecture's rule of thumb. With K = 3, four machines become twelve points and a single unlucky gap gets much less likely."
    },
    {
      heading: "Joins and leaves stay fair",
      body: "Remove a machine and you delete all K of its points. Each point's arc falls on whoever sits clockwise of it, and those neighbors are usually different machines, so the orphaned load spreads instead of landing on one victim. Add a machine and its K new points each steal a small arc from someone else. Expected movement stays small, and the load shift is spread out. This is why the same trick shows up in web caches, databases, and load balancers: elasticity without a full reshuffle.",
      bullets: [
        "Lookup is still 'next point clockwise', whether the point is physical or virtual.",
        "A virtual node is a ring position, not an extra computer you pay for.",
        "Clients that need a key only from one owner must follow the ring or they will miss the cache."
      ]
    }
  ],

  keyTerms: [
    { term: "Hash ring", def: "Positions 0 .. M−1 bent into a circle so the space wraps around." },
    { term: "Clockwise owner", def: "The first server point at or after a key, walking one direction around the ring." },
    { term: "Arc", def: "The span of keys owned by one server point: everything since the previous point." },
    { term: "Minimal disruption", def: "A join or leave moves only the keys in the affected arcs, not the whole space." },
    { term: "Virtual node", def: "One of K ring positions that all map back to the same physical server." },
    { term: "K hashes", def: "K functions or salts per server id. The lecture suggests K near log of the space." },
    { term: "Skew", def: "Uneven arcs when too few points are on the ring, so one server eats half the keys." }
  ],

  tradeoffs: [
    { pro: "Adding or removing a node moves about 1/N of the keys, so caches stay warm.", con: "With few physical points the arcs are lumpy and one server can own far more than 1/N." },
    { pro: "Virtual nodes smooth the load without buying more machines.", con: "More points mean more ring metadata, and a crash moves K arcs instead of one (spread across neighbors, but more bookkeeping)." },
    { pro: "The same ring works for caches, shard maps, and balancer backends.", con: "Every client or router must share the ring view, or they will disagree about the owner." }
  ],

  interviewTips: [
    "Open with the failure you are fixing: hash % N remaps almost everything when N changes.",
    "Draw the ring, place both keys and servers, and say 'clockwise next server' before any code.",
    "Show a join: only one arc splits. Show a leave: that arc falls on the next server. Name the cache win.",
    "Admit skew with a handful of nodes, then introduce K virtual nodes and why removal then spreads.",
    "Cite two homes: a cache tier (memcached-style) and a database shard map. Same ring, different payload."
  ],

  scene: {
    nodes: [
      { id: "p0", label: "0", type: "point", pos: [7, 0, 0], color: "#334155" },
      { id: "p1", label: "", type: "point", pos: [6.1, 0, 3.5], color: "#334155" },
      { id: "p2", label: "", type: "point", pos: [3.5, 0, 6.1], color: "#334155" },
      { id: "p3", label: "", type: "point", pos: [0, 0, 7], color: "#334155" },
      { id: "p4", label: "", type: "point", pos: [-3.5, 0, 6.1], color: "#334155" },
      { id: "p5", label: "", type: "point", pos: [-6.1, 0, 3.5], color: "#334155" },
      { id: "p6", label: "M/2", type: "point", pos: [-7, 0, 0], color: "#334155" },
      { id: "p7", label: "", type: "point", pos: [-6.1, 0, -3.5], color: "#334155" },
      { id: "p8", label: "", type: "point", pos: [-3.5, 0, -6.1], color: "#334155" },
      { id: "p9", label: "", type: "point", pos: [0, 0, -7], color: "#334155" },
      { id: "p10", label: "", type: "point", pos: [3.5, 0, -6.1], color: "#334155" },
      { id: "p11", label: "", type: "point", pos: [6.1, 0, -3.5], color: "#334155" },

      { id: "s0", label: "S0", type: "server", pos: [5.2, 0, 4.6] },
      { id: "s1", label: "S1", type: "server", pos: [-5.2, 0, 4.6] },
      { id: "s2", label: "S2", type: "server", pos: [-5.2, 0, -4.6] },
      { id: "s3", label: "S3", type: "server", pos: [5.2, 0, -4.6] },

      { id: "k1", label: "req", type: "point", pos: [6.6, 0.4, 2.2], color: "#4ade80" },
      { id: "k2", label: "req", type: "point", pos: [1.5, 0.4, 6.8], color: "#4ade80" },
      { id: "k3", label: "req", type: "point", pos: [-6.8, 0.4, 1.4], color: "#4ade80" },
      { id: "k4", label: "req", type: "point", pos: [-2.2, 0.4, -6.6], color: "#4ade80" },
      { id: "k5", label: "req", type: "point", pos: [4.4, 0.4, -5.4], color: "#4ade80" },
      { id: "noteRule", label: "Walk clockwise to the next server", type: "note", pos: [0, 3.6, 0] },

      { id: "s4", label: "S4", type: "server", pos: [0, 0, -5.4], showAt: 2, color: "#fb923c" },
      { id: "noteAdd", label: "Only S3's arc splits", type: "note", pos: [0, 3.2, -8], showAt: 2 },

      { id: "noteSkew", label: "4 points: one arc can hold half the keys", type: "note", pos: [0, 4.2, 0], showAt: 4 },

      { id: "v1", label: "S3'", type: "point", pos: [7.4, 0.6, -0.6], showAt: 5, color: "#c084fc" },
      { id: "v2", label: "S3''", type: "point", pos: [-7.4, 0.6, -0.6], showAt: 5, color: "#c084fc" },
      { id: "v3", label: "S0'", type: "point", pos: [0.8, 0.6, 7.4], showAt: 5, color: "#60a5fa" },
      { id: "v4", label: "S1'", type: "point", pos: [-7.2, 0.6, 2.4], showAt: 5, color: "#fbbf24" },
      { id: "v5", label: "S2'", type: "point", pos: [2.6, 0.6, -7.2], showAt: 5, color: "#fb7185" },
      { id: "v6", label: "S4'", type: "point", pos: [7.2, 0.6, 2.8], showAt: 5, color: "#fb923c" },
      { id: "noteK", label: "K hashes each → 12 points, not 4", type: "note", pos: [0, 4.4, 0], showAt: 5 }
    ],
    edges: [
      { from: "k1", to: "s0", label: "cw" },
      { from: "k2", to: "s1", label: "cw" },
      { from: "k3", to: "s2", label: "cw" },
      { from: "k4", to: "s3", label: "cw" },
      { from: "k5", to: "s3", label: "cw" },
      { from: "k4", to: "s4", showAt: 2, dashed: true },
      { from: "k5", to: "s4", showAt: 2, dashed: true }
    ],
    steps: [
      {
        title: "Keys and servers on one ring",
        text: "The hash space is a circle from 0 to M−1. Request ids and server ids are both hashed onto it. Ownership is no longer 'mod N'.",
        highlight: ["s0", "s1", "s2", "s3", "p0"],
        hide: ["k4", "k5"]
      },
      {
        title: "Clockwise wins",
        text: "From a key, walk clockwise and stop at the first server. That arc is its load. Uniform hashes make those arcs similar, so expected load is still about 1/N.",
        highlight: ["k1", "k2", "k3", "s0", "s1", "s2"],
        flows: [
          { from: "k1", to: "s0", color: "#4ade80" },
          { from: "k2", to: "s1", color: "#4ade80" },
          { from: "k3", to: "s2", color: "#4ade80" },
          { from: "k4", to: "s3", color: "#4ade80" },
          { from: "k5", to: "s3", color: "#4ade80" }
        ]
      },
      {
        title: "S4 joins inside one arc",
        text: "The new server lands in S3's wide gap. The two keys now clockwise of S4 move to it. S3 keeps what remains. S0, S1, and S2 are untouched, so their caches stay valid.",
        highlight: ["s4", "s3"],
        hide: ["noteRule"],
        flows: [
          { from: "k4", to: "s4", color: "#fb923c", label: "moved" },
          { from: "k5", to: "s4", color: "#fb923c", label: "moved" },
          { from: "k1", to: "s0", color: "#4ade80" }
        ]
      },
      {
        title: "S1 loses power",
        text: "Delete S1's point. Only the keys that were heading for S1 continue clockwise to the next living server. The rest of the ring does not reshuffle.",
        highlight: ["s2"],
        fail: ["s1"],
        hide: ["s4", "noteAdd"],
        flows: [
          { from: "k2", to: "s2", color: "#f87171", label: "failover" }
        ]
      },
      {
        title: "Four points is a lumpy ring",
        text: "Theory says 1/N. With only four servers a single gap can swallow about half the keys. Buying nothing new will not fix a sparse ring.",
        highlight: ["s3", "noteSkew"],
        hide: ["s4", "noteAdd"]
      },
      {
        title: "Virtual nodes fill the gaps",
        text: "Hash each server id K times. K = 3 turns 4 machines into 12 points. A crash now drops K small arcs onto several neighbors instead of one fat arc onto one victim.",
        highlight: ["v1", "v2", "v3", "v4", "v5", "v6"],
        hide: ["noteSkew", "noteRule"]
      },
      {
        title: "Same idea, many homes",
        text: "Web caches, database shards, and load balancers all want this: add or remove a node and move about 1/N of the keys. The ring is the assignment table.",
        highlight: ["s0", "s1", "s2", "s3", "v1", "v2", "v3"]
      }
    ]
  }
});
