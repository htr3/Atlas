window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 78,
  title: "Asymptotic Notations - Simplified",
  video: "https://www.youtube.com/watch?v=ddsP7NecEBk",
  category: "Strings, Trees & Arrays",
  tagline: "Frequency-count the polynomial, then read O, Ω, and Θ off the standard complexity ladder.",
  summary: "Count how often each statement runs to get a polynomial T(n). The highest-degree term names the class: constant, log n, linear, n log n, quadratic, cubic, exponential. On the ladder of those known classes, everything ≥ that term is an upper bound (Big-O), everything ≤ it is a lower bound (Ω), and the matching term is the tight bound (Θ). Formal O/Ω use constants c and n₀. n! is O(n^n) and Ω(1) (or Ω(n log n)) but has no Θ among the usual ladder.",

  theory: [
    {
      heading: "Frequency count → a polynomial",
      body: "Asymptotic notation names the time of an algorithm after you have already counted statements. One assignment: T(n)=1, <b>constant</b>. A for-loop 1..n plus a couple of bookkeeping statements: (n+1)+n+1+… = 2n+3, highest degree n, <b>linear</b>. Nested loops: 2n²+2n+1, <b>quadratic</b>. Matrix multiply's triple loop: 2n³+3n²+2n+1, <b>cubic</b>. Binary search halves [i,j] each time: 3 log n + 2, <b>logarithmic</b>. A recurrence T(n)=2T(n−1)+1 solves to Θ(2^n), <b>exponential</b>. Real algorithms land on one of these classes or a product of them.",
      bullets: [
        "Loop 1..n runs the header n+1 times (the failing test).",
        "Drop coefficients and lower terms; keep the highest degree.",
        "The lecture's ladder in increasing order: 1, log n, n, n log n, n², n³, 2^n."
      ]
    },
    {
      heading: "Upper, lower, and tight on that ladder",
      body: "Suppose analysis gave f(n)=2n²+3n+2. Highest term n². Every standard class <b>at least n²</b> (n², n³, 2^n, …) is an <b>upper bound</b>: f(n) is O(n²), and also O(n³) and O(2^n) — all true. Every class <b>at most n²</b> (n², n, log n, 1) is a <b>lower bound</b>: f is Ω(n²), Ω(n), Ω(log n). When the same class is both O and Ω, it is <b>Θ</b>: f(n)=Θ(n²). The lecture's shortcut: look only at the known list sorted by growth, not at arbitrary wild functions.",
      bullets: [
        "Big-O = upper bound (can be loose).",
        "Ω = lower bound (can be loose).",
        "Θ = tight: the unique ladder class that is both."
      ]
    },
    {
      heading: "Linear example n+5",
      body: "Highest degree n. Upper bounds: O(n), O(n log n), O(n²), O(n³), O(2^n). Lower bounds: Ω(n), Ω(log n), Ω(1). Tight: Θ(n). Writing only O(2^n) is correct and almost useless; interviewers want the tight class unless they ask for any valid O.",
      bullets: [
        "O is not 'exactly'; it is 'no worse than'.",
        "Prefer the smallest true O / largest true Ω, i.e. Θ.",
        "Constants in 2n+3 never change the ladder rung."
      ]
    },
    {
      heading: "Formal Big-O and Ω",
      body: "f(n)=O(g(n)) iff there exist positive constants c and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀. For f=2n²+3n+1, replace every term by n²: 2n²+3n²+n²=6n², so f(n) ≤ 6n² from some n₀ onward ⇒ O(n²) with c=6. The same f is ≤ 6·2^n eventually, so it is also O(2^n). Ω flips the inequality: f(n) ≥ c·g(n) for n ≥ n₀. Dropping to n²: 2n²+3n+1 ≥ 1·n², so Ω(n²). Matching O and Ω give Θ(n²). The lecture skips writing Θ's formal sandwich (c₁g ≤ f ≤ c₂g) and treats it as 'O and Ω of the same g'.",
      bullets: [
        "c and n₀ must be positive constants, independent of n.",
        "You only need the inequality from some n₀ on, not at n=1.",
        "Proving O(n²) by inflating to 6n² is the standard hand proof."
      ]
    },
    {
      heading: "n! has O and Ω but no tight ladder class",
      body: "n! = n(n−1)…1 is not on the list. Upper: replace every factor by n ⇒ n^n, so n! = O(n^n). Lower: replace every factor by 1 ⇒ n! = Ω(1). You may also keep log n in each factor and get Ω((log n)^n) wait — the lecture writes n copies of log n as Ω(n log n), and also Ω(n). None of those lower bounds equals n^n, so <b>there is no Θ</b> for n! among the usual classes. Some functions simply do not have a tight bound on that ladder. Polynomials like 2n²+3n+1 do.",
      bullets: [
        "n! = O(n^n) and Ω(1); also Ω(n) and Ω(n log n) in the lecture's substitutions.",
        "O-class ≠ Ω-class ⇒ no Θ on the standard list.",
        "Do not invent Θ(n!) unless the problem allows n! as g(n)."
      ]
    }
  ],

  keyTerms: [
    { term: "Frequency count", def: "How many times each statement executes; the sum is T(n), usually a polynomial." },
    { term: "Big-O", def: "Upper bound: f(n) ≤ c g(n) for n ≥ n₀. May be loose (n² is O(2^n))." },
    { term: "Omega (Ω)", def: "Lower bound: f(n) ≥ c g(n) for n ≥ n₀." },
    { term: "Theta (Θ)", def: "Tight bound: the same g is both O and Ω of f." },
    { term: "Complexity ladder", def: "1 < log n < n < n log n < n² < n³ < 2^n (the lecture's increasing order)." },
    { term: "n₀ and c", def: "Positive constants in the formal definition; the inequality need not hold for tiny n." },
    { term: "No tight bound", def: "When a valid O-class and Ω-class disagree (as with n! vs n^n and 1)." }
  ],

  tradeoffs: [
    { pro: "Reading the highest degree of a polynomial is enough for the usual exam classes.", con: "Loose O (saying O(2^n) for quadratic code) is true and hides the real cost." },
    { pro: "One ladder lets you answer O/Ω/Θ without drawing graphs.", con: "Functions like n! sit off the ladder; you must build g(n) by bounding the product." },
    { pro: "Formal c,n₀ proofs are short: inflate (O) or drop (Ω) terms.", con: "Forgetting that O(n²) and O(n³) can both be true is a common MCQ trap." }
  ],

  interviewTips: [
    "Count frequencies first (n+1 on the for-header), then name the highest degree.",
    "Recite: classes ≥ that degree are O, classes ≤ it are Ω, the match is Θ.",
    "Prove 2n²+3n+1 = O(n²) with c=6 by replacing n and 1 with n².",
    "Say n² is O(n³) and O(2^n) — all true — then give Θ(n²) as the useful answer.",
    "For n!: O(n^n) by n·n·…·n, Ω(1) by 1·1·…·1, and 'no Θ on the standard list'.",
    "Binary search: 3 log n + 2 is Θ(log n), not Θ(n), even though the array has n cells."
  ],

  scene: {
    nodes: [
      { id: "c1", label: "1", type: "point", pos: [-10, 0, 0], color: "#4ade80" },
      { id: "clog", label: "log n", type: "point", pos: [-6.5, 0, 0], color: "#4ade80" },
      { id: "cn", label: "n", type: "point", pos: [-3, 0, 0], color: "#60a5fa" },
      { id: "cnl", label: "n log n", type: "point", pos: [0.5, 0, 0], color: "#60a5fa" },
      { id: "cn2", label: "n^2", type: "point", pos: [4, 0, 0], color: "#fb923c" },
      { id: "cn3", label: "n^3", type: "point", pos: [7.5, 0, 0], color: "#c084fc" },
      { id: "cexp", label: "2^n", type: "point", pos: [11, 0, 0], color: "#f87171" },
      { id: "poly", label: "f=2n^2+3n+1", type: "server", pos: [4, 0, -5] },
      { id: "fact", label: "n!", type: "worker", pos: [-3, 0, 5], showAt: 4 },
      { id: "nn", label: "n^n", type: "cache", pos: [4, 0, 5], showAt: 4 },
      { id: "n0", label: "Count statements -> polynomial", type: "note", pos: [-8, 3, -7] },
      { id: "n1", label: "O: n^2, n^3, 2^n  (upper)", type: "note", pos: [8, 3, -7], showAt: 1 },
      { id: "n2", label: "Omega: n^2, n, log n, 1", type: "note", pos: [-8, 3, 7], showAt: 2 },
      { id: "n3", label: "Theta(n^2)  both O and Omega", type: "note", pos: [8, 3, 7], showAt: 3 },
      { id: "n4", label: "f ≤ 6 n^2   c=6, n≥n0", type: "note", pos: [0, 3, -7], showAt: 1 },
      { id: "n5", label: "n! = O(n^n), Omega(1); no Theta", type: "note", pos: [8, 3, 2], showAt: 5 }
    ],
    edges: [
      { from: "c1", to: "clog" },
      { from: "clog", to: "cn" },
      { from: "cn", to: "cnl" },
      { from: "cnl", to: "cn2" },
      { from: "cn2", to: "cn3" },
      { from: "cn3", to: "cexp" },
      { from: "poly", to: "cn2", label: "degree" },
      { from: "fact", to: "nn", label: "n*n*…*n", showAt: 4, dashed: true },
      { from: "fact", to: "c1", label: "1*1*…*1", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Frequency count to a class",
        text: "One statement is 1 (constant). A loop is 2n+3 (linear). Nested loops 2n²+2n+1 (quadratic). Triple loop cubic. Binary search 3 log n+2. Recurrence 2T(n−1)+1 → 2^n. Highest degree picks the rung.",
        highlight: ["c1", "clog", "cn", "cn2", "cexp", "n0", "poly"],
        hide: ["n1", "n2", "n3", "n4", "n5", "fact", "nn"]
      },
      {
        title: "Upper bounds sit to the right",
        text: "f=2n²+3n+1 has degree n². Every ladder class ≥ n² is a legal Big-O: O(n²), O(n³), O(2^n). Inflate terms to 6n² to exhibit c=6 in the formal definition.",
        highlight: ["cn2", "cn3", "cexp", "poly", "n1", "n4"],
        hide: ["n0", "n2", "n3", "n5", "fact", "nn"],
        flows: [
          { from: "poly", to: "cexp", color: "#c084fc", label: "also O" }
        ]
      },
      {
        title: "Lower bounds sit to the left",
        text: "Classes ≤ n² are Ω: Ω(n²), Ω(n), Ω(log n), Ω(1). Formally f(n) ≥ 1·n² from some n₀. Loose lower bounds are true and weak.",
        highlight: ["c1", "clog", "cn", "cn2", "poly", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "fact", "nn"],
        flows: [
          { from: "poly", to: "c1", color: "#60a5fa", label: "also Ω" }
        ]
      },
      {
        title: "Same rung is Theta",
        text: "f is both O(n²) and Ω(n²), so f=Θ(n²). That is the tight bound the lecture wants you to circle. n+5 is Θ(n) by the same reading.",
        highlight: ["cn2", "poly", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "fact", "nn"]
      },
      {
        title: "n! is off the ladder",
        text: "n(n−1)…1 is not a listed class. Replace every factor by n → n^n (upper). Replace every factor by 1 → 1 (lower). The two bounds disagree.",
        highlight: ["fact", "nn", "c1", "cexp"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "fact", to: "nn", color: "#fb923c", label: "O" },
          { from: "fact", to: "c1", color: "#4ade80", label: "Ω" }
        ]
      },
      {
        title: "No Theta for n! on this list",
        text: "O(n^n) ≠ Ω(1), and Ω(n log n) still is not n^n. Some functions have only one-sided bounds on the standard classes. Polynomials like 2n²+3n+1 do have Θ.",
        highlight: ["fact", "nn", "n5", "cn2", "poly"],
        hide: ["n0", "n1", "n2", "n3", "n4"]
      }
    ]
  }
});
