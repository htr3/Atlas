window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 7,
  title: "Persistent Segment Trees - SPOJ - MKTHNUM",
  video: "https://www.youtube.com/watch?v=TH9n_HVkjQM",
  category: "Competitive Programming",
  tagline: "Copy O(log n) nodes per insert; k-th in [i,j] from two prefix trees.",
  summary: "A persistent structure still answers old times: friend count 3, then 5, then 4 — the t=0 answer must stay 3. Segment trees persist by allocating O(log n) new nodes on an update path and sharing every unchanged child. SPOJ MKTHNUM asks the k-th smallest on [i,j]. Rank-compress the values, build a frequency tree per prefix by persistence in O(n log n), then walk two roots in O(log n) per query. Total O((n+Q) log n).",

  theory: [
    {
      heading: "Old times must still answer",
      body: "A structure is <b>persistent</b> when you can query it as it looked at time t, not only as it looks now. The lecture's Facebook picture: at t = 0 you have 3 friends; at t = 1 two more arrive (5); at t = 2 you lose one (4). If you overwrite a single counter, a question about t = 0 returns 4. Persistence means the t = 0 value stays 3. The rule is: <b>do not mutate old data to install new data</b>.",
      bullets: [
        "Each time has a reachable snapshot.",
        "Overwriting the latest value throws history away.",
        "Segment trees become persistent by obeying that rule on nodes."
      ]
    },
    {
      heading: "Lists first: a new cell, an old pointer",
      body: "Array <code>[1, 2, −1, 6]</code>. An update \"A[2] = 6\" must not paint over −1. Allocate a new cell holding 6 and hang a pointer from time t = 1; t = 0 still walks to −1. Unchanged indices keep pointing at the same objects. That is copy-on-write at the scale of one slot, and it is the whole idea the tree will reuse.",
      bullets: [
        "t = 0: index 2 is −1. t = 1: index 2 is a new node 6.",
        "Reads pick a time, then follow that version's pointers.",
        "Unchanged slots are shared, not cloned."
      ]
    },
    {
      heading: "Persistent segment tree: O(log n) new nodes",
      body: "A segment tree is a complete binary tree that answers range queries in O(log n). A standard update rewrites nodes in place. Persistence instead: walk the same cover/miss path, but <b>allocate a new node</b> wherever the value changes. Unchanged children keep the old pointers — the lecture colors t = 0 blue and t = 1 red, and the red root's right child still points at the blue subtree. Keep an array <code>root[t]</code>. Creating those extra nodes is O(log n); the query is still O(log n) after you choose the root for the requested time. Lazy flags can sit on the copied nodes the same way; the path length does not change.",
      bullets: [
        "New root per update; path copied; off-path subtrees shared.",
        "Space O(log n) per update, not a full extra tree.",
        "Query(t): start at root[t], then ordinary left/right walks."
      ]
    },
    {
      heading: "MKTHNUM: k-th smallest on [i, j]",
      body: "SPOJ MKTHNUM: array of n, then Q queries (i, j, k) — report the k-th smallest value among A[i..j] (the value you would see after sorting that slice). Sorting each query is too slow, and a fresh linear scan per query is <b>O(QN)</b>. One segment tree, if it stored the right thing, could answer a <i>single</i> such question in O(log n). The rest of the talk is how to make that tree cheap to rebuild for every prefix, then how to subtract two prefixes to get an arbitrary [i,j].",
      bullets: [
        "Not the k-th of the whole array — of a subarray.",
        "Brute: copy, sort, index k, times Q.",
        "Need O(log n) after some preprocessing."
      ]
    },
    {
      heading: "Rank-compress, then store frequencies",
      body: "You cannot put the raw values in the tree. Sort a copy: the lecture's list <code>−2, 6, 3, 12, 1, −18</code> becomes <code>−18, −2, 1, 3, 6, 12</code>, ranks 0..5. Each original value maps to its rank. Leaves of the segment tree are <b>frequencies of ranks</b> (usually 0 or 1 if values are unique). Parents store the sum of children — how many numbers in this version have a rank in that half of value-space. Empty ranks stay 0. That tree no longer stores 12 or −18; it stores how many selected elements fall into each rank bucket.",
      bullets: [
        "Sort unique values; rank = index in that order.",
        "Leaf r holds how many chosen A[i] mapped to r.",
        "A parent sum is a count, not a max or a min."
      ]
    },
    {
      heading: "Walk: k compared with the left count",
      body: "To find the 3rd smallest of the whole array (k = 2 in 0-based talk), start at the root (count 6). If k+1 is ≤ the left child's count, the answer lives on the left; else subtract that count from k and go right. Left of root has 4, 3 ≤ 4, go left. That node's left has 2, 3 ≰ 2, so k becomes 0 and you go right. There a singleton leaf has count 1 and k+1 = 1: you have landed on rank 2, which maps back to <b>1</b>. If a leaf frequency had been 0, the walk would have chosen a different rank — that is why the tree, not a sorted scan of the original six, is the algorithm. Same descent is O(log n).",
      bullets: [
        "If k ≤ left.count go left, else k −= left.count and go right.",
        "Worked: 3rd of the six values is 1 (rank 2).",
        "Frequencies, not the original keys, decide the branch."
      ]
    },
    {
      heading: "Prefix versions, from a position lemma",
      body: "Building a tree for every pair (i,j) is O(n^2) trees. Observe: if you insert more elements into a sorted picture, the position of a fixed value E never moves left — it stays or shifts right by the number of new values smaller than E. So the rank of E among A[0..n+x) minus its rank among A[0..n) equals its rank among the added slice A[n..n+x). Rename n → i, n+x → j: the k-th in [i,j] is determined by the two prefixes [0..j] and [0..i). You only need <b>n prefix trees</b> (0..1, 0..2, …, 0..n), not n^2 range trees. Still, materializing n full trees is O(n^2) memory and time — too slow. Persistence is what collapses that.",
      bullets: [
        "pos(E in 0..n) ≤ pos(E in 0..n+x).",
        "Difference = count of newcomers smaller than E.",
        "n prefixes beat n^2 ranges; persistence beats n full copies."
      ]
    },
    {
      heading: "Insert one rank at a time",
      body: "Build version 0 as an empty frequency tree. For each index t = 1..n, insert rank(A[t]) by copying the O(log n) path and incrementing those nodes: that is version t, a tree for prefix 0..t. The lecture inserts 1 (rank 2) into the tree of the first four values (−2, 6, 3, 12): a new leaf at rank 2, new parents 2 then 3 then a new root 5, right child still shared. Query \"2nd smallest on 0..3\" walks the old root and returns 3; \"2nd smallest on 0..4\" walks the new root and returns rank 2. In code you often walk <i>two</i> versions at once: leftCount = left[j].count − left[i−1].count, then the same k-branch. n inserts cost <b>O(n log n)</b>; each query <b>O(log n)</b>; total <b>O((n+Q) log n)</b>. Persistent trees are rare in contests; MKTHNUM is the problem that makes them the right tool.",
      bullets: [
        "Version t = prefix 0..t after one extra rank increment.",
        "Space O(n log n) nodes for n versions.",
        "k-th on [i,j] from root[j] vs root[i−1], O(log n)."
      ]
    }
  ],

  keyTerms: [
    { term: "Persistence", def: "Every past time remains queryable; updates allocate new objects instead of overwriting." },
    { term: "root[t]", def: "The segment-tree root that represents the structure at time t (or prefix t)." },
    { term: "Path copy", def: "O(log n) new nodes on the update path; unchanged siblings keep old pointers." },
    { term: "MKTHNUM", def: "SPOJ: k-th smallest value in a subarray A[i..j], Q times." },
    { term: "Rank compression", def: "Replace each value by its index in the sorted unique list." },
    { term: "Frequency tree", def: "Leaves are counts of ranks; parents are sums; used to binary-search k." },
    { term: "Prefix version", def: "Tree for A[0..t]; [i,j] is the difference of prefixes j and i−1." },
    { term: "O((n+Q) log n)", def: "n persistent inserts plus Q descents, each O(log n)." }
  ],

  tradeoffs: [
    { pro: "In-place segment tree: simple, O(n) memory.", con: "Destroys old versions; cannot answer t = 0 after an update." },
    { pro: "Full copy per update: trivial persistence.", con: "O(n) time and memory per write; n versions are O(n^2)." },
    { pro: "Path copy: O(log n) extra nodes per insert, history kept.", con: "Pointers and versions are easy to mix up; harder to code than a Fenwick." },
    { pro: "MKTHNUM in O((n+Q) log n) after rank compression.", con: "Overkill if Q is tiny or you may sort each query; rare outside this pattern." }
  ],

  interviewTips: [
    "Define persistence as 't=0 still returns 3 after later updates' before drawing a tree.",
    "Say copy O(log n) nodes, share the rest, keep root[t] — that is the whole data structure.",
    "MKTHNUM: k-th in a subarray, not of the whole array. Brute is O(QN).",
    "Compress to ranks, store frequencies, walk with left.count vs k.",
    "n prefix versions, not n^2 range trees; persistence makes the n trees cheap.",
    "Quote O(n log n) build, O(log n) query, O((n+Q) log n) total, O(n log n) memory."
  ],

  scene: {
    nodes: [
      { id: "t0", label: "t=0: 3", type: "user", pos: [-9, 0, 7] },
      { id: "t1", label: "t=1: 5", type: "user", pos: [0, 0, 7], showAt: 1 },
      { id: "t2", label: "t=2: 4", type: "user", pos: [9, 0, 7], showAt: 1 },
      { id: "a0", label: "-2", type: "point", pos: [-7.5, 0, -7], color: "#60a5fa", showAt: 3 },
      { id: "a1", label: "6", type: "point", pos: [-4.5, 0, -7], color: "#60a5fa", showAt: 3 },
      { id: "a2", label: "3", type: "point", pos: [-1.5, 0, -7], color: "#60a5fa", showAt: 3 },
      { id: "a3", label: "12", type: "point", pos: [1.5, 0, -7], color: "#60a5fa", showAt: 3 },
      { id: "a4", label: "1", type: "point", pos: [4.5, 0, -7], color: "#fb923c", showAt: 3 },
      { id: "a5", label: "-18", type: "point", pos: [7.5, 0, -7], color: "#60a5fa", showAt: 3 },
      { id: "r0", label: "root0", type: "lb", pos: [-5, 0, 4], showAt: 2, color: "#60a5fa" },
      { id: "al", label: "L", type: "server", pos: [-8, 0, 0], showAt: 2, color: "#60a5fa" },
      { id: "ar", label: "R shared", type: "server", pos: [0, 0, 0], showAt: 2, color: "#c084fc" },
      { id: "r1", label: "root1", type: "lb", pos: [5, 0, 4], showAt: 2, color: "#fb923c" },
      { id: "bl", label: "L'", type: "server", pos: [8, 0, 0], showAt: 2, color: "#fb923c" },
      { id: "lf0", label: "rk0", type: "point", pos: [-10.5, 0, -4], color: "#60a5fa", showAt: 4 },
      { id: "lf1", label: "rk1", type: "point", pos: [-6, 0, -4], color: "#60a5fa", showAt: 4 },
      { id: "lf2", label: "rk2", type: "point", pos: [-1.5, 0, -4], color: "#4ade80", showAt: 4 },
      { id: "lf3", label: "rk3", type: "point", pos: [3, 0, -4], color: "#60a5fa", showAt: 4 },
      { id: "n0", label: "do not overwrite t=0", type: "note", pos: [-9, 0, -1] },
      { id: "n1", label: "new node, old ptr", type: "note", pos: [9, 0, -1], showAt: 1 },
      { id: "n2", label: "copy path, share rest", type: "note", pos: [9, 0, 4], showAt: 2 },
      { id: "n3", label: "k-th in [i,j]", type: "note", pos: [-9, 0, 4], showAt: 3 },
      { id: "n4", label: "ranks 0..5 freq tree", type: "note", pos: [10.5, 0, -7], showAt: 4 },
      { id: "n5", label: "3rd → rank 2 = 1", type: "note", pos: [-10.5, 0, 0], showAt: 5 },
      { id: "n6", label: "n prefixes, not n^2", type: "note", pos: [9, 0, -4], showAt: 6 },
      { id: "n7", label: "O((n+Q) log n)", type: "note", pos: [0, 0, 4], showAt: 7 }
    ],
    edges: [
      { from: "t0", to: "t1", label: "+2", showAt: 1 },
      { from: "t1", to: "t2", label: "-1", showAt: 1 },
      { from: "r0", to: "al", showAt: 2 },
      { from: "r0", to: "ar", showAt: 2 },
      { from: "r1", to: "bl", showAt: 2 },
      { from: "r1", to: "ar", label: "share", showAt: 2, dashed: true },
      { from: "al", to: "lf0", showAt: 4 },
      { from: "al", to: "lf1", showAt: 4 },
      { from: "ar", to: "lf2", showAt: 4 },
      { from: "ar", to: "lf3", showAt: 4 },
      { from: "bl", to: "lf2", showAt: 7, dashed: true },
      { from: "a0", to: "a1", showAt: 3 },
      { from: "a1", to: "a2", showAt: 3 },
      { from: "a2", to: "a3", showAt: 3 },
      { from: "a3", to: "a4", showAt: 3 },
      { from: "a4", to: "a5", showAt: 3 }
    ],
    steps: [
      {
        title: "Friends over time",
        text: "t=0: 3 friends. t=1: two more (5). t=2: one leaves (4). A single overwritten counter answers 4 for t=0. Persistence keeps the old 3. Do not mutate history to install the present.",
        highlight: ["t0", "n0"]
      },
      {
        title: "New cell, old pointer",
        text: "List [1, 2, −1, 6]. Setting index 2 to 6 allocates a new node and a t=1 pointer; t=0 still finds −1. Unchanged indices share objects. That is the pattern the tree will use on a whole path.",
        highlight: ["t0", "t1", "t2", "n1"],
        hide: ["n0"],
        flows: [
          { from: "t0", to: "t1", color: "#4ade80", label: "+2" },
          { from: "t1", to: "t2", color: "#f87171", label: "-1" }
        ]
      },
      {
        title: "Copy the path, share the rest",
        text: "A range update that hits the left child allocates a new left node and a new root (red). The right child did not change, so root1 points at the old right subtree (purple). root[t] chooses the snapshot. Extra nodes: O(log n). Query is still O(log n).",
        highlight: ["r0", "r1", "al", "bl", "ar", "n2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "r1", to: "bl", color: "#fb923c", label: "new" },
          { from: "r1", to: "ar", color: "#c084fc", label: "share" }
        ]
      },
      {
        title: "MKTHNUM",
        text: "Array n, Q queries (i,j,k): k-th smallest in A[i..j]. Sorting each slice or scanning it is O(QN). One frequency segment tree can name a rank in O(log n) — you need a version of that tree for every prefix.",
        highlight: ["a0", "a1", "a2", "a3", "a4", "a5", "n3"],
        hide: ["n0", "n1", "n2"]
      },
      {
        title: "Ranks, then frequency leaves",
        text: "Sort −2,6,3,12,1,−18 → −18,−2,1,3,6,12 with ranks 0..5. Leaves store counts of those ranks; parents store sums. The tree holds buckets, not the original keys.",
        highlight: ["lf0", "lf1", "lf2", "lf3", "a5", "a4", "n4"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "a5", to: "lf0", color: "#60a5fa", label: "rank 0" },
          { from: "a4", to: "lf2", color: "#fb923c", label: "rank 2" }
        ]
      },
      {
        title: "Walk to the 3rd smallest",
        text: "k=2 vs root count 6: go left (4). Left's left is 2, 3 ≰ 2, so k=0 and go right, onto rank 2. That leaf maps back to 1. If a frequency had been 0 the path would differ — the tree, not a sorted scan, is doing the work. O(log n).",
        highlight: ["r0", "al", "lf2", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "r0", to: "al", color: "#4ade80", label: "left 4" },
          { from: "al", to: "lf2", color: "#4ade80", label: "rank 2" }
        ]
      },
      {
        title: "n prefixes, not n^2 ranges",
        text: "Inserting extra values never moves a key left; its rank grows by how many newcomers are smaller. So k-th in [i,j] is a function of prefixes 0..j and 0..i−1. n trees beat a tree per pair. Full copies of those n trees would still be O(n^2).",
        highlight: ["r0", "r1", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"]
      },
      {
        title: "Persist each insert",
        text: "Version t inserts rank(A[t]) on a copied path. n updates: O(n log n). Query walks root[j] (and root[i−1]) in O(log n). Total O((n+Q) log n). The lecture's extra insert of 1 (rank 2) builds root1 with a new left path; 2nd-smallest of 0..3 vs 0..4 then differ. Rare structure, right problem.",
        highlight: ["r0", "r1", "bl", "ar", "a4", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "a4", to: "bl", color: "#fb923c", label: "insert 1" },
          { from: "r1", to: "ar", color: "#c084fc", label: "share R" }
        ]
      }
    ]
  }
});
