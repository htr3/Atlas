window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 18,
  title: "Least Common Ancestor - Dynamic Programming on Graphs",
  video: "https://www.youtube.com/watch?v=ctZ7fjMbPWE",
  category: "Competitive Programming",
  tagline: "Binary lifting: parent[u][k] is the 2^k ancestor, LCA in O(log n).",
  summary: "LCA of two tree nodes is the deepest vertex that is an ancestor of both. Climbing one parent at a time is O(n) per query and too slow for HLD or Euler-tour algorithms that call LCA often. Store only power-of-two ancestors with the DP parent[u][k] = parent[parent[u][k-1]][k-1], lift the deeper node to the same depth, then jump both until they would meet, and return the parent of the landing nodes.",

  theory: [
    {
      heading: "Meet by walking up, slowly",
      body: "A tree is a graph. The <b>lowest common ancestor</b> of A and B is the deepest node that sits on both unique paths to the root. In the lecture's tree, LCA(8, 11) = 1: 8 climbs through 4 and 2, 11 climbs through 7, and they first share 1. LCA(5, 8) = 2, which is more interesting — they meet below the root. The cartoon algorithm sends both nodes up one parent at a time until the sets collide. On a path-like tree that is <b>O(n) per query</b>. Heavy-light decomposition, Euler tours, and most tree-path tricks call LCA many times, so O(n) is the thing we are here to kill.",
      bullets: [
        "LCA is the first shared node on the two rootward paths.",
        "Unbalanced height can be n−1, so one-step climbs are linear.",
        "Short name used everywhere: LCA."
      ]
    },
    {
      heading: "Divide the jump, then only keep powers of two",
      body: "Want the ancestor of 12 at height 4 (node 1). Jumping 4 in one shot is unknown, so split: go to the ancestor at height 2 (node 4), then from there another height 2. Recurrence: the parent of u at height H is the parent-at-H/2 of the parent-at-H/2. Base: height 1 is the ordinary parent from a BFS. Storing every H for every u is <code>O(n²)</code> precomputation on a skinny tree. You do not need height 3, 5, 6, … — only <b>1, 2, 4, 8, …</b>. There are log n of those, so a table of size <code>n log n</code>. Dividing a power of two never lands on a missing height.",
      bullets: [
        "parent(u, H) = parent(parent(u, H/2), H/2).",
        "parent(u, 1) = BFS parent.",
        "Store H = 2^k only; index the table by k, not by H."
      ]
    },
    {
      heading: "The 2D DP table",
      body: "Let <code>up[u][k]</code> be the 2^k-th ancestor of u (or 0 / u if you walk off the root). Fill k = 0 from the BFS parent. Then for k = 1..LOG, for every u, <code>up[u][k] = up[ up[u][k-1] ][k-1]</code> — 'the 2^{k-1} ancestor of my 2^{k-1} ancestor is my 2^k ancestor'. That is the whole precomputation, <b>O(n log n)</b> time and memory. The lecture writes the same fact with exponents: if H = 2^x then you look up x−1 twice. No recursive search at query time; the table is already dense.",
      bullets: [
        "up[u][0] = parent[u].",
        "up[u][k] = up[up[u][k-1]][k-1].",
        "LOG = ceil(log2(n)); root's higher ancestors stay root or 0 — pick one convention."
      ]
    },
    {
      heading: "First bring both nodes onto the same depth",
      body: "Depths come from the same BFS. If depth(A)=5 and depth(B)=4, A must climb 1 = 5−4, which is a single 2^0 jump already in the table. If the gap were 3 = 11₂, climb 2^1 then 2^0. If it were 7 = 111₂, climb 4, then 2, then 1. Any distance is a sum of bits, so you walk k from LOG down to 0 and, when bit k of the gap is set, replace the deeper node with <code>up[node][k]</code>. After this, A and B sit at the same depth. If they are already the same vertex, that vertex is the LCA (one was an ancestor of the other).",
      bullets: [
        "Always lift the deeper node; swap if needed.",
        "Gap g uses the bits of g, each a power-of-two jump.",
        "Equal nodes after leveling: return that node."
      ]
    },
    {
      heading: "Binary lift without meeting, then take parent",
      body: "Now A and B are at the same depth and still different. From the highest k down: tentatively look at <code>up[A][k]</code> and <code>up[B][k]</code>. If those two ancestors are <i>different</i>, the jump is safe — you have not crossed the LCA — so commit A and B to those ancestors. If they are equal, the jump of size 2^k would land on the LCA or above it, and you would no longer know how far down the meeting was; skip that k. When every bit is processed, A and B are the two children of the LCA (the algorithm always stops one below). Return <code>up[A][0]</code> (or <code>up[B][0]</code>). In the lecture, a depth-4 pair rejects a jump of 4, accepts a jump of 2, rejects a jump of 1 because the size-1 ancestors coincide, and reports the parent of the landing nodes.",
      bullets: [
        "Never jump to a pair of equal ancestors; that overshoots.",
        "High bit to low bit, same direction you used to equalize depth.",
        "Terminated one below the LCA: parent[0] is a table hit, not a walk."
      ]
    },
    {
      heading: "Query time and where this is used",
      body: "Each query inspects O(log n) bits to equalize depth and O(log n) bits to lift in lockstep, so <b>O(log n) per LCA</b> after the O(n log n) table. That is the building block the next graph-DP talks (and heavy-light decomposition) assume you already have. Euler-tour + RMQ is another LCA; this lecture is the binary-lifting DP on the parent array.",
      bullets: [
        "Preprocess O(n log n), query O(log n).",
        "Needed for path aggregates, HLD, and 'distance = dep[a]+dep[b]−2 dep[lca]'.",
        "Get the parent convention at the root right or every query that climbs to 1 will break."
      ]
    }
  ],

  keyTerms: [
    { term: "LCA", def: "Deepest node that is an ancestor of both query vertices; LCA(8,11)=1, LCA(5,8)=2 in the talk." },
    { term: "Binary lifting", def: "Jump 2^k parents at a time using a precomputed table instead of walking one edge." },
    { term: "up[u][k]", def: "The 2^k-th ancestor of u; filled by DP from k=0 parents." },
    { term: "Depth", def: "Distance from the root, computed once with BFS or DFS." },
    { term: "Equalize depth", def: "Lift the deeper node by dep[u]−dep[v] using the bits of that gap." },
    { term: "Safe jump", def: "A 2^k lift of both nodes whose images are still different; it cannot have passed the LCA." },
    { term: "Parent at height 1", def: "Ordinary tree parent; base case of the recurrence and the final LCA return." },
    { term: "O(n log n) table", def: "n nodes times log n powers of two; the price of O(log n) queries." }
  ],

  tradeoffs: [
    { pro: "O(log n) LCA after a simple DP; easy to code from the parent array.", con: "O(n log n) memory; Euler-tour + sparse table is also O(n log n) but answers via RMQ." },
    { pro: "Only powers of two are stored, not every height, so you avoid O(n²).", con: "Must equalize depths first; lifting two nodes at different depths is a wrong LCA." },
    { pro: "Same table gives k-th ancestor and tree distance for free.", con: "One-step climbs are simpler and fine if you truly have one query on a small tree." },
    { pro: "Standard prerequisite for HLD and many path-query problems.", con: "Root ancestor convention (self vs 0) is a frequent silent WA." }
  ],

  interviewTips: [
    "Give LCA(8,11)=1 and LCA(5,8)=2 so it is clear you mean lowest, not the root.",
    "Write up[u][k] = up[up[u][k-1]][k-1] and say you store powers of two, not every height.",
    "Always lift the deeper node to the same depth before the parallel climb.",
    "Walk bits high to low; skip a jump when the two 2^k ancestors are equal.",
    "Return parent of the landing nodes — the loop stops one below the LCA.",
    "Quote preprocess O(n log n), query O(log n), and name HLD as a client of this primitive."
  ],

  scene: {
    nodes: [
      { id: "t1", label: "1", type: "server", pos: [-2, 0, 6.2], color: "#c084fc" },
      { id: "t2", label: "2", type: "server", pos: [-6, 0, 2.6], color: "#60a5fa" },
      { id: "t7", label: "7", type: "server", pos: [2.2, 0, 2.6], color: "#60a5fa" },
      { id: "t4", label: "4", type: "server", pos: [-9, 0, -0.8], color: "#4ade80" },
      { id: "t5", label: "5", type: "server", pos: [-3, 0, -0.8], color: "#fb923c" },
      { id: "t11", label: "11", type: "server", pos: [2.2, 0, -0.8], color: "#fb923c" },
      { id: "t8", label: "8", type: "server", pos: [-9, 0, -4.2], color: "#f87171" },
      { id: "t12", label: "12", type: "server", pos: [-9, 0, -7.4], color: "#f87171" },
      { id: "p0", label: "up 2^0", type: "cache", pos: [7.2, 0, 6.2], showAt: 2 },
      { id: "p1", label: "up 2^1", type: "cache", pos: [10.5, 0, 2.6], showAt: 3 },
      { id: "p2", label: "up 2^2", type: "cache", pos: [7.2, 0, -0.8], showAt: 3 },
      { id: "dp", label: "DP table", type: "db", pos: [10.5, 0, -4.2], showAt: 3 },
      { id: "n0", label: "LCA(8,11)=1", type: "note", pos: [2, 3, 7.6] },
      { id: "n1", label: "O(n) climb", type: "note", pos: [10, 3, 7.6], showAt: 1 },
      { id: "n2", label: "H = 2 × H/2", type: "note", pos: [-10, 3, 7.6], showAt: 2 },
      { id: "n3", label: "O(log n) query", type: "note", pos: [10, 3, -7.4], showAt: 7 }
    ],
    edges: [
      { from: "t1", to: "t2" },
      { from: "t1", to: "t7" },
      { from: "t2", to: "t4" },
      { from: "t2", to: "t5" },
      { from: "t7", to: "t11" },
      { from: "t4", to: "t8" },
      { from: "t8", to: "t12" },
      { from: "p0", to: "p1", label: "k+1", showAt: 3 },
      { from: "p1", to: "p2", showAt: 3 },
      { from: "p2", to: "dp", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "First shared ancestor",
        text: "8 climbs 4 then 2 then 1. 11 climbs 7 then 1. They meet at 1, so LCA(8,11)=1. 5 and 8 both climb into 2, so LCA(5,8)=2 — not the root. That node is the deepest vertex on both rootward paths.",
        highlight: ["t1", "t8", "t11", "t5", "t2", "n0"],
        hide: ["n1", "n2", "n3", "p0", "p1", "p2", "dp"],
        flows: [
          { from: "t8", to: "t4", color: "#f87171", label: "up" },
          { from: "t11", to: "t7", color: "#fb923c", label: "up" }
        ]
      },
      {
        title: "One parent at a time is O(n)",
        text: "A path-shaped tree has height n. Each LCA walks that spine. HLD, Euler tours, and path queries call LCA over and over, so linear per call is the bottleneck. We need jumps of more than one edge.",
        highlight: ["t12", "t8", "t4", "t2", "t1", "n1"],
        hide: ["n0", "n2", "n3", "p1", "p2", "dp"],
        fail: ["t12"],
        flows: [
          { from: "t12", to: "t1", color: "#f87171", label: "n steps" }
        ]
      },
      {
        title: "Split height H into H/2 + H/2",
        text: "12 wants ancestor 1 at height 4. Jump to 4 (height 2), then from 4 another height 2 lands on 1. Recurrence: parent(u,H) = parent(parent(u,H/2), H/2). Base H=1 is the BFS parent, already sitting in up[u][0].",
        highlight: ["t12", "t4", "t1", "p0", "n2"],
        hide: ["n0", "n1", "n3", "p1", "p2", "dp"],
        flows: [
          { from: "t12", to: "t4", color: "#4ade80", label: "H/2" },
          { from: "t4", to: "t1", color: "#4ade80", label: "H/2" }
        ]
      },
      {
        title: "Store only 2^k ancestors",
        text: "Filling every height is O(n²) on a stick. Keep heights 1,2,4,8. DP: up[u][k] = up[up[u][k-1]][k-1]. n nodes times log n columns is O(n log n). Halving a power of two never asks for a column you did not store.",
        highlight: ["p0", "p1", "p2", "dp", "t1"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "p0", to: "p1", color: "#c084fc", label: "DP" },
          { from: "p1", to: "p2", color: "#c084fc", label: "2^k" }
        ]
      },
      {
        title: "Lift the deeper node onto the same depth",
        text: "Depths come from BFS. A node at depth 5 and a node at depth 4: climb the deep one by 1. A gap of 3=11₂ is a jump of 2 then 1. Any gap is bits; walk k from LOG down to 0. If they coincide after this, the upper node was already the LCA.",
        highlight: ["t12", "t11", "t8", "p0"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "t12", to: "t8", color: "#fb923c", label: "gap 1" }
        ]
      },
      {
        title: "Reject jumps that would land together",
        text: "Both at depth 4. A jump of 4 overshoots the tree — skip. A jump of 2 lands on two different nodes — take it. A jump of 1 would put both on the same ancestor — skip, or you lose how far down they met. Bits go high to low.",
        highlight: ["t8", "t11", "t4", "t7", "t2"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "t8", to: "t4", color: "#4ade80", label: "2 ok" },
          { from: "t11", to: "t7", color: "#4ade80", label: "2 ok" },
          { from: "t4", to: "t2", color: "#f87171", label: "1 skip" }
        ]
      },
      {
        title: "LCA is the parent of the landing pair",
        text: "When the bits run out, A and B sit one below the meeting point. Return up[A][0] — already computed. That is LCA of the original pair. The loop is written so they never become equal in the table walk.",
        highlight: ["t2", "t4", "t7", "t5", "t8"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "t4", to: "t2", color: "#c084fc", label: "par" },
          { from: "t7", to: "t1", color: "#c084fc", label: "par" }
        ]
      },
      {
        title: "O(log n) and the rest of tree DP",
        text: "Preprocess O(n log n), each LCA O(log n). Distance is dep[a]+dep[b]−2·dep[lca]. Heavy-light decomposition and the next graph-DP lectures assume this jump table already exists.",
        highlight: ["t1", "t12", "dp", "n3"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "t12", to: "t1", color: "#c084fc", label: "lift" }
        ]
      }
    ]
  }
});
