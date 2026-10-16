window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "competitive",
  id: 4,
  title: "What is Bitwise Manipulation?",
  video: "https://www.youtube.com/watch?v=JqxgC5zcdEw",
  category: "Competitive Programming",
  tagline: "Pack cells into bits, OR across word splits, then test/set/kill masks.",
  summary: "Bitwise packing turns a 5×4 board of 0/1/2 cells from 32-bit ints into 2 bits each — a 16× space cut that also speeds tight AI loops. Flatten with index = row×width + col, choose block size B so 2^B−1 ≥ max, then shift-OR values into a word. When one integer is too small, spill across an array of words with OR, never plus. The same masks test, set, clear, and zero a range.",

  theory: [
    {
      heading: "Where bits show up",
      body: "Bitwise tricks appear in contests in odd corners: approximation tasks (the lecture points at a CodeChef NP-hard / NP-complete style problem), and especially <b>AI / game contests</b> (HackerEarth and similar) where the whole board is the state you copy a million times. Space is not just RAM; allocating and scanning a fat matrix is a constant-factor tax. A 16× thinner state is often the difference between searching another ply and timing out.",
      bullets: [
        "Unexpected in classic algorithm problems; expected in packed game state.",
        "Constant factors matter when the inner loop is the whole contest.",
        "Smaller state → more copies in cache → deeper search."
      ]
    },
    {
      heading: "Two bits, not thirty-two",
      body: "Take a <b>5×4 board</b>. Each cell is claimed by nobody (0), player 1 (1), or player 2 (2) — three values. A 32-bit int per cell wastes 30 bits. Two bits already encode 0, 1, 2, 3; you simply never store 3. Space drops by <b>16×</b> (more than 90%). The lecture's line is blunt: whatever space S you had is now S/16, and every scan of the matrix inherits that constant.",
      bullets: [
        "Domain {0,1,2} ⇒ 2 bits. The unused pattern 11 is padding, not data.",
        "32 / 2 = 16, so S becomes S/16.",
        "You pay this on every allocation and every full-board walk."
      ]
    },
    {
      heading: "Flatten, then pack",
      body: "A 2D matrix is awkward to shift. First turn it into a 1D array with <code>index = row × Lrow + col</code>. The lecture's slab picture: row 0 is laid down, then row 1 is appended, and so on. Worked grid with <code>Lrow = 2</code>:<br><code>7 3</code><br><code>4 6</code><br>gives the stream <b>7, 3, 4, 6</b>. In binary that is 111, 11, 100, 110 — but a 32-bit int still stores each of those with ~29 leading zeros. Those zeros are the waste you are about to cut.",
      bullets: [
        "(0,0)→0, (0,1)→1, (1,0)→2, (1,1)→3.",
        "Row-major slabs: each row is a contiguous block in the 1D view.",
        "7,3,4,6 is the running example for the rest of the packing."
      ]
    },
    {
      heading: "Block size B from the maximum",
      body: "You need the smallest B such that <code>2^B − 1 ≥ max(A)</code> — B bits must be able to hold every cell, including the largest. Binary search on B is legal and O(log log MAX), but the lecture says it is almost never worth it: trying B = 1, 2, 3, … hits the cap in a handful of steps because 2^B grows so fast (at B = 32 you are near 2 billion). For max = 7: 2^1−1 = 1 (too small), 2^2−1 = 3 (too small), <b>2^3−1 = 7</b> (enough). Pad 3 to three bits: 011. Every element now occupies a <b>block of 3</b>.",
      bullets: [
        "B = bit length of the maximum, not of each value separately.",
        "Linear trial of B is fine; the function is exponential.",
        "3 used only 2 bits; you still store it in a 3-bit slot so blocks align."
      ]
    },
    {
      heading: "One integer: shift by i×B",
      body: "Start with <code>bin = 0</code>. For each index i, do <code>bin += A[i] &lt;&lt; (i × B)</code> (later the lecture switches this to OR). i = 0: 7 stays at bits 0–2 → <code>111</code>. i = 1: 3 << 3 parks at bits 3–5 → <code>011111</code>. i = 2: 4 << 6 → bits 6–8. i = 3: 6 << 9 → bits 9–11. Four numbers that would have cost 4×32 = 128 bits (or 96 if you count three 32-bit cells in the talk's running total) now sit in <b>12 bits</b>, which fits a 16-bit or 32-bit word. The left shift is there so you do not overwrite a block you already wrote.",
      bullets: [
        "Low index occupies the low bits; later indices ride higher.",
        "12 bits vs four ints is the saving on this toy.",
        "A 10,000-element array will not fit in one long — that is the next section."
      ]
    },
    {
      heading: "An array of words",
      body: "If n×B exceeds 32 or 64, store an <b>array of words</b>. The lecture's theory machine uses <b>W = 4</b> bits per word so the overflow is visible. 12 bits need three such words. Word index is <code>(i×B) / W</code>; the shift inside that word is <code>(i×B) mod W</code>. <code>x += y</code> means x = x+y; it is only syntax. The important change is the <b>mod</b>: after skipping whole words, the remainder is how many bits to skip from the right of the current word.",
      bullets: [
        "idx = floor((i×B) / W), shift = (i×B) % W.",
        "Java int = 32, long = 64; the toy uses W = 4 to force splits.",
        "Three 4-bit words (12 bits) beat four 4-bit cells (16 bits) even in the toy."
      ]
    },
    {
      heading: "Overflow: OR, then spill with a right shift",
      body: "When <code>shift + B &gt; W</code>, the block does not fit. Two rules. (1) Use <b>OR</b>, not plus: plus wraps into sign bits / two's-complement garbage; OR drops bits that fall off the word. (2) Put the leftover in the <b>next</b> word. Bits already written in this word: <code>already = W − leftover</code>, or equivalently <code>already = B − (shift + B − W)</code>. Right-shift the original value by <code>already</code> to throw away what you stored, then OR the remnant into <code>words[idx+1]</code>. Worked: 7 fills word0 as <code>0111</code>; 3 shifted by 3 only keeps its low 1 in word0 (now <code>1111</code>) and the rest of 3 lands in word1. 4 straddles word1/word2 the same way; 6 finishes in word2. The four values are still recoverable as aligned 3-bit groups across the word boundaries.",
      bullets: [
        "If (i×B % W) + B &gt; W, the block crosses a word.",
        "OR excludes overflow; plus corrupts the word.",
        ">> already drops bits already placed, then OR into idx+1."
      ]
    },
    {
      heading: "Test, set, kill, clear a range",
      body: "A set of n people is a bitstring: 1 = alive, 0 = dead. To ask whether index i lives: AND with a mask that has only bit i set; nonzero means alive. To revive i: OR that same mask. To kill i: AND with the <b>negation</b> of the mask (bit i becomes 0, every other bit stays). To zero a block of length B starting after P trailing zeros: build <code>(1 &lt;&lt; B) − 1</code> (B ones), left-shift by P, <b>negate</b>, AND with the set. That is <code>2^B − 1</code> as a mask of ones — the same identity the lecture uses to carve a hole. MSB/LSB tricks are the same family; packing is what makes them pay off.",
      bullets: [
        "alive ⇔ (S &amp; (1&lt;&lt;i)) != 0",
        "set: S |= mask; kill: S &amp;= ~mask",
        "Range zero: AND with NOT of ((1&lt;&lt;B)−1)&lt;&lt;P"
      ]
    }
  ],

  keyTerms: [
    { term: "Block size B", def: "Bits reserved per cell; smallest B with 2^B−1 ≥ max(A)." },
    { term: "Row-major index", def: "index = row × Lrow + col, turning a matrix into a 1D stream." },
    { term: "Pack shift", def: "A[i] << (i×B) parks cell i in its B-bit slot of the word." },
    { term: "Word array", def: "Several W-bit integers when n×B does not fit in one register." },
    { term: "Word index / rem", def: "idx = (i×B)/W and shift = (i×B)%W locate a cell inside the array." },
    { term: "OR vs plus", def: "OR drops overflowing bits; plus wraps and destroys the packed field." },
    { term: "Spill", def: "When shift+B > W, right-shift the leftover into words[idx+1]." },
    { term: "Alive mask", def: "1<<i used with AND (test), OR (set), and AND-NOT (clear)." }
  ],

  tradeoffs: [
    { pro: "2 bits instead of 32 cuts board state by 16× and speeds every scan.", con: "You must remember the encoding; a stray 3 (bits 11) is a silent bug." },
    { pro: "One packed integer is a single register for tiny boards.", con: "n×B > 64 forces a word array and the overflow case." },
    { pro: "OR on overflow keeps binary fields intact.", con: "Using += looks shorter and is wrong the moment a block crosses a word." },
    { pro: "Bitset test/set/kill/range-clear are O(1) on a machine word.", con: "Debugging a packed layout is slower than printing an int matrix." }
  ],

  interviewTips: [
    "State the domain first: if a cell is 0/1/2, say '2 bits, 16× vs int' before writing shifts.",
    "Write index = r*W + c on the board, then B from 2^B−1 ≥ max — that is the whole packing API.",
    "If they ask 'why not binary search B?', say 2^B explodes so a linear probe is a few iterations.",
    "Never += into a packed word that can overflow; interviewers listen for OR and a spill to idx+1.",
    "For a bitset: test AND, set OR, clear AND-NOT, range via (2^B−1)<<P then NOT.",
    "Name a use: game-state copies in an AI contest, or any n-element subset DP mask."
  ],

  scene: {
    nodes: [
      { id: "m00", label: "7", type: "point", pos: [-10.5, 0, 6], color: "#fb923c" },
      { id: "m01", label: "3", type: "point", pos: [-7.5, 0, 6], color: "#60a5fa" },
      { id: "m10", label: "4", type: "point", pos: [-10.5, 0, 3], color: "#4ade80" },
      { id: "m11", label: "6", type: "point", pos: [-7.5, 0, 3], color: "#c084fc" },
      { id: "a0", label: "7", type: "point", pos: [-10.5, 0, -1], color: "#fb923c", showAt: 1 },
      { id: "a1", label: "3", type: "point", pos: [-7.5, 0, -1], color: "#60a5fa", showAt: 1 },
      { id: "a2", label: "4", type: "point", pos: [-4.5, 0, -1], color: "#4ade80", showAt: 1 },
      { id: "a3", label: "6", type: "point", pos: [-1.5, 0, -1], color: "#c084fc", showAt: 1 },
      { id: "b0", label: "111", type: "point", pos: [-10.5, 0, -5], color: "#fb923c", showAt: 3 },
      { id: "b1", label: "011", type: "point", pos: [-7.5, 0, -5], color: "#60a5fa", showAt: 3 },
      { id: "b2", label: "100", type: "point", pos: [-4.5, 0, -5], color: "#4ade80", showAt: 3 },
      { id: "b3", label: "110", type: "point", pos: [-1.5, 0, -5], color: "#c084fc", showAt: 3 },
      { id: "w0", label: "w0 1111", type: "server", pos: [3, 0, 5], showAt: 4 },
      { id: "w1", label: "w1", type: "server", pos: [6.5, 0, 5], showAt: 4 },
      { id: "w2", label: "w2", type: "server", pos: [10, 0, 5], showAt: 4 },
      { id: "p0", label: "1", type: "point", pos: [3, 0, -2], color: "#4ade80", showAt: 6 },
      { id: "p1", label: "0", type: "point", pos: [6, 0, -2], color: "#64748b", showAt: 6 },
      { id: "p2", label: "1", type: "point", pos: [9, 0, -2], color: "#4ade80", showAt: 6 },
      { id: "msk", label: "mask 1<<i", type: "cache", pos: [6, 0, -6], showAt: 6 },
      { id: "n0", label: "5x4 cell in {0,1,2}", type: "note", pos: [6, 0, 2] },
      { id: "n1", label: "2 bits, S/16", type: "note", pos: [10, 0, 2] },
      { id: "n2", label: "idx = r*L + c", type: "note", pos: [3, 0, 1], showAt: 1 },
      { id: "n3", label: "2^B-1 >= 7, B=3", type: "note", pos: [8, 0, -1], showAt: 2 },
      { id: "n4", label: "A[i] << i*B", type: "note", pos: [3, 0, -5], showAt: 3 },
      { id: "n5", label: "idx=(iB)/W  %W", type: "note", pos: [10, 0, -1], showAt: 4 },
      { id: "n6", label: "OR, spill >> already", type: "note", pos: [6.5, 0, 1], showAt: 5 },
      { id: "n7", label: "AND / OR / AND~", type: "note", pos: [10, 0, -6], showAt: 6 }
    ],
    edges: [
      { from: "m00", to: "m01" },
      { from: "m00", to: "m10" },
      { from: "m10", to: "m11" },
      { from: "m01", to: "m11" },
      { from: "m00", to: "a0", label: "flat", showAt: 1, dashed: true },
      { from: "m01", to: "a1", showAt: 1, dashed: true },
      { from: "m10", to: "a2", showAt: 1, dashed: true },
      { from: "m11", to: "a3", showAt: 1, dashed: true },
      { from: "a0", to: "b0", showAt: 3, dashed: true },
      { from: "a1", to: "b1", showAt: 3, dashed: true },
      { from: "a2", to: "b2", showAt: 3, dashed: true },
      { from: "a3", to: "b3", showAt: 3, dashed: true },
      { from: "b0", to: "w0", label: "pack", showAt: 4, dashed: true },
      { from: "w0", to: "w1", showAt: 4 },
      { from: "w1", to: "w2", showAt: 4 },
      { from: "p0", to: "p1", showAt: 6 },
      { from: "p1", to: "p2", showAt: 6 },
      { from: "msk", to: "p1", label: "bit i", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "A 5×4 board of {0,1,2}",
        text: "Each cell is empty, player 1, or player 2. Storing a 32-bit int per cell wastes 30 bits. Two bits already hold 0,1,2 (3 unused). Space becomes S/16 — over 90% saved, and every board scan is cheaper.",
        highlight: ["m00", "m01", "m10", "m11", "n0", "n1"]
      },
      {
        title: "Flatten: index = r×L + c",
        text: "Row-major slabs. Lrow = 2: (0,0)→7 at 0, (0,1)→3 at 1, (1,0)→4 at 2, (1,1)→6 at 3. The 2D board is now the 1D stream 7, 3, 4, 6.",
        highlight: ["m00", "m01", "m10", "m11", "a0", "a1", "a2", "a3", "n2"],
        hide: ["n0", "n1"],
        flows: [
          { from: "m00", to: "a0", color: "#fb923c", label: "7" },
          { from: "m11", to: "a3", color: "#c084fc", label: "6" }
        ]
      },
      {
        title: "B from the maximum",
        text: "Need 2^B−1 ≥ 7. B=1 holds 1, B=2 holds 3, B=3 holds 7. Linear probes beat binary search here because 2^B explodes (B=32 is ~2e9). Pad 3 to 011 so every slot is 3 bits.",
        highlight: ["a0", "a1", "a2", "a3", "n3"],
        hide: ["n0", "n1", "n2"]
      },
      {
        title: "Pack: A[i] << (i×B)",
        text: "bin starts at 0. 7<<0 = 111 in bits 0–2. 3<<3 parks 011 in bits 3–5. 4<<6 and 6<<9 fill bits 6–11. Four cells in 12 bits instead of four 32-bit ints. The shift is a fence between blocks.",
        highlight: ["b0", "b1", "b2", "b3", "n4"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "a0", to: "b0", color: "#fb923c", label: "<<0" },
          { from: "a1", to: "b1", color: "#60a5fa", label: "<<3" }
        ]
      },
      {
        title: "Words when one int is too small",
        text: "10,000 bits will not fit in a long. Use an array of W-bit words. Toy W=4: 12 bits need three words. idx = (i×B)/W, shift = (i×B)%W. The remainder is how far to skip inside the current word.",
        highlight: ["w0", "w1", "w2", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "b0", to: "w0", color: "#fb923c", label: "bits" }
        ]
      },
      {
        title: "OR, then spill leftover bits",
        text: "3 shifted by 3 does not fit in a 4-bit word. Plus would wrap; OR drops the overflow. leftover bits go to w1 after a right shift of the bits already stored. 4 straddles w1 and w2 the same way. Packed fields stay aligned 3-bit groups.",
        highlight: ["w0", "w1", "w2", "n6"],
        fail: ["w0"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "w0", to: "w1", color: "#f87171", label: "spill" },
          { from: "w1", to: "w2", color: "#fb923c", label: "spill" }
        ]
      },
      {
        title: "Alive, dead, and a hole in the mask",
        text: "People as bits: 1 alive, 0 dead. Test i with AND (1<<i). Revive with OR. Kill with AND of NOT that mask. To zero a block of length B after P zeros: ((1<<B)−1)<<P, negate, AND. Same 2^B−1 identity, now as a range clear.",
        highlight: ["p0", "p1", "p2", "msk", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "msk", to: "p1", color: "#c084fc", label: "test i" }
        ]
      }
    ]
  }
});
