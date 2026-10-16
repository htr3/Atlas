window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 51,
  title: "[New] Matrix Chain Multiplication using Dynamic Programming Formula",
  video: "https://www.youtube.com/watch?v=_WncuhSJZyA",
  category: "Dynamic Programming",
  tagline: "Derive C(i,j) from three matrices, then fill diagonals: 24,16,40 → 28,36 → 58 at k=3.",
  summary: "A remake that starts from two 2×3 and 3×2 matrices (12 scalar multiplies, result 2×2) and builds the formula on a three-matrix chain whose two parenthesizations cost 40 vs 36. C(i,j)=min over k=i..j-1 of C(i,k)+C(k+1,j)+d_{i-1} d_k d_j. Expanding C(1,4) too early explodes; fill by increasing j−i instead. Four matrices with d=(3,2,4,2,5) finish at 58 with k-table 1,2,3 / 1,3 / 3, recovering A1(A2 A3)A4.",

  theory: [
    {
      heading: "State and the three facts about one multiply",
      body: "Two matrices multiply only when columns of the first equal rows of the second. The result takes the outer dimensions. Scalar work is the product of all three numbers: 2×3 times 3×2 is 2·3·2=<b>12</b> multiplies, result 2×2. Two matrices expose three distinct dimension values because the shared inner size is written twice. That triple is the cost term you will add at every DP split.",
      bullets: [
        "Inner dimensions must match or the pair is illegal.",
        "Result is (rows of left)×(cols of right).",
        "Cost of one multiply = that triple product."
      ]
    },
    {
      heading: "Why parenthesization matters: 40 vs 36",
      body: "A1 2×3, A2 3×4, A3 4×2 (d0..d3 = 2,3,4,2). (A1 A2)A3: 2·3·4=24, then 2×4 times 4×2 costs 16, total <b>40</b>. A1(A2 A3): A2 A3 costs 3·4·2=24, then 2×3 times 3×2 costs 12, total <b>36</b>. Same product, different work. Ten matrices make the gap huge. Associativity saves the answer; it does not save the flop count. DP's job is the cheapest split pattern.",
      bullets: [
        "Three matrices: two legal binary trees, costs 40 and 36.",
        "36 wins: multiply A2 A3 first.",
        "n=10 is not something you parenthesize by eye."
      ]
    },
    {
      heading: "Recurrence, derived from those two trees",
      body: "Write C(1,3) as C(1,k)+C(k+1,3)+d0·d_k·d3. k=1 is 0+24+2·3·2; k=2 is 24+0+2·4·2. In general <code>C(i,j)=min_{k=i}^{j-1} C(i,k)+C(k+1,j)+d_{i-1} d_k d_j</code>. k is the last matrix on the left factor. Four matrices (Catalan C_3=5 trees, formula (2(n-1) choose n-1)/n) expand C(1,4) into C(2,4), C(1,2), C(3,4)… — a recursive explosion. So do not start at (1,n).",
      bullets: [
        "k runs from i to j−1, never equal to j.",
        "C(i,i)=0 because no k exists (k≥i and k<i).",
        "Catalan: 4 matrices → 5 trees; 5 matrices → 14."
      ]
    },
    {
      heading: "Table order: difference 0,1,2,3",
      body: "Solve where j−i is 0, then 1, then 2, then 3. Overlap: C(3,4) appears in several larger expansions — compute it once. New example: four matrices, d=(3,2,4,2,5). Length 2: C(1,2)=3·2·4=<b>24</b> (k=1), C(2,3)=2·4·2=<b>16</b> (k=2), C(3,4)=4·2·5=<b>40</b> (k=3). Length 3: C(1,3) is min(0+16+3·2·2, 24+0+3·4·2)=min(28,48)=<b>28 at k=1</b>. C(2,4)=min(0+40+2·4·5, 16+0+2·2·5)=min(80,36)=<b>36 at k=3</b>.",
      bullets: [
        "Increasing j−i is the only safe evaluation order.",
        "K-table stores the winning k beside each C cell.",
        "Length-2 cells match the triple product; K=i."
      ]
    },
    {
      heading: "C(1,4)=58 and the multiply tree",
      body: "k=1: 0+36+3·2·5=66. k=2: 24+40+3·4·5=124. k=3: 28+0+3·2·5=<b>58</b>. Winner k=3. K[1,3]=1 splits A1 off the left triple, so A2 A3 are a pair. Parentheses: <b>A1 (A2 A3) A4</b> — multiply A2×A3, then A1 times that result, then times A4. Other splits cost 66 or 124, more than double. Cells: n(n+1)/2, each O(n) k's, upper bound <b>O(n³)</b> (k is not always n).",
      bullets: [
        "Optimum 58 vs 124 if you pick the worst k.",
        "K[1,4]=3, K[1,3]=1, K[2,3]=2.",
        "O(n³) is an upper bound; detailed sum of k-ranges is a bit less."
      ]
    }
  ],

  keyTerms: [
    { term: "C(i,j)", def: "Min multiply cost for Ai..Aj; same as M[i,j] in the previous lecture, derived from a 3-matrix example." },
    { term: "d_{i-1}, d_k, d_j", def: "The three dimensions of the final multiply at split k." },
    { term: "K-table", def: "Winning k at each (i,j); textbooks often name it S." },
    { term: "Difference order", def: "Compute all cells with j−i=0, then 1, then 2… so every split is already filled." },
    { term: "Catalan (2n−2 choose n−1)/n", def: "Trees for n matrices; 5 when n=4, 14 when n=5." },
    { term: "Dominance of 58 vs 124", def: "The point of the DP: a bad split more than doubles the flops." }
  ],

  tradeoffs: [
    { pro: "Deriving C from 40 vs 36 makes the three-term formula memorable the night before an exam.", con: "Starting C(1,n) recursively without a table reopens the Catalan explosion." },
    { pro: "Difference order guarantees every needed C(i,k) exists.", con: "Row-major fill of the square reads empty cells above the diagonal." },
    { pro: "K-table reconstructs the unique (up to ties) tree from one integer per cell.", con: "Cost-only tables cannot answer \"which two matrices first?\"" },
    { pro: "O(n³) upper bound is what you write; k-ranges are shorter on short diagonals.", con: "Still cubic — not a reason to skip the DP for n=10." }
  ],

  interviewTips: [
    "Open with 2×3 times 3×2 = 12 multiplies, then 40 vs 36 on three matrices.",
    "Write C(i,j)=min_k C(i,k)+C(k+1,j)+d_{i-1} d_k d_j, k=i..j-1.",
    "Refuse to expand C(1,4) first; say j−i = 0,1,2,3.",
    "Quote this example: 24,16,40 then 28,36 then 58 at k=3.",
    "Parenthesize A1(A2 A3)A4 from the K-table, not from the cost 58 alone.",
    "Catalan 5/14 is the brute-force count you are avoiding."
  ],

  scene: {
    nodes: [
      { id: "b1", label: "A1 3x2", type: "cache", pos: [-9, 0, 5.5], color: "#60a5fa" },
      { id: "b2", label: "A2 2x4", type: "cache", pos: [-4.5, 0, 5.5], color: "#c084fc" },
      { id: "b3", label: "A3 4x2", type: "cache", pos: [0, 0, 5.5], color: "#fb923c" },
      { id: "b4", label: "A4 2x5", type: "cache", pos: [4.5, 0, 5.5], color: "#22d3ee" },
      { id: "c12", label: "24 k=1", type: "cache", pos: [-6.5, 0, 2], color: "#60a5fa", showAt: 3 },
      { id: "c23", label: "16 k=2", type: "cache", pos: [-2, 0, 2], color: "#c084fc", showAt: 3 },
      { id: "c34", label: "40 k=3", type: "cache", pos: [2.5, 0, 2], color: "#fb923c", showAt: 3 },
      { id: "c13", label: "28 k=1", type: "cache", pos: [-4.5, 0, -1.2], color: "#4ade80", showAt: 4 },
      { id: "c24", label: "36 k=3", type: "cache", pos: [0.5, 0, -1.2], color: "#4ade80", showAt: 4 },
      { id: "c14", label: "58 k=3", type: "cache", pos: [-2, 0, -4.2], color: "#facc15", showAt: 5 },
      { id: "k14", label: "K14=3", type: "point", pos: [4, 0, -4.2], color: "#facc15", showAt: 6 },
      { id: "n0", label: "2x3 · 3x2 = 12", type: "note", pos: [9, 0, 5.5] },
      { id: "n1", label: "3 mats: 40 vs 36", type: "note", pos: [9, 0, 2], showAt: 1 },
      { id: "n2", label: "C(i,k)+C(k+1,j)+d", type: "note", pos: [9, 0, -1.2], showAt: 2 },
      { id: "n3", label: "j-i = 0,1,2,3", type: "note", pos: [9, 0, -4.2], showAt: 3 },
      { id: "n4", label: "A1 (A2 A3) A4", type: "note", pos: [9, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "b1", to: "b2" },
      { from: "b2", to: "b3" },
      { from: "b3", to: "b4" },
      { from: "c23", to: "c13", showAt: 4, dashed: true },
      { from: "c13", to: "c14", showAt: 5, dashed: true },
      { from: "c14", to: "k14", showAt: 6 }
    ],
    steps: [
      {
        title: "One multiply is a triple",
        text: "2×3 times 3×2: inner 3 matches, result 2×2, 2·3·2=12 scalar multiplies. Two matrices contribute three dimension numbers. That triple will be the +d term in every DP split.",
        highlight: ["n0", "b1", "b2"]
      },
      {
        title: "Three matrices, 40 vs 36",
        text: "(A1 A2)A3 costs 24+16=40. A1(A2 A3) costs 24+12=36. Same product, different work. The cheaper tree multiplies A2 A3 first. Ten matrices make this gap serious.",
        highlight: ["b1", "b2", "b3", "n1"]
      },
      {
        title: "Formula from those two k's",
        text: "C(i,j) is min over k of left chain + right chain + d_{i-1}·d_k·d_j. k is the last index of the left factor. Expanding C(1,4) before the short chains is a recursive tree you do not want to walk.",
        highlight: ["n2", "b1", "b4"]
      },
      {
        title: "Length 2 on d=3,2,4,2,5",
        text: "C(1,2)=3·2·4=24, C(2,3)=2·4·2=16, C(3,4)=4·2·5=40. Difference j−i=1. K equals i on each of these cells. Base diagonal is already 0.",
        highlight: ["c12", "c23", "c34", "n3", "b1", "b2", "b3", "b4"]
      },
      {
        title: "Length 3: 28 and 36",
        text: "C(1,3)=min(16+12, 24+24)=28 at k=1. C(2,4)=min(40+40, 16+20)=36 at k=3. Both length-3 answers are now table lookups for the full chain.",
        highlight: ["c13", "c24", "c23", "c12"],
        flows: [
          { from: "c23", to: "c13", color: "#4ade80", label: "k=1" }
        ]
      },
      {
        title: "C(1,4)=58 at k=3",
        text: "k=1 → 36+30=66. k=2 → 24+40+60=124. k=3 → 28+30=58. Keep 58. A bad split (k=2) more than doubles the work.",
        highlight: ["c14", "c13", "c24"],
        flows: [
          { from: "c13", to: "c14", color: "#facc15", label: "+30" }
        ]
      },
      {
        title: "K-table prints the tree",
        text: "K[1,4]=3 so A4 sits on the right of the last multiply. K[1,3]=1 so A1 sits alone on the left of the triple. Remaining A2 A3. Order: A2×A3, then A1×that, then ×A4. O(n³) upper bound.",
        highlight: ["k14", "c14", "b1", "b2", "b3", "b4", "n4"],
        flows: [
          { from: "b2", to: "b3", color: "#c084fc", label: "first" },
          { from: "b1", to: "c14", color: "#60a5fa", label: "then" },
          { from: "b4", to: "c14", color: "#22d3ee", label: "last" }
        ]
      }
    ]
  }
});
