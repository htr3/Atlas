window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 14,
  title: "1.10.1 Comparison of Functions #1",
  video: "https://www.youtube.com/watch?v=mwN18xfwNhk",
  category: "Algorithm Foundations",
  tagline: "Sample a few n, or take logs; 3 n^{√n} and 2^{√n log n} are the same class.",
  summary: "To decide which of two time (or space) functions is the upper bound, either sample several n or apply log to both sides and compare the results with the log identities. Worked pairs: n² vs n³ (samples and 2 log n vs 3 log n), n² log n vs a log-n-heavy rival, and 3 n^{√n} vs 2^{√n log₂ n} which rewrites to n^{√n} and is asymptotically the same class.",

  theory: [
    {
      heading: "Two ways to compare",
      body: "Given two functions — times or spaces — you want to know which is larger for large n, i.e. which is an upper bound of the other. If the ladder already decides it, stop. Otherwise use (1) <b>sampling</b>: plug in a few n and watch the gap, or (2) <b>take log on both sides</b> so exponents become coefficients you can read. Sampling is a trend, not a proof; logs plus the identities below are the exam method for ugly closed forms.",
      bullets: [
        "Known pairs (n² vs n³) need no work.",
        "Ugly pairs: sample to guess, log to confirm."
      ]
    },
    {
      heading: "Sample n² against n³",
      body: "n = 2: 4 vs 8. n = 3: 9 vs 27. n = 4: 16 vs 64. Three samples already show n³ pulling away. That is method one on a pair you already know. Use it when the algebra is messy and you only need a direction before proving.",
      bullets: [
        "A handful of growing n is enough to see a monotone gap.",
        "Still argue 'for all n ≥ n₀' after you guess n₀ from the table."
      ]
    },
    {
      heading: "Log identities you must have",
      body: "log(ab) = log a + log b. log(a/b) = log a − log b. log(a^b) = b log a (the exponent drops in front). If a^b = n then b = log_a n. Change of base: log_b a = 1 / log_a b. Base 2 is the default in algorithms. These four lines are the only algebra the rest of the lecture uses.",
      bullets: [
        "Exponents become multipliers — that is why we take logs.",
        "Logs are monotone for arguments > 1, so they preserve inequality direction."
      ]
    },
    {
      heading: "n² log n vs a (log n)^10-looking rival",
      body: "The lecture writes f(n) = n² log n and a second function that looks larger because of a power 10 (spoken as (n log n)^10). After logs he compares 2 log n + log log n against log n + 10 log log n. The 2 log n term beats a single log n; log log n is 'paisa' next to the 'rupees' of log n, so even a 10× on the paisa does not flip the order. Under that arithmetic f is larger. Algebra check: if the rival is truly (n log n)^10 = n^10 (log n)^10, then log g = 10 log n + 10 log log n and <i>g</i> wins. If it is n (log n)^10, the spoken expansion is exact and f wins. Use the identities; do not trust the exponent 10 by eye.",
      bullets: [
        "Method: log both, drop to dominant terms, compare.",
        "log log n is negligible next to log n.",
        "A hanging exponent 10 can be on log n (weak) or on n (decisive) — expand before you bet."
      ]
    },
    {
      heading: "3 n^{√n} and 2^{√n log n} are the same class",
      body: "Rewrite the exponential with the identity 2^{log₂ n · √n} = n^{√n}. Then compare 3 n^{√n} with n^{√n}. The n^{√n} factors match; 3 is a constant coefficient. Asymptotically they are equal — the same story as 2n² vs n², both Θ(n²), even though the 2n² values are larger. You may take logs, but here the log-identity rewrite was enough. Constants never change the class.",
      bullets: [
        "2^{√n log₂ n} = n^{√n}.",
        "3 n^{√n} = Θ(n^{√n}).",
        "Value-wise 3 n^{√n} is bigger; class-wise they tie."
      ]
    }
  ],

  keyTerms: [
    { term: "Sampling method", def: "Evaluate both functions at a few increasing n and read which gap is growing." },
    { term: "Log method", def: "Apply log to both sides; compare the simplified expressions." },
    { term: "log(a^b) = b log a", def: "The identity that turns exponents into coefficients." },
    { term: "log log n", def: "Grows slower than log n ('paisa' vs 'rupees' in the lecture)." },
    { term: "2^{√n log₂ n}", def: "Rewrites to n^{√n}. Pair with 3 n^{√n} as the same Θ class." },
    { term: "Asymptotic equality", def: "Same class after ignoring constant factors, even if one curve sits higher." }
  ],

  tradeoffs: [
    { pro: "Sampling is instant on n² vs n³ and builds intuition for the crossover.", con: "A short table never proves the inequality for every larger n." },
    { pro: "Logs turn towers of exponents into sums you can compare termwise.", con: "Mis-expanding (n log n)^10 vs n (log n)^10 reverses the winner." },
    { pro: "Rewriting 2^{√n log n} as n^{√n} avoids taking logs at all.", con: "After a rewrite, dropping the 3 is legal for class and illegal for raw values." }
  ],

  interviewTips: [
    "Start with samples at n = 2, 3, 4 for n² vs n³, then say you would prove with logs: 2 log n < 3 log n.",
    "Write the four log identities before touching a GATE-style pair.",
    "Expand (n log n)^k fully (k log n + k log log n) before comparing to n² log n.",
    "Show 2^{√n log₂ n} = n^{√n}, then 3 n^{√n} = Θ(n^{√n}).",
    "Say 'asymptotically equal, value-wise larger' when only a constant remains."
  ],

  scene: {
    nodes: [
      { id: "grid", label: "compare f and g", type: "zone", pos: [0, 0, 0], size: [23, 15] },
      { id: "n2a", label: "4", type: "point", pos: [-8, 0, 4.2], color: "#60a5fa" },
      { id: "n2b", label: "9", type: "point", pos: [-3, 0, 3.2], color: "#60a5fa" },
      { id: "n2c", label: "16", type: "point", pos: [2, 0, 2.0], color: "#60a5fa" },
      { id: "n2d", label: "n²", type: "point", pos: [7, 0, 0.6], color: "#60a5fa" },
      { id: "n3a", label: "8", type: "point", pos: [-8, 0, 2.8], color: "#f87171" },
      { id: "n3b", label: "27", type: "point", pos: [-3, 0, 0.8], color: "#f87171" },
      { id: "n3c", label: "64", type: "point", pos: [2, 0, -1.6], color: "#f87171" },
      { id: "n3d", label: "n³", type: "point", pos: [7, 0, -4.2], color: "#f87171" },
      { id: "tick2", label: "n=2", type: "note", pos: [-8, 0, 6.6] },
      { id: "tick3", label: "n=3", type: "note", pos: [-3, 0, 6.6] },
      { id: "tick4", label: "n=4", type: "note", pos: [2, 0, 6.6] },
      { id: "logId", label: "log(a^b)=b log a", type: "note", pos: [-9.5, 0, -6.6], showAt: 1 },
      { id: "twoLog", label: "2 log n", type: "service", pos: [-3.5, 0, -6.6], color: "#60a5fa", showAt: 1 },
      { id: "threeLog", label: "3 log n", type: "service", pos: [3.5, 0, -6.6], color: "#f87171", showAt: 1 },
      { id: "fMix", label: "n² log n", type: "server", pos: [-7, 0, -2.4], showAt: 2 },
      { id: "gMix", label: "(log n)^10 ?", type: "server", pos: [0, 0, -2.4], showAt: 2 },
      { id: "paisa", label: "log log n paisa", type: "note", pos: [7.5, 0, -2.4], showAt: 2 },
      { id: "rew", label: "2^{√n log n}", type: "worker", pos: [-7, 0, 4.8], showAt: 3 },
      { id: "nRoot", label: "n^{√n}", type: "lb", pos: [0, 0, 4.8], showAt: 3 },
      { id: "threeN", label: "3 n^{√n}", type: "gateway", pos: [7, 0, 4.8], showAt: 3 },
      { id: "tie", label: "same Θ class", type: "note", pos: [0, 0, 7.2], showAt: 4 }
    ],
    edges: [
      { from: "n2a", to: "n2b" },
      { from: "n2b", to: "n2c" },
      { from: "n2c", to: "n2d" },
      { from: "n3a", to: "n3b" },
      { from: "n3b", to: "n3c" },
      { from: "n3c", to: "n3d" },
      { from: "n2d", to: "n3d", dashed: true, label: "<" },
      { from: "twoLog", to: "threeLog", showAt: 1, dashed: true, label: "<" },
      { from: "fMix", to: "gMix", showAt: 2, dashed: true },
      { from: "rew", to: "nRoot", showAt: 3, label: "=" },
      { from: "nRoot", to: "threeN", showAt: 3, dashed: true, label: "×3" }
    ],
    steps: [
      {
        title: "Sample n² vs n³ at 2, 3, 4",
        text: "4 vs 8, 9 vs 27, 16 vs 64. The cubic pulls away on every sample. Method one: a short table when you already know the ladder, or when you need a direction.",
        highlight: ["grid", "n2a", "n3a", "n2c", "n3c", "n2d", "n3d", "tick2", "tick4"],
        flows: [
          { from: "n2d", to: "n3d", color: "#f87171", label: "gap grows" }
        ]
      },
      {
        title: "Same pair by logs",
        text: "log(n²) = 2 log n, log(n³) = 3 log n. Same log n, coefficient 2 vs 3. Method two, and the one you write on an answer sheet.",
        highlight: ["twoLog", "threeLog", "logId", "n2d", "n3d"],
        flows: [
          { from: "twoLog", to: "threeLog", color: "#fb923c", label: "2 < 3" }
        ]
      },
      {
        title: "Ugly pair: expand before the exponent 10",
        text: "f = n² log n. A rival that 'looks' larger because of a power 10 must be expanded: 2 log n + log log n vs log n + 10 log log n (or 10 log n if the 10 sits on n). log log n is paisa. Dominant log-n terms decide. Expand first.",
        highlight: ["fMix", "gMix", "paisa", "logId"],
        flows: [
          { from: "fMix", to: "gMix", color: "#c084fc", label: "log both" }
        ]
      },
      {
        title: "Rewrite 2^{√n log₂ n} = n^{√n}",
        text: "Use a^b identities, not a fresh log of the whole pair. The exponential becomes n^{√n}. Left with 3 n^{√n} versus n^{√n}.",
        highlight: ["rew", "nRoot", "threeN"],
        flows: [
          { from: "rew", to: "nRoot", color: "#4ade80", label: "identity" }
        ]
      },
      {
        title: "Constant 3 does not change the class",
        text: "Like 2n² vs n²: value-wise 3 n^{√n} is larger, asymptotically they are equal — same Theta. Drop coefficients only for class, and only on the original functions, not after a log you still need to compare.",
        highlight: ["threeN", "nRoot", "tie", "n2d"],
        flows: [
          { from: "nRoot", to: "threeN", color: "#ff6a3d", label: "×3" }
        ]
      }
    ]
  }
});
