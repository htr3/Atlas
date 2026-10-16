window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 80,
  title: "Shortest Path Algorithms (Dijkstra and Bellman-Ford) - Simplified",
  video: "https://www.youtube.com/watch?v=2raV0H9KqY8",
  category: "Strings, Trees & Arrays",
  tagline: "Dijkstra greedily locks the nearest vertex; Bellman-Ford relaxes every edge |V|−1 times and survives negatives.",
  summary: "Single-source shortest paths: from a source, label every vertex with a distance. Relaxation of edge u→v is 'if dist[u]+w(u,v) < dist[v] then update'. Dijkstra is greedy: repeatedly select the unsettled vertex with smallest dist and relax only its outgoing edges — correct on non-negative weights, Θ(n²) on a dense graph. Bellman-Ford is DP: relax all edges, |V|−1 rounds, and handles negative edges. A further round that still updates proves a negative cycle (the lecture's 5+3−10=−2 loop). Dijkstra is not safe on negatives.",

  theory: [
    {
      heading: "Single source, and what relaxation means",
      body: "Weighted directed (or undirected) graph. Pick a source s. Want dist(s,v) for every v, possibly via other vertices. Both algorithms share <b>relaxation</b>: for an edge u→v with weight w, if dist[u]+w < dist[v], set dist[v] to that sum (and remember u as parent). If dist[u] is still ∞, the test does nothing. Initialise dist[s]=0 and every other dist=∞, then decide in which order to relax.",
      bullets: [
        "Relaxation never increases a distance.",
        "After enough correct relaxes, dist[v] is the shortest-path value.",
        "Parent pointers reconstruct the actual path."
      ]
    },
    {
      heading: "Dijkstra: pick the nearest, then relax its neighbours",
      body: "Greedy. After putting s at 0 and neighbours at their direct edge weights (others ∞), <b>select the unsettled vertex with the smallest label</b> and freeze it — that distance is final when all remaining edges are non-negative. Relax only edges out of that vertex, then pick the next smallest, and so on. Worked graph from the full lecture: source 1 with direct 2 and 4 to vertices 2 and 3. Select 2 (dist 2), relax 2→3 to 3 and 2→5 toward 9. Select 3 (dist 3), set vertex 5 to 6. Select 5 (dist 6), improve 4 to 8 and 6 to 11. Select 4 (dist 8), improve 6 to 9. Final: 2,3,8,6,9 for vertices 2–6. Each of n vertices may look at up to n others: <b>Θ(n²)</b> (or Θ(n²) / O(n²) in the adjacency-matrix presentation).",
      bullets: [
        "Only outgoing edges of the selected vertex are relaxed.",
        "Non-negative weights make the smallest unsettled label safe to lock.",
        "Dense-graph bound quoted in the long lecture: order n²."
      ]
    },
    {
      heading: "Why Dijkstra rejects negative edges",
      body: "Once a vertex is selected, Dijkstra never revisits it. A later negative edge that should cheapen that path has no chance to run. So the greedy lock is wrong whenever a negative weight could still improve a 'finished' node. Use Dijkstra on maps, routing with positive costs, not on graphs with discounts or penalties.",
      bullets: [
        "Greedy correctness proof needs w ≥ 0.",
        "A single negative edge can invalidate a locked dist.",
        "Negative cycle is an even harder 'unbounded below' problem."
      ]
    },
    {
      heading: "Bellman-Ford: relax every edge |V|−1 times",
      body: "Dynamic programming. If the shortest path is simple, it has at most |V|−1 edges, so |V|−1 rounds that each relax <b>all</b> edges are enough, regardless of order (a bad order just delays the news until a later round). Four vertices ⇒ 3 rounds. Example: edges (3,2,−10), (4,3,3), (1,4,5), (1,2,4), source 1 at 0. Round 1 may only set 4←5 and 2←4 if 3 and 4 still sit at ∞. Later rounds carry 5+3=8 into vertex 3, then 8+(−10)=<b>−2</b> into vertex 2, beating the old 4. Extra round 4 changes nothing — distances have settled. Negatives are fine; the −10 edge is the whole point.",
      bullets: [
        "Time Θ(|V|·|E|); complete graph up to Θ(n³).",
        "Order of edges in a round does not break correctness, only speed of propagation.",
        "Handles negative edge weights on acyclic-in-the-negative-sense graphs."
      ]
    },
    {
      heading: "Negative cycles: 5 + 3 − 10 = −2",
      body: "Add edge 2→4 with weight 5. Vertices 2,4,3 now form a cycle of total weight 5+3−10=<b>−2</b>. After |V|−1 rounds, one more relaxation still updates (8−10=−2, then 3+3=6, and so on). Distances would fall forever; there is no finite shortest path. Bellman-Ford <b>detects</b> that: if round |V| relaxes anything, report a negative cycle. A positive-weight cycle is harmless. Dijkstra has no such extra pass and cannot be used here.",
      bullets: [
        "Negative-weight cycle ⇒ unbounded shortest paths.",
        "Detection: one extra all-edge relaxation after |V|−1 rounds.",
        "The leftover simplified-transcript line is this −2 cycle sum."
      ]
    },
    {
      heading: "Which algorithm on an exam",
      body: "Positive weights, need speed on a dense graph or with a heap: Dijkstra. Any negative edge, or you must certify 'no negative cycle': Bellman-Ford. Both are single-source; all-pairs is Floyd-Warshall (another lecture). Do not mix: 'Dijkstra with negatives if I am careful' is the trap.",
      bullets: [
        "Dijkstra: greedy, non-negative, faster typical bound.",
        "Bellman-Ford: DP, negatives OK, cycle check, slower.",
        "Same relaxation primitive, different schedule."
      ]
    }
  ],

  keyTerms: [
    { term: "Relaxation", def: "If dist[u]+w(u,v) < dist[v], set dist[v] to that sum." },
    { term: "Dijkstra", def: "Repeatedly lock the unsettled vertex of minimum dist and relax its outgoing edges. Needs w ≥ 0." },
    { term: "Bellman-Ford", def: "Relax all edges, |V|−1 times. Works with negative edges; extra round detects negative cycles." },
    { term: "Negative cycle", def: "A cycle whose weights sum to less than 0; shortest paths are undefined. Example 5+3−10=−2." },
    { term: "Single source", def: "One start vertex s; answers dist(s,·) for every other vertex." },
    { term: "Greedy lock", def: "Dijkstra's decision that the current smallest label will never shrink again." },
    { term: "Θ(n²) vs Θ(VE)", def: "Dense Dijkstra vs Bellman-Ford's round-by-edge product (up to n³ if E~n²)." }
  ],

  tradeoffs: [
    { pro: "Dijkstra locks a vertex once and on non-negative graphs is the faster practical choice (n² or E log V with a heap).", con: "Any negative edge can make a locked distance wrong; there is no cycle test." },
    { pro: "Bellman-Ford accepts negative edges and can prove a negative cycle exists.", con: "|V| full passes over E edges is slower; a complete graph is cubic." },
    { pro: "Both reuse the same one-line relaxation.", con: "Using Dijkstra's selection order on a negative graph is a silent wrong answer, not a crash." }
  ],

  interviewTips: [
    "Write relaxation first, then say how each algorithm schedules it.",
    "Dijkstra: pick min unsettled, relax neighbours only; quote the 2 / 3 / 6 / 8 / 9 distance trace if they want a dry run.",
    "State the non-negative requirement before they ask; give a one-edge counterexample.",
    "Bellman-Ford: |V|−1 rounds of all edges; extra round for the cycle check.",
    "Compute 5+3−10=−2 out loud so they hear you know why distances keep falling.",
    "Complexity: Dijkstra ~ n² (matrix) or E log V (heap); Bellman-Ford VE."
  ],

  scene: {
    nodes: [
      { id: "v1", label: "1 src", type: "server", pos: [-8, 0, 0] },
      { id: "v2", label: "2 d=2", type: "worker", pos: [-3, 0, -4] },
      { id: "v3", label: "3 d=3", type: "worker", pos: [-3, 0, 4] },
      { id: "v5", label: "5 d=6", type: "worker", pos: [3, 0, 4] },
      { id: "v4", label: "4 d=8", type: "worker", pos: [3, 0, -4] },
      { id: "v6", label: "6 d=9", type: "worker", pos: [8, 0, 0] },
      { id: "bf2", label: "2 dist -2", type: "cache", pos: [8, 0, 5], showAt: 3 },
      { id: "cyc", label: "cycle 5+3-10=-2", type: "zone", pos: [5.5, 0, 4], size: [8, 5], showAt: 4 },
      { id: "n0", label: "Relax: dist[u]+w < dist[v]", type: "note", pos: [-8, 3, -7] },
      { id: "n1", label: "Dijkstra: lock min, relax out", type: "note", pos: [8, 3, -7], showAt: 0 },
      { id: "n2", label: "Final 2,3,8,6,9  time ~ n^2", type: "note", pos: [8, 3, 7], showAt: 2 },
      { id: "n3", label: "BF: all edges, |V|-1 rounds", type: "note", pos: [-8, 3, 7], showAt: 3 },
      { id: "n4", label: "8 + (-10) = -2 beats 4", type: "note", pos: [-8, 3, 2], showAt: 3 },
      { id: "n5", label: "Round |V| still updates: neg cycle", type: "note", pos: [0, 3, 7], showAt: 4 }
    ],
    edges: [
      { from: "v1", to: "v2", label: "2" },
      { from: "v1", to: "v3", label: "4" },
      { from: "v2", to: "v3", label: "1" },
      { from: "v2", to: "v4", label: "7" },
      { from: "v3", to: "v5", label: "3" },
      { from: "v5", to: "v4", label: "2" },
      { from: "v5", to: "v6", label: "5" },
      { from: "v4", to: "v6", label: "1" },
      { from: "v3", to: "bf2", label: "-10", showAt: 3, dashed: true },
      { from: "bf2", to: "v4", label: "5", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Relaxation is the shared primitive",
        text: "dist[1]=0, others ∞ (or a direct edge). An edge u→v fires if dist[u]+w is smaller than dist[v]. Dijkstra and Bellman-Ford only disagree on which edges fire when.",
        highlight: ["v1", "v2", "v3", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "bf2", "cyc"],
        flows: [
          { from: "v1", to: "v2", color: "#4ade80", label: "set 2" },
          { from: "v1", to: "v3", color: "#4ade80", label: "set 4" }
        ]
      },
      {
        title: "Dijkstra locks vertex 2, then 3",
        text: "Smallest unsettled is 2 (dist 2). Freeze it; relax 2→3 to 3 and 2→4 toward 9. Next lock 3 (dist 3); relax 3→5 to 6. Greedy: never reopen a locked vertex. Weights here are positive, so that is safe.",
        highlight: ["v1", "v2", "v3", "v5", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "bf2", "cyc"],
        flows: [
          { from: "v2", to: "v3", color: "#fb923c", label: "2+1=3" },
          { from: "v3", to: "v5", color: "#fb923c", label: "3+3=6" }
        ]
      },
      {
        title: "Finish Dijkstra: 8 and 9",
        text: "Lock 5 (6), improve 4 to 8 and 6 to 11. Lock 4 (8), improve 6 to 9. Distances 2,3,8,6,9. About n selections times n scans: Θ(n²) on an adjacency matrix. A negative edge would have broken a lock.",
        highlight: ["v4", "v5", "v6", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "bf2", "cyc"],
        flows: [
          { from: "v5", to: "v4", color: "#60a5fa", label: "6+2=8" },
          { from: "v4", to: "v6", color: "#60a5fa", label: "8+1=9" }
        ]
      },
      {
        title: "Bellman-Ford: 8 − 10 = −2",
        text: "Now allow a −10 edge into vertex 2. Relax every edge for |V|−1 rounds. News of 5 on vertex 4 becomes 8 on 3, then 8−10=−2 on 2, which beats Dijkstra-style 4. Negative edges are allowed because no vertex is locked early.",
        highlight: ["v1", "v3", "bf2", "n3", "n4"],
        hide: ["n0", "n1", "n2", "n5", "cyc"],
        flows: [
          { from: "v3", to: "bf2", color: "#c084fc", label: "8-10" }
        ]
      },
      {
        title: "One more round: negative cycle",
        text: "Close 2→4 with weight 5. Cycle 2-4-3 sums to 5+3−10=−2. After |V|−1 rounds a further all-edge pass still updates. Report a negative cycle; finite shortest paths do not exist. Dijkstra has no such test.",
        highlight: ["bf2", "v4", "v3", "cyc", "n5"],
        fail: ["bf2"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "bf2", to: "v4", color: "#f87171", label: "-2+5" },
          { from: "v4", to: "v3", color: "#f87171", label: "+3" }
        ]
      }
    ]
  }
});
