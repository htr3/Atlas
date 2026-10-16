window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 38,
  title: "2.9 Strassens Matrix Multiplication",
  video: "https://www.youtube.com/watch?v=0oJyNmEbS4w",
  category: "Divide & Conquer",
  tagline: "Eight block products are n^3; Strassen's seven products drop the exponent to 2.81.",
  summary: "The triple loop multiplies n-by-n matrices in Theta(n^3). Divide-and-conquer splits each matrix into four n/2 blocks and still does eight recursive multiplies plus n^2 additions, Master case 1, still n^3 — and it uses a stack, so the loops are better. Strassen replaces the eight products with seven combinations P..V. Recurrence 7 T(n/2)+n^2 solves to Theta(n^{log2 7}) ~ n^{2.81}. Worked 2x2: A=[[1,2],[3,4]], B=[[5,6],[7,8]] yields C=[[19,22],[43,50]].",

  theory: [
    {
      heading: "The schoolbook triple loop",
      body: "C = A B is defined only when A's column count equals B's row count. For n-by-n, <code>C[i][j] = sum_k A[i][k] * B[k][j]</code>. Three nested loops over n give <code>Theta(n^3)</code> scalar multiplies. That is the baseline. For a 2x2 the eight products are C11=A11 B11 + A12 B21, C12=A11 B12 + A12 B22, C21=A21 B11 + A22 B21, C22=A21 B12 + A22 B22.",
      bullets: [
        "Compatible shapes: inner dimensions match.",
        "Three loops, n^3 fused multiply-adds.",
        "2x2 uses exactly eight scalar multiplies."
      ]
    },
    {
      heading: "Small problem: 2x2 (or 1x1)",
      body: "Divide-and-conquer needs a size you solve outright. The lecture treats 2x2 as small: plug into the four formulas (constant time, eight multiplies). 1x1 is even smaller: one product. Dimensions are assumed to be powers of two (2,4,8,...,256) so repeated halving lands on 2x2. Pad a non-power with zeros to the next square power of two if you must.",
      bullets: [
        "n <= 2: use the closed 2x2 (or 1x1) formulas.",
        "Pad to a power of two so n/2 stays integral.",
        "Those eight multiplies are the cost you will try to cut."
      ]
    },
    {
      heading: "4x4 becomes four 2x2 blocks",
      body: "Cut each 4x4 into four 2x2 tiles: A11,A12,A21,A22 and the same for B. Treat a tile as a 'scalar' in the 2x2 product formula. Then C11 = A11 B11 + A12 B21, and so on — except each 'product' is itself a matrix multiply of size n/2, so you recurse. Eight recursive calls, plus additions of n/2-by-n/2 matrices. Addition of two n-by-n matrices is n^2 corresponding sums, so the combine cost is Theta(n^2).",
      bullets: [
        "Four blocks per matrix, same four-formula layout.",
        "Each block product is MM(·,·, n/2).",
        "The '+' is matrix addition, n^2 work, not a scalar add."
      ]
    },
    {
      heading: "Naive D&C is still n^3",
      body: "T(n) = 8 T(n/2) + n^2 for n>2, T(2)=Theta(1). Master: a=8, b=2, f(n)=n^2, log_b a = 3 > 2, case 1, so <code>Theta(n^3)</code>. The recursive algorithm matches the triple loop in time and loses in space (a call stack). There is no asymptotic win until you reduce the 8.",
      bullets: [
        "Eight submultiplies keep the exponent at 3.",
        "Case 1 of Master because 3 > k=2.",
        "Iterative n^3 is the better n^3; D&C here is not an improvement."
      ]
    },
    {
      heading: "Strassen's seven products P..V",
      body: "Multiplies dominate adds, so spend extra adds to save one multiply. Seven products (names as in the lecture: P through V): P=(A11+A22)(B11+B22), Q=(A21+A22)B11, R=A11(B12-B22), S=A22(B21-B11), T=(A11+A12)B22, U=(A21-A11)(B11+B12), V=(A12-A22)(B21+B22). Reassemble: C11=P+S-T+V, C12=R+T, C21=Q+S, C22=P-Q+R+U. On A=[[1,2],[3,4]], B=[[5,6],[7,8]]: P=65, Q=35, R=-2, S=8, T=24, U=22, V=-30, and C=[[19,22],[43,50]], matching the schoolbook product.",
      bullets: [
        "Seven block multiplies instead of eight.",
        "More additions and subtractions, which are cheaper.",
        "Check: 1,2;3,4 times 5,6;7,8 is 19,22;43,50."
      ]
    },
    {
      heading: "The 2.81 exponent",
      body: "Each recursive step now makes seven calls of size n/2 plus Theta(n^2) add/sub work: <code>T(n)=7 T(n/2)+n^2</code>. log_2 7 ≈ 2.81 > 2, still Master case 1, so T(n) = Theta(n^{log2 7}) ≈ Theta(n^{2.81}). Strictly slower-growing than n^3. The lecture calls this a research direction: shaving the exponent of matrix multiply is still open territory. For coding interviews, quoting 7 multiplies and n^{2.81} is the expected punchline.",
      bullets: [
        "a=7, b=2, log_b a ≈ 2.81.",
        "Combine still n^2, so case 1, T(n)=Theta(n^{2.81}).",
        "Not n^3, not n^2 — a fractional exponent from log 7."
      ]
    }
  ],

  keyTerms: [
    { term: "Triple loop", def: "C[i][j] += A[i][k]*B[k][j] over i,j,k; Theta(n^3)." },
    { term: "Block", def: "An n/2-by-n/2 tile (A11, A12, A21, A22) treated as one entry in a 2x2 product." },
    { term: "Eight-multiply D&C", def: "Recurse with the schoolbook 2x2 layout; T=8T(n/2)+n^2 = Theta(n^3)." },
    { term: "P..V", def: "Strassen's seven block products that replace the eight schoolbook multiplies." },
    { term: "Matrix addition", def: "n^2 corresponding sums; the combine cost in both recurrences." },
    { term: "log_2 7", def: "≈ 2.81, the exponent of Strassen's T(n)." },
    { term: "Power-of-two n", def: "Pad so repeated n/2 hits the 2x2 base case cleanly." }
  ],

  tradeoffs: [
    { pro: "Schoolbook loops are simple, cache-friendly, and n^3 with no recursion tax.", con: "The exponent 3 is the thing Strassen exists to beat." },
    { pro: "Naive D&C uses the same four C formulas on blocks, easy to write.", con: "Eight submultiplies keep n^3 and waste stack versus the triple loop." },
    { pro: "Seven products drop the exponent to log2 7 ≈ 2.81.", con: "Many more additions, awkward constants, and padding; rarely the fastest in practice for modest n." },
    { pro: "The 2x2 numeric check (19,22;43,50) validates P..V before you recurse.", con: "A sign error in U or V silently wrecks C22 while C12 still looks right." }
  ],

  interviewTips: [
    "Start from the triple loop and n^3 so the later exponent has a baseline.",
    "Naive D&C: eight recursive multiplies, T=8T(n/2)+n^2, still n^3, worse space.",
    "Name the win: multiplies are the expensive line, cut 8 to 7.",
    "Write T(n)=7T(n/2)+n^2, log_2 7 ≈ 2.81, Master case 1.",
    "Reconstruct C from P..V: C12=R+T and C21=Q+S are the short ones; C11 and C22 mix four.",
    "Work the 2x2 numbers 1..8 so the examiner sees you did not only memorize the exponent."
  ],

  scene: {
    nodes: [
      { id: "A", label: "A  n x n", type: "storage", pos: [-8, 0, -5], color: "#60a5fa" },
      { id: "B", label: "B  n x n", type: "storage", pos: [-8, 0, 2], color: "#818cf8" },
      { id: "C", label: "C = AB", type: "db", pos: [8, 0, -1.5], color: "#4ade80" },
      { id: "n0", label: "triple loop n^3", type: "note", pos: [8, 0, 4] },
      { id: "A11", label: "A11", type: "cache", pos: [-10, 0, -6], showAt: 1, color: "#60a5fa" },
      { id: "A12", label: "A12", type: "cache", pos: [-6, 0, -6], showAt: 1, color: "#60a5fa" },
      { id: "A21", label: "A21", type: "cache", pos: [-10, 0, -3], showAt: 1, color: "#60a5fa" },
      { id: "A22", label: "A22", type: "cache", pos: [-6, 0, -3], showAt: 1, color: "#60a5fa" },
      { id: "B11", label: "B11", type: "cache", pos: [-10, 0, 1], showAt: 1, color: "#818cf8" },
      { id: "B12", label: "B12", type: "cache", pos: [-6, 0, 1], showAt: 1, color: "#818cf8" },
      { id: "B21", label: "B21", type: "cache", pos: [-10, 0, 4], showAt: 1, color: "#818cf8" },
      { id: "B22", label: "B22", type: "cache", pos: [-6, 0, 4], showAt: 1, color: "#818cf8" },
      { id: "m8", label: "8 recursive MM", type: "note", pos: [3, 0, -6], showAt: 2 },
      { id: "t8", label: "8T(n/2)+n^2 = n^3", type: "note", pos: [8, 0, -6], showAt: 2 },
      { id: "P", label: "P", type: "worker", pos: [-4, 0, 7], showAt: 4, color: "#c084fc" },
      { id: "Q", label: "Q", type: "worker", pos: [-1.5, 0, 7], showAt: 4, color: "#c084fc" },
      { id: "R", label: "R", type: "worker", pos: [1, 0, 7], showAt: 4, color: "#c084fc" },
      { id: "S", label: "S", type: "worker", pos: [3.5, 0, 7], showAt: 4, color: "#c084fc" },
      { id: "T", label: "T", type: "worker", pos: [6, 0, 7], showAt: 4, color: "#c084fc" },
      { id: "U", label: "U", type: "worker", pos: [8.5, 0, 7], showAt: 4, color: "#c084fc" },
      { id: "V", label: "V", type: "worker", pos: [11, 0, 7], showAt: 4, color: "#c084fc" },
      { id: "nP", label: "7 products P..V", type: "note", pos: [3, 0, 4], showAt: 4 },
      { id: "C11", label: "C11=19", type: "server", pos: [3, 0, -3], showAt: 5, color: "#4ade80" },
      { id: "C12", label: "C12=22", type: "server", pos: [7, 0, -3], showAt: 5, color: "#4ade80" },
      { id: "C21", label: "C21=43", type: "server", pos: [3, 0, 1], showAt: 5, color: "#4ade80" },
      { id: "C22", label: "C22=50", type: "server", pos: [7, 0, 1], showAt: 5, color: "#4ade80" },
      { id: "ex", label: "A=1,2;3,4 B=5,6;7,8", type: "note", pos: [-8, 0, 7], showAt: 5 },
      { id: "t7", label: "7T(n/2)+n^2", type: "note", pos: [0, 0, -6], showAt: 6 },
      { id: "exp", label: "Theta(n^log2 7)~n^2.81", type: "lb", pos: [8, 0, -1.5], showAt: 6, color: "#c084fc" }
    ],
    edges: [
      { from: "A", to: "C" },
      { from: "B", to: "C" },
      { from: "A11", to: "P", showAt: 4, dashed: true },
      { from: "A22", to: "P", showAt: 4, dashed: true },
      { from: "B11", to: "P", showAt: 4, dashed: true },
      { from: "B22", to: "P", showAt: 4, dashed: true },
      { from: "P", to: "C11", showAt: 5 },
      { from: "S", to: "C11", showAt: 5 },
      { from: "T", to: "C11", showAt: 5, dashed: true },
      { from: "V", to: "C11", showAt: 5 },
      { from: "R", to: "C12", showAt: 5 },
      { from: "T", to: "C12", showAt: 5 },
      { from: "Q", to: "C21", showAt: 5 },
      { from: "S", to: "C21", showAt: 5 },
      { from: "P", to: "C22", showAt: 5 },
      { from: "Q", to: "C22", showAt: 5, dashed: true },
      { from: "R", to: "C22", showAt: 5 },
      { from: "U", to: "C22", showAt: 5 }
    ],
    steps: [
      {
        title: "Schoolbook n^3",
        text: "C[i][j] sums A[i][k]*B[k][j] over k. Three loops, Theta(n^3) scalar multiplies. That is the number Strassen is trying to beat.",
        highlight: ["A", "B", "C", "n0"],
        flows: [
          { from: "A", to: "C", color: "#60a5fa", label: "row" },
          { from: "B", to: "C", color: "#818cf8", label: "col" }
        ]
      },
      {
        title: "Split into 2x2 blocks",
        text: "If n>2, cut A and B into four n/2 tiles. Treat each tile as one entry of a 2x2 so the four C formulas still apply. Pad n to a power of two.",
        highlight: ["A11", "A12", "A21", "A22", "B11", "B12", "B21", "B22"],
        hide: ["n0", "A", "B", "C"]
      },
      {
        title: "Eight recursive multiplies",
        text: "C11 needs A11*B11 and A12*B21, and the other three C blocks need two each: eight calls of size n/2, plus n^2 additions. T=8T(n/2)+n^2 = Theta(n^3). Recursion here is not a win over the triple loop.",
        highlight: ["A11", "B11", "A12", "B21", "C", "m8", "t8"],
        hide: ["n0"],
        flows: [
          { from: "A11", to: "C", color: "#60a5fa", label: "MM" },
          { from: "B11", to: "C", color: "#818cf8" },
          { from: "A12", to: "C", color: "#60a5fa" },
          { from: "B21", to: "C", color: "#818cf8" }
        ]
      },
      {
        title: "Small 2x2 is eight products",
        text: "When n<=2 you stop and use the four closed formulas (eight scalar multiplies, or one if n=1). Those eight are the count Strassen reduces.",
        highlight: ["A11", "A12", "A21", "A22", "B11", "B12", "B21", "B22", "m8"],
        hide: ["n0", "t8", "A", "B"]
      },
      {
        title: "Seven products P through V",
        text: "P=(A11+A22)(B11+B22), Q=(A21+A22)B11, R=A11(B12-B22), S=A22(B21-B11), T=(A11+A12)B22, U=(A21-A11)(B11+B12), V=(A12-A22)(B21+B22). Seven block multiplies, more adds.",
        highlight: ["P", "Q", "R", "S", "T", "U", "V", "nP", "A11", "A22", "B11", "B22"],
        hide: ["n0", "m8", "t8", "A", "B", "C"],
        flows: [
          { from: "A11", to: "P", color: "#c084fc", label: "P" },
          { from: "A22", to: "P", color: "#c084fc" },
          { from: "B11", to: "P", color: "#c084fc" },
          { from: "B22", to: "P", color: "#c084fc" }
        ]
      },
      {
        title: "Reassemble C, check 2x2",
        text: "C11=P+S-T+V, C12=R+T, C21=Q+S, C22=P-Q+R+U. On [[1,2],[3,4]] x [[5,6],[7,8]] the products P=65..V=-30 rebuild [[19,22],[43,50]].",
        highlight: ["P", "Q", "R", "S", "T", "U", "V", "C11", "C12", "C21", "C22", "ex"],
        hide: ["n0", "m8", "t8", "nP", "A", "B", "C"],
        flows: [
          { from: "P", to: "C11", color: "#4ade80" },
          { from: "R", to: "C12", color: "#4ade80" },
          { from: "Q", to: "C21", color: "#4ade80" },
          { from: "U", to: "C22", color: "#4ade80" }
        ]
      },
      {
        title: "Exponent log2 7",
        text: "T(n)=7T(n/2)+n^2. log2 7 ≈ 2.81 > 2, Master case 1, Theta(n^{2.81}). One fewer multiply per split is enough to beat n^3.",
        highlight: ["t7", "exp", "P", "Q", "R", "S", "T", "U", "V"],
        hide: ["n0", "m8", "t8", "nP", "ex", "A", "B", "C", "C11", "C12", "C21", "C22"]
      }
    ]
  }
});
