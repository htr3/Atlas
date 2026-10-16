window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 15,
  title: "1.10.2 Comparison of Functions #2",
  video: "https://www.youtube.com/watch?v=WlBBTSL0ZRc",
  category: "Algorithm Foundations",
  tagline: "Log twice if needed; never drop coefficients after a log; G2 wins past n=10⁴.",
  summary: "More comparisons: n^{log n} vs 2^{√n} (log twice — exponential in √n wins), 2^n vs 2^{2n} (after a log the 2 stays), and two piecewise polynomials that only settle after n = 10,000. GATE-style true/false: (n+k)² = Θ(n²), 2^{n+1} = Θ(2^n), 2^{2n} is not O(2^n), √(log n) is not O(log log n), n^{log n} = O(2^n).",

  theory: [
    {
      heading: "Log, and log again",
      body: "Compare n^{log n} and 2^{√n} (log base 2). One log: (log n)·(log n) = (log n)² versus √n · 1. If that is still hard to eye, log again: 2 log log n versus (1/2) log n. log log n is far below log n, so 2^{√n} is larger. There is no sacred number of logs — take them until the dominant terms are obvious. Logs of arguments > 1 preserve the inequality.",
      bullets: [
        "(log n)² vs √n, then 2 log log n vs ½ log n.",
        "2^{√n} outgrows n^{log n}."
      ]
    },
    {
      heading: "After a log, keep the coefficient",
      body: "2^n vs 2^{2n}: one log (base 2) gives n vs 2n. Do <b>not</b> drop the 2. The 2 is no longer a constant in front of the original function; it is the surviving comparison. 2^{2n} = (2²)^n = 4^n, which strictly dominates 2^n. Contrast with comparing 2n² and n² <i>without</i> taking logs: then the 2 may be ignored for class (both Θ(n²)). Rule: drop coefficients on the original functions; after a log, the leftover numbers are the evidence.",
      bullets: [
        "Direct: 2n² and n² are the same class.",
        "After log: n vs 2n means 2^n < 2^{2n}.",
        "The lecture plants this trap on purpose."
      ]
    },
    {
      heading: "Piecewise G1 and G2",
      body: "G1(n) is n³ for n < 100 and n² afterward. G2(n) is n² up to 10,000 and n³ afterward. For n < 100, G1 (cubic) is larger. From 100 to 10,000 both are n², so they match. Past 10,000, G2 becomes n³ and G1 stays n², so G2 is larger — and it stays larger all the way to infinity. Asymptotic comparison only cares about that infinite tail. Finite crossings before n₀ are ignored. Winner: G2 > G1.",
      bullets: [
        "n₀ = 10,000 here.",
        "Never decide from the n < 100 window."
      ]
    },
    {
      heading: "True/false from exams",
      body: "(n+k)² expands to n² plus lower terms, so (n+k)² = Θ(n²) is true (the lecture's binomial 'highest term is n²' example). 2^{n+1} = 2·2^n, coefficient dropped, so 2^{n+1} = Θ(2^n) (also O and Ω) is true. 2^{2n} = 4^n is <b>not</b> O(2^n) — the claimed upper bound is the slower exponential; write O(4^n). √(log n) vs log log n: a log shows ½ log log n vs log log log n, so √(log n) is larger and log log n cannot be its O. n^{log n} vs 2^n: (log n)² vs n, n wins, so n^{log n} = O(2^n) is true.",
      bullets: [
        "True: (n+k)² = Θ(n²); 2^{n+1} = Θ(2^n); n^{log n} = O(2^n).",
        "False: 2^{2n} = O(2^n); √(log n) = O(log log n)."
      ]
    },
    {
      heading: "Chapter close",
      body: "This pair of videos ends the usual first chapter: algorithms, analysis, and asymptotic notation. Next come strategies — divide and conquer, greedy. The method to keep is: expand, take logs until the order is visible, ignore a finite prefix of n, and never confuse a leftover coefficient after a log with a constant you may drop.",
      bullets: [
        "Approach over memorized pairs.",
        "Practice the true/false list; it is the exam format."
      ]
    }
  ],

  keyTerms: [
    { term: "Repeated log", def: "Take log again when (log n)² vs √n is still unclear; stop when terms are comparable." },
    { term: "Coefficient trap", def: "After log(2^{2n}) you must keep the 2; it is the comparison, not a droppable constant." },
    { term: "Piecewise G1/G2", def: "G1 = n³ then n²; G2 = n² then n³ at 10,000. Tail decides: G2 wins." },
    { term: "2^{n+1}", def: "Equals 2·2^n, hence Θ(2^n)." },
    { term: "2^{2n}", def: "Equals 4^n. Not O(2^n)." },
    { term: "n^{log n} = O(2^n)", def: "True because (log n)² = o(n)." }
  ],

  tradeoffs: [
    { pro: "A second log turns (log n)² vs √n into 2 log log n vs ½ log n, which anyone can rank.", con: "Each extra log is another chance to drop a coefficient you were supposed to keep." },
    { pro: "Piecewise definitions look like they 'change winner', but only the infinite tail counts.", con: "Answering from n < 100 is the expected wrong choice." },
    { pro: "True/false items reuse one skill: expand, log, name O/Θ.", con: "2^{2n} vs 2^n looks like the 2^{n+1} item and is the opposite answer." }
  ],

  interviewTips: [
    "For n^{log n} vs 2^{√n}, log twice and quote 2 log log n < ½ log n.",
    "Say out loud: 'I drop the 2 in 2n², I keep the 2 in log(2^{2n}) = 2n.'",
    "G1/G2: mark n = 100 and n = 10,000, then read only n → ∞.",
    "2^{n+1} = Θ(2^n) true; 2^{2n} = O(2^n) false. They will put both on the same paper.",
    "√(log n) is larger than log log n, so the smaller one is not an O-bound of the larger."
  ],

  scene: {
    nodes: [
      { id: "field", label: "more comparisons", type: "zone", pos: [0, 0, 0], size: [23, 15] },
      { id: "nlog", label: "n^{log n}", type: "point", pos: [-8, 0, 2.2], color: "#60a5fa" },
      { id: "nlogB", label: "(log n)²", type: "point", pos: [-3, 0, 1.0], color: "#60a5fa" },
      { id: "nlogC", label: "2 log log n", type: "point", pos: [3, 0, 0.2], color: "#60a5fa" },
      { id: "expA", label: "2^{√n}", type: "point", pos: [-8, 0, 0.4], color: "#f87171" },
      { id: "expB", label: "√n", type: "point", pos: [-3, 0, -1.4], color: "#f87171" },
      { id: "expC", label: "½ log n", type: "point", pos: [3, 0, -3.4], color: "#f87171" },
      { id: "win1", label: "2^{√n} larger", type: "note", pos: [8.5, 0, -1.6], showAt: 1 },
      { id: "twoN", label: "2^n → n", type: "server", pos: [-7, 0, 5.4], showAt: 2 },
      { id: "fourN", label: "2^{2n} → 2n", type: "server", pos: [2, 0, 5.4], showAt: 2 },
      { id: "keep", label: "keep the 2", type: "note", pos: [8.2, 0, 5.4], showAt: 2 },
      { id: "g1", label: "G1 n³→n²", type: "service", pos: [-7, 0, -6.4], showAt: 3 },
      { id: "g2", label: "G2 n²→n³", type: "lb", pos: [2, 0, -6.4], showAt: 3 },
      { id: "cut1", label: "n=100", type: "note", pos: [-7, 0, -4.2], showAt: 3 },
      { id: "cut2", label: "n=10⁴ tail", type: "note", pos: [2, 0, -4.2], showAt: 3 },
      { id: "tf1", label: "(n+k)²=Θ(n²)", type: "worker", pos: [-8, 0, -6.4], showAt: 4 },
      { id: "tf2", label: "2^{n+1}=Θ(2^n)", type: "worker", pos: [-2.5, 0, 2.2], showAt: 4 },
      { id: "tf3", label: "2^{2n}≠O(2^n)", type: "gateway", pos: [4.5, 0, 2.2], showAt: 5 },
      { id: "tf4", label: "√log n ≰ O(loglog n)", type: "note", pos: [8.0, 0, 2.2], showAt: 5 },
      { id: "tf5", label: "n^{log n}=O(2^n)", type: "cache", pos: [8.5, 0, -6.4], showAt: 6 }
    ],
    edges: [
      { from: "nlog", to: "nlogB" },
      { from: "nlogB", to: "nlogC", showAt: 1 },
      { from: "expA", to: "expB" },
      { from: "expB", to: "expC", showAt: 1 },
      { from: "nlogC", to: "expC", showAt: 1, dashed: true, label: "<" },
      { from: "twoN", to: "fourN", showAt: 2, dashed: true, label: "n < 2n" },
      { from: "g1", to: "g2", showAt: 3, dashed: true, label: "tail G2" },
      { from: "tf2", to: "tf3", showAt: 5, dashed: true },
      { from: "nlog", to: "tf5", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "n^{log n} vs 2^{√n}: first log",
        text: "log gives (log n)² vs √n. Direction is still fuzzy. Do not stop here.",
        highlight: ["field", "nlog", "expA", "nlogB", "expB"]
      },
      {
        title: "Log again: 2 log log n vs ½ log n",
        text: "log log n is tiny next to log n, so 2^{√n} is the larger function. Repeat logs until the ranking is obvious.",
        highlight: ["nlogC", "expC", "win1"],
        flows: [
          { from: "nlogC", to: "expC", color: "#f87171", label: "<" }
        ]
      },
      {
        title: "2^n vs 2^{2n}: keep the 2",
        text: "After a log you have n vs 2n. Dropping the 2 would claim they are equal — wrong. 2^{2n} = 4^n strictly dominates. You may drop a 2 in 2n² vs n² only on the original functions.",
        highlight: ["twoN", "fourN", "keep"],
        flows: [
          { from: "twoN", to: "fourN", color: "#fb923c", label: "n < 2n" }
        ]
      },
      {
        title: "Piecewise: only the tail counts",
        text: "G1 is cubic then quadratic at 100. G2 is quadratic then cubic at 10,000. Before 100 G1 leads; 100–10,000 they tie on n²; after 10,000 G2 is forever larger. Asymptotic winner is G2.",
        highlight: ["g1", "g2", "cut1", "cut2"],
        flows: [
          { from: "g1", to: "g2", color: "#ff6a3d", label: "n>10⁴" }
        ]
      },
      {
        title: "True: (n+k)² and 2^{n+1}",
        text: "Binomial: highest term n², so (n+k)² = Θ(n²). 2^{n+1} = 2·2^n, drop the 2, Θ(2^n). Both true.",
        highlight: ["tf1", "tf2", "twoN"],
        hide: ["g1", "g2", "cut1", "cut2"]
      },
      {
        title: "False: 2^{2n} = O(2^n) and √log n = O(log log n)",
        text: "4^n is not bounded by a multiple of 2^n. √(log n) is larger than log log n, so the smaller curve cannot be an upper bound.",
        highlight: ["tf3", "tf4", "fourN"],
        fail: ["tf3"],
        hide: ["g1", "g2", "cut1", "cut2"],
        flows: [
          { from: "tf2", to: "tf3", color: "#f87171", label: "trap" }
        ]
      },
      {
        title: "True: n^{log n} = O(2^n)",
        text: "log: (log n)² vs n. Polynomial in log n loses to n, so n^{log n} is O(2^n). End of the notation chapter; next is divide and conquer.",
        highlight: ["tf5", "nlog", "win1"],
        hide: ["g1", "g2", "cut1", "cut2"],
        flows: [
          { from: "nlog", to: "tf5", color: "#4ade80", label: "O(2^n)" }
        ]
      }
    ]
  }
});
