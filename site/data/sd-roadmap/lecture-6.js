window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 6,
  title: "Indexes, Query Plans, and Cursor Pagination",
  video: "",
  category: "Data Modeling",
  tagline: "Read EXPLAIN before adding indexes; page with a cursor, not OFFSET 50000.",
  summary: "An index is a maintained B-tree (usually) that turns a sequential scan into a range lookup. It speeds the reads you actually filter on and slows every write that must update it. Query plans (EXPLAIN ANALYZE in Postgres) show whether Hibernate's SQL used the index or guessed a seq scan. OFFSET pagination looks like Spring Data's Pageable and then scans and discards 50,000 rows. Cursor (keyset) pagination using (created_at, id) is the stable pattern for feeds and admin lists.",

  theory: [
    {
      heading: "What an index actually is",
      body: "A B-tree index is a sorted copy of selected columns plus a pointer to the heap row. Equality and range predicates on a left-prefix of that key can binary-search instead of reading the table. Postgres also has hash, GIN (JSONB/arrays), GiST, and BRIN (very large append-only time data). Each secondary index is updated on INSERT/UPDATE/DELETE of those columns — write amplification. In Spring you do not 'add an index in JPA'; you add it in Flyway and confirm with EXPLAIN.",
      bullets: [
        "Left-prefix: index (status, created_at) helps WHERE status=? and that plus created_at, not created_at alone.",
        "Covering / INCLUDE columns can avoid a heap fetch for hot list queries.",
        "Unique indexes are both integrity and a lookup path (email login)."
      ]
    },
    {
      heading: "Selectivity, and when not to index",
      body: "An index on a boolean is_deleted that is 99% false will not be used — the planner prefers a seq scan. Small tables get seq scans too; that is correct. Partial indexes (WHERE status = 'OPEN') keep the tree tiny for the hot slice. Expression indexes help LOWER(email). Do not index every column 'just in case'; you pay at write time and confuse the planner with correlated options.",
      bullets: [
        "Run ANALYZE so statistics match reality after a big backfill.",
        "A composite index that matches ORDER BY can skip a sort.",
        "Function-wrapping the column (WHERE DATE(created_at)=) disables the index unless you indexed the expression."
      ]
    },
    {
      heading: "Read the plan, not the rumor",
      body: "<code>EXPLAIN (ANALYZE, BUFFERS)</code> is the source of truth: Seq Scan vs Index Scan vs Bitmap Heap Scan, actual rows vs estimates, sort nodes, nested loops vs hash joins. Hibernate's SQL (show-sql or p6spy) is what you paste. If the estimate is 10 rows and actual is 2 million, statistics or a bad join order is the bug. Spring Data derived queries can emit <code>IN (...)</code> lists that the planner hates; batch them. Avoid <code>FindAll()</code> on a 20M table regardless of indexes.",
      bullets: [
        "Look at actual time, not cost, once ANALYZE is on.",
        "Nested loop + wrong estimate is a classic timeout.",
        "pg_stat_statements finds the real hot queries after you ship."
      ]
    },
    {
      heading: "N+1 is a plan you accidentally wrote",
      body: "Lazy <code>@OneToMany</code> plus a loop in the service is 1 + N selects. An index on order_id makes each of those N fast — and still wrong. Fix with join fetch, <code>@EntityGraph</code>, or a dedicated query that returns a DTO. DataLoader from lecture 4 is the GraphQL version of the same bug. Indexes do not cure chatty ORMs; they hide the bill until traffic grows.",
      bullets: [
        "open-in-view=true extends the session into the view layer and multiplies lazy loads.",
        "Batch size (hibernate.default_batch_fetch_size) is a tourniquet, not a model."
      ]
    },
    {
      heading: "OFFSET pagination is a tax",
      body: "Spring Data <code>PageRequest.of(500, 20)</code> becomes <code>LIMIT 20 OFFSET 10000</code>. Postgres still walks 10,020 index entries (or worse) and throws 10,000 away. Page 5000 of a feed is both slow and unstable: inserts shift the window so clients skip or duplicate rows. Total-count queries (<code>SELECT COUNT(*)</code>) double the pain. Use OFFSET only for small, stable admin tables where humans jump to page 3.",
      bullets: [
        "UI page numbers map to OFFSET; infinite scroll should not.",
        "COUNT(*) on a live table is often a sequential scan of visibility maps."
      ]
    },
    {
      heading: "Cursor (keyset) pagination",
      body: "Keep the last seen sort key: <code>WHERE (created_at, id) &lt; (:ts, :id) ORDER BY created_at DESC, id DESC LIMIT 20</code>. That predicate is sargable on a matching composite index. The cursor is opaque to the client (Base64 of the pair). No skipped rows when a new order arrives. Spring Data has <code>Slice</code> (no count) and you can write the keyset query by hand. Seek-method / keyset is the same idea as gRPC stream cursors and GraphQL connections (after/first).",
      bullets: [
        "Tie-break with id so two rows with the same timestamp do not loop.",
        "Do not encrypt the cursor if you do not need to; do sign it if it carries authz filters.",
        "Jumping to 'page 50' is the one thing keyset cannot do cheaply — and feeds should not offer it."
      ]
    }
  ],

  keyTerms: [
    { term: "B-tree index", def: "Sorted tree on a key prefix. Default index in Postgres and the one interviews mean." },
    { term: "Left-prefix rule", def: "A composite index (a,b) serves a and a+b predicates, not b alone." },
    { term: "EXPLAIN ANALYZE", def: "Postgres plan plus actual row counts and times. The argument-ender." },
    { term: "Seq scan", def: "Read the table in heap order. Cheap for small or unselective queries; deadly for large selective ones." },
    { term: "N+1", def: "One query plus one per child row, usually from lazy ORM associations in a loop." },
    { term: "OFFSET pagination", def: "Skip N rows then take K. Cost grows with N; concurrent writes shuffle pages." },
    { term: "Cursor / keyset", def: "WHERE sortkey < last ORDER BY sortkey LIMIT K, backed by a matching index." },
    { term: "Slice", def: "Spring Data page without a total count — closer to a cursor than Page." }
  ],

  tradeoffs: [
    { pro: "The right composite index turns a timeout into a 2 ms lookup.", con: "Every extra index slows INSERT/UPDATE and can confuse the planner." },
    { pro: "Partial indexes stay small for a hot status slice.", con: "Queries that drop the WHERE clause cannot use them." },
    { pro: "OFFSET maps to numbered pages humans understand.", con: "Deep pages scan and discard; live inserts duplicate or skip rows." },
    { pro: "Keyset pagination is stable and index-friendly for feeds.", con: "You cannot cheaply jump to page 50 or show a reliable total count." }
  ],

  interviewTips: [
    "Before adding an index, say which WHERE and ORDER BY it matches — left-prefix included.",
    "Offer EXPLAIN ANALYZE as the way you would verify, not 'I'd add indexes.'",
    "If you use JPA, name N+1 and join fetch / DTO query as the fix, not a faster disk.",
    "Reject Offset-based infinite scroll. Draw (created_at, id) and LIMIT.",
    "Mention write amplification if they ask you to index every filter checkbox.",
    "Spring Data Page vs Slice is a good trivia tell that you have shipped list APIs."
  ],

  scene: {
    nodes: [
      { id: "app", label: "Order API", type: "server", pos: [-10, 0, 0] },
      { id: "phone", label: "Feed client", type: "phone", pos: [-10, 0, -4] },
      { id: "heap", label: "orders heap", type: "db", pos: [2, 0, 0] },
      { id: "idx", label: "idx(status,ts,id)", type: "cache", pos: [2, 0, -5], showAt: 1 },
      { id: "n_seq", label: "Seq scan 20M rows", type: "note", pos: [2, 3.4, 6.5] },
      { id: "n_idx", label: "Index range scan", type: "note", pos: [2, 3.4, -7.5], showAt: 1 },
      { id: "plan", label: "EXPLAIN ANALYZE", type: "note", pos: [8, 3.4, -7.5], showAt: 2 },
      { id: "n1", label: "1+N lazy items", type: "note", pos: [8, 3.4, 6.5], showAt: 3 },
      { id: "items", label: "order_items", type: "db", pos: [8, 0, 0], showAt: 3 },
      { id: "off", label: "OFFSET 10000", type: "worker", pos: [8, 0, -5], showAt: 4 },
      { id: "n_off", label: "Walk 10020, drop 10000", type: "note", pos: [-10, 3.4, 6.5], showAt: 4 },
      { id: "cur", label: "cursor ts,id", type: "point", pos: [8, 0, 4], showAt: 6 },
      { id: "n_cur", label: "(ts,id) < last LIMIT 20", type: "note", pos: [-10, 3.4, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "phone", to: "app" },
      { from: "app", to: "heap", label: "SELECT" },
      { from: "app", to: "idx", showAt: 1 },
      { from: "idx", to: "heap", showAt: 1, dashed: true },
      { from: "app", to: "items", label: "N+1", showAt: 3, dashed: true },
      { from: "app", to: "off", showAt: 4 },
      { from: "off", to: "idx", showAt: 4 },
      { from: "app", to: "cur", showAt: 6 },
      { from: "cur", to: "idx", showAt: 6 }
    ],
    steps: [
      {
        title: "No index, seq scan",
        text: "WHERE status='OPEN' ORDER BY created_at DESC on 20 million orders reads the heap. The API thread waits. EXPLAIN would already show Seq Scan; we did not look.",
        highlight: ["phone", "app", "heap", "n_seq"],
        flows: [
          { from: "phone", to: "app", color: "#4ade80", label: "list" },
          { from: "app", to: "heap", color: "#f87171", label: "seq scan" }
        ]
      },
      {
        title: "Composite index matches the query",
        text: "Flyway adds (status, created_at DESC, id DESC). The left prefix matches the filter; the rest matches ORDER BY. Writes now maintain this tree too.",
        highlight: ["idx", "heap", "n_idx", "app"],
        flows: [
          { from: "app", to: "idx", color: "#4ade80", label: "range" },
          { from: "idx", to: "heap", color: "#60a5fa", label: "heap fetch" }
        ]
      },
      {
        title: "EXPLAIN ANALYZE is the referee",
        text: "The plan shows Index Scan, actual rows close to estimates, no surprise Sort. If estimates were off by 1000x we would ANALYZE or rewrite the join — not add a fifth index.",
        highlight: ["plan", "idx", "heap", "app"],
        flows: [
          { from: "app", to: "idx", color: "#c084fc", label: "plan" }
        ]
      },
      {
        title: "N+1: fast index, wrong number of queries",
        text: "Each order lazily loads items. Twenty extra SELECTs, all indexed on order_id, still a round-trip storm. Join fetch or a DTO query; do not celebrate the index.",
        highlight: ["app", "heap", "items", "n1"],
        flows: [
          { from: "app", to: "heap", color: "#4ade80", label: "orders" },
          { from: "app", to: "items", color: "#f87171", label: "×20" }
        ]
      },
      {
        title: "OFFSET 10000 walks and discards",
        text: "PageRequest page 500 still uses the index — then throws away 10,000 entries. A write in the middle shifts the window. COUNT(*) for total pages is a second tax.",
        highlight: ["app", "off", "idx", "n_off"],
        flows: [
          { from: "app", to: "off", color: "#fb923c", label: "page 500" },
          { from: "off", to: "idx", color: "#f87171", label: "skip 10k" }
        ]
      },
      {
        title: "Live insert shuffles OFFSET pages",
        text: "A new OPEN order lands at the top. The client's page 2 now overlaps page 1. Feeds duplicate or skip. OFFSET is the wrong abstraction for a live list.",
        highlight: ["heap", "off", "phone", "idx"],
        flows: [
          { from: "app", to: "heap", color: "#4ade80", label: "INSERT" },
          { from: "off", to: "phone", color: "#f87171", label: "dup row" }
        ]
      },
      {
        title: "Cursor seeks the next 20",
        text: "Client sends the last (created_at, id). SQL: WHERE (created_at, id) < last ORDER BY ... LIMIT 20. The composite index seeks. New inserts above the cursor do not reshuffle this page.",
        highlight: ["phone", "app", "cur", "idx", "n_cur"],
        flows: [
          { from: "phone", to: "app", color: "#4ade80", label: "cursor" },
          { from: "app", to: "cur", color: "#60a5fa", label: "ts,id" },
          { from: "cur", to: "idx", color: "#4ade80", label: "seek" }
        ]
      },
      {
        title: "Slice, no COUNT(*), done",
        text: "Spring Data Slice (or a handmade keyset query) returns 20 rows and a next-cursor. No total count. Infinite scroll is honest. Numbered admin pages can keep OFFSET on a tiny table.",
        highlight: ["phone", "app", "cur", "idx", "n_cur"],
        flows: [
          { from: "idx", to: "app", color: "#60a5fa", label: "20 rows" },
          { from: "app", to: "phone", color: "#60a5fa", label: "next cursor" }
        ]
      }
    ]
  }
});
