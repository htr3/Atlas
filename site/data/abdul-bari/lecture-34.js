window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 34,
  title: "2.7.2.  Merge Sort Algorithm",
  video: "https://www.youtube.com/watch?v=mB5HXBb_HY8",
  category: "Divide & Conquer",
  tagline: "Recursively split to singletons, then merge on the way up in post-order.",
  summary: "Recursive merge sort is divide-and-conquer: if low < high the slice is large, cut at mid, sort left, sort right, merge the two sorted halves. On 9,3,7,5,6,4,8,2 the tree splits to eight singletons, then seven two-way merges rebuild 2..9. Merging is post-order. Recurrence T(n)=2T(n/2)+n is Master case 2, Theta(n log n) — the same bound as iterative two-way mergesort, different control flow.",

  theory: [
    {
      heading: "Small means one element",
      body: "Divide-and-conquer needs a size that is 'small enough to solve directly'. For this sort, a slice of length 1 is already sorted, so do nothing. Length 2 is still 'large': split it. The test in code is <code>if low < high</code> — that is at least two indices. Equal low and high is the base case. The problem is always sort; only the window [low, high] shrinks.",
      bullets: [
        "Base: low == high, a singleton, return.",
        "Large: two or more keys, split.",
        "Same problem on each half: still sort."
      ]
    },
    {
      heading: "The three-line recursive body",
      body: "<code>MergeSort(low, high)</code>: if low < high, set <code>mid = floor((low+high)/2)</code>, call <code>MergeSort(low, mid)</code>, call <code>MergeSort(mid+1, high)</code>, then <code>Merge(low, mid, high)</code>. Merge already exists from the previous lecture: two sorted runs that happen to sit in one array, written into an auxiliary buffer. First call is MergeSort(1, 8) on 9,3,7,5,6,4,8,2. Mid of 1..8 is 4, so the first split is 9,3,7,5 versus 6,4,8,2.",
      bullets: [
        "Divide at mid, two recursive sorts, one merge.",
        "Merge arguments: [low, mid] and [mid+1, high].",
        "Initial window 1..8, mid 4."
      ]
    },
    {
      heading: "Split all the way down",
      body: "The left call 1..4 is still large, mid=2, so 1..2 and 3..4. Then 1..2 splits to 1..1 (the 9) and 2..2 (the 3). Only now are both halves small. The first merge of the whole algorithm is those two singletons: 9 and 3 become 3,9. Then 7 and 5 become 5,7. Then those two runs of two merge into 3,5,7,9. The left half of the original array is sorted before the right half is even entered. That is not the iterative 'pass across the whole array' pattern; it is depth-first.",
      bullets: [
        "Keep splitting until windows are singletons.",
        "First merge: 9 with 3 into 3,9.",
        "Finish the left half completely, then the right."
      ]
    },
    {
      heading: "Seven merges rebuild the array",
      body: "Right half 5..8 splits to 6,4 and 8,2, then to singletons. Merges 4: 6 with 4 → 4,6. Merge 5: 8 with 2 → 2,8. Merge 6: those into 2,4,6,8. Merge 7: 3,5,7,9 with 2,4,6,8 → 2,3,4,5,6,7,8,9. Count the merge nodes: four at the bottom (pairs), two at the next level (quads), one at the root. Same seven two-way merges the iterative method performed, different order.",
      bullets: [
        "Merges 1–3 finish 3,5,7,9 on the left.",
        "Merges 4–6 finish 2,4,6,8 on the right.",
        "Merge 7 is the last combine at the root."
      ]
    },
    {
      heading: "Post-order on the recursion tree",
      body: "Each call does left child, right child, then merge at the node. That is post-order traversal of the binary recursion tree. Drawing only indices first (1..8, 1..4, 1..2, 1..1, 2..2, ...) and then drawing the keys (9, then 3, then 3,9, ...) are two pictures of the same tree. The lecture traces both so you can follow either the windows or the values.",
      bullets: [
        "Left, right, then merge — post-order.",
        "The tree is binary because every split is two-way.",
        "Iterative two-way sort used level-order passes; this uses DFS."
      ]
    },
    {
      heading: "Recurrence and Master theorem",
      body: "Let T(n) be the time on n keys. Two recursive calls on n/2, plus a merge of n keys: <code>T(n) = 2 T(n/2) + n</code> for n>1, and T(1)=1 (or any constant; the singleton does no real work). Master theorem: a=2, b=2, f(n)=n, log_b a = 1 = k, case 2, so <code>Theta(n log n)</code>. The recursion-tree view matches: three levels for n=8, n keys merged on each level. Same asymptotic as the iterative method; the pattern of merges is what changed.",
      bullets: [
        "T(n)=2T(n/2)+n, T(1)=Theta(1).",
        "Case 2 of Master: f(n) * log n = n log n.",
        "n keys merged on each of log n levels."
      ]
    }
  ],

  keyTerms: [
    { term: "MergeSort(low, high)", def: "Recursive sort of a[low..high]: split, recurse, merge." },
    { term: "Mid", def: "floor((low+high)/2), the cut between the two sublists." },
    { term: "Base case", def: "low >= high: at most one key, already sorted." },
    { term: "Post-order merge", def: "Merge runs only after both children have returned sorted." },
    { term: "Two lists in one array", def: "a[low..mid] and a[mid+1..high] are the merge inputs." },
    { term: "T(n)=2T(n/2)+n", def: "Recurrence: two halves plus linear merge work." },
    { term: "Master case 2", def: "log_b a equals the exponent of f(n), so multiply f(n) by log n." }
  ],

  tradeoffs: [
    { pro: "The recurrence maps onto the code line-for-line and solves to Theta(n log n).", con: "Depth-first recursion uses a stack of log n frames on top of the merge buffer." },
    { pro: "Same two-way merges as the iterative algorithm, so the same comparisons.", con: "The visit order is DFS, not passes; harder to see as 'log n sweeps' until you draw levels." },
    { pro: "A single array holds many logical lists, identified only by low/mid/high.", con: "Merge still cannot be in-place in this presentation; you need auxiliary storage." },
    { pro: "Natural fit for linked lists later (just relink).", con: "On tiny n the recursion overhead loses to insertion sort — next lecture." }
  ],

  interviewTips: [
    "Write if low < high, mid, two recursive calls, merge. That is the whole algorithm.",
    "Define small as one element. Length 2 still splits.",
    "Trace 9,3,7,5,6,4,8,2: first merge is 9 with 3, last merge is 3,5,7,9 with 2,4,6,8.",
    "Say merging is post-order on the recursion tree, not a sequence of full-array passes.",
    "T(n)=2T(n/2)+n, Master case 2, Theta(n log n). Name a, b, k.",
    "Contrast with the previous video: iterative two-way is loops; this is D&C recursion."
  ],

  scene: {
    nodes: [
      { id: "root", label: "1..8", type: "lb", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "l14", label: "1..4", type: "server", pos: [-6, 0, -2], showAt: 1, color: "#818cf8" },
      { id: "r58", label: "5..8", type: "server", pos: [6, 0, -2], showAt: 1, color: "#818cf8" },
      { id: "l12", label: "1..2", type: "cache", pos: [-9, 0, 2], showAt: 2, color: "#c084fc" },
      { id: "l34", label: "3..4", type: "cache", pos: [-3, 0, 2], showAt: 2, color: "#c084fc" },
      { id: "r56", label: "5..6", type: "cache", pos: [3, 0, 2], showAt: 2, color: "#c084fc" },
      { id: "r78", label: "7..8", type: "cache", pos: [9, 0, 2], showAt: 2, color: "#c084fc" },
      { id: "s9", label: "9", type: "point", pos: [-10.5, 0, 6], showAt: 2, color: "#64748b" },
      { id: "s3", label: "3", type: "point", pos: [-7.5, 0, 6], showAt: 2, color: "#64748b" },
      { id: "s7", label: "7", type: "point", pos: [-4.5, 0, 6], showAt: 2, color: "#64748b" },
      { id: "s5", label: "5", type: "point", pos: [-1.5, 0, 6], showAt: 2, color: "#64748b" },
      { id: "s6", label: "6", type: "point", pos: [1.5, 0, 6], showAt: 2, color: "#64748b" },
      { id: "s4", label: "4", type: "point", pos: [4.5, 0, 6], showAt: 2, color: "#64748b" },
      { id: "s8", label: "8", type: "point", pos: [7.5, 0, 6], showAt: 2, color: "#64748b" },
      { id: "s2", label: "2", type: "point", pos: [10.5, 0, 6], showAt: 2, color: "#64748b" },
      { id: "m39", label: "3,9", type: "worker", pos: [-9, 0, 6], showAt: 3, color: "#4ade80" },
      { id: "m57", label: "5,7", type: "worker", pos: [-3, 0, 6], showAt: 3, color: "#4ade80" },
      { id: "m3579", label: "3,5,7,9", type: "service", pos: [-6, 0, 2], showAt: 4, color: "#4ade80" },
      { id: "m46", label: "4,6", type: "worker", pos: [3, 0, 6], showAt: 5, color: "#4ade80" },
      { id: "m28", label: "2,8", type: "worker", pos: [9, 0, 6], showAt: 5, color: "#4ade80" },
      { id: "m2468", label: "2,4,6,8", type: "service", pos: [6, 0, 2], showAt: 5, color: "#4ade80" },
      { id: "done", label: "2 3 4 5 6 7 8 9", type: "lb", pos: [0, 0, -6], showAt: 6, color: "#4ade80" },
      { id: "n0", label: "MergeSort(1,8)", type: "note", pos: [9, 0, -6] },
      { id: "n1", label: "mid=4, two halves", type: "note", pos: [0, 0, 2], showAt: 1 },
      { id: "n2", label: "split to singletons", type: "note", pos: [0, 0, -2], showAt: 2 },
      { id: "n3", label: "first merges 3,9 & 5,7", type: "note", pos: [0, 0, -2], showAt: 3 },
      { id: "n4", label: "left half sorted", type: "note", pos: [-9, 0, -6], showAt: 4 },
      { id: "n5", label: "post-order last merge", type: "note", pos: [9, 0, 2], showAt: 6 },
      { id: "n6", label: "T=2T(n/2)+n", type: "note", pos: [0, 0, 7.5], showAt: 7 }
    ],
    edges: [
      { from: "root", to: "l14", showAt: 1 },
      { from: "root", to: "r58", showAt: 1 },
      { from: "l14", to: "l12", showAt: 2 },
      { from: "l14", to: "l34", showAt: 2 },
      { from: "r58", to: "r56", showAt: 2 },
      { from: "r58", to: "r78", showAt: 2 },
      { from: "l12", to: "s9", showAt: 2, dashed: true },
      { from: "l12", to: "s3", showAt: 2, dashed: true },
      { from: "s9", to: "m39", showAt: 3 },
      { from: "s3", to: "m39", showAt: 3 },
      { from: "s7", to: "m57", showAt: 3 },
      { from: "s5", to: "m57", showAt: 3 },
      { from: "m39", to: "m3579", showAt: 4 },
      { from: "m57", to: "m3579", showAt: 4 },
      { from: "s6", to: "m46", showAt: 5 },
      { from: "s4", to: "m46", showAt: 5 },
      { from: "s8", to: "m28", showAt: 5 },
      { from: "s2", to: "m28", showAt: 5 },
      { from: "m46", to: "m2468", showAt: 5 },
      { from: "m28", to: "m2468", showAt: 5 },
      { from: "m3579", to: "done", showAt: 6 },
      { from: "m2468", to: "done", showAt: 6 }
    ],
    steps: [
      {
        title: "Call MergeSort(1,8)",
        text: "Array 9,3,7,5,6,4,8,2. low < high, so the slice is large. This is divide-and-conquer sort, not the iterative pass method.",
        highlight: ["root", "n0"]
      },
      {
        title: "Split at mid 4",
        text: "Left window 1..4 holds 9,3,7,5. Right window 5..8 holds 6,4,8,2. Recurse left first; the right call waits.",
        highlight: ["root", "l14", "r58", "n1"],
        hide: ["n0"],
        flows: [
          { from: "root", to: "l14", color: "#60a5fa", label: "left" },
          { from: "root", to: "r58", color: "#64748b", label: "later" }
        ]
      },
      {
        title: "Keep splitting to singletons",
        text: "1..4 splits to 1..2 and 3..4, then to 9, 3, 7, 5. Same on the right down to 6, 4, 8, 2. One element is the small problem.",
        highlight: ["l12", "l34", "r56", "r78", "s9", "s3", "s7", "s5", "s6", "s4", "s8", "s2", "n2"],
        hide: ["n0", "n1"]
      },
      {
        title: "First merges: 3,9 and 5,7",
        text: "9 with 3 becomes 3,9. 7 with 5 becomes 5,7. Those are merges 1 and 2. The algorithm has not touched the right half yet.",
        highlight: ["s9", "s3", "s7", "s5", "m39", "m57", "n3"],
        hide: ["n0", "n1", "n2", "s6", "s4", "s8", "s2", "r56", "r78", "r58"],
        flows: [
          { from: "s9", to: "m39", color: "#4ade80", label: "9" },
          { from: "s3", to: "m39", color: "#4ade80", label: "3" },
          { from: "s7", to: "m57", color: "#4ade80" },
          { from: "s5", to: "m57", color: "#4ade80" }
        ]
      },
      {
        title: "Left half 3,5,7,9",
        text: "Merge 3,9 with 5,7 (merge 3). The left child of the root is done. Now the pending right call 5..8 may run.",
        highlight: ["m39", "m57", "m3579", "l14", "n4"],
        hide: ["n0", "n1", "n2", "n3", "s9", "s3", "s7", "s5"],
        flows: [
          { from: "m39", to: "m3579", color: "#4ade80" },
          { from: "m57", to: "m3579", color: "#4ade80" }
        ]
      },
      {
        title: "Right half then root merge",
        text: "4,6 and 2,8, then 2,4,6,8 (merges 4–6). Last, merge 3,5,7,9 with 2,4,6,8 into 2..9. That root combine is post-order.",
        highlight: ["m3579", "m46", "m28", "m2468", "done", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "s9", "s3", "s7", "s5", "s6", "s4", "s8", "s2", "m39", "m57", "root"],
        flows: [
          { from: "m3579", to: "done", color: "#4ade80", label: "left" },
          { from: "m2468", to: "done", color: "#4ade80", label: "right" }
        ]
      },
      {
        title: "Levels cost n, depth log n",
        text: "Each tree level merges all n keys. Depth is log 8 = 3. Recurrence T(n)=2T(n/2)+n, Master case 2, Theta(n log n).",
        highlight: ["done", "m3579", "m2468", "n6", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "root", "m39", "m57", "m46", "m28"]
      }
    ]
  }
});
