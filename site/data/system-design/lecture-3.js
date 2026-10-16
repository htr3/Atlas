window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 3,
  title: "What is Load Balancing?",
  video: "https://www.youtube.com/watch?v=K0Ta65OqQkY",
  category: "Building Blocks",
  tagline: "Spread requests with hash(id) % N — then watch the cache die when N changes.",
  summary: "One server sells an algorithm to one phone. When thousands of callers show up, you buy more servers and must spread the work. Hashing a request id and taking modulo N does that evenly, but adding one server remaps almost every key, so any per-server cache becomes garbage. That failure is why the next lecture needs consistent hashing.",

  theory: [
    {
      heading: "A server is a box that answers",
      body: "Start with one computer running one algorithm — the lecture's example is a filter that draws a mustache on a face. A customer on a phone sends a <b>request</b>, the box runs the code, and a <b>response</b> (the image) comes back. That box is a server: it serves requests. One happy user tells friends, and thousands of requests arrive. One CPU cannot keep up, so you buy a second machine. The new question is not 'can I add hardware?' but 'which machine gets this call?'"
    },
    {
      heading: "Load balancing means even work",
      body: "Each request is weight the server has to carry. With N identical servers you want each one holding about the same share, so nobody melts while a neighbor sits idle. Doing that on purpose is <b>load balancing</b>. The lecture's first tool is a hash, not a dedicated appliance: every request carries an id that looks uniformly random, you hash it, and the remainder picks a server.",
      bullets: [
        "Request id r is drawn from 0 .. M−1.",
        "Server index = hash(r) mod N.",
        "A good hash spreads keys, so each server sees about X/N of X requests. Load factor ≈ 1/N."
      ]
    },
    {
      heading: "A worked example with four servers",
      body: "Servers are S0, S1, S2, S3. Three requests show the rule. R1 = 10 hashes to 3, and 3 mod 4 = 3, so it lands on S3. R2 = 20 hashes to 15, 15 mod 4 = 3, also S3. R3 = 35 hashes to 12, 12 mod 4 = 0, so it lands on S0. Nothing is wrong with two keys sharing S3 — over many random ids the piles even out. The mapping is stable only while N stays 4."
    },
    {
      heading: "Adding S4 reshuffles the whole pie",
      body: "Traffic goes viral and you add S4, so N becomes 5. The same hashes now use mod 5. 3 mod 5 is still 3 (R1 stays). 15 mod 5 is 0, so R2 jumps from S3 to S0. 12 mod 5 is 2, so R3 jumps from S0 to S2. Think of the key space as a pie cut into N slices. Going from quarters (25% each) to fifths does not trim a neat 5% off every slice — under modulo, slice boundaries all move, and the lecture's bucket-counting walk ends with on the order of the <b>entire</b> key space being reassigned. The cost of one new server is 'almost everybody moves.'"
    },
    {
      heading: "Why that destroys caches",
      body: "Real request ids are rarely pure random numbers. They usually carry a user id, and a hash of a user id is constant. That is a feature: the same person always hits the same server, so that server can keep their profile in a local cache instead of fetching it from a database on every call. The moment N changes, those people are 'azar' — scattered onto different servers — and nearly all of that cache is useless. You paid for RAM that now holds the wrong users.",
      bullets: [
        "Stable key → stable server → cache is worth building.",
        "Modulo makes the stable server depend on N.",
        "A fleet that grows or shrinks therefore flushes itself."
      ]
    },
    {
      heading: "The shape of a better cut",
      body: "You still want five servers at about 20% each. You do not want 100% of keys to move to get there. The picture to aim for: shave a small wedge off each of the four old slices and hand those wedges to the newcomer. Total movement stays near 20%, and each old server keeps most of the range it already cached. Plain hashing cannot make that cut. That is the job of consistent hashing, which the next lecture draws as a ring."
    }
  ],

  keyTerms: [
    { term: "Server", def: "A machine that accepts a request, runs your logic, and returns a response." },
    { term: "Load", def: "The work sitting on a server. Here, the requests it has to process." },
    { term: "Load balancing", def: "Spreading requests across N servers so none carries much more than 1/N of the work." },
    { term: "Request id", def: "A number on each call, ideally uniform. Often it is really a user id." },
    { term: "hash(r) mod N", def: "Index of the server for key r. Even when the hash is good; brittle when N changes." },
    { term: "Load factor", def: "Expected share per server. With a uniform hash this is about 1/N." },
    { term: "Key remapping", def: "Keys that point at a different server after N changes. Modulo remaps most of them." },
    { term: "Local cache", def: "Data kept on the server that always sees a given user, so the database is not hit every time." }
  ],

  tradeoffs: [
    { pro: "Modulo hashing needs no extra process and splits random keys evenly.", con: "Growing or shrinking the fleet moves almost every key and throws away server-local caches." },
    { pro: "Pinning a user id to one server makes caching and sticky sessions natural.", con: "That pin is only safe if the server set is stable — the opposite of a growing product." },
    { pro: "A dedicated balancer can hide servers from clients.", con: "If its assignment rule is still 'mod N', the cache problem remains behind the balancer." }
  ],

  interviewTips: [
    "Say the goal in one sentence: each of N servers should see about 1/N of the requests.",
    "Give the formula out loud: server = hash(key) % N, and walk one numeric example.",
    "Then break it: 'I add one box and almost every key moves, so per-node caches die.' That is the bridge to consistent hashing.",
    "Mention that user id, not a random request number, is why the cache was valuable in the first place.",
    "State the target cost: adding one node should move about 1/N of the keys, not all of them."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Customer", type: "phone", pos: [-10, 0, 0] },
      { id: "s0", label: "Server S0", type: "server", pos: [2, 0, -4.5] },
      { id: "noteAlgo", label: "Algorithm in, image out", type: "note", pos: [-4, 3.2, -3] },

      { id: "s1", label: "Server S1", type: "server", pos: [6, 0, -4.5], showAt: 1 },
      { id: "noteWhere", label: "Which box gets this call?", type: "note", pos: [4, 3.2, -6.5], showAt: 1 },

      { id: "s2", label: "Server S2", type: "server", pos: [2, 0, 1.5], showAt: 2 },
      { id: "s3", label: "Server S3", type: "server", pos: [6, 0, 1.5], showAt: 2 },
      { id: "r1", label: "R1: 3 % 4 = 3", type: "note", pos: [10, 2.4, 1.5], showAt: 2 },
      { id: "r2", label: "R2: 15 % 4 = 3", type: "note", pos: [10, 1.2, 1.5], showAt: 2 },
      { id: "r3", label: "R3: 12 % 4 = 0", type: "note", pos: [10, 2.4, -4.5], showAt: 2 },

      { id: "noteEven", label: "Each server holds ~ X/N", type: "note", pos: [4, 3.4, 4.5], showAt: 3 },

      { id: "s4", label: "Server S4", type: "server", pos: [4, 0, 5.5], showAt: 4, color: "#fb923c" },
      { id: "moved", label: "mod 5 moves R2 and R3", type: "note", pos: [10, 3.4, 4], showAt: 4 },

      { id: "c0", label: "Cache", type: "cache", pos: [2, 0, -2.2], showAt: 5 },
      { id: "c1", label: "Cache", type: "cache", pos: [6, 0, -2.2], showAt: 5 },
      { id: "c2", label: "Cache", type: "cache", pos: [2, 0, 3.6], showAt: 5 },
      { id: "c3", label: "Cache", type: "cache", pos: [6, 0, 3.6], showAt: 5 },
      { id: "noteCache", label: "Same user id, same server", type: "note", pos: [-4, 3.2, 3], showAt: 5 },

      { id: "noteGoal", label: "Want ~20% moved, not ~100%", type: "note", pos: [4, 3.6, 0], showAt: 6 }
    ],
    edges: [
      { from: "phone", to: "s0", label: "request" },
      { from: "phone", to: "s1", showAt: 1, dashed: true },
      { from: "phone", to: "s2", showAt: 2, dashed: true },
      { from: "phone", to: "s3", showAt: 2, dashed: true },
      { from: "s0", to: "c0", showAt: 5 },
      { from: "s1", to: "c1", showAt: 5 },
      { from: "s2", to: "c2", showAt: 5 },
      { from: "s3", to: "c3", showAt: 5 }
    ],
    steps: [
      {
        title: "One phone, one box",
        text: "A customer sends a photo, the server runs the algorithm, and the edited image comes back. That request/response pair is the unit of load.",
        highlight: ["phone", "s0"],
        flows: [
          { from: "phone", to: "s0", color: "#4ade80", label: "photo" },
          { from: "s0", to: "phone", color: "#60a5fa", label: "image" }
        ]
      },
      {
        title: "A second server, and a routing problem",
        text: "Friends of the first user overwhelm the box, so you buy another. Both can run the algorithm. Nothing yet decides which one receives a given call.",
        highlight: ["s0", "s1"],
        flows: [
          { from: "phone", to: "s0", color: "#4ade80" },
          { from: "phone", to: "s1", color: "#4ade80" }
        ]
      },
      {
        title: "hash(id) mod 4",
        text: "Four servers. R1 hashes to 3 and 3 mod 4 stays on S3. R2 hashes to 15 and also lands on S3. R3 hashes to 12 and 12 mod 4 lands on S0.",
        highlight: ["s3", "s0"],
        flows: [
          { from: "phone", to: "s3", color: "#4ade80", label: "R1, R2" },
          { from: "phone", to: "s0", color: "#60a5fa", label: "R3" }
        ]
      },
      {
        title: "Uniform keys, uniform load",
        text: "A decent hash is spread out, so X requests become about X/N per server. With a fixed fleet this is the whole design: load factor about 1/N.",
        highlight: ["s0", "s1", "s2", "s3"]
      },
      {
        title: "S4 arrives and the pie tears",
        text: "N is now 5. R1 still maps to S3, but R2 jumps to S0 and R3 jumps to S2. Slice boundaries all move, so on the order of the whole key space gets reassigned.",
        highlight: ["s4"],
        flows: [
          { from: "s3", to: "s0", color: "#f87171", label: "R2 moved" },
          { from: "s0", to: "s2", color: "#f87171", label: "R3 moved" }
        ]
      },
      {
        title: "The cache was the point",
        text: "A user id hashes to the same server every time, so that box kept the profile in RAM. After the modulo change those users sit elsewhere and the caches hold the wrong people.",
        highlight: ["c0", "c1", "c2", "c3"],
        fail: ["c0", "c1", "c2", "c3"]
      },
      {
        title: "The cut you actually wanted",
        text: "Five servers should mean about 20% of keys on the new one, shaved a little from each old server. Modulo cannot make that cut. Consistent hashing can.",
        highlight: ["s4", "noteGoal"]
      }
    ]
  }
});
