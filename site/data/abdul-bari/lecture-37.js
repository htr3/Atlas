window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 37,
  title: "2.8.2 QuickSort Analysis",
  video: "https://www.youtube.com/watch?v=-qOVVRIZzao",
  category: "Divide & Conquer",
  tagline: "Balanced partitions give n log n; a sorted array with first-element pivots is n^2.",
  summary: "If every partition hits the middle, each level of the recursion tree scans n keys and the height is log n, so T(n)=Theta(n log n) — the best case, which needs a median pivot you cannot force. Already-sorted input with the first key as pivot peels one element per call: n+(n-1)+... = Theta(n^2). Average is n log n. Fixes: pick the middle index as pivot (sorted becomes best) or a random key. Stack depth follows the tree: log n best, n worst. Extra array space is not required.",

  theory: [
    {
      heading: "Best case: always a middle cut",
      body: "Take 15 keys, indices 1..15. Suppose Partition always returns the midpoint: 8, then 4 and 12, then the singletons. The picture is a full binary tree of partitions. At the root, the scan walks all n keys. At the next level the two windows still cover about n keys together. Same at every level. Height is the number of times you can halve 15 down to 1, which is <code>log n</code>. Product: <code>n log n</code>. That is the best-case time, and it happens only when the chosen pivot is a median of its window.",
      bullets: [
        "Each level of the tree costs Theta(n) pointer walks.",
        "Balanced height = log n.",
        "Best T(n) = Theta(n log n) under always-middle cuts."
      ]
    },
    {
      heading: "Median is not something you have",
      body: "The median of 1,2,3,4,5,6,7 is 4 — the middle of the already-sorted list. Partition would have to pick that median as pivot every time to keep the tree balanced. You cannot know the median without sorting, which is the job you are doing. A lucky array may hand you medians; you cannot arrange it. So the n log n case is possible and not controllable with 'first element is pivot'.",
      bullets: [
        "Median = middle of the sorted window.",
        "Knowing it is as hard as sorting.",
        "Best case may happen at random; you cannot schedule it."
      ]
    },
    {
      heading: "Worst case: sorted, first key as pivot",
      body: "Input 2,4,8,10,16,18,17 already ascending. Pivot is 2. I finds the first greater key immediately; J walks all the way back to the pivot. Partition seats 2 at index 1 and leaves a window of n-1. Next pivot 4 seats at the front of that window. The recursion tree is a spine: n, then n-1, then n-2, down to 1. Sum = n(n+1)/2 = <code>Theta(n^2)</code>. A descending array does the same with partitions stuck at the right end. Sorted input is common (you keep resorting a file that is already ordered), so this is not a rare exam toy.",
      bullets: [
        "First-element pivot on sorted data: split 1 | n-1.",
        "Costs n + (n-1) + ... + 1 = Theta(n^2).",
        "Descending input: split n-1 | 1, same square."
      ]
    },
    {
      heading: "Average n log n, unlike mergesort",
      body: "Mergesort had no best/worst spread: every n-key instance was n log n. Quicksort's average over pivot ranks is still Theta(n log n), but the worst remains n^2. That gap is the design problem of the algorithm as written. You must either live with a quadratic landmine or change how the pivot is chosen.",
      bullets: [
        "Average: Theta(n log n).",
        "Worst: Theta(n^2) on sorted (and some other) permutations.",
        "Mergesort's time does not depend on the keys."
      ]
    },
    {
      heading: "Two repairs that do not delete n^2",
      body: "Repair 1: always take the middle index as pivot. On an already-sorted window that index is the median, so the 'worst' sorted input becomes the best n log n tree. Other permutations can still be adversarial against 'middle index', so the worst case is still n^2, just on different arrays. Repair 2: pick a random index as pivot. Expected time is n log n; a cursed permutation can still go quadratic, only with small probability. In both repairs the big-O worst case of the comparison tree remains n^2. You have made the dangerous inputs unlikely or relocated them.",
      bullets: [
        "Middle index: sorted input becomes best-case.",
        "Random index: expected n log n, worst still n^2.",
        "Neither repair makes worst-case n log n in this lecture's model."
      ]
    },
    {
      heading: "Stack, not an extra array",
      body: "Quicksort is in-place on the keys. Recursion still uses a stack whose depth is the height of the partition tree: log n in the balanced case, n in the spine case. That is the extra memory. Mergesort needed n extra cells plus log n stack; quicksort needs between log n and n frames and no merge buffer. Best-case stack is the attractive number; worst-case stack of n is the matching penalty of the n^2 tree.",
      bullets: [
        "No auxiliary n-array; swaps are in place.",
        "Stack = tree height: log n best, n worst.",
        "Space and time both degrade together on the spine."
      ]
    }
  ],

  keyTerms: [
    { term: "Middle cut", def: "Partition index at n/2, the balanced split that yields n log n levels." },
    { term: "Median pivot", def: "The middle key of the sorted window; the only pivot that always middle-cuts." },
    { term: "Spine tree", def: "1 | n-1 splits all the way down; height n, cost n^2." },
    { term: "Best case", def: "Always-middle partitions, T(n)=Theta(n log n). Not under your control with a fixed first-key pivot." },
    { term: "Worst case", def: "Sorted or reverse-sorted plus first-key pivot, T(n)=Theta(n^2)." },
    { term: "Middle-index pivot", def: "Choose a[mid] as p so a sorted array balanced-splits." },
    { term: "Random pivot", def: "Choose a random index; expected n log n, worst still n^2." }
  ],

  tradeoffs: [
    { pro: "Best and average are n log n with tiny extra memory (the stack).", con: "First-key pivot on sorted data is n^2 and a stack of n frames." },
    { pro: "Middle-index pivot turns the common sorted file into the best case.", con: "Some other permutation still builds a spine; worst-case big-O stays n^2." },
    { pro: "Random pivot makes quadratic behavior a low-probability event.", con: "Examiners still want the n^2 bound; 'with high probability' is not 'never'." },
    { pro: "No n-cell merge buffer, unlike mergesort.", con: "Mergesort's time is n log n on every input, which is the safer exam guarantee." }
  ],

  interviewTips: [
    "Draw the balanced tree: n work per level, log n levels, n log n best.",
    "Say you cannot force a median pivot without already sorting.",
    "Trace a sorted array: first-key pivot seats at index 1, leftover n-1, sum n(n+1)/2.",
    "Average n log n, worst n^2 — contrast with mergesort's single Theta(n log n).",
    "Name both repairs: middle index (sorted becomes best) and random (expected n log n).",
    "Stack is the extra space: log n to n. Do not claim O(1) extra memory if the implementation is recursive."
  ],

  scene: {
    nodes: [
      { id: "p8", label: "8", type: "lb", pos: [0, 0, -6], color: "#4ade80" },
      { id: "p4", label: "4", type: "server", pos: [-5, 0, -2], showAt: 1, color: "#4ade80" },
      { id: "p12", label: "12", type: "server", pos: [5, 0, -2], showAt: 1, color: "#4ade80" },
      { id: "p2", label: "2", type: "cache", pos: [-8, 0, 2], showAt: 1, color: "#86efac" },
      { id: "p6", label: "6", type: "cache", pos: [-2, 0, 2], showAt: 1, color: "#86efac" },
      { id: "p10", label: "10", type: "cache", pos: [2, 0, 2], showAt: 1, color: "#86efac" },
      { id: "p14", label: "14", type: "cache", pos: [8, 0, 2], showAt: 1, color: "#86efac" },
      { id: "n0", label: "n work / level", type: "note", pos: [9, 0, -6] },
      { id: "n1", label: "height log n", type: "note", pos: [9, 0, -2], showAt: 1 },
      { id: "med", label: "median needed", type: "note", pos: [0, 0, 6], showAt: 2 },
      { id: "s1", label: "1", type: "lb", pos: [-10, 0, -6], showAt: 3, color: "#f87171" },
      { id: "s2", label: "2..7", type: "server", pos: [-6, 0, -2], showAt: 3, color: "#f87171" },
      { id: "s3", label: "3..7", type: "server", pos: [-2, 0, 1], showAt: 3, color: "#f87171" },
      { id: "s4", label: "4..7", type: "cache", pos: [2, 0, 4], showAt: 3, color: "#f87171" },
      { id: "s5", label: "n+(n-1)+..", type: "note", pos: [8, 0, 4], showAt: 3 },
      { id: "fixM", label: "pivot = mid index", type: "worker", pos: [8, 0, -6], showAt: 5, color: "#60a5fa" },
      { id: "fixR", label: "random pivot", type: "worker", pos: [8, 0, -2], showAt: 5, color: "#c084fc" },
      { id: "stk", label: "stack log n .. n", type: "queue", pos: [0, 0, 7.5], showAt: 6, color: "#fb923c" },
      { id: "n2", label: "avg n log n", type: "note", pos: [-9, 0, 6], showAt: 4 },
      { id: "n3", label: "mergesort: always n log n", type: "note", pos: [-8, 0, 7.5], showAt: 4 }
    ],
    edges: [
      { from: "p8", to: "p4", showAt: 1 },
      { from: "p8", to: "p12", showAt: 1 },
      { from: "p4", to: "p2", showAt: 1 },
      { from: "p4", to: "p6", showAt: 1 },
      { from: "p12", to: "p10", showAt: 1 },
      { from: "p12", to: "p14", showAt: 1 },
      { from: "s1", to: "s2", showAt: 3 },
      { from: "s2", to: "s3", showAt: 3 },
      { from: "s3", to: "s4", showAt: 3 },
      { from: "p8", to: "med", showAt: 2, dashed: true },
      { from: "fixM", to: "p8", showAt: 5, dashed: true },
      { from: "fixR", to: "p8", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Assume a middle cut",
        text: "On 15 keys, partition at 8, then 4 and 12. If this happens at every node, you have a balanced tree of partitions.",
        highlight: ["p8", "n0"]
      },
      {
        title: "n per level, log n levels",
        text: "Each level walks about n cells. Height is log n because windows halve. Product n log n — best case, and only if the pivot is always a median.",
        highlight: ["p8", "p4", "p12", "p2", "p6", "p10", "p14", "n0", "n1"],
        flows: [
          { from: "p8", to: "p4", color: "#4ade80", label: "1..7" },
          { from: "p8", to: "p12", color: "#4ade80", label: "9..15" }
        ]
      },
      {
        title: "You cannot schedule a median",
        text: "Median is the middle of the sorted window. Finding it is as hard as sorting. First-element pivot hits a median only by luck.",
        highlight: ["p8", "med", "n1"],
        hide: ["n0"]
      },
      {
        title: "Sorted input is a spine",
        text: "Keys 1..7 already sorted, pivot = first key. Partition seats 1, leftover 2..7, then 3..7, .... Costs n+(n-1)+... = n(n+1)/2 = Theta(n^2). Descending arrays spine the other way.",
        highlight: ["s1", "s2", "s3", "s4", "s5"],
        hide: ["p8", "p4", "p12", "p2", "p6", "p10", "p14", "n0", "n1", "med"],
        fail: ["s1", "s2", "s3", "s4"],
        flows: [
          { from: "s1", to: "s2", color: "#f87171", label: "n-1" },
          { from: "s2", to: "s3", color: "#f87171" },
          { from: "s3", to: "s4", color: "#f87171" }
        ]
      },
      {
        title: "Average n log n, worst n^2",
        text: "Typical pivots still give n log n. Mergesort had no such split: it was n log n on every array. Quicksort's n^2 is the price of an unlucky pivot.",
        highlight: ["n2", "n3", "s5"],
        hide: ["p8", "p4", "p12", "p2", "p6", "p10", "p14", "n0", "n1", "med"]
      },
      {
        title: "Middle index or random key",
        text: "Always pick the middle index: a sorted file now balanced-splits (worst becomes best for that input). Or pick randomly: expected n log n. Some other array can still be n^2.",
        highlight: ["fixM", "fixR", "p8", "p4", "p12"],
        hide: ["s1", "s2", "s3", "s4", "s5", "n2", "n3", "n0", "n1", "med", "p2", "p6", "p10", "p14"],
        flows: [
          { from: "fixM", to: "p8", color: "#60a5fa", label: "mid" },
          { from: "fixR", to: "p8", color: "#c084fc", label: "rand" }
        ]
      },
      {
        title: "Stack follows the tree",
        text: "No merge buffer. Recursion depth is the partition-tree height: log n when balanced, n on the spine. Time and stack blow up together.",
        highlight: ["stk", "p8", "s4", "n1"],
        hide: ["n0", "med", "n2", "n3", "s1", "s2", "s3", "s5", "fixM", "fixR"]
      }
    ]
  }
});
