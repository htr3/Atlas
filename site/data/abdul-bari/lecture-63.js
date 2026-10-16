window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 63,
  title: "6 Introduction to Backtracking - Brute Force Approach",
  video: "https://www.youtube.com/watch?v=DKCbsiDBN6c",
  category: "Graphs & Backtracking",
  tagline: "Brute-force DFS of a state-space tree, killing nodes with a bounding function.",
  summary: "Backtracking is a brute-force strategy for problems that ask for every feasible solution, not an optimum. You grow a state-space tree depth-first, each path from the root a candidate. A bounding function kills a node as soon as a constraint fails, so the subtree is never generated. Three chairs and two boys plus a girl give 3! = 6 seatings; 'girl not in the middle' cuts that to four. Branch and bound uses the same tree idea but expands breadth-first for minimization.",

  theory: [
    {
      heading: "Brute force, but not an optimization method",
      body: "Backtracking tries <b>every possible construction</b> and keeps the ones that satisfy the problem's constraints. Dynamic programming also enumerates structure, but DP is for <b>optimization</b> (best value). Backtracking is for the other exam sentence: the instance has <i>many</i> legal answers and you must list them all — or decide whether any exist. N-queens, subset-sum, graph coloring, and Hamiltonian cycle are the four follow-on lectures that use this engine.",
      bullets: [
        "Brute force: generate candidates, keep the feasible ones.",
        "Not an optimization strategy; DP / greedy / BnB own that job.",
        "You want all solutions (or existence), not a cheapest one."
      ]
    },
    {
      heading: "Three students, three chairs, 3! paths",
      body: "Two boys and one girl, three seats. Arrangements: <code>3! = 6</code>. Represent every seating as a path in a <b>state-space tree</b> (also called a solution tree). Level 1 = who sits in chair 1, level 2 = chair 2, level 3 = chair 3. Depth-first generation: sit boy1, then boy2, then girl — first leaf <code>(B1, B2, G)</code>. Back up, swap girl into chair 2 and boy2 into chair 3: <code>(B1, G, B2)</code>. Empty chair 1, put boy2 first, and so on. The six root-to-leaf paths are exactly the six permutations. Each path is one solution.",
      bullets: [
        "One level per decision (here, one chair).",
        "A leaf at depth n is a complete assignment.",
        "DFS: build left, back up, build the sibling — that backup is the 'back' in backtracking."
      ]
    },
    {
      heading: "Constraint plus bounding function",
      body: "Now add a constraint: <b>the girl must not sit in the middle</b>. Rebuild the tree with a check at every node. <code>(B1, B2, G)</code> is legal. At <code>(B1, G, …)</code> the girl is already in chair 2 — kill that node, do not generate chair 3. The lecture's word for the check is <b>bounding function</b>: a predicate that says this partial assignment cannot become a feasible complete one, so the subtree is discarded. Same for boy2-first with girl in the middle. Leaves that survive: four seatings, all with the girl on an end chair.",
      bullets: [
        "Bounding function = constraint test on a partial vector.",
        "A killed node is not expanded; that is the work you save versus  n!  raw permutations.",
        "If no bound fires until the last level, the leaf is a solution."
      ]
    },
    {
      heading: "State-space tree is the solution object",
      body: "You do not store six arrays in a bag and filter them later if you can avoid it. You grow the tree, and the surviving root-to-leaf paths <i>are</i> the answers. Recursion that tries choice i, recurses, then undoes choice i is exactly DFS on that implicit tree. The call stack is the current path. That is why later backtracking codes are recursive even when the textbook never draws the stack.",
      bullets: [
        "Implicit tree: children are the next unused / next legal choices.",
        "Current path = the partial solution x[1..k].",
        "Undo on return is the backtrack step."
      ]
    },
    {
      heading: "Same brute force, different walk: branch and bound",
      body: "Branch and bound also brute-forces a state-space tree. The difference the lecture draws now, before the BnB chapter: <b>backtracking expands DFS</b> (deepen a seating, back up, deepen the sibling). <b>BnB expands BFS</b> (generate every child of chair-1 first — boy1, boy2, girl — then the next level). BnB is aimed at minimization; backtracking is aimed at listing feasible points. Remember the pair as 'same tree, DFS vs BFS' and you have the exam contrast.",
      bullets: [
        "Backtracking: depth-first generation.",
        "Branch and bound: breadth-first generation (FIFO / LIFO / LC variants later).",
        "Both kill nodes; BnB also scores a cost on each live node."
      ]
    }
  ],

  keyTerms: [
    { term: "Brute force", def: "Try every candidate construction; keep those that meet the constraints." },
    { term: "State-space tree", def: "Tree whose root-to-leaf paths are candidate solutions; one level per decision." },
    { term: "Backtracking", def: "DFS generation of that tree, undoing a choice when a node dies or a leaf is recorded." },
    { term: "Bounding function", def: "A test on a partial assignment that kills a node whose subtree cannot be feasible." },
    { term: "Killed node", def: "A node the bound rejects; its children are never generated." },
    { term: "Feasible solution", def: "A complete assignment (a leaf) that satisfied every bound along the path." },
    { term: "Branch and bound", def: "The BFS sibling strategy, used for minimization, not for listing all answers." }
  ],

  tradeoffs: [
    { pro: "You get every feasible seating, coloring, or tour — the specification of these problems.", con: "Unpruned, the tree is exponential (n!, 2^n, m^n). Bounds only help when they fire early." },
    { pro: "A bounding function can delete a huge subtree after a cheap local test (girl in the middle).", con: "A weak bound still explores almost the full brute-force tree; designing the bound is the real work." },
    { pro: "DFS uses only the current path in memory (the recursion stack).", con: "You may find a solution late; BFS-style BnB can prefer promising branches by cost." },
    { pro: "The same skeleton solves N-queens, subset-sum, coloring, and Hamiltonian cycle.", con: "Optimization (best value) is the wrong use; use DP, greedy, or BnB there." }
  ],

  interviewTips: [
    "Say backtracking is brute-force DFS of a state-space tree for all feasible solutions, not for a minimum.",
    "Work the 3! seating tree, then impose 'girl not middle' and kill two internal nodes — that is the bounding function.",
    "Contrast DP (optimization with overlapping subproblems) against backtracking (enumeration with constraints).",
    "Name the four classic problems: N-queens, sum of subsets, graph coloring, Hamiltonian cycle.",
    "One sentence on BnB: same tree, BFS instead of DFS, aimed at minimization.",
    "In code talk: try, recurse, undo. The undo is the backtrack."
  ],

  scene: {
    nodes: [
      { id: "ch1", label: "Chair 1", type: "queue", pos: [-10, 0, 5] },
      { id: "ch2", label: "Chair 2", type: "queue", pos: [-10, 0, 0] },
      { id: "ch3", label: "Chair 3", type: "queue", pos: [-10, 0, -5] },
      { id: "b1", label: "Boy 1", type: "user", pos: [-6, 0, 5], color: "#60a5fa" },
      { id: "b2", label: "Boy 2", type: "user", pos: [-6, 0, 0], color: "#818cf8" },
      { id: "g1", label: "Girl", type: "user", pos: [-6, 0, -5], color: "#f472b6" },
      { id: "root", label: "root", type: "point", pos: [2, 0, 6], showAt: 1 },
      { id: "nB1", label: "B1", type: "server", pos: [-1, 0, 3], showAt: 1, color: "#60a5fa" },
      { id: "nB2", label: "B2", type: "server", pos: [2, 0, 3], showAt: 1, color: "#818cf8" },
      { id: "nG", label: "G", type: "server", pos: [5, 0, 3], showAt: 1, color: "#f472b6" },
      { id: "nB1B2", label: "B1 B2", type: "worker", pos: [-3, 0, -1], showAt: 2, color: "#4ade80" },
      { id: "nB1G", label: "B1 G", type: "server", pos: [1, 0, -1], showAt: 3, color: "#f87171" },
      { id: "leaf1", label: "B1 B2 G", type: "cache", pos: [-3, 0, -5], showAt: 2, color: "#4ade80" },
      { id: "nB2B1", label: "B2 B1", type: "worker", pos: [5, 0, -1], showAt: 4, color: "#4ade80" },
      { id: "nB2G", label: "B2 G", type: "server", pos: [8, 0, -1], showAt: 4, color: "#f87171" },
      { id: "leaf2", label: "B2 B1 G", type: "cache", pos: [5, 0, -5], showAt: 4, color: "#4ade80" },
      { id: "n0", label: "3! = 6 seatings", type: "note", pos: [9, 0, 6] },
      { id: "n1", label: "DFS state-space tree", type: "note", pos: [9, 0, 3], showAt: 1 },
      { id: "n2", label: "Girl not in middle", type: "note", pos: [9, 0, 0], showAt: 3 },
      { id: "n3", label: "Kill: bounding fn", type: "note", pos: [9, 0, -3], showAt: 3 },
      { id: "n4", label: "BnB expands BFS", type: "note", pos: [9, 0, -6], showAt: 6 }
    ],
    edges: [
      { from: "b1", to: "ch1", label: "sit", showAt: 2 },
      { from: "b2", to: "ch2", label: "sit", showAt: 2 },
      { from: "g1", to: "ch3", label: "sit", showAt: 2 },
      { from: "root", to: "nB1", showAt: 1 },
      { from: "root", to: "nB2", showAt: 1 },
      { from: "root", to: "nG", showAt: 1 },
      { from: "nB1", to: "nB1B2", showAt: 2 },
      { from: "nB1", to: "nB1G", showAt: 3 },
      { from: "nB1B2", to: "leaf1", showAt: 2 },
      { from: "nB2", to: "nB2B1", showAt: 4 },
      { from: "nB2", to: "nB2G", showAt: 4 },
      { from: "nB2B1", to: "leaf2", showAt: 4 }
    ],
    steps: [
      {
        title: "All seatings, not a best seating",
        text: "Two boys, one girl, three chairs. 3! = 6 permutations. Backtracking lists every arrangement. It is brute force for multiple feasible answers, not an optimizer.",
        highlight: ["ch1", "ch2", "ch3", "b1", "b2", "g1", "n0"]
      },
      {
        title: "Draw the state-space tree",
        text: "Level 1 is chair 1 (B1, B2, or G). Each child is the next chair. A root-to-leaf path is one seating. Generation is DFS: deepen, then back up.",
        highlight: ["root", "nB1", "nB2", "nG", "n1"],
        flows: [
          { from: "root", to: "nB1", color: "#60a5fa", label: "DFS" }
        ]
      },
      {
        title: "First leaf: B1, B2, G",
        text: "Sit boy1, then boy2, then girl. That path is a complete solution. Recursion then undoes the girl and the second chair — the literal backtrack — and tries the next sibling.",
        highlight: ["b1", "ch1", "b2", "ch2", "g1", "ch3", "nB1B2", "leaf1"],
        flows: [
          { from: "b1", to: "ch1", color: "#4ade80", label: "B1" },
          { from: "b2", to: "ch2", color: "#4ade80", label: "B2" },
          { from: "g1", to: "ch3", color: "#4ade80", label: "G" }
        ]
      },
      {
        title: "Kill 'girl in the middle'",
        text: "Constraint: girl not in chair 2. Node (B1, G) fails immediately. Bounding function kills it; chair 3 is never generated. That is the work you save versus six raw leaves.",
        highlight: ["nB1G", "n2", "n3", "ch2", "g1"],
        fail: ["nB1G"],
        flows: [
          { from: "g1", to: "ch2", color: "#f87171", label: "illegal" }
        ]
      },
      {
        title: "Four surviving leaves",
        text: "Boy2-first with girl in the middle dies the same way. Leaves that reach depth 3 with no bound firing are solutions — four of them, girl always on an end chair.",
        highlight: ["leaf1", "leaf2", "nB2B1", "nB2G"],
        fail: ["nB1G", "nB2G"]
      },
      {
        title: "Try, recurse, undo",
        text: "The current path is the partial vector x[1..k]. Recursion DFS-walks the implicit tree. Returning from a call undoes the last choice. That undo is backtracking.",
        highlight: ["root", "nB1", "nB1B2", "leaf1"],
        flows: [
          { from: "leaf1", to: "nB1B2", color: "#fb923c", label: "undo" }
        ]
      },
      {
        title: "Branch and bound is the BFS twin",
        text: "BnB builds the same seating tree level by level — all chair-1 children before any chair-2 child. Same brute force, BFS instead of DFS, aimed at minimization in later videos.",
        highlight: ["nB1", "nB2", "nG", "n4"],
        flows: [
          { from: "root", to: "nB1", color: "#fb923c", label: "level" },
          { from: "root", to: "nB2", color: "#fb923c", label: "level" },
          { from: "root", to: "nG", color: "#fb923c", label: "level" }
        ]
      }
    ]
  }
});
