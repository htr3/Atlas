window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 82,
  title: "Tower of Hanoi Problem - Made Easy",
  video: "https://www.youtube.com/watch?v=q6RicK1FCUs",
  category: "Strings, Trees & Arrays",
  tagline: "Move n−1 aside, shift the base disk, move n−1 on top — 2^n−1 legal moves.",
  summary: "Three towers A,B,C. n disks stacked large-to-small on A must finish on C. A larger disk may never sit on a smaller one; B is the auxiliary. One disk: A→C. Two disks: A→B, A→C, B→C. n disks: recursively move n−1 from A to B using C, move the largest A→C, recursively move n−1 from B to C using A. Tracing n=3 with towers numbered 1,2,3 prints seven moves and really does transfer the stack. The same recurrence works for any n.",

  theory: [
    {
      heading: "The rules",
      body: "Towers A (source), B (auxiliary), C (destination). A starts with a stack of disks in decreasing size, largest on the bottom. Goal: the same stack on C. Constraints: move one disk at a time, and <b>never place a larger disk on a smaller one</b>. Any n is allowed; the lecture builds the algorithm from n=1 up to n=3, then writes the general recurrence.",
      bullets: [
        "B exists only so the constraint can be satisfied.",
        "Size order on every peg must stay decreasing downward.",
        "The problem is the recurrence, not a particular n."
      ]
    },
    {
      heading: "One disk and two disks",
      body: "n=1 is trivial: move the disk A→C. n=2: (1) move a disk A→B using C (the small one parks on the auxiliary); (2) move a disk A→C (the large one goes home); (3) move a disk B→C using A (small one covers the large). The lecture's wording 'using X' marks a recursive subproblem when more than one disk is named, and a direct move when exactly one disk is named.",
      bullets: [
        "Two disks: three moves, the middle one is the only naked A→C.",
        "'Using' names the spare peg of a sub-tower transfer.",
        "Those three lines are already the whole algorithm in miniature."
      ]
    },
    {
      heading: "Three disks are the recursive case",
      body: "The lecture calls n=3 'large'. Write three steps that look like n=2, but the outer two move <b>two</b> disks: (1) move 2 disks A→B using C; (2) move 1 disk A→C; (3) move 2 disks B→C using A. Step 1 and step 3 are not primitive — they invoke the n=2 solution you just learned. After (1) the two small disks sit on B, the largest is free, (2) sends it to C, (3) rebuilds the small tower on C. That is why the procedure is recursive.",
      bullets: [
        "You still move one physical disk per printed line.",
        "A 'move 2 disks' line expands into the three n=2 lines.",
        "The largest disk moves exactly once: A→C."
      ]
    },
    {
      heading: "The n-disk algorithm",
      body: "Replace 2 by n−1. If n>0: TOH(n−1, A, C, B); print A→C; TOH(n−1, B, A, C). Peg order in the call is (count, source, auxiliary, destination) in the lecture's code: the middle argument is the 'using' tower. When n=0 the call returns (the lecture marks those leaves). Compare with the three English steps: n−1 A→B using C; one disk A→C; n−1 B→C using A.",
      bullets: [
        "Base: n=0 does nothing (or n=1 prints a single move).",
        "Each call permutes which peg is source / dest / aux.",
        "Correctness: n−1 is a smaller legal tower, so induction applies."
      ]
    },
    {
      heading: "Trace n=3, towers 1,2,3",
      body: "Call TOH(3,1,2,3). It expands to TOH(2,1,3,2), print 1→3, TOH(2,2,1,3). Each TOH(2,…) expands to two TOH(1,…) around a print. TOH(1,…) prints one move and the n=0 children die. Collecting prints in order: 1→2, 1→3, 2→3, 1→2 wait — the lecture's list is 1→3, 1→2, 3→2, 1→3, 2→1, 2→3, 1→3 (seven lines). Playing them on three pegs really walks the three disks from tower 1 onto tower 3. Same algorithm for any n: 2^n−1 prints (the recurrence T(n)=2T(n−1)+1, T(1)=1).",
      bullets: [
        "n=3 produces 7 moves = 2³−1.",
        "n=1 → 1, n=2 → 3, n=4 → 15.",
        "The expansion tree is the recursion tree of T(n)=2T(n−1)+1."
      ]
    }
  ],

  keyTerms: [
    { term: "Source / auxiliary / destination", def: "A starts with the stack, C must finish with it, B is the spare peg." },
    { term: "Size rule", def: "A larger disk may never rest on a smaller one." },
    { term: "Move n−1", def: "Recursive subproblem: transfer a smaller tower onto the spare peg." },
    { term: "Base disk", def: "The single largest disk; it moves once, source to destination." },
    { term: "n=0 cut-off", def: "A call with zero disks returns; the lecture ticks those leaves in the trace." },
    { term: "T(n)=2T(n−1)+1", def: "Two sub-towers plus one print; solution 2^n−1 moves." },
    { term: "Peg permutation", def: "Each recursive call rotates which of A,B,C is source, aux, dest." }
  ],

  tradeoffs: [
    { pro: "Three lines of recursion solve every n; you never hand-write 15 or 31 moves.", con: "The move count is exponential: 2^n−1, so n=20 is already a million moves." },
    { pro: "The n=1 and n=2 pictures make the n−1 / 1 / n−1 split obvious.", con: "Mixing up the aux peg (passing destination where aux belongs) illegally puts large on small." },
    { pro: "The same recurrence is the classic exponential example in algorithm analysis.", con: "Iterative / Gray-code listings exist but hide the three-step idea this lecture wants." }
  ],

  interviewTips: [
    "State the invariant first: decreasing sizes on every peg, one disk per move.",
    "Write the three steps for n, then the function TOH(n, src, aux, dst).",
    "Trace n=2 on the board (3 moves) before expanding n=3 (7 moves).",
    "Quote T(n)=2T(n−1)+1 = 2^n−1 so they see you connected Hanoi to recurrences.",
    "If they ask 'why aux': because the n−1 tower must park somewhere that is not C while the largest disk moves.",
    "n=0 (or n=1) is the base; forgetting it is infinite recursion."
  ],

  scene: {
    nodes: [
      { id: "za", label: "Tower A (src)", type: "zone", pos: [-7, 0, 0], size: [5, 8] },
      { id: "zb", label: "Tower B (aux)", type: "zone", pos: [0, 0, 0], size: [5, 8] },
      { id: "zc", label: "Tower C (dst)", type: "zone", pos: [7, 0, 0], size: [5, 8] },
      { id: "d3", label: "disk 3", type: "storage", pos: [-7, 0, 2.5], color: "#f87171" },
      { id: "d2", label: "disk 2", type: "cache", pos: [-7, 0, 0], color: "#fb923c" },
      { id: "d1", label: "disk 1", type: "point", pos: [-7, 0, -2.5], color: "#4ade80" },
      { id: "n0", label: "Never larger on smaller", type: "note", pos: [-8, 3, -7] },
      { id: "n1", label: "n=1: A -> C", type: "note", pos: [8, 3, -7], showAt: 0 },
      { id: "n2", label: "n=2: A->B, A->C, B->C", type: "note", pos: [8, 3, 7], showAt: 1 },
      { id: "n3", label: "n-1 to B, 1 to C, n-1 to C", type: "note", pos: [-8, 3, 7], showAt: 2 },
      { id: "n4", label: "TOH(n-1,A,C,B); print; TOH(n-1,B,A,C)", type: "note", pos: [0, 3, -7], showAt: 3 },
      { id: "n5", label: "n=3 prints 7 moves = 2^n-1", type: "note", pos: [8, 3, 2], showAt: 5 }
    ],
    edges: [
      { from: "d1", to: "d2", dashed: true },
      { from: "d2", to: "d3", dashed: true }
    ],
    steps: [
      {
        title: "Three pegs, stacked disks",
        text: "A holds disks 3 (largest), 2, 1 (smallest). C is empty. B is spare. A larger disk must never land on a smaller one. Goal: the same stack on C.",
        highlight: ["za", "zb", "zc", "d1", "d2", "d3", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5"]
      },
      {
        title: "One disk is a single move",
        text: "n=1: move the only disk A→C. That primitive print is what every recursive call eventually does.",
        highlight: ["d1", "zc", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "d1", to: "zc", color: "#4ade80", label: "A->C" }
        ]
      },
      {
        title: "Two disks: three moves",
        text: "Small A→B (using C), large A→C, small B→C (using A). The middle move is the only direct source-to-destination of a single disk. This is the pattern that n=3 will call twice.",
        highlight: ["d1", "d2", "zb", "zc", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5"],
        flows: [
          { from: "d1", to: "zb", color: "#fb923c", label: "A->B" },
          { from: "d2", to: "zc", color: "#60a5fa", label: "A->C" }
        ]
      },
      {
        title: "Three disks: move 2, move 1, move 2",
        text: "Treat two disks as a recursive package: n−1 from A to B using C, the largest A→C, n−1 from B to C using A. Those are the three English steps the code implements.",
        highlight: ["d1", "d2", "d3", "zb", "zc", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5"],
        flows: [
          { from: "d1", to: "zb", color: "#c084fc", label: "n-1" },
          { from: "d2", to: "zb", color: "#c084fc", label: "n-1" },
          { from: "d3", to: "zc", color: "#4ade80", label: "base" }
        ]
      },
      {
        title: "The recursive procedure",
        text: "If n>0: TOH(n−1, A, C, B); print A→C; TOH(n−1, B, A, C). The middle argument is the auxiliary. n=0 returns. Peg roles rotate in each subcall.",
        highlight: ["za", "zb", "zc", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5"]
      },
      {
        title: "Seven prints transfer three disks",
        text: "Expanding TOH(3,1,2,3) yields 1→3, 1→2, 3→2, 1→3, 2→1, 2→3, 1→3. Playing them walks every disk to C. T(n)=2T(n−1)+1 = 2^n−1 moves for any n.",
        highlight: ["za", "zb", "zc", "d1", "d2", "d3", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "d3", to: "zc", color: "#4ade80", label: "home" },
          { from: "d2", to: "zc", color: "#4ade80", label: "home" },
          { from: "d1", to: "zc", color: "#4ade80", label: "home" }
        ]
      }
    ]
  }
});
