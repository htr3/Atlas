window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 58,
  title: "4.7 [New] Traveling Salesman Problem - Dynamic Programming using Formula",
  video: "https://www.youtube.com/watch?v=Q4zHb-Swzro",
  category: "Dynamic Programming",
  tagline: "g(i,S)=min_k C(i,k)+g(k,S−{k}); four cities, g(1,{2,3,4})=35 instead of a 24-leaf tree.",
  summary: "A directed tour must leave city 1, visit 2,3,4 each once, and return. The DP state g(i,S) is the cheapest way from i through exactly the unused set S and back to 1. Recurrence: min over k in S of C(i,k)+g(k,S−{k}). Base: S empty ⇒ C(i,1). Bottom-up by |S|: empty, then one city, then two, then three. The lecture graph's tour costs 35. The recursive tree of the same formula is huge; the table stores each (i,S) once (O(n² 2^n)).",

  theory: [
    {
      heading: "State: where you are, who is left",
      body: "Four vertices, a directed cost matrix (Bari draws two-way edges as one line with two weights). A tour starts at 1, visits every other city once, returns to 1, and the sum of arc costs is minimized. Brute force is (n−1)! directed orders. The DP state is <b>g(i,S)</b>: you currently sit at i, the set S of cities still must be visited, and after S you return to 1. Start state: g(1,{2,3,4}).",
      bullets: [
        "S is a subset of {2..n} (city 1 is the depot, not in S).",
        "i is the current city, not in S.",
        "A tour is a Hamiltonian cycle; missing an arc is ∞ in C."
      ]
    },
    {
      heading: "Recurrence",
      body: "<code>g(i,S) = min_{k∈S} [ C(i,k) + g(k, S−{k}) ]</code>. The decision is the next city k. When S is empty you are done visiting: <code>g(i,∅)=C(i,1)</code>, the return arc. The formula is recursive in |S|. Expanding it as a call tree from g(1,{2,3,4}) forks 3 ways, then 2, then 1 — Bari draws that tree only to show why you should not evaluate it top-down without a table.",
      bullets: [
        "Next hop k ∈ S, then the leftover set is strictly smaller.",
        "Base: empty set means go home, cost C(i,1).",
        "C(i,k) is the given adjacency entry (10,15,20 from 1 in the lecture)."
      ]
    },
    {
      heading: "Table order: increasing |S|",
      body: "Fill empty sets first: g(2,∅)=C(2,1)=5, g(3,∅)=6, g(4,∅)=8. Then |S|=1, using those bases. Lecture values: g(3,{4})=12+8=20, g(4,{3})=9+6=15, g(2,{4})=10+8=18, g(4,{2})=8+5=13, g(2,{3})=9+6=15, g(3,{2})=13+5=18. Then |S|=2: g(2,{3,4})=min(9+20, 10+15)=min(29,25)=<b>25</b>, g(3,{2,4})=min(13+18, 12+13)=min(31,25)=<b>25</b>, g(4,{2,3})=min(8+15, 9+18)=min(23,27)=<b>23</b>.",
      bullets: [
        "Never compute a large S before its subsets.",
        "|S|=0,1,2,3 is the only safe order.",
        "Each (i,S) is stored once and reused by several parents."
      ]
    },
    {
      heading: "Worked g(1,{2,3,4})=35",
      body: "Last layer: min of C(1,2)+g(2,{3,4})=10+25=35, C(1,3)+g(3,{2,4})=15+25=40, C(1,4)+g(4,{2,3})=20+23=43. Minimum <b>35</b>, first hop 1→2. The table replaced a full recursion tree whose last level already had a dozen numbered leaves. That is DP on subset states.",
      bullets: [
        "Tour cost 35, chosen hop from 1 is city 2.",
        "The other two first hops cost 40 and 43.",
        "Parent pointers (the argmin k) reconstruct the cycle if you store them."
      ]
    },
    {
      heading: "Complexity",
      body: "States: n choices of i, 2^{n-1} subsets of the others ⇒ O(n 2^n) states. Each tries |S| ≤ n hops: <b>O(n² 2^n)</b> time, O(n 2^n) space. Hopeless as a brute (n−1)! for n=20, still exponential, but the standard exact TSP DP (Held–Karp). The lecture's \"programming\" means the table, not a C compiler.",
      bullets: [
        "O(n² 2^n) vs (n−1)! — the subset table is the win.",
        "n=4 is 8 subset-states of {2,3,4} times a few i's; the tree looked larger because of overlap.",
        "Negative? TSP costs are usually positive; the formula does not require that."
      ]
    }
  ],

  keyTerms: [
    { term: "g(i,S)", def: "Cheapest continuation from city i through each city in S exactly once, then back to 1." },
    { term: "C(i,k)", def: "Direct arc cost from i to k in the adjacency matrix." },
    { term: "g(i,∅)=C(i,1)", def: "Nothing left to visit: pay the return edge to the depot." },
    { term: "Subset stage", def: "Fill by |S| increasing so every S−{k} is already known." },
    { term: "Held–Karp", def: "This DP: O(n² 2^n) exact TSP." },
    { term: "Tour 35", def: "Optimum of the 4-city lecture instance, first hop 1→2." }
  ],

  tradeoffs: [
    { pro: "Exact tour; 35 is not a heuristic.", con: "O(n² 2^n) still explodes; n=20 is a research-sized DP, not a classroom loop." },
    { pro: "Each (i,S) computed once, unlike the recursive tree Bari expanded.", con: "You must enumerate subsets (bitmasks) — easy to miss a set of size 2." },
    { pro: "Base g(i,∅)=C(i,1) makes the return-to-depot constraint local.", con: "Forgetting the return edge reports a path, not a tour." },
    { pro: "Argmin k reconstructs the cycle.", con: "Cost-only tables cannot name the next city on the exam's \"write the tour\" part." }
  ],

  interviewTips: [
    "Define g(i,S) in one sentence: current city, unused set, end at 1.",
    "Write g(i,S)=min_k C(i,k)+g(k,S−{k}) and g(i,∅)=C(i,1).",
    "Fill empty, |S|=1, |S|=2, then the start state — never the reverse.",
    "Quote this graph: bases 5,6,8; |S|=2 values 25,25,23; g(1,{2,3,4})=35.",
    "Name O(n² 2^n) and Held–Karp if they ask complexity.",
    "The recursive tree is the wrong evaluation order; the table is the algorithm."
  ],

  scene: {
    nodes: [
      { id: "c1", label: "1", type: "point", pos: [-8, 0, 2], color: "#fb923c" },
      { id: "c2", label: "2", type: "point", pos: [-2, 0, 6], color: "#60a5fa" },
      { id: "c3", label: "3", type: "point", pos: [4, 0, 2], color: "#c084fc" },
      { id: "c4", label: "4", type: "point", pos: [-2, 0, -2], color: "#22d3ee" },
      { id: "e2", label: "g(2,∅)=5", type: "cache", pos: [8, 0, 6], color: "#60a5fa", showAt: 2 },
      { id: "e3", label: "g(3,∅)=6", type: "cache", pos: [8, 0, 2], color: "#c084fc", showAt: 2 },
      { id: "e4", label: "g(4,∅)=8", type: "cache", pos: [8, 0, -2], color: "#22d3ee", showAt: 2 },
      { id: "s25", label: "g(2,{3,4})=25", type: "cache", pos: [-8, 0, -6], color: "#60a5fa", showAt: 4 },
      { id: "s34", label: "g(4,{2,3})=23", type: "cache", pos: [-2, 0, -6], color: "#22d3ee", showAt: 4 },
      { id: "s13", label: "g(3,{2,4})=25", type: "cache", pos: [4, 0, -6], color: "#c084fc", showAt: 4 },
      { id: "ans", label: "g(1,{2,3,4})=35", type: "cache", pos: [8, 0, -6], color: "#facc15", showAt: 5 },
      { id: "n0", label: "tour: all once, back to 1", type: "note", pos: [-8, 0, 6] },
      { id: "n1", label: "g(i,S)=min C(i,k)+g(k,S-k)", type: "note", pos: [8, 0, 7.5], showAt: 1 },
      { id: "n2", label: "|S|=0 then 1 then 2", type: "note", pos: [-8, 0, -2], showAt: 3 },
      { id: "n3", label: "10+25 beats 15+25, 20+23", type: "note", pos: [8, 0, 4], showAt: 5 }
    ],
    edges: [
      { from: "c1", to: "c2", label: "10" },
      { from: "c1", to: "c3", label: "15" },
      { from: "c1", to: "c4", label: "20" },
      { from: "c2", to: "c3", label: "9" },
      { from: "c2", to: "c4", label: "10" },
      { from: "c3", to: "c2", label: "13" },
      { from: "c3", to: "c4", label: "12" },
      { from: "c4", to: "c2", label: "8" },
      { from: "c4", to: "c3", label: "9" },
      { from: "c2", to: "c1", label: "5", dashed: true, showAt: 2 },
      { from: "c3", to: "c1", label: "6", dashed: true, showAt: 2 },
      { from: "c4", to: "c1", label: "8", dashed: true, showAt: 2 }
    ],
    steps: [
      {
        title: "Four cities, start at 1",
        text: "Visit 2, 3, and 4 once each and return. Arcs from 1 cost 10, 15, 20. A tour is a cycle, not a path. State = (current city, unused set).",
        highlight: ["c1", "c2", "c3", "c4", "n0"]
      },
      {
        title: "The formula",
        text: "g(i,S) is min over next city k in S of C(i,k)+g(k,S without k). Recursive in the set. Expanding it as a tree from {2,3,4} is what the table will compress.",
        highlight: ["c1", "c2", "c3", "c4", "n1"],
        flows: [
          { from: "c1", to: "c2", color: "#60a5fa", label: "k=2" },
          { from: "c1", to: "c3", color: "#c084fc", label: "k=3" },
          { from: "c1", to: "c4", color: "#22d3ee", label: "k=4" }
        ]
      },
      {
        title: "Base: empty set, go home",
        text: "g(2,∅)=C(2,1)=5, g(3,∅)=6, g(4,∅)=8. Those three numbers are the last level of the recursion tree, computed first in the table.",
        highlight: ["e2", "e3", "e4", "c2", "c3", "c4", "c1"],
        flows: [
          { from: "c2", to: "c1", color: "#60a5fa", label: "5" },
          { from: "c3", to: "c1", color: "#c084fc", label: "6" },
          { from: "c4", to: "c1", color: "#22d3ee", label: "8" }
        ]
      },
      {
        title: "Increase |S|",
        text: "|S|=1 uses the bases (g(3,{4})=20, g(2,{3})=15, …). Then |S|=2. You never ask for a two-city set before its one-city leftovers exist.",
        highlight: ["n2", "e2", "e3", "e4"]
      },
      {
        title: "Two-city leftovers",
        text: "g(2,{3,4})=min(9+20, 10+15)=25. g(3,{2,4})=25. g(4,{2,3})=23. Three subset states, each tried two hops. The recursion tree had six numbered leaves for the same work.",
        highlight: ["s25", "s34", "s13", "c2", "c3", "c4"]
      },
      {
        title: "Start state 35",
        text: "g(1,{2,3,4})=min(10+25, 15+25, 20+23)=min(35,40,43)=35. First hop 1→2. That is the cheapest tour on this matrix.",
        highlight: ["ans", "s25", "c1", "c2", "n3"],
        flows: [
          { from: "c1", to: "c2", color: "#facc15", label: "10+25" }
        ]
      },
      {
        title: "O(n² 2^n), not n!",
        text: "Each (i,S) stored once. Held–Karp. The drawn tree was pedagogical; the algorithm is the subset table filled empty → full. Tour cost 35.",
        highlight: ["ans", "s25", "s34", "s13", "e2", "e3", "e4"]
      }
    ]
  }
});
