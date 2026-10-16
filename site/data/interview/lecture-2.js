window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 2,
  title: "Interview Question: Start of Loop in a Linked List",
  video: "https://www.youtube.com/watch?v=-YiQZi3mLq0",
  category: "Interview Prep",
  tagline: "Hare x2 and tortoise x1 meet in a cycle; then walk D to the loop entrance.",
  summary: "Floyd's two-speed pointers detect a cycle when they land on one node — impossible on a straight list. The lecture then solves the harder ask: name the first node of the loop. After they meet, D + K is a multiple of the cycle length C, so a pointer from the head and a pointer from the meeting point, each stepping once, collide at the entrance.",

  theory: [
    {
      heading: "Two speeds on the same list",
      body: "Start both pointers at node <b>0</b>. Each iteration the <b>hare</b> jumps two nodes and the <b>tortoise</b> jumps one. They share the list; they do not share a speed. On a straight acyclic list the hare pulls away and eventually hits null. On a list with a cycle the hare laps inside the loop until both references equal the same node — in the lecture's walk, that collision is <b>node 4</b>.",
      bullets: [
        "Hare: +2 per tick. Tortoise: +1 per tick.",
        "Both begin at the head (node 0).",
        "Same node under both pointers is the cycle signal."
      ]
    },
    {
      heading: "Four ticks to a meeting",
      body: "The video traces a concrete chain that funnels into a loop. Tick 1: tortoise sits on the first successor, hare on the second. Tick 2: tortoise has reached where the hare just was; the hare is already inside the cycle. Tick 3: they sit on different loop nodes. Tick 4: tortoise arrives at node 4; the hare's double-step lands on node 4 too. Different speeds cannot share an address on a line. Sharing one is therefore a loop.",
      bullets: [
        "Tick 1: T at 1, H at 2.",
        "Tick 2–3: hare circulating, tortoise still entering.",
        "Tick 4: both at node 4 — report a loop."
      ]
    },
    {
      heading: "Null is the no-loop answer",
      body: "If the hare ever reaches the end of the list — a null next pointer on a two-step — there is no cycle. You do not wait for the tortoise. The algorithm is then: loop while hare and hare.next exist; advance; if the two pointers are equal, return 'loop'; if the hare falls off, return 'no loop'. Detection is O(n) time and O(1) extra memory.",
      bullets: [
        "Hare hits null → acyclic.",
        "Hare == tortoise → cyclic.",
        "No hash set of visited addresses is required."
      ]
    },
    {
      heading: "Why they must meet: D, K, C",
      body: "Let <b>D</b> be the stem from the head to the first loop node, <b>K</b> the distance from that entrance to the meeting node, and <b>C</b> the cycle length. After n tortoise steps, n = D + K + I·C for some integer I (full extra laps). The hare has taken 2n steps: 2n = D + K + J·C. Subtract: <b>n = C·(J − I)</b>. n is a multiple of the cycle length, so there exist integers that make the two positions coincide. The hypothesis 'they meet if a loop exists' is consistent, not a lucky diagram.",
      bullets: [
        "Stem D, offset K into the loop, period C.",
        "Tortoise: D + K + I C. Hare: D + K + J C.",
        "Difference n is a multiple of C, so a meeting exists."
      ]
    },
    {
      heading: "The interview half: where does the loop start?",
      body: "Detection is the warm-up. The question that stalled the speaker in a Morgan Stanley interview is: <i>return the entrance node</i>. Substitute n from the tortoise equation into the hare equation and rearrange: <b>D + K = (J − 2I)·C</b>. The stem plus the meeting offset is a whole number of laps. Walk D+K from the head and you sit on the meeting node. Walk D+K from the meeting node and you also sit there, because you spent whole cycles and landed on the same address.",
      bullets: [
        "D + K is a multiple of C.",
        "Head + (D+K) = meeting node.",
        "Meeting + (D+K) = meeting node (full laps)."
      ]
    },
    {
      heading: "Walk only D, not D+K",
      body: "The entrance is D steps from the head, not D+K. From the meeting node, D steps equals 'a multiple of C, then short by K'. You fall K nodes short of the meeting point — which is exactly the entrance (the lecture's picture: if K were 2 you stop two nodes before the meeting, i.e. at the start of the loop). So park P1 at the head and P2 at the meeting node. Advance both by one each tick. Their first collision is the start of the loop, and it is the shortest time they can collide — they have each walked D.",
      bullets: [
        "Head walks D and arrives at the entrance.",
        "Meeting-point walker laps, then undershoots the meeting by K — also the entrance.",
        "P1 and P2, one step at a time, meet at the first cycle node."
      ]
    },
    {
      heading: "Recipe you can code",
      body: "Phase 1: hare ×2, tortoise ×1 from the head, stop on equality or null. Phase 2: move one pointer back to the head; leave the other on the meeting node; walk both at speed one. Equality is the answer. You never compute D, K, or C as integers — the second walk materializes D. Extra space stays O(1). The algebra is the reason the second walk works; the code is two short loops.",
      bullets: [
        "Detect, then reset one pointer to head.",
        "Equal speeds from head and meeting point.",
        "No need to store the cycle length explicitly."
      ]
    }
  ],

  keyTerms: [
    { term: "Hare", def: "Fast pointer: two nodes per iteration." },
    { term: "Tortoise", def: "Slow pointer: one node per iteration. Starts at the same head as the hare." },
    { term: "Meeting node", def: "First address both pointers occupy; in the lecture trace, node 4." },
    { term: "D (stem)", def: "Node count from the head to the first node that belongs to the cycle." },
    { term: "K (offset)", def: "Node count from the cycle entrance to the meeting node." },
    { term: "C (cycle)", def: "Length of the loop. n tortoise steps is a multiple of C at the meeting." },
    { term: "Entrance", def: "The unique node with one inbound stem edge and one inbound cycle edge. Found by the second walk of D steps." },
    { term: "Floyd phase 2", def: "Head pointer and meeting pointer, both speed 1, collide at the entrance." }
  ],

  tradeoffs: [
    { pro: "O(1) extra memory; no visited set of node identities.", con: "The meeting node is not the entrance — stopping at phase 1 fails the harder prompt." },
    { pro: "Algebra (D+K multiple of C) explains why the reset walk is correct.", con: "Easy to memorize the ritual and freeze when asked why, as in the Morgan Stanley story." },
    { pro: "Null check on the hare cleanly reports 'no loop'.", con: "Careless two-step can skip a null and crash; always test hare.next before the jump." },
    { pro: "Works for a cycle that starts at the head (D = 0): they meet, then the second walk meets immediately at the head.", con: "Tiny lists (0 or 1 node) need the same null guards as the long case." }
  ],

  interviewTips: [
    "Detect first (equal pointers vs hare hits null), then ask whether they also want the entrance.",
    "Draw D, K, and C on the loop; write n = D+K+I C and 2n = D+K+J C before the reset trick.",
    "The key sentence: after the meet, walking D from head and D from the meeting point both land on the entrance because D+K is a multiple of C.",
    "Do not claim the meeting node is the start — the lecture's node 4 is inside the cycle.",
    "Mention the Morgan Stanley stall: algebra to D+K is not enough; you must drop K and walk D.",
    "Code the hare's next-next with two null tests so an acyclic tail does not throw."
  ],

  scene: {
    nodes: [
      { id: "n0", label: "0 head", type: "point", pos: [-10, 0, 0], color: "#4ade80" },
      { id: "n1", label: "1", type: "point", pos: [-7, 0, 0], color: "#4ade80" },
      { id: "n2", label: "2", type: "point", pos: [-4, 0, 0], color: "#60a5fa" },
      { id: "n3", label: "3 start", type: "point", pos: [-1, 0, 0], color: "#fb923c" },
      { id: "n4", label: "4 meet", type: "point", pos: [3, 0, -3.5], color: "#f87171" },
      { id: "n5", label: "5", type: "point", pos: [7, 0, 0], color: "#c084fc" },
      { id: "n6", label: "6", type: "point", pos: [3, 0, 3.5], color: "#c084fc" },
      { id: "tor", label: "Tortoise +1", type: "server", pos: [-10, 0, -5] },
      { id: "hare", label: "Hare +2", type: "server", pos: [-7, 0, -5] },
      { id: "p1", label: "P1", type: "worker", pos: [-10, 0, 5], showAt: 6 },
      { id: "p2", label: "P2", type: "worker", pos: [3, 0, -6.5], showAt: 6 },
      { id: "nt0", label: "Both start at 0", type: "note", pos: [-8, 3, 7] },
      { id: "nt1", label: "T@1 H@2", type: "note", pos: [0, 3, 7], showAt: 1 },
      { id: "nt2", label: "Hare enters loop", type: "note", pos: [8, 3, 7], showAt: 2 },
      { id: "nt3", label: "Meet at node 4", type: "note", pos: [8, 3, -7], showAt: 3 },
      { id: "nt4", label: "Hare at null: no loop", type: "note", pos: [-4, 3, -7], showAt: 4 },
      { id: "nt5", label: "n=D+K+IC  2n=D+K+JC", type: "note", pos: [0, 3, -7], showAt: 5 },
      { id: "nt6", label: "Walk D: meet at 3", type: "note", pos: [8, 3, 4], showAt: 6 }
    ],
    edges: [
      { from: "n0", to: "n1", label: "next" },
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
      { from: "n4", to: "n5" },
      { from: "n5", to: "n6" },
      { from: "n6", to: "n3", label: "cycle" },
      { from: "tor", to: "n0", dashed: true },
      { from: "hare", to: "n0", dashed: true }
    ],
    steps: [
      {
        title: "Head, hare, tortoise",
        text: "A linked list with a stem into a cycle. Both pointers sit on node 0. Each tick the tortoise will move one node and the hare two.",
        highlight: ["n0", "tor", "hare", "nt0"],
        hide: ["nt1", "nt2", "nt3", "nt4", "nt5", "nt6"],
        flows: [
          { from: "tor", to: "n0", color: "#4ade80", label: "T" },
          { from: "hare", to: "n0", color: "#fb923c", label: "H" }
        ]
      },
      {
        title: "Tick 1",
        text: "Tortoise lands on node 1. Hare jumps two and lands on node 2. Still on the stem; no collision.",
        highlight: ["n1", "n2", "tor", "hare", "nt1"],
        hide: ["nt0", "nt2", "nt3", "nt4", "nt5", "nt6"],
        flows: [
          { from: "n0", to: "n1", color: "#4ade80", label: "T +1" },
          { from: "n0", to: "n2", color: "#fb923c", label: "H +2" }
        ]
      },
      {
        title: "Hare inside the loop",
        text: "Tick 2 puts the tortoise where the hare just was, while the hare has already crossed the entrance at node 3 and is circulating. Tick 3 keeps them on different cycle nodes. Speeds still disagree, so they have not met.",
        highlight: ["n3", "n4", "n5", "n6", "hare", "nt2"],
        hide: ["nt0", "nt1", "nt3", "nt4", "nt5", "nt6"],
        flows: [
          { from: "n2", to: "n3", color: "#4ade80", label: "T" },
          { from: "n3", to: "n5", color: "#fb923c", label: "H lap" }
        ]
      },
      {
        title: "Collision at node 4",
        text: "Tick 4: tortoise steps onto node 4 and the hare's double-step lands on node 4. Two speeds sharing one address is impossible on a line — report a loop. Node 4 is a meeting point, not yet proven to be the entrance.",
        highlight: ["n4", "tor", "hare", "nt3"],
        hide: ["nt0", "nt1", "nt2", "nt4", "nt5", "nt6"],
        flows: [
          { from: "n3", to: "n4", color: "#4ade80", label: "T" },
          { from: "n6", to: "n4", color: "#fb923c", label: "H" }
        ]
      },
      {
        title: "Hare falls off: no loop",
        text: "On an acyclic list the hare reaches a null next (the two-step must see hare.next). That is the 'no loop' return. You never need a visited hash set.",
        highlight: ["n0", "n1", "n2", "hare", "nt4"],
        hide: ["nt0", "nt1", "nt2", "nt3", "nt5", "nt6"],
        fail: ["hare"],
        flows: [
          { from: "hare", to: "n2", color: "#f87171", label: "null?" }
        ]
      },
      {
        title: "D, K, C equations",
        text: "Stem D, offset K to the meeting, period C. Tortoise n = D+K+I C. Hare 2n = D+K+J C. Subtract: n is a multiple of C, so a meeting is guaranteed. Rearrange: D+K is also a multiple of C.",
        highlight: ["n0", "n3", "n4", "nt5"],
        hide: ["nt0", "nt1", "nt2", "nt3", "nt4", "nt6"],
        flows: [
          { from: "n0", to: "n3", color: "#60a5fa", label: "D" },
          { from: "n3", to: "n4", color: "#c084fc", label: "K" }
        ]
      },
      {
        title: "P1 from head, P2 from meeting",
        text: "Walk only D, not D+K. P1 starts at 0; P2 starts at the meeting node 4. One step each tick. P2 undershoots the meeting by K and arrives at node 3, the same time P1 finishes the stem. First collision is the loop start.",
        highlight: ["n0", "n3", "n4", "p1", "p2", "nt6"],
        hide: ["nt0", "nt1", "nt2", "nt3", "nt4", "nt5"],
        flows: [
          { from: "p1", to: "n0", color: "#4ade80", label: "reset" },
          { from: "p1", to: "n3", color: "#4ade80", label: "D steps" },
          { from: "p2", to: "n3", color: "#fb923c", label: "D steps" }
        ]
      }
    ]
  }
});
