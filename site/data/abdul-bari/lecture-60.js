window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 60,
  title: "4.9 Longest Common Subsequence (LCS) - Recursion and Dynamic Programming",
  video: "https://www.youtube.com/watch?v=sSno9rV8Rhg",
  category: "Dynamic Programming",
  tagline: "Match ⇒ 1+diagonal; else max(left,up). ABCDGH vs AEDFHR, LCS ADH length 3, arrows recover it.",
  summary: "A subsequence keeps order, not adjacency: CDGI is legal, a C that sits before an earlier E is not. Naive recursion on the last characters is exponential and overlaps. Memoization caches L[i][j]; tabulation fills an (m+1)×(n+1) table, zeros on the 0-row/column. Equal letters write 1+L[i-1][j-1] (diagonal arrow); otherwise max(L[i-1][j], L[i][j-1]) with an up or left arrow. ABCDGH vs AEDFHR ends at 3; following arrows prints ADH. Time Θ(mn).",

  theory: [
    {
      heading: "State: two prefixes",
      body: "X[1..m], Y[1..n]. A common subsequence is a string you can paint in both, left-to-right, skipping letters, never reordering. The lecture's first scan wrongly takes a C that sits behind an E; order is sacred, so start at a later C and collect CDGI. State L(i,j) is the LCS length of prefixes X[1..i] and Y[1..j]. Goal L(m,n). Several LCS strings can share that length.",
      bullets: [
        "Subsequence ≠ substring: gaps are allowed, order is not.",
        "Multiple LCS strings of the same length are fine; the DP returns the length first.",
        "Prefixes (i,j) uniquely name the subproblem."
      ]
    },
    {
      heading: "Recurrence",
      body: "If i=0 or j=0, L=0 (empty prefix). If X[i]=Y[j], that letter can go in the LCS: L(i,j)=1+L(i-1,j-1). If they differ, you must drop one of the two last letters: L(i,j)=max(L(i-1,j), L(i,j-1)). Recursion without a table re-asks the same (i,j) from many parents — overlapping, exponential. Memoization is top-down on that DAG. Tabulation is the exam write-up.",
      bullets: [
        "Match: take the letter, step diagonally.",
        "Mismatch: skip in X or skip in Y, take the max.",
        "Never \"take both\" on a mismatch — that would break equality."
      ]
    },
    {
      heading: "Table order",
      body: "Array L[0..m][0..n]. Seed row 0 and column 0 with 0. Then i=1..m, j=1..n — increasing prefix lengths so the diagonal, up, and left cells already exist. Store an arrow with each cell (↖ on match, ↑ or ← on a max) if you need the string, not only the length. Time and space Θ(mn); space can drop to two rows if you only need the length.",
      bullets: [
        "i outer, j inner (or the reverse — both are increasing).",
        "Arrows are reconstruction, optional for the length question.",
        "Θ(mn) vs exponential recursion is the whole point of the second half."
      ]
    },
    {
      heading: "Worked ABCDGH vs AEDFHR",
      body: "X = A B C D G H, Y = A E D F H R. First letters both A: L[1][1]=1, arrow ↖. B vs E mismatch: max of 1 and 0 stays 1. When both D's meet, L = 1+L of the previous A-match = 2. When both H's meet, L = 1+2 = 3. Bottom-right is <b>3</b>. Following ↖ on matches and the max arrows otherwise prints <b>A D H</b>. An opening example in the talk also finds CDGI in a different pair — same rule, longer string.",
      bullets: [
        "L[m][n]=3 for ABCDGH / AEDFHR.",
        "Reconstruction walks from (m,n) to (0,0) against the arrows.",
        "A match always uses the diagonal; a mismatch never does."
      ]
    },
    {
      heading: "Complexity and memoization",
      body: "The recursive tree for even short strings re-compares A[1] with B[3] and so on. Memoizing L[i][j] (sentinels, top-down) drops the work to Θ(mn) unique states. Tabulation does the same unique states in loop order. Either way the matching letters need not be consecutive. That is the last sentence of the lecture.",
      bullets: [
        "States: (m+1)(n+1), each O(1) work.",
        "Memoization = recursion + table; tabulation = table only.",
        "Order-preserving gaps are legal; reverse-order letters are not."
      ]
    }
  ],

  keyTerms: [
    { term: "Subsequence", def: "A selection of letters in increasing index order; adjacency is not required." },
    { term: "L(i,j)", def: "LCS length of X[1..i] and Y[1..j]." },
    { term: "Diagonal step", def: "On X[i]=Y[j], write 1+L[i-1][j-1] and a ↖ arrow." },
    { term: "Max of up/left", def: "On a mismatch, L[i,j]=max(L[i-1][j], L[i][j-1])." },
    { term: "Arrow walk", def: "From (m,n), ↖ emits a letter; ↑ or ← skips; stop at a zero border." },
    { term: "Θ(mn)", def: "Time of the DP table (and of memoized recursion)." }
  ],

  tradeoffs: [
    { pro: "Θ(mn) table is the standard string DP; two nested loops.", con: "Huge sequences (m,n=10^6) need Hirschberg / linear-space tricks not in this video." },
    { pro: "Arrows recover one LCS, not only the length.", con: "Ties (up=left) pick one LCS; other length-3 strings need extra bookkeeping." },
    { pro: "Memoization lets you keep the recursive function almost unchanged.", con: "Stack plus an mn table; tabulation is the safer exam code." },
    { pro: "Gaps are allowed, so CDGI can beat a contiguous mismatch.", con: "Students who require adjacency solve longest common substring, a different problem." }
  ],

  interviewTips: [
    "Define subsequence vs substring in one sentence before the recurrence.",
    "Write match: 1+diag; mismatch: max(up,left); borders 0.",
    "Fill increasing i,j; quote Θ(mn).",
    "Work ABCDGH vs AEDFHR: length 3, string ADH, ↖ on A, D, H.",
    "Say a C that appears before an earlier E is illegal even if both letters exist.",
    "To print the string, store arrows (or recompute the argmax) and walk from (m,n)."
  ],

  scene: {
    nodes: [
      { id: "xA", label: "A", type: "point", pos: [-6, 0, 6.5], color: "#4ade80" },
      { id: "xB", label: "B", type: "point", pos: [-3, 0, 6.5], color: "#60a5fa" },
      { id: "xC", label: "C", type: "point", pos: [0, 0, 6.5], color: "#60a5fa" },
      { id: "xD", label: "D", type: "point", pos: [3, 0, 6.5], color: "#4ade80" },
      { id: "xG", label: "G", type: "point", pos: [6, 0, 6.5], color: "#60a5fa" },
      { id: "xH", label: "H", type: "point", pos: [9, 0, 6.5], color: "#4ade80" },
      { id: "yA", label: "A", type: "point", pos: [-9, 0, 3.5], color: "#4ade80" },
      { id: "yE", label: "E", type: "point", pos: [-9, 0, 1], color: "#c084fc" },
      { id: "yD", label: "D", type: "point", pos: [-9, 0, -1.5], color: "#4ade80" },
      { id: "yF", label: "F", type: "point", pos: [-9, 0, -4], color: "#c084fc" },
      { id: "yH", label: "H", type: "point", pos: [-9, 0, -6.5], color: "#4ade80" },
      { id: "cA", label: "1 ↖", type: "cache", pos: [-6, 0, 3.5], color: "#4ade80", showAt: 3 },
      { id: "cB", label: "1 ←", type: "cache", pos: [-3, 0, 3.5], color: "#64748b", showAt: 4 },
      { id: "cD", label: "2 ↖", type: "cache", pos: [3, 0, -1.5], color: "#4ade80", showAt: 5 },
      { id: "cH", label: "3 ↖", type: "cache", pos: [9, 0, -6.5], color: "#facc15", showAt: 6 },
      { id: "n0", label: "order, not adjacency", type: "note", pos: [3, 0, -6.5] },
      { id: "n1", label: "C before E is illegal", type: "note", pos: [6, 0, 3.5], showAt: 1 },
      { id: "n2", label: "match: 1+diag", type: "note", pos: [6, 0, 1], showAt: 3 },
      { id: "n3", label: "mismatch: max(up,left)", type: "note", pos: [6, 0, -1.5], showAt: 4 },
      { id: "n4", label: "arrows print A D H", type: "note", pos: [3, 0, -4], showAt: 6 }
    ],
    edges: [
      { from: "xA", to: "xB" },
      { from: "xB", to: "xC" },
      { from: "xC", to: "xD" },
      { from: "xD", to: "xG" },
      { from: "xG", to: "xH" },
      { from: "yA", to: "yE" },
      { from: "yE", to: "yD" },
      { from: "yD", to: "yF" },
      { from: "yF", to: "yH" },
      { from: "cA", to: "cD", showAt: 5, dashed: true },
      { from: "cD", to: "cH", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Two strings, order kept",
        text: "X=ABCDGH along the top, Y=AEDFHR down the side. A common subsequence paints a subset of each, left-to-right. Gaps are legal. Reversing two letters is not.",
        highlight: ["xA", "xB", "xC", "xD", "xG", "xH", "yA", "yE", "yD", "yF", "yH", "n0"]
      },
      {
        title: "C cannot precede E",
        text: "If an E has already been taken, a C that sits earlier in the other string is illegal even though both letters exist. Restart at a C that follows. That is subsequence, not \"bag of letters.\"",
        highlight: ["xC", "yE", "n1"],
        fail: ["xC"]
      },
      {
        title: "State L(i,j) on prefixes",
        text: "L(i,j) = LCS of X[1..i] and Y[1..j]. Borders i=0 or j=0 are 0. Recursion on the last letters overlaps; a table keyed by (i,j) is the DAG.",
        highlight: ["xA", "yA"]
      },
      {
        title: "Match A: diagonal 1",
        text: "X[1]=Y[1]=A. Write 1+L[0][0]=1 and a ↖ arrow. That letter is in some LCS. Next cells that mismatch will copy this 1 with ← or ↑.",
        highlight: ["xA", "yA", "cA", "n2"],
        flows: [
          { from: "xA", to: "cA", color: "#4ade80", label: "A" },
          { from: "yA", to: "cA", color: "#4ade80" }
        ]
      },
      {
        title: "Mismatch B vs E: max",
        text: "B≠E, so no diagonal. L = max(up, left)=max(0,1)=1, arrow ←. You skip B (or skip E on a different cell). The length does not grow.",
        highlight: ["xB", "yE", "cB", "cA", "n3"],
        flows: [
          { from: "cA", to: "cB", color: "#60a5fa", label: "←" }
        ]
      },
      {
        title: "D matches: length 2",
        text: "Both strings have a D after the chosen A. Diagonal: 1+1=2, arrow ↖. Two letters of the LCS are now fixed in the table, not necessarily adjacent in X or Y.",
        highlight: ["xD", "yD", "cD", "cA"],
        flows: [
          { from: "cA", to: "cD", color: "#4ade80", label: "↖ D" }
        ]
      },
      {
        title: "H matches: length 3, walk arrows",
        text: "Both H's: 1+2=3, ↖. Bottom-right is 3. Walk ↖ emitting H, then D, then A (reverse the walk). LCS ADH. Θ(mn) cells, each a match or a max.",
        highlight: ["xH", "yH", "cH", "cD", "cA", "n4"],
        flows: [
          { from: "cD", to: "cH", color: "#facc15", label: "↖ H" }
        ]
      }
    ]
  }
});
