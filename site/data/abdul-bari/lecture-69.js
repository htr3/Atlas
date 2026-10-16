window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 69,
  title: "7.1 Job Sequencing with Deadline - Branch and Bound",
  video: "https://www.youtube.com/watch?v=M7Fl_z7_J2k",
  category: "Branch, Bound & Complexity",
  tagline: "Minimize penalty: kill a node when cost exceeds the best upper bound U.",
  summary: "Job sequencing is a maximization of profit. Branch and bound wants a min problem, so the lecture names each profit a penalty and minimizes unpaid penalty. On a 4-job instance (penalties 5,10,6,3; deadlines 1,3,2,1; times 1,2,1,1) every node stores cost (penalties of skipped jobs among 1..k) and an upper bound (penalties of all jobs still out of the set). A global U starts at ∞ and falls 19→14→9→8. Any live node with cost > U is killed. Feasibility also drops children that cannot finish in time. The surviving answer is jobs 2 and 3, penalty 8.",

  theory: [
    {
      heading: "Max profit becomes min penalty",
      body: "Greedy and DP already solve job sequencing. Here the same problem is a vehicle for branch and bound. B&B as stated in the previous lecture is a <b>minimization</b> method. Profits would be maximized, so the lecture relabels each profit as a <b>penalty</b> you pay if the job is left undone. Minimizing the unpaid penalty is exactly maximizing the profit of the jobs you do finish. Deadlines still apply, and in this example <b>processing times are not all 1</b> — job 2 needs two units — so a subset can be infeasible even when deadlines look generous.",
      bullets: [
        "J1: penalty 5, deadline 1, time 1.",
        "J2: penalty 10, deadline 3, time 2.",
        "J3: penalty 6, deadline 2, time 1.",
        "J4: penalty 3, deadline 1, time 1."
      ]
    },
    {
      heading: "Cost versus upper bound on a node",
      body: "Two numbers sit on every node of the subset tree. Let the node mean 'the selected set S, and we have considered jobs up to k = max(S) (or k=0 at the root).' <b>Cost</b> is the sum of penalties of jobs in {1..k} that are <i>not</i> in S — the penalty already locked in because those jobs were skipped. <b>Upper bound</b> is the sum of penalties of <i>every</i> job not in S, including jobs after k that we have not yet decided. Upper bound is an optimistic 'if we somehow take every remaining job' leftover-penalty. A global incumbent <b>U</b> stores the smallest upper bound seen so far (a feasible complete penalty we could already claim).",
      bullets: [
        "Cost: penalties skipped among jobs 1..k (already decided not to do them).",
        "Upper bound: penalties of all jobs outside S (assume nothing else is taken).",
        "Global U: best (smallest) upper bound found; starts at ∞."
      ]
    },
    {
      heading: "Root, then four one-job children",
      body: "Root: cost 0, upper bound ∞, U = ∞. Include only J1: nothing skipped through job 1, so cost = 0. Jobs 2,3,4 unpaid → upper = 10+6+3 = <b>19</b>. U ← 19. Include only J2 (skip J1): cost = 5. Upper = 5+6+3 = <b>14</b>. U ← 14. Include only J3 (skip J1 and J2): cost = 5+10 = <b>15</b>. Cost 15 > U=14, so <b>kill</b> without bothering with a new upper bound. Include only J4: skip 1,2,3 → cost = 5+10+6 = 21 > 14, kill. Live nodes left: the J1 node and the J2 node.",
      bullets: [
        "U falls whenever a node posts a smaller upper bound.",
        "Kill rule: if cost > U, no descendant can beat the incumbent — prune.",
        "After level 1, U = 14 and two nodes remain live."
      ]
    },
    {
      heading: "Expand J1, then J2; U falls to 8",
      body: "From {1} the children are {1,2}, {1,3}, {1,4}. {1,2}: nothing skipped through job 2, cost = 0, upper = 6+3 = <b>9</b>, U ← 9. {1,3}: skipped J2, cost = 10, and 10 > 9 → kill. {1,4}: skipped J2 and J3, cost = 16 > 9 → kill. From {2} the children are {2,3} and {2,4}. {2,3}: skipped J1, cost = 5 ≤ 9, upper = 5+3 = <b>8</b>, U ← 8. {2,4}: skipped J1 and J3, cost = 5+6 = 11 > 8 → kill. The only attractive complete-looking node is {2,3} with cost 5 and upper 8.",
      bullets: [
        "{1,2} tightens U to 9; {2,3} tightens U to 8.",
        "Any node whose cost already exceeds U is marked dead and not expanded.",
        "Cost 5 on {2,3} is the locked penalty of J1; J4 is still unpaid in the upper bound."
      ]
    },
    {
      heading: "Feasibility: times, not only deadlines",
      body: "You still must ask whether the selected jobs can be packed before their deadlines given their lengths. {1,2,3}: times 1+2+1 = 4, but J1 uses the first hour, J2 needs two hours inside deadline 3, and there is <b>no hour left</b> for J3. Do not even generate that child. {1,2,4} fails the same way. {2,3,4}: J2 and J3 already fill three hours (deadlines 3 and 2); J4 needs one more unit — infeasible. After those silent non-generations, no live node remains except {2,3}.",
      bullets: [
        "A node is infeasible if the selected jobs cannot be scheduled in their windows.",
        "Infeasible children are not created — cheaper than create-then-kill.",
        "Variable times are why this instance is not the unit-time greedy table."
      ]
    },
    {
      heading: "Read the answer off the surviving node",
      body: "The last live node is jobs <b>2 and 3</b>. Penalty paid = 5+3 = <b>8</b> (J1 and J4 undone). Penalty saved = 10+6 = 16, which is the profit of the greedy-style reading. Cost 5 on that node was only the prefix skip of J1; the upper bound 8 is the true objective value. In an exam: write both formulas, keep a running U, kill on cost > U, then check packing. FIFO or LC both work; the lecture expands remaining live nodes in the order they were drawn.",
      bullets: [
        "Answer: do J2 and J3, pay penalty 8.",
        "U is an upper bound on the min penalty, not a lower bound on profit.",
        "Show one killed node (cost 15 > 14) so the examiner sees the prune rule."
      ]
    }
  ],

  keyTerms: [
    { term: "Penalty", def: "Profit written as a loss: pay it if the job is not completed on time." },
    { term: "Cost", def: "Sum of penalties of jobs in 1..k that this node has already skipped." },
    { term: "Upper bound", def: "Sum of penalties of every job not in the selected set S." },
    { term: "Global U", def: "Smallest upper bound found so far; kill any node with cost > U." },
    { term: "Live node", def: "Generated, cost ≤ U, not yet shown infeasible, still expandable." },
    { term: "Killed node", def: "Pruned because cost already exceeds U; descendants cannot win." },
    { term: "Feasible set", def: "Selected jobs can be packed into 1..max-deadline given their processing times." },
    { term: "Incumbent", def: "The best complete penalty (the current U) used as a cutoff." }
  ],

  tradeoffs: [
    { pro: "Cost > U is a one-line prune that deletes whole subtrees (J3-only, J4-only, {1,3}, {1,4}, {2,4}).", con: "A loose U (slow to fall) means almost no killing until late, so the tree is still large." },
    { pro: "Variable processing times are handled by a feasibility check greedy unit-time code would miss.", con: "You must test packing at every node, not only compare numbers." },
    { pro: "Relabeling profit as penalty lets you use the min-only B&B engine.", con: "Reporting 'penalty 8' without saying the matching profit 16 confuses a greedy-trained examiner." },
    { pro: "Upper bound on a partial set is cheap (sum of leftover penalties).", con: "It assumes leftover jobs might all stay undone — valid, but not as tight as a fractional knapsack-style bound." }
  ],

  interviewTips: [
    "Write the four jobs as (penalty, deadline, time) = (5,1,1), (10,3,2), (6,2,1), (3,1,1).",
    "Cost = skipped penalties in 1..k. Upper = all penalties outside S. Kill iff cost > U.",
    "Trace U: ∞ → 19 (only J1) → 14 (only J2) → 9 ({1,2}) → 8 ({2,3}).",
    "Show a kill: only-J3 has cost 15 > U=14.",
    "Name the time argument that refuses {1,2,3}: 1+2 hours already fill the horizon.",
    "Close with jobs {2,3}, penalty 8 = 5+3 unpaid."
  ],

  scene: {
    nodes: [
      { id: "zT", label: "Job subset tree", type: "zone", pos: [-1.5, 0, 0], size: [21, 16] },
      { id: "r", label: "Ø c=0 U=∞", type: "lb", pos: [-1.5, 0, -7] },
      { id: "a", label: "J1 c=0 ub=19", type: "server", pos: [-8.5, 0, -3], showAt: 1, color: "#60a5fa" },
      { id: "b", label: "J2 c=5 ub=14", type: "server", pos: [-1.5, 0, -3], showAt: 1, color: "#4ade80" },
      { id: "c", label: "J3 c=15", type: "server", pos: [4, 0, -3], showAt: 1 },
      { id: "d", label: "J4 c=21", type: "server", pos: [9, 0, -3], showAt: 1 },
      { id: "a12", label: "{1,2} c=0 ub=9", type: "worker", pos: [-10.5, 0, 1.5], showAt: 3 },
      { id: "a13", label: "{1,3} c=10", type: "worker", pos: [-6.5, 0, 1.5], showAt: 3 },
      { id: "a14", label: "{1,4} c=16", type: "worker", pos: [-2.5, 0, 1.5], showAt: 3 },
      { id: "b23", label: "{2,3} c=5 ub=8", type: "worker", pos: [2, 0, 1.5], showAt: 4, color: "#4ade80" },
      { id: "b24", label: "{2,4} c=11", type: "worker", pos: [6.5, 0, 1.5], showAt: 4 },
      { id: "dead", label: "{2,3,4} infsbl", type: "point", pos: [2, 0, 5.5], showAt: 6, color: "#f87171" },
      { id: "pool", label: "Live: J1, J2", type: "queue", pos: [9, 0, 5.5], showAt: 2 },
      { id: "uBox", label: "global U", type: "cache", pos: [9, 0, -7], showAt: 1 },
      { id: "n0", label: "Penalty = unpaid profit", type: "note", pos: [-9, 3, 7.5] },
      { id: "n1", label: "U: ∞ → 19 → 14", type: "note", pos: [8, 3, 7.5], showAt: 1 },
      { id: "n2", label: "Kill if cost > U", type: "note", pos: [-9, 3, -7.5], showAt: 2 },
      { id: "n3", label: "U ← 9 on {1,2}", type: "note", pos: [3, 3, 7.5], showAt: 3 },
      { id: "n4", label: "U ← 8 on {2,3}", type: "note", pos: [-9, 3, 7.5], showAt: 4 },
      { id: "n5", label: "Times 1+2 leave no slot", type: "note", pos: [8, 3, -7.5], showAt: 5 },
      { id: "n6", label: "Do J2,J3 pay penalty 8", type: "note", pos: [0, 3, 7.5], showAt: 7 }
    ],
    edges: [
      { from: "r", to: "a", showAt: 1 },
      { from: "r", to: "b", showAt: 1 },
      { from: "r", to: "c", showAt: 1 },
      { from: "r", to: "d", showAt: 1 },
      { from: "a", to: "a12", showAt: 3 },
      { from: "a", to: "a13", showAt: 3 },
      { from: "a", to: "a14", showAt: 3 },
      { from: "b", to: "b23", showAt: 4 },
      { from: "b", to: "b24", showAt: 4 },
      { from: "b23", to: "dead", showAt: 6, dashed: true },
      { from: "uBox", to: "pool", showAt: 2, dashed: true }
    ],
    steps: [
      {
        title: "Penalties, not profits",
        text: "Four jobs: penalties 5,10,6,3, deadlines 1,3,2,1, times 1,2,1,1. Branch and bound minimizes unpaid penalty. The root holds cost 0 and U=∞. A selected subset that finishes on time is a feasible answer.",
        highlight: ["r", "zT", "n0"]
      },
      {
        title: "One-job children and U",
        text: "{1}: cost 0, leftover 10+6+3=19, U←19. {2}: skip J1 so cost=5, leftover 5+6+3=14, U←14. Cost is skipped penalties through k; upper bound is every job still outside the set.",
        highlight: ["a", "b", "c", "d", "uBox", "n1"],
        hide: ["n0"],
        flows: [
          { from: "r", to: "a", color: "#60a5fa", label: "ub=19" },
          { from: "r", to: "b", color: "#4ade80", label: "ub=14" }
        ]
      },
      {
        title: "Kill when cost exceeds U",
        text: "{3} has cost 15>14. {4} has cost 21>14. Both die; no upper bound is required. Live pool is J1 and J2 only. That cutoff is the bound half of branch-and-bound.",
        highlight: ["c", "d", "pool", "n2", "b"],
        fail: ["c", "d"],
        hide: ["n0", "n1"],
        flows: [
          { from: "c", to: "uBox", color: "#f87171", label: "15>14" }
        ]
      },
      {
        title: "Expand J1; U falls to 9",
        text: "{1,2}: cost 0, unpaid 6+3=9, U←9. {1,3} cost 10>9 and {1,4} cost 16>9 are killed on the spot. FIFO would expand every live node; here J1 is expanded first because it was drawn first.",
        highlight: ["a", "a12", "a13", "a14", "n3", "uBox"],
        fail: ["c", "d", "a13", "a14"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "a", to: "a12", color: "#4ade80", label: "U=9" }
        ]
      },
      {
        title: "Expand J2; U falls to 8",
        text: "{2,3}: skip J1, cost=5≤9, unpaid J1+J4=8, U←8. {2,4}: skip J1 and J3, cost=11>8, kill. The incumbent penalty is now 8, so any remaining node with cost>8 is hopeless.",
        highlight: ["b", "b23", "b24", "n4", "uBox"],
        fail: ["c", "d", "a13", "a14", "b24"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "b", to: "b23", color: "#4ade80", label: "U=8" }
        ]
      },
      {
        title: "Feasibility uses processing times",
        text: "{1,2} cannot add J3 or J4: times 1+2 already fill three hours. {2,3} cannot add J4 for the same reason. Those children are never generated. Deadlines alone would have lied; lengths matter.",
        highlight: ["a12", "b23", "n5"],
        fail: ["c", "d", "a13", "a14", "b24"],
        hide: ["n0", "n1", "n2", "n3", "n4"]
      },
      {
        title: "Infeasible last branch",
        text: "The only candidate extra node {2,3,4} is infeasible. The live-node queue is empty except {2,3}. Pruned nodes stay in the picture with a red cross so you can recap the kill rule.",
        highlight: ["b23", "dead", "pool"],
        fail: ["c", "d", "a13", "a14", "b24", "dead"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "b23", to: "dead", color: "#f87171", label: "no slot" }
        ]
      },
      {
        title: "Answer: jobs 2 and 3, penalty 8",
        text: "Do J2 and J3 (save 10+6=16). Pay J1 and J4 (5+3=8). Cost 5 on the node was the locked skip of J1; the upper bound 8 is the objective. That is the minimum penalty on this instance.",
        highlight: ["b23", "b", "n6", "uBox"],
        fail: ["c", "d", "a13", "a14", "b24", "dead"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "b", to: "b23", color: "#4ade80", label: "opt" }
        ]
      }
    ]
  }
});
