window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 74,
  title: "9.1 Knuth-Morris-Pratt KMP String Matching Algorithm",
  video: "https://www.youtube.com/watch?v=V5-7GzOfADQ",
  category: "Strings, Trees & Arrays",
  tagline: "Never slide i back: an LPS table turns naive O(mn) matching into O(n+m).",
  summary: "Find whether pattern P of length m occurs in text T of length n, and at which index. The naive matcher shifts P by one and rewinds the text pointer on every mismatch, so worst-case time is Θ(mn). KMP precomputes the longest proper prefix that is also a suffix (LPS / π table) of P, then scans T once: i only moves forward, and a mismatch falls j back to π[j]. Table build is Θ(m); search is Θ(n).",

  theory: [
    {
      heading: "The matching problem and the naive scan",
      body: "Given a text <code>T[1..n]</code> and a pattern <code>P[1..m]</code>, report whether P occurs inside T and the starting index if it does. The lecture first runs the <b>naive / basic</b> algorithm: align P at the left of T, compare characters, and on a mismatch shift P one cell right and restart. A tiny win: if the first letters already disagree, you just keep sliding. A bigger example (text with a run of matching prefixes, pattern like <code>ABABD</code>) shows the real cost: after matching several letters you fail, send <code>j</code> back to 1, and also pull <code>i</code> back in the text so those letters are compared again.",
      bullets: [
        "Simple case: pattern <code>DEF</code> found at text indices 4–6 after three one-step slides.",
        "Painful case: mismatch after a long prefix forces <code>i</code> to retreat.",
        "Naive never looks at the pattern's self-overlap; it always shifts by 1."
      ]
    },
    {
      heading: "Why naive is Θ(mn)",
      body: "Worst case: T is a long string of the same letter ending in a different letter, and P is the same shape (many <code>A</code>s then a <code>B</code>). Almost every alignment compares nearly all m pattern letters, and there are about n alignments. The lecture quotes the bound as <b>order of mn</b>. The wasted work is specifically <i>backtracking i</i>: characters of T that you already matched are re-read.",
      bullets: [
        "If |T|=n and |P|=m, naive is O(mn).",
        "KMP's design goal: i never moves left.",
        "To skip safely you must study P, not T."
      ]
    },
    {
      heading: "Prefix, suffix, and the LPS / π table",
      body: "A <b>prefix</b> of P is any left-aligned subset (<code>A</code>, <code>AB</code>, <code>ABC</code>, …). A <b>suffix</b> is any right-aligned subset. KMP asks: is some beginning of P appearing again later in P? Equivalently, what is the <b>longest prefix that is also a suffix</b> (LPS) of each prefix of P? That array is the <b>π table</b> (also called LPS or 'pie'). The lecture builds it by inspection rather than tracing the formal loop: wherever the opening block <code>AB</code> reappears you write 1,2; a longer copy <code>ABC</code> writes 1,2,3; unmatched cells stay 0. They also keep a sentinel index 0 in front of P so <code>j</code> can sit 'before' the first letter.",
      bullets: [
        "π[k] = length of the longest proper prefix of P[1..k] that is also a suffix of P[1..k].",
        "π[k]=0 means 'no useful overlap; restart near the front'.",
        "Building π reads P once: Θ(m)."
      ]
    },
    {
      heading: "Search: compare T[i] with P[j+1]",
      body: "Place <code>i</code> on the first text letter and <code>j</code> on the sentinel 0. Always compare <code>T[i]</code> with <code>P[j+1]</code> (the next pattern letter after wherever j sits). On a match, increment both. On a mismatch, <b>set j ← π[j]</b> — that is the prefix fallback — and try <code>P[j+1]</code> again. If j is already 0 and you still mismatch, you cannot fall further, so only <code>i</code> advances. Because a repeated prefix was already verified, you do not re-compare those letters; you continue from the leftover suffix. When j walks off the end of P, the pattern occurs ending at the current i.",
      bullets: [
        "Match: i++, j++.",
        "Mismatch and j>0: j = π[j] (i stays).",
        "Mismatch and j=0: i++.",
        "i is strictly non-decreasing."
      ]
    },
    {
      heading: "Worked fallback",
      body: "Suppose P starts <code>ABAB…</code> so π after the second <code>AB</code> is 2. You match <code>ABAB</code> in T, then fail on the next letter. Falling j to 2 means 'the last two text letters already equal the first two of P', so you only test the third pattern letter against the current i. If that still fails you fall to π[2]=0 and, if needed, slide i. The lecture's long trace is exactly this: several mismatches that move only j, then a successful run that consumes the whole pattern without ever rewinding T.",
      bullets: [
        "Fallback length = how much of the prefix you may skip.",
        "You never re-read T cells that i has left behind.",
        "Occurrence index is i − m + 1 (1-based) when j reaches m."
      ]
    },
    {
      heading: "Complexity",
      body: "One left-to-right pass over T is Θ(n) character inspections plus a constant number of π lookups per mismatch. Building π is Θ(m). Total <b>Θ(n+m)</b>. That is why KMP is one of the faster classical matchers: the extra table turns the mn re-scans into a linear sweep. (You still pay O(m) extra memory for π.)",
      bullets: [
        "Naive: Θ(mn) comparisons in the worst case.",
        "KMP preprocess: Θ(m).",
        "KMP search: Θ(n).",
        "Together: Θ(n+m)."
      ]
    }
  ],

  keyTerms: [
    { term: "Naive matcher", def: "Align P at every text offset, compare, and on mismatch shift P by one and rewind i. Worst case Θ(mn)." },
    { term: "Prefix", def: "A left-aligned substring of P; must start at P[1]." },
    { term: "Suffix", def: "A right-aligned substring of P; must end at the current end of the prefix being studied." },
    { term: "LPS / π table", def: "For each prefix of P, the length of the longest proper prefix that is also a suffix of that prefix." },
    { term: "Prefix fallback", def: "On mismatch, j ← π[j] so the known overlap is reused and i does not retreat." },
    { term: "Sentinel index 0", def: "A dummy cell before P so j can sit at 0; a mismatch there advances i." },
    { term: "No backtracking of i", def: "The text pointer only moves forward; that is the whole point of KMP versus naive." }
  ],

  tradeoffs: [
    { pro: "Search never rewinds the text, so you get a hard Θ(n+m) bound.", con: "You must allocate and fill an m-entry π table before you look at T." },
    { pro: "Repeating prefixes in P become free skips instead of re-comparisons.", con: "If P has no self-overlap, π is all zeros and you still compare almost like naive on mismatches (but i still never goes back)." },
    { pro: "The lecture's j+1 comparison plus sentinel 0 is easy to simulate by hand.", con: "Textbook KMP often 0-indexes π differently; mixing the two traces on an exam will shift every fallback." }
  ],

  interviewTips: [
    "State the naive bound Θ(mn) and name the defect: backtracking i after a mismatch.",
    "Define π[k] in one sentence: longest proper prefix of P[1..k] that is also a suffix.",
    "Search rule: compare T[i] with P[j+1]; match → both ++; mismatch → j=π[j], or i++ if j=0.",
    "Complexity is Θ(n) for the scan plus Θ(m) for the table — say n+m, not 'linear in n' only.",
    "If they give a worst-case string of repeated letters, explain why naive multiplies m by n and why KMP's π of 0,1,2,… lets j fall instead of i.",
    "Occurrence: when j hits m, the match ends at i; start index is i−m+1 (1-based)."
  ],

  scene: {
    nodes: [
      { id: "zt", label: "Text T", type: "zone", pos: [0, 0, -4.5], size: [22, 3.2] },
      { id: "t1", label: "A", type: "point", pos: [-10, 0, -4.5], color: "#60a5fa" },
      { id: "t2", label: "B", type: "point", pos: [-7, 0, -4.5], color: "#60a5fa" },
      { id: "t3", label: "A", type: "point", pos: [-4, 0, -4.5], color: "#60a5fa" },
      { id: "t4", label: "B", type: "point", pos: [-1, 0, -4.5], color: "#60a5fa" },
      { id: "t5", label: "A", type: "point", pos: [2, 0, -4.5], color: "#fb923c" },
      { id: "t6", label: "B", type: "point", pos: [5, 0, -4.5], color: "#4ade80" },
      { id: "t7", label: "D", type: "point", pos: [8, 0, -4.5], color: "#4ade80" },
      { id: "zp", label: "Pattern P", type: "zone", pos: [-1.5, 0, 0.5], size: [16, 3] },
      { id: "p0", label: "0", type: "cache", pos: [-8, 0, 0.5], color: "#64748b" },
      { id: "p1", label: "A", type: "server", pos: [-5, 0, 0.5] },
      { id: "p2", label: "B", type: "server", pos: [-2, 0, 0.5] },
      { id: "p3", label: "A", type: "server", pos: [1, 0, 0.5] },
      { id: "p4", label: "B", type: "server", pos: [4, 0, 0.5] },
      { id: "p5", label: "D", type: "server", pos: [7, 0, 0.5] },
      { id: "lps", label: "LPS  0 0 1 2 0", type: "note", pos: [-1.5, 3, 4], showAt: 1 },
      { id: "ptri", label: "i only moves right", type: "note", pos: [8, 3, -7.5], showAt: 0 },
      { id: "n0", label: "Naive: shift 1, rewind i", type: "note", pos: [-8, 3, 7], showAt: 0 },
      { id: "n1", label: "Mismatch: j <- pi[j]", type: "note", pos: [8, 3, 7], showAt: 3 },
      { id: "n2", label: "Skip repeated AB prefix", type: "note", pos: [0, 3, 7], showAt: 4 },
      { id: "n3", label: "Match; T[i] never rewound", type: "note", pos: [8, 3, 2], showAt: 5 },
      { id: "n4", label: "Time Theta(n+m)", type: "note", pos: [-8, 3, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "t1", to: "t2" },
      { from: "t2", to: "t3" },
      { from: "t3", to: "t4" },
      { from: "t4", to: "t5" },
      { from: "t5", to: "t6" },
      { from: "t6", to: "t7" },
      { from: "p0", to: "p1", label: "j=0" },
      { from: "p1", to: "p2" },
      { from: "p2", to: "p3" },
      { from: "p3", to: "p4" },
      { from: "p4", to: "p5" },
      { from: "p1", to: "p3", label: "prefix AB", showAt: 1, dashed: true },
      { from: "p3", to: "p1", label: "LPS=2", showAt: 1, dashed: true },
      { from: "t5", to: "p3", label: "fallback", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "Naive matcher rewinds i",
        text: "Align P under T and compare. On a mismatch the basic algorithm sends j back to the first letter and also pulls i back in the text, so those cells are read again. Worst case that product is Θ(mn).",
        highlight: ["zt", "zp", "t1", "p1", "n0", "ptri"],
        hide: ["lps", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "p1", to: "t1", color: "#f87171", label: "mismatch" }
        ]
      },
      {
        title: "Build the LPS / π table",
        text: "Study only P. Prefix AB reappears as the next AB, so π writes 0,0,1,2, then 0 under D (D does not continue the prefix). A sentinel 0 sits in front so j can rest before A.",
        highlight: ["p0", "p1", "p2", "p3", "p4", "p5", "lps"],
        hide: ["n0", "n1", "n2", "n3", "n4", "ptri"],
        flows: [
          { from: "p1", to: "p3", color: "#c084fc", label: "same prefix" }
        ]
      },
      {
        title: "Compare T[i] with P[j+1]",
        text: "i starts on the first A, j on the sentinel. Each match advances both pointers. After ABAB, j sits on the second B and the next test is P[j+1]=D against the next text letter.",
        highlight: ["t1", "t2", "t3", "t4", "p1", "p2", "p3", "p4", "ptri"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "p1", to: "t1", color: "#4ade80", label: "A" },
          { from: "p4", to: "t4", color: "#4ade80", label: "B" }
        ]
      },
      {
        title: "Prefix fallback: j ← π[j]",
        text: "T[i] is A, not D. Mismatch. Do not move i left. Set j to π[j]=2, the recorded overlap AB. Only j walks toward the front of P.",
        highlight: ["t5", "p5", "p3", "p0", "n1", "lps"],
        fail: ["p5"],
        hide: ["n0", "n2", "n3", "n4", "ptri"],
        flows: [
          { from: "p5", to: "t5", color: "#f87171", label: "D≠A" },
          { from: "p4", to: "p2", color: "#fb923c", label: "j=2" }
        ]
      },
      {
        title: "Reuse the overlapping AB",
        text: "The last two matched text letters already equal P's prefix AB, so you skip re-comparing them. Next test is P[j+1]=A against the current i. That matches, then B, then D.",
        highlight: ["t5", "t6", "t7", "p3", "p4", "p5", "n2", "lps"],
        hide: ["n0", "n1", "n3", "n4", "ptri"],
        flows: [
          { from: "p3", to: "t5", color: "#60a5fa", label: "skip AB" }
        ]
      },
      {
        title: "Pattern found; i never went back",
        text: "j reaches the last D. P occurs ending at this i. Every text cell was inspected at most a constant number of times while i only marched right — the naive rewind is gone.",
        highlight: ["t3", "t4", "t5", "t6", "t7", "p1", "p5", "n3"],
        hide: ["n0", "n1", "n2", "n4", "ptri"],
        flows: [
          { from: "p5", to: "t7", color: "#4ade80", label: "hit" }
        ]
      },
      {
        title: "Cost is n plus m",
        text: "One pass over T is Θ(n). Filling π is Θ(m). KMP's total is Θ(n+m) versus naive Θ(mn). The table is the only extra memory.",
        highlight: ["zt", "zp", "lps", "n4"],
        hide: ["n0", "n1", "n2", "n3", "ptri"]
      }
    ]
  }
});
