window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 73,
  title: "8.1 NP-Hard Graph Problem - Clique Decision Problem",
  video: "https://www.youtube.com/watch?v=qZs767KQcvE",
  category: "Branch, Bound & Complexity",
  tagline: "Clique-of-size-k is NP-complete: poly certificate plus SAT ≤p Clique.",
  summary: "A clique is a complete subgraph: every pair of vertices shares an edge. The decision question Clique(G,k) asks whether G has a clique of size k. It is in NP because a list of k vertices is a certificate you verify in O(k²) edge checks. It is NP-hard because CNF-SAT reduces to it: one vertex per literal occurrence, edges between compatible literals in different clauses; a clique of size (#clauses) exists iff the formula is satisfiable. Therefore Clique is NP-complete. The optimization 'largest clique' is NP-hard (not a decision, so not NP-complete).",

  theory: [
    {
      heading: "Clique = complete subgraph",
      body: "In an undirected graph, a <b>clique</b> is a subset S of vertices such that every pair in S is joined by an edge — a complete subgraph K_|S|. A single vertex is a clique of size 1; an edge is a clique of size 2; a triangle is a clique of size 3. The picture in exams is usually a graph that has several triangles and one larger blob. Size means |S|, not the number of edges. A graph can have many overlapping cliques; we care whether one of them reaches a given k.",
      bullets: [
        "Clique: every pair connected, not merely 'a dense group.'",
        "K3 is a triangle; Kk needs k(k−1)/2 edges inside S.",
        "Independent set is the opposite picture (no edges inside S) and reduces to clique on the complement graph."
      ]
    },
    {
      heading: "Decision versus optimization",
      body: "Two official problems. <b>Clique decision</b>: given G=(V,E) and integer k, does G contain a clique of size k? Answer yes or no. <b>Clique optimization</b>: what is the size of a largest clique? NP-complete is defined for decision problems (yes/no, so they can sit in NP with a certificate). The optimization version is NP-hard: a poly algorithm for the size would decide every k by comparison, so it is at least as hard as the decision. On a paper, write the decision when you are asked to prove NP-complete.",
      bullets: [
        "Decision: Clique(G,k) ∈ {yes, no}.",
        "Optimization: ω(G) = max clique size — NP-hard, not NP-complete as stated.",
        "Binary search on k plus a decision oracle would solve the optimization if the decision were in P."
      ]
    },
    {
      heading: "In NP: a k-vertex certificate",
      body: "To place Clique in NP you need a non-deterministic poly algorithm, or equivalently a poly-time verifier. Guess (Choice) a set S of k vertices. Then, for every pair in S, check that the edge exists — at most k(k−1)/2 lookups, which is polynomial in the size of G. If every pair is present, Success (yes); else Failure. That is the same Choice → check → Success/Failure flow as the SAT lecture's search. The certificate is the list of vertices, not a picture of the whole graph.",
      bullets: [
        "Certificate: k vertex ids.",
        "Verifier: O(k²) edge tests, polynomial.",
        "Choice supplies S in O(1) in the non-det model; a real machine would still verify in poly time."
      ]
    },
    {
      heading: "SAT ≤p Clique: one vertex per literal occurrence",
      body: "Take a CNF formula with m clauses. For each occurrence of a literal in a clause, make a graph vertex labelled (clause, literal). Put an edge between two vertices when (1) they come from <b>different clauses</b> and (2) the literals are <b>not complements</b> (x and ¬x cannot both be true). No edges inside a clause: a clique can take at most one vertex per clause. A clique of size m then picks one literal from every clause, and those literals are jointly consistent, which is exactly a satisfying assignment. The graph has size linear in the formula, so the construction is polynomial.",
      bullets: [
        "Vertex set: one node per literal occurrence, not per variable.",
        "Edge: different clauses AND not a complementary pair.",
        "Ask Clique(G, m) with m = number of clauses."
      ]
    },
    {
      heading: "Worked 3-clause formula",
      body: "φ = (x1 ∨ x2) ∧ (¬x1 ∨ x2) ∧ (x1 ∨ ¬x2). Six vertices: C1x1, C1x2, C2¬x1, C2x2, C3x1, C3¬x2. C1x1 connects to C2x2 and C3x1 (not to C2¬x1, complements). C1x2 connects to C2¬x1, C2x2, C3x1 (not to C3¬x2). One 3-clique is {C1x1, C2x2, C3x1}: assignment x1=1, x2=1. Every clause is true. If φ were unsatisfiable the compatibility graph would have no clique of size 3. That is the yes↔yes proof: SAT yes iff Clique(G,3) yes.",
      bullets: [
        "m=3 clauses ⇒ ask for a clique of size 3.",
        "{C1x1, C2x2, C3x1} is a triangle and encodes x1=x2=true.",
        "A complementary pair is never joined, so a clique cannot set x and ¬x together."
      ]
    },
    {
      heading: "NP-complete, and why graphs are the next chapter",
      body: "Clique decision is in NP (certificate) and NP-hard (SAT ≤p Clique), therefore <b>NP-complete</b>. The same pattern proves vertex cover, independent set, Hamiltonian cycle: show a poly certificate, then hang a reduction off SAT or off an already NP-complete graph problem (transitivity from the previous lecture). Clique optimization stays outside NP-complete because it does not return yes/no. Exam close: draw the six vertices, draw one compatibility edge that is missing (x1 vs ¬x1), circle the 3-clique, and write 'poly construction, poly verifier.'",
      bullets: [
        "NP-complete = in NP + NP-hard via SAT ≤p Clique.",
        "Reuse transitivity: Independent Set ≤p Clique via complement edges.",
        "Decision vs optimization is the first sentence if the question says 'show NP-complete.'"
      ]
    }
  ],

  keyTerms: [
    { term: "Clique", def: "Vertex set in which every pair is adjacent; a complete subgraph." },
    { term: "Clique decision", def: "Given G and k, does a clique of size k exist? Yes/no." },
    { term: "Certificate", def: "The k vertices; verified by checking all pairs have edges in O(k²)." },
    { term: "Literal-occurrence vertex", def: "A graph node (Ci, ℓ) created from one appearance of literal ℓ in clause Ci." },
    { term: "Compatibility edge", def: "Edge between occurrence-vertices from different clauses whose literals are not complements." },
    { term: "SAT ≤p Clique", def: "Build that graph in poly time; Clique(G,m) yes iff the CNF with m clauses is satisfiable." },
    { term: "NP-complete", def: "Clique decision is in NP and NP-hard, hence in the NP-hard ∩ NP lens." },
    { term: "Clique optimization", def: "Find ω(G); NP-hard, not NP-complete as an optimization problem." }
  ],

  tradeoffs: [
    { pro: "The SAT construction is local (per occurrence) and obviously polynomial.", con: "The compatibility graph can have Θ(L²) edges for L occurrences — fine for theory, fat for a drawing." },
    { pro: "A k-list is a tiny certificate; verification is the easiest NP argument in the course.", con: "People skip the 'different clauses' rule and accidentally allow two literals from one clause, which breaks the iff." },
    { pro: "The same graph, complement edges, gives Independent Set in one line (transitivity).", con: "Optimization 'max clique' is not NP-complete until you restate it as a decision." },
    { pro: "A 6-vertex example is drawable in an exam booklet.", con: "Real SAT formulas produce huge graphs; the reduction is a proof, not a solver." }
  ],

  interviewTips: [
    "Define clique as 'every pair adjacent,' then state Clique(G,k) as a yes/no problem.",
    "NP: guess k vertices, check O(k²) edges. That is the certificate flow.",
    "NP-hard: SAT ≤p Clique via one vertex per literal occurrence and compatibility edges.",
    "Ask for a clique of size m = number of clauses, not number of variables.",
    "Walk {C1x1, C2x2, C3x1} on (x1∨x2)∧(¬x1∨x2)∧(x1∨¬x2) to show x1=x2=1.",
    "Say optimization is NP-hard only; NP-complete is reserved for the decision."
  ],

  scene: {
    nodes: [
      { id: "zG", label: "G: occurrence graph", type: "zone", pos: [-1.5, 0, -1.2], size: [18, 12] },
      { id: "a1", label: "C1 x1", type: "server", pos: [-8, 0, -5], color: "#60a5fa" },
      { id: "a2", label: "C1 x2", type: "server", pos: [-2, 0, -5], color: "#60a5fa" },
      { id: "b1", label: "C2 ~x1", type: "server", pos: [-8, 0, -0.5], color: "#fb923c" },
      { id: "b2", label: "C2 x2", type: "server", pos: [-2, 0, -0.5], color: "#fb923c" },
      { id: "c1", label: "C3 x1", type: "server", pos: [-8, 0, 4], color: "#4ade80" },
      { id: "c2", label: "C3 ~x2", type: "server", pos: [-2, 0, 4], color: "#4ade80" },
      { id: "cert", label: "cert: 3 ids", type: "queue", pos: [8, 0, -5], showAt: 2 },
      { id: "ver", label: "check O(k^2) edges", type: "cache", pos: [8, 0, -0.5], showAt: 2 },
      { id: "yes", label: "yes: Clique", type: "worker", pos: [8, 0, 4], showAt: 2, color: "#4ade80" },
      { id: "satN", label: "SAT formula", type: "lb", pos: [8, 0, -5], showAt: 4, color: "#c084fc" },
      { id: "red", label: "poly map", type: "gateway", pos: [8, 0, -0.5], showAt: 4 },
      { id: "ask", label: "Clique(G,3)", type: "db", pos: [8, 0, 4], showAt: 4 },
      { id: "n0", label: "Clique = every pair edged", type: "note", pos: [-8, 3, 7.5] },
      { id: "n1", label: "Decision Clique(G,k)", type: "note", pos: [8, 3, 7.5], showAt: 1 },
      { id: "n2", label: "Certificate then verify", type: "note", pos: [8, 3, -7.5], showAt: 2 },
      { id: "n3", label: "No edge x1 — ~x1", type: "note", pos: [-8, 3, -7.5], showAt: 3 },
      { id: "n4", label: "SAT ≤p Clique, poly build", type: "note", pos: [8, 3, 7.5], showAt: 4 },
      { id: "n5", label: "Triangle => x1=x2=1", type: "note", pos: [-8, 3, 7.5], showAt: 5 },
      { id: "n6", label: "NPC = NP + SAT reduction", type: "note", pos: [8, 3, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "a1", to: "a2", dashed: true },
      { from: "b1", to: "b2", dashed: true },
      { from: "c1", to: "c2", dashed: true },
      { from: "a1", to: "b2", showAt: 3 },
      { from: "a1", to: "c1", showAt: 3 },
      { from: "a2", to: "b1", showAt: 3 },
      { from: "a2", to: "b2", showAt: 3 },
      { from: "a2", to: "c1", showAt: 3 },
      { from: "b2", to: "c1", showAt: 3 },
      { from: "b1", to: "c1", showAt: 3 },
      { from: "b1", to: "c2", showAt: 3 },
      { from: "cert", to: "ver", showAt: 2 },
      { from: "ver", to: "yes", showAt: 2 },
      { from: "satN", to: "red", showAt: 4, label: "≤p" },
      { from: "red", to: "ask", showAt: 4 }
    ],
    steps: [
      {
        title: "Clique means a complete subset",
        text: "Six vertices will become literal occurrences. For now read each row as a clause. A clique is not 'a cluster': every pair inside the set must have an edge. Size-1 and size-2 cliques are trivial; we will hunt size 3.",
        highlight: ["a1", "a2", "b1", "b2", "c1", "c2", "zG", "n0"]
      },
      {
        title: "Ask a yes/no question",
        text: "Clique decision: does G have a clique of size k? Optimization (largest clique) is a different problem and is not NP-complete as stated. Exams want the decision when they say NP-complete.",
        highlight: ["zG", "n1", "a1", "b2", "c1"],
        hide: ["n0"]
      },
      {
        title: "Certificate flow",
        text: "Choice hands three vertex ids. The verifier looks up every pair in O(k²). All edges present → Success (yes). Missing edge → Failure. That poly verifier puts Clique in NP. Same Choice/check pattern as non-det search.",
        highlight: ["cert", "ver", "yes", "n2", "a1", "b2", "c1"],
        hide: ["n0", "n1"],
        flows: [
          { from: "cert", to: "ver", color: "#c084fc", label: "S" },
          { from: "ver", to: "yes", color: "#4ade80", label: "O(k^2)" }
        ]
      },
      {
        title: "Compatibility edges; complements stay apart",
        text: "Connect occurrences from different clauses unless they are x and ¬x. C1x1 does not touch C2¬x1. Intra-clause pairs stay dashed (at most one literal per clause in a clique). The graph is the SAT instance.",
        highlight: ["a1", "b1", "b2", "c1", "n3", "zG"],
        fail: ["b1"],
        hide: ["n0", "n1", "n2", "cert", "ver", "yes"],
        flows: [
          { from: "a1", to: "b2", color: "#60a5fa", label: "ok" },
          { from: "a1", to: "b1", color: "#f87171", label: "x vs ~x" }
        ]
      },
      {
        title: "Reduction flow SAT → Clique(G,3)",
        text: "m=3 clauses. Build G in polynomial time (linear vertices, pairwise edges). Ask Clique(G,3). Yes iff φ is satisfiable. That poly map is SAT ≤p Clique, so Clique is NP-hard.",
        highlight: ["satN", "red", "ask", "n4", "zG"],
        hide: ["n0", "n1", "n2", "n3", "cert", "ver", "yes"],
        flows: [
          { from: "satN", to: "red", color: "#fb923c", label: "build G" },
          { from: "red", to: "ask", color: "#fb923c", label: "k=m=3" }
        ]
      },
      {
        title: "A 3-clique is an assignment",
        text: "{C1x1, C2x2, C3x1} is a triangle: different clauses, no complements. Read off x1=true, x2=true. Each clause of (x1∨x2)∧(¬x1∨x2)∧(x1∨¬x2) is satisfied. Unsatisfiable φ would have no K3.",
        highlight: ["a1", "b2", "c1", "n5", "ask"],
        hide: ["n0", "n1", "n2", "n3", "n4", "cert", "ver", "yes", "satN", "red"],
        flows: [
          { from: "a1", to: "b2", color: "#4ade80", label: "x1" },
          { from: "b2", to: "c1", color: "#4ade80", label: "x2" },
          { from: "c1", to: "a1", color: "#4ade80", label: "x1" }
        ]
      },
      {
        title: "NP-complete in one Venn sentence",
        text: "In NP (certificate) and NP-hard (SAT reduces here) ⇒ Clique decision is NP-complete, the lens of the previous lecture. Independent set is one complement-graph away (transitivity). Max-clique size stays NP-hard only.",
        highlight: ["ask", "satN", "n6", "a1", "b2", "c1"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "cert", "ver", "red", "yes"]
      },
      {
        title: "What to draw in the booklet",
        text: "Six occurrence vertices, missing edge on every complementary pair, one circled K3, arrows SAT → G → Clique(G,m), and the O(k²) verifier. That is the whole NP-complete proof the lecture is aiming at.",
        highlight: ["a1", "a2", "b1", "b2", "c1", "c2", "satN", "ask", "n6"],
        fail: ["b1", "c2"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "cert", "ver", "red", "yes"],
        flows: [
          { from: "satN", to: "ask", color: "#c084fc", label: "≤p" }
        ]
      }
    ]
  }
});
