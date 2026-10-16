window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 61,
  title: "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
  video: "https://www.youtube.com/watch?v=pcKY4hjDrxk",
  category: "Graphs & Backtracking",
  tagline: "Visit then explore: a queue walks breadth, a stack walks depth. O(V+E).",
  summary: "Two graph (and tree) walks differ only in when you explore a newly visited vertex. BFS finishes every neighbor of the current vertex before the next, using a queue; the order on a binary tree is level order. DFS suspends the current vertex the instant a new one is reached, using a stack; the order is preorder. Start vertex and neighbor order are free; the rule is not. BFS leftover edges are cross edges; DFS leftover edges are back edges. Time is linear in vertices plus edges.",

  theory: [
    {
      heading: "Visit versus explore",
      body: "Both walks are built from two verbs. <b>Visit</b> means you arrive at a vertex and record it in the output. <b>Explore</b> means you are already on a vertex and you visit every still-unvisited neighbor. Confusing the two is why students mix BFS with DFS. The algorithms share the verbs; they disagree on <i>when</i> a newly visited vertex is allowed to start its own exploration.",
      bullets: [
        "Visit: mark the vertex, append it to the traversal.",
        "Explore: walk the adjacency list of the vertex you currently own.",
        "A vertex may be visited long before it is fully explored."
      ]
    },
    {
      heading: "BFS on the small tree: finish the vertex you own",
      body: "The lecture's first graph is a tree with root <code>1</code>, children <code>2, 4, 5</code>, and <code>2</code>'s children <code>7, 6, 3</code>. Start anywhere — here, vertex 1. Visit 1, then <b>explore 1 completely</b>: visit 2, then 4, then 5 (any neighbor order is legal). Only after 1 has no unvisited neighbor do you pick the next vertex to explore, in the order they were visited: explore 2, which visits 7, 3, 6. Leaves 4 and 5 have nothing left. Output one valid BFS: <code>1, 2, 4, 5, 7, 3, 6</code>. The rule: never start exploring a later vertex while the current one still has a fresh neighbor.",
      bullets: [
        "Start vertex is free; neighbor order is free.",
        "The locked rule: explore every adjacent vertex before you change explorer.",
        "The next explorer is the oldest still-unexplored visited vertex — a queue."
      ]
    },
    {
      heading: "DFS on the same tree: suspend and dive",
      body: "Start at 1 again. Visit 1 and begin exploring it. The first neighbor you pick is 2. The moment 2 is a <b>new</b> vertex, you <i>suspend</i> 1 (push it on a stack) and start exploring 2. From 2 you pick 3, suspend 2, explore 3 — a leaf, so pop back to 2. Continue 2: visit 6, then 7. When 2 is done, pop to 1 and finish 1's leftover neighbors 4 and 5. Output: <code>1, 2, 3, 6, 7, 4, 5</code>. Same graph, different walk, because a newly visited vertex steals the explorer role immediately.",
      bullets: [
        "New vertex → stop the old exploration, start the new one.",
        "The stack remembers who was interrupted and in which order.",
        "Fully explored vertices pop; unfinished ones wait on the stack."
      ]
    },
    {
      heading: "Binary tree: BFS is level order, DFS is preorder",
      body: "On a complete binary tree of seven nodes the same rules collapse to textbook tree walks. BFS from the root visits level 0, then level 1, then level 2: <code>1, 2, 3, 4, 5, 6, 7</code> — <b>level order</b>. DFS that always takes the left child first is <code>1, 2, 4, 5, 3, 6, 7</code> — <b>preorder</b>. That pair is the exam one-liner: BFS ≈ level order, DFS ≈ preorder, once you remember that a tree is a graph.",
      bullets: [
        "Level order is BFS with a queue of children.",
        "Preorder is DFS that records a node before its subtrees.",
        "Inorder and postorder are DFS variants with a different record time; the lecture's DFS is the preorder timing."
      ]
    },
    {
      heading: "Worked BFS with a queue on the large graph",
      body: "On the 10-vertex lecture graph, BFS is the loop: enqueue the start, then while the queue is live, dequeue <code>u</code> and enqueue every unvisited neighbor of <code>u</code>. Start at 1. Initial: visit 1, queue <code>[1]</code>. Explore 1: neighbors 4 and 2 — visit both, queue <code>[4, 2]</code>. Explore 4: neighbor 3, queue <code>[2, 3]</code>. Explore 2: skip 3 (already visited), visit 5, 8, 7, queue <code>[3, 5, 8, 7]</code>. Explore 3: visit 10 and 9. Explore 5: visit 6 (8 and 7 already seen). The remaining dequeues find only already-visited neighbors. One valid order: <code>1, 4, 2, 3, 5, 8, 7, 10, 9, 6</code>. Tree edges of this walk form the <b>BFS spanning tree</b>. An edge to an already-visited vertex that is not the parent is drawn dotted and called a <b>cross edge</b>.",
      bullets: [
        "Init: visit start, put it in the queue.",
        "Repeat: dequeue, visit every fresh neighbor, enqueue each.",
        "Many BFS orders exist (start at 5 is another valid walk); all of them obey the queue rule."
      ]
    },
    {
      heading: "Worked DFS with a stack, then complexity",
      body: "DFS on the same graph: visit 1, push 1, dive to 4, dive to 3, dive to 10 (leaf, pop), then 9, then from 3 to 2, then 8, 7, 5, 6. One valid order: <code>1, 4, 3, 10, 9, 2, 8, 7, 5, 6</code>. The tree edges form the <b>DFS spanning tree</b>. Dotted leftovers are <b>back edges</b> (they close a path to an ancestor, or to a vertex already on the current chain). The lecture quotes time as <b>O(n)</b> in the number of vertices; that is the vertex-scan view. On an adjacency-list graph you also walk every edge twice (undirected) or once (directed), so the tight bound is <code>O(V + E)</code>. Both algorithms pay that. Extra space is the queue or stack, O(V) worst case.",
      bullets: [
        "Init: visit start, push it.",
        "Repeat: from the top of the stack, take one fresh neighbor and push it; if none, pop.",
        "Exam phrasing: BFS uses a queue and produces cross edges; DFS uses a stack and produces back edges."
      ]
    }
  ],

  keyTerms: [
    { term: "Visit", def: "Arrive at a vertex and record it in the traversal output." },
    { term: "Explore", def: "From a vertex you already own, visit every still-unvisited adjacent vertex." },
    { term: "BFS", def: "Finish exploring the current vertex before the next; frontier is a FIFO queue." },
    { term: "DFS", def: "On visiting a new vertex, suspend the old one and explore the new; frontier is a stack." },
    { term: "BFS spanning tree", def: "Tree edges used while BFS first discovers vertices; leftover edges are cross edges." },
    { term: "DFS spanning tree", def: "Tree edges used while DFS first discovers vertices; leftover edges are back edges." },
    { term: "Cross edge", def: "BFS leftover: an edge to an already-visited vertex that is not the BFS parent." },
    { term: "Back edge", def: "DFS leftover: an edge that closes a path toward an ancestor on the current stack." }
  ],

  tradeoffs: [
    { pro: "BFS finds unweighted shortest paths: the first time you visit v is after the fewest edges.", con: "The queue can hold a whole level, so BFS uses more memory on bushy graphs than a skinny DFS stack." },
    { pro: "DFS is the natural engine for backtracking, cycle detection, and topological ideas that need a stack of unfinished vertices.", con: "DFS discovery order is not a distance order; do not quote it as shortest path." },
    { pro: "Start vertex and neighbor order are free, so many correct answers exist on the same graph.", con: "Graders who fix an adjacency-list order will reject a legal walk that used a different neighbor permutation." },
    { pro: "Both walks are O(V+E) on adjacency lists — linear in the input size.", con: "An adjacency-matrix scan is O(V^2) even on sparse graphs, because you probe every possible pair." }
  ],

  interviewTips: [
    "Define visit versus explore first; then say BFS finishes explore, DFS suspends on a new visit.",
    "Name the structures: BFS queue (FIFO), DFS stack (or the call stack of recursion).",
    "On a binary tree, say BFS = level order and DFS = preorder, then give a 7-node trace.",
    "For the large graph, write one full BFS with the queue contents after each dequeue, and label dotted leftovers as cross edges.",
    "For DFS, write one full stack trace and label leftovers as back edges. Mention O(V+E), not only O(n).",
    "If they ask 'is this BFS valid?': check the rule (all neighbors of u before the next explorer), not a single canonical permutation."
  ],

  scene: {
    nodes: [
      { id: "gzone", label: "Graph / tree", type: "zone", pos: [-2, 0, 1], size: [16, 12] },
      { id: "v1", label: "1", type: "server", pos: [-2, 0, 6], color: "#60a5fa" },
      { id: "v2", label: "2", type: "server", pos: [-7, 0, 1], color: "#60a5fa" },
      { id: "v4", label: "4", type: "server", pos: [-2, 0, 1], color: "#60a5fa" },
      { id: "v5", label: "5", type: "server", pos: [3, 0, 1], color: "#60a5fa" },
      { id: "v7", label: "7", type: "server", pos: [-10, 0, -4], color: "#60a5fa" },
      { id: "v3", label: "3", type: "server", pos: [-6, 0, -4], color: "#60a5fa" },
      { id: "v6", label: "6", type: "server", pos: [-3, 0, -4], color: "#60a5fa" },
      { id: "qbox", label: "BFS queue", type: "queue", pos: [9, 0, 6], showAt: 1 },
      { id: "q0", label: "front 1", type: "note", pos: [9, 0, 3.5], showAt: 1 },
      { id: "q1", label: "2  4  5", type: "note", pos: [9, 0, 1.5], showAt: 2 },
      { id: "q2", label: "4 5 7 3 6", type: "note", pos: [9, 0, -0.5], showAt: 3 },
      { id: "stk", label: "DFS stack", type: "storage", pos: [9, 0, -3.5], showAt: 4, color: "#c084fc" },
      { id: "s0", label: "top 1 then 2", type: "note", pos: [9, 0, -6], showAt: 4 },
      { id: "s1", label: "dive 2 then 3", type: "note", pos: [9, 0, -7.5], showAt: 5 },
      { id: "n0", label: "Visit vs explore", type: "note", pos: [-9, 0, 7] },
      { id: "n1", label: "BFS = level order", type: "note", pos: [-9, 0, -7], showAt: 6 },
      { id: "n2", label: "DFS = preorder", type: "note", pos: [-2, 0, -7], showAt: 6 },
      { id: "n3", label: "cross vs back edges", type: "note", pos: [6, 0, -7.5], showAt: 7 }
    ],
    edges: [
      { from: "v1", to: "v2" },
      { from: "v1", to: "v4" },
      { from: "v1", to: "v5" },
      { from: "v2", to: "v7" },
      { from: "v2", to: "v3" },
      { from: "v2", to: "v6" },
      { from: "v1", to: "qbox", label: "enqueue", showAt: 1, dashed: true },
      { from: "v1", to: "stk", label: "push", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Two verbs on every walk",
        text: "Visit means you land on a vertex and write it down. Explore means you are already there and you visit every adjacent vertex still unseen. BFS and DFS share the verbs; they disagree on when a newly visited vertex may start exploring.",
        highlight: ["v1", "n0", "gzone"]
      },
      {
        title: "BFS init: visit 1, enqueue 1",
        text: "Pick any start — here vertex 1. Visit it, put it in the queue. The queue is the only place the next explorer may come from. Neighbor order is free; the FIFO rule is not.",
        highlight: ["v1", "qbox", "q0"],
        flows: [
          { from: "v1", to: "qbox", color: "#fb923c", label: "Q ← 1" }
        ]
      },
      {
        title: "Explore 1 completely: 2, 4, 5",
        text: "Dequeue 1. Visit every neighbor before you change explorer: 2, then 4, then 5, each enqueued as it is visited. Do not dive into 2's children yet. That is the BFS lock.",
        highlight: ["v1", "v2", "v4", "v5", "qbox", "q1"],
        flows: [
          { from: "v1", to: "v2", color: "#4ade80", label: "visit" },
          { from: "v1", to: "v4", color: "#4ade80", label: "visit" },
          { from: "v1", to: "v5", color: "#4ade80", label: "visit" }
        ]
      },
      {
        title: "Next explorer is front-of-queue 2",
        text: "1 is done. Dequeue 2 and explore it: visit 7, 3, 6. Leaves 4 and 5 then drain with empty adjacency leftovers. One valid BFS: 1, 2, 4, 5, 7, 3, 6.",
        highlight: ["v2", "v7", "v3", "v6", "qbox", "q2"],
        flows: [
          { from: "v2", to: "v7", color: "#4ade80", label: "visit" },
          { from: "v2", to: "v3", color: "#4ade80", label: "visit" },
          { from: "v2", to: "v6", color: "#4ade80", label: "visit" }
        ]
      },
      {
        title: "DFS: new vertex steals the explorer",
        text: "Same start, stack instead of queue. Visit 1, begin exploring, reach 2 — and immediately suspend 1. Push the interrupted vertex. Depth-first means the newest visit becomes the current explorer.",
        highlight: ["v1", "v2", "stk", "s0"],
        flows: [
          { from: "v1", to: "v2", color: "#c084fc", label: "dive" },
          { from: "v1", to: "stk", color: "#c084fc", label: "push 1" }
        ]
      },
      {
        title: "Dive 2 → 3, then backtrack the stack",
        text: "From 2 visit 3, suspend 2, explore the leaf 3, pop, then 6 and 7, then pop to 1 and finish 4 and 5. One valid DFS: 1, 2, 3, 6, 7, 4, 5. The stack is the frontier.",
        highlight: ["v2", "v3", "v6", "v7", "stk", "s1"],
        flows: [
          { from: "v2", to: "v3", color: "#c084fc", label: "dive" },
          { from: "v3", to: "v2", color: "#fb923c", label: "pop" }
        ]
      },
      {
        title: "Binary tree slogan",
        text: "On a binary tree the same engines collapse to named walks: BFS is level order (1 then 2,3 then 4,5,6,7). DFS that records on first visit is preorder. A tree is a graph, so the slogans transfer.",
        highlight: ["v1", "v2", "v4", "v5", "n1", "n2"]
      },
      {
        title: "Spanning trees and O(V+E)",
        text: "BFS leftovers are cross edges (dotted to an already visited vertex). DFS leftovers are back edges. The lecture says O(n) vertices; adjacency-list time is O(V+E) because every edge is scanned. Queue or stack space is O(V).",
        highlight: ["gzone", "n3", "qbox", "stk"],
        flows: [
          { from: "v5", to: "v1", color: "#fb923c", label: "tree edge" }
        ]
      }
    ]
  }
});
