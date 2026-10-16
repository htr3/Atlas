window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 46,
  title: "4 Principle of Optimality - Dynamic Programming introduction",
  video: "https://www.youtube.com/watch?v=5dRGRueKU3M",
  category: "Dynamic Programming",
  tagline: "Try every feasible split, cache overlapping states: fib(5) drops from 15 calls to 6.",
  summary: "Greedy locks one known rule; dynamic programming enumerates feasible decisions and keeps the best. The principle of optimality says an optimum is a sequence of stage-wise choices. Recursion on Fibonacci is T(n)=2T(n-1)+O(1) → O(2^n) because fib(2) and fib(3) recompute. Memoization stores each F[i] once (top-down, 6 calls for n=5). Tabulation fills F[0]..F[n] bottom-up in Θ(n).",

  theory: [
    {
      heading: "State: what a DP cell must remember",
      body: "Greedy and DP both target a min or a max. Greedy (Kruskal: always the cheapest safe edge; Dijkstra: always the closest unsettled vertex) commits to one procedure. DP has no such prepaid rule: it lists feasible solutions and picks the optimum. A <b>state</b> is the smallest snapshot that lets you finish — for Fibonacci, the integer i whose term you want. Two states with the same i are the same subproblem, which is why a table is legal.",
      bullets: [
        "Optimization = min or max among feasible answers.",
        "Greedy: one decision, then follow the recipe.",
        "DP: a decision at every stage; the state is the remaining subproblem."
      ]
    },
    {
      heading: "Recurrence and the principle of optimality",
      body: "The principle of optimality: an optimal solution is a <b>sequence of decisions</b>. Fibonacci is the lecture's microscope: F(n)=F(n-1)+F(n-2), with F(0)=0 and F(1)=1. The formula is recursive even when the code later is a loop. You may recurse; Bari's DP programs almost always iterate. Compared with greedy, this is slower in the abstract because you consider more than one candidate — that is the point.",
      bullets: [
        "Every stage chooses (here: add the two previous terms).",
        "Write the recurrence first; iteration is just an evaluation order.",
        "Feasible ≠ optimal: DP scores every feasible combination the recurrence can see."
      ]
    },
    {
      heading: "Naive tree: 15 calls for fib(5)",
      body: "Call fib(5). It forks fib(3) and fib(4). fib(3) forks fib(1) and fib(2); fib(2) forks fib(0) and fib(1). The right spine similarly rebuilds fib(2) and fib(3). Count the frames: <b>15 calls</b> for n=5. Approximate the recurrence as T(n)=2T(n-1)+Θ(1) (ignore the n-2 shrink) and Master's theorem for a decreasing function gives <b>O(2^n)</b>. The exact tree is smaller than a perfect binary tree, but it is still exponential.",
      bullets: [
        "Same arguments appear on many branches: fib(1) three times, fib(2) three times.",
        "Exponential work is duplicated work, not deep arithmetic.",
        "That overlap is the license for memoization."
      ]
    },
    {
      heading: "Memoization table order (top-down)",
      body: "Allocate a global array F[0..n] filled with a sentinel (−1). On a call for i: if F[i] is known, return it; else compute, <b>write F[i]</b>, return. Tracing fib(5): fill F[1]=1, F[0]=0, F[2]=1, F[3]=2, skip the second fib(2), skip the second fib(3), F[4]=3, F[5]=5. Six frames — n+1 — so <b>Θ(n)</b>. The stack still starts at 5 and walks toward 0: that is <b>top-down</b>.",
      bullets: [
        "Sentinel means \"not yet computed.\"",
        "A hit skips an entire subtree.",
        "From 2^n down to n: exponential to linear on this example."
      ]
    },
    {
      heading: "Tabulation (bottom-up) and complexity",
      body: "The same recurrence as a loop: F[0]=0, F[1]=1, then for i=2..n set F[i]=F[i-1]+F[i-2]. You want F[5], so you start at 0. That is <b>bottom-up</b>. Time Θ(n), space Θ(n) (or two rolling scalars). Bari's later DP lectures fill a table this way even when the formula looks recursive. Memoization is legal DP; tabulation is the default exam write-up.",
      bullets: [
        "Bottom-up: smaller i before larger i.",
        "Top-down: larger i first, cache on the way back.",
        "Time Θ(n) either way; the table order is the exam sentence they want."
      ]
    }
  ],

  keyTerms: [
    { term: "Principle of optimality", def: "An optimum can be built as a sequence of stage-wise decisions whose leftovers are themselves optimal." },
    { term: "State", def: "The arguments that uniquely name a subproblem — here the index i of F(i)." },
    { term: "Overlapping subproblems", def: "The same state is requested from many parents; caching it is correct and faster." },
    { term: "Memoization", def: "Top-down recursion plus an array of already-answered states." },
    { term: "Tabulation", def: "Bottom-up loop that fills the array from base cases toward the goal." },
    { term: "O(2^n) naive Fibonacci", def: "Two recursive calls per frame, ignoring reuse; Master's bound on T(n)=2T(n-1)+O(1)." }
  ],

  tradeoffs: [
    { pro: "Greedy is one pass after you trust a rule (MST, Dijkstra).", con: "If the rule is wrong, you never see the combinations DP would have scored." },
    { pro: "Memoization reuses the recursive formula you already wrote.", con: "Stack depth and sentinel bugs; harder to quote a tight loop bound in an exam." },
    { pro: "Tabulation is iterative, cache-friendly, and matches textbook DP write-ups.", con: "You must know the fill order before you code; a wrong direction reads uninitialized cells." },
    { pro: "Caching turns this Fibonacci from exponential to linear.", con: "Not every exponential recursion has overlap; then a table does not help." }
  ],

  interviewTips: [
    "Contrast greedy (one prepaid procedure) with DP (try all splits the recurrence names, keep the min/max).",
    "Name the principle of optimality as \"optimal = sequence of decisions,\" then write the recurrence.",
    "Quote the naive tree: fib(5) makes 15 calls; T(n)=2T(n-1)+O(1) is O(2^n).",
    "Say memoization is top-down (start at n) and tabulation is bottom-up (start at 0).",
    "Give the memo trace: six fills for n=5, array of −1, skip fib(2) and fib(3) the second time.",
    "DP code in this course is usually a nested loop, even when the formula is recursive."
  ],

  scene: {
    nodes: [
      { id: "f5", label: "F5", type: "point", pos: [0, 0, 6.5], color: "#fb923c" },
      { id: "f3", label: "F3", type: "point", pos: [-5, 0, 3], color: "#60a5fa" },
      { id: "f4", label: "F4", type: "point", pos: [5, 0, 3], color: "#60a5fa" },
      { id: "f1a", label: "F1=1", type: "point", pos: [-8, 0, -0.5], color: "#4ade80" },
      { id: "f2a", label: "F2", type: "point", pos: [-2, 0, -0.5], color: "#c084fc" },
      { id: "f2b", label: "F2", type: "point", pos: [2, 0, -0.5], color: "#c084fc" },
      { id: "f3b", label: "F3", type: "point", pos: [8, 0, -0.5], color: "#60a5fa" },
      { id: "f0", label: "F0=0", type: "point", pos: [-4, 0, -4], color: "#4ade80" },
      { id: "f1b", label: "F1=1", type: "point", pos: [0, 0, -4], color: "#4ade80" },
      { id: "c0", label: "0", type: "cache", pos: [-10, 0, -7], color: "#64748b", showAt: 4 },
      { id: "c1", label: "1", type: "cache", pos: [-7.5, 0, -7], color: "#4ade80", showAt: 4 },
      { id: "c2", label: "1", type: "cache", pos: [-5, 0, -7], color: "#c084fc", showAt: 5 },
      { id: "c3", label: "2", type: "cache", pos: [-2.5, 0, -7], color: "#60a5fa", showAt: 5 },
      { id: "c4", label: "3", type: "cache", pos: [0, 0, -7], color: "#60a5fa", showAt: 6 },
      { id: "c5", label: "5", type: "cache", pos: [3, 0, -7], color: "#fb923c", showAt: 6 },
      { id: "n0", label: "State = index i", type: "note", pos: [9, 0, 6.5] },
      { id: "n1", label: "15 calls, O(2^n)", type: "note", pos: [9, 0, 3], showAt: 2 },
      { id: "n2", label: "F2,F3 overlap", type: "note", pos: [9, 0, -0.5], showAt: 3 },
      { id: "n3", label: "Memo: 6 calls, top-down", type: "note", pos: [9, 0, -4], showAt: 5 },
      { id: "n4", label: "Table 0..5 bottom-up", type: "note", pos: [9, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "f5", to: "f3" },
      { from: "f5", to: "f4" },
      { from: "f3", to: "f1a" },
      { from: "f3", to: "f2a" },
      { from: "f4", to: "f2b" },
      { from: "f4", to: "f3b" },
      { from: "f2a", to: "f0" },
      { from: "f2a", to: "f1b" },
      { from: "c2", to: "f2b", showAt: 5, dashed: true },
      { from: "c3", to: "f3b", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Name the state",
        text: "You want F(5). The state is the integer i. Greedy would follow one recipe; DP will score the recurrence F(i)=F(i-1)+F(i-2) at every i.",
        highlight: ["f5", "n0"]
      },
      {
        title: "Fork the recurrence",
        text: "fib(5) calls fib(3) and fib(4). Each of those forks again. The principle of optimality here is just \"the fifth term is the sum of two optimal smaller terms.\"",
        highlight: ["f5", "f3", "f4"],
        flows: [
          { from: "f5", to: "f3", color: "#60a5fa", label: "n-2" },
          { from: "f5", to: "f4", color: "#fb923c", label: "n-1" }
        ]
      },
      {
        title: "Fifteen frames",
        text: "Leaves return 0 or 1. The full tree has 15 calls. Bounding T(n)=2T(n-1)+O(1) gives O(2^n). The extra cost is not addition — it is calling the same i again.",
        highlight: ["f1a", "f2a", "f2b", "f3b", "f0", "f1b", "n1"]
      },
      {
        title: "Same states, many parents",
        text: "F(2) appears under both F(3) and F(4). F(3) appears twice. Those are overlapping subproblems. A table keyed by i is enough; there is no extra context to store.",
        highlight: ["f2a", "f2b", "f3", "f3b", "n2"]
      },
      {
        title: "Sentinel array",
        text: "F[] starts at −1. First hits write F[0]=0 and F[1]=1. Later calls for the same i return the cell and prune the subtree. That is memoization, still top-down.",
        highlight: ["c0", "c1", "f0", "f1a"]
      },
      {
        title: "Six calls, not fifteen",
        text: "After F[2]=1 and F[3]=2 sit in the array, the right copies of F(2) and F(3) never run. Six frames total: n+1. Exponential became linear.",
        highlight: ["c2", "c3", "f2b", "f3b", "n3"],
        fail: ["f2b", "f3b"],
        flows: [
          { from: "c2", to: "f2b", color: "#c084fc", label: "hit" },
          { from: "c3", to: "f3b", color: "#60a5fa", label: "hit" }
        ]
      },
      {
        title: "Bottom-up table",
        text: "Tabulation ignores the call tree: write 0,1, then i=2..5 using the two previous cells. F[5]=5. Same Θ(n) arithmetic, fill order reversed — this is the default DP exam write-up.",
        highlight: ["c0", "c1", "c2", "c3", "c4", "c5", "n4"],
        flows: [
          { from: "c3", to: "c4", color: "#4ade80", label: "+prev" },
          { from: "c4", to: "c5", color: "#fb923c", label: "F5=5" }
        ]
      }
    ]
  }
});
