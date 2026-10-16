window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 13,
  title: "What are Distributed CACHES and how do they manage DATA CONSISTENCY?",
  video: "https://www.youtube.com/watch?v=U3RkDLtS7uY",
  category: "Advanced Concepts",
  tagline: "Placement and write policy decide whether a cache is fast — or serving last week's password.",
  summary: "Caches exist to skip a network hop, skip a heavy compute (average age of every user), and keep load off the database. They cannot hold everything: the hardware is expensive and search time grows until the cache is slower than the miss. Policy (LRU for a celebrity comment, not a tiny thrashing box) decides hit rate. Consistency is the real subject: an update that hits the database while S1 still holds the old password is a security bug. In-memory caches are fast and split-brained; a global Redis is slower, independently scalable, and survives a server death. Write-through versus invalidate-then-store (and a hybrid that batches non-critical writes) is how you choose the lie you can live with.",

  theory: [
    {
      heading: "Three reasons the box exists — and why this is not a cache intro",
      body: "A user asks a server, the server asks a database. A <b>cache</b> sits in that path for three jobs: skip a <i>network</i> round trip (the same profile is requested again), skip a <i>compute</i> (average age of every user, done once, stored as <code>avg → 28</code>), and skip <i>load</i> on the primary when many servers would otherwise stampede it. The rest of this lecture is not \"what is a cache\". It is where the copy lives, when it is wrong, and which write policy you can defend for passwords versus comments."
    },
    {
      heading: "You cannot cram the database into RAM",
      body: "The instinct is to keep every row because hits are fast. Two walls stop you. Cache hardware is usually <b>SSD-class or RAM-class</b> and costs more than the commodity disks under the source of truth. And as the working set grows, lookup time grows with it — at some size you spent a hop and still scanned too much, so you might as well have gone to the database. The design problem is prediction: hold the keys the next requests will need, not a second copy of the universe.",
      bullets: [
        "A cache is a bet on the future request mix.",
        "Capacity is a consistency tool: a smaller hot set is easier to keep right.",
        "A miss is cheaper than a huge, slow \"hit\"."
      ]
    },
    {
      heading: "Policy is load versus evict",
      body: "A <b>cache policy</b> answers two questions: when does a key enter, and when does it leave. Performance is almost entirely that pair. <b>LRU</b> (least recently used) keeps a celebrity comment on top while it is hot and walks it toward eviction as the room cools. <b>LFU</b> (least frequently used) is less common in production. Sliding-window policies, such as the ideas behind Caffeine, often beat naive LRU. A <i>bad</i> policy is worse than no cache: every lookup is an extra miss hop. A cache that holds one entry and alternates users X and Y <b>thrashes</b> — fill, evict, fill, never a hit."
    },
    {
      heading: "The password that did not change",
      body: "Server two writes a new profile for X into the database. Server one's cache still has the previous document. Readers of S1 see the old password. If that password was stolen, the cache just extended the breach. Profiles being a few seconds late may be fine. Credentials, balances, and anything an attacker can replay are not. That is the consistency problem this lecture is actually about: <b>who is allowed to be stale, for how long</b>."
    },
    {
      heading: "Place it in the process, or place it in the fleet",
      body: "Next to the server — including <b>in-process memory</b> — is the lowest latency and the least moving parts. It also eats the request box's RAM, dies when that box dies, and disagrees with S2's memory. Fine for avatars. Not fine for money. A <b>global distributed cache</b> (Redis is the named example) is the shared look-aside: every server hits the same keys, a crash of S2 loses no cache data, and you scale Redis independently of the stateless app containers. It is a bit slower than local RAM. The lecture's preference for most serious systems is the global cache, with local memory reserved for tiny, extremely hot, non-critical sets."
    },
    {
      heading: "Write-through, and what the talk calls write-back",
      body: "Textbook names and the video's names do not line up perfectly — use both in an interview. <b>Write-through</b> (his first path): the write hits the cache, updates X, then the same write is pushed to the database. Readers of that cache see the new password immediately; the source of truth follows. <b>Invalidate-then-store</b> (what he calls write-back): touch the database (or have the database notify), <i>delete</i> X from the cache, and let the next read refill. Some designs write the database first and only then fill the cache.",
      bullets: [
        "Standard <i>write-back / write-behind</i> means the cache is updated now and the database is flushed later — his hybrid, not his \"write-back\".",
        "Standard <i>write-around</i> skips the cache on write and invalidates, close to his second path.",
        "If every server has its own in-memory copy, write-through on S1 does not update S2 — you must invalidate (or broadcast), not \"fix RAM on one box\"."
      ]
    },
    {
      heading: "Invalidate is consistent and can thrash; hybrid is the grown-up policy",
      body: "Always updating the source of truth then kicking the cache is safer and slower: the next read misses, hits the database, and refills — a cousin of thrashing if writes are hot. Always write-through on a shared Redis is simpler when one cache is the only lie. The lecture's practical mix: <b>non-critical</b> edits (a comment) update the cache and keep serving; persist to the database in <b>bulk</b> when you have a quiet window (one network call, many keys). <b>Passwords and financial rows</b> cannot wait on that window — they need the database to commit, then a deliberate invalidate or a synchronous write-through on the global cache. Pick the lie per key class, not per diagram."
    }
  ],

  keyTerms: [
    { term: "Look-aside cache", def: "App checks cache, on miss loads the database, then fills the cache — the default picture in this lecture." },
    { term: "Cache policy", def: "Rules for which keys enter and which are evicted; LRU, LFU, and sliding-window (Caffeine-style) are the named family." },
    { term: "Thrashing", def: "A working set larger than the cache, so X and Y evict each other and every lookup misses." },
    { term: "In-process cache", def: "RAM on S1/S2: lowest latency, dies with the process, and diverges across boxes." },
    { term: "Global cache", def: "A shared Redis-class fleet every server hits; independently scalable and not buried with S2." },
    { term: "Write-through", def: "Update the cache, then the database, so that copy is never behind the write you just acked." },
    { term: "Invalidate-on-write", def: "Commit the database (or notify from it), delete the key, refill on the next read — his \"write-back\"." },
    { term: "Write-behind hybrid", def: "Serve from cache, flush batches of non-critical keys later; never do this for passwords or money." }
  ],

  tradeoffs: [
    { pro: "Local RAM avoids a hop and is trivial to ship next to the handler.", con: "S1 and S2 diverge; a crash takes the hot set with it; write-through on one box is meaningless." },
    { pro: "Global Redis is one view, scales apart from app containers, and survives S2 dying.", con: "Extra network hop versus in-process, plus another fleet to operate." },
    { pro: "Write-through on a shared cache keeps password reads on the new value.", con: "Every write pays cache and database; other servers' private RAM still lies." },
    { pro: "Invalidate-then-DB is the safe way to keep many local caches from serving ghosts.", con: "Hot keys miss after every write — a thrash-shaped tax." },
    { pro: "Batching comment updates saves database QPS.", con: "A stolen password in that window is not a comment. Split the policy by key class." }
  ],

  interviewTips: [
    "Do not stop at LRU. Ask which keys may be stale and for how many seconds — passwords versus comments.",
    "Draw in-process versus global Redis and say which one you pick when S1 and S2 must not disagree.",
    "Name write-through, then invalidate-on-write, and map his \"write-back\" to invalidate so you are not using the textbook word wrong.",
    "If they want local caches plus write-through, point at S2's untouched RAM and switch to invalidate or a shared cache.",
    "Propose a hybrid: bulk write-behind for comments, synchronous commit plus invalidate for credentials.",
    "Mention thrashing and SSD cost so you do not sound like you would cache the entire primary."
  ],

  scene: {
    nodes: [
      { id: "user", label: "User", type: "user", pos: [-11, 0, 0] },
      { id: "s1", label: "Server S1", type: "server", pos: [-6, 0, -3] },
      { id: "s2", label: "Server S2", type: "server", pos: [-6, 0, 3] },
      { id: "c1", label: "Local cache S1", type: "cache", pos: [-6, 0, -6.5], showAt: 5 },
      { id: "c2", label: "Local cache S2", type: "cache", pos: [-6, 0, 6.5], showAt: 5 },
      { id: "redis", label: "Global Redis", type: "cache", pos: [2, 0, 0], showAt: 6 },
      { id: "db", label: "Source of truth", type: "db", pos: [8.5, 0, 0] },
      { id: "flush", label: "Bulk flush", type: "worker", pos: [8.5, 0, -4], showAt: 8 },

      { id: "n0", label: "Skip hop / skip CPU", type: "note", pos: [-10, 4, 7.5] },
      { id: "n1", label: "Don't cache it all", type: "note", pos: [2, 4, 7.5], showAt: 1 },
      { id: "n2", label: "LRU: hot then cold", type: "note", pos: [10, 4, 7.5], showAt: 2 },
      { id: "n3", label: "Thrashing X vs Y", type: "note", pos: [-10, 4, -7.5], showAt: 3 },
      { id: "n4", label: "Stale password", type: "note", pos: [2, 4, -7.5], showAt: 4 },
      { id: "n5", label: "Policy per key class", type: "note", pos: [10, 4, -7.5], showAt: 8 }
    ],
    edges: [
      { from: "user", to: "s1" },
      { from: "user", to: "s2" },
      { from: "s1", to: "db", label: "miss", dashed: true },
      { from: "s2", to: "db", dashed: true },
      { from: "s1", to: "c1", showAt: 5 },
      { from: "s2", to: "c2", showAt: 5 },
      { from: "s1", to: "redis", showAt: 6 },
      { from: "s2", to: "redis", showAt: 6 },
      { from: "redis", to: "db", showAt: 6 },
      { from: "redis", to: "flush", showAt: 8, dashed: true },
      { from: "flush", to: "db", showAt: 8 }
    ],
    steps: [
      {
        title: "Skip a hop, skip a compute",
        text: "The same profile reread from MySQL is a wasted round trip — keep it next to the handler. Average age of every user is a wasted scan — compute once, store avg → 28. Both exist to answer the client without waking the primary.",
        highlight: ["user", "s1", "db", "n0"],
        flows: [
          { from: "user", to: "s1", color: "#60a5fa", label: "GET profile" },
          { from: "s1", to: "db", color: "#f87171", label: "scan ages" }
        ]
      },
      {
        title: "The cache is not a second database",
        text: "RAM and SSD-class devices cost more than commodity disks, and a stuffed cache searches longer until a \"hit\" is slower than going to MySQL. Hold the keys you predict, not a clone of the universe.",
        highlight: ["s1", "db", "n1"],
        hide: ["n0"],
        flows: [
          { from: "s1", to: "db", color: "#fb923c", label: "too much RAM" }
        ]
      },
      {
        title: "LRU keeps the celebrity on top",
        text: "Policy is load versus evict. LRU parks a hot comment at the front and walks it to deletion as the room cools. LFU is rarer. Sliding-window designs (Caffeine) often beat naive LRU. A useless policy is an extra miss hop.",
        highlight: ["s1", "db", "n2"],
        hide: ["n0"],
        flows: [
          { from: "user", to: "s1", color: "#4ade80", label: "hot comment" },
          { from: "s1", to: "user", color: "#60a5fa", label: "hit" }
        ]
      },
      {
        title: "One slot, two users: thrash",
        text: "A profile cache that holds a single entry loads X, then Y evicts X, then X misses again. You paid every lookup and never served from memory. Size the working set or skip the cache.",
        highlight: ["s1", "db", "user", "n3"],
        hide: ["n0", "n1"],
        flows: [
          { from: "user", to: "s1", color: "#f87171", label: "X" },
          { from: "s1", to: "db", color: "#f87171", label: "Y miss" },
          { from: "db", to: "s1", color: "#fb923c", label: "evict X" }
        ]
      },
      {
        title: "S2 wrote; S1 still has the password",
        text: "An update lands on the database. S1's copy of profile X is the old document — including the previous password. A stolen credential keeps working. That is the consistency bug caches create the moment you have more than one place the truth can live.",
        highlight: ["s2", "db", "s1", "n4"],
        hide: ["n0", "n2"],
        flows: [
          { from: "s2", to: "db", color: "#4ade80", label: "new password" },
          { from: "user", to: "s1", color: "#f87171", label: "old password" }
        ]
      },
      {
        title: "RAM on the box is fast and split",
        text: "In-process caches skip a hop and are easy to ship. They also eat request-server memory, vanish when S1 dies, and disagree with S2. Avatars can live here. Money cannot.",
        highlight: ["s1", "s2", "c1", "c2"],
        hide: ["n0", "n2", "n3"],
        flows: [
          { from: "s1", to: "c1", color: "#60a5fa", label: "X v1" },
          { from: "s2", to: "c2", color: "#fb923c", label: "X v2" }
        ]
      },
      {
        title: "Global Redis as one view",
        text: "Every server hits the same Redis-class fleet. S2 crashing does not bury the hot set. You scale cache boxes independently of app containers. Slightly slower than local RAM; much harder to serve two passwords.",
        highlight: ["s1", "s2", "redis", "db"],
        hide: ["n0", "n3"],
        flows: [
          { from: "s1", to: "redis", color: "#60a5fa", label: "GET X" },
          { from: "s2", to: "redis", color: "#60a5fa", label: "GET X" },
          { from: "redis", to: "db", color: "#fb923c", label: "miss" }
        ]
      },
      {
        title: "Write-through vs invalidate",
        text: "Write-through: update X in the cache, then the database. Invalidate-on-write (his \"write-back\"): commit the store, delete X, refill on the next read. Local RAM plus write-through still leaves S2 stale — invalidate or share the cache.",
        highlight: ["redis", "db", "s1", "c2"],
        hide: ["n0", "n1", "n3"],
        flows: [
          { from: "s1", to: "redis", color: "#4ade80", label: "write-through" },
          { from: "redis", to: "db", color: "#4ade80", label: "then DB" },
          { from: "s2", to: "c2", color: "#f87171", label: "S2 RAM lies" }
        ]
      },
      {
        title: "Hybrid: comments batch, passwords don't",
        text: "Non-critical edits can live in cache and flush to MySQL in bulk when the path is quiet. Credentials and balances commit to the source of truth, then invalidate. Policy is per key class, not one slogan for the diagram.",
        highlight: ["redis", "flush", "db", "n5"],
        hide: ["n0", "n3", "n4"],
        flows: [
          { from: "redis", to: "flush", color: "#fb923c", label: "comments" },
          { from: "flush", to: "db", color: "#c084fc", label: "bulk" },
          { from: "s1", to: "db", color: "#4ade80", label: "password commit" }
        ]
      }
    ]
  }
});
