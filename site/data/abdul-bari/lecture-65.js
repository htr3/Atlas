window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 65,
  title: "6.2 Sum Of Subsets Problem - Backtracking",
  video: "https://www.youtube.com/watch?v=kyLxTdsT8ws",
  category: "Graphs & Backtracking",
  tagline: "Weights 5,10,12,13,15,18 target 30. Include/exclude DFS; two bounds kill 2^n.",
  summary: "Given n weights and a target M, find every 0-1 vector whose selected weights sum to M exactly. The lecture uses n = 6, w = (5, 10, 12, 13, 15, 18), M = 30, total 73. The state-space tree is a binary include/exclude tree of height 6 (2^n paths). Two bounding tests kill a node: adding the next weight would exceed M, or even taking every remaining weight cannot reach M. One live path is (1,1,0,0,1,0) → 5+10+15 = 30. The recursion is DFS / preorder.",

  theory: [
    {
      heading: "Exact sum, 0-1 vector, all subsets",
      body: "Six weights <code>w = (5, 10, 12, 13, 15, 18)</code>. Choose a subset whose sum is exactly <b>M = 30</b>. The full set sums to 73, so you must leave some out. The answer is recorded as bits <code>x[i] ∈ {0,1}</code>: 1 means weight i is in the subset, 0 means it is not. Several subsets can hit 30; backtracking lists them. This is not 0-1 knapsack (that maximizes value under a capacity). Here the sum must match M on the nose.",
      bullets: [
        "Instance: n = 6, M = 30, total W = 73.",
        "x is a bit vector, one bit per weight in input order.",
        "Want every subset with sum = M, not a best value."
      ]
    },
    {
      heading: "Include/exclude tree, 2^n paths",
      body: "Level i of the state-space tree decides weight i. Left child: include (<code>x[i] = 1</code>). Right child: exclude (<code>x[i] = 0</code>). Height 6, so 2^6 = 64 leaves if you generate everything — in general <b>2^n</b> paths, exponential. Backtracking still walks DFS (include first, then back up and exclude), but a bounding function refuses to open a child that cannot finish at M. Each node stores two running numbers the lecture writes on the vertex: <b>sum so far s</b> and <b>remaining weight r</b> (weights not yet decided).",
      bullets: [
        "Binary tree, one bit per level.",
        "DFS: generate the include branch, then the exclude branch.",
        "Node label (s, r): s starts at 0, r starts at 73."
      ]
    },
    {
      heading: "Two bounds: cannot overshoot, cannot undershoot",
      body: "Bound 1 (too heavy): if you are about to include weight k, require <code>s + w[k] ≤ M</code>. If the sum would already pass 30, including k (and anything after) is hopeless — kill the include child. Bound 2 (too light): even if you take every leftover weight, you need <code>s + r ≥ M</code>. If the leftovers cannot make up the gap, kill the node (usually the exclude-all-the-rest child). Together: a node is promising only when the next include does not exceed M and the remaining pile can still reach M. That pair is the bounding function for subset-sum.",
      bullets: [
        "s + w[k] ≤ M  or else the include child dies.",
        "s + r ≥ M  or else the node cannot reach the target.",
        "A leaf with s = M is a solution; s ≠ M is discarded."
      ]
    },
    {
      heading: "Worked left spine: 5+10+12 overshoots, then 5+10+15 hits",
      body: "Include 5: node (5, 68). Include 10: (15, 58). Include 12: (27, 46). Include 13: (40, 33) — 40 > 30, bound 1 kills it. Exclude 13: still 27, remaining 33. Include 15: 42 > 30, kill. Exclude 15: s = 27, leftover 18. Include 18: 45 > 30, kill. Exclude 18: r = 0, 27 < 30, bound 2 kills. Now back up and exclude 12 from (15, 58): s = 15, r = 46. Include 13: (28, 33) lives. Include 15: 43 > 30, kill. Exclude 15 then include 18: 46 > 30, kill; exclude 18 fails bound 2. Exclude 13: s = 15, r = 33. Include 15: <b>15 + 15 = 30</b>, leftover 18. First solution: <code>x = (1, 1, 0, 0, 1, 0)</code> — weights 5, 10, 15.",
      bullets: [
        "Kill (40, 33): already past 30.",
        "Kill (27, 0): cannot reach 30 with nothing left.",
        "Live leaf: 5 + 10 + 15 = 30, bits 1,1,0,0,1,0."
      ]
    },
    {
      heading: "More subsets exist; the point was the bounds",
      body: "The lecture stops after one leaf so the tree does not fill the board, but it names others: 12+18 = 30, and 5+12+13 = 30, and so on. If you keep DFS on the exclude-5 side the tree balloons. That is the demo of the method, not a claim of uniqueness. The algorithm is recursive because the walk is DFS / preorder on a binary tree: do the include child, then the exclude child, undo the bit on the way back.",
      bullets: [
        "Several subsets of this instance sum to 30.",
        "Without bounds you generate 2^n nodes of work.",
        "With bounds you still quote O(2^n) worst case; the bounds are practical, not a new complexity class."
      ]
    }
  ],

  keyTerms: [
    { term: "Sum of subsets", def: "Find every subset of given weights whose values add to exactly M." },
    { term: "x[i] ∈ {0,1}", def: "1 includes weight i, 0 excludes it; the solution is this bit vector." },
    { term: "Include/exclude tree", def: "Binary state-space tree, one level per weight, left = 1, right = 0." },
    { term: "s, r", def: "Sum of included weights so far, and sum of weights not yet decided." },
    { term: "Bound (heavy)", def: "Kill include of w[k] when s + w[k] > M." },
    { term: "Bound (light)", def: "Kill a node when s + r < M — leftovers cannot reach the target." },
    { term: "(1,1,0,0,1,0)", def: "Worked solution: 5 + 10 + 15 = 30." }
  ],

  tradeoffs: [
    { pro: "Two cheap tests delete include-too-much and exclude-too-much branches before they explode.", con: "Worst case (no bound ever fires) is still Θ(2^n) leaves." },
    { pro: "DFS stores only the current bit path, O(n) extra memory.", con: "You may print a solution late; the lecture's first hit is not the shortest subset." },
    { pro: "The same skeleton lists every exact subset, which is the spec.", con: "If you only needed any subset or a max-value knapsack, DP is the right chapter." },
    { pro: "Sorting weights ascending (as given) lets the heavy-bound fire earlier on large later items.", con: "Unsorted input still works; it just kills later." }
  ],

  interviewTips: [
    "Quote the instance: w = (5,10,12,13,15,18), M = 30, bits x[i] in {0,1}.",
    "Draw a binary include/exclude tree and say the walk is DFS.",
    "Write both bounds: s+w[k] ≤ M and s+r ≥ M. Kill with those, do not say 'magic prune'.",
    "Trace 5+10+12+13 = 40 (kill), then 5+10+15 = 30 as (1,1,0,0,1,0).",
    "Name at least one other subset (12+18) so you show the problem asks for all, not one.",
    "Complexity: 2^n paths; backtracking is still exponential."
  ],

  scene: {
    nodes: [
      { id: "wzone", label: "weights → 30", type: "zone", pos: [-7, 0, 3], size: [9, 10] },
      { id: "w5", label: "5", type: "cache", pos: [-10, 0, 6], color: "#4ade80" },
      { id: "w10", label: "10", type: "cache", pos: [-7, 0, 6], color: "#4ade80" },
      { id: "w12", label: "12", type: "server", pos: [-4, 0, 6] },
      { id: "w13", label: "13", type: "server", pos: [-10, 0, 2] },
      { id: "w15", label: "15", type: "cache", pos: [-7, 0, 2], color: "#4ade80" },
      { id: "w18", label: "18", type: "server", pos: [-4, 0, 2] },
      { id: "tgt", label: "M = 30", type: "db", pos: [-7, 0, -2], color: "#c084fc" },
      { id: "root", label: "s=0 r=73", type: "point", pos: [2, 0, 7] },
      { id: "inc5", label: "s=5 r=68", type: "worker", pos: [0, 0, 4], showAt: 1, color: "#4ade80" },
      { id: "inc10", label: "s=15 r=58", type: "worker", pos: [0, 0, 1], showAt: 2, color: "#4ade80" },
      { id: "inc12", label: "s=27 r=46", type: "worker", pos: [0, 0, -2], showAt: 3, color: "#fb923c" },
      { id: "inc13", label: "s=40 kill", type: "server", pos: [-3, 0, -5], showAt: 3, color: "#f87171" },
      { id: "ex12", label: "s=15 skip12", type: "worker", pos: [4, 0, -2], showAt: 4, color: "#60a5fa" },
      { id: "inc15", label: "s=30 hit", type: "cache", pos: [4, 0, -5], showAt: 5, color: "#4ade80" },
      { id: "ex18", label: "s=27 r=0 kill", type: "server", pos: [8, 0, -5], showAt: 4, color: "#f87171" },
      { id: "n0", label: "x[i]=1 include", type: "note", pos: [8, 0, 7] },
      { id: "n1", label: "x[i]=0 exclude", type: "note", pos: [8, 0, 5] },
      { id: "n2", label: "s+w[k] ≤ 30", type: "note", pos: [8, 0, 2], showAt: 3 },
      { id: "n3", label: "s+r ≥ 30", type: "note", pos: [8, 0, 0], showAt: 4 },
      { id: "n4", label: "x=(1,1,0,0,1,0)", type: "note", pos: [8, 0, -7], showAt: 5 }
    ],
    edges: [
      { from: "w5", to: "tgt", dashed: true },
      { from: "w10", to: "tgt", dashed: true },
      { from: "w15", to: "tgt", dashed: true },
      { from: "root", to: "inc5", showAt: 1, label: "incl 5" },
      { from: "inc5", to: "inc10", showAt: 2, label: "incl 10" },
      { from: "inc10", to: "inc12", showAt: 3, label: "incl 12" },
      { from: "inc12", to: "inc13", showAt: 3, label: "incl 13" },
      { from: "inc10", to: "ex12", showAt: 4, label: "excl 12" },
      { from: "ex12", to: "inc15", showAt: 5, label: "incl 15" },
      { from: "inc12", to: "ex18", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Exact 30 from six weights",
        text: "w = (5, 10, 12, 13, 15, 18), M = 30, total 73. Each weight is a bit: include or exclude. Several subsets work; list them all with backtracking, not knapsack DP.",
        highlight: ["w5", "w10", "w12", "w13", "w15", "w18", "tgt", "n0", "n1"]
      },
      {
        title: "Include 5: node (5, 68)",
        text: "DFS takes the include child first. Sum so far 5, remaining 68. The implicit tree is binary, height 6, 2^n paths if unbounded.",
        highlight: ["w5", "root", "inc5", "n0"],
        flows: [
          { from: "root", to: "inc5", color: "#4ade80", label: "x1=1" }
        ]
      },
      {
        title: "Include 10: node (15, 58)",
        text: "Still promising: 15 ≤ 30 and 15+58 ≥ 30. Continue left, include-first. The pair (s, r) on each node is what the bounds will read.",
        highlight: ["w5", "w10", "inc5", "inc10"],
        flows: [
          { from: "inc5", to: "inc10", color: "#4ade80", label: "x2=1" }
        ]
      },
      {
        title: "Include 12 then 13: 40 > 30, kill",
        text: "27 + 13 = 40, which already passes M. Bound 1 kills the include-13 child. Anything heavier down that spine is wasted work — that is the point of the bound.",
        highlight: ["inc12", "inc13", "w13", "n2"],
        fail: ["inc13"],
        flows: [
          { from: "inc10", to: "inc12", color: "#fb923c", label: "x3=1" },
          { from: "inc12", to: "inc13", color: "#f87171", label: "kill" }
        ]
      },
      {
        title: "Exclude leftovers that cannot reach 30",
        text: "After 5+10+12 = 27, skipping 13, 15, and 18 leaves r = 0. 27 < 30, so bound 2 kills the empty-remainder node. Too light is as fatal as too heavy.",
        highlight: ["ex18", "n3", "inc12"],
        fail: ["ex18", "inc13"],
        flows: [
          { from: "inc12", to: "ex18", color: "#f87171", label: "s+r<M" }
        ]
      },
      {
        title: "Back up, skip 12, include 15: hit 30",
        text: "From (15, 58) exclude 12, then exclude 13, include 15: 15+15 = 30. Vector (1,1,0,0,1,0). First live leaf. Other subsets (12+18, 5+12+13) exist; keep DFS if you need them all.",
        highlight: ["w5", "w10", "w15", "ex12", "inc15", "tgt", "n4"],
        fail: ["inc13", "ex18"],
        flows: [
          { from: "inc10", to: "ex12", color: "#60a5fa", label: "x3=0" },
          { from: "ex12", to: "inc15", color: "#4ade80", label: "x5=1" },
          { from: "w5", to: "tgt", color: "#4ade80", label: "5" },
          { from: "w10", to: "tgt", color: "#4ade80", label: "10" },
          { from: "w15", to: "tgt", color: "#4ade80", label: "15" }
        ]
      },
      {
        title: "DFS / preorder, still O(2^n)",
        text: "The walk is include then exclude — binary preorder. Recursive because it is DFS. Bounds cut work on this instance; the complexity class stays exponential in n.",
        highlight: ["root", "inc5", "inc10", "ex12", "inc15", "n4"]
      }
    ]
  }
});
