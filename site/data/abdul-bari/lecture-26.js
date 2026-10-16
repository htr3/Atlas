window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 26,
  title: "Recurrence Relation [ T(n)= 2T(n/2) +n] #3",
  video: "https://www.youtube.com/watch?v=1K9ebQJosvo",
  category: "Divide & Conquer",
  tagline: "Two half-size calls plus linear work: every level costs n, log n levels, \u0398(n log n).",
  summary: "A loop of n plus two recursive calls on n/2 is the mergesort recurrence T(n)=2T(n/2)+n, T(1)=1. The tree is binary: one root paying n, two children paying n/2 each (level total n), four grandchildren paying n/4 each (level total n). Every level costs n. Depth is log n because n/2^k=1. Product: n log n. Substitution produces 2^k T(n/2^k)+k n, then k=log n, T(n)=n+n log n=\u0398(n log n). Memorize this form; it times many D&C algorithms.",

  theory: [
    {
      heading: "From the code, and why base 1",
      body: "A loop body runs n times and the procedure calls itself twice on n/2. Sum: <code>T(n) = 2 T(n/2) + n</code> for n &gt; 1, <code>T(1) = 1</code>. Dividing recurrences stop at 1. Using 0 makes n/2^k \u2192 0 and the algebra collapses. If the code's base is 0, still write T(1)=1 for the solved recurrence. This relation is the time of mergesort (and of many even splits with linear combine).",
      bullets: [
        "Two calls \u2192 coefficient 2; size n/2.",
        "Loop \u2192 +n.",
        "T(1)=1; n&gt;1 for the recursive case."
      ]
    },
    {
      heading: "Tree: drop the T(\u00b7), keep the costs",
      body: "Draw only the non-recursive cost at each node. Root: n. Two children: n/2 and n/2. Four nodes at the next level: n/4 each. Eight: n/8 each. On every full level the costs add to n. That is the picture you should be able to redraw in thirty seconds.",
      bullets: [
        "Level 0: n.",
        "Level 1: n/2 + n/2 = n.",
        "Level i: 2^i \u00b7 (n/2^i) = n."
      ]
    },
    {
      heading: "How many levels?",
      body: "Sizes are n, n/2, n/4, \u2026, n/2^k. Stop when n/2^k = 1, so k = log_2 n. There are log n levels (plus the base). Each costs n, therefore T(n) = n \u00b7 log n. Class \u0398(n log n). Contrast the previous video: one child, level costs n, n/2, n/4, sum \u0398(n). The extra child is what keeps every level at n.",
      bullets: [
        "k = log n from n/2^k=1.",
        "log n levels \u00d7 n each = n log n.",
        "2T(n/2)+n vs T(n/2)+n is the whole difference."
      ]
    },
    {
      heading: "Substitution: kn appears",
      body: "T(n)=2T(n/2)+n. T(n/2)=2T(n/4)+n/2, so T(n)=2(2T(n/4)+n/2)+n = 2^2 T(n/4)+n+n. Next: 2^3 T(n/8)+3n. After k steps: <code>T(n) = 2^k T(n/2^k) + k n</code>. Set n/2^k=1, then 2^k=n and k=log n. T(n)= n T(1) + n log n = n + n log n. Dominant term n log n, so \u0398(n log n) (or \u0398(n log n) as \u03b8 as the lecture says).",
      bullets: [
        "Pattern: 2^k T(n/2^k) + k n.",
        "2^k=n, k=log n, T(1)=1.",
        "T(n)=n + n log n = \u0398(n log n)."
      ]
    },
    {
      heading: "Why this one is mandatory",
      body: "The lecture flags it: many algorithms' times are exactly 2T(n/2)+n. If you see that form, write n log n without unfolding \u2014 after you have unfolded it once. Master's theorem for dividing functions (next video) will give the same answer as case 2, log_2 2 = 1 = k. Know both the tree and the lookup.",
      bullets: [
        "Mergesort, many even D&C combines.",
        "Unfold once; then recognize on sight.",
        "Next: Master's theorem so you need not unfold every variant."
      ]
    }
  ],

  keyTerms: [
    { term: "2T(n/2)+n", def: "The standard even-split recurrence with linear extra work." },
    { term: "Level cost n", def: "On level i, 2^i nodes each pay n/2^i; the product is n." },
    { term: "k=log n", def: "Depth from n/2^k=1. Number of levels in the product n\u00b7k." },
    { term: "n + n log n", def: "Exact form after substitution; \u0398(n log n) drops the lower n." },
    { term: "T(1)=1", def: "Dividing base; do not drive the argument to 0." },
    { term: "Mergesort time", def: "This recurrence is the mergesort (and similar) complexity." },
    { term: "\u0398(n log n)", def: "Class of T(n)=2T(n/2)+n." }
  ],

  tradeoffs: [
    { pro: "Every level costing n makes n log n a one-line product.", con: "Students copy n log n onto T(n/2)+n, where levels shrink and the answer is n." },
    { pro: "Substitution's kn term is the same product in algebra.", con: "Dropping 2^k T(1) without setting 2^k=n loses the leftover +n; still \u0398(n log n), but messy." },
    { pro: "Recognizing the form is enough for MCQs.", con: "Theory papers still want the tree or the k-step substitution." }
  ],

  interviewTips: [
    "Write T(n)=2T(n/2)+n, T(1)=1, because two half calls plus a linear loop.",
    "Show one level sum: n/2+n/2=n, then say every level is n.",
    "Depth log n from n/2^k=1; product n log n.",
    "Substitution pattern 2^k T(n/2^k)+kn, k=log n, T=n+n log n.",
    "Name it as mergesort's recurrence. Do not confuse with T(n/2)+n=\u0398(n).",
    "This is the dividing form you must know by sight before Master's theorem."
  ],

  scene: {
    nodes: [
      { id: "r", label: "n", type: "point", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "l", label: "n/2", type: "point", pos: [-5, 0, -1], showAt: 1, color: "#818cf8" },
      { id: "ri", label: "n/2", type: "point", pos: [5, 0, -1], showAt: 1, color: "#818cf8" },
      { id: "a", label: "n/4", type: "point", pos: [-8, 0, 4], showAt: 2, color: "#c084fc" },
      { id: "b", label: "n/4", type: "point", pos: [-3, 0, 4], showAt: 2, color: "#c084fc" },
      { id: "c", label: "n/4", type: "point", pos: [3, 0, 4], showAt: 2, color: "#c084fc" },
      { id: "d", label: "n/4", type: "point", pos: [8, 0, 4], showAt: 2, color: "#c084fc" },
      { id: "lv0", label: "level sum n", type: "note", pos: [0, 0, -7.5] },
      { id: "lv1", label: "n/2+n/2=n", type: "note", pos: [0, 0, 0.8], showAt: 1 },
      { id: "lv2", label: "4\u00b7(n/4)=n", type: "note", pos: [0, 0, 5.6], showAt: 2 },
      { id: "eq", label: "T=2T(n/2)+n", type: "note", pos: [-8, 0, -6] },
      { id: "klog", label: "k=log n levels", type: "note", pos: [8, 0, -6], showAt: 4 },
      { id: "ans", label: "n log n = \u0398(n log n)", type: "note", pos: [0, 0, 7.4], showAt: 5 }
    ],
    edges: [
      { from: "r", to: "l", showAt: 1 },
      { from: "r", to: "ri", showAt: 1 },
      { from: "l", to: "a", showAt: 2 },
      { from: "l", to: "b", showAt: 2 },
      { from: "ri", to: "c", showAt: 2 },
      { from: "ri", to: "d", showAt: 2 }
    ],
    steps: [
      {
        title: "Form 2T(n/2)+n",
        text: "Loop of n, two calls on n/2. T(n)=2T(n/2)+n for n&gt;1, T(1)=1. Dividing base is 1. This times mergesort.",
        highlight: ["r", "eq", "lv0"]
      },
      {
        title: "Two children, level still n",
        text: "Children cost n/2 and n/2. Level total n \u2014 same as the root. The extra child is what T(n/2)+n did not have.",
        highlight: ["r", "l", "ri", "lv1"],
        flows: [
          { from: "r", to: "l", color: "#60a5fa", label: "n/2" },
          { from: "r", to: "ri", color: "#60a5fa", label: "n/2" }
        ]
      },
      {
        title: "Four nodes, still n",
        text: "n/4 four times. Pattern: 2^i nodes \u00d7 n/2^i = n on every level. Draw costs only; skip writing T(\u00b7).",
        highlight: ["a", "b", "c", "d", "lv2"]
      },
      {
        title: "Depth log n",
        text: "n/2^k=1 \u21d2 k=log n. About log n full levels until size 1. Count them; they are not n levels.",
        highlight: ["klog", "d"]
      },
      {
        title: "Product n log n",
        text: "log n levels, n each. T(n)=n log n. Substitution: 2^k T(n/2^k)+k n becomes n\u00b71 + n log n.",
        highlight: ["ans", "lv0", "lv1", "lv2"]
      },
      {
        title: "Know it by sight",
        text: "If you see 2T(n/2)+n, write \u0398(n log n). Master's theorem next gives the same answer as case log_b a = k. Unfold it once, then recognize it.",
        highlight: ["ans", "eq"]
      }
    ]
  }
});
