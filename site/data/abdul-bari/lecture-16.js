window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 16,
  title: "1.11 Best Worst and Average Case Analysis",
  video: "https://www.youtube.com/watch?v=lj3E24nnPjI",
  category: "Algorithm Foundations",
  tagline: "Linear search is Θ(1)/Θ(n)/Θ(n); BST worst-case height is log n to n.",
  summary: "Cases are kinds of analysis, not kinds of notation. Linear search: best is the first index (Θ(1)), worst is the last or a miss (Θ(n)), average is (n+1)/2 (still Θ(n)). Any of O, Ω, Θ may stamp any case. In a BST the worst case is a leaf, and that time is the height: as small as log n on a balanced tree, as large as n on a skew tree.",

  theory: [
    {
      heading: "Cases vs notations",
      body: "Best, worst, and average describe <i>which inputs</i> you measure. O, Ω, and Θ describe <i>how you bound the resulting function</i>. They are independent. The best-case function can be written Θ(1) or O(1) or Ω(1). The worst-case function can be written Θ(n) or O(n). The myth 'Big-O is worst case, Omega is best case' is the mistake this lecture exists to kill.",
      bullets: [
        "Case = which input family.",
        "Notation = envelope on the time function of that family.",
        "Use whichever notation fits the function you just derived."
      ]
    },
    {
      heading: "Linear search, best and worst",
      body: "Scan the list of n keys from the left, one comparison per index, until the key hits or the list ends. Searching 7 in the lecture's list succeeds after a handful of probes; searching 20 walks the whole list and fails. <b>Best case</b>: the key sits at the first index (the lecture's 8). One comparison, constant time, B(n) = 1 = Θ(1). <b>Worst case</b>: the key sits at the last index (18) or is absent. n comparisons, W(n) = n = Θ(n).",
      bullets: [
        "Successful and unsuccessful searches are both allowed in the worst case.",
        "Time is counted in comparisons, not wall clock."
      ]
    },
    {
      heading: "Average is (n+1)/2, and we rarely compute it",
      body: "Average case = (sum of times over all cases) / (number of cases). For a successful search with the key equally likely at any index, times are 1, 2, …, n. Sum is n(n+1)/2, divide by n, get (n+1)/2, which is still linear — Θ(n). Average-case analysis is messy on most algorithms, often lands in the same class as the worst case, and is therefore skipped. Prefer worst-case time as the number you quote.",
      bullets: [
        "A(n) = (n+1)/2 = Θ(n) for linear search.",
        "Equal to Θ of the worst case here — a common pattern.",
        "If the key may be absent you must add that extra case; the class stays Θ(n)."
      ]
    },
    {
      heading: "Stamp any case with any notation",
      body: "B(n) = 1 belongs to the constant class: Θ(1), and also O(1), Ω(1). W(n) = n belongs to the linear class: Θ(n), O(n), Ω(n). A(n) = (n+1)/2 is linear too: Θ(n). There is no reserved symbol for 'best' or 'worst'. Write the function, then pick a bound.",
      bullets: [
        "Best-case linear search is not 'Omega' because Omega means lower bound.",
        "Worst-case linear search is not 'O' because O means upper bound."
      ]
    },
    {
      heading: "BST: best is the root, worst is a leaf",
      body: "A binary search tree stores smaller keys left, larger right. Search 15 from root 20: left to 10, right to 15 — three comparisons, equal to the height on a balanced 8-node tree (log₂ 8 = 3). <b>Best</b>: the key is the root (20). One comparison, Θ(1), same as linear search. <b>Worst</b>: the key is a leaf (5, 15, 35, 40 in the picture). Time equals the length of that root-to-leaf path, i.e. the <b>height h</b>.",
      bullets: [
        "Balanced picture: h = log n, so worst case is Θ(log n).",
        "Do not write 'worst case = log n' as a universal BST law — it depends on shape."
      ]
    },
    {
      heading: "Min worst case log n, max worst case n",
      body: "The same seven keys can form a left-skewed chain 40-30-25-20-15-10-5. That is still a BST. Best case is still the root (Θ(1)). The only leaf is at depth n, so worst-case time is Θ(n). Height of a BST ranges from ⌊log₂ n⌋ (perfectly balanced) to n−1 (sorted insertions). Competitive-exam wording: minimum worst-case time Θ(log n), maximum worst-case time Θ(n). Write W(n) = Θ(h) with log n ≤ h ≤ n, then instantiate h from the shape.",
      bullets: [
        "Worst case is 'search a leaf' in both shapes.",
        "The time of that worst case is the height, not a single formula.",
        "Balanced trees exist to lock h at log n."
      ]
    }
  ],

  keyTerms: [
    { term: "Best case", def: "Input family that minimizes comparisons. Linear search: first index. BST: the root." },
    { term: "Worst case", def: "Input family that maximizes comparisons. Linear search: last index or miss. BST: a leaf." },
    { term: "Average case", def: "Mean time over a stated distribution of cases. Linear search: (n+1)/2." },
    { term: "B(n), W(n), A(n)", def: "Best / worst / average time functions. Each may be stamped with O, Ω, or Θ." },
    { term: "BST height h", def: "Length of the longest root-to-leaf path. Worst-case search is Θ(h), and log n ≤ h ≤ n." },
    { term: "Skew BST", def: "A chain (sorted insertions). Height n, worst-case search Θ(n)." }
  ],

  tradeoffs: [
    { pro: "Worst-case time is always defined and is what you quote in interviews.", con: "It can be a rare input (sorted data into a BST) and look pessimistic." },
    { pro: "Average case for linear search is a one-line arithmetic series.", con: "On most algorithms the case set is too large; the answer often matches worst-case class anyway." },
    { pro: "A balanced BST makes worst-case search Θ(log n).", con: "The same keys in sorted order make the BST a list and worst-case Θ(n)." }
  ],

  interviewTips: [
    "Linear search: best Θ(1) at index 0, worst Θ(n) at the end or a miss, average (n+1)/2 = Θ(n).",
    "If they pair O with worst and Ω with best, correct them with this lecture's line.",
    "BST best is always the root. BST worst is a leaf: Θ(h), not automatically Θ(log n).",
    "Say 'minimum worst-case Θ(log n), maximum worst-case Θ(n)' — that phrasing is the exam item.",
    "Prefer quoting worst case unless they ask for average; say why average is rare."
  ],

  scene: {
    nodes: [
      { id: "row", label: "linear search list", type: "zone", pos: [-1, 0, 5.4], size: [22, 4.2] },
      { id: "a0", label: "8*", type: "point", pos: [-9, 0, 5.4], color: "#4ade80" },
      { id: "a1", label: "k", type: "point", pos: [-6, 0, 5.4], color: "#60a5fa" },
      { id: "a2", label: "k", type: "point", pos: [-3, 0, 5.4], color: "#60a5fa" },
      { id: "a3", label: "k", type: "point", pos: [0, 0, 5.4], color: "#60a5fa" },
      { id: "a4", label: "7", type: "point", pos: [3, 0, 5.4], color: "#facc15" },
      { id: "a5", label: "k", type: "point", pos: [6, 0, 5.4], color: "#60a5fa" },
      { id: "a6", label: "18", type: "point", pos: [9, 0, 5.4], color: "#f87171" },
      { id: "bestN", label: "best Θ(1)", type: "note", pos: [-9, 0, 7.4] },
      { id: "avgN", label: "avg (n+1)/2", type: "note", pos: [0, 0, 7.4], showAt: 2 },
      { id: "worstN", label: "worst Θ(n)", type: "note", pos: [9, 0, 7.4], showAt: 1 },
      { id: "root", label: "20", type: "server", pos: [0, 0, -1.2], color: "#4ade80", showAt: 4 },
      { id: "ten", label: "10", type: "server", pos: [-5, 0, 1.4], color: "#60a5fa", showAt: 4 },
      { id: "thirty", label: "30", type: "server", pos: [5, 0, 1.4], color: "#60a5fa", showAt: 4 },
      { id: "five", label: "5", type: "point", pos: [-7.5, 0, 3.6], color: "#f87171", showAt: 4 },
      { id: "fifteen", label: "15", type: "point", pos: [-2.5, 0, 3.6], color: "#facc15", showAt: 4 },
      { id: "tf", label: "35", type: "point", pos: [2.5, 0, 3.6], color: "#f87171", showAt: 4 },
      { id: "forty", label: "40", type: "point", pos: [7.5, 0, 3.6], color: "#f87171", showAt: 4 },
      { id: "balN", label: "h = log n", type: "note", pos: [0, 0, -3.4], showAt: 4 },
      { id: "s40", label: "40", type: "server", pos: [-10, 0, -6.6], color: "#4ade80", showAt: 5 },
      { id: "s30", label: "30", type: "point", pos: [-7, 0, -6.6], color: "#60a5fa", showAt: 5 },
      { id: "s25", label: "25", type: "point", pos: [-4, 0, -6.6], color: "#60a5fa", showAt: 5 },
      { id: "s20", label: "20", type: "point", pos: [-1, 0, -6.6], color: "#60a5fa", showAt: 5 },
      { id: "s15", label: "15", type: "point", pos: [2, 0, -6.6], color: "#60a5fa", showAt: 5 },
      { id: "s10", label: "10", type: "point", pos: [5, 0, -6.6], color: "#60a5fa", showAt: 5 },
      { id: "s5", label: "5", type: "point", pos: [8, 0, -6.6], color: "#f87171", showAt: 5 },
      { id: "skewN", label: "h = n  (skew)", type: "note", pos: [-1, 0, -4.6], showAt: 5 },
      { id: "range", label: "log n ≤ h ≤ n", type: "lb", pos: [8.5, 0, -4.6], showAt: 6 }
    ],
    edges: [
      { from: "a0", to: "a1" },
      { from: "a1", to: "a2" },
      { from: "a2", to: "a3" },
      { from: "a3", to: "a4" },
      { from: "a4", to: "a5" },
      { from: "a5", to: "a6" },
      { from: "root", to: "ten", showAt: 4 },
      { from: "root", to: "thirty", showAt: 4 },
      { from: "ten", to: "five", showAt: 4 },
      { from: "ten", to: "fifteen", showAt: 4 },
      { from: "thirty", to: "tf", showAt: 4 },
      { from: "thirty", to: "forty", showAt: 4 },
      { from: "s40", to: "s30", showAt: 5 },
      { from: "s30", to: "s25", showAt: 5 },
      { from: "s25", to: "s20", showAt: 5 },
      { from: "s20", to: "s15", showAt: 5 },
      { from: "s15", to: "s10", showAt: 5 },
      { from: "s10", to: "s5", showAt: 5 }
    ],
    steps: [
      {
        title: "Best case: first index, Θ(1)",
        text: "Linear search starts at the left. If the key is 8 at index 0, one comparison and stop. B(n) = 1, constant class — write Θ(1) or O(1) or Ω(1).",
        highlight: ["row", "a0", "bestN"],
        flows: [
          { from: "bestN", to: "a0", color: "#4ade80", label: "1 probe" }
        ]
      },
      {
        title: "Worst case: last index or a miss, Θ(n)",
        text: "Key 18 at the end, or a missing 20, both force n comparisons. W(n) = n = Θ(n). Successful last-hit and unsuccessful search share this case.",
        highlight: ["a0", "a6", "worstN", "a4"],
        fail: ["a6"],
        flows: [
          { from: "a0", to: "a6", color: "#f87171", label: "n probes" }
        ]
      },
      {
        title: "Average (n+1)/2, still Θ(n)",
        text: "Keys equally likely at each index: times 1+2+…+n, divide by n, get (n+1)/2. Same linear class as worst. Average is extra work and often skipped; quote worst case.",
        highlight: ["a0", "a4", "a6", "avgN"],
        flows: [
          { from: "a0", to: "a4", color: "#facc15", label: "mean" }
        ]
      },
      {
        title: "Notations are not cases",
        text: "Best, worst, average are analyses. O, Ω, Θ are envelopes. Stamp B(n)=1 as Θ(1) and W(n)=n as Θ(n). Do not reserve O for worst or Ω for best.",
        highlight: ["bestN", "worstN", "avgN"]
      },
      {
        title: "Balanced BST: search 15 in log n",
        text: "20 → 10 → 15, three comparisons, height log₂ 8 = 3. Best case is still the root 20 (Θ(1)). Worst case is a leaf, time = height = log n.",
        highlight: ["root", "ten", "fifteen", "balN", "five", "forty"],
        flows: [
          { from: "root", to: "ten", color: "#4ade80", label: "L" },
          { from: "ten", to: "fifteen", color: "#facc15", label: "15" }
        ]
      },
      {
        title: "Skew BST: same keys, height n",
        text: "40-30-25-20-15-10-5 is a legal BST. Best is still the root. The leaf 5 sits at depth n, so worst-case search is Θ(n). Worst case was 'a leaf' both times; the time changed with h.",
        highlight: ["s40", "s5", "skewN", "s20"],
        fail: ["s5"],
        flows: [
          { from: "s40", to: "s5", color: "#f87171", label: "h=n" }
        ]
      },
      {
        title: "log n ≤ h ≤ n",
        text: "Minimum worst-case time Θ(log n) on a balanced tree; maximum worst-case time Θ(n) on a chain. Write W(n)=Θ(h) and instantiate h from the shape. That is the exam sentence.",
        highlight: ["range", "balN", "skewN", "root", "s40"]
      }
    ]
  }
});
