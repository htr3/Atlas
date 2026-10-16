window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 13,
  title: "Sprague Grundy Theorem - Combinatorial Game Theory - II",
  video: "https://www.youtube.com/watch?v=AbJqhMm8htw",
  category: "Competitive Programming",
  tagline: "XOR the Grundy of each independent pile; 0 is a loss. Move to a 0-XOR child to win.",
  summary: "Sprague–Grundy: the sum of impartial games has Grundy equal to the XOR of the parts. Combined XOR 0 is a second-player win under perfect play; nonzero is a first-player win. For one subtraction pile the video XORs successor G-values (which matched G for 4,5,6 but fails on G(1)). The real test is XOR of disjoint piles. Division game on piles 4,6,8,2 with floor÷{2,3,6}: G = 3,0,0,2, XOR 1, first wins by 4÷2→2.",

  theory: [
    {
      heading: "What the theorem actually says",
      body: "Part I: G(s)=mex{G(t): s→t}. Sprague–Grundy: if the position is a <b>sum</b> of independent impartial games (a move touches exactly one component), then G(sum)=G(g₁) ⊕ G(g₂) ⊕ … ⊕ G(gₖ). The player to move <b>loses</b> iff that XOR is 0, and <b>wins</b> otherwise, assuming both play perfectly. XOR here is bitwise on the Grundy integers, not on pile sizes. A single pile is the k=1 case: you win iff G(pile)≠0.",
      bullets: [
        "Sum = several boards/piles; one move edits one of them.",
        "G(sum) = XOR of component Grundies.",
        "XOR=0 → second player; XOR≠0 → first player."
      ]
    },
    {
      heading: "Board slip: XOR of successors is not mex",
      body: "The lecture first takes a 6-coin subtraction pile and XORs G(5)⊕G(4)⊕G(3)=1⊕0⊕3=<b>2</b>, calls 2≠0 a win. That 2 equals G(6) by luck — G(6) is mex{1,0,3}=2, which is not the same operator as XOR. Check G(1): successors {0}, XOR is 0 (would say lose) but mex{0}=1 (win: take the last coin). Use XOR on <i>components of a sum</i>. Use mex on <i>successors of one game</i>. Keep both formulas.",
      bullets: [
        "G = mex(successor G-values). Win on one board iff G≠0.",
        "Sum-win iff XOR of those G’s is ≠0.",
        "G(1) is the counter-example to XORing the move list."
      ]
    },
    {
      heading: "Single pile 6, 5, 4 — who wins, and why 4 is dead",
      body: "Same takes {1,2,3} as part I. G(6)=2≠0 first wins; G(5)=1≠0 first wins; G(4)=0 second wins. From 4: 3,2,1 are all G≠0, so the opponent always answers to 0. The video’s XOR of {3,2,1} is 0, which agreed this time. Contest prompts usually only ask who wins; you still want a move: from a nonzero G, pick a successor whose G is 0 (here 6→4 by taking 2). That hands the opponent a 0-position.",
      bullets: [
        "6 and 5 are N-positions (next player wins); 4 is a P-position.",
        "Optimal: move to any child with G=0. From 6 that child is 4.",
        "If every child has G≠0 you are already lost (that is G=0)."
      ]
    },
    {
      heading: "Four piles, moves are floor divide by 2, 3, or 6",
      body: "Piles <b>4, 6, 8, 2</b>. A move picks one pile and replaces n with ⌊n/2⌋, ⌊n/3⌋, or ⌊n/6⌋. Terminal 0 has no positive quotient that changes it in a useful way: G(0)=0. G(1)=mex{G(0)}=1 (every divisor floors to 0). G(2)=mex{G(1),G(0)}=mex{1,0}=<b>2</b>. G(3)=mex{G(1),G(0)}=mex{1,0}=<b>2</b> (⌊3/2⌋=1, ⌊3/3⌋=1, ⌊3/6⌋=0). These are not the subtraction numbers; tabulate.",
      bullets: [
        "Independent piles ⇒ XOR the four G values at the end.",
        "Build G from 0 upward; you need G(3) before G(6).",
        "Floor division can jump, so the table is not n mod 4."
      ]
    },
    {
      heading: "Finish the table: G(4)=3, G(6)=0, G(8)=0",
      body: "G(4)=mex{G(2),G(1),G(0)}=mex{2,1,0}=<b>3</b>. G(6)=mex{G(3),G(2),G(1)}=mex{2,2,1}=<b>0</b> — 0 is missing. G(8)=mex{G(4),G(2),G(1)}=mex{3,2,1}=<b>0</b>. Starting XOR: G(4)⊕G(6)⊕G(8)⊕G(2) = 3⊕0⊕0⊕2 = <b>1</b> ≠ 0. First player wins if both are optimal. 0-piles (6 and 8) are XOR-neutral; they do not change the total until you touch them.",
      bullets: [
        "G(4,6,8,2) = 3, 0, 0, 2.",
        "3⊕2=1. The two zeros drop out of the XOR.",
        "Nonzero total ⇒ there exists a move to a 0-total."
      ]
    },
    {
      heading: "The winning move: 4 ÷ 2 → 2",
      body: "You need the new XOR to be 0. Currently 3⊕2=1. If the pile whose G is 3 became a pile whose G is 2, then 2⊕2=0. G(2) is already 2, and ⌊4/2⌋=2 is legal. After that move the piles are 2,6,8,2 with G 2,0,0,2 and XOR 0. Any other first move that leaves a nonzero XOR is a gift. In general: let tot=XOR of all Gᵢ; for a pile with g=Gᵢ, look for a move to g' where g' ⊕ (tot⊕g) = 0, i.e. g' = tot⊕g. CodeChef May challenge used this pattern; DP the G table, XOR, then search one move if they want the strategy.",
      bullets: [
        "tot=1, pile G=3 should become tot⊕3=2, and G(2)=2.",
        "Legal: divide the 4-pile by 2.",
        "Time: O(maxA · |divisors|) to table G, then O(#piles) to XOR."
      ]
    }
  ],

  keyTerms: [
    { term: "Sprague–Grundy", def: "G of a sum of impartial games is the XOR of the component G values." },
    { term: "XOR = 0", def: "P-position of the sum: previous player wins, i.e. the player to move loses." },
    { term: "XOR ≠ 0", def: "N-position: the player to move can force a win." },
    { term: "Component", def: "One pile / one board; a legal move edits exactly one component." },
    { term: "Optimal move", def: "Move one component so the new XOR of all G’s is 0." },
    { term: "Division game", def: "Replace n with ⌊n/2⌋, ⌊n/3⌋, or ⌊n/6⌋ on a chosen pile." },
    { term: "G table", def: "Bottom-up mex for 0..max pile. Here G(2)=2, G(4)=3, G(6)=0, G(8)=0." },
    { term: "Neutral pile", def: "A component with G=0; XOR ignores it until you change that pile." }
  ],

  tradeoffs: [
    { pro: "XOR of a few integers decides the whole match without searching the game tree.", con: "You still need a correct G table; a wrong mex poisons the XOR." },
    { pro: "XORing successor G’s sometimes equals G (as on pile 6).", con: "It is the wrong operator — G(1) is a win with successor-XOR 0." },
    { pro: "Finding a move to XOR 0 also gives the strategy, not just the winner.", con: "Some problems only ask the winner; skip the search if the statement does." },
    { pro: "Independent piles share one G table, then O(1) XOR per pile.", con: "Moves that couple piles (one take from two piles) break the sum and SG." }
  ],

  interviewTips: [
    "Write two lines: G=mex(successors); sum G = XOR of parts. Do not mix them.",
    "On one subtraction pile, winner iff G≠0. Quote G(4)=0 and the three losing replies.",
    "If they XOR the move list, show G(1): mex{0}=1 but 0⊕(empty rest)=0.",
    "For 4,6,8,2 with ÷{2,3,6}, fill G(0..8) then 3⊕0⊕0⊕2=1.",
    "Winning strategy: change the G=3 pile into G=2 via 4÷2. New XOR 2⊕2=0.",
    "Coupled moves (touch two piles at once) mean it is not a sum — SG does not apply raw."
  ],

  scene: {
    nodes: [
      { id: "pile6", label: "6 coins", type: "queue", pos: [-9.5, 0, -6.5] },
      { id: "c5", label: "G5=1", type: "cache", pos: [-5.5, 0, -6.5], showAt: 1 },
      { id: "c4", label: "G4=0", type: "db", pos: [-1.5, 0, -6.5], showAt: 1 },
      { id: "c3", label: "G3=3", type: "cache", pos: [2.5, 0, -6.5], showAt: 1 },
      { id: "xor6", label: "1⊕0⊕3=2", type: "note", pos: [9, 0, -6.5], showAt: 1 },
      { id: "warn", label: "mex not XOR of moves", type: "note", pos: [9, 0, -3.5], showAt: 2 },
      { id: "g1w", label: "G1=1 win", type: "worker", pos: [-9.5, 0, -2.5], showAt: 2 },
      { id: "bad", label: "succ XOR=0", type: "point", pos: [-5.5, 0, -2.5], color: "#f87171", showAt: 2 },
      { id: "p4", label: "pile 4", type: "storage", pos: [-9.5, 0, 1], showAt: 4 },
      { id: "p6", label: "pile 6", type: "storage", pos: [-5.5, 0, 1], showAt: 4 },
      { id: "p8", label: "pile 8", type: "storage", pos: [-1.5, 0, 1], showAt: 4 },
      { id: "p2", label: "pile 2", type: "storage", pos: [2.5, 0, 1], showAt: 4 },
      { id: "gp4", label: "G=3", type: "point", pos: [-9.5, 0, 4.5], color: "#c084fc", showAt: 5 },
      { id: "gp6", label: "G=0", type: "point", pos: [-5.5, 0, 4.5], color: "#64748b", showAt: 5 },
      { id: "gp8", label: "G=0", type: "point", pos: [-1.5, 0, 4.5], color: "#64748b", showAt: 5 },
      { id: "gp2", label: "G=2", type: "point", pos: [2.5, 0, 4.5], color: "#60a5fa", showAt: 5 },
      { id: "tot", label: "3⊕0⊕0⊕2=1", type: "lb", pos: [8.5, 0, 1], showAt: 6 },
      { id: "mv", label: "4÷2 → 2", type: "worker", pos: [8.5, 0, 4.5], showAt: 7 },
      { id: "n0", label: "takes 1,2,3", type: "note", pos: [-9.5, 0, 7] },
      { id: "n1", label: "XOR=0 lose else win", type: "note", pos: [-1.5, 0, 7], showAt: 3 },
      { id: "n2", label: "floor ÷ 2,3,6", type: "note", pos: [8.5, 0, 7], showAt: 4 }
    ],
    edges: [
      { from: "pile6", to: "c5", showAt: 1 },
      { from: "pile6", to: "c4", showAt: 1 },
      { from: "pile6", to: "c3", showAt: 1 },
      { from: "g1w", to: "bad", showAt: 2, dashed: true },
      { from: "p4", to: "gp4", showAt: 5 },
      { from: "p6", to: "gp6", showAt: 5 },
      { from: "p8", to: "gp8", showAt: 5 },
      { from: "p2", to: "gp2", showAt: 5 },
      { from: "gp4", to: "tot", showAt: 6 },
      { from: "gp2", to: "tot", showAt: 6 },
      { from: "tot", to: "mv", showAt: 7 },
      { from: "p4", to: "mv", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "One pile of six, three children",
        text: "Subtraction {1,2,3}. From 6 you reach 5,4,3 with G 1,0,3. The video XORs them to 2 and says first player wins. G(6) is actually mex{1,0,3}=2, same number, different operator.",
        highlight: ["pile6", "c5", "c4", "c3", "xor6", "n0"],
        flows: [
          { from: "pile6", to: "c5", color: "#4ade80", label: "−1" },
          { from: "pile6", to: "c4", color: "#4ade80", label: "−2" },
          { from: "pile6", to: "c3", color: "#4ade80", label: "−3" }
        ]
      },
      {
        title: "Do not XOR the move list",
        text: "G(1)=mex{0}=1, a win (take the last coin). XOR of its successors is 0, which would wrongly call it a loss. Mex builds G. XOR combines independent games.",
        highlight: ["g1w", "bad", "warn", "c4"],
        fail: ["bad"],
        flows: [
          { from: "g1w", to: "bad", color: "#f87171", label: "not G" }
        ]
      },
      {
        title: "Single pile: win iff G≠0",
        text: "G(6)=2 and G(5)=1 are wins. G(4)=0 is a loss: every take leaves 3,2, or 1 and the opponent empties the pile. Sprague–Grundy on one component is just this zero test.",
        highlight: ["c4", "c5", "c3", "n1"],
        fail: ["c4"],
        flows: [
          { from: "c5", to: "c4", color: "#60a5fa", label: "to 0" }
        ]
      },
      {
        title: "Optimal: move to a 0-child",
        text: "From 6, taking 2 leaves G=0. That is the winning strategy on one pile. If no 0-child exists, G was already 0 and you are lost. Next we XOR several piles.",
        highlight: ["pile6", "c4", "n1"],
        flows: [
          { from: "pile6", to: "c4", color: "#4ade80", label: "take 2" }
        ]
      },
      {
        title: "Four piles, divide by 2, 3, 6",
        text: "Piles 4, 6, 8, 2. A move replaces one n with floor(n/d) for d in {2,3,6}. Independent components — the theorem’s XOR applies. G(0)=0, G(1)=1, G(2)=2, G(3)=2.",
        highlight: ["p4", "p6", "p8", "p2", "n2"]
      },
      {
        title: "G table on the four piles",
        text: "G(4)=mex{2,1,0}=3. G(6)=mex{2,2,1}=0. G(8)=mex{3,2,1}=0. G(2)=2. Two piles are XOR-neutral until you touch them. The live pair is 3 and 2.",
        highlight: ["p4", "p6", "p8", "p2", "gp4", "gp6", "gp8", "gp2"],
        flows: [
          { from: "p4", to: "gp4", color: "#c084fc", label: "3" },
          { from: "p2", to: "gp2", color: "#60a5fa", label: "2" }
        ]
      },
      {
        title: "XOR is 1: first player wins",
        text: "3⊕0⊕0⊕2=1, not zero. First player wins with perfect play. Contest statement often stops here: print First. The zeros from 6 and 8 do not change the total.",
        highlight: ["gp4", "gp6", "gp8", "gp2", "tot", "n1"],
        flows: [
          { from: "gp4", to: "tot", color: "#c084fc", label: "3" },
          { from: "gp2", to: "tot", color: "#60a5fa", label: "2" }
        ]
      },
      {
        title: "Winning move 4 ÷ 2",
        text: "Need new XOR 0. Change G=3 into G=2 so 2⊕2=0. G(2)=2 and floor(4/2)=2 is legal. Piles become 2,6,8,2. That is how you play, not only who wins.",
        highlight: ["p4", "gp4", "tot", "mv", "gp2"],
        flows: [
          { from: "p4", to: "mv", color: "#4ade80", label: "÷2" },
          { from: "tot", to: "mv", color: "#4ade80", label: "XOR→0" }
        ]
      }
    ]
  }
});
