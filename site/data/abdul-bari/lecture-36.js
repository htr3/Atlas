window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 36,
  title: "2.8.1  QuickSort Algorithm",
  video: "https://www.youtube.com/watch?v=7h1s2SojIRw",
  category: "Divide & Conquer",
  tagline: "A pivot finds its sorted index; I and J swap inversions until they cross.",
  summary: "Quicksort is divide-and-conquer that first places one key. A key is in sorted position when everything left is smaller and everything right is larger. Partition selects the first key as pivot, scans I for a greater key and J for a lesser key, swaps, and repeats until I crosses J; then the pivot swaps with a[J]. Recurse on both sides. Worked array: 10,16,8,12,15,6,3,9,5 plus an infinity sentinel.",

  theory: [
    {
      heading: "Students find their own place",
      body: "A teacher can point each student to a spot by height, or the students can arrange themselves. The shortest already knows the front; the tallest already knows the back; everyone else asks taller people to step behind and shorter people to step in front. That self-placement is the 'quick' idea. The name is not a claim that this is the fastest sort on every input — it is the method where keys locate themselves.",
      bullets: [
        "Shortest and tallest know their slots immediately.",
        "A middle student partitions the rest around himself.",
        "Quick means self-placement, not 'always asymptotically best'."
      ]
    },
    {
      heading: "Sorted position of one key",
      body: "In 6,3,5,4,2,8,9,1 the 9 at the end is already sorted: it is a maximum at the right end. In 4,6,7,10,16,12,13,14 the 10 is sorted even though neighbors are not: every key left of 10 is < 10 and every key right of 10 is > 10. Quicksort's contract for a pivot is exactly that split. The two sides need not be sorted yet.",
      bullets: [
        "Left of pivot: all smaller (or equal, depending on the scan).",
        "Right of pivot: all larger.",
        "The pivot never moves again after partition."
      ]
    },
    {
      heading: "Setup: pivot, I, J, infinity",
      body: "Window [low, high] on nine keys plus a sentinel: 10, 16, 8, 12, 15, 6, 3, 9, 5, ∞. The sentinel is a max-int end marker so J never walks off the array (like '\\0' for strings). Pivot p is a[low], here 10. I starts at low, J starts at high (the sentinel). I will hunt a key > p; J will hunt a key <= p. If they have not crossed, those two keys are on the wrong sides and they swap.",
      bullets: [
        "p = a[low], first element of the window.",
        "I scans right for > p; J scans left for <= p.",
        "Infinity (max int) is the right bumper so J always stops."
      ]
    },
    {
      heading: "Partition trace until I crosses J",
      body: "I steps to 16 (>10). J steps to 5 (<=10). Swap: 10,5,8,12,15,6,3,9,16,∞. I then stops on 12, J on 9, swap: 10,5,8,9,15,6,3,12,16,∞. I stops on 15, J on 3, swap: 10,5,8,9,3,6,15,12,16,∞. Next, I lands on 15 (index 7) and J on 6 (index 6). I > J, so stop swapping strangers. The crossing means every remaining inversion around 10 has been cleared.",
      bullets: [
        "Three swaps: 16↔5, 12↔9, 15↔3.",
        "Stop when I has crossed J; do not swap those two.",
        "J now marks the hole the pivot belongs in."
      ]
    },
    {
      heading: "Seat the pivot, then recurse",
      body: "Swap a[low] with a[J]: 6,5,8,9,3,10,15,12,16,∞. The 10 sits at index 6. Left of it: 6,5,8,9,3, all smaller. Right: 15,12,16, all larger. Partition returns J. QuickSort then calls itself on [low, J] (the left uses the seated pivot as its right bumper / 'infinity') and on [J+1, high]. A window with fewer than two keys is the base case (<code>if low < high</code>).",
      bullets: [
        "Final pivot swap: a[low] ↔ a[J], return J.",
        "Left recurse low..J; right recurse J+1..high.",
        "The seated pivot is a sentinel for the left sublist."
      ]
    },
    {
      heading: "The two procedures",
      body: "Partition(low, high): p=a[low], I=low, J=high; while I < J, I++ while a[I]<=p, J-- while a[J]>p, if I<J swap a[I],a[J]; then swap a[low],a[J]; return J. QuickSort(low, high): if low < high, j=Partition(low,high), QuickSort(low,j), QuickSort(j+1,high). Divide-and-conquer appears in QuickSort; the real work is the linear scan inside Partition.",
      bullets: [
        "Partition is the linear two-pointer scan plus two kinds of swap.",
        "QuickSort is the recursive wrapper around Partition.",
        "Next lecture times this: best n log n, worst n^2."
      ]
    }
  ],

  keyTerms: [
    { term: "Sorted position", def: "A key with all smaller items on its left and all larger on its right." },
    { term: "Pivot", def: "The key Partition is placing; here, the first element of the window." },
    { term: "I pointer", def: "Scans right from the pivot until a key greater than p." },
    { term: "J pointer", def: "Scans left from the sentinel until a key less than or equal to p." },
    { term: "Infinity sentinel", def: "A max-int bumper at the right end so J always has a stop." },
    { term: "Partition", def: "Two-pointer swap loop that seats the pivot and returns its index J." },
    { term: "Crossing", def: "I > J: stop swapping; J is the pivot's home." }
  ],

  tradeoffs: [
    { pro: "After one linear scan the pivot is done forever and both sides shrink.", con: "A bad pivot (next lecture) leaves a 0 / n-1 split and quadratic time." },
    { pro: "In-place aside from the recursion stack; no n-cell merge buffer.", con: "The infinity sentinel is an extra cell or a careful bound on J." },
    { pro: "Equal keys: J accepts <= p so duplicates can sit on the left.", con: "The scheme is not stable; equal keys can swap across the pivot." },
    { pro: "The seated pivot is a free sentinel for the left recursive call.", con: "You must include J in the left call (low..J), not low..J-1, in this coding." }
  ],

  interviewTips: [
    "Define sorted position before code: left all smaller, right all larger.",
    "Name p=a[low], I from low, J from high, sentinel at the right.",
    "Trace 10,16,8,12,15,6,3,9,5: three cross swaps, then 10 seats at index 6.",
    "Stop when I crosses J; the pivot swap is with a[J], not with a[I].",
    "QuickSort: if low<high, j=Partition, recurse low..j and j+1..high.",
    "Say the name 'quick' is self-placement, not a promise of n log n on every array."
  ],

  scene: {
    nodes: [
      { id: "c0", label: "10", type: "lb", pos: [-10, 0, -4], color: "#c084fc" },
      { id: "c1", label: "16", type: "cache", pos: [-8, 0, -4], color: "#60a5fa" },
      { id: "c2", label: "8", type: "cache", pos: [-6, 0, -4], color: "#60a5fa" },
      { id: "c3", label: "12", type: "cache", pos: [-4, 0, -4], color: "#60a5fa" },
      { id: "c4", label: "15", type: "cache", pos: [-2, 0, -4], color: "#60a5fa" },
      { id: "c5", label: "6", type: "cache", pos: [0, 0, -4], color: "#60a5fa" },
      { id: "c6", label: "3", type: "cache", pos: [2, 0, -4], color: "#60a5fa" },
      { id: "c7", label: "9", type: "cache", pos: [4, 0, -4], color: "#60a5fa" },
      { id: "c8", label: "5", type: "cache", pos: [6, 0, -4], color: "#60a5fa" },
      { id: "inf", label: "inf", type: "point", pos: [8, 0, -4], color: "#f87171" },
      { id: "I", label: "I", type: "user", pos: [-8, 0, 0], showAt: 1 },
      { id: "J", label: "J", type: "user", pos: [8, 0, 0], showAt: 1 },
      { id: "piv", label: "pivot=10", type: "note", pos: [-10, 0, 3] },
      { id: "n0", label: "left < p < right", type: "note", pos: [4, 0, 3] },
      { id: "sw1", label: "16 swap 5", type: "worker", pos: [-1, 0, 3], showAt: 2, color: "#fb923c" },
      { id: "sw2", label: "12 swap 9", type: "worker", pos: [-1, 0, 6], showAt: 3, color: "#fb923c" },
      { id: "sw3", label: "15 swap 3", type: "worker", pos: [6, 0, 3], showAt: 4, color: "#fb923c" },
      { id: "cross", label: "I>J stop", type: "note", pos: [6, 0, 6], showAt: 5 },
      { id: "seat", label: "10 at index 6", type: "server", pos: [0, 0, 6], showAt: 5, color: "#4ade80" },
      { id: "left", label: "6 5 8 9 3", type: "zone", pos: [-6, 0, -7.5], size: [12, 2.2], showAt: 6 },
      { id: "right", label: "15 12 16", type: "zone", pos: [6, 0, -7.5], size: [8, 2.2], showAt: 6 },
      { id: "n1", label: "recurse both sides", type: "note", pos: [8, 0, 3], showAt: 6 }
    ],
    edges: [
      { from: "c0", to: "I", showAt: 1, dashed: true },
      { from: "inf", to: "J", showAt: 1, dashed: true },
      { from: "c1", to: "c8", showAt: 2 },
      { from: "c3", to: "c7", showAt: 3 },
      { from: "c4", to: "c6", showAt: 4 },
      { from: "c0", to: "seat", showAt: 5 }
    ],
    steps: [
      {
        title: "Sorted position",
        text: "A key is finished when every left neighbor is smaller and every right neighbor is larger. Quicksort will force that property for the first key, then recurse.",
        highlight: ["c0", "piv", "n0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "inf"]
      },
      {
        title: "Pivot 10, I and J, sentinel",
        text: "p = 10. I starts on the pivot, J on infinity. I hunts a key > 10; J hunts a key <= 10. Infinity is the bumper so J cannot fall off the right end.",
        highlight: ["c0", "I", "J", "inf", "piv"],
        hide: ["n0"]
      },
      {
        title: "First swap: 16 with 5",
        text: "I stops on 16 (greater). J stops on 5 (smaller). They are on the wrong sides, so swap. Array is now 10,5,8,12,15,6,3,9,16,inf.",
        highlight: ["c1", "c8", "I", "J", "sw1", "c0"],
        hide: ["n0"],
        flows: [
          { from: "c1", to: "c8", color: "#fb923c", label: "16" },
          { from: "c8", to: "c1", color: "#4ade80", label: "5" }
        ]
      },
      {
        title: "Second swap: 12 with 9",
        text: "I continues: 8 is not greater, 12 is. J finds 9. Swap. Array 10,5,8,9,15,6,3,12,16,inf.",
        highlight: ["c3", "c7", "sw2", "I", "J"],
        hide: ["n0", "sw1"],
        flows: [
          { from: "c3", to: "c7", color: "#fb923c", label: "12" },
          { from: "c7", to: "c3", color: "#4ade80", label: "9" }
        ]
      },
      {
        title: "Third swap: 15 with 3",
        text: "I stops on 15, J on 3, swap. Array 10,5,8,9,3,6,15,12,16,inf. Next scan will cross the pointers.",
        highlight: ["c4", "c6", "sw3", "I", "J"],
        hide: ["n0", "sw1", "sw2"],
        flows: [
          { from: "c4", to: "c6", color: "#fb923c", label: "15" },
          { from: "c6", to: "c4", color: "#4ade80", label: "3" }
        ]
      },
      {
        title: "I crosses J; seat 10",
        text: "I lands right of J. Do not swap those two. Swap the pivot with a[J]: 6,5,8,9,3 | 10 | 15,12,16. Partition returns 6. 10 is in sorted position.",
        highlight: ["c0", "c5", "seat", "cross", "c2", "c3", "c4"],
        hide: ["n0", "sw1", "sw2", "sw3", "I", "J"],
        flows: [
          { from: "c0", to: "seat", color: "#c084fc", label: "pivot" }
        ]
      },
      {
        title: "Recurse on both sides",
        text: "Left window 6,5,8,9,3 uses the seated 10 as its infinity. Right window 15,12,16. QuickSort(low,j) and QuickSort(j+1,high) until each window has one key.",
        highlight: ["left", "right", "seat", "n1", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
        hide: ["n0", "sw1", "sw2", "sw3", "cross", "I", "J"]
      }
    ]
  }
});
