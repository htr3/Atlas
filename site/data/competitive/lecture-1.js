window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 1,
  title: "How to start Competitive Programming? ❌ → ✅",
  video: "https://www.youtube.com/watch?v=FbW_5ipDCbg",
  category: "Competitive Programming",
  tagline: "A mind sport: pick a problem, meet the limits, submit, collect AC.",
  summary: "Start by naming why you are here — stronger algorithms, or interview-ready DSA via contests. A programming contest is a loop: read constraints, design, submit to an online judge, and take the verdict. Competitive programming is not required to learn the material, but racing the clock against other people is one of the fastest ways to make it stick.",

  theory: [
    {
      heading: "Name the reason before the first contest",
      body: "The talk opens with a question, not a syllabus: <b>why competitive programming?</b> If you cannot answer, you will bail the first time a judge prints Wrong Answer. Write the reason down. Everything after this — platforms, templates, ratings — is secondary to that commitment.",
      bullets: [
        "The reason is the thing you reopen after a bad contest.",
        "Without it, practice feels like unpaid homework.",
        "With it, a rejected submission is data, not a verdict on you."
      ]
    },
    {
      heading: "Two honest goals",
      body: "Almost every beginner sits in one of two chairs. <b>Chair A:</b> you like algorithms and you want to get better at contests for their own sake — the sport. <b>Chair B:</b> an interview is on the calendar and you need data structures under time pressure; racing other people is the drill you chose. Either chair is enough. Mixing them without noticing (\"I will become red <i>and</i> pass every onsite\") is how people burn out in a month.",
      bullets: [
        "Sport: contests, ratings, harder problems as the reward.",
        "Interview: DSA fluency, speed, and communicating a solution.",
        "Pick one primary scoreboard for the next 8–12 weeks."
      ]
    },
    {
      heading: "A mind sport, with rules",
      body: "Competitive programming is a <b>mind sport</b>. The body does not move; the instruments are algorithms and the way you write code. As in any sport there are prerequisites and there are rules. The better you are at both — the idea <i>and</i> the implementation — the more problems you convert before the timer hits zero. Talent without a clean submit still loses.",
      bullets: [
        "Idea quality and coding practice are the two skills on the field.",
        "Rules (time, memory, I/O format) are part of the problem, not extra.",
        "You train both, the same way a sport trains fitness and technique."
      ]
    },
    {
      heading: "Prerequisites that are already assumed",
      body: "You need to <b>program</b> — loops, arrays, functions, I/O in one language you can type without thinking. You need a little <b>algorithms</b>: what a graph is, what O(n log n) means, how to read a constraint and guess a budget. The lecture treats both as already in motion if you showed up; the remaining work is contest shape, not a CS 101 reboot.",
      bullets: [
        "Language fluency first; switch later if you must.",
        "Big-O is how you talk to the time limit.",
        "You do not need every textbook chapter before contest #1."
      ]
    },
    {
      heading: "Anatomy of a contest",
      body: "A round is a short, repeated loop. You <b>enter</b>. You <b>pick a problem</b> (usually the easiest open one). The statement lists <b>input constraints</b> (n ≤ 10^5, 2 seconds, 256 MB) and <b>input parameters</b> (the arrays, the queries). You owe the <b>specified output</b> — format included, extra spaces included. You invent an algorithm that respects those limits, type it, and send it to the <b>online judge</b>.",
      bullets: [
        "Constraints tell you the complexity class that can pass.",
        "A correct algorithm that is O(n^2) on n = 10^5 is still a fail.",
        "Output format is scored. \"Almost right\" is Wrong Answer."
      ]
    },
    {
      heading: "Accepted, or one of several rejects",
      body: "The judge is a machine, not a TA. <b>Accepted</b> (AC) means every hidden test matched. Otherwise the submission is rejected, and there are several distinct ways to lose: compile error, wrong answer on a test, time limit exceeded, runtime error, memory limit. Points land only on AC. The contest winner is whoever banks the <b>maximum number of successful submissions</b> (ties broken by time or penalty, depending on the platform). That loop — problem, code, verdict, next problem — <i>is</i> competitive programming.",
      bullets: [
        "AC is the only way points appear.",
        "WA / TLE / RE / CE / MLE are different bugs; read the verdict.",
        "Most points, not prettiest code, wins the round."
      ]
    },
    {
      heading: "Not necessary — still one of the fastest drills",
      body: "Is competitive programming required to learn algorithms and data structures? <b>No.</b> You can study from a book, a course, or interview sheets and never open a judge. The claim in the lecture is narrower: among the ways to learn this material, competing against other people is one of the <b>most efficient</b>. The clock, the public scoreboard, and the instant reject compress a week of vague practice into two hours of focused attempts. Try one round. Keep the reason you wrote in step one.",
      bullets: [
        "DSA without contests is a valid path.",
        "Contests add a timer, a judge, and rivals — that is the efficiency.",
        "The first contest is for the loop, not for a rating color."
      ]
    }
  ],

  keyTerms: [
    { term: "Mind sport", def: "A competition scored on algorithms and implementation, not physical performance." },
    { term: "Online judge", def: "Hidden-test machine that compiles your code and returns AC or a reject verdict." },
    { term: "Constraints", def: "Bounds on n, time, and memory that decide which complexity can pass." },
    { term: "Submission", def: "The source file you send; only an Accepted run scores." },
    { term: "Accepted (AC)", def: "Every official test produced the required output in time and memory." },
    { term: "Verdict", def: "Judge label: AC, WA, TLE, RE, CE, MLE — each points at a different failure." },
    { term: "Scoreboard", def: "Ranking by number of solved problems (then penalty time), not by code style." }
  ],

  tradeoffs: [
    { pro: "Contests force you to finish: idea plus working code under a clock.", con: "A bad round feels personal; without a written why, people quit." },
    { pro: "Interview-bound engineers get DSA reps with instant feedback.", con: "Contest tricks (bit hacks, tight constants) are not always what an interviewer wants." },
    { pro: "You can learn the same algorithms from a book, at your own pace.", con: "Self-study lacks a judge and a scoreboard, so gaps stay hidden longer." },
    { pro: "Picking the easiest open problem maximizes AC count.", con: "Always sniping A/B can stall growth if you never attempt a harder C." }
  ],

  interviewTips: [
    "Say your why in one sentence before you name a platform — sport or interview drill.",
    "Read constraints before coding: n and the time limit pick the big-O, not the other way around.",
    "Treat WA, TLE, and RE as different bugs; do not resubmit the same binary hoping for AC.",
    "First contest: aim for the submit-verdict loop on easy problems, not a rating number.",
    "CP is optional for learning DSA; use it when you want a timer and a ruthless checker.",
    "Match output exactly. A trailing space or extra newline is Wrong Answer, not a style note."
  ],

  scene: {
    nodes: [
      { id: "you", label: "You", type: "user", pos: [-10, 0, 0] },
      { id: "gA", label: "Algorithms", type: "service", pos: [-10, 0, 5], showAt: 1 },
      { id: "gB", label: "Interviews", type: "service", pos: [-10, 0, -5], showAt: 1 },
      { id: "prob", label: "Problem", type: "queue", pos: [-3, 0, 0], showAt: 3 },
      { id: "cons", label: "Constraints", type: "note", pos: [-3, 0, 5], showAt: 4 },
      { id: "io", label: "I/O contract", type: "note", pos: [-3, 0, -5], showAt: 4 },
      { id: "code", label: "Your code", type: "worker", pos: [4, 0, 0], showAt: 5 },
      { id: "judge", label: "Online Judge", type: "lb", pos: [10, 0, 0], showAt: 5 },
      { id: "ac", label: "AC + points", type: "cache", pos: [10, 0, 5], showAt: 6, color: "#4ade80" },
      { id: "wa", label: "WA / TLE / RE", type: "server", pos: [10, 0, -5], showAt: 6, color: "#f87171" },
      { id: "board", label: "Scoreboard", type: "db", pos: [4, 0, 5], showAt: 7 },
      { id: "n0", label: "Why are you here?", type: "note", pos: [4, 0, -5] },
      { id: "n1", label: "Mind sport, two skills", type: "note", pos: [0, 0, 5], showAt: 2 },
      { id: "n2", label: "Max AC wins", type: "note", pos: [0, 0, -7], showAt: 7 },
      { id: "n3", label: "Not required, efficient", type: "note", pos: [4, 0, -5], showAt: 7 }
    ],
    edges: [
      { from: "you", to: "gA", label: "sport", showAt: 1, dashed: true },
      { from: "you", to: "gB", label: "job", showAt: 1, dashed: true },
      { from: "you", to: "prob", label: "pick", showAt: 3 },
      { from: "prob", to: "cons", showAt: 4, dashed: true },
      { from: "prob", to: "io", showAt: 4, dashed: true },
      { from: "prob", to: "code", label: "solve", showAt: 5 },
      { from: "code", to: "judge", label: "submit", showAt: 5 },
      { from: "judge", to: "ac", label: "pass", showAt: 6 },
      { from: "judge", to: "wa", label: "reject", showAt: 6 },
      { from: "ac", to: "board", label: "score", showAt: 7 }
    ],
    steps: [
      {
        title: "Ask why first",
        text: "Before a platform or a rating, answer why you want competitive programming. That sentence is what you reread after a contest full of rejects.",
        highlight: ["you", "n0"]
      },
      {
        title: "Two chairs",
        text: "You are here to get better at algorithms and contests because you enjoy the sport, or you have interviews and you want DSA under a clock. Either goal is enough. Name one as primary.",
        highlight: ["you", "gA", "gB"],
        hide: ["n0"],
        flows: [
          { from: "you", to: "gA", color: "#60a5fa", label: "sport" },
          { from: "you", to: "gB", color: "#fb923c", label: "job" }
        ]
      },
      {
        title: "A mind sport",
        text: "The field is algorithms plus coding practice. Prerequisites are: you can program, and you know a little complexity. Rules exist, as in any sport — time, memory, output format.",
        highlight: ["you", "gA", "n1"],
        hide: ["n0"]
      },
      {
        title: "Pick a problem",
        text: "You enter the round and choose a problem. Start with one you can finish. The rest of the loop only starts after a statement is on your screen.",
        highlight: ["you", "prob"],
        hide: ["n0", "n1"],
        flows: [
          { from: "you", to: "prob", color: "#4ade80", label: "choose" }
        ]
      },
      {
        title: "Constraints and I/O",
        text: "The statement gives input limits and the exact output shape. Those bounds pick the algorithm: n = 10^5 will not forgive an O(n^2) scan in one second. Format is scored.",
        highlight: ["prob", "cons", "io"],
        hide: ["n0", "n1"]
      },
      {
        title: "Submit to the judge",
        text: "You write a solution and send the source to the online judge. The machine compiles it and runs hidden tests. You do not get to argue with a TA.",
        highlight: ["code", "judge"],
        hide: ["n0", "n1"],
        flows: [
          { from: "prob", to: "code", color: "#4ade80", label: "idea" },
          { from: "code", to: "judge", color: "#c084fc", label: "src" }
        ]
      },
      {
        title: "AC or a named reject",
        text: "Accepted means every test matched — points. Otherwise the verdict names the failure: wrong answer, time limit, runtime, compile, memory. Different labels, different fixes. Do not blind-resubmit.",
        highlight: ["judge", "ac", "wa"],
        fail: ["wa"],
        hide: ["n0", "n1"],
        flows: [
          { from: "judge", to: "ac", color: "#4ade80", label: "AC" },
          { from: "judge", to: "wa", color: "#f87171", label: "reject" }
        ]
      },
      {
        title: "Most AC wins — and CP is optional",
        text: "The scoreboard ranks successful submissions. That loop is the sport. It is not required to learn DSA, but a clock, a judge, and other humans are an efficient way to practice. Try a round.",
        highlight: ["ac", "board", "n2", "n3"],
        hide: ["n0", "n1"],
        flows: [
          { from: "ac", to: "board", color: "#c084fc", label: "points" }
        ]
      }
    ]
  }
});
