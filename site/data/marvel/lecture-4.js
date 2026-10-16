window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "marvel",
  id: 4,
  title: "Google Zanzibar",
  video: "https://www.youtube.com/watch?v=9gvJHf9FqmM",
  category: "Paper Walkthroughs",
  tagline: "One global ACL graph for Drive, Docs, and the rest of Google.",
  summary: "Zanzibar (built ~2012, paper 2019) is Google's authorization service: trillions of relation tuples, millions of checks per second, tens of milliseconds, five nines. The lecture covers viewer/editor/owner, userset tuples, group expansion, the wildcard Read API, writes, and Spanner timestamps that make a later read see an earlier grant.",

  theory: [
    {
      heading: "Authorization is not a two-column table",
      body: "Sharing a Google Doc looks like a checkbox: viewer, editor, or owner. Viewers read, editors change, owners can also delete — permissions <b>nest upward</b>, so proving owner proves edit and view. Storing (user, doc, perm) in a table is the obvious design and it dies at Google's size. The lecture's numbers: <b>trillions of ACL records</b> (terabytes), <b>millions of authorization QPS</b>, billions of users, trillions of objects (many machine-generated). A document fetch has a ~500ms budget; auth must finish in <b>tens of milliseconds</b>. The graph looks like Facebook TAO: people, groups, docs, typed edges — except a wrong answer here is a data leak or a locked-out company.",
      bullets: [
        "Owner ⊃ editor ⊃ viewer is a userset inclusion, not three independent flags.",
        "Scale is edges and distinct nodes, not just QPS.",
        "Auth sits on every read of every doc; it cannot be \"best effort\"."
      ]
    },
    {
      heading: "If Zanzibar is down, Google is down",
      body: "Fail closed and nothing opens; fail open and you leak. Google's budget is about <b>ten minutes of downtime per year</b> — five nines (99.999%). The traffic mix is a gift: <b>≥99% of calls are reads</b>. Permissions are usually set at create time and then checked over and over. That means a globally replicated, read-optimized ACL store with a tiny, carefully ordered write path. In 2012 the principal-engineer observation was that Drive, Photos, and a dozen other products each wanted the same sharing model. One service beats N slightly-wrong ACL tables.",
      bullets: [
        "Availability target ~99.999%; auth outage is a product outage.",
        "Read-mostly workload licenses caching and snapshot reads.",
        "One relation language shared across Google products."
      ]
    },
    {
      heading: "Relation tuples are the data model",
      body: "The entire graph is lines of the form <code>object#relation@user</code> (the lecture's \"single line\"). Namespace keeps IDs from colliding across products. Examples: a UPI design doc <code>#edit</code>@ the engineering group; <code>org/engineering#member@gaurav</code>. Everything after <code>@</code> is the <b>source</b> (who), everything before <code>#</code> is the <b>object</b> (what), the token between is the <b>edge type</b>. A user, a group, or another userset can sit on either side — that is how \"the engineering team may edit\" expands without writing a row per engineer. The tuple store is the source of truth; computed relations (owner implies editor) are config on top.",
      bullets: [
        "Tuple: (namespace, object, relation, user/userset).",
        "Groups are objects with a member relation, not a special database.",
        "New permission types are new relation names, not schema migrations."
      ]
    },
    {
      heading: "Check walks a userset tree",
      body: "\"May Gaurav view this doc?\" is a graph reachability question. Start at the object, take incoming edges of the requested relation (and those that include it, e.g. editor includes view). Direct user edges are a yes. Group edges expand: load <code>group#member</code>, recurse. The search is a tree unrolling of the DAG. Deep or wide groups are the performance cliff (the paper's later work: indexing, bloom filters, hedging); the lecture's point is conceptual — authorization is <b>userset expansion</b>, not a single-row primary-key get. Listing \"who can edit\" is the same walk with the user left wildcarded.",
      bullets: [
        "Check = is user reachable from object#relation via userset expansion.",
        "Expand groups lazily; cache hot groups.",
        "Cycles and huge groups are why this is a distributed system, not a JOIN."
      ]
    },
    {
      heading: "Read and write APIs",
      body: "The <b>Read</b> API takes source, relation, destination, and a timestamp. Source, relation, and destination are optional (wildcards). All four set: boolean membership (does this edge exist, possibly via groups). Relation omitted: every edge between two nodes, after expanding groups. Only source: every relation that object has with anyone (\"who can access this doc\"). Only destination: every object a user or group can reach. That one shape covers almost all of the 99.9% read traffic. <b>Write</b> is a single tuple: add <code>doc#edit@userA</code>. No multi-row SQL — consistency is pushed into timestamps.",
      bullets: [
        "Wildcards turn Check, Expand, and \"what can this user see\" into one read surface.",
        "Writes are tuple inserts/deletes, not ACL document rewrites.",
        "Most products never need a second API if they model groups as tuples."
      ]
    },
    {
      heading: "Spanner timestamps are the consistency story",
      body: "Zanzibar's guarantee: a write at time 100 is visible to any read whose timestamp is <b>> 100</b>. A read stamped < 100 may miss it. The clock is <b>Spanner's TrueTime</b> — a globally comparable timestamp, not a per-server wall clock. Clients carry a consistency token (a zookie, in the paper) from the write or from a snapshot they already observed, so \"I just shared this doc with you\" cannot lose the race to a check on another continent. Snapshot reads at an older timestamp keep the read-mostly path cheap and lock-free. External consistency of grants is why Drive sharing feels immediate without a global mutex on trillions of ACLs.",
      bullets: [
        "Write@T then Read@(T'>T) must observe the grant.",
        "Spanner provides the ordered time; Zanzibar stores tuples in it.",
        "Stale snapshot reads are allowed when the client asks for them."
      ]
    }
  ],

  keyTerms: [
    { term: "Relation tuple", def: "object#relation@user (plus namespace). The unit of ACL storage and the edge in the authorization graph." },
    { term: "Userset", def: "A user, or a group, or another object#relation that must be expanded to a set of users." },
    { term: "Check", def: "Reachability: can this user be found under this object#relation after expanding groups and inclusions." },
    { term: "Owner / editor / viewer", def: "Nested permissions. Owner implies edit and view; the higher relation is a userset of the lower." },
    { term: "Read API wildcards", def: "Optional source, relation, destination. One RPC shape for exists, list-relations, who-has-access, and what-can-I-see." },
    { term: "Spanner timestamp", def: "Globally ordered TrueTime commit time. Reads after a write's timestamp must see that write." },
    { term: "Consistency token / zookie", def: "Client-held snapshot time so a later check cannot go backward relative to a grant the user already saw." },
    { term: "Five nines", def: "~10 minutes of downtime per year. An auth outage is treated as a Google-wide outage." }
  ],

  tradeoffs: [
    { pro: "One tuple language and one service for every Google product that shares objects.", con: "A Zanzibar outage or a bad relation config is a company-wide auth incident." },
    { pro: "Usersets and group edges avoid a row per member on every document.", con: "Check becomes graph expansion; huge or nested groups need extra indexes and hedging." },
    { pro: "Wildcard Read covers check, expand, and listing without extra APIs.", con: "A wide \"who can see this\" on a viral doc is an expensive fan-out you must bound." },
    { pro: "Spanner timestamps give a precise happens-before for grants without locking all ACLs.", con: "Clients must pass timestamps/zookies; ignoring them reintroduces the share-then-404 race." },
    { pro: "Read-mostly + snapshot reads hit tens of milliseconds at millions of QPS.", con: "Fresh, globally consistent checks after a write pay TrueTime and replica round trips." }
  ],

  interviewTips: [
    "Start from Drive sharing: viewer/editor/owner, then say why a SQL ACL table fails at trillions of rows and millions of QPS.",
    "Write one tuple on the whiteboard: doc#edit@eng and eng#member@gaurav, then expand the check tree.",
    "Quote tens of milliseconds on the check path and ~500ms as the whole document-get budget.",
    "Availability: five nines, fail-closed vs fail-open, auth is on the critical path of Google.",
    "Explain Read wildcards instead of inventing four microservices (check, expand, list-users, list-objects).",
    "Consistency: write at T, read at T'>T must see it; Spanner TrueTime is the clock; send the zookie."
  ],

  scene: {
    nodes: [
      { id: "zgraph", label: "ACL graph", type: "zone", pos: [-4, 0, -3], size: [16, 12] },

      { id: "drive", label: "Drive client", type: "user", pos: [-8, 0, -6] },
      { id: "doc", label: "Doc 1", type: "storage", pos: [0, 0, -6] },
      { id: "obama", label: "Obama", type: "user", pos: [-8, 0, 0] },
      { id: "eng", label: "eng group", type: "service", pos: [0, 0, 0] },
      { id: "gav", label: "Gaurav", type: "user", pos: [-8, 0, 5] },
      { id: "zb", label: "Zanzibar", type: "gateway", pos: [6, 0, 0] },
      { id: "span", label: "Spanner", type: "db", pos: [6, 0, 5] },
      { id: "owner", label: "owner", type: "point", pos: [0, 0, 5], showAt: 1 },

      { id: "n0", label: "Viewer ⊂ editor ⊂ owner", type: "note", pos: [8, 4, -7] },
      { id: "n1", label: "Trillions of ACL tuples", type: "note", pos: [-11, 4, -7], showAt: 1 },
      { id: "n2", label: "Tens of ms, 1M+ QPS", type: "note", pos: [11, 4, 2], showAt: 2 },
      { id: "n3", label: "99.999% / 10 min/year", type: "note", pos: [-11, 4, 7], showAt: 2 },
      { id: "n4", label: "object#rel@user", type: "note", pos: [11, 4, 7], showAt: 3 },
      { id: "n5", label: "Expand groups as a tree", type: "note", pos: [3, 4, -7], showAt: 4 },
      { id: "n6", label: "Read wildcards", type: "note", pos: [-3, 4, 7], showAt: 5 },
      { id: "n7", label: "Write@T visible if t>T", type: "note", pos: [11, 4, -2], showAt: 7 }
    ],
    edges: [
      { from: "drive", to: "doc", label: "open", showAt: 0 },
      { from: "obama", to: "doc", label: "edit", showAt: 3 },
      { from: "eng", to: "doc", label: "edit", showAt: 3 },
      { from: "gav", to: "eng", label: "member", showAt: 3 },
      { from: "owner", to: "doc", label: "owns", showAt: 1, dashed: true },
      { from: "drive", to: "zb", label: "check", showAt: 2 },
      { from: "zb", to: "span", label: "tuples", showAt: 3 },
      { from: "zb", to: "eng", label: "expand", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Share by link",
        text: "Drive and Docs expose viewer, editor, and owner. Owner can edit, view, and delete. Higher permissions include the lower ones, so a single owner edge is enough to authorize a view.",
        highlight: ["drive", "doc", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "drive", to: "doc", color: "#60a5fa", label: "view?" }
        ]
      },
      {
        title: "The table that will not fit",
        text: "Trillions of ACL rows, terabytes on disk, billions of users, trillions of objects (many script-generated). A primary-key get against one table is the wrong mental model. This is a giant directed graph, in the same league as TAO.",
        highlight: ["doc", "obama", "gav", "eng", "n1"],
        hide: ["n0", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "obama", to: "doc", color: "#fb923c", label: "ACL" },
          { from: "gav", to: "doc", color: "#fb923c", label: "ACL" }
        ]
      },
      {
        title: "Latency and five nines",
        text: "A document get has about 500ms. Authorization must finish in tens of milliseconds at millions of QPS. If Zanzibar is down, Google is down. The budget is ~10 minutes a year (99.999%). Over 99% of calls are reads.",
        highlight: ["drive", "zb", "n2", "n3"],
        fail: ["zb"],
        hide: ["n0", "n1", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "drive", to: "zb", color: "#f87171", label: "check" }
        ]
      },
      {
        title: "Tuples are edges",
        text: "One line encodes an edge: doc#edit@eng and org/engineering#member@gaurav. Namespace keeps IDs unique. After @ is the source; before # is the object; between them is the relation. The graph is a pile of these tuples in Spanner.",
        highlight: ["doc", "eng", "gav", "obama", "zb", "span", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5", "n6", "n7"],
        flows: [
          { from: "gav", to: "eng", color: "#4ade80", label: "member" },
          { from: "eng", to: "doc", color: "#4ade80", label: "edit" },
          { from: "zb", to: "span", color: "#c084fc", label: "store" }
        ]
      },
      {
        title: "Check expands groups",
        text: "Gaurav asks to view. Zanzibar walks incoming edges on the doc. A direct user hit is yes. A group hit expands member lists and recurses. Authorization is reachability on that tree, not a single-row lookup.",
        highlight: ["gav", "eng", "doc", "zb", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n6", "n7"],
        flows: [
          { from: "drive", to: "zb", color: "#60a5fa", label: "view?" },
          { from: "zb", to: "eng", color: "#fb923c", label: "expand" },
          { from: "eng", to: "gav", color: "#4ade80", label: "member?" }
        ]
      },
      {
        title: "One Read, many wildcards",
        text: "Pass source, relation, destination, timestamp. All set: boolean check. Relation omitted: every edge between two nodes. Only the object: who has access. Only the user: what can they see. That shape is almost all of production traffic.",
        highlight: ["zb", "doc", "gav", "eng", "n6"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n7"],
        flows: [
          { from: "drive", to: "zb", color: "#60a5fa", label: "Read *" },
          { from: "zb", to: "doc", color: "#60a5fa", label: "who?" }
        ]
      },
      {
        title: "Write is a tuple",
        text: "Granting edit to user A on document D is one write: source, relation, destination. No multi-row transaction in the product API. Groups keep you from copying the grant onto every member.",
        highlight: ["drive", "zb", "span", "obama", "doc"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7"],
        flows: [
          { from: "drive", to: "zb", color: "#4ade80", label: "Write" },
          { from: "zb", to: "span", color: "#4ade80", label: "tuple" },
          { from: "obama", to: "doc", color: "#4ade80", label: "edit" }
        ]
      },
      {
        title: "Spanner time orders grants",
        text: "A write at timestamp 100 must appear in any read with t > 100. A read with t < 100 may miss it. Spanner TrueTime is the global clock. Clients carry that timestamp so \"I just shared this\" cannot lose to a check on another continent.",
        highlight: ["zb", "span", "drive", "n7"],
        hide: ["n0", "n1", "n2", "n3", "n4", "n5", "n6"],
        flows: [
          { from: "zb", to: "span", color: "#4ade80", label: "write T=100" },
          { from: "drive", to: "zb", color: "#60a5fa", label: "read t>100" },
          { from: "zb", to: "drive", color: "#60a5fa", label: "allow" }
        ]
      }
    ]
  }
});
