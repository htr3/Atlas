window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 4,
  title: "What is the Trie data structure and where do you use it?",
  video: "https://www.youtube.com/watch?v=YG6iX28hmd0",
  category: "Interview Prep",
  tagline: "Share character paths so search, insert, and delete are O(length), not O(n L).",
  summary: "A trie is a multiway tree of characters. The lecture inserts PQRS, PPRT, PSST, QQRS, then a second PQRS: shared prefixes stay one path, a blank root holds both P- and Q-words, and a counter on the terminal records frequency 2. Search follows the path; delete decrements and prunes a node only when its count is 0 and it has no children. Each node holds up to |alphabet| child pointers — 26, 52, 62, or 2 for a binary trie.",

  theory: [
    {
      heading: "A dictionary of paths, not a bag of strings",
      body: "The running set is <b>PQRS</b>, <b>PPRT</b>, <b>PSST</b>, <b>QQRS</b>, and a second copy of PQRS. Each word is a path of letters. If you kept five separate arrays (or five linked lists) and searched for PSST, you would compare the key against every stored word: cost <b>O(L × n)</b> for length L and n strings. A trie stores each distinct prefix once so a lookup walks one path of length L.",
      bullets: [
        "Input: many strings, some sharing prefixes, one duplicate PQRS.",
        "Naïve scan: every word, every character — L times n.",
        "Trie: one walk of the key, branching on the next letter."
      ]
    },
    {
      heading: "Insert PQRS, then PPRT, then PSST",
      body: "Start with no tree. PQRS becomes a chain P → Q → R → S. PPRT begins with P, which already exists, but that P has no child P yet — grow P → P → R → T beside the Q branch. PSST again shares the first P; neither Q nor P is an S, so grow P → S → S → T. Three words, one shared P, three diverging spines. Insertion is 'follow while the letter exists, otherwise attach a new child'.",
      bullets: [
        "PQRS: a single spine of four nodes.",
        "PPRT: reuse P, add a second child P, then R, T.",
        "PSST: reuse P, add child S, then S, T."
      ]
    },
    {
      heading: "A blank root so Q-words can live here too",
      body: "QQRS does not start with P. You could allocate a second trie, or you can hang every first letter under one <b>blank / null root</b>. That blank is not a terminator and not the empty string; it is a handle whose children are the first characters that appear. From the root, P already exists; Q does not, so add Q → Q → R → S. All four distinct words now sit in one tree.",
      bullets: [
        "Root is a dummy character, not an end-marker.",
        "Children of root = first letters in the set (here P and Q).",
        "One master trie instead of one tree per initial letter."
      ]
    },
    {
      heading: "Duplicate PQRS becomes a count, not a new spine",
      body: "Walk the existing P-Q-R-S path. Every letter is already there, so you add no nodes. What you do instead is maintain an integer on each node: how many strings <b>end</b> at that node. Interior P, Q, R stay 0. The terminal S of PQRS goes 0 → 1 on first insert, then 1 → <b>2</b> on the duplicate. PPRT's T is 1; PSST's T is 1; the root is 0 unless you choose to allow the empty word. That counter is how you answer 'how often does XYZ occur in this PDF' without storing every index.",
      bullets: [
        "Identical keys share the path; only the end count grows.",
        "A node with count 0 can still be a prefix of longer words.",
        "Root count 0: no empty string in this dictionary."
      ]
    },
    {
      heading: "Search is the insert walk without writes",
      body: "To look up PSST: from the root, is there a P? yes. From that P, an S? yes. Then S, then T. If any hop is missing, the key is absent. If you land on a node whose end-count is 0, the letters exist as a prefix of some longer word but this exact string was never inserted (or was deleted). Cost is O(L), independent of how many other keys share earlier letters.",
      bullets: [
        "Follow one child per character.",
        "Missing child ⇒ not present.",
        "Present path with end-count 0 ⇒ prefix only, not a key."
      ]
    },
    {
      heading: "Delete PSST by decrement, then prune",
      body: "The lecture deletes PSST. Walk to T, decrement its count 1 → 0. A node is garbage when <b>count is 0 and it has no children</b>. T qualifies: the parent deletes that child. Recurse: the second S now has no children and count 0 — delete it. The first S likewise. You arrive at P, which still has children Q and P (PQRS and PPRT). Stop. Both conditions must hold; a zero-count node that still fans out is a live prefix and must stay. Update of an immutable key is the database move: <b>delete the old string, insert the new one</b>.",
      bullets: [
        "Decrement the terminal count.",
        "Parent drops a child that is empty and childless, then recurse.",
        "Stop at the first ancestor that still has kids or a nonzero count.",
        "Update = delete then insert."
      ]
    },
    {
      heading: "Child arrays and binary tries",
      body: "Each node needs a pointer (or slot) per symbol in the alphabet. Lowercase only: <b>26</b> children. Separate uppercase: <b>52</b>. Digits as well: about <b>62</b>. Case folding ('A' equals 'a') shrinks the table; treating them as distinct grows it. A huge alphabet wastes null pointers on every node; a tiny one is cheap. The extreme is a <b>binary trie</b>: alphabet {0,1}, two children, which is the right shape for bit-twiddling problems. The general implementation is a node { count, children[ALPHABET] }; insert, search, and the prune-delete above are walks over that array. The talk stops at that blueprint.",
      bullets: [
        "26 / 52 / 62 child slots depending on case and digits.",
        "Binary trie = two children; same algorithms, bits as letters.",
        "Space is O(total distinct prefixes × alphabet), the classic trie tax."
      ]
    }
  ],

  keyTerms: [
    { term: "Trie", def: "Multiway tree whose edges are characters; a stored string is a path from the root." },
    { term: "Blank root", def: "Dummy parent of every first letter, so P-words and Q-words share one tree. Not a terminator." },
    { term: "End count", def: "How many keys terminate at this node. Prefix-only nodes stay 0." },
    { term: "Shared prefix", def: "PQRS, PPRT, and PSST share the first P as a single node." },
    { term: "Search", def: "Follow one child per character; missing edge or zero count means not a key." },
    { term: "Prune delete", def: "Decrement, then recursively drop a node with count 0 and no remaining children." },
    { term: "Alphabet fan-out", def: "Child array length: 26 letters, 52 with case, ~62 with digits." },
    { term: "Binary trie", def: "Trie over bits; two children per node, used for bitwise queries." }
  ],

  tradeoffs: [
    { pro: "Lookup, insert, and delete are O(L), not O(n L) against a list of strings.", con: "Each node stores |alphabet| child slots, many of them null — memory grows with prefixes times fan-out." },
    { pro: "Shared prefixes (all the P-words) occupy one spine.", con: "Keys with no shared prefix (PQRS vs QQRS) still pay a full path of new nodes." },
    { pro: "End counts give frequencies (PQRS twice) without storing every occurrence index.", con: "Positions in a PDF still need extra posting lists; the trie alone is a counter." },
    { pro: "Pruning after delete reclaims the PSST branch while keeping P for other words.", con: "Must test both 'count 0' and 'no children' or you will cut a live prefix." },
    { pro: "Binary tries reuse the same code for bit problems.", con: "A 62-way array on every node is overkill for a tiny dictionary — a hashmap of children may be slimmer." }
  ],

  interviewTips: [
    "Quote the naïve cost L×n on the five-word set, then show one path of length L.",
    "Insert in the video order: PQRS, PPRT, PSST, dummy root, QQRS, duplicate PQRS with count 2.",
    "Say the blank root is not a terminator — it only exists so Q can be a first letter beside P.",
    "Search: walk; delete: decrement then prune while count==0 and no children; stop at P because PQRS/PPRT remain.",
    "Update = delete old key + insert new key, the same pattern many stores use.",
    "Name 26 / 52 / 62 child pointers and mention binary tries if the prompt is bitwise."
  ],

  scene: {
    nodes: [
      { id: "root", label: "root (blank)", type: "server", pos: [0, 0, 7] },
      { id: "p", label: "P", type: "point", pos: [-4, 0, 4], color: "#4ade80", showAt: 1 },
      { id: "q0", label: "Q", type: "point", pos: [4, 0, 4], color: "#c084fc", showAt: 4 },
      { id: "q1", label: "Q", type: "point", pos: [-8, 0, 1], color: "#4ade80", showAt: 1 },
      { id: "p2", label: "P", type: "point", pos: [-4, 0, 1], color: "#60a5fa", showAt: 2 },
      { id: "s1", label: "S", type: "point", pos: [0, 0, 1], color: "#fb923c", showAt: 3 },
      { id: "q2", label: "Q", type: "point", pos: [4, 0, 1], color: "#c084fc", showAt: 4 },
      { id: "r1", label: "R", type: "point", pos: [-8, 0, -2], color: "#4ade80", showAt: 1 },
      { id: "r2", label: "R", type: "point", pos: [-4, 0, -2], color: "#60a5fa", showAt: 2 },
      { id: "s3", label: "S", type: "point", pos: [0, 0, -2], color: "#fb923c", showAt: 3 },
      { id: "r3", label: "R", type: "point", pos: [4, 0, -2], color: "#c084fc", showAt: 4 },
      { id: "s2", label: "S c=2", type: "point", pos: [-8, 0, -5], color: "#4ade80", showAt: 1 },
      { id: "t1", label: "T c=1", type: "point", pos: [-4, 0, -5], color: "#60a5fa", showAt: 2 },
      { id: "t2", label: "T c=1", type: "point", pos: [0, 0, -5], color: "#fb923c", showAt: 3 },
      { id: "s5", label: "S c=1", type: "point", pos: [4, 0, -5], color: "#c084fc", showAt: 4 },
      { id: "w0", label: "PQRS PPRT PSST QQRS", type: "note", pos: [-8, 3, 7] },
      { id: "w1", label: "Naive scan O(L n)", type: "note", pos: [8, 3, 7] },
      { id: "w2", label: "Insert PQRS spine", type: "note", pos: [8, 3, 4], showAt: 1 },
      { id: "w3", label: "Share P, add PPRT", type: "note", pos: [8, 3, 1], showAt: 2 },
      { id: "w4", label: "Add PSST under P", type: "note", pos: [8, 3, -2], showAt: 3 },
      { id: "w5", label: "Blank root + QQRS", type: "note", pos: [8, 3, -5], showAt: 4 },
      { id: "w6", label: "PQRS count 2", type: "note", pos: [-12, 3, -8], showAt: 5 },
      { id: "w7", label: "Search walks PSST", type: "note", pos: [0, 3, -8], showAt: 6 },
      { id: "w8", label: "Prune T,S,S; keep P", type: "note", pos: [12, 3, -8], showAt: 7 },
      { id: "w9", label: "26 / 52 / 62 kids", type: "note", pos: [-8, 3, 4], showAt: 8 }
    ],
    edges: [
      { from: "root", to: "p", showAt: 1 },
      { from: "root", to: "q0", showAt: 4 },
      { from: "p", to: "q1", showAt: 1 },
      { from: "p", to: "p2", showAt: 2 },
      { from: "p", to: "s1", showAt: 3 },
      { from: "q1", to: "r1", showAt: 1 },
      { from: "r1", to: "s2", showAt: 1 },
      { from: "p2", to: "r2", showAt: 2 },
      { from: "r2", to: "t1", showAt: 2 },
      { from: "s1", to: "s3", showAt: 3 },
      { from: "s3", to: "t2", showAt: 3 },
      { from: "q0", to: "q2", showAt: 4 },
      { from: "q2", to: "r3", showAt: 4 },
      { from: "r3", to: "s5", showAt: 4 }
    ],
    steps: [
      {
        title: "Five strings, naïve scan",
        text: "Keys: PQRS, PPRT, PSST, QQRS, and PQRS again. Matching PSST against every stored word costs length times count. A trie will store letters as a shared multiway tree instead of five separate arrays.",
        highlight: ["w0", "w1", "root"],
        hide: ["w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9"]
      },
      {
        title: "Insert PQRS",
        text: "No tree yet, so write a spine P → Q → R → S. That path is the first word. Later words will try to walk it before they allocate.",
        highlight: ["root", "p", "q1", "r1", "s2", "w2"],
        hide: ["w0", "w1", "w3", "w4", "w5", "w6", "w7", "w8", "w9"],
        flows: [
          { from: "root", to: "p", color: "#4ade80", label: "P" },
          { from: "p", to: "q1", color: "#4ade80", label: "Q" },
          { from: "q1", to: "r1", color: "#4ade80", label: "R" },
          { from: "r1", to: "s2", color: "#4ade80", label: "S" }
        ]
      },
      {
        title: "Insert PPRT",
        text: "First letter P already hangs off the root. That P has no child P, so grow a sibling branch P → R → T. Q of PQRS is untouched. Prefix P is stored once.",
        highlight: ["p", "p2", "r2", "t1", "w3"],
        hide: ["w0", "w1", "w2", "w4", "w5", "w6", "w7", "w8", "w9"],
        flows: [
          { from: "root", to: "p", color: "#60a5fa", label: "P" },
          { from: "p", to: "p2", color: "#60a5fa", label: "P" },
          { from: "p2", to: "r2", color: "#60a5fa", label: "R" },
          { from: "r2", to: "t1", color: "#60a5fa", label: "T" }
        ]
      },
      {
        title: "Insert PSST",
        text: "Again land on P. Neither Q nor P is an S, so attach S → S → T. Three words, three outgoing letters from the same P.",
        highlight: ["p", "s1", "s3", "t2", "w4"],
        hide: ["w0", "w1", "w2", "w3", "w5", "w6", "w7", "w8", "w9"],
        flows: [
          { from: "p", to: "s1", color: "#fb923c", label: "S" },
          { from: "s1", to: "s3", color: "#fb923c", label: "S" },
          { from: "s3", to: "t2", color: "#fb923c", label: "T" }
        ]
      },
      {
        title: "Blank root and QQRS",
        text: "QQRS does not start with P. Hang a dummy root whose children are first letters, then add Q → Q → R → S. The blank is a handle, not a terminator and not the empty word.",
        highlight: ["root", "q0", "q2", "r3", "s5", "w5"],
        hide: ["w0", "w1", "w2", "w3", "w4", "w6", "w7", "w8", "w9"],
        flows: [
          { from: "root", to: "q0", color: "#c084fc", label: "Q" },
          { from: "q0", to: "q2", color: "#c084fc", label: "Q" },
          { from: "q2", to: "r3", color: "#c084fc", label: "R" },
          { from: "r3", to: "s5", color: "#c084fc", label: "S" }
        ]
      },
      {
        title: "Second PQRS: count 2",
        text: "Walk P-Q-R-S; every hop exists, so allocate nothing. Interior counts stay 0. The terminal S increments 1 → 2. The dictionary now reports that PQRS occurred twice.",
        highlight: ["p", "q1", "r1", "s2", "w6"],
        hide: ["w0", "w1", "w2", "w3", "w4", "w5", "w7", "w8", "w9"],
        flows: [
          { from: "root", to: "p", color: "#4ade80", label: "hit" },
          { from: "r1", to: "s2", color: "#4ade80", label: "c++" }
        ]
      },
      {
        title: "Search PSST",
        text: "Same walk as insert, no writes: P, then S, S, T. Each child exists and T's count is 1, so the key is present. A missing hop, or a landing count of 0, would mean absent.",
        highlight: ["p", "s1", "s3", "t2", "w7"],
        hide: ["w0", "w1", "w2", "w3", "w4", "w5", "w6", "w8", "w9"],
        flows: [
          { from: "root", to: "p", color: "#fb923c", label: "P" },
          { from: "p", to: "s1", color: "#fb923c", label: "S" },
          { from: "s1", to: "s3", color: "#fb923c", label: "S" },
          { from: "s3", to: "t2", color: "#fb923c", label: "T" }
        ]
      },
      {
        title: "Delete PSST and prune",
        text: "Decrement T to 0. T has no children, so the parent drops it. Recurse: both S nodes are empty and childless, prune them. P still has Q and P children (PQRS, PPRT) — stop. Both tests (count 0 and no kids) must pass. Update would be this delete plus a fresh insert.",
        highlight: ["p", "s1", "s3", "t2", "w8"],
        fail: ["t2", "s3", "s1"],
        hide: ["w0", "w1", "w2", "w3", "w4", "w5", "w6", "w7", "w9"],
        flows: [
          { from: "t2", to: "s3", color: "#f87171", label: "drop" },
          { from: "s3", to: "s1", color: "#f87171", label: "drop" }
        ]
      },
      {
        title: "Fan-out 26 / 52 / 62",
        text: "Each node stores one child pointer per alphabet symbol: 26 lowercase, 52 with caps, about 62 with digits. Case folding shrinks the table. A binary trie is the same idea with two children and is the tool for bit problems.",
        highlight: ["root", "p", "q0", "w9"],
        hide: ["w0", "w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"]
      }
    ]
  }
});
