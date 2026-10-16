window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 72,
  title: "8. NP-Hard and NP-Complete Problems",
  video: "https://www.youtube.com/watch?v=e2cF8a5aAhE",
  category: "Branch, Bound & Complexity",
  tagline: "Relate exponential problems through SAT, write non-deterministic poly-time, aim at P=NP.",
  summary: "Polynomial algorithms (search, sort, MST, Dijkstra) sit in P. Exponential ones (0/1 knapsack, TSP, SAT) are the research target: either find a poly algorithm or prove they stand together. Two jobs: write a non-deterministic poly-time algorithm (Choice / Success / Failure, each O(1) by assumption) so the problem is in NP, and reduce SAT to it in poly time so it is NP-hard. NP-complete is the intersection. P ⊆ NP; Cook: SAT is in P if and only if P=NP.",

  theory: [
    {
      heading: "Two columns of running times",
      body: "The lecture splits every algorithm you already know. <b>Polynomial</b>: linear search Θ(n), binary search Θ(log n), bubble Θ(n²), merge sort Θ(n log n), shortest paths, MST, Huffman, optimal merge. <b>Exponential</b>: 0/1 knapsack ~2^n, TSP ~n! or 2^n n², and later SAT ~2^n. Even n^100 is smaller than 2^n for large n, so 'find a poly algorithm for knapsack/TSP' is the research prize. Faster poly algorithms (O(1) search, O(n) sort) are a second prize. Years of work on each exponential problem separately produced nothing, so a <b>framework</b> was built: NP-hard / NP-complete.",
      bullets: [
        "P-style examples: search, sort, Dijkstra, Prim/Kruskal, Huffman.",
        "Exp examples: 0/1 knapsack, TSP; SAT joins them as the base problem.",
        "The framework exists so fruitless solo attempts still leave reusable proofs."
      ]
    },
    {
      heading: "Two research moves",
      body: "Move 1: if you cannot solve an exponential problem, <b>relate</b> it to the others so that a poly algorithm for one becomes a poly algorithm for all. Do not have one student on knapsack and another on coloring with no bridge. Move 2: if you cannot write a deterministic poly algorithm, write a <b>non-deterministic</b> poly algorithm — leave the unknown line blank, keep the rest, so later work can fill the hole. Those two moves are the entire topic. The lecture does non-determinism first, then reductions.",
      bullets: [
        "Relate (reductions) so one poly-time breakthrough unlocks the class.",
        "Preserve partial algorithms as non-deterministic poly-time programs.",
        "SAT is the agreed base problem for the relating step."
      ]
    },
    {
      heading: "Choice, Success, Failure — magic O(1)",
      body: "A deterministic algorithm has no mystery: every statement's effect is known. A non-deterministic algorithm may contain three primitives. <b>Choice(S)</b> returns an index / object from S in one step, with no search logic you can point to. <b>Success</b> and <b>Failure</b> halt. All three are assumed to cost <b>O(1)</b>. Non-deterministic search of an array: j ← Choice(1..n); if A[j]=key then Success else Failure. If the key is 9 at index 4, Choice hands you 4 immediately. That is an O(1) search — faster than binary search — and it is legal only because Choice is magic. Tomorrow, if someone implements Choice in true O(1), the algorithm becomes deterministic and joins P. Until then the work is saved as an NP algorithm.",
      bullets: [
        "Choice / Success / Failure are the only non-deterministic statements in the talk.",
        "They are charged unit time so the rest of the program can be ordinary poly-time.",
        "Failure means 'the key is not present,' not 'the magic failed.'"
      ]
    },
    {
      heading: "P is a subset of NP",
      body: "<b>P</b> = problems with a deterministic polynomial-time algorithm (the left column). <b>NP</b> = problems with a non-deterministic polynomial-time algorithm (Choice allowed). Every deterministic program is a non-deterministic program that never calls Choice, so <b>P ⊆ NP</b>. Merge sort used to be 'unknown' relative to bubble sort; once it was found it moved from the cloud of NP into P. The lecture draws P as a disk inside NP and imagines P growing until, maybe, it fills NP. That possible equality is the open question.",
      bullets: [
        "P: deterministic poly-time. NP: non-deterministic poly-time.",
        "P ⊆ NP because a deterministic algorithm is a special NP algorithm.",
        "We hope P keeps expanding; we do not know if it becomes equal to NP."
      ]
    },
    {
      heading: "SAT as the base, same 0/1 tree as knapsack",
      body: "SAT: a CNF formula, clauses joined by AND, literals inside a clause joined by OR. Example: (x1 ∨ ¬x2 ∨ x3) ∧ (¬x1 ∨ x2 ∨ ¬x3). Each xi is 0/1, so n variables give 2^n assignments — exponential, same club as knapsack. Draw a state-space tree: x1=1 or 0, then x2, then x3. A root-to-leaf path is an assignment. The lecture then erases the labels: that tree is also the include/exclude tree of a 3-object 0/1 knapsack. If you could walk the tree in poly time you would solve both. Relating problems starts with that shared picture; the official tool is a <b>polynomial-time reduction</b>.",
      bullets: [
        "SAT is exponential (2^n assignments) and is the base NP-hard problem.",
        "The same binary tree encodes SAT assignments and 0/1 knapsack vectors.",
        "If that tree is searchable in poly time, both problems fall together."
      ]
    },
    {
      heading: "Reduction, transitivity, NP-complete",
      body: "SAT <b>reduces to</b> problem L (written SAT ≤p L) when you convert any SAT instance into an L-instance in <b>polynomial time</b>, so a poly algorithm for L would solve SAT. Conversion itself must be poly: an exponential converter would be useless. If SAT ≤p 0/1 knapsack, knapsack becomes <b>NP-hard</b>. Reductions are <b>transitive</b>: SAT ≤p L1 and L1 ≤p L2 implies L2 is NP-hard — you do not have to reduce from SAT every time; coloring can reduce from knapsack. SAT already has a non-deterministic poly algorithm, so SAT is also in NP, hence <b>NP-complete</b> = NP-hard ∩ NP. Research checklist on your problem L: (1) show SAT (or any NP-hard problem) reduces to L, (2) write a non-deterministic poly algorithm for L. Then L is NP-complete. Solving L in deterministic poly time would be even better — that is the Cook question.",
      bullets: [
        "SAT ≤p L in poly time ⇒ L is NP-hard.",
        "NP-complete = NP-hard and in NP (has a Choice-style poly verifier/algorithm).",
        "Transitivity: hang new problems off any known NP-hard problem, not only SAT."
      ]
    },
    {
      heading: "Cook: SAT ∈ P iff P = NP",
      body: "The Venn picture now has three pieces: the NP-hard cloud, the NP disk, their lens NP-complete (SAT sits in the lens), and P sitting inside NP, growing. If P ever equals NP, every NP algorithm becomes a deterministic poly algorithm — Choice is no longer magic, it is an implementation. Cook's theorem (as stated here): <b>SAT is in P if and only if P=NP</b>. He did not prove P=NP; he proved that putting SAT into P is necessary and sufficient for the equality. Until someone does that, writing NP-complete proofs is the completed 'framework' research on a new problem. Next lecture: clique as a concrete NP-hard graph problem.",
      bullets: [
        "P grows inside NP; equality is unknown.",
        "SAT ∈ P  ⇔  P = NP (Cook, as taught in this video).",
        "NP-complete work is the fallback when you cannot exhibit a poly algorithm."
      ]
    }
  ],

  keyTerms: [
    { term: "P", def: "Problems with a deterministic polynomial-time algorithm (search, sort, MST, Dijkstra)." },
    { term: "NP", def: "Problems with a non-deterministic polynomial-time algorithm (Choice allowed)." },
    { term: "Choice", def: "O(1) primitive that returns the right index/object with no explained search." },
    { term: "SAT", def: "CNF satisfiability: find 0/1 values that make every clause true; 2^n trials." },
    { term: "Reduction ≤p", def: "Poly-time instance map A→B so a poly algorithm for B solves A." },
    { term: "NP-hard", def: "Problems L such that SAT (or another NP-hard problem) reduces to L." },
    { term: "NP-complete", def: "NP-hard ∩ NP: related to SAT and equipped with a non-det poly algorithm." },
    { term: "Cook's claim", def: "SAT lies in P if and only if P equals NP." },
    { term: "Transitivity", def: "If A ≤p B and B ≤p C then A ≤p C; new NP-hard proofs need not start at SAT." }
  ],

  tradeoffs: [
    { pro: "One SAT reduction plus transitivity certifies a whole family (knapsack, coloring, Hamiltonian).", con: "A reduction that itself takes exponential time proves nothing useful." },
    { pro: "Non-deterministic code saves a partial algorithm so the next author can fill Choice.", con: "Choice is not an implementation; quoting O(1) search as a real algorithm is wrong." },
    { pro: "P ⊆ NP is the clean set picture for exams.", con: "P=NP is open; claiming 'tomorrow we will know' is belief, not a theorem." },
    { pro: "NP-complete is a precise intersection, not a synonym for 'hard'.", con: "Optimization versions (min tour length) are NP-hard but not NP-complete unless rewritten as decisions." }
  ],

  interviewTips: [
    "Draw P inside NP, NP-hard overlapping NP, NP-complete in the lens, SAT in the lens.",
    "Define Choice/Success/Failure as O(1) and give the one-line non-det search.",
    "SAT: CNF, 2^n assignments, same binary tree as 0/1 knapsack.",
    "Reduction: poly-time converter, SAT ≤p L ⇒ L is NP-hard; add a non-det poly alg ⇒ NP-complete.",
    "Transitivity: you may reduce from knapsack or coloring, not only from SAT.",
    "Cook in one sentence: SAT ∈ P iff P=NP. Do not claim the equality is proved."
  ],

  scene: {
    nodes: [
      { id: "zNP", label: "NP", type: "zone", pos: [-1.5, 0, -1], size: [16, 12] },
      { id: "zP", label: "P", type: "zone", pos: [-6, 0, -3], size: [7, 6], showAt: 3, color: "#4ade80" },
      { id: "zH", label: "NP-hard", type: "zone", pos: [5, 0, 1.5], size: [8.5, 8], showAt: 5, color: "#fb923c" },
      { id: "pNode", label: "merge / MST", type: "server", pos: [-6, 0, -3], color: "#4ade80" },
      { id: "sat", label: "SAT", type: "lb", pos: [3.2, 0, 0.2], showAt: 4, color: "#c084fc" },
      { id: "knap", label: "0/1 knapsack", type: "worker", pos: [7.2, 0, 3.4], showAt: 5 },
      { id: "tsp", label: "TSP", type: "worker", pos: [7.2, 0, -1.2], showAt: 5 },
      { id: "choice", label: "Choice(j)", type: "queue", pos: [-9.5, 0, 6.5], showAt: 2 },
      { id: "chk", label: "A[j]==key?", type: "cache", pos: [-4, 0, 6.5], showAt: 2 },
      { id: "ok", label: "Success", type: "worker", pos: [1.5, 0, 6.5], showAt: 2, color: "#4ade80" },
      { id: "no", label: "Failure", type: "worker", pos: [6.5, 0, 6.5], showAt: 2, color: "#f87171" },
      { id: "n0", label: "Poly vs exponential lists", type: "note", pos: [-8, 3, 7.5] },
      { id: "n1", label: "Relate, or write non-det", type: "note", pos: [8, 3, 7.5], showAt: 1 },
      { id: "n2", label: "Choice is O(1) magic", type: "note", pos: [8, 3, -7.5], showAt: 2 },
      { id: "n3", label: "P subset of NP", type: "note", pos: [-8, 3, -7.5], showAt: 3 },
      { id: "n4", label: "Same 0/1 tree as knapsack", type: "note", pos: [-8, 3, 7.5], showAt: 4 },
      { id: "n5", label: "SAT ≤p L in poly time", type: "note", pos: [8, 3, -7.5], showAt: 5 },
      { id: "n6", label: "NPC = NPH ∩ NP; Cook", type: "note", pos: [0, 3, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "choice", to: "chk", label: "O(1)", showAt: 2 },
      { from: "chk", to: "ok", label: "yes", showAt: 2 },
      { from: "chk", to: "no", label: "no", showAt: 2 },
      { from: "sat", to: "knap", label: "≤p", showAt: 5 },
      { from: "sat", to: "tsp", label: "≤p", showAt: 6, dashed: true },
      { from: "knap", to: "tsp", label: "trans.", showAt: 6, dashed: true },
      { from: "pNode", to: "sat", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Polynomial vs exponential",
        text: "Left column: linear/binary search, n log n sort, MST, Dijkstra — deterministic poly-time. Right column: 0/1 knapsack and TSP — exponential. n^100 still loses to 2^n for large n. The research target is a poly algorithm for the right column.",
        highlight: ["pNode", "zNP", "n0"]
      },
      {
        title: "Two moves when you are stuck",
        text: "Either relate the exponential problems so one breakthrough solves all, or write a non-deterministic poly algorithm that leaves the unknown line blank. Those two points are the whole NP-hard / NP-complete framework.",
        highlight: ["n1", "pNode", "zNP"],
        hide: ["n0"]
      },
      {
        title: "Certificate flow: Choice then check",
        text: "Non-det search: Choice returns index j in O(1). Compare A[j] with the key. Hit → Success, miss → Failure (key absent). Binary search is Θ(log n); this sketch is Θ(1) only because Choice is magic. That is an NP algorithm for search, waiting to become P.",
        highlight: ["choice", "chk", "ok", "no", "n2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "choice", to: "chk", color: "#c084fc", label: "j" },
          { from: "chk", to: "ok", color: "#4ade80", label: "hit" },
          { from: "chk", to: "no", color: "#f87171", label: "miss" }
        ]
      },
      {
        title: "Set picture: P inside NP",
        text: "P is deterministic poly-time. NP is non-deterministic poly-time. A program that never calls Choice is already in NP, so P ⊆ NP. Merge sort moved into P once it was discovered. The inner disk can grow.",
        highlight: ["zP", "zNP", "pNode", "n3"],
        hide: ["n0", "n1", "n2", "choice", "chk", "ok", "no"]
      },
      {
        title: "SAT is the base; same tree as knapsack",
        text: "CNF SAT tries 2^n assignments. Its include/exclude tree is identical in shape to a 3-object 0/1 knapsack tree. If that tree is solved in poly time, both problems are. SAT is the agreed starting problem for reductions.",
        highlight: ["sat", "n4", "zNP"],
        hide: ["n0", "n1", "n2", "n3", "choice", "chk", "ok", "no"]
      },
      {
        title: "Poly reduction SAT ≤p L",
        text: "Convert a SAT formula into a knapsack (or TSP) instance in polynomial time. Then a poly algorithm for knapsack would solve SAT. Knapsack becomes NP-hard. Conversion must itself be poly — an exp converter is worthless.",
        highlight: ["sat", "knap", "tsp", "zH", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "choice", "chk", "ok", "no"],
        flows: [
          { from: "sat", to: "knap", color: "#fb923c", label: "≤p" }
        ]
      },
      {
        title: "NP-complete is the intersection",
        text: "SAT is NP-hard and has a non-det poly algorithm, so it sits in NP-hard ∩ NP, called NP-complete. Your problem joins that lens after (1) a reduction from SAT or any NP-hard problem and (2) an NP algorithm. Transitivity lets coloring hang off knapsack instead of SAT.",
        highlight: ["sat", "zH", "zNP", "knap", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "choice", "chk", "ok", "no"],
        flows: [
          { from: "sat", to: "knap", color: "#fb923c", label: "NPH" },
          { from: "knap", to: "tsp", color: "#fb923c", label: "trans." }
        ]
      },
      {
        title: "Cook: SAT in P iff P=NP",
        text: "P may grow until it fills NP. If that happens, Choice becomes an ordinary poly routine. Cook's teaching in this video: SAT ∈ P ⇔ P=NP. Nobody proved the equality. Next: clique as a graph NP-hard problem.",
        highlight: ["zP", "zNP", "zH", "sat", "pNode", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "choice", "chk", "ok", "no"],
        flows: [
          { from: "pNode", to: "sat", color: "#4ade80", label: "if SAT∈P" }
        ]
      }
    ]
  }
});
