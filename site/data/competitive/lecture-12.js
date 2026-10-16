window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 12,
  title: "Grundy Numbers - Combinatorial Game Theory - I",
  video: "https://www.youtube.com/watch?v=MboYbpE76js",
  category: "Competitive Programming",
  tagline: "Impartial pile games collapse to one integer: mex of the Grundy numbers you can move to.",
  summary: "Impartial games (Nim) let both players use the same moves; chess is partial. MEX is the smallest missing non-negative integer. Grundy(position) = mex { Grundy(successors) }, and the empty set is 0 — a terminal loss under normal play. Subtraction {1,2,3} on a pile: G(0)=0, G(1)=1, G(2)=2, G(3)=3, G(4)=0, G(5)=1, G(6)=2. G(4)=0 matches the play: every move leaves a pile the opponent empties in one turn.",

  theory: [
    {
      heading: "Impartial vs partial",
      body: "Chess and tic-tac-toe are <b>partial</b>: you cannot move the opponent’s pieces or play their mark. The theory in this pair of videos is only for <b>impartial</b> games — from any position the legal moves do not depend on who is to play. The running example is <b>Nim</b>: N piles of coins. A move chooses one pile and removes at least one coin from it (you may empty that pile). Normal play: the player who cannot move loses. Your goal is to hand over a position with no moves (all piles empty, or whatever the rules leave as terminal).",
      bullets: [
        "Impartial: both players see the same move list from a given board.",
        "Nim move: pick one pile, take ≥1 coins from it.",
        "Last legal move wins; 0 coins everywhere is a loss for the player about to move."
      ]
    },
    {
      heading: "MEX, the smallest missing non-negative",
      body: "<b>Minimum excludant</b> (mex) of a set of non-negative integers is the smallest integer that is <i>not</i> in the set. mex{0,1}=2 because 0 and 1 are present and 2 is not. mex{1,2,3}=0 because 0 is missing even though 4 is also missing — mex never skips a hole. mex{}=0 by definition. If the set is the labels of moves you can make, mex is the smallest label you <i>cannot</i> force this turn.",
      bullets: [
        "Domain is {0,1,2,…}, never negatives.",
        "Holes beat larger numbers: {1,2,3} still mexes to 0.",
        "Empty set → 0. That will be the terminal Grundy."
      ]
    },
    {
      heading: "Grundy is mex of successor Grundies, not of pile sizes",
      body: "A single integer G(s) labels impartial position s: G(s) = mex { G(t) : s → t }. Do <i>not</i> mex the raw pile sizes. From 10 coins with takes {1,2,3} you can reach piles 9, 8, 7, but G(10)=mex{G(9),G(8),G(7)}, which is a recursive call. Base: no moves ⇒ mex{} = 0, a losing position if the opponent plays perfectly. The next video XORs several of these integers; this video only computes them.",
      bullets: [
        "G(s) = mex of G-values of positions you can move to.",
        "Mex of {9,8,7} is the wrong formula — those are sizes, not games.",
        "G=0 means every move leaves a G≠0 (or you have no move)."
      ]
    },
    {
      heading: "Subtraction {1,2,3}: compute G(0) through G(3)",
      body: "One pile, you may take 1, 2, or 3 coins (not more than the pile). G(0)=mex{}=<b>0</b> — no coins, no move, loss. G(1)=mex{G(0)}=mex{0}=<b>1</b> — take the last coin and win. G(2)=mex{G(1),G(0)}=mex{1,0}=<b>2</b>. G(3)=mex{G(2),G(1),G(0)}=mex{2,1,0}=<b>3</b>. So far G(n)=n. That pattern is about to break.",
      bullets: [
        "G(0)=0, G(1)=1, G(2)=2, G(3)=3.",
        "Each new value is mex of the previous three (or fewer near 0).",
        "Taking the last coin from 1 is a win, so G(1) cannot be 0."
      ]
    },
    {
      heading: "G(4)=0, and why the play agrees",
      body: "G(4)=mex{G(3),G(2),G(1)}=mex{3,2,1}. 0 is missing, so G(4)=<b>0</b>. Play: take 1 leave 3, opponent takes 3; take 2 leave 2, opponent takes 2; take 3 leave 1, opponent takes 1. Every line loses against perfect replies. The zero is not a coincidence — it is the theorem telling you this pile is a P-position (previous-player win, i.e. the player to move loses).",
      bullets: [
        "Set {1,2,3} has a hole at 0, not at 4.",
        "Four coins vs takes of 1–3 is a forced loss.",
        "Write the three replies out loud in a contest; judges like the check."
      ]
    },
    {
      heading: "G(5)=1, G(6)=2, then stop until the XOR video",
      body: "G(5)=mex{G(4),G(3),G(2)}=mex{0,3,2}=<b>1</b> (1 is the hole). G(6)=mex{G(5),G(4),G(3)}=mex{1,0,3}=<b>2</b>. The sequence 0,1,2,3,0,1,2,… is G(n)=n mod 4 for this subtraction set — useful, but derive it from mex, do not memorise first. Time: O(n · |moves|) if you tabulate 0..n. Next lecture: several piles, XOR the G values, decide who wins.",
      bullets: [
        "G(0..6) = 0,1,2,3,0,1,2.",
        "This game: G(n) = n mod 4, because the move set is {1,2,3}.",
        "Complexity to fill a table: O(n · moves), then O(1) per pile."
      ]
    }
  ],

  keyTerms: [
    { term: "Impartial", def: "Legal moves depend only on the position, not on whose turn or whose pieces." },
    { term: "Partial / partisan", def: "Chess, tic-tac-toe: each player has private tokens or marks." },
    { term: "Nim", def: "Piles of coins; a move removes ≥1 coins from a single pile; last move wins." },
    { term: "MEX", def: "Smallest missing non-negative integer in a set. mex{}=0, mex{0,1}=2, mex{1,2,3}=0." },
    { term: "Grundy number", def: "G(s)=mex{G(t): s→t}. One integer that labels an impartial position." },
    { term: "Terminal / G=0", def: "No moves ⇒ G=0, a loss for the player about to move (normal play)." },
    { term: "Subtraction game", def: "One pile, subtract a number from a fixed set (here {1,2,3})." },
    { term: "Successor set", def: "The G-values of positions one legal move away — the set you mex." }
  ],

  tradeoffs: [
    { pro: "One integer per position, computed bottom-up from terminals.", con: "You must recurse on G(successors), not mex the raw sizes 9,8,7." },
    { pro: "G=0 is a complete losing diagnosis for a single pile.", con: "Several piles need the XOR in part II; G of one pile is not the whole match." },
    { pro: "Subtraction {1,2,3} has a closed form n mod 4 after you fill a few cells.", con: "A weird move set (divide by 2,3,6) has no slogan — tabulate." },
    { pro: "Table is O(n · |moves|) and tiny for contest n.", con: "Huge state spaces need a theorem or a grundy pattern, not a 10⁸ DP." }
  ],

  interviewTips: [
    "Say impartial first: both players share the move list. Chess is the counter-example.",
    "Define mex on {0,1,2,…} with mex{}=0 before writing G.",
    "From 10 coins, write mex{G(9),G(8),G(7)} — never mex{9,8,7}.",
    "Fill G(0)=0 … G(4)=0 by hand. Explain the three losing replies from 4 coins.",
    "Quote G(0..6)=0,1,2,3,0,1,2 and n mod 4 for this move set.",
    "This video does not XOR yet. If they ask who wins two piles, point at Sprague–Grundy."
  ],

  scene: {
    nodes: [
      { id: "chess", label: "chess", type: "user", pos: [-9.5, 0, -6.5] },
      { id: "ttt", label: "tic-tac-toe", type: "phone", pos: [-5.5, 0, -6.5] },
      { id: "nim", label: "Nim piles", type: "queue", pos: [2, 0, -6.5] },
      { id: "pA", label: "A1", type: "point", pos: [-1, 0, -3.5], color: "#60a5fa", showAt: 1 },
      { id: "pB", label: "A2", type: "point", pos: [2, 0, -3.5], color: "#60a5fa", showAt: 1 },
      { id: "pC", label: "A3", type: "point", pos: [5, 0, -3.5], color: "#60a5fa", showAt: 1 },
      { id: "m0", label: "0", type: "point", pos: [-7.5, 0, 0], color: "#4ade80", showAt: 2 },
      { id: "m1", label: "1", type: "point", pos: [-4.5, 0, 0], color: "#4ade80", showAt: 2 },
      { id: "m2", label: "2", type: "point", pos: [-1.5, 0, 0], color: "#fb923c", showAt: 2 },
      { id: "m3", label: "3", type: "point", pos: [1.5, 0, 0], color: "#64748b", showAt: 2 },
      { id: "g0", label: "G0=0", type: "db", pos: [-9, 0, 4], showAt: 3 },
      { id: "g1", label: "G1=1", type: "cache", pos: [-5.5, 0, 4], showAt: 4 },
      { id: "g2", label: "G2=2", type: "cache", pos: [-2, 0, 4], showAt: 4 },
      { id: "g3", label: "G3=3", type: "cache", pos: [1.5, 0, 4], showAt: 4 },
      { id: "g4", label: "G4=0", type: "db", pos: [5, 0, 4], showAt: 5 },
      { id: "g5", label: "G5=1", type: "worker", pos: [8.5, 0, 4], showAt: 6 },
      { id: "g6", label: "G6=2", type: "worker", pos: [8.5, 0, 7], showAt: 6 },
      { id: "nimp", label: "partial vs impartial", type: "note", pos: [9.5, 0, -6.5] },
      { id: "nnim", label: "take ≥1 from one pile", type: "note", pos: [9.5, 0, -3.5], showAt: 1 },
      { id: "nmex", label: "mex{0,1}=2", type: "note", pos: [9.5, 0, 0], showAt: 2 },
      { id: "nbase", label: "mex{} = 0 lose", type: "note", pos: [-9, 0, 7], showAt: 3 },
      { id: "nfill", label: "mex of G not sizes", type: "note", pos: [-2, 0, 7], showAt: 4 },
      { id: "nzero", label: "4 coins: all replies win", type: "note", pos: [5, 0, 7], showAt: 5 }
    ],
    edges: [
      { from: "nim", to: "pA", showAt: 1 },
      { from: "nim", to: "pB", showAt: 1 },
      { from: "nim", to: "pC", showAt: 1 },
      { from: "m0", to: "m1", showAt: 2 },
      { from: "m1", to: "m2", showAt: 2 },
      { from: "m2", to: "m3", showAt: 2 },
      { from: "g0", to: "g1", showAt: 4, dashed: true },
      { from: "g1", to: "g2", showAt: 4, dashed: true },
      { from: "g2", to: "g3", showAt: 4, dashed: true },
      { from: "g3", to: "g4", showAt: 5, dashed: true },
      { from: "g4", to: "g5", showAt: 6, dashed: true },
      { from: "g5", to: "g6", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Partial boards vs Nim",
        text: "Chess and tic-tac-toe are partial: you cannot move the opponent’s pieces or draw their mark. Nim is impartial — both players have the same list of takes from the piles that exist.",
        highlight: ["chess", "ttt", "nim", "nimp"]
      },
      {
        title: "Nim piles, last move wins",
        text: "Piles A1, A2, A3. Choose one pile, remove at least one coin. You win by leaving a position with no legal take — typically all piles empty. Zero from a pile is not a move.",
        highlight: ["nim", "pA", "pB", "pC", "nnim"],
        flows: [
          { from: "nim", to: "pB", color: "#fb923c", label: "take ≥1" }
        ]
      },
      {
        title: "MEX of a set",
        text: "mex is the smallest missing non-negative. {0,1} contains 0 and 1, so mex=2 (highlighted). {1,2,3} would mex to 0 because of the hole. mex{} is 0.",
        highlight: ["m0", "m1", "m2", "nmex"],
        flows: [
          { from: "m1", to: "m2", color: "#fb923c", label: "hole" }
        ]
      },
      {
        title: "G(0)=mex{}=0",
        text: "Zero coins, no move, terminal loss. Grundy of a position is mex of the Grundies you can move to, not mex of the pile sizes. Empty successor set ⇒ 0.",
        highlight: ["g0", "nbase", "m0"],
        fail: ["g0"]
      },
      {
        title: "Fill G(1), G(2), G(3)",
        text: "Take 1,2, or 3. G(1)=mex{0}=1. G(2)=mex{1,0}=2. G(3)=mex{2,1,0}=3. From 10 coins you would mex G(9),G(8),G(7) — never the integers 9,8,7.",
        highlight: ["g0", "g1", "g2", "g3", "nfill"],
        flows: [
          { from: "g1", to: "g0", color: "#4ade80", label: "take 1" },
          { from: "g3", to: "g0", color: "#4ade80", label: "take 3" }
        ]
      },
      {
        title: "G(4)=0 matches the play",
        text: "mex{3,2,1}=0 because 0 is missing. Take 1 leave 3, opponent takes 3; take 2 leave 2; take 3 leave 1. Every line loses. The integer 0 is the same fact as the three replies.",
        highlight: ["g4", "g3", "g2", "g1", "nzero"],
        fail: ["g4"],
        flows: [
          { from: "g4", to: "g3", color: "#f87171", label: "→3" },
          { from: "g4", to: "g2", color: "#f87171", label: "→2" },
          { from: "g4", to: "g1", color: "#f87171", label: "→1" }
        ]
      },
      {
        title: "G(5)=1, G(6)=2",
        text: "mex{G(4),G(3),G(2)}=mex{0,3,2}=1. mex{G(5),G(4),G(3)}=mex{1,0,3}=2. Sequence 0,1,2,3,0,1,2 — here G(n)=n mod 4. Next video XORs several piles.",
        highlight: ["g0", "g4", "g5", "g6", "nfill"],
        flows: [
          { from: "g5", to: "g4", color: "#4ade80", label: "to 0" },
          { from: "g6", to: "g5", color: "#60a5fa", label: "to 1" }
        ]
      },
      {
        title: "One number per game state",
        text: "Each pile size is now a Grundy integer. Tabulate O(n·moves). A single G=0 pile is a loss; combining piles is Sprague–Grundy (XOR), not another mex of sizes.",
        highlight: ["g0", "g1", "g2", "g3", "g4", "g5", "g6", "nim"]
      }
    ]
  }
});
