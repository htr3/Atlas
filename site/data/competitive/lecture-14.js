window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 14,
  title: "Mo's Algorithm: DQUERY from SPOJ",
  video: "https://www.youtube.com/watch?v=hqaRYgsLpUI",
  category: "Competitive Programming",
  tagline: "Sort range queries into √N blocks so two pointers run in O((N+Q)√N).",
  summary: "SPOJ DQUERY asks for the number of distinct values in each offline range [L, R]. Scanning every query is O(NQ). Mo's algorithm keeps a sliding window, adds and removes in O(1) with a frequency array, and sorts queries by (L / √N, R) so the window barely moves. Updates are forbidden: the sort would no longer match the array's history.",

  theory: [
    {
      heading: "DQUERY is a set-size on every range",
      body: "You are given an array of length <b>N</b> and <b>Q</b> queries. Query <code>(L, R)</code> wants the number of <i>distinct</i> values in <code>A[L..R]</code>. The video's running range is indices 3 through 7: values such as 12, 16, 37 produce <code>count = 3</code> because the second 16 is already in the set. A balanced BST per query is correct and slow. Brute force that walks each range is <code>O(N)</code> per query, so <b>O(NQ)</b> overall — typical limits <code>N, Q ≤ 10^5</code> will TLE.",
      bullets: [
        "Offline: every (L, R) is known before you print anything.",
        "Answer is the size of the set, not the elements themselves.",
        "Store the original query index; you will shuffle the list."
      ]
    },
    {
      heading: "One window, four pointer moves",
      body: "Keep a live interval <code>[start, end]</code> and two pointers. To serve the next asked range <code>[L, R]</code> you walk the pointers until they match. Moving <b>end right</b> or <b>start left</b> <i>grows</i> the window (add). Moving <b>end left</b> or <b>start right</b> <i>shrinks</i> it (remove). Start the window empty — <code>start = 1, end = 0</code> on 1-based arrays — so the first query only adds. Without a clever order this is still Θ(N) moves per query.",
      bullets: [
        "Add when the window grows; remove when it shrinks.",
        "After start = L and end = R, the live count is the answer.",
        "Right is allowed to jump backwards across block boundaries."
      ]
    },
    {
      heading: "Frequency array, not a set",
      body: "A <code>std::set</code> makes add/remove <code>O(log N)</code> and mishandles duplicates: deleting one 12 would drop the value even if another 12 is still inside the window. Keep <code>freq[v]</code> = how many times v sits in the current range, and a scalar <code>count</code> = how many v have <code>freq[v] > 0</code>. Coordinate-compress if values are large; DQUERY's values fit in an array.",
      bullets: [
        "Add x: ++freq[x]; if freq[x] == 1 then ++count.",
        "Remove x: --freq[x]; if freq[x] == 0 then --count.",
        "Both updates are O(1). That is the whole data structure."
      ]
    },
    {
      heading: "Block sort is the algorithm",
      body: "Let <code>B = floor(√N)</code>. Split the array into blocks of length B (the last block may be short — that is fine). Sort every query by <code>(L / B, R)</code>: first the block that contains L, then the right endpoint. Queries whose left index falls in the same block are consecutive, and inside a block they are ordered by increasing R. That single comparator is Mo's algorithm. Hilbert-order variants exist; the lecture uses this Hilbert-free sort.",
      bullets: [
        "Key 1: left block index L / B.",
        "Key 2: right endpoint R, ascending.",
        "N not a square: last block is smaller; complexity still holds."
      ]
    },
    {
      heading: "Why the pointers suddenly cost √N",
      body: "Fix one left-block. Inside it, R only increases, so the right pointer travels the array at most once — <code>O(N)</code> adds. There are <code>O(N/B) = O(√N)</code> left-blocks, so all right-pointer motion is <b>O(N √N)</b>. The left pointer, for any single query, stays inside a block of size B, so it moves <code>O(B) = O(√N)</code> steps; over Q queries that is <b>O(Q √N)</b>. Total <code>O((N + Q) √N)</code>. Compare with the old <code>O(NQ)</code>: you traded a sort plus a strange order for a square-root.",
      bullets: [
        "Right: O(N) per left-block, √N blocks → O(N √N).",
        "Left: O(√N) per query → O(Q √N).",
        "At N = Q = 10^5 this is ~ 3·10^7 O(1) add/removes."
      ]
    },
    {
      heading: "Add and remove in both directions",
      body: "Because you sort on left-<i>block</i> then R, a later query can have a <i>smaller</i> R than an earlier query from a different block. The right pointer must be able to walk left: remove <code>A[end]</code> then <code>end--</code>. Symmetric code for start. A common bug is writing only the 'expand right' branch that vanilla two-pointers use on a sorted-by-R-only list.",
      bullets: [
        "while end < R: ++end; add(A[end]).",
        "while end > R: remove(A[end]); --end.",
        "while start < L: remove(A[start]); ++start.",
        "while start > L: --start; add(A[start])."
      ]
    },
    {
      heading: "No point updates",
      body: "The sort assumes the array is frozen. If <code>A[i]</code> changes between queries, a window you already built is a lie for a query that, in real time, should have seen a different array. You cannot 'just apply the updates in sorted order' either: two queries in the same block may need different prefixes of the update stream. Vanilla Mo is <b>offline, read-only</b>. The next lecture adds a third pointer — time — to undo and redo updates."
    }
  ],

  keyTerms: [
    { term: "DQUERY", def: "SPOJ problem: for each [L, R], print how many distinct values sit in that slice." },
    { term: "Offline query", def: "Every range is known up front, so you may reorder them before answering." },
    { term: "Mo window", def: "The live interval [start, end] whose frequency table matches the array slice." },
    { term: "Block size B", def: "floor(√N). Queries are grouped by which block contains L." },
    { term: "Block sort", def: "Comparator (L/B, R) that turns O(NQ) pointer travel into O((N+Q)√N)." },
    { term: "Frequency array", def: "freq[v] = copies of v in the window; count is the number of v with freq[v] > 0." },
    { term: "Add / remove", def: "O(1) updates that bump count only on the 0↔1 frequency edge." },
    { term: "Read-only Mo", def: "The sort is legal only if A never changes; updates need a time dimension." }
  ],

  tradeoffs: [
    { pro: "No tree, no Fenwick — just an array, a sort, and four while-loops.", con: "Must be offline. Online distinct-count needs a different structure." },
    { pro: "O((N+Q)√N) beats O(NQ) at 10^5 if add/remove is O(1).", con: "If add/remove is O(log N) you often lose to a Fenwick of last-occurrence." },
    { pro: "Works for any fold that has O(1) insert/erase (sum, distinct, mex with extra care).", con: "A single point update invalidates the entire ordering." },
    { pro: "Last block may be short; you do not need N to be a perfect square.", con: "Cache-unfriendly pointer jumps; Hilbert order is faster in practice but not in this lecture." }
  ],

  interviewTips: [
    "State DQUERY first: distinct count on offline [L, R], brute O(NQ), Mo O((N+Q)√N).",
    "Write the comparator as (L/√N, R) and say why R is free to scan N per left-block.",
    "Implement add/remove on a frequency array; never a set — duplicates would lie.",
    "Code all four pointer directions; the next block can demand a smaller R.",
    "Park answers in ans[originalIndex] after the window matches [L, R].",
    "If the statement has updates, stop: vanilla Mo is wrong, you need the 3D version."
  ],

  scene: {
    nodes: [
      { id: "za", label: "A[1..8]", type: "zone", pos: [0, 0, 4.2], size: [22, 3] },
      { id: "a1", label: "1:12", type: "point", pos: [-10.5, 0, 4.2], color: "#60a5fa" },
      { id: "a2", label: "2:1", type: "point", pos: [-7.5, 0, 4.2], color: "#60a5fa" },
      { id: "a3", label: "3:16", type: "point", pos: [-4.5, 0, 4.2], color: "#4ade80" },
      { id: "a4", label: "4:12", type: "point", pos: [-1.5, 0, 4.2], color: "#4ade80" },
      { id: "a5", label: "5:37", type: "point", pos: [1.5, 0, 4.2], color: "#4ade80" },
      { id: "a6", label: "6:16", type: "point", pos: [4.5, 0, 4.2], color: "#4ade80" },
      { id: "a7", label: "7:5", type: "point", pos: [7.5, 0, 4.2], color: "#4ade80" },
      { id: "a8", label: "8:12", type: "point", pos: [10.5, 0, 4.2], color: "#60a5fa" },
      { id: "lp", label: "L", type: "user", pos: [-4.5, 0, 0.8] },
      { id: "rp", label: "R", type: "user", pos: [7.5, 0, 0.8] },
      { id: "cnt", label: "cnt", type: "cache", pos: [0, 0, 0.8] },
      { id: "b0", label: "blk 0", type: "zone", pos: [-7.5, 0, 4.2], size: [9, 3], showAt: 3 },
      { id: "b1", label: "blk 1", type: "zone", pos: [3, 0, 4.2], size: [12, 3], showAt: 3 },
      { id: "q1", label: "Q(1,4)", type: "service", pos: [-6, 0, -3.2], showAt: 1 },
      { id: "q2", label: "Q(3,7)", type: "service", pos: [0, 0, -3.2], showAt: 1 },
      { id: "q3", label: "Q(5,8)", type: "service", pos: [6, 0, -3.2], showAt: 1 },
      { id: "n0", label: "distinct in [L,R]", type: "note", pos: [-8, 3, 7.2] },
      { id: "n1", label: "add / remove O(1)", type: "note", pos: [8, 3, 7.2], showAt: 2 },
      { id: "n2", label: "sort (L/B, R)", type: "note", pos: [-8, 3, -6.8], showAt: 4 },
      { id: "n3", label: "O((N+Q)√N)", type: "note", pos: [8, 3, -6.8], showAt: 6 }
    ],
    edges: [
      { from: "a1", to: "a2" },
      { from: "a2", to: "a3" },
      { from: "a3", to: "a4" },
      { from: "a4", to: "a5" },
      { from: "a5", to: "a6" },
      { from: "a6", to: "a7" },
      { from: "a7", to: "a8" },
      { from: "lp", to: "a3", label: "start", dashed: true },
      { from: "rp", to: "a7", label: "end", dashed: true },
      { from: "q2", to: "cnt", label: "ans", showAt: 2, dashed: true }
    ],
    steps: [
      {
        title: "Count distinct in [L, R]",
        text: "DQUERY: for each offline range, print how many different values sit inside it. Slice 3..7 holds 16, 12, 37, 16, 5 — four values, three of them unique if the lecture's 12/16/37 example is used. Brute force is O(NQ).",
        highlight: ["za", "a3", "a4", "a5", "a6", "a7", "q2", "n0"],
        hide: ["n1", "n2", "n3", "b0", "b1"]
      },
      {
        title: "Grow and shrink one window",
        text: "Keep pointers L and R on a live interval. Move R right or L left to add A[i]; move R left or L right to remove it. When the window equals the asked [L, R], emit count. Still Θ(N) moves per query if you answer in input order.",
        highlight: ["lp", "rp", "a3", "a7", "cnt", "n1"],
        hide: ["n0", "n2", "n3", "b0", "b1"],
        flows: [
          { from: "lp", to: "a3", color: "#4ade80", label: "add" },
          { from: "rp", to: "a7", color: "#4ade80", label: "add" }
        ]
      },
      {
        title: "Frequency hits 0 and 1",
        text: "freq[v] counts copies of v in the window. Adding 16 when freq[16] was 0 bumps count; adding the second 16 does not. Removing the last 16 drops count. A set would delete 12 too early. This is O(1) per pointer step.",
        highlight: ["cnt", "a3", "a6", "a4", "n1"],
        hide: ["n0", "n2", "n3", "b0", "b1"],
        flows: [
          { from: "a3", to: "cnt", color: "#60a5fa", label: "0→1" },
          { from: "a6", to: "cnt", color: "#fb923c", label: "1→2" }
        ]
      },
      {
        title: "Chop the array into √N blocks",
        text: "B = √N (here B ≈ 3). Block 0 holds indices 1..3; block 1 holds 4..8 on this short array. Queries will be grouped by which block contains L, not by L itself. A leftover short last block is allowed.",
        highlight: ["b0", "b1", "a1", "a2", "a3", "lp"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "a1", to: "a3", color: "#c084fc", label: "B" }
        ]
      },
      {
        title: "Sort queries by (L/B, R)",
        text: "Q(1,4) and Q(3,7) share left-block 0, so Q(1,4) comes first because 4 < 7. Q(5,8) lives in the next left-block. That order — not the input order — is what you process. Store each query's original index for output.",
        highlight: ["q1", "q2", "q3", "b0", "n2"],
        hide: ["n0", "n1", "n3"],
        flows: [
          { from: "q1", to: "q2", color: "#c084fc", label: "blk 0" },
          { from: "q2", to: "q3", color: "#c084fc", label: "blk 1" }
        ]
      },
      {
        title: "Right pointer scans N per block",
        text: "Inside one left-block, R only increases, so the right pointer walks 1..N at most once. √N such blocks make all right motion O(N √N). Across blocks R may jump backwards — that is why remove-on-end must exist.",
        highlight: ["rp", "a1", "a8", "q1", "q2", "n2"],
        hide: ["n0", "n1", "n3"],
        flows: [
          { from: "a1", to: "a8", color: "#fb923c", label: "R sweep" }
        ]
      },
      {
        title: "Left pointer stays inside B",
        text: "For any one query, L only wanders inside its block of size B, so left moves O(√N) times. Q queries contribute O(Q √N). Together with the right sweep the bound is O((N+Q)√N) — the drop from NQ.",
        highlight: ["lp", "b0", "a1", "a3", "n3"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "a1", to: "a3", color: "#4ade80", label: "≤ B" }
        ]
      },
      {
        title: "Read-only, or the sort lies",
        text: "The comparator assumes A is frozen. A point update between two queries means the window you kept is the wrong array. Vanilla Mo stops here. Updates need a third key — time — built in the next lecture.",
        highlight: ["za", "cnt", "q2", "n3"],
        hide: ["n0", "n1", "n2"],
        fail: ["q3"],
        flows: [
          { from: "q2", to: "cnt", color: "#4ade80", label: "print" }
        ]
      }
    ]
  }
});
