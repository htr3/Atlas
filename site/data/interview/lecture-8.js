window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 8,
  title: "Understanding Dynamic Programming",
  video: "https://www.youtube.com/watch?v=PttgNGRyYQg",
  category: "Interview Prep",
  tagline: "Recursive states plus overlapping work: memoize top-down or fill bottom-up.",
  summary: "A DP problem is a DAG of states. The lecture's machine reaches state 11 from 6, 7 and 8, and each of those from three smaller indices. Recursion alone repeats 2, 3, 4. Overlapping subproblems plus optimal substructure (strictly smaller, acyclic) let you store each state once — top-down with a map, or bottom-up layer by layer.",

  theory: [
    {
      heading: "States as nodes of a machine",
      body: "Think of a computation as a <b>state machine</b>. A state is a tuple of variables (here, a single index X). Each state is a node. Edges are legal moves to other states. You want the value of a target node — in the talk, state <b>11</b>. That node is not a primitive: three earlier values feed it, those nodes feed on others, and so on until you hit states you already know.",
      bullets: [
        "State = a snapshot of the variables that matter.",
        "The graph of states is the real problem statement.",
        "Target in the picture: node 11."
      ]
    },
    {
      heading: "A recurrence, not yet DP",
      body: "The lecture writes a parent at index X as a function of three earlier indices: <code>X-3</code>, <code>X-4</code>, and <code>X-5</code>. So 11 depends on 6, 7, 8. That is <b>recursion</b>: the same question asked of smaller (or at least other) instances of the same type. Recursion is not automatically divide-and-conquer. D&C insists the pieces are smaller and independent. Recursion may even diverge if you grow the arguments. All you know so far is that the problem talks to copies of itself.",
      bullets: [
        "11 ← f(6, 7, 8); 6 ← f(1, 2, 3); 7 ← f(2, 3, 4); 8 ← f(3, 4, 5).",
        "Same problem type, not necessarily smaller yet.",
        "Cycles would make the graph unsolvable; assume a DAG."
      ]
    },
    {
      heading: "Overlapping subproblems",
      body: "Evaluate naively and you recompute. To fill 11 you first fill 6, which asks for 1, 2, 3. Then 7 asks for 2, 3, 4 — but 2 and 3 already exist from 6. Then 8 asks for 3, 4, 5 — 3 and 4 are ready. The shared nodes are the <b>overlap</b>. Dynamic programming is worth doing only when that reuse saves real work. If every child were a fresh disjoint sub-tree, you would just be doing divide-and-conquer.",
      bullets: [
        "First property: overlapping subproblems.",
        "Benefit = a node already sitting in memory when a sibling asks for it.",
        "No overlap ⇒ memoization buys you nothing."
      ]
    },
    {
      heading: "Optimal substructure",
      body: "The second property: the subproblems that feed X are <b>smaller</b> than X, and once they are solved, X is solved. You do not need a better global trick that ignores those answers. That is optimal substructure — the same composition you rely on in D&C, plus the overlap. Together with a DAG (no cycles), the two properties are the lecture's definition of a DP problem: recursive, overlapping, and built from strictly simpler states.",
      bullets: [
        "X is assembled from answers to smaller X'.",
        "No cycles: otherwise 'bottom' does not exist.",
        "Recursion + overlap + optimal substructure ⇒ DP is legal."
      ]
    },
    {
      heading: "Top-down: start at 11, memoize as you return",
      body: "Ask for 11. It needs 6, 7, 8. Ask for 6: compute 1, 2, 3 and store them in a map. 6 is done. Ask for 7: 2 and 3 are hits, only 4 is new. Ask for 8: 3 and 4 are hits, only 5 is new. Then 11 combines 6, 7, 8. You walk from the target toward the bases and cache every state the first time you finish it. That is <b>top-down DP</b> / memoized recursion. Extra map lookups, but you only touch reachable states.",
      bullets: [
        "Call graph starts at the answer and fans toward bases.",
        "Map (or array) keyed by the state tuple.",
        "Each state computed at most once."
      ]
    },
    {
      heading: "Bottom-up: layers, no 'is it ready?' tests",
      body: "Flip the arrows. First compute the base layer 1, 2, 3, 4, 5 in any order — they do not depend on the later nodes. The next layer 6, 7, 8 is a function of that layer only, so you can fill 6 from 1,2,3, then 7 from 2,3,4, then 8 from 3,4,5 without asking whether a child exists. Finally 11 from 6, 7, 8. That is <b>bottom-up DP</b>. If you order the loops so that every dependency is already written, you do not even need a 'computed?' flag. Same values as top-down; different schedule.",
      bullets: [
        "Layer 1: indices 1–5. Layer 2: 6–8. Layer 3: 11.",
        "Dependencies always point backward, so a left-to-right fill is safe.",
        "You may compute a few unused states; you never recompute."
      ]
    },
    {
      heading: "What comes next",
      body: "This lecture is the vocabulary, not a coded puzzle. The follow-up in the series is Fibonacci — overlapping by definition (F(n) needs F(n-1) and F(n-2), which share F(n-3)), and then a fast path with matrix exponentiation for a huge index. Once you can point at overlap and at a DAG of smaller states on a whiteboard, you can classify a problem as DP before you pick top-down or bottom-up.",
      bullets: [
        "Name the state, the recurrence, the bases.",
        "Then choose memoized recursion or a table.",
        "Fibonacci is the smallest picture of the same two properties."
      ]
    }
  ],

  keyTerms: [
    { term: "State", def: "A node: the variables (here an index X) whose value you want to compute." },
    { term: "Recurrence", def: "How a state is written in terms of other states of the same problem — here X from X-3, X-4, X-5." },
    { term: "Overlapping subproblems", def: "Two parents share a child, so caching that child saves work (2 and 3 serve both 6 and 7)." },
    { term: "Optimal substructure", def: "The best answer at X is composed from best answers at strictly smaller states." },
    { term: "DAG", def: "Directed acyclic dependency graph. Cycles would make DP undefined." },
    { term: "Top-down / memoization", def: "Recurse from the target, store each state in a map on the way back." },
    { term: "Bottom-up", def: "Fill from bases toward the target in an order that respects the DAG." },
    { term: "Reuse", def: "The whole point: read a stored 2 instead of recomputing it for 7 after 6 already built it." }
  ],

  tradeoffs: [
    { pro: "Plain recursion matches the recurrence on the board.", con: "Exponential blow-up wherever subtrees overlap." },
    { pro: "Top-down memo: only reachable states, easy to write from the recurrence.", con: "Recursion depth plus a map; cache misses if you key the state wrong." },
    { pro: "Bottom-up: tight loops, no call stack, dependencies are obvious in the layer picture.", con: "You may fill unused cells; harder to see if the order is wrong." },
    { pro: "DP when both properties hold.", con: "No overlap (true D&C) or no optimal substructure (need search/greedy) — forcing a table wastes time." }
  ],

  interviewTips: [
    "Say the two names: overlapping subproblems and optimal substructure, then show them on a tiny DAG.",
    "Draw 11 ← 6,7,8 and mark that 7 reuses 2 and 3 from 6 — that picture is the lecture.",
    "Ask whether they want top-down memo or a bottom-up table before you start coding.",
    "State the bases first (the layer that needs no children) so the fill order is forced.",
    "If they say 'is this DP?', check for a DAG of smaller states and for shared children. Recursion alone is not enough.",
    "Do not jump to Fibonacci bitmasks or matrix expo until this vocabulary is down."
  ],

  scene: {
    nodes: [
      { id: "s1", label: "1", type: "point", pos: [-8, 0, 4.5], color: "#4ade80" },
      { id: "s2", label: "2", type: "point", pos: [-4, 0, 4.5], color: "#4ade80" },
      { id: "s3", label: "3", type: "point", pos: [0, 0, 4.5], color: "#4ade80" },
      { id: "s4", label: "4", type: "point", pos: [4, 0, 4.5], color: "#4ade80" },
      { id: "s5", label: "5", type: "point", pos: [8, 0, 4.5], color: "#4ade80" },
      { id: "s6", label: "6", type: "point", pos: [-6, 0, 0], color: "#60a5fa", showAt: 1 },
      { id: "s7", label: "7", type: "point", pos: [0, 0, 0], color: "#60a5fa", showAt: 1 },
      { id: "s8", label: "8", type: "point", pos: [6, 0, 0], color: "#60a5fa", showAt: 1 },
      { id: "s11", label: "11", type: "point", pos: [0, 0, -4.5], color: "#fb923c" },
      { id: "nst", label: "states = nodes", type: "note", pos: [-9, 0, 7.5] },
      { id: "nfn", label: "X ← X-3,X-4,X-5", type: "note", pos: [0, 0, 7.5], showAt: 1 },
      { id: "nov", label: "2,3 overlap", type: "note", pos: [9, 0, 7.5], showAt: 2 },
      { id: "nre", label: "reuse saved work", type: "note", pos: [9, 0, 0], showAt: 2 },
      { id: "nopt", label: "smaller, no cycles", type: "note", pos: [-9, 0, -7.5], showAt: 3 },
      { id: "ntd", label: "top-down + map", type: "note", pos: [0, 0, -7.5], showAt: 4 },
      { id: "nbu", label: "bottom-up layers", type: "note", pos: [9, 0, -7.5], showAt: 5 }
    ],
    edges: [
      { from: "s1", to: "s6", showAt: 1 },
      { from: "s2", to: "s6", showAt: 1 },
      { from: "s3", to: "s6", showAt: 1 },
      { from: "s2", to: "s7", showAt: 1 },
      { from: "s3", to: "s7", showAt: 1 },
      { from: "s4", to: "s7", showAt: 1 },
      { from: "s3", to: "s8", showAt: 1 },
      { from: "s4", to: "s8", showAt: 1 },
      { from: "s5", to: "s8", showAt: 1 },
      { from: "s6", to: "s11", showAt: 1 },
      { from: "s7", to: "s11", showAt: 1 },
      { from: "s8", to: "s11", showAt: 1 }
    ],
    steps: [
      {
        title: "Want the value at 11",
        text: "Each index is a state — a node. You want node 11. In a state machine you move from known nodes toward that target. Bases 1–5 are the layer you can start from.",
        highlight: ["s11", "s1", "s2", "s3", "s4", "s5", "nst"]
      },
      {
        title: "A parent from three children",
        text: "State X is a function of X-3, X-4, and X-5. So 11 reads 6, 7, 8; 6 reads 1, 2, 3; 7 reads 2, 3, 4; 8 reads 3, 4, 5. That recurrence is recursion. It is not yet divide-and-conquer — the pieces are the same problem type, and they are not independent.",
        highlight: ["s11", "s6", "s7", "s8", "nfn"],
        flows: [
          { from: "s6", to: "s11", color: "#fb923c", label: "f" },
          { from: "s7", to: "s11", color: "#fb923c", label: "f" },
          { from: "s8", to: "s11", color: "#fb923c", label: "f" }
        ]
      },
      {
        title: "2 and 3 are asked twice",
        text: "Filling 6 computes 1, 2, 3. Filling 7 wants 2, 3, 4 — two of those are already done. Filling 8 reuses 3 and 4. Shared children are overlapping subproblems. Without them, a table would not help.",
        highlight: ["s2", "s3", "s6", "s7", "s8", "nov", "nre"],
        flows: [
          { from: "s2", to: "s6", color: "#60a5fa", label: "used" },
          { from: "s2", to: "s7", color: "#c084fc", label: "reuse" },
          { from: "s3", to: "s7", color: "#c084fc", label: "reuse" }
        ]
      },
      {
        title: "Smaller states, no cycles",
        text: "Every edge points at a strictly smaller index, so the graph is a DAG. Optimal substructure: once the children of X are right, X is right. Recursion + overlap + a DAG is the lecture's test for DP.",
        highlight: ["s1", "s6", "s11", "nopt", "nfn"],
        flows: [
          { from: "s1", to: "s6", color: "#4ade80", label: "smaller" },
          { from: "s6", to: "s11", color: "#4ade80", label: "smaller" }
        ]
      },
      {
        title: "Top-down: memoize on the way back",
        text: "Start at 11, recurse into 6, then 1–3, store them. 7 only needs to invent 4. 8 only needs to invent 5. A map keyed by the index is the cache. You pay for recursion depth; you skip unreachable states.",
        highlight: ["s11", "s6", "s7", "s8", "s1", "s2", "s3", "ntd"],
        flows: [
          { from: "s11", to: "s6", color: "#fb923c", label: "need" },
          { from: "s6", to: "s1", color: "#60a5fa", label: "need" },
          { from: "s7", to: "s2", color: "#c084fc", label: "hit" }
        ]
      },
      {
        title: "Bottom-up: fill the layers",
        text: "Compute 1–5 first. 6, 7, 8 now read a finished layer — no 'already computed?' test. Then 11 reads 6, 7, 8. Same numbers as top-down, scheduled from the bases. Next lecture in the series applies this to Fibonacci (and later to matrix power).",
        highlight: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s11", "nbu"],
        flows: [
          { from: "s1", to: "s6", color: "#4ade80", label: "layer1" },
          { from: "s6", to: "s11", color: "#fb923c", label: "layer2" }
        ]
      }
    ]
  }
});
