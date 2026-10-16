window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 81,
  title: "BFS DFS - Simplified",
  video: "https://www.youtube.com/watch?v=kyUpc_5705s",
  category: "Strings, Trees & Arrays",
  tagline: "Visit versus explore: a queue gives BFS layers; a stack gives DFS paths.",
  summary: "Graph traversal visits every vertex. Visiting is arriving; exploring is visiting all neighbours of a vertex. BFS uses a queue: enqueue each newly visited vertex, dequeue the next vertex to explore — first-in, first-explored — and the tree of discovery edges is a BFS spanning tree. DFS uses a stack: the moment you visit a neighbour you suspend the current vertex and explore the neighbour (go deep, backtrack on dead ends). Many valid orders exist; skipping a still-white neighbour of the vertex you are exploring is invalid.",

  theory: [
    {
      heading: "Visit and explore",
      body: "Traversing a graph means visiting all vertices. The lecture splits that into two verbs. <b>Visit</b>: you have gone through a vertex (it is discovered). <b>Explore</b>: you visit every adjacent vertex of a given vertex. Vertex 4's neighbours are 1,3,5; exploring 4 means those three get visited if they have not been already. BFS and DFS are different policies for which visited-but-not-yet-fully-explored vertex you pick next.",
      bullets: [
        "Start at any vertex; the lecture often starts at 1.",
        "A neighbour already visited is skipped.",
        "The leftover discovery edges (no back/cross/cycle edges) form a spanning tree."
      ]
    },
    {
      heading: "BFS: the next vertex comes from a queue",
      body: "Visit 1, put 1 in a queue, then explore 1: visit 2 and 4 (either order) and enqueue them. Dequeue 2, explore it: visit 3. Dequeue 4, explore it: visit 5. Dequeue 3: visit 8 then 9. Dequeue 5: visit 6 then 7. Leaves 8,9,6,7 have nothing new. The structure is a <b>queue</b> because vertices are explored in the order they were first visited (FIFO). One run: <code>1,2,4,3,5,8,9,6,7</code>. Another equally legal run visits 4 before 2: <code>1,4,2,5,3,6,7,8,9</code>. Starting at 4 or 3 yields other valid lists. The picture of discovery edges, cycles omitted, is the <b>BFS spanning tree</b>.",
      bullets: [
        "New vertex → enqueue.",
        "Vertex to explore next → dequeue (front of the queue).",
        "You must take all neighbours of the current vertex before the next dequeued one."
      ]
    },
    {
      heading: "Invalid BFS (exam traps)",
      body: "After 1,2,4 you may not jump to 6: 6 is a neighbour of 5, and 5 is not yet explored. After 1,4,2,3 you must include 5 (neighbour of 4) before 8,9 from 3's later exploration — missing 5 is wrong. After starting at 3 you must take 2,4,8,9 (all of 3's neighbours) before 5,6,7. Rule: the next exploration target is always the head of the queue, and when you explore you must list every still-unvisited neighbour.",
      bullets: [
        "BFS is not 'any order as long as you eventually visit all'.",
        "A skipped adjacent of the vertex just dequeued kills the sequence.",
        "Queue discipline is the grading rubric."
      ]
    },
    {
      heading: "DFS: suspend on a stack and go deep",
      body: "Visit 1, push 1, explore 1, visit 2 — immediately <b>stop exploring 1</b>, push 1 back / leave it on the stack, and explore 2. Visit 3, suspend 2, explore 3, visit 4, then 5, then 6. 6 is a dead end: pop to 5, take the other neighbour 7 (dead end), pop until 3 still has 8 and 9, then drain 2 and 1. One valid order: <code>1,2,3,4,5,6,7,8,9</code>. Another: from 3 go to 8 and 9 before 4. The structure is a <b>stack</b> (LIFO): unfinished vertices wait while you dive. The discovery edges form a <b>DFS spanning tree</b> — typically a long spine with a few branches, not BFS's bushy layers.",
      bullets: [
        "On visiting a new neighbour, suspend the current vertex (stack) and explore the neighbour.",
        "Dead end → pop and resume the suspended exploration.",
        "A vertex is fully explored only after every neighbour is visited."
      ]
    },
    {
      heading: "Invalid DFS",
      body: "From 1–2–3 you may go to 8, 9, or 4 — not to 5, which is not adjacent to 3. From 4 you must explore 5 (new neighbour) before wandering off to 9. Starting at 3, a legal dive is 3,2,1,4,5,6,7 then back to 3 for 8,9. Same graph, different start, still stack discipline. BFS vs DFS on an exam is: name the structure (queue vs stack) and reject sequences that skip a ready neighbour.",
      bullets: [
        "DFS cannot hop to a non-neighbour just because it looks close on the drawing.",
        "Finish the current vertex's remaining neighbours after backtracking.",
        "Several correct traces exist; the invalid ones violate adjacency or LIFO."
      ]
    }
  ],

  keyTerms: [
    { term: "Visit", def: "First time you arrive at a vertex (discover it)." },
    { term: "Explore", def: "Visit every adjacent vertex of a given vertex." },
    { term: "BFS", def: "Breadth-first search: FIFO queue; explore vertices in discovery order (layers)." },
    { term: "DFS", def: "Depth-first search: LIFO stack; dive along a path, backtrack at dead ends." },
    { term: "Spanning tree", def: "The tree of discovery edges from a traversal, cycles and closing edges omitted." },
    { term: "Dead end", def: "A vertex with no unvisited neighbour; DFS pops the stack." },
    { term: "FIFO / LIFO", def: "Queue order for BFS; stack order for DFS." }
  ],

  tradeoffs: [
    { pro: "BFS finds vertices in increasing hop-count from the start (shortest path in an unweighted graph).", con: "The queue can hold an entire layer; wide graphs use more extra memory." },
    { pro: "DFS uses a stack of only the current path and is a natural recursive implementation.", con: "The first time you reach a vertex may be a long way from the shortest hop path." },
    { pro: "Many valid BFS/DFS strings exist (neighbour order is free).", con: "Exam items plant one skipped neighbour; 'any permutation' is the wrong defence." }
  ],

  interviewTips: [
    "Define visit vs explore before you write a sequence.",
    "BFS: 'new vertices go to a queue; I explore the front.' Quote 1,2,4,3,5,8,9,6,7 as one legal run.",
    "DFS: 'I suspend the current vertex on a stack as soon as I take a new neighbour.'",
    "To reject a sequence, name the vertex being explored and the neighbour that was illegally skipped.",
    "Mention the spanning tree: BFS layers vs DFS spine.",
    "If they ask shortest path on an unweighted graph, pick BFS, not DFS."
  ],

  scene: {
    nodes: [
      { id: "g1", label: "1", type: "server", pos: [-8, 0, 0] },
      { id: "g2", label: "2", type: "worker", pos: [-4, 0, -4] },
      { id: "g4", label: "4", type: "worker", pos: [-4, 0, 4] },
      { id: "g3", label: "3", type: "worker", pos: [1, 0, -4] },
      { id: "g5", label: "5", type: "worker", pos: [1, 0, 4] },
      { id: "g8", label: "8", type: "point", pos: [6, 0, -6], color: "#60a5fa" },
      { id: "g9", label: "9", type: "point", pos: [6, 0, -2], color: "#60a5fa" },
      { id: "g6", label: "6", type: "point", pos: [6, 0, 2], color: "#c084fc" },
      { id: "g7", label: "7", type: "point", pos: [6, 0, 6], color: "#c084fc" },
      { id: "q", label: "BFS queue", type: "queue", pos: [-8, 0, 6], showAt: 0 },
      { id: "st", label: "DFS stack", type: "cache", pos: [-8, 0, -6], showAt: 3 },
      { id: "n0", label: "Visit a vertex; explore its adj", type: "note", pos: [8, 3, -7] },
      { id: "n1", label: "Enqueue new; explore from Q", type: "note", pos: [8, 3, 7], showAt: 0 },
      { id: "n2", label: "BFS tree: layers 1 | 2 4 | 3 5", type: "note", pos: [8, 3, 2], showAt: 1 },
      { id: "n3", label: "Invalid if a neighbour is skipped", type: "note", pos: [-8, 3, 7], showAt: 2 },
      { id: "n4", label: "DFS: suspend, dive, backtrack", type: "note", pos: [-8, 3, -7], showAt: 3 },
      { id: "n5", label: "Dead end 6 -> pop to 5 -> 7", type: "note", pos: [8, 3, -2], showAt: 4 }
    ],
    edges: [
      { from: "g1", to: "g2" },
      { from: "g1", to: "g4" },
      { from: "g2", to: "g3" },
      { from: "g4", to: "g3" },
      { from: "g4", to: "g5" },
      { from: "g3", to: "g8" },
      { from: "g3", to: "g9" },
      { from: "g5", to: "g6" },
      { from: "g5", to: "g7" },
      { from: "g5", to: "g8", dashed: true },
      { from: "q", to: "g1", showAt: 0, dashed: true },
      { from: "st", to: "g1", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "Visit versus explore",
        text: "Start at 1. Visiting 1 is discovery. Exploring 1 means visiting its adjacent vertices 2 and 4. Those two verbs drive both algorithms.",
        highlight: ["g1", "g2", "g4", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "q", "st"],
        flows: [
          { from: "g1", to: "g2", color: "#4ade80", label: "adj" },
          { from: "g1", to: "g4", color: "#4ade80", label: "adj" }
        ]
      },
      {
        title: "BFS fills a queue",
        text: "Put 1 in the queue, explore it, enqueue 2 and 4. Next explore 2 (front): enqueue 3. Then 4: enqueue 5. FIFO: vertices are explored in the order they were discovered.",
        highlight: ["g1", "g2", "g4", "g3", "g5", "q", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "st"],
        flows: [
          { from: "g1", to: "q", color: "#fb923c", label: "enq" },
          { from: "q", to: "g2", color: "#fb923c", label: "deq" }
        ]
      },
      {
        title: "BFS spanning tree in layers",
        text: "Explore 3 → 8,9; explore 5 → 6,7. Discovery edges without cycles: layers {1}, {2,4}, {3,5}, {8,9,6,7}. That forest of discovery edges is the BFS spanning tree. Neighbour order can swap 2 with 4 and still be BFS.",
        highlight: ["g8", "g9", "g6", "g7", "g5", "g3", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "st"],
        flows: [
          { from: "g3", to: "g8", color: "#60a5fa", label: "layer" },
          { from: "g5", to: "g6", color: "#60a5fa", label: "layer" }
        ]
      },
      {
        title: "A skipped neighbour is not BFS",
        text: "Sequence 1,4,2,3,8,9,6,7 forgot 5, which is adjacent to 4 and should have been visited when 4 was explored. Another fail: taking 6 while 5 is not yet the exploration vertex. Queue discipline decides true vs false.",
        highlight: ["g4", "g5", "g6", "n3"],
        fail: ["g6"],
        hide: ["n0", "n1", "n2", "n4", "n5", "st", "q"],
        flows: [
          { from: "g4", to: "g5", color: "#f87171", label: "missed" }
        ]
      },
      {
        title: "DFS dives with a stack",
        text: "Visit 1, start exploring, take 2, suspend 1 on the stack, explore 2, take 3, suspend 2, and so on down to 6. You do not wait to visit 4 until the dive returns. LIFO, not FIFO.",
        highlight: ["g1", "g2", "g3", "g4", "g5", "st", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "q"],
        flows: [
          { from: "g1", to: "g2", color: "#c084fc", label: "dive" },
          { from: "g2", to: "g3", color: "#c084fc", label: "dive" },
          { from: "g3", to: "g4", color: "#c084fc", label: "dive" }
        ]
      },
      {
        title: "Dead end, pop, other child",
        text: "6 has no new neighbour: pop to 5, take 7, dead end, pop to 4 (done), pop to 3, take 8 then 9. Valid DFS. Invalid: 1,2,3,5 — 5 is not adjacent to 3. The DFS spanning tree is this spine plus the backtracked branches.",
        highlight: ["g6", "g5", "g7", "g8", "g9", "st", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "q"],
        flows: [
          { from: "g6", to: "g5", color: "#fb923c", label: "pop" },
          { from: "g5", to: "g7", color: "#4ade80", label: "7" },
          { from: "g3", to: "g8", color: "#4ade80", label: "8" }
        ]
      }
    ]
  }
});
