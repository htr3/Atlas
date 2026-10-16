window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 18,
  title: "Divide And Conquer",
  video: "https://www.youtube.com/watch?v=2Rr2tW9zvRg",
  category: "Divide & Conquer",
  tagline: "Split the same problem, solve the pieces, combine — then write a recurrence.",
  summary: "Divide and conquer is a design strategy, not a formula that tags a problem type. If P of size n is too large, split it into k smaller copies of the same problem, solve those copies (recursively if they are still large), and combine the answers. Combining must exist; otherwise the strategy does not apply. Sorting is the model. A college workshop split into posters, guests, and venues is not. The lectures that follow use recurrences to time these recursive procedures.",

  theory: [
    {
      heading: "A strategy, chosen by practice",
      body: "After algorithm analysis, the course moves to <b>design techniques</b>: divide and conquer, greedy, dynamic programming, backtracking, branch and bound. A strategy is an approach you may adopt for a computational problem <i>if it fits</i>. There is no closed-form rule that prints the right technique. Guidelines exist; fluency comes from working examples until the shape is obvious.",
      bullets: [
        "Size n is the size of the input, not a magic constant.",
        "Suitability is judged on the instance, not by chapter title.",
        "The same problem family can still reject a strategy if combining fails."
      ]
    },
    {
      heading: "Large P becomes k smaller copies",
      body: "Given a problem <code>P</code> whose input is large, break it into subproblems <code>P1, P2, \ldots, Pk</code>. How many pieces is your choice; k is not fixed by the name of the method. Solve each piece for solutions <code>S1 \ldots Sk</code>, then <b>combine</b> those solutions into an answer for P. If a subproblem is still large, apply the same split on it. That nested split is why the written algorithms are recursive.",
      bullets: [
        "Divide: same problem, smaller size.",
        "Conquer: solve the pieces (base case when small).",
        "Combine: glue Si into an answer for P."
      ]
    },
    {
      heading: "Same problem — the workshop is not D&C",
      body: "Subproblems must be <b>the same problem</b> as P. If P is sort, every piece is still sort, only on a shorter array. Conducting a college workshop by splitting into invitations, posters, guests, and venue is ordinary work breakdown: each task is a <i>different</i> problem. That is not divide and conquer. Keep the problem type fixed or you have only delegated chores.",
      bullets: [
        "Sort splits into sort; search splits into search.",
        "Heterogeneous tasks are project management, not D&C.",
        "Recursion follows because the callee is the same procedure."
      ]
    },
    {
      heading: "Combine or walk away",
      body: "After the pieces return, you need a method that builds P's answer from the Si. Merge in mergesort is the classic glue. If you cannot combine, you cannot adopt this strategy — even if the split looks pretty. That is the practical test: same-type subproblems <i>and</i> a combiner."
    },
    {
      heading: "The general method",
      body: "<code>DC(P)</code>: if P is small, solve it directly (a constant-time or brute-force base). If P is large, divide into <code>P1 \ldots Pk</code>, recursively call <code>DC</code> on each, then combine. The base case is mandatory: without a size that is solved outright, the recursion never bottoms out. Small here usually means n = 0 or n = 1, depending on whether the size decreases by subtraction or by division.",
      bullets: [
        "Base: small P, direct solve.",
        "Recursive case: divide, DC on each, combine.",
        "Written algorithms for this family are recursive procedures."
      ]
    },
    {
      heading: "Problems on the syllabus, and why recurrences next",
      body: "The upcoming D&C catalog is binary search, finding max and min, mergesort, quicksort, and Strassen matrix multiplication. Because the procedures are recursive, timing them is not a nested-loop count. You write a <b>recurrence</b> T(n) from the code, then solve it. The next lectures are exactly that: how to form T(n) and how to unwind it.",
      bullets: [
        "Binary search, extrema, merge, quick, Strassen.",
        "Recursive code implies a recurrence, not a single for-loop tally.",
        "Substitution and recursion trees are the first solving tools."
      ]
    }
  ],

  keyTerms: [
    { term: "Divide and conquer", def: "Split a large instance into smaller copies of the same problem, solve, then combine." },
    { term: "Subproblem", def: "A smaller instance of P — same question, smaller n — not a different task." },
    { term: "Combine", def: "The step that turns answers of P1\u2026Pk into an answer for P. No combiner, no D&C." },
    { term: "Base case", def: "A size small enough to solve directly so recursion stops." },
    { term: "k-way split", def: "You choose how many pieces; two-way (n/2, n/2) is common, not required." },
    { term: "Recurrence", def: "An equation for T(n) in terms of T(smaller) plus non-recursive work." },
    { term: "Strategy", def: "A design approach (D&C, greedy, DP, \u2026) applied when the problem shape fits." }
  ],

  tradeoffs: [
    { pro: "Same-type recursive split reuses one procedure and often yields clean recurrences.", con: "If combining is expensive or undefined, the split is wasted work." },
    { pro: "You may choose k (two halves, three parts, eight Strassen products).", con: "A bad split (uneven sizes, extra copies) inflates T(n) even when the idea is right." },
    { pro: "Base cases are tiny and obvious (n = 0 or 1).", con: "Forgetting the base, or combining the wrong type of subproblem, silently breaks correctness." },
    { pro: "Fits sort, search, min/max, and some matrix products.", con: "Heterogeneous task lists (the workshop) look like a split and are not D&C." }
  ],

  interviewTips: [
    "Say the three verbs in order: divide, recursively conquer, combine — then name the combiner.",
    "Check same-problem-type: if the pieces are different tasks, it is not divide and conquer.",
    "If you cannot combine Si into P's answer, reject D&C and pick another strategy.",
    "Write the base case first (small n solved directly) before sketching the recursive case.",
    "Time D&C with a recurrence T(n), not by staring at one loop; that is the next skill.",
    "Name the catalog: binary search, min/max, mergesort, quicksort, Strassen."
  ],

  scene: {
    nodes: [
      { id: "p", label: "P size n", type: "point", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "p1", label: "P1", type: "point", pos: [-6, 0, -1], showAt: 2, color: "#818cf8" },
      { id: "p2", label: "P2", type: "point", pos: [0, 0, -1], showAt: 2, color: "#818cf8" },
      { id: "p3", label: "Pk", type: "point", pos: [6, 0, -1], showAt: 2, color: "#818cf8" },
      { id: "s1", label: "S1", type: "point", pos: [-6, 0, 4], showAt: 4, color: "#4ade80" },
      { id: "s2", label: "S2", type: "point", pos: [0, 0, 4], showAt: 4, color: "#4ade80" },
      { id: "s3", label: "Sk", type: "point", pos: [6, 0, 4], showAt: 4, color: "#4ade80" },
      { id: "comb", label: "Combine", type: "note", pos: [0, 0, 7], showAt: 4 },
      { id: "eq", label: "same problem type", type: "note", pos: [-8, 0, -6] },
      { id: "n1", label: "if small: solve", type: "note", pos: [8, 0, -6], showAt: 1 },
      { id: "n2", label: "if large: split k ways", type: "note", pos: [8, 0, -1], showAt: 2 },
      { id: "n3", label: "recurse on each Pi", type: "note", pos: [8, 0, 2], showAt: 3 },
      { id: "n4", label: "workshop \u2260 D&C", type: "note", pos: [-8, 0, 4], showAt: 5 },
      { id: "n5", label: "next: recurrences", type: "note", pos: [-8, 0, 7], showAt: 6 }
    ],
    edges: [
      { from: "p", to: "p1", label: "divide", showAt: 2 },
      { from: "p", to: "p2", showAt: 2 },
      { from: "p", to: "p3", showAt: 2 },
      { from: "p1", to: "s1", label: "solve", showAt: 4 },
      { from: "p2", to: "s2", showAt: 4 },
      { from: "p3", to: "s3", showAt: 4 },
      { from: "s1", to: "comb", showAt: 4 },
      { from: "s2", to: "comb", showAt: 4 },
      { from: "s3", to: "comb", showAt: 4 }
    ],
    steps: [
      {
        title: "Pick a strategy",
        text: "Divide and conquer is one design technique among greedy, DP, backtracking, and branch-and-bound. Use it when the problem shape fits. Practice, not a formula, tells you that.",
        highlight: ["p", "eq"]
      },
      {
        title: "Base when small",
        text: "If P is already small, solve it directly. Recursion is only for instances too large to finish in one shot. The base case is what stops the tree.",
        highlight: ["p", "n1"]
      },
      {
        title: "Split into k copies",
        text: "A large P of size n breaks into P1 \u2026 Pk. k is your choice. Every piece must be the same problem as P, only smaller — sort stays sort.",
        highlight: ["p", "p1", "p2", "p3", "n2"],
        flows: [
          { from: "p", to: "p1", color: "#60a5fa", label: "P1" },
          { from: "p", to: "p2", color: "#60a5fa", label: "P2" },
          { from: "p", to: "p3", color: "#60a5fa", label: "Pk" }
        ]
      },
      {
        title: "Recurse if still large",
        text: "If a subproblem is still large, apply DC to it. Nested splits are why the written method is recursive. Same procedure, smaller n.",
        highlight: ["p1", "p2", "p3", "n3"]
      },
      {
        title: "Combine the Si",
        text: "Solutions S1 \u2026 Sk are useless until a combiner builds P's answer. No combiner means this strategy does not apply, even if the split looks clean.",
        highlight: ["s1", "s2", "s3", "comb"],
        flows: [
          { from: "s1", to: "comb", color: "#4ade80", label: "S1" },
          { from: "s2", to: "comb", color: "#4ade80", label: "S2" },
          { from: "s3", to: "comb", color: "#4ade80", label: "Sk" }
        ]
      },
      {
        title: "Workshop is not D&C",
        text: "Invites, posters, guests, venue are different tasks. That work breakdown is not divide and conquer. Keep the problem type fixed.",
        highlight: ["p", "n4", "eq"],
        hide: ["n1", "n2"]
      },
      {
        title: "Catalog, then recurrences",
        text: "Binary search, min/max, mergesort, quicksort, Strassen come next. Recursive code is timed with a recurrence T(n). That is the next block of videos.",
        highlight: ["comb", "n5"],
        hide: ["n1", "n2", "n4"]
      }
    ]
  }
});
