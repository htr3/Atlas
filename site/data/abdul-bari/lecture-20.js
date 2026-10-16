window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 20,
  title: "Recurrence Relation (T(n)= T(n-1) + n) #2",
  video: "https://www.youtube.com/watch?v=IawM82BQ4II",
  category: "Divide & Conquer",
  tagline: "A loop of n plus T(n-1) sums 1..n and lands on \u0398(n\u00b2).",
  summary: "A recursive call on n-1 plus an n-iteration loop is a decreasing recurrence whose extra work is linear, not constant. Round 2n+2 to n and write T(n)=T(n-1)+n, T(0)=1. The recursion tree is a chain of costs n+(n-1)+\u2026+1=n(n+1)/2. Substitution produces the same sum if you refuse to collapse n+(n-1) into 2n-1. Both methods give \u0398(n\u00b2). Theory exams want the steps; objective tests want the class.",

  theory: [
    {
      heading: "From code to T(n), then round",
      body: "The procedure calls itself on n-1 and then runs a loop whose body is \u0398(1) for n iterations. Counting pedantically: condition + loop overhead + body \u2248 2n+2 plus T(n-1). That form is ugly to unwind. Take the asymptotic class of the non-recursive part \u2014 it is linear \u2014 and write <code>T(n) = T(n-1) + n</code> for n &gt; 0, <code>T(0) = 1</code>. Degree of the added polynomial is what matters.",
      bullets: [
        "Loop n times \u2192 +n (or +2n+2, then round to n).",
        "One recursive call on n-1 \u2192 T(n-1).",
        "Base n=0 is a constant 1."
      ]
    },
    {
      heading: "Recursion tree: a chain of falling costs",
      body: "Unlike a print of one unit, each frame now spends time equal to the current argument. Root pays n and calls n-1. That frame pays n-1 and calls n-2. Continue to T(2) paying 2, T(1) paying 1, T(0) paying 0 (or 1). Total: <code>n + (n-1) + \u2026 + 2 + 1</code> (plus a constant for T(0)). That is the triangular number <code>n(n+1)/2</code>, which is \u0398(n\u00b2).",
      bullets: [
        "One child per node: decreasing, not dividing.",
        "Level costs: n, n-1, \u2026, 1.",
        "Sum of first n naturals = n(n+1)/2."
      ]
    },
    {
      heading: "Do not fold the summands",
      body: "Substitution: T(n)=T(n-1)+n, and T(n-1)=T(n-2)+(n-1), so T(n)=T(n-2)+(n-1)+n. After another step: T(n)=T(n-3)+(n-2)+(n-1)+n. <b>Do not add</b> those into 2n-1. A collapsed polynomial hides the sequence you need to recognize. Leave the terms written out until you see 1+2+\u2026+n.",
      bullets: [
        "After k steps: T(n)=T(n-k)+(n-k+1)+\u2026+n.",
        "Set n-k=0 \u21d2 k=n, then T(0)+1+2+\u2026+n.",
        "T(0)=1 plus n(n+1)/2 \u2248 \u0398(n\u00b2)."
      ]
    },
    {
      heading: "Tree vs substitution",
      body: "The tree stacks the same numbers vertically; substitution writes them horizontally. Both are 1+\u2026+n. Substitution keeps an extra +1 from T(0) because it counts the base frame; the tree of loop bodies may omit it. Either way the leading term is n\u00b2/2, so \u0398(n\u00b2)."
    },
    {
      heading: "Exam mode",
      body: "On a theory paper, write the substitutions, the k-form, n-k=0, the triangular sum, then \u0398(n\u00b2). On an objective paper you only need the class. A later shortcut: for T(n)=T(n-1)+f(n) with no coefficient in front of T, the answer is about n\u00b7f(n). Here f(n)=n so n\u00b7n=n\u00b2. That shortcut is previewed; Master's theorem for decreasing functions makes it official.",
      bullets: [
        "Essay: show the sum. MCQ: n\u00b2.",
        "Practice a few recurrences until the jump to n\u00b2 is immediate.",
        "Next video: f(n)=log n, product n log n."
      ]
    }
  ],

  keyTerms: [
    { term: "Decreasing recurrence", def: "T(n) in terms of T(n-b), here b=1, plus extra work f(n)." },
    { term: "Rounded work", def: "Replace 2n+2 by n; keep the degree of the polynomial extra cost." },
    { term: "Triangular number", def: "1+2+\u2026+n = n(n+1)/2, the exact sum of this tree." },
    { term: "Recursion tree", def: "Each node shows non-recursive cost; children are the recursive calls." },
    { term: "Keep the sequence", def: "Write n+(n-1)+\u2026, never 2n-1, so the closed form is visible." },
    { term: "\u0398(n\u00b2)", def: "Quadratic class of T(n)=T(n-1)+n." },
    { term: "n\u00b7f(n) hint", def: "For a=1 decreasing recurrences, multiply the extra work by n." }
  ],

  tradeoffs: [
    { pro: "Rounding 2n+2 to n makes substitution readable.", con: "An examiner who wants the exact T(n) may want the 2n+2 kept until the end." },
    { pro: "The tree is a single path, easy to sum.", con: "Branching recurrences (2 T(n-1)) need a geometric series, not a triangle." },
    { pro: "Tree and substitution cross-check the same n(n+1)/2.", con: "Adding summands too early makes the pattern unrecognizable." }
  ],

  interviewTips: [
    "Form T(n)=T(n-1)+n from the loop; say you rounded 2n+2 to n.",
    "Draw costs n, n-1, \u2026, 1 on a chain; sum as n(n+1)/2.",
    "In substitution, never combine n+(n-1) into 2n-1.",
    "Set n-k=0, then 1+\u2026+n plus T(0)=1, conclude \u0398(n\u00b2).",
    "MCQ shortcut: extra work n, repeated n times \u2192 n\u00b2.",
    "Theory vs objective: steps on one, class on the other."
  ],

  scene: {
    nodes: [
      { id: "cN", label: "n", type: "point", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "cN1", label: "n-1", type: "point", pos: [0, 0, -3], showAt: 1, color: "#818cf8" },
      { id: "cN2", label: "n-2", type: "point", pos: [0, 0, 0], showAt: 1, color: "#818cf8" },
      { id: "c2", label: "2", type: "point", pos: [0, 0, 3], showAt: 2, color: "#818cf8" },
      { id: "c1", label: "1", type: "point", pos: [0, 0, 6], showAt: 2, color: "#4ade80" },
      { id: "e0", label: "T(n)=T(n-1)+n", type: "note", pos: [7, 0, -6] },
      { id: "e1", label: "round 2n+2 \u2192 n", type: "note", pos: [-7, 0, -6] },
      { id: "e2", label: "keep n+(n-1)+\u2026", type: "note", pos: [7, 0, -2], showAt: 3 },
      { id: "e3", label: "n-k=0 \u21d2 k=n", type: "note", pos: [7, 0, 2], showAt: 4 },
      { id: "e4", label: "sum = n(n+1)/2", type: "note", pos: [7, 0, 5], showAt: 5 },
      { id: "e5", label: "\u0398(n\u00b2)", type: "note", pos: [7, 0, 7], showAt: 6 }
    ],
    edges: [
      { from: "cN", to: "cN1", label: "n-1", showAt: 1 },
      { from: "cN1", to: "cN2", showAt: 1 },
      { from: "cN2", to: "c2", showAt: 2, dashed: true },
      { from: "c2", to: "c1", showAt: 2 }
    ],
    steps: [
      {
        title: "Round the loop to +n",
        text: "Call T(n-1), then a loop of n. Exact extras look like 2n+2. Write T(n)=T(n-1)+n, T(0)=1. Degree one extra work is enough.",
        highlight: ["cN", "e0", "e1"]
      },
      {
        title: "Chain of costs",
        text: "Root pays n and calls n-1. Next pays n-1 and calls n-2. One child per node. This is a decreasing chain, not a divide-by-two tree.",
        highlight: ["cN", "cN1", "cN2"],
        flows: [
          { from: "cN", to: "cN1", color: "#60a5fa", label: "call" }
        ]
      },
      {
        title: "Down to 1",
        text: "Continue until T(1) pays 1 and T(0) stops. Level costs are n, n-1, \u2026, 2, 1. Sum them all for T(n).",
        highlight: ["c2", "c1", "cN"]
      },
      {
        title: "Substitute without folding",
        text: "T(n)=T(n-2)+(n-1)+n. After three steps the tail is n-2, n-1, n. Leave the sequence; do not write 2n-1.",
        highlight: ["e0", "e2"]
      },
      {
        title: "k steps to the base",
        text: "T(n)=T(n-k)+(n-k+1)+\u2026+n. Assume n-k=0 so k=n. Same stop as the previous lecture, different extra terms.",
        highlight: ["e3", "c1"]
      },
      {
        title: "Triangular sum",
        text: "T(0)+1+2+\u2026+n = 1 + n(n+1)/2. The tree summed the same numbers vertically.",
        highlight: ["e4", "cN", "c1"]
      },
      {
        title: "Class \u0398(n\u00b2)",
        text: "Leading term n\u00b2/2. Answer \u0398(n\u00b2). Essay wants the sum; MCQ wants n\u00b2. Shortcut preview: n times f(n)=n.",
        highlight: ["e5", "e4"]
      }
    ]
  }
});
