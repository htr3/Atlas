window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 54,
  title: "4.5 0/1 Knapsack - Two Methods - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=nLmhmB6NzcM",
  category: "Dynamic Programming",
  tagline: "V[i][w]=max(skip, take); four items, M=8, table 8 with x=(0,1,0,1) profit 8.",
  summary: "Items are atomic (mixer, oven): x_i ∈ {0,1}, maximize profit under capacity 8. Four objects, profits 1,2,5,6 and weights 2,3,4,5. 2^4 subsets exist; DP fills a (n+1)×(M+1) table instead. V[i][w]=max(V[i-1][w], V[i-1][w−w_i]+p_i). Bottom-right 8 traces to items 2 and 4. The set method builds ordered pairs (profit, weight), drops dominated and overweight pairs, and traces the same 0-1-0-1.",

  theory: [
    {
      heading: "State: first i items, capacity w",
      body: "A bag of capacity M=8 and four indivisible objects. Profits 1,2,5,6; weights 2,3,4,5. Total weight 14>8 so you cannot take everything. x_i is 0 or 1 — no 2/3 of a mixer (that was fractional greedy). Objective: max Σ x_i p_i s.t. Σ x_i w_i ≤ 8. DP state V[i][w] is the best profit using a subset of objects 1..i that fits in capacity w. Rows add one object; columns grow remaining capacity from 0 to 8.",
      bullets: [
        "0/1: whole object or none.",
        "Sequence of decisions: include i or skip i, usually from the last object backward when tracing.",
        "2^n subsets; n=4 is 16, n=40 is not."
      ]
    },
    {
      heading: "Recurrence",
      body: "If i=0 or w=0, profit is 0. If w_i > w you cannot take i, so V[i][w]=V[i-1][w]. Else <code>V[i][w] = max( V[i-1][w],  V[i-1][w−w_i] + p_i )</code> — skip versus take. Fill row i from left to right using only row i−1. That is bottom-up tabulation. Time Θ(nM), space Θ(nM) (or two rows).",
      bullets: [
        "Skip copy: same column, previous row.",
        "Take: jump left by w_i on the previous row, add p_i.",
        "Negative column (w−w_i<0) is undefined — treat as skip."
      ]
    },
    {
      heading: "Worked table",
      body: "Row 0 is zeros. Row 1 (weight 2, profit 1): columns 0–1 stay 0, columns 2–8 are 1. Row 2 (3,2): column 3 becomes 2, column 5 becomes 3 (both items). Row 3 (4,5): column 4 becomes 5, column 6 becomes 6, column 7 becomes 7. Row 4 (5,6): column 5 becomes 6; column 8 is max(7, V[3][3]+6)=max(7,2+6)=<b>8</b>. Direct fill without the formula: at capacity 8, items 4 and 2 (5+3) give 6+2=8.",
      bullets: [
        "V[4][8]=8 is the optimum profit.",
        "V[4][7]=7, V[4][5]=6 — the take/skip max at work.",
        "You can fill a row by the formula or by listing feasible subsets of {1..i} that fit w."
      ]
    },
    {
      heading: "Trace x = (0,1,0,1)",
      body: "Start at V[4][8]=8. Row 3's column 8 is 7, not 8, so object 4 was taken. Remaining profit 8−6=2, remaining capacity 8−5=3. V[3][3]=2 equals V[2][3], so object 3 was skipped. V[2][3]=2 is not in row 1, so object 2 was taken. Remaining 0. Object 1 skipped. Solution x2=x4=1, profit 8, weight 3+5=8.",
      bullets: [
        "Equal to the cell above ⇒ skip this object.",
        "Different ⇒ take it, subtract p_i and w_i.",
        "Walk i from n down to 1."
      ]
    },
    {
      heading: "Set method and dominance",
      body: "S0={(0,0)}. Including object 1 adds (1,2); merge to S1={(0,0),(1,2)}. Object 2 adds (2,3) and (3,5). Object 3 adds pairs including (5,4); (3,5) is dominated because (5,4) has more profit at less weight — drop the worse pair (dominance). Pairs with weight>8 are infeasible. Final S4's best pair is (8,8). Trace membership backward: (8,8) not in S3 ⇒ take 4; leftover (2,3) is in S2 not S1 ⇒ take 2. Same 0-1-0-1. Time still exponential in the worst case (up to 2^n pairs) but dominance prunes.",
      bullets: [
        "Ordered pair = (profit, weight).",
        "Dominance: higher profit must not come with a smaller weight than a cheaper pair — drop the expensive weak one.",
        "Tabulation is Θ(nM); sets are the \"try all subsets\" picture with pruning."
      ]
    }
  ],

  keyTerms: [
    { term: "V[i][w]", def: "Best profit from items 1..i with knapsack capacity w." },
    { term: "Take vs skip", def: "max(V[i-1][w], V[i-1][w−w_i]+p_i) when w_i ≤ w." },
    { term: "0/1", def: "x_i ∈ {0,1}; objects are not cut (contrast fractional knapsack)." },
    { term: "Trace", def: "From V[n][M], compare with the cell above to decide x_n, then subtract." },
    { term: "Dominance rule", def: "In the set method, discard a pair that has less profit and more (or equal) weight than another." },
    { term: "Θ(nM)", def: "Table time; pseudo-polynomial in the numeric capacity M." }
  ],

  tradeoffs: [
    { pro: "Table is Θ(nM) and easy to code as two nested loops.", con: "M=10^9 makes the table impossible; that is why it is called pseudo-polynomial." },
    { pro: "Set method shows the 2^n subsets and prunes with dominance.", con: "Worst case still exponential; exams usually want the table." },
    { pro: "Trace recovers the actual items, not only the 8.", con: "People stop at V[n][M] and fail the \"which objects?\" follow-up." },
    { pro: "0/1 is the right model for solid objects.", con: "If goods are divisible, greedy density from the earlier lecture is faster and optimal." }
  ],

  interviewTips: [
    "State x_i ∈ {0,1} and contrast fractional knapsack (greedy) with 0/1 (DP).",
    "Write V[i][w]=max(skip, take) and seed row 0 / column 0 with 0.",
    "Fill by increasing i, then w=0..M.",
    "Quote the instance: p=1,2,5,6 w=2,3,4,5 M=8, V[4][8]=8, x=0101.",
    "Trace: 8≠7 above so take item 4; leftover 2 sits in row 2, take item 2.",
    "Name dominance if they ask about the pair/set method."
  ],

  scene: {
    nodes: [
      { id: "i1", label: "p1 w2", type: "cache", pos: [-10, 0, 6], color: "#60a5fa" },
      { id: "i2", label: "p2 w3", type: "cache", pos: [-6.5, 0, 6], color: "#c084fc" },
      { id: "i3", label: "p5 w4", type: "cache", pos: [-3, 0, 6], color: "#fb923c" },
      { id: "i4", label: "p6 w5", type: "cache", pos: [0.5, 0, 6], color: "#4ade80" },
      { id: "bag", label: "M=8", type: "point", pos: [5, 0, 6], color: "#facc15" },
      { id: "r0", label: "row0: 0", type: "note", pos: [-10, 0, 3] },
      { id: "c3", label: "V2,3=2", type: "cache", pos: [-6.5, 0, 1], color: "#c084fc", showAt: 2 },
      { id: "c5", label: "V2,5=3", type: "cache", pos: [-2, 0, 1], color: "#c084fc", showAt: 2 },
      { id: "c4", label: "V3,4=5", type: "cache", pos: [-6.5, 0, -2], color: "#fb923c", showAt: 3 },
      { id: "c7", label: "V3,7=7", type: "cache", pos: [-2, 0, -2], color: "#fb923c", showAt: 3 },
      { id: "c8", label: "V3,8=7", type: "cache", pos: [2.5, 0, -2], color: "#fb923c", showAt: 3 },
      { id: "opt", label: "V4,8=8", type: "cache", pos: [2.5, 0, -5], color: "#4ade80", showAt: 4 },
      { id: "x2", label: "x2=1", type: "point", pos: [-6.5, 0, -5], color: "#c084fc", showAt: 5 },
      { id: "x4", label: "x4=1", type: "point", pos: [0.5, 0, -5], color: "#4ade80", showAt: 5 },
      { id: "n0", label: "x in {0,1}, 2^n subsets", type: "note", pos: [9, 0, 6] },
      { id: "n1", label: "max(skip, take)", type: "note", pos: [9, 0, 1], showAt: 1 },
      { id: "n2", label: "8≠7 above ⇒ take 4", type: "note", pos: [9, 0, -2], showAt: 4 },
      { id: "n3", label: "x=0,1,0,1 profit 8", type: "note", pos: [9, 0, -5], showAt: 5 },
      { id: "n4", label: "sets: (8,8) best pair", type: "note", pos: [9, 0, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "i1", to: "bag", dashed: true },
      { from: "c8", to: "opt", showAt: 4, dashed: true },
      { from: "opt", to: "x4", showAt: 5 },
      { from: "opt", to: "x2", showAt: 5 }
    ],
    steps: [
      {
        title: "Four solid objects, M=8",
        text: "Profits 1,2,5,6 weights 2,3,4,5. You cannot take a fraction. 16 subsets exist; some exceed 8 kg. State is (how many first i items, leftover capacity w).",
        highlight: ["i1", "i2", "i3", "i4", "bag", "n0"]
      },
      {
        title: "Skip or take",
        text: "V[i][w]=max(V[i-1][w], V[i-1][w−w_i]+p_i) when it fits. Row 0 and column 0 are 0. Fill increasing i, then w. That is the table recurrence.",
        highlight: ["r0", "n1", "i1"]
      },
      {
        title: "Row 2: 2 at w=3, 3 at w=5",
        text: "Object 2 (p=2,w=3) first fits at column 3. At column 5 both of the first two objects fit: 1+2=3. Those cells are reused when later rows take or skip.",
        highlight: ["c3", "c5", "i1", "i2"]
      },
      {
        title: "Row 3 adds the p=5 item",
        text: "Weight 4, profit 5. Column 4 becomes 5. Column 7 can hold objects 2 and 3 (3+4) for profit 7. Column 8 is still 7 — object 1+2+3 weights 9.",
        highlight: ["c4", "c7", "c8", "i3"]
      },
      {
        title: "V[4][8]=max(7,2+6)=8",
        text: "Object 4 (p=6,w=5). Skip would copy 7. Take uses V[3][3]+6=2+6=8. Write 8. Optimum profit sits in the bottom-right cell.",
        highlight: ["opt", "c8", "c3", "i4", "n2"],
        flows: [
          { from: "c8", to: "opt", color: "#fb923c", label: "skip 7" },
          { from: "i4", to: "opt", color: "#4ade80", label: "take 8" }
        ]
      },
      {
        title: "Trace 8 ≠ 7",
        text: "Cell above is 7, not 8, so x4=1. Subtract 6 profit and 5 weight. Leftover 2 at capacity 3 matches row 2 not row 1, so x2=1, x3=0, x1=0. Weight 8, profit 8.",
        highlight: ["opt", "x2", "x4", "i2", "i4", "n3"],
        flows: [
          { from: "opt", to: "x4", color: "#4ade80", label: "take" },
          { from: "opt", to: "x2", color: "#c084fc", label: "take" }
        ]
      },
      {
        title: "Set method, same answer",
        text: "Pairs (profit,weight) grow by adding each object. Drop weight>8 and dominated pairs (more weight, less profit). Best surviving pair is (8,8). Backward membership gives the same 0-1-0-1.",
        highlight: ["n4", "opt", "x2", "x4"]
      }
    ]
  }
});
