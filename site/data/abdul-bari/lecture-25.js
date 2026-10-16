window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 25,
  title: "Recurrence Relation Dividing [ T(n)=T(n/2)+ n] #2",
  video: "https://www.youtube.com/watch?v=XcZw01FuH18",
  category: "Divide & Conquer",
  tagline: "One call on n/2 plus linear work sums a geometric  n(1+1/2+1/4+\u2026) = \u0398(n).",
  summary: "Dividing recurrences halve the argument instead of subtracting. For T(n)=T(n/2)+n the tree is still a chain, but costs are n, n/2, n/4, \u2026, n/2^k. Factor n out: n(1+1/2+1/4+\u2026). That inner GP is at most 1 (half-circle + quarter + \u2026 fills one circle), so T(n)=\u0398(n). The stop condition is n/2^k=1, hence k=log n \u2014 log levels, but shrinking costs, so not n log n. Substitution writes the same series horizontally.",

  theory: [
    {
      heading: "Dividing, not decreasing",
      body: "No algorithm is shown; the recurrence is given: <code>T(n) = T(n/2) + n</code>. One subproblem of half the size, plus linear non-recursive work. The smallest size we stop at is n=1 (not 0): dividing by 2 never cleanly hits 0, and T(0) would collapse the tree to nothing. Write T(1)=1.",
      bullets: [
        "Argument n/2, not n-1.",
        "Base n=1, T(1)=1.",
        "One child: a chain of halved sizes."
      ]
    },
    {
      heading: "Tree costs n, n/2, n/4, \u2026",
      body: "Root pays n and calls n/2. That frame pays n/2 and calls n/4. After k steps the argument is n/2^k. Assume that has become 1: <code>n/2^k = 1</code> \u21d2 <code>n = 2^k</code> \u21d2 <code>k = log_2 n</code>. Sum of costs: n + n/2 + n/4 + \u2026 + n/2^k.",
      bullets: [
        "k = log n levels, not n levels.",
        "Costs shrink geometrically.",
        "Last term \u2248 n/2^k \u2248 1."
      ]
    },
    {
      heading: "Factor n; the leftover is \u2264 1",
      body: "n(1 + 1/2 + 1/4 + \u2026 + 1/2^k) = n \u03a3_{i=0..k} (1/2)^i. The infinite GP \u03a3 (1/2)^i equals 2, and the lecture's circle picture treats 1/2+1/4+1/8+\u2026 as filling one unit, so the whole parenthesis is a constant (they round the tail to 1 and write T(n)\u2248 n\u00b71). Either bound \u2014 constant 2 or constant 1 \u2014 is \u0398(n). Linear work at the root already dominates the shrinking children.",
      bullets: [
        "\u03a3 (1/2)^i converges to a constant.",
        "Circle: half + quarter + eighth + \u2026 = 1.",
        "n times a constant is \u0398(n)."
      ]
    },
    {
      heading: "Substitution, same series sideways",
      body: "T(n)=T(n/2)+n. T(n/2)=T(n/4)+n/2, so T(n)=T(n/4)+n/2+n. After k steps: T(n)=T(n/2^k)+n/2^{k-1}+\u2026+n/2+n. Set n/2^k=1, k=log n, T(1) plus n times the same GP. You get 1+2n in the lecture's rounding, still \u0398(n). Tree stacked the terms vertically; substitution listed them left to right.",
      bullets: [
        "Do not need a new algebra \u2014 same GP.",
        "Stop at 1, k=log n.",
        "T(1)+n(1+1/2+\u2026) = \u0398(n)."
      ]
    },
    {
      heading: "Why not n log n",
      body: "There are log n levels, so a student who multiplies (level count)\u00d7(root cost) writes n log n and is wrong. That product assumes every level costs n. Here later levels cost n/2, n/4, \u2026 so the sum is a GP dominated by the first term. The n log n shape appears when <i>every</i> level costs n, which is the next video: 2T(n/2)+n.",
      bullets: [
        "log n levels \u00d7 shrinking costs \u2192 \u0398(n).",
        "log n levels \u00d7 equal costs n \u2192 \u0398(n log n).",
        "Always sum the level costs; do not assume they are equal."
      ]
    }
  ],

  keyTerms: [
    { term: "Dividing recurrence", def: "T(n) in terms of T(n/b), here b=2, plus extra work f(n)." },
    { term: "Base n=1", def: "Halving stops at 1; using 0 makes the last arguments vanish." },
    { term: "n/2^k=1", def: "Stop condition; k=log_2 n is the depth." },
    { term: "Geometric costs", def: "n, n/2, n/4, \u2026 \u2014 ratio 1/2." },
    { term: "Circle picture", def: "1/2+1/4+1/8+\u2026 fills one unit, so n\u00b7(constant)=\u0398(n)." },
    { term: "\u0398(n)", def: "Class of T(n)=T(n/2)+n; root work dominates." },
    { term: "Level-sum test", def: "Multiply depth by root cost only if every level costs the same." }
  ],

  tradeoffs: [
    { pro: "One subproblem keeps the drawing a chain; easy GP.", con: "Two subproblems (next lecture) need a full binary tree and a different sum." },
    { pro: "Circle analogy makes \u03a3 1/2^i = 1 memorable.", con: "The exact infinite sum is 2, not 1; both are \u0398(n), but be ready for either constant." },
    { pro: "k=log n is the right depth for all n/2 recurrences.", con: "Depth log n does not imply T(n)=n log n unless levels cost n each." }
  ],

  interviewTips: [
    "State T(n)=T(n/2)+n, base T(1)=1, stop n/2^k=1 so k=log n.",
    "Write costs n+n/2+n/4+\u2026, factor n, bound the GP by a constant.",
    "Say \u0398(n): the root already pays n, children pay less.",
    "Do not answer n log n \u2014 levels do not all cost n.",
    "Substitution is the same GP written horizontally.",
    "Preview: 2T(n/2)+n is the equal-level-cost case, \u0398(n log n)."
  ],

  scene: {
    nodes: [
      { id: "n", label: "n", type: "point", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "n2", label: "n/2", type: "point", pos: [0, 0, -2], showAt: 1, color: "#818cf8" },
      { id: "n4", label: "n/4", type: "point", pos: [0, 0, 2], showAt: 2, color: "#818cf8" },
      { id: "n8", label: "n/2^k \u21921", type: "point", pos: [0, 0, 6], showAt: 3, color: "#4ade80" },
      { id: "e0", label: "T(n)=T(n/2)+n", type: "note", pos: [-8, 0, -6] },
      { id: "e1", label: "k=log n", type: "note", pos: [8, 0, -6], showAt: 3 },
      { id: "e2", label: "n(1+1/2+1/4+\u2026)", type: "note", pos: [8, 0, -2], showAt: 4 },
      { id: "e3", label: "GP \u2248 1 (circle)", type: "note", pos: [8, 0, 2], showAt: 5 },
      { id: "e4", label: "T(n)=\u0398(n)", type: "note", pos: [8, 0, 6], showAt: 6 },
      { id: "warn", label: "not n log n", type: "note", pos: [-8, 0, 6], showAt: 6 }
    ],
    edges: [
      { from: "n", to: "n2", label: "n/2", showAt: 1 },
      { from: "n2", to: "n4", showAt: 2 },
      { from: "n4", to: "n8", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "Dividing form",
        text: "T(n)=T(n/2)+n. One half-size subproblem plus linear work. Base is n=1, not 0 \u2014 halving never lands on zero.",
        highlight: ["n", "e0"]
      },
      {
        title: "Pay n, call n/2",
        text: "Root cost n. The child is a chain, not a binary tree. Next cost will be n/2, then n/4.",
        highlight: ["n", "n2"],
        flows: [
          { from: "n", to: "n2", color: "#60a5fa", label: "n/2" }
        ]
      },
      {
        title: "Halve again",
        text: "n/4, then n/8, \u2026 Geometric shrink. Still one node per level.",
        highlight: ["n2", "n4"],
        flows: [
          { from: "n2", to: "n4", color: "#818cf8" }
        ]
      },
      {
        title: "Stop at 1",
        text: "n/2^k=1 \u21d2 k=log n. Depth is logarithmic, like binary search's recursion depth \u2014 but costs here start at n.",
        highlight: ["n8", "e1"]
      },
      {
        title: "Factor n",
        text: "Sum = n + n/2 + n/4 + \u2026 = n(1+1/2+1/4+\u2026). Substitution writes the same terms in a row.",
        highlight: ["e2", "n", "n2", "n4"]
      },
      {
        title: "Circle fills to 1",
        text: "Half + quarter + eighth + \u2026 fills one circle. The parenthesis is a constant. n times a constant is linear.",
        highlight: ["e3", "e2"]
      },
      {
        title: "\u0398(n), not n log n",
        text: "Root already pays n; later levels pay less. Equal level costs would be 2T(n/2)+n, next lecture, \u0398(n log n).",
        highlight: ["e4", "warn"]
      }
    ]
  }
});
