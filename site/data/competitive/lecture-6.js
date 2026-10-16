window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 6,
  title: "Segment Tree - Range Queries with Lazy Updates",
  video: "https://www.youtube.com/watch?v=CN0N1ddJ9hA",
  category: "Competitive Programming",
  tagline: "Heads/tails: point and range flip, range sum, all in O(log n) with lazy.",
  summary: "An array of coins (1 = head, 0 = tail) must support flipping index i and counting heads on [L,R]. A raw array is O(1) update / O(n) query; prefix sums reverse that. Both are Θ(QN). A segment tree pads to a power of two, stores child sums, builds in O(n), and answers point flips and range sums in O(log n). Range flips stay O(log n) by storing a flipped flag and pushing it only when a later query must walk through the node — lazy propagation.",

  theory: [
    {
      heading: "Heads, tails, two operations",
      body: "Each cell is a coin: <b>head = 1</b>, <b>tail = 0</b>. Operation 1: flip the coin at index i. Operation 2: given L and R, report how many heads sit on that segment — the sum of the ones. That pair (point update, range sum) is the classic reason a plain array is not enough, and it is the running problem for the whole lecture.",
      bullets: [
        "Flip is a toggle, not a set-to-one.",
        "A range query is a count of heads, i.e. a sum.",
        "Q mixed operations on an array of size n."
      ]
    },
    {
      heading: "Two array baselines, both Θ(QN)",
      body: "Store the coins themselves: a flip is O(1), a query walks L..R in O(n). Or store a <b>prefix frequency</b> F[i] = heads in 1..i (1-based). Then heads on [L,R] = <code>F[R] − F[L−1]</code>, which is O(1). Worked: F = [0,1,1,2,3] answers [2,4] as F[4]−F[1] = 2−0 = 2. The catch is an update: flipping index 2 forces every F[j] for j ≥ 2 to change — O(n). You only moved the linear work onto the other operation. Worst case over Q ops is still <b>O(QN)</b>, which will not pass.",
      bullets: [
        "Raw array: fast write, slow range.",
        "Prefix: fast range, slow write (suffix of F must move).",
        "Need both ops sublinear in n."
      ]
    },
    {
      heading: "Pad to a power of two, empty = 0",
      body: "Segment trees in this talk are <b>complete binary trees</b>: every node has two children or is a leaf. If n is not a power of two, grow the leaf layer to the next 2^k. For n = 9 that is 16 (2^4). The extra cells get an <b>empty value</b> that does not change the query. Here the query is a sum of heads, so empty is <b>0</b> (extra tails). If each node stored a frequency map, empty would be an empty map. Identity of the combine operator is the rule; it is problem-dependent.",
      bullets: [
        "Leaf count becomes 2^⌈log2 n⌉ ≤ 2n.",
        "Empty for a sum of heads is 0.",
        "Parents store the combine of their two children — here, +."
      ]
    },
    {
      heading: "Build is a geometric series: O(n)",
      body: "The leaf layer has size at most 2n. The layer above has n, then n/2, …, down to 1. Sum = 2n × (1 + 1/2 + 1/4 + …) = 2n / (1 − 1/2) = <b>4n</b>. Building the tree is therefore O(n), paid once. Each parent is the sum of its two children, which is exactly the number of heads in that node's segment of responsibility: the root owns 1..16 (or 1..8 on a size-8 picture), its left child 1..8, the node 3–4 owns only those two leaves, and so on.",
      bullets: [
        "4n nodes in the heap layout, still Θ(n).",
        "Node u is responsible for a contiguous segment of the array.",
        "Root is asked first on every range query."
      ]
    },
    {
      heading: "Point flip, then bubble",
      body: "To flip index 7 you start at that leaf, toggle 0 → 1, then walk to the root. Each parent re-reads left + right: the lecture's path becomes 1, then 1+1 = 2, then 1+2 = 3, then 2+3 = 5, then 5+0 = 5 (the padded half stays 0). Only <b>O(log n)</b> nodes change — the path. That is slower than the raw-array O(1) flip, and that is the trade you make for a fast range.",
      bullets: [
        "Update the leaf, then repair each ancestor.",
        "O(log n) writes, one per level.",
        "Build once O(n); each flip O(log n)."
      ]
    },
    {
      heading: "Range query: miss, cover, or split",
      body: "Ask the root for heads on [3,7]. Three cases at a node whose segment is [lo,hi]: <b>no overlap</b> with [L,R] → return empty (0) and do not recurse; <b>fully inside</b> [L,R] → return the stored sum, do not walk into children; <b>partial overlap</b> → send the same [L,R] to both children and add. [1,2] misses [3,7] and returns 0. [3,4] is covered and returns 1 without visiting its leaves. [5,6] is covered (1). [7,8] splits: leaf 7 is in (1), leaf 8 is out (0). The right half [9,16] misses. The pieces add to <b>3</b>. It looks like a lot of calls; it is still O(log n) because a contiguous query can fully cover a parent instead of its two children, and a miss stops a whole subtree. Widen or shrink [L,R] by one and whole branches disappear.",
      bullets: [
        "Disjoint → 0. Covered → node.sum. Else both children.",
        "Worked [3,7] = 3 after the index-7 flip.",
        "Point flip and range sum are both O(log n)."
      ]
    },
    {
      heading: "Range flip, and why a flag exists",
      body: "Now the update is \"flip every coin on [L,R]\". Walking to every leaf is O(n) and kills the structure. If a node's whole segment sits inside [L,R], it can take the update itself: new heads = <code>(count of coins) − (current heads)</code>, because every tail becomes a head and every head a tail. Then it sets a boolean <b>flipped</b> and <i>does not</i> recurse. Worked on size 8, flip [1,3]: node [1,2] is fully covered, toggles its sum, raises flipped, returns; leaf 3 is fully covered and flips; leaf 4 misses; parents re-sum from children (the root's right child [5,8] misses). The tree stays consistent with the three coins that should now be heads, in O(log n) nodes.",
      bullets: [
        "Full cover: sum = length − sum, set flipped, stop.",
        "Miss: do nothing. Partial: recurse, then re-sum.",
        "Without the stop-on-cover rule, a range update is linear."
      ]
    },
    {
      heading: "Push: lazy propagation",
      body: "After that range flip, a query for [1,1] would read the old leaf if you descended blindly — the flip still lives on parent [1,2]. So before a node talks to its children, it <b>pushes</b>: clear its own flipped flag, and apply the same toggle to both children (length−sum, and toggle <i>their</i> flags). Leaf 1 becomes 0, leaf 2 becomes 1, and [1,1] now answers 0. Leaf flags are unused in practice (you always return at a leaf) but the code treats every node the same because the tree is one array of nodes. Passing work to children <b>only when a later operation must go there</b> is <b>lazy propagation</b>. It is the same idea on any range structure, not only segment trees. Range update joins range query at O(log n).",
      bullets: [
        "Push before recursing: apply, toggle child flags, clear self.",
        "Query [1,1] is the edge case that forces a push.",
        "Lazy = defer child work until someone walks through you."
      ]
    }
  ],

  keyTerms: [
    { term: "Empty value", def: "Identity of the combine (0 for a head-count) used to pad to 2^k." },
    { term: "Responsibility", def: "The contiguous index range a node owns; root owns the whole padded array." },
    { term: "Cover / miss / split", def: "Fully inside the query, disjoint from it, or overlapping so both children run." },
    { term: "Point flip", def: "Toggle one leaf and repair the O(log n) ancestors by re-summing." },
    { term: "Range flip", def: "Toggle every coin on [L,R]; full-cover nodes stop and set a flag." },
    { term: "Flipped flag", def: "Boolean: this node's segment has a pending toggle not yet pushed down." },
    { term: "Lazy propagation", def: "Push pending flags to children only when an op must visit them." },
    { term: "O(log n) both ways", def: "After an O(n) build, point/range update and range query are all logarithmic." }
  ],

  tradeoffs: [
    { pro: "Raw array flip is O(1).", con: "Range count is O(n); Q of them is O(QN)." },
    { pro: "Prefix F[R]−F[L−1] is O(1).", con: "A flip rebuilds a suffix of F in O(n)." },
    { pro: "Segment tree: both ops O(log n), build 4n.", con: "Point updates are slower than O(1); you store ~4n nodes and pad to 2^k." },
    { pro: "Lazy flags keep range flips logarithmic.", con: "Forgetting to push before a child walk returns stale leaf values." }
  ],

  interviewTips: [
    "Quote the two baselines first (O(1)/O(n) vs O(n)/O(1)) and say both are O(QN) — that is why the tree exists.",
    "Pad to the next 2^k and name the empty value (0 for a sum of heads).",
    "Build cost: leaves ≤ 2n, geometric series sums to 4n = O(n).",
    "Range query cases out loud: miss → 0, cover → node.sum, else add both children.",
    "Range flip: full cover does length−sum and sets flipped; never walk to every leaf.",
    "Say 'push before recurse' and give query [1,1] after flip [1,3] as the stale-leaf trap."
  ],

  scene: {
    nodes: [
      { id: "l1", label: "1", type: "point", pos: [-10.5, 0, -6], color: "#4ade80" },
      { id: "l2", label: "0", type: "point", pos: [-7.5, 0, -6], color: "#64748b" },
      { id: "l3", label: "0", type: "point", pos: [-4.5, 0, -6], color: "#64748b" },
      { id: "l4", label: "1", type: "point", pos: [-1.5, 0, -6], color: "#4ade80" },
      { id: "l5", label: "1", type: "point", pos: [1.5, 0, -6], color: "#4ade80" },
      { id: "l6", label: "0", type: "point", pos: [4.5, 0, -6], color: "#64748b" },
      { id: "l7", label: "0", type: "point", pos: [7.5, 0, -6], color: "#64748b" },
      { id: "l8", label: "1", type: "point", pos: [10.5, 0, -6], color: "#4ade80" },
      { id: "p12", label: "1-2:1", type: "server", pos: [-9, 0, -2], showAt: 2 },
      { id: "p34", label: "3-4:1", type: "server", pos: [-3, 0, -2], showAt: 2 },
      { id: "p56", label: "5-6:1", type: "server", pos: [3, 0, -2], showAt: 2 },
      { id: "p78", label: "7-8:1", type: "server", pos: [9, 0, -2], showAt: 2 },
      { id: "q14", label: "1-4:2", type: "service", pos: [-6, 0, 2], showAt: 2 },
      { id: "q58", label: "5-8:2", type: "service", pos: [6, 0, 2], showAt: 2 },
      { id: "rt", label: "1-8:4", type: "lb", pos: [0, 0, 6], showAt: 2 },
      { id: "flg", label: "flipped", type: "cache", pos: [-9, 0, 2], showAt: 6, color: "#fb923c" },
      { id: "n0", label: "head=1 tail=0", type: "note", pos: [-10, 0, 6] },
      { id: "n1", label: "F[R]-F[L-1] O(1)", type: "note", pos: [10, 0, 6], showAt: 1 },
      { id: "n2", label: "build 4n = O(n)", type: "note", pos: [10, 0, 2], showAt: 2 },
      { id: "n3", label: "flip 7, path log n", type: "note", pos: [0, 0, -2], showAt: 3 },
      { id: "n4", label: "[3,7] miss/cover/split", type: "note", pos: [0, 0, 2], showAt: 4 },
      { id: "n5", label: "answer 3", type: "note", pos: [0, 0, -2], showAt: 5 },
      { id: "n6", label: "sum = len - sum", type: "note", pos: [0, 0, -8], showAt: 6 },
      { id: "n7", label: "push, then [1,1]", type: "note", pos: [6, 0, 7], showAt: 7 }
    ],
    edges: [
      { from: "l1", to: "l2" },
      { from: "l2", to: "l3" },
      { from: "l3", to: "l4" },
      { from: "l4", to: "l5" },
      { from: "l5", to: "l6" },
      { from: "l6", to: "l7" },
      { from: "l7", to: "l8" },
      { from: "p12", to: "l1", showAt: 2 },
      { from: "p12", to: "l2", showAt: 2 },
      { from: "p34", to: "l3", showAt: 2 },
      { from: "p34", to: "l4", showAt: 2 },
      { from: "p56", to: "l5", showAt: 2 },
      { from: "p56", to: "l6", showAt: 2 },
      { from: "p78", to: "l7", showAt: 2 },
      { from: "p78", to: "l8", showAt: 2 },
      { from: "q14", to: "p12", showAt: 2 },
      { from: "q14", to: "p34", showAt: 2 },
      { from: "q58", to: "p56", showAt: 2 },
      { from: "q58", to: "p78", showAt: 2 },
      { from: "rt", to: "q14", showAt: 2 },
      { from: "rt", to: "q58", showAt: 2 },
      { from: "flg", to: "p12", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Coins and two ops",
        text: "Eight coins, head=1 and tail=0. You may flip index i, or count heads on [L,R]. That pair is the whole problem. A linear scan of the range is the obvious query and it is already too slow for large Q.",
        highlight: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "n0"]
      },
      {
        title: "Array vs prefix, both O(QN)",
        text: "Flip in the raw array is O(1); the range walk is O(n). Prefix heads F[i] answers F[R]−F[L−1] in O(1), but a flip at i rewrites every F[j], j≥i. You only swapped which operation is linear. Worst case stays QN.",
        highlight: ["l1", "l2", "l3", "l4", "l5", "n1"],
        hide: ["n0"],
        flows: [
          { from: "l1", to: "l4", color: "#60a5fa", label: "scan / prefix" }
        ]
      },
      {
        title: "Pad, parent = sum, build 4n",
        text: "Grow the leaf layer to a power of two (9→16 in the talk; here 8 is already 2^3). Empty cells are 0. Each parent stores the head-count of its segment. Layers 2n + n + n/2 + … = 4n, so build is O(n). Root owns 1..8.",
        highlight: ["rt", "q14", "q58", "p12", "p34", "p56", "p78", "n2"],
        hide: ["n0", "n1"]
      },
      {
        title: "Flip index 7, bubble up",
        text: "Leaf 7 toggles 0→1. Ancestors re-sum: 7–8 becomes 2, 5–8 becomes 3, root becomes 5 on the lecture's padded tree (right pad stays 0). Only the path changes — O(log n), slower than a raw O(1) write, on purpose.",
        highlight: ["l7", "p78", "q58", "rt", "n3"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "l7", to: "p78", color: "#fb923c", label: "1" },
          { from: "p78", to: "q58", color: "#fb923c", label: "up" },
          { from: "q58", to: "rt", color: "#fb923c", label: "up" }
        ]
      },
      {
        title: "Query [3,7]: miss, cover, split",
        text: "Root overlaps, so both halves run. [1,2] misses → 0. [3,4] is fully inside → return 1, skip the leaves. [5,6] covered → 1. [7,8] splits: 7 in, 8 out. Padded right miss → 0. Pieces add to 3. Contiguous ranges make whole parents return, so this is still O(log n).",
        highlight: ["rt", "q14", "p34", "p56", "p78", "l7", "n4"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "rt", to: "q14", color: "#60a5fa", label: "[3,7]" },
          { from: "p34", to: "q14", color: "#4ade80", label: "cover 1" },
          { from: "l7", to: "p78", color: "#4ade80", label: "in" }
        ]
      },
      {
        title: "Range sum is O(log n)",
        text: "Widen [3,7] and a parent that you split would have been a cover; shrink it and a cover becomes a miss. Both point flip and range sum sit at O(log n). The remaining problem is flipping a whole range without touching every leaf.",
        highlight: ["rt", "p34", "p56", "l7", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"]
      },
      {
        title: "Range flip [1,3]: stop on cover",
        text: "Node [1,2] sits inside [1,3]: new heads = 2 − 1 = 1, set flipped, do not go down. Leaf 3 is covered and toggles. Leaf 4 misses. Parents re-sum. If you had pushed the flip to every leaf, a range update would be O(n).",
        highlight: ["p12", "l3", "flg", "q14", "rt", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "rt", to: "q14", color: "#fb923c", label: "flip" },
          { from: "q14", to: "p12", color: "#fb923c", label: "cover" }
        ]
      },
      {
        title: "Push lazy, then query [1,1]",
        text: "[1,1] must read a leaf, so [1,2] pushes: drop its flag, toggle both children (1→0 and 0→1). Now [1,1] is 0, matching the three flipped coins. Work is handed to children only when someone walks through — lazy propagation. Range update is O(log n) too.",
        highlight: ["p12", "l1", "l2", "flg", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "flg", to: "p12", color: "#fb923c", label: "push" },
          { from: "p12", to: "l1", color: "#c084fc", label: "0" },
          { from: "p12", to: "l2", color: "#c084fc", label: "1" }
        ]
      }
    ]
  }
});
