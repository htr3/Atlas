window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 64,
  title: "6.1 N Queens Problem using Backtracking",
  video: "https://www.youtube.com/watch?v=xFv_Hl4B83A",
  category: "Graphs & Backtracking",
  tagline: "4-queens: one per row, Place(k,i) kills column/diagonal, solutions (2,4,1,3) and (3,1,4,2).",
  summary: "Place n queens on an n×n board so no two share a row, column, or diagonal. The lecture works n = 4 (a standard board is 8×8). One queen per row turns the vector x[k] into the column of row k. The bounding function Place(k, i) rejects a column that collides in a column or a diagonal. DFS of that tree yields two solutions: (2,4,1,3) and (3,1,4,2). You want every solution, not one.",

  theory: [
    {
      heading: "The 4×4 instance, and what 'attack' means",
      body: "A queen slides any number of squares along a <b>row</b>, a <b>column</b>, or a <b>diagonal</b>. Four queens on a 4×4 board are under attack if any pair shares one of those three. The problem is to place all four so that none of those lines is shared. It is possible. It is not unique — the lecture wants <b>every</b> legal placement, which is why backtracking (all feasible solutions) is the method, not an optimizer.",
      bullets: [
        "Standard chessboard is 8×8; the worked size is n = 4 so the tree fits on a board.",
        "Attack = same row or same column or same diagonal.",
        "Multiple solutions exist; list them all."
      ]
    },
    {
      heading: "One queen per row folds the search",
      body: "If two queens share a row they attack, so a feasible placement has <b>exactly one queen in each row</b> (and, later, each column). Decision k is 'which column does the queen in row k occupy?'. The solution is an array <code>x[1..n]</code> with <code>x[k] = i</code> meaning row k, column i. The state-space tree has branching factor up to n at every level and height n. Unpruned size is on the order of n^n (or n! if you also force distinct columns up front). Bounding is what makes 4-queens hand-workable.",
      bullets: [
        "Level k of the tree = row k.",
        "A child is a candidate column 1..n for that row.",
        "A leaf with n queens placed and no bound firing is a solution."
      ]
    },
    {
      heading: "Place(k, i): the bounding function",
      body: "<code>Place(k, i)</code> asks whether the queen of row k may sit in column i given the already-chosen <code>x[1..k-1]</code>. For each earlier row j: if <code>x[j] === i</code>, same column — reject. If <code>|x[j] − i| === |j − k|</code>, same diagonal — reject (the two differences equal means the slope is ±1). Otherwise accept, set <code>x[k] = i</code>, and either print (k = n) or recurse to row k+1. That test is the entire bound. There is no separate 'row' check because rows are unique by construction.",
      bullets: [
        "Column clash: x[j] equals i.",
        "Diagonal clash: absolute column gap equals absolute row gap.",
        "True → promising; false → kill the node, try the next i."
      ]
    },
    {
      heading: "Dead end from x[1] = 1",
      body: "Start DFS with queen 1 in column 1. Queen 2: column 1 dies (column), column 2 dies (diagonal with (1,1)), column 3 lives. Queen 3 against (1,1) and (2,3): column 1 is a column clash, column 2 is a diagonal with queen 2, column 3 is a column clash, column 4 is a diagonal with queen 2. Every child dies. Backtrack queen 2 to column 4; queen 3 can sit in column 2, but queen 4 then has nowhere. The whole subtree of <code>x[1] = 1</code> is empty. Queen 1 in column 4 is symmetric and also empty. The first column that works is 2.",
      bullets: [
        "A killed internal node saves an entire n-ary subtree.",
        "You must backtrack: undo x[k], try the next column.",
        "Failing the first column is expected — show it, do not skip it."
      ]
    },
    {
      heading: "Two solutions: (2,4,1,3) and (3,1,4,2)",
      body: "Queen 1 in column 2. Queen 2: columns 1 and 2 and 3 die; column 4 lives. Queen 3: column 1 lives (<code>Place(3,1)</code> against (2,4)). Queen 4: column 3 lives. Vector <code>(2, 4, 1, 3)</code> is the first solution — board picture: Q on row1-col2, row2-col4, row3-col1, row4-col3. Continue DFS (the method does not stop at the first leaf). The second placement is <code>(3, 1, 4, 2)</code>, the left-right mirror. Those two are all of 4-queens. For n = 8 there are 92 solutions; the same Place/NQueen recursion finds them.",
      bullets: [
        "First leaf: x = (2, 4, 1, 3).",
        "Second leaf: x = (3, 1, 4, 2).",
        "NQueen(k) loops i = 1..n, Place, set x[k], recurse or print."
      ]
    },
    {
      heading: "Complexity and the exam write-up",
      body: "Worst case the bound never fires and you still try on the order of n^n (or n! with a permutation of columns) placements. Backtracking is still exponential; the bound only shrinks the constant and the practical tree. For a university paper: define the attack rule, write Place(k, i) in words (column + diagonal), trace 4-queens at least to (2,4,1,3), and state that you want every solution. Full code is optional unless asked; a verbal bound plus the two vectors scores.",
      bullets: [
        "Time: exponential in n; 4 is demo size.",
        "Space: the current path x[1..k], O(n).",
        "Do not claim uniqueness — n = 4 has two answers."
      ]
    }
  ],

  keyTerms: [
    { term: "N-queens", def: "Place n queens on an n×n board with no shared row, column, or diagonal." },
    { term: "Attack", def: "Two queens share a row, a column, or a diagonal." },
    { term: "x[k] = i", def: "The queen in row k sits in column i; one queen per row by construction." },
    { term: "Place(k, i)", def: "Bounding test: column i for row k does not clash with x[1..k-1] in column or diagonal." },
    { term: "Diagonal test", def: "|x[j] − i| = |j − k| means the same / or \\ diagonal." },
    { term: "(2,4,1,3)", def: "First 4-queens solution found by left-to-right DFS." },
    { term: "(3,1,4,2)", def: "Second 4-queens solution, the mirror of the first." }
  ],

  tradeoffs: [
    { pro: "One-queen-per-row cuts the search versus placing on any of n² squares.", con: "You still have an exponential tree; n = 8 is 92 solutions but far more killed nodes." },
    { pro: "Place(k, i) is O(k) and kills a node before you generate its children.", con: "A late clash (only at row n) still paid for the whole prefix." },
    { pro: "DFS finds every solution without storing the whole tree.", con: "The first solution may sit after a long dead-end (x[1] = 1 fails completely)." },
    { pro: "The same skeleton scales from 4-queens to 8-queens without a new idea.", con: "Bit-mask and dancing-links solvers are faster in contests; the lecture wants the bound, not those tricks." }
  ],

  interviewTips: [
    "State the attack definition, then say one queen per row so x[k] is a column.",
    "Write Place(k, i): same column or |Δcol| = |Δrow|. That is the bounding function.",
    "Trace x[1] = 1 to a dead end, then give (2,4,1,3) and (3,1,4,2).",
    "Say you want all solutions; stopping at the first leaf is a different problem.",
    "Complexity: exponential, O(n) extra space for the path. Do not quote a polynomial.",
    "If they ask for code: NQueen(k) for i in 1..n, if Place then x[k]=i, if k==n print else NQueen(k+1)."
  ],

  scene: {
    nodes: [
      { id: "board", label: "4x4 board", type: "zone", pos: [-4, 0, 1], size: [12, 12] },
      { id: "c11", label: "r1c1", type: "point", pos: [-8, 0, 5] },
      { id: "c12", label: "r1c2", type: "point", pos: [-5, 0, 5], color: "#4ade80" },
      { id: "c13", label: "r1c3", type: "point", pos: [-2, 0, 5] },
      { id: "c14", label: "r1c4", type: "point", pos: [1, 0, 5] },
      { id: "c21", label: "r2c1", type: "point", pos: [-8, 0, 2] },
      { id: "c22", label: "r2c2", type: "point", pos: [-5, 0, 2] },
      { id: "c23", label: "r2c3", type: "point", pos: [-2, 0, 2] },
      { id: "c24", label: "r2c4", type: "point", pos: [1, 0, 2], color: "#4ade80" },
      { id: "c31", label: "r3c1", type: "point", pos: [-8, 0, -1], color: "#4ade80" },
      { id: "c32", label: "r3c2", type: "point", pos: [-5, 0, -1] },
      { id: "c33", label: "r3c3", type: "point", pos: [-2, 0, -1] },
      { id: "c34", label: "r3c4", type: "point", pos: [1, 0, -1] },
      { id: "c41", label: "r4c1", type: "point", pos: [-8, 0, -4] },
      { id: "c42", label: "r4c2", type: "point", pos: [-5, 0, -4] },
      { id: "c43", label: "r4c3", type: "point", pos: [-2, 0, -4], color: "#4ade80" },
      { id: "c44", label: "r4c4", type: "point", pos: [1, 0, -4] },
      { id: "q1", label: "Q1", type: "worker", pos: [-8, 0, 5], showAt: 2, color: "#facc15" },
      { id: "q2", label: "Q2", type: "worker", pos: [-2, 0, 2], showAt: 2, color: "#facc15" },
      { id: "q3dead", label: "Q3 killed", type: "server", pos: [4, 0, 2], showAt: 2, color: "#f87171" },
      { id: "q1s", label: "Q1 col2", type: "worker", pos: [-5, 0, 5], showAt: 4, color: "#4ade80" },
      { id: "q2s", label: "Q2 col4", type: "worker", pos: [1, 0, 2], showAt: 4, color: "#4ade80" },
      { id: "q3s", label: "Q3 col1", type: "worker", pos: [-8, 0, -1], showAt: 4, color: "#4ade80" },
      { id: "q4s", label: "Q4 col3", type: "worker", pos: [-2, 0, -4], showAt: 4, color: "#4ade80" },
      { id: "sol2", label: "(3,1,4,2)", type: "cache", pos: [8, 0, -1], showAt: 5, color: "#60a5fa" },
      { id: "place", label: "Place(k,i)", type: "lb", pos: [8, 0, 5], showAt: 6 },
      { id: "n0", label: "No shared row/col/diag", type: "note", pos: [8, 0, 7] },
      { id: "n1", label: "x[1]=1 dead end", type: "note", pos: [8, 0, 2], showAt: 2 },
      { id: "n2", label: "sol (2,4,1,3)", type: "note", pos: [8, 0, -4], showAt: 4 },
      { id: "n3", label: "col + |Δc|=|Δr|", type: "note", pos: [8, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "q1", to: "c11", showAt: 2, dashed: true },
      { from: "q2", to: "c23", showAt: 2, dashed: true },
      { from: "q1s", to: "q2s", showAt: 4 },
      { from: "q2s", to: "q3s", showAt: 4 },
      { from: "q3s", to: "q4s", showAt: 4 },
      { from: "place", to: "q3dead", label: "kill", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Four queens, three attack lines",
        text: "4×4 board, four queens. A pair attacks if they share a row, a column, or a diagonal. Several placements work; the task is to list every one, so backtracking is the engine.",
        highlight: ["board", "c11", "c22", "c33", "c44", "n0"]
      },
      {
        title: "One queen per row, x[k] = column",
        text: "Feasible boards put exactly one queen in each row. Decision k is the column of row k. The state-space tree is n-ary, height n. Place(k, i) will prune it.",
        highlight: ["c11", "c12", "c13", "c14", "board"]
      },
      {
        title: "Q1 at column 1, Q2 at column 3 — Q3 dies",
        text: "Column 1 for Q2 is a column clash; column 2 is a diagonal with (1,1). Column 3 looks free, but every column for Q3 then clashes (column or diagonal). Kill the node, backtrack.",
        highlight: ["q1", "q2", "q3dead", "c11", "c23", "n1"],
        fail: ["q3dead", "c21", "c22", "c24", "c31", "c32", "c33", "c34"],
        hide: ["q1s", "q2s", "q3s", "q4s", "sol2", "place"],
        flows: [
          { from: "q1", to: "c11", color: "#facc15", label: "Q1" },
          { from: "q2", to: "c23", color: "#facc15", label: "Q2" }
        ]
      },
      {
        title: "Backtrack: the x[1]=1 subtree is empty",
        text: "Trying Q2 at column 4 under Q1 at column 1 also dies at Q4. Undo Q1. Column 4 for Q1 is the mirror dead end. The search has to move Q1 to column 2.",
        highlight: ["q1", "c11", "n1"],
        fail: ["q1", "q2", "q3dead"],
        hide: ["q1s", "q2s", "q3s", "q4s"],
        flows: [
          { from: "q2", to: "q1", color: "#fb923c", label: "undo" }
        ]
      },
      {
        title: "First solution (2, 4, 1, 3)",
        text: "Q1 column 2, Q2 column 4, Q3 column 1, Q4 column 3. No shared column, no |Δcol| = |Δrow|. First leaf of the DFS. Do not stop — backtracking wants every leaf.",
        highlight: ["q1s", "q2s", "q3s", "q4s", "c12", "c24", "c31", "c43", "n2"],
        hide: ["q1", "q2", "q3dead"],
        flows: [
          { from: "q1s", to: "q2s", color: "#4ade80", label: "place" },
          { from: "q2s", to: "q3s", color: "#4ade80", label: "place" },
          { from: "q3s", to: "q4s", color: "#4ade80", label: "place" }
        ]
      },
      {
        title: "Second solution (3, 1, 4, 2)",
        text: "Continue the DFS after printing. The remaining live branch is the mirror: Q1 column 3, Q2 column 1, Q3 column 4, Q4 column 2. Those two vectors are all of 4-queens.",
        highlight: ["sol2", "q1s", "n2"],
        hide: ["q1", "q2", "q3dead"],
        flows: [
          { from: "q4s", to: "sol2", color: "#60a5fa", label: "next leaf" }
        ]
      },
      {
        title: "Place(k, i) in one line",
        text: "For each earlier row j: reject if x[j] = i (column) or |x[j] − i| = |j − k| (diagonal). True means promising; false kills the node. Time stays exponential; the bound only shrinks the tree you actually draw.",
        highlight: ["place", "n3", "q3dead"],
        fail: ["q3dead"],
        hide: ["q1", "q2"],
        flows: [
          { from: "place", to: "q3dead", color: "#f87171", label: "kill" }
        ]
      }
    ]
  }
});
