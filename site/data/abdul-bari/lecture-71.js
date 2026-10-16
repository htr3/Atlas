window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 71,
  title: "7.3 Traveling Salesman Problem - Branch and Bound",
  video: "https://www.youtube.com/watch?v=1FEP_sNb62k",
  category: "Branch, Bound & Complexity",
  tagline: "Reduce the cost matrix; LC expands the cheapest partial tour and prunes the rest.",
  summary: "TSP asks for a shortest Hamiltonian cycle on a weighted digraph. The lecture starts at vertex 1 on a 5-city textbook matrix, reduces rows then columns, and puts that reduction cost on the root (25). Including an edge i→j zeros that row and column, forbids a premature return, and adds any new reduction to the parent cost. LC expands 1-4 (bound 25), then 1-4-2 (28), then the leaf 1-4-2-5-3-1 of length 28. Every live node with bound ≥ 28 is killed.",

  theory: [
    {
      heading: "A tour, not a path",
      body: "A weighted graph on n vertices is given as a cost matrix C, with ∞ on the diagonal (no self-loops). A salesman starts at city 1, visits every other city once, and returns to 1. That closed walk is a <b>tour</b>. The 5-vertex textbook matrix in the lecture is",
      bullets: [
        "Row 1: ∞, 20, 30, 10, 11",
        "Row 2: 15, ∞, 16, 4, 2",
        "Row 3: 3, 5, ∞, 2, 4",
        "Row 4: 19, 6, 18, ∞, 3",
        "Row 5: 16, 4, 7, 16, ∞"
      ]
    },
    {
      heading: "State space of prefixes",
      body: "On a 4-city sketch the tree is 1 — then 2, 3, or 4 — then the unused cities — then the forced edge home. Each node is a prefix of a tour. Branching at a node is 'next unused city.' The bound on a node is not the sum of edges already chosen alone: leftover cities still have to be entered and left, so we compute a <b>reduced-matrix lower bound</b> that charges a future min-exit or min-entry on every row and column.",
      bullets: [
        "E-node expansion lists every legal next city (not yet on the prefix).",
        "A leaf is a full permutation plus the return to 1.",
        "Live nodes sit in an LC pool, not a FIFO queue, because cheap prefixes should be tried first."
      ]
    },
    {
      heading: "Reduce rows, then columns",
      body: "Subtract the minimum of each row from that row (row mins 10, 2, 2, 3, 4 sum to 21). Then subtract the minimum of each remaining column (column 1 contributes 1, column 3 contributes 3, others 0, extra 4). Total reduction <b>25</b> is the root cost: every tour pays at least this, because every city is left once and entered once. After reduction the matrix has a 0 in every row and every column. Edge 1→4 is already a 0, so it will look cheap.",
      bullets: [
        "Row reduction then column reduction; sum of subtracted mins = node cost at the root.",
        "A 0 means 'this edge is as cheap as any exit from that city after the shift.'",
        "Root live bound = 25. No tour of this matrix is cheaper than 25."
      ]
    },
    {
      heading: "Including i→j: mask, forbid, reduce again",
      body: "To send the prefix through edge i→j: set row i and column j to ∞ (that exit and that entry are used), set the cell j→start-of-prefix to ∞ (cannot close the cycle early), then reduce the leftover matrix. New cost = parent cost + C[i][j] (from the parent's reduced matrix) + newly subtracted mins. From the root: 1→2 costs 25+10=35; 1→3 costs 25+17+11=53; 1→4 costs 25+0=25; 1→5 costs 25+1+5=31. LC's live pool is those four bounds. Least cost is <b>1-4 with 25</b>.",
      bullets: [
        "Mask the used row and column; forbid returning to the start until the end.",
        "Children of the root: 35, 53, 25, 31 — expand 1-4.",
        "A bound is a lower bound: a child can only stay equal or get more expensive."
      ]
    },
    {
      heading: "LC walk: 1-4, then 1-4-2, then the tour of 28",
      body: "From 1-4 the children are 1-4-2 (add 3, bound 28), 1-4-3 (bound 50), 1-4-5 (bound 36). LC expands 1-4-2. Remaining cities 3 and 5: 1-4-2-3 is expensive (52); 1-4-2-5 then 3 then home uses 0 extra reduction and closes at bound <b>28</b>. The concrete edges 1→4 (10) + 4→2 (6) + 2→5 (2) + 5→3 (7) + 3→1 (3) = <b>28</b>. That leaf is a feasible tour, so U ← 28.",
      bullets: [
        "Tour 1-4-2-5-3-1 has length 28.",
        "The bound matched the true length because the last reductions were zeros.",
        "U=28 is now a cutoff for every other live node."
      ]
    },
    {
      heading: "Kill every live bound ≥ 28",
      body: "Still sitting in the pool: 1-2 (35), 1-3 (53), 1-5 (31), 1-4-3 (50), 1-4-5 (36), 1-4-2-3 (52). All are ≥ 28, so they are <b>killed</b> — their descendants cannot beat the incumbent tour. LC never expanded 1-5 or 1-2. FIFO-BB would have generated a much wider prefix tree. This is the same live-node idea as jobs and knapsack, with matrix reduction as the cost function. Exam: write one reduction, one include-step formula, the tour 1-4-2-5-3-1 = 28, and a pruned sibling.",
      bullets: [
        "Kill rule: bound ≥ best complete tour.",
        "LC + a tight reduction explores a handful of prefixes, not n! tours.",
        "Always start at city 1; rotations of a tour are the same cycle."
      ]
    }
  ],

  keyTerms: [
    { term: "Tour", def: "Hamiltonian cycle: visit every city once and return to the start." },
    { term: "Cost matrix", def: "C[i][j] = travel i→j; diagonal ∞. Textbook 5×5 starts with 20,30,10,11 on row 1." },
    { term: "Row/column reduction", def: "Subtract each row min, then each column min; the sum is a lower bound." },
    { term: "Reduced matrix", def: "Nonnegative matrix with a 0 in every row and column after the shifts." },
    { term: "Include i→j", def: "∞ out row i and column j, ∞ the premature return, reduce again, add the extras." },
    { term: "LC live node", def: "Unexpanded prefix whose bound is smallest among survivors." },
    { term: "Incumbent U", def: "Length of the best complete tour found; prune bound ≥ U." },
    { term: "Optimal tour", def: "1-4-2-5-3-1 with length 28 on the textbook matrix." }
  ],

  tradeoffs: [
    { pro: "Reduction is a valid lower bound, so a killed node cannot hide a cheaper tour.", con: "Each child copies and reduces an n×n matrix — time per node is more than a scalar cost." },
    { pro: "LC expands 1-4 then 1-4-2 and stops after one leaf of 28.", con: "FIFO would expand 1-2 and 1-3 first and build many doomed prefixes." },
    { pro: "Starting at city 1 removes n equivalent rotations from the search.", con: "The tree still has up to (n−1)! leaves if bounds stay loose (asymmetric zeros)." },
    { pro: "The same LC skeleton as knapsack; only the bound formula changed.", con: "Forgetting to ∞ the return edge j→1 creates illegal short cycles and a fake cheap bound." }
  ],

  interviewTips: [
    "State the problem as a min Hamiltonian cycle on the 5×5 matrix, start at 1.",
    "Root reduction: row mins 10+2+2+3+4=21, extra column mins 1+3=4, bound 25.",
    "Child formula: parent + C[i][j] + new reduction after masking row i and column j.",
    "LC order: 1-4 (25) → 1-4-2 (28) → 1-4-2-5-3-1 (28).",
    "Add the real edges 10+6+2+7+3=28 so the bound is not a mystery.",
    "Name one pruned node (1-5 at 31, or 1-2 at 35) and the rule bound ≥ U."
  ],

  scene: {
    nodes: [
      { id: "zG", label: "5 cities", type: "zone", pos: [-7.5, 0, -4], size: [9.5, 9] },
      { id: "c1", label: "1", type: "lb", pos: [-7.5, 0, -1.5], color: "#c084fc" },
      { id: "c2", label: "2", type: "server", pos: [-4, 0, -7] },
      { id: "c3", label: "3", type: "server", pos: [-11, 0, -7] },
      { id: "c4", label: "4", type: "server", pos: [-4, 0, 0.5], color: "#4ade80" },
      { id: "c5", label: "5", type: "server", pos: [-11, 0, 0.5] },
      { id: "zT", label: "LC prefixes", type: "zone", pos: [5.5, 0, 0], size: [13, 16] },
      { id: "rt", label: "Ø bound 25", type: "cache", pos: [5.5, 0, -7] },
      { id: "p12", label: "1-2 : 35", type: "worker", pos: [0.5, 0, -3], showAt: 3 },
      { id: "p13", label: "1-3 : 53", type: "worker", pos: [4, 0, -3], showAt: 3 },
      { id: "p14", label: "1-4 : 25", type: "worker", pos: [7.5, 0, -3], showAt: 3, color: "#4ade80" },
      { id: "p15", label: "1-5 : 31", type: "worker", pos: [11, 0, -3], showAt: 3 },
      { id: "p142", label: "1-4-2 : 28", type: "worker", pos: [5, 0, 1.2], showAt: 4, color: "#4ade80" },
      { id: "p145", label: "1-4-5 : 36", type: "worker", pos: [9, 0, 1.2], showAt: 4 },
      { id: "p1425", label: "1-4-2-5-3-1", type: "worker", pos: [5, 0, 5.4], showAt: 5, color: "#4ade80" },
      { id: "pool", label: "LC queue", type: "queue", pos: [11, 0, 5.4], showAt: 3 },
      { id: "n0", label: "Tour: visit all, return", type: "note", pos: [-8, 3, 7.5] },
      { id: "n1", label: "Reduce rows+cols = 25", type: "note", pos: [8, 3, 7.5], showAt: 1 },
      { id: "n2", label: "Mask row i, col j, re-reduce", type: "note", pos: [-8, 3, -7.5], showAt: 2 },
      { id: "n3", label: "LC expands 1-4 (25)", type: "note", pos: [8, 3, -7.5], showAt: 3 },
      { id: "n4", label: "Tour length 10+6+2+7+3=28", type: "note", pos: [0, 3, 7.5], showAt: 5 },
      { id: "n5", label: "Kill live bounds ≥ 28", type: "note", pos: [8, 3, 7.5], showAt: 6 }
    ],
    edges: [
      { from: "c1", to: "c2", label: "20" },
      { from: "c1", to: "c4", label: "10" },
      { from: "c1", to: "c5", label: "11" },
      { from: "c4", to: "c2", label: "6", showAt: 4 },
      { from: "c2", to: "c5", label: "2", showAt: 5 },
      { from: "c5", to: "c3", label: "7", showAt: 5 },
      { from: "c3", to: "c1", label: "3", showAt: 5 },
      { from: "rt", to: "p12", showAt: 3 },
      { from: "rt", to: "p13", showAt: 3 },
      { from: "rt", to: "p14", showAt: 3 },
      { from: "rt", to: "p15", showAt: 3 },
      { from: "p14", to: "p142", showAt: 4 },
      { from: "p14", to: "p145", showAt: 4 },
      { from: "p142", to: "p1425", showAt: 5 }
    ],
    steps: [
      {
        title: "Five cities, start at 1",
        text: "Find a shortest tour: leave 1, visit 2,3,4,5 once each, return to 1. The adjacency matrix is the textbook 5×5 (row 1 reads ∞,20,30,10,11). A 4-city cartoon uses the same prefix tree with fewer children.",
        highlight: ["c1", "c2", "c3", "c4", "c5", "zG", "n0"]
      },
      {
        title: "Root cost is a full reduction",
        text: "Subtract each row min (10+2+2+3+4=21) then leftover column mins (1+3=4). Root bound = 25. Every city still needs an exit and an entry, so no tour is cheaper than 25. The reduced matrix has a 0 on 1→4.",
        highlight: ["rt", "n1", "c1", "c4"],
        hide: ["n0"],
        flows: [
          { from: "c1", to: "rt", color: "#c084fc", label: "25" }
        ]
      },
      {
        title: "Include an edge, then reduce again",
        text: "To take i→j: ∞ the row and column, ∞ the early return to the start of the prefix, reduce what remains. Add C[i][j] plus new mins to the parent bound. That scalar is the child's live cost.",
        highlight: ["rt", "n2", "zT"],
        hide: ["n0", "n1"]
      },
      {
        title: "Four children; LC picks 1-4",
        text: "1-2 costs 35, 1-3 costs 53, 1-4 costs 25, 1-5 costs 31. The live-node pool is those four. Least-cost branch and bound expands 1-4, not the FIFO first child 1-2.",
        highlight: ["p12", "p13", "p14", "p15", "pool", "n3", "rt"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "rt", to: "p14", color: "#4ade80", label: "LC" },
          { from: "c1", to: "c4", color: "#4ade80", label: "10" }
        ]
      },
      {
        title: "Expand 1-4-2 (bound 28)",
        text: "Children of 1-4 include 1-4-2 at 28 and 1-4-5 at 36 (1-4-3 is worse still). LC takes 1-4-2. Edge 4→2 costs 6 in the original matrix. The prefix is now two hops and still under any sibling of the root.",
        highlight: ["p14", "p142", "p145", "c4", "c2"],
        fail: ["p13"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "p14", to: "p142", color: "#4ade80", label: "28" },
          { from: "c4", to: "c2", color: "#4ade80", label: "6" }
        ]
      },
      {
        title: "Close 1-4-2-5-3-1 = 28",
        text: "From 1-4-2 the cheap continuation is 5 then 3 then home. Edges 2→5 (2), 5→3 (7), 3→1 (3) plus 10+6 = 28. Bound equals true length. U←28 becomes the cutoff.",
        highlight: ["p1425", "p142", "c1", "c4", "c2", "c5", "c3", "n4"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "c2", to: "c5", color: "#4ade80", label: "2" },
          { from: "c5", to: "c3", color: "#4ade80", label: "7" },
          { from: "c3", to: "c1", color: "#4ade80", label: "3" }
        ]
      },
      {
        title: "Prune the live pool",
        text: "1-2 (35), 1-5 (31), 1-4-5 (36) and the other high prefixes all have bound ≥ 28. Mark them failed. LC never opened 1-5. The state-space queue is empty except the optimal leaf.",
        highlight: ["p12", "p15", "p145", "p13", "n5", "pool", "p1425"],
        fail: ["p12", "p13", "p15", "p145"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "p15", to: "pool", color: "#f87171", label: "kill" }
        ]
      },
      {
        title: "One tour, one bound recipe",
        text: "Optimal tour 1-4-2-5-3-1, length 28. Cost of a node = reduced-matrix lower bound. Live-node rule = least cost. Kill when bound ≥ U. Same B&B skeleton as jobs and 0/1 knapsack.",
        highlight: ["p1425", "c1", "c4", "c2", "c5", "c3", "n4", "rt"],
        fail: ["p12", "p13", "p15", "p145"],
        hide: ["n0", "n1", "n2", "n3", "n5"],
        flows: [
          { from: "c1", to: "c4", color: "#4ade80", label: "opt" }
        ]
      }
    ]
  }
});
