window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 53,
  title: "4.4 Bellman Ford Algorithm - Single Source Shortest Path - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=FtN3BYH2Zes",
  category: "Dynamic Programming",
  tagline: "Relax every edge V−1 times; negatives are fine, a negative cycle is detected on pass V.",
  summary: "Single-source shortest paths on a directed graph that may have negative edges. Dijkstra can lie. Bellman-Ford is DP: try every edge as a last hop, V−1 rounds, because a simple shortest path has at most V−1 edges. Relax(u,v): if dist[u]+w(u,v) < dist[v], write the better dist[v]. A 7-vertex lecture graph settles after 3 of 6 rounds to distances 0,1,3,5,0,4,3. A fourth pass that still improves means a negative cycle.",

  theory: [
    {
      heading: "State: distance from the source after r edges",
      body: "Pick a source (vertex 1). Distances to all others. Dijkstra is greedy and assumes non-negative weights; a negative edge can make a \"settled\" vertex wrong. Bellman-Ford's state is dist[v]: best source↝v found so far. After r successful relaxations along a path, dist[v] is at most the best walk that uses ≤ r edges. A simple shortest path uses ≤ V−1 edges, so V−1 rounds suffice.",
      bullets: [
        "One source, all destinations; directed weighted arcs.",
        "Negatives allowed; Dijkstra is not trusted here.",
        "V−1 is the longest simple path's hop count (7 vertices ⇒ 6 rounds)."
      ]
    },
    {
      heading: "Recurrence as relaxation",
      body: "For each arc u→v: if dist[u] + c(u,v) < dist[v], set dist[v] = dist[u]+c(u,v). That is the DP step \"best path to v whose last edge is uv, versus whatever we already had.\" List every edge (order does not have to be a topology — the extra rounds compensate). Init: dist[source]=0, everyone else ∞. One pass over E is Θ(E); repeat V−1 times: <b>Θ(VE)</b>, which is Θ(n²) on sparse graphs and Θ(n³) on a complete digraph.",
      bullets: [
        "Relax(u,v): dist[v] = min(dist[v], dist[u]+w(u,v)).",
        "Any edge order is legal; some orders just converge sooner.",
        "Θ(VE); complete graph ⇒ Θ(n³)."
      ]
    },
    {
      heading: "Worked 7-vertex graph",
      body: "Source 1 at 0. First sweep: 1→2 writes 6, 1→3 writes 5, then 2→5 writes 5, 3→2 writes 3, 4→3 and 4→6 wait on 4, 5→7 writes 8, 6→7 later 7. Second sweep: 2 drops to 1 via 3→2, 5 drops to 2, 7 drops to 5. Third sweep: 5 becomes 0, 7 becomes 3. Further sweeps do not move. Distances: 1:0, 2:1, 3:3, 4:5, 5:0, 6:4, 7:3. The algorithm would still run the remaining three rounds; humans stop when a round is quiet.",
      bullets: [
        "Most of the movement happens in the first three of six passes.",
        "A negative last hop (3→2 weight −2) is how 2 beats the old 6.",
        "Quiet round ⇒ all simple shortest paths are already in dist[]."
      ]
    },
    {
      heading: "Small graph with a useful negative",
      body: "Four vertices, edges including 3→2 of weight −10. After three relaxations (V−1) you get 1:0, 2:−2, 3:8, 4:5. Vertex 2's −2 is 4→3→2 = 5+3+(−10). A fourth pass changes nothing — the answers are frozen, so they are correct even though a negative edge exists.",
      bullets: [
        "Negative edges are why this DP exists.",
        "V−1 passes: 4 vertices ⇒ 3 sweeps.",
        "An extra quiet pass is the sanity check."
      ]
    },
    {
      heading: "Drawback: negative cycle",
      body: "Add 2→4 weight 5 and the triangle 2-4-3 has total weight 5+3−10=−2. After V−1 passes, another sweep still lowers some dist (4, then 3, then 2…). Distances dive forever; there is no shortest path. Bellman-Ford <b>detects</b> this: run one extra round; any successful relax means a negative cycle reachable from the source. Positive-weight cycles are fine. Unreachable negative cycles do not poison the source's distances.",
      bullets: [
        "Negative-weight cycle: no finite shortest path.",
        "Detection: pass number V still relaxes.",
        "Positive cycles do not loop forever because extra laps add cost."
      ]
    }
  ],

  keyTerms: [
    { term: "Relaxation", def: "If dist[u]+w(u,v) is better than dist[v], overwrite dist[v] (and usually parent[v])." },
    { term: "V−1 rounds", def: "A simple shortest path has at most V−1 edges, so that many full edge scans suffice." },
    { term: "Θ(VE)", def: "Time: every edge, every round. n² typical, n³ if the digraph is complete." },
    { term: "Negative edge", def: "Legal here; illegal as a reason to trust Dijkstra's settled set." },
    { term: "Negative cycle", def: "A directed cycle whose weights sum negative; distances unbounded below." },
    { term: "Pass V test", def: "One extra scan; a successful relax proves a negative cycle is reachable." }
  ],

  tradeoffs: [
    { pro: "Handles negative edges that make Dijkstra's \"final\" label a lie.", con: "Θ(VE) is slower than Dijkstra on non-negative graphs." },
    { pro: "Edge order is free; you do not need a topological sort (and cycles exist).", con: "A hostile order just uses more of the V−1 budget." },
    { pro: "The V-th pass is a built-in negative-cycle detector.", con: "Without that extra pass you might report −2 as a \"shortest path\" on a diving cycle." },
    { pro: "Early quiet round lets a human stop; the exam algorithm still loops V−1 times.", con: "Code that breaks early is correct only if no later negative hop can still improve." }
  ],

  interviewTips: [
    "Name single-source, then say Dijkstra fails on negatives, Bellman-Ford is the DP.",
    "Write relax: dist[v]=min(dist[v], dist[u]+w(u,v)), repeat |V|−1 times over all edges.",
    "Justify V−1: longest simple path has V−1 hops.",
    "Quote Θ(VE), and n³ on a complete graph.",
    "Detection: one more pass; if anything relaxes, a negative cycle is reachable.",
    "On the 4-vertex example, 2's distance −2 uses the −10 edge; that is the point."
  ],

  scene: {
    nodes: [
      { id: "s", label: "1:0", type: "point", pos: [-10, 0, 2], color: "#fb923c" },
      { id: "a", label: "2", type: "point", pos: [-4, 0, 5], color: "#60a5fa" },
      { id: "b", label: "3", type: "point", pos: [-4, 0, -1], color: "#c084fc" },
      { id: "c", label: "4:5", type: "point", pos: [2, 0, -1], color: "#22d3ee" },
      { id: "d", label: "5", type: "point", pos: [2, 0, 5], color: "#4ade80" },
      { id: "e", label: "6:4", type: "point", pos: [8, 0, -1], color: "#a78bfa" },
      { id: "f", label: "7", type: "point", pos: [8, 0, 5], color: "#facc15" },
      { id: "n0", label: "dist=0 / else ∞", type: "note", pos: [-10, 0, 6] },
      { id: "n1", label: "relax u→v", type: "note", pos: [2, 0, -6], showAt: 1 },
      { id: "n2", label: "pass 1: 2=6, 3=5", type: "note", pos: [-4, 0, -6], showAt: 2 },
      { id: "n3", label: "3→2 −2 writes 1", type: "note", pos: [-4, 0, 7.5], showAt: 3 },
      { id: "n4", label: "pass 3: 5=0, 7=3", type: "note", pos: [8, 0, 7.5], showAt: 4 },
      { id: "n5", label: "V-1 = 6 rounds", type: "note", pos: [8, 0, -6], showAt: 5 },
      { id: "n6", label: "pass V still moves: −cycle", type: "note", pos: [2, 0, 7.5], showAt: 6 }
    ],
    edges: [
      { from: "s", to: "a", label: "6" },
      { from: "s", to: "b", label: "5" },
      { from: "s", to: "c", label: "5" },
      { from: "a", to: "d", label: "−1" },
      { from: "b", to: "a", label: "−2" },
      { from: "b", to: "d", label: "1" },
      { from: "c", to: "b", label: "−2" },
      { from: "c", to: "e", label: "−1" },
      { from: "d", to: "f", label: "3" },
      { from: "e", to: "f", label: "3" }
    ],
    steps: [
      {
        title: "Source 0, others ∞",
        text: "Seven vertices. dist[1]=0. Every other label is ∞. You will relax a recorded list of all ten arcs, V−1=6 times. Dijkstra is off the table because some weights are negative.",
        highlight: ["s", "a", "b", "c", "d", "e", "f", "n0"]
      },
      {
        title: "Relax is the recurrence",
        text: "For arc u→v: if dist[u]+w is smaller than dist[v], overwrite. That is \"best path to v whose last hop is this arc.\" One pass is Θ(E). Repeating it is the DP over hop count.",
        highlight: ["s", "a", "n1"],
        flows: [
          { from: "s", to: "a", color: "#4ade80", label: "relax" }
        ]
      },
      {
        title: "Pass 1 writes 6 and 5",
        text: "1→2 sets 2 to 6. 1→3 sets 3 to 5. 1→4 sets 4 to 5. Then 2→5 writes 5, 5→7 writes 8, 6→7 later 7. First hop paths are in.",
        highlight: ["s", "a", "b", "c", "n2"],
        flows: [
          { from: "s", to: "a", color: "#60a5fa", label: "6" },
          { from: "s", to: "b", color: "#c084fc", label: "5" }
        ]
      },
      {
        title: "Negative hop 3→2",
        text: "Second pass: 3's 5 plus −2 beats 2's 6, so 2 becomes 1. Then 2→5 (−1) writes 0 on a later pass. Negatives are not a bug — they are the improvement.",
        highlight: ["b", "a", "n3"],
        flows: [
          { from: "b", to: "a", color: "#fb923c", label: "5-2=3→1" }
        ]
      },
      {
        title: "Pass 3 freezes 0 and 3",
        text: "5 drops to 0 (via 2). 7 drops to 3 (0+3). 6 stays 4. Further passes in this graph are quiet: 1:0, 2:1, 3:3, 4:5, 5:0, 6:4, 7:3.",
        highlight: ["d", "f", "a", "n4"],
        flows: [
          { from: "a", to: "d", color: "#4ade80", label: "1-1=0" },
          { from: "d", to: "f", color: "#facc15", label: "0+3" }
        ]
      },
      {
        title: "Still run V−1",
        text: "The exam algorithm does not stop early. Six rounds on seven vertices. Time Θ(VE). A complete digraph with Θ(n²) edges becomes Θ(n³) — same cubic class as Floyd, different problem (one source).",
        highlight: ["n5", "s", "f"]
      },
      {
        title: "Pass V as a detector",
        text: "Add 2→4 weight 5 and the cycle 2-4-3 sums to −2. After V−1 labels still move. One extra scan that succeeds proves a negative cycle; there is no shortest path to freeze.",
        highlight: ["a", "c", "b", "n6"],
        fail: ["a", "c", "b"],
        flows: [
          { from: "a", to: "c", color: "#f87171", label: "−cycle" },
          { from: "c", to: "b", color: "#f87171" },
          { from: "b", to: "a", color: "#f87171" }
        ]
      }
    ]
  }
});
