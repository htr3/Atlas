window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 5,
  title: "1.4 Frequency Count Method",
  video: "https://www.youtube.com/watch?v=1U3Uwct45IY",
  category: "Algorithm Foundations",
  tagline: "Charge 1 per statement, multiply by how often it runs; the degree is the order.",
  summary: "Frequency count assigns one unit per statement and multiplies by executions. Array sum: for-test n+1, body n, T = 2n+3 → order n, space n+3 → order n. Matrix add: nested n loops, T and S both order n². Matrix multiply: three nested loops, T order n³ while S stays order n². Report the polynomial's degree, not the exact leading coefficient.",

  theory: [
    {
      heading: "Count frequency, then sum",
      body: "Give every statement one unit. If a statement runs many times, multiply by that <b>frequency</b>. The time function is the sum. You are still doing priori analysis; the new tool is the loop counter. For a C-style <code>for</code>, the header is not one blob: initialization, test, and increment have different counts, but at this shallow level the lecture often writes the whole header as n+1 and the body as n.",
      bullets: [
        "One unit × times executed.",
        "Repeating statements dominate the sum.",
        "The last return or trailing assignment is usually 1."
      ]
    },
    {
      heading: "Array sum, n = 5 as a trace",
      body: "s ← 0 runs once. For i from 0 while i < n, n = 5: the test is true at i = 0,1,2,3,4 and false at i = 5 — <b>n+1 tests</b>. The increment happens n times; the lecture notes that init+test+increment is really 2n+2 if you are pedantic, then still writes n+1 for the header because lower terms will not change the degree. The body s ← s+A[i] runs n times. A final statement runs once. T(n) = 2n+3 (or a nearby 2n+k). Degree 1 → <b>order n</b>. Space: the array n words plus s, i, n → n+3 → order n.",
      bullets: [
        "Condition: n+1 (n true, one false).",
        "Body: n.",
        "T(n) ≈ 2n+3, S(n) = n+3, both order n."
      ]
    },
    {
      heading: "Order means degree, not Big-O yet",
      body: "The lecture says <i>order of n</i> and postpones Big-O, Omega, and Theta. Practically you look at the <b>highest degree</b> of the polynomial and keep that term's shape: n, n², n³. Coefficients and lower terms are dropped. 2n+3 and 100n+7 are the same order. You are classifying the function, not quoting an exact clock formula.",
      bullets: [
        "Degree 1 → order n.",
        "Degree 2 → order n².",
        "Exact T(n) is optional; the degree is the exam answer."
      ]
    },
    {
      heading: "Matrix addition: two nested n-loops",
      body: "A and B are n×n. Outer for: n+1 tests. Everything inside runs n times, including an inner for whose own header is n+1 and whose body C[i][j] ← A[i][j]+B[i][j] runs n² times. T(n) collects two n²-class pieces plus lower n terms — degree 2 → <b>order n²</b>. Space: three matrices (3n²) plus n, i, j (three scalars) → 3n²+3 → order n². Time and space match in order here.",
      bullets: [
        "Inner body frequency = n × n = n².",
        "T(n) ~ 2n² + n, order n².",
        "S(n) = 3n²+3, order n²."
      ]
    },
    {
      heading: "Matrix multiplication: three nested loops",
      body: "Now three loops, each running on n. The innermost accumulation runs <b>n³</b> times. Loop headers contribute n² and n terms. A representative T(n) is 2n³ + 3n² + 2n + 1. Degree 3 → <b>order n³</b>. Space is still three n×n matrices plus i, j, k, n → 3n²+4 → <b>order n²</b>. Time and space orders need not match: multiply is cubic time, quadratic space.",
      bullets: [
        "Innermost statement: n³.",
        "T = order n³, S = order n².",
        "Nesting depth of n-loops is the usual degree of T."
      ]
    },
    {
      heading: "Three worked orders to keep",
      body: "Sum of an array: order n time and space. Add two matrices: order n² time and space. Multiply two matrices: order n³ time, order n² space. The method does not change: frequency of each line, sum, read off the degree. Any other nested-loop procedure in this unit is the same arithmetic.",
      bullets: [
        "1 loop of n → order n.",
        "2 nested n-loops → order n².",
        "3 nested n-loops → order n³ (space still follows the arrays)."
      ]
    }
  ],

  keyTerms: [
    { term: "Frequency count", def: "Time = (unit cost 1) × (how many times the statement executes), summed over statements." },
    { term: "n+1 test", def: "A for-test i < n is true n times and false once, so it runs n+1 times." },
    { term: "Degree / order", def: "Highest power in T(n) or S(n); 2n+3 is order n, not order 2n." },
    { term: "Array sum", def: "T(n) = 2n+3, S(n) = n+3; both order n." },
    { term: "Matrix addition", def: "Two nested n-loops; T and S both order n²." },
    { term: "Matrix multiplication", def: "Three nested n-loops; T order n³, S order n²." }
  ],

  tradeoffs: [
    { pro: "Writing n+1 for the whole for-header is fast and does not change the degree.", con: "A pedantic count of init+test+increment is 2n+2; graders who want exact T(n) may want that extra n." },
    { pro: "Degree-only answers compare algorithms without drowning in coefficients.", con: "Two order-n² methods can still differ by a hidden factor of 100 in practice." },
    { pro: "Space can stay n² while time is n³, which is the right multiply picture.", con: "People who copy time's order onto space will mis-score multiply." }
  ],

  interviewTips: [
    "For i = 0; i < n; i++: body n, condition n+1. Do not say the header runs n times.",
    "Quote array sum as T = 2n+3 (order n) and S = n+3 (order n).",
    "Matrix add: order n² time and space. Matrix multiply: time n³, space n².",
    "Say order means the degree of the polynomial; you are not using Big-O symbols yet.",
    "Independent of exact coefficients: 2n³+3n²+2n+1 is still order n³.",
    "Trace a tiny n (n=5) once so the n+1 false test is obvious."
  ],

  scene: {
    nodes: [
      { id: "a0", label: "A0", type: "point", pos: [-11, 0, 4], color: "#60a5fa" },
      { id: "a1", label: "A1", type: "point", pos: [-8, 0, 4], color: "#60a5fa" },
      { id: "a2", label: "A2", type: "point", pos: [-5, 0, 4], color: "#60a5fa" },
      { id: "a3", label: "A3", type: "point", pos: [-2, 0, 4], color: "#60a5fa" },
      { id: "a4", label: "A4", type: "point", pos: [1, 0, 4], color: "#60a5fa" },
      { id: "s", label: "s", type: "cache", pos: [-5, 0, 0], color: "#c084fc" },
      { id: "hdr", label: "for: n+1", type: "note", pos: [6, 0, 6], showAt: 1 },
      { id: "body", label: "body: n", type: "note", pos: [6, 0, 3], showAt: 1 },
      { id: "tn", label: "T=2n+3", type: "note", pos: [11, 0, 5], showAt: 2 },
      { id: "sn", label: "S=n+3", type: "note", pos: [11, 0, 2], showAt: 2 },
      { id: "on", label: "order n", type: "note", pos: [11, 0, -1], showAt: 2 },
      { id: "add", label: "C=A+B", type: "worker", pos: [-5, 0, -4], showAt: 3, color: "#4ade80" },
      { id: "n2", label: "order n^2", type: "note", pos: [6, 0, -3], showAt: 3 },
      { id: "mul", label: "C=A*B", type: "worker", pos: [-5, 0, -7], showAt: 4, color: "#fb923c" },
      { id: "n3", label: "T order n^3", type: "note", pos: [6, 0, -6], showAt: 4 },
      { id: "n2s", label: "S order n^2", type: "note", pos: [11, 0, -6], showAt: 4 }
    ],
    edges: [
      { from: "a0", to: "s", showAt: 1 },
      { from: "a1", to: "s", showAt: 1 },
      { from: "a2", to: "s", showAt: 1 },
      { from: "a3", to: "s", showAt: 1 },
      { from: "a4", to: "s", showAt: 1 },
      { from: "hdr", to: "tn", showAt: 2, dashed: true },
      { from: "body", to: "tn", showAt: 2, dashed: true },
      { from: "s", to: "sn", showAt: 2, dashed: true },
      { from: "add", to: "n2", showAt: 3 },
      { from: "mul", to: "n3", showAt: 4 },
      { from: "mul", to: "n2s", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "n = 5 array to sum",
        text: "Five cells. s starts at 0. The loop will walk A0..A4. Frequency count needs how often each line runs, not how the C looks.",
        highlight: ["a0", "a1", "a2", "a3", "a4", "s"]
      },
      {
        title: "Header n+1, body n",
        text: "i < 5 is true five times and false once when i hits 5, so the test is n+1. The add into s runs n times. Pedantic header init+test+inc is 2n+2; degree still 1.",
        highlight: ["hdr", "body", "s", "a4"],
        flows: [
          { from: "a0", to: "s", color: "#60a5fa", label: "+ " },
          { from: "a2", to: "s", color: "#60a5fa", label: "+" },
          { from: "a4", to: "s", color: "#60a5fa", label: "+" }
        ]
      },
      {
        title: "Degree 1 is order n",
        text: "T(n) = 2n+3, S(n) = n+3. Both polynomials have degree 1, so both are order n. Coefficients are dropped on purpose.",
        highlight: ["tn", "sn", "on"]
      },
      {
        title: "Matrix add: two n-loops",
        text: "Nested fors on n×n. Inner body frequency n². T ~ 2n²+n and S = 3n²+3. Degree 2 → order n² for time and space.",
        highlight: ["add", "n2"],
        flows: [
          { from: "add", to: "n2", color: "#4ade80", label: "n^2" }
        ]
      },
      {
        title: "Matrix multiply: three n-loops",
        text: "Innermost statement runs n³ times. T = 2n³+3n²+2n+1 → order n³. Three matrices still occupy order n² words. Time and space orders split.",
        highlight: ["mul", "n3", "n2s"],
        flows: [
          { from: "mul", to: "n3", color: "#fb923c", label: "n^3" }
        ]
      },
      {
        title: "Nesting depth is the degree",
        text: "One n-loop → n. Two nested → n². Three nested → n³. That is the frequency-count shortcut you reuse on every later nested algorithm.",
        highlight: ["on", "n2", "n3", "hdr", "add", "mul"]
      }
    ]
  }
});
