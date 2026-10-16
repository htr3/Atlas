window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 26,
  title: "System Design Walkthrough at InterviewReady",
  video: "https://www.youtube.com/watch?v=CC-AxHIgBSM",
  category: "Interview Prep",
  tagline: "Fundamentals, then high-level design, then low-level design, matched to SDE 1 through 3.",
  summary: "A tour of the InterviewReady study path rather than one product design. Log in, use the free fundamentals, then unlock high-level design (how a system like Gmail is cut into gateway and services) and low-level design (how a component like Splitwise becomes objects and tests). SDE 1 can live on the free track; SDE 2 and 3 should finish the course. Quizzes, notes, and a help desk sit beside the videos.",

  theory: [
    {
      heading: "Start at the door, not at the hardest chapter",
      body: "Sign in (Google or GitHub is fine; zip code is an India-only tax field). Take the free preview before you buy. The catalog is four shelves: <b>fundamentals</b>, <b>high-level design</b>, <b>low-level design</b>, and extra free resources. If you are new to distributed systems, or rusty, the first shelf is not optional. Those videos are free and they preview the rest of the course.",
      bullets: [
        "Preview first, coupon later, purchase last",
        "Four shelves, one recommended order",
        "Fundamentals are the on-ramp, not a side quest"
      ]
    },
    {
      heading: "How to study a single lesson",
      body: "Each video carries an about blurb, a resources list, a personal notes pane, and a discussion thread. Use notes for lines you would reuse in an interview. Rate the lesson so the authors know what landed. Many chapters add architecture diagrams, quizzes that check whether the idea actually stuck, FAQs, API contracts, and capacity estimates when those belong. Treat that bundle as the study loop: watch, note, quiz, discuss, then move.",
      bullets: [
        "Notes are for future you in a war room, not a transcript dump",
        "Quizzes exist to catch \"I watched it\" without \"I can redraw it\"",
        "Contracts and back-of-envelope math show up when the chapter needs them"
      ]
    },
    {
      heading: "High-level design is the big-system cut",
      body: "HLD asks how a large product is wired. The Gmail sketch in the walkthrough: clients hit a <b>gateway</b>, the gateway fans out to internal services such as <b>authentication</b>, and you reason about those components as boxes with contracts, not as Java classes. This is the SDE-2-and-up interview drawing: scale, failure, data flow, where state lives.",
      bullets: [
        "Unit of thought: service, store, queue, edge",
        "Example: Gmail clients -> gateway -> auth and friends",
        "Success looks like a diagram you could hand to several teams"
      ]
    },
    {
      heading: "Low-level design is the component cut",
      body: "LLD zooms into one piece of a large product and asks which objects and classes it needs. The first LLD chapter here is <b>Splitwise</b>: closer to code and tests than to regional failover. You are designing the insides of a service, not the fleet. People who skip HLD and jump here often invent classes for problems they have not scoped.",
      bullets: [
        "Unit of thought: class, invariant, test",
        "Example: Splitwise balances, groups, settle-up",
        "Success looks like something you could implement in a repo"
      ]
    },
    {
      heading: "Match depth to the level you are hiring for",
      body: "Recommended order is always fundamentals, then HLD, then LLD. The extra free resources are pitched as enough to clear an <b>SDE 1</b> screen. <b>SDE 2</b> and <b>SDE 3</b> should take the whole paid path; the course is aimed at that band. Senior engineers and PMs will recognize most of it and can treat it as revision. Progress is visible on the dashboard; full completion has a certificate as a cheap extra incentive, not as the point.",
      bullets: [
        "SDE 1: free fundamentals plus free extras",
        "SDE 2 / 3: finish HLD and LLD, including quizzes",
        "Do not start at Splitwise if you cannot yet draw a gateway"
      ]
    },
    {
      heading: "When you are stuck",
      body: "A chatbot handles the simple questions so humans are not a ticket queue. Harder or account-specific issues get a human reply within a day. Email (<code>contact@interviewready.io</code>) and a contact form exist for the same reason; a screenshot helps if you are reporting a bug. The support path is part of the study system: do not sit on a blocked chapter."
    }
  ],

  keyTerms: [
    { term: "Fundamentals track", def: "Free primers on the building blocks. The right first week for anyone who has not designed distributed systems recently." },
    { term: "High-level design", def: "How a large product is cut into gateways, services, and stores. Interview drawing for SDE 2+." },
    { term: "Low-level design", def: "How one component becomes objects, classes, and tests. Closer to code than to regions." },
    { term: "Study loop", def: "Watch, read the about/resources, write notes, take the quiz, skim discussion, then advance." },
    { term: "SDE 1 path", def: "Free resources plus fundamentals; enough to talk through a small design without the full course." },
    { term: "SDE 2 / 3 path", def: "The complete catalog, HLD then LLD, with quizzes and capacity work." },
    { term: "Gateway (HLD example)", def: "The Gmail-style edge that takes client traffic and hands it to internal services such as auth." }
  ],

  tradeoffs: [
    { pro: "Free fundamentals let you test-fit the teaching style before paying", con: "Stopping there leaves HLD and LLD holes that SDE 2 interviews will find" },
    { pro: "HLD first gives you a map of boxes so LLD has a place to live", con: "HLD without LLD can stay hand-wavy when they ask for classes" },
    { pro: "Quizzes and notes turn watching into recall practice", con: "Skipping them feels faster and produces a false sense of coverage" }
  ],

  interviewTips: [
    "Study in the published order: fundamentals, HLD, LLD. Skipping to case studies without the primers shows up as missing vocabulary.",
    "For SDE 1, be fluent in the free building blocks. For SDE 2 and 3, expect Gmail-style HLD and Splitwise-style LLD in the same loop.",
    "When you watch a chapter, write one interview sentence in the notes pane, not a transcript.",
    "On an HLD prompt, start with clients, gateway, and two or three named services before any class names.",
    "On an LLD prompt, name objects, invariants, and tests; do not redraw the whole company's regions.",
    "If a chapter has a quiz or a capacity estimate, do it. That is closer to the interview than a second playback."
  ],

  scene: {
    nodes: [
      { id: "you", label: "You", type: "user", pos: [-11, 0, 0] },
      { id: "login", label: "Login / signup", type: "gateway", pos: [-7, 0, 0] },

      { id: "zFree", label: "Free preview", type: "zone", pos: [-2, 0, 0], size: [6, 10], showAt: 1 },
      { id: "fund", label: "Fundamentals", type: "server", pos: [-2, 0, 0], showAt: 1 },
      { id: "extras", label: "Free extras", type: "storage", pos: [-2, 0, 4], showAt: 1 },
      { id: "noteSde1", label: "SDE 1 can live here", type: "note", pos: [-2, 4.5, 6], showAt: 1 },

      { id: "about", label: "About", type: "note", pos: [-5, 3.5, -6], showAt: 2 },
      { id: "res", label: "Resources", type: "note", pos: [-1, 3.5, -6], showAt: 2 },
      { id: "notes", label: "Your notes", type: "note", pos: [3, 3.5, -6], showAt: 2 },
      { id: "quiz", label: "Quiz", type: "worker", pos: [-2, 0, -4], showAt: 2 },
      { id: "talk", label: "Discussion", type: "queue", pos: [1, 0, -4], showAt: 2 },

      { id: "zHld", label: "High-level design", type: "zone", pos: [6, 0, -3], size: [8, 6], showAt: 3 },
      { id: "gmailC", label: "Gmail client", type: "phone", pos: [3.5, 0, -3], showAt: 3 },
      { id: "gmailGw", label: "Gateway", type: "gateway", pos: [6, 0, -3], showAt: 3 },
      { id: "gmailAuth", label: "Auth service", type: "service", pos: [8.5, 0, -4.5], showAt: 3 },
      { id: "gmailMail", label: "Mail service", type: "service", pos: [8.5, 0, -1.5], showAt: 3 },

      { id: "zLld", label: "Low-level design", type: "zone", pos: [6, 0, 4], size: [8, 5], showAt: 4 },
      { id: "sw", label: "Splitwise", type: "service", pos: [4, 0, 4], showAt: 4 },
      { id: "obj", label: "Objects / classes", type: "worker", pos: [7, 0, 3], showAt: 4 },
      { id: "tests", label: "Tests", type: "worker", pos: [7, 0, 5.5], showAt: 4 },
      { id: "noteLld", label: "Closer to code than regions", type: "note", pos: [6, 4.2, 7.5], showAt: 4 },

      { id: "sde1", label: "SDE 1", type: "user", pos: [-11, 0, 4], showAt: 5 },
      { id: "sde2", label: "SDE 2", type: "user", pos: [-11, 0, -3], showAt: 5 },
      { id: "sde3", label: "SDE 3", type: "user", pos: [-11, 0, -6], showAt: 5 },
      { id: "cert", label: "100% certificate", type: "point", pos: [11, 0, 0], showAt: 6, color: "#4ade80" },
      { id: "progress", label: "Course progress", type: "note", pos: [10, 4, -4], showAt: 6 },

      { id: "bot", label: "Chatbot", type: "lb", pos: [3, 0, 7], showAt: 7 },
      { id: "human", label: "Human < 24h", type: "user", pos: [7, 0, 7], showAt: 7 },
      { id: "noteHelp", label: "Bot first, then email / form", type: "note", pos: [5, 4, 8], showAt: 7 }
    ],
    edges: [
      { from: "you", to: "login", label: "sign in" },
      { from: "login", to: "fund", showAt: 1 },
      { from: "login", to: "extras", showAt: 1 },
      { from: "fund", to: "quiz", showAt: 2 },
      { from: "fund", to: "talk", showAt: 2, dashed: true },
      { from: "fund", to: "gmailGw", showAt: 3 },
      { from: "gmailC", to: "gmailGw", showAt: 3 },
      { from: "gmailGw", to: "gmailAuth", showAt: 3 },
      { from: "gmailGw", to: "gmailMail", showAt: 3 },
      { from: "gmailGw", to: "sw", showAt: 4, dashed: true },
      { from: "sw", to: "obj", showAt: 4 },
      { from: "sw", to: "tests", showAt: 4 },
      { from: "sde1", to: "fund", showAt: 5 },
      { from: "sde1", to: "extras", showAt: 5 },
      { from: "sde2", to: "gmailGw", showAt: 5 },
      { from: "sde3", to: "sw", showAt: 5 },
      { from: "gmailMail", to: "cert", showAt: 6, dashed: true },
      { from: "tests", to: "cert", showAt: 6, dashed: true },
      { from: "you", to: "bot", showAt: 7 },
      { from: "bot", to: "human", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "Log in, then look around",
        text: "Create an account (Google or GitHub works). Skip zip code if you are not in India. The next honest step is the free preview, not the buy button, unless you already know you want the whole path.",
        highlight: ["you", "login"],
        hide: ["zFree", "fund", "extras", "noteSde1", "about", "res", "notes", "quiz", "talk", "zHld", "gmailC", "gmailGw", "gmailAuth", "gmailMail", "zLld", "sw", "obj", "tests", "noteLld", "sde1", "sde2", "sde3", "cert", "progress", "bot", "human", "noteHelp"],
        flows: [
          { from: "you", to: "login", color: "#4ade80", label: "enter" }
        ]
      },
      {
        title: "Shelf one: free fundamentals",
        text: "Four sections exist, but if you are new, you start here. The fundamentals videos are free and they preview what the paid chapters will demand. Extra free resources sit on the same shelf. This band is the SDE 1 on-ramp.",
        highlight: ["fund", "extras", "noteSde1", "zFree"],
        hide: ["about", "res", "notes", "quiz", "talk", "zHld", "gmailC", "gmailGw", "gmailAuth", "gmailMail", "zLld", "sw", "obj", "tests", "noteLld", "sde1", "sde2", "sde3", "cert", "progress", "bot", "human", "noteHelp"],
        flows: [
          { from: "login", to: "fund", color: "#4ade80", label: "preview" }
        ]
      },
      {
        title: "The lesson loop",
        text: "About, resources, your own notes, discussion, and a quiz. Write down sentences you would reuse in an interview. The quiz is how you find out whether the idea is actually in your head. Diagrams, FAQs, API contracts, and capacity estimates show up when the chapter needs them.",
        highlight: ["fund", "about", "res", "notes", "quiz", "talk"],
        hide: ["noteSde1", "zHld", "gmailC", "gmailGw", "gmailAuth", "gmailMail", "zLld", "sw", "obj", "tests", "noteLld", "sde1", "sde2", "sde3", "cert", "progress", "bot", "human", "noteHelp"],
        flows: [
          { from: "fund", to: "quiz", color: "#fb923c", label: "test" },
          { from: "fund", to: "talk", color: "#60a5fa", label: "discuss" }
        ]
      },
      {
        title: "HLD: Gmail as boxes",
        text: "High-level design asks how a large system behaves. Clients talk to a gateway; the gateway talks to internal services such as authentication and mail. You are placing components and contracts, not methods.",
        highlight: ["gmailC", "gmailGw", "gmailAuth", "gmailMail", "zHld"],
        hide: ["about", "res", "notes", "quiz", "talk", "zLld", "sw", "obj", "tests", "noteLld", "sde1", "sde2", "sde3", "cert", "progress", "bot", "human", "noteHelp", "noteSde1"],
        flows: [
          { from: "fund", to: "gmailGw", color: "#4ade80", label: "then HLD" },
          { from: "gmailC", to: "gmailGw", color: "#4ade80", label: "req" },
          { from: "gmailGw", to: "gmailAuth", color: "#60a5fa", label: "auth" }
        ]
      },
      {
        title: "LLD: Splitwise as objects",
        text: "Low-level design takes one component and asks for classes, invariants, and tests. Splitwise is the first LLD chapter: closer to code than to multi-region failover. Do this after you can already draw the HLD map.",
        highlight: ["sw", "obj", "tests", "noteLld", "zLld"],
        hide: ["about", "res", "notes", "quiz", "talk", "sde1", "sde2", "sde3", "cert", "progress", "bot", "human", "noteHelp", "noteSde1", "gmailC", "gmailAuth", "gmailMail"],
        flows: [
          { from: "gmailGw", to: "sw", color: "#c084fc", label: "then LLD" },
          { from: "sw", to: "obj", color: "#4ade80", label: "classes" },
          { from: "sw", to: "tests", color: "#60a5fa", label: "tests" }
        ]
      },
      {
        title: "Pick the path that matches the job",
        text: "SDE 1: fundamentals plus free extras. SDE 2 and SDE 3: the whole course, HLD then LLD. The catalog is built for that senior band. Staff and PMs can treat it as revision. Do not skip the order.",
        highlight: ["sde1", "sde2", "sde3", "fund", "gmailGw", "sw"],
        hide: ["about", "res", "notes", "quiz", "talk", "cert", "progress", "bot", "human", "noteHelp", "noteSde1", "noteLld", "obj", "tests", "gmailC", "gmailAuth", "gmailMail"],
        flows: [
          { from: "sde1", to: "fund", color: "#4ade80", label: "free track" },
          { from: "sde2", to: "gmailGw", color: "#60a5fa", label: "full HLD" },
          { from: "sde3", to: "sw", color: "#c084fc", label: "full LLD" }
        ]
      },
      {
        title: "Finish the map; the certificate is extra",
        text: "Progress is measured on the dashboard. Rate videos. A certificate exists for 100% completion as a nudge, not as the skill. The skill is being able to redraw Gmail's edge and Splitwise's objects without the tape.",
        highlight: ["cert", "progress", "gmailGw", "sw"],
        hide: ["about", "res", "notes", "quiz", "talk", "sde1", "sde2", "sde3", "bot", "human", "noteHelp", "noteSde1", "noteLld", "obj", "gmailC", "gmailAuth"],
        flows: [
          { from: "gmailGw", to: "cert", color: "#4ade80", label: "HLD done" },
          { from: "sw", to: "cert", color: "#4ade80", label: "LLD done" }
        ]
      },
      {
        title: "Unblock instead of stalling",
        text: "Simple questions go to the chatbot. Anything specific gets a human within 24 hours, or email, or the contact form with a screenshot. Do not let a stuck chapter become a skipped chapter.",
        highlight: ["bot", "human", "noteHelp", "you"],
        hide: ["about", "res", "notes", "quiz", "talk", "sde1", "sde2", "sde3", "cert", "progress", "noteSde1", "noteLld", "obj", "tests", "gmailC", "gmailAuth", "gmailMail", "zHld", "zLld", "sw", "gmailGw"],
        flows: [
          { from: "you", to: "bot", color: "#fb923c", label: "ask" },
          { from: "bot", to: "human", color: "#60a5fa", label: "escalate" }
        ]
      }
    ]
  }
});
