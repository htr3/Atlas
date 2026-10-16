window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 9,
  title: "Edit Distance of two strings - Real world application",
  video: "https://www.youtube.com/watch?v=XJ6e4BQYJ24",
  category: "Interview Prep",
  tagline: "Min insert, delete, replace cost to turn A into B — the DP behind autocorrect.",
  summary: "Edit distance is the cheapest sequence of inserts, deletes, and substitutions that turns string A into string B. Autocorrect ranks dictionary words by that cost. A naive wipe-and-retype is |A| deletes plus |B| inserts. The real recurrence takes a min of three prefix subproblems, rewritten so every index only looks backward, then fills a table. On PQQRST → QQTTPS the distance is 5.",

  theory: [
    {
      heading: "Turn A into B at minimum cost",
      body: "You are given two strings A and B. An <b>edit</b> is one of three operations on A: <b>insert</b> a character (cost Ca), <b>delete</b> a character (cost Cd), or <b>substitute / transition</b> a character into another (cost Ct). Edit distance is the cheapest sequence of those edits that makes A equal B. Phone keyboards use it as a closeness score: compare what you typed against dictionary words, sort by distance, suggest the nearest. Smaller distance means 'this is probably the word you meant'.",
      bullets: [
        "Operations live on A; B is the target.",
        "Three costs: Ca add, Cd delete, Ct transition.",
        "Autocorrect = sort candidates by this number."
      ]
    },
    {
      heading: "Worked strings and two dumb strategies",
      body: "The lecture uses A = <code>PQQRST</code> (length 6) and B = <code>QQTTPS</code> (length 6). Strategy one: delete every character of A and insert every character of B. Cost 6·Cd + 6·Ca. Strategy two: substitute in place, six transitions, cost 6·Ct. If every cost is 1 those totals are 12 versus 6, so replace-all wins. One refinement: Ct is <b>0 when the two letters already match</b> (Q→Q). Then the replace-all plan on this pair is 5, not 6. Both plans are feasible. Neither is claimed optimal yet.",
      bullets: [
        "Wipe+retype: |A|·Cd + |B|·Ca (= 12 if unit costs).",
        "Align and substitute: |A|·Ct, or less when equals cost 0.",
        "Unit-cost numbers on this pair: 12 vs 6 (or 5)."
      ]
    },
    {
      heading: "Three choices at the last character",
      body: "To convert A into B you always pick one edit that involves the current ends, then convert the leftovers. (1) Insert: pay Ca, then convert A into B without its last letter — you just supplied that letter. (2) Delete: drop A's last letter, pay Cd, convert the prefix of A into all of B. (3) Substitute: pay Ct to turn A's last letter into B's last letter (0 if they are equal), then convert the two prefixes. Take the <b>min</b> of those three. The same prefixes show up in several branches, which is the overlap that makes DP legal.",
      bullets: [
        "Insert last-of-B, delete last-of-A, or substitute the pair.",
        "Cost is positive, so insert-then-delete a letter is never useful.",
        "You never insert a letter you would then substitute — insert the target directly."
      ]
    },
    {
      heading: "Store prefixes as indices, look only backward",
      body: "You do not store the leftover strings. <code>i</code> means A[0..i], <code>j</code> means B[0..j]. A first draft of insert bumps i forward (you added onto A), which looks into the future of the table — bad for bottom-up. Rewrite: the only insert that can be optimal is inserting the character you actually need from B, which is equivalent to <b>deleting that character from B</b> (advance j backward). After that rewrite every child is <code>(i-1, j)</code>, <code>(i, j-1)</code>, or <code>(i-1, j-1)</code>. All three sit in the already-filled past.",
      bullets: [
        "dp[i][j] = min cost to turn A[0..i] into B[0..j].",
        "Insert ≡ consume one letter of B: dp[i][j-1] + Ca.",
        "Delete: dp[i-1][j] + Cd. Substitute: dp[i-1][j-1] + Ct."
      ]
    },
    {
      heading: "Fill (P, Q) and the rest of the table",
      body: "Empty prefixes cost 0. Turning ε into a prefix of B is j inserts; turning a prefix of A into ε is i deletes. First interior cell: A='P', B='Q'. Delete path: 1 + Cd = 2. Insert path: 1 + Ca = 2. Substitute P→Q: 0 + 1 = 1. Min is <b>1</b>. Keep applying the same three-way min. On these two length-6 strings the bottom-right cell is <b>5</b> when all unit costs are 1 (and Ct=0 on matches). The table is O(|A|·|B|) cells, O(1) work each.",
      bullets: [
        "dp[0][j] = j·Ca, dp[i][0] = i·Cd.",
        "First cell min(2, 2, 1) = 1 because P ≠ Q.",
        "Answer dp[|A|][|B|] = 5 on the worked pair."
      ]
    },
    {
      heading: "Reconstruct one cheapest path",
      body: "From the 5 you walk back to 0, always stepping to a parent whose cost plus that edit equals the cell. One path: delete P (1), keep Q→Q (0), keep Q→Q (0), substitute R→T (1), two down-steps that drop extra letters of B (the rewritten inserts, 1+1), keep S→S (0), delete leftover T from A (1). The five unit-cost edits are delete P, R→T, two B-deletes, and delete T; matches are free. Other parents that realise 4+1=5 are equally legal. The walk emits the actual edits, not just the number — useful for diff, spell-check, and alignment.",
      bullets: [
        "Backtrack: the parent whose cost + edit equals this cell.",
        "Unit-cost story: del P, keep QQ, R→T, skip extra B letters, keep S, del T.",
        "Several paths can share the same total 5."
      ]
    },
    {
      heading: "Complexity and where it shows up",
      body: "Time and memory are Θ(|A|·|B|) for the full table; you can keep two rows if you only need the number. This is Levenshtein distance when every cost is 1 (and match is 0). Approximate string matching, spell-check, and later alignment algorithms all sit on this recurrence. Understand the three backward children and you can derive the table in an interview without memorising code.",
      bullets: [
        "O(nm) time for |A|=n, |B|=m.",
        "Unit costs ⇒ Levenshtein; weighted costs are the same DP.",
        "Autocorrect is 'sort the dictionary by this DP'."
      ]
    }
  ],

  keyTerms: [
    { term: "Edit distance", def: "Minimum total cost of inserts, deletes, and substitutions that turn A into B." },
    { term: "Insert (Ca)", def: "Add a character to A. Optimally, add the next character of B — equivalent to advancing j." },
    { term: "Delete (Cd)", def: "Drop a character from A; advance i." },
    { term: "Transition (Ct)", def: "Replace A's current letter with B's. Cost 0 when the letters already match." },
    { term: "Prefix indices", def: "State (i, j) means convert A[0..i] into B[0..j], not the raw leftover strings." },
    { term: "Backward recurrence", def: "dp[i][j] = min(dp[i-1][j]+Cd, dp[i][j-1]+Ca, dp[i-1][j-1]+Ct)." },
    { term: "Levenshtein", def: "The unit-cost special case: every edit costs 1, a match costs 0." },
    { term: "Backtrack", def: "From dp[n][m] walk to a parent that explains the cell; that walk is one optimal edit list." }
  ],

  tradeoffs: [
    { pro: "Delete-all + insert-all is a correct upper bound in one line.", con: "Usually far from optimal (12 vs 5 on the example)." },
    { pro: "Replace-all uses length·Ct and is better when strings are aligned.", con: "Ignores inserts/deletes; different lengths break it." },
    { pro: "Full DP finds the true minimum and a recoverable path.", con: "O(nm) time and table; hopeless as a pairwise loop over a huge dictionary without pruning." },
    { pro: "Two-row rolling array saves space if you only need the number.", con: "You lose easy backtracking unless you store predecessors." }
  ],

  interviewTips: [
    "Name the three operations and whether match is free before writing a formula.",
    "Give the wipe+retype bound (12) and the align bound (6 or 5) so they see you can sanity-check.",
    "Write dp[i][j] as a min of delete, insert, substitute, all looking at smaller i or j.",
    "Say 'insert on A is delete on B' if they catch you stepping i forward.",
    "Fill the P vs Q cell out loud: min(2,2,1)=1, then quote the final 5.",
    "Offer to backtrack one path; autocorrect is the application they expect."
  ],

  scene: {
    nodes: [
      { id: "aP", label: "P", type: "point", pos: [-7.5, 0, -6], color: "#fb923c" },
      { id: "aQ1", label: "Q", type: "point", pos: [-4.5, 0, -6], color: "#fb923c" },
      { id: "aQ2", label: "Q", type: "point", pos: [-1.5, 0, -6], color: "#fb923c" },
      { id: "aR", label: "R", type: "point", pos: [1.5, 0, -6], color: "#fb923c" },
      { id: "aS", label: "S", type: "point", pos: [4.5, 0, -6], color: "#fb923c" },
      { id: "aT", label: "T", type: "point", pos: [7.5, 0, -6], color: "#fb923c" },
      { id: "bQ1", label: "Q", type: "point", pos: [-7.5, 0, 6], color: "#60a5fa" },
      { id: "bQ2", label: "Q", type: "point", pos: [-4.5, 0, 6], color: "#60a5fa" },
      { id: "bT1", label: "T", type: "point", pos: [-1.5, 0, 6], color: "#60a5fa" },
      { id: "bT2", label: "T", type: "point", pos: [1.5, 0, 6], color: "#60a5fa" },
      { id: "bP", label: "P", type: "point", pos: [4.5, 0, 6], color: "#60a5fa" },
      { id: "bS", label: "S", type: "point", pos: [7.5, 0, 6], color: "#60a5fa" },
      { id: "opI", label: "insert Ca", type: "point", pos: [-6, 0, 0], color: "#4ade80", showAt: 1 },
      { id: "opD", label: "delete Cd", type: "point", pos: [0, 0, 0], color: "#f87171", showAt: 1 },
      { id: "opS", label: "subst Ct", type: "point", pos: [6, 0, 0], color: "#c084fc", showAt: 1 },
      { id: "napp", label: "autocorrect sort", type: "note", pos: [0, 0, 3] },
      { id: "n12", label: "wipe 12 vs sub 6", type: "note", pos: [-9, 0, 3], showAt: 2 },
      { id: "nmin", label: "min of 3 edits", type: "note", pos: [9, 0, 3], showAt: 3 },
      { id: "nidx", label: "dp[i][j] prefixes", type: "note", pos: [-9, 0, -3], showAt: 4 },
      { id: "nback", label: "look backward", type: "note", pos: [9, 0, -3], showAt: 4 },
      { id: "ncell", label: "P vs Q → 1", type: "note", pos: [-10.5, 0, 7.5], showAt: 5 },
      { id: "nans", label: "distance = 5", type: "note", pos: [10.5, 0, 7.5], showAt: 6 }
    ],
    edges: [
      { from: "aP", to: "aQ1" },
      { from: "aQ1", to: "aQ2" },
      { from: "aQ2", to: "aR" },
      { from: "aR", to: "aS" },
      { from: "aS", to: "aT" },
      { from: "bQ1", to: "bQ2" },
      { from: "bQ2", to: "bT1" },
      { from: "bT1", to: "bT2" },
      { from: "bT2", to: "bP" },
      { from: "bP", to: "bS" },
      { from: "opI", to: "opD", showAt: 1 },
      { from: "opD", to: "opS", showAt: 1 },
      { from: "aP", to: "bQ1", label: "Ct", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "A to B, ranked by closeness",
        text: "Convert PQQRST into QQTTPS. Phones do this against a dictionary: smaller edit distance is a better autocorrect guess. We want the minimum cost, not any conversion.",
        highlight: ["aP", "aQ1", "aQ2", "aR", "aS", "aT", "bQ1", "bQ2", "bT1", "bT2", "bP", "bS", "napp"]
      },
      {
        title: "Insert, delete, substitute",
        text: "Three edits on A: add a letter (Ca), drop a letter (Cd), or transition a letter into another (Ct). Ct is 0 when the two letters are already equal. All costs are positive, so no-op cycles never help.",
        highlight: ["opI", "opD", "opS", "aP", "napp"],
        flows: [
          { from: "opI", to: "aP", color: "#4ade80", label: "+" },
          { from: "opD", to: "aP", color: "#f87171", label: "−" },
          { from: "opS", to: "bQ1", color: "#c084fc", label: "→" }
        ]
      },
      {
        title: "Two crude upper bounds",
        text: "Delete all six of A and insert all six of B: 12 if every cost is 1. Substitute in place six times: 6, or 5 once Q→Q is free. Both are legal. The DP will beat the 12 and match a genuine minimum.",
        highlight: ["aP", "aT", "bQ1", "bS", "n12", "opD", "opI"],
        flows: [
          { from: "aP", to: "opD", color: "#f87171", label: "del all" },
          { from: "opI", to: "bS", color: "#4ade80", label: "ins all" }
        ]
      },
      {
        title: "Min of three leftover problems",
        text: "At the ends: insert (pay Ca, finish A vs B minus last), delete (pay Cd, finish A minus last vs B), or substitute the last pair (pay Ct) and finish both prefixes. Take the min. Prefixes repeat across branches — overlapping subproblems.",
        highlight: ["opI", "opD", "opS", "nmin", "aT", "bS"],
        flows: [
          { from: "aT", to: "opD", color: "#f87171", label: "del T" },
          { from: "opI", to: "bS", color: "#4ade80", label: "ins S" },
          { from: "aT", to: "bS", color: "#c084fc", label: "T→S" }
        ]
      },
      {
        title: "Indices, all looking back",
        text: "State (i, j) is prefix A[0..i] vs B[0..j]. An insert that helps is exactly 'consume one letter of B', so the child is (i, j-1), not a future i+1. Delete is (i-1, j). Substitute is (i-1, j-1). Bottom-up is now legal.",
        highlight: ["nidx", "nback", "opI", "opD", "opS"]
      },
      {
        title: "First cell: P versus Q",
        text: "Empty-to-Q costs 1 (insert). P-to-empty costs 1 (delete). P→Q costs 1. So the three options are 2, 2, and 1. The cell is 1. Bases: dp[0][j] = j inserts, dp[i][0] = i deletes.",
        highlight: ["aP", "bQ1", "ncell", "opS"],
        flows: [
          { from: "aP", to: "bQ1", color: "#c084fc", label: "Ct=1" }
        ]
      },
      {
        title: "Table ends at 5; walk one path",
        text: "Fill O(nm) cells. Bottom-right is 5. One backtrack: delete P, keep Q, keep Q, R→T, drop extra T and P from B (the rewritten inserts), keep S, delete leftover T. Five unit edits, matches free. That list is what a spell-checker would apply.",
        highlight: ["aP", "aQ1", "aQ2", "aR", "aS", "aT", "bQ1", "bQ2", "bT1", "bS", "nans"],
        flows: [
          { from: "aP", to: "opD", color: "#f87171", label: "del P" },
          { from: "aR", to: "bT1", color: "#c084fc", label: "R→T" },
          { from: "aS", to: "bS", color: "#4ade80", label: "S=S" }
        ]
      }
    ]
  }
});
