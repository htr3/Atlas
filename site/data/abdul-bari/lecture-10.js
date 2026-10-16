window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 10,
  title: "1.7 Compare Class of Functions",
  video: "https://www.youtube.com/watch?v=5v-tKX2uRAk",
  category: "Algorithm Foundations",
  tagline: "log n < n < n log n < n^k < 2^n — judge after the crossover, not at n=8.",
  summary: "Classes of time functions are ranked by how fast they grow as n goes to infinity. Sampling small n can show ties or even reversals; after a crossover the faster class stays ahead forever. Polynomials of any fixed degree lose to exponentials, so n^100 is still o(2^n).",

  theory: [
    {
      heading: "The growth ladder",
      body: "Write the usual families in <b>increasing order of growth</b>: constants, then <code>log n</code>, then <code>√n</code>, then <code>n</code>, then <code>n log n</code>, then <code>n²</code>, then <code>n³</code>, then any <code>n^k</code> for a fixed k, then <code>2^n</code>, then <code>3^n</code>, then <code>n!</code>. Each class on the right eventually outruns every class on the left. The lecture's working subset is <code>log n</code>, <code>n</code>, <code>n²</code>, <code>2^n</code> — enough to see a slow curve, a line, a parabola, and an explosion.",
      bullets: [
        "log n grows slower than any positive power of n.",
        "n^k grows slower than c^n for any fixed k and any c > 1.",
        "The ladder is about large n, not a ranking of values at n = 10."
      ]
    },
    {
      heading: "Sample n = 1, 2, 4, 8",
      body: "Plug in powers of two (log base 2). At <b>n = 1</b>: log 1 = 0, n = 1, n² = 1, 2¹ = 2. At <b>n = 2</b>: log 2 = 1, n = 2, n² = 4, 2² = 4 — n² and 2^n <i>tie</i>. At <b>n = 4</b>: log 4 = 2, n = 4, n² = 16, 2⁴ = 16 — they tie again. At <b>n = 8</b>: log 8 = 3, n = 8, n² = 64, 2⁸ = 256. The exponential has already pulled away. One more step to n = 9: log 9 ≈ 3.17, 9² = 81, 2⁹ = 512. The gap doubles each time n increases by 1.",
      bullets: [
        "Early ties are allowed: 2² = 2² and 4² = 2⁴.",
        "After n = 4 the exponential is strictly larger and stays larger.",
        "A few sample points are a proof sketch, not a proof — they show the trend you then argue for all larger n."
      ]
    },
    {
      heading: "Crossover, then forever",
      body: "Before the crossover, a slower function can sit above a faster one. After it, the faster function <b>never falls behind again</b>. That is the whole point of ranking classes: there exists some n₀ such that for every n ≥ n₀ the inequality holds. Do not pick n = 1 or n = 10 and declare a winner. Input size is unbounded; n runs toward infinity.",
      bullets: [
        "n₀ can be huge; the ranking still counts.",
        "Graph picture: log n is almost flat, n is a line, n² bends up, 2^n is a wall."
      ]
    },
    {
      heading: "Any polynomial loses to 2^n",
      body: "The same story scales. <code>n^100</code> looks monstrous at classroom values of n, but it is still a polynomial. There is a (very large) n₀ after which <code>2^n > n^100</code>, and from that n₀ onward the exponential stays on top. Raising the degree to 200 or 1000 only pushes n₀ farther out. It never changes the class order. That is why the ladder writes <code>n^k < 2^n</code> for every fixed k.",
      bullets: [
        "Fixed exponent on n vs n in the exponent: different worlds.",
        "If the base of the exponential is any constant c > 1, the same claim holds."
      ]
    },
    {
      heading: "Why the order is exam-critical",
      body: "Once you can compare two classes, you can drop lower-order terms, pick the closest bound, and decide which algorithm wins for large n. A Θ(n log n) sort beats a Θ(n²) sort for large arrays even if the quadratic looks faster on n = 8. The lecture treats this ranking as the most important takeaway of the function-class chapter — memorize the ladder, then justify it with a table and a sketch of the curves.",
      bullets: [
        "Use the ladder to name the dominant term of a sum.",
        "Never argue complexity from n = 10."
      ]
    }
  ],

  keyTerms: [
    { term: "Class of a function", def: "The growth family a time (or space) function belongs to: log n, n, n², 2^n, …" },
    { term: "Increasing order of growth", def: "The ranking log n < n < n log n < n² < n^k < 2^n < n! as n → ∞." },
    { term: "Crossover n₀", def: "A threshold after which the faster function stays strictly larger for every bigger n." },
    { term: "Polynomial vs exponential", def: "n^k for fixed k is polynomial; c^n with c > 1 is exponential and eventually larger." },
    { term: "Sample table", def: "Evaluating log n, n, n², 2^n at n = 1, 2, 4, 8 to watch ties break." },
    { term: "Asymptotic comparison", def: "Decide which function is larger for all sufficiently large n, ignoring a finite prefix." }
  ],

  tradeoffs: [
    { pro: "A four-row table at n = 1, 2, 4, 8 makes the exponential jump obvious.", con: "Sampling never proves the inequality for every n past the last sample." },
    { pro: "The growth ladder lets you drop every lower-order term at a glance.", con: "Judging the same functions at n = 8 can reverse the ranking and fail an exam." },
    { pro: "n^k < 2^n for any fixed k, so you never have to pick a 'large enough' degree.", con: "The crossover for n^100 vs 2^n is enormous, so plots of small n hide the truth." }
  ],

  interviewTips: [
    "Recite the ladder in order, then offer a 2^n vs n² table at n = 2, 4, 8 (tie, tie, 256 vs 64).",
    "Say 'there exists n₀ after which 2^n > n^k' — do not claim it for n = 10.",
    "If they ask n^100 vs 2^n, name the class winner (exponential) and admit n₀ is huge.",
    "Sketch four curves: log n flat, n linear, n² quadratic, 2^n vertical after the crossover.",
    "Complexity ranking is not a ranking of wall-clock time on a tiny input."
  ],

  scene: {
    nodes: [
      { id: "plot", label: "f(n) vs n", type: "zone", pos: [1, 0, 0], size: [22, 15] },
      { id: "axN", label: "n →", type: "note", pos: [8, 0, 7] },
      { id: "axF", label: "f(n) ↑", type: "note", pos: [-10.5, 0, -6.5] },
      { id: "t1", label: "n=1", type: "note", pos: [-7, 0, 7] },
      { id: "t2", label: "n=2", type: "note", pos: [-2, 0, 7] },
      { id: "t4", label: "n=4", type: "note", pos: [3, 0, 7] },
      { id: "t8", label: "n=8", type: "note", pos: [8, 0, 7] },
      { id: "l1", label: "0", type: "point", pos: [-7, 0, 5.5], color: "#4ade80" },
      { id: "l2", label: "1", type: "point", pos: [-2, 0, 4.6], color: "#4ade80" },
      { id: "l4", label: "2", type: "point", pos: [3, 0, 3.8], color: "#4ade80" },
      { id: "l8", label: "log n", type: "point", pos: [8, 0, 3.2], color: "#4ade80" },
      { id: "n1", label: "1", type: "point", pos: [-7, 0, 4.4], color: "#60a5fa" },
      { id: "n2p", label: "2", type: "point", pos: [-2, 0, 3.4], color: "#60a5fa" },
      { id: "n4", label: "4", type: "point", pos: [3, 0, 2.2], color: "#60a5fa" },
      { id: "n8", label: "n", type: "point", pos: [8, 0, 1.0], color: "#60a5fa" },
      { id: "q1", label: "1", type: "point", pos: [-7, 0, 4.4], color: "#fb923c" },
      { id: "q2", label: "4", type: "point", pos: [-2, 0, 2.4], color: "#fb923c" },
      { id: "q4", label: "16", type: "point", pos: [3, 0, 0.2], color: "#fb923c" },
      { id: "q8", label: "n²=64", type: "point", pos: [8, 0, -1.6], color: "#fb923c" },
      { id: "e1", label: "2", type: "point", pos: [-7, 0, 3.6], color: "#f87171" },
      { id: "e2", label: "4", type: "point", pos: [-2, 0, 2.4], color: "#f87171" },
      { id: "e4", label: "16", type: "point", pos: [3, 0, 0.2], color: "#f87171" },
      { id: "e8", label: "2ⁿ=256", type: "point", pos: [8, 0, -6.5], color: "#f87171" },
      { id: "legL", label: "log n slowest", type: "note", pos: [-10.5, 0, 3.2], showAt: 1 },
      { id: "legN", label: "n linear", type: "note", pos: [-10.5, 0, 1.0], showAt: 1 },
      { id: "legQ", label: "n² parabola", type: "note", pos: [-10.5, 0, -1.6], showAt: 2 },
      { id: "legE", label: "2ⁿ explodes", type: "note", pos: [-10.5, 0, -6.5], showAt: 3 },
      { id: "tie", label: "ties at n=2,4", type: "note", pos: [1, 0, -3.2], showAt: 2 },
      { id: "cross", label: "after n=4, 2ⁿ wins", type: "note", pos: [5.5, 0, -4.6], showAt: 3 },
      { id: "poly", label: "n^100 still < 2ⁿ", type: "service", pos: [-7, 0, -6.5], showAt: 4 },
      { id: "n0", label: "n₀ then forever", type: "lb", pos: [3, 0, -6.5], showAt: 5 }
    ],
    edges: [
      { from: "l1", to: "l2" },
      { from: "l2", to: "l4" },
      { from: "l4", to: "l8" },
      { from: "n1", to: "n2p" },
      { from: "n2p", to: "n4" },
      { from: "n4", to: "n8" },
      { from: "q1", to: "q2", showAt: 2 },
      { from: "q2", to: "q4", showAt: 2 },
      { from: "q4", to: "q8", showAt: 2 },
      { from: "e1", to: "e2", showAt: 2 },
      { from: "e2", to: "e4", showAt: 2 },
      { from: "e4", to: "e8", showAt: 3 },
      { from: "q8", to: "e8", showAt: 3, dashed: true, label: "gap" },
      { from: "poly", to: "e8", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Four curves on one n-axis",
        text: "n runs 1 → 2 → 4 → 8 on the axis. Height is f(n). log n (green) barely lifts. n (blue) is a line. The other two families are still stacked near the origin.",
        highlight: ["plot", "l1", "l2", "l4", "l8", "n1", "n8", "axN", "axF"]
      },
      {
        title: "n = 1: log 1 = 0, 2¹ = 2",
        text: "At n = 1 the values are 0, 1, 1, 2. Nothing about ranking is visible yet. Small-n pictures are allowed to lie.",
        highlight: ["t1", "l1", "n1", "q1", "e1", "legL", "legN"]
      },
      {
        title: "Ties at n = 2 and n = 4",
        text: "2² = 4 = n². 2⁴ = 16 = 4². n² (orange) and 2^n (red) land on the same points. A finite table can show equal or even reversed order.",
        highlight: ["t2", "t4", "q2", "e2", "q4", "e4", "tie", "legQ"],
        flows: [
          { from: "q2", to: "e2", color: "#fb923c", label: "tie" },
          { from: "q4", to: "e4", color: "#fb923c", label: "tie" }
        ]
      },
      {
        title: "n = 8: 64 vs 256",
        text: "log 8 = 3, n = 8, n² = 64, 2⁸ = 256. The exponential leaves the parabola. One more increment doubles 2^n while n² only adds a linear slice.",
        highlight: ["t8", "l8", "n8", "q8", "e8", "cross", "legE"],
        flows: [
          { from: "q8", to: "e8", color: "#f87171", label: "×4" }
        ]
      },
      {
        title: "n^100 still loses",
        text: "Raise the polynomial to n^100 or n^1000. There is still an n₀ after which 2^n is larger, and it stays larger. Degree only delays the crossover.",
        highlight: ["poly", "e8", "q8"],
        flows: [
          { from: "poly", to: "e8", color: "#c084fc", label: "eventually" }
        ]
      },
      {
        title: "From n₀ the ranking is frozen",
        text: "After the crossover the faster class never falls behind. That is why we rank functions for n → ∞, not for n = 8. Sketch the four curves and mark n₀.",
        highlight: ["n0", "e8", "q8", "n8", "l8", "cross"],
        flows: [
          { from: "n0", to: "e8", color: "#ff6a3d", label: "n ≥ n₀" }
        ]
      }
    ]
  }
});
