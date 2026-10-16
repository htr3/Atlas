window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 32,
  title: "2.6.3 Heap - Heap Sort - Heapify - Priority Queues",
  video: "https://www.youtube.com/watch?v=HqPJF2L5h9U",
  category: "Divide & Conquer",
  tagline: "Complete trees in arrays: insert up, delete down, heapify in O(n), sort in O(n log n).",
  summary: "A heap is a complete binary tree stored densely in an array with parent at i, children at 2i and 2i+1. Max-heap insert appends a leaf and sifts up; delete always removes the root, slides the last leaf into its place, and sifts down. Repeating delete parks keys in reverse-sorted order (heapsort). Heapify builds the same heap from the right in O(n). Heaps are the fast priority-queue structure: both insert and extract-max are O(log n).",

  theory: [
    {
      heading: "Arrays that remember the tree",
      body: "Store a binary tree level by level from index 1. If a node sits at i, its left child is at <code>2i</code>, right child at <code>2i+1</code>, parent at <code>floor(i/2)</code>. Filling level by level makes those formulas hold without storing pointers. A missing child must be left as a hole or the formulas lie (D would look like B's child). A <b>complete</b> binary tree has no holes from the first cell through the last: it is full through height h-1, and the last level is packed left to right. Every full tree is complete. Height of a complete tree is always <code>floor(log n)</code> — you never open a new level until the previous one is full.",
      bullets: [
        "Left 2i, right 2i+1, parent floor(i/2), 1-based.",
        "Complete: no gaps in the array between 1 and n.",
        "Height is log n; that bound drives every later runtime."
      ]
    },
    {
      heading: "Max-heap and min-heap",
      body: "A heap is a complete binary tree plus an order rule. Max-heap: every node is greater than or equal to all of its descendants, so the root is the maximum (lecture tree: 50 over 30 and 20, 15 and 10 under 30, 8 and 16 under 20). Min-heap flips the inequality; the root is the minimum. Duplicates are allowed. Study max-heap; min-heap is the same code with the compare reversed.",
      bullets: [
        "Complete tree first, heap order second.",
        "Max-heap root is the largest key.",
        "The array 50, 30, 20, 15, 10, 8, 16 has no holes and obeys max-heap order."
      ]
    },
    {
      heading: "Insert sifts up from a new leaf",
      body: "Do not drop a new maximum into the root — that opens holes and wrecks completeness. Append at the next free array slot (for seven keys, index 8), which is the leftmost last-level leaf. Then sift up: swap with the parent while the new key is larger. Inserting 60 under 15 walks 60 vs 15, vs 30, vs 50, and 60 becomes the root. The array becomes 60, 50, 20, 30, 10, 8, 16, 15. Swaps are at most the height, so insert is O(1) best (the new key is already a valid leaf) and <code>O(log n)</code> worst. Adjustment direction: leaf toward root.",
      bullets: [
        "Append at n+1, then bubble toward ancestors.",
        "60 from index 8 reaches index 1 in three swaps.",
        "Time between Theta(1) and O(log n)."
      ]
    },
    {
      heading: "Delete sifts down from a stolen last leaf",
      body: "You only ever delete the root (the shopkeeper's top apple). After 50 leaves, the last leaf 16 occupies the hole so the tree stays complete. Then sift down: swap with the larger child until heap order returns (16 vs 30, 30 rises; 16 vs 15 and 10, 16 already wins). Adjustment direction: root toward a leaf. Delete is <code>O(log n)</code>. Each extract-max yields the next-largest remaining key — that is the seed of heapsort. If you park the ejected 50 in the just-freed tail slot (outside the heap, which has shrunk to n-1), then park 30, then 20, the tail of the array reads sorted descending.",
      bullets: [
        "Always remove the root; last leaf fills the vacancy.",
        "Sift down with the larger child in a max-heap.",
        "Park ejected keys in the free tail: that is heapsort."
      ]
    },
    {
      heading: "Heapsort is create, then delete-all",
      body: "Given 10, 20, 15, 30, 40: treat a[1]=10 as a trivial heap, then insert 20 (swap with 10), insert 15 (stays), insert 30 (sifts to root), insert 40 (sifts to root). Heap is 40, 30, 15, 10, 20. Then delete: 40 parks at the end, 30 parks next, then 20, 15, 10. Two phases, each n operations of O(log n), total <code>2 n log n = O(n log n)</code>. Creation by n inserts is the O(n log n) build; the next section beats that build.",
      bullets: [
        "Phase 1: n inserts, O(n log n).",
        "Phase 2: n deletes parked in the tail, O(n log n).",
        "Together Theta(n log n) comparisons and swaps."
      ]
    },
    {
      heading: "Heapify is the O(n) build",
      body: "Start from the last index and walk left. Leaves already are heaps. At each internal node, sift down as in delete. Example array 10, 20, 15, 12, 40, 25, 18: 18, 25, 40, 12 are leaves; 15 swaps with 25; 20 swaps with 40; 10 swaps with 40 then with 20. Result 40, 20, 25, 12, 10, 15, 18. Direction is downward, opposite of insert. Most nodes sit near the leaves, so the total sift cost sums to <code>O(n)</code>, strictly faster than n inserts. That is the minimum time to build a heap.",
      bullets: [
        "Right-to-left, sift down, skip the leaves.",
        "Same downward repair as after a delete.",
        "O(n) versus O(n log n) for insert-all."
      ]
    },
    {
      heading: "Priority queues",
      body: "A priority queue is not FIFO: extract always returns the highest-priority item. The lecture treats the key itself as the priority. Smaller-is-better uses a min-heap; larger-is-better uses a max-heap. A plain array makes one of insert or extract O(n) (scan or shift). A heap makes both <code>O(log n)</code>. That is why heaps, not sorted arrays, back Dijkstra-style extract-min and job schedulers.",
      bullets: [
        "Priority = the number, min-heap or max-heap by policy.",
        "Array: some operation is linear.",
        "Heap: insert and delete both logarithmic."
      ]
    }
  ],

  keyTerms: [
    { term: "Complete binary tree", def: "No array holes from 1 to n; last level packed left to right." },
    { term: "Max-heap", def: "Complete tree where every node is at least as large as its descendants." },
    { term: "Sift up", def: "Insert repair: swap a new leaf with ancestors until order holds." },
    { term: "Sift down", def: "Delete/heapify repair: swap a node with the larger child toward a leaf." },
    { term: "Heapify", def: "Build a heap in O(n) by sifting down from n/2..1." },
    { term: "Heapsort", def: "Build a heap, then repeatedly extract-max into the shrinking tail." },
    { term: "Priority queue", def: "Extract-highest structure; heap gives O(log n) insert and delete." }
  ],

  tradeoffs: [
    { pro: "Array heap needs no pointers: 2i / 2i+1 / i/2 recover the tree.", con: "A hole anywhere in 1..n breaks completeness and those formulas." },
    { pro: "Insert and delete are O(log n) because height is log n.", con: "You cannot delete an arbitrary interior key and still call it a heap operation." },
    { pro: "Heapify builds in O(n), faster than n leaf-inserts.", con: "The O(n) bound is a sum over a full tree; a naive 'each of n nodes sifts log n' overcounts." },
    { pro: "Heapsort is O(n log n) and in-place if you park keys in the tail.", con: "Not stable, and the constant is larger than a well-tuned quicksort on arrays that fit in cache." }
  ],

  interviewTips: [
    "Write the three index formulas first, 1-based, then say completeness forbids holes.",
    "Insert: append then sift up. Delete: only the root, last leaf into the hole, sift down. Opposite directions.",
    "Trace 60 into 50,30,20,15,10,8,16: three parent swaps, 60 at the root.",
    "Heapsort = heapify (or n inserts) + n extract-max parked at the free tail.",
    "Quote O(n) for heapify versus O(n log n) for insert-all; the extra speed is why libraries heapify.",
    "Priority queue: min-heap if smaller priority wins, max-heap if larger wins; array implementations leave one op linear."
  ],

  scene: {
    nodes: [
      { id: "t50", label: "50", type: "server", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "t30", label: "30", type: "server", pos: [-5, 0, -2], color: "#60a5fa" },
      { id: "t20", label: "20", type: "server", pos: [5, 0, -2], color: "#60a5fa" },
      { id: "t15", label: "15", type: "cache", pos: [-8, 0, 2], color: "#818cf8" },
      { id: "t10", label: "10", type: "cache", pos: [-2, 0, 2], color: "#818cf8" },
      { id: "t8", label: "8", type: "cache", pos: [2, 0, 2], color: "#818cf8" },
      { id: "t16", label: "16", type: "cache", pos: [8, 0, 2], color: "#818cf8" },
      { id: "t60", label: "60", type: "worker", pos: [-11, 0, 6], showAt: 2, color: "#4ade80" },
      { id: "r60", label: "60", type: "lb", pos: [0, 0, -6], showAt: 4, color: "#4ade80" },
      { id: "r50", label: "50", type: "server", pos: [-5, 0, -2], showAt: 4, color: "#60a5fa" },
      { id: "r30", label: "30", type: "cache", pos: [-8, 0, 2], showAt: 4, color: "#818cf8" },
      { id: "r15", label: "15", type: "worker", pos: [-11, 0, 6], showAt: 4, color: "#818cf8" },
      { id: "arr", label: "50 30 20 15 10 8 16", type: "note", pos: [6, 0, 6] },
      { id: "n0", label: "2i, 2i+1, i/2", type: "note", pos: [9, 0, -6] },
      { id: "n1", label: "max-heap, complete", type: "note", pos: [9, 0, -2], showAt: 1 },
      { id: "n2", label: "append at index 8", type: "note", pos: [3, 0, 6], showAt: 2 },
      { id: "n3", label: "sift up vs 15,30,50", type: "note", pos: [3, 0, 6], showAt: 3 },
      { id: "n4", label: "60 at root, O(log n)", type: "note", pos: [8, 0, -6], showAt: 4 },
      { id: "n5", label: "delete root, last to hole", type: "note", pos: [8, 0, 6], showAt: 5 },
      { id: "park", label: "park 50 in tail", type: "storage", pos: [10, 0, 2], showAt: 5, color: "#fb923c" },
      { id: "n6", label: "heapify down, O(n)", type: "note", pos: [0, 0, 7.5], showAt: 6 },
      { id: "hf", label: "40 20 25 12 10 15 18", type: "queue", pos: [0, 0, 4], showAt: 6, color: "#c084fc" },
      { id: "pq", label: "PQ: heap log n", type: "note", pos: [-8, 0, 7.5], showAt: 7 }
    ],
    edges: [
      { from: "t50", to: "t30" },
      { from: "t50", to: "t20" },
      { from: "t30", to: "t15" },
      { from: "t30", to: "t10" },
      { from: "t20", to: "t8" },
      { from: "t20", to: "t16" },
      { from: "t15", to: "t60", showAt: 2 },
      { from: "r60", to: "r50", showAt: 4 },
      { from: "r60", to: "t20", showAt: 4 },
      { from: "r50", to: "r30", showAt: 4 },
      { from: "r50", to: "t10", showAt: 4 },
      { from: "r30", to: "r15", showAt: 4 },
      { from: "t50", to: "park", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Complete tree in the array",
        text: "Seven keys packed 50,30,20,15,10,8,16. Parent i, left 2i, right 2i+1. No holes, so the tree is complete and its height is log n.",
        highlight: ["t50", "t30", "t20", "t15", "t10", "t8", "t16", "arr", "n0"]
      },
      {
        title: "Max-heap order",
        text: "Every parent beats its descendants: 50 over 30 and 20, 30 over 15 and 10, 20 over 8 and 16. Root is the maximum. That is a max-heap.",
        highlight: ["t50", "t30", "t20", "n1", "arr"]
      },
      {
        title: "Insert 60 at the next leaf",
        text: "Do not place 60 at the root (that would open holes). Append at index 8, the left child of 15. Completeness holds; heap order does not.",
        highlight: ["t60", "t15", "n2", "arr"],
        flows: [
          { from: "t60", to: "t15", color: "#f87171", label: "breaks 15" }
        ]
      },
      {
        title: "Sift up: 15, then 30, then 50",
        text: "60 > 15, swap; 60 > 30, swap; 60 > 50, swap. Three swaps equal the height. Insert is O(log n) worst, O(1) if the new leaf already fits.",
        highlight: ["t60", "t15", "t30", "t50", "n3"],
        hide: ["n2"],
        flows: [
          { from: "t60", to: "t15", color: "#4ade80", label: "swap" },
          { from: "t15", to: "t30", color: "#4ade80", label: "up" },
          { from: "t30", to: "t50", color: "#4ade80", label: "up" }
        ]
      },
      {
        title: "60 is the new root",
        text: "After the bubble, the tree is 60 / 50,20 / 30,10,8,16 / 15. Array 60,50,20,30,10,8,16,15. Adjustment ran leaf-to-root.",
        highlight: ["r60", "r50", "t20", "r30", "t10", "t8", "t16", "r15", "n4"],
        hide: ["t50", "t30", "t15", "t60", "n0", "n1", "n2", "n3", "arr"]
      },
      {
        title: "Delete root, park in the tail",
        text: "Only the root leaves. Last leaf fills the hole, then sift down (root-to-leaf). Park 50 in the free tail — repeating that is heapsort, O(n log n).",
        highlight: ["r60", "park", "n5", "t16"],
        hide: ["t50", "t30", "t15", "t60", "n0", "n1", "n2", "n3", "n4", "arr"],
        flows: [
          { from: "r60", to: "park", color: "#fb923c", label: "extract" }
        ]
      },
      {
        title: "Heapify: sift down, right to left",
        text: "On 10,20,15,12,40,25,18 walk from the last internal node: 15 vs 25, 20 vs 40, 10 vs 40 then 20. Result 40,20,25,12,10,15,18 in O(n), not n log n.",
        highlight: ["hf", "n6"],
        hide: ["t50", "t30", "t20", "t15", "t10", "t8", "t16", "t60", "r60", "r50", "r30", "r15", "park", "n0", "n1", "n2", "n3", "n4", "n5", "arr"]
      },
      {
        title: "Priority queue",
        text: "Extract-highest is the heap delete. Min-heap if small keys win, max-heap if large keys win. A raw array leaves insert or extract linear; the heap keeps both at log n.",
        highlight: ["hf", "pq", "n6"],
        hide: ["t50", "t30", "t20", "t15", "t10", "t8", "t16", "t60", "r60", "r50", "r30", "r15", "park", "n0", "n1", "n2", "n3", "n4", "n5", "arr"]
      }
    ]
  }
});
