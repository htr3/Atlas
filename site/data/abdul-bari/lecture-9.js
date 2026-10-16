window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 9,
  title: "1.6 Classes of functions",
  video: "https://www.youtube.com/watch?v=w7t4_JUUTeg",
  category: "Algorithm Foundations",
  tagline: "Constant, logarithmic, linear, quadratic, cubic, exponential — named by degree, not by 500n.",
  summary: "Time functions fall into named classes. Order 1 is constant even if the constant is 5000 — it does not grow with n. log n (any base) is logarithmic. Degree-1 polynomials including 2n+3, 500n+700, and n/5000 are linear. n² is quadratic (matrix add), n³ is cubic (matrix multiply). 2^n, 3^n, and n^n are exponential. You name the class by the shape that survives after dropping coefficients.",

  theory: [
    {
      heading: "Constant: independent of n",
      body: "If the time does not grow with input size, the class is <b>constant</b>, written order 1. Two statements, five statements, or five thousand statements: all constant. The number in the box is not the story; the missing n is. Swap from the write-and-analyze lecture lives here. Order 1 does not mean the algorithm takes one step. It means T does not depend on n.",
      bullets: [
        "2, 5, 5000 → all order 1.",
        "No n in the leading term.",
        "Constant is a class, not the integer 1."
      ]
    },
    {
      heading: "Logarithmic",
      body: "Order log n — base 2, base 3, any base — is the <b>logarithmic</b> class. Doubling and halving loops from the last lectures sit here. Changing the base only multiplies by a constant (change-of-base), so the class does not split into log₂ versus log₃ for this taxonomy.",
      bullets: [
        "log₂ n and log₃ n are the same class.",
        "Geometric update of a counter lands here.",
        "Grows, but slower than any positive power of n."
      ]
    },
    {
      heading: "Linear: degree 1, whatever the slope",
      body: "Order n is <b>linear</b>. 2n+3, 500n+700, and n/5000+6 are all linear. The lecture's rule is the degree of the polynomial: n¹, so you write n, not the coefficient. Array sum was linear. A huge slope still does not promote the function into quadratic. n/5000 feels tiny and is still linear because as n grows, the term with n dominates.",
      bullets: [
        "2n+3 → order n → linear.",
        "500n+700 → still linear.",
        "n/5000 → still linear."
      ]
    },
    {
      heading: "Quadratic and cubic",
      body: "Order n² is <b>quadratic</b> — matrix addition, rectangular nested fors, the triangle j < i after you drop the 1/2. Order n³ is <b>cubic</b> — matrix multiplication's three nested n-loops. These names are the polynomial degrees you have been computing with frequency count. You do not write the degree number; you write the term: n², not 2.",
      bullets: [
        "Matrix add → quadratic.",
        "Matrix multiply → cubic.",
        "Report the term (n², n³), not an integer degree label alone."
      ]
    },
    {
      heading: "Exponential: 2^n, 3^n, n^n",
      body: "Some algorithms (not yet derived in this lecture) take time 2^n, 3^n, or even n^n. That family is <b>exponential</b>. Anything with n in the exponent grows in a different league from polynomials. 2^n and 3^n are both exponential for this classification; n^n is worse, still filed under the same heading until a later finer comparison.",
      bullets: [
        "2^n, 3^n, n^n → exponential class.",
        "Not seen in the loop drills yet; named so you can slot later algorithms.",
        "Polynomials never catch a true exponential as n → ∞."
      ]
    },
    {
      heading: "A taxonomy, not a ranking table yet",
      body: "The lecture's goal is to name the buckets you have been landing in: constant, logarithmic, linear, quadratic, cubic, exponential. The next videos compare which class grows faster. For now, given a T(n), drop coefficients, read the surviving shape, and say the class name. That is how you answer what type of time function this algorithm has.",
      bullets: [
        "Class = name of the order you already computed.",
        "Same class ⇒ same growth family, not identical speed.",
        "Keep the list of six names for exams."
      ]
    }
  ],

  keyTerms: [
    { term: "Constant", def: "Order 1; time does not depend on n, even if the constant is 5000." },
    { term: "Logarithmic", def: "Order log n, any base; doubling and halving loops." },
    { term: "Linear", def: "Order n; any degree-1 polynomial, including 500n and n/5000." },
    { term: "Quadratic", def: "Order n²; nested n-loops of depth 2, matrix addition." },
    { term: "Cubic", def: "Order n³; three nested n-loops, matrix multiplication." },
    { term: "Exponential", def: "n in the exponent: 2^n, 3^n, n^n — a different league from polynomials." },
    { term: "Class of functions", def: "The named family of a time function after coefficients are dropped." }
  ],

  tradeoffs: [
    { pro: "Naming classes lets you group 2n+3 with 500n without pretending they tick the same.", con: "Inside one class, constants still matter on a real machine." },
    { pro: "Any-base logs share a class, which matches change-of-base.", con: "A tight exam might still want log₂ versus log₃ if the question is exact T(n)." },
    { pro: "Exponential as one bucket flags 2^n algorithms as unusable for large n.", con: "n^n is far worse than 2^n; the single word hides that gap until the comparison lecture." }
  ],

  interviewTips: [
    "List the six: constant, logarithmic, linear, quadratic, cubic, exponential.",
    "5000 is constant; 500n is linear; n/5000 is still linear. The test is dependence on n, then degree.",
    "Matrix add → quadratic. Matrix multiply → cubic. Swap → constant.",
    "Say you write the term (n²) not the integer degree (2).",
    "2^n, 3^n, n^n are all exponential in this taxonomy; finer ranking is the next topic.",
    "If T(n) = 2n+3, the class is linear, not constant-plus-linear — drop the +3 for the name."
  ],

  scene: {
    nodes: [
      { id: "c", label: "1", type: "point", pos: [-10, 0, -5], color: "#4ade80" },
      { id: "nc", label: "constant", type: "note", pos: [-10, 0, -8] },
      { id: "lg", label: "log n", type: "point", pos: [-6, 0, -2], showAt: 1, color: "#60a5fa" },
      { id: "nl", label: "logarithmic", type: "note", pos: [-6, 0, -8], showAt: 1 },
      { id: "lin", label: "n", type: "point", pos: [-2, 0, 1], showAt: 2, color: "#c084fc" },
      { id: "nlin", label: "linear", type: "note", pos: [-2, 0, -8], showAt: 2 },
      { id: "q", label: "n^2", type: "point", pos: [2, 0, 4], showAt: 3, color: "#fb923c" },
      { id: "nq", label: "quadratic", type: "note", pos: [2, 0, -8], showAt: 3 },
      { id: "cu", label: "n^3", type: "point", pos: [6, 0, 6], showAt: 3, color: "#f87171" },
      { id: "ncu", label: "cubic", type: "note", pos: [6, 0, -8], showAt: 3 },
      { id: "ex", label: "2^n", type: "point", pos: [10, 0, 7], showAt: 4, color: "#f87171" },
      { id: "ne", label: "exponential", type: "note", pos: [10, 0, -8], showAt: 4 },
      { id: "ex2", label: "3^n  n^n", type: "note", pos: [10, 0, 4], showAt: 4 },
      { id: "drop", label: "500n still n", type: "note", pos: [-2, 0, 5], showAt: 5 },
      { id: "n8", label: "height at n~8", type: "note", pos: [4, 0, -5], showAt: 0 }
    ],
    edges: [
      { from: "c", to: "lg", showAt: 1, dashed: true },
      { from: "lg", to: "lin", showAt: 2, dashed: true },
      { from: "lin", to: "q", showAt: 3, dashed: true },
      { from: "q", to: "cu", showAt: 3, dashed: true },
      { from: "cu", to: "ex", showAt: 4 },
      { from: "lin", to: "drop", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Constant stays flat",
        text: "The bar does not rise with n. Two statements or five thousand: still order 1. The missing n is the definition, not the numeral 1.",
        highlight: ["c", "nc", "n8"]
      },
      {
        title: "Logarithmic is a short bar",
        text: "log n grows, but slowly. Base 2 or 3 does not split the class. Doubling and halving loops live here.",
        highlight: ["c", "lg", "nl"],
        flows: [
          { from: "c", to: "lg", color: "#60a5fa", label: "log" }
        ]
      },
      {
        title: "Linear tracks n",
        text: "2n+3, 500n+700, n/5000: degree 1, class linear. Array sum sits here. A huge slope does not promote you to quadratic.",
        highlight: ["lin", "nlin", "lg"],
        flows: [
          { from: "lg", to: "lin", color: "#c084fc", label: "n" }
        ]
      },
      {
        title: "Quadratic then cubic",
        text: "n² (matrix add) pulls away. n³ (matrix multiply) pulls away again. Write the term n² or n³, not the integer degree.",
        highlight: ["q", "cu", "nq", "ncu", "lin"],
        flows: [
          { from: "lin", to: "q", color: "#fb923c", label: "n^2" },
          { from: "q", to: "cu", color: "#f87171", label: "n^3" }
        ]
      },
      {
        title: "Exponential leaves the page",
        text: "2^n, 3^n, n^n are the exponential class. Named now so later algorithms have a bucket. Polynomials will not catch them as n grows.",
        highlight: ["ex", "ne", "ex2", "cu"],
        fail: ["ex"],
        flows: [
          { from: "cu", to: "ex", color: "#f87171", label: "2^n" }
        ]
      },
      {
        title: "Name the surviving shape",
        text: "Drop coefficients and lower terms. 500n is still linear. 3 is constant. That name is the class of the function.",
        highlight: ["drop", "nc", "nl", "nlin", "nq", "ncu", "ne"]
      }
    ]
  }
});
