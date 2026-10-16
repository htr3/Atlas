window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 45,
  title: "3.6 Dijkstra Algorithm - Single Source Shortest Path - Greedy Method",
  video: "https://www.youtube.com/watch?v=XB4MIexjvY0",
  category: "Greedy Algorithms",
  tagline: "Settle the closest vertex, relax its edges; Θ(n²), and negatives can break it.",
  summary: "Single-source shortest paths: from a chosen vertex, a distance to every other vertex (direct or via others). Dijkstra repeatedly settles the unsettled vertex of smallest tentative distance and relaxes its neighbors: if d[u]+w(u,v) < d[v], set d[v]. On the six-vertex board the settled distances are 0,2,3,8,6,9. Worst case Θ(n²). A directed textbook run leaves vertex 6 at ∞. With a −10 edge the greedy lock on vertex 2 reports 3 instead of −3; Bellman-Ford is the DP repair.",

  theory: [
    {
      heading: "Single source, greedy stages",
      body: "A weighted graph (directed or not) and a source s. Compute d[v] = shortest-path distance from s to v, possibly via other vertices. Missing edges start at ∞. This is a minimization / optimization problem, so the greedy skeleton applies: one vertex per stage, never reconsider a settled vertex. Undirected edges may be drawn as two opposite directed edges of equal weight if that helps. Source in the main board is vertex <b>1</b>.",
      bullets: [
        "One source, distances to all others — not all-pairs (that is Floyd later).",
        "A path may be indirect; the 1–2–3 triangle is the first picture of that.",
        "Works on directed and undirected graphs as taught; fails as a guarantee when a negative edge is present."
      ]
    },
    {
      heading: "Greedy-choice logic: settle min d, then relax",
      body: "Initialize d[s]=0 and d[v]=w(s,v) or ∞. Repeat: pick the <b>unsettled vertex u of smallest d[u]</b> and freeze it. Then <b>relax</b> every edge u→v: if d[u] + w(u,v) < d[v], replace d[v]. Tiny graph: 1—2 (weight 2), 2—3 (weight 4). Settle 2 at 2, relax 3 from ∞ to 6. The freeze is the greedy choice: among remaining vertices, the closest one already has its true distance if all weights are non-negative, so you will not find a cheaper route later through an unsettled node.",
      bullets: [
        "Selection rule: min tentative distance among unsettled vertices.",
        "Relaxation test: d[u]+w(u,v) < d[v] ⇒ d[v] ← d[u]+w(u,v).",
        "Settled vertices are never relaxed again in this lecture’s procedure."
      ]
    },
    {
      heading: "Worked example: settled distances 2,3,8,6,9",
      body: "Source 1. Direct labels: d[1]=0, d[2]=2, d[3]=4, d[4]=d[5]=d[6]=∞. Settle 2 (d=2): relax 3 via edge weight 1 → 3; relax 4 via 7 → 9. Settle 3 (d=3): relax 5 via 3 → 6. Settle 5 (d=6): relax 4 via 2 → 8 (beats 9); relax 6 via 5 → 11. Settle 4 (d=8): relax 6 via 1 → 9 (beats 11). Last, 6 at 9. Final: v2=2, v3=3, v4=8, v5=6, v6=9. Directed textbook table: start 50,45,10,∞,∞; settle 4 then 5 (10+15=25, then 25+20=45 beats 50); vertex 6 stays ∞ — no incoming path.",
      bullets: [
        "Main undirected run freezes in order 2, 3, 5, 4, 6 with those finals.",
        "Relaxation may fire several times on one vertex (4 went ∞→9→8; 6 went ∞→11→9).",
        "∞ at the end means unreachable, not a bug (vertex 6 in the directed table)."
      ]
    },
    {
      heading: "Proof intuition and the negative-edge failure",
      body: "Non-negative weights: any path that leaves the settled set must pay at least as much as d[u] on its first hop out, so a later detour cannot undercut the current min. That is why freezing u is safe. Negatives break the inequality. Board: 1→2=3, 1→4=5, 4→3=2, 3→2=−10. Dijkstra locks 2 at 3, never reopens it, and misses 1-4-3-2 = −3. Even 3→2=−2 still happened to luck out; −10 does not. Greedy \"took the obvious closest vertex\" and that greed is the bug. Bellman-Ford (next unit, DP) relaxes every edge |V|−1 times and allows negatives without negative cycles.",
      bullets: [
        "Safety of freeze ⇔ w ≥ 0.",
        "Counterexample path cost −3 vs Dijkstra’s 3 on vertex 2.",
        "Do not \"just check settled vertices again\" inside Dijkstra — that is a different algorithm."
      ]
    },
    {
      heading: "Complexity",
      body: "n vertices. Each stage settles one vertex (n of them) and may scan every other vertex to relax or to find the min d — complete-graph worst case <b>n × n</b>, so <b>Θ(n²)</b> / Θ(V²) as written on the board. Sparse graphs with a heap of unsettled distances drop toward O(E log V), which this lecture does not require. Space is the d[] array plus a settled set. Output all d[v], and ∞ where needed. Greedy method chapter ends here; DP opens with Bellman-Ford for the negative case.",
      bullets: [
        "Taught bound: Θ(n²) = Θ(V²) on dense graphs.",
        "Heap Dijkstra is optional extra, not the video’s grade line.",
        "List every distance, including ∞, on the answer sheet."
      ]
    }
  ],

  keyTerms: [
    { term: "Single-source shortest path", def: "Distances from one s to every vertex, via any simple path." },
    { term: "Tentative distance d[v]", def: "Best s-to-v length found so far; starts at w(s,v) or ∞." },
    { term: "Settle / freeze", def: "Declare d[u] final and never pick u again (the greedy lock)." },
    { term: "Relaxation", def: "If d[u]+w(u,v) < d[v] then d[v] ← d[u]+w(u,v)." },
    { term: "Settled distances", def: "On the six-vertex graph: 0,2,3,8,6,9 for vertices 1–6." },
    { term: "Unreachable", def: "d[v] still ∞ after every vertex is processed (directed vertex 6)." },
    { term: "Negative-edge failure", def: "A freeze can stick at 3 when a later −10 path is −3; use Bellman-Ford." }
  ],

  tradeoffs: [
    { pro: "Θ(n²) Dijkstra is simple and optimal on non-negative dense graphs.", con: "The freeze is wrong the moment a negative edge can improve a settled vertex." },
    { pro: "Works unchanged on undirected graphs (treat as two arcs).", con: "A missing incoming arc leaves ∞ — that is a correct \"no path,\" not a license to invent an edge." },
    { pro: "Greedy closest-vertex matches the chapter’s stage method.", con: "Trying all paths would have found −3; greed skipped that search and lost." },
    { pro: "Bellman-Ford handles negatives (next, DP) at O(VE).", con: "It is slower on the non-negative instances Dijkstra already solves." }
  ],

  interviewTips: [
    "Write the relax test d[u]+w(u,v)<d[v] before you touch the six-vertex numbers.",
    "Initialize from source 1: 0,2,4,∞,∞,∞ then freeze 2,3,5,4,6 with finals 2,3,8,6,9.",
    "Show at least one vertex that relaxed twice (4: 9 then 8, or 6: 11 then 9).",
    "Quote Θ(n²) / Θ(V²) as the course complexity.",
    "Directed run: 6 stays ∞ because nothing points at it — say \"unreachable.\"",
    "Negative counterexample: lock 2 at 3, true path 5+2+(−10)=−3; name Bellman-Ford as the fix."
  ],

  scene: {
    nodes: [
      { id: "v1", label: "1 s", type: "lb", pos: [-10, 0, 0] },
      { id: "v2", label: "2", type: "server", pos: [-4, 0, -4] },
      { id: "v3", label: "3", type: "server", pos: [-4, 0, 4] },
      { id: "v4", label: "4", type: "server", pos: [4, 0, -4] },
      { id: "v5", label: "5", type: "server", pos: [4, 0, 4] },
      { id: "v6", label: "6", type: "server", pos: [10, 0, 0] },
      { id: "d1", label: "d=0", type: "note", pos: [-10, 3, 2.2] },
      { id: "d2i", label: "d=2", type: "note", pos: [-4, 3, -6.2] },
      { id: "d3i", label: "d=4", type: "note", pos: [-4, 3, 6.2] },
      { id: "d3r", label: "d=3 settled", type: "note", pos: [-4, 3, 6.2], showAt: 1 },
      { id: "d4i", label: "d=∞", type: "note", pos: [4, 3, -6.2] },
      { id: "d4a", label: "d=9", type: "note", pos: [4, 3, -6.2], showAt: 1 },
      { id: "d4b", label: "d=8 settled", type: "note", pos: [4, 3, -6.2], showAt: 3 },
      { id: "d5i", label: "d=∞", type: "note", pos: [4, 3, 6.2] },
      { id: "d5r", label: "d=6 settled", type: "note", pos: [4, 3, 6.2], showAt: 2 },
      { id: "d6i", label: "d=∞", type: "note", pos: [10, 3, 2.2] },
      { id: "d6a", label: "d=11", type: "note", pos: [10, 3, 2.2], showAt: 3 },
      { id: "d6b", label: "d=9 settled", type: "note", pos: [10, 3, 2.2], showAt: 4 },
      { id: "n0", label: "Source 1, others ∞/w", type: "note", pos: [-8, 3, 7.6] },
      { id: "n1", label: "Relax: d[u]+w < d[v]", type: "note", pos: [8, 3, 7.6], showAt: 1 },
      { id: "n2", label: "Settled 2,3,8,6,9", type: "note", pos: [0, 3, -7.6], showAt: 5 },
      { id: "neg", label: "−10 breaks freeze", type: "note", pos: [8, 3, -7.6], showAt: 7 }
    ],
    edges: [
      { from: "v1", to: "v2", label: "2" },
      { from: "v1", to: "v3", label: "4" },
      { from: "v2", to: "v3", label: "1" },
      { from: "v2", to: "v4", label: "7" },
      { from: "v3", to: "v5", label: "3" },
      { from: "v5", to: "v4", label: "2" },
      { from: "v5", to: "v6", label: "5" },
      { from: "v4", to: "v6", label: "1" }
    ],
    steps: [
      {
        title: "Initialize from source 1",
        text: "d[1]=0, d[2]=2, d[3]=4, all others ∞. Direct edges only. Shortest paths may still go via someone else; that is why the loop exists.",
        highlight: ["v1", "v2", "v3", "v4", "v5", "v6", "d1", "d2i", "d3i", "d4i", "d5i", "d6i", "n0"]
      },
      {
        title: "Settle 2 (d=2), relax 3 and 4",
        text: "Closest unsettled is 2. Relax: 2+1=3 < 4 so d[3] becomes 3; 2+7=9 < ∞ so d[4] becomes 9. That test is relaxation.",
        highlight: ["v2", "v3", "v4", "d2i", "d3r", "d4a", "n1"],
        hide: ["d3i", "d4i", "n0"],
        flows: [
          { from: "v2", to: "v3", color: "#4ade80", label: "2+1=3" },
          { from: "v2", to: "v4", color: "#4ade80", label: "2+7=9" }
        ]
      },
      {
        title: "Settle 3 (d=3), open vertex 5",
        text: "Among 3,9,∞,∞ the min is 3. Freeze 3. Only useful neighbor is 5: 3+3=6 < ∞. Order so far: settled {1,2,3}.",
        highlight: ["v3", "v5", "d3r", "d5r"],
        hide: ["d3i", "d5i", "d4i", "n0"],
        flows: [{ from: "v3", to: "v5", color: "#22d3ee", label: "3+3=6" }]
      },
      {
        title: "Settle 5 (d=6), improve 4 and 6",
        text: "Min of 9,6,∞ is 6. Relax 4: 6+2=8 < 9. Relax 6: 6+5=11 < ∞. Vertex 4 is not settled yet, so 8 is allowed to replace 9.",
        highlight: ["v5", "v4", "v6", "d5r", "d4b", "d6a"],
        hide: ["d4i", "d4a", "d5i", "d6i", "d3i", "n0"],
        flows: [
          { from: "v5", to: "v4", color: "#fb923c", label: "6+2=8" },
          { from: "v5", to: "v6", color: "#fb923c", label: "6+5=11" }
        ]
      },
      {
        title: "Settle 4 (d=8), shave 6 to 9",
        text: "8 beats 11. Freeze 4. Relax 6: 8+1=9 < 11. Two improvements on v6 (∞→11→9) are the working of relaxation, not a restart of Dijkstra.",
        highlight: ["v4", "v6", "d4b", "d6b"],
        hide: ["d3i", "d5i", "d4i", "d4a", "d6i", "d6a", "n0"],
        flows: [{ from: "v4", to: "v6", color: "#4ade80", label: "8+1=9" }]
      },
      {
        title: "Last vertex 6 at 9",
        text: "Only 6 remains; freeze d=9. Settled distances from 1: 2,3,8,6,9. Every vertex was chosen by min tentative d. Dense-graph bill Θ(n²).",
        highlight: ["v6", "d6b", "n2", "v1", "v2", "v3", "v4", "v5"],
        hide: ["d6i", "d6a", "d4i", "d4a", "d3i", "d5i", "n0"]
      },
      {
        title: "Directed 6 stays ∞",
        text: "Textbook directed table: start 50,45,10,∞,∞. After settling 4 then 5, vertex 2 drops 50→45. Vertex 6 never gains an incoming path, so ∞ is the correct shortest-path answer: unreachable.",
        highlight: ["v6", "d6i", "n2", "v1"],
        hide: ["d3i", "d4i", "d4a", "d4b", "d5i", "d6a", "d6b", "n0", "n1"]
      },
      {
        title: "Greedy freeze vs a −10 edge",
        text: "If 3→2 has weight −10, the true 1-4-3-2 length is −3, but Dijkstra already froze 2 at 3 and will not reopen it. Non-negative weights were the hidden assumption. Bellman-Ford (DP) is the next algorithm.",
        highlight: ["v2", "neg", "n2", "v1"],
        fail: ["v2"],
        hide: ["d3i", "d4i", "d4a", "d4b", "d5i", "d6i", "d6a", "d6b", "n0", "n1"]
      }
    ]
  }
});
