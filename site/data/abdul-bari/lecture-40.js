window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 40,
  title: "3.1 Knapsack Problem - Greedy Method",
  video: "https://www.youtube.com/watch?v=oTTzNMHM05I",
  category: "Greedy Algorithms",
  tagline: "Fill a 15-kg bag by profit/weight; take 2/3 of the last item for profit 55.33.",
  summary: "Fractional knapsack is container loading with divisible goods: seven objects, profits 10,5,15,7,6,18,3 and weights 2,3,5,7,1,4,1, capacity 15. Sort by profit per kg (6, 5, 4.5, 3, 3, 5/3, 1), take full items until the bag has 2 kg left, then take 2/3 of the 3 kg item. Weight sums to 15; profit is 10+(2/3)·5+15+6+18+3 = 55.33. 0/1 knapsack forbids that fraction.",

  theory: [
    {
      heading: "The loading problem",
      body: "Seven objects sit beside a knapsack of capacity <b>M = 15</b> kg. Each object i has profit P<sub>i</sub> and weight W<sub>i</sub>. You sell whatever you carry. If total weight ≤ 15 there is nothing to decide; the interesting case is overload. Constraint: <code>Σ x<sub>i</sub> W<sub>i</sub> ≤ 15</code> with each <code>x<sub>i</sub> ∈ [0, 1]</code>. Objective: maximize <code>Σ x<sub>i</sub> P<sub>i</sub></code>. Taking one object, or stuffing everything, is a solution; only a max-profit feasible fill is optimal. This is a <b>maximization</b> problem, so greedy is a candidate.",
      bullets: [
        "Lecture numbers: P = [10, 5, 15, 7, 6, 18, 3], W = [2, 3, 5, 7, 1, 4, 1].",
        "x<sub>i</sub> = 1 means the whole object, 0 means skip, a fraction means a partial load.",
        "Vegetables and grain are the physical picture; a 7 kg washer is not."
      ]
    },
    {
      heading: "Greedy-choice logic: profit per kg",
      body: "Max-profit-first fills the bag with one heavy prize and wastes capacity. Min-weight-first packs many light objects whose profits may be tiny. The rule that actually matches the objective is <b>profit / weight</b> — rupees per kilogram. Compute P<sub>i</sub>/W<sub>i</sub> for every object, then always next-take the highest remaining density. Greedy here is not \"the first idea you had\"; it is that density order, then the include-if-it-fits loop from the introduction.",
      bullets: [
        "Densities: 5, 1.67, 3, 1, 6, 4.5, 3.",
        "Order by density: object 5, 1, 6, then 3 or 7 (tie at 3), then 2, then 4.",
        "At each stage take as much of the current object as remaining capacity allows."
      ]
    },
    {
      heading: "Worked example: sorted fill of the 15 kg bag",
      body: "Object 5 (density 6, w=1, p=6) goes in whole; 14 kg left. Object 1 (density 5, w=2, p=10) whole; 12 kg left. Object 6 (density 4.5, w=4, p=18) whole; 8 kg left. Objects 3 and 7 tie at density 3: take object 3 (w=5, p=15) whole, 3 kg left, then object 7 (w=1, p=3) whole, 2 kg left. Object 2 weighs 3 kg; only 2 kg remain, so <code>x<sub>2</sub> = 2/3</code>. Object 4 (density 1) never enters: <code>x<sub>4</sub> = 0</code>. Vector x = [1, 2/3, 1, 0, 1, 1, 1]. Check weight: 2 + 2 + 5 + 0 + 1 + 4 + 1 = 15. Profit: 10 + (2/3)·5 + 15 + 6 + 18 + 3 = <b>55⅓</b>.",
      bullets: [
        "Full objects first; the only fraction is the last density that still has room.",
        "Weight identity: Σ x<sub>i</sub> W<sub>i</sub> = 15 (the bag is tight).",
        "The board's 54.6 used 1.3 in place of 5/3; the formula on the same board is 55.33."
      ]
    },
    {
      heading: "Proof intuition",
      body: "Suppose an optimal fill used a gram of lower density while a gram of higher density was still available. Swap them: the constraint still holds (same weight) and profit strictly rises. Repeating that swap produces the density-sorted fill. Fractions are legal, so you can always swap at gram granularity — that is why greedy is optimal for the fractional problem and why it fails when x<sub>i</sub> must be 0 or 1. You never need to \"try\" object 4 once higher-density goods have filled the bag.",
      bullets: [
        "Exchange argument: replace a lower-density gram with a higher-density gram.",
        "Divisibility is what makes the swap legal.",
        "The selection rule (density) is the proof; the loop is just the construction."
      ]
    },
    {
      heading: "Complexity and 0/1 knapsack",
      body: "n densities, one sort, one scan that stops when capacity hits 0: <b>O(n log n)</b> time, O(1) extra memory beyond the arrays (or O(n) if you store x). A heap of densities is the same bound. The lecture's closing contrast: <b>0/1 knapsack</b> is the same numbers with x<sub>i</sub> ∈ {0,1} — mixer and washing machine, not potatoes. Greedy density can skip a globally better subset there; that problem waits for dynamic programming. Do not write a fraction on a 0/1 paper.",
      bullets: [
        "Fractional: sort O(n log n) + fill O(n).",
        "Output is the x-vector plus Σ xP and Σ xW.",
        "0/1 = indivisible; greedy density is a heuristic, not an algorithm with a proof."
      ]
    }
  ],

  keyTerms: [
    { term: "Knapsack / container", def: "Capacity M (here 15 kg) that loaded weight must not exceed." },
    { term: "Profit/weight", def: "Density P<sub>i</sub>/W<sub>i</sub>; the greedy key that orders objects." },
    { term: "x<sub>i</sub> in [0,1]", def: "Fraction of object i placed in the bag; 1 = all, 0 = none." },
    { term: "Feasible fill", def: "Σ x<sub>i</sub> W<sub>i</sub> ≤ M. Tight in the lecture: equality at 15." },
    { term: "Objective", def: "Maximize Σ x<sub>i</sub> P<sub>i</sub>. Worked value 55⅓." },
    { term: "Divisible goods", def: "Grain/vegetables: a 3 kg sack may contribute 2 kg." },
    { term: "0/1 knapsack", def: "Same story with x<sub>i</sub> ∈ {0,1}; greedy is not optimal." }
  ],

  tradeoffs: [
    { pro: "Density order is O(n log n) and optimal when fractions are allowed.", con: "The same order is not a proof for 0/1 knapsack." },
    { pro: "Max-profit-first and min-weight-first are easy to write.", con: "Both can lose to a medium object with better rupees per kg." },
    { pro: "Taking 2/3 of object 2 uses the last 2 kg instead of leaving them empty.", con: "If the examiner forbids fractions, that 2/3 line is worth zero." },
    { pro: "Constraint check (weight 15) and objective (profit 55.33) separate cleanly on the answer sheet.", con: "Arithmetic slips (54.6 vs 55.33) are common when 5/3 is hand-waved as 1.3." }
  ],

  interviewTips: [
    "Write constraint Σ xW ≤ 15 and objective max Σ xP before any density.",
    "Tabulate P/W: 5, 5/3, 3, 1, 6, 4.5, 3 and sort 5,1,6,3,7,2,4.",
    "Show remaining capacity after each take: 15→14→12→8→3→2→0.",
    "Box x = [1, 2/3, 1, 0, 1, 1, 1], weight 15, profit 10 + 10/3 + 15 + 6 + 18 + 3.",
    "Say the exchange argument in one sentence: swap a lower-density gram for a higher one.",
    "End with \"this is fractional; 0/1 is DP\" so they know you heard the last minute."
  ],

  scene: {
    nodes: [
      { id: "bag", label: "Bag M=15", type: "storage", pos: [0, 0, 6] },
      { id: "i5", label: "I5 p6/w1", type: "server", pos: [-9, 0, -2], color: "#4ade80" },
      { id: "i1", label: "I1 p10/w2", type: "server", pos: [-6, 0, -2], color: "#4ade80" },
      { id: "i6", label: "I6 p18/w4", type: "server", pos: [-3, 0, -2], color: "#22d3ee" },
      { id: "i3", label: "I3 p15/w5", type: "server", pos: [0, 0, -2], color: "#60a5fa" },
      { id: "i7", label: "I7 p3/w1", type: "server", pos: [3, 0, -2], color: "#60a5fa" },
      { id: "i2", label: "I2 p5/w3", type: "server", pos: [6, 0, -2], color: "#fb923c" },
      { id: "i4", label: "I4 p7/w7", type: "server", pos: [9, 0, -2], color: "#94a3b8" },
      { id: "r5", label: "r=6", type: "note", pos: [-9, 3, 1] },
      { id: "r1", label: "r=5", type: "note", pos: [-6, 3, 1] },
      { id: "r6", label: "r=4.5", type: "note", pos: [-3, 3, 1] },
      { id: "r3", label: "r=3", type: "note", pos: [0, 3, 1] },
      { id: "r7", label: "r=3", type: "note", pos: [3, 3, 1] },
      { id: "r2", label: "r=5/3", type: "note", pos: [6, 3, 1] },
      { id: "r4", label: "r=1", type: "note", pos: [9, 3, 1] },
      { id: "n0", label: "7 objects, M=15 kg", type: "note", pos: [-8, 3, 7.5] },
      { id: "n1", label: "Sort by P/W, not P", type: "note", pos: [8, 3, 7.5], showAt: 1 },
      { id: "n2", label: "Take I5,I1,I6 full", type: "note", pos: [-8, 3, -6.5], showAt: 2 },
      { id: "n3", label: "x2=2/3, skip I4", type: "note", pos: [8, 3, -6.5], showAt: 4 },
      { id: "n4", label: "W=15, P=55.33", type: "note", pos: [0, 3, -6.5], showAt: 5 }
    ],
    edges: [
      { from: "i5", to: "bag", showAt: 2 },
      { from: "i1", to: "bag", showAt: 2 },
      { from: "i6", to: "bag", showAt: 3 },
      { from: "i3", to: "bag", showAt: 3 },
      { from: "i7", to: "bag", showAt: 4 },
      { from: "i2", to: "bag", dashed: true, label: "2/3", showAt: 4 }
    ],
    steps: [
      {
        title: "Seven objects, one 15 kg bag",
        text: "Profits 10,5,15,7,6,18,3 and weights 2,3,5,7,1,4,1. Total weight exceeds 15, so packing is an optimization problem: maximize profit without overflowing the container.",
        highlight: ["bag", "i1", "i2", "i3", "i4", "i5", "i6", "i7", "n0"]
      },
      {
        title: "Densities, left to right",
        text: "P/W is 6, 5, 4.5, 3, 3, 5/3, 1 once the objects are lined up as I5, I1, I6, I3, I7, I2, I4. Max-profit-first or min-weight-first would reorder this line and can lose rupees per kg.",
        highlight: ["r5", "r1", "r6", "r3", "r7", "r2", "r4", "n1", "i5"]
      },
      {
        title: "I5 then I1 — remaining 12 kg",
        text: "Highest density is I5 (6/1). Whole object, remaining 14. Next is I1 (10/2). Whole object, remaining 12. Greedy has not looked at I4's raw profit 7.",
        highlight: ["i5", "i1", "bag", "n2", "r5", "r1"],
        flows: [
          { from: "i5", to: "bag", color: "#4ade80", label: "w1, 14 left" },
          { from: "i1", to: "bag", color: "#4ade80", label: "w2, 12 left" }
        ]
      },
      {
        title: "I6 and I3 — remaining 3 kg",
        text: "I6 (18/4) fills 4 kg, remaining 8. I3 and I7 tie at density 3; take I3's 5 kg, remaining 3. Still no fraction.",
        highlight: ["i6", "i3", "bag", "n2", "r6", "r3"],
        hide: ["n0"],
        flows: [
          { from: "i6", to: "bag", color: "#22d3ee", label: "w4, 8 left" },
          { from: "i3", to: "bag", color: "#60a5fa", label: "w5, 3 left" }
        ]
      },
      {
        title: "I7 whole, then 2/3 of I2",
        text: "I7 uses 1 kg, remaining 2. I2 needs 3 kg, so x2=2/3. I4 (density 1) is left out. Sorted items plus one fraction is the entire algorithm.",
        highlight: ["i7", "i2", "i4", "bag", "n3"],
        fail: ["i4"],
        hide: ["n0", "n1"],
        flows: [
          { from: "i7", to: "bag", color: "#60a5fa", label: "w1, 2 left" },
          { from: "i2", to: "bag", color: "#fb923c", label: "2/3" }
        ]
      },
      {
        title: "Feasible and optimal numbers",
        text: "x=[1, 2/3, 1, 0, 1, 1, 1]. Weight 2+2+5+1+4+1=15. Profit 10+10/3+15+6+18+3=55.33. Constraint holds; objective is the density-greedy maximum.",
        highlight: ["bag", "n4", "i5", "i1", "i6", "i3", "i7", "i2"],
        fail: ["i4"],
        hide: ["n0"]
      },
      {
        title: "Why density, not profit",
        text: "An exchange of one gram of I4 (r=1) for one gram of I5 (r=6) would raise profit at equal weight. That swap is legal only because goods are divisible — the proof intuition in one move.",
        highlight: ["i5", "i4", "r5", "r4", "n4"],
        fail: ["i4"],
        hide: ["n0", "n2"]
      },
      {
        title: "Stop: 0/1 is a different problem",
        text: "A washing machine cannot contribute 2/3. If x must be 0 or 1, this fill is illegal and DP (or brute subsets) replaces the scan. Same P,W,M; different feasible set.",
        highlight: ["i2", "n3", "bag"],
        fail: ["i4"],
        hide: ["n0", "n1"]
      }
    ]
  }
});
