window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 23,
  title: "Masters Theorem Decreasing Function",
  video: "https://www.youtube.com/watch?v=CyknhZbfMqc",
  category: "Divide & Conquer",
  tagline: "Three cases on a in T(n)=a T(n-b)+f(n): n f(n), a^{n/b} f(n), or just f(n).",
  summary: "The four worked decreasing recurrences collapse into one theorem. Write T(n)=a T(n-b)+f(n) with a&gt;0, b&gt;0, and f(n)=\u0398(n^k), k\u22650. If a=1 the answer is n\u00b7f(n), i.e. \u0398(n^{k+1}). If a&gt;1 it is f(n)\u00b7a^{n/b}, i.e. \u0398(n^k a^{n/b}). If a&lt;1 (a fraction) it is just f(n), \u0398(n^k). Memorize by re-solving the examples; watching once is not enough.",

  theory: [
    {
      heading: "The four examples, reread as data",
      body: "T(n-1)+1 was \u0398(n). T(n-1)+n was \u0398(n\u00b2). T(n-1)+log n was \u0398(n log n). 2T(n-1)+1 was \u0398(2^n). Also, 3T(n-1)+1 is \u0398(3^n), and 2T(n-1)+n is \u0398(n 2^n). When a=1, extra work is multiplied by n. When a&gt;1, extra work is multiplied by a^n (or a^{n/b} if you subtract b\u22601). Those observations are the theorem.",
      bullets: [
        "a=1: multiply f(n) by n.",
        "a&gt;1: multiply f(n) by a^{n/b}.",
        "a&lt;1: f(n) already dominates; do not multiply."
      ]
    },
    {
      heading: "General form",
      body: "<code>T(n) = a T(n-b) + f(n)</code>. Require a &gt; 0 and b &gt; 0 (if either is 0 the recurrence is degenerate). Treat f(n) in asymptotic form, written \u0398(n^k) with k \u2265 0. Constants inside f are absorbed; you only need the polynomial degree k (log n is handled as the f you already solved, or as a slowly growing factor in the a=1 case n\u00b7log n).",
      bullets: [
        "a = branching coefficient.",
        "b = subtractor (n-1, n-2, n-100).",
        "f(n) = non-recursive work, \u0398(n^k)."
      ]
    },
    {
      heading: "Case a = 1: \u0398(n^{k+1})",
      body: "One recursive call. About n/b frames, each paying n^k, total n^{k+1} (b is a constant). Equivalently: n \u00b7 f(n). That recovers +1 \u2192 n, +n \u2192 n\u00b2, +n\u00b2 \u2192 n^3, +log n \u2192 n log n. Subtracting 2 or 100 instead of 1 does not change the class.",
      bullets: [
        "a=1 \u21d2 \u0398(n^{k+1}) when f=\u0398(n^k).",
        "Or write n\u00b7f(n) if f is log n.",
        "b only rescales the number of frames by a constant."
      ]
    },
    {
      heading: "Case a &gt; 1: \u0398(n^k a^{n/b})",
      body: "Each level multiplies the number of nodes by a. Depth is still ~ n/b, so the exponential a^{n/b} appears. Multiply by the per-node polynomial: n^k a^{n/b}. Examples: 2T(n-1)+1 \u2192 2^n; 3T(n-1)+1 \u2192 3^n; 2T(n-1)+n \u2192 n 2^n. If b=2, the exponent is n/2: 2T(n-2)+1 \u2192 2^{n/2}.",
      bullets: [
        "a&gt;1 \u21d2 f(n) \u00b7 a^{n/b}.",
        "b in the exponent: a^{n/2} when you subtract 2.",
        "Polynomial f is a lower-order factor next to the exponential."
      ]
    },
    {
      heading: "Case a &lt; 1: \u0398(n^k)",
      body: "A fractional coefficient (0.5, 0.75) means each step spawns less than one full subproblem in the accounting. The geometric number of nodes shrinks. The total is dominated by the root's f(n), i.e. \u0398(n^k) \u2014 the same as f(n) itself. This case is rare in code but completes the trichotomy.",
      bullets: [
        "a&lt;1 \u21d2 same as f(n).",
        "Root work already as large as the whole tree.",
        "Three cases: &lt;1, =1, &gt;1 on a."
      ]
    },
    {
      heading: "How to remember",
      body: "There is little algebra to re-derive in the exam hall; the lecture is honest that you observe, then memorize. Spend time writing the four examples and the three case lines at least once by hand. Master's theorem for <i>dividing</i> functions (n/b) is a different video with a different comparison (log_b a vs k).",
      bullets: [
        "Write the cases once from the examples.",
        "Decreasing: compare a to 1.",
        "Dividing (later): compare log_b a to k."
      ]
    }
  ],

  keyTerms: [
    { term: "Decreasing Master", def: "Closed form for T(n)=a T(n-b)+f(n) by cases on a." },
    { term: "a", def: "Coefficient of the recursive call; compared to 1." },
    { term: "b", def: "Amount subtracted from n; appears as n/b in the a&gt;1 exponent." },
    { term: "f(n)=\u0398(n^k)", def: "Asymptotic extra work; k is the polynomial degree." },
    { term: "Case a=1", def: "\u0398(n^{k+1}) or n\u00b7f(n)." },
    { term: "Case a&gt;1", def: "\u0398(n^k a^{n/b})." },
    { term: "Case a&lt;1", def: "\u0398(n^k), same as f(n)." },
    { term: "Observation theorem", def: "Cases are read off solved examples, then applied as a lookup." }
  ],

  tradeoffs: [
    { pro: "One lookup replaces a full substitution on exam day.", con: "If the form is not a T(n-b)+n^k, the theorem does not apply \u2014 fall back to a tree." },
    { pro: "a=1 case matches the n\u00b7f(n) shortcut already practiced.", con: "People mix this with the dividing Master and compare log_b a, which is the wrong test." },
    { pro: "b in a^{n/b} handles n-2 and n-100 without new algebra.", con: "For small n the constants lie; the class is an n\u2192\u221e statement." }
  ],

  interviewTips: [
    "Write T(n)=a T(n-b)+f(n), name a, b, k, then pick the case on a vs 1.",
    "a=1 \u2192 n f(n). Recite +1, +n, +log n as the three drills.",
    "a&gt;1 \u2192 n^k a^{n/b}. 2T(n-1)+1 is 2^n, not n.",
    "If b=2, the exponent is n/2. Do not drop b.",
    "a&lt;1 \u2192 f(n) only. Rare, but it completes the three cases.",
    "This is not the dividing Master; do not compute log_b a here."
  ],

  scene: {
    nodes: [
      { id: "form", label: "T=a T(n-b)+f(n)", type: "note", pos: [0, 0, -7] },
      { id: "c1", label: "a=1", type: "point", pos: [-7, 0, -2], showAt: 1, color: "#4ade80" },
      { id: "c2", label: "a>1", type: "point", pos: [0, 0, -2], showAt: 1, color: "#fb923c" },
      { id: "c3", label: "a<1", type: "point", pos: [7, 0, -2], showAt: 1, color: "#60a5fa" },
      { id: "a1", label: "n\u00b7f(n) = n^{k+1}", type: "note", pos: [-7, 0, 2], showAt: 2 },
      { id: "a2", label: "f\u00b7a^{n/b}", type: "note", pos: [0, 0, 2], showAt: 3 },
      { id: "a3", label: "just f(n)=n^k", type: "note", pos: [7, 0, 2], showAt: 4 },
      { id: "ex1", label: "+1 \u2192 n, +n \u2192 n\u00b2", type: "note", pos: [-7, 0, 5], showAt: 2 },
      { id: "ex2", label: "2T(n-1)+1 \u2192 2^n", type: "note", pos: [0, 0, 5], showAt: 3 },
      { id: "ex3", label: "fraction a", type: "note", pos: [7, 0, 5], showAt: 4 },
      { id: "mem", label: "write it once by hand", type: "note", pos: [0, 0, 7], showAt: 5 }
    ],
    edges: [
      { from: "form", to: "c1", showAt: 1 },
      { from: "form", to: "c2", showAt: 1 },
      { from: "form", to: "c3", showAt: 1 },
      { from: "c1", to: "a1", showAt: 2, dashed: true },
      { from: "c2", to: "a2", showAt: 3, dashed: true },
      { from: "c3", to: "a3", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "General decreasing form",
        text: "T(n)=a T(n-b)+f(n), a&gt;0, b&gt;0, f=\u0398(n^k). The four solved videos are special cases of this line.",
        highlight: ["form"]
      },
      {
        title: "Split on a vs 1",
        text: "Three cases: a=1, a&gt;1, a&lt;1. This is not log_b a \u2014 that comparison is for dividing recurrences later.",
        highlight: ["form", "c1", "c2", "c3"],
        flows: [
          { from: "form", to: "c1", color: "#4ade80", label: "=1" },
          { from: "form", to: "c2", color: "#fb923c", label: ">1" },
          { from: "form", to: "c3", color: "#60a5fa", label: "<1" }
        ]
      },
      {
        title: "a=1 \u2192 n f(n)",
        text: "About n/b frames, each paying n^k, total n^{k+1}. Recovers +1\u2192n, +n\u2192n\u00b2, +log n\u2192n log n. b is a constant.",
        highlight: ["c1", "a1", "ex1"]
      },
      {
        title: "a&gt;1 \u2192 a^{n/b} f(n)",
        text: "Branching multiplies nodes by a each level, depth n/b. 2T(n-1)+1 is 2^n; 2T(n-2)+1 is 2^{n/2}; 2T(n-1)+n is n 2^n.",
        highlight: ["c2", "a2", "ex2"]
      },
      {
        title: "a&lt;1 \u2192 f(n)",
        text: "A fractional coefficient shrinks the tree. The root's extra work already dominates. Answer \u0398(n^k), same as f.",
        highlight: ["c3", "a3", "ex3"]
      },
      {
        title: "Memorize from the drills",
        text: "Little logic to reinvent under time pressure. Write the three case lines once from the examples. Next block: dividing functions T(n/b).",
        highlight: ["mem", "a1", "a2", "a3"]
      }
    ]
  }
});
