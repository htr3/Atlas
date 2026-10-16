window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "interview",
  id: 7,
  title: "Divide and Conquer - Odd Even Subarrays",
  video: "https://www.youtube.com/watch?v=Fgp6CKSH_b4",
  category: "Interview Prep",
  tagline: "Equal odd and even counts: D&C in O(n log n), prefix frequencies in O(n).",
  summary: "Count subarrays whose odd count equals their even count. Checking every pair of ends is O(n^2). Split the array, add the two halves, then count segments that cross the mid 'solder' using a running odd-minus-even score. That is O(n log n). A prefix-frequency map of the same score solves it in O(n).",

  theory: [
    {
      heading: "What makes a subarray special",
      body: "You are given A[0..n-1]. A subarray (contiguous slice) is <b>special</b> when it contains as many odd numbers as even numbers. On <code>[1, 2, 3, 4]</code> the odds are 1 and 3, the evens 2 and 4, so the whole array counts, and so do [1,2], [2,3], [3,4] — four special slices. Single cells are never special: one odd or one even cannot tie.",
      bullets: [
        "Equal odd count and even count, not equal sums.",
        "Only contiguous slices, not subsequences.",
        "Length must be even (odd+even pairs)."
      ]
    },
    {
      heading: "Brute force is every pair of ends",
      body: "Every subarray is a start index and an end index. There are Θ(n^2) of those (the lecture quotes nC2). For each pair you can tally odds and evens in linear time, which is too slow, or you can maintain a running difference while the right end walks, which is still Θ(n^2) pairs. That is the baseline the rest of the talk beats.",
      bullets: [
        "Choose two endpoints in a line of n cells.",
        "Θ(n^2) candidate slices.",
        "Fine for n ~ 10^3, not for n ~ 10^5."
      ]
    },
    {
      heading: "Split, recurse, then solder the middle",
      body: "Cut at n/2. Recurse on the left half and on the right half. A one-element slice returns 0. The answer for the parent is (left count) + (right count) + (slices that <b>cross the cut</b>). Those crossing slices were lost when you split — they all contain the two cells that sit on the join. The lecture calls that join the <b>soldering point</b>: you are welding the two pieces and counting the new seams.",
      bullets: [
        "f(A) = f(left) + f(right) + crossings through mid.",
        "Base: |A| = 1 → 0 special subarrays.",
        "On [1..8] the two halves each contribute 4."
      ]
    },
    {
      heading: "Score K = (#odd) − (#even)",
      body: "At the solder (the two middle cells) compute K = odds − evens. Two cells give three possibilities: 0 (one odd, one even), +2 (both odd), −2 (both even). Walk right from the join: add +1 on odd, −1 on even, and record the running K at every end index. Walk left the same way for start indices. A crossing subarray is special exactly when a left prefix score <b>cancels</b> a right prefix score (their K values sum to zero around the join). On [1,2,3,4,5,6,7,8] the right walk past 4|5 hits 6,7,8 with scores −1, 0, −1 and the left walk hits 0 and ±1 in a matching pattern — eight cancelling pairs. 4 + 4 + 8 = <b>16</b>.",
      bullets: [
        "Odd: +1. Even: −1. Special ⇔ total K = 0.",
        "Match each right end's K with left starts that hold −K.",
        "Tiny check: [1,2,3,4] halves are 1+1, crossings 2, total 4."
      ]
    },
    {
      heading: "O(n log n) for the tree",
      body: "The recursion tree has height log n because each call halves the length. At one level, the left and right walks visit each element a constant number of times, so a level costs O(n). Total <code>O(n log n)</code>. That already passes typical contest limits. The merge is the only place you do original work; the two recursive counts are free once the children return.",
      bullets: [
        "Height log n, O(n) per level.",
        "Same shape as mergesort's recurrence.",
        "Good enough, but not the last word."
      ]
    },
    {
      heading: "Linear scan with prefix frequencies",
      body: "Fix the end index i and ask how many starts make A[start..i] special. Map every value to +1 (odd) or −1 (even) and take prefix sums of that stream. If prefix[i] = prefix[j], the slice (j, i] has sum 0, hence equal odds and evens. So at i you add the <b>frequency</b> of the current prefix among earlier prefixes, then increment that frequency. If the current prefix is 0, also add one for the slice that starts at the beginning of the array. Each step is a hash-map lookup — O(1) expected, O(n) overall. On [1,2,3,4,5,6,7,8] the prefixes are 1, 0, 1, 0, 1, 0, 1, 0 and the same 16 falls out by counting repeats (plus the extra one whenever prefix hits 0).",
      bullets: [
        "parity[i] = +1 if odd, −1 if even.",
        "ans += freq[prefix]; then freq[prefix]++.",
        "If prefix == 0, ans += 1 for A[0..i]."
      ]
    },
    {
      heading: "The longer parity example",
      body: "The talk also walks a mixed list <code>1, 1, 0, 3, 3, 9, 8, 8, 8, 14</code>, rewritten as bits 1,1,0,1,1,1,0,0,0,0. Running K becomes 1, 2, 1, 2, 3, 4, 3, 2, 1, 0. At each end you only look up how many times that K has already appeared. First time you see a 1 there is no earlier 1, so zero new slices; the next 1 (third cell) finds one earlier 1, and so on. When K finally hits 0 you count previous zeros (none) plus the whole-prefix bonus. Coming up with the map is the hard part; the loop is a few lines.",
      bullets: [
        "Values themselves do not matter — only parity.",
        "History of prefix K is the whole state.",
        "D&C and the map both count the same set; pick the one you can code cleanly."
      ]
    }
  ],

  keyTerms: [
    { term: "Special subarray", def: "A contiguous slice with equally many odd and even values." },
    { term: "Soldering point", def: "The two mid cells where the split halves are welded; every crossing slice contains them." },
    { term: "K score", def: "Running (#odd − #even), or +1/−1 prefix. Special ⇔ K = 0 on the slice." },
    { term: "Crossing count", def: "Pairs of left-start and right-end whose K values cancel across the join." },
    { term: "D&C recurrence", def: "f = f(left) + f(right) + crossings. Base of one cell is 0." },
    { term: "Prefix frequency", def: "Map from prefix K to how often it has appeared; equal prefixes bracket a special slice." },
    { term: "O(n log n)", def: "log n levels of O(n) left/right walks." },
    { term: "O(n) map", def: "One pass, hash the prefixes, add freq[K] at each end." }
  ],

  tradeoffs: [
    { pro: "Brute pairs: trivial to write and to prove.", con: "Θ(n^2) slices; TLE on large n." },
    { pro: "Divide and conquer: same idea as mergesort, clear merge story.", con: "O(n log n) and a fiddly crossing count on the whiteboard." },
    { pro: "Prefix + hashmap: O(n) expected, tiny loop.", con: "Easy to forget the prefix==0 bonus or to hash after you add instead of before." },
    { pro: "Both correct answers equal 16 on [1..8].", con: "If they disagree, your K sign or 0-based split is wrong." }
  ],

  interviewTips: [
    "Restate: count subarrays with #odd = #even, not maximum length.",
    "Give O(n^2) pairs first, then split-and-solder, then the prefix map if they ask for faster.",
    "Define K = odd − even (or +1/−1) before walking the example [1,2,3,4,5,6,7,8] → 16.",
    "On the D&C merge, say 'only slices through the mid are missing' so they hear why you walk both ways.",
    "For the O(n) pass: ans += freq[prefix]; then freq[prefix]++. Special-case prefix 0.",
    "A length-1 slice is 0; if your code returns n you mapped parity wrong."
  ],

  scene: {
    nodes: [
      { id: "c1", label: "1", type: "point", pos: [-10.5, 0, 4.5], color: "#fb923c" },
      { id: "c2", label: "2", type: "point", pos: [-7.5, 0, 4.5], color: "#60a5fa" },
      { id: "c3", label: "3", type: "point", pos: [-4.5, 0, 4.5], color: "#fb923c" },
      { id: "c4", label: "4", type: "point", pos: [-1.5, 0, 4.5], color: "#60a5fa" },
      { id: "c5", label: "5", type: "point", pos: [1.5, 0, 4.5], color: "#fb923c" },
      { id: "c6", label: "6", type: "point", pos: [4.5, 0, 4.5], color: "#60a5fa" },
      { id: "c7", label: "7", type: "point", pos: [7.5, 0, 4.5], color: "#fb923c" },
      { id: "c8", label: "8", type: "point", pos: [10.5, 0, 4.5], color: "#60a5fa" },
      { id: "p1", label: "K=1", type: "point", pos: [-10.5, 0, -1.5], color: "#c084fc", showAt: 6 },
      { id: "p2", label: "K=0", type: "point", pos: [-7.5, 0, -1.5], color: "#4ade80", showAt: 6 },
      { id: "p3", label: "K=1", type: "point", pos: [-4.5, 0, -1.5], color: "#c084fc", showAt: 6 },
      { id: "p4", label: "K=0", type: "point", pos: [-1.5, 0, -1.5], color: "#4ade80", showAt: 6 },
      { id: "p5", label: "K=1", type: "point", pos: [1.5, 0, -1.5], color: "#c084fc", showAt: 6 },
      { id: "p6", label: "K=0", type: "point", pos: [4.5, 0, -1.5], color: "#4ade80", showAt: 6 },
      { id: "p7", label: "K=1", type: "point", pos: [7.5, 0, -1.5], color: "#c084fc", showAt: 6 },
      { id: "p8", label: "K=0", type: "point", pos: [10.5, 0, -1.5], color: "#4ade80", showAt: 6 },
      { id: "nprob", label: "#odd = #even", type: "note", pos: [0, 0, 7.5] },
      { id: "nbrute", label: "nC2 pairs O(n^2)", type: "note", pos: [-9, 0, 1.5], showAt: 1 },
      { id: "ncut", label: "solder 4 | 5", type: "note", pos: [0, 0, 1.5], showAt: 2 },
      { id: "nhalves", label: "4 + 4 halves", type: "note", pos: [9, 0, 1.5], showAt: 2 },
      { id: "nk", label: "K = odd − even", type: "note", pos: [-9, 0, -4.5], showAt: 3 },
      { id: "ncross", label: "8 crossings", type: "note", pos: [0, 0, -4.5], showAt: 4 },
      { id: "nans", label: "4+4+8 = 16", type: "note", pos: [9, 0, -4.5], showAt: 4 },
      { id: "nmap", label: "freq[K] → O(n)", type: "note", pos: [0, 0, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "c1", to: "c2" },
      { from: "c2", to: "c3" },
      { from: "c3", to: "c4" },
      { from: "c4", to: "c5", label: "mid", showAt: 2 },
      { from: "c5", to: "c6" },
      { from: "c6", to: "c7" },
      { from: "c7", to: "c8" },
      { from: "c1", to: "p1", dashed: true, showAt: 6 },
      { from: "c8", to: "p8", dashed: true, showAt: 6 }
    ],
    steps: [
      {
        title: "Count balanced slices",
        text: "Array [1, 2, 3, 4, 5, 6, 7, 8]. A slice is special when it has as many odds as evens. Orange is odd, blue is even. [1,2,3,4] alone already has four such slices.",
        highlight: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "nprob"]
      },
      {
        title: "Every start–end pair",
        text: "Brute force enumerates all endpoint pairs — nC2, Θ(n^2) subarrays — and checks the odd/even counts. Correct, slow, and the thing you mention first.",
        highlight: ["c1", "c8", "nbrute", "nprob"],
        flows: [
          { from: "c1", to: "c8", color: "#f87171", label: "all pairs" }
        ]
      },
      {
        title: "Split and recurse",
        text: "Cut between 4 and 5. Each half of [1..4] and [5..8] has 4 special slices of its own (the D&C answers). A one-cell base case returns 0. You still owe every slice that crosses the cut.",
        highlight: ["c4", "c5", "ncut", "nhalves"],
        flows: [
          { from: "c1", to: "c4", color: "#60a5fa", label: "left" },
          { from: "c5", to: "c8", color: "#4ade80", label: "right" }
        ]
      },
      {
        title: "K around the solder",
        text: "The join 4|5 is the soldering point. K = (#odd − #even) on those two cells, then walk right +1/−1 (6 even → −1, 7 odd → 0, 8 even → −1) and left the same way. Three local K values: 0, +2, or −2.",
        highlight: ["c4", "c5", "c6", "c7", "c8", "nk", "ncut"],
        flows: [
          { from: "c5", to: "c6", color: "#fb923c", label: "−1" },
          { from: "c6", to: "c7", color: "#fb923c", label: "+1" }
        ]
      },
      {
        title: "Cancel K, add the crossings",
        text: "A left start cancels a right end when their scores sum to zero across the join. On this array that matching produces 8 crossing slices. Total 4 + 4 + 8 = 16. The same check on [1,2,3,4] is 1+1+2 = 4.",
        highlight: ["c3", "c4", "c5", "c6", "ncross", "nans", "nhalves"],
        flows: [
          { from: "c3", to: "c6", color: "#c084fc", label: "cancel" }
        ]
      },
      {
        title: "Tree is n log n",
        text: "Halving gives height log n. Each level walks every cell a constant number of times, so O(n) per level and O(n log n) overall — mergesort-shaped, and usually inside the time limit.",
        highlight: ["ncut", "nans", "c1", "c8"]
      },
      {
        title: "Prefix K and a frequency map",
        text: "Rewrite odd as +1, even as −1. Prefixes on [1..8] are 1,0,1,0,1,0,1,0. Equal prefixes mean the slice between has K = 0. At each end, add freq[K], then increment; if K is 0 also count the prefix from index 0. Same 16, now in O(n).",
        highlight: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "nmap", "nans"],
        flows: [
          { from: "p2", to: "p4", color: "#4ade80", label: "K=0 again" },
          { from: "p4", to: "p6", color: "#4ade80", label: "match" }
        ]
      }
    ]
  }
});
