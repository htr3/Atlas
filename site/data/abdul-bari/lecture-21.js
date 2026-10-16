window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 21,
  title: "Recurrence Relation (T(n)= T(n-1) + log n) #3",
  video: "https://www.youtube.com/watch?v=MhT7XmxhaCE",
  category: "Divide & Conquer",
  tagline: "A doubling loop costs log n; summed down the chain it is log(n!) = O(n log n).",
  summary: "A recursive call on n-1 plus a loop that doubles the index runs in log n per frame. Write T(n)=T(n-1)+log n, T(0)=1. The tree sums log n + log(n-1) + \u2026 + log 1 = log(n!). Using n! \le n^n gives log(n!) = O(n log n). Substitution writes the same logs. The decreasing-family shortcut: extra work f(n) multiplied by n, so log n becomes n log n. Subtracting 2 or 100 instead of 1 does not change the class. A coefficient in front of T(n-1) does.",

  theory: [
    {
      heading: "Spot log n in the loop",
      body: "The inner loop starts i at 1 and does <code>i = i*2</code> until i reaches n. That doubling loop executes \u0398(log n) times \u2014 the same count taught in the time-complexity examples. The recursive call is still on n-1. Ignore the loop's +1 overhead: even 2 log n + 2 has degree log n. So <code>T(n) = T(n-1) + log n</code> for n &gt; 0, <code>T(0) = 1</code>.",
      bullets: [
        "i \u2190 1; i \u2190 2i \u2192 \u0398(log n) iterations.",
        "One call T(n-1); extra work log n.",
        "Round extra constants; keep log n."
      ]
    },
    {
      heading: "Tree: sum of logs is log of a product",
      body: "Frame n pays log n and calls n-1. Next pays log(n-1), then log(n-2), down to log 2 and log 1, then T(0). Total <code>log n + log(n-1) + \u2026 + log 1</code>. Sum of logs is the log of the product: <code>log(n \u00b7 (n-1) \u00b7 \u2026 \u00b7 1) = log(n!)</code>.",
      bullets: [
        "Chain of n frames, each a log of the current size.",
        "\u03a3 log i = log(\u220f i) = log(n!).",
        "Stop at 0 as in the previous decreasing examples."
      ]
    },
    {
      heading: "Bound log(n!)",
      body: "There is no tight elementary closed form demanded here; there is a clean upper bound. n! \le n^n, so log(n!) \le log(n^n) = n log n. Hence log(n!) = O(n log n). Stirling's n log n - n is the tight story, but the lecture only needs the O(n log n) class. T(n) is therefore O(n log n).",
      bullets: [
        "n! \le n^n \u21d2 log(n!) \le n log n.",
        "Class: O(n log n) (and in fact \u0398(n log n) by Stirling).",
        "Write O(n log n) as the lecture does."
      ]
    },
    {
      heading: "Substitution is the same sum",
      body: "T(n)=T(n-1)+log n = T(n-2)+log(n-1)+log n = \u2026 = T(n-k)+log(n-k+1)+\u2026+log n. Set n-k=0, k=n: T(0)+log 1+\u2026+log n = 1+log(n!). Same bound O(n log n). After two fully written substitutions you may jump to k, as in the first two videos."
    },
    {
      heading: "Shortcut for a=1 decreasing recurrences",
      body: "Look at the three solved examples: T(n-1)+1 \u2192 n; T(n-1)+n \u2192 n\u00b2; T(n-1)+log n \u2192 n log n. Extra work f(n) is paid about n times along the chain, so the answer is n\u00b7f(n). Then T(n-1)+n\u00b2 would be n\u00b3. Changing the subtractor to 2 or 100 only changes the number of steps by a constant (n/2 or n/100 frames); the class stays n\u00b7f(n). A coefficient <code>a T(n-1)</code> with a\u22601 is a different story \u2014 next video.",
      bullets: [
        "T(n)=T(n-1)+f(n) \u21d2 ~ n f(n).",
        "T(n)=T(n-100)+n is still \u0398(n\u00b2) for large n.",
        "T(n)=2 T(n-1)+1 is not n\u00b7f(n); branching changes the class."
      ]
    }
  ],

  keyTerms: [
    { term: "Doubling loop", def: "i=1; i*=2 until n. Iteration count is \u0398(log n)." },
    { term: "log(n!)", def: "Exact sum of log n + \u2026 + log 1 along the decreasing chain." },
    { term: "n^n bound", def: "n! \le n^n implies log(n!) = O(n log n)." },
    { term: "n\u00b7f(n)", def: "Shortcut for T(n)=T(n-1)+f(n): extra work times number of frames." },
    { term: "Subtractor b", def: "T(n-b) still has \u0398(n) frames; class matches T(n-1)+f(n)." },
    { term: "Coefficient a", def: "a T(n-1) with a\u22601 is not the n\u00b7f(n) rule; wait for the next lecture." },
    { term: "O(n log n)", def: "Class of T(n)=T(n-1)+log n." }
  ],

  tradeoffs: [
    { pro: "Sum-of-logs identity gives an exact log(n!) without expanding every term.", con: "Exams still want you to write the product identity, not jump to n log n with no log(n!)." },
    { pro: "n! \le n^n is enough for O(n log n).", con: "A tight \u0398 needs Stirling; the lecture stops at the O bound." },
    { pro: "The n\u00b7f(n) shortcut wins objective questions.", con: "It fails the moment a coefficient multiplies T(n-1)." }
  ],

  interviewTips: [
    "Name the doubling loop as \u0398(log n) before writing T(n)=T(n-1)+log n.",
    "Sum logs to log(n!), then bound by log(n^n)=n log n.",
    "Show two substitutions, then k, then n-k=0 \u2014 same skeleton as +1 and +n.",
    "Shortcut: a=1 decreasing \u21d2 multiply extra work by n. Quote the three examples.",
    "T(n-2)+1 is still \u0398(n). T(n)=2T(n-1)+1 is not; flag the coefficient.",
    "Write O(n log n) as the lecture's class for log(n!)."
  ],

  scene: {
    nodes: [
      { id: "ln", label: "log n", type: "point", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "ln1", label: "log(n-1)", type: "point", pos: [0, 0, -3], showAt: 1, color: "#818cf8" },
      { id: "ln2", label: "log(n-2)", type: "point", pos: [0, 0, 0], showAt: 1, color: "#818cf8" },
      { id: "l2", label: "log 2", type: "point", pos: [0, 0, 3], showAt: 2, color: "#818cf8" },
      { id: "l1", label: "log 1", type: "point", pos: [0, 0, 6], showAt: 2, color: "#4ade80" },
      { id: "e0", label: "T(n)=T(n-1)+log n", type: "note", pos: [8, 0, -6] },
      { id: "e1", label: "i*=2 \u2192 log n / frame", type: "note", pos: [-8, 0, -6] },
      { id: "e2", label: "\u03a3 log = log(n!)", type: "note", pos: [8, 0, -1], showAt: 3 },
      { id: "e3", label: "n! \u2264 n^n", type: "note", pos: [8, 0, 3], showAt: 4 },
      { id: "e4", label: "O(n log n)", type: "note", pos: [8, 0, 6], showAt: 5 },
      { id: "e5", label: "n\u00b7f(n) shortcut", type: "note", pos: [-8, 0, 6], showAt: 6 }
    ],
    edges: [
      { from: "ln", to: "ln1", label: "n-1", showAt: 1 },
      { from: "ln1", to: "ln2", showAt: 1 },
      { from: "ln2", to: "l2", showAt: 2, dashed: true },
      { from: "l2", to: "l1", showAt: 2 }
    ],
    steps: [
      {
        title: "Doubling loop \u2192 +log n",
        text: "i starts at 1 and doubles. That loop is \u0398(log n). One recursive call on n-1. Write T(n)=T(n-1)+log n, T(0)=1.",
        highlight: ["ln", "e0", "e1"]
      },
      {
        title: "Chain of log costs",
        text: "Each frame pays the log of its own argument: log n, then log(n-1), then log(n-2). Same decreasing spine as the last two lectures.",
        highlight: ["ln", "ln1", "ln2"],
        flows: [
          { from: "ln", to: "ln1", color: "#60a5fa", label: "call" }
        ]
      },
      {
        title: "Down to log 1",
        text: "Continue to log 2 and log 1, then T(0). Total work is the sum of those logs.",
        highlight: ["l2", "l1", "ln"]
      },
      {
        title: "Sum of logs",
        text: "log n + \u2026 + log 1 = log(n\u00b7\u2026\u00b71) = log(n!). Substitution writes the same product after k steps and n-k=0.",
        highlight: ["e2", "ln", "l1"]
      },
      {
        title: "Bound n!",
        text: "n! \le n^n, so log(n!) \le n log n. That is the upper bound the lecture uses. Class O(n log n).",
        highlight: ["e3", "e2"]
      },
      {
        title: "O(n log n)",
        text: "Tree and substitution agree. Write O(n log n) as the time of the algorithm.",
        highlight: ["e4"]
      },
      {
        title: "Shortcut, and a warning",
        text: "For T(n-1)+f(n), answer ~ n f(n): 1\u2192n, n\u2192n\u00b2, log n\u2192n log n. T(n-b) is the same class. A coefficient 2 T(n-1) is next, and the shortcut dies.",
        highlight: ["e5", "e4"]
      }
    ]
  }
});
