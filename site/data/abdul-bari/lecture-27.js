window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 27,
  title: "Masters Theorem in Algorithms for Dividing Function #1",
  video: "https://www.youtube.com/watch?v=OynWkEj0S-s",
  category: "Divide & Conquer",
  tagline: "Compare log_b a to k in T(n)=a T(n/b)+n^k log^p n; three cases, with p subcases.",
  summary: "Dividing Master theorem: T(n)=a T(n/b)+f(n) with a\u22651, b&gt;1, and f(n)=\u0398(n^k log^p n). Compute log_b a and compare it to k. If log_b a &gt; k, answer \u0398(n^{log_b a}). If they are equal, look at p: p&gt;-1 \u2192 multiply f by another log (n^k log^{p+1} n); p=-1 \u2192 n^k log log n; p&lt;-1 \u2192 n^k. If log_b a &lt; k, take f(n) when p\u22650, or n^k when p&lt;0 (drop a log in the denominator). Worked examples: 2T(n/2)+1 is \u0398(n); 2T(n/2)+n is \u0398(n log n); T(n/2)+n\u00b2 is \u0398(n\u00b2).",

  theory: [
    {
      heading: "Form and the two numbers",
      body: "<code>T(n) = a T(n/b) + f(n)</code>, a \u2265 1, b &gt; 1. Write f as \u0398(n^k (log n)^p). The two numbers to compute are <b>log_b a</b> (the critical exponent of the recursion tree's leaf level) and <b>k</b> (the polynomial degree of f). Comparing them is the whole theorem. Missing logs in f mean p=0. Missing n means k=0 (f is constant, n^0).",
      bullets: [
        "a = number of subproblems, b = shrink factor.",
        "k = power of n in f; p = power of log n (0 if none).",
        "Tool: log_b a vs k, then maybe p."
      ]
    },
    {
      heading: "Case 1: log_b a &gt; k \u2192 \u0398(n^{log_b a})",
      body: "Leaves dominate. Answer is the leaf size, n to the power of log_b a, and f's logs do not appear. Examples: 2T(n/2)+1 has log_2 2=1 &gt; k=0 \u2192 \u0398(n). 4T(n/2)+n has log_2 4=2 &gt; 1 \u2192 \u0398(n^2). 8T(n/2)+n has 3&gt;1 \u2192 \u0398(n^3). 8T(n/2)+n\u00b2 has 3&gt;2 \u2192 still \u0398(n^3). 9T(n/3)+1 has log_3 9=2 &gt; 0 \u2192 \u0398(n^2).",
      bullets: [
        "Compare log_b a to the power of n only \u2014 ignore p here.",
        "Answer n^{log_b a}, not f(n).",
        "8T(n/2)+n log n is still case 1 (3&gt;1) \u2192 \u0398(n^3)."
      ]
    },
    {
      heading: "Case 2: log_b a = k, three subcases on p",
      body: "Root and leaves are in the same polynomial class; logs decide. If p &gt; -1 (the usual textbook case, including p=0): take f and multiply by one more log: \u0398(n^k log^{p+1} n). So 2T(n/2)+n is 1=1, p=0 \u2192 n log n. 4T(n/2)+n\u00b2 \u2192 n\u00b2 log n. Already n\u00b2 log n \u2192 n\u00b2 log^2 n. If p = -1 (log in the denominator once): \u0398(n^k log log n) \u2014 do not cancel the log by multiplying. If p &lt; -1 (log^2 or higher in the denominator): drop the logs, \u0398(n^k).",
      bullets: [
        "p&gt;-1: f \u00d7 log n (raise p by one).",
        "p=-1: n^k log log n.",
        "p&lt;-1: n^k, ignore the tiny logs."
      ]
    },
    {
      heading: "Case 3: log_b a &lt; k \u2192 f wins",
      body: "Root work is polynomially larger than the leaf level. If p \u2265 0, the answer is f(n) itself: T(n/2)+n\u00b2 has log_2 1=0 &lt; 2 \u2192 \u0398(n\u00b2); 2T(n/2)+n\u00b2 is 1&lt;2 \u2192 still \u0398(n\u00b2); keep log factors if they sit in f. If p &lt; 0 (log in the denominator), drop that log and keep n^k. 4T(n/2)+n^3 is 2&lt;3 \u2192 \u0398(n^3).",
      bullets: [
        "p\u22650: answer is f(n).",
        "p&lt;0: answer n^k, strip the denominator log.",
        "T(n/2)+n\u00b2 is the clean drill: \u0398(n\u00b2)."
      ]
    },
    {
      heading: "Worked lineup",
      body: "2T(n/2)+1 \u2192 \u0398(n). 4T(n/2)+n \u2192 \u0398(n^2). 8T(n/2)+n \u2192 \u0398(n^3). 2T(n/2)+n \u2192 \u0398(n log n). 4T(n/2)+n\u00b2 \u2192 \u0398(n\u00b2 log n). 8T(n/2)+n^3 \u2192 \u0398(n^3 log n). 2T(n/2)+n/log n \u2192 \u0398(n log log n). T(n/2)+n\u00b2 \u2192 \u0398(n\u00b2). Compute log_b a, compare to k, then if needed look at p. That is the exam procedure.",
      bullets: [
        "Always compute log_b a first (4 base 2 is 2, 8 base 2 is 3, 9 base 3 is 2).",
        "k is the power of n, not the presence of log.",
        "Equal exponents \u2192 extra log, except the p\le-1 traps."
      ]
    }
  ],

  keyTerms: [
    { term: "log_b a", def: "Critical exponent: leaf-level cost is \u0398(n^{log_b a}). Compare to k." },
    { term: "k", def: "Power of n in f(n)=\u0398(n^k log^p n). Constants are k=0." },
    { term: "p", def: "Power of log n in f. Zero if f has no log; negative if log is in the denominator." },
    { term: "Case 1", def: "log_b a &gt; k \u2192 \u0398(n^{log_b a}). Leaves win." },
    { term: "Case 2", def: "log_b a = k. Subcases on p: extra log, log log, or plain n^k." },
    { term: "Case 3", def: "log_b a &lt; k. Root wins: f(n), or n^k if p&lt;0." },
    { term: "p=0 default", def: "Most GATE/exam recurrences have no log; case 2 then just multiplies by log n." },
    { term: "2T(n/2)+n", def: "Case 2, k=p=0 \u2192 \u0398(n log n), matching the previous lecture." }
  ],

  tradeoffs: [
    { pro: "A two-number compare replaces a full tree on most dividing recurrences.", con: "Wrong a or b (or treating n-b as n/b) sends you to the decreasing theorem." },
    { pro: "p=0 covers almost every undergraduate example.", con: "p=-1 and p&lt;-1 are easy to miss; multiplying by log would cancel a denominator log and be wrong." },
    { pro: "Case 1 ignores p, which is a relief on n log n extra work.", con: "People still multiply by log in case 1 and overshoot (8T(n/2)+n log n is n^3, not n^3 log n)." }
  ],

  interviewTips: [
    "Write a, b, k, p, then log_b a. Compare log_b a to k before touching p.",
    "Case 1: answer n^{log_b a}. Recite 2T(n/2)+1=\u0398(n) and 4T(n/2)+n=\u0398(n^2).",
    "Case 2 with p=0: take f and multiply by log n. That is 2T(n/2)+n=\u0398(n log n).",
    "If log is already in f, raise its power by one when the exponents are equal (p&gt;-1).",
    "p=-1: n^k log log n, do not cancel. p&lt;-1: n^k only.",
    "Case 3: copy f(n) when p\u22650. T(n/2)+n\u00b2 is \u0398(n\u00b2).",
    "Do not use this on a T(n-b) form \u2014 that is the decreasing Master of lecture 23."
  ],

  scene: {
    nodes: [
      { id: "form", label: "T=a T(n/b)+n^k log^p n", type: "note", pos: [0, 0, -7] },
      { id: "cmp", label: "compare log_b a vs k", type: "note", pos: [0, 0, -4], showAt: 1 },
      { id: "c1", label: "log_b a > k", type: "point", pos: [-7, 0, -1], showAt: 2, color: "#4ade80" },
      { id: "c2", label: "log_b a = k", type: "point", pos: [0, 0, -1], showAt: 2, color: "#fb923c" },
      { id: "c3", label: "log_b a < k", type: "point", pos: [7, 0, -1], showAt: 2, color: "#60a5fa" },
      { id: "a1", label: "\u0398(n^{log_b a})", type: "note", pos: [-7, 0, 3], showAt: 3 },
      { id: "a2", label: "\u00d7log / loglog / n^k", type: "note", pos: [0, 0, 3], showAt: 4 },
      { id: "a3", label: "f(n) or n^k", type: "note", pos: [7, 0, 3], showAt: 5 },
      { id: "ex1", label: "2T(n/2)+1 \u2192 n", type: "note", pos: [-7, 0, 6], showAt: 3 },
      { id: "ex2", label: "2T(n/2)+n \u2192 n log n", type: "note", pos: [0, 0, 6], showAt: 4 },
      { id: "ex3", label: "T(n/2)+n\u00b2 \u2192 n\u00b2", type: "note", pos: [7, 0, 6], showAt: 5 }
    ],
    edges: [
      { from: "form", to: "cmp", showAt: 1 },
      { from: "cmp", to: "c1", showAt: 2 },
      { from: "cmp", to: "c2", showAt: 2 },
      { from: "cmp", to: "c3", showAt: 2 },
      { from: "c1", to: "a1", showAt: 3, dashed: true },
      { from: "c2", to: "a2", showAt: 4, dashed: true },
      { from: "c3", to: "a3", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "General dividing form",
        text: "T(n)=a T(n/b)+f(n), a\u22651, b&gt;1, f=\u0398(n^k log^p n). Missing logs mean p=0. Missing n means k=0.",
        highlight: ["form"]
      },
      {
        title: "Compute log_b a and k",
        text: "log_2 2=1, log_2 4=2, log_2 8=3, log_3 9=2. k is the power of n in f. These two numbers pick the case.",
        highlight: ["form", "cmp"]
      },
      {
        title: "Three cases",
        text: "Greater, equal, or less. This comparison is not a vs 1 \u2014 that was the decreasing Master. Here the test is log_b a vs k.",
        highlight: ["c1", "c2", "c3", "cmp"],
        flows: [
          { from: "cmp", to: "c1", color: "#4ade80", label: ">" },
          { from: "cmp", to: "c2", color: "#fb923c", label: "=" },
          { from: "cmp", to: "c3", color: "#60a5fa", label: "<" }
        ]
      },
      {
        title: "Case 1: leaves win",
        text: "log_b a &gt; k \u2192 \u0398(n^{log_b a}). 2T(n/2)+1 is 1&gt;0 \u2192 \u0398(n). 4T(n/2)+n is 2&gt;1 \u2192 \u0398(n^2). Ignore p.",
        highlight: ["c1", "a1", "ex1"]
      },
      {
        title: "Case 2: extra log (usually)",
        text: "Equal exponents. p&gt;-1: multiply f by log n. 2T(n/2)+n \u2192 n log n. p=-1 \u2192 n^k log log n. p&lt;-1 \u2192 n^k.",
        highlight: ["c2", "a2", "ex2"]
      },
      {
        title: "Case 3: root wins",
        text: "log_b a &lt; k. p\u22650: answer is f(n). T(n/2)+n\u00b2 \u2192 \u0398(n\u00b2). p&lt;0: drop the denominator log, keep n^k.",
        highlight: ["c3", "a3", "ex3"]
      },
      {
        title: "Exam procedure",
        text: "a, b, k, p, log_b a, compare, write \u0398. Recite 2T(n/2)+n as case 2. Never run this theorem on T(n-b).",
        highlight: ["ex1", "ex2", "ex3", "cmp"]
      }
    ]
  }
});
