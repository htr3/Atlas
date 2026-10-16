window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 3,
  title: "1.2 Characteristics of Algorithm",
  video: "https://www.youtube.com/watch?v=FbYzBWdhMb0",
  category: "Algorithm Foundations",
  tagline: "Zero or more inputs, at least one output, definite, finite, and every step useful.",
  summary: "A valid algorithm takes zero or more inputs and must produce at least one output. Every statement has one exact meaning (definiteness) — no imaginary-number sleight of hand. The procedure has finitely many steps and must stop (finiteness); a database server that runs until you kill it is a service, not an algorithm. Effectiveness forbids idle statements that do no work.",

  theory: [
    {
      heading: "Input: zero or more",
      body: "An algorithm may take parameters, or it may take none. The bound is <b>zero or more</b>, not one-or-else-invalid. Think of a C function: it can have an empty parameter list and still be a function. What you cannot do is treat missing input as a defect when the procedure is defined to start from constants or from a fixed setup.",
      bullets: [
        "Zero inputs is allowed.",
        "Many inputs is allowed.",
        "The recipe still has to do something with whatever it is given — including nothing."
      ]
    },
    {
      heading: "Output: at least one",
      body: "A procedure that yields no result is not worth writing. There must be <b>at least one output</b> — a value, a structure, a yes/no, some observable effect that answers the problem. A C function declared <code>void</code> still does work (prints, writes memory); the algorithm analogue is the same: the point is a result, not a return-type keyword.",
      bullets: [
        "No output ⇒ no algorithm, just busywork.",
        "One result is enough; more is fine.",
        "Output is the objective of the whole procedure."
      ]
    },
    {
      heading: "Definiteness: one meaning per statement",
      body: "Every line must be unambiguous and have a <b>single exact meaning</b>. If a human cannot carry out the step, you cannot ask a computer to. The lecture's ban is concrete: do not treat √(−1) as a real number inside an algorithm that only knows reals. Imaginary values are not a known real operation. Vague English (do something clever with the array) fails the same test.",
      bullets: [
        "Each statement: one interpretation.",
        "Unknown or magical operations are illegal.",
        "If you cannot compute it by hand with the same rule, rewrite the step."
      ]
    },
    {
      heading: "Finiteness: it must stop",
      body: "The write-up contains a finite set of statements, and execution must <b>terminate</b>. Ten steps or ten thousand are both finite if they end. A SQL server, a web server, or any daemon that runs until an operator kills it is a <i>service</i>, not an algorithm. Algorithms are procedures: they start, they finish, they return a result.",
      bullets: [
        "Finite text and finite run.",
        "Nonstop servers are outside this definition.",
        "Termination is part of correctness, not an optional extra."
      ]
    },
    {
      heading: "Effectiveness: no idle steps",
      body: "Every statement must do work toward the result. Padding that never feeds the answer is not part of the procedure. The cooking test: if you boil a liquid and never pour it into the dish, that action is not in the recipe. Chemistry and physics lab scripts work the same way — only known, useful operations.",
      bullets: [
        "Each step has a purpose.",
        "Unused preparation is not effectiveness.",
        "Short is not the definition; useful is."
      ]
    },
    {
      heading: "The lab and kitchen analogies",
      body: "A chemistry experiment, a physics experiment, and a recipe are all procedures. Each needs inputs (chemicals, instruments, ingredients), produces a result (a solution, a measurement, a dish), uses only known steps, stops when the product is ready, and does not include unused work. Those five traits are exactly input, output, definiteness, finiteness, and effectiveness. If your algorithm fails one of them, it fails the same way a broken recipe fails."
    }
  ],

  keyTerms: [
    { term: "Input", def: "Zero or more values the procedure starts with; empty input is legal." },
    { term: "Output", def: "At least one result; a procedure with no result is not an algorithm." },
    { term: "Definiteness", def: "Every statement has one exact, computable meaning — no ambiguous or unknown ops." },
    { term: "Finiteness", def: "Finite text and a run that terminates; not a long-lived server process." },
    { term: "Effectiveness", def: "No unnecessary statements; every step contributes to the result." },
    { term: "Service vs procedure", def: "A database or web server may run forever; an algorithm must stop." }
  ],

  tradeoffs: [
    { pro: "Zero-input algorithms cover setup and constant procedures.", con: "Exam answers that insist on mandatory input fail the official definition." },
    { pro: "Finiteness keeps algorithms distinct from daemons and servers.", con: "Interactive systems that should run until quit are designed as programs/services, not as this object." },
    { pro: "Definiteness blocks hand-wavy steps in an exam write-up.", con: "You must spell out operations that felt obvious in conversation." }
  ],

  interviewTips: [
    "List all five: input (0+), output (1+), definiteness, finiteness, effectiveness.",
    "Give the √(−1) example for definiteness: not a known real step.",
    "Contrast a web/SQL server (may never stop) with an algorithm (must terminate).",
    "Map a recipe: ingredients, dish, known steps, you stop when it is cooked, no unused vegetables.",
    "Void in C is not zero output; the function still produces an effect. The algorithm must too.",
    "If a step cannot be done by a human with a clear rule, it fails definiteness."
  ],

  scene: {
    nodes: [
      { id: "in0", label: "0 inputs", type: "point", pos: [-10, 0, 5], color: "#60a5fa" },
      { id: "in1", label: "k inputs", type: "point", pos: [-10, 0, 1], color: "#60a5fa" },
      { id: "proc", label: "Procedure", type: "service", pos: [-2, 0, 0], color: "#c084fc" },
      { id: "out", label: "≥1 output", type: "cache", pos: [8, 0, 0], showAt: 1, color: "#4ade80" },
      { id: "def", label: "One meaning", type: "note", pos: [-2, 0, 6], showAt: 2 },
      { id: "bad", label: "sqrt(-1) ban", type: "note", pos: [8, 0, 6], showAt: 2 },
      { id: "fin", label: "Must stop", type: "note", pos: [-2, 0, -5], showAt: 3 },
      { id: "srv", label: "SQL / web", type: "queue", pos: [8, 0, -6], showAt: 3, color: "#f87171" },
      { id: "eff", label: "No idle step", type: "note", pos: [3, 0, -3], showAt: 4 },
      { id: "dish", label: "Recipe / lab", type: "worker", pos: [8, 0, 3], showAt: 5 }
    ],
    edges: [
      { from: "in0", to: "proc", showAt: 0, dashed: true },
      { from: "in1", to: "proc", showAt: 0 },
      { from: "proc", to: "out", label: "result", showAt: 1 },
      { from: "proc", to: "def", showAt: 2, dashed: true },
      { from: "def", to: "bad", showAt: 2, dashed: true },
      { from: "proc", to: "fin", showAt: 3, dashed: true },
      { from: "srv", to: "fin", showAt: 3, dashed: true },
      { from: "proc", to: "eff", showAt: 4, dashed: true },
      { from: "proc", to: "dish", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Input may be empty",
        text: "Zero or more inputs. An empty parameter list is legal, the same way a function may take no arguments.",
        highlight: ["in0", "in1", "proc"],
        flows: [
          { from: "in1", to: "proc", color: "#60a5fa", label: "in" }
        ]
      },
      {
        title: "At least one result",
        text: "If nothing comes out, the write-up is not an algorithm. One output is the minimum; the procedure exists to produce it.",
        highlight: ["proc", "out"],
        flows: [
          { from: "proc", to: "out", color: "#4ade80", label: "out" }
        ]
      },
      {
        title: "Definiteness",
        text: "Each statement has one exact meaning. √(−1) is not a real-number step. If a human cannot perform it by a known rule, rewrite it.",
        highlight: ["proc", "def", "bad"],
        fail: ["bad"]
      },
      {
        title: "Finiteness, not a service",
        text: "The run must terminate. A SQL or web server that continues until you kill it is a service. An algorithm is a procedure that stops.",
        highlight: ["proc", "fin", "srv"],
        fail: ["srv"]
      },
      {
        title: "Effectiveness",
        text: "Drop statements that never feed the answer. Boiling a chemical you never mix, or chopping vegetables you never cook, is not part of the procedure.",
        highlight: ["proc", "eff"]
      },
      {
        title: "Same five traits as a recipe",
        text: "Lab scripts and kitchen recipes already have inputs, a product, known steps, an ending, and no wasted work. Check an algorithm against that list.",
        highlight: ["dish", "in0", "out", "def", "fin", "eff"]
      }
    ]
  }
});
