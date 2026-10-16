window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 57,
  title: "4.6.2 [New] Optimal Binary Search Tree Successful and Unsuccessful Probability - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=wAy6nDMPYAE",
  category: "Dynamic Programming",
  tagline: "n keys plus n+1 dummy q-nodes: W includes p and q; put high-p keys and hot misses near the root.",
  summary: "Failed searches matter. n keys give n+1 dummy leaves (q0..qn) that represent whole gap ranges (−∞..k1, between keys, kn..+∞). Probabilities p_i and q_i sum to 1. Cost is Σ p_i·(depth of key i) + Σ q_j·(depth of dummy j). The shop analogy: frequent SKUs on the counter, frequent \"we don't stock that\" questions also answered at the counter, not after a stock-room walk. DP is the same diagonal min as successful-only, with a fatter W.",

  theory: [
    {
      heading: "State still an interval — now with dummy leaves",
      body: "A BST on keys 10,20,30,40 still has 14 shapes (Catalan). Search for 9, 11–19, 21–29, 31–39, or 41+ fails at five different nulls. Bari draws those nulls as <b>square dummy nodes</b> q0..q4. n keys ⇒ n+1 dummies. The DP state is again an interval of keys, but the interval also owns the dummies that hang off it. Successful-only from the previous lecture is the special case q_i=0.",
      bullets: [
        "Dummy q0: everything < first key; qn: everything > last key.",
        "Interior q_i: the open interval between key i and key i+1.",
        "Squares hold a set of failing keys, not one identifier."
      ]
    },
    {
      heading: "Probabilities and the shop",
      body: "p_i = chance a customer asks for key i (a stocked item). q_i = chance they ask for something in that gap (out of stock). All p's and q's are decimals that <b>sum to 1</b>. Counter items (high p) should be the root. If people often ask for a missing range, that dummy should also sit high — you want to say \"no\" in one comparison, not after walking to the stock room (a deep null). That is why unsuccessful probabilities belong in the cost.",
      bullets: [
        "Σ p + Σ q = 1.",
        "High p_i ⇒ that key wants small depth.",
        "High q_j ⇒ that failure leaf wants small depth too."
      ]
    },
    {
      heading: "Recurrence: W now has p and q",
      body: "Depth of a key is its level (root=1). Depth of a dummy is the number of internal nodes on the path, i.e. one more than its parent. The interval weight is <code>W[i,j] = p_{i+1}+…+p_j + q_i+…+q_j</code>. The recurrence is unchanged in shape: <code>C[i,j] = min_{k=i+1..j} C[i,k−1]+C[k,j]+W[i,j]</code>, with C[i,i]=q_i (a lone dummy, no key). Empty-of-keys intervals still cost their q. Fill increasing j−i. Root[i,j] is the winning k.",
      bullets: [
        "C[i,i]=q_i is the new base (successful-only had 0).",
        "W counts every probability that will be compared one extra time at this root.",
        "Same k-range as the previous lecture: actual keys, not dummies."
      ]
    },
    {
      heading: "Table order and construction",
      body: "Diagonals: difference 0 (the q_i bases), then 1 (one key plus two bordering dummies), then 2, up to n. After C[0,n] is known, walk Root: k becomes the root, left interval [i,k−1], right [k,j], attach dummy leaves wherever an interval is keys-empty. Four keys still produce a binary tree with five squares. 7 keys have Catalan-many monsters; a spine of height 7 is the worst successful+unsuccessful cost if a frequent key is buried.",
      bullets: [
        "Difference 0 is no longer all zeros — it is the q vector.",
        "Construction is the same Root walk; dummies hang automatically.",
        "A chain BST maximizes comparisons; the DP is how you refuse that chain."
      ]
    },
    {
      heading: "Complexity",
      body: "Still Θ(n²) cells × Θ(n) roots = <b>Θ(n³)</b>, Θ(n²) space. Arithmetic is heavier (more terms in W) but the asymptotic class does not change. If unsuccessful search is rare you may skip q's; if the dictionary is a store catalog, q's are the point of this video.",
      bullets: [
        "Cubic, same as successful-only and matrix chain.",
        "W's extra q-sum is O(1) after prefix sums.",
        "Exam tell: C[i,i]=q_i, not 0."
      ]
    }
  ],

  keyTerms: [
    { term: "Dummy / square node", def: "A null child representing one unsuccessful-search gap; n keys ⇒ n+1 dummies." },
    { term: "p_i", def: "Probability of a successful search for key i." },
    { term: "q_i", def: "Probability of a failed search in gap i (q0 left of key 1, qn right of key n)." },
    { term: "W[i,j]", def: "p_{i+1}+…+p_j plus q_i+…+q_j — every probability owned by the interval." },
    { term: "C[i,i]=q_i", def: "Base case: no key, just that dummy's miss probability." },
    { term: "Shop / stock-room", def: "Lecture analogy: hot SKUs and hot \"we don't have it\" answers live at the counter." }
  ],

  tradeoffs: [
    { pro: "Models real misses; a tall path to \"not found\" is as bad as a tall path to a key.", con: "You must estimate q_i; fake zeros collapse to the previous lecture." },
    { pro: "Same cubic DP and Root reconstruction as successful-only.", con: "Base case C[i,i]=q_i is easy to forget and then every cell is wrong." },
    { pro: "Prefix sums make each W O(1) after O(n) setup.", con: "Without them every cell rescans the interval, still O(n³) but messier." },
    { pro: "Frequent-miss dummies rise toward the root, matching the shop story.", con: "A height-balanced BST still ignores both p and q." }
  ],

  interviewTips: [
    "Draw n circles and n+1 squares before writing a formula.",
    "Say Σp+Σq=1, then W[i,j] is the sum of both inside the interval.",
    "Write C[i,i]=q_i as the sentence that distinguishes this video from 4.6.",
    "Recurrence is still min over key-roots of left+right+W; fill increasing j−i.",
    "Tell the shop story: counter vs stock room for both hits and misses.",
    "Complexity stays Θ(n³); the extra q's do not change the class."
  ],

  scene: {
    nodes: [
      { id: "q0", label: "q0 <10", type: "cache", pos: [-10, 0, -3], color: "#64748b" },
      { id: "k1", label: "10 p1", type: "point", pos: [-6, 0, 2], color: "#60a5fa" },
      { id: "q1", label: "q1 11-19", type: "cache", pos: [-6, 0, -3], color: "#64748b" },
      { id: "k2", label: "20 p2", type: "point", pos: [-1.5, 0, 2], color: "#c084fc" },
      { id: "q2", label: "q2 21-29", type: "cache", pos: [-1.5, 0, -3], color: "#64748b" },
      { id: "k3", label: "30 p3", type: "point", pos: [3, 0, 2], color: "#fb923c" },
      { id: "q3", label: "q3 31-39", type: "cache", pos: [3, 0, -3], color: "#64748b" },
      { id: "k4", label: "40 p4", type: "point", pos: [7.5, 0, 2], color: "#22d3ee" },
      { id: "q4", label: "q4 >40", type: "cache", pos: [7.5, 0, -3], color: "#64748b" },
      { id: "ctr", label: "counter", type: "zone", pos: [0, 0, 5.5], size: [16, 3], showAt: 3 },
      { id: "n0", label: "4 keys, 5 dummies", type: "note", pos: [-8, 0, 7] },
      { id: "n1", label: "search 9 ends at q0", type: "note", pos: [8, 0, 7], showAt: 1 },
      { id: "n2", label: "Σp+Σq=1", type: "note", pos: [8, 0, -6], showAt: 2 },
      { id: "n3", label: "C[i,i]=q_i", type: "note", pos: [-8, 0, -6], showAt: 4 },
      { id: "n4", label: "C=min left+right+W", type: "note", pos: [0, 0, -6], showAt: 5 },
      { id: "n5", label: "hot p and hot q at root", type: "note", pos: [8, 0, 4], showAt: 6 }
    ],
    edges: [
      { from: "k1", to: "q0", dashed: true },
      { from: "k1", to: "q1", dashed: true },
      { from: "k2", to: "q2", dashed: true },
      { from: "k3", to: "q3", dashed: true },
      { from: "k4", to: "q4", dashed: true },
      { from: "k1", to: "k2" },
      { from: "k2", to: "k3" },
      { from: "k3", to: "k4" }
    ],
    steps: [
      {
        title: "Circles and squares",
        text: "Four keys in order. Five dummy squares occupy the gaps: <10, 11–19, 21–29, 31–39, >40. A failed search for 9, 47, or 11 all land on a square, not on a key.",
        highlight: ["k1", "k2", "k3", "k4", "q0", "q1", "q2", "q3", "q4", "n0"]
      },
      {
        title: "Miss 9 at q0",
        text: "Compare 10, go left, hit null. Three comparisons on a tall spine, one comparison if 10 is the root. Unsuccessful cost is real. 47 would fall off q4 instead.",
        highlight: ["k1", "q0", "n1"],
        fail: ["q0"],
        flows: [
          { from: "k1", to: "q0", color: "#f87171", label: "9 miss" }
        ]
      },
      {
        title: "p and q are a partition of 1",
        text: "Each p_i is \"they asked for this stocked key.\" Each q_i is \"they asked in this gap.\" The decimals add to 1. That is the probability model the cost will weight.",
        highlight: ["k1", "k3", "q0", "q4", "n2"]
      },
      {
        title: "Counter vs stock room",
        text: "High-p keys belong at the counter (root). High-q gaps belong there too: saying \"we don't have it\" after a stock-room walk is the expensive miss the lecture is designed to avoid.",
        highlight: ["ctr", "k3", "q0", "n5"]
      },
      {
        title: "Base: C[i,i]=q_i",
        text: "An interval with no key is exactly one dummy. Its cost is q_i, not 0. That single change is what this video adds to 4.6. Diagonal 0 is the q vector.",
        highlight: ["q0", "q1", "q2", "q3", "q4", "n3"]
      },
      {
        title: "Same min, fatter W",
        text: "C[i,j]=min over key k of C[i,k-1]+C[k,j]+W[i,j]. W sums every p and q owned by the interval — they all get one extra comparison at this root. Fill increasing j−i.",
        highlight: ["k1", "k2", "k3", "k4", "n4"]
      },
      {
        title: "Root table builds circles and squares",
        text: "Walk Root[0,n] as before. Empty leftover intervals become dummy leaves. Frequent keys and frequent miss-gaps rise. Time still Θ(n³); the q's did not change the class.",
        highlight: ["k3", "k1", "k4", "q0", "q4", "n5", "ctr"],
        flows: [
          { from: "k3", to: "k1", color: "#60a5fa", label: "L" },
          { from: "k3", to: "k4", color: "#22d3ee", label: "R" }
        ]
      }
    ]
  }
});
