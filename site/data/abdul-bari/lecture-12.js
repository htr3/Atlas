window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 12,
  title: "1.8.2 Asymptotic Notations - Big Oh - Omega - Theta #2",
  video: "https://www.youtube.com/watch?v=Nd0XDY-jVHs",
  category: "Algorithm Foundations",
  tagline: "Inflate to n² for 2n²+3n+4; n! only gets O(n^n) and Ω(1) — no crude Theta.",
  summary: "Worked bounds: 2n²+3n+4 and n² log n + n sandwich into Theta of their leading term. n! sits between 1 and n^n, so this replacement trick cannot name a Theta class; log n! has the same gap (Ω(1) and O(n log n)). Theta is the useful stamp; far O and far Ω are true the way a ₹3,000 or ₹2 lakh phone quote is true.",

  theory: [
    {
      heading: "Polynomial: replace every term by n²",
      body: "Take f(n) = 2n² + 3n + 4. For an upper bound, rewrite lesser powers as n²: 2n² + 3n² + 4n² = 9n². Then f(n) ≤ 9n² for n ≥ 1, so f = O(n²). For a lower bound keep only the leading term: f(n) ≥ 1·n², so f = Ω(n²). The same g on both sides gives f = Θ(n²). The recipe is mechanical: candidate g is the highest-degree monomial; c is the sum of coefficients after replacement.",
      bullets: [
        "2n²+3n+4 ≤ 9n² → O(n²).",
        "2n²+3n+4 ≥ n² → Ω(n²).",
        "Together: Θ(n²)."
      ]
    },
    {
      heading: "n² log n sits between n² and n³",
      body: "f(n) = n² log n + n. Cap the extra +n by a constant times the leading term (the lecture uses 10 n² log n) and drop it for the lower bound (1·n² log n). Then f is O, Ω, and Θ of <code>n² log n</code>. That mixed class is not on the simple ladder; it belongs <b>strictly between n² and n³</b> because log n → ∞ slower than n. You may insert it as its own rung.",
      bullets: [
        "n² < n² log n < n³ for large n.",
        "Dominant term still names Theta when lower terms are absorbed."
      ]
    },
    {
      heading: "n! : crude bounds, no Theta",
      body: "n! = n·(n−1)···2·1. Upper: every factor ≤ n, so n! ≤ n^n, hence n! = O(n^n). Lower: every factor ≥ 1, so n! ≥ 1, hence n! = Ω(1). The two sides are not the same g, so this method does <b>not</b> produce Theta. You also cannot park n! between two consecutive powers n^10 and n^11 — for small n it hugs the bottom of the range and for large n it climbs toward n^n. O and Ω exist; a tight class from this trick does not.",
      bullets: [
        "O(n^n) and Ω(1) from replacing every factor.",
        "No Θ(g) with this replacement, because the sides disagree.",
        "Stirling's n! ~ √(2πn)(n/e)^n (textbook, not in the video) later gives Θ(n^n / e^n) shape; the lecture stops at the crude gap."
      ]
    },
    {
      heading: "log n! inherits the gap",
      body: "log(n!) = log(1·2···n). Upper: log(n·n···n) = log(n^n) = n log n, so log n! = O(n log n). Lower: log(1·1···1) is 0, written as 1, so log n! = Ω(1). Again the sides differ, so no Theta from the same practice. (Stirling implies log n! = Θ(n log n); the video treats the crude estimate as not tight.)",
      bullets: [
        "Same replace-every-factor idea, now inside the log.",
        "Use O(n log n) / Ω(1) when asked to bound log n! this way."
      ]
    },
    {
      heading: "Phone-price analogy",
      body: "Someone asks what a suitable phone costs. Θ is 'about ₹20,000' — the figure you actually need. Ω of ₹3,000 is true (phones exist) and useless. O of ₹2 lakh is true (phones exist) and useless. For f(n) = n², write Θ(n²). Ω(n) or O(n³) remain correct statements and stop answering the question. Use far O/Ω when you truly cannot name Theta (n! in this lecture). When you can, stamp Theta.",
      bullets: [
        "Theta = exact class.",
        "O = 'at most this, maybe much less'.",
        "Ω = 'at least this, maybe much more'."
      ]
    }
  ],

  keyTerms: [
    { term: "Replacement trick", def: "Turn every summand into the candidate g (upper) or drop all but g (lower) to read c." },
    { term: "Θ(n²)", def: "Stamp for 2n²+3n+4 after  n² ≤ f ≤ 9n²." },
    { term: "n² log n", def: "Mixed class strictly between n² and n³; Theta of itself for n² log n + n." },
    { term: "n!", def: "1·2···n. Crude O(n^n), crude Ω(1), no Theta from that pair." },
    { term: "log n!", def: "Crude O(n log n) and Ω(1) by the same factor replacement." },
    { term: "Tight bound", def: "A g close enough that O and Ω share it. Theta guarantees tightness; lone O/Ω do not." }
  ],

  tradeoffs: [
    { pro: "Replacement turns a polynomial into Θ of its degree in one line.", con: "The same trick on n! produces Ω(1) and O(n^n) — true, and not a class." },
    { pro: "Loose O/Ω are always available and keep you from writing a false Theta.", con: "They hide the real growth; a ₹2 lakh upper bound does not help you shop." },
    { pro: "Inserting n² log n between n² and n³ refines the ladder without new notation.", con: "You must still absorb the +n term into n² log n before claiming Theta." }
  ],

  interviewTips: [
    "For 2n²+3n+4 write 9n² and n², then Θ(n²). Show the n ≥ 1 check.",
    "Place n² log n between n² and n³; name Θ(n² log n) for n² log n + n.",
    "If they ask Theta of n!, say the crude method fails; quote O(n^n) and Ω(1).",
    "Phone analogy: Θ is the useful price, far O/Ω are true and unhelpful.",
    "Prefer Theta; use O/Ω only when the two sides of the sandwich disagree."
  ],

  scene: {
    nodes: [
      { id: "band", label: "sandwiches", type: "zone", pos: [0, 0, 0.5], size: [23, 15] },
      { id: "axN", label: "n →", type: "note", pos: [9, 0, 7.2] },
      { id: "loA", label: "n²", type: "point", pos: [-8, 0, 4.4], color: "#60a5fa" },
      { id: "loB", label: "n²", type: "point", pos: [-2, 0, 2.6], color: "#60a5fa" },
      { id: "loC", label: "n² lower", type: "point", pos: [4, 0, 0.6], color: "#60a5fa" },
      { id: "loD", label: "Ω(n²)", type: "point", pos: [9.2, 0, -1.2], color: "#60a5fa" },
      { id: "fA", label: "2n²+3n+4", type: "point", pos: [-8, 0, 3.6], color: "#facc15" },
      { id: "fB", label: "f", type: "point", pos: [-2, 0, 1.4], color: "#facc15" },
      { id: "fC", label: "f", type: "point", pos: [4, 0, -1.0], color: "#facc15" },
      { id: "fD", label: "Θ(n²)", type: "point", pos: [9.2, 0, -3.0], color: "#facc15" },
      { id: "upA", label: "9n²", type: "point", pos: [-8, 0, 2.6], color: "#fb923c" },
      { id: "upB", label: "9n²", type: "point", pos: [-2, 0, 0.0], color: "#fb923c" },
      { id: "upC", label: "9n²", type: "point", pos: [4, 0, -2.6], color: "#fb923c" },
      { id: "upD", label: "O(n²)", type: "point", pos: [9.2, 0, -4.8], color: "#fb923c" },
      { id: "mix", label: "n² log n", type: "service", pos: [-8, 0, -6.6], color: "#c084fc", showAt: 2 },
      { id: "n2", label: "n²", type: "point", pos: [-3.5, 0, -5.4], color: "#60a5fa", showAt: 2 },
      { id: "n3", label: "n³", type: "point", pos: [-3.5, 0, -7.6], color: "#818cf8", showAt: 2 },
      { id: "fact", label: "n!", type: "server", pos: [3.2, 0, -6.6], color: "#f87171", showAt: 3 },
      { id: "one", label: "Ω(1)", type: "note", pos: [6.6, 0, -5.4], showAt: 3 },
      { id: "nn", label: "O(n^n)", type: "note", pos: [6.6, 0, -7.6], showAt: 3 },
      { id: "gap", label: "no crude Θ", type: "gateway", pos: [9.5, 0, -6.6], showAt: 3 },
      { id: "phone", label: "₹20k is Θ", type: "lb", pos: [0, 0, 6.4], showAt: 5 },
      { id: "cheap", label: "₹3k is Ω", type: "note", pos: [-8, 0, 6.4], showAt: 5 },
      { id: "dear", label: "₹2L is O", type: "note", pos: [8, 0, 6.4], showAt: 5 }
    ],
    edges: [
      { from: "loA", to: "loB" },
      { from: "loB", to: "loC" },
      { from: "loC", to: "loD" },
      { from: "fA", to: "fB" },
      { from: "fB", to: "fC" },
      { from: "fC", to: "fD" },
      { from: "upA", to: "upB" },
      { from: "upB", to: "upC" },
      { from: "upC", to: "upD" },
      { from: "loD", to: "fD", dashed: true, label: "≤ f" },
      { from: "fD", to: "upD", dashed: true, label: "≤ 9n²" },
      { from: "n2", to: "mix", showAt: 2, dashed: true },
      { from: "mix", to: "n3", showAt: 2, dashed: true },
      { from: "one", to: "fact", showAt: 3, dashed: true },
      { from: "fact", to: "nn", showAt: 3, dashed: true },
      { from: "cheap", to: "phone", showAt: 5, dashed: true },
      { from: "phone", to: "dear", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "2n²+3n+4 between n² and 9n²",
        text: "Replace 3n and 4 by n² to get 9n². Keep n² as a floor. Yellow sits in the band. That band is Θ(n²).",
        highlight: ["band", "loD", "fD", "upD", "fA"],
        flows: [
          { from: "loD", to: "fD", color: "#60a5fa", label: "≥ n²" },
          { from: "fD", to: "upD", color: "#fb923c", label: "≤ 9n²" }
        ]
      },
      {
        title: "Same g both sides → Theta",
        text: "O, Ω, and Θ all read n² because the envelopes share a monomial. For a polynomial this is the whole proof.",
        highlight: ["fD", "loD", "upD"]
      },
      {
        title: "n² log n between n² and n³",
        text: "n² log n + n is Θ(n² log n). The mixed class is larger than n² (log n → ∞) and smaller than n³ (log n = o(n)). Insert a rung.",
        highlight: ["mix", "n2", "n3", "fD"],
        flows: [
          { from: "n2", to: "mix", color: "#c084fc", label: "<" },
          { from: "mix", to: "n3", color: "#c084fc", label: "<" }
        ]
      },
      {
        title: "n! : Ω(1) up to O(n^n)",
        text: "Every factor ≥ 1 and ≤ n, so 1 ≤ n! ≤ n^n. The sides are not the same function. No Theta from this trick, and no slot between n^10 and n^11.",
        highlight: ["fact", "one", "nn", "gap"],
        fail: ["gap"],
        flows: [
          { from: "one", to: "fact", color: "#60a5fa", label: "≥ 1" },
          { from: "fact", to: "nn", color: "#f87171", label: "≤ n^n" }
        ]
      },
      {
        title: "log n! : O(n log n), still no crude Theta",
        text: "log of the same product: upper n log n, lower a constant. log n! inherits the gap. Use O/Ω here; do not invent Θ(1) or Θ(n^n).",
        highlight: ["fact", "nn", "one", "gap"]
      },
      {
        title: "₹20k vs ₹3k vs ₹2 lakh",
        text: "Theta is the useful price. Ω(₹3,000) and O(₹2 lakh) stay true and stop being an answer. Write far bounds only when Theta is genuinely out of reach.",
        highlight: ["phone", "cheap", "dear", "fD", "gap"],
        flows: [
          { from: "cheap", to: "phone", color: "#60a5fa", label: "Ω" },
          { from: "phone", to: "dear", color: "#fb923c", label: "O" }
        ]
      }
    ]
  }
});
