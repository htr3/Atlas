window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 42,
  title: "3.3 Optimal Merge Pattern - Greedy Method",
  video: "https://www.youtube.com/watch?v=HHIc5JZyenI",
  category: "Greedy Algorithms",
  tagline: "Always merge the two smallest lists; five files 5,10,20,30,30 cost 205.",
  summary: "Two-way merge of sorted lists of sizes m and n costs m+n comparisons. With more than two lists the pairing order changes the total. Lists 6,5,2,3 cost 40 if you always grow the left, 32 if you pair (6+5) and (2+3), and 31 if you always take two current smallest. The five-file instance 5,10,20,30,30 builds internal nodes 15,35,60,95 and costs 205 — also Σ (depth × size) on the leaves. Huffman coding reuses this tree.",

  theory: [
    {
      heading: "Two-way merge costs m+n",
      body: "Merging two <b>already sorted</b> lists compares one head from each side and emits the smaller, like the 4+4 example that produces 8 keys. If the lists have m and n elements the work is Θ(m+n): every key is written once. k-way merge exists, but this lecture forces <b>two-way</b> pairing so the only decision is <i>which pair next</i>.",
      bullets: [
        "Merge is defined on sorted runs; unsorted arrays are a different problem.",
        "Cost of one merge = size of the output list.",
        "A chain of merges pays that cost at every internal node, not only at the root."
      ]
    },
    {
      heading: "Greedy-choice logic: two smallest",
      body: "Four lists of sizes 6, 5, 2, 3. Left-to-right: 6+5=11, then 11+2=13, then 13+3=16, total <b>40</b>. Pair (6+5) and (2+3) then join 11+5: total <b>32</b>. Always two current smallest: 2+3=5, 5+5=10, 10+6=16, total <b>31</b>. The observation is the selection rule: at every stage merge a <b>minimum-size pair</b>. Large files should stay out of early merges because every time a key participates it pays again.",
      bullets: [
        "Different pairing patterns, different totals, same final 16-key file.",
        "Greedy = repeatedly extract two smallest remaining sizes (a min-heap of files).",
        "31 beat 32 beat 40 on this tiny instance; that ranking motivates the rule."
      ]
    },
    {
      heading: "Worked example: files 5, 10, 20, 30, 30",
      body: "Five files X1…X5, sizes taken in increasing order 5, 10, 20, 30, 30. Merge 5+10 → 15. Remaining {15, 20, 30, 30}. Merge 15+20 → 35. Remaining {35, 30, 30}. Merge 30+30 → 60. Remaining {35, 60}. Merge 35+60 → 95. Internal-node sum: 15+35+60+95 = <b>205</b>. Equivalently, each original file pays (its size) × (how many merges it rides) = its depth in the binary tree: 3·5 + 3·10 + 2·20 + 2·30 + 2·30 = 205. Formula: Σ d<sub>i</sub> x<sub>i</sub> over leaves, or Σ of every internal node.",
      bullets: [
        "Sort or heap-extract; do not merge in given-name order.",
        "Cost = sum of internal nodes = weighted external path length.",
        "The 95 at the root is the final file size (sum of all five) and is always paid once."
      ]
    },
    {
      heading: "Proof intuition",
      body: "A key in a file of size x is copied once per merge that file joins. Putting two large files together early creates a still-larger run that will be copied through every later merge — you have multiplied a big x by a large depth. Swapping so that the current two lightest runs combine instead is the Huffman/merge-pattern argument: an inversion (a heavier run sitting deeper than a lighter one) can be swapped to cut the weighted path. Two-smallest is exactly \"no inversions of size vs depth.\" The 6,5,2,3 board is that swap in numbers: delaying the 6 until last saves nine copies versus the left-to-right chain.",
      bullets: [
        "Each original record is charged once per level it climbs.",
        "Greedy keeps heavy files shallow (or at least not deeper than lighter ones).",
        "The same tree becomes Huffman’s code tree in the next lecture."
      ]
    },
    {
      heading: "Complexity",
      body: "k files. Each merge reduces the heap by one, so k−1 merges. Each extract-min on a binary heap is O(log k), two extracts plus one insert per merge: <b>O(k log k)</b>. Sorting once and two-pointer merging only works if you never create a new size that belongs in the middle — you do, so a heap (or a sorted multiset) is the honest structure. Naive “scan for two minima” is O(k²). Output the tree (or just the 205) depending on the question. Next video: treat character frequencies as the file sizes.",
      bullets: [
        "k−1 two-way merges, heap of current run sizes.",
        "O(k log k) with a min-heap; O(k²) with linear scans.",
        "Record either internal-node sum or Σ depth×size — they match."
      ]
    }
  ],

  keyTerms: [
    { term: "Two-way merge", def: "Combine two sorted runs; cost equals the sum of their lengths." },
    { term: "Merge pattern", def: "The binary tree of which pair is combined at each stage." },
    { term: "Optimal merge pattern", def: "The pairing that minimizes the sum of all intermediate list sizes." },
    { term: "Internal-node cost", def: "15+35+60+95=205 on the five-file tree; each node is one merge bill." },
    { term: "Weighted depth", def: "Σ d<sub>i</sub> x<sub>i</sub> over original files; same 205." },
    { term: "Two-smallest rule", def: "Always merge the current pair of least sizes (greedy choice)." },
    { term: "Final run size", def: "Sum of all files (16 or 95); paid once at the last merge, independent of pattern." }
  ],

  tradeoffs: [
    { pro: "Two-smallest is O(k log k) and matches the weighted-path minimum.", con: "A left-to-right chain is easier to code and can be much more expensive (40 vs 31)." },
    { pro: "Internal-node sum is a fast checksum while you draw the tree.", con: "Forgetting to add every internal node (or double-counting the root) misses 205." },
    { pro: "k-way merge would combine all four lists at once.", con: "The course forbids it here so the pairing question stays well-defined." },
    { pro: "The same tree is Huffman’s next lecture, so one drawing serves two topics.", con: "Merge cost is comparisons; Huffman cost is bits — do not mix units on one paper." }
  ],

  interviewTips: [
    "Start from two-way cost m+n, then show 6+5+2+3 as 40 vs 32 vs 31.",
    "State the rule in one line: always merge two currently smallest files.",
    "For 5,10,20,30,30 draw 15, then 35, then 60, then 95, box 205.",
    "Recompute 3·5+3·10+2·20+2·30+2·30 as a check.",
    "Name a min-heap of sizes and O(k log k).",
    "Say this tree is the setup for Huffman coding — that sentence scores the last slide."
  ],

  scene: {
    nodes: [
      { id: "f5", label: "5", type: "server", pos: [-10, 0, 6], color: "#4ade80" },
      { id: "f10", label: "10", type: "server", pos: [-5, 0, 6], color: "#4ade80" },
      { id: "f20", label: "20", type: "server", pos: [0, 0, 6], color: "#60a5fa" },
      { id: "f30a", label: "30", type: "server", pos: [5, 0, 6], color: "#c084fc" },
      { id: "f30b", label: "30", type: "server", pos: [10, 0, 6], color: "#c084fc" },
      { id: "m15", label: "15", type: "worker", pos: [-7.5, 0, 2], color: "#fb923c", showAt: 2 },
      { id: "m35", label: "35", type: "worker", pos: [-4, 0, -2], color: "#fb923c", showAt: 3 },
      { id: "m60", label: "60", type: "worker", pos: [7.5, 0, 2], color: "#facc15", showAt: 4 },
      { id: "m95", label: "95", type: "lb", pos: [1.5, 0, -6], showAt: 5 },
      { id: "bad40", label: "Chain cost 40", type: "note", pos: [8, 3, -7], showAt: 1 },
      { id: "n0", label: "Files 5,10,20,30,30", type: "note", pos: [-8, 3, 7.5] },
      { id: "n1", label: "Two-smallest pair", type: "note", pos: [8, 3, 7.5], showAt: 1 },
      { id: "n2", label: "Internals 15+35+60+95", type: "note", pos: [-8, 3, -7.5], showAt: 5 },
      { id: "n3", label: "Cost 205 = Σ d·x", type: "note", pos: [0, 3, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "f5", to: "m15", showAt: 2 },
      { from: "f10", to: "m15", showAt: 2 },
      { from: "m15", to: "m35", showAt: 3 },
      { from: "f20", to: "m35", showAt: 3 },
      { from: "f30a", to: "m60", showAt: 4 },
      { from: "f30b", to: "m60", showAt: 4 },
      { from: "m35", to: "m95", showAt: 5 },
      { from: "m60", to: "m95", showAt: 5 }
    ],
    steps: [
      {
        title: "Five sorted files",
        text: "Sizes 5,10,20,30,30 already in increasing order. Two-way merge only: each pairing writes a new run whose length is the sum.",
        highlight: ["f5", "f10", "f20", "f30a", "f30b", "n0"]
      },
      {
        title: "Why pairing order matters",
        text: "On 6,5,2,3 a left chain costs 11+13+16=40, a balanced pair costs 32, two-smallest costs 5+10+16=31. Same final 16 keys; different merge bills. That gap is the problem.",
        highlight: ["bad40", "n1", "f5", "f10"]
      },
      {
        title: "Merge the two smallest: 5+10=15",
        text: "Greedy choice: pick 5 and 10, pay 15, push the new file back into the set. Remaining sizes 15,20,30,30.",
        highlight: ["f5", "f10", "m15", "n1"],
        hide: ["bad40"],
        flows: [
          { from: "f5", to: "m15", color: "#4ade80", label: "5" },
          { from: "f10", to: "m15", color: "#4ade80", label: "10" }
        ]
      },
      {
        title: "Next smallest pair: 15+20=35",
        text: "Among 15,20,30,30 the lightest pair is 15 with 20. Pay 35. Remaining 35,30,30. The original 5 and 10 will now ride this 35 later — that is depth 2 already.",
        highlight: ["m15", "f20", "m35"],
        hide: ["n0", "bad40"],
        flows: [
          { from: "m15", to: "m35", color: "#fb923c", label: "15" },
          { from: "f20", to: "m35", color: "#60a5fa", label: "20" }
        ]
      },
      {
        title: "The two 30s become 60",
        text: "35 is larger than 30, so merge the two size-30 files first. Pay 60. Remaining 35 and 60. This is still two-smallest, not \"finish the left spine.\"",
        highlight: ["f30a", "f30b", "m60"],
        hide: ["n0", "bad40"],
        flows: [
          { from: "f30a", to: "m60", color: "#c084fc", label: "30" },
          { from: "f30b", to: "m60", color: "#c084fc", label: "30" }
        ]
      },
      {
        title: "Last merge 35+60=95",
        text: "Root 95 is the full file. Internal costs 15+35+60+95. Every pairing is now on the tree.",
        highlight: ["m35", "m60", "m95", "n2"],
        hide: ["n0", "bad40"],
        flows: [
          { from: "m35", to: "m95", color: "#fb923c", label: "35" },
          { from: "m60", to: "m95", color: "#facc15", label: "60" }
        ]
      },
      {
        title: "Two ways to write 205",
        text: "Sum internals = 205. Leaf check: 3·5+3·10+2·20+2·30+2·30=205. Heavy 30s sat at depth 2; the tiny 5 climbed three times. That is the optimal pattern.",
        highlight: ["m15", "m35", "m60", "m95", "n3", "f5"],
        hide: ["n0", "bad40"]
      },
      {
        title: "Heap cost, Huffman next",
        text: "k−1 merges, each a heap extract: O(k log k). The identical two-smallest tree, with 0/1 on the edges, is Huffman coding.",
        highlight: ["m95", "n3", "n1"],
        hide: ["bad40"]
      }
    ]
  }
});
