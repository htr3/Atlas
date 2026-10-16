window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 19,
  title: "Recurrence Relation (T(n)= T(n-1) + 1) #1",
  video: "https://www.youtube.com/watch?v=4V30R3I1vLI",
  category: "Divide & Conquer",
  tagline: "Trace test(n), write T(n)=T(n-1)+1, unwind to T(n)=n+1.",
  summary: "A function that prints n and calls itself on n-1 is the first recurrence. Tracing test(3) shows n prints and n+1 calls. The same cost is captured by T(n)=T(n-1)+1 with T(0)=1. Back-substitution k times yields T(n)=T(n-k)+k; set n-k=0 so k=n, hence T(n)=n+1=\u0398(n). Constants in the non-recursive work can be rounded to 1 without changing the class.",

  theory: [
    {
      heading: "Trace first: test(3)",
      body: "The sample procedure <code>test(n)</code> prints n when n &gt; 0, then calls <code>test(n-1)</code>. Call <code>test(3)</code>: print 3, call 2; print 2, call 1; print 1, call 0. At 0 the guard fails and recursion stops. The picture is a <b>tracing tree</b> that is actually a chain: one child per call.",
      bullets: [
        "Prints: 3, then 2, then 1 \u2014 n prints for input n.",
        "Calls: four frames for n = 3, in general n+1 calls (the last is the base).",
        "Major work is the print, one unit per recursive frame."
      ]
    },
    {
      heading: "Cost from the trace",
      body: "Each print is one unit. For input n you print n times, so the work is about n. Counting frames instead, you get n+1 calls; the extra base frame does not print. Either way the class is linear: write \u0398(n), O(n), or \u03a9(n) \u2014 they coincide here. Time tracks the number of calls once you ignore the empty base."
    },
    {
      heading: "Form the recurrence",
      body: "Let <code>T(n)</code> be the time of the procedure on n. The body checks a condition (constant), prints (one unit), and recurses on n-1. So for n &gt; 0, <code>T(n) = T(n-1) + 1</code>. For n = 0 write <code>T(0) = 1</code>, not 0: even an empty return is a constant. Any extra constants (the if plus the print) can be folded into 1; they do not change the solved class.",
      bullets: [
        "Name the function T(n), not F(n) \u2014 course convention.",
        "Recursive call \u2192 T(n-1); non-recursive work \u2192 +1.",
        "Base is a positive constant, usually 1."
      ]
    },
    {
      heading: "Substitution, step by step",
      body: "Unwind: <code>T(n) = T(n-1)+1</code>. Replace T(n-1) by T(n-2)+1 to get <code>T(n) = T(n-2)+2</code>. One more step: <code>T(n) = T(n-3)+3</code>. After k substitutions: <code>T(n) = T(n-k) + k</code>. Stop when the argument hits the known base: set <code>n-k = 0</code>, so <code>k = n</code>. Then <code>T(n) = T(0) + n = 1 + n</code>.",
      bullets: [
        "Pattern after 1, 2, 3 steps: T(n-k)+k.",
        "Assume the chain has reached 0: n-k=0 \u21d2 k=n.",
        "Plug in: T(n)=1+n."
      ]
    },
    {
      heading: "Same answer two ways",
      body: "The tracing tree counted n prints (or n+1 calls). Substitution produced n+1. Both say linear: \u0398(n). This is the first decreasing recurrence: the argument falls by 1 each time, and the extra work per call is constant. Later videos change the +1 to +n, +log n, or add a coefficient in front of T(n-1).",
      bullets: [
        "Tree and substitution must agree; use both on exams.",
        "Class: linear, \u0398(n).",
        "Next: same shape with heavier per-call work."
      ]
    }
  ],

  keyTerms: [
    { term: "Tracing tree", def: "The call chain (or tree) drawn while executing a recursive procedure on a sample n." },
    { term: "Recurrence", def: "T(n) expressed as T(smaller) plus non-recursive work, with a base T(small)." },
    { term: "Back-substitution", def: "Repeatedly replace T(n-1) by its own right-hand side until a pattern in k appears." },
    { term: "Base T(0)=1", def: "Empty work is still a constant; never write T(0)=0 in this course's convention." },
    { term: "Decreasing function", def: "The recursive argument is n-b, here b=1, not n/b." },
    { term: "Fold constants", def: "If+print = 2 can be written +1; the solved \u0398 class does not change." },
    { term: "\u0398(n)", def: "Linear class of T(n)=n+1; O, \u0398, and \u03a9 all apply." }
  ],

  tradeoffs: [
    { pro: "A tiny trace (n=3) already shows n prints and n+1 frames.", con: "Traces do not scale; you still need a closed form for general n." },
    { pro: "Substitution is mechanical: k steps, then n-k=0.", con: "Stopping at the wrong base (n=1 vs n=0) shifts the constant, not the class, but loses marks." },
    { pro: "Rounding extra +2 work to +1 keeps algebra short.", con: "In a theory paper, write the constant c if the examiner wants the exact T(n)." }
  ],

  interviewTips: [
    "Draw the chain for n=3 first, then write T(n)=T(n-1)+1, T(0)=1.",
    "Show three substitutions, then jump to T(n-k)+k; set k=n.",
    "Say T(0)=1, never 0 \u2014 a constant, even if the body is empty.",
    "State the class \u0398(n) after the exact n+1, so objective and theory answers both land.",
    "Constants in the +work can be 1; they do not change the linear class."
  ],

  scene: {
    nodes: [
      { id: "t3", label: "T(3) print 3", type: "point", pos: [0, 0, -6], color: "#60a5fa" },
      { id: "t2", label: "T(2) print 2", type: "point", pos: [0, 0, -2], showAt: 1, color: "#818cf8" },
      { id: "t1", label: "T(1) print 1", type: "point", pos: [0, 0, 2], showAt: 1, color: "#818cf8" },
      { id: "t0", label: "T(0) stop", type: "point", pos: [0, 0, 6], showAt: 1, color: "#4ade80" },
      { id: "e0", label: "T(n)=T(n-1)+1", type: "note", pos: [7, 0, -6] },
      { id: "e1", label: "T(n)=T(n-2)+2", type: "note", pos: [7, 0, -2], showAt: 3 },
      { id: "e2", label: "T(n)=T(n-k)+k", type: "note", pos: [7, 0, 2], showAt: 4 },
      { id: "e3", label: "n-k=0 \u21d2 k=n", type: "note", pos: [7, 0, 5], showAt: 5 },
      { id: "e4", label: "T(n)=n+1 = \u0398(n)", type: "note", pos: [7, 0, 7], showAt: 6 },
      { id: "c0", label: "n prints, n+1 calls", type: "note", pos: [-7, 0, -2], showAt: 2 }
    ],
    edges: [
      { from: "t3", to: "t2", label: "n-1", showAt: 1 },
      { from: "t2", to: "t1", showAt: 1 },
      { from: "t1", to: "t0", showAt: 1 }
    ],
    steps: [
      {
        title: "Write T(n)",
        text: "Print plus one recursive call on n-1. Non-recursive work is one unit. T(n)=T(n-1)+1 for n>0, and T(0)=1.",
        highlight: ["t3", "e0"]
      },
      {
        title: "Trace test(3)",
        text: "Print 3, call 2; print 2, call 1; print 1, call 0. The base frame does not print. A chain, not a branching tree.",
        highlight: ["t3", "t2", "t1", "t0"],
        flows: [
          { from: "t3", to: "t2", color: "#60a5fa", label: "call" },
          { from: "t2", to: "t1", color: "#60a5fa" },
          { from: "t1", to: "t0", color: "#4ade80", label: "stop" }
        ]
      },
      {
        title: "Count the work",
        text: "n prints and n+1 calls. Time follows the number of calls. For n=3 that is already linear; the closed form will confirm \u0398(n).",
        highlight: ["t3", "t2", "t1", "c0"]
      },
      {
        title: "Substitute once",
        text: "T(n-1)=T(n-2)+1, so T(n)=T(n-2)+2. One more replacement gives T(n-3)+3. Do not add the +1 terms into a mess; keep the count of steps.",
        highlight: ["e0", "e1"]
      },
      {
        title: "k steps",
        text: "The pattern is T(n)=T(n-k)+k. That single line is the induction step you write on a theory exam.",
        highlight: ["e2"]
      },
      {
        title: "Hit the base",
        text: "You know T(0). Set n-k=0, hence k=n. The chain of decreasing arguments has reached the constant case.",
        highlight: ["t0", "e3"]
      },
      {
        title: "Closed form \u0398(n)",
        text: "T(n)=T(0)+n=1+n. Same as the trace. Class: linear, \u0398(n). Tree and substitution agree.",
        highlight: ["e4", "c0", "t0"]
      }
    ]
  }
});
