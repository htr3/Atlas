window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 3,
  title: "Prime Number Sieves",
  video: "https://www.youtube.com/watch?v=Xxu95iiVcPI",
  category: "Interview Prep",
  tagline: "Mark composites by prime strides to sqrt(n), then factor a range of size D.",
  summary: "A sieve keeps primes by crossing out their multiples. On 1..100 you skip 1, keep 2 and wipe evens (~n/2), keep 3 and wipe about n/6 new composites, skip 4 because 2 already marked its multiples, and stop strides at sqrt(n). The same jumps collect prime factors and exponents (54 = 2^1 * 3^3). For a short interval [A,B] with huge B, sieve primes only to sqrt(B) and mark that window — the CodeChef-scale 10^12 case.",

  theory: [
    {
      heading: "What a sieve leaves behind",
      body: "A sieve is a filter: after you finish marking, whatever is still unmarked is what you wanted. Here the wanted set is the primes in <b>1..n</b> (the lecture's grid is n = 100; yellow cells are prime, the rest composite). You will not test each k by trial division up to sqrt(k). You will let small primes stamp their multiples so those stamps never need a primality test.",
      bullets: [
        "Input: integers 1 through n.",
        "Output: the unmarked survivors — the primes.",
        "Brute force would be about n sqrt(n) trial divisions."
      ]
    },
    {
      heading: "Two, then three, then skip four",
      body: "1 divides everything, so it is not a prime and is thrown out. 2 has never been touched: add it to the prime list, then jump by 2 and mark 4, 6, 8, …, 100. About <b>n/2</b> cells die. 3 is still clean, so it is prime; jump by 3. Half of those multiples were already even, so you newly mark about <b>n/6</b> (n/3, minus the half 2 already got), including 9, 15, 99. 4 is already marked. Any multiple of 4 is a multiple of 2, and 2 already painted those cells — <b>never stride from a composite</b>. 5 is clean: prime, then jumps of 5 (10 is old, 15 is old, 20 is new, …).",
      bullets: [
        "Unmarked when first visited ⇒ prime, then mark its multiples.",
        "Already marked ⇒ skip; its divisor did the work.",
        "Two paints n/2 cells; three paints about n/6 new ones."
      ]
    },
    {
      heading: "Stop at sqrt(n), start inner at i^2",
      body: "Once the candidate i exceeds <b>sqrt(n)</b>, every product i·2, i·3, i·5, … is a product with a factor smaller than i, and that smaller prime already marked it. Starting the inner cursor at 2i still works; starting at <b>i^2</b> skips the redundant prefix (i·2 through i·(i−1) were marked by those smaller factors). Outer loop: i = 2 .. sqrt(n). Inner: j = i^2, 2i, … or the lecture's j = 2i; j += i, as long as j ≤ n. Time drops from n sqrt(n) to roughly <b>n log n</b>, and with the usual harmonic-of-primes analysis <b>n log n log log n</b>.",
      bullets: [
        "Outer i only up to sqrt(n).",
        "Inner jumps of i; optional start at i^2.",
        "Sieve time ≈ n log n (tighter: n log n log log n)."
      ]
    },
    {
      heading: "Factors while you mark: 4, 6, 49, 98, 54",
      body: "Keep an array A[k] that starts equal to k, plus a list of prime factors and a parallel frequency list. When i = 2 walks onto 4, divide until you cannot: 4/2 = 2, 2/2 = 1, so 4 = 2^2. Onto 6: 6/2 = 3, stop; later 3 will attach. 49 waits for 7 and becomes 7^2. 98 becomes (2, 7) with frequencies (1, 2). The long trace is <b>54</b>. Two marks it composite and, while 54 is even, divides once: A[54] = 27, PF = [2], freq = [1]. Three later hits 54: 27/3 = 9, add 3 with freq 1; 9 is still divisible, so bump 3's frequency to 2 and A = 3; one more divide, frequency 3, A = 1. Result: <b>54 = 2^1 × 3^3</b>. If the prime already sits in PF, increment frequency instead of pushing a duplicate.",
      bullets: [
        "A[k] starts as k and is divided in place.",
        "PF[k] holds distinct primes; freq[k] holds exponents.",
        "54: 2 once, then 3 three times."
      ]
    },
    {
      heading: "Loops in the factor sieve",
      body: "Outer i from 2 to sqrt(n). If i is untouched it is prime: append it, record PF[i] = [i], freq 1. Inner j = 2i, 3i, 4i, … ≤ n: mark touched[j], then while A[j] % i == 0, attach i to PF[j] (or bump its frequency) and divide A[j] by i. That inner while is what turns 54 into 27 then waits for 3. The same pass both kills composites and writes factorizations. Complexity stays on the order of <b>n log n log log n</b>.",
      bullets: [
        "Untouched i in the outer loop is prime.",
        "j strides by i; a while-divides loop strips that prime's full power.",
        "One grid walk yields primes and factor tables together."
      ]
    },
    {
      heading: "Segmented window [A, B] of length 20",
      body: "Now the puzzle is primes inside a short range of size 20, say 312..330, but B itself is huge. Sieving 1..B at n log n log log n is too slow. First collect every prime ≤ <b>sqrt(B)</b> with the ordinary sieve (cheap because the universe is only sqrt(B)). Then, on the window, stride those primes exactly as before: 2 wipes 312, 314, …, 330; 3 wipes 315, 318, …; continue through primes ≤ sqrt(B). Unmarked cells in the window are prime. Any composite in [A, B] has a prime factor ≤ sqrt(B), so the small primes are a complete stamp set. Time on the window is about <b>(B−A) log B log log B</b>, plus the cost of sieving 1..sqrt(B).",
      bullets: [
        "Precompute primes in 1..sqrt(B).",
        "Mark [A, B] with those strides only.",
        "Survivors in the window are the primes you wanted."
      ]
    },
    {
      heading: "Factors in the window, and the 10^12 budget",
      body: "The same small primes factor the window. 312 is even: divide to 156, bump 2; divide to 78; keep dividing by each prime ≤ sqrt(B) until the residue is 1 or a leftover prime (the lecture's live arithmetic wobbles — the method is repeated division, not a particular residue). If B = 10^12, sqrt(B) = 10^6, log2 of that is about 20, log log about 5, product ~10^8 operations — roughly a second. If the window length D is 10^5 and D ≤ sqrt(B), the window pass stays in the same budget. That is the segmented-sieve interview close.",
      bullets: [
        "Primes ≤ sqrt(B) also factor every integer in [A, B].",
        "B = 10^12 → sieve universe 10^6 → ~10^8 ops.",
        "Safe when D, the range length, is at most about sqrt(B)."
      ]
    }
  ],

  keyTerms: [
    { term: "Sieve", def: "Mark what you do not want; the remainder is the answer — here, primes." },
    { term: "Untouched", def: "A cell no smaller prime has stamped. First visit ⇒ the number is prime." },
    { term: "Stride of i", def: "Inner index j += i (or start at i^2) marking multiples of a prime i." },
    { term: "sqrt(n) cutoff", def: "No need to stride from a prime larger than sqrt(n); smaller factors already marked those products." },
    { term: "PF + frequency", def: "Per index, the distinct prime factors and the exponent of each." },
    { term: "Segmented sieve", def: "Sieve primes to sqrt(B), then mark only the short interval [A, B]." },
    { term: "n log n log log n", def: "Harmonic cost of marking by successive primes; also the factor-sieve bound in the talk." },
    { term: "Window length D", def: "B − A. Keep D modest (e.g. 10^5 vs B = 10^12) so the second pass fits in time." }
  ],

  tradeoffs: [
    { pro: "Classic sieve lists every prime in 1..n far faster than n trial divisions of cost sqrt(k).", con: "Needs Θ(n) memory for the boolean/touched array." },
    { pro: "Skipping composite i (like 4) avoids duplicate work; starting at i^2 trims more.", con: "Easy to stride from 4 anyway — correct but slower, and it hides the 'divisor already marked it' insight." },
    { pro: "Same inner jumps can emit full prime signatures (54 = 2^1 × 3^3).", con: "Per-index vectors of factors add memory and a while-divide inner loop." },
    { pro: "Segmented sieve handles B = 10^12 if D is small.", con: "You still pay a 1..sqrt(B) sieve; if D exceeds sqrt(B) the window pass can blow the limit." }
  ],

  interviewTips: [
    "Say you ignore 1, take 2 and mark n/2 evens, take 3 and mark about n/6 new cells, skip 4 because 2 already did its multiples.",
    "Cut the outer loop at sqrt(n) and mention starting j at i^2 as the standard micro-opt.",
    "Quote brute n sqrt(n) versus sieve ~ n log n / n log n log log n.",
    "Walk 54 out loud: divide by 2 once to 27, then by 3 three times to 1, exponents 1 and 3.",
    "For a huge B and a short [A,B], sieve only to sqrt(B) then stamp the window — that is the segmented question.",
    "Plug B = 10^12: sqrt = 10^6, ~20 × 5 × 10^6 ≈ 10^8, about a second if D is 10^5."
  ],

  scene: {
    nodes: [
      { id: "c1", label: "1", type: "point", pos: [-9, 0, 6], color: "#64748b" },
      { id: "c2", label: "2", type: "point", pos: [-6, 0, 6], color: "#4ade80" },
      { id: "c3", label: "3", type: "point", pos: [-3, 0, 6], color: "#4ade80" },
      { id: "c4", label: "4", type: "point", pos: [0, 0, 6], color: "#94a3b8" },
      { id: "c5", label: "5", type: "point", pos: [3, 0, 6], color: "#4ade80" },
      { id: "c6", label: "6", type: "point", pos: [6, 0, 6], color: "#94a3b8" },
      { id: "c7", label: "7", type: "point", pos: [9, 0, 6], color: "#4ade80" },
      { id: "c8", label: "8", type: "point", pos: [-9, 0, 3], color: "#94a3b8" },
      { id: "c9", label: "9", type: "point", pos: [-6, 0, 3], color: "#94a3b8" },
      { id: "c10", label: "10", type: "point", pos: [-3, 0, 3], color: "#94a3b8" },
      { id: "c11", label: "11", type: "point", pos: [0, 0, 3], color: "#4ade80" },
      { id: "c12", label: "12", type: "point", pos: [3, 0, 3], color: "#94a3b8" },
      { id: "c14", label: "14", type: "point", pos: [6, 0, 3], color: "#94a3b8" },
      { id: "c15", label: "15", type: "point", pos: [9, 0, 3], color: "#94a3b8" },
      { id: "c16", label: "16", type: "point", pos: [-9, 0, 0], color: "#94a3b8" },
      { id: "pr", label: "Prime list", type: "server", pos: [-9, 0, -4] },
      { id: "f54", label: "54", type: "server", pos: [-4, 0, -4], showAt: 5 },
      { id: "pf2", label: "2^1", type: "note", pos: [-1, 3, -4], showAt: 5 },
      { id: "pf3", label: "3^3", type: "note", pos: [2, 3, -4], showAt: 5 },
      { id: "r312", label: "312", type: "point", pos: [-6, 0, -7], showAt: 6, color: "#94a3b8" },
      { id: "r313", label: "313", type: "point", pos: [-3, 0, -7], showAt: 6, color: "#4ade80" },
      { id: "r315", label: "315", type: "point", pos: [0, 0, -7], showAt: 6, color: "#94a3b8" },
      { id: "r317", label: "317", type: "point", pos: [3, 0, -7], showAt: 6, color: "#4ade80" },
      { id: "r330", label: "330", type: "point", pos: [6, 0, -7], showAt: 6, color: "#94a3b8" },
      { id: "n0", label: "1..n  drop 1", type: "note", pos: [-12, 3, -7] },
      { id: "n1", label: "2 marks ~n/2", type: "note", pos: [12, 3, 2.5], showAt: 1 },
      { id: "n2", label: "3 marks ~n/6 new", type: "note", pos: [12, 3, 5], showAt: 2 },
      { id: "n3", label: "Skip 4; stop sqrt(n)", type: "note", pos: [12, 3, 8], showAt: 3 },
      { id: "n4", label: "j from i^2  n log n", type: "note", pos: [12, 3, 0], showAt: 4 },
      { id: "n5", label: "54 = 2 x 3^3", type: "note", pos: [12, 3, -3], showAt: 5 },
      { id: "n6", label: "[A,B] via primes to sqrt(B)", type: "note", pos: [-12, 3, 7], showAt: 6 },
      { id: "n7", label: "B=1e12 ~ 1e8 ops", type: "note", pos: [12, 3, -6], showAt: 7 }
    ],
    edges: [
      { from: "c2", to: "c4", label: "+2", showAt: 1 },
      { from: "c4", to: "c6", showAt: 1 },
      { from: "c6", to: "c8", showAt: 1 },
      { from: "c3", to: "c6", label: "+3", showAt: 2, dashed: true },
      { from: "c3", to: "c9", showAt: 2 },
      { from: "c9", to: "c12", showAt: 2 },
      { from: "c12", to: "c15", showAt: 2 },
      { from: "c2", to: "pr", label: "prime" },
      { from: "c3", to: "pr", showAt: 2 },
      { from: "c5", to: "pr", showAt: 3 },
      { from: "c2", to: "f54", showAt: 5, dashed: true },
      { from: "c3", to: "f54", showAt: 5, dashed: true },
      { from: "f54", to: "pf2", showAt: 5 },
      { from: "f54", to: "pf3", showAt: 5 }
    ],
    steps: [
      {
        title: "Drop 1, keep the grid",
        text: "Numbers 1 through n (the talk uses 100; this board shows the first slice). 1 divides every integer, so it is not prime. Yellow-style survivors will be the primes; the sieve's job is to paint the composites.",
        highlight: ["c1", "c2", "c3", "pr", "n0"],
        fail: ["c1"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6", "n7"]
      },
      {
        title: "2 is prime; wipe evens",
        text: "2 is untouched, so it enters the prime list. Jump by 2: 4, 6, 8, 10, 12, 14, 16, … up to n. About n/2 cells become composite. 11 is still clean; we have not visited it as a stride source yet.",
        highlight: ["c2", "c4", "c6", "c8", "c10", "pr", "n1"],
        fail: ["c4", "c6", "c8", "c10", "c12", "c14", "c16"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "c2", to: "c4", color: "#f87171", label: "+2" },
          { from: "c4", to: "c6", color: "#f87171", label: "+2" }
        ]
      },
      {
        title: "3 is prime; 4 is not a source",
        text: "3 was never stamped, so it is prime. Jumps of 3 paint 9, 12, 15, 99, … — about n/6 new marks because half of the multiples of 3 were already even. 4 is dirty; any multiple of 4 was already a multiple of 2, so do not stride from 4.",
        highlight: ["c3", "c9", "c15", "c4", "pr", "n2"],
        fail: ["c4", "c6", "c8", "c9", "c10", "c12", "c14", "c15", "c16"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "c3", to: "c9", color: "#fb923c", label: "+3" },
          { from: "c9", to: "c15", color: "#fb923c", label: "+3" }
        ]
      },
      {
        title: "5, then stop at sqrt(n)",
        text: "5 is still clean: prime, then stride 10, 15, 20, …. Once i > sqrt(n), every product i·p used a smaller prime p that already marked the cell. Outer loop ends at sqrt(n).",
        highlight: ["c5", "c10", "c15", "pr", "n3"],
        fail: ["c4", "c6", "c8", "c9", "c10", "c12", "c14", "c15", "c16"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "c5", to: "c10", color: "#c084fc", label: "+5" },
          { from: "c5", to: "c15", color: "#c084fc", label: "+5" }
        ]
      },
      {
        title: "Inner start i^2, time n log n",
        text: "You may begin j at i^2 instead of 2i; the skipped products were marked by smaller primes. Trial division of every k costs n sqrt(n). The sieve is about n log n, or n log n log log n with the prime-harmonic count.",
        highlight: ["c2", "c3", "c5", "c7", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6", "n7"]
      },
      {
        title: "Factor 54 while marking",
        text: "A[54] starts at 54. Stride 2 divides once to 27, PF=[2], freq=[1]. Stride 3 divides 27→9→3→1, bumping 3's exponent to 3. 54 = 2^1 × 3^3. Same idea writes 4=2^2, 49=7^2, 98=2^1×7^2.",
        highlight: ["f54", "pf2", "pf3", "c2", "c3", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6", "n7"],
        flows: [
          { from: "c2", to: "f54", color: "#60a5fa", label: "/2" },
          { from: "c3", to: "f54", color: "#fb923c", label: "/3 x3" }
        ]
      },
      {
        title: "Window 312..330",
        text: "Range length 20, B large. Sieve primes only to sqrt(B), then stamp the window: 2 kills 312 and 330, 3 kills 315, leftovers such as 313 and 317 stay prime. Every composite in [A,B] has a factor ≤ sqrt(B).",
        highlight: ["r312", "r313", "r315", "r317", "r330", "n6"],
        fail: ["r312", "r315", "r330"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n7"],
        flows: [
          { from: "c2", to: "r312", color: "#f87171", label: "2" },
          { from: "c3", to: "r315", color: "#fb923c", label: "3" }
        ]
      },
      {
        title: "Budget for B = 10^12",
        text: "sqrt(B) = 10^6, log about 20, log log about 5 → ~10^8 operations, around a second. A window D of 10^5 that is at most sqrt(B) stays inside that bound. Factor the window with the same small primes.",
        highlight: ["pr", "r313", "r317", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"]
      }
    ]
  }
});
