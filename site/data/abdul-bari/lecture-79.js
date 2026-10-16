window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "abdul-bari",
  id: 79,
  title: "Hashing Technique - Simplified",
  video: "https://www.youtube.com/watch?v=mFY0J5W8Udk",
  category: "Strings, Trees & Arrays",
  tagline: "From O(n) and O(log n) toward O(1): map keys with h(x), then fix collisions.",
  summary: "Linear search is Θ(n) on an unordered array; binary search is Θ(log n) but needs a sorted array. Hashing tries Θ(1) by storing key x at index h(x). The identity h(x)=x is one-to-one and wastes a huge table. h(x)=x mod m is many-to-one and collides (3 and 13 both hit slot 3 when m=10). Open hashing (chaining) hangs a linked list off the slot. Closed hashing probes: linear (h+i) clusters; quadratic (h+i²) jumps gaps. Expected search stays better than log n, not strictly O(1) once collisions exist.",

  theory: [
    {
      heading: "The search ladder we already know",
      body: "Linear search: keys in arbitrary order, scan left to right, Θ(n). Binary search: keys must be sorted, probe the middle, Θ(log n) — but you paid to sort. The lecture's next ask is a method whose probe is <b>constant time</b>: from n, to log n, to 1. That demand is what hashing is for.",
      bullets: [
        "Unordered array ↔ linear scan.",
        "Sorted array ↔ binary search, extra sort cost.",
        "Want: locate x without scanning or sorting."
      ]
    },
    {
      heading: "Ideal hash: the key is the index",
      body: "Store 8 at index 8, 3 at 3, 13 at 13. Search 10: go to index 10. Search 12: go to 12, empty, miss. That is Θ(1). In math: key space --h--> hash table with <b>h(x)=x</b>, a one-to-one (ideal) hash. Problem: key 50 needs index 50. A handful of keys force a long vacant array. Time is saved by wasting memory.",
      bullets: [
        "h(x)=x is one-to-one: no collisions, huge table.",
        "Empty slots are the price of identity mapping.",
        "We will change h so many keys share a small table."
      ]
    },
    {
      heading: "Compression and collision",
      body: "Functions are one-to-one or many-to-one. Replace h with <b>h(x)=x mod m</b> (m = table size; lecture uses m=10). Then 8→8, 3→3, but 13→3 as well: two keys, one slot — a <b>collision</b>. Almost any non-identity h on a smaller table is many-to-one. Collision resolution, not the mod itself, is the rest of hashing. Two families: <b>open hashing</b> (chaining) and <b>closed hashing</b> (linear / quadratic probing).",
      bullets: [
        "m is the number of slots you are willing to allocate.",
        "Collision: h(k1)=h(k2) for k1≠k2.",
        "Search still starts at h(x); then you walk the overflow structure."
      ]
    },
    {
      heading: "Chaining (open hashing)",
      body: "The table holds list heads, not keys. 8 hangs a node at slot 8; 3 a node at 3; 13 hashes to 3 so you append 13 on that same chain. Search 13: compute 13 mod 10=3, then scan the linked list at 3. Time is no longer 1 — it is the chain length — but still typically better than log n if chains stay short. Load is unbounded: the table never 'fills', lists just grow.",
      bullets: [
        "Slot index = h(x); payload lives in heap nodes.",
        "Search = hash + list walk.",
        "Expected time depends on load factor n/m, not on sorted order."
      ]
    },
    {
      heading: "Linear probing and clustering",
      body: "Closed hashing stores keys in the table. On collision, take the next free slot. Formally a family h'(x,i) = (h(x)+f(i)) mod m with <b>f(i)=i</b>, i=0,1,2,… So 13: i=0 → slot 3 full; i=1 → slot 4 empty, store there. Search 4: go to h(4)=4, not 4, look at 5 (found). Search 24: start at 4, walk 5,6,… until an <b>empty</b> slot proves a miss. Consecutive occupied slots are a <b>cluster</b>: one collision makes the next insert more likely to join the blob, and searches walk the whole run. That is linear probing's defect.",
      bullets: [
        "Probe sequence: h, h+1, h+2, … (mod m).",
        "Stop a failed search at the first hole (unless you use tombstones, not in this lecture).",
        "Clusters turn expected O(1) into long scans."
      ]
    },
    {
      heading: "Quadratic probing: jump i²",
      body: "Same wrapper h'(x,i)=(h(x)+f(i)) mod m but <b>f(i)=i²</b>. 8 and 3 sit still. 13: i=0 → 3 full; i=1 → 4. Key 23: i=0 → 3 full; i=1 → 4 full; i=2 → 3+4=7, store at 7 — a gap away from the cluster. Keys that collided at 3 no longer sit in a solid block, so later searches skip empty cells between 4 and 7. Time is still not worst-case O(1), but clustering (and therefore probe length) drops. The lecture stops here: chaining, linear, quadratic — three ways to live with many-to-one h.",
      bullets: [
        "Only f(i) changes: i versus i².",
        "Gaps between probes are the point.",
        "Hashing beats log n in typical load; it is not a guarantee of 1 after collisions."
      ]
    }
  ],

  keyTerms: [
    { term: "Hash function", def: "h maps a key to a table index; identity h(x)=x is ideal and wasteful." },
    { term: "Hash table", def: "The array (size m) that stores keys or chain heads." },
    { term: "Collision", def: "Two distinct keys with the same h(x); 3 and 13 both map to 3 when m=10." },
    { term: "Chaining", def: "Open hashing: store a linked list at each slot." },
    { term: "Linear probing", def: "Closed hashing with f(i)=i: try the next consecutive slot." },
    { term: "Quadratic probing", def: "Closed hashing with f(i)=i²: skip ahead to break clusters." },
    { term: "Clustering", def: "A run of occupied slots that linear probing grows and then has to scan." }
  ],

  tradeoffs: [
    { pro: "h(x)=x is O(1) with no collisions.", con: "Table size follows the key universe, not the number of keys." },
    { pro: "Mod-m packing uses a small table.", con: "Many-to-one mapping forces a collision strategy; pure O(1) is gone." },
    { pro: "Chaining is simple and never 'table full'.", con: "Search walks a list; extra pointer memory per key." },
    { pro: "Linear probing is in-place and cache-friendly.", con: "Primary clustering makes probe sequences long." },
    { pro: "Quadratic probing spreads colliding keys.", con: "Not every slot is always reachable; analysis is harder than chaining." }
  ],

  interviewTips: [
    "Build the ladder: linear Θ(n), binary Θ(log n) needing sort, hash aiming at Θ(1).",
    "Draw h(x)=x mod 10 with keys 8,3,13 and circle the collision at index 3.",
    "Name open vs closed: chaining versus probing in the table.",
    "Write h'(x,i)=(h(x)+f(i)) mod m with f(i)=i (linear) and f(i)=i² (quadratic).",
    "Search in linear probing: start at h(x), scan until the key or an empty slot.",
    "Say expected time is better than log n, not O(1) once collisions exist."
  ],

  scene: {
    nodes: [
      { id: "zt", label: "Hash table m=10", type: "zone", pos: [0, 0, 2.5], size: [22, 3.6] },
      { id: "s0", label: "0", type: "point", pos: [-10, 0, 2.5] },
      { id: "s3", label: "3", type: "point", pos: [-4, 0, 2.5], color: "#fb923c" },
      { id: "s4", label: "4", type: "point", pos: [-1, 0, 2.5], color: "#60a5fa" },
      { id: "s6", label: "6", type: "point", pos: [4, 0, 2.5] },
      { id: "s7", label: "7", type: "point", pos: [7, 0, 2.5], color: "#c084fc" },
      { id: "s8", label: "8", type: "point", pos: [10, 0, 2.5], color: "#4ade80" },
      { id: "k8", label: "key 8", type: "server", pos: [-9, 0, -4] },
      { id: "k3", label: "key 3", type: "server", pos: [-5, 0, -4] },
      { id: "k13", label: "key 13", type: "server", pos: [-1, 0, -4] },
      { id: "k23", label: "key 23", type: "server", pos: [5, 0, -4], showAt: 4 },
      { id: "ch3", label: "3 → 13", type: "queue", pos: [-4, 0, 6], showAt: 2 },
      { id: "n0", label: "Linear n, binary log n, want 1", type: "note", pos: [-8, 3, 7] },
      { id: "n1", label: "h(x)=x  one-to-one, huge table", type: "note", pos: [8, 3, 7], showAt: 0 },
      { id: "n2", label: "13 mod 10 = 3  collision", type: "note", pos: [8, 3, -7], showAt: 1 },
      { id: "n3", label: "Chain at slot 3", type: "note", pos: [-8, 3, -7], showAt: 2 },
      { id: "n4", label: "Linear probe: 13 sits at 4", type: "note", pos: [0, 3, -7], showAt: 3 },
      { id: "n5", label: "Quadratic: 23 -> slot 7 (3+2^2)", type: "note", pos: [8, 3, 2], showAt: 4 }
    ],
    edges: [
      { from: "s3", to: "s4" },
      { from: "s4", to: "s6" },
      { from: "s6", to: "s7" },
      { from: "s7", to: "s8" },
      { from: "k8", to: "s8", label: "h=8" },
      { from: "k3", to: "s3", label: "h=3" },
      { from: "k13", to: "s3", label: "h=3", showAt: 1, dashed: true },
      { from: "s3", to: "ch3", showAt: 2 },
      { from: "k13", to: "s4", label: "probe +1", showAt: 3 },
      { from: "k23", to: "s7", label: "+ i^2", showAt: 4 }
    ],
    steps: [
      {
        title: "Need faster than log n",
        text: "Linear search Θ(n) on a random array. Binary search Θ(log n) only after sorting. Hashing is the attempt to jump to the key in constant time.",
        highlight: ["k8", "k3", "k13", "n0", "zt"],
        hide: ["n1", "n2", "n3", "n4", "n5", "ch3", "k23"]
      },
      {
        title: "Identity hash wastes space",
        text: "Store x at index x. Search is O(1), but key 50 demands slot 50. h(x)=x is one-to-one and leaves most of a huge table empty.",
        highlight: ["k8", "s8", "k3", "s3", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "ch3", "k23"],
        flows: [
          { from: "k8", to: "s8", color: "#4ade80", label: "8" }
        ]
      },
      {
        title: "x mod 10 collides at 3",
        text: "Compress with h(x)=x mod 10. 8 and 3 still fit. 13 mod 10 = 3, same slot as 3. Many-to-one mapping created a collision that must be resolved.",
        highlight: ["k3", "k13", "s3", "n2"],
        fail: ["s3"],
        hide: ["n0", "n1", "n3", "n4", "n5", "ch3", "k23"],
        flows: [
          { from: "k3", to: "s3", color: "#fb923c", label: "3" },
          { from: "k13", to: "s3", color: "#f87171", label: "13" }
        ]
      },
      {
        title: "Chaining hangs 13 off slot 3",
        text: "Open hashing: slot 3 holds a list 3 → 13. Search 13 goes to index 3 then walks the chain. Time is 1 plus list length, usually better than log n.",
        highlight: ["s3", "ch3", "k13", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5", "k23"],
        flows: [
          { from: "s3", to: "ch3", color: "#60a5fa", label: "append" }
        ]
      },
      {
        title: "Linear probe: next hole, then clusters",
        text: "Closed hashing, f(i)=i. 13 finds slot 3 full and sits at 4. Searches that hash to 3 or 4 walk the consecutive block. That blob is a cluster.",
        highlight: ["s3", "s4", "k13", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "ch3", "k23"],
        flows: [
          { from: "k13", to: "s4", color: "#fb923c", label: "+1" }
        ]
      },
      {
        title: "Quadratic probe parks 23 at 7",
        text: "f(i)=i². Key 23: i=0 → 3 full, i=1 → 4 full, i=2 → 3+4=7. 23 sits a gap away, so colliding keys do not form one solid run. Clustering eases; time is still not worst-case O(1).",
        highlight: ["s3", "s4", "s7", "k23", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "ch3"],
        flows: [
          { from: "k23", to: "s7", color: "#c084fc", label: "i=2" }
        ]
      }
    ]
  }
});
