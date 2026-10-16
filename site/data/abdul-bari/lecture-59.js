window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 59,
  title: "4.8 Reliability Design - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=uJOmqBwENB8",
  category: "Dynamic Programming",
  tagline: "Parallel copies: 1-(1-r)^m per stage. Budget $105 → (1,2,2) copies, reliability 0.648, cost $100.",
  summary: "A series system of devices D1,D2,D3 with reliabilities 0.9, 0.8, 0.5 and costs $30, $15, $20 must all work, so one copy each yields 0.9·0.8·0.5=0.36. Parallel replicas at a stage raise that stage to 1-(1-r)^m. Budget C=105, one of each is $65, leftover $40 caps copies at 2,3,3. The knapsack-style set DP on (reliability, cost) pairs, with dominance and a leftover-for-later-devices cutoff, picks one D1, two D2, two D3: reliability 0.648 at $100.",

  theory: [
    {
      heading: "State: stage copies under a leftover budget",
      body: "Devices in series: the product of reliabilities is the system reliability. Four 0.9 devices already drop to 0.9^4≈0.656 (35% chance the studio session dies). Fix: put m_i copies of device i in parallel; the stage works unless every replica fails. State for the DP is an ordered pair <b>(R, cost)</b> after deciding how many copies of the first i device types, with cost ≤ C. The lecture's instance uses three devices.",
      bullets: [
        "Series: multiply stage reliabilities.",
        "Parallel at a stage: 1 − (1−r_i)^{m_i}.",
        "Must buy at least one of each type (the system needs every stage)."
      ]
    },
    {
      heading: "Stage reliability and upper bounds",
      body: "One copy of r=0.9 fails with 0.1; three copies fail with 0.1^3=0.001, so the stage is 0.999. Costs 30,15,20, budget 105. One of each is 65, leftover 40. Upper bound u_i = 1 + floor(leftover / c_i) ⇒ u=(2,3,3). You will never try 3 copies of the $30 device. That bound is the analogue of knapsack capacity for each item type.",
      bullets: [
        "u1=2, u2=3, u3=3 on this instance.",
        "Stage formula φ(m)=1-(1-r)^m.",
        "Leftover 40 is not a private stash per device — it is shared."
      ]
    },
    {
      heading: "Recurrence as set growth (knapsack pairs)",
      body: "S0={(1, $0)} — empty system, reliability 1 so later products are not zero. Considering D1: one copy → (0.9, 30); two copies → (0.99, 60). Merge to S1. For D2, each surviving pair is multiplied by φ(m2) and adds m2·15, for m2=1,2,3, then discard if the cost leaves too little money for a later device (or exceeds 105). Dominance: if R increases while cost decreases, drop the more expensive weaker pair (same rule as 0/1 knapsack sets).",
      bullets: [
        "New pair: (R_old · φ(m), cost_old + m·c_i).",
        "Infeasible: cost > C, or leftover < min later-device cost.",
        "Dominance: more cost, less (or equal) reliability → delete."
      ]
    },
    {
      heading: "Worked pairs",
      body: "S1 = {(0.9,30), (0.99,60)}. D2 one copy: (0.72,45), (0.792,75). Two copies φ=0.96: (0.864,60), (0.9504,90) but $90 leaves $15 and D3 costs $20 — drop (0.9504,90). Three copies φ=0.992: (0.8928,75), (1.05-over). Dominance then drops (0.792,75) because (0.864,60) is better R at lower cost. Survivors include (0.72,45), (0.864,60), (0.8928,75).",
      bullets: [
        "Always check remaining budget before multiplying R.",
        "(0.792,75) loses to (0.864,60) by dominance.",
        "Three D2 copies at $45+45 need a cheap D1 pairing to stay feasible."
      ]
    },
    {
      heading: "Allocate (1,2,2), R=0.648, $100",
      body: "D3 one copy (r=0.5, $20) and two copies (φ=0.75, $40) and three (φ=0.875, $60) spawn more pairs. After feasibility and dominance the best is <b>0.648 at $100</b>. Tracing membership: that pair came from two copies of D3, times a D2 pair that itself used two copies, times one copy of D1. Allocation m=(1,2,2). Cost 30+30+40=100. Single-copy series would have been 0.9·0.8·0.5=0.36 — the replicas nearly doubled reliability.",
      bullets: [
        "Answer: one D1, two D2, two D3.",
        "0.648 at $100, under the $105 cap.",
        "Same DP shape as knapsack sets; the value is a product, not a sum."
      ]
    }
  ],

  keyTerms: [
    { term: "Series reliability", def: "Product of stage reliabilities; any stage failure kills the system." },
    { term: "Parallel stage", def: "m copies: 1-(1-r)^m, the chance at least one replica works." },
    { term: "Upper bound u_i", def: "1+floor((C−Σ c_j)/c_i); max copies of i if the leftover is spent only on i." },
    { term: "(R, cost) pair", def: "DP object after the first i device types have been chosen." },
    { term: "Dominance", def: "Drop a pair that costs more and is no more reliable than another." },
    { term: "Allocation (1,2,2)", def: "Copies of D1,D2,D3 in the lecture's optimum." }
  ],

  tradeoffs: [
    { pro: "Parallel copies raise a weak 0.5 stage to 0.75 (two) or 0.875 (three).", con: "Every extra copy spends budget another device might have used better." },
    { pro: "Set DP reuses the knapsack dominance you already know.", con: "Pair count can grow exponentially in the number of stages if you skip pruning." },
    { pro: "Upper bounds cap the inner m-loop at 2–3 here, not infinity.", con: "Cheap devices with large leftover still produce a wide m range." },
    { pro: "Traceable allocation, not just a reliability number.", con: "Arithmetic is messy (0.8928…); exams want the copy vector more than six decimals." }
  ],

  interviewTips: [
    "Draw series stages, then parallel boxes inside a stage, before any formula.",
    "Write stage reliability 1-(1-r)^m and system reliability as the product.",
    "Compute leftover = C−Σc_i and u_i=1+floor(leftover/c_i).",
    "Say the DP is knapsack sets of (R,cost) with dominance and a leftover cutoff.",
    "Quote (1,2,2), $100, R≈0.648 vs 0.36 with one copy each.",
    "Name why (0.792,75) dies: dominated by (0.864,60)."
  ],

  scene: {
    nodes: [
      { id: "d1a", label: "D1 0.9 $30", type: "cache", pos: [-8, 0, 4], color: "#60a5fa" },
      { id: "d1b", label: "D1 spare", type: "cache", pos: [-8, 0, 1], color: "#60a5fa", showAt: 2 },
      { id: "d2a", label: "D2 0.8 $15", type: "cache", pos: [-1.5, 0, 4], color: "#c084fc" },
      { id: "d2b", label: "D2 spare", type: "cache", pos: [-1.5, 0, 1], color: "#c084fc", showAt: 5 },
      { id: "d2c", label: "D2 3rd", type: "cache", pos: [-1.5, 0, -2], color: "#64748b", showAt: 3 },
      { id: "d3a", label: "D3 0.5 $20", type: "cache", pos: [5, 0, 4], color: "#fb923c" },
      { id: "d3b", label: "D3 spare", type: "cache", pos: [5, 0, 1], color: "#fb923c", showAt: 5 },
      { id: "sys", label: "R=0.36 series", type: "point", pos: [5, 0, -5], color: "#f87171" },
      { id: "best", label: "0.648 @ $100", type: "cache", pos: [-1.5, 0, -5], color: "#4ade80", showAt: 5 },
      { id: "n0", label: "series product", type: "note", pos: [-8, 0, 7] },
      { id: "n1", label: "1-(1-0.9)^3=0.999", type: "note", pos: [5, 0, 7], showAt: 1 },
      { id: "n2", label: "C=105, u=(2,3,3)", type: "note", pos: [-8, 0, -5], showAt: 2 },
      { id: "n3", label: "drop (0.95,90) leftover 15", type: "note", pos: [5, 0, -2], showAt: 3 },
      { id: "n4", label: "dominate 0.792@$75", type: "note", pos: [-8, 0, -2], showAt: 4 },
      { id: "n5", label: "m=(1,2,2) copies", type: "note", pos: [5, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "d1a", to: "d2a" },
      { from: "d2a", to: "d3a" },
      { from: "d1a", to: "d1b", showAt: 2, dashed: true },
      { from: "d2a", to: "d2b", showAt: 5, dashed: true },
      { from: "d3a", to: "d3b", showAt: 5, dashed: true },
      { from: "d3a", to: "sys", dashed: true },
      { from: "d3b", to: "best", showAt: 5 }
    ],
    steps: [
      {
        title: "Series is a product",
        text: "D1, D2, D3 must all work. One copy each: 0.9×0.8×0.5=0.36. A studio with four 0.9 gadgets is already down to ~0.66. Failures multiply.",
        highlight: ["d1a", "d2a", "d3a", "sys", "n0"],
        flows: [
          { from: "d1a", to: "d2a", color: "#f87171", label: "×0.8" },
          { from: "d2a", to: "d3a", color: "#f87171", label: "×0.5" }
        ]
      },
      {
        title: "Parallel raises a stage",
        text: "Three copies of a 0.9 device: all-fail 0.1³=0.001, stage 0.999. The formula is 1-(1-r)^m. Copies of the same device sit in parallel; stages stay in series.",
        highlight: ["d1a", "d1b", "n1"]
      },
      {
        title: "Budget 105, bounds 2,3,3",
        text: "One of each is $65. Leftover $40. u_i=1+floor(40/c_i) so D1 at most 2 copies, D2 at most 3, D3 at most 3. That caps the DP loops.",
        highlight: ["n2", "d1a", "d2a", "d3a", "d1b"]
      },
      {
        title: "Cutoff before a dead end",
        text: "Two D2 copies on top of two D1 copies costs $90. $15 left cannot buy D3 ($20). Drop (0.9504,90) without multiplying reliability. Feasibility first, then arithmetic.",
        highlight: ["d2c", "n3"],
        fail: ["d2c"]
      },
      {
        title: "Dominance",
        text: "(0.792, $75) has worse R and worse cost than (0.864, $60). Knapsack dominance: throw it out. Pairs that remain are Pareto on (R, cost).",
        highlight: ["n4", "d2a"],
        fail: ["sys"]
      },
      {
        title: "Best pair 0.648 at $100",
        text: "After D3's 1/2/3 copies, dominance, and the $105 cap, the maximum R is 0.648 at $100. Trace the pair backward to the copy counts.",
        highlight: ["best", "d3b", "d2b"],
        flows: [
          { from: "d3b", to: "best", color: "#4ade80", label: "φ=0.75" }
        ]
      },
      {
        title: "Allocation (1,2,2)",
        text: "One D1, two D2, two D3. Cost 30+15+15+20+20=100. Series with no spares was 0.36; the replicas nearly double reliability inside the budget.",
        highlight: ["d1a", "d2a", "d2b", "d3a", "d3b", "best", "n5"],
        hide: ["d1b", "d2c"]
      }
    ]
  }
});
