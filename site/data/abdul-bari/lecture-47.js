window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 47,
  title: "4.1 MultiStage Graph - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=9iE9Mj4m8jk",
  category: "Dynamic Programming",
  tagline: "Backward costs, forward decisions: source-to-sink 16 along 1-2-7-10-12 or 1-3-6-10-12.",
  summary: "A multistage graph is directed and layered: edges only go stage i to i+1, with a single source and sink. Cost(i,j) is the cheapest way from vertex j in stage i to the sink. Fill from the sink backward: Cost(i,j)=min over edges j→ℓ of c(j,ℓ)+Cost(i+1,ℓ), and store the argmin in D. Then walk D forward from vertex 1. Overlapping values (vertex 10 used by 6, 7, and 8) are why a table beats enumerating paths.",

  theory: [
    {
      heading: "State: stage and vertex",
      body: "Vertices sit in stages. Edges run only to the next stage — never sideways, never backward. Stage 1 is the source, the last stage is a single sink. The lecture's graph has 12 vertices in 5 stages. The job is a <b>minimum-cost source-to-sink path</b> (resource-allocation shape). The DP <b>state</b> is the pair (stage i, vertex j): \"cheapest continuation from j to the sink.\"",
      bullets: [
        "Directed, weighted, layered; source and sink are unique.",
        "Decision at a stage: which outgoing neighbor to take.",
        "State (i,j) does not remember how you arrived at j."
      ]
    },
    {
      heading: "Recurrence (forward method, filled backward)",
      body: "Sink cost is 0. For every earlier vertex j in stage i, look at each edge j→ℓ into stage i+1: <code>Cost(i,j) = min_ℓ [ c(j,ℓ) + Cost(i+1,ℓ) ]</code>. D(i,j) stores the ℓ that won. You compute from the last stage toward the source because an earlier cell needs later cells. Decisions, though, are read from the source toward the sink — that is why textbooks still call it the <b>forward method</b>.",
      bullets: [
        "c(j,ℓ) is the edge weight; Cost(i+1,ℓ) is already in the table.",
        "D is the policy: the neighbor on an optimal continuation.",
        "Fill order: stage 5, then 4, then 3, then 2, then 1."
      ]
    },
    {
      heading: "Worked costs on stages 4 and 3",
      body: "Vertex 12: cost 0. Stage 4 is a single edge to the sink: 9 costs 4, 10 costs 2, 11 costs 5. Vertex 6 (stage 3) has 6→9 (weight 6+4=10) and 6→10 (5+2=7); min is <b>7 via 10</b>. Vertex 7: 7→9 is 4+4=8, 7→10 is 3+2=5; min <b>5 via 10</b>. Vertex 8: 8→10 is 5+2=7, 8→11 is 6+5=11; min <b>7 via 10</b>. Cost(10) is reused by 6, 7, and 8 — overlapping subproblems.",
      bullets: [
        "Stage 4: (9,4), (10,2), (11,5).",
        "Stage 3: 6→7 via 10, 7→5 via 10, 8→7 via 10.",
        "One stored Cost(10) feeds three parents."
      ]
    },
    {
      heading: "Stage 2 and the source",
      body: "Vertex 2 has three exits: 2→6 (4+7=11), 2→7 (2+5=7), 2→8 (1+7=8). Min <b>7 via 7</b>. Vertex 4 has only 4→8: 11+7=<b>18 via 8</b>. Vertex 5: 5→7 is 11+5=16, 5→8 is 8+7=15; min <b>15 via 8</b>. Vertex 3 costs 9 via 6. Source 1 compares 1→2 (9+7=16), 1→3 (7+9=16), 1→4 (3+18=21), 1→5 (2+15=17). Optimum <b>16</b>, from either vertex 2 or 3.",
      bullets: [
        "Stage 2: 2 costs 7, 4 costs 18, 5 costs 15, 3 costs 9.",
        "Source: four candidates, two of them tie at 16.",
        "Ties are both optimal; pick either D value."
      ]
    },
    {
      heading: "Forward walk and complexity",
      body: "Read D from vertex 1. If D(1,1)=2: 1→2→7→10→12. If D(1,1)=3: 1→3→6→10→12. Same cost 16. Time is proportional to vertices plus outgoing edges — linear in the DAG size, far below listing every source-sink path. Space is one cost and one successor per vertex.",
      bullets: [
        "Table first, then a sequence of decisions — that is DP, not greedy.",
        "Two optimal routes can share a suffix (here, 10→12).",
        "Exam phrase: forward method, backward fill."
      ]
    }
  ],

  keyTerms: [
    { term: "Multistage graph", def: "Directed layered graph; edges only from stage i to i+1; one source, one sink." },
    { term: "Cost(i,j)", def: "Cheapest path from vertex j in stage i to the sink." },
    { term: "D(i,j)", def: "Neighbor of j on some cheapest continuation; the decision table." },
    { term: "Forward method", def: "Decisions are applied source→sink even though costs were computed sink→source." },
    { term: "Overlapping subproblems", def: "Cost(10) is an ingredient of vertices 6, 7, and 8 — compute it once." },
    { term: "c(j,ℓ)", def: "Weight of the edge from j to ℓ; added to the already-filled next-stage cost." }
  ],

  tradeoffs: [
    { pro: "Layered structure makes the recurrence a single min over outgoing edges.", con: "A general DAG needs a topological DP; this formula assumes stages." },
    { pro: "O(V+E) table versus enumerating every source-sink route.", con: "You still store a cost and a successor at every vertex." },
    { pro: "Ties (16 via 2 or 3) are both correct; D can keep either.", con: "Forgetting to record D leaves you the cost but not the path." },
    { pro: "Backward fill is the natural dependency order.", con: "Calling it \"forward\" on the exam is easy to reverse — name both directions." }
  ],

  interviewTips: [
    "Define stages and the (i,j) state before writing a formula.",
    "Write Cost(i,j)=min_ℓ c(j,ℓ)+Cost(i+1,ℓ) and say the sink is 0.",
    "Fill last stage first; walk D from the source — \"forward method, backward fill.\"",
    "Quote the worked optimum 16 and the two paths 1-2-7-10-12 and 1-3-6-10-12.",
    "Point at Cost(10) reused by 6, 7, 8 as overlapping subproblems.",
    "If they ask greedy: a locally cheapest edge from 1 (weight 2 to vertex 5) is not globally cheapest (17, not 16)."
  ],

  scene: {
    nodes: [
      { id: "v1", label: "1", type: "point", pos: [-11, 0, 0], color: "#fb923c" },
      { id: "v2", label: "2", type: "point", pos: [-6.5, 0, 4], color: "#60a5fa" },
      { id: "v3", label: "3", type: "point", pos: [-6.5, 0, 1.3], color: "#60a5fa" },
      { id: "v4", label: "4", type: "point", pos: [-6.5, 0, -1.3], color: "#60a5fa" },
      { id: "v5", label: "5", type: "point", pos: [-6.5, 0, -4], color: "#60a5fa" },
      { id: "v6", label: "6", type: "point", pos: [-1.5, 0, 3.2], color: "#c084fc" },
      { id: "v7", label: "7", type: "point", pos: [-1.5, 0, 0], color: "#c084fc" },
      { id: "v8", label: "8", type: "point", pos: [-1.5, 0, -3.2], color: "#c084fc" },
      { id: "v9", label: "9", type: "point", pos: [4, 0, 3.2], color: "#22d3ee" },
      { id: "v10", label: "10", type: "point", pos: [4, 0, 0], color: "#4ade80" },
      { id: "v11", label: "11", type: "point", pos: [4, 0, -3.2], color: "#22d3ee" },
      { id: "v12", label: "12", type: "point", pos: [9.5, 0, 0], color: "#fb923c" },
      { id: "n0", label: "5 stages, edges i→i+1", type: "note", pos: [0, 0, 7] },
      { id: "n1", label: "sink Cost=0", type: "note", pos: [9.5, 0, 3.5], showAt: 1 },
      { id: "n2", label: "9:4  10:2  11:5", type: "note", pos: [9.5, 0, -5], showAt: 2 },
      { id: "n3", label: "6,7,8 all via 10", type: "note", pos: [-1.5, 0, 7], showAt: 3 },
      { id: "n4", label: "2 costs 7 via 7", type: "note", pos: [-6.5, 0, 7], showAt: 4 },
      { id: "n5", label: "source min=16", type: "note", pos: [-11, 0, 4], showAt: 5 },
      { id: "n6", label: "1-2-7-10-12", type: "note", pos: [0, 0, -7], showAt: 6 },
      { id: "n7", label: "1-3-6-10-12 also 16", type: "note", pos: [0, 0, -7], showAt: 7 }
    ],
    edges: [
      { from: "v1", to: "v2", label: "9" },
      { from: "v1", to: "v3", label: "7" },
      { from: "v1", to: "v4", label: "3" },
      { from: "v1", to: "v5", label: "2" },
      { from: "v2", to: "v6", label: "4" },
      { from: "v2", to: "v7", label: "2" },
      { from: "v2", to: "v8", label: "1" },
      { from: "v3", to: "v6" },
      { from: "v4", to: "v8", label: "11" },
      { from: "v5", to: "v7", label: "11" },
      { from: "v5", to: "v8", label: "8" },
      { from: "v6", to: "v9", label: "6" },
      { from: "v6", to: "v10", label: "5" },
      { from: "v7", to: "v9", label: "4" },
      { from: "v7", to: "v10", label: "3" },
      { from: "v8", to: "v10", label: "5" },
      { from: "v8", to: "v11", label: "6" },
      { from: "v9", to: "v12", label: "4" },
      { from: "v10", to: "v12", label: "2" },
      { from: "v11", to: "v12", label: "5" }
    ],
    steps: [
      {
        title: "Layers, not a soup",
        text: "Twelve vertices in five stages. Edges only jump one stage. Source 1 on the left, sink 12 on the right. A path is a sequence of four decisions.",
        highlight: ["v1", "v12", "n0", "v2", "v7", "v10"]
      },
      {
        title: "Sink costs 0",
        text: "State at 12 needs no continuation. Cost(5,12)=0. Every earlier cost will add an edge into this known 0 (or into a vertex that already knows how to reach it).",
        highlight: ["v12", "n1"]
      },
      {
        title: "Stage 4 is one hop",
        text: "9→12 costs 4, 10→12 costs 2, 11→12 costs 5. Those three numbers seed the table. Fill order is right-to-left because Cost(i) reads Cost(i+1).",
        highlight: ["v9", "v10", "v11", "v12", "n2"],
        flows: [
          { from: "v10", to: "v12", color: "#4ade80", label: "2" }
        ]
      },
      {
        title: "Stage 3 reuses 10",
        text: "6 takes min(6+4, 5+2)=7 via 10. 7 takes min(4+4, 3+2)=5 via 10. 8 takes min(5+2, 6+5)=7 via 10. One stored Cost(10)=2, three parents — overlapping subproblems.",
        highlight: ["v6", "v7", "v8", "v10", "n3"],
        flows: [
          { from: "v6", to: "v10", color: "#c084fc", label: "7" },
          { from: "v7", to: "v10", color: "#c084fc", label: "5" },
          { from: "v8", to: "v10", color: "#c084fc", label: "7" }
        ]
      },
      {
        title: "Stage 2 mins",
        text: "Vertex 2: min(4+7, 2+5, 1+7)=7 via 7. Vertex 4: 11+7=18 via 8. Vertex 5: min(11+5, 8+7)=15 via 8. Vertex 3 costs 9 via 6.",
        highlight: ["v2", "v3", "v4", "v5", "v7", "n4"],
        flows: [
          { from: "v2", to: "v7", color: "#60a5fa", label: "7" }
        ]
      },
      {
        title: "Source compares four",
        text: "1→2: 9+7=16. 1→3: 7+9=16. 1→4: 3+18=21. 1→5: 2+15=17. Greedy cheapest edge (weight 2) is not the optimum. DP keeps 16.",
        highlight: ["v1", "v2", "v3", "v4", "v5", "n5"],
        flows: [
          { from: "v1", to: "v2", color: "#4ade80", label: "16" },
          { from: "v1", to: "v3", color: "#4ade80", label: "16" },
          { from: "v1", to: "v5", color: "#f87171", label: "17" }
        ]
      },
      {
        title: "Walk D: 1-2-7-10-12",
        text: "Forward decisions: D(1)=2, D(2)=7, D(7)=10, D(10)=12. Cost 16. The table was filled backward; the path is read forward.",
        highlight: ["v1", "v2", "v7", "v10", "v12", "n6"],
        flows: [
          { from: "v1", to: "v2", color: "#4ade80", label: "go" },
          { from: "v2", to: "v7", color: "#4ade80" },
          { from: "v7", to: "v10", color: "#4ade80" },
          { from: "v10", to: "v12", color: "#4ade80" }
        ]
      },
      {
        title: "Tie path 1-3-6-10-12",
        text: "The other D(1)=3 walks 1→3→6→10→12, also 16. Two optimal routes share the 10→12 suffix. Report 16 and either path.",
        hide: ["n6"],
        highlight: ["v1", "v3", "v6", "v10", "v12", "n7"],
        flows: [
          { from: "v1", to: "v3", color: "#c084fc", label: "tie" },
          { from: "v3", to: "v6", color: "#c084fc" },
          { from: "v6", to: "v10", color: "#c084fc" },
          { from: "v10", to: "v12", color: "#c084fc" }
        ]
      }
    ]
  }
});
