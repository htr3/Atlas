window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 2,
  title: "Low-Level System Design of a Cache - Mock Interview",
  video: "https://www.youtube.com/watch?v=tzbX4ix2RjI",
  category: "Low-Level Design",
  tagline: "A cache is get, set, and a pluggable eviction algorithm — not a hashmap with extra steps.",
  summary: "Arun and Gaurav mock-interview a cache you would actually code: get and set, a hard capacity, and an eviction policy that can be LRU today and LFU tomorrow. The design splits Cache, Storage, and EvictionPolicy so SOLID holds, then implements LRU as a doubly linked list plus a node map so every access and eviction is O(1).",

  theory: [
    {
      heading: "What the interviewer is actually asking",
      body: "This is not \"design Memcached.\" You are asked to <b>write an in-memory cache</b>: store a value, fetch it back, and when the box is full, throw something out. The live poll leaned LRU (~53%) over LFU; FIFO had almost no believers. The useful framing is still an engineering problem, not a product: a cache is a <code>get</code> / <code>set</code> API plus an eviction rule and a storage rule. Graduates should treat it like a DSA question that happens to need classes.",
      bullets: [
        "Capacity example: five slots filled, a sixth write must evict one key first.",
        "Public API is get and set. A user does not need a delete call; setting null is enough.",
        "Keys and values can start as strings; the same shape later holds any object (or JSON).",
        "The interesting work is not get/set — it is which key dies, and how you store the rest."
      ]
    },
    {
      heading: "Classes: Cache, Storage, EvictionPolicy",
      body: "A <code>Cache</code> does not own a hashmap and a linked list in one file. It holds two collaborators: <b>Storage</b> (add, get, remove, capacity) and <b>EvictionPolicy</b> (which key is next to die, and that a key was just used). That is <b>single responsibility</b>: storage never decides LRU vs LFU; the policy never persists bytes. Members are <code>final</code> so callers cannot swap the guts after construction — <b>open for extension, closed for modification</b>. Tomorrow you wrap the library; you do not fork it.",
      bullets: [
        "Cache constructor takes the policy and the storage — the two extension points.",
        "Storage can be a HashMap today and an array tomorrow if someone forbids maps.",
        "EvictionPolicy can be LRU, LFU, FIFO, or LIFO as long as it answers \"evict\" and \"accessed\".",
        "Internals stay private; only Cache talks to both sides."
      ]
    },
    {
      heading: "Call sequence for get and set",
      body: "<code>Cache.get(key)</code> asks Storage for the value, then tells the policy <code>keyAccessed(key)</code>, then returns. <code>Cache.set(key, value)</code> asks Storage to add. If capacity is already full, Cache first asks the policy for the victim, Storage removes that key, then the write proceeds. After a successful write the same <code>keyAccessed</code> mark runs, so a brand-new key is the most recently used. Storage itself can refuse a write when full; Cache is the one that is supposed to evict first.",
      bullets: [
        "get: Storage.get → EvictionPolicy.keyAccessed → return value.",
        "set (space left): Storage.add → EvictionPolicy.keyAccessed.",
        "set (full): EvictionPolicy.evict → Storage.remove(victim) → Storage.add → keyAccessed.",
        "Remove on Storage is a no-op (or a quiet return) if the key is not present."
      ]
    },
    {
      heading: "LRU in O(1): DLL plus a node map",
      body: "Least-recently-used needs an order: head is the oldest (next victim), tail is the newest. A walk of a linked list to find key <code>2</code> is O(n). Pair the list with a <b>map from key to node address</b>. On access: map lookup O(1), <code>detachNode</code> by rewiring prev/next, <code>addNodeAtEnd</code> as the new tail. On evict: drop the head and advance it. Java's <code>LinkedList</code> is already doubly linked; in an interview you can also sketch a tiny <code>DLL</code> / <code>DLLNode</code> pair. Detach is first-year pointer work: <code>node.prev.next = node.next</code> and the symmetric prev link, then hang the node off the tail.",
      bullets: [
        "Example: nodes 1–2–3 (3 was newest). Access 2 → detach 2 → list is 1–3–2.",
        "The map stores physical addresses (\"101\", \"102\") so you never scan.",
        "Head/tail pointers keep evict and append at O(1) extra space.",
        "LFU would swap the policy (often a frequency map), not the Cache class."
      ]
    },
    {
      heading: "Patterns, SOLID, and how you plug a new algorithm",
      body: "The lecture names three habits more than a Gang-of-Four catalog: SRP, OCP, and keeping the Cache's references immutable from the outside. They still mention a <b>factory</b> when the problem gets harder: the caller says \"LRU\" or \"LFU\" and a factory returns the matching <code>EvictionPolicy</code>. Storage stays a concrete hashmap in the stream to keep the demo short; making Storage an interface with <code>put</code> / <code>get</code> / <code>remove</code> is the same OCP move if you need it. Linux-style pipes are the metaphor: wrap <code>cat</code>, do not edit <code>cat</code>.",
      bullets: [
        "Factory (discussed): build LRU vs LFU vs FIFO without touching Cache.",
        "Do not put DLL node surgery inside Cache — that belongs in the list class.",
        "Staff-level extras they flag but do not code: concurrency, a global cache, a node dying, cost."
      ]
    },
    {
      heading: "Concurrency and what this round is not",
      body: "The coded solution is single-threaded. At senior levels the same cache is asked with locks, latency, and \"is this a process-local map or a cluster?\" They explicitly say a director is not asked to implement LRU pointers. DSA still matters: this is the rare LLD where the data structure <i>is</i> the design. Poll-wise, people vote LRU; the design should still let you swap the vote without rewriting Storage.",
      bullets: [
        "Younger ICs: classes, O(1) LRU, SOLID split.",
        "Senior: locking around get/set, eviction under load, existing products (Redis/Memcached) as tradeoffs.",
        "You can grow a hashmap into a cache without reading the Memcached docs — until you should not."
      ]
    }
  ],

  keyTerms: [
    { term: "Cache", def: "Bounded key-value store with get/set; writes beyond capacity must evict according to a policy." },
    { term: "Eviction policy", def: "Rule that names the next key to drop: LRU, LFU, FIFO, and so on." },
    { term: "Storage", def: "The structure that actually holds values (usually a HashMap) and enforces capacity." },
    { term: "LRU", def: "Evict the key that was used longest ago; recency is tracked by a DLL with newest at the tail." },
    { term: "Node map", def: "HashMap from key to DLL node so detach/move is O(1) instead of a list scan." },
    { term: "SRP", def: "Storage stores; EvictionPolicy orders; Cache orchestrates get/set." },
    { term: "Open/closed", def: "Extend by wrapping or swapping collaborators; do not modify the finished Cache class." },
    { term: "Factory", def: "Builds the EvictionPolicy (LRU vs LFU) the Cache constructor receives." }
  ],

  tradeoffs: [
    { pro: "HashMap storage: O(1) get/set for the value itself.", con: "Gives no recency order; eviction still needs another structure." },
    { pro: "DLL + node map: O(1) access, move-to-tail, and evict-head.", con: "Pointer surgery is easy to get wrong on a whiteboard; extra memory per key." },
    { pro: "Split Cache / Storage / Policy: swap LRU for LFU without touching get/set.", con: "More types than a one-file hashmap; overkill if the interviewer only wanted LeetCode LRU." },
    { pro: "get/set only: smaller API, delete = set null.", con: "Explicit invalidate/TTL is not in this design." },
    { pro: "Factory + final collaborators: Cache is a stable library.", con: "You still have to code one policy well; they implemented LRU, not every strategy." }
  ],

  interviewTips: [
    "State the API first (get, set, capacity) before drawing a hashmap.",
    "Name SRP out loud: Storage vs EvictionPolicy vs Cache, then code those three files.",
    "For LRU, say \"DLL plus key-to-node map\" and walk access-2 from 1-2-3 to 1-3-2.",
    "Offer a factory if they ask for LFU/FIFO; do not rewrite Cache.",
    "Ask whether you may use an IDE — red squiggles speed up the class diagram-to-code jump.",
    "Mention concurrency and clustering only after the O(1) sequential design works."
  ],

  scene: {
    nodes: [
      { id: "client", label: "Client", type: "user", pos: [-10.5, 0, 0] },
      { id: "cache", label: "Cache", type: "cache", pos: [-7, 0, 0] },
      { id: "storage", label: "Storage", type: "db", pos: [-3.5, 0, 3] },
      { id: "policy", label: "EvictionPolicy", type: "service", pos: [-3.5, 0, -3] },
      { id: "hmap", label: "HashMap", type: "storage", pos: [0, 0, 3], showAt: 2 },
      { id: "dll", label: "DLL", type: "queue", pos: [0, 0, -3], showAt: 3 },
      { id: "nmap", label: "Node map", type: "cache", pos: [3.5, 0, -3], showAt: 3 },
      { id: "n1", label: "Node 1", type: "point", pos: [7, 0, 3], showAt: 4 },
      { id: "n2", label: "Node 2", type: "point", pos: [7, 0, 0], showAt: 4 },
      { id: "n3", label: "Node 3", type: "point", pos: [7, 0, -3], showAt: 4 },
      { id: "factory", label: "Policy factory", type: "gateway", pos: [-7, 0, -6], showAt: 7 },
      { id: "lfu", label: "LFU policy", type: "service", pos: [-3.5, 0, -6], showAt: 7 },
      { id: "note0", label: "get / set + capacity", type: "note", pos: [0, 0, 6] },
      { id: "note1", label: "SRP: store vs evict", type: "note", pos: [3.5, 0, 6], showAt: 1 },
      { id: "note2", label: "Access 2: 1-3-2", type: "note", pos: [10.5, 0, 0], showAt: 4 },
      { id: "note3", label: "Head = next victim", type: "note", pos: [10.5, 0, -6], showAt: 5 },
      { id: "note4", label: "OCP + factory", type: "note", pos: [0, 0, -6], showAt: 7 }
    ],
    edges: [
      { from: "client", to: "cache", label: "get/set" },
      { from: "cache", to: "storage", label: "add/get" },
      { from: "cache", to: "policy", label: "accessed" },
      { from: "storage", to: "hmap", showAt: 2 },
      { from: "policy", to: "dll", showAt: 3 },
      { from: "policy", to: "nmap", label: "key→node", showAt: 3 },
      { from: "dll", to: "n1", showAt: 4 },
      { from: "n1", to: "n2", showAt: 4 },
      { from: "n2", to: "n3", showAt: 4 },
      { from: "nmap", to: "n2", label: "O(1)", showAt: 4 },
      { from: "factory", to: "policy", label: "LRU", showAt: 7 },
      { from: "factory", to: "lfu", label: "LFU", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "A cache is get, set, and a cap",
        text: "You store name→Arun, you get it back, and when five slots are full a sixth write must drop a key. The public API is get and set. Eviction policy is the real design — LRU, LFU, or FIFO depending on the use case.",
        highlight: ["client", "cache", "note0"]
      },
      {
        title: "Split Storage from policy",
        text: "Cache holds two final collaborators. Storage adds, gets, and removes. EvictionPolicy only answers which key is stale and that a key was just touched. That is single responsibility, and it is why Cache can stay closed for modification.",
        highlight: ["cache", "storage", "policy", "note1"],
        flows: [
          { from: "cache", to: "storage", color: "#4ade80", label: "add" },
          { from: "cache", to: "policy", color: "#fb923c", label: "accessed" }
        ]
      },
      {
        title: "Storage is just a hashmap",
        text: "A HashMap behind Storage is fine for O(1) values. If an interviewer forbids maps, only this class changes. Capacity lives here; a full map refuses a blind add until Cache evicts.",
        highlight: ["storage", "hmap"],
        flows: [
          { from: "storage", to: "hmap", color: "#4ade80", label: "put" }
        ]
      },
      {
        title: "LRU needs a list and a node map",
        text: "A doubly linked list keeps recency: head is least recent, tail is most recent. A second map from key to node makes \"find 2\" O(1). Without that map, every access walks the list.",
        highlight: ["policy", "dll", "nmap"],
        flows: [
          { from: "policy", to: "dll", color: "#60a5fa", label: "order" },
          { from: "policy", to: "nmap", color: "#c084fc", label: "addr" }
        ]
      },
      {
        title: "Access 2: detach, then tail",
        text: "List is 1–2–3 with 3 newest. Client gets key 2. Map jumps to node 2, detach rewires 1 to 3, then 2 is appended as the new tail. Order becomes 1–3–2. Same pointer moves on set.",
        highlight: ["n1", "n2", "n3", "nmap", "note2"],
        flows: [
          { from: "client", to: "cache", color: "#60a5fa", label: "get 2" },
          { from: "cache", to: "policy", color: "#fb923c", label: "accessed 2" },
          { from: "nmap", to: "n2", color: "#c084fc", label: "node" }
        ]
      },
      {
        title: "Evict the head",
        text: "A sixth write with capacity five asks the policy to evict. Head is the least recently used. Advance head in O(1), Storage.remove that key, then add the new pair and mark it accessed.",
        highlight: ["cache", "policy", "dll", "n1", "note3"],
        flows: [
          { from: "client", to: "cache", color: "#4ade80", label: "set 6th" },
          { from: "policy", to: "cache", color: "#f87171", label: "evict 1" },
          { from: "cache", to: "storage", color: "#f87171", label: "remove" }
        ]
      },
      {
        title: "get and set share accessed()",
        text: "get reads Storage then calls keyAccessed. set writes Storage then calls the same method so a fresh key is most recent. Cache is the only class that sees both collaborators.",
        highlight: ["client", "cache", "storage", "policy"],
        flows: [
          { from: "client", to: "cache", color: "#60a5fa", label: "get" },
          { from: "cache", to: "storage", color: "#60a5fa", label: "get" },
          { from: "cache", to: "policy", color: "#fb923c", label: "accessed" }
        ]
      },
      {
        title: "Factory for LRU vs LFU",
        text: "When they ask for another algorithm, a factory returns LFU or FIFO as an EvictionPolicy. Cache and Storage stay put — open for extension. They did not recode Redis; they made a library you can wrap.",
        highlight: ["factory", "policy", "lfu", "note4"],
        flows: [
          { from: "factory", to: "lfu", color: "#c084fc", label: "new LFU" }
        ]
      }
    ]
  }
});
