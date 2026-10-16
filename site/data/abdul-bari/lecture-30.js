window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 30,
  title: "2.6.1 Binary Search Iterative Method",
  video: "https://www.youtube.com/watch?v=C2apEw9pgtw",
  category: "Divide & Conquer",
  tagline: "Halve a sorted array with low, mid, high until the key is found or the range dies.",
  summary: "Binary search is divide-and-conquer on a sorted list: compare the key with a[mid], then throw away half. On a 15-cell array, 42 is found at index 11 in four probes; linear search would have needed eleven. Best case is the middle key in one probe (O(1)); worst and average follow the comparison tree of height log n.",

  theory: [
    {
      heading: "Sorted is not optional",
      body: "Linear search walks left to right and works on any order. Binary search does not. The list must already be in sorted order so that a comparison with the middle value is a <b>range decision</b>: everything on one side is strictly smaller (or larger) than the key. The lecture's running array occupies indices 1..15. Values used below: <code>4, 8, 10, 12, 16, 21, 25, 29, 31, 36, 42, 47, 53, 55, 62</code>. Index 8 is always 29 on the first probe of this length.",
      bullets: [
        "Prerequisite: the array is sorted.",
        "One comparison discards a whole half because order is known.",
        "Unsorted input makes the discard step a lie."
      ]
    },
    {
      heading: "Low, high, and floor((low+high)/2)",
      body: "Two index pointers sit on the live window: <code>low</code> at the left end, <code>high</code> at the right. Mid is the floor of <code>(low + high) / 2</code>. Compare the key with <code>a[mid]</code>. Equal: return mid. Key smaller: the answer, if it exists, is on the left, so <code>high = mid - 1</code>. Key larger: <code>low = mid + 1</code>. Repeat while <code>low <= high</code>. If low ever crosses high, the key is absent and the routine returns 0 (not found).",
      bullets: [
        "Found: key equals a[mid], return mid.",
        "Go left: high = mid - 1. Go right: low = mid + 1.",
        "Stop when low > high; return 0 for unsuccessful search."
      ]
    },
    {
      heading: "Worked search for 42",
      body: "Key 42, low=1, high=15. Probe 1: mid=8, a[8]=29, 42>29, so low=9. Probe 2: mid=(9+15)/2=12, a[12]=47, 42<47, so high=11. Probe 3: mid=(9+11)/2=10, a[10]=36, 42>36, so low=11. Probe 4: low=high=11, mid=11, a[11]=42, hit. Four comparisons locate index 11. A linear scan from the left would have compared eleven cells. The live window shrank 15 → 7 → 3 → 1.",
      bullets: [
        "29 too small: drop indices 1..8.",
        "47 too big: drop 12..15.",
        "36 too small: drop 9..10. Then 42 sits alone at 11."
      ]
    },
    {
      heading: "A short hit and a miss",
      body: "Key 12: first mid is still 8 (29). 12 is smaller, high becomes 7, next mid=(1+7)/2=4, a[4]=12. Two probes. Linear search would also have stopped at index 4 — binary is not always fewer comparisons, only in the worst and typical cases. Key 30 is missing (29 is followed by 31). Trace: mid 8 (29) → low=9; mid 12 (47) → high=11; mid 10 (36) → high=9; mid 9 (31) → high=8. Now low=9 and high=8, so low has crossed high. That crossing is the unsuccessful-search signal.",
      bullets: [
        "12 is a[4]: two probes, lucky left half.",
        "30 is between 29 and 31: the window collapses past empty.",
        "low > high is the only failure test; you do not scan the rest."
      ]
    },
    {
      heading: "The comparison tree is the analysis",
      body: "Every first probe of this 15-cell list lands on index 8. The left child is mid of 1..7 (index 4); the right child is mid of 9..15 (index 12). Continuing yields a binary tree of mids whose leaves are the singleton indices. Height is 4. For n=15 you can pad in your head to 16=2^4, so the height is <code>log2 n</code>. Searching 29 is one probe (the root). Searching 25 (index 7) walks down to a leaf: four probes. Unsuccessful keys that would sit in the external gaps also take four probes, then the crossing stop.",
      bullets: [
        "Root mid is always (1+n)/2 for this first call.",
        "Maximum probes = height = Theta(log n).",
        "Unsuccessful search is the same height, then low > high."
      ]
    },
    {
      heading: "Best, worst, average",
      body: "Best case: the key is at the first mid. One comparison, <code>O(1)</code>. Worst case: a leaf key or a miss, <code>O(log n)</code>. Average case adds the probe counts over every key (and, if you include them, the external miss nodes) and divides by the number of outcomes — the tree is balanced, so the average is still <code>Theta(log n)</code>. The iterative algorithm uses a loop, not recursion; the tree is only the analysis picture, not the call stack.",
      bullets: [
        "Best: key at a[mid] on the first try, O(1).",
        "Worst and typical: O(log n) from the height.",
        "Iterative: while low <= high, no recursive frames."
      ]
    }
  ],

  keyTerms: [
    { term: "Low / high", def: "Inclusive ends of the still-live index window." },
    { term: "Mid", def: "floor((low+high)/2), the only cell compared this round." },
    { term: "Range reduction", def: "Setting high=mid-1 or low=mid+1, throwing away half the window." },
    { term: "Successful search", def: "key equals a[mid]; return that index." },
    { term: "Unsuccessful search", def: "low crosses high; the key is not in the array." },
    { term: "Comparison tree", def: "Binary tree of successive mids; height is the worst-case probe count." },
    { term: "Prerequisite", def: "The array must already be sorted or the discard rule is false." }
  ],

  tradeoffs: [
    { pro: "Each probe halves the window, so worst-case probes are log n, not n.", con: "The array must be sorted first; sorting may dominate if you search once." },
    { pro: "A middle hit is one comparison (best O(1)).", con: "A key near a leaf still costs the full height, and a miss costs that plus the crossing test." },
    { pro: "The iterative loop uses O(1) extra memory.", con: "The recursive twin (next lecture) spends stack frames of depth log n." },
    { pro: "On 15 cells, 42 at index 11 is four probes versus eleven linear compares.", con: "A key at index 4 (the value 12) is two binary probes and four linear ones — not always a huge gap on tiny n." }
  ],

  interviewTips: [
    "State the prerequisite first: sorted array, or binary search is incorrect.",
    "Write the loop as while low <= high, then the three-way compare, then return 0 when the loop ends.",
    "Trace 42 on 15 cells: mids 8, 12, 10, 11. Name the discarded ranges out loud.",
    "For a miss, show low crossing high (30: after mid 9, high becomes 8).",
    "Best O(1), worst Theta(log n) from the comparison-tree height, average also Theta(log n).",
    "Do not claim binary is always fewer probes than linear on a lucky early key."
  ],

  scene: {
    nodes: [
      { id: "a1", label: "4", type: "point", pos: [-10.5, 0, -3], color: "#60a5fa" },
      { id: "a2", label: "8", type: "point", pos: [-9, 0, -3], color: "#60a5fa" },
      { id: "a3", label: "10", type: "point", pos: [-7.5, 0, -3], color: "#60a5fa" },
      { id: "a4", label: "12", type: "point", pos: [-6, 0, -3], color: "#60a5fa" },
      { id: "a5", label: "16", type: "point", pos: [-4.5, 0, -3], color: "#60a5fa" },
      { id: "a6", label: "21", type: "point", pos: [-3, 0, -3], color: "#60a5fa" },
      { id: "a7", label: "25", type: "point", pos: [-1.5, 0, -3], color: "#60a5fa" },
      { id: "a8", label: "29", type: "point", pos: [0, 0, -3], color: "#60a5fa" },
      { id: "a9", label: "31", type: "point", pos: [1.5, 0, -3], color: "#60a5fa" },
      { id: "a10", label: "36", type: "point", pos: [3, 0, -3], color: "#60a5fa" },
      { id: "a11", label: "42", type: "point", pos: [4.5, 0, -3], color: "#60a5fa" },
      { id: "a12", label: "47", type: "point", pos: [6, 0, -3], color: "#60a5fa" },
      { id: "a13", label: "53", type: "point", pos: [7.5, 0, -3], color: "#60a5fa" },
      { id: "a14", label: "55", type: "point", pos: [9, 0, -3], color: "#60a5fa" },
      { id: "a15", label: "62", type: "point", pos: [10.5, 0, -3], color: "#60a5fa" },
      { id: "low", label: "low=1", type: "note", pos: [-9, 0, -6] },
      { id: "high", label: "high=15", type: "note", pos: [9, 0, -6] },
      { id: "key", label: "key=42", type: "cache", pos: [-10, 0, 2], color: "#c084fc" },
      { id: "n0", label: "sorted, 15 cells", type: "note", pos: [8, 0, 2] },
      { id: "mid8", label: "mid=8 val=29", type: "worker", pos: [0, 0, 2], showAt: 1 },
      { id: "dropL", label: "drop 1..8", type: "note", pos: [-6, 0, 5], showAt: 2 },
      { id: "low9", label: "low=9", type: "note", pos: [-9, 0, -6], showAt: 2 },
      { id: "mid12", label: "mid=12 val=47", type: "worker", pos: [6, 0, 2], showAt: 2 },
      { id: "dropR", label: "drop 12..15", type: "note", pos: [9, 0, 5], showAt: 3 },
      { id: "high11", label: "high=11", type: "note", pos: [9, 0, -6], showAt: 3 },
      { id: "mid10", label: "mid=10 val=36", type: "worker", pos: [3, 0, 2], showAt: 3 },
      { id: "low11", label: "low=high=11", type: "note", pos: [4.5, 0, 5], showAt: 4 },
      { id: "hit", label: "found idx 11", type: "lb", pos: [4.5, 0, 2], showAt: 4, color: "#4ade80" },
      { id: "k12", label: "key=12, 2 probes", type: "note", pos: [-8, 0, 6], showAt: 5 },
      { id: "k30", label: "key=30, low>high", type: "note", pos: [0, 0, 6], showAt: 6 },
      { id: "t4", label: "tree height log n=4", type: "note", pos: [8, 0, 6], showAt: 7 },
      { id: "bounds", label: "best O(1) worst O(log n)", type: "note", pos: [0, 0, 7.5], showAt: 7 }
    ],
    edges: [
      { from: "key", to: "a8", label: "probe", showAt: 1 },
      { from: "key", to: "a12", showAt: 2, dashed: true },
      { from: "key", to: "a10", showAt: 3, dashed: true },
      { from: "key", to: "a11", showAt: 4 },
      { from: "a8", to: "a4", label: "left mids", showAt: 7, dashed: true },
      { from: "a8", to: "a12", label: "right mids", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "Sorted window 1..15",
        text: "Fifteen sorted cells. low sits on index 1, high on 15. The key is 42. Because the list is ordered, one mid comparison will throw away a whole half.",
        highlight: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10", "a11", "a12", "a13", "a14", "a15", "low", "high", "key", "n0"]
      },
      {
        title: "Mid 8 is 29",
        text: "mid = floor((1+15)/2) = 8. a[8]=29, which is smaller than 42, so the key cannot live in 1..8. The live range is about to become 9..15.",
        highlight: ["a8", "mid8", "key", "a11"],
        flows: [
          { from: "key", to: "a8", color: "#c084fc", label: "42>29" }
        ]
      },
      {
        title: "Drop the left half",
        text: "low becomes 9. New mid = (9+15)/2 = 12. a[12]=47 > 42, so the right tail 12..15 is also dead. Window shrinks 15 to 7 to 3.",
        highlight: ["a9", "a10", "a11", "a12", "a13", "a14", "a15", "mid12", "low9", "dropL"],
        hide: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "low", "mid8", "n0"],
        flows: [
          { from: "key", to: "a12", color: "#fb923c", label: "42<47" }
        ]
      },
      {
        title: "Three cells left",
        text: "high becomes 11. Window is 9..11. mid=(9+11)/2=10, a[10]=36 < 42, so drop 9..10 as well. Next low is 11.",
        highlight: ["a9", "a10", "a11", "mid10", "high11", "dropR"],
        hide: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a12", "a13", "a14", "a15", "low", "high", "mid8", "mid12", "low9", "dropL", "n0"],
        flows: [
          { from: "key", to: "a10", color: "#60a5fa", label: "42>36" }
        ]
      },
      {
        title: "Singleton 42 at index 11",
        text: "low=high=mid=11. a[11]=42. Four probes found the key that linear search would have reached on comparison 11. Range reduction: 15, then 7, then 3, then 1.",
        highlight: ["a11", "hit", "low11", "key"],
        hide: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10", "a12", "a13", "a14", "a15", "low", "high", "mid8", "mid12", "mid10", "low9", "high11", "dropL", "dropR", "n0"],
        flows: [
          { from: "key", to: "a11", color: "#4ade80", label: "hit" }
        ]
      },
      {
        title: "Key 12 in two probes",
        text: "Same first mid 8 (29). 12 is smaller, so high=7, next mid=4, hit. Binary is not always dramatically cheaper than linear on a lucky early index — worst-case is the point.",
        highlight: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "k12"],
        hide: ["a9", "a10", "a11", "a12", "a13", "a14", "a15", "hit", "low11", "mid8", "mid12", "mid10", "low9", "high11", "dropL", "dropR", "key", "n0"]
      },
      {
        title: "Miss: 30, low crosses high",
        text: "30 sits between 29 and 31. Mids 8, 12, 10, 9 then high becomes 8 while low is 9. The crossed pointers are the unsuccessful-search stop. Return 0.",
        highlight: ["a8", "a9", "a10", "a12", "k30"],
        fail: ["a9"],
        hide: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a11", "a13", "a14", "a15", "hit", "low11", "k12", "mid8", "mid12", "mid10", "key", "n0"]
      },
      {
        title: "Height log n",
        text: "The first mid is always 8 here. Left child 4, right child 12, then the leaves. Height 4 = log2(16). Best case the root key in O(1). Worst and average Theta(log n).",
        highlight: ["a8", "a4", "a12", "t4", "bounds"],
        hide: ["k12", "k30", "hit", "low11", "mid8", "mid12", "mid10", "dropL", "dropR", "key", "n0"]
      }
    ]
  }
});
