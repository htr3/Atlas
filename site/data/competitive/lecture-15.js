window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 15,
  title: "Mo's Algorithm With Updates",
  video: "https://www.youtube.com/watch?v=gUpfwVRXhNY",
  category: "Competitive Programming",
  tagline: "Treat time as a third pointer: block L and R, let updates run 0..Q.",
  summary: "Vanilla Mo shuffles range queries and then cannot replay point updates in the right order. Naive do/undo of every update per query is O(Q²). Give each query a timestamp (how many updates already happened), sort by (L/B, R/B, time), and move a third pointer that applies or rolls back updates. Optimal B is about n^{2/3}. Credit in the lecture: Nikhil Chandak and CodeChef Primitive Queries.",

  theory: [
    {
      heading: "Sorted ranges and a changing array cannot both be true",
      body: "Mo's two-key sort answers range queries as if A were constant. Mix in point updates and that fiction dies. The lecture's N = 8, B = 3 example sorts ranges <code>(2,7)</code>, <code>(1,8)</code>, <code>(6,6)</code> because left-blocks of 1 and 2 match and 7 < 8. Two updates sit <i>between</i> those queries in real time: the first range should see them, the second should not. After you have applied the updates for <code>(2,7)</code> you must <b>undo</b> them before <code>(1,8)</code>, then <b>redo</b> them for <code>(6,6)</code>.",
      bullets: [
        "Prerequisite: vanilla Mo (block on L, sort by R).",
        "A query's truth depends on which prefix of the update list has fired.",
        "CodeChef Feb challenge problem Primitive Queries is the named target."
      ]
    },
    {
      heading: "Naive replay is Q²",
      body: "If you fully apply, or fully roll back, every update that a query needs, the worst case is (Q/2) range queries times (Q/2) updates: <b>O(Q²)</b>. No contest with Q ~ 10^5 will take that. The bug is not the undo — undo is necessary — it is giving every query a full scan of the update tape.",
      bullets: [
        "Do A[2]=12 and A[1]=−1 for the first sorted range.",
        "Undo both before answering a range that was asked earlier in time.",
        "Redo both for the next range. Multiply that pattern by Q."
      ]
    },
    {
      heading: "Mo is a game of dimensions",
      body: "A range query has more coordinates than L and R. Where is the left pointer, where is the right pointer, and <i>how many updates have already been performed</i>? That last number is <b>time</b> (a timestamp). Universe leftover space and other jokes aside, three numbers suffice: left, right, time. Vanilla Mo blocked L and let R run freely increasing inside a block. With updates you block <b>both</b> L and R, and you let <b>time</b> be the coordinate that is allowed to sweep 0..U in one direction per (left-block, right-block) pair.",
      bullets: [
        "Dimension 1: L, locked into a block of size B.",
        "Dimension 2: R, locked into a block of size B.",
        "Dimension 3: time = updates already seen, free to grow (and later shrink across pairs)."
      ]
    },
    {
      heading: "Sort (L/B, R/B, t) and keep updates in a side list",
      body: "Each range query stores <code>t</code> = how many point updates occurred before it in the input. Updates themselves are <i>not</i> sorted into the query list; they live in a tape <code>U[1..u]</code>. After the sort, two queries with the same left-block and right-block appear in increasing t, so the time pointer only moves forward inside that pair of blocks. Example from the lecture: <code>(10,20,t=0)</code> before <code>(10,19,t=2)</code> because the blocks match and 0 < 2 — the opposite of vanilla Mo, which would have served R=19 first.",
      bullets: [
        "Comparator: L/B, then R/B, then timestamp t.",
        "Updates stay in chronological order on a separate array.",
        "Inside a fixed (left-block, right-block), t is monotone."
      ]
    },
    {
      heading: "The extra while-loops: do and undo",
      body: "Let <code>cur</code> be how many updates the window currently reflects. For a query with timestamp t: while <code>cur < t</code> apply <code>U[cur+1]</code> and increment; while <code>cur > t</code> roll back <code>U[cur]</code> and decrement. Then run the ordinary L/R walks. Every update stores <code>(index, newValue, oldValue)</code>. Undo writes oldValue back. If the updated index lies inside the current <code>[L, R]</code>, treat it as remove(old) then add(new) (or the reverse on undo) so the frequency table — or whatever fold you maintain — stays honest. The lecture's fold is 'how many values have frequency ≥ 3'.",
      bullets: [
        "Always snapshot the previous A[i] before overwriting.",
        "A later update of the same index chains: oldValue is whatever A[i] is now.",
        "Updates outside [L, R] still change A, but they do not touch freq."
      ]
    },
    {
      heading: "Worked tape: five updates, then four rollbacks",
      body: "N = 8, B = 3. Sorted order in the video: query <code>(1,4)</code> with t=5, then <code>(2,7)</code> with t=1, then <code>(4,6)</code> with t=0. Start at cur=0. The first query forces five writes (A[6], A[1], A[4], A[0], A[3] in the lecture's 0-based sketch), each remembered with its previous value. Then L/R walk onto 1..4 and count hits frequency 3. Next query wants t=1, so undo four updates — and because some of those indices sit in the live window, freq of 1 falls off 3 and the answer becomes 0. Last query undoes the remaining update (t=0) and the ordinary Mo pointers slide to 4..6.",
      bullets: [
        "Time pointer first, then L, then R — or you mix a stale A into freq.",
        "Undo is symmetric with apply; both check 'is index inside [L,R]?'",
        "Answers are stored by original input index, same as vanilla Mo."
      ]
    },
    {
      heading: "Complexity and the cube-root block",
      body: "Left pointer moves O(B) per query → <code>O(QB)</code>. Right pointer: O(B) per query plus a full N-scan once per left-block → the N/B term is dominated later. Time, for every pair of (left-block, right-block), may sweep 0..U once. There are <code>(N/B)²</code> such pairs, U ≤ Q, so time costs <code>O(Q N² / B²)</code>. Keep <code>O(QB + Q N² / B²)</code>. Differentiate B + N²/B², set the derivative <code>1 − 2N²/B³ = 0</code>, get <code>B³ = 2N²</code>, so <b>B ≈ N^{2/3}</b> (the 2^{1/3} is optional in contest code). Then the number of blocks is about <code>N^{1/3}</code>. Plug in: both terms become about <code>Q N^{2/3}</code>. That replaces Q² with something 10^5-legal when add/undo is O(1).",
      bullets: [
        "Do not reuse B = √N; that choice is for two dimensions, not three.",
        "Terms N and N²/B drop out against QB or Q N²/B² at the extrema of B.",
        "This is an advanced trick; constant factors matter — keep add/undo tiny."
      ]
    }
  ],

  keyTerms: [
    { term: "Timestamp t", def: "For a range query, how many point updates occurred before it in the original input." },
    { term: "Update tape", def: "Chronological list of (index, new, old) used to apply or undo a single write." },
    { term: "Three-key sort", def: "Order range queries by (L/B, R/B, t) so time is monotone inside a block pair." },
    { term: "Time pointer", def: "Integer cur: apply U[cur+1] when cur < t, undo U[cur] when cur > t." },
    { term: "In-range update", def: "If the written index sits in the live [L, R], freq must remove the old value and add the new one." },
    { term: "Block size N^{2/3}", def: "Minimizer of QB + Q N²/B² obtained by d/dB (B + N²/B²) = 0." },
    { term: "Undo", def: "Restore A[i] to the stored old value and reverse the freq change if i is inside the window." },
    { term: "Primitive Queries", def: "CodeChef problem that motivated the lecture; fold is a frequency-threshold count." }
  ],

  tradeoffs: [
    { pro: "Handles offline range queries plus point updates without a heavy tree.", con: "Code is easy to get wrong: time must move before L/R, and in-range writes need a freq patch." },
    { pro: "O(Q N^{2/3}) with O(1) add/undo beats O(Q²) replay.", con: "Worse than vanilla Mo; if there are no updates, do not pay the extra dimension." },
    { pro: "Any fold with O(1) add/remove/undo (sum, distinct, freq ≥ K) ports over.", con: "Online queries, or updates that are not point writes, still need another structure." },
    { pro: "B = N^{2/3} is a closed-form optimum, not a guess.", con: "Wrong B (still using √N) can TLE even when the idea is right." }
  ],

  interviewTips: [
    "Name the three keys out loud: left block, right block, timestamp — time is the free axis.",
    "Quote O(QB + Q N²/B²) and B = N^{2/3}; do not say sqrt unless the problem has no updates.",
    "Store oldValue on every update so undo is O(1) and chains when the same index is written twice.",
    "If index is inside [L, R], patch freq on both apply and undo; silent writes outside the window.",
    "Sort only the range queries; keep the update tape in input order.",
    "Sanity-check with the lecture's N=8, B=3 story: t=5 then rollback to t=1 then t=0."
  ],

  scene: {
    nodes: [
      { id: "za", label: "A[0..7]", type: "zone", pos: [0, 0, 5.2], size: [22, 2.8] },
      { id: "a0", label: "A0", type: "point", pos: [-10.5, 0, 5.2], color: "#60a5fa" },
      { id: "a1", label: "A1", type: "point", pos: [-7.5, 0, 5.2], color: "#60a5fa" },
      { id: "a2", label: "A2", type: "point", pos: [-4.5, 0, 5.2], color: "#60a5fa" },
      { id: "a3", label: "A3", type: "point", pos: [-1.5, 0, 5.2], color: "#60a5fa" },
      { id: "a4", label: "A4", type: "point", pos: [1.5, 0, 5.2], color: "#60a5fa" },
      { id: "a5", label: "A5", type: "point", pos: [4.5, 0, 5.2], color: "#60a5fa" },
      { id: "a6", label: "A6", type: "point", pos: [7.5, 0, 5.2], color: "#60a5fa" },
      { id: "a7", label: "A7", type: "point", pos: [10.5, 0, 5.2], color: "#60a5fa" },
      { id: "lb", label: "L-blk", type: "zone", pos: [-6, 0, 5.2], size: [10, 2.8], showAt: 3 },
      { id: "rb", label: "R-blk", type: "zone", pos: [6, 0, 5.2], size: [10, 2.8], showAt: 3 },
      { id: "u1", label: "U1", type: "worker", pos: [-4.5, 0, 1.6], showAt: 1 },
      { id: "u2", label: "U2", type: "worker", pos: [4.5, 0, 1.6], showAt: 1 },
      { id: "q1", label: "(2,7) t=2", type: "service", pos: [-6, 0, -1.6], showAt: 1 },
      { id: "q2", label: "(1,8) t=0", type: "service", pos: [0, 0, -1.6], showAt: 1 },
      { id: "q3", label: "(6,6) t=2", type: "service", pos: [6, 0, -1.6], showAt: 1 },
      { id: "t0", label: "t=0", type: "point", pos: [-9, 0, -5.2], color: "#c084fc", showAt: 2 },
      { id: "t1", label: "t=1", type: "point", pos: [-3, 0, -5.2], color: "#c084fc", showAt: 2 },
      { id: "t2", label: "t=2", type: "point", pos: [3, 0, -5.2], color: "#c084fc", showAt: 2 },
      { id: "t3", label: "t=5", type: "point", pos: [9, 0, -5.2], color: "#c084fc", showAt: 2 },
      { id: "n0", label: "updates break Mo", type: "note", pos: [-11, 3, 7.8] },
      { id: "n1", label: "naive O(Q^2)", type: "note", pos: [11, 3, 7.8], showAt: 2 },
      { id: "n2", label: "sort L/B,R/B,t", type: "note", pos: [-8, 3, -7.6], showAt: 4 },
      { id: "n3", label: "B = N^(2/3)", type: "note", pos: [8, 3, -7.6], showAt: 7 }
    ],
    edges: [
      { from: "a0", to: "a1" },
      { from: "a1", to: "a2" },
      { from: "a2", to: "a3" },
      { from: "a3", to: "a4" },
      { from: "a4", to: "a5" },
      { from: "a5", to: "a6" },
      { from: "a6", to: "a7" },
      { from: "t0", to: "t1", label: "time", showAt: 2 },
      { from: "t1", to: "t2", showAt: 2 },
      { from: "t2", to: "t3", showAt: 2 },
      { from: "u1", to: "a2", label: "write", showAt: 1, dashed: true },
      { from: "u2", to: "a6", label: "write", showAt: 1, dashed: true }
    ],
    steps: [
      {
        title: "Point writes vs a sorted window",
        text: "N=8, B=3. Vanilla Mo would answer (2,7), then (1,8), then (6,6). Two updates sit on that timeline. After the sort, the first range should already include them and the second should not. The 2D comparator has no slot for 'how new is A?'.",
        highlight: ["za", "q1", "q2", "q3", "u1", "u2", "n0"],
        hide: ["n1", "n2", "n3", "t0", "t1", "t2", "t3", "lb", "rb"]
      },
      {
        title: "Do, undo, redo — Q²",
        text: "Apply both writes before (2,7). Undo both before (1,8), which was asked when A was still original. Redo both for (6,6). Half the ops times half the ops is Q². Legal, and dead at 10^5.",
        highlight: ["u1", "u2", "q1", "q2", "q3", "n1"],
        hide: ["n0", "n2", "n3", "lb", "rb"],
        fail: ["q2"],
        flows: [
          { from: "u1", to: "q1", color: "#4ade80", label: "do" },
          { from: "q1", to: "q2", color: "#f87171", label: "undo" },
          { from: "q2", to: "q3", color: "#fb923c", label: "redo" }
        ]
      },
      {
        title: "Three coordinates",
        text: "A query is (L, R, t). Block L into width B, block R into width B, and let t — the number of updates already performed — be the axis that may run the full tape. Same trick as vanilla Mo: freeze every dimension but one.",
        highlight: ["lb", "rb", "t0", "t3", "q1"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "t0", to: "t3", color: "#c084fc", label: "free t" }
        ]
      },
      {
        title: "Sort (L/B, R/B, t)",
        text: "Updates stay on a side tape. Range queries shuffle. Same left and right blocks? Smaller t first, so time only increases inside that pair. (10,20,t=0) beats (10,19,t=2) — vanilla Mo would have done 19 first.",
        highlight: ["q1", "q2", "q3", "n2", "t0", "t2"],
        hide: ["n0", "n1", "n3"],
        flows: [
          { from: "q2", to: "q1", color: "#c084fc", label: "by t" }
        ]
      },
      {
        title: "Apply until cur = t",
        text: "The first sorted query in the long example wants t=5. cur starts at 0, so five writes fire and each stores oldValue (A[6] was 1, now 2, and so on). Then ordinary L/R walk onto that range. Frequency-≥3 becomes 1.",
        highlight: ["t3", "u1", "u2", "a1", "a6", "q1"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "t0", to: "t3", color: "#4ade80", label: "cur++" },
          { from: "u1", to: "a1", color: "#fb923c", label: "set" }
        ]
      },
      {
        title: "Undo writes that this query must not see",
        text: "Next query wants t=1. Roll back four updates. If the index is inside the live window, decrement freq of the new value and increment freq of the old one. A[3] rolling from 1 back to 2 knocks freq[1] off 3; the answer drops to 0.",
        highlight: ["t1", "a3", "q1", "q2"],
        hide: ["n0", "n1", "n2", "n3"],
        fail: ["a3"],
        flows: [
          { from: "t3", to: "t1", color: "#f87171", label: "cur--" },
          { from: "a3", to: "q2", color: "#f87171", label: "undo" }
        ]
      },
      {
        title: "Then the usual L and R walk",
        text: "After time matches, shrink L and grow R exactly as in vanilla Mo. The last query undoes the leftover update (t=0) and slides onto [4,6]. Writes outside the window change A but leave freq alone.",
        highlight: ["a4", "a6", "q3", "t0"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "a2", to: "a4", color: "#60a5fa", label: "L" },
          { from: "a4", to: "a6", color: "#60a5fa", label: "R" }
        ]
      },
      {
        title: "B = N^{2/3} balances the terms",
        text: "Cost is QB for L/R jitter plus Q N²/B² for time sweeps over (N/B)² block pairs. d/dB of (B + N²/B²) = 0 gives B³ = 2N², so B ~ N^{2/3} and about N^{1/3} blocks. Both terms land near Q N^{2/3}. Keep B = √N only when there is no time axis.",
        highlight: ["lb", "rb", "t0", "t3", "n3"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "n2", to: "n3", color: "#c084fc", label: "opt B" }
        ]
      }
    ]
  }
});
