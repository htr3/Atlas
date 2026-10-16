window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 66,
  title: "6.3 Graph Coloring Problem - Backtracking",
  video: "https://www.youtube.com/watch?v=052VkKhIaQ4",
  category: "Graphs & Backtracking",
  tagline: "m colors, adjacent vertices differ. C4 state-space ~ m^n; map printing is the story.",
  summary: "Color the vertices of a graph so no two adjacent vertices share a color. Three problem flavors: list every coloring with m given colors, decide whether m colors suffice (m-coloring decision), or find the minimum m (chromatic number / optimization). The lecture colors a 5-vertex graph with red/green/blue, then DFS-colors C4, killing any child that copies a neighbor's color. Unbounded the tree has size about m^{n+1}; with the adjacency bound you still quote O(m^n). The original application is map printing: fewer colors meant fewer passes through the press.",

  theory: [
    {
      heading: "The rule, and a 5-vertex hand coloring",
      body: "A graph and a palette — the lecture uses red, green, blue. Assign each vertex a color so that <b>no two adjacent vertices match</b>. On the five-vertex demo: vertex 1 red, 2 cannot be red (neighbor of 1) so green, 3 may be red (not adjacent to 1), 4 may be green, 5 is adjacent to both a red and a green so it needs blue. One coloring: <code>R, G, R, G, B</code>. Swap the first two colors and you get another. Many colorings exist; backtracking is the method that lists them.",
      bullets: [
        "Constraint: if (u,v) is an edge, color(u) ≠ color(v).",
        "The same graph can be colored in several ways with a fixed palette.",
        "Two colors are not enough for that 5-vertex picture; four would be more than enough."
      ]
    },
    {
      heading: "Three problem statements",
      body: "Do not mix the exam names. (1) Graph + m colors, <b>list every proper coloring</b> — the backtracking problem. (2) Graph + m colors, answer only yes or no: <b>m-coloring decision</b>. (3) Graph alone, find the smallest m that works: <b>m-coloring optimization</b>, also called the <b>chromatic number</b> problem. Decision is 'are these tubes of ink enough?'. Optimization is 'how many tubes must I buy?'. Enumeration is 'show me every legal paint job with the tubes I have'.",
      bullets: [
        "Enumeration: all assignments with a given m.",
        "Decision: existence with a given m.",
        "Optimization / chromatic number: minimum m."
      ]
    },
    {
      heading: "Unbounded state-space tree is Θ(m^n)",
      body: "Four vertices, three colors, no adjacency test: vertex 1 has 3 choices, vertex 2 has 3, …, vertex 4 has 3. Node counts by level: 1 + 3 + 3² + 3³ + 3⁴. That is a geometric series <code>(3^{5} − 1)/2</code>, on the order of <b>3^{n+1}</b> for n vertices, or <code>m^{n+1}</code> in general. Each node is a unit of work, so generating the raw tree is exponential in n. Backtracking imagines that tree and then refuses most of the children.",
      bullets: [
        "Branching factor m at every live node.",
        "Height n (one level per vertex).",
        "Quote O(m^n) even after pruning — the bound does not change the class."
      ]
    },
    {
      heading: "C4 walk: kill any color a neighbor already holds",
      body: "Worked graph is the 4-cycle 1−2−3−4−1. x[i] is the color of vertex i. Start x1 = red. x2 = red dies (adjacent to 1); x2 = green lives. x3 = red lives (3 is adjacent to 2, not to 1). x4 = red dies (adjacent to 1); x4 = green lives; x4 = blue also lives. Two leaves already: <code>R,G,R,G</code> and <code>R,G,R,B</code>. Back up, x3 = green dies (adjacent to 2). x3 = blue lives, then x4 = green lives and x4 = blue dies: leaf <code>R,G,B,G</code>. Next, x2 = blue opens another family (<code>R,B,R,G</code>, <code>R,B,R,B</code>, …). The bounding function is local: candidate color c for vertex k is legal iff no neighbor j < k already has color c. DFS tries every color, kills, backtracks, continues until the palette is exhausted at every vertex.",
      bullets: [
        "Promising test: color(k) differs from every already-colored neighbor.",
        "A killed child is not expanded to later vertices.",
        "Leaves that survive are proper m-colorings — there are several on C4 with m = 3."
      ]
    },
    {
      heading: "Maps, presses, and chromatic number as a story",
      body: "A political map is a graph: a region is a vertex, a shared border is an edge. Coloring the graph so adjacent regions differ is map coloring. In the letterpress era each extra color was another pass through the machine (ink, dry, pass again), so printers wanted the smallest palette that still separated neighbors — the optimization / chromatic-number form. Four colors always suffice for planar maps; the lecture's point is the reduction 'map → graph → m-coloring', not the four-color theorem. Any other adjacency constraint (exams in the same slot, radio frequencies) uses the same reduction.",
      bullets: [
        "Region → vertex, shared boundary → edge.",
        "Fewer colors used to mean fewer printing passes.",
        "Today the same model still names scheduling and register-allocation stories."
      ]
    }
  ],

  keyTerms: [
    { term: "Proper coloring", def: "An assignment of colors to vertices with adjacent vertices always different." },
    { term: "m-coloring decision", def: "Yes/no: can this graph be properly colored with the m given colors?" },
    { term: "Chromatic number", def: "Smallest m that properly colors the graph; the optimization version." },
    { term: "x[k]", def: "Color chosen for vertex k; level k of the state-space tree." },
    { term: "Color bound", def: "Reject color c for k if some neighbor already colored has c." },
    { term: "C4", def: "4-cycle used for the DFS trace; with 3 colors it has many proper colorings." },
    { term: "Map coloring", def: "Regions as vertices, borders as edges; historically a printing-cost problem." }
  ],

  tradeoffs: [
    { pro: "The adjacency test kills a color at vertex k before you color k+1..n.", con: "Worst case (complete graph with m large, or empty bound) is still Θ(m^n) nodes." },
    { pro: "One DFS lists every legal palette assignment, which is the enumeration spec.", con: "Decision and chromatic number do not need the full list; brute-force DFS is heavy for those." },
    { pro: "C4 with m = 3 is bipartite, so 2 colors already work — extra colors add more solutions, not more necessity.", con: "Students who quote 'needs 3 colors' from the 5-vertex demo will mis-state C4." },
    { pro: "The map reduction is a clean story for why the problem exists.", con: "Modern printers lay all inks in one pass; the algorithm did not become irrelevant, the cost model did." }
  ],

  interviewTips: [
    "Define proper coloring in one sentence, then name the three problems: enumerate, decide, chromatic number.",
    "On the 5-vertex demo, give RGRGB and say two colors fail, four succeed.",
    "Write the bound: color k ≠ color of any already colored neighbor. That is Place for this chapter.",
    "Trace C4 at least through RGRG and RGRB, and kill x2 = red under x1 = red.",
    "Complexity: about m^n, geometric series of m^k over n levels.",
    "Map story: region = vertex, border = edge, extra color used to mean an extra press pass."
  ],

  scene: {
    nodes: [
      { id: "gzone", label: "C4", type: "zone", pos: [-6, 0, 1], size: [10, 10] },
      { id: "v1", label: "1", type: "server", pos: [-9, 0, 5], color: "#f87171" },
      { id: "v2", label: "2", type: "server", pos: [-3, 0, 5], color: "#4ade80" },
      { id: "v3", label: "3", type: "server", pos: [-3, 0, -3], color: "#f87171" },
      { id: "v4", label: "4", type: "server", pos: [-9, 0, -3], color: "#4ade80" },
      { id: "red", label: "Red", type: "point", pos: [2, 0, 6], color: "#f87171" },
      { id: "grn", label: "Green", type: "point", pos: [2, 0, 3], color: "#4ade80" },
      { id: "blu", label: "Blue", type: "point", pos: [2, 0, 0], color: "#60a5fa" },
      { id: "killR", label: "x2=R kill", type: "server", pos: [6, 0, 6], showAt: 2, color: "#f87171" },
      { id: "okG", label: "x2=G live", type: "worker", pos: [6, 0, 3], showAt: 2, color: "#4ade80" },
      { id: "leafA", label: "R G R G", type: "cache", pos: [10, 0, 3], showAt: 3, color: "#4ade80" },
      { id: "leafB", label: "R G R B", type: "cache", pos: [10, 0, 0], showAt: 3, color: "#60a5fa" },
      { id: "killG", label: "x3=G kill", type: "server", pos: [6, 0, -2], showAt: 4, color: "#f87171" },
      { id: "leafC", label: "R G B G", type: "cache", pos: [10, 0, -3], showAt: 4, color: "#fb923c" },
      { id: "map", label: "map regions", type: "cdn", pos: [6, 0, -6], showAt: 6 },
      { id: "n0", label: "adjacent ≠ color", type: "note", pos: [-6, 0, 7] },
      { id: "n1", label: "m^n raw tree", type: "note", pos: [10, 0, 6], showAt: 1 },
      { id: "n2", label: "decision vs χ(G)", type: "note", pos: [10, 0, -6], showAt: 5 }
    ],
    edges: [
      { from: "v1", to: "v2" },
      { from: "v2", to: "v3" },
      { from: "v3", to: "v4" },
      { from: "v4", to: "v1" },
      { from: "red", to: "v1", label: "x1", showAt: 2 },
      { from: "grn", to: "v2", label: "x2", showAt: 2 },
      { from: "red", to: "killR", showAt: 2, dashed: true },
      { from: "okG", to: "leafA", showAt: 3 },
      { from: "okG", to: "leafB", showAt: 3 },
      { from: "v1", to: "map", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Adjacent vertices, different colors",
        text: "C4: 1−2−3−4−1. Palette red, green, blue. A proper coloring never paints the two ends of an edge the same. The 5-vertex demo in the lecture needed a blue; C4 is here to grow the tree.",
        highlight: ["v1", "v2", "v3", "v4", "red", "grn", "blu", "n0"]
      },
      {
        title: "Raw tree is m choices per vertex",
        text: "Without a bound, vertex 1×2×3×4 each has 3 colors: 1+3+9+27+81 nodes, on the order of 3^{n+1}. That geometric sum is why we quote exponential time.",
        highlight: ["red", "grn", "blu", "n1", "v1", "v2"]
      },
      {
        title: "x1 = red: x2 = red dies, green lives",
        text: "Bounding function: a candidate color for k is illegal if a neighbor already holds it. Red on vertex 2 copies vertex 1 — kill. Green differs — keep and deepen. Blue on 2 would also live; DFS takes green first.",
        highlight: ["v1", "v2", "red", "grn", "killR", "okG"],
        fail: ["killR"],
        flows: [
          { from: "red", to: "v1", color: "#f87171", label: "R" },
          { from: "red", to: "killR", color: "#f87171", label: "adj" },
          { from: "grn", to: "v2", color: "#4ade80", label: "G" }
        ]
      },
      {
        title: "Two leaves: RGRG and RGRB",
        text: "x3 can be red (not adjacent to 1). x4 cannot be red (adjacent to 1) but can be green or blue. Two solutions drop out of this branch: red-green-red-green and red-green-red-blue. DFS records both.",
        highlight: ["v1", "v2", "v3", "v4", "leafA", "leafB"],
        fail: ["killR"],
        flows: [
          { from: "okG", to: "leafA", color: "#4ade80", label: "leaf" },
          { from: "okG", to: "leafB", color: "#60a5fa", label: "leaf" }
        ]
      },
      {
        title: "x3 = green dies; x3 = blue opens RGBG",
        text: "Green on 3 copies 2 — kill. Blue on 3 lives. Then x4 = green lives (neighbors are red and blue) and x4 = blue dies (copies 3). Third solution: R, G, B, G. Keep rotating the palette until every vertex has tried every color.",
        highlight: ["killG", "leafC", "v3", "v4", "blu"],
        fail: ["killR", "killG"],
        flows: [
          { from: "grn", to: "killG", color: "#f87171", label: "adj 2" },
          { from: "blu", to: "v3", color: "#60a5fa", label: "B" }
        ]
      },
      {
        title: "Decision, optimization, chromatic number",
        text: "Same engine, three questions: list colorings; yes/no with this m; smallest m. The 5-vertex graph was not 2-colorable and was 3-colorable. C4 is 2-colorable; m = 3 only adds extra listings.",
        highlight: ["n2", "red", "grn", "blu", "v1"]
      },
      {
        title: "Map → graph → fewer press passes",
        text: "A region becomes a vertex, a shared border an edge. Extra colors used to mean extra passes through the printing press. Color the graph, paint the regions. Any adjacency puzzle uses the same reduction.",
        highlight: ["map", "v1", "v2", "v3", "v4"],
        flows: [
          { from: "v1", to: "map", color: "#fb923c", label: "region" }
        ]
      }
    ]
  }
});
