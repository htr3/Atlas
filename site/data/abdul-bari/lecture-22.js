window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 22,
  title: "Recurrence Relation T(n)=2 T(n-1)+1  #4",
  video: "https://www.youtube.com/watch?v=JvcqtZk2mng",
  category: "Divide & Conquer",
  tagline: "Two calls on n-1 turn the chain into a full binary tree of cost \u0398(2^n).",
  summary: "Two recursive calls on n-1 plus a constant print give T(n)=2T(n-1)+1, T(0)=1. The recursion tree is binary: level costs 1, 2, 4, \u2026, 2^k. Sum of that GP is 2^{k+1}-1. The depth still hits 0 after n steps, so k=n and T(n)=2^{n+1}-1=\u0398(2^n). Back-substitution produces 2^k T(n-k) plus the same geometric tail. The n\u00b7f(n) shortcut does not apply once a coefficient sits in front of T.",

  theory: [
    {
      heading: "Two calls, coefficient 2",
      body: "The body prints once (one unit) and calls <code>test(n-1)</code> twice. Sum: <code>T(n) = 2 T(n-1) + 1</code> for n &gt; 0, <code>T(0) = 1</code>. The +1 is the print; the 2 is the branching factor. This is still a <b>decreasing</b> recurrence (argument n-1), but it is no longer a chain.",
      bullets: [
        "Print + two recursive calls \u2192 2T(n-1)+1.",
        "Base T(0)=1, same convention.",
        "a=2 will dominate the closed form."
      ]
    },
    {
      heading: "Binary tree of unit costs",
      body: "Root spends 1 and sprouts two children of size n-1. Each of those spends 1 and sprouts two of size n-2. Level 0 has 1 node, level 1 has 2, level 2 has 4, level i has 2^i nodes, each costing 1. Expand until arguments reach 0, which takes n levels, so the last level has 2^n leaves.",
      bullets: [
        "Level costs: 1, 2, 4, \u2026, 2^k.",
        "k levels until n-k=0 \u21d2 k=n.",
        "Leaves: 2^n frames of T(0)."
      ]
    },
    {
      heading: "Geometric series",
      body: "Total T(n) = 1 + 2 + 2^2 + \u2026 + 2^k. For a GP with first term a=1 and ratio r=2, the sum through r^k is <code>(r^{k+1}-1)/(r-1) = 2^{k+1}-1</code>. Put k=n: <code>2^{n+1}-1</code>, which is \u0398(2^n). The exponential class is the point of this example: branching beats the linear number of levels.",
      bullets: [
        "Sum_{i=0..k} 2^i = 2^{k+1}-1.",
        "k=n \u21d2 2^{n+1}-1.",
        "Class: \u0398(2^n)."
      ]
    },
    {
      heading: "Substitution keeps the powers",
      body: "T(n)=2T(n-1)+1. Replace T(n-1): T(n)=2(2T(n-2)+1)+1 = 2^2 T(n-2)+2+1. Next: 2^3 T(n-3)+2^2+2+1. After k steps: <code>T(n) = 2^k T(n-k) + 2^{k-1} + \u2026 + 2 + 1</code>. Set n-k=0, k=n: 2^n T(0) + (2^n - 1) = 2^n + 2^n - 1 = 2^{n+1}-1. Same GP, written as a coefficient in front of T plus a tail.",
      bullets: [
        "Pattern: 2^k T(n-k) plus GP of +1's.",
        "T(0)=1 \u21d2 2^n \u00b7 1 plus 2^n-1.",
        "Matches the tree sum."
      ]
    },
    {
      heading: "Why the shortcut died",
      body: "When a=1, extra work f(n) is paid n times. When a=2, each level <i>doubles</i> the number of unit costs. Multiplying f(n)=1 by n would wrongly predict \u0398(n). The coefficient is the whole story. Next lecture packages a=1, a&gt;1, and a&lt;1 into Master's theorem for decreasing functions.",
      bullets: [
        "a=1 \u2192 n f(n); a=2 \u2192 ~ 2^n f(n).",
        "T(n)=3T(n-1)+1 will be \u0398(3^n).",
        "Master's theorem next: read a off the recurrence."
      ]
    }
  ],

  keyTerms: [
    { term: "Branching factor a", def: "Coefficient in a T(n-b)+f(n). Here a=2, b=1, f=1." },
    { term: "Level cost 2^i", def: "A full binary tree of unit-cost nodes has 2^i work on level i." },
    { term: "Geometric series", def: "1+2+\u2026+2^k = 2^{k+1}-1 for ratio 2." },
    { term: "2^k T(n-k)", def: "Substitution leftover: the base, scaled by the branching along the path." },
    { term: "\u0398(2^n)", def: "Exponential class of T(n)=2T(n-1)+1." },
    { term: "Decreasing still", def: "Argument is n-1, not n/2; exponential comes from a, not from the subtractor." },
    { term: "GP formula", def: "a(r^{k+1}-1)/(r-1); here a=1, r=2." }
  ],

  tradeoffs: [
    { pro: "The binary tree makes 1+2+4+\u2026 visible in one drawing.", con: "For a=3 the tree is ternary and you must trust the GP without drawing all nodes." },
    { pro: "Substitution and the tree give the same 2^{n+1}-1.", con: "Dropping the -1 too early still leaves \u0398(2^n), but theory papers want the exact GP sum." },
    { pro: "Shows why a\u22601 kills the n\u00b7f(n) shortcut.", con: "People still quote n after seeing +1 and miss the 2." }
  ],

  interviewTips: [
    "Write T(n)=2T(n-1)+1 from two calls plus a print; T(0)=1.",
    "Level costs 1,2,4,\u2026,2^n; sum as a GP = 2^{n+1}-1.",
    "Substitution pattern: 2^k T(n-k)+2^{k-1}+\u2026+1, then k=n.",
    "Do not apply n\u00b7f(n) here \u2014 a=2, not a=1.",
    "Quote \u0398(2^n). Mention 3T(n-1)+1 would be \u0398(3^n).",
    "State the GP formula a(r^{k+1}-1)/(r-1) if the paper wants the derivation."
  ],

  scene: {
    nodes: [
      { id: "r", label: "1", type: "point", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "l1", label: "1", type: "point", pos: [-5, 0, -2], showAt: 1, color: "#818cf8" },
      { id: "r1", label: "1", type: "point", pos: [5, 0, -2], showAt: 1, color: "#818cf8" },
      { id: "a", label: "1", type: "point", pos: [-8, 0, 2], showAt: 2, color: "#c084fc" },
      { id: "b", label: "1", type: "point", pos: [-3, 0, 2], showAt: 2, color: "#c084fc" },
      { id: "c", label: "1", type: "point", pos: [3, 0, 2], showAt: 2, color: "#c084fc" },
      { id: "d", label: "1", type: "point", pos: [8, 0, 2], showAt: 2, color: "#c084fc" },
      { id: "lv0", label: "level 0: 2^0=1", type: "note", pos: [0, 0, -7.5] },
      { id: "lv1", label: "level 1: 2^1=2", type: "note", pos: [0, 0, -0.5], showAt: 1 },
      { id: "lv2", label: "level 2: 2^2=4", type: "note", pos: [0, 0, 3.5], showAt: 2 },
      { id: "gp", label: "1+2+\u2026+2^k=2^{k+1}-1", type: "note", pos: [-7, 0, 6], showAt: 4 },
      { id: "kn", label: "k=n \u21d2 \u0398(2^n)", type: "note", pos: [7, 0, 6], showAt: 5 },
      { id: "eq", label: "T=2T(n-1)+1", type: "note", pos: [-8, 0, -6] }
    ],
    edges: [
      { from: "r", to: "l1", showAt: 1 },
      { from: "r", to: "r1", showAt: 1 },
      { from: "l1", to: "a", showAt: 2 },
      { from: "l1", to: "b", showAt: 2 },
      { from: "r1", to: "c", showAt: 2 },
      { from: "r1", to: "d", showAt: 2 }
    ],
    steps: [
      {
        title: "Two calls \u2192 coefficient 2",
        text: "Print once, recurse twice on n-1. Recurrence T(n)=2T(n-1)+1, T(0)=1. Still decreasing, now branching.",
        highlight: ["r", "eq"]
      },
      {
        title: "Level 1 costs 2",
        text: "Two children, each a unit print. Level cost 2^1=2. The chain of lecture 19 has become a binary tree.",
        highlight: ["r", "l1", "r1", "lv1"],
        flows: [
          { from: "r", to: "l1", color: "#60a5fa" },
          { from: "r", to: "r1", color: "#60a5fa" }
        ]
      },
      {
        title: "Level 2 costs 4",
        text: "Four grandchildren, each cost 1. Pattern: level i costs 2^i. Continue until the argument is 0.",
        highlight: ["a", "b", "c", "d", "lv2"]
      },
      {
        title: "k levels",
        text: "Arguments drop by 1 per level, so k=n when we hit T(0). Last level has 2^n nodes. Total is the GP 1+2+\u2026+2^n.",
        highlight: ["lv0", "lv1", "lv2"]
      },
      {
        title: "Sum the GP",
        text: "1+2+\u2026+2^k = 2^{k+1}-1. First term 1, ratio 2, formula a(r^{k+1}-1)/(r-1). Substitution yields the same tail.",
        highlight: ["gp"]
      },
      {
        title: "k=n \u21d2 \u0398(2^n)",
        text: "2^{n+1}-1 is \u0398(2^n). The n\u00b7f(n) shortcut does not apply. Next: Master's theorem for decreasing recurrences, including a&gt;1.",
        highlight: ["kn", "gp"]
      }
    ]
  }
});
