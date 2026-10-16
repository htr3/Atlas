window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 17,
  title: "Dynamic Programming with Bitmasks",
  video: "https://www.youtube.com/watch?v=bjucBkxrMBs",
  category: "Competitive Programming",
  tagline: "TSP-style DP on bad nodes: mask, current vertex, stuffed count.",
  summary: "CodeChef CCAM counts Hamiltonian paths on an almost-complete graph: n! minus the layouts that use a missing edge. Inclusion-exclusion works but the lecture's faster path isolates the ≤14 'bad' vertices, stuffs good vertices into illegal gaps, and memoizes (visited-mask, current, tied) like traveling salesman. States are O(M² 2^M), transitions another M, so about O(M³ 2^M).",

  theory: [
    {
      heading: "A permutation is a path that only uses real edges",
      body: "Lay the n vertices in a line. The layout is <b>valid</b> when every consecutive pair is an edge. On a complete graph that is every one of the <code>n!</code> permutations. The CodeChef graph is <i>almost</i> complete: in the drawing, 1—6 is missing (a dotted violet edge). <code>2,3,4,6,1,5</code> dies because 6→1 is absent. <code>2,3,4,6,5,1</code> lives: 6→5 and 5→1 both exist. The job is to count the valid layouts. Equivalently, compute n! minus the invalid ones; n! is the easy term.",
      bullets: [
        "Directed missing edges matter: 1→6 absent does not automatically kill 6→1.",
        "n! is the complete-graph baseline.",
        "We mainly spend work on the invalid (or, later, the valid) remainder."
      ]
    },
    {
      heading: "Inclusion-exclusion is the backup",
      body: "Start with n!. Subtract every permutation that contains a particular missing edge (treat that pair as glued). Subtract each missing edge this way. Permutations that contain two missing edges were subtracted twice, so add them back — classic inclusion-exclusion. It will often pass the time limit. The lecture still wants a better asymptotic, and that better algorithm is bitmask DP.",
      bullets: [
        "Gluing one forbidden pair overcounts layouts that glue two.",
        "IE is enough to AC some versions; DP is the topic of the video.",
        "When many edges are missing, IE's 2^{#missing} also hurts."
      ]
    },
    {
      heading: "Bad nodes, stuffed gaps",
      body: "Only vertices incident to a missing edge can break a permutation. Call them <b>bad</b>; the lecture adds a second missing edge 1→5 so the bad set is {1,5,6} and M ≤ 14 in the constraints (S ≤ 14). All other vertices are <b>good</b> and may sit anywhere. For a fixed order of the bad vertices, each consecutive bad pair that is a missing edge needs at least one good vertex stuffed between them. Arrangement 1,5,6 needs a stuffed node between 1 and 5; 1,6,5 needs two stuffed nodes, one in each illegal gap. Let x be how many good vertices you tie down this way, B = M.",
      bullets: [
        "Good vertices: n − B of them, free of missing-edge drama.",
        "x = number of stuffed placeholders forced by the bad order.",
        "You never permute 14! bad orders by brute force — that is ~ 8.7·10^10."
      ]
    },
    {
      heading: "Two strings and a binomial merge",
      body: "Good vertices can be ordered in <code>(n−B)!</code> ways. The bad skeleton, with x stuffed slots glued next to the vertices that need them, is not a free string of length B+x: those x positions are locked, so the skeleton only offers <b>B movable slots</b>. Remaining unstuffed goods are a second string of length <code>n−B−x</code>. Interleavings that keep both relative orders are <code>C(n−x, B) = (n−x)! / (B! (n−B−x)!)</code>. Multiply: each completed bad order with a given x contributes <code>(n−B)! · (n−x)! / (B! (n−B−x)!)</code>. Sum that over every bad permutation (and its x). Direct summation is M!, which is the infeasible number we just named.",
      bullets: [
        "Locked stuffed slots do not count as merge positions.",
        "Lengths n−B−x and B merge into a sequence of length n−x.",
        "The formula is the base case of the DP, not something you loop M! times."
      ]
    },
    {
      heading: "TSP state, plus how many nodes you already tied",
      body: "Traveling salesman DP remembers (set of cities visited, city you are in) and discards a tour that arrives with a worse cost. Here the 'cities' are the bad vertices. The extra coordinate is <b>how many good vertices you have already stuffed</b> — two different paths can reach the same current vertex with the same visited set but a different tied count (1-2-3 might stuff once, 1-2-4 stuff twice if 2→4 is illegal). So a state is <code>dp[mask][cur][tied]</code>. If you have already computed that triple, you return it: the path 1-2-4-3 that hits (mask={1,2,3}, cur=3, tied=1) is a cache hit against an earlier 1-2-3.",
      bullets: [
        "mask: subset of bad vertices already placed, a bit per vertex.",
        "cur: which bad vertex is at the end of the prefix.",
        "tied: stuffed goods used so far (0..M is enough in the lecture)."
      ]
    },
    {
      heading: "Recurrence, base, complexity",
      body: "From <code>(mask, cur, tied)</code> try every unused bad vertex nxt. If cur→nxt is missing, the transition costs one extra stuffed node (tied+1), else tied stays. New mask sets bit nxt; new current is nxt. When mask is full you are done placing bad vertices: add the merge formula for that tied = x and stop. Uncomputed states branch; computed states return. Maskes: 2^M. Current: M. Tied: M. Transitions: M. Product <b>O(M³ 2^M)</b> (the video writes this as M² 2^M states times an M-way branch, and loosely as n² 2^M). For M=14 that is tens of millions, not 14!. Bitmask DP is the standard hammer whenever n ≤ 20 or an important subset is that small.",
      bullets: [
        "Base: full mask → plug x=tied into the two-string formula.",
        "Transition: try each remaining bad vertex, bump tied on a missing edge.",
        "M=14: 14! TLE, 14³·2^14 is contest-legal with a tight loop."
      ]
    }
  ],

  keyTerms: [
    { term: "Valid permutation", def: "An ordering v1..vn where every (vi, vi+1) is an edge of the graph." },
    { term: "Bad node", def: "A vertex incident to at least one missing edge; at most 14 of them here." },
    { term: "Stuffed node", def: "A good vertex parked in a gap so two bad vertices are no longer adjacent." },
    { term: "Bitmask", def: "Integer whose bits record which bad vertices are already in the prefix." },
    { term: "TSP-style DP", def: "Memoize (visited set, location) so a cheaper (or already counted) arrival prunes work." },
    { term: "tied / x", def: "How many goods have been locked into illegal gaps so far." },
    { term: "Merge binomial", def: "(n−x)! / (B! (n−B−x)!) interleavings of B skeleton slots with n−B−x free goods." },
    { term: "CCAM", def: "CodeChef problem that counts Hamiltonian layouts on an almost-complete graph." }
  ],

  tradeoffs: [
    { pro: "Bitmask DP turns M! enumeration into O(M³ 2^M).", con: "Memory is 2^M · M · M integers; M=20 is already a tight squeeze." },
    { pro: "Only the bad subset is exponentiated; n can be larger than 14.", con: "If missing edges touch everyone, M=n and you are back to full TSP size." },
    { pro: "Inclusion-exclusion is shorter to code and often ACs.", con: "Worse asymptotic once many edges are missing; easy to drop a sign." },
    { pro: "Same pattern as classic TSP / Hamiltonian-path counts.", con: "Forgetting the tied dimension merges two different x values and wrongs the formula." }
  ],

  interviewTips: [
    "Define a valid permutation as 'every consecutive pair is an edge', then n! minus illegal.",
    "Compress to vertices that touch a missing edge; M≤20 is the bitmask tell.",
    "Write the state as dp[mask][last][tied] and say it is TSP plus a stuffed counter.",
    "On a missing cur→nxt, increment tied; on a full mask, add the binomial merge, do not recurse.",
    "Quote 14! ≈ 8.7e10 vs 14³·2^14 ≈ 4.5e7 so the examiner hears why DP exists.",
    "If n≤18 and every vertex is interesting, drop tied and run ordinary O(n² 2^n) path DP."
  ],

  scene: {
    nodes: [
      { id: "n1", label: "1", type: "server", pos: [-6, 0, 5.2], color: "#f87171" },
      { id: "n2", label: "2", type: "server", pos: [-10.5, 0, 2], color: "#60a5fa" },
      { id: "n3", label: "3", type: "server", pos: [-10.5, 0, -2], color: "#60a5fa" },
      { id: "n4", label: "4", type: "server", pos: [-6, 0, -5.2], color: "#60a5fa" },
      { id: "n5", label: "5", type: "server", pos: [-1.5, 0, -2], color: "#fb923c" },
      { id: "n6", label: "6", type: "server", pos: [-1.5, 0, 5.2], color: "#fb923c" },
      { id: "bad", label: "bad", type: "zone", pos: [-3.8, 0, 1.6], size: [9.5, 10], showAt: 2 },
      { id: "m1", label: "mask 001", type: "cache", pos: [5.5, 0, 5.2], showAt: 5 },
      { id: "m2", label: "mask 011", type: "cache", pos: [10.2, 0, 5.2], showAt: 5 },
      { id: "cur", label: "cur=3", type: "service", pos: [5.5, 0, 1.2], showAt: 5 },
      { id: "tie", label: "tied=1", type: "worker", pos: [10.2, 0, 1.2], showAt: 5 },
      { id: "hit", label: "DP hit", type: "lb", pos: [7.8, 0, -2.6], showAt: 6 },
      { id: "n0", label: "need every edge", type: "note", pos: [-8, 3, 7.6] },
      { id: "n1n", label: "1-6 missing", type: "note", pos: [8, 3, 7.6], showAt: 1 },
      { id: "n2n", label: "stuff gaps, x", type: "note", pos: [-8, 3, -7.4], showAt: 3 },
      { id: "n3n", label: "O(M^3 2^M)", type: "note", pos: [8, 3, -7.4], showAt: 7 }
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
      { from: "n4", to: "n5" },
      { from: "n5", to: "n6" },
      { from: "n2", to: "n4", dashed: true },
      { from: "n3", to: "n6", dashed: true },
      { from: "n1", to: "n6", label: "missing", dashed: true },
      { from: "n1", to: "n5", label: "missing", showAt: 2, dashed: true },
      { from: "m1", to: "m2", label: "set bit", showAt: 5 },
      { from: "cur", to: "hit", showAt: 6, dashed: true },
      { from: "tie", to: "hit", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Layouts that walk real edges",
        text: "A permutation of the six vertices is valid only if every consecutive pair is an edge. 2-3-4-6-1 dies: 6→1 is the dotted missing edge. 2-3-4-6-5-1 lives. Complete graph: n! survivors. Here we count the ones that avoid holes.",
        highlight: ["n1", "n2", "n3", "n4", "n5", "n6", "n0"],
        hide: ["n1n", "n2n", "n3n", "m1", "m2", "cur", "tie", "hit", "bad"],
        fail: ["n1"],
        flows: [
          { from: "n2", to: "n3", color: "#4ade80", label: "ok" },
          { from: "n6", to: "n1", color: "#f87171", label: "no" }
        ]
      },
      {
        title: "Missing edges name the bad vertices",
        text: "1—6 is absent; the lecture also drops 1—5. Only {1,5,6} can ruin a layout. Everyone else is good. Inclusion-exclusion can subtract glued forbidden pairs, but the DP will work on this tiny bad set (M ≤ 14).",
        highlight: ["n1", "n5", "n6", "bad", "n1n"],
        hide: ["n0", "n2n", "n3n", "m1", "m2", "cur", "tie", "hit"],
        fail: ["n1", "n5"],
        flows: [
          { from: "n1", to: "n6", color: "#f87171", label: "hole" },
          { from: "n1", to: "n5", color: "#f87171", label: "hole" }
        ]
      },
      {
        title: "Stuff a good vertex into each illegal gap",
        text: "Permute the bad vertices. Order 1,5,6 needs one stuffed good between 1 and 5. Order 1,6,5 needs two stuffed goods. x is that count. Goods themselves permute in (n−B)! ways and do not create new holes.",
        highlight: ["n1", "n5", "n6", "n2", "n2n"],
        hide: ["n0", "n1n", "n3n", "m1", "m2", "cur", "tie", "hit"],
        flows: [
          { from: "n2", to: "n1", color: "#fb923c", label: "stuff" },
          { from: "n2", to: "n5", color: "#fb923c", label: "gap" }
        ]
      },
      {
        title: "Merge two strings, not B+x slots",
        text: "Stuffed positions are glued, so the skeleton only offers B free slots. Remaining goods are a string of length n−B−x. Interleavings: (n−x)! / (B! (n−B−x)!), times (n−B)!. Summing that over every bad order is M! work — 14! is about 10^11.",
        highlight: ["n2", "n3", "n4", "n1", "n5", "n2n"],
        hide: ["n0", "n1n", "n3n", "m1", "m2", "cur", "tie", "hit"],
        flows: [
          { from: "n3", to: "n4", color: "#60a5fa", label: "goods" }
        ]
      },
      {
        title: "State = mask, current, tied",
        text: "Like TSP: remember which bad vertices are already placed and where you stand. Add tied, the stuffed count, because two prefixes can share mask and current but not x. From 1 you try 2, 3, 4, … setting bits as you go.",
        highlight: ["m1", "m2", "cur", "tie", "n1", "n5"],
        hide: ["n0", "n1n", "n2n", "n3n", "hit"],
        flows: [
          { from: "m1", to: "m2", color: "#c084fc", label: "visit" },
          { from: "n1", to: "cur", color: "#c084fc", label: "last" }
        ]
      },
      {
        title: "Same triple → return the memo",
        text: "Path 1-2-3 stuffed once and later reached node 3 with mask {1,2,3}. Path 1-2-4-3 that lands on the same triple does not walk to 4 again — it reuses dp[mask][3][1]. That is why 2^M M² states beat M! tours.",
        highlight: ["hit", "cur", "tie", "m2", "n3"],
        hide: ["n0", "n1n", "n2n", "n3n"],
        flows: [
          { from: "cur", to: "hit", color: "#4ade80", label: "memo" },
          { from: "tie", to: "hit", color: "#4ade80", label: "reuse" }
        ]
      },
      {
        title: "Full mask pays the formula",
        text: "When every bad bit is set, add the merge contribution for this x=tied and stop branching. Uncached states still try up to M next vertices. Total O(M³ 2^M). M=14 is tens of millions of tight operations, not 14!.",
        highlight: ["m2", "tie", "hit", "n3n"],
        hide: ["n0", "n1n", "n2n"],
        flows: [
          { from: "hit", to: "n3n", color: "#c084fc", label: "base" }
        ]
      },
      {
        title: "Contest pattern, not a one-off",
        text: "Bitmask DP shows up whenever a subset is ≤20: TSP, Hamiltonian paths, assignment, subset sums with order. Compress the interesting vertices first. IE remains the shorter code path if the missing-edge count is tiny and you only need AC.",
        highlight: ["n1", "n5", "n6", "m1", "m2", "n3n"],
        hide: ["n0", "n1n", "n2n"],
        flows: [
          { from: "n2", to: "n6", color: "#4ade80", label: "valid" }
        ]
      }
    ]
  }
});
