window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 55,
  title: "4.5.1 0/1 Knapsack Problem (Program) - Dynamic Programming",
  video: "https://www.youtube.com/watch?v=zRza99HPvkQ",
  category: "Dynamic Programming",
  tagline: "K[5][9] nested loops: i=0 or w=0 seed 0, else max(skip, p[i]+K[i-1][w-wt]); print 8 then 0 1 0 1.",
  summary: "Same instance as the table lecture (p=[0,1,2,5,6], wt=[0,2,3,4,5], n=4, M=8) coded as one main(). Arrays are 1-indexed; K is 5×9 so rows 0..4 and columns 0..8 exist. Three branches: if i==0||w==0 write 0; else if wt[i]>w copy the cell above; else K[i][w]=max(K[i-1][w], p[i]+K[i-1][w-wt[i]]). Print K[n][M]=8. A downward while-loop compares K[i][j] with K[i-1][j] to emit 0/1 and subtract weight when taken.",

  theory: [
    {
      heading: "State in the arrays",
      body: "Hard-coded instance: four objects, capacity 8. Profit and weight arrays have length 5 with slot 0 unused so object 1 lives at index 1. The table K has 5 rows (objects 0..4) and 9 columns (capacity 0..8). That extra 0-row and 0-column are the base cases the nested loops will write first. The program is one main — Bari does not split functions — and you change the literals (or add scanf) for a new instance.",
      bullets: [
        "1-based objects: p[0]=wt[0]=0 on purpose.",
        "K[n+1][M+1] including zeros.",
        "Logic is the whole point; I/O is optional."
      ]
    },
    {
      heading: "Recurrence as three ifs",
      body: "for i=0..n, for w=0..M: (1) if i==0 or w==0 then K[i][w]=0. (2) else if wt[i] > w then K[i][w]=K[i-1][w] (cannot take). (3) else K[i][w]=max(K[i-1][w], p[i]+K[i-1][w-wt[i]]). Branch 1 paints the first row and first column. Branch 2 copies until the object's weight fits. Branch 3 is the real DP step. Nested loops ⇒ Θ(nM).",
      bullets: [
        "i is the row (object count), w the column (capacity).",
        "Always read row i-1, never the current row — 0/1, not unbounded.",
        "max(skip, take) is written exactly once per interior cell."
      ]
    },
    {
      heading: "Trace of the fill",
      body: "i=0: every column 0. i=1, w=0: 0. i=1, w=1: 2>1, copy 0. i=1, w=2: take max(0, 1+K[0][0])=1, and the rest of the row stays 1. i=2, w<3 copy; w=3: max(1, 2+K[1][0])=2; w=5: max(1, 2+K[1][2])=3. i=3, w=6: max(3, 5+K[2][2])=6 (objects 1 and 3). i=3, w=7: max(3, 5+2)=7. i=4, w=8: max(7, 6+K[3][3])=max(7,8)=8. cout << K[4][8] prints the optimum.",
      bullets: [
        "First true take is K[1][2]=1.",
        "K[2][5]=3 is both of the first two objects.",
        "K[n][M] is the only cell the profit-print needs."
      ]
    },
    {
      heading: "Table order in the loops",
      body: "i increases slowly, w resets every row. That is exactly increasing number of items, then capacity. You never need a later object to fill an earlier row. If you swapped the loops (w outer, i inner) it still works because each cell only depends on the previous row, but Bari writes i outer. Do not use K[i][w-wt] on the same row — that would allow taking object i twice (unbounded knapsack).",
      bullets: [
        "Dependencies: strictly previous row, same or smaller column.",
        "0/1 vs unbounded is this one indexing detail.",
        "Print after both loops finish, not inside."
      ]
    },
    {
      heading: "Recovering the 0-1 vector",
      body: "i=n, j=M. while i>0 and j>0: if K[i][j]==K[i-1][j] the object was skipped — print 0, i--. Else print 1, j -= wt[i], i--. Trace: K[4][8]=8 ≠ K[3][8]=7 ⇒ x4=1, j=3. K[3][3]=2 == K[2][3] ⇒ x3=0. K[2][3]=2 ≠ K[1][3]=1 ⇒ x2=1, j=0. x1=0. Same (0,1,0,1) as the handwritten table. The lecture's compact loop prints while walking; a for-i-from-n-down-to-1 is the same idea.",
      bullets: [
        "Equal to the cell above ⇒ skip (print 0).",
        "Unequal ⇒ take (print 1) and subtract this weight from j.",
        "Stop at i=0 or j=0; leftover capacity may be unused."
      ]
    }
  ],

  keyTerms: [
    { term: "K[n+1][M+1]", def: "1-based table with a zero row and zero column for the base cases." },
    { term: "Three-branch cell", def: "Zero seed, copy-above if overweight, else max(skip, take)." },
    { term: "i outer, w inner", def: "Fill order in the program: one object at a time, every capacity." },
    { term: "Previous-row take", def: "K[i-1][w-wt[i]] — using K[i] here would reuse object i." },
    { term: "Trace loop", def: "From (n,M) walk up; equality with K[i-1][j] means x_i=0." },
    { term: "K[n][M]", def: "Printed optimum profit; here 8." }
  ],

  tradeoffs: [
    { pro: "One nested loop plus a walk-back is the entire 0/1 solver.", con: "Hard-coded n and M; a general version needs input and VLA/allocation." },
    { pro: "1-based arrays match the math V[i][w] in the previous lecture.", con: "Forgetting index 0's dummy 0 leads to take-from-K[-1] bugs." },
    { pro: "Comparing to the cell above reconstructs items without a second table.", con: "Overwriting K with a 1-D rolling array loses the trace unless you keep parents." },
    { pro: "Θ(nM) is obvious from the two for-loops.", con: "Still pseudo-polynomial; huge M needs a different algorithm." }
  ],

  interviewTips: [
    "Say arrays are 1-based so object 1 is p[1], and K has a 0 row/column.",
    "Recite the three branches in the inner cell, in that order.",
    "Emphasize take reads K[i-1][w-wt[i]], not K[i][...], or you coded unbounded knapsack.",
    "Trace K[1][2]=1, K[2][5]=3, K[3][7]=7, K[4][8]=8 on this instance.",
    "Item recovery: 8≠7 ⇒ take 4; leftover 3 equals row 2 not row 1 ⇒ take 2.",
    "Print K[n][M] first, then the 0-1 vector — both are in the lecture's program."
  ],

  scene: {
    nodes: [
      { id: "k00", label: "0", type: "point", pos: [-9, 0, 5], color: "#64748b" },
      { id: "k01", label: "0", type: "point", pos: [-6.5, 0, 5], color: "#64748b" },
      { id: "k08", label: "0", type: "point", pos: [6, 0, 5], color: "#64748b" },
      { id: "k10", label: "0", type: "point", pos: [-9, 0, 2.5], color: "#64748b" },
      { id: "k12", label: "1", type: "cache", pos: [-4, 0, 2.5], color: "#60a5fa", showAt: 2 },
      { id: "k18", label: "1", type: "cache", pos: [6, 0, 2.5], color: "#60a5fa", showAt: 2 },
      { id: "k23", label: "2", type: "cache", pos: [-1.5, 0, 0], color: "#c084fc", showAt: 3 },
      { id: "k25", label: "3", type: "cache", pos: [3.5, 0, 0], color: "#c084fc", showAt: 3 },
      { id: "k37", label: "7", type: "cache", pos: [3.5, 0, -2.5], color: "#fb923c", showAt: 4 },
      { id: "k38", label: "7", type: "cache", pos: [6, 0, -2.5], color: "#fb923c", showAt: 4 },
      { id: "k48", label: "8", type: "cache", pos: [6, 0, -5], color: "#4ade80", showAt: 5 },
      { id: "x4", label: "x4=1", type: "point", pos: [2, 0, -5], color: "#4ade80", showAt: 6 },
      { id: "x2", label: "x2=1", type: "point", pos: [-2.5, 0, -5], color: "#c084fc", showAt: 6 },
      { id: "n0", label: "K[5][9], i then w", type: "note", pos: [-9, 0, -2.5] },
      { id: "n1", label: "i==0 || w==0 → 0", type: "note", pos: [-9, 0, -5], showAt: 1 },
      { id: "n2", label: "take uses row i-1", type: "note", pos: [-9, 0, 7.5], showAt: 3 },
      { id: "n3", label: "cout K[4][8] = 8", type: "note", pos: [9.5, 0, -5], showAt: 5 },
      { id: "n4", label: "8!=7 take; j-=5", type: "note", pos: [9.5, 0, -2.5], showAt: 6 }
    ],
    edges: [
      { from: "k00", to: "k01" },
      { from: "k01", to: "k08", dashed: true },
      { from: "k10", to: "k12", showAt: 2 },
      { from: "k12", to: "k18", showAt: 2, dashed: true },
      { from: "k38", to: "k48", showAt: 5, dashed: true },
      { from: "k48", to: "x4", showAt: 6 },
      { from: "k23", to: "x2", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Layout of K",
        text: "5 rows including object 0, 9 columns including capacity 0. i runs 0..4 outer, w runs 0..8 inner. Slot 0 of p[] and wt[] is dummy so object 1 is index 1.",
        highlight: ["k00", "k01", "k08", "k10", "n0"]
      },
      {
        title: "Branch 1: zeros",
        text: "Whenever i==0 or w==0 the cell is 0. First row fills entirely. Every later row starts with a 0 in column 0. Those seeds are the base of the recurrence.",
        highlight: ["k00", "k01", "k08", "k10", "n1"]
      },
      {
        title: "Row 1: first take at w=2",
        text: "wt[1]=2 > w=1 → copy 0. At w=2 the third branch runs: max(0, 1+K[0][0])=1. The rest of row 1 stays 1 — only one object exists.",
        highlight: ["k12", "k18", "k10"],
        flows: [
          { from: "k10", to: "k12", color: "#60a5fa", label: "take p=1" }
        ]
      },
      {
        title: "Row 2 cells 2 and 3",
        text: "w=3: max(1, 2+0)=2. w=5: max(1, 2+K[1][2])=3. Take always indexes the previous row so object 2 is used at most once.",
        highlight: ["k23", "k25", "k12", "n2"],
        flows: [
          { from: "k12", to: "k25", color: "#c084fc", label: "+p2" }
        ]
      },
      {
        title: "Row 3: 7 at columns 7–8",
        text: "Object 3 has p=5, w=4. Column 7: max(3, 5+K[2][3])=7. Column 8 still 7 — 2+3+4=9 exceeds M. Those 7s are the skip option for row 4.",
        highlight: ["k37", "k38", "k23"]
      },
      {
        title: "K[4][8]=8",
        text: "max(K[3][8], 6+K[3][3])=max(7, 6+2)=8. The nested loops are done. The program prints 8 as the optimal profit.",
        highlight: ["k48", "k38", "n3"],
        flows: [
          { from: "k38", to: "k48", color: "#4ade80", label: "max(7,8)" }
        ]
      },
      {
        title: "Walk-back prints 0 1 0 1",
        text: "8≠7 so x4=1 and j becomes 3. K[3][3]==K[2][3] so x3=0. 2≠1 so x2=1 and j=0. x1=0. Same vector as the handwritten table, now from the code.",
        highlight: ["k48", "x4", "x2", "k23", "n4"],
        flows: [
          { from: "k48", to: "x4", color: "#4ade80", label: "1" },
          { from: "k23", to: "x2", color: "#c084fc", label: "1" }
        ]
      }
    ]
  }
});
