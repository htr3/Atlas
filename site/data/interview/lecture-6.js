window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 6,
  title: "What is Fast Exponentiation?",
  video: "https://www.youtube.com/watch?v=-3Lt-EwR_Hw",
  category: "Interview Prep",
  tagline: "Square the half-power once: a^n in O(log n) multiplications, with a modular form.",
  summary: "Naive a^n multiplies a, n times. Divide-and-conquer computes r = a^⌊n/2⌋ once and returns r·r (times an extra a when n is odd). The call tree has depth log n, so the work is O(log n). Intermediate products overflow 64 bits quickly, so contest code folds a modulus through the same recurrence. The same skeleton powers matrices.",

  theory: [
    {
      heading: "Brute force is n multiplications",
      body: "The job is to compute <code>b = a^n</code>. The obvious loop multiplies <code>a</code> by itself n times. That is <code>O(n)</code> multiplications. For a contest exponent like 10^12, a 10^8-ops-per-second machine would sit there for thousands of seconds. You need the exponent to shrink exponentially, not linearly.",
      bullets: [
        "Input: base a, non-negative integer n. Output: a^n.",
        "n multiplies is correct and too slow.",
        "The exponent is the size that must drop."
      ]
    },
    {
      heading: "Split the product, reuse one half",
      body: "Write an even power as <code>a^n = a^{n/2} · a^{n/2}</code>. The two halves are the same subproblem. Compute <code>r = a^{n/2}</code> <b>once</b>, then return <code>r · r</code>. The second half is not a second recursive call — it is a multiply. That is the whole trick. If you actually forked both branches you would still pay Θ(n) work; the red branch in the lecture's tree is the one you never evaluate.",
      bullets: [
        "Even n: power(a, n/2), then square.",
        "Integer division floors when you later handle odds.",
        "Merging is one multiply, O(1)."
      ]
    },
    {
      heading: "Odd exponents and the two base cases",
      body: "If n is odd you cannot split into two equal integer powers. Take <code>r = a^{⌊n/2⌋}</code> and return <code>r · r · a</code> — the leftover factor is the extra <code>a</code>. Base cases: <code>n = 0</code> returns 1 (empty product), <code>n = 1</code> returns a. The recursive function is then: if n is 0 or 1, stop; else r = power(a, n/2); if n even return r*r else return r*r*a.",
      bullets: [
        "n odd ⇒ one extra multiply by a after the square.",
        "power(a, 0) = 1, power(a, 1) = a.",
        "n is halved (floored) every call, so you hit a base case."
      ]
    },
    {
      heading: "Worked chain: a^10",
      body: "10 is odd, so you want r = a^5 and then r·r·a. 5 is odd: r = a^2, then square and multiply by a. 2 is even: r = a^1, then square. 1 is a base case. Four frames, each doing a constant amount of arithmetic after the child returns. You never compute a second a^5. Reading the chain bottom-up: a → a^2 → a^5 → a^10.",
      bullets: [
        "10 → 5 → 2 → 1. Depth is floor(log2 n) + O(1).",
        "Each frame: one recursive call, then one or two multiplies.",
        "Binary view: square for each bit, multiply by a when the bit is 1."
      ]
    },
    {
      heading: "O(log n), not O(n)",
      body: "The recurrence is T(n) = T(⌊n/2⌋) + O(1) with T(1) = O(1). Unrolling: you branch until n / 2^x = 1, so x = log2 n. About log n calls and log n merges. For n = 10^12 that is roughly 40 multiplications versus 10^12. The lecture's order-of-magnitude: a billion-scale loop is ~10^4 seconds; forty multiplies are microseconds. Algorithm choice here is not a constant — it is the difference between timing out and finishing.",
      bullets: [
        "T(n) = T(n/2) + O(1) = Θ(log n).",
        "n = 10^12 → about 40 multiplies, not 10^12.",
        "Iterative binary exponentiation is the same bound without recursion depth."
      ]
    },
    {
      heading: "Why you always take a modulus",
      body: "a^n itself is huge. 8^10 is already about a billion; 8^20 = 2^80, which does not fit in a 64-bit word (2^64). Contest statements therefore ask for <code>a^n mod m</code>. The identity you need is <code>(a^n) mod m = ((a^{n/2} mod m) · (a^{n/2} mod m)) mod m</code> (and an extra <code>· a</code> when n is odd). Proof: write P = a^{n/2} = mQ + R with 0 ≤ R &lt; m. Left side is (R)(R) mod m. Right side expands (mQ + R)^2 = m(…) + R^2, so mod m it is also R^2. Fold <code>% m</code> after every multiply and the intermediates stay in range.",
      bullets: [
        "Replace every r*r with (r*r) % m, and r*r*a with (r*r%m * a)%m.",
        "Same recurrence, same O(log n) multiplications.",
        "Watch overflow on the multiply itself (use 128-bit, or multiply-mod carefully)."
      ]
    },
    {
      heading: "Matrices and contests",
      body: "The base a does not have to be a scalar. If A is a square matrix, A^n is the same even/odd split: compute R = A^{n/2}, return R·R (and ·A if n is odd). Fibonacci, linear recurrences, and graph walks all reduce to a small matrix power. That is why fast exponentiation shows up constantly in programming contests: one pattern covers integers, modular integers, and matrices.",
      bullets: [
        "Matrix multiply replaces scalar multiply; complexity is still O(log n) multiplies.",
        "Each multiply is O(d^3) for a d×d matrix.",
        "Keep taking % m on every cell if the statement is modular."
      ]
    }
  ],

  keyTerms: [
    { term: "Fast / binary exponentiation", def: "Compute a^n by repeated squaring of a^{n/2} instead of n multiplies." },
    { term: "Even case", def: "n even: r = a^{n/2}, return r*r. One recursive call." },
    { term: "Odd case", def: "n odd: r = a^{⌊n/2⌋}, return r*r*a." },
    { term: "Base cases", def: "a^0 = 1, a^1 = a. Recursion stops here." },
    { term: "Reuse, do not fork", def: "The second a^{n/2} is the same r; forking both halves would still be linear." },
    { term: "Modular multiply", def: "(P mod m)(P mod m) mod m equals P^2 mod m, so you may reduce after every square." },
    { term: "Matrix power", def: "The same even/odd skeleton with matrix multiplication as the merge step." },
    { term: "Θ(log n)", def: "The exponent halves each call, so the depth is log2 n." }
  ],

  tradeoffs: [
    { pro: "Naive loop: obvious, fine for tiny n.", con: "O(n) multiplies; dies on 10^9+ exponents." },
    { pro: "Recursive squaring: O(log n), short function, matches the proof.", con: "O(log n) stack frames; an iterative bit loop avoids that." },
    { pro: "Reduce mod m after every multiply: answers fit in 64 bits.", con: "The multiply r*r can still overflow before the %; need a wide type." },
    { pro: "Same code path for matrices and Fibonacci.", con: "A d×d multiply is O(d^3); log n does not hide a large d." }
  ],

  interviewTips: [
    "Write the even/odd recurrence and the two bases before optimizing anything.",
    "Say out loud that you compute a^{n/2} once — interviewers listen for the reused r.",
    "Quote T(n) = T(n/2)+O(1) = O(log n) and contrast with the n-multiply loop.",
    "Ask whether the answer is a^n or a^n mod m. If modular, % after every multiply and prove the identity if asked.",
    "Give the 10^12 vs ~40 multiplies picture so they see you feel the constants.",
    "Offer matrix exponentiation if the follow-up is Fibonacci or a linear recurrence."
  ],

  scene: {
    nodes: [
      { id: "p10", label: "a^10", type: "point", pos: [0, 0, 6], color: "#fb923c" },
      { id: "p5", label: "a^5", type: "point", pos: [0, 0, 3], color: "#fb923c", showAt: 1 },
      { id: "p2", label: "a^2", type: "point", pos: [0, 0, 0], color: "#fb923c", showAt: 2 },
      { id: "p1", label: "a^1 = a", type: "point", pos: [0, 0, -3], color: "#4ade80", showAt: 2 },
      { id: "g5", label: "reuse a^5", type: "point", pos: [5, 0, 3], color: "#64748b", showAt: 1 },
      { id: "g2", label: "reuse a^2", type: "point", pos: [5, 0, 0], color: "#64748b", showAt: 2 },
      { id: "nnaive", label: "naive O(n) muls", type: "note", pos: [-8, 0, 6] },
      { id: "nlog", label: "depth log2 n", type: "note", pos: [8, 0, 6], showAt: 4 },
      { id: "nodd", label: "odd: r*r*a", type: "note", pos: [-6, 0, 3], showAt: 2 },
      { id: "neven", label: "even: r*r", type: "note", pos: [-6, 0, 0], showAt: 1 },
      { id: "nb0", label: "n=0 → 1", type: "note", pos: [-6, 0, -3], showAt: 2 },
      { id: "nb1", label: "n=1 → a", type: "note", pos: [6, 0, -3], showAt: 2 },
      { id: "nbig", label: "10^12 vs ~40", type: "note", pos: [8, 0, 0], showAt: 4 },
      { id: "nmod", label: "(r*r) mod m", type: "note", pos: [8, 0, -6], showAt: 5 },
      { id: "nmat", label: "same for matrices", type: "note", pos: [-8, 0, -6], showAt: 6 }
    ],
    edges: [
      { from: "p10", to: "p5", label: "n/2", showAt: 1 },
      { from: "p10", to: "g5", label: "skip", showAt: 1, dashed: true },
      { from: "p5", to: "p2", showAt: 2 },
      { from: "p5", to: "g2", dashed: true, showAt: 2 },
      { from: "p2", to: "p1", showAt: 2 },
      { from: "p1", to: "nb0", showAt: 2, dashed: true }
    ],
    steps: [
      {
        title: "a^n the slow way",
        text: "Multiply a by itself n times. Correct, O(n), and hopeless for large exponents. The rest of the lecture is how to drop that n to log n.",
        highlight: ["p10", "nnaive"]
      },
      {
        title: "Split, but compute one half",
        text: "a^n = a^{n/2} · a^{n/2} when n is even. The two factors are identical. Recurse once, square the result. The gray sibling is never evaluated.",
        highlight: ["p10", "p5", "g5", "neven"],
        flows: [
          { from: "p10", to: "p5", color: "#fb923c", label: "r" },
          { from: "p10", to: "g5", color: "#64748b", label: "skip" }
        ]
      },
      {
        title: "Odd n keeps an extra a",
        text: "10 is odd, so r = a^5 and the merge is r·r·a. 5 is odd the same way. 2 is even: just square. Floor-divide n by 2 each call. Base: n=0 returns 1, n=1 returns a.",
        highlight: ["p10", "p5", "p2", "p1", "nodd", "neven", "nb0", "nb1"],
        flows: [
          { from: "p5", to: "p2", color: "#fb923c", label: "⌊n/2⌋" },
          { from: "p2", to: "p1", color: "#4ade80", label: "base" }
        ]
      },
      {
        title: "One spine, not a full tree",
        text: "Blue in the talk is the computed spine a^10 → a^5 → a^2 → a. Red is the duplicate half you reuse. Forking both would still cost linear work. Reuse is what makes it fast.",
        highlight: ["p10", "p5", "p2", "p1", "g5", "g2"],
        flows: [
          { from: "p1", to: "p2", color: "#4ade80", label: "square" },
          { from: "p2", to: "p5", color: "#fb923c", label: "*a" },
          { from: "p5", to: "p10", color: "#fb923c", label: "*a" }
        ]
      },
      {
        title: "Depth is log n",
        text: "You halt when n / 2^x = 1, so x = log2 n. Each frame is O(1) after the child returns, so T(n) = Θ(log n). n = 10^12 is about forty multiplies, not 10^12. That is microseconds versus hours.",
        highlight: ["p10", "p1", "nlog", "nbig", "nnaive"]
      },
      {
        title: "a^n overflow, so take mod m",
        text: "8^10 is already ~10^9; 8^20 = 2^80, past a 64-bit long. Problems ask for a^n mod m. Because (R)(R) mod m = (mQ+R)^2 mod m, you may square residues: return (r*r)%m, or (r*r*a)%m when n is odd.",
        highlight: ["p10", "nmod", "nbig"],
        fail: ["p10"],
        flows: [
          { from: "p5", to: "p10", color: "#60a5fa", label: "% m" }
        ]
      },
      {
        title: "The base can be a matrix",
        text: "Swap scalar multiply for matrix multiply and the same even/odd code computes A^n. Fold % m into every cell. Fibonacci, recurrences, and contest graph walks all sit on this one pattern.",
        highlight: ["p10", "p5", "nmat", "nmod"],
        flows: [
          { from: "p5", to: "p10", color: "#c084fc", label: "A·A" }
        ]
      }
    ]
  }
});
