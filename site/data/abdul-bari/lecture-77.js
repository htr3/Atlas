window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 77,
  title: "10.2 B Trees and B+ Trees. How they are useful in Databases",
  video: "https://www.youtube.com/watch?v=aZjYr87r1b8",
  category: "Strings, Trees & Arrays",
  tagline: "Self-managing multi-level indexes: split full nodes upward; B+ keeps records at linked leaves.",
  summary: "Disks are read in blocks (track+sector, typically 512 B). Scanning 100 employee rows of 128 B needs 25 block I/Os; a dense key+pointer index drops that to a few index blocks plus one data block. Multi-level indexes cut I/O further but should grow and shrink by themselves. B-trees are m-way search trees with occupancy rules, all leaves at one level, and bottom-up splits. B+ trees store record pointers only in a linked leaf list (the dense index); upper levels are a sparse index of copies.",

  theory: [
    {
      heading: "Disks, blocks, and why RAM structures are the wrong picture",
      body: "A platter is logically cut into concentric <b>tracks</b> and pie-slice <b>sectors</b>. Their intersection is a <b>block</b>, addressed by (track, sector). Study size: 512 bytes, offsets 0..511 inside the block. The head seeks tracks; the platter spins to the sector. Programs never operate on the disk in place: a block is copied into main memory, processed, and maybe written back. Data structures organise RAM; DBMS organises those disk blocks. That gap is why B-trees exist.",
      bullets: [
        "Byte address = block address + offset.",
        "I/O unit is a whole block, not a row.",
        "Spin changes sector; arm motion changes track."
      ]
    },
    {
      heading: "Tables in blocks, then a dense index",
      body: "Employee row = 128 B (id 10, name 50, dept 10, …). A 512 B block holds 4 rows. 100 rows → <b>25 data blocks</b>. A query for one id may scan all 25. An <b>index</b> stores (key, record pointer) — 10+6=16 B per entry, 32 entries per block, 100 keys → about 4 index blocks. Search the index (≤4 I/Os) then follow one pointer (1 data I/O): 5 blocks instead of 25. That index is <b>dense</b>: one entry per record.",
      bullets: [
        "Cost is number of block accesses, not CPU compares.",
        "Index lives on disk too, not only in RAM.",
        "4 index + 1 data beats 25 data for a point query."
      ]
    },
    {
      heading: "Multi-level (sparse) indexes",
      body: "1000 rows → ~40 first-level index blocks — still a scan. Build a higher index with <b>one entry per lower index block</b> (sparse): 40/32 ≈ 2 blocks. Lookup becomes 2 + 1 + 1 I/Os. Keep stacking until the top fits in a couple of blocks. You want those extra levels to appear and vanish <b>automatically</b> as the table grows or shrinks. Turned on its side, the stack of indexes is already a tree.",
      bullets: [
        "Upper levels are sparse (one key per child block).",
        "Leaves of the index still point at records.",
        "Self-managed multi-level index = B-tree / B+ tree."
      ]
    },
    {
      heading: "From BST to m-way search tree",
      body: "A BST holds one key and two children. An <b>m-way (m-ary) search tree</b> holds up to m−1 sorted keys and m children: left of k₁, between k₁ and k₂, …, right of k_{m−1}. Search is the same idea, just more fan-out. Node layout for an index: child-block pointer, key, <b>record pointer</b>, child-block pointer, key, record pointer, … A 10-way node can pack 9 keys. Uncontrolled insertion still yields height n (a stick of half-empty nodes) — the BST disease at larger degree.",
      bullets: [
        "Degree m: at most m children, m−1 keys.",
        "Each key in a B-tree node also carries a record pointer.",
        "Without occupancy rules, m-way trees degenerate like BSTs."
      ]
    },
    {
      heading: "B-tree rules and bottom-up split",
      body: "A <b>B-tree of degree m</b> is an m-way search tree plus: (1) every non-root node has at least <b>⌈m/2⌉</b> children (at least half full); (2) the root may have as few as 2 children (one key); (3) <b>all leaves at the same level</b>; (4) growth is <b>bottom-up</b>. Degree 4: 3 keys per node. Insert 10,20,40; 50 does not fit → split 10,20,40,50, push 40 up as a new root, leaves (10,20) and (50). Fill 60,70 then 80 → split the right leaf, push 70 beside 40. Split a full parent the same way — a new index level appears by itself. You may bias the split left or right. Every key still has a record pointer; leaves sit in one row like an index.",
      bullets: [
        "Create a new node only after the current node is at least half full (root excepted).",
        "Overflow: split, send a middle key to the parent (or a new root).",
        "Height grows at the root, not by stretching one leaf down."
      ]
    },
    {
      heading: "B+ tree: records only at linked leaves",
      body: "In a <b>B+ tree</b>, internal nodes keep keys and child pointers only — no record pointers. Every key is copied down so it also lives in a leaf. Leaves form a <b>linked list</b> and hold all record pointers: that list is the dense index; everything above is sparse. Range scans walk the leaf chain instead of jumping through the tree. That is why databases prefer B+ over B for clustered/secondary indexes: the multi-level picture in the first half of the lecture is literally a B+ tree.",
      bullets: [
        "Internal = sparse router. Leaves = dense index + sibling links.",
        "Every key appears in some leaf; internals may hold duplicates of those keys.",
        "B+ matches multi-level indexing more closely than a B-tree does."
      ]
    }
  ],

  keyTerms: [
    { term: "Block", def: "Track ∩ sector on disk; typical study size 512 B; the unit of I/O." },
    { term: "Dense index", def: "One (key, record-pointer) entry per table row." },
    { term: "Sparse index", def: "One entry per block of the level below, not per row." },
    { term: "m-way search tree", def: "Search tree with up to m children and m−1 ordered keys per node." },
    { term: "B-tree", def: "m-way tree with min occupancy ⌈m/2⌉, all leaves at one level, bottom-up splits; every key has a record pointer." },
    { term: "Split", def: "On overflow, divide keys, push one key to the parent; may create a new root." },
    { term: "B+ tree", def: "Record pointers only in a linked leaf list; internal keys are copies used to route." }
  ],

  tradeoffs: [
    { pro: "High fan-out packs an index into a few disk blocks, so point queries cost a handful of I/Os.", con: "A node is a block: you pay a disk read even to look at a few keys." },
    { pro: "B-tree splits grow the tree upward and keep leaves aligned, so height stays logarithmic in the number of blocks.", con: "Internal nodes still store record pointers, wasting fan-out compared with B+." },
    { pro: "B+ leaves are a dense linked index: range scans are sequential I/O along the chain.", con: "Keys are duplicated in internals, and a point query must always reach a leaf." }
  ],

  interviewTips: [
    "Start from disks: 512 B blocks, row 128 B → 4 rows/block, 100 rows → 25 I/Os without an index.",
    "Show the 16 B (key,ptr) index: 32 entries/block, ~4 blocks + 1 data I/O.",
    "Say B-trees are m-way trees with ⌈m/2⌉ occupancy, one-level leaves, bottom-up split — not 'just a fat BST'.",
    "Degree-4 split: four keys, middle (or chosen) key goes up; that is how a new index level is born.",
    "B vs B+: B has record pointers everywhere; B+ only at linked leaves (dense), internals sparse.",
    "Exam phrase: self-managing multi-level index for databases."
  ],

  scene: {
    nodes: [
      { id: "disk", label: "Disk blocks 512 B", type: "zone", pos: [-8, 0, -5.5], size: [7, 4] },
      { id: "b1", label: "rows 1-4", type: "storage", pos: [-10, 0, -5.5] },
      { id: "b2", label: "rows 5-8", type: "storage", pos: [-8, 0, -5.5] },
      { id: "b3", label: "… 25 blocks", type: "storage", pos: [-6, 0, -5.5] },
      { id: "idx", label: "Index 4 blocks", type: "db", pos: [-8, 0, -1] },
      { id: "root", label: "40", type: "server", pos: [4, 0, -6] },
      { id: "nL", label: "10 20", type: "cache", pos: [0, 0, -3] },
      { id: "nR", label: "50 60 70", type: "cache", pos: [8, 0, -3] },
      { id: "nR2", label: "80", type: "cache", pos: [11, 0, -0.5], showAt: 3 },
      { id: "top", label: "40 | 70", type: "server", pos: [4, 0, -6], showAt: 3 },
      { id: "leafL", label: "10 20 30", type: "queue", pos: [-1, 0, 3], showAt: 5 },
      { id: "leafM", label: "40 50 60", type: "queue", pos: [4, 0, 3], showAt: 5 },
      { id: "leafR", label: "70 80", type: "queue", pos: [9, 0, 3], showAt: 5 },
      { id: "rec", label: "Records on disk", type: "storage", pos: [4, 0, 6.5], showAt: 4 },
      { id: "n0", label: "25 data I/Os vs 4+1 with index", type: "note", pos: [-8, 3, 6] },
      { id: "n1", label: "Sparse upper index, dense lower", type: "note", pos: [8, 3, 6], showAt: 1 },
      { id: "n2", label: "Degree 4: 3 keys, split on 4th", type: "note", pos: [8, 3, -7.5], showAt: 2 },
      { id: "n3", label: "Push middle key up (new root)", type: "note", pos: [-8, 3, -7.5], showAt: 3 },
      { id: "n4", label: "B: record ptr on every key", type: "note", pos: [-8, 3, 2], showAt: 4 },
      { id: "n5", label: "B+: leaves linked dense index", type: "note", pos: [8, 3, 2], showAt: 5 }
    ],
    edges: [
      { from: "idx", to: "b1", label: "ptr" },
      { from: "idx", to: "b2" },
      { from: "root", to: "nL" },
      { from: "root", to: "nR" },
      { from: "nR", to: "nR2", showAt: 3 },
      { from: "leafL", to: "leafM", label: "next", showAt: 5 },
      { from: "leafM", to: "leafR", label: "next", showAt: 5 },
      { from: "leafL", to: "rec", showAt: 5, dashed: true },
      { from: "leafM", to: "rec", showAt: 5, dashed: true },
      { from: "leafR", to: "rec", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Tables live in 512-byte blocks",
        text: "Row 128 B ⇒ 4 rows per block. 100 employees ⇒ 25 data blocks. A point query without an index may read all 25. I/O, not RAM compares, is the cost model.",
        highlight: ["disk", "b1", "b2", "b3", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "nR2", "leafL", "leafM", "leafR", "rec"]
      },
      {
        title: "Dense index then a sparse level",
        text: "(id, record-ptr) is 16 B ⇒ 32 entries/block ⇒ ~4 index blocks + 1 data block. A thousand rows blow the first index up; a sparse parent stores one key per child block and cuts I/O again.",
        highlight: ["idx", "b1", "b2", "n0", "n1"],
        hide: ["n2", "n3", "n4", "n5", "nR2"],
        flows: [
          { from: "idx", to: "b1", color: "#60a5fa", label: "1 I/O" }
        ]
      },
      {
        title: "Degree-4 node fills with 10,20,40",
        text: "B-tree of degree 4 holds 3 keys. Insert 10,20,40 into the root. Occupancy rules stop you from creating a skinny chain of one-key nodes the way a raw m-way tree would.",
        highlight: ["root", "nL", "nR", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "nR2", "idx", "disk", "b1", "b2", "b3"]
      },
      {
        title: "Overflow splits; 40 then 70 rise",
        text: "Insert 50: split four keys, send 40 up as a new root — the tree grows upward. Later 80 splits the right child and 70 joins 40 in the root. That new root is a new index level, created automatically.",
        highlight: ["root", "nL", "nR", "nR2", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "idx", "disk", "b1", "b2", "b3"],
        flows: [
          { from: "nR", to: "root", color: "#c084fc", label: "split up" }
        ]
      },
      {
        title: "B-tree: record pointer on every key",
        text: "Each key, internal or leaf, points at its row. Child pointers address other index blocks. Useful, but internals spend space on record pointers that a router does not need.",
        highlight: ["root", "nL", "nR", "rec", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "nR2", "leafL", "leafM", "leafR"],
        flows: [
          { from: "nL", to: "rec", color: "#4ade80", label: "row ptr" }
        ]
      },
      {
        title: "B+: linked leaves are the dense index",
        text: "Copy every key into a leaf, hang record pointers only there, and thread the leaves. Internals become a sparse multi-level index. Range queries walk the chain. This is the database picture from the first half of the lecture.",
        highlight: ["leafL", "leafM", "leafR", "rec", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "nR2", "idx", "disk", "b1", "b2", "b3"],
        flows: [
          { from: "leafL", to: "leafM", color: "#fb923c", label: "scan" },
          { from: "leafM", to: "leafR", color: "#fb923c", label: "scan" },
          { from: "leafM", to: "rec", color: "#4ade80", label: "rows" }
        ]
      }
    ]
  }
});
