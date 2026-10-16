window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 75,
  title: "9.2 Rabin-Karp String Matching Algorithm",
  video: "https://www.youtube.com/watch?v=qQ8vS2btsxI",
  category: "Strings, Trees & Arrays",
  tagline: "Hash the window, roll it in O(1), then verify — spurious hits are the catch.",
  summary: "Rabin-Karp matches a pattern by comparing hash codes of every m-letter window of the text instead of every character. A rolling hash updates the next window in constant time: drop the leaving letter, add the entering one. A weak sum-hash collides often (spurious hits) and can degrade to Θ(mn). The Rabin fingerprint — a base-d polynomial, optionally mod a word-sized prime — cuts collisions. Average time is Θ(n−m+1); worst case remains Θ(mn) if every window still needs a full verify.",

  theory: [
    {
      heading: "Hash the pattern, then slide",
      body: "Text T of length n, pattern P of length m. Naive matching compares letters. Rabin-Karp first maps each letter to a small code (the lecture uses a=1 … instead of ASCII 97 so the arithmetic stays tiny) and folds P into one number with a <b>hash function</b>. Then it hashes every window of m consecutive text letters. If the two numbers differ, the window cannot be P — no character comparisons. If they agree, <i>then</i> compare letters to confirm. First example: P=<code>AAB</code> hashes to 1+1+2=4; windows of T hash to 3,3,3, then 4, which verifies as indices 4–6.",
      bullets: [
        "Unequal hashes ⇒ skip the window in O(1).",
        "Equal hashes ⇒ verify characters (could still be a collision).",
        "Codes can be ASCII; the lecture uses 1..10 to keep numbers small."
      ]
    },
    {
      heading: "Rolling hash in constant time",
      body: "You do not re-sum m letters each step. From the current window hash, <b>subtract the code of the letter leaving on the left and add the code of the letter entering on the right</b>. That slide is a <b>rolling hash</b>. Example: window ABC hashes to 6; drop A (1), add D (4) → 9; continue until a window of <code>BBC</code>-style letters hits the pattern hash 10 and verifies letter-by-letter. Average work is about <b>n−m+1</b> window hashes plus a handful of verifications.",
      bullets: [
        "Next hash = current − code(out) + code(in) for a sum hash.",
        "Each slide is O(1) after the first window's O(m) setup.",
        "Average: Θ(n−m+1) if collisions are rare."
      ]
    },
    {
      heading: "Spurious hits and Θ(mn)",
      body: "A too-simple hash (plain sum) maps many different m-grams to the same number. The lecture's worst-case text keeps producing hash 7 against a pattern whose hash is also 7; each 'hit' still fails the character check. Those false alarms are <b>spurious hits</b>. If they happen at every offset and you compare almost all m letters, time climbs to <b>Θ(mn)</b> — no better than naive. The collision is the hash function's fault, not the sliding idea.",
      bullets: [
        "Spurious hit: hashes equal, strings not equal.",
        "Weak h (sum of codes) collides constantly on similar alphabets.",
        "Worst case of Rabin-Karp is still Θ(mn)."
      ]
    },
    {
      heading: "Rabin fingerprint (polynomial hash)",
      body: "Treat the m codes as digits in base d. For the lecture's 10-letter alphabet, d=10: hash(<code>DBA</code>)=4·10² + 2·10¹ + 1·10⁰ = 421. For 26 letters use 26; for full ASCII, 127. Same pattern that collided under a sum now hashes windows to 331, 313, 133, 331, 311, … never 421 until the true <code>DBA</code> window. That polynomial is the <b>Rabin fingerprint</b>. Rolling it: from hash h of window P₁…Pₘ, the next value is <code>(h − P₁·d^{m−1}) · d + P_{m+1}</code>. Numerically: 331 − 3·100 = 31, ×10 = 310, +3 = 313.",
      bullets: [
        "h(P) = Σ Pᵢ · d^{m−i} (1-based i).",
        "Roll: subtract the leading digit's place value, multiply by d, add the new letter.",
        "Stronger hash ⇒ fewer spurious hits, not a better worst-case class."
      ]
    },
    {
      heading: "Modulus, overflow, and collisions again",
      body: "Powers of d grow past a 32-bit int. Take the whole fingerprint <b>mod q</b> (often 2³¹ or a large prime) so values stay in the word. Rolling hash uses the same mod. Mod shrinks the range, so distinct strings can again share a residue — spurious hits return, and the algorithm can lean toward Θ(mn). You may invent any hash if you know the alphabet; the core idea stays: compare codes first, characters only on a hit.",
      bullets: [
        "Mod avoids overflow; it does not preserve uniqueness.",
        "Average remains Θ(n−m+1) when q and d are well chosen.",
        "Always verify on a hash match; never trust the number alone."
      ]
    }
  ],

  keyTerms: [
    { term: "Hash function", def: "Maps an m-letter string to one number so unequal numbers prove the window is not the pattern." },
    { term: "Rolling hash", def: "O(1) update of the next window from the previous hash by dropping the outgoing letter and adding the incoming one." },
    { term: "Spurious hit", def: "Window hash equals the pattern hash but the characters differ — a collision that forces a wasted verify." },
    { term: "Rabin fingerprint", def: "Polynomial hash Σ codeᵢ · d^{m−i}; d is the alphabet size (10 in the lecture's toy codes, 26 or 127 in real alphabets)." },
    { term: "Verify", def: "Character-by-character compare run only after hashes match." },
    { term: "Mod q", def: "Reduce the fingerprint to fit a machine word; reintroduces collisions." },
    { term: "Average Θ(n−m+1)", def: "One hash per window when spurious hits are rare; first window still costs Θ(m)." }
  ],

  tradeoffs: [
    { pro: "A good fingerprint skips almost every non-match in O(1) per window.", con: "Worst case is still Θ(mn) if hashes collide at every offset." },
    { pro: "Rolling arithmetic is a few adds/muls, independent of m after setup.", con: "A weak sum-hash makes 'rolling' pointless because you still verify constantly." },
    { pro: "Mod q keeps numbers inside an int.", con: "Mod creates new collisions; you must still verify, and the worst case creeps back." },
    { pro: "You can tune d and q to the alphabet you actually have.", con: "A bad custom hash is as dangerous as the lecture's sum of 1..10 codes." }
  ],

  interviewTips: [
    "Say the pipeline: hash P, roll windows, compare numbers, verify characters only on equality.",
    "Write the roll for a polynomial: (h − lead·d^{m−1})·d + next, optionally mod q.",
    "Name spurious hits and quote worst-case Θ(mn) versus average Θ(n−m+1).",
    "Work the numbers: DBA → 4·100+2·10+1=421; next window from 331 is 331−300=31, ×10+3=313.",
    "If they mention overflow, add mod 2^31 and immediately say collisions can return.",
    "Contrast with KMP: KMP is always Θ(n+m); Rabin-Karp is simpler to code but only expected-linear."
  ],

  scene: {
    nodes: [
      { id: "zwin", label: "Windows of T", type: "zone", pos: [0, 0, -5], size: [22, 3.4] },
      { id: "w1", label: "CCA=331", type: "cache", pos: [-9, 0, -5] },
      { id: "w2", label: "CAC=313", type: "cache", pos: [-3, 0, -5] },
      { id: "w3", label: "ACA=133", type: "cache", pos: [3, 0, -5] },
      { id: "w4", label: "DBA=421", type: "cache", pos: [9, 0, -5], color: "#4ade80" },
      { id: "pat", label: "P DBA", type: "server", pos: [-8, 0, 0] },
      { id: "hp", label: "h(P)=421", type: "note", pos: [-8, 3, 3] },
      { id: "sum", label: "Weak sum: 4+2+1=7", type: "note", pos: [2, 3, 3], showAt: 0 },
      { id: "roll", label: "331-300, x10 +3 = 313", type: "note", pos: [8, 3, -7.5], showAt: 1 },
      { id: "spur", label: "Spurious hit: hash=hash, text≠P", type: "note", pos: [8, 3, 3], showAt: 2 },
      { id: "poly", label: "4*10^2 + 2*10 + 1", type: "note", pos: [-8, 3, 7], showAt: 3 },
      { id: "modn", label: "mod q: overflow vs collisions", type: "note", pos: [2, 3, 7], showAt: 5 },
      { id: "ok", label: "Verify D,B,A  indices  hit", type: "note", pos: [8, 3, 7], showAt: 4 },
      { id: "avg", label: "Avg n-m+1, worst mn", type: "note", pos: [-8, 3, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "w1", to: "w2", label: "roll" },
      { from: "w2", to: "w3", label: "roll" },
      { from: "w3", to: "w4", label: "roll" },
      { from: "pat", to: "w1", label: "compare h", dashed: true },
      { from: "pat", to: "w4", label: "421=421", showAt: 4 }
    ],
    steps: [
      {
        title: "One number for the whole pattern",
        text: "Codes a=1,b=2,… turn DBA into a hash. A toy sum is 4+2+1=7. Any text window whose sum is not 7 is rejected without looking at letters.",
        highlight: ["pat", "hp", "sum", "zwin"],
        hide: ["roll", "spur", "poly", "modn", "ok", "avg"],
        flows: [
          { from: "pat", to: "w1", color: "#60a5fa", label: "h(P)" }
        ]
      },
      {
        title: "Roll the window in O(1)",
        text: "Do not re-add three letters. From 331 drop the leading 3·10², multiply the rest by 10, add the new code 3: 31×10+3=313. That is the rolling hash.",
        highlight: ["w1", "w2", "roll"],
        hide: ["sum", "spur", "poly", "modn", "ok", "avg"],
        flows: [
          { from: "w1", to: "w2", color: "#fb923c", label: "slide" }
        ]
      },
      {
        title: "Spurious hits from a weak hash",
        text: "If every window sums to 7 like the pattern, you 'hit' every time and still fail the character check. Those wasted verifies are spurious hits and push the runtime to Θ(mn).",
        highlight: ["w1", "w2", "w3", "pat", "spur", "sum"],
        fail: ["w1", "w2", "w3"],
        hide: ["roll", "poly", "modn", "ok", "avg"],
        flows: [
          { from: "pat", to: "w1", color: "#f87171", label: "false 7" },
          { from: "pat", to: "w2", color: "#f87171", label: "false 7" }
        ]
      },
      {
        title: "Rabin fingerprint 421",
        text: "Switch to a base-10 polynomial: 4·100 + 2·10 + 1 = 421. Windows become 331, 313, 133, 311 — none equal 421 — so the old collisions disappear.",
        highlight: ["pat", "hp", "poly", "w1", "w2", "w3"],
        hide: ["sum", "roll", "spur", "modn", "ok", "avg"],
        flows: [
          { from: "pat", to: "w4", color: "#c084fc", label: "fingerprint" }
        ]
      },
      {
        title: "Hash match, then verify letters",
        text: "When a window hashes to 421, compare D, B, A. They match, so the pattern sits at that offset. Never accept on the number alone.",
        highlight: ["w4", "pat", "ok", "hp"],
        hide: ["sum", "roll", "spur", "poly", "modn", "avg"],
        flows: [
          { from: "pat", to: "w4", color: "#4ade80", label: "verify" }
        ]
      },
      {
        title: "Mod q for overflow",
        text: "Large d^{m} overflows an int. Take the fingerprint mod q (e.g. 2³¹). Rolling uses the same mod. Distinct strings can now share a residue, so spurious hits can return.",
        highlight: ["modn", "pat", "hp"],
        hide: ["sum", "roll", "spur", "poly", "ok", "avg"]
      },
      {
        title: "Average n−m+1, worst mn",
        text: "Good d and q: about one O(1) roll per window, Θ(n−m+1) average. Pathological collisions: verify almost every window, Θ(mn) like naive. KMP is the algorithm with a guaranteed n+m.",
        highlight: ["avg", "zwin", "w4"],
        hide: ["sum", "roll", "spur", "poly", "modn", "ok"]
      }
    ]
  }
});
