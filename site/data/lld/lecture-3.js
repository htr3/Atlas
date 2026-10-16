window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 3,
  title: "System Design of Chess: Low-Level Design",
  video: "https://www.youtube.com/watch?v=I-iZbOVXwxg",
  category: "Low-Level Design",
  tagline: "Do not inherit first — list pieces, then let \"is a Piece\" appear on the whiteboard.",
  summary: "A live LLD round aimed at SD1–SD3: build enough of a chess app that something can actually play. Gaurav lists Pawn, King, Queen, Knight, Bishop, and Rook, waits until shared move/capture/check behavior is obvious, then chooses inheritance (a rook is a Piece) over composition, with an abstract Piece, a Board map, and a temporary board to reject moves that leave your king in check.",

  theory: [
    {
      heading: "Requirements of a playable chess app",
      body: "Low-level design here means planning the code, not drawing a datacenter. The product bar is: you should be able to <b>play chess with this app</b>. That forces two behaviors on every piece: <code>move</code> (do an action) and <code>getAllPossibleMoves</code> (the list an engine or a UI needs). A move is valid or not depending on the piece; capturing, checking the enemy king, and refusing to leave your own king in check are shared. Write this neatly — you are explaining it to the interviewer, not to yourself.",
      bullets: [
        "Audience: software engineers, roughly SD1 to SD3; not PMs or TPMs.",
        "Common: capture, must not result in check for your king, may check the enemy king.",
        "Uncommon (do not over-code): king-side / queen-side castle, pawn double-step, promotion, en passant.",
        "Double-move for a pawn can be inferred from the starting rank — no extra \"hasMoved\" flag required."
      ]
    },
    {
      heading: "List classes before you inherit",
      body: "Start with <code>Pawn</code>, <code>King</code>, <code>Queen</code>, <code>Knight</code>, <code>Bishop</code>, <code>Rook</code>. Do not force a parent because textbooks like inheritance. Commitment is expensive: a wrong is-a relationship means backtracking. Unique methods (king <code>castle</code>, pawn promotion) stay on those types. Castle logic is complex and <b>unlikely to be asked</b>; interviewers want problem breakdown, not a FIDE-complete engine.",
      bullets: [
        "Keep the requirement list in sight while coding.",
        "If shared behavior never appears, skip the parent class — that is allowed.",
        "A real engine with tests is a different artifact; this round is the interview sketch."
      ]
    },
    {
      heading: "Inheritance vs composition",
      body: "Two models: <b>inheritance</b> says a rook <i>is a</i> piece, so if a piece can move, a rook can move. <b>Composition</b> says a pawn <i>has a</i> mover (legs, a sword). Gaurav's call: a rook is a piece more than it has a capability. Precise language becomes code. Comments that \"a Piece has a Pawn\" are backwards — your skeleton does not have you; you have a skeleton. Visitor is mentioned as a possible later tool; the stream commits to inheritance.",
      bullets: [
        "is-a: King, Queen, Rook, … extend Piece.",
        "has-a would bury move/capture in a helper every type must hold.",
        "Do not add a type enum inside Piece and switch on it — that kills the point of inheritance."
      ]
    },
    {
      heading: "Piece, Board, Position, Color",
      body: "<code>Piece</code> begins as an interface (<code>move</code>, <code>getAllPossibleMoves</code>) and becomes an <b>abstract class</b> once capture and check alarms are clearly shared. Each piece keeps a <code>currentPosition</code> and a reference to the <code>Board</code>. <code>Board</code> is a <b>map from Position to Piece</b> (null = empty). <code>makeMove</code> removes the piece from the start square and puts it on the destination. <code>Color</code> is a small enum: white or black, stored as a final field on the piece.",
      bullets: [
        "Position is its own class (file/rank), not a magic pair of ints sprinkled everywhere.",
        "isValid(start, dest) is abstract per piece (pawn one square forward, etc.).",
        "Shared isValid guards: destination is not your own color; moving must not leave your king in check.",
        "Capture: destination occupied by the opposite color."
      ]
    },
    {
      heading: "Call sequence for a move",
      body: "To move: ask <code>isValid</code>. That method first rejects capturing your own piece. Then clone a <b>temporary board</b>, apply the move, and ask whether your king is in check; if yes, return false. Only then mutate <code>currentPosition</code> and <code>Board.makeMove</code>. If the enemy king is now in check, notify that side so their next legal set shrinks to blocks and captures of the checking piece. Full \"is the king in check\" search is heavy — <b>clarify with the interviewer</b> before coding it. You are looking at whether this piece (or a piece you stepped off) can capture the king.",
      bullets: [
        "isValid → temp board.makeMove → kingInCheck(myColor)? reject : commit.",
        "getAllPossibleMoves uses the same isValid over candidate squares.",
        "Pawn: from the home rank, two steps can be legal; pawns never undo to that square."
      ]
    },
    {
      heading: "Interview shape, not a production engine",
      body: "Think on the whiteboard, then type. An IDE is a gift if they allow it. Forty-odd minutes of structure plus a compiling skeleton beats a perfect Stockfish clone. Other LLD questions (Splitwise) are algorithm-first; chess is modeling-first. Know design patterns, but apply them when they fall out. Castling, promotions, and a full checkmate search are extension points you name and skip.",
      bullets: [
        "Note classes, then behaviors, then inheritance vs composition, then code.",
        "They are not scoring deployability; they are scoring how you break the problem.",
        "A personal engine with tests is homework, not the round."
      ]
    }
  ],

  keyTerms: [
    { term: "Low-level design", def: "The round where you plan classes and write code, as opposed to boxes-and-arrows HLD." },
    { term: "getAllPossibleMoves", def: "The list of legal destinations a piece (or an AI) needs in order to play." },
    { term: "Inheritance (is-a)", def: "Rook is a Piece: shared move/capture/check, unique isValid per type." },
    { term: "Composition (has-a)", def: "Pawn has a mover object; rejected here in favor of is-a." },
    { term: "Abstract Piece", def: "Common capture/check logic plus abstract isValid and getAllPossibleMoves." },
    { term: "Board", def: "Map of Position → Piece, plus makeMove; a temp copy tests self-check." },
    { term: "Color", def: "White/black enum on a piece; you cannot capture your own color." },
    { term: "Temporary board", def: "Scratch copy used to apply a candidate move and see if your king is in check." }
  ],

  tradeoffs: [
    { pro: "Inheritance matches speech: every piece really is a Piece.", con: "A wrong parent is painful to undo; that is why they wait before coding it." },
    { pro: "Abstract class shares capture and self-check.", con: "isValid still differs per type; a type-switch inside Piece would be worse." },
    { pro: "Temp board makes self-check obvious.", con: "Copying the board per candidate is slower than incremental attack maps." },
    { pro: "Skip castle/promotion in the interview.", con: "The sketch cannot play a full FIDE game; say that out loud." },
    { pro: "No hasMoved flag for pawns.", con: "Only works because pawns cannot return to the starting square." }
  ],

  interviewTips: [
    "Write requirements (valid move, capture, no self-check) before any class.",
    "Name six piece types, then wait — inherit only when move/capture clearly repeat.",
    "Say \"is-a, not has-a\" and reject a type enum inside Piece.",
    "Walk one move: isValid, temp board, kingInCheck, then Board.makeMove.",
    "Ask whether castle and checkmate search are in scope; they usually are not.",
    "Use an IDE if offered; keep the requirement list visible while you type."
  ],

  scene: {
    nodes: [
      { id: "game", label: "Chess game", type: "service", pos: [-10.5, 0, 0] },
      { id: "board", label: "Board", type: "storage", pos: [-7, 0, 0] },
      { id: "piece", label: "Piece", type: "service", pos: [-3.5, 0, 0] },
      { id: "pawn", label: "Pawn", type: "worker", pos: [0, 0, 6], showAt: 1 },
      { id: "king", label: "King", type: "worker", pos: [0, 0, 3], showAt: 1 },
      { id: "queen", label: "Queen", type: "worker", pos: [0, 0, 0], showAt: 1 },
      { id: "rook", label: "Rook", type: "worker", pos: [0, 0, -3], showAt: 1 },
      { id: "bishop", label: "Bishop", type: "worker", pos: [0, 0, -6], showAt: 1 },
      { id: "pos", label: "Position", type: "point", pos: [-7, 0, 4], showAt: 4 },
      { id: "color", label: "Color enum", type: "note", pos: [-3.5, 0, 6], showAt: 4 },
      { id: "temp", label: "Temp board", type: "storage", pos: [-7, 0, -4], showAt: 6 },
      { id: "note0", label: "Playable chess app", type: "note", pos: [-10.5, 0, 6] },
      { id: "note1", label: "Do not inherit yet", type: "note", pos: [3.5, 0, 6], showAt: 1 },
      { id: "note2", label: "Rook is a Piece", type: "note", pos: [3.5, 0, 0], showAt: 3 },
      { id: "note3", label: "Map pos → piece", type: "note", pos: [-10.5, 0, -6], showAt: 4 },
      { id: "note4", label: "Self-check? reject", type: "note", pos: [-3.5, 0, -6], showAt: 6 }
    ],
    edges: [
      { from: "game", to: "board", label: "owns" },
      { from: "board", to: "piece", label: "pos→piece", showAt: 4 },
      { from: "piece", to: "pawn", showAt: 3 },
      { from: "piece", to: "king", showAt: 3 },
      { from: "piece", to: "queen", showAt: 3 },
      { from: "piece", to: "rook", showAt: 3 },
      { from: "piece", to: "bishop", showAt: 3 },
      { from: "piece", to: "pos", label: "current", showAt: 4 },
      { from: "board", to: "temp", label: "clone", showAt: 6, dashed: true },
      { from: "piece", to: "temp", label: "try move", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "An app that can play chess",
        text: "LLD means classes and code. If a human or an engine is going to play, every piece must expose move and getAllPossibleMoves. Capture, self-check, and checking the enemy king are already on the whiteboard.",
        highlight: ["game", "board", "note0"]
      },
      {
        title: "Six types, no parent yet",
        text: "Pawn, King, Queen, Knight, Bishop, Rook. Unique tricks (castle, promotion, double step) stay on those classes. Jumping to inheritance too early means backtracking. Castle is probably out of scope.",
        highlight: ["pawn", "king", "queen", "rook", "bishop", "note1"]
      },
      {
        title: "A rook is a Piece",
        text: "Inheritance: rook is a piece. Composition: pawn has a mover. Speech matches code — a skeleton does not own you. A type switch inside Piece would cancel the inheritance.",
        highlight: ["piece", "rook", "pawn", "king", "note2"],
        flows: [
          { from: "piece", to: "rook", color: "#c084fc", label: "is-a" },
          { from: "piece", to: "pawn", color: "#c084fc", label: "is-a" }
        ]
      },
      {
        title: "Abstract Piece plus Color",
        text: "Start with an interface, then promote to an abstract class so capture and check alarms are written once. isValid stays abstract. Color is white or black and final on the piece.",
        highlight: ["piece", "color", "pawn", "king"],
        flows: [
          { from: "piece", to: "king", color: "#4ade80", label: "move()" }
        ]
      },
      {
        title: "Board is a position map",
        text: "Board maps Position to Piece. makeMove deletes the start square and writes the destination. Each piece holds currentPosition and a pointer back to the board so it can ask what sits on a square.",
        highlight: ["board", "pos", "piece", "note3"],
        flows: [
          { from: "board", to: "piece", color: "#60a5fa", label: "get(dest)" }
        ]
      },
      {
        title: "Reject capturing your own",
        text: "Before geometry, isValid loads the destination piece. Occupied by the same Color → false. Occupied by the opposite color → capture. Empty → a quiet move, still subject to check.",
        highlight: ["board", "piece", "color"],
        flows: [
          { from: "piece", to: "board", color: "#fb923c", label: "dest piece?" }
        ]
      },
      {
        title: "Temp board for self-check",
        text: "Clone the board, apply the candidate, then kingInCheck(myColor). If your king would be in check, the move is illegal. Full check search is messy — confirm with the interviewer before implementing it.",
        highlight: ["temp", "board", "king", "note4"],
        flows: [
          { from: "board", to: "temp", color: "#c084fc", label: "clone" },
          { from: "piece", to: "temp", color: "#4ade80", label: "try move" }
        ]
      },
      {
        title: "Commit, then maybe check them",
        text: "On success, currentPosition updates and Board.makeMove runs. If the enemy king is in check, that player may only block or capture the checking piece. Pawn double-steps are deduced from the home rank.",
        highlight: ["game", "board", "piece", "pawn"],
        flows: [
          { from: "game", to: "board", color: "#4ade80", label: "makeMove" },
          { from: "board", to: "piece", color: "#4ade80", label: "place" }
        ]
      }
    ]
  }
});
