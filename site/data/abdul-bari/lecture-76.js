window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 76,
  title: "10.1 AVL Tree - Insertion and Rotations",
  video: "https://www.youtube.com/watch?v=jDM6_TnYIqE",
  category: "Strings, Trees & Arrays",
  tagline: "Keep |hL−hR| ≤ 1 with four rotations so BST search stays Θ(log n).",
  summary: "A BST can be height log n or height n depending on insertion order — same keys, different shapes, search that is either binary or linear. An AVL tree is a height-balanced BST: every node's balance factor h(left)−h(right) is −1, 0, or 1. Insert as in a BST, then rotate at the lowest unbalanced ancestor. LL and RR are single rotations; LR and RL are double. Height is at most about 1.44 log n, so search is Θ(log n). Red-black trees relax the same idea with fewer rotations.",

  theory: [
    {
      heading: "BST search is height, and height is not under control",
      body: "In a binary search tree, left subtree keys are smaller than the node and right subtree keys are larger. Search walks left or right from the root; successful or not, the number of comparisons is the length of that path, i.e. the <b>height</b> (the lecture counts height from 1). A binary tree on n keys can have height as small as Θ(log n) or as large as n. Insert 30,40,10,50,20,5,35 and you get a short tree. Insert the same keys descending — 50,40,35,30,20,10,5 — and you get a stick of height n. Searching for 5 then takes seven comparisons: linear search wearing a tree costume. Duplicates are not stored.",
      bullets: [
        "Min height ~ log n, max height n, for the same key set.",
        "Insertion order, not the key set, picks the shape.",
        "Goal: force the short shape so search stays logarithmic."
      ]
    },
    {
      heading: "Three keys, six orders, four ugly trees",
      body: "Keys 10,20,30 admit 3!=6 insertion orders. Four of them produce a chain of height 3; two produce the balanced V of height 2 with 20 at the root. We always want that V. The lecture's move is a <b>rotation</b> around a node (imagine a nail and a thread): pull 30 so 20 rises, or pull 10 so 20 rises. Zig-zag shapes need two pulls. Rotations always involve <b>three nodes</b>, even in a huge tree — you locally rebalance ABC and the rest of the subtrees hang off the leftover slots.",
      bullets: [
        "Prefer the unique minimum-height BST on those three keys.",
        "Rotation is a constant-time pointer swing, not a rebuild.",
        "Four rotation kinds cover the four unbalanced shapes."
      ]
    },
    {
      heading: "Balance factor",
      body: "AVL = height-balanced BST. For every node, <b>balance factor</b> BF = height(left) − height(right) ∈ {−1, 0, +1}, equivalently |BF| ≤ 1. Height is the longest edge-count downward (leaves get 0). BF=+2 means left-heavy; BF=−2 means right-heavy. Any node outside {−1,0,1} is unbalanced and must be rotated immediately — do not finish inserting the whole list first, and never let BF reach ±3.",
      bullets: [
        "Compute BF from subtree heights, not node counts.",
        "Empty child contributes height 0.",
        "Rebalance the first unbalanced ancestor of the new leaf."
      ]
    },
    {
      heading: "Four rotations: LL, RR, LR, RL",
      body: "<b>LL</b> (left of left): insert 10 under 30–20. Single rotation around 30 brings 20 up, 30 to the right. <b>LR</b> (left then right): insert 20 under 30–10. Double rotation: first rotate around 10 so it looks like LL, then LL around 30; shortcut — promote the last of the three nodes (20) to the root of the triple. <b>RR</b> is the mirror of LL; <b>RL</b> the mirror of LR. LL/RR are single; LR/RL are double but still counted as one rebalancing. On a large tree, children of A,B,C stay put except B's inner subtree, which tucks into the hole on A's newly empty side (the 'thread around a nail' picture).",
      bullets: [
        "Name the imbalance from the two steps down from the unbalanced node, not the whole path to the new leaf.",
        "LL/RR: one rotate. LR/RL: two steps or one 'promote the grandchild' shortcut.",
        "After the local rotate, ancestors that were ±2 become legal."
      ]
    },
    {
      heading: "Insert 40,20,10,25,30,22,50",
      body: "40 then 20: balanced. Insert 10: 40 gets BF=+2, LL → 20 with 10 and 40. Insert 25 then 30: 40 (and 20) go to −2; from 40 the two steps are left-right → LR, promote 30. Insert 22: 20 becomes BF=−2; two steps right-left → RL, 25 rises, 22 hangs as 20's right. Insert 50: 30 is RR-unbalanced; rotate so 40 is between 30 and 50. The tree is balanced after every insertion. A later insert of 42 into a bigger AVL (40's right spine) is LR on just the first two steps from the unbalanced node — ignore the extra left-left-right tail.",
      bullets: [
        "Walk from the new leaf toward the root; rotate at the first ±2 ancestor.",
        "Classify using only two edges down from that ancestor.",
        "Fixing that node automatically fixes higher ±2 nodes in these traces."
      ]
    },
    {
      heading: "Height bound and red-black",
      body: "An AVL tree's height is at most about <b>1.44 log n</b> — always a constant times log n, never n. Search, insert, and the lecture's rotations are therefore Θ(log n) asymptotically. AVL is stricter than a <b>red-black tree</b>: more rotations while building, tighter height. Red-black is a bit looser, fewer rotations, same Θ(log n) searches. Both are height-balanced BSTs; this lecture is AVL.",
      bullets: [
        "Search in AVL is Θ(log n), not Θ(n).",
        "1.44 log n is the worst AVL height, still logarithmic.",
        "Red-black: same job, milder balance rules, fewer rotates."
      ]
    }
  ],

  keyTerms: [
    { term: "Balance factor", def: "height(left) − height(right); legal AVL values are −1, 0, +1." },
    { term: "LL / RR", def: "Single rotation for left-of-left or right-of-right insertion that made a node ±2." },
    { term: "LR / RL", def: "Double rotation (or one promote-the-grandchild step) for the two zigzag imbalances." },
    { term: "First unbalanced ancestor", def: "The nearest ±2 node on the path from the new leaf to the root; rotate there." },
    { term: "Two-step classify", def: "Name LL/LR/RR/RL from only two child links down from the unbalanced node." },
    { term: "1.44 log n", def: "Asymptotic worst height of an AVL tree; search stays Θ(log n)." },
    { term: "Red-black tree", def: "Another height-balanced BST with weaker local rules and typically fewer rotations." }
  ],

  tradeoffs: [
    { pro: "Search is guaranteed Θ(log n); you cannot degenerate to a stick.", con: "Every insert may pay one (or a double) rotation and must recompute BFs up the path." },
    { pro: "LL/RR are one pointer swing; the three-node picture scales to huge trees.", con: "Mis-naming LR as LL (looking at the whole path instead of two steps) rotates the wrong way." },
    { pro: "Stricter than red-black, so AVL trees are often shallower.", con: "More rotations during mixed insert streams; maps/sets in some libraries prefer red-black." }
  ],

  interviewTips: [
    "Open with BST height ∈ [log n, n] and the descending-key stick as the motivation.",
    "Write BF = hL − hR ∈ {−1,0,1} and |BF|≤1; say you count edges, not nodes.",
    "On insert: BST-place the key, then rotate the lowest ±2 ancestor; classify with two steps only.",
    "Sketch LL as a single rotate and LR as promote-the-middle of the triple.",
    "Quote height ≤ 1.44 log n so search is Θ(log n), and mention red-black as the less strict cousin.",
    "Never batch-insert then rebalance: the lecture forbids letting BF reach ±3."
  ],

  scene: {
    nodes: [
      { id: "stick", label: "BST stick h=n", type: "zone", pos: [-8, 0, -5.5], size: [6, 4] },
      { id: "s50", label: "50", type: "point", pos: [-8, 0, -6.5], color: "#f87171" },
      { id: "s40", label: "40", type: "point", pos: [-8, 0, -5.5], color: "#f87171" },
      { id: "s10", label: "10", type: "point", pos: [-8, 0, -4.5], color: "#f87171" },
      { id: "a20", label: "20", type: "server", pos: [2, 0, -5.5] },
      { id: "a10", label: "10", type: "server", pos: [-1, 0, -3.5] },
      { id: "a40", label: "40", type: "server", pos: [5, 0, -3.5] },
      { id: "a30", label: "30", type: "worker", pos: [3.5, 0, -1.5], showAt: 3 },
      { id: "a25", label: "25", type: "worker", pos: [2, 0, 0.5], showAt: 3 },
      { id: "a22", label: "22", type: "worker", pos: [0.5, 0, 2.2], showAt: 4 },
      { id: "a50", label: "50", type: "worker", pos: [7, 0, -1.5], showAt: 5 },
      { id: "n0", label: "Same keys, height n vs log n", type: "note", pos: [-8, 3, 6] },
      { id: "n1", label: "BF = hL-hR in -1,0,1", type: "note", pos: [8, 3, 6], showAt: 0 },
      { id: "n2", label: "LL: 30-20-10 -> 20 up", type: "note", pos: [8, 3, -7], showAt: 1 },
      { id: "n3", label: "LR: promote grandchild", type: "note", pos: [-8, 3, -7], showAt: 2 },
      { id: "n4", label: "Rotate first ±2 ancestor", type: "note", pos: [8, 3, 2], showAt: 3 },
      { id: "n5", label: "h ≤ 1.44 log n  search log n", type: "note", pos: [-8, 3, 2], showAt: 6 }
    ],
    edges: [
      { from: "s50", to: "s40" },
      { from: "s40", to: "s10" },
      { from: "a20", to: "a10" },
      { from: "a20", to: "a40" },
      { from: "a40", to: "a30", showAt: 3 },
      { from: "a30", to: "a25", showAt: 3 },
      { from: "a25", to: "a22", showAt: 4 },
      { from: "a40", to: "a50", showAt: 5 }
    ],
    steps: [
      {
        title: "BST can become a stick",
        text: "Same keys as a bushy tree, inserted descending: 50-40-…-5. Height is n. Search for the last key is n comparisons — linear search. AVL exists to forbid this shape.",
        highlight: ["stick", "s50", "s40", "s10", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "a30", "a25", "a22", "a50"],
        fail: ["s50", "s10"]
      },
      {
        title: "Balance factor on every node",
        text: "BF = height(left) − height(right) must stay in {−1,0,1}. Leaves are 0. A node at ±2 is unbalanced. Heights count edges on the longest path, not nodes.",
        highlight: ["a20", "a10", "a40", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5"]
      },
      {
        title: "LL single rotation",
        text: "Insert 10 under 30–20. 30 is left-of-left and BF=+2. Rotate around 30: 20 rises, 30 becomes its right child, 10 stays left. One swing; BF all zeros.",
        highlight: ["a20", "a10", "a40", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5"],
        flows: [
          { from: "a10", to: "a20", color: "#4ade80", label: "LL" }
        ]
      },
      {
        title: "LR double / promote 30",
        text: "Insert 25 then 30 under 20–40. Unbalanced node 40 is left-right. Shortcut: lift 30 between 20 and 40. Zigzag becomes the same V as LL.",
        highlight: ["a20", "a40", "a30", "a25", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5"],
        flows: [
          { from: "a30", to: "a20", color: "#c084fc", label: "LR" }
        ]
      },
      {
        title: "First ancestor, two-step name",
        text: "Insert 22. Several nodes may show ±2, but rotate only the nearest ancestor of 22. Classify with two links down (RL here). Deeper left-left tails are ignored.",
        highlight: ["a20", "a25", "a22", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5"],
        flows: [
          { from: "a22", to: "a25", color: "#fb923c", label: "RL" }
        ]
      },
      {
        title: "RR on 50 finishes the example",
        text: "Insert 50 on the right of 40. 30 is right-of-right. Single RR: 40 up between 30 and 50. All BFs legal. Never wait until BF is ±3.",
        highlight: ["a30", "a40", "a50", "a20"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "a50", to: "a40", color: "#60a5fa", label: "RR" }
        ]
      },
      {
        title: "Height 1.44 log n",
        text: "AVL height is at most about 1.44 log n, always Θ(log n). Search is logarithmic. Red-black trees solve the same problem with looser color rules and fewer rotations.",
        highlight: ["a20", "a10", "a40", "a30", "a25", "a22", "a50", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"]
      }
    ]
  }
});
