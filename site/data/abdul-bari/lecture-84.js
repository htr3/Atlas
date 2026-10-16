window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 84,
  title: "Merge Sort Algorithm - Hindi",
  video: "https://www.youtube.com/watch?v=zXhWPrMLXGo",
  category: "Strings, Trees & Arrays",
  tagline: "Split until one key, then two-way merge back up; 8 lists take 7 merges and an extra array.",
  summary: "Merging copies two already-sorted lists into a third sorted list with heads i, j and a write head k. Merge sort pretends an n-key array is n singleton lists, logically halves while low < high, then merges on the way up. On 8,3,7,5,9,2,6,4 the tree rebuilds 2..9. Results land in an auxiliary array B and copy back. Eight lists need seven two-way merges; T(n)=2T(n/2)+n is Theta(n log n).",

  theory: [
    {
      heading: "Merging is combining two sorted lists",
      body: "Before the sort, the lecture defines merge. List A has m keys, list B has n keys, both already ordered. The job is a third list C that holds every key, still ordered. Put integer heads <code>i</code> on A[0], <code>j</code> on B[0], and <code>k</code> on the first free cell of C. Compare A[i] with B[j], copy the smaller into C[k], and advance that read head and k. Worked lists: A = 2, 8, 10, 15 and B = 3, 5, 7, 12. First 2 wins, then 3, then 5, 7, 8, 10. Heads freeze on 15 and 12; 12 is smaller, so it moves, and j walks off the end of B.",
      bullets: [
        "Merging is not sorting from scratch: both inputs must already be sorted.",
        "Code: if A[i] < B[j] then C[k++]=A[i++]; else C[k++]=B[j++].",
        "The two-pointer loop runs while i < m and j < n — until either list is empty."
      ]
    },
    {
      heading: "Drain whichever list still has keys",
      body: "The moment one list is exhausted, the compare loop must stop. At least one key is still sitting in the other list (here 15 remains in A). Two drain loops copy the rest: while i < m write A[i++] into C; while j < n write B[j++]. Only one of those loops actually copies. If B had held an extra 17 after 12, then 15 would have moved first and 17 would have been the leftover. The finished procedure is the merge algorithm: A and B in, sorted C out. Time is linear in the two lengths, Theta(m+n).",
      bullets: [
        "Stop the compare loop as soon as i==m or j==n.",
        "Copy the remainder; one drain is always a no-op.",
        "Every key moves exactly once into C."
      ]
    },
    {
      heading: "More than two lists: many merge patterns",
      body: "Four sorted lists A, B, C, D can be paired A with B (result E) and C with D (result F), then E with F (result G). They can also be chained: A with B gives E, E with C gives F, F with D gives G. Both finish with every key in one sorted list. The lecture underlines the exam sentence: <b>there can be more than one merge pattern</b>. Eight singleton lists 3, 8, 5, 7, 2, 9, 4, 6 can be paired into 3,8 then 5,7 then 2,9 then 4,6, then those into 3,5,7,8 and 2,4,6,9, then one last combine — seven two-way merges. Pairing left-to-right in a different tree is still seven merges. n sorted lists need n−1 two-way merges, whatever the binary tree.",
      bullets: [
        "Two-way merge always takes exactly two lists per combine.",
        "Balanced pairing and sequential pairing are both legal.",
        "8 lists ⇒ 7 merges; the count is n−1, not the shape of the tree."
      ]
    },
    {
      heading: "Divide: treat n keys as n lists, split while low < high",
      body: "Now the unsorted array of eight keys 8, 3, 7, 5, 9, 2, 6, 4. Merge sort does not see one list of eight. It sees eight lists of one. A singleton is already sorted, so it is legal merge input. The array is never cut in memory: the split is <b>logical</b>. Procedure: if <code>low < high</code> there are at least two keys, so compute <code>mid = floor((low+high)/2)</code>, call MergeSort on low..mid, call MergeSort on mid+1..high, then Merge the two sorted windows. First call MergeSort(1, 8) (1-based, as in the lecture). Mid is 4, so the first division is 8,3,7,5 versus 9,2,6,4. The left window is still large: second division, then a third that isolates 8 and 3. Split until each window is one element.",
      bullets: [
        "Base case: low is not less than high — one key, return.",
        "mid = (low+high)/2; left [low, mid], right [mid+1, high].",
        "Physical partition does not happen; indices name the two runs."
      ]
    },
    {
      heading: "Worked array: merge on the way up",
      body: "After 8 and 3 are singles they merge to 3, 8 (the cells change order). The fourth division isolates 7 and 5; they merge to 5, 7. Those two runs of two merge to 3, 5, 7, 8 — the left half is finished before the right half is entered. Fifth and sixth divisions break 9, 2, 6, 4; 9 with 2 becomes 2, 9, 6 with 4 becomes 4, 6, and those merge to 2, 4, 6, 9. The last merge combines 3,5,7,8 with 2,4,6,9 into 2,3,4,5,6,7,8,9. That is post-order: left sort, right sort, then merge at the node. Same seven two-way merges as the pairing picture, different visit order.",
      bullets: [
        "First merge of the trace: 8 with 3 → 3,8.",
        "Left half 3,5,7,8 is complete before the right recursion runs.",
        "Final combine is the root merge of two runs of four."
      ]
    },
    {
      heading: "Auxiliary array, recurrence, extra space",
      body: "Two runs that still live inside A cannot be merged into those same cells without clobbering unread keys. The lecture takes an extra array B: merge A[low..mid] with A[mid+1..high] into B, then copy B back onto A. That is why the merge used here is not the three-list A,B,C of the opening; it is a modified merge that reads one array and writes the other. Recurrence of the recursive procedure: two half-size sorts plus a linear merge, <code>T(n)=2T(n/2)+Theta(n)</code>. Master theorem case 2 (or the tree: each of log n levels copies n keys) gives <b>Theta(n log n)</b>. The seven merges on n=8 are that tree counted by hand. Extra memory is Theta(n) for B; the algorithm is not in-place on arrays. Stability of equal keys is not the subject of this video — the board is the split/merge pattern and the extra buffer.",
      bullets: [
        "Merge into B, copy back to A; repeat at every combine.",
        "T(n)=2T(n/2)+n, T(1)=Theta(1) → Theta(n log n) on every input.",
        "Space: one auxiliary array of length n. In-place merge is not used here."
      ]
    }
  ],

  keyTerms: [
    { term: "Merging", def: "Copy two sorted lists into one sorted list with heads i, j, k; then drain the remainder." },
    { term: "Two-way merge", def: "Always combine exactly two runs. n runs need n−1 such combines." },
    { term: "Merge pattern", def: "The binary tree of which pairs you merge; several patterns exist for more than two lists." },
    { term: "Logical split", def: "Indices low, mid, high name two windows; the array is not physically cut." },
    { term: "mid", def: "floor((low+high)/2). Left is low..mid, right is mid+1..high." },
    { term: "Singleton run", def: "A one-element list, already sorted, and therefore legal merge input." },
    { term: "Auxiliary array B", def: "The extra buffer that receives a merge; results copy back onto A." },
    { term: "T(n)=2T(n/2)+n", def: "Two recursive sorts plus a linear merge; Theta(n log n)." }
  ],

  tradeoffs: [
    { pro: "Every array of length n pays the same n log n merges — no pivot luck.", con: "Each merge needs a second array of size n; this is not an in-place sort." },
    { pro: "A singleton is already sorted, so the base case is empty work.", con: "You still allocate B and copy back even when a run is tiny." },
    { pro: "Several pairing trees all sort; the recursive mid-split is just one pattern.", con: "Writing the iterative pass version and calling it this recursion is the usual mix-up." },
    { pro: "Logical windows keep the keys in one A; no list-node surgery.", con: "You cannot merge two slices of A into the same A without the auxiliary copy." }
  ],

  interviewTips: [
    "Define merge first: two sorted lists, i/j/k, drain the leftover, Theta(m+n).",
    "Say there can be more than one merge pattern; quote 8 lists ⇒ 7 two-way merges.",
    "Write if (low < high) { mid=(low+high)/2; MS(low,mid); MS(mid+1,high); Merge(low,mid,high); }.",
    "Trace 8,3,7,5,9,2,6,4: first merge 3,8; left finishes 3,5,7,8 before the right half starts.",
    "Name array B: merge into B, copy back to A — the opening A,B,C merge is modified.",
    "Quote T(n)=2T(n/2)+n = Theta(n log n) and extra space Theta(n). This video does not grade stability."
  ],

  scene: {
    nodes: [
      { id: "aList", label: "A: 2 8 10 15", type: "queue", pos: [-8, 0, -5], color: "#60a5fa" },
      { id: "bList", label: "B: 3 5 7 12", type: "queue", pos: [8, 0, -5], color: "#818cf8" },
      { id: "cList", label: "C: 2 3 5 7 8 10 12 15", type: "lb", pos: [0, 0, 3], color: "#4ade80" },
      { id: "nIJ", label: "i on A, j on B, k on C", type: "note", pos: [0, 0, -1] },
      { id: "nDef", label: "combine 2 sorted into 1", type: "note", pos: [0, 0, 6] },

      { id: "e8", label: "8", type: "point", pos: [-10.5, 0, -7], showAt: 1, color: "#60a5fa" },
      { id: "e3", label: "3", type: "point", pos: [-7.5, 0, -7], showAt: 1, color: "#60a5fa" },
      { id: "e7", label: "7", type: "point", pos: [-4.5, 0, -7], showAt: 1, color: "#60a5fa" },
      { id: "e5", label: "5", type: "point", pos: [-1.5, 0, -7], showAt: 1, color: "#60a5fa" },
      { id: "e9", label: "9", type: "point", pos: [1.5, 0, -7], showAt: 1, color: "#60a5fa" },
      { id: "e2", label: "2", type: "point", pos: [4.5, 0, -7], showAt: 1, color: "#60a5fa" },
      { id: "e6", label: "6", type: "point", pos: [7.5, 0, -7], showAt: 1, color: "#60a5fa" },
      { id: "e4", label: "4", type: "point", pos: [10.5, 0, -7], showAt: 1, color: "#60a5fa" },
      { id: "n8", label: "8 singleton lists", type: "note", pos: [0, 0, -4], showAt: 1 },

      { id: "left", label: "8 3 7 5", type: "server", pos: [-6, 0, -2], showAt: 2, color: "#818cf8" },
      { id: "right", label: "9 2 6 4", type: "server", pos: [6, 0, -2], showAt: 2, color: "#818cf8" },
      { id: "nMid", label: "mid=(1+8)/2 = 4", type: "note", pos: [0, 0, 1], showAt: 2 },

      { id: "p83", label: "8 | 3", type: "cache", pos: [-9, 0, 2], showAt: 3, color: "#c084fc" },
      { id: "p75", label: "7 | 5", type: "cache", pos: [-3, 0, 2], showAt: 3, color: "#c084fc" },
      { id: "p92", label: "9 | 2", type: "cache", pos: [3, 0, 2], showAt: 3, color: "#c084fc" },
      { id: "p64", label: "6 | 4", type: "cache", pos: [9, 0, 2], showAt: 3, color: "#c084fc" },
      { id: "nRec", label: "split while L < H", type: "note", pos: [0, 0, 5], showAt: 3 },

      { id: "m38", label: "3,8", type: "worker", pos: [-9, 0, 5.5], showAt: 4, color: "#4ade80" },
      { id: "m57", label: "5,7", type: "worker", pos: [-3, 0, 5.5], showAt: 4, color: "#4ade80" },
      { id: "nFirst", label: "first merges 3,8 and 5,7", type: "note", pos: [7, 0, 5.5], showAt: 4 },

      { id: "m3578", label: "3,5,7,8", type: "service", pos: [-6, 0, 1], showAt: 5, color: "#4ade80" },
      { id: "m29", label: "2,9", type: "worker", pos: [3, 0, 5.5], showAt: 5, color: "#4ade80" },
      { id: "m46", label: "4,6", type: "worker", pos: [9, 0, 5.5], showAt: 5, color: "#4ade80" },
      { id: "nLeft", label: "left half done, then right", type: "note", pos: [-9, 0, -4], showAt: 5 },

      { id: "m2469", label: "2,4,6,9", type: "service", pos: [6, 0, 1], showAt: 6, color: "#4ade80" },
      { id: "done", label: "2 3 4 5 6 7 8 9", type: "lb", pos: [0, 0, 6], showAt: 6, color: "#4ade80" },
      { id: "auxB", label: "write B, copy back to A", type: "note", pos: [-9, 0, 6], showAt: 6 },

      { id: "n7", label: "8 lists => 7 merges", type: "note", pos: [-8, 0, -2], showAt: 7 },
      { id: "nT", label: "T(n)=2T(n/2)+n  n log n", type: "note", pos: [8, 0, -2], showAt: 7 },
      { id: "nSp", label: "extra array B, not in-place", type: "note", pos: [0, 0, 2], showAt: 7 }
    ],
    edges: [
      { from: "aList", to: "cList", label: "A[i]" },
      { from: "bList", to: "cList", label: "B[j]" },
      { from: "e8", to: "left", showAt: 2 },
      { from: "e3", to: "left", showAt: 2 },
      { from: "e7", to: "left", showAt: 2 },
      { from: "e5", to: "left", showAt: 2 },
      { from: "e9", to: "right", showAt: 2 },
      { from: "e2", to: "right", showAt: 2 },
      { from: "e6", to: "right", showAt: 2 },
      { from: "e4", to: "right", showAt: 2 },
      { from: "left", to: "p83", showAt: 3 },
      { from: "left", to: "p75", showAt: 3 },
      { from: "right", to: "p92", showAt: 3 },
      { from: "right", to: "p64", showAt: 3 },
      { from: "p83", to: "m38", showAt: 4 },
      { from: "p75", to: "m57", showAt: 4 },
      { from: "m38", to: "m3578", showAt: 5 },
      { from: "m57", to: "m3578", showAt: 5 },
      { from: "p92", to: "m29", showAt: 5 },
      { from: "p64", to: "m46", showAt: 5 },
      { from: "m29", to: "m2469", showAt: 6 },
      { from: "m46", to: "m2469", showAt: 6 },
      { from: "m3578", to: "done", showAt: 6 },
      { from: "m2469", to: "done", showAt: 6 }
    ],
    steps: [
      {
        title: "Two-pointer merge into C",
        text: "A = 2,8,10,15 and B = 3,5,7,12 are already sorted. Compare A[i] with B[j], copy the smaller into C[k], advance. After 2,3,5,7,8,10 the heads sit on 15 and 12; 12 moves and j leaves B, so drain 15. Merging combines two sorted lists into one.",
        highlight: ["aList", "bList", "cList", "nIJ", "nDef"],
        hide: ["n8", "nMid", "nRec", "nFirst", "nLeft", "auxB", "n7", "nT", "nSp"],
        flows: [
          { from: "aList", to: "cList", color: "#4ade80", label: "2" },
          { from: "bList", to: "cList", color: "#60a5fa", label: "3" }
        ]
      },
      {
        title: "Eight keys, eight singleton runs",
        text: "Array 8,3,7,5,9,2,6,4 is not treated as one list of eight. Each cell is its own sorted list of length 1. A singleton is already sorted, so it is legal input to two-way merge.",
        highlight: ["e8", "e3", "e7", "e5", "e9", "e2", "e6", "e4", "n8"],
        hide: ["aList", "bList", "cList", "nIJ", "nDef", "nMid", "nRec", "nFirst", "nLeft", "auxB", "n7", "nT", "nSp"]
      },
      {
        title: "First logical split at mid 4",
        text: "MergeSort(1,8): low < high, mid = (1+8)/2 = 4. Left window 8,3,7,5 and right window 9,2,6,4. The cut is logical — the array is not physically divided. Recurse on the left first.",
        highlight: ["e8", "e3", "e7", "e5", "e9", "e2", "e6", "e4", "left", "right", "nMid"],
        hide: ["aList", "bList", "cList", "nIJ", "nDef", "n8", "nRec", "nFirst", "nLeft", "auxB", "n7", "nT", "nSp"],
        flows: [
          { from: "e8", to: "left", color: "#60a5fa", label: "left" },
          { from: "e9", to: "right", color: "#64748b", label: "later" }
        ]
      },
      {
        title: "Keep splitting while L < H",
        text: "Left 1..4 splits again, then 8 and 3 become singles (third division). Same on 7|5, 9|2, 6|4. Stop only when a window has one key. Then MergeSort(low,mid), MergeSort(mid+1,high), Merge.",
        highlight: ["left", "right", "p83", "p75", "p92", "p64", "nRec", "e8", "e3", "e7", "e5"],
        hide: ["aList", "bList", "cList", "nIJ", "nDef", "n8", "nMid", "nFirst", "nLeft", "auxB", "n7", "nT", "nSp"]
      },
      {
        title: "First merges: 3,8 and 5,7",
        text: "8 with 3 becomes 3,8 — the cells change order. 7 with 5 becomes 5,7. Those are the first two-way merges. The right half has not been entered yet; the recursion is still finishing the left spine.",
        highlight: ["p83", "p75", "m38", "m57", "nFirst", "e8", "e3", "e7", "e5"],
        hide: ["aList", "bList", "cList", "nIJ", "nDef", "n8", "nMid", "nRec", "nLeft", "auxB", "n7", "nT", "nSp", "p92", "p64", "right", "e9", "e2", "e6", "e4"],
        flows: [
          { from: "p83", to: "m38", color: "#4ade80", label: "3,8" },
          { from: "p75", to: "m57", color: "#4ade80", label: "5,7" }
        ]
      },
      {
        title: "Left run of four, then the right pairs",
        text: "Merge 3,8 with 5,7 into 3,5,7,8. Left half of the original array is sorted. Now the pending right call splits 9,2,6,4: 9 with 2 → 2,9 and 6 with 4 → 4,6.",
        highlight: ["m38", "m57", "m3578", "m29", "m46", "nLeft", "left"],
        hide: ["aList", "bList", "cList", "nIJ", "nDef", "n8", "nMid", "nRec", "nFirst", "auxB", "n7", "nT", "nSp", "e8", "e3", "e7", "e5", "e9", "e2", "e6", "e4"],
        flows: [
          { from: "m38", to: "m3578", color: "#4ade80" },
          { from: "m57", to: "m3578", color: "#4ade80" },
          { from: "p92", to: "m29", color: "#c084fc", label: "2,9" },
          { from: "p64", to: "m46", color: "#c084fc", label: "4,6" }
        ]
      },
      {
        title: "Root merge through auxiliary B",
        text: "2,9 with 4,6 becomes 2,4,6,9. Last, merge 3,5,7,8 with 2,4,6,9 into 2..9. That result cannot overwrite A in place: write it into extra array B, then copy B back onto A.",
        highlight: ["m3578", "m2469", "done", "auxB", "m29", "m46"],
        hide: ["aList", "bList", "cList", "nIJ", "nDef", "n8", "nMid", "nRec", "nFirst", "nLeft", "n7", "nT", "nSp", "e8", "e3", "e7", "e5", "e9", "e2", "e6", "e4", "m38", "m57", "p83", "p75", "p92", "p64"],
        flows: [
          { from: "m3578", to: "done", color: "#4ade80", label: "left" },
          { from: "m2469", to: "done", color: "#4ade80", label: "right" }
        ]
      },
      {
        title: "Seven merges, n log n, extra space",
        text: "Eight singleton lists needed seven two-way merges. Recurrence T(n)=2T(n/2)+n is Theta(n log n) on every input. Extra memory is the auxiliary array B; this lecture does not claim an in-place merge.",
        highlight: ["done", "m3578", "m2469", "n7", "nT", "nSp", "auxB"],
        hide: ["aList", "bList", "cList", "nIJ", "nDef", "n8", "nMid", "nRec", "nFirst", "nLeft", "e8", "e3", "e7", "e5", "e9", "e2", "e6", "e4", "m38", "m57", "m29", "m46", "p83", "p75", "p92", "p64", "left", "right"]
      }
    ]
  }
});
