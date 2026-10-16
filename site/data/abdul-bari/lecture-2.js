window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 2,
  title: "1.1 Priori Analysis and Posteriori Testing",
  video: "https://www.youtube.com/watch?v=-JTq1BFBwmo",
  category: "Algorithm Foundations",
  tagline: "Study the algorithm for T(n) and S(n); run the program for milliseconds and bytes.",
  summary: "Priori analysis is done on an algorithm by reading it: you obtain a time function and a space function, independent of language and hardware. Posteriori testing is done on a program by executing it: you obtain seconds and bytes on a specific machine, language, OS, and environment. Do not report wall-clock time as the result of algorithm analysis.",

  theory: [
    {
      heading: "Two names for two objects",
      body: "The lecture pairs a method with an artifact. <b>Priori analysis</b> is performed on an <i>algorithm</i>. <b>Posteriori testing</b> is performed on a <i>program</i>. Mix the verbs and you will quote milliseconds for a design that has never run, or a polynomial for a binary that only you have timed on a laptop.",
      bullets: [
        "Priori → algorithm → study the text.",
        "Posteriori → program → execute the binary.",
        "The names mark when you measure: before coding versus after running."
      ]
    },
    {
      heading: "Priori: read until you can write functions",
      body: "Analysis means going through the procedure in detail — how control moves, which steps repeat — until you can state resource use as functions of input size. The deliverable is not a stopwatch reading. It is a <b>time function</b> and a <b>space function</b>. Those expressions stay attached to the algorithm even if nobody ever compiles it.",
      bullets: [
        "You work on paper or on the written steps.",
        "The answers look like 2n+3 or 3n²+4, not 12 ms.",
        "Later lectures show how to count those functions."
      ]
    },
    {
      heading: "Independence is the point of priori",
      body: "Because the object is not source in a language, priori results do not depend on C versus Java, on a CPU model, or on an operating system. The same swap procedure has the same time function whether it will later become Pascal or Python. That is why exam answers in this unit are polynomials and orders, not benchmarks.",
      bullets: [
        "Language-independent.",
        "Hardware-independent.",
        "A different future compiler does not change T(n)."
      ]
    },
    {
      heading: "Posteriori: run and read the meters",
      body: "Testing executes the program. You then know elapsed time in seconds or milliseconds and memory in bytes. Those numbers are real — and they are <b>local</b>. Change the language, the processor, the OS, or even the load on the machine, and the meters move. Posteriori is how you validate a build, not how you classify an algorithm.",
      bullets: [
        "Wall-clock time and byte counts.",
        "Tied to hardware, language, OS, and environment.",
        "Useful for debugging performance of this binary, not for comparing designs in a theory paper."
      ]
    },
    {
      heading: "Never report priori as a duration",
      body: "A common exam trap is to say analysis yields three minutes or ten milliseconds. Priori cannot produce that: there is no clock until a program runs on hardware. Analysis yields functions. Testing yields durations and sizes. Keep the units honest and you will not confuse the two methods.",
      bullets: [
        "Priori units: expressions in n (and later, order notation).",
        "Posteriori units: seconds, milliseconds, bytes.",
        "If your analysis answer has a time-of-day unit, you analyzed the wrong object."
      ]
    }
  ],

  keyTerms: [
    { term: "Priori analysis", def: "Studying an algorithm in detail to obtain time and space as functions, without running code." },
    { term: "Posteriori testing", def: "Executing a program and measuring elapsed time and memory on a real machine." },
    { term: "Time function", def: "An expression T(n) that describes how running time grows with input size." },
    { term: "Space function", def: "An expression S(n) that describes how memory words grow with input size." },
    { term: "Language independence", def: "Priori results do not change if the same procedure is later typed in another language." },
    { term: "Environment", def: "Hardware, OS, and runtime conditions that move posteriori measurements." }
  ],

  tradeoffs: [
    { pro: "Priori compares designs without buying hardware or picking a language.", con: "You get a function, not the milliseconds a customer will feel." },
    { pro: "Posteriori reports actual seconds and bytes on the box you shipped.", con: "The number is not portable across CPU, OS, language, or load." },
    { pro: "Functions let exam answers stay comparable across students.", con: "A slow constant hidden in T(n) only shows up when you finally run the program." }
  ],

  interviewTips: [
    "Say priori is on algorithms and yields T(n) and S(n); posteriori is on programs and yields seconds and bytes.",
    "List priori independences: language, hardware, OS. List posteriori dependences: all three plus environment.",
    "If an interviewer asks how long an algorithm takes, answer with a function or an order, not a stopwatch.",
    "Use posteriori when you must tune this build; use priori when you must choose among designs.",
    "A question that mentions milliseconds is testing; a question that mentions n² is analysis."
  ],

  scene: {
    nodes: [
      { id: "algo", label: "Algorithm", type: "service", pos: [-8, 0, 4], color: "#60a5fa" },
      { id: "prog", label: "Program", type: "worker", pos: [-8, 0, -4], color: "#fb923c" },
      { id: "study", label: "Study steps", type: "queue", pos: [-1, 0, 4], showAt: 1, color: "#c084fc" },
      { id: "run", label: "Execute", type: "point", pos: [-1, 0, -4], showAt: 1, color: "#fb923c" },
      { id: "tn", label: "T(n)", type: "note", pos: [6, 0, 6], showAt: 2 },
      { id: "sn", label: "S(n)", type: "note", pos: [6, 0, 2], showAt: 2 },
      { id: "ms", label: "12 ms", type: "note", pos: [6, 0, -2], showAt: 2 },
      { id: "bytes", label: "4 KB", type: "note", pos: [6, 0, -6], showAt: 2 },
      { id: "free", label: "Lang/HW free", type: "cache", pos: [11, 0, 4], showAt: 3, color: "#4ade80" },
      { id: "dep", label: "Lang/HW/OS", type: "point", pos: [11, 0, -4], showAt: 3, color: "#f87171" },
      { id: "n0", label: "No wall-clock", type: "note", pos: [0, 0, 0], showAt: 4 },
      { id: "pick", label: "Pick by unit", type: "note", pos: [-8, 0, 0], showAt: 5 }
    ],
    edges: [
      { from: "algo", to: "study", label: "priori", showAt: 1 },
      { from: "prog", to: "run", label: "posteriori", showAt: 1 },
      { from: "study", to: "tn", showAt: 2 },
      { from: "study", to: "sn", showAt: 2 },
      { from: "run", to: "ms", showAt: 2 },
      { from: "run", to: "bytes", showAt: 2 },
      { from: "tn", to: "free", showAt: 3, dashed: true },
      { from: "sn", to: "free", showAt: 3, dashed: true },
      { from: "ms", to: "dep", showAt: 3, dashed: true },
      { from: "bytes", to: "dep", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "Pair method with object",
        text: "Priori analysis reads an algorithm. Posteriori testing runs a program. The verbs do not swap.",
        highlight: ["algo", "study", "prog", "run"],
        flows: [
          { from: "algo", to: "study", color: "#c084fc", label: "read" },
          { from: "prog", to: "run", color: "#fb923c", label: "run" }
        ]
      },
      {
        title: "Different deliverables",
        text: "Study produces a time function and a space function. Execution produces milliseconds and bytes. Keep the units on the correct track.",
        highlight: ["study", "tn", "sn", "run", "ms", "bytes"],
        flows: [
          { from: "study", to: "tn", color: "#c084fc", label: "T(n)" },
          { from: "study", to: "sn", color: "#60a5fa", label: "S(n)" },
          { from: "run", to: "ms", color: "#fb923c", label: "ms" },
          { from: "run", to: "bytes", color: "#fb923c", label: "B" }
        ]
      },
      {
        title: "Independence versus environment",
        text: "T(n) and S(n) do not care which language or CPU you pick later. The 12 ms reading does: language, hardware, OS, and load all move it.",
        highlight: ["tn", "sn", "free", "ms", "bytes", "dep"]
      },
      {
        title: "No clock on the algorithm",
        text: "Analysis never answers with three minutes. There is no clock until a program runs. If the answer has a duration unit, you tested; you did not analyze.",
        highlight: ["n0", "tn", "sn", "algo"]
      },
      {
        title: "Choose the method by the unit",
        text: "Milliseconds or bytes means you tested a program. A polynomial in n means you analyzed an algorithm. Name the object first, then the method.",
        highlight: ["pick", "tn", "ms", "algo", "prog"]
      }
    ]
  }
});
