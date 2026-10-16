window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 39,
  title: "3. Greedy Method -  Introduction",
  video: "https://www.youtube.com/watch?v=ARvQcqJ_-NY",
  category: "Greedy Algorithms",
  tagline: "Solve an optimization problem in stages: take the next feasible input, never look back.",
  summary: "Greedy is a design strategy for optimization: among many solutions, keep those that meet the constraint (feasible) and pick the one that hits the min or max objective (optimal). The method walks the input one item at a time, includes an item only if it stays feasible, and trusts a fixed selection rule instead of searching every combination. The A-to-B journey, the car-shopping shortcut, and the hiring funnel are the lecture's pictures of that rule.",

  theory: [
    {
      heading: "Optimization, feasible, optimal",
      body: "An <b>optimization problem</b> asks for a minimum or a maximum, not merely any legal answer. The lecture's journey from <b>A to B</b> has many solutions: walk, bike, car, train, flight. A <b>constraint</b> (finish within <b>12 hours</b>) throws walk and car out. Train and flight remain <b>feasible</b> — they satisfy the given limit. If the objective is <b>minimum cost</b>, the cheaper of those two (train, in the talk) is the <b>optimal</b> solution. Feasible means \"allowed.\" Optimal means \"best among the allowed.\" Greedy is one of the three standard strategies (with divide-and-conquer and dynamic programming) aimed at that best value.",
      bullets: [
        "Many solutions exist; only some meet the constraint.",
        "Feasible = satisfies the constraint; optimal = feasible and best for the objective.",
        "The lecture claims a unique optimal value (one min cost), even if several input sets could achieve it later in the course."
      ]
    },
    {
      heading: "Greedy-choice logic",
      body: "The general method is a <b>stage-wise</b> scan of an input of size n. At stage i you consider one candidate X from the remaining data. If including X still yields a feasible partial solution, you lock it in; otherwise you skip it. You never reopen a rejected item and you never enumerate all subsets. The power — and the risk — sits in the <b>selection rule</b> you chose before the loop (highest density, latest slot, cheapest edge, …). Follow that known rule blindly, and the claim is that the assembled feasible set is optimal.",
      bullets: [
        "One input per stage; include iff feasible.",
        "The selection order is decided up front, not by searching the whole space.",
        "Greedy is fast because it does not try every combination."
      ]
    },
    {
      heading: "Worked example: cars and hiring",
      body: "Buying the \"best\" car by inspecting every brand and model in the city is exhaustive and slow. The greedy shortcut: keep only trusted brands (Toyota or Hyundai in the talk), then only top models, then the latest well-tested release, and stop. You did not prove it is the global best car; you proved it is the best according to a filter you already trust. Hiring is the same funnel: a thousand applicants, a written test, then technical or group discussion, then one offer. Giving every applicant every round would be optimal in a brute-force sense and ruinous in time and money. The person who survives the known tests is declared best <i>by that procedure</i>.",
      bullets: [
        "Car: brand → model → latest release, not a full catalog scan.",
        "Hiring: successive filters, not a thousand full interviews.",
        "Both are greedy because a local rule replaces exhaustive comparison."
      ]
    },
    {
      heading: "Proof intuition",
      body: "Why can a local yes/no ever be globally right? Because the lecture's greedy problems are built so that an item which looks best now will not become worse later: the remaining capacity, remaining slots, or remaining vertices still accept that choice. The A-to-B story is the existence proof of the vocabulary (feasible vs optimal), not a formal exchange argument. The later greedy lectures supply the real proofs: density order for fractional knapsack, latest-deadline slots for jobs, always-merge-two-smallest, cut/cycle properties for MST, and \"settled distance is final\" for Dijkstra on non-negative edges. If the selection rule is wrong, greedy still runs — it just returns a feasible answer that is not optimal.",
      bullets: [
        "Correctness lives in the selection rule, not in the for-loop skeleton.",
        "Exhaustive search would also find the optimum, at exponential cost.",
        "A bad rule (max profit ignoring weight, cheapest edge that closes a cycle) is still \"greedy\" and wrong."
      ]
    },
    {
      heading: "Complexity and where it sits",
      body: "The skeleton is a single pass over n inputs after you have ordered them. Ordering is usually a sort, so typical greedy algorithms are <b>O(n log n)</b> plus a linear scan, unless the selection structure is a heap or a union-find (later lectures). Brute force over subsets is 2^n. That gap is the reason you learn greedy before you reach for DP: when the greedy-choice property holds, you do not need a table. When it fails (0/1 knapsack, negative Dijkstra edges), the same stage-wise loop quietly returns the wrong number.",
      bullets: [
        "Sort + one pass is the default bill: O(n log n).",
        "Trying every solution is the contrast the car and hiring stories reject.",
        "Next videos apply this skeleton to knapsack, jobs, merge, Huffman, MST, Dijkstra."
      ]
    }
  ],

  keyTerms: [
    { term: "Optimization problem", def: "A problem whose objective is a minimum or a maximum, not just any legal output." },
    { term: "Constraint", def: "A hard limit the solution must obey (A→B in 12 hours; bag weight ≤ capacity)." },
    { term: "Feasible solution", def: "Any solution that satisfies the constraint, even if it is not the best." },
    { term: "Optimal solution", def: "A feasible solution that achieves the required min or max. The objective value is unique." },
    { term: "Greedy choice", def: "At each stage, take the currently best feasible input under a fixed rule and never reconsider it." },
    { term: "Stage", def: "One iteration of the greedy loop: inspect one input, include or skip." },
    { term: "Selection rule", def: "The predetermined test (density, profit, two-smallest, cheapest edge) that orders the stages." }
  ],

  tradeoffs: [
    { pro: "One pass after a sort: you get an answer without enumerating subsets.", con: "If the selection rule is wrong, the loop still finishes — with a non-optimal feasible set." },
    { pro: "Feasible / optimal vocabulary makes exam questions easy to grade (constraint vs objective).", con: "Saying \"there is only one optimal solution\" confuses unique cost with unique item set." },
    { pro: "Hiring and car filters match how people actually decide under time pressure.", con: "The analogies prove speed, not a cut property — you still need a real proof per problem." },
    { pro: "The same skeleton covers knapsack, jobs, Huffman, MST, and Dijkstra.", con: "DP and branch-and-bound exist because greedy is not universal." }
  ],

  interviewTips: [
    "Write the constraint and the objective as two separate sentences before you name greedy.",
    "On A→B: walk/bike/car/train/flight are solutions; 12 hours cuts to feasible; min cost picks optimal.",
    "State the stage loop: consider one input, include iff feasible, never backtrack.",
    "Name the selection rule explicitly (you will fill it in on later problems).",
    "If asked why not brute force, use the car-catalog or thousand-applicant cost argument.",
    "Do not claim greedy works on every optimization problem — 0/1 knapsack and negative Dijkstra are the course's counterexamples."
  ],

  scene: {
    nodes: [
      { id: "locA", label: "Location A", type: "user", pos: [-10, 0, 0] },
      { id: "locB", label: "Location B", type: "server", pos: [10, 0, 0] },
      { id: "walk", label: "Walk", type: "point", pos: [-6, 0, -4], color: "#f87171" },
      { id: "bike", label: "Bike", type: "point", pos: [-2, 0, -4], color: "#fb923c" },
      { id: "car", label: "Car", type: "point", pos: [2, 0, -4], color: "#facc15" },
      { id: "train", label: "Train", type: "point", pos: [6, 0, -4], color: "#4ade80" },
      { id: "flight", label: "Flight", type: "point", pos: [10, 0, -4], color: "#60a5fa" },
      { id: "brand", label: "Toyota / Hyundai", type: "zone", pos: [-6, 0, 4], size: [8, 3.2], showAt: 5 },
      { id: "model", label: "Top models", type: "service", pos: [2, 0, 4], showAt: 5 },
      { id: "hire", label: "1000 applicants", type: "queue", pos: [-6, 0, -7], showAt: 6 },
      { id: "test", label: "Written test", type: "lb", pos: [1, 0, -7], showAt: 6 },
      { id: "offer", label: "One hire", type: "worker", pos: [8, 0, -7], showAt: 6 },
      { id: "n0", label: "Many A→B solutions", type: "note", pos: [-8, 3, 7] },
      { id: "n1", label: "Constraint: 12 hours", type: "note", pos: [8, 3, 7], showAt: 1 },
      { id: "n2", label: "Feasible: train, flight", type: "note", pos: [-8, 3, -7.5], showAt: 2 },
      { id: "n3", label: "Optimal: min-cost train", type: "note", pos: [8, 3, -7.5], showAt: 3 },
      { id: "n4", label: "Stage: take if feasible", type: "note", pos: [0, 3, 7.5], showAt: 4 },
      { id: "n5", label: "Filter, don't enumerate", type: "note", pos: [0, 3, -7.5], showAt: 5 }
    ],
    edges: [
      { from: "locA", to: "walk", dashed: true },
      { from: "locA", to: "bike", dashed: true },
      { from: "locA", to: "car", dashed: true },
      { from: "locA", to: "train" },
      { from: "locA", to: "flight" },
      { from: "walk", to: "locB", dashed: true },
      { from: "bike", to: "locB", dashed: true },
      { from: "car", to: "locB", dashed: true },
      { from: "train", to: "locB" },
      { from: "flight", to: "locB" },
      { from: "brand", to: "model", label: "greedy pick", showAt: 5 },
      { from: "hire", to: "test", showAt: 6 },
      { from: "test", to: "offer", showAt: 6 }
    ],
    steps: [
      {
        title: "A journey with five answers",
        text: "Problem P: travel A→B. Walk, bike, car, train, and flight are all solutions. Greedy is not in play until you name a constraint and an objective.",
        highlight: ["locA", "locB", "walk", "bike", "car", "train", "flight", "n0"]
      },
      {
        title: "Constraint: 12 hours",
        text: "Finish within 12 hours. Walk and car drop out. Feasibility is a yes/no on the constraint, not a quality ranking yet.",
        highlight: ["locA", "locB", "train", "flight", "n1"],
        fail: ["walk", "car"],
        hide: ["n0"],
        flows: [{ from: "locA", to: "train", color: "#4ade80", label: "≤12h" }]
      },
      {
        title: "Feasible set",
        text: "Train and flight both meet 12 hours. Those two are feasible. Bike may or may not, depending on distance; the lecture keeps train and flight as the clear legal pair.",
        highlight: ["train", "flight", "n2", "locB"],
        fail: ["walk", "car"],
        hide: ["n0"]
      },
      {
        title: "Optimal: minimum cost",
        text: "The objective is min cost. Among feasible options the cheaper one (train) is optimal. One optimal value — not five-way indecision.",
        highlight: ["train", "n3", "locA", "locB"],
        fail: ["walk", "car"],
        hide: ["n0", "n1"],
        flows: [{ from: "locA", to: "train", color: "#4ade80", label: "opt" }, { from: "train", to: "locB", color: "#4ade80", label: "min cost" }]
      },
      {
        title: "Stage-wise include-if-feasible",
        text: "General greedy: scan inputs 1..n, call the next one X, and include X only if the partial solution stays feasible. That loop is the whole method. The selection order is chosen before you start.",
        highlight: ["n4", "locA", "train"],
        hide: ["n0", "n1"]
      },
      {
        title: "Car filter instead of a catalog",
        text: "Do not test every model in the city. Keep a brand (Toyota/Hyundai), then a top model, then the latest release. You call that car best because the filter is the rule you trust.",
        highlight: ["brand", "model", "n5"],
        hide: ["n0", "n1", "n2"],
        flows: [{ from: "brand", to: "model", color: "#fb923c", label: "top model" }]
      },
      {
        title: "Hiring funnel",
        text: "A thousand applicants, a written test, later rounds, one offer. Interviewing everyone in every round is the brute-force optimum and a costly process. Greedy filters and stops.",
        highlight: ["hire", "test", "offer", "n5"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "hire", to: "test", color: "#60a5fa", label: "filter" },
          { from: "test", to: "offer", color: "#4ade80", label: "best by rule" }
        ]
      },
      {
        title: "What exams will ask next",
        text: "Same skeleton, new selection rules: profit/weight, latest deadline slot, two smallest files, cheapest safe edge, closest unsettled vertex. If the rule is right, the staged answer is optimal.",
        highlight: ["n4", "n5", "train", "offer"],
        hide: ["n0", "n1"]
      }
    ]
  }
});
