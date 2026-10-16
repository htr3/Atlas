window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 67,
  title: "6.4 Hamiltonian Cycle - Backtracking",
  video: "https://www.youtube.com/watch?v=dQr4wZCiJJ4",
  category: "Graphs & Backtracking",
  tagline: "Visit every vertex once and close the cycle. Bounds: no duplicate, edge, edge home. (n-1)!.",
  summary: "A Hamiltonian cycle visits every vertex exactly once and returns to the start. The graph must be connected; an articulation point or a pendant vertex rules a cycle out. Unlike TSP, there is no cost — you want every distinct cycle, not a cheapest tour. Fix x[1] = 1 to skip rotations of the same cycle. NextVertex tries 1..n with three tests: not already on the path, an edge from the previous vertex, and (at position n) an edge back to 1. Two worked cycles: 1-2-3-4-5-1 and 1-2-5-4-3-1. Time (n−1)! ≈ O(n^n).",

  theory: [
    {
      heading: "The cycle, and why this is not TSP",
      body: "Start at some vertex, visit <b>every</b> other vertex <b>exactly once</b>, and return to the start. That closed walk is a Hamiltonian cycle. The lecture graph has several: <code>1-2-3-4-5-6-1</code>, <code>1-2-6-5-4-3-1</code>, <code>1-6-2-5-4-3-1</code>, and more. Traveling salesman looks similar — visit all, come home — but TSP is a <b>minimization</b> of tour cost. Hamiltonian cycle is a feasibility / enumeration question: does any cycle exist, and if so what are they? No weights.",
      bullets: [
        "All vertices, once each, then the closing edge.",
        "Multiple cycles may exist; list the distinct ones.",
        "TSP is min-cost tour; this chapter has no costs."
      ]
    },
    {
      heading: "Connected, no cut vertex, no pendant",
      body: "The graph may be directed or undirected, but it must be <b>connected</b> (one piece). Two more quick negatives from the lecture's extra figures: an <b>articulation point</b> (a vertex whose removal splits the graph) cannot sit on a cycle that visits everybody and returns — the two sides only meet at that vertex, so you cannot leave one side and come back without reusing it. A <b>pendant vertex</b> (degree 1) has only one way in; after you use that edge you cannot leave without a second copy of the vertex. Those are sufficient reasons to say 'no Hamiltonian cycle' without running the algorithm.",
      bullets: [
        "Disconnected → no cycle through all vertices.",
        "Articulation point → no Hamiltonian cycle.",
        "Pendant (degree-1) vertex → no Hamiltonian cycle."
      ]
    },
    {
      heading: "Fix the start so rotations are not 'new' cycles",
      body: "Walking 2-3-4-5-6-1-2 is the same cycle as 1-2-3-4-5-6-1, only the cut point moved. To avoid printing the same necklace n times, <b>lock x[1] = 1</b> and search only from position 2 onward. Distinct sequences under that lock are the distinct cycles (up to the remaining reverse-direction duplicate, which a paper may or may not count separately). The array x[1..n] is the path; a solution also needs the implicit edge x[n] → x[1].",
      bullets: [
        "x[1] is fixed at vertex 1.",
        "Positions 2..n are the backtracking variables.",
        "NP-hard: no known poly-time test for existence in general graphs."
      ]
    },
    {
      heading: "Three checks in NextVertex — the bounding function",
      body: "The helper that fills x[k] tries candidates 1, 2, …, n wrapping through 0 (the 'no more' sentinel). A candidate v is legal only if: (1) <b>not a duplicate</b> — v does not already appear in x[1..k-1]; (2) <b>there is an edge</b> from x[k-1] to v in the adjacency matrix; (3) if k is the last index, <b>there is an edge from v back to x[1]</b>. Fail any one, reject v, try v+1. Those three sentences are the bound. Hamiltonian(k) then: get the next legal v; if v is 0, return; if k is last, print; else recurse Hamiltonian(k+1). The walk is DFS on the permutation tree of the remaining n−1 vertices.",
      bullets: [
        "No repeats on the path.",
        "Every consecutive pair (including last → first) is an actual edge.",
        "v = 0 means this position is exhausted; pop and backtrack."
      ]
    },
    {
      heading: "Worked path: 1-2-3-4-5-1, then 1-2-5-4-3-1",
      body: "Adjacency matrix of the 5-vertex lecture graph. x = (1, 0, 0, 0, 0). Next at k = 2 accepts 2 (unused, edge 1-2). k = 3 accepts 3 (edge 2-3). k = 4 accepts 4. k = 5 accepts 5, and 5-1 exists — print <code>1,2,3,4,5</code>. Exhaust position 5, back up. At k = 4, 5 is the other candidate after 4, but 3-5 has no edge — reject. At k = 3, after 3 comes 4 (edge 2-4). Then 5, then 3 with edge 5-3? no; eventually the live finish is 1-2-5-4-3 with edge 3-1: second print <code>1,2,5,4,3</code>. Keep going to drain the tree. Two answers are enough to show the engine.",
      bullets: [
        "First leaf: 1-2-3-4-5-1.",
        "Second leaf: 1-2-5-4-3-1.",
        "Killed nodes never appear: duplicates, missing tree edges, missing close-the-cycle edge."
      ]
    },
    {
      heading: "Exam write-up and (n−1)! time",
      body: "For a university paper: define the cycle in two sentences, write the three bound checks in words (skip the modular loop unless they asked for code), mention fixing vertex 1, and optionally sketch the first two leaves. Tracing the full tree is a bad use of time — n = 8 already explodes. With x[1] locked, the algorithm tries permutations of the other n−1 vertices: <b>(n−1)!</b> candidates, which is O(n!) and the lecture also writes as O(n^n). That is the complexity line.",
      bullets: [
        "Words > code for the bound, unless the question says 'algorithm'.",
        "Do not start a giant state-space drawing in an exam.",
        "Time (n−1)! ; NP-hard existence."
      ]
    }
  ],

  keyTerms: [
    { term: "Hamiltonian cycle", def: "A cycle that visits every vertex exactly once and returns to the start." },
    { term: "Articulation point", def: "A vertex whose removal disconnects the graph; no Ham cycle can exist." },
    { term: "Pendant vertex", def: "A degree-1 vertex; no Ham cycle can exist." },
    { term: "x[1] = 1", def: "Fixed start that stops you from reprinting rotations of the same cycle." },
    { term: "NextVertex", def: "Helper that proposes the next candidate for x[k] obeying the three bounds." },
    { term: "Duplicate test", def: "Reject v if it already sits in x[1..k-1]." },
    { term: "(n−1)!", def: "Permutations of the unfixed vertices; the algorithm's brute-force size." }
  ],

  tradeoffs: [
    { pro: "Fixing the start removes n copies of the same necklace from the output.", con: "The reverse cycle (1-5-4-3-2-1) may still print as a second listing unless you add a direction rule." },
    { pro: "The three bound checks are cheap adjacency-matrix lookups plus an O(n) duplicate scan.", con: "They do not beat (n−1)! in the worst case on a complete graph, where every permutation is a cycle." },
    { pro: "Articulation and pendant tests reject some 'no' instances in linear time.", con: "A 2-connected graph with min degree ≥ 2 can still have no Ham cycle; you must search." },
    { pro: "Same DFS skeleton as N-queens and coloring: try, recurse, undo.", con: "TSP needs costs and a different chapter (DP formula or branch and bound)." }
  ],

  interviewTips: [
    "Define Ham cycle in one breath, then say it is not TSP — no min-cost, all cycles.",
    "Name the easy nos: disconnected, articulation point, pendant vertex.",
    "Write the three bounds: not duplicate, edge from previous, edge home if last.",
    "Say x[1] is fixed at 1 so rotated listings are not counted as new.",
    "Give 1-2-3-4-5-1 and 1-2-5-4-3-1 as the worked pair.",
    "Complexity: (n−1)! which they will accept as n! or n^n. Do not draw the whole tree."
  ],

  scene: {
    nodes: [
      { id: "gzone", label: "5-vertex graph", type: "zone", pos: [-5, 0, 1], size: [12, 12] },
      { id: "v1", label: "1", type: "server", pos: [-5, 0, 6], color: "#facc15" },
      { id: "v2", label: "2", type: "server", pos: [-10, 0, 1], color: "#60a5fa" },
      { id: "v3", label: "3", type: "server", pos: [-10, 0, -4], color: "#60a5fa" },
      { id: "v4", label: "4", type: "server", pos: [0, 0, -4], color: "#60a5fa" },
      { id: "v5", label: "5", type: "server", pos: [0, 0, 1], color: "#60a5fa" },
      { id: "arr", label: "x[1]=1 fixed", type: "queue", pos: [8, 0, 6] },
      { id: "x2", label: "x2 try 2", type: "note", pos: [8, 0, 3.5], showAt: 2 },
      { id: "dup", label: "no duplicate", type: "note", pos: [8, 0, 1.5], showAt: 3 },
      { id: "edg", label: "edge from prev", type: "note", pos: [8, 0, -0.5], showAt: 3 },
      { id: "home", label: "edge last→1", type: "note", pos: [8, 0, -2.5], showAt: 4 },
      { id: "cycA", label: "1-2-3-4-5-1", type: "cache", pos: [8, 0, -5], showAt: 4, color: "#4ade80" },
      { id: "cycB", label: "1-2-5-4-3-1", type: "cache", pos: [8, 0, -7], showAt: 5, color: "#c084fc" },
      { id: "art", label: "cut vertex: no", type: "server", pos: [-10, 0, 6], showAt: 1, color: "#f87171" },
      { id: "n0", label: "visit all, come home", type: "note", pos: [-5, 0, -7] },
      { id: "n1", label: "(n-1)!  ~ n^n", type: "note", pos: [3, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "v1", to: "v2" },
      { from: "v2", to: "v3" },
      { from: "v3", to: "v4" },
      { from: "v4", to: "v5" },
      { from: "v5", to: "v1" },
      { from: "v2", to: "v5" },
      { from: "v1", to: "v3", dashed: true },
      { from: "v2", to: "v4", dashed: true },
      { from: "v5", to: "v3", dashed: true },
      { from: "arr", to: "v1", label: "fix", dashed: true }
    ],
    steps: [
      {
        title: "Visit everyone once, then close",
        text: "A Hamiltonian cycle is a closed walk through every vertex exactly once. Several may exist. This is not TSP: no edge weights, no 'cheapest', just the cycles themselves.",
        highlight: ["v1", "v2", "v3", "v4", "v5", "n0", "gzone"]
      },
      {
        title: "Easy nos: cut vertex, pendant, disconnected",
        text: "The graph must be connected. An articulation point splits the graph at one vertex — you cannot tour both sides without reusing it. A degree-1 pendant has no way out. Those instances die before DFS.",
        highlight: ["art", "v1", "v2"],
        fail: ["art"]
      },
      {
        title: "Lock x[1] = 1, open position 2",
        text: "Rotating the same necklace is not a new cycle. Fix the start at vertex 1 and backtrack only on slots 2..n. NextVertex will try 2 first: unused, and 1-2 is an edge.",
        highlight: ["arr", "v1", "v2", "x2"],
        hide: ["art"],
        flows: [
          { from: "arr", to: "v1", color: "#facc15", label: "x1=1" },
          { from: "v1", to: "v2", color: "#4ade80", label: "x2=2" }
        ]
      },
      {
        title: "Three bounds on every candidate",
        text: "Reject v if it already sits on the path, if there is no edge from x[k-1], or — when k is last — if there is no edge home to 1. That triple is the bounding function. Missing 3-5 is a kill later in the trace.",
        highlight: ["dup", "edg", "home", "v2", "v3"],
        hide: ["art"],
        flows: [
          { from: "v2", to: "v3", color: "#4ade80", label: "edge?" }
        ]
      },
      {
        title: "First cycle 1-2-3-4-5-1",
        text: "Path 1-2-3-4-5, and 5-1 exists. Print. The packet running 1→2→3→4→5→1 is the cycle. Position 5 then returns 0 and the search backtracks.",
        highlight: ["v1", "v2", "v3", "v4", "v5", "cycA", "home"],
        hide: ["art"],
        flows: [
          { from: "v1", to: "v2", color: "#4ade80", label: "1" },
          { from: "v2", to: "v3", color: "#4ade80", label: "2" },
          { from: "v3", to: "v4", color: "#4ade80", label: "3" },
          { from: "v4", to: "v5", color: "#4ade80", label: "4" },
          { from: "v5", to: "v1", color: "#4ade80", label: "home" }
        ]
      },
      {
        title: "Second cycle 1-2-5-4-3-1",
        text: "After 1-2, NextVertex also accepts 5 (edge 2-5). Then 4, then 3, and 3-1 closes. Second print. Same vertices, different necklace. Keep DFS for any remaining cycles.",
        highlight: ["v1", "v2", "v5", "v4", "v3", "cycB"],
        hide: ["art"],
        flows: [
          { from: "v1", to: "v2", color: "#c084fc", label: "1" },
          { from: "v2", to: "v5", color: "#c084fc", label: "2" },
          { from: "v5", to: "v4", color: "#c084fc", label: "5" },
          { from: "v4", to: "v3", color: "#c084fc", label: "4" },
          { from: "v3", to: "v1", color: "#c084fc", label: "home" }
        ]
      },
      {
        title: "(n−1)! on the exam line",
        text: "With the start locked, the tree permutes n−1 vertices. Quote (n−1)! , or n!, or n^n as the lecture does. NP-hard. Draw two leaves, not the whole tree.",
        highlight: ["n1", "arr", "cycA", "cycB"],
        hide: ["art"]
      }
    ]
  }
});
