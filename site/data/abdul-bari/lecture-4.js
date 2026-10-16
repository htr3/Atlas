window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 4,
  title: "1.3 How Write and Analyze Algorithm",
  video: "https://www.youtube.com/watch?v=xGYsEqe9Vl0",
  category: "Algorithm Foundations",
  tagline: "Write swap without types; each statement is 1 unit, each variable is 1 word.",
  summary: "Algorithms may use any readable syntax: C braces, begin/end, Pascal :=, or arrows. Types and declarations wait for the program. Analysis starts with time and space as functions. Each simple statement costs one unit even if it would expand to several machine ops; each variable costs one word, not bytes. Swap is T=3, S=3 — both constant, written as order 1.",

  theory: [
    {
      heading: "Write the idea, not the type system",
      body: "A swap of two values in algorithm form looks like C minus the compiler. You do not declare that <code>a</code> is <code>int</code>. You do not declare <code>temp</code> before using it. Those decisions belong to implementation. The algorithm is allowed to introduce a name at first use if a reader can follow the flow.",
      bullets: [
        "No data types at design time.",
        "No mandatory declarations.",
        "The test is whether the project team can execute the steps on paper."
      ]
    },
    {
      heading: "Syntax is not standardized",
      body: "Braces may become <code>begin</code> / <code>end</code>. Assignment may be <code>=</code>, Pascal <code>:=</code>, or an arrow that shows value flowing into a name. There is no official algorithm punctuation. Pick a form and stay readable. If the people who will code from it understand it, the notation is legal.",
      bullets: [
        "begin/end versus { } is taste.",
        ":= and arrows are both assignment.",
        "Unreadable cleverness fails even if it is consistent."
      ]
    },
    {
      heading: "Two primary criteria: time and space",
      body: "A procedure is judged first on how long it takes and how much memory it will need when it becomes a program. Time is reported as a <b>time function</b>, not as wall-clock. Space is a <b>space function</b> in abstract words. Both of those are the analysis the last lecture called priori. Extra criteria exist when the product needs them.",
      bullets: [
        "Time efficiency: the procedure should be fast.",
        "Space: how many words of memory the variables occupy.",
        "Functions of input size, not minutes."
      ]
    },
    {
      heading: "Other criteria when the project asks",
      body: "Internet, mobile, and systems work add meters. Networked or cloud procedures should not ship oversized payloads — <b>data transfer</b> is a criterion. Handhelds add <b>power</b>. Device-driver and systems code may count <b>CPU registers</b> because the register file is tiny. You only include these if the project actually cares; time and space remain the default pair.",
      bullets: [
        "Data transfer / network volume.",
        "Power on phones, tablets, laptops.",
        "Register pressure for drivers and low-level code."
      ]
    },
    {
      heading: "One unit per simple statement",
      body: "Each straight-line statement is charged <b>one unit of time</b>, even if it is long. Swap is three assignments, so T = 3, a constant. Nested or called procedures must be analyzed on their own; a simple statement is one that is not a bundle of other algorithms. The expression <code>x ← 5a + 6b</code> is still one unit at this level, although a compiler would emit two multiplies, one add, and one store (four machine steps). We stay at the algorithm level unless the mission requires machine-code detail.",
      bullets: [
        "Swap: three units → constant time.",
        "Called algorithms are expanded, not waved through as one.",
        "Machine-instruction counting is optional depth, not the default."
      ]
    },
    {
      heading: "Car trip versus landing on Mars",
      body: "Driving to a friend's house, you do not plan at the level of engine cycles. Landing on Mars, you plan every subsystem. Algorithm analysis works the same way: a course uses a shallow, uniform 1-unit rule so answers are comparable. If you truly need cycle-accurate cost, you may go down to generated machine code. Default for this subject remains the shallow count.",
      bullets: [
        "Shallow count: one statement, one unit.",
        "Deep count: expand to machine ops when the requirement is that tight.",
        "This course stays shallow unless a later topic says otherwise."
      ]
    },
    {
      heading: "Space in words, then order 1",
      body: "Count variables, not bytes. Swap uses parameters <code>a</code>, <code>b</code> and local <code>temp</code> — three words. You say words because the future type might be <code>int</code>, <code>float</code>, or <code>double</code>; bytes are unknown at design time. Three is a constant, so space is <b>order of 1</b>. The same rewrite applies to time: 3 and 3000 are both order 1. The numeral 1 here means constant, not the integer one.",
      bullets: [
        "Each variable = one word.",
        "S(n) = 3 → order 1.",
        "T(n) = 3 → order 1."
      ]
    }
  ],

  keyTerms: [
    { term: "Time function", def: "T(n) from counting statement units; swap gives the constant 3." },
    { term: "Space function", def: "S(n) from counting variables as words; swap gives the constant 3." },
    { term: "Unit time", def: "Charge of one for each simple statement, regardless of how long the line looks." },
    { term: "Word", def: "Abstract cell for one variable; used because byte size is not known yet." },
    { term: "Order of 1", def: "A constant amount of time or space; 3 and 3000 are both written this way." },
    { term: "Assignment forms", def: "=, :=, or an arrow — any of them, if the team can read the flow." },
    { term: "Shallow analysis", def: "Stop at statement units instead of expanding to machine instructions." }
  ],

  tradeoffs: [
    { pro: "Skipping types keeps the design portable across languages.", con: "Overflow, precision, and alignment only appear when you finally pick int versus double." },
    { pro: "One-unit statements make exam counts consistent.", con: "A heavy expression is cheaper on paper than on a real ALU." },
    { pro: "Word-counting avoids fake byte precision.", con: "You cannot quote RAM in KB until types exist." },
    { pro: "Deep machine-level analysis is available when the mission needs it.", con: "It is slow to do and not what this course grades by default." }
  ],

  interviewTips: [
    "Write swap as three assignments with no types; say T=3 and S=3 words, both order 1.",
    "List default criteria (time, space) then optionals: transfer, power, registers.",
    "If asked why x=5*a+6*b is one unit: algorithm level, not four machine ops.",
    "Use the car-versus-Mars line to explain when you would expand to machine code.",
    "Say order of 1 means constant — 3 and 3000 get the same label.",
    "Count space in words because the eventual C type is still unknown."
  ],

  scene: {
    nodes: [
      { id: "a", label: "a", type: "point", pos: [-10, 0, 4], color: "#60a5fa" },
      { id: "b", label: "b", type: "point", pos: [-10, 0, -4], color: "#60a5fa" },
      { id: "t", label: "temp", type: "point", pos: [-4, 0, 0], showAt: 1, color: "#c084fc" },
      { id: "s1", label: "temp ← a", type: "note", pos: [3, 0, 5], showAt: 1 },
      { id: "s2", label: "a ← b", type: "note", pos: [3, 0, 0], showAt: 2 },
      { id: "s3", label: "b ← temp", type: "note", pos: [3, 0, -5], showAt: 3 },
      { id: "t3", label: "T = 3 units", type: "note", pos: [10, 0, 5], showAt: 4 },
      { id: "s3w", label: "S = 3 words", type: "note", pos: [10, 0, 1], showAt: 4 },
      { id: "o1", label: "order 1", type: "cache", pos: [10, 0, -3], showAt: 4, color: "#4ade80" },
      { id: "expr", label: "5a+6b = 1 unit", type: "note", pos: [-4, 0, 6], showAt: 5 },
      { id: "mach", label: "4 machine ops", type: "note", pos: [-4, 0, -6], showAt: 5 },
      { id: "net", label: "net / power / regs", type: "note", pos: [3, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "a", to: "t", label: "copy", showAt: 1 },
      { from: "b", to: "a", label: "copy", showAt: 2 },
      { from: "t", to: "b", label: "copy", showAt: 3 },
      { from: "s1", to: "t3", showAt: 4, dashed: true },
      { from: "s2", to: "t3", showAt: 4, dashed: true },
      { from: "s3", to: "t3", showAt: 4, dashed: true },
      { from: "a", to: "s3w", showAt: 4, dashed: true },
      { from: "b", to: "s3w", showAt: 4, dashed: true },
      { from: "t", to: "s3w", showAt: 4, dashed: true },
      { from: "expr", to: "mach", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "temp ← a  (unit 1)",
        text: "No types, no declaration. First assignment copies a into temp. Charge one time unit. temp is a third word of space.",
        highlight: ["a", "t", "s1"],
        flows: [
          { from: "a", to: "t", color: "#60a5fa", label: "a" }
        ]
      },
      {
        title: "a ← b  (unit 2)",
        text: "Second assignment overwrites a. Still one unit, even though a is a parameter. Syntax could have been := or an arrow.",
        highlight: ["b", "a", "s2"],
        flows: [
          { from: "b", to: "a", color: "#4ade80", label: "b" }
        ]
      },
      {
        title: "b ← temp  (unit 3)",
        text: "Third assignment finishes the swap. Three simple statements, three units. Nested calls would have to be expanded separately.",
        highlight: ["t", "b", "s3"],
        flows: [
          { from: "t", to: "b", color: "#c084fc", label: "temp" }
        ]
      },
      {
        title: "Constants become order 1",
        text: "T = 3 and S = 3 words (a, b, temp). Both are constants, so both are order of 1. Three and three thousand get the same label.",
        highlight: ["t3", "s3w", "o1", "a", "b", "t"]
      },
      {
        title: "Stay shallow unless you must not",
        text: "5a+6b is one algorithm unit, but four machine ops (two muls, add, store). Driving across town you skip engine cycles; landing on Mars you do not. This course stays shallow.",
        highlight: ["expr", "mach"]
      },
      {
        title: "Optional meters",
        text: "After time and space, a project may add data transfer, battery, or register count. Include them only when the product actually cares.",
        highlight: ["net", "t3", "s3w"]
      }
    ]
  }
});
