window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 6,
  title: "1.5.1 Time Complexity #1",
  video: "https://www.youtube.com/watch?v=9TlHvipP5yA",
  category: "Algorithm Foundations",
  tagline: "Ascending, descending, and stride-2 loops are still order n; j<i is n²; p+=i is √n.",
  summary: "A single for that walks n, walks backward from n, or increments by 2 or 20 is still order n — n/20 does not change degree. Two independent-looking nested n-loops are order n². The triangle j < i sums 0+1+…+(n−1) = n(n−1)/2, still order n². A loop that adds i into p until p exceeds n stops at k≈√n. Trace when the header is not a plain i < n.",

  theory: [
    {
      heading: "Read the body, ignore n+1 for the order",
      body: "For a familiar <code>for (i = 0; i < n; i++)</code> the body runs n times and the test n+1. The extra +1 never changes degree, so for order you may look only at how often the inner statement runs. That shortcut is the whole of this lecture: classify snippets by the body's frequency, then read the degree.",
      bullets: [
        "Body frequency is enough for order.",
        "n+1 on the header is real, then dropped.",
        "Snippets, not full algorithms, are enough to practice."
      ]
    },
    {
      heading: "Backward and stride still linear",
      body: "A loop from n down to 1 with i−− still executes the body n times: ten steps from 1 to 10 or from 10 to 1. Incrementing by 2 yields about n/2 iterations; by 20, about n/20. <code>n/2</code> and <code>n/20</code> are still degree 1, so still <b>order n</b>. The constant in the stride is a coefficient, not a new class.",
      bullets: [
        "i++ and i−− are the same order.",
        "i += 2 → n/2 → order n.",
        "i += 20 → n/20 → order n."
      ]
    },
    {
      heading: "Rectangular nest: n × n",
      body: "Two loops, both running n times, one inside the other, give n × n body executions. Headers contribute n+1 factors that again do not change degree. Order is <b>n²</b>. This is the matrix-add shape with the arrays stripped away.",
      bullets: [
        "Outer n, inner n → n².",
        "Same answer you already know from frequency count.",
        "If both bounds are n, do not trace cell by cell."
      ]
    },
    {
      heading: "Triangle j < i is still n²",
      body: "Inner loop bound is i, not n. Trace: i = 0 → inner runs 0 times; i = 1 → 1; i = 2 → 2; … up to about n. Total 0+1+2+…+(n−1) = n(n−1)/2. Algebra: n²/2 − n/2. Degree 2 → <b>order n²</b>. It is not the same loop as j < n, but the order matches. Do not call it order n because the inner loop is shorter on average.",
      bullets: [
        "Frequencies: 0,1,2,…,n−1.",
        "Closed form n(n−1)/2.",
        "Degree 2, so order n² — same class as the rectangle."
      ]
    },
    {
      heading: "p += i until p > n is √n",
      body: "Here the condition is not i < n. p starts at 0, i climbs 1,2,3,…, and each pass does p ← p+i. After k passes, p is the triangular number k(k+1)/2. The loop stops when that sum exceeds n, so k² ≈ n and <b>k ≈ √n</b>. Body frequency is order √n, not order n. Blindly writing n because you saw a for-loop is the mistake this example exists to catch.",
      bullets: [
        "Let the unknown iteration count be k.",
        "p = 1+2+…+k = k(k+1)/2 > n at exit.",
        "k is order √n."
      ]
    },
    {
      heading: "Trace when the bound is not the counter",
      body: "The lecture's method for the last two snippets is tracing: write i (and j or p) down the page until the condition fails, then sum or solve. Use that whenever the header is not a plain counter against n. Rectangular n-nests you may skip tracing. Triangle and accumulating p you may not.",
      bullets: [
        "Plain i < n: skip to order n.",
        "Bound depends on another variable: trace or sum.",
        "Condition on a derived p: solve for k."
      ]
    }
  ],

  keyTerms: [
    { term: "Stride loop", def: "i += 2 or i += 20; iteration count n/2 or n/20, still order n." },
    { term: "Rectangular nest", def: "Inner and outer both run ~n times; body n², order n²." },
    { term: "Triangle nest", def: "Inner runs j < i; total n(n−1)/2, still order n²." },
    { term: "Triangular number", def: "1+2+…+k = k(k+1)/2; set greater than n to get k ≈ √n." },
    { term: "Order √n", def: "Class of the p += i loop that stops when the running sum passes n." },
    { term: "Trace", def: "Write successive i (and j, p) values when the bound is not obviously n." }
  ],

  tradeoffs: [
    { pro: "Dropping the +1 on a for-header speeds order answers.", con: "Exact T(n) questions still want n+1 on the test." },
    { pro: "Triangle and rectangle share order n², so they sit in one class.", con: "n(n−1)/2 is about half of n²; constants still differ." },
    { pro: "Solving k(k+1)/2 > n gives √n without simulating n.", con: "If you treat every for as order n, you miss the √n family entirely." }
  ],

  interviewTips: [
    "i from n down to 1 is still order n; direction is not a new class.",
    "i += 2 or += 20 stays order n because you report degree, not n/20.",
    "j < i: sum 0..n−1 = n(n−1)/2 → order n², not order n.",
    "If the condition is on p = p+i, set k(k+1)/2 ≈ n and answer order √n.",
    "Say you only skip tracing when both loops are clearly 0..n.",
    "Do not quote Big-O yet unless asked; this unit still says order of."
  ],

  scene: {
    nodes: [
      { id: "up", label: "i++ to n", type: "queue", pos: [-10, 0, 5], color: "#60a5fa" },
      { id: "dn", label: "i-- from n", type: "queue", pos: [-10, 0, 1], color: "#60a5fa" },
      { id: "st", label: "i += 2", type: "queue", pos: [-10, 0, -3], color: "#60a5fa" },
      { id: "on", label: "order n", type: "note", pos: [-3, 0, 1], showAt: 1 },
      { id: "i0", label: "i=0..n", type: "point", pos: [3, 0, 6], showAt: 2, color: "#fb923c" },
      { id: "j0", label: "j=0..n", type: "point", pos: [8, 0, 6], showAt: 2, color: "#fb923c" },
      { id: "n2", label: "order n^2", type: "note", pos: [8, 0, 3], showAt: 2 },
      { id: "tri", label: "0+1+..+n", type: "note", pos: [3, 0, 0], showAt: 3 },
      { id: "half", label: "n(n-1)/2", type: "note", pos: [8, 0, 0], showAt: 3 },
      { id: "p", label: "p += i", type: "worker", pos: [3, 0, -4], showAt: 4, color: "#c084fc" },
      { id: "k", label: "k(k+1)/2>n", type: "note", pos: [8, 0, -4], showAt: 4 },
      { id: "rt", label: "order √n", type: "cache", pos: [8, 0, -7], showAt: 5, color: "#4ade80" }
    ],
    edges: [
      { from: "up", to: "on", showAt: 1 },
      { from: "dn", to: "on", showAt: 1 },
      { from: "st", to: "on", showAt: 1 },
      { from: "i0", to: "j0", label: "n x n", showAt: 2 },
      { from: "j0", to: "n2", showAt: 2 },
      { from: "tri", to: "half", showAt: 3 },
      { from: "half", to: "n2", showAt: 3, dashed: true },
      { from: "p", to: "k", showAt: 4 },
      { from: "k", to: "rt", showAt: 5 }
    ],
    steps: [
      {
        title: "Three linear shapes",
        text: "Count up to n, count down from n, or add 2 each time. Body frequencies n, n, and n/2. All degree 1 → order n. Stride 20 is still order n.",
        highlight: ["up", "dn", "st"]
      },
      {
        title: "Same order after the shortcut",
        text: "Headers contribute n+1. That +1 never changes degree, so the three snippets collapse to one class: order n.",
        highlight: ["up", "dn", "st", "on"],
        flows: [
          { from: "up", to: "on", color: "#60a5fa", label: "n" },
          { from: "dn", to: "on", color: "#60a5fa", label: "n" },
          { from: "st", to: "on", color: "#60a5fa", label: "n/2" }
        ]
      },
      {
        title: "Rectangle nest",
        text: "Outer i and inner j both walk n. Body n². Order n². No need to write a table of i,j pairs.",
        highlight: ["i0", "j0", "n2"],
        flows: [
          { from: "i0", to: "j0", color: "#fb923c", label: "n" }
        ]
      },
      {
        title: "Triangle nest",
        text: "j < i gives 0+1+2+…+(n−1) = n(n−1)/2. Degree 2, so order n² — same class as the rectangle, different constant.",
        highlight: ["tri", "half", "n2"],
        flows: [
          { from: "tri", to: "half", color: "#fb923c", label: "sum" }
        ]
      },
      {
        title: "Stop when the sum passes n",
        text: "p accumulates 1+2+…+k. Exit when k(k+1)/2 > n. That k is not n; you have to solve for it.",
        highlight: ["p", "k"],
        flows: [
          { from: "p", to: "k", color: "#c084fc", label: "k" }
        ]
      },
      {
        title: "k ≈ √n",
        text: "k² ≈ n, so the body runs order √n times. A for-loop whose bound is a derived sum is not automatically order n.",
        highlight: ["p", "k", "rt"]
      }
    ]
  }
});
