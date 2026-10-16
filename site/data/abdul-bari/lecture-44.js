window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 44,
  title: "3.5 Prims and Kruskals Algorithms - Greedy Method",
  video: "https://www.youtube.com/watch?v=4ZlRH0eK-qQ",
  category: "Greedy Algorithms",
  tagline: "Grow a tree (Prim) or skip cycles (Kruskal); both MSTs cost 99 on the 7-vertex graph.",
  summary: "A spanning tree of n vertices uses n−1 edges and no cycle. On a weighted graph the MST is a spanning tree of minimum total weight. Prim locks the globally lightest edge, then repeatedly adds the lightest edge that touches the current tree: 10,25,22,12,16,14 cost 99. Kruskal sorts all edges and adds if they do not cycle: 10,12,14,16, skip 18, 22, skip 24, 25 — same 99. Naive Kruskal is Θ(VE); a heap makes it ~ n log n in the lecture. Disconnected graphs have no spanning tree; Kruskal may still forest each component. Optimal cost can be unique while the edge set is not.",

  theory: [
    {
      heading: "Spanning trees, then minimum cost",
      body: "Graph G=(V,E). A <b>spanning tree</b> keeps every vertex and exactly <b>n−1</b> edges, with no cycle. Six vertices and six edges yield up to 6C5=6 trees if every 5-edge subset is acyclic; extra edges that close cycles must be subtracted from the binomial count. On a weighted 4-vertex example the lecture drew trees of cost 14, 13, and 9 — same vertex set, different edge subsets, different totals. Trying every spanning tree finds the minimum and is hopeless on large n. Greedy replacements: <b>Prim</b> and <b>Kruskal</b>.",
      bullets: [
        "All vertices, n−1 edges, 0 cycles.",
        "Weighted graphs: different trees, different costs; we want the minimum.",
        "The 9-cost drawing is already an MST of that tiny graph; the 7-vertex board is the real workout."
      ]
    },
    {
      heading: "Greedy-choice logic: Prim vs Kruskal",
      body: "Prim: take the lightest edge in the whole graph as the seed (here 1–6 weight <b>10</b>). Forever after, take the lightest edge with <b>one end in the tree and one end outside</b> (the cut). That keeps the growing set a tree. Kruskal: ignore connectivity. Always consider the next global lightest edge; <b>add it iff it does not form a cycle</b>. Both are greedy (best edge under a local test, never revoked). Prim is tree-shaped at every step; Kruskal is a forest that merges.",
      bullets: [
        "Prim: min edge across the cut (S, V−S).",
        "Kruskal: min remaining edge that is not an intra-component chord.",
        "Neither enumerates spanning trees."
      ]
    },
    {
      heading: "Worked example: edges to 99",
      body: "Seven vertices. Edges: 1–6=10, 3–4=12, 2–7=14, 2–3=16, 4–7=18, 4–5=22, 5–7=24, 5–6=25, 1–2=28. <b>Prim</b> seed 1–6=10. Cut edges then 6–5=25 (28 is incident but heavier). Then 5–4=22. Then 4–3=12. Then 2–3=16. Then 2–7=14. Six edges, cost 10+25+22+12+16+14 = <b>99</b>. <b>Kruskal</b> order: 10, 12, 14, 16, skip 18 (cycle 2-3-4-7), 22, skip 24 (cycle), 25. Same six edges, same 99. Distant light edges (3–4=12) wait in Prim until the tree reaches them; Kruskal takes them immediately.",
      bullets: [
        "Prim never takes 3–4 first: it would be disconnected from {1,6}.",
        "Kruskal never takes 4–7=18: the cycle test fails.",
        "Both algorithms, one MST cost on this graph."
      ]
    },
    {
      heading: "Proof intuition, disconnected graphs, unique cost",
      body: "Cut property: the lightest edge across any cut sits in some MST — Prim’s move is safe. Cycle property: the heaviest edge on a cycle is out of some MST — Kruskal’s skip of 18 and 24 is safe. No algorithm builds a spanning tree of a disconnected graph. Prim started at vertex 1 would span only that component. Kruskal still emits a <b>minimum spanning forest</b> (a tree per component) because it never needs the whole graph to be connected while it picks. A later 5-vertex board has two MSTs (swap either weight-4 edge) with the same cost 12: the <b>optimal value is unique</b>, the edge set need not be. Missing-weight exam item: an unused chord is at least as heavy as the tree edge that beat it (the talk fills 4 and 6).",
      bullets: [
        "Cut property ⇔ Prim; cycle property ⇔ Kruskal.",
        "Disconnected: no spanning tree; Kruskal still forests components.",
        "One minimum cost, possibly several trees (the two cost-12 drawings)."
      ]
    },
    {
      heading: "Complexity",
      body: "Kruskal as taught: each of ~V accepted edges may scan E candidates for the next minimum → <b>Θ(V E)</b>, called n² when V≈E≈n. Put every edge in a <b>min-heap</b> (or sort E) and each find-min is log E; the lecture writes <b>n log n</b> for that heap version. Standard textbook: sort O(E log E) plus Union-Find almost O(E). Prim on an adjacency matrix is Θ(V²) (same loop as Dijkstra); a heap+adjacency list is O(E log V). Exams in this course want: V−1 edges, cost 99, heap improvement, and \"no MST if disconnected.\"",
      bullets: [
        "Naive Kruskal Θ(V E); heap/sort + disjoint sets much closer to E log E.",
        "Always |MST| = V−1 on a connected graph (6 edges for 7 vertices).",
        "Report the cost 99, not only the picture."
      ]
    }
  ],

  keyTerms: [
    { term: "Spanning tree", def: "Connected acyclic spanning subgraph: all V vertices, V−1 edges." },
    { term: "MST", def: "Spanning tree of minimum total edge weight (99 on the 7-vertex board)." },
    { term: "Cut property", def: "A lightest edge with one end in S and one end outside sits in some MST (Prim)." },
    { term: "Cycle property", def: "A heaviest edge on a cycle is omitted from some MST (Kruskal’s discards)." },
    { term: "Prim cut edge", def: "Candidate must touch the current tree; 3–4=12 waits until 4 is in." },
    { term: "Kruskal skip", def: "Next lightest edge dropped when both ends are already in one component (18, 24)." },
    { term: "Spanning forest", def: "Kruskal’s output on a disconnected graph: an MST of each component, not one tree." }
  ],

  tradeoffs: [
    { pro: "Both Prim and Kruskal avoid listing every spanning tree and agree at cost 99 here.", con: "They are not interchangeable on disconnected input: Prim spans one component, Kruskal forests all." },
    { pro: "Prim’s tree is connected at every prefix — easy to draw live.", con: "A far cheap edge (3–4=12) is ignored until the cut reaches it." },
    { pro: "Kruskal’s sort is simple to hand-simulate.", con: "You must test cycles (18, 24) or you output a unicyclic graph, not a tree." },
    { pro: "Heap cuts Kruskal from Θ(VE) toward n log n in the lecture.", con: "Writing only n log n without saying \"heap of edges\" skips the data structure they want." }
  ],

  interviewTips: [
    "Define spanning tree (V, V−1, no cycle) before you say \"minimum cost.\"",
    "Run Prim as 10,25,22,12,16,14 and Kruskal as 10,12,14,16,skip 18,22,skip 24,25.",
    "Box cost 99 and |E|=6 for 7 vertices.",
    "Say cut property for Prim and cycle property for Kruskal in one sentence each.",
    "Disconnected: no spanning tree; Kruskal still returns a forest.",
    "If two weight-4 edges are interchangeable, cost stays 12 and you may draw either tree."
  ],

  scene: {
    nodes: [
      { id: "v1", label: "1", type: "server", pos: [-9, 0, -2] },
      { id: "v6", label: "6", type: "server", pos: [-9, 0, 4] },
      { id: "v2", label: "2", type: "server", pos: [-1, 0, -5] },
      { id: "v7", label: "7", type: "server", pos: [8, 0, -5] },
      { id: "v3", label: "3", type: "server", pos: [2, 0, 0] },
      { id: "v4", label: "4", type: "server", pos: [8, 0, 2] },
      { id: "v5", label: "5", type: "server", pos: [-1, 0, 4] },
      { id: "n0", label: "7 verts, need 6 edges", type: "note", pos: [-8, 3, 7.5] },
      { id: "n1", label: "Prim seed 1-6 = 10", type: "note", pos: [8, 3, 7.5], showAt: 1 },
      { id: "n2", label: "Prim: only cut edges", type: "note", pos: [-8, 3, -7.5], showAt: 2 },
      { id: "n3", label: "Kruskal skips 18, 24", type: "note", pos: [8, 3, -7.5], showAt: 5 },
      { id: "n4", label: "MST cost 99", type: "note", pos: [0, 3, 7.5], showAt: 4 }
    ],
    edges: [
      { from: "v1", to: "v6", label: "10" },
      { from: "v6", to: "v5", label: "25" },
      { from: "v5", to: "v4", label: "22" },
      { from: "v4", to: "v3", label: "12" },
      { from: "v3", to: "v2", label: "16" },
      { from: "v2", to: "v7", label: "14" },
      { from: "v4", to: "v7", label: "18", dashed: true },
      { from: "v5", to: "v7", label: "24", dashed: true },
      { from: "v1", to: "v2", label: "28", dashed: true }
    ],
    steps: [
      {
        title: "Need a spanning tree",
        text: "Seven vertices. A tree uses six edges and no cycle. Weighted edges include 10,12,14,16,18,22,24,25,28. Brute force would list trees; greedy will pick six of them.",
        highlight: ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "n0"]
      },
      {
        title: "Prim seed: globally lightest 1–6",
        text: "Prim starts with the cheapest edge in the graph, 1–6=10. The tree S is {1,6}. Next candidates must have one foot in S.",
        highlight: ["v1", "v6", "n1"],
        hide: ["n0"],
        flows: [{ from: "v1", to: "v6", color: "#4ade80", label: "10" }]
      },
      {
        title: "Cut: take 6–5=25, not 3–4=12",
        text: "3–4=12 is lighter than 25 but neither end is in S, so Prim refuses it. Across the cut, 25 beats 28. S becomes {1,6,5}.",
        highlight: ["v6", "v5", "v3", "v4", "n2"],
        hide: ["n0"],
        flows: [{ from: "v6", to: "v5", color: "#4ade80", label: "25" }]
      },
      {
        title: "Then 22, 12, 16 — still a tree",
        text: "From {1,6,5} the lightest cut edge is 5–4=22. Then 4–3=12. Then 2–3=16. Each add keeps the drawing connected and acyclic. 3–4 finally joins once 4 is inside.",
        highlight: ["v5", "v4", "v3", "v2", "n2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "v5", to: "v4", color: "#22d3ee", label: "22" },
          { from: "v4", to: "v3", color: "#22d3ee", label: "12" },
          { from: "v3", to: "v2", color: "#22d3ee", label: "16" }
        ]
      },
      {
        title: "Last Prim edge 2–7=14, cost 99",
        text: "Vertex 7 attaches via 14. Six edges: 10+25+22+12+16+14=99. 1–2=28 was always a cut candidate and never won.",
        highlight: ["v2", "v7", "n4", "v1", "v6"],
        hide: ["n0"],
        flows: [{ from: "v2", to: "v7", color: "#4ade80", label: "14" }]
      },
      {
        title: "Kruskal: global order, reject cycles",
        text: "Same graph, different greedy test. Take 10,12,14,16 immediately (forests allowed). 4–7=18 would close 2-3-4-7 — skip. Then 22, skip 24, take 25. Same 99.",
        highlight: ["v1", "v6", "v3", "v4", "v2", "v7", "n3"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "v1", to: "v6", color: "#fb923c", label: "10" },
          { from: "v4", to: "v3", color: "#fb923c", label: "12" }
        ]
      },
      {
        title: "Skip 18 and 24 on purpose",
        text: "Dashed 18 and 24 are lighter than 25 but fail the cycle test. That is Kruskal’s greedy choice: cheapest edge that does not ruin the forest. Cut/cycle properties say both algorithms are safe.",
        highlight: ["v4", "v7", "v5", "n3", "n4"],
        hide: ["n0", "n1"]
      },
      {
        title: "Disconnected and unique cost",
        text: "No spanning tree if the graph is in two pieces; Prim spans one component, Kruskal forests both. A later quiz can have two MSTs of cost 12 — unique number, not unique edge set. Heap Kruskal: n log n as taught.",
        highlight: ["n4", "n3", "v1", "v2", "v3", "v4", "v5", "v6", "v7"],
        hide: ["n0", "n1", "n2"]
      }
    ]
  }
});
