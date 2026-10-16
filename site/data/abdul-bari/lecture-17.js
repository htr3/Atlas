window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 17,
  title: "1.12 Disjoint Sets Data Structure - Weighted Union and Collapsing Find",
  video: "https://www.youtube.com/watch?v=wU6udHRIkcc",
  category: "Algorithm Foundations",
  tagline: "Union the smaller tree under the larger; collapsing find points every hop at the root.",
  summary: "Disjoint sets are the connected components of an undirected graph. Find returns a representative; Union merges two sets when an edge joins different components. Same-set endpoints mean a cycle — Kruskal's test. Store parents in one array: negatives are roots and store size. Weighted union hangs the lighter root under the heavier. Collapsing find (path compression) rewires nodes straight to the root so later finds are constant hops.",

  theory: [
    {
      heading: "Sets as components, Find and Union",
      body: "Two components of an undirected graph are two sets S1 = {1,2,3,4} and S2 = {5,6,7,8}. They are disjoint: intersection empty, no shared vertex. <b>Find(x)</b> names the set x belongs to (membership). <b>Union</b> is not a math homework union: if you add an edge uv and Find(u) ≠ Find(v), merge those two sets — the edge just connected two components. If Find(u) = Find(v), both ends already live in one component, so uv would close a <b>cycle</b>. That is the test Kruskal uses when it considers the next cheapest edge.",
      bullets: [
        "Find = which component.",
        "Different components + an edge → Union.",
        "Same component + an edge → cycle, reject the edge."
      ]
    },
    {
      heading: "Build the spanning forest edge by edge",
      body: "Start with eight singleton sets (the universal set split into {1}…{8}). Take edges in the lecture's order: 1-2, 3-4, 5-6, 7-8 (four tiny sets), then 2-4 (merge {1,2} with {3,4}), then 2-5 (merge that four-set with {5,6}). Edge 1-3 has both ends already in the six-vertex set — cycle, skip. Edge 6-8 merges in {7,8}. Edge 5-7 is another cycle. The surviving edges are a spanning tree; the rejected ones were the cycle detectors.",
      bullets: [
        "Order in the video: 12, 34, 56, 78, 24, 25, 13(cycle), 68, 57(cycle).",
        "Kruskal is this loop with edges sorted by weight."
      ]
    },
    {
      heading: "Forest plus parent array",
      body: "You do not need set names or real ∪ ∩. Each set is a tree with one representative (root). An array <code>parent[1..8]</code> starts at −1: every vertex is its own root. A negative cell means 'this index is a root'; the magnitude is the <b>weight</b> (node count). A positive cell is a parent pointer. Find walks parent until it sees a negative. Union writes one root into the other root's cell and adds the weights.",
      bullets: [
        "parent[i] < 0 ⇒ i is a root, |parent[i]| = size.",
        "parent[i] > 0 ⇒ parent of i.",
        "Find follows +cells until a −cell."
      ]
    },
    {
      heading: "Weighted union (union by size)",
      body: "Always hang the <i>lighter</i> root under the <i>heavier</i> one (ranks/weights are the same idea here: the stored size). 1-2: parent[2]=1, parent[1]=−2. Same for 3-4, 5-6, 7-8. 2-4: Find(2)=1 and Find(4)=3, both weight 2, so pick 1 as parent, parent[3]=1, parent[1]=−4. 2-5: Find(2)=1 has weight 4, Find(5)=5 has weight 2, so parent[5]=1 and parent[1]=−6. 6-8: weight 6 beats 2, parent[7]=1, parent[1]=−8. Equal weights may go either way; unequal weights have a forced parent. Linking small under large keeps trees shallow so Find stays close to constant in the lecture's accounting (one or two hops in the example).",
      bullets: [
        "Compare |parent[root]| and attach the smaller.",
        "New weight = sum of the two weights.",
        "Naive union (always attach left to right) can build a chain of length n."
      ]
    },
    {
      heading: "Collapsing find (path compression)",
      body: "Find(6) walks 6 → 5 → 1. After you know the root is 1, write parent[6]=1 so 6 hangs directly on the representative. Find(8) walks 8 → 7 → 1, then parent[8]=1. The first Find pays the extra hops; every later Find of that node is one array read plus a negative check — constant time. That rewrite is <b>collapsing find</b> / path compression. Weighted union plus collapsing find is the pair the lecture wants you to name. (Linked-list nodes with a parent pointer are an exercise; the array is the working structure.)",
      bullets: [
        "First Find may walk a short path.",
        "Then point every visited node at the root.",
        "Next Find of those nodes is O(1) hops."
      ]
    }
  ],

  keyTerms: [
    { term: "Disjoint sets", def: "Family of sets with empty pairwise intersection; here, graph components." },
    { term: "Find", def: "Walk parent[] until a negative cell; that index is the representative." },
    { term: "Union", def: "If two Finds differ, hang one root under the other and add weights." },
    { term: "Cycle test", def: "Find(u)==Find(v) on an undirected edge uv ⇒ the edge would close a cycle." },
    { term: "Weighted union", def: "Attach the tree of smaller size under the larger root; store size as a negative." },
    { term: "Collapsing find", def: "Path compression: after Find, set parent[x] to the root so later Finds skip the old path." },
    { term: "parent[]", def: "One array, index = vertex. Negative = root and size; positive = parent index." }
  ],

  tradeoffs: [
    { pro: "One array and two primitives (Find, Union) detect every cycle Kruskal cares about.", con: "The structure does not store the actual edges — only component ids." },
    { pro: "Weighted union keeps height small; the lecture's Finds are one or two hops.", con: "Ignoring weights can chain n singletons into an O(n) Find." },
    { pro: "Collapsing find makes the next Find of the same node constant.", con: "The first Find still pays the old path; you mutate parent[] as a side effect." }
  ],

  interviewTips: [
    "Define disjoint as empty intersection of component vertex-sets, then name Find and Union.",
    "Cycle rule: add uv only if Find(u) ≠ Find(v). Same parent ⇒ reject (Kruskal).",
    "Show parent[]: −1 init, then −size at roots. Walk positives until a negative.",
    "Weighted union: compare |parent[r1]| and |parent[r2]|, hang the smaller, add sizes.",
    "Collapsing find: after 6→5→1, write parent[6]=1. Name 'path compression'.",
    "Together the two heuristics make Find/Union effectively constant for MST."
  ],

  scene: {
    nodes: [
      { id: "v1", label: "1", type: "server", pos: [-2, 0, -6.4], color: "#4ade80" },
      { id: "v2", label: "2", type: "point", pos: [-5, 0, -3.4], color: "#4ade80" },
      { id: "v3", label: "3", type: "point", pos: [1, 0, -3.4], color: "#4ade80" },
      { id: "v4", label: "4", type: "point", pos: [1, 0, -0.4], color: "#4ade80" },
      { id: "v5", label: "5", type: "point", pos: [4.5, 0, -3.4], color: "#60a5fa" },
      { id: "v6", label: "6", type: "point", pos: [4.5, 0, -0.4], color: "#60a5fa" },
      { id: "v7", label: "7", type: "point", pos: [8, 0, -3.4], color: "#c084fc" },
      { id: "v8", label: "8", type: "point", pos: [8, 0, -0.4], color: "#c084fc" },
      { id: "p1", label: "1:−8", type: "note", pos: [-10.2, 0, 4.6] },
      { id: "p2", label: "2:1", type: "note", pos: [-7.6, 0, 4.6] },
      { id: "p3", label: "3:1", type: "note", pos: [-5.0, 0, 4.6] },
      { id: "p4", label: "4:3", type: "note", pos: [-2.4, 0, 4.6] },
      { id: "p5", label: "5:1", type: "note", pos: [0.2, 0, 4.6] },
      { id: "p6", label: "6:5", type: "note", pos: [2.8, 0, 4.6] },
      { id: "p7", label: "7:1", type: "note", pos: [5.4, 0, 4.6] },
      { id: "p8", label: "8:7", type: "note", pos: [8.0, 0, 4.6] },
      { id: "arr", label: "parent[]  (− = root/size)", type: "zone", pos: [-1.2, 0, 4.6], size: [21.5, 2.8] },
      { id: "wNote", label: "weighted: small→large", type: "note", pos: [-9.4, 0, -6.4], showAt: 2 },
      { id: "cyc13", label: "1-3 cycle", type: "gateway", pos: [-8, 0, -0.4], showAt: 3 },
      { id: "cyc57", label: "5-7 cycle", type: "gateway", pos: [-8, 0, 2.0], showAt: 4 },
      { id: "comp6", label: "collapse 6→1", type: "lb", pos: [4.5, 0, 2.0], showAt: 5 },
      { id: "comp8", label: "collapse 8→1", type: "lb", pos: [8, 0, 2.0], showAt: 5 }
    ],
    edges: [
      { from: "v1", to: "v2", showAt: 1 },
      { from: "v3", to: "v4", showAt: 1 },
      { from: "v5", to: "v6", showAt: 1 },
      { from: "v7", to: "v8", showAt: 1 },
      { from: "v1", to: "v3", showAt: 2 },
      { from: "v1", to: "v5", showAt: 2 },
      { from: "v1", to: "v7", showAt: 4 },
      { from: "v1", to: "cyc13", showAt: 3, dashed: true },
      { from: "v3", to: "cyc13", showAt: 3, dashed: true },
      { from: "v5", to: "cyc57", showAt: 4, dashed: true },
      { from: "v7", to: "cyc57", showAt: 4, dashed: true },
      { from: "v6", to: "comp6", showAt: 5, dashed: true },
      { from: "v8", to: "comp8", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Eight roots, parent[i] = −1",
        text: "Every vertex is its own set. The array is eight minus-ones: each index is a root of weight 1. Find is one array read.",
        highlight: ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "arr", "p1"]
      },
      {
        title: "Four unions: 12, 34, 56, 78",
        text: "Each pair: both Finds return themselves, so Union. Hang 2 under 1 and set parent[1]=−2 (minus = root, 2 = size). Same for 3-4, 5-6, 7-8. Four trees of weight 2.",
        highlight: ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "p1", "p2"],
        flows: [
          { from: "v2", to: "v1", color: "#4ade80", label: "12" },
          { from: "v4", to: "v3", color: "#4ade80", label: "34" },
          { from: "v6", to: "v5", color: "#60a5fa", label: "56" },
          { from: "v8", to: "v7", color: "#c084fc", label: "78" }
        ]
      },
      {
        title: "Weighted union 2-4 and 2-5",
        text: "Find(2)=1, Find(4)=3, equal weights: attach 3 under 1, parent[1]=−4. Find(5)=5 has weight 2 vs 4: attach 5 under 1, parent[1]=−6. Small tree always hangs under the large root.",
        highlight: ["v1", "v3", "v5", "wNote", "p1", "p5"],
        flows: [
          { from: "v3", to: "v1", color: "#fb923c", label: "w=2+2" },
          { from: "v5", to: "v1", color: "#fb923c", label: "2 under 4" }
        ]
      },
      {
        title: "1-3 is a cycle",
        text: "Find(1)=1 and Find(3)=1 (3→1). Same representative: edge 1-3 would close a cycle. Kruskal skips it. The forest does not gain an edge.",
        highlight: ["v1", "v3", "cyc13", "p3"],
        fail: ["cyc13"],
        flows: [
          { from: "v3", to: "v1", color: "#f87171", label: "same root" }
        ]
      },
      {
        title: "6-8 unions; 5-7 cycles",
        text: "Find(6)=1 via 6→5→1, Find(8)=7. Weights 6 vs 2: attach 7 under 1, parent[1]=−8. Then Find(5)=1 and Find(7)=1, so 5-7 is a second cycle.",
        highlight: ["v1", "v6", "v7", "v8", "v5", "cyc57", "p7"],
        fail: ["cyc57"],
        flows: [
          { from: "v7", to: "v1", color: "#c084fc", label: "w=6+2" },
          { from: "v5", to: "cyc57", color: "#f87171", label: "cycle" }
        ]
      },
      {
        title: "Collapsing find: 6→1 and 8→1",
        text: "Find(6) paid 6→5→1. Rewrite parent[6]=1 so 6 hangs on the root. Find(8) paid 8→7→1; rewrite parent[8]=1. Next Finds are one hop. Weighted union plus collapsing find is the efficient pair.",
        highlight: ["v6", "v8", "v1", "comp6", "comp8", "p6", "p8"],
        flows: [
          { from: "v6", to: "v1", color: "#4ade80", label: "compress" },
          { from: "v8", to: "v1", color: "#4ade80", label: "compress" }
        ]
      }
    ]
  }
});
