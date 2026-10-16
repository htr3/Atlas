window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 41,
  title: "3.2 Job Sequencing with Deadlines - Greedy Method",
  video: "https://www.youtube.com/watch?v=zPtI8q9gvX8",
  category: "Greedy Algorithms",
  tagline: "Sort jobs by profit, park each in the latest free slot at or before its deadline.",
  summary: "Each job needs one hour on one machine and pays only if it finishes by its deadline. Five jobs already ordered by profit 20,15,10,5,1 with deadlines 2,2,1,3,3 give three slots. Place J1 in 1–2, J2 in 0–1, reject J3, place J4 in 2–3; profit 40. A second instance with max deadline 4 fills four slots for 110. Greedy is latest-feasible-slot, not \"do the richest job first in time.\"",

  theory: [
    {
      heading: "One machine, unit jobs, hard deadlines",
      body: "Five jobs arrive when the shop opens. Job i pays profit P<sub>i</sub> only if it is finished by deadline D<sub>i</sub>. Each job needs <b>one unit</b> of machine time (one hour). The typist picture: people in line at 9:00; some will wait until 10, 11, or 12, none later. Slots are therefore <code>[0,1), [1,2), …, [t−1, t)</code> where t = max D<sub>i</sub>. You cannot run two jobs in one slot. Constraint: assigned slot + 1 ≤ deadline. Objective: maximize total profit of the assigned set. Maximization plus a deadline constraint is the greedy setup.",
      bullets: [
        "First table (already profit-sorted): P = [20, 15, 10, 5, 1], D = [2, 2, 1, 3, 3].",
        "Max deadline 3 ⇒ at most three jobs, three slots (9–10, 10–11, 11–12).",
        "A job may run earlier than its deadline; it may not run later."
      ]
    },
    {
      heading: "Greedy-choice logic: profit order, latest slot",
      body: "Selection order is <b>decreasing profit</b> (the array is already sorted). For the next job, walk slots from its deadline backward and park it in the <b>latest empty slot</b> that still meets D<sub>i</sub>. If every such slot is taken, reject the job. Parking late leaves early hours free for jobs that cannot wait — that is the choice property. Doing the richest job at time 0 would steal the only hour J3 could have used, for no gain on J1 (J1 can wait until 2).",
      bullets: [
        "Sort by P (or assume sorted, as on the board).",
        "For job i, try slots D<sub>i</sub>, D<sub>i</sub>−1, …, 1; take the first free one.",
        "Reject when that scan finds nothing; never bump an already placed job."
      ]
    },
    {
      heading: "Worked example: slots 0–1, 1–2, 2–3",
      body: "J1 (20, d=2) takes slot 1–2. J2 (15, d=2) finds 1–2 full, takes 0–1. J3 (10, d=1) needs 0–1, already taken, <b>rejected</b>. J4 (5, d=3) takes 2–3. J5 (d=3) has no free slot at or before 3. Sequence in time: J2 then J1 then J4 (or J1 then J2 then J4 — both of the first two can wait until hour 2). Profit 20+15+5 = <b>40</b>. Table form: after J1 the set is {J1} profit 20; after J2 {J1,J2} profit 35; J3 no change; after J4 {J1,J2,J4} profit 40.",
      bullets: [
        "Time order is slot order, not profit order.",
        "J3 is feasible in isolation and still rejected: the richer d=2 jobs claimed hour 1.",
        "Two legal sequences share the same set and the same 40."
      ]
    },
    {
      heading: "Second board: seven jobs, four slots, profit 110",
      body: "Max deadline 4 opens slots 0–1, 1–2, 2–3, 3–4. J1 (35, d=3) → 2–3. J2 (30, d=4) → 3–4. J3 (25, d=4) finds 3–4 taken, slides earlier into 1–2. J4 (20, d=2) finds 1–2 taken, slides into 0–1. J5–J7 see a full machine and stop. Sum 35+30+25+20 = <b>110</b>. Same rule: latest free slot ≤ deadline. When every slot is occupied you do not even scan the leftover jobs.",
      bullets: [
        "t = max deadline = number of usable slots (if every hour has demand).",
        "A d=4 job may legally sit in hour 2; \"wait until 4\" is a ceiling, not a reservation.",
        "Limited slots + extra jobs ⇒ pick the profit-heaviest feasible set."
      ]
    },
    {
      heading: "Proof intuition and complexity",
      body: "Latest-slot is the exchange: if a high-profit job is sitting early while a later hour it could have used is empty, slide it right and you free an early hour for a tighter deadline without losing its profit. Sorting by profit then filling that way never displaces a richer job. Time: sort <b>O(n log n)</b>, then for each of n jobs scan up to t slots, so <b>O(n t)</b> or O(n²) when t ≤ n. A disjoint-set of free slots (the course's later union structure) drops the inner scan toward almost O(n log n). Space is the slot array of length t.",
      bullets: [
        "Proof idea: a richer job never yields its slot to a poorer one; it only slides later.",
        "Naive: O(n log n + n t). Heap/union-find: near O(n log n).",
        "Output the set, a legal sequence, and the profit — exams want all three."
      ]
    }
  ],

  keyTerms: [
    { term: "Deadline D<sub>i</sub>", def: "Job i must finish by time D<sub>i</sub>; it may start earlier." },
    { term: "Unit-time job", def: "Every job occupies exactly one slot on the single machine." },
    { term: "Slot", def: "Hour [k−1, k) for k = 1..max D. First example: three slots up to 12:00." },
    { term: "Latest feasible slot", def: "Rightmost empty hour ≤ D<sub>i</sub>; the greedy placement for job i." },
    { term: "Rejection", def: "No free slot ≤ D<sub>i</sub> remains; the job's profit is lost." },
    { term: "Sequence vs set", def: "The set {J1,J2,J4} is unique here; J1↔J2 order in the first two hours is not." },
    { term: "Max deadline t", def: "Upper bound on how many jobs you can run; here t=3 then t=4." }
  ],

  tradeoffs: [
    { pro: "Profit sort plus latest slot is optimal for unit jobs on one machine.", con: "Variable job lengths break the slot array; that is a different problem." },
    { pro: "Latest slot keeps early hours for tight deadlines (J3-style jobs).", con: "Placing J1 at time 0 looks natural and can block those tight jobs for no reason." },
    { pro: "O(n²) slot scans are exam-friendly on n ≤ 20.", con: "Large t needs union-find or you blow the time bound." },
    { pro: "Two sequences can share one optimal profit (40 or 110).", con: "Writing only one sequence is fine; claiming it is the unique timetable is not." }
  ],

  interviewTips: [
    "State: one machine, unit time, profit only if finish ≤ deadline, maximize profit.",
    "Draw the slot row first (0–1, 1–2, 2–3) from max D, then fill from richest job.",
    "For each job write \"try D, D−1, … until free or reject\" — that sentence is the algorithm.",
    "First paper: J1→1–2, J2→0–1, J3 reject, J4→2–3, profit 40; mention J2-J1-J4 or J1-J2-J4.",
    "Second paper: four slots, 35+30+25+20=110, leftover jobs unexamined once full.",
    "If they ask complexity, give O(n log n + n t) and the disjoint-set improvement."
  ],

  scene: {
    nodes: [
      { id: "s1", label: "Slot 0-1", type: "zone", pos: [-6, 0, 3], size: [5.5, 3] },
      { id: "s2", label: "Slot 1-2", type: "zone", pos: [0, 0, 3], size: [5.5, 3] },
      { id: "s3", label: "Slot 2-3", type: "zone", pos: [6, 0, 3], size: [5.5, 3] },
      { id: "j1", label: "J1 p20 d2", type: "server", pos: [-8, 0, -3], color: "#4ade80" },
      { id: "j2", label: "J2 p15 d2", type: "server", pos: [-4, 0, -3], color: "#22d3ee" },
      { id: "j3", label: "J3 p10 d1", type: "server", pos: [0, 0, -3], color: "#f87171" },
      { id: "j4", label: "J4 p5 d3", type: "server", pos: [4, 0, -3], color: "#fb923c" },
      { id: "j5", label: "J5 p1 d3", type: "server", pos: [8, 0, -3], color: "#94a3b8" },
      { id: "shop", label: "9:00 shop", type: "user", pos: [-10, 0, 0] },
      { id: "n0", label: "Max D=3 ⇒ 3 slots", type: "note", pos: [-8, 3, 7] },
      { id: "n1", label: "Sort by profit already", type: "note", pos: [8, 3, 7], showAt: 1 },
      { id: "n2", label: "J1 in latest d=2", type: "note", pos: [-8, 3, -7], showAt: 2 },
      { id: "n3", label: "J3 rejected, 0-1 taken", type: "note", pos: [8, 3, -7], showAt: 4 },
      { id: "n4", label: "Set {J2,J1,J4} P=40", type: "note", pos: [0, 3, -7], showAt: 5 }
    ],
    edges: [
      { from: "j1", to: "s2", showAt: 2 },
      { from: "j2", to: "s1", showAt: 3 },
      { from: "j4", to: "s3", showAt: 5 },
      { from: "shop", to: "s1" }
    ],
    steps: [
      {
        title: "Five people at 9:00",
        text: "Unit-hour jobs, profits 20,15,10,5,1, deadlines 2,2,1,3,3. Nobody waits past hour 3, so the machine has exactly three deadline slots.",
        highlight: ["shop", "j1", "j2", "j3", "j4", "j5", "s1", "s2", "s3", "n0"]
      },
      {
        title: "Greedy key is profit, not arrival",
        text: "The board is already in decreasing profit. You will consider J1, then J2, then J3… independent of who shouted first. Slots stay empty until assigned.",
        highlight: ["j1", "j2", "j3", "j4", "j5", "n1"]
      },
      {
        title: "J1 parks in 1–2",
        text: "J1 can finish by 2. Latest feasible empty slot is 1–2 (10:00–11:00). Leave 0–1 free for someone who cannot wait that long.",
        highlight: ["j1", "s2", "n2"],
        hide: ["n0"],
        flows: [{ from: "j1", to: "s2", color: "#4ade80", label: "d=2 latest" }]
      },
      {
        title: "J2 slides to 0–1",
        text: "J2 also has d=2, but 1–2 is taken. The scan walks left and finds 0–1 empty. Profit so far 20+15=35. Two slots full.",
        highlight: ["j2", "s1", "s2", "j1"],
        hide: ["n0"],
        flows: [{ from: "j2", to: "s1", color: "#22d3ee", label: "d=2, 1-2 full" }]
      },
      {
        title: "J3 has no slot",
        text: "J3's deadline is 1, so only 0–1 is legal. That hour already holds J2. Reject J3. Feasible in isolation, infeasible after richer d=2 jobs.",
        highlight: ["j3", "s1", "n3"],
        fail: ["j3"],
        hide: ["n0", "n1"]
      },
      {
        title: "J4 takes 2–3; J5 idle",
        text: "J4 (d=3) finds 2–3 free. J5 also wants ≤3 and sees a full row. Sequence J2–J1–J4 (or J1–J2–J4). Profit 40.",
        highlight: ["j4", "s3", "j5", "n4", "j1", "j2"],
        fail: ["j3", "j5"],
        hide: ["n0", "n1"],
        flows: [{ from: "j4", to: "s3", color: "#fb923c", label: "d=3" }]
      },
      {
        title: "Why latest, not earliest",
        text: "If J1 had sat in 0–1, J2 could still take 1–2, but a future d=1 job would be dead for no reason. Latest-slot is the exchange that keeps tight hours available.",
        highlight: ["s1", "s2", "j1", "j2", "n2"],
        fail: ["j3"],
        hide: ["n0"]
      },
      {
        title: "Same rule, four slots, 110",
        text: "Second instance: t=4. Place 35 in 2–3, 30 in 3–4, 25 earlier into 1–2, 20 into 0–1. Remaining jobs skipped because every deadline slot is taken.",
        highlight: ["s1", "s2", "s3", "n4"],
        fail: ["j3", "j5"],
        hide: ["n0", "n1", "n2"]
      }
    ]
  }
});
