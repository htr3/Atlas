window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 7,
  title: "1.5.2 Time Complexity Example #2",
  video: "https://www.youtube.com/watch?v=9SgLBjXqwd4",
  category: "Algorithm Foundations",
  tagline: "Multiply or divide the counter by 2 for log n; sequential loops add; nested n×log is n log n.",
  summary: "If i starts at 1 and doubles until i ≥ n, then 2^k ≥ n so k = log₂ n. Dividing n by 2 down to 1 is the same class. Non-powers of two need ceil: n=8 gives 3 iterations, n=10 gives 4. i*i ≤ n is √n. Two loops one after another are n+n = order n, not n². Nested +1 outer and ×2 inner is n log n. A loop that builds p = log n followed by a log p loop is log log n.",

  theory: [
    {
      heading: "Doubling: 2^k = n",
      body: "A loop that starts i at 1 and does i ← 2i while i < n does not run n times. After k updates, i = 2^k. It stops when 2^k ≥ n, so <b>k = log₂ n</b>. The body is order log n. Treat that as a formula: whenever the counter is multiplied (by 2, or by 3) instead of incremented, the class is logarithmic in that base.",
      bullets: [
        "i = 1,2,4,8,… = 2^k.",
        "Set 2^k = n → k = log₂ n.",
        "Multiply by 3 → log₃ n."
      ]
    },
    {
      heading: "The +1 analogue, rewritten",
      body: "The same unknown-k method on an incrementing loop: i grows by +1, k times, until i ≥ n, so k = n. That is why ordinary fors are order n. The doubling loop is the same algebra with a different recurrence. You do not need a new theory — you need to write what happens to i each pass and solve for k.",
      bullets: [
        "+1 each time → k = n.",
        "×2 each time → k = log n.",
        "The method is identical; only the closed form changes."
      ]
    },
    {
      heading: "Ceil when n is not a power of two",
      body: "Trace n = 8: i = 1,2,4 then 8 fails i < 8. Three iterations, and log₂ 8 = 3 exactly. Trace n = 10: i = 1,2,4,8 then 16 fails. Four iterations, while log₂ 10 is about 3.2. Iteration count is the <b>ceiling</b> of the log, not the floor. On an exam, say order log n and, if asked for the integer count, take ceil.",
      bullets: [
        "n = 8 → 3 bodies, log₂ 8 = 3.",
        "n = 10 → 4 bodies, ceil(log₂ 10).",
        "Logs are real; loop counts are integers."
      ]
    },
    {
      heading: "Halving from n is also log n",
      body: "Start i at n and replace i by i/2 until i < 1. After k steps, n / 2^k < 1, so n < 2^k and k = log₂ n again. Multiplying up from 1 and dividing down from n are the same class. Geometric growth and geometric shrink are twins.",
      bullets: [
        "i = n, n/2, n/4, …",
        "Stop near 1 → k = log₂ n.",
        "Write this as a second formula next to the ×2 loop."
      ]
    },
    {
      heading: "i*i ≤ n is √n; sequential loops add",
      body: "A loop that continues while i² ≤ n runs until i ≈ √n — order √n, no k-log needed. Two <i>independent</i> loops one after another, each order n, cost n+n = 2n → <b>order n</b>. They are not nested, so you add, you do not multiply. Calling that n² is the standard misread of stacked fors.",
      bullets: [
        "i*i ≤ n → order √n.",
        "Loop then loop: add the orders.",
        "n + n is order n, not order n²."
      ]
    },
    {
      heading: "log log n and n log n",
      body: "First loop: i doubles up to n and a variable p counts the passes, so p ends at log n. Second loop: j doubles up to p, so it runs log p = log log n times. Body of the second loop is <b>order log log n</b>. Nested case: outer i++ to n (order n) wrapping inner j *= 2 to n (order log n) multiplies: <b>order n log n</b>. Nesting multiplies; sequence adds.",
      bullets: [
        "p = log n, then log p → log log n.",
        "Outer n, inner log n → n log n.",
        "Remember: nested product, sequential sum."
      ]
    },
    {
      heading: "Pocket formulas from this lecture",
      body: "Increment or decrement by 1, 2, 10, or 100: order n (n/100 is still degree 1). Multiply i by 2: log₂ n. Multiply by 3: log₃ n. Divide i by 2 from n: log₂ n. Those four lines are enough to classify most contest-style for-headers without a fresh trace, as long as the update is a single +c or ×c on the counter.",
      bullets: [
        "±c on i → order n.",
        "i *= 2 or i /= 2 → log₂ n.",
        "i *= 3 → log₃ n."
      ]
    }
  ],

  keyTerms: [
    { term: "Geometric loop", def: "Counter multiplied or divided by a constant each pass; order log n in that base." },
    { term: "log₂ n", def: "Iteration count k when 2^k reaches n; the class of doubling and halving loops." },
    { term: "Ceiling of log", def: "Integer iteration count when n is not a power of two (n=10 → 4, not 3)." },
    { term: "Sequential loops", def: "One after another; add their times (n+n → order n)." },
    { term: "Nested n and log n", def: "Outer linear, inner doubling; product is order n log n." },
    { term: "log log n", def: "A log-length value used as the bound of a second doubling loop." },
    { term: "i*i ≤ n", def: "Stops at i ≈ √n; order √n." }
  ],

  tradeoffs: [
    { pro: "Closed form 2^k = n avoids tracing 10^9 iterations.", con: "You must still ceil when the exam wants the exact trip count." },
    { pro: "Sequential loops stay linear, which saves a wrong n² on stacked scans.", con: "A missing indent that accidentally nests them really is n²." },
    { pro: "n log n is the natural class of linear-outer / geometric-inner nests.", con: "People quote n log n for two sequential loops and overstate the cost." }
  ],

  interviewTips: [
    "If i starts at 1 and i *= 2, say 2^k ≥ n so k = log₂ n. Do not say n.",
    "Show n=8 (3 iters) and n=10 (4 iters) when asked about ceil versus floor of log.",
    "i = n; i /= 2 is also log n — shrinking is the same class as growing.",
    "Two loops written one after another: add, n+n = order n. Nesting is what multiplies.",
    "Outer i++ and inner j *= 2: n log n. First loop builds p=log n, second logs p: log log n.",
    "i += 100 is still order n; only multiply/divide of the counter makes a log."
  ],

  scene: {
    nodes: [
      { id: "i1", label: "i=1", type: "point", pos: [-11, 0, -2], color: "#60a5fa" },
      { id: "i2", label: "i=2", type: "point", pos: [-7, 0, 0], showAt: 1, color: "#60a5fa" },
      { id: "i4", label: "i=4", type: "point", pos: [-3, 0, 2], showAt: 1, color: "#60a5fa" },
      { id: "i8", label: "i=8", type: "point", pos: [1, 0, 4], showAt: 1, color: "#60a5fa" },
      { id: "log", label: "k=log2 n", type: "note", pos: [6, 0, 5], showAt: 1 },
      { id: "n8", label: "n=8 -> 3", type: "note", pos: [6, 0, 2], showAt: 2 },
      { id: "n10", label: "n=10 -> 4", type: "note", pos: [6, 0, -1], showAt: 2 },
      { id: "half", label: "n, n/2, n/4", type: "queue", pos: [-7, 0, -5], showAt: 3, color: "#c084fc" },
      { id: "seq", label: "n + n", type: "worker", pos: [-1, 0, -5], showAt: 4, color: "#4ade80" },
      { id: "on", label: "order n", type: "note", pos: [5, 0, -5], showAt: 4 },
      { id: "nest", label: "n x log n", type: "worker", pos: [-1, 0, -8], showAt: 5, color: "#fb923c" },
      { id: "nlog", label: "order n log n", type: "note", pos: [6, 0, -8], showAt: 5 },
      { id: "ll", label: "log log n", type: "cache", pos: [11, 0, -4], showAt: 6, color: "#c084fc" }
    ],
    edges: [
      { from: "i1", to: "i2", label: "*2", showAt: 1 },
      { from: "i2", to: "i4", label: "*2", showAt: 1 },
      { from: "i4", to: "i8", label: "*2", showAt: 1 },
      { from: "i8", to: "log", showAt: 1, dashed: true },
      { from: "log", to: "n8", showAt: 2, dashed: true },
      { from: "log", to: "n10", showAt: 2, dashed: true },
      { from: "half", to: "log", showAt: 3, dashed: true },
      { from: "seq", to: "on", showAt: 4 },
      { from: "nest", to: "nlog", showAt: 5 },
      { from: "log", to: "ll", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "i doubles: 1,2,4,8",
        text: "Each pass multiplies i by 2. After k passes i = 2^k. Stop when that meets n. k is log₂ n, not n.",
        highlight: ["i1"]
      },
      {
        title: "Solve 2^k = n",
        text: "The unknown iteration count is the exponent. Geometric update ⇒ logarithmic class. Multiply-by-3 is log₃ n.",
        highlight: ["i1", "i2", "i4", "i8", "log"],
        flows: [
          { from: "i1", to: "i2", color: "#60a5fa", label: "*2" },
          { from: "i2", to: "i4", color: "#60a5fa", label: "*2" },
          { from: "i4", to: "i8", color: "#60a5fa", label: "*2" }
        ]
      },
      {
        title: "Ceil the log",
        text: "n=8 is 2³, so 3 bodies (1,2,4). n=10 is not a power of two: 1,2,4,8 — four bodies. Use ceiling when you need the integer count.",
        highlight: ["log", "n8", "n10"]
      },
      {
        title: "Halving matches doubling",
        text: "Start at n and divide by 2 until you drop below 1. n/2^k < 1 ⇒ k = log₂ n. Same class as growing from 1.",
        highlight: ["half", "log"],
        flows: [
          { from: "half", to: "log", color: "#c084fc", label: "/2" }
        ]
      },
      {
        title: "Sequence adds, nest multiplies",
        text: "Two separate n-loops: n+n = order n. Do not write n². Nested outer n and inner log n: product n log n.",
        highlight: ["seq", "on", "nest", "nlog"],
        flows: [
          { from: "seq", to: "on", color: "#4ade80", label: "add" },
          { from: "nest", to: "nlog", color: "#fb923c", label: "mul" }
        ]
      },
      {
        title: "log of a log",
        text: "First doubling loop sets p = log n. Second doubling loop runs while j < p, so log p = log log n. i*i ≤ n remains the √n cousin from the last lecture.",
        highlight: ["ll", "log", "nlog"]
      }
    ]
  }
});
