window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 11,
  title: "Low-Level Design: Interview Questions and Tips",
  video: "https://www.youtube.com/watch?v=VdwkFAhLEHo",
  category: "Low-Level Design",
  tagline: "Turn requirements into use cases, classes, and signatures — not a memorized PDF.",
  summary: "Gaurav Sen and Arun Goel walk how LLD interviews actually run for undergrads through SD2, what to study first, why UML is language-agnostic, how design patterns should be learned in a real system, and how this course differs from machine-coding depth aimed at SD3. The scene is the interview loop itself.",

  theory: [
    {
      heading: "Who is asked LLD, and how deep",
      body: "A live poll in the session was mostly SD1, then undergrads and SD2, then SD3. Classic LLD — requirements to classes — is the SD1/SD2 and campus loop. SD3 shifts toward machine coding: you read existing code and make it more correct, reliable, concurrent, not only faster. You still need crystal-clear basics before that. Fresh graduates should lock DSA and OOP first; experienced SD1s switching companies will see LLD and HLD after the problem-solving round at almost every firm except a DSA-only Google-style loop.",
      bullets: [
        "OOP that matters: classes, interfaces, abstract types, SOLID, composition vs aggregation vs association.",
        "DSA that matters: which structure inserts, deletes, and looks up at what cost.",
        "You do not need to finish a separate OOP textbook; the course restates the bits you forgot."
      ]
    },
    {
      heading: "A kickstart that is not a syllabus",
      body: "There is no required HLD-then-LLD order. Pick a small system — a cache, a load balancer, or two features of a social app (profile + post, follow + feed) — and build it. When the code hurts, you discover why a pattern exists. Hotel management, e-commerce search vs delivery as separate services, parking, chat, payments, a social graph: categories, not one branded clone. Implementation teaches more than a pattern catalog you binge the night before.",
      bullets: [
        "Two or three requirements are enough for a first pass.",
        "HLD and LLD are different skills; they can be studied in parallel.",
        "Side projects and open source beat trivia for \"practical\" SD2 prep."
      ]
    },
    {
      heading: "The interview process on the board",
      body: "The repeatable loop is: (1) pin requirements with the interviewer, (2) use-case diagram — actors and actions, language-agnostic, (3) class diagram from those use cases, including relationships and cardinalities, (4) method signatures — arguments and return types — which is where the debate lives, (5) code only as far as the round needs. Java is popular for LLD in polls, but factories and observers do not change meaning in Python; 80% of the work is the first two diagrams. Functional/Node developers still draw use cases and activities. Do not start coding a HashMap.insert unless they want machine coding.",
      bullets: [
        "Interviewers already tested algorithms; they are testing API taste and decomposition.",
        "Ask whether they want code or a high-level design if the prompt is ambiguous (rate limiter, cache).",
        "Extensibility: new developers should change one area without rewriting the rest."
      ]
    },
    {
      heading: "Patterns in context, not as a playlist",
      body: "The course deliberately does not open with hour-long pattern videos. Singleton, Strategy, Factory, Observer vs pub/sub make sense after you have felt the need in a parking lot or a cache. Short PDFs plus a worked example beat a theory dump, and they include tradeoffs between similar patterns. SOLID shows up as a reason to pull locker-scoring out of System, not as a poster. If a lesson rates poorly, they reshoot — the attitude is \"this still has to get you into the company,\" not \"you paid, we are done.\"",
      bullets: [
        "Do not memorize twenty pattern names; apply two well and name the tradeoff.",
        "Machine-coding chapters (cache, event bus, Splitwise with tests and concurrency) sit at SD3+.",
        "The basics course exists because people could not enter those chapters cold."
      ]
    },
    {
      heading: "How systems get harder by level",
      body: "Facebook for SD1 might be profile, wall, timeline. SD2 adds like and comment. SD3 adds chat or marketplace. Aadhaar looks \"just profiles\" until you add biometrics, many client types, bulk KYC, and a ban on a backend engineer SELECT-ing all women in a pincode. Same skeleton, tighter non-functionals. LRU cache stays interview-famous because you can twist it: requirements, algorithm, a pattern. Team-specific prompts (email at AWS) also happen. Early startups may demand a language; large companies onboard you.",
      bullets: [
        "Never assume \"latency always wins\"; batch jobs may want cheap and accurate.",
        "Talk to the interviewer before inventing security theatre.",
        "Frontend LLD is out of scope here; a little Git and devops help every stack."
      ]
    },
    {
      heading: "Practice, feedback, and the long game",
      body: "Doubt threads under lessons and twice-monthly live sessions are how you get unstuck — one Zoom even turned into a group debug of a container farm. Quizzes after lectures beat cramming a PDF (the comparison to Grokking in the session: videos, tradeoffs, retention checks). Lifetime access and new chapters (payment gateway, cache, calendar, broker-style live prices) are the product promise. Paying is not studying; book a slot. Upskill for the job, not only the next one-hour loop — \"always interview ready\" is the joke they want as a tagline.",
      bullets: [
        "Read code (Caffeine was the example) after you can draw the diagrams.",
        "Concurrency and locking appear in senior LLD; mention them even in a one-hour screen.",
        "If you switch domains, start with a tiny auth service and host it; do not wait for permission."
      ]
    }
  ],

  keyTerms: [
    { term: "Use-case diagram", def: "Actors and actions taken from the prompt; first language-agnostic artifact on the board." },
    { term: "Class diagram", def: "Types, fields, methods, and relationships derived from those use cases." },
    { term: "Signature debate", def: "The LLD round's core: why this argument, why this return type, not HashMap internals." },
    { term: "SOLID", def: "Especially single responsibility — scoring lockers is not the System's job." },
    { term: "Design pattern in situ", def: "Factory, Strategy, Singleton learned inside a working example, with tradeoffs." },
    { term: "Machine coding", def: "Running code, tests, concurrency; SD3+ cousin of diagram-first LLD." },
    { term: "Category problem", def: "E-commerce, social, payments — transferable shapes, not one company's clone." },
    { term: "Level knob", def: "Same product, more features or stricter NFRs as you go from SD1 to SD3." }
  ],

  tradeoffs: [
    { pro: "Use case → class → signatures works for Java, Python, and even non-OOP sketches.", con: "Skipping diagrams and jumping to code hides bad APIs until the last five minutes." },
    { pro: "Learning patterns inside a system sticks and shows tradeoffs.", con: "A pattern-only playlist feels complete and fails when the prompt is new." },
    { pro: "Machine-coding depth (tests, threads) prepares SD3.", con: "SD1 candidates drown if that is their first LLD contact." },
    { pro: "HLD and LLD in parallel cover both rounds.", con: "Zero OOP/DSA basics still makes both rounds stall." },
    { pro: "Asking the interviewer about NFRs and HLD vs LLD saves the hour.", con: "Assuming \"always low latency\" or coding a full factory unasked wastes it." }
  ],

  interviewTips: [
    "Clarify requirements and NFRs before boxes; never assume latency or security.",
    "Board order: use cases, class diagram with cardinalities, then signatures.",
    "Name a pattern only when the design already needs it, and cite a tradeoff.",
    "Calibrate depth to level: SD1 three features; SD3 extra subsystems and reliability.",
    "If the prompt is a library (cache, limiter, balancer), skip heavy UML and show the interface.",
    "Talk concurrency and tests even when you will not finish perfect code in 60 minutes."
  ],

  scene: {
    nodes: [
      { id: "cand", label: "Candidate", type: "user", pos: [-10, 0, 0] },
      { id: "intv", label: "Interviewer", type: "user", pos: [10, 0, 0] },

      { id: "req", label: "1. Requirements", type: "note", pos: [-6, 0, -5] },
      { id: "uc", label: "2. Use cases", type: "service", pos: [-2, 0, -5], showAt: 1 },
      { id: "cls", label: "3. Class diagram", type: "db", pos: [2, 0, -5], showAt: 2 },
      { id: "api", label: "4. Signatures", type: "gateway", pos: [6, 0, -5], showAt: 3 },

      { id: "pat", label: "Pattern fit", type: "worker", pos: [-2, 0, 4], showAt: 4 },
      { id: "thr", label: "Concurrency", type: "cache", pos: [2, 0, 4], showAt: 5 },
      { id: "tst", label: "Tests", type: "queue", pos: [6, 0, 4], showAt: 5 },

      { id: "sd1", label: "SD1 depth", type: "point", pos: [-6, 0, 4], showAt: 6 },
      { id: "sd3", label: "SD3 depth", type: "point", pos: [-6, 0, 7], showAt: 6 },

      { id: "n0", label: "talk before boxes", type: "note", pos: [-10, 0, -5] },
      { id: "n1", label: "language agnostic", type: "note", pos: [-2, 0, -8], showAt: 1 },
      { id: "n2", label: "debate the types", type: "note", pos: [6, 0, -8], showAt: 3 },
      { id: "n3", label: "pattern after pain", type: "note", pos: [-2, 0, 7], showAt: 4 },
      { id: "n4", label: "same app, more NFR", type: "note", pos: [-10, 0, 5], showAt: 6 },
      { id: "n5", label: "code last, if at all", type: "note", pos: [10, 0, 5], showAt: 7 }
    ],
    edges: [
      { from: "cand", to: "intv", label: "clarify", dashed: true },
      { from: "cand", to: "req", label: "ask" },
      { from: "intv", to: "req", label: "scope" },
      { from: "req", to: "uc", showAt: 1 },
      { from: "uc", to: "cls", showAt: 2 },
      { from: "cls", to: "api", showAt: 3 },
      { from: "cls", to: "pat", showAt: 4, dashed: true },
      { from: "api", to: "thr", showAt: 5, dashed: true },
      { from: "api", to: "tst", showAt: 5, dashed: true },
      { from: "sd1", to: "uc", showAt: 6, dashed: true },
      { from: "sd3", to: "thr", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Sit down, then ask",
        text: "The candidate and interviewer share the hour. First move is requirements and non-functionals — not a class named Manager. Latency, cost, and security are product questions, not slogans.",
        highlight: ["cand", "intv", "req", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "cand", to: "intv", color: "#60a5fa", label: "what matters?" },
          { from: "intv", to: "req", color: "#4ade80", label: "scope" }
        ]
      },
      {
        title: "Use cases, any language",
        text: "Actors and actions go on the board. This step does not care if you later type Java or Python. A Node/functional engineer still starts here.",
        highlight: ["req", "uc", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "req", to: "uc", color: "#4ade80", label: "actors" }
        ]
      },
      {
        title: "Classes from those actions",
        text: "Each use case becomes types, fields, and relationships (one-to-one, one-to-many). This is still language-agnostic. Bad names and circular Product↔Item links show up here, while they are cheap to fix.",
        highlight: ["uc", "cls"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "uc", to: "cls", color: "#fb923c", label: "types" }
        ]
      },
      {
        title: "Signatures are the fight",
        text: "Most of the round is why this argument and this return type. Everyone can put into a map. Interviewers already scored DSA elsewhere.",
        highlight: ["cls", "api", "intv", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5"],
        flows: [
          { from: "cls", to: "api", color: "#4ade80", label: "methods" },
          { from: "intv", to: "api", color: "#fb923c", label: "why that arg?" }
        ]
      },
      {
        title: "Name a pattern when it earns it",
        text: "Factory, Strategy, Singleton appear after the design needs plug-in behavior — not as a memorized opening. Compare Observer vs pub/sub if both seem to fit.",
        highlight: ["pat", "cls", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5"],
        flows: [
          { from: "cls", to: "pat", color: "#c084fc", label: "strategy?" }
        ]
      },
      {
        title: "Concurrency and tests for seniors",
        text: "SD2/SD3 loops want you to say how threads collide and how you would schedule tests. Perfect code in 60 minutes is not required; ignoring races is.",
        highlight: ["thr", "tst", "api"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "api", to: "thr", color: "#fb923c", label: "locks" },
          { from: "api", to: "tst", color: "#60a5fa", label: "cases" }
        ]
      },
      {
        title: "Turn the level knob",
        text: "SD1: profile, feed, timeline. SD3: chat, marketplace, bulk KYC, \"no SQL fishing.\" Same product, more subsystems and stricter NFRs. Calibrate before you overbuild.",
        highlight: ["sd1", "sd3", "uc", "thr", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5"],
        flows: [
          { from: "sd1", to: "uc", color: "#4ade80", label: "3 features" },
          { from: "sd3", to: "thr", color: "#f87171", label: "reliability" }
        ]
      },
      {
        title: "Code last, if they want it",
        text: "Libraries (cache, limiter, balancer) can skip heavy UML and start at the interface. Otherwise code maps the diagram. You will not produce a perfect solution live — that is expected. Practice so the next board is faster.",
        highlight: ["cand", "api", "intv", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "api", to: "intv", color: "#4ade80", label: "walk code" },
          { from: "intv", to: "cand", color: "#60a5fa", label: "next question" }
        ]
      }
    ]
  }
});
