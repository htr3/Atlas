window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 12,
  title: "What happens inside a software interview? Algorithms, Data Structures, System Design and Behavioral",
  video: "https://www.youtube.com/watch?v=g4Y-CRS_QRI",
  category: "Interview Prep",
  tagline: "Coding tests if you can learn; design locates you now; behavior asks if you will.",
  summary: "A software loop is three rooms, not one puzzle. Coding (DSA) is an IQ-plus-knowledge filter with an auto-judge, a fashion-driven syllabus, and weak job relevance. System design asks whether you can perform in this role today and needs a skilled interviewer. Behavioral (STAR / last 18 months) hashes motives: will you do the work later. Startups overweight design; large firms overweight coding plus googliness. Read the funnel instead of gaming one round.",

  theory: [
    {
      heading: "Three rooms, three questions",
      body: "Almost every software hiring loop is the same three instruments. <b>Coding</b> — algorithms and data structures — asks how smart you are and whether you own undergrad tools. <b>System design</b> (the old 'technical' round) asks whether you can perform <i>in this role, now</i>. <b>Behavioral</b> — sometimes branded a profit or fit interview — asks whether you will perform in the role now <i>and later</i>, which is a question about motives. You are not trying to cheat the machine; you are trying to show the evidence each room is built to collect.",
      bullets: [
        "Coding: intelligence + basic skill + knowledge.",
        "Design: demonstrated skill at today's job.",
        "Behavioral: intent, not a second coding puzzle."
      ]
    },
    {
      heading: "How each room is actually scored",
      body: "Coding uses a problem: DP, graphs, the usual CS contest diet. Design hands you a situation and asks you to design or code a solution. Behavioral dissects the last <b>~18 months</b> — memorable, usually challenging, incidents — and walks what you did, thought, and felt. That is a <b>critical incident interview</b> (CII); <b>STAR</b> is one structured way to tell it. They are not predicting your future with a crystal ball. They are hashing you into a bucket from recent data points, the way a startup-to-in-house database migration in the last year is one point on that hash.",
      bullets: [
        "Coding mechanism: solve a problem under a clock.",
        "Design mechanism: given a situation, produce an architecture or a design.",
        "Behavioral mechanism: past 18 months → bucket, via STAR / CII."
      ]
    },
    {
      heading: "Coding: scalable, objective, barely about the job",
      body: "Three months of DSA prep is itself a signal of interest. The round scales: hundreds of profiles, questions written quickly, an <b>online judge</b> that does not argue. Syllabus is easy to name — binary search is the alphabet of the degree. Job relevance, though, is thin to none. False negatives get the blog heat; the talk also flags <b>false positives</b>: people who pass algorithms and then show little evidence they can do the role — on the order of <b>10–20%</b> in the speaker's experience. The syllabus is fashion. DP is asked because it is 'cool,' not because production work is DP. Game AI (alpha-beta on trees), RSA, data-mining algorithms would test IQ and knowledge just as well and are ignored. This room is the most <b>volatile</b> piece of the loop.",
      bullets: [
        "Pros: scale, auto-judge, objectivity, cheap syllabus.",
        "Cons: weak relevance, false positives, fashion-driven topics.",
        "Prep time is a dedication signal, not proof you can ship."
      ]
    },
    {
      heading: "Design: job-relevant, expensive, easy to mis-run",
      body: "Low-level design in particular maps onto real work. It is not automated and it is subjective — until the interviewer is actually skilled. An <b>SD2 running a director loop</b> is a smell: they ask for a known data structure on an unknown 45-minute prompt (the autocorrect example: fuzzy matching vs 'you should have said tries') because they have never operated at that level either. Skilled interviewers are scarce and pulling them off the product is costly, which is why companies still lean on DSA. Hit rate is the prize: if someone looks strong in design, they often look strong at work. False positives and negatives are lower than in coding.",
      bullets: [
        "Needs an interviewer who has done the job.",
        "Known-solution bingo in 45 minutes is a bad design round.",
        "Lower false-hire rate than a pure IQ screen."
      ]
    },
    {
      heading: "Behavioral: will they, not can they",
      body: "Predictability here is about the future: is this person interested, and are they the kind of person who <i>does</i> the work — not merely someone who could learn it. After a decent behavioral, false positives and false negatives are extremely low. It is still a human grade, so it is subjective, but more structured than engineers give it credit for. Same staffing problem as design: you need a skilled interviewer. Do not treat it as small talk after the 'real' rounds.",
      bullets: [
        "Measures motives and follow-through.",
        "Structured rubrics exist; it is not vibes-only.",
        "Google-style 'googliness' is this room with a brand name."
      ]
    },
    {
      heading: "Can / is / will on the value curve",
      body: "Sketch value against time. Early on you may be worth zero or negative (you need training). Later, kinetic output catches the paycheck, then some people scale, some plateau, some leave — a loss if they leave at the steep part. <b>Coding</b> mostly tests whether you <i>can</i> be the steep line (learning speed, investment). <b>Design</b> locates where you <i>are</i> on that curve today. <b>Behavioral</b> asks which line you will actually walk. 'Gaurav can be an entrepreneur / will be / is' are three different measurements. Hire for the mix you need, not the mix that is fashionable.",
      bullets: [
        "Coding ≈ potential to learn a moving landscape.",
        "Design ≈ current operating point.",
        "Behavioral ≈ chosen trajectory."
      ]
    },
    {
      heading: "Startups, bigcos, and the rest of the org chart",
      body: "Most startups should overweight <b>system design</b>: they need someone who can perform now. Large firms (Google, Microsoft) overweight coding plus behavioral for SD1/SD2 and often skip design entirely — they are buying learning rate and culture-fit, and junior design is a weak signal. As seniority and cost explode, design becomes the starting coordinate you cannot skip. Frontend, backend, DevOps, QA all still sit in the same three-room loop: IQ and behavioral are universal; the 'design' slot is a <b>role-shaped technical</b> (how you deploy, how you test, how you structure UI). The whole process is the product. Clearing DSA is not an offer.",
      bullets: [
        "Startup: design is the expensive question.",
        "Bigco junior: coding + behavioral; design waits.",
        "Role-shaped technical + universal IQ + universal behavioral."
      ]
    }
  ],

  keyTerms: [
    { term: "Coding round", def: "DSA problem used as an IQ + knowledge filter, often auto-judged." },
    { term: "System design round", def: "Situation → architecture; tests skill at this role now." },
    { term: "Behavioral / profit", def: "Fit and motives: will the person do the job later, not only can they." },
    { term: "STAR / CII", def: "Structured retelling of a hard incident from about the last 18 months." },
    { term: "Auto-judge", def: "Remote executor that makes coding scalable and argument-proof." },
    { term: "False positive", def: "Passes coding, then cannot perform in role — quoted around 10–20%." },
    { term: "Syllabus fashion", def: "DP is asked because it is in vogue, not because the job is DP." },
    { term: "Can / is / will", def: "Potential (coding), current skill (design), chosen path (behavioral)." }
  ],

  tradeoffs: [
    { pro: "Coding scales, auto-grades, and signals three months of grind.", con: "Little job relevance and a real false-positive rate; topics swing with fashion." },
    { pro: "Design is the most job-shaped room and has a better hit rate.", con: "Needs scarce skilled interviewers; an SD2 on a director loop asks for tries on autocorrect." },
    { pro: "Behavioral predicts follow-through and interest.", con: "Still a human grade; a weak interviewer turns it into chat." },
    { pro: "Bigcos can skip junior design and buy learning rate.", con: "Startups that copy that loop hire people who cannot ship the current system." }
  ],

  interviewTips: [
    "Name the three rooms and what each measures: can-learn, can-now, will-later.",
    "For DSA, treat the syllabus as fashion — prep what is asked, do not claim DP is the job.",
    "In design, talk like an operator, not a trivia bot; a try-for-tries prompt is a weak interviewer.",
    "Prepare 18-month STAR stories (situation, thought, feeling, act) — that is the behavioral spec.",
    "Calibrate company type: startups want design evidence; Google-style juniors want DSA + googliness.",
    "Walk the whole funnel out loud so you do not over-optimize one room."
  ],

  scene: {
    nodes: [
      { id: "cand", label: "Candidate", type: "user", pos: [-10, 0, 0] },
      { id: "code", label: "Coding", type: "server", pos: [-2, 0, -4] },
      { id: "des", label: "Design", type: "service", pos: [-2, 0, 0] },
      { id: "beh", label: "Behavioral", type: "worker", pos: [-2, 0, 4] },
      { id: "iq", label: "IQ + knowledge", type: "cache", pos: [8, 0, -4], showAt: 1 },
      { id: "sk", label: "Skills now", type: "gateway", pos: [8, 0, 0], showAt: 3 },
      { id: "mo", label: "Motives", type: "queue", pos: [8, 0, 4], showAt: 4 },
      { id: "big", label: "Bigco junior", type: "zone", pos: [-10, 0, -4], size: [5, 3], showAt: 6 },
      { id: "st", label: "Startup", type: "zone", pos: [-10, 0, 4], size: [5, 3], showAt: 6 },
      { id: "n0", label: "three rooms", type: "note", pos: [-8, 3, -7] },
      { id: "n1", label: "auto-judge, 3 months", type: "note", pos: [0, 3, -7], showAt: 1 },
      { id: "n2", label: "fashion, not the job", type: "note", pos: [8, 3, -7], showAt: 2 },
      { id: "n3", label: "needs a skilled intv", type: "note", pos: [-8, 3, 8], showAt: 3 },
      { id: "n4", label: "STAR, last 18 months", type: "note", pos: [0, 3, 8], showAt: 4 },
      { id: "n5", label: "can / is / will", type: "note", pos: [8, 3, 8], showAt: 5 },
      { id: "n6", label: "role-shaped technical", type: "note", pos: [3, 3, -7], showAt: 7 }
    ],
    edges: [
      { from: "cand", to: "code", label: "1" },
      { from: "code", to: "des", label: "2", showAt: 3 },
      { from: "des", to: "beh", label: "3", showAt: 4 },
      { from: "code", to: "iq", showAt: 1 },
      { from: "des", to: "sk", showAt: 3 },
      { from: "beh", to: "mo", showAt: 4 },
      { from: "big", to: "code", showAt: 6, dashed: true },
      { from: "st", to: "des", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Walk into three rooms",
        text: "The loop is coding, design, behavioral — not a single puzzle. Each room is built to collect a different kind of evidence. Gaming one of them is missing the machine.",
        highlight: ["cand", "code", "des", "beh", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "cand", to: "code", color: "#4ade80", label: "enter" }
        ]
      },
      {
        title: "Coding: IQ, knowledge, a judge",
        text: "DSA is an intelligence test plus undergrad tools. An auto-judge scores you without an argument. Three months of prep also signals that you wanted this company enough to grind.",
        highlight: ["code", "iq", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "cand", to: "code", color: "#4ade80", label: "solve" },
          { from: "code", to: "iq", color: "#60a5fa", label: "grade" }
        ]
      },
      {
        title: "The syllabus is fashion",
        text: "Job relevance is thin. False positives land people who cannot do the role (on the order of 10–20%). DP is asked because it is in vogue; RSA or alpha-beta would test the same IQ and are ignored. This room moves fastest.",
        highlight: ["code", "iq", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "iq", to: "code", color: "#fb923c", label: "this year: DP" }
        ]
      },
      {
        title: "Design: can you do this job now",
        text: "Architecture and LLD map onto real work. Scoring is subjective and collapses without a skilled interviewer — an SD2 grilling a director for tries on autocorrect is the anti-pattern. Hit rate is better than coding when the room is run well.",
        highlight: ["des", "sk", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6"],
        flows: [
          { from: "code", to: "des", color: "#4ade80", label: "next" },
          { from: "des", to: "sk", color: "#c084fc", label: "now" }
        ]
      },
      {
        title: "Behavioral: last 18 months, hashed",
        text: "STAR / critical-incident: a hard story, what you did, thought, felt. They are hashing motives into a bucket — will you do the work, not only could you learn it. False-hire rate here is the lowest of the three when the interviewer can actually grade.",
        highlight: ["beh", "mo", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6"],
        flows: [
          { from: "des", to: "beh", color: "#4ade80", label: "next" },
          { from: "beh", to: "mo", color: "#fb923c", label: "will?" }
        ]
      },
      {
        title: "Can, is, will",
        text: "Value-over-time: you start near zero, then some people steepen, plateau, or leave. Coding asks whether you can be the steep line. Design pins where you are. Behavioral asks which line you will walk. Those are three different sentences.",
        highlight: ["iq", "sk", "mo", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6"],
        flows: [
          { from: "iq", to: "sk", color: "#60a5fa", label: "can → is" },
          { from: "sk", to: "mo", color: "#c084fc", label: "is → will" }
        ]
      },
      {
        title: "Weight the rooms by employer",
        text: "Startups should care most about design — they need output now. Large firms buying SD1/SD2 often skip design and keep coding plus googliness. Senior cost makes design the coordinate you cannot skip.",
        highlight: ["big", "st", "code", "des"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "big", to: "code", color: "#60a5fa", label: "DSA+fit" },
          { from: "st", to: "des", color: "#4ade80", label: "ship now" }
        ]
      },
      {
        title: "One funnel, role-shaped middle",
        text: "Frontend, backend, DevOps, QA: IQ and behavioral stay. The middle room becomes how you structure UI, how you deploy, how you test. Google does not hire on one green tick. Show all three kinds of evidence.",
        highlight: ["cand", "code", "des", "beh", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "cand", to: "code", color: "#4ade80", label: "1" },
          { from: "code", to: "des", color: "#4ade80", label: "2" },
          { from: "des", to: "beh", color: "#4ade80", label: "3" }
        ]
      }
    ]
  }
});
