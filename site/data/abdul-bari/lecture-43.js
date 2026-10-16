window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 43,
  title: "3.4 Huffman Coding - Greedy Method",
  video: "https://www.youtube.com/watch?v=co4_ahEDCho",
  category: "Greedy Algorithms",
  tagline: "Variable codes from a two-smallest tree: 20 letters drop from 160 bits to 45+52.",
  summary: "A 20-character message over {A,B,C,D,E} with counts 3,5,6,4,2 costs 160 bits in ASCII and 115 bits with a 3-bit fixed code plus table. Huffman builds the optimal-merge tree on those counts, labels left 0 / right 1, and assigns 001,10,11,01,000. The encoded message is 45 bits; ASCII letters plus the five codewords add 52; total 97. Decode by walking the tree from the root at every leaf.",

  theory: [
    {
      heading: "ASCII vs a five-symbol alphabet",
      body: "The sample message has length <b>20</b> and uses only five letters. Raw ASCII is 8 bits × 20 = <b>160</b> bits. You do not need 8-bit codes for five symbols: 1 bit covers 2 symbols, 2 bits cover 4, so <b>3 bits</b> cover 5 (with three unused triples). Fixed codes A=000 … E=100 turn the body into 3×20 = <b>60</b> bits. The receiver still needs a chart: 5 ASCII letters (40 bits) plus five 3-bit codewords (15) = 55, grand total <b>115</b> — about 30–40% off 160, table included.",
      bullets: [
        "Counts (frequencies): A=3, B=5, C=6, D=4, E=2. Prefer counts over 3/20 fractions on paper.",
        "Fixed-width is already a compression versus ASCII because the alphabet is tiny.",
        "Any encoding ships a table or a tree; ignore that and the 60-bit headline is a lie."
      ]
    },
    {
      heading: "Greedy-choice logic: short codes for frequent letters",
      body: "Huffman’s idea: give high-count symbols short bit-strings. Build the code the same way as optimal merge: sort counts E=2, A=3, D=4, B=5, C=6 and repeatedly combine the two smallest nodes. 2+3=5; then 4+5=9 (the new 5 with D); then B+C=11; then 9+11=20. Mark every left edge 0 and every right edge 1. The path from the root to a leaf is that letter’s code. Two-smallest on frequencies is the greedy choice; prefix-freedom comes for free because only leaves are letters.",
      bullets: [
        "Same algorithm as last lecture; sizes are now character counts.",
        "Left=0, right=1 (the lecture’s convention).",
        "No letter is an internal node, so no code is a prefix of another."
      ]
    },
    {
      heading: "Worked example: codes and 45-bit body",
      body: "Root 20; left child 9 (EA+D), right child 11 (B+C). Then E=000, A=001, D=01, B=10, C=11. Lengths 3,3,2,2,2. Weighted size: 3·3 + 2·5 + 2·6 + 2·4 + 3·2 = 9+10+12+8+6 = <b>45</b> bits for the message. Same 45 as Σ (depth × count) on the tree. Table: 5×8 ASCII = 40 plus the stored code bits 3+2+2+2+3 = 12, total 52. Grand total <b>97</b> bits versus 115 fixed versus 160 ASCII.",
      bullets: [
        "A=001 (3), B=10 (2), C=11 (2), D=01 (2), E=000 (3).",
        "Body 45 + table 52 = 97.",
        "C appears most (6) and got a 2-bit code; E appears twice and got 3 bits."
      ]
    },
    {
      heading: "Proof intuition and decoding",
      body: "Among prefix codes, a minimum weighted path tree puts the two rarest symbols as siblings (if not, swap with a heavier leaf sitting as deep — the same inversion argument as merge). Combining them into a super-symbol of count 5 reduces the alphabet by one; induction gives Huffman’s tree. Decoding: start at the root, 0 left / 1 right, emit the leaf, reset to the root. Example walk: 001 is A; 11 is C; 01 is D. The receiver converts back to ASCII to use the text — same idea as unzipping. Zip files are the physical analogue in the last minute.",
      bullets: [
        "Prefix-free ⇔ unique decoding without commas between letters.",
        "Two rarest symbols are siblings in some optimal tree.",
        "Always restart at the root after a leaf; never continue through an internal node as a letter."
      ]
    },
    {
      heading: "Complexity",
      body: "Let σ be the alphabet size (5 here, 256 for bytes). Building the tree is optimal merge: <b>O(σ log σ)</b> with a min-heap of current weights. Encoding the n-character body is O(n) after you have a letter→bitstring table. Decoding is O(n) tree walks. The table (or a serialized tree) is O(σ) extra bits on the wire — mandatory in the lecture’s accounting. Worst-case code length is σ−1 (a spine); average length is Σ p<sub>i</sub> ℓ<sub>i</sub>, here 45/20 = 2.25 bits/char versus 3 fixed versus 8 ASCII.",
      bullets: [
        "Heap of σ weighted nodes, σ−1 combines.",
        "n-letter encode/decode linear in n once codes exist.",
        "Exam cost questions: body, table, and total as three lines."
      ]
    }
  ],

  keyTerms: [
    { term: "Fixed-length code", def: "Every symbol uses the same width (3 bits here); 20×3=60 plus a 55-bit table." },
    { term: "Variable-length code", def: "Frequent symbols may use fewer bits; Huffman is the greedy construction." },
    { term: "Frequency / count", def: "How often a letter appears; A3 B5 C6 D4 E2 on a length-20 string." },
    { term: "Huffman tree", def: "Optimal-merge binary tree on those counts; left 0, right 1." },
    { term: "Prefix-free", def: "No code is a prefix of another, so a bit stream parses uniquely." },
    { term: "Table / tree on the wire", def: "ASCII of the letters plus the code bits (52 here) shipped with the 45-bit body." },
    { term: "Weighted path", def: "Σ depth(letter)×count(letter) = encoded body length = 45." }
  ],

  tradeoffs: [
    { pro: "Huffman beats fixed-width on skewed counts (45 vs 60 body).", con: "A flat alphabet (all counts equal) gains little, and you still pay for the table." },
    { pro: "Prefix-free codes decode without separators.", con: "A single flipped bit can desynchronize the rest of the stream." },
    { pro: "Same two-smallest proof as optimal merge — one algorithm, two stories.", con: "Huffman is not the only compressor; arithmetic / ANS can beat it on the same counts." },
    { pro: "ASCII+table accounting (97 vs 115 vs 160) is what exams grade.", con: "Quoting only \"45 bits\" forgets the chart the receiver must have." }
  ],

  interviewTips: [
    "Quote 160 ASCII, 60+55=115 fixed, 45+52=97 Huffman on this 20-letter message.",
    "Build E+A=5, 5+D=9, B+C=11, 9+11=20, then read codes 000,001,01,10,11.",
    "Check 3·3+2·5+2·6+2·4+3·2=45 two ways (table and tree depths).",
    "Say left=0 right=1 and \"restart at root after each leaf\" for the decode trace.",
    "Name prefix-free so they know why 10 then 11 cannot be confused with 1011 as one letter.",
    "Complexity O(σ log σ) tree, O(n) encode; mention the table bits on the wire."
  ],

  scene: {
    nodes: [
      { id: "root", label: "20", type: "lb", pos: [0, 0, -6], showAt: 4 },
      { id: "n9", label: "9", type: "worker", pos: [-6, 0, -1], color: "#fb923c", showAt: 3 },
      { id: "n11", label: "11", type: "worker", pos: [6, 0, -1], color: "#facc15", showAt: 4 },
      { id: "n5", label: "5", type: "worker", pos: [-9, 0, 3], color: "#22d3ee", showAt: 2 },
      { id: "chD", label: "D:4", type: "server", pos: [-3, 0, 3], color: "#60a5fa" },
      { id: "chB", label: "B:5", type: "server", pos: [3, 0, 3], color: "#4ade80" },
      { id: "chC", label: "C:6", type: "server", pos: [9, 0, 3], color: "#4ade80" },
      { id: "chE", label: "E:2", type: "server", pos: [-11, 0, 6.5], color: "#c084fc" },
      { id: "chA", label: "A:3", type: "server", pos: [-7, 0, 6.5], color: "#c084fc" },
      { id: "msg", label: "20 letters", type: "queue", pos: [10, 0, -6] },
      { id: "n0", label: "ASCII 160 bits", type: "note", pos: [-8, 3, 7.5] },
      { id: "n1", label: "Fixed 3-bit: 115 tot", type: "note", pos: [8, 3, 7.5], showAt: 1 },
      { id: "n2", label: "Two-smallest on counts", type: "note", pos: [-8, 3, -7.5], showAt: 2 },
      { id: "n3", label: "A001 B10 C11 D01 E000", type: "note", pos: [8, 3, -7.5], showAt: 5 },
      { id: "n4", label: "Body 45 + table 52=97", type: "note", pos: [0, 3, 7.5], showAt: 6 }
    ],
    edges: [
      { from: "chE", to: "n5", label: "0", showAt: 2 },
      { from: "chA", to: "n5", label: "1", showAt: 2 },
      { from: "n5", to: "n9", label: "0", showAt: 3 },
      { from: "chD", to: "n9", label: "1", showAt: 3 },
      { from: "chB", to: "n11", label: "0", showAt: 4 },
      { from: "chC", to: "n11", label: "1", showAt: 4 },
      { from: "n9", to: "root", label: "0", showAt: 4 },
      { from: "n11", to: "root", label: "1", showAt: 4 }
    ],
    steps: [
      {
        title: "20 letters, five symbols, 160 bits",
        text: "Counts A3 B5 C6 D4 E2. ASCII is 8×20=160. Only five letters appear, so eight-bit codes are waste.",
        highlight: ["msg", "chA", "chB", "chC", "chD", "chE", "n0"]
      },
      {
        title: "Fixed 3-bit codes still need a table",
        text: "5 < 8, so width 3: body 60 bits. Chart is 5×8 ASCII + 5×3 codes = 55. Total 115. Better than 160, still uniform width.",
        highlight: ["n1", "msg", "chC"],
        hide: ["n0"]
      },
      {
        title: "Combine two smallest: E+A=5",
        text: "Sort 2,3,4,5,6. Greedy merge E with A into an internal 5. Same two-smallest rule as optimal merge, now on frequencies.",
        highlight: ["chE", "chA", "n5", "n2"],
        hide: ["n0"],
        flows: [
          { from: "chE", to: "n5", color: "#c084fc", label: "2" },
          { from: "chA", to: "n5", color: "#c084fc", label: "3" }
        ]
      },
      {
        title: "5 with D makes 9",
        text: "Remaining 5,4,5,6. Tie on 5: take the new node with D=4 to make 9. Leaves B and C still waiting.",
        highlight: ["n5", "chD", "n9"],
        hide: ["n0", "n1"],
        flows: [
          { from: "n5", to: "n9", color: "#22d3ee", label: "5" },
          { from: "chD", to: "n9", color: "#60a5fa", label: "4" }
        ]
      },
      {
        title: "B+C=11, then 9+11=20",
        text: "Two smallest now are B=5 and C=6 → 11. Then 9 and 11 close the tree at 20, the message length. Left edges will be 0, right edges 1.",
        highlight: ["chB", "chC", "n11", "root", "n9"],
        hide: ["n0", "n1"],
        flows: [
          { from: "chB", to: "n11", color: "#4ade80", label: "5" },
          { from: "chC", to: "n11", color: "#4ade80", label: "6" },
          { from: "n9", to: "root", color: "#fb923c", label: "0" },
          { from: "n11", to: "root", color: "#facc15", label: "1" }
        ]
      },
      {
        title: "Read the variable codes",
        text: "Root→leaf: A=001, B=10, C=11, D=01, E=000. Frequent C and B got 2 bits; rare E got 3. Prefix-free because letters sit only at leaves.",
        highlight: ["chA", "chB", "chC", "chD", "chE", "root", "n3"],
        hide: ["n0", "n1"]
      },
      {
        title: "45-bit body, 97 on the wire",
        text: "3·3+2·5+2·6+2·4+3·2=45. Table 40+12=52. Total 97, down from 115 and 160. Depth×count on the tree is the same 45.",
        highlight: ["n4", "n3", "root", "msg"],
        hide: ["n0", "n1", "n2"]
      },
      {
        title: "Decode: walk, emit, reset",
        text: "From the root, 0 left / 1 right until a leaf, emit that letter, jump back to 20. 001→A, 11→C, 01→D. Then convert to ASCII to use the file, like unzipping.",
        highlight: ["root", "n9", "n11", "chA", "chC", "chD", "n4"],
        hide: ["n0", "n1"],
        flows: [{ from: "root", to: "chA", color: "#60a5fa", label: "001" }]
      }
    ]
  }
});
