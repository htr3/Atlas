window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 56,
  title: "4.6 Optimal Binary Search Tree (Successful Search Only) - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=vLS-zRCHo-Y",
  category: "Dynamic Programming",
  tagline: "Keys 10,20,30,40 freq 4,2,6,3: C[0,4]=26 with root 30; left 10, right of 10 is 20.",
  summary: "A BST on the same keys can cost different amounts once each key has a search frequency. For 3 keys the 5 Catalan trees are not equally good: the cheapest uses the frequent key as root even if the tree is unbalanced. DP state C[i,j] is the min expected-comparison cost of a BST on keys i+1..j (successful search only). Fill by increasing j−i. Worked instance finishes at 26 with root key 30.",

  theory: [
    {
      heading: "State: a key interval",
      body: "Keys in a BST have left < node < right, so a search is comparisons along a root-to-node path. Height-balanced is cheapest when every key is equally likely (3 keys: 5 trees, the balanced one averages 5/3 comparisons). When frequencies differ, a tall tree can beat a balanced one. Lecture keys 10,20,30 with freq 3,2,5: putting 30 at the root costs 17, other shapes 18 or 19. State C[i,j] = min cost of an optimal BST on the keys whose indices sit strictly between i and j (keys i+1..j). Dummy index 0 makes the formula 0-based.",
      bullets: [
        "Successful search only in this video — no dummy failure nodes.",
        "Cost of a tree = Σ freq[key] × (1-based depth).",
        "Catalan many BSTs; DP tries every root without drawing them all."
      ]
    },
    {
      heading: "Recurrence",
      body: "Try each key k as root of i+1..j. Left subtree is keys i+1..k−1 (cost C[i,k−1]), right is k+1..j (cost C[k,j]). Every frequency in the interval is compared one extra time at this root, so add W[i,j]=sum of those frequencies. <code>C[i,j] = min_{k=i+1..j} C[i,k−1]+C[k,j]+W[i,j]</code>. C[i,i]=0 (empty). Root[i,j] stores the winning k. Fill increasing r=j−i.",
      bullets: [
        "W[i,j] is the sum of p_{i+1}..p_j (here frequencies, not probabilities).",
        "k runs over actual keys, skipping the dummy i.",
        "Adding W once is the \"+1 comparison at the root\" for every key in the interval."
      ]
    },
    {
      heading: "Worked diagonals, freq 4,2,6,3",
      body: "Keys 10,20,30,40. j−i=0: zeros. j−i=1: single keys, C=frequency: 4,2,6,3. j−i=2 (two keys): (10,20) costs min(8,10)=<b>8</b> with root 10; (20,30) costs <b>10</b> with root 30; (30,40) costs <b>12</b> with root 30. j−i=3: C[0,3] uses W=4+2+6=12; the three roots give 22,22,20 — min <b>20 with root 30</b>. C[1,4] uses W=11; min is <b>16 with root 30</b>.",
      bullets: [
        "Single-key cost is just p_i (one comparison).",
        "Two-key cells are a 1-vs-2 comparison choice.",
        "Root 30 already dominates the length-3 intervals."
      ]
    },
    {
      heading: "C[0,4]=26, root 30, build the tree",
      body: "W[0,4]=4+2+6+3=15. Four candidate roots: 16+15=31, 4+12+15=31, 8+3+15=<b>26</b>, 20+15=35. Min 26, k=3 (key 30). Left interval [0,2] has root 10; 20 hangs right of 10. Right interval [3,4] is just 40. Tree: 30 at the root, 10 left, 20 right of 10, 40 right of 30. Frequent 30 is high; rare 20 is a grandchild. That is the optimal successful-search BST.",
      bullets: [
        "Optimum cost 26, stored root[0,4]=3.",
        "Recurse on [0,2] and [3,4] using the root table.",
        "Unbalanced on purpose: frequency, not height, is the objective."
      ]
    },
    {
      heading: "Complexity",
      body: "O(n²) cells, O(n) candidate roots each: <b>Θ(n³)</b>, same cubic family as matrix-chain (the recurrences are cousins). Space Θ(n²) for C and Root. This lecture ignores unsuccessful searches; the next video adds q_i dummy probabilities.",
      bullets: [
        "Same fill order as matrix chain: increasing j−i.",
        "Θ(n³) time, Θ(n²) space.",
        "Successful-only: W is a sum of p's, no q's."
      ]
    }
  ],

  keyTerms: [
    { term: "C[i,j]", def: "Min weighted-comparison cost of a BST on keys numbered i+1 through j." },
    { term: "W[i,j]", def: "Sum of frequencies p_{i+1}..p_j; added because the root compares every key once." },
    { term: "Root[i,j]", def: "Index k of the key that should be the root of that interval." },
    { term: "Successful search", def: "Every query is for a key that exists; no dummy failure nodes in this video." },
    { term: "Frequency cost", def: "freq(key) × depth(key), summed over keys; depth 1 at the root." },
    { term: "Catalan #BSTs", def: "C_n = (2n choose n)/(n+1) different shapes on n keys; 5 when n=3, 14 when n=4." }
  ],

  tradeoffs: [
    { pro: "Optimal BST can beat a height-balanced tree when frequencies are skewed (17 vs 18/19 on 3 keys).", con: "You pay Θ(n³) to build it; AVL/red-black ignore frequencies and insert in log n." },
    { pro: "Root table reconstructs the unique (up to ties) tree.", con: "Reporting 26 without the shape fails the construction half of the question." },
    { pro: "Successful-only is shorter arithmetic for a first pass.", con: "Real dictionaries have failed searches; q_i belong in the next lecture." },
    { pro: "Same diagonal DP as matrix chain, so the fill order transfers.", con: "Off-by-one on dummy index 0 is the standard bug (k starts at i+1)." }
  ],

  interviewTips: [
    "Contrast equal-frequency (balance) with weighted (frequent keys high).",
    "Write C[i,j]=min_k C[i,k-1]+C[k,j]+W[i,j] with W the sum of p's in the interval.",
    "Fill increasing j−i; C[i,i]=0, length-1 equals the frequency.",
    "Quote keys 10,20,30,40 freq 4,2,6,3, cost 26, root 30.",
    "Build: 30 root, 10 left, 20 right of 10, 40 right of 30.",
    "Name Catalan 5/14 as the brute shapes you are not drawing."
  ],

  scene: {
    nodes: [
      { id: "k10", label: "10 f=4", type: "point", pos: [-8, 0, -4], color: "#60a5fa" },
      { id: "k20", label: "20 f=2", type: "point", pos: [-3, 0, -6.5], color: "#94a3b8" },
      { id: "k30", label: "30 f=6", type: "point", pos: [0, 0, 4], color: "#fb923c" },
      { id: "k40", label: "40 f=3", type: "point", pos: [6, 0, 1], color: "#22d3ee" },
      { id: "c01", label: "C=4", type: "cache", pos: [-8, 0, 6.5], color: "#60a5fa", showAt: 2 },
      { id: "c12", label: "C=2", type: "cache", pos: [-3, 0, 6.5], color: "#94a3b8", showAt: 2 },
      { id: "c23", label: "C=6", type: "cache", pos: [2, 0, 6.5], color: "#fb923c", showAt: 2 },
      { id: "c34", label: "C=3", type: "cache", pos: [7, 0, 6.5], color: "#22d3ee", showAt: 2 },
      { id: "c02", label: "8 r=10", type: "cache", pos: [-5.5, 0, 2], color: "#60a5fa", showAt: 3 },
      { id: "c03", label: "20 r=30", type: "cache", pos: [2, 0, 2], color: "#fb923c", showAt: 4 },
      { id: "c04", label: "26 r=30", type: "cache", pos: [7, 0, 2], color: "#facc15", showAt: 5 },
      { id: "n0", label: "freq, not height", type: "note", pos: [7, 0, -6.5] },
      { id: "n1", label: "C[i,i]=0; len1 = p", type: "note", pos: [-8, 0, -7], showAt: 2 },
      { id: "n2", label: "W[0,4]=15, +left+right", type: "note", pos: [7, 0, -4], showAt: 5 },
      { id: "n3", label: "30 root, cost 26", type: "note", pos: [7, 0, -1.5], showAt: 6 }
    ],
    edges: [
      { from: "k30", to: "k10", showAt: 6 },
      { from: "k10", to: "k20", showAt: 6 },
      { from: "k30", to: "k40", showAt: 6 },
      { from: "c03", to: "c04", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Four keys, four frequencies",
        text: "10,20,30,40 with 4,2,6,3 successful searches. A balanced tree is not automatically cheapest: 30 is searched most, so it wants to sit high.",
        highlight: ["k10", "k20", "k30", "k40", "n0"]
      },
      {
        title: "Length-1 diagonal",
        text: "C[i,i]=0 (empty). A single key costs its frequency (one comparison). 4, 2, 6, 3 seed the first superdiagonal. Fill order is increasing j−i.",
        highlight: ["c01", "c12", "c23", "c34", "n1"]
      },
      {
        title: "Two-key cell 8",
        text: "Keys 10 and 20: root 10 costs 4+2·2=8; root 20 costs 2+4·2=10. Keep 8, root 10. The rare key 20 is willing to sit one level down.",
        highlight: ["c02", "k10", "k20"]
      },
      {
        title: "Length 3 already wants 30",
        text: "C[0,3] (keys 10,20,30), W=12. Roots 10 or 20 cost 22; root 30 costs 20. The frequent key is already the winner on this sub-interval.",
        highlight: ["c03", "k30", "c23"]
      },
      {
        title: "C[0,4]=26",
        text: "W=15. Four roots: 31, 31, 8+3+15=26, 35. Min 26 at k=3. Adding W once is the extra comparison every key pays at this new root.",
        highlight: ["c04", "c03", "c02", "n2"],
        flows: [
          { from: "c03", to: "c04", color: "#facc15", label: "+W=15" }
        ]
      },
      {
        title: "Read Root[] for the tree",
        text: "root[0,4]=30. Left [0,2] has root 10, with 20 on its right. Right [3,4] is 40. Unbalanced, frequency-optimal. Successful-search cost 26.",
        highlight: ["k30", "k10", "k20", "k40", "c04", "n3"],
        flows: [
          { from: "k30", to: "k10", color: "#60a5fa", label: "L" },
          { from: "k10", to: "k20", color: "#94a3b8", label: "R" },
          { from: "k30", to: "k40", color: "#22d3ee", label: "R" }
        ]
      },
      {
        title: "Θ(n³), Catalan avoided",
        text: "14 BSTs exist on 4 keys. The table tried every root of every interval in cubic time instead of listing trees. Next lecture adds unsuccessful q_i.",
        highlight: ["c04", "k30", "n3"]
      }
    ]
  }
});
