window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 50,
  title: "4.3 Matrix Chain Multiplication - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=prx1psByp7U",
  category: "Dynamic Programming",
  tagline: "Parenthesize A1..A4 on diagonals: min cost 158 with split k=3, multiply (A1(A2 A3))A4.",
  summary: "Four matrices 5×4, 4×6, 6×2, 2×7 can be multiplied in Catalan-many ways; the product is associative, the number of scalar multiplies is not. M[i,j] is the cheapest way to compute Ai..Aj. Fill the main diagonal with 0, then length-2 chains (120, 48, 84), then length 3 (88 and 104), then M[1,4]=158 at k=3. The S table stores the winning k. Time Θ(n³) to decide an order that is itself Θ(n³) to execute.",

  theory: [
    {
      heading: "State: a contiguous chain Ai..Aj",
      body: "A p×q times a q×r matrix costs p·q·r scalar multiplies and yields p×r. The lecture's chain is A1 5×4, A2 4×6, A3 6×2, A4 2×7. You cannot multiply all four in one gulp: each multiply is a pair. Different parenthesizations cost different amounts even though the numerical product is the same (associativity). The DP <b>state</b> M[i,j] is \"min scalar multiplies to compute the product Ai..Aj.\" Dimensions are stored as d0..d4 = 5,4,6,2,7 so Ai is d_{i-1}×d_i.",
      bullets: [
        "Compatible columns/rows are required; the chain is already aligned.",
        "Question is how to parenthesize, not what the product matrix is.",
        "Four matrices ⇒ five dimension numbers, indexed 0..4."
      ]
    },
    {
      heading: "Recurrence and Catalan count",
      body: "A last split after Ak: cost = M[i,k] + M[k+1,j] + d_{i-1}·d_k·d_j. Try every k from i to j-1 and keep the min. Number of full parenthesizations of n matrices is the Catalan number C_{n-1} (for 4 matrices, C_3=5 binary trees on 3 internal multiplies). DP tries those splits without rebuilding trees, because shorter chains are already in the table.",
      bullets: [
        "M[i,i]=0: one matrix, no multiply.",
        "M[i,j]=min_k M[i,k]+M[k+1,j]+d_{i-1} d_k d_j.",
        "S[i,j] records the k that won, for reconstructing parentheses."
      ]
    },
    {
      heading: "Table order: diagonals of increasing length",
      body: "Bottom-up means small chains first. Diagonal 0: four zeros. Length 2: M[1,2]=5·4·6=<b>120</b>, M[2,3]=4·6·2=<b>48</b>, M[3,4]=6·2·7=<b>84</b>. Length 3: M[1,3] compares A1|(A2 A3)=0+48+5·4·2=88 against (A1 A2)|A3=120+0+5·6·2=180, so <b>88 at k=1</b>. M[2,4] compares 0+84+4·6·7=252 against 48+0+4·2·7=104, so <b>104 at k=3</b>.",
      bullets: [
        "Fill by j−i = 0, then 1, then 2, then 3 — never the other way.",
        "Each cell scans the k's strictly inside (i,j).",
        "Length-2 cells have only one k; they are just the triple product."
      ]
    },
    {
      heading: "Worked M[1,4]=158",
      body: "Three splits. k=1: 0+104+5·4·7=244. k=2: 120+84+5·6·7=414. k=3: 88+0+5·2·7=<b>158</b>. Winning k=3 means the last multiply is (A1 A2 A3)·A4. Then S[1,3]=1 means A1·(A2 A3). The tree is: multiply A2 by A3 first (48), then A1 by that 4×2 result (40 more, total 88), then that 5×2 by A4 (70, total 158).",
      bullets: [
        "M[1,4]=158, S[1,4]=3.",
        "Recovered order: (A1 (A2 A3)) A4.",
        "The other two k values cost 244 and 414 — more than double."
      ]
    },
    {
      heading: "Complexity",
      body: "About n(n+1)/2 cells above the unused lower triangle, each trying O(n) splits: <b>Θ(n³)</b>. Actually multiplying the matrices after you know the order is also cubic in the dimensions. The DP does not multiply entries; it only counts. You can draw M as a full n×n grid with the lower triangle empty, or as the upper triangle slid into a rectangle — same numbers 0,120,88,158 / 0,48,104 / 0,84 / 0.",
      bullets: [
        "Θ(n³) to choose parentheses; the product itself is a separate cubic.",
        "Space Θ(n²) for M and S.",
        "Start from d0 so the last index matches matrix n, not n+1."
      ]
    }
  ],

  keyTerms: [
    { term: "M[i,j]", def: "Min scalar multiplies to compute the product of Ai through Aj." },
    { term: "Split k", def: "Last multiply is (Ai..Ak)·(A{k+1}..Aj); k runs i..j-1." },
    { term: "d_{i-1} d_k d_j", def: "Cost of the final multiply of those two result matrices." },
    { term: "S / k-table", def: "Argmin k at each cell, used to print parentheses." },
    { term: "Diagonal fill", def: "Process increasing chain length j−i so every split reads smaller cells." },
    { term: "Catalan C_{n-1}", def: "Number of parenthesizations of n matrices (5 when n=4)." }
  ],

  tradeoffs: [
    { pro: "Θ(n³) DP beats listing Catalan trees by hand and never drops a split.", con: "You still pay cubic time; for n=2 the answer is just the triple product." },
    { pro: "S[] reconstructs the exact multiply tree, not only the cost.", con: "Forgetting S leaves 158 with no idea which k won." },
    { pro: "Chain associativity lets you reorder for cost without changing the product.", con: "Matrix multiply is not commutative; you cannot swap A1 with A2." },
    { pro: "Upper triangle only — half the matrix is unused.", con: "Off-by-one on d0..dn is the usual indexing bug." }
  ],

  interviewTips: [
    "Say the problem is parenthesization cost, not computing the product.",
    "Write M[i,j]=min_k M[i,k]+M[k+1,j]+d_{i-1} d_k d_j with M[i,i]=0.",
    "Name the fill: increasing chain length (diagonals), never row-major of the full square.",
    "Quote 120, 48, 84 on length 2, then 88 and 104, then 158 at k=3.",
    "Recover (A1 (A2 A3)) A4 from S[1,4]=3 and S[1,3]=1.",
    "Time is Θ(n³); Catalan count is why brute force is worse."
  ],

  scene: {
    nodes: [
      { id: "a1", label: "A1 5x4", type: "cache", pos: [-9, 0, 5], color: "#60a5fa" },
      { id: "a2", label: "A2 4x6", type: "cache", pos: [-4.5, 0, 5], color: "#c084fc" },
      { id: "a3", label: "A3 6x2", type: "cache", pos: [0, 0, 5], color: "#fb923c" },
      { id: "a4", label: "A4 2x7", type: "cache", pos: [4.5, 0, 5], color: "#22d3ee" },
      { id: "m11", label: "0", type: "point", pos: [-7.5, 0, 1.5], color: "#64748b" },
      { id: "m22", label: "0", type: "point", pos: [-4.5, 0, -0.5], color: "#64748b" },
      { id: "m33", label: "0", type: "point", pos: [-1.5, 0, -2.5], color: "#64748b" },
      { id: "m44", label: "0", type: "point", pos: [1.5, 0, -4.5], color: "#64748b" },
      { id: "m12", label: "120", type: "cache", pos: [-4.5, 0, 1.5], color: "#60a5fa", showAt: 2 },
      { id: "m23", label: "48", type: "cache", pos: [-1.5, 0, -0.5], color: "#c084fc", showAt: 2 },
      { id: "m34", label: "84", type: "cache", pos: [1.5, 0, -2.5], color: "#22d3ee", showAt: 2 },
      { id: "m13", label: "88", type: "cache", pos: [-1.5, 0, 1.5], color: "#4ade80", showAt: 4 },
      { id: "m24", label: "104", type: "cache", pos: [1.5, 0, -0.5], color: "#4ade80", showAt: 4 },
      { id: "m14", label: "158", type: "cache", pos: [1.5, 0, 1.5], color: "#fb923c", showAt: 5 },
      { id: "n0", label: "d=5,4,6,2,7", type: "note", pos: [9, 0, 5] },
      { id: "n1", label: "diag 0: no multiply", type: "note", pos: [9, 0, 1.5], showAt: 1 },
      { id: "n2", label: "len 2: 120,48,84", type: "note", pos: [9, 0, -0.5], showAt: 2 },
      { id: "n3", label: "M13=88 at k=1", type: "note", pos: [9, 0, -2.5], showAt: 3 },
      { id: "n4", label: "M14=158 at k=3", type: "note", pos: [9, 0, -4.5], showAt: 5 },
      { id: "n5", label: "(A1 (A2 A3)) A4", type: "note", pos: [9, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "a1", to: "a2" },
      { from: "a2", to: "a3" },
      { from: "a3", to: "a4" },
      { from: "m23", to: "m13", showAt: 3, dashed: true },
      { from: "m13", to: "m14", showAt: 5, dashed: true },
      { from: "a4", to: "m14", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Four matrices, five dimensions",
        text: "A1 is 5×4, A2 4×6, A3 6×2, A4 2×7. Each adjacent pair is compatible. You will not multiply entries — you will count scalar multiplies for each parenthesization.",
        highlight: ["a1", "a2", "a3", "a4", "n0"]
      },
      {
        title: "Diagonal of zeros",
        text: "M[i,i]=0: a chain of one matrix needs no multiply. Fill the main diagonal first. That is chain length 1, difference j−i=0.",
        highlight: ["m11", "m22", "m33", "m44", "n1"]
      },
      {
        title: "Length-2 triples",
        text: "A1 A2 costs 5·4·6=120. A2 A3 costs 4·6·2=48. A3 A4 costs 6·2·7=84. One k each. These cells sit on the first superdiagonal.",
        highlight: ["m12", "m23", "m34", "a1", "a2", "a3", "a4", "n2"]
      },
      {
        title: "M[1,3]: two k's",
        text: "k=1: A1 | (A2 A3) = 0+48+5·4·2=88. k=2: (A1 A2)|A3 = 120+0+5·6·2=180. Keep 88, S=1. Left-looking split wins.",
        highlight: ["m13", "m23", "m12", "n3"],
        flows: [
          { from: "m23", to: "m13", color: "#4ade80", label: "+40" }
        ]
      },
      {
        title: "M[2,4]=104 at k=3",
        text: "k=2: 0+84+4·6·7=252. k=3: 48+0+4·2·7=104. Keep 104. Both length-3 cells are ready, so the full chain may be filled next.",
        highlight: ["m24", "m23", "m34"]
      },
      {
        title: "M[1,4]=158 at k=3",
        text: "k=1 → 244, k=2 → 414, k=3 → 88+0+5·2·7=158. The last multiply is (A1..A3)·A4. Upper triangle complete.",
        highlight: ["m14", "m13", "a4", "n4"],
        flows: [
          { from: "m13", to: "m14", color: "#fb923c", label: "+70" }
        ]
      },
      {
        title: "Read S for parentheses",
        text: "S[1,4]=3 splits off A4. S[1,3]=1 splits off A1. Remaining A2 A3 is a pair. Multiply tree: A2×A3, then A1×that, then ×A4. Cost 158. Θ(n³) cells×splits.",
        highlight: ["a1", "a2", "a3", "a4", "m14", "n5"],
        flows: [
          { from: "a2", to: "a3", color: "#c084fc", label: "first" },
          { from: "a1", to: "a3", color: "#60a5fa", label: "then" },
          { from: "a3", to: "a4", color: "#fb923c", label: "last" }
        ]
      }
    ]
  }
});
