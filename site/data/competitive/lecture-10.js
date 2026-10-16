window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 10,
  title: "What are Tries? - Coding",
  video: "https://www.youtube.com/watch?v=p4kfbNJzftQ",
  category: "Competitive Programming",
  tagline: "Code insert, query, delete, update — then watch the 26-pointer constant eat TLE.",
  summary: "A live Java trie: TrieNode holds a terminating count and children[26], Trie holds a blank root. Query walks with next(c) = children[c-'a'] and returns the count (0 on a null hop). Insert creates missing nodes then increments the terminal. Delete decrements but must refuse count 0 so it never goes negative. Update is delete(old)+insert(new). All ops are O(L), yet Chef and String only scored 30 because space is O(n L |Σ|) with a huge pointer constant.",

  theory: [
    {
      heading: "The objects you actually type",
      body: "The dictionary is still <code>PQRS, PPRT, PSST, QQRS, PQRS</code>, but this lecture is the class file. <code>TrieNode</code> has two fields: <code>int terminating</code> (how many keys <b>end</b> here) and <code>TrieNode[] next = new TrieNode[26]</code>. <code>Trie</code> has one field: a blank <code>root</code> allocated in the constructor. The root stores no letter. A helper <code>next(char c)</code> returns <code>next[c - 'a']</code>. That subtraction is not decoration: <code>'a'</code> is 97, so indexing the raw char throws <code>ArrayIndexOutOfBounds</code> at slot 97. The first compile in the video did exactly that.",
      bullets: [
        "Trie = one immutable root pointer.",
        "TrieNode = terminating count + 26 child slots.",
        "Every array access is children[c - 'a'], not children[c]."
      ]
    },
    {
      heading: "Query: walk, then read the counter",
      body: "<code>query(s)</code> starts at <code>root</code> and, for each character, hops <code>current = current.next(s[i])</code>. If <code>current</code> is null before the string is spent, return <b>0</b> — that prefix was never inserted. If the walk finishes, return <code>current.terminating</code>. After the five inserts that is <b>2</b> for PQRS, <b>1</b> for PPRT, <b>0</b> for ABC. Query does not care how many other keys share a prefix; it only follows this key's letters. Time is Θ(L).",
      bullets: [
        "Null hop ⇒ 0, even if a proper prefix of s exists.",
        "Landing with terminating=0 means 'letters exist as a prefix, this exact key does not'.",
        "Check the null <i>before</i> calling next on current, or you NPE."
      ]
    },
    {
      heading: "Insert: create on a null child, then ++terminating",
      body: "Same walk, different write. At each letter, if <code>current.next(c)</code> is null, allocate a fresh <code>TrieNode</code> into that slot, then step into it. After the last letter, <code>current.terminating++</code>. A duplicate PQRS allocates nothing and only bumps the terminal 1 → 2. Insert does not store the character on the node — the <i>index</i> of the pointer <i>is</i> the character. That is why the node only needs count + pointers.",
      bullets: [
        "Missing child ⇒ new TrieNode(), then step.",
        "Only the final node is incremented.",
        "Shared prefixes are reused automatically; no extra code."
      ]
    },
    {
      heading: "Delete without pruning, and the minus-one bug",
      body: "Delete copies the query walk. If a hop is null, the key is absent: throw (or no-op in a contest). If you land, <code>terminating--</code>. First bug in the video: a second delete of PSST walked a live path (the nodes were still there) and pushed the counter to <b>-1</b>. One later insert would then report count 0. Guard: if <code>terminating == 0</code> before the decrement, treat it as absent. He skips parent-pointer pruning — reclaiming a count-0 childless node needs a parent link and the child index, which bloats contest code. Leave the empty nodes; pay the extra pointers unless the ML forces you to prune.",
      bullets: [
        "Never decrement past 0.",
        "Nodes may outlive the key; query still returns 0 via the counter.",
        "Prune only when memory is the actual bottleneck."
      ]
    },
    {
      heading: "Update and the live checks",
      body: "<code>update(old, neu)</code> is <code>delete(old); insert(neu)</code>. After building the five-string trie: query PQRS=2, ABC=0, PPRT=1. Delete PSST once → query PSST=0. Delete PSST again → exception once the zero-guard is in. Then update QQRS → PSST: QQRS becomes 0, PSST becomes 2. That is the whole public API — about 70 lines.",
      bullets: [
        "PQRS twice, ABC absent, PPRT once: 2 / 0 / 1.",
        "QQRS rewritten to PSST: 0 and 2.",
        "Update is not a third walk; it reuses the two you already tested."
      ]
    },
    {
      heading: "O(L) time, O(n L |Σ|) space, and a 30-point TLE",
      body: "Insert, query, delete, update are all Θ(L) pointer hops. Q operations are Θ(Q L), which looks contest-perfect. Space is the tax: each node stores <b>26 pointers</b>, most null. Worst case (no shared prefixes) is Θ(n L) nodes, so memory is Θ(n L |Σ|) with a constant you must not ignore. CodeChef June 2015 <b>Chef and String</b> accepted a trie for 30 points and TLE'd the rest; the 100-point path used a different string tool (Z-function / suffix arrays). Binary tries (|Σ|=2) keep the same code and a tiny constant — that is when you actually ship a trie in a tight ML. For large alphabets, write the trie in a long contest to see if it fits, then switch.",
      bullets: [
        "Time: O(L) per op, O(Q L) for Q queries.",
        "Space: O(n L |Σ|), |Σ|=26 in this file, 2 in a bitwise trie.",
        "Chef and String: trie = 30 pts; need Z / suffix arrays for 100."
      ]
    }
  ],

  keyTerms: [
    { term: "TrieNode", def: "terminating count plus children[26]; the letter lives in the parent’s slot index, not in a char field." },
    { term: "Blank root", def: "Trie’s only field. Stores no character; its children are the first letters of keys." },
    { term: "next(c)", def: "children[c - 'a']. Forgetting the subtract indexes ASCII 97 and crashes." },
    { term: "Query", def: "Walk L hops; null → 0; else return terminating." },
    { term: "Insert", def: "Allocate on a null child, then terminating++ at the last node." },
    { term: "Delete guard", def: "Refuse terminating==0 so a second delete cannot go to -1." },
    { term: "Update", def: "delete(old) then insert(new). No third walk." },
    { term: "Pointer tax", def: "26 (or |Σ|) child slots per node; the reason O(n L) tries TLE on memory/time constants." }
  ],

  tradeoffs: [
    { pro: "Query/insert/delete are a 70-line walk of length L.", con: "26 null pointers on every node dominate RAM; Chef and String TLE’d on large tests." },
    { pro: "Skipping prune keeps delete as simple as query.", con: "Deleted keys leave zombie nodes; a tight ML may still need parent-pointer cleanup." },
    { pro: "Update is two tested functions — no extra bugs.", con: "A failed delete(old) (missing key) aborts before insert(new)." },
    { pro: "Binary trie reuses this exact code with |Σ|=2.", con: "Large alphabets want a hashmap of children or a suffix array / Z-function instead." }
  ],

  interviewTips: [
    "Subtract 'a' on every children[] access; the first run in the video died at index 97.",
    "Query returns the counter, not a boolean — duplicates (PQRS twice) are the point.",
    "Guard delete: if terminating is already 0, stop. Otherwise one extra delete writes -1.",
    "Do not prune in the first submit unless the ML is tight; parent pointers double the code.",
    "Quote O(L) per op and O(n L |Σ|) space. If |Σ|=26 and n L is large, sketch a binary trie or Z-function.",
    "Long contest: paste the trie. If large tests TLE, switch — Chef and String was 30 vs 100."
  ],

  scene: {
    nodes: [
      { id: "root", label: "root", type: "server", pos: [-1.5, 0, -7] },
      { id: "p", label: "P", type: "point", pos: [-4.5, 0, -3.5], color: "#4ade80" },
      { id: "q0", label: "Q", type: "point", pos: [3, 0, -3.5], color: "#c084fc" },
      { id: "pq", label: "Q", type: "point", pos: [-7.5, 0, 0], color: "#4ade80" },
      { id: "pp", label: "P", type: "point", pos: [-4.5, 0, 0], color: "#60a5fa" },
      { id: "ps", label: "S", type: "point", pos: [-1.5, 0, 0], color: "#fb923c" },
      { id: "qq", label: "Q", type: "point", pos: [3, 0, 0], color: "#c084fc" },
      { id: "pqr", label: "R", type: "point", pos: [-7.5, 0, 3.5], color: "#4ade80" },
      { id: "ppr", label: "R", type: "point", pos: [-4.5, 0, 3.5], color: "#60a5fa" },
      { id: "pss", label: "S", type: "point", pos: [-1.5, 0, 3.5], color: "#fb923c" },
      { id: "qqr", label: "R", type: "point", pos: [3, 0, 3.5], color: "#c084fc" },
      { id: "pqrs", label: "S=2", type: "point", pos: [-7.5, 0, 7], color: "#4ade80" },
      { id: "pprt", label: "T=1", type: "point", pos: [-4.5, 0, 7], color: "#60a5fa" },
      { id: "psst", label: "T=1", type: "point", pos: [-1.5, 0, 7], color: "#fb923c" },
      { id: "qqrs", label: "S=1", type: "point", pos: [3, 0, 7], color: "#c084fc" },
      { id: "opQ", label: "query", type: "service", pos: [8, 0, -6.5], showAt: 2 },
      { id: "opI", label: "insert", type: "worker", pos: [8, 0, -2], showAt: 3 },
      { id: "opD", label: "delete", type: "gateway", pos: [8, 0, 2], showAt: 4 },
      { id: "opU", label: "update", type: "lb", pos: [8, 0, 6.5], showAt: 5 },
      { id: "n0", label: "count + next[26]", type: "note", pos: [-10, 0, -7] },
      { id: "n1", label: "idx = c - 'a'", type: "note", pos: [-10, 0, -3.5], showAt: 1 },
      { id: "n2", label: "PQRS=2 ABC=0", type: "note", pos: [-10, 0, 0], showAt: 2 },
      { id: "n3", label: "null child → new", type: "note", pos: [-10, 0, 3.5], showAt: 3 },
      { id: "n4", label: "no decrement < 0", type: "note", pos: [-10, 0, 7], showAt: 4 },
      { id: "n5", label: "del old + ins new", type: "note", pos: [11.5, 0, 0], showAt: 5 },
      { id: "n6", label: "time O(L) / op", type: "note", pos: [11.5, 0, -4], showAt: 6 },
      { id: "n7", label: "space O(n L * 26)", type: "note", pos: [11.5, 0, 4], showAt: 7 }
    ],
    edges: [
      { from: "root", to: "p" },
      { from: "root", to: "q0" },
      { from: "p", to: "pq" },
      { from: "p", to: "pp" },
      { from: "p", to: "ps" },
      { from: "q0", to: "qq" },
      { from: "pq", to: "pqr" },
      { from: "pp", to: "ppr" },
      { from: "ps", to: "pss" },
      { from: "qq", to: "qqr" },
      { from: "pqr", to: "pqrs" },
      { from: "ppr", to: "pprt" },
      { from: "pss", to: "psst" },
      { from: "qqr", to: "qqrs" },
      { from: "opQ", to: "root", showAt: 2, dashed: true },
      { from: "opI", to: "root", showAt: 3, dashed: true },
      { from: "opD", to: "psst", showAt: 4, dashed: true },
      { from: "opU", to: "opD", showAt: 5, dashed: true },
      { from: "opU", to: "opI", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Node layout in code",
        text: "Trie holds a blank root. Each TrieNode is an int terminating plus TrieNode[26]. The letter is the slot index, not a field on the node. The tree on the left is already built from the five-string set.",
        highlight: ["root", "p", "q0", "n0"]
      },
      {
        title: "Index with c - 'a'",
        text: "next(c) must be children[c - 'a']. Raw char 'a' is ASCII 97, which is past the array. The first run threw ArrayIndexOutOfBounds at that slot. Fix every access, not just insert.",
        highlight: ["root", "p", "n1"],
        flows: [
          { from: "root", to: "p", color: "#fb923c", label: "P-97" }
        ]
      },
      {
        title: "Query walks, then reads count",
        text: "Start at root. Hop next(s[i]); null means return 0. After the last letter, return terminating. PQRS lands on S=2. ABC dies on a missing child and returns 0. PPRT returns 1.",
        highlight: ["opQ", "root", "p", "pq", "pqr", "pqrs", "n2"],
        flows: [
          { from: "opQ", to: "root", color: "#60a5fa", label: "PQRS" },
          { from: "root", to: "p", color: "#4ade80", label: "P" },
          { from: "p", to: "pq", color: "#4ade80", label: "Q" },
          { from: "pqr", to: "pqrs", color: "#4ade80", label: "2" }
        ]
      },
      {
        title: "Insert allocates on null",
        text: "Same walk. A missing child gets a new TrieNode in that slot, then current steps in. After the last letter, terminating++. A second PQRS allocates nothing and only bumps S from 1 to 2.",
        highlight: ["opI", "root", "p", "ps", "pss", "psst", "n3"],
        flows: [
          { from: "opI", to: "root", color: "#4ade80", label: "ins" },
          { from: "p", to: "ps", color: "#fb923c", label: "new?" }
        ]
      },
      {
        title: "Delete: decrement, never past 0",
        text: "Walk as in query. Null hop → key absent (throw in the video). On a hit, terminating--. A second delete of PSST still finds the nodes, so without a terminating==0 guard the counter becomes -1 and a later insert reports 0. He skips pruning; empty nodes stay.",
        highlight: ["opD", "ps", "pss", "psst", "n4"],
        fail: ["psst"],
        flows: [
          { from: "opD", to: "psst", color: "#f87171", label: "T--" }
        ]
      },
      {
        title: "Update = delete + insert",
        text: "update(old, new) deletes the obsolete key then inserts the replacement. QQRS → PSST: QQRS count becomes 0, PSST becomes 2. No third walk to maintain. If delete(old) fails, insert never runs.",
        highlight: ["opU", "opD", "opI", "qqrs", "psst", "n5"],
        flows: [
          { from: "opU", to: "opD", color: "#f87171", label: "QQRS" },
          { from: "opU", to: "opI", color: "#4ade80", label: "PSST" }
        ]
      },
      {
        title: "Time is O(L) per operation",
        text: "Every public method follows at most L child pointers. Q mixed queries cost O(Q L). That is why a trie looks like the right submit until the memory constant shows up.",
        highlight: ["opQ", "opI", "opD", "opU", "n6"],
        flows: [
          { from: "opQ", to: "root", color: "#60a5fa", label: "O(L)" }
        ]
      },
      {
        title: "26 pointers: Chef and String TLE",
        text: "Each node stores 26 pointers. Space is O(n L |Σ|), and the constant is real. Chef and String (June 2015) got 30 points with this trie and TLE on large tests. Binary trie (|Σ|=2) keeps the same walks; suffix arrays / Z-function won 100.",
        highlight: ["root", "p", "q0", "n7", "opQ"],
        flows: [
          { from: "root", to: "p", color: "#f87171", label: "×26" },
          { from: "root", to: "q0", color: "#f87171", label: "×26" }
        ]
      }
    ]
  }
});
