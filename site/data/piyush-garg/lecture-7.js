window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 7,
  title: "Consistent Hashing - System Design",
  video: "https://www.youtube.com/watch?v=IC5Y1EE-aj4",
  category: "Piyush Garg",
  tagline: "id % N balanced the three DBs until the fourth arrived and three of five keys had to move.",
  summary: "One database becomes a bottleneck, so Piyush adds three partitions and needs a deterministic map: the same user always lands on the same index. Math.random fails lookup. id % 3 places Piyush, John, Jane, Alex, and Tiger. Adding a fourth server changes the modulus to 4 and three of those five keys move — at five million rows that is about three million moves. Consistent hashing bends 1–12 into a clock, hashes servers onto hours (9, 2, 5), hashes keys, and walks clockwise to the first server. A new server at 12 moves only the 10–12 arc. Virtual nodes split a hot clustered arc. DynamoDB, Cassandra, and Discord use the ring.",

  theory: [
    {
      heading: "Horizontal scale needs a repeatable partition function",
      body: "An app with lots of users and lots of data will choke a single database. Horizontal scaling means <b>add more databases</b> and split the rows — Piyush's picture is three instances, about 33% each, so no box still holds 100% of the load. Lookup has a constraint the split does not: if Piyush's row was written to partition 0, the next read must ask partition 0, not 2. You need a function <code>f(userId) → index</code> that returns the same index every time for the same id.",
      bullets: [
        "Users in the demo: Piyush (id 1), John (2), Jane (3), Alex (4), Tiger (5).",
        "Partitions are indexed 0, 1, 2.",
        "A write-to-0 / read-from-2 miss is a silent empty result, not a retry."
      ]
    },
    {
      heading: "Random is stupid. id % N is a hash function",
      body: "<code>Math.random()</code> might put id 1 on index 2 on insert and return 0 on the next call — Piyush's row vanishes. The function must be <b>deterministic</b> and one-way: given Piyush you always get the same index, and you cannot invert the index back to the name. <code>id % 3</code> in the JS console: 1%3=1 (Piyush on 1), 2%3=2 (John on 2), 3%3=0 (Jane on 0). Same id, same remainder, every time. A hash that always returns 1 would also be deterministic — and would dump every row on one partition, leaving the other two idle. So the hash both <b>routes</b> and <b>balances</b>. Piyush calls this function the load balancer of the data.",
      bullets: [
        "Deterministic: same input, same output. One-way: you do not recover the user from the index.",
        "id % numberOfServers is a fine first hash while N is frozen.",
        "A constant hash 'works' for lookup and still wastes every extra server."
      ]
    },
    {
      heading: "Adding a fourth server rewrites the formula",
      body: "Users grow, three partitions are not enough, you spin index 3. <code>N</code> is now 4, so the hash is <code>id % 4</code>. Existing rows do not magically move. John (2%4=2) and Piyush (1%4=1) happen to still sit on the right boxes. Jane (3%4=3) should now live on the new server but still sits on 0. Alex (4%4=0) should be on 0 but sits on 1. Tiger (5%4=1) should be on 1 but sits on 2. <b>Three of five keys must move</b> before the live app is correct again. Scale the thought: five million rows and you just added one box — on this ratio you shuffle about <b>three million keys</b>. Removing a server (N=4 → N=2) is the same story in reverse: the formula changed, so majority keys reshuffle. Simple hashing balances while N is still; membership change is expensive.",
      bullets: [
        "Observation in the talk: 3 → 4 servers, move 3 existing keys.",
        "You have not even placed the new users yet. Old keys already broke.",
        "This is the problem consistent hashing is for."
      ]
    },
    {
      heading: "Bend the number line into a clock",
      body: "Imagine a long rail of hash slots, then grab the ends and form a ring. Piyush draws a <b>clock 1–12</b> as the hash space. A hash function (any stable one) maps an identifier to an hour. You hash <b>servers</b> first: take IP or index, drop the machine on that hour. In the demo the three servers land on <b>9, 2, and 5</b>. Then you hash a key to an hour. If a server is already sitting on that hour, store there. If not, <b>walk clockwise</b> and put the key on the first server you meet. Key at 1 walks to 2. Key at 6 walks to 9. Key at 3 walks to 5. Key at 10 walks to 2. Key at 11 walks to 2. Key at 4 walks to 5.",
      bullets: [
        "Servers and keys share one ring. Ownership is 'next clockwise server'.",
        "The clock wrapping 12 → 1 is the wrap-around of the hash space.",
        "You no longer put N inside the formula the way % N did."
      ]
    },
    {
      heading: "Join at 12: only the 10–12 arc moves",
      body: "Hash the new server's IP; it lands on <b>12</b>. Before that, a key hashed to 10 walked clockwise to the server at 2. After 12 exists, that key must live on 12 or the next lookup will miss. Data still moves — but only keys whose hash sits in the open arc from the previous server (9) up to 12, i.e. hours <b>10, 11, 12</b>. Keys already owned by 2, 5, and 9 that are not in that arc stay put. You can ask the old owner: give me keys whose hash is 10, 11, or 12. Easy to compute, a fraction of the keyspace, not three million of five million. Remove a server: dump only its keys onto the next clockwise neighbor. Same small arc.",
      bullets: [
        "Pros Piyush lists: minimal movement, and the affected range is obvious (previous server → new hour).",
        "Adding and removing are the same walk: clockwise to the next living point.",
        "Caches and replicas on untouched arcs stay valid."
      ]
    },
    {
      heading: "Clustered hours make a hot node; virtual nodes split the pie",
      body: "If the hash unluckily parks two servers next to each other, the third owns a huge empty arc. Any key that lands in that desert walks to the lonely server — Piyush's 'server 8' picture. The ring still works; load is not even. <b>Virtual nodes</b> are extra ring positions that point at a real machine. You do not buy a fourth computer; you hash the same server with more salts and drop pink dots around the clock. A key that walks to a virtual point is stored on the real owner. Fat arcs get sliced. When a physical box dies you delete all of its virtual points, so the orphaned load falls on several neighbors instead of one victim.",
      bullets: [
        "A virtual node is a pointer, not a second process you pay for.",
        "Lookup is still clockwise; the label just names a physical box.",
        "This is also how you damp a celebrity hotspot — all famous users hashing into one arc — which Piyush flags for a later video."
      ]
    },
    {
      heading: "Where the ring already runs",
      body: "The lecture's wrap: minimized redistribution on join/leave, easier horizontal scale, and a way to mitigate hotspots. Real systems on the slide: <b>Amazon DynamoDB</b>, <b>Apache Cassandra</b>, Discord's chat path. Design prompt: build consistent hashing when you need to spread requests or rows even as servers come and go. Draw the clock, place servers, place keys, walk clockwise, then show one join that moves a single arc — that is the answer, not a paragraph about '% is bad'.",
      bullets: [
        "Simple % N is still the right teaching step so the join cost is visible.",
        "Consistent hashing does not remove data movement; it bounds it to the affected arc.",
        "Share one ring view across clients or they will disagree about the owner."
      ]
    }
  ],

  keyTerms: [
    { term: "Hash function", def: "Deterministic, one-way map from an id (or server IP) to a partition or ring position." },
    { term: "id % N", def: "Simple hash while the server count is frozen. Changing N remaps most keys." },
    { term: "Hash ring", def: "The hash space bent into a circle (Piyush's 1–12 clock) so 12 wraps to 1." },
    { term: "Clockwise owner", def: "From a key's hour, walk forward until the first server. That box stores the key." },
    { term: "Affected arc", def: "On join, keys between the previous server and the new hour. On leave, keys that pointed at the dead hour." },
    { term: "Virtual node", def: "An extra ring position that forwards to a real server, used to split a fat arc." },
    { term: "Hotspot", def: "One partition eating a huge slice — clustered hashes, or a celebrity-key pile-up." }
  ],

  tradeoffs: [
    { pro: "id % N is one line and spreads load while N is constant.", con: "3 → 4 servers moved 3 of 5 demo keys; at 5M rows that is ~3M moves." },
    { pro: "A ring join at hour 12 moves only hashes 10–12. Untouched arcs keep their caches.", con: "You still copy that arc. Consistent hashing bounds movement, it does not delete it." },
    { pro: "Clockwise lookup needs no central map beyond the ring of server positions.", con: "Every client must see the same ring or they will read the wrong partition." },
    { pro: "Virtual nodes even out clustered hours without buying machines.", con: "More points mean more ring metadata; a crash removes every virtual of that box." }
  ],

  interviewTips: [
    "Start from the problem: one DB is a bottleneck, three partitions, f(id) must be deterministic. Math.random fails lookup.",
    "Show id % 3 for Piyush/John/Jane, then N=4 and Jane/Alex/Tiger sitting on the wrong boxes.",
    "Scale the pain: 5 million keys, add one server, move ~3 million. That is why the ring exists.",
    "Draw a 1–12 clock. Put servers at 9, 2, 5. Hash keys, walk clockwise. New server at 12 moves only 10–12.",
    "Name virtual nodes when two servers land close and the third owns the desert. Mention DynamoDB / Cassandra.",
    "Say celebrity hotspot: many hot keys in one arc. Virtual nodes help; it is a follow-up, not the core algorithm."
  ],

  scene: {
    nodes: [
      { id: "app", label: "App", type: "service", pos: [-11, 0, 0] },
      { id: "db0", label: "DB 0", type: "db", pos: [-5, 0, -5] },
      { id: "db1", label: "DB 1", type: "db", pos: [-5, 0, 0] },
      { id: "db2", label: "DB 2", type: "db", pos: [-5, 0, 5] },
      { id: "db3", label: "DB 3", type: "db", pos: [1, 0, 0], showAt: 2, color: "#fb923c" },
      { id: "piyush", label: "Piyush 1", type: "user", pos: [-11, 0, -5] },
      { id: "john", label: "John 2", type: "user", pos: [-11, 0, 5] },
      { id: "nMod", label: "f = id % 3", type: "note", pos: [-5, 0, -7.5] },
      { id: "nMove", label: "3 of 5 keys must move", type: "note", pos: [1, 0, -7.5], showAt: 2 },

      { id: "c12", label: "12", type: "point", pos: [6.5, 0, -5.5], showAt: 4, color: "#334155" },
      { id: "c1", label: "1", type: "point", pos: [9.2, 0, -4.8], showAt: 4, color: "#334155" },
      { id: "c2", label: "2", type: "point", pos: [11.2, 0, -2.8], showAt: 4, color: "#334155" },
      { id: "c3", label: "3", type: "point", pos: [11.8, 0, 0], showAt: 4, color: "#334155" },
      { id: "c4", label: "4", type: "point", pos: [11.2, 0, 2.8], showAt: 4, color: "#334155" },
      { id: "c5", label: "5", type: "point", pos: [9.2, 0, 4.8], showAt: 4, color: "#334155" },
      { id: "c6", label: "6", type: "point", pos: [6.5, 0, 5.5], showAt: 4, color: "#334155" },
      { id: "c7", label: "7", type: "point", pos: [3.8, 0, 4.8], showAt: 4, color: "#334155" },
      { id: "c8", label: "8", type: "point", pos: [1.8, 0, 2.8], showAt: 4, color: "#334155" },
      { id: "c9", label: "9", type: "point", pos: [1.2, 0, 0], showAt: 4, color: "#334155" },
      { id: "c10", label: "10", type: "point", pos: [1.8, 0, -2.8], showAt: 4, color: "#334155" },
      { id: "c11", label: "11", type: "point", pos: [3.8, 0, -4.8], showAt: 4, color: "#334155" },

      { id: "s9", label: "S@9", type: "server", pos: [-1.5, 0, 0], showAt: 4 },
      { id: "s2", label: "S@2", type: "server", pos: [11.5, 0, -5.4], showAt: 4 },
      { id: "s5", label: "S@5", type: "server", pos: [11.5, 0, 5.4], showAt: 4 },
      { id: "s12", label: "S@12", type: "server", pos: [6.5, 0, -7.6], showAt: 6, color: "#fb923c" },

      { id: "k1", label: "k@1", type: "point", pos: [9.2, 0, -4.8], showAt: 5, color: "#4ade80" },
      { id: "k6", label: "k@6", type: "point", pos: [6.5, 0, 5.5], showAt: 5, color: "#4ade80" },
      { id: "k3", label: "k@3", type: "point", pos: [11.8, 0, 0], showAt: 5, color: "#4ade80" },
      { id: "k10", label: "k@10", type: "point", pos: [1.8, 0, -2.8], showAt: 5, color: "#4ade80" },
      { id: "k11", label: "k@11", type: "point", pos: [3.8, 0, -4.8], showAt: 5, color: "#4ade80" },
      { id: "k4", label: "k@4", type: "point", pos: [11.2, 0, 2.8], showAt: 5, color: "#4ade80" },

      { id: "nCw", label: "Walk clockwise to first server", type: "note", pos: [6.5, 0, 7.6], showAt: 5 },
      { id: "nArc", label: "Only hashes 10–12 move", type: "note", pos: [6.5, 0, 7.6], showAt: 6 },
      { id: "vn", label: "S@9 virtual", type: "point", pos: [3.8, 0, 4.8], showAt: 8, color: "#c084fc" },
      { id: "nVirt", label: "Virtual node slices the fat arc", type: "note", pos: [6.5, 0, 7.6], showAt: 8 }
    ],
    edges: [
      { from: "piyush", to: "db1", label: "1%3=1" },
      { from: "john", to: "db2", label: "2%3=2" },
      { from: "app", to: "db0", label: "3%3=0" },
      { from: "app", to: "db3", label: "3%4=3", showAt: 2, dashed: true },
      { from: "k1", to: "s2", label: "cw", showAt: 5 },
      { from: "k6", to: "s9", label: "cw", showAt: 5 },
      { from: "k3", to: "s5", label: "cw", showAt: 5 },
      { from: "k10", to: "s2", label: "cw", showAt: 5 },
      { from: "k11", to: "s2", showAt: 5 },
      { from: "k4", to: "s5", showAt: 5 },
      { from: "k10", to: "s12", label: "now 12", showAt: 6, dashed: true },
      { from: "k11", to: "s12", showAt: 6, dashed: true },
      { from: "vn", to: "s9", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "Three partitions, five named users",
        text: "One database is the bottleneck. Horizontal scale: DB 0, 1, 2. Users Piyush (1), John (2), Jane (3), Alex (4), Tiger (5) must always hash to the same index on write and on read.",
        highlight: ["app", "db0", "db1", "db2", "piyush", "john", "nMod"],
        hide: ["db3", "nMove"],
        flows: [
          { from: "piyush", to: "db1", color: "#4ade80", label: "1" },
          { from: "john", to: "db2", color: "#4ade80", label: "2" },
          { from: "app", to: "db0", color: "#4ade80", label: "Jane 0" }
        ]
      },
      {
        title: "id % 3 is the hash — until N changes",
        text: "Math.random is not a hash: insert on 2, lookup on 0, row gone. 1%3=1, 2%3=2, 3%3=0 in the JS console. Deterministic and one-way. A hash that always returns 1 would still 'work' and would idle DB 0 and DB 2.",
        highlight: ["nMod", "db0", "db1", "db2"],
        hide: ["db3", "nMove"],
        flows: [
          { from: "piyush", to: "db1", color: "#4ade80", label: "always 1" }
        ]
      },
      {
        title: "Fourth server: Jane, Alex, Tiger sit wrong",
        text: "N becomes 4. 3%4=3 so Jane should be on the new box but still lives on 0. Alex and Tiger miss too. John and Piyush luckily stay. Three of five existing keys must move before the live app is correct.",
        highlight: ["db3", "nMove", "db0", "db1", "db2"],
        fail: ["db0"],
        flows: [
          { from: "app", to: "db3", color: "#f87171", label: "Jane?" },
          { from: "app", to: "db0", color: "#f87171", label: "still here" }
        ]
      },
      {
        title: "Five million rows, three million moves",
        text: "The demo ratio scaled up: add one server to a 5 million key cluster and you reshuffle about 3 million keys. Removing a server rewrites % N the same way. Simple hashing is even while N is frozen and brutal when membership changes.",
        highlight: ["db3", "nMove", "app"],
        fail: ["db3"],
        flows: [
          { from: "db0", to: "db3", color: "#fb923c", label: "reshuffle" },
          { from: "db1", to: "db3", color: "#fb923c", label: "move" }
        ]
      },
      {
        title: "Bend 1–12 into a clock, place servers",
        text: "Hash space is a clock. Hash each server IP onto an hour. The three machines land on 9, 2, and 5. N is no longer inside the formula. Servers are points on the ring, not slots 0..N-1.",
        highlight: ["s9", "s2", "s5", "c12", "c3", "c6", "c9"],
        hide: ["db0", "db1", "db2", "db3", "nMod", "nMove", "app", "piyush", "john"],
        flows: [
          { from: "c9", to: "s9", color: "#60a5fa", label: "hash IP" },
          { from: "c2", to: "s2", color: "#60a5fa" },
          { from: "c5", to: "s5", color: "#60a5fa" }
        ]
      },
      {
        title: "Keys walk clockwise to the first server",
        text: "Hash the key to an hour. If no server sits there, walk clockwise. k@1 → S@2, k@6 → S@9, k@3 → S@5, k@10 and k@11 → S@2, k@4 → S@5. That is insert and lookup.",
        highlight: ["k1", "k6", "k3", "k10", "s2", "s5", "s9", "nCw"],
        hide: ["db0", "db1", "db2", "db3", "nMod", "nMove", "app", "piyush", "john", "nArc", "nVirt"],
        flows: [
          { from: "k1", to: "s2", color: "#4ade80", label: "cw" },
          { from: "k6", to: "s9", color: "#4ade80", label: "cw" },
          { from: "k3", to: "s5", color: "#4ade80", label: "cw" },
          { from: "k10", to: "s2", color: "#4ade80", label: "cw" }
        ]
      },
      {
        title: "New server at 12: only 10–12 move",
        text: "The new IP hashes to 12. Keys that used to walk from 10 to S@2 now stop at S@12. Ask S@2 for hashes 10, 11, 12. S@5 and S@9 keep everything. Fraction of keys, easy range.",
        highlight: ["s12", "k10", "k11", "s2", "nArc"],
        hide: ["db0", "db1", "db2", "db3", "nMod", "nMove", "app", "piyush", "john", "nCw", "nVirt"],
        flows: [
          { from: "k10", to: "s12", color: "#fb923c", label: "moved" },
          { from: "k11", to: "s12", color: "#fb923c", label: "moved" },
          { from: "k1", to: "s2", color: "#4ade80", label: "stay" }
        ]
      },
      {
        title: "Remove S@2: its arc falls on the next clock hour",
        text: "Delete the point at 2. Keys that walked there keep walking clockwise to the next living server. Nobody else moves. Same small-arc rule as a join, in reverse.",
        highlight: ["s5", "k1", "s9"],
        fail: ["s2"],
        hide: ["db0", "db1", "db2", "db3", "nMod", "nMove", "app", "piyush", "john", "s12", "nArc", "nCw", "nVirt"],
        flows: [
          { from: "k1", to: "s5", color: "#f87171", label: "failover" }
        ]
      },
      {
        title: "Virtual node on a fat arc",
        text: "If two servers hash close together, the third owns a desert. Drop a virtual of S@9 into that desert. Keys that walk to the pink point store on the real S@9. DynamoDB, Cassandra, Discord run this ring. Celebrity hotspots are the same shape.",
        highlight: ["vn", "s9", "nVirt", "s2", "s5"],
        hide: ["db0", "db1", "db2", "db3", "nMod", "nMove", "app", "piyush", "john", "nCw", "nArc"],
        flows: [
          { from: "vn", to: "s9", color: "#c084fc", label: "pointer" },
          { from: "k6", to: "s9", color: "#4ade80" }
        ]
      }
    ]
  }
});
