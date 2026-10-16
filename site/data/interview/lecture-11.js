window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 11,
  title: "Meet in the Middle Algorithm",
  video: "https://www.youtube.com/watch?v=57SUNQL4JFA",
  category: "Interview Prep",
  tagline: "Split the search, enumerate both halves, join with a hash or a sorted prefix.",
  summary: "Four nested loops that pick a, b, c, d summing to S are O(n^4). Pair them into X = a+b and Y = c+d, enumerate both n² pair-sums, and test X = S−Y in a hash set: O(n²). The same split turns 0/1 knapsack from 2^n into O(n · 2^{n/2}) after you sort one half by weight and prefix-max its prices. Use it when the exponent is ~40–60, not 100.",

  theory: [
    {
      heading: "Four numbers, one sum, a quartic brute force",
      body: "Array P has n numbers. You want four of them — a, b, c, d — such that <code>a + b + c + d = S</code>. The honest nested search walks every tuple: n choices for a, n for b, n for c, n for d. That is <b>O(n⁴)</b>. Meet-in-the-middle is the cousin of divide-and-conquer that does not recurse into a pretty tree; it cuts the <i>search space</i> in half, solves each half completely, and joins the answers with a cheap dictionary.",
      bullets: [
        "One sum S, four picks from the same array.",
        "Brute force is four nested n-loops.",
        "The fix is a split, not a smarter fourth loop."
      ]
    },
    {
      heading: "Rename the halves X and Y",
      body: "Write <code>X = a + b</code> and <code>Y = c + d</code>. The equation becomes <code>X + Y = S</code>, or <code>X = S − Y</code>. X can take at most n² values (every pair a, b). Y takes the same n². If you materialize every possible X, and every possible α = S − Y, a hit in the intersection is a solution. The algebra is the whole trick: four nested picks collapsed into two pair-enumerations plus a join.",
      bullets: [
        "X ranges over pair sums of P.",
        "α ranges over S minus pair sums of P.",
        "Any common value is a 4-tuple that sums to S."
      ]
    },
    {
      heading: "Enumerate pairs, then intersect",
      body: "Double loop i, then j > i (or whatever the uniqueness rules are), push <code>P[i] + P[j]</code> into set X. Same loops, push <code>S − (P[i] + P[j])</code> into set α. Both sets have size O(n²). Intersection: sort both and scan, or — faster to write — dump one side into a <b>hash set</b> and probe the other in expected O(1) per key. n² probes are <b>O(n²)</b> total, down from n⁴. If the interviewer wants the actual a, b, c, d, store a <b>map</b> from pair-sum to one (or many) index pairs, not a bare set. The session points at that map in the description code.",
      bullets: [
        "Build X in O(n²).",
        "Build α in O(n²).",
        "Hash lookup per X-value: expected O(1), overall O(n²)."
      ]
    },
    {
      heading: "The general exponent cut",
      body: "Abstractly you take a problem whose brute force is <code>a^B</code> (B nested choices, a options each), split B into two blocks of B/2, enumerate each block, and merge with an <b>aggregate</b> — sum, min, max, average, anything a database would call an aggregate. Complexity becomes about <code>a^{B/2}</code> times a cheap join, not <code>a^B</code>. The merge only stays cheap when the halves are independent except through that aggregate. This is useless if B is 100: 2¹⁰⁰ halved is still 2⁵⁰, which no machine enumerates. It is the right tool when B sits near <b>40–60</b>, so 2³⁰-class work finishes in about a second.",
      bullets: [
        "Cut the exponent in half, then join.",
        "Join with an aggregate (sum, min, max), not with another exponential search.",
        "Sweet spot: n around 40, not 100."
      ]
    },
    {
      heading: "0/1 knapsack when W is enormous",
      body: "n items, each a (weight, price) pair, capacity W, maximize price. Classic brute force is <b>2^n</b> subsets. Classic DP is <code>O(n W)</code> — polynomial-looking until W is 2⁵⁰, at which point the table is fantasy. Split the n items into two piles of n/2. Enumerate every subset of the left pile (2^{n/2} entries) as a pair (total weight, total price). Same for the right pile. The two piles do not share items, so a full answer is one left pair plus one right pair.",
      bullets: [
        "DP dies when W is exponential.",
        "Each half is 2^{n/2} (weight, price) records.",
        "A feasible pair: wL + wR ≤ W, score pL + pR."
      ]
    },
    {
      heading: "Naive merge is 2^n again — sort and prefix-max",
      body: "Checking every left record against every right record is 2^{n/2} × 2^{n/2} = 2^n, back to brute force. Fix the right table: <b>sort by total weight</b>. For a left weight wL the legal right weights are ≤ <code>W − wL</code>. Among those, you want the <b>maximum price</b>, not every row. After the sort, walk once and store a prefix maximum of price — at index i, the best price among all right subsets whose weight is ≤ the i-th weight. For each left pair, binary-search the last legal right index and read that prefix. One log per left record.",
      bullets: [
        "Sort right by weight: O(2^{n/2} · n).",
        "Prefix maximum of price: linear in the half-size.",
        "Binary search per left record, not a nested 2^{n/2} scan."
      ]
    },
    {
      heading: "The knapsack bound, and cousins",
      body: "Generating both halves is 2 × 2^{n/2}. Sorting one half is 2^{n/2} · (n/2) because log(2^{n/2}) = n/2. Prefix-max is another 2^{n/2}. Binary search for every left record is 2^{n/2} · (n/2). Hide the constants: <b>O(n · 2^{n/2})</b>. For n = 40, 2⁴⁰ is a timeout on typical judges (~30s in the talk); n · 2²⁰ is not. Related trick: <b>bidirectional BFS</b> (search from start and from goal, meet in the middle). Travelling salesman is named as a 'probably will not help' extra — do not force the pattern onto TSP in an interview.",
      bullets: [
        "Knapsack MITM: O(n · 2^{n/2}), not O(n 2^n).",
        "Bidirectional BFS is the graph-search cousin.",
        "Leave TSP alone unless you have a real split."
      ]
    }
  ],

  keyTerms: [
    { term: "Meet in the middle", def: "Enumerate two halves of the search space fully, then join them cheaper than enumerating the product." },
    { term: "Pair-sum set X", def: "All a+b values; size O(n²) for 4-sum." },
    { term: "α = S − Y", def: "The complementary pair-sums; a hit in X ∩ α is a solution." },
    { term: "Hash join", def: "Expected O(1) lookup of X inside α (or the reverse) instead of another n² nested loop." },
    { term: "Aggregate merge", def: "Combine halves with sum / min / max so you do not re-search the product space." },
    { term: "Half-knapsack", def: "All 2^{n/2} subset (weight, price) pairs of n/2 items." },
    { term: "Prefix max price", def: "After sorting by weight, best price among all subsets no heavier than this row." },
    { term: "O(n · 2^{n/2})", def: "Knapsack MITM bound after sort + binary search; usable near n = 40." }
  ],

  tradeoffs: [
    { pro: "4-sum drops from n⁴ to n² with a hash set of pair sums.", con: "You store O(n²) sums; memory can be the hidden limit." },
    { pro: "A map from sum to index pairs recovers a, b, c, d, not just a yes.", con: "Lists of colliding pairs add code and can blow memory if many collisions." },
    { pro: "Knapsack MITM survives huge W where O(n W) DP cannot allocate.", con: "Still exponential in n/2 — n = 100 is dead even after the split." },
    { pro: "Sort + prefix-max + binary search avoids a 2^n merge.", con: "Easy to prefix-min by accident; the objective is max price among light-enough rows." }
  ],

  interviewTips: [
    "Start from the n⁴ loops, write X=a+b and X=S−Y, then say hash intersection — that ladder is the answer.",
    "If they want the tuples, switch the set to a map of sum → pair of indices.",
    "Quote the general cut a^B → a^{B/2} and the n≈40–60 window; 2^100 halved is still impossible.",
    "For knapsack, reject O(n W) when W is 2^50, split items, and name prefix-max not prefix-min.",
    "State O(n · 2^{n/2}) with the sort and the per-left binary search in the bound.",
    "Offer bidirectional BFS as a cousin; do not drag TSP into the pitch."
  ],

  scene: {
    nodes: [
      { id: "arr", label: "P, size n", type: "db", pos: [-10, 0, -2] },
      { id: "sum", label: "target S", type: "gateway", pos: [0, 0, -2] },
      { id: "brut", label: "O(n^4)", type: "server", pos: [10, 0, -2] },
      { id: "ab", label: "a+b = X", type: "service", pos: [-10, 0, 3], showAt: 1 },
      { id: "hs", label: "hash ∩", type: "lb", pos: [0, 0, 3], showAt: 3 },
      { id: "cd", label: "c+d = Y", type: "service", pos: [10, 0, 3], showAt: 1 },
      { id: "xs", label: "X set n^2", type: "cache", pos: [-5, 0, 6], showAt: 2 },
      { id: "al", label: "S−Y set", type: "cache", pos: [5, 0, 6], showAt: 2 },
      { id: "lft", label: "n/2 items", type: "worker", pos: [-10, 0, 6], showAt: 5 },
      { id: "rgt", label: "n/2 items", type: "worker", pos: [10, 0, 6], showAt: 5 },
      { id: "n0", label: "four nested loops", type: "note", pos: [-8, 3, -7] },
      { id: "n1", label: "X = S − Y", type: "note", pos: [0, 3, -7], showAt: 1 },
      { id: "n2", label: "build both in n^2", type: "note", pos: [8, 3, -7], showAt: 2 },
      { id: "n3", label: "lookup O(1) each", type: "note", pos: [-8, 3, 8], showAt: 3 },
      { id: "n4", label: "B ≈ 40–60 only", type: "note", pos: [0, 3, 8], showAt: 4 },
      { id: "n5", label: "sort + prefix max", type: "note", pos: [8, 3, 8], showAt: 6 },
      { id: "n6", label: "n · 2^{n/2}", type: "note", pos: [8, 3, -4], showAt: 7 }
    ],
    edges: [
      { from: "arr", to: "brut", label: "a,b,c,d" },
      { from: "arr", to: "ab", showAt: 1 },
      { from: "arr", to: "cd", showAt: 1 },
      { from: "sum", to: "al", showAt: 2, dashed: true },
      { from: "ab", to: "xs", showAt: 2 },
      { from: "cd", to: "al", showAt: 2 },
      { from: "xs", to: "hs", showAt: 3 },
      { from: "al", to: "hs", showAt: 3 },
      { from: "arr", to: "lft", showAt: 5, dashed: true },
      { from: "arr", to: "rgt", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Four loops, n to the fourth",
        text: "Pick a, then b, then c, then d from P so they sum to S. Each pick is n, so the product is O(n⁴). That is the board you are expected to throw away.",
        highlight: ["arr", "sum", "brut", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "arr", to: "brut", color: "#f87171", label: "n^4" }
        ]
      },
      {
        title: "Split into two pair-sums",
        text: "X = a+b, Y = c+d, demand X+Y = S, rewrite X = S−Y. Four picks become two independent pair problems that still know S.",
        highlight: ["ab", "cd", "sum", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "arr", to: "ab", color: "#4ade80", label: "pairs" },
          { from: "arr", to: "cd", color: "#60a5fa", label: "pairs" }
        ]
      },
      {
        title: "Materialize both n² sets",
        text: "Double-loop every pair into X. Double-loop every pair into α = S−Y. Each set has size O(n²). The exponential (quartic) part is over.",
        highlight: ["xs", "al", "ab", "cd", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "ab", to: "xs", color: "#4ade80", label: "n^2" },
          { from: "cd", to: "al", color: "#60a5fa", label: "n^2" }
        ]
      },
      {
        title: "Hash the intersection",
        text: "Probe every X in a hash set of α (or the reverse). Expected O(1) per key, O(n²) total. Use a map from sum to index pairs if they want a, b, c, d on the board.",
        highlight: ["hs", "xs", "al", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6"],
        flows: [
          { from: "xs", to: "hs", color: "#c084fc", label: "X" },
          { from: "al", to: "hs", color: "#c084fc", label: "α" }
        ]
      },
      {
        title: "Only when the exponent is small",
        text: "In general a^B becomes about a^{B/2} after a split-and-aggregate merge. 2^60 → 2^30 is live; 2^100 halved is still fantasy. Quote n around 40–60 as the window.",
        highlight: ["brut", "hs", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6"],
        flows: [
          { from: "brut", to: "hs", color: "#fb923c", label: "B/2" }
        ]
      },
      {
        title: "Knapsack: two piles of n/2",
        text: "When W is huge, O(n W) DP cannot allocate. Split items, enumerate 2^{n/2} (weight, price) pairs on each side. A full packing is one left pair plus one right pair with wL+wR ≤ W.",
        highlight: ["lft", "rgt", "arr"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "ab", "cd", "xs", "al", "hs"],
        flows: [
          { from: "arr", to: "lft", color: "#4ade80", label: "half" },
          { from: "arr", to: "rgt", color: "#4ade80", label: "half" }
        ]
      },
      {
        title: "Sort, prefix-max, binary search",
        text: "A nested 2^{n/2}×2^{n/2} merge is 2^n again. Sort the right pile by weight, store prefix maximum price, and for each left wL binary-search W−wL. Objective is max price, not min.",
        highlight: ["lft", "rgt", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6", "ab", "cd", "xs", "al", "hs", "brut"],
        flows: [
          { from: "lft", to: "rgt", color: "#fb923c", label: "binsearch" }
        ]
      },
      {
        title: "Bound: n times 2 to the n/2",
        text: "Generate, sort, prefix, and search all hide under O(n · 2^{n/2}). n=40 times out on 2^n and survives here. Bidirectional BFS is the same idea on graphs; TSP usually is not.",
        highlight: ["lft", "rgt", "sum", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "ab", "cd", "xs", "al", "hs", "brut"],
        flows: [
          { from: "lft", to: "sum", color: "#4ade80", label: "best p" },
          { from: "rgt", to: "sum", color: "#4ade80", label: "w ≤ W" }
        ]
      }
    ]
  }
});
