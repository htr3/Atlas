window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 70,
  title: "7.2 0/1 Knapsack using Branch and Bound",
  video: "https://www.youtube.com/watch?v=yV1d-b_NeK8",
  category: "Branch, Bound & Complexity",
  tagline: "Negate profits, bound with a fractional fill, LC-expand the most negative cost.",
  summary: "Four objects (profits 10,10,12,18; weights 2,4,6,9) and capacity 15. 0/1 knapsack is a max problem, so the lecture stores negative profits and minimizes. Each node has a cost (greedy fractional fill of the remaining capacity) and an upper bound (same fill without a fraction). LC always expands the node with the smallest (most negative) cost. Global U starts at −∞ in magnitude (written ∞) and becomes −32 then −38. Nodes whose cost is worse than U are killed. The surviving path is (1,1,0,1) with profit 38 and weight 15.",

  theory: [
    {
      heading: "0/1 fill, then negate the profits",
      body: "Objects must go in whole or not at all — you cannot cut the 4 kg item down to 2 kg. Capacity M = <b>15</b>. Profits and weights in the lecture: (10,2), (10,4), (12,6), (18,9). The objective is maximum profit, but branch and bound is a min engine, so every profit is stored as a <b>negative</b> number. After the search you flip the sign to report +38. Greedy fractional knapsack, DP, and backtracking all solve this problem; this video is the LC-BB tree.",
      bullets: [
        "Fixed-size encoding: a 0/1 vector of length 4, not a variable subset.",
        "Each level decides one object: left = include, right = exclude.",
        "Costs and bounds are negative so 'least cost' means 'best profit bound.'"
      ]
    },
    {
      heading: "Cost uses a fraction; upper bound does not",
      body: "At a node some prefix of decisions is fixed. Fill the rest like greedy knapsack by profit/weight, <i>allowing one fractional object</i>. That total profit, negated, is the <b>cost</b> — a lower bound on the min-negative-profit (equivalently an optimistic max). Repeat the fill but refuse the fraction: that integer-only profit, negated, is the node's <b>upper bound</b> (a feasible complete packing you could take now). Fractions are a computational trick; they never appear in the 0/1 answer. Global U stores the best (most negative) upper bound seen.",
      bullets: [
        "Cost: greedy fill with at most one fraction, then negate.",
        "Upper bound: same greedy fill with no fraction, then negate.",
        "Kill the node if its cost is greater than U (worse than a known feasible packing)."
      ]
    },
    {
      heading: "Root: cost −38, bound −32",
      body: "Take objects 1,2,3: weights 2+4+6 = 12, profits 10+10+12 = 32. Three kilograms remain; object 4 has 18/9 = 2 profit per kg, so 3 kg contribute 6. Fractional total 38 → cost <b>−38</b>. Without the fraction the integer fill is 32 → upper <b>−32</b>. U was ∞, now U ← −32. Include object 1: the same remaining fill, so the child copies −38 / −32. Exclude object 1: take 2 and 3 (weight 10, profit 22) plus 5 kg of object 4 (10 more) → cost −32; integer-only 22 → upper −22. Cost −32 equals U, so the exclude-1 node stays live; LC still prefers −38.",
      bullets: [
        "Root and include-1 share −38 / −32 because object 1 was already in the greedy fill.",
        "Exclude-1 is live (cost −32 ≯ U) but not the LC pick.",
        "U only improves when a strictly better upper bound appears."
      ]
    },
    {
      heading: "LC expands include-1, then include-1-and-2",
      body: "Least cost among −38 and −32 is −38, so expand include-1. Include object 2: still −38 / −32. Exclude object 2 (object 1 is in): weights 2+6=8 so 7 kg of object 4 add 14, total 10+12+14=36 → cost <b>−36</b>, integer 22 → −22. −36 is better than −32, so LC's next E-node is the include-1-include-2 node of cost −38, not the FIFO next sibling. FIFO would have expanded exclude-1 and grown extra nodes; LC skips that work.",
      bullets: [
        "After two includes, live costs include −38, −36, −32.",
        "LC always takes −38 until a better (smaller) cost appears.",
        "Exclude-2 stays alive for now because −36 is still ≤ the current U=−32."
      ]
    },
    {
      heading: "Exclude object 3: U becomes −38 and the others die",
      body: "From (1,1,?,?): include object 3 would weigh 12, and object 4 (9 kg) cannot fit — that child is <b>infeasible</b>. Exclude object 3: objects 1,2,4 weigh 2+4+9=15 exactly, profit 10+10+18=38. No fraction, so cost = upper = <b>−38</b>. U ← −38. Revisit live nodes: exclude-1 had cost −32 > −38, kill. Exclude-2 had cost −36 > −38, kill. You need not expand them. The only remaining question is whether object 4 is in or out of this (1,1,0) prefix.",
      bullets: [
        "A packing that fills M with no fraction makes cost equal upper bound.",
        "After U=−38, any node with cost > −38 is dead (cannot beat 38 profit).",
        "Include-3 on this path exceeds capacity — do not draw a real child."
      ]
    },
    {
      heading: "Answer (1,1,0,1), profit 38",
      body: "Include object 4: same −38 / −38, a complete feasible vector <b>(1,1,0,1)</b>. Exclude object 4: only objects 1 and 2, profit 20 → −20, which is worse than U, kill. One live leaf remains, so it is optimal. Weights 2+4+9=15, profits 10+10+18=<b>38</b>. Flip the sign back for the original max problem. Exam wording: 'LC-BB, cost with fraction, bound without, kill if cost > U, answer x=(1,1,0,1).'",
      bullets: [
        "x1=1, x2=1, x3=0, x4=1 is the only surviving leaf.",
        "Report +38 after the minimization search.",
        "A FIFO run would have expanded the −32 and −36 nodes; LC never did."
      ]
    }
  ],

  keyTerms: [
    { term: "0/1 decision", def: "Take the whole object or skip it; the tree is binary include/exclude." },
    { term: "Negated profit", def: "Max knapsack is solved as min of −profit so LC can pick the smallest cost." },
    { term: "Cost (fractional)", def: "Greedy fill of leftover capacity allowing one fraction; then negate." },
    { term: "Upper bound (integer)", def: "Same greedy fill with no fraction; a feasible complete profit, negated." },
    { term: "Global U", def: "Best (most negative) upper bound so far; kill if node cost > U." },
    { term: "LC E-node", def: "Live node of least cost; here the path of includes with cost −38." },
    { term: "Infeasible child", def: "Including the next object would exceed M; the node is not generated." },
    { term: "Answer vector", def: "(1,1,0,1): objects 1,2,4, profit 38, weight 15." }
  ],

  tradeoffs: [
    { pro: "Fractional cost is a tight optimistic bound, so LC prunes the −32 and −36 branches after one lucky leaf.", con: "You must sort leftover objects by profit/weight at every node, which is extra arithmetic versus DP's table." },
    { pro: "Fixed 0/1 tree has a predictable depth n.", con: "n objects still mean 2^n leaves in the worst case if U never improves." },
    { pro: "LC expands fewer nodes than FIFO on this instance (FIFO would have opened exclude-1).", con: "If several nodes share the same cost, LC needs a tie-break; FIFO's order is unambiguous." },
    { pro: "Negating profits reuses the min-only B&B skeleton from jobs and TSP.", con: "Mixing positive U with negative costs is a frequent sign error." }
  ],

  interviewTips: [
    "Quote the instance: p=(10,10,12,18), w=(2,4,6,9), M=15.",
    "Cost = fractional knapsack of the remainder, negated; bound = integer greedy, negated.",
    "Root: 32 + (18/9)×3 = 38, so cost −38, bound −32.",
    "Say why exclude-3 updates U to −38: 2+4+9=15, profit 38, no fraction.",
    "Kill exclude-1 (−32) and exclude-2 (−36) once U=−38.",
    "Vector (1,1,0,1), profit 38. Mention LC vs FIFO in one sentence."
  ],

  scene: {
    nodes: [
      { id: "zK", label: "0/1 LC tree", type: "zone", pos: [-1, 0, 0.5], size: [20, 16] },
      { id: "r", label: "r −38/−32", type: "lb", pos: [-1, 0, -7] },
      { id: "i1", label: "x1=1 −38/−32", type: "server", pos: [-6.5, 0, -3.2], showAt: 2, color: "#4ade80" },
      { id: "e1", label: "x1=0 −32/−22", type: "server", pos: [5, 0, -3.2], showAt: 2 },
      { id: "i2", label: "x2=1 −38/−32", type: "worker", pos: [-9.5, 0, 0.8], showAt: 3, color: "#4ade80" },
      { id: "e2", label: "x2=0 −36/−22", type: "worker", pos: [-3.5, 0, 0.8], showAt: 3 },
      { id: "i3", label: "x3=1 infsbl", type: "point", pos: [-9.5, 0, 4.6], showAt: 4, color: "#f87171" },
      { id: "e3", label: "x3=0 −38/−38", type: "worker", pos: [-3.5, 0, 4.6], showAt: 4, color: "#4ade80" },
      { id: "i4", label: "x4=1 SOL", type: "worker", pos: [-6.5, 0, 7.4], showAt: 6, color: "#4ade80" },
      { id: "e4", label: "x4=0 −20", type: "worker", pos: [-0.5, 0, 7.4], showAt: 6 },
      { id: "live", label: "LC pool", type: "queue", pos: [8.5, 0, 0.8], showAt: 2 },
      { id: "ub", label: "U bound", type: "cache", pos: [8.5, 0, -7], showAt: 1 },
      { id: "obj", label: "p 10,10,12,18 w 2,4,6,9", type: "note", pos: [-8, 3, 7.5] },
      { id: "n0", label: "Max → min: negate p", type: "note", pos: [8, 3, 7.5] },
      { id: "n1", label: "Cost uses a fraction", type: "note", pos: [8, 3, -7.5], showAt: 1 },
      { id: "n2", label: "LC picks −38 not −32", type: "note", pos: [-8, 3, -7.5], showAt: 2 },
      { id: "n3", label: "U ← −38; kill −32,−36", type: "note", pos: [8, 3, 4.6], showAt: 5 },
      { id: "n4", label: "Answer (1,1,0,1) p=38", type: "note", pos: [8, 3, 7.5], showAt: 7 }
    ],
    edges: [
      { from: "r", to: "i1", showAt: 2, label: "in" },
      { from: "r", to: "e1", showAt: 2, label: "out" },
      { from: "i1", to: "i2", showAt: 3 },
      { from: "i1", to: "e2", showAt: 3 },
      { from: "i2", to: "i3", showAt: 4, dashed: true },
      { from: "i2", to: "e3", showAt: 4 },
      { from: "e3", to: "i4", showAt: 6 },
      { from: "e3", to: "e4", showAt: 6 },
      { from: "live", to: "ub", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "0/1 knapsack as a min problem",
        text: "M=15, objects (10,2), (10,4), (12,6), (18,9). Take all or nothing. Negate profits so branch-and-bound can minimize. The tree will be a fixed-length 0/1 path, one bit per object.",
        highlight: ["r", "zK", "obj", "n0"]
      },
      {
        title: "Root bound: fraction vs integer",
        text: "Greedy fill 1+2+3 weighs 12, leftover 3 kg of object 4 add (18/9)×3=6, total 38 → cost −38. Drop the fraction: integer 32 → upper −32. U←−32. Fractions never enter the 0/1 solution; they only score nodes.",
        highlight: ["r", "ub", "n1", "obj"],
        hide: ["n0"],
        flows: [
          { from: "r", to: "ub", color: "#fb923c", label: "U=−32" }
        ]
      },
      {
        title: "Include x1 (LC) vs exclude x1",
        text: "Include object 1 copies −38/−32. Exclude object 1: cost −32, bound −22. Both stay live. LC expands the include child because −38 is the least cost. FIFO would have opened exclude-1 next and grown extra nodes.",
        highlight: ["i1", "e1", "live", "n2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "r", to: "i1", color: "#4ade80", label: "LC" },
          { from: "r", to: "e1", color: "#60a5fa", label: "live" }
        ]
      },
      {
        title: "Include x2 stays at −38",
        text: "Include object 2: still −38/−32. Exclude object 2: 10+12 plus 7 kg of object 4 = 36 → cost −36. LC's pool is now −38, −36, −32. Next E-node is still the −38 path (objects 1 and 2 in).",
        highlight: ["i2", "e2", "i1", "live", "n2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "i1", to: "i2", color: "#4ade80", label: "−38" }
        ]
      },
      {
        title: "x3 cannot fit; exclude x3 is −38",
        text: "Include object 3 on this path weighs 12, plus 9 exceeds 15 — infeasible, red. Exclude object 3 and pack object 4: weight 15, profit 38, cost=bound=−38. U←−38.",
        highlight: ["i3", "e3", "ub", "i2"],
        fail: ["i3"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "i2", to: "e3", color: "#4ade80", label: "U=−38" }
        ]
      },
      {
        title: "Prune the worse live nodes",
        text: "Exclude-1 had cost −32 > −38. Exclude-2 had cost −36 > −38. Both are killed. LC never expands them. That is the payoff of a tight fractional bound plus an integer incumbent of 38.",
        highlight: ["e1", "e2", "n3", "ub", "e3"],
        fail: ["i3", "e1", "e2"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "e1", to: "ub", color: "#f87171", label: "kill" },
          { from: "e2", to: "ub", color: "#f87171", label: "kill" }
        ]
      },
      {
        title: "x4=1 is the only leaf left",
        text: "Include object 4 keeps −38: vector (1,1,0,1). Exclude object 4 is profit 20 → −20, worse than U, kill. One live leaf remains, so it is optimal.",
        highlight: ["i4", "e4", "e3"],
        fail: ["i3", "e1", "e2", "e4"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "e3", to: "i4", color: "#4ade80", label: "keep" }
        ]
      },
      {
        title: "Profit 38, weight 15",
        text: "Flip the sign: maximum profit is 38 from objects 1,2,4. LC-BB expanded the cheap path and X-ed the rest. Same instance DP would fill a table; here the picture is a pruned 0/1 tree plus a live-node queue.",
        highlight: ["i4", "i1", "i2", "e3", "n4", "obj"],
        fail: ["i3", "e1", "e2", "e4"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "r", to: "i4", color: "#4ade80", label: "opt 38" }
        ]
      }
    ]
  }
});
