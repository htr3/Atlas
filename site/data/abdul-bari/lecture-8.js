window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 8,
  title: "1.5.3 Time Complexity of While and if #3",
  video: "https://www.youtube.com/watch?v=p1EnSvS3urU",
  category: "Algorithm Foundations",
  tagline: "Pascal for is n; C for and while need a trace. if can split best and worst.",
  summary: "Old Pascal for i := 1 to n (optional step) is always linear, so books could say order n on sight. A while (and C for, which can put anything in init/cond/update) must be studied until you know when the condition dies. do-while runs at least once; Pascal repeat-until continues while the condition is false. Subtractive GCD is order 1 best and order n worst. An if with a short true branch and a looping else creates best/worst — but only if the branches actually differ.",

  theory: [
    {
      heading: "Old for was always linear; while was not",
      body: "Classic Pascal <code>for i := 1 to n do</code> walks i through a range, plus one per step (or plus two with <code>step 2</code>). That header cannot multiply i. Analysis is blind: order n (or n/2). A while only says continue while a condition holds. The class might be n, log n, √n, or something else. You must read the body, invent k if needed, and solve. In old textbooks the for/while split is that sharp.",
      bullets: [
        "Pascal for: incrementing range → order n.",
        "while: unknown until you know the exit.",
        "step 2 still linear; it does not become a log."
      ]
    },
    {
      heading: "do-while versus repeat-until",
      body: "C <code>do-while</code> is post-test: the body runs, then the condition is checked, so the body runs <b>at least once</b> even if the condition is already false. Older <code>repeat … until cond</code> is also post-test and also at least once, but the polarity flips: it keeps going <i>while the condition is false</i> and stops when the condition becomes true (English: repeat until this happens). Polarity is the only extra fact; both still need a trace for how many times.",
      bullets: [
        "do-while: while true; minimum one.",
        "repeat-until: until true (i.e. while false); minimum one.",
        "for and while may run zero times if the test fails up front."
      ]
    },
    {
      heading: "C for is a while in disguise",
      body: "C lets you put any init, any condition, any update in a for. You can multiply the counter, add a second variable, or leave the update empty. That for is not the Pascal range loop. Translate it to a while and study it. A while that only does i++ while i < n is the familiar 3n+2 function, order n — same as the C for you already counted as n+1 on the test plus n on the body. The lecture's point: C for and while express the same loops; the analysis method is the while method.",
      bullets: [
        "C for can ×2 the index — treat it as while.",
        "Exact 3n+2 versus 2n+1 does not change order n.",
        "Termination still has to be finite; that is on you."
      ]
    },
    {
      heading: "Worked whiles: log n and √n",
      body: "while a < b with a ← 2a, a starting at 1: after k passes a = 2^k, stop when 2^k ≥ b, so k = log₂ b. Rename b as n and you have order log n. The same loop as a C for with a *= 2. while k < n with k ← k+i and i++ is the triangular sum again: k ≈ m(m+1)/2 after m passes, exit when that ≥ n, m ≈ √n. Readable as while; cramped as a for with two inits and two updates. Prefer the while on paper.",
      bullets: [
        "a *= 2 until a ≥ b → log b.",
        "k += i, i++ until k ≥ n → √n.",
        "Same families as the for-loop lectures, new wrapper."
      ]
    },
    {
      heading: "Subtractive GCD: best 1, worst n",
      body: "while m ≠ n, subtract the smaller from the larger (the subtraction Euclidean algorithm). Trace: (6,3) becomes (3,3) in one pass. (5,5) never enters — zero passes. (16,2) subtracts 2 seven times (14,12,10,8,6,4,2) — about n/2. Minimum is order 1 (already equal, or one subtract). Maximum is order n. You cannot quote a single order without saying best versus worst. Other GCD methods exist; this one is the slow subtraction form.",
      bullets: [
        "Equal inputs: 0 iterations, order 1.",
        "16 and 2: seven subtracts ≈ n/2, order n.",
        "Best order 1, worst order n."
      ]
    },
    {
      heading: "if does not automatically mean two cases",
      body: "A dummy algorithm: if n < 5 print n (one statement, order 1), else a loop of n (order n). Then the condition creates a <b>best case</b> and a <b>worst case</b>. Change the true branch so both sides loop n times, or drop the else, and the split vanishes. There is no rule if ⇒ best/worst. Read both branches. Only a real difference in work creates two answers.",
      bullets: [
        "Different branch costs → best and worst.",
        "Same cost on both sides → one order.",
        "if is not a formula; it is a fork you must measure."
      ]
    }
  ],

  keyTerms: [
    { term: "Pascal for", def: "Range loop that only steps by a constant; order n on sight." },
    { term: "while analysis", def: "Study the condition until you can name k; do not write n by default." },
    { term: "do-while", def: "Post-test loop; body runs at least once, continues while the condition is true." },
    { term: "repeat-until", def: "Post-test loop that continues while the condition is false and stops when it becomes true." },
    { term: "Subtractive GCD", def: "Replace the larger by larger−smaller until equal; best order 1, worst order n." },
    { term: "Best / worst", def: "Two orders when input or a branch changes how much work runs; not automatic with every if." },
    { term: "C for", def: "General init/cond/update; analyze it as a while unless it is plainly linear." }
  ],

  tradeoffs: [
    { pro: "Pascal-style for lets you answer order n without a trace.", con: "C for with a *= 2 is log n; treating every for as n is wrong in C." },
    { pro: "while is honest: you only claim n after you prove the exit.", con: "It is slower to grade and easier to mis-count k." },
    { pro: "Best/worst on GCD and on uneven if-branches is the accurate report.", con: "Inventing two cases for every if wastes the answer and is often false." }
  ],

  interviewTips: [
    "If the language's for is a range loop, order n. If it is C for, read it as while.",
    "do-while minimum one; while minimum zero. repeat-until stops when the condition becomes true.",
    "a *= 2 while a < b → log b. k += i until k ≥ n → √n. Same algebra as the for lectures.",
    "GCD by subtraction: (5,5) is 0 loops; (16,2) is ~n/2. Say best order 1, worst order n.",
    "Only report best/worst for if when the two branches actually cost different orders.",
    "Exact 3n+2 versus 2n+1 is irrelevant once you want order n; still write it if the paper asks for T(n)."
  ],

  scene: {
    nodes: [
      { id: "pfor", label: "for 1 to n", type: "queue", pos: [-10, 0, 5], color: "#60a5fa" },
      { id: "wh", label: "while cond", type: "queue", pos: [-10, 0, 0], color: "#c084fc" },
      { id: "dw", label: "do-while", type: "queue", pos: [-10, 0, -5], color: "#fb923c" },
      { id: "on", label: "order n", type: "note", pos: [-2, 0, 5], showAt: 1 },
      { id: "any", label: "n / log / √n", type: "note", pos: [-2, 0, 0], showAt: 1 },
      { id: "min1", label: "min 1 time", type: "note", pos: [-2, 0, -5], showAt: 2 },
      { id: "until", label: "until true", type: "note", pos: [4, 0, -5], showAt: 2 },
      { id: "a2", label: "a *= 2", type: "worker", pos: [4, 0, 5], showAt: 3, color: "#60a5fa" },
      { id: "log", label: "log n", type: "note", pos: [10, 0, 5], showAt: 3 },
      { id: "g6", label: "6,3 -> 1", type: "point", pos: [4, 0, 2], showAt: 4, color: "#4ade80" },
      { id: "g5", label: "5,5 -> 0", type: "point", pos: [4, 0, -1], showAt: 4, color: "#4ade80" },
      { id: "g16", label: "16,2 -> 7", type: "point", pos: [10, 0, 0], showAt: 4, color: "#f87171" },
      { id: "best", label: "best 1", type: "note", pos: [10, 0, 3], showAt: 5 },
      { id: "worst", label: "worst n", type: "note", pos: [10, 0, -3], showAt: 5 },
      { id: "iff", label: "if n<5", type: "service", pos: [4, 0, -8], showAt: 6 },
      { id: "br", label: "1 vs n", type: "note", pos: [10, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "pfor", to: "on", showAt: 1 },
      { from: "wh", to: "any", showAt: 1 },
      { from: "dw", to: "min1", showAt: 2 },
      { from: "dw", to: "until", showAt: 2, dashed: true },
      { from: "wh", to: "a2", showAt: 3, dashed: true },
      { from: "a2", to: "log", showAt: 3 },
      { from: "g6", to: "best", showAt: 5, dashed: true },
      { from: "g5", to: "best", showAt: 5, dashed: true },
      { from: "g16", to: "worst", showAt: 5 },
      { from: "iff", to: "br", showAt: 6 }
    ],
    steps: [
      {
        title: "Range for versus while",
        text: "Pascal for 1 to n (or step 2) is order n on sight. A while has no built-in stride; the class is whatever the condition allows. Trace it.",
        highlight: ["pfor", "wh"],
        flows: [
          { from: "pfor", to: "on", color: "#60a5fa", label: "n" },
          { from: "wh", to: "any", color: "#c084fc", label: "?" }
        ]
      },
      {
        title: "Post-test loops",
        text: "do-while runs the body at least once, then continues while true. repeat-until also min-1, but it continues while false and stops when the condition becomes true.",
        highlight: ["dw", "min1", "until"]
      },
      {
        title: "Same families inside while",
        text: "while a < b with a *= 2 is log b (call b n). C for with the same pieces is the same loop. k += i until k ≥ n is √n. Prefer the while on the page.",
        highlight: ["wh", "a2", "log", "any"],
        flows: [
          { from: "a2", to: "log", color: "#60a5fa", label: "k" }
        ]
      },
      {
        title: "Trace subtractive GCD",
        text: "(6,3) subtracts once. (5,5) never enters. (16,2) subtracts seven times — 16/2. Iteration count depends on the pair, not on a for-header.",
        highlight: ["g6", "g5", "g16"],
        fail: ["g16"]
      },
      {
        title: "Best 1, worst n",
        text: "Minimum work is order 1. Maximum is about n/2, hence order n. Quote both. Other GCD algorithms exist; this one is the subtraction procedure.",
        highlight: ["best", "worst", "g5", "g16"]
      },
      {
        title: "if only if the branches differ",
        text: "if n < 5 print (order 1) else loop n (order n) really is best/worst. If both sides do the same work, there is no split. if is not a rule; it is a fork you measure.",
        highlight: ["iff", "br", "best", "worst"]
      }
    ]
  }
});
