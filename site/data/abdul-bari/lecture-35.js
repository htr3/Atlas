window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 35,
  title: "2.7.3 MergeSort in-depth Analysis",
  video: "https://www.youtube.com/watch?v=ak-pz7tS5DE",
  category: "Divide & Conquer",
  tagline: "Stable, external, and list-friendly — but it needs n extra cells and hates tiny n.",
  summary: "Mergesort scales to millions of records, merges linked lists by relinking, and streams files larger than RAM (5 GB and 10 GB through 4 GB) as external sort. It is stable: two 8s keep their input order (Ravi before Sunil). Costs: a Theta(n) auxiliary array plus log n stack, and on n <= 15 the recursion loses to insertion sort, so production code uses insertion as the base case.",

  theory: [
    {
      heading: "Built for huge inputs",
      body: "The lecture's first pro is scale. Quicksort-like in-place methods assume the whole list sits in memory and is cheap to shuffle. Mergesort only needs to merge runs. That merge works on arrays, on linked lists, and on files whose combined size dwarfs RAM. If you have millions of numbers or records, this is the sort family that still has a plan. The reasons occupy the next sections.",
      bullets: [
        "Millions of keys: merge runs, do not rely on random swaps.",
        "The same merge kernel ports to lists and to disk.",
        "Other elementary sorts do not offer an external mode for free."
      ]
    },
    {
      heading: "Linked lists: merge by relinking",
      body: "Two sorted lists 2→8→11 and 3→9→12 do not need a third chain. Compare heads, splice the winner onto the result, and advance that list. After 2, then 3, then 8, then 9, then 11, then 12, you have one sorted list and you never allocated a node. Mergesort on linked lists is therefore extra-space cheap: the 'auxiliary array' is the existing next pointers. That is why the lecture calls mergesort a good list sort.",
      bullets: [
        "Compare heads, rewrite next pointers, no new nodes.",
        "The merged chain is the sort output.",
        "Arrays still need a second buffer; lists do not."
      ]
    },
    {
      heading: "External merge: 5 GB and 10 GB through 4 GB RAM",
      body: "File A is 5 GB, file B is 10 GB, RAM is 4 GB. You cannot load both files. You also cannot load either file whole. External merge streams a block (a 'run' or chunk) from each file, compares, writes the smaller record to an output file, and refills the block that ran dry. The working set in RAM is two small buffers plus an output buffer, not 15 GB. Because mergesort is made of merges, the same idea sorts a file that does not fit in memory: produce sorted runs on disk, then two-way (or m-way) merge those runs. That is external sorting.",
      bullets: [
        "Bring a chunk of A and a chunk of B, not the files.",
        "Write the winner, refill that side, repeat.",
        "Mergesort inherits external sorting from its merge."
      ]
    },
    {
      heading: "Stability: the two 8s and the marksheet",
      body: "A sort is stable if equal keys keep their original relative order. Draw a small 8 and a large 8 in the input; after a proper merge the small 8 is still first. Numbers hide why that matters. Treat the keys as exam marks: Ravi's 8 appeared before Sunil's 8 while the file was still ordered by name. Sorting by marks must not swap them — the previous order is the tie-break. Mergesort's merge copies the left run when the keys compare equal (or the earlier run, if you write <=), so the first 8 stays first.",
      bullets: [
        "Equal keys retain input order.",
        "Records: sort by marks without scrambling the name order among ties.",
        "Implement merge with <= on the left run to keep stability."
      ]
    },
    {
      heading: "Not in-place on arrays",
      body: "In-place means you rearrange inside the original n cells. Merging two halves of an array into that same array overwrites keys you still need. The algorithm therefore uses an auxiliary array of length n (plus, if you ping-pong, you still allocated it). Linked-list mergesort is the exception. For arrays, extra Theta(n) memory is the headline con.",
      bullets: [
        "In-place: permute the given array only.",
        "Array merge needs a second n-cell buffer.",
        "Lists dodge this by relinking."
      ]
    },
    {
      heading: "Tiny n: insertion sort as the base case",
      body: "Asymptotically n log n beats n^2, but on a machine the recursion and merge setup lose when the slice is tiny. Measurements in the lecture: for n <= 15, mergesort is slower than insertion sort. Insertion is also stable, so using it as the 'small problem' does not break stability. Bubble sort is stable too, but insertion is the list-friendly n^2 partner. Practical merge sort: if (high-low+1) <= 15, insertion-sort the slice, else split and merge.",
      bullets: [
        "n <= 15: insertion wins on real hardware.",
        "Keep insertion because it is stable, like merge.",
        "This is the missing 'small problem' the pure recursive code never defined."
      ]
    },
    {
      heading: "Stack plus buffer: n + log n space",
      body: "The recursion tree for n=8 has height log n, so at most log n activation records are live (you finish the left spine before the right). Auxiliary merge space is n. Total n + log n, which is Theta(n). The log n stack is real — every recursive algorithm pays it — but the n buffer dominates the big-O.",
      bullets: [
        "Stack depth = height = log n.",
        "Buffer = n.",
        "Asymptotic extra space Theta(n)."
      ]
    }
  ],

  keyTerms: [
    { term: "Stable sort", def: "Equal keys keep the order they had in the input (small-8 before large-8)." },
    { term: "In-place", def: "Uses only a constant amount of extra memory beyond the input array." },
    { term: "External sorting", def: "Sort data that does not fit in RAM by merging disk runs." },
    { term: "Run / chunk", def: "A block of a file brought into RAM for an external merge step." },
    { term: "Relink merge", def: "Splicing list nodes by rewriting next pointers, no new nodes." },
    { term: "Base-case insertion", def: "Sort slices of size <= 15 with insertion sort to beat recursion overhead." },
    { term: "n + log n space", def: "Auxiliary array n plus recursion stack log n, Theta(n) overall." }
  ],

  tradeoffs: [
    { pro: "Stable, so a marks sort keeps the previous name order among ties.", con: "Array mergesort is not in-place; you allocate n extra cells." },
    { pro: "Linked-list merge rewires pointers and needs no third list.", con: "Array code cannot steal that trick; it always writes a buffer." },
    { pro: "External merge streams 5 GB + 10 GB through 4 GB RAM.", con: "Disk I/O dominates; you must pick run size and m-way merge degree with care." },
    { pro: "Theta(n log n) on every input, no quicksort-style n^2 surprise.", con: "On n <= 15 the recursion is slower than insertion; a hybrid is required." }
  ],

  interviewTips: [
    "Name the four pros: large n, linked lists, external files, stability.",
    "Walk 5 GB + 10 GB vs 4 GB RAM: two small buffers, write the winner, refill.",
    "Define stable with the two 8s, then with Ravi vs Sunil on a marksheet.",
    "Say not in-place for arrays; lists are the extra-space exception.",
    "Cutoff: n <= 15, insertion sort, because insertion is also stable.",
    "Space: n buffer + log n stack = Theta(n). Do not forget the stack when they ask 'extra memory'."
  ],

  scene: {
    nodes: [
      { id: "diskA", label: "File A 5GB", type: "storage", pos: [-8, 0, -5], color: "#a78bfa" },
      { id: "diskB", label: "File B 10GB", type: "storage", pos: [-8, 0, 0], color: "#a78bfa" },
      { id: "ram", label: "RAM 4GB", type: "cache", pos: [0, 0, -2.5], color: "#facc15" },
      { id: "bufA", label: "chunk 2", type: "queue", pos: [0, 0, -6], showAt: 2, color: "#60a5fa" },
      { id: "bufB", label: "chunk 3", type: "queue", pos: [0, 0, 1], showAt: 2, color: "#fb923c" },
      { id: "out", label: "out file", type: "db", pos: [8, 0, -2.5], showAt: 2, color: "#4ade80" },
      { id: "listL", label: "2-8-11", type: "service", pos: [-8, 0, 5], showAt: 1, color: "#818cf8" },
      { id: "listR", label: "3-9-12", type: "service", pos: [0, 0, 5], showAt: 1, color: "#818cf8" },
      { id: "listM", label: "2-3-8-9-11-12", type: "lb", pos: [8, 0, 5], showAt: 1, color: "#4ade80" },
      { id: "e1", label: "8 small", type: "point", pos: [-6, 0, 7.5], showAt: 4, color: "#22d3ee" },
      { id: "e2", label: "8 large", type: "point", pos: [-2, 0, 7.5], showAt: 4, color: "#c084fc" },
      { id: "ravi", label: "Ravi then Sunil", type: "note", pos: [6, 0, 7.5], showAt: 4 },
      { id: "n0", label: "cannot load 15GB", type: "note", pos: [8, 0, 1] },
      { id: "n1", label: "relink, no 3rd list", type: "note", pos: [8, 0, 2], showAt: 1 },
      { id: "n2", label: "refill the dry side", type: "note", pos: [8, 0, 1], showAt: 3 },
      { id: "n3", label: "stable merge uses <=", type: "note", pos: [0, 0, -6], showAt: 4 },
      { id: "n4", label: "array needs extra n", type: "note", pos: [-8, 0, -2.5], showAt: 5 },
      { id: "ins", label: "n<=15: insertion", type: "worker", pos: [8, 0, 5], showAt: 6, color: "#fb923c" },
      { id: "n5", label: "space n + log n stack", type: "note", pos: [0, 0, 7.5], showAt: 7 }
    ],
    edges: [
      { from: "listL", to: "listM", showAt: 1 },
      { from: "listR", to: "listM", showAt: 1 },
      { from: "diskA", to: "bufA", showAt: 2 },
      { from: "diskB", to: "bufB", showAt: 2 },
      { from: "bufA", to: "ram", showAt: 2 },
      { from: "bufB", to: "ram", showAt: 2 },
      { from: "ram", to: "out", showAt: 2 },
      { from: "e1", to: "ravi", showAt: 4, dashed: true },
      { from: "e2", to: "ravi", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Files that do not fit",
        text: "5 GB and 10 GB sit on disk. RAM is 4 GB. Mergesort is the family that can still sort this, because merge never needs both files resident.",
        highlight: ["diskA", "diskB", "ram", "n0"]
      },
      {
        title: "Lists merge by relinking",
        text: "2-8-11 and 3-9-12 become 2-3-8-9-11-12 by rewriting next pointers. No third linked list is allocated. That is why mergesort is the list sort.",
        highlight: ["listL", "listR", "listM", "n1"],
        hide: ["n0"],
        flows: [
          { from: "listL", to: "listM", color: "#60a5fa", label: "2,8,11" },
          { from: "listR", to: "listM", color: "#fb923c", label: "3,9,12" }
        ]
      },
      {
        title: "Stream chunks through RAM",
        text: "Load a block headed by 2 from A and a block headed by 3 from B. Write 2 to the output file, refill A's buffer. Then write 3, refill B. Working set stays inside 4 GB.",
        highlight: ["diskA", "diskB", "bufA", "bufB", "ram", "out"],
        hide: ["n0", "n1", "listL", "listR", "listM"],
        flows: [
          { from: "diskA", to: "bufA", color: "#60a5fa", label: "2" },
          { from: "diskB", to: "bufB", color: "#fb923c", label: "3" },
          { from: "ram", to: "out", color: "#4ade80", label: "2 then 3" }
        ]
      },
      {
        title: "Refill the side that emptied",
        text: "Each write consumes one record from one buffer. Pull the next block from that file only. External mergesort is this loop on disk runs.",
        highlight: ["bufA", "bufB", "out", "n2", "ram"],
        hide: ["n0", "n1", "listL", "listR", "listM"],
        flows: [
          { from: "diskA", to: "bufA", color: "#60a5fa", label: "next" },
          { from: "ram", to: "out", color: "#4ade80", label: "write" }
        ]
      },
      {
        title: "Stable: small 8 stays first",
        text: "Two records with mark 8: Ravi then Sunil in the name-ordered file. After mergesort by marks, Ravi's 8 is still before Sunil's. Merge must take the left (earlier) key on ties.",
        highlight: ["e1", "e2", "ravi", "n3"],
        hide: ["n0", "n1", "n2", "listL", "listR", "listM", "bufA", "bufB"]
      },
      {
        title: "Arrays are not in-place",
        text: "Merging two halves of an array overwrites live keys, so you allocate n extra cells. Lists already paid that cost in their pointers. This is the main array con.",
        highlight: ["ram", "out", "n4"],
        hide: ["n0", "n1", "n2", "n3", "e1", "e2", "ravi", "listL", "listR", "listM", "bufA", "bufB"]
      },
      {
        title: "Cutoff 15: insertion sort",
        text: "On n <= 15, recursion plus merge setup loses to insertion sort on a real machine, even though n^2 is worse asymptotically. Insertion is stable, so the hybrid stays stable.",
        highlight: ["ins", "n4"],
        hide: ["n0", "n1", "n2", "n3", "e1", "e2", "ravi", "listL", "listR", "listM", "bufA", "bufB", "out"]
      },
      {
        title: "n buffer plus log n stack",
        text: "Live frames follow the left spine, height log n. Add the n-cell merge buffer. Extra space is n + log n = Theta(n).",
        highlight: ["n5", "ram", "ins"],
        hide: ["n0", "n1", "n2", "n3", "n4", "e1", "e2", "ravi", "listL", "listR", "listM", "bufA", "bufB"]
      }
    ]
  }
});
