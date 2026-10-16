window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 5,
  title: "Median of Medians - Order Statistics",
  video: "https://www.youtube.com/watch?v=fcf56RTbkHc",
  category: "Interview Prep",
  tagline: "A pivot that is never too extreme turns quickselect into worst-case O(n).",
  summary: "The median is the n/2-th order statistic. Partition like quicksort and recurse on one side: expected linear time, quadratic if every pivot is an extreme. Median-of-medians builds a pivot from groups of five so a constant fraction of the array is discarded each time, and selection is O(n) even in the worst case.",

  theory: [
    {
      heading: "Median as an order statistic",
      body: "Given an unordered array, the <b>median</b> is the middle value after a sort: the element that would sit at index <code>n/2</code> (integer division). That is a special case of the <b>k-th order statistic</b> — the k-th smallest — so the same algorithm finds any rank, not just the middle. The lecture's nine-element list sorts to <code>-6, 1, 4, 7, 12, 14, 18, 19, 28</code>. Here n = 9, so <code>n/2 = 4</code> and the median is <b>12</b>. A full sort would work in <code>O(n log n)</code>, but you do not need the whole order to name one rank.",
      bullets: [
        "k = n/2 for the median; any k is an order statistic.",
        "Worked array length 9; sorted index 4 holds 12.",
        "Sorting is the blunt tool; selection can be cheaper."
      ]
    },
    {
      heading: "Quickselect: partition, then one recursive call",
      body: "Treat it like one step of quicksort. Pick a <b>pivot</b> (people often grab the first cell), then rearrange so every smaller value sits on its left and every larger value on its right. After that pass the pivot's index <code>X</code> is its true rank. If <code>X = k</code>, you are done. If <code>X &lt; k</code>, the answer lives on the <b>right</b> and you look for rank <code>k - X</code> (or <code>k - X - 1</code> if you exclude the pivot itself) in that slice. If <code>X &gt; k</code>, the answer lives on the <b>left</b> and you still want rank k there. You never recurse into both sides — that is the whole saving versus sort.",
      bullets: [
        "Example pivot 7: left {-6, 1, 4}, right {12, 14, 18, 19, 28}.",
        "Pivot lands at index 3, which is short of k = 4, so walk right; 12 is there.",
        "Same skeleton finds the k-th largest: only the target rank changes."
      ]
    },
    {
      heading: "Average O(n), worst O(n^2)",
      body: "Choosing the pivot is O(1). The partition walk is O(n). If the pivot usually lands near the middle, the next call sees about n/2 cells, then n/4, and so on. That geometric series sums to about <b>2n</b>, which is <code>O(n)</code>. The catch is the unlucky streak: if every pivot is the current minimum (or maximum), each call peels off one element and you pay n + (n-1) + (n-2) + … — an arithmetic series, <code>O(n^2)</code>. Quicksort has the same split personality. Random pivots make the quadratic path exponentially rare; they do not erase it.",
      bullets: [
        "Lucky: n + n/2 + n/4 + … ≤ 2n.",
        "Unlucky: n + (n-1) + … + 1 = Θ(n^2).",
        "The algorithm is the same; only pivot quality changes the sum."
      ]
    },
    {
      heading: "A constant-fraction discard is enough",
      body: "Write the next size as <code>n / r</code> for a fixed r &gt; 1. Then the work is n + n/r + n/r^2 + … = n · (1 / (1 - 1/r)), a constant times n. So you do <b>not</b> need a perfect middle. You only need a guarantee that each pivot throws away a <b>ratio</b> of the remaining cells. Median-of-medians does not change partition or the one-sided recurse. It only manufactures a pivot that is never an extreme.",
      bullets: [
        "Any fixed r &gt; 1 turns the recurrence into O(n).",
        "The pivot must skip Θ(n) elements, not Θ(1).",
        "Quickselect's code stays; the pivot subroutine is what you add."
      ]
    },
    {
      heading: "Groups of five, then median of those medians",
      body: "Chop the array into <b>chunks of five</b> (seven or nine also work; five is the classic proof). Sort each tiny chunk — insertion sort on five keys is a constant — and pick the middle, the third element. That is the chunk median. On a thirty-element picture the lecture's chunk medians are 3, 8, 13, 18, 23, 28. Now treat those n/5 medians as a new array and <b>recursively</b> take their median. Even if you pessimistically keep choosing the leftmost surviving median, a group of five already certifies two values below (or above) its middle. Recursing on the medians stacks those guarantees.",
      bullets: [
        "n/5 groups, each sorted in O(1) (about 5^2 comparisons).",
        "Chunk median = 3rd of 5. Recurse to pick the median of those.",
        "A size-5 median is already at least two elements away from either extreme."
      ]
    },
    {
      heading: "At least n/4 elements fall away",
      body: "The lecture's counting: each level of grouping skips a growing block (1, then 3+3, then larger powers of five). Summing that geometric series of chunk sizes shows you discard <b>at least n/4</b> elements relative to the pivot you finally partition on. Textbook BFPRT is the same idea with a tighter picture: at least about 3n/10 values are known to lie on each side, so the recursive select is on at most 7n/10 plus a T(n/5) call for the pivot itself. Either way the discarded piece is a constant fraction, which is the only lemma the O(n) proof needs.",
      bullets: [
        "Lecture bound: skip ≥ n/4, so r is a constant &gt; 1.",
        "Standard bound: T(n) = T(n/5) + T(7n/10) + O(n) = O(n).",
        "You still partition in linear time around that pivot, then recurse once."
      ]
    },
    {
      heading: "Building the pivot is still linear",
      body: "Sorting n/5 groups of five costs about 25 · (n/5) = 5n. The next median-of-medians call sees n/5 keys, then n/25, … so the extra work is 5n · (1 + 1/5 + 1/25 + …) = 5n · (5/4) = (25/4)n, which is <code>O(n)</code>. Fold that into each quickselect level (already O(n) of partitioning) and the total stays linear. You have traded a tiny constant-factor overhead for a <b>worst-case</b> O(n) selection algorithm. In practice a random or median-of-three pivot almost never hits the quadratic path; the construction matters theoretically, and as background for structures (the talk tees up wavelet trees) that need a true linear-time median.",
      bullets: [
        "Chunk sorts + recursive MoM = O(n) extra per level.",
        "Overall select is worst-case O(n), not merely expected O(n).",
        "Random pivot is what you code in an interview unless they ask for the guarantee."
      ]
    }
  ],

  keyTerms: [
    { term: "Order statistic", def: "The k-th smallest element. The median is the special case k = n/2." },
    { term: "Quickselect", def: "Partition around a pivot, then recurse only into the side that holds rank k." },
    { term: "Pivot rank X", def: "Index of the pivot after partition. Done if X = k; else recurse left or right." },
    { term: "Chunk of five", def: "A constant-size block you sort so its third element is a local median." },
    { term: "Median of medians", def: "Recursive median of those n/5 local medians; used as the partition pivot." },
    { term: "Constant-fraction skip", def: "A pivot that discards ≥ n/r elements for fixed r > 1, which keeps select linear." },
    { term: "BFPRT / MoM", def: "Worst-case linear-time selection; T(n) = T(n/5) + T(7n/10) + O(n)." },
    { term: "Expected vs worst", def: "Random quickselect is O(n) on average and O(n^2) on a sorted / adversarial array." }
  ],

  tradeoffs: [
    { pro: "Full sort: simple, and you get every order statistic.", con: "O(n log n) even when you only needed one rank." },
    { pro: "Random quickselect: tiny code, expected 2n comparisons.", con: "Adversarial pivots (sorted input, always first cell) are Θ(n^2)." },
    { pro: "Median of medians: true O(n) even in the worst case.", con: "Large constants; groups, sorts, and a recursive pivot make it slower in practice." },
    { pro: "Groups of 5 (or 7, 9): the proof goes through.", con: "Groups of 3 do not give a fraction small enough for the standard recurrence." }
  ],

  interviewTips: [
    "Define k = n/2 on the board before writing code; confirm 0-based vs 1-based rank.",
    "Start with quickselect. Walk pivot 7 on the n = 9 list until they see why you recurse only right.",
    "Say expected O(n) and worst O(n^2) in one breath — that is the hook for MoM.",
    "If they want a guarantee, sketch groups of 5, median of medians, skip ≥ n/4 (or 3n/10), T(n) = T(n/5)+T(7n/10)+O(n).",
    "Do not implement full MoM unless asked; median-of-three or a random pivot is the practical answer.",
    "Mention that the same pivot trick is why intro lectures on wavelet trees start here."
  ],

  scene: {
    nodes: [
      { id: "a0", label: "7", type: "point", pos: [-10, 0, 3], color: "#fb923c" },
      { id: "a1", label: "-6", type: "point", pos: [-7.5, 0, 3], color: "#60a5fa" },
      { id: "a2", label: "1", type: "point", pos: [-5, 0, 3], color: "#60a5fa" },
      { id: "a3", label: "4", type: "point", pos: [-2.5, 0, 3], color: "#60a5fa" },
      { id: "a4", label: "18", type: "point", pos: [0, 0, 3], color: "#4ade80" },
      { id: "a5", label: "12", type: "point", pos: [2.5, 0, 3], color: "#c084fc" },
      { id: "a6", label: "14", type: "point", pos: [5, 0, 3], color: "#4ade80" },
      { id: "a7", label: "19", type: "point", pos: [7.5, 0, 3], color: "#4ade80" },
      { id: "a8", label: "28", type: "point", pos: [10, 0, 3], color: "#4ade80" },
      { id: "m0", label: "3", type: "point", pos: [-10, 0, -3], color: "#c084fc", showAt: 5 },
      { id: "m1", label: "8", type: "point", pos: [-6, 0, -3], color: "#c084fc", showAt: 5 },
      { id: "m2", label: "13", type: "point", pos: [-2, 0, -3], color: "#fb923c", showAt: 5 },
      { id: "m3", label: "18", type: "point", pos: [2, 0, -3], color: "#c084fc", showAt: 5 },
      { id: "m4", label: "23", type: "point", pos: [6, 0, -3], color: "#c084fc", showAt: 5 },
      { id: "m5", label: "28", type: "point", pos: [10, 0, -3], color: "#c084fc", showAt: 5 },
      { id: "nk", label: "k = n/2 = 4", type: "note", pos: [-9, 0, 6] },
      { id: "nsort", label: "sorted → 12", type: "note", pos: [0, 0, 6], showAt: 1 },
      { id: "nlin", label: "sort is n log n", type: "note", pos: [9, 0, 6], showAt: 1 },
      { id: "nleft", label: "left < 7", type: "note", pos: [-9, 0, 0], showAt: 2 },
      { id: "nch", label: "chunks of 5", type: "note", pos: [0, 0, 0], showAt: 5 },
      { id: "nright", label: "right > 7", type: "note", pos: [9, 0, 0], showAt: 2 },
      { id: "navg", label: "avg n+n/2+…=O(n)", type: "note", pos: [-9, 0, -6], showAt: 4 },
      { id: "nskip", label: "MoM skips ≥ n/4", type: "note", pos: [0, 0, -6], showAt: 6 },
      { id: "nwrst", label: "worst O(n^2)", type: "note", pos: [9, 0, -6], showAt: 4 }
    ],
    edges: [
      { from: "a1", to: "a0", label: "<", showAt: 2 },
      { from: "a2", to: "a0", showAt: 2 },
      { from: "a3", to: "a0", showAt: 2 },
      { from: "a0", to: "a4", label: ">", showAt: 2 },
      { from: "a0", to: "a5", showAt: 2 },
      { from: "m0", to: "m1", showAt: 5 },
      { from: "m1", to: "m2", showAt: 5 },
      { from: "m2", to: "m3", showAt: 5 },
      { from: "m3", to: "m4", showAt: 5 },
      { from: "m4", to: "m5", showAt: 5 }
    ],
    steps: [
      {
        title: "Want the 4th of 9",
        text: "Nine keys, unordered. The median is the order statistic at k = n/2 = 4. After a sort that cell would be 12, but you should not pay a full sort just to name one rank.",
        highlight: ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "nk"]
      },
      {
        title: "Sorting works, and is slower than we need",
        text: "Sorted order is -6, 1, 4, 7, 12, 14, 18, 19, 28. Index 4 is 12. Comparison sorting is O(n log n). Selection can finish in linear time if the pivot behaves.",
        highlight: ["a5", "nsort", "nlin", "nk"]
      },
      {
        title: "Partition around pivot 7",
        text: "Take 7 (first cell). Walk the rest: -6, 1, 4 go left; 18, 12, 14, 19, 28 go right. One O(n) pass. 7 now sits at rank X = 3.",
        highlight: ["a0", "a1", "a2", "a3", "a4", "a5", "nleft", "nright"],
        flows: [
          { from: "a1", to: "a0", color: "#60a5fa", label: "< 7" },
          { from: "a4", to: "a0", color: "#4ade80", label: "> 7" }
        ]
      },
      {
        title: "X ≠ k, recurse one side",
        text: "X = 3 is less than k = 4, so 7 is not the median. Throw away the left slice and the pivot. Search the right for the remaining rank. 12 lives there. Never recurse into both halves.",
        highlight: ["a0", "a5", "a6", "a7", "a8", "nright"],
        hide: ["a1", "a2", "a3"],
        flows: [
          { from: "a0", to: "a5", color: "#c084fc", label: "k on right" }
        ]
      },
      {
        title: "Lucky linear, unlucky quadratic",
        text: "If pivots land near the middle you pay n + n/2 + n/4 + … ≤ 2n. If every pivot is an extreme, you peel one element per call and pay Θ(n^2) — the same trap as quicksort. The pivot is the whole game.",
        highlight: ["a0", "navg", "nwrst"],
        fail: ["a0"]
      },
      {
        title: "Chunks of five, take each middle",
        text: "To force a decent pivot, split into groups of five, sort each group, and keep the third value. On a 30-key picture those local medians are 3, 8, 13, 18, 23, 28. Each already sits two elements away from its group's edge.",
        highlight: ["m0", "m1", "m2", "m3", "m4", "m5", "nch"],
        flows: [
          { from: "m0", to: "m1", color: "#c084fc", label: "medians" }
        ]
      },
      {
        title: "Median of those medians",
        text: "Recurse: the median of the medians (13 in the picture) becomes the partition pivot. Even a pessimistic choice still stacks the per-chunk guarantees, so a constant fraction of n is known to lie on each side.",
        highlight: ["m2", "m0", "m1", "nch"],
        flows: [
          { from: "m0", to: "m2", color: "#fb923c", label: "MoM" },
          { from: "m5", to: "m2", color: "#fb923c", label: "MoM" }
        ]
      },
      {
        title: "Skip ≥ n/4, worst-case O(n)",
        text: "That pivot discards at least n/4 keys (textbook: about 3n/10 per side, recurse on ≤ 7n/10, plus T(n/5) to build the pivot). Chunk sorts cost O(n) as a geometric series too. Quickselect plus MoM is linear even in the worst case.",
        highlight: ["m2", "nskip", "navg", "a5"],
        flows: [
          { from: "m2", to: "a5", color: "#4ade80", label: "pivot" }
        ]
      }
    ]
  }
});
