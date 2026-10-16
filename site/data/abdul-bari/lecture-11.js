window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 11,
  title: "1.8.1 Asymptotic Notations Big Oh - Omega - Theta #1",
  video: "https://www.youtube.com/watch?v=A03oI0znAoc",
  category: "Algorithm Foundations",
  tagline: "O is any upper bound, Ω any lower, Θ the sandwich — not best vs worst case.",
  summary: "Big-O, Omega, and Theta are mathematical bounds on a function, used to write a time complexity in one term. For f(n) = 2n+3 you may write O(n), O(n²), even O(2^n), but not O(log n). Prefer the closest bound; Theta is the one that names the class. None of this is best-case or worst-case analysis.",

  theory: [
    {
      heading: "Three bounds, one purpose",
      body: "Asymptotic notation comes from mathematics. Algorithms produce time (and space) as functions of n, and we refuse to drag a long polynomial around. <b>Big-O</b> is an <i>upper</i> bound, <b>Omega</b> a <i>lower</i> bound, <b>Theta</b> a tight (the lecture says \"average\") bound — the same g on both sides. Prefer Theta when you can name the class. Use O or Ω when you cannot pin the function to one class.",
      bullets: [
        "O: f never outgrows c·g after n₀.",
        "Ω: f never falls below c·g after n₀.",
        "Θ: both, with two positive constants c₁ and c₂."
      ]
    },
    {
      heading: "Big-O of 2n+3",
      body: "Definition: f(n) = O(g(n)) iff there exist positive constants c and n₀ such that <code>f(n) ≤ c·g(n)</code> for all n ≥ n₀. For f(n) = 2n+3, collapse extra terms into the same monomial: 2n+3 ≤ 2n+3n = 5n for n ≥ 1 (equal at n = 1). So f = O(n) with c = 5. Ten n or a thousand n also work — any c that sits above the curve after some n₀ is legal. Keep a single term in g; the coefficient lives in c.",
      bullets: [
        "Recipe: replace every lower term by the candidate g, then read c off the sum of coefficients.",
        "2n+3 ≤ 10n is true; 2n+3 ≤ 5n is tighter and still true."
      ]
    },
    {
      heading: "Loose uppers are true, not useful",
      body: "The same f is also ≤ 5n², so f = O(n²) is <b>true</b>. It is even O(2^n). Every function on the growth ladder that sits at n or above is a legal upper bound. O(log n) is <b>false</b>: log n lives on the lower-bound side of this f. Write the <i>closest</i> upper bound — here O(n) — even though looser O's are not wrong. Far-away O is like saying a phone costs 'at most two lakh' when it costs twenty thousand.",
      bullets: [
        "O(n), O(n²), O(2^n) all hold for 2n+3.",
        "O(log n) does not.",
        "Closest O is the one that matches the class."
      ]
    },
    {
      heading: "Omega: flip the inequality",
      body: "f(n) = Ω(g(n)) iff f(n) ≥ c·g(n) for n ≥ n₀. For 2n+3 you may take c = 1 and g(n) = n: 2n+3 ≥ n from n = 0 onward. You may also write Ω(log n) or Ω(√n) — anything slower is a legal lower bound. Ω(n²) is false because n² is an upper envelope for this f, not a floor. Closest Omega is again n, the class f actually lives in.",
      bullets: [
        "Upper-bound side of the ladder → legal O, illegal Ω.",
        "Lower-bound side → legal Ω, illegal O."
      ]
    },
    {
      heading: "Theta is the sandwich",
      body: "f(n) = Θ(g(n)) iff c₁·g(n) ≤ f(n) ≤ c₂·g(n) for n ≥ n₀. We already have n ≤ 2n+3 ≤ 5n, same g on both sides, so f = Θ(n). You cannot write Θ(n²) or Θ(log n): those fail one of the two inequalities. Theta is the recommended stamp — it says the function <i>is</i> that class, not merely under or over it.",
      bullets: [
        "Need the same g on both sides.",
        "Prefer Θ; fall back to O or Ω only when a tight g is not available."
      ]
    },
    {
      heading: "Not best case, not worst case",
      body: "A common mix-up: O means worst case, Ω means best case. That is wrong. O/Ω/Θ bound a <i>function</i>. Best, worst, and average are kinds of <i>analysis</i> that each produce a function, and that function may be written with any of the three notations. The next case-analysis lecture returns to this. For now: notations are envelopes on a curve, not names of input arrangements.",
      bullets: [
        "You may write the best-case time as Θ(1) or as O(1).",
        "You may write the worst-case time as Θ(n) or as O(n)."
      ]
    }
  ],

  keyTerms: [
    { term: "Big-O", def: "f(n) ≤ c·g(n) for n ≥ n₀. Upper envelope. Closest useful choice matches the class." },
    { term: "Omega", def: "f(n) ≥ c·g(n) for n ≥ n₀. Lower envelope." },
    { term: "Theta", def: "c₁·g ≤ f ≤ c₂·g. Tight bound; f belongs to the class of g." },
    { term: "c, n₀", def: "Positive constants in the definition. Any pair that makes the inequality hold is legal." },
    { term: "Closest bound", def: "The g on the growth ladder nearest to f. Loose bounds stay true; they stop being useful." },
    { term: "Class of 2n+3", def: "Linear. Θ(n). Also O(n²) (true, loose) and not O(log n)." }
  ],

  tradeoffs: [
    { pro: "O is easy to prove: inflate every term into the candidate g and read c.", con: "A legal O can be miles above the curve, so it does not name the class." },
    { pro: "Theta names the class in one symbol and is what exams want when you have it.", con: "You need matching lower and upper g; some functions (later: n!) resist a tight g from crude estimates." },
    { pro: "Any of O, Ω, Θ can stamp a best-case or a worst-case function.", con: "Treating O as 'worst' and Ω as 'best' is the standard wrong answer." }
  ],

  interviewTips: [
    "Write the definition with c and n₀, then prove 2n+3 ≤ 5n (n ≥ 1) so f = O(n).",
    "Offer a loose true bound (O(n²)) and a false one (O(log n)) to show you know the ladder.",
    "For Theta, exhibit both 1·n ≤ 2n+3 and 2n+3 ≤ 5n.",
    "If they say 'O is worst case', correct them: O bounds a function; cases are a different lecture.",
    "Always prefer the closest g. 'O(2^n) for linear search' is true and a bad grade."
  ],

  scene: {
    nodes: [
      { id: "plane", label: "bounds of 2n+3", type: "zone", pos: [0, 0, 0], size: [23, 15] },
      { id: "axN", label: "n →", type: "note", pos: [9, 0, 7] },
      { id: "axF", label: "value ↑", type: "note", pos: [-10.8, 0, -6.8] },
      { id: "logA", label: "log n", type: "point", pos: [-7, 0, 5.2], color: "#4ade80" },
      { id: "logB", label: "log n", type: "point", pos: [-1, 0, 4.4], color: "#4ade80" },
      { id: "logC", label: "log n", type: "point", pos: [5, 0, 3.7], color: "#4ade80" },
      { id: "logD", label: "Ω ok / O no", type: "point", pos: [9.5, 0, 3.2], color: "#4ade80" },
      { id: "linA", label: "n", type: "point", pos: [-7, 0, 4.2], color: "#60a5fa" },
      { id: "linB", label: "n", type: "point", pos: [-1, 0, 2.4], color: "#60a5fa" },
      { id: "linC", label: "n", type: "point", pos: [5, 0, 0.4], color: "#60a5fa" },
      { id: "linD", label: "n (class)", type: "point", pos: [9.5, 0, -1.2], color: "#60a5fa" },
      { id: "fA", label: "2n+3", type: "point", pos: [-7, 0, 3.4], color: "#facc15" },
      { id: "fB", label: "2n+3", type: "point", pos: [-1, 0, 1.0], color: "#facc15" },
      { id: "fC", label: "2n+3", type: "point", pos: [5, 0, -1.6], color: "#facc15" },
      { id: "fD", label: "f(n)", type: "point", pos: [9.5, 0, -3.4], color: "#facc15" },
      { id: "cA", label: "5n", type: "point", pos: [-7, 0, 2.4], color: "#fb923c" },
      { id: "cB", label: "5n", type: "point", pos: [-1, 0, -0.4], color: "#fb923c" },
      { id: "cC", label: "5n", type: "point", pos: [5, 0, -3.4], color: "#fb923c" },
      { id: "cD", label: "5n = c·n", type: "point", pos: [9.5, 0, -5.4], color: "#fb923c" },
      { id: "qA", label: "n²", type: "point", pos: [-7, 0, 3.0], color: "#f87171" },
      { id: "qB", label: "n²", type: "point", pos: [-1, 0, -1.2], color: "#f87171" },
      { id: "qC", label: "n²", type: "point", pos: [5, 0, -5.2], color: "#f87171" },
      { id: "qD", label: "O ok / Θ no", type: "point", pos: [9.5, 0, -7.2], color: "#f87171" },
      { id: "defO", label: "f ≤ c g  →  O", type: "note", pos: [-10.5, 0, 1.0], showAt: 1 },
      { id: "defOm", label: "f ≥ c g  →  Ω", type: "note", pos: [-10.5, 0, -1.8], showAt: 3 },
      { id: "defTh", label: "c1 g ≤ f ≤ c2 g", type: "note", pos: [-10.5, 0, -4.6], showAt: 4 },
      { id: "badge", label: "Θ(n) closest", type: "lb", pos: [0, 0, -7.2], showAt: 4 },
      { id: "warn", label: "not best/worst", type: "gateway", pos: [-7, 0, -7.2], showAt: 5 }
    ],
    edges: [
      { from: "logA", to: "logB" },
      { from: "logB", to: "logC" },
      { from: "logC", to: "logD" },
      { from: "linA", to: "linB" },
      { from: "linB", to: "linC" },
      { from: "linC", to: "linD" },
      { from: "fA", to: "fB" },
      { from: "fB", to: "fC" },
      { from: "fC", to: "fD" },
      { from: "cA", to: "cB", showAt: 1 },
      { from: "cB", to: "cC", showAt: 1 },
      { from: "cC", to: "cD", showAt: 1 },
      { from: "qA", to: "qB", showAt: 2 },
      { from: "qB", to: "qC", showAt: 2 },
      { from: "qC", to: "qD", showAt: 2 },
      { from: "fD", to: "cD", showAt: 1, dashed: true, label: "≤" },
      { from: "linD", to: "fD", showAt: 3, dashed: true, label: "≥" },
      { from: "fD", to: "qD", showAt: 2, dashed: true, label: "also ≤" }
    ],
    steps: [
      {
        title: "f(n) = 2n+3 on the ladder",
        text: "Yellow is 2n+3. Blue is n, green is log n. f sits in the linear class: above log n, locked to the slope of n.",
        highlight: ["plane", "fA", "fB", "fC", "fD", "linD", "logD", "axN"]
      },
      {
        title: "O(n): stay under 5n",
        text: "Inflate 2n+3 into 2n+3n = 5n. For n ≥ 1 the yellow curve never crosses the orange 5n envelope. That is the definition of O(n). 10n would work too.",
        highlight: ["fD", "cA", "cD", "defO", "linD"],
        flows: [
          { from: "fD", to: "cD", color: "#fb923c", label: "≤ 5n" }
        ]
      },
      {
        title: "O(n²) true, O(log n) false",
        text: "n² (red) is above f, so O(n²) holds — a legal but loose upper. log n is below f, so O(log n) fails. Prefer the closest upper: O(n).",
        highlight: ["qD", "fD", "logD", "cD"],
        fail: ["logD"],
        flows: [
          { from: "fD", to: "qD", color: "#f87171", label: "O(n²)" },
          { from: "logD", to: "fD", color: "#f87171", label: "not O" }
        ]
      },
      {
        title: "Ω(n): sit above 1·n",
        text: "2n+3 ≥ n from n = 0. Closest lower bound is n. Ω(log n) is true and weak. Ω(n²) is false — n² is not a floor for this f.",
        highlight: ["linD", "fD", "logD", "qD", "defOm"],
        fail: ["qD"],
        flows: [
          { from: "linD", to: "fD", color: "#60a5fa", label: "≥ n" }
        ]
      },
      {
        title: "Θ(n): same g on both sides",
        text: "n ≤ 2n+3 ≤ 5n. One g, two constants. That sandwich is Θ(n). Θ(n²) and Θ(log n) each break one side. Stamp the class with Theta when you can.",
        highlight: ["linD", "fD", "cD", "defTh", "badge"],
        flows: [
          { from: "linD", to: "fD", color: "#60a5fa", label: "c1 n" },
          { from: "fD", to: "cD", color: "#fb923c", label: "c2 n" }
        ]
      },
      {
        title: "Notation is not a case",
        text: "O / Ω / Θ wrap a function. Best / worst / average are analyses that produce functions. You may write worst-case time as Θ(n) or as O(n). Do not pair O with worst and Ω with best.",
        highlight: ["warn", "badge", "fD", "defTh"]
      }
    ]
  }
});
