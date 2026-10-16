window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 33,
  title: "2.7.1  Two Way MergeSort - Iterative method",
  video: "https://www.youtube.com/watch?v=6pV2IF0fgKY",
  category: "Divide & Conquer",
  tagline: "Pair sorted runs, merge them, repeat log n passes until one run remains.",
  summary: "Merging copies two already-sorted lists into one sorted list in Theta(m+n) moves. Two-way mergesort treats each of n keys as a 1-element run, then iteratively merges adjacent pairs. On 9,3,7,5,6,4,8,2 three passes of eight copies produce 2,3,4,5,6,7,8,9. Passes equal log n, work per pass is n, so the sort is Theta(n log n).",

  theory: [
    {
      heading: "Merge two sorted lists",
      body: "Merging is not sorting from scratch. Lists A (length m) and B (length n) are already ordered. Two read heads i, j and a write head k walk together: copy the smaller of A[i] and B[j] into C[k], advance that read head and k. When one list empties, copy the remainder. Example: A = 2,8,9,12,15,18 and B = 3,4,7,17. C becomes 2,3,4,7,8,9,12,15,17,18. Every key moves once, so the cost is <code>Theta(m+n)</code> — the notation people write when they mean 'a merge happened'.",
      bullets: [
        "Need two sorted inputs; the output is sorted by construction.",
        "After the two-pointer loop, drain whichever list still has keys.",
        "Time Theta(m+n), extra array C of size m+n."
      ]
    },
    {
      heading: "m-way versus two-way",
      body: "You can merge four lists at once by always taking the global minimum of the four heads (4-way merge, generally m-way). Two-way merge takes lists in pairs. With four lists A,B,C,D you might merge A with B and C with D, then merge those two results — three two-way merges. Pairing order is not unique (A with D is legal too). The iterative sort below commits to adjacent pairs, two lists at a time.",
      bullets: [
        "m-way: one tournament among m heads.",
        "Two-way: always exactly two lists per merge.",
        "Multiple pairing patterns exist; adjacent pairing is the textbook pass."
      ]
    },
    {
      heading: "One-element runs are already sorted",
      body: "The input 9,3,7,5,6,4,8,2 is one unsorted array. Treat each cell as a sorted list of length 1. You now have eight lists and a licence to merge. Pass 1 merges adjacent pairs: (9|3)→(3,9), (7|5)→(5,7), (6|4)→(4,6), (8|2)→(2,8). Four sorted runs of length 2. An odd leftover key, if n were 9, rides through unpaired and waits for a later pass.",
      bullets: [
        "A singleton is a sorted run.",
        "Pass 1: eight lists become four runs of two.",
        "Odd n: the last key copies unchanged."
      ]
    },
    {
      heading: "Pass 2 and pass 3 finish the sort",
      body: "Pass 2 merges runs of two into runs of four: (3,9) with (5,7) yields 3,5,7,9; (4,6) with (2,8) yields 2,4,6,8. Pass 3 merges those two runs of four into one run of eight: 2,3,4,5,6,7,8,9. Three passes, each touching every key. The merge result lives in an auxiliary array B and is copied back to A if you want the next pass to read from A — you cannot merge two slices of A into the same A in place.",
      bullets: [
        "Run length doubles each pass: 1, 2, 4, ..., n.",
        "Need a second array; then copy back if you like.",
        "After log2 n passes there is a single sorted run."
      ]
    },
    {
      heading: "Why Theta(n log n)",
      body: "Each pass copies all n keys (a constant-time compare-and-write per key). The number of passes is the number of times you can divide n by 2 until one run remains: for n=8, 8/2/2/2=1, three passes, <code>log2 n</code>. Product: <code>n * log n</code>. The lecture writes Theta because the function sits in that class — every input of length n pays the same passes, unlike quicksort's pivot luck. This method is a loop, not a recursive divide-and-conquer tree. The next lecture is the recursive twin.",
      bullets: [
        "Work per pass: Theta(n).",
        "Passes: log n (run length doubles).",
        "Total Theta(n log n), independent of the key values."
      ]
    },
    {
      heading: "The merge procedure in code",
      body: "i=j=k=1 (1-based). While i<=m and j<=n, if A[i] < B[j] then C[k++]=A[i++], else C[k++]=B[j++]. Then a drain loop copies any leftover A[i..m] and another copies leftover B[j..n]. Only one drain actually runs. Indices start at 1 in the lecture to keep the arithmetic off C's zero origin.",
      bullets: [
        "One while of pairwise compares, then two drains.",
        "Exactly one of the drains is a no-op.",
        "1-based indices match the rest of the course."
      ]
    }
  ],

  keyTerms: [
    { term: "Merge", def: "Combine two sorted lists into one sorted list in Theta(m+n) copies." },
    { term: "Two-way merge", def: "Always merge exactly two lists (or runs) at a time." },
    { term: "Run", def: "A contiguous sorted block; starts as length 1, doubles each pass." },
    { term: "Pass", def: "One sweep that merges every adjacent pair of current runs." },
    { term: "Auxiliary array", def: "The third buffer C (or B) that receives a merge; in-place merge is not used here." },
    { term: "m-way merge", def: "Take the min among m list heads in one step; not required for this sort." },
    { term: "Iterative mergesort", def: "Loop of two-way passes, no recursion; Theta(n log n)." }
  ],

  tradeoffs: [
    { pro: "Every input of size n costs the same n log n copies — no worst-case pivot.", con: "Each merge needs a second array of size n; this is not an in-place loop." },
    { pro: "Run length doubling is easy to code with nested loops.", con: "The recursive merge sort (next lecture) is the one that matches the D&C recurrence T(n)=2T(n/2)+n." },
    { pro: "Odd leftover runs simply copy; you do not pad the array.", con: "Copy-back from B to A is extra Theta(n) movement each pass unless you ping-pong the buffers." },
    { pro: "Two-way pairing is simple; m-way is available if you have many files.", con: "m-way needs an m-way min each step and a more fussy implementation." }
  ],

  interviewTips: [
    "Define merge first: two sorted lists, two-pointer copy, Theta(m+n), extra buffer.",
    "Start two-way mergesort by naming n singleton runs, then doubling.",
    "Trace 9,3,7,5,6,4,8,2 through three passes until 2..9.",
    "Passes = log n, work/pass = n, product Theta(n log n) for every array.",
    "Say why you need array B: a merge cannot overwrite its own two source runs in place in this method.",
    "Distinguish iterative two-way mergesort (this video) from recursive merge sort (next)."
  ],

  scene: {
    nodes: [
      { id: "p9", label: "9", type: "point", pos: [-10.5, 0, -6], color: "#60a5fa" },
      { id: "p3", label: "3", type: "point", pos: [-7.5, 0, -6], color: "#60a5fa" },
      { id: "p7", label: "7", type: "point", pos: [-4.5, 0, -6], color: "#60a5fa" },
      { id: "p5", label: "5", type: "point", pos: [-1.5, 0, -6], color: "#60a5fa" },
      { id: "p6", label: "6", type: "point", pos: [1.5, 0, -6], color: "#60a5fa" },
      { id: "p4", label: "4", type: "point", pos: [4.5, 0, -6], color: "#60a5fa" },
      { id: "p8", label: "8", type: "point", pos: [7.5, 0, -6], color: "#60a5fa" },
      { id: "p2", label: "2", type: "point", pos: [10.5, 0, -6], color: "#60a5fa" },
      { id: "r39", label: "3,9", type: "cache", pos: [-9, 0, -2], showAt: 2, color: "#818cf8" },
      { id: "r57", label: "5,7", type: "cache", pos: [-3, 0, -2], showAt: 2, color: "#818cf8" },
      { id: "r46", label: "4,6", type: "cache", pos: [3, 0, -2], showAt: 2, color: "#818cf8" },
      { id: "r28", label: "2,8", type: "cache", pos: [9, 0, -2], showAt: 2, color: "#818cf8" },
      { id: "q3579", label: "3,5,7,9", type: "server", pos: [-6, 0, 2], showAt: 3, color: "#c084fc" },
      { id: "q2468", label: "2,4,6,8", type: "server", pos: [6, 0, 2], showAt: 3, color: "#c084fc" },
      { id: "full", label: "2 3 4 5 6 7 8 9", type: "lb", pos: [0, 0, 6], showAt: 4, color: "#4ade80" },
      { id: "aux", label: "write into B, copy A", type: "note", pos: [9, 0, 6], showAt: 4 },
      { id: "n0", label: "8 singleton runs", type: "note", pos: [0, 0, -2] },
      { id: "n1", label: "pass 1: runs of 2", type: "note", pos: [0, 0, 2], showAt: 2 },
      { id: "n2", label: "pass 2: runs of 4", type: "note", pos: [0, 0, 6], showAt: 3 },
      { id: "n3", label: "3 passes = log 8", type: "note", pos: [-9, 0, 6], showAt: 4 },
      { id: "n4", label: "n per pass: n log n", type: "note", pos: [-9, 0, 2], showAt: 5 },
      { id: "ab", label: "A:2,8,9  B:3,4,7", type: "queue", pos: [9, 0, 2], showAt: 5, color: "#fb923c" }
    ],
    edges: [
      { from: "p9", to: "r39", showAt: 2 },
      { from: "p3", to: "r39", showAt: 2 },
      { from: "p7", to: "r57", showAt: 2 },
      { from: "p5", to: "r57", showAt: 2 },
      { from: "p6", to: "r46", showAt: 2 },
      { from: "p4", to: "r46", showAt: 2 },
      { from: "p8", to: "r28", showAt: 2 },
      { from: "p2", to: "r28", showAt: 2 },
      { from: "r39", to: "q3579", showAt: 3 },
      { from: "r57", to: "q3579", showAt: 3 },
      { from: "r46", to: "q2468", showAt: 3 },
      { from: "r28", to: "q2468", showAt: 3 },
      { from: "q3579", to: "full", showAt: 4 },
      { from: "q2468", to: "full", showAt: 4 }
    ],
    steps: [
      {
        title: "Eight sorted singletons",
        text: "9,3,7,5,6,4,8,2. Each cell is a one-element list, so each run is already sorted. Two-way mergesort will pair neighbors until one run remains.",
        highlight: ["p9", "p3", "p7", "p5", "p6", "p4", "p8", "p2", "n0"]
      },
      {
        title: "Pass 1: merge adjacent pairs",
        text: "Merge 9 with 3 into 3,9; 7 with 5 into 5,7; 6 with 4 into 4,6; 8 with 2 into 2,8. Four runs of length 2. All eight keys were copied once.",
        highlight: ["r39", "r57", "r46", "r28", "n1", "p9", "p3", "p7", "p5", "p6", "p4", "p8", "p2"],
        hide: ["n0"],
        flows: [
          { from: "p9", to: "r39", color: "#60a5fa", label: "9" },
          { from: "p3", to: "r39", color: "#4ade80", label: "3" },
          { from: "p7", to: "r57", color: "#60a5fa" },
          { from: "p5", to: "r57", color: "#4ade80" },
          { from: "p6", to: "r46", color: "#60a5fa" },
          { from: "p4", to: "r46", color: "#4ade80" },
          { from: "p8", to: "r28", color: "#60a5fa" },
          { from: "p2", to: "r28", color: "#4ade80", label: "2" }
        ]
      },
      {
        title: "Pass 2: runs of four",
        text: "Merge 3,9 with 5,7 into 3,5,7,9. Merge 4,6 with 2,8 into 2,4,6,8. Two runs of length 4. Another full n copies.",
        highlight: ["r39", "r57", "r46", "r28", "q3579", "q2468", "n2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "r39", to: "q3579", color: "#c084fc", label: "3,9" },
          { from: "r57", to: "q3579", color: "#c084fc", label: "5,7" },
          { from: "r46", to: "q2468", color: "#c084fc" },
          { from: "r28", to: "q2468", color: "#c084fc" }
        ]
      },
      {
        title: "Pass 3: one sorted run",
        text: "Merge 3,5,7,9 with 2,4,6,8. Heads 3 vs 2, then 3 vs 4, and so on, until 2,3,4,5,6,7,8,9. Three passes = log2 8. Result sits in B; copy back to A.",
        highlight: ["q3579", "q2468", "full", "aux", "n3"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "q3579", to: "full", color: "#4ade80", label: "left" },
          { from: "q2468", to: "full", color: "#4ade80", label: "right" }
        ]
      },
      {
        title: "n copies times log n passes",
        text: "Each pass moves every key. Pass count is log n because run length doubles until it is n. Time Theta(n log n) for every array of length n.",
        highlight: ["full", "n3", "n4", "aux"],
        hide: ["n0", "n1", "n2"]
      },
      {
        title: "The merge kernel",
        text: "The same two-pointer copy (A vs B into C, then drain) is what each pair used. Theta(m+n) is the merge badge. Iterative two-way sort just repeats that kernel on doubling runs.",
        highlight: ["ab", "full", "n4"],
        hide: ["n0", "n1", "n2", "n3"]
      }
    ]
  }
});
