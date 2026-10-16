window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 13,
  title: "1.9 Properties of Asymptotic Notations",
  video: "https://www.youtube.com/watch?v=NI4OKSvGAgM",
  category: "Algorithm Foundations",
  tagline: "Constants drop, Theta is symmetric, O/Ω swap, sums take the max class.",
  summary: "Algebra of O, Ω, and Θ: a constant factor does not change the bound, every function bounds itself, and the relations are transitive. Only Theta is symmetric. O and Ω are transpose-symmetric: f = O(g) iff g = Ω(f). Matching O and Ω is Theta. A sum is the max of the two bounds; a product multiplies them.",

  theory: [
    {
      heading: "Constant factor (general property)",
      body: "If f(n) = O(g(n)), then a·f(n) = O(g(n)) for any positive constant a. Example: 2n²+5 = O(n²), so 7(2n²+5) = 14n²+35 is still O(n²) — same degree. The constant is absorbed into c in the definition. The same identity holds for Ω and for Θ. This is why we never write O(7n²); we write O(n²).",
      bullets: [
        "Multiply the function by 7, the class does not move.",
        "True for O, Ω, and Θ."
      ]
    },
    {
      heading: "Reflexive: a function bounds itself",
      body: "f(n) = O(f(n)), and likewise Ω and Θ. n² is O(n²) because n² ≤ 1·n². An upper bound is 'greater than or equal', so equality is allowed. A lower bound is 'less than or equal' in the other direction, so equality is allowed there too. Reflexive is the reason Θ(f) is always legal for f itself.",
      bullets: [
        "O includes the function, not only strictly faster ones.",
        "Shown in the lecture for O; it holds for Ω and Θ as well."
      ]
    },
    {
      heading: "Transitive along the ladder",
      body: "If f = O(g) and g = O(h), then f = O(h). Example: n = O(n²) and n² = O(n³), therefore n = O(n³). If g is an upper envelope of f and h is an upper envelope of g, h envelopes f. Transitivity holds for Ω and Θ too (the lecture demonstrates O and states the rest).",
      bullets: [
        "n → n² → n³ on the O-chain.",
        "You may skip rungs: n = O(2^n) follows by transitivity from the ladder."
      ]
    },
    {
      heading: "Symmetric only for Theta; O/Ω swap",
      body: "If f = Θ(g) then g = Θ(f). That <b>symmetric</b> property is Theta-only: the sandwich looks the same after swapping names (adjust c₁, c₂). It fails for O: n = O(n²) does not imply n² = O(n). Instead O and Ω are <b>transpose-symmetric</b>: f = O(g) iff g = Ω(f). Example: n = O(n²) and n² = Ω(n). One function is the other's upper bound; the second is the first's lower bound.",
      bullets: [
        "Θ(n²) of n² goes both ways.",
        "O(n²) of n becomes Ω(n) of n².",
        "Do not claim O is symmetric."
      ]
    },
    {
      heading: "O and Ω together are Theta",
      body: "If the same g is both an upper bound and a lower bound of f — f = O(g) and f = Ω(g) — then f = Θ(g). The two inequalities are exactly the Theta sandwich. Equality of classes is the case where a bound appears on both sides.",
      bullets: [
        "One-line exam fact: O ∩ Ω on the same g is Θ."
      ]
    },
    {
      heading: "Sum takes max; product multiplies",
      body: "If f = O(g) and d = O(e), then f+d = O(max(g, e)). Example: n = O(n) and n² = O(n²), so n+n² = O(n²) — the larger class wins. If both are n², the sum is still O(n²). For a product, f·d = O(g·e): n · n² = O(n³). These are the rules you use when an algorithm's time is a sum of stages or a nested loop's product.",
      bullets: [
        "f+d → max of the two O-classes.",
        "f·d → product of the two O-classes.",
        "The same shapes hold for Θ when both sides are tight."
      ]
    }
  ],

  keyTerms: [
    { term: "Constant property", def: "a·f stays in the same O/Ω/Θ class as f. Drop constant factors." },
    { term: "Reflexive", def: "f = O(f), f = Ω(f), f = Θ(f)." },
    { term: "Transitive", def: "f = O(g) and g = O(h) imply f = O(h). Also for Ω and Θ." },
    { term: "Symmetric", def: "f = Θ(g) iff g = Θ(f). Theta only." },
    { term: "Transpose-symmetric", def: "f = O(g) iff g = Ω(f)." },
    { term: "Sum rule", def: "O(f)+O(g) = O(max(f, g))." },
    { term: "Product rule", def: "O(f)·O(g) = O(f·g)." }
  ],

  tradeoffs: [
    { pro: "Dropping constants and taking max-of-sum collapse messy expressions to one class.", con: "You lose the leading coefficient, which still matters for wall-clock time at moderate n." },
    { pro: "Transpose-symmetry turns every O fact into an Ω fact without a new proof.", con: "Students then claim O itself is symmetric — n = O(n²) does not reverse." },
    { pro: "Matching O and Ω is a two-line Theta proof.", con: "If the two g's differ, you only have a band, not a class." }
  ],

  interviewTips: [
    "List the five names: constant, reflexive, transitive, symmetric (Θ only), transpose-symmetric (O ↔ Ω).",
    "Counterexample for O-symmetry: n = O(n²) but n² ≠ O(n).",
    "Sum: n + n² is O(n²), never O(n). Product: n · n² is O(n³).",
    "If f = O(g) and f = Ω(g), write f = Θ(g) in the next sentence.",
    "7(2n²+5) is still O(n²); do not carry the 7 into the notation."
  ],

  scene: {
    nodes: [
      { id: "board", label: "notation algebra", type: "zone", pos: [0, 0, 0], size: [23, 15] },
      { id: "f", label: "f = n", type: "server", pos: [-8, 0, -1], color: "#60a5fa" },
      { id: "g", label: "g = n²", type: "server", pos: [0, 0, -1], color: "#fb923c" },
      { id: "h", label: "h = n³", type: "server", pos: [8, 0, -1], color: "#f87171" },
      { id: "af", label: "7f still O(n²)", type: "note", pos: [-8, 0, -4.2], showAt: 1 },
      { id: "self", label: "n² = O(n²)", type: "note", pos: [0, 0, -4.2], showAt: 2 },
      { id: "chain", label: "n → n² → n³", type: "note", pos: [8, 0, -4.2], showAt: 3 },
      { id: "thF", label: "Θ pair", type: "point", pos: [-4, 0, 3.6], color: "#c084fc", showAt: 4 },
      { id: "thG", label: "n² Θ n²", type: "point", pos: [4, 0, 3.6], color: "#c084fc", showAt: 4 },
      { id: "swapO", label: "n = O(n²)", type: "note", pos: [-8, 0, 6.2], showAt: 5 },
      { id: "swapOm", label: "n² = Ω(n)", type: "note", pos: [8, 0, 6.2], showAt: 5 },
      { id: "sum", label: "n+n² = O(n²)", type: "lb", pos: [-3.5, 0, -6.8], showAt: 6 },
      { id: "prod", label: "n·n² = O(n³)", type: "gateway", pos: [3.5, 0, -6.8], showAt: 6 },
      { id: "both", label: "O and Ω → Θ", type: "worker", pos: [0, 0, 6.2], showAt: 5 }
    ],
    edges: [
      { from: "f", to: "g", label: "O", showAt: 3 },
      { from: "g", to: "h", label: "O", showAt: 3 },
      { from: "f", to: "h", label: "O (skip)", showAt: 3, dashed: true },
      { from: "thF", to: "thG", label: "Θ both ways", showAt: 4 },
      { from: "swapO", to: "swapOm", showAt: 5, dashed: true, label: "transpose" },
      { from: "f", to: "sum", showAt: 6 },
      { from: "g", to: "sum", showAt: 6 },
      { from: "f", to: "prod", showAt: 6 },
      { from: "g", to: "prod", showAt: 6 }
    ],
    steps: [
      {
        title: "Three functions on the ladder",
        text: "f = n, g = n², h = n³. Properties of O/Ω/Θ are facts about arrows between these curves, not about best or worst case.",
        highlight: ["board", "f", "g", "h"]
      },
      {
        title: "Constants vanish",
        text: "If 2n²+5 = O(n²), then 7 times that polynomial is still O(n²). The 7 folds into c. Same rule for Ω and Θ. Never write O(7n²).",
        highlight: ["f", "g", "af"],
        flows: [
          { from: "f", to: "g", color: "#c084fc", label: "×7" }
        ]
      },
      {
        title: "Reflexive: g = O(g)",
        text: "n² ≤ 1·n², so n² is an upper bound of itself. Equality is allowed in O, Ω, and Θ. Every function is Θ of itself.",
        highlight: ["g", "self"]
      },
      {
        title: "Transitive: skip a rung",
        text: "n = O(n²) and n² = O(n³) imply n = O(n³). If g envelopes f and h envelopes g, h envelopes f. The dashed skip is the transitive arrow.",
        highlight: ["f", "g", "h", "chain"],
        flows: [
          { from: "f", to: "g", color: "#fb923c", label: "O" },
          { from: "g", to: "h", color: "#f87171", label: "O" },
          { from: "f", to: "h", color: "#60a5fa", label: "O" }
        ]
      },
      {
        title: "Theta is symmetric",
        text: "n² = Θ(n²) both ways. Symmetric is Theta-only. O does not reverse: n = O(n²) does not give n² = O(n).",
        highlight: ["thF", "thG", "g"],
        flows: [
          { from: "thF", to: "thG", color: "#c084fc", label: "Θ" },
          { from: "thG", to: "thF", color: "#c084fc", label: "Θ" }
        ]
      },
      {
        title: "O and Ω swap; both sides → Theta",
        text: "n = O(n²) iff n² = Ω(n) (transpose-symmetric). If one g is both O and Ω of f, that g is Θ of f.",
        highlight: ["swapO", "swapOm", "both", "f", "g"],
        flows: [
          { from: "swapO", to: "swapOm", color: "#fb923c", label: "O ↔ Ω" }
        ]
      },
      {
        title: "Sum = max, product = multiply",
        text: "n + n² is O of the larger class n². n · n² is O(n³). Stage-sum algorithms take the slowest stage; nested loops multiply classes.",
        highlight: ["sum", "prod", "f", "g", "h"],
        flows: [
          { from: "f", to: "sum", color: "#4ade80", label: "+" },
          { from: "g", to: "sum", color: "#4ade80", label: "+" },
          { from: "f", to: "prod", color: "#c084fc", label: "×" },
          { from: "g", to: "prod", color: "#c084fc", label: "×" }
        ]
      }
    ]
  }
});
