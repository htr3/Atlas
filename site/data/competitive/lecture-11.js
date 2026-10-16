window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 11,
  title: "Persistent Trie - Codechef - GothamPD",
  video: "https://www.youtube.com/watch?v=0FgKhpyBTcw",
  category: "Competitive Programming",
  tagline: "Path XOR min/max vs K: one binary trie per city, but only O(B) new nodes each add.",
  summary: "GothamPD is a tree rooted at city 0. A query on X and K wants the min and max of (K XOR id) over ids on the path X→root. A binary trie of those ids answers both in O(B) bits. Building a fresh trie per city is O(n²). Persistence: Y’s trie is X’s trie plus O(B) copied nodes along the inserted id, sharing every unchanged child. Query O(B), update O(B), memory O(n B).",

  theory: [
    {
      heading: "The tree, the path window, two query kinds",
      body: "Cities form a <b>tree</b> rooted at Gotham PD (city 0). Each city has an integer id. Operations: (1) <b>add</b> city Y as a child of X with a given id; (2) <b>query</b> X and K — take the list of ids on the unique path from X to the root, XOR each with K, report both the minimum and the maximum. Example path ids {23, 46, 1} and K=46: 46⊕46=0 is the min, 23⊕46=57 is a max candidate. Brute force XORs K against every id on the path: O(depth) per query, too slow when the tree is a stick and queries are many.",
      bullets: [
        "Graph is a tree; updates only hang a new leaf under an existing parent.",
        "Query window = ids on X→root, not the whole tree.",
        "Need both min XOR and max XOR with the same K."
      ]
    },
    {
      heading: "Binary trie, then greedy opposite / same bit",
      body: "Drop the tree for a moment: you have a static set of numbers and one K. Insert every number as a bit string, MSB first, into a trie with alphabet {0,1}. To <b>maximise</b> K⊕x, at bit i walk toward <code>1-K_i</code> if that child exists (XOR wants a 1 there); otherwise take the only child you have. To <b>minimise</b>, prefer the <i>same</i> bit as K. One walk of B bits beats scanning n numbers. B is 32 or 64 from the constraints.",
      bullets: [
        "XOR of two bits is 1 iff they differ — that is the greedy.",
        "Missing preferred child ⇒ fall back; the walk always finishes if the set is non-empty.",
        "Same trie, two policies: opposite for max, equal for min."
      ]
    },
    {
      heading: "Worked bits: set 00101, 01000, 01101, 10000 and K=11101",
      body: "Max walk: K starts 1, prefer 0 — the 0-child exists (three numbers). Next K-bit 1, prefer 0 — land on 00101. Next prefer 0, but 00101 has a 1 there; forced 1 (XOR bit 0). Last two bits also have no opposite child, so the chosen x is <b>00101</b>. 11101 ⊕ 00101 = <b>11000</b>. Min walk: prefer 1 at the MSB — take 10000 — then match as often as that spine allows. One number, B hops, not four XOR loops.",
      bullets: [
        "Preferred child missing ≠ failure; take the other bit and lose that XOR bit.",
        "Max and min can land on different leaves of the same trie.",
        "Cost is O(B) after the trie exists."
      ]
    },
    {
      heading: "Why n independent tries explode",
      body: "Back on the city tree: the set for X is exactly the ids on X→root. If you allocate a full binary trie at every city, each trie can hold O(depth) numbers, and building it copies the parent path in O(depth · B). Summed over a line of n cities that is Θ(n² B) time and memory. GothamPD cannot pay that. The mistake is rebuilding numbers that already sit in the parent’s trie.",
      bullets: [
        "Y’s path ids = X’s path ids ∪ {id(Y)}.",
        "Parent trie already stores every id except the new one.",
        "A full copy per child is the n² you must not submit."
      ]
    },
    {
      heading: "Persist: copy O(B) nodes, share the rest",
      body: "Give each city a <b>root pointer</b> into one big node pool. To add Y under X, start from X’s root and insert id(Y) as in a normal binary trie, but <b>clone</b> every node on the insertion spine instead of mutating it. Unchanged children stay as pointers into X’s version. If id(Y) begins with 1, Y’s new root has the same 0-child as X and a private 1-child chain of length B. Jatin’s board: adding 101 created four new nodes, not a second copy of the whole set. That is persistence — old queries on X still walk X’s root, which was never overwritten.",
      bullets: [
        "Insert clones the B-node path; other subtrees are shared.",
        "Each city remembers only its version root.",
        "Mutation would corrupt every ancestor query — clone or lose."
      ]
    },
    {
      heading: "Complexities that fit the ML",
      body: "Query: walk Y’s (or X’s) version with the max/min policy, O(B). Update: clone O(B) nodes, O(B) time. n updates allocate O(n B) nodes total. B≤32 is a small constant, so memory is linear-ish. The query window is implicit: you never materialise the path list; the persistent trie <i>is</i> that list. Same pattern as a persistent segment tree, with bits as the universe.",
      bullets: [
        "Query O(B), update O(B), memory O(n B).",
        "Brute path scan O(n); full per-node trie O(n² B); persist O(n B).",
        "Offline you could still persist; online adds are the reason you clone on the fly."
      ]
    }
  ],

  keyTerms: [
    { term: "Path window", def: "Ids on the unique X→root path; that set is what K is XOR’d against." },
    { term: "Binary trie", def: "Trie over bits, two children, MSB at the root. One walk of B bits." },
    { term: "Max-XOR policy", def: "At each bit prefer the child that differs from K; fallback if missing." },
    { term: "Min-XOR policy", def: "Prefer the child equal to K’s bit; fallback if missing." },
    { term: "Version root", def: "Per-city pointer into a shared node pool; walking it sees that city’s path set." },
    { term: "Persistent insert", def: "Clone the O(B) spine for the new id; reuse unchanged child pointers." },
    { term: "Gotham add", def: "Hang Y under X with a given id; new version = parent version + that id." },
    { term: "B", def: "Bit width (32 or 64). Every bound in this problem is O(B) or O(n B)." }
  ],

  tradeoffs: [
    { pro: "Path scan is obvious and needs no extra structure.", con: "O(depth) per query dies on a chain of n cities." },
    { pro: "A static binary trie answers min/max XOR in O(B).", con: "The set changes per city; one global trie mixes ids off the path." },
    { pro: "A private trie per city is correct.", con: "O(n² B) memory — the board called this the wrong copy." },
    { pro: "Persistent clone uses O(B) new nodes per add and shares the rest.", con: "You must never mutate a shared node; one in-place write poisons ancestors." }
  ],

  interviewTips: [
    "State the query window first: ids on X→root, min and max of K⊕id.",
    "Draw the binary-trie greedy: opposite bit for max, same bit for min, fallback if absent.",
    "Kill the O(n²) plan out loud: n tries each of size O(n) before you mention persistence.",
    "Add Y = clone B nodes on id(Y)’s spine from X’s root; 0-child of a 1-insert is a shared pointer.",
    "Quote O(B) query, O(B) update, O(n B) memory with B=32.",
    "If they ask min and max, it is the same walk with the preferred bit flipped."
  ],

  scene: {
    nodes: [
      { id: "g0", label: "city 0", type: "server", pos: [-9.5, 0, -6.5] },
      { id: "cx", label: "city X", type: "service", pos: [-9.5, 0, -1.5], showAt: 1 },
      { id: "cy", label: "city Y", type: "worker", pos: [-9.5, 0, 3.5], showAt: 5 },
      { id: "kbox", label: "K=111", type: "cache", pos: [-9.5, 0, 7], showAt: 1 },
      { id: "tr", label: "trie", type: "point", pos: [1, 0, -7], color: "#e2e8f0" },
      { id: "b0", label: "0", type: "point", pos: [-2.5, 0, -3.5], color: "#60a5fa", showAt: 2 },
      { id: "b1", label: "1", type: "point", pos: [4.5, 0, -3.5], color: "#fb923c", showAt: 2 },
      { id: "b00", label: "0", type: "point", pos: [-5, 0, 0], color: "#60a5fa", showAt: 2 },
      { id: "b01", label: "1", type: "point", pos: [0, 0, 0], color: "#60a5fa", showAt: 2 },
      { id: "b10", label: "0", type: "point", pos: [4.5, 0, 0], color: "#fb923c", showAt: 2 },
      { id: "n001", label: "001", type: "point", pos: [-5, 0, 3.5], color: "#4ade80", showAt: 2 },
      { id: "n010", label: "010", type: "point", pos: [-2.5, 0, 3.5], color: "#4ade80", showAt: 2 },
      { id: "n011", label: "011", type: "point", pos: [0, 0, 3.5], color: "#4ade80", showAt: 2 },
      { id: "n100", label: "100", type: "point", pos: [4.5, 0, 3.5], color: "#fb923c", showAt: 2 },
      { id: "ny", label: "101", type: "point", pos: [7.5, 0, 3.5], color: "#c084fc", showAt: 5 },
      { id: "nr", label: "Y root", type: "point", pos: [7.5, 0, -7], color: "#c084fc", showAt: 5 },
      { id: "n1b", label: "1'", type: "point", pos: [7.5, 0, -3.5], color: "#c084fc", showAt: 5 },
      { id: "note0", label: "path X→0 ids", type: "note", pos: [10.5, 0, -7] },
      { id: "note1", label: "brute K⊕ each", type: "note", pos: [10.5, 0, -3.5], showAt: 1 },
      { id: "note2", label: "max: want ~K bit", type: "note", pos: [10.5, 0, 0], showAt: 3 },
      { id: "note3", label: "min: want =K bit", type: "note", pos: [10.5, 0, 3.5], showAt: 4 },
      { id: "note4", label: "n tries = n²", type: "note", pos: [-5, 0, 7], showAt: 6 },
      { id: "note5", label: "clone O(B) nodes", type: "note", pos: [4.5, 0, 7], showAt: 7 }
    ],
    edges: [
      { from: "g0", to: "cx", showAt: 1 },
      { from: "cx", to: "cy", showAt: 5 },
      { from: "tr", to: "b0", showAt: 2 },
      { from: "tr", to: "b1", showAt: 2 },
      { from: "b0", to: "b00", showAt: 2 },
      { from: "b0", to: "b01", showAt: 2 },
      { from: "b1", to: "b10", showAt: 2 },
      { from: "b00", to: "n001", showAt: 2 },
      { from: "b01", to: "n010", showAt: 2 },
      { from: "b01", to: "n011", showAt: 2 },
      { from: "b10", to: "n100", showAt: 2 },
      { from: "nr", to: "b0", showAt: 5, dashed: true },
      { from: "nr", to: "n1b", showAt: 5 },
      { from: "n1b", to: "ny", showAt: 5 },
      { from: "cx", to: "tr", showAt: 2, dashed: true },
      { from: "cy", to: "nr", showAt: 5, dashed: true },
      { from: "kbox", to: "tr", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "Query window is the path",
        text: "Tree rooted at Gotham (city 0). Query (X, K) uses only ids on X→root. Add hangs a new city under a parent. The window is a path, not a subtree.",
        highlight: ["g0", "cx", "kbox", "note0"],
        flows: [
          { from: "cx", to: "g0", color: "#60a5fa", label: "ids" }
        ]
      },
      {
        title: "Brute XOR is O(path)",
        text: "XOR K with every id on the path, keep min and max. On a chain of n cities that is O(n) per query. Store the path set in a binary trie instead.",
        highlight: ["g0", "cx", "kbox", "note1"],
        flows: [
          { from: "kbox", to: "cx", color: "#fb923c", label: "K⊕id" }
        ]
      },
      {
        title: "Binary trie of path ids",
        text: "Ids 001, 010, 011, 100 as MSB-first paths. Alphabet is {0,1}, so two children. X’s version root sees exactly the path set. K will walk this next.",
        highlight: ["tr", "b0", "b1", "n001", "n010", "n011", "n100", "cx"],
        flows: [
          { from: "cx", to: "tr", color: "#4ade80", label: "ids" }
        ]
      },
      {
        title: "Max XOR: prefer the opposite bit",
        text: "K=111. At the MSB prefer 0 (differs). Then prefer 0 again, landing toward 001. Last bit wants 0; 001 has 1, so fallback. Chosen x=001, 111⊕001=110. One walk of B bits.",
        highlight: ["kbox", "tr", "b0", "b00", "n001", "note2"],
        flows: [
          { from: "kbox", to: "tr", color: "#4ade80", label: "max" },
          { from: "tr", to: "b0", color: "#4ade80", label: "~1" },
          { from: "b00", to: "n001", color: "#4ade80", label: "001" }
        ]
      },
      {
        title: "Min XOR: prefer the same bit",
        text: "Same trie, opposite policy. K=111 prefers the 1-child first (100). Then match remaining bits if they exist; otherwise fallback. Min and max can be different leaves.",
        highlight: ["kbox", "tr", "b1", "b10", "n100", "note3"],
        flows: [
          { from: "kbox", to: "tr", color: "#60a5fa", label: "min" },
          { from: "tr", to: "b1", color: "#60a5fa", label: "=1" },
          { from: "b10", to: "n100", color: "#60a5fa", label: "100" }
        ]
      },
      {
        title: "Add Y: new id on the path",
        text: "Y is a child of X with id 101. Y’s path set is X’s set plus 101. A brand-new trie for Y would recopy 001, 010, 011, 100. Only the 1-spine needs to change.",
        highlight: ["cx", "cy", "nr", "n1b", "ny", "n100"],
        flows: [
          { from: "cx", to: "cy", color: "#c084fc", label: "parent" },
          { from: "cy", to: "nr", color: "#c084fc", label: "101" }
        ]
      },
      {
        title: "n private tries are n²",
        text: "If every city rebuilt a full trie of its path, n cities on a line cost Θ(n² B) nodes. GothamPD dies. The unused 0-side of a 1-insert is identical to the parent — do not copy it.",
        highlight: ["g0", "cx", "cy", "tr", "nr", "note4"],
        fail: ["note4"],
        flows: [
          { from: "tr", to: "nr", color: "#f87171", label: "full copy" }
        ]
      },
      {
        title: "Persist O(B); query still O(B)",
        text: "Y’s new root shares X’s 0-child pointer and clones the 1-path (1' → 101). Four new nodes if B=4, not a second tree. Query walks Y’s root with the same min/max greedy. Update O(B), memory O(n B).",
        highlight: ["nr", "b0", "n1b", "ny", "cy", "note5"],
        flows: [
          { from: "nr", to: "b0", color: "#60a5fa", label: "share" },
          { from: "nr", to: "n1b", color: "#c084fc", label: "clone" },
          { from: "n1b", to: "ny", color: "#c084fc", label: "101" }
        ]
      }
    ]
  }
});
