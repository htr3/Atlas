window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 1,
  title: "The Egg Dropping Problem - Interview Question",
  video: "https://www.youtube.com/watch?v=o_AJ3VWQMzA",
  category: "Interview Prep",
  tagline: "Minimax drops on n floors with e eggs, then bottom-up DP in O(n^2 e).",
  summary: "Find the threshold floor in an n-floor tower using e eggs while minimizing worst-case throws, not eggs spent. Linear search costs n tries; skipping blocks of size sqrt(n) costs 2 sqrt(n) and is the same idea as square-root decomposition. The real answer is a DAG of subproblems filled bottom-up: for eight floors and four eggs the table says four tries.",

  theory: [
    {
      heading: "Threshold floor, not a saved egg",
      body: "You stand under a tower of <b>n floors</b> with <b>e eggs</b>. There is a hidden <b>threshold</b>: from that floor and above an egg shatters; from every floor below it the egg survives. The job is to name that floor. Eggs are cheap in the scoring — you may break all e of them — but each throw is expensive. The quantity to shrink is the number of throws in the <b>worst case</b>, not the number of shells you crack.",
      bullets: [
        "Survive below the threshold, break at or above it.",
        "All e eggs may be spent if that names the floor.",
        "Minimize tries, not casualties."
      ]
    },
    {
      heading: "Linear search costs n",
      body: "The blunt plan starts at floor 1 and walks up. The first break is the answer. Worst case the threshold is the roof, so you throw <b>n</b> times. Starting at the roof is no better: one break with no information below you still forces a scan, and the worst case is again n. Interviewers expect you to throw this bound away quickly.",
      bullets: [
        "Bottom-up: n throws if the critical floor is n.",
        "Top-down: a break leaves an unknown range of size n-1.",
        "O(n) tries is the baseline you must beat."
      ]
    },
    {
      heading: "Fixed blocks and square-root decomposition",
      body: "A common next idea chops the tower into blocks of height <b>B</b>. Jump to the top of the first block and drop. A break means the threshold sits in those B floors; scan them with the remaining eggs. A survive means skip another B floors. Worst case you ride every block to the roof (<code>n/B</code> jumps) and then scan a full block (<code>B</code> extra throws). Tries = <code>B + n/B</code>. Treat n as constant, differentiate in B, set <code>1 - n/B^2 = 0</code>, get <b>B = sqrt(n)</b>. The second derivative <code>2n/B^3</code> is positive, so it is a minimum. Plug back in: <code>sqrt(n) + n/sqrt(n) = 2 sqrt(n)</code> throws. That is the same block size you pick when you square-root-decompose an array of length n — far better than n, still not optimal once e is a free variable.",
      bullets: [
        "One egg dies at a block boundary; the rest of that block is scanned linearly.",
        "Optimal constant block size is sqrt(n).",
        "Worst-case tries become 2 sqrt(n)."
      ]
    },
    {
      heading: "One drop, two worlds",
      body: "Suppose you throw from floor <b>X</b>. Two futures, and you must plan for the worse one. The egg breaks: X-1 floors remain below you and you now hold e-1 eggs. The egg lives: n-X floors remain above you and you still hold e eggs. You already spent one throw, so the cost of choosing X is <code>1 + max(f(X-1, e-1), f(n-X, e))</code>. You are free to pick any X from 1 to n-1, and you want the X that makes that worst-case smallest: <code>f(n, e) = min_X of that quantity</code>. That is a minimax recurrence, not a greedy jump.",
      bullets: [
        "Break: smaller tower, one fewer egg.",
        "Survive: shorter tower above, same egg count.",
        "Add one for the throw you just used, then minimize over X."
      ]
    },
    {
      heading: "Base cases that stop the recursion",
      body: "One floor left, any number of eggs: you throw once. That is <code>f(1, e) = 1</code>. One egg left, n floors: you cannot skip. A break with no spare egg would leave the threshold unknown, so you must climb from the bottom. Worst case you visit every floor: <code>f(n, 1) = n</code>. Those two edges seed every larger cell.",
      bullets: [
        "f(1, e) = 1 regardless of e.",
        "f(n, 1) = n: the last egg is a linear scan from the lobby.",
        "Zero floors (or zero eggs) is a trivial 0 if you need a sentinel."
      ]
    },
    {
      heading: "Why this is legal DP",
      body: "Three checks convert the recurrence into a table. <b>No cycles</b>: every call either cuts floors, cuts eggs, or both, so the dependency graph is a DAG. <b>Optimal substructure</b>: the best strategy for Y floors and Q eggs does not remember how you arrived there; the leftover tower is the same puzzle. <b>Recursive split</b> is already written. Bottom-up fill is the practical form: loop i = 1..n floors, j = 1..e eggs, and set <code>F[i][j]</code> from already-computed smaller i and j using the min-of-max over X. Naïve recursion is exponential in the depth of those splits. The table does <code>n * e</code> cells, each scanning up to n candidate X values, each max of two lookups: <b>O(n^2 e)</b>.",
      bullets: [
        "DAG: arguments only shrink.",
        "Sub-tower answers compose into the parent answer.",
        "Time O(n^2 e); space O(n e) for the table (or less with rolling rows)."
      ]
    },
    {
      heading: "Worked cells: f(2,2) and the 8-by-4 table",
      body: "The lecture fills a table for <b>eight floors and four eggs</b>. Row 1 (one floor) is all ones. Column 1 (one egg) equals the row index — i floors need i throws. The first interesting interior cell is <code>f(2, 2)</code>. Only X = 1 is legal. Survive leaves f(1, 2) = 1. Break leaves f(1, 1) = 1. Max is 1, plus the throw is <b>2</b>. Keep applying the same min-of-max. The program the video ran — about 15 seconds of filling — reports that eight floors and four eggs need <b>four</b> throws in the worst case. That number is not obvious from sqrt-decomposition; it falls out of the table.",
      bullets: [
        "First row: every entry 1.",
        "First column: entry i equals i.",
        "f(2, 2) = 2; f(8, 4) = 4."
      ]
    }
  ],

  keyTerms: [
    { term: "Threshold floor", def: "Lowest floor from which an egg breaks; every floor beneath it is safe." },
    { term: "Worst-case tries", def: "The number of throws you must budget if the adversary always picks the more expensive branch." },
    { term: "Block skip", def: "Jump every B floors, then linearly scan the block that first breaks an egg." },
    { term: "Square-root decomposition", def: "Choose B = sqrt(n) so block jumps plus a linear scan cost 2 sqrt(n)." },
    { term: "Minimax drop", def: "At floor X take max(break, survive), then choose the X with the smallest such max, plus one throw." },
    { term: "DAG of subproblems", def: "Each state reduces floors or eggs, so bottom-up fill never waits on a future cell." },
    { term: "Optimal substructure", def: "The leftover (floors, eggs) puzzle is independent of the path that produced it." },
    { term: "O(n^2 e) DP", def: "n by e table, n candidate drop floors per cell, constant-time max of two lookups." }
  ],

  tradeoffs: [
    { pro: "Linear scan is obvious and uses one egg.", con: "Worst case n throws — usually too slow for the interviewer." },
    { pro: "Blocks of sqrt(n) cut tries to 2 sqrt(n) with almost no code.", con: "Ignores extra eggs; the real optimum for e > 2 is better." },
    { pro: "Full DP uses every egg and returns the true minimax (4 tries for 8 floors, 4 eggs).", con: "O(n^2 e) time and a 2D table; easy to get the recurrence's max/min backwards." },
    { pro: "You may break every egg.", con: "Candidates who optimize 'eggs saved' solve the wrong objective." }
  ],

  interviewTips: [
    "State the objective first: minimize worst-case throws, eggs are a budget not a score.",
    "Give linear n, then 2 sqrt(n) blocks, then the minimax recurrence — that ladder is the point of the question.",
    "Write both base cases out loud: one floor is one throw; one egg is a ground-up scan.",
    "Say 'max of break vs survive, then min over X, plus one' so the interviewer hears minimax not average case.",
    "Quote the complexity O(n^2 e) and the worked pair f(2,2)=2, f(8,4)=4.",
    "Name square-root decomposition when you pick B = sqrt(n) so they see you recognize the pattern."
  ],

  scene: {
    nodes: [
      { id: "zt", label: "8-floor tower", type: "zone", pos: [0, 0, 2.5], size: [22, 4] },
      { id: "f1", label: "F1", type: "point", pos: [-10.5, 0, 2.5], color: "#4ade80" },
      { id: "f2", label: "F2", type: "point", pos: [-7.5, 0, 2.5], color: "#4ade80" },
      { id: "f3", label: "F3", type: "point", pos: [-4.5, 0, 2.5], color: "#60a5fa" },
      { id: "f4", label: "F4", type: "point", pos: [-1.5, 0, 2.5], color: "#60a5fa" },
      { id: "f5", label: "F5 / X", type: "point", pos: [1.5, 0, 2.5], color: "#fb923c" },
      { id: "f6", label: "F6", type: "point", pos: [4.5, 0, 2.5], color: "#c084fc" },
      { id: "f7", label: "F7", type: "point", pos: [7.5, 0, 2.5], color: "#c084fc" },
      { id: "f8", label: "F8", type: "point", pos: [10.5, 0, 2.5], color: "#f87171" },
      { id: "eg1", label: "Egg 1", type: "server", pos: [-6, 0, -2] },
      { id: "eg2", label: "Egg 2", type: "server", pos: [-3, 0, -2], showAt: 2 },
      { id: "eg3", label: "Egg 3", type: "server", pos: [0, 0, -2], showAt: 2 },
      { id: "eg4", label: "Egg 4", type: "server", pos: [3, 0, -2], showAt: 2 },
      { id: "blk", label: "Block B", type: "zone", pos: [-6, 0, 2.5], size: [8, 4], showAt: 3 },
      { id: "n0", label: "n floors, e eggs", type: "note", pos: [-8, 3, -7] },
      { id: "n1", label: "Worst case n tries", type: "note", pos: [0, 3, -7], showAt: 2 },
      { id: "n2", label: "B = sqrt(n), 2 sqrt(n)", type: "note", pos: [8, 3, -7], showAt: 3 },
      { id: "n3", label: "1 + max(break, live)", type: "note", pos: [-8, 3, 7], showAt: 4 },
      { id: "n4", label: "f(1,e)=1  f(n,1)=n", type: "note", pos: [0, 3, 7], showAt: 5 },
      { id: "n5", label: "f(2,2)=2  DAG table", type: "note", pos: [8, 3, 7], showAt: 6 },
      { id: "n6", label: "f(8,4)=4  O(n^2 e)", type: "note", pos: [8, 3, -4], showAt: 7 }
    ],
    edges: [
      { from: "f1", to: "f2" },
      { from: "f2", to: "f3" },
      { from: "f3", to: "f4" },
      { from: "f4", to: "f5" },
      { from: "f5", to: "f6" },
      { from: "f6", to: "f7" },
      { from: "f7", to: "f8" },
      { from: "eg1", to: "f1", label: "drop", dashed: true },
      { from: "eg1", to: "f5", label: "X", showAt: 4, dashed: true },
      { from: "f1", to: "n4", label: "base", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Name the threshold",
        text: "Eight floors, a stash of eggs, one unknown critical floor. Survive below it, break at or above it. Score is the number of throws you must budget, not the shells you may smash.",
        highlight: ["zt", "f1", "f8", "eg1", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6"]
      },
      {
        title: "Scan from the lobby",
        text: "Throw from F1, then F2, and so on. If the threshold is the roof you spend n throws. Starting at F8 is no cheaper: one break still leaves a linear unknown. Four eggs do not help this plan.",
        highlight: ["f1", "f2", "f3", "eg1", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "eg1", to: "f1", color: "#4ade80", label: "try" },
          { from: "f1", to: "f2", color: "#4ade80", label: "up" }
        ]
      },
      {
        title: "Skip blocks of size B",
        text: "Jump to the top of each block of B floors. A break leaves a B-floor scan with the leftover eggs; a live egg skips another block. Tries = B + n/B. Calculus picks B = sqrt(n) and the worst case becomes 2 sqrt(n) — square-root decomposition on a tower.",
        highlight: ["blk", "f1", "f2", "f3", "f4", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "eg1", to: "f3", color: "#fb923c", label: "skip B" }
        ]
      },
      {
        title: "Drop at X, take the worse branch",
        text: "From F5 (some X) the egg either dies — X-1 floors and e-1 eggs left — or lives — n-X floors and e eggs. Budget 1 + the worse of those two subproblems. Then choose the X that minimizes that worst case.",
        highlight: ["f5", "eg1", "eg2", "n3"],
        fail: ["eg1"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6"],
        flows: [
          { from: "eg1", to: "f5", color: "#f87171", label: "break" },
          { from: "eg2", to: "f6", color: "#4ade80", label: "live" }
        ]
      },
      {
        title: "Two base cases",
        text: "One floor remaining: one throw, any egg count. One egg remaining: you must walk from F1; worst case n throws. Those cells seed the table. Never skip with a last egg — a break would leave the threshold unnamed.",
        highlight: ["f1", "eg1", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6"],
        flows: [
          { from: "eg1", to: "f1", color: "#60a5fa", label: "only egg" }
        ]
      },
      {
        title: "Fill f(2,2)",
        text: "Dependencies only shrink floors or eggs, so the graph is a DAG and bottom-up is legal. For two floors and two eggs the only X is 1. max(f(1,2), f(1,1)) + 1 = 1 + 1 = 2. First row of the table is all ones; first column equals the row index.",
        highlight: ["f1", "f2", "eg1", "eg2", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6"],
        flows: [
          { from: "eg1", to: "f1", color: "#c084fc", label: "X=1" }
        ]
      },
      {
        title: "Eight floors, four eggs, four tries",
        text: "Keep filling. The completed table says f(8,4) = 4. Each of n times e cells scans n drop heights, so the DP is O(n^2 e) — exponential recursion crushed into a polynomial grid.",
        highlight: ["zt", "f8", "eg1", "eg2", "eg3", "eg4", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "eg4", to: "f5", color: "#c084fc", label: "DP X" }
        ]
      }
    ]
  }
});
