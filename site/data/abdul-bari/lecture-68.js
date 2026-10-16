window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 68,
  title: "7 Branch and Bound Introduction",
  video: "https://www.youtube.com/watch?v=3RBNPc0_Q6g",
  category: "Branch, Bound & Complexity",
  tagline: "Same state-space tree, BFS not DFS. FIFO / LIFO / least-cost for minimization.",
  summary: "Branch and bound is a brute-force strategy on a state-space tree, aimed at minimization (convert a max problem first). Unlike backtracking's DFS, live nodes are expanded breadth-wise: finish every child of the current node before picking the next parent. Solutions may be variable-size subsets or fixed-size 0-1 vectors. Three ways to pick the next parent: FIFO (queue), LIFO (stack), and least-cost (expand the live node with the smallest cost). A cost function is written on every node in all three variants. LC usually reaches a solution with less tree.",

  theory: [
    {
      heading: "Same tree family, a different job",
      body: "Backtracking already showed a state-space tree. Branch and bound uses that object too, still brute force, still killing hopeless nodes. The purpose changes: BnB is for <b>optimization</b>, and the lecture restricts it to <b>minimization</b>. A maximization instance is rewritten as a minimization (negate profits, or equivalent) and then solved. Job sequencing with deadlines is the running sketch: each node is a set of jobs you have currently chosen to do.",
      bullets: [
        "Brute-force state-space tree, like backtracking.",
        "Goal: a minimum-cost feasible solution, not a list of all seatings.",
        "Max problems are converted to min before you start."
      ]
    },
    {
      heading: "Variable-size subset versus fixed-size 0-1 vector",
      body: "Two ways to write a solution change the shape of the tree. <b>Variable size:</b> the answer is the subset of jobs you actually run — {1, 4} on one instance, maybe {2, 3, 4} on another. Tree edges mean 'add this job'. <b>Fixed size:</b> a bit per job, length always n, 1 = do it, 0 = skip. The lecture draws the subset / variable-size tree first: from the empty set, children are 'do job 1', 'do job 2', 'do job 3', 'do job 4' as four siblings, then deeper nodes add a later job only (so {1,2} appears, never {2,1} as a different set).",
      bullets: [
        "Subset tree: path = the jobs taken, length varies.",
        "0-1 tree: path length n, bits include/exclude.",
        "Pick one representation and generate children consistently."
      ]
    },
    {
      heading: "BFS expansion is the difference from backtracking",
      body: "Backtracking would take 'job 1', then immediately 'job 1 then 2', and so on down to a leaf, then back up — DFS. BnB on the same subset tree first creates <b>every child of the root</b> (job 1, job 2, job 3, job 4), then expands the next live node completely (all of its children) before touching another parent. That is the BFS rule: when you explore a node, produce all of its children, then pick a new node to explore. The 'breadth' is among solution-tree nodes, not among graph vertices.",
      bullets: [
        "Explore = generate every child of the current live node.",
        "Then choose the next live node by FIFO, LIFO, or least cost.",
        "Backtracking was DFS on this same family of trees."
      ]
    },
    {
      heading: "FIFO BnB (queue) versus LIFO BnB (stack)",
      body: "After a node is fully expanded, where does the next parent come from? <b>FIFO branch and bound</b> puts new children in a <b>queue</b> and always expands the oldest live node — classic BFS order, node numbers increase level by level. <b>LIFO branch and bound</b> pushes children on a <b>stack</b> and expands the newest live node. The lecture still calls LIFO a BnB method and still requires that when you do expand, you generate <i>all</i> children of that node (the BFS-explore rule) — the stack only changes which parent you pick next. Both work. FIFO feels like level order; LIFO feels closer to a DFS schedule of parents but with whole sibling groups emitted together.",
      bullets: [
        "FIFO: queue of live nodes, oldest first.",
        "LIFO: stack of live nodes, newest first.",
        "In both, exploring a node means emitting every child before you switch."
      ]
    },
    {
      heading: "Least-cost BnB, and why a cost sits on every node",
      body: "<b>LC branch and bound</b> expands the live node whose <b>cost</b> is smallest. Cost is problem-defined (a lower bound on the best complete solution in that subtree is the usual textbook choice; the lecture fills 25, 12, 19, 30 as placeholders). Root may start at ∞. After the four first-level jobs, the node with cost 12 is expanded next, not the FIFO-oldest and not the LIFO-newest. Its children get costs 8 and 7; 7 is last-level and is a feasible solution. Idea: always step toward the currently cheapest promise, so you often draw far less of the tree than FIFO or LIFO. All three variants still write a cost on every node — you need it to compare complete solutions and, in LC, to pick the parent.",
      bullets: [
        "LC: next parent = live node of minimum cost.",
        "Cost function is yours to define per problem; it must be a min-sense number.",
        "LC is typically faster in nodes expanded than FIFO or LIFO."
      ]
    }
  ],

  keyTerms: [
    { term: "Branch and bound", def: "Brute-force minimization on a state-space tree, expanding a live node completely before the next." },
    { term: "Live node", def: "A generated node whose children have not all been produced yet." },
    { term: "Variable-size solution", def: "The answer is a subset whose length depends on the instance (jobs taken)." },
    { term: "Fixed-size solution", def: "A 0-1 vector of length n, one bit per object or job." },
    { term: "FIFO BnB", def: "Next parent comes from a queue — oldest live node." },
    { term: "LIFO BnB", def: "Next parent comes from a stack — newest live node." },
    { term: "LC BnB", def: "Next parent is the live node with least cost; usually expands less tree." }
  ],

  tradeoffs: [
    { pro: "BFS-style expansion plus a bound can find a min solution without listing every feasible leaf (unlike backtracking).", con: "FIFO/LIFO can still generate a huge frontier of live nodes before a leaf is proven optimal." },
    { pro: "LC uses the cost you already need for minimization to pick a promising parent.", con: "A weak cost (random 25, 12, 19) gives a weak guide; designing a tight lower bound is the real skill." },
    { pro: "Variable-size subset trees avoid dummy 0-bits and skip permutations of the same set.", con: "Fixed-size 0-1 trees are easier to code uniformly for knapsack-like instances." },
    { pro: "LIFO reuses a stack and can feel familiar after DFS backtracking.", con: "It is not the same as backtracking: you still emit all children of a node in one explore step." }
  ],

  interviewTips: [
    "Contrast with backtracking in one line: same state-space tree, BnB expands BFS for a minimum, backtracking DFS-lists feasibles.",
    "Say minimization only; convert a max instance before you start.",
    "Name variable-size (subset of jobs) versus fixed-size (0-1 vector of length n).",
    "List the three next-parent rules: FIFO queue, LIFO stack, LC minimum cost.",
    "On LC: every node has a cost; expand the cheapest live node. FIFO/LIFO also write costs so you can compare solutions.",
    "Job-sequencing sketch is enough for this intro; later videos run real FIFO/LC traces."
  ],

  scene: {
    nodes: [
      { id: "root", label: "∅  cost ∞", type: "lb", pos: [0, 0, 6] },
      { id: "j1", label: "job1 c=25", type: "server", pos: [-9, 0, 2], showAt: 2 },
      { id: "j2", label: "job2 c=12", type: "server", pos: [-3, 0, 2], showAt: 2, color: "#4ade80" },
      { id: "j3", label: "job3 c=19", type: "server", pos: [3, 0, 2], showAt: 2 },
      { id: "j4", label: "job4 c=30", type: "server", pos: [9, 0, 2], showAt: 2 },
      { id: "j23", label: "2+3 c=8", type: "worker", pos: [-6, 0, -3], showAt: 5, color: "#60a5fa" },
      { id: "j24", label: "2+4 c=7", type: "cache", pos: [0, 0, -3], showAt: 5, color: "#4ade80" },
      { id: "fifo", label: "FIFO queue", type: "queue", pos: [-9, 0, -7], showAt: 3 },
      { id: "lifo", label: "LIFO stack", type: "storage", pos: [0, 0, -7], showAt: 3, color: "#c084fc" },
      { id: "lc", label: "LC min cost", type: "db", pos: [9, 0, -7], showAt: 4, color: "#facc15" },
      { id: "n0", label: "min, not all answers", type: "note", pos: [-9, 0, 7] },
      { id: "n1", label: "BFS: all children", type: "note", pos: [0, 0, 7.5], showAt: 2 },
      { id: "n2", label: "subset vs 0-1 vector", type: "note", pos: [9, 0, 7], showAt: 1 },
      { id: "n3", label: "expand cheapest 12", type: "note", pos: [9, 0, -3], showAt: 5 }
    ],
    edges: [
      { from: "root", to: "j1", showAt: 2 },
      { from: "root", to: "j2", showAt: 2 },
      { from: "root", to: "j3", showAt: 2 },
      { from: "root", to: "j4", showAt: 2 },
      { from: "j2", to: "j23", showAt: 5, label: "job3" },
      { from: "j2", to: "j24", showAt: 5, label: "job4" },
      { from: "j1", to: "fifo", showAt: 3, dashed: true },
      { from: "j4", to: "lifo", showAt: 3, dashed: true },
      { from: "j2", to: "lc", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Minimization on a state-space tree",
        text: "Branch and bound is brute force, like backtracking, but it hunts a minimum. Convert a max instance first. Job sequencing with deadlines is the sketch: a node is a set of jobs you currently plan to run.",
        highlight: ["root", "n0"]
      },
      {
        title: "Subset path versus 0-1 vector",
        text: "Variable size: the solution is the subset {1,4} or {2,3} — length depends on the instance. Fixed size: always n bits, 1 = take the job. The tree below uses the subset form.",
        highlight: ["root", "n2"]
      },
      {
        title: "Explore means every child, then stop",
        text: "From the empty set, emit job1, job2, job3, job4 as siblings before any grandchild. That is BFS-style explore. Backtracking would have dived into job1+job2 immediately (DFS).",
        highlight: ["root", "j1", "j2", "j3", "j4", "n1"],
        flows: [
          { from: "root", to: "j1", color: "#fb923c", label: "child" },
          { from: "root", to: "j2", color: "#fb923c", label: "child" },
          { from: "root", to: "j3", color: "#fb923c", label: "child" },
          { from: "root", to: "j4", color: "#fb923c", label: "child" }
        ]
      },
      {
        title: "FIFO queue versus LIFO stack",
        text: "Next parent: FIFO takes the oldest live node from a queue (level order). LIFO takes the newest from a stack. Both still generate all children of whichever parent they pick. That all-children rule is what keeps them BnB, not backtracking.",
        highlight: ["fifo", "lifo", "j1", "j4"],
        flows: [
          { from: "j1", to: "fifo", color: "#fb923c", label: "enqueue" },
          { from: "j4", to: "lifo", color: "#c084fc", label: "push" }
        ]
      },
      {
        title: "Least-cost picks the live node with min c",
        text: "Placeholder costs 25, 12, 19, 30. LC ignores FIFO age and LIFO recency and expands job2 because 12 is the smallest. Every variant still writes a cost on every node so complete solutions can be compared.",
        highlight: ["lc", "j2", "j1", "j3", "j4"],
        flows: [
          { from: "j2", to: "lc", color: "#facc15", label: "min 12" }
        ]
      },
      {
        title: "Expand 12: children cost 8 and 7",
        text: "Job2's children are job2+job3 (cost 8) and job2+job4 (cost 7). 7 is a last-level feasible subset — a candidate solution. LC got here without drawing the rest of the FIFO tree. Later videos run real costs on knapsack, jobs, and TSP.",
        highlight: ["j2", "j23", "j24", "n3", "lc"],
        flows: [
          { from: "j2", to: "j23", color: "#60a5fa", label: "8" },
          { from: "j2", to: "j24", color: "#4ade80", label: "7" }
        ]
      },
      {
        title: "Three knobs, one cost function",
        text: "FIFO, LIFO, LC. Same children, different next-parent rule. LC is usually fewer nodes. Remember: BnB = BFS explore + a bound + a min cost. Backtracking = DFS list of feasibles.",
        highlight: ["fifo", "lifo", "lc", "root", "j24"]
      }
    ]
  }
});
