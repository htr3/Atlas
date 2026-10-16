window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 83,
  title: "Row-Major and Column-Major Mapping",
  video: "https://www.youtube.com/watch?v=MJZd6uPi88E",
  category: "Strings, Trees & Arrays",
  tagline: "Compilers turn a[i][j] into L0+(i·n+j)·W or L0+(j·m+i)·W; C uses row-major.",
  summary: "Memory is linear. A 1-D array a[i] compiles to address L0 + i·W (0-based). 1-based indices add a minus-one; C dropped that extra subtract. A 2-D m×n array is still one block: row-major lays rows end to end, address L0+(i·n+j)·W; column-major lays columns, L0+(j·m+i)·W. Example: 3×4 ints, L0=500, W=2, a[2][1]=518 either way if you use the matching formula. Both formulas cost two adds and two muls; C-family languages pick row-major.",

  theory: [
    {
      heading: "1-D: base address plus index times word size",
      body: "Declare a[5] in C (indices 0..4). At run time the block starts at <b>base address</b> L0 (location 0), say 100. The assignment a[2]=15 must become 'store 15 at 104'. The compiler does not bake 104 into the binary; it emits the formula <code>addr(a[i]) = L0 + i · W</code>, W = size of the element type (2 bytes for the lecture's integer, 4 for float, 1 for char). 100+2·2=104. Same formula for every i.",
      bullets: [
        "L0 is known only at load/run time.",
        "W is the word / element size the type dictates.",
        "Programmers write a[i]; machines add a scaled offset."
      ]
    },
    {
      heading: "Why C arrays start at 0",
      body: "Older languages used 1-based arrays a[1..5]. Then addr(a[i])=L0+(i−1)·W. For L0=100, W=2, a[2] is 102. The extra minus is one more runtime operation. Languages after C force index 0 so the compiler can emit L0+i·W without the subtract. Some pre-C compilers even allowed a[−3..5]; the general 1-D formula is L0+(i − lower_bound)·W. That is the whole 1-D story.",
      bullets: [
        "0-based: L0 + i·W.",
        "1-based: L0 + (i−1)·W — one extra subtraction.",
        "Arbitrary bounds: L0 + (i−lb)·W."
      ]
    },
    {
      heading: "2-D arrays are still one linear block",
      body: "Declare a 3×4 array. On paper you draw rows and columns; RAM has a single integer address space, so the compiler allocates 12 consecutive cells (addresses 500,502,… if W=2). It then lets you write a[i][j] by mapping (i,j) onto that line. Two mappings are used: <b>row-major</b> (rows laid one after another) and <b>column-major</b> (columns laid one after another).",
      bullets: [
        "Logical rank-2, physical rank-1.",
        "m rows by n columns ⇒ m·n elements.",
        "The mapping is the compiler's contract, not the programmer's drawing."
      ]
    },
    {
      heading: "Row-major formula",
      body: "Fill row 0, then row 1, then row 2. To reach a[2][1] skip 2 full rows of n=4 elements, then 1 element: offset = 2·4+1=9, address = 500+9·2=<b>518</b>. General 0-based: <code>L0 + (i·n + j) · W</code>. 1-based: L0+((i−1)·n+(j−1))·W. Check a[3][2] in 1-based numbering: 500+(2·4+1)·2=518, same cell. C and the C family use this mapping.",
      bullets: [
        "Skip i rows of length n, then j columns.",
        "Worked: 3×4, L0=500, W=2, a[2][1] → 518.",
        "Row-major is what C, C++, Java, and friends implement."
      ]
    },
    {
      heading: "Column-major formula",
      body: "Fill column 0 (a[0][0], a[1][0], a[2][0]), then column 1, …. To reach a[1][2] skip 2 columns of m=3 elements, then 1 row: offset=2·3+1=7, address=500+14=<b>514</b> in the lecture's walk (W=2). General 0-based: <code>L0 + (j·m + i) · W</code>. 1-based: L0+((j−1)·m+(i−1))·W. Example a[1][4] 1-based: 500+(3·3+0)·2=518. Fortran historically used column-major; the arithmetic cost is the same two additions and two multiplications as row-major, so a language designer may pick either. C-family still picks row-major.",
      bullets: [
        "Skip j columns of length m, then i rows.",
        "Same element can have a different address under the other mapping.",
        "Equal operation count: neither formula is 'faster' in the lecture's tally."
      ]
    },
    {
      heading: "Exam comparison",
      body: "Both 0-based formulas: row L0+(i n + j)W, column L0+(j m + i)W. Two adds, two muls each. If you are writing a compiler you may choose. If you are answering a C question, use row-major and 0-based L0+iW for 1-D. Mixing 1-based subtracts with a C declaration is the usual way to miss 518 and land on 516.",
      bullets: [
        "Name m (rows) vs n (columns) before substituting.",
        "W is type size, not '1 unless they say otherwise' — here W=2.",
        "Cache locality: walking a row is sequential in row-major, strided in column-major."
      ]
    }
  ],

  keyTerms: [
    { term: "Base address L0", def: "Runtime start of the array (location 0); 100 in the 1-D example, 500 in the 2-D example." },
    { term: "Word size W", def: "Bytes per element: 2 for the lecture's int, 4 float, 1 char." },
    { term: "0-based 1-D", def: "addr(a[i]) = L0 + i·W. Why C arrays start at 0." },
    { term: "Row-major", def: "Rows concatenated; addr(a[i][j]) = L0 + (i·n + j)·W." },
    { term: "Column-major", def: "Columns concatenated; addr(a[i][j]) = L0 + (j·m + i)·W." },
    { term: "m × n", def: "m rows, n columns; n is the row length in row-major, m the column length in column-major." },
    { term: "Relative address", def: "The compiler emits a formula, not a baked absolute like 104." }
  ],

  tradeoffs: [
    { pro: "0-based 1-D saves a subtraction at every access compared with 1-based (i−1).", con: "Programmers must remember that a[5] has last index 4, not 5." },
    { pro: "Row-major and column-major have the same arithmetic (+,+,×,×).", con: "The wrong mapping yields the wrong cell (518 vs 514 for nearby indices)." },
    { pro: "C-family row-major makes scanning a row a tight sequential loop.", con: "Scanning a column in C strides by n elements and thrashes cache on large n." }
  ],

  interviewTips: [
    "Write addr(a[i])=L0+i·W and say C starts at 0 to drop the (i−1).",
    "For 2-D, state m×n and which mapping before plugging in i,j.",
    "Row-major: skip i rows of n, then j. Work 500+(2·4+1)·2=518.",
    "Column-major: skip j columns of m, then i. Quote L0+(j·m+i)·W.",
    "Count operations: both mappings two adds and two muls — 'equally efficient' in this lecture.",
    "If the language is C, always row-major and 0-based unless they give another bound."
  ],

  scene: {
    nodes: [
      { id: "mem", label: "Linear memory L0=500", type: "zone", pos: [0, 0, 5], size: [22, 3.4] },
      { id: "m0", label: "500", type: "point", pos: [-10, 0, 5], color: "#4ade80" },
      { id: "m1", label: "502", type: "point", pos: [-7, 0, 5] },
      { id: "m2", label: "504", type: "point", pos: [-4, 0, 5] },
      { id: "m3", label: "506", type: "point", pos: [-1, 0, 5] },
      { id: "m8", label: "516", type: "point", pos: [5, 0, 5] },
      { id: "m9", label: "518", type: "point", pos: [8, 0, 5], color: "#fb923c" },
      { id: "grid", label: "3 x 4 logical", type: "zone", pos: [-2, 0, -3.5], size: [12, 5] },
      { id: "a00", label: "a00", type: "cache", pos: [-6, 0, -5] },
      { id: "a01", label: "a01", type: "cache", pos: [-2.5, 0, -5] },
      { id: "a10", label: "a10", type: "cache", pos: [-6, 0, -3.5] },
      { id: "a21", label: "a21", type: "server", pos: [-2.5, 0, -2] },
      { id: "a12", label: "a12", type: "worker", pos: [1, 0, -3.5], showAt: 4 },
      { id: "n0", label: "1-D: L0 + i*W   100+2*2=104", type: "note", pos: [-8, 3, 7] },
      { id: "n1", label: "1-based extra (i-1); C dropped it", type: "note", pos: [8, 3, 7], showAt: 0 },
      { id: "n2", label: "RAM is 1-D; 3x4 is 12 cells", type: "note", pos: [-8, 3, -7], showAt: 1 },
      { id: "n3", label: "Row-major: L0+(i*n+j)*W", type: "note", pos: [8, 3, -7], showAt: 2 },
      { id: "n4", label: "2*4+1=9; 500+18=518", type: "note", pos: [8, 3, 2], showAt: 3 },
      { id: "n5", label: "Col-major: L0+(j*m+i)*W", type: "note", pos: [-8, 3, 2], showAt: 4 }
    ],
    edges: [
      { from: "m0", to: "m1" },
      { from: "m1", to: "m2" },
      { from: "m2", to: "m3" },
      { from: "m3", to: "m8" },
      { from: "m8", to: "m9" },
      { from: "a00", to: "a01", label: "row" },
      { from: "a00", to: "a10", label: "col" },
      { from: "a21", to: "m9", label: "row-major", showAt: 3 },
      { from: "a12", to: "m8", label: "col-major", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "1-D address formula",
        text: "a[2]=15 in a 0-based int array at L0=100, W=2 becomes store-at 104. Compiler emits L0+i·W, a relative address, not a hard-coded 104.",
        highlight: ["n0", "m0", "m9"],
        hide: ["n1", "n2", "n3", "n4", "n5", "a12"]
      },
      {
        title: "0-based drops a subtraction",
        text: "1-based languages use L0+(i−1)·W. That minus is why C forces index 0: L0+i·W is one operation cheaper. Arbitrary lb: L0+(i−lb)·W.",
        highlight: ["n1", "n0"],
        hide: ["n2", "n3", "n4", "n5", "a12"]
      },
      {
        title: "2-D is painted onto a line",
        text: "A 3×4 drawing is 12 consecutive words starting at 500. The compiler still has to pick an order: row by row, or column by column.",
        highlight: ["grid", "mem", "a00", "a01", "a10", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "a12"]
      },
      {
        title: "Row-major fill",
        text: "Row 0 occupies 500–506, row 1 the next four words, row 2 after that. Walking a[0][0], a[0][1], … is sequential. C-family languages use this order.",
        highlight: ["a00", "a01", "m0", "m1", "m2", "m3", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "a12"],
        flows: [
          { from: "a00", to: "m0", color: "#4ade80", label: "row0" },
          { from: "a01", to: "m1", color: "#4ade80", label: "row0" }
        ]
      },
      {
        title: "a[2][1] = 518",
        text: "Skip i=2 rows of n=4, then j=1: offset 9, times W=2, plus 500 = 518. Formula L0+(i·n+j)·W. 1-based uses (i−1)n+(j−1) and hits the same cell.",
        highlight: ["a21", "m9", "n3", "n4"],
        hide: ["n0", "n1", "n2", "n5", "a12"],
        flows: [
          { from: "a21", to: "m9", color: "#fb923c", label: "518" }
        ]
      },
      {
        title: "Column-major: skip columns of m",
        text: "addr = L0+(j·m+i)·W. a[1][2] skips 2 columns of 3 plus 1: 500+7·2=514. Same two adds and two muls as row-major. C still chooses row-major; Fortran chose columns.",
        highlight: ["a12", "a00", "a10", "n5", "mem"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "a00", to: "a10", color: "#c084fc", label: "col0" },
          { from: "a12", to: "m8", color: "#c084fc", label: "col-major" }
        ]
      }
    ]
  }
});
