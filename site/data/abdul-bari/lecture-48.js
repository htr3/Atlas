window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 48,
  title: "4.2 All Pairs Shortest Path (Floyd-Warshall) - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=oNI0rf2P9gE",
  category: "Dynamic Programming",
  tagline: "n matrices, one intermediate k at a time: A[i][j]=min(A[i][j], A[i][k]+A[k][j]) in Θ(n³).",
  summary: "All-pairs shortest paths asks for a distance between every ordered pair. n Dijkstra runs are also Θ(n³) on dense graphs and dislike negatives. Floyd–Warshall takes a sequence of decisions: allow vertex 1 as a midpoint, then 2, … then n. Each k produces a matrix from the previous one. In place, three nested loops (k, i, j) update A[i][j] with A[i][k]+A[k][j]. The 4-vertex lecture graph finishes with distances 0,3,5,6 / 5,0,2,3 / 3,6,0,1 / 2,5,7,0.",

  theory: [
    {
      heading: "State: pair plus allowed midpoints",
      body: "From every vertex to every other vertex, find a shortest path. Dijkstra from each of n sources is legal on non-negative weights and costs n·Θ(n²)=Θ(n³) with the simple implementation Bari quotes. DP's state for Floyd is \"shortest i↝j using only {1..k} as intermediate vertices.\" When k=0 that is the adjacency matrix: missing edges are ∞, diagonals 0 (no self-loops).",
      bullets: [
        "All pairs, not one source.",
        "k is the highest-numbered vertex you may sit in the middle.",
        "A0 is the edge matrix: 0 on the diagonal, ∞ if no arc."
      ]
    },
    {
      heading: "Recurrence",
      body: "To build A_k from A_{k-1}: for every i,j, either you still ignore k, or you go i↝k↝j using already-optimal halves that only used {1..k-1}. <code>A_k(i,j) = min( A_{k-1}(i,j), A_{k-1}(i,k)+A_{k-1}(k,j) )</code>. Row k and column k copy unchanged (paths that already start or end at k). Diagonals stay 0. One in-place matrix is enough if k is the outer loop.",
      bullets: [
        "Decision at stage k: use k as a midpoint, or don't.",
        "The two halves i↝k and k↝j do not contain k again in this formulation.",
        "Code: for k, for i, for j, A[i][j]=min(A[i][j], A[i][k]+A[k][j])."
      ]
    },
    {
      heading: "Worked A0 and A1 (via 1)",
      body: "Lecture graph, 4 vertices. A0: 1→2 is 3, 1→4 is 7, 2→1 is 8, 2→3 is 2, 3→1 is 5, 3→4 is 1, 4→1 is 2; the rest ∞ aside from zeros. Via 1, freeze row 1 and column 1. 2→4 had ∞; 2→1→4 is 8+7=15, so 15. 3→2 had ∞; 3→1→2 is 5+3=8. 2→3 stays 2 because 8+∞ is worse.",
      bullets: [
        "A0[2][4]=∞ becomes 15 on A1.",
        "A0[3][2]=∞ becomes 8 on A1.",
        "A first-row/first-column shortcut: copy, do not recompute."
      ]
    },
    {
      heading: "A2 via 2, then k=3 and k=4",
      body: "Via 2, freeze row 2 and column 2. 1→3 was ∞; 1→2→3 is 3+2=<b>5</b>. 1→4 stays 7 (3+15=18 is worse). Continue with k=3 then k=4. After k=4 the matrix is the all-pairs answer: row 1 is 0,3,5,6; row 2 is 5,0,2,3; row 3 is 3,6,0,1; row 4 is 2,5,7,0. 1→4 improved from 7 to 6 once vertex 3 (and later 4) could sit in the middle.",
      bullets: [
        "1→3 becomes 5 on A2 (path 1-2-3).",
        "Final 1→4 is 6, 2→1 is 5, 3→1 is 3.",
        "n vertices ⇒ n matrices (or n updates of one matrix)."
      ]
    },
    {
      heading: "Table order and Θ(n³)",
      body: "Outer k is the stage. Inner i,j fill one n×n matrix. Three nested loops, Θ(n³) always — dense or sparse. That matches n×Dijkstra with an n² implementation, and it allows negative edges as long as there is no negative cycle. Space is one n×n array if you overwrite. Parent reconstruction needs a separate next[i][j] (not coded in the lecture's three-loop sketch).",
      bullets: [
        "Fill order: k from 1 to n, then every cell of that matrix.",
        "Time Θ(n³) even on sparse graphs — Floyd is the dense algorithm.",
        "Negative cycle: a diagonal would go negative; the lecture's code does not test it."
      ]
    }
  ],

  keyTerms: [
    { term: "All-pairs shortest path", def: "A distance (and optionally a path) for every ordered pair of vertices." },
    { term: "Intermediate k", def: "Stage k of Floyd: vertices 1..k are the only allowed interior vertices." },
    { term: "A_k(i,j)", def: "Shortest i↝j whose interior vertices are a subset of {1..k}." },
    { term: "In-place update", def: "One matrix; k is outermost so A[i][k] and A[k][j] still hold A_{k-1} values." },
    { term: "∞ entry", def: "No edge (and no path found yet) between that pair." },
    { term: "Θ(n³)", def: "k, i, and j each run 1..n; independent of the number of edges." }
  ],

  tradeoffs: [
    { pro: "One Θ(n³) nested loop, negatives allowed, code is a dozen lines.", con: "Sparse graphs still pay n³; n Dijkstra + heap can be faster there." },
    { pro: "n× simple Dijkstra is also n³ and is greedy per source.", con: "Dijkstra is unsafe with negative edges; Floyd is the DP that survives them." },
    { pro: "In-place matrix saves n extra copies.", con: "A wrong loop order (k not outer) can use a half-updated midpoint." },
    { pro: "Every pair is answered, including pairs you did not think to query.", con: "No path is stored unless you keep a next[][] of midpoints." }
  ],

  interviewTips: [
    "State the problem as every pair, then offer n Dijkstra vs Floyd.",
    "Write A_k(i,j)=min(A_{k-1}(i,j), A_{k-1}(i,k)+A_{k-1}(k,j)).",
    "Say k is the outer loop so one matrix is enough.",
    "Walk one cell from the lecture: 2→4 goes ∞ → 15 via 1.",
    "Quote Θ(n³) and \"n matrices, one intermediate at a time.\"",
    "Mention negative edges are fine; a negative cycle is a different failure (diagonal < 0)."
  ],

  scene: {
    nodes: [
      { id: "g1", label: "1", type: "point", pos: [-10, 0, 3], color: "#fb923c" },
      { id: "g2", label: "2", type: "point", pos: [-6, 0, 3], color: "#60a5fa" },
      { id: "g3", label: "3", type: "point", pos: [-6, 0, -1], color: "#c084fc" },
      { id: "g4", label: "4", type: "point", pos: [-10, 0, -1], color: "#22d3ee" },
      { id: "a12", label: "3", type: "cache", pos: [-2, 0, 5], color: "#60a5fa" },
      { id: "a13", label: "∞", type: "cache", pos: [1, 0, 5], color: "#64748b" },
      { id: "a14", label: "7", type: "cache", pos: [4, 0, 5], color: "#22d3ee" },
      { id: "a21", label: "8", type: "cache", pos: [-2, 0, 2.2], color: "#60a5fa" },
      { id: "a23", label: "2", type: "cache", pos: [1, 0, 2.2], color: "#60a5fa" },
      { id: "a24", label: "∞", type: "cache", pos: [4, 0, 2.2], color: "#64748b" },
      { id: "a31", label: "5", type: "cache", pos: [-2, 0, -0.6], color: "#c084fc" },
      { id: "a32", label: "∞", type: "cache", pos: [1, 0, -0.6], color: "#64748b" },
      { id: "a34", label: "1", type: "cache", pos: [4, 0, -0.6], color: "#c084fc" },
      { id: "a41", label: "2", type: "cache", pos: [-2, 0, -3.4], color: "#22d3ee" },
      { id: "a42", label: "∞", type: "cache", pos: [1, 0, -3.4], color: "#64748b" },
      { id: "a43", label: "∞", type: "cache", pos: [4, 0, -3.4], color: "#64748b" },
      { id: "n0", label: "A0 adjacency", type: "note", pos: [8.5, 0, 5] },
      { id: "n1", label: "via 1: 2→4 = 15", type: "note", pos: [8.5, 0, 2.2], showAt: 2 },
      { id: "n2", label: "via 2: 1→3 = 5", type: "note", pos: [8.5, 0, -0.6], showAt: 4 },
      { id: "n3", label: "k outer, in-place", type: "note", pos: [8.5, 0, -3.4], showAt: 5 },
      { id: "n4", label: "final 1→4 = 6", type: "note", pos: [8.5, 0, -6.5], showAt: 6 },
      { id: "n5", label: "Θ(n³) three loops", type: "note", pos: [-8, 0, -6.5], showAt: 7 }
    ],
    edges: [
      { from: "g1", to: "g2", label: "3" },
      { from: "g1", to: "g4", label: "7" },
      { from: "g2", to: "g1", label: "8" },
      { from: "g2", to: "g3", label: "2" },
      { from: "g3", to: "g1", label: "5" },
      { from: "g3", to: "g4", label: "1" },
      { from: "g4", to: "g1", label: "2" },
      { from: "a21", to: "a14", showAt: 2, dashed: true },
      { from: "a12", to: "a23", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Four vertices, A0",
        text: "Need a shortest path for every pair. A0 is the edge matrix: 1→2 is 3, 2→3 is 2, 3→4 is 1, 4→1 is 2. Missing arcs are ∞. Diagonals stay 0.",
        highlight: ["g1", "g2", "g3", "g4", "a12", "a23", "a34", "a41", "n0"]
      },
      {
        title: "Decision: allow midpoint 1",
        text: "Stage k=1. Freeze row 1 and column 1. For every other pair, compare the old entry with i→1→j.",
        highlight: ["g1", "a12", "a14", "a21", "a31", "a41"]
      },
      {
        title: "2→4 becomes 15",
        text: "A0[2][4]=∞. Path 2→1→4 costs 8+7=15, better than ∞, so write 15. 2→3 stays 2 because 8+∞ is worse. First matrix update from a real intermediate.",
        highlight: ["g2", "g1", "g4", "a24", "a21", "a14", "n1"],
        flows: [
          { from: "g2", to: "g1", color: "#fb923c", label: "8" },
          { from: "g1", to: "g4", color: "#fb923c", label: "7" }
        ]
      },
      {
        title: "3→2 becomes 8",
        text: "No direct 3→2. 3→1→2 is 5+3=8. A1 now knows two new pairs that only exist via vertex 1. Row 1 / column 1 never changed.",
        highlight: ["g3", "g1", "g2", "a32", "a31", "a12"],
        flows: [
          { from: "g3", to: "g1", color: "#c084fc", label: "5" },
          { from: "g1", to: "g2", color: "#c084fc", label: "3" }
        ]
      },
      {
        title: "Via 2: 1→3 = 5",
        text: "k=2 freezes row 2 and column 2. 1→3 was still ∞; 1→2→3 is 3+2=5. 1→4 stays 7 because 3+15=18 is worse. Paths are growing through newly allowed midpoints.",
        highlight: ["g1", "g2", "g3", "a13", "a12", "a23", "n2"],
        flows: [
          { from: "g1", to: "g2", color: "#4ade80", label: "3" },
          { from: "g2", to: "g3", color: "#4ade80", label: "2" }
        ]
      },
      {
        title: "k outer, overwrite A",
        text: "The lecture's code is three loops with k outside. One 2-D array. When you read A[i][k] and A[k][j] they still hold the previous matrix because k is not being overwritten as a midpoint of itself in a harmful order.",
        highlight: ["a12", "a23", "a24", "a13", "n3"]
      },
      {
        title: "After k=3 and k=4",
        text: "Allowing 3 improves 1→4: min(7, 5+1)=6. After k=4 the finished table is 0,3,5,6 / 5,0,2,3 / 3,6,0,1 / 2,5,7,0. That is every pair.",
        highlight: ["a14", "a13", "a24", "a32", "g1", "g3", "g4", "n4"],
        flows: [
          { from: "g1", to: "g3", color: "#4ade80", label: "5" },
          { from: "g3", to: "g4", color: "#4ade80", label: "1" }
        ]
      },
      {
        title: "Θ(n³) always",
        text: "n values of k, n² cells each. Dense-graph all-pairs in one nested loop. Same cubic class as n simple Dijkstras, but the DP does not need non-negative weights.",
        highlight: ["n5", "a12", "a23", "a34", "a41"]
      }
    ]
  }
});
