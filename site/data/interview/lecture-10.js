window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 10,
  title: "Episode 6: Balance the Array - Rachit Challenges Gaurav - Amortization",
  video: "https://www.youtube.com/watch?v=IG9OtI54zPk",
  category: "Interview Prep",
  tagline: "Make the max appear ≥ n/2 times at min delete-cost — amortized O(n log n).",
  summary: "An array is balanced when its maximum value appears at least n/2 times. Each index has a non-negative delete-cost; spend the cheapest budget that restores the rule. Sort, collapse equal values into groups, and walk candidate maxima. A height-balanced tree of leftover costs looks O(n²) if you count get-k naively, but flow shows at most n inserts and n deletes — O(n log n) amortized.",

  theory: [
    {
      heading: "What 'balanced' actually asks",
      body: "You are given n values. Each index also carries a <b>cost to delete</b> it. After some deletions the leftover length is n', and the leftover <b>maximum</b> must occur at least <code>n'/2</code> times. Example from the session: <code>[1, 2, 3, 3, 3]</code> — n = 5, max = 3, frequency 3, and 3 ≥ 5/2, so it already passes. Stretch the same idea to six items where the max appears once and the rule fails: you must delete until the new max is frequent enough. Minimize the sum of delete-costs, not the count of deletions.",
      bullets: [
        "Predicate: freq(max) ≥ leftover length / 2.",
        "Costs are on indices, not on distinct values.",
        "A legal leftover array can be shorter than n; empty is never the interesting answer."
      ]
    },
    {
      heading: "Sort, then refuse to keep a lonely copy",
      body: "When a prompt mentions a maximum or a minimum, the first interview move is <b>sort</b> — O(n log n) you pay up front so every later scan sees increasing values. After the sort, equal numbers form a <b>group</b>. Costs are non-negative, so if you decide that v is the maximum you keep, you keep <i>every</i> copy of v: dropping one copy of v cannot help the frequency test and only wastes a chance to save cost. Collapse each value into one bag whose removal price is the sum of its members (the talk's bags: ones cost 11, threes 19, fours 14).",
      bullets: [
        "Sorting is the tax that buys ordered candidate maxima.",
        "A group is all indices with the same value.",
        "Never keep a strict subset of the chosen max group."
      ]
    },
    {
      heading: "Walk candidate maxima from small to large",
      body: "Treat each distinct value v, in sorted order, as 'this v is the maximum I will keep.' Everything <b>strictly larger</b> than v must go — those values would outrank v. Everything equal to v stays. From the strictly smaller leftovers you may keep at most <code>freq(v)</code> items, otherwise v stops being a majority-style max. If leftovers currently hold m items and m > freq(v), you must drop <code>k = m - freq(v)</code> of them, and the cheapest k are the ones to drop. Worked beat: when 4 is the max with frequency 2 and five smaller items remain, drop three; the three cheapest in the example sum to <b>13</b>, which beat the all-delete plan that cost 33.",
      bullets: [
        "Larger-than-v is mandatory deletion.",
        "Smaller-than-v is a budget of at most freq(v) keepers.",
        "Track the best budget across every candidate v."
      ]
    },
    {
      heading: "The O(n²) wall",
      body: "There are at most n distinct candidates. For each one, a brute scan of the leftover bag to find the k cheapest costs O(n). That is <b>O(n²)</b> plus the O(n log n) sort — fine for a first code, not the bound they want. Segment trees and other range structures can answer 'sum of k smallest in this prefix' but are heavy for a whiteboard. The session hunts a structure with three jobs: <b>insert</b> (when the previous max group joins leftovers), <b>read the cost of the k smallest</b>, and <b>delete those k</b>.",
      bullets: [
        "n candidates × n-length scans = quadratic.",
        "Target: every candidate in about log n after the sort.",
        "Need insert + get-k + delete-k, not a full resorted array each time."
      ]
    },
    {
      heading: "A BST of leftover costs",
      body: "Keep leftovers in a <b>height-balanced search tree</b> (a C++ <code>set</code> / policy-tree / order-statistic tree) keyed on cost. Insert is O(log n). The k cheapest sit at the left of the in-order walk; deleting them is k tree deletions. Get-k looks like O(k log n) and therefore like O(n²) again if a single candidate could demand k ≈ n. That fear is what amortization has to kill. Split the API in your head: get the sum, then delete — same tree, two named operations, still log n per node touched.",
      bullets: [
        "Key = delete-cost, not the array value.",
        "Advancing the candidate max inserts the old max-group into this tree.",
        "k-smallest lives at the left spine of in-order."
      ]
    },
    {
      heading: "Capacity grows, so you undo expensive deletes",
      body: "When you step from max = 3 to max = 4, leftover <b>capacity</b> becomes freq(4). You may keep more small items than before. The items you wish you had never deleted are the <b>most expensive</b> ones you dropped — the reverse of the delete rule. Re-insert those into the tree (the 'undo'). The session's picture: the tree shrinks while you are over capacity, then grows again when a more frequent max arrives. That grow/shrink is the same structure, not a second algorithm.",
      bullets: [
        "Delete cheapest when over capacity.",
        "Undo dearest when capacity rises.",
        "You never keep more leftovers than the current freq(max)."
      ]
    },
    {
      heading: "Flow proves the amortized bound",
      body: "How many inserts can the tree ever see? When v becomes the max you may add at most <code>freq(v)</code> leftover slots, and the sum of frequencies is n, so <b>total inserts ≤ n</b>. The tree never holds more than n keys, and you cannot delete a key you did not insert, so <b>total deletes ≤ n</b> as well — that is the <b>flow</b> argument (tokens in, tokens out). Each tree op is O(log n). Add the initial sort. The whole walk is <b>O(n log n)</b>, not O(n²), even though one get-k looked like k log n. The keyword is <b>amortized</b>: a single candidate can be expensive; the sum over the journey is not. Hard interview problem — do not pretend you invented the flow on the first try; show you can prove the bound once the tree is on the board.",
      bullets: [
        "Inserts across all candidates ≤ n.",
        "Deletes ≤ inserts ≤ n.",
        "Sort + n log n tree work = O(n log n)."
      ]
    }
  ],

  keyTerms: [
    { term: "Balanced array", def: "Leftover max appears at least (leftover length)/2 times." },
    { term: "Delete-cost", def: "Non-negative price of removing one index; the objective is their sum." },
    { term: "Value group", def: "All copies of one number; if that number is the chosen max, keep the whole group." },
    { term: "Candidate max", def: "A distinct value v you try as the leftover maximum, walking small to large." },
    { term: "Leftover capacity", def: "At most freq(v) strictly-smaller items may remain beside v." },
    { term: "Cost BST", def: "Height-balanced tree of leftover delete-costs supporting insert and k-smallest delete." },
    { term: "Undo", def: "Re-insert the dearest previously dropped leftovers when capacity grows." },
    { term: "Flow / amortized", def: "Total inserts and deletes over the whole scan are O(n), so the tree is O(n log n)." }
  ],

  tradeoffs: [
    { pro: "Sort-plus-groups is the natural interview opening and costs only n log n.", con: "Without a leftover tree, each candidate still scans O(n) and you stay quadratic." },
    { pro: "A balanced BST is simpler to code and explain than a segment tree of prefix k-sums.", con: "Naive get-k looks O(k log n); you must prove amortization or the interviewer smells n²." },
    { pro: "Keeping a whole max-group is free correctness once costs are non-negative.", con: "Negative costs would break the 'never drop a copy of v' argument." },
    { pro: "Undo lets a more frequent max reclaim expensive items you had cut.", con: "You now maintain a second 'deleted' bag of the dearest drops, which is easy to forget on a board." }
  ],

  interviewTips: [
    "Write the predicate first: freq(max) ≥ n'/2, minimize delete-cost, costs ≥ 0.",
    "Say 'sort, then groups' before any tree — that is the expected first minute.",
    "Name insert, get-k, delete-k, and undo when capacity grows; that is the data-structure spec.",
    "Do not claim O(n log n) until you say inserts ≤ n and deletes ≤ n (flow).",
    "Work one numeric pass: ones cost 11, threes 19, fours 14, and max=4 dropping three cheap items at 13.",
    "Call the bound amortized out loud so they know you did not confuse a single get-k with the sum."
  ],

  scene: {
    nodes: [
      { id: "az", label: "Sorted array", type: "zone", pos: [0, 0, 2.5], size: [22, 4] },
      { id: "v1", label: "1", type: "point", pos: [-9, 0, 2.5], color: "#60a5fa" },
      { id: "v2", label: "1", type: "point", pos: [-6, 0, 2.5], color: "#60a5fa" },
      { id: "v3", label: "3", type: "point", pos: [-3, 0, 2.5], color: "#4ade80" },
      { id: "v4", label: "3", type: "point", pos: [0, 0, 2.5], color: "#4ade80" },
      { id: "v5", label: "3", type: "point", pos: [3, 0, 2.5], color: "#4ade80" },
      { id: "v6", label: "4", type: "point", pos: [6, 0, 2.5], color: "#fb923c" },
      { id: "v7", label: "4", type: "point", pos: [9, 0, 2.5], color: "#fb923c" },
      { id: "g1", label: "1s = 11", type: "service", pos: [-9, 0, -2], showAt: 2 },
      { id: "g3", label: "3s = 19", type: "service", pos: [-3, 0, -2], showAt: 2 },
      { id: "g4", label: "4s = 14", type: "service", pos: [3, 0, -2], showAt: 2 },
      { id: "bst", label: "cost BST", type: "cache", pos: [9, 0, -2], showAt: 4 },
      { id: "n0", label: "freq(max) ≥ n/2", type: "note", pos: [-8, 3, -7] },
      { id: "n1", label: "min delete-cost", type: "note", pos: [0, 3, -7], showAt: 1 },
      { id: "n2", label: "keep whole groups", type: "note", pos: [8, 3, -7], showAt: 2 },
      { id: "n3", label: "k = m − freq(v)", type: "note", pos: [-8, 3, 7], showAt: 3 },
      { id: "n4", label: "insert / get-k / del", type: "note", pos: [0, 3, 7], showAt: 4 },
      { id: "n5", label: "undo dearest", type: "note", pos: [8, 3, 7], showAt: 5 },
      { id: "n6", label: "in+out ≤ n  n log n", type: "note", pos: [0, 3, -4], showAt: 6 }
    ],
    edges: [
      { from: "v1", to: "v2" },
      { from: "v2", to: "v3" },
      { from: "v3", to: "v4" },
      { from: "v4", to: "v5" },
      { from: "v5", to: "v6" },
      { from: "v6", to: "v7" },
      { from: "v1", to: "g1", showAt: 2, dashed: true },
      { from: "v3", to: "g3", showAt: 2, dashed: true },
      { from: "v6", to: "g4", showAt: 2, dashed: true },
      { from: "g1", to: "bst", showAt: 4, dashed: true },
      { from: "g3", to: "bst", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "An unbalanced line",
        text: "Seven leftover cells after a sort: two 1s, three 3s, two 4s. Balanced means the current maximum appears at least half as often as the leftover length. Right now 4 appears twice in seven cells — the predicate fails.",
        highlight: ["az", "v1", "v6", "v7", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6"]
      },
      {
        title: "Pay to delete, not to count",
        text: "Each index has a non-negative delete-cost. The score is the cheapest total that makes freq(max) ≥ n'/2, not how many cells you erase. Dropping everything is legal and expensive (the talk's 33 / 44-class totals).",
        highlight: ["v1", "v2", "v7", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "v7", to: "v1", color: "#f87171", label: "cost" }
        ]
      },
      {
        title: "Groups, not lonely copies",
        text: "Equal values collapse: ones cost 11, threes 19, fours 14. Costs are non-negative, so if 3 is the chosen max you keep every 3. Sorting paid n log n; groups are the next board drawing.",
        highlight: ["g1", "g3", "g4", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "v1", to: "g1", color: "#60a5fa", label: "bag" },
          { from: "v3", to: "g3", color: "#4ade80", label: "bag" },
          { from: "v6", to: "g4", color: "#fb923c", label: "bag" }
        ]
      },
      {
        title: "Candidate max = 4, drop k cheap",
        text: "Keep both 4s (freq 2). Five smaller cells remain; capacity is 2, so k = 3. Brute-scan the leftovers for the three cheapest (example sum 13). n candidates times n scans is O(n²) — the wall.",
        highlight: ["v6", "v7", "g1", "g3", "n3"],
        fail: ["v1", "v2"],
        hide: ["n0", "n1", "n2", "n4", "n5", "n6"],
        flows: [
          { from: "g1", to: "g4", color: "#f87171", label: "drop k" }
        ]
      },
      {
        title: "Put leftovers in a cost BST",
        text: "Need insert (old max-group joins leftovers), get the k-smallest cost, delete those k. A height-balanced tree keyed on cost does each touch in log n. Get-k still looks like k log n until the next two steps.",
        highlight: ["bst", "g1", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6"],
        flows: [
          { from: "g1", to: "bst", color: "#4ade80", label: "insert" }
        ]
      },
      {
        title: "Capacity up: undo the dearest",
        text: "Stepping from max=3 to max=4 grows leftover capacity to freq(4). Re-insert the most expensive items you had deleted — the reverse of 'drop cheapest'. Same tree, opposite flow.",
        highlight: ["g3", "g4", "bst", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6"],
        flows: [
          { from: "bst", to: "g3", color: "#c084fc", label: "undo" }
        ]
      },
      {
        title: "Flow: at most n in, n out",
        text: "Each new max can add at most its own frequency; frequencies sum to n, so inserts ≤ n. You cannot delete more than you inserted, so deletes ≤ n. Sort plus n tree ops is O(n log n) amortized — that is the point of the episode.",
        highlight: ["bst", "az", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "g4", to: "bst", color: "#4ade80", label: "≤ n add" },
          { from: "bst", to: "g1", color: "#fb923c", label: "≤ n del" }
        ]
      }
    ]
  }
});
