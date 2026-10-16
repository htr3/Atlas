window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 1,
  title: "1. Introduction to Algorithms",
  video: "https://www.youtube.com/watch?v=0IAPZzGSbME",
  category: "Algorithm Foundations",
  tagline: "Design-time English steps vs implementation-time code you test on a machine.",
  summary: "An algorithm is a step-by-step procedure for a computational problem, written at design time in English or math. A program is the same idea at implementation time, in a programming language, tied to hardware and an OS. Algorithms are studied for time and space; programs are executed and tested. C-like syntax is used later only because most students already read C.",

  theory: [
    {
      heading: "Why this subject is on every syllabus",
      body: "Algorithms sit in the core of a computer-science degree because they are how you <b>invent a strategy</b> before you type. University papers, GATE-style entrance exams, job interviews, and programming contests all pull from this material. Students who stall here usually stall on <i>approach</i> — they can syntax-check a loop but cannot name a plan. The course promise is the reverse: look at a problem and already see which method applies.",
      bullets: [
        "Contests and interviews reuse the same design ideas as the theory paper.",
        "Logic development is the skill; language syntax is secondary.",
        "Topics are numbered so you can follow the sequence even when a large chapter is split."
      ]
    },
    {
      heading: "Algorithm versus program",
      body: "Both are procedures for solving a problem. The useful distinction is <b>when</b> and <b>for whom</b> they are written. In a software lifecycle you design first, then implement. Trial-and-error coding feels cheap because deleting a file is easy; it still wastes time. An algorithm is the design artifact: the procedure on paper (or in a text file) so the team knows what will be built before a compiler is involved.",
      bullets: [
        "Algorithm: design time. Program: implementation time.",
        "You do not construct a building by pouring concrete and hoping; software deserves the same design pass.",
        "The algorithm is for humans on the project, not for a CPU."
      ]
    },
    {
      heading: "Who writes it",
      body: "The author of an algorithm needs <b>domain knowledge</b> of the problem. An accountant understands a ledger better than a generic coder; hospital staff understand a ward better than someone who only knows Java. A programmer may wear both hats, but the roles are different: designer of the procedure versus implementer of the procedure. The people who will code from the algorithm must be able to read it.",
      bullets: [
        "Domain expert (or a programmer who has that knowledge) writes the algorithm.",
        "Programmers translate it into a language the machine accepts.",
        "If the team cannot parse the write-up, it is not yet an algorithm."
      ]
    },
    {
      heading: "Language and independence",
      body: "An algorithm may use ordinary English or mathematical notation — whatever the designers and programmers share. A program must use a programming language such as C, C++, Java, or Python. The algorithm does not care which CPU or operating system will run later. The program does: you pick hardware, Windows or Linux, and an environment, and those choices change how you write and ship it.",
      bullets: [
        "Algorithm: language-flexible, hardware-free, OS-free.",
        "Program: language-specific, hardware-specific, OS-specific.",
        "Math shorthand is welcome if the team can follow it."
      ]
    },
    {
      heading: "Analyze the design, test the code",
      body: "After you write an algorithm you <b>analyze</b> it: study the text to judge efficiency in time and memory. You do not run it — there is nothing to execute yet. After you write a program you <b>test</b> it: compile, run, and measure. That split — analysis on paper versus testing on a machine — is the reason algorithms exist as a subject separate from programming.",
      bullets: [
        "Analysis asks whether the procedure is efficient before you code.",
        "Testing asks whether this binary behaves on this machine.",
        "Later lectures turn analysis into time and space functions."
      ]
    },
    {
      heading: "C-like syntax is a teaching convenience",
      body: "Any readable notation is legal. In practice most university graduates already know C, and many schools teach C early, so the rest of the course writes algorithms with C-shaped statements. That is not a claim that algorithms <i>are</i> C programs. Data types, declarations, and compiler rules still belong to implementation. The C look is there so the class does not spend weeks inventing a private pseudo-language."
    }
  ],

  keyTerms: [
    { term: "Algorithm", def: "A step-by-step procedure for a computational problem, written at design time for humans." },
    { term: "Program", def: "The same procedure at implementation time, in a programming language, bound to hardware and an OS." },
    { term: "Design time", def: "The phase where you specify what the procedure does, before syntax and machines." },
    { term: "Implementation time", def: "The phase where programmers encode the design in C, Java, Python, or similar." },
    { term: "Domain knowledge", def: "Problem-area expertise (accounting, hospital workflow) needed to write a correct procedure." },
    { term: "Analysis", def: "Studying an algorithm on paper for time and space efficiency — not executing it." },
    { term: "Testing", def: "Running a program to check correctness and wall-clock behavior on real hardware." }
  ],

  tradeoffs: [
    { pro: "A written algorithm lets the team agree on a plan before anyone compiles.", con: "Skipping design and iterating in the editor feels faster until the approach is wrong." },
    { pro: "English or math keeps the design independent of CPU, OS, and language fashion.", con: "The write-up is useless if programmers cannot parse the notation." },
    { pro: "C-like algorithms are easy for CS students to read.", con: "Readers may confuse the sketch with a typed, compilable program." }
  ],

  interviewTips: [
    "Define algorithm as a design-time procedure, then contrast it with a program on time-of-writing, language, hardware, and analyze-versus-test.",
    "Name domain knowledge: the person who understands the problem drafts the algorithm; the programmer may be that person, but the roles differ.",
    "If asked why not just code: design first, the same way you would not build a structure by trial and error.",
    "Say algorithms are hardware- and OS-independent; programs are not.",
    "Mention GATE, contests, and interviews all reuse this design skill — strategy, not syntax.",
    "If you write C-like steps in an exam, drop types and declarations and say you are still in design."
  ],

  scene: {
    nodes: [
      { id: "prob", label: "Problem", type: "queue", pos: [-10, 0, 0] },
      { id: "algo", label: "Algorithm", type: "service", pos: [-1, 0, 4], showAt: 1, color: "#60a5fa" },
      { id: "code", label: "Program", type: "worker", pos: [-1, 0, -4], showAt: 1, color: "#fb923c" },
      { id: "domain", label: "Domain expert", type: "user", pos: [-10, 0, 5], showAt: 2 },
      { id: "coder", label: "Programmer", type: "user", pos: [-10, 0, -5], showAt: 2 },
      { id: "design", label: "Design time", type: "note", pos: [6, 0, 6], showAt: 1 },
      { id: "impl", label: "Implement time", type: "note", pos: [6, 0, -6], showAt: 1 },
      { id: "eng", label: "English / math", type: "note", pos: [6, 0, 3], showAt: 3 },
      { id: "plang", label: "C Java Python", type: "note", pos: [6, 0, -3], showAt: 3 },
      { id: "free", label: "HW/OS free", type: "point", pos: [10, 0, 6], showAt: 4, color: "#4ade80" },
      { id: "bound", label: "HW/OS bound", type: "point", pos: [10, 0, -6], showAt: 4, color: "#f87171" },
      { id: "ts", label: "Analyze T,S", type: "cache", pos: [10, 0, 3], showAt: 5, color: "#c084fc" },
      { id: "run", label: "Run + test", type: "point", pos: [10, 0, -2], showAt: 5, color: "#fb923c" },
      { id: "csyn", label: "C-like for reading", type: "note", pos: [-1, 0, 0], showAt: 6 }
    ],
    edges: [
      { from: "prob", to: "algo", label: "design", showAt: 1 },
      { from: "prob", to: "code", label: "implement", showAt: 1 },
      { from: "domain", to: "algo", showAt: 2 },
      { from: "coder", to: "code", showAt: 2 },
      { from: "algo", to: "eng", showAt: 3, dashed: true },
      { from: "code", to: "plang", showAt: 3, dashed: true },
      { from: "algo", to: "free", showAt: 4, dashed: true },
      { from: "code", to: "bound", showAt: 4, dashed: true },
      { from: "algo", to: "ts", label: "study", showAt: 5 },
      { from: "code", to: "run", label: "execute", showAt: 5 }
    ],
    steps: [
      {
        title: "Same problem, two artifacts",
        text: "An algorithm is a step-by-step procedure for a computational problem. A program is also a procedure. Split them by phase: design versus implementation.",
        highlight: ["prob", "algo", "code", "design", "impl"],
        flows: [
          { from: "prob", to: "algo", color: "#60a5fa", label: "design" },
          { from: "prob", to: "code", color: "#fb923c", label: "code" }
        ]
      },
      {
        title: "Who writes which",
        text: "Domain knowledge drafts the algorithm — an accountant for a ledger, clinical staff for a hospital flow. Programmers implement. One person can do both jobs; the hats stay distinct.",
        highlight: ["domain", "algo", "coder", "code"],
        flows: [
          { from: "domain", to: "algo", color: "#60a5fa", label: "write" },
          { from: "coder", to: "code", color: "#fb923c", label: "type" }
        ]
      },
      {
        title: "Language of each",
        text: "Algorithms use English or math as long as the team can read them. Programs use a programming language. The sketch is for people; the source is for a compiler.",
        highlight: ["algo", "eng", "code", "plang"]
      },
      {
        title: "Machines do not constrain the design",
        text: "The algorithm does not name a CPU or Windows versus Linux. The program does: hardware, OS, and environment change how you write and ship it.",
        highlight: ["algo", "free", "code", "bound"]
      },
      {
        title: "Analyze versus test",
        text: "You study an algorithm for time and space. You run a program and test it. Nothing in the design-time text is executed yet.",
        highlight: ["algo", "ts", "code", "run"],
        flows: [
          { from: "algo", to: "ts", color: "#c084fc", label: "T,S" },
          { from: "code", to: "run", color: "#fb923c", label: "run" }
        ]
      },
      {
        title: "C shape is a reading aid",
        text: "Later lectures write steps in C-like form because graduates already know C. That is notation, not a claim that algorithms are typed programs.",
        highlight: ["csyn", "algo", "eng"]
      }
    ]
  }
});
